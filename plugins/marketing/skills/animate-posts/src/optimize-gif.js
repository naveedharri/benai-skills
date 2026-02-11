/**
 * GIF optimization utilities
 */

import { execSync } from 'child_process';
import fs from 'fs/promises';

/**
 * Optimizes a GIF file to reduce size
 * @param {string} gifPath - Path to GIF file
 * @param {number} targetSizeMB - Target size in MB (default: 5)
 * @returns {Promise<void>}
 */
export async function optimizeGif(gifPath, targetSizeMB = 5) {
  const stats = await fs.stat(gifPath);
  const sizeMB = stats.size / (1024 * 1024);

  console.log(`Current size: ${sizeMB.toFixed(2)}MB`);

  if (sizeMB <= targetSizeMB) {
    console.log('✓ Already within target size');
    return;
  }

  console.log(`Optimizing to ${targetSizeMB}MB...`);

  // Use gifsicle if available, otherwise use ffmpeg with lower quality
  try {
    execSync('which gifsicle', { stdio: 'pipe' });
    await optimizeWithGifsicle(gifPath);
  } catch {
    console.log('gifsicle not found, using ffmpeg optimization...');
    await reencodeWithLowerQuality(gifPath, targetSizeMB);
  }

  const newStats = await fs.stat(gifPath);
  const newSizeMB = newStats.size / (1024 * 1024);
  console.log(`✓ Optimized to ${newSizeMB.toFixed(2)}MB`);
}

async function optimizeWithGifsicle(gifPath) {
  const tempPath = gifPath.replace('.gif', '-optimized.gif');

  execSync(`gifsicle -O3 --lossy=80 "${gifPath}" -o "${tempPath}"`, {
    stdio: 'pipe'
  });

  await fs.rename(tempPath, gifPath);
}

async function reencodeWithLowerQuality(gifPath, targetSizeMB) {
  const tempPath = gifPath.replace('.gif', '-temp.gif');
  const palettePath = gifPath.replace('.gif', '-palette.png');

  // Re-encode with fewer colors and lower framerate
  // More aggressive settings for target size
  const colors = Math.max(32, Math.floor(targetSizeMB * 20));
  const fps = Math.max(10, Math.floor(targetSizeMB * 4));

  try {
    // Generate palette with fewer colors
    execSync(`ffmpeg -i "${gifPath}" -vf "fps=${fps},scale=1080:1080:flags=lanczos,palettegen=max_colors=${colors}" -y "${palettePath}"`, {
      stdio: 'pipe'
    });

    // Re-encode with new palette
    execSync(`ffmpeg -i "${gifPath}" -i "${palettePath}" -filter_complex "fps=${fps},scale=1080:1080:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer" -loop 0 -y "${tempPath}"`, {
      stdio: 'pipe'
    });

    await fs.rename(tempPath, gifPath);
    await fs.unlink(palettePath).catch(() => {});
  } catch (error) {
    // Cleanup on error
    await fs.unlink(tempPath).catch(() => {});
    await fs.unlink(palettePath).catch(() => {});
    throw error;
  }
}
