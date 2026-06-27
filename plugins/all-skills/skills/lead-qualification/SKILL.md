---
name: lead-qualification
description: Qualify B2B leads against a user-defined Ideal Customer Profile (ICP). Use this skill whenever the user
  uploads a lead list (CSV, XLSX, JSON) and wants to filter or qualify leads based on any criteria: services,
  technologies, headcount, geography, niche, vertical, job title, revenue, or anything else. Also trigger
  when the user says "qualify leads", "filter my leads", "which leads match my ICP", "score these leads",
  "segment this list", "clean up my lead list", or "find the best leads". This skill handles lead lists of
  any size by automatically batching work across parallel sub-agents.
---

# Lead Qualification

You are qualifying a list of B2B leads against the user's Ideal Customer Profile. Your job is to take a raw lead list, understand exactly what the user considers a "good" lead, and return a clean set of qualified leads with clear reasoning for each decision.

## Before You Do Anything

You need two things from the user. Do not proceed without both:

1. **The lead list** - a file (CSV, XLSX, or JSON) containing the leads
2. **The ICP definition** - the user's specific criteria for what makes a qualified lead

### Getting the ICP Right

The ICP definition can be literally anything. Never assume what it looks like. Ask the user to describe their ideal customer in their own words. Here are examples of dimensions they might care about, but this list is not exhaustive:

- **Services offered**: "must offer SEO services", "must be a marketing agency", "must do paid media"
- **Technologies used**: "must use HubSpot", "must run on Shopify", "must work with WordPress"
- **Headcount / company size**: "11-500 employees", "under 50 people", "enterprise only"
- **Geography**: "US-based only", "must be in DACH region", "California agencies only"
- **Industry / vertical**: "healthcare", "SaaS", "legal services", "e-commerce"
- **Revenue range**: "must be doing $1M+ ARR"
- **Job title of the contact**: "must be Director level or above", "must be a founder/CEO"
- **Company age**: "must be at least 2 years old"
- **Something completely different**: always be open to criteria you haven't seen before

If the user's ICP is vague (e.g., "good companies" or "people who would be interested"), push back. Ask: "What specifically makes a company a good fit? What would make you NOT want to reach out?" You need concrete, actionable criteria.

### Handling Complex ICPs

Sometimes the ICP has AND conditions ("must be US-based AND offer SEO AND have 11-50 employees") and sometimes it has OR conditions ("healthcare OR legal vertical"). Clarify the logic. Ask: "Do they need to meet ALL of these, or are some of these nice-to-haves?"

## The Qualification Process

### Step 1: Load and Inspect the Lead List

Read the file and understand its structure. Report to the user:
- Total number of leads
- Column names available
- A sample of 2-3 rows

This lets the user confirm the data is loaded correctly and gives you a chance to spot issues early (missing columns, weird formatting, duplicates).

### Step 2: Verify Through Multi-Source Web Research

**CRITICAL RULE: NEVER rely on CSV/spreadsheet data alone for qualification.** CSV data is frequently wrong. Every lead MUST be verified through WebSearch across multiple sources.

The sub-agent's job for each lead:
1. Read the available CSV columns for the lead
2. Use WebSearch to research the company from multiple sources — not just the company's own website
3. Cross-reference findings from review sites (G2, Clutch, Trustpilot), industry directories, news articles, LinkedIn company pages, job boards, and other third-party sources
4. Check whether the combined evidence confirms the company matches the ICP

**ALWAYS use WebSearch and check multiple sources.** A company's own website only tells one side of the story. Third-party sources reveal actual services offered, real employee counts, recent news, client reviews, and other signals that are critical for accurate qualification. Aim for 2-3 WebSearch queries per lead to build a complete picture.

### Step 3: Calculate Sub-Agent Plan

Qualification MUST happen via `lead-qualifier` sub-agents for any list larger than 10 leads. Here's the math:

- **Leads per agent**: 10
- **Number of agents**: ceil(total_leads / 10)

Tell the user the plan before launching: "I have 606 leads to qualify. I'll launch 61 sub-agents, each handling 10 leads. Running in parallel, this should take roughly X minutes."

**Time estimation guidelines:**
- Each lead requires 2-3 WebSearch calls across multiple sources: ~15-30 seconds per lead
- Sub-agents run in parallel, so wall-clock time is roughly the time for one agent's batch
- ALWAYS use WebSearch to check multiple sources (company website, review sites, directories, news) for accurate qualification

### Step 4: Launch Sub-Agents

**Record the start time** (use Python `time.time()` or bash `date +%s`).

Spawn ALL `lead-qualifier` sub-agents in a single message for maximum parallelism. Each sub-agent receives:

1. Its batch of leads (as JSON)
2. The full ICP definition (copy it verbatim, don't summarize)
3. Clear instructions on qualification logic (AND/OR conditions)
4. The output file path

**What to include in each sub-agent's prompt:**

```
[PASTE THE FULL ICP DEFINITION HERE]

[SPECIFY AND/OR LOGIC: "A lead must meet ALL of these criteria to qualify" or whatever the logic is]

Here are your leads (JSON):
[LEAD BATCH]

MANDATORY: Use WebSearch to research EVERY lead from multiple sources. Never qualify based on CSV data alone or just the company's own website. For each lead, run 2-3 WebSearch queries: one for the company website, and additional searches to cross-reference with review sites, industry directories, news articles, and LinkedIn. Third-party sources are essential for verifying actual services, employee count, and ICP fit.

Save your results as a JSON array to: [file path]
```

**Critical: Spawn ALL `lead-qualifier` sub-agents in a single message.** If there are 1,000 leads, that means 100 sub-agents spawned simultaneously. Every sub-agent launches at once for maximum parallelism.

### Step 5: Collect and Combine Results

After all sub-agents complete:

1. Load every result file
2. Combine into a single list
3. Separate into qualified and disqualified
4. Count totals
5. **Record the end time**

Handle edge cases:
- If a sub-agent failed, note which leads it was responsible for and report to the user
- If results have unexpected format, try to parse them anyway before giving up
- Check for duplicates (same company appearing multiple times)

### Step 6: Save Outputs and Report

Create these outputs:

1. **Qualified leads file** (JSON) containing only qualified leads with all original data plus the qualification reason. Save to the working directory (e.g., `all_qualified_leads.json`)
2. **Updated CSV/XLSX** with two new columns added to the original file:
   - `Qualified` (Yes/No)
   - `Qualification Reason` (the explanation)

Report to the user:
```
Qualification complete.
- Total leads: 606
- Qualified: 40 (6.6%)
- Disqualified: 566
- Time taken: 4 minutes 32 seconds
- Output: [link to file]
```

## Rules

- **Always use sub-agents.** Never try to qualify more than 10 leads in your main thread. The main thread is for orchestration only.
- **Always time the process.** Record start and end time and report duration.
- **Always tell the user the plan before launching.** Number of sub-agents, leads per agent, estimated time.
- **Preserve ALL original columns.** Never drop data from the original file.
- **If borderline, qualify.** Let the user make the final call on edge cases. It's better to include a maybe-qualified lead than to miss one.
- **Flag duplicates.** If the same company appears multiple times, tell the user but don't auto-remove.
- **If columns are missing for a criterion, say so immediately.** Don't guess.

## Error Handling

- If a sub-agent fails, retry it once. If it fails again, report which lead indices couldn't be processed and why.
- If the lead list file is malformed, help the user fix it before proceeding.
- If the user's ICP is ambiguous even after clarification, document your interpretation and get confirmation before running.
