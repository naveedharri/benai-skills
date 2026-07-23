# Phase 1: Data Collection

How to pull calls, full transcripts, CRM data, and email evidence for the analysis.

## Table of Contents
1. Step 1: Identify the Transcription Source
2. Step 2: Pull the Call List
3. Step 3: Pull Full Transcripts (NOT Summaries)
4. Step 4: Discover CRM Structure & Pull CRM Data
5. Step 5: Pull Email Communications
6. Data Collection Principles

## Step 1, Identify the Transcription Source

Check which transcription MCP tools are available in your environment:

- **Fireflies** → Use `fireflies_search`, `fireflies_get_transcripts`, `fireflies_get_transcript`, `fireflies_get_summary`
- **Attio call recordings** → Use `search-call-recordings-by-metadata`, `get-call-recording`
- **Other** → Check for any MCP tools related to Gong, Fathom, Otter, or similar. If none are available, ask the user to provide transcript files directly.

If no transcription tool is connected, stop and tell the user: "I don't see a connection to a meeting transcription tool. Could you connect Fireflies, Fathom, or similar through your integrations?"

## Step 2, Pull the Call List

Based on the user's scope preference from Phase 0:

**If "all calls":**
1. Search for all calls by the rep (filter by participant email, organizer, or keyword as appropriate)
2. Compile the full list: meeting title, date, participants, duration
3. Present the list to the user with `AskUserQuestion`: "Here are [N] calls I found. Which ones should I include in the analysis?" Let them remove irrelevant calls (internal meetings, non-sales calls, training sessions, etc.)

**If "specific calls":**
1. Search for the calls the user named
2. Confirm you found the right ones

**If "date range":**
1. Pull calls within the specified range
2. Filter to sales-related calls (look for external participants, sales-related titles)
3. Present list for approval

## Step 3, Pull Full Transcripts (NOT Summaries)

This step is critical to the quality of the entire analysis. You need the **complete word-for-word transcript** of every call, not summaries, not overviews, not bullet points. The difference matters enormously: summaries strip out the exact language the rep and prospect used, the hesitations, the specific objections, the pricing discussions, the moments where rapport builds or breaks. A summary might say "discussed pricing", but the transcript reveals whether the rep anchored high, folded at the first pushback, or confidently tied price to value. Without full transcripts, the grades in this report would be based on secondhand accounts rather than direct observation.

When using Fireflies:
- Use `fireflies_get_summary` **only** for metadata (date, participants, duration) and a quick overview of what the call covered
- Then **always** use `fireflies_get_transcript` to get the full conversation with speaker attribution, this is the primary data source for all analysis
- If `fireflies_get_transcript` fails or returns empty for any call, explicitly note it in your analysis and in the methodology section. Do not silently fall back to summaries.

When using Attio call recordings:
- Use `get-call-recording` which returns the full transcript with speaker attribution

**Verification step:** After pulling transcripts, confirm that what you received contains actual dialogue (speaker-attributed sentences), not a condensed summary. If a "transcript" looks like bullet points or a paragraph summary, it's not the real transcript, dig deeper or flag it.

Be aware of rate limits. If some transcripts fail, note which ones and move forward with what you have. Report the gap in the methodology section of the final report.

**Batch processing strategy:** If there are more than 10 calls, use parallel Task subagents to pull transcripts in batches of ~10-15 each. This dramatically speeds up the data collection phase.

## Step 4, Discover CRM Structure & Pull CRM Data

If the user opted for CRM cross-referencing (Phase 0, Question 4):

Before pulling any prospect data, you need to understand how the CRM is organized. Different teams structure their CRM very differently, some have a single pipeline list, others have separate lists for different stages, and the column names vary widely (one team's "Deal Value" is another's "Contract Amount" or "Budget"). Skipping this discovery step leads to missed data and incorrect deal outcomes.

**Step 4a, Discover All Lists & Pipelines:**
Use `list-lists` (or the CRM equivalent) to retrieve every list in the workspace. Present these to yourself and identify which ones are relevant to the sales analysis. Look for lists with names containing "pipeline," "deals," "opportunities," "prospects," "sales," or similar. There may also be lists for "lost deals," "churned," "onboarding," or "closed-won" that contain valuable outcome data.

**Step 4b, Map All Columns & Attributes:**
For each relevant list, use `list-list-attribute-definitions` to pull the complete set of columns/attributes. Paginate through ALL results (many CRMs have 20-40+ attributes per list, and the default page size is often 10). Keep pulling with increasing offset until you've seen every attribute.

