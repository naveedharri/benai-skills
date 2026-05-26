import path from "node:path";
import { SNAPSHOT_DIR, type SnapshotName } from "./paths";
import { ORG_NAME, PRIMARY_PROFILE, TENANT } from "../config";

interface PromptDef {
  mcp_servers: string[];
  buildPrompt: (snapshotPath: string, profile?: string) => string;
}

const COMMON_TAIL = `

# Output rules

- Use ONLY the listed MCP tools to gather data. Do NOT search the local filesystem for vault files or existing JSON to copy.
- If an MCP call fails, surface the error in the output (set the related field to [] or 0), do NOT fabricate numbers.
- When done, use the Write tool to save a single JSON object to the snapshot path. No markdown wrapper, no prose, no commentary outside the JSON.
- All ISO timestamps in UTC.
- For arrays: cap at the specified size. For numeric fields with no data: use 0. For strings: "".
`;

// Tenant-specific identifiers come from env vars via TENANT. Edit lib/config.ts
// to change the source, or override per-environment in your hosting provider.
const UNIPILE = `${TENANT.unipileBaseUrl}`.replace(/\/$/, "");
const UNIPILE_KEY_NOTE = process.env.MCP_UNIPILE_KEY
  ? "Use the X-API-KEY value from MCP_UNIPILE_KEY env var."
  : "(no MCP_UNIPILE_KEY in env — LinkedIn will be skipped)";

