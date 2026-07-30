import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { mcpAuthRouter, getOAuthProtectedResourceMetadataUrl } from "@modelcontextprotocol/sdk/server/auth/router.js";
import { requireBearerAuth } from "@modelcontextprotocol/sdk/server/auth/middleware/bearerAuth.js";
import express, { type Request } from "express";
import { z } from "zod";
import {
  listFiles, readFile, writeFile, updateFile, appendFile,
  deleteFile, moveFile, searchFiles,
  getAvailableFolders, listAccessibleRelays, resolveRelayId,
} from "./relay-client.js";
import { PORT, PUBLIC_URL, RELAY_AUTH_TOKEN, RELAY_API_URL, assertRequiredConfig } from "./config.js";
import { RelayOAuthProvider, handleLogin, handleResetRequest, LOGIN_PATH, RESET_PATH } from "./auth/provider.js";
import { ensureFreshPbToken, startRefreshLoop } from "./auth/refresh-loop.js";

assertRequiredConfig();

const RESOURCE_URL = new URL(`${PUBLIC_URL}/mcp`);
const ISSUER_URL = new URL(PUBLIC_URL);
const PROTECTED_RESOURCE_METADATA_URL = getOAuthProtectedResourceMetadataUrl(RESOURCE_URL);

async function resolveRelayToken(req: Request): Promise<string> {
  const auth = req.auth;
  if (!auth) throw new Error("no auth info on request");
  const extra = (auth.extra || {}) as { mode?: string; sid?: string };
  if (extra.mode === "static") {
    if (!RELAY_AUTH_TOKEN) {
      throw new Error("static bearer used but RELAY_AUTH_TOKEN env is not set");
    }
    return RELAY_AUTH_TOKEN;
  }
  if (extra.mode === "oauth" && extra.sid) {
    const pbToken = await ensureFreshPbToken(extra.sid);
    if (!pbToken) throw new Error("session expired, please re-authenticate");
    return pbToken;
  }
  throw new Error("unknown auth mode");
}

