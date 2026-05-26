"use client";

import { useEffect, useRef, useState } from "react";
import { Card, Chip, Empty, Tag } from "@/components/Card";
import { startRun } from "@/lib/client/runs-store";

interface SkillRow {
  name: string;
  description?: string;
  snapshot?: string;
  profile?: string;
  mcp_servers?: string[];
}

export function SkillsClient() {
  const [skills, setSkills] = useState<SkillRow[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const refresh = async () => {
    const res = await fetch("/api/skills", { cache: "no-store" });
    const data = await res.json();
    setSkills(data.skills || []);
  };
  useEffect(() => { void refresh(); }, []);

  const onUpload = async (file: File) => {
    setUploading(true);
    setErr(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/skills/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `upload failed: ${res.status}`);
      }
      await refresh();
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const onDelete = async (name: string) => {
    if (!confirm(`Delete skill "${name}"?`)) return;
    await fetch(`/api/skills/${encodeURIComponent(name)}`, { method: "DELETE" });
    await refresh();
  };

  return (
    <Card wide title="Installed skills" tag={<Tag>{skills?.length ?? 0}</Tag>}>
      {skills == null ? (
        <p style={{ opacity: 0.6 }}>Loading…</p>
      ) : skills.length === 0 ? (
        <Empty>No skills installed. Upload a .zip below.</Empty>
      ) : (
        <table className="cc-table">
          <thead><tr><th>Skill</th><th>Snapshot</th><th>Profile</th><th>MCPs</th><th>Actions</th></tr></thead>
          <tbody>
            {skills.map(s => (
              <tr key={s.name}>
                <td><strong className="cc-code">{s.name}</strong>{s.description ? <div style={{ fontSize: 11, opacity: 0.6 }}>{s.description}</div> : null}</td>
                <td>{s.snapshot ? <Chip>{s.snapshot}</Chip> : <span style={{ opacity: 0.4 }}>—</span>}</td>
                <td>{s.profile || <span style={{ opacity: 0.4 }}>—</span>}</td>
                <td style={{ fontSize: 11 }}>{s.mcp_servers?.join(", ") || <span style={{ opacity: 0.4 }}>—</span>}</td>
                <td>
                  <a className="cc-link" onClick={() => startRun(s.name, s.profile, s.snapshot)} style={{ cursor: "pointer" }}>Run</a>
                  {" · "}
                  <a className="cc-link" onClick={() => onDelete(s.name)} style={{ cursor: "pointer" }}>Delete</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: 16, display: "flex", gap: 10, alignItems: "center" }}>
        <input
          ref={fileInput}
          type="file"
          accept=".zip"
          style={{ display: "none" }}
          onChange={e => { const f = e.target.files?.[0]; if (f) void onUpload(f); }}
        />
        <button
          className="cc-btn cc-btn-primary"
          disabled={uploading}
          onClick={() => fileInput.current?.click()}
        >
          <span className="cc-btn-ico">+</span>
          <span>{uploading ? "Uploading…" : "Upload skill (.zip)"}</span>
        </button>
        {err && <span style={{ color: "var(--alert)", fontSize: 12 }}>{err}</span>}
      </div>
    </Card>
  );
}
