/**
 * @file animation-presets.js
 * @description Pre-configured animation presets for common infographic elements
 * @author BenAI Team
 * @version 1.0.0
 */

/**
 * Spring configurations following Remotion best practices
 * These configs are optimized for professional infographic animations
 */
export const SPRING_CONFIGS = {
  /** Smooth (no bounce) - ideal for professional infographics */
  SMOOTH: { damping: 200 },

  /** Snappy - minimal bounce for UI elements */
  SNAPPY: { damping: 20, stiffness: 200 },

  /** Bouncy - playful animations for engaging content */
  BOUNCY: { damping: 8 },

  /** Heavy - slow, weighted feel */
  HEAVY: { damping: 15, stiffness: 80, mass: 2 },

  /** Default - has bounce, use sparingly */
  DEFAULT: { damping: 10, stiffness: 100, mass: 1 }
};

/**
 * Animation preset configurations
 * Each preset includes timing, easing, and transform specifications
 * Updated to follow Remotion best practices
 */
export const ANIMATION_PRESETS = {
  /**
   * Fade In: Simple opacity animation
   */
  FADE_IN: {
    name: 'Fade In',
    duration: 2, // seconds
    easing: 'easeOut',
    transforms: {
      opacity: { from: 0, to: 1 }
    },
    description: 'Simple fade in effect, ideal for text and subtle element entrances'
  },

  /**
   * Fade In with Scale: Opacity + subtle scale for polish
   * Uses spring animation with smooth config (no bounce)
   */
  FADE_IN_SCALE: {
    name: 'Fade In with Scale',
    duration: 2,
    easing: 'spring',
    springConfig: SPRING_CONFIGS.SMOOTH,
    transforms: {
      opacity: { from: 0, to: 1 },
      scale: { from: 0.95, to: 1 }
    },
    description: 'Fade in with subtle scale, perfect for titles and headers'
  },

  /**
   * Zoom In: Dynamic scale animation for impact
   * Uses spring animation with smooth config for professional look
   */
  ZOOM_IN: {
    name: 'Zoom In',
    duration: 2,
    easing: 'spring',
    springConfig: SPRING_CONFIGS.SMOOTH,
    transforms: {
      opacity: { from: 0, to: 1 },
      scale: { from: 0, to: 1 }
    },
    description: 'Dramatic zoom entrance, great for stat boxes and data visualizations'
  },

  /**
   * Pop In: Bouncy, attention-grabbing entrance
   */
  POP_IN: {
    name: 'Pop In',
    duration: 1.5,
    easing: 'easeOutElastic',
    transforms: {
      opacity: { from: 0, to: 1 },
      scale: { from: 0, to: 1 }
    },
    description: 'Elastic pop effect, ideal for icons and small elements'
  },

  /**
   * Slide In from Bottom
   */
  SLIDE_IN_BOTTOM: {
    name: 'Slide In from Bottom',
    duration: 2,
    easing: 'easeOut',
    transforms: {
      opacity: { from: 0, to: 1 },
      translateY: { from: 50, to: 0 }
    },
    description: 'Slides up from bottom, works well for CTAs and bottom-aligned content'
  },

  /**
   * Slide In from Top
   */
  SLIDE_IN_TOP: {
    name: 'Slide In from Top',
    duration: 2,
    easing: 'easeOut',
    transforms: {
      opacity: { from: 0, to: 1 },
      translateY: { from: -50, to: 0 }
    },
    description: 'Slides down from top, perfect for headers and titles'
  },

  /**
   * Slide In from Left
   */
  SLIDE_IN_LEFT: {
    name: 'Slide In from Left',
    duration: 2,
    easing: 'easeOut',
    transforms: {
      opacity: { from: 0, to: 1 },
      translateX: { from: -50, to: 0 }
    },
    description: 'Slides in from left side'
  },

  /**
   * Slide In from Right
   */
  SLIDE_IN_RIGHT: {
    name: 'Slide In from Right',
    duration: 2,
    easing: 'easeOut',
    transforms: {
      opacity: { from: 0, to: 1 },
      translateX: { from: 50, to: 0 }
    },
    description: 'Slides in from right side'
  },

  /**
   * Pulse: Continuous subtle scale loop
   */
  PULSE: {
    name: 'Pulse',
    duration: 2,
    easing: 'easeInOut',
    transforms: {
      scale: { from: 1, to: 1.05, loop: true }
    },
    loop: true,
    description: 'Continuous pulse effect, ideal for CTAs and call-to-action elements'
  },

  /**
   * Bounce In: Playful bounce entrance
   */
  BOUNCE_IN: {
    name: 'Bounce In',
    duration: 1.5,
    easing: 'easeOutBounce',
    transforms: {
      opacity: { from: 0, to: 1 },
      scale: { from: 0, to: 1 }
    },
    description: 'Bouncy entrance, fun and energetic'
  },

  /**
   * Rotate In: Rotation with fade
   */
  ROTATE_IN: {
    name: 'Rotate In',
    duration: 2,
    easing: 'easeOut',
    transforms: {
      opacity: { from: 0, to: 1 },
      rotate: { from: -180, to: 0 }
    },
    description: 'Rotates while fading in, unique and eye-catching'
  },

  /**
   * Static: No animation (for backgrounds)
   */
  STATIC: {
    name: 'Static',
    duration: 0,
    easing: 'linear',
    transforms: {},
    description: 'No animation, element remains static throughout'
  }
};

