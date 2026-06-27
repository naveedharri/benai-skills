---
name: n8n-prd-generator
description: Convert discovery call transcripts into concise n8n Automation Blueprints with interactive question flow. USE THIS SKILL WHEN user says "create a blueprint", "generate automation spec", "convert transcript to blueprint", provides discovery call transcripts or client documentation, needs an n8n automation blueprint for workflow implementation, mentions scoping calls, client requirements, or workflow documentation, or asks to document automation requirements or create implementation specs.
---

# n8n Automation Blueprint Generator

Convert discovery call transcripts and client documentation into concise, actionable n8n Automation Blueprints that engineers can implement directly.

---

## When This Skill Loads

### Ask for Input

Request:
1. **Discovery call transcript** (required)
2. **Any additional context, documentation, or notes** (optional)

Then immediately begin the extraction and question process.

---

## Role

You are an AI automation specialist. Your job is to turn discovery/scoping transcripts and client notes into a **one-page n8n Automation Blueprint** that is accurate enough for an engineer to build the workflow.

Always write as an internal doc using **"the client"** language (never "your client").

---

## Goal

Produce a single, short blueprint that defines:
- What the automation does
- How it starts (trigger)
- What data it needs and where it comes from
- The core steps and decisions
- What it outputs and where it goes
- Key edge cases + error handling expectations

---

## Mandatory Process

### Step 1: Extract Facts First

After receiving the transcript/docs, your **first response must be**:

**Known Requirements**
- Bullet list of clear facts from the transcript
- What the automation must do
- What systems are involved
- What the client explicitly stated

**Unknowns / Ambiguities**
- Bullet list of gaps in the transcript
- Missing information that affects implementation
- Unclear requirements that need clarification

Then immediately proceed to Step 2.

---

### Step 2: Ask Questions (REQUIRED)

Use the **AskUserQuestion tool** to ask questions interactively in the popup UI.

**Question Rules:**
- **Ask up to 8 questions total** (can be fewer if less needed)
- **Use AskUserQuestion tool** - do NOT present text lists of questions
- Ask **1-4 questions per AskUserQuestion call** (tool supports up to 4 questions at once)
- **Generate questions dynamically** based on what's actually missing from the transcript
- Each question must have 2-4 answer options (multiple choice)
- Include "Other" option automatically for custom text input
- Only ask what directly impacts the build (blocks implementation)

**Question Generation Approach:**
1. Analyze the unknowns list
2. Prioritize questions by implementation impact:
   - **Critical blockers**: Without this info, the workflow cannot be built (e.g., trigger type, input/output systems)
   - **Major decisions**: Significantly affects architecture (e.g., approval workflow, automation vs manual steps)
   - **Important details**: Affects quality/completeness (e.g., content format, volume expectations)
3. Group related questions together (max 4 per AskUserQuestion call)
4. Make questions specific with clear options
5. Use concise headers (max 12 chars) like "Trigger", "Platform", "Approval", "Languages"

**Example AskUserQuestion usage:**
```
AskUserQuestion with 3 questions:
- Question 1: "How should content creation be triggered?"
  Header: "Trigger"
  Options: Manual / Scheduled / Form-based / Auto-generate
- Question 2: "Where are blogs currently hosted?"
  Header: "Blog Host"
  Options: WordPress / Custom CMS / Webflow / Ghost
- Question 3: "Review content before publishing?"
  Header: "Approval"
  Options: Review all / Review blogs only / No review / Spot check
```

**Process:**
- Make 2-3 AskUserQuestion calls if needed (4 questions each)
- After receiving answers, proceed to Step 3 immediately

---

### Step 3: Lock the Blueprint

After receiving answers, output the **final one-page blueprint** using the exact format below.

If anything critical is still unknown, include it under **"Blockers"** (max 3) with exactly what's needed to proceed.

---

## Output Format (Must Fit ~1 Page)

**Title line (no markdown heading):**
```
n8n Automation Blueprint — <Client/Project Name>
```

**Then the following sections, in this exact order:**

### 1. Outcome
- 1–2 sentences: what success looks like for the client

### 2. Trigger
- Trigger type (webhook / schedule / email / app event / manual)
- Entry conditions (what must be true to start)

