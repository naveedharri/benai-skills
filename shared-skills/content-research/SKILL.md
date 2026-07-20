---
name: content-research
description: "Research any topic end to end and get back a fact-checked, branded HTML report plus an agent-readable markdown brief. Use when the user wants to research a topic, do a deep dive, build a research report or briefing, gather evidence before writing a piece of content, understand 'what does the research say / what are people saying about X', or study a subject across papers, forums, YouTube, and vendor/web sources. Fans out parallel sub-agents (one per source type), verifies every hard claim with the fact-checker, synthesizes one sourced markdown brief, renders it as a branded report, and deploys it live. Connector-adaptive: uses Firecrawl, Apify, a scholarly/PubMed MCP, YouTube/vidIQ, and Reddit where available, and falls back to web search, web fetch, and browser-use where they are not. Trigger on 'research this topic', 'topic research', 'do a deep dive on', 'build me a research report', 'what does the evidence say about', or 'research X before I write about it'."
disable-model-invocation: true
---

# Topic Research

Turns a topic into a rigorous, sourced, fact-checked report. Two artifacts come out every time: a **markdown brief** (agent-readable, the handoff to a content-writer skill) and a **branded HTML report** (human-facing, deployable). The workflow is: interview the user so the research is targeted, fan out parallel research sub-agents across source types, verify every hard claim, synthesize to markdown, render to HTML, deploy.

> [!important] The two rules that make this good
> 1. **Targeted, not generic.** The Phase 0 Q&A shapes every sub-agent. Research aimed at a purpose beats a topic dump every time.
> 2. **Verify before you publish.** No hard number reaches the report without a fact-check verdict and a caveat. Fact and opinion stay visibly separate.

---

## Phase 0: Targeted Q&A + capability probe

Do both before any research runs. Ask conversationally, one thing at a time, adapting to answers.

### A. Targeted Q&A (this shapes the whole run)
1. **Topic**, and what they already believe or suspect about it.
2. **Purpose**: is this to write a specific piece of content (which format? which audience?), to make a decision, to brief a team, to prep for a talk? A content purpose changes what the report emphasizes and how the markdown is structured downstream.
3. **Angle / biases / skepticism to reflect**: a point of view they want the research to support or pressure-test, claims they are suspicious of, hot takes to stress-test. These become explicit search directives for the sub-agents. If they have none, the research stays neutral and simply reports the tension it finds.
4. **Depth**: Quick / Standard / Deep (see below).
5. **Output**: report + markdown always; deploy target is a Claude live artifact (instant, no infra) or Vercel (stable custom URL). Ask which.
6. **Brand**: default to the neo-brutalist "Signal Report" look in `assets/report-template.html`. If they have a brand (site, design system, colors/fonts/logo), extract and restyle; the CSS is token-driven at the top of the template.

Capture the answers in a short `brief-config` (topic, purpose, audience, directives, depth, deploy, brand) that you carry through every phase.

### B. Capability probe
Detect which connectors are available (see `references/connectors.md` for the exact checks and how to connect each):
Firecrawl, Apify, a scholarly/PubMed MCP, YouTube MCP / vidIQ, Reddit MCP, browser-harness, and the Vercel deploy path.

Show the user the research plan you will run given what is connected, then **offer to connect the high-value missing ones** (Firecrawl and Apify are the biggest upgrades; PubMed only matters for medical topics). If they decline, name the fallback each stream will use and continue. Never hard-fail for a missing connector; degrade.

### Depth control (user preference + topic-aware)
- **Quick**: 2-3 streams, shallow read, ~1 fact-check pass. For fast-moving or lightly-researched topics.
- **Standard**: all 4 streams, ~15 sources, full fact-check. The default.
- **Deep**: all 4 streams with more agents per stream, wider reading, adversarial fact-check (multiple verifiers per claim).
- **Auto-downshift**: if a topic has little scholarly literature (true for most marketing topics), lighten or skip the scholarly stream rather than padding it, and say so. Do not fake depth.

---

## Phase 1: Parallel research fan-out

Launch **one sub-agent per source type, concurrently** (send them in a single batch). Give each the topic + purpose + the user's angle/biases as explicit directives. Each returns structured markdown: findings (one source URL each), a "hard claims to verify" list, and vendor/anecdotal claims flagged. Full parameterized prompts are in `references/research-agents.md`.

