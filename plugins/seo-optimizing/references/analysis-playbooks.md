# Analysis Playbooks

8 data-driven analyses that process Google Search Console JSON files saved locally during Phase 2. Each playbook includes exact filter criteria, a complete Python extraction script, output format, interpretation guide, and recommended actions.

---

## CTR-by-Position Benchmark Curve

This table is the foundation for multiple analyses. Every CTR comparison references these thresholds.

| Position | Expected CTR | "Low" Threshold | Description |
|----------|-------------|-----------------|-------------|
| 1 | 27-32% | < 20% | Top position, highest visibility |
| 2 | 15-18% | < 10% | Strong second position |
| 3 | 10-12% | < 7% | Third position |
| 4-5 | 6-8% | < 4% | Lower first page |
| 6-10 | 2-4% | < 1.5% | Bottom of first page |
| 11-20 | 0.5-1.5% | < 0.3% | Second page |

**Notes on the benchmark curve:**
- These are averages across all query types and industries.
- **Branded queries** (containing your company name) typically have 2-5x higher CTR than these benchmarks. Exclude branded queries when diagnosing "low CTR" issues, or evaluate them against a separate branded benchmark.
- **Informational queries** may have lower CTR due to featured snippets, People Also Ask boxes, and knowledge panels stealing clicks.
- **Commercial/transactional queries** often have lower organic CTR due to ad placements above organic results.
- When a page's CTR falls below the "Low" threshold for its position bracket, it is a strong signal that the title tag, meta description, or search intent alignment needs attention.

### Benchmark Lookup Helper

Every Python script below uses this helper function. It is defined once here and included in each script for self-containment.

```python
def get_expected_ctr(position):
    """Return (expected_ctr, low_threshold) as decimals for a given position."""
    if position <= 1.5:
        return (0.295, 0.20)
    elif position <= 2.5:
        return (0.165, 0.10)
    elif position <= 3.5:
        return (0.11, 0.07)
    elif position <= 5.5:
        return (0.07, 0.04)
    elif position <= 10.5:
        return (0.03, 0.015)
    elif position <= 20.5:
        return (0.01, 0.003)
    else:
        return (0.005, 0.001)
```

---

## Analysis 1: Striking Distance Keywords

### What It Detects

Keywords ranking on page 2 (positions 11-20) that have enough search volume to be worth pushing to page 1. These are the closest opportunities to generate new organic traffic because they already rank -- they just need a push past the page 1 threshold.

### Data Source

`gsc-query-page-28d.json` (dimensions: query, page)

### Filter Criteria

- Position >= 11 AND Position <= 20
- Impressions >= 100 (over the 28-day period)
- Sorted by impressions descending (highest opportunity first)

### Python Extraction Script

```python
import json, sys, os

# --- Benchmark helper ---
def get_expected_ctr(position):
    if position <= 1.5: return (0.295, 0.20)
    elif position <= 2.5: return (0.165, 0.10)
    elif position <= 3.5: return (0.11, 0.07)
    elif position <= 5.5: return (0.07, 0.04)
    elif position <= 10.5: return (0.03, 0.015)
    elif position <= 20.5: return (0.01, 0.003)
    else: return (0.005, 0.001)

# --- Load data ---
filepath = 'gsc-query-page-28d.json'
if not os.path.exists(filepath):
    print(f"ERROR: {filepath} not found. Run Phase 2 data pull first.")
    sys.exit(1)

with open(filepath) as f:
    data = json.load(f)

rows = data.get('rows', [])
if not rows:
    print("No data rows found in file.")
    sys.exit(1)

# --- Filter: position 11-20, impressions >= 100 ---
results = []
for row in rows:
    pos = row.get('position', 0)
    imp = row.get('impressions', 0)
    if 11 <= pos <= 20 and imp >= 100:
        # Estimate potential clicks if moved to position 5 (CTR ~7%)
        potential_clicks = round(imp * 0.07)
        results.append({
            'query': row['keys'][0],
            'page': row['keys'][1],
            'position': round(pos, 1),
            'impressions': imp,
            'clicks': row.get('clicks', 0),
            'ctr': round(row.get('ctr', 0) * 100, 2),
            'potential': potential_clicks
        })

results.sort(key=lambda x: x['impressions'], reverse=True)

# --- Output ---
print(f"{'Query':<45} {'Page':<50} {'Pos':>5} {'Imp':>6} {'Clicks':>6} {'CTR':>7} {'Potential':>9}")
print("-" * 132)
for r in results[:50]:
    page_short = r['page'] if len(r['page']) <= 48 else '...' + r['page'][-45:]
    print(f"{r['query'][:44]:<45} {page_short:<50} {r['position']:>5} {r['impressions']:>6} {r['clicks']:>6} {r['ctr']:>6}% {r['potential']:>9}")

print(f"\nTotal striking distance keywords: {len(results)}")
print(f"Showing top {min(50, len(results))} by impressions")
if results:
    total_potential = sum(r['potential'] for r in results)
    total_current = sum(r['clicks'] for r in results)
    print(f"Current total clicks: {total_current}")
    print(f"Estimated total clicks if all moved to position 5: {total_potential}")
```

### Output Table Format

| Query | Page | Position | Impressions | Clicks | CTR | Potential |
|-------|------|----------|-------------|--------|-----|-----------|
| best crm for startups | /blog/crm-guide | 14.2 | 1,200 | 8 | 0.67% | 84 |

"Potential" = estimated clicks if the keyword moved to position 5 (using 7% CTR benchmark).

### Interpretation Guide

- **Position 11-13:** Highest priority. These are on the cusp of page 1. Even minor improvements (adding a paragraph, earning 2-3 internal links) can push them over.
- **Position 14-17:** Moderate effort needed. Content may need meaningful expansion or a few quality backlinks.
- **Position 18-20:** Harder to move. Consider whether the content truly matches search intent or if a rewrite is needed.
- **High impressions + low clicks:** The query has real demand. Google already considers your page somewhat relevant -- it just needs a nudge.
- **Multiple queries pointing to the same page:** That page is a content hub candidate. Strengthening it helps all those queries simultaneously.

### Recommended Actions

1. **Content Enhancement:** Add 300-500 words covering subtopics the ranking page is missing. Use the query itself as a guide for what to add.
2. **Internal Linking:** Find 3-5 high-authority pages on your site that relate to the striking distance query. Add contextual links with anchor text matching or closely related to the target query.
3. **On-Page Optimization:** Ensure the target query appears in the H1, first paragraph, at least one H2, and the meta description.
4. **Backlink Building:** For high-value queries (impressions > 500), pursue 2-3 quality backlinks to the specific page. Guest posts, resource page outreach, or HARO responses targeting the topic.
5. **Content Freshness:** Update the publication date, refresh statistics, and add current-year references.

