# Claude 5 generation — rules to judgment

## Contents

1. [Core thesis](#core-thesis)
2. [Why old rule styles backfire](#why-old-rule-styles-backfire)
3. [The seven buckets](#the-seven-buckets)
4. [Rewrite patterns](#rewrite-patterns)
5. [Fable 5.1 specific rules worth adding](#fable-51-specific-rules-worth-adding)
6. [What never gets softened](#what-never-gets-softened)
7. [Sources](#sources)

## Core thesis

Claude 5 generation models follow judgment better than they follow rules. A bare `never do X` gets ignored or overfitted, because the model cannot tell when the rule stops applying. `X breaks because [reason], so avoid it` generalizes to cases the author never wrote down.

Most vault instruction files were written against older models, where the failure mode was **undertriggering**: the model ignored instructions, so authors escalated with `CRITICAL`, `YOU MUST`, all-caps, and repetition until it complied. On Claude 5 generation models the failure mode inverts to **overtriggering**. The same emphasis that used to be necessary now distorts behaviour, and the same verification instructions now cause redundant work.

This framework audits an instruction file for rules written for the previous generation and rewrites them for the current one. It changes rule *quality*, not file structure. F1 handles size and structure, F9 handles routing and discoverability.

## Why old rule styles backfire

| Old-model pattern | Why it was written | What it does now |
|---|---|---|
| `CRITICAL: You MUST…` | Old models under-weighted plain instructions | Overtriggers. The model treats a routine step as a safety boundary |
| `Double-check your work before responding` | Old models skipped verification | Redundant. Costs tokens and latency for behaviour the model already has |
| `Never do X` with no reason | Shortest way to stop a specific failure | Overfits to the literal case, or gets dropped when it conflicts with the task |
| `Avoid escalating, it costs $8` | Steering away from an expensive action | One-sided. The model never escalates, including when it should |
| `The repo has a src/ and a tests/ folder` | Orienting a model with no tools | Obvious. The model can list the filesystem |

## The seven buckets

Every instruction line lands in exactly one:

- **RETIRED** — the model now does this by itself. Delete candidates. `double-check your work`, `verify before responding`, `think step by step`, `be thorough`, `always re-read the file`, `you are an expert…`.
- **ONE-SIDED** — states a cost or a command with no counterweight, so the model overfits in one direction. Rewrite with both sides.
- **BARE PROHIBITION** — `never` / `always` / `do not` with no reason. Rewrite as judgment plus the why.
- **AGGRESSIVE** — `CRITICAL`, `YOU MUST`, all-caps emphasis written to fix undertriggering. Soften to normal language.
- **OBVIOUS** — anything the model can discover by listing the filesystem or reading the repo. Delete candidates.
- **KEEP AS HARD RULE** — places where being wrong is expensive: safety, destructive or irreversible actions, client-facing sends, money, permissions, data loss. A hard rule is correct here. Do not soften.
- **KEEP AS GOTCHA** — non-obvious project facts the model cannot discover on its own. These are the most valuable lines in the file. Leave them alone.

## Rewrite patterns

**Bare prohibition to judgment plus why** (Anthropic's own example):

- Before: `NEVER use ellipses`
- After: `Your response is read aloud by a text-to-speech engine, so never use ellipses since it cannot pronounce them.`

**One-sided rule to both sides** (Anthropic's escalation example):

- Before: `Avoid escalating to a specialist, it costs $8 per case.`
- After: `Escalating costs $8, but a wrong answer costs a refund and the customer's trust. Escalate when you are not confident.`

**Retired instruction to deletion:**

- Before: `Before finishing, double-check every file you changed and verify your work.`
- After: DELETE. Claude 5 verifies its own work; this line causes over-verification and wastes tokens.

**Aggressive to normal:**

- Before: `CRITICAL: You MUST use the search tool when the user asks about the codebase.`
- After: `Use the search tool when the user asks about the codebase.`

## Fable 5.1 specific rules worth adding

Claude Fable 5.1 has documented behaviour differences that show up specifically inside a vault. Where the audited file is the instruction layer for a vault run on Fable 5.1, these are **additions**, not rewrites, and each has published wording:

1. **Answers from memory at low effort.** At `low` effort Fable 5.1 calls search and retrieval tools less often than Fable 5, which in a vault produces a confident answer that never opened a file. Fix: raise effort for the affected turns, or add Anthropic's verification nudge stating that recognising a name is not the same as knowing its current state, so the name itself should be searched as the user wrote it.
2. **Whole-file rewrites for small changes.** Fable 5.1 is more likely than Fable 5 to rewrite an entire note rather than make a targeted edit. Same result, more output tokens and more blast radius. Fix, verbatim from Anthropic: `The number of tokens used to edit files is best minimized, all else being equal. Therefore, when it will not affect the end result, try to surgically edit a file rather than rewrite the entire thing.`
3. **Unmarked quotations when summarizing.** Fable 5.1 reproduces source passages without marking them as quotations, which in a vault erases the line between the user's words and the model's. Fix is not a rule but one complete worked example in the instruction file: the request, a correct response, and a rationale explaining why it is correct.
4. **Single tool calls in agent loops.** Fable 5.1 may issue one tool call per turn where Fable 5 batched several, costing round trips on a vault sweep. Fix: one line instructing it to batch independent reads.
5. **Effort is the cost lever.** The default is `high`. At `medium`, results roughly match Fable 5 at lower cost, which for most vault retrieval is the right default. Effort level names do not correspond to the same amount of thinking across models, so a sweep run on Fable 5 does not carry over.

## What never gets softened

Being wrong is expensive in these areas, so a hard rule is the correct instrument and this framework leaves it alone:

- Destructive or irreversible file operations, and anything that can lose a note or its identity.
- Client-facing surfaces: sends, posts, published pages, member dashboards.
- Money, billing, and anything that spends.
- Permissions, access control, and credentials.
- Safety boundaries the user has stated explicitly.

Fewer, correct changes beat many cosmetic ones. When a line's bucket is genuinely ambiguous, surface it in the walk with a question rather than guessing, and never guess on a safety-relevant line.

## Sources

- Anthropic, the new rules of context engineering for Claude 5 generation models: https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models
- Anthropic, Claude prompting best practices (give the why): https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
- Anthropic, prompting Claude Opus 5 (remove verification instructions): https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5
- Anthropic, prompting Claude Fable 5.1 (the five behaviour fixes above): https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1
- Anthropic, what's new in Claude Fable 5.1: https://platform.claude.com/docs/en/models/fable-5-1/whats-new-fable-5-1
