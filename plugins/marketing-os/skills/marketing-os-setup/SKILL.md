---
name: marketing-os-setup
description: "Set up a Marketing OS: a markdown second brain that becomes the single source of truth every marketing skill reads, plus the routines that keep it current and a control-center dashboard on top. Interview-driven and idempotent, safe to re-run. Builds seven knowledge folders (Context, Channels, Campaigns, Offers, Analytics, Team, Intelligence) plus Routines, writes the Context layer that ends skills carrying their own stale copies of the ICP and offer and voice, scaffolds one folder per publishing surface, installs ten independent routine prompts, then offers to schedule them via marketing-os-routines and to build the eleven-page control center via marketing-os-dashboard. Walks five pillars in order: connectors, Context, structure, routines, dashboard. Use when the user says 'set up a marketing OS', 'build my marketing second brain', 'marketing os setup', 'install the marketing OS', 'I want a marketing operating system', 'give my marketing skills real context', or runs /marketing-os-setup."
disable-model-invocation: true
---

# Marketing OS Setup

Build the user a Marketing OS. Not a folder of templates, a working operating layer: the intelligence in `Context/`, the routines that keep it current, and a dashboard that answers "what do I do today."

## State the problem once

Every skill that carries its own copy of the ICP, the offer and the voice means updating one leaves the rest stale. This OS makes `Context/` authoritative so every skill inherits a change instead of drifting.

Say that in a sentence and move on. Do not pitch it further, and do not go looking for evidence: if the user wants their own duplication counted, they will ask.

## The five pillars, in this order

Order matters. Do not skip ahead, and do not build the dashboard before there is data.

| Pillar | What happens | Reference |
| --- | --- | --- |
| 1. Connectors | Probe what is actually authenticated. Never present a checklist | `references/connectors.md` |
| 2. Context | Interview and write the constitution. **The highest-value step** | `references/interview.md`, `references/context-templates.md` |
| 3. Structure | Scaffold seven knowledge folders plus `Routines/`, and every folder index | `references/structure.md`, `references/folder-indexes.md` |
| 4. Routines | Install ten independent prompts, then offer to schedule them | `assets/routines/`, then `marketing-os-routines` |
| 5. Dashboard | Write the spec, then offer to build it | `marketing-os-dashboard` owns the build |

Read `references/conventions.md` before writing a single file. It carries the invariants, and breaking one means the result is not this OS.

## Three rules that come before everything else

### Stay inside the OS root

**Read and write only inside the OS root the user gave you.** Nothing else on the machine is in scope.

Do not list, glob, grep or read outside that root. Do not go looking for their other vaults, their skill folders, their home directory, or an example OS shipped with a plugin. **Do not start an exploration nobody asked for.** If you think something outside the root would help, name the one path you want and ask for it. Wait for a yes.

The only exceptions are the ones the user hands you: a path they name, a public property of theirs they point at, and the connectors they have authenticated.

### Start from zero

**Run this as though you know nothing about the user or their business, because anything you appear to know, you guessed.**

Your context may hold a person's name, an email, a system username, a folder path, a git config, a connected account, or a company name. None of it was given to you for this. Treat all of it as absent: never echo it, never address the user by it, never put it inside a question, never pre-fill a field with it, and never ask them to confirm it.

**Naming it is worse than asking, not safer.** "I have you as Dana at Acme, confirm?" announces the guess and makes the user correct you about themselves. Both of these are the same failure:

| Wrong | Right |
| --- | --- |
| "Point me at your real Acme material" | "Point me at the material you want me to read" |
| "I have you as Dana, dana@acme.co. Confirm?" | Do not raise it at all |
| "Confirm your org name and timezone (Acme, GMT-3)" | "What is the business called, and what timezone should the routines run in?" |

**You are allowed to ask about the business.** What it is called, what it sells, who it serves, who this is being set up for, what timezone the routines run in. All of that is necessary and none of it is a guess. Ask open, and let them fill it.

