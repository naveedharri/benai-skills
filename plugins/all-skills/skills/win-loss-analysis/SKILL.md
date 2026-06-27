---
name: win-loss-analysis
description: Win/loss pattern analysis for B2B sales. Pulls deal data from ANY CRM (Attio, HubSpot, Salesforce, Pipedrive, etc.), enriches with emails, call transcripts (Fireflies/Gong), and web research, then analyzes won vs lost deal patterns to build an ideal prospect persona and strategy recommendations as a .docx report.
  MANDATORY TRIGGERS: "win/loss analysis", "won vs lost", "deal analysis", "sales patterns", "pipeline analysis", "prospect persona", "ICP from deals", "why deals are lost", "deal patterns", "lost deal analysis", "winning persona", "deal forensics", "pipeline forensics", "sales retrospective", "analyze my pipeline", "what's working in sales", or any request about understanding close/win vs loss patterns, what makes deals close, or building an ICP from historical deal data.
---

# Win/Loss Pattern Analysis

Build a data-driven understanding of why deals close and why they don't, then deliver a comprehensive persona and strategy document as a professional .docx report.

**The report includes:** Executive summary with metrics, won/lost case studies with evidence from calls and emails, side-by-side pattern comparison, a complete winning prospect persona, red flags and disqualification criteria, strategic recommendations, and data appendix.

## Phase 0: Discovery Questions

Use `AskUserQuestion` (3-4 questions max) to gather:

1. **CRM & Pipeline**: Which CRM, and the pipeline/list name containing deals?
2. **Stage Labels**: Exact names for Won and Lost stages (e.g., "Delivered"/"Lost", "Closed Won"/"Closed Lost")
3. **Business Context**: 2-3 sentences on what the company sells and to whom
4. **Output Preferences**: Full analysis or specific questions to answer?

Confirm understanding in one sentence before proceeding.

## Phase 1: CRM Data Extraction

**Goal**: Clean Won and Lost deal lists with contact details, minimizing API calls.

### Strategy

1. **Filter at API level** — only request Won/Lost stage records, never pull all then filter locally
2. **Request only needed fields** — name, email, company/domain, deal size, priority, source, close date
3. **Read CRM-specific reference** — check available MCP tools, then read the appropriate file:
   - Attio → `references/crm-attio.md` | HubSpot → `references/crm-hubspot.md` | Salesforce → `references/crm-salesforce.md` | Other → `references/crm-generic.md`

### Steps

1. Discover pipeline structure (list attributes, stage IDs, custom fields)
2. Pull Won deals filtered by stage
3. Pull Lost deals filtered by stage
4. Filter out personal email domains (`gmail.com`, `yahoo.com`, `hotmail.com`, `outlook.com`, `icloud.com`, `googlemail.com`, `aol.com`, `protonmail.com`, `live.com`, `me.com`, `mail.com`, `yandex.com`, `zoho.com`, `gmx.com`, `fastmail.com`). Keep a count of filtered leads for the report.
5. Organize into two clean lists with counts

**CRITICAL — Save extracted data to files immediately:**
```
analysis_summary.json    # Counts, value distributions, aggregate stats
won_deals.json           # Full won deal list
lost_deals.json          # Full lost deal list
domain_analysis.json     # Business vs personal email breakdown
```
This prevents data loss if enrichment phases hit errors or context limits. Never rely on holding all data in conversation context alone.

**CRITICAL — Validate CRM field reliability:**
After initial extraction, check which CRM fields actually contain useful data vs. being mostly empty. Fields like `lost_reason`, `agency`, `requirement`, `source`, and other custom fields are **frequently empty or unreliable** (e.g., 126/131 lost deals having "None" as lost reason is common). Before relying on any field for analysis:
- Count how many records have non-empty values for each field
- If a field is <30% populated, flag it as unreliable — don't use it as a primary analysis dimension
- Tell the user which fields have reliable data and which don't, ask if any you're unsure about are actually maintained
- Derive insights from enrichment data (transcripts, emails, web research) instead of empty CRM fields

