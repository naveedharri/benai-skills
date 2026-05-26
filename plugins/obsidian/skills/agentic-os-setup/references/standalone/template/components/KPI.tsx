import { ReactNode } from "react";
import { DeltaPill } from "./charts/DeltaPill";

interface Props {
  label: ReactNode;
  value: ReactNode;
  unit?: string;
  delta?: number;
  foot?: ReactNode;
  variant?: "default" | "primary" | "alert";
  spark?: ReactNode;
  dots?: boolean[];   // for streak indicator
}

export function KPI({ label, value, unit, delta, foot, variant, spark, dots }: Props) {
  const cls = `cc-kpi ${variant === "primary" ? "cc-kpi-primary" : variant === "alert" ? "cc-kpi-alert" : ""}`;
  return (
    <div className={cls}>
      <div className="cc-kpi-head">
        <span className="cc-kpi-label">{label}</span>
        {delta != null && <DeltaPill delta={delta} />}
      </div>
      <div className="cc-kpi-value">
        {value}
        {unit && <span className="cc-kpi-unit">{unit}</span>}
      </div>
      {spark && <div className="cc-kpi-spark">{spark}</div>}
      {dots && (
        <div className="cc-kpi-dots">
          {dots.map((on, i) => <span key={i} className={`cc-dot ${on ? "cc-dot-on" : ""}`} />)}
        </div>
      )}
      {foot && <div className="cc-kpi-foot">{foot}</div>}
    </div>
  );
}
