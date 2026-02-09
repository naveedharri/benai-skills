# Optimization Templates

Concrete, copy-pasteable templates for executing SEO optimizations. Every recommendation references actual GSC data points. Use these templates during Phase 5 (Optimize) of the SEO Optimizing workflow.

---

## 1. Title Tag Formulas

Use these formulas to rewrite title tags for low-CTR pages. Insert the primary query from GSC data into the `[Primary Query]` slot.

| Pattern | Template | Best For | Example |
|---------|----------|----------|---------|
| Query-First | `[Primary Query] — [Brand]` | High-intent commercial queries | `Best Running Shoes 2024 — NikeStore` |
| How-To | `How to [Query]: [Benefit]` | Informational queries | `How to Fix a Leaky Faucet: 5-Minute Guide` |
| List | `[Number] Best [Query] ([Year])` | Comparison/listicle queries | `12 Best Project Management Tools (2024)` |
| Question | `[Query]? [Answer Hook]` | FAQ-style / question queries | `Is React Better Than Vue? Here's the Data` |
| Benefit-Led | `[Benefit] with [Query] \| [Brand]` | Feature / product pages | `Save 3 Hours/Week with Automated Invoicing \| Acme` |
| Guide | `[Query]: The Complete Guide ([Year])` | Comprehensive / pillar content | `Docker Networking: The Complete Guide (2024)` |
| Comparison | `[A] vs [B]: Which [Query] Is Better?` | Comparison / versus pages | `Notion vs Obsidian: Which Note App Is Better?` |
| Local | `[Query] in [City] — [Brand]` | Local SEO / service-area pages | `Emergency Plumber in Austin — FastFix` |

### Title Tag Rules

1. **Keep under 60 characters.** Google truncates titles at approximately 580px (roughly 60 characters). Measure pixel width when possible.
2. **Front-load the primary keyword.** Place the highest-impression GSC query at the beginning of the title. Google bolds matching words, improving CTR.
3. **Include the year for time-sensitive content.** If the GSC query data includes year-modified queries (e.g., "best CRM 2024"), add the current year.
4. **Match the search intent revealed by GSC query data.** If most queries are questions, use the Question or How-To pattern. If queries are commercial ("best," "top," "review"), use List or Comparison.
5. **One primary query per title.** Do not keyword-stuff. Pick the single highest-impression query from GSC for that page and build the title around it.
6. **Differentiate from competitors.** Add a unique angle -- a number, a benefit, or a qualifier that competing titles lack.
7. **Never duplicate titles across pages.** Each page must have a unique title tag. Check for cannibalization before rewriting.

### Choosing the Right Formula

```
GSC query data for page → Identify dominant intent
│
├── Questions ("how to", "what is", "why does")
│   └── Use: How-To or Question pattern
│
├── Commercial ("best", "top", "review", "vs")
│   └── Use: List, Comparison, or Query-First pattern
│
├── Informational (broad topic, no commercial modifier)
│   └── Use: Guide or How-To pattern
│
├── Local ("in [city]", "near me", "[city] + service")
│   └── Use: Local pattern
│
└── Navigational (brand name in query)
    └── Use: Query-First pattern (brand prominent)
```

### Title Rewrite Workflow (GSC-Driven)

```bash
# Step 1: Pull top queries for the target page
python3 -c "
import json
data = json.load(open('gsc-query-page-28d.json'))
target_page = 'TARGET_URL_HERE'
queries = []
for row in data.get('rows', []):
    if row['keys'][1] == target_page:
        queries.append({
            'query': row['keys'][0],
            'clicks': row.get('clicks', 0),
            'impressions': row.get('impressions', 0),
            'ctr': round(row.get('ctr', 0) * 100, 2),
            'position': round(row.get('position', 0), 1)
        })
queries.sort(key=lambda x: x['impressions'], reverse=True)
for q in queries[:15]:
    print(f\"{q['query']:50} imp:{q['impressions']:6} pos:{q['position']:5} ctr:{q['ctr']:5}%\")
"
```

```bash
# Step 2: Identify intent and select formula
# Look at the top 5 queries by impression:
#   - If most contain "how to" / "what is" → informational
#   - If most contain "best" / "top" / "review" → commercial
#   - If most are questions → FAQ / question intent
#   - Use the matching formula from the table above

# Step 3: Construct the new title
# - Insert the #1 impression query into the formula
# - Keep under 60 characters
# - Verify it does not duplicate another page's title
```

---

## 2. Meta Description Templates

Write meta descriptions that match the search intent revealed by GSC query data for each page.

