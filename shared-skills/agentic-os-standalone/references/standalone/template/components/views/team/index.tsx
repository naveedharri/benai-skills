"use client";

import Link from "next/link";
import type { TeamBundle } from "@/lib/types";
import { Card, Chip, Empty, Tag } from "@/components/Card";
import { KPI } from "@/components/KPI";
import { Sparkline } from "@/components/charts/Sparkline";
import { Heatmap } from "@/components/charts/Heatmap";
import { BarChart } from "@/components/charts/BarChart";
import { LineChart } from "@/components/charts/LineChart";
import { DeltaPill } from "@/components/charts/DeltaPill";
import { RechartsBar, RechartsArea, RechartsDonut, RechartsStackedBar, PALETTE } from "@/components/charts/Recharts";
import { deltaPct, dayLabel, fmtBigNumber, fmtCost, rel, toneFor } from "@/lib/utils";

// =====================================================================
// OVERVIEW
// =====================================================================
export function TeamOverview({ data }: { data: TeamBundle }) {
  // --- Real snapshots
  const yt = data.youtube;
  const community = data.community;
  const comms = data.comms;
  const meetings = data.meetings;
  const intel = data.intelligence;

  const ch = yt?.channel ?? {};
  const subsDelta = ch.subscribers_delta_7d ?? null;
  const viewsDelta = ch.views_delta_7d ?? null;

  const commsTotals = comms?.totals ?? {};
  const inboxTotal =
    (commsTotals.linkedin_dms ?? 0) +
    (commsTotals.youtube_comments ?? 0) +
    (commsTotals.emails_unread ?? 0) +
    (commsTotals.circle_dms ?? 0);

  // Community themes
  const communityThemes = (community?.themes ?? [])
    .map((t: any) => ({ name: t.name, value: t.frequency_4w ?? 0 }))
    .sort((a: any, b: any) => b.value - a.value)
    .slice(0, 6);

  // Top pain points
  const painPoints = (community?.pain_points ?? [])
    .map((p: any) => ({
      name: p.name,
      value: p.frequency ?? 0,
      fill:
        p.severity === "high" ? PALETTE[3] :
        p.severity === "med" ? PALETTE[5] : PALETTE[1],
    }))
    .sort((a: any, b: any) => b.value - a.value)
    .slice(0, 6);

  // Power users
  const powerUsers = (community?.power_users ?? [])
    .map((u: any) => ({ name: u.name, value: u.contribution_count_4w ?? 0 }))
    .sort((a: any, b: any) => b.value - a.value)
    .slice(0, 8);

  // Cross-validated intelligence themes (compact)
  const crossThemes = (intel?.cross_validated_themes ?? [])
    .map((t: any) => ({
      name: t.theme,
      value: t.combined_mention_count ?? 0,
      fill:
        t.priority === "p0" ? PALETTE[3] :
        t.priority === "p1" ? PALETTE[5] : PALETTE[1],
    }))
    .slice(0, 6);

  // Opportunity briefs
  const opps = intel?.opportunity_briefs ?? [];
  const churn = intel?.churn_signals ?? [];

  return (
    <>
      <CCUsageStrip data={data} />

      {/* HEADLINE KPIs — drawn from real snapshots */}
      <div className="cc-kpis">
        <KPI variant="primary" label="YouTube subs"
             value={ch.subscribers ?? "—"}
             delta={subsDelta != null && ch.subscribers ? (subsDelta / ch.subscribers) * 100 : undefined}
             foot={subsDelta != null ? `+${subsDelta.toLocaleString()} past 7d` : "from snapshot"} />
        <KPI label="Total views"
             value={ch.total_views ?? "—"}
             delta={viewsDelta != null && ch.total_views ? (viewsDelta / ch.total_views) * 100 : undefined}
             foot={viewsDelta != null ? `+${viewsDelta.toLocaleString()} past 7d` : ""} />
        <KPI label="Community"
             value={community?.stats?.total_members ?? "—"}
             foot={`${community?.stats?.active_today ?? 0} active today · ${community?.stats?.posts_today ?? 0} posts`} />
        <KPI label="Meetings (7d)"
             value={meetings?.rollup?.meetings_count_7d ?? "—"}
             foot={`${meetings?.rollup?.total_hours_7d ?? 0}h logged`} />
        <KPI variant={inboxTotal ? "primary" : "default"} label="Inbox load"
             value={inboxTotal} foot="LinkedIn + YT + Email + Circle" />
      </div>

      {/* COMMUNITY SIGNALS — two charts side by side */}
      <div className="cc-grid cc-grid-2">
        <Card chart title="Rising community themes (4w)" tag={<Tag>{communityThemes.length}</Tag>}>
          {communityThemes.length ? <RechartsBar data={communityThemes} horizontal height={280} />
            : <Empty>No themes in snapshot.</Empty>}
        </Card>

        <Card chart title="Top pain points" tag={<Tag>red = high severity</Tag>}>
          {painPoints.length ? <RechartsBar data={painPoints} horizontal height={280} />
            : <Empty>No pain points captured.</Empty>}
        </Card>
      </div>

      {/* CROSS-SOURCE INTELLIGENCE + POWER USERS */}
      <div className="cc-grid cc-grid-2">
        <Card chart title="Cross-source signals (intelligence)" tag={<Tag>p0 red · p1 amber · p2 blue</Tag>}>
          {crossThemes.length ? <RechartsBar data={crossThemes} horizontal height={Math.max(220, crossThemes.length * 38)} />
            : <Empty>No cross-validated themes.</Empty>}
        </Card>

        <Card chart title="Power users (4w contributions)" tag={<Tag>{powerUsers.length}</Tag>}>
          {powerUsers.length ? <RechartsBar data={powerUsers} horizontal height={Math.max(220, powerUsers.length * 32)} />
            : <Empty>No power users.</Empty>}
        </Card>
      </div>

      {/* OPPORTUNITY + CHURN SUMMARY */}
      <div className="cc-grid cc-grid-2">
        <Card title="Opportunity briefs" tag={<Tag>{opps.length}</Tag>}>
          {opps.length ? (
            <ul className="cc-md-list">
              {opps.slice(0, 4).map((o: any, i: number) => (
                <li key={i}><strong>{o.title}</strong><br />
                  <span className="cc-muted" style={{ fontSize: 12 }}>{(o.summary || "").slice(0, 140)}…</span>
                </li>
              ))}
            </ul>
          ) : <Empty>No briefs.</Empty>}
        </Card>

        <Card title="Churn signals" tag={<Tag>{churn.length}</Tag>}>
          {churn.length ? (
            <ul className="cc-md-list">
              {churn.slice(0, 5).map((c: any, i: number) => (
                <li key={i}><strong>{c.name || c.signal}</strong>
                  {c.days_stuck != null && <Chip tone="alert">{c.days_stuck}d stuck</Chip>}<br />
                  <span className="cc-muted" style={{ fontSize: 12 }}>{(c.recommended_outreach || c.signal || "").slice(0, 140)}…</span>
                </li>
              ))}
            </ul>
          ) : <Empty>No churn signals.</Empty>}
        </Card>
      </div>
    </>
  );
}