---

## Analysis 2: Low-CTR Pages

### What It Detects

Pages that rank well (page 1) but get fewer clicks than expected for their position. This is almost always a title tag or meta description problem -- the page appears in search results but fails to compel the click.

### Data Source

`gsc-query-page-28d.json` (dimensions: query, page -- used to compare actual CTR vs expected CTR for the position bracket)

### Filter Criteria

- Impressions >= 500 (need statistical significance over 28 days)
- Actual CTR < "Low" threshold for their position bracket (from the benchmark table above)
- Focus on positions 1-10 (page 1 -- where CTR improvement directly translates to clicks)
- Exclude branded queries (queries containing the site name) for cleaner results

### Python Extraction Script

```python
import json, sys, os
from urllib.parse import urlparse

# --- Benchmark helper ---
def get_expected_ctr(position):
    if position <= 1.5: return (0.295, 0.20)
    elif position <= 2.5: return (0.165, 0.10)
    elif position <= 3.5: return (0.11, 0.07)
    elif position <= 5.5: return (0.07, 0.04)
    elif position <= 10.5: return (0.03, 0.015)
    elif position <= 20.5: return (0.01, 0.003)
    else: return (0.005, 0.001)

# --- Load data ---
filepath = 'gsc-query-page-28d.json'
if not os.path.exists(filepath):
    print(f"ERROR: {filepath} not found. Run Phase 2 data pull first.")
    sys.exit(1)

with open(filepath) as f:
    data = json.load(f)

rows = data.get('rows', [])
if not rows:
    print("No data rows found in file.")
    sys.exit(1)

# --- Optional: detect site domain to filter branded queries ---
# Extract domain from the first page URL
sample_page = rows[0]['keys'][1] if rows else ''
domain = urlparse(sample_page).netloc.replace('www.', '').split('.')[0].lower() if sample_page else ''

# --- Filter: page 1, high impressions, CTR below threshold ---
results = []
for row in rows:
    pos = row.get('position', 0)
    imp = row.get('impressions', 0)
    ctr = row.get('ctr', 0)
    query = row['keys'][0]
    page = row['keys'][1]

    # Skip branded queries
    if domain and domain in query.lower():
        continue

    if pos > 10 or imp < 500:
        continue

    expected_ctr, low_threshold = get_expected_ctr(pos)

    if ctr < low_threshold:
        gap = round((expected_ctr - ctr) * 100, 2)
        results.append({
            'page': page,
            'query': query,
            'position': round(pos, 1),
            'actual_ctr': round(ctr * 100, 2),
            'expected_ctr': round(expected_ctr * 100, 2),
            'gap': gap,
            'impressions': imp,
            'clicks': row.get('clicks', 0),
            'missed_clicks': round(imp * (expected_ctr - ctr))
        })

results.sort(key=lambda x: x['missed_clicks'], reverse=True)

# --- Output ---
print(f"{'Page':<50} {'Top Query':<35} {'Pos':>5} {'Act CTR':>8} {'Exp CTR':>8} {'Gap':>6} {'Imp':>6} {'Missed':>7}")
print("-" * 128)
for r in results[:40]:
    page_short = r['page'] if len(r['page']) <= 48 else '...' + r['page'][-45:]
    print(f"{page_short:<50} {r['query'][:34]:<35} {r['position']:>5} {r['actual_ctr']:>7}% {r['expected_ctr']:>7}% {r['gap']:>5}% {r['impressions']:>6} {r['missed_clicks']:>7}")

print(f"\nTotal low-CTR query-page pairs: {len(results)}")
if results:
    total_missed = sum(r['missed_clicks'] for r in results)
    print(f"Total estimated missed clicks (28 days): {total_missed}")
```

### Output Table Format

| Page | Top Query | Position | Actual CTR | Expected CTR | Gap | Impressions | Missed Clicks |
|------|-----------|----------|------------|-------------|-----|-------------|---------------|
| /blog/crm-guide | best crm software | 3.2 | 4.1% | 11.0% | 6.9% | 2,400 | 166 |

"Missed Clicks" = impressions * (expected CTR - actual CTR). This quantifies the opportunity.

### Interpretation Guide

- **Position 1-3 with low CTR:** Most impactful to fix. These pages have premium SERP real estate but are wasting it. Common causes:
  - Title tag does not match the search intent (e.g., generic product name instead of the query the user typed)
  - Meta description is missing, too short, or does not compel a click
  - A featured snippet or knowledge panel is stealing the click (check the SERP manually)
  - Sitelinks or other SERP features are pushing the organic result visually lower
- **Position 4-7 with low CTR:** Often caused by the title blending in with competitors. The title needs a differentiator (number, year, benefit, brand trust signal).
- **Position 8-10 with low CTR:** These results are near the fold. Users may not scroll down. Consider whether pushing position higher (content improvement) would be more effective than a title rewrite alone.
- **High impressions + very low CTR:** May indicate a mismatch between query intent and page content. Google ranks the page but users see from the snippet that it does not answer their question.

### Recommended Actions

1. **Title Tag Rewrite:** Incorporate the exact primary query. Add a compelling element: a number ("7 Best..."), a year ("2024 Guide"), a benefit ("Save 40%"), or a trust signal ("Expert-Reviewed").
2. **Meta Description Rewrite:** Write 140-155 characters that directly address the searcher's intent. Include a clear call-to-action ("Compare pricing", "Get the template", "See the full list").
3. **Structured Data for Rich Snippets:** Add FAQ schema, HowTo schema, or Review schema to earn expanded SERP real estate. Rich results have significantly higher CTR.
4. **Check SERP Features:** Manually search the query and check whether featured snippets, People Also Ask, or knowledge panels are absorbing clicks. If so, optimize content to win the featured snippet (concise answer in the first paragraph, use of lists/tables).

---

## Analysis 3: Declining Pages

### What It Detects

Pages that are losing traffic -- either position drops, click losses, or both -- compared to the previous 28-day period. Catching declines early allows you to intervene before a page falls off page 1 entirely.

### Data Source

- `gsc-query-page-28d.json` (current 28 days)
- `gsc-query-page-prev-28d.json` (previous 28 days)

### Filter Criteria

- Match rows between current and previous period by composite key: `query + page`
- Clicks dropped > 20% OR Position worsened by > 3 spots
- Current impressions >= 50 (avoid noise from very low-volume queries)
- Sorted by absolute click loss descending (biggest losses first)

