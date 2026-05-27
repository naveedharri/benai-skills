interface Props {
  data: number[];
  color?: string;
  height?: number;
}

export function Sparkline({ data, color = "#020309", height = 36 }: Props) {
  if (!data?.length) return <svg className="cc-spark" />;
  const w = 200, h = height, pad = 2;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const step = (w - pad * 2) / Math.max(1, data.length - 1);
  const points = data.map((v, i) => {
    const x = pad + i * step;
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const lastX = pad + (data.length - 1) * step;
  const lastY = h - pad - ((data[data.length - 1] - min) / range) * (h - pad * 2);
  return (
    <svg className="cc-spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" width="100%" height={h}>
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
      <circle cx={lastX} cy={lastY} r="3" fill={color} />
    </svg>
  );
}
