import fs from "node:fs/promises";
import path from "node:path";
import { query } from "@anthropic-ai/claude-agent-sdk";
import { ROOT, SNAPSHOT_DIR, MCP_CONFIG } from "./paths";
import { getSkill, type SkillMeta } from "./skills";
import { appendEvent, finishRun, createRun, type RunRecord } from "./runs";

function normalizeMcp(cfg: any): any {
  if (!cfg || cfg.type) return cfg;
  // .mcp.json doesn't require `type`; the SDK does. Infer it.
  if (cfg.url) return { type: "http", ...cfg };
  if (cfg.command) return { type: "stdio", ...cfg };
  return cfg;
}

async function loadMcpServers(filter?: string[]): Promise<Record<string, any>> {
  try {
    const raw = await fs.readFile(MCP_CONFIG, "utf8");
    const parsed = JSON.parse(raw);
    const all: Record<string, any> = parsed.mcpServers || {};
    const out: Record<string, any> = {};
    const keys = filter && filter.length > 0 ? filter : Object.keys(all);
    for (const key of keys) if (all[key]) out[key] = normalizeMcp(all[key]);
    return out;
  } catch {
    return {};
  }
}

function buildPrompt(skill: SkillMeta, profile?: string): string {
  const snapshotPath = skill.snapshot
    ? path.join(SNAPSHOT_DIR, `${skill.snapshot}.json`)
    : null;
  const header = [
    `You are running the "${skill.name}" skill.`,
    profile ? `Active profile: ${profile}.` : null,
    snapshotPath
      ? `When done, write the final result as JSON to: ${snapshotPath}`
      : null,
    `Use the Write tool for the final JSON. Do not wrap it in markdown.`,
    ``,
    `--- SKILL INSTRUCTIONS ---`,
    skill.prompt,
  ].filter(Boolean).join("\n");
  return header;
}

export interface StartRunInput {
  skillName: string;
  profile?: string;
}

export async function startRun(input: StartRunInput): Promise<RunRecord> {
  const skill = await getSkill(input.skillName);
  if (!skill) {
    const rec = createRun(input.skillName, input.profile);
    appendEvent(rec.id, { type: "error", payload: { message: `skill not found: ${input.skillName}` } });
    await finishRun(rec.id, "error", `skill not found: ${input.skillName}`);
    return rec;
  }
  const rec = createRun(skill.name, input.profile);
  void execRun(rec.id, buildPrompt(skill, input.profile), skill.mcp_servers, skill.name);
  return rec;
}

export interface InlineRunInput {
  label: string;
  prompt: string;
  mcp_servers?: string[];
  profile?: string;
}

export async function startInlineRun(input: InlineRunInput): Promise<RunRecord> {
  const rec = createRun(input.label, input.profile);
  void execRun(rec.id, input.prompt, input.mcp_servers, input.label);
  return rec;
}

async function execRun(runId: string, prompt: string, mcpFilter?: string[], label?: string): Promise<void> {
  try {
    const mcpServers = await loadMcpServers(mcpFilter);
    appendEvent(runId, { type: "system", payload: { phase: "starting", label, mcp: Object.keys(mcpServers) } });

    const iter = query({
      prompt,
      options: {
        cwd: ROOT,
        mcpServers,
        permissionMode: "bypassPermissions",
        settingSources: ["project"],
        stderr: (msg: string) => {
          // Surface SDK subprocess stderr into run events so failures are debuggable.
          for (const line of msg.split(/\r?\n/)) {
            if (line.trim()) appendEvent(runId, { type: "stderr", payload: { text: line } });
            // eslint-disable-next-line no-console
            if (line.trim()) console.error(`[sdk:${runId}] ${line}`);
          }
        },
      },
    });

    for await (const msg of iter) {
      handleSdkMessage(runId, msg);
    }
    await finishRun(runId, "success");
  } catch (err: any) {
    appendEvent(runId, { type: "error", payload: { message: String(err?.message || err) } });
    await finishRun(runId, "error", String(err?.message || err));
  }
}

function handleSdkMessage(runId: string, msg: any): void {
  // msg is SDKMessage union. We normalize into our RunEvent shape.
  const t = msg?.type;
  if (t === "assistant") {
    const blocks = msg?.message?.content || [];
    for (const b of blocks) {
      if (b.type === "text" && b.text) {
        appendEvent(runId, { type: "text", payload: { text: b.text } });
      } else if (b.type === "tool_use") {
        appendEvent(runId, { type: "tool_use", payload: { name: b.name, input: b.input } });
      }
    }
  } else if (t === "result") {
    appendEvent(runId, { type: "result", payload: { subtype: msg.subtype, duration_ms: msg.duration_ms, total_cost_usd: msg.total_cost_usd } });
  } else if (t === "system") {
    appendEvent(runId, { type: "system", payload: { subtype: msg.subtype } });
  }
  // partial_assistant, status, etc. are dropped to reduce SSE noise.
}
