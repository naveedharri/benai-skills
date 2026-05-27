import { NextRequest, NextResponse } from "next/server";
import { startInlineRun } from "@/lib/server/sdk";
import { isValidSnapshot } from "@/lib/server/paths";
import { getSnapshotPrompt } from "@/lib/server/snapshot-prompts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: { snapshot: string } }) {
  if (!isValidSnapshot(params.snapshot)) {
    return NextResponse.json({ error: "unknown snapshot" }, { status: 400 });
  }
  const body = await req.json().catch(() => ({}));
  const profile = typeof body?.profile === "string" ? body.profile : undefined;

  const { prompt, mcp_servers } = getSnapshotPrompt(params.snapshot, profile);
  const rec = await startInlineRun({
    label: `refresh-${params.snapshot}`,
    prompt,
    mcp_servers,
    profile,
  });
  return NextResponse.json({ runId: rec.id, snapshot: params.snapshot });
}
