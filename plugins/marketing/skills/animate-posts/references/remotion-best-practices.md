# Remotion Best Practices for Animate Posts

## Critical Rules

### 1. Frame-Based Animations Only
**NEVER use CSS animations or transitions** - they will not render in video output.

```tsx
// ❌ WRONG - CSS animations don't work
<div className="animate-fade-in">Content</div>

// ✅ CORRECT - Frame-based animation
const frame = useCurrentFrame();
const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
<div style={{ opacity }}>Content</div>
```

### 2. Think in Seconds, Calculate in Frames
Always write timing logic in seconds and multiply by fps for better readability.

```tsx
const { fps } = useVideoConfig();
const titleDuration = 2; // seconds
const titleFrames = titleDuration * fps; // 60 frames at 30fps

const opacity = interpolate(frame, [0, titleFrames], [0, 1]);
```

### 3. Always Use Extrapolation
Prevent values from going outside expected ranges.

```tsx
interpolate(frame, [0, 60], [0, 1], {
  extrapolateLeft: 'clamp',  // Stays at 0 before frame 0
  extrapolateRight: 'clamp'  // Stays at 1 after frame 60
});
```

## Spring Animations

### Recommended Configurations

```tsx
// Smooth (no bounce) - ideal for professional infographics
const smooth = { damping: 200 };

// Snappy - minimal bounce for UI elements
const snappy = { damping: 20, stiffness: 200 };

// Bouncy - playful animations
const bouncy = { damping: 8 };

// Heavy - slow, weighted feel
const heavy = { damping: 15, stiffness: 80, mass: 2 };
```

### Usage Pattern

```tsx
import { spring } from 'remotion';

const scale = spring({
  frame,
  fps,
  config: { damping: 200 }, // smooth animation
  from: 0,
  to: 1
});
```

### Staggered Springs for Multiple Elements

```tsx
const STAGGER_DELAY = 0.3; // seconds

statElements.map((stat, index) => {
  const scale = spring({
    frame: frame - (index * STAGGER_DELAY * fps),
    fps,
    config: { damping: 200 },
    from: 0,
    to: 1
  });

  return <div style={{ transform: `scale(${scale})` }}>{stat}</div>;
});
```

## Component Structure

### Composition Definition

```tsx
// In Root.tsx
<Composition
  id="AnimatedInfographic"
  component={AnimatedInfographic}
  durationInFrames={300} // 10 seconds at 30fps
  fps={30}
  width={1080}
  height={1080}
  defaultProps={{
    imagePath: '/path/to/image.png'
  }}
/>
```

### Use Type Declarations (not Interface)

```tsx
// ✅ CORRECT
type AnimatedInfographicProps = {
  imagePath: string;
  title?: string;
};

// ❌ AVOID
interface AnimatedInfographicProps {
  imagePath: string;
}
```

## Asset Management

### Always Use Remotion Components

```tsx
// ❌ WRONG - native img tag
<img src="/image.png" />

// ✅ CORRECT - Remotion Img component
import { Img, staticFile } from 'remotion';
<Img src={staticFile('image.png')} />
```

### Font Loading

```tsx
import { loadFont } from '@remotion/google-fonts/Inter';

// Load at top of component
const { fontFamily } = loadFont();

// Use in styles
<div style={{ fontFamily }}>Text</div>
```

## Sequencing

### Use Sequence for Delays

```tsx
const { fps } = useVideoConfig();

<Sequence from={1 * fps} durationInFrames={2 * fps} premountFor={1 * fps}>
  <Title />
</Sequence>
```

**Important**: Always use `premountFor` to prevent stuttering!

### Use Series for Sequential Playback

```tsx
<Series>
  <Series.Sequence durationInFrames={60}>
    <Intro />
  </Series.Sequence>
  <Series.Sequence durationInFrames={120}>
    <MainContent />
  </Series.Sequence>
  <Series.Sequence durationInFrames={60}>
    <Outro />
  </Series.Sequence>
</Series>
```

## Text Animations

### Typewriter Effect (Character Reveal)

```tsx
const text = "Hello World";
const charsToShow = Math.floor(
  interpolate(frame, [0, text.length * fps / 6], [0, text.length], {
    extrapolateRight: 'clamp'
  })
);

<div>{text.slice(0, charsToShow)}</div>
```

**Never use per-character opacity** - use string slicing instead!

### Word Highlight Effect

```tsx
const scaleX = spring({
  frame,
  fps,
  config: { damping: 200 },
  from: 0,
  to: 1
});

<div style={{ position: 'relative' }}>
  <div style={{
    position: 'absolute',
    background: 'yellow',
    height: '100%',
    transform: `scaleX(${scaleX})`,
    transformOrigin: 'left center'
  }} />
  <span style={{ position: 'relative' }}>Highlighted Text</span>
</div>
```

## Chart Animations

### Bar Chart with Stagger

```tsx
const STAGGER_DELAY = 0.3;

bars.map((bar, i) => {
  const height = spring({
    frame: frame - (i * STAGGER_DELAY * fps),
    fps,
    config: { damping: 200 },
    from: 0,
    to: bar.value
  });

  return (
    <div
      key={i}
      style={{
        height: `${height}%`,
        transition: 'none' // CRITICAL: disable CSS transitions
      }}
    />
  );
});
```

