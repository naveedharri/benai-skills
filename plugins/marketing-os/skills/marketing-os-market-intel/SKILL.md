---
name: marketing-os-market-intel
description: "Run a market intelligence brief against the Marketing OS, score every find, and turn the ones that clear the bar into scored ideas in the backlog. The watchlist, competitor roster, lookback window and connectors all come from the OS, and what counts as a signal comes from the positioning file, so the brief reports the translation gap rather than generic AI news. Fans out one agent per stream in a single batch across official sources, practitioners, the competitor roster, search demand and the wider web, with an effort floor and distinct sources so a run cannot conclude from one search. Reads existing daily scan files and pulls live only for the window they miss. Writes a dated standing brief to Intelligence/market/, seeds scored ideas, logs, and always closes by rendering the brief with instant-ui into Analytics/dashboard/runs/. Run from the Marketing OS root. Use when the user says 'run market intel', 'what shipped this week', 'scan the market', or runs /marketing-os-market-intel."
disable-model-invocation: true
argument-hint: "[optional focus, e.g. 'agents', 'a competitor name', or a lookback like 'last 7 days']"
---

# Marketing OS Market Intel

Scan the world, judge what you find against what this business actually needs, and leave the backlog better than you found it.

**This skill carries no watchlist and no ICP.** The original shipped its own Twitter watchlist, its own ICP file, its own offer summary and its own copy of the design language, four things that all exist once in the OS and went stale in the skill folder. Every one of them is read live here.

**The difference between this and a news feed is judgement.** A scan that returns twenty interesting links has done nothing. This one scores every find against the same framework the OS uses to score ideas, and seeds only what clears the bar. Intelligence that produces no action is not intelligence.

Run from the OS root. **Stay inside that root.** **Start from zero on identity:** every handle, account, competitor and threshold comes from the OS.

## The boundary, and why it matters

The OS may already run a daily market scan routine. That routine owns one file and this skill must never write it.

| File | Owner |
| --- | --- |
| `Intelligence/market/YYYY-MM-DD.md` | the daily scan routine. **Never write this** |
| `Intelligence/market/YYYY-MM-DD-<slug>.md` | **this skill.** The on-demand standing brief on one question |
| `Channels/{primary}/ideas/<slug>.md` | both, and both check for duplicates first |

Two things writing one dated file is how an OS starts contradicting itself. Check `Intelligence/CLAUDE.md` for the routing table before writing anything, because that table is the contract and it names which rows are on demand.

**Read the daily files rather than re-pulling what they cover.** If `Intelligence/market/` already holds today's scan, read it, say you did, and pull live only for what it does not cover or does not go deep enough on. Then say exactly which part of the window you pulled yourself. A skill that silently re-pulls burns the connector budget and produces a second version of the same day.

**Run completely on your own.** No routine has to have run first. If `Intelligence/market/` is empty, do the whole pull yourself and say so.

## First, check what you have

| State | Do |
| --- | --- |
| No `Context/config.md` | Not a Marketing OS. Point at `marketing-os-setup` and stop |
| No `Context/brand/positioning.md` | Run, but say the signal test is missing. Without it this degrades to generic news and you must say so |
| `Intelligence/market/` empty | Normal on a young OS. Do the full pull and say it is the first brief |
| No scan connectors available | Say which are missing, run on web search alone, and label the brief degraded |

## Step 1: read what makes a signal

**Never open with a pull.** Read these first, because they decide what is worth collecting.

| Path | Gives you |
| --- | --- |
| `Context/config.md` | The account watchlist, the competitor keys, the lookback window, which connectors exist, the primary channel |
| `Context/brand/positioning.md` | **The signal test.** The category, the enemy, and the strategic edge. If positioning names a translation gap between one audience and another, the highest-value find is something the first audience has absorbed and the second has not seen |
| `Intelligence/competitors/_roster.md` | Who is tracked and why, plus the correction log |
| `Analytics/what-works.md` | What has measured well here. A finding may license a specific kind of find, for example being early on a newly launched surface |
| `Intelligence/research/frameworks/idea-scoring.md` | The scoring framework every find gets judged against in Step 6 |
| `Intelligence/market/` recent files | What is already known, and the noise list so you do not resurface it |
| `Channels/{primary}/ideas/` and `published/` | What already exists, for deduplication |

**The noise list is the most underused thing in the folder.** A dated scan that recorded what was loud but irrelevant is telling you what to skip today. Read it.

## Step 2: pick the depth

Ask for it once, then state which streams you will run given what is connected. **Read `references/collection.md` before you plan.** It carries the connectors, the tool costs, the fallback chains and the per-stream floors, and a plan made without it will under-collect.

| Depth | Agents | Distinct sources, floor | Use for |
| --- | --- | --- | --- |
| **Quick** | 3 | 12 | A single narrow question, or a same-day top-up on a scan that already ran |
| **Standard**, the default | 5, one per stream | 25 | Any normal run |
| **Deep** | 8 or more, several per stream | 45 | A launch week, a positioning decision, or a question that will constrain a quarter |

If the operator does not name a depth, **run Standard.** Never silently drop to Quick because it is cheaper.

