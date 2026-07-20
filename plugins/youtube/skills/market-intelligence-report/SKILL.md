---
name: market-intelligence-report
description: Produce a Market Intelligence Report — YouTube competitive research, channel analysis, content gap discovery, idea generation, daily scanning, and AI trend scouting — then render it as a polished soft-UI HTML dashboard.
  Use this skill whenever the user says "market intelligence report", "market intel", "intelligence report", "research channels", "analyze competitors",
  "find trending topics", "niche analysis", "competitive research", "scrape YouTube channels", "generate ideas", "brainstorm videos",
  "video ideas", "content ideas", "ideation", "daily scan", "morning scan", "what's new today", "scan for updates",
  "trend scout", "what's trending on twitter", "twitter scan", "X scan", "viral topics", "what's viral",
  "build a dashboard", or wants to understand the YouTube competitive landscape and come up with video concepts.
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, AskUserQuestion, Skill
---

# Market Intelligence Report

This skill conducts YouTube + Twitter/X competitive intelligence — analyzing channels, discovering content gaps, generating video ideas, and scanning for daily opportunities — and then packages the findings into a **polished soft-UI HTML dashboard** the user can open, screenshot, or share.

Every run has two halves:
1. **Gather + synthesize** the intelligence (Standard Workflows below).
2. **Render the dashboard** from the bundled template using the `soft-ui` aesthetic (see "Dashboard Output").

## Connectors

### `youtube` connector (Primary for all YouTube data)

The `@kirbah/mcp-youtube` connector is the **primary data source** for YouTube search, video details, channel stats, and transcripts. It uses the YouTube Data API v3 (free tier: 10,000 units/day).

| Tool | What it does | API Cost (units) |
|------|-------------|-----------------|
| `searchVideos` | Search videos/channels by keyword with `recency` filter (`pastHour`, `pastDay`, `pastWeek`, `pastMonth`, `pastQuarter`, `pastYear`) | **100 per call** |
| `getVideoDetails` | Video metadata, stats, duration, category | **~1 per video** |
| `getChannelStatistics` | Subscriber count, view count, video count | **~1 per channel** |
| `getChannelTopVideos` | Top/recent videos for a channel | **~3 per call** |
| `getVideoComments` | Video comments | **~1 per call** |
| `getVideoCategories` | List video categories | **~1 per call** |
| `getTrendingVideos` | Trending videos by region/category | **~1 per call** |
| `getTranscripts` | Video transcripts (captions) | **Free (0 cost)** |

**Quota budget:** 10,000 units/day. `searchVideos` is the most expensive at 100 units — use it intentionally (~50-80 searches/day max). All other tools cost ~1 unit each. Transcripts are always free.

### `apify` connector (Fallback for YouTube search + primary for Twitter/X)

Use Apify as a **fallback** if the YouTube connector hits quota limits, or as the **primary** source for Twitter/X data.

#### YouTube fallback via `automation-lab/youtube-scraper`

Uses YouTube's InnerTube API (direct HTTP, no browser) — no API key needed, no quota limits.

| Capability | How | Cost |
|-----------|-----|------|
| Search videos by keyword | `searchQueries` array | $0.005/run + $0.003/video |
| Get video details | Pass video URLs via `startUrls` | $0.005/run + $0.003/video |
| Get channel data | Pass channel URLs via `startUrls` | $0.005/run + $0.003/channel |

Can combine search queries + video URLs + channel URLs in a **single run**.

**Input examples:**
```json
// Search by keyword
{ "searchQueries": ["Claude AI tutorial"], "maxResults": 20 }

// Scrape specific channel
{ "startUrls": [{"url": "https://www.youtube.com/@channelname"}], "maxResults": 50 }

// Combined: search + channel + video in one run
{ "searchQueries": ["Claude AI tutorial"], "startUrls": [{"url": "https://www.youtube.com/@channelname"}], "maxResults": 20 }
```

