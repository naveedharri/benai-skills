/**
 * Transcribes videos in public/ to word-level caption JSON files.
 * Copy into your Remotion project's scripts/ folder and run:
 *   npx ts-node scripts/transcribe.ts             # all untranscribed .mp4 files in public/
 *   npx ts-node scripts/transcribe.ts my_video.mp4  # specific file(s)
 *
 * Outputs: public/<name>.captions.json
 * Each file is an array of { text, startMs, endMs, timestampMs, confidence }.
 * Run scripts/setup-whisper.ts once first.
 */
import {transcribe} from '@remotion/install-whisper-cpp';
import {execSync} from 'child_process';
import {existsSync, readdirSync, writeFileSync} from 'fs';
import path from 'path';

const WHISPER_PATH    = path.join(process.cwd(), '.whisper');
const WHISPER_VERSION = '1.5.5';

// Videos passed as CLI args, or every .mp4/.mov in public/ without a captions file yet
const args = process.argv.slice(2);
const VIDEOS = args.length
  ? args
  : readdirSync(path.join(process.cwd(), 'public')).filter(
      (f) =>
        /\.(mp4|mov)$/i.test(f) &&
        !existsSync(
          path.join(process.cwd(), 'public', `${path.basename(f, path.extname(f))}.captions.json`),
        ),
    );

interface Caption {
  text: string;
  startMs: number;
  endMs: number;
  timestampMs: number;
  confidence: number;
}

async function transcribeVideo(videoName: string): Promise<void> {
  const videoPath    = path.join(process.cwd(), 'public', videoName);
  const baseName     = path.basename(videoName, path.extname(videoName));
  const audioPath    = path.join(process.cwd(), `${baseName}.wav`);
  const captionsPath = path.join(process.cwd(), 'public', `${baseName}.captions.json`);

  if (!existsSync(videoPath)) {
    console.log(`Skipping ${videoName} - not found in public/`);
    return;
  }
  if (existsSync(captionsPath)) {
    console.log(`Skipping ${baseName} - already transcribed`);
    return;
  }

  console.log(`\nTranscribing ${baseName}...`);

  // Extract 16kHz mono WAV (required by whisper.cpp)
  execSync(
    `ffmpeg -y -i "${videoPath}" -vn -ar 16000 -ac 1 "${audioPath}"`,
    {stdio: 'inherit'},
  );

  const {transcription} = await transcribe({
    inputPath:           audioPath,
    whisperPath:         WHISPER_PATH,
    whisperCppVersion:   WHISPER_VERSION,
    model:               'base.en',
    tokenLevelTimestamps: true,
    printOutput:         true,
  });

  const captions: Caption[] = transcription.map((item) => ({
    text:        item.text,
    startMs:     Math.round(item.offsets.from),
    endMs:       Math.round(item.offsets.to),
    timestampMs: Math.round(item.offsets.from),
    confidence:  1,
  }));

  writeFileSync(captionsPath, JSON.stringify(captions, null, 2));
  console.log(`✓ Created public/${baseName}.captions.json (${captions.length} tokens)`);

  execSync(`rm -f "${audioPath}"`);
}

async function main() {
  if (!VIDEOS.length) {
    console.log('Nothing to transcribe: every video in public/ already has a captions file.');
    return;
  }
  for (const video of VIDEOS) {
    await transcribeVideo(video);
  }
  console.log('\nAll transcriptions complete!');
}

main().catch(console.error);
