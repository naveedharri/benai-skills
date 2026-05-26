// Probe one or more MCP servers via the Claude Agent SDK and report whether
// each one connects + can make a trivial tool call. Used during onboarding
// (the agentic-os-starter skill calls this after collecting credentials) and
// available as an ongoing health check via `npm run probe-mcps`.
//
// Usage:
//   node scripts/probe-mcp.mjs              # probe every server in .mcp.json
//   node scripts/probe-mcp.mjs circle apify # probe only the listed servers
//
// Exit code: 0 if all probed servers connected, 1 otherwise.
// Output:    one JSON object per server with { name, status, error? }.
import fs from "node:fs";
import path from "node:path";
import { query } from "@anthropic-ai/claude-agent-sdk";

// Load .env.local first (so MCP_* + ANTHROPIC_API_KEY are picked up)
(function () {
  const p = path.resolve(".env.local");
  if (!fs.existsSync(p)) return;
  for (const raw of fs.readFileSync(p, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 0) continue;
    const k = line.slice(0, eq).trim();
    let v = line.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (k && process.env[k] === undefined) process.env[k] = v;
  }
})();

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("ANTHROPIC_API_KEY missing. Set it in .env.local before probing.");
  process.exit(1);
}

// Read .mcp.json (regenerate from env first if missing)
const MCP_PATH = path.resolve(".mcp.json");
if (!fs.existsSync(MCP_PATH)) {
  console.error("No .mcp.json found. Run `node scripts/write-mcp-config.mjs` first.");
  process.exit(1);
}
const allServers = JSON.parse(fs.readFileSync(MCP_PATH, "utf8")).mcpServers || {};

// Pick which to probe
const requested = process.argv.slice(2);
const targets = requested.length
  ? requested.filter(n => {
      if (!allServers[n]) console.error(`(skipping unknown server: ${n})`);
      return !!allServers[n];
    })
  : Object.keys(allServers);

if (targets.length === 0) {
  console.error("Nothing to probe. .mcp.json has no servers, or you passed names that don't exist.");
  process.exit(1);
}

// Each MCP gets a short, cheap "is alive" prompt that calls one read-only tool.
// Reports back with `STATUS:OK` or `STATUS:FAIL <reason>` in the final message.
function probePrompt(serverName) {
  return `You are probing the \`${serverName}\` MCP for connectivity. Make EXACTLY ONE tool call to any cheap, read-only tool on this server (examples: listing users, listing channels, get-server-variables, balance, account info, community_info). If the call succeeds, reply with: STATUS:OK then a one-line summary of what came back. If it fails, reply with: STATUS:FAIL <reason>. Do NOT call multiple tools. Do NOT use any other server. Do NOT call Bash, Read, or any other built-in tool — only the MCP under test.`;
}

async function probeOne(name) {
  const cfg = allServers[name];
  if (!cfg) return { name, status: "missing", error: "not in .mcp.json" };

  let lastText = "";
  let toolCalls = 0;
  try {
    const iter = query({
      prompt: probePrompt(name),
      options: {
        cwd: process.cwd(),
        mcpServers: { [name]: cfg },
        permissionMode: "bypassPermissions",
        settingSources: [],
      },
    });
    for await (const m of iter) {
      if (m.type === "system" && m.subtype === "init") {
        const sv = (m.mcp_servers || []).find(s => s.name === name);
        if (sv && sv.status !== "connected") {
          return { name, status: "fail", error: `mcp ${sv.status}` };
        }
      }
      if (m.type === "assistant") {
        for (const b of m.message?.content || []) {
          if (b.type === "text") lastText += b.text;
          if (b.type === "tool_use") toolCalls++;
        }
      }
      if (m.type === "result") {
        if (m.subtype !== "success") return { name, status: "fail", error: `sdk ${m.subtype}` };
      }
    }
  } catch (e) {
    return { name, status: "fail", error: String(e?.message || e) };
  }
  const ok = /STATUS\s*:\s*OK\b/i.test(lastText);
  if (ok) {
    const summary = (lastText.split(/STATUS\s*:\s*OK/i)[1] || "").trim().split("\n")[0].slice(0, 160);
    return { name, status: "ok", calls: toolCalls, summary };
  }
  const failMatch = lastText.match(/STATUS\s*:\s*FAIL\s*(.*)/i);
  return { name, status: "fail", error: failMatch ? failMatch[1].trim().slice(0, 240) : "no STATUS:OK in agent reply", lastText: lastText.slice(0, 240) };
}

console.error(`Probing ${targets.length} MCP server(s): ${targets.join(", ")}`);
let anyFail = false;
for (const name of targets) {
  const res = await probeOne(name);
  if (res.status !== "ok") anyFail = true;
  console.log(JSON.stringify(res));
}
process.exit(anyFail ? 1 : 0);
