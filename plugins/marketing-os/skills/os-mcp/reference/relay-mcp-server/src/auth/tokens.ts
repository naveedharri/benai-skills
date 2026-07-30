import crypto from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { JWT_SECRET, PUBLIC_URL } from "../config.js";

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

const refreshTokens = new Map<string, { sid: string; clientId: string; expiresAt: number }>();

export function issueRefreshToken(sid: string, clientId: string): string {
  const token = crypto.randomBytes(32).toString("hex");
  refreshTokens.set(token, {
    sid,
    clientId,
    expiresAt: Date.now() + REFRESH_TOKEN_TTL_SEC * 1000,
  });
  return token;
}

export function redeemRefreshToken(token: string): { sid: string; clientId: string } | undefined {
  const entry = refreshTokens.get(token);
  if (!entry) return undefined;
  if (entry.expiresAt < Date.now()) {
    refreshTokens.delete(token);
    return undefined;
  }
  return { sid: entry.sid, clientId: entry.clientId };
}

export function revokeRefreshToken(token: string): void {
  refreshTokens.delete(token);
}
