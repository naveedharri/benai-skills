# Data Interpretation Guide

How to correctly read Google Search Console data, avoid common pitfalls, and determine when you have enough data to act.

---

## What Each GSC Metric Actually Means

### Clicks

- A click is counted when a user clicks a search result link that navigates to a page **outside** Google Search.
- Does **NOT** include:
  - Clicks on Google Ads (paid results)
  - Clicks on featured snippets that don't leave Google (e.g., expandable answers)
  - Clicks on "People also ask" expansions
  - Clicks on image results that open the image panel (without navigating to the site)
- One user clicking the same result twice in the same session counts as **one click**.
- Clicks are associated with the query+URL pair, not the user session. If a user clicks result A, goes back, then clicks result B, both A and B receive one click each.
- A click on a sitelink counts as a click for the **main result URL**, not the sitelink target.

### Impressions

- An impression is counted when a link URL appears in a search result for a user, **even if the result is not scrolled into view**.
- For standard "10 blue links" results: all 10 results on the page get an impression, even if the user only sees positions 1-3 before leaving.
- For continuous scrolling (mobile): an impression is counted when the result is **fetched by the browser**, which may be before the user actually scrolls to it.
- For carousels and expandable sections: impressions depend on whether the item is visible without user interaction. Items hidden behind a "Show more" or carousel arrow do NOT get an impression until revealed.
- For tabbed results (e.g., "All", "Images", "Videos"): only results on the active tab receive impressions.

**Key insight:** Impressions do NOT equal views. A page at position 8 gets an impression even if no user ever scrolls down to see it. This is critical for understanding why high-impression, low-click pages are not necessarily broken -- they may simply never be seen.

### CTR (Click-Through Rate)

- **Formula:** Clicks / Impressions
- Reported as a decimal in the API (0.05 = 5%) but conventionally displayed as a percentage.
- CTR is **heavily influenced by position**. Comparing CTR across different positions without normalizing is meaningless.
- Expected CTR benchmarks by position (non-branded, desktop, approximate):

| Position | Expected CTR Range |
|----------|--------------------|
| 1        | 25-35%             |
| 2        | 12-18%             |
| 3        | 8-12%              |
| 4        | 5-8%               |
| 5        | 3-6%               |
| 6-7      | 2-4%               |
| 8-10     | 1-3%               |
| 11-20    | 0.5-1.5%           |

- A "low" CTR of 20% at position 1 is actually decent. A "high" CTR of 5% at position 10 is excellent.
- CTR is only useful for optimization decisions when compared against the expected CTR for that position bracket.

### Average Position

- The average position of the **topmost** (best) result for your site for a given query.
- If your site has results at positions 3 and 7 for a query in a single search, the position recorded is **3** (the best one).
- Position is **1-indexed**: position 1 = the first organic result.
- Includes only organic results. Ads are not counted in position numbering.
- Featured snippets occupy position 1 when present.

**THE AVERAGE POSITION TRAP:** This is an average across ALL impressions for that query+page pair. It does NOT mean your page consistently ranks at that position.

Example: A page showing "average position 5.0" might rank at position 2 half the time and position 8 the other half. The average is 5, but the page never actually appeared at position 5.

---

## The "Average Position" Trap -- Deep Dive

This is the single most misunderstood metric in GSC. Here is what you need to know:

### How the Average Is Calculated

1. Average position is **weighted by impressions**, not by clicks.
2. Every time a query triggers an impression for your URL, the position at that moment is recorded.
3. The "average position" is the arithmetic mean of all those recorded positions over the selected date range.

### What the Numbers Tell You

- A query with position **1.0** appeared at position 1 for ALL impressions. This is stable.
- A query with position **1.2** appeared at position 1 most of the time, occasionally at position 2. Still stable.
- A query with position **4.7** could be showing at various positions: sometimes 3, sometimes 5, sometimes 8. Unstable.
- A query with position **12.5** is hovering around the bottom of page 1 and top of page 2. This is a striking distance opportunity.

### What Causes Position Instability

