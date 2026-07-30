---
name: marketingos-dashboard
schedule: daily 10:30 (<operator timezone>)
status: authored-not-registered
category: hybrid
description: "Daily 10:30: the single routine that updates the entire dashboard end to end. Pulls whatever is not already fresh, assembles all eleven pages, verifies, and redeploys."
budgets: { reads: 60, writes: 12, external_pulls: 25 }
depends_on: [<primary channel platform>, <channel research tool>, <community platform>, <deploy target>, <email platform>, <billing platform>, <web analytics>]
tags: [marketing-os, routine, hybrid, dashboard]
---

## Set it up as a scheduled task

| Field | Value |
| --- | --- |
| **Runs** | daily 10:30 (<operator timezone>) |
| **Connectors to enable** | <primary channel platform>, <channel research tool>, <community platform>, <deploy target>, <email platform>, <billing platform>, <web analytics> |
| **Category** | **H** hybrid. It does both, and logs only the knowledge change. |

Create a scheduled task with the cadence above and those connectors enabled, pointed at the OS root. Its prompt points at this file: `Run the Marketing OS <this routine>. Read and execute @Routines/<this file> exactly as written.` Everything below the divider is what that prompt resolves to. The prompt is written to run unattended and is complete on its own.

A connector that is not enabled does not make the routine fail. It makes the routine write `not available` and name the blocker, which is the correct behaviour and the whole reason the gaps on the dashboard are visible.

---

You are the dashboard routine.

You have been pointed at the root of the Marketing OS. **Every path below is relative to that root.** Do not look for the OS anywhere else and do not ask where it is.

You run unattended and **completely on your own.** No other routine has to have run first, and you must never assume one did. If something you need is missing or stale, you produce it yourself or you record the gap. You are not a step in a chain.

> [!important] You are the ONLY routine that updates the dashboard, and you update ALL of it
> There is one dashboard routine, not a rebuild step plus a data step. Somebody who wants a current dashboard runs you and nothing else. If a number on the page is stale, that is your fault and no other routine's.

FIRST read `Analytics/dashboard/spec.md`. It is the contract and it defines all eleven pages. Then read `Context/config.md` for the deploy target, the channel IDs and the thresholds, and `Context/brand/brand-kit.md` for the design tokens.

This is a HYBRID routine. It pulls data, which changes what the OS knows, so **it logs the knowledge change** to `Intelligence/logs/YYYY-MM-DD.md`. It also produces a deliverable, the deployed page, which it does not log. Log the numbers you wrote. Do not log the deploy.

NEVER use em dashes. Unattended: never ask a question, make the safe assumption and note it.

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

## Step 0: decide what you actually need to pull

You are self-sufficient but not wasteful. Something else may already have written today's numbers, so look before you pull. **Judge this from the files alone, never from an assumption about what else ran.**

Check the newest entry in `Analytics/snapshots/` and the newest dated entry in each `Analytics/channels/*.md`.

| What the files show | What you do |
| --- | --- |
| Everything is dated today | **Pull nothing.** Read the files and go to step 2 |
| Some channels are today, others are older | Pull only the stale ones |
| Nothing is dated today | **Pull everything yourself** and write it to `Analytics/` in the shape described in step 1 |
| `Analytics/snapshots/` is empty | This OS has never been measured. Pull everything, write the first snapshot, and say plainly on the System page that this is the first measurement |

**Never pull a number that is already dated today, and never skip one that is not.** Writing the same figure twice in one day is how a snapshot stops being a record of one day.

## Step 1: pull what is missing

These rules are stated here in full rather than referenced, because you must be able to do this with nothing else having run.

- **the primary channel by channel ID, never by handle.** A research tool resolving a handle to the wrong channel is a known failure mode, which is why `config.md` records an ID. Subscribers, lifetime views, video count, and per-video views inside `published_perf_window_days`.
- **the community platform.** Total members and the tag counts. **A tag is not a subscription.** Write "N members carry the paid-tier tag", never "N paying members".
- **Kit, Stripe, PostHog.** Attempt each once. If the only tools exposed are `authenticate` and `complete_authentication`, record `not available, <connector> not authenticated` and move on. Do NOT attempt to authenticate.
- Write everything you pull to `Analytics/snapshots/YYYY-MM-DD.md`, one file per day, every row carrying its value, its source tool and its pull date. A snapshot is never edited after the day it is written.
- Append to `Analytics/channels/{channel}.md` one per channel in `Channels/`. Newest entry on top, never editing an existing dated entry. Where today's pull contradicts a stored number, append the correction as a new dated entry with both values rather than overwriting.
- Update `Analytics/metrics.md`, one row per metric someone would act on, each with a value, a pull date and a source.
- **Never substitute a lifetime count for a windowed one.** The APIs return cumulative totals, so a 7-day figure only exists if a daily reading was recorded on day 7. Otherwise the answer is `not measurable`.
- **Label derived figures as derived.** Publishing cadence is arithmetic over upload dates and counts long-form only.

> Never fabricate, estimate, interpolate, or carry a number forward. A failed pull is written as a failed pull.

## Step 2: gather the rest of the OS

Read, taking only what the spec's panel list needs:

