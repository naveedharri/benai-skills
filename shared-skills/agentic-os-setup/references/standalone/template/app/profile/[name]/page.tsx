import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/DashboardShell";
import { getProfileBundle } from "@/lib/data";
import type { ProfileName } from "@/lib/types";
import {
  ProfileOverview, ProfileYoutube, ProfileCommunity,
  ProfileMeetings, ProfileTasks, ProfileRuns,
} from "@/components/views/profile";
import { RefreshAllAction } from "@/components/RefreshAllAction";
import { ViewWithRefresh } from "@/components/ViewWithRefresh";
import {
  PrimaryOverview,
  PrimaryComms,
  PrimaryIntelligence,
  PrimaryResearch,
  PrimaryDaily,
} from "@/components/views/profile/primary";

// Reuse the primary-profile Comms/Intelligence/Research/Daily for all profiles
// (they're snapshot-driven and identical in structure)
const ProfileComms = PrimaryComms;
const ProfileIntelligence = PrimaryIntelligence;
const ProfileResearch = PrimaryResearch;
const ProfileDaily = PrimaryDaily;

import { PROFILES } from "@/lib/config";
const VALID_PROFILES: ProfileName[] = [...PROFILES];

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return VALID_PROFILES.map(name => ({ name }));
}

interface Props { params: { name: string }; }

export default function ProfilePage({ params }: Props) {
  const name = params.name as ProfileName;
  if (!VALID_PROFILES.includes(name)) return notFound();
  const data = getProfileBundle(name);
  const avatar = `/avatars/${name}.jpg`;

  // The first profile is the "primary" and uses the synthesis overview;
  // everyone else gets the standard view. Swap by editing PROFILES order.
  const isPrimary = name === PROFILES[0];
  const OverviewComponent = isPrimary ? PrimaryOverview : ProfileOverview;

  return (
    <DashboardShell
      eyebrow={`${name}'s workspace`}
      title={`${name}'s dashboard`}
      brandLabel={name}
      brandSub="profile dashboard"
      brandAvatar={avatar}
      backHref="/"
      sections={[{
        label: "Profile",
        items: [
          { key: "overview",     label: "Overview",     icon: "◎" },
          { key: "youtube",      label: "YouTube",      icon: "▶" },
          { key: "community",    label: "Community",    icon: "◍" },
          { key: "comms",        label: "Comms",        icon: "✉" },
          { key: "meetings",     label: "Meetings",     icon: "◫" },
          { key: "intelligence", label: "Intelligence", icon: "✦" },
          { key: "research",     label: "Research",     icon: "📚" },
          { key: "tasks",        label: "Tasks",        icon: "✓" },
          { key: "daily",        label: "Daily",        icon: "☉" },
          { key: "runs",         label: "Runs",         icon: "►" },
        ],
      }]}
      footerItems={[
        { key: "vault-overview", label: "Vault overview", icon: "◈", href: "/overview" },
      ]}
      topActions={[
        { label: "Refresh all", node: <RefreshAllAction scope="profile" profile={name} /> },
        { label: "Vault overview", icon: "◈", href: "/overview" },
      ]}
      views={[
        { key: "overview",     label: "Overview",     node: <OverviewComponent data={data} /> },
        { key: "youtube",      label: "YouTube",      node: <ViewWithRefresh snapshot="youtube" profile={name} updatedAt={data.youtube?.updated_at}><ProfileYoutube data={data} /></ViewWithRefresh> },
        { key: "community",    label: "Community",    node: <ViewWithRefresh snapshot="community" profile={name} updatedAt={data.community?.updated_at}><ProfileCommunity data={data} /></ViewWithRefresh> },
        { key: "comms",        label: "Comms",        node: <ViewWithRefresh snapshot="comms" profile={name} updatedAt={data.comms?.updated_at}><ProfileComms data={data} /></ViewWithRefresh> },
        { key: "meetings",     label: "Meetings",     node: <ViewWithRefresh snapshot="meetings" profile={name} updatedAt={data.meetings?.updated_at}><ProfileMeetings data={data} /></ViewWithRefresh> },
        { key: "intelligence", label: "Intelligence", node: <ViewWithRefresh snapshot="intelligence" profile={name} updatedAt={data.intelligence?.updated_at}><ProfileIntelligence data={data} /></ViewWithRefresh> },
        { key: "research",     label: "Research",     node: <ViewWithRefresh snapshot="research" profile={name} updatedAt={data.research?.updated_at}><ProfileResearch data={data} /></ViewWithRefresh> },
        { key: "tasks",        label: "Tasks",        node: <ProfileTasks data={data} /> },
        { key: "daily",        label: "Daily",        node: <ProfileDaily data={data} /> },
        { key: "runs",         label: "Runs",         node: <ProfileRuns data={data} /> },
      ]}
    />
  );
}
