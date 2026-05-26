interface Bar { label: string; value: number; }
interface Props { data: Bar[]; height?: number; }

export function BarChart({ data, height = 160 }: Props) {
  if (!data?.length) return null;
  const w = 600, h = height, pad = { l: 20, r: 8, t: 14, b: 24 };
  const max = Math.max(...data.map(d => d.value), 1);
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const bw = innerW / data.length * 0.7;
  const gap = innerW / data.length * 0.3;

  return (
    <svg className="cc-chart" viewBox={`0 0 ${w} ${h}`} width="100%" preserveAspectRatio="none">
      <line x1={pad.l} y1={h - pad.b} x2={w - pad.r} y2={h - pad.b} stroke="#020309" strokeWidth="1.5" />
      {data.map((d, i) => {
        const x = pad.l + i * (bw + gap) + gap / 2;
        const bh = (d.value / max) * innerH;
        const y = h - pad.b - bh;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={bh} fill="#D2ECD0" stroke="#020309" strokeWidth="1.5" rx="2" />
            <text x={x + bw / 2} y={y - 4} textAnchor="middle" style={{ fontFamily: "Space Grotesk", fontSize: 11, fontWeight: 800, fill: "#020309" }}>
              {d.value}
            </text>
            <text x={x + bw / 2} y={h - 6} textAnchor="middle" style={{ fontFamily: "Space Grotesk", fontSize: 10, fontWeight: 600, fill: "#020309", opacity: 0.6 }}>
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
