---
name: youtube-chapters-tags
description: Stage 4 of the Ben AI publishing chain. Generates chapters with accurate timestamps and a tag string for a Ben van Sprundel video. Pulls the timestamped transcript out of YouTube through Claude in Chrome, finds where each topic actually starts, names chapters to Ben's measured style, flags every outbound video reference that needs a description link, and builds the tag list from the pattern measured across Ben's last 15 published videos. Needs the video to be Unlisted first, because a Studio draft has no caption track. Use when someone says "prepare the chapters", "do the tags", "chapter this video", "what tags should I use", "review the chapters", or shares a video URL and asks for chapters or tags.
---

# YouTube Chapters and Tags

Stage 4. Two deliverables from one video, run independently so either can be asked for alone.

1. **Chapters**: `MM:SS – Title` for the description and YouTube's chapter UI.
2. **Tags**: a tag string matching the pattern measured across Ben's recent videos.

## Precondition: the video has to be Unlisted

A Studio draft has **no caption track**. No captions means no timestamped transcript means no
chapters. YouTube generates captions only after the video is saved at a real visibility and its
checks finish. Private does not work either.

So `youtube-studio-setup` runs first. If the video is still a draft, or Unlisted but not yet
captioned, say so plainly and stop. Do not fake chapters from the script, the Notion card, or
the outline. Every timestamp has to come from the transcript.

Check for captions before anything else:

```js
const h = await (await fetch('/watch?v=VIDEO_ID')).text();
h.includes('captionTracks')
```

False means come back later. It usually clears within the same session for a video under 20
minutes.

## Workflow A: chapters

### 1. Pull the timestamped transcript

YouTube is IP-blocked from the sandbox. `youtube-transcript-api` and `curl` both fail; do not
retry them. Everything goes through Claude in Chrome.

Use the transcript-panel recipe in `references/chrome-transcript-extraction.md`.

**Do not try to fetch the caption track's `baseUrl` out of `captionTracks`.** It gets blocked,
because that URL carries session tokens. Found 2026-08-25. The DOM panel is the working path.

Store the result on `window.__ts`. JS responses cap at about 1000 characters, so read it back
in slices of roughly 8 lines. Tabs also die mid-session and take `window` with them, so
re-derive rather than assuming state survived.

### 2. Find the transitions cheaply

Reading 100 segments at 8 lines a call is a dozen round trips. Filter first, read only the
windows around each candidate:

```js
const p = /(first|second|thirdly|lastly|and last|best practice|now let me|moving on|
             demo|review|recommend|here above|show you)/i;
window.__ts.map((l,i)=>({i,l})).filter(o=>p.test(o.l)).map(o=>o.i+' '+o.l.slice(0,40)).join('\n')
```

Then `window.__ts.slice(n-1, n+7)` around each hit to confirm the exact boundary line.

The timestamp marks where the topic **starts being discussed**, not where the transcript block
starts. If the transition phrase lands mid-block, take that block's timestamp.

### 3. Name them

**Read `references/chapter-style.md` before naming anything.** It is measured from the last 15
published videos and it overrides intuition. The corpus is in
`references/examples/chapter-corpus-2026-08.md`.

The rule that matters most: a chapter title reads like a video title. It hints at the territory
and withholds the payoff. `Best Practice #3`, never `Best Practice 3: Narrate Why`.

Four things worth repeating here:

- `00:00 – Intro` always, zero-padded, en dash U+2013.
- **No `Outro` chapter.** 0 of 15 videos have one.
- **Never chapter a CTA.** The accelerator plug is not a chapter. Start the next chapter after
  it ends, not at the block that still contains its tail.
- Counted items take the `#` form: `Best Practice #1`, never `Best Practice 1`. Keep the label
  on the noun when the bare noun would not stand alone. Oskar corrected `Practice #1` to
  `Best Practice #1` on 2026-08-25: the `#` governs the number, not how far the noun gets
  trimmed.

### 4. Check before delivering

- `00:00 – Intro` present, en dash, zero-padded.
- No chapter contains the answer to itself.
- No `Outro`.
- 7 to 13 chapters unless the video runs over 40 minutes.
- Last chapter starts between 80 and 95 percent of runtime.
- **Chapters at least 20 seconds apart.** Rule set by Oskar 2026-08-24, tightened from an
  earlier 15-second floor. Merge or shift when two transitions land closer, and say which.

Deliver in a fenced code block so it copies cleanly.

### 5. Flag the video references

Scan for any moment Ben points at another video: "I have a full video on this", "check out the
video here above", "link in the description". For each one report the timestamp, the exact
quote, and what it is probably about.

The end-card reference in the last 30 seconds is the most common and almost always needs a
link. Report it; do not guess which video it is.

## Workflow B: tags

**Read `references/tagging-pattern.md`.** It was rebuilt 2026-08-25 from the real `keywords`
field of Ben's last 15 videos, and it corrects five rules that the old lost version got wrong.
Do not work from memory of the old rules.

The headline corrections, so nobody rebuilds the mistakes:

- Target **420 to 450 characters**, not 480 to 500. No video in the corpus reaches 460.
- 18 to 32 tags, median 26.
- **`Ben AI` is the only near-universal tag** (14 of 15). The other eight "non-negotiable
  staples" are topical. `claude cli` appears once in fifteen videos.
- **Business and vertical framings are used**, not cut. `ai for business` appears 6 times.
- **"How to" tags are used** when the title is a how-to. Six appear in the corpus.

A list is mostly permutations of the video's own topic, with a thin brand layer. The measured
shape and the modifier set are in the reference.

### Build from the corpus, then prune with the vidIQ extension

Oskar's decision, 2026-08-26: tags get built from what Ben AI has actually used, so the corpus
is the source of truth and a tag list is not something to apologise for.

Then a person prunes it in Studio using the **vidIQ browser extension**, which is in active use
even though the vidIQ MCP connector is not connected. Read the closing section of
`references/tagging-pattern.md` for the loop, the heuristic, and the four tags that got cut on
2026-08-26 and why.

The order that matters: relevance first, then score. The extension will happily suggest a
high-volume tag that has nothing to do with the video.

Deliver the list as a copyable block and say it was built from the corpus. The operator does the
pruning pass in Studio, where the extension lives, so leave room for the list to shrink.

## Self-improvement

`tagging-pattern.md` and `chapter-style.md` are both measured files with a date on them. When
they feel stale, re-measure rather than guessing: the recipes for pulling both chapters and
tags off live videos are in the reference files. Update the date when you do.
