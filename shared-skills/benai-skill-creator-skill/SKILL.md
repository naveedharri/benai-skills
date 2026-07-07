---
name: benai-skill-creator-skill
description: Turn a task you just finished into a small, reliable, single-purpose skill by reverse-engineering the process from the conversation you already had. Also improves or audits an existing skill. Use this AFTER you have done a piece of knowledge work in a chat (research, a draft, an analysis, a prep doc) and want to lock the process in as a skill. Triggers include "build a skill from this", "turn this into a skill", "make a skill out of what we just did", "skill-ify this", "build a skill", "improve this skill", "audit my skill", "why does my skill suck", "make my skill smaller", or when the user finishes a repeatable task and wants to reuse it. Built for knowledge workers, not just engineers. For skills you have NOT done yet (only an idea), hand off to process-interviewer instead.
---

# BenAI Skill Creator

Most skills are built wrong: someone describes a process from memory before running it, and gets the cleaned-up version that drops the judgment and the exceptions. This does the opposite. You do the task once in a chat, then this turns what actually happened into a small, reliable skill.

Two rules carry the whole skill: keep it **modular** (one goal, one job) and remember **skills are never finished** (ship a small working one, then improve it by using it). The reasoning is in `references/scope-and-mindset.md`.

## Route first

Read the situation and pick a branch. Say which branch you picked and why, then proceed.

| Situation | Branch | Do this |
|-----------|--------|---------|
| The user just finished a real task in this chat | **Build** | Steps 1 to 5 below |
| The user only has an idea, nothing has been done yet | **Plan** | Hand off to the `process-interviewer` skill (interview first, then it builds). Stop here. |
| The user points at an existing skill to fix or shrink | **Improve** | Skip step 2 (Extract). Run steps 1, 3, 4, 5 against the existing skill. |

If unsure, ask one question: "Did we already do this task in this chat, or is it still just an idea?"

## The build flow

Track progress out loud:

```
Task Progress:
- [ ] 1. Scope: one goal, right size, split or not
- [ ] 2. Extract: pull the real process out of the chat
- [ ] 3. Structure: write a small SKILL.md + reference files
- [ ] 4. Prune: cut everything that does not change behavior
- [ ] 5. Eval: test it works, add the self-improvement rule
```

### 1. Scope
Decide the one job and whether it should be one skill or several. Read `references/scope-and-mindset.md`. The cutoff line: a skill is one task doable in a single chat session (roughly 1 to 3 prompts). If the task is bigger, split it into a chain of small skills.

### 2. Extract
Reverse-engineer what actually happened. Do not ask the user to re-describe their process from memory. Walk back through this conversation and pull out the real steps, the judgment calls, and the reference material. Read `references/extract-from-task.md` for the technique, then play the process back to the user and let them correct it.

(New to skills, or want the reasoning behind the three build methods? Read `references/build-methods.md`.)

### 3. Structure
Write the skill. A SKILL.md does three jobs only: **trigger**, **steps**, **routing**. Everything else goes in reference files. Keep SKILL.md short and small-scoped. Read `references/structure.md`. If the process needs a live connector or MCP, read `references/connectors-and-mcp.md` first and decide whether you actually need it. Scaffold the files from `templates/_SKILL.md.tmpl` and `templates/_reference.md.tmpl`. (The other two files in `templates/` are paste-in content for step 5, not scaffolds.)

### 4. Prune
Make it as small as possible. Run the deletion test on every paragraph: if removing it would not change what the agent does, remove it. Kill no-ops, duplication, and bloat. Read `references/prune.md`.

### 5. Eval
Test that it works, then bake in improvement. Run the functionality eval from `references/evals-and-improvement.md` (the exact prompt is in `templates/eval-prompt.md`). Embed the self-improvement rule (`templates/self-improvement-rule.md`) and the save-good-outputs habit so the skill keeps getting better as it is used.

## When you are done
Save the skill as its own folder (SKILL.md plus a `references/` folder) in the workspace, show the user the file tree and the SKILL.md, and tell them the one command to trigger it. Then remind them: use it a few times, and let it improve. It is not finished, and that is correct.

Want a worked example before you start? Read `references/example-churn-recovery.md`.
