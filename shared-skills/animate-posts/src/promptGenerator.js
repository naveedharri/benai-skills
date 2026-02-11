/**
 * @file promptGenerator.js
 * @description Animation prompt generation module
 * @author BenAI Team
 * @version 1.0.0
 */

/**
 * Generates an AI auto-animate prompt based on detected elements
 * @param {Array} elements - Array of detected elements from analyzer
 * @returns {Promise<string>} Detailed animation specification prompt
 */
export async function generateAutoAnimationPrompt(elements) {
  const totalDuration = 10; // seconds
  const fps = 30;

  // Fetch Remotion best practices (if skills.sh is available)
  // const remotionBestPractices = await fetchSkill('remotion-best-practices');

  // Categorize elements by semantic role
  const titleElements = elements.filter(e => e.semanticRole === 'title');
  const statElements = elements.filter(e => e.semanticRole === 'stat');
  const ctaElements = elements.filter(e => e.semanticRole === 'cta');
  const bodyElements = elements.filter(e => e.semanticRole === 'body');
  const backgroundElements = elements.filter(e => e.semanticRole === 'background');

  // Calculate timing allocations
  const timings = calculateTimings(elements, totalDuration);

  // Build the detailed prompt
  let prompt = `Create a Remotion composition with the following animations:\n\n`;
  prompt += `Total Duration: ${totalDuration} seconds (${totalDuration * fps} frames at ${fps}fps)\n\n`;

  // Background (if present)
  if (backgroundElements.length > 0) {
    prompt += `=== Background Elements ===\n`;
    for (const bg of backgroundElements) {
      prompt += `Element ${bg.id} (${bg.content}):\n`;
      prompt += `- Animation: Static background or subtle parallax\n`;
      prompt += `- Timing: 0s - ${totalDuration}s (entire duration)\n`;
      prompt += `- No opacity changes\n\n`;
    }
  }

  // Titles
  if (titleElements.length > 0) {
    prompt += `=== Title Elements ===\n`;
    for (const title of titleElements) {
      const timing = timings[title.id];
      prompt += `Element ${title.id} ("${title.content}"):\n`;
      prompt += `- Animation: Fade in with subtle scale\n`;
      prompt += `- Timing: ${timing.start}s - ${timing.end}s (Frames ${timing.start * fps}-${timing.end * fps})\n`;
      prompt += `- Easing: easeOut\n`;
      prompt += `- Transform: opacity 0→1, scale 0.95→1\n`;
      prompt += `- Position: Maintain original position from analysis\n\n`;
    }
  }

  // Stat boxes
  if (statElements.length > 0) {
    prompt += `=== Stat/Data Elements ===\n`;
    statElements.forEach((stat, index) => {
      const timing = timings[stat.id];
      const staggerDelay = index * 0.3;
      prompt += `Element ${stat.id} ("${stat.content}"):\n`;
      prompt += `- Animation: Zoom in with stagger\n`;
      prompt += `- Timing: ${timing.start}s - ${timing.end}s (Frames ${Math.floor(timing.start * fps)}-${Math.floor(timing.end * fps)})\n`;
      prompt += `- Stagger delay: ${staggerDelay.toFixed(1)}s from first stat element\n`;
      prompt += `- Easing: easeOutBack\n`;
      prompt += `- Transform: scale 0→1, opacity 0→1\n`;
      prompt += `- Position: Maintain original position\n\n`;
    });
  }

  // Body text
  if (bodyElements.length > 0) {
    prompt += `=== Body Text Elements ===\n`;
    for (const body of bodyElements) {
      const timing = timings[body.id];
      prompt += `Element ${body.id} ("${body.content}"):\n`;
      prompt += `- Animation: Fade in\n`;
      prompt += `- Timing: ${timing.start}s - ${timing.end}s (Frames ${Math.floor(timing.start * fps)}-${Math.floor(timing.end * fps)})\n`;
      prompt += `- Easing: easeOut\n`;
      prompt += `- Transform: opacity 0→1\n\n`;
    }
  }

  // CTAs
  if (ctaElements.length > 0) {
    prompt += `=== CTA Elements ===\n`;
    for (const cta of ctaElements) {
      const timing = timings[cta.id];
      prompt += `Element ${cta.id} ("${cta.content}"):\n`;
      prompt += `- Animation: Pulse effect (continuous loop)\n`;
      prompt += `- Timing: ${timing.start}s - ${totalDuration}s (Frames ${Math.floor(timing.start * fps)}-${totalDuration * fps})\n`;
      prompt += `- Easing: easeInOut\n`;
      prompt += `- Transform: scale 1→1.05→1 (2-second pulse cycle)\n`;
      prompt += `- Loop: Continuous until end\n\n`;
    }
  }

  prompt += `=== Technical Requirements ===\n`;
  prompt += `- Use React functional components\n`;
  prompt += `- Use Remotion's interpolate() for all animations\n`;
  prompt += `- Use useCurrentFrame() and useVideoConfig() hooks\n`;
  prompt += `- Apply easing functions using Remotion's Easing namespace\n`;
  prompt += `- Ensure all animations complete within ${totalDuration} seconds\n`;
  prompt += `- Use AbsoluteImage for base infographic layer\n`;
  prompt += `- Layer animated overlays on top with position: absolute\n`;

  return prompt;
}