#### Twitter/X scraping via `apidojo/twitter-scraper-lite` (Primary)

`apidojo/twitter-scraper-lite` (Twitter Scraper Unlimited) is the primary Twitter actor. Use this for all Twitter/X calls.

| Parameter | Type | What it does |
|-----------|------|-------------|
| `searchTerms` | string[] | Keyword search. Supports Twitter advanced syntax (`"from:handle"`, `"to:handle"`) |
| `twitterHandles` | string[] | Direct handle scraping — preferred for watchlist batch scanning |
| `author` | string | Single author filter |
| `start` / `end` | string | Date range filter (ISO 8601). Use for 48-hour lookback windows |
| `minimumFavorites` | int | Engagement floor — only return tweets with N+ likes |
| `minimumRetweets` | int | Only return tweets with N+ retweets |
| `sort` | enum | `"Top"`, `"Latest"`, or `"Latest + Top"` |
| `maxItems` | int | Max tweets to return per call |
| `tweetLanguage` | string | ISO 639-1 language code (e.g., `"en"`) |

**Watchlist scan example:**
```json
{ "twitterHandles": ["AnthropicAI", "claudeai", "trq212"], "maxItems": 50, "start": "2026-04-13T06:00:00Z", "sort": "Latest" }
```

**Keyword scan example:**
```json
{ "searchTerms": ["Claude Cowork", "Anthropic launch"], "maxItems": 30, "sort": "Top", "minimumFavorites": 100 }
```

#### Twitter/X fallback chain (IMPORTANT)

When a Twitter call fails or returns empty (`noResults: true`), follow this **exact order**:

1. **Switch actor first** — retry the same request with `apidojo/tweet-scraper` using identical input params. Do NOT relax filters on the primary actor. The most likely cause of empty results is the actor being down, not the filters being too strict.
2. **Only if both actors fail** — then relax filters (remove date range, lower `minimumFavorites`, broaden `searchTerms`).
3. **Only if both actors fail with relaxed filters** — report the failure to the user and continue with other data sources.

**Never** relax filters or remove date ranges as a first response to empty results. Switch actor first.

### `vidiq` connector (YouTube SEO, keyword research, outlier/breakout discovery)

The `vidiq` connector exposes vidIQ's proprietary YouTube intelligence layer — data the public YouTube Data API does not provide. Use it whenever you need search demand, competition scores, viral outliers, breakout channels, or title/thumbnail scoring.

| Tool | What it does | When to use |
|------|-------------|-------------|
| `vidiq_keyword_research` | Search volume, competition score, related keywords for a YouTube query | Idea validation, gap analysis, title brainstorming |
| `vidiq_outliers` | Videos significantly outperforming a channel's baseline (viral hits) | Identify what's working in the niche right now |
| `vidiq_breakout_channels` | Channels growing unusually fast in a niche | Discover emerging competitors before they're obvious |
| `vidiq_trending_videos` | Trending videos by category/region | Trend scouting and daily scans |
| `vidiq_trend_categories` | Trending category breakdown | Understand which topic clusters are hot |
| `vidiq_channel_analytics` | Deep channel performance data (engagement, growth, view velocity) | Competitive research on a specific channel |
| `vidiq_channel_performance_trends` | Channel growth/performance trends over time | Long-arc competitor tracking |
| `vidiq_channel_stats` | Channel statistics snapshot | Quick channel overview |
| `vidiq_channel_videos` | Channel's video list with vidIQ metrics | Pull recent videos with engagement scoring |
| `vidiq_similar_channels` | Channels similar to a given channel | Competitor discovery beyond the known set |
| `vidiq_score_title` | Score a draft video title for SEO/CTR | Ideation refinement, before pushing to outline |
| `vidiq_score_thumbnail` | Score a thumbnail for CTR | Pre-publish thumbnail validation |
| `vidiq_video_stats` | vidIQ's video stats (views, engagement, score) | Cross-check against YouTube `getVideoDetails` |
| `vidiq_video_comments` | Video comments with vidIQ enrichment | Audience signal mining |
| `vidiq_video_transcript` | Video transcript via vidIQ | Backup transcript source if YouTube `getTranscripts` fails |
| `vidiq_get_videos_by_ids` / `vidiq_get_channels_by_ids` | Bulk lookup by ID | Batch enrichment |
| `vidiq_balance` | Remaining vidIQ API balance | Quota check |