- **Keyword cannibalization:** Multiple pages competing for the same query, causing Google to alternate.
- **Personalization:** Different users see different results based on location, history, device.
- **Algorithm fluctuations:** Google testing different rankings.
- **Freshness signals:** News or time-sensitive content pushing rankings around.

### Filtered vs Unfiltered Position Data

- **When filtering by page:** The position is for that specific page+query combination. This is more reliable and actionable.
- **When NOT filtering by page:** GSC picks the best-ranking page for each impression. This can **hide cannibalization** because it always shows the best position, masking the fact that different pages are trading places.

### Practical Rule for Reading Position Decimals

| Position Value | Interpretation |
|----------------|----------------|
| X.0 - X.1     | Stable ranking at position X |
| X.2 - X.4     | Mostly stable, minor fluctuation |
| X.5 - X.8     | Significant instability -- investigate cannibalization |
| X.9+           | Likely fluctuating between X and X+1 |

Positions with decimals far from whole numbers (e.g., 3.8, 7.2) suggest **ranking instability**. Positions close to whole numbers (e.g., 3.1, 7.0) suggest **stable ranking**.

---

## Minimum Data Thresholds for Statistical Significance

Do not make optimization decisions without sufficient data. Use these thresholds as minimums before acting:

| Decision Type | Min Impressions | Min Clicks | Min Time Period | Confidence Level |
|---------------|----------------|------------|-----------------|------------------|
| Title tag rewrite (CTR issue) | 500 | 10 | 28 days | High |
| Content gap (new page needed) | 200 | N/A | 28 days | Medium |
| Keyword cannibalization | 100 per page | 5 per page | 28 days | Medium |
| Declining page alert | 50 | 10 | 56 days (comparison) | Medium |
| Striking distance opportunity | 100 | N/A | 28 days | High |
| Device/geo gap | 50 per segment | N/A | 28 days | Low-Medium |
| Quick win identification | 300 | 5 | 28 days | High |
| Top performer risk detection | 500 | 50 | 90 days (comparison) | High |

### Rules of Thumb

- **Below 100 impressions:** Unreliable for any analysis. Individual searches can skew all metrics.
- **100-499 impressions:** Reliable for position trends. Unreliable for CTR analysis.
- **500-999 impressions:** Reliable for position and moderately reliable for CTR.
- **1,000+ impressions:** Reliable for both position and CTR analysis.
- **Always use at least 28 days** of data to smooth out daily variance (weekdays vs weekends, random fluctuations).
- **Use 90 days for trend analysis** to account for monthly cycles and seasonal shifts.
- **Use 56+ days for comparison analysis** (28 days current vs 28 days previous) to detect meaningful changes.

### Why These Thresholds Matter

Small sample sizes create the illusion of patterns. A page with 20 impressions and 2 clicks shows a 10% CTR. Add one more click and it jumps to 15%. Remove one click and it drops to 5%. None of these changes are meaningful -- it is random noise.

At 500 impressions and 25 clicks (5% CTR), a shift to 30 clicks (6% CTR) is more likely to reflect a real change, though you should still verify with additional time periods.

---

## Branded vs Non-Branded Query Segmentation

### Why Segmentation Is Essential

Branded queries (those containing your brand name, domain, or product names) behave fundamentally differently from non-branded queries:

| Metric | Branded Queries | Non-Branded Queries |
|--------|----------------|---------------------|
| Typical CTR at position 1 | 30-60% | 25-35% |
| Typical CTR at position 2 | 15-30% | 12-18% |
| User intent | Navigational (already know you) | Informational/commercial (discovering you) |
| Optimization lever | Brand awareness, reputation | Content quality, keyword targeting |

**The core problem:** Mixing branded and non-branded queries in CTR analysis will skew results. Branded queries inflate average CTR, making non-branded performance look better than it actually is. A site with 40% branded traffic might show a healthy overall CTR while non-branded CTR is critically low.

### How to Segment in GSC API

Use `dimensionFilterGroups` with `notContains` filters to exclude brand terms:

