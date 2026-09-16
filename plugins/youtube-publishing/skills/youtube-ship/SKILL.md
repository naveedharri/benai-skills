---
name: youtube-ship
description: Runs the whole Ben AI YouTube publishing chain for one video, in the right order, and reports where the video already is before doing anything. Walks the Studio wizard to Unlisted first, then UTM links, Bitly import, chapters and tags, and the description. Collects every judgment call once in a Ship Brief up front so the mechanical work runs without stopping. Use whenever someone says "ship this video", "publish prep", "run the publishing process", "get this video ready", "youtube ship", "prep the video for tomorrow", or names a video in the Youtube tutorial Pipeline that has finished editing. Also use when only one stage is wanted, and route to that stage.
disable-model-invocation: true
---

# YouTube Ship

One video, five stages, four human checkpoints. Ends at an armed Unlisted draft.
A person clicks Publish. This skill never does.

## Before anything: report state, do not act

State lives on the video's Notion card, never in chat. That is what makes any stage
runnable standalone, days apart, and resumable after a dead session.

Read the card first and say out loud which stages are already done. See
`references/notion-card.md` for the database, the properties and the reading rules.

The short version of the reading rules:

| Property | Empty means |
|---|---|
| `Video ID` | nothing has run; you do not even have a video |
| `UTM code` | stage 2 has not run |
| `Bitly imported` unchecked | the links are not live, so do not write a description full of dead links |
| `Chapters` | stage 4 has not run |

## Stage 0: the Ship Brief

Collect every judgment call in one approval, before any stage runs. Read
`references/ship-brief.md` for the full list and the wording to use.

If a new question comes up mid-run, that question belonged in the Brief. Add it there
rather than asking it twice.

## The chain, in this order

```
1. youtube-studio-setup   →  video saved at Unlisted, wizard walked
2. benai-utm-creator      →  six UTM links, five-letter code, Bitly CSV
3. youtube-link-setup     →  links live on c.benai.co
4. youtube-chapters-tags  →  chapters and tags
5. youtube-description    →  description assembled and written into the draft
```

### Why stage 1 is first

Measured on 2026-08-25 during the Juan walkthrough. A video sitting as a Studio draft has
no caption track, so there is no transcript, so there are no chapters. YouTube generates
captions only after the video is saved at a real visibility and its checks finish.

The old order put chapters first and deadlocked: chapters needed a transcript, the
transcript needed Unlisted, and Unlisted was the last step of the old stage 4.

So: walk the wizard first. Land at Unlisted. Then chapters become possible.

### What to do while YouTube processes

Stages 2 and 3 need only the video's exact title. Run them during processing rather than
waiting. By the time captions appear, the links are already live.

Do not sit and poll YouTube in a loop. Do the link work, then check once.

## Human checkpoints: four, and only four

1. **The Ship Brief**, stage 0. Everything judgment-based, approved once.
2. **Before "Submit rating"**, stage 1. The ad-suitability rating is permanent. YouTube
   will not let it be changed afterwards.
3. **Before the Bitly import**, stage 3. Links are awkward to unpick and the monthly
   quota is finite.
4. **Before writing the description into Studio**, stage 5. Last look at the whole block
   with the real links and chapters in it.

Note this differs from the pre-2026-08-25 list. "Before Set test" is gone as a separate
stop, because titles and thumbnails now go in during stage 1 where the operator is
already looking at both in place.

## Hard rules, each one from a real failure

- **Confirm the video is Ben's before reading a word of it.** The watch-page fetch returns
  `author` and `channelId`. They must be `Ben AI` and `UC3KK7ENB_ierAXvrxVNnbZQ`. A video
  that reports public and carries a view count is not a pre-publish draft, so refuse it.
  On 2026-08-25 a card's title link pointed at a published Brock Mesarich video with
  78,923 views that somebody had dropped in as a title reference.
- **Never build the description by pasting a previous video's.** That is how the old
  five-letter code ships. Build from the template.
- **Never carry the previous video's 📺 links forward silently.** If Ben names no video in
  the audio, ask. If nobody picks one, leave the block out.
- **Never read an ID off a screenshot.** A transcribed channel ID once silently returned
  nothing on every API call.
- **Never rename a Bitly backhalf that is already live.** It breaks the link everywhere it
  has already been published. When a suffix convention changes, it changes for new videos
  only. The Cowork suffix moved from `-cowork` to `-os` on 2026-08-26 on exactly this basis.
- **The chain ends at Unlisted; a person publishes or schedules afterwards.** Corrected
  2026-08-26. Scheduling is now real practice, done deliberately as the last action once the
  description, chapters, tags and end screen are all verified. Observed setting: the target
  morning at 09:13 GMT+1, on a Tuesday / Thursday / Saturday cadence. No skill in this chain
  ever sets it, and nothing here may use Schedule as a way of skipping a stage.
- **No terminal.** Nobody running this chain should be asked to type a shell command. If a
  step seems to need one, the skill runs it internally or the step moves to the browser.

## Environment constraints

- YouTube is IP-blocked from the sandbox. Every YouTube read goes through Claude in Chrome.
  `youtube-transcript-api` and `curl` both fail; do not retry them.
- Fetching a caption track's `baseUrl` out of `captionTracks` is blocked, because the URL
  carries session tokens. Use the transcript panel in the DOM instead.
- `benai.kit.com` returns 403 to the sandbox, browser user-agent included. That is Kit
  blocking the datacenter IP, not a broken page.
- Kit landing pages cannot be built through the Kit MCP. Every Ben AI page is
  `editor_version: v1`, which the API cannot edit.
- Bitly runs on account `ben@benai.co`, group `Bp46bK7ywPJ`, short domain `c.benai.co`.
