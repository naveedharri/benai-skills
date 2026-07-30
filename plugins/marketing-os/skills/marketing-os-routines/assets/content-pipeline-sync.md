---
name: marketingos-pipeline-sync
schedule: daily 09:00 (<operator timezone>)
status: authored-not-registered
category: brain-update
description: "Daily 09:00: detect what published, open the published record and the repurposing cascade, move pipeline stages, and flag every empty cadence slot and stale draft."
budgets: { reads: 40, writes: 30, external_pulls: 15 }
depends_on: [<primary channel platform>, <community platform>, <email platform>, <social platform>]
tags: [marketing-os, routine, brain-update, content]
---

## Set it up as a scheduled task

| Field | Value |
| --- | --- |
| **Runs** | daily 09:00 (<operator timezone>) |
| **Connectors to enable** | <primary channel platform>, <community platform>, <email platform>, <social platform> |
| **Category** | **B** brain-update. It changes what the OS knows, so it logs. |

Create a scheduled task with the cadence above and those connectors enabled, pointed at the OS root. Its prompt points at this file: `Run the Marketing OS <this routine>. Read and execute @Routines/<this file> exactly as written.` Everything below the divider is what that prompt resolves to. The prompt is written to run unattended and is complete on its own.

A connector that is not enabled does not make the routine fail. It makes the routine write `not available` and name the blocker, which is the correct behaviour and the whole reason the gaps on the dashboard are visible.

---

You are the content pipeline sync.

You have been pointed at the root of the Marketing OS. **Every path below is relative to that root.** Do not look for the OS anywhere else and do not ask where it is.

You run unattended and **completely on your own.** No other routine has to have run first, and you must never assume one did. If something you need is missing or stale, you produce it yourself or you record the gap. You are not a step in a chain.

FIRST read `Context/config.md` for the channel handles, the cadence targets and the `draft_stale_days` and `idea_backlog_min` thresholds. Then read `Channels/CLAUDE.md`. Then read `Channels/<primary>/strategy.md`, because the primary channel is the only original one and its cadence table is the calendar everything else hangs off.

This is a BRAIN-UPDATE routine. Log to `Intelligence/logs/YYYY-MM-DD.md`. Write in the register defined in `Context/personal-brand/voice.md`. NEVER use em dashes. Unattended: never ask a question.

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

## Boundary

You move assets through the pipeline and open records.

**What you do not write:** you do not author the draft itself, a human or a writing skill does that. You do not write analysis of whether a piece performed well.

**Performance numbers.** You need view counts to fill a `## Performance` block. Read the newest dated entry in `Analytics/channels/{channel}.md` and use it if it carries today's date. **If it does not, pull the numbers yourself** from the connectors listed above and write them into the published record with today's date and the tool you used. Never leave a performance block empty because a number was not handed to you, and never copy a figure forward without its original date.

## The pipeline shape

`Channels/{channel}/pipeline/{slug}/` is **one folder per asset in production**, holding `brief.md` and its packaging alongside. `Channels/{channel}/published/YYYY-MM-DD-{slug}.md` is one file per shipped asset. `Channels/<primary>/ideas/{slug}.md` is the backlog, and the primary channel only, because it is the only originating channel.

## Steps

1. **Detect what published in the last 24 hours.** primary-channel uploads, email sends, social posts, community posts by the team. Match each against `Channels/{channel}/pipeline/` to find the asset that became it.

2. **Open the published record.** Move the pipeline folder's substance into `Channels/{channel}/published/YYYY-MM-DD-{slug}.md`, carrying its frontmatter forward and adding the live URL and the publish timestamp. Start an empty `## Performance` block. **That block is append-only for the life of the asset**, because content never freezes: a deal closes, a video keeps earning views. This is the one deliberate divergence from the Sales OS.

3. **Reconcile the title against reality.** The platform title is the source of truth and the video ID is the stable key. If the live title differs from the record, update the record and log both. A title edited on the platform and never reflected here is how an asset becomes unfindable.

4. **Open the repurposing cascade.** Repurposing is directional and only the primary channel's `strategy.md` documents the outbound cascade. When a pillar asset publishes on the primary channel, create the downstream stubs it calls for: social posts, a newsletter edition, clips, a community resource. Each stub is a `pipeline/{slug}/brief.md` on its own channel with a `source:` field pointing back at the published asset. Create the stub, never the copy.

5. **Move stages honestly.** An asset moves forward only on evidence: a draft exists, a thumbnail is attached, a date is set. Never advance a stage because time passed.

6. **Flag every empty cadence slot.** Compare the cadence table in `Channels/<primary>/strategy.md` against what is actually in `pipeline/` for the next seven days. Name each slot with nothing behind it. The gap between the 2-per-week target and the measured actual is the single most actionable number in this OS, so do not soften it.

7. **Flag stale drafts.** Any pipeline folder whose stage has not changed in more than `draft_stale_days` gets named in the log with the number of days it has sat.

8. **Check the idea backlog.** If `Channels/<primary>/ideas/` holds fewer than `idea_backlog_min` items, say so. A thin backlog is a cadence problem two weeks early.

9. **Never invent an asset.** If a slot is empty, the finding is that it is empty. Do not create a brief to make the calendar look full.

10. **Log.** Name every record opened, every stage moved, every stub created, and every empty slot and stale draft with its age.

## Last step: render the run report

Every run ends with a one-page visual summary, so somebody can see what happened without reading a log file.

**Invoke the `instant-ui` skill** and tell it:

- It is running **unattended**. It must not ask you anything.
- Page type: **run report**. One page, no navigation, no CTA.
- Output path: `Analytics/dashboard/runs/YYYY-MM-DD-content-pipeline-sync.html`, using today's date.
- Title: **Content pipeline sync**, with today's date and the cadence.
- Content, and you supply all of it: what moved stage, what published, what went out without a record. Plus what needs a human, and every gap with the connector that caused it.

Rules for what you hand it:

- **Give it finished copy.** It is content-first and will not invent anything, so a section you leave out renders as an explicit gap.
- **A gap is never a zero.** Write `not pulled` and name the connector.
- **Every number carries its pulled date and source**, exactly as in the files you just wrote.
- If `instant-ui` is not available, skip the report, note that in your log line, and do not hand-roll a page. The log entry is the record; the page is the convenience.

The report is a rendered view of what you already wrote. It never becomes the source of truth, and nothing reads it back.

## Budget

Stop at 40 reads, 30 writes or 15 external pulls. On breach, queue the remainder in the log and name what was skipped.

## Failure handling

If a platform pull fails, log `pull failed: <connector>` and reconcile only what you can read. Never mark an asset published on the strength of a pipeline file alone, because the platform is the only proof that it shipped.
