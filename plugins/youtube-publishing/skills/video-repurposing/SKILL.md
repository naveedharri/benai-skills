---
name: video-repurposing
description: Turn long-form video into platform-ready clips - LinkedIn posts, TikTok/Reels, teasers, highlight reels - with word-level captions, using FFmpeg and Remotion. USE THIS SKILL WHEN the user wants to repurpose a YouTube video or any long video into social clips, mentions video, clip, footage, mp4, mov, or any video format, wants to cut, stitch, combine, or edit video files, needs captions, subtitles, or TikTok-style word highlighting, wants a teaser, trailer, or highlight reel, asks about video transcription or whisper, mentions FFmpeg, ffprobe, or Remotion errors, or has .mp4/.captions.json files or video folders. Runs a mandatory intake, proposes an edit plan with exact timestamps, previews in Remotion Studio, and renders only on approval.
---

# Video Repurposing

Turns long-form video into platform-ready clips with captions. FFmpeg for fast CLI operations, Remotion for styled compositions you can preview before rendering. Battle-tested on a real LinkedIn publishing pipeline; the rules below exist because breaking them produced visibly worse clips.

---

## Rules (Always Enforce)

**Opening Clip (CRITICAL):**
- The first clip is the hook - it must grab attention immediately
- Must start at the start of a complete sentence or idea with an explicit subject
- NEVER start with joining words ("But", "And", "So", "Now", "Then", "However")
- NEVER start with pronouns without context ("It", "This", "That", "They", "These", "There")
- NEVER start with filler, hedging, or weak openers ("I think", "You know", "Basically")
- Review the full transcript and deliberately select the strongest possible opening - a hook, an insight, a bold statement, or a compelling question

**Closing Clip (CRITICAL):**
- Must end at the natural conclusion of a thought - never trailing off, never a hard stop mid-idea
- Should leave the viewer with a takeaway, a call-to-action, or a sense of closure
- If the last word sounds like it leads into something else, keep going until it resolves
- Good endings: a summary statement, a strong opinion, a forward-looking insight
- Bad endings: trailing off, abrupt cuts, filler, unrelated tangents

**Clean Cut Points (every cut, no exceptions):**
- Cuts happen at a natural pause in the content - never mid-sentence, never mid-word
- Respect the idea, not just the words: a cut is clean when the speaker just finished a complete thought and there is a natural breath after the last word
- Every clip must be a complete, standalone thought with an explicit subject
- The stitched video must tell a coherent story, not feel like random fragments

**Editing modes - pick ONE in intake:**

1. **Hard-cut mode (DEFAULT for social clips: LinkedIn, TikTok, Reels).** No transitions. Ever. No fades on video or audio, no crossfades, no dissolves. Clip ends on one frame, the next begins on the very next frame. Audio starts and stops at full volume. Clean hard cuts read as confident and native on social feeds; fades read as template-ware. Build with plain `<Sequence>` blocks + `premountFor={60}` (see Composition Rules below). **Do not use `TransitionSeries`** - it has a null-props bug that crashes Studio in current Remotion versions.
2. **Crossfade mode (optional, for trailers/teasers/montages when the user explicitly wants blended transitions).** NEVER allow overlapping audio noise: cosine curves only (audio fade-out 1.5s, fade-in 1.2s, visual crossfade 1s), no fade-in on the first clip, no fade-out on the last. See [references/transitions.md](references/transitions.md) for the `createVolumeFn` pattern and the TransitionSeries bug workaround.

**Transcription-first timestamps (CRITICAL - the single source of truth):**
- All clip boundaries come from whisper word-level timestamps, never from scrubbing or guessing
- `startMs`/`endMs` = whisper timestamps of the first and last spoken words → these define the captions
- Audio/video cut points DERIVE from those: `audioEndMs = endMs + audioBufferMs` per clip. Whisper timestamps run ~200-700ms ahead of actual speech, so without the buffer the last word gets clipped
- Punctuation tokens (".", ",") have timestamps but are NOT spoken - never use them as `endMs`
- Captions are filtered by the raw transcript boundaries, NOT the buffered audio end, so words from the next sentence never flash on screen during the buffer zone
- Always verify by ear in Studio: the last word resolves fully, the next sentence doesn't bleed in
- Full pattern with code in [references/transcription.md](references/transcription.md)

