---
name: transcription
description: Fast video transcription using Remotion's whisper.cpp with GPU acceleration
metadata:
  tags: video, audio, transcription, whisper, captions, remotion, gpu
---

# Video Transcription

**Contents:** §1 Speed Comparison · §2 Quick Start · §3 Transcription-First Timestamp Workflow · §4 Model Options · §5 Caption JSON Format · §6 Key Parameters · §7 Converting Python Whisper Output · §8 GPU Acceleration · §9 Troubleshooting · §10 Integration with Remotion Captions

Use Remotion's `@remotion/install-whisper-cpp` for fast local transcription with Metal GPU acceleration on Mac.

**IMPORTANT:** Do NOT use Python `whisper` - it's 10x slower. Always use `@remotion/install-whisper-cpp` which uses the C++ implementation with GPU support.

**Ready-made scripts:** this skill ships `scripts/setup-whisper.ts` and `scripts/transcribe.ts` in the skill folder. Copy them into the project's `scripts/` directory instead of rewriting them - the code below documents what they do.

---

## Speed Comparison

| Method | Part3 (8.5min video) | GPU |
|--------|---------------------|-----|
| Python whisper | ~15+ minutes | No |
| whisper.cpp (base.en) | ~85 seconds | Yes (Metal) |

---

## Quick Start

### 1. Install Dependencies

```bash
npm install @remotion/install-whisper-cpp
```

### 2. Setup Script (scripts/setup-whisper.ts)

```ts
import { installWhisperCpp, downloadWhisperModel } from '@remotion/install-whisper-cpp';
import path from 'path';

async function setup() {
  const whisperPath = path.join(process.cwd(), '.whisper');

  console.log('Installing whisper.cpp...');
  await installWhisperCpp({
    to: whisperPath,
    version: '1.5.5',
  });

  console.log('Downloading model...');
  await downloadWhisperModel({
    model: 'base.en',  // Fast + good quality
    folder: whisperPath,
  });

  console.log('Done!');
}

setup();
```

Run once: `npx ts-node scripts/setup-whisper.ts`

### 3. Transcription Script (scripts/transcribe-fast.ts)

```ts
import { transcribe } from '@remotion/install-whisper-cpp';
import { execSync } from 'child_process';
import { existsSync, writeFileSync } from 'fs';
import path from 'path';

const WHISPER_PATH = path.join(process.cwd(), '.whisper');

interface Caption {
  text: string;
  startMs: number;
  endMs: number;
  timestampMs: number;
  confidence: number;
}

async function transcribeVideo(videoPath: string): Promise<void> {
  const baseName = path.basename(videoPath, path.extname(videoPath));
  const audioPath = path.join(process.cwd(), `${baseName}.wav`);
  const captionsPath = path.join(process.cwd(), 'public', `${baseName}.captions.json`);

  if (existsSync(captionsPath)) {
    console.log(`Skipping ${baseName} - already transcribed`);
    return;
  }

  console.log(`Transcribing ${baseName}...`);

  // Extract audio (16kHz mono WAV required)
  execSync(`ffmpeg -y -i "${videoPath}" -vn -ar 16000 -ac 1 "${audioPath}"`, { stdio: 'inherit' });

  // Transcribe with whisper.cpp (GPU accelerated)
  const { transcription } = await transcribe({
    inputPath: audioPath,
    whisperPath: WHISPER_PATH,
    whisperCppVersion: '1.5.5',  // REQUIRED parameter
    model: 'base.en',
    tokenLevelTimestamps: true,  // For word-level captions
    printOutput: true,
  });

  // Convert to caption format
  const captions: Caption[] = transcription.map((item) => ({
    text: item.text,
    startMs: Math.round(item.offsets.from),
    endMs: Math.round(item.offsets.to),
    timestampMs: Math.round(item.offsets.from),
    confidence: 1,
  }));

  writeFileSync(captionsPath, JSON.stringify(captions, null, 2));
  console.log(`Created ${baseName}.captions.json (${captions.length} words)`);

  // Cleanup
  execSync(`rm -f "${audioPath}"`);
}

// Transcribe all videos
async function main() {
  const videos = ['public/intro.mp4', 'public/part1.mp4', 'public/part2.mp4', 'public/part3.mp4'];

  for (const video of videos) {
    if (existsSync(path.join(process.cwd(), video))) {
      await transcribeVideo(path.join(process.cwd(), video));
    }
  }
}

main();
```

Run: `npx ts-node scripts/transcribe-fast.ts`

---

## Transcription-First Timestamp Workflow (CRITICAL)

**The whisper transcription is the single source of truth for all clip boundaries.** Never scrub the video or guess timestamps - every `startMs`/`endMs` in a composition traces back to a whisper word timestamp.

### How it works

1. Transcribe with whisper.cpp (`tokenLevelTimestamps: true`) to get word-level timestamps
2. Find the first and last **spoken words** you want in the clip using whisper timestamps
3. Set `startMs` / `endMs` to those whisper word timestamps - these define **what captions to show**
4. Derive the audio/video cut by adding a per-clip `audioBufferMs` - whisper timestamps run ahead of actual speech, so the buffer lets the last word fully resolve in audio

### Key rules

