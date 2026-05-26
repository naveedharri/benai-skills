import { DashboardShell } from "@/components/DashboardShell";
import { getTeamBundle } from "@/lib/data";
import { RefreshAllAction } from "@/components/RefreshAllAction";
import {
  TeamOverview, TeamWorkload, TeamPulse, TeamIntelligence,
  TeamPeople, TeamTasks, TeamDaily, TeamAnalytics, TeamActions,
} from "@/components/views/team";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const data = getTeamBundle();

  return (
    <DashboardShell
      eyebrow="{{ORG_NAME}} Command Center"
      title="Team Dashboard"
      brandLabel="{{ORG_NAME}}"
      brandSub="agentic OS"
      brandInitial="B"
      sections={[
        {
          label: "Team",
          items: [
            { key: "overview",     label: "Overview",     icon: "◎" },
            { key: "analytics",    label: "Analytics",    icon: "≣" },
            { key: "workload",     label: "Workload",     icon: "▣" },
            { key: "pulse",        label: "Pulse",        icon: "❤" },
            { key: "intelligence", label: "Intelligence", icon: "✦" },
            { key: "team",         label: "Team",         icon: "◍" },
            { key: "tasks",        label: "Tasks",        icon: "✓" },
            { key: "daily",        label: "Daily feed",   icon: "☉" },
            { key: "actions",      label: "Actions",      icon: "►" },
          ],
        },
      ]}
      footerItems={[
        { key: "overview", label: "Vault overview", icon: "◈", href: "/overview" },
        { key: "settings", label: "Settings",       icon: "⚙" },
      ]}
      topActions={[
        { label: "Refresh all", node: <RefreshAllAction scope="team" /> },
        { label: "Vault overview", icon: "◈", href: "/overview" },
      ]}
      views={[
        { key: "overview",     label: "Overview",     node:<TeamOverview data={data} /> },
        { key: "workload",     label: "Workload",     node:<TeamWorkload data={data} /> },
        { key: "pulse",        label: "Pulse",        node:<TeamPulse data={data} /> },
        { key: "intelligence", label: "Intelligence", node:<TeamIntelligence data={data} /> },
        { key: "team",         label: "Team",         node:<TeamPeople data={data} /> },
        { key: "tasks",        label: "Tasks",        node:<TeamTasks data={data} /> },
        { key: "daily",        label: "Daily feed",   node:<TeamDaily data={data} /> },
        { key: "analytics",    label: "Analytics",    node:<TeamAnalytics data={data} /> },
        { key: "actions",      label: "Actions",      node:<TeamActions /> },
      ]}
    />
  );
}
