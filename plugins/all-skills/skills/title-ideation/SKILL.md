---
name: title-ideation
description: Generate a YouTube title shortlist for a new video using two parallel lenses, topic-based and pattern-based. Pulls the LAST 20 to 25 uploads from a locked comp set of competitor channels plus Ben's own channel (recent only, never all-time-popular), clusters them by subject and by structure, weights what is overperforming right now, then produces two labeled angle sets. Reasons about the video first, lets the fresh data reshape the angle, and never forces the topic into an irrelevant template. Uses reliable recent-upload pulls, not the unreliable vidiq_outliers endpoint. Use whenever Ben says "title ideation", "title angles", "title brainstorm", "give me title options", "what should I call this video", "title shortlist", or shares a rough video idea / transcript / reference videos and asks for titles.
---

# Title Ideation, Two-Lens and Recent-Only

## Why this skill exists

A title's job is to win the click against everything else in the feed right now. Two kinds of evidence tell us what wins: what subjects are currently overperforming in the niche (topic), and what phrasings are currently overperforming (pattern). This skill pulls both from fresh data and proposes angles from both, as two separate option sets.

Two failures we are explicitly fixing, because earlier versions kept committing them:

1. **Subject blindness.** The skill used to read titles only as structures (Stop X, 99% wrong, N things) and never grouped them by what they were *about*. So an obviously dominant, proven content category for the niche (for example "best skills" collection videos, where Ben's own "8 Claude Skills I Can't Live Without" is a 2.7x outlier and Nate Herk, Chase, and Nick all have skills-collection hits) got flattened into "an instance of the N-things pattern" and missed entirely. The single strongest signal is usually topical, so the skill must cluster by subject and rank by performance, not just match structure.

2. **Stale data.** Pulling all-time popular videos drags in titles from a year or more ago. Title strategy cannot be based on what worked last year. We pull only the last 20 to 25 uploads per channel.

The order is: understand the video first, then read the fresh recent data and cluster it by subject and by structure, then let that data reshape the angle (not just decorate a pre-locked one), then produce two option sets. The video grounds it. The data is allowed to change the framing. Patterns sharpen, they never generate a title that is untrue to the video.

## When to trigger

Fire this skill when Ben says any of:

- "Title ideation" / "title angles" / "title brainstorm" / "title shortlist"
- "What should I call this video"
- "Give me titles for X"
- Hands over a rough video idea or topic and asks for titles
- Hands over a meeting transcript or reference YouTube videos and asks to spin titles

Do NOT trigger this for: thumbnail design, full brief/outline, or weekly intel reports (use the dedicated skills).

## Prerequisites

### Connectors

- **YouTube connector**. Primary data source. Tools used: `searchVideos` (recent uploads by date), `getVideoDetails` (view counts for enrichment), `getChannelStatistics` (baselines), `getTranscripts` (for reference videos Ben shares).
- vidIQ MCP is optional. Do NOT use `vidiq_outliers` (see below). `vidiq_channel_videos` with `popular: false` and `vidiq_get_videos_by_ids` are acceptable fallbacks for recent uploads and enrichment.
- All connector calls happen inside subagents, never in the main context (see Phase 3). MCP responses are verbose; one channel pull can flood the conversation and knock the skill off its process.

### Vault context loaded silently at start

| What | Where | Why |
|---|---|---|
| Brand voice + signature phrases | `Context/brand.md` | Voice DNA, signature framings ("99% / be the 1%"), and what counts as off-brand live in the vetting |
| Audience emotional drivers | `Context/icp.md` | "Falling behind" and "be the person who actually uses AI" are the emotional centers |
| Strategic priorities | `Context/strategy.md` (if present) | Confirms alignment with current OKRs |
| Latest daily note | `Team/BenAI/Profiles/Ben/Daily/` (latest, if any) | Recent context |

If Ben shared a meeting transcript or reference YouTube URLs, pull those too (see Phase 2).

## Why we dropped outliers and all-time-popular

`vidiq_outliers` returns nothing for channels that perform consistently (Ben's channel especially), so most channels came back empty and the surviving few produced near-identical angles every run.

All-time-popular pulls (`getChannelTopVideos` with `popular: true`) surface evergreen videos from a year or more ago, which misrepresents what is winning now.

The replacement: pull each channel's last 20 to 25 uploads (recent, long-form), enrich with view counts, and judge by recent performance. This is reliable, never empty, and current.

## Recency rule (non-negotiable)

- Pull the **last 20 to 25 long-form uploads per channel**, ordered by date.
- Hard cap the window to roughly the **last 6 months**. If a channel posts rarely and 25 uploads reach further back, keep 25 but note the dates.
- Exclude Shorts (`videoDuration: long`).
- Recent uploads have had less time to accumulate views, so do NOT rank on raw views alone. Use views-per-day (viewCount / days since publish) or views-vs-channel-average as the performance signal, and weight a subject or pattern by how often it recurs across channels AND how fast its videos are climbing, not by absolute view count.

## The locked comp set

Channel IDs are hardcoded so resolution never fails. Always include Ben's channel.

| Channel | Handle | Channel ID | Notes |
|---|---|---|---|
| **Ben's own channel** | `@BenAI92` | `UC3KK7ENB_ierAXvrxVNnbZQ` | Highest-weight prior. His audience is the target. Always include. |
| Jeff Su | `@JeffSu` | `UCwAnu01qlnVg1Ai2AbtTMaA` | Productivity + AI tools, broad audience |
| Nick Saraev | `@nicksaraev` | `UCbo-KbSjJDG6JWQ_MTZ_rNA` | AI agency. "Build & Sell" framing is off-limits for our ICP titles |
| Nate Herk | `@nateherk` | `UC2ojq-nuP8ceeHqiroeKhBA` | n8n + AI automation, high cadence |
| Chase AI | `@Chase-H-AI` | `UCoy6cTJ7Tg0dqS-DI-_REsA` | Claude + n8n, direct competitor |
| Liam Ottley | `@LiamOttley` | `UCui4jxDaMb53Gdh-AZUTPAg` | AI agency. "Make money / build & sell" off-limits for our ICP |
| Itssssss_Jack | `@Itssssss_Jack` | resolve once and cache | Dev-niche, lower signal for our non-coder audience |
| Matt Pocock | `@mattpocockuk` | resolve once and cache | Dev tools, lower signal for our audience |

To resolve an unknown ID once: `searchVideos` with `type: "channel"`, take the `channelId`, write it into this table.

## The workflow

Use `TaskCreate` to expose the phases.

---

### Phase 1, Intake

Get the topic, Ben's take, and any optional inputs (transcript IDs, reference URLs, constraints, planned runtime). If something critical is ambiguous, use `AskUserQuestion` once.

---

### Phase 2, Load context in parallel (silent)

Read `Context/brand.md`, `Context/icp.md`, `Context/strategy.md` if present, the latest daily note if any. These are small files, read them directly.

If Ben shared transcript IDs or reference YouTube URLs, do NOT pull them in the main context. Spawn a subagent (in the same parallel batch as Phase 3's channel agents) that calls `fireflies_get_summary` / `getTranscripts` / `getVideoDetails` and returns only: the video's core claims, the strongest moments, and anything title-relevant, in 10 lines or fewer.

---

### Phase 3, Fan out the data pull (recent only, one subagent per channel)

This is the MCP-heavy, research-heavy step: 8 channels, each needing a recent-uploads pull plus view-count enrichment plus a channel baseline. Raw MCP responses for that are tens of thousands of tokens. Never run it in the main context. The main agent orchestrates; subagents touch the connectors.

Spawn **8 subagents in parallel, one per comp-set channel, in a single message**. Each subagent receives the channel name, handle, and hardcoded ID from the comp-set table, plus these instructions:

1. `searchVideos` with `channelId`, `order: "date"`, `type: ["video"]`, `videoDuration: "long"`, `maxResults: 25`. Fallback if thin: `vidiq_channel_videos` with `popular: false`.
2. Batch `getVideoDetails` (or `vidiq_get_videos_by_ids`) on the returned IDs to get view counts.
3. `getChannelStatistics` for subscriber count and channel-average views.
4. Drop Shorts and anything older than the recency window. If the channel posts rarely, keep the last 25 but flag the dates.
5. Compute views-per-day and views-vs-channel-average for each video.
6. If the pull comes back empty, re-resolve the channel ID once via `searchVideos` with `type: "channel"` and retry before giving up.

Each subagent returns ONLY this, no raw API output:

```
CHANNEL: {name} | subs: {n} | channel avg views: {n} | cadence note: {if any}
| title | published | views | views/day | vs channel avg |
{one row per video, newest first}
```

The main context receives 8 compact tables and stays clean for the clustering and title work in Phases 4 to 6. If a subagent fails, note the gap and continue with 7 channels rather than re-running the pull inline.

Do NOT generate titles yet.

---

### Phase 4, Cluster the fresh data two ways

Build both views of the data before any angle work.

**Subject clusters.** Group every pulled title by what it is about (for example: skills/collections, agents, a specific tool or model, workflows/automations, business/money, content creation, comparisons, news/reactions). For each cluster record: how many videos, which channels, median views-per-day, and 2 to 3 example titles with their numbers. Rank clusters by recent performance. Call out the top 2 or 3 on-subject clusters explicitly. This is the step that surfaces dominant categories like "best skills" collections.

**Structure patterns.** Separately, extract the title structures in use right now (for example: Stop X / do Y instead, N% do X wrong, The Only X You Need, N things/skills, X in N minutes, first-person "I tried / I built", contrarian call-out, X just changed Y). For each, note which channels and recent titles use it, with numbers. Use `references/title-pattern-library.md` for consistent pattern names only.

**Ben's proven-format prior.** From Ben's own recent uploads, identify his overperformers and the formats they use, especially any topically adjacent to this video. If Ben already has a proven format for this subject, flag it as a lead candidate, not something to avoid. The no-duplication rule means "do not remake the exact same video," NOT "avoid the proven format."

---

### Phase 5, Reason about the video, then let the data reshape it

1. **Video-first grounding.** In plain language: the core promise, the viewer and their driver, the single click reason, and 3 to 5 honest angle hypotheses drawn from the topic's own substance. No title language yet. If an angle could describe a different video unchanged, it is too generic, rewrite it.
2. **Reshape pass.** Now hold the video against the Phase 4 clusters. Ask: does this topic belong in one of the proven high-performing subject clusters, and could it be packaged into that category or into Ben's proven format? Let the framing change if the data says so. Do not keep a weaker framing just because it was the first one written.

---

### Phase 6, Produce TWO labeled option sets

**Option Set A, Topic-based.** Angles that ride a proven on-subject cluster or Ben's proven format. For each: the title, the subject cluster it rides, the recent evidence (2 to 3 real titles from the last-25 pull with numbers), the implied video structure, and an on-brand check. These tend to be the safest bets because they match a demonstrated current appetite.

**Option Set B, Pattern-based.** Angles built by applying a currently-winning title structure to this video, only where the structure genuinely sharpens a real angle without distorting it. For each: the title, the pattern used, the recent evidence, the implied structure, and an on-brand check. If a pattern would make the title vaguer or untrue, do not use it, and note it under rejected pattern-fills.

Aim for 3 to 4 candidates per set. Vet everything against `brand.md` (no hype overpromise, no "build & sell / make money" framings for our ICP, signature framings welcome where they fit, NEVER em dashes). Never propose a title that remakes an existing Ben video.

Close with:

- **Rejected pattern-fills:** patterns that did not fit this topic and why, so the reasoning is visible.
- **Recommendation:** the single strongest candidate across both sets, with reasoning that references the subject-cluster evidence and Ben's own performance, plus one A/B alternative.

---

## Output schema

Single markdown response in chat. Persist to `Projects/youtube/{video-slug}/title-shortlist.md` only if asked.

```markdown
## Video
{Topic + Ben's take, one line}

## Top subject clusters right now (last 20 to 25 uploads per channel)
{Ranked clusters: count, channels, median views/day, example titles + numbers}

## Title structures winning right now
{Patterns in use, with recent example titles + numbers}

## Ben's proven format for this subject (if any)
{Flag it, with his own numbers}

## What this video actually is (video-first)
- Core promise / viewer + driver / single click reason / 3 to 5 angle hypotheses
- Reshape note: which proven cluster or format this video should ride, if any

## Option Set A, topic-based
{3 to 4 titles, each: subject cluster ridden, recent evidence, implied structure, on-brand check}

## Option Set B, pattern-based
{3 to 4 titles, each: pattern used, recent evidence, implied structure, on-brand check}

## Rejected pattern-fills
{Patterns that did not fit and why}

## Recommendation
{Strongest across both sets + one A/B alternative, with reasoning}
```

## Core rules

1. **Recent only.** Last 20 to 25 long-form uploads per channel, capped to roughly 6 months. Never all-time-popular, never `vidiq_outliers`.
2. **Fan out the data pull.** All MCP-heavy pulls run in parallel subagents (one per channel) that return compact tables. The main context never holds raw API responses.
3. **Two lenses, two option sets.** Always deliver topic-based and pattern-based angles separately.
4. **Subject before structure.** Cluster by subject and rank by recent performance before reaching for title structures. A proven on-subject category outranks a generic structure unrelated to the subject.
5. **Ben's channel is the top-weighted prior.** A proven Ben format for the subject leads, it is not avoided.
6. **Video-first, then reshape.** Ground in the topic, then let the fresh data change the framing.
7. **Patterns sharpen, never generate.** Drop any pattern that makes a title generic or untrue, and say so.
8. **Performance signal is velocity, not raw views,** because recent uploads are young. Use views-per-day or views-vs-channel-average and recurrence across channels.
9. **No "build & sell / make money" framings** for our ICP.
10. **Time claims must match real runtime.**
11. **Never remake an existing Ben video.** Narrow this to the exact video, not the format.
12. **NEVER use em dashes.**

## Common failure modes

- **Subject blindness (historical failure).** Symptom: the obvious dominant category for the topic is absent from the options. Fix: Phase 4 subject clustering is mandatory and its top clusters must show up in Option Set A.
- **Stale data (historical failure).** Symptom: example titles are months or a year old. Fix: enforce the recency rule, drop anything outside the window.
- **Context flooding (historical failure).** Symptom: after the data pull the skill drifts, forgets the output schema, or stops following its own phases. Fix: Phase 3 always runs in subagents that return compact tables. If a pull accidentally ran inline, do not paste more raw data, summarize and move on.
- **Template-first drift.** Symptom: punchy titles that could be about any video. Fix: return to the Phase 5 angle, ship plain if no pattern fits.
- **Channel ID does not resolve.** Use the hardcoded ID, else re-resolve once and update the table.
- **A channel posts rarely.** Keep its last 25 even if older, but note the dates and weight it lower.

## Customization

- Swap a channel: edit the comp set table. The dev-niche channels are first to replace for the non-coder audience.
- Adjust recency: change the 20 to 25 count or the 6-month cap in the Recency rule and Phase 3.
- Pattern naming aid: `references/title-pattern-library.md` for consistent names only, never a generator or a data source.

## References

- `references/title-pattern-library.md`, pattern names for consistency.

## Provenance

- 2026-07-07 v4: moved the Phase 3 data pull behind 8 parallel subagents (one per channel) returning compact tables, and long transcript/reference pulls behind a subagent in Phase 2, per the connector-behind-subagent rule in benai-skill-creator-skill. Added the fan-out core rule and the context-flooding failure mode. Bundled the pattern library reference into the skill.
- 2026-06-08 v3: switched the data pull from all-time-popular to the last 20 to 25 recent uploads per channel (capped to ~6 months) after stale year-old titles kept surfacing. Added two-lens output (topic-based + pattern-based as separate option sets), mandatory subject clustering with performance ranking, and Ben's-proven-format-as-lead prior, after the skill repeatedly missed the dominant "best skills" content category that includes Ben's own 2.7x-outlier skills video. Performance signal changed to views-per-day to account for young uploads.
- v2: removed `vidiq_outliers` (returned empty for consistent channels), hardcoded channel IDs, reordered to video-first.
