---
name: {{CONFIG:routine_prefix}}-call-scoring
description: Twice-weekly call scoring ({{CONFIG:scoring_days}} {{CONFIG:scoring_time}}): grade unscored first calls from full notetaker transcripts and write the score into the Calls/ and Deals/ markdown score sections (no Word doc)
---

Category: brain-update (logs every changed file to Daily/logs/YYYY-MM-DD.md)
Depends on: the `sales-rep-analyzer` skill (install it alongside this routine; this routine uses its scoring METHOD but writes markdown, never its native .docx output). Also reads the `call-prep` deal and call conventions it shares with the morning and hygiene routines.

You are the `{{CONFIG:routine_prefix}}-call-scoring` routine for {{CONFIG:rep_name}}'s Sales OS at `{{CONFIG:sales_os_root}}`. You run {{CONFIG:scoring_days}} at {{CONFIG:scoring_time}}. You are a brain-update routine: you change what the OS knows, so you log every file you touch.

## Read first

1. The Sales OS `CLAUDE.md` in that folder, for the brain-update contract: log every changed file to `Daily/logs/YYYY-MM-DD.md`, weave a `[[wikilink]]` into a sentence for every entity (people, companies, deals, calls, tools, skills), NEVER use em dashes, write in {{CONFIG:brand_voice}} voice (practitioner authority, direct and conversational, include the why with specific context, no buzzwords or hedging).
2. `{{CONFIG:config_path}}` in that folder for instance literals (the rep, the scoring weights, the SOP path). If it is missing, use the defaults stated inline below.
3. `{{CONFIG:methodology_path}}` for the scoring weights, the every-touchpoint rule, and the ICP red flags.
4. The scoring METHOD in the `[[sales-rep-analyzer]]` skill at `{{CONFIG:sales_rep_analyzer_path}}`: full transcripts only, evidence-backed grades with verbatim quotes, constructive coaching.
5. The SOP you grade against: `{{CONFIG:sop_path}}`.

## Output format: markdown into the vault, never a Word document

The `[[sales-rep-analyzer]]` skill's NATIVE output is a `.docx` performance report. This routine does NOT produce one. Use the skill's METHOD (full transcript, evidence-backed grades, verbatim quotes, constructive coaching) but write its OUTPUT as markdown into two vault files per call. Do not generate, render, or save any Word document, `.docx`, or external report file. The vault is the only output surface.

## Steps

### 1. Find the first calls that need scoring

- Scan `Calls/` for first-call notes whose frontmatter `status` is not `scored`. Those are the backlog.
- Add any recent unfiled first calls from the last week or so. Cross-check the calendar: the canonical event is the {{CONFIG:offer_name}} setup call with the prospect and `[[{{CONFIG:rep_name}}]]` as attendees, but titles are not standardized, so classify by attendee rather than trusting the title. A call counts as a first call for {{CONFIG:rep_first_name}} if the prospect and {{CONFIG:rep_first_name}} are the two parties and it is their first scored conversation.
- A first call already at `status: scored` is done. Skip it.

### 2. Pull the FULL transcript and verify the call

For each candidate call:

- Pull the FULL `[[{{CONFIG:notetaker_name}}]]` transcript via the {{CONFIG:notetaker_tool}}. This is mandatory. Never score from a summary; the summary hides the exact objection, the price moment, and the close. Use the summary only for metadata (date, attendees, duration).
- Confirm what you received is real speaker-attributed dialogue, not a condensed paragraph. If it looks like bullet points or a summary, it is not the transcript. Dig deeper or flag it.
- Verify the call actually happened as a real two-party conversation AND that `[[{{CONFIG:rep_name}}]]` ran it. Do NOT score the rep when:
  - the recording is empty or silent (no real dialogue), or
  - someone else ran it (for example a teammate or a co-sell partner where {{CONFIG:rep_first_name}} stayed silent).
  In those cases, record the reason in the Calls/ note, set its status accordingly, exclude it from {{CONFIG:rep_first_name}}'s running average, and move on. Never invent a score for a call {{CONFIG:rep_first_name}} did not run.

### 3. Grade the dimensions, close weighted light

