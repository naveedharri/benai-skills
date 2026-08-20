# F3 — Caveman Compression (pass implementation)

**Reference (the why):** `references/caveman-compression.md`.
**Applies to:** the instruction layer — every `root-claude`, `folder-claude`, `claude-rules`, `skill` (SKILL.md), and every `.md` inside any `references/` folder of a skill. NOT applied to: notes, dailies, meetings, transcripts, decisions, context (human-facing knowledge layer).

## How this pass works

Agentic. **Crucial for caveman**: the trigger heuristic alone produces a flood of false positives because words like `just`, `really`, `simply` often do real work in context ("Just run X" — contrasting with "run all of them"). The agent reads each candidate **in its surrounding sentence** and judges whether the word is filler or load-bearing.

Findings include `reasoning` explaining why this specific occurrence is filler in this specific sentence. Without that judgment, this pass would be useless.

Before any check runs, the orchestrator strips **protected zones** so the agent isn't reasoning about code/URLs/paths/wikilinks. See list at the bottom.

## Contents

1. [F3.1 — Filler density](#f31--filler-density)
2. [F3.2 — Hedging density](#f32--hedging-density)
3. [F3.3 — Pleasantry preambles](#f33--pleasantry-preambles)
4. [F3.4 — Verbose connectors](#f34--verbose-connectors)
5. [F3.5 — Article density](#f35--article-density)
6. [F3.6 — Top-3 reduction targets](#f36--top-3-reduction-targets)
7. [F3.7 — Prose-vs-routing-table candidates](#f37--prose-vs-routing-table-candidates)
8. [Protected zones](#protected-zones)
9. [Substitution table (opt-in fix path)](#substitution-table-opt-in-fix-path)
10. [Finding schema](#finding-schema)

---

## F3.1 — Filler density

**Framework rule:** `just`, `really`, `basically`, `simply`, `please`, `actually`, `definitely`, `literally`, `very`, `quite` typically add no information.

**Trigger heuristic:** count occurrences (after stripping protected zones):
```
\b(just|really|basically|simply|please|actually|definitely|literally|very|quite|truly|essentially)\b
```
Compute density per 100 words.

**Agent judgment — this is the meat of the check:** for each candidate occurrence, read the surrounding sentence and decide:

| Word | Filler in context | Load-bearing in context |
|---|---|---|
| just | "It's just a quick check" | "Just run X (not all of them)" |
| really | "This is really important" | "Does it really fail when {condition}?" |
| simply | "Simply add the file" | "The function simply returns the input" (mathematical/algorithmic sense) |
| basically | "Basically, you ship it" | "It's basically O(n) but with a constant factor" |
| actually | "It's actually fine" | "Does X actually run? (vs. is supposed to)" |
| literally | "Literally just delete it" | "Literally as in the L-flag, not figurative" |

The rule of thumb: if removing the word changes nothing operationally, it's filler. If it carries contrast, emphasis on truth-value, or technical precision, it's load-bearing.

Each finding flags ONE specific occurrence (or aggregates a small batch of clearly-filler ones in the same file with reasoning). The reasoning quotes the sentence and explains why this `just` is filler.

**False positives to skip:**
- Quoted speech (someone else's words inside backticks or block quotes).
- Cases where the word is doing technical/contrastive work.
- Code samples (already protected).

**Severity:** warn (one finding per genuinely filler occurrence; cap at 25 per file with "…and N more flagged in JSON sidecar").

**Finding format:**
```
{path}:{line} — filler word "{word}"
Excerpt: "{full sentence}"
Reasoning: {why removing "{word}" doesn't change the meaning of THIS sentence}
Suggested edit: "{sentence with the word removed/replaced}"
Citation: caveman-compression.md → Compression rules
```

**Auto-fix:** **fixable on user opt-in per file** — the agent applies the substitutions only to the occurrences it confirmed (not to all regex hits).

---

## F3.2 — Hedging density

**Framework rule:** hedging language drops compliance. Use imperatives.

**Trigger heuristic:**
```
\b(I think|I believe|I guess|maybe|perhaps|might be|could be|kind of|sort of|in a way|I'd suggest|you might want|it could|it might|seems like|appears to|tends to)\b
```

**Agent judgment:** for each candidate, read the surrounding sentence:
- "I think X is best" → unhedge to "X is best" (or whatever the load-bearing claim is). Flag.
- "It might be that the API rate-limits us" → genuine uncertainty about a fact. Skip; this is honest hedging about external behavior.
- "Maybe we should check the logs" — depends: in a procedural CLAUDE.md/SKILL.md it's a hedge; in narrative notes, it's discussion.

The judgment line: in **instruction-layer** files (which this pass applies to), hedging weakens the instruction. In narrative/discussion (which this pass excludes), hedging is honest.

**False positives to skip:**
- Honest factual uncertainty about external systems.
- Quoted user/conversation content.
- Section that discusses *when* to hedge (meta).

**Severity:** warn.

**Finding format:**
```
{path}:{line} — hedge "{phrase}"
Excerpt: "{sentence}"
Reasoning: this is an instruction file; the hedge weakens the rule's compliance from ~89% to ~35%. Strip and use an imperative.
Suggested edit: "{imperative version}"
```

**Auto-fix:** **fixable on user opt-in**.

---

## F3.3 — Pleasantry preambles

**Framework rule:** pleasantries waste tokens.

**Trigger heuristic:**
```
^\s*[-*0-9.]*\s*(Sure!?|I'd be happy to|Let me explain|Let me start by|Great question!?|Thanks for asking|Hope (this|that) helps|Let me know if|Before we dive in|First, let me|It's worth noting|To start)\b
```
Plus closures: `\b(hope (this|that) helps|let me know if you (need|have)|happy to (help|elaborate|clarify))\b`.

**Agent judgment:** for each candidate, read the line and the next 1–2 lines.
- Is it a literal preamble that says nothing operational? → flag. ("Let me explain how this works." → delete; the next line presumably explains it.)
- Is it part of a quoted conversation? → skip.
- Is it inside a `<details>` or quote block preserving an example? → skip.

**False positives to skip:**
- Quoted speech, examples of what NOT to write.
- Inside `<details>` or `> ` block quotes used as examples.

**Severity:** warn.

**Finding format:**
```
{path}:{line} — pleasantry preamble
Excerpt: "{first 80 chars}"
Reasoning: this line says nothing operational; the next line(s) carry the actual content
Action: delete the matched span
```

**Auto-fix:** **fixable on user opt-in** — delete the matched span only.

---

## F3.4 — Verbose connectors

**Framework rule:** "in order to" → "to". "due to the fact that" → "because". Etc.

**Trigger heuristic:** match the table:

| Verbose | Replacement |
|---|---|
| `\bin order to\b` | `to` |
| `\bdue to the fact that\b` | `because` |
| `\bat this point in time\b` | `now` |
| `\bin the event that\b` | `if` |
| `\bwith regards to\b` | `for` (or `on`) |
| `\bwith respect to\b` | `for` |
| `\bin spite of the fact that\b` | `although` |
| `\bin light of the fact that\b` | `because` |
| `\bin the process of\b` | (delete) |
| `\bfor the purpose of\b` | `to` |
| `\ba large number of\b` | `many` |
| `\ba small number of\b` | `few` |
| `\bthe majority of\b` | `most` |
| `\bin terms of\b` | `for` |

**Agent judgment:** for each candidate, read the sentence.
- Most of these are safe substitutions; the agent confirms the substitution preserves meaning.
- "with respect to" sometimes means a mathematical/legal "with respect to" (calculus, regulatory) — skip those.
- "in terms of" sometimes means "expressed as" (math) — skip if technical.

**False positives to skip:**
- Technical/mathematical/legal usage where the longer form has precise meaning.

**Severity:** warn.

**Finding format:**
```
{path}:{line} — verbose connector "{phrase}" → "{replacement}"
Excerpt: "{sentence}"
Reasoning: {why the substitution preserves meaning here}
Suggested edit: "{sentence after substitution}"
```

**Auto-fix:** **fixable on user opt-in**.

---

## F3.5 — Article density

**Framework rule:** drop articles where meaning holds.

**Trigger heuristic:** count `\b(a|an|the)\b` after stripping protected zones; compute density vs peer-file median.

**Agent judgment:** flag-only — this pass is a measurement, not a fix. Articles are auto-fix unsafe (meaning shifts: "the API" vs "an API"). The agent reads the file briefly and reasons about whether the article density is unusually high *given the file's structure* (prose-heavy → expected; routing-table-heavy → unusual).

**False positives to skip:**
- Files that are mostly prose (essays, narratives).

**Severity:**
- density > peer-median × 2 → fail
- density > peer-median × 1.5 → warn

**Finding format:**
```
{path} — article density {density} (peer median: {median})
Reasoning: this file is mostly {structure type} but uses articles {N}× the peer median; likely contains stripable "the/a/an"
Action: manual rewrite or run a caveman-lite pass; do NOT auto-substitute (meaning shifts)
```

**Auto-fix:** none.

---

## F3.6 — Top-3 reduction targets

**Framework rule:** identify largest H2/H3 sections in root CLAUDE.md as compression candidates.

**Trigger heuristic:** parse all H2/H3 in root CLAUDE.md, byte-rank descending.

**Agent judgment:** for the top 3, read each section and reason about realistic compression:
- Prose-heavy section → ~50–70% compressible.
- Mixed (prose + lists) → ~25–35%.
- Code-heavy / table-heavy → ~5–15%.
- Reasoning explains the structure of each top section and a realistic savings estimate (not a fixed 25%).

**False positives to skip:**
- Sections that are intentionally one big code block / table.

**Severity:** info (no severity; this is a measurement panel).

**Finding format (one per top-3 section):**
```
./CLAUDE.md → ## {section-name} — {bytes}B (~{tokens}t)
Reasoning: section is {structure breakdown}; realistic caveman savings ~{est}t after compressing the prose lines
Action: candidate for caveman compression pass
```

**Auto-fix:** none.

---

## F3.7 — Prose-vs-routing-table candidates

**Framework rule:** ≥3 categorical mappings → switch to a markdown table.

**Trigger heuristic:** consecutive bullet/numbered list runs ≥3 items where ≥75% of items match `^[-*0-9.]+\s+([A-Z][\w\s]+)\s*[:→\-]+\s+(.+)$`.

**Agent judgment:** for each candidate run:
- Read the items. Are they truly categorical mappings (X maps to Y) or a list of related-but-not-tabular items?
- Mappings → flag, suggest table with header columns derived from the items.
- Not mappings → skip.

**False positives to skip:**
- Steps in a procedure (1. Do X. 2. Do Y. — these are sequenced, not categorical).
- Bullet lists of synonyms or examples.

**Severity:** warn.

**Finding format:**
```
{path}:{line-start}-{line-end} — {n} categorical bullets — table candidate
Excerpt:
  L{a}: "{bullet 1}"
  L{b}: "{bullet 2}"
  L{c}: "{bullet 3}"
Reasoning: each bullet maps a {category} to {value}; a 2-column table compresses ~50% and is faster to scan
Suggested table headers: | {col1} | {col2} |
Action: convert to a markdown table
```

**Auto-fix:** none (column header choice needs user judgment).

---

## Protected zones

Strip from consideration before any F3 check counts a hit OR any fix runs:

| Zone | Detect |
|---|---|
| Code fences | between ` ``` ` and ` ``` ` |
| Inline code | between `` ` `` and `` ` `` |
| URLs | `https?://\S+` |
| File paths | `[/\w.-]+\.(md\|ts\|js\|py\|sh\|json\|yaml\|yml\|html\|css)\b` |
| Frontmatter | between leading `---` and closing `---` |
| Wikilinks | `\[\[[^\]]+\]\]` |
| Markdown table delimiters | lines starting with `\|` or `\|---` |
| Headings | lines starting with `#` |
| Dates | `\d{4}-\d{2}-\d{2}` |
| Version numbers | `v?\d+\.\d+(\.\d+)?` |

Findings still report original line numbers from the file (not stripped-body offsets).

---

## Substitution table (opt-in fix path)

Used in Step 5 of SKILL.md when the user opts into caveman fixes for a specific file. The agent applies substitutions **only to occurrences it confirmed via the judgment step**, not to every regex hit.

| Pattern (regex, case-insensitive, after protected-zone stripping) | Replacement |
|---|---|
| `\bjust\s+\b` | (delete the word) |
| `\breally\s+\b` | (delete) |
| `\bbasically\s+\b` | (delete) |
| `\bsimply\s+\b` | (delete) |
| `\bplease\s+\b` | (delete) |
| `\bactually\s+\b` | (delete) |
| `\bdefinitely\s+\b` | (delete) |
| `\bliterally\s+\b` | (delete) |
| `\bvery\s+\b` | (delete) |
| `\bquite\s+\b` | (delete) |
| `\bin order to\b` | `to` |
| `\bdue to the fact that\b` | `because` |
| `\bat this point in time\b` | `now` |
| `\bin the event that\b` | `if` |
| `\bwith regards to\b` | `for` |
| `\bwith respect to\b` | `for` |
| `\bin spite of the fact that\b` | `although` |
| `\bin light of the fact that\b` | `because` |
| `\bfor the purpose of\b` | `to` |
| `\ba large number of\b` | `many` |
| `\ba small number of\b` | `few` |
| `\bthe majority of\b` | `most` |
| `\bin terms of\b` | `for` |
| `\bI think\s+\b` | (delete) |
| `\bI believe\s+\b` | (delete) |
| `\bI guess\s+\b` | (delete) |
| `\bmaybe\s+\b` | (delete) |
| `\bperhaps\s+\b` | (delete) |
| `\bkind of\s+\b` | (delete) |
| `\bsort of\s+\b` | (delete) |
| Pleasantry preambles per F3.3 | delete the matched span |

After substitution, re-strip protected zones and verify no code/path/URL/wikilink was modified. If any protected substring is missing/mangled in the diff → abort the fix on that file and report.

---

## Finding schema

Same shape as F1 — every finding has `reasoning`. See SKILL.md Step 2.4.
