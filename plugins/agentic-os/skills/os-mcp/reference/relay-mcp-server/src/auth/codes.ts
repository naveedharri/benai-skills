import crypto from "node:crypto";
import path from "node:path";
import { DATA_DIR } from "../config.js";
import { loadJson, saveJson } from "./jsonfile.js";

export interface McpAuthCode {
  code: string;
  sid: string;
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  resource?: string;
  expiresAt: number;
}

const CODES_FILE = path.join(DATA_DIR, "codes.json");
const TTL_MS = 60_000;

type Store = Record<string, McpAuthCode>;

let cache: Store | null = null;

function load(): Store {
  if (cache) return cache;
  cache = loadJson<Store>(CODES_FILE, {});
  return cache;
}

function persist(): void {
  if (!cache) return;
  saveJson(CODES_FILE, cache);
}

function sweep(): boolean {
  const store = load();
  const now = Date.now();
  let dirty = false;
  for (const [code, entry] of Object.entries(store)) {
    if (entry.expiresAt < now) {
      delete store[code];
      dirty = true;
    }
  }
  return dirty;
}

export function createCode(data: Omit<McpAuthCode, "code" | "expiresAt">): McpAuthCode {
  sweep();
  const store = load();
  const code = crypto.randomBytes(24).toString("hex");
  const entry: McpAuthCode = { ...data, code, expiresAt: Date.now() + TTL_MS };
  store[code] = entry;
  persist();
  return entry;
}

export function consumeCode(code: string): McpAuthCode | undefined {
  sweep();
  const store = load();
  const entry = store[code];
  if (!entry) return undefined;
  delete store[code];
  persist();
  return entry;
}

export function peekCode(code: string): McpAuthCode | undefined {
  if (sweep()) persist();
  return load()[code];
}
