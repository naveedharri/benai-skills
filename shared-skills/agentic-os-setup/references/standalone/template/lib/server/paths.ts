import path from "node:path";

export const ROOT = process.cwd();
export const SKILLS_DIR = path.join(ROOT, ".claude", "skills");
export const RUNS_DIR = path.join(ROOT, ".runs");
export const SNAPSHOT_DIR = path.join(ROOT, "public", "data");
export const MCP_CONFIG = path.join(ROOT, ".mcp.json");

export const VALID_SNAPSHOTS = [
  "community", "youtube", "comms", "meetings", "intelligence", "research",
] as const;
export type SnapshotName = (typeof VALID_SNAPSHOTS)[number];

export function isValidSnapshot(name: string): name is SnapshotName {
  return (VALID_SNAPSHOTS as readonly string[]).includes(name);
}