Also pull the object-level attributes using `list-attribute-definitions` for the parent object (e.g., "companies" or "people"). These often contain critical fields like company size, industry, email addresses, and domains that don't appear on the list-level attributes.

Build a reference map of every available field, you'll use this throughout the analysis. Pay special attention to: stage/status fields (what are the possible values?), monetary fields (deal value, budget, forecast), date fields (created, stage change dates), and any custom fields the team uses for tracking deal progress.

**Step 4c, Pull Prospect Records & List Entries:**
For each prospect identified from the call list:
1. Search for the prospect in the CRM using `search-records` by name, email, or company domain
2. Save the record ID, you'll need it to look up list entries
3. Use `list-records-in-list` to find the prospect's entry in each relevant pipeline/list. Don't rely solely on filters, if a filter returns no results, try pulling a broader set and matching manually, since CRM data can be inconsistent (name variations, missing fields, etc.)
4. For each list entry found, pull ALL attribute values. This gives you the deal stage, value, dates, and any custom fields.

**Step 4d, Build the CRM Context Map:**
Compile a merged dataset per prospect containing: current pipeline stage, deal value (if any), all relevant dates (created, stage changes), budget/forecast fields, owner/assignee, and any notes or activity counts. This becomes the backbone for cross-referencing against transcript evidence.

If CRM access isn't available, rely on user-provided win/loss data.

## Step 5, Pull Email Communications

Email data is often the most reliable source for verifying deal outcomes and understanding what happened between calls. Contracts get signed via email, proposals get sent via email, and "we've decided to go with someone else" arrives via email. Skipping this step means relying solely on CRM stages (which may be stale) and transcript inferences (which can be ambiguous).

**Step 5a, Search by Domain & Email:**
For each prospect/company identified from the calls:
1. Use `search-emails-by-metadata` with the company domain to find all email correspondence
2. Also search by specific participant email addresses from the call recordings
3. Cast a wide net on time range, emails about deal outcomes often come days or weeks after the last call

**Step 5b, Semantic Search for Deal Signals:**
Use `semantic-search-emails` with queries designed to surface deal-critical communications:
- "contract signed" or "agreement executed"
- "proposal" or "quote" or "pricing"
- "decided to go with" or "not moving forward"
- "onboarding" or "kickoff" or "implementation"
- The prospect's company name + "deal" or "close"

**Step 5c, Pull Full Email Content:**
For emails that look deal-relevant based on subject/snippet, use `get-email-content` to read the full body. Look for:
- Payment confirmations or invoice references (strongest signal of a closed-won deal)
- Signed contracts or DocuSign/PandaDoc completion emails
- Rejection or "going with a competitor" messages
- Follow-up scheduling or next-step confirmations
- Proposal or SOW attachments

**Step 5d, Build an Email Evidence Log:**
For each prospect, compile a timeline of email evidence alongside the call recordings. Note which emails provide definitive deal outcome evidence vs. which are ambiguous. This log feeds directly into the deal outcome verification in Phase 2.

If email tools aren't available, note this limitation and rely on CRM + transcript data for deal outcomes.

## Data Collection Principles

**Full transcripts, not summaries.** This is the single most important data quality decision in the entire workflow. Summaries lose the nuance, the exact words a prospect uses when they're about to close, the silence after a pricing reveal, the specific objection that went unaddressed, the way a rep introduces pricing. A summary that says "discussed pricing and next steps" tells you almost nothing about whether the rep handled that moment well. The full transcript of that same moment might reveal the rep said "our price is $500/month but we can do a discount" (anchoring low and volunteering a discount unprompted) vs. "based on the ROI we just discussed, most teams at your stage invest $500-800/month" (anchoring to value). That distinction is the difference between a C and an A in pricing technique, and it's invisible in summaries.

**Understand the CRM before querying it.** Every CRM is structured differently. Before pulling a single prospect record, map out the available lists, pipelines, and columns. A 5-minute discovery step prevents the entire analysis from missing critical data, like deal values sitting in a custom "Contract Amount" field instead of the default "Value" field, or deal outcomes living in a separate "Closed Deals" list rather than a stage on the main pipeline. Paginate through all attribute definitions; don't stop at the first page.

**Don't silently skip data sources.** If email tools, CRM tools, or full transcripts aren't available, explicitly note what's missing in the methodology section and how it limits the analysis. The user deserves to know what the report is based on and what it's missing.
