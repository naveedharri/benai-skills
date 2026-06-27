interface Props {
  pct: number;          // 0..100
  size?: number;
  color?: string;
  label?: string;
}

export function Ring({ pct, size = 70, color = "#020309", label }: Props) {
  const r = size / 2 - 6;
  const c = 2 * Math.PI * r;
  const fill = c * (1 - Math.max(0, Math.min(100, pct)) / 100);
  return (
    <svg className="cc-ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2} cy={size / 2} r={r}
        stroke="rgba(2,3,9,0.12)" strokeWidth="6" fill="none"
      />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        stroke={color} strokeWidth="6" fill="none"
        strokeDasharray={c}
        strokeDashoffset={fill}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%" y="52%"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 800, fontSize: 14, fill: "#020309" }}
      >
        {Math.round(pct)}%
      </text>
      {label && (
        <text
          x="50%" y="86%"
          textAnchor="middle"
          style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, fontSize: 9, fill: "#020309", opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.1em" }}
        >
          {label}
        </text>
      )}
    </svg>
  );
}
