---
name: reference-implementation
description: Complete working code for the video editor - use this to recreate the project
metadata:
  tags: video, implementation, code, remotion, reference
---

# Reference Implementation

Complete working code to recreate the video editor from scratch. Copy these files to build a fully functional video editing project.

---

## Project Structure

```
video-editor/
├── package.json
├── tsconfig.json
├── remotion.config.ts
├── .whisper/                       # Whisper.cpp installation (auto-generated)
│   ├── main                        # whisper.cpp binary
│   └── ggml-base.en.bin           # Model file
├── src/
│   ├── index.ts                    # Entry point
│   ├── Root.tsx                    # Composition registration
│   └── compositions/
│       ├── FinalVideo.tsx          # Full video with teaser + captions
│       └── TeaserOnly.tsx          # Standalone teaser
├── public/
│   ├── intro.mp4                   # Video files (or symlinks)
│   ├── part1.mp4
│   ├── part2.mp4
│   ├── part3.mp4
│   ├── intro.captions.json         # Word-level caption files
│   ├── part1.captions.json
│   ├── part2.captions.json
│   └── part3.captions.json
└── scripts/
    ├── setup-whisper.ts            # One-time whisper.cpp setup
    ├── transcribe-fast.ts          # Fast GPU transcription
    └── convert-captions.js         # Convert Python whisper output
```

---

## 1. package.json

```json
{
  "name": "video-editor",
  "version": "1.0.0",
  "scripts": {
    "dev": "remotion studio",
    "build": "remotion bundle",
    "render": "remotion render"
  },
  "dependencies": {
    "@remotion/bundler": "^4.0.0",
    "@remotion/captions": "^4.0.0",
    "@remotion/cli": "^4.0.0",
    "@remotion/media": "^4.0.0",
    "@remotion/transitions": "^4.0.0",
    "@remotion/install-whisper-cpp": "^4.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "remotion": "^4.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "typescript": "^5.0.0"
  }
}
```

---

## 2. Root.tsx

```tsx
import { Composition, Folder } from "remotion";
import { FinalVideo, FINAL_VIDEO_DURATION } from "./compositions/FinalVideo";

// YouTube horizontal video settings
const YOUTUBE_FPS = 30;
const YOUTUBE_WIDTH = 1920;
const YOUTUBE_HEIGHT = 1080;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="VideoSkills">
        <Composition
          id="FinalVideo"
          component={FinalVideo}
          durationInFrames={FINAL_VIDEO_DURATION}
          fps={YOUTUBE_FPS}
          width={YOUTUBE_WIDTH}
          height={YOUTUBE_HEIGHT}
        />
      </Folder>
    </>
  );
};
```

---

## 3. FinalVideo.tsx (Complete Implementation)

