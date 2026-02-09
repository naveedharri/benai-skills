---
name: video-analysis
description: Analyze video files using ffprobe
metadata:
  tags: video, ffprobe, analysis, metadata
---

# Video Analysis

Use ffprobe to analyze video files before editing. Always analyze to understand what you're working with.

---

## Quick Analysis Commands

### Duration
```bash
ffprobe -v error -show_entries format=duration -of csv=p=0 video.mp4
# Output: 125.040000 (seconds)
```

### Resolution
```bash
ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 video.mp4
# Output: 1920,1080
```

### Frame Rate
```bash
ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 video.mp4
# Output: 30/1 (means 30fps)
```

### Video Codec
```bash
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 video.mp4
# Output: h264
```

### Audio Codec
```bash
ffprobe -v error -select_streams a:0 -show_entries stream=codec_name -of csv=p=0 video.mp4
# Output: aac
```

### Check if Has Audio
```bash
ffprobe -v error -select_streams a -show_entries stream=codec_type -of csv=p=0 video.mp4
# Output: "audio" if has audio, empty if no audio
```

### Bitrate
```bash
ffprobe -v error -show_entries format=bit_rate -of csv=p=0 video.mp4
# Output: 5000000 (bits per second)
```

---

## Full Metadata as JSON

Get everything in one command:

```bash
ffprobe -v quiet -print_format json -show_format -show_streams video.mp4
```

### Parse Key Info from JSON

```bash
# Using jq
ffprobe -v quiet -print_format json -show_format -show_streams video.mp4 | jq '{
  duration: .format.duration,
  size_mb: (.format.size | tonumber / 1048576 | floor),
  width: .streams[0].width,
  height: .streams[0].height,
  fps: .streams[0].r_frame_rate,
  video_codec: .streams[0].codec_name,
  has_audio: (.streams | map(select(.codec_type == "audio")) | length > 0)
}'
```

---

## Batch Analysis

Analyze multiple videos at once:

```bash
for video in *.mp4; do
  echo "=== $video ==="
  duration=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$video")
  resolution=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$video")
  echo "Duration: ${duration}s | Resolution: ${resolution}"
done
```

### Output as Table

```bash
printf "%-30s %10s %12s %8s\n" "File" "Duration" "Resolution" "Codec"
printf "%-30s %10s %12s %8s\n" "----" "--------" "----------" "-----"
for video in *.mp4; do
  duration=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$video" | cut -d. -f1)
  resolution=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$video")
  codec=$(ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 "$video")
  printf "%-30s %10ss %12s %8s\n" "$video" "$duration" "$resolution" "$codec"
done
```

---

## When to Analyze

### Before Stitching
Check compatibility:
- Same codec? (if not, use filter_complex instead of concat demuxer)
- Same resolution? (scale if different)
- Same frame rate? (may need to conform)

```bash
# Quick compatibility check
for video in clip1.mp4 clip2.mp4 clip3.mp4; do
  echo "$video:"
  ffprobe -v error -select_streams v:0 \
    -show_entries stream=codec_name,width,height,r_frame_rate \
    -of csv=p=0 "$video"
done
```

### Before Teasers
Get total duration to plan cuts:
```bash
duration=$(ffprobe -v error -show_entries format=duration -of csv=p=0 video.mp4)
echo "Total: ${duration}s - targeting 30s teaser"
```

### Before Transitions
Verify clips will join smoothly:
- Check frame rates match
- Check resolutions match
- Check audio sample rates

### Before Captions
Check audio exists and get duration for transcription planning:
```bash
has_audio=$(ffprobe -v error -select_streams a -show_entries stream=codec_type -of csv=p=0 video.mp4)
if [ -n "$has_audio" ]; then
  echo "Audio found - can transcribe"
else
  echo "No audio - captions will need manual input"
fi
```

---

## Scene Detection

Find scene changes (useful for automatic cut points):

```bash
# Detect I-frames (keyframes, often scene changes)
ffprobe -v quiet -select_streams v -show_frames \
  -show_entries frame=pts_time,pict_type \
  -of csv=p=0 video.mp4 | grep ",I" | cut -d, -f1
```

### Scene Change Detection with ffmpeg

```bash
# Detect scenes with >40% change (adjust threshold as needed)
ffmpeg -i video.mp4 -filter:v "select='gt(scene,0.4)',showinfo" -f null - 2>&1 | \
  grep showinfo | grep pts_time
```

---

## Audio Analysis

### Volume Levels
```bash
ffmpeg -i video.mp4 -af "volumedetect" -f null - 2>&1 | grep -E "max_volume|mean_volume"
# Output: max_volume: -1.0 dB, mean_volume: -18.5 dB
```

### Detect Silence
```bash
# Find silent sections (useful for cut points)
ffmpeg -i video.mp4 -af "silencedetect=noise=-30dB:d=0.5" -f null - 2>&1 | grep silence
# Output: silence_start: 5.2, silence_end: 5.8, silence_duration: 0.6
```

---

## Extracting Frames

### Extract Thumbnail
```bash
# At specific time
ffmpeg -i video.mp4 -ss 00:00:05 -vframes 1 thumbnail.jpg

# First frame
ffmpeg -i video.mp4 -vframes 1 first_frame.jpg
```

### Extract Multiple Frames
```bash
# Every 10 seconds
ffmpeg -i video.mp4 -vf "fps=1/10" frame_%03d.jpg

# All I-frames (keyframes)
ffmpeg -i video.mp4 -vf "select='eq(pict_type,I)'" -vsync vfr keyframe_%03d.jpg
```

---

## Troubleshooting

### "Avi header" or codec errors
File might be corrupted or use unsupported codec:
```bash
ffprobe -v error video.mp4
# Check for error messages
```

### Very slow analysis
For long videos, limit analysis to first portion:
```bash
ffprobe -v error -read_intervals "%+30" -show_entries format=duration video.mp4
# Only reads first 30 seconds
```

### Missing streams
Verify stream indices:
```bash
ffprobe -v error -show_entries stream=index,codec_type -of csv=p=0 video.mp4
# Output: 0,video / 1,audio
```
