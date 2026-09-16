---
name: yt-to-community
description: |
  Turn a YouTube video into a community announcement post draft in Ben's voice,
  with the thumbnail attached. Pulls the transcript, detects resources and lead
  magnets mentioned in the video, and outputs a Circle-ready draft.

  This is STEP 1 of the YouTube pipeline. Whenever a YouTube URL is shared with
  any repurposing intent (community post, course, or unspecified), run this skill
  first. Do not ask "post or course?" — the order is fixed. After the post is
  saved, this skill prompts the user about handing off to yt-to-course.

  USE THIS SKILL WHEN the user shares a YouTube link and wants a community post,
  course material, or any kind of repurpose. Triggers: "community post", "yt to
  community", "post this video", "announcement post", "YouTube resources post",
  "add this to the community", "course from this", "turn this into a course",
  or just a bare YouTube URL with minimal context like "post this".

  Do NOT skip this step to jump straight to yt-to-course.
disable-model-invocation: true
---

# YouTube to Community Announcement Post

Convert a YouTube video into a ready-to-publish announcement post for the Accelerator's community on Circle. Output is a draft, in Ben's voice, with thumbnail attached and any resources/lead magnets surfaced.

## Pipeline Position

This skill is **step 1 of 2** in the YouTube repurposing pipeline.

1. `yt-to-community` (this skill): community post + thumbnail. Runs automatically on any YouTube URL.
2. `yt-to-course`: course material. Runs only after the post is done and the user confirms.

When a YouTube URL lands in chat, do NOT ask "do you want a post or a course first?". The order is fixed: post first, then offer the course. The final step of this skill prompts the user about the course.

## Why This Exists

Every Ben AI YouTube video needs a paired announcement post in the community. The post follows a specific format and voice. Doing this manually means watching the video, noting resources, drafting copy, and posting. This skill produces the draft from just a URL.

## Profile boundary

All output writes to `Profiles/Milan/Community/community-posts/`. The thumbnail saves alongside as `{date}-{slug}-thumbnail.jpg`. Milan reviews the draft and publishes from Ben's Circle account manually. See [[yt-pipeline SPEC|SPEC.md]] for the full invariant.

## The Flow

### Step 1: Ingestion

Invoke the `yt-ingestion-agent` sub-agent with:
- youtube_url: the URL from the user's message
- output_dir: a working directory (default: `Profiles/Milan/Daily/{today}/yt-community-{video-id}/`)

For community posts we don't need the video file itself, just transcript + metadata + thumbnail. The agent fetches all three.

If transcript fetching fails (rare but possible), ask the user to paste the transcript or provide the video description.

### Step 2: Detect Resources and Lead Magnets

Scan the transcript for resource mentions:
- Tools named in the video (named software, websites, Chrome extensions)
- Lead magnets (free downloads, free templates, free skills, "link in description")
- Course references (existing accelerator courses)
- External URLs explicitly mentioned

Present the candidate resources to the user. Confirm which to include in the post.

### Step 3: Get the Video Title

The ingestion manifest includes the title from yt-dlp metadata. If missing, ask the user.

### Step 4: Draft the Post in Ben's Voice

**Voice calibration is non-optional.** The last time this skill ran without proper calibration, the output read like content-marketing copy instead of Ben. Read all five references below before drafting a single line.

1. `Context/brand.md`. the source of truth for Ben's public/marketing voice. Pay specific attention to:
   - **Voice DNA**: "the friend who failed first and figured it out"
   - **Three Voice Modes**: Vulnerable Teacher (40%), Strategic Authority (35%), Encouraging Coach (25%)
   - **Language Rules**: simple language, one-sentence paragraphs for emphasis, "Here's the thing", direct questions
   - **Signature Phrases**: "It's not rocket science", "Here's the thing:", "That's it.", "Keep going,"
   - **Sentence Rhythm**: long setup, short punch, short punch, medium bridge
   - **Red Flags of Inauthentic Replication**: guru energy, jargon, motivation without method, hiding the struggle
2. `Context/ben-voice.md`. how Ben *actually writes 1:1*, extracted from his real LinkedIn DMs. Community posts are not DMs, but they sit between marketing copy and DMs and they need to *feel* like Ben talking, not Ben performing. Steal these patterns:
   - **Loose, not polished.** "If a draft sounds polished, it is wrong." Punctuation can be loose. A typo or a stray capital ("I Appreciate") is fine if it reads natural.
   - **Direct, answer-first.** No long preambles before the point. Specifics over abstractions.
   - **Signature warmth phrases (sparingly):** "frankly", "to be honest", "genuinely appreciate", "glad to hear that you're", "very cool", "fantastic". Use 1, never 3.
   - **Hard nos**: no "circling back", "touching base", "leverage", "synergy", "ecosystem", no "I hope this finds you well", no fake humility, no performative gratitude.
   - Note: ben-voice.md says he never signs off in DMs. Community posts are different. they DO use "Keep going,\nBen". That sign-off is from brand.md and is correct for posts.