- `Team/*/tasks.md` and `Team/*/{person}.md` for the **Team** page: role, what each owns, what they decide, open counts, and each person's full open task list with priority, due date and the file it touches
- `Channels/<primary>/ideas/`, `Channels/*/pipeline/`, `Channels/*/published/`, `Channels/<email channel>/broadcasts/` and `flows/`
- `Campaigns/*/brief.md` and `Campaigns/*/results.md`
- `Offers/*/offer.md`, `Offers/*/landing.md`, `Offers/*/proof/`, `Offers/lead-magnets/` for the **Funnel** page, plus the ladder in `Context/strategy.md`, the prices in `Context/config.md`, and any pricing decision record in `Intelligence/decisions/`
- `Context/icp/*.md` for the **Audience** page, pain points included, since they live inside each segment file
- `Analytics/metrics.md`, `Analytics/what-works.md`, `Analytics/reports/`
- Latest in `Intelligence/market/`, `Intelligence/competitors/`, `Intelligence/research/`, `Intelligence/decisions/`
- `Context/infrastructure.md` for connector status, `Routines/CLAUDE.md` and the last few daily logs for run status

## Step 3: assemble the JSON

Build the object the spec defines. **Eleven pages in six nav groups.** Every value carries the file it came from and the date it was pulled.

**All eleven keys are required.** A missing key renders a blank page with no error a human would notice. `funnel` and `team` are the two most likely to be forgotten:

- `funnel` needs one entry per ladder rung with price, sales step, proof count, owner, what feeds it and its ICP segment, plus the price-ladder steps with effective dates.
- `team` needs one entry per person with initials, role, what they own, what they decide, open count, high-priority count and their full task list, plus the people who own a rung and deliberately have no folder.

**Missing data renders as "not yet pulled", never as zero.** A zero is a claim about reality. A gap is the truth.

**A price is never invented and never rounded.** An offer may be a ladder rather than a single price: read the effective dates and mark the step that is live today. A grandfathered rate is not a list price and must never be presented as one. **If a step falls due inside the next seven days, that is the Funnel page's lead card.**

## Step 4: swap it in

Replace the contents of `<script type="application/json" id="os-data">` in `Analytics/dashboard/control-center.html`. **Touch nothing else.**

**The shell is fixed. Only the data changes.** You do not restructure the page, rename a canvas id, change the CSS, or add a tab. A structural change is a deliberate human edit to `Analytics/dashboard/spec.md` first, then to the shell.

The one exception is a first run where `control-center.html` does not exist, in which case build it from the spec.

## Step 5: verify before deploying

If any check fails, **do not deploy.** Report the failure.

1. **The JSON parses.** An invalid data block renders a blank page silently.
2. **All eleven panels populate.** Not one is empty.
3. **Every chart canvas id from the spec is present.**
4. **No panel renders a value it cannot attribute to a file.**
5. **The page opens from disk with no external requests.**
6. **Check the light palette specifically.** Switch to Cream and confirm the core's nodes and edges read clearly. Light mode renders with subtractive `multiply` blending rather than additive `lighter`, and that inversion is the only reason the core works on a light surface. It breaks silently if the blend logic is touched.

## Step 6: deploy and report

Push to Vercel. Record the URL in `Context/config.md` under `surfaces.dashboard_url` if it is not already set.

**Log the knowledge change**, meaning every number you pulled and wrote to `Analytics/`, naming the files. Do not log the deploy itself.

Return: what you pulled versus what was already fresh, the three numbers that moved most since yesterday, anything newly flagged on the System page, and the deployed URL.

## Freshness is stated on the page, never hidden

If for any reason a figure on the page is not from today, the System page opens with that figure's own last pull date and the words "this page is showing data from `<date>`". **A dashboard quietly rendering four-day-old numbers as current is the most dangerous failure in this OS**, because every panel keeps looking correct while going stale.

## Last step: render the run report

Every run ends with a one-page visual summary, so somebody can see what happened without reading a log file.

**Invoke the `instant-ui` skill** and tell it:

- It is running **unattended**. It must not ask you anything.
- Page type: **run report**. One page, no navigation, no CTA.
- Output path: `Analytics/dashboard/runs/YYYY-MM-DD-dashboard.html`, using today's date.
- Title: **Dashboard rebuild**, with today's date and the cadence.
- Content, and you supply all of it: what it had to pull itself, which panels changed, and what it flagged on System. Plus what needs a human, and every gap with the connector that caused it.

Rules for what you hand it:

- **Give it finished copy.** It is content-first and will not invent anything, so a section you leave out renders as an explicit gap.
- **A gap is never a zero.** Write `not pulled` and name the connector.
- **Every number carries its pulled date and source**, exactly as in the files you just wrote.
- If `instant-ui` is not available, skip the report, note that in your log line, and do not hand-roll a page. The log entry is the record; the page is the convenience.

The report is a rendered view of what you already wrote. It never becomes the source of truth, and nothing reads it back.

## Budget

Stop at 60 reads, 12 writes or 25 external pulls. On breach, deploy what you have, state clearly in the return which panels are stale and why, and stop.

## Failure handling

One dead connector never aborts the run. Record the failure, render the gap honestly, and deploy. A dashboard that shows a named blocker is more useful than no dashboard. If Vercel fails, the swapped file is still correct on disk: say so and name the deploy error.
