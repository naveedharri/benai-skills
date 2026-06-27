---
name: ffmpeg-basics
description: Common FFmpeg patterns, installation, and troubleshooting
metadata:
  tags: ffmpeg, video, cli, reference
---

# FFmpeg Basics

Common FFmpeg patterns for video editing.

## Installation

### macOS
```bash
brew install ffmpeg
```

### Check Installation
```bash
which ffmpeg || echo "FFmpeg not installed"
which ffprobe || echo "FFprobe not installed"
```

---

## Essential Commands

### Get Video Information
```bash
# Duration
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 video.mp4

# Codec
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 video.mp4

# Resolution
ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 video.mp4

# Full info
ffprobe -v quiet -print_format json -show_format -show_streams video.mp4
```

### Basic Trimming
```bash
# First 30 seconds
ffmpeg -i input.mp4 -t 30 -c copy output.mp4

# From timestamp to timestamp
ffmpeg -ss 00:01:00 -i input.mp4 -to 00:02:00 -c copy output.mp4

# 30 seconds starting at 1 minute
ffmpeg -ss 60 -i input.mp4 -t 30 -c copy output.mp4
```

**Note**: `-ss` before `-i` = fast seeking (may be imprecise), after `-i` = accurate seeking (slower)

### Format Conversion
```bash
# To MP4
ffmpeg -i input.mov -c:v libx264 -c:a aac output.mp4

# To WebM
ffmpeg -i input.mp4 -c:v libvpx-vp9 -c:a libopus output.webm

# Extract audio only
ffmpeg -i video.mp4 -vn -c:a mp3 audio.mp3
```

### Scale/Resize
```bash
# To 1080p (maintain aspect ratio)
ffmpeg -i input.mp4 -vf "scale=1920:-1" output.mp4

# To exact dimensions (may distort)
ffmpeg -i input.mp4 -vf "scale=1920:1080" output.mp4

# Fit in 1080p with padding
ffmpeg -i input.mp4 -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" output.mp4
```

---

## Quality Settings

### For YouTube Upload
```bash
ffmpeg -i input.mp4 \
  -c:v libx264 -preset medium -crf 18 \
  -c:a aac -b:a 192k \
  output.mp4
```

**CRF values:**
- 18 = High quality (recommended)
- 23 = Default
- 28 = Lower quality, smaller file

**Presets (speed vs compression):**
- `ultrafast`, `superfast`, `veryfast`, `faster`, `fast`
- `medium` (default, good balance)
- `slow`, `slower`, `veryslow`

### Stream Copy (No Re-encoding)
```bash
ffmpeg -i input.mp4 -c copy output.mp4
```

Use when you don't need to modify video/audio streams. Very fast.

---

## Fades

### Audio Fade
```bash
# Fade in first 2 seconds
ffmpeg -i input.mp4 -af "afade=t=in:st=0:d=2" -c:v copy output.mp4

# Fade out last 2 seconds (for 30s video)
ffmpeg -i input.mp4 -af "afade=t=out:st=28:d=2" -c:v copy output.mp4
```

### Video Fade
```bash
# Fade in
ffmpeg -i input.mp4 -vf "fade=t=in:st=0:d=1" -c:a copy output.mp4

# Fade out (for 30s video)
ffmpeg -i input.mp4 -vf "fade=t=out:st=28:d=2" -c:a copy output.mp4

# Both (requires re-encoding)
ffmpeg -i input.mp4 \
  -vf "fade=t=in:st=0:d=1,fade=t=out:st=28:d=2" \
  -af "afade=t=in:st=0:d=1,afade=t=out:st=28:d=2" \
  -c:v libx264 -c:a aac \
  output.mp4
```

---

## Common Flags

| Flag | Description |
|------|-------------|
| `-i` | Input file |
| `-c copy` | Stream copy (no re-encode) |
| `-c:v` | Video codec |
| `-c:a` | Audio codec |
| `-vf` | Video filter |
| `-af` | Audio filter |
| `-t` | Duration (seconds) |
| `-ss` | Start time |
| `-to` | End time |
| `-y` | Overwrite output without asking |
| `-n` | Don't overwrite output |
| `-f` | Force format |
| `-map` | Select streams |

---

## Troubleshooting

### "Non-monotonic DTS" Warning
Timestamps may be off. Fix with:
```bash
ffmpeg -f concat -safe 0 -i list.txt -c copy -fflags +genpts output.mp4
```

### Audio Out of Sync
```bash
ffmpeg -i input.mp4 -async 1 -c:v copy -c:a aac output.mp4
```

### Path with Spaces
Always quote paths:
```bash
# CORRECT
ffmpeg -i "My Video.mp4" -c copy output.mp4

# WRONG
ffmpeg -i My Video.mp4 -c copy output.mp4
```

### Missing Audio Track
Add silent audio:
```bash
ffmpeg -i video_no_audio.mp4 -f lavfi -i anullsrc=r=44100:cl=stereo -shortest -c:v copy -c:a aac output.mp4
```

### Check Codec Compatibility
Before concat with `-c copy`:
```bash
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 video1.mp4
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 video2.mp4
```

### File List for Concat
```bash
# Create list.txt
file '/path/to/video1.mp4'
file '/path/to/video2.mp4'
file '/path/to/video3.mp4'
```

Or generate dynamically:
```bash
for f in *.mp4; do echo "file '$f'"; done > list.txt
```

---

## Reference

### Common Video Codecs
| Codec | FFmpeg Name | Use Case |
|-------|-------------|----------|
| H.264 | libx264 | Universal compatibility |
| H.265 | libx265 | Better compression, less compatible |
| VP9 | libvpx-vp9 | WebM format |

### Common Audio Codecs
| Codec | FFmpeg Name | Use Case |
|-------|-------------|----------|
| AAC | aac | Universal, good quality |
| MP3 | libmp3lame | Wide compatibility |
| Opus | libopus | WebM, very efficient |
