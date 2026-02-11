/**
 * @file remotionGenerator.js
 * @description Remotion React component generator
 * @author BenAI Team
 * @version 1.0.0
 */

import fs from 'fs/promises';
import path from 'path';

/**
 * Generates a Remotion React component from animation prompt
 * @param {string} animationPrompt - Detailed animation specification
 * @param {Object} resolution - Target resolution {width, height}
 * @param {string} imagePath - Path to the adapted base image
 * @param {string} outputDir - Directory to write component file
 * @returns {Promise<string>} Path to generated component file
 */
export async function generateRemotionComponent(animationPrompt, resolution, imagePath, outputDir) {
  const { width, height } = resolution;

  // Parse the animation prompt to extract animation specifications
  const animations = parseAnimationPrompt(animationPrompt);

  // Generate the React component code following Remotion best practices
  const componentCode = `/**
 * Auto-generated Remotion component by Animate Posts plugin
 * Generated at: ${new Date().toISOString()}
 *
 * FOLLOWS REMOTION BEST PRACTICES:
 * - Frame-based animations only (no CSS transitions)
 * - Spring animations with smooth config ({ damping: 200 })
 * - Proper extrapolation clamping
 * - Timing in seconds × fps for readability
 * - Remotion Img component with staticFile() for assets
 */
import React from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing
} from 'remotion';

const DURATION_IN_FRAMES = 300; // 10 seconds at 30fps
const FPS = 30;

// Spring configurations (Remotion best practices)
const SPRING_CONFIGS = {
  SMOOTH: { damping: 200 }, // No bounce - professional look
  SNAPPY: { damping: 20, stiffness: 200 },
  BOUNCY: { damping: 8 },
  HEAVY: { damping: 15, stiffness: 80, mass: 2 }
};

// Easing functions (for interpolate-based animations)
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeIn = (t) => Math.pow(t, 3);
const easeInOut = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOutBack = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const easeOutElastic = (t) => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

${generateElementAnimations(animations)}

export const AnimatedInfographic = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      {/* Base infographic image - using Remotion Img component */}
      <Img
        src={staticFile("${path.basename(imagePath)}")}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />

      {/* Animated overlay elements */}
      ${generateAnimatedElements(animations)}
    </AbsoluteFill>
  );
};

export const RemotionRoot = () => {
  return (
    <>
      <AnimatedInfographic />
    </>
  );
};
`;

  // Write component to file
  const componentPath = path.join(outputDir, 'AnimatedComposition.jsx');
  await fs.writeFile(componentPath, componentCode, 'utf-8');

  // Also create a composition config file
  const configCode = `import { Composition } from 'remotion';
import { AnimatedInfographic } from './AnimatedComposition.jsx';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="AnimatedInfographic"
        component={AnimatedInfographic}
        durationInFrames={300}
        fps={30}
        width={${width}}
        height={${height}}
      />
    </>
  );
};
`;

  const configPath = path.join(outputDir, 'Root.jsx');
  await fs.writeFile(configPath, configCode, 'utf-8');

  return componentPath;
}

/**
 * Parses animation prompt into structured animation specs
 * @param {string} prompt - Animation prompt text
 * @returns {Array} Array of animation specifications
 */
function parseAnimationPrompt(prompt) {
  const animations = [];
  const lines = prompt.split('\n');

  let currentElement = null;

  for (const line of lines) {
    // Match element headers: "Element 1 (...)"
    const elementMatch = line.match(/Element\s+(\d+)\s+\("?([^"]+)"?\)/i);
    if (elementMatch) {
      if (currentElement) {
        animations.push(currentElement);
      }
      currentElement = {
        id: parseInt(elementMatch[1]),
        content: elementMatch[2],
        animation: 'Fade in',
        timing: { start: 0, end: 2 },
        easing: 'easeOut',
        transform: 'opacity 0→1',
        loop: false
      };
      continue;
    }

    if (!currentElement) continue;

    // Parse animation properties
    if (line.includes('- Animation:')) {
      currentElement.animation = line.split(':')[1].trim();
    } else if (line.includes('- Timing:')) {
      const timingMatch = line.match(/([\d.]+)s\s*-\s*([\d.]+)s/);
      if (timingMatch) {
        currentElement.timing = {
          start: parseFloat(timingMatch[1]),
          end: parseFloat(timingMatch[2])
        };
      }
    } else if (line.includes('- Easing:')) {
      currentElement.easing = line.split(':')[1].trim();
    } else if (line.includes('- Transform:')) {
      currentElement.transform = line.split(':')[1].trim();
    } else if (line.includes('- Loop:')) {
      currentElement.loop = line.toLowerCase().includes('continuous') || line.toLowerCase().includes('yes');
    } else if (line.includes('- Stagger delay:')) {
      const staggerMatch = line.match(/([\d.]+)s/);
      if (staggerMatch) {
        currentElement.staggerDelay = parseFloat(staggerMatch[1]);
      }
    }
  }

  if (currentElement) {
    animations.push(currentElement);
  }

  return animations;
}

/**
 * Generates animation hook functions for each element
 * @param {Array} animations - Array of animation specs
 * @returns {string} Hook function code
 */
