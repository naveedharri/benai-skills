# Functionality Eval Prompt

Run this once against every skill before you call it done. Paste it into a fresh session (so nothing from the build carries over) with the skill installed.

---

Run an eval on this skill with 3 sub-agents to test if it functions the way it is supposed to, according to the goal and steps laid out in the SKILL.md. Does it execute the process in the right order? Does it load the reference files when it should (if applicable)? Does it call the connector correctly (if applicable)? Give me a report with what passed, what failed, and specific fixes for anything that did not work.

Here is the test input to run it against: [paste the example input, e.g. a topic, URL, or transcript]

---

## How to read the result

Pass only if all three are true:
1. It executed the process in the order the SKILL.md lays out.
2. It loaded every reference file the relevant steps point to.
3. It used the connector correctly, if the skill has one.

If any fails, that failure is your next fix. Adjust the skill and run this again. Repeat until it passes. This loop is part of building the skill, not an optional extra.

## Optional: add your own pass/fail criteria
For skills where "correct" is subjective (copy, analysis, judgment), also write two or three concrete criteria for what a good output looks like, and check the run against them. Keep them simple and specific.
