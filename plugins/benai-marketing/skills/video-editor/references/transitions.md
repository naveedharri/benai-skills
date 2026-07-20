---
name: video-transitions
description: Add transitions (fade, slide, wipe) between video clips
metadata:
  tags: video, transitions, fade, slide, wipe, ffmpeg, remotion
---

# Video Transitions

**Contents:** §1 When NOT to use transitions · §2 The TransitionSeries bug (and the hard-cut replacement) · §3 When to Use Each Tool · §4 FFmpeg Approach · §5 Remotion Approach · §6 Audio During Transitions · §7 Tips · §8 Edge Cases & Gotchas

Add blended transitions between video clips. This file covers the OPTIONAL crossfade mode.

## When NOT to Use Transitions (read this first)

**Hard cuts are the DEFAULT for social clips - LinkedIn, TikTok, Reels, Shorts.** No transitions. Ever. No fades on video or audio, no crossfades, no dissolves. Clip ends on one frame, the next begins on the very next frame, audio at full volume throughout. Clean hard cuts read as confident and native on social feeds; fades read as template-ware.

If you are cutting a social clip, skip this file entirely and use the hard-cut pattern in [stitching.md](stitching.md) (plain `<Sequence>` blocks + `premountFor={60}`).

**Use this file only for crossfade mode:** trailers, teasers, and montages where the user explicitly wants blended transitions. Even then, keep the audio rules in the "Audio During Transitions" section - overlapping audio noise is never acceptable.

## The TransitionSeries Bug (and the Hard-Cut Replacement)

> **WARNING: Do not use `TransitionSeries`.** It has a known null-props bug in current Remotion versions that crashes Studio. The `TransitionSeries` examples further down this file are kept for reference only.

The replacement for stitching clips is plain `Sequence` hard cuts:

```tsx
// premountFor={60} is MANDATORY on every Sequence - it preloads the next clip 2s early.
// Without it OffthreadVideo hasn't decoded the next clip's first frame and you get a black flash at the cut.
<Sequence from={0} durationInFrames={clips[0].duration} premountFor={60}>
  <OffthreadVideo src={staticFile('source_h264.mp4')} startFrom={clips[0].startFrame} endAt={clips[0].endFrame} />
</Sequence>

<Sequence from={clips[0].duration} durationInFrames={clips[1].duration} premountFor={60}>
  <OffthreadVideo src={staticFile('source_h264.mp4')} startFrom={clips[1].startFrame} endAt={clips[1].endFrame} />
</Sequence>
```

Total duration = sum of clip durations (no overlap, no subtraction). Full pattern with the CLIPS config block: [stitching.md](stitching.md).

If you genuinely need a visual crossfade (crossfade mode), build it with overlapping plain `Sequence` blocks and `interpolate` opacity plus the `createVolumeFn` audio pattern below - not with `TransitionSeries`.

---

## When to Use Each Tool

| Scenario | Recommended Tool |
|----------|------------------|
| Social clip (LinkedIn/TikTok/Reels) | No transitions - hard cuts via plain `Sequence` ([stitching.md](stitching.md)) |
| Simple 2-clip crossfade | FFmpeg xfade |
| Multiple transitions in a styled comp | Remotion (plain `Sequence` overlap + `interpolate` - NOT `TransitionSeries`) |
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

> **WARNING:** The `TransitionSeries` code below is reference material for the API shapes and timing math only. `TransitionSeries` currently crashes Studio (null-props bug) - build real compositions with overlapping plain `Sequence` blocks + `interpolate` opacity, or better, hard cuts (see the top of this file).

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

## Audio During Transitions (CRITICAL)

**Problem:** When using `TransitionSeries`, the visual fade works but both audio tracks play simultaneously during the overlap, creating noise.

**Solution:** Use the `volume` callback on `OffthreadVideo` to fade audio independently from the visual transition. The audio should stay loud until the very end, then drop with a cubic ease-out curve, creating a brief silence gap before the next clip fades in.

### Approved Audio Transition Pattern

