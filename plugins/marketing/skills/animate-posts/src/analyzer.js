/**
 * @file analyzer.js
 * @description Image analysis module for detecting infographic elements
 * @author BenAI Team
 * @version 1.0.0
 */

import sharp from 'sharp';
import Tesseract from 'tesseract.js';
import fs from 'fs/promises';

/**
 * Analyzes an uploaded infographic image to detect visual elements
 * @param {string} imagePath - Path to the uploaded image file
 * @param {Object} config - Analysis configuration options
 * @param {string} config.targetRatio - Target aspect ratio (e.g., '1:1', '16:9')
 * @returns {Promise<AnalysisResult>} Structured analysis with detected elements
 * @throws {Error} If image is invalid or analysis fails
 *
 * @example
 * const analysis = await analyzeInfographic('./uploads/infographic.png', {
 *   targetRatio: '1:1'
 * });
 * console.log(analysis.elements); // Array of detected elements
 */
export async function analyzeInfographic(imagePath, config = {}) {
  try {
    // Validate image file exists
    await fs.access(imagePath);

    // Get image metadata
    const image = sharp(imagePath);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error('Unable to read image dimensions');
    }

    console.log(`  Image dimensions: ${metadata.width}x${metadata.height}`);

    // Detect elements in the image
    const elements = await detectElements(imagePath, metadata);

    // Generate human-readable summary
    const summary = generateSummary(elements);

    return {
      uploadedDimensions: {
        width: metadata.width,
        height: metadata.height
      },
      targetComposition: parseTargetRatio(config.targetRatio || '1:1'),
      elements: elements,
      summary: summary
    };

  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Image file not found: ${imagePath}`);
    }
    throw new Error(`Image analysis failed: ${error.message}`);
  }
}

/**
 * Detects visual elements in the image using OCR and computer vision
 * @param {string} imagePath - Path to image
 * @param {Object} metadata - Image metadata from sharp
 * @returns {Promise<Array>} Array of detected elements
 */
async function detectElements(imagePath, metadata) {
  const elements = [];
  let elementId = 1;

  try {
    // Step 1: Perform OCR to detect text elements
    console.log('  Running OCR detection...');
    const { data } = await Tesseract.recognize(imagePath, 'eng', {
      logger: () => {} // Suppress Tesseract logs
    });

    // Process OCR results
    if (data.words && data.words.length > 0) {
      // Group words into text blocks
      const textBlocks = groupWordsIntoBlocks(data.words, metadata);

      for (const block of textBlocks) {
        const semanticRole = determineSemanticRole(block.text, block.position, metadata);

        elements.push({
          id: elementId++,
          type: 'text',
          content: block.text,
          position: block.position,
          semanticRole: semanticRole,
          detectionConfidence: block.confidence
        });
      }
    }

    // Step 2: Detect visual elements (shapes, icons, images)
    console.log('  Detecting visual elements...');
    const visualElements = await detectVisualElements(imagePath, metadata);

    for (const visual of visualElements) {
      elements.push({
        id: elementId++,
        ...visual
      });
    }

    // Step 3: Sort elements by vertical position (top to bottom)
    elements.sort((a, b) => a.position.y - b.position.y);

    // Reassign IDs after sorting
    elements.forEach((el, index) => {
      el.id = index + 1;
    });

    console.log(`  Detected ${elements.length} elements`);

  } catch (error) {
    console.warn('  Element detection encountered issues:', error.message);
    // Return basic fallback element if detection fails
    elements.push({
      id: 1,
      type: 'image',
      content: 'Full infographic',
      position: { x: 0, y: 0, width: metadata.width, height: metadata.height },
      semanticRole: 'background',
      detectionConfidence: 0.5
    });
  }

  return elements;
}

/**
 * Groups OCR words into logical text blocks
 * @param {Array} words - Array of word objects from Tesseract
 * @param {Object} metadata - Image metadata
 * @returns {Array} Array of text blocks
 */
function groupWordsIntoBlocks(words, metadata) {
  const blocks = [];
  const threshold = metadata.height * 0.05; // 5% of image height for vertical grouping

  // Sort words by vertical position
  const sortedWords = words
    .filter(w => w.confidence > 60) // Filter low confidence words
    .sort((a, b) => a.bbox.y0 - b.bbox.y0);

  let currentBlock = null;

  for (const word of sortedWords) {
    if (!currentBlock || Math.abs(word.bbox.y0 - currentBlock.lastY) > threshold) {
      // Start new block
      if (currentBlock) {
        blocks.push(currentBlock);
      }
      currentBlock = {
        text: word.text,
        position: {
          x: word.bbox.x0,
          y: word.bbox.y0,
          width: word.bbox.x1 - word.bbox.x0,
          height: word.bbox.y1 - word.bbox.y0
        },
        confidence: word.confidence,
        lastY: word.bbox.y1,
        minX: word.bbox.x0,
        maxX: word.bbox.x1
      };
    } else {
      // Add to existing block
      currentBlock.text += ' ' + word.text;
      currentBlock.confidence = (currentBlock.confidence + word.confidence) / 2;
      currentBlock.lastY = word.bbox.y1;
      currentBlock.minX = Math.min(currentBlock.minX, word.bbox.x0);
      currentBlock.maxX = Math.max(currentBlock.maxX, word.bbox.x1);
      currentBlock.position.width = currentBlock.maxX - currentBlock.minX;
      currentBlock.position.height = word.bbox.y1 - currentBlock.position.y;
    }
  }

  if (currentBlock) {
    blocks.push(currentBlock);
  }

  return blocks;
}

/**
 * Determines the semantic role of a text block based on content and position
 * @param {string} text - Text content
 * @param {Object} position - Position and size
 * @param {Object} metadata - Image metadata
 * @returns {string} Semantic role
 */
function determineSemanticRole(text, position, metadata) {
  const normalizedY = position.y / metadata.height;
  const textLower = text.toLowerCase();

  // Title detection (top 25% of image)
  if (normalizedY < 0.25) {
    return 'title';
  }

  // CTA detection (bottom 25% of image or contains action words)
  if (normalizedY > 0.75 ||
      textLower.includes('learn more') ||
      textLower.includes('sign up') ||
      textLower.includes('get started') ||
      textLower.includes('click') ||
      textLower.includes('buy') ||
      textLower.includes('download')) {
    return 'cta';
  }

  // Stat detection (contains numbers and %/$)
  if (/\d+[%$]?/.test(text) || /\d{1,3}(,\d{3})*/.test(text)) {
    return 'stat';
  }

  // Default to body text
  return 'body';
}

/**
 * Detects visual elements like shapes, icons, and images
 * @param {string} imagePath - Path to image
 * @param {Object} metadata - Image metadata
 * @returns {Promise<Array>} Array of visual elements
 */
async function detectVisualElements(imagePath, metadata) {
  const elements = [];

  // Simplified visual detection
  // In production, you might use computer vision libraries like OpenCV
  // For now, we'll detect background and assume other visual elements based on image analysis

  // Detect if image has a gradient or solid color background
  const hasBackground = await hasColorBackground(imagePath);

  if (hasBackground) {
    elements.push({
      type: 'background',
      content: 'Background gradient/color',
      position: { x: 0, y: 0, width: metadata.width, height: metadata.height },
      semanticRole: 'background',
      detectionConfidence: 0.8
    });
  }

  // Additional visual detection logic can be added here
  // e.g., icon detection, shape detection, etc.

  return elements;
}

/**
 * Checks if image has a distinct background color/gradient
 * @param {string} imagePath - Path to image
 * @returns {Promise<boolean>}
 */
async function hasColorBackground(imagePath) {
  try {
    const stats = await sharp(imagePath).stats();
    // If image has relatively uniform colors, likely has background
    // This is a simplified heuristic
    return stats.channels.some(channel => channel.mean > 200 || channel.mean < 55);
  } catch {
    return false;
  }
}

/**
 * Generates a human-readable summary of detected elements
 * @param {Array} elements - Array of elements
 * @returns {string} Summary text
 */
function generateSummary(elements) {
  const types = {
    title: elements.filter(e => e.semanticRole === 'title').length,
    stat: elements.filter(e => e.semanticRole === 'stat').length,
    cta: elements.filter(e => e.semanticRole === 'cta').length,
    text: elements.filter(e => e.type === 'text' && e.semanticRole === 'body').length,
    visual: elements.filter(e => e.type !== 'text').length
  };

  const parts = [];

  if (types.title > 0) parts.push(`${types.title} title${types.title > 1 ? 's' : ''}`);
  if (types.stat > 0) parts.push(`${types.stat} stat box${types.stat > 1 ? 'es' : ''}`);
  if (types.text > 0) parts.push(`${types.text} text block${types.text > 1 ? 's' : ''}`);
  if (types.cta > 0) parts.push(`${types.cta} CTA${types.cta > 1 ? 's' : ''}`);
  if (types.visual > 0) parts.push(`${types.visual} visual element${types.visual > 1 ? 's' : ''}`);

  if (parts.length === 0) {
    return 'Infographic with visual content';
  }

  return 'Infographic with ' + parts.join(', ');
}

/**
 * Parses target aspect ratio into dimensions
 * @param {string} ratio - Aspect ratio string (e.g., '16:9')
 * @returns {Object} Width, height, and ratio
 */
function parseTargetRatio(ratio) {
  const resolutionMap = {
    '1:1': { width: 1080, height: 1080 },
    '16:9': { width: 1920, height: 1080 },
    '9:16': { width: 1080, height: 1920 },
    '4:5': { width: 1080, height: 1350 }
  };

  return { ...resolutionMap[ratio], ratio };
}

/**
 * Formats analysis for display to user
 * @param {Array} elements - Array of elements
 * @returns {string} Formatted text for user display
 */
export function formatAnalysisForUser(elements) {
  let output = 'I analyzed your infographic and found these elements:\n\n';

  for (const element of elements) {
    const roleLabel = {
      'title': 'Title',
      'stat': 'Stat Box',
      'cta': 'CTA Button',
      'body': 'Text',
      'background': 'Background'
    }[element.semanticRole] || 'Element';

    const position = describePosition(element.position);

    if (element.type === 'text' && element.semanticRole !== 'background') {
      output += `${element.id}. ${roleLabel}: "${element.content}" (${position})\n`;
    } else if (element.type !== 'background') {
      output += `${element.id}. ${roleLabel}: ${element.content} (${position})\n`;
    }
  }

  output += '\nThese element numbers will be used if you choose custom animation preferences.';

  return output;
}

/**
 * Describes element position in human-readable terms
 * @param {Object} position - Position object
 * @returns {string} Position description
 */
function describePosition(position) {
  const { y, height } = position;
  const center = y + (height / 2);
  const imageHeight = 1000; // Normalized reference

  const normalizedCenter = (center / imageHeight);

  if (normalizedCenter < 0.33) return 'top section';
  if (normalizedCenter < 0.67) return 'middle section';
  return 'bottom section';
}

export default analyzeInfographic;