| Intent | Template | Character Guide |
|--------|----------|-----------------|
| Commercial | `[Value prop]. [Key feature or differentiator]. [CTA with urgency]. [Trust signal].` | ~150 chars |
| Informational | `Learn [topic] with [method/framework]. Covers [scope of content]. [Outcome/benefit].` | ~150 chars |
| Navigational | `Official [Brand] [page type]. [Key features/offerings]. [CTA].` | ~150 chars |
| Comparison | `Compare [A] vs [B] on [criteria]. See [data points/reviews/benchmarks]. [CTA].` | ~150 chars |
| Local | `[Service] in [location]. [Key differentiator]. [CTA]. [Trust signal: years/reviews].` | ~150 chars |
| Transactional | `[Product/service] starting at [price/value]. [Key benefit]. [CTA]. [Guarantee/offer].` | ~150 chars |

### Meta Description Rules

1. **Keep under 155 characters.** Google truncates at approximately 920px on desktop. Aim for 140-155 characters.
2. **Include the primary query naturally.** Google bolds matching query words in the description, which improves visual CTR.
3. **Match the dominant search intent from GSC data.** If 80% of impressions come from commercial queries, write a commercial description -- not informational.
4. **Include a call-to-action.** Use action verbs: "Learn," "Compare," "Get," "Try," "Download," "Start," "See."
5. **Use active voice.** "Compare 12 tools and find the best fit" beats "12 tools are compared in this article."
6. **Never duplicate the title tag.** The description should expand on the title, not repeat it.
7. **Add a trust signal when possible.** Numbers, years of experience, review counts, or certifications.

### Meta Description Examples (GSC-Driven)

**Commercial intent page:**
```
Top GSC query: "best project management software for startups"
Impressions: 3,200 | Position: 6 | CTR: 2.8% (expected ~5%)

BEFORE: "Project management software by Acme. Learn more about our features."
AFTER:  "Compare the 8 best project management tools for startups in 2024. Real pricing, features, and team reviews. Find your fit in 5 minutes."
        (143 chars)
```

**Informational intent page:**
```
Top GSC query: "how to set up docker compose"
Impressions: 8,500 | Position: 4 | CTR: 5.1% (expected ~8%)

BEFORE: "Docker Compose guide. Read our documentation."
AFTER:  "Set up Docker Compose in 10 minutes with this step-by-step guide. Covers networking, volumes, and multi-container apps. Includes examples."
        (148 chars)
```

**Local intent page:**
```
Top GSC query: "emergency plumber austin tx"
Impressions: 1,800 | Position: 7 | CTR: 3.2% (expected ~5%)

BEFORE: "FastFix Plumbing offers plumbing services in Austin."
AFTER:  "24/7 emergency plumber in Austin, TX. Average response time: 30 minutes. Licensed & insured. 4.9 stars from 500+ reviews. Call now."
        (138 chars)
```

---

## 3. Content Enhancement Checklist for Striking Distance Pages

Use this checklist for every page at position 11-20 with significant impressions. Work through each item systematically.

### Pre-Work: Gather Data

```bash
# Pull all queries driving impressions to the target page
python3 -c "
import json
data = json.load(open('gsc-query-page-28d.json'))
target_page = 'TARGET_URL_HERE'
queries = []
for row in data.get('rows', []):
    if row['keys'][1] == target_page:
        queries.append({
            'query': row['keys'][0],
            'clicks': row.get('clicks', 0),
            'impressions': row.get('impressions', 0),
            'ctr': round(row.get('ctr', 0) * 100, 2),
            'position': round(row.get('position', 0), 1)
        })
queries.sort(key=lambda x: x['impressions'], reverse=True)
print(f'Page: {target_page}')
print(f'Total queries: {len(queries)}')
print(f'Total impressions: {sum(q[\"impressions\"] for q in queries)}')
print()
for q in queries[:25]:
    print(f\"{q['query']:50} pos:{q['position']:5} imp:{q['impressions']:6} clicks:{q['clicks']:4}\")
"
```

### Checklist

#### 1. Query Integration

Add the exact striking-distance queries from GSC naturally into the page:

- [ ] **H2/H3 subheadings** -- Create or rename subheadings to include the top 3-5 GSC queries verbatim. Example: If the query is "docker compose networking," add an H2: "Docker Compose Networking: Configuration and Best Practices."
- [ ] **Opening paragraph** -- Weave the primary query (highest impressions) into the first 100 words of the page.
- [ ] **Image alt text** -- Update at least 2-3 image alt attributes to include relevant queries. Keep alt text descriptive and natural.
- [ ] **Internal link anchor text** -- On other pages that link to this one, update anchor text to match the target queries.

#### 2. Content Depth

Compare the page against what currently ranks in the top 10:

- [ ] **Word count benchmark** -- Check the page word count against content type minimums:
  - Blog post / article: 1,500+ words
  - Product page: 500+ words
  - Landing page: 800+ words
  - Resource / pillar page: 2,500+ words
- [ ] **Topic gap analysis** -- Review the GSC queries for subtopics not covered on the page. Every query variant with 50+ impressions should have a corresponding section.
- [ ] **FAQ section** -- Add an FAQ section answering questions found in the GSC query data. Look for queries starting with "how," "what," "why," "can," "is," "does."
- [ ] **Unique value** -- Add at least one element that competing pages lack: original data, a calculator, a comparison table, expert quotes, or a downloadable resource.

