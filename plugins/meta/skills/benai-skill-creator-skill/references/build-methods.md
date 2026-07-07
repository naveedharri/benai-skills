# Choosing the Build Method

Reference for the routing decision. The rule and the reason for each method.

## Method 1: One-shot from memory. Do not use.
Describing the whole process in one prompt from memory yields the idealized version, missing the judgment calls and exceptions that made it work. If the user tries this, redirect: have them do the task first, then build from it.

## Method 2: Plan first, then build.
Use when the task has not been done yet (only an idea), or when the process is crisp and engineering-like. Do not run an interview here. Hand off to the `process-interviewer` skill, which interviews then builds.

## Method 3: Do the task, then build. Default for knowledge work.
Use when the task was just done in this chat. Extract the real process from the conversation (see extract-from-task.md). This is the method this skill runs. It captures the actual judgment and exceptions and has the highest success rate for knowledge work. Most people cannot fully articulate work they are good at (Polanyi's Paradox: we know more than we can tell), so correcting the agent as it does the task surfaces the edge cases and rules that describing it from a blank page never would.

## Rule
Task done in this chat: Method 3. Only an idea: Method 2 (hand off to process-interviewer). Never Method 1.
