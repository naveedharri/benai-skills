interface Day { date: string; count: number; }
interface Props { days: Day[]; }

export function Heatmap({ days }: Props) {
  if (!days?.length) return null;
  const max = Math.max(...days.map(d => d.count), 1);
  const cell = 18, gap = 4;
  const cols = Math.ceil(days.length / 7);
  const w = cols * (cell + gap);
  const h = 7 * (cell + gap);

  const intensity = (c: number) => c === 0 ? 0 : Math.min(1, 0.25 + (c / max) * 0.75);

  return (
    <svg className="cc-heatmap" viewBox={`0 0 ${w} ${h}`} width="100%" preserveAspectRatio="xMidYMid meet">
      {days.map((d, i) => {
        const col = Math.floor(i / 7);
        const row = i % 7;
        const op = intensity(d.count);
        return (
          <rect
            key={d.date}
            x={col * (cell + gap)}
            y={row * (cell + gap)}
            width={cell}
            height={cell}
            rx={2}
            fill={op === 0 ? "#FAF3E3" : "#020309"}
            fillOpacity={op === 0 ? 1 : op}
            stroke="#020309"
            strokeWidth={1}
          >
            <title>{d.date}: {d.count}</title>
          </rect>
        );
      })}
    </svg>
  );
}
