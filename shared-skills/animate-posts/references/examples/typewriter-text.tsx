/**
 * Typewriter Text Animation
 * Character-by-character text reveal following Remotion best practices
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';

type TypewriterProps = {
  text: string;
  startFrame?: number;
  charactersPerSecond?: number;
  showCursor?: boolean;
};

export const TypewriterText: React.FC<TypewriterProps> = ({
  text,
  startFrame = 0,
  charactersPerSecond = 6,
  showCursor = true
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate how many characters to show
  const framesPerCharacter = fps / charactersPerSecond;
  const totalFrames = text.length * framesPerCharacter;

  const charsToShow = Math.floor(
    interpolate(
      frame - startFrame,
      [0, totalFrames],
      [0, text.length],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.linear
      }
    )
  );

  // Blinking cursor animation
  const cursorOpacity = showCursor
    ? interpolate(
        frame % 30, // Blink every 30 frames
        [0, 15, 30],
        [1, 0, 1],
        { extrapolateRight: 'clamp' }
      )
    : 0;

  const isComplete = charsToShow >= text.length;
  const displayedText = text.slice(0, charsToShow);

  return (
    <div style={{ fontFamily: 'monospace', fontSize: 24 }}>
      {displayedText}
      {showCursor && !isComplete && (
        <span style={{ opacity: cursorOpacity }}>|</span>
      )}
    </div>
  );
};

/**
 * Typewriter with Pause
 * Pauses typing after specific text
 */
export const TypewriterWithPause: React.FC<{
  text: string;
  pauseAfter?: string;
  pauseDuration?: number; // in seconds
}> = ({
  text,
  pauseAfter,
  pauseDuration = 1
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pauseIndex = pauseAfter ? text.indexOf(pauseAfter) + pauseAfter.length : -1;
  const pauseFrames = pauseDuration * fps;

  let adjustedFrame = frame;

  if (pauseIndex > -1) {
    const framesAtPause = pauseIndex * 5; // Assuming 6 chars/sec
    if (frame > framesAtPause) {
      adjustedFrame = frame - pauseFrames;
    }
  }

  const charsToShow = Math.floor(interpolate(
    adjustedFrame,
    [0, text.length * 5],
    [0, text.length],
    { extrapolateRight: 'clamp' }
  ));

  return (
    <div style={{ fontFamily: 'monospace', fontSize: 24 }}>
      {text.slice(0, charsToShow)}
    </div>
  );
};

export default TypewriterText;
