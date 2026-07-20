# Anthropic/Claude Official Update Sources

The primary sources for tracking what Claude shipped. These are checked during every daily scan and trend scout alongside Twitter/X watchlist and YouTube searches.

## Tier 1: Check Every Scan (instant or same-day updates)

### Claude Code GitHub Releases

- **URL:** `https://github.com/anthropics/claude-code/releases`
- **CHANGELOG:** `https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md`
- **Atom feed:** `https://github.com/anthropics/claude-code/releases.atom`
- **Frequency:** Near-daily — 13 releases in 12 days typical
- **Latency:** Instant — the release IS the ship event
- **Content:** CLI feature additions, bug fixes, permission changes, MCP improvements, Bedrock/Vertex integration, UI fixes
- **How to check:** Use `WebFetch` on the releases atom feed or the CHANGELOG.md raw URL to get the latest entries

### Claude Platform Changelog (API)

- **URL:** `https://platform.claude.com/docs/en/release-notes/overview`
- **Frequency:** Multiple entries per week — 1-3 entries per week average, more during active periods
- **Latency:** Same-day as API availability
- **Content:** API changes, new features (web search, managed agents, structured outputs), model launches, SDK releases, deprecations, rate limit changes, beta headers
- **No RSS feed** — must fetch the page directly
- **How to check:** Use `WebFetch` on the URL to scrape the latest entries

### Anthropic News Blog

- **URL:** `https://www.anthropic.com/news`
- **Community RSS:** `https://raw.githubusercontent.com/taobojlen/anthropic-rss-feed/main/anthropic_news_rss.xml`
- **Frequency:** 3-6 posts per month
- **Latency:** This is the primary announcement venue for major launches — same-day, often the first place things are announced
- **Content:** Major product launches (model releases like Opus 4.6), corporate announcements, partnerships, policy statements, feature launches (Cowork GA)
- **How to check:** Use `WebFetch` on the community RSS feed URL to get the latest entries

## Tier 2: Supplementary Sources (also checked every scan)

### Claude Apps Release Notes (Desktop/Web/Mobile)

- **URL:** `https://support.claude.com/en/articles/12138966-release-notes`
- **Frequency:** Monthly summaries, weekly to bi-weekly during active periods
- **Latency:** Same-day to next-day for major features
- **Content:** Claude.ai web app features, Claude Desktop features (Cowork, computer use), mobile app updates, model availability in consumer products, enterprise features
- **No RSS feed** — manual check

### Anthropic SDK Repositories

| Repo | Releases URL | Atom Feed |
|------|-------------|-----------|
| Python SDK | `https://github.com/anthropics/anthropic-sdk-python/releases` | `https://github.com/anthropics/anthropic-sdk-python/releases.atom` |
| TypeScript SDK | `https://github.com/anthropics/anthropic-sdk-typescript/releases` | `https://github.com/anthropics/anthropic-sdk-typescript/releases.atom` |
| Agent SDK (TS) | `https://github.com/anthropics/claude-agent-sdk-typescript/releases` | `https://github.com/anthropics/claude-agent-sdk-typescript/releases.atom` |

- **Frequency:** Near-daily — version-locked to Claude Code releases
- **Content:** API SDK changes that often correspond to new API features being available

### Claude Code npm Package

- **URL:** `https://www.npmjs.com/package/@anthropic-ai/claude-code`
- **Registry JSON:** `https://registry.npmjs.org/@anthropic-ai/claude-code`
- **Content:** Mirrors GitHub releases — this is the distribution channel
- **Useful for:** Confirming exact version numbers and publish timestamps

### Anthropic Engineering Blog

- **URL:** `https://www.anthropic.com/engineering`
- **Frequency:** 2-3 posts per month
- **Content:** Technical deep-dives on agent architecture, eval design, coding harnesses, infrastructure — reveals implementation details about shipped features
- **Latency:** Days to weeks after a feature ships (retrospective write-ups, not breaking news)

### Claude Status Page

- **URL:** `https://status.claude.com/`
- **RSS feed:** `https://status.claude.com/history.rss`
- **Atom feed:** `https://status.claude.com/history.atom`
- **Content:** Outages, degraded performance, incident postmortems for claude.ai, Claude API, Claude Code, Claude Cowork
- **Useful for:** Knowing when things break, not what shipped

## Scan Integration

### During Daily Scan

Check these three Tier 1 sources alongside YouTube searches and Twitter/X watchlist:

1. **Claude Code GitHub releases** — Fetch the atom feed or CHANGELOG.md. Look for any releases in the last 48 hours. Flag new features, especially anything relevant to Cowork or non-technical users.
2. **Platform Changelog** — Fetch the page. Look for any new entries in the last 48 hours. Flag API changes, model launches, or feature additions.
3. **Anthropic News Blog** — Fetch the community RSS. Look for any new posts in the last 48 hours. Flag major product announcements.

Cross-reference findings with Twitter/X signals — if a GitHub release or blog post corresponds to high-engagement tweets, that's a strong video signal.

### During Trend Scout

Same as Daily Scan, but also check if any official source update is the trigger behind a trending Twitter topic. If a trend can be traced to a specific release or blog post, cite the official source in the output.

### Video Opportunity Mapping

| Source | Maps to Format | Example |
|--------|---------------|---------|
| Major blog post (model launch, Cowork GA) | **Big Feature Launch** | "Anthropic just launched X — here's how to use it" |
| Multiple small GitHub releases accumulating | **Bundled Small Updates** | "5 Claude Code updates you missed this week" |
| Platform changelog (new API feature) | **How-To for Business** | "New Claude feature lets you do X — here's a workflow" |
