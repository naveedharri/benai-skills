---
name: video-stitching
description: Combine multiple video clips into a single video
metadata:
  tags: video, stitching, concat, merge, ffmpeg, remotion
---

# Video Stitching

**Contents:** §1 When to Use Each Tool · §2 FFmpeg Approach · §3 Remotion Approach (hard-cut pattern is primary) · §4 Common Issues · §5 Final Video Assembly Workflow · §6 Edge Cases & Gotchas

Combine multiple video clips into one continuous video. For social clips (LinkedIn, TikTok, Reels) the default is hard cuts - no transitions of any kind - built with the plain-`Sequence` pattern below.

## When to Use Each Tool

| Scenario | Recommended Tool |
|----------|------------------|
| Same codec, no effects | FFmpeg concat demuxer |
| Different codecs/resolutions | FFmpeg filter_complex |
| Styled/previewed social clips (default) | Remotion plain `Sequence` hard cuts (below) |
| Blended transitions (trailers/montages only) | Remotion - see [transitions.md](transitions.md); do NOT use `TransitionSeries` (crash bug) |
| Programmatic/dynamic simple concat | Remotion Series |

---

## FFmpeg Approach

### Method 1: Concat Demuxer (Same Codec)

The fastest method when all clips have the same codec, resolution, and frame rate.

**Create a file list:**
```bash
# Create list.txt with this format:
file '/path/to/video1.mp4'
file '/path/to/video2.mp4'
file '/path/to/video3.mp4'
```

Or generate dynamically:
```bash
# List all MP4 files in current directory
for f in *.mp4; do echo "file '$f'"; done > list.txt

# List specific files
printf "file '%s'\n" video1.mp4 video2.mp4 video3.mp4 > list.txt
```

**Run the concat:**
```bash
ffmpeg -f concat -safe 0 -i list.txt -c copy output.mp4
```

**Flags:**
- `-f concat`: Use concat demuxer
- `-safe 0`: Allow absolute paths
- `-c copy`: Stream copy (no re-encoding, very fast)

### Method 2: Filter Complex (Different Codecs/Resolutions)

Required when clips have different properties. Re-encodes all videos.

**Two clips:**
```bash
ffmpeg -i video1.mp4 -i video2.mp4 \
  -filter_complex "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[outv][outa]" \
  -map "[outv]" -map "[outa]" output.mp4
```

**Three or more clips:**
```bash
ffmpeg -i video1.mp4 -i video2.mp4 -i video3.mp4 \
  -filter_complex "[0:v][0:a][1:v][1:a][2:v][2:a]concat=n=3:v=1:a=1[outv][outa]" \
  -map "[outv]" -map "[outa]" output.mp4
```

**Parameters:**
- `n=X`: Number of segments to concat
- `v=1`: One video stream output
- `a=1`: One audio stream output

### Scaling to Uniform Resolution

If clips have different resolutions, scale them first:
```bash
ffmpeg -i video1.mp4 -i video2.mp4 \
  -filter_complex "
    [0:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2[v0];
    [1:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2[v1];
    [v0][0:a][v1][1:a]concat=n=2:v=1:a=1[outv][outa]
  " \
  -map "[outv]" -map "[outa]" output.mp4
```

### Videos Without Audio

If videos have no audio track:
```bash
ffmpeg -i video1.mp4 -i video2.mp4 \
  -filter_complex "[0:v][1:v]concat=n=2:v=1:a=0[outv]" \
  -map "[outv]" output.mp4
```

### Output Quality Settings

For YouTube-quality output:
```bash
ffmpeg -i video1.mp4 -i video2.mp4 \
  -filter_complex "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[outv][outa]" \
  -map "[outv]" -map "[outa]" \
  -c:v libx264 -preset medium -crf 18 \
  -c:a aac -b:a 192k \
  output.mp4
```

---

## Remotion Approach

**Note:** `@remotion/media` does NOT exist. Use `OffthreadVideo` from the core `remotion` package.

### The Hard-Cut Pattern (PRIMARY - use this for social clips)

Stitch clips from one source video with plain `<Sequence>` blocks. Timestamps come from the whisper transcript (see [transcription.md](transcription.md)); the audio cut derives from the caption boundary via a per-clip `audioBufferMs` because whisper timestamps run 200-700ms ahead of actual speech.

