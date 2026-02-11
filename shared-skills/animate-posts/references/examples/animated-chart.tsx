/**
 * Animated Bar Chart
 * Following Remotion best practices with staggered spring animations
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

type DataPoint = {
  label: string;
  value: number;
  color?: string;
};

type AnimatedBarChartProps = {
  data: DataPoint[];
  startFrame?: number;
  staggerDelay?: number; // in seconds
  maxValue?: number;
  width?: number;
  height?: number;
};

export const AnimatedBarChart: React.FC<AnimatedBarChartProps> = ({
  data,
  startFrame = 0,
  staggerDelay = 0.3,
  maxValue,
  width = 800,
  height = 400
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const max = maxValue || Math.max(...data.map(d => d.value));
  const barWidth = (width - 100) / data.length;
  const chartHeight = height - 100;

  return (
    <svg width={width} height={height} style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Y-axis */}
      <line
        x1={50}
        y1={50}
        x2={50}
        y2={height - 50}
        stroke="#333"
        strokeWidth={2}
      />

      {/* X-axis */}
      <line
        x1={50}
        y1={height - 50}
        x2={width - 50}
        y2={height - 50}
        stroke="#333"
        strokeWidth={2}
      />

      {/* Y-axis labels */}
      {[0, 0.25, 0.5, 0.75, 1].map((percent, i) => {
        const yPos = height - 50 - (chartHeight * percent);
        const value = Math.round(max * percent);

        return (
          <g key={i}>
            <line
              x1={45}
              y1={yPos}
              x2={50}
              y2={yPos}
              stroke="#333"
              strokeWidth={1}
            />
            <text
              x={40}
              y={yPos + 5}
              textAnchor="end"
              fontSize={12}
              fill="#666"
            >
              {value}
            </text>
          </g>
        );
      })}

      {/* Animated bars */}
      {data.map((item, index) => {
        // Staggered spring animation
        const barHeight = spring({
          frame: frame - startFrame - (index * staggerDelay * fps),
          fps,
          config: {
            damping: 200, // Smooth, no bounce
            stiffness: 100
          },
          from: 0,
          to: (item.value / max) * chartHeight
        });

        const xPos = 70 + (index * barWidth);
        const yPos = height - 50 - barHeight;
        const color = item.color || '#4299E1';

        // Value label animation (appears after bar)
        const labelOpacity = spring({
          frame: frame - startFrame - (index * staggerDelay * fps) - (0.5 * fps),
          fps,
          config: { damping: 200 },
          from: 0,
          to: 1
        });

        return (
          <g key={index}>
            {/* Bar */}
            <rect
              x={xPos}
              y={yPos}
              width={barWidth - 20}
              height={barHeight}
              fill={color}
              rx={4}
            />

            {/* Value label on top of bar */}
            <text
              x={xPos + (barWidth - 20) / 2}
              y={yPos - 10}
              textAnchor="middle"
              fontSize={14}
              fontWeight="bold"
              fill="#333"
              opacity={labelOpacity}
            >
              {item.value}
            </text>

            {/* X-axis label */}
            <text
              x={xPos + (barWidth - 20) / 2}
              y={height - 30}
              textAnchor="middle"
              fontSize={12}
              fill="#666"
            >
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/**
 * Horizontal Bar Chart Variant
 */
export const AnimatedHorizontalBarChart: React.FC<AnimatedBarChartProps> = ({
  data,
  startFrame = 0,
  staggerDelay = 0.3,
  maxValue,
  width = 600,
  height = 400
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const max = maxValue || Math.max(...data.map(d => d.value));
  const barHeight = (height - 100) / data.length;
  const chartWidth = width - 200;

  return (
    <svg width={width} height={height} style={{ fontFamily: 'Arial, sans-serif' }}>
      {data.map((item, index) => {
        // Animated bar width
        const barWidth = spring({
          frame: frame - startFrame - (index * staggerDelay * fps),
          fps,
          config: { damping: 200 },
          from: 0,
          to: (item.value / max) * chartWidth
        });

        const yPos = 50 + (index * barHeight);
        const color = item.color || '#48BB78';

        return (
          <g key={index}>
            {/* Label */}
            <text
              x={140}
              y={yPos + barHeight / 2 + 5}
              textAnchor="end"
              fontSize={14}
              fill="#333"
            >
              {item.label}
            </text>

            {/* Bar */}
            <rect
              x={150}
              y={yPos + 10}
              width={barWidth}
              height={barHeight - 20}
              fill={color}
              rx={4}
            />

            {/* Value label */}
            <text
              x={160 + barWidth}
              y={yPos + barHeight / 2 + 5}
              fontSize={14}
              fontWeight="bold"
              fill="#333"
            >
              {item.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default AnimatedBarChart;
