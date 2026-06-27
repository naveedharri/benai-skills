---
name: video-captions
description: Add subtitles and captions to videos
metadata:
  tags: video, captions, subtitles, srt, ffmpeg, remotion
---

# Video Captions

Add subtitles and animated captions to videos with proper styling for readability.

---

## Caption Design Best Practices

Based on industry research for YouTube and video content:

### Fonts (Ranked by Readability)

| Font | Score | Best For |
|------|-------|----------|
| **Roboto** | 9.5/10 | YouTube default, excellent on all screens |
| **Helvetica Neue** | 9.5/10 | Clean, professional look |
| **Open Sans** | 9.2/10 | Great for longer text |
| **Arial** | 9.0/10 | Universal fallback, widely available |
| **Montserrat** | 8.8/10 | Modern, bold headers |

**Rules:**
- Always use **sans-serif** fonts (better screen legibility)
- Minimum **22-24pt** font size for readability
- Use **bold/semibold** weight for better visibility
- Avoid decorative, thin, or overly stylized fonts

### Colors

**Recommended Color Combinations:**

| Text | Background/Outline | Contrast | Use Case |
|------|-------------------|----------|----------|
| White `#FFFFFF` | Black outline | 21:1 | Standard (best) |
| White `#FFFFFF` | Dark gray `#333333` shadow | 12:1 | Softer look |
| Yellow `#FFD700` | Black outline | 18:1 | Highlight/emphasis |
| White `#FFFFFF` | Semi-transparent black bg | 15:1 | Busy backgrounds |

**For Word Highlighting:**
- **Inactive words**: White `#FFFFFF`
- **Active word (speaking)**: Yellow `#FFD700` or `#FFCC00`
- **Upcoming words** (optional): Dimmed white `#CCCCCC`

**Avoid:**
- Neon colors (distracting)
- Pure green `#00FF00` (harsh on eyes)
- Low contrast combinations
- Colors that clash with video content

### Text Shadow & Outline

```css
/* Recommended: Soft shadow for depth */
text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9),
             0px 0px 8px rgba(0, 0, 0, 0.5);

/* Alternative: Outline effect */
-webkit-text-stroke: 2px rgba(0, 0, 0, 0.8);
```

**Key principles:**
- Use dark gray `#222222` instead of pure black for softer outlines
- Add blur to shadows (4-8px) for depth
- Double shadow (sharp + blurred) improves readability on any background

### Positioning

- **YouTube horizontal**: Bottom 20-25% of screen, centered
- **Vertical/Shorts**: Center of screen (avoid top/bottom UI elements)
- **Safe margins**: 60px from edges minimum
- **Max width**: 80% of screen width
- **Max characters**: 42 per line, 2 lines maximum

### Timing & Sync

- **Display duration**: 1.5-3 seconds per caption block
- **Reading speed**: 180-200 words per minute
- **Sync offset**: Captions should appear 0.1-0.3s BEFORE audio
- **Word highlight**: Must match audio timing exactly (use word-level timestamps)
- **Fade transitions**: 0.2s fade in/out for smooth caption changes (never abrupt)

---

## When to Use Each Tool

| Scenario | Recommended Tool |
|----------|------------------|
| Simple SRT burn-in | FFmpeg subtitles filter |
| TikTok-style highlighting | Remotion @remotion/captions |
| Custom animations | Remotion with custom components |
| Batch processing | FFmpeg |

## SRT File Format

Standard subtitle format used by both tools:

```srt
1
00:00:01,000 --> 00:00:04,000
Hello and welcome to this video.

2
00:00:04,500 --> 00:00:07,000
Today we'll be covering...
```

---

## FFmpeg Approach

### Basic SRT Burn-in

```bash
ffmpeg -i video.mp4 -vf "subtitles=captions.srt" output.mp4
```

### Styled Subtitles

```bash
ffmpeg -i video.mp4 \
  -vf "subtitles=captions.srt:force_style='FontName=Arial,FontSize=24,PrimaryColour=&HFFFFFF,OutlineColour=&H000000,Outline=2,Shadow=1'" \
  output.mp4
```

### Style Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `FontName` | Font family | `Arial`, `Impact` |
| `FontSize` | Size in points | `24`, `32` |
| `PrimaryColour` | Text color (AABBGGRR format) | `&HFFFFFF` (white) |
| `OutlineColour` | Outline color | `&H000000` (black) |
| `BackColour` | Background/shadow color | `&H80000000` |
| `Outline` | Outline thickness | `2` |
| `Shadow` | Shadow depth | `1` |
| `Bold` | Bold text | `1` or `0` |
| `Italic` | Italic text | `1` or `0` |
| `Alignment` | Position (numpad style) | `2` (bottom center) |
| `MarginV` | Vertical margin | `30` |

### Color Format

Colors use `&HAABBGGRR` format (alpha, blue, green, red):
- White: `&HFFFFFF` or `&H00FFFFFF`
- Black: `&H000000`
- Yellow: `&H00FFFF`
- Red: `&H0000FF`

### Alignment Values (Numpad Layout)

```
7 8 9  (top)
4 5 6  (middle)
1 2 3  (bottom)
```