3. `Resources/frameworks/youtube-voice.md`. YouTube-specific tone.
4. `[[voice-rules]]`. announcement-post-specific rules (banned phrases, structure, examples).
5. `[[post-examples]]`. read at least 2 of the actual prior drafts referenced there. Match their cadence, length, and minimalism. They are the closest thing to ground truth.

Default post structure (use unless the video clearly calls for the minimal "title + URL + resource list" pattern that some recent posts follow):

```markdown
{Hook: the punchline of the video as one specific insight, not a summary}

{2 to 3 paragraphs explaining the framework or insight, with concrete examples from the video}

What you'll learn:
- {Specific outcome 1}
- {Specific outcome 2}
- {Specific outcome 3}

{Resource block: links to mentioned tools, skills, courses, lead magnets}

Watch the full video: {YouTube URL}

Keep going,
Ben
```

Voice rules (anything that violates these means the draft is wrong, rewrite before saving):
- First person, Ben writing from his own account. "I built this", "I'm using this", "we just shipped". Never "Ben" or "the creator".
- Lead with the specific insight. Never "Hey everyone", "Just dropped a new video", "Excited to share".
- Practitioner authority. He built the thing, used the thing, has the numbers. Not "this incredible resource will help you unlock...".
- Anti-fluff. If a sentence adds no value, delete it.
- No em dashes anywhere. Use commas, periods, line breaks.
- No banned vocab: "powerful", "comprehensive", "incredible", "ultimate", "game-changing", "unlock", "leverage", "harness", "supercharge", "in this video we explore".
- No exclamation points in body copy.
- No emojis unless the user asks.
- Sign-off: "Keep going,\nBen" on two lines.

**Sniff test before saving:** read the draft out loud. If it sounds like a confident practitioner talking to peers in his accelerator, it's right. If it sounds like a brand reply, a polished email, or a launch announcement from a marketing team, it's wrong. rewrite.

### Step 5: Save the Draft

Save two files in `Profiles/Milan/Community/community-posts/`:

- `{date}-{slug}.md`: the post body in markdown
- `{date}-{slug}-thumbnail.jpg`: copy of the thumbnail from ingestion

Both use the same slug, derived from the video title (lowercase, hyphenated, drop articles).

Add frontmatter to the markdown file:

```yaml
---
type: community-post
profile: Milan
status: draft
source: {youtube_url}
date: {date}
tags: [community-post, youtube-announcement, draft]
---
```

### Step 6: Surface to User

Tell the user the draft is ready, show the path, and remind them they publish from Ben's Circle account manually.

### Step 7: Log to community-log.md

Append to `Profiles/Milan/Community/community-log.md`:

```
- {date} | YouTube Resources + Discussions | "{Title}" | Source: {URL} | Resources: {yes/no, with list} | Status: draft | Draft: [[Community/community-posts/{date}-{slug}|{slug}]]
```

### Step 8: Hand off to yt-to-course

After the post draft and thumbnail are saved and the log is updated, always ask the user this exact question:

> "Post draft is ready. Want me to turn this video into course material now (yt-to-course)?"

If yes: invoke the `yt-to-course` skill, passing the same YouTube URL, the ingestion manifest from Step 1 (so the transcript, word timings, and video file are reused, not re-pulled), and the saved thumbnail path.

If no: stop here. The pipeline is complete for this video.

Never skip this question and never invert the order. The community post always lands first; the course is the optional second leg. Asking once at the end is how the user keeps the option open without being forced into a long flow they don't want today.

## Edge Cases

- **Transcript blocked**: ask user to paste manually.
- **No clear hook in transcript**: surface 2-3 candidate hooks to the user, let them pick.
- **Resources unclear**: skip resource block, focus on the insight + URL + sign-off.
- **Thumbnail fetch fails**: save the post draft anyway, surface the missing thumbnail as a flag.

## What This Skill Does NOT Do

- **Auto-publish**: outputs are drafts. Milan reviews and publishes from Ben's Circle profile.
- **Course material**: use [[yt-to-course]] for that.
- **Cross-platform repurposing**: this is Circle community only. LinkedIn/Twitter use other skills.
