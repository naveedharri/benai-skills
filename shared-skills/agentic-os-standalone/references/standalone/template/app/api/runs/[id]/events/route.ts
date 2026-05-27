import { NextRequest } from "next/server";
import { getRun, subscribe } from "@/lib/server/runs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const rec = getRun(id);
  if (!rec) return new Response("not found", { status: 404 });

  const stream = new ReadableStream({
    start(controller) {
      const enc = new TextEncoder();
      const send = (event: string, data: any) =>
        controller.enqueue(enc.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));

      // Replay backlog so a late subscriber still gets context.
      send("hello", { id, status: rec.status, skill: rec.skill });
      for (const ev of rec.events) send("event", ev);

      if (rec.status !== "running") {
        send("done", { status: rec.status, error: rec.error });
        controller.close();
        return;
      }

      const unsub = subscribe(
        id,
        (ev) => send("event", ev),
        (done) => {
          send("done", { status: done.status, error: done.error });
          unsub();
          controller.close();
        }
      );
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
