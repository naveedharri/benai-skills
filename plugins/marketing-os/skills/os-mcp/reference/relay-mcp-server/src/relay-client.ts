import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import WebSocket from "ws";
import PocketBase from "pocketbase";
import { RELAY_API_URL, RELAY_ID, PB_AUTH_URL } from "./config.js";

// Polyfill WebSocket for Node.js (y-websocket expects global WebSocket)
(globalThis as any).WebSocket = WebSocket;

interface ClientToken {
  url: string;
  baseUrl?: string;
  docId: string;
  token: string;
  authorization?: "full" | "read-only";
  expiryTime?: number;
}

async function getDocToken(authToken: string, relayId: string, docId: string, folderGuid: string): Promise<ClientToken> {
  if (!authToken) throw new Error("Relay auth token is required (OAuth session or RELAY_AUTH_TOKEN)");
  const url = `${RELAY_API_URL}/token`;

  console.log(`[getDocToken] POST ${url} docId=${docId.slice(0, 8)}...`);

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json",
        "Relay-Version": "1.1.0",
      },
      body: JSON.stringify({
        docId,
        relay: relayId,
        folder: folderGuid,
      }),
    });
  } catch (err: any) {
    console.error(`[getDocToken] fetch error:`, err.message, err.cause);
    throw new Error(`Failed to reach Relay API at ${url}: ${err.message}`);
  }

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Token request failed (${response.status}): ${errBody}`);
  }

  return await response.json() as ClientToken;
}

function connectYDoc(clientToken: ClientToken, timeoutMs = 10000): Promise<{ doc: Y.Doc; provider: WebsocketProvider }> {
  return new Promise((resolve, reject) => {
    const doc = new Y.Doc();
    const timer = setTimeout(() => {
      provider.destroy();
      doc.destroy();
      reject(new Error(`WebSocket sync timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    const provider = new WebsocketProvider(
      clientToken.url,
      clientToken.docId,
      doc,
      {
        connect: true,
        params: { token: clientToken.token },
        WebSocketPolyfill: WebSocket as any,
        disableBc: true,
      }
    );

    provider.on("sync", (synced: boolean) => {
      if (synced) {
        clearTimeout(timer);
        resolve({ doc, provider });
      }
    });

    provider.on("connection-error", (event: any) => {
      clearTimeout(timer);
      provider.destroy();
      doc.destroy();
      reject(new Error(`WebSocket connection error: ${event?.message || "unknown"}`));
    });
  });
}

// --- Runtime discovery via PocketBase ---
//
// The MCP discovers both the user's relay (vault) AND its folders at runtime
// via PocketBase, so the only deploy-time config required is auth (Railway
// token + JWT_SECRET). RELAY_ID env var is an OPTIONAL override for users
// who want to pin a specific relay.

const DISCOVERY_TTL_MS = 5 * 60 * 1000;

interface RelayInfo {
  id: string;        // PocketBase record id
  guid: string;      // user-facing UUID
  name: string;
}

interface RelayCacheEntry { byGuid: Record<string, RelayInfo>; ts: number }
interface FolderCacheEntry { byName: Record<string, string>; ts: number }

const relayCache = new Map<string, RelayCacheEntry>();
const folderCache = new Map<string, FolderCacheEntry>();

function cacheKey(pbToken: string): string {
  return pbToken.slice(-32);
}

async function discoverRelays(pbToken: string): Promise<Record<string, RelayInfo>> {
  const key = cacheKey(pbToken);
  const cached = relayCache.get(key);
  if (cached && Date.now() - cached.ts < DISCOVERY_TTL_MS) return cached.byGuid;

  const pb = new PocketBase(PB_AUTH_URL);
  pb.authStore.save(pbToken, null);

  // PB row-level rules scope this to relays the authenticated user can see.
  const records = await pb.collection("relays").getFullList();
  const byGuid: Record<string, RelayInfo> = {};
  for (const r of records as any[]) {
    if (r.guid) byGuid[r.guid] = { id: r.id, guid: r.guid, name: r.name || "" };
  }

  relayCache.set(key, { byGuid, ts: Date.now() });
  return byGuid;
}

