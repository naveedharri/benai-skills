import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import { MCP_CONFIG } from "@/lib/server/paths";
import { TENANT } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UNIPILE_BASE = TENANT.unipileBaseUrl.replace(/\/$/, "");

async function getUnipileKey(): Promise<string | null> {
  try {
    const raw = await fs.readFile(MCP_CONFIG, "utf8");
    const cfg = JSON.parse(raw);
    return cfg?.mcpServers?.unipile?.headers?.["X-API-KEY"] ?? null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { source, chat_id, message } = body as { source?: string; chat_id?: string; message?: string };

  if (!message || !message.trim()) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  if (source === "linkedin") {
    if (!chat_id) return NextResponse.json({ error: "chat_id required for linkedin" }, { status: 400 });
    if (!UNIPILE_BASE) return NextResponse.json({ error: "UNIPILE_BASE_URL not set in env" }, { status: 500 });
    const key = await getUnipileKey();
    if (!key) return NextResponse.json({ error: "unipile X-API-KEY not configured in .mcp.json" }, { status: 500 });

    const res = await fetch(`${UNIPILE_BASE}/api/v1/chats/${encodeURIComponent(chat_id)}/messages`, {
      method: "POST",
      headers: {
        "X-API-KEY": key,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ text: message }),
    });

    const text = await res.text();
    let data: any = text;
    try { data = JSON.parse(text); } catch {}

    if (!res.ok) {
      return NextResponse.json({ error: "unipile rejected the send", status: res.status, detail: data }, { status: 502 });
    }
    return NextResponse.json({ ok: true, source, data });
  }

  return NextResponse.json({ error: `send not implemented for source=${source}` }, { status: 501 });
}