### Python Extraction Script

```python
import json, sys, os

# --- Load data ---
current_file = 'gsc-query-page-28d.json'
prev_file = 'gsc-query-page-prev-28d.json'

for f in [current_file, prev_file]:
    if not os.path.exists(f):
        print(f"ERROR: {f} not found. Run Phase 2 data pull first.")
        sys.exit(1)

with open(current_file) as f:
    current_data = json.load(f)
with open(prev_file) as f:
    prev_data = json.load(f)

# --- Build lookup for previous period ---
prev_lookup = {}
for row in prev_data.get('rows', []):
    key = (row['keys'][0], row['keys'][1])  # (query, page)
    prev_lookup[key] = {
        'clicks': row.get('clicks', 0),
        'impressions': row.get('impressions', 0),
        'ctr': row.get('ctr', 0),
        'position': row.get('position', 0)
    }

# --- Compare current vs previous ---
results = []
for row in current_data.get('rows', []):
    query = row['keys'][0]
    page = row['keys'][1]
    key = (query, page)

    curr_clicks = row.get('clicks', 0)
    curr_imp = row.get('impressions', 0)
    curr_pos = row.get('position', 0)

    if curr_imp < 50:
        continue

    if key not in prev_lookup:
        continue

    prev = prev_lookup[key]
    prev_clicks = prev['clicks']
    prev_pos = prev['position']

    # Calculate changes
    if prev_clicks > 0:
        click_change_pct = ((curr_clicks - prev_clicks) / prev_clicks) * 100
    else:
        click_change_pct = 0

    pos_change = curr_pos - prev_pos  # positive = worsened (higher number = lower ranking)

    # Filter: clicks dropped > 20% OR position worsened > 3 spots
    if click_change_pct < -20 or pos_change > 3:
        results.append({
            'page': page,
            'query': query,
            'prev_clicks': prev_clicks,
            'curr_clicks': curr_clicks,
            'click_change_pct': round(click_change_pct, 1),
            'prev_pos': round(prev_pos, 1),
            'curr_pos': round(curr_pos, 1),
            'pos_change': round(pos_change, 1),
            'curr_imp': curr_imp
        })

# Sort by absolute click loss (biggest losses first)
results.sort(key=lambda x: x['curr_clicks'] - x['prev_clicks'])

# --- Output ---
print(f"{'Page':<45} {'Query':<30} {'Prev Clk':>8} {'Curr Clk':>8} {'Chg%':>7} {'Prev Pos':>8} {'Curr Pos':>8} {'Pos Chg':>7}")
print("-" * 124)
for r in results[:50]:
    page_short = r['page'] if len(r['page']) <= 43 else '...' + r['page'][-40:]
    print(f"{page_short:<45} {r['query'][:29]:<30} {r['prev_clicks']:>8} {r['curr_clicks']:>8} {r['click_change_pct']:>6}% {r['prev_pos']:>8} {r['curr_pos']:>8} {r['pos_change']:>+7.1f}")

print(f"\nTotal declining query-page pairs: {len(results)}")
if results:
    total_lost = sum(r['prev_clicks'] - r['curr_clicks'] for r in results if r['prev_clicks'] > r['curr_clicks'])
    print(f"Total clicks lost in this period: {total_lost}")
```

### Output Table Format

| Page | Query | Prev Clicks | Curr Clicks | Change% | Prev Pos | Curr Pos | Pos Change |
|------|-------|-------------|-------------|---------|----------|----------|------------|
| /blog/crm-guide | best crm tool | 85 | 42 | -50.6% | 4.1 | 8.3 | +4.2 |

### Interpretation Guide

- **Clicks down + Position down:** Classic decline. A competitor has overtaken you or an algorithm update has shifted rankings. Check if the content is outdated or if new competitors have published better content.
- **Clicks down + Position stable:** Likely a CTR issue or a SERP feature change. A new featured snippet, knowledge panel, or ad placement may be stealing clicks without affecting your ranking.
- **Position down + Clicks stable:** Impressions likely increased (broader query matching) while position dropped. Investigate whether Google is now matching your page to broader, less-relevant queries.
- **Seasonal patterns:** Some declines are natural (e.g., "tax software" after April). Cross-reference with Google Trends if the query is seasonal.
- **Multiple queries declining for the same page:** Signals a page-level problem (content staleness, technical issue, lost backlinks) rather than a query-level shift.

### Recommended Actions

1. **Content Refresh:** Update outdated statistics, add new sections, refresh examples, and update the publication date. This is the single most effective action for content-decay declines.
2. **Technical Audit:** Check the page for new technical issues -- slow load time, broken images, layout shift, mobile rendering problems. Run the seo-audit skill on the specific URL.
3. **Competitor Analysis:** Search the declining queries manually. Identify what the new top-ranking pages are doing differently -- longer content, better structure, more recent data, video embeds.
4. **Backlink Check:** Use a backlink tool to check if the page lost significant backlinks recently. Lost links from high-authority domains can cause position drops.
5. **Internal Link Boost:** Add 3-5 fresh internal links from recently-published or high-traffic pages to give the declining page a ranking signal boost.

---

## Analysis 4: Content Gaps

### What It Detects

High-impression queries that are landing on the homepage or on generic/unrelated pages instead of dedicated content. When Google sends traffic for "best project management tools" to your homepage instead of a dedicated comparison page, you are leaving rankings and conversions on the table.

### Data Source

`gsc-query-page-28d.json` (dimensions: query, page)

### Filter Criteria

- Page is the homepage (URL is the domain root, with or without trailing slash) OR page URL path does not semantically relate to the query
- Impressions >= 200 (meaningful search volume)
- Position >= 5 (there is room to improve with a dedicated page)
- Non-branded queries only (exclude queries containing the site name or domain)
- Sorted by impressions descending

### Python Extraction Script

