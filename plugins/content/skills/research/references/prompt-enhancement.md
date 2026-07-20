# Prompt Enhancement

How to decide whether a research prompt needs enhancement, which questions to ask, and how to build the enhanced prompt. The orchestration script applies this logic automatically; this file is the reference for reviewing or overriding it.

## When to enhance

Enhance when the prompt is:
- Too brief: under 15 words.
- Generic: starts with "what is", "how to", or names a topic with no scope.

Skip enhancement when the prompt is detailed and specific (scope, timeframe, or focus already stated). The user can force-skip with `--no-enhance`.

## Question templates

Ask 2-3 questions. Detect research type from keywords, then use the matching set. Offer numbered options plus a free-text option each time.

### General research
- Scope / timeframe: Latest (2024-2025), Historical, Specific period?
- Depth level: Executive summary, Technical, Implementation guide, Comparative?
- Focus areas: Performance, Cost, Ease of use, Security, Multiple?

### Technical research
- Technology scope: Open-source only, Enterprise, Language-specific?
- Key metrics: Speed, Accuracy, Scalability, Resources?
- Use cases: Production, Research, Education, Exploration?

## Build the enhanced prompt

Append the user's answers to the original prompt as structured research parameters:

```
Original: "Most effective opensource RAG solutions with highest benchmark performance"

Enhanced: "Most effective opensource RAG solutions with highest benchmark performance

Research parameters:
- Latest developments (2024-2025)
- Technical deep dive
- Performance/Benchmarks"
```

Parameters to capture: original query with context, scope/timeframe, depth level, specific focus areas.

## Worked examples

### Brief prompt, enhancement fires
User: "Research the most effective opensource RAG solutions"
1. Detect brief (12 words) + technical keywords ("opensource", "RAG").
2. Ask the technical set. User answers: open-source only; speed and accuracy; production.
3. Enhance, save, execute.
4. Return comparative report with benchmarks and source URLs.

### Detailed prompt, enhancement skipped
User: "Analyze the impact of large language models on software developer productivity in 2024-2025, focusing on code generation tools, pair programming, and productivity metrics."
1. Detect detailed (24 words) with explicit scope/focus.
2. Skip questions.
3. Save, execute immediately.
4. Return focused analysis.

## Tips for a better prompt
- Specific prompts yield better results even without enhancement.
- State timeframe and domain explicitly.
- Indicate the wanted output shape (comparison table, timeline).
- Reuse a saved prompt file as the starting point for follow-up research.
