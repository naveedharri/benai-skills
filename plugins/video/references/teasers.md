---
name: video-teasers
description: Create intelligent teaser clips using transcript analysis
metadata:
  tags: video, teaser, trailer, clip, preview, ffmpeg, remotion, transcript
---

# Video Teasers

Create intelligent teaser clips using transcript-based cutting for clean, impactful highlights.

---

## Intelligent Teaser Workflow

**CRITICAL: Never use arbitrary timestamps. Always use transcript analysis.**

### Step 1: Transcribe with Word-Level Timestamps

Before creating any teaser, transcribe the video to get word-level timestamps:

```bash
whisper-cpp/main -m model.bin -f audio.wav -ojf -ml 1 -of output
```

### Step 2: Parse Transcript into Sentences

Find sentence boundaries (words ending with `.` `!` `?`):

```ts
function findSentences(captions: Caption[]): Sentence[] {
  const sentences: Sentence[] = [];
  let currentWords: string[] = [];
  let startMs = 0;

  for (const cap of captions) {
    if (currentWords.length === 0) startMs = cap.startMs;
    currentWords.push(cap.text);

    // Sentence boundary
    if (cap.text.trim().match(/[.!?]$/)) {
      sentences.push({
        text: currentWords.join('').trim(),
        startMs,
        endMs: cap.endMs,
        duration: (cap.endMs - startMs) / 1000,
      });
      currentWords = [];
    }
  }
  return sentences;
}
```

### Step 3: Review & Select Highlights

**Claude should read the transcript and identify:**

1. **Hook sentences** - Grab attention in first 5 seconds
2. **Key insights** - Main value propositions or interesting facts
3. **Quotable moments** - Memorable one-liners
4. **Call-to-action** - Ending that drives engagement

**Selection criteria:**
- Each clip must be a **complete sentence or thought**
- Must make sense **when heard independently**
- Should **create curiosity** without giving everything away
- Total duration should hit target (e.g., 30 seconds)

---

## CRITICAL: Teaser Clip Selection Rules

### NEVER Include Clips From:

| Source | Reason |
|--------|--------|
| **Intro section** | Intro is about to play - would be redundant |
| **First 30 seconds of main content** | Too close to where video starts |
| **Sentences starting with pronouns** | "It", "This", "They" need context |
| **Sentences starting with conjunctions** | "But", "And", "So" need prior context |

### ALWAYS Pull Clips From:

| Source | Reason |
|--------|--------|
| **Main content parts (not intro)** | Teaser previews upcoming content |
| **Later sections of video** | Creates anticipation for what's coming |
| **Sentences with explicit subjects** | "AI software...", "The opportunity..." |
| **Self-contained insights** | Makes sense without surrounding context |

### Bad vs Good Clip Selection

```
❌ BAD: "But that's not all - there's another opportunity."
   - Starts with "But" (needs prior context)
   - Uses "that" (unclear reference)

✅ GOOD: "AI software completely shifts the equation and makes small niches viable."
   - Starts with explicit subject "AI software"
   - Complete thought, no prior context needed

❌ BAD: Clip from intro at 0:05-0:12
   - Intro will play right after teaser - redundant

✅ GOOD: Clip from part3 at 2:15-2:22
   - From later content, previews what's coming
```

### Step 4: Validate Cut Points

**Before finalizing cuts, verify:**

| Check | Requirement |
|-------|-------------|
| Sentence complete | Cut starts at sentence start, ends at sentence end |
| Audio clean | No cut mid-word or mid-breath |
| Context clear | Viewer understands without surrounding context |
| Flow natural | Clips transition smoothly when combined |

### Step 5: Build Teaser

Assemble selected sentences in order that tells a mini-story:
1. Hook (attention grab)
2. Value (why watch)
3. Proof (credibility/examples)
4. CTA (what to do next)

---

## Cut Quality Rules

### NEVER Cut:
- Mid-sentence
- Mid-word
- During an explanation that requires context
- On filler words ("um", "so", "like")
- During inhale/breath sounds

### ALWAYS Cut:
- At sentence boundaries (after `.` `!` `?`)
- At natural pauses (> 300ms silence)
- After complete thoughts
- Where audio naturally fades