A healthy analysis needs 15-20+ leads per bucket. If thin, discuss including personal-email leads or widening date range.

## Phase 2: Multi-Source Enrichment

Raw CRM data tells you WHAT happened; enrichment tells you WHY. **Complete ALL enrichment BEFORE building the report.** Run streams in parallel using sub-agents where possible.

### Stream A: Email Analysis (Two-Step Process)

**Step 1 — Metadata search**: Find emails involving top leads by deal size (10-15 per bucket). Use `search-emails-by-metadata` (Attio), engagement APIs (HubSpot), or activity records (Salesforce).

**Step 2 — Read actual content**: Metadata only gives subject lines and timestamps. You MUST read the actual email body using `get-email-content` (Attio) or equivalent to extract: objections raised, pricing discussions, competitive mentions, enthusiasm/hesitation signals, specific questions asked.

**What to capture per lead**: Email count, date range, key content themes, standout quotes, response patterns.

### Stream B: External Company Research

For top 10-15 leads per bucket, quick web research via `WebSearch`/`WebFetch`: company size, industry, tech stack, growth signals. 2-3 minutes per company max — focus on cohort patterns.

### Stream C: Call Transcript Analysis

**Search ALL available transcript tools** — don't stop at one source:
- Fireflies: `fireflies_search`, `fireflies_get_transcript`, `fireflies_get_summary`
- Attio: `search-call-recordings-by-metadata`, `semantic-search-call-recordings`, `get-call-recording`
- Gong: Gong MCP search tools

**Fireflies search strategy**: Use targeted queries — search by company name, contact name, or domain individually. Broad keyword searches return massive result sets that overflow context. Example: search "Boostability" not "SEO demo call".

**What to extract**: Number of calls, call progression arc, pain points (concrete vs vague), buying signals, objections, who attended, prospect's stated intent. Capture direct quotes for the report.

### Enrichment Priority & Execution

1. Top 5 Won by deal size → all three streams (deep)
2. Top 5 Lost by deal size → all three streams (deep)
3. Next 10 Won → email + transcripts
4. Next 10 Lost → email + transcripts
5. Remaining → CRM data only for aggregate stats

**Save enrichment results to files** as you go: `email_content_analysis.json`, `won_transcripts_analysis.json`, `lost_transcripts_analysis.json`, `fireflies_meeting_map.json`. This protects against context loss and lets you reference exact data during report generation.

Use sub-agents (Task tool) to parallelize: one for Won enrichment, one for Lost enrichment, web research concurrent with email/transcript lookups.

## Phase 3: Pattern Analysis

Compare Won vs Lost across 6 dimensions. For each, document the pattern, the contrast, supporting evidence (specific leads, quotes), and confidence level.

1. **Prospect Profile**: Role/title, company type/size, industry vertical, geographic market
2. **Technical Fit**: Tech stack, integration complexity, existing process maturity
3. **Buying Behavior**: Number of calls, call progression, decision authority, team involvement, time to close
4. **Motivation & Intent**: Pain specificity, growth targets, use case (reseller/white-label vs internal), urgency
5. **Deal Dynamics**: Deal size sweet spot, source/channel effectiveness, sales cycle length
6. **Objections & Red Flags**: Objections overcome in wins, fatal objections in losses, early warning signals

**For lost deal reasons**: Don't rely on the CRM lost_reason field — it's almost always empty. Instead, categorize losses from enrichment evidence (transcripts, emails, web research) into archetypes like: Went Cold, Enterprise Procurement Complexity, Product Quality Issues, Pricing/Cost, Competitive/Build Own, Poor Product Fit.

## Phase 4: Persona Construction

Synthesize findings into an actionable winning persona:

**Persona Card**: Title/role, company type, size/revenue range, current pain, primary intent, technical profile, buying behavior, geographic focus, deal size sweet spot, key buying signals, red flags.

**What They Say**: 4-6 actual quotes or paraphrased themes from transcripts that winning prospects consistently express.

**Disqualification Criteria**: 5-8 specific, observable red flags tied to evidence from lost deal analysis.