```python
import json, sys, os
from urllib.parse import urlparse

# --- Load data ---
filepath = 'gsc-query-page-28d.json'
if not os.path.exists(filepath):
    print(f"ERROR: {filepath} not found. Run Phase 2 data pull first.")
    sys.exit(1)

with open(filepath) as f:
    data = json.load(f)

rows = data.get('rows', [])
if not rows:
    print("No data rows found in file.")
    sys.exit(1)

# --- Detect homepage pattern and site domain ---
sample_page = rows[0]['keys'][1]
parsed = urlparse(sample_page)
homepage_patterns = [
    parsed.scheme + '://' + parsed.netloc + '/',
    parsed.scheme + '://' + parsed.netloc,
    parsed.scheme + '://www.' + parsed.netloc.replace('www.', '') + '/',
    parsed.scheme + '://www.' + parsed.netloc.replace('www.', ''),
]
domain_name = parsed.netloc.replace('www.', '').split('.')[0].lower()

def is_homepage(url):
    """Check if URL is the site homepage."""
    p = urlparse(url)
    return p.path in ('', '/', '') or url.rstrip('/') in [hp.rstrip('/') for hp in homepage_patterns]

def is_generic_page(url):
    """Check if URL is a generic/catch-all page (homepage, about, contact, etc.)."""
    if is_homepage(url):
        return True
    path = urlparse(url).path.lower().rstrip('/')
    generic_paths = ['/about', '/contact', '/pricing', '/features', '/products', '/services', '/team']
    return path in generic_paths

# --- Filter ---
results = []
for row in rows:
    query = row['keys'][0]
    page = row['keys'][1]
    pos = row.get('position', 0)
    imp = row.get('impressions', 0)

    # Skip branded queries
    if domain_name and domain_name in query.lower():
        continue

    if imp < 200 or pos < 5:
        continue

    if is_generic_page(page):
        reason = "Homepage" if is_homepage(page) else f"Generic page ({urlparse(page).path})"
        results.append({
            'query': query,
            'page': page,
            'position': round(pos, 1),
            'impressions': imp,
            'clicks': row.get('clicks', 0),
            'reason': reason
        })

results.sort(key=lambda x: x['impressions'], reverse=True)

# --- Output ---
print(f"{'Query':<40} {'Current Page':<45} {'Pos':>5} {'Imp':>6} {'Clicks':>6} {'Why It Is a Gap':<25}")
print("-" * 130)
for r in results[:40]:
    page_short = r['page'] if len(r['page']) <= 43 else '...' + r['page'][-40:]
    print(f"{r['query'][:39]:<40} {page_short:<45} {r['position']:>5} {r['impressions']:>6} {r['clicks']:>6} {r['reason']:<25}")

print(f"\nTotal content gap opportunities: {len(results)}")
if results:
    total_imp = sum(r['impressions'] for r in results)
    print(f"Combined impressions: {total_imp}")
    print(f"\nThese queries need dedicated landing pages.")
```

### Output Table Format

| Query | Current Page | Position | Impressions | Clicks | Why It Is a Gap |
|-------|-------------|----------|-------------|--------|-----------------|
| project management tools comparison | / (homepage) | 12.3 | 1,800 | 6 | Homepage |

### Interpretation Guide

- **High impressions on homepage:** Google cannot find a better page on your site. It defaults to the homepage because of domain authority, but a dedicated page would rank much higher.
- **Position 5-10 on homepage:** Already on page 1 without a dedicated page. Creating one could push this to position 1-3.
- **Position 11-20 on homepage:** Even more opportunity. A dedicated page with proper on-page SEO would almost certainly outperform the homepage for this query.
- **Multiple related queries hitting the homepage:** These likely form a topic cluster. Create a pillar page that addresses the entire topic family.
- **Queries hitting generic pages (about, pricing, features):** The intent of the query does not match the page purpose. Users searching "how to use [your product] for X" should not land on the pricing page.

### Recommended Actions

1. **Create Dedicated Landing Pages:** For each high-impression gap query, create a focused page targeting that query and its variants.
2. **Content Brief Template:** For each new page, define: primary keyword, secondary keywords (from related GSC queries), search intent, target word count, heading structure, internal link targets.
3. **Internal Linking:** Once the new page exists, add contextual links from the homepage and other relevant pages pointing to it.
4. **Redirect or Canonical (if applicable):** If an old, thin page exists for the topic, either redirect it to the new page or improve it rather than creating a duplicate.
5. **Topic Clustering:** Group related gap queries together. One pillar page with supporting cluster pages is more effective than isolated pages.

---

## Analysis 5: Keyword Cannibalization

### What It Detects

Multiple pages on your site competing for the same keyword, splitting ranking signals (backlinks, internal links, content authority) between them. This often results in neither page ranking as well as a single consolidated page would.

### Data Source

`gsc-query-page-28d.json` (dimensions: query, page)

### Filter Criteria

- Group rows by query
- Filter queries where 2 or more different pages have impressions
- Both pages have position < 50 (both are actually competing in search results)
- Total impressions for the query >= 100 (worth investigating)
- Sorted by total impressions descending

### Python Extraction Script

```python
import json, sys, os
from collections import defaultdict

# --- Load data ---
filepath = 'gsc-query-page-28d.json'
if not os.path.exists(filepath):
    print(f"ERROR: {filepath} not found. Run Phase 2 data pull first.")
    sys.exit(1)

with open(filepath) as f:
    data = json.load(f)

rows = data.get('rows', [])
if not rows:
    print("No data rows found in file.")
    sys.exit(1)

# --- Group by query ---
query_pages = defaultdict(list)
for row in rows:
    query = row['keys'][0]
    page = row['keys'][1]
    pos = row.get('position', 0)
    imp = row.get('impressions', 0)
    clicks = row.get('clicks', 0)
    ctr = row.get('ctr', 0)

    if pos < 50:
        query_pages[query].append({
            'page': page,
            'position': round(pos, 1),
            'impressions': imp,
            'clicks': clicks,
            'ctr': round(ctr * 100, 2)
        })

# --- Filter: queries with 2+ competing pages, total impressions >= 100 ---
cannibalized = []
for query, pages in query_pages.items():
    if len(pages) < 2:
        continue

    total_imp = sum(p['impressions'] for p in pages)
    total_clicks = sum(p['clicks'] for p in pages)

    if total_imp < 100:
        continue

    # Sort pages by position (best first)
    pages.sort(key=lambda x: x['position'])

    cannibalized.append({
        'query': query,
        'pages': pages,
        'total_impressions': total_imp,
        'total_clicks': total_clicks,
        'page_count': len(pages),
        'pos_spread': round(pages[-1]['position'] - pages[0]['position'], 1)
    })

cannibalized.sort(key=lambda x: x['total_impressions'], reverse=True)

# --- Output ---
print(f"{'Query':<40} {'Page 1':<40} {'Pos1':>5} {'Page 2':<40} {'Pos2':>5} {'Total Imp':>9} {'Total Clk':>9}")
print("-" * 152)
for c in cannibalized[:40]:
    p1 = c['pages'][0]
    p2 = c['pages'][1]
    p1_short = p1['page'] if len(p1['page']) <= 38 else '...' + p1['page'][-35:]
    p2_short = p2['page'] if len(p2['page']) <= 38 else '...' + p2['page'][-35:]
    extra = f" (+{c['page_count'] - 2} more)" if c['page_count'] > 2 else ""
    print(f"{c['query'][:39]:<40} {p1_short:<40} {p1['position']:>5} {p2_short:<40} {p2['position']:>5} {c['total_impressions']:>9} {c['total_clicks']:>9}{extra}")

print(f"\nTotal cannibalized queries: {len(cannibalized)}")
if cannibalized:
    total_queries_affected = len(cannibalized)
    multi_page = sum(1 for c in cannibalized if c['page_count'] > 2)
    print(f"Queries with 3+ competing pages: {multi_page}")
    print(f"\nHighest-impact cannibalization (by impressions):")
    for c in cannibalized[:5]:
        print(f"  '{c['query']}' -> {c['page_count']} pages, {c['total_impressions']} imp, positions: {', '.join(str(p['position']) for p in c['pages'])}")
```