### Audio Considerations:
- Add 50-100ms padding before sentence start
- Add fade-out (200-500ms) at clip end
- Ensure no audio pops or clicks at cut points

---

## Example: Selecting Highlights

Given this transcript analysis:

```
INTRO (66s):
1. [0.1s - 7.4s] "In the software boom, millions of businesses were born..."
2. [7.6s - 17.7s] "But AI is the first technology that can actually automate labor..."
3. [28.9s - 55.4s] "So in this video, I'll show you how AI turns small boring niches..."

PART 1 (235s):
4. [27.4s - 35.0s] "Steam engines needed to be specialized to create factory conveyor belts..."
5. [41.7s - 49.5s] "So the people who specialize AI applications for specific niches do have a gigantic opportunity."
```

**Good teaser selection (30s total):**
- Sentence 2 (10s) - Hook about AI opportunity
- Sentence 5 (8s) - Key insight about specialization
- Sentence 3 (partial, 12s) - What the video covers + CTA

**Why these work:**
- Each is a complete thought
- Creates curiosity ("gigantic opportunity" - what is it?)
- Tells viewer what they'll learn
- No context needed to understand

---

## Teaser Types

| Type | Duration | Structure |
|------|----------|-----------|
| **YouTube Teaser** | 30-60s | Hook → 2-3 highlights → CTA |
| **Social Clip** | 15-30s | Single powerful insight |
| **Trailer** | 60-90s | Story arc with multiple highlights |
| **Hook** | 5-15s | One attention-grabbing sentence |
| **Overlay Teaser** | Any | Picture-in-picture preview during intro |

---

## Overlay Teaser (Picture-in-Picture)

An overlay teaser shows a small preview video on top of the main content (e.g., during intro).

### ALWAYS ASK USER PREFERENCES

**Never assume defaults. Always ask:**

| Setting | Question to Ask | Options |
|---------|-----------------|---------|
| **Position** | "Where should the overlay appear?" | Left corner / Right corner |
| **Size** | "What size for the overlay?" | Small (20%) / Medium (25%) / Large (30%) |
| **Video fit** | "How should the video fit?" | Cropped to fill (cover) / Full video resized (contain) |
| **Background** | "Add a background behind the overlay?" | None / Black / Blur |
| **Border** | "Add a border or shadow?" | None / Subtle border / Shadow |
| **Audio** | "Include overlay audio?" | Muted (default) / With audio |

### Styling Defaults to AVOID

| Don't Add | Unless Asked |
|-----------|--------------|
| Black background | User may want transparent |
| Border/shadow | Keep minimal by default |
| Rounded corners | Ask first |
| Audio | Default to **muted** for overlays |

### Implementation

```tsx
import {AbsoluteFill, OffthreadVideo, staticFile, Sequence} from 'remotion';

interface OverlayTeaserProps {
  position: 'left' | 'right';
  size: number; // 0.2 = 20%, 0.25 = 25%, etc.
  objectFit: 'cover' | 'contain';
  muted?: boolean;
}

export const OverlayTeaser: React.FC<OverlayTeaserProps> = ({
  position,
  size,
  objectFit,
  muted = true, // Default muted for overlays
}) => {
  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    width: `${size * 100}%`,
    aspectRatio: '16/9',
    bottom: 40,
    [position === 'left' ? 'left' : 'right']: 40,
    overflow: 'hidden',
    // NO background, border, or shadow by default
  };

  return (
    <AbsoluteFill>
      {/* Main video */}
      <OffthreadVideo src={staticFile('intro.mp4')} />

      {/* Overlay teaser */}
      <div style={overlayStyle}>
        <OffthreadVideo
          src={staticFile('teaser-clip.mp4')}
          muted={muted}
          style={{
            width: '100%',
            height: '100%',
            objectFit, // 'cover' = cropped, 'contain' = full video
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
```

### Required Props for Overlay Video

**Audio Isolation (CRITICAL):**
```tsx
<OffthreadVideo
  src={staticFile('teaser-clip.mp4')}
  muted                        // Removes audio track
  volume={0}                   // Ensures zero audio output (use BOTH)
  pauseWhenBuffering={false}   // Prevents main video pausing when overlay buffers
/>
```

