"use client";

import { useEffect, useState } from "react";
import { Card, Chip } from "@/components/Card";
import { useRuns } from "@/lib/client/useRuns";

interface ServerRun {
  id: string;
  skill: string;
  profile?: string;
  status: "running" | "success" | "error" | "abandoned";
  startedAt: number;
  finishedAt?: number;
}

function shortAgo(ts: number): string {
  const d = Math.max(0, Date.now() - ts);
  const s = Math.floor(d / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function RunsTableClient() {
  const [serverRuns, setServerRuns] = useState<ServerRun[]>([]);
  const clientRuns = useRuns();

  const load = async () => {
    const res = await fetch("/api/runs", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setServerRuns(data.runs || []);
    }
  };

  useEffect(() => {
    void load();
    const t = setInterval(load, 8000);
    return () => clearInterval(t);
  }, []);

  // Merge: client runs (live, in-memory) override server entries by id.
  const merged: ServerRun[] = [
    ...clientRuns.map(c => ({
      id: c.runId,
      skill: c.skill,
      profile: c.profile,
      status: (c.status === "starting" ? "running" : c.status) as ServerRun["status"],
      startedAt: c.startedAt,
    })),
    ...serverRuns.filter(s => !clientRuns.find(c => c.runId === s.id)),
  ].slice(0, 12);

  const toneFor = (s: ServerRun["status"]) =>
    s === "success" ? "primary" : s === "error" ? "alert" : s === "abandoned" ? "neutral" : "accent";

  return (
    <Card wide title="Run history (recent)">
      {merged.length === 0 ? (
        <p style={{ opacity: 0.6 }}>No runs yet. Trigger one from a profile dashboard or the Skills tab.</p>
      ) : (
        <table className="cc-table">
          <thead><tr><th>Profile</th><th>Skill</th><th>Status</th><th>Started</th></tr></thead>
          <tbody>
            {merged.map(r => (
              <tr key={r.id}>
                <td>{r.profile || "—"}</td>
                <td><strong className="cc-code">{r.skill}</strong></td>
                <td><Chip tone={toneFor(r.status) as any}>{r.status}</Chip></td>
                <td>{shortAgo(r.startedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}
