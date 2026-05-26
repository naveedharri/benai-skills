"use client";

import {
  ResponsiveContainer,
  BarChart as RBarChart, Bar,
  LineChart as RLineChart, Line,
  AreaChart as RAreaChart, Area,
  PieChart as RPieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from "recharts";

const INK = "#020309";
const CREAM = "#FAF3E3";
const ACCENT = "#7FBE7C";
const ALERT = "#E07A5F";
const PRIMARY = "#3D5A80";
const PURPLE = "#7B5EA7";

export const PALETTE = [INK, PRIMARY, ACCENT, ALERT, PURPLE, "#E8B04B", "#9B6B3A"];

const tickStyle = { fontSize: 11, fontFamily: "Space Grotesk", fill: INK };
const tooltipStyle = {
  background: CREAM,
  border: `2px solid ${INK}`,
  borderRadius: 0,
  fontSize: 12,
  fontFamily: "Space Grotesk",
  fontWeight: 600,
  padding: "8px 12px",
};

interface BarProps {
  data: { name: string; value: number; fill?: string }[];
  height?: number;
  horizontal?: boolean;
  yLabel?: string;
}
export function RechartsBar({ data, height = 260, horizontal, yLabel }: BarProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RBarChart
        data={data}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={{ top: 10, right: 16, left: horizontal ? 80 : 0, bottom: 10 }}
      >
        <CartesianGrid stroke="rgba(2,3,9,0.08)" vertical={false} />
        {horizontal ? (
          <>
            <XAxis type="number" tick={tickStyle} stroke={INK} />
            <YAxis type="category" dataKey="name" tick={tickStyle} stroke={INK} width={150} />
          </>
        ) : (
          <>
            <XAxis dataKey="name" tick={tickStyle} stroke={INK} interval={0} angle={-20} textAnchor="end" height={50} />
            <YAxis tick={tickStyle} stroke={INK} label={yLabel ? { value: yLabel, angle: -90, position: "insideLeft", style: tickStyle } : undefined} />
          </>
        )}
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(2,3,9,0.06)" }} />
        <ReferenceLine {...(horizontal ? { x: 0 } : { y: 0 })} stroke={INK} />
        <Bar dataKey="value" fill={INK}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.fill ?? (d.value < 0 ? ALERT : INK)} />
          ))}
        </Bar>
      </RBarChart>
    </ResponsiveContainer>
  );
}

interface StackedProps {
  data: { name: string; high: number; normal: number }[];
  height?: number;
}
export function RechartsStackedBar({ data, height = 260 }: StackedProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RBarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 10 }}>
        <CartesianGrid stroke="rgba(2,3,9,0.08)" vertical={false} />
        <XAxis dataKey="name" tick={tickStyle} stroke={INK} />
        <YAxis tick={tickStyle} stroke={INK} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(2,3,9,0.06)" }} />
        <Legend wrapperStyle={{ fontFamily: "Space Grotesk", fontSize: 12, fontWeight: 700 }} />
        <Bar dataKey="high" name="High priority" stackId="a" fill={ALERT} />
        <Bar dataKey="normal" name="Normal" stackId="a" fill={INK} />
      </RBarChart>
    </ResponsiveContainer>
  );
}

interface LineProps {
  data: any[];
  series: { key: string; label: string; color?: string }[];
  height?: number;
  xKey?: string;
}
export function RechartsArea({ data, series, height = 260, xKey = "name" }: LineProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RAreaChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 10 }}>
        <defs>
          {series.map((s, i) => (
            <linearGradient id={`grad-${s.key}`} key={s.key} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color ?? PALETTE[i % PALETTE.length]} stopOpacity={0.55} />
              <stop offset="100%" stopColor={s.color ?? PALETTE[i % PALETTE.length]} stopOpacity={0.05} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid stroke="rgba(2,3,9,0.08)" vertical={false} />
        <XAxis dataKey={xKey} tick={tickStyle} stroke={INK} />
        <YAxis tick={tickStyle} stroke={INK} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontFamily: "Space Grotesk", fontSize: 12, fontWeight: 700 }} />
        {series.map((s, i) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color ?? PALETTE[i % PALETTE.length]}
            strokeWidth={2}
            fill={`url(#grad-${s.key})`}
          />
        ))}
      </RAreaChart>
    </ResponsiveContainer>
  );
}

interface PieProps {
  data: { name: string; value: number }[];
  height?: number;
}
export function RechartsDonut({ data, height = 240 }: PieProps) {
  const total = data.reduce((a, b) => a + b.value, 0);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RPieChart>
        <Tooltip contentStyle={tooltipStyle} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={2}
          stroke={INK}
          strokeWidth={2}
          label={(d: any) => total ? `${Math.round((d.value / total) * 100)}%` : ""}
          labelLine={false}
          style={{ fontFamily: "Space Grotesk", fontSize: 11, fontWeight: 700 }}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
        <Legend wrapperStyle={{ fontFamily: "Space Grotesk", fontSize: 12, fontWeight: 700 }} />
      </RPieChart>
    </ResponsiveContainer>
  );
}
