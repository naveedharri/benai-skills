# Retired Instructions (Step 2)

Check every line of an existing prompt against this list. Match: remove it, or replace it with the fix given. Record each change for the step 5 change log. Sources are short names from `rulebook.md`.

| # | If the prompt says | Do this | Source |
|---|---|---|---|
| 1 | "Double-check your answer", "re-verify before responding" | Delete. Claude 5 verifies on its own; the line causes re-verification. | OPUS5, Self-correction |
| 2 | "Include a final verification step", "use a subagent to verify" | Delete. | OPUS5, Task scope |
| 3 | "Think step by step", "reason carefully before answering" | Delete. Thinking is adaptive on Claude 5. | BEST, Thinking |
| 4 | "CRITICAL:", "You MUST", all-caps emphasis | Rewrite in normal language: "Use [tool] when..." | BEST, Tool usage |
| 5 | "If in doubt, use [tool]", "default to using [tool]" | Rewrite: "Use [tool] when it would improve your understanding of the problem." | BEST, Overthinking |
| 6 | "Only report high-severity issues", "be conservative" (review prompts) | Rewrite: report everything, filter in a separate pass. | OPUS5, Code review bullet |
| 7 | Bare "do not use markdown", "no bullet points" | Rewrite as the positive: "Write in smoothly flowing prose paragraphs." If the user also asks for a table or list, keep that element and apply the prose rewrite to the surrounding text only. | BEST, Format control |
| 8 | A prefilled opening line ("Here is the summary:") | Delete. Prefill is unsupported from Claude 4.6 on; instruct directly: "Respond directly without preamble." | BEST, Prefill migration |
| 9 | A defensive patch nobody can explain ("never mention plan details, point to the URL") | Delete unless the user can name the failure it fixes. | CTXENG core argument |
| 10 | "Do not think", "do not reason" | Delete. On Opus 5 it increases leaked internal tags. | OPUS5, Thinking disabled |
| 11 | "Explain your reasoning" as a standing line, Fable 5 target | Delete. Can trigger the reasoning_extraction refusal and reroute to Opus 4.8. Ask ad hoc instead. | FABLE5, Scaffolding |
| 12 | "First do 1, then 2, then 3, then 4" task scripts | Rewrite as job, guardrails, exit criteria (step 3). | BORIS 15:20 |
| 13 | "Be thorough", "do a great job", "this is vital to my career" | Delete. No concrete change attached. | Deletion test |
| 14 | "Tell me everything you did", "give me a full summary" | Replace with a report-back cap: "tell me where the result is and give me [3] short sentences on what you did. Nothing more." | OPUS5, Verbosity |
| 15 | Chain-of-thought or emotion-prompting boilerplate carried from older frameworks | Delete. | BEST, Migration considerations |

## Keep these (do not strip)
- Project gotchas the model cannot discover on its own.
- Hard rules where being wrong is expensive: deletes, sends, money, permissions, client-facing surfaces.
- A one-line role.
- XML-style section tags.
- 3 to 5 examples when output format matters.
- Numbered steps when order or completeness genuinely matters (a checklist, a compliance sequence). Order that matters is not a script.