## Step 3: fan out. This is not optional

**Launch one agent per stream, all in a single batch, before you read any result.** Do not run one stream, look at what came back, and then decide about the next. Sequential collection is the failure this step exists to prevent: it produces a brief built on whatever the first search happened to return.

| Agent | Stream | Job | Floor |
| --- | --- | --- | --- |
| 1 | **Official sources** | What actually shipped in the window. Changelogs, release notes, launch posts. A capability launch is the strongest content trigger available | every vendor source named in config, and the primary vendor's changelog read in full |
| 2 | **Practitioners** | Techniques in real use, and complaints that reveal an unmet need. Ignore engagement farming and pure speculation | the whole watchlist in config, batched. Not a sample of it |
| 3 | **The roster** | What every tracked competitor published in the window. Topic and framing only | every competitor in `_roster.md`, not the first few |
| 4 | **Search demand** | Volume and contest level for each candidate topic, where a connector exposes it | one lookup per candidate that reaches scoring |
| 5 | **The wider web** | Only what the other four cannot reach, and the deep read on anything they surfaced thin | at least one full-text read per candidate, not a snippet |

Each agent gets the question, the window, the signal test from positioning, and the noise list. Each returns findings with one source URL each, the hard claims it is passing up, and **what it deliberately skipped**. Each agent's final text is its return value, so it returns data rather than a message about returning data.

**Agents have the connectors too.** Delegate the connector calls rather than making them all yourself. That is the point of fanning out: many connectors hit at once instead of one at a time.

At Deep, split the heavy streams rather than adding shallow ones: two or three practitioner agents over different slices of the watchlist, a second roster agent, and a dedicated agent per candidate for the full-text read.

**Then synthesize once, with every stream in view.** Never write a section of the brief while agents are still returning.

## Step 4: the effort floor

A run that does one search and writes a confident brief has failed, however well written the brief is. These are floors, not targets.

| Floor | Standard depth |
| --- | --- |
| Agents launched in the first batch | 5, or one per available stream if fewer are connected |
| Distinct sources actually read | 25 |
| Full-text reads, not snippets or search summaries | 5 |
| Competitors checked | all of them |
| Watchlist accounts covered | all of them, batched |
| Candidates carried into scoring | every one that clears the signal test, with its evidence written out |

**If a floor cannot be met, say which one and why**, in the brief and in your response. "Apify is unauthenticated so the practitioner stream was web search only, covering 6 of 40 watchlist accounts" is an honest run. Quietly reading four pages and writing a brief that reads like forty is not.

**Never present a snippet as a read.** A search result summary is a pointer to a source, not the source. The `## Not available` section exists so a thin run can be labelled thin rather than dressed up.

**Judge nothing on competitor activity alone.** The scoring framework treats a competitor covering something as the weakest form of evidence. A competitor shipping a video is a fact to record, not a reason to make one.

**Ceilings come after floors.** `references/collection.md` carries the per-connector costs and the pull cap. Meet the floors first, then respect the cap. On breach, write what was covered, name what was skipped, and stop. Never truncate silently: an unstated cap reads as full coverage.

## Step 5: write the brief

`Intelligence/market/YYYY-MM-DD-<slug>.md`. Shape in `references/os-contract.md`.

Structure it around the signal test rather than around the sources:

| Section | Holds |
| --- | --- |
| `## What shipped` | With links and dates. Facts only |
| `## What practitioners are doing` | The technique, and who is doing it |
| `## The translation gap` | **The section that earns the brief.** Specifically what one audience now understands that ours has not seen. Named, not gestured at |
| `## What the roster published` | Topic and framing. No quality judgements |
| `## Noise` | What was loud and not relevant, so the next run does not resurface it |
| `## Not available` | Every stream that failed, with the connector named |

**Dated files are never rewritten.** Today's brief is what was known today, right or wrong. A correction is a new dated entry, never an edit.

## Step 6: score, then seed

This is the step that separates this skill from a feed.

Score every candidate against `Intelligence/research/frameworks/idea-scoring.md`, using that file's own questions and its own scale. Do not invent a scoring scheme, and do not carry one in this file, because the framework lives in the OS and can change without touching this skill.

Then seed only what clears the bar, into `Channels/{primary}/ideas/<slug>.md` from that channel's template, with:

- `source:` naming this brief and its date
- the score the framework produced, in the frontmatter field the template uses
- the evidence behind the score, written out, so a later reader can check it rather than trust it

**Check for duplicates before writing.** Against `ideas/` and against `published/`. A reseeded idea is worse than a missed one because it makes the backlog untrustworthy.

**Seed nothing rather than seed noise.** Most runs should produce zero or one idea. A run that seeds five has almost certainly lowered the bar. If nothing clears, write one line in the brief saying so, and that is a complete and successful run.

## Step 7: log

**Log.** `Intelligence/logs/YYYY-MM-DD.md`, naming the brief file, every idea seeded or the fact that none were, and every stream that failed. This is a hybrid: it changes what the OS knows and it also produces a report, so it logs the knowledge change only.

## Step 8: render the one-pager. Always

**Every run closes by rendering an HTML page. Not "if asked", not "if the operator wants one".**

