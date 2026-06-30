# F9 — Architecture & Discoverability (the why)

**Source:** practitioner field notes from operators running second brains under co-worker Claude. Not from a single canonical framework — distilled from where F1–G7 + F8 still leave gaps.

## Core thesis

Per-file lint cannot tell you whether the **vault as a whole orients a fresh agent**. F1 audits a CLAUDE.md's content quality. F2 audits wikilink integrity. F8 audits semantic synthesis. None of them walks the path a co-worker Claude actually takes:

> root `CLAUDE.md` → routing entry → folder index file (whatever the user's convention is) → file

If any link in that chain is wrong, stale, or missing, the agent never finds the file — even if the file itself is perfectly written. F9 walks that chain end-to-end and surfaces every break.

**F9 never assumes folder names — and never ignores folders that don't fit a standard pattern.** The Step 1.5 role-discovery pass classifies every folder. Standard roles (identity, context, projects, decisions, daily, meetings, transcripts, resources, skills, archive) are patterns the agent recognizes. Anything that doesn't match becomes a **custom role** — `Building/`, `Garden/`, `Inbox/`, `Sandbox/`, `Lab/`, whatever the user has — with an inferred *layer* (curated / session / archive / meta / unknown) and a 1-line purpose. Both kinds participate fully in F9: routing-table truthfulness checks every folder's coverage; folder-index enforcement applies to every non-trivial folder; the discoverability walk includes every folder regardless of role membership; reorg proposals span the whole vault.

F9.0 handles structural needs in three tiers, by how strongly the agent recommends action:

1. **Functional gaps** (severity: fail) — the optimizer's own job is at risk. Agent can't find any operator/identity context; root has no routing of any shape; custom role's layer is unclassifiable. Form-agnostic: identity in CLAUDE.md frontmatter is fine, routing as agent prose is fine.
2. **Functional improvements** (severity: warn) — the agent has *judged that adopting a BenAI convention would meaningfully improve this specific vault* given current state, with reasoning specific to the case. ("You have 14 work-shaped notes scattered across 6 folders with no clear hub; centralizing them under a `Projects/` (or equivalent) folder would make project status discoverable in one hop.") If the user's existing structure already meets the function — say a custom `Lab/` folder already plays the projects role — no tier-2 finding fires.
3. **Inspiration** (severity: info, default decline) — BenAI standard taxonomy presented as a single info-level reference. The user picks any that fit how they work; the rest persist as declined and don't re-prompt.

The optimizer's stance on the BenAI taxonomy: tested, useful, optional. The agent applies it as a recognition lens (Step 1.5 standard roles) and as a recommendation source for tier-2 improvements *when concrete evidence shows it would help this vault*. Never as a target shape the user must conform to. Custom roles the user has are first-class — never ignored, never demoted.

Nothing the user has gets ignored just because it doesn't match a pattern. Nothing gets prescribed just because BenAI uses it.

## What F9 catches that F1–F8 cannot

| Concern | Why F1–F8 miss it | F9 closes the gap |
|---|---|---|
| Routing entry points to a folder that no longer exists | F2.6 only checks the table is present and top-level folders are mapped | F9.1 verifies every routing entry's path resolves |
| Routing description claims `Projects/` holds X but it actually holds Y | No framework reads folder contents to compare against the description | F9.1 reads 3–5 sample files per folder and judges alignment |
| Folder has no folder-index file | Nothing checks per-folder index presence | F9.2 enforces the discovered convention per non-trivial folder; F9.0 proposes adopting one if no convention exists yet |
| Folder index exists but lists files that no longer exist or omits new files | No drift detection between index and reality | F9.2 diffs the index's children vs `ls` output |
| File is reachable by wikilink but not by navigation | F2.3 orphans use wikilinks, not the routing chain | F9.3 simulates the navigation walk and orphans by hop count |
| File is in the wrong folder despite passing F2.6 (technically valid, conceptually wrong) | F2.6 is structural; this is semantic | F9.4 reads file vs parent folder purpose and judges |
| Two folders are doing the same job under different names | No cross-folder semantic comparison | F9.5 compares stated purposes across folders |
| The vault could be reorganized for clarity but no individual rule is broken | All frameworks are atomic checks | F9.6 proposes 1–3 high-impact structural changes with reasoning |
| The root `CLAUDE.md` looks fine but a fresh agent can't actually orient from it | F1 is a content-quality lint, not a fitness test | F9.7 reads Context/ first, builds vault-specific orientation questions, then tries to answer them cold from CLAUDE.md |

## Operating principles

- **Walk the chain co-worker Claude walks.** F9 simulates the actual discovery path; failures of *that* path are findings, regardless of wikilink integrity.
- **Every finding ships a concrete fix.** No flag-only. No warnings stay as warnings. When the user runs the optimizer in apply-mode, every F9 finding becomes either an applied edit or a saved migration step in the dated reorg plan — never deferred indefinitely.
- **Vault-specific orientation, not generic.** F9.7 builds its orientation questions from the user's discovered identity + context roles (whatever folders or files play those parts in *this* vault) — what *this* user's vault should orient an agent toward. A founder's vault orients differently from a researcher's.
- **Two modes for every fix:** *apply now* (walk and confirm each step in this run) or *save to plan* (write to the discovered decisions-equivalent folder for staged execution; falls back to `audits/` at vault root if no decisions role exists, with an F9.0 finding to formalize one). User picks per item. Both modes commit the user to follow-through; neither lets the finding linger as flag-only.
- **Folder-index convention is discovered.** Lightweight markdown file under whatever name the user already uses (`README.md`, `Plot.md`, `index.md`, etc.): 1-line folder purpose, list of children with 1-line descriptions each, updated timestamp. Auto-generated when missing; auto-regenerated when stale; user confirms wording per folder.
- **Missing roles are findings, not silent assumptions.** No identity? No context? No decisions folder? F9.0 surfaces each gap with a concrete adoption proposal. The user can accept, decline (recorded as an explicit decision), or ask the agent to assign the role to an existing folder that's already playing that part informally.
- **Never edit a CLAUDE.md without per-item user approval.** F9.1 routing rewrites and F9.7 orientation additions both walk per-section.

## Why this couldn't be a regex pass

Every F9 check requires the agent to:
1. **Read the structure** (folders, files, what's inside each).
2. **Read the user's stated intent** (CLAUDE.md routing, folder Plot.md purposes, Context/ for personal context).
3. **Reason about alignment** between (1) and (2).
4. **Propose a concrete change** that closes the gap.

A regex can detect a missing path; only an agent can decide whether the description matches reality, whether two folders are duplicating work, or whether the orientation chain actually orients.