**Strategic Recommendations**: 8-12 actionable recommendations across sales process, targeting/messaging, and pipeline hygiene.

## Phase 5: Chart Generation

Generate professional PNG charts using the included `scripts/generate_charts.py` (matplotlib, JSON config → 300 DPI PNGs). Supported types: `metric_cards`, `donut`, `grouped_bar`, `horizontal_bar`, `stacked_bar`.

### Setup
```bash
pip install matplotlib --break-system-packages -q 2>/dev/null || pip install matplotlib -q
```

### Mandatory Charts

Build `charts_config.json` with these (replace placeholder values with actual data):

1. **Key Metrics** (`metric_cards`): Won count, Lost count, Avg Won Deal size, Win Rate
2. **Deal Size Distribution** (`grouped_bar`): Won vs Lost by value ranges
3. **Lost Deal Reasons** (`donut`): Evidence-based categories from enrichment (NOT from empty CRM field)
4. **Geographic Distribution** (`grouped_bar`): Won vs Lost by region
5. **Top Industries Won** (`horizontal_bar`, green): Where you win most
6. **Top Industries Lost** (`horizontal_bar`, red): Where you lose most
7. **Engagement Depth** (`horizontal_bar`): Avg meeting duration, questions per meeting, calls per deal, email touches — derived from transcript/email enrichment
8. **Key Differentiators** (`horizontal_bar`): % of won deals showing each winning trait

**Optional**: Lead source distribution, sales cycle comparison, priority distribution.

### Run
```bash
python <skill_path>/scripts/generate_charts.py --config charts_config.json --output-dir ./charts
```

### Colors & Sizes

Colors: Green `#4CAF50` (Won) | Red `#E53935` (Lost) | Navy `#1B3A5C` (headers) | Teal `#2E86AB` (accents) | Orange `#FF9800` | Purple `#7E57C2`

Chart sizes for docx (width x height points): Metric cards `600x180` | Donut `500x360` | Grouped bar `560x380` | Horizontal bar `560x280` (+45 per extra bar)

## Phase 6: Document Generation

Read the `docx` skill (SKILL.md) for docx-js technical instructions. Embed charts using `ImageRun`:

```javascript
const chartBuffer = fs.readFileSync('./charts/metrics_summary.png');
new Paragraph({
  children: [new ImageRun({ data: chartBuffer, transformation: { width: 600, height: 180 }, type: 'png' })],
  spacing: { before: 200, after: 200 },
  alignment: AlignmentType.CENTER,
})
```

### Document Structure

1. Title Page (report name, date, data sources, methodology)
2. Executive Summary + metrics_summary.png + key metrics table
3. Won Deals Analysis + won_industries.png + case studies with transcript quotes
4. Lost Deals Analysis + lost_industries.png + lost_reasons.png + case studies with evidence + loss archetypes
5. Pattern Analysis + geo_distribution.png + deal_size_ranges.png + engagement_comparison.png + comparison table
6. The Winning Persona (persona card, buying signals, red flags)
7. Strategic Recommendations
8. Appendix (data summaries, distributions)

### Design

- Navy headers, teal accents, green for Won data, red for Lost data
- Alternate row shading, charts followed by 1-2 paragraphs of interpretation
- Every claim references specific leads, transcript quotes, or email evidence
- Include direct quotes from transcripts in formatted quote blocks

Save to outputs directory. Offer executive summary as separate doc if report is lengthy.

## Performance Notes

1. **Filter at API level** — never pull all records then filter locally
2. **Batch record lookups** — groups of 20-50 per call
3. **Parallelize enrichment** — email, web, transcripts are independent streams
4. **Prioritize by deal size** — highest-value deals get deepest enrichment
5. **Save intermediate files** — extracted data, enrichment results, analysis summaries. Single most important practice for resilience against context limits and errors.
6. **Adapt to missing data** — no transcripts? lean on emails. No emails? lean on CRM notes + transcripts. Thin data (<15 per bucket)? discuss with user.
