---
name: video-transitions
description: Add transitions (fade, slide, wipe) between video clips
metadata:
  tags: video, transitions, fade, slide, wipe, ffmpeg, remotion
---

# Video Transitions

Add professional transitions between video clips.

## When to Use Each Tool

| Scenario | Recommended Tool |
|----------|------------------|
| Simple 2-clip crossfade | FFmpeg xfade |
| Multiple transitions | Remotion TransitionSeries |
| Custom timing/easing | Remotion |
| Slide/wipe/flip effects | Remotion |
| Batch processing | FFmpeg |

---

## FFmpeg Approach

### Basic Crossfade (xfade)

```bash
ffmpeg -i video1.mp4 -i video2.mp4 \
  -filter_complex "xfade=transition=fade:duration=1:offset=4" \
  output.mp4
```

**Parameters:**
- `transition`: The transition type
- `duration`: Transition length in seconds
- `offset`: When transition starts (seconds from beginning)

**Calculate Offset:** `offset = duration of first video - transition duration`

If video1 is 5 seconds and transition is 1 second: offset = 5 - 1 = 4

### Transition Types

**Fade:**
```bash
xfade=transition=fade:duration=1:offset=4
xfade=transition=fadeblack:duration=1:offset=4
xfade=transition=fadewhite:duration=1:offset=4
```

**Slide:**
```bash
xfade=transition=slideleft:duration=1:offset=4
xfade=transition=slideright:duration=1:offset=4
xfade=transition=slideup:duration=1:offset=4
xfade=transition=slidedown:duration=1:offset=4
```

**Wipe:**
```bash
xfade=transition=wipeleft:duration=1:offset=4
xfade=transition=wiperight:duration=1:offset=4
xfade=transition=wipeup:duration=1:offset=4
xfade=transition=wipedown:duration=1:offset=4
```

**Other:**
```bash
xfade=transition=circlecrop:duration=1:offset=4
xfade=transition=rectcrop:duration=1:offset=4
xfade=transition=dissolve:duration=1:offset=4
xfade=transition=pixelize:duration=1:offset=4
xfade=transition=radial:duration=1:offset=4
```

### All Available Transitions

```
fade, fadeblack, fadewhite, wipeleft, wiperight, wipeup, wipedown,
slideleft, slideright, slideup, slidedown, circlecrop, rectcrop, distance,
dissolve, pixelize, radial, hblur, wipetl, wipetr, wipebl, wipebr, squeezeh,
squeezev, zoomin, smoothleft, smoothright, smoothup, smoothdown, circleopen,
circleclose, vertopen, vertclose, horzopen, horzclose, diagtl, diagtr, diagbl,
diagbr, hlslice, hrslice, vuslice, vdslice
```

### With Audio Crossfade

```bash
ffmpeg -i video1.mp4 -i video2.mp4 \
  -filter_complex "
    [0:v][1:v]xfade=transition=fade:duration=1:offset=4[v];
    [0:a][1:a]acrossfade=d=1[a]
  " \
  -map "[v]" -map "[a]" \
  output.mp4
```

### Three or More Clips

Chain multiple xfade filters:

```bash
ffmpeg -i v1.mp4 -i v2.mp4 -i v3.mp4 \
  -filter_complex "
    [0:v][1:v]xfade=transition=fade:duration=1:offset=4[v01];
    [v01][2:v]xfade=transition=fade:duration=1:offset=8[vout];
    [0:a][1:a]acrossfade=d=1[a01];
    [a01][2:a]acrossfade=d=1[aout]
  " \
  -map "[vout]" -map "[aout]" \
  output.mp4
```

**Calculating offsets for multiple clips:**

For clips of equal length (5 seconds each) with 1 second transitions:
- First transition offset: 5 - 1 = 4
- Second transition offset: 4 + (5 - 1) = 8

Formula: `offset_n = offset_(n-1) + clip_duration - transition_duration`

### Get Video Duration

```bash
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 video.mp4
```

---

## Remotion Approach

### Prerequisites

```bash
npx remotion add @remotion/transitions
```

### Basic Transition

```tsx
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {OffthreadVideo} from 'remotion';
import {staticFile} from 'remotion';

export const TransitionExample: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={150}>
        <OffthreadVideo src={staticFile('intro.mp4')} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({durationInFrames: 15})}
      />

      <TransitionSeries.Sequence durationInFrames={300}>
        <OffthreadVideo src={staticFile('main.mp4')} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
```

### Available Transitions

**Fade:**
```tsx
import {fade} from '@remotion/transitions/fade';

<TransitionSeries.Transition
  presentation={fade()}
  timing={linearTiming({durationInFrames: 15})}
/>
```

