# The Full Job Brief (Step 3)

Build every prompt in this shape. Fill the brackets from the intake. Drop a part when the task does not need it; do not pad a small task into four sections.

## The template

```
THE JOB
[What you want done, as an outcome, not as steps. One or two sentences.]

THE WHY
I'm working on [the larger task] for [who it's for]. They need [what the output enables].

THE GUARDRAILS
- Only touch [the scope]. Leave everything else alone.
- [Anything that must not change, be sent, or be deleted, with the reason.]
- Make routine judgment calls yourself. Ask me only if the answer would change the whole result.

DONE MEANS
- [How we both know it's finished: the exit criteria.]
- Keep the deliverable to [size: sections, word count, or "as short as covers the substance"].
- When you finish, tell me where the result is and give me [3] short sentences or bullets, matching the deliverable's format, on what you did. Nothing more.
```

## Long-run addendum
When the task runs many steps, touches files, or will not be reviewed line by line, append this line under DONE MEANS, verbatim, unchanged (FABLE5, "Ground progress claims during long runs"):

```
Before reporting progress, audit each claim against a tool result from this session. Only report work you can point to evidence for; if something is not yet verified, say so explicitly. Report outcomes faithfully: if tests fail, say so with the output; if a step was skipped, say that; when something is done and verified, state it plainly without hedging.
```

## Decision rules while filling it
- THE JOB names a deliverable a colleague could hand back. If you cannot name it, go back to the interview; one more question.
- THE WHY is one sentence. Who reads it and what they decide with it beats any adjective.
- THE GUARDRAILS hold scope and the expensive mistakes only. Anything the model would do correctly on its own is not a guardrail.
- DONE MEANS always has all three caps (exit, deliverable size, report-back size) for a long run. For a quick answer, the report-back cap alone is usually enough.
- Use plain section labels or XML-style tags; both work. Match whatever the user's surface already uses.
- Add a one-line role at the top only when the domain is specialised and the surface has no standing instructions.
- Add examples (3 to 5, in example tags) only when output format matters and words cannot pin it down.

## Filled example

```
THE JOB
Update our monthly client report for August with the latest numbers and one clear recommendation.

THE WHY
I'm running the [client name] account for our agency. The client's CEO reads this to decide next month's budget, so it has to be skimmable and decision-ready.

THE GUARDRAILS
- Only update the August report file. Leave the rest of the client folder alone.
- Keep the existing structure and branding exactly as they are; the client signed off on them.
- Make routine judgment calls yourself. Ask me only if the numbers look wrong at the source.

DONE MEANS
- Every number traces to the analytics export in the data folder.
- Under 300 words across the same 5 sections as July.
- When you finish, tell me where the file is and give me 3 short bullets on what changed. Nothing more.
```
