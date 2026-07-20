---
name: video-repurposing
description: Turn long-form video into platform-ready clips - LinkedIn posts, TikTok/Reels, teasers, highlight reels - with word-level captions, using FFmpeg and Remotion. USE THIS SKILL WHEN the user wants to repurpose a YouTube video or any long video into social clips, mentions video, clip, footage, mp4, mov, or any video format, wants to cut, stitch, combine, or edit video files, needs captions, subtitles, or TikTok-style word highlighting, wants a teaser, trailer, or highlight reel, asks about video transcription or whisper, mentions FFmpeg, ffprobe, or Remotion errors, or has .mp4/.captions.json files or video folders. Runs a mandatory intake, proposes an edit plan with exact timestamps, previews in Remotion Studio, and renders only on approval.
disable-model-invocation: true
---

# Video Repurposing

Turns long-form video into platform-ready clips with captions. FFmpeg = fast CLI, batch, format conversion. Remotion = styled content you preview before rendering.

## Non-negotiable rules

- ALWAYS complete Phase 2 (Intake) before editing. Never skip the clarification questions.
- ALWAYS propose an edit plan with exact timestamps and the spoken words at each boundary, and get user approval before executing.
- ALWAYS run QA ([references/qa-testing.md](references/qa-testing.md)) before showing a preview.
- ALWAYS preview in Remotion Studio before rendering.
- NEVER render automatically. Render only on explicit user approval.
- Hard cuts are the DEFAULT for social clips (LinkedIn, TikTok, Reels): no transitions, fades, or dissolves. Use crossfades only when the user explicitly asks (trailers/teasers/montages). Never use `TransitionSeries` (null-props crash bug); build with plain `<Sequence>` + `premountFor={60}`.
- All clip boundaries come from whisper word-level timestamps, never scrubbing or guessing.

Where the craft lives: opening hook, closing, clean cut points, story flow → [references/intelligent-editing.md](references/intelligent-editing.md). Timestamp drift and per-clip `audioBufferMs` → [references/transcription.md](references/transcription.md). Source video prep (H.264 + faststart, no spaces) → [references/ffmpeg-basics.md](references/ffmpeg-basics.md). Hard-cut composition pattern → [references/stitching.md](references/stitching.md). Crossfade mode → [references/transitions.md](references/transitions.md).

## Workflow: 5 Phases

```
Phase 1: SETUP ──→ Phase 2: INTAKE ──→ Phase 3: EDIT PATH ──→ Phase 4: ITERATE ──→ Phase 5: RENDER
(one-time)         (mandatory)          (copy-first OR          (feedback loop)      (user approves)
                                         video-first)
```

### Phase 1: SETUP (one-time)

If a Remotion project already exists, skip to Phase 2.

1. Check prerequisites: `which ffmpeg || brew install ffmpeg`; Node 18+
2. Create the Remotion project per [references/remotion-setup.md](references/remotion-setup.md) (Remotion `^4.0.242`, React `^18.x`). Complete working code: [references/reference-implementation.md](references/reference-implementation.md)
3. Set up whisper: copy `scripts/setup-whisper.ts` and `scripts/transcribe.ts` from THIS SKILL's `scripts/` folder into the project's `scripts/`, then run `npx ts-node scripts/setup-whisper.ts` (installs whisper.cpp + base.en model into `.whisper/`, GPU-accelerated)

### Phase 2: INTAKE (mandatory - never skip)

Ask before any editing. Do not proceed without clear answers.

**Intent & Goal:** What's the goal (LinkedIn clip, teaser/trailer, highlight reel, full edit, another platform)? Who is the audience?
**Video Source:** Where is the video (YouTube URL, local file, folder of clips)? Existing copy/script, or discover from the video?
**Format & Duration:** Target duration? Output format (16:9, 9:16, 1:1)? Polish level? Specs per platform: [references/platform-specs.md](references/platform-specs.md)
**Editing mode:** Hard cuts (default for social) or crossfades (trailers/montages)?
**Brand kit:** Collect it if this is the first session, otherwise reuse: [references/brand-kit.md](references/brand-kit.md)
**Content:** Specific moments to include or exclude? Reveal the ending or create curiosity?

