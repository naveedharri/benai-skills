# Output skill template: structure, SKILL.md skeleton, calibration

## Directory structure

```
{firstname}s-voice/
├── SKILL.md
├── CALIBRATION.md
├── references/
│   ├── voice-{register}.md      (one per register, from the analysts)
│   ├── gold-{register}.md       (only if gold examples don't fit inside the voice file)
│   ├── voice-dm.md              (if DMs collected)
│   └── values.md                (merged opinions layer)
└── scripts/
    └── voice_lint.py            (from assets/voice_lint_template.py, customized)
```

## SKILL.md skeleton for the generated skill

Frontmatter: `name: {firstname}s-voice`; description in the pushy pattern - "Draft or judge content in {Name}'s voice. Use EVERY TIME output is written as {Name} or scored against their tone - {list their registers}. Triggers include 'reply as {Name}', 'draft in {Name}'s voice', 'judge this draft', 'does this sound like {Name}'. Includes a deterministic red-flag linter plus an LLM rubric judge; every draft must pass before it ships."

Body sections, in order:

1. **Identity line**: two jobs (draft + judge), never ship without the loop, corpus provenance in one sentence ("Built from X spoken words, Y comments, Z posts... trust the references over instinct; when instinct disagrees with a number, the number wins").
2. **Workflow** (numbered):
   1. Classify the content type (list the register types).
   2. Read the references for that type (table). Non-negotiable.
   3. Register-specific pre-step if one exists (e.g. community replies: classify the POST type first via the playbook - it decides length and shape).
   4. Draft.
   5. Lint: `python3 scripts/voice_lint.py --type <type>` with heredoc - RELATIVE path from the skill folder (absolute paths break when the skill is installed elsewhere).
   6. Judge with the rubric; any HARD lint violation caps the score at 59.
   7. Below 80: fix named failures, redraft, max 2 redrafts.
   8. Output draft + verdict block:
      ```
      --- {NAME} VOICE ENGINE VERDICT ---
      score: NN/100 (per-dimension breakdown)
      lint: PASS|FAIL (N hard, N soft: rule names)
      attempts: N
      ```
3. **Reference map** - type → files to read.
4. **The rubric** - 6 dimensions summing to 100. Production weights: Directness 20, Register 20, Opinion alignment 20 (contradicting values.md = automatic 0 + cap at 59), Specificity & honesty 15, Structure & routing 15, Length calibration 10. Fill each dimension's "what earns full marks" from the measured data, not generic language.
5. **Non-negotiables** - the memorize-before-drafting list. Only measured facts ("NEVER X (0/88)", "his ladder is a < b < c"), each traceable to a reference file. Include the channel-contrast rules (the same word allowed in one register, banned in another).
6. **Data provenance and refresh** - what was collected, when, how; which corpora are thin; how to refresh a register.
7. **Update path for skipped sources** - if dictation (or any source) was deferred, write the exact procedure so "update my voice skill with my {tool} transcripts" works later: locate the store, export, split by destination app, distill, MERGE into existing references (never a separate register), re-calibrate.

Keep the generated SKILL.md under ~150 lines; the references carry the detail.

## Linter customization (from assets/voice_lint_template.py)

The template ships with the universal rules (em dash, AI vocabulary, corporate lingo, hype, hope-this-finds-you-well). Customize by:

1. **LENGTH dict** - per-register (hard_cap, soft_target, min) from the measured medians and ceilings. Bias caps low: the person's rare long-form is earned, a generated draft's is not.
2. **Person-specific hard rules** - only where the corpus showed ZERO occurrences of a plausible pattern (banned openers, banned intensifiers, sign-offs, formatting). Quote the measurement in a comment on every rule ("# 0/88 despite every member writing it").
3. **Type-conditional rules** - words real in one register, absent in another. Implement as `if kind in (...)` blocks.
4. **Required elements** - inverted rules (newsletter must contain the sign-off; post should end with a link → soft).
5. **Soft rules** - rare-but-real moves (found in the "DO occur" list) that shouldn't hard-fail but shouldn't repeat every draft.

Rule-of-thumb severity: hard = fabrication tell (would out the draft as AI); soft = drift (off-pattern but survivable). 3+ softs = fail.

## CALIBRATION.md

Written after running the linter against the real corpus. Must contain:

1. **Real-content pass rates per register** (target >= 90%), with every failure explained (artifact / deliberate strictness).
2. **Rules corrected during calibration** - every place live data beat instinct, with the evidence. This section teaches future editors to trust the corpus.
3. **Known-bad test** - a deliberately generic AI draft and the count of hard violations it trips (expect 10+; if it passes, the linter is too loose).
4. **Live Layer-2 results** - 1-2 real drafts through the full loop with scores.
5. **Maintenance procedure** - self-contained (no session-scoped paths): re-collect per provenance, re-lint, targets, corpus-wins rule.

## Compliance checklist before handoff

- `name` matches the directory, lowercase-hyphenated.
- Description < 1024 chars, includes what + when + trigger phrases.
- SKILL.md < 500 lines; reference files > 300 lines get a table of contents.
- No absolute paths anywhere in instructions (relative to the skill folder).
- No `__pycache__`, `.DS_Store`, or other junk in the folder.
- Script is stdlib-only Python (no pip installs for the user).
