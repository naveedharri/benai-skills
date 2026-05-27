import fs from "node:fs/promises";
import path from "node:path";
import { SKILLS_DIR } from "./paths";

export interface SkillMeta {
  name: string;
  description?: string;
  snapshot?: string;
  profile?: string;
  mcp_servers?: string[];
  prompt: string;          // body of SKILL.md after frontmatter
  dir: string;
}

function parseFrontmatter(src: string): { fm: Record<string, any>; body: string } {
  const match = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { fm: {}, body: src };
  const fm: Record<string, any> = {};
  for (const line of match[1].split("\n")) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val: any = m[2].trim();
    if (val.startsWith("[") && val.endsWith("]")) {
      val = val.slice(1, -1).split(",").map((s: string) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
    } else if (val.startsWith('"') || val.startsWith("'")) {
      val = val.replace(/^["']|["']$/g, "");
    }
    fm[key] = val;
  }
  return { fm, body: match[2] };
}

export async function listSkills(): Promise<SkillMeta[]> {
  let entries: string[] = [];
  try {
    entries = await fs.readdir(SKILLS_DIR);
  } catch {
    return [];
  }
  const out: SkillMeta[] = [];
  for (const entry of entries) {
    if (entry.startsWith(".")) continue;
    const dir = path.join(SKILLS_DIR, entry);
    const stat = await fs.stat(dir).catch(() => null);
    if (!stat?.isDirectory()) continue;
    const skillPath = path.join(dir, "SKILL.md");
    let raw = "";
    try { raw = await fs.readFile(skillPath, "utf8"); }
    catch { continue; }
    const { fm, body } = parseFrontmatter(raw);
    out.push({
      name: fm.name || entry,
      description: fm.description,
      snapshot: fm.snapshot,
      profile: fm.profile,
      mcp_servers: Array.isArray(fm.mcp_servers) ? fm.mcp_servers : undefined,
      prompt: body.trim(),
      dir,
    });
  }
  return out;
}

export async function getSkill(name: string): Promise<SkillMeta | null> {
  const all = await listSkills();
  return all.find(s => s.name === name) || null;
}

export async function deleteSkill(name: string): Promise<boolean> {
  const skill = await getSkill(name);
  if (!skill) return false;
  await fs.rm(skill.dir, { recursive: true, force: true });
  return true;
}
