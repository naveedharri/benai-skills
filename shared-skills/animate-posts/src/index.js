/**
 * @file index.js
 * @description Main entry point for Animate Posts plugin
 * @author BenAI Team
 * @version 1.0.0
 */

import { analyzeInfographic } from './analyzer.js';
import { generateAutoAnimationPrompt, expandCustomPreferences } from './promptGenerator.js';
import { generateRemotionComponent } from './remotionGenerator.js';
import { renderAnimation } from './renderer.js';
import { getResolutionForRatio } from './utils/aspectRatio.js';
import { adaptImageToComposition } from './utils/imageAdapter.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * Main animation generation pipeline
 * @param {Object} config - Animation configuration
 * @param {string} config.imagePath - Path to input infographic
 * @param {string} config.aspectRatio - Target aspect ratio (e.g., '1:1', '16:9')
 * @param {string} config.animationMode - 'auto' or 'custom'
 * @param {string} [config.customPreferences] - Custom animation preferences (required if mode is 'custom')
 * @param {string} [config.outputPath] - Output directory path
 * @returns {Promise<Object>} Generation result with output file path and metadata
 */
export async function animatePost(config) {
  const {
    imagePath,
    aspectRatio = '1:1',
    animationMode = 'auto',
    customPreferences = '',
    outputPath = process.env.OUTPUT_DIRECTORY || '/tmp/animate-posts-output'
  } = config;

  try {
    // Ensure output directory exists
    await fs.mkdir(outputPath, { recursive: true });
    await fs.mkdir(path.join(outputPath, 'temp'), { recursive: true });

    console.log('🎬 Starting animation generation...');
    console.log(`📐 Target aspect ratio: ${aspectRatio}`);
    console.log(`🎨 Animation mode: ${animationMode}`);

    // Step 1: Analyze the uploaded infographic
    console.log('\n📊 Analyzing infographic...');
    const targetResolution = getResolutionForRatio(aspectRatio);
    const analysis = await analyzeInfographic(imagePath, { targetRatio: aspectRatio });

    console.log(`✓ Found ${analysis.elements.length} elements`);
    console.log(`  Summary: ${analysis.summary}`);

    // Step 2: Adapt image to target composition if needed
    console.log('\n🔄 Adapting image to target resolution...');
    const adaptedImagePath = await adaptImageToComposition(
      imagePath,
      aspectRatio,
      analysis.elements,
      path.join(outputPath, 'temp')
    );
    console.log(`✓ Image adapted to ${targetResolution.width}x${targetResolution.height}`);

    // Step 3: Generate animation prompt
    console.log('\n✍️  Generating animation specifications...');
    let animationPrompt;

    if (animationMode === 'auto') {
      animationPrompt = await generateAutoAnimationPrompt(analysis.elements);
      console.log('✓ AI auto-animation prompt generated');
    } else {
      animationPrompt = await expandCustomPreferences(
        customPreferences,
        analysis.elements
      );
      console.log('✓ Custom animation prompt expanded');
    }

    // Step 4: Generate Remotion component
    console.log('\n⚛️  Generating Remotion component...');
    const componentPath = await generateRemotionComponent(
      animationPrompt,
      targetResolution,
      adaptedImagePath,
      path.join(outputPath, 'temp')
    );
    console.log(`✓ Component generated: ${componentPath}`);

    // Step 5: Render animation
    console.log('\n🎥 Rendering animation (this may take 1-2 minutes)...');
    const gifPath = await renderAnimation(componentPath, outputPath, {
      width: targetResolution.width,
      height: targetResolution.height,
      fps: 30,
      durationInFrames: 300 // 10 seconds at 30fps
    });

    // Step 6: Get file stats
    const stats = await fs.stat(gifPath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log('\n✨ Animation generated successfully!');
    console.log(`📦 Output: ${gifPath}`);
    console.log(`📏 Size: ${fileSizeMB}MB`);
    console.log(`⏱️  Duration: 10 seconds`);
    console.log(`📐 Resolution: ${targetResolution.width}x${targetResolution.height}`);

    return {
      success: true,
      outputFile: gifPath,
      metadata: {
        duration: '10 seconds',
        format: 'GIF',
        resolution: `${targetResolution.width}x${targetResolution.height}`,
        fileSize: `${fileSizeMB}MB`,
        aspectRatio: aspectRatio
      },
      analysis: {
        elementsFound: analysis.elements.length,
        summary: analysis.summary
      }
    };

  } catch (error) {
    console.error('❌ Animation generation failed:', error.message);
    throw new Error(`Animation generation failed: ${error.message}`);
  }
}

/**
 * Validates input configuration
 * @param {Object} config - Configuration to validate
 * @throws {Error} If configuration is invalid
 */
export function validateConfig(config) {
  if (!config.imagePath) {
    throw new Error('Image path is required');
  }

  const validRatios = ['1:1', '16:9', '9:16', '4:5'];
  if (config.aspectRatio && !validRatios.includes(config.aspectRatio)) {
    throw new Error(`Invalid aspect ratio. Must be one of: ${validRatios.join(', ')}`);
  }

  const validModes = ['auto', 'custom'];
  if (config.animationMode && !validModes.includes(config.animationMode)) {
    throw new Error(`Invalid animation mode. Must be one of: ${validModes.join(', ')}`);
  }

  if (config.animationMode === 'custom' && !config.customPreferences) {
    throw new Error('Custom preferences are required when using custom animation mode');
  }
}

// CLI support
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log(`
Usage: node src/index.js <image-path> [options]

Options:
  --ratio <1:1|16:9|9:16|4:5>  Target aspect ratio (default: 1:1)
  --mode <auto|custom>          Animation mode (default: auto)
  --preferences "<text>"        Custom animation preferences (required if mode=custom)
  --output <path>               Output directory (default: /tmp/animate-posts-output)

Examples:
  node src/index.js ./my-infographic.png
  node src/index.js ./image.png --ratio 16:9
  node src/index.js ./image.png --mode custom --preferences "Fade in title, zoom stats"
    `);
    process.exit(0);
  }

  const config = {
    imagePath: args[0],
    aspectRatio: '1:1',
    animationMode: 'auto',
    customPreferences: '',
    outputPath: undefined
  };

  // Parse CLI arguments
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--ratio' && args[i + 1]) {
      config.aspectRatio = args[i + 1];
      i++;
    } else if (args[i] === '--mode' && args[i + 1]) {
      config.animationMode = args[i + 1];
      i++;
    } else if (args[i] === '--preferences' && args[i + 1]) {
      config.customPreferences = args[i + 1];
      i++;
    } else if (args[i] === '--output' && args[i + 1]) {
      config.outputPath = args[i + 1];
      i++;
    }
  }

  try {
    validateConfig(config);
    const result = await animatePost(config);
    console.log('\n✅ Complete!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

export default animatePost;