### Output Table Format

| Query | Page 1 | Pos 1 | Page 2 | Pos 2 | Total Impressions | Total Clicks |
|-------|--------|-------|--------|-------|-------------------|--------------|
| crm software guide | /blog/crm-guide | 6.2 | /products/crm | 11.4 | 3,200 | 45 |

### Interpretation Guide

- **Both pages on page 1 (positions 1-10):** This can actually be beneficial (dominating SERPs). Only fix if positions are unstable (fluctuating between the two pages) or if one page is clearly more appropriate.
- **One page on page 1, one on page 2:** The page 2 result is diluting ranking signals from the page 1 result. Consolidate to strengthen the page 1 ranking.
- **Both pages on page 2:** Strong cannibalization signal. Neither page can break through because authority is split. This is the most urgent case to fix.
- **Position spread > 10:** The pages may actually be targeting different intents of the same query. Verify before merging.
- **3+ pages competing:** Severe cannibalization. The site has no clear topical authority page for this query.

### Recommended Actions

1. **Merge Content:** Choose the stronger page (better position, more backlinks, more content). Merge the best content from the weaker page into the stronger one. 301 redirect the weaker page to the stronger one.
2. **301 Redirect:** If one page is clearly redundant, redirect it to the canonical version. Ensure all internal links update to point to the surviving page.
3. **Canonical Tag:** If both pages must exist (e.g., a blog post and a product page), use `rel=canonical` to indicate which is the primary version for this query.
4. **Differentiate Target Intent:** If the two pages serve genuinely different intents (informational vs. commercial), differentiate them by adjusting titles, H1s, and content to target distinct query variants. For example, one page targets "what is CRM" (informational) and the other targets "best CRM software" (commercial).
5. **Internal Link Consolidation:** Ensure all internal links for the target query point to the designated canonical page, not split between competing pages.

---

## Analysis 6: Quick Wins

### What It Detects

The highest-ROI optimizations available right now. These are changes that require minimal effort but produce maximum impact. Quick wins fall into two categories:

- **Type A -- Title/Meta Fix:** Page ranks on page 1 but CTR is below threshold. Fix the title and meta description to capture more of the existing impressions.
- **Type B -- Almost Page 1:** Page ranks at positions 11-15 with high impressions. A minor content or linking push can move it to page 1.

### Data Source

`gsc-query-page-28d.json` (dimensions: query, page)

### Filter Criteria

**Type A -- Title Fix:**
- Position 1-10
- Impressions >= 300
- CTR below the "Low" threshold for the position bracket
- Non-branded queries

**Type B -- Almost Page 1:**
- Position 11-15
- Impressions >= 200
- Non-branded queries

Both types sorted by estimated impact (missed clicks or potential clicks) descending.

### Python Extraction Script

```python
import json, sys, os
from urllib.parse import urlparse

# --- Benchmark helper ---
def get_expected_ctr(position):
    if position <= 1.5: return (0.295, 0.20)
    elif position <= 2.5: return (0.165, 0.10)
    elif position <= 3.5: return (0.11, 0.07)
    elif position <= 5.5: return (0.07, 0.04)
    elif position <= 10.5: return (0.03, 0.015)
    elif position <= 20.5: return (0.01, 0.003)
    else: return (0.005, 0.001)

# --- Load data ---
filepath = 'gsc-query-page-28d.json'
if not os.path.exists(filepath):
    print(f"ERROR: {filepath} not found. Run Phase 2 data pull first.")
    sys.exit(1)

with open(filepath) as f:
    data = json.load(f)

rows = data.get('rows', [])
if not rows:
    print("No data rows found in file.")
    sys.exit(1)

# --- Detect domain for branded query filtering ---
sample_page = rows[0]['keys'][1]
domain_name = urlparse(sample_page).netloc.replace('www.', '').split('.')[0].lower()

# --- Find quick wins ---
type_a = []  # Title/meta fix (page 1, low CTR)
type_b = []  # Almost page 1 (position 11-15, high impressions)

for row in rows:
    query = row['keys'][0]
    page = row['keys'][1]
    pos = row.get('position', 0)
    imp = row.get('impressions', 0)
    ctr = row.get('ctr', 0)
    clicks = row.get('clicks', 0)

    # Skip branded queries
    if domain_name and domain_name in query.lower():
        continue

    # Type A: Page 1 + low CTR
    if 1 <= pos <= 10 and imp >= 300:
        expected_ctr, low_threshold = get_expected_ctr(pos)
        if ctr < low_threshold:
            missed = round(imp * (expected_ctr - ctr))
            type_a.append({
                'type': 'A',
                'query': query,
                'page': page,
                'position': round(pos, 1),
                'impressions': imp,
                'current_ctr': round(ctr * 100, 2),
                'expected_ctr': round(expected_ctr * 100, 2),
                'est_impact': missed,
                'action': 'Rewrite title + meta'
            })

    # Type B: Almost page 1
    if 11 <= pos <= 15 and imp >= 200:
        potential = round(imp * 0.07)  # Estimated CTR at position 5
        type_b.append({
            'type': 'B',
            'query': query,
            'page': page,
            'position': round(pos, 1),
            'impressions': imp,
            'current_ctr': round(ctr * 100, 2),
            'expected_ctr': 7.0,
            'est_impact': potential,
            'action': 'Content + internal links'
        })

# Combine and sort by estimated impact
all_wins = type_a + type_b
all_wins.sort(key=lambda x: x['est_impact'], reverse=True)

# --- Output ---
print(f"{'Type':<6} {'Query':<35} {'Page':<40} {'Pos':>5} {'Imp':>6} {'Curr CTR':>8} {'Est Impact':>10} {'Action':<25}")
print("-" * 138)
for w in all_wins[:50]:
    page_short = w['page'] if len(w['page']) <= 38 else '...' + w['page'][-35:]
    print(f"{w['type']:<6} {w['query'][:34]:<35} {page_short:<40} {w['position']:>5} {w['impressions']:>6} {w['current_ctr']:>7}% {w['est_impact']:>10} {w['action']:<25}")

print(f"\nType A (title/meta fix): {len(type_a)}")
print(f"Type B (almost page 1): {len(type_b)}")
print(f"Total quick wins: {len(all_wins)}")
if all_wins:
    total_impact = sum(w['est_impact'] for w in all_wins)
    print(f"Total estimated additional clicks (28 days): {total_impact}")
```