export async function resolveRelayId(pbToken: string): Promise<string> {
  // Env override wins — but validate it's actually accessible.
  if (RELAY_ID) {
    const relays = await discoverRelays(pbToken);
    if (!relays[RELAY_ID]) {
      const accessible = Object.keys(relays).join(", ") || "(none)";
      throw new Error(
        `Configured RELAY_ID="${RELAY_ID}" is not accessible to the authenticated user. Accessible relay GUIDs: ${accessible}`
      );
    }
    return RELAY_ID;
  }
  // Auto-pick.
  const relays = await discoverRelays(pbToken);
  const guids = Object.keys(relays);
  if (guids.length === 0) {
    throw new Error("No Relay vaults found for this user. Create one in your Relay.md Obsidian plugin first.");
  }
  if (guids.length === 1) return guids[0];
  console.log(
    `[resolveRelayId] User has ${guids.length} relays; auto-picking the first ("${relays[guids[0]].name}", ${guids[0]}). Set RELAY_ID env to pin a specific one.`
  );
  return guids[0];
}

export async function listAccessibleRelays(pbToken: string): Promise<RelayInfo[]> {
  const relays = await discoverRelays(pbToken);
  return Object.values(relays);
}

async function discoverFolders(pbToken: string, relayGuid: string): Promise<Record<string, string>> {
  const key = `${relayGuid}:${cacheKey(pbToken)}`;
  const cached = folderCache.get(key);
  if (cached && Date.now() - cached.ts < DISCOVERY_TTL_MS) return cached.byName;

  const pb = new PocketBase(PB_AUTH_URL);
  pb.authStore.save(pbToken, null);

  // shared_folders.relay is a PB relation to relays.id (15-char PB record id),
  // NOT the relay's guid. We can't filter by guid server-side, so we fetch all
  // (PB rules scope to what the user can see), expand the relay, and filter
  // client-side by guid match.
  const records = await pb.collection("shared_folders").getFullList({
    expand: "relay",
  });

  const byName: Record<string, string> = {};
  for (const r of records as any[]) {
    if (r.expand?.relay?.guid !== relayGuid) continue;
    if (r.name && r.guid) byName[r.name] = r.guid;
  }

  folderCache.set(key, { byName, ts: Date.now() });
  return byName;
}

function isGuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

async function resolveFolderGuid(authToken: string, relayId: string, folderName: string): Promise<string> {
  if (isGuid(folderName)) return folderName;
  const folders = await discoverFolders(authToken, relayId);
  const guid = folders[folderName];
  if (!guid) {
    const available = Object.keys(folders).join(", ") || "(no folders found in this relay)";
    throw new Error(`Unknown folder "${folderName}". Available: ${available}`);
  }
  return guid;
}

function readSyncStore(doc: Y.Doc): Map<string, string> {
  const result = new Map<string, string>();

  // Try current format first: filemeta_v0
  const filemeta = doc.getMap("filemeta_v0");
  if (filemeta.size > 0) {
    filemeta.forEach((value: any, key: string) => {
      if (value && typeof value === "object") {
        // Y.Map entries or plain objects
        const meta = value instanceof Y.Map ? Object.fromEntries(value.entries()) : value;
        if (meta.id) {
          result.set(key, meta.id);
        }
      } else if (typeof value === "string") {
        result.set(key, value);
      }
    });
  }

  // Fall back to legacy format: docs
  const legacy = doc.getMap("docs");
  if (legacy.size > 0) {
    legacy.forEach((value: any, key: string) => {
      if (!result.has(key) && typeof value === "string") {
        result.set(key, value);
      }
    });
  }

  return result;
}

