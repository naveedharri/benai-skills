# Ben's tagging pattern

Rebuilt 2026-08-25 by reading the actual `keywords` field off the 15 most recent published
videos on `UC3KK7ENB_ierAXvrxVNnbZQ`. 390 tags, 253 unique.

This file replaces a version that was lost from the synced skill. The lost version was
partially reconstructed from memory in the SKILL.md, and **four of its rules were wrong**.
They are corrected below and each correction names the measurement that killed it.

This corpus is the standard, by [[Oskar Johnston]]'s decision on 2026-08-26. Ben's own
published tags are what a new video gets matched against. The vidIQ browser extension then
prunes the last stretch. Both halves are described in the closing section.

## How to read the tags yourself

From a tab already on `youtube.com`, same-origin `fetch` returns the full watch-page HTML
with the tags in it. This works on any video, including Ben's.

```js
const h = await (await fetch('/watch?v=VIDEO_ID')).text();
const m = h.match(/"keywords":(\[.*?\]),"/s);
const tags = m ? JSON.parse(m[1].replace(/\\u0026/g,'&')) : [];
```

Get the recent uploads list with the InnerTube recipe in `chrome-transcript-extraction.md`,
then loop. Re-measure this file whenever it feels stale; it takes about three calls.

## The budget, corrected

| Measure | Real range | Median |
|---|---|---|
| Characters, commas included | 327 to 451 | **441** |
| Tag count | 18 to 32 | **26** |

**Correction 1.** The old rule said "aim for 480 to 500 characters". No video in the corpus
reaches 460. Target **420 to 450**. YouTube's hard cap is 500, but Ben does not use it, and a
string padded to 500 is padded with tags he would not have chosen.

## Brand staples, corrected

**Correction 2.** The old rule listed nine "non-negotiable" brand staples that must always
appear. Only one is close to universal.

| Tag | Videos containing it |
|---|---|
| `Ben AI` | **14 of 15** |
| `claude skills` | 12 of 15 |
| `Claude Cowork` | 11 of 15 |
| `Claude Code` | 11 of 15 |
| `claude mcp` | 7 of 15 |
| `best claude skills` | 6 of 15 |
| `claude.md` | 5 of 15 |
| `claude connectors` | 5 of 15 |
| `claude cli` | **1 of 15** |

So: `Ben AI` goes on everything. The rest are topical, not staples. Include them when the
video is actually about them.

**Correction 3.** `claude cli` is not a staple. One appearance in fifteen videos. Stop
forcing it in.

## The real shape of a tag list

A Ben tag list is mostly **permutations of the video's own topic**, with a thin brand layer.
Roughly:

- **12 to 18 topic permutations.** The core phrase plus modifiers, plus the core phrase
  crossed with each tool or product it touches.
- **3 to 6 product-family tags.** `claude cowork`, `Claude Code`, `claude plugins`,
  `codex skills`.
- **2 to 4 broad catch-alls.** Yes, really: `AI`, `skills`, `ai automation`, `claude ai`.
- **1 brand tag.** `Ben AI`.
- **2 to 5 vertical framings.** See correction 4.

### The modifier set, measured

Applied to the core topic phrase. Not all of them fit every topic; pick the ones that read
like something a person would type.

`[topic]`, `[topic] tutorial`, `[topic] guide`, `[topic] explained`, `[topic] examples`,
`[topic] tips`, `[topic] use cases`, `[topic] for beginners`, `[topic] advanced`,
`best [topic]`

### The cross-product pattern

For a video about connecting tools, the list is almost entirely `claude <tool>`:

> claude google drive, claude google sheets, claude google docs, claude google calendar,
> claude microsoft, claude linkedin, claude outlook, claude excel, claude meta ads,
> claude hubspot, claude whatsapp, claude youtube, claude mcp, claude connectors, composio

26 tags, 446 characters. Note it carries no `Ben AI`, no `Claude Skills`, no `claude.md`.
It is a topic list, not a brand list.

## Vertical framings are used, not cut

**Correction 4.** The old rule listed "business-y framings (`for business`)" as an
anti-pattern Ben cuts every time. The corpus says the opposite: 14 distinct business and
vertical framings appear, and `ai for business` alone appears 6 times.

Real examples: `ai for business`, `claude for business`, `claude skills for business`,
`claude for marketing`, `claude for agencies`, `claude for sales`, `ai for small business`,
`claude cowork for business`, `local ai for business`.

Use them. Two to five per video, matched to who the video is for.

## "How to" tags are used, not cut

**Correction 5.** The old rule banned "how to" prefixed tags. Six appear in the corpus:
`how to run ai locally`, `how to use claude in slack`, `how to humanize ai text`,
`how to sell ai agents`, `how to sell ai to businesses`, `how to build ai agents`.

They show up when the video title itself is a how-to. Match the tag to the title's shape.

## What genuinely is an anti-pattern

Only these survived the measurement.

- **Typos.** `Cluade` for `Claude`. One shipped once and stayed.
- **Old brand names.** If a tool has been renamed, use the current name, not the one Ben used
  on camera a year ago.
- **Invented search phrasings.** A tag has to be something a person would actually type.
  `claude video plugin` is not.
- **Casing duplicates.** `claude cowork skills` and `Claude cowork skills` both appear in one
  video. It wastes budget. Pick one casing per phrase.

Casing is otherwise loose and does not matter. Ben mixes `Claude Cowork` and `claude cowork`
freely and YouTube does not care.

## How tags actually get made: corpus for shape, vidIQ extension for pruning

Corrected 2026-08-26 after watching the process run. Both halves are real and they do different
jobs. An earlier version of this section said vidIQ was simply unavailable, which was true of the
MCP connector and wrong about the practice.

### The vidIQ browser extension is in use

Not the MCP connector, which is still not wired up. The **vidIQ Chrome extension** sits inside
YouTube Studio and shows, per keyword: search volume, competition, and a vidIQ score. Oskar
installed it on [[Juan]]'s machine on 2026-08-26 and used it to build the shipped tag list.

Install it from the Chrome extension store, sign in with Ben's account, and it appears in the
Tags field in Studio with suggestions and a search box.

### The division of labour

| Job | Source |
|---|---|
| What shape the list takes, how long, what modifiers | this corpus |
| Whether a specific candidate is worth its characters | vidIQ extension |
| Whether a tag is even about this video | human judgment, and it overrides both |

Oskar's decision on 2026-08-26 stands: **the standard is what Ben AI has actually used.** The
extension does not get to override that. It is a pruning tool for the last stretch, not the
author of the list.

### The observed pruning loop

1. Paste the corpus-built list into the Tags field.
2. Read the extension's suggestions and search a couple of core terms.
3. **Add** the clear wins. The heuristic Oskar used out loud: low competition with a high vidIQ
   score. On 2026-08-26 that added `obsidian claude code`, which scored high on volume with
   competition described as "very low".
4. **Cut the off-topic ones first**, before cutting on volume. Real cuts from that session:
   `claude connectors`, `claude mcp`, `claude ai`, `self hosted second brain`. Every one was
   removed for being about something other than the video, not for scoring badly.
5. Cut down until the field fits. YouTube's ceiling is 500 characters and the field turns red
   over it. The shipped list came in at **27 tags, 422 to 434 characters**, which lands inside
   the 420 to 450 band measured off the corpus. That is an independent confirmation of the band.

### What the extension cannot tell you

Relevance. It happily suggested `claude skills linkedin` and `claude analytics` for a skills
video, and Oskar's reaction was "that doesn't make sense". Volume on an irrelevant tag is worth
nothing. Judgment on topic comes first, scores second.
