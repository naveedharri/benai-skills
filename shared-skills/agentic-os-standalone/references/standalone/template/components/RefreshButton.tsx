"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { refreshSnapshot } from "@/lib/client/runs-store";
import { useRuns } from "@/lib/client/useRuns";

interface Props {
  snapshot: "community" | "youtube" | "comms" | "meetings" | "intelligence" | "research";
  profile?: string;
  label?: string;
  variant?: "primary" | "accent" | "default";
}

export function RefreshButton({ snapshot, profile, label, variant = "primary" }: Props) {
  const router = useRouter();
  const runs = useRuns();
  const [thisRunId, setThisRunId] = useState<string | null>(null);
  const lastStatusRef = useRef<string | null>(null);
  const myRun = runs.find(r => r.runId === thisRunId);
  const isRunning = myRun?.status === "running" || myRun?.status === "starting";

  useEffect(() => {
    if (!myRun) return;
    if (lastStatusRef.current !== "success" && myRun.status === "success") {
      router.refresh();
    }
    lastStatusRef.current = myRun.status;
  }, [myRun?.status, myRun, router]);

  // any other run for the same snapshot
  const otherActive = !isRunning && runs.some(r =>
    r.skill === `refresh-${snapshot}` &&
    (r.status === "running" || r.status === "starting")
  );

  const onClick = async () => {
    const id = await refreshSnapshot(snapshot, profile);
    if (id) setThisRunId(id);
  };

  const cls = `cc-btn cc-btn-${variant}`;
  const disabled = isRunning || otherActive;
  const text = isRunning ? "Refreshing…" : otherActive ? "Refresh queued" : (label || "Refresh");

  return (
    <button className={cls} onClick={onClick} disabled={disabled} style={disabled ? { opacity: 0.7, cursor: "not-allowed" } : undefined}>
      <span className="cc-btn-ico">{isRunning ? "⟳" : "↻"}</span>
      <span>{text}</span>
    </button>
  );
}

export function RefreshAllSnapshotsButton({ profile, snapshots }: { profile?: string; snapshots: Props["snapshot"][] }) {
  const router = useRouter();
  const runs = useRuns();
  const [active, setActive] = useState(false);
  const anyMine = runs.some(r => active && snapshots.includes(r.skill.replace("refresh-", "") as any) && (r.status === "running" || r.status === "starting"));

  useEffect(() => {
    if (active && !anyMine && runs.length > 0) {
      setActive(false);
      router.refresh();
    }
  }, [active, anyMine, runs.length, router]);

  const onClick = async () => {
    setActive(true);
    for (const s of snapshots) await refreshSnapshot(s, profile);
  };

  return (
    <button className="cc-btn cc-btn-primary" onClick={onClick} disabled={anyMine}>
      <span className="cc-btn-ico">{anyMine ? "⟳" : "↻"}</span>
      <span>{anyMine ? "Refreshing…" : "Refresh all"}</span>
    </button>
  );
}
