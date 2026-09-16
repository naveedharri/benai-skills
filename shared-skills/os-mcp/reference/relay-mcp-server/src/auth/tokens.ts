import crypto from "node:crypto";
import path from "node:path";
import { SignJWT, jwtVerify } from "jose";
import { JWT_SECRET, PUBLIC_URL, DATA_DIR } from "../config.js";
import { loadJson, saveJson } from "./jsonfile.js";

export const ACCESS_TOKEN_TTL_SEC = 60 * 60;
export const REFRESH_TOKEN_TTL_SEC = 30 * 24 * 60 * 60;

function key(): Uint8Array {
  if (!JWT_SECRET) throw new Error("JWT_SECRET required");
  return new TextEncoder().encode(JWT_SECRET);
}

export async function signAccessToken(params: {
  sid: string;
  email: string;
  clientId: string;
}): Promise<string> {
  return await new SignJWT({
    sid: params.sid,
    email: params.email,
    client_id: params.clientId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(PUBLIC_URL)
    .setAudience(PUBLIC_URL)
    .setSubject(params.email)
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TOKEN_TTL_SEC}s`)
    .sign(key());
}

export interface VerifiedAccessToken {
  sid: string;
  email: string;
  clientId: string;
  expSec: number;
}

export async function verifyAccessJwt(token: string): Promise<VerifiedAccessToken> {
  const { payload } = await jwtVerify(token, key(), {
    issuer: PUBLIC_URL,
    audience: PUBLIC_URL,
  });
  const sid = String(payload.sid || "");
  const email = String(payload.email || "");
  const clientId = String(payload.client_id || "");
  const expSec = typeof payload.exp === "number" ? payload.exp : 0;
  if (!sid || !email || !clientId) throw new Error("token missing required claims");
  return { sid, email, clientId, expSec };
}

// Refresh tokens persist to DATA_DIR/refresh.json (mirrors clients.ts) so a
// Railway redeploy does not orphan every connected client's refresh token.
// Sessions already persist to DATA_DIR/sessions.enc; this closes the last
// in-memory auth store.

interface RefreshEntry { sid: string; clientId: string; expiresAt: number }

const REFRESH_FILE = path.join(DATA_DIR, "refresh.json");

type RefreshStore = Record<string, RefreshEntry>;

let refreshCache: RefreshStore | null = null;

function loadRefresh(): RefreshStore {
  if (refreshCache) return refreshCache;
  refreshCache = loadJson<RefreshStore>(REFRESH_FILE, {});
  return refreshCache;
}

function persistRefresh(): void {
  if (!refreshCache) return;
  saveJson(REFRESH_FILE, refreshCache);
}

function sweepRefresh(): boolean {
  const store = loadRefresh();
  const now = Date.now();
  let dirty = false;
  for (const [token, entry] of Object.entries(store)) {
    if (entry.expiresAt < now) {
      delete store[token];
      dirty = true;
    }
  }
  return dirty;
}

export function issueRefreshToken(sid: string, clientId: string): string {
  if (sweepRefresh()) persistRefresh();
  const store = loadRefresh();
  const token = crypto.randomBytes(32).toString("hex");
  store[token] = {
    sid,
    clientId,
    expiresAt: Date.now() + REFRESH_TOKEN_TTL_SEC * 1000,
  };
  persistRefresh();
  return token;
}

export function redeemRefreshToken(token: string): { sid: string; clientId: string } | undefined {
  const store = loadRefresh();
  const entry = store[token];
  if (!entry) return undefined;
  if (entry.expiresAt < Date.now()) {
    delete store[token];
    persistRefresh();
    return undefined;
  }
  return { sid: entry.sid, clientId: entry.clientId };
}

export function revokeRefreshToken(token: string): void {
  const store = loadRefresh();
  if (store[token]) {
    delete store[token];
    persistRefresh();
  }
}