| Setting | Problem it Fixes |
|---------|------------------|
| `muted` | Removes audio track |
| `volume={0}` | Ensures zero audio output (use with muted) |
| `pauseWhenBuffering={false}` | Prevents main video pausing when overlay buffers |

**DON'T:** Use only `muted` - incomplete isolation. Always use `muted` AND `volume={0}` together.

### Required Props for Overlay Sequence

```tsx
<Sequence
  from={0}
  durationInFrames={clipDuration}
  premountFor={50}  // Preloads clip to avoid loading stutter
>
```

| Setting | Problem it Fixes |
|---------|------------------|
| `premountFor={50}` | Preloads next clip to avoid loading stutter and audio glitches |

### Fade Transitions for Overlay Clips

**Always use fade transitions - hard cuts are jarring:**

| Do | Don't |
|----|-------|
| Overlap clips during crossfade | Fade to black between clips (gap) |
| Handle first/last clips separately | Use same fade logic for all clips |
| Use separate interpolate calls for each case | Create input arrays with duplicate values |

**CRITICAL: Avoid interpolate monotonic error**

```tsx
// ❌ WRONG - causes "inputRange must be strictly monotonically increasing"
const fadeInEnd = isFirst ? 0 : FADE_FRAMES;
interpolate(frame, [0, fadeInEnd, ...], ...) // [0, 0, ...] is INVALID

// ✅ CORRECT - separate cases for first/middle/last clips
const FADE_FRAMES = 10; // 0.2s at 50fps

let opacity = 1;
if (!isFirst && !isLast) {
  // Middle clips: fade in AND fade out
  opacity = interpolate(
    frame,
    [0, FADE_FRAMES, clipDuration - FADE_FRAMES, clipDuration],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
} else if (isFirst) {
  // First clip: NO fade in, only fade out
  opacity = interpolate(
    frame,
    [clipDuration - FADE_FRAMES, clipDuration],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
} else if (isLast) {
  // Last clip: only fade in, NO fade out
  opacity = interpolate(
    frame,
    [0, FADE_FRAMES],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
}
```

| Do | Don't |
|----|-------|
| Use `interpolate` for fade in/out | Use hard cuts (jarring) |
| Handle first/last clips separately | Same logic for all clips |
| Fade duration: ~10 frames (0.2s) | Fade too long (loses content) |
| Use `extrapolateLeft/Right: 'clamp'` | Leave extrapolation unbounded |

---

### Semantic Clip Matching (Synced Teaser)

For overlay teasers that sync with intro content:

| Do | Don't |
|----|-------|
| Analyze intro transcript for topics/context | Just keyword match |
| Match clips that SHOW what intro DISCUSSES | Match clips that mention same word |
| Use clips from different time ranges | Use duplicate/overlapping clips |
| Transcribe intro to understand segments | Assume intro content |

**Process:**
1. Transcribe intro to understand what topics are discussed
2. Find clips from main content that DEMONSTRATE those topics
3. Time clips to appear when intro MENTIONS the topic
4. Ensure clips are from unique, non-overlapping time ranges

### Clip Selection Rules

| Do | Don't |
|----|-------|
| Ensure all clips are from unique time ranges | Allow duplicate/repeating clips |
| Scale clips to fill intro duration exactly | Leave gaps between clips |
| Crossfade overlapping clips seamlessly | Hard cut or fade-to-black |

### Complete Overlay Teaser Implementation

