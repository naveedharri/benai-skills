/**
 * One-time setup: installs whisper.cpp binary and downloads the base.en model.
 * Copy into your Remotion project's scripts/ folder and run:
 *   npx ts-node scripts/setup-whisper.ts
 *
 * Uses Metal GPU on Mac, ~10x faster than Python whisper.
 * Model is saved to .whisper/ (add it to .gitignore).
 */
import {installWhisperCpp, downloadWhisperModel} from '@remotion/install-whisper-cpp';
import path from 'path';

const WHISPER_PATH = path.join(process.cwd(), '.whisper');
const WHISPER_VERSION = '1.5.5';

async function setup() {
  console.log('Installing whisper.cpp...');
  await installWhisperCpp({
    to: WHISPER_PATH,
    version: WHISPER_VERSION,
  });

  console.log('Downloading base.en model (~142MB)...');
  await downloadWhisperModel({
    model: 'base.en',
    folder: WHISPER_PATH,
  });

  console.log('\nDone! Run transcription with:');
  console.log('  npx ts-node scripts/transcribe.ts');
}

setup().catch(console.error);
