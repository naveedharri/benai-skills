/**
 * @file renderer.js
 * @description Remotion rendering and GIF export module
 * @author BenAI Team
 * @version 1.0.0
 */

import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

/**
 * Renders Remotion composition to GIF
 * @param {string} compositionPath - Path to Remotion composition file
 * @param {string} outputPath - Output directory path
 * @param {Object} config - Rendering configuration
 * @param {number} config.width - Output width
 * @param {number} config.height - Output height
 * @param {number} config.fps - Frames per second
 * @param {number} config.durationInFrames - Total duration in frames
 * @returns {Promise<string>} Path to rendered GIF file
 */
export async function renderAnimation(compositionPath, outputPath, config) {
  const { width, height, fps, durationInFrames } = config;

  try {
    // Ensure output directory exists
    await fs.mkdir(outputPath, { recursive: true });

    const compositionDir = path.dirname(compositionPath);
    const timestamp = Date.now();
    const videoPath = path.join(outputPath, `temp-${timestamp}.mp4`);
    const gifPath = path.join(outputPath, `animated-${timestamp}.gif`);

    console.log('  Step 1/3: Rendering video frames...');

    // Step 1: Render to video using Remotion CLI
    try {
      execSync(`npx remotion render ${compositionDir} AnimatedInfographic ${videoPath} \
        --width=${width} \
        --height=${height} \
        --fps=${fps} \
        --frames=${durationInFrames}`, {
        stdio: 'pipe',
        cwd: compositionDir
      });
    } catch (error) {
      throw new Error(`Remotion render failed: ${error.message}`);
    }

    console.log('  Step 2/3: Converting to GIF...');

    // Step 2: Convert MP4 to GIF using FFmpeg
    try {
      await convertVideoToGif(videoPath, gifPath, { width, height, fps });
    } catch (error) {
      throw new Error(`GIF conversion failed: ${error.message}`);
    }

    console.log('  Step 3/3: Optimizing GIF...');

    // Step 3: Optimize GIF
    try {
      await optimizeGif(gifPath);
    } catch (error) {
      console.warn('  Warning: GIF optimization failed, using unoptimized version');
    }

    // Cleanup temporary video file
    try {
      await fs.unlink(videoPath);
    } catch {
      // Ignore cleanup errors
    }

    return gifPath;

  } catch (error) {
    throw new Error(`Animation rendering failed: ${error.message}`);
  }
}

/**
 * Converts video file to optimized GIF using FFmpeg
 * @param {string} videoPath - Input video path
 * @param {string} gifPath - Output GIF path
 * @param {Object} options - Conversion options
 * @returns {Promise<void>}
 */
async function convertVideoToGif(videoPath, gifPath, options) {
  const { width, height, fps } = options;

  // Generate palette for better quality
  const palettePath = gifPath.replace('.gif', '-palette.png');

  try {
    // Step 1: Generate palette
    execSync(`ffmpeg -i ${videoPath} -vf "fps=${fps},scale=${width}:${height}:flags=lanczos,palettegen=max_colors=256" -y ${palettePath}`, {
      stdio: 'pipe'
    });

    // Step 2: Convert to GIF using palette
    execSync(`ffmpeg -i ${videoPath} -i ${palettePath} -filter_complex "fps=${fps},scale=${width}:${height}:flags=lanczos[x];[x][1:v]paletteuse=dither=floyd_steinberg" -loop 0 -y ${gifPath}`, {
      stdio: 'pipe'
    });

    // Cleanup palette
    await fs.unlink(palettePath);

  } catch (error) {
    throw new Error(`FFmpeg conversion failed: ${error.message}`);
  }
}

/**
 * Optimizes GIF file size
 * @param {string} gifPath - Path to GIF file
 * @returns {Promise<void>}
 */
async function optimizeGif(gifPath) {
  try {
    // Check if gifsicle is available for optimization
    try {
      execSync('which gifsicle', { stdio: 'pipe' });
    } catch {
      console.log('  gifsicle not found, skipping optimization');
      return;
    }

    const optimizedPath = gifPath.replace('.gif', '-optimized.gif');

    // Run gifsicle optimization
    execSync(`gifsicle -O3 --lossy=80 ${gifPath} -o ${optimizedPath}`, {
      stdio: 'pipe'
    });

    // Check if optimization actually reduced file size
    const originalStats = await fs.stat(gifPath);
    const optimizedStats = await fs.stat(optimizedPath);

    if (optimizedStats.size < originalStats.size) {
      // Replace original with optimized
      await fs.unlink(gifPath);
      await fs.rename(optimizedPath, gifPath);
      const savedMB = ((originalStats.size - optimizedStats.size) / (1024 * 1024)).toFixed(2);
      console.log(`  Saved ${savedMB}MB through optimization`);
    } else {
      // Keep original, delete optimized
      await fs.unlink(optimizedPath);
    }

  } catch (error) {
    // Optimization is optional, don't throw
    console.warn('  Optimization failed:', error.message);
  }
}

/**
 * Gets duration of a GIF file in seconds
 * @param {string} gifPath - Path to GIF file
 * @returns {Promise<number>} Duration in seconds
 */
export async function getGifDuration(gifPath) {
  try {
    const output = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${gifPath}`, {
      encoding: 'utf-8'
    });
    return parseFloat(output.trim());
  } catch (error) {
    throw new Error(`Failed to get GIF duration: ${error.message}`);
  }
}

/**
 * Validates that required tools are installed
 * @throws {Error} If required tools are missing
 */
export async function validateSystemRequirements() {
  const requiredTools = [
    { command: 'ffmpeg', name: 'FFmpeg' },
    { command: 'node', name: 'Node.js' }
  ];

  const missing = [];

  for (const tool of requiredTools) {
    try {
      execSync(`which ${tool.command}`, { stdio: 'pipe' });
    } catch {
      missing.push(tool.name);
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing required tools: ${missing.join(', ')}. Please install them before using this plugin.`);
  }

  // Check Node.js version
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

  if (majorVersion < 18) {
    throw new Error(`Node.js 18+ is required. Current version: ${nodeVersion}`);
  }

  console.log('✓ System requirements validated');
}

export default renderAnimation;
