import { NextResponse } from "next/server";
import { listSkills } from "@/lib/server/skills";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const skills = await listSkills();
  return NextResponse.json({
    skills: skills.map(s => ({
      name: s.name,
      description: s.description,
      snapshot: s.snapshot,
      profile: s.profile,
      mcp_servers: s.mcp_servers,
    })),
  });
}
