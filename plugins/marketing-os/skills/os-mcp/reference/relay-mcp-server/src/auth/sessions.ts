import path from "node:path";
import crypto from "node:crypto";
import fs from "node:fs";
import { DATA_DIR, JWT_SECRET } from "../config.js";

const SESSIONS_FILE = path.join(DATA_DIR, "sessions.enc");

export interface Session {
  sid: string;
  pbToken: string;
  pbTokenExp: number;
  email: string;
  recordId: string;
  createdAt: number;
  lastRefreshedAt: number;
}

let cache: Record<string, Session> | null = null;
let key: Buffer | null = null;

function getKey(): Buffer {
  if (!key) {
    if (!JWT_SECRET) throw new Error("JWT_SECRET required to derive session key");
    key = crypto.createHash("sha256").update(`sessions:${JWT_SECRET}`).digest();
  }
  return key;
}

function encrypt(plaintext: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getKey(), iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64")}.${tag.toString("base64")}.${enc.toString("base64")}`;
}

function decrypt(payload: string): string {
  const [ivB64, tagB64, encB64] = payload.split(".");
  const iv = Buffer.from(ivB64, "base64");
  const tag = Buffer.from(tagB64, "base64");
  const enc = Buffer.from(encB64, "base64");
  const decipher = crypto.createDecipheriv("aes-256-gcm", getKey(), iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
  return dec.toString("utf8");
}

function load(): Record<string, Session> {
  if (cache) return cache;
  try {
    if (!fs.existsSync(SESSIONS_FILE)) {
      cache = {};
      return cache;
    }
    const raw = fs.readFileSync(SESSIONS_FILE, "utf8").trim();
    if (!raw) {
      cache = {};
      return cache;
    }
    cache = JSON.parse(decrypt(raw));
    return cache!;
  } catch (err: any) {
    console.error(`[sessions] load failed: ${err.message}, resetting`);
    cache = {};
    return cache;
  }
}

function persist(): void {
  if (!cache) return;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = `${SESSIONS_FILE}.tmp`;
  fs.writeFileSync(tmp, encrypt(JSON.stringify(cache)));
  fs.renameSync(tmp, SESSIONS_FILE);
}

export function createSession(data: Omit<Session, "sid" | "createdAt" | "lastRefreshedAt">): Session {
  const sid = crypto.randomBytes(24).toString("hex");
  const now = Math.floor(Date.now() / 1000);
  const session: Session = { sid, ...data, createdAt: now, lastRefreshedAt: now };
  const store = load();
  store[sid] = session;
  persist();
  return session;
}

export function getSession(sid: string): Session | undefined {
  return load()[sid];
}

export function updateSession(sid: string, patch: Partial<Session>): Session | undefined {
  const store = load();
  const existing = store[sid];
  if (!existing) return undefined;
  store[sid] = { ...existing, ...patch, lastRefreshedAt: Math.floor(Date.now() / 1000) };
  persist();
  return store[sid];
}

export function deleteSession(sid: string): void {
  const store = load();
  if (store[sid]) {
    delete store[sid];
    persist();
  }
}

export function listSessions(): Session[] {
  return Object.values(load());
}
