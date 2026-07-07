# Scoping a Skill (Step 1)

Use this to decide the skill's single job and whether to build one skill or a chain. Produce a scope decision and confirm it with the user before extracting.

## When a skill is worth building
Build one when a task recurs: a repetitive task, a correction you keep giving the agent, context you keep re-pasting, or a process you want to hand to someone else. A genuine one-off does not need a skill. If it will not repeat, say so and stop.

## Name the single job
Write the job in one sentence as "[verb] [object]" (for example: "draft a win-back email for one churned customer"). If you cannot state it in one sentence, the scope is too wide. Narrow until you can.

## Decide one skill or several
- The "and" test: if the one-sentence job needs "and" to be accurate, it is more than one job. Split it.
- The cutoff line: one skill = one task a user could finish in a single chat session, roughly 1 to 3 prompts. If the task clearly spans more than that, split it into a chain of small skills, each built and tested on its own.
- Internal steps do not count as separate jobs. One job with several steps stays one skill. Multiple jobs is what you split.

## Right-size it
Do not scope the whole end-to-end process into one skill. Take the smallest slice that still produces value on its own and build that first. If the user described a large process, name the smallest valuable slice and confirm you are building only that.

## When the split is unclear
Default to one skill for the one job now. Tell the user: build this, test it, and if it drifts across tasks or gets long and unreliable, split it then. Do not over-split up front.

## Ship small, then iterate
The first version is decent, not final. Treat it like onboarding an intern or shipping software: it gets good through use, not on the first pass. Expect 2 to 5 improvement loops. Build a small working skill; improvement comes from using it (see evals-and-improvement.md). Do not attempt a complete, polished skill in one pass, and do not conclude the technology is not there yet when the real work is iteration.

## Output of Step 1
- One-sentence job statement.
- One-or-many decision with reasoning; if splitting, the list of separate skills.
Confirm both with the user before proceeding to Extract.