#### 3. Freshness Signals

Update time-sensitive elements:

- [ ] **Publication / last-modified date** -- Update to the current date. If the CMS supports "last updated," use that field.
- [ ] **Statistics and data points** -- Replace any outdated stats with current numbers. Cite the source and year.
- [ ] **Screenshots and images** -- Replace outdated UI screenshots. Add new images for any added sections.
- [ ] **External references** -- Update outbound links to point to current, authoritative sources. Remove dead links.
- [ ] **Year references** -- Update any year mentions in headings, body text, or title tags.

#### 4. Internal Linking

Build authority signals to the page:

- [ ] **Add 3-5 inbound internal links** from high-authority pages (pages with the most clicks in `gsc-pages-28d.json`) to this striking-distance page.
- [ ] **Use anchor text matching the target query.** Do not use generic text like "click here" or "read more."
- [ ] **Place links in paragraph context** -- contextual in-content links carry more weight than sidebar, footer, or navigation links.
- [ ] **Add 2-3 outbound internal links** from this page to related pages, creating a topical cluster.

```bash
# Find high-authority pages to link FROM
python3 -c "
import json
data = json.load(open('gsc-pages-28d.json'))
pages = []
for row in data.get('rows', []):
    pages.append({
        'page': row['keys'][0],
        'clicks': row.get('clicks', 0),
        'impressions': row.get('impressions', 0)
    })
pages.sort(key=lambda x: x['clicks'], reverse=True)
print('Top pages by clicks (link FROM these to your target page):')
for p in pages[:20]:
    print(f\"  {p['page']:60} clicks:{p['clicks']:6} imp:{p['impressions']:8}\")
"
```

#### 5. Technical Quick Fixes

- [ ] **H1 includes primary query** -- The H1 should contain the highest-impression GSC query for this page. If it does not, rewrite it.
- [ ] **Structured data** -- Add relevant schema markup:
  - FAQ schema for pages with FAQ sections
  - HowTo schema for tutorial/guide pages
  - Article schema for blog posts
  - Product schema for product pages
- [ ] **Core Web Vitals** -- If seo-audit data is available, check LCP, CLS, and TBT scores for this page. Fix any failing metrics.
- [ ] **Meta description** -- Add or rewrite using the templates in Section 2 above.
- [ ] **URL slug** -- If the slug does not include the primary query and the page is relatively new (< 3 months old), consider updating it with a 301 redirect from the old URL.

---

## 4. Content Gap New-Page Outline Template

Use this template when GSC data reveals high-impression queries landing on the wrong page (e.g., homepage, unrelated category page) with no dedicated content.

### How to Identify Content Gaps from GSC Data

```bash
# Find high-impression queries landing on likely wrong pages
python3 -c "
import json
data = json.load(open('gsc-query-page-28d.json'))
homepage_queries = []
for row in data.get('rows', []):
    query = row['keys'][0]
    page = row['keys'][1]
    impressions = row.get('impressions', 0)
    position = row.get('position', 0)
    # Flag: high impressions but landing on homepage or root-level pages
    if impressions >= 200 and (page.rstrip('/').count('/') <= 3 or page.rstrip('/').endswith('.com')):
        homepage_queries.append({
            'query': query,
            'page': page,
            'impressions': impressions,
            'clicks': row.get('clicks', 0),
            'position': round(position, 1)
        })
homepage_queries.sort(key=lambda x: x['impressions'], reverse=True)
print('Potential content gaps (high-impression queries on generic pages):')
for q in homepage_queries[:30]:
    print(f\"  {q['query']:45} → {q['page'][:50]:50} imp:{q['impressions']:6} pos:{q['position']}\")
"
```

### Content Brief Template

Copy and fill in this template for each content gap opportunity:

