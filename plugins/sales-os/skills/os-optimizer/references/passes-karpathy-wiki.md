# F2 — Karpathy LLM Wiki (pass implementation)

**Reference (the why):** `references/karpathy-llm-wiki.md`.
**Applies to:** the wiki content layer — every file classified as `note`, `context`, `decision`, `meeting`, `index`, `readme`. F2.6 also runs against `root-claude` (schema doc check).

## How this pass works

Agentic. Each check pairs a **trigger heuristic** (cheap candidate-surfacing) with **agent judgment** (read context, reason, decide). Findings include `reasoning` specific to the case. See F1's intro for the full pattern.

Build the indexes from SKILL.md Step 1.3 once before running F2 (filename index, inbound-link index, routing table).

## Contents

1. [F2.1 — Schema doc completeness](#f21--schema-doc-completeness)
2. [F2.2 — Dead wikilinks](#f22--dead-wikilinks)
3. [F2.3 — Orphan pages](#f23--orphan-pages)
4. [F2.4 — Missing cross-references](#f24--missing-cross-references)
5. [F2.5 — Same-role duplicates](#f25--same-role-duplicates)
6. [F2.6 — Schema non-compliance (routing)](#f26--schema-non-compliance-routing)
7. [F2.7 — Stub notes](#f27--stub-notes)
8. [F2.8 — Undigested sources](#f28--undigested-sources)
9. [F2.9 — Raw source modification](#f29--raw-source-modification)
10. [Finding schema](#finding-schema)

---

## F2.1 — Schema doc completeness

**Framework rule:** the schema doc (root CLAUDE.md) defines folder layout, naming, page types, cross-reference rules, ingest/query/lint workflows, frontmatter. Without it, the wiki drifts into folders nobody can find.

**Trigger heuristic:** read root CLAUDE.md. Score for the seven schema components by section heading + body content (not just heading match — heading without body content doesn't count).

**Agent judgment:**
- For each missing component, decide whether it's actually missing or whether the project handles it differently (e.g., naming conventions documented in a separate `Resources/conventions.md` and linked from CLAUDE.md → still counts).
- Reasoning explains *which* components are weak and what the consequence is for users running ingest/query workflows.

**False positives to skip:**
- Tiny vaults (<20 files) where formal schema is overkill — flag with lower severity, recommend lightweight schema.

**Severity:** fail if <4 components present, warn if 4–6.

**Finding format:**
```
./CLAUDE.md — schema doc missing components: {list}
Reasoning: {what specifically is missing and how it affects ingest/query — e.g., "no naming convention defined → meeting files named inconsistently across folders, search by name fails"}
Action: add the missing components (link to existing docs if they live elsewhere)
Citation: karpathy-llm-wiki.md → Schema doc structure
```

**Auto-fix:** none.

---

## F2.2 — Dead wikilinks

**Framework rule:** dead links are lint failures.

**Trigger heuristic:** for every `[[target]]` (regex `\[\[([^\]|#]+)(?:\|[^\]]+)?\]\]`), strip section anchors and aliases, lookup in `vault_filename_index`. If absent → candidate.

**Agent judgment:** for each dead candidate:
- Read the surrounding line. Is the link a real reference, or is it inside a code fence demonstrating wikilink syntax? Skip syntax demos.
- Compute top-3 closest filenames by Levenshtein.
- Read the candidate target files briefly. Pick the best repoint by reasoning about what the link's surrounding line means.
- If no good repoint exists → recommend "remove link, keep text".
- Reasoning: why this specific repoint vs the others.

**False positives to skip:**
- Wikilinks inside code fences or inline code (syntax demonstrations).
- Wikilinks to external systems (`[[external://something]]` patterns).

**Severity:** warn.

**Finding format:**
```
{file}:{line} — dead wikilink [[{target}]]
Excerpt: "{line content}"
Reasoning: {why the suggested repoint is the right one — what the surrounding sentence is referring to}
Closest matches: {top-3}
Action: (a) repoint to [[{best-match}]] OR (b) remove link, keep text
Citation: karpathy-llm-wiki.md → Lint catches dead links
```

**Auto-fix:** **fixable** with user confirmation per finding.

---

## F2.3 — Orphan pages

**Framework rule:** every wiki page needs ≥1 inbound link.

**Trigger heuristic:** files where `inbound_link_index[file] == 0`.

**Agent judgment:** for each orphan candidate:
- Is it intentional? (Date-indexed daily, profile root, archive, transcripts.) The pass file lists known intentional-orphan patterns; agent confirms by reading the file's role and content.
- If genuinely unreachable, what should happen? Options:
  - Link from a parent/index note (which one?)
  - Move to archive (is the content stale?)
  - Delete (is the content redundant?)
- Reasoning picks the right action by reading the file's content.

**Intentional orphans** (skipped from findings):
- `Daily/*.md`, `**/*\d{4}-\d{2}-\d{2}\.md`
- `**/index.md`, `**/README.md`, `**/CLAUDE.md`, `**/MEMORY.md`
- Files in `Intelligence/archive/`
- Profile root files (`Team/*/Profiles/*/{Name}.md`)

**Severity:** warn.

**Finding format:**
```
{path} — orphan (no inbound wikilinks)
Reasoning: {what the file contains and why it should be reachable — e.g., "this captures the X decision but no other note links to it; it'd be lost if anyone looked for X-related context"}
Action: {specific recommendation: "link from {index file}", "move to archive", or "delete"}
```

**Auto-fix:** none.

---

## F2.4 — Missing cross-references

**Framework rule:** entity name appears as plain text but a file with that name exists → should be a `[[wikilink]]`.

**Trigger heuristic:** for each entity-shaped filename (multiword, PascalCase, or with capitals; skip generics like `notes`, `index`, `readme`), search the vault for plain-text occurrences NOT inside `[[...]]`, `[...](...)`, code fences, or inline code.

**Agent judgment:** for each plain-text occurrence:
- Read the full sentence. Is the name being used as the entity (refers to the wiki page) or in passing/quoted speech?
- "Stripe" in "Set up Stripe webhook" → entity reference, link it.
- "Stripe" in "We're not using Stripe anymore" → still entity reference, link it.
- "Stripe" inside a quoted message from a user — judgment call; if the quote is talking about the same Stripe entity, link it; if it's just word-coincidence, skip.
- Reasoning explains why this specific occurrence should/shouldn't be linked.

**False positives to skip:**
- Headings (the heading itself usually shouldn't be a wikilink).
- Frontmatter values.
- The file that IS the entity's page (don't link a file to itself).
- Generic word matches (skip filenames < 4 chars, skip ambiguous single words).

**Severity:** warn.

**Finding format:**
```
{file}:{line} — entity "{name}" appears as plain text; {target}.md exists
Excerpt: "{surrounding sentence}"
Reasoning: {why this specific occurrence is an entity reference, not a generic word}
Action: convert to [[{name}]]
Citation: karpathy-llm-wiki.md → Missing cross-references
```

**Auto-fix:** **fixable on user opt-in** — per-occurrence (don't bulk-replace; some occurrences are intentional plain text).

---

## F2.5 — Same-role duplicates

**Framework rule:** two pages claiming to be the canonical record for the same entity is a lint failure.

**Trigger heuristic:** filename clusters in `Context/` (voice/brand/tone, icp/customer-profile/audience, services/offers/products, me/profile/operator, strategy/goals/okrs, team/org). Plus pairs in any folder where Levenshtein ≤3 between basenames.

**Agent judgment:** for each candidate pair, **read both files**.
- Do they actually overlap, or do they cover different aspects (e.g., `voice.md` = how we sound, `brand.md` = visual identity + voice + values)?
- Identify which sections overlap. Reasoning cites overlapping sections by heading.
- If they're complementary → recommend differentiation by frontmatter scope or rename to disambiguate.
- If they overlap → recommend consolidation; pick the canonical filename by reasoning about which name is more conventional / more linked.

**False positives to skip:**
- Files where one is a current draft and the other is archived (read frontmatter `status:`).
- Pairs where one file is clearly a parent index and the other is a leaf.

**Severity:** warn.

**Finding format:**
```
Potential overlap in {folder}/:
  - {path1} ({bytes-a}B)
  - {path2} ({bytes-b}B)
Reasoning: {what the overlap is — name 2-3 sections present in both, paraphrase what they say in each}
Action: {specific: "consolidate into {chosen-canonical}.md" OR "differentiate by adding scope: {field} to frontmatter" OR "rename {path2} to {disambiguated-name}.md"}
```

**Auto-fix:** none.

---

## F2.6 — Schema non-compliance (routing)

**Framework rule:** schema doc defines folder routing; non-compliant files are lint failures.

**Trigger heuristic:**
1. Read root CLAUDE.md, extract routing/knowledge-routing table.
2. List every top-level entry (folder, file).
3. Vault-root files that aren't `CLAUDE.md`/`README.md`/`MEMORY.md`/`index.md` → candidate.
4. Top-level folders not in routing table → candidate.

**Agent judgment:**
- For each vault-root file: read it. Decide whether it's misplaced (move where?) or legitimate (rare; recommend adding to allowed exceptions list).
- For each unmapped folder: read its content. Decide whether to expand the routing table or relocate the folder's contents.
- Reasoning explains the right destination for each non-compliant item.

**False positives to skip:**
- `LICENSE.md`, `CHANGELOG.md`, `CONTRIBUTING.md` — conventional repo-root files.
- `.github/`, `.vscode/`, `.cursor/`, `.claude/` — tooling folders.

**Severity:**
- vault-root file violation → fail
- unmapped folder → warn
- no routing table → fail (one finding total)

**Finding format (vault-root file):**
```
./{filename} — file in vault root
Reasoning: {what the file contains and where it belongs per the routing table}
Action: move to {specific folder}, or delete if obsolete
```

**Finding format (unmapped folder):**
```
./{folder}/ — top-level folder not in routing
Reasoning: {what the folder holds and how it relates to mapped folders}
Action: add to routing table OR relocate contents to {specific mapped folder}
```

**Finding format (no routing table):**
```
./CLAUDE.md — no routing table found
Reasoning: without a routing table, the wiki schema is unenforceable; new content drifts into ad-hoc folders
Action: add a routing table that maps every top-level folder to a content type
```

**Auto-fix:** none.

---

## F2.7 — Stub notes

**Framework rule:** undigested or empty notes pollute the wiki.

**Trigger heuristic:**
- byte size < 200 after stripping frontmatter (hard stub)
- Body matches: just an H1, just frontmatter, or only `TODO`, `WIP`, `Coming soon`, `Placeholder`, `Lorem ipsum`, `Draft`, `xxx`.

**Agent judgment:**
- For each candidate, read the file. Is it intentionally a one-line index (e.g., `Resources/quick-links.md` with three bullets)? → not a stub.
- Is it a true stub — file created but never filled in? → flag.
- Reasoning judges whether the file is salvageable (fill in), redundant (delete), or in-progress (move to drafts/).

**False positives to skip:**
- Onboarding/templates/ files (templates by design).
- Index/README files that legitimately route in 1 line.
- Files explicitly marked `status: draft` in frontmatter (already known WIP).

**Severity:** warn.

**Finding format:**
```
{path} — stub ({bytes}B, {n} content lines)
Excerpt: "{first 80 chars}"
Reasoning: {what the file appears to be aiming at, based on filename + any present headings; what the user can recover}
Action: {specific: "fill in: {what's missing}" OR "delete (redundant with {other-file})" OR "move to drafts/"}
```

**Auto-fix:** none.

---

## F2.8 — Undigested sources

**Framework rule:** one ingest typically touches 10–15 wiki pages. A source producing only one summary file was not fully digested.

**Trigger heuristic:** for `meeting` and `transcript` files:
1. Extract the source's date.
2. Look at git log (or filesystem mtime if git unavailable) for files modified within ±2 days.
3. Count distinct files modified outside the source's own folder. <3 → candidate.

**Agent judgment:** for each candidate:
- Read the source file. What entities, projects, decisions does it mention?
- Check whether those entity/project files exist in the vault and were updated near the source's date.
- If the source is short/unimportant (e.g., a 5-min call) → may be OK with low fan-out. Skip.
- If the source is substantive but no downstream activity → flag with reasoning listing missed propagations.

**False positives to skip:**
- Source files explicitly marked `processed: true` in frontmatter.
- Trivial sources (very short transcripts).
- Vaults without git history (skip; agent has no signal).

**Severity:** warn.

**Finding format:**
```
{path} — possibly undigested source
Reasoning: source mentions {entities/projects/decisions} but only {n} downstream files modified near the source date; {specific entity-file} appears to need updating
Action: revisit; update {entity-file-1}, {project-file-2}, etc.
Citation: karpathy-llm-wiki.md → 10–15 page fan-out
```

**Auto-fix:** none.

---

## F2.9 — Raw source modification

**Framework rule:** raw sources are immutable.

**Trigger heuristic:** detect raw-source folders (`Raw/`, `Sources/`, `sources/`, `raw-sources/`, `inputs/`). Check git log for non-human commit authors.

**Agent judgment:** for each modified raw source:
- Read the git diff. Is the change content (LLM rewrote the source) or metadata (LLM added frontmatter)? Both are violations, but reasoning differs.
- Reasoning describes what was modified and why it matters.

**False positives to skip:**
- Vaults without git → skip silently.
- Folders that are *named* `raw` but are not actually source archives.

**Severity:** fail.

**Finding format:**
```
{path} — raw source modified by automated commit
Reasoning: {what was changed and why immutability matters for this source's downstream wiki pages}
Action: revert; raw sources are immutable canon
```

**Auto-fix:** none.

---

## Finding schema

Same shape as F1 — every finding has `reasoning`. See SKILL.md Step 2.4.