```tsx
import {
  AbsoluteFill,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  continueRender,
  delayRender,
  interpolate,
  OffthreadVideo,
} from 'remotion';
import {Video} from '@remotion/media';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import React, {useMemo, useState, useEffect} from 'react';
import {createTikTokStyleCaptions} from '@remotion/captions';
import type {TikTokPage, Caption} from '@remotion/captions';

// =============================================================================
// CONFIGURATION
// =============================================================================

// Teaser settings
const TEASER_PLAYBACK_RATE = 1.3; // 1.3x speed (1.5x is too fast)
const TEASER_TRANSITION_FRAMES = 12; // 0.4s fade between clips

// Caption settings
const SWITCH_CAPTIONS_EVERY_MS = 1200;
const CAPTION_COLORS = {
  active: '#FFD700',     // Yellow - currently speaking word
  spoken: '#FFFFFF',     // White - already spoken words
  upcoming: '#B0B0B0',   // Gray - words not yet spoken
};

// Video durations at 30fps (update these based on your videos)
const VIDEO_DURATIONS = {
  intro: 2004,   // 66.8s
  part1: 7050,   // 235.0s
  part2: 8079,   // 269.3s
  part3: 15180,  // 506.0s
};

// =============================================================================
// TEASER CLIPS
// =============================================================================
// IMPORTANT: Select standalone sentences from transcript
// - Must NOT start with: But, And, So, Now, It, This, That, They
// - Must have explicit subject
// - First clip must NOT overlap with intro start

interface TeaserClip {
  src: string;
  captionsFile: string;
  startMs: number;
  endMs: number;
}

const TEASER_CLIPS: TeaserClip[] = [
  // Update these based on your transcript analysis
  {src: 'part3.mp4', captionsFile: 'part3.captions.json', startMs: 69700, endMs: 76000},
  {src: 'part3.mp4', captionsFile: 'part3.captions.json', startMs: 336370, endMs: 344840},
  {src: 'part3.mp4', captionsFile: 'part3.captions.json', startMs: 142100, endMs: 148560},
  {src: 'part3.mp4', captionsFile: 'part3.captions.json', startMs: 393070, endMs: 397700},
];

// Calculate teaser duration (speed-adjusted with transition overlaps)
const TEASER_DURATION_FRAMES = Math.round(
  (TEASER_CLIPS.reduce((total, clip) => total + (clip.endMs - clip.startMs), 0) / 1000 * 30) / TEASER_PLAYBACK_RATE
) - (TEASER_TRANSITION_FRAMES * (TEASER_CLIPS.length - 1));

// =============================================================================
// CAPTION PAGE COMPONENT
// =============================================================================

const CaptionPage: React.FC<{page: TikTokPage; offsetMs: number}> = ({page, offsetMs}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const currentTimeMs = (frame / fps) * 1000;
  const absoluteTimeMs = page.startMs + currentTimeMs - offsetMs;

  // Smooth fade in/out (0.2s)
  const fadeFrames = Math.round(0.2 * fps);
  const captionOpacity = interpolate(
    frame,
    [0, fadeFrames, durationInFrames - fadeFrames, durationInFrames],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 150,
        opacity: captionOpacity,
      }}
    >
      <div
        style={{
          fontSize: 48,
          fontWeight: 700,
          fontFamily: 'Roboto, -apple-system, Arial, sans-serif',
          textAlign: 'center',
          maxWidth: '80%',
          lineHeight: 1.4,
          letterSpacing: '0.02em',
          textShadow: `
            2px 2px 0px rgba(0, 0, 0, 0.95),
            -2px -2px 0px rgba(0, 0, 0, 0.95),
            2px -2px 0px rgba(0, 0, 0, 0.95),
            -2px 2px 0px rgba(0, 0, 0, 0.95),
            0px 4px 8px rgba(0, 0, 0, 0.6)
          `,
        }}
      >
        {page.tokens.map((token, i) => {
          const isActive = token.fromMs <= absoluteTimeMs && token.toMs > absoluteTimeMs;
          const isSpoken = token.toMs <= absoluteTimeMs;

          let color = CAPTION_COLORS.upcoming;
          if (isActive) color = CAPTION_COLORS.active;
          else if (isSpoken) color = CAPTION_COLORS.spoken;

          return (
            <span key={i} style={{color, display: 'inline'}}>
              {token.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// =============================================================================
// VIDEO WITH CAPTIONS COMPONENT (for main content)
// =============================================================================

const VideoWithCaptions: React.FC<{
  src: string;
  captionsFile: string;
  offsetMs: number;
}> = ({src, captionsFile, offsetMs}) => {
  const {fps} = useVideoConfig();
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [handle] = useState(() => delayRender());

  useEffect(() => {
    fetch(staticFile(captionsFile))
      .then((res) => res.json())
      .then((data) => {
        setCaptions(data);
        continueRender(handle);
      })
      .catch((err) => {
        console.error('Failed to load captions:', err);
        continueRender(handle);
      });
  }, [captionsFile, handle]);

  const {pages} = useMemo(() => {
    if (captions.length === 0) return {pages: []};
    return createTikTokStyleCaptions({
      captions,
      combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
    });
  }, [captions]);

  return (
    <AbsoluteFill>
      <Video src={staticFile(src)} />
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const startFrame = Math.round((page.startMs / 1000) * fps);
        const endFrame = Math.min(
          nextPage ? Math.round((nextPage.startMs / 1000) * fps) : Infinity,
          startFrame + Math.round((SWITCH_CAPTIONS_EVERY_MS / 1000) * fps),
        );
        const durationInFrames = endFrame - startFrame;

        if (durationInFrames <= 0) return null;

        return (
          <Sequence
            key={index}
            from={startFrame}
            durationInFrames={durationInFrames}
            layout="none"
          >
            <CaptionPage page={page} offsetMs={offsetMs} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// =============================================================================
// TEASER CLIP COMPONENT (with speed adjustment)
// =============================================================================

const TeaserClipComponent: React.FC<{
  src: string;
  captionsFile: string;
  startMs: number;
  endMs: number;
}> = ({src, captionsFile, startMs, endMs}) => {
  const {fps} = useVideoConfig();
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [handle] = useState(() => delayRender());

  const startFrame = Math.round((startMs / 1000) * fps);
  const endFrame = Math.round((endMs / 1000) * fps);

  // Load and filter captions, adjust timing for playback speed
  useEffect(() => {
    fetch(staticFile(captionsFile))
      .then((res) => res.json())
      .then((allCaptions: Caption[]) => {
        const filtered = allCaptions
          .filter((cap) => cap.startMs >= startMs && cap.endMs <= endMs)
          .map((cap) => ({
            ...cap,
            startMs: (cap.startMs - startMs) / TEASER_PLAYBACK_RATE,
            endMs: (cap.endMs - startMs) / TEASER_PLAYBACK_RATE,
            timestampMs: (cap.timestampMs - startMs) / TEASER_PLAYBACK_RATE,
          }));
        setCaptions(filtered);
        continueRender(handle);
      })
      .catch((err) => {
        console.error('Failed to load teaser captions:', err);
        continueRender(handle);
      });
  }, [captionsFile, startMs, endMs, handle]);

  const {pages} = useMemo(() => {
    if (captions.length === 0) return {pages: []};
    return createTikTokStyleCaptions({
      captions,
      combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS / TEASER_PLAYBACK_RATE,
    });
  }, [captions]);

  return (
    <AbsoluteFill>
      <OffthreadVideo
        src={staticFile(src)}
        startFrom={startFrame}
        endAt={endFrame}
        playbackRate={TEASER_PLAYBACK_RATE}
      />
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const pageStartFrame = Math.round((page.startMs / 1000) * fps);
        const pageEndFrame = Math.min(
          nextPage ? Math.round((nextPage.startMs / 1000) * fps) : Infinity,
          pageStartFrame + Math.round((SWITCH_CAPTIONS_EVERY_MS / TEASER_PLAYBACK_RATE / 1000) * fps),
        );
        const pageDuration = pageEndFrame - pageStartFrame;

        if (pageDuration <= 0) return null;

        return (
          <Sequence
            key={index}
            from={pageStartFrame}
            durationInFrames={pageDuration}
            layout="none"
          >
            <CaptionPage page={page} offsetMs={0} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// =============================================================================
// TEASER SECTION (with transitions)
// =============================================================================

const TeaserSection: React.FC = () => {
  const {fps, durationInFrames} = useVideoConfig();
  const frame = useCurrentFrame();

  const clips = TEASER_CLIPS.map((clip) => {
    const durationMs = clip.endMs - clip.startMs;
    const durationFrames = Math.round((durationMs / 1000) * fps / TEASER_PLAYBACK_RATE);
    return {...clip, durationFrames};
  });

  // Fade out at end before main content
  const fadeOutFrames = Math.round(0.5 * fps);
  const teaserOpacity = interpolate(
    frame,
    [durationInFrames - fadeOutFrames, durationInFrames],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      <AbsoluteFill style={{opacity: teaserOpacity}}>
        <TransitionSeries>
          {clips.map((clip, index) => (
            <React.Fragment key={index}>
              <TransitionSeries.Sequence durationInFrames={clip.durationFrames}>
                <TeaserClipComponent
                  src={clip.src}
                  captionsFile={clip.captionsFile}
                  startMs={clip.startMs}
                  endMs={clip.endMs}
                />
              </TransitionSeries.Sequence>
              {index < clips.length - 1 && (
                <TransitionSeries.Transition
                  presentation={fade()}
                  timing={linearTiming({durationInFrames: TEASER_TRANSITION_FRAMES})}
                />
              )}
            </React.Fragment>
          ))}
        </TransitionSeries>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// =============================================================================
// FINAL VIDEO (main export)
// =============================================================================

interface VideoSegment {
  name: string;
  src: string;
  captionsFile: string;
  duration: number;
  startFrame: number;
}

export const FinalVideo: React.FC = () => {
  const segments: VideoSegment[] = useMemo(() => {
    let currentFrame = TEASER_DURATION_FRAMES;
    return [
      {name: 'intro', src: 'intro.mp4', captionsFile: 'intro.captions.json', duration: VIDEO_DURATIONS.intro, startFrame: currentFrame},
      {name: 'part1', src: 'part1.mp4', captionsFile: 'part1.captions.json', duration: VIDEO_DURATIONS.part1, startFrame: (currentFrame += VIDEO_DURATIONS.intro)},
      {name: 'part2', src: 'part2.mp4', captionsFile: 'part2.captions.json', duration: VIDEO_DURATIONS.part2, startFrame: (currentFrame += VIDEO_DURATIONS.part1)},
      {name: 'part3', src: 'part3.mp4', captionsFile: 'part3.captions.json', duration: VIDEO_DURATIONS.part3, startFrame: (currentFrame += VIDEO_DURATIONS.part2)},
    ];
  }, []);

  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      {/* TEASER */}
      <Sequence from={0} durationInFrames={TEASER_DURATION_FRAMES}>
        <TeaserSection />
      </Sequence>

      {/* MAIN CONTENT */}
      {segments.map((segment) => (
        <Sequence
          key={segment.name}
          from={segment.startFrame}
          durationInFrames={segment.duration}
        >
          <VideoWithCaptions
            src={segment.src}
            captionsFile={segment.captionsFile}
            offsetMs={0}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const FINAL_VIDEO_DURATION =
  TEASER_DURATION_FRAMES +
  VIDEO_DURATIONS.intro +
  VIDEO_DURATIONS.part1 +
  VIDEO_DURATIONS.part2 +
  VIDEO_DURATIONS.part3;
```