```tsx
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';

interface OverlayClip {
  src: string;
  startMs: number;
  endMs: number;
}

const OVERLAY_CLIPS: OverlayClip[] = [
  {src: 'part2.mp4', startMs: 45000, endMs: 52000},
  {src: 'part3.mp4', startMs: 120000, endMs: 127000},
];

export const IntroWithOverlayTeaser: React.FC<{
  position: 'left' | 'right';
  size: number;
}> = ({position, size}) => {
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill>
      {/* Main intro video */}
      <OffthreadVideo src={staticFile('intro.mp4')} />

      {/* Overlay container */}
      <div
        style={{
          position: 'absolute',
          width: `${size * 100}%`,
          aspectRatio: '16/9',
          bottom: 40,
          [position]: 40,
          overflow: 'hidden',
        }}
      >
        {OVERLAY_CLIPS.map((clip, index) => {
          const clipDurationMs = clip.endMs - clip.startMs;
          const clipDurationFrames = Math.round((clipDurationMs / 1000) * fps);
          const startFrame = index === 0 ? 0 : /* calculate cumulative */;

          return (
            <Sequence
              key={index}
              from={startFrame}
              durationInFrames={clipDurationFrames}
              premountFor={50}
            >
              <OverlayClipWithFade
                src={clip.src}
                startFrame={Math.round((clip.startMs / 1000) * fps)}
                endFrame={Math.round((clip.endMs / 1000) * fps)}
                clipDuration={clipDurationFrames}
              />
            </Sequence>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const OverlayClipWithFade: React.FC<{
  src: string;
  startFrame: number;
  endFrame: number;
  clipDuration: number;
}> = ({src, startFrame, endFrame, clipDuration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const fadeFrames = Math.round(0.2 * fps);
  const opacity = interpolate(
    frame,
    [0, fadeFrames, clipDuration - fadeFrames, clipDuration],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  return (
    <div style={{opacity, width: '100%', height: '100%'}}>
      <OffthreadVideo
        src={staticFile(src)}
        startFrom={startFrame}
        endAt={endFrame}
        muted
        volume={0}
        pauseWhenBuffering={false}
        style={{width: '100%', height: '100%', objectFit: 'cover'}}
      />
    </div>
  );
};
```

### With Optional Styling (Only If Requested)

```tsx
// Only add these if user requests
const optionalStyles: React.CSSProperties = {
  // Border - only if asked
  border: '2px solid rgba(255,255,255,0.3)',

  // Shadow - only if asked
  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',

  // Rounded corners - only if asked
  borderRadius: 8,

  // Background - only if asked (for 'contain' fit)
  backgroundColor: 'black',
};
```

## Teaser Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| **Playback Speed** | 1.3x | Creates energy without being too fast |
| **Transitions** | Fade (0.4s) | Smooth professional cuts |
| **Fade Out** | 0.5s | Clean transition to main content |
| **Captions** | Yes (speed-adjusted) | Accessibility + engagement |

```tsx
// Teaser configuration
const TEASER_PLAYBACK_RATE = 1.3; // 1.3x speed (1.5x is too fast)
const TEASER_TRANSITION_FRAMES = 12; // 0.4s fade between clips

// Duration calculation: original / playback_rate - transition_overlaps
const TEASER_DURATION_FRAMES = Math.round(
  (totalMs / 1000 * fps) / TEASER_PLAYBACK_RATE
) - (TEASER_TRANSITION_FRAMES * (clips.length - 1));
```

---

## Implementation

### Remotion: Transcript-Based Teaser WITH Captions