function generateElementAnimations(animations) {
  let code = '';

  for (const anim of animations) {
    if (anim.animation.toLowerCase().includes('background') || anim.animation.toLowerCase().includes('static')) {
      continue; // Skip background elements
    }

    const functionName = `useElement${anim.id}Animation`;
    const easingFunc = mapEasingToFunction(anim.easing);
    const startFrame = Math.floor(anim.timing.start * 30);
    const endFrame = Math.floor(anim.timing.end * 30);

    code += `
const ${functionName} = (frame) => {
  ${generateTransformCode(anim, startFrame, endFrame, easingFunc)}
};
`;
  }

  return code;
}

/**
 * Generates transform interpolation code based on animation specs
 * @param {Object} anim - Animation specification
 * @param {number} startFrame - Start frame
 * @param {number} endFrame - End frame
 * @param {string} easingFunc - Easing function name
 * @returns {string} Transform code
 */
function generateTransformCode(anim, startFrame, endFrame, easingFunc) {
  const transforms = [];
  const transformStr = anim.transform.toLowerCase();

  // Parse opacity
  if (transformStr.includes('opacity')) {
    const match = transformStr.match(/opacity\s+([\d.]+)→([\d.]+)/);
    if (match) {
      const from = parseFloat(match[1]);
      const to = parseFloat(match[2]);
      transforms.push(`
  const opacity = interpolate(
    frame,
    [${startFrame}, ${endFrame}],
    [${from}, ${to}],
    { extrapolateRight: 'clamp', easing: ${easingFunc} }
  );`);
    }
  }

  // Parse scale
  if (transformStr.includes('scale')) {
    const match = transformStr.match(/scale\s+([\d.]+)→([\d.]+)(?:→([\d.]+))?/);
    if (match) {
      const from = parseFloat(match[1]);
      const to = parseFloat(match[2]);
      const loopTo = match[3] ? parseFloat(match[3]) : null;

      if (loopTo !== null && anim.loop) {
        // Pulse/loop animation
        const midFrame = Math.floor((startFrame + endFrame) / 2);
        transforms.push(`
  const scale = frame < ${midFrame}
    ? interpolate(frame, [${startFrame}, ${midFrame}], [${from}, ${to}], { easing: ${easingFunc} })
    : interpolate(frame, [${midFrame}, ${endFrame}], [${to}, ${loopTo}], { easing: ${easingFunc} });`);
      } else {
        transforms.push(`
  const scale = interpolate(
    frame,
    [${startFrame}, ${endFrame}],
    [${from}, ${to}],
    { extrapolateRight: 'clamp', easing: ${easingFunc} }
  );`);
      }
    }
  }

  // Parse translateY
  if (transformStr.includes('translatey')) {
    const match = transformStr.match(/translatey\s+([-\d.]+)→([-\d.]+)/);
    if (match) {
      const from = parseFloat(match[1]);
      const to = parseFloat(match[2]);
      transforms.push(`
  const translateY = interpolate(
    frame,
    [${startFrame}, ${endFrame}],
    [${from}, ${to}],
    { extrapolateRight: 'clamp', easing: ${easingFunc} }
  );`);
    }
  }

  // Parse translateX
  if (transformStr.includes('translatex')) {
    const match = transformStr.match(/translatex\s+([-\d.]+)→([-\d.]+)/);
    if (match) {
      const from = parseFloat(match[1]);
      const to = parseFloat(match[2]);
      transforms.push(`
  const translateX = interpolate(
    frame,
    [${startFrame}, ${endFrame}],
    [${from}, ${to}],
    { extrapolateRight: 'clamp', easing: ${easingFunc} }
  );`);
    }
  }

  // Return transform values
  const returnValues = [];
  if (transformStr.includes('opacity')) returnValues.push('opacity');
  if (transformStr.includes('scale')) returnValues.push('scale');
  if (transformStr.includes('translatex')) returnValues.push('translateX');
  if (transformStr.includes('translatey')) returnValues.push('translateY');

  transforms.push(`
  return { ${returnValues.join(', ')} };`);

  return transforms.join('\n');
}

/**
 * Generates animated element JSX code
 * @param {Array} animations - Array of animation specs
 * @returns {string} JSX code for animated elements
 */
function generateAnimatedElements(animations) {
  let code = '';

  for (const anim of animations) {
    if (anim.animation.toLowerCase().includes('background') || anim.animation.toLowerCase().includes('static')) {
      continue;
    }

    code += `
      {/* Element ${anim.id}: ${anim.content} */}
      <div
        style={{
          position: 'absolute',
          ...useElement${anim.id}Animation(frame),
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      >
        {/* Element overlay - positioned based on original analysis */}
      </div>
`;
  }

  return code;
}

/**
 * Maps easing name to function
 * @param {string} easingName - Name of easing function
 * @returns {string} Function name
 */
function mapEasingToFunction(easingName) {
  const map = {
    'easeout': 'easeOut',
    'easein': 'easeIn',
    'easeinout': 'easeInOut',
    'easeoutback': 'easeOutBack',
    'easeoutelastic': 'easeOutElastic',
    'linear': '(t) => t'
  };

  return map[easingName.toLowerCase().replace(/[-_\s]/g, '')] || 'easeOut';
}

export default generateRemotionComponent;
