import fs from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";
import { RUNS_DIR } from "./paths";

export type RunStatus = "running" | "success" | "error" | "abandoned";

export interface RunEvent {
  ts: number;
  type: "tool_use" | "text" | "system" | "result" | "error" | "stderr";
  payload: any;
}

export interface RunRecord {
  id: string;
  skill: string;
  profile?: string;
  status: RunStatus;
  startedAt: number;
  finishedAt?: number;
  events: RunEvent[];
  error?: string;
}

// In-memory registry. Also persisted per-run to .runs/{id}.json on finish.
// Stashed on globalThis so all route handlers share one instance in dev (where
// each route file otherwise gets its own module copy).
interface GlobalStore {
  registry: Map<string, RunRecord>;
  listeners: Map<string, Set<(e: RunEvent) => void>>;
  doneListeners: Map<string, Set<(r: RunRecord) => void>>;
}
const G = globalThis as unknown as { __runsStore?: GlobalStore };
const STORE: GlobalStore = G.__runsStore ?? (G.__runsStore = {
  registry: new Map(),
  listeners: new Map(),
  doneListeners: new Map(),
});
const REGISTRY = STORE.registry;
const LISTENERS = STORE.listeners;
const DONE_LISTENERS = STORE.doneListeners;

export function createRun(skill: string, profile?: string): RunRecord {
  const id = nanoid(10);
  const rec: RunRecord = {
    id, skill, profile,
    status: "running",
    startedAt: Date.now(),
    events: [],
  };
  REGISTRY.set(id, rec);
  return rec;
}

export function appendEvent(id: string, ev: Omit<RunEvent, "ts">): void {
  const rec = REGISTRY.get(id);
  if (!rec) return;
  const full: RunEvent = { ...ev, ts: Date.now() };
  rec.events.push(full);
  const ls = LISTENERS.get(id);
  if (ls) for (const fn of ls) fn(full);
}

export async function finishRun(id: string, status: RunStatus, error?: string): Promise<void> {
  const rec = REGISTRY.get(id);
  if (!rec) return;
  rec.status = status;
  rec.finishedAt = Date.now();
  if (error) rec.error = error;
  await persistRun(rec);
  const ls = DONE_LISTENERS.get(id);
  if (ls) for (const fn of ls) fn(rec);
  DONE_LISTENERS.delete(id);
  LISTENERS.delete(id);
}

export function getRun(id: string): RunRecord | undefined {
  return REGISTRY.get(id);
}

export function subscribe(id: string, onEvent: (e: RunEvent) => void, onDone: (r: RunRecord) => void): () => void {
  if (!LISTENERS.has(id)) LISTENERS.set(id, new Set());
  if (!DONE_LISTENERS.has(id)) DONE_LISTENERS.set(id, new Set());
  LISTENERS.get(id)!.add(onEvent);
  DONE_LISTENERS.get(id)!.add(onDone);
  return () => {
    LISTENERS.get(id)?.delete(onEvent);
    DONE_LISTENERS.get(id)?.delete(onDone);
  };
}

async function persistRun(rec: RunRecord): Promise<void> {
  await fs.mkdir(RUNS_DIR, { recursive: true });
  await fs.writeFile(path.join(RUNS_DIR, `${rec.id}.json`), JSON.stringify(rec, null, 2), "utf8");
}

export async function listRuns(limit = 50): Promise<RunRecord[]> {
  const live = Array.from(REGISTRY.values());
  let onDisk: RunRecord[] = [];
  try {
    const files = await fs.readdir(RUNS_DIR);
    onDisk = await Promise.all(
      files.filter(f => f.endsWith(".json")).map(async f => {
        try { return JSON.parse(await fs.readFile(path.join(RUNS_DIR, f), "utf8")); }
        catch { return null; }
      })
    ).then(arr => arr.filter((x): x is RunRecord => !!x));
  } catch {}
  const seen = new Set<string>();
  const merged: RunRecord[] = [];
  for (const r of [...live, ...onDisk]) {
    if (seen.has(r.id)) continue;
    seen.add(r.id);
    merged.push(r);
  }
  merged.sort((a, b) => b.startedAt - a.startedAt);
  return merged.slice(0, limit);
}
