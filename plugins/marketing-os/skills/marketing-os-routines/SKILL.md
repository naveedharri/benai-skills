---
name: marketing-os-routines
description: "Create and manage the Marketing OS routines as scheduled tasks: ten of them in two groups: five operating routines (morning performance sweep, content pipeline sync, campaign sync, dashboard, monthly report) and five intelligence and review routines (market scan, customer intel, competitor radar, pipeline hygiene, quarterly report). Probes every connector first and reports exactly what each routine loses without it, so nothing gets scheduled against a dead integration. Gives the operator the schedule, the connector list, and the prompt to paste for each. Every routine is independent and none depends on another having run. Use when the user says 'register my marketing routines', 'schedule the marketing OS routines', 'set up marketing automation', 'which routines should I turn on', 'my routines are not running', 'marketing os routines', or runs /marketing-os-routines."
disable-model-invocation: true
---

# Marketing OS Routines

Register the routines that keep a Marketing OS current, and audit the ones already running.

> [!important] A routine is a scheduled task
> The two words mean the same thing here. `Routines/` holds ten prompt files; a routine only *runs* once there is a scheduled task firing it. Creating that task is this skill's whole job.

**This skill owns scheduling.** `marketing-os-setup` installs the ten routine files and then invokes this skill; it never creates a schedule itself. Works either way: invoked from setup, or run on its own against an OS that already exists.

Run from the OS root. If `Routines/` and `Context/config.md` are not present, the OS has not been set up. Point the user at `marketing-os-setup` and stop.

**Stay inside that root.** Read and write only within it. Do not list, glob or read elsewhere on the machine, and do not go looking for other vaults or example OS folders. If something outside the root would help, name the one path and ask. **Start from zero on identity.** Every name, org and handle comes from `Context/config.md` or from the user in this conversation. Never from your context, the system username, the cwd folder name, a git config, or a connected account, and never echoed back as "confirm this?". If `config.md` does not name it, you do not know it: say the key is empty rather than filling it.

## Two modes, detect which

**Install mode.** No routines registered yet. Probe connectors, register the ten, report what is degraded.

**Audit mode.** Routines already registered. Check whether they actually ran, and whether they wrote anything.

Detect by listing existing scheduled tasks whose names begin with the `routine_prefix` in `Context/config.md`, defaulting to `marketingos-`.

## Install mode

### 1. Read the OS first

`Context/config.md` for the schedule times under `routines:`, the timezone, and the connector map. `Context/infrastructure.md` for the degradation table. `Routines/CLAUDE.md` for the register.

Every routine file carries its own `schedule:` and `category:` in frontmatter, and opens with a **Set it up** block giving the schedule and the connectors, then a divider. **Everything below that divider is the routine's prompt.** That text is the payload you schedule, and it never gets paraphrased.

**A routine is a schedule.** A routine file that nothing fires on a clock is a document, not a routine, so this skill's job is to create the actual scheduled tasks rather than to explain how.

### 2. Probe the connectors

One cheap read per connector, never a write. Record connected, degraded, or missing.

**This is the step that makes the skill worth running.** Registering ten routines against unauthenticated connectors produces ten failing runs, and a user who turns the whole thing off.

### 3. Decide what to register

Ten routines, all first-class. There is no parked tier. What varies is **when each one has something real to say.**

Register these first, because they produce signal on day one:

| Routine | Register when |
| --- | --- |
| `morning-performance-sweep` | **At least one** analytics source is live. Without any, it writes an empty snapshot every day |
| `dashboard` | The sweep has produced at least one real snapshot. It is self-sufficient and will pull for itself, but it has nothing to render against an empty OS |
| `content-pipeline-sync` | The primary channel is reachable. Otherwise it cannot detect a publish |
| `market-scan` | Any scraping or search is available. Honest even when degraded |
| `competitor-radar` | The channel research connector is live |

Then these, once the OS has enough in it for them to be useful:

| Routine | Waits for |
| --- | --- |
| `customer-intel` | Transcripts **or** community is live. One is enough |
| `pipeline-hygiene` | A pipeline with something in it to audit |
| `campaign-sync` | A campaign. It no-ops until one is running, which is correct behaviour |
| `monthly-report` | A month of snapshots |
| `quarterly-report` | A quarter of snapshots |

Registering a report routine on day one produces a report full of gaps that teaches the user the OS does not work. Say that plainly rather than registering it and hoping.

**Then put the choice to the operator rather than deciding for them.** Present all ten with a recommended verdict each: register now, wait for a named precondition, or skip. Let them pick which set goes live in this pass. Registering one routine and proving it works beats registering ten and debugging in the dark, so if they are unsure, recommend starting with the sweep alone.

### 4. Create the schedules

**Create them. Do not explain how to create them.** Do not stop at "here is what to paste" while a mechanism is available.

#### Ask for the schedule in plain language

