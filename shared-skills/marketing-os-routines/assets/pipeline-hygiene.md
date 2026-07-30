---
name: marketingos-pipeline-hygiene
schedule: weekly, Monday 11:00 (<operator timezone>)
status: authored-not-registered
category: brain-update
description: "Weekly Monday 08:00: check the content pipeline against the cadence calendar, work the housekeeping queue, verify OS integrity, and send ONE consolidated weekly brief."
budgets: { reads: 50, writes: 25, external_pulls: 5, housekeeping_items: 10 }
depends_on: [<email client, for the one digest it sends>]
tags: [marketing-os, routine, brain-update, hygiene]
---

## Set it up as a scheduled task

| Field | Value |
| --- | --- |
| **Runs** | weekly, Monday 11:00 (<operator timezone>) |
| **Connectors to enable** | the email client |
| **Category** | **B** brain-update. It changes what the OS knows, so it logs. |

Create a scheduled task with the cadence above and those connectors enabled, pointed at the OS root. Its prompt points at this file: `Run the Marketing OS <this routine>. Read and execute @Routines/<this file> exactly as written.` Everything below the divider is what that prompt resolves to. The prompt is written to run unattended and is complete on its own.

A connector that is not enabled does not make the routine fail. It makes the routine write `not available` and name the blocker, which is the correct behaviour and the whole reason the gaps on the dashboard are visible.

---

You are the weekly pipeline hygiene routine.

You have been pointed at the root of the Marketing OS. **Every path below is relative to that root.** Do not look for the OS anywhere else and do not ask where it is.

You run unattended and **completely on your own.** No other routine has to have run first, and you must never assume one did. If something you need is missing or stale, you produce it yourself or you record the gap. You are not a step in a chain.

FIRST read `Context/config.md` for the thresholds: `idea_backlog_min`, `draft_stale_days`, `context_stale_days`. Then read `Channels/<primary>/strategy.md` for the cadence calendar and `Team/{owner}/tasks.md` for the housekeeping queue.

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

## This is the routine that emails

Every other brain-update routine leaves its findings in the log. This one is the only one that sends. **Send exactly one consolidated email per run.** Subject: `Marketing OS Weekly Brief - <date>`. To the address in `config.md` under `escalation.daily_brief_to`.

## Steps

1. **Check cadence coverage.** Read the cadence table in `Channels/<primary>/strategy.md`, where `<primary_channel>` is the `primary_channel` key in `Context/config.md`. For the coming week, determine whether every scheduled slot has an asset at the right stage in `Channels/{channel}/pipeline/`. An empty slot inside 7 days is the highest-priority flag in this routine, because cadence is the binding constraint on the entire strategy.

2. **Check the idea backlog.** Count active files in `Channels/<primary>/ideas/`. If below `idea_backlog_min`, flag it. A thin backlog is why cadence slips, and it slips two weeks after the backlog empties, not the same week. This is a leading indicator and should be treated as one.

3. **Find stale drafts.** Any file in `Channels/{channel}/pipeline/` whose `stage` has not changed in more than `draft_stale_days`. For each, either it needs a next action or it needs killing. Do not silently leave it. Add a task or propose the kill.

4. **Check for orphaned children.** Any file in `Channels/{channel}/pipeline/` with a `parent:` whose pillar published more than 14 days ago and which is still unpublished. The repurposing cascade going cold is invisible otherwise, because the pillar looks successfully published.

5. **Check context staleness.** Any file in `Context/` whose `updated:` is older than `context_stale_days`. Flag it. Do not edit it. Context is human-owned and going stale is a signal, not something to paper over.

6. **Work the housekeeping queue.** Read `## Housekeeping Queue` in `Team/{owner}/tasks.md`. Work through at most `housekeeping_items` entries, starting where the last run stopped. Rotate. When the end of the list is reached, start again from the top. Record the stopping point in the queue so the next run continues from there rather than rescanning the whole OS.

7. **Verify OS integrity.** As part of the queue, and always at least the first two of these:
   - Every row of the root `CLAUDE.md` routing table points at a folder that exists
   - Every folder appears in the routing table
   - Every wikilink resolves
   - No file sits in the OS root other than `CLAUDE.md`
   - No em dashes anywhere
   - Every metric in `Analytics/` carries a pulled date

8. **Update tasks.** Add a task for every flag raised, verifying first that it has not already been handled.

9. **Send the one brief.** HTML email containing:
   - `Cadence` filled and empty slots for the coming week
   - `Backlog` idea count against the minimum
   - `Stale` drafts and orphaned children needing a decision
   - `Numbers` the three that moved most last week, from `Analytics/metrics.md`
   - `Housekeeping` what was fixed, and what remains queued
   - `Needs you` the decisions only Ben can make

10. **Log.** Name every file changed and record the housekeeping stopping point.

## Last step: render the run report

Every run ends with a one-page visual summary, so somebody can see what happened without reading a log file.

**Invoke the `instant-ui` skill** and tell it:

- It is running **unattended**. It must not ask you anything.
- Page type: **run report**. One page, no navigation, no CTA.
- Output path: `Analytics/dashboard/runs/YYYY-MM-DD-pipeline-hygiene.html`, using today's date.
- Title: **Pipeline hygiene**, with today's date and the cadence.
- Content, and you supply all of it: what is stale, what is unassigned, what is broken in the OS itself. Plus what needs a human, and every gap with the connector that caused it.

Rules for what you hand it:

- **Give it finished copy.** It is content-first and will not invent anything, so a section you leave out renders as an explicit gap.
- **A gap is never a zero.** Write `not pulled` and name the connector.
- **Every number carries its pulled date and source**, exactly as in the files you just wrote.
- If `instant-ui` is not available, skip the report, note that in your log line, and do not hand-roll a page. The log entry is the record; the page is the convenience.

The report is a rendered view of what you already wrote. It never becomes the source of truth, and nothing reads it back.

## Budget

Stop at 50 reads and 10 housekeeping items. The queue exists specifically so this routine does not need to scan everything every week. Never exceed the housekeeping cap even if items look quick, because that is how a weekly routine turns into an hour-long one.

## Failure handling

If email cannot be sent, write the full brief into the log under `## Brief: unsent` and flag it. The brief is never lost, it just changes delivery.
