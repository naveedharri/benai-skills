---
name: title-cards
description: Add title cards, chapter headers, bumpers, and section transitions
metadata:
  tags: video, title, chapter, bumper, transition, text, overlay, remotion
---

# Title Cards & Chapter Headers

Add professional title cards to introduce sections, chapters, or segments in videos.

---

## Types of Title Cards

| Type | Description | When to Use |
|------|-------------|-------------|
| **Full Screen** | Solid/gradient background, centered text | Major section transitions |
| **Overlay** | Semi-transparent over video | Quick section labels |
| **Lower Third** | Positioned at bottom | Speaker names, topics |
| **Bumper** | Short branded transition | Between segments |
| **Interstitial** | Full screen graphic between content | Ad breaks, chapter changes |

---

## ALWAYS ASK User Preferences

**Never assume defaults. Always ask:**

| Question | Options |
|----------|---------|
| "Where should title cards appear?" | Before video / Overlay at start / Lower third |
| "How long should they stay?" | 1s (quick) / 1.5s (standard) / 2s (dramatic) |
| "What background style?" | Solid color / Semi-transparent / Gradient / Brand colors |
| "What animation style?" | Fade only / Slide up / Scale / Accent line |
| "Include brand elements?" | Logo / Accent colors / Custom font |

### Placement Options

| Placement | Description | Effect |
|-----------|-------------|--------|
| **Before video** | Title card plays, then fades to video | Clean separation, adds to duration |
| **Overlay at start** | Title overlays first few seconds of video | Video visible behind, same duration |
| **Lower third** | Small text at bottom of video | Minimal interruption |

---

## Brand-Aware Title Cards

### Step 1: Extract Brand Colors from Website

```tsx
// Example: BenAI Brand Colors
const BRAND_COLORS = {
  primary: '#000000',      // Black
  secondary: '#D2ECD0',    // Mint/sage green
  accent: '#4d65ff',       // Blue
  text: '#ffffff',         // White
};

// Font: Space Grotesk (from Google Fonts)
```

### Step 2: Apply to Title Card

```tsx
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';

interface TitleCardProps {
  title: string;
  subtitle?: string;
  colors?: {
    primary: string;
    secondary: string;
    text: string;
  };
}

export const TitleCard: React.FC<TitleCardProps> = ({
  title,
  subtitle,
  colors = {primary: '#000000', secondary: '#D2ECD0', text: '#ffffff'},
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const VISIBLE_DURATION = 1.5 * fps;
  const FADE_IN = 0.3 * fps;
  const FADE_OUT = 0.4 * fps;

  // Overall opacity
  const opacity = interpolate(
    frame,
    [0, FADE_IN, VISIBLE_DURATION - FADE_OUT, VISIBLE_DURATION],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  // Text slide up animation
  const translateY = interpolate(
    frame,
    [0, FADE_IN],
    [30, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  // Accent line width animation
  const lineWidth = interpolate(
    frame,
    [FADE_IN * 0.5, FADE_IN * 1.5],
    [0, 120],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.primary,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Decorative accent line */}
      <div
        style={{
          width: lineWidth,
          height: 4,
          backgroundColor: colors.secondary,
          marginBottom: 30,
          borderRadius: 2,
        }}
      />

      <div style={{transform: `translateY(${translateY}px)`, textAlign: 'center'}}>
        <h1
          style={{
            color: colors.text,
            fontSize: 72,
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontWeight: 500,
            margin: 0,
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              color: colors.secondary,
              fontSize: 28,
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontWeight: 400,
              marginTop: 16,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Bottom accent dot */}
      <div
        style={{
          width: 8,
          height: 8,
          backgroundColor: colors.secondary,
          borderRadius: '50%',
          marginTop: 40,
          opacity: interpolate(frame, [FADE_IN, FADE_IN + 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      />
    </AbsoluteFill>
  );
};
```

---

## Placement: Before Video (Recommended)

Title card plays as a separate sequence, then fades to video:

```tsx
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {OffthreadVideo, staticFile} from 'remotion';
import {TitleCard} from './TitleCard';

const clips = [
  {src: 'intro.mp4', durationInFrames: 1359, title: null},
  {src: 'part1.mp4', durationInFrames: 9353, title: 'AI Content Writing System'},
  {src: 'part2.mp4', durationInFrames: 6658, title: 'SEO Reporting System'},
  {src: 'part3.mp4', durationInFrames: 6043, title: 'Site Audit System'},
];

const TRANSITION_FRAMES = 25; // 0.5s at 50fps
const TITLE_CARD_DURATION = 75; // 1.5s at 50fps

export const VideoWithTitleCards: React.FC = () => {
  return (
    <TransitionSeries>
      {clips.map((clip, index) => (
        <>
          {/* Title card BEFORE the video (except intro) */}
          {clip.title && (
            <>
              <TransitionSeries.Sequence durationInFrames={TITLE_CARD_DURATION}>
                <TitleCard title={clip.title} />
              </TransitionSeries.Sequence>
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
              />
            </>
          )}

          {/* The video clip */}
          <TransitionSeries.Sequence durationInFrames={clip.durationInFrames}>
            <OffthreadVideo src={staticFile(clip.src)} />
          </TransitionSeries.Sequence>

          {/* Transition to next clip */}
          {index < clips.length - 1 && (
            <TransitionSeries.Transition
              presentation={fade()}
              timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
            />
          )}
        </>
      ))}
    </TransitionSeries>
  );
};
```