/**
 * Expands custom user preferences into detailed animation specifications
 * @param {string} userInput - Natural language user input
 * @param {Array} elements - Array of detected elements
 * @returns {Promise<string>} Detailed animation specification prompt
 */
export async function expandCustomPreferences(userInput, elements) {
  const totalDuration = 10;
  const fps = 30;

  let prompt = `Create a Remotion composition based on these user preferences:\n\n`;
  prompt += `User Request: "${userInput}"\n\n`;
  prompt += `=== Interpreted Animation Sequence ===\n\n`;

  // Parse user input for element references and actions
  const instructions = parseUserInstructions(userInput, elements);

  // Generate specifications for each instruction
  let currentTime = 0;
  for (const instruction of instructions) {
    const element = elements.find(e => e.id === instruction.elementId);
    if (!element) continue;

    const duration = instruction.duration || 2;
    const endTime = Math.min(currentTime + duration, totalDuration);

    prompt += `Element ${element.id} ("${element.content}"):\n`;
    prompt += `- Animation: ${instruction.animation}\n`;
    prompt += `- Timing: ${currentTime}s - ${endTime}s (Frames ${currentTime * fps}-${endTime * fps})\n`;
    prompt += `- Easing: ${instruction.easing || 'easeOut'}\n`;
    prompt += `- Transform: ${instruction.transform}\n`;

    if (instruction.stagger) {
      prompt += `- Stagger: ${instruction.stagger}s between elements\n`;
    }

    if (instruction.loop) {
      prompt += `- Loop: Continuous\n`;
    }

    prompt += `\n`;

    if (!instruction.simultaneous) {
      currentTime = endTime;
    }
  }

  // Fill remaining time with auto-animations for unmentioned elements
  const mentionedIds = new Set(instructions.map(i => i.elementId));
  const unmentionedElements = elements.filter(e => !mentionedIds.has(e.id) && e.semanticRole !== 'background');

  if (unmentionedElements.length > 0 && currentTime < totalDuration) {
    prompt += `=== Auto-Animated Elements (not specified by user) ===\n\n`;

    for (const element of unmentionedElements) {
      const remainingTime = totalDuration - currentTime;
      const duration = Math.min(2, remainingTime);

      prompt += `Element ${element.id} ("${element.content}"):\n`;
      prompt += `- Animation: Fade in (default)\n`;
      prompt += `- Timing: ${currentTime}s - ${currentTime + duration}s\n`;
      prompt += `- Easing: easeOut\n`;
      prompt += `- Transform: opacity 0→1\n\n`;

      currentTime += duration;
      if (currentTime >= totalDuration) break;
    }
  }

  prompt += `=== Technical Requirements ===\n`;
  prompt += `- Total duration: ${totalDuration} seconds (${totalDuration * fps} frames)\n`;
  prompt += `- FPS: ${fps}\n`;
  prompt += `- Use Remotion's interpolate() for all animations\n`;
  prompt += `- Respect user's specified sequence and timing\n`;

  return prompt;
}

/**
 * Parses user natural language instructions into structured commands
 * @param {string} userInput - User's natural language input
 * @param {Array} elements - Array of elements
 * @returns {Array} Array of parsed instructions
 */
function parseUserInstructions(userInput, elements) {
  const instructions = [];
  const input = userInput.toLowerCase();

  // Common animation keywords and their mappings
  const animationKeywords = {
    'fade': { animation: 'Fade in', transform: 'opacity 0→1', easing: 'easeOut' },
    'zoom': { animation: 'Zoom in', transform: 'scale 0→1, opacity 0→1', easing: 'easeOutBack' },
    'slide': { animation: 'Slide in', transform: 'translateY -50→0, opacity 0→1', easing: 'easeOut' },
    'pulse': { animation: 'Pulse', transform: 'scale 1→1.05→1', easing: 'easeInOut', loop: true },
    'bounce': { animation: 'Bounce in', transform: 'scale 0→1', easing: 'easeOutElastic' },
    'pop': { animation: 'Pop in', transform: 'scale 0→1.1→1', easing: 'easeOutBack' }
  };

  // Extract element references (e.g., "element 1", "elements 2,3,4", "(1)", "(2,3)")
  const elementReferences = extractElementReferences(input);

  // Extract animation actions
  for (const keyword in animationKeywords) {
    if (input.includes(keyword)) {
      const config = animationKeywords[keyword];

      // Find which elements this animation applies to
      const targetElements = findNearbyElements(input, keyword, elementReferences);

      for (const elementId of targetElements) {
        instructions.push({
          elementId,
          animation: config.animation,
          transform: config.transform,
          easing: config.easing,
          loop: config.loop,
          duration: extractDuration(input, keyword),
          simultaneous: checkIfSimultaneous(input, keyword),
          stagger: extractStagger(input, keyword)
        });
      }
    }
  }

  // If no specific instructions parsed, apply to all elements in sequence
  if (instructions.length === 0) {
    elements.forEach((element, index) => {
      if (element.semanticRole !== 'background') {
        instructions.push({
          elementId: element.id,
          animation: 'Fade in',
          transform: 'opacity 0→1',
          easing: 'easeOut',
          duration: 2,
          simultaneous: false
        });
      }
    });
  }

  return instructions;
}

