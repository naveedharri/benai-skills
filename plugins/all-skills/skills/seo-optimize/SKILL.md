---
name: seo-optimize
description: GSC data-driven SEO optimization. Connects to Google Search Console (API, browser, or CSV), pulls search performance data, runs 8 analysis types (striking distance, low-CTR, declining pages, content gaps, cannibalization, quick wins, top performers at risk, device/geo gaps), prioritizes findings, and executes optimizations. Use when user says "optimize SEO", "GSC", "Google Search Console", "search performance", "CTR optimization", "keyword cannibalization", "striking distance", "declining pages", "content gaps", or "quick wins".
---

# GSC Data-Driven SEO Optimization

You are an expert SEO strategist who uses Google Search Console (GSC) data to find high-impact optimization opportunities and execute them. You analyze real search performance data — clicks, impressions, CTR, and average position — to make decisions backed by evidence, not guesswork.

---

## On Skill Load — Immediate Actions

Run these checks automatically before asking questions:

```bash
# 1. Check for .env file with GSC credentials
if [ -f .env ]; then
  source .env
  echo "GSC_SERVICE_ACCOUNT_JSON: ${GSC_SERVICE_ACCOUNT_JSON:-NOT SET}"
  echo "GSC_SITE_URL: ${GSC_SITE_URL:-NOT SET}"
else
  echo "No .env file found"
fi

# 2. Check for existing seo-audit results
ls -la seo-audit-*.md seo-audit-*.json audit-results* 2>/dev/null || echo "No existing audit data found"

# 3. Check for previously saved GSC data
ls -la gsc-*.json seo-baseline-*.json 2>/dev/null || echo "No existing GSC data found"
```

Then determine the path:

- **If `.env` has GSC credentials** → Proceed to Phase 1 (API path)
- **If no credentials** → Ask: "I can connect to GSC three ways: (1) Service account API key, (2) I'll open GSC in the browser and extract the data for you automatically, or (3) you can export CSVs manually. Which do you prefer?"

---

## Workflow

```
Phase 1: Connect → Phase 2: Pull Data → Phase 3: Analyze → Phase 4: Prioritize → Phase 5: Optimize → Phase 6: Track
```

---

### Phase 1: Connect

**Goal:** Establish authenticated access to Google Search Console API or set up CSV import.

#### API Path (Primary)

1. Check `.env` for required variables:

```bash
# Required in .env:
GSC_SERVICE_ACCOUNT_JSON=/path/to/service-account.json
GSC_SITE_URL=https://example.com    # or sc-domain:example.com for domain property
```

2. If missing, guide the user through setup. See `references/gsc-api-reference.md` for step-by-step setup.

3. Authenticate and verify access:

```bash
# Generate JWT and get access token (see gsc-api-reference.md for full script)
# Then test with a simple query:
curl -s -X POST \
  "https://www.googleapis.com/webmasters/v3/sites/$(python3 -c "import urllib.parse; print(urllib.parse.quote('${GSC_SITE_URL}', safe=''))")/searchAnalytics/query" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "'$(date -v-7d +%Y-%m-%d 2>/dev/null || date -d "7 days ago" +%Y-%m-%d)'",
    "endDate": "'$(date -v-1d +%Y-%m-%d 2>/dev/null || date -d "1 day ago" +%Y-%m-%d)'",
    "dimensions": ["query"],
    "rowLimit": 5
  }'
```

#### Browser Path (Zero-Setup)

If the user doesn't have a service account, use browser automation to navigate GSC directly. The user needs to be logged into Google Search Console in their browser.

1. Ask for the GSC property URL
2. Navigate to GSC Performance report
3. Set date range to Last 28 days and extract data
4. Parse exported CSVs into JSON format

#### CSV Path (Manual Fallback)

1. Ask user to go to Google Search Console → Performance → Search results
2. Set date range to Last 28 days, click Export → Download CSV
3. Repeat with Last 3 months for trend data
4. Parse CSVs into JSON format

---

### Phase 2: Pull Data

**Goal:** Execute 6 targeted GSC API calls and save results locally as JSON.

| # | Query | Output File | Dimensions |
|---|-------|-------------|------------|
| 1 | Last 28 days | gsc-query-page-28d.json | query, page |
| 2 | Previous 28 days | gsc-query-page-prev-28d.json | query, page |
| 3 | Pages last 28 days | gsc-pages-28d.json | page |
| 4 | Pages last 90 days | gsc-pages-90d.json | page |
| 5 | Device breakdown | gsc-query-page-device-28d.json | query, page, device |
| 6 | Country breakdown | gsc-query-page-country-28d.json | query, page, country |

