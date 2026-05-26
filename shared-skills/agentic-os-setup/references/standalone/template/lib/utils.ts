// =====================================================================
// Small helpers ported from dashboard.js
// =====================================================================

export function rel(date: string | number | Date, today: Date = new Date()): string {
  const d = new Date(date);
  const ms = today.getTime() - d.getTime();
  const days = Math.floor(ms / 86400_000);
  if (days < 0) return `in ${Math.abs(days)}d`;
  if (days === 0) {
    const hours = Math.floor(ms / 3_600_000);
    if (hours <= 0) return "just now";
    if (hours === 1) return "1h ago";
    return `${hours}h ago`;
  }
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export function shortAgo(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export function fmtBigNumber(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  return n.toLocaleString();
}

export function fmtCost(n: number | null | undefined): string {
  if (n == null) return "—";
  return `$${n.toFixed(2)}`;
}

export function dayLabel(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

export function deltaPct(curr: number, prev: number): number {
  if (!prev) return curr > 0 ? 100 : 0;
  return Math.round(((curr - prev) / prev) * 100);
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function toneFor(value: number, kind: "energy" | "loops" | "wins"): string {
  if (kind === "energy") return value >= 8 ? "primary" : value >= 5 ? "" : "alert";
  if (kind === "loops") return value === 0 ? "primary" : value > 3 ? "alert" : "accent";
  if (kind === "wins") return value > 0 ? "primary" : "";
  return "";
}

export function priorityChip(p: string): { label: string; tone: string } {
  if (p === "p0") return { label: "P0", tone: "alert" };
  if (p === "p1") return { label: "P1", tone: "accent" };
  if (p === "p2") return { label: "P2", tone: "primary" };
  return { label: p || "—", tone: "" };
}