**A routine is a scheduled task.** Creating one means asking for a scheduled task in plain words and letting the environment pick its own mechanism. **Do not write a cron expression and do not choose a scheduling tool.** Say what you want scheduled, when, where, and with what prompt.

One request per routine, shaped like this:

> Create a scheduled task named `marketingos-dashboard`, running **daily at 10:30** in `America/Sao_Paulo`, with the working directory set to the OS root, and this prompt:
> `Run the Marketing OS dashboard routine. Read and execute @Routines/dashboard.md exactly as written. Unattended: never ask a question, make the safe assumption and note it.`
> Enable these connectors: <the ones that routine's Set it up table lists>.

The four values, and where each comes from:

- **Name** the routine's own `name:` field, so audit mode can find it by prefix later.
- **Cadence** the human cadence from the routine's `schedule:` field, in the timezone from `Context/config.md`. "Daily at 10:30", "Monday at 09:00", "the 1st of the month at 09:00". Leave it in those words.
- **Working directory** the OS root. This is the one thing a routine cannot work out for itself.
- **Prompt** the short pointer above, never a paraphrase of the routine file.

Full list of the ten with their cadences in `references/registration.md`.

#### Then verify each one took

A created trigger is not a working routine. Per `references/registration.md`: confirm it appears in the schedule list, confirm its next run time is right in the right timezone, and after its first fire confirm a log entry landed in `Intelligence/logs/`. The third is the only one that proves it works rather than merely exists.

> [!important] The order is a rhythm, not a chain
> **No routine depends on another having run.** Each one pulls whatever it needs, so any single routine run alone against a fresh OS still produces a complete result. The times matter only for efficiency: a later routine that finds numbers already dated today skips the pull.
>
> Never tell the operator that one routine has to run before another, and never register a routine on the assumption that its inputs will already be there. If a routine appears to need that, it is a bug in the routine file, not a scheduling constraint.

### 5. Report honestly

For each registered routine: name, cadence, next run, and **what it cannot do yet.**

Say where the run reports will land: each routine closes by invoking `instant-ui` to render a one-pager into `Analytics/dashboard/runs/`. That folder fills as the routines fire, and it is the fastest way to see whether a run did anything useful.

Not "the sweep is registered." Instead: "morning performance sweep registered, daily 08:00. It will pull channel and email metrics. No revenue or conversion data until the payments and product analytics connectors are authenticated, so `metrics.md` will carry gaps in the revenue and conversion sections."

For each routine not registered: which one, and the specific precondition.

## Audit mode

The reason this mode exists: **a silently dead routine is the most dangerous failure in the OS.** Everything downstream keeps looking correct while going stale, and nobody notices for weeks.

### Check four things

**1. Did it run?** Compare the registered schedule against `Intelligence/logs/`. Every brain-update routine logs every time, including a run that changed nothing. A routine with no log line on a day it should have run either did not run or failed silently. Both are findings.

**2. Did it write anything?** A routine that runs daily and has not changed a file in a week is running but not working. Check its declared write targets from `Routines/CLAUDE.md`.

**3. Is it still within budget?** Every routine declares `budgets:` in frontmatter. A routine consistently hitting its cap is queueing work every run and silently falling behind.

**4. Do the schedules still agree with config?** The `routines:` block in `Context/config.md`, the `schedule:` field in each routine file, and the cadence on the actual scheduled task must all match. Drift means someone changed one and not the others.

### Report

A table: routine, expected cadence, last log entry, last write, verdict. Verdicts are **healthy**, **ran but wrote nothing**, **silent**, or **budget-capped**.

Then the fixes, concretely. Do not just flag.

## Rules

- **Never edit a routine file to make it work.** Every value comes from `Context/config.md`. If a routine needs something that is not a key there, that is the finding: report it as a bug rather than patching around it.
- **Never register a routine whose connector is missing** unless it degrades honestly and says so in its own log. Reports and radars do not qualify.
- **The dashboard is the only hybrid.** It logs the knowledge change when it has to pull, and it also produces the deployed page. So check both: its log entry on the days it pulled, and the output file's timestamp for the rebuild itself. The other nine are brain-update and log every run, including a run that changed nothing.
- Ask before deleting or replacing an existing registration.
- On any change, update `Routines/CLAUDE.md` so the register reflects what is actually scheduled.

## Self-improvement

This skill is never finished. Improve it as you use it.

- When the user corrects how a routine was registered or audited, update `references/registration.md` so the correction sticks. Do not just fix it for this run.
- When a correction is a hard rule ("always X", "never Y"), add it as a permanent rule here.
- When a routine turns out to need a precondition this skill did not list, add it to the register-when tables above.
- When a routine cannot run without editing its file, that is a bug in the routine or a missing `Context/config.md` key. Report it as a finding and record it, rather than patching the routine.
- When the user says an audit report was genuinely useful, save it to `references/examples/` as a model for future runs. Strip the org name, handles and numbers first: the example is a shape, not a record.
- Keep the skill small: when you add something, run the deletion test and cut anything that no longer changes behavior.
