/**
 * @file aspectRatio.js
 * @description Aspect ratio and resolution mapping utilities
 * @author BenAI Team
 * @version 1.0.0
 */

/**
 * Resolution configurations for different aspect ratios
 */
const RESOLUTION_MAP = {
  '1:1': {
    width: 1080,
    height: 1080,
    label: 'Square (1:1) - Instagram/LinkedIn Posts',
    platforms: ['Instagram', 'LinkedIn', 'Facebook']
  },
  '16:9': {
    width: 1920,
    height: 1080,
    label: 'Landscape (16:9) - YouTube/LinkedIn Videos',
    platforms: ['YouTube', 'LinkedIn', 'Facebook', 'Twitter']
  },
  '9:16': {
    width: 1080,
    height: 1920,
    label: 'Vertical (9:16) - Stories/Reels/TikTok',
    platforms: ['Instagram Stories', 'Facebook Stories', 'TikTok', 'Snapchat', 'YouTube Shorts']
  },
  '4:5': {
    width: 1080,
    height: 1350,
    label: 'Portrait (4:5) - Instagram Feed',
    platforms: ['Instagram', 'Facebook']
  }
};

/**
 * Gets resolution configuration for a given aspect ratio
 * @param {string} ratio - Aspect ratio string (e.g., '1:1', '16:9')
 * @returns {Object} Resolution configuration {width, height, label, platforms}
 * @throws {Error} If ratio is invalid
 *
 * @example
 * const resolution = getResolutionForRatio('16:9');
 * console.log(resolution); // { width: 1920, height: 1080, ... }
 */
export function getResolutionForRatio(ratio) {
  if (!RESOLUTION_MAP[ratio]) {
    throw new Error(`Invalid aspect ratio: ${ratio}. Valid ratios are: ${Object.keys(RESOLUTION_MAP).join(', ')}`);
  }

  return RESOLUTION_MAP[ratio];
}

/**
 * Gets all supported aspect ratios
 * @returns {Array<string>} Array of supported ratio strings
 */
export function getSupportedRatios() {
  return Object.keys(RESOLUTION_MAP);
}

/**
 * Gets detailed information about all aspect ratios
 * @returns {Array<Object>} Array of ratio configurations
 */
export function getAllRatioConfigurations() {
  return Object.entries(RESOLUTION_MAP).map(([ratio, config]) => ({
    ratio,
    ...config
  }));
}

/**
 * Calculates the aspect ratio of given dimensions
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {string} Closest matching aspect ratio
 */
export function calculateAspectRatio(width, height) {
  const ratio = width / height;
  const tolerance = 0.1;

  // Check against known ratios
  const ratioChecks = {
    '1:1': 1.0,
    '16:9': 16 / 9,
    '9:16': 9 / 16,
    '4:5': 4 / 5
  };

  for (const [ratioStr, expectedRatio] of Object.entries(ratioChecks)) {
    if (Math.abs(ratio - expectedRatio) < tolerance) {
      return ratioStr;
    }
  }

  // Return closest match
  let closestRatio = '1:1';
  let minDifference = Math.abs(ratio - 1.0);

  for (const [ratioStr, expectedRatio] of Object.entries(ratioChecks)) {
    const difference = Math.abs(ratio - expectedRatio);
    if (difference < minDifference) {
      minDifference = difference;
      closestRatio = ratioStr;
    }
  }

  return closestRatio;
}

/**
 * Checks if dimensions match a target aspect ratio
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} targetRatio - Target aspect ratio
 * @param {number} [tolerance=0.1] - Tolerance for matching
 * @returns {boolean} True if dimensions match the ratio
 */
export function matchesAspectRatio(width, height, targetRatio, tolerance = 0.1) {
  const imageRatio = width / height;
  const targetConfig = getResolutionForRatio(targetRatio);
  const expectedRatio = targetConfig.width / targetConfig.height;

  return Math.abs(imageRatio - expectedRatio) < tolerance;
}

/**
 * Calculates ratio mismatch score
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} targetRatio - Target aspect ratio
 * @returns {number} Mismatch score (0 = perfect match, higher = more mismatch)
 */
export function calculateRatioMismatch(width, height, targetRatio) {
  const imageRatio = width / height;
  const targetConfig = getResolutionForRatio(targetRatio);
  const expectedRatio = targetConfig.width / targetConfig.height;

  return Math.abs(imageRatio - expectedRatio);
}

/**
 * Gets recommended aspect ratio based on image dimensions
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {Object} Recommended ratio with confidence score
 */
export function getRecommendedRatio(width, height) {
  const detectedRatio = calculateAspectRatio(width, height);
  const mismatch = calculateRatioMismatch(width, height, detectedRatio);

  // Calculate confidence (0-1, where 1 is perfect match)
  const confidence = Math.max(0, 1 - (mismatch * 5));

  return {
    ratio: detectedRatio,
    confidence: confidence,
    recommendation: confidence > 0.8 ? detectedRatio : '1:1', // Default to square if uncertain
    config: getResolutionForRatio(detectedRatio)
  };
}

/**
 * Formats aspect ratio information for display to user
 * @param {string} ratio - Aspect ratio
 * @returns {string} Formatted string for user display
 */
export function formatRatioForDisplay(ratio) {
  const config = getResolutionForRatio(ratio);
  return `${ratio} (${config.width}x${config.height}) - ${config.label}`;
}

export default {
  getResolutionForRatio,
  getSupportedRatios,
  getAllRatioConfigurations,
  calculateAspectRatio,
  matchesAspectRatio,
  calculateRatioMismatch,
  getRecommendedRatio,
  formatRatioForDisplay
};
