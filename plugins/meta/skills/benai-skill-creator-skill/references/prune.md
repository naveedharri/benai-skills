# Pruning (Step 4)

Make the skill as small as possible. Apply to SKILL.md and every reference file.

## Deletion test (primary tool)
For every paragraph, sentence, and rule: if deleting it would not change what the agent does, delete it. Example: an instruction to "write a long detailed commit message" is a no-op if the agent would do that anyway.

## Remove no-ops
Text that looks like instruction but changes nothing:
- Instructions the agent follows by default.
- Restated baseline good practice.
- Encouragement ("be thorough", "do a great job") with no concrete change attached.

## Enforce single source of truth
Each rule, template, or piece of reference material has exactly one home. If it appears in two places it will drift. Pick one location and point to it. This applies across reference files, not just within SKILL.md.

## Clear sediment
Accumulated half-relevant or stale material:
- Relevant to only one branch: move it to that branch's file.
- Stale or wrong: delete it.
- Irrelevant: delete it.

## Cut AI bloat
Strip filler, hedging, and throat-clearing. Run the humanizer skill or a plain caveman edit. No em dashes, no time-sensitive phrasing, one consistent term per concept.

## Checklist
- Deletion test run on every paragraph.
- No no-ops left.
- Single source of truth for every rule and template.
- No stale or misplaced sediment.
- Bloat stripped; language plain and direct.
- SKILL.md genuinely small.
