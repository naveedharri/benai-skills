"use client";

import { RefreshAllSnapshotsButton } from "./RefreshButton";

export function RefreshAllAction({ profile }: { profile?: string; scope?: "team" | "profile" }) {
  return (
    <RefreshAllSnapshotsButton
      profile={profile}
      snapshots={["community", "youtube", "meetings", "comms", "intelligence", "research"]}
    />
  );
}
