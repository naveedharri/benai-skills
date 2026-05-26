// =====================================================================
// Agentic OS — domain types
// Mirrors the JSON shapes written to public/data/<snapshot>.json by the
// Agent SDK snapshot refresh runs.
// =====================================================================

export type { ProfileName } from "./config";
import type { ProfileName } from "./config";

// -------- COMMUNITY ----------------------------------------------------
export interface CommunitySnapshot {
  updated_at: string;
  stats: {
    total_members: number;
    active_today: number;
    posts_today: number;
    comments_today: number;
  };
  recent_posts: CommunityPost[];
  recent_comments: CommunityComment[];
  mentions: CommunityMention[];
  replies_to_me: CommunityComment[];
  dms: CommunityDM[];
  themes: CommunityTheme[];
}

export interface CommunityPost {
  title: string;
  author: string;
  comments: number;
  likes: number;
  posted_at: string;
  url: string;
  space: string;
}

export interface CommunityComment {
  post_title: string;
  author: string;
  snippet: string;
  url: string;
  posted_at: string;
}

export interface CommunityMention {
  author: string;
  context: string;
  url: string;
  posted_at: string;
}

export interface CommunityDM {
  from: string;
  snippet: string;
  url: string;
  received_at: string;
  unread: boolean;
}

export interface CommunityTheme {
  name: string;
  frequency_4w: number;
  trend: "rising" | "steady" | "falling";
  sample_quotes: string[];
  sentiment: "positive" | "mixed" | "negative" | "neutral";
}

// -------- YOUTUBE -----------------------------------------------------
export interface YoutubeSnapshot {
  updated_at: string;
  channel: {
    name: string;
    handle: string;
    channel_id: string;
    url: string;
    subscribers: number | null;
    total_views: number | null;
    video_count: number | null;
    subscribers_delta_7d: number | null;
    views_delta_7d: number | null;
    deltas_note?: string;
  };
  recent_videos: YoutubeVideo[];
  top_videos?: YoutubeVideo[];
  trending_topics?: { topic: string; mentions: number }[];
}

export interface YoutubeVideo {
  title: string;
  video_id: string;
  url: string;
  thumbnail: string;
  views: number;
  likes: number;
  comments: number;
  published_at: string;
}

// -------- COMMS (multi-source inbox) ----------------------------------
export interface CommsSnapshot {
  updated_at: string;
  totals: {
    linkedin_dms: number | null;
    youtube_comments: number | null;
    emails_unread: number | null;
    circle_dms: number | null;
  };
  urgent: CommsItem[];
  needs_reply: CommsItem[];
  fyi?: CommsItem[];
}

export interface CommsItem {
  source: "circle" | "gmail" | "slack" | "linkedin" | "youtube" | string;
  from: string;
  subject: string;
  snippet: string;
  url: string;
  received_at: string;
  reason: string;
  suggested_action: string;
}

// -------- MEETINGS ----------------------------------------------------
export interface MeetingsSnapshot {
  updated_at: string;
  upcoming?: Meeting[];
  recent?: Meeting[];
  action_items?: MeetingAction[];
  rollup?: Record<string, any>;
  [key: string]: any;
}

export interface Meeting {
  title: string;
  starts_at: string;
  duration_minutes?: number;
  participants?: string[];
  url?: string;
  source?: "fireflies" | "calendar" | string;
  summary?: string;
}

export interface MeetingAction {
  meeting: string;
  text: string;
  owner?: string;
  due?: string;
  status?: "open" | "done" | string;
}

// -------- INTELLIGENCE ------------------------------------------------
export interface IntelligenceSnapshot {
  updated_at: string;
  opportunity_briefs: OpportunityBrief[];
  cross_validated_themes: CrossTheme[];
  decisions_to_document?: { title: string; context: string }[];
  churn_signals?: { signal: string; member?: string; severity?: string }[];
}

export interface OpportunityBrief {
  title: string;
  summary: string;
  recommended_next_action: string;
  sources?: string[];
}

export interface CrossTheme {
  theme: string;
  priority: "p0" | "p1" | "p2" | string;
  sources: string[];
  combined_mention_count: number;
  why: string;
}

// -------- RESEARCH ----------------------------------------------------
export interface ResearchSnapshot {
  updated_at: string;
  topics: ResearchTopic[];
}

export interface ResearchTopic {
  title: string;
  summary: string;
  sources?: { label: string; url: string }[];
  saved_at?: string;
}

// -------- DAILY (profile-level self-reports) --------------------------
export interface DailyRecord {
  date: string; // YYYY-MM-DD
  profile: ProfileName;
  energy: number | null;        // 0..10
  focus: string | null;
  wins_today: number;
  open_loops: number;
  meetings_attended: number;
  outputs_published: number;
}

// -------- ROOT DAILY (team-level aggregate) ---------------------------
export interface RootDaily {
  date: string;
  meetings: number;
  meeting_minutes: number;
  slack_messages: number;
  slack_threads: number;
  circle_posts: number;
  circle_replies: number;
  escalations_open: number;
  escalations_resolved: number;
  tasks_created: number;
  tasks_completed: number;
  active_team: string[];
  escalation_items?: string[];
}

// -------- TASKS -------------------------------------------------------
export interface TaskItem {
  text: string;
  due?: string | null;
  profile?: ProfileName;
  priority?: "low" | "med" | "high" | null;
}

// -------- RUNS --------------------------------------------------------
export interface RunRecord {
  id: string;
  command: string;
  label: string;
  status: "queued" | "running" | "success" | "error";
  started_at: string;
  ended_at?: string;
  output_preview?: string;
}

// -------- PROFILE BUNDLE ----------------------------------------------
export interface ProfileBundle {
  name: ProfileName;
  community: CommunitySnapshot | null;
  youtube: YoutubeSnapshot | null;
  comms: CommsSnapshot | null;
  meetings: MeetingsSnapshot | null;
  intelligence: IntelligenceSnapshot | null;
  research: ResearchSnapshot | null;
  dailies: DailyRecord[];
  tasks: TaskItem[];
  runs: RunRecord[];
}

// -------- TEAM BUNDLE -------------------------------------------------
export interface TeamBundle {
  today: RootDaily | null;
  last7: RootDaily[];
  prev7: RootDaily[];
  profiles: ProfileCardData[];
  tasks: TaskItem[];
  heat30: { date: string; count: number }[];
  ccusage?: CCUsageAgg | null;
  // Real snapshots aggregated from public/data/*.json
  community?: any | null;
  youtube?: any | null;
  comms?: any | null;
  meetings?: any | null;
  intelligence?: any | null;
}

export interface ProfileCardData {
  name: ProfileName;
  focus: string | null;
  energy: number | null;
  wins: number | null;
  loops: number | null;
  lastSeen: string | null;
  weekTouched: number;
  avatar?: string | null;
}

// -------- ccusage -----------------------------------------------------
export interface CCUsageAgg {
  totals: {
    cost_usd: number;
    input_tokens: number;
    output_tokens: number;
    cache_read_tokens: number;
    cache_creation_tokens: number;
  };
  by_model: { model: string; cost_usd: number; tokens: number }[];
  by_month: { month: string; cost_usd: number; tokens: number }[];
}