**Slide:**
```tsx
import {slide} from '@remotion/transitions/slide';

<TransitionSeries.Transition
  presentation={slide({direction: 'from-left'})}
  timing={linearTiming({durationInFrames: 20})}
/>
// Directions: 'from-left', 'from-right', 'from-top', 'from-bottom'
```

**Wipe:**
```tsx
import {wipe} from '@remotion/transitions/wipe';

<TransitionSeries.Transition
  presentation={wipe({direction: 'from-left'})}
  timing={linearTiming({durationInFrames: 20})}
/>
```

**Flip:**
```tsx
import {flip} from '@remotion/transitions/flip';

<TransitionSeries.Transition
  presentation={flip({direction: 'from-left'})}
  timing={linearTiming({durationInFrames: 25})}
/>
```

**Clock Wipe:**
```tsx
import {clockWipe} from '@remotion/transitions/clock-wipe';

<TransitionSeries.Transition
  presentation={clockWipe()}
  timing={linearTiming({durationInFrames: 30})}
/>
```

### Timing Options

**Linear Timing (constant speed):**
```tsx
import {linearTiming} from '@remotion/transitions';

timing={linearTiming({durationInFrames: 20})}
```

**Spring Timing (natural motion):**
```tsx
import {springTiming} from '@remotion/transitions';

// With explicit duration
timing={springTiming({
  config: {damping: 200},
  durationInFrames: 25
})}

// Auto-calculated duration
timing={springTiming({
  config: {damping: 200}
})}
```

### Multiple Clips with Transitions

```tsx
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {OffthreadVideo} from 'remotion';
import {staticFile} from 'remotion';

export const MultiClipTransitions: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={150}>
        <OffthreadVideo src={staticFile('intro.mp4')} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({durationInFrames: 15})}
      />

      <TransitionSeries.Sequence durationInFrames={300}>
        <OffthreadVideo src={staticFile('part1.mp4')} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({direction: 'from-right'})}
        timing={linearTiming({durationInFrames: 20})}
      />

      <TransitionSeries.Sequence durationInFrames={300}>
        <OffthreadVideo src={staticFile('part2.mp4')} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({durationInFrames: 15})}
      />

      <TransitionSeries.Sequence durationInFrames={90}>
        <OffthreadVideo src={staticFile('outro.mp4')} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
```

### Dynamic Clips from Array

```tsx
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {OffthreadVideo} from 'remotion';
import {staticFile} from 'remotion';

interface Clip {
  src: string;
  durationInFrames: number;
}

const clips: Clip[] = [
  {src: 'intro.mp4', durationInFrames: 150},
  {src: 'main.mp4', durationInFrames: 600},
  {src: 'outro.mp4', durationInFrames: 90},
];

export const DynamicTransitions: React.FC = () => {
  return (
    <TransitionSeries>
      {clips.map((clip, index) => (
        <>
          <TransitionSeries.Sequence key={index} durationInFrames={clip.durationInFrames}>
            <OffthreadVideo src={staticFile(clip.src)} />
          </TransitionSeries.Sequence>
          {index < clips.length - 1 && (
            <TransitionSeries.Transition
              presentation={fade()}
              timing={linearTiming({durationInFrames: 15})}
            />
          )}
        </>
      ))}
    </TransitionSeries>
  );
};
```

### Calculate Total Duration

Transitions overlap scenes, reducing total duration:

```tsx
import {linearTiming} from '@remotion/transitions';

const clip1 = 150;
const clip2 = 300;
const clip3 = 90;

const transition1 = linearTiming({durationInFrames: 15});
const transition2 = linearTiming({durationInFrames: 15});

const t1Duration = transition1.getDurationInFrames({fps: 30});
const t2Duration = transition2.getDurationInFrames({fps: 30});

const totalDuration = clip1 + clip2 + clip3 - t1Duration - t2Duration;
// 150 + 300 + 90 - 15 - 15 = 510 frames
```

---

## Tips

- Transition duration: 10-30 frames (0.3-1 second at 30fps)
- Use `fade` for subtle, professional cuts
- Use `slide` when scenes are related
- Use `wipe` for before/after comparisons
- Use `fadeblack` for dramatic scene changes
- Keep transitions consistent throughout a video
- Total output duration = sum of clips - sum of transition durations

---

## Edge Cases & Gotchas

### Import each transition separately (Remotion)
```tsx
// CORRECT
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';

// WRONG - won't work
import {fade, slide} from '@remotion/transitions';
```

### Timing is required (Remotion)
```tsx
// CORRECT
timing={linearTiming({durationInFrames: 15})}

// WRONG
timing={{durationInFrames: 15}}
```

### Duration mismatch (Remotion)
If composition duration doesn't account for transition overlaps, video will cut off:
```tsx
// 3 clips of 150 frames each, 2 transitions of 15 frames
const totalDuration = 150 + 150 + 150 - 15 - 15; // = 420, not 450
```