### Disable Third-Party Library Animations

```tsx
// For Chart.js, Recharts, etc.
<BarChart
  data={data}
  // CRITICAL: Disable all animations
  isAnimationActive={false}
  animationDuration={0}
/>
```

## Transitions

### Using TransitionSeries

```tsx
import { TransitionSeries } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { linearTiming } from '@remotion/transitions/timing';

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={60}>
    <Scene1 />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition
    presentation={slide({ direction: 'from-right' })}
    timing={linearTiming({ durationInFrames: 20 })}
  />
  <TransitionSeries.Sequence durationInFrames={60}>
    <Scene2 />
  </TransitionSeries.Sequence>
</TransitionSeries>
```

## Performance Optimization

### 1. Premount Sequences

```tsx
<Sequence from={60} premountFor={30}>
  {/* Component loads 30 frames early */}
  <HeavyComponent />
</Sequence>
```

### 2. Use staticFile for Local Assets

```tsx
// Automatically handles encoding and loading
<Img src={staticFile('my image with spaces.png')} />
```

### 3. Font Loading Pattern

```tsx
import { loadFont } from '@remotion/google-fonts/Inter';

const inter = loadFont('normal', { weights: ['400', '700'] });

// Optional: Wait for font before rendering
const { waitUntilDone } = inter;
await waitUntilDone();
```

## Measuring and Layout

### Measure Text Before Rendering

```tsx
import { measureText } from '@remotion/layout-utils';

const { height, width } = measureText({
  text: 'Hello World',
  fontFamily: 'Inter',
  fontSize: 24,
  fontWeight: '700'
});

// Use measurements for positioning
<div style={{ width, height }}>Hello World</div>
```

### Fit Text to Container

```tsx
import { fitText } from '@remotion/layout-utils';

const fontSize = fitText({
  text: 'Long Text',
  fontFamily: 'Inter',
  maxWidth: 500
});
```

## Common Patterns for Infographics

### 1. Fade In with Subtle Scale (Titles)

```tsx
const titleAnimation = (frame: number, startFrame: number, duration: number) => {
  const progress = Math.max(0, Math.min(1, (frame - startFrame) / duration));
  const eased = Easing.out(Easing.quad)(progress);

  return {
    opacity: eased,
    scale: 0.95 + (0.05 * eased)
  };
};
```

### 2. Zoom In with Spring (Stats)

```tsx
const statAnimation = (frame: number, startFrame: number, fps: number) => {
  const scale = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 200, stiffness: 200 },
    from: 0,
    to: 1
  });

  return {
    opacity: scale,
    transform: `scale(${scale})`
  };
};
```

### 3. Pulse Loop (CTAs)

```tsx
const pulseAnimation = (frame: number, fps: number) => {
  const cycleDuration = 2 * fps; // 2 second cycle
  const cycleFrame = frame % cycleDuration;
  const progress = cycleFrame / cycleDuration;

  const scale = 1 + (0.05 * Math.sin(progress * Math.PI * 2));

  return { transform: `scale(${scale})` };
};
```

## Easing Functions

```tsx
import { Easing } from 'remotion';

// Recommended for different use cases
const titleEasing = Easing.out(Easing.quad);      // Smooth deceleration
const statEasing = Easing.out(Easing.back);       // Slight overshoot
const iconEasing = Easing.out(Easing.elastic);    // Bouncy
const ctaEasing = Easing.inOut(Easing.sin);       // Smooth both ends

// Usage
interpolate(frame, [0, 60], [0, 1], {
  easing: Easing.out(Easing.quad)
});
```

## Testing and Debugging

### Enable Debug Logging

```tsx
if (process.env.NODE_ENV === 'development') {
  console.log('Frame:', frame);
  console.log('Progress:', progress);
}
```

### Use Remotion Studio

```bash
npx remotion studio
```

Interactive preview with:
- Frame scrubbing
- Real-time prop editing
- Timeline visualization
- Performance metrics

## Common Mistakes to Avoid

1. ❌ Using CSS animations/transitions
2. ❌ Using native `<img>`, `<video>`, `<audio>` tags
3. ❌ Forgetting to premount sequences
4. ❌ Not clamping interpolation values
5. ❌ Using interfaces instead of types for props
6. ❌ Not disabling third-party library animations
7. ❌ Measuring text without loading fonts first
8. ❌ Using time-based instead of frame-based calculations

## Summary Checklist

- [ ] All animations use `useCurrentFrame()` (no CSS animations)
- [ ] Timing calculated in seconds × fps
- [ ] All `interpolate()` calls use extrapolation clamping
- [ ] Spring animations use appropriate configs (usually `{ damping: 200 }`)
- [ ] All sequences have `premountFor` prop
- [ ] Using Remotion's `<Img>`, `<Video>`, `<Audio>` components
- [ ] Fonts loaded before measuring text
- [ ] Third-party chart animations disabled
- [ ] Props use `type` declarations
- [ ] Assets loaded via `staticFile()`

---

**These practices ensure smooth, professional animations that render correctly to video/GIF output.**
