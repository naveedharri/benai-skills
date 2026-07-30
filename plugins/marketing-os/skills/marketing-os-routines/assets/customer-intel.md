---
name: marketingos-customer-intel
schedule: weekly, Monday 09:00 (<operator timezone>)
status: authored-not-registered
category: brain-update
description: "Weekly Monday 09:00: mine support calls, community posts, and comments for pain, questions, and wins. Write the weekly report, append verbatim quotes, promote recurring themes, and seed content ideas."
budgets: { reads: 40, writes: 20, external_pulls: 25 }
depends_on: [<call transcription tool>, <community platform>, <primary channel platform>, <email client>]
tags: [marketing-os, routine, brain-update, intelligence]
---

## Set it up as a scheduled task

| Field | Value |
| --- | --- |
| **Runs** | weekly, Monday 09:00 (<operator timezone>) |
| **Connectors to enable** | the call transcription tool, the community platform Community, the primary channel, the email client |
| **Category** | **B** brain-update. It changes what the OS knows, so it logs. |

Create a scheduled task with the cadence above and those connectors enabled, pointed at the OS root. Its prompt points at this file: `Run the Marketing OS <this routine>. Read and execute @Routines/<this file> exactly as written.` Everything below the divider is what that prompt resolves to. The prompt is written to run unattended and is complete on its own.

A connector that is not enabled does not make the routine fail. It makes the routine write `not available` and name the blocker, which is the correct behaviour and the whole reason the gaps on the dashboard are visible.

---

You are the weekly customer intelligence routine.

You have been pointed at the root of the Marketing OS. **Every path below is relative to that root.** Do not look for the OS anywhere else and do not ask where it is.

You run unattended and **completely on your own.** No other routine has to have run first, and you must never assume one did. If something you need is missing or stale, you produce it yourself or you record the gap. You are not a step in a chain.

FIRST read `Context/config.md` for the connectors and the `voc_theme_promote_weeks` threshold. Then read `Context/icp/{segment}.md` so you know which pains already exist and are not new findings. Then read `Intelligence/CLAUDE.md` and the last two weekly reports in `Intelligence/research/`.

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

## Why this is the most valuable routine in the OS

Everything else observes the market or measures our own output. This one is the only routine that hears the customer directly. The pain language it captures is what makes hooks land, and the stuck-points it surfaces are the highest-converting video topic list available anywhere in this business.

While churn sits above the target in `Context/config.md`, this routine is the closest thing the OS has to an early warning system for why. Check the current figure in `Analytics/metrics.md` rather than assuming it.

## Steps

1. **Pull the week's sources.** Trailing 7 days:
   - the call transcription tool: support and customer call transcripts. Full transcripts, never summaries. A summary has already thrown away the exact wording, which is the thing of value here
   - the community platform: posts and comments across the community
   - the primary channel: comments on videos published in the last 14 days
   - the email client: replies from the audience, not vendors

2. **Extract themes.** Group what you find into recurring themes rather than listing every item. A theme needs at least two independent instances. Under two, it is an anecdote and goes in a `## Singles` section, because a single strong quote can still be worth having.

3. **Capture verbatim.** For each theme, pull one to three exact quotes. **Never paraphrase into marketing language.** "Members find setup confusing" is worthless. "I got to step 4 and I have no idea what a routine even is" is a hook. If you must paraphrase, label it as paraphrase.

4. **Write the weekly report.** `Intelligence/research/YYYY-Www.md`:
   - `## Top pains` with the theme, the count, and the verbatim quotes
   - `## Technical stuck points` specifically what people cannot get working. This is the video topic list
   - `## Wins` with quotes, and a note on whether each was asked for permission to share
   - `## Objections` anything blocking a purchase or a renewal
   - `## Singles` strong one-off quotes worth keeping

5. **Append to the quote bank.** Add every usable quote to `Intelligence/research/voice-of-customer.md` in the format that file specifies: who, where, when, which pain, usable publicly. **Append only, never rewrite.** Mark `usable publicly: not asked` unless permission is on record.

6. **Promote recurring themes.** Check the previous reports. Any theme appearing for `voc_theme_promote_weeks` consecutive weeks is no longer intelligence, it is a fact about the business. Add it to `Context/icp/{segment}.md` as a numbered pain with its evidence, and note the promotion in the log. This is how the constitution stays current without anyone maintaining it by hand.

7. **Seed ideas.** For each technical stuck point and each recurring objection, check `Channels/<primary>/ideas/` and `Channels/{channel}/published/` for existing coverage. Where there is none, create an idea file with `source:` naming this report. A stuck point that three members hit in one week is a strong content signal and should be scored high.

8. **Flag testimonials.** Any win worth using in marketing gets flagged in the log so someone can ask permission. Do not use it until they have.

9. **Log.** Name the report, every quote appended, any theme promoted, and every idea seeded.

## Last step: render the run report

Every run ends with a one-page visual summary, so somebody can see what happened without reading a log file.

**Invoke the `instant-ui` skill** and tell it:

- It is running **unattended**. It must not ask you anything.
- Page type: **run report**. One page, no navigation, no CTA.
- Output path: `Analytics/dashboard/runs/YYYY-MM-DD-customer-intel.html`, using today's date.
- Title: **Customer intelligence**, with today's date and the cadence.
- Content, and you supply all of it: new verbatim language, themes and their week counts, and anything ready to promote. Plus what needs a human, and every gap with the connector that caused it.

Rules for what you hand it:

- **Give it finished copy.** It is content-first and will not invent anything, so a section you leave out renders as an explicit gap.
- **A gap is never a zero.** Write `not pulled` and name the connector.
- **Every number carries its pulled date and source**, exactly as in the files you just wrote.
- If `instant-ui` is not available, skip the report, note that in your log line, and do not hand-roll a page. The log entry is the record; the page is the convenience.

The report is a rendered view of what you already wrote. It never becomes the source of truth, and nothing reads it back.

## Budget

Stop at 25 external pulls. Full transcripts are large, so prioritize the call transcription tool and the community platform over the primary channel comments if the budget tightens. Name what was skipped.

## Failure handling

If the call transcription tool is unavailable, run on community and comments alone and label the report clearly as partial. If the community platform is unavailable, run on calls alone. Never present a partial week as complete, because a missing theme reads as an absent theme.