function createServer(req: Request): McpServer {
  const instructions = [
    "Obsidian vault accessed via the Relay sync protocol — the user's notes, daily logs, projects, and knowledge base.",
    "",
    "Use this MCP whenever the user mentions: vault, Obsidian, Obsidian vault, notes, daily notes, meeting notes, journal, second brain, knowledge base, Zettelkasten.",
    "",
    "Contents: real-time-synced Obsidian vault. Files are markdown. Edits made here sync live to every connected Obsidian client.",
    "",
    "Folders are auto-discovered from the user's Relay account at runtime. Call vault_folders to list available folder names before using folder-scoped tools, or pass a folder GUID directly.",
    "",
    "Tools:",
    "- vault_relays: list Relay vaults the user can access",
    "- vault_folders: list top-level folders in the active vault",
    "- vault_list: enumerate files in a folder",
    "- vault_read: fetch the markdown content of one file",
    "- vault_search: keyword search across filenames and content",
    "- vault_write: create or fully overwrite a markdown file",
    "- vault_update: in-place find-and-replace edit (preferred for partial edits)",
    "- vault_append: append content to a file (auto-creates if missing)",
    "- vault_move: rename/move a file",
    "- vault_delete: remove a file (irreversible; syncs to all clients)",
    "",
    "Prefer vault_search before vault_read when the user gives a topic but not a path. For edits, prefer vault_update or vault_append over vault_write — they ship only the diff, avoid stream-idle timeouts on large notes, and preserve concurrent edits made in Obsidian. Reserve vault_write for creating new files or replacing the entire body.",
  ].join("\n");

  const server = new McpServer(
    {
      name: "obsidian-vault",
      title: "Obsidian Vault (via Relay)",
      version: "2.0.0",
      description:
        "Read, write, search, move, and delete markdown files in an Obsidian vault synced via the Relay protocol. Folders are auto-discovered from the user's Relay account.",
      websiteUrl: "https://relay.md",
    } as any,
    {
      instructions,
    }
  );

  server.registerTool(
    "vault_relays",
    {
      title: "Lists Relay vaults the authenticated user can access.",
      description:
        "List all Relay vaults the authenticated user has access to. Useful when the user has multiple vaults and you want to confirm which one is being targeted. The active vault is the one the MCP is currently bound to (RELAY_ID env override, or the first relay if unset).",
      inputSchema: {},
      annotations: {
        title: "Lists Relay vaults the authenticated user can access.",
        readOnlyHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      try {
        const token = await resolveRelayToken(req);
        const [relays, activeRelayId] = await Promise.all([
          listAccessibleRelays(token),
          resolveRelayId(token).catch(e => `<error: ${e.message}>`),
        ]);
        if (relays.length === 0) {
          return { content: [{ type: "text" as const, text: "No relays accessible to this user. Create one in your Relay.md Obsidian plugin first." }] };
        }
        const lines = relays.map(r => `${r.guid === activeRelayId ? "* " : "  "}${r.name || "(unnamed)"} — ${r.guid}`);
        const text = `Active relay marked with *.\n\n${lines.join("\n")}`;
        return { content: [{ type: "text" as const, text }] };
      } catch (err: any) {
        return {
          content: [{ type: "text" as const, text: `Error: ${err.message}` }],
          isError: true,
        };
      }
    }
  );

  server.registerTool(
    "vault_folders",
    {
      title: "Lists top-level folders in the active vault.",
      description:
        "List the top-level folders in the active Relay vault. Call this first when the user references a folder by name and you don't already know it. Returns folder names that can be passed to other vault_* tools as the `folder` argument.",
      inputSchema: {},
      annotations: {
        title: "Lists top-level folders in the active vault.",
        readOnlyHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      try {
        const token = await resolveRelayToken(req);
        const folders = await getAvailableFolders(token);
        const text = folders.length
          ? folders.join("\n")
          : "(no folders found in the active relay — call vault_relays to see your accessible vaults)";
        return { content: [{ type: "text" as const, text }] };
      } catch (err: any) {
        return {
          content: [{ type: "text" as const, text: `Error: ${err.message}` }],
          isError: true,
        };
      }
    }
  );

  server.registerTool(
    "vault_list",
    {
      title: "Lists files in a vault folder.",
      description: "List files in a folder of the Obsidian vault. Use when the user wants to browse their vault or see what's in a folder. Returns file paths and document IDs. Pass a folder name (call vault_folders first if unsure) or a folder GUID.",
      inputSchema: {
        folder: z.string().describe("Folder name (e.g. from vault_folders) or folder GUID"),
      },
      annotations: {
        title: "Lists files in a vault folder.",
        readOnlyHint: true,
        openWorldHint: false,
      },
    },
    async ({ folder }) => {
      try {
        const token = await resolveRelayToken(req);
        const files = await listFiles(token, folder);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(files, null, 2) }],
        };
      } catch (err: any) {
        return {
          content: [{ type: "text" as const, text: `Error: ${err.message}` }],
          isError: true,
        };
      }
    }
  );

  server.registerTool(
    "vault_read",
    {
      title: "Reads the contents of a vault note.",
      description:
        "Read a markdown file from the Obsidian vault. Use when the user references a specific note, daily log, or project file and you already know the path (otherwise use vault_search first). Returns the full file content as plain text.",
      inputSchema: {
        folder: z.string().describe("Folder name (from vault_folders) or folder GUID"),
        path: z.string().describe("Relative file path within the folder, e.g. '2026-04-10.md' or 'subfolder/file.md'"),
      },
      annotations: {
        title: "Reads the contents of a vault note.",
        readOnlyHint: true,
        openWorldHint: false,
      },
    },
    async ({ folder, path }) => {
      try {
        const token = await resolveRelayToken(req);
        const content = await readFile(token, folder, path);
        return { content: [{ type: "text" as const, text: content }] };
      } catch (err: any) {
        return {
          content: [{ type: "text" as const, text: `Error: ${err.message}` }],
          isError: true,
        };
      }
    }
  );

  server.registerTool(
    "vault_search",
    {
      title: "Searches vault notes by filename and content.",
      description:
        "Search the Obsidian vault by filename or content. Use this first whenever the user mentions a topic, person, project, meeting, or idea without giving an exact path — it's the fastest way to locate notes. Returns matching file paths with context snippets (up to 20 files scanned for content matches).",
      inputSchema: {
        folder: z.string().describe("Folder name (from vault_folders) or folder GUID"),
        query: z.string().describe("Search query (matches against filenames and file content)"),
      },
      annotations: {
        title: "Searches vault notes by filename and content.",
        readOnlyHint: true,
        openWorldHint: false,
      },
    },
    async ({ folder, query }) => {
      try {
        const token = await resolveRelayToken(req);
        const results = await searchFiles(token, folder, query);
        if (results.length === 0) {
          return { content: [{ type: "text" as const, text: `No results found for "${query}" in ${folder}.` }] };
        }
        return { content: [{ type: "text" as const, text: JSON.stringify(results, null, 2) }] };
      } catch (err: any) {
        return {
          content: [{ type: "text" as const, text: `Error: ${err.message}` }],
          isError: true,
        };
      }
    }
  );

  server.registerTool(
    "vault_write",
    {
      title: "Creates or overwrites a vault note.",
      description:
        "Create or overwrite a markdown file in the Obsidian vault. Use to save daily notes, meeting summaries, project artifacts, journal entries, or anything the user wants persisted. Replaces the full file contents. Edits sync in real-time to every connected Obsidian client.",
      inputSchema: {
        folder: z.string().describe("Folder name (from vault_folders) or folder GUID"),
        path: z.string().describe("Relative file path within the folder"),
        content: z.string().describe("Full markdown content to write"),
      },
      annotations: {
        title: "Creates or overwrites a vault note.",
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ folder, path, content }) => {
      try {
        const token = await resolveRelayToken(req);
        await writeFile(token, folder, path, content);
        return {
          content: [{ type: "text" as const, text: `Successfully wrote ${path} in ${folder}. Changes are syncing to all connected Obsidian clients.` }],
        };
      } catch (err: any) {
        return {
          content: [{ type: "text" as const, text: `Error: ${err.message}` }],
          isError: true,
        };
      }
    }
  );

  server.registerTool(
    "vault_update",
    {
      title: "Edits a vault note in place via find-and-replace.",
      description:
        "Update an existing markdown file by replacing one occurrence (or all occurrences) of an exact string. Prefer this over vault_write whenever you only need to change part of a file — it ships the diff, not the whole file, avoiding stream-idle timeouts on large notes and preserving any concurrent edits made in Obsidian. The old_string must match exactly, including whitespace and newlines, and must be unique unless replace_all is true.",
      inputSchema: {
        folder: z.string().describe("Folder name (from vault_folders) or folder GUID"),
        path: z.string().describe("Relative file path within the folder. File must already exist."),
        old_string: z.string().describe("Exact string to find. Must be unique in the file unless replace_all=true. Include enough surrounding context to disambiguate."),
        new_string: z.string().describe("Replacement string. Can be empty to delete the matched section."),
        replace_all: z.boolean().optional().describe("If true, replace every occurrence of old_string. Default false (errors on multiple matches)."),
      },
      annotations: {
        title: "Edits a vault note in place via find-and-replace.",
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ folder, path, old_string, new_string, replace_all }) => {
      try {
        const token = await resolveRelayToken(req);
        const result = await updateFile(token, folder, path, old_string, new_string, replace_all ?? false);
        return {
          content: [{ type: "text" as const, text: `Updated ${path} in ${folder}: ${result.replacements} replacement${result.replacements === 1 ? "" : "s"}. Synced to all connected Obsidian clients.` }],
        };
      } catch (err: any) {
        return {
          content: [{ type: "text" as const, text: `Error: ${err.message}` }],
          isError: true,
        };
      }
    }
  );

  server.registerTool(
    "vault_append",
    {
      title: "Appends content to the end of a vault note.",
      description:
        "Append text to the end of an existing file, or create the file if it doesn't exist. Prefer this over vault_write for accumulating content (daily logs, running notes, append-only journals) — it ships only the new content, not the existing file body. Auto-creates the file with the content as the initial body if the path doesn't exist yet.",
      inputSchema: {
        folder: z.string().describe("Folder name (from vault_folders) or folder GUID"),
        path: z.string().describe("Relative file path within the folder. Auto-created if missing."),
        content: z.string().describe("Text to append. Include any leading newline you want between the existing content and the new text."),
      },
      annotations: {
        title: "Appends content to the end of a vault note.",
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ folder, path, content }) => {
      try {
        const token = await resolveRelayToken(req);
        const result = await appendFile(token, folder, path, content);
        const verb = result.created ? "Created" : "Appended to";
        return {
          content: [{ type: "text" as const, text: `${verb} ${path} in ${folder} (+${result.bytesAppended} chars). Synced to all connected Obsidian clients.` }],
        };
      } catch (err: any) {
        return {
          content: [{ type: "text" as const, text: `Error: ${err.message}` }],
          isError: true,
        };
      }
    }
  );

  server.registerTool(
    "vault_move",
    {
      title: "Renames or moves a vault note.",
      description:
        "Rename or move a file inside an Obsidian vault folder. Use when the user wants to rename a note or relocate a file. Syncs the new path to every connected Obsidian client.",
      inputSchema: {
        folder: z.string().describe("Folder name (from vault_folders) or folder GUID"),
        old_path: z.string().describe("Current relative file path"),
        new_path: z.string().describe("New relative file path"),
      },
      annotations: {
        title: "Renames or moves a vault note.",
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ folder, old_path, new_path }) => {
      try {
        const token = await resolveRelayToken(req);
        await moveFile(token, folder, old_path, new_path);
        return { content: [{ type: "text" as const, text: `Moved ${old_path} to ${new_path} in ${folder}.` }] };
      } catch (err: any) {
        return {
          content: [{ type: "text" as const, text: `Error: ${err.message}` }],
          isError: true,
        };
      }
    }
  );

  server.registerTool(
    "vault_delete",
    {
      title: "Deletes a vault note (irreversible).",
      description:
        "Delete a file from the Obsidian vault. Destructive: removes it from the sync store so it disappears from every connected Obsidian client. Use only when the user explicitly asks to delete / remove / trash a note.",
      inputSchema: {
        folder: z.string().describe("Folder name (from vault_folders) or folder GUID"),
        path: z.string().describe("Relative file path within the folder to delete"),
      },
      annotations: {
        title: "Deletes a vault note (irreversible).",
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ folder, path }) => {
      try {
        const token = await resolveRelayToken(req);
        await deleteFile(token, folder, path);
        return { content: [{ type: "text" as const, text: `Deleted ${path} from ${folder}.` }] };
      } catch (err: any) {
        return {
          content: [{ type: "text" as const, text: `Error: ${err.message}` }],
          isError: true,
        };
      }
    }
  );

  return server;
}