**When vidIQ wins over YouTube/Apify:**
- **Keyword research:** `vidiq_keyword_research` returns search volume + competition score, which YouTube Data API does not expose. Use this for every idea generation pass.
- **Outliers:** `vidiq_outliers` identifies viral breakouts in a channel's recent uploads automatically — no need to compute "3x channel average" manually.
- **Breakout channels:** `vidiq_breakout_channels` surfaces channels gaining momentum that wouldn't show up in keyword search yet.
- **Title/thumbnail scoring:** `vidiq_score_title` and `vidiq_score_thumbnail` give SEO/CTR scores before publishing.

## Reference Documents

| File | Contains |
|------|----------|
| `references/youtube-strategy.md` | Strategic positioning, content strategy, competitive landscape |
| `references/content-tier-guide.md` | 3 video formats: Big Feature Launch, Bundled Small Updates, How-To for Business |
| `references/niche-analysis-framework.md` | Channel analysis methodology |
| `references/idea-generation-framework.md` | Ideation methods: gap analysis, trend riding, format innovation, audience needs |
| `references/validation-methodology.md` | Idea scoring framework |
| `references/export-templates.md` | Output schemas for `niche-analysis.json` and `niche-report.md` |
| `references/icp-ideal-customer-profile.md` | Target audience: non-developer professionals using AI tools |
| `references/youtube-scraping-guide.md` | How the scraper collects data |
| `references/twitter-watchlist.md` | 330+ scored/tiered Twitter handles for ecosystem monitoring |
| `references/anthropic-official-sources.md` | Official Anthropic/Claude update sources: GitHub releases, platform changelog, blog, SDKs |
| `references/dashboard-template.html` | Soft-UI dashboard scaffold rendered at the end of every run |

## Mandatory: Use ALL Connectors

**Every time this skill is invoked, you MUST use every available connector.** Do not skip any connector. Do not limit the number of queries or calls. Be thorough — cast a wide net.

- **YouTube connector** — Primary for ALL YouTube data: `searchVideos` (with `recency` filter for date-scoped searches), `getVideoDetails`, `getChannelStatistics`, `getChannelTopVideos`, and `getTranscripts` (free). Be mindful of the 10K units/day quota — `searchVideos` costs 100 units per call; all other tools cost ~1 unit.
- **vidIQ connector** — Mandatory for keyword research, outlier detection, breakout channel discovery, and title/thumbnail scoring. YouTube Data API does not expose search volume or competition scores — vidIQ does. Use `vidiq_keyword_research` on every ideation pass, `vidiq_outliers` and `vidiq_breakout_channels` on competitive research, `vidiq_trending_videos` on trend scouts, and `vidiq_score_title` to validate draft titles.
- **Apify connector** — Primary for Twitter/X via `apidojo/twitter-scraper-lite`. If it fails or returns empty, fall back to `apidojo/tweet-scraper` (same input params). Fallback for YouTube search via `automation-lab/youtube-scraper` if YouTube connector hits quota limits.
- **Official Anthropic sources** — Claude Code GitHub releases, Platform Changelog, and Anthropic News Blog must be checked in every daily scan and trend scout (see `references/anthropic-official-sources.md`). Use `WebFetch` to pull the latest entries.

If a connector fails or is unavailable, try the fallback first. Only tell the user if both primary and fallback fail. Never silently skip a connector.

