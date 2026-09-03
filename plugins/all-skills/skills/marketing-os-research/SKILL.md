---
name: marketing-os-research
description: "Answer an open question the Marketing OS already wrote down, then promote it to a finding. Takes its queue from the OS itself: files with status open-question in Intelligence/research/, open questions and untested beliefs in Analytics/what-works.md, and ideas with no established pain. Fans out one agent per stream in a single batch across papers, forums, the web and creators, with an effort floor, distinct sources and full-text reads, fact-checks every hard claim with a verifier prompted to refute rather than confirm, then writes Intelligence/research/topic-slug.md and updates the question file in place with a dated status change. Routes findings about our own performance to Analytics, and graduates recurring customer language to the segment files. Always closes by rendering the report. Use when the user says 'research this', 'deep dive on', or runs /marketing-os-research.\\\"\ndisable-model-invocation: true\nargument-hint: \\\"[a topic, or an open-question file to close, or nothing to be shown the queue]"
---

# Marketing OS Research

Research one question properly, then put the answer where the rest of the OS will read it.

**The queue is already written.** A well-kept OS records what it does not know: files marked as open questions, beliefs flagged as untested, ideas with no established pain, findings that name the exact measurement that would settle them. That backlog is this skill's input, and working it is more valuable than researching whatever comes to mind, because somebody already decided those questions mattered and wrote down what would answer them.

**The output is not a report.** It is a file the writers, the strategy and the next research run all read. The rendered page is a convenience for a human. The markdown is the artifact.

Run from the OS root. **Stay inside that root.** **Start from zero on identity:** who this is for and what they believe comes from the OS or from the user, never from your context.

## First, check what you have

| State | Do |
| --- | --- |
| No `Context/config.md` | Not a Marketing OS. Point at `marketing-os-setup` and stop |
| A topic was named | Run on it. Still check the queue for an existing question it answers, because closing one is worth more than opening another |
| No topic named | **Show the queue.** Present the open questions with what each would settle, and let the operator pick |
| The queue is empty | Say so. It is a real and good state. Ask for a topic |

## Step 1: build the queue

Read these and assemble one list. This is the step that makes the skill OS-native, and skipping it turns it back into a generic research tool.

| Source | What qualifies |
| --- | --- |
| `Intelligence/research/*.md` with `status: open-question` | A question the OS wrote down deliberately, often with the blocker named. **Highest priority**, because the file usually already states what would answer it |
| `Analytics/what-works.md`, its open questions | Claims with some evidence that do not yet support a rule. Each names the specific measurement that would settle it |
| `Analytics/what-works.md`, its untested table | Beliefs carried from conviction with no evidence at all, each with the measurement it needs |
| `Channels/{primary}/ideas/*.md` with `pain: not yet established` | An idea nobody has grounded yet |
| `Intelligence/market/` briefs, their translation-gap sections | Something one audience understands and ours does not, which is a research question shaped like a content opportunity |
| `Intelligence/decisions/` | **Read for exclusions.** A question a decision already settled is not open, and re-answering it wastes the run |

Present the queue with, for each item: the question, where it lives, what the file says would answer it, and whether this skill can actually answer it. Say plainly which ones external research cannot settle, because some need an internal measurement instead and no amount of reading will produce it.

**A question whose blocker is a missing connector or an unpulled metric is not a research question.** Name it, say what would unblock it, and do not pretend a literature review substitutes for the measurement.

## Step 2: targeted intake

Two things, before any research runs.

**A. Scope it.** Ask conversationally, one thing at a time, and pull half the answers from the OS rather than from the operator.

| Ask | Read instead, where you can |
| --- | --- |
| The question, and what they already believe or suspect | The question file usually states the belief already. Read it back and ask only what it leaves open |
| The purpose: to write something, to decide something, to brief the team | If it came from an idea file or a what-works entry, the purpose is written there |
| The angle to pressure-test, or claims they are suspicious of | `Context/brand/positioning.md` names the strategic position, which is usually the thing worth stress-testing |
| Who the answer is for | `Context/icp/*.md`. Do not ask which audience, read the segment files and confirm |
| Depth: quick, standard, or deep | Ask. It is the one thing the OS cannot tell you |

**Reflect the angle honestly.** Support it where the evidence does and push back where it does not. A research run that only confirms the position it started from has produced nothing.

**B. Probe the connectors.** Read `Context/config.md` for what exists, then verify. Say which streams you can run, offer to connect the high-value missing ones, and name the fallback each stream will use. Never hard-fail for a missing connector: degrade and label it. Detail in `references/streams.md`.

## Step 3: fan out. This is not optional

**Launch every stream agent in one batch, before you read any result.** Do not run a stream, look at what came back, and then decide about the next. Sequential collection produces a file built on whatever the first search happened to return, and it is the failure this step exists to prevent.

**Read `references/streams.md` before you launch.** It carries the parameterized agent prompts, the connector ladders, the domain routing and the per-stream floors. Launching without it produces four vague agents instead of four specific ones.