**Source video prep (before anything else):**
- Check the codec with ffprobe. AV1 is too slow to decode in Remotion Studio (YouTube often serves AV1 by default) - always transcode to H.264
- `-movflags +faststart` is mandatory: without it the moov atom sits at the end of the file and Remotion reads the whole file before it can seek, making Studio crawl. Already-H.264 files remux losslessly: `ffmpeg -i in.mp4 -c copy -movflags +faststart out.mp4`
- Videos go DIRECTLY into `public/` with no spaces in filenames

**Workflow:**
- ALWAYS complete Phase 2 (Intake) before making any edits - never skip clarification questions
- ALWAYS propose an edit plan with exact timestamps and get user approval before executing
- ALWAYS preview in Remotion Studio before rendering
- ALWAYS run QA checks before showing the preview (see [references/qa-testing.md](references/qa-testing.md))
- NEVER render automatically - only when the user explicitly approves

---

## Brand kit (one-time, per user)

All styled output (captions, title cards, graphics) uses the user's brand, captured once in intake and reused forever:

| Setting | What to ask | Default if they have no preference |
|---|---|---|
| Colors | brand dark, background/light, 1-2 accents | dark `#0A0A14`, light `#F5F2EA`, accent `#B8E0B0` |
| Fonts | heading font (Google Fonts name) | Inter (via `@remotion/google-fonts`) |
| Caption style | frosted pill (default) or bold pill | frosted |
| Background rule | never pure `#000` black - use the brand dark | applies to everyone |

Store the answers in the Remotion project (a `BRAND` constant or `src/lib/brand.ts`) so every composition reads from one place. All code in the references uses example values - swap in the user's kit.

---

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
**Format & Duration:** Target duration? Output format (16:9, 9:16, 1:1)? Polish level?
**Editing mode:** Hard cuts (default for social) or crossfades (trailers/montages)?
**Brand kit:** Collect it if this is the first session (table above); otherwise reuse.
**Content:** Specific moments to include or exclude? Reveal the ending or create curiosity?

Then route: has copy → Phase 3A; no copy → Phase 3B.

### Phase 3A: COPY-FIRST (user has a script)

1. Download/copy video into `public/` (prep rules above: H.264 + faststart, no spaces)
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
2. Build/update the Remotion composition (conventions below)
3. Run QA ([references/qa-testing.md](references/qa-testing.md))
4. Preview in Studio (`npm run dev`) - show the user only after QA passes
5. Feedback → refine → loop. Users commonly adjust: clip selection, caption style, mode, duration, format

[references/intelligent-editing.md](references/intelligent-editing.md) has per-task-type questions and quality checks.

### Phase 5: RENDER

Only on explicit approval. Social-quality render:

```bash
npx remotion render CompositionName out/video.mp4 --video-bitrate 50M --audio-bitrate 320k
```

---

## Composition Rules

- One composition per project video, in `src/compositions/<platform>/`
- Clip config lives in a clearly marked `CONFIG` block at the top - the only place to edit. Document every timestamp with the actual spoken words as a comment
- Export duration as a constant; register every composition in `src/Root.tsx`

**The hard-cut pattern (default):**

```tsx
const CLIPS = [
  {
    label: 'Hook',
    startMs: 148_920,   // "The reason most automations fail..." (whisper timestamp of first word)
    endMs: 238_340,     // "...and that's what makes it work." (whisper timestamp of last spoken word)
    audioBufferMs: 200, // per-clip: small when the next sentence starts fast, up to 700 when there's a gap
  },
] as const;

const clips = CLIPS.map((c) => {
  const audioEndMs = c.endMs + c.audioBufferMs;
  return {...c, audioEndMs, startFrame: msToFrames(c.startMs), endFrame: msToFrames(audioEndMs),
          duration: msToFrames(audioEndMs - c.startMs)};
});

// premountFor={60} is MANDATORY on every Sequence - it preloads the next clip 2s early.
// Without it OffthreadVideo hasn't decoded the next clip's first frame and you get a black flash at the cut.
<Sequence from={0} durationInFrames={clips[0].duration} premountFor={60}>
  <OffthreadVideo src={staticFile('source_h264.mp4')} startFrom={clips[0].startFrame} endAt={clips[0].endFrame} />
</Sequence>
```

