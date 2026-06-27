---
name: crm-prospect-mining
description: >
  Mine high-value prospects from CRM pipeline stages (Lost, No Show, Churned, Stalled) by cross-referencing
  records with LinkedIn company data and comms history. Connects to any CRM, pulls records from target stages,
  filters out personal email domains, bulk-scrapes company sizes via Apify, and filters by the user's
  "high-value" definition (headcount, industry, deal size). MANDATORY TRIGGERS: "find high-value prospects",
  "mine my lost deals", "reactivate pipeline", "prospect mining", "CRM mining", "re-engage lost leads",
  "company size analysis", "headcount filter", or any request about identifying which CRM prospects are
  worth pursuing based on company size, industry, or intent signals.
---

# CRM Prospect Mining

You are mining a user's CRM to identify high-value prospects hiding in pipeline stages they've written off (Lost, No Show, Churned, Stalled, etc.). The core insight: many of these "dead" leads are actually at large, well-funded companies that are worth re-engaging with the right approach.

## The Pipeline At a Glance

```
CRM Records → Filter Domains → Find LinkedIn Pages → Scrape Company Sizes → Filter High-Value → Enrich with Comms/Intent → Report
```

Each step is explained in detail below. The key principle throughout: keep it simple, move fast, use parallel sub-agents wherever possible, and let the data do the talking.

## Phase 1: Discovery — Understanding the User's Setup

Before touching any data, you need to understand three things. Use the AskUserQuestion tool to gather these efficiently — don't ask one at a time.

### 1. What does "high-value" mean to them?

Every user defines this differently. Common dimensions:

- **Company headcount** (most common): "25+ employees", "100+ employees", "enterprise only"
- **Industry/vertical**: "only SaaS companies", "agencies only", "e-commerce"
- **Deal value**: "deals worth $10k+", "enterprise tier only"
- **Geography**: "US-based", "EMEA only"
- **Any combination**: "50+ employees AND in the US AND deal value over $5k"

If they're unsure, suggest headcount as a sensible default starting point — it's the most reliable signal you can get from LinkedIn and correlates well with budget. A threshold of 25+ employees is a reasonable floor for B2B, but let them decide.

### 2. Do they want intent analysis?

This is the difference between a quick filter and a deep analysis. Two levels:

- **Metrics-only** (fast): Filter purely on headcount/industry/deal size. Output is a clean list of companies that meet the criteria. Good for a first pass or when speed matters.
- **Metrics + Intent** (thorough): On top of the metrics filter, also pull email communications and/or meeting transcripts from the CRM to understand what actually happened with each deal. Did the prospect go cold because of budget? Bad timing? Competitor? This turns the output from "big companies you lost" into "big companies worth re-engaging and here's how to approach them." Much more actionable but takes longer.

Default to metrics-only unless the user asks for deeper analysis. If they have a small number of high-value leads (under 50), suggest adding intent analysis since it won't add much time.

### 3. What CRM and what structure?

You need to understand what you're working with before writing any queries. This is where the approach varies most between users.

**Discover the CRM structure programmatically.** Don't ask the user to describe their schema — look at it yourself:

- **Attio**: Use `list-lists` to see available lists, then `list-list-attribute-definitions` on the relevant list to understand fields, stages, and statuses. Use `list-records-in-list` with appropriate filters to pull data.
- **HubSpot**: Use deal pipeline endpoints to understand stages, then pull deals by stage.
- **Salesforce**: Query opportunity stages and pull by stage name.
- **Other CRMs**: Check what MCP tools are available and explore the schema.

Ask the user which list/pipeline to analyze and which stages to pull (Lost, No Show, etc.). Then inspect the schema yourself to understand what fields are available (deal value, priority, source, notes, etc.).

**Important**: Different CRMs store data differently. Some have person records linked to company records. Some have deals linked to contacts. Some have flat lists. Read the CRM structure and adapt — don't assume any particular schema.

## Phase 2: Data Extraction

### Step 1: Pull all records from the target stages

Query the CRM for all records in the user's specified stages. Handle pagination — most CRM APIs cap at 50 records per request, so loop with offset until you've got everything.