**Duration Calculation:**
```tsx
// Original clips + title cards - transition overlaps
// Clips: 1359 + 9353 + 6658 + 6043 = 23413 frames
// Title cards: 3 × 75 = 225 frames
// Transitions: 6 × 25 = 150 frames overlap
// Total: 23413 + 225 - 150 = 23488 frames
```

---

## Placement: Overlay at Start

Title card overlays the first few seconds of the video:

```tsx
import {AbsoluteFill, Sequence, OffthreadVideo, staticFile} from 'remotion';
import {TitleCard} from './TitleCard';

const TITLE_CARD_DURATION = 75; // 1.5s at 50fps

export const VideoWithOverlayTitle: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Video plays underneath */}
      <OffthreadVideo src={staticFile('part1.mp4')} />

      {/* Title card overlays the start */}
      <Sequence from={0} durationInFrames={TITLE_CARD_DURATION}>
        <TitleCard
          title="AI Content Writing System"
          colors={{
            primary: 'rgba(0, 0, 0, 0.7)', // Semi-transparent
            secondary: '#D2ECD0',
            text: '#ffffff',
          }}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
```

---

## Lower Third Style

Smaller text positioned at bottom:

```tsx
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';

interface LowerThirdProps {
  title: string;
  subtitle?: string;
}

export const LowerThird: React.FC<LowerThirdProps> = ({title, subtitle}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const FADE_IN = 0.3 * fps;
  const VISIBLE_DURATION = 3 * fps; // 3 seconds
  const FADE_OUT = 0.3 * fps;

  const opacity = interpolate(
    frame,
    [0, FADE_IN, VISIBLE_DURATION - FADE_OUT, VISIBLE_DURATION],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const slideX = interpolate(
    frame,
    [0, FADE_IN],
    [-50, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: 80,
          opacity,
          transform: `translateX(${slideX}px)`,
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            width: 4,
            height: 60,
            backgroundColor: '#D2ECD0',
            position: 'absolute',
            left: -20,
            top: 0,
          }}
        />

        <h2
          style={{
            color: 'white',
            fontSize: 36,
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 500,
            margin: 0,
            textShadow: '0 2px 10px rgba(0,0,0,0.8)',
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: 20,
              fontFamily: "'Space Grotesk', sans-serif",
              marginTop: 8,
              textShadow: '0 2px 10px rgba(0,0,0,0.8)',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </AbsoluteFill>
  );
};
```

---

## Animation Patterns

| Animation | Use Case | Implementation |
|-----------|----------|----------------|
| **Fade only** | Subtle, professional | `interpolate` opacity 0→1→1→0 |
| **Slide up** | Modern, dynamic | `translateY` with fade |
| **Scale** | Dramatic emphasis | `scale` from 1.05→1 |
| **Accent line** | Branded, elegant | Width animation on decorative element |
| **Typewriter** | Tech/modern | Character-by-character reveal |

### Accent Line Animation

```tsx
const lineWidth = interpolate(
  frame,
  [FADE_IN * 0.5, FADE_IN * 1.5],
  [0, 120],
  {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
);

<div style={{width: lineWidth, height: 4, backgroundColor: accentColor}} />
```

### Scale Animation

```tsx
const scale = interpolate(
  frame,
  [0, FADE_IN],
  [1.05, 1],
  {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
);

<div style={{transform: `scale(${scale})`}}>{title}</div>
```

---

## Common Patterns

### Chapter Cards for Multi-Part Videos

```tsx
const chapters = [
  {title: 'Introduction', partNumber: null},
  {title: 'AI Content Writing System', partNumber: 1},
  {title: 'SEO Reporting System', partNumber: 2},
  {title: 'Site Audit System', partNumber: 3},
];

// Each chapter gets a title card before its content
```

### Numbered Chapters

```tsx
<TitleCard
  title="Content Writing System"
  subtitle="Part 1 of 3"
/>
```

### With Logo

```tsx
import {Img, staticFile} from 'remotion';

<Img
  src={staticFile('logo.png')}
  style={{width: 80, marginBottom: 30}}
/>
<h1>{title}</h1>
```

---

## Edge Cases & Gotchas

### Duration Calculation

When adding title cards BEFORE videos in TransitionSeries:
```tsx
// Each title card adds to total duration
// But transitions subtract (overlap)
totalDuration = clips.reduce((sum, c) => sum + c.duration, 0)
              + (titleCards.length * TITLE_CARD_DURATION)
              - (transitions.length * TRANSITION_FRAMES);
```

### Font Loading

If using custom fonts (Space Grotesk, etc.), ensure they're loaded:
```tsx
// Add to public/index.html or use @remotion/google-fonts
import {loadFont} from '@remotion/google-fonts/SpaceGrotesk';
loadFont();
```

### Semi-Transparent Background

For overlay title cards where video is visible behind:
```tsx
backgroundColor: 'rgba(0, 0, 0, 0.7)', // 70% opacity black
```

### interpolate Monotonic Error

If FADE_IN is 0 (no fade), avoid `[0, 0, ...]`:
```tsx
// ❌ Wrong
const opacity = interpolate(frame, [0, 0, duration], [0, 1, 0]);

// ✅ Correct - skip fade in if not needed
const opacity = interpolate(frame, [duration - FADE_OUT, duration], [1, 0]);
```
