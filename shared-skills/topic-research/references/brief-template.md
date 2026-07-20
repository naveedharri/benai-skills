# Markdown brief skeleton

This is the Phase 3 output and the **handoff artifact**. Save as `<topic-slug>-brief.md`. It is deliberately agent-readable so a downstream content-writer skill can consume it directly: clear headings, tables for structured data, every claim carrying its verdict and source. Keep fact and opinion visibly separate. Fill from the research streams + fact-check ledger; drop sections that don't apply (e.g. "Tool landscape" only when the topic is a market/category).

```markdown
---
type: research-brief
topic: {{topic}}
purpose: {{purpose}}
audience: {{audience}}
directives: {{angle/biases/skepticism the user asked to reflect}}
depth: {{quick|standard|deep}}
date: {{today}}
claims_checked: {{n}}
corrections: {{n}}
sources: {{n}}
---

# {{Topic}}: research brief

## TL;DR (the brief in one breath)
2-4 sentences. The bottom line a writer needs. State the honest tension if there is one.

## Headline stats (verified)
- **{{stat}}**: one line of context. [Source](url) · verdict
- (3-5 of the strongest verified numbers)

## The evidence (verified)
For each finding: the claim, the number, why it matters, and its verdict + source.
- **{{finding}}**: detail. `VERIFIED`, [Source, Year](url). Caveat: ...

## What the evidence says / playbook
The actionable synthesis. Tag each point with corroboration.
- **{{point}}**: detail. _Corroborated by: papers · creators · forums_

## The counter-narrative (skepticism / opposing view)
The honest pushback, with real quotes. This keeps the piece credible and is often the strongest angle.
- "{{real quote}}", [source](url)

## Tool / landscape  (only if the topic is a market or category)
| Name | What it does | Coverage | Price signal | Differentiator (vendor claim) |
|---|---|---|---|---|

## Voice of the market  (for the writer)
- **Questions people ask:** ...
- **Language they use:** short list of real recurring phrases.

## Claims-verified ledger
| Claim | Verdict | Confirmed / corrected figure | Caveat | Source |
|---|---|---|---|---|
| {{claim}} | VERIFIED / PARTIAL / PROJECTION / VENDOR-CLAIM / ANECDOTAL / CORRECTED | {{figure}} | {{caveat}} | [url](url) |

## Sources
**Papers & evidence:** ...
**Creators / forums / vendors:** ...

## Notes for the writer
- What to lead with, what to avoid overclaiming, which stats are safe vs need caveats.
- The user's directive was: {{...}}. Here is how the evidence bears on it.
```

## Why this structure
- The **ledger + inline verdicts** let a downstream skill trust or caveat each number without re-checking.
- **Fact vs opinion** are separate sections, so a writer never launders a vendor claim or anecdote as fact.
- **Voice of the market** and **Notes for the writer** exist specifically to make "research → write" seamless: the content-writer skill reads these to match audience language and pick the angle.