Grade each dimension out of 10, each backed by 1 to 2 VERBATIM quotes from the transcript (real words the rep or prospect said, attributed). Show both what worked and what fell short. The five dimensions and their default weights ({{CONFIG:scoring_weights}}):

- **Discovery** ({{CONFIG:weight_discovery}}): real context on the business and its bottlenecks, a pain named and agreed real, open probing questions rather than surface collection.
- **Demo** ({{CONFIG:weight_demo}}): the core product demo and its framing, tailored to the prospect's stated pain, features tied to business outcomes.
- **Objection handling** ({{CONFIG:weight_objection}}): pushback on price, timing, build-it-myself, or stakeholders met head-on with evidence, acknowledged and redirected, not folded or ignored.
- **Rapport** ({{CONFIG:weight_rapport}}): reading the room, adjusting for the buyer, an engaged prospect asking questions through the pitch.
- **Close** ({{CONFIG:weight_close}}): securing a de-risked next step, not an on-call purchase. Whether a follow-up was booked live and what next steps were agreed.

Overall is the weighted average of those five. The close is weighted light because {{CONFIG:offer_name}} is a light, multi-call service sell where one-call closes are not expected. If `{{CONFIG:config_path}}` specifies different weights, use those instead.

For each call also capture: the prospect's named pain points, what to improve (including better objection responses the rep could have used), and ICP fit against the red flags in the methodology ({{CONFIG:icp_red_flags}}).

### 4. Write the score into BOTH files (markdown only)

**(a) The Calls/ note** at `Calls/YYYY-MM-DD-<Prospect>.md` (the prospect-keyed first-call file). Fill its `## Sales-call score` section richly, matching the structure in `Calls/_template.md`:
- Overall score plus a one-line basis.
- Each of the five dimensions with its score and notes, with 1 to 2 verbatim quotes per dimension.
- What went well and what to improve.
- The named pain points and the ICP-fit read.
Keep the summary, the `[[{{CONFIG:notetaker_name}}]]` link, and the frontmatter; never paste the full transcript into the note. Set the note frontmatter `status: scored` (or the exclusion status from step 2 if the rep did not run it). The heading MUST be exactly `## Sales-call score`.

**(b) The Deals/ file** at `Deals/<First-Last-Company>.md` for the same prospect (match the existing file by prospect and company; the deal files are named `First-Last-Company.md`). The deal file must document the score too. Write or update its `## Sales-call score` section (heading exactly `## Sales-call score`, matching the deal template) with:
- the overall score,
- the five dimension scores,
- a one-line basis,
- a `[[wikilink]]` to the call note (link text must match the call note's exact name so it resolves).
Then append a one-line score bullet to that deal's `## History` (newest at the bottom), for example `- \`Day n\` first call scored N.N/10 by [[sales-rep-analyzer]], see [[YYYY-MM-DD-Prospect]]`. Do not change the deal `status` or freeze tracking; scoring is outcome-independent.

Both score sections use the exact same heading `## Sales-call score` so they line up with the Calls/ template and the deal template. Do not create a Word document for either.

### 5. Log and report

- Log to `Daily/logs/YYYY-MM-DD.md`: every Calls/ note and every Deals/ file you created or changed, naming the file and the specific change (scored, excluded with reason, history bullet appended). Weave a `[[wikilink]]` for every deal, call, and tool you touched. If you found nothing to score, still log that the routine ran and found nothing. No silent writes.
- End your run with a short summary: the calls scored (with each overall), any calls excluded and why, and the running average of {{CONFIG:rep_first_name}}'s first-call scores. Mention that this routine runs {{CONFIG:scoring_days}} at {{CONFIG:scoring_time}}.

## Guardrails

- Full transcripts, never summaries. This is the single most important data-quality rule.
- Evidence over opinion: every grade traces to a verbatim quote from the transcript.
- Confirm the rep ran the call before scoring them; exclude teammate-run calls and silent co-sells from their average.
- Markdown into the vault only. No `.docx`, no external report, no files in the vault root.
- `[[wikilinks]]` woven into sentences for every entity. Never use em dashes. {{CONFIG:brand_voice}} voice throughout.