```python
# Brand terms to filter out
brand_terms = ["yourcompany", "your-company", "yourproduct", "yourdomain"]

# Build filter groups for the GSC API request
def build_non_branded_filter(brand_terms):
    """
    Build a GSC API filter that excludes branded queries.

    Note: GSC API supports only AND logic within a filter group,
    so all brand term exclusions are combined in one group.
    Each filter uses 'notContains' to exclude queries mentioning the brand.
    """
    filters = []
    for term in brand_terms:
        filters.append({
            "dimension": "query",
            "operator": "notContains",
            "expression": term.lower()
        })

    return {
        "dimensionFilterGroups": [{
            "groupType": "and",
            "filters": filters
        }]
    }


def build_branded_filter(brand_terms):
    """
    Build a GSC API filter for branded queries only.

    Since GSC API filter groups use AND logic, we cannot OR multiple
    'contains' filters in one group. Instead, make separate requests
    for each brand term and deduplicate results.
    """
    filter_groups = []
    for term in brand_terms:
        filter_groups.append({
            "dimensionFilterGroups": [{
                "groupType": "and",
                "filters": [{
                    "dimension": "query",
                    "operator": "contains",
                    "expression": term.lower()
                }]
            }]
        })
    return filter_groups
```

### Practical Approach to Identifying Brand Terms

Compile a list that includes:

1. **Company name** and common misspellings (e.g., "shopify", "shopfy")
2. **Product names** (e.g., "shopify plus", "shopify pos")
3. **Domain name** without TLD (e.g., "shopify" from shopify.com)
4. **Abbreviations** commonly used (e.g., "amzn" for Amazon)
5. **Founder/CEO name** if commonly searched in association with the brand

### Separating Branded and Non-Branded Queries in Analysis

```python
def segment_queries(queries_data, brand_terms):
    """
    Separate query data into branded and non-branded segments.

    Args:
        queries_data: List of dicts with 'query', 'clicks',
                      'impressions', 'ctr', 'position' keys.
        brand_terms: List of brand-related strings to match against.

    Returns:
        Tuple of (branded_queries, non_branded_queries).
    """
    branded = []
    non_branded = []

    brand_terms_lower = [t.lower() for t in brand_terms]

    for row in queries_data:
        query_lower = row["query"].lower()
        is_branded = any(term in query_lower for term in brand_terms_lower)

        if is_branded:
            branded.append(row)
        else:
            non_branded.append(row)

    return branded, non_branded


def summarize_segment(segment, label):
    """Print summary statistics for a query segment."""
    if not segment:
        print(f"{label}: No data")
        return

    total_clicks = sum(r["clicks"] for r in segment)
    total_impressions = sum(r["impressions"] for r in segment)
    avg_ctr = total_clicks / total_impressions if total_impressions > 0 else 0
    avg_position = (
        sum(r["position"] * r["impressions"] for r in segment)
        / total_impressions
        if total_impressions > 0 else 0
    )

    print(f"--- {label} ---")
    print(f"  Queries:      {len(segment)}")
    print(f"  Clicks:       {total_clicks}")
    print(f"  Impressions:  {total_impressions}")
    print(f"  Avg CTR:      {avg_ctr:.2%}")
    print(f"  Avg Position: {avg_position:.1f}")
```

---

## Seasonality Awareness

### Why Seasonality Matters

Many queries have predictable seasonal patterns. Failing to account for this leads to false alarms (flagging a natural seasonal decline as a problem) or missed opportunities (not preparing content before a seasonal surge).

### Common Seasonal Patterns

| Pattern | Examples | Peak Period |
|---------|----------|-------------|
| Tax/finance | "tax software", "file taxes online" | January - April |
| E-commerce | "black friday deals", "gift ideas" | October - December |
| Education | "back to school", "college applications" | July - September |
| Health | "new year resolutions", "gym membership" | January |
| Travel | "summer vacation", "beach resorts" | April - June |
| B2B | "annual planning", "budget software" | September - November |

