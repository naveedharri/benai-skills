/**
 * @file imageAdapter.js
 * @description Image adaptation logic for fitting images to target aspect ratios
 * @author BenAI Team
 * @version 1.0.0
 */

import sharp from 'sharp';
import path from 'path';
import { getResolutionForRatio, calculateRatioMismatch } from './aspectRatio.js';

/**
 * Adapts an image to target composition aspect ratio
 * @param {string} imagePath - Path to source image
 * @param {string} targetRatio - Target aspect ratio (e.g., '1:1', '16:9')
 * @param {Array} elements - Detected elements from image analysis
 * @param {string} outputDir - Directory to save adapted image
 * @returns {Promise<string>} Path to adapted image file
 */
export async function adaptImageToComposition(imagePath, targetRatio, elements, outputDir) {
  try {
    // Load source image
    const image = sharp(imagePath);
    const metadata = await image.metadata();
    const { width: srcWidth, height: srcHeight } = metadata;

    // Get target resolution
    const targetResolution = getResolutionForRatio(targetRatio);
    const { width: targetWidth, height: targetHeight } = targetResolution;

    console.log(`  Source: ${srcWidth}x${srcHeight}`);
    console.log(`  Target: ${targetWidth}x${targetHeight}`);

    // Calculate ratio mismatch
    const mismatch = calculateRatioMismatch(srcWidth, srcHeight, targetRatio);

    console.log(`  Ratio mismatch: ${mismatch.toFixed(3)}`);

    // Determine adaptation strategy
    const strategy = determineAdaptationStrategy(
      srcWidth,
      srcHeight,
      targetWidth,
      targetHeight,
      elements,
      mismatch
    );

    console.log(`  Strategy: ${strategy}`);

    // Apply adaptation strategy
    let adaptedImage;

    switch (strategy) {
      case 'SCALE_TO_FIT':
        adaptedImage = await scaleToFit(image, targetWidth, targetHeight);
        break;

      case 'CROP_TO_FILL':
        adaptedImage = await smartCrop(image, srcWidth, srcHeight, targetWidth, targetHeight, elements);
        break;

      case 'INTELLIGENT_REFLOW':
        // For now, fall back to smart crop (reflow would require element repositioning)
        adaptedImage = await smartCrop(image, srcWidth, srcHeight, targetWidth, targetHeight, elements);
        break;

      default:
        adaptedImage = await scaleToFit(image, targetWidth, targetHeight);
    }

    // Save adapted image
    const outputPath = path.join(outputDir, `adapted-${Date.now()}.png`);
    await adaptedImage.toFile(outputPath);

    return outputPath;

  } catch (error) {
    throw new Error(`Image adaptation failed: ${error.message}`);
  }
}

/**
 * Determines the best adaptation strategy based on image and element analysis
 * @param {number} srcWidth - Source image width
 * @param {number} srcHeight - Source image height
 * @param {number} targetWidth - Target width
 * @param {number} targetHeight - Target height
 * @param {Array} elements - Detected elements
 * @param {number} mismatch - Ratio mismatch score
 * @returns {string} Strategy name
 */
function determineAdaptationStrategy(srcWidth, srcHeight, targetWidth, targetHeight, elements, mismatch) {
  // Strategy 1: If ratios are very close, just scale
  if (mismatch < 0.05) {
    return 'SCALE_TO_FIT';
  }

  // Strategy 2: If elements are centralized, safe to crop
  if (elementsAreCentralized(elements, srcWidth, srcHeight)) {
    return 'CROP_TO_FILL';
  }

  // Strategy 3: Complex layout needs intelligent handling
  if (mismatch > 0.3 || elements.length > 5) {
    return 'INTELLIGENT_REFLOW';
  }

  // Default: Smart crop
  return 'CROP_TO_FILL';
}

/**
 * Checks if elements are centralized in the image
 * @param {Array} elements - Detected elements
 * @param {number} imageWidth - Image width
 * @param {number} imageHeight - Image height
 * @returns {boolean} True if elements are centralized
 */
function elementsAreCentralized(elements, imageWidth, imageHeight) {
  if (elements.length === 0) return true;

  // Calculate center mass of all elements
  const centerX = imageWidth / 2;
  const centerY = imageHeight / 2;
  const threshold = imageWidth * 0.3; // 30% from center

  let totalWeight = 0;
  let weightedX = 0;
  let weightedY = 0;

  for (const element of elements) {
    if (element.semanticRole === 'background') continue;

    const { x, y, width, height } = element.position;
    const elementCenterX = x + (width / 2);
    const elementCenterY = y + (height / 2);
    const weight = width * height;

    weightedX += elementCenterX * weight;
    weightedY += elementCenterY * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return true;

  const massX = weightedX / totalWeight;
  const massY = weightedY / totalWeight;

  const distanceFromCenter = Math.sqrt(
    Math.pow(massX - centerX, 2) + Math.pow(massY - centerY, 2)
  );

  return distanceFromCenter < threshold;
}

/**
 * Scales image to fit target dimensions (may add letterboxing)
 * @param {Sharp} image - Sharp image instance
 * @param {number} targetWidth - Target width
 * @param {number} targetHeight - Target height
 * @returns {Sharp} Processed image
 */
async function scaleToFit(image, targetWidth, targetHeight) {
  return image
    .resize(targetWidth, targetHeight, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    });
}