The line: **the business is the subject and you learn it by asking. The person at the keyboard is not the subject at all.** `operator_name` and `operator_email` are optional keys that stay empty unless volunteered unprompted, and nothing downstream reads either one.

### Everything in this OS comes from this user's own business

Other operating systems may sit on this machine: one belonging to whoever built this skill, a reference implementation, another company's vault. **None of that is a source, and none of it is yours to go find.**

An OS seeded from another business reads as finished, so nobody goes back to check it, and the user ends up publishing somebody else's strategy in their own name.

Before you read any file to populate this OS, it must pass all three:

1. The user named it, or it sits inside the OS root, or it is a public property the user owns.
2. It is about **their** business, not a template with real data left in it.
3. You can put it in a `source:` frontmatter field and the user would recognise it as theirs.

If something looks useful but fails one of those, **name it and ask** before reading a line of it. Discovering a vault is not the same as being handed one. When in doubt, interview: a thin file built from honest answers is the correct output, and a borrowed answer is a species of invention.

The same holds for the dashboard shell and the routine files this skill ships. They are deliberately business-agnostic. If you find a real company name, handle, price, metric or quote in either, that is a bug in the asset. Strip it, do not propagate it.

## Before you start

**Confirm the root.** Offer concrete paths rather than asking an open question: alongside an existing second brain of theirs, nested inside it as a subfolder, a fresh folder in their documents, or a path they name. If they already have a second brain, prefer nesting over creating a rival root.

**Offer options at every decision point.** Where the interview asks the user to choose rather than to describe (which channels, which surfaces originate, solo or team, which offers form the ladder), put five to ten concrete candidates on the table and let them pick or correct. Reserve open questions for the things only they can supply: the enemy, the verbatim pain language, the binding constraint.

**Confirm the primary channel.** Exactly one publishing surface is `role: primary-original` and everything else repurposes from it. If they cannot name one, that is a strategy problem worth surfacing now rather than modelling around.

**Idempotent.** Safe to re-run. Never overwrite an authored `Context/` file without asking. Re-running should fill gaps, not reset work.

## Pillar 1: connectors

Probe, do not ask. Attempt a real call against each and record what actually works.

The OS degrades gracefully by design, so a missing connector is a documented limitation rather than a blocker. Write the result into `Context/infrastructure.md` with the degradation table from `references/connectors.md`, so every routine knows what it loses.

Do not stall setup waiting for authentication. Note the gaps and continue.

## Pillar 2: Context, the one that matters

Use the exact paths in `references/context-templates.md`. They are not arbitrary: vault-aware skills resolve context **by literal path**, so a rename means those skills stop finding their context, which defeats the entire purpose.

**One file per ICP segment, with its pain points inside it.** Pain points are properties of a segment, not a category of their own, so there is no `pain-points.md` and no `pain-points/` folder. If they name three buyer types, that is three files. If they cannot name one clearly, stop and fix that before writing anything else, because a vague ICP produces vague content forever.

Two rules while interviewing:

- **Write what they say, not what sounds good.** A vague ICP produces vague content forever. Push for specifics: who they are not, what they say verbatim, which pain they lead with.
- **`config.md` is the only file a new operator rewrites end to end.** Every instance literal a routine needs is a key there. If you later find a routine needing a value that is not in `config.md`, that is a bug in the routine, not a gap in the interview.

## Pillar 3: structure

Scaffold from `references/structure.md`. Seven knowledge folders plus `Routines/`, each with its own `CLAUDE.md` from `references/folder-indexes.md`.

**Root holds `CLAUDE.md` and folders. Nothing else.** The exclusions are enumerated in `references/structure.md`, which is also the copy that ships into the OS as its own contract.

**Apply the design test to every folder before you create it:** it is either permanent context or a named routine writes to it. Never scaffold a folder they will not fill, because an empty folder with no routine teaches the operator that this OS is full of things to ignore.

`Channels/` is the one genuinely per-business part. Ask which surfaces they **actively produce for** and scaffold only those, with `strategy.md`, `voice.md`, and `pipeline/` plus `published/`. An email channel takes `flows/` and `broadcasts/` instead, because a trigger is what defines an email. Exactly one channel is `role: primary-original`.