Default is `2` (bottom center).

### YouTube-Style Captions

Large, readable captions:
```bash
ffmpeg -i video.mp4 \
  -vf "subtitles=captions.srt:force_style='FontName=Arial,FontSize=28,PrimaryColour=&HFFFFFF,OutlineColour=&H000000,Outline=3,Shadow=0,Bold=1,MarginV=40'" \
  -c:a copy \
  output.mp4
```

### Position Captions at Top

```bash
ffmpeg -i video.mp4 \
  -vf "subtitles=captions.srt:force_style='Alignment=8,MarginV=20'" \
  output.mp4
```

### ASS Subtitles (Advanced Styling)

For more control, convert SRT to ASS format:
```bash
# Convert SRT to ASS
ffmpeg -i captions.srt captions.ass

# Burn in ASS subtitles
ffmpeg -i video.mp4 -vf "ass=captions.ass" output.mp4
```

### With Quality Settings

```bash
ffmpeg -i video.mp4 \
  -vf "subtitles=captions.srt:force_style='FontSize=24,Outline=2'" \
  -c:v libx264 -preset medium -crf 18 \
  -c:a aac -b:a 192k \
  output.mp4
```

### Batch Processing

Process all videos with same SRT:
```bash
for video in *.mp4; do
  ffmpeg -i "$video" -vf "subtitles=captions.srt" "captioned_${video}"
done
```

Match SRT files to videos by name:
```bash
for video in *.mp4; do
  srt="${video%.mp4}.srt"
  if [ -f "$srt" ]; then
    ffmpeg -i "$video" -vf "subtitles=$srt" "captioned_${video}"
  fi
done
```

---

## Remotion Approach

### Prerequisites

```bash
npx remotion add @remotion/captions
```

### Import SRT Captions

```tsx
import {parseSrt} from '@remotion/captions';
import {staticFile} from 'remotion';

// Load and parse SRT file
const srtContent = await fetch(staticFile('captions.srt')).then(r => r.text());
const {captions} = parseSrt({input: srtContent});
```

### TikTok-Style Pages

Group captions into pages that appear together:

```tsx
import {useMemo} from 'react';
import {createTikTokStyleCaptions} from '@remotion/captions';
import type {Caption} from '@remotion/captions';

// Higher values = more words per page
// Lower values = more word-by-word
const SWITCH_CAPTIONS_EVERY_MS = 1200;

interface Props {
  captions: Caption[];
}

export const CaptionedVideo: React.FC<Props> = ({captions}) => {
  const {pages} = useMemo(() => {
    return createTikTokStyleCaptions({
      captions,
      combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
    });
  }, [captions]);

  return <CaptionDisplay pages={pages} />;
};
```

### Display Captions with Word Highlighting

```tsx
import {AbsoluteFill, Sequence, useVideoConfig} from 'remotion';
import type {TikTokPage} from '@remotion/captions';

const SWITCH_CAPTIONS_EVERY_MS = 1200;

interface CaptionDisplayProps {
  pages: TikTokPage[];
}

export const CaptionDisplay: React.FC<CaptionDisplayProps> = ({pages}) => {
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill>
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const startFrame = (page.startMs / 1000) * fps;
        const endFrame = Math.min(
          nextPage ? (nextPage.startMs / 1000) * fps : Infinity,
          startFrame + (SWITCH_CAPTIONS_EVERY_MS / 1000) * fps,
        );
        const durationInFrames = endFrame - startFrame;

        if (durationInFrames <= 0) return null;

        return (
          <Sequence key={index} from={startFrame} durationInFrames={durationInFrames}>
            <CaptionPage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
```

### Caption Page with Dynamic Word Highlighting

```tsx
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import type {TikTokPage} from '@remotion/captions';

// Best practice colors for YouTube
const COLORS = {
  active: '#FFD700',      // Yellow - currently speaking word
  spoken: '#FFFFFF',      // White - already spoken words
  upcoming: '#CCCCCC',    // Dimmed - words not yet spoken
};

interface CaptionPageProps {
  page: TikTokPage;
}

export const CaptionPage: React.FC<CaptionPageProps> = ({page}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Calculate current time in absolute milliseconds
  const currentTimeMs = (frame / fps) * 1000;
  const absoluteTimeMs = page.startMs + currentTimeMs;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 150, // Safe margin from bottom
      }}
    >
      <div
        style={{
          fontSize: 48,
          fontWeight: 700,
          fontFamily: 'Roboto, Arial, sans-serif',
          textAlign: 'center',
          maxWidth: '80%',
          lineHeight: 1.4,
          // Double shadow for readability on any background
          textShadow: `
            2px 2px 0px rgba(0, 0, 0, 0.9),
            -2px -2px 0px rgba(0, 0, 0, 0.9),
            2px -2px 0px rgba(0, 0, 0, 0.9),
            -2px 2px 0px rgba(0, 0, 0, 0.9),
            0px 4px 8px rgba(0, 0, 0, 0.5)
          `,
        }}
      >
        {page.tokens.map((token, i) => {
          // Determine word state based on timing
          const isActive = token.fromMs <= absoluteTimeMs && token.toMs > absoluteTimeMs;
          const isSpoken = token.toMs <= absoluteTimeMs;
          const isUpcoming = token.fromMs > absoluteTimeMs;

          // Choose color based on state
          let color = COLORS.upcoming;
          if (isActive) color = COLORS.active;
          else if (isSpoken) color = COLORS.spoken;

          return (
            <span
              key={i}
              style={{
                color,
                display: 'inline',
              }}
            >
              {token.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
```