### How to Account for Seasonality

1. **Year-over-year comparison is the gold standard.** GSC stores 16 months of data, so you can compare the same month this year vs last year.
2. **Month-over-month comparisons are unreliable** for seasonal businesses. A 30% decline from December to January might be perfectly normal for an e-commerce site.
3. **Use the GSC API date range** to pull the same calendar period from the previous year:

```python
# Example: Compare January 2025 to January 2024
current_period = {"startDate": "2025-01-01", "endDate": "2025-01-31"}
previous_period = {"startDate": "2024-01-01", "endDate": "2024-01-31"}
```

4. **Before flagging a page as "declining,"** always check if the decline matches an expected seasonal pattern. Pull the same period from the prior year. If last year showed a similar decline, it is seasonal, not a ranking problem.
5. **For trend analysis,** use rolling 90-day windows compared against the same 90-day window from the prior year. This smooths out both weekly and monthly variance.

### GSC Data Retention

- GSC stores **16 months** of data.
- The API supports date ranges going back the full 16 months.
- If you need longer historical data, export and store it externally on a regular schedule (monthly is sufficient for most use cases).

---

## Data Freshness

### The Delay You Must Account For

- GSC data has a **2-3 day delay**. Data from today will not appear for 48-72 hours.
- Data from the last 3 days may be **incomplete** and can change retroactively as Google finalizes processing.
- The most recent "complete" data point is typically **3 days ago**.

### Practical Guidelines

| Use Case | Recommended endDate | Reason |
|----------|-------------------|--------|
| Operational analysis | today - 3 days | Ensures complete, stable data |
| Automated reporting | today - 4 days | Extra buffer for processing delays |
| Trend monitoring | today - 3 days | Balance between freshness and accuracy |
| Urgent investigation | today - 1 day | Accept that data may be incomplete |

### The dataState Flag

The GSC API response includes a `dataState` field:

- **`final`**: Data is complete and will not change.
- **`all`**: Includes both final and preliminary data. Preliminary data may be revised.

**Best practice for automated systems:** Set `dataState` to `final` when accuracy matters more than recency. Set `endDate` to `today - 3` as a secondary safeguard.

```python
# Reliable data pull
from datetime import date, timedelta

end_date = (date.today() - timedelta(days=3)).isoformat()
start_date = (date.today() - timedelta(days=31)).isoformat()  # 28 days of data

request_body = {
    "startDate": start_date,
    "endDate": end_date,
    "dimensions": ["query", "page"],
    "dataState": "final",
    "rowLimit": 25000
}
```

---

## How to Read GSC Data for Each Analysis Type

Quick-reference for interpreting data in the context of each analysis the SEO optimization skill performs.

### 1. Striking Distance Opportunities

**What to look at:** Impressions as the primary signal.

- High impressions at position 11-20 means there is real search demand, and the page is close to page 1.
- Focus on queries where position is between 8 and 20 with 100+ impressions.
- Ignore queries with fewer than 100 impressions -- they may represent long-tail variations with no real volume.
- Check if the ranking page is the most relevant page on your site for that query. If not, redirect optimization to the correct page.

**Decision framework:**
- Position 8-10, 500+ impressions: High priority. Small improvements can push to top 5.
- Position 11-15, 300+ impressions: Medium-high priority. Content improvement plus internal linking.
- Position 16-20, 200+ impressions: Medium priority. May need significant content overhaul.

### 2. Low CTR Pages

**What to look at:** CTR compared against expected CTR for the position bracket.

- A 5% CTR at position 1 is terrible and demands immediate attention (title/description rewrite).
- A 5% CTR at position 6 is normal and does not need a title change.
- Always segment branded vs non-branded before analyzing CTR. Branded queries have naturally higher CTR.
- Look at the actual SERP for the query. Rich results, featured snippets, and knowledge panels can suppress CTR for all organic results. A low CTR caused by a featured snippet is not a title tag problem.

