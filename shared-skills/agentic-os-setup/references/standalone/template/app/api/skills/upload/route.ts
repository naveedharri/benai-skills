import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import AdmZip from "adm-zip";
import { SKILLS_DIR } from "@/lib/server/paths";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sanitize(name: string): string {
  return name.replace(/[^a-z0-9-_]/gi, "-").toLowerCase();
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");
  const rawName = form.get("name");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "file is required (multipart 'file')" }, { status: 400 });
  }
  const buf = Buffer.from(await (file as File).arrayBuffer());

  let zip: AdmZip;
  try { zip = new AdmZip(buf); }
  catch { return NextResponse.json({ error: "invalid zip" }, { status: 400 }); }

  const entries = zip.getEntries();
  const hasSkillMd = entries.some(e => !e.isDirectory && /(^|\/)SKILL\.md$/.test(e.entryName));
  if (!hasSkillMd) {
    return NextResponse.json({ error: "zip must contain a SKILL.md" }, { status: 400 });
  }

  const baseName = sanitize(
    (typeof rawName === "string" && rawName) ||
    (file as File).name?.replace(/\.zip$/i, "") ||
    `skill-${Date.now()}`
  );
  const dest = path.join(SKILLS_DIR, baseName);
  await fs.mkdir(dest, { recursive: true });

  // detect a single top-level wrapping dir so we strip it
  const topDirs = new Set<string>();
  for (const e of entries) {
    const first = e.entryName.split("/")[0];
    if (first) topDirs.add(first);
  }
  const stripTop = topDirs.size === 1 && entries.some(e => e.entryName.startsWith([...topDirs][0] + "/SKILL.md"));
  const prefix = stripTop ? [...topDirs][0] + "/" : "";

  for (const e of entries) {
    if (e.isDirectory) continue;
    let rel = e.entryName;
    if (prefix && rel.startsWith(prefix)) rel = rel.slice(prefix.length);
    if (!rel || rel.startsWith("..") || path.isAbsolute(rel)) continue;
    const outPath = path.join(dest, rel);
    if (!outPath.startsWith(dest)) continue;
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, e.getData());
  }

  return NextResponse.json({ ok: true, name: baseName });
}
