import { NextRequest, NextResponse } from "next/server";
import { deleteSkill } from "@/lib/server/skills";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(_req: NextRequest, { params }: { params: { name: string } }) {
  const ok = await deleteSkill(params.name);
  if (!ok) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