**IMPORTANT: All MCP tool calls must be made by the main agent directly.** Do not delegate MCP calls (YouTube, Apify, WebFetch) to subagents. Plugin subagents cannot access MCP tools. Make all MCP calls yourself, firing as many as possible in parallel per turn.

## Transcript Expansion (Agent-Driven)

The agent autonomously decides when to pull transcripts. Do NOT wait for the user to ask. After reviewing search results, expand into transcripts when:

- A video is an **outlier** (3x+ above channel average views)
- A video covers a **direct competitor topic** or uses a similar angle to what we'd produce
- A video's title/description suggests a **novel approach** worth understanding
- The task is idea generation or competitive research and the video's content matters more than its stats

Use `getTranscripts` with `key_segments` format first (intro hook + outro CTA). Only pull `full_text` if the key segments reveal the video is highly relevant and you need the full argument/structure.

## Standard Workflows

### Daily Scan ("check today's vids", "morning scan", "what's new", "scan for updates")

**Compulsory checklist: every item below MUST run. Never skip, defer, or partially execute any of these. If a connector fails, report the failure explicitly and continue with the rest.**

**All MCP calls must be made by the main agent directly.** Do not delegate MCP tool calls to subagents — plugin subagents cannot access MCP tools. Fire as many MCP calls in parallel as possible in each turn to maximize speed.

**File saving:** Only save intelligence data files if the user's prompt contains an explicit line like `Vault: /some/path`. If the prompt does not contain that line, do NOT save data files anywhere. Do NOT search the filesystem for a vault. Do NOT look for `.obsidian` directories. Just run the scan and present results in chat. (The dashboard HTML is always written — see "Dashboard Output".)

#### Phase 1: Collect data (fire all MCP calls in parallel)

Launch as many of these as possible in a single turn. Do not wait for one to finish before starting the next. Do not analyze or summarize results as they return. Collect everything first, then synthesize once.

**Official Anthropic sources** — Use `WebFetch` to check these three sources for anything shipped in the last 48 hours (see `references/anthropic-official-sources.md`):
- **Claude Code GitHub releases** — Fetch `https://github.com/anthropics/claude-code/releases.atom` for new CLI releases
- **Platform Changelog** — Fetch `https://platform.claude.com/docs/en/release-notes/overview` for API changes, model launches, feature additions
- **Anthropic News Blog** — Fetch `https://raw.githubusercontent.com/taobojlen/anthropic-rss-feed/main/anthropic_news_rss.xml` for major announcements

**YouTube searches** — Use `searchVideos` with `recency: "pastDay"` covering ALL key topic groups. Use a **48-hour lookback** to avoid missing videos near the boundary. **Every topic group is compulsory:**
- Core: "Claude Cowork", "Claude Desktop", "Claude AI"
- Tools: "Anthropic AI", "Claude MCP", "Claude skills"
- Niche: "AI tools for business", "AI automation tutorial"
- Competitors: "AI tutorial non-technical", "no code AI"
- Trending: any current hot topics in the AI tools space

**vidIQ scans** — Run all of these in parallel with the YouTube searches:
- `vidiq_trending_videos` — Pull current trending videos in the AI/tech category to surface what's breaking out beyond keyword search.
- `vidiq_outliers` for each known competitor channel (AI Jason, Corbin Brown, Jack Roberts) — surfaces any of their recent videos that have outperformed their baseline (instant viral signal).
- `vidiq_breakout_channels` in the AI tools/automation niche — catches new competitors gaining momentum that aren't on the watchlist yet.
- `vidiq_keyword_research` on the day's emerging Twitter keywords (e.g., new feature names from Anthropic releases) — quantifies search demand before deciding whether a topic is worth a video.

