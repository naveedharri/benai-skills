import { PB_AUTH_URL, PB_COLLECTION } from "../config.js";

export interface PbSession {
  pbToken: string;
  pbTokenExp: number;
  email: string;
  recordId: string;
}

function decodeJwtExp(token: string): number {
  const parts = token.split(".");
  if (parts.length < 2) return 0;
  try {
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
    return typeof payload.exp === "number" ? payload.exp : 0;
  } catch {
    return 0;
  }
}

export async function authWithPassword(params: {
  identity: string;
  password: string;
}): Promise<PbSession> {
  const url = `${PB_AUTH_URL}/api/collections/${PB_COLLECTION}/auth-with-password`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identity: params.identity,
      password: params.password,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    if (res.status === 400) throw new Error("invalid email or password");
    throw new Error(`PB auth-with-password failed (${res.status}): ${text}`);
  }
  const body = await res.json() as { token: string; record: { id: string; email: string } };
  return {
    pbToken: body.token,
    pbTokenExp: decodeJwtExp(body.token),
    email: String(body.record.email || "").toLowerCase(),
    recordId: body.record.id,
  };
}

export async function requestPasswordReset(email: string): Promise<void> {
  const url = `${PB_AUTH_URL}/api/collections/${PB_COLLECTION}/request-password-reset`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok && res.status !== 204) {
    throw new Error(`PB request-password-reset failed (${res.status}): ${await res.text()}`);
  }
}

export async function refreshPbToken(pbToken: string): Promise<PbSession> {
  const url = `${PB_AUTH_URL}/api/collections/${PB_COLLECTION}/auth-refresh`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: pbToken },
  });
  if (!res.ok) throw new Error(`PB auth-refresh failed (${res.status}): ${await res.text()}`);
  const body = await res.json() as { token: string; record: { id: string; email: string } };
  return {
    pbToken: body.token,
    pbTokenExp: decodeJwtExp(body.token),
    email: String(body.record.email || "").toLowerCase(),
    recordId: body.record.id,
  };
}
