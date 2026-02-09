# Browser & Scraping Guide

How to extract lead data safely and effectively, with or without browser automation.

---

## Core Rule: Google First, Always

**Never navigate directly to linkedin.com.** LinkedIn requires authentication, blocks automated access, and may flag accounts.

Instead:
1. Search Google with `site:linkedin.com/in/` queries
2. Extract data from Google result snippets
3. Only use `WebFetch` or browser MCP on non-LinkedIn URLs (company websites, news articles, job boards)

---

## Data Extraction Methods (Priority Order)

### Method 1: Google Search Snippets (Default)

**Best for:** LinkedIn profiles, company pages, quick validation.

Use `WebSearch` to run Google queries. Extract from results:

| Data Point | Where to Find It |
|-----------|------------------|
| Person's name | Search result title (before "- LinkedIn") |
| Job title | Search result description / snippet |
| Company | Search result description / snippet |
| Location | Search result description / snippet |
| LinkedIn URL | Search result URL |
| Company size | LinkedIn company page snippet |

**Pros:** Fast, no auth needed, works reliably.
**Cons:** Limited data per result, may miss details.

### Method 2: WebFetch (For Non-LinkedIn URLs)

**Best for:** Company websites, news articles, job boards, Crunchbase.

Use `WebFetch` to load a page and extract specific data:

```
URL: https://example.com/about
Prompt: "Extract the company name, employee count, founding year, and headquarters location."
```

**Use WebFetch for:**
- Company "About Us" pages — team size, mission, location
- Job boards (Greenhouse, Lever) — open positions, hiring velocity
- News articles — funding announcements, executive changes
- Crunchbase profiles — funding, investors, revenue
- Tech stack pages (StackShare, BuiltWith) — technology usage

**Do NOT use WebFetch for:**
- linkedin.com — will get blocked / return login page
- Pages behind authentication — will fail

### Method 3: Browser MCP (When Available)

**Best for:** JavaScript-heavy pages, pages requiring interaction, screenshots.

If a browser MCP tool is available:

1. **Navigate** to the target page (non-LinkedIn)
2. **Screenshot** to capture visual data
3. **Extract** text or structured data from the page

**Use browser MCP for:**
- Company pages that require JavaScript to render
- Job listing pages with dynamic content
- Taking screenshots of company websites for brand analysis

---

## Rate Limiting

Respect rate limits to avoid being blocked by Google or target sites.

### WebSearch Rate Limits

| Batch Size | Delay Between Batches | Max Queries/Session |
|-----------|----------------------|-------------------|
| 3–5 queries | 5–10 seconds | 50 queries |

### WebFetch Rate Limits

| Target Type | Delay Between Requests | Max Requests/Session |
|------------|----------------------|---------------------|
| Company websites | 3–5 seconds | 30 requests |
| Job boards | 5–10 seconds | 20 requests |
| News sites | 2–3 seconds | 30 requests |

### Browser MCP Rate Limits

| Action | Delay | Notes |
|--------|-------|-------|
| Page navigation | 5 seconds | Allow page to fully load |
| Data extraction | 2 seconds | Between extraction calls |
| Screenshots | 3 seconds | Between captures |

---

## Handling Auth Walls

When a page requires login or blocks access:

| Scenario | Action |
|----------|--------|
| LinkedIn login page | Stop. Use Google snippets instead. |
| Paywall (news site) | Try Google cache: `cache:[URL]`. If unavailable, skip. |
| CAPTCHA | Stop. Switch to a different data source. |
| Rate limit / 429 | Pause for 60 seconds, then retry once. If still blocked, stop. |
| Cloudflare challenge | Skip this source. Try alternative URL. |
| "Content not available" | Source may be region-locked. Note and skip. |

---

## Error Handling

| Error | Response |
|-------|----------|
| WebSearch returns no results | Broaden query: remove location, use fewer terms |
| WebSearch returns irrelevant results | Narrow query: add more specific terms, use quotes |
| WebFetch returns empty/garbled content | Page may be JS-rendered. Try browser MCP if available. |
| WebFetch timeout | Retry once. If still failing, skip and note. |
| Browser page won't load | Check URL. Try without www. Skip if persistent. |
| Duplicate results across queries | Deduplicate by company name + person name before scoring |

---

## Fallback: No-Browser Mode

If no browser MCP is available, the entire workflow runs on:

1. **WebSearch** — for Google queries (LinkedIn profiles, company discovery)
2. **WebFetch** — for non-LinkedIn URLs (company pages, job boards, news)

This is fully functional. Browser MCP is a nice-to-have for edge cases, not a requirement.

**What changes without browser:**
- Can't render JavaScript-heavy pages → use WebFetch and accept partial data
- Can't take screenshots → skip visual brand analysis
- Can't interact with dynamic job boards → use Google job search instead

---

## Session Management for Large Batches

When processing 20+ companies or 50+ contacts:

### Save Progress Frequently

Export partial results every 10 items:
```
./lead-research-output/companies-partial-[timestamp].csv
./lead-research-output/contacts-partial-[timestamp].csv
```

### Track Search State

Keep a running log of:
- Queries executed (avoid repeating)
- Companies found (avoid re-researching)
- Contacts extracted (avoid duplicates)

### Batch Processing Pattern

```
Batch 1: Search queries 1-5 → Extract → Save partial
Batch 2: Search queries 6-10 → Extract → Merge + Save partial
...
Final: Deduplicate → Score → Tier → Export final
```

---

## Ethical Guidelines

1. **Public data only** — only collect data that's publicly visible in Google search results
2. **No login bypass** — never attempt to circumvent authentication
3. **Respect robots.txt** — if a site blocks crawling, don't force it
4. **No personal data hoarding** — collect only business-relevant fields (name, title, company, business email pattern)
5. **User is responsible** — the user decides how to use the data; the skill just gathers it
6. **Comply with terms** — this tool uses Google Search and public web pages within their intended use
7. **Inform the user** — if a data source is restricted, tell the user rather than attempting workarounds
