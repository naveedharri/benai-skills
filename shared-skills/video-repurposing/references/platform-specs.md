---
name: platform-specs
description: Output resolution, fps, and duration targets per social platform
metadata:
  tags: video, platform, resolution, fps, duration
---

# Platform Specs

Target these output specs by destination platform.

| Platform | Resolution | FPS | Max duration | Notes |
|---|---|---|---|---|
| LinkedIn | 1920x1080 (16:9) | 30 | 10 min | H.264 MP4; native-feeling hard cuts |
| TikTok / Reels / Shorts | 1080x1920 (9:16) | 30 | 60-90s | word-highlight captions carry sound-off viewing |
| Square feed | 1080x1080 (1:1) | 30 | - | |

Social-quality render command:

```bash
npx remotion render CompositionName out/video.mp4 --video-bitrate 50M --audio-bitrate 320k
```