```markdown
# Content Brief: [Target Query]

## Target Queries (from GSC Data)
- **Primary:** [highest-impression query from GSC for this topic]
- **Secondary:** [2nd-highest impression query, same topic cluster]
- **Tertiary:** [3rd-highest impression query, same topic cluster]
- **Long-tail variants:** [additional lower-impression queries worth covering]

## Search Intent
- **Type:** [informational / commercial / transactional / navigational]
- **Evidence:** [describe what the GSC query patterns reveal about user intent]
  - Example: "85% of queries contain 'how to' or 'guide' = informational intent"
  - Example: "60% of queries contain 'best' or 'vs' = commercial comparison intent"

## Current State (Why This Is a Gap)
- **Query currently lands on:** [URL from GSC data]
- **Current position:** [average position from GSC]
- **Monthly impressions:** [28-day impressions from GSC]
- **Current CTR:** [CTR % from GSC]
- **Why it is a gap:** [explain why the current page does not serve this query well]
  - Example: "Query 'docker compose tutorial' lands on the homepage because no dedicated tutorial page exists."
  - Example: "Query lands on a product page but intent is informational -- users want a guide, not a sales page."

## Recommended New Page
- **URL:** /[suggested-slug-based-on-primary-query]
- **Page type:** [blog post / landing page / product page / resource page / comparison page]
- **Target word count:** [estimate based on what currently ranks in the top 10 for this query]
  - Blog post / tutorial: 1,500-2,500 words
  - Comparison page: 2,000-3,500 words
  - Landing page: 800-1,200 words
  - Resource / pillar page: 3,000-5,000 words

## Content Outline

### H1: [Title incorporating primary query -- use a formula from Section 1]

### Introduction (100-150 words)
- Hook: [address the user's immediate need based on the query]
- Scope: [what this page covers]
- Credibility: [why the reader should trust this content]

### H2: [Subtopic derived from secondary query]
- Target: 200-300 words
- Cover: [specific points to address]
- Include: [data, examples, or visuals needed]

### H2: [Subtopic derived from tertiary query]
- Target: 200-300 words
- Cover: [specific points to address]
- Include: [data, examples, or visuals needed]

### H2: [Subtopic derived from long-tail query variant]
- Target: 200-300 words
- Cover: [specific points to address]
- Include: [data, examples, or visuals needed]

### H2: [Additional section based on competitor analysis]
- Target: 200-300 words
- Cover: [what top-ranking pages include that we should too]

### FAQ Section
- **Q: [Question derived from GSC query data]**
  A: [Concise, direct answer -- 2-3 sentences]
- **Q: [Question derived from GSC query data]**
  A: [Concise, direct answer -- 2-3 sentences]
- **Q: [Question derived from GSC query data]**
  A: [Concise, direct answer -- 2-3 sentences]

## Structured Data
- **Schema type:** [Article / HowTo / FAQPage / Product -- based on page type]
- **Required fields:** [list the required properties for the chosen schema]

## Internal Linking Plan
- **Link FROM (existing pages that should link to this new page):**
  - [URL 1] -- anchor text: "[based on primary query]"
  - [URL 2] -- anchor text: "[based on secondary query]"
  - [URL 3] -- anchor text: "[based on long-tail variant]"
- **Link TO (existing pages this new page should link to):**
  - [URL 1] -- context: [why this link is relevant]
  - [URL 2] -- context: [why this link is relevant]

## Success Metrics
- **Target position:** top 10 within 8 weeks
- **Target impressions:** [based on current impression volume from GSC -- e.g., if the query gets 2,000 impressions/month on the wrong page, target 3,000+ on a dedicated page]
- **Target CTR:** [use the expected CTR curve for the target position]
- **Review date:** [8 weeks from publication date]
```

---

## 5. Cannibalization Resolution Decision Tree

Use this when GSC data shows the same query ranking on 2+ different pages. Cannibalization splits ranking signals and prevents either page from reaching its potential.

### How to Detect Cannibalization from GSC Data

```bash
# Find queries that rank on multiple pages
python3 -c "
import json
from collections import defaultdict

data = json.load(open('gsc-query-page-28d.json'))
query_pages = defaultdict(list)

for row in data.get('rows', []):
    query = row['keys'][0]
    page = row['keys'][1]
    query_pages[query].append({
        'page': page,
        'clicks': row.get('clicks', 0),
        'impressions': row.get('impressions', 0),
        'position': round(row.get('position', 0), 1),
        'ctr': round(row.get('ctr', 0) * 100, 2)
    })

# Filter to queries with 2+ pages and meaningful impressions
cannibalizing = {}
for query, pages in query_pages.items():
    if len(pages) >= 2:
        total_imp = sum(p['impressions'] for p in pages)
        if total_imp >= 100:
            cannibalizing[query] = sorted(pages, key=lambda x: x['impressions'], reverse=True)

# Sort by total impressions
sorted_queries = sorted(cannibalizing.items(), key=lambda x: sum(p['impressions'] for p in x[1]), reverse=True)

print(f'Cannibalization issues found: {len(sorted_queries)}')
print()
for query, pages in sorted_queries[:20]:
    total_imp = sum(p['impressions'] for p in pages)
    print(f'Query: \"{query}\" ({len(pages)} pages, {total_imp} total impressions)')
    for p in pages:
        print(f'  {p[\"page\"][:70]:70} pos:{p[\"position\"]:5} imp:{p[\"impressions\"]:6} clicks:{p[\"clicks\"]:4}')
    print()
"
```

### Decision Tree

