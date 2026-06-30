# Pillar 4: Capabilities

Install the suite that makes the OS act, not just store. Two layers: a CORE set installed for everyone, and an OPTIONAL set you gauge and offer because not every rep needs it and many already have a process. Every routine installs as a LOCAL scheduled task by default.

## The two layers

**Core (install for everyone, recommended on).** These make the brain self-maintaining and are the reason the OS exists. Install them by default; a rep can still decline, but lead with them as the spine.

| Capability | Type | Cadence | What it does |
| --- | --- | --- | --- |
| Morning routine | brain-update | daily AM | classify the day's calls, run call-prep per prospect, create today's deal files, capture yesterday's calls, reconcile tasks, leave a brief |
| Pipeline hygiene | brain-update | daily, after morning | reconcile in-scope deals against the CRM and proposal platform, clean fields, advance and freeze deals, flag cold ones, recompute metrics, send the consolidated brief |
| Call scoring | brain-update | twice weekly | score first calls against the rep's process |
| Monthly report | brain-update | monthly | build the intelligence report |
| Quarterly report | brain-update | quarterly | the quarterly roll-up |

**Optional (gauge, then offer).** The rep may not run this motion, or may already have a process they like. Ask a short gauge question and install only if it fits. Never push an optional capability on a rep whose process does not include it.

| Capability | Type | Gauge question (ask before installing) |
| --- | --- | --- |
| Post-discovery follow-up | action | "After a discovery call, do you send a recap and a proposal? Want that drafted for you automatically? If you already have a process you love, we can skip it." |
| Client one-pager | action | "Do you use a one-page leave-behind for prospects? Want one generated per deal? Skip it if that is not part of your motion." |
| Lead-gen and outreach | action | "Do you do outbound (sourcing plus cold outreach), or are you mostly inbound? We can skip the acquisition skills if you are inbound-only." |

**Skipped by default:** campaign metrics. Too context-dependent and low value for most reps. Offer it only if the rep explicitly runs measured outbound campaigns and asks.

## How to present the optional set (the structure)

After confirming the core set, present the optional capabilities as a short menu and gauge each in one pass, rather than interrogating one by one. For example, ask the three gauge questions together (post-call follow-up, one-pager, outbound) and let the rep pick what fits. For each one they pick:

1. Confirm it is worth automating for them (they do this motion, and they do not already have a process they would rather keep).
2. Install the skill and, where the skill has its own setup wizard, run it so the capability configures itself to the rep. Post-discovery follow-up is the clean example: install it, then run its `setup-post-disco` wizard, which gauges the rep's existing proposal and email and process and adapts. The one-pager and the acquisition skills configure from `Context/`.
3. If they decline one, note it and move on. They can add it later by re-running this pillar.

This respects the rep's existing process: gauge first, install only what fits, never overwrite a working motion.

## Embedded skill dependencies (install together or it ships broken)

Routines call skills by name. Install the routine and the skills it calls as a unit:

| Routine | Calls (must be installed with it) |
| --- | --- |
| Morning routine | `call-prep` |
| Pipeline hygiene | `call-prep` |
| Call scoring | `sales-rep-analyzer` |
| Monthly report | `sales-rep-analyzer`, `win-loss-analysis` |
| Quarterly report | `sales-rep-analyzer`, `win-loss-analysis` |

So installing the core set also installs `call-prep`, `sales-rep-analyzer`, and `win-loss-analysis`. The post-discovery follow-up bundles its own proposal generator.

## Generalized, not copied

The bundled routine prompts in `assets/routine-templates/` and the action skills are generalized versions of what BenAI runs, grounded in the same architecture (the brain-update versus action rule, logging every changed file to `Daily/logs/`, the morning then hygiene then scoring then reports cadence, the deal-file and calls conventions) but parameterized to the rep. Do not copy BenAI's tools or paths in. Fill each template from the rep's `Context/` and config: their CRM, their proposal platform, their notetaker, their email, their vault paths, their schedule times. Same skeleton, their specifics.

## Installing a routine as a local scheduled task

For each routine the rep is keeping:

1. Open its template in `assets/routine-templates/<name>.md`.
2. Fill every `{{CONFIG:...}}` and `{{PLACEHOLDER}}` from the rep's `Context/` and config (CRM, proposal platform, notetaker, email, paths, schedule times, identity).
3. Register it as a LOCAL scheduled task at the cadence in the template, pointed at the rep's vault.
4. Confirm the brain-update routines log to `Daily/logs/` and the cadence ordering holds (morning before hygiene).
5. Pre-run it once so the first unattended run does not pause on permission prompts.

**Local by default.** Provision every routine as a local scheduled task. An advanced rep can later turn their vault into an MCP and run cloud routines instead, but that is their move to make; the onboarder stands up local tasks only and says so.

## After install

Tell the rep what is now running and when, what each routine will change in the brain, and where to see it (the dashboard, pillar 5). Confirm the optional capabilities they took, and note the ones they skipped so they know they can add them later.
