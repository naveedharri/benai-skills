# Phase 0: Context Questions

Question scripts for gathering context before any data is pulled. Use `AskUserQuestion` to collect the information needed to do this right. Missing any of these leads to a shallow analysis. Combine into 2-3 AskUserQuestion calls (max 4 questions per call).

## Round 1, Business Context

**Question 1, The Business:**
"Tell me a bit about your business: What do you sell, who's your ideal customer (ICP), and what does a sales-qualified meeting look like for you?"
- This grounds the entire analysis. Without knowing the product and ICP, you can't assess whether the rep is asking the right discovery questions or pitching the right value props.

**Question 2, The Rep & Targets:**
"Who is the sales rep being analyzed? What are their targets or quotas (e.g., deals per month, revenue targets, meeting-to-close ratio)? If you don't have formal targets, that's fine, just let me know."
- Targets give the grades context. A 14% close rate might be excellent for enterprise SaaS but poor for SMB.

## Round 2, Data Sources & Scope

**Question 3, Call Selection:**
"Do you want me to analyze ALL of this rep's sales calls, or a specific set? If specific, which ones?"
- Options: "All calls" (then present a list for approval), "Calls from a date range", "Specific calls I'll name"
- If the user says "all," pull the full list from the transcription tool and present it for the user to approve/prune before doing deep analysis.

**Question 4, Deal Outcomes:**
"How should I determine which deals were won vs. lost? Options: (a) You tell me manually which prospects closed, (b) I cross-check against your CRM automatically, or (c) Both, you tell me what you know and I verify against CRM."
- This was a key gap in previous workflows. The outcome data fundamentally changes the analysis, a rep who closes 10/69 calls gets graded very differently than one who closes 1/69.

## Round 3, Scoring & CRM

**Question 5, Scoring Framework:**
"Do you have your own scoring framework for evaluating sales calls, or would you like to use an established one? Common options include BANT (Budget, Authority, Need, Timeline), MEDDIC (Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion), or a custom framework I can build based on your sales process."
- If the user picks a standard framework, use it as the backbone of the grading dimensions. If custom, ask follow-up questions to understand what matters most.

**Question 6, CRM Access:**
"Which CRM are you using (Attio, HubSpot, Salesforce, Pipedrive, etc.)? I'll cross-reference deal stages, contact records, and activity history with the call transcripts."
- Check available MCP tools to confirm you can actually connect. If the CRM isn't available, note this limitation and rely on user-provided outcome data.

## Checkpoint

After collecting all answers, summarize your understanding back to the user in a few sentences and get confirmation before pulling any data.
