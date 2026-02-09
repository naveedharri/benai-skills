---
name: remotion-tips
description: Important Remotion patterns for video editing
metadata:
  tags: remotion, animations, timing, video, sequences
---

# Remotion Tips

Important Remotion patterns and gotchas for video editing.

---

## Animations

**All animations MUST use `useCurrentFrame()`** - CSS transitions and Tailwind animation classes will NOT render correctly.

```tsx
import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';

export const FadeIn = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const opacity = interpolate(frame, [0, 2 * fps], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return <div style={{opacity}}>Hello World!</div>;
};
```

---

## Interpolate

Map frame numbers to any value range:

```tsx
import {interpolate} from 'remotion';

// Basic (values can exceed range)
const opacity = interpolate(frame, [0, 100], [0, 1]);

// Clamped (stays within 0-1)
const opacity = interpolate(frame, [0, 100], [0, 1], {
  extrapolateRight: 'clamp',
  extrapolateLeft: 'clamp',
});
```

### Easing

```tsx
import {interpolate, Easing} from 'remotion';

const value = interpolate(frame, [0, 100], [0, 1], {
  easing: Easing.inOut(Easing.quad),
  extrapolateRight: 'clamp',
});
```

**Convexities:** `Easing.in`, `Easing.out`, `Easing.inOut`
**Curves:** `Easing.quad`, `Easing.sin`, `Easing.exp`, `Easing.circle`

---

## Spring Animations

Natural motion that goes from 0 to 1:

```tsx
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';

const frame = useCurrentFrame();
const {fps} = useVideoConfig();

const scale = spring({frame, fps});
```

### Spring Configs

```tsx
const smooth = {damping: 200};                    // No bounce (subtle reveals)
const snappy = {damping: 20, stiffness: 200};     // Minimal bounce (UI elements)
const bouncy = {damping: 8};                      // Bouncy (playful)
const heavy = {damping: 15, stiffness: 80, mass: 2}; // Slow, heavy
```

### With Delay and Duration

```tsx
const scale = spring({
  frame,
  fps,
  delay: 20,              // Delay start by 20 frames
  durationInFrames: 40,   // Stretch to specific duration
  config: {damping: 200},
});
```

### Combine with Interpolate

```tsx
const springProgress = spring({frame, fps});
const rotation = interpolate(springProgress, [0, 1], [0, 360]);

<div style={{rotate: rotation + 'deg'}} />
```

---

## Video Component

### Volume

```tsx
// Static
<Video src={staticFile('video.mp4')} volume={0.5} />

// Dynamic (fade in)
<Video
  src={staticFile('video.mp4')}
  volume={(f) => interpolate(f, [0, fps], [0, 1], {extrapolateRight: 'clamp'})}
/>

// Muted
<Video src={staticFile('video.mp4')} muted />
```

### Speed

```tsx
<Video src={staticFile('video.mp4')} playbackRate={2} />   // 2x speed
<Video src={staticFile('video.mp4')} playbackRate={0.5} /> // Half speed
```

### Looping

```tsx
<Video src={staticFile('video.mp4')} loop />

// Control volume curve behavior when looping
<Video
  src={staticFile('video.mp4')}
  loop
  loopVolumeCurveBehavior="extend"  // Frame count continues (vs "repeat" which resets)
  volume={(f) => interpolate(f, [0, 300], [1, 0])}
/>
```

### Trimming (Alternative Syntax)

```tsx
// Using trimBefore/trimAfter (in frames)
<Video
  src={staticFile('video.mp4')}
  trimBefore={2 * fps}   // Skip first 2 seconds
  trimAfter={10 * fps}   // End at 10 second mark
/>

// vs startFrom/endAt (also in frames)
<Video
  src={staticFile('video.mp4')}
  startFrom={2 * fps}
  endAt={10 * fps}
/>
```

### Pitch

```tsx
<Video src={staticFile('video.mp4')} toneFrequency={1.5} /> // Higher pitch
<Video src={staticFile('video.mp4')} toneFrequency={0.8} /> // Lower pitch
```

Note: Pitch shifting only works during render, not in Studio preview.

---

## Sequences

### Premounting (Important!)

Always premount sequences to preload content before it appears:

```tsx
<Sequence from={fps} durationInFrames={2 * fps} premountFor={fps}>
  <Video src={staticFile('video.mp4')} />
</Sequence>
```

### Layout

By default, Sequence wraps content in AbsoluteFill. Disable with:

```tsx
<Sequence layout="none">
  <Title />
</Sequence>
```

### Frame References

Inside a Sequence, `useCurrentFrame()` returns **local** frame (starts at 0):

```tsx
<Sequence from={60} durationInFrames={30}>
  <MyComponent />
  {/* Inside MyComponent, useCurrentFrame() returns 0-29, not 60-89 */}
</Sequence>
```

### Overlapping Sequences

Use negative offset in Series:

```tsx
<Series>
  <Series.Sequence durationInFrames={60}>
    <SceneA />
  </Series.Sequence>
  <Series.Sequence offset={-15} durationInFrames={60}>
    {/* Starts 15 frames before SceneA ends */}
    <SceneB />
  </Series.Sequence>
</Series>
```

### Trimming Animation Start

Use negative `from` to skip the beginning of an animation:

```tsx
<Sequence from={-15}>
  <MyAnimation />
  {/* Animation starts at frame 15 of its internal timeline */}
</Sequence>
```

### Trim and Delay

Nest sequences:

```tsx
<Sequence from={30}>           {/* Delay by 30 frames */}
  <Sequence from={-15}>        {/* Trim first 15 frames */}
    <MyAnimation />
  </Sequence>
</Sequence>
```

---

## Common Patterns

