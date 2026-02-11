/**
 * @file base-composition.jsx
 * @description Base Remotion composition template
 * @author BenAI Team
 * @version 1.0.0
 *
 * This is a template file that demonstrates the structure of a Remotion composition
 * The actual composition is generated dynamically by remotionGenerator.js
 */

import React from 'react';
import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

/**
 * Example easing functions
 * These are included in generated components
 */
const easingFunctions = {
  easeOut: (t) => 1 - Math.pow(1 - t, 3),
  easeIn: (t) => Math.pow(t, 3),
  easeInOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  easeOutBack: (t) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeOutElastic: (t) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  linear: (t) => t
};

/**
 * Example: Title element animation hook
 * @param {number} frame - Current frame number
 * @returns {Object} Style object with animated properties
 */
const useTitleAnimation = (frame) => {
  const startFrame = 0;
  const endFrame = 60; // 2 seconds at 30fps

  const opacity = interpolate(
    frame,
    [startFrame, endFrame],
    [0, 1],
    { extrapolateRight: 'clamp', easing: easingFunctions.easeOut }
  );

  const scale = interpolate(
    frame,
    [startFrame, endFrame],
    [0.95, 1],
    { extrapolateRight: 'clamp', easing: easingFunctions.easeOut }
  );

  return { opacity, scale };
};

/**
 * Example: Stat box animation hook with stagger
 * @param {number} frame - Current frame number
 * @param {number} index - Element index for stagger calculation
 * @returns {Object} Style object with animated properties
 */
const useStatAnimation = (frame, index) => {
  const staggerDelay = 0.3; // seconds
  const startTime = 1.5 + (index * staggerDelay);
  const duration = 2;

  const startFrame = Math.floor(startTime * 30);
  const endFrame = Math.floor((startTime + duration) * 30);

  const opacity = interpolate(
    frame,
    [startFrame, endFrame],
    [0, 1],
    { extrapolateRight: 'clamp', easing: easingFunctions.easeOutBack }
  );

  const scale = interpolate(
    frame,
    [startFrame, endFrame],
    [0, 1],
    { extrapolateRight: 'clamp', easing: easingFunctions.easeOutBack }
  );

  return { opacity, scale };
};

/**
 * Example: CTA pulse animation hook
 * @param {number} frame - Current frame number
 * @returns {Object} Style object with animated properties
 */
const useCtaPulseAnimation = (frame) => {
  const startFrame = 240; // 8 seconds at 30fps
  const cycleDuration = 60; // 2 seconds per pulse cycle

  if (frame < startFrame) {
    return { scale: 0, opacity: 0 };
  }

  const cycleFrame = (frame - startFrame) % cycleDuration;
  const midCycle = cycleDuration / 2;

  const scale = cycleFrame < midCycle
    ? interpolate(cycleFrame, [0, midCycle], [1, 1.05], { easing: easingFunctions.easeInOut })
    : interpolate(cycleFrame, [midCycle, cycleDuration], [1.05, 1], { easing: easingFunctions.easeInOut });

  return { scale, opacity: 1 };
};

/**
 * Base Animated Infographic Component
 * This demonstrates the structure of a generated composition
 */
export const AnimatedInfographic = ({ imagePath = '/path/to/infographic.png' }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Get animation states for each element
  const titleStyle = useTitleAnimation(frame);
  const stat1Style = useStatAnimation(frame, 0);
  const stat2Style = useStatAnimation(frame, 1);
  const stat3Style = useStatAnimation(frame, 2);
  const ctaStyle = useCtaPulseAnimation(frame);

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      {/* Base infographic image - always visible */}
      <Img
        src={imagePath}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />

      {/* Example animated overlay elements */}
      {/* In actual generated code, these would be positioned based on element analysis */}

      {/* Title element overlay */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: `translate(-50%, 0) scale(${titleStyle.scale})`,
          opacity: titleStyle.opacity,
          width: '80%',
          textAlign: 'center',
          pointerEvents: 'none'
        }}
      >
        {/* Title animation overlay */}
      </div>

      {/* Stat boxes with stagger */}
      {[stat1Style, stat2Style, stat3Style].map((style, index) => (
        <div
          key={`stat-${index}`}
          style={{
            position: 'absolute',
            top: '40%',
            left: `${20 + index * 30}%`,
            transform: `scale(${style.scale})`,
            opacity: style.opacity,
            pointerEvents: 'none'
          }}
        >
          {/* Stat box animation overlay */}
        </div>
      ))}

      {/* CTA pulse animation */}
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '50%',
          transform: `translate(-50%, 0) scale(${ctaStyle.scale})`,
          opacity: ctaStyle.opacity,
          pointerEvents: 'none'
        }}
      >
        {/* CTA animation overlay */}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Remotion Root Component
 * Exports the composition configuration
 */
export const RemotionRoot = () => {
  return (
    <AnimatedInfographic />
  );
};

/**
 * Export configuration for Remotion CLI
 */
export const COMPOSITION_CONFIG = {
  id: 'AnimatedInfographic',
  component: AnimatedInfographic,
  durationInFrames: 300, // 10 seconds at 30fps
  fps: 30,
  width: 1080,
  height: 1080,
  defaultProps: {
    imagePath: '/path/to/infographic.png'
  }
};

export default AnimatedInfographic;