Total duration = sum of clip durations. No overlap, no subtraction.

**Captions:** never `import` the captions JSON (bloats the bundle, kills hot reload) - `fetch(staticFile(...))` with `delayRender`/`continueRender`, pre-filtered to clip ranges. Full pattern + the frosted-pill recipe: [references/captions.md](references/captions.md).

---

## Platform specs

| Platform | Resolution | FPS | Max duration | Notes |
|---|---|---|---|---|
| LinkedIn | 1920x1080 (16:9) | 30 | 10 min | H.264 MP4; native-feeling hard cuts |
| TikTok / Reels / Shorts | 1080x1920 (9:16) | 30 | 60-90s | word-highlight captions carry sound-off viewing |
| Square feed | 1080x1080 (1:1) | 30 | - | |

---

## Tool Selection

| Task | FFmpeg | Remotion |
|------|--------|----------|
| Stitching | Same codec, no styling | Anything styled or previewed |
| Captions | SRT burn-in | TikTok-style word highlighting |
| Teasers | Quick cuts | Text overlays, branded elements |

FFmpeg = fast CLI, batch, format conversion. Remotion = styled content, preview-before-render, React.

---

## Reference Files

Read as needed:

| File | Contents |
|------|----------|
| [references/intelligent-editing.md](references/intelligent-editing.md) | Editing workflow, questions by task type, quality checks |
| [references/video-analysis.md](references/video-analysis.md) | ffprobe analysis |
| [references/transcription.md](references/transcription.md) | Whisper transcription + the timestamp-drift/audioBufferMs pattern |
| [references/qa-testing.md](references/qa-testing.md) | QA tests before user preview |
| [references/stitching.md](references/stitching.md) | Combining clips (hard-cut default) |
| [references/transitions.md](references/transitions.md) | Crossfade mode + TransitionSeries bug workaround |
| [references/captions.md](references/captions.md) | Word-level captions, frosted pill style, async loading |
| [references/teasers.md](references/teasers.md) | 30-second teasers/trailers |
| [references/title-cards.md](references/title-cards.md) | Chapter headers, bumpers |
| [references/graphics-generation.md](references/graphics-generation.md) | Thumbnails, overlays, social graphics |
| [references/ffmpeg-basics.md](references/ffmpeg-basics.md) | FFmpeg patterns, faststart/moov, AV1 handling |
| [references/remotion-setup.md](references/remotion-setup.md) | Project setup |
| [references/remotion-tips.md](references/remotion-tips.md) | Animations, timing, springs |
| [references/reference-implementation.md](references/reference-implementation.md) | Complete working project code |

---

## Key Lessons (field-tested)

- **Transcription:** `@remotion/install-whisper-cpp`, NOT Python whisper (10x faster, Metal GPU). `base.en` for speed, `medium.en` for final quality. `whisperCppVersion: '1.5.5'` and `tokenLevelTimestamps: true` are required
- **Whisper drift:** timestamps run 200-700ms ahead of audio - per-clip `audioBufferMs` always, verify by ear
- **Black flash between clips** = missing `premountFor={60}`
- **Studio loading slowly** = moov atom at the end of the file - remux with `+faststart`
- **Studio crash on transitions** = `TransitionSeries` null-props bug - use plain `Sequence` hard cuts
- **Teasers:** 3-4 clips totaling 25-30s; 1.3x playback for energy (1.5x is too fast); first teaser clip must NOT overlap the intro start
- **Captions:** pill container behind text beats stroke/shadow for legibility on any footage; same colors on all clips so contrast normalizes
