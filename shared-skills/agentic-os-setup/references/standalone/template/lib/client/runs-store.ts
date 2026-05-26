"use client";

export type ClientRunStatus = "starting" | "running" | "success" | "error";

export interface ClientRunEvent {
  ts: number;
  type: string;
  payload: any;
}

export interface ClientRun {
  runId: string;
  skill: string;
  profile?: string;
  status: ClientRunStatus;
  events: ClientRunEvent[];
  error?: string;
  startedAt: number;
}

type Listener = (snapshot: ClientRun[]) => void;

const runs = new Map<string, ClientRun>();
const listeners = new Set<Listener>();
const snapshotListeners = new Map<string, Set<() => void>>();

function emit() {
  const arr = Array.from(runs.values()).sort((a, b) => b.startedAt - a.startedAt);
  for (const fn of listeners) fn(arr);
}

export function subscribeRuns(fn: Listener): () => void {
  listeners.add(fn);
  fn(Array.from(runs.values()).sort((a, b) => b.startedAt - a.startedAt));
  return () => listeners.delete(fn);
}

export function onSnapshotUpdated(name: string, fn: () => void): () => void {
  if (!snapshotListeners.has(name)) snapshotListeners.set(name, new Set());
  snapshotListeners.get(name)!.add(fn);
  return () => snapshotListeners.get(name)?.delete(fn);
}

function notifySnapshot(name: string) {
  const ls = snapshotListeners.get(name);
  if (ls) for (const fn of ls) fn();
}

export async function startRun(skill: string, profile?: string, snapshot?: string): Promise<string | null> {
  return _start("/api/runs", { skill, profile }, skill, profile, snapshot);
}

export async function refreshSnapshot(snapshot: string, profile?: string): Promise<string | null> {
  return _start(`/api/refresh/${snapshot}`, { profile }, `refresh-${snapshot}`, profile, snapshot);
}

async function _start(url: string, body: any, label: string, profile?: string, snapshot?: string): Promise<string | null> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) return null;
  const { runId } = await res.json();
  const skill = label;
  const run: ClientRun = {
    runId, skill, profile,
    status: "starting",
    events: [],
    startedAt: Date.now(),
  };
  runs.set(runId, run);
  emit();
  attachStream(runId, snapshot);
  return runId;
}

function attachStream(runId: string, snapshot?: string) {
  const es = new EventSource(`/api/runs/${runId}/events`);
  es.addEventListener("hello", (e: MessageEvent) => {
    const run = runs.get(runId);
    if (!run) return;
    run.status = "running";
    emit();
  });
  es.addEventListener("event", (e: MessageEvent) => {
    const run = runs.get(runId);
    if (!run) return;
    try { run.events.push(JSON.parse(e.data)); } catch {}
    emit();
  });
  es.addEventListener("done", (e: MessageEvent) => {
    const run = runs.get(runId);
    if (!run) { es.close(); return; }
    try {
      const data = JSON.parse(e.data);
      run.status = data.status === "success" ? "success" : "error";
      run.error = data.error;
    } catch {
      run.status = "success";
    }
    emit();
    es.close();
    if (snapshot && run.status === "success") notifySnapshot(snapshot);
  });
  es.onerror = () => {
    const run = runs.get(runId);
    if (run && run.status !== "success" && run.status !== "error") {
      run.status = "error";
      run.error = "stream interrupted";
      emit();
    }
    es.close();
  };
}

export function dismissRun(runId: string) {
  runs.delete(runId);
  emit();
}