```tsx
const CLIPS = [
  {
    label: 'Hook',
    startMs: 148_920,   // "The reason most automations fail..." (whisper timestamp of first spoken word)
    endMs: 238_340,     // "...and that's what makes it work." (whisper timestamp of last spoken word)
    audioBufferMs: 200, // per-clip: small (200) when the next sentence starts fast, up to 700 when there's a gap
  },
  {
    label: 'Payoff',
    startMs: 312_400,   // "Here's the part nobody talks about..." (first spoken word)
    endMs: 355_180,     // "...and you can copy it today." (last spoken word - never a punctuation token)
    audioBufferMs: 500,
  },
] as const;

// Derived: audio end = endMs + audioBufferMs. Never set audio boundaries independently.
const clips = CLIPS.map((c) => {
  const audioEndMs = c.endMs + c.audioBufferMs;
  return {
    ...c,
    audioEndMs,
    startFrame: msToFrames(c.startMs),
    endFrame:   msToFrames(audioEndMs),
    duration:   msToFrames(audioEndMs - c.startMs),
  };
});
```

```tsx
// premountFor={60} preloads the video 2s before it becomes visible - prevents black flash at cut points
<Sequence from={0} durationInFrames={clips[0].duration} premountFor={60}>
  <OffthreadVideo src={staticFile('source_h264.mp4')} startFrom={clips[0].startFrame} endAt={clips[0].endFrame} />
</Sequence>

<Sequence from={clips[0].duration} durationInFrames={clips[1].duration} premountFor={60}>
  <OffthreadVideo src={staticFile('source_h264.mp4')} startFrom={clips[1].startFrame} endAt={clips[1].endFrame} />
</Sequence>
```

**Rules that make this work:**

- **Total duration = sum of all clip durations.** No overlap, no subtraction - hard cuts don't consume frames.
- **`premountFor={60}` is mandatory on every Sequence.** Without it, `OffthreadVideo` hasn't decoded the first frame of the next clip by the time the cut hits, causing a black flash between clips.
- **Do not use `TransitionSeries`** - it has a known null-props bug in current Remotion versions that crashes Studio. Plain `Sequence` blocks are the replacement.
- Document every timestamp with the actual spoken words as a comment, and keep the `CLIPS` block at the top of the file as the only place to edit.
- No fades on video or audio: clips start and stop at full volume. That is the point of hard-cut mode.

### Basic Stitching with Series (simple concat of separate files)

The `<Series>` component plays sequences one after another:

```tsx
import {Series, staticFile, OffthreadVideo} from 'remotion';

export const StitchedVideo: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={300}>
        <OffthreadVideo src={staticFile('intro.mp4')} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={600}>
        <OffthreadVideo src={staticFile('main.mp4')} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={150}>
        <OffthreadVideo src={staticFile('outro.mp4')} />
      </Series.Sequence>
    </Series>
  );
};
```

### Dynamic Stitching from Array

```tsx
import {Series, staticFile} from 'remotion';
import {OffthreadVideo} from 'remotion';

interface Clip {
  src: string;
  durationInFrames: number;
}

const clips: Clip[] = [
  {src: 'intro.mp4', durationInFrames: 300},
  {src: 'part1.mp4', durationInFrames: 450},
  {src: 'part2.mp4', durationInFrames: 600},
  {src: 'outro.mp4', durationInFrames: 150},
];

export const DynamicStitch: React.FC = () => {
  return (
    <Series>
      {clips.map((clip, index) => (
        <Series.Sequence key={index} durationInFrames={clip.durationInFrames}>
          <OffthreadVideo src={staticFile(clip.src)} />
        </Series.Sequence>
      ))}
    </Series>
  );
};
```

### With Transitions (crossfade mode - optional, never for social clips)

Blended transitions are only for trailers, teasers, and montages where the user explicitly asks for them. See [transitions.md](transitions.md) for the crossfade timing and the `createVolumeFn` audio pattern.

**Do NOT reach for `TransitionSeries`** - it crashes Studio with a null-props bug in current Remotion versions. Build crossfades with overlapping plain `Sequence` blocks and `interpolate` opacity instead.

### Calculating Total Duration

```tsx
const clips = [
  {durationInFrames: 300},
  {durationInFrames: 600},
  {durationInFrames: 150},
];

const totalDuration = clips.reduce((sum, clip) => sum + clip.durationInFrames, 0);
// Use totalDuration in your Composition definition
```

### Composition Registration