export async function listFiles(authToken: string, folderName: string): Promise<Array<{ path: string; docId: string }>> {
  const relayId = await resolveRelayId(authToken);
  const folderGuid = await resolveFolderGuid(authToken, relayId, folderName);
  const clientToken = await getDocToken(authToken, relayId, folderGuid, folderGuid);
  const { doc, provider } = await connectYDoc(clientToken);

  try {
    const syncStore = readSyncStore(doc);
    const files: Array<{ path: string; docId: string }> = [];
    syncStore.forEach((docId, path) => {
      files.push({ path, docId });
    });
    return files.sort((a, b) => a.path.localeCompare(b.path));
  } finally {
    provider.destroy();
    doc.destroy();
  }
}

export async function readFile(authToken: string, folderName: string, filePath: string): Promise<string> {
  const relayId = await resolveRelayId(authToken);
  const folderGuid = await resolveFolderGuid(authToken, relayId, folderName);

  const folderToken = await getDocToken(authToken, relayId, folderGuid, folderGuid);
  const { doc: folderDoc, provider: folderProvider } = await connectYDoc(folderToken);

  let fileDocId: string;
  try {
    const syncStore = readSyncStore(folderDoc);
    const docId = syncStore.get(filePath);
    if (!docId) {
      const available = Array.from(syncStore.keys()).slice(0, 20).join(", ");
      throw new Error(`File "${filePath}" not found in folder "${folderName}". Some files: ${available}`);
    }
    fileDocId = docId;
  } finally {
    folderProvider.destroy();
    folderDoc.destroy();
  }

  const fileToken = await getDocToken(authToken, relayId, fileDocId, folderGuid);
  const { doc: fileDoc, provider: fileProvider } = await connectYDoc(fileToken);

  try {
    const content = fileDoc.getText("contents").toString();
    return content;
  } finally {
    fileProvider.destroy();
    fileDoc.destroy();
  }
}