Then route: has copy → Phase 3A; no copy → Phase 3B.

### Phase 3A: COPY-FIRST (user has a script)

1. Download/copy video into `public/` (prep rules: [references/ffmpeg-basics.md](references/ffmpeg-basics.md))
2. Analyze with ffprobe ([references/video-analysis.md](references/video-analysis.md))
3. Transcribe: `npx ts-node scripts/transcribe.ts` ([references/transcription.md](references/transcription.md))
4. Map script sections to transcript timestamps
5. Propose cuts aligned to the copy - exact timestamps, the spoken words at each boundary, and reasoning
6. User approves before any editing

### Phase 3B: VIDEO-FIRST (no script - discover the story)

1-3. Same prep as 3A
4. Analyze the transcript: hooks, insights, quotable complete thoughts
5. Suggest narrative structure per the goal; create copy/captions from selected segments
6. Propose the edit plan - clips, timestamps, spoken words at boundaries, reasoning
7. User approves before any editing

### Phase 4: PROPOSE, PREVIEW & ITERATE (loop)

1. Present edit plan → get approval
2. Build/update the Remotion composition: hard-cut pattern in [references/stitching.md](references/stitching.md), captions in [references/captions.md](references/captions.md)
3. Run QA ([references/qa-testing.md](references/qa-testing.md))
4. Preview in Studio (`npm run dev`) - show the user only after QA passes
5. Feedback → refine → loop. Users commonly adjust: clip selection, caption style, mode, duration, format

[references/intelligent-editing.md](references/intelligent-editing.md) has per-task-type questions and quality checks.

### Phase 5: RENDER

Only on explicit approval. Render command and per-platform specs: [references/platform-specs.md](references/platform-specs.md).

---

## Reference Files

Read the ONE file a step points to, when that step runs. Do not read them all up front.

| File | Contents |
|------|----------|
| [references/intelligent-editing.md](references/intelligent-editing.md) | Editing craft: opening/closing/clean cuts, questions by task type, quality checks |
| [references/brand-kit.md](references/brand-kit.md) | One-time brand kit (colors, fonts, caption style) |
| [references/platform-specs.md](references/platform-specs.md) | Resolution/fps/duration per platform, render command |
| [references/video-analysis.md](references/video-analysis.md) | ffprobe analysis |
| [references/transcription.md](references/transcription.md) | Whisper transcription + the timestamp-drift/audioBufferMs pattern |
| [references/qa-testing.md](references/qa-testing.md) | QA tests before user preview |
| [references/stitching.md](references/stitching.md) | Combining clips (hard-cut default) |
| [references/transitions.md](references/transitions.md) | Crossfade mode + TransitionSeries bug workaround |
| [references/captions.md](references/captions.md) | Word-level captions, frosted pill style, async loading |
| [references/teasers.md](references/teasers.md) | 30-second teasers/trailers |
| [references/title-cards.md](references/title-cards.md) | Chapter headers, bumpers |
| [references/graphics-generation.md](references/graphics-generation.md) | Thumbnails, overlays, social graphics |
| [references/ffmpeg-basics.md](references/ffmpeg-basics.md) | FFmpeg patterns, faststart/moov, AV1 handling, source prep |
| [references/remotion-setup.md](references/remotion-setup.md) | Project setup |
| [references/remotion-tips.md](references/remotion-tips.md) | Animations, timing, springs |
| [references/reference-implementation.md](references/reference-implementation.md) | Complete working project code |

---

## Self-improvement

This skill is never finished. Improve it as you use it.
- When the user corrects how a step was done, update the relevant reference file (or this SKILL.md) so the correction sticks. Do not just fix it for this run.
- When a correction is a hard rule ("always X", "never Y"), add it to the Non-negotiable rules above.
- When the user says a clip or edit was genuinely good, save its `CLIPS` config + reasoning to `references/examples/` so it becomes a model for future runs.
- Keep the skill small: when you add something, run the deletion test and cut anything that no longer changes behavior.
