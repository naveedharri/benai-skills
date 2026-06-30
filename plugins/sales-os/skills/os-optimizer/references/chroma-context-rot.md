# Chroma — Context Rot research

## Contents

1. [Core thesis](#core-thesis)
2. [The 18 models tested](#the-18-models-tested)
3. [Methodology — six experiments](#methodology--six-experiments)
4. [Hard findings](#hard-findings)
5. [The shuffled vs structured paradox](#the-shuffled-vs-structured-paradox)
6. [Distractor effects](#distractor-effects)
7. [Position effect](#position-effect)
8. [Family-level differences](#family-level-differences)
9. [LongMemEval — focused vs full context](#longmemeval--focused-vs-full-context)
10. [The attention budget concept](#the-attention-budget-concept)
11. [Implications for vault architecture](#implications-for-vault-architecture)
12. [Dos](#dos)
13. [Don'ts](#donts)
14. [Verbatim quotes](#verbatim-quotes)
15. [Auditable signals](#auditable-signals)
16. [Sources](#sources)

---

## Core thesis

Standard NIAH (Needle In A Haystack) benchmarks make modern LLMs look reliable on long context. They aren't.

Across **18 frontier models** spanning Anthropic, OpenAI, Google, and Alibaba, the Chroma study found:

> *"Model performance consistently degrades with increasing input length."*

Worse: **structured (logically coherent) context can perform worse than shuffled context.** What matters is not whether information is present in the context — it's how it's presented and how much surrounds it.

This single finding rewrites the playbook for vault design. "Just put it in the context" is wrong. Curation, position, and signal-to-noise matter more than total information volume.

## The 18 models tested

| Family | Models |
|---|---|
| **Anthropic (5)** | Claude Opus 4, Claude Sonnet 4, Claude Sonnet 3.7, Claude Sonnet 3.5, Claude Haiku 3.5 |
| **OpenAI (7)** | o3, GPT-4.1, GPT-4.1 mini, GPT-4.1 nano, GPT-4o, GPT-4 Turbo, GPT-3.5 Turbo |
| **Google (3)** | Gemini 2.5 Pro, Gemini 2.5 Flash, Gemini 2.0 Flash |
| **Alibaba (3)** | Qwen3-235B-A22B, Qwen3-32B, Qwen3-8B |

The pattern held across **every model family**. There was no "winner" that escaped degradation — only differences in degradation slope.

## Methodology — six experiments

The study ran six controlled experiments to isolate which factors actually drive degradation:

| Experiment | What it varied | What it tested |
|---|---|---|
| **1. Needle-Question Similarity** | Cosine similarity 0.445–0.829 across 5 embedding models | Does semantic similarity between needle and question affect retrieval? |
| **2. Distractor Impact** | Baseline (needle only) vs 1 distractor vs 4 distractors | Does adding similar-but-wrong content hurt? |
| **3. Needle-Haystack Similarity** | Topical alignment between filler and target | Does the topical relationship of filler matter? |
| **4. Haystack Structure** | Coherent ordering vs randomized sentence ordering | Does logical structure help or hurt? |
| **5. LongMemEval** | Conversational QA at ~113k tokens vs focused ~300-token variants | What does real-world long context cost? |
| **6. Repeated Words** | Text replication, 25–10,000 word sequences with embedded unique words | Position effect — where do unique words survive? |

This design isolates the variables. NIAH-style benchmarks conflate them. That's why models look better on NIAH than they perform in practice.

## Hard findings

| Finding | Implication |
|---|---|
| **Length degrades all models** in every experiment | Context is a finite budget — spend it on signal |
| **Shuffled > structured** across all 18 models | Don't assume logical structure helps retrieval |
| **One distractor measurably hurts** the baseline; **four distractors compound** | Filler isn't free — every irrelevant chunk costs |
| **Distractors 2 and 3** (specific positions) appear most often in hallucinated responses | Some distractors are worse than others |
| **Claude family**: lowest hallucination rates across the board | Match model family to task risk |
| **GPT family**: highest hallucination rates — confident but wrong | Don't deploy GPT in fact-critical pipelines without guardrails |
| **Position effect**: unique words placed early have higher accuracy than buried ones | Lead with critical info, not preamble |
| **LongMemEval**: focused 300-token prompts substantially outperformed full 113k contexts | Just-in-time retrieval beats upfront dumps |
| **Claude Opus 4** showed the most pronounced focused-vs-full divergence | Even the strongest model loses meaningful capability when context bloats |
| **Low needle-question similarity** → markedly steeper degradation curves | Semantic alignment matters more at length |

## The shuffled vs structured paradox

The most counter-intuitive finding:

> *"Across all 18 models and needle-haystack configurations, we observe a consistent pattern that models perform better on shuffled haystacks."*

Why does logical structure hurt? Because adjacent documents in a logically structured set share terminology and patterns — they look like **plausible distractors**. The model can't easily distinguish the target from its neighbors. Shuffled context disrupts this similarity, making the target stand out.

**Implication for vaults:** the "well-organized folder structure" intuition is not free. If two adjacent files use similar vocabulary (e.g., both `voice.md` and `brand.md` discuss tone), they distract each other when both load. Either:
- Consolidate them
- Differentiate the vocabulary
- Load only one at a time (per-folder CLAUDE.md / progressive disclosure)

## Distractor effects

The study tested baseline (needle only), 1 distractor, and 4 distractors:

- **1 distractor reduces performance** below baseline — measurably and consistently.
- **4 distractors compound** the degradation, but not linearly. Each additional distractor doesn't hurt as much as the first.
- **Distractors at positions 2 and 3** (early-but-not-first in the haystack) appear most in hallucinated responses. Possibly because the model attends heavily to early content but the very first item gets special treatment.

**Implication for vaults:** every irrelevant file you load is a distractor. The cost isn't linear in file count — the *first* irrelevant file is the worst. This is why progressive disclosure (folder CLAUDE.md loading on demand) matters more than just "smaller root CLAUDE.md."

## Position effect

The repeated-words experiment found that unique words placed **early** in a long sequence had higher accuracy than ones placed deeper.

**Implication for any markdown file:**
- The first ~10–20% gets the most attention.
- The last ~10–20% gets significant attention.
- The middle gets least attention.

This matches Anthropic's CLAUDE.md guidance to put critical rules at the top.

For vault docs:
- **Lead with the decision**, not the rationale.
- **Lead with the rule**, then the reasoning.
- **Lead with the action**, then the context.
- Use callouts at the top for `> [!important]` summaries.

## Family-level differences

Not all models degrade the same way:

- **Claude family**: graceful degradation, lowest hallucination. When uncertain, more likely to defer or ask. Best fit for high-risk fact retrieval.
- **GPT family**: confident hallucination at length. Generates plausible-sounding but incorrect responses. Needs validation layer in production.
- **Gemini family**: middling on both axes; long context window doesn't translate to long-context quality.
- **Qwen family**: capable at shorter lengths; degrades faster than Claude/GPT at extreme lengths.

The takeaway: long context window ≠ long context capability. Choose models based on observed long-context performance, not advertised window size.

## LongMemEval — focused vs full context

LongMemEval tested conversational QA in two formats:

1. **Focused** — ~300-token prompt with just the relevant prior turn
2. **Full** — ~113k-token full conversation history

Result: **focused dramatically outperformed full** across all models tested. Claude Opus 4 had the largest divergence — meaning even the strongest model loses meaningful capability when forced to find a needle in 113k tokens of history.

**Implication for vaults:** the temptation to "just load the whole conversation history" or "include the full daily note from last week" is wrong. Curate to the relevant 300 tokens. The compaction + just-in-time retrieval pattern Anthropic recommends maps directly onto this finding.

## The attention budget concept

Transformer attention creates **n² pairwise relationships for n tokens** — meaning attention gets thinner per pair as n grows. This is the structural reason for context rot.

> Attention is a finite budget. As n grows, each token's "share" of attention shrinks. Past a certain n, the load-bearing rules in your CLAUDE.md don't get enough attention to influence behavior.

This is also why even models with 200k+ context windows show degradation well before the window is full. The attention budget rots faster than the window fills.

## Implications for vault architecture

| Chroma finding | Vault design rule |
|---|---|
| Length degrades all models | Keep root CLAUDE.md under 200 lines |
| Shuffled > structured | Either consolidate similar files or load them on demand, not together |
| Distractors hurt; first one is worst | Every irrelevant file in context is costly |
| Position matters | Critical rules at the top of every file |
| Focused 300 tokens > full 113k | Use progressive disclosure (per-folder CLAUDE.md, on-demand references) |
| Claude family lowest hallucination | Match model to risk profile |
| Attention is n² | Treat context as a finite budget |

## Dos

- Curate context to the smallest relevant slice.
- Place the most important info **first** in every file (not just CLAUDE.md).
- Use progressive disclosure: per-folder CLAUDE.md, on-demand references.
- Keep root CLAUDE.md lean — it loads on every session.
- Use Claude family when hallucination cost is high.
- Treat the attention budget as finite even when the window isn't full.
- Use just-in-time retrieval over full-corpus dumps.
- When you have similar topical files, either consolidate or load them on demand.
- Compact aggressively at 60–70% context usage.

## Don'ts

- Don't assume "in context = retrievable." It isn't.
- Don't add filler "for completeness" — every irrelevant chunk is a distractor.
- Don't rely on logical structure to save you (it can hurt retrieval).
- Don't bury critical facts deep in long files.
- Don't max out the context window because it's available.
- Don't load the full daily/conversation history when you can curate to the relevant turn.
- Don't confuse window size with capability — always test long-context performance for your task.
- Don't put two similar topical files (e.g., `voice.md` + `brand.md`) in the same load path without differentiation.

## Verbatim quotes

> *"Whether relevant information is present in a model's context is not all that matters; what matters more is how that information is presented."*

> *"Model performance consistently degrades with increasing input length."*

> *"Across all 18 models and needle-haystack configurations, we observe a consistent pattern that models perform better on shuffled haystacks."*

> *"Even a single distractor reduces performance relative to the baseline."*

> Claude models *"consistently exhibit the lowest hallucination rates"*; GPT models *"show the highest rates of hallucination, often generating confident but incorrect responses."*

## Auditable signals

When this skill runs Pass 4 (token estimate) and Pass 9 (anti-pattern sweep) for context-rot signals:

- **File length distribution**: compute median markdown file size; flag files ≫ project median (likely distractor-heavy, split candidate).
- **Critical-info position**: in CLAUDE.md and routing files, detect rules/decisions that appear after line N (where N = ~30% of total lines). Suggest moving up.
- **Lead-in preamble**: detect note tops with backstory/setup before the actual decision. Suggest leading with the decision.
- **Distractor density**: notes with many similar entities/topics in one file — these load as collective distractors when the file is read.
- **Loaded context size**: sum of files that load at session start (root CLAUDE.md + walked-up CLAUDE.md + MEMORY.md if present). Flag if > soft budget (~3k tokens).
- **Similar-topic file pairs**: filename heuristic — `voice.md` + `brand.md` + `tone.md` likely overlap and distract each other when both loaded.
- **Top-of-file callout**: vault rule says every doc should have a `> [!type]` callout for visual structure. Specifically check that critical decisions have one near the top.
- **Daily/conversation file size**: in `Daily/`, flag files growing past ~2k tokens — suggests bloat from copy-pasting conversation history rather than curating.

## Sources

- https://www.trychroma.com/research/context-rot (canonical study)
- https://research.trychroma.com/context-rot (redirects to above)
- https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents (Anthropic's framing of "attention budget")
