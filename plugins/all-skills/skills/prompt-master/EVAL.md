# Functionality eval for prompt-master

Run in a fresh session with the skill installed. Pass only if all three hold: steps executed in SKILL.md order, the reference file for each step loaded, output is one prompt block plus a change log of at most five cited bullets.

Prompt to paste:

Run an eval on this skill with 3 sub-agents to test if it functions the way it is supposed to, according to the goal and steps laid out in the SKILL.md. Does it execute the process in the right order? Does it load the reference files when it should? Give me a report with what passed, what failed, and specific fixes for anything that did not work.

Here is the test input to run it against:

"Fix this prompt, it runs in Claude Cowork: You are an expert marketer. CRITICAL: you MUST research thoroughly. First search our competitors, then make a comparison table, then write a summary. Think step by step and double-check everything. Do not use bullet points. Tell me everything you did."

Output criteria:
1. The delivered prompt has no "CRITICAL", "think step by step", or "double-check" left in it.
2. It contains a why sentence naming who the output is for and what it enables.
3. It caps the report-back (a number of bullets or sentences) and the deliverable size.