**Decision framework:**
- CTR < 50% of expected for position, 500+ impressions: Rewrite title and meta description.
- CTR 50-75% of expected, 500+ impressions: Test a title variation.
- CTR > 75% of expected: Likely normal. Focus optimization effort elsewhere.

### 3. Declining Pages

**What to look at:** Both clicks AND position, compared against a previous period.

The combination tells you the cause:

| Clicks | Position | Diagnosis |
|--------|----------|-----------|
| Declining | Stable | SERP feature change (featured snippet appeared, more ads, etc.) or seasonal decline |
| Declining | Dropping | Ranking loss -- content or technical issue |
| Stable | Dropping | More impressions at lower positions are compensating. Not urgent but monitor. |
| Declining | Improving | Likely seasonal or the query itself is declining in popularity |

- Always compare against the same period from the previous year to rule out seasonality.
- Use at least 56 days of data (28 current + 28 previous) for meaningful comparison.
- A page declining from 1,000 to 800 clicks (-20%) needs faster attention than a page declining from 50 to 40 clicks (-20%). Absolute numbers matter.

### 4. Content Gaps

**What to look at:** High impressions for queries landing on a page that is not purpose-built for those queries.

- The clearest signal: queries with moderate-to-high impressions where the landing page is your **homepage** or a broad category page. This means Google has no better option on your site.
- Look for query clusters (groups of related queries) pointing to the same generic page. Each cluster likely deserves its own dedicated page.
- Impressions matter more than position here. Even position 30+ with 200+ impressions indicates real demand.

**Decision framework:**
- 5+ related queries with 200+ combined impressions landing on wrong page: Create a dedicated page.
- Queries with 500+ impressions at position 15+: There is demand, and a purpose-built page could capture it.

### 5. Keyword Cannibalization

**What to look at:** Queries where position has high variance AND multiple pages appear.

- The clearest signal: a query where the average position has a high decimal component (e.g., 6.5) when filtered at the site level, but when you filter by page, you see two or more pages with different positions.
- Check by querying with the `page` dimension. If the same query appears with multiple pages, those pages are cannibalizing each other.
- Cannibalization is most damaging when the pages are splitting between page 1 and page 2 of results. Two pages at positions 4 and 12 are worse than one page at position 3.
- Compare clicks across the cannibalizing pages. The page with more clicks is usually the one Google (and users) prefer.

**Decision framework:**
- Two pages splitting a query with 500+ impressions: Consolidate content or differentiate targeting.
- Position variance > 3 for a single query across pages: Strong cannibalization signal.
- One page consistently at positions 1-5 and another at 15+: The lower page is not harmful and may not need action.

### 6. Quick Wins

**What to look at:** Combine CTR data (for title fixes) with position data (for almost-page-1 opportunities).

- Quick wins must have **clear, specific, actionable fixes**. "Improve content" is not a quick win. "Rewrite title tag to include [keyword]" is.
- Two types of quick wins:
  - **CTR quick wins:** Position 1-5, CTR below expected. Fix: rewrite title and meta description.
  - **Position quick wins:** Position 6-15, strong impressions. Fix: add missing subtopics, improve internal linking, optimize on-page elements.
- Prioritize by potential traffic gain: (Expected CTR - Current CTR) * Impressions = estimated additional clicks.

### 7. Top Performers at Risk

**What to look at:** Pages with HIGH absolute metrics but negative trends.

- These are your most valuable pages. Small percentage declines translate to large absolute traffic losses.
- A page dropping from 10,000 to 9,000 clicks (-10%) is losing 1,000 clicks. A page dropping from 100 to 90 (-10%) is losing 10 clicks. Prioritize the first.
- Look for **early warning signs**: position creeping up by 0.5-1.0 over 90 days, CTR declining by 1-2 percentage points, impression count dropping.
- Compare against competitors. Use the queries driving traffic to these pages and check if new competitors are appearing in the SERP.

**Decision framework:**
- Top 20 pages by clicks with > 5% decline over 90 days: Immediate investigation.
- Top 50 pages by clicks with position increase > 1.0 over 90 days: Content refresh needed.
- Any page with 1,000+ monthly clicks and declining trend: Monitor weekly.

