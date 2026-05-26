import { DashboardShell } from "@/components/DashboardShell";
import {
  OverviewOverview, OverviewSkills, OverviewOperator, OverviewAtlas,
} from "@/components/views/overview";

export default function VaultOverviewPage() {
  return (
    <DashboardShell
      eyebrow="{{ORG_NAME}} Command Center"
      title="Vault Overview"
      brandLabel="{{ORG_NAME}}"
      brandSub="system layer"
      brandInitial="◈"
      backHref="/"
      sections={[{
        label: "System",
        items: [
          { key: "overview", label: "Overview", icon: "◎" },
          { key: "skills",   label: "Skills",   icon: "✦" },
          { key: "operator", label: "Operator", icon: "⟳" },
          { key: "atlas",    label: "Atlas",    icon: "◫" },
        ],
      }]}
      topActions={[
        { label: "Run Operator", icon: "▶", variant: "primary" },
      ]}
      views={[
        { key: "overview", label: "Overview", node:<OverviewOverview /> },
        { key: "skills",   label: "Skills",   node:<OverviewSkills /> },
        { key: "operator", label: "Operator", node:<OverviewOperator /> },
        { key: "atlas",    label: "Atlas",    node:<OverviewAtlas /> },
      ]}
    />
  );
}
