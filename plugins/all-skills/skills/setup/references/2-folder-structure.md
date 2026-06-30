# Pillar 2: Folder structure and conventions

Build the structure, then write the conventions into the `CLAUDE.md` files. The conventions are what keep the brain consistent after you leave, so they ship into every folder, not just the root.

## The structure

Under the rep's chosen root:

```
Context/        the second brain (pillar 1)
Lead-Gen/       outbound campaigns, cadences, the lead-gen SOP (campaigns/, sequences/)
Deals/          one file per active deal, plus the metrics file
Calls/          one file per sales call: summary, notetaker link, score
Templates/      proposal, one-pager, email, SOW, NDA masters
Intelligence/   the monthly and quarterly reports
Daily/          the rolling task list and the per-day routine logs (tasks.md, logs/)
Skills/         the manifest of installed routines and skills
```

Create only what the rep's capabilities need. If they took no outbound (pillar 4), `Lead-Gen/` can stay minimal. If they took no one-pager, the one-pager master is skipped.

## Write a CLAUDE.md into every folder

Every file is named `CLAUDE.md` on disk, at the root and inside each folder alike. They differ by role, not by name: the root one is the main brain file; each folder's is an index of that folder. Every root-level folder gets one. Do not skip any. Two templates drive this, both in `assets/claude-md-templates/`:

- **The main one (root):** write the root `CLAUDE.md` from `main.md`, adapted to the rep's tools and paths.
- **The index ones (each folder):** generate the folder's `CLAUDE.md` at runtime from the single generic template `index.md`. There is one template, not one per folder, on purpose. For each of `Context/`, `Lead-Gen/`, `Deals/`, `Calls/`, `Templates/`, `Intelligence/`, `Daily/`, and `Skills/`, fill it in for that specific folder:
  1. **What the folder is for** the one-line job, taken from the routing table in the root `CLAUDE.md`.
  2. **What's in here** an index of the folder's real contents at build time (the files and subfolders, one line each), so the OS stays navigable. If a folder is empty for now, say what will land there. This index is the point of the per-folder file: it indexes the folder.
  3. **Conventions** the rules scoped to that folder, drawn from the convention list below.

Generate these from the live folder contents, not from a fixed list, so each `CLAUDE.md` describes what is actually there. When a routine or skill later adds or removes files in a folder, it refreshes that folder's "What's in here" index in the same change.

## The conventions (scope these into each folder's CLAUDE.md)

The conventions to embed, each into the folder it governs:

- **Brain-update versus action.** Brain-update routines change what the OS knows and log every file they touch to `Daily/logs/YYYY-MM-DD.md`. Action automations create a deliverable and do not log. This is the line the whole system runs on.
- **Routing.** Every piece of information has one home (the table above). No catch-all, no notes in the root.
- **The deal-file structure.** One file per prospect, named by the prospect. Tracking freezes the moment a deal is won or lost, because this is sales, not fulfilment. Frontmatter: status (mirrors the CRM stage), prospect, company, email, deal size, source. Sections: a snapshot, a history with newest at the bottom, the next step. Trust the proposal platform's status over a stale CRM stage.
- **The calls convention.** Sales calls only, classified by attendee not by title. Store the summary plus the notetaker link, never the full transcript. Score first calls only.
- **The logging convention.** One `Daily/logs/` file per day. Every brain-update routine writes to that day's file, naming each file it created or changed. No silent writes; a routine that touched nothing still logs that it ran.
- **Wikilinks.** Every entity (person, company, deal, call, tool, template) is a wikilink woven into a sentence, never a bare list.
- **The self-model.** When a folder, file, convention, or capability is added or renamed, update the root `MAP.md` in the same change; when a decision or durable fact lands, append it to `MEMORY.md`. See `references/6-map-and-memory.md`.
- **No em dashes. CRM is augmented, never replaced.**

## Done when

The folders exist, every root-level folder has its own index `CLAUDE.md` generated from `index.md` (purpose, an index of what's in it, and the conventions that govern it), the main root `CLAUDE.md` from `main.md` carries the conventions adapted to the rep, and the rep understands the brain-update versus action rule and the deal-file structure. Write the first `MAP.md` from `assets/map-templates/` now that the structure exists; you finalize it and add `MEMORY.md` in Pillar 6. Then move to pillar 3.