### Output Table Format

| Type | Query | Page | Position | Impressions | Current CTR | Est. Impact | Action |
|------|-------|------|----------|-------------|------------|-------------|--------|
| A | best crm software | /blog/crm-guide | 3.2 | 2,400 | 4.1% | 166 | Rewrite title + meta |
| B | crm comparison chart | /blog/crm-list | 12.1 | 800 | 0.5% | 56 | Content + internal links |

### Interpretation Guide

- **Type A wins are the fastest to execute.** Changing a title tag and meta description takes 5 minutes and can double CTR within 2-3 weeks. Always start here.
- **Type B wins require slightly more effort** but have a potentially larger payoff -- moving from page 2 to page 1 is a step-change in traffic, not an incremental improvement.
- **Prioritize by Est. Impact column.** This is the estimated number of additional clicks per 28 days. Focus on the top 10-15 items first.
- **Type A + Type B on the same page:** If a page appears in both lists for different queries, it is a high-priority page that needs comprehensive optimization.

### Recommended Actions

**For Type A (Title/Meta Fix):**
1. Pull the top 3-5 queries driving impressions to the page from GSC data.
2. Rewrite the title tag to include the primary query naturally, plus a compelling element (number, year, benefit).
3. Rewrite the meta description to directly address the search intent with a clear call-to-action.
4. Implement and wait 2-3 weeks to measure CTR improvement.

**For Type B (Almost Page 1):**
1. Add 200-400 words of new content to the page covering subtopics suggested by the ranking queries.
2. Add 2-3 internal links from high-authority pages on your site, using anchor text that matches the target query.
3. Ensure on-page SEO is solid: query in H1, first paragraph, at least one H2, and meta description.
4. Measure position improvement after 3-4 weeks.

---

## Analysis 7: Top Performers at Risk

### What It Detects

Your best-performing pages -- those in positions 1-5 with significant click volume -- that are showing early signs of decline. These pages drive the most traffic and revenue, so even a small drop in position can have outsized business impact.

### Data Source

- `gsc-query-page-28d.json` (current 28 days)
- `gsc-query-page-prev-28d.json` (previous 28 days)

### Filter Criteria

- Current position 1-5 (top performers)
- Current clicks >= 50 in the 28-day period
- At least one of:
  - Clicks decreased compared to previous period (any decline)
  - Position worsened by > 1 spot compared to previous period
- Sorted by absolute click loss descending

### Python Extraction Script

```python
import json, sys, os

# --- Load data ---
current_file = 'gsc-query-page-28d.json'
prev_file = 'gsc-query-page-prev-28d.json'

for f in [current_file, prev_file]:
    if not os.path.exists(f):
        print(f"ERROR: {f} not found. Run Phase 2 data pull first.")
        sys.exit(1)

with open(current_file) as f:
    current_data = json.load(f)
with open(prev_file) as f:
    prev_data = json.load(f)

# --- Build previous period lookup ---
prev_lookup = {}
for row in prev_data.get('rows', []):
    key = (row['keys'][0], row['keys'][1])
    prev_lookup[key] = {
        'clicks': row.get('clicks', 0),
        'impressions': row.get('impressions', 0),
        'position': row.get('position', 0)
    }

# --- Find top performers showing decline ---
results = []
for row in current_data.get('rows', []):
    query = row['keys'][0]
    page = row['keys'][1]
    key = (query, page)

    curr_pos = row.get('position', 0)
    curr_clicks = row.get('clicks', 0)

    # Top performer criteria
    if curr_pos > 5 or curr_clicks < 50:
        continue

    if key not in prev_lookup:
        continue

    prev = prev_lookup[key]
    prev_clicks = prev['clicks']
    prev_pos = prev['position']

    pos_change = curr_pos - prev_pos  # positive = worsened
    click_change = curr_clicks - prev_clicks
    click_change_pct = ((curr_clicks - prev_clicks) / prev_clicks * 100) if prev_clicks > 0 else 0

    # Decline criteria: clicks decreased OR position worsened > 1 spot
    if click_change < 0 or pos_change > 1:
        results.append({
            'page': page,
            'query': query,
            'curr_pos': round(curr_pos, 1),
            'prev_pos': round(prev_pos, 1),
            'pos_change': round(pos_change, 1),
            'curr_clicks': curr_clicks,
            'prev_clicks': prev_clicks,
            'click_change': click_change,
            'click_change_pct': round(click_change_pct, 1),
            'curr_imp': row.get('impressions', 0)
        })

# Sort by click loss (biggest losses first)
results.sort(key=lambda x: x['click_change'])

# --- Output ---
print(f"{'Page':<40} {'Top Query':<30} {'Curr Pos':>8} {'Prev Pos':>8} {'Pos Chg':>7} {'Curr Clk':>8} {'Prev Clk':>8} {'Clk Chg%':>8}")
print("-" * 120)
for r in results[:40]:
    page_short = r['page'] if len(r['page']) <= 38 else '...' + r['page'][-35:]
    print(f"{page_short:<40} {r['query'][:29]:<30} {r['curr_pos']:>8} {r['prev_pos']:>8} {r['pos_change']:>+7.1f} {r['curr_clicks']:>8} {r['prev_clicks']:>8} {r['click_change_pct']:>+7.1f}%")

print(f"\nTop performers at risk: {len(results)}")
if results:
    total_click_loss = sum(abs(r['click_change']) for r in results if r['click_change'] < 0)
    print(f"Total click volume at risk: {total_click_loss}")
    pos_declining = sum(1 for r in results if r['pos_change'] > 0)
    clicks_declining = sum(1 for r in results if r['click_change'] < 0)
    print(f"Pages with position decline: {pos_declining}")
    print(f"Pages with click decline: {clicks_declining}")
```