Uses **cosine curves** for natural-sounding fades: starts slow, accelerates through the middle, ends slow. No hard silence gap; the curves overlap naturally so one voice trails off as the other comes in.

```tsx
// Audio timing constants (at 30fps)
const TRANSITION_FRAMES = 30;     // 1s visual crossfade
const AUDIO_FADEOUT_FRAMES = 45;  // 1.5s, gradual cosine fade-out
const AUDIO_FADEIN_FRAMES = 36;   // 1.2s, gradual cosine fade-in

// Volume callback for each clip
const createVolumeFn = (
  clipDurationFrames: number,
  isFirst: boolean,
  isLast: boolean,
) => {
  return (f: number) => {
    let vol = 1;

    // Fade in with cosine curve (except first clip)
    if (!isFirst && f < AUDIO_FADEIN_FRAMES) {
      const progress = f / AUDIO_FADEIN_FRAMES; // 0→1
      // Cosine ease: 0 → 1 smoothly
      vol = (1 - Math.cos(progress * Math.PI)) / 2;
    }

    // Fade out with cosine curve (except last clip)
    if (!isLast) {
      const fadeOutStart = clipDurationFrames - AUDIO_FADEOUT_FRAMES;
      if (f >= fadeOutStart) {
        const progress = (f - fadeOutStart) / AUDIO_FADEOUT_FRAMES; // 0→1
        // Cosine ease: 1 → 0 smoothly
        vol *= (1 + Math.cos(progress * Math.PI)) / 2;
      }
    }

    return Math.max(0, Math.min(1, vol));
  };
};
```

### Usage with OffthreadVideo

```tsx
<OffthreadVideo
  src={staticFile(clip.src)}
  volume={createVolumeFn(clip.durationFrames, index === 0, index === clips.length - 1)}
/>
```

### Usage in TransitionSeries (reference only - see bug warning at top)

**IMPORTANT:** Always set `premountFor={60}` (2 seconds) to preload the next clip before the transition starts. Without this, the video freezes briefly while decoding the first frame. This applies equally when you rebuild this pattern with plain overlapping `Sequence` blocks (the recommended way, given the `TransitionSeries` crash).

```tsx
<TransitionSeries>
  {clips.map((clip, index) => (
    <React.Fragment key={index}>
      <TransitionSeries.Sequence durationInFrames={clip.durationFrames} premountFor={60}>
        <OffthreadVideo
          src={staticFile(clip.src)}
          volume={createVolumeFn(clip.durationFrames, index === 0, index === clips.length - 1)}
        />
      </TransitionSeries.Sequence>
      {index < clips.length - 1 && (
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
        />
      )}
    </React.Fragment>
  ))}
</TransitionSeries>
```

### How It Works

1. **Outgoing clip:** Audio fades with a cosine curve over 1.5s: starts slow, accelerates, ends slow
2. **Incoming clip:** Audio fades in with a cosine curve over 1.2s: voice rises gradually
3. **No hard silence gap** - the cosine curves overlap naturally, one voice trails off as the other comes in
4. **Premount:** Each clip starts loading 2s before it's needed so video is decoded and ready

**Key points:**
- First clip has no fade-in, last clip has no fade-out
- Cosine curves are critical: linear and cubic fades sound unnatural (too abrupt or drops too early)
- `(1 + cos(progress * π)) / 2` for fade-out (1→0), `(1 - cos(progress * π)) / 2` for fade-in (0→1)
- The `volume` prop accepts a callback `(frame) => number` for per-frame control
- Visual crossfade is 1s (30 frames); 0.4s is too fast and feels jarring

**For FFmpeg:** Use `acrossfade` filter alongside `xfade` (see FFmpeg section above).

---

## Tips

- Transition duration: 10-30 frames (0.3-1 second at 30fps)
- Use `fade` for subtle, professional cuts
- Use `slide` when scenes are related
- Use `wipe` for before/after comparisons
- Use `fadeblack` for dramatic scene changes
- Keep transitions consistent throughout a video
- Total output duration = sum of clips - sum of transition durations
- **Always handle audio during transitions** - visual-only fades create overlapping audio noise

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