async function main() {
  const app = express();

  app.set("trust proxy", 1);

  app.use((req, _res, next) => {
    console.log(`[req] ${req.method} ${req.originalUrl} ua=${(req.headers["user-agent"] || "").slice(0, 60)}`);
    next();
  });

  const provider = new RelayOAuthProvider();

  app.use(mcpAuthRouter({
    provider,
    issuerUrl: ISSUER_URL,
    baseUrl: ISSUER_URL,
    resourceServerUrl: RESOURCE_URL,
    resourceName: "Obsidian Vault (via Relay)",
  }));

  const formParser = express.urlencoded({ extended: false });

  app.post(LOGIN_PATH, formParser, async (req, res) => {
    const state = typeof req.body.state === "string" ? req.body.state : "";
    const email = typeof req.body.email === "string" ? req.body.email : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";
    const result = await handleLogin({ state, email, password });
    if ("redirectUrl" in result) {
      res.redirect(result.redirectUrl);
      return;
    }
    res.status(result.status).type("text/html").send(result.pageHtml);
  });

  app.post(RESET_PATH, formParser, async (req, res) => {
    const state = typeof req.body.state === "string" ? req.body.state : "";
    const email = typeof req.body.email === "string" ? req.body.email : "";
    const result = await handleResetRequest({ state, email });
    res.status(result.status).type("text/html").send(result.pageHtml);
  });

  const bearerAuth = requireBearerAuth({
    verifier: provider,
    resourceMetadataUrl: PROTECTED_RESOURCE_METADATA_URL,
  });

  const sessions = new Map<string, { server: McpServer; transport: StreamableHTTPServerTransport }>();

  app.post("/mcp", bearerAuth, async (req, res) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;

    if (sessionId && sessions.has(sessionId)) {
      await sessions.get(sessionId)!.transport.handleRequest(req, res);
      return;
    }

    const server = createServer(req);
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => crypto.randomUUID(),
      enableJsonResponse: true,
    });

    await server.connect(transport);
    await transport.handleRequest(req, res);

    const sid = (transport as any).sessionId as string | undefined;
    if (sid) {
      sessions.set(sid, { server, transport });
      transport.onclose = () => { sessions.delete(sid); };
    }
  });

  app.get("/mcp", bearerAuth, async (req, res) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    if (sessionId && sessions.has(sessionId)) {
      await sessions.get(sessionId)!.transport.handleRequest(req, res);
      return;
    }
    res.status(400).json({ error: "No session. Send POST to /mcp first." });
  });

  app.delete("/mcp", bearerAuth, async (req, res) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    if (sessionId && sessions.has(sessionId)) {
      await sessions.get(sessionId)!.transport.handleRequest(req, res);
      return;
    }
    res.status(400).json({ error: "No session found." });
  });

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", version: "2.0.0", sessions: sessions.size });
  });

  app.get("/diag", bearerAuth, async (req, res) => {
    const results: Record<string, any> = { nodeVersion: process.version };
    try {
      const r = await fetch(`${RELAY_API_URL}/api/health`);
      results.apiHealth = { status: r.status, ok: r.ok };
    } catch (err: any) {
      results.apiHealth = { error: err.message, cause: String(err.cause) };
    }
    try {
      const token = await resolveRelayToken(req);
      const folders = await getAvailableFolders(token);
      results.folderDiscovery = { count: folders.length, sample: folders.slice(0, 5) };
    } catch (err: any) {
      results.folderDiscovery = { error: err.message, cause: String(err.cause) };
    }
    res.json(results);
  });

  startRefreshLoop();

  app.listen(PORT, () => {
    console.log(`Relay MCP v2 server listening on port ${PORT}`);
    console.log(`  Public URL: ${PUBLIC_URL}`);
    console.log(`  Resource metadata: ${PROTECTED_RESOURCE_METADATA_URL}`);
  });
}

main().catch(console.error);