**Key improvements:**
- Yellow `#FFD700` for active word (high visibility, industry standard)
- White for spoken words, dimmed for upcoming (shows progress)
- Roboto font (YouTube's caption font)
- Multi-directional shadow (readable on light AND dark backgrounds)
- 48px font size (optimal for 1080p)
- Safe bottom margin (150px) to avoid YouTube UI

### Full Composition Example

```tsx
import {AbsoluteFill, staticFile, useMemo} from 'remotion';
import {Video} from '@remotion/media';
import {createTikTokStyleCaptions, Caption} from '@remotion/captions';
import {CaptionDisplay} from './CaptionDisplay';

interface Props {
  captions: Caption[];
}

export const CaptionedVideoComposition: React.FC<Props> = ({captions}) => {
  const {pages} = useMemo(() => {
    return createTikTokStyleCaptions({
      captions,
      combineTokensWithinMilliseconds: 1200,
    });
  }, [captions]);

  return (
    <AbsoluteFill>
      <Video src={staticFile('video.mp4')} />
      <CaptionDisplay pages={pages} />
    </AbsoluteFill>
  );
};
```

### Custom Styling Options

**Centered captions:**
```tsx
<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
```

**With background box:**
```tsx
<div
  style={{
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: '10px 20px',
    borderRadius: 8,
  }}
>
  {/* tokens */}
</div>
```

**Smooth fade in/out (RECOMMENDED):**
```tsx
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

const frame = useCurrentFrame();
const {fps, durationInFrames} = useVideoConfig();

// 0.2s fade = 6 frames at 30fps
const fadeFrames = Math.round(0.2 * fps);
const opacity = interpolate(
  frame,
  [0, fadeFrames, durationInFrames - fadeFrames, durationInFrames],
  [0, 1, 1, 0],
  {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
);

<div style={{opacity}}>
```

**Animated entrance with scale:**
```tsx
const frame = useCurrentFrame();
const opacity = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});
const scale = interpolate(frame, [0, 10], [0.9, 1], {extrapolateRight: 'clamp'});

<div style={{opacity, transform: `scale(${scale})`}}>
```

---

## Common Issues

### Font not found (FFmpeg)
```bash
fc-list | grep -i arial

# Use system font that exists
force_style='FontName=Helvetica'  # macOS
force_style='FontName=DejaVu Sans'  # Linux
```

### Special characters in path (FFmpeg)
```bash
# Escape colons and use quotes
ffmpeg -i video.mp4 -vf "subtitles='captions.srt'" output.mp4
```

### Non-UTF8 SRT files
```bash
# Check encoding
file captions.srt

# Convert to UTF-8
iconv -f ISO-8859-1 -t UTF-8 captions.srt > captions_utf8.srt
```

### Subtitle timing offset (FFmpeg)
```bash
# Delay subtitles by 2 seconds
ffmpeg -itsoffset 2 -i captions.srt -i video.mp4 -c copy -map 0 -map 1 output.mp4
```

---

## Edge Cases & Gotchas

### Caption data format (Remotion)
Each caption object needs these fields:
```tsx
interface Caption {
  text: string;      // The word/phrase
  startMs: number;   // Start time in milliseconds
  endMs: number;     // End time in milliseconds
  timestampMs: number; // Usually same as startMs
  confidence: number;  // 0-1, use 1 if unknown
}
```

### Word-level vs sentence-level (Remotion)

**CRITICAL: For dynamic word highlighting, you MUST have word-level timestamps.**

```tsx
// CORRECT - word-level timing (each word has its own timestamp)
const captions = [
  {text: 'Hello ', startMs: 0, endMs: 500, timestampMs: 0, confidence: 0.95},
  {text: 'world', startMs: 500, endMs: 1000, timestampMs: 500, confidence: 0.92},
];

// WON'T HIGHLIGHT WORDS - sentence-level only
const captions = [
  {text: 'Hello world', startMs: 0, endMs: 1000, timestampMs: 0, confidence: 1},
];
```

**How to get word-level timestamps with Whisper:**

```bash
# Use -ojf (full JSON) and -ml 1 (max 1 word per segment)
whisper-cpp/main -m model.bin -f audio.wav -ojf -ml 1 -of output
```

The `-ml 1` flag forces word-level segmentation. Without it, you get sentence-level timestamps and highlighting won't work.

### Blank screen issues (Remotion)
If captions cause blank screen:
1. Check that `pages` array is not empty
2. Verify `durationInFrames` is positive for each Sequence
3. Ensure caption timestamps are within video duration

### SRT encoding
Ensure SRT files are UTF-8 encoded to avoid character issues.
