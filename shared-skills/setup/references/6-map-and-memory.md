# Pillar 6: Map and memory (the self-model)

The OS should be able to describe itself and remember itself. Two files at the root do that: `MAP.md`, the one-page orientation, and `MEMORY.md`, the durable record. Together they are the self-model. This is the same pattern BenAI runs internally, made vault-resident and visible rather than hidden in the assistant's private memory store, so the rep can read and edit it like any other file.

## Why this matters

An agent that opens the OS cold needs two things fast: what is here and how it is wired (the map), and why it is the way it is, what was decided, where things stand (the memory). Without them an agent leans on whatever it can scrape together, and hard-won context is lost between sessions. The map and memory make the OS legible to every future agent and to the rep.

A note from how this OS was designed: BenAI's own version of this record lived only in the assistant's private memory store, invisible in the vault, and agents kept citing a "map" the owner could not find. That is the failure this pillar prevents. The self-model lives in the vault, in plain sight.

## The two files

| File | Role | Written | Updated |
| --- | --- | --- | --- |
| `MAP.md` | One-page orientation: the folder tree and what each holds, the conventions, the installed capabilities, the connected stack, the live surfaces. Read first. | Initial version in Pillar 2 (the structure exists), finalized here (capabilities and stack are now known). | On any structural change: a folder, file, convention, or capability added or renamed. |
| `MEMORY.md` | The durable record: why the OS exists, the locked decisions and the reason for each, the current state, the open items, the hard-won lessons. | Here, seeded from Pillars 1 to 4 (offer, ICP, decisions, installed capabilities). | Whenever a decision is made or a durable fact is learned. Append, dated, newest at the bottom. |

Templates for both are in `assets/map-templates/`. Fill them from the rep's Context, config, and the choices made during the build. Do not leave `{{tokens}}` behind.

## The self-maintenance rule (this is what makes it stick)

The rule ships verbatim in the root `CLAUDE.md`, with an echo in each subfolder `CLAUDE.md`, so the OS keeps its self-model current after you leave:

> When you add, rename, or remove a folder, file, convention, or capability, update `MAP.md` in the same change. When you make a decision or learn a durable fact, append a dated line to `MEMORY.md`. `MAP.md`, `MEMORY.md`, and the `CLAUDE.md` routers are the OS's self-model. Keep them in lockstep.

Treat the map exactly like the CLAUDE.md files. It is not optional documentation, it is part of the structure, and a change that does not update it is incomplete.

## Optional: seed the assistant's memory (Claude Code only)

If the rep runs in Claude Code, also seed the harness memory so the OS surfaces itself on recall: write a short memory whose body points back to the vault `MAP.md` and `MEMORY.md` as the source of truth, and add its one-line pointer to the memory index. This gives auto-recall without moving the truth out of the vault. Claude Desktop Cowork has no such store, so this is a bonus, not a requirement. The vault files are always the source of truth; the harness memory only points at them.

## Done when

`MAP.md` and `MEMORY.md` exist at the OS root, both reflect the rep's real build with no tokens left, the self-maintenance rule is in the CLAUDE.md files, and (in Claude Code) the harness memory points back to them. The OS can now describe and remember itself, and it will keep doing so as it grows.
