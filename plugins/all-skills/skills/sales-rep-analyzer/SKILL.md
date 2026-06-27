---
name: sales-rep-analyzer
description: Sales rep performance analyzer and grader. Pulls meeting transcripts from Fireflies, Fathom, or any
  transcription tool, cross-references with CRM data (Attio, HubSpot, Salesforce, Pipedrive, etc.), and
  produces a comprehensive .docx performance report with per-prospect journey mapping, evidence-backed grades,
  and coaching recommendations. MANDATORY TRIGGERS: "sales rep analysis", "grade my sales calls",
  "analyze my calls", "sales performance review", "rep scorecard", "sales coaching report", "grade my demos",
  "review my sales performance", "sales call analysis", "evaluate my selling", or any request about
  evaluating a sales rep's call performance or producing a sales coaching report from meeting recordings.
---

# Sales Rep Performance Analyzer

Analyze a sales rep's call recordings alongside CRM data to produce a comprehensive, evidence-backed performance report with grades, real transcript quotes, and actionable coaching recommendations.

## What This Skill Produces

A professional .docx report covering:

- **Executive summary** with overall grade and key findings
- **Performance scorecard** with letter grades across 8-10 dimensions (e.g., Discovery, Objection Handling, Closing, Urgency, Follow-up)
- **Per-prospect journey analysis** showing the full arc from first meeting through outcome, cross-referenced with CRM stage data
- **Evidence section for each grade** with real quotes pulled from transcripts — both strengths and weaknesses
- **Deal outcome correlation** — what the rep does differently on won vs. lost deals
- **Confirmed closed/lost deal table** with evidence from both transcripts and CRM
- **Coaching recommendations** prioritized by impact, with specific examples of what to do differently
- **Methodology note** explaining data sources and any limitations (rate-limited transcripts, missing CRM fields, etc.)

The report reads like something a VP of Sales or sales coach would write after shadowing the rep for a month — grounded in evidence, not generic advice.

## Phase 0: Gather Context

Before pulling any data, use `AskUserQuestion` to collect the information needed to do this right. Missing any of these leads to a shallow analysis. Combine into 2-3 AskUserQuestion calls (max 4 questions per call).

### Round 1 — Business Context

**Question 1 — The Business:**
"Tell me a bit about your business: What do you sell, who's your ideal customer (ICP), and what does a sales-qualified meeting look like for you?"
- This grounds the entire analysis. Without knowing the product and ICP, you can't assess whether the rep is asking the right discovery questions or pitching the right value props.

**Question 2 — The Rep & Targets:**
"Who is the sales rep being analyzed? What are their targets or quotas (e.g., deals per month, revenue targets, meeting-to-close ratio)? If you don't have formal targets, that's fine — just let me know."
- Targets give the grades context. A 14% close rate might be excellent for enterprise SaaS but poor for SMB.

### Round 2 — Data Sources & Scope

**Question 3 — Call Selection:**
"Do you want me to analyze ALL of this rep's sales calls, or a specific set? If specific, which ones?"
- Options: "All calls" (then present a list for approval), "Calls from a date range", "Specific calls I'll name"
- If the user says "all," pull the full list from the transcription tool and present it for the user to approve/prune before doing deep analysis.

**Question 4 — Deal Outcomes:**
"How should I determine which deals were won vs. lost? Options: (a) You tell me manually which prospects closed, (b) I cross-check against your CRM automatically, or (c) Both — you tell me what you know and I verify against CRM."
- This was a key gap in previous workflows. The outcome data fundamentally changes the analysis — a rep who closes 10/69 calls gets graded very differently than one who closes 1/69.

### Round 3 — Scoring & CRM

**Question 5 — Scoring Framework:**
"Do you have your own scoring framework for evaluating sales calls, or would you like to use an established one? Common options include BANT (Budget, Authority, Need, Timeline), MEDDIC (Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion), or a custom framework I can build based on your sales process."
- If the user picks a standard framework, use it as the backbone of the grading dimensions. If custom, ask follow-up questions to understand what matters most.