This is the plugin's convention and it is the reason `instant-ui` sits in this plugin at all. The markdown brief is the machine artifact: the next skill in the chain reads it, the routines read it, and it stays markdown because markdown is what the OS stores. **A human should never have to read it.** What a human reads is the page.

Invoke the **`instant-ui`** skill with the brief content and this output path:

```
Analytics/dashboard/runs/YYYY-MM-DD-market-intel-<slug>.html
```

That is the same folder every routine writes its run report into, so the whole OS's activity is readable in one place. Create the folder if it does not exist.

The page carries, in this order:

| Block | Holds |
| --- | --- |
| The run header | The window covered, the depth, the number of agents, the number of distinct sources, and the date |
| What shipped | The facts, each linked |
| The translation gap | Labelled as the reading rather than the fact |
| Candidates | Each with its score, or marked unscored with the reason |
| What was not available | Every failed stream with the connector named. **Render this even when it is empty**, saying so |
| Where it was written | The brief path and the log path |

**Never build the page yourself and never hardcode a colour.** instant-ui owns the design language and its tokens trace to `Context/brand/brand-kit.md`. Tell it the run is unattended when it is, so it renders gaps rather than stopping to ask.

**Record the page path in the brief**, so the artifact and its render point at each other.

**The run is not complete until the page exists.** If `instant-ui` is unavailable, say so plainly, note it in the log line, and **never hand-roll a page.** A hand-rolled page drifts from the design language within one run, which is the whole reason the render is delegated.

## Write plainly. This is a brief, not a post

**The brief and the rendered page report. They do not sell.** Hook writing is the job of the copy skills, and importing it here makes intelligence read like content, which is how a thin finding gets mistaken for a strong one.

| Never | Instead |
| --- | --- |
| A headline that withholds, like "the real story is not X, it is Y" | State the finding: "practitioners are using the new effort control to cut token spend" |
| A title built on a reversal or a twist | A descriptive title: what it is, and the date |
| "The signal is", "here is what nobody is saying", "the shift nobody noticed" | Say what was observed and by whom |
| Escalating triplets and rhetorical questions | One sentence, declarative |
| Confidence the evidence does not carry | The verdict and the source count, stated |

**The title of the brief is descriptive.** The topic and the window. Not an argument, not a hook.

**A finding is worth what its evidence is worth, and the writing must not add to that.** If two sources support something, say two sources support it. Punchy framing over thin evidence is the single easiest way for this skill to mislead the person who trusts it most.

Where the brief legitimately does have an argument, put it under `## The translation gap` and label it as the reading rather than the fact.

## Rules

**A gap is not a zero.** A failed pull is written as not available with the connector named. Never substitute an estimate, never carry a number forward, never interpolate.

**Every number carries the date it was pulled and the source it came from.** A competitor's subscriber count moves daily. Pull it or omit it, never quote it from an old file as though it were current.

**Never invent a competitor metric.** If the connector did not return it, the brief says so.

**Our numbers are not intelligence.** A competitor's view count belongs here. Ours belongs in `Analytics/`. Never write our own performance into `Intelligence/`, and if a find is about our own results, say where it belongs instead.

**Cap the lookback at what config says.** Older than the window is not news, it is research, and it routes to `marketing-os-research` instead.

**Never use em dashes.**

## If something you expect is missing

| Missing | Do |
| --- | --- |
| `Context/config.md`, or a key in it | Make the safe assumption, name it in the brief, continue. Never stop for a missing threshold |
| `Context/brand/positioning.md` | Continue, and say the translation gap section is unreliable without it |
| `Intelligence/competitors/_roster.md` | Skip the roster stream, say so, and do not invent a competitor set |
| `Intelligence/research/frameworks/idea-scoring.md` | **Do not seed.** Write the candidates into the brief as unscored and say the framework is missing. Seeding unscored ideas is what the framework exists to prevent |
| The channel idea template | Seed from the frontmatter shape in `references/os-contract.md` and say the template was missing |
| A connector | Write not available, name it, continue. A degraded scan clearly labelled is useful. A degraded scan presented as complete is not |

Create only the files this skill owns: the brief, the idea seeds, the log.

## Self-improvement

This skill is never finished. Improve it as you use it.

- When the user corrects a collection step, a fallback order or a budget, update `references/collection.md` so the correction sticks.
- When a correction is a hard rule ("always X", "never Y"), add it to the rules above.
- **When the watchlist or the roster is wrong, fix it in the OS**, in `Context/config.md` or `Intelligence/competitors/_roster.md`. A watchlist edit landing in this skill folder is exactly the duplication this skill removed.
- When a find turns out to have been noise, make sure it reached the `## Noise` section of the brief. That section is the skill's memory.
- Keep the skill small: when you add something, run the deletion test and cut anything that no longer changes behaviour.

## Files

| File | Contains |
| --- | --- |
| `references/os-contract.md` | Every OS path read and written, the brief and idea-seed shapes, the boundary against the daily routine, the log line format |
| `references/collection.md` | The connectors, their tools and costs, the fallback chains, the quota budget, and what each stream is actually looking for |
