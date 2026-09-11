# The Studio wizard

Reordered 2026-08-25. This walk now happens **before** chapters and the description exist.
The Details tab gets the title and the thumbnails only; the description is written later by
`youtube-description`, once the links are live and the chapters exist. Do not wait for a
description here, and do not paste a placeholder one.

The point of running the wizard early is that it is the only way to reach Unlisted, and
Unlisted is the only state in which YouTube generates the caption track that chapters need.

After Details is filled and the A/B test is armed, the draft still has to be walked through five
more tabs. All of it runs through Claude in Chrome; the tools are already loaded from
`references/studio-chrome.md`.

`read_page` after every Next. The tabs render lazily and clicking blind lands on the wrong control.

Order and outcome for each tab:

| Tab | Outcome |
|---|---|
| Monetization | Watch Page ads & YouTube Premium = **On** |
| Ad suitability | **None of the above** checked, rating submitted, reads "Safe for ads" |
| Video elements | One end-screen video element, over the **last few seconds only** |
| Initial check | All three checks read "No issues found" |
| Visibility | **Unlisted**, saved |

## Details: two steps that were missing from this file

Both observed in the 2026-08-26 walkthrough and both easy to skip.

- **Playlist.** Add the video to its playlist on the Details tab. On 2026-08-26 that was
  "Claude Cowork course". Ask which playlist rather than guessing; it changes by topic.
- **Made for kids: No.** Select "No, it's not made for kids". This is required and the wizard
  will not move on without it.

## Monetization

Default on a fresh draft is **Off**. Open the dropdown, select **On**, click **Done**, then **Next**.

Inside the dropdown, also check **Show mid-roll ads during my video**. Ben runs mid-rolls on
every tutorial. Observed in the 2026-08-25 walkthrough.

Confirm before moving on: the right-hand panel should list ad formats instead of "Location of ads:
None / Type of ads: None". If it still says None, the Done click did not land.

Selecting On adds an **Ad suitability** tab to the wizard that was not there before. That is expected.

## Ad suitability (irreversible)

Every category stays unrated. Scroll to the bottom of the list, check **None of the above**, then
click **Submit rating**.

**This cannot be undone.** YouTube states it plainly: once the rating is submitted the responses
cannot be changed. So this is a hard stop, not a soft one.

Before clicking Submit rating, show the user: the video title, that every category is unrated, and
that "None of the above" is checked. Wait for an explicit go. If any category genuinely applies to
the video, do not submit; hand it back to the user, because a wrong permanent rating costs more than
a delayed publish.

After submitting, confirm the panel reads **Safe for ads** and lists Ads, YouTube Premium and Other
YouTube revenue as eligible. Then **Next**.

## Video elements (end screen)

Subtitles need nothing. The end screen does.

**Default: "Choose specific video", matched to the video Ben points at on camera.** Corrected
2026-08-26. The earlier version of this file made "Best for viewer" the default, which is wrong:
in practice the end card is chosen deliberately every time, because Ben names a video in the
outro on nearly every upload.

Use "Best for viewer" only when the transcript genuinely names nothing and nobody picks one.

**When the obvious choice is a topic clash, ask rather than decide.** On 2026-08-26 the
candidates were a Second Brain video and "Claude Cowork + Obsidian Will Change How You Work
Forever". Both fit, and Ben had said elsewhere that Obsidian has real limitations, so the call
went to him in Slack rather than being made silently. Save something sensible, then ask.

Work out which video he means rather than guessing:
1. `youtube-chapters-tags` step 5 already scans the transcript for outbound video references and
   reports the timestamp and quote. Use that output.
2. If Ben names a topic but not a title, list the channel's recent uploads (the InnerTube recipe in
   `youtube-chapters-tags/references/chrome-transcript-extraction.md`) and match on topic.
3. Offer the user the 3 to 5 closest candidates with video IDs and let them pick. Do not choose
   silently, and do not fall back to the default without saying so.

If the transcript contains no video reference at all, say that plainly and use the default. That is
the common case: on the Composio video the audio ends on the accelerator CTA with no video named.

**Read the chosen video's title back before saving.** In the 2026-08-25 walkthrough the
first import landed on the wrong video and was only caught by looking at the card preview.
Say the title out loud to the operator and get a yes. The end card is the most-clicked
element on the watch page, so a wrong one is expensive and invisible.

> [!warning] Importing from a video gives the element the wrong duration
> This is the single most-missed defect in the wizard. "Import from video" copies the source
> video's element timing, which runs far too long. On 2026-08-26 the imported element ran
> **11:12 to 11:32, twenty seconds**, and Oskar's correction was that it should be "just the
> very last seconds". A card sitting on screen for twenty seconds covers the content.
>
> After importing, always drag the element's start as close to the end of the video as it will
> go. Then play the last few seconds back and confirm the card appears at the end rather than
> over the closing content.

Two more things to check before saving:
- The element's timecodes land inside the video's length.
- Only one video element exists. Importing on top of an existing element can leave duplicates.

Click **Save** inside the End Screens editor (not the wizard's Next) and wait for it to finish, then
**Next**.

Ignore the banner "End screen elements won't display on the watch page for private videos". It is
describing the current private state, not a failure.

## Initial check

Read-only. Confirm Copyright, Ad suitability and Community Guidelines all show "No issues found",
then **Next**.

If any check flags something, stop and report it verbatim. Do not proceed to Visibility with an open
flag.

## Visibility

Select **Unlisted**, then click **Save**.

Unlisted is the end state of **this skill**, because the rest of the chain needs a captioned,
non-public video to work on. It means the link works, the watch page is real, and nothing is
announced.

> [!important] Scheduling is now part of the process, at the very end
> Corrected 2026-08-26. The earlier version of this file said never to schedule. That is no
> longer true: on the handoff to [[Juan]], the last action after the description and tags are in
> is either Publish or Schedule, done deliberately by a person.
>
> Observed practice: schedule for the target morning, time **09:13**, timezone **GMT+1**. The
> target cadence is Tuesday, Thursday, Saturday.
>
> What has not changed is that **this skill never does it**. Stage 1 ends at Unlisted every
> time. Scheduling happens after stage 5, once the description, chapters, tags and end screen
> are all verified, and never as a way of skipping the rest of the chain.

Still true: never select **Public** at this point, and never touch **Set as instant Premiere**.
Ignore the "Peak time" suggestion and its Apply button here, because at this stage the video has
no description, no chapters and no tags.

Confirm the dialog closes and the row reads Unlisted before reporting done.

## When Visibility refuses to save

Expect this, it is the normal case on a fresh upload. YouTube shows:

> We're still checking your content. We recommend keeping your content private until checks
> complete, otherwise you may get a strike or have your visibility restricted.

That is YouTube's checks still running, not an error. Selecting Unlisted here can bounce back.

What to do: leave the video as-is, tell the operator plainly that Unlisted has to wait for
checks, and go run stages 2 and 3, which need nothing but the title. Come back and set
Unlisted afterwards. Do not sit in a polling loop, and do not select Private as a
workaround, because Private videos have no caption track either.

On the 2026-08-25 run the checks ran roughly as long as the upload processing did. A 13-minute
video was ready within the same session.