**Question 6 — CRM Access:**
"Which CRM are you using (Attio, HubSpot, Salesforce, Pipedrive, etc.)? I'll cross-reference deal stages, contact records, and activity history with the call transcripts."
- Check available MCP tools to confirm you can actually connect. If the CRM isn't available, note this limitation and rely on user-provided outcome data.

After collecting all answers, summarize your understanding back to the user in a few sentences and get confirmation before pulling any data.

## Phase 1: Data Collection

### Step 1 — Identify the Transcription Source

Check which transcription MCP tools are available in your environment:

- **Fireflies** → Use `fireflies_search`, `fireflies_get_transcripts`, `fireflies_get_transcript`, `fireflies_get_summary`
- **Attio call recordings** → Use `search-call-recordings-by-metadata`, `get-call-recording`
- **Other** → Check for any MCP tools related to Gong, Fathom, Otter, or similar. If none are available, ask the user to provide transcript files directly.

If no transcription tool is connected, stop and tell the user: "I don't see a connection to a meeting transcription tool. Could you connect Fireflies, Fathom, or similar through your integrations?"

### Step 2 — Pull the Call List

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

### Step 3 — Pull Full Transcripts (NOT Summaries)

This step is critical to the quality of the entire analysis. You need the **complete word-for-word transcript** of every call — not summaries, not overviews, not bullet points. The difference matters enormously: summaries strip out the exact language the rep and prospect used, the hesitations, the specific objections, the pricing discussions, the moments where rapport builds or breaks. A summary might say "discussed pricing" — but the transcript reveals whether the rep anchored high, folded at the first pushback, or confidently tied price to value. Without full transcripts, the grades in this report would be based on secondhand accounts rather than direct observation.

When using Fireflies:
- Use `fireflies_get_summary` **only** for metadata (date, participants, duration) and a quick overview of what the call covered
- Then **always** use `fireflies_get_transcript` to get the full conversation with speaker attribution — this is the primary data source for all analysis
- If `fireflies_get_transcript` fails or returns empty for any call, explicitly note it in your analysis and in the methodology section. Do not silently fall back to summaries.

When using Attio call recordings:
- Use `get-call-recording` which returns the full transcript with speaker attribution

**Verification step:** After pulling transcripts, confirm that what you received contains actual dialogue (speaker-attributed sentences), not a condensed summary. If a "transcript" looks like bullet points or a paragraph summary, it's not the real transcript — dig deeper or flag it.

Be aware of rate limits. If some transcripts fail, note which ones and move forward with what you have. Report the gap in the methodology section of the final report.

**Batch processing strategy:** If there are more than 10 calls, use parallel Task subagents to pull transcripts in batches of ~10-15 each. This dramatically speeds up the data collection phase.

### Step 4 — Discover CRM Structure & Pull CRM Data

If the user opted for CRM cross-referencing (Phase 0, Question 4):

Before pulling any prospect data, you need to understand how the CRM is organized. Different teams structure their CRM very differently — some have a single pipeline list, others have separate lists for different stages, and the column names vary widely (one team's "Deal Value" is another's "Contract Amount" or "Budget"). Skipping this discovery step leads to missed data and incorrect deal outcomes.

**Step 4a — Discover All Lists & Pipelines:**
Use `list-lists` (or the CRM equivalent) to retrieve every list in the workspace. Present these to yourself and identify which ones are relevant to the sales analysis. Look for lists with names containing "pipeline," "deals," "opportunities," "prospects," "sales," or similar. There may also be lists for "lost deals," "churned," "onboarding," or "closed-won" that contain valuable outcome data.

**Step 4b — Map All Columns & Attributes:**
For each relevant list, use `list-list-attribute-definitions` to pull the complete set of columns/attributes. Paginate through ALL results (many CRMs have 20-40+ attributes per list, and the default page size is often 10). Keep pulling with increasing offset until you've seen every attribute.

