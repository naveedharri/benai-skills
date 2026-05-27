"use client";

import type { ProfileBundle } from "@/lib/types";
import { Card, Chip, Empty, Tag } from "@/components/Card";
import { KPI } from "@/components/KPI";
import { LineChart } from "@/components/charts/LineChart";
import { rel, fmtBigNumber, priorityChip, toneFor } from "@/lib/utils";
import { RunsTableClient } from "@/components/views/overview/RunsTableClient";

const TODAY = new Date("2026-05-26");

// Helper to safely access optional snapshot fields
const arr = <T,>(v: any): T[] => (Array.isArray(v) ? v : []);

// =====================================================================
// OVERVIEW — matches buildProfileHTML overview section
// =====================================================================
export function ProfileOverview({ data }: { data: ProfileBundle }) {
  const yt = data.youtube;
  const community = data.community as any;
  const comms = data.comms as any;
  const intel = data.intelligence as any;

  const urgentCount = arr(comms?.urgent).length;
  const needsReply = arr(comms?.needs_reply).length;
  const subs = yt?.channel?.subscribers ?? null;
  const subsDelta = yt?.channel?.subscribers_delta_7d ?? null;
  const subsDeltaPct = (subs && subsDelta)
    ? Math.round((subsDelta / Math.max(1, subs - subsDelta)) * 100)
    : undefined;

  const members = community?.stats?.total_members ?? null;
  const activeToday = community?.stats?.active_today ?? null;

  const topBrief = arr(intel?.opportunity_briefs)[0] as any;
  const topCrossTheme = arr(intel?.cross_validated_themes).find((t: any) => t.priority === "p0")
                    || arr(intel?.cross_validated_themes)[0] as any;
  const decisionsToDoc = arr(intel?.decisions_to_document).length;
  const churnSignals = arr(intel?.churn_signals).length;

  const topUrgent = arr(comms?.urgent)[0] as any;
  const topNeedsReply = arr(comms?.needs_reply)[0] as any;
  const recentVideo = arr(yt?.recent_videos)[0] as any;
  const topPerf = arr((yt as any)?.video_performance).find((p: any) =>
    (p.url && recentVideo?.url && p.url === recentVideo.url) ||
    (p.title && recentVideo?.title && p.title === recentVideo.title)
  ) as any;
  const ytTopComments = arr((yt as any)?.recent_comments).filter((c: any) =>
    (c.video_url && recentVideo?.url && c.video_url === recentVideo.url) ||
    (c.video_title && recentVideo?.title && c.video_title.toLowerCase() === recentVideo.title.toLowerCase())
  ).slice(0, 3);
  const ytCommentsFallback = ytTopComments.length === 0 ? arr((yt as any)?.recent_comments).slice(0, 3) : [];

  const topTheme = arr(community?.themes).sort((a: any, b: any) => (b.frequency_4w || 0) - (a.frequency_4w || 0))[0] as any;
  const topPain = arr(community?.pain_points).sort((a: any, b: any) => (b.frequency || 0) - (a.frequency || 0))[0] as any;
  const topMention = arr(community?.mentions)[0] as any;
  const recentPost = arr(community?.recent_posts)[0] as any;
  const stuckCount = arr(community?.stuck_members).length;
  const communityNeedsReply = arr(community?.needs_my_reply).length;
  const topPower = arr(community?.power_users)[0] as any;

  // Build community-pulse synthesis paragraph
  const synthesisParts: string[] = [];
  if (topTheme) {
    const verb = topTheme.trend === "rising" ? "is heating up" : topTheme.trend === "fading" ? "is cooling off" : "is the steady drumbeat";
    synthesisParts.push(`**${topTheme.name}** ${verb} — surfaced ${topTheme.frequency_4w || 0}× in the last 4 weeks${topTheme.sentiment ? ` with ${topTheme.sentiment} sentiment` : ""}.`);
  }
  if (topPain) {
    synthesisParts.push(`The loudest pain point is **${topPain.name}** (${topPain.severity || "medium"} severity, mentioned ${topPain.frequency || 0}×).`);
  }
  if (topMention) {
    synthesisParts.push(`Most recent mention of you: **${topMention.author}** — "${(topMention.context || "").slice(0, 140)}".`);
  }
  if (recentPost) {
    synthesisParts.push(`Latest post: **${recentPost.title}** by ${recentPost.author || "someone"} (${recentPost.comments || 0} comments, ${recentPost.likes || 0} likes).`);
  }
  if (communityNeedsReply || stuckCount) {
    const a = communityNeedsReply ? `**${communityNeedsReply}** ${communityNeedsReply === 1 ? "item needs" : "items need"} your personal reply` : "";
    const b = stuckCount ? `**${stuckCount}** ${stuckCount === 1 ? "member is" : "members are"} stuck` : "";
    synthesisParts.push([a, b].filter(Boolean).join(" and ") + ".");
  }
  if (topPower) {
    synthesisParts.push(`⭐ **${topPower.name}** is leading contributions with ${topPower.contribution_count_4w || 0} this month.`);
  }

  return (
    <>
      <div className="cc-kpis">
        <KPI variant="primary" label="YouTube subscribers"
          value={subs != null ? subs.toLocaleString() : "—"}
          delta={subsDeltaPct}
          foot={subsDelta != null ? `+${subsDelta.toLocaleString()} past 7d` : "click Refresh on YouTube"} />
        <KPI label="Community" value={members != null ? members.toLocaleString() : "—"}
          foot={activeToday != null ? `${activeToday} active today` : "members"} />
        <KPI variant={urgentCount ? "alert" : "default"} label="Urgent inbox"
          value={urgentCount} foot={`${needsReply} need a reply`} />
        <KPI label="Active tasks" value={data.tasks.length}
          foot={`${data.tasks.filter(t => t.due).length} with a due date`} />
      </div>

      {intel && (
        <Card wide title="Top intelligence" tag={<Tag>see all →</Tag>}>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {topBrief && (
              <div style={{ flex: 1, minWidth: 280, borderLeft: "3px solid #020309", padding: "8px 12px", background: "#f6f1e1" }}>
                <Chip tone="primary">brief</Chip>
                <strong style={{ display: "block", margin: "6px 0 4px" }}>{topBrief.title}</strong>
                <p style={{ margin: "0 0 6px", fontSize: 13 }}>{(topBrief.summary || "").slice(0, 220)}</p>
                <p style={{ margin: 0, fontSize: 12 }}><strong>Next:</strong> {(topBrief.recommended_next_action || "").slice(0, 180)}</p>
              </div>
            )}
            {topCrossTheme && (
              <div style={{ flex: 1, minWidth: 240, borderLeft: "3px solid #020309", padding: "8px 12px", background: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <Chip tone={priorityChip(topCrossTheme.priority).tone as any}>{priorityChip(topCrossTheme.priority).label}</Chip>
                  <span className="cc-muted" style={{ fontSize: 11 }}>cross-validated</span>
                </div>
                <strong style={{ display: "block", margin: "0 0 4px" }}>{topCrossTheme.theme}</strong>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", margin: "0 0 6px", fontSize: 12, alignItems: "center" }}>
                  {arr<string>(topCrossTheme.sources).map((s: string) => <Chip key={s}>{s}</Chip>)}
                  <span className="cc-muted">{topCrossTheme.combined_mention_count || 0}× combined</span>
                </div>
                <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>{(topCrossTheme.why || "").slice(0, 180)}</p>
              </div>
            )}
          </div>
          {(decisionsToDoc || churnSignals) && (
            <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", fontSize: 12 }}>
              {decisionsToDoc > 0 && <Chip tone="alert">{decisionsToDoc} decisions to document</Chip>}
              {churnSignals > 0 && <Chip tone="alert">{churnSignals} churn signals</Chip>}
            </div>
          )}
        </Card>
      )}

      <Card wide title="Top of the inbox" tag={comms?.updated_at ? <Tag>updated {rel(comms.updated_at, TODAY)}</Tag> : <Tag accent>no snapshot</Tag>}>
        {topUrgent || topNeedsReply ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {topUrgent && (
              <div>
                <Chip tone="alert">urgent</Chip>{" "}<Chip>{topUrgent.source}</Chip>
                <br /><strong>{topUrgent.from}</strong> · {(topUrgent.subject || "").slice(0, 80)}
                <br /><span className="cc-muted" style={{ fontSize: 12 }}>{(topUrgent.suggested_action || "").slice(0, 160)}</span>
              </div>
            )}
            {topNeedsReply && (
              <div>
                <Chip tone="primary">needs reply</Chip>{" "}<Chip>{topNeedsReply.source}</Chip>
                <br /><strong>{topNeedsReply.from}</strong> · {(topNeedsReply.subject || "").slice(0, 80)}
                <br /><span className="cc-muted" style={{ fontSize: 12 }}>{(topNeedsReply.suggested_action || "").slice(0, 160)}</span>
              </div>
            )}
          </div>
        ) : <Empty>No comms snapshot.</Empty>}
      </Card>

      <Card wide title="Latest video" tag={yt?.updated_at ? <Tag>updated {rel(yt.updated_at, TODAY)}</Tag> : <Tag accent>no snapshot</Tag>}>
        {recentVideo ? (() => {
          const views = Number(recentVideo.views) || 0;
          const likes = Number(recentVideo.likes) || 0;
          const eng = views > 0 ? Math.round((likes / views) * 10000) / 100 : null;
          const pct = topPerf?.vs_channel_avg_pct;
          const perfTone = pct == null ? undefined : pct > 20 ? "accent" : pct < -20 ? "alert" : "primary";
          const perfSign = pct > 0 ? "+" : "";
          const comments = ytTopComments.length > 0 ? ytTopComments : ytCommentsFallback;
          const isFallback = ytTopComments.length === 0 && ytCommentsFallback.length > 0;
          return (
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-start" }}>
              {recentVideo.thumbnail && (
                <a href={recentVideo.url} target="_blank" rel="noreferrer" style={{ flexShrink: 0, display: "block", width: 200, borderRadius: 8, overflow: "hidden", border: "1px solid #020309" }}>
                  <img src={recentVideo.thumbnail} alt="" style={{ width: "100%", display: "block" }} />
                </a>
              )}
              <div style={{ flex: 1, minWidth: 260 }}>
                <strong style={{ fontSize: 14, lineHeight: 1.3, display: "block", marginBottom: 6 }}>
                  <a className="cc-link" href={recentVideo.url} target="_blank" rel="noreferrer">{recentVideo.title}</a>
                </strong>
                <span className="cc-muted" style={{ fontSize: 12 }}>{rel(recentVideo.published_at, TODAY)}</span>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "10px 0" }}>
                  <Stat val={views.toLocaleString()} label="Views" />
                  <Stat val={likes.toLocaleString()} label="Likes" />
                  <Stat val={(Number(recentVideo.comments) || 0).toLocaleString()} label="Comments" />
                  {eng != null && <Stat val={`${eng}%`} label="Like rate" />}
                </div>
                {pct != null && (
                  <div style={{ marginBottom: 8, fontSize: 12 }}>
                    <Chip tone={perfTone as any}>{perfSign}{pct}% vs channel avg</Chip>
                  </div>
                )}
                {comments.length > 0 && (
                  <>
                    <div style={{ fontSize: 11, opacity: 0.65, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600, margin: "6px 0" }}>
                      {isFallback ? "Recent comments" : "Top comments"}
                    </div>
                    <ul className="cc-md-list" style={{ margin: 0, fontSize: 12 }}>
                      {comments.map((c: any, i: number) => (
                        <li key={i}><strong>{c.author || "—"}</strong>: {(c.text || c.snippet || c.comment || "").slice(0, 160)}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          );
        })() : <Empty>No YouTube snapshot.</Empty>}
      </Card>

      <Card wide title="Community pulse" tag={community?.updated_at ? <Tag>updated {rel(community.updated_at, TODAY)}</Tag> : <Tag accent>no snapshot</Tag>}>
        {synthesisParts.length > 0 ? (
          <p style={{ margin: 0, lineHeight: 1.55, fontSize: 13 }}>
            {synthesisParts.map((part, i) => (
              <span key={i} dangerouslySetInnerHTML={{ __html: part.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") + " " }} />
            ))}
          </p>
        ) : <Empty>No community snapshot.</Empty>}
      </Card>
    </>
  );
}

function Stat({ val, label }: { val: string; label: string }) {
  return (
    <div>
      <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1, fontFamily: "Space Grotesk" }}>{val}</div>
      <div style={{ fontSize: 10, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
    </div>
  );
}

// =====================================================================
// ENGINEERING (synthesis-style — placeholder per-profile aggregates)
// =====================================================================
export function ProfileEngineering({ data }: { data: ProfileBundle }) {
  return (
    <div className="cc-grid cc-grid-2">
      <Card title="Recent runs">
        <table className="cc-table">
          <thead><tr><th>Command</th><th>Status</th><th>Started</th></tr></thead>
          <tbody>
            {data.runs.map(r => (
              <tr key={r.id}>
                <td><strong>{r.label}</strong></td>
                <td><Chip tone={r.status === "success" ? "primary" : r.status === "running" ? "accent" : r.status === "error" ? "alert" : undefined}>{r.status}</Chip></td>
                <td>{rel(r.started_at, TODAY)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card title="Sub-schedules (this profile)">
        <ul className="cc-md-list">
          <li>morning-briefing</li>
          <li>community-digest</li>
          <li>youtube-ideation</li>
          <li>newsletter-ideation</li>
          <li>weekly-review</li>
          <li>linkedin-repurposing</li>
        </ul>
      </Card>
    </div>
  );
}

// =====================================================================
// YOUTUBE — full depth
// =====================================================================
export function ProfileYoutube({ data }: { data: ProfileBundle }) {
  const yt = data.youtube as any;
  if (!yt) return <Empty>No YouTube snapshot.</Empty>;
  const ch = yt.channel || {};
  const subsDeltaPct = ch.subscribers_delta_7d != null && ch.subscribers
    ? Math.round((ch.subscribers_delta_7d / Math.max(1, ch.subscribers - ch.subscribers_delta_7d)) * 100)
    : undefined;

  const latest = arr(yt.recent_videos)[0] as any;
  const perf = arr(yt.video_performance).find((p: any) =>
    (p.url && latest?.url && p.url === latest.url) ||
    (p.title && latest?.title && p.title === latest.title)
  ) as any;
  const allComments = arr(yt.recent_comments);
  const latestComments = (() => {
    if (!latest) return [];
    const filtered = allComments.filter((c: any) =>
      (c.video_url && c.video_url === latest.url) ||
      (c.video_title && c.video_title.toLowerCase() === latest.title?.toLowerCase())
    ).slice(0, 4);
    return filtered.length ? filtered : allComments.slice(0, 4);
  })();
  const commentsAreFallback = latest && arr(yt.recent_comments).length > 0 && !arr(yt.recent_comments).some((c: any) =>
    (c.video_url === latest.url) || (c.video_title?.toLowerCase() === latest.title?.toLowerCase())
  );

  return (
    <>
      <Card wide title="YouTube pulse" tag={<Tag>updated {rel(yt.updated_at, TODAY)}</Tag>}>
        <div className="cc-kpis" style={{ marginBottom: 0 }}>
          <KPI variant="primary" label="Subscribers" delta={subsDeltaPct}
            value={ch.subscribers?.toLocaleString() ?? "—"}
            foot={ch.subscribers_delta_7d != null ? `+${ch.subscribers_delta_7d.toLocaleString()} · 7d` : "channel total"} />
          <KPI label="Total views" value={ch.total_views?.toLocaleString() ?? "—"}
            foot={ch.views_delta_7d != null ? `+${ch.views_delta_7d.toLocaleString()} · 7d` : "lifetime"} />
          <KPI label="Videos" value={ch.video_count ?? "—"} foot="published" />
          <KPI label="Updated" value={rel(yt.updated_at, TODAY)} foot="last snapshot" />
        </div>
      </Card>

      {latest && (() => {
        const views = Number(latest.views) || 0;
        const likes = Number(latest.likes) || 0;
        const engagement = views > 0 ? Math.round((likes / views) * 10000) / 100 : null;
        const pct = perf?.vs_channel_avg_pct;
        const perfTone = pct == null ? undefined : pct > 20 ? "accent" : pct < -20 ? "alert" : "primary";
        const perfSign = pct > 0 ? "+" : "";
        return (
          <Card wide title="Latest upload" tag={<Tag>{rel(latest.published_at, TODAY)}</Tag>}>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
              {latest.thumbnail && (
                <a href={latest.url} target="_blank" rel="noreferrer" style={{ flexShrink: 0, display: "block", width: 240, borderRadius: 8, overflow: "hidden", border: "1px solid #020309" }}>
                  <img src={latest.thumbnail} alt="" style={{ width: "100%", display: "block" }} />
                </a>
              )}
              <div style={{ flex: 1, minWidth: 280 }}>
                <h2 style={{ margin: "0 0 8px", fontSize: 18, lineHeight: 1.25, fontFamily: "Space Grotesk" }}>
                  <a className="cc-link" href={latest.url} target="_blank" rel="noreferrer">{latest.title}</a>
                </h2>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", margin: "10px 0 12px" }}>
                  <BigStat val={views.toLocaleString()} label="Views" />
                  <BigStat val={likes.toLocaleString()} label="Likes" />
                  <BigStat val={(Number(latest.comments) || 0).toLocaleString()} label="Comments" />
                  {engagement != null && <BigStat val={`${engagement}%`} label="Like rate" />}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", fontSize: 12 }}>
                  {pct != null && <Chip tone={perfTone as any}>{perfSign}{pct}% vs channel avg</Chip>}
                  {perf?.reason_hypothesis && (
                    <span className="cc-muted">{perf.reason_hypothesis.slice(0, 200)}</span>
                  )}
                </div>
                {latestComments.length > 0 && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ fontSize: 11, opacity: 0.65, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600, marginBottom: 6 }}>
                      {commentsAreFallback ? "Recent comments (channel-wide)" : "Top comments on this video"}
                    </div>
                    <ul className="cc-md-list" style={{ margin: 0, fontSize: 12 }}>
                      {latestComments.map((c: any, i: number) => (
                        <li key={i}>
                          <strong>{c.author || "—"}</strong>
                          {c.video_title && commentsAreFallback && <span className="cc-muted"> on {c.video_title.slice(0, 40)}</span>}
                          : {(c.text || c.snippet || c.comment || "").slice(0, 200)}
                          {c.likes ? <span className="cc-muted"> · {c.likes} likes</span> : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })()}

      <Card wide title="Trending in your niche" tag={<Tag>{arr(yt.trending).length}</Tag>}>
        {arr(yt.trending).length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {arr(yt.trending).slice(0, 8).map((t: any, i: number) => {
              const vel = t.velocity ? String(t.velocity) : t.velocity_vph ? `${Math.round(Number(t.velocity_vph)).toLocaleString()} v/h` : t.breakout_score ? `breakout ${Math.round(Number(t.breakout_score))}` : "";
              return (
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
                      {vel && <Chip tone="primary">{vel}</Chip>}
                    </div>
                    <div className="cc-muted" style={{ fontSize: 11, marginBottom: 6 }}>
                      {t.channel || "—"} · {t.views?.toLocaleString?.() || t.views || "—"} views
                    </div>
                    {t.summary && <p style={{ margin: 0, fontSize: 12, lineHeight: 1.45, opacity: 0.8 }}>{t.summary.slice(0, 160)}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : <Empty>None.</Empty>}
      </Card>

      <Card wide title="Top questions in comments" tag={<Tag>{arr(yt.top_questions_in_comments).length}</Tag>}>
        {arr(yt.top_questions_in_comments).length > 0 ? (
          <table className="cc-table">
            <thead><tr><th>Question</th><th style={{ width: 70 }}>Asks</th><th style={{ width: 70 }}>Likes</th><th>From video</th></tr></thead>
            <tbody>
              {arr(yt.top_questions_in_comments).map((q: any, i: number) => (
                <tr key={i}>
                  <td><strong>{q.question}</strong></td>
                  <td>{q.ask_count || 1}×</td>
                  <td>{q.like_count || 0}</td>
                  <td>{q.video_url ? <a className="cc-link" href={q.video_url} target="_blank" rel="noreferrer">{(q.video_title || "").slice(0, 60)}</a> : (q.video_title || "")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <Empty>Not populated yet.</Empty>}
      </Card>

      <div className="cc-grid cc-grid-2">
        <Card title="Audience themes" tag={<Tag>{arr(yt.audience_themes).length}</Tag>}>
          {arr(yt.audience_themes).length > 0 ? (
            <ul className="cc-md-list" style={{ fontSize: 13 }}>
              {arr(yt.audience_themes).map((t: any, i: number) => (
                <li key={i}>
                  <strong>{t.theme}</strong>{" "}
                  <Chip>{t.mention_count || 0}×</Chip>{" "}
                  <Chip tone={t.sentiment === "positive" ? "primary" : t.sentiment === "negative" ? "alert" : "accent"}>{t.sentiment || "neutral"}</Chip>
                  {t.representative_comment && (
                    <div className="cc-muted" style={{ fontSize: 12, marginTop: 4 }}>"{t.representative_comment.slice(0, 160)}"</div>
                  )}
                </li>
              ))}
            </ul>
          ) : <Empty>None.</Empty>}
        </Card>

        <Card title="Performance vs channel avg" tag={<Tag>{arr(yt.video_performance).length}</Tag>}>
          {arr(yt.video_performance).length > 0 ? (
            <ul className="cc-md-list" style={{ fontSize: 13 }}>
              {arr(yt.video_performance).map((p: any, i: number) => {
                const tone = p.vs_channel_avg_pct == null ? undefined : p.vs_channel_avg_pct > 20 ? "primary" : p.vs_channel_avg_pct < -20 ? "alert" : "accent";
                const sign = p.vs_channel_avg_pct > 0 ? "+" : "";
                return (
                  <li key={i}>
                    {p.url ? <a className="cc-link" href={p.url} target="_blank" rel="noreferrer"><strong>{p.title}</strong></a> : <strong>{p.title}</strong>}
                    {" "}<Chip tone={tone as any}>{sign}{p.vs_channel_avg_pct || 0}%</Chip>
                    {p.reason_hypothesis && <div className="cc-muted" style={{ fontSize: 12, marginTop: 4 }}>{p.reason_hypothesis}</div>}
                  </li>
                );
              })}
            </ul>
          ) : <Empty>None.</Empty>}
        </Card>
      </div>

      <Card wide title="Recent videos" tag={<Tag>{arr(yt.recent_videos).length}</Tag>}>
        <table className="cc-table">
          <thead><tr><th>Video</th><th style={{ width: 90 }}>Views</th><th style={{ width: 70 }}>Likes</th><th style={{ width: 70 }}>💬</th><th style={{ width: 110 }}>Published</th></tr></thead>
          <tbody>
            {arr(yt.recent_videos).slice(0, 10).map((v: any, i: number) => (
              <tr key={i}>
                <td><a className="cc-link" href={v.url} target="_blank" rel="noreferrer">{v.title}</a></td>
                <td>{v.views?.toLocaleString() ?? "—"}</td>
                <td>{v.likes?.toLocaleString() ?? "—"}</td>
                <td>{v.comments ?? "—"}</td>
                <td>{rel(v.published_at, TODAY)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card wide title="Recent comments" tag={<Tag>{arr(yt.recent_comments).length}</Tag>}>
        {arr(yt.recent_comments).length > 0 ? (
          <ul className="cc-md-list" style={{ fontSize: 13 }}>
            {arr(yt.recent_comments).slice(0, 10).map((c: any, i: number) => (
              <li key={i}>
                <strong>{c.author || "—"}</strong>
                {c.video_title && <em> on {c.video_title.slice(0, 50)}</em>}
                : {(c.text || c.snippet || c.comment || "").slice(0, 200)}
                {c.likes ? <span className="cc-muted"> · {c.likes} likes</span> : null}
              </li>
            ))}
          </ul>
        ) : <Empty>None.</Empty>}
      </Card>
    </>
  );
}

function BigStat({ val, label }: { val: string; label: string }) {
  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1, fontFamily: "Space Grotesk" }}>{val}</div>
      <div style={{ fontSize: 11, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
    </div>
  );
}

// =====================================================================
// COMMUNITY — full depth
// =====================================================================
export function ProfileCommunity({ data }: { data: ProfileBundle }) {
  const c = data.community as any;
  if (!c) return <Empty>No community snapshot.</Empty>;

  const needsReplyCount = arr(c.needs_my_reply).length;
  const stuckCount = arr(c.stuck_members).length;
  const mentionsCount = arr(c.mentions).length;
  const painCount = arr(c.pain_points).length;
  const themesCount = arr(c.themes).length;
  const topTheme = arr(c.themes).sort((a: any, b: any) => (b.frequency_4w || 0) - (a.frequency_4w || 0))[0] as any;
  const topPower = arr(c.power_users).sort((a: any, b: any) => (b.contribution_count_4w || 0) - (a.contribution_count_4w || 0))[0] as any;

  return (
    <>
      <Card wide title="Community pulse" tag={<Tag>updated {rel(c.updated_at, TODAY)}</Tag>}>
        <div className="cc-kpis" style={{ marginBottom: 0 }}>
          <KPI variant="primary" label="Members"
            value={(c.stats?.total_members ?? 0).toLocaleString()}
            foot={c.stats?.active_today != null ? `${c.stats.active_today} active today` : "in the community"} />
          <KPI variant={needsReplyCount ? "alert" : "default"} label="Needs my reply"
            value={needsReplyCount} foot={`${mentionsCount} mentions tracked`} />
          <KPI variant={stuckCount ? "alert" : "default"} label="Stuck members"
            value={stuckCount} foot={`${painCount} pain points open`} />
          <KPI label="Top theme · 4w"
            value={<span style={{ fontSize: 15, lineHeight: 1.2 }}>{topTheme ? topTheme.name.slice(0, 42) : "—"}</span>}
            foot={topTheme ? `${topTheme.frequency_4w || 0}× · ${topTheme.trend || "steady"}` : `${themesCount} themes tracked`} />
        </div>
        {topPower && (
          <div style={{ marginTop: 12, fontSize: 12, opacity: 0.75 }}>
            ⭐ <strong>{topPower.name}</strong> is your top contributor this month with {topPower.contribution_count_4w || 0} contributions.
          </div>
        )}
      </Card>

      <Card wide title="Needs my reply" tag={<Tag accent>{arr(c.needs_my_reply).length}</Tag>}>
        {arr(c.needs_my_reply).length > 0 ? (
          <table className="cc-table">
            <thead><tr><th style={{ width: 90 }}>Urgency</th><th style={{ width: 140 }}>From</th><th>Context</th><th>Suggested angle</th></tr></thead>
            <tbody>
              {arr(c.needs_my_reply).map((r: any, i: number) => (
                <tr key={i}>
                  <td><Chip tone={r.urgency === "high" ? "alert" : r.urgency === "medium" ? "primary" : undefined}>{r.urgency || "—"}</Chip></td>
                  <td><strong>{r.from || "—"}</strong></td>
                  <td>{r.url ? <a className="cc-link" href={r.url} target="_blank" rel="noreferrer">{(r.context || "").slice(0, 180)}</a> : (r.context || "").slice(0, 180)}</td>
                  <td><span className="cc-muted">{(r.suggested_response_angle || "").slice(0, 140)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <Empty>Nothing flagged for personal reply.</Empty>}
      </Card>

      <div className="cc-grid cc-grid-2">
        <Card title="Recent posts" tag={<Tag>{arr(c.recent_posts).length}</Tag>}>
          <table className="cc-table">
            <thead><tr><th>Post</th><th style={{ width: 90 }}>Author</th><th style={{ width: 50 }}>💬</th><th style={{ width: 50 }}>❤️</th></tr></thead>
            <tbody>
              {arr(c.recent_posts).slice(0, 10).map((p: any, i: number) => (
                <tr key={i}>
                  <td><a className="cc-link" href={p.url} target="_blank" rel="noreferrer">{p.title || "(untitled)"}</a></td>
                  <td>{p.author || "—"}</td>
                  <td>{p.comments ?? "—"}</td>
                  <td>{p.likes ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="Recent comments" tag={<Tag>{arr(c.recent_comments).length}</Tag>}>
          {arr(c.recent_comments).length > 0 ? (
            <ul className="cc-md-list" style={{ fontSize: 12 }}>
              {arr(c.recent_comments).slice(0, 10).map((cm: any, i: number) => (
                <li key={i}>
                  <strong>{cm.author || "—"}</strong> on <em>{cm.post_title}</em>: {(cm.snippet || cm.text || "").slice(0, 160)}
                </li>
              ))}
            </ul>
          ) : <Empty>None.</Empty>}
        </Card>

        <Card title={`Mentions of you`} tag={<Tag>{arr(c.mentions).length}</Tag>}>
          {arr(c.mentions).length > 0 ? (
            <ul className="cc-md-list" style={{ fontSize: 12 }}>
              {arr(c.mentions).slice(0, 10).map((m: any, i: number) => (
                <li key={i}>
                  <strong>{m.author || "—"}</strong>: {(m.context || "").slice(0, 160)} <span className="cc-muted">{rel(m.posted_at, TODAY)}</span>
                </li>
              ))}
            </ul>
          ) : <Empty>None.</Empty>}
        </Card>

        <Card title="Replies to me" tag={<Tag>{arr(c.replies_to_me).length}</Tag>}>
          {arr(c.replies_to_me).length > 0 ? (
            <ul className="cc-md-list" style={{ fontSize: 12 }}>
              {arr(c.replies_to_me).slice(0, 10).map((r: any, i: number) => (
                <li key={i}>
                  <strong>{r.author || "—"}</strong> on <em>{r.post_title}</em>: {(r.snippet || "").slice(0, 140)}
                </li>
              ))}
            </ul>
          ) : <Empty>None.</Empty>}
        </Card>
      </div>

      <div className="cc-grid cc-grid-2">
        <Card title="Recurring themes" tag={<Tag>{arr(c.themes).length} · last 4w</Tag>}>
          {arr(c.themes).length > 0 ? (
            <ul className="cc-md-list" style={{ fontSize: 13 }}>
              {arr(c.themes).map((t: any, i: number) => (
                <li key={i}>
                  <strong>{t.name}</strong>{" "}
                  <Chip tone={t.trend === "rising" ? "primary" : t.trend === "fading" ? "alert" : "accent"}>{t.trend || "steady"}</Chip>{" "}
                  <Chip>{t.frequency_4w || 0}×</Chip>{" "}
                  <Chip tone={t.sentiment === "positive" ? "primary" : t.sentiment === "negative" ? "alert" : undefined}>{t.sentiment || "neutral"}</Chip>
                  {arr<string>(t.sample_quotes)[0] && (
                    <div className="cc-muted" style={{ fontSize: 12, marginTop: 4 }}>"{arr<string>(t.sample_quotes)[0].slice(0, 160)}"</div>
                  )}
                </li>
              ))}
            </ul>
          ) : <Empty>None.</Empty>}
        </Card>

        <Card title="Pain points" tag={<Tag accent>{arr(c.pain_points).length}</Tag>}>
          {arr(c.pain_points).length > 0 ? (
            <ul className="cc-md-list" style={{ fontSize: 13 }}>
              {arr(c.pain_points).map((p: any, i: number) => (
                <li key={i}>
                  <strong>{p.name}</strong>{" "}
                  <Chip tone={p.severity === "high" ? "alert" : p.severity === "low" ? "primary" : "accent"}>{p.severity || "medium"}</Chip>{" "}
                  <Chip>{p.frequency || 0}×</Chip>
                  {arr<string>(p.examples)[0] && (
                    <div className="cc-muted" style={{ fontSize: 12, marginTop: 4 }}>"{arr<string>(p.examples)[0].slice(0, 160)}"</div>
                  )}
                </li>
              ))}
            </ul>
          ) : <Empty>None.</Empty>}
        </Card>
      </div>

      <div className="cc-grid cc-grid-2">
        <Card title="Stuck members" tag={<Tag accent>{arr(c.stuck_members).length}</Tag>}>
          {arr(c.stuck_members).length > 0 ? (
            <ul className="cc-md-list" style={{ fontSize: 13 }}>
              {arr(c.stuck_members).map((m: any, i: number) => (
                <li key={i}>
                  <strong>{m.url ? <a className="cc-link" href={m.url} target="_blank" rel="noreferrer">{m.name}</a> : m.name}</strong>{" "}
                  <Chip tone="alert">{m.days_stuck || "?"}d stuck</Chip>
                  <div className="cc-muted" style={{ fontSize: 12, marginTop: 4 }}>
                    {(m.reason || "").slice(0, 140)}
                    {m.last_unanswered_question && ` · "${m.last_unanswered_question.slice(0, 120)}"`}
                  </div>
                </li>
              ))}
            </ul>
          ) : <Empty>No one stuck. 🎉</Empty>}
        </Card>

        <Card title="Power users" tag={<Tag>{arr(c.power_users).length}</Tag>}>
          {arr(c.power_users).length > 0 ? (
            <ul className="cc-md-list" style={{ fontSize: 13 }}>
              {arr(c.power_users).map((u: any, i: number) => (
                <li key={i}>
                  <strong>{u.url ? <a className="cc-link" href={u.url} target="_blank" rel="noreferrer">{u.name}</a> : u.name}</strong>{" "}
                  <Chip tone="primary">{u.contribution_count_4w || 0} contributions</Chip>
                  {u.notes && <div className="cc-muted" style={{ fontSize: 12, marginTop: 4 }}>{u.notes.slice(0, 140)}</div>}
                </li>
              ))}
            </ul>
          ) : <Empty>None.</Empty>}
        </Card>
      </div>

      <Card wide title="Content gaps" tag={<Tag>{arr(c.content_gaps).length}</Tag>}>
        {arr(c.content_gaps).length > 0 ? (
          <table className="cc-table">
            <thead><tr><th>Question</th><th style={{ width: 70 }}>Asks</th><th style={{ width: 90 }}>Format</th><th style={{ width: 80 }}>Source</th></tr></thead>
            <tbody>
              {arr(c.content_gaps).map((g: any, i: number) => (
                <tr key={i}>
                  <td><strong>{g.question}</strong></td>
                  <td>{g.ask_count || 0}×</td>
                  <td><Chip>{g.suggested_format || "—"}</Chip></td>
                  <td>{g.best_source_post_url ? <a className="cc-link" href={g.best_source_post_url} target="_blank" rel="noreferrer">link</a> : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <Empty>None.</Empty>}
      </Card>

      <Card wide title="DMs" tag={<Tag>{arr(c.dms).length}</Tag>}>
        {arr(c.dms).length > 0 ? (
          <table className="cc-table">
            <thead><tr><th style={{ width: 180 }}>From</th><th>Message</th><th style={{ width: 110 }}>When</th></tr></thead>
            <tbody>
              {arr(c.dms).slice(0, 15).map((d: any, i: number) => (
                <tr key={i}>
                  <td>
                    <strong>{d.from || "—"}</strong>{d.unread && <> <Chip tone="alert">new</Chip></>}
                  </td>
                  <td>{(d.snippet || "").slice(0, 200)}</td>
                  <td>{rel(d.received_at, TODAY)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <Empty>No DMs.</Empty>}
      </Card>
    </>
  );
}

// =====================================================================
// MEETINGS — full depth
// =====================================================================
export function ProfileMeetings({ data }: { data: ProfileBundle }) {
  const m = data.meetings as any;
  if (!m) return <Empty>No meetings snapshot.</Empty>;

  const r = m.rollup || {};
  const openItems = arr(m.action_items).filter((a: any) => a.status !== "done").length;
  const overdueItems = arr(m.action_items).filter((a: any) => a.status === "overdue").length;

  return (
    <>
      <Card wide title="Meeting intelligence" tag={<Tag>updated {rel(m.updated_at, TODAY)}</Tag>}>
        <div className="cc-kpis" style={{ marginBottom: 0 }}>
          <KPI variant="primary" label="Meetings · 7d" value={r.meetings_count_7d ?? "—"}
            foot={r.total_hours_7d != null ? `${r.total_hours_7d}h total` : "this week"} />
          <KPI label="Talk-time ratio"
            value={r.avg_talk_time_ratio != null ? `${r.avg_talk_time_ratio}%` : "—"}
            foot="your share (target ~40-50)" />
          <KPI label="Questions asked" value={r.questions_asked_7d ?? "—"} foot="consultative signal" />
          <KPI variant={openItems ? "alert" : "default"} label="Open action items"
            value={openItems} foot={`${overdueItems} overdue`} />
        </div>
      </Card>

      <Card wide title="Client signals" tag={<Tag>{arr(m.client_signals).length}</Tag>}>
        {arr(m.client_signals).length > 0 ? (
          <table className="cc-table">
            <thead><tr><th style={{ width: 160 }}>Company</th><th style={{ width: 140 }}>Person</th><th style={{ width: 80 }}>Stage</th><th style={{ width: 100 }}>Last call</th><th>Next action</th></tr></thead>
            <tbody>
              {arr(m.client_signals).map((c: any, i: number) => (
                <tr key={i}>
                  <td><strong>{c.company || "—"}</strong></td>
                  <td>{c.person || "—"}</td>
                  <td><Chip tone={c.stage === "hot" ? "alert" : c.stage === "warm" ? "primary" : undefined}>{c.stage || "—"}</Chip></td>
                  <td>{rel(c.last_meeting_iso, TODAY)}</td>
                  <td>
                    {(c.next_action || "").slice(0, 160)}
                    {c.sentiment_trend && <div className="cc-muted" style={{ fontSize: 12 }}>{c.sentiment_trend.slice(0, 140)}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <Empty>No client signals yet.</Empty>}
      </Card>

      <Card wide title="Recent meetings" tag={<Tag>{arr(m.recent).length}</Tag>}>
        {arr(m.recent).length > 0 ? (
          <table className="cc-table">
            <thead><tr><th>Meeting</th><th style={{ width: 90 }}>Type</th><th style={{ width: 90 }}>Duration</th><th style={{ width: 200 }}>Attendees</th><th style={{ width: 100 }}>When</th></tr></thead>
            <tbody>
              {arr(m.recent).map((mt: any, i: number) => (
                <tr key={i}>
                  <td>{mt.url ? <a className="cc-link" href={mt.url} target="_blank" rel="noreferrer">{mt.title}</a> : mt.title}</td>
                  <td><Chip>{mt.type || "—"}</Chip></td>
                  <td>{mt.duration_minutes || "—"}m</td>
                  <td><span className="cc-muted" style={{ fontSize: 12 }}>{arr<string>(mt.attendees).slice(0, 3).join(", ")}{arr(mt.attendees).length > 3 ? ` +${arr(mt.attendees).length - 3}` : ""}</span></td>
                  <td>{rel(mt.date_iso, TODAY)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <Empty>No recent meetings.</Empty>}
      </Card>

      <div className="cc-grid cc-grid-2">
        <Card title="Action items" tag={<Tag>{arr(m.action_items).length}</Tag>}>
          {arr(m.action_items).length > 0 ? (
            <ul className="cc-md-list" style={{ fontSize: 13 }}>
              {arr(m.action_items).map((a: any, i: number) => (
                <li key={i}>
                  {a.status === "overdue" && <><Chip tone="alert">overdue</Chip>{" "}</>}
                  {a.in_task_list ? <Chip tone="accent">in tasks</Chip> : <Chip tone="alert">not in tasks</Chip>}{" "}
                  <strong>{a.text}</strong>
                  <div className="cc-muted" style={{ fontSize: 12, marginTop: 4 }}>
                    {a.owner || "—"} · {a.source_meeting_url ? <a className="cc-link" href={a.source_meeting_url} target="_blank" rel="noreferrer">{a.source_meeting_title || "meeting"}</a> : (a.source_meeting_title || "")}
                  </div>
                </li>
              ))}
            </ul>
          ) : <Empty>None.</Empty>}
        </Card>

        <Card title="Decisions" tag={<Tag>{arr(m.decisions).length}</Tag>}>
          {arr(m.decisions).length > 0 ? (
            <ul className="cc-md-list" style={{ fontSize: 13 }}>
              {arr(m.decisions).map((d: any, i: number) => (
                <li key={i}>
                  {d.documented ? <Chip tone="accent">documented</Chip> : <Chip tone="alert">not documented</Chip>}{" "}
                  <strong>{d.decision}</strong>
                  <div className="cc-muted" style={{ fontSize: 12, marginTop: 4 }}>
                    {(d.context || "").slice(0, 120)}
                    {d.source_meeting_url && <> · <a className="cc-link" href={d.source_meeting_url} target="_blank" rel="noreferrer">{d.source_meeting_title || "meeting"}</a></>}
                  </div>
                </li>
              ))}
            </ul>
          ) : <Empty>None.</Empty>}
        </Card>
      </div>

      <div className="cc-grid cc-grid-2">
        <Card title="Themes in calls" tag={<Tag>{arr(m.themes_in_calls).length}</Tag>}>
          {arr(m.themes_in_calls).length > 0 ? (
            <ul className="cc-md-list" style={{ fontSize: 13 }}>
              {arr(m.themes_in_calls).map((t: any, i: number) => (
                <li key={i}>
                  <strong>{t.theme}</strong>{" "}
                  <Chip>{t.mention_count || 0}× across calls</Chip>
                  {t.representative_quote && (
                    <div className="cc-muted" style={{ fontSize: 12, marginTop: 4 }}>"{t.representative_quote.slice(0, 160)}"</div>
                  )}
                </li>
              ))}
            </ul>
          ) : <Empty>None.</Empty>}
        </Card>

        <Card title="Prospect language" tag={<Tag>{arr(m.prospect_language).length}</Tag>}>
          {arr(m.prospect_language).length > 0 ? (
            <ul className="cc-md-list" style={{ fontSize: 13 }}>
              {arr(m.prospect_language).map((p: any, i: number) => (
                <li key={i}>
                  "{(p.phrase || "").slice(0, 140)}"
                  {p.source_meeting_url && <> · <a className="cc-link" href={p.source_meeting_url} target="_blank" rel="noreferrer">source</a></>}
                  {p.context && <div className="cc-muted" style={{ fontSize: 12, marginTop: 4 }}>{p.context.slice(0, 140)}</div>}
                </li>
              ))}
            </ul>
          ) : <Empty>None.</Empty>}
        </Card>
      </div>
    </>
  );
}

// =====================================================================
// TASKS
// =====================================================================
export function ProfileTasks({ data }: { data: ProfileBundle }) {
  const meetings = data.meetings as any;
  const intel = data.intelligence as any;
  const today = TODAY;
  const nameLower = data.name.toLowerCase();

  // Owned action items (already in data.tasks via owner mapping)
  const tasks = data.tasks ?? [];
  const overdue = tasks.filter(t => t.due && new Date(t.due) < today);
  const highPriority = tasks.filter(t => t.priority === "high");

  // Mentions: any action item / decision text that references this profile
  const meetingActions = arr<any>(meetings?.action_items);
  const decisions = arr<any>(meetings?.decisions);
  const unified = arr<any>(intel?.unified_action_items);

  const mentions = [
    ...meetingActions.filter(a => (a.owner || "").toLowerCase().split(" ")[0] !== nameLower
                                  && (a.text || "").toLowerCase().includes(nameLower))
      .map(a => ({ kind: "Action mentions you", text: a.text, owner: a.owner, when: a.date_iso, url: a.source_meeting_url })),
    ...decisions.filter(d => (d.decision || "").toLowerCase().includes(nameLower)
                          || (d.context || "").toLowerCase().includes(nameLower))
      .map(d => ({ kind: "Decision", text: d.decision, owner: d.source_meeting_title, when: d.date_iso, url: d.source_meeting_url })),
  ];

  // Unattributed high-urgency from intelligence (potential to claim)
  const unattributedUrgent = unified
    .filter(a => (a.urgency || "").toLowerCase() === "high")
    .slice(0, 6);

  return (
    <>
      <div className="cc-kpis">
        <KPI variant="primary" label="Owned" value={tasks.length} foot="action items assigned" />
        <KPI variant={overdue.length ? "alert" : "default"} label="Overdue" value={overdue.length} foot={overdue.length ? "past due today" : "—"} />
        <KPI label="High priority" value={highPriority.length} foot="needs attention" />
        <KPI label="Mentions" value={mentions.length} foot="referenced in meetings" />
      </div>

      <Card wide title="Owned action items" tag={<Tag>{tasks.length}</Tag>}>
        {tasks.length ? (
          <table className="cc-table cc-table-tasks">
            <thead><tr><th>Due</th><th>Priority</th><th>Task</th></tr></thead>
            <tbody>
              {tasks.map((t, i) => (
                <tr key={i}>
                  <td>{t.due ? <Chip tone="date">{t.due}</Chip> : <span className="cc-muted">—</span>}</td>
                  <td>{t.priority ? <Chip tone={t.priority === "high" ? "alert" : t.priority === "med" ? "accent" : "primary"}>{t.priority}</Chip> : <span className="cc-muted">—</span>}</td>
                  <td>{t.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <Empty>No action items assigned to {data.name} in the latest meetings snapshot.</Empty>}
      </Card>

      <Card wide title="Where you're mentioned" tag={<Tag>{mentions.length}</Tag>}>
        {mentions.length ? (
          <table className="cc-table">
            <thead><tr><th style={{ width: 160 }}>Kind</th><th style={{ width: 100 }}>When</th><th>Reference</th><th style={{ width: 180 }}>Context</th></tr></thead>
            <tbody>
              {mentions.slice(0, 10).map((m, i) => (
                <tr key={i}>
                  <td><Chip tone={m.kind === "Decision" ? "primary" : "accent"}>{m.kind}</Chip></td>
                  <td style={{ fontSize: 12 }}>{(m.when || "").slice(0, 10)}</td>
                  <td style={{ fontSize: 13 }}>
                    {m.url ? <a className="cc-link" href={m.url} target="_blank" rel="noreferrer">{m.text}</a> : m.text}
                  </td>
                  <td style={{ fontSize: 12, opacity: 0.7 }}>{m.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <Empty>No mentions of {data.name} in meeting decisions or action items.</Empty>}
      </Card>

      {unattributedUrgent.length > 0 && (
        <Card wide title="Unowned high-urgency action items" tag={<Tag>candidates to claim</Tag>}>
          <ul className="cc-md-list">
            {unattributedUrgent.map((a, i) => (
              <li key={i}>
                <strong style={{ fontSize: 13 }}>{a.text}</strong>
                <div style={{ fontSize: 11, opacity: 0.65, marginTop: 2 }}>
                  {a.source}{a.due_iso ? ` · due ${a.due_iso.slice(0, 10)}` : ""}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}

// =====================================================================
// RUNS
// =====================================================================
export function ProfileRuns({ data: _data }: { data: ProfileBundle }) {
  return <RunsTableClient />;
}