// =====================================================================
// WORKLOAD — capacity, energy, task load, blockers per person
// =====================================================================
export function TeamWorkload({ data }: { data: TeamBundle }) {
  const today = new Date("2026-05-25");

  // --- Tasks grouped by owner
  const tasksByOwner: Record<string, { high: number; normal: number; overdue: number; total: number; items: any[] }> = {};
  data.profiles.forEach(p => { tasksByOwner[p.name] = { high: 0, normal: 0, overdue: 0, total: 0, items: [] }; });
  data.tasks.forEach(t => {
    const owner = t.profile as string;
    if (!owner || !tasksByOwner[owner]) return;
    const isHigh = t.priority === "high";
    const isOverdue = t.due ? new Date(t.due) < today : false;
    tasksByOwner[owner].total += 1;
    if (isHigh) tasksByOwner[owner].high += 1;
    else tasksByOwner[owner].normal += 1;
    if (isOverdue) tasksByOwner[owner].overdue += 1;
    tasksByOwner[owner].items.push({ ...t, overdue: isOverdue });
  });

  const taskLoadData = data.profiles.map(p => ({
    name: p.name,
    high: tasksByOwner[p.name].high,
    normal: tasksByOwner[p.name].normal,
  }));

  // --- Aggregate KPIs
  const totalOpenTasks = data.tasks.length;
  const totalOverdue = Object.values(tasksByOwner).reduce((a, b) => a + b.overdue, 0);
  const totalLoops = data.profiles.reduce((a, b) => a + (b.loops ?? 0), 0);
  const totalWins = data.profiles.reduce((a, b) => a + (b.wins ?? 0), 0);
  const energies = data.profiles.map(p => p.energy ?? 0).filter(e => e > 0);
  const avgEnergy = energies.length ? (energies.reduce((a, b) => a + b, 0) / energies.length).toFixed(1) : "—";

  // --- Capacity score per person — combine touches + tasks + loops
  // Higher = busier. Color-code overload (>1 std dev above mean).
  const capacityRaw = data.profiles.map(p => ({
    name: p.name,
    score: p.weekTouched + tasksByOwner[p.name].total * 2 + (p.loops ?? 0) * 3,
  }));
  const meanCap = capacityRaw.reduce((a, b) => a + b.score, 0) / Math.max(capacityRaw.length, 1);
  const capacityData = capacityRaw.map(c => ({
    name: c.name,
    value: c.score,
    fill: c.score > meanCap * 1.3 ? PALETTE[3] : c.score < meanCap * 0.7 ? PALETTE[2] : PALETTE[1],
  }));

  // --- Energy + loops side-by-side
  const energyData = data.profiles.map(p => ({
    name: p.name,
    value: p.energy ?? 0,
    fill: (p.energy ?? 0) >= 8 ? PALETTE[2] : (p.energy ?? 0) >= 6 ? PALETTE[1] : PALETTE[3],
  }));
  const loopsData = data.profiles.map(p => ({
    name: p.name,
    value: p.loops ?? 0,
    fill: (p.loops ?? 0) > 3 ? PALETTE[3] : (p.loops ?? 0) > 1 ? PALETTE[5] : PALETTE[1],
  }));

  // --- Overdue list flattened
  const overdueList = Object.entries(tasksByOwner)
    .flatMap(([owner, info]) => info.items.filter((t: any) => t.overdue).map((t: any) => ({ ...t, profile: owner })))
    .sort((a: any, b: any) => (a.due || "").localeCompare(b.due || ""));

  return (
    <>
      {/* KPI STRIP */}
      <div className="cc-kpis">
        <KPI variant="primary" label="Open tasks" value={totalOpenTasks} foot={`${totalOverdue} overdue`} />
        <KPI variant={totalOverdue ? "alert" : "default"} label="Overdue" value={totalOverdue} foot="past due today" />
        <KPI label="Open loops" value={totalLoops} foot="across team" />
        <KPI variant="primary" label="Wins today" value={totalWins} foot="from team dailies" />
        <KPI label="Avg energy" value={avgEnergy} unit="/10" foot={`across ${energies.length} profiles`} />
      </div>

      {/* CAPACITY DISTRIBUTION */}
      <Card wide chart title="Capacity load (touches + tasks + loops)" tag={<Tag>red = overloaded · green = underloaded</Tag>}>
        <RechartsBar data={capacityData} horizontal height={Math.max(200, data.profiles.length * 44)} />
      </Card>

      {/* TASK LOAD STACKED + ENERGY */}
      <div className="cc-grid cc-grid-2">
        <Card chart title="Task load by owner" tag={<Tag>high-priority highlighted</Tag>}>
          <RechartsStackedBar data={taskLoadData} height={260} />
        </Card>

        <Card chart title="Energy levels" tag={<Tag>green ≥ 8 · amber 6-7 · red &lt; 6</Tag>}>
          <RechartsBar data={energyData} height={260} />
        </Card>
      </div>

      {/* LOOPS + OVERDUE */}
      <div className="cc-grid cc-grid-2">
        <Card chart title="Open loops per person" tag={<Tag>red &gt; 3 · amber 2-3</Tag>}>
          <RechartsBar data={loopsData} height={260} />
        </Card>

        <Card title="Overdue tasks" tag={<Tag>{overdueList.length}</Tag>}>
          {overdueList.length ? (
            <table className="cc-table">
              <thead><tr><th>Owner</th><th>Due</th><th>Task</th></tr></thead>
              <tbody>
                {overdueList.slice(0, 8).map((t: any, i: number) => (
                  <tr key={i}>
                    <td>{t.profile}</td>
                    <td><Chip tone="alert">{t.due}</Chip></td>
                    <td>{t.text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <Empty>Nothing overdue.</Empty>}
        </Card>
      </div>

      {/* PER-PERSON FOCUS CARDS */}
      <Card wide title="Current focus + signals" tag={<Tag>{data.profiles.length} people</Tag>}>
        <div className="cc-grid cc-grid-2">
          {data.profiles.map(p => {
            const tasks = tasksByOwner[p.name];
            const capScore = capacityRaw.find(c => c.name === p.name)?.score ?? 0;
            const overloaded = capScore > meanCap * 1.3;
            return (
              <div key={p.name} style={{ borderLeft: `3px solid ${overloaded ? PALETTE[3] : PALETTE[1]}`, padding: "10px 14px", background: overloaded ? "rgba(224,122,95,0.06)" : "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <strong style={{ fontFamily: "Space Grotesk", fontSize: 14 }}>{p.name}</strong>
                  {overloaded && <Chip tone="alert">overloaded</Chip>}
                </div>
                <div style={{ fontSize: 13, marginBottom: 8 }}>{p.focus || <span className="cc-muted">no focus set</span>}</div>
                <div className="cc-person-chips">
                  {p.energy != null && <Chip tone={toneFor(p.energy, "energy") as any}>⚡ {p.energy}/10</Chip>}
                  {p.wins != null && p.wins > 0 && <Chip tone="primary">🏆 {p.wins}</Chip>}
                  {p.loops != null && p.loops > 0 && <Chip tone={p.loops > 3 ? "alert" : "accent"}>🔁 {p.loops}</Chip>}
                  <Chip>{p.weekTouched} touches</Chip>
                  <Chip tone={tasks.high > 0 ? "alert" : undefined as any}>{tasks.total} tasks{tasks.high ? ` (${tasks.high} high)` : ""}</Chip>
                  {tasks.overdue > 0 && <Chip tone="alert">{tasks.overdue} overdue</Chip>}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}


// =====================================================================
// PULSE — real-time signal from Circle, YouTube, Comms, Meetings
// =====================================================================
export function TeamPulse({ data }: { data: TeamBundle }) {
  const community = data.community ?? {};
  const yt = data.youtube ?? {};
  const comms = data.comms ?? {};
  const meetings = data.meetings ?? {};

  const posts: any[] = community.recent_posts ?? [];
  const communityComments: any[] = community.recent_comments ?? [];
  const ytComments: any[] = yt.recent_comments ?? [];
  const recentMeetings: any[] = meetings.recent ?? [];
  const commsItems: any[] = [...(comms.urgent ?? []), ...(comms.needs_reply ?? []), ...(comms.fyi ?? [])];

  // ---- Group activity by date (last 7 days)
  const today = new Date();
  const dayKeys: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today); d.setDate(today.getDate() - i);
    dayKeys.push(d.toISOString().slice(0, 10));
  }
  const byDay: Record<string, { posts: number; circleComments: number; ytComments: number; meetings: number }> = {};
  dayKeys.forEach(k => { byDay[k] = { posts: 0, circleComments: 0, ytComments: 0, meetings: 0 }; });

  const bucket = (iso: string | undefined) => {
    if (!iso) return null;
    const key = iso.slice(0, 10);
    return byDay[key] ? key : null;
  };
  posts.forEach(p => { const k = bucket(p.posted_at); if (k) byDay[k].posts += 1; });
  communityComments.forEach(c => { const k = bucket(c.posted_at); if (k) byDay[k].circleComments += 1; });
  ytComments.forEach(c => { const k = bucket(c.published_at); if (k) byDay[k].ytComments += 1; });
  recentMeetings.forEach(m => { const k = bucket(m.date_iso); if (k) byDay[k].meetings += 1; });

  const timeline = dayKeys.map(k => ({
    name: k.slice(5),
    "Circle posts":    byDay[k].posts,
    "Circle comments": byDay[k].circleComments,
    "YouTube comments": byDay[k].ytComments,
    "Meetings":        byDay[k].meetings,
  }));

  // ---- Engagement bar — top posts by likes+comments
  const topByEngagement = posts
    .map(p => ({
      name: (p.title || "").length > 32 ? p.title.slice(0, 30) + "…" : p.title,
      likes: p.likes ?? 0,
      comments: p.comments ?? 0,
    }))
    .sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments))
    .slice(0, 6);

  // ---- Author leaderboard (circle posts + comments + yt comments)
  const authorCounts: Record<string, number> = {};
  posts.forEach(p => { if (p.author) authorCounts[p.author] = (authorCounts[p.author] ?? 0) + 1; });
  communityComments.forEach(c => { if (c.author) authorCounts[c.author] = (authorCounts[c.author] ?? 0) + 1; });
  const topAuthors = Object.entries(authorCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // ---- KPI totals
  const totalActivity = posts.length + communityComments.length + ytComments.length + recentMeetings.length;

  return (
    <>
      <div className="cc-kpis">
        <KPI variant="primary" label="Circle posts" value={posts.length} foot="recent snapshot" />
        <KPI label="Circle comments" value={communityComments.length} foot="recent snapshot" />
        <KPI label="YouTube comments" value={ytComments.length} foot="recent snapshot" />
        <KPI label="Meetings" value={recentMeetings.length} foot={`${meetings.rollup?.total_hours_7d ?? 0}h logged`} />
        <KPI label="Comms inbox" value={commsItems.length} foot="urgent + needs reply + fyi" />
      </div>

      {/* Activity timeline */}
      <Card wide chart title="7-day activity pulse" tag={<Tag>{totalActivity} events</Tag>}>
        <RechartsArea
          data={timeline}
          series={[
            { key: "Circle posts",     label: "Circle posts",     color: PALETTE[1] },
            { key: "Circle comments",  label: "Circle comments",  color: PALETTE[2] },
            { key: "YouTube comments", label: "YouTube comments", color: PALETTE[5] },
            { key: "Meetings",         label: "Meetings",         color: PALETTE[3] },
          ]}
          height={300}
        />
      </Card>

      <div className="cc-grid cc-grid-2">
        <Card chart title="Top posts by engagement" tag={<Tag>likes + comments</Tag>}>
          {topByEngagement.length ? (
            <RechartsArea
              data={topByEngagement}
              series={[
                { key: "likes",    label: "Likes",    color: PALETTE[1] },
                { key: "comments", label: "Comments", color: PALETTE[2] },
              ]}
              height={280}
            />
          ) : <Empty>No posts in snapshot.</Empty>}
        </Card>

        <Card chart title="Most active authors" tag={<Tag>{topAuthors.length}</Tag>}>
          {topAuthors.length ? <RechartsBar data={topAuthors} horizontal height={Math.max(220, topAuthors.length * 32)} />
            : <Empty>No author activity.</Empty>}
        </Card>
      </div>

      {/* Recent activity stream */}
      <Card wide title="Recent activity stream" tag={<Tag>chronological · all sources</Tag>}>
        <table className="cc-table">
          <thead><tr><th>When</th><th>Source</th><th>Author</th><th>Snippet</th></tr></thead>
          <tbody>
            {[
              ...posts.map(p => ({ when: p.posted_at, source: "Circle post", author: p.author, snippet: p.title, url: p.url })),
              ...communityComments.map(c => ({ when: c.posted_at, source: "Circle comment", author: c.author, snippet: c.snippet, url: c.url })),
              ...ytComments.map(c => ({ when: c.published_at, source: "YouTube comment", author: c.author, snippet: c.text, url: c.video_url })),
              ...recentMeetings.map(m => ({ when: m.date_iso, source: "Meeting", author: (m.attendees ?? []).slice(0, 2).join(", "), snippet: m.title, url: m.url })),
            ]
              .filter(x => x.when)
              .sort((a, b) => b.when.localeCompare(a.when))
              .slice(0, 14)
              .map((row, i) => (
                <tr key={i}>
                  <td style={{ whiteSpace: "nowrap", fontSize: 12 }}>{row.when.slice(5, 16).replace("T", " ")}</td>
                  <td><Chip>{row.source}</Chip></td>
                  <td style={{ fontSize: 12 }}>{row.author}</td>
                  <td style={{ fontSize: 12 }}>
                    {row.url ? <a className="cc-link" href={row.url} target="_blank" rel="noreferrer">{(row.snippet || "").slice(0, 100)}</a> : (row.snippet || "").slice(0, 100)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

// =====================================================================
// INTELLIGENCE — synthesized from intel + meetings + community snapshots
// =====================================================================
export function TeamIntelligence({ data }: { data: TeamBundle }) {
  const intel = data.intelligence ?? {};
  const meetings = data.meetings ?? {};
  const community = data.community ?? {};

  const themes = intel.cross_validated_themes ?? [];
  const opps = intel.opportunity_briefs ?? [];
  const churn = intel.churn_signals ?? [];
  const decisionsToDoc = intel.decisions_to_document ?? [];
  const contentOpps = intel.content_opportunities ?? [];
  const actions = intel.unified_action_items ?? [];
  const meetingDecisions = meetings.decisions ?? [];
  const meetingActions = meetings.action_items ?? [];
  const painPoints = community.pain_points ?? [];

  // --- Priority distribution chart
  const priorityCounts: Record<string, number> = { p0: 0, p1: 0, p2: 0 };
  themes.forEach((t: any) => { const p = (t.priority || "p2").toLowerCase(); priorityCounts[p] = (priorityCounts[p] ?? 0) + 1; });
  const priorityChart = [
    { name: "P0 critical", value: priorityCounts.p0, fill: PALETTE[3] },
    { name: "P1 high",     value: priorityCounts.p1, fill: PALETTE[5] },
    { name: "P2 normal",   value: priorityCounts.p2, fill: PALETTE[1] },
  ].filter(x => x.value > 0);

  // --- Themes by mention count
  const themeChart = themes
    .map((t: any) => ({
      name: t.theme,
      value: t.combined_mention_count ?? 0,
      fill: t.priority === "p0" ? PALETTE[3] : t.priority === "p1" ? PALETTE[5] : PALETTE[1],
    }))
    .sort((a: any, b: any) => b.value - a.value)
    .slice(0, 8);

  // --- Source breakdown — how many themes come from each source
  const sourceCounts: Record<string, number> = {};
  themes.forEach((t: any) => {
    (t.sources ?? []).forEach((s: string) => { sourceCounts[s] = (sourceCounts[s] ?? 0) + 1; });
  });
  const sourceChart = Object.entries(sourceCounts).map(([name, value]) => ({ name, value }));

  // --- High-urgency actions
  const urgentActions = actions.filter((a: any) => (a.urgency || "").toLowerCase() === "high");

  // --- Owner mention from action items
  const ownerCounts: Record<string, number> = {};
  meetingActions.forEach((a: any) => {
    if (a.owner) ownerCounts[a.owner] = (ownerCounts[a.owner] ?? 0) + 1;
  });
  const ownerChart = Object.entries(ownerCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // --- High-severity churn
  const churnHigh = churn.filter((c: any) => (c.days_stuck ?? 0) >= 3);

  // --- Decisions not yet documented
  const undocDecisions = meetingDecisions.filter((d: any) => d.documented === false);

  return (
    <>
      {/* KPI strip */}
      <div className="cc-kpis">
        <KPI variant="alert" label="P0 themes" value={priorityCounts.p0 ?? 0} foot="cross-validated critical" />
        <KPI variant="primary" label="Themes" value={themes.length} foot="cross-validated total" />
        <KPI label="Opportunities" value={opps.length} foot="briefs ready" />
        <KPI label="Action items" value={actions.length} foot={`${urgentActions.length} high-urgency`} />
        <KPI variant={churnHigh.length ? "alert" : "default"} label="Churn risks" value={churn.length} foot={`${churnHigh.length} stuck 3d+`} />
        <KPI label="Decisions to doc" value={undocDecisions.length || decisionsToDoc.length} foot="not yet written up" />
      </div>

      {/* THEMES CHART */}
      <Card wide chart
            title="Cross-validated themes by mention count"
            tag={<Tag>p0 red · p1 amber · p2 blue · synthesized from {Object.keys(sourceCounts).length} sources</Tag>}>
        {themeChart.length ? <RechartsBar data={themeChart} horizontal height={Math.max(260, themeChart.length * 42)} />
          : <Empty>No cross-validated themes in intelligence snapshot.</Empty>}
      </Card>

      <div className="cc-grid cc-grid-2">
        <Card chart title="Theme priority mix" tag={<Tag>{themes.length} themes</Tag>}>
          {priorityChart.length ? <RechartsDonut data={priorityChart} height={260} />
            : <Empty>No themes.</Empty>}
        </Card>

        <Card chart title="Signal sources" tag={<Tag>{Object.keys(sourceCounts).length}</Tag>}>
          {sourceChart.length ? <RechartsBar data={sourceChart} horizontal height={260} />
            : <Empty>No source attribution.</Empty>}
        </Card>
      </div>

      {/* TOP THEMES NARRATIVE */}
      <Card wide title="Top P0/P1 themes — what to act on" tag={<Tag>{themes.filter((t: any) => t.priority !== "p2").length}</Tag>}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
          {themes
            .filter((t: any) => t.priority !== "p2")
            .slice(0, 6)
            .map((t: any, i: number) => (
              <div key={i} style={{
                borderLeft: `3px solid ${t.priority === "p0" ? PALETTE[3] : PALETTE[5]}`,
                padding: "10px 14px",
                background: t.priority === "p0" ? "rgba(224,122,95,0.06)" : "#fff",
              }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                  <Chip tone={t.priority === "p0" ? "alert" : "primary"}>{(t.priority || "").toUpperCase()}</Chip>
                  <span style={{ fontSize: 11, opacity: 0.6, fontFamily: "Space Grotesk", fontWeight: 700 }}>
                    {t.combined_mention_count} mentions · {(t.sources ?? []).length} sources
                  </span>
                </div>
                <strong style={{ display: "block", marginBottom: 4, fontFamily: "Space Grotesk", fontSize: 14 }}>{t.theme}</strong>
                <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.45 }}>{t.why}</p>
                {(t.sources ?? []).length > 0 && (
                  <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {(t.sources ?? []).map((s: string, j: number) => <Chip key={j}>{s}</Chip>)}
                  </div>
                )}
              </div>
            ))}
        </div>
      </Card>

      {/* OPPORTUNITY BRIEFS */}
      <Card wide title="Opportunity briefs" tag={<Tag>{opps.length}</Tag>}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
          {opps.map((o: any, i: number) => (
            <div key={i} style={{ borderLeft: `3px solid ${PALETTE[1]}`, padding: "10px 14px", background: "#fff" }}>
              <strong style={{ display: "block", marginBottom: 6, fontFamily: "Space Grotesk", fontSize: 14 }}>{o.title}</strong>
              <p style={{ margin: "0 0 8px", fontSize: 12.5, lineHeight: 1.45 }}>{o.summary}</p>
              {o.recommended_next_action && (
                <div style={{ fontSize: 12, padding: "6px 10px", background: CREAM_BG, borderLeft: `2px solid ${PALETTE[2]}` }}>
                  <strong>Next:</strong> {o.recommended_next_action}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* OWNERS + ACTIONS */}
      <div className="cc-grid cc-grid-2">
        <Card chart title="Action items by owner" tag={<Tag>{meetingActions.length} total</Tag>}>
          {ownerChart.length ? <RechartsBar data={ownerChart} horizontal height={Math.max(220, ownerChart.length * 38)} />
            : <Empty>No owner attribution.</Empty>}
        </Card>

        <Card title="High-urgency actions" tag={<Tag>{urgentActions.length}</Tag>}>
          {urgentActions.length ? (
            <ul className="cc-md-list">
              {urgentActions.slice(0, 6).map((a: any, i: number) => (
                <li key={i}>
                  <strong style={{ fontSize: 13 }}>{a.text}</strong>
                  <div style={{ fontSize: 11, opacity: 0.65, marginTop: 2 }}>
                    {a.source}{a.due_iso ? ` · due ${a.due_iso.slice(0, 10)}` : ""}
                  </div>
                </li>
              ))}
            </ul>
          ) : <Empty>No high-urgency items.</Empty>}
        </Card>
      </div>

      {/* CHURN + DECISIONS */}
      <div className="cc-grid cc-grid-2">
        <Card title="Churn risk watchlist" tag={<Tag>{churn.length}</Tag>}>
          {churn.length ? (
            <ul className="cc-md-list">
              {churn.slice(0, 6).map((c: any, i: number) => (
                <li key={i}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <strong>{c.name || c.member}</strong>
                    {c.days_stuck != null && <Chip tone="alert">{c.days_stuck}d stuck</Chip>}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.75, marginTop: 3 }}>{(c.recommended_outreach || c.signal || "").slice(0, 180)}</div>
                </li>
              ))}
            </ul>
          ) : <Empty>No churn signals.</Empty>}
        </Card>

        <Card title="Decisions to document" tag={<Tag>{undocDecisions.length || decisionsToDoc.length}</Tag>}>
          {(undocDecisions.length ? undocDecisions : decisionsToDoc).length ? (
            <ul className="cc-md-list">
              {(undocDecisions.length ? undocDecisions : decisionsToDoc).slice(0, 6).map((d: any, i: number) => (
                <li key={i}>
                  <strong style={{ fontSize: 13 }}>{d.decision || d.title}</strong>
                  <div style={{ fontSize: 12, opacity: 0.7, marginTop: 3 }}>{d.context}</div>
                  {d.date_iso && <div style={{ fontSize: 11, opacity: 0.55, marginTop: 2 }}>{d.date_iso.slice(0, 10)}</div>}
                </li>
              ))}
            </ul>
          ) : <Empty>All decisions documented.</Empty>}
        </Card>
      </div>

      {/* CONTENT OPPORTUNITIES */}
      <Card wide title="Content opportunities from signals" tag={<Tag>{contentOpps.length}</Tag>}>
        {contentOpps.length ? (
          <table className="cc-table">
            <thead><tr><th>Priority</th><th>Audience question</th><th>Format</th><th>Evidence</th></tr></thead>
            <tbody>
              {contentOpps.slice(0, 8).map((c: any, i: number) => (
                <tr key={i}>
                  <td><Chip tone={c.priority === "p0" ? "alert" : c.priority === "p1" ? "primary" : "accent"}>{(c.priority || "").toUpperCase()}</Chip></td>
                  <td>{c.question}</td>
                  <td>{c.suggested_format}</td>
                  <td style={{ fontSize: 12, opacity: 0.75 }}>{(c.evidence || "").slice(0, 120)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <Empty>No content opportunities surfaced.</Empty>}
      </Card>

      {/* COMMUNITY PAIN POINTS */}
      {painPoints.length > 0 && (
        <Card wide title="Community pain points feeding intelligence" tag={<Tag>{painPoints.length}</Tag>}>
          <ul className="cc-md-list">
            {painPoints.slice(0, 5).map((p: any, i: number) => (
              <li key={i}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <strong>{p.name}</strong>
                  <Chip tone={p.severity === "high" ? "alert" : "accent"}>{p.severity}</Chip>
                  <Chip>{p.frequency}× mentions</Chip>
                </div>
                {(p.examples ?? []).slice(0, 1).map((ex: string, j: number) => (
                  <div key={j} style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>"{ex}"</div>
                ))}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}

const CREAM_BG = "#FAF3E3";

// =====================================================================
// TEAM (person cards)
// =====================================================================
export function TeamPeople({ data }: { data: TeamBundle }) {
  return (
    <Card wide title="Team — who's on what" tag={<Tag>{data.profiles.length}</Tag>}>
      <div className="cc-team-grid">
        {data.profiles.map(p => (
          <Link key={p.name} href={`/profile/${p.name}`} className="cc-person-card">
            <div className="cc-person-head">
              <div className="cc-person-avatar">
                {p.avatar ? <img src={p.avatar} alt={p.name} /> : p.name[0]}
              </div>
              <div className="cc-person-id">
                <div className="cc-person-name">{p.name}</div>
                <div className="cc-person-meta">{p.lastSeen ? `active ${rel(p.lastSeen, new Date("2026-05-25"))}` : "no daily yet"}</div>
              </div>
            </div>
            {p.focus && <div className="cc-person-focus">{p.focus}</div>}
            <div className="cc-person-chips">
              {p.energy != null && <Chip tone="primary">⚡ {p.energy}/10</Chip>}
              {p.wins != null && p.wins > 0 && <Chip tone="accent">🏆 {p.wins}</Chip>}
              {p.loops != null && p.loops > 0 && <Chip tone="alert">🔁 {p.loops}</Chip>}
              <Chip>{p.weekTouched} / 7d</Chip>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

// =====================================================================
// TASKS (cross-team)
// =====================================================================
export function TeamTasks({ data }: { data: TeamBundle }) {
  return (
    <Card wide title="Cross-team active tasks" tag={<Tag>{data.tasks.length}</Tag>}>
      <table className="cc-table cc-table-tasks">
        <thead><tr><th>Owner</th><th>Due</th><th>Task</th></tr></thead>
        <tbody>
          {data.tasks.map((t, i) => (
            <tr key={i}>
              <td>{t.profile}</td>
              <td>{t.due ? <Chip tone="date">{t.due}</Chip> : <span className="cc-muted">—</span>}</td>
              <td>{t.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

// =====================================================================
// DAILY FEED — chronological org activity grouped by day, from real snapshots
// =====================================================================
export function TeamDaily({ data }: { data: TeamBundle }) {
  const community = data.community ?? {};
  const yt = data.youtube ?? {};
  const meetings = data.meetings ?? {};
  const intel = data.intelligence ?? {};

  type Event = {
    when: string;
    source: "Meeting" | "Circle post" | "Circle comment" | "YouTube video" | "YouTube comment" | "Decision" | "Action item";
    title: string;
    detail?: string;
    by?: string;
    url?: string;
  };

  const events: Event[] = [
    ...((meetings.recent ?? []) as any[]).map(m => ({
      when: m.date_iso, source: "Meeting" as const,
      title: m.title, detail: `${m.duration_minutes ?? 0} min · ${(m.attendees ?? []).length} attendees`,
      by: (m.attendees ?? []).slice(0, 3).map((a: string) => a.split("@")[0]).join(", "), url: m.url,
    })),
    ...((community.recent_posts ?? []) as any[]).map(p => ({
      when: p.posted_at, source: "Circle post" as const,
      title: p.title, detail: `${p.likes ?? 0} likes · ${p.comments ?? 0} comments`, by: p.author, url: p.url,
    })),
    ...((community.recent_comments ?? []) as any[]).map(c => ({
      when: c.posted_at, source: "Circle comment" as const,
      title: c.post_title, detail: (c.snippet || "").slice(0, 120), by: c.author, url: c.url,
    })),
    ...((yt.recent_videos ?? []) as any[]).map(v => ({
      when: v.published_at, source: "YouTube video" as const,
      title: v.title, detail: `${(v.views ?? 0).toLocaleString()} views · ${v.likes ?? 0} likes`, by: "{{ORG_NAME}}", url: v.url,
    })),
    ...((yt.recent_comments ?? []) as any[]).map(c => ({
      when: c.published_at, source: "YouTube comment" as const,
      title: c.video_title, detail: (c.text || "").slice(0, 120), by: c.author, url: c.video_url,
    })),
    ...((meetings.decisions ?? []) as any[]).map(d => ({
      when: d.date_iso, source: "Decision" as const,
      title: d.decision, detail: d.context, by: d.source_meeting_title, url: d.source_meeting_url,
    })),
    ...((intel.unified_action_items ?? []) as any[]).map(a => ({
      when: a.due_iso ?? "", source: "Action item" as const,
      title: a.text, detail: a.source, by: a.urgency, url: a.url,
    })),
  ].filter(e => e.when);

  // Group by date
  const byDay: Record<string, Event[]> = {};
  events.forEach(e => {
    const k = e.when.slice(0, 10);
    (byDay[k] = byDay[k] ?? []).push(e);
  });
  const days = Object.keys(byDay).sort((a, b) => b.localeCompare(a));

  // Daily volume chart (last 14 days)
  const today = new Date();
  const lastN: string[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today); d.setDate(today.getDate() - i);
    lastN.push(d.toISOString().slice(0, 10));
  }
  const volume = lastN.map(k => {
    const dayEvents = byDay[k] ?? [];
    return {
      name: k.slice(5),
      Meetings:        dayEvents.filter(e => e.source === "Meeting").length,
      "Circle posts":  dayEvents.filter(e => e.source === "Circle post").length,
      "Circle comments": dayEvents.filter(e => e.source === "Circle comment").length,
      "YouTube":       dayEvents.filter(e => e.source === "YouTube video" || e.source === "YouTube comment").length,
      Decisions:       dayEvents.filter(e => e.source === "Decision").length,
    };
  });

  const sourceCounts: Record<string, number> = {};
  events.forEach(e => { sourceCounts[e.source] = (sourceCounts[e.source] ?? 0) + 1; });
  const sourceMix = Object.entries(sourceCounts).map(([name, value]) => ({ name, value }));

  return (
    <>
      <div className="cc-kpis">
        <KPI variant="primary" label="Events" value={events.length} foot="all sources combined" />
        <KPI label="Active days" value={days.length} foot="days with activity" />
        <KPI label="Sources" value={Object.keys(sourceCounts).length} foot="meetings + circle + yt + intel" />
        <KPI label="Last activity" value={days[0]?.slice(5) ?? "—"} foot={days[0] ?? "no events"} />
      </div>

      <Card wide chart title="Daily activity volume (14d)" tag={<Tag>{events.length} events across sources</Tag>}>
        <RechartsArea
          data={volume}
          series={[
            { key: "Meetings",         label: "Meetings",         color: PALETTE[1] },
            { key: "Circle posts",     label: "Circle posts",     color: PALETTE[2] },
            { key: "Circle comments",  label: "Circle comments",  color: PALETTE[5] },
            { key: "YouTube",          label: "YouTube",          color: PALETTE[3] },
            { key: "Decisions",        label: "Decisions",        color: PALETTE[4] },
          ]}
          height={280}
        />
      </Card>

      <div className="cc-grid cc-grid-2">
        <Card chart title="Source mix" tag={<Tag>{events.length} events</Tag>}>
          <RechartsDonut data={sourceMix} height={260} />
        </Card>
        <Card title="Days with activity" tag={<Tag>{days.length}</Tag>}>
          <div className="cc-folders">
            {days.slice(0, 10).map(d => (
              <div className="cc-folder-row" key={d}>
                <span className="cc-folder-name">{d}</span>
                <div className="cc-folder-bar">
                  <div className="cc-folder-bar-fill" style={{
                    width: `${Math.min(100, (byDay[d].length / Math.max(...Object.values(byDay).map(v => v.length))) * 100)}%`
                  }} />
                </div>
                <span className="cc-folder-count">{byDay[d].length}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Day-by-day feed */}
      {days.slice(0, 6).map(d => (
        <Card wide key={d} title={d} tag={<Tag>{byDay[d].length} events</Tag>}>
          <table className="cc-table">
            <thead><tr><th style={{width:80}}>Time</th><th style={{width:140}}>Source</th><th style={{width:160}}>By</th><th>What</th></tr></thead>
            <tbody>
              {byDay[d]
                .sort((a, b) => b.when.localeCompare(a.when))
                .map((e, i) => (
                  <tr key={i}>
                    <td style={{ fontSize: 12, whiteSpace: "nowrap" }}>{e.when.slice(11, 16) || "—"}</td>
                    <td><Chip tone={
                      e.source === "Decision" ? "primary" :
                      e.source === "Action item" ? "alert" :
                      e.source === "Meeting" ? "accent" : undefined as any
                    }>{e.source}</Chip></td>
                    <td style={{ fontSize: 12 }}>{e.by}</td>
                    <td style={{ fontSize: 12 }}>
                      {e.url ? <a className="cc-link" href={e.url} target="_blank" rel="noreferrer"><strong>{e.title}</strong></a>
                            : <strong>{e.title}</strong>}
                      {e.detail && <div style={{ opacity: 0.7, marginTop: 2 }}>{e.detail}</div>}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Card>
      ))}
    </>
  );
}

// =====================================================================
// ANALYTICS — real snapshot data, rendered with recharts
// =====================================================================
export function TeamAnalytics({ data }: { data: TeamBundle }) {
  const yt = data.youtube;
  const community = data.community;
  const comms = data.comms;
  const meetings = data.meetings;
  const intel = data.intelligence;

  // --- YouTube: video performance vs channel avg
  const videoPerf = (yt?.video_performance ?? []).map((v: any) => ({
    name: (v.title || "").length > 36 ? v.title.slice(0, 34) + "…" : v.title,
    value: Number(v.vs_channel_avg_pct ?? 0),
    fill: Number(v.vs_channel_avg_pct ?? 0) >= 0 ? PALETTE[2] : PALETTE[3],
  }));

  // --- YouTube: recent videos views
  const recentVideos = (yt?.recent_videos ?? []).slice(0, 8).map((v: any) => ({
    name: (v.title || "").length > 28 ? v.title.slice(0, 26) + "…" : v.title,
    views: v.views ?? 0,
    likes: v.likes ?? 0,
    comments: v.comments ?? 0,
  }));

  // --- YouTube channel KPIs
  const ch = yt?.channel ?? {};
  const subsDelta = ch.subscribers_delta_7d ?? null;
  const viewsDelta = ch.views_delta_7d ?? null;

  // --- YouTube audience themes (mention counts)
  const audience = (yt?.audience_themes ?? []).map((t: any) => ({
    name: t.theme,
    value: t.mention_count ?? 0,
  }));

  // --- Comms: inbox by channel
  const commsTotals = comms?.totals ?? {};
  const inboxByChannel = [
    { name: "LinkedIn DMs", value: commsTotals.linkedin_dms ?? 0 },
    { name: "YouTube comments", value: commsTotals.youtube_comments ?? 0 },
    { name: "Emails unread", value: commsTotals.emails_unread ?? 0 },
    { name: "Circle DMs", value: commsTotals.circle_dms ?? 0 },
  ].filter(x => x.value > 0);

  // --- Community: top posts by engagement (likes + comments)
  const topPosts = (community?.recent_posts ?? [])
    .map((p: any) => ({
      name: (p.title || "").length > 32 ? p.title.slice(0, 30) + "…" : p.title,
      likes: p.likes ?? 0,
      comments: p.comments ?? 0,
      total: (p.likes ?? 0) + (p.comments ?? 0),
    }))
    .sort((a: any, b: any) => b.total - a.total)
    .slice(0, 8);

  // --- Meetings: themes by mention count
  const meetingThemes = (meetings?.themes_in_calls ?? [])
    .map((t: any) => ({ name: t.theme, value: t.mention_count ?? 0 }))
    .sort((a: any, b: any) => b.value - a.value)
    .slice(0, 8);

  // --- Intelligence: cross-validated themes by priority
  const crossThemes = (intel?.cross_validated_themes ?? [])
    .map((t: any) => ({
      name: t.theme,
      value: t.combined_mention_count ?? 0,
      fill:
        t.priority === "p0" ? PALETTE[3] :
        t.priority === "p1" ? PALETTE[5] : PALETTE[1],
    }))
    .slice(0, 8);

  return (
    <>
      {/* TOP STRIP — real KPIs from YouTube + community + comms */}
      <div className="cc-kpis">
        <KPI variant="primary" label="YouTube subs"
             value={ch.subscribers ?? "—"}
             delta={subsDelta != null && ch.subscribers ? (subsDelta / ch.subscribers) * 100 : undefined}
             foot={subsDelta != null ? `+${subsDelta.toLocaleString()} past 7d` : "from snapshot"} />
        <KPI label="Total views"
             value={ch.total_views ?? "—"}
             delta={viewsDelta != null && ch.total_views ? (viewsDelta / ch.total_views) * 100 : undefined}
             foot={viewsDelta != null ? `+${viewsDelta.toLocaleString()} past 7d` : ""} />
        <KPI label="Community members"
             value={community?.stats?.total_members ?? "—"}
             foot={`${community?.stats?.active_today ?? 0} active today`} />
        <KPI label="Meetings (7d)"
             value={meetings?.rollup?.meetings_count_7d ?? "—"}
             foot={`${meetings?.rollup?.total_hours_7d ?? 0}h logged`} />
      </div>

      {/* YOUTUBE PERFORMANCE — real */}
      <Card wide chart
            title="YouTube video performance vs channel average"
            tag={<Tag>{videoPerf.length} videos · from youtube snapshot</Tag>}>
        {videoPerf.length ? <RechartsBar data={videoPerf} height={320} yLabel="% vs avg" />
          : <Empty>No video_performance data in youtube snapshot.</Empty>}
      </Card>

      <div className="cc-grid cc-grid-2">
        <Card chart title="Recent video reach"
              tag={<Tag>{recentVideos.length} latest</Tag>}>
          {recentVideos.length ? (
            <RechartsArea
              data={recentVideos}
              series={[
                { key: "views", label: "Views", color: PALETTE[1] },
                { key: "likes", label: "Likes", color: PALETTE[2] },
                { key: "comments", label: "Comments", color: PALETTE[3] },
              ]}
              height={280}
            />
          ) : <Empty>No recent videos.</Empty>}
        </Card>

        <Card chart title="Audience themes (YouTube comments)"
              tag={<Tag>{audience.length}</Tag>}>
          {audience.length ? <RechartsDonut data={audience} height={280} />
            : <Empty>No audience themes.</Empty>}
        </Card>
      </div>

      {/* COMMUNITY */}
      <Card wide chart
            title="Top community posts by engagement"
            tag={<Tag>likes + comments · circle snapshot</Tag>}>
        {topPosts.length ? (
          <RechartsArea
            data={topPosts}
            series={[
              { key: "likes", label: "Likes", color: PALETTE[1] },
              { key: "comments", label: "Comments", color: PALETTE[2] },
            ]}
            height={300}
          />
        ) : <Empty>No community posts in snapshot.</Empty>}
      </Card>

      <div className="cc-grid cc-grid-2">
        {/* COMMS DONUT */}
        <Card chart title="Inbox load by channel"
              tag={<Tag>{inboxByChannel.reduce((a,b)=>a+b.value,0)} items</Tag>}>
          {inboxByChannel.length ? <RechartsDonut data={inboxByChannel} height={280} />
            : <Empty>Inbox is clear.</Empty>}
        </Card>

        {/* MEETING THEMES */}
        <Card chart title="Top themes across calls (last 7d)"
              tag={<Tag>{meetingThemes.length}</Tag>}>
          {meetingThemes.length ? <RechartsBar data={meetingThemes} horizontal height={280} />
            : <Empty>No themes in meetings snapshot.</Empty>}
        </Card>
      </div>

      {/* INTELLIGENCE CROSS-VALIDATED THEMES */}
      <Card wide chart
            title="Cross-validated themes (intelligence)"
            tag={<Tag>p0 = red · p1 = amber · p2 = blue</Tag>}>
        {crossThemes.length ? <RechartsBar data={crossThemes} horizontal height={Math.max(240, crossThemes.length * 38)} />
          : <Empty>No cross-validated themes.</Empty>}
      </Card>

      {/* PER-PROFILE 7d TOUCHES — kept from before but with proper chart */}
      <Card wide chart title="Per-profile activity (7d touches)" tag={<Tag>{data.profiles.length} people</Tag>}>
        <RechartsBar
          data={data.profiles.map(p => ({ name: p.name, value: p.weekTouched }))}
          horizontal
          height={Math.max(180, data.profiles.length * 42)}
        />
      </Card>
    </>
  );
}

// =====================================================================
// ACTIONS
// =====================================================================
export function TeamActions() {
  const actions = [
    { icon: "🌅", label: "Run morning briefing", sub: "Aggregates Gmail, Slack, Circle DMs, calendar" },
    { icon: "📺", label: "Run YouTube ideation", sub: "Scans VidIQ + competitor channels for next 3 video ideas" },
    { icon: "📰", label: "Run community digest", sub: "Top posts, mentions, themes from Circle" },
    { icon: "🧭", label: "Run weekly review", sub: "Synthesize last 7 days, surface decisions to document" },
    { icon: "💼", label: "Run CRM pipeline digest", sub: "Status across opportunities, blockers, next steps" },
  ];
  return (
    <Card wide title="Actions" tag={<Tag>via Agent SDK</Tag>}>
      <div className="cc-action-list">
        {actions.map((a, i) => (
          <button key={i} className="cc-btn cc-btn-block cc-btn-primary">
            <span className="cc-btn-ico">{a.icon}</span>
            <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
              <span>{a.label}</span>
              <span style={{ fontWeight: 500, fontSize: 12, opacity: 0.7 }}>{a.sub}</span>
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}

// =====================================================================
// CCUSAGE STRIP
// =====================================================================
function CCUsageStrip({ data }: { data: TeamBundle }) {
  const cc = data.ccusage;
  if (!cc) return null;
  return (
    <Card wide title="Claude API usage (this month)" tag={<Tag>{fmtCost(cc.totals.cost_usd)} total</Tag>}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <Mini label="Input tokens" value={fmtBigNumber(cc.totals.input_tokens)} />
        <Mini label="Output tokens" value={fmtBigNumber(cc.totals.output_tokens)} />
        <Mini label="Cache reads" value={fmtBigNumber(cc.totals.cache_read_tokens)} />
        <Mini label="Cache writes" value={fmtBigNumber(cc.totals.cache_creation_tokens)} />
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
        {cc.by_model.map(m => (
          <Chip key={m.model}>{m.model}: {fmtCost(m.cost_usd)}</Chip>
        ))}
      </div>
    </Card>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontFamily: "Space Grotesk", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.6 }}>{label}</div>
      <div style={{ fontFamily: "Space Grotesk", fontSize: 22, fontWeight: 800, marginTop: 2 }}>{value}</div>
    </div>
  );
}