### Output Table Format

| Page | Top Query | Current Pos | Prev Pos | Pos Change | Curr Clicks | Prev Clicks | Click Change% |
|------|-----------|------------|----------|------------|-------------|-------------|---------------|
| /blog/crm-guide | best crm software | 3.2 | 1.8 | +1.4 | 180 | 245 | -26.5% |

### Interpretation Guide

- **Position moved from 1 to 2-3:** Another result has overtaken you. Check if a competitor published new content, if a featured snippet appeared, or if Google is testing a different SERP layout.
- **Position moved from 2-3 to 4-5:** You are being pushed down. The urgency is moderate -- still on page 1 but losing premium real estate. Act within 2 weeks.
- **Position stable but clicks declining:** A SERP feature (featured snippet, People Also Ask, knowledge panel) is stealing clicks. Or ad placements have increased above organic results.
- **Both position and clicks declining:** The most urgent case. Your content is aging out and competitors are gaining. Immediate action required.
- **Slight position decline (< 0.5) with significant click drop:** May indicate seasonal variation or a temporary fluctuation. Monitor for another week before acting.

### Recommended Actions

1. **Content Refresh (Immediate):** Update the publication date, refresh statistics and examples, add a new section covering recent developments. Content freshness is one of the strongest signals for maintaining top positions.
2. **Update Dates and Stats:** Replace any outdated year references, statistics, or examples with current data. "2023 Guide" in the title loses clicks in 2024.
3. **Add New Sections:** Identify subtopics that competitors now cover but your page does not. Add 200-400 words per new section.
4. **Improve Page Speed:** Top positions are increasingly sensitive to Core Web Vitals. Run Lighthouse and fix any performance regressions.
5. **Earn Fresh Links:** Reach out for links from recently-published articles, conduct original research that earns citations, or update an existing statistic that others reference.
6. **Monitor Weekly:** These pages are your traffic foundation. Set up position tracking and check weekly until the decline stabilizes or reverses.

---

## Analysis 8: Device and Geo Gaps

### What It Detects

Pages that perform significantly differently across devices (mobile vs desktop) or countries. A page ranking position 3 on desktop but position 15 on mobile has a mobile UX or page speed problem. A page ranking well in the US but poorly in the UK may have geo-targeting or content relevance issues.

### Data Source

- `gsc-query-page-device-28d.json` (dimensions: query, page, device)
- `gsc-query-page-country-28d.json` (dimensions: query, page, country)

### Filter Criteria

**Device Gap:**
- Compare mobile vs desktop position for the same query+page combination
- Flag where the position difference is > 5 positions
- Minimum impressions >= 50 per device segment
- Sorted by gap size descending

**Country/Geo Gap:**
- Compare position across countries for the same query+page combination
- Flag where position differs by > 10 spots between any two countries
- Minimum impressions >= 50 per country segment
- Sorted by gap size descending

### Python Extraction Script

```python
import json, sys, os
from collections import defaultdict

# =============================================
# PART 1: DEVICE GAPS
# =============================================

device_file = 'gsc-query-page-device-28d.json'
if os.path.exists(device_file):
    with open(device_file) as f:
        device_data = json.load(f)

    # Group by (query, page) with device breakdown
    device_groups = defaultdict(dict)
    for row in device_data.get('rows', []):
        query = row['keys'][0]
        page = row['keys'][1]
        device = row['keys'][2].upper()  # MOBILE, DESKTOP, TABLET
        imp = row.get('impressions', 0)

        if imp >= 50:
            device_groups[(query, page)][device] = {
                'position': round(row.get('position', 0), 1),
                'impressions': imp,
                'clicks': row.get('clicks', 0),
                'ctr': round(row.get('ctr', 0) * 100, 2)
            }

    # Find gaps > 5 positions between mobile and desktop
    device_results = []
    for (query, page), devices in device_groups.items():
        if 'MOBILE' in devices and 'DESKTOP' in devices:
            mob = devices['MOBILE']
            desk = devices['DESKTOP']
            gap = abs(mob['position'] - desk['position'])

            if gap > 5:
                worse_on = 'MOBILE' if mob['position'] > desk['position'] else 'DESKTOP'
                device_results.append({
                    'query': query,
                    'page': page,
                    'mobile_pos': mob['position'],
                    'desktop_pos': desk['position'],
                    'gap': round(gap, 1),
                    'mobile_imp': mob['impressions'],
                    'desktop_imp': desk['impressions'],
                    'worse_on': worse_on
                })

    device_results.sort(key=lambda x: x['gap'], reverse=True)

    print("=" * 130)
    print("DEVICE GAPS (Mobile vs Desktop position difference > 5)")
    print("=" * 130)
    print(f"{'Query':<35} {'Page':<35} {'Mob Pos':>7} {'Desk Pos':>8} {'Gap':>5} {'Mob Imp':>7} {'Desk Imp':>8} {'Worse On':>9}")
    print("-" * 130)
    for r in device_results[:30]:
        page_short = r['page'] if len(r['page']) <= 33 else '...' + r['page'][-30:]
        print(f"{r['query'][:34]:<35} {page_short:<35} {r['mobile_pos']:>7} {r['desktop_pos']:>8} {r['gap']:>5} {r['mobile_imp']:>7} {r['desktop_imp']:>8} {r['worse_on']:>9}")

    print(f"\nTotal device gap pairs: {len(device_results)}")
    mobile_worse = sum(1 for r in device_results if r['worse_on'] == 'MOBILE')
    print(f"Worse on mobile: {mobile_worse}")
    print(f"Worse on desktop: {len(device_results) - mobile_worse}")
else:
    print(f"WARNING: {device_file} not found. Skipping device analysis.")

print()

# =============================================
# PART 2: COUNTRY/GEO GAPS
# =============================================

country_file = 'gsc-query-page-country-28d.json'
if os.path.exists(country_file):
    with open(country_file) as f:
        country_data = json.load(f)

    # Group by (query, page) with country breakdown
    country_groups = defaultdict(dict)
    for row in country_data.get('rows', []):
        query = row['keys'][0]
        page = row['keys'][1]
        country = row['keys'][2]  # 3-letter country code
        imp = row.get('impressions', 0)

        if imp >= 50:
            country_groups[(query, page)][country] = {
                'position': round(row.get('position', 0), 1),
                'impressions': imp,
                'clicks': row.get('clicks', 0)
            }

    # Find gaps > 10 positions between any two countries
    country_results = []
    for (query, page), countries in country_groups.items():
        if len(countries) < 2:
            continue

        country_list = sorted(countries.items(), key=lambda x: x[1]['position'])
        best_country, best_data = country_list[0]
        worst_country, worst_data = country_list[-1]
        gap = worst_data['position'] - best_data['position']

        if gap > 10:
            country_results.append({
                'query': query,
                'page': page,
                'best_country': best_country,
                'best_pos': best_data['position'],
                'best_imp': best_data['impressions'],
                'worst_country': worst_country,
                'worst_pos': worst_data['position'],
                'worst_imp': worst_data['impressions'],
                'gap': round(gap, 1),
                'total_countries': len(countries)
            })

    country_results.sort(key=lambda x: x['gap'], reverse=True)

    print("=" * 140)
    print("COUNTRY GAPS (Position difference > 10 between countries)")
    print("=" * 140)
    print(f"{'Query':<30} {'Page':<35} {'Best CC':>7} {'Best Pos':>8} {'Worst CC':>8} {'Worst Pos':>9} {'Gap':>5} {'Best Imp':>8} {'Worst Imp':>9}")
    print("-" * 140)
    for r in country_results[:30]:
        page_short = r['page'] if len(r['page']) <= 33 else '...' + r['page'][-30:]
        print(f"{r['query'][:29]:<30} {page_short:<35} {r['best_country']:>7} {r['best_pos']:>8} {r['worst_country']:>8} {r['worst_pos']:>9} {r['gap']:>5} {r['best_imp']:>8} {r['worst_imp']:>9}")

    print(f"\nTotal country gap pairs: {len(country_results)}")
    if country_results:
        avg_gap = sum(r['gap'] for r in country_results) / len(country_results)
        print(f"Average position gap: {avg_gap:.1f}")
else:
    print(f"WARNING: {country_file} not found. Skipping country analysis.")
```