| Agent | Stream | Job | Floor at Standard |
| --- | --- | --- | --- |
| 1 | **Evidence and papers** | Credible studies and citations only, routed by domain | 4 sources, or an explicit downshift with the reason |
| 2 | **Forums and community** | Real language, firsthand results, objections. Anecdotal by definition and stays labelled | 5 threads read, not 5 search results |
| 3 | **Web and vendor** | Docs, industry data, reputable analysis, the landscape | 6 sources, at least 3 read full text |
| 4 | **Creators** | What is being taught, the recurring tactics, the contrarian takes | 4 creators, transcripts where available |

Each agent gets the question, the purpose, the audience and the angle as explicit directives. Each returns findings with one source URL each, the hard claims it is passing up, and **what it deliberately skipped.** Each agent's final text is its return value, so it returns data rather than a message about returning data.

**Agents have the connectors too.** Delegate the connector and fetch calls rather than making them all yourself. Many sources at once is the whole point of fanning out.

At Deep, split the heavy streams rather than adding shallow ones: two or three agents across different slices of one stream, plus a dedicated agent per contested claim.

| Depth | Agents in the first batch | Distinct sources, floor | Verifiers per hard claim |
| --- | --- | --- | --- |
| **Quick** | 2 or 3, chosen for the question | 8 | 1 over the top claims only |
| **Standard**, the default | 4, one per stream | 19 | 1 |
| **Deep** | 8 or more | 40 | 3, killed on majority refute |

If the operator does not name a depth, **run Standard.** Never silently drop to Quick because it is cheaper.

**Then synthesize once, with every stream in view.** Never write a section of the file while agents are still returning.

**Auto-downshift rather than padding.** Many marketing questions have almost no scholarly literature. Lighten or skip that stream and say so. Faking depth is worse than admitting a thin evidence base, because a reader cannot tell the difference and will act on it either way. A downshift is a stated decision with a reason, not a quietly smaller number.

## Step 3b: the effort floor

A run that does one search and writes a confident answer has failed, however well written the file is. These are floors, not targets.

| Floor | Standard depth |
| --- | --- |
| Agents launched in the first batch | 4, or one per available stream if fewer are connected |
| Distinct sources actually read | 19 |
| Full-text reads, not snippets or search summaries | 6 |
| Independent source types corroborating each finding | stated per finding, and 1 is written as 1 |
| Hard claims passed through verification | all of them |

**Never present a snippet as a read.** A search result summary is a pointer to a source, not the source. Say which sources were read in full and which were only seen in a result list.

**If a floor cannot be met, say which one and why**, in the file's evidence-base section and in your response. A thin run honestly labelled is usable. A thin run written like a thorough one gets quoted as settled and the error travels into everything written from it.

## Step 4: fact-check

Collect every hard claim, dedupe, and verify. Standard depth is one pass. Deep depth is multiple independent verifiers per claim, killed on majority refute.

Each claim gets a verdict, a primary source, and a one-line caveat. Keep the verdict vocabulary from `references/streams.md` rather than inventing one, so ledgers stay comparable across runs.

**Never fact-check a firsthand anecdote as though it were a fact.** It is sentiment. It stays labelled as sentiment and it is often the most useful thing in the run.

**A caught correction is a feature.** Surface it in the ledger rather than quietly fixing the synthesis. The ledger is what makes the file trustworthy later.

## Step 5: write it into the OS

Four writes. Shapes in `references/os-contract.md`.

1. **The research file.** `Intelligence/research/<topic-slug>.md`. TL;DR, the answer, the evidence with verdicts, the counter-case, voice-of-market language, the claims ledger, and grouped sources. This is the artifact.

2. **Close the question, in place.** If the run answered a file carrying `status: open-question`, update that file: change the status, date the change, state the answer in one line, and link the research file. **Do not delete the question or rewrite its history.** The record of what was once unknown is worth keeping.

3. **Route what does not belong here.** Some findings have a different home and writing them here would be wrong:

   | Finding | Where it goes |
   | --- | --- |
   | About our own performance | `Analytics/what-works.md`. Intelligence is the world, analytics is us |
   | A pain that recurs, with verbatim quotes and sources | the segment file in `Context/icp/`, where pain points live |
   | Verbatim customer language | `Intelligence/research/voice-of-customer.md`, quoted with a source each |
   | A constraint the business should adopt | Nothing. Say it needs a decision record, which a human writes |

   **Only write the ones this skill owns.** For the rest, name the file and the change in your response and leave it alone. A finding about our own numbers written into `Intelligence/` is the single most common way these two folders get confused, and once confused neither is navigable.

4. **Log.** `Intelligence/logs/YYYY-MM-DD.md`, naming the research file, any question file promoted, and anything routed elsewhere. This is a hybrid, so it logs the knowledge change only.

**Never ask permission to save.** Write and report.

## Step 6: render the one-pager. Always

**Every run closes by rendering an HTML page. Not "if asked".**

This is the plugin's convention and it is the reason `instant-ui` sits in this plugin at all. The research file is the machine artifact: a content skill reads it to draft the piece, the next research run reads it, and it stays markdown because markdown is what the OS stores. **A human should never have to read it.** What a human reads is the page.

