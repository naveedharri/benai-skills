import { NextRequest, NextResponse } from "next/server";
import { readSnapshot } from "@/lib/server/snapshot-writer";
import { isValidSnapshot } from "@/lib/server/paths";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { name: string } }) {
  if (!isValidSnapshot(params.name)) {
    return NextResponse.json({ error: "invalid snapshot name" }, { status: 400 });
  }
  const data = await readSnapshot(params.name);
  if (data == null) return NextResponse.json({ error: "not found" }, { status: 404 });
  return new NextResponse(JSON.stringify(data), {
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