/**
 * Semantic role to animation mapping
 * Automatically assigns appropriate animations based on element type
 */
export const SEMANTIC_ANIMATION_MAP = {
  title: 'FADE_IN_SCALE',
  stat: 'ZOOM_IN',
  cta: 'PULSE',
  body: 'FADE_IN',
  icon: 'POP_IN',
  background: 'STATIC',
  image: 'FADE_IN',
  chart: 'ZOOM_IN',
  quote: 'SLIDE_IN_LEFT'
};

/**
 * Gets animation preset by name
 * @param {string} presetName - Name of preset (e.g., 'FADE_IN', 'ZOOM_IN')
 * @returns {Object} Animation preset configuration
 */
export function getPreset(presetName) {
  if (!ANIMATION_PRESETS[presetName]) {
    console.warn(`Animation preset '${presetName}' not found, using FADE_IN as default`);
    return ANIMATION_PRESETS.FADE_IN;
  }
  return ANIMATION_PRESETS[presetName];
}

/**
 * Gets animation preset for a semantic role
 * @param {string} semanticRole - Element semantic role (e.g., 'title', 'stat', 'cta')
 * @returns {Object} Animation preset configuration
 */
export function getPresetForRole(semanticRole) {
  const presetName = SEMANTIC_ANIMATION_MAP[semanticRole] || 'FADE_IN';
  return ANIMATION_PRESETS[presetName];
}

/**
 * Gets all available preset names
 * @returns {Array<string>} Array of preset names
 */
export function getAvailablePresets() {
  return Object.keys(ANIMATION_PRESETS);
}

/**
 * Generates timing configuration with stagger
 * @param {number} elementCount - Number of elements to animate
 * @param {number} startTime - Start time in seconds
 * @param {number} staggerDelay - Delay between each element in seconds
 * @param {number} duration - Duration of each animation in seconds
 * @returns {Array<Object>} Array of timing configurations
 */
export function generateStaggeredTiming(elementCount, startTime, staggerDelay, duration) {
  const timings = [];

  for (let i = 0; i < elementCount; i++) {
    const start = startTime + (i * staggerDelay);
    timings.push({
      index: i,
      start,
      end: start + duration,
      startFrame: Math.floor(start * 30), // Assuming 30 FPS
      endFrame: Math.floor((start + duration) * 30)
    });
  }

  return timings;
}

/**
 * Creates a custom animation preset
 * @param {string} name - Name of the custom preset
 * @param {Object} config - Animation configuration
 * @returns {Object} Animation preset
 */
export function createCustomPreset(name, config) {
  return {
    name,
    duration: config.duration || 2,
    easing: config.easing || 'easeOut',
    transforms: config.transforms || {},
    loop: config.loop || false,
    description: config.description || `Custom animation: ${name}`
  };
}

/**
 * Easing function implementations
 */
export const EASING_FUNCTIONS = {
  linear: (t) => t,

  easeIn: (t) => t * t,
  easeOut: (t) => t * (2 - t),
  easeInOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),

  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => --t * t * t + 1,
  easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),

  easeInQuart: (t) => t * t * t * t,
  easeOutQuart: (t) => 1 - --t * t * t * t,
  easeInOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),

  easeOutBack: (t) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },

  easeOutElastic: (t) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },

  easeOutBounce: (t) => {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  }
};

export default {
  ANIMATION_PRESETS,
  SEMANTIC_ANIMATION_MAP,
  EASING_FUNCTIONS,
  getPreset,
  getPresetForRole,
  getAvailablePresets,
  generateStaggeredTiming,
  createCustomPreset
};
