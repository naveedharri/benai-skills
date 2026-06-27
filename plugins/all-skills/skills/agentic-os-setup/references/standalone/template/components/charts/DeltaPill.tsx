interface Props { delta: number; suffix?: string; }

export function DeltaPill({ delta, suffix = "%" }: Props) {
  const cls = delta > 0 ? "cc-delta cc-delta-pos" : delta < 0 ? "cc-delta cc-delta-neg" : "cc-delta";
  const arrow = delta > 0 ? "▲" : delta < 0 ? "▼" : "·";
  return <span className={cls}>{arrow} {Math.abs(delta)}{suffix}</span>;
}
