---
name: customer-intelligence-report
description: Analyze Fireflies meetings and Circle community posts, for one person, a team, or everything, then produce a weekly or daily Customer Intelligence Report as a polished soft-UI HTML dashboard. Surfaces recurring themes across a trailing window, pain points, technical patterns, and stuck members needing follow-up, each backed by verbatim quotes. Blends both connectors, degrades gracefully if one is down, stores no secrets. Fully data-driven and customizable: sources, sections, scope, cadence, and recurring window are all configurable. Use when the user says "customer intelligence report", "community pulse", "analyze our meetings", "weekly community report", "what themes came up in calls", "who is stuck", "Fireflies report", "Circle report", or "meeting intelligence".
disable-model-invocation: true
---

# Customer Intelligence Report

Turn a period of Fireflies meetings and Circle community posts into a recurring intelligence
report: what themes keep coming up, where people are in pain, which technical patterns recur,
and who is stuck. The deliverable is a soft-UI HTML dashboard rendered from a data file, so
it is customizable and never static (see `references/report-config.md`).

**Secrets:** the Circle and Fireflies connectors authenticate through the MCP connection.
Never put an API key, token, space id, or email into the skill as a hardcoded secret, all
targeting values come from the run config. If you add publishing, use an env-var token and a
gitignored deploy dir (see `report-config.md`, Secrets and safety).

## Steps

Track progress:

```
Task Progress:
- [ ] 1. Scope: confirm scope, cadence, sections (checkpoint)
- [ ] 2. Collect: pull the period from Fireflies and Circle
- [ ] 3. Analyze: cluster transcripts into themes
- [ ] 4. Assemble: build the WEEKS + LEXICON data
- [ ] 5. Build: render the soft-UI dashboard
```

### 1. Scope (checkpoint, before any heavy pull)
Confirm the run with the user. Present the options and wait for a pick, do not assume.
Read `references/report-config.md` for the choices. Confirm: sources (Fireflies, Circle, or
both, plus their targeting: organizer emails and Circle space ids), scope
(all / person / team), cadence (weekly / daily / custom), the trailing recurring window, and
which sections to include. Offer the default section catalog plus 3 to 5 optional sections
so they can shape it. Targeting values are config, never hardcoded secrets.

### 2. Collect
Pull the period from the configured sources. Both are optional and degrade gracefully: if
one errors, continue with the other and note the outage.
- Fireflies meetings: read `references/fireflies-guide.md`.
- Circle posts: read `references/circle-guide.md`.
List meetings and posts first and report the counts to the user, then fan the transcript and
post reading out to subagents that return small structured notes.

### 3. Analyze
Cluster the notes into themes. Read `references/analysis-framework.md`. Assign each theme a
section, canonicalize its id against the LEXICON, compute counts, streak, and resolved, and
detect stuck members. Every theme needs a real verbatim quote or it is cut.

### 4. Assemble
Shape the analysis into the data contract. Read `references/data-schema.md`. Produce valid
JSON for `WEEKS` (append this period to prior periods if they exist) and update `LEXICON`
with any new phrasings. Present a short chat summary of the top themes and stuck members.

### 5. Build the dashboard
Render the report. Load the soft-UI aesthetic first: call the `soft-ui` skill and follow its
design directives, then read `references/dashboard-template.html`, set the config constants
and `SECTIONS`, paste in the `WEEKS` and `LEXICON` JSON, and write the filled file to
`customer-intelligence-report-YYYY-MM-DD.html` in the working directory. The dashboard must
be self-contained and offline. No em dashes in the rendered copy. Never invent a number or
quote, every figure traces to a real Fireflies or Circle result.

## Self-improvement
This skill is never finished. Improve it as you use it.
- When the user corrects a section, a theme call, or the scope handling, update the relevant
  reference file (or this SKILL.md) so the correction sticks.
- When a correction is a hard rule ("always", "never"), add it as a permanent rule here.
- Grow the `LEXICON` every run: fold new phrasings into existing canonicals or add new
  emerging entries, so recurrence tracking improves over time.
- When the user says a report was genuinely good, save its data file to `references/examples/`
  as a model for future runs.
- Keep the skill small: when you add something, run the deletion test and cut anything that
  no longer changes behavior.

## Routing
| Step | Reference |
|------|-----------|
| 1. Sources, scope, cadence, sections | `references/report-config.md` |
| 2. Collect meetings (Fireflies) | `references/fireflies-guide.md` |
| 2. Collect posts (Circle) | `references/circle-guide.md` |
| 3. Analyze into themes | `references/analysis-framework.md` |
| 4. Data contract | `references/data-schema.md` |
| 5. Dashboard | `references/dashboard-template.html` + `soft-ui` skill |
