import { NextRequest, NextResponse } from "next/server";
import { startRun } from "@/lib/server/sdk";
import { listRuns } from "@/lib/server/runs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const skillName = body?.skill;
  const profile = body?.profile;
  if (!skillName || typeof skillName !== "string") {
    return NextResponse.json({ error: "skill is required" }, { status: 400 });
  }
  const rec = await startRun({ skillName, profile });
  return NextResponse.json({ runId: rec.id, skill: rec.skill, status: rec.status });
}

export async function GET() {
  const runs = await listRuns();
  return NextResponse.json({ runs });
}