---

## 4. Whisper Setup (One-Time)

**IMPORTANT:** Use `@remotion/install-whisper-cpp` (C++ with GPU) NOT Python whisper (10x slower).

### Install Whisper-cpp Binary and Model

```ts
// scripts/setup-whisper.ts
import { installWhisperCpp, downloadWhisperModel } from '@remotion/install-whisper-cpp';
import path from 'path';

async function setup() {
  const whisperPath = path.join(process.cwd(), '.whisper');

  console.log('Installing whisper.cpp (with Metal GPU support on Mac)...');
  await installWhisperCpp({
    to: whisperPath,
    version: '1.5.5',
  });

  console.log('Downloading base.en model (fast + good quality)...');
  await downloadWhisperModel({
    model: 'base.en',  // Use base.en for speed, medium.en for final
    folder: whisperPath,
  });

  console.log('Whisper setup complete!');
}

setup().catch(console.error);
```

Run once: `npx ts-node scripts/setup-whisper.ts`

### Model Options

| Model | Size | Speed | Quality | Use Case |
|-------|------|-------|---------|----------|
| `tiny.en` | 75MB | Fastest | Lower | Quick previews |
| `base.en` | 142MB | **Fast** | **Good** | **Recommended** |
| `small.en` | 466MB | Medium | Better | Production |
| `medium.en` | 1.5GB | Slow | Best | Final quality |
| `large-v3-turbo` | ~3GB | Fast | Best | Best balance (whisper.cpp 1.7+) |