```tsx
import {Composition} from 'remotion';
import {StitchedVideo} from './compositions/StitchedVideo';

const FPS = 30;
const TOTAL_DURATION = 1050; // Sum of all clip durations

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="StitchedVideo"
      component={StitchedVideo}
      durationInFrames={TOTAL_DURATION}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
```

---

## Common Issues

### "Non-monotonic DTS" warning (FFmpeg)
```bash
ffmpeg -f concat -safe 0 -i list.txt -c copy -fflags +genpts output.mp4
```

### Different frame rates (FFmpeg)
```bash
ffmpeg -i video1.mp4 -i video2.mp4 \
  -filter_complex "[0:v]fps=30[v0];[1:v]fps=30[v1];[v0][0:a][v1][1:a]concat=n=2:v=1:a=1[outv][outa]" \
  -map "[outv]" -map "[outa]" output.mp4
```

### Missing audio track (FFmpeg)
Add silent audio track:
```bash
ffmpeg -i video_no_audio.mp4 -f lavfi -i anullsrc=r=44100:cl=stereo -shortest -c:v copy -c:a aac output.mp4
```

### Video not appearing (Remotion)
1. Verify file exists in `public/` folder
2. Check browser console for errors
3. Ensure `staticFile()` path matches exactly (case-sensitive)

---

## Final Video Assembly Workflow

**IMPORTANT: Always create a final video once captions and edits are complete.**

The final video structure should be:

```
[TEASER with captions] → [INTRO with captions] → [PART 1] → [PART 2] → ...
```

**Teasers should also have captions** - Filter captions to each clip's time range and adjust timing to be relative to clip start.

### Complete Final Video Pattern

```tsx
// 1. Define teaser clips (standalone highlights) WITH caption sources
const TEASER_CLIPS = [
  {src: 'intro.mp4', captionsFile: 'intro.captions.json', startMs: 130, endMs: 7440},
  {src: 'part3.mp4', captionsFile: 'part3.captions.json', startMs: 336370, endMs: 344840},
  // ... more highlights
];

// 2. Calculate teaser duration
const TEASER_DURATION_FRAMES = Math.round(
  TEASER_CLIPS.reduce((total, clip) =>
    total + (clip.endMs - clip.startMs), 0) / 1000 * fps
);

// 3. Define main video segments with captions
const segments = [
  {name: 'intro', src: 'intro.mp4', captionsFile: 'intro.captions.json', duration: 2004},
  {name: 'part1', src: 'part1.mp4', captionsFile: 'part1.captions.json', duration: 7050},
  // ... more segments
];

// 4. Assemble: Teaser first (with captions), then main content
export const FinalVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      {/* TEASER - WITH captions (filtered to clip time ranges) */}
      <Sequence from={0} durationInFrames={TEASER_DURATION_FRAMES}>
        <TeaserSection /> {/* Each clip loads + filters its own captions */}
      </Sequence>

      {/* MAIN CONTENT - With captions */}
      {segments.map((segment) => (
        <Sequence from={segment.startFrame} durationInFrames={segment.duration}>
          <VideoWithCaptions src={segment.src} captionsFile={segment.captionsFile} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
```

### Teaser Clip with Filtered Captions

Each teaser clip needs to:
1. Load captions from the source video's caption file
2. Filter to only captions within the clip's time range
3. Adjust timing to be relative to clip start (subtract startMs)

```tsx
// Filter captions for a teaser clip
const filtered = allCaptions
  .filter((cap) => cap.startMs >= clipStartMs && cap.endMs <= clipEndMs)
  .map((cap) => ({
    ...cap,
    startMs: cap.startMs - clipStartMs,  // Adjust to relative timing
    endMs: cap.endMs - clipStartMs,
    timestampMs: cap.timestampMs - clipStartMs,
  }));
```

### Checklist Before Final Video

- [ ] All video clips transcribed with word-level timestamps
- [ ] All caption JSON files generated and in `public/`
- [ ] Teaser clips selected (standalone sentences only)
- [ ] Teaser added at start of final video
- [ ] Total duration calculated correctly (teaser + all clips)
- [ ] Preview in Remotion Studio before rendering

---

## Edge Cases & Gotchas

- **Paths with spaces**: Always quote paths containing spaces
- **Concat demuxer fails silently**: Check codecs match before using `-c copy`
- **File naming**: Avoid spaces in video filenames
- **Folder names**: Remotion Folder names can only contain letters, numbers, hyphens
- **Port conflicts**: Remotion Studio may start on port 3001 if 3000 is busy