```tsx
interface TeaserClip {
  src: string;
  captionsFile: string;  // Caption source for this clip
  startMs: number;
  endMs: number;
  sentence: string; // For verification - must be standalone
}

// Selected by Claude after reviewing transcript
// IMPORTANT: Each sentence must start with explicit subject, not pronouns/conjunctions
// IMPORTANT: Include captionsFile to enable captions on teaser
// IMPORTANT: First clip should NOT overlap with intro start (avoid repetition)
const TEASER_CLIPS: TeaserClip[] = [
  {
    // HOOK - From later in video, NOT from intro start
    src: 'part3.mp4',
    captionsFile: 'part3.captions.json',
    startMs: 69700,
    endMs: 76000,
    sentence: 'AI software completely shifts the equation and makes these small market sizes, huge potential market sizes.',
  },
  {
    // KEY INSIGHT - Starts with explicit subject "The huge opportunity"
    src: 'part3.mp4',
    captionsFile: 'part3.captions.json',
    startMs: 336370,
    endMs: 344840,
    sentence: 'The huge opportunity with AI democratizing product building is that building these types of businesses becomes so much faster and more accessible to anyone.',
  },
  {
    // VALUE PROP - Starts with explicit subject "AI, marketing..."
    src: 'part3.mp4',
    captionsFile: 'part3.captions.json',
    startMs: 142100,
    endMs: 148560,
    sentence: 'AI, marketing and sales tools can significantly reduce the CAC when targeting smaller niches.',
  },
  {
    // CLOSING HOOK - Urgency with explicit subject
    src: 'part3.mp4',
    captionsFile: 'part3.captions.json',
    startMs: 393070,
    endMs: 397700,
    sentence: 'The huge opportunity we have today is that the whole business world is looking at implementing AI.',
  },
];

export const HighlightTeaser: React.FC = () => {
  const {fps} = useVideoConfig();

  let currentFrame = 0;
  const clips = TEASER_CLIPS.map((clip, index) => {
    const durationMs = clip.endMs - clip.startMs;
    const durationFrames = Math.round((durationMs / 1000) * fps);
    const fromFrame = currentFrame;
    currentFrame += durationFrames;
    return {...clip, fromFrame, durationFrames, isLast: index === TEASER_CLIPS.length - 1};
  });

  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      {clips.map((clip, index) => (
        <Sequence key={index} from={clip.fromFrame} durationInFrames={clip.durationFrames}>
          <TeaserClipWithCaptions
            src={clip.src}
            captionsFile={clip.captionsFile}
            startMs={clip.startMs}
            endMs={clip.endMs}
            isLast={clip.isLast}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Teaser clip with filtered captions
const TeaserClipWithCaptions: React.FC<{
  src: string;
  captionsFile: string;
  startMs: number;
  endMs: number;
  isLast: boolean;
}> = ({src, captionsFile, startMs, endMs, isLast}) => {
  const {fps} = useVideoConfig();
  const [captions, setCaptions] = useState<Caption[]>([]);

  // Load and filter captions for this clip's time range
  useEffect(() => {
    fetch(staticFile(captionsFile))
      .then((res) => res.json())
      .then((allCaptions: Caption[]) => {
        // Filter to clip range and adjust timing to start from 0
        const filtered = allCaptions
          .filter((cap) => cap.startMs >= startMs && cap.endMs <= endMs)
          .map((cap) => ({
            ...cap,
            startMs: cap.startMs - startMs,
            endMs: cap.endMs - startMs,
            timestampMs: cap.timestampMs - startMs,
          }));
        setCaptions(filtered);
      });
  }, [captionsFile, startMs, endMs]);

  const startFrame = Math.round((startMs / 1000) * fps);
  const endFrame = Math.round((endMs / 1000) * fps);

  return (
    <AbsoluteFill>
      <OffthreadVideo
        src={staticFile(src)}
        startFrom={startFrame}
        endAt={endFrame}
      />
      {/* Render captions using createTikTokStyleCaptions */}
      <CaptionOverlay captions={captions} />
    </AbsoluteFill>
  );
};
```

---

## FFmpeg Approach

### Basic 30-Second Clip

Extract first 30 seconds:
```bash
ffmpeg -i input.mp4 -t 30 -c copy teaser.mp4
```

Extract 30 seconds starting at 1 minute:
```bash
ffmpeg -ss 60 -i input.mp4 -t 30 -c copy teaser.mp4
```

### Accurate Seeking

For frame-accurate cuts (slower but precise):
```bash
ffmpeg -i input.mp4 -ss 60 -t 30 -c:v libx264 -c:a aac teaser.mp4
```

**Note**: Place `-ss` before `-i` for fast seeking, after `-i` for accurate seeking.

### With Audio Fade Out

Fade audio out over last 2 seconds:
```bash
ffmpeg -i input.mp4 -t 30 \
  -af "afade=t=out:st=28:d=2" \
  -c:v copy -c:a aac \
  teaser.mp4
```

### With Video Fade Out

Fade both video and audio at end:
```bash
ffmpeg -i input.mp4 -t 30 \
  -vf "fade=t=out:st=28:d=2" \
  -af "afade=t=out:st=28:d=2" \
  -c:v libx264 -c:a aac \
  teaser.mp4
```

### With Fade In and Fade Out

