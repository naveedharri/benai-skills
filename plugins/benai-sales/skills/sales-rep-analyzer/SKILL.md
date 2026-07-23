---
name: sales-rep-analyzer
description: Analyze sales call recordings and transcripts to grade rep performance across discovery, demo, objection handling, rapport, and close, each grade backed by verbatim quotes from the full transcript, with coaching on what to improve. Produces evidence-based scorecards and improvement plans, never opinions without quotes. Use when the user says "score my sales call", "analyze my call with [name]", "how did I do on that call", "grade my discovery calls", "sales call scoring", or wants rep performance reviewed from real call transcripts.
disable-model-invocation: true
---

# Sales Rep Performance Analyzer

Analyze a sales rep's call recordings alongside CRM data to produce a comprehensive, evidence-backed performance report with grades, real transcript quotes, and actionable coaching recommendations. The output is a single, self-contained HTML dashboard in the BenAI neo-brutalist design system (embedded instant-ui guides), published to a shareable URL. It reads like something a VP of Sales would write after shadowing the rep for a month, grounded in evidence, not generic advice.

## Phase 0: Gather Context

Use `AskUserQuestion` before pulling any data. Question scripts and rationale: `references/context-questions.md`. Combine into 2-3 calls (max 4 questions per call):

1. **Round 1, business context**: the business/ICP/sales-qualified meeting, and the rep + their targets.
2. **Round 2, data sources and scope**: which calls to analyze (all / date range / specific), and how to determine won vs. lost deals (user-provided, CRM cross-check, or both).
3. **Round 3, scoring and CRM**: scoring framework (BANT, MEDDIC, custom, or default), and which CRM to cross-reference.

**Checkpoint:** summarize your understanding back to the user in a few sentences and get confirmation before pulling any data.

## Phase 1: Data Collection

Follow `references/data-collection.md` for the full procedure per step:

1. **Identify the transcription source.** Fireflies, Attio call recordings, or similar MCP tools. If none is connected, stop and ask the user to connect one.
2. **Pull the call list** per the user's scope, and present it for approval/pruning before deep analysis.
3. **Pull full transcripts, NOT summaries.** The single most important data quality rule in this skill. Verify each transcript contains speaker-attributed dialogue; never silently fall back to summaries. If more than 10 calls, use parallel Task subagents in batches of ~10-15.
4. **Discover CRM structure, then pull CRM data** (if the user opted in): map every list, pipeline, and attribute first (paginate through ALL of them), then pull prospect records and build a per-prospect CRM context map.
5. **Pull email communications** per prospect (metadata + semantic search + full bodies) and build an email evidence log for deal outcome verification.

If any data source is unavailable, never skip it silently: note the limitation for the report's methodology section.

## Phase 2: Analysis

Follow `references/analysis-standards.md` for the full standards. The analysis should feel like a seasoned sales coach watched every call:

1. **Verify deal outcomes first.** Cross-reference CRM stage, email evidence, transcript signals, and user-provided data. Flag conflicts explicitly and confirm uncertain outcomes with the user before finalizing.
2. **Map each prospect's journey**: meeting count, what happened in each, outcome, CRM stage progression, email trail, key moments.
3. **Grade the dimensions** on a letter scale (A+ through F). Use the framework chosen in Phase 0; `references/scoring-frameworks.md` maps BANT / MEDDIC / SPIN / Challenger / custom to grading criteria. If none was chosen, use the 10 default dimensions in `references/analysis-standards.md`.
4. **Meet the evidence standards**: 2-3 real quotes per dimension from different calls, both sides shown, quantified where possible, quotes never fabricated.
5. **Analyze won vs. lost patterns** across the calls.

## Phase 3: Report Generation, Instant UI Dashboard

Build the dashboard per `references/report-dashboard.md`, which holds the non-negotiables (locked from user feedback), the letter-to-score mapping, the 10-section structure, and the formatting standards:

1. Load the embedded instant-ui guides in `references/instant-ui/` and follow them fully (design tokens verbatim, page shell, components, build rules, after-build checklist).
2. Apply the three non-negotiables: overall grade medallion visible at the very top, more numbers less prose, and a "Grades at a Glance" bar plot of every metric against its grade.
3. Save to `~/Desktop/builds/benai/[rep]-[topic]-[date].html`, then publish with the Artifact tool for a shareable URL. Only produce a .docx if the user explicitly asks for one.

## Hard Rules

Full text of each rule lives in the reference file for the phase it governs:

- Full transcripts, not summaries, always (`references/data-collection.md`).
- Understand the CRM structure before querying it; paginate through all attribute definitions (`references/data-collection.md`).
- Don't silently skip data sources; report gaps in the methodology section (`references/data-collection.md`).
- Verify deal outcomes from multiple sources; flag conflicts, never guess (`references/analysis-standards.md`).
- Evidence over opinion: every claim traceable to a specific call or CRM record (`references/analysis-standards.md`).
- Context matters: grade against the ICP, targets, and product maturity from Phase 0 (`references/analysis-standards.md`).
- Be constructive, not punitive (`references/analysis-standards.md`).

## Self-improvement

This skill is never finished. Improve it as you use it.

- When the user corrects how a step was done, update the relevant reference file (or this SKILL.md) so the correction sticks. Do not just fix it for this run.
- When a correction is a hard rule ("always do X", "never do Y"), add it as a permanent rule here.
- When the user says an output was genuinely good, save it to `references/examples/` so it becomes a model for future runs.
- Keep the skill small while you do this: when you add something, run the deletion test and cut anything that no longer changes behavior.
