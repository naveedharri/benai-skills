// Writes .mcp.json from environment variables at build/start time.
// Run via `node scripts/write-mcp-config.mjs`. Safe to run repeatedly.
// Auto-loads .env.local if present so the same command works for local dev
// and hosted envs that inject vars directly (Railway, Vercel, etc).
import fs from "node:fs";
import path from "node:path";

// Tiny .env.local loader — no dotenv dependency.
(function loadEnvFile() {
  const p = path.resolve(".env.local");
  if (!fs.existsSync(p)) return;
  for (const raw of fs.readFileSync(p, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 0) continue;
    const k = line.slice(0, eq).trim();
    let v = line.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (k && process.env[k] === undefined) process.env[k] = v;
  }
})();

const out = path.resolve(".mcp.json");

function entry(server, fallback) {
  if (!server) return null;
  return server;
}

const servers = {};

if (process.env.MCP_CIRCLE_KEY) {
  servers["circle-community"] = {
    type: "http",
    url: process.env.MCP_CIRCLE_URL || "https://circle-mcp-server-production-5870.up.railway.app/mcp",
    headers: { Authorization: `Bearer ${process.env.MCP_CIRCLE_KEY}` },
  };
}

if (process.env.MCP_FIREFLIES_KEY) {
  servers.fireflies = {
    type: "http",
    url: process.env.MCP_FIREFLIES_URL || "https://api.fireflies.ai/mcp",
    headers: { Authorization: `Bearer ${process.env.MCP_FIREFLIES_KEY}` },
  };
}

if (process.env.MCP_YOUTUBE_API_KEY) {
  servers.youtube = {
    type: "stdio",
    command: "npx",
    args: ["-y", "@kirbah/mcp-youtube"],
    env: { YOUTUBE_API_KEY: process.env.MCP_YOUTUBE_API_KEY },
  };
}

if (process.env.MCP_VIDIQ_KEY) {
  servers.vidiq = {
    type: "http",
    url: process.env.MCP_VIDIQ_URL || "https://mcp.vidiq.com/mcp",
    headers: { Authorization: `Bearer ${process.env.MCP_VIDIQ_KEY}` },
  };
}

if (process.env.MCP_APIFY_KEY) {
  servers.apify = {
    type: "http",
    url: process.env.MCP_APIFY_URL || "https://mcp.apify.com/?tools=apidojo/twitter-scraper-lite,apidojo/tweet-scraper,automation-lab/youtube-scraper",
    headers: { Authorization: `Bearer ${process.env.MCP_APIFY_KEY}` },
  };
}

if (process.env.MCP_REDDIT_URL) {
  servers.reddit = { type: "http", url: process.env.MCP_REDDIT_URL };
}

if (process.env.MCP_UNIPILE_KEY) {
  servers.unipile = {
    type: "http",
    url: process.env.MCP_UNIPILE_URL || "https://developer.unipile.com/mcp?branch=v1.0",
    headers: { "X-API-KEY": process.env.MCP_UNIPILE_KEY },
  };
}

// If no env vars set AND an existing .mcp.json is present (local dev), leave it.
if (Object.keys(servers).length === 0 && fs.existsSync(out)) {
  console.log("[write-mcp-config] no MCP_* env vars; keeping existing .mcp.json");
  process.exit(0);
}

const cfg = { mcpServers: servers };
fs.writeFileSync(out, JSON.stringify(cfg, null, 2));
console.log(`[write-mcp-config] wrote ${out} with servers: ${Object.keys(servers).join(", ") || "(none)"}`);