```bash
ffmpeg -i input.mp4 -t 30 \
  -vf "fade=t=in:st=0:d=1,fade=t=out:st=28:d=2" \
  -af "afade=t=in:st=0:d=1,afade=t=out:st=28:d=2" \
  -c:v libx264 -c:a aac \
  teaser.mp4
```

### Add Text Overlay

Add "Watch Full Video" text in last 5 seconds:
```bash
ffmpeg -i input.mp4 -t 30 \
  -vf "drawtext=text='Watch Full Video':fontsize=48:fontcolor=white:x=(w-text_w)/2:y=h-100:enable='gte(t,25)'" \
  -c:v libx264 -c:a copy \
  teaser.mp4
```

### Montage Teaser (Multiple Clips)

```bash
# Extract clips
ffmpeg -ss 10 -i input.mp4 -t 10 -c copy clip1.mp4
ffmpeg -ss 60 -i input.mp4 -t 10 -c copy clip2.mp4
ffmpeg -ss 120 -i input.mp4 -t 10 -c copy clip3.mp4

# Create list
echo "file 'clip1.mp4'" > list.txt
echo "file 'clip2.mp4'" >> list.txt
echo "file 'clip3.mp4'" >> list.txt

# Concatenate
ffmpeg -f concat -safe 0 -i list.txt -c copy teaser.mp4

# Cleanup
rm clip1.mp4 clip2.mp4 clip3.mp4 list.txt
```

### Batch Create Teasers

```bash
for video in *.mp4; do
  ffmpeg -i "$video" -t 30 -c copy "teaser_${video}"
done
```

### YouTube Shorts / Reels (9:16 Vertical)

Convert horizontal to vertical with blur background:
```bash
ffmpeg -i input.mp4 -t 30 \
  -vf "split[original][blur];
       [blur]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=20[bg];
       [original]scale=1080:-1[fg];
       [bg][fg]overlay=(W-w)/2:(H-h)/2" \
  -c:v libx264 -c:a aac \
  teaser_vertical.mp4
```

### Quality Settings for YouTube

```bash
ffmpeg -i input.mp4 -t 30 \
  -vf "fade=t=out:st=28:d=2" \
  -af "afade=t=out:st=28:d=2" \
  -c:v libx264 -preset medium -crf 18 \
  -c:a aac -b:a 192k \
  teaser.mp4
```

---

## Remotion Approach

### Prerequisites

```bash
npm install @remotion/transitions  # OffthreadVideo is in core remotion package
```

### Basic 30-Second Teaser

```tsx
import {AbsoluteFill, staticFile, useVideoConfig} from 'remotion';
import {OffthreadVideo} from 'remotion';

export const TeaserVideo: React.FC = () => {
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill>
      <OffthreadVideo
        src={staticFile('video.mp4')}
        endAt={30 * fps}  // First 30 seconds
      />
    </AbsoluteFill>
  );
};
```

### Teaser from Middle of Video

```tsx
export const TeaserFromMiddle: React.FC = () => {
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill>
      <OffthreadVideo
        src={staticFile('video.mp4')}
        startFrom={60 * fps}  // Start at 1 minute
        endAt={90 * fps}      // End at 1:30
      />
    </AbsoluteFill>
  );
};
```

### Teaser with "Watch Full Video" Overlay

```tsx
import {AbsoluteFill, staticFile, useVideoConfig, interpolate, useCurrentFrame} from 'remotion';
import {OffthreadVideo} from 'remotion';

export const TeaserWithCTA: React.FC = () => {
  const {fps, durationInFrames} = useVideoConfig();
  const frame = useCurrentFrame();

  // Show CTA in last 5 seconds
  const ctaStart = durationInFrames - (5 * fps);
  const ctaOpacity = interpolate(
    frame,
    [ctaStart, ctaStart + 15],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  return (
    <AbsoluteFill>
      <OffthreadVideo src={staticFile('video.mp4')} endAt={30 * fps} />

      {/* Call to Action */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: ctaOpacity,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: '20px 40px',
            borderRadius: 10,
          }}
        >
          <span style={{color: 'white', fontSize: 48, fontWeight: 'bold'}}>
            Watch Full Video
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
```

