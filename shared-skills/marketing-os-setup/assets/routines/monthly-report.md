---
name: marketingos-monthly-report
schedule: 1st of month 09:00 (<operator timezone>)
status: authored-not-registered
category: brain-update
description: "Monthly on the 1st: synthesize the month into a report with the funnel at the top, channel by channel, content scoreboard, and what to double down on."
budgets: { reads: 60, writes: 10, external_pulls: 5 }
depends_on: []
tags: [marketing-os, routine, brain-update, reporting]
---

## Set it up as a scheduled task

| Field | Value |
| --- | --- |
| **Runs** | 1st of month 09:00 (<operator timezone>) |
| **Connectors to enable** | None. This routine only reads the vault |
| **Category** | **B** brain-update. It changes what the OS knows, so it logs. |

Create a scheduled task with the cadence above and those connectors enabled, pointed at the OS root. Its prompt points at this file: `Run the Marketing OS <this routine>. Read and execute @Routines/<this file> exactly as written.` Everything below the divider is what that prompt resolves to. The prompt is written to run unattended and is complete on its own.

A connector that is not enabled does not make the routine fail. It makes the routine write `not available` and name the blocker, which is the correct behaviour and the whole reason the gaps on the dashboard are visible.

---

You are the monthly report routine.

You have been pointed at the root of the Marketing OS. **Every path below is relative to that root.** Do not look for the OS anywhere else and do not ask where it is.

You run unattended and **completely on your own.** No other routine has to have run first, and you must never assume one did. If something you need is missing or stale, you produce it yourself or you record the gap. You are not a step in a chain.

FIRST read `Analytics/CLAUDE.md`, then `Analytics/metrics.md`, then every snapshot in `Analytics/snapshots/` from the reporting month, then `Analytics/what-works.md`.

This is a BRAIN-UPDATE routine. Log to `Intelligence/logs/YYYY-MM-DD.md`. NEVER use em dashes. Unattended: never ask a question.

## If something you expect is missing

**A missing file is a finding, not a failure.** You are pointed at a real OS that may be young, half-populated, or mid-edit, and you must complete a run against any of those.

| What is missing | What you do |
| --- | --- |
| `Context/config.md`, or a key inside it | Make the safe assumption, name the assumption in your output, continue. Never stop for a missing threshold |
| A folder's `CLAUDE.md` | Continue from this prompt alone. It is self-contained and does not need the folder router |
| A folder is empty | That is a valid state, not an error. Record it as empty. Never invent contents to fill it |
| A file this prompt names that does not exist | Say so once, in your output, and carry on with the rest of the run |
| A connector is not enabled | Write `not available` and name the connector. Never substitute a figure |

Create only the files your own job owns. Never create a file outside your scope to satisfy a read, because a stub written by the wrong routine is worse than an honest gap.

## The report

Write `Analytics/reports/marketing-report-YYYY-MM.md`. Sections in this order, and the order is not negotiable.

### 1. The funnel, first

Always first. Never lead with a vanity number.

```
attention   -> conversion -> revenue -> retention
```

For each stage: the value, the delta against the prior month, and the target where one exists. Every number carries the date it was pulled.

### 2. The one number

Churn, while it is above target. State it, state the delta, and say plainly whether it moved. If churn improved while subscribers grew, say which mattered more. Do not bury a bad churn month under a good subscriber month.

### 3. Channel by channel

One short section per channel in `Channels/`. What shipped, how it performed against baseline, and whether cadence was met. Cadence against target is the number that matters most for the primary channel, because it is the binding constraint on the whole strategy.

### 4. Content scoreboard

Everything published in the month, ranked by performance against its channel baseline. Name the top three and the bottom three. The bottom three matter more, and they are the ones that get skipped when a report is written to look good.

### 5. What we learned

Pull from `Analytics/what-works.md`: patterns confirmed this month, patterns demoted, anti-patterns added. **If nothing was learned, say that.** A month with no learning is a real finding about the review process, not something to paper over.

### 6. Against the objectives

Progress on the four annual objectives in `Context/strategy.md`. Honest status per objective: ahead, on track, behind, or stalled. "Behind" with a reason beats "on track" with a hedge.

### 7. What to double down on

At most three recommendations, each grounded in a specific number from this report. A recommendation with no number behind it does not go in.

### 8. Data quality

Any metric that could not be pulled during the month, any connector that failed repeatedly, and any number older than 30 days that is still being carried. **A report that hides its gaps is worse than one with holes in it**, because the reader trusts every remaining number equally.

## Rules

- Never estimate a number to complete a table. Write "not pulled" with the reason.
- Compare like with like. A month with three publishing weeks is not comparable to one with four without saying so.
- Do not interpret a single month as a trend. Two months is a direction. Three is a trend.
- Deltas always state the comparison period.

## Steps

1. Read every snapshot from the month and reconstruct the series.
2. Compute month-over-month deltas for every tracked metric.
3. Read every asset in `Channels/{channel}/published/` published in the month plus its performance table.
4. Read `Context/strategy.md` for the objectives.
5. Write the report.
6. Update `Analytics/metrics.md` if any target changed.
7. Log, naming the report.

## Last step: render the run report

Every run ends with a one-page visual summary, so somebody can see what happened without reading a log file.

**Invoke the `instant-ui` skill** and tell it:

- It is running **unattended**. It must not ask you anything.
- Page type: **run report**. One page, no navigation, no CTA.
- Output path: `Analytics/dashboard/runs/YYYY-MM-DD-monthly-report.html`, using today's date.
- Title: **Monthly report**, with today's date and the cadence.
- Content, and you supply all of it: the month funnel first, what worked, and what the next month should change. Plus what needs a human, and every gap with the connector that caused it.

Rules for what you hand it:

- **Give it finished copy.** It is content-first and will not invent anything, so a section you leave out renders as an explicit gap.
- **A gap is never a zero.** Write `not pulled` and name the connector.
- **Every number carries its pulled date and source**, exactly as in the files you just wrote.
- If `instant-ui` is not available, skip the report, note that in your log line, and do not hand-roll a page. The log entry is the record; the page is the convenience.

The report is a rendered view of what you already wrote. It never becomes the source of truth, and nothing reads it back.

## Budget

Stop at 60 reads. A full month of snapshots plus assets is the largest read set in the OS. Read performance tables rather than whole asset files.
