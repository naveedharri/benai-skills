# Whole-file Audit (Step 3, file branch)

For a CLAUDE.md, a skill, or a project-instructions block. Classify every instruction line, propose the fix, present, then edit on approval.

## Buckets
Each line goes in exactly one:
- **RETIRED:** the model now does this on its own. Delete candidates. Matches anything in `retired-instructions.md`.
- **ONE-SIDED:** states a cost or command without its counterweight, so the model overfits. Rewrite with both sides.
- **BARE PROHIBITION:** never / always / do not, with no reason. Rewrite as judgment plus the why.
- **AGGRESSIVE:** CRITICAL, YOU MUST, all caps. Rewrite in normal language; Claude 5 overtriggers on these.
- **OBVIOUS:** anything the model can see by listing the folder or reading the repo. Delete candidates.
- **KEEP AS HARD RULE:** expensive if wrong: deletes, sends, money, permissions, client-facing surfaces, legal. Do not soften. Add the reason if missing.
- **KEEP AS GOTCHA:** non-obvious project facts the model cannot discover. The most valuable lines in the file. Leave alone.

## Procedure
1. Inventory every instruction line with its bucket. Unsure: mark with a question mark and let the user decide. Never guess on safety-relevant lines.
2. Write the replacement (or DELETE) for every RETIRED, ONE-SIDED, BARE PROHIBITION, AGGRESSIVE and OBVIOUS line using `rules-to-reasons.md`.
3. Present a three-column table: original line, proposed line or DELETE, one-line reason with bucket. Close with counts per bucket and the estimated line reduction.
4. Edit only after approval. Preserve the file's voice and formatting.
5. If the file is long because it holds many topics rather than many bad rules, say so: route sections into folder-level instruction files instead of trimming rules. Rule quality and file structure are different problems.

## Rules for the audit
- Never rewrite a KEEP line to look productive. Fewer correct changes beat many cosmetic ones.
- One-line role, XML-style section tags, 3 to 5 format examples, and ordered steps where order genuinely matters all stay (BEST, `rulebook.md`).
- Anthropic's own examples of the rewrite are in `rules-to-reasons.md`; reuse their shape.
