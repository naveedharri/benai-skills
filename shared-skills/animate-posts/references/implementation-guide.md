# Implementation Guide: Remotion Best Practices in Animate Posts

This guide explains how Animate Posts implements Remotion best practices for professional infographic animations.

## Architecture Overview

Our plugin follows these key principles:
1. **Frame-based animations only** (no CSS transitions)
2. **Spring animations with smooth configs** for natural motion
3. **Proper sequencing** with premounting to prevent stuttering
4. **Semantic animation mapping** based on element types

## Code Generation Pattern

### 1. Spring Animation for Stat Boxes

Following best practices, we use spring animations with `{ damping: 200 }` config:

```tsx
// Generated code for stat boxes
const statScale = spring({
  frame: frame - startFrame - (index * STAGGER_DELAY * fps),
  fps,
  config: { damping: 200 }, // Smooth, no bounce
  from: 0,
  to: 1
});

return {
  opacity: statScale,
  transform: `scale(${statScale})`
};
```

### 2. Interpolation with Easing for Titles

For titles, we use interpolate with proper clamping:

```tsx
const titleOpacity = interpolate(
  frame,
  [0, 2 * fps], // 2 seconds
  [0, 1],
  {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad)
  }
);

const titleScale = interpolate(
  frame,
  [0, 2 * fps],
  [0.95, 1],
  {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad)
  }
);
```

### 3. Pulse Loop for CTAs

CTAs use a continuous pulse animation:

```tsx
const cycleDuration = 2 * fps; // 2 second cycle
const cycleFrame = frame % cycleDuration;

const ctaScale = interpolate(
  cycleFrame,
  [0, cycleDuration / 2, cycleDuration],
  [1, 1.05, 1],
  { easing: Easing.inOut(Easing.sin) }
);
```

## remotionGenerator.js Implementation

Our `remotionGenerator.js` follows these best practices:

### Component Structure

```tsx
import React from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing
} from 'remotion';

// CRITICAL: Use type, not interface
type AnimatedInfographicProps = {
  imagePath: string;
};

export const AnimatedInfographic: React.FC<AnimatedInfographicProps> = ({
  imagePath
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // All animations driven by frame
  // No CSS transitions or animations

  return (
    <AbsoluteFill>
      {/* Use Remotion's Img component */}
      <Img src={staticFile(imagePath)} />

      {/* Animated overlays */}
    </AbsoluteFill>
  );
};
```

### Timing Calculation

We think in seconds and convert to frames:

```typescript
function calculateTimings(elements, totalDuration = 10) {
  const fps = 30;

  const timings = {
    title: {
      start: 0,
      duration: 2, // seconds
      startFrame: 0,
      endFrame: 2 * fps // 60 frames
    },
    stats: elements.filter(e => e.semanticRole === 'stat').map((stat, i) => ({
      start: 1.5 + (i * 0.3), // seconds with stagger
      duration: 2,
      startFrame: (1.5 + i * 0.3) * fps,
      endFrame: (3.5 + i * 0.3) * fps
    })),
    cta: {
      start: 8,
      duration: 2,
      startFrame: 8 * fps,
      endFrame: 10 * fps
    }
  };

  return timings;
}
```

### Animation Hook Pattern

We generate animation hooks for each element:

```tsx
const useTitleAnimation = (frame: number, fps: number) => {
  const startFrame = 0;
  const duration = 2 * fps;

  const opacity = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) }
  );

  const scale = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0.95, 1],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) }
  );

  return { opacity, scale };
};

const useStatAnimation = (frame: number, fps: number, index: number) => {
  const STAGGER_DELAY = 0.3; // seconds
  const startFrame = (1.5 + index * STAGGER_DELAY) * fps;

  const scale = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 200 }, // SMOOTH config
    from: 0,
    to: 1
  });

  return {
    opacity: scale,
    transform: `scale(${scale})`
  };
};
```

## Sequencing with Premounting

When generating compositions, we use proper sequencing:

```tsx
export const AnimatedInfographic = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Img src={staticFile('base-image.png')} />

      {/* Title appears immediately */}
      <Sequence from={0} durationInFrames={10 * fps} premountFor={fps}>
        <TitleElement />
      </Sequence>

      {/* Stats stagger in starting at 1.5s */}
      <Sequence from={1.5 * fps} durationInFrames={8.5 * fps} premountFor={fps}>
        <StatElements />
      </Sequence>

      {/* CTA pulses from 8s to end */}
      <Sequence from={8 * fps} durationInFrames={2 * fps} premountFor={fps}>
        <CTAElement />
      </Sequence>
    </AbsoluteFill>
  );
};
```

