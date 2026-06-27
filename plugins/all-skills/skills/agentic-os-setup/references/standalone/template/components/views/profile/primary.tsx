"use client";

import { useState } from "react";
import type { ProfileBundle } from "@/lib/types";
import { Card, Chip, Empty, Tag } from "@/components/Card";
import { KPI } from "@/components/KPI";
import { LineChart } from "@/components/charts/LineChart";
import { Heatmap } from "@/components/charts/Heatmap";
import { rel, fmtBigNumber, priorityChip } from "@/lib/utils";

const TODAY = new Date("2026-05-26");

// =====================================================================
// PRIMARY OVERVIEW — synthesis-heavy view for the primary profile
// =====================================================================
export function PrimaryOverview({ data }: { data: ProfileBundle }) {
  const today = data.dailies[data.dailies.length - 1];
  const energyHist = data.dailies.map(d => d.energy ?? 0);
  const energyAvg = Math.round(energyHist.reduce((a, b) => a + b, 0) / energyHist.length * 10) / 10;

  return (
    <>
      <div className="cc-kpis">
        <KPI variant="primary" label="Energy avg" value={energyAvg} unit="/10" foot="14d rolling" />
        <KPI label="Open tasks" value={data.tasks.length} foot={`${data.tasks.filter(t => t.priority === "high").length} high priority`} />
        <KPI label="Runs (today)" value={data.runs.filter(r => r.started_at.startsWith("2026-05-26") || r.started_at.startsWith("2026-05-25")).length} foot="Agent SDK invocations" />
        <KPI label="Open loops" value={today?.open_loops ?? 0} foot="from today's daily" />
      </div>

      <div className="cc-grid">
        <Card focus title="Current focus">
          <div className="cc-focus-text">{today?.focus || <span className="cc-muted">no focus set</span>}</div>
          <div className="cc-focus-meta">{today?.date}</div>
        </Card>
        <Card chart title="Energy trend (14d)">
          <LineChart values={energyHist} labels={data.dailies.map(d => d.date.slice(5))} color="#7FBE7C" />
        </Card>
      </div>

      <Card wide title="Active runs / recent invocations">
        <table className="cc-table">
          <thead><tr><th>Command</th><th>Status</th><th>Started</th><th>Preview</th></tr></thead>
          <tbody>
            {data.runs.map(r => (
              <tr key={r.id}>
                <td><strong>{r.label}</strong></td>
                <td><Chip tone={r.status === "success" ? "primary" : r.status === "running" ? "accent" : undefined}>{r.status}</Chip></td>
                <td>{rel(r.started_at, TODAY)}</td>
                <td style={{ fontSize: 12, opacity: 0.7 }}>{r.output_preview || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

// =====================================================================
// COMMS (full inbox triage)
// =====================================================================
function SourceIcon({ source, size = 16 }: { source?: string; size?: number }) {
  const s = (source || "").toLowerCase();
  const wrap = (bg: string, child: any) => (
    <span title={s} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: size, height: size, borderRadius: 3, background: bg, flexShrink: 0 }}>
      {child}
    </span>
  );
  if (s === "linkedin") return wrap("#0A66C2", (
    <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="#fff"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/></svg>
  ));
  if (s === "youtube") return wrap("#FF0000", (
    <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 24 24" fill="#fff"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/></svg>
  ));
  if (s === "circle") return wrap("#1E1E1E", (
    <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3" fill="#fff"/></svg>
  ));
  if (s === "gmail" || s === "email") return wrap("#EA4335", (
    <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 24 24" fill="#fff"><path d="M2 6.2v11.6A2.2 2.2 0 0 0 4.2 20H6V9.7L12 14l6-4.3V20h1.8a2.2 2.2 0 0 0 2.2-2.2V6.2L12 12.5 2 6.2z"/></svg>
  ));
  if (s === "slack") return wrap("#4A154B", (
    <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24" fill="#fff"><path d="M5 15a2 2 0 1 1-2-2h2v2zm1 0a2 2 0 1 1 4 0v5a2 2 0 1 1-4 0v-5zM9 5a2 2 0 1 1 2-2v2H9zm0 1a2 2 0 1 1 0 4H4a2 2 0 1 1 0-4h5zm10 3a2 2 0 1 1 2 2h-2V9zm-1 0a2 2 0 1 1-4 0V4a2 2 0 1 1 4 0v5zm-3 10a2 2 0 1 1-2 2v-2h2zm0-1a2 2 0 1 1 0-4h5a2 2 0 1 1 0 4h-5z"/></svg>
  ));
  return wrap("#666", <span style={{ color: "#fff", fontSize: size * 0.5, fontWeight: 700 }}>{(s[0] || "?").toUpperCase()}</span>);
}

function InboxItem({ it, tone }: { it: any; tone: "alert" | "default" | "muted" }) {
  const borderColor = tone === "alert" ? "var(--alert)" : tone === "muted" ? "var(--bd-muted, #d4cdb4)" : "#020309";
  const draft = it.draft_reply;
  return (
    <div style={{ borderLeft: `3px solid ${borderColor}`, paddingLeft: 14, paddingBottom: 4 }}>
      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
        {tone === "alert" && <Chip tone="alert">urgent</Chip>}
        <SourceIcon source={it.source} size={18} />
        {it.received_at && <Chip tone="date">{it.received_at.slice(0, 10)}</Chip>}
        {it.url && <a className="cc-link" href={it.url} target="_blank" rel="noreferrer" style={{ fontSize: 11, marginLeft: 4 }}>open ↗</a>}
      </div>
      <div style={{ marginTop: 8, fontSize: 14 }}><strong>{it.from || "—"}</strong>{it.subject ? <> · <span style={{ opacity: 0.8 }}>{it.subject}</span></> : null}</div>
      {it.sender_context && (
        <div style={{ fontSize: 12, marginTop: 4, opacity: 0.65, fontStyle: "italic" }}>{it.sender_context}</div>
      )}
      {it.snippet && (
        <div style={{ fontSize: 12, marginTop: 8, padding: 8, background: "var(--canvas-2, #f6f1e1)", borderRadius: 6, lineHeight: 1.45 }}>
          {it.snippet.slice(0, 280)}{it.snippet.length > 280 ? "…" : ""}
        </div>
      )}
      {it.intel_signal && (
        <div style={{ fontSize: 12, marginTop: 8 }}>
          <Chip tone="primary">signal</Chip>{" "}{it.intel_signal}
        </div>
      )}
      {it.suggested_action && (
        <div style={{ fontSize: 12, marginTop: 6 }}>
          <strong>Action:</strong> {it.suggested_action}
        </div>
      )}
      {draft && <DraftBlock item={it} initialDraft={draft} />}
    </div>
  );
}

function DraftBlock({ item, initialDraft }: { item: any; initialDraft: string }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(initialDraft);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const canSend = item.source === "linkedin" && !!item.chat_id;
  const sendable = canSend && text.trim().length > 0 && status !== "sending" && status !== "sent";

  async function onSend() {
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/comms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: item.source, chat_id: item.chat_id, message: text }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data?.error || `HTTP ${res.status}`);
        return;
      }
      setStatus("sent");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(String(err?.message || err));
    }
  }

  const cannotSendReason =
    item.source !== "linkedin" ? `Send not wired for ${item.source} yet` :
    !item.chat_id ? "Missing chat_id (re-run refresh after the new schema lands)" :
    "";

  return (
    <details style={{ marginTop: 10, fontSize: 12 }} open={open} onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}>
      <summary style={{ cursor: "pointer", fontWeight: 600 }}>
        Draft reply{status === "sent" ? " · sent ✓" : status === "error" ? " · error" : ""}
      </summary>
      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); if (status === "sent" || status === "error") setStatus("idle"); }}
        rows={Math.min(10, Math.max(3, text.split("\n").length + 1))}
        style={{
          width: "100%",
          marginTop: 6,
          padding: 10,
          background: "#fff",
          border: "1px dashed #020309",
          borderRadius: 6,
          fontFamily: "inherit",
          fontSize: 12,
          lineHeight: 1.5,
          resize: "vertical",
        }}
      />
      <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <button
          onClick={onSend}
          disabled={!sendable}
          className="cc-btn cc-btn-primary"
          style={!sendable ? { opacity: 0.55, cursor: "not-allowed" } : undefined}
          title={canSend ? "" : cannotSendReason}
        >
          {status === "sending" ? "Sending…" : status === "sent" ? "Sent ✓" : "Send via MCP"}
        </button>
        {!canSend && <span style={{ opacity: 0.7 }}>{cannotSendReason}</span>}
        {status === "error" && <span style={{ color: "var(--alert, #c0392b)" }}>{errorMsg}</span>}
      </div>
    </details>
  );
}