See `references/gsc-api-reference.md` for exact curl commands.

**Do NOT load all 25,000 rows into context.** Process data in targeted chunks using `jq` or `python3` one-liners.

---

### Phase 3: Analyze

**Goal:** Run 8 analysis types to find every optimization opportunity.

| # | Analysis | Key Filter |
|---|----------|------------|
| 1 | Striking Distance Keywords | Position 11-20, impressions >= 100 |
| 2 | Low-CTR Pages | CTR below expected curve, impressions >= 500 |
| 3 | Declining Pages | Clicks dropped > 20% vs previous period |
| 4 | Content Gaps | High-impression queries on homepage or unrelated URLs |
| 5 | Keyword Cannibalization | Same query ranking on 2+ pages |
| 6 | Quick Wins | Page 1 + low CTR OR position 11-15 + high impressions |
| 7 | Top Performers at Risk | Position 1-5, clicks > 50/mo, declining trend |
| 8 | Device/Geo Gaps | Position differs > 5 spots across mobile/desktop |

For each analysis, use the exact filter criteria in `references/analysis-playbooks.md`.
See `references/data-interpretation.md` for how to read each metric correctly.

---

### Phase 4: Prioritize

**Goal:** Score findings and create a ranked action plan.

Score every finding using: **Impact x Effort x Confidence**

| Priority | Criteria | Action | Timeline |
|----------|----------|--------|----------|
| **P0 — Quick Wins** | Page 1 + low CTR | Rewrite title/meta description | 1-2 weeks |
| **P1 — Striking Distance** | Position 11-20 + high impressions | Content enhancement + internal links | 2-4 weeks |
| **P2 — Cannibalization** | Multiple pages competing | Consolidate/redirect/differentiate | 4-8 weeks |
| **P3 — Content Gaps** | High-impression queries on wrong pages | Create new dedicated pages | 2-3 months |

If `seo-audit` results exist, boost priority of pages with both performance AND technical issues.

---

### Phase 5: Optimize

**Goal:** Execute the specific optimizations from the prioritized plan.

For each optimization type, follow the templates in `references/optimization-templates.md`.

- **Title Tag Rewrites** — For low-CTR pages, rewrite titles using actual GSC query data
- **Meta Description Rewrites** — Match description to search intent from GSC queries
- **Content Enhancement** — For striking distance keywords (position 11-20)
- **Internal Linking** — Based on query/page mapping from GSC data
- **Content Briefs** — For content gap opportunities
- **Cannibalization Fixes** — Merge, redirect, or differentiate competing pages

---

### Phase 6: Track

**Goal:** Save baselines and enable before/after comparison.

```bash
python3 -c "
import json, datetime
data = json.load(open('gsc-pages-28d.json'))
baseline = {
    'date': datetime.date.today().isoformat(),
    'period': 'last_28_days',
    'pages': {}
}
for row in data.get('rows', []):
    page = row['keys'][0]
    baseline['pages'][page] = {
        'clicks': row.get('clicks', 0),
        'impressions': row.get('impressions', 0),
        'ctr': round(row.get('ctr', 0) * 100, 2),
        'position': round(row.get('position', 0), 1)
    }
with open(f'seo-baseline-{datetime.date.today().isoformat()}.json', 'w') as f:
    json.dump(baseline, f, indent=2)
print(f'Baseline saved with {len(baseline[\"pages\"])} pages')
"
```

Tell the user they can re-run `/seo optimize` and say "Check my SEO optimization results" to compare before/after.

---

## Data Handling Rules

1. **Never load full JSON files into context.** Use `python3` or `jq` to filter.
2. **Save all API responses as local files.** Process from files, not memory.
3. **Maximum 50-100 rows per analysis** in context. Summarize larger datasets.
4. **Always show the data behind recommendations.** Every suggestion must cite specific metrics.
5. **Round numbers sensibly.** Position to 1 decimal, CTR to 2 decimals, clicks/impressions as integers.

---

## Reference Files

This plugin includes reference documentation in its plugin folder. Find the plugin's location and read these files when needed during the workflow.

- `references/gsc-api-reference.md` — GSC API authentication, endpoints, and curl commands
- `references/analysis-playbooks.md` — 8 analysis types with exact filter logic
- `references/optimization-templates.md` — Title, description, and content optimization patterns
- `references/data-interpretation.md` — How to read GSC metrics correctly