### Fade In/Out Animation

```tsx
const {fps, durationInFrames} = useVideoConfig();
const frame = useCurrentFrame();

const opacity = interpolate(
  frame,
  [0, fps, durationInFrames - fps, durationInFrames],
  [0, 1, 1, 0],
  {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
);
```

### Scale with Spring

```tsx
const scale = spring({
  frame,
  fps,
  config: {damping: 200},
});

<div style={{transform: `scale(${scale})`}} />
```

### In + Out Animation

```tsx
const {fps, durationInFrames} = useVideoConfig();

const inAnimation = spring({frame, fps});
const outAnimation = spring({
  frame,
  fps,
  delay: durationInFrames - fps,
  durationInFrames: fps,
});

const scale = inAnimation - outAnimation;
```

---

## Audio Handling

### Mixing Multiple Audio Sources

```tsx
import {Audio, Sequence, staticFile} from 'remotion';

export const AudioMix = () => {
  return (
    <>
      {/* Background music at 30% volume */}
      <Audio src={staticFile('music.mp3')} volume={0.3} />

      {/* Voice over at full volume, starts at 2 seconds */}
      <Sequence from={60}>
        <Audio src={staticFile('voiceover.mp3')} volume={1} />
      </Sequence>
    </>
  );
};
```

### Audio Fade Out

```tsx
<Audio
  src={staticFile('music.mp3')}
  volume={(f) => {
    const fadeStart = durationInFrames - fps; // Last second
    if (f < fadeStart) return 0.5;
    return interpolate(f, [fadeStart, durationInFrames], [0.5, 0], {
      extrapolateRight: 'clamp',
    });
  }}
/>
```

### Ducking (Lower Music During Speech)

```tsx
const speechStart = 60;  // frames
const speechEnd = 180;

<Audio
  src={staticFile('music.mp3')}
  volume={(f) => {
    if (f >= speechStart && f <= speechEnd) {
      return 0.15; // Duck to 15% during speech
    }
    return 0.5; // Normal 50% otherwise
  }}
/>
```

---

## Captions Integration

### Full Caption Display Component

Complete implementation for TikTok-style word highlighting:

```tsx
import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import type {TikTokPage, TikTokToken} from '@remotion/captions';

interface CaptionDisplayProps {
  pages: TikTokPage[];
  switchEveryMs?: number;
}

export const CaptionDisplay: React.FC<CaptionDisplayProps> = ({
  pages,
  switchEveryMs = 1200,
}) => {
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill>
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const startFrame = Math.floor((page.startMs / 1000) * fps);
        const endFrame = Math.min(
          nextPage ? Math.floor((nextPage.startMs / 1000) * fps) : Infinity,
          startFrame + Math.floor((switchEveryMs / 1000) * fps),
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
            <CaptionPage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
```

### Caption Page with Word Highlighting

```tsx
interface CaptionPageProps {
  page: TikTokPage;
  highlightColor?: string;
  textColor?: string;
}

export const CaptionPage: React.FC<CaptionPageProps> = ({
  page,
  highlightColor = '#39E508',
  textColor = '#FFFFFF',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Convert local frame to absolute time
  const localTimeMs = (frame / fps) * 1000;
  const absoluteTimeMs = page.startMs + localTimeMs;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 100,
      }}
    >
      <div
        style={{
          fontSize: 60,
          fontWeight: 'bold',
          fontFamily: 'Arial, sans-serif',
          textAlign: 'center',
          maxWidth: '80%',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          lineHeight: 1.3,
        }}
      >
        {page.tokens.map((token, i) => {
          const isActive =
            token.fromMs <= absoluteTimeMs && token.toMs > absoluteTimeMs;
          const isPast = token.toMs <= absoluteTimeMs;

          return (
            <span
              key={i}
              style={{
                color: isActive ? highlightColor : isPast ? textColor : '#CCCCCC',
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

### Using with Whisper Transcription

```tsx
import {openAiWhisperApiToCaptions} from '@remotion/openai-whisper';
import {createTikTokStyleCaptions} from '@remotion/captions';

// In your composition
const {captions} = openAiWhisperApiToCaptions({transcription});

const {pages} = createTikTokStyleCaptions({
  captions,
  combineTokensWithinMilliseconds: 1200, // Higher = more words per page
});

return (
  <AbsoluteFill>
    <Video src={staticFile('video.mp4')} />
    <CaptionDisplay pages={pages} />
  </AbsoluteFill>
);
```

---

## OffthreadVideo for Performance

For compositions with many videos or long renders, use `OffthreadVideo`:

```tsx
import {OffthreadVideo} from 'remotion';

// Better performance, especially for:
// - Multiple simultaneous videos
// - Long videos
// - Complex compositions
<OffthreadVideo src={staticFile('video.mp4')} />
```

**When to use:**
- Multiple video sources playing simultaneously
- Videos longer than 5 minutes
- Complex filter effects

**Limitations:**
- No `playbackRate` support
- Slightly less smooth seeking in Studio

---

## Rendering Tips

### Quality Settings

```bash
# High quality (slower)
npx remotion render CompositionName out.mp4 --codec h264 --crf 18

# Fast preview (lower quality)
npx remotion render CompositionName out.mp4 --codec h264 --crf 28

# ProRes (for editing software)
npx remotion render CompositionName out.mov --codec prores --prores-profile 4444
```

### Frame Range

```bash
# Render specific frames for testing
npx remotion render CompositionName out.mp4 --frames 0-90

# Start from specific frame
npx remotion render CompositionName out.mp4 --frames 100-
```

### Concurrency

```bash
# Use more CPU cores (faster render)
npx remotion render CompositionName out.mp4 --concurrency 8
```
