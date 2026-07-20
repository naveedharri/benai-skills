# Connectors, fallbacks, and deploy

The skill adapts to what the user has. Probe first, use the best available per stream, offer to connect the high-value gaps, and degrade gracefully otherwise. Tool schemas load on demand via `ToolSearch "select:<name>"` or a keyword query.

## Capability probe

Run these checks quietly at the start of Phase 0B. For each, a hit means the connector is available.

| Capability | How to detect | ToolSearch query |
|---|---|---|
| **Firecrawl** | `firecrawl_search` / `firecrawl_scrape` resolve | `firecrawl scrape search` |
| **Apify** | `call-actor` / `search-actors` resolve | `apify actor` |
| **Scholarly / PubMed** | `search_articles` / `get_full_text_article` resolve | `search_articles pubmed` |
| **bioRxiv / ClinicalTrials** (medical only) | `search_preprints` / `search_trials` resolve | `preprints clinical trials` |
| **YouTube** | `searchVideos` / `getTranscripts` resolve | `youtube search transcript` |
| **vidIQ** | `vidiq_youtube_search` / `vidiq_video_transcript` resolve | `vidiq` |
| **Reddit** | `mcp__reddit__search` resolves | `reddit search listing` |
| **browser-harness** | `browser-harness` on PATH (`command -v browser-harness`) | n/a (CLI) |
| **Vercel** | `deploy_to_vercel` resolves, or `vercel` CLI on PATH | `vercel deploy` |

Present the plan like: *"You have Firecrawl, YouTube, and Reddit connected. I'll use those for web, creators, and forums. For scholarly sources I'll fall back to web search unless you want to connect a papers source. Want me to connect Apify too (better forum + social scraping)?"*

## How to connect a missing one (offer, don't force)
- **Firecrawl**: biggest single upgrade (clean web + papers + scrape). Needs an API key + the `firecrawl` skill/MCP. If out of credits it returns **HTTP 402**, so warn the user and fall back; do not silently degrade.
- **Apify**: best forum + social scraping. Needs the Apify connector / API token. For Reddit, use `search-actors` to find a current Reddit scraper actor, then `call-actor`.
- **Scholarly / PubMed**: only worth it for medical/pharma topics. For everything else, arXiv (via Firecrawl) + Semantic Scholar cover it.
- If the user declines any, state the fallback that stream will use and move on.

## Fallback ladders (per stream)
- **Scholarly**: scholarly/PubMed MCP or Firecrawl papers → web search on journal/`.edu`/`.gov` → browser-use for gated abstracts.
- **Forums**: Apify Reddit actor → Reddit MCP → web search `site:reddit.com` + web fetch → browser-use.
- **Web / vendor**: Firecrawl search+scrape → web search + web fetch → browser-use for JS-heavy/blocked pages.
- **Creators**: YouTube MCP + vidIQ + transcripts → yt-dlp / `watch` skill → Apify YouTube scraper → web search summaries.

With **zero** connectors, the skill still runs entirely on native web search + web fetch, sub-agented by source type, with browser-use as the deep fallback. It is slower and shallower, and the skill says so.

## Deploy paths

Chosen at intake.

### Claude live artifact (default for one-offs)
- Instant, no infra. Use the Artifact tool with the rendered HTML.
- **CSP gotcha:** artifacts block all external hosts, so the Google Fonts `<link>` in the template will NOT load. For this path, replace the font link with a system-font stack (or inline `@font-face` as data URIs). Keep everything else self-contained. Test that it renders after publishing.

### Vercel (stable custom URL)
- **Locally:** `vercel deploy --prod` is fine. Create the project, then disable Deployment Protection (`PATCH /v9/projects/<id>` `{"ssoProtection":null}`) so the link is publicly openable. The Google Fonts CDN link works here (external hosts allowed).
- **From a cloud routine:** **git push is the deploy**, never the Vercel CLI/token/API (a routine's egress resolves to the wrong account). Repo git-connected to Vercel; commit to `main`; Vercel auto-builds the same URL.
- Save `index.html` (the report) + the `<topic-slug>-brief.md` in the repo/working folder either way.
