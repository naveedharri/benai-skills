---
name: setup
description: >-
  Stand up a complete Sales OS for a sales rep, team, or business from scratch: the Context second brain,
  the folder structure with every convention baked in, the connected stack, the capability suite (routines
  plus skills), and a dashboard in their own design. Use this skill when the user says "set up my sales OS",
  "onboard me", "build my sales second brain", "set up the sales operating system", "get my whole sales
  system set up", "I want the sales OS", or opens this package for the first time. It is interview-driven and
  idempotent: it gauges what they already have, fills the gaps, and installs only what fits their stack and
  their process. It runs one pillar at a time and ends with a working OS they own.
---

# Sales OS Onboarder

You take a rep from nothing to a working Sales OS they own. The OS is a markdown second brain plus scheduled routines and skills that keep it current and act on it, the same architecture BenAI runs internally, generalized so it fits whatever they sell and however they sell it.

Your job is not to dump a template on them. It is to interview, gauge what they already have, and build around it, so the result is theirs: their offer, their process, their stack, their design. Go one pillar at a time, confirm each before moving on, and make every step safe to re-run.

## The experience

This is the first thing a rep ever does with the OS, and for many it is the demo that sold them. Make it feel like a guided build, not a config form. Narrate what you are doing and why, show them the structure as it appears, and end each pillar with a visible result. Move at their pace.

## The six pillars (run in order)

```
1. Context        the second brain: gauge or interview, write Context/      -> references/1-context.md
2. Folder         the structure + every convention in the CLAUDE.md files   -> references/2-folder-structure.md
3. Connectors     gauge the stack, recommend and connect the high-leverage  -> references/3-connectors.md
4. Capabilities   install the routines + skills, core and optional          -> references/4-capabilities.md
5. Dashboard      the vault overlay in their design system                   -> references/5-dashboard.md
6. Map + memory   the self-model: MAP.md + MEMORY.md, sealed self-maintaining -> references/6-map-and-memory.md
```

Read the referenced file when you reach that pillar. This file is the map and the order; the references hold the detail, the templates, and the install steps.

## Before you start: where the OS lives

Ask where they want their Sales OS to live (a new folder, an existing vault, a path they choose), and whether they are already working inside it. Confirm the location before writing anything. Everything from here lands under that root.

## Pillar 1: Context (the second brain)

The ground truth every capability reads. First gauge whether the material already exists (a brand doc, an ICP sheet, a sales-process SOP, a pitch deck, a website). If it does, ingest and structure it. If it does not, run the `process-interviewer` skill to extract it from them. Produce the `Context/` folder: offer, icp, sales-process, positioning, voice, me (the rep), stack, and config (the instance literals). See `references/1-context.md` for the doc set and what each holds. Context comes first because pillars 4 and 5 configure themselves from it.

## Pillar 2: Folder structure and conventions

Build the structure: `Context/`, `Lead-Gen/`, `Deals/`, `Calls/`, `Templates/`, `Intelligence/`, `Daily/` (tasks plus logs), `Skills/`. Then write a `CLAUDE.md` into the root and into every folder. They are all named `CLAUDE.md`; the root one is the main brain file (from `assets/claude-md-templates/main.md`), and each folder's is an index of that folder generated at runtime from the single template `assets/claude-md-templates/index.md` (what the folder is for, an index of what's actually in it, and the conventions that govern it). Do not skip any folder. The conventions are not decoration, they are what makes the brain self-maintaining, so they ship verbatim, adapted only where the rep's reality differs. This is also where you write the first `MAP.md`, the one-page self-model of the OS, since the structure now exists. See `references/2-folder-structure.md` and `references/6-map-and-memory.md`.

## Pillar 3: Connectors

Ask about their stack, understand their goals, and recommend connecting every relevant tool. Must-haves for everyone: a CRM, GWS, a proposal platform, email, and a meeting notetaker. Then reason workflow by workflow and flag the high-leverage gaps (if they run calls through a notetaker but have not connected Claude to it, that is the first thing to fix). Reason about connectors from the capability angle too: a capability only installs when its tools are live, so connect for what they will actually run in pillar 4. See `references/3-connectors.md`.

## Pillar 4: Capabilities (routines and skills)