**Two questions that decide the shape:**

- **Solo or a team?** Solo skips `Team/` entirely. Ask, do not assume.
- **Do they produce for their website?** A blog or SEO makes the website a channel. Otherwise its pages belong to the offers they sell, as `Offers/<offer>/landing.md`.

### Seed files, beyond Context and the folder indexes

Easy to miss, and the routines read or write every one of them. Create all of these:

| File | Why |
| --- | --- |
| `Channels/<primary>/_template.md` | The asset record contract |
| `Campaigns/_template.md` | The campaign shape: `brief.md` + `deliverables/` + `results.md` |
| `Offers/<offer>/proof/README.md` | Names what proof would need collecting. **Never invent a testimonial to fill it** |
| `Analytics/metrics.md` | The live scoreboard |
| `Analytics/what-works.md` | The pattern library. **Confirmed section ships empty** |
| `Analytics/dashboard/spec.md` | The dashboard contract, and the only dashboard file you create. `marketing-os-dashboard` reads it and builds the page |
| `Analytics/dashboard/runs/` | Empty folder. Each routine renders its run report here via `instant-ui`. Create it so the first run has somewhere to write |
| `Team/<person>/tasks.md` | One per person, if `Team/` exists at all |
| `Intelligence/competitors/_roster.md` | Who the radar tracks and why |
| `Intelligence/research/voice-of-customer.md` | The append-only quote bank |
| `Intelligence/research/frameworks/os-structure-contract.md` | Copy `references/structure.md` in. The OS should carry its own contract so it can be ported or audited without the plugin |

Do **not** create `Analytics/dashboard/control-center.html`. That file belongs to `marketing-os-dashboard`.

**Verify the install by resolving paths.** Grep the routine files for backtick-quoted paths, substitute `<primary_channel>` from `Context/config.md`, and confirm each one either exists or is a declared write target of a routine. Anything left is a missing seed file.

## Pillar 4: routines

Copy all ten files from `assets/routines/` into `Routines/`, flat, and `_register.md` as `Routines/CLAUDE.md`.

**Ten routines in two groups, all first-class.** Five operating routines keep the OS current and true. Five intelligence and review routines keep it smart, and they are why `Intelligence/` earns its place, since no operating routine writes it. There is no parked tier and no subfolder: a routine either belongs in the OS or it does not ship.

**A routine is a schedule.** Each file opens with a **Set it up** block giving the schedule and the connectors, then a divider. Everything below the divider is the routine's prompt. Installing the files does not make anything run; scheduling them does, and that is `marketing-os-routines`' job.

**Substitute every placeholder.** The files ship business-agnostic with `<angle bracket>` markers: `<operator timezone>`, `<primary channel platform>`, `<email platform>`, `<primary>` in a path, and so on. Fill them from the Pillar 1 probe and `Context/config.md`. The mapping is in `_register.md`.

> **Then grep `Routines/` for `<`. A placeholder left unsubstituted is a setup bug**, and it will end up in a live scheduled task without anyone noticing.

**Every routine is independent.** Each scheduled task points at the OS root and runs one routine. No routine may reference another as a prerequisite. If you find yourself adding "after the sweep runs", that is a bug: run alone, that routine produces an empty result and no error.

### Then ask whether to schedule them now

The files are installed and all ten carry `status: authored-not-registered`. Nothing runs until something fires them on a clock.

**Ask:**

> The ten routine files are in. Want me to schedule them now, or leave them for later?

- **Now** → **invoke `marketing-os-routines` via the `Skill` tool.** It owns scheduling: it probes the connectors first, tells you which routines can produce real signal today, creates the scheduled tasks, and verifies each one took. Do not create schedules yourself and do not duplicate its connector probe.
- **Later** → leave them as files, say so plainly, and give them the one command: `/marketing-os-routines`.