export async function writeFile(authToken: string, folderName: string, filePath: string, content: string): Promise<void> {
  const relayId = await resolveRelayId(authToken);
  const folderGuid = await resolveFolderGuid(authToken, relayId, folderName);

  const folderToken = await getDocToken(authToken, relayId, folderGuid, folderGuid);
  const { doc: folderDoc, provider: folderProvider } = await connectYDoc(folderToken);

  let fileDocId: string;
  try {
    const syncStore = readSyncStore(folderDoc);
    const existingDocId = syncStore.get(filePath);

    if (existingDocId) {
      fileDocId = existingDocId;
    } else {
      fileDocId = crypto.randomUUID();

      folderDoc.transact(() => {
        const docsMap = folderDoc.getMap("docs");
        docsMap.set(filePath, fileDocId);

        const filemetaMap = folderDoc.getMap("filemeta_v0");
        filemetaMap.set(filePath, { id: fileDocId, type: "markdown", version: 0 });
      });

      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  } finally {
    folderProvider.destroy();
    folderDoc.destroy();
  }

  const fileToken = await getDocToken(authToken, relayId, fileDocId, folderGuid);
  const { doc: fileDoc, provider: fileProvider } = await connectYDoc(fileToken);

  try {
    const ytext = fileDoc.getText("contents");
    fileDoc.transact(() => {
      if (ytext.length > 0) {
        ytext.delete(0, ytext.length);
      }
      ytext.insert(0, content);
    });

    await new Promise(resolve => setTimeout(resolve, 1500));
  } finally {
    fileProvider.destroy();
    fileDoc.destroy();
  }
}

export async function updateFile(
  authToken: string,
  folderName: string,
  filePath: string,
  oldString: string,
  newString: string,
  replaceAll: boolean = false,
): Promise<{ replacements: number }> {
  if (!oldString) {
    throw new Error("old_string cannot be empty. Use vault_append to add to the end of a file, or vault_write to create/overwrite.");
  }

  const relayId = await resolveRelayId(authToken);
  const folderGuid = await resolveFolderGuid(authToken, relayId, folderName);

  const folderToken = await getDocToken(authToken, relayId, folderGuid, folderGuid);
  const { doc: folderDoc, provider: folderProvider } = await connectYDoc(folderToken);

  let fileDocId: string;
  try {
    const syncStore = readSyncStore(folderDoc);
    const docId = syncStore.get(filePath);
    if (!docId) {
      throw new Error(`File "${filePath}" not found in folder "${folderName}". Use vault_write to create it first.`);
    }
    fileDocId = docId;
  } finally {
    folderProvider.destroy();
    folderDoc.destroy();
  }

  const fileToken = await getDocToken(authToken, relayId, fileDocId, folderGuid);
  const { doc: fileDoc, provider: fileProvider } = await connectYDoc(fileToken);

  let replacements = 0;
  try {
    const ytext = fileDoc.getText("contents");
    const content = ytext.toString();

    // Find all occurrences up front (we'll edit back-to-front to keep offsets stable).
    const offsets: number[] = [];
    let pos = content.indexOf(oldString);
    while (pos !== -1) {
      offsets.push(pos);
      pos = content.indexOf(oldString, pos + oldString.length);
    }

    if (offsets.length === 0) {
      throw new Error(`old_string not found in "${filePath}".`);
    }
    if (offsets.length > 1 && !replaceAll) {
      throw new Error(`old_string matches ${offsets.length} places in "${filePath}". Provide more surrounding context to make it unique, or set replace_all=true.`);
    }

    fileDoc.transact(() => {
      for (let i = offsets.length - 1; i >= 0; i--) {
        ytext.delete(offsets[i], oldString.length);
        ytext.insert(offsets[i], newString);
      }
    });
    replacements = offsets.length;

    await new Promise(resolve => setTimeout(resolve, 1500));
  } finally {
    fileProvider.destroy();
    fileDoc.destroy();
  }

  return { replacements };
}

export async function appendFile(
  authToken: string,
  folderName: string,
  filePath: string,
  content: string,
): Promise<{ created: boolean; bytesAppended: number }> {
  const relayId = await resolveRelayId(authToken);
  const folderGuid = await resolveFolderGuid(authToken, relayId, folderName);

  const folderToken = await getDocToken(authToken, relayId, folderGuid, folderGuid);
  const { doc: folderDoc, provider: folderProvider } = await connectYDoc(folderToken);

  let fileDocId: string;
  let created = false;
  try {
    const syncStore = readSyncStore(folderDoc);
    const existingDocId = syncStore.get(filePath);

    if (existingDocId) {
      fileDocId = existingDocId;
    } else {
      fileDocId = crypto.randomUUID();
      created = true;

      folderDoc.transact(() => {
        const docsMap = folderDoc.getMap("docs");
        docsMap.set(filePath, fileDocId);

        const filemetaMap = folderDoc.getMap("filemeta_v0");
        filemetaMap.set(filePath, { id: fileDocId, type: "markdown", version: 0 });
      });

      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  } finally {
    folderProvider.destroy();
    folderDoc.destroy();
  }

  const fileToken = await getDocToken(authToken, relayId, fileDocId, folderGuid);
  const { doc: fileDoc, provider: fileProvider } = await connectYDoc(fileToken);

  try {
    const ytext = fileDoc.getText("contents");
    fileDoc.transact(() => {
      ytext.insert(ytext.length, content);
    });

    await new Promise(resolve => setTimeout(resolve, 1500));
  } finally {
    fileProvider.destroy();
    fileDoc.destroy();
  }

  return { created, bytesAppended: content.length };
}

export async function deleteFile(authToken: string, folderName: string, filePath: string): Promise<void> {
  const relayId = await resolveRelayId(authToken);
  const folderGuid = await resolveFolderGuid(authToken, relayId, folderName);

  const folderToken = await getDocToken(authToken, relayId, folderGuid, folderGuid);
  const { doc: folderDoc, provider: folderProvider } = await connectYDoc(folderToken);

  try {
    const syncStore = readSyncStore(folderDoc);
    if (!syncStore.has(filePath)) {
      throw new Error(`File "${filePath}" not found in folder "${folderName}".`);
    }

    folderDoc.transact(() => {
      const docsMap = folderDoc.getMap("docs");
      docsMap.delete(filePath);

      const filemetaMap = folderDoc.getMap("filemeta_v0");
      filemetaMap.delete(filePath);
    });

    await new Promise(resolve => setTimeout(resolve, 1500));
  } finally {
    folderProvider.destroy();
    folderDoc.destroy();
  }
}

export async function moveFile(
  authToken: string, folderName: string, oldPath: string, newPath: string
): Promise<void> {
  const relayId = await resolveRelayId(authToken);
  const folderGuid = await resolveFolderGuid(authToken, relayId, folderName);

  const folderToken = await getDocToken(authToken, relayId, folderGuid, folderGuid);
  const { doc: folderDoc, provider: folderProvider } = await connectYDoc(folderToken);

  try {
    const docsMap = folderDoc.getMap("docs");
    const filemetaMap = folderDoc.getMap("filemeta_v0");

    const docId = docsMap.get(oldPath) as string | undefined;
    const meta = filemetaMap.get(oldPath);

    if (!docId && !meta) {
      throw new Error(`File "${oldPath}" not found in folder "${folderName}".`);
    }

    folderDoc.transact(() => {
      if (docId) {
        docsMap.delete(oldPath);
        docsMap.set(newPath, docId);
      }
      if (meta) {
        filemetaMap.delete(oldPath);
        filemetaMap.set(newPath, meta);
      }
    });

    await new Promise(resolve => setTimeout(resolve, 1500));
  } finally {
    folderProvider.destroy();
    folderDoc.destroy();
  }
}

export async function searchFiles(
  authToken: string, folderName: string, query: string
): Promise<Array<{ path: string; snippet: string }>> {
  const relayId = await resolveRelayId(authToken);
  const folderGuid = await resolveFolderGuid(authToken, relayId, folderName);
  const folderToken = await getDocToken(authToken, relayId, folderGuid, folderGuid);
  const { doc: folderDoc, provider: folderProvider } = await connectYDoc(folderToken);

  let files: Map<string, string>;
  try {
    files = readSyncStore(folderDoc);
  } finally {
    folderProvider.destroy();
    folderDoc.destroy();
  }

  const queryLower = query.toLowerCase();
  const results: Array<{ path: string; snippet: string }> = [];

  for (const [path] of files) {
    if (path.toLowerCase().includes(queryLower)) {
      results.push({ path, snippet: "(filename match)" });
    }
  }

  const contentSearchLimit = 20;
  let searched = 0;
  for (const [path, docId] of files) {
    if (searched >= contentSearchLimit) break;
    if (results.some(r => r.path === path)) continue;

    try {
      const fileToken = await getDocToken(authToken, relayId, docId, folderGuid);
      const { doc: fileDoc, provider: fileProvider } = await connectYDoc(fileToken, 5000);

      try {
        const content = fileDoc.getText("contents").toString();
        const idx = content.toLowerCase().indexOf(queryLower);
        if (idx !== -1) {
          const start = Math.max(0, idx - 50);
          const end = Math.min(content.length, idx + query.length + 50);
          results.push({ path, snippet: content.slice(start, end).replace(/\n/g, " ") });
        }
      } finally {
        fileProvider.destroy();
        fileDoc.destroy();
      }
      searched++;
    } catch {
      // Skip files that fail to load
    }
  }

  return results;
}

export async function getAvailableFolders(authToken: string): Promise<string[]> {
  const relayId = await resolveRelayId(authToken);
  const folders = await discoverFolders(authToken, relayId);
  return Object.keys(folders).sort();
}