**For Attio specifically:**
- Use `list-records-in-list` with a filter on the stage/status field
- The stage field might be called `stage`, `status`, `pipeline_stage`, or something else — check the attribute definitions first
- Records come back with `parent_record_id` — you'll need this to fetch person/company details
- Use `get-records-by-ids` to fetch full person records in batches (the list entries only have entry-level attributes, not the person's email/phone/name)

**Critical**: Capture ALL relevant fields from the outset. You'll need at minimum:
- Contact name
- Email address
- Phone (if available)
- Any deal value / budget field
- The stage they're in (Lost, No Show, etc.)
- Record ID (for later lookups)

Save the raw extracted data to a JSON file immediately. Never rely on conversation context to hold large datasets — it will be lost during context compaction.

### Step 2: Filter out personal email domains

This is a fast, critical filter. Contacts using personal email addresses (gmail.com, yahoo.com, hotmail.com, outlook.com, etc.) typically aren't representing a company — or if they are, you can't identify the company from the email alone.

Personal domains to filter out:
```
gmail.com, yahoo.com, hotmail.com, outlook.com, live.com, aol.com, icloud.com,
me.com, mail.com, protonmail.com, zoho.com, yandex.com, gmx.com, tutanota.com,
fastmail.com, hushmail.com, inbox.com, msn.com, qq.com, 163.com, 126.com,
rediffmail.com, web.de, gmx.de, t-online.de, orange.fr, free.fr, laposte.net
```

Also filter any domain that looks personal (single-person domains are fine to keep — they usually indicate a freelancer/consultant, which may or may not be relevant depending on the user's ICP).

Write a Python script to do this filtering. It should:
1. Load the raw records
2. Extract the domain from each email
3. Classify as personal or company domain
4. Save two files: `domain_leads.json` (keep) and `filtered_personal.json` (removed)
5. Report the counts: "112 company domain leads kept, 49 personal emails filtered out"

### Step 3: Find company LinkedIn pages via web research

For each company domain lead, you need to find their LinkedIn company page URL. This is best done via parallel web search sub-agents.

**Batch the leads** into groups of ~14 and launch one sub-agent per batch. Each sub-agent searches for `"[company domain] linkedin company page"` and returns the LinkedIn company URL. See `agents/company-linkedin-finder.md` for the sub-agent prompt.

Important URL normalization: LinkedIn company pages sometimes appear with country-specific subdomains (nl.linkedin.com, uk.linkedin.com, in.linkedin.com, au.linkedin.com, de.linkedin.com, etc.). Always normalize these to `www.linkedin.com` before passing to Apify. The data is the same regardless of subdomain.

Save results to `all_linkedin_results.json` with structure:
```json
[
  {"record_id": "...", "domain": "example.com", "linkedin_company_url": "https://www.linkedin.com/company/example"},
  {"record_id": "...", "domain": "nolinkedin.com", "linkedin_company_url": "no_company_page"}
]
```

Extract the found URLs into a separate `apify_urls.json` (clean list, no duplicates, no "no_company_page" entries).

### Step 4: Scrape company sizes from LinkedIn via Apify

Use the Apify actor `scrapeverse/linkedin-company-profile-scraper-pay-per-event` to bulk-scrape company data. This is a pay-per-event actor (no subscription required), costing roughly $0.006 per company.

**Input format:**
```json
{
  "urls": ["https://www.linkedin.com/company/example-1", "https://www.linkedin.com/company/example-2"],
  "proxy": {"useApifyProxy": true}
}
```

**Send ALL URLs in a single call.** Don't batch into multiple runs — the actor handles any number of URLs.

**Calling the actor:**
1. Call `call-actor` with `actor: "scrapeverse/linkedin-company-profile-scraper-pay-per-event"`, `step: "info"` first
2. Then call with `step: "call"` and the input above
3. The MCP tool will likely timeout after ~30 seconds — this is normal. The run continues in the background.
4. Extract the `runId` from the partial response
5. Poll with `get-actor-run` every 60 seconds until status is `SUCCEEDED`
6. Fetch results with `get-dataset-items` using the `datasetId`

**Key fields from the response:**
- `inputURL` — the LinkedIn URL you sent (use for matching back to your leads)
- `company_name` — the company's name on LinkedIn
- `company_size_on_linkedin` — numeric employee count (this is the gold)
- `company_size` — text range like "51-200 employees"

Save the full dataset to disk immediately after fetching.

### Step 5: Filter to high-value leads

Write a Python script that:
1. Loads `domain_leads.json`, `all_linkedin_results.json`, and the Apify results
2. Builds a lookup by normalized LinkedIn URL to match Apify data to your leads
3. Filters based on the user's criteria (e.g., `company_size_on_linkedin >= 25`)
4. Sorts by company size descending (biggest opportunities first)
5. Saves to `high_value_leads.json`

Report the funnel: "161 total records → 112 domain leads → 96 matched LinkedIn → 35 high-value (25+ employees)"

## Phase 3: Enrichment

### Entry-level CRM data

Go back to the CRM and pull entry-level attributes for the high-value leads. These are fields that live on the list entry (not the person record) — things like deal value, priority, source, lost reason, notes, agreement stage.

For Attio: use `list-records-in-list` and page through all entries, matching by `parent_record_id` to your high-value record IDs.

Build a lookup mapping record_id → {deal_value, priority, source, lost_reason, notes, etc.} and merge into your high-value leads data.

### Intent analysis (if requested)

If the user opted for metrics + intent analysis, search for email communications and/or meeting transcripts for each high-value lead.

**Email comms** (via CRM email search):
- Search by each lead's email address
- Summarize the last 1-3 communications in 1-2 sentences: what was discussed, what the outcome was, why the deal stalled
- Focus on actionable intel: "Budget wasn't approved", "Built in-house instead", "Timing was wrong — revisit Q2", "Competitor won on price"

**Meeting transcripts** (via Fireflies, Gong, or other transcription tools):
- Search for transcripts involving each lead's email
- Extract key themes: objections raised, interest signals, decision-maker involvement, next steps that were promised but never happened

For efficiency, batch email searches across sub-agents — one sub-agent per ~7 leads works well. Each sub-agent searches, reads the recent emails, and returns a one-line summary.

## Phase 4: Report Generation

Generate the final output as an Excel (.xlsx) file. Use the `xlsx` skill (invoke it via the Skill tool) before creating the spreadsheet for best practices on formatting.

### Required columns:
| Column | Source |
|--------|--------|
| Name | CRM person record |
| Email | CRM person record |
| Phone | CRM person record |
| Company (LinkedIn) | Apify scrape |
| Employees | Apify scrape (`company_size_on_linkedin`) |
| Company Size Range | Apify scrape |
| Stage | CRM list entry (Lost, No Show, etc.) |
| Deal Value | CRM list entry |
| Priority | CRM list entry |
| Source | CRM list entry |
| Lost Reason | CRM list entry |
| Budget (Self-Reported) | CRM person record |
| Comms Summary | Email/transcript analysis (if requested) |

### Formatting:
- Color-code rows by company tier (Enterprise 500+, Mid-Market 100-499, SMB 25-99 — or whatever tiers make sense for the user's threshold)
- Sort by employee count descending (biggest opportunities first)
- Include a Summary Stats sheet with funnel metrics and top 10 leads
- Freeze header row, enable auto-filter
- Use professional fonts and clean formatting

### Presentation:
When delivering the report, give the user a brief summary: how many high-value leads were found, the top 5 by company size, and any patterns you noticed (e.g., "Most lost deals came from Ben AI source", "Budget was cited as the reason in 3 cases"). Don't over-explain — let them open the file and explore.

## Key Principles

1. **Save everything to disk.** Large datasets WILL overflow conversation context. Write JSON files after every major step. Build merge logic in Python scripts, not inline.

2. **Parallelize aggressively.** Web research, email searches, and transcript analysis should all use parallel sub-agents. Batch sizes of 7-14 leads per sub-agent work well.

3. **Normalize LinkedIn URLs.** Country subdomains (nl., uk., in., au., de., il., ca., lv., pk.) must be normalized to www.linkedin.com before Apify calls and when matching results back.

4. **Adapt to the CRM.** Don't assume Attio's data model. Inspect the schema first, understand how records, entries, and attributes relate, then build your extraction logic accordingly.

5. **Keep the user informed.** Report progress at each major step: "Pulled 161 records", "Filtered to 112 domain leads", "Found 96 LinkedIn pages", "35 leads meet your criteria". This builds confidence and catches issues early.