**Twitter/X watchlist** — Use `apidojo/twitter-scraper-lite` (fall back to `apidojo/tweet-scraper` on failure). See `references/twitter-watchlist.md` for handle arrays. **Every tier is compulsory. Do not skip any tier or handles within a tier.**
- **P1 handles** — All ~30 P1 handles via `twitterHandles`, `maxItems: 50`, 48-hour `start` window, `sort: "Latest"`. No engagement filter.
- **P2 handles** — All ~69 P2 handles via `twitterHandles`, `maxItems: 50`, 48-hour `start` window, `minimumFavorites: 10`.
- **P3 handles** — All ~120 P3 handles via `twitterHandles` (split into 2-3 batches), `maxItems: 30` per batch, 48-hour `start` window, `minimumFavorites: 50`.
- **P4 handles** — All ~93 P4 handles via `twitterHandles`, `maxItems: 30`, 48-hour `start` window, `minimumFavorites: 100`.
- **Keyword scan** — `searchTerms: ["Claude Cowork", "Claude Desktop", "Anthropic", "Claude MCP", "Claude skills", "Claude agents"]`, `maxItems: 30`, 48-hour `start` window, `sort: "Top"`.

**Twitter/X discovery (beyond the watchlist)** — catches signals the watchlist might miss. All with 48-hour `start` window:
- **Broad ecosystem** — `searchTerms: ["Claude AI", "Anthropic", "Claude Code", "Claude Cowork"]`, `maxItems: 50`, `sort: "Top"`, `minimumFavorites: 50`.
- **Adjacent AI tools** — `searchTerms: ["AI automation for business", "AI tools non-technical", "AI workflow no code", "AI assistant for work"]`, `maxItems: 30`, `sort: "Top"`, `minimumFavorites: 100`.
- **Competitor mentions** — `searchTerms: ["ChatGPT vs Claude", "Cursor vs Claude", "Copilot vs Claude", "best AI tool 2026"]`, `maxItems: 30`, `sort: "Top"`, `minimumFavorites: 50`.
- **Viral AI content** — `searchTerms: ["AI changed my workflow", "AI saved me hours", "built this with AI"]`, `maxItems: 30`, `sort: "Top"`, `minimumFavorites: 200`.

#### Phase 2: Expand (after Phase 1 data is back)

- **Video details** — Use `getVideoDetails` on promising YouTube results to get full stats (views, likes, duration)
- **Transcript expansion** — Pull `getTranscripts` (key_segments) on any standout/outlier videos

#### Phase 3: Synthesize (after all data is collected)

With all collected data:

1. **Deduplicate** all tweets across watchlist and discovery results by tweet ID. Flag any discovery tweets that DON'T overlap with watchlist results — these are the net-new signals from outside the watchlist.
2. **Cross-reference** official sources with Twitter signals. If a release matches high-engagement tweets, that's a strong video signal.
3. **Identify patterns** across all three data sources: what topics are showing up in official sources AND Twitter AND YouTube simultaneously?
4. **Present ONE unified summary in chat**, organized by recency time slots. Group all signals (official sources, YouTube, Twitter) into these buckets based on when they were posted/published:

   **Time slots (use these exact headings):**
   - **🔴 Last 3 hours** — breaking right now, act-on-it-today signals
   - **🟠 3-6 hours ago** — fresh, still developing
   - **🟡 6-12 hours ago** — happened today, worth watching
   - **🔵 12-24 hours ago** — yesterday's signals still circulating
   - **⚪ 24-48 hours ago** — older tail, include only if high engagement

   Within each time slot, list items across all sources together (not separated by platform). For each item include:
   - Source tag: `[Twitter]`, `[YouTube]`, `[GitHub Release]`, `[Changelog]`, `[Blog]`
   - The signal: what happened, who posted it, key numbers
   - Engagement: likes/views/retweets as applicable

   After the time slots, add:

   **📊 Cross-platform patterns** — topics appearing across multiple sources and time slots simultaneously. These are the strongest signals.

   **🎬 Video opportunities:**
   - **Big Feature Launch** opportunities: any major Cowork feature or update dropped?
   - **Bundled Small Updates** opportunities: minor updates accumulating?
   - **How-To for Business** opportunities: business use cases getting traction?

   For each opportunity, note which time slot the signal is in so Ben knows how urgent it is.

