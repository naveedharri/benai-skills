"use client";

import { ReactNode } from "react";
import { RefreshButton } from "./RefreshButton";

type SnapshotName = "community" | "youtube" | "comms" | "meetings" | "intelligence" | "research";

export function ViewWithRefresh({
  snapshot, profile, children, updatedAt,
}: {
  snapshot: SnapshotName;
  profile?: string;
  updatedAt?: string;
  children: ReactNode;
}) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 12 }}>
        <div style={{ fontSize: 12, color: "var(--ink-muted, #666)", fontFamily: "JetBrains Mono, ui-monospace, monospace" }}>
          {updatedAt ? `updated ${shortAgo(updatedAt)}` : "no snapshot yet"}
        </div>
        <RefreshButton snapshot={snapshot} profile={profile} variant="primary" />
      </div>
      {children}
    </>
  );
}

function shortAgo(iso: string): string {
  try {
    const d = Math.max(0, Date.now() - new Date(iso).getTime());
    const m = Math.floor(d / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  } catch { return iso; }
}