Also pull the object-level attributes using `list-attribute-definitions` for the parent object (e.g., "companies" or "people"). These often contain critical fields like company size, industry, email addresses, and domains that don't appear on the list-level attributes.

Build a reference map of every available field — you'll use this throughout the analysis. Pay special attention to: stage/status fields (what are the possible values?), monetary fields (deal value, budget, forecast), date fields (created, stage change dates), and any custom fields the team uses for tracking deal progress.

**Step 4c — Pull Prospect Records & List Entries:**
For each prospect identified from the call list:
1. Search for the prospect in the CRM using `search-records` by name, email, or company domain
2. Save the record ID — you'll need it to look up list entries
3. Use `list-records-in-list` to find the prospect's entry in each relevant pipeline/list. Don't rely solely on filters — if a filter returns no results, try pulling a broader set and matching manually, since CRM data can be inconsistent (name variations, missing fields, etc.)
4. For each list entry found, pull ALL attribute values. This gives you the deal stage, value, dates, and any custom fields.

**Step 4d — Build the CRM Context Map:**
Compile a merged dataset per prospect containing: current pipeline stage, deal value (if any), all relevant dates (created, stage changes), budget/forecast fields, owner/assignee, and any notes or activity counts. This becomes the backbone for cross-referencing against transcript evidence.

If CRM access isn't available, rely on user-provided win/loss data.

### Step 5 — Pull Email Communications

Email data is often the most reliable source for verifying deal outcomes and understanding what happened between calls. Contracts get signed via email, proposals get sent via email, and "we've decided to go with someone else" arrives via email. Skipping this step means relying solely on CRM stages (which may be stale) and transcript inferences (which can be ambiguous).

**Step 5a — Search by Domain & Email:**
For each prospect/company identified from the calls:
1. Use `search-emails-by-metadata` with the company domain to find all email correspondence
2. Also search by specific participant email addresses from the call recordings
3. Cast a wide net on time range — emails about deal outcomes often come days or weeks after the last call

**Step 5b — Semantic Search for Deal Signals:**
Use `semantic-search-emails` with queries designed to surface deal-critical communications:
- "contract signed" or "agreement executed"
- "proposal" or "quote" or "pricing"
- "decided to go with" or "not moving forward"
- "onboarding" or "kickoff" or "implementation"
- The prospect's company name + "deal" or "close"

**Step 5c — Pull Full Email Content:**
For emails that look deal-relevant based on subject/snippet, use `get-email-content` to read the full body. Look for:
- Payment confirmations or invoice references (strongest signal of a closed-won deal)
- Signed contracts or DocuSign/PandaDoc completion emails
- Rejection or "going with a competitor" messages
- Follow-up scheduling or next-step confirmations
- Proposal or SOW attachments

**Step 5d — Build an Email Evidence Log:**
For each prospect, compile a timeline of email evidence alongside the call recordings. Note which emails provide definitive deal outcome evidence vs. which are ambiguous. This log feeds directly into the deal outcome verification in Phase 2.

If email tools aren't available, note this limitation and rely on CRM + transcript data for deal outcomes.

## Phase 2: Analysis

This is where the real value is created. The analysis must go beyond surface-level observation — it should feel like a seasoned sales coach watched every call.

### Deal Outcome Verification

Before grading anything, establish the ground truth on what actually happened with each deal. Wrong deal outcomes lead to wrong grades — if you think a deal was lost when it actually closed, the entire analysis of "what went wrong" becomes fiction.

Cross-reference at least three sources for each prospect's outcome:
1. **CRM stage data** — What does the pipeline say? But treat this as a starting point, not gospel. CRM stages can be stale (reps forget to update) or misleading (a deal marked "Negotiating" might have closed weeks ago).
2. **Email evidence** — Look for payment confirmations, signed contracts, rejection emails, or onboarding kickoffs. Email evidence is often the most reliable because it captures actual business transactions.
3. **Transcript signals** — What did the prospect say on the last call? "Let's do it" or "We need to think about it" or "We're going with [competitor]" are strong outcome indicators.
4. **User-provided data** — What does the user know about which deals closed?