```
Query ranks on 2+ pages (detected from GSC data)
│
├── Are both pages high-quality and distinct in intent?
│   │
│   ├── YES → STRATEGY: DIFFERENTIATE
│   │   │
│   │   │   How to differentiate:
│   │   │   1. Review the GSC queries for each page -- identify which query
│   │   │      variants are unique to each page
│   │   │   2. Rewrite titles and H1s to clearly target different query variants
│   │   │      - Page A title targets: "[Query] for [Audience A]"
│   │   │      - Page B title targets: "[Query] [Specific Variant]"
│   │   │   3. Add self-referencing canonical tags on both pages
│   │   │   4. Add internal links between the pages with descriptive anchor
│   │   │      text that clarifies the difference
│   │   │   5. Ensure body content focuses on distinct subtopics
│   │   │
│   │   └── Monitor: Check positions after 4 weeks. If still cannibalizing,
│   │       escalate to MERGE + REDIRECT.
│   │
│   └── NO → One page is clearly weaker (fewer clicks, worse position, thin content)
│       │
│       ├── Can the weaker page's unique content be merged into the stronger page?
│       │   │
│       │   ├── YES → STRATEGY: MERGE + REDIRECT
│       │   │   │
│       │   │   │   How to merge:
│       │   │   │   1. Identify unique content sections in the weaker page that
│       │   │   │      the stronger page lacks
│       │   │   │   2. Move that unique content into the stronger page in a
│       │   │   │      logical position (new H2 section, expanded FAQ, etc.)
│       │   │   │   3. Set up a 301 redirect from the weaker URL to the stronger URL
│       │   │   │   4. Update all internal links across the site to point directly
│       │   │   │      to the stronger URL (do not rely only on the redirect)
│       │   │   │   5. Update the XML sitemap: remove the weaker URL, keep the
│       │   │   │      stronger URL
│       │   │   │
│       │   │   └── Monitor: Check positions and CTR after 4-6 weeks. The
│       │   │       stronger page should see an improvement in both position
│       │   │       and click volume.
│       │   │
│       │   └── NO → Content does not significantly overlap
│       │       │
│       │       └── STRATEGY: CANONICAL + NOINDEX
│       │           │
│       │           │   How to apply:
│       │           │   1. Add a canonical tag on the weaker page pointing to
│       │           │      the stronger page:
│       │           │      <link rel="canonical" href="https://example.com/stronger-page" />
│       │           │   2. OR add a noindex meta tag to the weaker page:
│       │           │      <meta name="robots" content="noindex, follow" />
│       │           │   3. Remove or reduce internal links pointing to the weaker page
│       │           │   4. Keep the weaker page accessible for users who have
│       │           │      bookmarked it, but signal to Google which page to rank
│       │           │
│       │           └── Monitor: Check after 4 weeks. The stronger page should
│       │               absorb the weaker page's ranking signals.
│       │
│       └── Is the "weaker" page actually a category, tag, or archive page?
│           │
│           └── YES → STRATEGY: NOINDEX THE TAXONOMY PAGE
│               │
│               │   Category, tag, and archive pages frequently cannibalize
│               │   article and product pages unintentionally.
│               │
│               │   How to fix:
│               │   1. Add noindex to the category/tag/archive page:
│               │      <meta name="robots" content="noindex, follow" />
│               │   2. Keep "follow" so link equity still flows through the page
│               │   3. Do NOT remove the page or block it in robots.txt
│               │   4. Ensure the content page has strong internal links
│               │
│               └── Monitor: Check after 3-4 weeks. The content page should
│                   stabilize in a single, consistent position.
```

### Cannibalization Resolution Tracking

After applying a fix, track results with this format:

```markdown
| Query | Strategy | Page Kept | Page Removed/Changed | Before Pos | After Pos | Before Clicks | After Clicks |
|-------|----------|-----------|---------------------|-----------|----------|--------------|-------------|
| "[query]" | Merge + Redirect | /stronger-page | /weaker-page → 301 | 8.2 / 14.1 | [check 4wk] | 45 / 12 | [check 4wk] |
```

---

## 6. Internal Linking Opportunity Identification

A systematic method for discovering and prioritizing internal linking opportunities using GSC data.

### Method

1. **Query Clustering:** Group pages by related queries (pages sharing similar GSC queries belong in the same topic cluster).
2. **Authority Mapping:** Rank pages by total clicks from `gsc-pages-28d.json` as a proxy for page authority.
3. **Link Direction:** Always link FROM high-authority pages TO pages that need a ranking boost (striking distance pages, new content, declining pages).
4. **Anchor Text:** Use the exact GSC query the target page ranks for as the anchor text. This reinforces the topical signal.
5. **Context:** Place links within relevant paragraph context. In-content contextual links carry significantly more weight than sidebar, footer, or navigation links.

### Link Opportunity Finder Script

Save and run this script to identify internal linking opportunities from your GSC data:

```python
#!/usr/bin/env python3
"""
Internal Linking Opportunity Finder
Reads gsc-query-page-28d.json and outputs linking opportunities.

Usage:
    python3 find_link_opportunities.py

Expects gsc-query-page-28d.json in the current working directory.
"""

import json
import sys
from collections import defaultdict

def load_gsc_data(filepath='gsc-query-page-28d.json'):
    """Load GSC query+page data."""
    try:
        with open(filepath) as f:
            data = json.load(f)
        return data.get('rows', [])
    except FileNotFoundError:
        print(f"ERROR: {filepath} not found. Run Phase 2 data pull first.")
        sys.exit(1)

def build_page_authority(rows):
    """
    Build a page authority map based on total clicks.
    Pages with more clicks are considered higher authority.
    """
    authority = defaultdict(lambda: {'clicks': 0, 'impressions': 0})
    for row in rows:
        page = row['keys'][1]
        authority[page]['clicks'] += row.get('clicks', 0)
        authority[page]['impressions'] += row.get('impressions', 0)
    return dict(authority)

def build_page_queries(rows):
    """
    Map each page to its associated queries with metrics.
    """
    page_queries = defaultdict(list)
    for row in rows:
        query = row['keys'][0]
        page = row['keys'][1]
        page_queries[page].append({
            'query': query,
            'clicks': row.get('clicks', 0),
            'impressions': row.get('impressions', 0),
            'position': round(row.get('position', 0), 1),
            'ctr': round(row.get('ctr', 0) * 100, 2)
        })
    return dict(page_queries)

def build_query_clusters(rows, min_impressions=50):
    """
    Group pages by shared queries to find topically related pages.
    Two pages are related if they share GSC queries.
    """
    query_pages = defaultdict(list)
    for row in rows:
        query = row['keys'][0]
        page = row['keys'][1]
        impressions = row.get('impressions', 0)
        if impressions >= min_impressions:
            query_pages[query].append({
                'page': page,
                'impressions': impressions,
                'position': round(row.get('position', 0), 1)
            })
    return dict(query_pages)

def find_striking_distance_pages(page_queries):
    """
    Find pages with queries in position 11-20 (striking distance).
    These are the primary link targets.
    """
    striking = {}
    for page, queries in page_queries.items():
        sd_queries = [q for q in queries if 11 <= q['position'] <= 20 and q['impressions'] >= 50]
        if sd_queries:
            sd_queries.sort(key=lambda x: x['impressions'], reverse=True)
            striking[page] = sd_queries
    return striking

def find_link_opportunities(rows):
    """
    Main function: find internal linking opportunities.

    Logic:
    1. Identify pages that NEED links (striking distance, position 11-20)
    2. Find pages with HIGH authority (many clicks) that cover RELATED topics
    3. Match them: link FROM authority pages TO striking-distance pages
    4. Suggest anchor text based on the target page's top GSC query
    """
    authority = build_page_authority(rows)
    page_queries = build_page_queries(rows)
    query_clusters = build_query_clusters(rows)
    striking = find_striking_distance_pages(page_queries)

    # Sort authority pages by clicks (descending)
    authority_ranked = sorted(authority.items(), key=lambda x: x[1]['clicks'], reverse=True)

    # For each striking-distance page, find the best authority pages to link from
    opportunities = []

    for target_page, sd_queries in striking.items():
        target_top_query = sd_queries[0]['query']
        target_impressions = sd_queries[0]['impressions']
        target_position = sd_queries[0]['position']

        # Find authority pages that share related queries with the target
        related_authority_pages = []
        target_query_words = set(target_top_query.lower().split())

        for auth_page, auth_metrics in authority_ranked[:50]:
            if auth_page == target_page:
                continue

            # Check if the authority page covers related topics
            auth_queries = page_queries.get(auth_page, [])
            for aq in auth_queries:
                aq_words = set(aq['query'].lower().split())
                # Pages are related if they share 2+ query words
                overlap = target_query_words & aq_words
                if len(overlap) >= 2 or target_top_query.lower() in aq['query'].lower():
                    related_authority_pages.append({
                        'page': auth_page,
                        'authority_clicks': auth_metrics['clicks'],
                        'shared_query': aq['query'],
                        'overlap_words': list(overlap)
                    })
                    break

        # Also include top authority pages even without query overlap
        # (topical silos often benefit from hub-page linking)
        if not related_authority_pages:
            for auth_page, auth_metrics in authority_ranked[:10]:
                if auth_page != target_page and auth_metrics['clicks'] >= 50:
                    related_authority_pages.append({
                        'page': auth_page,
                        'authority_clicks': auth_metrics['clicks'],
                        'shared_query': '(top authority page)',
                        'overlap_words': []
                    })

        if related_authority_pages:
            opportunities.append({
                'target_page': target_page,
                'target_query': target_top_query,
                'target_position': target_position,
                'target_impressions': target_impressions,
                'link_from': related_authority_pages[:5],
                'suggested_anchor': target_top_query
            })

    # Sort opportunities by potential impact (impressions * position improvement potential)
    opportunities.sort(key=lambda x: x['target_impressions'], reverse=True)
    return opportunities

def print_opportunities(opportunities):
    """Print linking opportunities in a readable format."""
    if not opportunities:
        print("No internal linking opportunities found.")
        print("This may mean:")
        print("  - No pages are in striking distance (position 11-20)")
        print("  - Insufficient impression volume (< 50 impressions)")
        return

    print("=" * 80)
    print("INTERNAL LINKING OPPORTUNITIES")
    print("=" * 80)
    print(f"\nFound {len(opportunities)} pages that would benefit from internal links.\n")

    for i, opp in enumerate(opportunities[:25], 1):
        print(f"--- Opportunity #{i} ---")
        print(f"TARGET PAGE:  {opp['target_page']}")
        print(f"TARGET QUERY: \"{opp['target_query']}\"")
        print(f"POSITION:     {opp['target_position']} (striking distance)")
        print(f"IMPRESSIONS:  {opp['target_impressions']}/month")
        print(f"ANCHOR TEXT:  \"{opp['suggested_anchor']}\"")
        print(f"\nLink FROM these pages:")
        for lf in opp['link_from']:
            print(f"  -> {lf['page'][:70]}")
            print(f"     Authority: {lf['authority_clicks']} clicks | Related via: \"{lf['shared_query']}\"")
        print()

    # Summary
    print("=" * 80)
    print("SUMMARY")
    print("=" * 80)
    total_impressions = sum(o['target_impressions'] for o in opportunities)
    print(f"Total opportunities:     {len(opportunities)}")
    print(f"Total impressions at stake: {total_impressions:,}")
    print(f"\nPriority: Start with the top 5 opportunities (highest impressions).")
    print(f"Expected impact: Internal links typically improve position by 2-5 spots")
    print(f"within 3-4 weeks.\n")

    # Export as JSON for further processing
    export = []
    for opp in opportunities:
        export.append({
            'target_page': opp['target_page'],
            'target_query': opp['target_query'],
            'target_position': opp['target_position'],
            'target_impressions': opp['target_impressions'],
            'suggested_anchor': opp['suggested_anchor'],
            'link_from_pages': [lf['page'] for lf in opp['link_from']]
        })
    with open('internal-link-opportunities.json', 'w') as f:
        json.dump(export, f, indent=2)
    print(f"Full results exported to: internal-link-opportunities.json")

if __name__ == '__main__':
    rows = load_gsc_data()
    opportunities = find_link_opportunities(rows)
    print_opportunities(opportunities)
```

