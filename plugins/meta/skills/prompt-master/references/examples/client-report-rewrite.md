# Example: rewriting an old prompt for Claude 5

Input type: existing prompt. Surface: Claude Cowork. Run length: long (touches files, several minutes).

## The user's original prompt

```
You are an expert business analyst. CRITICAL: you MUST be thorough. First, open the client folder and read every file. Second, find the August analytics export. Third, update the report with the new numbers. Fourth, write a recommendation. Think step by step. Double-check all numbers before responding and verify your work. Do not use markdown. Do not change anything else. Give me a full summary of everything you did.
```

## Step 2, stripped
- "CRITICAL: you MUST be thorough" (retired #4, #13)
- "First / Second / Third / Fourth" script (retired #12)
- "Think step by step" (retired #3)
- "Double-check all numbers ... verify your work" (retired #1)
- "Do not use markdown" rewritten positive (retired #7)
- "Give me a full summary of everything you did" replaced by a report-back cap (rule 6)
- Kept: the one-line role, since Cowork project has no standing instructions here.

## Delivered prompt

```
You are the analyst on our agency's client accounts.

THE JOB
Update the August client report with the latest numbers and one clear recommendation.

THE WHY
The client's CEO reads this report to set next month's budget. It has to be skimmable and decision-ready.

THE GUARDRAILS
- Only update the August report file. Leave the rest of the client folder alone.
- Keep the existing structure and branding; the client signed off on them.
- Make routine judgment calls yourself. Ask me only if the numbers look wrong at the source.

DONE MEANS
- Every number traces to the August analytics export in the data folder.
- Under 300 words, same 5 sections as July, written in flowing prose.
- When you finish, tell me where the file is and give me 3 short bullets on what changed. Nothing more.
- Before reporting progress, audit each claim against a tool result from this session. Only report work you can point to evidence for; if something is not yet verified, say so explicitly. Report outcomes faithfully: if tests fail, say so with the output; if a step was skipped, say that; when something is done and verified, state it plainly without hedging.
```

## Change log delivered with it
- Removed the four-step script and gave the job as an outcome (Opus 5 guide: complete task up front; Boris Cherny, YC interview 15:20).
- Added the why: who reads it and what they decide (Fable 5 guide, "Give the reason, not only the request").
- Deleted "double-check", "verify", "think step by step", "CRITICAL" (Opus 5 guide, self-correction and task scope; best practices, tool usage).
- Capped scope, length and report-back to 3 bullets (Opus 5 guide, verbosity and deliverable length).
- Appended Anthropic's audit line verbatim because the run touches files (Fable 5 guide, "Ground progress claims during long runs").