/**
 * Smart crop that preserves important elements
 * @param {Sharp} image - Sharp image instance
 * @param {number} srcWidth - Source width
 * @param {number} srcHeight - Source height
 * @param {number} targetWidth - Target width
 * @param {number} targetHeight - Target height
 * @param {Array} elements - Detected elements
 * @returns {Sharp} Processed image
 */
async function smartCrop(image, srcWidth, srcHeight, targetWidth, targetHeight, elements) {
  // Calculate optimal crop region that preserves most important elements
  const cropRegion = calculateOptimalCropRegion(
    srcWidth,
    srcHeight,
    targetWidth,
    targetHeight,
    elements
  );

  return image
    .extract({
      left: cropRegion.x,
      top: cropRegion.y,
      width: cropRegion.width,
      height: cropRegion.height
    })
    .resize(targetWidth, targetHeight, {
      fit: 'fill'
    });
}

/**
 * Calculates optimal crop region to preserve important elements
 * @param {number} srcWidth - Source width
 * @param {number} srcHeight - Source height
 * @param {number} targetWidth - Target width
 * @param {number} targetHeight - Target height
 * @param {Array} elements - Detected elements
 * @returns {Object} Crop region {x, y, width, height}
 */
function calculateOptimalCropRegion(srcWidth, srcHeight, targetWidth, targetHeight, elements) {
  const targetRatio = targetWidth / targetHeight;
  const sourceRatio = srcWidth / srcHeight;

  // Filter out background elements
  const contentElements = elements.filter(e => e.semanticRole !== 'background');

  if (contentElements.length === 0) {
    // No content elements, crop from center
    return centerCrop(srcWidth, srcHeight, targetRatio);
  }

  // Find bounding box of all content elements
  let minX = srcWidth;
  let minY = srcHeight;
  let maxX = 0;
  let maxY = 0;

  for (const element of contentElements) {
    const { x, y, width, height } = element.position;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + height);
  }

  // Add padding (10% of image dimensions)
  const paddingX = srcWidth * 0.1;
  const paddingY = srcHeight * 0.1;

  minX = Math.max(0, minX - paddingX);
  minY = Math.max(0, minY - paddingY);
  maxX = Math.min(srcWidth, maxX + paddingX);
  maxY = Math.min(srcHeight, maxY + paddingY);

  const contentWidth = maxX - minX;
  const contentHeight = maxY - minY;
  const contentRatio = contentWidth / contentHeight;

  // Adjust crop region to match target ratio
  let cropWidth, cropHeight, cropX, cropY;

  if (contentRatio > targetRatio) {
    // Content is wider than target, constrain by width
    cropWidth = contentWidth;
    cropHeight = cropWidth / targetRatio;
    cropX = minX;
    cropY = minY - (cropHeight - contentHeight) / 2;
  } else {
    // Content is taller than target, constrain by height
    cropHeight = contentHeight;
    cropWidth = cropHeight * targetRatio;
    cropX = minX - (cropWidth - contentWidth) / 2;
    cropY = minY;
  }

  // Ensure crop region is within image bounds
  cropX = Math.max(0, Math.min(cropX, srcWidth - cropWidth));
  cropY = Math.max(0, Math.min(cropY, srcHeight - cropHeight));
  cropWidth = Math.min(cropWidth, srcWidth - cropX);
  cropHeight = Math.min(cropHeight, srcHeight - cropY);

  return {
    x: Math.round(cropX),
    y: Math.round(cropY),
    width: Math.round(cropWidth),
    height: Math.round(cropHeight)
  };
}

/**
 * Performs center crop with target aspect ratio
 * @param {number} srcWidth - Source width
 * @param {number} srcHeight - Source height
 * @param {number} targetRatio - Target aspect ratio
 * @returns {Object} Crop region {x, y, width, height}
 */
function centerCrop(srcWidth, srcHeight, targetRatio) {
  const sourceRatio = srcWidth / srcHeight;

  let cropWidth, cropHeight;

  if (sourceRatio > targetRatio) {
    // Source is wider, crop sides
    cropHeight = srcHeight;
    cropWidth = cropHeight * targetRatio;
  } else {
    // Source is taller, crop top/bottom
    cropWidth = srcWidth;
    cropHeight = cropWidth / targetRatio;
  }

  return {
    x: Math.round((srcWidth - cropWidth) / 2),
    y: Math.round((srcHeight - cropHeight) / 2),
    width: Math.round(cropWidth),
    height: Math.round(cropHeight)
  };
}

export default adaptImageToComposition;