- **Whisper timestamps run ahead of actual audio by ~200-700ms.** A word whisper marks as ending at 500ms may not finish in audio until 700-1200ms. Cutting at the raw `endMs` clips the last word.
- **Never set audio boundaries independently from caption boundaries.** Audio derives from captions (`audioEndMs = endMs + audioBufferMs`), not the other way around.
- **Punctuation tokens (".", ",") are NOT spoken.** They have timestamps in the transcript but never use them as `endMs` - use the last actual word's end.
- **Per-clip buffer is required.** Size each clip's `audioBufferMs` by the gap before the next sentence starts: tight gaps (~200ms to the next sentence) need small buffers; wide gaps can take up to 700ms.
- **Captions are filtered by the raw transcript bounds** (`startMs`/`endMs`), NOT the buffered audio end. That way words from the next sentence never flash on screen during the buffer zone even if their audio starts to bleed in.
- **Always verify by ear.** Preview in Remotion Studio and confirm the last word resolves fully and the next sentence doesn't bleed in. Adjust `audioBufferMs` per clip until it does.

### Config pattern

```tsx
const CLIPS = [
  {
    label: 'ClipName',
    startMs: 148_920,      // Whisper timestamp of first spoken word (with pre-roll buffer)
    endMs: 238_340,        // Whisper timestamp of last spoken word (never a punctuation token)
    audioBufferMs: 200,    // Extra ms for audio to catch up (varies per clip)
  },
] as const;

// Derived: audio end = endMs + audioBufferMs
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

The stitched composition built from this config (plain `Sequence` + `premountFor={60}`) is in [stitching.md](stitching.md).

---

## Model Options

| Model | Size | Speed | Quality | Use Case |
|-------|------|-------|---------|----------|
| `tiny.en` | 75MB | Fastest | Lower | Quick previews |
| `base.en` | 142MB | **Fast** | **Good** | **Recommended for dev** |
| `small.en` | 466MB | Medium | Better | Production |
| `medium.en` | 1.5GB | Slow | Best | Final quality |
| `large-v3-turbo` | ~3GB | Fast | Best | Best balance (requires whisper.cpp 1.7+) |

**Recommendation:** Use `base.en` for development, `medium.en` or `large-v3-turbo` for final renders.

---

## Caption JSON Format

Output format compatible with `@remotion/captions`:

```json
[
  {
    "text": " In",
    "startMs": 0,
    "endMs": 260,
    "timestampMs": 0,
    "confidence": 1
  },
  {
    "text": " the",
    "startMs": 260,
    "endMs": 400,
    "timestampMs": 260,
    "confidence": 1
  }
]
```

---

## Key Parameters

```ts
await transcribe({
  inputPath: audioPath,           // Path to WAV file (16kHz mono)
  whisperPath: WHISPER_PATH,      // Path to .whisper folder
  whisperCppVersion: '1.5.5',     // REQUIRED - must match installed version
  model: 'base.en',               // Model to use
  tokenLevelTimestamps: true,     // REQUIRED for word-level captions
  printOutput: true,              // Show progress
});
```

---

## Converting Python Whisper Output

If you have existing Python whisper JSON output, convert it:

```js
// scripts/convert-captions.js
const fs = require('fs');
const path = require('path');

function convertToCaption(whisperJson) {
  const captions = [];
  for (const segment of whisperJson.segments) {
    if (segment.words) {
      for (const word of segment.words) {
        captions.push({
          text: word.word,
          startMs: Math.round(word.start * 1000),
          endMs: Math.round(word.end * 1000),
          timestampMs: Math.round(word.start * 1000),
          confidence: word.probability || 1,
        });
      }
    }
  }
  return captions;
}

// Convert all JSON files
const publicDir = path.join(__dirname, '..', 'public');
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.json') && !f.includes('.captions.'));

for (const file of files) {
  const baseName = path.basename(file, '.json');
  const whisperJson = JSON.parse(fs.readFileSync(path.join(publicDir, file), 'utf-8'));
  const captions = convertToCaption(whisperJson);
  fs.writeFileSync(
    path.join(publicDir, `${baseName}.captions.json`),
    JSON.stringify(captions, null, 2)
  );
  console.log(`Converted ${file} -> ${baseName}.captions.json`);
}
```

---

## GPU Acceleration

whisper.cpp automatically uses:
- **Mac (Apple Silicon):** Metal GPU acceleration
- **NVIDIA:** CUDA (if compiled with CUDA support)
- **CPU fallback:** Works but slower

The install script automatically builds with Metal support on Mac.

---

## Troubleshooting

### "whisperCppVersion is required"
Add the `whisperCppVersion` parameter matching your installed version:
```ts
whisperCppVersion: '1.5.5',
```

### Slow transcription
- Ensure you're using whisper.cpp, NOT Python whisper
- Check GPU is being used (look for "ggml_metal" in output)
- Use `base.en` instead of `medium.en` for faster results

### "Model not found"
Run the setup script first:
```bash
npx ts-node scripts/setup-whisper.ts
```

### Audio format issues
Always convert to 16kHz mono WAV:
```bash
ffmpeg -y -i video.mp4 -vn -ar 16000 -ac 1 audio.wav
```

---

## Integration with Remotion Captions

```ts
import { createTikTokStyleCaptions } from '@remotion/captions';

// Load captions
const captions = JSON.parse(fs.readFileSync('public/video.captions.json', 'utf-8'));

// Create TikTok-style pages
const { pages } = createTikTokStyleCaptions({
  captions,
  combineTokensWithinMilliseconds: 1200,
});

// Use pages in your Remotion composition
```
