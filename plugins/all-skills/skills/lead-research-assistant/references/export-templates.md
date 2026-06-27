# Export Templates

Schemas, templates, and rules for exporting lead research data.

---

## CSV Schemas

### Company CSV (`companies-[date].csv`)

For Path A (Company Research) and Path C (Hybrid).

| Column | Description | Example |
|--------|-------------|---------|
| company_name | Company legal/brand name | Acme Corp |
| website | Company website URL | https://acme.com |
| industry | Primary industry | SaaS |
| employee_count | Number of employees (estimated if needed) | 150 |
| revenue_estimate | Estimated annual revenue | $20M |
| headquarters | City, State/Country | Austin, TX |
| founded_year | Year company was founded | 2018 |
| funding_stage | Latest funding round | Series B |
| total_funding | Total funding raised | $45M |
| tech_stack | Known technologies (semicolon-separated) | HubSpot; Salesforce; AWS |
| recent_news | Most relevant recent news item | Raised $20M Series B in Jan 2025 |
| hiring_activity | Open roles relevant to ICP | Hiring VP Marketing, 3 SDRs |
| company_linkedin | LinkedIn company page URL | https://linkedin.com/company/acme |
| icp_fit_score | ICP Fit dimension (1-10) | 8 |
| timing_score | Timing Signal dimension (1-10) | 7 |
| accessibility_score | Accessibility dimension (1-10) | 6 |
| total_score | Sum of 3 dimensions (3-30) | 21 |
| tier | Hot / Warm / Cold / Disqualified | Warm |
| notes | Research notes and observations | Strong ICP fit, recent funding, expanding marketing team |

### Contact CSV (`contacts-[date].csv`)

For Path B (LinkedIn Prospecting) and Path C (Hybrid).

| Column | Description | Example |
|--------|-------------|---------|
| first_name | Contact's first name | Jane |
| last_name | Contact's last name | Smith |
| job_title | Current job title | VP of Marketing |
| company_name | Current company | Acme Corp |
| linkedin_url | LinkedIn profile URL | https://linkedin.com/in/janesmith |
| location | City, State/Country | Austin, TX |
| headline | LinkedIn headline text | VP Marketing at Acme Corp &#124; B2B SaaS Growth |
| email_pattern | Company email pattern (if discovered) | first.last@acme.com |
| company_website | Company website | https://acme.com |
| company_size | Company employee range | 51-200 |
| industry | Company industry | SaaS |
| icp_fit_score | ICP Fit dimension (1-10) | 8 |
| timing_score | Timing Signal dimension (1-10) | 7 |
| accessibility_score | Accessibility dimension (1-10) | 9 |
| total_score | Sum of 3 dimensions (3-30) | 24 |
| tier | Hot / Warm / Cold / Disqualified | Hot |
| notes | Research notes | Decision maker, active on LinkedIn, company recently funded |

### Hybrid CSV (`leads-hybrid-[date].csv`)

For Path C — merges company and contact data.

| Column | Description |
|--------|-------------|
| company_name | Company name |
| website | Company website |
| industry | Company industry |
| employee_count | Company size |
| funding_stage | Latest funding |
| company_tier | Company-level tier (from Path A) |
| company_score | Company total score |
| contact_name | Full name of contact |
| job_title | Contact's title |
| linkedin_url | Contact's LinkedIn URL |
| location | Contact's location |
| contact_tier | Contact-level tier (from Path B) |
| contact_score | Contact total score |
| combined_score | Average of company + contact scores |
| priority | Final priority: High / Medium / Low |
| notes | Combined research notes |

---

## Markdown Report Template

### File: `lead-research-report-[date].md`

```markdown
# Lead Research Report

**Generated:** [date]
**ICP:** [1-line ICP summary]
**Approach:** Path [A/B/C] — [description]
**Total Leads Found:** [number]

---

## Executive Summary

- **Hot Leads:** [count] ([percentage]%)
- **Warm Leads:** [count] ([percentage]%)
- **Cold Leads:** [count] ([percentage]%)
- **Disqualified:** [count]
- **Average ICP Fit Score:** [X]/10
- **Top Industry:** [most common industry]
- **Top Geography:** [most common location]

---

## Hot Leads (Score 24-30)

| # | Company | Contact | Title | Score | Key Signal |
|---|---------|---------|-------|-------|------------|
| 1 | [company] | [name] | [title] | [score] | [why they're hot] |
| 2 | ... | ... | ... | ... | ... |

### Recommended Actions
- [Specific outreach suggestion for top 3 leads]

---

## Warm Leads (Score 16-23)

| # | Company | Contact | Title | Score | Key Signal |
|---|---------|---------|-------|-------|------------|
| 1 | [company] | [name] | [title] | [score] | [notable signal] |
| ... | ... | ... | ... | ... | ... |

### Recommended Actions
- [Nurture suggestions]

---

## Cold Leads (Score 8-15)

| # | Company | Score | Reason |
|---|---------|-------|--------|
| 1 | [company] | [score] | [why cold — what's missing] |
| ... | ... | ... | ... |

---

## Methodology

- **Search queries used:** [count]
- **Companies researched:** [count]
- **Contacts discovered:** [count]
- **Data sources:** Google Search, [list others used]
- **ICP criteria:** [summary of ICP definition]
- **Scoring:** 3-dimension rubric (ICP Fit + Timing + Accessibility, each 1-10)

---

## Next Steps

1. [ ] Review Hot leads and prioritize outreach order
2. [ ] Verify email addresses for top prospects
3. [ ] Draft personalized outreach for Hot tier
4. [ ] Set follow-up reminders for Warm tier
5. [ ] Re-evaluate Cold tier in [timeframe] for timing changes
```

---

## File Naming Conventions

All output files go to `./lead-research-output/`.

| File Type | Pattern | Example |
|----------|---------|---------|
| Company CSV | `companies-YYYY-MM-DD.csv` | `companies-2025-01-15.csv` |
| Contact CSV | `contacts-YYYY-MM-DD.csv` | `contacts-2025-01-15.csv` |
| Hybrid CSV | `leads-hybrid-YYYY-MM-DD.csv` | `leads-hybrid-2025-01-15.csv` |
| Markdown Report | `lead-research-report-YYYY-MM-DD.md` | `lead-research-report-2025-01-15.md` |
| Partial (during research) | `[type]-partial-[timestamp].csv` | `companies-partial-1705312000.csv` |
| Config | `lead-research-config.json` (project root) | — |

---

## CSV Generation Rules

1. **Always include headers** — first row is column names
2. **Quote fields containing commas** — wrap in double quotes
3. **Escape quotes within fields** — use double-double quotes (`""`)
4. **UTF-8 encoding** — ensure proper character encoding
5. **No trailing commas** — clean line endings
6. **Consistent column order** — match the schemas above exactly
7. **Empty fields** — use empty string, not "N/A" or "null"
8. **Scores are integers** — no decimals in scoring columns
9. **Tiers are capitalized** — "Hot", "Warm", "Cold", "Disqualified"
10. **URLs include protocol** — always `https://` prefix

### CSV Generation Method

Use a bash script or Node.js to write CSV files properly:

```bash
# Write CSV header + data
cat > "./lead-research-output/companies-$(date +%Y-%m-%d).csv" << 'CSVEOF'
company_name,website,industry,...
"Acme Corp","https://acme.com","SaaS",...
CSVEOF
```

Or generate with inline code that handles escaping automatically.
