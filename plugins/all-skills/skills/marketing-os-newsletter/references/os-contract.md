# The OS contract

Every path this skill touches, and the exact shape of what it writes. Paths are relative to the Marketing OS root.

## Reads

Nothing here is copied into the skill. It is read live, every run.

### Always

| Path | Why | If missing |
| --- | --- | --- |
| `Context/config.md` | Instance literals: the newsletter platform, the cadence target, which connectors exist, the offer keys | Make the safe assumption, name it, continue |
| `Context/personal-brand/voice.md` | The master voice register. Mechanics, banned vocabulary, sign-off | Say so and fall back to the channel delta alone |
| `Channels/newsletter/voice.md` | The delta for this surface only. Subject line mechanics, how this channel differs | Use the master register alone |
| `Channels/newsletter/strategy.md` | Role in the funnel, format contract, length, cadence, where an edition routes | Say so. Length then comes from the real sends |
| `Channels/newsletter/broadcasts/` | **The style ground truth.** Read three to six recent sends in full | Say the first send has no example to match |

### By gate

| Path | Read at | Why |
| --- | --- | --- |
| `Context/icp/*.md` | Gate 2 | One file per segment, and the pain points live inside each segment file rather than in a parallel folder. Pick the segment the edition speaks to and name its pain in the reader's language |
| `Intelligence/research/frameworks/newsletter-structure.md` | Gate 3 | The edition structure |
| `Analytics/what-works.md` | before Gate 3 | Measured findings, and open questions labelled as untested. Honour what each finding licenses |
| `Channels/newsletter/sop-subject-line-playbook.md` | Gate 4 | Subject line mechanics and rules |
| `Intelligence/research/swipe/subject-lines.md` | Gate 4 | Every subject line already proven |
| `Intelligence/research/swipe/hooks.md` | Gate 5 | Proven openers |
| `Intelligence/research/swipe/ctas.md` | Gate 6 | CTA phrasings and the natural destination for each |
| `Offers/{offer}/offer.md` | Gate 6 | The promise and the live price table with effective dates |
| `Offers/{offer}/proof/` | Gate 6, only if the edition uses proof | Real results with sources. Empty is a valid answer |
| `Intelligence/research/voice-of-customer.md` | Gate 0 or 6 | Verbatim customer language with a source per quote |
| `Context/personal-brand/background.md` | only if the edition needs it | The operator's story and credentials |

### Source specific

| Source | Read |
| --- | --- |
| A published pillar | `Channels/youtube/published/YYYY-MM-DD-<slug>.md` in full, including its `## Performance` block and `## Repurpose tree` |
| A campaign send | `Campaigns/{campaign}/brief.md` for the number, the window and the offer it points at |
| A community post or member win | `Intelligence/research/voice-of-customer.md`, and `Offers/accelerator/delivery.md` for how the community works |

## Writes

Five writes, all required on approval.

### 1. The edition

`Channels/newsletter/broadcasts/YYYY-MM-DD-<slug>.md`

```yaml
---
type: content
date: YYYY-MM-DD
channel: newsletter
stage: drafted | scheduled | sent
status: active
source: <the pillar wikilink, "values and beliefs doc", or what it actually came from>
pain: <the pain from the segment file, in the reader's words>
segment: <the icp segment slug this speaks to>
campaign: <slug, only when it belongs to one>
owner: <from config>
tags: [marketing-os, content, newsletter, <two or more specific ones>]
---
```

Body, in this order:

| Section | Holds |
| --- | --- |
| `## Subject` | The shipped subject line and the preview text |
| `## Edition` | The full body as it sends. Nothing else in this section |
| `## The decisions` | One line per gate: the angle, the insight, the outcome, the outline chosen, why that subject line. This is what makes the file useful six months later |
| `## Sources` | What it was written from, as wikilinks woven into sentences |
| `## Performance` | Append-only, one row per pull, each carrying the date and the source. Created empty with a line saying no pull has happened yet |

**No `# H1` repeating the filename.** Open with `## Subject`.

**Performance is append-only for the life of the asset.** Content never freezes. Never rewrite a row, never delete one, and never substitute a lifetime figure for a windowed one.

### 2. The subject line append

`Intelligence/research/swipe/subject-lines.md`

Append the shipped line with its date and a wikilink to the edition. Match the file's existing shape rather than inventing a new one. Only the line that actually shipped, never the rejected options.

### 3. The parent's repurpose tree

When the source was a published pillar, add the edition to that asset's `## Repurpose tree` as a wikilink, in a sentence. Do not restructure the section and do not touch its `## Performance` block.

### 4. The log

`Intelligence/logs/YYYY-MM-DD.md`

Name the file written and the specific change. A hybrid logs the knowledge change only, so log the filed edition, the swipe append and the tree update, not the drafting itself. A run that ends without an approved edition still logs one line saying it ran and stopped at which gate.

### 5. The rendered one-pager

`Analytics/dashboard/runs/YYYY-MM-DD-newsletter-<slug>.html`

Rendered by invoking the **`instant-ui`** skill, never hand-rolled. This is a required output, not an optional extra: nobody should review an edition as raw markdown before it sends.

The markdown stays markdown because markdown is what the OS stores and what the next skill reads. The HTML is what a human opens. Both exist after every run, and each records the other's path.

`Analytics/dashboard/runs/` is the same folder every routine writes its run report into, so one folder shows everything the OS did on a given day. Create it if it does not exist.

**If `instant-ui` is unavailable**, say so plainly, note it in the log line, and never hand-roll a page. A hand-rolled page drifts from the design language immediately, which is the whole reason the render is delegated to one skill.

## What this skill never writes

| Not this | It belongs to |
| --- | --- |
| A price, anywhere outside quoting the offer file | `Offers/`, and `Context/config.md` |
| A pain point into `Context/icp/` | `customer-intel`, once a pain recurs |
| A metric into `Analytics/` | `morning-performance-sweep` |
| A pipeline stage move | `content-pipeline-sync` |
| A file in the OS root | Nothing. The root holds the router and the folders |
| An idea into `Channels/youtube/ideas/` | `market-scan` and `customer-intel` |
| A campaign result | `campaign-sync`, into `Campaigns/{campaign}/results.md` |

If a run surfaces something that belongs in one of those, say so in the response and leave the file alone. A stub written by the wrong skill is worse than an honest gap.

## Conventions this file inherits

- One home per fact. `Context/` is authoritative. Link to it rather than restating it.
- Every number carries the date it was pulled and the source it came from.
- Empty is honest. A section with nothing real in it says so in one line.
- Wikilinks for every entity, woven into sentences.
- Frontmatter always carries `status:` and two or more specific `tags:`.
- Never use em dashes.