Use `.en` models for English-only content (faster and more accurate).

### Speed Comparison

| Method | 8.5min video | GPU |
|--------|-------------|-----|
| Python whisper | ~15+ min | No |
| whisper.cpp (base.en) | ~85 sec | Yes (Metal) |

---

## 5. Fast Transcription Script (scripts/transcribe-fast.ts)

**Uses Remotion's transcribe() API with GPU acceleration - much faster than CLI.**

```ts
import { transcribe } from '@remotion/install-whisper-cpp';
import { execSync } from 'child_process';
import { existsSync, writeFileSync } from 'fs';
import path from 'path';

const WHISPER_PATH = path.join(process.cwd(), '.whisper');

interface Caption {
  text: string;
  startMs: number;
  endMs: number;
  timestampMs: number;
  confidence: number;
}

async function transcribeVideo(videoPath: string): Promise<void> {
  const baseName = path.basename(videoPath, path.extname(videoPath));
  const audioPath = path.join(process.cwd(), `${baseName}.wav`);
  const captionsPath = path.join(process.cwd(), 'public', `${baseName}.captions.json`);

  if (existsSync(captionsPath)) {
    console.log(`Skipping ${baseName} - already transcribed`);
    return;
  }

  console.log(`Transcribing ${baseName}...`);

  // Extract audio (16kHz mono WAV required by whisper.cpp)
  execSync(`ffmpeg -y -i "${videoPath}" -vn -ar 16000 -ac 1 "${audioPath}"`, { stdio: 'inherit' });

  // Transcribe with whisper.cpp (GPU accelerated on Mac)
  const { transcription } = await transcribe({
    inputPath: audioPath,
    whisperPath: WHISPER_PATH,
    whisperCppVersion: '1.5.5',  // REQUIRED - must match installed version
    model: 'base.en',
    tokenLevelTimestamps: true,  // REQUIRED for word-level captions
    printOutput: true,
  });

  // Convert to caption format
  const captions: Caption[] = transcription.map((item) => ({
    text: item.text,
    startMs: Math.round(item.offsets.from),
    endMs: Math.round(item.offsets.to),
    timestampMs: Math.round(item.offsets.from),
    confidence: 1,
  }));

  writeFileSync(captionsPath, JSON.stringify(captions, null, 2));
  console.log(`Created ${baseName}.captions.json (${captions.length} words)`);

  // Cleanup audio file
  execSync(`rm -f "${audioPath}"`);
}

async function main() {
  const videos = ['public/intro.mp4', 'public/part1.mp4', 'public/part2.mp4', 'public/part3.mp4'];

  for (const video of videos) {
    const fullPath = path.join(process.cwd(), video);
    if (existsSync(fullPath)) {
      await transcribeVideo(fullPath);
    }
  }

  console.log('All transcriptions complete!');
}

main().catch(console.error);
```