## Element Type to Animation Mapping

Based on semantic roles, we apply specific spring configs:

```typescript
const ELEMENT_ANIMATION_CONFIG = {
  title: {
    type: 'interpolate',
    easing: Easing.out(Easing.quad),
    transforms: ['opacity', 'scale'],
    from: { opacity: 0, scale: 0.95 },
    to: { opacity: 1, scale: 1 }
  },

  stat: {
    type: 'spring',
    config: SPRING_CONFIGS.SMOOTH, // { damping: 200 }
    transforms: ['opacity', 'scale'],
    from: { opacity: 0, scale: 0 },
    to: { opacity: 1, scale: 1 }
  },

  cta: {
    type: 'pulse',
    config: { duration: 2 }, // 2 second cycle
    transforms: ['scale'],
    from: { scale: 1 },
    to: { scale: 1.05 },
    loop: true
  },

  icon: {
    type: 'spring',
    config: SPRING_CONFIGS.BOUNCY, // { damping: 8 }
    transforms: ['opacity', 'scale'],
    from: { opacity: 0, scale: 0 },
    to: { opacity: 1, scale: 1 }
  }
};
```

## Asset Management

We ensure all assets use Remotion components:

```tsx
// In generated component
import { Img, staticFile } from 'remotion';

// Base image
<Img src={staticFile('adapted-image.png')} style={{ width: '100%', height: '100%' }} />

// NOT: <img src="/adapted-image.png" /> ❌
```

## Easing Function Implementation

We include all easing functions in generated code:

```tsx
const easingFunctions = {
  easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
  easeIn: (t: number) => Math.pow(t, 3),
  easeInOut: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,

  easeOutBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },

  easeOutElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 :
      Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }
};
```

## Text Animation Pattern

For text reveals, we use string slicing (not per-character opacity):

```tsx
// Typewriter effect
const text = "Your infographic title";
const charsToShow = Math.floor(
  interpolate(
    frame,
    [0, text.length * (fps / 6)], // 6 chars per second
    [0, text.length],
    { extrapolateRight: 'clamp' }
  )
);

<div>{text.slice(0, charsToShow)}</div>
```

## Chart Animation Pattern

For data visualizations, we disable third-party animations and use springs:

```tsx
// If using a chart library
<BarChart
  data={data}
  isAnimationActive={false} // CRITICAL: Disable library animations
/>

// Drive animations ourselves
{data.map((bar, i) => {
  const height = spring({
    frame: frame - (i * STAGGER_DELAY * fps),
    fps,
    config: { damping: 200 },
    from: 0,
    to: bar.value
  });

  return <div style={{ height: `${height}%` }} />;
})}
```

## Testing Generated Code

Our generated code includes frame logging for development:

```tsx
if (process.env.NODE_ENV === 'development') {
  console.log('Frame:', frame);
  console.log('Title opacity:', titleOpacity);
  console.log('Stat scales:', statScales);
}
```

## Common Patterns Summary

1. **All timing in seconds × fps** for readability
2. **Spring with `{ damping: 200 }`** for smooth, professional animations
3. **Interpolate with clamping** for controlled animations
4. **Stagger delays** for visual interest (typically 0.3s)
5. **Premount sequences** to prevent stuttering
6. **Use Remotion components** for all assets
7. **No CSS animations** - everything frame-based

## Generated File Structure

```
output/temp/
├── AnimatedComposition.jsx    # Main component with animations
├── Root.jsx                    # Composition configuration
└── adapted-image.png          # Processed base image
```

## Rendering Command

```bash
npx remotion render Root.jsx AnimatedInfographic output.mp4 \
  --width=1080 \
  --height=1080 \
  --fps=30 \
  --frames=300
```

## Key Takeaways

✅ All animations use `useCurrentFrame()` hook
✅ Spring animations with `{ damping: 200 }` for smooth motion
✅ Proper extrapolation clamping on all interpolations
✅ Staggered delays for multiple elements
✅ Premounting for performance
✅ Remotion components for all assets
✅ Type declarations (not interfaces)
✅ Timing calculated in seconds × fps

These patterns ensure professional, smooth animations that render correctly to GIF output.
