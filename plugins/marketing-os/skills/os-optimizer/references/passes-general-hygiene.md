# G7 — General Hygiene (pass implementation)

**Reference (the why):** project rules + practitioner field notes. Not from a single canonical framework.
**Applies to:** every `.md` file in the vault.

## How this pass works

Agentic. Em dash detection and H1=filename are mostly mechanical, but the agent reads each candidate to confirm the substitution/deletion is safe given context and to write reasoning that explains why this specific case violates the project rule. See F1's intro for the full pattern.

## Contents

1. [G7.1 — Em dashes](#g71--em-dashes)
2. [G7.2 — Frontmatter compliance](#g72--frontmatter-compliance)
3. [G7.3 — H1 duplicating filename](#g73--h1-duplicating-filename)
4. [G7.4 — Project README hygiene](#g74--project-readme-hygiene)
5. [Finding schema](#finding-schema)

---

## G7.1 — Em dashes

**Framework rule (project Rule 14):** never use em dashes; use periods, commas, colons, or restructure.

**Trigger heuristic:** strip protected zones (code fences, inline code, URLs, frontmatter, wikilinks, paths). Grep for `—` (U+2014) and `–` (U+2013).

**Agent judgment:** for each candidate, read the surrounding sentence and pick the right replacement:
- Em dash separating two clauses, where the second elaborates on the first → `: ` (colon).
- Em dash setting off a parenthetical → `, … ,` (commas).
- Em dash at end of clause functioning as period → `. ` (period).
- En dash in a numeric range (`100–200`) → keep as en dash; this is canonical, not a Rule-14 violation.
- En dash in a date range → keep.

Reasoning picks the right substitution per occurrence and explains why.

**False positives to skip:**
- Numeric ranges with en dash (`100–200`, `5–10 minutes`).
- Date ranges (`2026–2027`).
- Em dashes inside quoted speech (preserve the original text).

**Severity:** warn.

**Finding format (one per file, aggregated):**
```
{path} — {n} em-dash uses
Examples:
  L{line}: "{full sentence}" → suggested: "{rewritten sentence}"
  …
Reasoning: {how the em dashes are used in this file — clause separators, parentheticals, etc.}
Action: replace each per the suggestion (substitutions vary by use)
```

**Auto-fix:** **fixable on user opt-in** — the agent applies the per-occurrence substitution it confirmed (not a bulk regex).

After substitution, re-strip protected zones and verify nothing inside code/URLs/wikilinks was modified. If any protected substring is missing/mangled → abort that file's fix and report.

---

## G7.2 — Frontmatter compliance

**Framework rule (project):** content notes need `status:` and 2+ specific `tags:`. Recommended: `type:`, `date:`, `project:`, `department:`.

**Trigger heuristic:** parse frontmatter for files in scope (`note`, `context`, `decision`, `meeting`, `daily`).

**Agent judgment:** for each missing field:
- Read the file. Can the agent infer the right value?
  - `status:` → look for completion signals (any "Done", "Shipped", "Decided") → suggest `done`; else `active` for current work.
  - `tags:` → infer 2+ tags from the file's H1, project context, and content.
  - `type:` → infer from filename pattern and content (`meeting`, `decision`, `note`, `reference`).
  - `date:` → look for dates in body.
  - `project:` / `department:` → infer from folder location.
- Reasoning supplies the inferred value with confidence — high (clearly visible) or low (best guess).

**False positives to skip:**
- `CLAUDE.md`, `README.md`, `index.md`, `MEMORY.md` (meta).
- `.trash/`, `Onboarding/templates/`.
- Tasks files (different format).

**Severity:** warn (per missing field).

**Finding format (one per file, aggregated):**
```
{path} — missing frontmatter: {fields}
Reasoning: inferable values — {field: inferred-value (high/low confidence)}; remaining need human input
Suggested frontmatter:
  ---
  status: {value}
  tags: [{tag1}, {tag2}]
  type: {value}
  ---
Action: add the suggested frontmatter
```

**Auto-fix:** none in v0 — confidence too uncertain to auto-write frontmatter values.

---

## G7.3 — H1 duplicating filename

**Framework rule:** don't put a `# Title` heading that duplicates the filename.

**Trigger heuristic:** read first non-frontmatter content line. If `# {Title}`, slugify both, compare.

**Agent judgment:** confirm:
- Is this a CLAUDE.md / README.md? Cross-check with F1.10 to avoid double-counting.
- For READMEs at git repo root, the H1 may be intentional for GitHub display — flag with low severity, recommend keeping if user prefers GitHub render.

**Severity:** warn.

**Finding format:**
```
{path} — H1 "{title}" duplicates filename
Reasoning: Obsidian/Claude already shows the filename as the title; H1 is redundant
Action: remove the H1 and any blank line below
```

**Auto-fix:** **fixable**.

---

## G7.4 — Project README hygiene

**Framework rule:** project READMEs should be the entry point with overview/status/next-steps; subtopics route to subdir files.

**Trigger heuristic:** files matching `Projects/*/README.md` or `Projects/*/*/README.md`. Check sections (Overview/What, Status, Next/Roadmap) and size (<200B = sparse, >8KB = bloated).

**Agent judgment:** for each candidate:
- Read the README. What's there, what's missing?
- For sparse: reasoning lists what the README actually says vs what a project entry-point needs.
- For bloated: reasoning identifies the subtopics that should extract (e.g., research/, specs/, notes/).
- Reasoning describes the right structure for THIS specific project.

**Severity:** warn.

**Finding format (sparse):**
```
{path} — sparse README ({bytes}B)
Reasoning: README contains {what's there}; missing {Overview / Status / Next steps}
Action: add overview, current status, next steps
```

**Finding format (bloated):**
```
{path} — bloated README ({bytes}B)
Reasoning: README contains {N} distinct subtopics that should live in subdir files: {list}
Action: extract {subtopic-A} → research/{slug}.md, {subtopic-B} → specs/{slug}.md; keep README as the entry index
```

**Auto-fix:** none.

---

## Finding schema

Same shape as F1 — every finding has `reasoning`. See SKILL.md Step 2.4.