export function PrimaryComms({ data }: { data: ProfileBundle }) {
  const c = data.comms as any;
  if (!c) return <Empty>No comms snapshot.</Empty>;
  const urgent = Array.isArray(c.urgent) ? c.urgent : [];
  const needsReply = Array.isArray(c.needs_reply) ? c.needs_reply : [];
  const fyi = Array.isArray(c.fyi) ? c.fyi : [];
  const recurring = Array.isArray(c.recurring_senders) ? c.recurring_senders : [];
  return (
    <>
      <div className="cc-kpis">
        <KPI variant={c.totals?.linkedin_dms ? "primary" : "default"}
          label={<span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><SourceIcon source="linkedin" size={14} /> LinkedIn DMs</span>}
          value={c.totals?.linkedin_dms ?? "—"} foot="unread chats" />
        <KPI variant={c.totals?.circle_dms ? "primary" : "default"}
          label={<span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><SourceIcon source="circle" size={14} /> Circle DMs</span>}
          value={c.totals?.circle_dms ?? "—"} foot="unread rooms" />
        <KPI variant={c.totals?.youtube_comments ? "primary" : "default"}
          label={<span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><SourceIcon source="youtube" size={14} /> YouTube</span>}
          value={c.totals?.youtube_comments ?? "—"} foot="comments needing reply" />
        <KPI label={<span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><SourceIcon source="gmail" size={14} /> Email</span>}
          value={c.totals?.emails_unread ?? "—"} foot="gmail not connected" />
      </div>

      <Card wide title="Urgent" tag={<Tag accent>{urgent.length}</Tag>}>
        {urgent.length ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {urgent.map((it: any, i: number) => <InboxItem key={i} it={it} tone="alert" />)}
          </div>
        ) : <Empty>Nothing urgent.</Empty>}
      </Card>

      <Card wide title="Needs reply" tag={<Tag>{needsReply.length}</Tag>}>
        {needsReply.length ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {needsReply.map((it: any, i: number) => <InboxItem key={i} it={it} tone="default" />)}
          </div>
        ) : <Empty>Inbox zero.</Empty>}
      </Card>

      {fyi.length > 0 && (
        <Card wide title="FYI / low-priority" tag={<Tag>{fyi.length}</Tag>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {fyi.map((it: any, i: number) => <InboxItem key={i} it={it} tone="muted" />)}
          </div>
        </Card>
      )}

      {recurring.length > 0 && (
        <Card wide title="Recurring senders" tag={<Tag>{recurring.length}</Tag>}>
          <table className="cc-table">
            <thead><tr><th>From</th><th>Source</th><th>Msgs</th><th>Pattern</th><th>Topics</th></tr></thead>
            <tbody>
              {recurring.map((r: any, i: number) => (
                <tr key={i}>
                  <td><strong>{r.from}</strong></td>
                  <td><SourceIcon source={r.source} size={16} /></td>
                  <td>{r.message_count}</td>
                  <td style={{ fontSize: 12, opacity: 0.75 }}>{r.pattern || "—"}</td>
                  <td style={{ fontSize: 12, opacity: 0.75 }}>{(r.topics || []).join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}

// =====================================================================
// INTELLIGENCE
// =====================================================================
export function PrimaryIntelligence({ data }: { data: ProfileBundle }) {
  const intel = data.intelligence;
  if (!intel) return <Empty>No intelligence snapshot.</Empty>;
  return (
    <>
      <Card wide title="Opportunity briefs" tag={<Tag>{intel.opportunity_briefs.length}</Tag>}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
          {intel.opportunity_briefs.map((b, i) => (
            <div key={i} style={{ background: "var(--canvas)", border: "var(--bd)", borderRadius: 12, padding: 14 }}>
              <Chip tone="primary">brief</Chip>
              <strong style={{ display: "block", margin: "8px 0 6px", fontFamily: "Space Grotesk" }}>{b.title}</strong>
              <p style={{ margin: "0 0 8px", fontSize: 13 }}>{b.summary}</p>
              <div style={{ fontSize: 12 }}><strong>Next:</strong> {b.recommended_next_action}</div>
              {b.sources && b.sources.length > 0 && (
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 8 }}>
                  {b.sources.map(s => <Chip key={s}>{s}</Chip>)}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card wide title="Cross-validated themes" tag={<Tag>{intel.cross_validated_themes.length}</Tag>}>
        <table className="cc-table">
          <thead><tr><th>Priority</th><th>Theme</th><th>Sources</th><th>Mentions</th><th>Why</th></tr></thead>
          <tbody>
            {intel.cross_validated_themes.map((t, i) => (
              <tr key={i}>
                <td><Chip tone={priorityChip(t.priority).tone as any}>{priorityChip(t.priority).label}</Chip></td>
                <td><strong>{t.theme}</strong></td>
                <td>{t.sources.map(s => <Chip key={s}>{s}</Chip>)}</td>
                <td>{t.combined_mention_count}</td>
                <td style={{ fontSize: 12, opacity: 0.7 }}>{t.why.slice(0, 120)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {intel.decisions_to_document && intel.decisions_to_document.length > 0 && (
        <Card wide title="Decisions to document" tag={<Tag accent>{intel.decisions_to_document.length}</Tag>}>
          <ul className="cc-md-list">
            {intel.decisions_to_document.map((d, i) => (
              <li key={i}><strong>{d.title}</strong> — {d.context}</li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}

// =====================================================================
// RESEARCH — matches research.json shape: anthropic_updates, youtube_trends,
// twitter_signals, competitor_activity, synthesis
// =====================================================================
const arr = <T,>(v: any): T[] => (Array.isArray(v) ? v : []);

export function PrimaryResearch({ data }: { data: ProfileBundle }) {
  const r = data.research as any;
  if (!r) return <Empty>No research snapshot.</Empty>;
  const window = r.window_hours ? `${r.window_hours}h` : "48h";
  return (
    <>
      <Card wide title={`Research · last ${window}`} tag={<Tag>updated {rel(r.updated_at, TODAY)}</Tag>}>
        {r.synthesis?.headline_signal ? (
          <div style={{ borderLeft: "3px solid #020309", padding: "8px 12px", background: "#f6f1e1", marginBottom: 8 }}>
            <Chip tone="primary">headline</Chip>
            <p style={{ margin: "6px 0 0", fontSize: 14, fontWeight: 600 }}>{r.synthesis.headline_signal}</p>
          </div>
        ) : <Empty>No headline signal yet.</Empty>}
      </Card>

      <Card wide title="Anthropic updates" tag={<Tag>{arr(r.anthropic_updates).length}</Tag>}>
        {arr(r.anthropic_updates).length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {arr(r.anthropic_updates).map((u: any, i: number) => (
              <div key={i} style={{ display: "flex", gap: 14, padding: 12, border: "1px solid #020309", borderRadius: 8, background: "#fff", alignItems: "flex-start" }}>
                {u.image_url && (
                  <a href={u.url} target="_blank" rel="noreferrer" style={{ flexShrink: 0, display: "block", width: 180, borderRadius: 6, overflow: "hidden", border: "1px solid #020309" }}>
                    <img src={u.image_url} alt="" style={{ width: "100%", display: "block" }} />
                  </a>
                )}
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
                    <Chip>{u.type || "—"}</Chip>
                    <span className="cc-muted" style={{ fontSize: 11 }}>{rel(u.published_at, TODAY)}</span>
                  </div>
                  <strong style={{ fontSize: 14, display: "block", marginBottom: 6 }}>
                    <a className="cc-link" href={u.url} target="_blank" rel="noreferrer">{u.title}</a>
                  </strong>
                  <p style={{ margin: "0 0 6px", fontSize: 13, lineHeight: 1.45 }}>{(u.summary || "").slice(0, 280)}</p>
                  {u.what_it_means_for_us && (
                    <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>
                      <strong>For us:</strong> {u.what_it_means_for_us.slice(0, 220)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : <Empty>No Anthropic updates in window.</Empty>}
      </Card>

      <Card wide title="YouTube trends in your niche" tag={<Tag>{arr(r.youtube_trends).length}</Tag>}>
        {arr(r.youtube_trends).length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {arr(r.youtube_trends).map((t: any, i: number) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: 8, border: "1px solid #020309", borderRadius: 8, background: "#fff", alignItems: "flex-start" }}>
                {t.thumbnail_url && (
                  <a href={t.url} target="_blank" rel="noreferrer" style={{ flexShrink: 0, display: "block", width: 144, aspectRatio: "16/9", borderRadius: 6, overflow: "hidden", border: "1px solid #020309" }}>
                    <img src={t.thumbnail_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </a>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                    <strong style={{ fontSize: 13, lineHeight: 1.3, flex: 1 }}>
                      <a className="cc-link" href={t.url} target="_blank" rel="noreferrer">{t.title}</a>
                    </strong>
                    {t.velocity != null && (
                      <Chip tone="primary">{typeof t.velocity === "number" ? `${t.velocity.toLocaleString()} v/h` : String(t.velocity)}</Chip>
                    )}
                  </div>
                  <div className="cc-muted" style={{ fontSize: 11, marginBottom: 6 }}>
                    {t.channel || "—"} · {t.views?.toLocaleString?.() || t.views || "—"} views{t.topic_cluster && <> · {t.topic_cluster}</>}
                  </div>
                  {t.key_insight && <p style={{ margin: 0, fontSize: 12, lineHeight: 1.45, opacity: 0.8 }}>{t.key_insight.slice(0, 240)}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : <Empty>No YouTube trends in window.</Empty>}
      </Card>

      <Card wide title="Competitor activity" tag={<Tag>{arr(r.competitor_activity).length}</Tag>}>
        {arr(r.competitor_activity).length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {arr(r.competitor_activity).map((c: any, i: number) => {
              const pct = c.performance_vs_their_avg_pct;
              const tone = pct == null ? undefined : pct > 100 ? "primary" : pct > 0 ? "accent" : "alert";
              const sign = pct > 0 ? "+" : "";
              return (
                <div key={i} style={{ display: "flex", gap: 12, padding: 8, border: "1px solid #020309", borderRadius: 8, background: "#fff", alignItems: "flex-start" }}>
                  {c.thumbnail_url && (
                    <a href={c.video_url} target="_blank" rel="noreferrer" style={{ flexShrink: 0, display: "block", width: 144, aspectRatio: "16/9", borderRadius: 6, overflow: "hidden", border: "1px solid #020309" }}>
                      <img src={c.thumbnail_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </a>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                      <strong style={{ fontSize: 13, lineHeight: 1.3, flex: 1 }}>
                        <a className="cc-link" href={c.video_url} target="_blank" rel="noreferrer">{c.video_title}</a>
                      </strong>
                      {pct != null && <Chip tone={tone as any}>{sign}{pct}%</Chip>}
                    </div>
                    <div className="cc-muted" style={{ fontSize: 11, marginBottom: 6 }}>
                      {c.channel_url ? <a className="cc-link" href={c.channel_url} target="_blank" rel="noreferrer">{c.channel}</a> : c.channel}
                      {" · "}{c.views?.toLocaleString?.() || c.views || "—"} views
                      {c.topic && <> · {c.topic}</>}
                    </div>
                    {c.angle_summary && <p style={{ margin: 0, fontSize: 12, lineHeight: 1.45, opacity: 0.8 }}>{c.angle_summary.slice(0, 240)}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : <Empty>No competitor activity in window.</Empty>}
      </Card>

      <Card wide title="Twitter / X signals" tag={<Tag>{arr(r.twitter_signals).length}</Tag>}>
        {arr(r.twitter_signals).length > 0 ? (
          <ul className="cc-md-list" style={{ fontSize: 13 }}>
            {arr(r.twitter_signals).map((s: any, i: number) => (
              <li key={i}>
                <strong>{s.author || s.handle || "—"}</strong>
                {s.url && <> · <a className="cc-link" href={s.url} target="_blank" rel="noreferrer">view</a></>}
                {(s.text || s.content) && <div style={{ fontSize: 12, marginTop: 4 }}>{(s.text || s.content).slice(0, 240)}</div>}
              </li>
            ))}
          </ul>
        ) : <Empty>No Twitter signals in window.</Empty>}
      </Card>

      {r.synthesis && (
        <div className="cc-grid cc-grid-2">
          {arr<string>(r.synthesis.content_opportunities).length > 0 && (
            <Card title="Content opportunities" tag={<Tag>{arr(r.synthesis.content_opportunities).length}</Tag>}>
              <ul className="cc-md-list" style={{ fontSize: 13 }}>
                {arr<string>(r.synthesis.content_opportunities).map((o, i) => <li key={i}>{o}</li>)}
              </ul>
            </Card>
          )}
          {arr<string>(r.synthesis.trends_to_watch).length > 0 && (
            <Card title="Trends to watch" tag={<Tag>{arr(r.synthesis.trends_to_watch).length}</Tag>}>
              <ul className="cc-md-list" style={{ fontSize: 13 }}>
                {arr<string>(r.synthesis.trends_to_watch).map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </Card>
          )}
        </div>
      )}
    </>
  );
}

// =====================================================================
// DAILY (full daily trend + self-report history)
// =====================================================================
export function PrimaryDaily({ data }: { data: ProfileBundle }) {
  const meetings = data.meetings as any;
  const community = data.community as any;
  const intel = data.intelligence as any;
  const yt = data.youtube as any;
  const name = data.name;
  const nameLower = name.toLowerCase();
  // Per-profile email — set NEXT_PUBLIC_PROFILE_EMAIL_DOMAIN to filter meetings
  // by attendee email. Defaults to nameLower@example.com (effectively unused).
  const emailDomain = process.env.NEXT_PUBLIC_PROFILE_EMAIL_DOMAIN || "example.com";
  const email = `${nameLower}@${emailDomain}`;

  type Event = { when: string; kind: string; title: string; detail?: string; url?: string };

  const events: Event[] = [
    ...arr<any>(meetings?.recent)
      .filter(m => (m.attendees ?? []).some((a: string) => a.toLowerCase().includes(nameLower) || a.toLowerCase() === email))
      .map(m => ({ when: m.date_iso, kind: "Meeting attended", title: m.title, detail: `${m.duration_minutes ?? 0} min · ${(m.attendees ?? []).length} attendees`, url: m.url })),
    ...arr<any>(meetings?.action_items)
      .filter(a => (a.owner || "").toLowerCase().split(" ")[0] === nameLower)
      .map(a => ({ when: a.date_iso, kind: "Action item assigned", title: a.text, detail: a.source_meeting_title, url: a.source_meeting_url })),
    ...arr<any>(meetings?.decisions)
      .filter(d => (d.decision || "").toLowerCase().includes(nameLower) || (d.context || "").toLowerCase().includes(nameLower))
      .map(d => ({ when: d.date_iso, kind: "Decision involving you", title: d.decision, detail: d.context, url: d.source_meeting_url })),
    ...arr<any>(community?.recent_posts)
      .filter(p => (p.author || "").toLowerCase().includes(nameLower))
      .map(p => ({ when: p.posted_at, kind: "Circle post", title: p.title, detail: `${p.likes ?? 0} likes · ${p.comments ?? 0} comments`, url: p.url })),
    ...arr<any>(community?.recent_comments)
      .filter(c => (c.author || "").toLowerCase().includes(nameLower))
      .map(c => ({ when: c.posted_at, kind: "Circle comment", title: c.post_title, detail: (c.snippet || "").slice(0, 120), url: c.url })),
    // YouTube uploads only show on the primary profile (first entry in PROFILES).
    ...(arr<any>(yt?.recent_videos).length && name === (process.env.NEXT_PUBLIC_PRIMARY_PROFILE || "") ? arr<any>(yt?.recent_videos).map(v => ({
      when: v.published_at, kind: "YouTube video", title: v.title,
      detail: `${(v.views ?? 0).toLocaleString()} views · ${v.likes ?? 0} likes`, url: v.url,
    })) : []),
  ].filter(e => e.when);

  // Group by day
  const byDay: Record<string, Event[]> = {};
  events.forEach(e => {
    const k = e.when.slice(0, 10);
    (byDay[k] = byDay[k] ?? []).push(e);
  });
  const days = Object.keys(byDay).sort((a, b) => b.localeCompare(a));

  const kinds: Record<string, number> = {};
  events.forEach(e => { kinds[e.kind] = (kinds[e.kind] ?? 0) + 1; });

  return (
    <>
      <div className="cc-kpis">
        <KPI variant="primary" label="Activity events" value={events.length} foot="from snapshots" />
        <KPI label="Active days" value={days.length} foot="days with activity" />
        <KPI label="Meetings" value={kinds["Meeting attended"] ?? 0} foot="you attended" />
        <KPI label="Last activity" value={days[0]?.slice(5) ?? "—"} foot={days[0] ?? "no events"} />
      </div>

      {days.length === 0 ? (
        <Card wide title="Daily activity">
          <Empty>No activity for {name} found in current snapshots. Data appears here once you're mentioned in meetings or Circle, or once you author content.</Empty>
        </Card>
      ) : (
        days.slice(0, 8).map(d => (
          <Card wide key={d} title={d} tag={<Tag>{byDay[d].length} events</Tag>}>
            <table className="cc-table">
              <thead><tr><th style={{ width: 70 }}>Time</th><th style={{ width: 200 }}>Kind</th><th>What</th></tr></thead>
              <tbody>
                {byDay[d]
                  .sort((a, b) => b.when.localeCompare(a.when))
                  .map((e, i) => (
                    <tr key={i}>
                      <td style={{ fontSize: 12, whiteSpace: "nowrap" }}>{e.when.slice(11, 16) || "—"}</td>
                      <td><Chip tone={
                        e.kind.startsWith("Decision") ? "primary" :
                        e.kind.startsWith("Action") ? "alert" :
                        e.kind.startsWith("Meeting") ? "accent" : undefined as any
                      }>{e.kind}</Chip></td>
                      <td style={{ fontSize: 13 }}>
                        {e.url ? <a className="cc-link" href={e.url} target="_blank" rel="noreferrer"><strong>{e.title}</strong></a>
                              : <strong>{e.title}</strong>}
                        {e.detail && <div style={{ opacity: 0.7, marginTop: 2, fontSize: 12 }}>{e.detail}</div>}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Card>
        ))
      )}
    </>
  );
}
