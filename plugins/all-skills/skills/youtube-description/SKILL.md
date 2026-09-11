---
name: youtube-description
description: Stage 5 and the last stage of the Ben AI publishing chain. Assembles the video description from the canonical template using the video's five-letter code, its chapters, and its referenced-video links, writes the description and the tag string into the YouTube Studio draft through Claude in Chrome, and moves the Notion card to Ready to publish. Leaves the video Unlisted for a person to publish. Use when someone says "write the description", "put the description in", "load the description and tags", "finish the publish prep", "assemble the description", or has chapters and live Bitly links and wants them in Studio.
---

# YouTube Description

Stage 5, the last one. Ends with a fully armed Unlisted draft and the card moved.

Does not make the video public. A person does that.

## Preconditions, and check all three

Read the Notion card first. See `references/notion-card.md`.

| Needed | Why |
|---|---|
| `UTM code` filled | no code means no links to write |
| `Bitly imported` ticked | **an unchecked box means the links are not live.** Do not write a description full of dead links |
| `Chapters` filled | the template has a chapters block that cannot be left empty |

If any is missing, say which stage has not run and stop.

## Steps

```
Task Progress:
- [ ] 1. Assemble the description from the template
- [ ] 2. Run the substitution check
- [ ] 3. Show the whole block and get the go     ← HUMAN CHECKPOINT
- [ ] 4. Write description + tags into Studio
- [ ] 5. Read it back
- [ ] 6. Tags read back, chapters render, spacing checked
- [ ] 7. Move the card to Ready to publish
```

### 1. Assemble from the template

**Read `references/description-template.md`.** It is the canonical block. Fill the three
variables and leave everything else byte-identical.

- `{{CODE}}`: the five-letter code, from the card.
- `{{CHAPTERS}}`: from the card, `MM:SS – Title`, first line `00:00 – Intro`.
- `{{REFERENCED_VIDEOS}}`: the videos Ben actually points at in **this** video.

Two things the template file covers that matter most:

- **When there is no lead magnet, the "Get the free setup guide" block comes out.** Three
  `c.benai.co` links remain instead of four.
- The arrow is `⤵️` and the TV is `📺`. Copy them, do not retype them.

`references/description-block.md` holds the worked example if the template's shape is unclear.

Note that the Cowork link never appears in the description, so the 2026-08-26 suffix change
from `-cowork` to `-os` does not touch this stage. Only accelerator, free, aioperator and
agency are published.

### 2. The substitution check

Assert, before touching Studio:

- Exactly four `c.benai.co` links with a lead magnet, exactly three without.
- Every one carries the **current** code.
- The previous video's code appears zero times.
- Character count under 5000. Report it.
- **Every `c.benai.co` link resolves.** Open them. A `-free` link that 404s means the Kit lead
  magnet page was never built, which happened on 2026-08-26. That is a blocker, not a warning:
  stop, go finish stage 3, come back.
- **The block order matches what Ben promises on camera.** If he says "the first link in the
  description", the thing he is describing has to be the first link. See the template.

**Never build the description by pasting a previous video's.** That is how the old code ships,
and this check is what catches it. If a count is off, stop and report rather than writing.

### 3. The human checkpoint

Show the entire assembled block, not a summary. Last look before it goes in front of viewers.
Wait for an explicit go.

Call out three things in the show: the code, whether the free block is in or out and why, and
the 📺 entries with their URLs.

### 4. Write it into Studio

Through Claude in Chrome; the tools and the selectors are in `references/studio-chrome.md`.
YouTube is IP-blocked from the sandbox, so there is no other path.

Both the description and the tag string go in on the Details tab. Tags live under
**Show more**, in the Tags field.

### 5. Read it back

Read the field back out of the page and diff it against what you meant to write. Studio's
description box does its own whitespace handling, and the emoji are the first thing to break.

Confirm the chapters render as chapters. YouTube only accepts them if the first one is at
`00:00` and there are at least three. If they do not render, the format is wrong, not YouTube.

### 6. Confirm the tags actually went in

Read the Tags field back. It gets forgotten: on 2026-08-26 the description was saved and
everything looked finished, and the tags were still empty. Juan caught it, not the process.

Check the chapters render as chapters at the same time, and check the spacing of the About me
block at the foot of the description, which Studio tends to collapse.

### 7. Move the card

`Stage` to `Ready to publish` on the Notion card.

## Hard rules

- **Visibility stays Unlisted.** This skill never touches the visibility control. If the video
  is somehow not Unlisted, report it and stop.
- **Never carry the previous video's 📺 links forward silently.** If Ben names nothing, leave
  the block out.
- **No terminal.** Everything here is browser work and card writes.
- **Check proper nouns against a written source, never the transcript.** Auto-captions get names
  wrong, and the wrong spelling then propagates into tags and the description. On 2026-08-26 the
  transcript rendered "Baalda" as "Balda" and "Balder", and both reached the tag list before
  being caught. Take spellings off the Notion card or the product itself.

## What is not in this skill

The post-publish half: the accelerator post, the LinkedIn post, and the thumbnail review 4 to
12 hours after publishing. Those follow the YouTube Publishing SOP and the LinkedIn Repurposing
SOP, and the thumbnail review has no skill yet.