#### Phase 4: Build the dashboard (ALWAYS — see "Dashboard Output")

After presenting the chat summary, render the soft-UI dashboard from the synthesized data.

### Competitive Research ("research channels", "analyze competitors", "niche analysis")

1. `getChannelStatistics` to pull subscriber counts, total views, and video counts for competitor channels (AI Jason, Corbin Brown, Jack Roberts, and any others discovered)
2. `getChannelTopVideos` to get recent/top videos from each competitor channel
3. `searchVideos` to find new creators in the professional AI tools niche
4. `getVideoDetails` on standout videos for full metadata
5. **vidIQ deep dive on each competitor:**
   - `vidiq_channel_analytics` — engagement rate, view velocity, growth signals
   - `vidiq_channel_performance_trends` — long-arc trajectory (rising/declining/flat)
   - `vidiq_outliers` — auto-detect their viral wins so we know what's working for them
   - `vidiq_similar_channels` — discover new competitors related to each known one
6. `vidiq_breakout_channels` in the niche to surface fast-rising channels that aren't yet on our radar
7. **Twitter/X watchlist scan** — All tiers (P1 through P4) scanned with same methodology as Daily Scan Phase 1, plus targeted `searchTerms` for competitor names and sentiment keywords. Cross-reference Twitter signals with YouTube competitor performance.
8. Agent decides which outlier videos need transcript analysis → `getTranscripts` (free)
9. Cross-reference YouTube, vidIQ, and Twitter findings
10. **Build the dashboard** (Phase 4 — see "Dashboard Output")

### Idea Generation ("video ideas", "brainstorm", "content ideas", "ideation")

1. `searchVideos` to find content gaps, trending formats, and high-performing videos in the niche
2. `getVideoDetails` on top results for engagement analysis
3. **vidIQ keyword research** — Run `vidiq_keyword_research` on every candidate topic (e.g., "Claude Cowork tutorial", "AI agent for business", "no code AI workflow"). Capture search volume + competition score for each. Reject topics with low search volume; flag low-competition + high-volume topics as priority opportunities.
4. **vidIQ outlier mining** — `vidiq_outliers` on each known competitor channel to identify their recent breakouts. These are validated angles worth riffing on.
5. **vidIQ trending discovery** — `vidiq_trending_videos` and `vidiq_breakout_channels` to surface emerging formats and creators.
6. **Twitter/X watchlist scan** — All tiers (P1 through P4) scanned with same methodology as Daily Scan Phase 1, plus keyword scan for pain points and emerging topics. Use `minimumFavorites: 100` on keyword scan to surface only high-signal tweets. Focus on tweets showing demos, workflows, and setups getting outsized engagement.
7. Agent identifies high-performing videos worth analyzing → `getTranscripts` for angle inspiration
8. Apply strategy test from Domain Knowledge section
9. **Categorize every idea into one of the 3 video formats:** Big Feature Launch, Bundled Small Updates, or How-To for Business
10. **Score draft titles** with `vidiq_score_title` before presenting — surface the SEO/CTR score alongside each idea
11. Present ideas with supporting data from all platforms (YouTube + vidIQ + Twitter)
12. **Build the dashboard** (Phase 4 — see "Dashboard Output")

### AI Trend Scout ("trend scout", "what's trending on twitter", "twitter scan", "X scan", "viral topics")

Structured Twitter/X deep analysis for YouTube content opportunities. Scans the watchlist and keyword landscape to identify what's gaining viral momentum RIGHT NOW so you can film before the trend peaks.

**Priority tiers (scan in this order):**

