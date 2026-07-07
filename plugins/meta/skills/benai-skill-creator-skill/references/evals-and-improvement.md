# Eval and Improvement (Step 5)

## Run the functionality eval
Before calling the skill done, run one eval in a fresh session (nothing from the build carries over). Use the exact prompt in templates/eval-prompt.md. It checks:
1. Executes the process in the SKILL.md order.
2. Loads the reference files its steps point to.
3. Uses the connector correctly, if any.
Fail any one, and that is the next fix. Adjust the skill and re-run until it passes. This loop is part of building, not an optional extra.

## Embed the two improvement mechanisms
- Self-improvement rule: paste templates/self-improvement-rule.md into the built skill and point it at that skill's real files.
- Save good outputs: instruct the skill to save strong results as examples for future runs.

## Optional pass/fail criteria
For skills where "correct" is subjective (copy, analysis, judgment), write 2 or 3 concrete criteria for a good output and check runs against them. Keep them simple and specific.

## Optimizing through use
Once the skill functions, it improves by being used. Three moves:
1. If it does not do what the SKILL.md says, ask the agent why first. It can often spot the unclear instruction or the error in its own reference file. Fix that, then re-run the eval.
2. If the process ran correctly but the output needed correcting (a weak result or an edge case the build missed), add a new rule. Be specific.
3. Save genuinely good outputs back into the skill as examples.
The self-improvement rule prompts 2 and 3 automatically, but watch for the runs where it does not.

## Principle
The first version is decent, not final. It improves through use, evals, and self-improvement. Autonomous deployment (routines, scheduled tasks) is a separate, later concern and out of scope here.