Recommend scheduling only what the Pillar 1 probe showed can work. A routine whose every pull fails writes a day of `not available` rows and teaches the operator to ignore the output, which is worse than an unscheduled file.

## Pillar 5: dashboard

**You do not build the dashboard. `marketing-os-dashboard` owns it end to end**, and it ships the shell, so there is exactly one copy of a 160KB file and one place the first build can happen.

Your job here is two things:

1. **Write `Analytics/dashboard/spec.md`** as the contract, with what you learned in the interview: which channels exist, which one originates, how many offers, solo or team, whether anything is time-boxed right now. The dashboard skill reads it so it does not have to re-ask.
2. **Ask whether they want the dashboard now.**

> The OS is built. Want me to build the control center dashboard on top of it now, or leave that for when there is data in it?

- **Now** → **invoke `marketing-os-dashboard` via the `Skill` tool.** It runs its own first-build interview, renders all eleven pages, verifies, and asks before deploying anywhere. Let it do all of that: do not pre-empt its interview and do not copy a shell yourself.
- **Later** → stop at `spec.md` and give them the one command: `/marketing-os-dashboard`.

**Recommend "later" when no analytics pull has produced real data yet**, which on a fresh setup is always. Say why in one line: against an empty OS the page is placeholders, and a dashboard that opens empty on day one teaches the operator to ignore it. Better to schedule the sweep, let it run once, then build.

If they want it anyway, that is a fine choice and the dashboard skill has a seed mode for exactly this: a standing warning that no routine has run, and every empty panel naming the routine that will fill it. Hand off and let it handle that.

## The rule that protects the whole thing

**Empty is honest.**

Do not fill `Analytics/what-works.md` with plausible marketing advice. Do not invent a metric to complete a table. Do not write a customer quote nobody said.

Every content skill reads `what-works.md` before drafting and **cannot tell a placeholder from a finding.** One invented pattern there degrades every future draft. An empty file that names the routine which will fill it is the correct output.

The same applies to numbers. A gap says "not pulled" with the date. A carried-over value says it was carried and when it was really measured.

## Before you report, audit the OS for foreign content

One grep, and it catches the worst failure mode this skill has.

Search the finished OS for any company name, person, handle, domain, price or platform account that is **not the user's.** Start with the org name and operator name from `Context/config.md`: every proper noun in the OS should either be one of theirs, a tool they use, a competitor they named, or a customer they quoted with a source.

Anything else came from a template or from another business's records. Remove it and say so. A single leftover handle in a routine will end up in a live scheduled task and pull somebody else's numbers into their dashboard.

Then grep `Routines/` for `<`. A placeholder left unsubstituted is the same class of bug.

## What to tell the user at the end

1. What was created, by folder.
2. Which connectors are live and which routines are degraded as a result.
3. The three next actions, in order: authenticate the remaining connectors, run the morning performance sweep once by hand for a real baseline, then register routines one at a time as their connectors come online.
4. That the data layers are deliberately empty and roughly a month of runs is what makes the OS useful. The context layer is already useful today.

Do not oversell it. The honest framing is that the infrastructure is built once and the intelligence compounds from here.

## Self-improvement

This skill is never finished. Improve it as you use it.

- When the user corrects how a pillar was run, update the relevant reference file (`references/connectors.md`, `references/interview.md`, `references/context-templates.md`, `references/structure.md`, `references/folder-indexes.md`, `references/channel-templates.md`, `references/conventions.md`) so the correction sticks. Do not just fix it for this run.
- When a correction is a hard rule ("always X", "never Y"), add it as a permanent rule here.
- When an interview answer reveals a business shape the tree does not cover, add a row to the adaptation table in `references/structure.md` rather than improvising the same fix next time.
- When a routine needs a value that is not a key in `Context/config.md`, that is a bug in the routine. Record it in `assets/routines/_register.md` instead of hardcoding the value.
- When the user says a built OS was genuinely good, save its `Context/config.md` shape and folder tree to `references/examples/` as a model for future runs.
- Keep the skill small: when you add something, run the deletion test and cut anything that no longer changes behavior.
