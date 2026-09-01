---
name: prompt-master
description: The one skill for prompting the Claude 5 models the way Anthropic says to. Starts by interviewing the user one question at a time, then writes a new prompt, rewrites an old one, or audits a whole CLAUDE.md, skill or project-instruction file, applying the rules from Anthropic's Opus 5 guide, Fable 5 guide, best practices page and context engineering post. Strips retired instructions, rebuilds the ask as a Full Job Brief (job, why, guardrails, done-means), swaps bare rules for reasons, caps scope, length and report-back, and adds Anthropic's audit line on long runs. Use when the user says "prompt master", "write me a prompt", "fix this prompt", "upgrade my prompt for Claude 5", "audit my CLAUDE.md", "rewrite my rules", "my skill feels too strict", "brief this for me", "help me brief this", "I don't know where to start", or pastes any prompt and asks why Claude over-does or under-does the task.
---

# Prompt Master

Turns what the user wants into a prompt, brief or instruction file written the way Anthropic says to prompt the Claude 5 generation. Always begins by asking. The rulebook with sources is `references/rulebook.md`; read it once per session, then work from the steps.

## Steps

Track progress:

```
Task Progress:
- [ ] 1. Interview
- [ ] 2. Strip what is retired
- [ ] 3. Rebuild as a Full Job Brief (or audit the file)
- [ ] 4. Rules to reasons
- [ ] 5. Deliver with receipts
```

### 1. Interview
Read what the user gave you first (the pasted prompt, the file, the folder). Then interview one question at a time following `references/interview.md`: never ask what you could read, prioritise questions whose answer changes the shape of the prompt, stop at 7. Skip to a single confirming question when the ask is already small and clear. By the end you know the input type (rough idea, existing prompt, or whole instruction file), the surface (Claude Cowork, Claude app, Claude Code, API), the run length (quick answer or long run), who the output is for, and what done looks like.

### 2. Strip what is retired
For an existing prompt or file, check every line against `references/retired-instructions.md`; remove or replace what matches and record each change for step 5. For a rough idea, skip this step.

### 3. Rebuild as a Full Job Brief, or audit the file
- **Rough idea or existing prompt:** write it in the four-part shape from `references/job-brief.md` (job, why, guardrails, done-means). For a long run, append the audit line verbatim from that file. Drop any part the task does not need; a three-line prompt is right for a three-line task.
- **Whole instruction file (CLAUDE.md, skill, project instructions):** run the bucket audit in `references/file-audit.md`, produce the three-column review table, and wait for approval before editing anything.

### 4. Rules to reasons
Re-read the draft or the proposed rewrites. Any hard rule without a reason gets the reason or gets cut, using `references/rules-to-reasons.md`. Keep hard rules only where being wrong is expensive. Say what to do instead of what not to do.

### 5. Deliver with receipts
For a prompt: one copyable block, then a change log of at most five bullets, each naming the rule applied and its Anthropic source, taken from the source column of the reference file that drove the change (`rulebook.md` for the brief, `retired-instructions.md` for removals). For a file audit: the review table, counts per bucket, and the line reduction; apply on approval. If the user wants a standing voice or format, add the one-line install note for their surface from `references/voice-and-format.md`. Nothing else.

## Human checkpoints
- Interview answers are the first checkpoint; play the brief back in one paragraph before writing if the task is large.
- File audits never edit before the user approves the review table.
- If the user asks for options, give 3 to 5 variants that each differ in one dimension (tighter scope, longer run, different audience, terser report-back, different surface) and let them pick.

## Self-improvement
This skill is never finished. Improve it as you use it.
- When the user corrects how a step was done, update the relevant reference file (or this SKILL.md) so the correction sticks. Do not just fix it for this run.
- When a correction is a hard rule, add it here as a permanent rule with its reason.
- When the user says a prompt or audit was genuinely good, save the input and output to `references/examples/` as a model for future runs.
- When Anthropic updates the Opus 5, Fable 5 or best practices pages, update `references/rulebook.md` and re-check `references/retired-instructions.md` before changing anything else.
- Keep the skill small while doing this: when you add something, cut anything that no longer changes behavior.

## Routing
| Step | Reference |
|------|-----------|
| All steps, once per session | `references/rulebook.md` |
| 1. Interview | `references/interview.md` |
| 2. Strip what is retired | `references/retired-instructions.md` |
| 3. Rebuild (prompt) | `references/job-brief.md` |
| 3. Audit (whole file) | `references/file-audit.md` |
| 4. Rules to reasons | `references/rules-to-reasons.md` |
| 5. Standing voice or format | `references/voice-and-format.md` |
| 3. Rebuild, when the input is an existing prompt: skim before drafting | `references/examples/client-report-rewrite.md` |
