---
name: marketing-os-market-intel
description: "Run an on-demand market intelligence brief against the Marketing OS, score every find, and turn the ones that clear the bar into scored ideas in the backlog. The watchlist, the competitor roster, the lookback window and the connectors all come from the OS rather than from a bundled list, and what counts as a signal comes from the positioning file, so the brief reports the translation gap rather than generic AI news. Reads the daily scan files that already exist and pulls live only for the window they do not cover. Writes a dated standing brief to Intelligence/market/, seeds scored ideas into the backlog, and logs. Calls instant-ui to render the report rather than carrying its own copy of the design language. Run from the Marketing OS root. Use when the user says 'run market intel', 'what shipped this week', 'market intelligence report', 'scan the market', 'what are competitors doing', 'trend scout', or runs /marketing-os-market-intel."
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
| `Intelligence/research/frameworks/idea-scoring.md` | The scoring framework every find gets judged against in Step 4 |
| `Intelligence/market/` recent files | What is already known, and the noise list so you do not resurface it |
| `Channels/{primary}/ideas/` and `published/` | What already exists, for deduplication |

**The noise list is the most underused thing in the folder.** A dated scan that recorded what was loud but irrelevant is telling you what to skip today. Read it.

## Step 2: state the plan, then collect

Say which streams you will run given what is connected, and what each will cover. Then collect. Full connector detail, tool costs, fallback chains and quota budgets in `references/collection.md`.

| Stream | Looking for |
| --- | --- |
| **Official sources** | What actually shipped in the window. A capability launch is the strongest content trigger available |
| **Practitioners** | Techniques being used in practice, and complaints that reveal an unmet need. Ignore engagement farming and pure speculation |
| **The roster** | What tracked competitors published, topic and framing only |
| **Search demand** | Whether a topic has volume and how contested it is, where the connector exposes it |
| **The wider web** | Only what the other streams cannot reach. The most expensive stream, keep it narrow |

**Judge nothing on competitor activity alone.** The scoring framework treats a competitor covering something as the weakest form of evidence. A competitor shipping a video is a fact to record, not a reason to make one.

**Respect the budget.** `references/collection.md` carries the per-connector costs and the cap. On breach, write what was covered, name what was skipped, and stop. Never truncate silently: an unstated cap reads as full coverage.

## Step 3: write the brief

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

## Step 4: score, then seed

This is the step that separates this skill from a feed.

Score every candidate against `Intelligence/research/frameworks/idea-scoring.md`, using that file's own questions and its own scale. Do not invent a scoring scheme, and do not carry one in this file, because the framework lives in the OS and can change without touching this skill.

Then seed only what clears the bar, into `Channels/{primary}/ideas/<slug>.md` from that channel's template, with:

- `source:` naming this brief and its date
- the score the framework produced, in the frontmatter field the template uses
- the evidence behind the score, written out, so a later reader can check it rather than trust it

**Check for duplicates before writing.** Against `ideas/` and against `published/`. A reseeded idea is worse than a missed one because it makes the backlog untrustworthy.

**Seed nothing rather than seed noise.** Most runs should produce zero or one idea. A run that seeds five has almost certainly lowered the bar. If nothing clears, write one line in the brief saying so, and that is a complete and successful run.

## Step 5: log, then render

**Log.** `Intelligence/logs/YYYY-MM-DD.md`, naming the brief file, every idea seeded or the fact that none were, and every stream that failed. This is a hybrid: it changes what the OS knows and it also produces a report, so it logs the knowledge change only.

**Render, if asked.** Call the **`instant-ui`** skill with the brief content and an output path. Do not build a page yourself, do not bundle a template, and never hardcode a colour: instant-ui owns the design language and its tokens trace to `Context/brand/brand-kit.md`. Tell it the run is unattended when it is, so it renders gaps rather than stopping to ask.

The markdown brief is the deliverable that matters, because the next skill in the chain reads it. The rendered page is for a human to read over coffee.

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
