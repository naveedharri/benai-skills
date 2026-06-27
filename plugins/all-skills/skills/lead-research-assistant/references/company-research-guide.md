# Company Research Guide

How to find and evaluate companies that match the user's ICP using web search.

---

## Search Query Patterns

Build queries systematically. Combine industry + signal + geography for targeted results.

### By Industry

```
"[industry] companies" "[city/region]"
"top [industry] startups" [year]
"[industry] SaaS companies" "series A" OR "series B"
"fastest growing [industry] companies" [year]
```

### By Technology Stack

```
"we use [technology]" site:stackshare.io
"[technology] customer" OR "[technology] case study"
"powered by [technology]" "[industry]"
"migrating from [old tech] to [new tech]"
```

### By Funding / Growth

```
"[industry]" "raised" "$" "[city]" site:crunchbase.com
"[industry]" "series A" OR "series B" [year]
"[industry]" "funding round" [year] "[geography]"
site:techcrunch.com "[industry]" "raises" [year]
```

### By Hiring Signals

```
"[target role title]" "[industry]" site:linkedin.com/jobs
"[company type]" "hiring" "[role]" "[city]"
"head of [department]" "we're hiring" "[industry]"
site:greenhouse.io "[industry]" "[role]"
site:lever.co "[industry]" "[role]"
```

### By Competitor Adjacency

```
"[competitor name] alternative"
"switched from [competitor]" "[industry]"
"[competitor] vs" "[industry]"
"companies like [known ICP-fit company]"
```

---

## Multi-Pass Research Strategy

Don't rely on a single search. Use multiple passes to build a comprehensive list.

### Pass 1: Broad Discovery (5–10 queries)

Goal: Cast a wide net. Find 30–50 company names.

- Use industry + geography queries
- Check "Top X" and "Best of" lists
- Search Crunchbase, G2, Capterra for category leaders
- Note company names even if you're unsure about fit

### Pass 2: Validation (1 query per company)

Goal: Confirm ICP fit for each company from Pass 1.

For each company found:
```
"[company name]" employees OR team size OR "about us"
"[company name]" revenue OR funding OR "series"
"[company name]" "[target technology]" OR "[industry keyword]"
```

### Pass 3: Enrichment (1–2 queries per qualified company)

Goal: Fill in scoring details for companies that passed validation.

```
"[company name]" news [year]
"[company name]" hiring OR careers
"[company name]" "[decision-maker role]"
site:linkedin.com/company/[company-slug]
```

---

## Data Collection Fields

Collect these fields for every company. Not all will be available.

| Field | Source | Required |
|-------|--------|----------|
| Company Name | Search results | Yes |
| Website | Search results | Yes |
| Industry | Company website / search results | Yes |
| Employee Count | LinkedIn company page / search snippets | Yes |
| Revenue (estimated) | Crunchbase / news / estimation | No |
| Headquarters | Company website | Yes |
| Founded Year | Search snippets | No |
| Funding Stage | Crunchbase / news | No |
| Total Funding | Crunchbase / news | No |
| Tech Stack | StackShare / job postings / website | No |
| Recent News | Google News | No |
| Hiring Activity | Job boards / LinkedIn | No |
| Decision Maker(s) | LinkedIn search (Path B handoff) | No |
| Company LinkedIn | Google search | No |
| ICP Fit Score | Calculated from rubric | Yes |
| Timing Score | Calculated from signals | Yes |
| Accessibility Score | Calculated from contact availability | Yes |
| Total Score | Sum of 3 dimensions | Yes |
| Tier | Derived from total score | Yes |
| Notes | Research observations | No |

---

## Company Size Estimation

When exact numbers aren't available, estimate from these signals:

| Signal | Estimate |
|--------|----------|
| LinkedIn shows "11-50 employees" | Small (use midpoint: ~30) |
| LinkedIn shows "51-200 employees" | Medium (use midpoint: ~125) |
| LinkedIn shows "201-500 employees" | Mid-market (use midpoint: ~350) |
| LinkedIn shows "501-1000 employees" | Upper mid-market (use midpoint: ~750) |
| Job board has 5-10 open roles | Likely 50-200 employees |
| Job board has 20+ open roles | Likely 200+ employees |
| "About us" mentions "our team of X" | Direct signal |
| Multiple office locations listed | Likely 100+ employees |

---

## Validation Checklist

Before adding a company to the final list, verify:

- [ ] Company is real and actively operating (website loads, recent activity)
- [ ] Industry matches ICP (not just keyword overlap)
- [ ] Company size is within ICP range
- [ ] Geography matches ICP (or "remote" if ICP allows)
- [ ] No disqualifiers triggered
- [ ] At least one timing signal identified
- [ ] Company LinkedIn page exists (for Path B handoff)

---

## Efficiency Tips

- **Batch searches** — open 3–5 search queries at once, extract all company names, then validate in bulk
- **Use list pages** — "Top 50 [industry] companies" pages are goldmines for Pass 1
- **Check competitors' case studies** — their customers might be your prospects
- **G2 and Capterra categories** — great for finding companies using specific software
- **Don't over-research Cold tier** — once a company scores Cold, stop spending time on it
- **Save partial results early** — export after every 10 companies, not just at the end
- **Track search queries** — log which queries worked for future sessions
