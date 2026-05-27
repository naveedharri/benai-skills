import { ReactNode } from "react";

interface Props {
  title: string;
  tag?: ReactNode;
  wide?: boolean;
  chart?: boolean;
  focus?: boolean;
  children: ReactNode;
}

export function Card({ title, tag, wide, chart, focus, children }: Props) {
  const classes = [
    "cc-card",
    wide ? "cc-card-wide" : "",
    chart ? "cc-card-chart" : "",
    focus ? "cc-card-focus" : "",
  ].filter(Boolean).join(" ");
  return (
    <div className={classes}>
      <div className="cc-card-head">
        <h3>{title}</h3>
        {tag}
      </div>
      <div className="cc-card-body">{children}</div>
    </div>
  );
}

export function Tag({ children, accent }: { children: ReactNode; accent?: boolean }) {
  return <span className={`cc-tag ${accent ? "cc-tag-accent" : ""}`}>{children}</span>;
}

export function Chip({ children, tone }: { children: ReactNode; tone?: "primary" | "accent" | "alert" | "date" }) {
  const cls = tone === "date" ? "cc-chip-date" :
    `cc-chip ${tone === "primary" ? "cc-chip-primary" : tone === "accent" ? "cc-chip-accent" : tone === "alert" ? "cc-chip-alert" : ""}`;
  return <span className={cls}>{children}</span>;
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="cc-empty">{children}</div>;
}
