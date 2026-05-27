import { NextRequest, NextResponse } from "next/server";
import { getRun } from "@/lib/server/runs";
import fs from "node:fs/promises";
import path from "node:path";
import { RUNS_DIR } from "@/lib/server/paths";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const live = getRun(params.id);
  if (live) return NextResponse.json(live);
  try {
    const raw = await fs.readFile(path.join(RUNS_DIR, `${params.id}.json`), "utf8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
}