export const SNAPSHOT_PROMPTS: Record<SnapshotName, PromptDef> = {
  community: {
    mcp_servers: ["circle-community"],
    buildPrompt: (snapshotPath, profile) => `Refresh the community snapshot for the ${ORG_NAME} dashboard${profile ? ` (profile: ${profile})` : ""}.

# Goal
Use the \`circle-community\` MCP to gather the last 7 days of activity in the Circle.so community, then write a JSON snapshot to: ${snapshotPath}

# Steps (use these specific MCP tools)
1. \`community_info\` — total_members
2. \`posts_list\` (limit 15, sort=recent) — recent_posts
3. \`comments_list\` (limit 15) — recent_comments
4. \`search_all\` query "${profile || PRIMARY_PROFILE}" — mentions (limit 8)
5. \`chat_messages\` / DM listing — dms (limit 8)
6. From the post/comment data, synthesize: themes, pain_points, content_gaps, stuck_members, power_users, needs_my_reply

# Required JSON shape
\`\`\`json
{
  "updated_at": "<ISO now>",
  "stats": { "total_members": 0, "active_today": 0, "posts_today": 0, "comments_today": 0 },
  "recent_posts": [{ "title": "", "author": "", "comments": 0, "likes": 0, "posted_at": "", "url": "", "space": "" }],
  "recent_comments": [{ "post_title": "", "author": "", "snippet": "", "url": "", "posted_at": "" }],
  "mentions": [{ "author": "", "context": "", "url": "", "posted_at": "" }],
  "replies_to_me": [],
  "dms": [{ "from": "", "snippet": "", "url": "", "received_at": "", "unread": false }],
  "themes": [{ "name": "", "frequency_4w": 0, "trend": "rising|steady|falling", "sample_quotes": [""], "sentiment": "positive|mixed|negative|neutral" }],
  "pain_points": [{ "name": "", "frequency": 0, "severity": "low|med|high", "examples": [""], "first_seen_iso": "" }],
  "stuck_members": [{ "name": "", "url": "", "reason": "", "last_unanswered_question": "", "days_stuck": 0 }],
  "power_users": [{ "name": "", "url": "", "contribution_count_4w": 0, "notes": "" }],
  "content_gaps": [{ "question": "", "ask_count": 0, "best_source_post_url": "", "suggested_format": "" }],
  "needs_my_reply": [{ "url": "", "context": "", "from": "", "urgency": "low|med|high", "suggested_response_angle": "" }]
}
\`\`\`

Caps: arrays at 10 items. Synthesize pain_points/themes/power_users/needs_my_reply from the post+comment content you actually observed.
${COMMON_TAIL}`,
  },

  youtube: {
    mcp_servers: ["youtube", "vidiq"],
    buildPrompt: (snapshotPath, profile) => `Refresh the YouTube snapshot for the ${ORG_NAME} dashboard${profile ? ` (profile: ${profile})` : ""}.

# Goal
Use \`vidiq\` and \`youtube\` MCPs to gather your YouTube channel data. Write JSON to: ${snapshotPath}

# Channel identifiers
- Handle: ${TENANT.youtubeChannelHandle || "(set YOUTUBE_CHANNEL_HANDLE env)"}
- Channel ID: ${TENANT.youtubeChannelId || "(set YOUTUBE_CHANNEL_ID env)"}

# Steps
1. \`vidiq_user_channels\` — locate the channel (use the handle/ID above if known).
2. \`vidiq_channel_stats\` — subscribers, total_views, video_count.
3. \`vidiq_channel_performance_trends\` (7d) — deltas (subscribers_delta_7d, views_delta_7d).
4. \`vidiq_channel_videos\` (limit 10, sort=recent) — recent_videos.
5. \`vidiq_trending_videos\` or \`vidiq_outliers\` in your niche (limit 5) — trending (rich: thumbnail, channel, velocity, summary).
6. \`vidiq_video_comments\` for the top 3 recent videos (limit 10 each) — recent_comments.
7. From the comments: derive top_questions_in_comments (limit 8), audience_themes (limit 6).
8. From recent_videos vs avg views: video_performance (limit 5, with vs_channel_avg_pct and reason_hypothesis).

# Required JSON shape
\`\`\`json
{
  "updated_at": "<ISO now>",
  "channel": { "name": "", "handle": "", "channel_id": "", "url": "", "subscribers": 0, "total_views": 0, "video_count": 0, "subscribers_delta_7d": 0, "views_delta_7d": 0, "deltas_note": "" },
  "recent_videos": [{ "title": "", "video_id": "", "url": "", "thumbnail": "", "views": 0, "likes": 0, "comments": 0, "published_at": "" }],
  "trending": [{ "title": "", "url": "", "thumbnail_url": "", "channel": "", "views": 0, "velocity": "", "summary": "" }],
  "recent_comments": [{ "video_title": "", "video_url": "", "author": "", "text": "", "likes": 0, "published_at": "" }],
  "top_questions_in_comments": [{ "question": "", "video_title": "", "video_url": "", "like_count": 0, "ask_count": 0 }],
  "audience_themes": [{ "theme": "", "mention_count": 0, "sentiment": "positive|mixed|negative|neutral", "representative_comment": "" }],
  "video_performance": [{ "title": "", "url": "", "vs_channel_avg_pct": 0, "reason_hypothesis": "" }]
}
\`\`\`
${COMMON_TAIL}`,
  },

  meetings: {
    mcp_servers: ["fireflies"],
    buildPrompt: (snapshotPath, profile) => `Refresh the meetings snapshot for the ${ORG_NAME} dashboard${profile ? ` (profile: ${profile})` : ""}.

# Goal
Use \`fireflies\` MCP to fetch the last 14 days of meeting transcripts. Write JSON to: ${snapshotPath}

# Steps
1. \`fireflies_get_transcripts\` (limit 12, date filter: last 14d) — recent.
2. For each transcript: capture title, date_iso (starts_at), attendees, duration_minutes, url, type (1on1/team/client based on attendee count).
3. From summaries: extract action_items (cap 20). Each: text, owner, source_meeting_title, source_meeting_url, date_iso, status (open/done).
4. Extract decisions (cap 6): decision, context, source_meeting_title, source_meeting_url, documented (true/false), date_iso.
5. Extract client_signals (cap 8): per-client check-in. company, person, stage (discovery/active/closed), last_meeting_iso, next_action, sentiment_trend (positive/neutral/negative).
6. themes_in_calls (cap 8): recurring topics across multiple calls. theme, mention_count, first_call_iso, last_call_iso, representative_quote.
7. prospect_language (cap 5): notable phrases from prospects. phrase, source_meeting_url, context.
8. rollup: meetings_count_7d, total_hours_7d, avg_talk_time_ratio (0-1), questions_asked_7d, meetings_count_14d.

# Required JSON shape
\`\`\`json
{
  "updated_at": "<ISO now>",
  "rollup": { "meetings_count_7d": 0, "total_hours_7d": 0, "avg_talk_time_ratio": 0, "questions_asked_7d": 0, "meetings_count_14d": 0 },
  "recent": [{ "title": "", "date_iso": "", "attendees": [""], "duration_minutes": 0, "url": "", "type": "1on1|team|client" }],
  "action_items": [{ "text": "", "owner": "", "source_meeting_title": "", "source_meeting_url": "", "date_iso": "", "in_task_list": false, "status": "open|done" }],
  "decisions": [{ "decision": "", "context": "", "source_meeting_title": "", "source_meeting_url": "", "documented": false, "date_iso": "" }],
  "client_signals": [{ "company": "", "person": "", "stage": "", "last_meeting_iso": "", "next_action": "", "sentiment_trend": "" }],
  "themes_in_calls": [{ "theme": "", "mention_count": 0, "first_call_iso": "", "last_call_iso": "", "representative_quote": "" }],
  "prospect_language": [{ "phrase": "", "source_meeting_url": "", "context": "" }],
  "upcoming": []
}
\`\`\`
${COMMON_TAIL}`,
  },

  comms: {
    mcp_servers: ["unipile", "circle-community", "youtube", "vidiq"],
    buildPrompt: (snapshotPath, profile) => `Refresh the comms (multi-source inbox) snapshot for the ${ORG_NAME} dashboard${profile ? ` (profile: ${profile})` : ""}.

# Goal
Scan LinkedIn DMs, Circle community DMs, and YouTube comments for activity needing attention. Write a JSON snapshot rich with intelligence: draft replies, sender context, signal value. Save to: ${snapshotPath}

# Sources & MCPs

## LinkedIn (via unipile)
- Tenant base URL: \`${UNIPILE || "(set UNIPILE_BASE_URL env)"}\`
- ${UNIPILE_KEY_NOTE}
- LinkedIn account_id: \`${TENANT.unipileLinkedInAccountId || "(set UNIPILE_LINKEDIN_ACCOUNT_ID env)"}\`
- Do NOT call \`get-server-variables\`; it returns the wrong default. Use the tenant base URL above.
- Call all endpoints via \`mcp__unipile__execute-request\` with this shape:
  \`{ "harRequest": { "method": "GET", "url": "<full url>", "headers": [{ "name": "X-API-KEY", "value": "<MCP_UNIPILE_KEY>" }] } }\`
- Steps: list chats (\`/api/v1/chats?account_id=...&limit=25\`); for unread (\`unread_count > 0\`) or recently-active chats, fetch latest 2 messages (\`/api/v1/chats/{chat_id}/messages?limit=2\`).
- If \`UNIPILE_BASE_URL\` is not set, skip LinkedIn entirely and set \`totals.linkedin_dms = 0\`.

## Circle DMs (via circle-community)
- Login email: \`${TENANT.circleOwnerEmail || "(set CIRCLE_OWNER_EMAIL env)"}\`
- Paginate \`mcp__circle-community__chat_rooms\` with \`{ email: "<above>", per_page: 100, page: 1 }\` and \`page: 2\`. Filter to rooms where \`unread_messages_count > 0\`.
- For each unread room (limit 8), call \`mcp__circle-community__chat_messages\` with \`{ email: "<above>", chat_room_uuid: "<uuid>", per_page: 3 }\`.
- Per item: \`room_id\` = the room uuid; \`from\` = chat_room_name.
- If CIRCLE_OWNER_EMAIL is not set, skip Circle and set \`totals.circle_dms = 0\`.

## YouTube comments (via vidiq)
- Channel: \`${TENANT.youtubeChannelHandle || TENANT.youtubeChannelId || "(set YOUTUBE_CHANNEL_HANDLE or YOUTUBE_CHANNEL_ID env)"}\`
- \`vidiq_user_channels\` → channel → \`vidiq_channel_videos\` (limit 3, sort=recent).
- For each: \`vidiq_video_comments\` (limit 8). Pick the 5-8 comments that genuinely need a reply (questions, prospect signals, sponsorship asks). Skip generic "great video!" praise.

# Categorization
For every item, pick one bucket:
- **urgent** — time-sensitive (asap, today, broken, can't access), client/prospect signals (booking call, offer, payment), known high-value contact escalating
- **needs_reply** — real question or relationship signal, > 4h old, no reply yet
- **fyi** — automated notification, cold sponsorship pitch, low-value outreach

# Intelligence per item (this is the value — don't skip)
For each item include:
- \`sender_context\` — who this person is (LinkedIn headline, company, mutual ties, past history if visible). 1 short sentence.
- \`intel_signal\` — what they're actually asking / signaling. The subtext, not the surface text. 1 sentence.
- \`reason\` — why this is in this bucket. 1 short clause.
- \`suggested_action\` — concrete next step (reply, archive, forward, book call). 1 short sentence.
- \`draft_reply\` — a 2-3 sentence draft the recipient can edit and send. Direct, conversational, no buzzwords, no em-dashes. Skip for fyi items.

# Required JSON shape
For LinkedIn items, ALWAYS include \`chat_id\` (the Unipile chat id) so the dashboard can send replies via the MCP. For Circle items, include \`room_id\`. For YouTube, include \`video_id\` and \`comment_id\`.

\`\`\`json
{
  "updated_at": "<ISO now>",
  "totals": { "linkedin_dms": 0, "youtube_comments": 0, "emails_unread": 0, "circle_dms": 0 },
  "urgent":      [{ "source": "linkedin|circle|youtube", "from": "", "subject": "", "snippet": "", "url": "", "received_at": "", "chat_id": "", "room_id": "", "video_id": "", "comment_id": "", "sender_context": "", "intel_signal": "", "reason": "", "suggested_action": "", "draft_reply": "" }],
  "needs_reply": [{ "source": "", "from": "", "subject": "", "snippet": "", "url": "", "received_at": "", "chat_id": "", "room_id": "", "video_id": "", "comment_id": "", "sender_context": "", "intel_signal": "", "reason": "", "suggested_action": "", "draft_reply": "" }],
  "fyi":         [{ "source": "", "from": "", "subject": "", "snippet": "", "url": "", "received_at": "", "chat_id": "", "room_id": "", "sender_context": "", "intel_signal": "", "reason": "", "suggested_action": "" }],
  "recurring_senders": [{ "from": "", "source": "", "message_count": 0, "topics": [""], "pattern": "" }]
}
\`\`\`

Totals: \`linkedin_dms\` = count of unread LinkedIn chats; \`circle_dms\` = count of unread Circle DM rooms; \`youtube_comments\` = count of unreplied substantive YouTube comments across the 3 recent videos. \`emails_unread\` stays 0 unless email is wired up.

Caps: urgent 8, needs_reply 15, fyi 10.
${COMMON_TAIL}`,
  },

  intelligence: {
    mcp_servers: ["circle-community", "fireflies", "vidiq"],
    buildPrompt: (snapshotPath, profile) => `Refresh the intelligence (cross-source synthesis) snapshot for the ${ORG_NAME} dashboard${profile ? ` (profile: ${profile})` : ""}.

# Goal
Cross-source synthesis: community pain points (Circle) + meeting themes (Fireflies) + audience signals (VidIQ) → opportunity briefs, cross-validated themes, content opportunities, decisions to document, churn signals, unified action items. Write JSON to: ${snapshotPath}

# Steps
1. \`circle-community\` posts_list + comments_list (last 7d) — recurring questions, pain points.
2. \`fireflies_get_transcripts\` (last 7d) summaries — client themes, decisions.
3. \`vidiq_video_comments\` for top 3 recent videos — audience themes.
4. Cross-validated themes (10): themes appearing in 2+ sources. theme, sources [circle/fireflies/vidiq], combined_mention_count, priority (p0/p1/p2), why.
5. opportunity_briefs (3): title, summary, recommended_next_action.
6. content_opportunities (8): question, evidence, suggested_format, format_detail, priority.
7. unified_action_items (20): from meetings + comms. text, source, urgency, url, due_iso.
8. decisions_to_document (8): decision, source_meeting_url, date_iso, suggested_filename.
9. churn_signals (6): community members at risk. name, community_url, last_meeting_url, days_stuck, recommended_outreach.

# Required JSON shape
\`\`\`json
{
  "updated_at": "<ISO now>",
  "cross_validated_themes": [{ "theme": "", "sources": [""], "combined_mention_count": 0, "priority": "p0|p1|p2", "why": "" }],
  "unified_action_items": [{ "text": "", "source": "", "urgency": "low|med|high", "url": "", "due_iso": "" }],
  "decisions_to_document": [{ "decision": "", "source_meeting_url": "", "date_iso": "", "suggested_filename": "" }],
  "content_opportunities": [{ "question": "", "evidence": "", "suggested_format": "", "format_detail": "", "priority": "p0|p1|p2" }],
  "churn_signals": [{ "name": "", "community_url": "", "last_meeting_url": "", "days_stuck": 0, "recommended_outreach": "" }],
  "opportunity_briefs": [{ "title": "", "summary": "", "recommended_next_action": "" }]
}
\`\`\`
${COMMON_TAIL}`,
  },

  research: {
    mcp_servers: ["apify", "reddit"],
    buildPrompt: (snapshotPath, profile) => `Refresh the research (external signals) snapshot for the ${ORG_NAME} dashboard${profile ? ` (profile: ${profile})` : ""}.

# Goal
External AI ecosystem signal scanning. Sources: relevant news outlets, niche YouTube trends, Twitter/X via Apify, competitor channels. Write JSON to: ${snapshotPath}

# Steps
1. Apify tweet-scraper for accounts you care about (edit lib/server/snapshot-prompts.ts to set the list) — last 7d, limit 30. Distill into twitter_signals.
2. Apify youtube-scraper or vidiq for trending in your niche — youtube_trends (limit 8).
3. Identify recent industry announcements / releases relevant to your space — anthropic_updates (limit 8). Each: title, url, published_at, type (release/blog/announcement), summary, what_it_means_for_us, image_url.
4. competitor_activity (6): channels in your niche — recent uploads with performance vs their avg.
5. synthesis: { headline_signal (single most important takeaway, 1-2 sentences), content_opportunities (3-5 short bullets as strings), trends_to_watch (3-5 short bullets as strings) }

# Required JSON shape
\`\`\`json
{
  "updated_at": "<ISO now>",
  "window_hours": 168,
  "anthropic_updates": [{ "title": "", "url": "", "published_at": "", "type": "", "summary": "", "what_it_means_for_us": "", "image_url": "" }],
  "youtube_trends": [{ "title": "", "channel": "", "url": "", "thumbnail_url": "", "views": 0, "velocity": "", "published_at": "", "topic_cluster": "", "key_insight": "", "transcript_highlight": "" }],
  "twitter_signals": [{ "author": "", "handle": "", "url": "", "posted_at": "", "text": "", "engagement": 0, "topic": "" }],
  "competitor_activity": [{ "channel": "", "channel_url": "", "video_title": "", "video_url": "", "thumbnail_url": "", "published_at": "", "views": 0, "performance_vs_their_avg_pct": 0, "topic": "", "angle_summary": "" }],
  "synthesis": { "headline_signal": "", "content_opportunities": [""], "trends_to_watch": [""] }
}
\`\`\`
${COMMON_TAIL}`,
  },
};

export function getSnapshotPrompt(snapshot: SnapshotName, profile?: string): { prompt: string; mcp_servers: string[] } {
  const def = SNAPSHOT_PROMPTS[snapshot];
  const snapshotPath = path.join(SNAPSHOT_DIR, `${snapshot}.json`);
  return {
    prompt: def.buildPrompt(snapshotPath, profile),
    mcp_servers: def.mcp_servers,
  };
}
