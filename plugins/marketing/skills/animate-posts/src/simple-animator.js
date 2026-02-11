/**
 * Simple FFmpeg-based animator for infographics
 * Creates animated videos using FFmpeg's built-in filters
 */

import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { optimizeGif } from './optimize-gif.js';

/**
 * Creates an animated video from a static image using FFmpeg
 * @param {string} imagePath - Path to input image
 * @param {string} outputPath - Output directory
 * @param {Object} config - Animation configuration
 * @returns {Promise<string>} Path to output video
 */
export async function createSimpleAnimation(imagePath, outputPath, config) {
  const { width = 1080, height = 1080, duration = 10 } = config;

  await fs.mkdir(outputPath, { recursive: true });

  const timestamp = Date.now();
  const videoPath = path.join(outputPath, `animated-${timestamp}.mp4`);
  const gifPath = path.join(outputPath, `animated-${timestamp}.gif`);

  console.log('Creating animation with FFmpeg...');

  // Create a 10-second video with zoom and fade effects
  // This creates a professional-looking animation without Remotion complexity
  const ffmpegCommand = `ffmpeg -loop 1 -i "${imagePath}" -vf "
    scale=${width}:${height}:force_original_aspect_ratio=decrease,
    pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2,
    zoompan=z='min(1+0.0015*on,1.15)':d=1:s=${width}x${height}:fps=20,
    fade=t=in:st=0:d=1,
    fade=t=out:st=${duration - 1}:d=1
  " -t ${duration} -r 20 -pix_fmt yuv420p -y "${videoPath}"`;

  try {
    execSync(ffmpegCommand, { stdio: 'pipe' });
    console.log('✓ Video created');
  } catch (error) {
    throw new Error(`FFmpeg video creation failed: ${error.message}`);
  }

  // Convert to GIF
  console.log('Converting to GIF...');
  const palettePath = path.join(outputPath, `palette-${timestamp}.png`);

  try {
    // Generate palette with reduced colors
    execSync(`ffmpeg -i "${videoPath}" -vf "fps=15,scale=${width}:${height}:flags=lanczos,palettegen=max_colors=128" -y "${palettePath}"`, {
      stdio: 'pipe'
    });

    // Create GIF with palette
    execSync(`ffmpeg -i "${videoPath}" -i "${palettePath}" -filter_complex "fps=15,scale=${width}:${height}:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5" -loop 0 -y "${gifPath}"`, {
      stdio: 'pipe'
    });

    console.log('✓ GIF created');

    // Cleanup
    await fs.unlink(videoPath).catch(() => {});
    await fs.unlink(palettePath).catch(() => {});

    // Optimize GIF
    console.log('Optimizing GIF...');
    await optimizeGif(gifPath, 5);

    return gifPath;
  } catch (error) {
    throw new Error(`GIF conversion failed: ${error.message}`);
  }
}