| Stream | Job | Primary connector | Fallback ladder |
|---|---|---|---|
| **Scholarly / evidence** | Credible papers, studies, citations only. Domain-aware: medical → PubMed/PMC (+ bioRxiv/medRxiv, ClinicalTrials); AI/CS → arXiv; general → Semantic Scholar / Scholar | Scholarly/PubMed MCP + Firecrawl paper index | web search on journal / `.edu` / `.gov` domains → browser-use |
| **Forums / community** | Real language, pain points, firsthand results (anecdotal), objections | Apify Reddit scraper | Reddit MCP → web search `site:reddit.com` + fetch → browser-use |
| **Web / vendor** | Vendor docs, industry data, reputable blogs, the tool/landscape | Firecrawl search + scrape | web search + web fetch → browser-use for JS-heavy pages |
| **Creators / video** | What top creators teach; recurring tactics + contrarian takes | YouTube MCP + vidIQ + transcripts (yt-dlp / `watch`) | Apify YouTube scraper → web search for summaries |

Keep per-stream reading within the depth budget and have each agent `log`/report anything it deliberately skipped. No silent truncation.

---

## Phase 2: Fact-check pass

Collect every "hard claim" from all streams, dedupe, and verify with the **`fact-checker` skill** (Standard: one pass; Deep: multiple independent verifiers per claim, kill on majority-refute). Each claim gets a verdict (**VERIFIED / PARTIAL / PROJECTION / VENDOR-CLAIM / ANECDOTAL / FALSE**), a primary source, and a one-line caveat. Apply corrections to the synthesis. A caught correction is a feature: surface it in the ledger.

Never fact-check firsthand forum anecdotes as fact; they are sentiment and stay labelled as such.

---

## Phase 3: Synthesize to the markdown brief

Merge the four streams + verdicts into one structured markdown brief using `references/brief-template.md`: TL;DR, headline stats, verified evidence, a "what the evidence says" / playbook section (tag each point with how many source types corroborate it), the counter-narrative / skepticism, a tool-or-landscape section where relevant, voice-of-market language, the **claims-verified ledger**, and grouped sources. Keep fact and opinion visibly separate, and reflect the user's stated angle honestly (support it where the evidence does, push back where it doesn't).

> [!important] The markdown is the point, not a waypoint
> Produce the markdown **before** the HTML and always keep it. It is the agent-readable handoff: the next skill in the chain (a brand-voice content writer) consumes this exact file to write the piece. HTML is the human render; markdown is the machine brief. Save it as `<topic-slug>-brief.md` in the working folder.

---

## Phase 4: Render to the branded HTML report

Adapt `assets/report-template.html` (a complete worked example, the GEO/AEO "Signal Report"). **Keep the `<style>` block and the component patterns** (KPI cards, evidence cards, playbook cards, skeptic quote blocks, the tool table, the claims-ledger rows, grouped sources) and **swap in the new topic's content** from the markdown brief. Restyle the CSS tokens + brand-badge text if the user gave a brand. The file must stay self-contained (no external assets except the Google Fonts link already in the template). Verify it renders (open it, check computed styles / console) before deploying.

---

## Phase 5: Deploy and deliver

Deploying makes the report public, so confirm first: show the user the rendered report and the fact-check ledger, and get an explicit go-ahead before deploying. If they want changes, revise and re-confirm.

Deploy to the target chosen at intake (see `references/connectors.md` for both paths):
- **Claude live artifact**: instant, no infrastructure, good default for one-off research.
- **Vercel**: stable custom URL. Locally the CLI is fine; from a cloud routine, **git push is the deploy** (never the Vercel CLI/API).

Save the markdown + HTML locally, return the live URL, and tell the user the markdown path plus the one line that matters: *this brief can feed straight into a content-writer skill to draft the piece.*

---

## Principles (baked into every run)
- Connector-adaptive with graceful degradation and ask-to-connect. Never hard-fail.
- Every claim carries a source. Verify hard numbers before publishing. Label vendor / anecdotal / projection.
- Triangulate across source types and show the corroboration count. One source alone lies.
- Cap depth for cost; log anything skipped.
- Targeted beats generic: the Q&A directives ride along into every sub-agent.
- Two artifacts, always: markdown brief (handoff) + HTML report (render).

## Reference files
- `references/research-agents.md`: the parameterized sub-agent prompts (4 research streams + fact-check).
- `references/connectors.md`: capability probe, how to connect each source, fallback ladders, and both deploy paths.
- `references/brief-template.md`: the markdown brief skeleton (the handoff artifact structure).
- `assets/report-template.html`: the branded "Signal Report" HTML, a complete worked example to adapt.

## Self-improvement
This skill is never finished. Improve it as you use it.
- When the user corrects how a step was done, update the relevant reference file (`research-agents.md`, `connectors.md`, or `brief-template.md`) or this SKILL.md so the correction sticks. Do not just fix it for this run.
- When a correction is a hard rule ("always X", "never Y"), add it as a permanent rule here.
- When the user says a brief or report was genuinely good, save it to `references/examples/` so it becomes a model for future runs.
- Keep the skill small: when you add something, run the deletion test and cut anything that no longer changes behavior.
