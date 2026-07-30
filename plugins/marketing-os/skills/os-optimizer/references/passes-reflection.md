# F8 — Reflection (pass implementation)

**Reference (the why):** `references/anthropic-dreams.md` (inspired by Anthropic Managed Agents Dreams).
**Applies to:** the curated layer of the vault — discovered via the role registry (Step 1.5). The curated layer is **every role with `layer == "curated"`** (standard or custom — `Building/`, `Garden/`, custom user folders all participate if they were classified curated). The session layer (read as evidence, never written by F8 outputs) is **every role with `layer == "session"`**. Any standard role marked `missing` is silently skipped — its absence is not an F8 failure (it's an F9.0 finding). Custom roles never produce "missing" findings; they're either present or they're not.

**Out of scope (never touched by F8 fixes):** CLAUDE.md / claude.md (any folder), SKILL.md, .claude/rules/, files older than the session window in any session-role folder, anything in the technical skip list.

**Path resolution at runtime:** every reference below to "the curated layer" or "the session layer" resolves through `[role.path for role in registry if role.layer == X]`. References to specific layers ("the decisions folder," "the daily folder") look up `[role for role in registry if role.name == Y]` — and if `Y` is missing, the check uses the agent's best alternative within the right layer or skips. Examples in this document use placeholder names like `Context/`, `Building/` for readability — the runtime never assumes literal names.

## How this pass works

Synthesis. Unlike F1–G7, the trigger is not "scan a file with regex." The trigger is "build cross-file clusters, then judge each cluster." Findings emerge from the cluster, not from individual lines.

Every F8 finding ships a concrete fix proposal. F8 fixes are **walk-only** — bulk-apply is unsafe because every contradiction, merge, or promotion needs the user to pick the winning target.

## Contents

1. [Setup — windows, clusters, scope](#setup--windows-clusters-scope)
2. [F8.1 — Contradictions](#f81--contradictions)
3. [F8.2 — Merge candidates](#f82--merge-candidates)
4. [F8.3 — Stale entries](#f83--stale-entries)
5. [F8.4 — Emergent themes](#f84--emergent-themes)
6. [F8.5 — Promotions](#f85--promotions)
7. [Cross-framework constraints](#cross-framework-constraints)
8. [Finding schema](#finding-schema)

---

## Setup — windows, clusters, scope

**Session window:** last 30 days, by file mtime or filename date prefix (`YYYY-MM-DD`). Override via `instructions` if user specifies different cadence.

**Curated layer set:** every `.md` under every role where `layer == "curated"`. This includes standard curated roles (context, projects, decisions, resources, identity, skills) and custom curated roles the user has (`Building/`, `Garden/`, anything else classified curated in Step 1.5.3).

**Session set:** every `.md` under every role where `layer == "session"` whose mtime or date prefix falls within the session window. Includes standard session roles (daily, meetings, transcripts) and custom session roles (`Inbox/`, custom capture folders).

**Excluded layers:** `archive`, `meta`, `unknown`. Archive content stays archived; meta is tooling/system; unknown roles get a clarification ask via F9.0 before they participate.

If the role registry has no `identity`/`context` (standard or custom), F8 still runs — but its judgments lose grounding in the user's stated world. Every F8 finding's reasoning must explicitly note when context-grounding is unavailable.

**Topic clusters:** group files by overlap of:
- shared wikilink targets (≥2 common `[[Target]]` references),
- shared frontmatter tags (≥2 common tags),
- filename token similarity (Jaccard ≥ 0.5 on tokenized basenames),
- repeated proper nouns / entities (≥3 shared capitalized phrases).

A cluster is `{file_a, file_b, …, evidence}`. Read each member's first 1500 chars + headers index before judging.

---

## F8.1 — Contradictions

**Framework rule:** two or more notes assert opposing facts about the same entity, decision, or principle.

**Trigger heuristic:** within a cluster, scan for opposing pairs:
- numeric disagreement on the same metric (`50% B2B` vs `100% B2C`),
- decision reversal (`going with Postgres` vs `migrating to DynamoDB`),
- principle inversion (`always X` vs `never X`),
- date/owner mismatch on the same project.

**Agent judgment:** read both passages with surrounding context. Decide:
- **Real contradiction** → both files claim to be authoritative, no evolution marker, no scoping difference.
- **Evolution, not contradiction** → newer file explicitly supersedes older; older file should be marked stale (route to F8.3 instead).
- **False positive** → the two assertions apply to different scopes, time periods, or audiences. Drop.

**Fix proposal:** identify the *winner* (newer authoritative source by default; user confirms). Rewrite the loser to either (a) defer to the winner with a wikilink, or (b) remove the contradicted line entirely. If both files are load-bearing, log the resolution in `roles.decisions.path` (or, if decisions role is missing, surface that gap as part of the fix proposal — "no decisions folder discovered; recommend creating one").

**Severity:** fail.
**Fixable:** true (walk-only). User picks winner per item.

---

## F8.2 — Merge candidates

**Framework rule:** N notes (N ≥ 2) cover substantially the same concept. The vault is fragmented; the curated layer should have one canonical entry.

**Trigger heuristic:** clusters where:
- title similarity ≥ 0.6 (token Jaccard) **and**
- shared wikilink-target overlap ≥ 0.4 **and**
- combined inbound-link count ≥ 1 (at least one note in the cluster is referenced elsewhere).

**Agent judgment:** read each cluster member's body. Decide:
- **Merge** → ≥60% content overlap; no member contains a unique sub-topic that justifies separation.
- **Cross-link, don't merge** → members cover related-but-distinct facets. Route to F2.4 (missing cross-refs) instead.
- **Keep separate** → members have distinct audiences (e.g., `Context/brand.md` for voice, `Resources/swipe/copy.md` for examples).

**Fix proposal:** pick the canonical target (highest inbound-link count by default; user confirms). Merge unique content from sources into target, redirect every inbound `[[Source]]` wikilink to `[[Target]]`, archive sources to `{roles.archive.path}/{date}-merged/` (or `archive/{date}-merged/` at vault root if the archive role is missing — and surface that gap to F9.0). Never delete — archive preserves the trail.

**F5 budget check:** if the merged file would exceed F5's recommended per-file budget (10KB), propose **partial merge** (move only overlapping sections; keep distinct sub-topic files separate) or downgrade to flag-only with reasoning.

**Severity:** warn.
**Fixable:** true (walk-only). User picks canonical target per cluster.

---

## F8.3 — Stale entries

**Framework rule:** an entry in the curated layer states an assumption that recent session content has superseded.

**Trigger heuristic:**
- For each curated-layer file, extract claim sentences (declarative, present-tense, frontmatter-tagged or H2-anchored facts).
- For each claim, search session set for contradicting or superseding language (decision keywords: `decided`, `pivot`, `now we`, `changed to`, `replaced`, `instead of`).
- Match by entity overlap (≥2 shared proper nouns or ≥1 shared wikilink target).

**Agent judgment:** read both. Decide:
- **Stale** → the curated claim is contradicted by a session-layer source the user wrote ≥7 days ago and has not since reverted.
- **Out of date but still valid** → claim is still operationally true; session is a one-off. Drop.
- **Active disagreement** → multiple sessions disagree. Route to F8.1 (contradiction) instead.

**Fix proposal:** rewrite the curated entry with the new state. Quote the superseding source with a wikilink. Move the old wording to a `## History` section if it has decision context, otherwise drop.

**Severity:** fail.
**Fixable:** true (walk-only). User approves the rewrite per item.

---

## F8.4 — Emergent themes

**Framework rule:** ≥3 notes in the session window converge on a topic that has no canonical entry in the curated layer.

**Trigger heuristic:**
- Cluster session-set files by entity/wikilink overlap (same rules as setup).
- For each cluster of ≥3 files, search the curated layer for an existing canonical entry (filename match, H1 match, or wikilink target).
- If none exists → candidate.

**Agent judgment:** read the cluster. Decide:
- **Durable theme** → recurring topic with concrete content; deserves a Context entry or MOC.
- **One-off chatter** → cluster is incidental (same client mentioned in 3 unrelated meetings). Drop.
- **Belongs in an existing entry** → the theme overlaps a curated entry the trigger missed. Route to F8.5 (promotion) targeting that entry.

**Fix proposal:** create the theme entry in the most appropriate non-missing role: `roles.context.path/{theme-slug}.md` for canonical-knowledge themes, `roles.resources.path/{theme-slug}-MOC.md` for index-style themes. If the right role is missing → propose adopting it as part of the fix (surface to F9.0 simultaneously) before creating the file. Synthesize the cluster's content into a tight entry: 1-line definition, 3–5 key points, wikilinks back to the source notes. Frontmatter follows G7.2 conventions.

**Severity:** warn.
**Fixable:** true (walk-only). User confirms theme + target path per item.

---

## F8.5 — Promotions

**Framework rule:** a specific line or paragraph in an ephemeral session-layer file reads as durable knowledge (decision, principle, learning) that belongs in the curated layer.

**Trigger heuristic:** within session set, scan for marker phrases:
- decisions: `decided`, `chose`, `going with`, `we'll use`,
- principles: `always`, `never`, `rule:`, `principle:`,
- learnings: `learned`, `realized`, `key insight`, `takeaway`,
- callouts: `> [!note]`, `> [!important]`.

**Agent judgment:** read the surrounding 10–20 lines. Decide:
- **Promote** → durable, generalizable, not tied to a single moment.
- **Keep in source** → the insight only makes sense inside the session log it lives in.
- **Already promoted** → the curated layer already contains this fact. Drop.

**Fix proposal:** pick the destination from the user's discovered roles — typically `roles.context.path/{x}.md` (durable knowledge), `roles.resources.path/{x}.md` (reusable assets), or `roles.decisions.path/{date}-{slug}.md` (decisions). The agent presents the user with whichever roles exist; missing target roles trigger an F9.0 finding alongside. Append the durable content with a wikilink back to the source. In the source, replace the original lines with a wikilink stub (`See [[Target#section]]`).

**Severity:** info.
**Fixable:** true (walk-only). User picks destination per item.

---

## Cross-framework constraints

These rules prevent F8 from fighting F1–G7. Apply them when emitting findings; downgrade to flag-only when violated.

| Constraint | Why | What F8 does |
|---|---|---|
| F1: never auto-edit CLAUDE.md / claude.md | F1's flag-only rule is absolute | If an F8 fix would edit a CLAUDE.md → set `fixable: false`, record reasoning, surface as manual review |
| F5: never push a file over the per-file budget (10KB recommended, 100KB hard) | F5 would flag the merged file next run | F8.2 checks merged size before applying; if over → propose partial merge or downgrade to flag-only |
| F2: never create dead wikilinks | F2.2 would flag them | F8.2 redirects every inbound `[[Source]]` to `[[Target]]` before archiving the source; verify zero dead links after |
| F2: orphan archives | Archived files become orphans | F8.2 archives to `Intelligence/archive/{date}-merged/` which is excluded from F2.3 orphan checks (sub-folder convention) |
| F3: agent-layer style on generated content | F3 would flag filler | F8.4 / F8.5 generated text follows caveman discipline at write time |
| G7.1: no em dashes in generated content | G7 would flag them | F8 file creation never emits `—` or `–` (numeric ranges fine) |
| G7.2: frontmatter on new files | G7 would flag missing fields | F8.4 / F8.5 new files include `status:`, `tags:`, `type:`, `date:` |
| F6: SKILL.md scope | F6 owns SKILL.md layering | F8 never targets SKILL.md files (curated-layer scope only) |

If any constraint check fails during fix application → abort that finding's fix, mark `fixed: false`, record the reason in `reasoning_post`. The HTML render shows it as FIXABLE · NOT APPLIED with the abort reason.

---

## Finding schema

```json
{
  "framework": "F8",
  "check_id": "F8.2",
  "check_name": "Merge candidates",
  "path": "./Context/strategy.md",
  "cluster": [
    "./Context/strategy.md",
    "./Notes/2026-q1-strategy.md",
    "./Projects/positioning/research/strategy-thoughts.md"
  ],
  "line": null,
  "severity": "warn",
  "excerpt": "3 notes covering 'B2B positioning' with 72% content overlap; combined inbound links: 4",
  "reasoning": "These three files all define the B2B positioning thesis; Notes/2026-q1-strategy.md restates Context/strategy.md verbatim in 4 paragraphs; Projects/.../strategy-thoughts.md adds two unique sub-points (vertical-by-vertical breakdown) that should fold into the canonical Context entry. Merging keeps one source of truth without losing the unique material.",
  "action": "Merge Notes/2026-q1-strategy.md and Projects/.../strategy-thoughts.md into Context/strategy.md (canonical, highest inbound count). Redirect 4 inbound wikilinks. Archive sources to Intelligence/archive/2026-05-08-merged/. Estimated merged size: 7.2KB (under F5 10KB budget).",
  "proposed_target": "./Context/strategy.md",
  "estimated_size_after": 7234,
  "fixable": true,
  "fixed": false,
  "citation": "anthropic-dreams.md → F8.2 Merge candidates"
}
```

The `reasoning` field is mandatory and must explain the cluster's overlap pattern, not just restate "these are similar."

The `cluster` array lists every file in the cluster (for F8.1 and F8.2) or just `[path]` for single-file findings (F8.3, F8.5). For F8.4 the cluster lists the source notes that triggered the theme.

`proposed_target` is the destination path the fix would create or write to. For F8.1 and F8.3 it's the file being rewritten; for F8.2 the canonical merge target; for F8.4 the new file path; for F8.5 the promotion destination.

`estimated_size_after` is required for F8.2 (F5 budget gate). Optional elsewhere.
