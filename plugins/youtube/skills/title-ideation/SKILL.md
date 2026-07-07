---
name: title-ideation
description: Generate a YouTube title shortlist for a new video using two parallel lenses, topic-based and pattern-based. Pulls the LAST 20 to 25 uploads from a locked comp set of competitor channels plus Ben's own channel (recent only, never all-time-popular), clusters them by subject and by structure, weights what is overperforming right now, then produces two labeled angle sets. Reasons about the video first, lets the fresh data reshape the angle, and never forces the topic into an irrelevant template. Uses reliable recent-upload pulls, not the unreliable vidiq_outliers endpoint. Use whenever Ben says "title ideation", "title angles", "title brainstorm", "give me title options", "what should I call this video", "title shortlist", or shares a rough video idea / transcript / reference videos and asks for titles.
---

# Title Ideation, Two-Lens and Recent-Only

Produce a title shortlist grounded in the video and in fresh comp-set data: two option sets, topic-based and pattern-based. Background and history: `references/design-notes.md` (do not read at runtime).

## Trigger

Run when Ben says "title ideation", "title angles", "title brainstorm", "title shortlist", "what should I call this video", "give me titles for X", or hands over a video idea, transcript, or reference videos and asks for titles.

Do NOT run for thumbnail design, full brief/outline, or weekly intel reports (dedicated skills exist).

## Connectors

- **YouTube connector**: `searchVideos`, `getVideoDetails`, `getChannelStatistics`, `getTranscripts`.
- vidIQ MCP optional as fallback: `vidiq_channel_videos` with `popular: false`, `vidiq_get_videos_by_ids`. Never `vidiq_outliers`.
- Every connector call runs inside a subagent, never in the main context (Phase 3).

## Recency rule (non-negotiable)

- Last **20 to 25 long-form uploads per channel**, ordered by date, capped to roughly the **last 6 months**. Exclude Shorts (`videoDuration: long`). If a channel posts rarely, keep 25 but note the dates and weight it lower.
- Rank by **views-per-day or views-vs-channel-average**, never raw views. Weight a subject or pattern by recurrence across channels AND climb speed.

## Workflow

Use `TaskCreate` to expose the phases.

### Phase 1, Intake

Get the topic, Ben's take, and optional inputs (transcript IDs, reference URLs, constraints, planned runtime). If something critical is ambiguous, use `AskUserQuestion` once.

### Phase 2, Load context (silent)

Read `Context/brand.md`, `Context/icp.md`, `Context/strategy.md` if present, latest daily note if any. These are small, read them directly.

If Ben shared transcript IDs or reference URLs, do NOT pull them inline. Spawn a subagent (batched with Phase 3's agents) that calls `fireflies_get_summary` / `getTranscripts` / `getVideoDetails` and returns core claims, strongest moments, and anything title-relevant in 10 lines or fewer.

### Phase 3, Fan out the data pull

**HARD GUARD, check before any pull:** connector calls in the main context are a failure of this skill, not a fallback. If you cannot spawn subagents in this environment (no Task/Agent capability), STOP, tell Ben "I can't spawn subagents here, the pull would run inline and flood the context. Proceed anyway?" and wait for his answer. Never pull inline silently.

Read `references/channel-list.md` now. Spawn **8 subagents in parallel, one per channel, in a single message**, one per table row, never skipping a channel, each given its row and these instructions:

1. `searchVideos` with `channelId`, `order: "date"`, `type: ["video"]`, `videoDuration: "long"`, `maxResults: 25`. Fallback if thin or the YouTube connector is unavailable: `vidiq_channel_videos` with `popular: false` (still inside the subagent; tell Ben the YouTube connector was missing so enrichment may be thinner).
2. Batch `getVideoDetails` (or `vidiq_get_videos_by_ids`) for view counts.
3. `getChannelStatistics` for subscriber count and channel-average views.
4. Apply the recency rule.
5. Compute views-per-day and views-vs-channel-average per video.
6. If empty, re-resolve the channel ID once via `searchVideos` with `type: "channel"`, retry, then give up.

Each subagent returns ONLY this, no raw API output:

```
CHANNEL: {name} | subs: {n} | channel avg views: {n} | cadence note: {if any}
| title | published | views | views/day | vs channel avg |
```

If a subagent fails, note the gap and continue with the rest. Never re-run a pull inline. Do NOT generate titles yet.

### Phase 4, Cluster two ways

Read `references/title-pattern-library.md` now (pattern names only, never a generator).

- **Subject clusters.** Group every title by what it is about. Per cluster: video count, channels, median views/day, 2 to 3 example titles with numbers. Rank by recent performance and call out the top 2 or 3 explicitly.
- **Structure patterns.** Separately, extract the title structures in use right now, with channels, recent titles, and numbers.
- **Ben's proven-format prior.** From Ben's own uploads, flag his overperformers and their formats, especially any adjacent to this video. A proven Ben format for the subject is a lead candidate, not something to avoid.

### Phase 5, Video first, then reshape

1. In plain language: core promise, viewer and their driver, single click reason, 3 to 5 honest angle hypotheses from the topic's own substance. No title language yet. If an angle could describe a different video unchanged, rewrite it.
2. Hold the video against the Phase 4 clusters. If the topic fits a proven high-performing cluster or Ben's proven format, let the framing change. Do not keep a weaker framing because it was written first.

### Phase 6, Two option sets, Ben picks

Read `references/output-template.md` now and produce the shortlist in that format: 3 to 4 topic-based candidates (Set A), 3 to 4 pattern-based candidates (Set B), rejected pattern-fills, and one recommendation plus an A/B alternative.

This is a decision point: present all 6 to 8 candidates at once and wait for Ben to pick or redirect. Do not settle on one title for him and do not make him re-prompt for alternatives.

## Core rules

1. Recent only. Never all-time-popular, never `vidiq_outliers`.
2. Fan out the data pull. The main context never holds raw API responses. If subagents are unavailable, stop and ask before pulling inline; inline-by-default is a skill failure.
3. Two lenses, two option sets, always separate.
4. Subject before structure. A proven on-subject category outranks a generic unrelated structure.
5. Ben's channel is the top-weighted prior.
6. Video-first, then reshape.
7. Patterns sharpen, never generate. Drop any pattern that makes a title generic or untrue, and say so.
8. Performance signal is velocity, not raw views.
9. No "build & sell / make money" framings for our ICP.
10. Time claims must match real runtime.
11. Never remake an existing Ben video (the exact video, not the format).
12. NEVER use em dashes.

## Self-improvement rule

Any time Ben corrects an output during the process, or explicitly likes one, ask whether that should become a permanent update to this skill. If yes, ALWAYS use the skill-creator skill to make the edit, updating the relevant SKILL.md step or reference file with the correction, new rule, or saved example (winning titles go into `references/title-pattern-library.md` or the relevant reference as examples). Never edit the skill files directly without the skill-creator, direct edits are not able to update the installed skill. Always ask first, never update the skill silently.

## References (progressive disclosure: read each ONLY at its named phase)

- `references/channel-list.md`, comp set table. Phase 3 only.
- `references/title-pattern-library.md`, pattern names for consistency. Phase 4 only.
- `references/output-template.md`, output format and vetting checklist. Phase 6 only.
- `references/design-notes.md`, background, history, provenance. Never at runtime, only when editing this skill.
