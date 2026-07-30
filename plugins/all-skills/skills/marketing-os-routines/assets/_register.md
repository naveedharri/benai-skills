---
type: guide
status: active
tags: [marketing-os, routines, guide, register]
---

The scheduled routines that keep this OS current. Each file is a complete, copy-pasteable prompt that runs unattended, not a description of what a routine should do.

> [!important] This folder is why the tree is an operating system rather than a filing cabinet
> The design test: every folder is either permanent context or has a named routine writing to it. This folder holds the second half of that sentence.

> [!important] A routine is a scheduled task
> Every routine file opens with a **Set it up as a scheduled task** block: the cadence, the connectors, and a divider. The scheduled task's prompt points at the file rather than inlining it, so editing a routine takes effect on the next run with nothing to recreate. Cadences stay in plain words, never cron. `marketing-os-routines` creates these.

## The register

| Tag | Meaning |
| --- | --- |
| **B** | Brain-update. Changes what the OS knows. Logs to `Intelligence/logs/YYYY-MM-DD.md` |
| **A** | Action. Produces a deliverable. Does not log |
| **H** | Hybrid. Does both. Logs only the knowledge change |

### Operating routines: keep the OS current and true

| Routine | Tag | Cadence | Writes to |
| --- | --- | --- | --- |
| `morning-performance-sweep.md` | B | daily, early | `Analytics/channels/`, `Analytics/snapshots/`, `Analytics/metrics.md`, `Intelligence/logs/` |
| `content-pipeline-sync.md` | B | daily | `Channels/<channel>/pipeline/` and `published/` |
| `campaign-sync.md` | B | daily while a campaign runs | `Campaigns/<campaign>/results.md` |
| `dashboard.md` | **H** | daily, last | `Analytics/dashboard/`, and `Analytics/` when it has to pull |
| `monthly-report.md` | B | monthly | `Analytics/reports/` |

Without these the OS goes stale and the dashboard starts lying.

**There is exactly one dashboard routine and it updates the whole dashboard.** `dashboard.md` is self-sufficient: it reads files when the day's numbers already exist and pulls them itself when they do not. Somebody who wants a current dashboard runs it and nothing else. That is why it is a hybrid rather than a pure action.

**`campaign-sync.md` runs daily and no-ops most days.** A campaign is time-boxed, so a weekly check can miss a kill threshold by six days. One log line is a cheap no-op.

### Intelligence and review routines: keep the OS smart

| Routine | Tag | Cadence | Writes to |
| --- | --- | --- | --- |
| `market-scan.md` | B | daily | `Intelligence/market/`, seeds the idea backlog |
| `customer-intel.md` | B | weekly | `Intelligence/research/`, the pain sections in `Context/icp/` |
| `competitor-radar.md` | B | weekly | `Intelligence/competitors/` |
| `pipeline-hygiene.md` | B | weekly | `Team/<owner>/tasks.md`, one digest |
| `quarterly-report.md` | B | quarterly | `Analytics/reports/` |

**These are why `Intelligence/` earns its place.** No operating routine writes `Intelligence/market/`, `competitors/` or `research/`, so without this group those folders pass the design test only on the technicality that a human is supposed to update them. With this group they have named routines.

`pipeline-hygiene.md` is the odd one out and worth keeping for that reason: it audits the OS against itself. Stale drafts, empty cadence slots, dead links, root strays. The only routine whose subject is the OS rather than the market.

**Nine are brain-update. `dashboard.md` is the only hybrid.**

## Every routine ends with a run report

All ten close by invoking the **`instant-ui`** skill to render a one-page visual summary of the run, written to `Analytics/dashboard/runs/YYYY-MM-DD-<routine>.html`.

Why a separate skill rather than a template in this folder: `instant-ui` owns the brand's HTML design language, so there is exactly one place that language lives. The control center borrows the same chassis. A run-report template kept here would drift from both within a month.

The contract every routine follows:

| Rule | Why |
| --- | --- |
| Tell it you are **unattended** | It is content-first and asks for missing copy by default. A scheduled task cannot answer, so a question means no page at all |
| Hand it **finished copy** | It will not invent content. A section you omit renders as an explicit gap, which is correct |
| A gap is `not pulled` with the connector named | Never a zero. A zero is a claim about reality |
| Every number carries its pulled date and source | Same rule as the files the run just wrote |
| If `instant-ui` is missing, skip the report | Note it in the log line. Never hand-roll a page |

**The report is a rendered view, never a source.** The log entry in `Intelligence/logs/` is the record. Nothing reads a run report back, so one going missing costs convenience rather than correctness.

## Placeholders the setup skill substitutes

These files ship with `<angle bracket>` placeholders so they are business-agnostic. Setup fills them from the connector probe and the interview:

| Placeholder | Filled with |
| --- | --- |
| `<operator timezone>` | `Context/config.md` → `operator_timezone` |
| `<primary channel platform>` | The connector for the surface marked `role: primary-original` |
| `<channel research tool>`, `<scraping tool>`, `<web fetch tool>` | Whatever research connectors actually authenticated |
| `<email platform>`, `<billing platform>`, `<web analytics>`, `<community platform>`, `<deploy target>` | The matching live connector, or the name of the gap |
| `<primary>` in a path | The primary channel's folder name |
| `<email channel>` | The email channel's folder name |

**A placeholder left unsubstituted is a setup bug.** Grep for `<` in `Routines/` after install.

## Status on install

All ten ship as `status: authored-not-registered` and **all ten are first-class.** There is no parked tier and no subfolder: a routine either belongs in the OS or it does not ship.

**Register nothing before its connectors are authenticated**, because a routine whose pulls all fail writes a day of `not available` rows and teaches the operator to ignore the output.

**Register in this order**, which front-loads the ones that produce signal on day one: the morning sweep, the dashboard, the content pipeline sync, then the market scan and competitor radar, then customer intel once there are calls or community posts to mine, then pipeline hygiene once there is enough in flight to audit. Campaign sync waits for a campaign, and the two reports wait for a month and a quarter of data.

## Rules for writing one

- **Write it as a prompt, in the second person.** If it reads like documentation it will not run.
- **Every routine runs completely on its own.** No routine may assume another has run, reference another as a prerequisite, or read a file another was supposed to write. If it needs a number it does not have, **it pulls that number itself.** "The sweep did that earlier and you read what it wrote" is a bug: run alone, that routine produces an empty result and no error.
- **State the boundary as what you do not WRITE**, never as what somebody else supplies.
- **Never open with a circular path.** "the OS at the path in `Context/config.md`" requires reading a file inside the OS to find the OS. Open by stating the routine has been pointed at the root and all paths are relative to it.
- **Degrade, never fail.** Carry an "If something you expect is missing" table. A young or half-populated OS must still produce a complete run.
- **Declare the category.** B logs, A does not, H logs only the knowledge change.
- **Give it a budget and mean it.** On breach, queue the remainder, log what was skipped, stop.
- **No instance literals.** Every name, handle, time, threshold and URL comes from `Context/config.md`.
- **"Unattended. Never ask a question. Make the safe assumption and proceed."** Include that line.