### Teaser with Fade In/Out

```tsx
import {AbsoluteFill, staticFile, useVideoConfig, interpolate, useCurrentFrame} from 'remotion';
import {OffthreadVideo} from 'remotion';

export const TeaserWithFades: React.FC = () => {
  const {fps, durationInFrames} = useVideoConfig();
  const frame = useCurrentFrame();

  // Fade in first 1 second, fade out last 2 seconds
  const opacity = interpolate(
    frame,
    [0, fps, durationInFrames - (2 * fps), durationInFrames],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      <AbsoluteFill style={{opacity}}>
        <OffthreadVideo src={staticFile('video.mp4')} endAt={30 * fps} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
```

### Montage Teaser (Multiple Clips)

```tsx
import {Series, staticFile, useVideoConfig} from 'remotion';
import {OffthreadVideo} from 'remotion';

interface Clip {
  startSeconds: number;
  durationSeconds: number;
}

const clips: Clip[] = [
  {startSeconds: 10, durationSeconds: 10},
  {startSeconds: 60, durationSeconds: 10},
  {startSeconds: 120, durationSeconds: 10},
];

export const MontageTeaser: React.FC = () => {
  const {fps} = useVideoConfig();

  return (
    <Series>
      {clips.map((clip, index) => (
        <Series.Sequence key={index} durationInFrames={clip.durationSeconds * fps}>
          <OffthreadVideo
            src={staticFile('video.mp4')}
            startFrom={clip.startSeconds * fps}
            endAt={(clip.startSeconds + clip.durationSeconds) * fps}
          />
        </Series.Sequence>
      ))}
    </Series>
  );
};
```

### Teaser with Branded Intro

```tsx
import {AbsoluteFill, Series, staticFile, useVideoConfig} from 'remotion';
import {OffthreadVideo} from 'remotion';

export const BrandedTeaser: React.FC = () => {
  const {fps} = useVideoConfig();

  return (
    <Series>
      {/* 3-second branded intro */}
      <Series.Sequence durationInFrames={3 * fps}>
        <AbsoluteFill
          style={{
            backgroundColor: '#1a1a2e',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h1 style={{color: 'white', fontSize: 72}}>Your Brand</h1>
        </AbsoluteFill>
      </Series.Sequence>

      {/* 27-second video clip */}
      <Series.Sequence durationInFrames={27 * fps}>
        <OffthreadVideo src={staticFile('video.mp4')} endAt={27 * fps} />
      </Series.Sequence>
    </Series>
  );
};
```

### Composition Registration

```tsx
import {Composition} from 'remotion';
import {TeaserWithCTA} from './compositions/TeaserWithCTA';

const FPS = 30;
const TEASER_DURATION = 30 * FPS; // 30 seconds

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="TeaserWithCTA"
      component={TeaserWithCTA}
      durationInFrames={TEASER_DURATION}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
```

---

## Edge Cases & Gotchas

### Keyframe issues (FFmpeg)
Fast seeking (`-ss` before `-i`) may start at nearest keyframe:
```bash
# Fast but may be off by a few frames
ffmpeg -ss 60 -i input.mp4 -t 30 -c copy teaser.mp4

# Accurate but slower (re-encodes)
ffmpeg -i input.mp4 -ss 60 -t 30 -c:v libx264 -c:a aac teaser.mp4
```

### Audio sync issues (FFmpeg)
```bash
ffmpeg -i input.mp4 -ss 60 -t 30 -async 1 -c:v libx264 -c:a aac teaser.mp4
```

### Check video duration first
```bash
ffprobe -v error -show_entries format=duration -of csv=p=0 input.mp4
```

### startFrom and endAt are in frames (Remotion)
```tsx
const {fps} = useVideoConfig();
<OffthreadVideo
  src={staticFile('video.mp4')}
  startFrom={60 * fps}  // 60 seconds
  endAt={90 * fps}      // 90 seconds
/>
```

### Video shorter than teaser duration (Remotion)
If source video is shorter than requested clip, it will show black. Use `loop`:
```tsx
<OffthreadVideo src={staticFile('video.mp4')} loop />
```