1. **Tier 1 — Anthropic/Claude ecosystem**: Claude Code, Claude Cowork, Claude Desktop, Claude API changes, Anthropic product announcements, viral Claude demos, Claude workflow setups people are sharing
2. **Tier 2 — Other AI tools trending**: OpenAI, Google, open-source models, new tools, integrations, or workflows that are trending
3. **Tier 3 — Meta-trends**: Recurring themes or debates dominating AI Twitter (e.g., "agents replacing SaaS", "vibe coding")

**Execution — run ALL in parallel:**

1. **Official Anthropic sources** — `WebFetch` the three Tier 1 sources (see `references/anthropic-official-sources.md`): Claude Code GitHub releases atom feed, Platform Changelog, Anthropic News Blog RSS. Identify any releases or announcements from the last 48 hours that may be triggering Twitter trends.
2. **P1 handle scan** — `twitterHandles` with all P1 handles (see `references/twitter-watchlist.md`), `maxItems: 50`, 48-hour `start` window, `sort: "Latest + Top"`. No engagement filter.
3. **P2 handle scan** — `twitterHandles` with all P2 handles, `maxItems: 50`, 48-hour `start` window, `minimumFavorites: 10`
4. **P3 handle scan** — `twitterHandles` with all P3 handles (split into 2-3 batches), `maxItems: 30` per batch, 48-hour `start` window, `minimumFavorites: 50`
5. **P4 handle scan** — `twitterHandles` with all P4 handles, `maxItems: 30`, 48-hour `start` window, `minimumFavorites: 100`
6. **Keyword scan (ecosystem)** — `searchTerms: ["Claude Cowork", "Claude Desktop", "Anthropic launch", "Claude update", "Claude MCP", "Claude skills", "Claude agents"]`, `maxItems: 30`, 48-hour `start` window, `sort: "Top"`
7. **Keyword scan (competitive)** — `searchTerms: ["AI tools", "Codex vs Claude", "Cursor vs Claude", "best AI tool", "AI workflow", "AI automation"]`, `maxItems: 30`, 48-hour `start` window, `sort: "Top"`, `minimumFavorites: 100`
8. **vidIQ trending + outliers** — `vidiq_trending_videos` for current trending list, `vidiq_breakout_channels` for fast-rising channels in the AI niche, `vidiq_outliers` on each known competitor to detect their viral hits. Cross-reference vidIQ trends with Twitter signals — overlap = strongest video opportunities.
9. **vidIQ keyword validation** — Run `vidiq_keyword_research` on the top 5-8 trending topics surfaced by Twitter to quantify search demand and competition before recommending video concepts.

**Analysis and ranking:**

Deduplicate across all results by tweet ID. Cluster tweets into distinct topics/trends. For each topic, produce:

| Field | Description |
|-------|-------------|
| **What** | Specific tool, feature, setup, or announcement |
| **Why trending** | What triggered the attention — a demo, launch, viral post, comparison, controversy? |
| **Engagement signal** | Approximate like/repost/bookmark counts on top posts, or "multiple posts with 1K+ likes" |
| **Top post** | Link to the highest-engagement tweet for this topic |
| **YouTube angle** | How this maps to one of the 3 video formats (Big Feature Launch / Bundled Small Updates / How-To for Business) with a draft video title |
| **Priority tier** | 1 (Anthropic/Claude), 2 (Other AI tools), or 3 (Meta-trend) |
| **Freshness** | Hours since first major tweet on this topic |

**Output format:**

Return a ranked list of **8-15 topics** ordered by viral momentum (highest engagement * freshness weighting — newer + high-engagement ranks highest). Use this structure:

```
**[Rank]. [Topic name]**
Trend type: [Anthropic / Other AI tool / Meta-trend]
What's happening: [2-3 sentences]
Engagement signal: [specific numbers or qualitative signal]
Top post: [link if available]
YouTube angle: [one sentence with draft title and target format]
```

After the ranked list:
1. **3-sentence mood summary** — what's dominating AI Twitter right now, what's fading, what's about to break
2. **2-3 video concepts** — cross-reference the top 5 topics against the 3 video formats and produce specific video concepts with working titles, target format, and urgency level (film this week / queue for next week / monitor)
3. **Build the dashboard** (Phase 4 — see "Dashboard Output")

