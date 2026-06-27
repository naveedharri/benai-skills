"use client";

import { useRuns } from "@/lib/client/useRuns";
import { dismissRun } from "@/lib/client/runs-store";

export function RunToast() {
  const runs = useRuns();
  const active = runs.filter(r => r.status === "running" || r.status === "starting");
  const recent = runs.filter(r => r.status === "success" || r.status === "error").slice(0, 3);
  const visible = [...active, ...recent];
  if (visible.length === 0) return null;

  return (
    <div style={{
      position: "fixed", right: 20, bottom: 20, zIndex: 1000,
      display: "flex", flexDirection: "column", gap: 10, maxWidth: 360,
    }}>
      {visible.map(r => {
        const last = r.events[r.events.length - 1];
        const summary =
          r.status === "starting" ? "starting…" :
          r.status === "success" ? "done" :
          r.status === "error" ? (r.error || "error") :
          last?.type === "tool_use" ? `tool: ${last.payload?.name}` :
          last?.type === "text" ? "thinking…" :
          "running…";
        const tone =
          r.status === "success" ? "var(--primary)" :
          r.status === "error" ? "var(--alert)" :
          "var(--accent)";
        return (
          <div key={r.runId} style={{
            background: "var(--canvas)", border: "var(--bd)", borderRadius: 12,
            boxShadow: "4px 4px 0 0 var(--dark)", padding: "10px 12px",
            fontSize: 13, lineHeight: 1.4,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <div style={{ fontWeight: 600 }}>
                <span style={{
                  display: "inline-block", width: 8, height: 8, borderRadius: "50%",
                  background: tone, marginRight: 6,
                }} />
                {r.skill}{r.profile ? ` · ${r.profile}` : ""}
              </div>
              <button
                onClick={() => dismissRun(r.runId)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0 }}
                aria-label="dismiss"
              >×</button>
            </div>
            <div style={{ marginTop: 4, color: "var(--ink-muted, #555)", fontFamily: "JetBrains Mono, ui-monospace, monospace", fontSize: 11 }}>
              {summary}
            </div>
          </div>
        );
      })}
    </div>
  );
}
