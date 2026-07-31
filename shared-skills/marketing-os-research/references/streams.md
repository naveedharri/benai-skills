# Research streams

Four streams, run concurrently, each blind to what the others find. That is deliberate: one search angle does not surface everything, and agents that can see each other's results converge instead of covering.

**Which connectors exist is a question for `Context/config.md` and a live probe, not for this file.** Probe first, state the plan, name the fallbacks.

## The four streams

| Stream | Job | Primary | Fallback ladder |
| --- | --- | --- | --- |
| **Evidence and papers** | Credible studies and citations only, routed by domain | a scholarly or PubMed connector, plus a paper index via Firecrawl | web search restricted to journal, `.edu` and `.gov` domains, then browser automation |
| **Forums and community** | Real language, firsthand results, objections. Anecdotal by definition | an Apify forum scraper | a forum connector, then site-scoped web search plus fetch, then browser automation |
| **Web and vendor** | Vendor docs, industry data, reputable analysis, the landscape | Firecrawl search and scrape | web search plus web fetch, then browser automation for pages that need JavaScript |
| **Creators** | What is being taught, the recurring tactics, the contrarian takes | the YouTube connector plus transcripts | an Apify video scraper, then web search for summaries |

### Domain routing for the evidence stream

| Question is about | Route to |
| --- | --- |
| Medicine or biology | PubMed and PMC, plus preprint servers and trial registries |
| AI or computer science | arXiv |
| Anything else | a general scholarly index |
| Marketing, positioning, content | **Usually nothing.** Downshift and say so |

**Most marketing questions have no scholarly literature and that is not a failure.** Lighten or skip the stream and say you did. Padding it with tangentially related papers produces a report that looks rigorous and is not, which is worse than a thin one honestly labelled.

## The agent prompt

Every stream agent gets the same frame with its own stream slot filled.

```
You are the <STREAM> stream of a research run.

The question: <QUESTION>
Why it is being asked: <PURPOSE>
Who the answer is for: <AUDIENCE, from the segment files>
Explicit directives: <THE ANGLE, THE CLAIMS TO PRESSURE-TEST>

Your job: <STREAM JOB>
Use <PRIMARY CONNECTOR>. If it is unavailable or returns nothing, walk this
ladder and say which rung you ended on: <FALLBACK LADDER>

Return structured markdown:
## Findings
One per block. Each carries exactly one source URL. State what the source
actually says, not what it implies.
## Hard claims to verify
Every number, percentage, date, and causal claim you are passing upward.
## Flags
Anything vendor-sourced, anecdotal, projected, or sponsored, named as such.
## Skipped
What you deliberately did not read, and why. Never truncate silently.

Read within your depth budget: <BUDGET>. Your final text is the return value,
so return the data rather than a message about it.
```

**Pass the angle in as a directive, not as a hint.** "Pressure-test the claim that X" produces a different and better search than "research X".

**Never let an agent conclude.** Agents return findings with sources. Synthesis happens once, afterwards, with all four streams in view.

## Depth

| Depth | Streams | Reading | Fact-check |
| --- | --- | --- | --- |
| **Quick** | two or three, chosen for the question | shallow | one pass over the top claims |
| **Standard** | all four, downshifting where the literature is thin | 19 sources, floor | full, one verifier per claim |
| **Deep** | all four, more agents per stream | wide | adversarial, multiple independent verifiers per claim |

**Standard is the default.** Deep is for a question that will constrain a real decision, and it costs several times as much. **Never drop to Quick because it is cheaper**, only because the question is genuinely narrow, and say which.

Per-stream floors at Standard:

| Stream | Floor | What under-collecting looks like |
| --- | --- | --- |
| **Evidence and papers** | 4 sources, or a stated downshift with its reason | Padding with tangential papers, or skipping silently |
| **Forums and community** | 5 threads read, not 5 search results | Quoting a result snippet as though the thread was read |
| **Web and vendor** | 6 sources, at least 3 read in full text | Six snippets and no full reads |
| **Creators** | 4 creators, transcripts where available | Reading titles and descriptions instead of what was actually said |

**A search result is not a source.** It is a pointer to one. Record which were read in full and which were only seen in a result list, and never let the second group carry a finding.

**Log what the budget cut.** A run that stopped short reads identically to a complete one unless it says so.

## Fact-checking

Collect every hard claim from all four streams, dedupe, then verify. Standard runs one verifier. Deep runs several independently and kills a claim on majority refute.

Verdict vocabulary. **Keep these exact labels** so ledgers stay comparable between runs:

| Verdict | Means |
| --- | --- |
| **VERIFIED** | A primary source states it directly |
| **PARTIAL** | True with a material qualification, and the qualification is stated |
| **PROJECTION** | A forecast or model output, not an observation |
| **VENDOR-CLAIM** | Sourced to a party that benefits from it being true |
| **ANECDOTAL** | One person's firsthand account. Real, and not evidence of a general pattern |
| **FALSE** | Contradicted by a primary source |
| **UNVERIFIED** | No verification ran. Used when the capability was unavailable, never as a soft pass |

Every verdict carries a primary source and a one-line caveat.

**Prompt verifiers to refute, not to confirm.** "Try to refute this claim, and default to refuted if uncertain" catches things "check this claim" does not. Plausible-but-wrong is the failure mode that survives a friendly check.

**Never fact-check an anecdote as a fact.** It is sentiment, it stays labelled, and it is frequently the most useful material in the run because it carries the customer's own words.

**Surface corrections in the ledger.** A claim that came in wrong and got caught is evidence the process worked. Quietly fixing it in the synthesis throws away the most trust-building thing in the file.

## Synthesis

One pass, all streams in view, into the research file shape in `references/os-contract.md`.

| Rule | Why |
| --- | --- |
| Tag each point with how many source types corroborate it | One source alone lies, and a reader needs to see the count to weigh it |
| Keep fact and opinion in separate sections | A reader skims, and a mixed section gets read as all fact |
| Reflect the stated angle honestly | Support it where the evidence does, push back where it does not. A run that only confirms its premise found nothing |
| Preserve the counter-case | The strongest argument against the answer, stated at full strength |
| Quote customer language verbatim, with a source each | Paraphrased customer language is invented customer language |
| State the evidence base and its limits up front | Every finding inherits those limits, and a reader who does not know them will over-read every one |

## Degradation

Never hard-fail. Every stream that cannot run becomes a named line in the research file's not-available section, with the connector named and the fallback that was used instead.

**The one thing that must never degrade silently is the ledger.** If fact-checking could not run, every hard claim is marked UNVERIFIED and the file says so at the top. A report with an honest unverified ledger is usable. A report whose ledger implies verification that never happened will be quoted as settled, and the error propagates into every piece of content written from it.