/**
 * Extracts element references from user input
 * @param {string} input - User input
 * @returns {Array} Array of element IDs mentioned
 */
function extractElementReferences(input) {
  const references = [];

  // Match patterns like "element 1", "(1)", "1,2,3"
  const patterns = [
    /element\s+(\d+)/gi,
    /\((\d+(?:,\s*\d+)*)\)/g,
    /elements?\s+(\d+(?:,\s*\d+)*)/gi
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(input)) !== null) {
      const nums = match[1].split(',').map(n => parseInt(n.trim()));
      references.push(...nums);
    }
  }

  return [...new Set(references)]; // Remove duplicates
}

/**
 * Finds elements near a keyword in the input text
 * @param {string} input - User input
 * @param {string} keyword - Animation keyword
 * @param {Array} allReferences - All element references found
 * @returns {Array} Element IDs for this animation
 */
function findNearbyElements(input, keyword, allReferences) {
  const keywordIndex = input.indexOf(keyword);
  const nearbyText = input.substring(Math.max(0, keywordIndex - 20), keywordIndex + 30);

  const localRefs = extractElementReferences(nearbyText);

  if (localRefs.length > 0) {
    return localRefs;
  }

  // Default to all references if none found nearby
  return allReferences.length > 0 ? allReferences : [1];
}

/**
 * Extracts duration from user input near a keyword
 * @param {string} input - User input
 * @param {string} keyword - Animation keyword
 * @returns {number} Duration in seconds
 */
function extractDuration(input, keyword) {
  const keywordIndex = input.indexOf(keyword);
  const nearbyText = input.substring(keywordIndex, keywordIndex + 50);

  const durationMatch = nearbyText.match(/(\d+\.?\d*)\s*(?:sec|second|s)/i);
  if (durationMatch) {
    return parseFloat(durationMatch[1]);
  }

  return 2; // Default duration
}

/**
 * Checks if animation should be simultaneous
 * @param {string} input - User input
 * @param {string} keyword - Animation keyword
 * @returns {boolean}
 */
function checkIfSimultaneous(input, keyword) {
  const keywordIndex = input.indexOf(keyword);
  const nearbyText = input.substring(Math.max(0, keywordIndex - 30), keywordIndex + 50);

  const simultaneousKeywords = ['simultaneously', 'at the same time', 'together', 'all at once'];
  return simultaneousKeywords.some(k => nearbyText.includes(k));
}

/**
 * Extracts stagger timing from user input
 * @param {string} input - User input
 * @param {string} keyword - Animation keyword
 * @returns {number|null} Stagger delay in seconds
 */
function extractStagger(input, keyword) {
  const keywordIndex = input.indexOf(keyword);
  const nearbyText = input.substring(keywordIndex, keywordIndex + 100);

  const staggerMatch = nearbyText.match(/stagger(?:ed)?\s+(?:by\s+)?(\d+\.?\d*)\s*(?:sec|second|s)/i);
  if (staggerMatch) {
    return parseFloat(staggerMatch[1]);
  }

  const oneByOneMatch = /one\s+by\s+one/.test(nearbyText);
  if (oneByOneMatch) {
    return 0.5; // Default stagger for "one by one"
  }

  return null;
}

/**
 * Calculates timing for each element in auto-animate mode
 * @param {Array} elements - Array of elements
 * @param {number} totalDuration - Total duration in seconds
 * @returns {Object} Timing map keyed by element ID
 */
function calculateTimings(elements, totalDuration) {
  const timings = {};

  // Background elements (if any)
  const backgroundElements = elements.filter(e => e.semanticRole === 'background');
  for (const bg of backgroundElements) {
    timings[bg.id] = { start: 0, end: totalDuration };
  }

  // Title elements: 0s - 2s
  const titleElements = elements.filter(e => e.semanticRole === 'title');
  for (const title of titleElements) {
    timings[title.id] = { start: 0, end: 2 };
  }

  // Stat elements: 1.5s - 5s (staggered)
  const statElements = elements.filter(e => e.semanticRole === 'stat');
  statElements.forEach((stat, index) => {
    const startTime = 1.5 + (index * 0.3);
    timings[stat.id] = { start: startTime, end: startTime + 2 };
  });

  // Body text: 3s - 6s
  const bodyElements = elements.filter(e => e.semanticRole === 'body');
  bodyElements.forEach((body, index) => {
    const startTime = 3 + (index * 0.5);
    timings[body.id] = { start: startTime, end: Math.min(startTime + 2, 7) };
  });

  // CTA elements: 8s - 10s
  const ctaElements = elements.filter(e => e.semanticRole === 'cta');
  for (const cta of ctaElements) {
    timings[cta.id] = { start: 8, end: 10 };
  }

  return timings;
}

export default { generateAutoAnimationPrompt, expandCustomPreferences };
