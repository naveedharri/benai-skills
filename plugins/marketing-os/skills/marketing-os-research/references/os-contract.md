# The OS contract

Every path this skill touches, and the exact shape of what it writes. Paths are relative to the Marketing OS root.

## The row this skill owns

`Intelligence/CLAUDE.md` carries the routing table for this folder. Read it before writing. The row this skill owns:

| Row | Owner |
| --- | --- |
| A research brief on one topic, at `research/<topic-slug>.md` | on demand. **This skill** |

Neighbouring rows it must not write:

| Row | Owner |
| --- | --- |
| `research/YYYY-Www.md`, customer pain and wins for a period | the customer intel routine |
| `research/voice-of-customer.md` | the customer intel routine, and **this skill may append quotes** |
| `research/frameworks/` | a human. Repeatable methods, not findings |
| `research/swipe/` | a human. Reusable hooks and real published examples |
| `market/YYYY-MM-DD.md` and `market/YYYY-MM-DD-<slug>.md` | the daily scan routine and `marketing-os-market-intel` |
| `decisions/` | a human. A research file can say a decision is needed; it never writes one |

## Reads

### Building the queue

| Path | Qualifies when | Priority |
| --- | --- | --- |
| `Intelligence/research/*.md` | frontmatter carries `status: open-question` | **Highest.** The file usually already states what would answer it, and often names the blocker |
| `Analytics/what-works.md` | its open-questions section, claims with partial evidence | High. Each names the measurement that would settle it |
| `Analytics/what-works.md` | its untested table, beliefs with no evidence | High |
| `Channels/{primary}/ideas/*.md` | `pain: not yet established` | Medium |
| `Intelligence/market/*.md` | the translation-gap sections | Medium. A research question shaped like a content opportunity |
| `Intelligence/decisions/*.md` | **read for exclusions** | Anything a decision settled is not open |

**Present the queue with a feasibility verdict per item**, because some questions external research cannot answer:

| Verdict | When |
| --- | --- |
| **Answerable** | External evidence exists and would settle it |
| **Partly answerable** | Research narrows it but an internal measurement is still needed. Say which |
| **Not answerable here** | The blocker is a missing connector, an unpulled metric, or a field that does not exist on the assets yet. **Name what would unblock it and do not attempt it** |

That third row is the most useful output this skill produces on some runs. A question whose blocker is "this OS cannot pull thumbnail click-through rate" will never be answered by reading, and saying so stops the same failed run happening every quarter.

### Scoping

| Path | Gives you | If missing |
| --- | --- | --- |
| `Context/config.md` | Connectors, the operator, the primary channel | Make the safe assumption, name it, continue |
| `Context/brand/positioning.md` | The strategic position, which is usually the thing worth pressure-testing | Continue, and say no angle was supplied |
| `Context/icp/*.md` | Who the answer is for, and their pain in their own words | Continue, and say the audience is unspecified |
| The question file itself | The belief, the blocker, and often the exact measurement needed | n/a |

**Read the question file back before asking anything.** A well-written open question already contains most of the intake, and asking for what it says tells the operator you did not read it.

## Writes

Four, and the fourth is required even on a run that concludes nothing.

### 1. The research file

`Intelligence/research/<topic-slug>.md`

```yaml
---
type: research
topic: <the question in a phrase>
status: active
date: YYYY-MM-DD
updated: YYYY-MM-DD
depth: quick | standard | deep
source: <the streams that ran, and which fell back>
answers: <wikilink to the question file this closes, if any>
tags: [marketing-os, intelligence, research, <one or more specific>]
---
```

Body, in this order:

| Section | Holds |
| --- | --- |
| `## The question` | Stated specifically enough to be answerable, and who asked it |
| `## The evidence base, and its limits` | What was read, how much, and what the limits are. **Every finding below inherits these limits**, so they go first, not last |
| `## The answer` | The TL;DR. What the evidence supports, in a few lines |
| `## Findings` | One per block: the claim, the evidence with sources, how many source types corroborate it, the verdict, the confidence, and any confound not eliminated |
| `## The counter-case` | The strongest argument against the answer, at full strength |
| `## Voice of market` | Verbatim language, quoted, with a source each. Sentiment, labelled as sentiment |
| `## Claims ledger` | Every hard claim with its verdict, primary source and caveat. Corrections that were caught stay visible here |
| `## What this does not settle` | What is still open, and the specific measurement that would settle it |
| `## Sources` | Grouped by stream |
| `## Not available` | Every stream that could not run, with the connector named |

