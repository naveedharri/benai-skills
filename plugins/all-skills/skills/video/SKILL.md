---
name: video
description: Edit, process, and render videos using FFmpeg and Remotion. Handles stitching, transitions, captions, teasers, and transcription. USE THIS SKILL WHEN user mentions video, clip, footage, mp4, mov, avi, mkv, or any video format, wants to combine, stitch, merge, or join video files, asks about transitions, fades, crossfades, or effects between clips, needs captions, subtitles, or TikTok-style word highlighting, wants a teaser, trailer, or highlight reel from longer video, mentions FFmpeg, ffprobe, Remotion, or related errors, asks about video transcription or whisper speech-to-text, asks about video duration, resolution, fps, or trimming, has .mp4, .mov, .captions.json files or video folders, or asks about thumbnails, overlays, title cards, or graphics for video.
---

# Video Editing Skill

Edits, processes, and renders videos using FFmpeg and Remotion.

---

## Intelligent Editing Workflow

This skill enables Claude to act as a smart video editor. Before executing commands:

1. **Analyze** - Examine videos (duration, resolution, audio) using ffprobe
2. **Transcribe** - Get speech content for smart cuts (if needed)
3. **Ask** - Clarify user intent and preferences
4. **Plan** - Propose edit approach for approval
5. **QA Test** - Run automated tests before user preview (see [references/qa-testing.md](references/qa-testing.md))
6. **Preview** - Only show to user after QA passes
7. **Iterate** - Refine based on feedback

See [references/intelligent-editing.md](references/intelligent-editing.md) for detailed workflow, questions to ask, and quality checks.

---

## Tool Selection

| Task | FFmpeg | Remotion |
|------|--------|----------|
| **Stitching** | Same codec, no effects | Transitions, overlays, programmatic |
| **Transitions** | Simple crossfades | Multiple types, custom timing |
| **Captions** | SRT burn-in | TikTok-style word highlighting |
| **Teasers** | Quick clips | Text overlays, branded elements |

**General guidance:**
- **FFmpeg**: Fast CLI operations, batch processing, format conversion
- **Remotion**: Styled content, animations, preview before render, React components

---

## Reference Files

Read these files as needed using the Read tool:

### Intelligence Layer
| File | Contents |
|------|----------|
| [references/intelligent-editing.md](references/intelligent-editing.md) | Smart editing workflow, questions, quality checks |
| [references/video-analysis.md](references/video-analysis.md) | Analyze videos with ffprobe |
| [references/transcription.md](references/transcription.md) | Whisper transcription for speech analysis |
| [references/qa-testing.md](references/qa-testing.md) | **QA tests before user preview** |

### Core Editing
| File | Contents |
|------|----------|
| [references/stitching.md](references/stitching.md) | Combine multiple clips into one video |
| [references/transitions.md](references/transitions.md) | Add fade, slide, wipe between clips |
| [references/captions.md](references/captions.md) | Add subtitles and TikTok-style captions |
| [references/teasers.md](references/teasers.md) | Create 30-second teasers/trailers |
| [references/title-cards.md](references/title-cards.md) | Add chapter headers, bumpers, section titles |
| [references/graphics-generation.md](references/graphics-generation.md) | Generate thumbnails, overlays, social graphics |

### Technical Reference
| File | Contents |
|------|----------|
| [references/ffmpeg-basics.md](references/ffmpeg-basics.md) | Common FFmpeg patterns and troubleshooting |
| [references/remotion-setup.md](references/remotion-setup.md) | Remotion project setup and workflow |
| [references/remotion-tips.md](references/remotion-tips.md) | Animations, timing, springs, sequences, and captions |
| [references/reference-implementation.md](references/reference-implementation.md) | **Complete working code to recreate the project** |

---

## Quick Start

### Transcription (Fast)
```bash
# 1. Setup whisper.cpp (one-time)
npx ts-node scripts/setup-whisper.ts

# 2. Transcribe all videos (GPU accelerated)
npx ts-node scripts/transcribe-fast.ts
```

### FFmpeg (CLI)
```bash
# Check installation
which ffmpeg || brew install ffmpeg

# Basic concat (same codec)
ffmpeg -f concat -safe 0 -i list.txt -c copy output.mp4

# Burn in subtitles
ffmpeg -i video.mp4 -vf "subtitles=captions.srt" output.mp4
```

### Remotion (React)
```bash
# Start preview (always do this first)
npm run dev

# Render (only when user requests)
npx remotion render CompositionName out/video.mp4
```

---

## Key Lessons Learned

### Transcription (IMPORTANT)
- **Use `@remotion/install-whisper-cpp`** - NOT Python whisper (10x faster with GPU)
- Use `base.en` model for speed, `medium.en` for final quality
- **Required parameter**: `whisperCppVersion: '1.5.5'` in transcribe() call
- Enable `tokenLevelTimestamps: true` for word-level captions
- Whisper.cpp uses Metal GPU on Mac - 8.5min video in ~85 seconds

### Teasers
- **Never start clips with**: "But", "And", "So", "Now", "It", "This", "That", "They"
- Each clip must have an **explicit subject** - not pronouns or references
- Aim for 3-4 clips totaling 25-30 seconds
- **Playback speed**: 1.3x for energy (1.5x is too fast)
- **Transitions**: Smooth fade (0.4s) between clips
- **First clip**: Must NOT overlap with intro start (avoid repetition)

### Captions
- **Active word**: Yellow `#FFD700`
- **Spoken words**: White `#FFFFFF`
- **Upcoming words**: Light gray `#E0E0E0`
- **Font**: Roboto at 48px for 1080p
- **Black stroke outline** (works on ANY background):
  ```css
  WebkitTextStroke: '3px black',
  paintOrder: 'stroke fill',
  textShadow: '0px 0px 4px rgba(0,0,0,1), 0px 0px 8px rgba(0,0,0,0.8)'
  ```

### Remotion Video Trimming
- Use `OffthreadVideo` component
- Set BOTH `startFrom` AND `endAt` props
- Convert ms to frames: `Math.round((ms / 1000) * fps)`

---

## Edge Cases & Gotchas

### File Naming
- Avoid spaces in video filenames: use `intro.mp4` not `Intro Video.mp4`
- Remotion Folder names can only contain letters, numbers, and hyphens

### Ports
- Remotion Studio may start on port 3001 if 3000 is in use

### Codec Mismatch
- FFmpeg concat demuxer (`-c copy`) fails silently with mismatched codecs
- Use `ffprobe` to check codecs before concatenating
- Use filter_complex for different codecs/resolutions

### Workflow
- **Always preview in Remotion Studio before rendering**
- Never render automatically - wait for user approval
- Copy videos to `public/` folder for Remotion projects