Invoke the **`instant-ui`** skill with the file's content and this output path:

```
Analytics/dashboard/runs/YYYY-MM-DD-research-<topic-slug>.html
```

That is the same folder every routine writes its run report into. Create the folder if it does not exist.

The page carries, in this order:

| Block | Holds |
| --- | --- |
| The run header | The question, the depth, the agents launched, the distinct sources read, the full-text reads, the date |
| The answer | First, in a few lines |
| The evidence base and its limits | Before the findings, because every finding inherits them |
| Findings | Each with its verdict, its corroboration count, and its confidence |
| The counter-case | At full strength, not softened |
| The claims ledger | Every hard claim, its verdict, its source, its caveat. Corrections that were caught stay visible |
| What this does not settle | And the measurement that would |
| What was not available | Every failed stream with the connector named. **Render this even when it is empty**, saying so |
| Where it was written | The research file path, any question file promoted, and the log path |

**Never build the page yourself and never hardcode a colour.** instant-ui owns the design language and its tokens trace to `Context/brand/brand-kit.md`. Tell it the run is unattended when it is.

**Record the page path in the research file.**

**The run is not complete until the page exists.** If `instant-ui` is unavailable, say so plainly, note it in the log line, and **never hand-roll a page.**

**Deploying publishes it, so confirm first.** Show the rendered report and the claims ledger and get an explicit go-ahead. Before asking, name anything on the page that would be sensitive published: an uncleared customer quote, a named individual, an unannounced position, a competitor assessment. If the page holds any of those, say so first, not after.

Then say the one line that matters: this file feeds straight into a content skill to draft the piece.

## Write plainly. This is a research file, not a post

**The file and the rendered page report. They do not sell.** Hook writing belongs to the copy skills, and importing it here makes a thin evidence base read like a strong one.

| Never | Instead |
| --- | --- |
| A headline that withholds, like "the real answer is not X, it is Y" | State the answer in the first line |
| A title built on a reversal or a twist | A descriptive title: the question, and the date |
| "The evidence is clear", "what nobody is saying", "the shift nobody noticed" | The verdict, the source count, and the confidence |
| Escalating triplets and rhetorical questions | One sentence, declarative |
| Confidence the evidence does not carry | Say how many independent source types corroborate it |

**Every finding states its confidence and the confound it did not eliminate.** That is what makes the file usable a year later, and it is the first thing hook writing destroys.

**One source is written as one source.** Not "research suggests", not "it is widely understood". If a claim rests on a single vendor blog post, the file says so on the line where the claim appears.

## Rules

**Every claim carries a source.** A finding without one is an opinion and goes in the counter-case section labelled as such, or it does not go in.

**Triangulate, and show the count.** Say how many independent source types corroborate each point. One source alone lies, and a reader who cannot see the count cannot weigh it.

**Fact and opinion stay visibly separate.** Verified evidence in one section, the counter-case in another, sentiment labelled as sentiment.

**Label vendor, anecdotal and projected claims** every time they appear, not once at the top.

**Quote rather than paraphrase.** Every customer quote carries who said it, which file it came from, and when. Where a source is itself a compression of something else, say so.

**Cap depth for cost, and log what was skipped.** A run that quietly stopped short reads exactly like a complete one.

**Never use em dashes.**

## If something you expect is missing

| Missing | Do |
| --- | --- |
| `Context/config.md`, or a key in it | Make the safe assumption, name it, continue |
| `Analytics/what-works.md` | Build the queue from what exists and say that source was unavailable |
| `Intelligence/research/` is empty | Normal on a young OS. Say the queue is empty and ask for a topic |
| A connector | Name it, use the fallback ladder, label the stream degraded |
| The fact-checking capability | Say so plainly and mark every hard claim unverified. **Never present an unverified number as verified.** A run with an honest unverified ledger is usable, one with a fabricated ledger is poison |
| A question file you were asked to close | Say it does not exist, and do not create it. Write the research file and name the mismatch |

Create only the files this skill owns: the research file, the status promotion on a question it answered, the voice-of-customer quotes, the log.

## Self-improvement

This skill is never finished. Improve it as you use it.

- When the user corrects a stream, a fallback or a verdict vocabulary, update `references/streams.md` so the correction sticks.
- When a correction is a hard rule ("always X", "never Y"), add it to the rules above.
- **When a research file turns out to have been good, it is already in the OS.** Never start a local examples folder here. That is how the duplication these skills removed comes back.
- When the queue turns up a class of question this skill cannot answer, record that in `references/os-contract.md` so the next run does not attempt it.
- Keep the skill small: when you add something, run the deletion test and cut anything that no longer changes behaviour.

## Files

| File | Contains |
| --- | --- |
| `references/os-contract.md` | Every OS path read and written, the research file shape, how a question gets promoted, the routing table for findings that belong elsewhere, the log line format |
| `references/streams.md` | The four research streams with their connector ladders and domain routing, the parameterized agent prompts, the verdict vocabulary, and the depth budgets |
