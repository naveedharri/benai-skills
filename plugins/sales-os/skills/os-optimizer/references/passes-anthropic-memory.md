# F5 — Anthropic Memory (pass implementation)

**Reference (the why):** `references/anthropic-managed-memory.md`.
**Applies to:** every `.md` in the vault.

## How this pass works

Agentic. Size and filename checks have mechanical triggers but the agent reads each candidate to produce reasoning that explains *why* this specific file's size or name is a problem in the project's context. See F1's intro for the full pattern.

## Contents

1. [F5.1 — Per-file size](#f51--per-file-size)
2. [F5.2 — Topic mono-files](#f52--topic-mono-files)
3. [F5.3 — Filename descriptiveness](#f53--filename-descriptiveness)
4. [F5.4 — Memory index presence](#f54--memory-index-presence)
5. [F5.5 — Date-naming consistency](#f55--date-naming-consistency)
6. [F5.6 — Versioning check](#f56--versioning-check)
7. [Finding schema](#finding-schema)

---

## F5.1 — Per-file size

**Framework rule:** per-file ≤100KB / ~25K tokens (hard ceiling). Recommended <10KB.

**Trigger heuristic:** byte size; tokens ≈ bytes/4.

**Agent judgment:** for each oversized candidate, read the file:
- Is it one focused topic at length (a long reference doc, a transcript)? → flag with size reasoning but lower severity.
- Is it multiple unrelated topics jammed together? → strong flag; reasoning identifies the topics by H2 headings.
- Is it a transcript or raw source where length is structurally expected? → skip (transcripts have their own conventions).

**False positives to skip:**
- Files in `*transcripts*/` or marked `type: transcript`.
- Files explicitly serving as long-form reference (e.g., Anthropic API docs cached locally).

**Severity:**
- > 100KB or > 25K tokens → fail
- > 10KB → warn

**Finding format:**
```
{path} — {KB}KB ({tokens}t)
Reasoning: {what the file holds — single topic at length vs multiple topics; specific H2 sections present}
Action: {specific: "split at H2 sections {names}" OR "leave; legitimately long for {reason}"}
Citation: anthropic-managed-memory.md → Architecture facts
```

**Auto-fix:** none.

---

## F5.2 — Topic mono-files

**Framework rule:** multiple focused files > one mega-file.

**Trigger heuristic:** count H2 headings in each file. >5 H2s → candidate.

**Agent judgment:** for each candidate, read the H2 headings and a sentence from each section:
- Are the H2s sub-topics of one cohesive theme (e.g., chapters of one guide)? → not mono-file; skip.
- Are the H2s unrelated topics (e.g., "Stripe setup", "Email automation", "Onboarding flow")? → mono-file; flag.
- Reasoning lists the H2s and judges whether splitting helps navigation.

**False positives to skip:**
- Reference docs where one big file is the canonical form (e.g., a single API reference).
- Index files that legitimately list many sub-topics.

**Severity:** warn.

**Finding format:**
```
{path} — {n} H2 sections (likely covers multiple topics)
Sections:
  - {H2-1}
  - {H2-2}
  …
Reasoning: {why these H2s appear unrelated — what would the user gain from splitting}
Action: split into {n} focused files: {suggested filenames per H2}
```

**Auto-fix:** none.

---

## F5.3 — Filename descriptiveness

**Framework rule:** the agent navigates by name. Bad: `notes.md`, `untitled.md`, `temp.md`.

**Trigger heuristic:** match patterns:
```
^notes-?\d*\.md$
^untitled.*\.md$
^temp.*\.md$
^file-?\d+\.md$
^new[-\s]?document.*\.md$
^draft\d*\.md$
^document\d*\.md$
^copy.*\.md$
^final-?(final-?)*.*\.md$
^\d+\.md$
^scratch\d*\.md$
^misc\.md$
^stuff\.md$
^random\.md$
```

**Agent judgment:** for each candidate, read the file:
- What's it actually about? Reasoning proposes a descriptive slug based on actual content.
- Is it a stub that should be deleted instead of renamed? Cross-check with F2.7.
- For `notes.md` files in personal-vault contexts where the user owns the folder organically, judge whether renaming would actually help.

**False positives to skip:**
- Date-named files (`\d{4}-\d{2}-\d{2}.*\.md`).
- Numbered course/lesson files in obvious learning folders.

**Severity:** warn.

**Finding format:**
```
{path} — ambiguous filename
Reasoning: file content is about {topic}; current name doesn't convey this and the agent can't find it by name
Suggested rename: {descriptive-slug}.md
Action: rename
Citation: anthropic-managed-memory.md → File-naming and structure
```

**Auto-fix:** none (renaming needs user approval).

---

## F5.4 — Memory index presence

**Framework rule:** inject a top-level index so the agent can navigate by name.

**Trigger heuristic:** folders with >5 direct `.md` children and no `index.md`/`README.md`/`CLAUDE.md`/`MEMORY.md`/`_index.md` (case-insensitive).

**Agent judgment:** for each candidate folder:
- Read 3–5 sample files. Are they obviously related (one content type) or mixed?
- If mixed → strong flag; an index unifies them.
- If they're date-indexed (e.g., daily notes), the agent's date-pattern recognition handles navigation; lower severity.
- Reasoning explains what kind of index would help (a table of files vs a routing prose vs a CLAUDE.md per role).

**False positives to skip:**
- Date-folders (Daily/, meetings/{type}/) where filenames are dates.
- `Intelligence/archive/` — archives are dump-only.

**Severity:** warn.

**Finding format:**
```
{folder}/ — {N} files, no index file
Reasoning: {what the folder contains, why an index would help — cite specific files that are hard to find by name alone}
Action: create {index|README|CLAUDE}.md listing the files with one-line descriptions
```

**Auto-fix:** none.

---

## F5.5 — Date-naming consistency

**Framework rule:** date-stamp time-sensitive content; the agent finds it by date.

**Trigger heuristic:** for date-folders (`Daily/`, `**/meetings/`, `**/journal/`, `**/log/`), check direct-child filenames for `\d{4}-\d{2}-\d{2}` prefix.

**Agent judgment:** for each non-conforming file, read it:
- Is it actually time-sensitive content that just wasn't dated? → flag, suggest the date from frontmatter or first-line metadata.
- Is it a non-time index file that lives in the date folder by accident (e.g., a folder-level CLAUDE.md)? → suggest moving out of the date folder.
- Reasoning describes the file's content type and the right destination.

**False positives to skip:**
- Index/README/CLAUDE.md files inside date folders (those route navigation, not events).

**Severity:** warn.

**Finding format:**
```
{path} — file in date-folder {folder}/ without YYYY-MM-DD prefix
Reasoning: {what the file is — dated event vs misplaced index}
Action: {specific: "rename to {YYYY-MM-DD}-{slug}.md (date inferred from {frontmatter|first line})" OR "move to {non-date folder}"}
```

**Auto-fix:** none.

---

## F5.6 — Versioning check

**Framework rule:** memory writes produce immutable named versions; vault analogues are git or Relay sync.

**Trigger heuristic:**
- `.git/` exists at vault root → versioned.
- `.obsidian/plugins/system3-relay/` or `.relay/` → Relay-synced.
- Neither → candidate.

**Agent judgment:** mostly mechanical, but the agent reads to:
- Check `.gitignore` if `.git/` exists — is the vault actually being committed (not entirely ignored)?
- Reasoning explains the audit-trail risk specific to this vault (e.g., "you have 80 files of substantive content with no rollback path; one bad bulk edit and content is lost").

**Severity:** warn.

**Finding format:**
```
Vault has no version control
Reasoning: {N} files of substantive content with no audit trail or rollback path; bulk operations are irreversible
Action: `git init` and commit, OR install the Relay sync plugin
Citation: anthropic-managed-memory.md → Versioning and audit trail
```

**Auto-fix:** none.

---

## Finding schema

Same shape as F1 — every finding has `reasoning`. See SKILL.md Step 2.4.
