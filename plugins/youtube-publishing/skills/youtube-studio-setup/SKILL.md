---
name: youtube-studio-setup
description: "Stage 1 of the Ben AI publishing chain. Takes a freshly uploaded video from Studio draft to a saved Unlisted video: puts the title and both thumbnails in place, arms the title-and-thumbnail A/B test, then walks the whole Studio wizard (monetization on with mid-rolls, ad suitability rated, end screen set, checks read, visibility Unlisted). Runs FIRST, before chapters, because a draft has no caption track and Unlisted is the only state where YouTube generates one. Use when someone says \"set up the video in Studio\", \"walk the publishing steps\", \"do the wizard\", \"get it to unlisted\", \"arm the A/B test\", \"set the end screen\", \"rate the ad suitability\", or has just uploaded a video and wants it ready for the rest of the chain."
disable-model-invocation: true
---

# YouTube Studio Setup

Stage 1. Ends with the video saved at **Unlisted**, which is what unlocks everything downstream.

Owns Studio only. Does not touch links, chapters, tags, or the description.

## Why this runs first

Found on 2026-08-25. A video sitting as a Studio draft has no caption track, so there is no
transcript, so `youtube-chapters-tags` has nothing to read. YouTube generates captions only
after the video is saved at a real visibility and its checks finish.

The old chain put chapters first and deadlocked on this. Walk the wizard first.

## Before you start

- The video must already be uploaded. If it is not, say so and stop; uploading is a person's
  job and takes two or three minutes.
- Confirm the video is Ben's: the watch-page fetch returns `author` and `channelId`, which
  must be `Ben AI` and `UC3KK7ENB_ierAXvrxVNnbZQ`. Refuse a video that reports public with a
  view count, because that is not a pre-publish draft.
- Load the browser tools per `references/studio-chrome.md`. Studio list pages do not render
  in the sandbox and YouTube is IP-blocked from it, so all of this runs in Chrome.

## Steps

```
Task Progress:
- [ ] 1. Title and thumbnails in place
- [ ] 2. A/B test armed (up to three variants)
- [ ] 3. Playlist set, Made for kids = No
- [ ] 4. Monetization on, mid-rolls on
- [ ] 5. Ad suitability rated          ← HUMAN CHECKPOINT, permanent
- [ ] 6. End screen set, title read back, duration shortened to the last few seconds
- [ ] 7. Checks read
- [ ] 8. Visibility Unlisted, saved
- [ ] 9. Video ID written to the Notion card
```

### 1. Title and thumbnails

Read the chosen titles and thumbnails off the Ship Brief. **The test takes up to three
variants**, and the team uses all three; the cards carry three for that reason.

If the thumbnails are not ready yet, put the title in and move on. Stage 2 derives the UTM code
from the title, so it is blocked without one, while the A/B test can be armed later.

If the operator has already uploaded them by hand, do not re-upload. Read back what is
actually in Studio and confirm it matches the Brief.

Thumbnail upload into the A/B test is unverified against Studio's hidden file input. A JS
fetch-and-drop fallback is written into `references/studio-chrome.md`. If the upload will not
land, say so and hand that one step to the operator rather than retrying blindly.

### 2. Arm the A/B test

Every title and thumbnail pair shown in place, in the order the Brief specified, then
**Set test**.

### 3 to 8. The wizard

Read `references/studio-wizard.md` and follow it tab by tab. It carries the exact outcome for
each tab, the irreversible stop, and the two failures that showed up on the 2026-08-25 run:
the end-screen import landing on the wrong video, and Visibility refusing to save while
YouTube's checks are still running.

`read_page` after every Next. The tabs render lazily and clicking blind lands on the wrong
control.

### 9. Write the Video ID to the card

The eleven-character ID, on the Notion card's `Video ID` property. Everything downstream reads
it from there. See `youtube-ship/references/notion-card.md`.

## The one human checkpoint here

**Before "Submit rating".** The ad-suitability rating is permanent; YouTube will not let it be
changed afterwards. Show the title, that every category is unrated, and that "None of the
above" is checked. Wait for an explicit go.

Ben's standing answer for a normal tutorial is None of the above. If any category genuinely
applies, do not submit. Hand it back, because a wrong permanent rating costs more than a
delayed publish.

## Hard rules

- **Visibility ends at Unlisted.** Never Public, never Premiere, never Schedule. Ignore the
  "Peak time" Apply button; it schedules the video.
- **Never select Private as a workaround** when Unlisted refuses to save. Private videos have
  no caption track either, so it does not unblock chapters.
- **Never read an ID off a screenshot.** Read it out of the page.
- **Shorten the end screen after importing.** "Import from video" copies the source video's
  timing and runs far too long. It must sit in the last few seconds only.
- **No terminal.** Everything here is browser work. Never hand the operator a shell command.

## What to do while checks run

Do not poll. Go run `benai-utm-creator` and `youtube-link-setup`, which need only the video's
exact title. Come back and set Unlisted when the checks clear.