### Output Table Format -- Device Gaps

| Query | Page | Mobile Pos | Desktop Pos | Gap | Mobile Imp | Desktop Imp | Worse On |
|-------|------|-----------|------------|-----|-----------|------------|----------|
| best crm software | /blog/crm-guide | 14.2 | 3.8 | 10.4 | 1,200 | 800 | MOBILE |

### Output Table Format -- Country Gaps

| Query | Page | Best Country | Best Pos | Worst Country | Worst Pos | Gap | Best Imp | Worst Imp |
|-------|------|-------------|----------|--------------|-----------|-----|---------|----------|
| crm software review | /blog/crm-guide | USA | 3.2 | GBR | 18.7 | 15.5 | 2,400 | 350 |

### Interpretation Guide

**Device Gaps:**
- **Worse on mobile (most common):** The page likely has mobile UX issues -- slow load time, layout shift, small tap targets, unresponsive design, interstitial popups, or images not optimized for mobile. Google uses mobile-first indexing, so mobile performance directly affects rankings.
- **Worse on desktop (less common):** The page may be designed mobile-first with desktop layout issues, or desktop-specific rendering problems. Less critical than mobile gaps but still worth fixing.
- **Gap > 10 positions:** A significant technical problem. Run Lighthouse in both mobile and desktop modes and compare scores.
- **Gap 5-10 positions:** Moderate issue. Check Core Web Vitals specifically -- LCP and CLS often differ between devices.

**Country Gaps:**
- **English-speaking country gaps (US vs UK vs AU):** Content may use US-centric terminology or references that do not resonate in other English markets. Also check if competitors in the weaker country have stronger local content.
- **Cross-language gaps:** If the page ranks well in one language market but poorly in another, consider creating localized content with proper hreflang tags.
- **Regulatory/market differences:** Some topics rank differently by country due to different regulations, market conditions, or search behavior. "Health insurance" performs very differently in the US vs UK due to fundamentally different systems.

### Recommended Actions

**For Device Gaps:**
1. **Mobile Page Speed:** Run Lighthouse in mobile mode. Fix any failing Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms.
2. **Mobile Rendering:** Test the page in Chrome DevTools mobile emulation. Look for content that does not render, horizontal scrolling, overlapping elements, or text that is too small.
3. **Eliminate Interstitials:** Remove or minimize pop-ups and interstitials on mobile. Google penalizes intrusive interstitials.
4. **Image Optimization:** Serve appropriately sized images for mobile screens. Use `srcset` or a CDN with automatic resizing.
5. **Touch Target Sizing:** Ensure all buttons and links are at least 48x48px with adequate spacing between them.

**For Country Gaps:**
1. **Hreflang Implementation:** If you serve content to multiple countries/languages, implement proper hreflang tags to signal to Google which version is for which market.
2. **Geo-Targeted Content:** Create country-specific versions of high-value pages with localized terminology, currency, regulations, and examples.
3. **CDN and Hosting:** Ensure page load times are consistent globally. Use a CDN with edge locations near your target markets.
4. **Local Backlinks:** Build backlinks from country-specific domains (.co.uk, .com.au) to strengthen local relevance signals.
5. **Google Search Console Geotargeting:** If using a generic TLD (.com), set geographic targeting in GSC for specific subdirectories or subdomains serving specific countries.

---

## Running All Analyses

To run all 8 analyses in sequence, save each script above to a file and execute:

```bash
# Save scripts as analysis_1.py through analysis_8.py, then:
for i in $(seq 1 8); do
    echo "========================================"
    echo "ANALYSIS $i"
    echo "========================================"
    python3 analysis_$i.py
    echo ""
done
```

Alternatively, run them individually as needed. Not every site will have meaningful results for all 8 analyses. Prioritize based on which analyses surface the most actionable findings.

### Minimum Data Requirements

| Analysis | Required Files | Minimum Rows Needed |
|----------|---------------|-------------------|
| 1 - Striking Distance | `gsc-query-page-28d.json` | 50+ |
| 2 - Low-CTR Pages | `gsc-query-page-28d.json` | 100+ |
| 3 - Declining Pages | `gsc-query-page-28d.json` + `gsc-query-page-prev-28d.json` | 100+ per file |
| 4 - Content Gaps | `gsc-query-page-28d.json` | 50+ |
| 5 - Cannibalization | `gsc-query-page-28d.json` | 100+ |
| 6 - Quick Wins | `gsc-query-page-28d.json` | 50+ |
| 7 - Top Performers | `gsc-query-page-28d.json` + `gsc-query-page-prev-28d.json` | 100+ per file |
| 8 - Device/Geo Gaps | `gsc-query-page-device-28d.json` + `gsc-query-page-country-28d.json` | 50+ per file |

Sites with fewer than 50 rows of GSC data typically do not have enough search visibility for meaningful analysis. Focus on building content and authority first.
