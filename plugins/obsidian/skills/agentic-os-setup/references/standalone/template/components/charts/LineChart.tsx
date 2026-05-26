interface Props {
  values: number[];
  labels?: string[];
  height?: number;
  color?: string;
}

export function LineChart({ values, labels, height = 160, color = "#020309" }: Props) {
  if (!values?.length) return null;
  const w = 600, h = height, pad = { l: 24, r: 12, t: 14, b: 24 };
  const max = Math.max(...values, 1);
  const min = Math.min(0, ...values);
  const range = max - min || 1;
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const step = innerW / Math.max(1, values.length - 1);

  const pts = values.map((v, i) => {
    const x = pad.l + i * step;
    const y = pad.t + innerH - ((v - min) / range) * innerH;
    return [x, y] as const;
  });
  const path = pts.map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)).join(" ");

  return (
    <svg className="cc-chart" viewBox={`0 0 ${w} ${h}`} width="100%" preserveAspectRatio="none">
      <line x1={pad.l} y1={h - pad.b} x2={w - pad.r} y2={h - pad.b} stroke="#020309" strokeWidth="1.5" />
      <path d={path} stroke={color} strokeWidth="2.5" fill="none" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill="#FFFFFF" stroke={color} strokeWidth="2" />
      ))}
      {labels && labels.map((l, i) => (
        <text
          key={i}
          x={pad.l + i * step}
          y={h - 6}
          textAnchor="middle"
          style={{ fontFamily: "Space Grotesk", fontSize: 10, fontWeight: 600, fill: "#020309", opacity: 0.6 }}
        >{l}</text>
      ))}
    </svg>
  );
}