**No `# H1` repeating the filename.**

**`## What this does not settle` is what makes the file honest.** A research file with no open edges is either a trivial question or an over-claimed answer.

### 2. Promote the question

When the run answered a file carrying `status: open-question`:

- Change `status:` to `active`, or to whatever the file's own vocabulary uses for settled
- Set `updated:` to today
- Add one line stating the answer, and a wikilink to the research file
- **Keep the original question text and its history intact.** Do not delete it and do not rewrite it

A file that records what was once unknown, when it was answered, and by what, is worth more than a file that only records the current answer. That trail is how anyone later can tell a measured conclusion from an inherited assumption.

When the question lived in `Analytics/what-works.md` rather than in its own file, **do not edit that file.** Say in your response which entry the research bears on and what it would change, and leave the edit to the routine that owns it. That file has its own promotion rules and its own three-instance threshold.

### 3. Route the rest

| Finding | Goes to | Written by |
| --- | --- | --- |
| Verbatim customer language, with a source per quote | `Intelligence/research/voice-of-customer.md` | **this skill may append** |
| A pain that recurs across sources | the segment file in `Context/icp/` | the customer intel routine. **Name the change, do not write it** |
| Anything about our own performance | `Analytics/what-works.md` | the content pipeline routine. **Name it, do not write it** |
| A pattern the business should adopt as a rule | a decision record in `Intelligence/decisions/` | a human. Say it needs one |
| A content opportunity | `Channels/{primary}/ideas/` | the scan routines and `marketing-os-market-intel` |

**Intelligence is the world, analytics is us.** A finding about our own results written into `Intelligence/` is the most common way these two folders get confused, and once confused neither is navigable within months.

**Patterns graduate to `Context/`, they do not start there.** When a pain recurs it stops being intelligence and becomes a line in a segment file, but that promotion is the customer intel routine's job and it has a recurrence threshold. Naming the candidate is this skill's job.

### 4. The log

`Intelligence/logs/YYYY-MM-DD.md`

Name the research file, any question file promoted with its old and new status, anything appended to the quote bank, and anything routed elsewhere with the file named. This is a hybrid, so it logs the knowledge change only, not the reading.

**A run that concluded nothing still logs one line.** That line is how anyone can tell a genuinely inconclusive run from a silently dead skill.

## What this skill never writes

| Not this | Why |
| --- | --- |
| A file in the OS root | The root holds the router and the folders. Nothing else |
| `Analytics/` anything | Our numbers are not this skill's to write |
| `Intelligence/decisions/` | A decision is a human act with rejected alternatives recorded |
| `Intelligence/research/frameworks/` or `swipe/` | Human-curated methods and examples, not findings |
| A competitor's living file | the competitor radar routine |
| A price or an offer change | `Offers/`, after a decision record lands |
| A metric anywhere | Every number carries its pull date and source, and pulling is another routine's job |

If a run surfaces something belonging to one of those, name the file and the change in your response and leave it alone. A stub written by the wrong skill is worse than an honest gap.

## Conventions this file inherits

- Quote, do not paraphrase. Every quote carries who said it, which file it came from, and when. Where a source is itself a compression, say so.
- Every number carries the date it was pulled and the source it came from.
- A figure carried from elsewhere is dated to when it was true and marked as not re-verified. Copying does not promote it to current.
- Intelligence must produce an action. A research file that changes nothing says what it ruled out.
- Empty is honest. A section with nothing real in it says so in one line.
- Wikilinks for every entity, woven into sentences, never a bullet list of references.
- Frontmatter always carries `status:` and two or more specific `tags:`.
- Never fabricate a metric. If it is not in a source you actually read, say it is not available and name the blocker.
- Never use em dashes.