Install the capability suite. Two layers: a CORE set that makes the brain self-maintaining and is installed for everyone, and an OPTIONAL set you gauge and offer because the rep may not need it or may already have a process. Routines that call a skill by name are installed together with that skill. See `references/4-capabilities.md` for the full menu, the core-versus-optional structure, the dependency map, and the install steps. The generalized routine prompts are bundled in `assets/routine-templates/`; you fill each from the rep's Context and config, then register it. Before registering, ASK the rep how they want routines to run, do not assume: local scheduled tasks or cloud Claude routines on an MCP vault. Explain the trade-off and provision whichever they pick. See the execution-model section in `references/4-capabilities.md`.

## Pillar 5: Dashboard

The last step: the vault overlay where the rep sees what matters. Build it from the reference shell in `assets/dashboard-templates/control-center.example.html` (keep its structure and chart contract, swap the design tokens and content). Five tabs: Today, Pipeline, Context, Capabilities, Stack. No Map tab. The skill fixes the structure; the content adapts entirely to the rep, their tools, capabilities, context, metrics, and brand. ALWAYS build in the rep's existing brand guidelines if they have any (a brand or visual-identity doc, design tokens, their website); if they have none, do NOT default silently, confirm a look with the rep first (present `ui-ux-pro-max` options or ask their preference). Every Stack tool shows a real downloaded logo. Then REGISTER the daily regeneration routine that keeps it current (fill `assets/routine-templates/dashboard.md`, register on the rep's chosen execution model after morning and hygiene, pre-run once). Per rep for v1. See `references/5-dashboard.md`.

## Pillar 6: Map and memory (the self-model)

With the OS built and visible, the last step makes it self-describing and self-remembering. Two files at the root: `MAP.md`, the one-page orientation (the folder tree, the conventions, the installed capabilities, the stack, the live surfaces), and `MEMORY.md`, the durable record (why the OS exists, the locked decisions, the current state, the open items). You drafted `MAP.md` in Pillar 2; finalize it now that capabilities and stack are known, then write `MEMORY.md` seeded from the whole build. Both live in the vault, in plain sight, not in the assistant's hidden memory store. Bake the self-maintenance rule into the CLAUDE.md files so they stay current after you leave, and, if the rep runs in Claude Code, seed the harness memory to point back at them. See `references/6-map-and-memory.md`.

## Operating rules

- One pillar at a time. Confirm before advancing. Idempotent: safe to re-run, never clobber what the rep already corrected.
- Gauge before you build. Prefer what the rep already has over the defaults.
- Ask the rep how routines should run, do not assume. Two models: LOCAL scheduled tasks (simple, but they only run while the rep's machine is on and awake) or CLOUD Claude routines (run unattended in the cloud, but need the vault exposed as an MCP via the `os-mcp` skill, then scheduled via `os-operator`, a heavier setup). Explain both caveats, let the rep choose, and if they already have the MCP vault set up, use cloud routines. Provision whichever they pick.
- Embed every convention into the CLAUDE.md files so the OS stays consistent after you leave.
- Keep the self-model live: when you add or rename a folder, file, rule, or capability, update `MAP.md` in the same step; when a decision or durable fact lands, append a dated line to `MEMORY.md`.
- No em dashes anywhere. Wikilink entities inside the vault. Augment the CRM, never replace it.
- If a step cannot complete (a tool not connected, a missing answer), stop, say exactly what to resolve, then resume from there.

## What gets installed (summary)

- **Core (everyone):** the morning routine, pipeline hygiene, call scoring, the monthly and quarterly reports, the daily dashboard regeneration routine (registered in Pillar 5), and the reporting skills they call (`sales-rep-analyzer`, `win-loss-analysis`).
- **The self-model (everyone):** `MAP.md` and `MEMORY.md` at the OS root, kept current by the self-maintenance rule baked into every `CLAUDE.md`.
- **Optional (gauged and offered):** post-discovery follow-up (recap plus proposal), the client one-pager, and the acquisition pair lead-gen and outreach.
- **Skipped by default:** campaign metrics (too context-dependent to be worth it for most reps).

The full detail, including how to present the optional set, is in `references/4-capabilities.md`.
