# YouTube Data Collection Guide

## Overview

YouTube data is collected via two MCP connectors:

1. **YouTube MCP** (`@kirbah/mcp-youtube`) — **Primary for ALL YouTube data.** Uses YouTube Data API v3 (free tier: 10,000 units/day). All 8 tools are operational.
2. **Apify MCP** (`automation-lab/youtube-scraper`) — **Fallback for YouTube search** if quota is exhausted. **Primary for Twitter/X** via `apidojo/tweet-scraper`.

---

## YouTube MCP (Primary)

### All Tools

| Tool | What it does | API Cost (units) |
|------|-------------|-----------------|
| `searchVideos` | Search videos/channels by keyword with `recency` filter | **100 per call** |
| `getVideoDetails` | Video metadata, stats, duration, category | **~1 per video** |
| `getChannelStatistics` | Subscriber count, view count, video count | **~1 per channel** |
| `getChannelTopVideos` | Top/recent videos for a channel | **~3 per call** |
| `getVideoComments` | Video comments | **~1 per call** |
| `getVideoCategories` | List video categories | **~1 per call** |
| `getTrendingVideos` | Trending videos by region/category | **~1 per call** |
| `getTranscripts` | Video transcripts (captions) | **Free (0 cost)** |

### Quota Management

- **Daily budget:** 10,000 units (resets daily)
- **Most expensive:** `searchVideos` at 100 units — plan ~50-80 searches/day max
- **Cheapest:** Everything else at ~1 unit each
- **Free:** `getTranscripts` — use liberally, no quota impact

### `searchVideos` — recency filter

The `recency` parameter enables date-scoped searches — critical for daily scans:

| Value | Window |
|-------|--------|
| `pastHour` | Last hour |
| `pastDay` | Last 24 hours |
| `pastWeek` | Last 7 days |
| `pastMonth` | Last 30 days |
| `pastQuarter` | Last 90 days |
| `pastYear` | Last year |
| `any` | No filter (default) |

Example:
```json
{ "query": "Claude Cowork", "recency": "pastDay", "maxResults": 10 }
```

### `getTranscripts`

Get captions/subtitles for one or more videos. **0 API cost** — use freely.

```
Tool: getTranscripts
Input: videoIds (array), format ("key_segments" or "full_text")
```

- `key_segments` (default): Returns intro hook + outro CTA. Use this first to triage.
- `full_text`: Returns entire transcript. Use only when key segments confirm high relevance.

### Agent-driven transcript expansion

The agent decides when to pull transcripts — no need to wait for the user:

1. Review search results (titles, views, descriptions)
2. Identify videos worth deeper analysis (outliers, competitor content, novel angles)
3. Pull `key_segments` first
4. If key segments reveal high relevance, pull `full_text`

---

## Apify MCP (Fallback YouTube + Primary Twitter/X)

### YouTube fallback via `automation-lab/youtube-scraper`

Uses YouTube's InnerTube API (direct HTTP, no browser) — no API key needed, no quota limits. Use as fallback when YouTube MCP quota is exhausted.

```json
// Search by keyword
{ "searchQueries": ["Claude AI tutorial"], "maxResults": 20 }

// Scrape specific channel
{ "startUrls": [{"url": "https://www.youtube.com/@channelname"}], "maxResults": 50 }

// Combined: search + channel in one run
{ "searchQueries": ["Claude AI tutorial"], "startUrls": [{"url": "https://www.youtube.com/@channelname"}], "maxResults": 20 }
```

**Output fields:** `title`, `url`, `viewCount`, `likeCount`, `commentCount`, `description`, `publishedAt`, `duration`, `channelName`, `subscriberCount`, `category`, `keywords[]`

### Twitter/X via `apidojo/tweet-scraper` (Primary)

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

See `twitter-watchlist.md` for the full 284-handle watchlist with priority tiers, handle arrays, and batching methodology.

### Apify Pagination

For large datasets, use `offset` and `limit` with `get-actor-output`:

```
offset: 0, limit: 100   → items 0-99
offset: 100, limit: 100 → items 100-199
```

Save each page to disk before fetching the next.

### Apify Cost

Pay-per-event pricing:
- **Run start:** $0.005 (one-time per run)
- **Video scraped:** $0.003 each
- **Channel scraped:** $0.003 each
- **Comment scraped:** $0.0005 each

Combine queries into fewer runs to minimize the $0.005 start fee. Apify free tier gives $5/month.

---

## Data Persistence

**CRITICAL:** Save all fetched data to JSON files immediately. Context compaction will lose data held only in conversation.

Naming convention:
- `channel_data.json` — channel stats and metadata
- `video_data.json` — video details and metrics
- `search_results.json` — search result listings
- `transcripts.json` — video transcripts

---

---

## Official Anthropic Sources (via WebFetch)

In addition to YouTube and Apify connectors, every scan must check official Anthropic channels for what shipped. Use `WebFetch` to pull these sources. See `anthropic-official-sources.md` for the full list.

### Tier 1: Check Every Scan

| Source | URL to Fetch | Content |
|--------|-------------|---------|
| Claude Code GitHub Releases | `https://github.com/anthropics/claude-code/releases.atom` | CLI updates — near-daily |
| Platform Changelog | `https://platform.claude.com/docs/en/release-notes/overview` | API changes, model launches, SDK releases |
| Anthropic News Blog (RSS) | `https://raw.githubusercontent.com/taobojlen/anthropic-rss-feed/main/anthropic_news_rss.xml` | Major product announcements |

### Tier 2: Supplementary (also checked every scan)

| Source | URL to Fetch | Content |
|--------|-------------|---------|
| Claude Apps Release Notes | `https://support.claude.com/en/articles/12138966-release-notes` | Desktop/web/mobile features |
| SDK Repos | `https://github.com/anthropics/anthropic-sdk-python/releases.atom` | Python SDK changes |
| Status Page | `https://status.claude.com/history.rss` | Outages and incidents |

---

## Rate Limits

- **YouTube MCP:** 10,000 units/day (free tier). `searchVideos` = 100 units, all others = ~1 unit, transcripts = free
- **Apify:** Pay-per-event, no quota limits. Combine multiple search queries and URLs into single runs for efficiency.
- **WebFetch (official sources):** No rate limits. GitHub atom feeds and RSS feeds are lightweight.
