---
name: rule-rewriter
description: Audit a CLAUDE.md or skill file for rules written for older Claude models and rewrite them for the Claude 5 generation. Finds one-sided rules, bare prohibitions, retired instructions, and aggressive language, then rewrites each into judgment plus the reason, or flags it for deletion. Use when the user says "rewrite my rules", "audit my CLAUDE.md", "fix my claude md", "rule rewriter", "my skills feel too strict", or after upgrading to a Claude 5 model.
---

# Rule Rewriter

Claude 5 models follow judgment better than they follow rules. A bare "never do X" gets ignored or overfitted; "X breaks because [reason], so avoid it" generalizes. This skill audits an instruction file and rewrites it accordingly.

Grounded in Anthropic's published guidance:
- Rules to judgment: https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models
- Give the why: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
- Remove verification instructions: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5

## Process

1. **Locate the target.** Default to the CLAUDE.md in the current working folder. If the user names a skill or another file, use that. If nothing is found, ask for the path and stop.

2. **Inventory every instruction line.** Classify each into exactly one bucket:
   - **RETIRED**: instructions the model now does by itself. Delete candidates. Examples: "double-check your work", "verify before responding", "think step by step", "be thorough", "always re-read the file", "you are an expert...".
   - **ONE-SIDED**: rules that state a cost or a command without the counterweight, so the model overfits. Rewrite with both sides.
   - **BARE PROHIBITION**: "never / always / do not" lines with no reason. Rewrite as judgment plus the why.
   - **AGGRESSIVE**: "CRITICAL", "YOU MUST", all-caps emphasis written to fix undertriggering on old models. Soften to normal language; Claude 5 overtriggers on these.
   - **OBVIOUS**: anything the model can see by listing the file system or reading the repo. Delete candidates.
   - **KEEP AS HARD RULE**: places where being wrong is expensive. Safety, destructive or irreversible actions, client-facing sends, money, permissions. Do not soften these; a hard rule is correct here.
   - **KEEP AS GOTCHA**: non-obvious project facts the model cannot discover on its own. These are the most valuable lines in the file; leave them alone.

3. **Rewrite.** For every RETIRED, ONE-SIDED, BARE PROHIBITION, AGGRESSIVE, and OBVIOUS line, produce the replacement (or deletion) using the patterns below.

4. **Present before touching anything.** Output a three-column review: original line, proposed line (or DELETE), one-line reason with its bucket. End with the counts per bucket and the estimated line reduction. Apply changes only after the user approves, then edit the file.

5. **Suggest the follow-up.** After applying, remind the user that `claude doctor` right-sizes overall CLAUDE.md and skill length, which this skill deliberately does not do.

## Rewrite patterns

**Bare prohibition to judgment plus why** (Anthropic's own example):
- Before: `NEVER use ellipses`
- After: `Your response is read aloud by a text-to-speech engine, so never use ellipses since it cannot pronounce them.`

**One-sided rule to both sides** (Anthropic's escalation example):
- Before: `Avoid escalating to a specialist, it costs $8 per case.`
- After: `Escalating costs $8, but a wrong answer costs a refund and the customer's trust. Escalate when you are not confident.`

**Retired instruction to deletion**:
- Before: `Before finishing, double-check every file you changed and verify your work.`
- After: DELETE. Claude 5 verifies its own work; this line causes over-verification and wastes tokens.

**Aggressive to normal**:
- Before: `CRITICAL: You MUST use the search tool when the user asks about the codebase.`
- After: `Use the search tool when the user asks about the codebase.`

## Rules for this skill itself

- Never rewrite a line in the KEEP buckets to seem productive. Fewer, correct changes beat many cosmetic ones.
- Preserve the file's voice and formatting conventions.
- When unsure which bucket a line belongs to, put it in the review table with a question mark and let the user decide. Do not guess on safety-relevant lines.
- This skill changes rule quality, not file structure. For a CLAUDE.md that is too long, route sections into folder-level instruction files instead (see the companion optimization framework).

- Inside a vault, this audit also runs as framework **F10** of `/os-optimizer` and `/optimizer`, alongside the other nine. Use this standalone skill for a single file outside a vault, or when you want the rule rewrite without the full audit. The vault frameworks are the ones that also propose the documented Claude Fable 5.1 guardrails (F10.6).
