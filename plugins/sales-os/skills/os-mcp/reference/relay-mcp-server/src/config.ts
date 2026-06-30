import path from "node:path";
import os from "node:os";

export const RELAY_API_URL = (process.env.RELAY_API_URL || "").replace(/\/$/, "");
export const RELAY_AUTH_TOKEN = process.env.RELAY_AUTH_TOKEN || "";
export const RELAY_ID = process.env.RELAY_ID || "";

export const PORT = parseInt(process.env.PORT || "3000", 10);

export const PUBLIC_URL = (process.env.PUBLIC_URL || `http://localhost:${PORT}`).replace(/\/$/, "");
export const JWT_SECRET = process.env.JWT_SECRET || "";
export const STATIC_MCP_BEARER = process.env.STATIC_MCP_BEARER || "";
export const ALLOWED_EMAILS = (process.env.ALLOWED_EMAILS || "")
  .split(",")
  .map(s => s.trim().toLowerCase())
  .filter(Boolean);
export const DATA_DIR = process.env.DATA_DIR || path.join(os.tmpdir(), "relay-mcp-v2");

export const PB_AUTH_URL = (process.env.PB_AUTH_URL || "").replace(/\/$/, "");
export const PB_COLLECTION = process.env.PB_COLLECTION || "users";

export function assertRequiredConfig(): void {
  const missing: string[] = [];
  if (!JWT_SECRET || JWT_SECRET.length < 32) missing.push("JWT_SECRET (>=32 chars)");
  if (!PUBLIC_URL) missing.push("PUBLIC_URL");
  if (!RELAY_API_URL) missing.push("RELAY_API_URL");
  if (!PB_AUTH_URL) missing.push("PB_AUTH_URL");
  // RELAY_ID is optional — auto-discovered from the user's PocketBase relays at runtime if unset.
  if (missing.length) {
    throw new Error(`Missing or invalid env vars: ${missing.join(", ")}`);
  }
  if (ALLOWED_EMAILS.length === 0) {
    console.warn("[config] ALLOWED_EMAILS is empty — any authenticated Relay.md user can sign in.");
  }
}