When sources conflict, flag the discrepancy explicitly in the report. For example: "CRM shows 'Lost' but the last transcript has the prospect agreeing to move forward — this may need manual verification." Present any uncertain outcomes to the user for confirmation before finalizing the analysis.

### Per-Prospect Journey Mapping

For each prospect, build a complete picture:

1. **How many meetings** did the rep have with this prospect?
2. **What happened in each meeting?** First call = discovery? Second call = demo? Third = negotiation?
3. **What was the outcome?** Won, lost, stalled, or still active?
4. **What does the CRM show?** Stage progression, time in each stage, any notes from the rep
5. **What do the emails show?** Proposals sent, contracts exchanged, follow-up cadence
6. **Key moments** — The specific things the rep said or did (or didn't do) that influenced the outcome

### Grading Dimensions

Use the scoring framework from Phase 0. If no framework was specified, use this default set of dimensions. Each dimension should be graded on a letter scale (A+ through F) with supporting evidence from transcripts.

**Default dimensions:**

1. **Discovery & Qualification** — Does the rep uncover pain, budget, authority, timeline? Do they ask open-ended questions? Do they dig deeper or accept surface-level answers? Are they qualifying or just collecting information?

2. **Demo & Value Articulation** — Does the rep tailor the demo to the prospect's stated pain? Do they connect features to business outcomes? Or do they run the same generic demo every time?

3. **Objection Handling** — When the prospect pushes back (price, timing, competition, internal resistance), does the rep address it head-on with evidence? Do they acknowledge and redirect? Or do they fold/ignore?

4. **Pricing & Negotiation** — How does the rep introduce pricing? Do they anchor high? Do they give away discounts unprompted? Do they tie price to value? How do they handle "that's too expensive"?

5. **Closing Technique** — Does the rep actually ask for the business? Do they use trial closes throughout? Do they create next steps with specific dates and commitments? Or do conversations just... end?

6. **Urgency & Scarcity Creation** — Does the rep create legitimate reasons to act now? End-of-month incentives, implementation timelines, competitive pressure? Or is there no urgency at all?

7. **Follow-up & Next Steps** — Does the rep set concrete next steps on every call? Calendar invites sent live? Clear action items for both sides? Or vague "I'll send you some info"?

8. **Adaptability & Rapport** — Does the rep read the room? Do they adjust their approach for technical vs. business buyers? Do they handle unexpected situations well?

9. **Case Study & Social Proof Usage** — Does the rep reference relevant customer stories? Do the examples match the prospect's industry/size/pain?

10. **Multi-stakeholder Management** — When multiple decision-makers are on the call, does the rep engage all of them? Do they identify the champion vs. the blocker?

### Evidence Standards

Every grade must be backed by specific transcript evidence. The standard:

- **For each dimension:** At least 2-3 real quotes from different calls that illustrate the grade
- **Show both sides:** If the grade is B-, show what the rep does well AND where they fall short
- **Quantify when possible:** "Used trial closes on 7 of 12 calls" is better than "sometimes uses trial closes"
- **Avoid generic praise or criticism:** "Good job on discovery" is useless. "Asked 4 probing follow-up questions about budget authority on the Boostability call, including 'Who else needs to sign off on this?'" is useful.
- **Quotes must come from actual transcripts:** Every quoted phrase in the report should be something the rep or prospect actually said, pulled from the full transcript data. If you only have summary-level data for a call, do not fabricate quotes — instead, describe what the summary indicates and note the limitation.

### Won vs. Lost Deal Pattern Analysis

After grading individual dimensions, look for patterns:

- What does the rep consistently do on calls that close?
- What's missing on calls that don't close?
- Are there specific moments where deals turn (for better or worse)?
- Is there a prospect profile that the rep converts well vs. poorly?

## Phase 3: Report Generation

Generate a professional .docx report using the `docx` npm package. Read the docx skill for document formatting best practices if available.

The report should follow this structure:

### Report Structure

1. **Title Page** — Rep name, analysis period, date, number of calls analyzed
2. **Executive Summary** — Overall grade, 3 key strengths, 3 key improvement areas, close rate
3. **Performance Scorecard** — Table with all dimensions, letter grades, and one-line summaries
4. **Detailed Analysis by Dimension** — Each dimension gets its own section with:
   - Grade and one-line verdict
   - What the rep does well (with quotes)
   - Where the rep falls short (with quotes)
   - Specific coaching recommendation
5. **Prospect Journey Analysis** — Per-prospect breakdown showing meeting arc, outcome, and key moments
6. **Confirmed Deal Outcomes** — Table showing all prospects with their status (Won/Lost/Open) and evidence source (CRM, email, user-provided, or combination). Include a confidence level for each outcome.
7. **Won vs. Lost Patterns** — Side-by-side comparison of what happens on winning vs. losing calls
8. **Coaching Playbook** — Top 5 prioritized recommendations with specific examples of what to do differently, ranked by expected impact on close rate
9. **Methodology** — Data sources, number of transcripts analyzed, any limitations (rate-limited calls, missing CRM data, summary-only calls, etc.)

### Formatting Standards

- Use a professional color palette (navy headers, clean borders, alternating row shading)
- Grade colors: A-range = green, B-range = blue, C-range = amber, D-range and below = red
- Transcript quotes should be in italics with the prospect name and call date attributed
- Tables for the scorecard and deal outcomes
- Clear section breaks between major sections

## Important Principles

**Full transcripts, not summaries.** This is the single most important data quality decision in the entire workflow. Summaries lose the nuance — the exact words a prospect uses when they're about to close, the silence after a pricing reveal, the specific objection that went unaddressed, the way a rep introduces pricing. A summary that says "discussed pricing and next steps" tells you almost nothing about whether the rep handled that moment well. The full transcript of that same moment might reveal the rep said "our price is $500/month but we can do a discount" (anchoring low and volunteering a discount unprompted) vs. "based on the ROI we just discussed, most teams at your stage invest $500-800/month" (anchoring to value). That distinction is the difference between a C and an A in pricing technique — and it's invisible in summaries.

**Understand the CRM before querying it.** Every CRM is structured differently. Before pulling a single prospect record, map out the available lists, pipelines, and columns. A 5-minute discovery step prevents the entire analysis from missing critical data — like deal values sitting in a custom "Contract Amount" field instead of the default "Value" field, or deal outcomes living in a separate "Closed Deals" list rather than a stage on the main pipeline. Paginate through all attribute definitions; don't stop at the first page.

**Verify deal outcomes from multiple sources.** No single data source is reliable enough on its own. CRM stages go stale. Transcript inferences can be ambiguous ("we'll move forward" doesn't always mean the deal closed). Email evidence — payment confirmations, signed contracts, rejection notices — is often the strongest signal. When sources conflict, flag the discrepancy rather than guessing. Present uncertain outcomes to the user for confirmation.

**Evidence over opinion.** Every claim in the report should be traceable to a specific call or CRM record. "The rep struggles with urgency" is an opinion. "In 8 of 12 calls, the rep ended without establishing a timeline or reason to act. For example, on the Bettercommerce call (Jan 15), the prospect said 'we'll think about it' and the rep responded 'sounds good, take your time' instead of proposing a specific next step" is evidence.

**Context matters.** A 14% close rate on enterprise deals is different from 14% on SMB leads. A rep who closes 10/69 calls in their first quarter selling a new product is performing differently than one selling an established product. The ICP, product maturity, and market all factor into fair grading.

**Be constructive, not punitive.** The goal is to help the rep improve, not to prove they're bad. Frame weaknesses as opportunities with specific, actionable advice. "Instead of X, try Y — here's an example of when something similar worked on the Boostability call."

**Don't silently skip data sources.** If email tools, CRM tools, or full transcripts aren't available, explicitly note what's missing in the methodology section and how it limits the analysis. The user deserves to know what the report is based on and what it's missing.