Run: `npx ts-node scripts/transcribe-fast.ts`

### Key Parameters

```ts
await transcribe({
  inputPath: audioPath,           // Path to WAV file (16kHz mono)
  whisperPath: WHISPER_PATH,      // Path to .whisper folder
  whisperCppVersion: '1.5.5',     // REQUIRED - must match installed version
  model: 'base.en',               // Model to use
  tokenLevelTimestamps: true,     // REQUIRED for word-level captions
  printOutput: true,              // Show progress
});
```

---

## 6. Caption JSON Format

Each caption file must be an array of word-level captions:

```json
[
  {
    "text": " In",
    "startMs": 130,
    "endMs": 440,
    "timestampMs": 130,
    "confidence": 1
  },
  {
    "text": " the",
    "startMs": 440,
    "endMs": 560,
    "timestampMs": 440,
    "confidence": 1
  },
  {
    "text": " software",
    "startMs": 560,
    "endMs": 920,
    "timestampMs": 560,
    "confidence": 1
  }
]
```

**Required fields:**
- `text`: The word (include leading space)
- `startMs`: Start time in milliseconds
- `endMs`: End time in milliseconds
- `timestampMs`: Same as startMs
- `confidence`: 0-1 (use 1 if unknown)

---

## 7. Setup Commands

```bash
# 1. Create project
mkdir video-editor && cd video-editor
npm init -y

# 2. Install dependencies
npm install remotion @remotion/cli @remotion/media @remotion/captions @remotion/transitions @remotion/bundler @remotion/install-whisper-cpp react react-dom
npm install -D typescript @types/react ts-node

# 3. Create folder structure
mkdir -p src/compositions public scripts

# 4. Copy video files to public/
cp /path/to/videos/*.mp4 public/

# 5. Setup whisper (one-time, downloads ~1.5GB model)
npx ts-node scripts/setup-whisper.ts

# 6. Run transcription (creates .captions.json files)
npx ts-node scripts/transcribe.ts

# 7. Start preview
npm run dev

# 8. Render (when ready)
npx remotion render FinalVideo out/final.mp4
```

---

## 8. Customization Checklist

When using this template for a new project:

1. **Update VIDEO_DURATIONS** - Run ffprobe to get exact durations:
   ```bash
   ffprobe -v error -show_entries format=duration -of csv=p=0 video.mp4
   ```

2. **Select TEASER_CLIPS** - Review transcripts and pick standalone sentences:
   - Must NOT start with: But, And, So, Now, It, This, That, They
   - Must have explicit subject
   - First clip must NOT be from intro start

3. **Adjust settings** if needed:
   - `TEASER_PLAYBACK_RATE`: 1.3x default (1.5x is too fast)
   - `TEASER_TRANSITION_FRAMES`: 12 frames (0.4s)
   - `CAPTION_COLORS`: Yellow/White/Gray

4. **Update segments array** in FinalVideo if you have different video files

---

## Summary

This reference implementation provides everything needed to recreate the video editor:

| File | Purpose |
|------|---------|
| `package.json` | Dependencies |
| `Root.tsx` | Composition registration |
| `FinalVideo.tsx` | Complete implementation (~380 lines) |
| `setup-whisper.ts` | One-time whisper installation |
| `transcribe.ts` | Word-level transcription |

The implementation includes:
- **Whisper setup**: Install binary + download model
- **Transcription**: Word-level timestamps with `-ojf -ml 1` flags
- **Teaser**: 1.3x speed with fade transitions
- **Captions**: Word highlighting (Yellow/White/Gray) with 0.2s fade
- **Final video**: Teaser + all main clips stitched with captions
