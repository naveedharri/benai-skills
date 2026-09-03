# F4 — Chroma Context Rot (pass implementation)

**Reference (the why):** `references/chroma-context-rot.md`.
**Applies to:** every `.md`. Position checks (F4.3, F4.4) prioritize files that load early. Distractor checks (F4.5) operate on auto-load and same-folder pairs.

## How this pass works

Agentic. Length and position are mostly mechanical, but **what counts as a problem depends on the file's role and content**. A 200KB transcript is fine; a 200KB CLAUDE.md is a disaster. Lead-in preamble in a daily journal is normal; in a routing index it's a buried-rule problem. The agent reads each candidate and produces reasoning that distinguishes the two.

See F1's intro for the full trigger → judgment → reasoning pattern.

## Contents

1. [F4.1 — File length distribution](#f41--file-length-distribution)
2. [F4.2 — Loaded-context-size budget](#f42--loaded-context-size-budget)
3. [F4.3 — Critical-info position](#f43--critical-info-position)
4. [F4.4 — Lead-in preamble](#f44--lead-in-preamble)
5. [F4.5 — Distractor density / similar-topic pairs](#f45--distractor-density--similar-topic-pairs)
6. [F4.6 — Top-of-file callout](#f46--top-of-file-callout)
7. [F4.7 — Daily file size](#f47--daily-file-size)
8. [Finding schema](#finding-schema)

---

## F4.1 — File length distribution

**Framework rule:** longer files degrade more; outliers act as collective distractors.

**Trigger heuristic:** compute project-median byte size. Files > median × 5 → candidate.

**Agent judgment:** for each candidate, read the file (or skim if huge):
- Is it intentionally long (transcripts, reference docs, course content)? → may be acceptable; still flag if it's loaded into auto-context.
- Is it bloated (multiple unrelated topics in one file)? → strong flag; recommend split with specific section breakpoints.
- Reasoning describes the file's structure and either confirms it should split or explains why it's legitimately long.

**False positives to skip:**
- Files inside `*transcript*/`, `*archive*/` where length is expected.

**Severity:**
- > median × 10 → fail
- > median × 5 → warn

**Finding format:**
```
{path} — {KB}KB ({Nx} project median)
Reasoning: {what's actually in the file — number of H2 sections, range of topics; whether it's one topic at length vs many topics jammed together}
Action: {specific: "split at {section breakpoints}" OR "leave as-is — legitimately long for {reason}"}
```

**Auto-fix:** none.

---

## F4.2 — Loaded-context-size budget

**Framework rule:** auto-load context is a finite attention budget; soft target ~3K tokens.

**Trigger heuristic:** sum bytes of root CLAUDE.md (the only auto-load file per Anthropic rule 13 — folder CLAUDE.mds load on demand). Tokens ≈ bytes/4. Compare to 3,000 token budget.

**Agent judgment:** if over budget, read the root CLAUDE.md and identify:
- Which sections are pure noise (could move to references/, .claude/rules/, or skills)?
- Which sections are load-bearing for every session vs niche?
- Reasoning names specific section headings that should move and where to.

**False positives to skip:**
- Vaults where the user has explicitly opted into a heavy auto-load (rare; ask if there's a stated preference).

**Severity:**
- > 6,000 tokens → fail
- > 3,000 tokens → warn

**Finding format:**
```
Auto-load context = {tokens}t (root CLAUDE.md = {bytes}B)
Reasoning: {names of sections that could move and where} — together those would save ~{est}t
Action: extract {section-A} → references/, {section-B} → .claude/rules/{topic}.md with paths: scope
Citation: chroma-context-rot.md → Loaded context size
```

**Auto-fix:** none.

---

## F4.3 — Critical-info position

**Framework rule:** unique words placed early have higher accuracy. Buried rules get neglected.

**Trigger heuristic:** for `root-claude`, `folder-claude`, `index`, `readme`, scan all lines and tag any that look load-bearing (imperatives at line start, routing-table rows, callouts, `IMPORTANT:` markers). For each load-bearing line past the 30% mark → candidate.

**Agent judgment:** read the file structure:
- Is the buried rule actually critical? (Some imperatives like "Save the report" are operational but not high-stakes.) Don't over-flag.
- Is the file long enough that "30%" is a meaningful threshold? In a 50-line file, line 20 isn't really "buried."
- Reasoning names the specific buried rule and what's currently occupying the top instead.

**False positives to skip:**
- Files where the top is intentionally a frontmatter + summary callout, with rules immediately below.
- Files <30 lines where position matters less.

**Severity:** warn.

**Finding format:**
```
{path} — {n} load-bearing rules buried past 30%
Examples:
  L{line} ({pct}% in): "{excerpt}"
Reasoning: {what the top of the file currently contains, and why the buried rule deserves higher placement}
Action: move {specific rules} to the top; demote {currently-top section} below
```

**Auto-fix:** none.

---

## F4.4 — Lead-in preamble

**Framework rule:** lead with the rule, not the rationale.

**Trigger heuristic:** read first 30 lines (excluding frontmatter and H1). Detect preamble patterns:
```
\b(This document explains|In this guide|Welcome to|The purpose of this|Below you will find|We will cover|This file describes|Overview of)\b
```
If present and no imperative/routing table appears before line 20 → candidate.

**Agent judgment:** read the top 30 lines.
- Is the preamble setting necessary context (e.g., naming the file's scope)? → may be OK with low severity.
- Is the preamble pure throat-clearing? → flag.
- Reasoning explains what the preamble currently says and what should replace it.

**False positives to skip:**
- Files where preamble is a one-line scope summary followed immediately by load-bearing content.

**Severity:** warn.

**Finding format:**
```
{path} — preamble before any load-bearing content
Excerpt: "{first 100 chars}…"
Reasoning: {what the preamble adds — likely nothing operational; what's actually load-bearing further down}
Action: lead with {specific lower section}; move preamble below or delete
```

**Auto-fix:** none.

---

## F4.5 — Distractor density / similar-topic pairs

**Framework rule:** similar files in the same load path distract each other ("shuffled > structured" finding).

**Trigger heuristic:** for pairs of files in the same folder where Levenshtein ≤4 between basenames AND vocabulary Jaccard >0.4 (after stopword removal, drop protected zones).

**Agent judgment:** for each candidate pair, read both files briefly:
- Do they actually overlap topically, or do they share generic vocabulary because they're both notes?
- If they always load together (e.g., both are referenced from the same CLAUDE.md), the distractor effect is real → flag with reasoning.
- If they're loaded independently (different routing paths), the distractor risk is lower → flag with lower severity or skip.

**False positives to skip:**
- Pairs where one is clearly an index of the other.
- Pairs explicitly differentiated by frontmatter scope.

**Severity:** warn.

**Finding format:**
```
Distractor pair in {folder}/:
  - {path1}
  - {path2}
Reasoning: vocabulary overlap = {jaccard}; both files are referenced from {load path}, so they load together; specific overlapping content: {section names}
Action: consolidate, differentiate vocabulary explicitly, or split load paths (move one to .claude/rules/{topic}.md with paths: scope)
```

**Auto-fix:** none.

---

## F4.6 — Top-of-file callout

**Framework rule:** critical decisions benefit from a `> [!type]` callout near the top.

**Trigger heuristic:** for files classified as `decision` OR containing `decision`/`rule`/`policy` in H1 or frontmatter, check first 30 lines for `^>\s*\[!(important|warning|note|info|tip|caution)\]`.

**Agent judgment:** for each candidate without a callout:
- Read the file. Identify the load-bearing claim — is there a single sentence that captures the decision/rule?
- Reasoning supplies that sentence as a suggested callout body.

**False positives to skip:**
- Files that already lead with an H1 + a one-sentence summary (functionally a callout without the syntax).

**Severity:** warn.

**Finding format:**
```
{path} — no top-of-file callout
Reasoning: this is a {decision/rule/policy} file; the load-bearing claim appears to be "{one-sentence summary the agent extracts}"
Action: add `> [!important]\n> {summary}` at the top
```

**Auto-fix:** none.

---

## F4.7 — Daily file size

**Framework rule:** focused 300-token prompts beat full 113K contexts; daily bloat is a known anti-pattern.

**Trigger heuristic:** every `daily` file. Tokens ≈ bytes/4. Soft budget 2,000 tokens.

**Agent judgment:** for each candidate over budget, read the file:
- What's bloating it? Pasted conversation history? Long meeting transcripts? Action items that should be elsewhere?
- Reasoning names the bloat source and recommends where it belongs.

**False positives to skip:**
- Daily entries that capture a single substantive event (e.g., a major decision recorded in detail) — flag with low severity.

**Severity:**
- > 4,000 tokens → fail
- > 2,000 tokens → warn

**Finding format:**
```
{path} — daily note {tokens}t (>{budget}t)
Reasoning: {what's bloating it — pasted X, transcript of Y, etc.}
Action: extract {specific content type} to {specific destination} (e.g., decisions to Intelligence/decisions/, meeting transcripts to Intelligence/meetings/)
```

**Auto-fix:** none.

---

## Finding schema

Same shape as F1 — every finding has `reasoning`. See SKILL.md Step 2.4.
