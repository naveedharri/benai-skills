/**
 * Interactive FFmpeg-based animator with preview and iteration
 */

import { execSync, spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import http from 'http';

let previewServer = null;
let currentGifPath = null;

/**
 * Creates animation based on user's detailed instructions
 * @param {string} imagePath - Path to input image
 * @param {string} animationInstructions - User's description of desired animation
 * @param {Object} config - Configuration
 * @returns {Promise<Object>} Preview URL and metadata
 */
export async function createAnimationPreview(imagePath, animationInstructions, config = {}) {
  const { width = 720, height = 720, duration = 10 } = config;

  const workDir = '/tmp/animate-posts-work';
  await fs.mkdir(workDir, { recursive: true });

  const timestamp = Date.now();
  const videoPath = path.join(workDir, `preview-${timestamp}.mp4`);
  const gifPath = path.join(workDir, `preview-${timestamp}.gif`);
  const palettePath = path.join(workDir, `palette-${timestamp}.png`);

  console.log('\n🎬 Creating animation based on your instructions...');
  console.log(`Instructions: "${animationInstructions}"\n`);

  // Parse animation instructions and build FFmpeg filter
  const filters = parseAnimationInstructions(animationInstructions, duration);

  // Build FFmpeg command
  const ffmpegCmd = `ffmpeg -loop 1 -i "${imagePath}" -vf "
    scale=${width}:${height}:force_original_aspect_ratio=decrease,
    pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2,
    ${filters},
    fade=t=in:st=0:d=1,
    fade=t=out:st=${duration - 1}:d=1
  " -t ${duration} -r 10 -pix_fmt yuv420p -y "${videoPath}"`;

  try {
    console.log('⏳ Step 1/3: Rendering video...');
    execSync(ffmpegCmd, { stdio: 'pipe' });

    console.log('⏳ Step 2/3: Generating palette...');
    execSync(`ffmpeg -i "${videoPath}" -vf "fps=10,palettegen=max_colors=64" -update 1 -y "${palettePath}"`, {
      stdio: 'pipe'
    });

    console.log('⏳ Step 3/3: Creating GIF...');
    execSync(`ffmpeg -i "${videoPath}" -i "${palettePath}" -lavfi "fps=10[x];[x][1:v]paletteuse" -y "${gifPath}"`, {
      stdio: 'pipe'
    });

    // Cleanup temp files
    await fs.unlink(videoPath).catch(() => {});
    await fs.unlink(palettePath).catch(() => {});

    // Store for server
    currentGifPath = gifPath;

    // Get file size
    const stats = await fs.stat(gifPath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log('✅ Animation created!\n');

    return {
      previewPath: gifPath,
      size: `${sizeMB}MB`,
      resolution: `${width}x${height}`,
      duration: `${duration}s`,
      fps: 10
    };
  } catch (error) {
    throw new Error(`Animation creation failed: ${error.message}`);
  }
}

/**
 * Parses user animation instructions into FFmpeg filters
 */
function parseAnimationInstructions(instructions, duration) {
  const lower = instructions.toLowerCase();

  // Default to zoom if no specific instruction
  if (!lower.includes('zoom') && !lower.includes('pan') && !lower.includes('slide') && !lower.includes('rotate')) {
    return `zoompan=z='min(1+0.002*on,1.15)':d=1:s=720x720:fps=10`;
  }

  let filters = [];

  // Zoom effects
  if (lower.includes('zoom in') || lower.includes('zoom into')) {
    const speed = lower.includes('slow') ? '0.001' : lower.includes('fast') ? '0.003' : '0.002';
    const max = lower.includes('dramatic') ? '1.3' : '1.15';
    filters.push(`zoompan=z='min(1+${speed}*on,${max})':d=1:s=720x720:fps=10`);
  } else if (lower.includes('zoom out')) {
    filters.push(`zoompan=z='max(1.2-0.002*on,1)':d=1:s=720x720:fps=10`);
  } else if (lower.includes('pulse') || lower.includes('breathing')) {
    filters.push(`zoompan=z='1+0.05*sin(2*PI*t/${duration})':d=1:s=720x720:fps=10`);
  }

  // Pan effects
  if (lower.includes('pan left')) {
    filters.push(`zoompan=z=1.2:x='iw-iw/zoom-${duration}*10*on':y='0':d=1:s=720x720:fps=10`);
  } else if (lower.includes('pan right')) {
    filters.push(`zoompan=z=1.2:x='${duration}*10*on':y='0':d=1:s=720x720:fps=10`);
  } else if (lower.includes('pan up')) {
    filters.push(`zoompan=z=1.2:x='0':y='ih-ih/zoom-${duration}*10*on':d=1:s=720x720:fps=10`);
  } else if (lower.includes('pan down')) {
    filters.push(`zoompan=z=1.2:x='0':y='${duration}*10*on':d=1:s=720x720:fps=10`);
  }

  // If no specific effect matched, default to zoom
  if (filters.length === 0) {
    filters.push(`zoompan=z='min(1+0.002*on,1.15)':d=1:s=720x720:fps=10`);
  }

  return filters.join(',');
}

/**
 * Starts a local preview server
 */
export async function startPreviewServer(port = 3000) {
  // Stop existing server if running
  if (previewServer) {
    previewServer.close();
  }

  return new Promise((resolve, reject) => {
    previewServer = http.createServer((req, res) => {
      if (req.url === '/preview.gif') {
        // Serve the GIF
        fs.readFile(currentGifPath).then(data => {
          res.writeHead(200, { 'Content-Type': 'image/gif' });
          res.end(data);
        }).catch(() => {
          res.writeHead(404);
          res.end('GIF not found');
        });
      } else {
        // Serve HTML viewer
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
<!DOCTYPE html>
<html>
<head>
  <title>Animation Preview</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: #1a1a1a;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: white;
    }
    h1 {
      margin-bottom: 10px;
      font-size: 24px;
      font-weight: 600;
    }
    .subtitle {
      color: #888;
      margin-bottom: 30px;
      font-size: 14px;
    }
    .preview-container {
      background: #2a2a2a;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }
    img {
      max-width: 800px;
      width: 100%;
      height: auto;
      border-radius: 8px;
      display: block;
    }
    .controls {
      margin-top: 20px;
      text-align: center;
      color: #888;
      font-size: 13px;
    }
    .info {
      margin-top: 10px;
      padding: 12px;
      background: #333;
      border-radius: 6px;
      font-size: 12px;
      color: #aaa;
    }
  </style>
</head>
<body>
  <h1>🎬 Animation Preview</h1>
  <div class="subtitle">Review your animation below</div>
  <div class="preview-container">
    <img src="/preview.gif?t=${Date.now()}" alt="Animation Preview">
    <div class="controls">
      The animation loops automatically • Refresh to reload
    </div>
  </div>
  <div class="info">
    Return to terminal to request edits or export the final version
  </div>
</body>
</html>
        `);
      }
    });

    previewServer.listen(port, () => {
      resolve(`http://localhost:${port}`);
    });

    previewServer.on('error', reject);
  });
}

/**
 * Stops the preview server
 */
export function stopPreviewServer() {
  if (previewServer) {
    previewServer.close();
    previewServer = null;
  }
}

/**
 * Exports the final animation to user's chosen location
 */
export async function exportFinalAnimation(outputPath, filename = null) {
  if (!currentGifPath) {
    throw new Error('No animation to export. Create a preview first.');
  }

  await fs.mkdir(outputPath, { recursive: true });

  const finalFilename = filename || `animated-${Date.now()}.gif`;
  const finalPath = path.join(outputPath, finalFilename);

  await fs.copyFile(currentGifPath, finalPath);

  const stats = await fs.stat(finalPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  return {
    path: finalPath,
    size: `${sizeMB}MB`
  };
}
