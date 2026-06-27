// =====================================================================
// Data layer — reads real snapshots from public/data/*.json.
// No mock/synthetic data. Fields with no real source return empty.
// File name preserved for import compatibility; will be renamed
// to lib/data.ts in a follow-up.
// =====================================================================
import type {
  CommunitySnapshot, YoutubeSnapshot, CommsSnapshot, MeetingsSnapshot,
  IntelligenceSnapshot, ResearchSnapshot, DailyRecord, RootDaily,
  TaskItem, RunRecord, ProfileBundle, TeamBundle, ProfileName, ProfileCardData,
} from "./types";

import fs from "node:fs";
import path from "node:path";

function readSnap<T>(name: string, fallback: T): T {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), "public", "data", `${name}.json`), "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

const community = () => readSnap<any>("community", {});
const youtube = () => readSnap<any>("youtube", {});
const comms = () => readSnap<any>("comms", {});
const meetings = () => readSnap<any>("meetings", {});
const intelligence = () => readSnap<any>("intelligence", {});
const research = () => readSnap<any>("research", {});

import { PROFILES as PROFILES_CONFIG } from "./config";
const PROFILES: ProfileName[] = [...PROFILES_CONFIG];

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

// -------- DAILIES -----------------------------------------------------
// No synthetic generators. Dailies are produced by the vault operator
// in another pipeline; the dashboard returns empty arrays until that
// source is wired through. Components handle empty state.
export function getLast7Dailies(): RootDaily[] { return []; }
export function getPrev7Dailies(): RootDaily[] { return []; }
export function getProfileDailies(_name: ProfileName, _days = 14): DailyRecord[] { return []; }

// -------- SNAPSHOTS ---------------------------------------------------
export function getCommunity(_name: ProfileName): CommunitySnapshot {
  return community() as unknown as CommunitySnapshot;
}
export function getYoutube(_name: ProfileName): YoutubeSnapshot {
  return youtube() as unknown as YoutubeSnapshot;
}
export function getComms(_name: ProfileName): CommsSnapshot {
  return comms() as unknown as CommsSnapshot;
}
export function getMeetings(_name: ProfileName): MeetingsSnapshot {
  return meetings() as unknown as MeetingsSnapshot;
}
export function getIntelligence(_name: ProfileName): IntelligenceSnapshot {
  return intelligence() as unknown as IntelligenceSnapshot;
}
export function getResearch(_name: ProfileName): ResearchSnapshot {
  return research() as unknown as ResearchSnapshot;
}

// -------- TASKS -------------------------------------------------------
// Real source: meetings.action_items. Owner names map to profiles via
// first-name match. Anything without a matched owner is dropped.
function ownerToProfile(owner?: string): ProfileName | null {
  if (!owner) return null;
  const first = owner.split(/\s+/)[0];
  return (PROFILES.find(p => p.toLowerCase() === first.toLowerCase()) ?? null);
}

export function getAllTasks(): TaskItem[] {
  const m = meetings();
  const items = (m?.action_items ?? []) as any[];
  return items
    .map(a => {
      const profile = ownerToProfile(a.owner);
      if (!profile) return null;
      return {
        text: a.text,
        due: a.due_iso ? a.due_iso.slice(0, 10) : null,
        profile,
        priority: (a.urgency === "high" ? "high" : a.urgency === "med" ? "med" : null) as any,
      } as TaskItem;
    })
    .filter((t): t is TaskItem => t != null);
}
export function getTasks(name: ProfileName): TaskItem[] {
  return getAllTasks().filter(t => t.profile === name);
}

// -------- RUNS --------------------------------------------------------
// Real source: Agent SDK runs store (lib/client/runs-store). No mocks here.
export function getRuns(_name: ProfileName): RunRecord[] { return []; }

// -------- PROFILE BUNDLE ----------------------------------------------
export function getProfileBundle(name: ProfileName): ProfileBundle {
  return {
    name,
    community: getCommunity(name),
    youtube: getYoutube(name),
    comms: getComms(name),
    meetings: getMeetings(name),
    intelligence: getIntelligence(name),
    research: getResearch(name),
    dailies: getProfileDailies(name),
    tasks: getTasks(name),
    runs: getRuns(name),
  };
}

// -------- TEAM BUNDLE -------------------------------------------------
export function getTeamBundle(): TeamBundle {
  const last7 = getLast7Dailies();
  const prev7 = getPrev7Dailies();
  const tasks = getAllTasks();
  const today = todayStr();

  const profiles: ProfileCardData[] = PROFILES.map(name => {
    const owned = tasks.filter(t => t.profile === name);
    return {
      name,
      focus: null,
      energy: null,
      wins: null,
      loops: null,
      lastSeen: null,
      weekTouched: owned.length,
      avatar: `/avatars/${name}.jpg`,
    };
  });

  return {
    today: last7[last7.length - 1] ?? null,
    last7,
    prev7,
    profiles,
    tasks,
    heat30: [],
    community: community(),
    youtube: youtube(),
    comms: comms(),
    meetings: meetings(),
    intelligence: intelligence(),
    ccusage: null,
  };
}
