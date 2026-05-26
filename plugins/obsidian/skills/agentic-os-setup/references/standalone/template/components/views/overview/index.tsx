"use client";

import { Card, Chip, Empty, Tag } from "@/components/Card";
import { KPI } from "@/components/KPI";
import { SkillsClient } from "./SkillsClient";
import { RunsTableClient } from "./RunsTableClient";

// =====================================================================
// OVERVIEW
// =====================================================================
export function OverviewOverview() {
  return (
    <>
      <div className="cc-kpis">
        <KPI variant="primary" label="Connectors" value={11} foot="active integrations" />
        <KPI label="Skills" value={24} foot="installed in workspace" />
        <KPI label="Sub-schedules" value={11} foot="across all profiles" />
        <KPI label="Profiles" value={5} foot="active team members" />
      </div>

      <Card wide title="System architecture" tag={<Tag>web deployment</Tag>}>
        <div style={{ fontFamily: "JetBrains Mono, ui-monospace, Menlo, monospace", fontSize: 12, lineHeight: 1.7, background: "var(--canvas)", border: "var(--bd)", borderRadius: 10, padding: 16, whiteSpace: "pre" }}>
{`[ Browser (vercel.app) ]
        ↓
[ Next.js API routes — auth + uploads + SSE ]
        ↓
[ Agent server (Fly.io / Railway) — Claude Agent SDK ]
        ↓                    ↓
[ Connectors ]         [ Snapshots DB (Postgres) ]
  Gmail, Slack,            community, youtube,
  Circle, Fireflies,       comms, meetings,
  YouTube, VidIQ           intelligence, research`}
        </div>
      </Card>

      <RunsTableClient />
    </>
  );
}

// =====================================================================
// SKILLS
// =====================================================================
export function OverviewSkills() {
  return <SkillsClient />;
}

// =====================================================================
// OPERATOR
// =====================================================================
export function OverviewOperator() {
  return (
    <>
      <Card wide title="Vault Operator (cron skill)" tag={<Tag accent>hourly</Tag>}>
        <p>The Operator is the autonomous hourly skill that refreshes snapshots, prunes stale escalations, and writes daily summaries. In the web deployment it runs as a scheduled Agent SDK task that calls connectors and writes results to the snapshots DB.</p>
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button className="cc-btn cc-btn-primary"><span className="cc-btn-ico">▶</span><span>Run now</span></button>
          <button className="cc-btn"><span className="cc-btn-ico">📜</span><span>View last run log</span></button>
          <button className="cc-btn"><span className="cc-btn-ico">⚙</span><span>Edit prompt</span></button>
        </div>
      </Card>

      <div className="cc-grid">
        <Card title="Last run">
          <div className="cc-agg-list">
            <div className="cc-agg-row"><span className="cc-agg-label">Status</span><span className="cc-agg-val"><Chip tone="primary">success</Chip></span></div>
            <div className="cc-agg-row"><span className="cc-agg-label">Duration</span><span className="cc-agg-val">94s</span></div>
            <div className="cc-agg-row"><span className="cc-agg-label">Snapshots updated</span><span className="cc-agg-val">6</span></div>
            <div className="cc-agg-row"><span className="cc-agg-label">Escalations</span><span className="cc-agg-val">3</span></div>
          </div>
        </Card>
        <Card title="Schedule">
          <ul className="cc-md-list">
            <li>Cron: <strong className="cc-code">0 * * * *</strong> (every hour)</li>
            <li>Workspace: <strong className="cc-code">/workspaces/{`{user_id}`}</strong></li>
            <li>Skills loaded: morning-briefing, community-digest, weekly-review</li>
            <li>MCPs: Gmail, Slack, Circle, Fireflies, YouTube</li>
          </ul>
        </Card>
      </div>
    </>
  );
}

// =====================================================================
// ATLAS (connectors/MCPs catalog)
// =====================================================================
export function OverviewAtlas() {
  const mcps = [
    { name: "Gmail", status: "connected", scope: "Read mail, send drafts" },
    { name: "Slack", status: "connected", scope: "Read/send messages, search" },
    { name: "Circle.so", status: "connected", scope: "Posts, members, DMs" },
    { name: "Fireflies", status: "connected", scope: "Meeting transcripts" },
    { name: "YouTube Data", status: "connected", scope: "Channel + video stats" },
    { name: "VidIQ", status: "connected", scope: "Outliers, keyword research" },
    { name: "Apify", status: "connected", scope: "Web scraping actors" },
    { name: "n8n", status: "connected", scope: "Workflow execution" },
    { name: "Supabase", status: "disconnected", scope: "DB queries" },
    { name: "Notion", status: "disconnected", scope: "Pages, databases" },
    { name: "Linear", status: "disconnected", scope: "Issues, projects" },
  ];
  return (
    <Card wide title="Connectors / MCPs" tag={<Tag>{mcps.length}</Tag>}>
      <table className="cc-table">
        <thead><tr><th>Connector</th><th>Status</th><th>Scope</th><th>Actions</th></tr></thead>
        <tbody>
          {mcps.map(m => (
            <tr key={m.name}>
              <td><strong>{m.name}</strong></td>
              <td><Chip tone={m.status === "connected" ? "primary" : "accent"}>{m.status}</Chip></td>
              <td style={{ fontSize: 12, opacity: 0.7 }}>{m.scope}</td>
              <td>
                {m.status === "connected" ? (
                  <a className="cc-link">Test</a>
                ) : (
                  <a className="cc-link">Connect →</a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 16 }}>
        <button className="cc-btn cc-btn-primary"><span className="cc-btn-ico">+</span><span>Add MCP</span></button>
      </div>
    </Card>
  );
}
