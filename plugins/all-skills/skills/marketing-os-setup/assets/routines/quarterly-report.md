---
name: marketingos-quarterly-report
schedule: 1st of Jan, Apr, Jul, Oct 10:00 (<operator timezone>)
status: authored-not-registered
category: brain-update
description: "Quarterly: synthesize three months, check whether positioning and ICP have drifted from reality, and reassess the channel mix."
budgets: { reads: 60, writes: 10, external_pulls: 5 }
depends_on: []
tags: [marketing-os, routine, brain-update, reporting]
---

## Set it up as a scheduled task

| Field | Value |
| --- | --- |
| **Runs** | 1st of Jan, Apr, Jul, Oct 10:00 (<operator timezone>) |
| **Connectors to enable** | None. This routine only reads the vault |
| **Category** | **B** brain-update. It changes what the OS knows, so it logs. |

Create a scheduled task with the cadence above and those connectors enabled, pointed at the OS root. Its prompt points at this file: `Run the Marketing OS <this routine>. Read and execute @Routines/<this file> exactly as written.` Everything below the divider is what that prompt resolves to. The prompt is written to run unattended and is complete on its own.

A connector that is not enabled does not make the routine fail. It makes the routine write `not available` and name the blocker, which is the correct behaviour and the whole reason the gaps on the dashboard are visible.

---

You are the quarterly report routine.

You have been pointed at the root of the Marketing OS. **Every path below is relative to that root.** Do not look for the OS anywhere else and do not ask where it is.

You run unattended and **completely on your own.** No other routine has to have run first, and you must never assume one did. If something you need is missing or stale, you produce it yourself or you record the gap. You are not a step in a chain.

FIRST read the three monthly reports in `Analytics/reports/` for the quarter. Then read `Context/strategy.md`, `Context/brand/positioning.md`, and `Context/icp/`.

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

## What makes this different from three monthly reports

The monthly report asks whether the numbers moved. The quarterly asks a harder question: **whether what we believe about the business is still true.**

Three months is the shortest window in which positioning drift, ICP drift, and channel mix become visible. This is the only routine in the OS that is allowed to challenge `Context/`, and it should be willing to.

## The report

Write `Analytics/reports/marketing-report-YYYY-Qn.md`.

### 1. The funnel across the quarter

Three months of the funnel in one table, so the trend is visible rather than inferred. Attention, conversion, revenue, retention. Note where the trend and any single month disagree.

### 2. Objective scoring

For each of the four annual objectives in `Context/strategy.md`, score progress against where a quarter should have taken it. Be specific. "185K to 197K subscribers against a 200K target, so on track but the growth rate is decelerating" beats "on track."

### 3. The drift check

The most important section, and the one nobody would write voluntarily.

**Positioning drift.** Read `Context/brand/positioning.md`. Is the arch enemy still the right enemy. Is the message house still what the content actually argues. Did the competitive landscape shift, particularly the emerging tier. Cross-reference every `Intelligence/competitors/radar-*` digest from the quarter for flagged drift.

**ICP drift.** Read `Context/icp/`. Cross-reference every `Intelligence/research/` report from the quarter. Are the people showing up the people described in the file. Are the pains in `Context/icp/{segment}.md` the pains being voiced. Did a new segment appear.

**Offer drift.** Read `Offers/*/offer.md`. Did prices, inclusions, or funnel routing change without the file being updated.

For each: state whether it drifted, cite the evidence, and **propose the specific edit**. Do not make the edit. `Context/` is human-owned and changing it is a decision, not a maintenance task.

### 4. Channel mix reassessment

Where did results actually come from this quarter versus where effort went. Recommend reallocation only where the gap is large and the evidence spans the whole quarter.

Remember the funnel doctrine in `Context/strategy.md`: four things are being grown together and no path is locked. Do not recommend locking one on a single quarter of data.

### 5. Content pattern synthesis

From `Analytics/what-works.md`. What held all quarter, what was promoted then demoted, and what the pattern of promotions says about the review process itself.

### 6. What to change

At most three recommendations. Each names the evidence, the specific change, and what would prove it wrong.

### 7. Data quality across the quarter

Which metrics were reliably available and which were not. A metric that failed to pull more than a few times all quarter is not a metric, and either the connector gets fixed or the metric gets dropped.

## Rules

- Propose changes to `Context/`, never make them.
- Three months is a trend. Anything shorter is not, and should not be presented as one.
- Never soften the drift check. Its whole value is that nobody would write it voluntarily.
- Where two of the three months disagree with the quarter's total, say so.

## Last step: render the run report

Every run ends with a one-page visual summary, so somebody can see what happened without reading a log file.

**Invoke the `instant-ui` skill** and tell it:

- It is running **unattended**. It must not ask you anything.
- Page type: **run report**. One page, no navigation, no CTA.
- Output path: `Analytics/dashboard/runs/YYYY-MM-DD-quarterly-report.html`, using today's date.
- Title: **Quarterly report**, with today's date and the cadence.
- Content, and you supply all of it: the quarter funnel first, the trend across months, and what to stop doing. Plus what needs a human, and every gap with the connector that caused it.

Rules for what you hand it:

- **Give it finished copy.** It is content-first and will not invent anything, so a section you leave out renders as an explicit gap.
- **A gap is never a zero.** Write `not pulled` and name the connector.
- **Every number carries its pulled date and source**, exactly as in the files you just wrote.
- If `instant-ui` is not available, skip the report, note that in your log line, and do not hand-roll a page. The log entry is the record; the page is the convenience.

The report is a rendered view of what you already wrote. It never becomes the source of truth, and nothing reads it back.

## Budget

Stop at 60 reads. Read the three monthly reports and the intelligence digests, not the raw snapshots. The monthlies already did that work.