### Quick One-Liner Version

If you do not need the full script, use this one-liner to get a quick list:

```bash
python3 -c "
import json
from collections import defaultdict

data = json.load(open('gsc-query-page-28d.json'))
# Build authority map
auth = defaultdict(int)
for r in data.get('rows', []):
    auth[r['keys'][1]] += r.get('clicks', 0)
# Find striking distance
for r in data.get('rows', []):
    pos = r.get('position', 0)
    imp = r.get('impressions', 0)
    if 11 <= pos <= 20 and imp >= 100:
        page = r['keys'][1]
        query = r['keys'][0]
        # Find top authority pages
        top_auth = sorted([(p, c) for p, c in auth.items() if p != page], key=lambda x: x[1], reverse=True)[:3]
        print(f'TARGET: {page[:60]}')
        print(f'  Query: \"{query}\" | Pos: {pos:.1f} | Imp: {imp}')
        for ap, ac in top_auth:
            print(f'  LINK FROM: {ap[:60]} ({ac} clicks)')
        print(f'  ANCHOR: \"{query}\"')
        print()
"
```

---

## 7. Before/After Optimization Report Template

Use this template to document the results of SEO optimizations. Fill in the data from before (baseline) and after (re-pulled GSC data) comparisons.

### Full Report Template

```markdown
# SEO Optimization Report — [Site Name]
## Period: [Optimization Start Date] to [Report Date]
## Data Source: Google Search Console (28-day comparison)

---

### Executive Summary

- **Pages optimized:** [count]
- **Total click improvement:** [+/- number] ([+/- percentage]%)
- **Total impression improvement:** [+/- number] ([+/- percentage]%)
- **Average position improvement:** [+/- number] positions
- **Average CTR improvement:** [+/- number] percentage points

### Optimizations Performed

| Type | Count | Pages Affected |
|------|-------|----------------|
| Title tag rewrites | [N] | [list page slugs] |
| Meta description rewrites | [N] | [list page slugs] |
| Content enhancements | [N] | [list page slugs] |
| Internal linking additions | [N] | [list target pages] |
| New pages created | [N] | [list new URLs] |
| Cannibalization fixes | [N] | [list affected queries] |
| 301 redirects | [N] | [list redirect pairs] |

---

### Detailed Results

#### Page: [Page URL]

**Optimization performed:** [Describe what was changed -- e.g., "Title tag rewrite to match primary GSC query"]

**Data justification:** [Which GSC metric triggered this optimization -- e.g., "CTR of 2.1% at position 4 (expected ~8%), with 3,200 monthly impressions"]

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Position (primary query) | [X.X] | [Y.Y] | [+/-Z.Z] |
| CTR | [X.XX]% | [Y.YY]% | [+/-Z.ZZ] pp |
| Clicks (28d) | [XXX] | [YYY] | [+/-ZZ]% |
| Impressions (28d) | [XXXX] | [YYYY] | [+/-ZZ]% |

**Before title:** `[Old Title Here]`
**After title:** `[New Title Here]`

**Before description:** `[Old meta description]`
**After description:** `[New meta description]`

**Notes:** [Any observations -- e.g., "Position improved from 14.2 to 8.1, crossing from page 2 to page 1. Expect further CTR gains as the page stabilizes."]

---

#### Page: [Page URL 2]

[Repeat the same format for each optimized page]

---

### Striking Distance Progress

Pages that moved from position 11-20 to page 1:

| Page | Primary Query | Before Pos | After Pos | Before Clicks | After Clicks | Status |
|------|--------------|-----------|----------|--------------|-------------|--------|
| [/url] | "[query]" | [X.X] | [Y.Y] | [XX] | [YY] | [Achieved / In Progress] |

---

### Cannibalization Resolution Results

| Query | Strategy Applied | Surviving Page | Before (split) | After (consolidated) |
|-------|-----------------|----------------|----------------|---------------------|
| "[query]" | [Merge + 301 / Differentiate / Noindex] | [/winning-url] | Pos: X.X / X.X | Pos: Y.Y |

---

### Content Gap Pages (New Content)

| New Page | Target Query | Published | Current Pos | Impressions | Status |
|----------|-------------|-----------|------------|-------------|--------|
| [/new-url] | "[query]" | [date] | [X.X] | [XXXX] | [Indexed / Ranking / Not Yet] |

---

### Next Steps

Based on the results, the following actions are recommended for the next optimization cycle:

1. **[Action item]** — [Justification based on data]
2. **[Action item]** — [Justification based on data]
3. **[Action item]** — [Justification based on data]

### Re-Check Schedule

| Optimization Type | Check After | Re-Check Date |
|-------------------|-------------|--------------|
| Title rewrites | 2-3 weeks | [date] |
| Meta descriptions | 2-3 weeks | [date] |
| Content enhancements | 4-6 weeks | [date] |
| Internal linking | 3-4 weeks | [date] |
| New pages | 6-8 weeks | [date] |
| Cannibalization fixes | 4-6 weeks | [date] |
```