### 8. Device and Geographic Gaps

**What to look at:** Large position or CTR differences across device types or countries.

**Device gaps:**
- Position difference > 3 between mobile and desktop for the same query usually indicates **mobile UX issues** (slow load time, poor mobile layout, intrusive interstitials).
- CTR difference > 30% between mobile and desktop at similar positions may indicate the title/description renders poorly on mobile (truncation).
- Mobile-first indexing means Google primarily uses the mobile version. Desktop-only optimizations may not help.

**Geographic gaps:**
- Position differences across countries may indicate **language or content relevance issues**.
- A page ranking well in the US but poorly in the UK for the same English query may need localized content.
- Check if country-specific competitors are outranking you in specific markets.

**Decision framework:**
- Mobile position > desktop position + 5: Investigate mobile-specific issues (Core Web Vitals, mobile rendering).
- Country A position 5, Country B position 25 for the same query: Consider localized content or hreflang implementation.

---

## Common Misunderstandings

These are the most frequent mistakes made when interpreting GSC data. Avoid all of them.

### 1. Assuming "Impressions" Means "Views"

An impression is recorded when the result appears on a search results page, even if the user never scrolls down to see it. A result at position 8 receives an impression whether or not anyone scrolls past position 3. Impressions measure **opportunity**, not visibility.

### 2. Comparing CTR Without Normalizing for Position

A 3% CTR at position 2 is bad. A 3% CTR at position 8 is excellent. Raw CTR numbers are meaningless without the context of position. Always compare against expected CTR for the position bracket.

### 3. Using "Average Position" as if It Were a Fixed Position

Average position 5.0 does not mean the page is at position 5. It means the average of all recorded positions is 5. The page might fluctuate between position 2 and position 8. Always check the decimal component for stability clues.

### 4. Not Filtering Out Branded Queries When Analyzing CTR

Branded queries have CTR rates 2-3x higher than non-branded queries at the same positions. Including them inflates your average CTR and masks non-branded performance problems.

### 5. Making Decisions Based on Fewer Than 100 Impressions

With small numbers, random variation dominates. A page with 20 impressions and 2 clicks has a 10% CTR, but the margin of error is enormous. One additional click changes the CTR to 15%. Wait for at least 100 impressions (500+ for CTR decisions) before acting.

### 6. Ignoring the 2-3 Day Data Delay

Yesterday's data in GSC is incomplete. Data from 2 days ago may still be revised. Always set your analysis end date to at least 3 days ago. Automated systems that pull "yesterday's data" will produce unreliable results.

### 7. Comparing Different-Length Time Periods

Comparing 7 days of data to 30 days of data produces misleading results. Totals (clicks, impressions) will be higher for longer periods. Averages (CTR, position) may differ due to weekly patterns. Always compare equal-length periods.

### 8. Assuming All Clicks Are Equal

A click on a navigational query ("yourcompany login") has different value than a click on a commercial query ("best project management software"). Segment your analysis by intent type when prioritizing optimization work.

### 9. Not Accounting for Seasonality When Comparing Periods

A 20% drop in clicks from December to January is normal for many e-commerce sites. Compare the same period year-over-year before concluding that a decline represents a problem.

### 10. Expecting "Position 0" to Exist

GSC positions start at 1. There is no position 0. Featured snippets occupy position 1. If your code expects or handles position 0, it contains a bug.

---

## Quick Reference: Data Quality Checklist

Before running any analysis, verify the following:

- [ ] Date range is at least 28 days
- [ ] End date is at least 3 days ago
- [ ] Branded queries are filtered out (for CTR analysis)
- [ ] Minimum impression thresholds are met for the analysis type
- [ ] Comparison periods are equal length
- [ ] Seasonality has been checked (same period last year if available)
- [ ] Data is segmented by device if mobile/desktop behavior differs significantly
- [ ] Position data is interpreted as an average, not a fixed rank