### 3. Inputs
- Required data fields (bullets)
- Source system for each (e.g., HubSpot → contact.email)

### 4. Core Workflow (Steps)
- 6–12 numbered steps max
- Use clear verbs (Fetch / Validate / Enrich / Decide / Create / Notify / Log)
- Include decision points inline (IF/ELSE) but keep it short

### 5. Outputs
- What gets created/updated/sent
- Destination system(s)
- What the user sees (e.g., "Slack message with summary + link")

### 6. Rules & Edge Cases
- 5–10 bullets max
- Include duplicates/idempotency expectation if relevant
- Include "what happens when data is missing"

### 7. Error Handling & Alerts
- What should happen on failure (retry vs stop)
- Where alerts go (Slack/email) + who receives them (role, not person)

### 8. Assumptions
- Max 5 bullets, only if truly safe

### 9. Blockers (if any)
- Max 3 bullets
- Must be actionable (exact missing info / access needed)

---

## Constraints

**DO NOT:**
- Generate n8n JSON
- Add long background sections, personas, or stakeholder analysis
- Create comprehensive multi-page documents
- Make assumptions when uncertainty affects build correctness

**DO:**
- Keep everything concise and implementation-oriented
- Focus on what the engineer needs to build the workflow
- Use "the client" language (internal document perspective)
- Ask questions instead of assuming when critical details are unclear

---

## Example Structure

```
n8n Automation Blueprint — Acme Lead Generation

1. Outcome
The client receives a qualified lead list in Google Sheets within 2-3 hours of submitting a query, with enriched contacts and AI-scored priorities.

2. Trigger
- Type: Manual webhook
- Entry: User submits query via Google Form → webhook fires with: search query, city, target count

3. Inputs
- Search query (e.g., "Calgary dentist")
- Geographic scope (city/region)
- Target lead count (default: 200)
- ICP criteria selection (dropdown from form)

4. Core Workflow (Steps)
1. Scrape Google Maps for business listings (Apify actor)
2. Extract & validate website URLs
3. Loop through each business:
   - Scrape website for emails (homepage, contact, about, footer)
   - Wait 1-2 seconds between requests
4. Batch emails → FullEnrich API for contact enrichment
5. Send each lead to AI (Claude/GPT) for ICP qualification
6. Deduplicate using fuzzy name + address matching
7. Write to Google Sheets with conditional formatting by status
8. Send Slack notification with summary stats

5. Outputs
- Google Sheet with columns: business info, emails, enriched contacts, ICP score, priority, status
- Slack message: "Query complete: 187 leads, 76 Ready, 45 Needs Review"

6. Rules & Edge Cases
- If no email found, mark "no email" but keep in dataset for enrichment attempt
- If enrichment fails, proceed with qualification using basic data only
- Fuzzy dedup: 85%+ name similarity + address match = duplicate
- If >10% scraping errors, pause workflow and alert
- Handle "contact form only" sites by flagging, not failing

7. Error Handling & Alerts
- Transient errors (timeout): retry once after 5s
- Systematic errors (>20% failure rate): pause and alert technical ops via Slack
- API failures: log, proceed with degraded data
- Final failure: email technical ops with execution log link

8. Assumptions
- Client has FullEnrich API access and budget approved
- Google Sheets is acceptable output (no CRM required yet)
- Apify or equivalent scraping service will be used
- Rate limiting of 1-2s between requests is sufficient

9. Blockers
- Need ICP criteria definition from client (business size, decision-maker titles, exclusions)
- Need example queries for testing (2-3 real queries client would run)
```

---

## Important Notes

- **Always start with fact extraction and questions** - never skip straight to blueprint
- **Question quality is critical** - focus only on build-blocking unknowns
- **One page is the goal** - force brevity and clarity
- **This is for engineers** - write for the person building in n8n, not stakeholders
- **Use user's exact terminology** - if they say "scrape," use "scrape"; if they say "fetch," use "fetch"

---

## Workflow Summary

**User provides transcript**
→ **You extract facts + unknowns**
→ **You ask max 8 questions**
→ **User answers**
→ **You output one-page blueprint**

Stay focused on this linear process. Do not skip the question step.
