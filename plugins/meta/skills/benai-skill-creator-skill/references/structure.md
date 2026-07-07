# Structuring the Skill (Step 3)

Rules for turning the confirmed process into files. Follow them while writing the SKILL.md and its reference files.

## Contents
1. File model
2. SKILL.md: the three jobs
3. Trigger: human vs AI
4. Keep SKILL.md small
5. Reference files and progressive disclosure
6. Human-in-the-loop
7. Self-improvement rule
8. Save good outputs
9. Frontmatter description
10. Pre-prune checklist

## 1. File model
A skill is one SKILL.md plus reference files that branch off it. SKILL.md is the entry point; reference files hold detail and load only when a step needs them. Self-contained: everything lives in the skill's own folder, with no runtime dependency on other skills.

## 2. SKILL.md: the three jobs
Put only these in SKILL.md:
- Trigger: the frontmatter description.
- Steps: the procedure as plain instructions. Each step says exactly what to do, nothing else. No preamble, no explaining why. If a line does not tell the agent what to do, cut it or move it to a reference file.
- Routing: a pointer to the reference file each step needs.
Anything else (explanations, templates, examples, long tables) goes in a reference file. Route to it.

## 3. Trigger: human vs AI
Default to human-invoked. Each AI-invoked skill's description sits in context and costs tokens on every request, and it can auto-fire when the user did not want it. Turn AI invocation off unless hands-free triggering is clearly worth that cost (for example an autonomous, scheduled routine).
- To turn it off: set `disable-model-invocation: true` in the frontmatter. The skill then runs only when the user types the slash command.
- Keep the description even when invocation is off. It is the display fallback shown in the skill list. It does not re-enable auto-invocation; `disable-model-invocation: true` still wins.

## 4. Keep SKILL.md small
Every word costs tokens on every run. Main lever: move any material used by only one branch out of SKILL.md and behind a pointer, so it loads only when that branch runs.

## 5. Reference files and progressive disclosure
- Write each reference file as operational instructions for the agent that will execute the skill: directives, decision rules, criteria, checklists, templates, and examples. Do not write it as an explanation aimed at a human reader. The agent reads it mid-task and acts on it.
- One purpose per reference file. No grab-bag files.
- Progressive disclosure: name the exact file to read inside the step that uses it, so context loads only that file, only at that step. Never tell the skill to read all reference files up front.
- Keep pointers one level deep from SKILL.md. Do not nest references behind references.
- If a reference file passes ~100 lines, add a short table of contents.

## 6. Human-in-the-loop
Add a checkpoint (skill stops and asks for review or approval) before any consequential action: send, publish, spend, delete. Source these from the judgment points flagged during extraction.
- At every human-in-the-loop decision point, have the skill present 5 to 10 options or variations immediately, then wait for the user to pick. Do not advance on a single suggestion, and do not make the user re-prompt for alternatives. This is what makes a steered, multi-step skill fast to use.

## 7. Self-improvement rule
Embed a rule that updates the skill as it runs: when the user corrects a step, update the relevant reference file or add a permanent rule; when a hard rule emerges, record it. Use templates/self-improvement-rule.md and point it at this skill's real files.

## 8. Save good outputs
Instruct the skill to save genuinely good results as examples (for example references/examples/) so they become reference material for later runs.

## 9. Frontmatter description
- One line, third person, under 1024 characters.
- State what it does and exactly when to use it; include the trigger phrases a user would type; be slightly pushy so it fires at the right time.
- No vague wording, no time-sensitive phrasing, no Windows-style paths. One consistent term per concept.

## 10. Pre-prune checklist
- SKILL.md holds only trigger, steps, routing. Steps are plain instructions, no filler.
- Invocation decided: `disable-model-invocation: true` set unless the skill genuinely needs to auto-fire.
- Each step names the one reference file it needs, one level deep (progressive disclosure).
- Every reference file has a single purpose and is written for the executing agent, not a human reader.
- Human checkpoints in place for consequential actions; each decision point offers 5 to 10 options.
- Connectors and research kept out of main context (static reference file, or behind a subagent).
- Self-improvement rule and save-good-outputs embedded.
- Description is one line, specific, and pushy.
