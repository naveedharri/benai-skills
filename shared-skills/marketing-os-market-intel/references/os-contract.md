# The OS contract

Every path this skill touches, and the exact shape of what it writes. Paths are relative to the Marketing OS root.

## The boundary, first

`Intelligence/CLAUDE.md` carries the routing table for this folder and that table is the contract. Read it before writing. Two rows matter here:

| Row | Owner | This skill |
| --- | --- | --- |
| Daily scan: news, launches, trends, what the watchlist shipped, at `market/YYYY-MM-DD.md` | the daily scan routine | **never writes it** |
| Standing market research on one topic, dated to when it was true, at `market/YYYY-MM-DD-<slug>.md` | on demand | **this is the row this skill owns** |

If the OS has no daily scan routine registered, this skill still writes only the slugged file. It does not promote itself into the routine's row, because the day the routine gets registered the two would collide and nobody would know which file was authoritative.

## Reads

Nothing here is copied into the skill. It is read live, every run.

### Before any pull

| Path | Gives you | If missing |
| --- | --- | --- |
| `Context/config.md` | The account watchlist, competitor keys, the lookback window, the connector list, the primary channel, any pull cap | Make the safe assumption, name it in the brief, continue |
| `Context/brand/positioning.md` | **The signal test.** The category, the enemy, the strategic edge, and any translation gap between audiences | Continue, and say the translation gap section is unreliable |
| `Intelligence/CLAUDE.md` | The routing table, so you write the right row | Continue from this file, which states the boundary |
| `Intelligence/competitors/_roster.md` | Who is tracked and why, plus the correction log | Skip the roster stream. Never invent a competitor set |
| `Intelligence/competitors/*.md` | Each competitor's living file, for what is already known | Continue |
| `Intelligence/market/` recent dated files | What is already known, and **the noise list**, so today does not resurface yesterday's noise | Normal on a young OS. Say it is the first brief |
| `Analytics/what-works.md` | Measured findings, and what each one licenses. A finding may make a specific class of find valuable | Continue and say no measured patterns were available |
| `Intelligence/research/frameworks/idea-scoring.md` | The scoring framework for Step 4 | **Do not seed.** See below |
| `Channels/{primary}/ideas/` | The current backlog, for deduplication | Continue, treat as empty |
| `Channels/{primary}/published/` | What already shipped, for deduplication | Continue, treat as empty |
| `Channels/{primary}/_template.md` | The shape an idea file takes on this channel | Use the shape below and say the template was missing |

**The lookback window comes from config.** Anything older than it is not news, it is research, and it routes to `marketing-os-research` rather than into this brief.

## Writes

Three writes. The third is required even on a run that finds nothing.

### 1. The standing brief

`Intelligence/market/YYYY-MM-DD-<slug>.md`

```yaml
---
type: research
status: active
date: YYYY-MM-DD
window: <the lookback actually covered, in hours or dates>
focus: <the question this brief answers>
sources: <the streams that ran>
tags: [marketing-os, intelligence, market, <one or more specific>]
---
```

Body, in this order:

| Section | Holds |
| --- | --- |
| `## What shipped` | Facts with links and dates. No interpretation |
| `## What practitioners are doing` | The technique, and who is doing it |
| `## The translation gap` | **The section that earns the brief.** Specifically what one audience now understands that ours has not seen. Named concretely, never gestured at |
| `## What the roster published` | Topic and framing only. No quality judgements |
| `## Candidates` | Every find considered for the backlog, with its score and the evidence, including the ones that did not clear the bar and why |
| `## Noise` | What was loud and not relevant, one line each, so the next run skips it |
| `## Not available` | Every stream that failed, with the connector named |

**Dated files are never rewritten.** This brief is what was known on its date, right or wrong. A correction is a new dated file, never an edit to this one.

**`## Candidates` is the section that makes the brief auditable.** Recording what you rejected and why is what lets a later reader check the judgement instead of trusting it.

### 2. The idea seeds

`Channels/{primary}/ideas/<slug>.md`, from that channel's template.

```yaml
---
type: content
date: YYYY-MM-DD
channel: <primary>
stage: idea
status: active
pillar: <from the channel strategy, if it names pillars>
source: <wikilink to this brief, and its date>
pain: <the pain this speaks to, or "not yet established">
score: <what the framework produced>
owner: <from config>
tags: [marketing-os, content, idea, <channel>, <one or more specific>]
---
```

The body states the angle, what evidence supports it, and how it scored on each question in the framework. **Write the evidence out.** A score with no evidence behind it is a number somebody has to trust, and the whole point of the framework is that it can be checked.

**Deduplicate before writing**, against `ideas/` and `published/` both. A reseeded idea makes the backlog untrustworthy, which is worse than a missed one.

**Seed nothing rather than seed noise.** Zero or one per run is normal. Five means the bar dropped.

**If the scoring framework is missing, do not seed at all.** Record the candidates in the brief as unscored and say the framework was not found. Seeding unscored ideas is the exact failure the framework exists to prevent.

### 3. The log

`Intelligence/logs/YYYY-MM-DD.md`

Name the brief file, every idea seeded or the explicit fact that none were, and every stream that failed. This is a hybrid: it changes what the OS knows and also renders a report, so it logs the knowledge change only.

**A run that changes nothing still logs one line saying it ran.** That line is how anyone can tell the difference between a quiet day and a silently dead skill.

## What this skill never writes

| Not this | It belongs to |
| --- | --- |
| `Intelligence/market/YYYY-MM-DD.md`, the undated-slug daily file | the daily scan routine |
| A competitor's living file | the competitor radar routine |
| The weekly competitor digest | the competitor radar routine |
| The competitor roster itself | a human. Suggest additions in the brief instead |
| Our own performance numbers | `Analytics/`. Intelligence is the world, analytics is us |
| A pattern proven by our own performance | `Analytics/what-works.md` |
| A pain point into `Context/icp/` | the customer intel routine, once a pain recurs |
| A price or an offer change | `Offers/`, after a decision record lands |
| A pipeline stage move | the content pipeline routine |
| A file in the OS root | Nothing. The root holds the router and the folders |

If a run surfaces something belonging to one of those, say so in the brief and leave the file alone. A stub written by the wrong skill is worse than an honest gap.

## Conventions this file inherits

- Intelligence is the world, analytics is us. A competitor's number belongs here, ours does not.
- Intelligence must produce an action. A find that clears the bar becomes an idea. A run that seeds nothing says so in one line.
- Every number carries the date it was pulled and the source it came from.
- Never invent a competitor metric. If the connector did not return it, write not available and name the blocker.
- A figure carried from elsewhere is dated to when it was true and marked as not re-verified.
- Dated files are never rewritten.
- Competitor files are living, not dated. The dated file is the weekly digest, and neither is this skill's to write.
- Quote rather than paraphrase, with a source per quote.
- Empty is honest. A section with nothing real in it says so in one line.
- Wikilinks for every entity, woven into sentences.
- Never use em dashes.
