# The OS contract

Every path this skill touches, and the exact shape of what it writes. Paths are relative to the Marketing OS root.

## Reads

Nothing here is copied into the skill. It is read live, every run.

### Required

| Path | Why | If missing |
| --- | --- | --- |
| `Context/brand/brand-kit.md` | **The executable design contract.** Palette, typography, the background rule, the logo and portrait pointers | **Stop.** There is nothing to build against and inventing a palette is brand drift |
| `Context/config.md` | `operator_name` and `org_name` for the footer bar, and the Higgsfield workspace id | Ask once for what is missing, offer to record it |
| `Context/personal-brand/voice.md` | The master voice register and the banned constructions | Continue on the channel delta alone and say so |

**Two token sets can live in one brand kit**, one for audience-facing surfaces and one for internal data surfaces. A carousel is audience-facing. Pick that set and use it whole. Never blend them.

### The source, one of

| Path | What to take from it |
| --- | --- |
| `Channels/{email channel}/broadcasts/YYYY-MM-DD-<slug>.md` | The `## Edition` body, and the `## The decisions` block, which already holds the angle, the insight and the outcome |
| `Channels/{primary}/published/YYYY-MM-DD-<slug>.md` | The angle, the snapshot, the pain, and the `## Repurpose tree` |
| `Channels/{channel}/pipeline/<slug>/brief.md` | An asset still in production |

**Read the parent's repurpose tree before building.** If a carousel child is already recorded there, stop and ask whether this is a second angle or a replacement.

### Supporting

| Path | For |
| --- | --- |
| `Channels/{target channel}/voice.md` | The delta for the surface this posts to |
| `Channels/{target channel}/strategy.md` | The format contract, and what this channel receives per the cascade |
| `Channels/{target channel}/sop-repurposing.md` | The procedure this surface documents, if it has one |
| `Intelligence/research/swipe/hooks.md` | Opening shapes for the cover slide |
| `Intelligence/research/swipe/ctas.md` | CTA phrasings and where each routes |
| `Offers/{offer}/offer.md` | The final-slide destination, its promise, and the live price if a slide needs one |
| `Offers/{offer}/proof/` | Real results with sources, only if a slide uses proof. Empty is a valid answer |
| `Analytics/what-works.md` | Measured patterns, and open questions labelled untested |

## Writes

Four writes, all required once the PDF exists.

### 1. The channel asset

Not yet posted: `Channels/{target channel}/pipeline/<slug>/brief.md`
Already posted: `Channels/{target channel}/published/YYYY-MM-DD-<slug>.md`

```yaml
---
type: content
date: YYYY-MM-DD
channel: <target channel>
format: carousel
stage: drafted | scheduled | published
status: active
source: <parent asset wikilink>
pain: <the pain from the segment file this lands on>
segment: <the icp segment slug>
campaign: <slug, only when it belongs to one>
owner: <from config>
tags: [marketing-os, content, <channel>, carousel, <one or more specific>]
---
```

Body, in this order:

| Section | Holds |
| --- | --- |
| `## The one point` | The single argument the carousel makes, in one sentence |
| `## Slides` | A table: slide number, eyebrow, headline, the highlighted phrase. The copy of record |
| `## Caption` | The one-line caption it posts with, if written |
| `## Assets` | **Pointers only.** The PDF path and the slide folder path. No media in the brain |
| `## Sources` | The parent and anything else read, as wikilinks woven into sentences |
| `## Performance` | Append-only, one row per pull with its date and source. Created empty with a line saying no pull has happened yet |

**No `# H1` repeating the filename.**

**`## Assets` holds paths, never files.** Videos, images, PSDs and PDFs stay on disk or in the DAM. The OS stores markdown and pointers, and a PDF committed into the tree breaks that rule for every future reader.

### 2. The parent's repurpose tree

Add this carousel to the source asset's `## Repurpose tree` as a wikilink, in a sentence rather than as a bare bullet. Do not restructure the section and never touch the parent's `## Performance` block.

If the parent has no repurpose tree section, add one. If the parent is a pipeline brief rather than a published asset, record the child there instead.

### 3. The log

`Intelligence/logs/YYYY-MM-DD.md`

Name the file written and the specific change. A hybrid logs the knowledge change only, so log the filed asset and the tree update, not the rendering. A run that ends without a PDF still logs one line saying it ran and where it stopped.

### 4. The rendered one-pager

`Analytics/dashboard/runs/YYYY-MM-DD-carousel-<slug>.html`

Rendered by invoking the **`instant-ui`** skill, never hand-rolled. This is a required output, not an optional extra: the PDF is the asset, the page is how the run gets checked.

The markdown stays markdown because markdown is what the OS stores and what the next skill reads. The HTML is what a human opens. Both exist after every run, and each records the other's path.

`Analytics/dashboard/runs/` is the same folder every routine writes its run report into, so one folder shows everything the OS did on a given day. Create it if it does not exist.

**If `instant-ui` is unavailable**, say so plainly, note it in the log line, and never hand-roll a page. A hand-rolled page drifts from the design language immediately, which is the whole reason the render is delegated to one skill.

## What this skill never writes

| Not this | It belongs to |
| --- | --- |
| A change to the palette, a token, or a font | `Context/brand/brand-kit.md`, edited deliberately |
| A price anywhere except quoting the offer file | `Offers/`, and `Context/config.md` |
| A metric into `Analytics/` | `morning-performance-sweep` |
| A pipeline stage move | `content-pipeline-sync` |
| A binary file anywhere in the OS tree | Disk, Drive, or the DAM. Record a pointer |
| A file in the OS root | Nothing. The root holds the router and the folders |
| A pain point into `Context/icp/` | `customer-intel`, once a pain recurs |

If a run surfaces something belonging to one of those, say so in the response and leave the file alone.

## Conventions this file inherits

- One home per fact. `Context/` is authoritative. Link rather than restate.
- No media in the brain. Markdown and pointers only.
- Content never freezes. `## Performance` is append-only for the life of the asset.
- Every number carries the date it was pulled and the source it came from.
- Empty is honest. A section with nothing real in it says so in one line.
- Wikilinks for every entity, woven into sentences.
- Frontmatter always carries `status:` and two or more specific `tags:`.
- Never use em dashes.