**Hard exclusions (do NOT include):**
- General AI news roundups or newsletters — we want primary signals, not aggregation
- Pure opinion pieces with no engagement signal (< 50 likes)
- Announcements older than 3 days unless still actively generating fresh engagement
- Developer-only content with no professional/Cowork angle (unless Tier 2 competitive intel)
- Slow-burn research papers with no viral moment

## Dashboard Output

**The dashboard is the deliverable.** After the chat summary of any workflow above, ALWAYS render an HTML dashboard from the synthesized data. Never end a run without it.

### Steps

1. **Load the soft-UI aesthetic.** Call the `soft-ui` skill (`Skill` tool, skill name `high-end-visual-design`) and follow its design directives — Soft Structuralism vibe (silver-grey / white background, massive bold Grotesk typography, airy floating cards, ultra-soft diffused ambient shadows), nested double-bezel cards, eyebrow pill tags, generous macro-whitespace, and spring-physics micro-motion. The bundled template already encodes this aesthetic; use the skill to refine and extend it, never to replace it with a generic layout.
2. **Read the template** at `references/dashboard-template.html`. It is a self-contained, single-file HTML document (all CSS inline, no external dependencies, works offline, theme-aware light/dark).
3. **Fill every `<!-- FILL: ... -->` placeholder** with the real synthesized data:
   - Report title + generated date/time + scan-window subtitle
   - KPI stat tiles (total signals, top trend, breaking count, video opportunities)
   - The time-slot signal feed (🔴 Last 3h → ⚪ 24-48h), one card per signal with its source tag and engagement
   - Cross-platform patterns
   - Video opportunity cards mapped to the 3 formats with urgency
   - The trend leaderboard table (rank, topic, tier, engagement, freshness, YouTube angle)
   Remove any placeholder sections that have no data rather than leaving empty shells. Never invent numbers — every figure must trace to a real API result.
4. **Write the filled file.** Save to `market-intelligence-report-YYYY-MM-DD.html`. Default location is the current working directory unless the prompt contains a `Vault: /some/path` line, in which case save under that path.
5. **Tell the user the file path** and offer to open it (`open <path>` on macOS). If browser tools are connected, offer to open it in a tab.

### Rules

- The dashboard must be **fully self-contained** — inline all CSS, embed nothing external. It has to open with a double-click and render offline.
- **No em dashes** anywhere in the rendered copy. Use commas, periods, or parentheses.
- Match signal-count and engagement numbers exactly to what the chat summary reported. The dashboard is a visualization of the same data, not a second, divergent analysis.
- Keep the soft-UI look: no harsh borders, no `shadow-md`-style dark drops, no banned fonts (Inter/Roboto/Arial). The template ships with the correct system font stack and soft shadows already.

## Domain Knowledge

- **3 video formats:** Big Feature Launch, Bundled Small Updates, How-To for Business (see content-tier-guide.md)
- **Target audience:** Non-developer professionals who want to use AI tools in their existing work. NOT agency builders or AI service sellers.
- **Anchor tool:** Claude Cowork
- **Publishing cadence:** 3 videos/week, 15-20 min tutorials
- **Strategy test for ideas:** Does it serve a non-developer professional? Can it be practically demonstrated? Does it fit one of the 3 formats? Could it include a CTA asset?
- **Outlier threshold:** 3x+ above channel average views
- **Scan window:** Strictly 48 hours maximum. Never look at content older than 48 hours.
- **Transcripts are free** — use `getTranscripts` liberally, they cost 0 API quota
- **Ground everything in data** — cite actual view counts, engagement rates, search volume. "This seems popular" is not useful. "This video got 3.2x the channel average with 45K views in 2 weeks" is.
- **Graceful degradation** — if a connector is unavailable, note it and work with the data sources that are available
