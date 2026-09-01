# Rules to Reasons (Step 4)

Re-read the draft. Every hard rule gets one of three treatments. Sources in `rulebook.md`.

## Decide per rule
1. **Expensive if wrong** (delete, send, spend, permissions, client-facing, legal): keep as a hard rule, add the reason in the same sentence.
2. **A preference or style**: rewrite as judgment plus the why, or as the positive instruction.
3. **Something the model would do anyway**: cut it.

## Patterns

Bare prohibition to reason (Anthropic's own example, BEST):
- Before: `NEVER use ellipses`
- After: `This will be read aloud by a text-to-speech engine, so avoid ellipses; it cannot pronounce them.`

One-sided cost to both sides (Anthropic's escalation example, Prompting Playbook workshop):
- Before: `Avoid escalating to a specialist, it costs $8 per case.`
- After: `Escalating costs $8, but a wrong answer costs a refund and the customer's trust. Escalate when you are not confident.`

Negative to positive (BEST, format control):
- Before: `Do not use markdown.`
- After: `Write in smoothly flowing prose paragraphs.`

Aggressive to normal (BEST, tool usage):
- Before: `CRITICAL: You MUST use the search tool when the user asks about the codebase.`
- After: `Use the search tool when the user asks about the codebase.`

Rigid rule to judgment (Anthropic's comments example, CTXENG):
- Before: `Never write multi-paragraph docstrings or multi-line comment blocks, one short line max.`
- After: `Write code that reads like the surrounding code: match its comment density, naming, and idiom.`

Expensive rule, kept, with reason:
- Before: `Never email the client directly.`
- After: `Never email the client directly; every client message goes through me because they have one point of contact by contract. Draft it and hand it to me.`

## Check before moving on
- No all-caps emphasis left.
- No rule without a reason except the ones that survived rule 1 above, and those carry their reason too.
- Nothing in the prompt tells the model to verify, double-check, or think harder.