### Generating the Report Automatically

Use this script to generate a before/after comparison from baseline and fresh GSC data:

```bash
# Compare baseline to current data
python3 -c "
import json

# Load baseline
baseline = json.load(open('seo-baseline-YYYY-MM-DD.json'))  # Replace with actual filename
# Load current data
current = json.load(open('gsc-pages-28d.json'))

# Build current page metrics
current_pages = {}
for row in current.get('rows', []):
    page = row['keys'][0]
    current_pages[page] = {
        'clicks': row.get('clicks', 0),
        'impressions': row.get('impressions', 0),
        'ctr': round(row.get('ctr', 0) * 100, 2),
        'position': round(row.get('position', 0), 1)
    }

# Compare
print(f\"{'Page':60} {'Metric':12} {'Before':>10} {'After':>10} {'Change':>10}\")
print('-' * 102)

for page, before in baseline.get('pages', {}).items():
    after = current_pages.get(page)
    if not after:
        continue

    for metric in ['clicks', 'impressions', 'ctr', 'position']:
        b = before.get(metric, 0)
        a = after.get(metric, 0)
        if metric == 'position':
            change = b - a  # Lower position = improvement
            change_str = f'+{change:.1f}' if change > 0 else f'{change:.1f}'
        elif metric == 'ctr':
            change = a - b
            change_str = f'+{change:.2f}pp' if change > 0 else f'{change:.2f}pp'
        else:
            change = ((a - b) / b * 100) if b > 0 else 0
            change_str = f'+{change:.0f}%' if change > 0 else f'{change:.0f}%'

        if metric == 'clicks':  # Only print page name once
            print(f\"{page[:60]:60} {metric:12} {b:>10} {a:>10} {change_str:>10}\")
        else:
            print(f\"{'':60} {metric:12} {b:>10} {a:>10} {change_str:>10}\")
    print()
"
```

---

## Quick Reference: Which Template to Use

| Situation (from GSC data) | Template Section |
|---------------------------|-----------------|
| Page on page 1 with low CTR | Section 1 (Title Tags) + Section 2 (Meta Descriptions) |
| Page at position 11-20 with high impressions | Section 3 (Content Enhancement Checklist) |
| High-impression query on wrong page / no dedicated page | Section 4 (Content Gap Brief) |
| Same query ranking on 2+ pages | Section 5 (Cannibalization Decision Tree) |
| Need to boost a page's authority with internal links | Section 6 (Internal Linking Opportunities) |
| Reporting results to stakeholders / tracking progress | Section 7 (Before/After Report) |
