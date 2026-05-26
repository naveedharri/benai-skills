/* eslint-disable */
/**
 * Command-Center Dashboard — shared rendering module (CustomJS).
 * Installer substitutes values inside CONFIG. Do NOT edit code outside this.constructor.CONFIG
 * unless you know what you're doing; the renderer expects every config key.
 *
 * customJS class: `dashboard` (filename = class name).
 * Each dashboard .md does:
 *   const { dashboard } = customJS;
 *   await dashboard.render(dv, { scope: "team" | "profile" | "overview", name: "Alex" });
 */


class dashboard {

  // ==================================================================
  // this.constructor.CONFIG  — installer substitutes the __PLACEHOLDER__ values
  // ==================================================================
  static CONFIG = {
  ORG_NAME:               "__ORG_NAME__",
  BRAND_LABEL:            "__BRAND_LABEL__",
  BRAND_SUB:              "__BRAND_SUB__",
  BRAND_MARK_PATH:        "__BRAND_MARK_PATH__",        // empty string to hide
  PROFILES:               __PROFILES_JSON__,            // ["Alex","Sam"]
  DEFAULT_PROFILE:        "__DEFAULT_PROFILE__",
  PROFILE_FOLDER_PATTERN: "__PROFILE_FOLDER_PATTERN__", // e.g. "Team/{ORG}/Profiles/{name}"
  DAILY_SUBPATH:          "__DAILY_SUBPATH__",          // e.g. "Daily" — joined to profile folder
  TASKS_SUBPATH:          "__TASKS_SUBPATH__",          // e.g. "task-list" or "" to disable
  SNAPSHOTS_SUBPATH:      "__SNAPSHOTS_SUBPATH__",      // e.g. "snapshots"
  ROOT_DAILY_PATH:        "__ROOT_DAILY_PATH__",        // e.g. "Daily"
  OVERVIEW_FOLDERS:       __OVERVIEW_FOLDERS_JSON__,    // [["Projects/", "what it is", "Projects/CLAUDE"], ...]
  // Per-scope button registries. Each entry: { key, label, icon (emoji), cmd? OR prompt? }
  //   cmd:    Obsidian command id (e.g. "app:reload" or "obsidian-shellcommands:shell-command-<alias>")
  //   prompt: Claude prompt string. Installer registers a shell-commands alias and wires the cmd.
  BUTTONS: __BUTTONS_JSON__,
  // Optional custom Claude-prompt actions wired to the in-app prompt-runner UI
  // (these are NOT the same as BUTTONS — these power the "Run prompt" sheet).
  CLAUDE_PROMPTS:    __CLAUDE_PROMPTS_JSON__,
  // Vault Overview optional content (all default empty — fill in installer)
  SKILLS_FOLDER:     "__SKILLS_FOLDER__",            // e.g. "Plugins/skills" — empty hides Skills section
  SKILL_GROUPS:      __SKILL_GROUPS_JSON__,         // {"Group": ["skill-name", ...]}
  PROJECT_CATEGORIES:__PROJECT_CATEGORIES_JSON__,  // ["Agency", "Content", ...] — empty hides Projects section
  CONNECTORS:        __CONNECTORS_JSON__,           // [["MCP name", "what it does"], ...]
  CHEATSHEET:        __CHEATSHEET_JSON__,           // [["label", "path or pattern"], ...]
  };

  // ===================================================================
  // this.constructor.CONFIG-DRIVEN PATH HELPERS
  // ===================================================================
  cfg() { return this.constructor.CONFIG; }
  profilePath(name) {
    return this.constructor.CONFIG.PROFILE_FOLDER_PATTERN
      .replace("{ORG}", this.constructor.CONFIG.ORG_NAME)
      .replace("{name}", name);
  }
  profileDailyPath(name)     { return this.constructor.CONFIG.DAILY_SUBPATH     ? `${this.profilePath(name)}/${this.constructor.CONFIG.DAILY_SUBPATH}` : ""; }
  profileTasksPath(name)     { return this.constructor.CONFIG.TASKS_SUBPATH     ? `${this.profilePath(name)}/${this.constructor.CONFIG.TASKS_SUBPATH}` : ""; }
  profileSnapshotsPath(name) { return this.constructor.CONFIG.SNAPSHOTS_SUBPATH ? `${this.profilePath(name)}/${this.constructor.CONFIG.SNAPSHOTS_SUBPATH}` : ""; }
  profileRunsPath(name)      { return `${this.profilePath(name)}/runs.json`; }


  // ===================================================================
  // ENTRY
  // ===================================================================
  async render(dv, opts = {}) {
    const scope = opts.scope || "profile";
    const name  = opts.name  || this.constructor.CONFIG.DEFAULT_PROFILE;

    // Mount loading shell immediately so the canvas pre-load overlay
    // can hand off seamlessly to the JS loader.
    const root = dv.el("div", "", { cls: "cc-root cc-loading" });
    root.innerHTML = `
      <div class="cc-loader-shell">
        <div class="cc-loader-spinner"></div>
        <div class="cc-loader-text">Loading your agentic OS…</div>
      </div>`;

    try {
      // Load Frappe Charts in parallel with data queries
      const frappeReady = this.ensureFrappe();

      // Build dashboard
      let html;
      if (scope === "team")         html = await this.buildTeamHTML(dv);
      else if (scope === "profile") html = await this.buildProfileHTML(dv, name);
      else if (scope === "overview")html = await this.buildOverviewHTML(dv);
      else throw new Error(`Unknown scope: ${scope}`);

      await frappeReady;
      root.innerHTML = html;
      root.classList.remove("cc-loading");
      this.wire(root);
      this.mountCharts(root);
    } catch (err) {
      console.error("[dashboard] render failed:", err);
      root.classList.remove("cc-loading");
      root.innerHTML = `
        <div style="padding:48px;font-family:'Space Grotesk',sans-serif;">
          <h2 style="margin:0 0 12px;color:#020309;">Dashboard error</h2>
          <p style="color:#020309;opacity:0.7;margin:0 0 16px;font-size:14px;">Something broke while rendering. Open the developer console (Cmd+Opt+I) for the full trace.</p>
          <pre style="background:#FAF3E3;border:2px solid #020309;border-radius:8px;padding:14px;font-size:12px;color:#020309;overflow:auto;white-space:pre-wrap;">${this.esc(err && err.stack || String(err))}</pre>
        </div>`;
    }
  }

  /** Lazy-load Frappe Charts (≈67KB) once per session. */
  async ensureFrappe() {
    if (window.frappe?.Chart) return window.frappe;
    if (window.__ccFrappeLoading) return window.__ccFrappeLoading;
    window.__ccFrappeLoading = (async () => {
      try {
        const code = await app.vault.adapter.read("Dashboard/lib/frappe-charts.min.js");
        new Function(code).call(window);
      } catch (e) {
        console.warn("[dashboard] Failed to load Frappe Charts:", e);
      }
      return window.frappe;
    })();
    return window.__ccFrappeLoading;
  }

  /** Find every [data-chart] element and instantiate the right Frappe chart. */
  mountCharts(root) {
    if (!window.frappe?.Chart) return;
    const BRAND = {
      dark: "#020309", canvas: "#FAF3E3", surface: "#FFFFFF",
      neutral: "#E5F5F9", primary: "#D2ECD0", accent: "#FDEEC4",
      alert: "#F3C1C0", green2: "#7FBE7C",
    };
    root.querySelectorAll("[data-chart]").forEach(el => {
      const kind = el.dataset.chart;
      let payload;
      try { payload = JSON.parse(el.dataset.payload || "{}"); } catch { payload = {}; }
      try {
        if (kind === "bar") {
          new window.frappe.Chart(el, {
            type: "bar",
            data: { labels: payload.labels, datasets: payload.datasets || [{ name: payload.name || "Files", values: payload.values }] },
            colors: payload.colors || [BRAND.dark],
            height: payload.height || 220,
            axisOptions: { xAxisMode: "tick", yAxisMode: "tick" },
            barOptions: { spaceRatio: 0.4, stacked: payload.stacked ? 1 : 0 },
            truncateLegends: true,
            animate: false,
          });
        } else if (kind === "line") {
          new window.frappe.Chart(el, {
            type: "line",
            data: { labels: payload.labels, datasets: payload.datasets || [{ name: payload.name || "Series", values: payload.values }] },
            colors: payload.colors || [BRAND.dark, BRAND.green2],
            height: payload.height || 220,
            lineOptions: { regionFill: 1, hideDots: 0, dotSize: 4, spline: payload.spline ? 1 : 0 },
            axisOptions: { xAxisMode: "tick" },
            animate: false,
          });
        } else if (kind === "sparkline") {
          new window.frappe.Chart(el, {
            type: "line",
            data: { labels: (payload.values || []).map(() => ""), datasets: [{ name: "", values: payload.values }] },
            colors: [payload.color || BRAND.dark],
            height: 70,
            lineOptions: { hideDots: 1, regionFill: 1, spline: 1 },
            axisOptions: { xAxisMode: "tick", yAxisMode: "tick" },
            animate: false,
          });
        } else if (kind === "heatmap") {
          new window.frappe.Chart(el, {
            type: "heatmap",
            data: { dataPoints: payload.dataPoints, start: new Date(payload.start), end: new Date(payload.end) },
            countLabel: payload.countLabel || "edits",
            colors: [BRAND.accent, BRAND.primary, BRAND.green2, BRAND.dark],
            discreteDomains: 0,
          });
        } else if (kind === "donut") {
          // Frappe pie chart with custom palette → reads as a donut/ring
          new window.frappe.Chart(el, {
            type: "donut",
            data: {
              labels: payload.labels || ["Done", "Remaining"],
              datasets: [{ values: payload.values }]
            },
            colors: payload.colors || [BRAND.dark, "rgba(2,3,9,0.10)"],
            height: payload.height || 160,
            maxSlices: payload.maxSlices || 6,
            animate: false,
          });
        } else if (kind === "pie") {
          new window.frappe.Chart(el, {
            type: "pie",
            data: {
              labels: payload.labels,
              datasets: [{ values: payload.values }]
            },
            colors: payload.colors || [BRAND.primary, BRAND.accent, BRAND.neutral, BRAND.alert, BRAND.green2, BRAND.dark],
            height: payload.height || 200,
            maxSlices: payload.maxSlices || 6,
            animate: false,
          });
        } else if (kind === "percentage") {
          new window.frappe.Chart(el, {
            type: "percentage",
            data: {
              labels: payload.labels,
              datasets: [{ values: payload.values }]
            },
            colors: payload.colors || [BRAND.primary, BRAND.accent, BRAND.neutral, BRAND.alert, BRAND.green2, BRAND.dark],
            height: payload.height || 80,
            barOptions: { height: 26, depth: 1 },
            animate: false,
          });
        }
      } catch (e) {
        console.warn("[dashboard] Frappe chart failed for", kind, e);
      }
    });
  }

  /** Execute an Obsidian command id with diagnostics + fallbacks.
   *  Plugin updates sometimes change command-id formats; this tries the
   *  canonical id first, then known variants, then a hard-coded fallback
   *  (e.g. spawn `claude --dangerously-skip-permissions` directly for the
   *  Launch Claude button). All steps log to the dev console so you can see
   *  exactly what fired. */
  executeCommandSafe(cmd) {
    const registry = app?.commands?.commands || {};
    // Try the canonical id first
    if (registry[cmd]) {
      console.log("[dashboard] executing command:", cmd);
      return app.commands.executeCommandById(cmd);
    }
    console.warn(`[dashboard] command id "${cmd}" not registered. Trying variants…`);
    // Variant search: same suffix, any matching prefix
    const suffix = cmd.split(":").slice(1).join(":") || cmd;
    const variantId = Object.keys(registry).find(k => k.endsWith(suffix) || k.endsWith(cmd.replace(/^[^:]+:/, "")));
    if (variantId) {
      console.log("[dashboard] firing variant id:", variantId);
      return app.commands.executeCommandById(variantId);
    }
    // Launch Claude — must open INSIDE Obsidian (integrated terminal), never
    // a system Terminal.app window. Strategy: (1) find any registered terminal
    // command that mentions the "claude" profile and fire it; (2) fall back to
    // the terminal plugin's API to spawn the "claude" profile directly at the
    // vault root; (3) as a final fallback, open any integrated terminal at
    // vault root and tell the user to run claude manually.
    if (cmd.includes("claude")) {
      const claudeCmdId = Object.keys(registry).find(k =>
        k.startsWith("terminal:") && /claude/i.test(k)
      );
      if (claudeCmdId) {
        console.log("[dashboard] firing claude terminal command:", claudeCmdId);
        return app.commands.executeCommandById(claudeCmdId);
      }
      const termPlugin = app?.plugins?.plugins?.terminal;
      const cwd = this.vaultBasePath();
      try {
        if (termPlugin?.openTerminal && cwd) {
          console.log("[dashboard] calling terminal plugin openTerminal with claude profile");
          termPlugin.openTerminal({ profile: "claude", cwd });
          return;
        }
        const profiles = termPlugin?.settings?.value?.profiles || termPlugin?.settings?.profiles;
        if (profiles?.claude && termPlugin?.spawnTerminal) {
          console.log("[dashboard] calling terminal plugin spawnTerminal with claude profile");
          termPlugin.spawnTerminal(profiles.claude, cwd);
          return;
        }
      } catch (e) {
        console.error("[dashboard] terminal plugin API call failed", e);
      }
      // Last resort: open an integrated terminal at vault root inside Obsidian
      // and show a notice. Never switch to system Terminal.app.
      const integratedId = Object.keys(registry).find(k =>
        /^terminal:open-terminal\..*(integrated|integratedDefault|darwinIntegratedDefault).*\.root$/.test(k)
      ) || Object.keys(registry).find(k =>
        k.startsWith("terminal:open-terminal.") && k.endsWith(".root")
      );
      if (integratedId) {
        console.log("[dashboard] integrated terminal fallback:", integratedId);
        app.commands.executeCommandById(integratedId);
        new Notice("Run: claude --dangerously-skip-permissions", 6000);
        return;
      }
      new Notice("Terminal plugin not available. Enable it in Settings → Community plugins.", 6000);
      console.error("[dashboard] no terminal command found. registry:", Object.keys(registry).filter(k => k.startsWith("terminal:")));
      return;
    }
    console.error("[dashboard] command not found and no fallback:", cmd, "— available terminal commands:", Object.keys(registry).filter(k => k.startsWith("terminal:")));
  }

  /** Map ONLY long-running shell commands to loader labels. Instant
   *  commands (open terminal, reload, settings, navigation) return null
   *  and skip the loader. */
  cmdLabel(cmd) {
    const map = {
      "obsidian-shellcommands:shell-command-morning-brief":  "Generating morning brief…",
      "obsidian-shellcommands:shell-command-daily-scan":     "Running daily scan…",
      "obsidian-shellcommands:shell-command-new-daily":      "Creating today's daily note…",
      "obsidian-shellcommands:shell-command-video-research": "Running video research…",
    };
    return map[cmd] || null;
  }

  /** Show a blocking overlay for long-running actions. Auto-dismisses or click-to-dismiss. */
  showActionLoader(label, sub) {
    document.querySelectorAll(".cc-action-loader").forEach(e => e.remove());
    const el = document.createElement("div");
    el.className = "cc-action-loader";
    el.innerHTML = `
      <div class="cc-loader-card">
        <div class="cc-loader-spinner"></div>
        <div class="cc-loader-title">${this.esc(label)}</div>
        <div class="cc-loader-sub">${this.esc(sub || "Output will land in your vault. You can dismiss this and keep working.")}</div>
        <button class="cc-loader-close">Dismiss</button>
      </div>`;
    document.body.appendChild(el);
    const close = () => el.remove();
    el.querySelector(".cc-loader-close").addEventListener("click", close);
    el.addEventListener("click", (e) => { if (e.target === el) close(); });
    setTimeout(close, 60_000); // 60s safety auto-hide
  }

  // ===================================================================
  // HELPERS
  // ===================================================================
  esc(s) { return String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
  fmt(d) { return d ? d.toFormat("MMM dd · HH:mm") : ""; }
  rel(d, today) {
    if (!d) return "—";
    const days = Math.round(today.diff(d, "days").days);
    if (days === 0) return "today";
    if (days === 1) return "1d ago";
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.round(days/7)}w ago`;
    return d.toFormat("MMM d");
  }
  link(p) { return `<a class="cc-link" data-href="${this.esc(p.file.path)}">${this.esc(p.file.name)}</a>`; }

  /** Pull the first YYYY-MM-DD date out of a Task Board emoji task line.
   *  Priority: 📅 due → ⏳ scheduled → 🛫 start → plain ISO date. Returns "" if none. */
  extractTaskDate(text) {
    const m = String(text).match(/(?:📅|⏳|🛫)\s*(\d{4}-\d{2}-\d{2})/) || String(text).match(/\b(\d{4}-\d{2}-\d{2})\b/);
    return m ? m[1] : "";
  }

  /** Strip task metadata emojis/dates from display text. */
  stripTaskMeta(text) {
    return String(text)
      .replace(/(?:📅|⏳|🛫|✅)\s*\d{4}-\d{2}-\d{2}/g, "")
      .replace(/[🔺🔼🔽]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  /** Convert minimal markdown → safe HTML for dashboard rendering. */
  md(s) {
    if (s == null) return "";
    let out = String(s);
    // wikilinks with alias [[path|display]]
    out = out.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, (_, p, d) => `<a class="cc-link" data-href="${p.trim()}">${d.trim()}</a>`);
    // wikilinks plain [[path]]
    out = out.replace(/\[\[([^\]]+)\]\]/g, (_, p) => {
      const trimmed = p.trim();
      const display = trimmed.split("/").pop();
      return `<a class="cc-link" data-href="${trimmed}">${display}</a>`;
    });
    // inline code
    out = out.replace(/`([^`]+)`/g, '<code class="cc-code">$1</code>');
    // bold **x**
    out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    // italic *x*
    out = out.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");
    return out;
  }

  tableHTML(cols, rows, emptyMsg) {
    if (!rows.length) return `<div class="cc-empty">${emptyMsg}</div>`;
    return `<table class="cc-table"><thead><tr>${cols.map(c => `<th>${c}</th>`).join("")}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  }

  // ===================================================================
  // LUCIDE-STYLE ICONS (inline SVG)
  // ===================================================================
  icon(name) {
    const paths = {
      home:   '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
      users:  '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
      check:  '<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
      calendar:'<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
      chart:  '<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
      zap:    '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
      gear:   '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
      refresh:'<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
      back:   '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
      flame:  '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
      file:   '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
      book:   '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    };
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="cc-icon">${paths[name] || ""}</svg>`;
  }

  // ===================================================================
  // SVG PRIMITIVES (sparkline / bar / heatmap / ring / delta)
  // ===================================================================
  /** Resolve a vault path to a browser-loadable resource URL. Returns null if missing/error. */
  resourceUrl(path) {
    try {
      const f = app.vault.getAbstractFileByPath(path);
      if (f && f.path && !f.children) {
        if (typeof app.vault.getResourcePath === "function") return app.vault.getResourcePath(f);
        if (app.vault.adapter && typeof app.vault.adapter.getResourcePath === "function") return app.vault.adapter.getResourcePath(path);
      }
    } catch (e) {
      console.warn("[dashboard] resourceUrl failed for", path, e);
    }
    return null;
  }

  /** Resolve a profile's avatar (Slack export). */
  avatarFor(name) {
    const base = this.profilePath(name);
    return this.resourceUrl(`${base}/avatar.png`)
        || this.resourceUrl(`${base}/avatar.jpg`)
        || this.resourceUrl(`${base}/avatar.jpeg`);
  }

  /** Resolve the configured brand mark image, if any. */
  brandMark() {
    return this.constructor.CONFIG.BRAND_MARK_PATH ? this.resourceUrl(this.constructor.CONFIG.BRAND_MARK_PATH) : "";
  }

  /** Detect series that's empty, all zeros, or completely flat — no point rendering. */
  isFlat(data) {
    if (!Array.isArray(data) || !data.length) return true;
    const nums = data.map(Number).filter(n => !isNaN(n));
    if (!nums.length) return true;
    if (nums.every(v => v === 0)) return true;
    return Math.min(...nums) === Math.max(...nums);
  }
  isFlatMulti(datasets) {
    return datasets.every(d => this.isFlat(d.values));
  }

  /** Frappe sparkline (tiny line chart) for KPI cards. */
  sparkline(data, color = "#020309") {
    if (this.isFlat(data)) return `<div class="cc-empty cc-empty-mini">— no data —</div>`;
    const payload = { values: data, color };
    return `<div class="cc-chart-mount cc-spark-mount" data-chart="sparkline" data-payload='${this.esc(JSON.stringify(payload))}'></div>`;
  }

  /** Frappe donut for goal progress / loops / single-value indicators. */
  ring(pct, _size, color = "#020309") {
    const payload = {
      values: [pct, 100 - pct],
      labels: ["Done", "Remaining"],
      colors: [color, "rgba(2,3,9,0.10)"],
      height: 140,
    };
    return `<div class="cc-chart-mount cc-ring-mount" data-chart="donut" data-payload='${this.esc(JSON.stringify(payload))}'></div>`;
  }

  /** Frappe pie chart. */
  pie(labels, values, opts = {}) {
    if (!values.length) return "";
    const payload = { labels, values, colors: opts.colors, height: opts.height || 200, maxSlices: opts.maxSlices };
    return `<div class="cc-chart-mount cc-pie-mount" data-chart="pie" data-payload='${this.esc(JSON.stringify(payload))}'></div>`;
  }

  /** Frappe horizontal percentage bar — replaces folder-bars row stack. */
  percentage(labels, values, opts = {}) {
    if (!values.length) return "";
    const payload = { labels, values, colors: opts.colors, height: opts.height || 80 };
    return `<div class="cc-chart-mount cc-pct-mount" data-chart="percentage" data-payload='${this.esc(JSON.stringify(payload))}'></div>`;
  }

  /** Frappe bar chart container. Mounted in mountCharts() after innerHTML set. */
  barChart(data, name = "Files") {
    if (!data.length) return "";
    const payload = {
      labels: data.map(d => d.label),
      values: data.map(d => d.value),
      name,
    };
    return `<div class="cc-chart-mount" data-chart="bar" data-payload='${this.esc(JSON.stringify(payload))}'></div>`;
  }

  /** Frappe heatmap container. */
  heatmap(days /*, heatMax */) {
    if (!days.length) return "";
    const dataPoints = {};
    for (const d of days) {
      const unix = Math.floor(d.date.toSeconds());
      dataPoints[unix] = d.count;
    }
    const payload = {
      dataPoints,
      start: days[0].date.toISO(),
      end:   days[days.length - 1].date.toISO(),
      countLabel: "edits",
    };
    return `<div class="cc-chart-mount cc-chart-heatmap" data-chart="heatmap" data-payload='${this.esc(JSON.stringify(payload))}'></div>`;
  }

  /** Frappe line chart for trend series (used for Circle/Slack pulse, etc.). */
  lineChart(values, labels, name = "Series") {
    if (!values.length) return "";
    const payload = {
      labels: labels || values.map((_, i) => String(i + 1)),
      values,
      name,
    };
    return `<div class="cc-chart-mount" data-chart="line" data-payload='${this.esc(JSON.stringify(payload))}'></div>`;
  }

  ring(pct, size = 80, color = "#020309") {
    const r = (size - 10) / 2;
    const c = 2 * Math.PI * r;
    const off = c * (1 - pct / 100);
    return `<svg viewBox="0 0 ${size} ${size}" class="cc-ring">
      <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="rgba(2,3,9,0.10)" stroke-width="7"/>
      <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="7" stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${off.toFixed(2)}" stroke-linecap="round" transform="rotate(-90 ${size/2} ${size/2})"/>
      <text x="${size/2}" y="${size/2 + 6}" text-anchor="middle" font-size="17" font-weight="800" font-family="Space Grotesk" fill="var(--dark)">${pct}%</text>
    </svg>`;
  }

  deltaPill(delta, suffix = "%") {
    const pos = delta >= 0;
    const arrow = pos ? "▲" : "▼";
    const cls = pos ? "cc-delta-pos" : "cc-delta-neg";
    return `<span class="cc-delta ${cls}">${arrow} ${Math.abs(delta)}${suffix}</span>`;
  }

  // ===================================================================
  // DATA UTILS
  // ===================================================================
  activityFor(date, files) {
    return files.where(p => p.file.mtime && p.file.mtime.hasSame(date, "day")).length;
  }
  last7Days(dv)  { const t = dv.date("today"); return [...Array(7)].map((_, i) => t.minus({ days: 6 - i })); }
  last30Days(dv) { const t = dv.date("today"); return [...Array(30)].map((_, i) => t.minus({ days: 29 - i })); }
  dayLabel(d)    { return ["S","M","T","W","T","F","S"][d.weekday % 7]; }

  /** Extract bulleted items under a heading from a markdown file. */
  async extractBullets(dv, filePath, headingRegex, limit = 10) {
    try {
      const raw = await dv.io.load(filePath);
      const lines = (raw || "").split("\n");
      const start = lines.findIndex(l => headingRegex.test(l));
      if (start === -1) return [];
      const items = [];
      for (let i = start + 1; i < lines.length && items.length < limit; i++) {
        const l = lines[i];
        if (/^## /.test(l)) break;
        const m = l.match(/^\s*[-*]\s+(.+)$/);
        if (m) items.push(m[1].trim());
      }
      return items;
    } catch (e) { return []; }
  }

  // ===================================================================
  // SHELL (sidebar + topbar + views container)
  // ===================================================================
  shellHTML({ title, eyebrow, sidebarItems, topActions, viewsHTML, backHref, brandLabel, brandSub, avatar }) {
    const _brandLabel = brandLabel || this.constructor.CONFIG.BRAND_LABEL;
    const _brandSub   = brandSub   || "Agentic OS";
    const _markHTML = avatar
      ? `<img src="${avatar}" alt="${this.esc(_brandLabel)}"/>`
      : "B";
    const sidebarHTML = sidebarItems.map(item => {
      if (item.divider) return `<div class="cc-nav-divider"></div>`;
      const attrs = item.view ? `data-view="${item.view}"` : (item.cmd ? `data-cmd="${item.cmd}"` : `data-href="${this.esc(item.href || "")}"`);
      return `<button class="cc-nav-btn ${item.active ? "active" : ""}" ${attrs} title="${this.esc(item.label)}" aria-label="${this.esc(item.label)}">
        ${this.icon(item.icon)}
        <span class="cc-nav-label">${this.esc(item.label)}</span>
      </button>`;
    }).join("");

    const topHTML = topActions.map(a => `
      <button class="cc-btn ${a.variant ? `cc-btn-${a.variant}` : ""}" data-cmd="${a.cmd}">
        <span class="cc-btn-ico">${a.icon}</span><span>${this.esc(a.label)}</span>
      </button>
    `).join("");

    return `
<div class="cc-app">
  <aside class="cc-sidebar">
    <div class="cc-brand" title="${this.esc(_brandLabel)} · ${this.esc(_brandSub)}">
      <div class="cc-brand-mark">${_markHTML}</div>
      <div>
        <div class="cc-brand-text">${this.esc(_brandLabel)}</div>
        <div class="cc-brand-sub">${this.esc(_brandSub)}</div>
      </div>
    </div>
    ${backHref ? `<button class="cc-nav-btn cc-nav-back" data-href="${this.esc(backHref)}" title="Back to Home">${this.icon("back")}<span class="cc-nav-label">Back to Home</span></button>` : ""}
    <div class="cc-nav-section">Navigate</div>
    <nav class="cc-nav">${sidebarHTML}</nav>
    <div class="cc-nav-spacer"></div>
    <div class="cc-nav-section">System</div>
    <div class="cc-nav-footer">
      <button class="cc-nav-btn" data-cmd="app:open-settings" title="Settings">${this.icon("gear")}<span class="cc-nav-label">Settings</span></button>
      <button class="cc-nav-btn" data-cmd="app:reload" title="Reload">${this.icon("refresh")}<span class="cc-nav-label">Reload</span></button>
    </div>
  </aside>
  <div class="cc-shell">
    <header class="cc-topbar">
      <div class="cc-title-group">
        <div class="cc-eyebrow">${this.esc(eyebrow)}</div>
        <h1 class="cc-title">${this.esc(title)}</h1>
      </div>
      <div class="cc-top-actions">${topHTML}</div>
    </header>
    <main class="cc-main">${viewsHTML}</main>
  </div>
</div>`;
  }

  // ===================================================================
  // WIRE INTERACTIONS
  // ===================================================================
  wire(root) {
    root.querySelectorAll(".cc-nav-btn[data-view]").forEach(btn => {
      btn.addEventListener("click", () => {
        root.querySelectorAll(".cc-view").forEach(v => v.hidden = v.dataset.view !== btn.dataset.view);
        root.querySelectorAll(".cc-nav-btn[data-view]").forEach(b => b.classList.toggle("active", b === btn));
        root.querySelector(".cc-shell")?.scrollTo?.({ top: 0, behavior: "smooth" });
      });
    });
    root.querySelectorAll("[data-cmd]").forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        const cmd = btn.dataset.cmd;
        const label = this.cmdLabel(cmd);
        if (label) this.showActionLoader(label);
        this.executeCommandSafe(cmd);
      });
    });
    root.querySelectorAll(".cc-claude-run").forEach(btn => {
      btn.addEventListener("click", () => {
        const ctx = { profile: btn.dataset.profile || "" };
        this.runClaude(btn.dataset.promptKey, root, ctx);
        // Auto-switch to the Runs view so the user sees streaming output.
        const runsNavBtn = root.querySelector('.cc-nav-btn[data-view="runs"]');
        if (runsNavBtn) runsNavBtn.click();
      });
    });
    root.querySelectorAll(".cc-escalate-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        try {
          const payload = JSON.parse(decodeURIComponent(escape(atob(btn.dataset.escalate))));
          this.openEscalateModal(payload);
        } catch (err) { console.error("[dashboard] escalate parse failed", err); }
      });
    });
    // Restore any in-flight or finished runs from this session
    this.restoreRunHistory(root);
    // Initial paint of "ran X ago" labels next to each action button.
    this.refreshLastRunLabels(root);
    // Live tick so "running · Ns" and "ran 5m ago" stay current.
    if (window._ccLastRunTicker) clearInterval(window._ccLastRunTicker);
    window._ccLastRunTicker = setInterval(() => this.refreshLastRunLabels(document), 15000);
    root.querySelectorAll("[data-href]").forEach(el => {
      el.addEventListener("click", async e => {
        e.preventDefault();
        this.showNavLoader();
        await app.workspace.openLinkText(el.dataset.href, "", false, {
          state: { mode: "preview" },
          eState: { mode: "preview" },
        });
        // Some plugins (e.g. dataview, customjs dashboards) override the view
        // mode after open. Force preview on the active leaf as a follow-up.
        const leaf = app.workspace.getMostRecentLeaf?.() || app.workspace.activeLeaf;
        const view = leaf?.view;
        if (view?.getViewType?.() === "markdown") {
          const state = leaf.getViewState();
          if (state?.state?.mode !== "preview") {
            state.state = { ...(state.state || {}), mode: "preview", source: false };
            await leaf.setViewState(state, { focus: true });
          }
        }
      });
    });
  }

  /** Show a fullscreen loader during dashboard-to-dashboard navigation.
   *  Removes itself once a fresh .cc-root mounts in the new page. */
  showNavLoader() {
    document.querySelectorAll(".cc-nav-loader").forEach(n => n.remove());
    const el = document.createElement("div");
    el.className = "cc-nav-loader";
    el.innerHTML = `
      <div class="cc-loader-shell">
        <div class="cc-loader-spinner"></div>
        <div class="cc-loader-text">Loading your agentic OS…</div>
      </div>`;
    document.body.appendChild(el);

    // The .cc-root currently visible belongs to the OLD page. We need to
    // detect a NEW one appearing. Mark the old one as outgoing first.
    document.querySelectorAll(".cc-root").forEach(r => r.classList.add("cc-outgoing"));

    const cleanup = () => { try { el.classList.add("cc-fading"); setTimeout(() => el.remove(), 220); } catch {} };
    const observer = new MutationObserver(() => {
      const fresh = document.querySelector(".cc-root:not(.cc-outgoing):not(.cc-loading)");
      if (fresh) { observer.disconnect(); cleanup(); }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    // Safety fallback in case render fails or takes too long
    setTimeout(() => { observer.disconnect(); cleanup(); }, 12_000);
  }

  // ===================================================================
  // TEAM DASHBOARD (Home.md) — returns HTML string
  // ===================================================================
  async buildTeamHTML(dv) {
    const today = dv.date("today");
    const allFiles = dv.pages();
    const profiles = this.constructor.CONFIG.PROFILES;

    // -------- Velocity ----------
    const last7 = this.last7Days(dv);
    const prev7 = [...Array(7)].map((_, i) => today.minus({ days: 13 - i }));
    const activity7 = last7.map(d => ({ date: d, value: this.activityFor(d, allFiles), label: this.dayLabel(d) }));
    const totalThis = activity7.reduce((a, b) => a + b.value, 0);
    const totalPrev = prev7.reduce((a, b) => a + this.activityFor(b, allFiles), 0);
    const deltaPct  = totalPrev ? Math.round(((totalThis - totalPrev) / totalPrev) * 100) : (totalThis > 0 ? 100 : 0);

    // -------- Root dailies ----------
    const rootDailies = dv.pages('"Daily"').sort(p => p.file.name, "desc");
    const today7Dailies = last7.map(d => rootDailies.find(p => p.file.name === d.toFormat("yyyy-MM-dd")));
    const sumF = f => today7Dailies.reduce((s, p) => s + (p && typeof p[f] === "number" ? p[f] : 0), 0);
    const meetingsWeek  = sumF("meetings");
    const slackWeek     = sumF("slack_messages");
    const circleWeek    = sumF("circle_posts");
    const todayDaily    = rootDailies.find(p => p.file.name === today.toFormat("yyyy-MM-dd"));

    // Aggregate every daily across root + per-profile folders, by date.
    // dayCounts[YYYY-MM-DD] = number of dailies that exist for that day
    const dayCounts = {};
    const addDates = (pages) => pages.forEach(p => {
      const k = p.file.name;
      if (/^\d{4}-\d{2}-\d{2}$/.test(k)) dayCounts[k] = (dayCounts[k] || 0) + 1;
    });
    addDates(rootDailies);
    profiles.forEach(name => addDates(dv.pages(`"${this.profileDailyPath(name)}"`)));
    const rootNames = Object.keys(dayCounts);

    // Streak = consecutive recent days with at least one daily anywhere
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const d = today.minus({ days: i });
      if (dayCounts[d.toFormat("yyyy-MM-dd")]) streak++;
      else if (i > 0) break;
    }

    // -------- 30-day team heatmap ----------
    const last30 = this.last30Days(dv);
    const heat = last30.map(d => ({ date: d, count: this.activityFor(d, allFiles) }));
    const heatMax = Math.max(...heat.map(d => d.count), 1);

    // -------- Circle/Slack 14d pulses ----------
    const last14 = [...Array(14)].map((_, i) => today.minus({ days: 13 - i }));
    const pulseSlack  = last14.map(d => rootDailies.find(p => p.file.name === d.toFormat("yyyy-MM-dd"))?.slack_messages ?? 0);
    const pulseCircle = last14.map(d => rootDailies.find(p => p.file.name === d.toFormat("yyyy-MM-dd"))?.circle_posts ?? 0);

    // -------- Profile cards data ----------
    const profileCards = profiles.map(name => {
      const pDailies = dv.pages(`"${this.profileDailyPath(name)}"`).sort(p => p.file.name, "desc");
      const todayP   = pDailies.find(p => p.file.name === today.toFormat("yyyy-MM-dd"));
      const last     = pDailies.first();
      const profileFiles = dv.pages(`"${this.profilePath(name)}"`);
      const weekTouched = last7.reduce((a, d) => a + this.activityFor(d, profileFiles), 0);
      return {
        name,
        focus: todayP?.focus ?? null,
        energy: todayP?.energy ?? null,
        wins: todayP?.wins_today ?? null,
        loops: todayP?.open_loops ?? null,
        lastSeen: last?.file?.mtime ?? null,
        weekTouched,
        avatar: this.avatarFor(name),
      };
    });

    // -------- Escalations from today's root daily ----------
    let escalationItems = [];
    if (todayDaily) {
      escalationItems = await this.extractBullets(dv, todayDaily.file.path, /^## Critical Escalations/i, 12);
    }
    // KPI: prefer frontmatter count, fall back to parsed bullets count
    const escalationsOpen = (typeof todayDaily?.escalations_open === "number")
      ? todayDaily.escalations_open
      : escalationItems.length;

    // -------- Cross-team active tasks (sorted by due date desc) ------
    const allTasks = [];
    for (const name of profiles) {
      const tasksPage = dv.pages(`"${this.profileTasksPath(name)}"`).find(p => p.file.name === "Tasks");
      if (!tasksPage) continue;
      try {
        const raw = await dv.io.load(tasksPage.file.path);
        const lines = (raw || "").split("\n");
        for (const l of lines) {
          if (/^\s*- \[ \] /.test(l)) {
            const text = l.replace(/^\s*- \[ \] /, "").trim();
            const due = this.extractTaskDate(text);
            allTasks.push({ profile: name, text, due });
          }
        }
      } catch (e) {}
    }
    allTasks.sort((a, b) => {
      // Latest due first; tasks without dates sink to the bottom
      if (a.due && b.due) return b.due.localeCompare(a.due);
      if (a.due) return -1;
      if (b.due) return 1;
      return 0;
    });
    allTasks.splice(40); // cap to 40

    // -------- Recent root team dailies only (latest → oldest) --------
    // Per-profile dailies belong on their profile dashboard, not the team home.
    const recentDailies = Array.from(rootDailies)
      .filter(p => /^\d{4}-\d{2}-\d{2}$/.test(p.file.name))
      .sort((a, b) => b.file.name.localeCompare(a.file.name))
      .slice(0, 30)
      .map(p => ({ p }));

    // ccusage — local machine Claude usage. Fire background refresh, render cached.
    const ccusageAgg = await this.loadCCUsage();
    this.refreshCCUsageIfStale();

    // -------- Build views ----------
    const overviewHTML = `
<section class="cc-view" data-view="overview">

  ${this.ccusageStripHTML(ccusageAgg)}

  <div class="cc-kpis">
    <div class="cc-kpi cc-kpi-primary">
      <div class="cc-kpi-head"><span class="cc-kpi-label">Team velocity</span>${this.deltaPill(deltaPct)}</div>
      <div class="cc-kpi-value">${totalThis}</div>
      <div class="cc-kpi-foot">files touched this week</div>
    </div>
    <div class="cc-kpi">
      <div class="cc-kpi-head"><span class="cc-kpi-label">Meetings</span></div>
      <div class="cc-kpi-value">${meetingsWeek}</div>
      <div class="cc-kpi-foot">logged this week</div>
    </div>
    <div class="cc-kpi">
      <div class="cc-kpi-head"><span class="cc-kpi-label">Team streak</span></div>
      <div class="cc-kpi-value">${streak}<span class="cc-kpi-unit">d</span></div>
      <div class="cc-kpi-dots">${last7.map(d => {
        const hit = rootNames.includes(d.toFormat("yyyy-MM-dd"));
        return `<span class="cc-dot ${hit ? "cc-dot-on" : ""}" title="${d.toFormat("MMM dd")}"></span>`;
      }).join("")}</div>
      <div class="cc-kpi-foot">consecutive team dailies</div>
    </div>
    <div class="cc-kpi cc-kpi-alert">
      <div class="cc-kpi-head"><span class="cc-kpi-label">Open escalations</span></div>
      <div class="cc-kpi-value">${escalationsOpen}</div>
      <div class="cc-kpi-foot">across team today</div>
    </div>
  </div>

  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Today's escalations</h3><span class="cc-tag cc-chip-alert">${escalationItems.length}</span></div>
    <div class="cc-card-body">
      ${escalationItems.length
        ? `<ul class="cc-md-list">${escalationItems.map(e => `<li>${this.md(e)}</li>`).join("")}</ul>`
        : `<div class="cc-empty">No escalations parsed from today's root daily.</div>`}
    </div>
  </div>

  <div class="cc-card cc-card-wide cc-card-chart">
    <div class="cc-card-head"><h3>Weekly team velocity</h3><span class="cc-tag">${totalThis} files · 7d</span></div>
    <div class="cc-card-body">${this.barChart(activity7)}</div>
  </div>

</section>`;

    const teamHTML = `
<section class="cc-view" data-view="team" hidden>
  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Team — who's on what</h3><span class="cc-tag">${profileCards.length}</span></div>
    <div class="cc-card-body cc-team-grid">
      ${profileCards.map(p => `
        <a class="cc-person-card" data-href="Dashboard/${p.name}">
          <div class="cc-person-head">
            <div class="cc-person-avatar">${
              p.avatar
                ? `<img src="${p.avatar}" alt="${this.esc(p.name)}"/>`
                : this.esc(p.name[0])
            }</div>
            <div class="cc-person-id">
              <div class="cc-person-name">${this.esc(p.name)}</div>
              <div class="cc-person-meta">${p.lastSeen ? "active " + this.rel(p.lastSeen, today) : "no daily yet"}</div>
            </div>
          </div>
          ${p.focus ? `<div class="cc-person-focus">${this.esc(p.focus)}</div>` : ""}
          <div class="cc-person-chips">
            ${p.energy != null ? `<span class="cc-chip cc-chip-primary">⚡ ${p.energy}/10</span>` : ""}
            ${p.wins != null && p.wins !== 0 ? `<span class="cc-chip cc-chip-accent">🏆 ${p.wins}</span>` : ""}
            ${p.loops != null && p.loops !== 0 ? `<span class="cc-chip cc-chip-alert">🔁 ${p.loops}</span>` : ""}
            <span class="cc-chip">${p.weekTouched} files / 7d</span>
          </div>
        </a>`).join("")}
    </div>
  </div>
</section>`;

    const tasksHTML = `
<section class="cc-view" data-view="tasks" hidden>
  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Active tasks across team</h3><span class="cc-tag">${allTasks.length}</span></div>
    <div class="cc-card-body">
      ${allTasks.length
        ? `<table class="cc-table cc-table-tasks">
            <thead><tr><th style="width:90px">Owner</th><th style="width:110px">Due</th><th>Task</th></tr></thead>
            <tbody>${allTasks.map(t => `<tr>
              <td><span class="cc-chip cc-chip-primary">${this.esc(t.profile)}</span></td>
              <td>${t.due ? `<span class="cc-chip-date">${this.esc(t.due)}</span>` : `<span class="cc-muted">—</span>`}</td>
              <td>${this.md(this.stripTaskMeta(t.text))}</td>
            </tr>`).join("")}</tbody>
          </table>`
        : `<div class="cc-empty">No active tasks found in any profile's task-list/Tasks.md.</div>`}
    </div>
  </div>
</section>`;

    const dailyHTML = `
<section class="cc-view" data-view="daily" hidden>
  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Team dailies</h3><span class="cc-tag">${recentDailies.length}</span></div>
    <div class="cc-card-body">
      ${recentDailies.length
        ? `<table class="cc-table">
            <thead><tr><th>Date</th><th style="width:140px">Updated</th></tr></thead>
            <tbody>${recentDailies.slice(0, 30).map(({p}) => `<tr><td>${this.link(p)}</td><td>${this.rel(p.file.mtime, today)}</td></tr>`).join("")}</tbody>
          </table>`
        : `<div class="cc-empty">No team dailies in <code>Daily/</code> yet.</div>`}
    </div>
  </div>
</section>`;

    // Top folders across the whole vault (last 7 days)
    const vaultFolderCounts = {};
    for (const p of allFiles.where(f => f.file.mtime > today.minus({ days: 7 }))) {
      const root = (p.file.folder.split("/")[0] || "(root)").trim() || "(root)";
      vaultFolderCounts[root] = (vaultFolderCounts[root] || 0) + 1;
    }
    const topFoldersAll = Object.entries(vaultFolderCounts).sort((a,b) => b[1] - a[1]).slice(0, 6);

    // Channel mix donut (Meetings vs Slack vs Circle)
    const channelTotal = meetingsWeek + slackWeek + circleWeek;

    // Per-profile activity (stacked bar)
    const profileActivity = profiles.map(name => ({
      name,
      values: last7.map(d => this.activityFor(d, dv.pages(`"${this.profilePath(name)}"`))),
    }));
    const profileActivityFlat = this.isFlatMulti(profileActivity);

    // Day-of-week buckets (Mon → Sun)
    const dowBuckets = [0,0,0,0,0,0,0];
    last30.forEach(d => { dowBuckets[(d.weekday + 6) % 7] += this.activityFor(d, allFiles); });

    const pulseFlat = this.isFlatMulti([
      { values: pulseCircle },
      { values: pulseSlack },
    ]);

    const analyticsHTML = `
<section class="cc-view" data-view="analytics" hidden>
  <div class="cc-grid cc-grid-2">
    <div class="cc-card cc-card-chart">
      <div class="cc-card-head"><h3>Velocity — 7d</h3><span class="cc-tag">${totalThis} files</span></div>
      <div class="cc-card-body">${this.barChart(activity7)}</div>
    </div>
    <div class="cc-card cc-card-chart">
      <div class="cc-card-head"><h3>Activity — 30d</h3><span class="cc-tag">${heat.reduce((a,b)=>a+b.count,0)} edits</span></div>
      <div class="cc-card-body cc-heat-body">
        ${this.heatmap(heat)}
      </div>
    </div>

    <div class="cc-card cc-card-chart">
      <div class="cc-card-head"><h3>Top folders · 7d</h3><span class="cc-tag">${topFoldersAll.length}</span></div>
      <div class="cc-card-body">
        ${topFoldersAll.length
          ? this.pie(topFoldersAll.map(f => f[0]), topFoldersAll.map(f => f[1]), { height: 240 })
          : `<div class="cc-empty">No folder activity yet.</div>`}
      </div>
    </div>

    <div class="cc-card cc-card-chart">
      <div class="cc-card-head"><h3>Channel mix · this week</h3><span class="cc-tag">${channelTotal}</span></div>
      <div class="cc-card-body">
        ${channelTotal > 0
          ? this.percentage(
              ["Meetings", "Slack", "Circle"],
              [meetingsWeek, slackWeek, circleWeek],
              { colors: ["#020309", "#7FBE7C", "#FDEEC4"], height: 120 }
            )
          : `<div class="cc-empty">No channel activity logged yet.</div>`}
        <div class="cc-channel-rows">
          <div class="cc-channel-row"><span class="cc-channel-dot" style="background:#020309"></span><span class="cc-channel-label">Meetings</span><span class="cc-channel-val">${meetingsWeek}</span></div>
          <div class="cc-channel-row"><span class="cc-channel-dot" style="background:#7FBE7C"></span><span class="cc-channel-label">Slack</span><span class="cc-channel-val">${slackWeek}</span></div>
          <div class="cc-channel-row"><span class="cc-channel-dot" style="background:#FDEEC4"></span><span class="cc-channel-label">Circle</span><span class="cc-channel-val">${circleWeek}</span></div>
        </div>
      </div>
    </div>

    <div class="cc-card cc-card-chart">
      <div class="cc-card-head"><h3>Circle / Slack pulse · 14d</h3><span class="cc-tag">${circleWeek + slackWeek}</span></div>
      <div class="cc-card-body">
        ${pulseFlat
          ? `<div class="cc-empty">No Circle or Slack activity logged in the last 14 days.</div>`
          : `<div class="cc-chart-mount" data-chart="line" data-payload='${this.esc(JSON.stringify({
              labels: last14.map(d => d.toFormat("MMM d")),
              datasets: [
                { name: "Circle", values: pulseCircle },
                { name: "Slack",  values: pulseSlack },
              ],
              colors: ["#020309", "#7FBE7C"],
              height: 220,
              spline: 1,
            }))}'></div>`}
      </div>
    </div>

    <div class="cc-card cc-card-chart">
      <div class="cc-card-head"><h3>Activity by profile · 7d</h3><span class="cc-tag">team</span></div>
      <div class="cc-card-body">
        ${profileActivityFlat
          ? `<div class="cc-empty">No per-profile activity to plot yet.</div>`
          : `<div class="cc-chart-mount" data-chart="bar" data-payload='${this.esc(JSON.stringify({
              labels: activity7.map(a => a.label),
              datasets: profileActivity,
              colors: ["#020309", "#7FBE7C", "#D2ECD0", "#FDEEC4", "#F3C1C0"],
              stacked: true,
              height: 240,
            }))}'></div>`}
      </div>
    </div>

    <div class="cc-card cc-card-chart">
      <div class="cc-card-head"><h3>Day-of-week productivity</h3><span class="cc-tag">30d</span></div>
      <div class="cc-card-body">
        ${this.isFlat(dowBuckets)
          ? `<div class="cc-empty">No weekday data yet.</div>`
          : `<div class="cc-chart-mount" data-chart="bar" data-payload='${this.esc(JSON.stringify({
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              values: dowBuckets,
              name: "Edits",
              colors: ["#020309"],
              height: 240,
            }))}'></div>`}
      </div>
    </div>

    <div class="cc-card">
      <div class="cc-card-head"><h3>Weekly aggregates</h3></div>
      <div class="cc-card-body cc-agg-list">
        <div class="cc-agg-row"><span class="cc-agg-label">Meetings</span><span class="cc-agg-val">${meetingsWeek}</span></div>
        <div class="cc-agg-row"><span class="cc-agg-label">Slack messages</span><span class="cc-agg-val">${slackWeek}</span></div>
        <div class="cc-agg-row"><span class="cc-agg-label">Circle posts</span><span class="cc-agg-val">${circleWeek}</span></div>
        <div class="cc-agg-row"><span class="cc-agg-label">Team streak</span><span class="cc-agg-val">${streak}d</span></div>
      </div>
    </div>
  </div>
</section>`;

    const actionsHTML = `
<section class="cc-view" data-view="actions" hidden>
  <div class="cc-grid cc-grid-3">
    <div class="cc-card">
      <div class="cc-card-head"><h3>Daily</h3></div>
      <div class="cc-card-body cc-action-list">
        <button class="cc-btn cc-btn-primary cc-btn-block" data-cmd="obsidian-shellcommands:shell-command-morning-brief">🌅 Morning brief</button>
        <button class="cc-btn cc-btn-block" data-cmd="obsidian-shellcommands:shell-command-new-daily">📝 New daily note</button>
        <button class="cc-btn cc-btn-block" data-cmd="obsidian-shellcommands:shell-command-daily-scan">🔍 Daily scan</button>
      </div>
    </div>
    <div class="cc-card">
      <div class="cc-card-head"><h3>Research</h3></div>
      <div class="cc-card-body cc-action-list">
        <button class="cc-btn cc-btn-accent cc-btn-block" data-cmd="obsidian-shellcommands:shell-command-video-research">🎥 Video research</button>
        <button class="cc-btn cc-btn-dark cc-btn-block" data-cmd="terminal:open-terminal.claude.root">💬 Open Claude</button>
      </div>
    </div>
    <div class="cc-card">
      <div class="cc-card-head"><h3>System</h3></div>
      <div class="cc-card-body cc-action-list">
        <button class="cc-btn cc-btn-block" data-cmd="app:reload">♻️ Reload Obsidian</button>
        <button class="cc-btn cc-btn-block" data-cmd="app:open-settings">⚙️ Settings</button>
      </div>
    </div>
  </div>
</section>`;

    const viewsHTML = overviewHTML + teamHTML + tasksHTML + dailyHTML + analyticsHTML + actionsHTML;

    return this.shellHTML({
      title: `${this.constructor.CONFIG.BRAND_LABEL} ${this.constructor.CONFIG.BRAND_SUB}`.trim(),
      eyebrow: `TEAM · ${today.toFormat("EEEE, MMM d")}`,
      avatar: this.brandMark(),
      sidebarItems: [
        { icon: "home",     label: "Home",      view: "overview",  active: true },
        { icon: "chart",    label: "Analytics", view: "analytics" },
        { icon: "users",    label: "Team",      view: "team" },
        { icon: "calendar", label: "Daily",     view: "daily" },
        { icon: "check",    label: "Tasks",     view: "tasks" },
        { icon: "zap",      label: "Actions",   view: "actions" },
        { icon: "book",     label: "Vault Overview", href: "Dashboard/Vault-Overview" },
      ],
      topActions: [
        { icon: "🌅", label: "Morning brief",  variant: "primary", cmd: "obsidian-shellcommands:shell-command-morning-brief" },
        { icon: "🔍", label: "Daily scan",                          cmd: "obsidian-shellcommands:shell-command-daily-scan" },
        { icon: "💬", label: "Launch Claude",         variant: "dark",    cmd: "terminal:open-terminal.claude.root" },
      ],
      viewsHTML,
    });
  }

  // Derive a YouTube thumbnail URL from any YouTube video URL.
  // Supports: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID,
  // youtube.com/embed/ID. Returns null if no ID found.
  youtubeThumbFromUrl(url) {
    if (!url) return null;
    const patterns = [
      /[?&]v=([A-Za-z0-9_-]{6,})/,           // watch?v=ID
      /youtu\.be\/([A-Za-z0-9_-]{6,})/,       // youtu.be/ID
      /\/shorts\/([A-Za-z0-9_-]{6,})/,        // shorts/ID
      /\/embed\/([A-Za-z0-9_-]{6,})/,         // embed/ID
      /\/live\/([A-Za-z0-9_-]{6,})/,          // live/ID
    ];
    for (const re of patterns) {
      const m = url.match(re);
      if (m) return `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg`;
    }
    return null;
  }

  // Synthesis list item with proper alignment: title on the left (flexible),
  // small meta chips on the right (right-aligned, wraps to a new row at narrow widths),
  // optional sub-line beneath.
  // Arguments:
  //   title      string — main text
  //   titleHref  string optional — make title a clickable link
  //   chipsHTML  string optional — pre-rendered chip spans (use sourceChip/priorityChip etc.)
  //   sub        string optional — secondary line (escaped/HTML pre-prepared)
  //   subIsHTML  bool — true if sub already contains HTML; else it's plain text and gets escaped
  listItem({ title, titleHref, chipsHTML, sub, subIsHTML }) {
    const titleEl = titleHref
      ? `<a class="cc-link" href="${this.esc(titleHref)}" target="_blank">${this.esc(title||"")}</a>`
      : this.esc(title||"");
    const subEl = sub
      ? `<div class="cc-muted" style="font-size:12px;line-height:1.5;margin-top:4px;">${subIsHTML ? sub : this.esc(sub)}</div>`
      : "";
    return `
      <div style="display:flex;flex-direction:column;gap:0;padding:10px 0;border-bottom:1px solid rgba(2,3,9,0.08);">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;">
          <strong style="flex:1 1 240px;line-height:1.35;font-size:13px;">${titleEl}</strong>
          ${chipsHTML ? `<div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-end;flex-shrink:0;align-items:center;">${chipsHTML}</div>` : ""}
        </div>
        ${subEl}
      </div>`;
  }

  // Small uniform chip — used for sentiment/trend/severity meta tags inside list items.
  // `tone` ∈ "neutral" | "positive" | "negative" | "alert" | "primary".
  metaChip(label, tone) {
    const map = {
      neutral:  { bg: "#f1f1f1", border: "#020309" },
      positive: { bg: "#bbf7d0", border: "#14532d" },
      negative: { bg: "#fca5a5", border: "#7f1d1d" },
      alert:    { bg: "#fca5a5", border: "#7f1d1d" },
      primary:  { bg: "#fde68a", border: "#78350f" },
      count:    { bg: "#ffffff", border: "#020309" },
    };
    const m = map[tone] || map.neutral;
    return `<span style="display:inline-flex;align-items:center;padding:2px 8px;font-size:11px;font-weight:600;line-height:1.4;border:1px solid ${m.border};border-radius:999px;background:${m.bg};color:#020309;white-space:nowrap;">${this.esc(label)}</span>`;
  }

  // Helper to map trend/sentiment/severity strings to a tone for metaChip.
  toneFor(value, kind) {
    const v = String(value || "").toLowerCase();
    if (kind === "trend")     return v === "rising" ? "primary" : v === "fading" ? "neutral" : "neutral";
    if (kind === "sentiment") return v === "positive" ? "positive" : v === "negative" ? "negative" : "neutral";
    if (kind === "severity")  return v === "high" ? "alert" : v === "medium" ? "primary" : "positive";
    return "neutral";
  }

  // Human-friendly relative time (compact: "3s", "12m", "2h", "5d ago").
  shortAgo(ms) {
    const s = Math.max(0, Math.round(ms / 1000));
    if (s < 60)   return `${s}s ago`;
    const m = Math.round(s / 60);
    if (m < 60)   return `${m}m ago`;
    const h = Math.round(m / 60);
    if (h < 24)   return `${h}h ago`;
    return `${Math.round(h / 24)}d ago`;
  }

  // Action button + "ran X ago" freshness label to the RIGHT of it.
  // `key` = prompt key; `opts.profile` = scope for the run; `opts.variant` = "primary"|"" etc.
  actionButton(key, label, opts = {}) {
    const profile = opts.profile || "";
    const variant = opts.variant || "";
    return `
      <div style="display:inline-flex;align-items:center;gap:8px;padding:4px 10px 4px 4px;border:1px solid var(--background-modifier-border,#020309);border-radius:999px;background:rgba(255,255,255,0.5);">
        <button class="cc-btn ${variant ? `cc-btn-${variant}` : ""} cc-claude-run" data-prompt-key="${this.esc(key)}"${profile ? ` data-profile="${this.esc(profile)}"` : ""}>${this.esc(label)}</button>
        <span class="cc-last-run" data-key="${this.esc(key)}" data-profile="${this.esc(profile)}" style="font-size:11px;font-weight:500;color:#020309;opacity:0.55;line-height:1.2;white-space:nowrap;">—</span>
      </div>`;
  }

  refreshLastRunLabels(root) {
    const store = this.runStore();
    (root || document).querySelectorAll(".cc-last-run").forEach(el => {
      const key = el.dataset.key;
      const profile = el.dataset.profile || "";
      const scope = profile || "global";
      const matches = store.filter(r =>
        r.key === key &&
        ((r.scope || "global") === scope) &&
        (r.status === "completed" || r.status === "running")
      );
      const latest = matches.sort((a, b) => (b.endedAt || b.startedAt || 0) - (a.endedAt || a.startedAt || 0))[0];

      // Reset to default styling, then apply state-specific styles
      el.style.color   = "#020309";
      el.style.opacity = "0.55";
      el.style.fontWeight = "500";
      el.style.background = "transparent";
      el.style.padding = "0";
      el.style.borderRadius = "0";

      if (!latest) {
        el.textContent = "never run";
        return;
      }
      if (latest.status === "running") {
        const elapsed = Math.round((Date.now() - latest.startedAt) / 1000);
        el.textContent = `⚡ ${elapsed}s`;
        el.style.color = "#020309";
        el.style.opacity = "1";
        el.style.fontWeight = "600";
        el.style.background = "#fde68a";
        el.style.padding = "2px 8px";
        el.style.borderRadius = "999px";
        return;
      }
      const ago = Date.now() - (latest.endedAt || latest.startedAt);
      el.textContent = `${this.shortAgo(ago)}`;
    });
  }

  // Compact, color-coded source/priority chip used in synthesis tables.
  sourceChip(name) {
    const k = String(name || "").toLowerCase();
    const map = {
      community:    { icon: "👥", bg: "#fff3d6", fg: "#020309", border: "#020309" },
      youtube:      { icon: "▶️", bg: "#ffd7d7", fg: "#020309", border: "#020309" },
      meetings:     { icon: "📅", bg: "#d6e8ff", fg: "#020309", border: "#020309" },
      comms:        { icon: "💬", bg: "#d7ffe0", fg: "#020309", border: "#020309" },
      email:        { icon: "📧", bg: "#d7ffe0", fg: "#020309", border: "#020309" },
      linkedin:     { icon: "💼", bg: "#d7eaff", fg: "#020309", border: "#020309" },
      twitter:      { icon: "🐦", bg: "#d6ecff", fg: "#020309", border: "#020309" },
      circle:       { icon: "🔵", bg: "#e9d7ff", fg: "#020309", border: "#020309" },
      research:     { icon: "🔍", bg: "#f0e6ff", fg: "#020309", border: "#020309" },
      intelligence: { icon: "🧠", bg: "#fce5cd", fg: "#020309", border: "#020309" },
    };
    const m = map[k] || { icon: "•", bg: "#f0f0f0", fg: "#020309", border: "#020309" };
    return `<span style="display:inline-flex;align-items:center;gap:4px;padding:2px 7px;font-size:11px;font-weight:600;line-height:1.4;border:1px solid ${m.border};border-radius:999px;background:${m.bg};color:${m.fg};white-space:nowrap;">${m.icon} ${this.esc(name||"")}</span>`;
  }

  priorityChip(p) {
    const k = String(p || "").toLowerCase();
    const map = {
      p0:     { label: "P0", bg: "#fca5a5", fg: "#7f1d1d" },
      p1:     { label: "P1", bg: "#fde68a", fg: "#78350f" },
      p2:     { label: "P2", bg: "#bbf7d0", fg: "#14532d" },
      high:   { label: "high",   bg: "#fca5a5", fg: "#7f1d1d" },
      medium: { label: "med",    bg: "#fde68a", fg: "#78350f" },
      low:    { label: "low",    bg: "#bbf7d0", fg: "#14532d" },
    };
    const m = map[k] || { label: p||"—", bg: "#e5e7eb", fg: "#020309" };
    return `<span style="display:inline-flex;align-items:center;justify-content:center;min-width:28px;padding:2px 8px;font-size:11px;font-weight:700;line-height:1.4;border:1px solid #020309;border-radius:999px;background:${m.bg};color:${m.fg};white-space:nowrap;">${m.label}</span>`;
  }

  // ===================================================================
  // ESCALATE TO TEAM (Slack) — small button + modal
  // ===================================================================
  slackIcon(size = 14) {
    return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" style="vertical-align:-2px;flex-shrink:0;display:inline-block;" aria-hidden="true">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52z" fill="#36C5F0"/>
      <path d="M6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#36C5F0"/>
      <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834z" fill="#ECB22E"/>
      <path d="M8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#ECB22E"/>
      <path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834z" fill="#2EB67D"/>
      <path d="M17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" fill="#2EB67D"/>
      <path d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52z" fill="#E01E5A"/>
      <path d="M15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#E01E5A"/>
    </svg>`;
  }

  escalateButton(item, opts = {}) {
    const payload = {
      item: String(item || "").slice(0, 600),
      context: String(opts.context || "").slice(0, 600),
      source: opts.source || "",
      url: opts.url || "",
      profile: opts.profile || "",
    };
    const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    return `<button class="cc-btn cc-escalate-btn" data-escalate="${b64}" title="Escalate to #team-chat on Slack" style="padding:3px 8px;font-size:11px;display:inline-flex;align-items:center;gap:5px;">${this.slackIcon(13)}<span>Escalate</span></button>`;
  }

  openEscalateModal(payload) {
    // Tear down any prior modal
    document.querySelectorAll(".cc-escalate-modal").forEach(n => n.remove());

    const wrap = document.createElement("div");
    wrap.className = "cc-escalate-modal";
    wrap.style.cssText = "position:fixed;inset:0;background:rgba(2,3,9,0.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:24px;";
    wrap.innerHTML = `
      <div style="background:#fffaf0;color:#020309;border:2px solid #020309;border-radius:14px;max-width:560px;width:100%;padding:20px;box-shadow:0 8px 32px rgba(0,0,0,0.4);">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
          <strong style="font-size:16px;display:flex;align-items:center;gap:8px;">${this.slackIcon(20)} Escalate to #team-chat</strong>
          <button class="cc-esc-cancel cc-btn" style="padding:3px 10px;font-size:12px;">✕</button>
        </div>
        <div style="margin-bottom:12px;">
          <div style="font-size:11px;opacity:0.65;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;margin-bottom:6px;">Action item</div>
          <div style="padding:10px;background:#f6f1e1;border:1px solid #020309;border-radius:6px;font-size:13px;white-space:pre-wrap;">${this.esc(payload.item)}</div>
        </div>
        ${payload.context ? `
        <div style="margin-bottom:12px;">
          <div style="font-size:11px;opacity:0.65;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;margin-bottom:6px;">Context</div>
          <div style="padding:10px;background:#fff;border:1px solid #020309;border-radius:6px;font-size:12px;white-space:pre-wrap;">${this.esc(payload.context)}</div>
        </div>` : ""}
        ${payload.url ? `<div style="margin-bottom:12px;font-size:12px;"><strong>Link:</strong> <a class="cc-link" href="${this.esc(payload.url)}" target="_blank">${this.esc(payload.url)}</a></div>` : ""}
        <div style="margin-bottom:12px;">
          <label style="font-size:11px;opacity:0.65;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;display:block;margin-bottom:6px;">Notes for the team (optional)</label>
          <textarea class="cc-esc-notes" rows="4" placeholder="Why this needs the team's attention, what you want them to do, etc." style="width:100%;padding:10px;background:#fff;border:1px solid #020309;border-radius:6px;font-size:13px;font-family:inherit;resize:vertical;color:#020309;"></textarea>
        </div>
        <div style="display:flex;gap:8px;justify-content:flex-end;">
          <button class="cc-esc-cancel cc-btn">Cancel</button>
          <button class="cc-esc-send  cc-btn cc-btn-primary" style="display:inline-flex;align-items:center;gap:6px;">${this.slackIcon(14)} Send to #team-chat</button>
        </div>
      </div>`;
    document.body.appendChild(wrap);

    const close = () => wrap.remove();
    wrap.addEventListener("click", e => { if (e.target === wrap) close(); });
    wrap.querySelectorAll(".cc-esc-cancel").forEach(b => b.addEventListener("click", close));
    wrap.querySelector(".cc-esc-send").addEventListener("click", () => {
      const notes = wrap.querySelector(".cc-esc-notes").value.trim() || "(none)";
      close();
      const ctx = {
        profile: payload.profile || this.constructor.CONFIG.DEFAULT_PROFILE,
        item: payload.item,
        context: payload.context || "(no extra context)",
        source: payload.source || "dashboard",
        notes,
      };
      const root = document.querySelector(".cc-root:not(.cc-loading)") || document;
      this.runClaude("escalateSlack", root, ctx);
      // Switch to the runs view so the user sees the streaming result.
      const runsNavBtn = root.querySelector?.('.cc-nav-btn[data-view="runs"]');
      if (runsNavBtn) runsNavBtn.click();
    });
  }

  // ===================================================================
  // ccusage — local Claude Code token + cost usage (this machine only)
  // ===================================================================
  ccusageSnapshotPath() { return "Dashboard/snapshots/ccusage.json"; }

  async loadCCUsage() {
    try {
      const adapter = app.vault.adapter;
      const path = this.ccusageSnapshotPath();
      if (!(await adapter.exists(path))) return null;
      const raw = await adapter.read(path);
      return JSON.parse(raw);
    } catch (e) {
      console.warn("[dashboard] loadCCUsage failed", e);
      return null;
    }
  }

  async refreshCCUsageIfStale(maxAgeMs = 60 * 60 * 1000) {
    if (window._ccUsageRefreshing) return;
    const existing = await this.loadCCUsage();
    if (existing?.fetched_at && (Date.now() - existing.fetched_at) < maxAgeMs) return;
    window._ccUsageRefreshing = true;
    try {
      let spawn;
      try { spawn = require("child_process").spawn; } catch { return; }
      const shellPath = process.env.SHELL || "/bin/zsh";
      const cwd = this.vaultBasePath();
      const child = spawn(shellPath, ["-l", "-c", "npx -y ccusage@latest monthly --json"], {
        cwd, env: { ...process.env, NO_COLOR: "1" }, detached: true,
      });
      let out = "";
      child.stdout.on("data", c => out += c.toString());
      child.stderr.on("data", () => {}); // npx is noisy on stderr, ignore
      child.on("close", async (code) => {
        window._ccUsageRefreshing = false;
        if (code !== 0) return;
        try {
          const parsed = JSON.parse(out);
          const agg = this.aggregateCCUsage(parsed);
          agg.fetched_at = Date.now();
          const adapter = app.vault.adapter;
          if (!(await adapter.exists("Dashboard/snapshots"))) {
            try { await adapter.mkdir("Dashboard/snapshots"); } catch {}
          }
          await adapter.write(this.ccusageSnapshotPath(), JSON.stringify(agg, null, 2));
          // Re-render usage strip in place
          this.renderCCUsageStrips(agg);
        } catch (e) {
          console.warn("[dashboard] ccusage parse/write failed", e);
        }
      });
      child.on("error", () => { window._ccUsageRefreshing = false; });
    } catch (e) {
      window._ccUsageRefreshing = false;
      console.warn("[dashboard] refreshCCUsage spawn failed", e);
    }
  }

  aggregateCCUsage(parsed) {
    const months = parsed?.monthly || [];
    const byModel = {};
    let totalCost = 0, totalTokens = 0, totalInput = 0, totalOutput = 0, totalCacheRead = 0, totalCacheCreate = 0;
    let firstPeriod = null, lastPeriod = null;
    for (const m of months) {
      totalCost += m.totalCost || 0;
      totalTokens += m.totalTokens || 0;
      totalInput += m.inputTokens || 0;
      totalOutput += m.outputTokens || 0;
      totalCacheRead += m.cacheReadTokens || 0;
      totalCacheCreate += m.cacheCreationTokens || 0;
      if (!firstPeriod || m.period < firstPeriod) firstPeriod = m.period;
      if (!lastPeriod || m.period > lastPeriod) lastPeriod = m.period;
      for (const mb of (m.modelBreakdowns || [])) {
        const k = mb.modelName || "unknown";
        if (!byModel[k]) byModel[k] = { model: k, cost: 0, tokens: 0, input: 0, output: 0, cacheRead: 0, cacheCreate: 0 };
        byModel[k].cost         += mb.cost || 0;
        byModel[k].input        += mb.inputTokens || 0;
        byModel[k].output       += mb.outputTokens || 0;
        byModel[k].cacheRead    += mb.cacheReadTokens || 0;
        byModel[k].cacheCreate  += mb.cacheCreationTokens || 0;
        byModel[k].tokens       += (mb.inputTokens||0) + (mb.outputTokens||0) + (mb.cacheReadTokens||0) + (mb.cacheCreationTokens||0);
      }
    }
    const models = Object.values(byModel).sort((a, b) => b.cost - a.cost);
    // Current month
    const nowYM = new Date().toISOString().slice(0, 7);
    const currentMonth = months.find(m => m.period === nowYM);
    return {
      total: { cost: totalCost, tokens: totalTokens, input: totalInput, output: totalOutput, cacheRead: totalCacheRead, cacheCreate: totalCacheCreate },
      current_month: currentMonth ? {
        period: currentMonth.period,
        cost: currentMonth.totalCost || 0,
        tokens: currentMonth.totalTokens || 0,
      } : null,
      models, // sorted by cost desc
      firstPeriod, lastPeriod,
    };
  }

  fmtBigNumber(n) {
    if (n == null) return "—";
    n = Number(n) || 0;
    if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
    return String(Math.round(n));
  }

  fmtCost(n) {
    n = Number(n) || 0;
    if (n >= 1000) return "$" + (n / 1000).toFixed(2) + "k";
    if (n >= 100)  return "$" + n.toFixed(0);
    return "$" + n.toFixed(2);
  }

  modelShortLabel(m) {
    // Strip the "[1m]" suffix and date stamps for compactness
    return String(m || "")
      .replace(/\[\d+m\]/g, "")
      .replace(/-\d{8}$/, "")
      .replace(/^claude-/, "");
  }

  ccusageStripHTML(agg) {
    if (!agg) {
      return `
        <div class="cc-usage-strip" data-ccu-strip style="display:flex;align-items:center;gap:12px;padding:10px 14px;margin-bottom:12px;border:1px solid var(--background-modifier-border,#020309);border-radius:10px;background:#fff;color:#020309;font-size:12px;">
          <strong style="font-size:13px;">Claude usage</strong>
          <span style="opacity:0.65;">No ccusage snapshot yet. Fetching in background…</span>
        </div>`;
    }
    const ageSec = agg.fetched_at ? Math.round((Date.now() - agg.fetched_at) / 1000) : null;
    const ageLabel = ageSec == null ? ""
      : ageSec < 60     ? `${ageSec}s ago`
      : ageSec < 3600   ? `${Math.round(ageSec/60)}m ago`
      : `${Math.round(ageSec/3600)}h ago`;
    const topModels = (agg.models || []).slice(0, 4);
    const monthChip = agg.current_month
      ? `<span class="cc-chip cc-chip-primary">${this.esc(agg.current_month.period)} · ${this.fmtCost(agg.current_month.cost)}</span>`
      : "";
    return `
      <div class="cc-usage-strip" data-ccu-strip style="display:flex;align-items:center;gap:14px;padding:10px 14px;margin-bottom:12px;border:1px solid #020309;border-radius:10px;background:#fff;color:#020309;flex-wrap:wrap;">
        <strong style="font-size:13px;letter-spacing:0.3px;">Claude usage</strong>
        <span style="display:flex;flex-direction:column;align-items:flex-start;">
          <span style="font-size:11px;opacity:0.55;text-transform:uppercase;letter-spacing:0.5px;">Lifetime cost</span>
          <span style="font-size:18px;font-weight:700;line-height:1;">${this.fmtCost(agg.total.cost)}</span>
        </span>
        <span style="display:flex;flex-direction:column;align-items:flex-start;">
          <span style="font-size:11px;opacity:0.55;text-transform:uppercase;letter-spacing:0.5px;">Lifetime tokens</span>
          <span style="font-size:18px;font-weight:700;line-height:1;">${this.fmtBigNumber(agg.total.tokens)}</span>
        </span>
        ${monthChip}
        <span style="flex:1;display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;">
          ${topModels.map(m => `<span class="cc-chip" title="${this.esc(m.model)} — ${this.fmtBigNumber(m.tokens)} tokens">${this.esc(this.modelShortLabel(m.model))} · ${this.fmtCost(m.cost)}</span>`).join("")}
        </span>
        <span style="font-size:11px;opacity:0.5;">${this.esc(ageLabel)} · ccusage (local)</span>
      </div>`;
  }

  renderCCUsageStrips(agg) {
    document.querySelectorAll("[data-ccu-strip]").forEach(el => {
      const tmp = document.createElement("div");
      tmp.innerHTML = this.ccusageStripHTML(agg);
      el.replaceWith(tmp.firstElementChild);
    });
  }

  // Read a JSON snapshot from a profile's snapshots/ folder. Returns null if missing.
  // Sorts every embedded array newest→oldest by the first detectable date field,
  // so all downstream renderers display latest first without per-list sorting.
  async readSnapshot(name, kind) {
    try {
      const path = `${this.profileSnapshotsPath(name)}/${kind}.json`;
      const adapter = app.vault.adapter;
      if (!(await adapter.exists(path))) return null;
      const raw = await adapter.read(path);
      const parsed = JSON.parse(raw);
      this.sortSnapshotNewestFirst(parsed);
      return parsed;
    } catch (e) {
      console.warn(`[dashboard] readSnapshot(${name}, ${kind}) failed`, e);
      return null;
    }
  }

  // Recursively sort arrays of objects newest-first by the first present date-like key.
  // Mutates in place. Arrays with no detectable date field are left untouched.
  sortSnapshotNewestFirst(node) {
    const DATE_KEYS = ["date_iso", "received_at", "published_at", "posted_at", "last_meeting_iso", "first_seen_iso", "last_call_iso", "due_iso", "date", "created_at"];
    const getDate = (item) => {
      if (!item || typeof item !== "object") return null;
      for (const k of DATE_KEYS) {
        if (item[k]) {
          const t = Date.parse(item[k]);
          if (!isNaN(t)) return t;
        }
      }
      return null;
    };
    const walk = (n) => {
      if (Array.isArray(n)) {
        if (n.length && n.some(it => getDate(it) !== null)) {
          n.sort((a, b) => (getDate(b) ?? -Infinity) - (getDate(a) ?? -Infinity));
        }
        n.forEach(walk);
      } else if (n && typeof n === "object") {
        Object.values(n).forEach(walk);
      }
    };
    walk(node);
  }

  // ===================================================================
  // PROFILE DASHBOARD ({Name}.md) — returns HTML string
  // ===================================================================
  async buildProfileHTML(dv, name) {
    const today = dv.date("today");
    const profileFolder = `${this.profilePath(name)}`;
    const profileFiles = dv.pages(`"${profileFolder}"`);
    const profileDailies = dv.pages(`"${profileFolder}/Daily"`).sort(p => p.file.name, "desc");

    const todayDaily = profileDailies.find(p => p.file.name === today.toFormat("yyyy-MM-dd"));
    const energy   = todayDaily?.energy ?? "—";
    const focus    = todayDaily?.focus ?? "—";
    const wins     = todayDaily?.wins_today ?? 0;
    const loops    = todayDaily?.open_loops ?? 0;
    const meetings = todayDaily?.meetings_attended ?? 0;

    const last7 = this.last7Days(dv);
    const prev7 = [...Array(7)].map((_, i) => today.minus({ days: 13 - i }));
    const activity7 = last7.map(d => ({ date: d, value: this.activityFor(d, profileFiles), label: this.dayLabel(d) }));
    const totalThis = activity7.reduce((a, b) => a + b.value, 0);
    const totalPrev = prev7.reduce((a, b) => a + this.activityFor(b, profileFiles), 0);
    const deltaPct  = totalPrev ? Math.round(((totalThis - totalPrev) / totalPrev) * 100) : (totalThis > 0 ? 100 : 0);

    const energyHist = last7.map(d => profileDailies.find(p => p.file.name === d.toFormat("yyyy-MM-dd"))?.energy ?? null).filter(v => v !== null);
    const energyAvg = energyHist.length ? Math.round(energyHist.reduce((a, b) => a + b, 0) / energyHist.length * 10) / 10 : 0;
    const energyDelta = energyHist.length >= 2 ? (energyHist[energyHist.length - 1] - energyHist[0]) : 0;

    const dailyNames = Array.from(profileDailies).map(p => p.file.name);
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const d = today.minus({ days: i });
      if (dailyNames.includes(d.toFormat("yyyy-MM-dd"))) streak++;
      else if (i > 0) break;
    }

    const last30 = this.last30Days(dv);
    const heat = last30.map(d => ({ date: d, count: this.activityFor(d, profileFiles) }));
    const heatMax = Math.max(...heat.map(d => d.count), 1);

    const recentFiles = profileFiles.where(p => p.file.mtime > today.minus({ days: 7 }));
    const folderCounts = {};
    for (const p of recentFiles) {
      const parts = p.file.folder.split("/");
      const key = parts.slice(3, 5).join("/") || "(root)";
      folderCounts[key] = (folderCounts[key] || 0) + 1;
    }
    const topFolders = Object.entries(folderCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([n, c]) => ({ name: n, count: c }));
    const folderMax = Math.max(...topFolders.map(f => f.count), 1);

    const goals = dv.pages("#goal")
      .where(p => p.status !== "done" && p.status !== "archived")
      .where(p => !p.profile || String(p.profile).toLowerCase() === name.toLowerCase())
      .sort(p => p.priority ?? 99, "asc");
    const goalsWithPct = goals.map(g => ({ link: g, name: g.file.name, pct: Math.max(0, Math.min(100, Number(g.progress ?? 0))) }));
    const avgGoalProgress = goalsWithPct.length ? Math.round(goalsWithPct.reduce((a, b) => a + b.pct, 0) / goalsWithPct.length) : 0;

    // Active tasks (sorted by due date desc)
    let activeTasks = [];
    try {
      const tasksPage = dv.pages(`"${profileFolder}/task-list"`).find(p => p.file.name === "Tasks");
      if (tasksPage) {
        const raw = await dv.io.load(tasksPage.file.path);
        const lines = (raw || "").split("\n");
        for (const l of lines) {
          if (/^\s*- \[ \] /.test(l)) {
            const text = l.replace(/^\s*- \[ \] /, "").trim();
            activeTasks.push({ text, due: this.extractTaskDate(text) });
          }
        }
      }
    } catch (e) {}
    activeTasks.sort((a, b) => {
      if (a.due && b.due) return b.due.localeCompare(a.due);
      if (a.due) return -1;
      if (b.due) return 1;
      return 0;
    });
    activeTasks = activeTasks.slice(0, 20);

    const outputs = profileDailies.slice(0, 10);
    const outRows = outputs.map(p => [this.link(p), this.rel(p.file.mtime, today)]);

    // Snapshot reads happen up front so the synthesis overview can use them.
    const communitySnap = await this.readSnapshot(name, "community");
    const youtubeSnap   = await this.readSnapshot(name, "youtube");
    const commsSnap     = await this.readSnapshot(name, "comms");
    const meetingsSnap  = await this.readSnapshot(name, "meetings");
    const intelSnap     = await this.readSnapshot(name, "intelligence");
    const researchSnap  = await this.readSnapshot(name, "research");
    const fmtAge = (iso) => {
      if (!iso) return "—";
      try { return this.rel(dv.luxon.DateTime.fromISO(iso), today); } catch { return "—"; }
    };
    const stale = (iso, hours = 24) => {
      if (!iso) return true;
      try { return dv.luxon.DateTime.fromISO(iso) < today.minus({ hours }); } catch { return true; }
    };
    const refreshButton = (key, label) => this.actionButton(key, `🔄 ${label}`, { profile: name, variant: "primary" });
    const updatedTag = (snap) => snap?.updated_at
      ? `<span class="cc-tag ${stale(snap.updated_at) ? "cc-chip-alert" : ""}">updated ${this.esc(fmtAge(snap.updated_at))}</span>`
      : `<span class="cc-tag cc-chip-alert">no snapshot</span>`;

    // Derived numbers for synthesis overview
    const urgentCount   = commsSnap?.urgent?.length ?? 0;
    const needsReply    = commsSnap?.needs_reply?.length ?? 0;
    const subs          = youtubeSnap?.channel?.subscribers ?? null;
    const subsDelta     = youtubeSnap?.channel?.subscribers_delta_7d ?? null;
    const subsDeltaPct  = (subs && subsDelta) ? Math.round((subsDelta / Math.max(1, subs - subsDelta)) * 100) : null;
    const members       = communitySnap?.stats?.total_members ?? null;
    const activeToday   = communitySnap?.stats?.active_today ?? null;
    const mentions      = communitySnap?.mentions?.length ?? 0;
    const unreadDMs     = (communitySnap?.dms || []).filter(d => d.unread).length;
    const recentVideo   = (youtubeSnap?.recent_videos || [])[0];
    const topUrgent     = (commsSnap?.urgent || [])[0];
    const topNeedsReply = (commsSnap?.needs_reply || [])[0];
    const recentPost    = (communitySnap?.recent_posts || [])[0];
    const topMention    = (communitySnap?.mentions || [])[0];

    // Intelligence-surface signals for the Overview header strip
    const topBrief = (intelSnap?.opportunity_briefs || [])[0];
    const topCrossTheme = (intelSnap?.cross_validated_themes || []).find(t => t.priority === "p0")
                       || (intelSnap?.cross_validated_themes || [])[0];
    const decisionsToDoc = (intelSnap?.decisions_to_document || []).length;
    const churnSignals  = (intelSnap?.churn_signals || []).length;

    // ccusage — local machine usage strip
    const ccusageAgg = await this.loadCCUsage();
    this.refreshCCUsageIfStale();

    const overviewHTML = `
<section class="cc-view" data-view="overview">

  ${this.ccusageStripHTML(ccusageAgg)}

  <div class="cc-kpis">
    <div class="cc-kpi cc-kpi-primary">
      <div class="cc-kpi-head"><span class="cc-kpi-label">YouTube subscribers</span>${subsDeltaPct != null ? this.deltaPill(subsDeltaPct) : ""}</div>
      <div class="cc-kpi-value">${subs != null ? subs.toLocaleString() : "—"}</div>
      <div class="cc-kpi-foot">${subsDelta != null ? `+${subsDelta.toLocaleString()} past 7d` : "click Refresh on YouTube"}</div>
    </div>
    <div class="cc-kpi">
      <div class="cc-kpi-head"><span class="cc-kpi-label">Community</span></div>
      <div class="cc-kpi-value">${members != null ? members.toLocaleString() : "—"}</div>
      <div class="cc-kpi-foot">${activeToday != null ? `${activeToday} active today` : "members"}</div>
    </div>
    <div class="cc-kpi ${urgentCount ? "cc-kpi-alert" : ""}">
      <div class="cc-kpi-head"><span class="cc-kpi-label">Urgent inbox</span></div>
      <div class="cc-kpi-value">${urgentCount}</div>
      <div class="cc-kpi-foot">${needsReply} need a reply</div>
    </div>
    <div class="cc-kpi">
      <div class="cc-kpi-head"><span class="cc-kpi-label">Active tasks</span></div>
      <div class="cc-kpi-value">${activeTasks.length}</div>
      <div class="cc-kpi-foot">${(activeTasks.filter(t => t.due).length)} with a due date</div>
    </div>
  </div>

  ${intelSnap ? `
  <div class="cc-card cc-card-wide">
    <div class="cc-card-head">
      <h3>Top intelligence</h3>
      <a class="cc-tag cc-nav-btn" data-view="intelligence" style="cursor:pointer;">See all →</a>
    </div>
    <div class="cc-card-body">
      <div style="display:flex;gap:14px;flex-wrap:wrap;">
        ${topBrief ? `
          <div style="flex:1;min-width:280px;border-left:3px solid #020309;padding:8px 12px;background:#f6f1e1;">
            <span class="cc-chip cc-chip-primary">brief</span>
            <strong style="display:block;margin:6px 0 4px;">${this.esc(topBrief.title||"")}</strong>
            <p style="margin:0 0 6px;font-size:13px;">${this.esc((topBrief.summary||"").slice(0,200))}</p>
            <p style="margin:0;font-size:12px;"><strong>Next:</strong> ${this.esc((topBrief.recommended_next_action||"").slice(0,160))}</p>
          </div>` : ""}
        ${topCrossTheme ? `
          <div style="flex:1;min-width:240px;border-left:3px solid #020309;padding:8px 12px;background:#fff;">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">${this.priorityChip(topCrossTheme.priority)} <span class="cc-muted" style="font-size:11px;">cross-validated</span></div>
            <strong style="display:block;margin:0 0 4px;">${this.esc(topCrossTheme.theme||"")}</strong>
            <div style="display:flex;gap:4px;flex-wrap:wrap;align-items:center;margin:0 0 6px;font-size:12px;">${(topCrossTheme.sources||[]).map(s => this.sourceChip(s)).join("")} <span class="cc-muted">${topCrossTheme.combined_mention_count||0}× combined</span></div>
            <p style="margin:0;font-size:12px;color:#020309;opacity:0.7;">${this.esc((topCrossTheme.why||"").slice(0,160))}</p>
          </div>` : ""}
      </div>
      ${(decisionsToDoc || churnSignals) ? `
        <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;font-size:12px;">
          ${decisionsToDoc ? `<span class="cc-chip cc-chip-alert">${decisionsToDoc} decisions to document</span>` : ""}
          ${churnSignals  ? `<span class="cc-chip cc-chip-alert">${churnSignals} churn signals</span>` : ""}
          <span class="cc-muted">→ <a class="cc-nav-btn" data-view="intelligence" style="cursor:pointer;text-decoration:underline;">Intelligence</a></span>
        </div>` : ""}
    </div>
  </div>` : ""}

  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Top of the inbox</h3>${updatedTag(commsSnap)}</div>
    <div class="cc-card-body">
      ${topUrgent || topNeedsReply
        ? `<div style="display:flex;flex-direction:column;gap:10px;">
            ${topUrgent ? `<div><span class="cc-chip cc-chip-alert">urgent</span> <span class="cc-chip">${this.esc(topUrgent.source||"—")}</span><br><strong>${this.esc(topUrgent.from||"—")}</strong> · ${this.esc((topUrgent.subject||"").slice(0,80))}<br><span class="cc-muted" style="font-size:12px;">${this.esc((topUrgent.suggested_action||"").slice(0,140))}</span></div>` : ""}
            ${topNeedsReply ? `<div><span class="cc-chip cc-chip-primary">needs reply</span> <span class="cc-chip">${this.esc(topNeedsReply.source||"—")}</span><br><strong>${this.esc(topNeedsReply.from||"—")}</strong> · ${this.esc((topNeedsReply.subject||"").slice(0,80))}<br><span class="cc-muted" style="font-size:12px;">${this.esc((topNeedsReply.suggested_action||"").slice(0,140))}</span></div>` : ""}
          </div>`
        : `<div class="cc-empty">No comms snapshot. Visit Comms to refresh.</div>`}
    </div>
  </div>

  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Latest video</h3>${updatedTag(youtubeSnap)}</div>
    <div class="cc-card-body">
      ${recentVideo ? (() => {
        const ytPerf = (youtubeSnap?.video_performance || []).find(p => (p.url && p.url === recentVideo.url) || (p.title && p.title === recentVideo.title));
        const ytAllComments = youtubeSnap?.recent_comments || [];
        const norm = (s) => String(s||"").toLowerCase().trim();
        let ytTopComments = ytAllComments.filter(c =>
          (c.video_url && recentVideo.url && c.video_url === recentVideo.url) ||
          (c.video_title && norm(c.video_title) === norm(recentVideo.title))
        ).slice(0, 3);
        let ytFallback = false;
        if (!ytTopComments.length && ytAllComments.length) { ytTopComments = ytAllComments.slice(0, 3); ytFallback = true; }
        const v = Number(recentVideo.views)  || 0;
        const l = Number(recentVideo.likes)  || 0;
        const eng = v > 0 ? Math.round((l / v) * 10000) / 100 : null;
        const pct = ytPerf?.vs_channel_avg_pct;
        const perfCls = pct == null ? "" : pct > 20 ? "cc-chip-accent" : pct < -20 ? "cc-chip-alert" : "cc-chip-primary";
        const perfSign = pct > 0 ? "+" : "";
        return `
          <div style="display:flex;gap:14px;flex-wrap:wrap;align-items:flex-start;">
            ${(() => { const thumb = recentVideo.thumbnail || this.youtubeThumbFromUrl(recentVideo.url); return thumb ? `<a href="${this.esc(recentVideo.url||"#")}" target="_blank" style="flex-shrink:0;display:block;width:200px;border-radius:8px;overflow:hidden;border:1px solid #020309;"><img src="${this.esc(thumb)}" alt="" style="width:100%;display:block;" onerror="this.parentElement.style.display='none'"/></a>` : ""; })()}
            <div style="flex:1;min-width:260px;">
              <strong style="font-size:14px;line-height:1.3;display:block;margin-bottom:6px;">${recentVideo.url ? `<a class="cc-link" href="${this.esc(recentVideo.url)}" target="_blank">${this.esc(recentVideo.title||"")}</a>` : this.esc(recentVideo.title||"")}</strong>
              <span class="cc-muted" style="font-size:12px;">${this.esc(fmtAge(recentVideo.published_at))}</span>
              <div style="display:flex;gap:12px;flex-wrap:wrap;margin:10px 0;">
                <div><div style="font-size:16px;font-weight:700;line-height:1;">${v.toLocaleString()}</div><div style="font-size:10px;opacity:0.6;text-transform:uppercase;letter-spacing:0.5px;">Views</div></div>
                <div><div style="font-size:16px;font-weight:700;line-height:1;">${l.toLocaleString()}</div><div style="font-size:10px;opacity:0.6;text-transform:uppercase;letter-spacing:0.5px;">Likes</div></div>
                <div><div style="font-size:16px;font-weight:700;line-height:1;">${(Number(recentVideo.comments)||0).toLocaleString()}</div><div style="font-size:10px;opacity:0.6;text-transform:uppercase;letter-spacing:0.5px;">Comments</div></div>
                ${eng != null ? `<div><div style="font-size:16px;font-weight:700;line-height:1;">${eng}%</div><div style="font-size:10px;opacity:0.6;text-transform:uppercase;letter-spacing:0.5px;">Like rate</div></div>` : ""}
              </div>
              ${pct != null ? `<div style="margin-bottom:8px;font-size:12px;"><span class="cc-chip ${perfCls}">${perfSign}${pct}% vs channel avg</span></div>` : ""}
              ${ytTopComments.length ? `
                <div style="font-size:11px;opacity:0.65;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;margin:6px 0;">${ytFallback ? "Recent comments" : "Top comments"}</div>
                <ul class="cc-md-list" style="margin:0;font-size:12px;">${ytTopComments.map(c => { const body = c.text || c.snippet || c.comment || c.body || ""; return `<li><strong>${this.esc(c.author||"—")}</strong>: ${this.esc(body.slice(0,160))}</li>`; }).join("")}</ul>` : ""}
            </div>
          </div>`;
      })() : `<div class="cc-empty">No YouTube snapshot. Visit YouTube to refresh.</div>`}
    </div>
  </div>

  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Community pulse</h3>${updatedTag(communitySnap)}</div>
    <div class="cc-card-body">
      ${communitySnap ? (() => {
        const themes      = communitySnap.themes || [];
        const pains       = communitySnap.pain_points || [];
        const stuck       = (communitySnap.stuck_members || []).length;
        const needsReply  = (communitySnap.needs_my_reply || []).length;
        const power       = (communitySnap.power_users || [])[0];
        const topTheme    = [...themes].sort((a,b)=> (b.frequency_4w||0) - (a.frequency_4w||0))[0];
        const topPain     = [...pains].sort((a,b)=> (b.frequency||0) - (a.frequency||0))[0];
        const trendVerb   = (t) => t?.trend === "rising" ? "is heating up" : t?.trend === "fading" ? "is cooling off" : "is the steady drumbeat";
        const sentenceParts = [];
        if (topTheme) sentenceParts.push(`<strong>${this.esc(topTheme.name||"")}</strong> ${trendVerb(topTheme)} — surfaced ${topTheme.frequency_4w||0}× in the last 4 weeks${topTheme.sentiment ? ` with ${this.esc(topTheme.sentiment)} sentiment` : ""}.`);
        if (topPain)  sentenceParts.push(`The loudest pain point is <strong>${this.esc(topPain.name||"")}</strong> (${this.esc(topPain.severity||"medium")} severity, mentioned ${topPain.frequency||0}×).`);
        if (topMention) sentenceParts.push(`Most recent mention of you: <strong>${this.esc(topMention.author||"")}</strong> — "${this.esc((topMention.context||"").slice(0,140))}"${topMention.url ? ` <a class="cc-link" href="${this.esc(topMention.url)}" target="_blank">(view)</a>` : ""}.`);
        if (recentPost) sentenceParts.push(`Latest post: ${recentPost.url ? `<a class="cc-link" href="${this.esc(recentPost.url)}" target="_blank"><strong>${this.esc(recentPost.title||"")}</strong></a>` : `<strong>${this.esc(recentPost.title||"")}</strong>`} by ${this.esc(recentPost.author||"someone")} (${recentPost.comments||0} comments, ${recentPost.likes||0} likes).`);
        if (needsReply || stuck) sentenceParts.push(`${needsReply ? `<strong>${needsReply}</strong> ${needsReply===1?"item needs":"items need"} your personal reply` : ""}${needsReply && stuck ? " and " : ""}${stuck ? `<strong>${stuck}</strong> ${stuck===1?"member is":"members are"} stuck` : ""}.`);
        if (power) sentenceParts.push(`⭐ <strong>${this.esc(power.name||"")}</strong> is leading contributions with ${power.contribution_count_4w||0} this month — a natural ambassador.`);
        if (!sentenceParts.length) sentenceParts.push("Snapshot loaded but the synthesis fields are empty. Refresh the community snapshot to populate themes, pain points, and mentions.");
        return `<p style="margin:0;line-height:1.55;font-size:13px;">${sentenceParts.join(" ")}</p>`;
      })() : `<div class="cc-empty">No community snapshot. Visit Community to refresh.</div>`}
    </div>
  </div>

</section>`;

    const tasksHTML = `
<section class="cc-view" data-view="tasks" hidden>
  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>${name}'s active tasks</h3><span class="cc-tag">${activeTasks.length}</span></div>
    <div class="cc-card-body">
      ${activeTasks.length
        ? `<table class="cc-table cc-table-tasks">
            <thead><tr><th style="width:110px">Due</th><th>Task</th></tr></thead>
            <tbody>${activeTasks.map(t => `<tr>
              <td>${t.due ? `<span class="cc-chip-date">${this.esc(t.due)}</span>` : `<span class="cc-muted">—</span>`}</td>
              <td>${this.md(this.stripTaskMeta(t.text))}</td>
            </tr>`).join("")}</tbody>
          </table>`
        : `<div class="cc-empty">No active tasks in <code>${profileFolder}/task-list/Tasks.md</code>.</div>`}
    </div>
  </div>
</section>`;

    const dailyHTML = `
<section class="cc-view" data-view="daily" hidden>
  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Recent dailies</h3><span class="cc-tag">${outputs.length}</span></div>
    <div class="cc-card-body">${this.tableHTML(["File", "Updated"], outRows, "No recent dailies.")}</div>
  </div>
</section>`;

    const communityHTML = `
<section class="cc-view" data-view="community" hidden>
  <div class="cc-card cc-card-wide">
    <div class="cc-card-head">
      <h3>Community pulse</h3>
      ${updatedTag(communitySnap)}
    </div>
    <div class="cc-card-body">
      <div style="margin-bottom:12px;">${refreshButton("refreshCommunity", "Refresh community")}</div>
      ${communitySnap ? (() => {
        const needsReplyCount = (communitySnap.needs_my_reply || []).length;
        const stuckCount      = (communitySnap.stuck_members  || []).length;
        const mentionsCount   = (communitySnap.mentions       || []).length;
        const painCount       = (communitySnap.pain_points    || []).length;
        const themesCount     = (communitySnap.themes         || []).length;
        const topTheme        = (communitySnap.themes         || []).sort((a,b) => (b.frequency_4w||0) - (a.frequency_4w||0))[0];
        const topPower        = (communitySnap.power_users    || []).sort((a,b) => (b.contribution_count_4w||0) - (a.contribution_count_4w||0))[0];
        return `
        <div class="cc-kpis" style="margin-bottom:12px;">
          <div class="cc-kpi cc-kpi-primary">
            <div class="cc-kpi-head"><span class="cc-kpi-label">Members</span></div>
            <div class="cc-kpi-value">${(communitySnap.stats?.total_members ?? 0).toLocaleString()}</div>
            <div class="cc-kpi-foot">${communitySnap.stats?.active_today != null ? `${communitySnap.stats.active_today} active today` : "in the community"}</div>
          </div>
          <div class="cc-kpi ${needsReplyCount ? "cc-kpi-alert" : ""}">
            <div class="cc-kpi-head"><span class="cc-kpi-label">Needs my reply</span></div>
            <div class="cc-kpi-value">${needsReplyCount}</div>
            <div class="cc-kpi-foot">${mentionsCount} mentions tracked</div>
          </div>
          <div class="cc-kpi ${stuckCount ? "cc-kpi-alert" : ""}">
            <div class="cc-kpi-head"><span class="cc-kpi-label">Stuck members</span></div>
            <div class="cc-kpi-value">${stuckCount}</div>
            <div class="cc-kpi-foot">${painCount} pain points open</div>
          </div>
          <div class="cc-kpi">
            <div class="cc-kpi-head"><span class="cc-kpi-label">Top theme · 4w</span></div>
            <div class="cc-kpi-value" style="font-size:15px;line-height:1.2;font-weight:700;min-height:32px;">${topTheme ? this.esc((topTheme.name||"").slice(0,42)) : "—"}</div>
            <div class="cc-kpi-foot">${topTheme ? `${topTheme.frequency_4w||0}× · ${this.esc(topTheme.trend||"steady")}` : `${themesCount} themes tracked`}</div>
          </div>
        </div>
        ${topPower ? `<div style="margin-bottom:12px;font-size:12px;opacity:0.75;">⭐ <strong>${this.esc(topPower.name||"")}</strong> is your top contributor this month with ${topPower.contribution_count_4w||0} contributions.</div>` : ""}`;
      })() : `<div class="cc-empty">No community snapshot yet. Click <strong>Refresh community</strong> above to fetch via Circle MCP.</div>`}
    </div>
  </div>

  ${communitySnap ? `
  <div class="cc-grid cc-grid-2">
    <div class="cc-card">
      <div class="cc-card-head"><h3>Recent posts</h3><span class="cc-tag">${(communitySnap.recent_posts||[]).length}</span></div>
      <div class="cc-card-body">
        ${(communitySnap.recent_posts||[]).length
          ? `<table class="cc-table"><thead><tr><th>Post</th><th style="width:90px">Author</th><th style="width:60px">💬</th><th style="width:60px">❤️</th></tr></thead>
              <tbody>${(communitySnap.recent_posts||[]).slice(0,10).map(p => `<tr>
                <td>${p.url ? `<a class="cc-link" href="${this.esc(p.url)}" target="_blank">${this.esc(p.title || "(untitled)")}</a>` : this.esc(p.title || "(untitled)")}</td>
                <td>${this.esc(p.author || "—")}</td>
                <td>${p.comments ?? "—"}</td>
                <td>${p.likes ?? "—"}</td>
              </tr>`).join("")}</tbody></table>`
          : `<div class="cc-empty">None.</div>`}
      </div>
    </div>
    <div class="cc-card">
      <div class="cc-card-head"><h3>Recent comments</h3><span class="cc-tag">${(communitySnap.recent_comments||[]).length}</span></div>
      <div class="cc-card-body">
        ${(communitySnap.recent_comments||[]).length
          ? `<ul class="cc-md-list">${(communitySnap.recent_comments||[]).slice(0,10).map(c => { const body = c.text || c.snippet || c.comment || c.body || c.content || ""; return `<li><strong>${this.esc(c.author||"—")}</strong> on <em>${this.esc(c.post_title||"")}</em>: ${this.esc(body.slice(0,160))}</li>`; }).join("")}</ul>`
          : `<div class="cc-empty">None.</div>`}
      </div>
    </div>
    <div class="cc-card">
      <div class="cc-card-head"><h3>Mentions of ${this.esc(name)}</h3><span class="cc-tag">${(communitySnap.mentions||[]).length}</span></div>
      <div class="cc-card-body">
        ${(communitySnap.mentions||[]).length
          ? `<ul class="cc-md-list">${(communitySnap.mentions||[]).slice(0,10).map(m => `<li><strong>${this.esc(m.author||"—")}</strong>: ${this.esc((m.context||"").slice(0,160))} <span class="cc-muted">${this.esc(fmtAge(m.posted_at))}</span></li>`).join("")}</ul>`
          : `<div class="cc-empty">None.</div>`}
      </div>
    </div>
    <div class="cc-card">
      <div class="cc-card-head"><h3>Replies to me</h3><span class="cc-tag">${(communitySnap.replies_to_me||[]).length}</span></div>
      <div class="cc-card-body">
        ${(communitySnap.replies_to_me||[]).length
          ? `<ul class="cc-md-list">${(communitySnap.replies_to_me||[]).slice(0,10).map(r => `<li><strong>${this.esc(r.author||"—")}</strong> on <em>${this.esc(r.post_title||"")}</em>: ${this.esc((r.snippet||"").slice(0,140))}</li>`).join("")}</ul>`
          : `<div class="cc-empty">None.</div>`}
      </div>
    </div>
  </div>

  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Needs my reply</h3><span class="cc-tag cc-chip-primary">${(communitySnap.needs_my_reply||[]).length}</span></div>
    <div class="cc-card-body">
      ${(communitySnap.needs_my_reply||[]).length
        ? `<table class="cc-table"><thead><tr><th style="width:90px">Urgency</th><th style="width:140px">From</th><th>Context</th><th>Suggested angle</th><th style="width:100px"></th></tr></thead>
            <tbody>${(communitySnap.needs_my_reply||[]).map(r => `<tr>
              <td><span class="cc-chip ${r.urgency==='high'?'cc-chip-alert':r.urgency==='medium'?'cc-chip-primary':''}">${this.esc(r.urgency||"—")}</span></td>
              <td><strong>${this.esc(r.from||"—")}</strong></td>
              <td>${r.url ? `<a class="cc-link" href="${this.esc(r.url)}" target="_blank">${this.esc((r.context||"").slice(0,180))}</a>` : this.esc((r.context||"").slice(0,180))}</td>
              <td><span class="cc-muted">${this.esc((r.suggested_response_angle||"").slice(0,140))}</span></td>
              <td>${this.escalateButton(`${r.from||"unknown"} needs my reply: ${r.context||""}`, { context: r.suggested_response_angle, source: `community · ${name}`, url: r.url, profile: name })}</td>
            </tr>`).join("")}</tbody></table>`
        : `<div class="cc-empty">Nothing flagged for personal reply.</div>`}
    </div>
  </div>

  <div class="cc-grid cc-grid-2">
    <div class="cc-card">
      <div class="cc-card-head"><h3>Recurring themes</h3><span class="cc-tag">${(communitySnap.themes||[]).length} · last 4w</span></div>
      <div class="cc-card-body">
        ${(communitySnap.themes||[]).length
          ? `<div>${(communitySnap.themes||[]).map(t => this.listItem({
              title: t.name || "",
              chipsHTML: [
                this.metaChip(t.trend || "steady", this.toneFor(t.trend, "trend")),
                this.metaChip(`${t.frequency_4w||0}×`, "count"),
                this.metaChip(t.sentiment || "neutral", this.toneFor(t.sentiment, "sentiment")),
              ].join(""),
              sub: (t.sample_quotes||[]).length ? `"${(t.sample_quotes[0]||"").slice(0,160)}"` : null,
            })).join("")}</div>`
          : `<div class="cc-empty">None.</div>`}
      </div>
    </div>
    <div class="cc-card">
      <div class="cc-card-head"><h3>Pain points</h3><span class="cc-tag cc-chip-alert">${(communitySnap.pain_points||[]).length}</span></div>
      <div class="cc-card-body">
        ${(communitySnap.pain_points||[]).length
          ? `<div>${(communitySnap.pain_points||[]).map(p => this.listItem({
              title: p.name || "",
              chipsHTML: [
                this.metaChip(p.severity || "medium", this.toneFor(p.severity, "severity")),
                this.metaChip(`${p.frequency||0}×`, "count"),
              ].join(""),
              sub: (p.examples||[]).length ? `"${(p.examples[0]||"").slice(0,160)}"` : null,
            })).join("")}</div>`
          : `<div class="cc-empty">None.</div>`}
      </div>
    </div>
  </div>

  <div class="cc-grid cc-grid-2">
    <div class="cc-card">
      <div class="cc-card-head"><h3>Stuck members</h3><span class="cc-tag cc-chip-alert">${(communitySnap.stuck_members||[]).length}</span></div>
      <div class="cc-card-body">
        ${(communitySnap.stuck_members||[]).length
          ? `<div>${(communitySnap.stuck_members||[]).map(m => this.listItem({
              title: m.name || "",
              titleHref: m.url || null,
              chipsHTML: [
                this.metaChip(`${m.days_stuck||"?"}d stuck`, "alert"),
                this.escalateButton(`${m.name||"member"} is stuck (${m.days_stuck||"?"}d)`, { context: `${m.reason||""}${m.last_unanswered_question ? " · Question: " + m.last_unanswered_question : ""}`, source: `community · ${name}`, url: m.url, profile: name }),
              ].join(""),
              sub: `${this.esc((m.reason||"").slice(0,140))}${m.last_unanswered_question ? ` · "${this.esc((m.last_unanswered_question||"").slice(0,120))}"` : ""}`,
              subIsHTML: true,
            })).join("")}</div>`
          : `<div class="cc-empty">No one stuck. 🎉</div>`}
      </div>
    </div>
    <div class="cc-card">
      <div class="cc-card-head"><h3>Power users</h3><span class="cc-tag cc-chip-accent">${(communitySnap.power_users||[]).length}</span></div>
      <div class="cc-card-body">
        ${(communitySnap.power_users||[]).length
          ? `<div>${(communitySnap.power_users||[]).map(u => this.listItem({
              title: u.name || "",
              titleHref: u.url || null,
              chipsHTML: this.metaChip(`${u.contribution_count_4w||0} contributions`, "count"),
              sub: u.notes ? u.notes.slice(0,140) : null,
            })).join("")}</div>`
          : `<div class="cc-empty">None.</div>`}
      </div>
    </div>
  </div>

  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Content gaps</h3><span class="cc-tag">${(communitySnap.content_gaps||[]).length}</span></div>
    <div class="cc-card-body">
      ${(communitySnap.content_gaps||[]).length
        ? `<table class="cc-table"><thead><tr><th>Question</th><th style="width:70px">Asks</th><th style="width:90px">Format</th><th style="width:80px">Source</th></tr></thead>
            <tbody>${(communitySnap.content_gaps||[]).map(g => `<tr>
              <td><strong>${this.esc(g.question||"")}</strong></td>
              <td>${g.ask_count||0}×</td>
              <td><span class="cc-chip">${this.esc(g.suggested_format||"—")}</span></td>
              <td>${g.best_source_post_url ? `<a class="cc-link" href="${this.esc(g.best_source_post_url)}" target="_blank">link</a>` : "—"}</td>
            </tr>`).join("")}</tbody></table>`
        : `<div class="cc-empty">None.</div>`}
    </div>
  </div>

  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>DMs</h3><span class="cc-tag">${(communitySnap.dms||[]).length}</span></div>
    <div class="cc-card-body">
      ${(communitySnap.dms||[]).length
        ? `<table class="cc-table"><thead><tr><th style="width:180px">From</th><th>Message</th><th style="width:110px">When</th></tr></thead>
            <tbody>${(communitySnap.dms||[]).slice(0,15).map(d => `<tr>
              <td><div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;"><strong>${this.esc(d.from||"—")}</strong>${d.unread ? '<span class="cc-chip cc-chip-alert" style="flex-shrink:0;">new</span>' : ''}</div></td>
              <td>${this.esc((d.snippet||"").slice(0,200))}</td>
              <td>${this.esc(fmtAge(d.received_at))}</td>
            </tr>`).join("")}</tbody></table>`
        : `<div class="cc-empty">No DMs.</div>`}
    </div>
  </div>` : ``}
</section>`;

    const youtubeHTML = `
<section class="cc-view" data-view="youtube" hidden>
  <div class="cc-card cc-card-wide">
    <div class="cc-card-head">
      <h3>YouTube pulse</h3>
      ${updatedTag(youtubeSnap)}
    </div>
    <div class="cc-card-body">
      <div style="margin-bottom:12px;">${refreshButton("refreshYouTube", "Refresh YouTube")}</div>
      ${youtubeSnap ? `
        <div class="cc-kpis" style="margin-bottom:12px;">
          <div class="cc-kpi cc-kpi-primary">
            <div class="cc-kpi-head"><span class="cc-kpi-label">Subscribers</span>${youtubeSnap.channel?.subscribers_delta_7d != null ? this.deltaPill(Math.round((youtubeSnap.channel.subscribers_delta_7d / Math.max(1, (youtubeSnap.channel.subscribers || 1) - youtubeSnap.channel.subscribers_delta_7d)) * 100)) : ""}</div>
            <div class="cc-kpi-value">${youtubeSnap.channel?.subscribers?.toLocaleString() ?? "—"}</div>
            <div class="cc-kpi-foot">${youtubeSnap.channel?.subscribers_delta_7d != null ? `+${youtubeSnap.channel.subscribers_delta_7d.toLocaleString()} · 7d` : "channel total"}</div>
          </div>
          <div class="cc-kpi">
            <div class="cc-kpi-head"><span class="cc-kpi-label">Total views</span></div>
            <div class="cc-kpi-value">${youtubeSnap.channel?.total_views?.toLocaleString() ?? "—"}</div>
            <div class="cc-kpi-foot">${youtubeSnap.channel?.views_delta_7d != null ? `+${youtubeSnap.channel.views_delta_7d.toLocaleString()} · 7d` : "lifetime"}</div>
          </div>
          <div class="cc-kpi">
            <div class="cc-kpi-head"><span class="cc-kpi-label">Videos</span></div>
            <div class="cc-kpi-value">${youtubeSnap.channel?.video_count ?? "—"}</div>
            <div class="cc-kpi-foot">published</div>
          </div>
        </div>` : `<div class="cc-empty">No YouTube snapshot yet. Click <strong>Refresh YouTube</strong> above to fetch via YouTube + vidiq MCPs.</div>`}
    </div>
  </div>

  ${youtubeSnap ? (() => {
    const latest = (youtubeSnap.recent_videos || [])[0];
    if (!latest) return "";
    const norm = (s) => String(s||"").toLowerCase().trim();
    const latestId = latest.url && (latest.url.match(/[?&]v=([^&]+)/)?.[1] || latest.url.match(/youtu\.be\/([^?]+)/)?.[1]);
    const perf = (youtubeSnap.video_performance || []).find(p =>
      (p.url && latest.url && p.url === latest.url) ||
      (p.title && norm(p.title) === norm(latest.title))
    );
    const allComments = youtubeSnap.recent_comments || [];
    let latestComments = allComments.filter(c => {
      if (c.video_url && latest.url && c.video_url === latest.url) return true;
      if (c.video_id && latestId && c.video_id === latestId) return true;
      if (c.video_title && norm(c.video_title) === norm(latest.title)) return true;
      // partial title match (truncations are common in scraped data)
      if (c.video_title && latest.title && norm(c.video_title).startsWith(norm(latest.title).slice(0, 25))) return true;
      return false;
    }).slice(0, 4);
    // Fallback: if nothing matched but comments exist, show the top 4 globally
    // (recent_comments is already sorted newest-first by the refresh prompt).
    let commentsAreFallback = false;
    if (latestComments.length === 0 && allComments.length > 0) {
      latestComments = allComments.slice(0, 4);
      commentsAreFallback = true;
    }
    const views = Number(latest.views) || 0;
    const likes = Number(latest.likes) || 0;
    const engagement = views > 0 ? Math.round((likes / views) * 10000) / 100 : null;
    const pct = perf?.vs_channel_avg_pct;
    const perfCls = pct == null ? "" : pct > 20 ? "cc-chip-accent" : pct < -20 ? "cc-chip-alert" : "cc-chip-primary";
    const perfSign = pct > 0 ? "+" : "";
    return `
    <div class="cc-card cc-card-wide">
      <div class="cc-card-head">
        <h3>Latest upload</h3>
        <span class="cc-tag">${this.esc(fmtAge(latest.published_at))}</span>
      </div>
      <div class="cc-card-body">
        <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start;">
          ${(() => { const thumb = latest.thumbnail || this.youtubeThumbFromUrl(latest.url); return thumb ? `<a href="${this.esc(latest.url||"#")}" target="_blank" style="flex-shrink:0;display:block;width:240px;border-radius:8px;overflow:hidden;border:1px solid #020309;"><img src="${this.esc(thumb)}" alt="" style="width:100%;display:block;" onerror="this.parentElement.style.display='none'"/></a>` : ""; })()}
          <div style="flex:1;min-width:280px;">
            <h2 style="margin:0 0 8px;font-size:18px;line-height:1.25;">${latest.url ? `<a class="cc-link" href="${this.esc(latest.url)}" target="_blank">${this.esc(latest.title||"")}</a>` : this.esc(latest.title||"")}</h2>
            <div style="display:flex;gap:16px;flex-wrap:wrap;margin:10px 0 12px;">
              <div><div style="font-size:20px;font-weight:700;line-height:1;">${views.toLocaleString()}</div><div style="font-size:11px;opacity:0.6;text-transform:uppercase;letter-spacing:0.5px;">Views</div></div>
              <div><div style="font-size:20px;font-weight:700;line-height:1;">${likes.toLocaleString()}</div><div style="font-size:11px;opacity:0.6;text-transform:uppercase;letter-spacing:0.5px;">Likes</div></div>
              <div><div style="font-size:20px;font-weight:700;line-height:1;">${(Number(latest.comments)||0).toLocaleString()}</div><div style="font-size:11px;opacity:0.6;text-transform:uppercase;letter-spacing:0.5px;">Comments</div></div>
              ${engagement != null ? `<div><div style="font-size:20px;font-weight:700;line-height:1;">${engagement}%</div><div style="font-size:11px;opacity:0.6;text-transform:uppercase;letter-spacing:0.5px;">Like rate</div></div>` : ""}
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;font-size:12px;">
              ${pct != null ? `<span class="cc-chip ${perfCls}">${perfSign}${pct}% vs channel avg</span>` : ""}
              ${perf?.reason_hypothesis ? `<span class="cc-muted">${this.esc(perf.reason_hypothesis.slice(0,200))}</span>` : ""}
            </div>
            ${latestComments.length ? `
              <div style="margin-top:14px;">
                <div style="font-size:11px;opacity:0.65;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;margin-bottom:6px;">${commentsAreFallback ? "Recent comments (channel-wide)" : "Top comments on this video"}</div>
                <ul class="cc-md-list" style="margin:0;font-size:12px;">${latestComments.map(c => {
                  const body = c.text || c.snippet || c.comment || c.body || c.content || "";
                  return `<li><strong>${this.esc(c.author||"—")}</strong>${c.video_title && commentsAreFallback ? ` <span class="cc-muted">on ${this.esc((c.video_title||"").slice(0,40))}</span>` : ""}: ${this.esc(body.slice(0,200))}${c.likes ? ` <span class="cc-muted">· ${this.esc(String(c.likes))} likes</span>` : ""}</li>`;
                }).join("")}</ul>
              </div>` : ""}
          </div>
        </div>
      </div>
    </div>`;
  })() : ""}

  ${youtubeSnap ? `
  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Trending in your niche</h3><span class="cc-tag">${(youtubeSnap.trending||[]).length}</span></div>
    <div class="cc-card-body">
      ${(youtubeSnap.trending||[]).length
        ? `<div style="display:flex;flex-direction:column;gap:10px;">${(youtubeSnap.trending||[]).slice(0,8).map(t => {
            // Accept multiple velocity shapes from vidiq:
            //   velocity ("5x baseline"), velocity_vph (number), breakout_score (number)
            let velocityLabel = "";
            if (t.velocity)                  velocityLabel = String(t.velocity);
            else if (t.velocity_vph != null) velocityLabel = `${Math.round(Number(t.velocity_vph)).toLocaleString()} v/h`;
            else if (t.breakout_score != null) velocityLabel = `breakout ${Math.round(Number(t.breakout_score))}`;
            const thumb = t.thumbnail_url || this.youtubeThumbFromUrl(t.url);
            return `
              <div style="display:flex;gap:12px;padding:8px;border:1px solid #020309;border-radius:8px;background:#fff;align-items:flex-start;">
                ${thumb ? `<a href="${this.esc(t.url||"#")}" target="_blank" style="flex-shrink:0;display:block;width:144px;aspect-ratio:16/9;border-radius:6px;overflow:hidden;border:1px solid #020309;background:#020309;"><img src="${this.esc(thumb)}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" onerror="this.style.display='none'"/></a>` : ""}
                <div style="flex:1;min-width:0;">
                  <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:4px;">
                    <strong style="font-size:13px;line-height:1.3;flex:1;">${t.url ? `<a class="cc-link" href="${this.esc(t.url)}" target="_blank">${this.esc(t.title||"")}</a>` : this.esc(t.title||"")}</strong>
                    ${velocityLabel ? `<span style="flex-shrink:0;padding:2px 8px;font-size:11px;font-weight:600;border:1px solid #020309;border-radius:999px;background:#bbf7d0;white-space:nowrap;">${this.esc(velocityLabel)}</span>` : ""}
                  </div>
                  <div class="cc-muted" style="font-size:11px;margin-bottom:6px;">${this.esc(t.channel||"—")} · ${t.views?.toLocaleString?.() || t.views || "—"} views</div>
                  ${t.summary ? `<p style="margin:0;font-size:12px;line-height:1.45;color:#020309;opacity:0.8;">${this.esc(t.summary.slice(0,160))}</p>` : ""}
                </div>
              </div>`;
          }).join("")}</div>`
        : `<div class="cc-empty">None.</div>`}
    </div>
  </div>

  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Recent comments</h3><span class="cc-tag">${(youtubeSnap.recent_comments||[]).length}</span></div>
    <div class="cc-card-body">
      ${(youtubeSnap.recent_comments||[]).length
        ? `<ul class="cc-md-list">${(youtubeSnap.recent_comments||[]).slice(0,10).map(c => { const body = c.text || c.snippet || c.comment || c.body || c.content || ""; return `<li><strong>${this.esc(c.author||"—")}</strong>${c.video_title ? ` on <em>${this.esc(c.video_title)}</em>` : ""}: ${this.esc(body.slice(0,160))}${c.likes ? ` <span class="cc-muted">· ${this.esc(String(c.likes))} likes</span>` : ""}</li>`; }).join("")}</ul>`
        : `<div class="cc-empty">None.</div>`}
    </div>
  </div>

  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Top questions in comments</h3><span class="cc-tag">${(youtubeSnap.top_questions_in_comments||[]).length}</span></div>
    <div class="cc-card-body">
      ${(youtubeSnap.top_questions_in_comments||[]).length
        ? `<table class="cc-table"><thead><tr><th>Question</th><th style="width:70px">Asks</th><th style="width:70px">Likes</th><th>From video</th></tr></thead>
            <tbody>${(youtubeSnap.top_questions_in_comments||[]).map(q => `<tr>
              <td><strong>${this.esc(q.question||"")}</strong></td>
              <td>${q.ask_count||1}×</td>
              <td>${q.like_count||0}</td>
              <td>${q.video_url ? `<a class="cc-link" href="${this.esc(q.video_url)}" target="_blank">${this.esc((q.video_title||"").slice(0,60))}</a>` : this.esc((q.video_title||""))}</td>
            </tr>`).join("")}</tbody></table>`
        : `<div class="cc-empty">Not populated yet — click <strong>Refresh YouTube</strong> to extract questions from comments.</div>`}
    </div>
  </div>

  <div class="cc-grid cc-grid-2">
    <div class="cc-card">
      <div class="cc-card-head"><h3>Audience themes</h3><span class="cc-tag">${(youtubeSnap.audience_themes||[]).length}</span></div>
      <div class="cc-card-body">
        ${(youtubeSnap.audience_themes||[]).length
          ? `<div>${(youtubeSnap.audience_themes||[]).map(t => this.listItem({
              title: t.theme || "",
              chipsHTML: [
                this.metaChip(`${t.mention_count||0}×`, "count"),
                this.metaChip(t.sentiment || "neutral", this.toneFor(t.sentiment, "sentiment")),
              ].join(""),
              sub: t.representative_comment ? `"${(t.representative_comment||"").slice(0,160)}"` : null,
            })).join("")}</div>`
          : `<div class="cc-empty">Not populated yet — click <strong>Refresh YouTube</strong>.</div>`}
      </div>
    </div>
    <div class="cc-card">
      <div class="cc-card-head"><h3>Performance vs avg</h3><span class="cc-tag">${(youtubeSnap.video_performance||[]).length}</span></div>
      <div class="cc-card-body">
        ${(youtubeSnap.video_performance||[]).length
          ? `<div>${(youtubeSnap.video_performance||[]).map(p => {
              const pct  = p.vs_channel_avg_pct;
              const tone = pct == null ? "neutral" : pct > 20 ? "positive" : pct < -20 ? "alert" : "primary";
              const sign = pct > 0 ? "+" : "";
              return this.listItem({
                title: p.title || "",
                titleHref: p.url || null,
                chipsHTML: this.metaChip(`${sign}${pct||0}%`, tone),
                sub: p.reason_hypothesis || null,
              });
            }).join("")}</div>`
          : `<div class="cc-empty">Not populated yet — click <strong>Refresh YouTube</strong>.</div>`}
      </div>
    </div>
  </div>

  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Recent videos</h3><span class="cc-tag">${(youtubeSnap.recent_videos||[]).length}</span></div>
    <div class="cc-card-body">
      ${(youtubeSnap.recent_videos||[]).length
        ? `<table class="cc-table"><thead><tr><th>Video</th><th style="width:90px">Views</th><th style="width:70px">Likes</th><th style="width:70px">💬</th><th style="width:110px">Published</th></tr></thead>
            <tbody>${(youtubeSnap.recent_videos||[]).slice(0,10).map(v => `<tr>
              <td>${v.url ? `<a class="cc-link" href="${this.esc(v.url)}" target="_blank">${this.esc(v.title || "")}</a>` : this.esc(v.title || "")}</td>
              <td>${v.views?.toLocaleString() ?? "—"}</td>
              <td>${v.likes?.toLocaleString() ?? "—"}</td>
              <td>${v.comments ?? "—"}</td>
              <td>${this.esc(fmtAge(v.published_at))}</td>
            </tr>`).join("")}</tbody></table>`
        : `<div class="cc-empty">None.</div>`}
    </div>
  </div>` : ``}
</section>`;

    // Channel grouping: collect every item across urgent/needs_reply/fyi
    // bucketed by source so the page reads as "what's in each inbox".
    const commsBuckets = (() => {
      if (!commsSnap) return null;
      const byChannel = { linkedin: [], email: [], youtube: [], circle: [], other: [] };
      const urgencyOrder = { urgent: 0, needs_reply: 1, fyi: 2 };
      for (const bucket of ["urgent", "needs_reply", "fyi"]) {
        for (const it of (commsSnap[bucket] || [])) {
          const src = (it.source || "").toLowerCase();
          const channel = byChannel[src] !== undefined ? src : "other";
          byChannel[channel].push({ ...it, _bucket: bucket });
        }
      }
      for (const ch of Object.keys(byChannel)) {
        byChannel[ch].sort((a, b) => urgencyOrder[a._bucket] - urgencyOrder[b._bucket]);
      }
      return byChannel;
    })();

    const channelMeta = [
      { key: "linkedin", label: "LinkedIn",        icon: "💼", totalKey: "linkedin_dms",     empty: "No LinkedIn DMs. Check that the Unipile MCP is authenticated for LinkedIn." },
      { key: "email",    label: "Email",           icon: "📧", totalKey: "emails_unread",    empty: "Inbox is clear." },
      { key: "youtube",  label: "YouTube",         icon: "▶️", totalKey: "youtube_comments", empty: "No YouTube comments flagged." },
      { key: "circle",   label: "Circle DMs",      icon: "💬", totalKey: "circle_dms",       empty: "No Circle DMs flagged." },
    ];
    const bucketChip = (b) => {
      const cls = { urgent: "cc-chip-alert", needs_reply: "cc-chip-primary", fyi: "" }[b] || "";
      const lab = { urgent: "urgent", needs_reply: "reply", fyi: "fyi" }[b] || b;
      return `<span class="cc-chip ${cls}">${lab}</span>`;
    };

    const renderChannelCard = (m) => {
      const items = commsBuckets ? commsBuckets[m.key] || [] : [];
      const total = commsSnap?.totals?.[m.totalKey] ?? items.length;
      const urgentCount = items.filter(i => i._bucket === "urgent").length;
      const replyCount  = items.filter(i => i._bucket === "needs_reply").length;
      return `
        <div class="cc-card">
          <div class="cc-card-head">
            <h3>${m.icon} ${m.label}</h3>
            <span class="cc-tag ${urgentCount ? "cc-chip-alert" : ""}">${total}</span>
          </div>
          <div class="cc-card-body">
            ${(urgentCount || replyCount) ? `<div style="margin-bottom:10px;font-size:12px;display:flex;gap:6px;flex-wrap:wrap;">${urgentCount ? `<span class="cc-chip cc-chip-alert">${urgentCount} urgent</span>` : ""}${replyCount ? `<span class="cc-chip cc-chip-primary">${replyCount} need reply</span>` : ""}</div>` : ""}
            ${items.length
              ? `<div style="display:flex;flex-direction:column;gap:10px;">${items.slice(0,12).map(it => `
                  <div style="padding:10px;border:1px solid var(--background-modifier-border,#020309);border-radius:6px;background:#fff;">
                    <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:4px;">
                      ${bucketChip(it._bucket)}
                      <strong>${this.esc(it.from||"—")}</strong>
                      <span class="cc-muted" style="font-size:11px;">${this.esc(fmtAge(it.received_at))}</span>
                    </div>
                    ${it.subject ? `<div style="margin-bottom:4px;font-size:13px;">${it.url ? `<a class="cc-link" href="${this.esc(it.url)}" target="_blank">${this.esc(it.subject)}</a>` : this.esc(it.subject)}</div>` : ""}
                    ${it.snippet ? `<div class="cc-muted" style="font-size:12px;margin-bottom:4px;">${this.esc(it.snippet.slice(0,220))}</div>` : ""}
                    <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:8px;margin-top:6px;">
                      <span class="cc-muted" style="font-size:11px;flex:1;">${it.suggested_action ? `→ ${this.esc(it.suggested_action.slice(0,140))}` : ""}</span>
                      ${this.escalateButton(`[${m.label}] ${it.from||"unknown"} · ${it.subject||"(no subject)"}`, { context: `${it.snippet||""}${it.suggested_action ? "\n\nSuggested: " + it.suggested_action : ""}`, source: `comms · ${m.label.toLowerCase()} · ${name}`, url: it.url, profile: name })}
                    </div>
                  </div>`).join("")}</div>`
              : `<div class="cc-empty">${m.empty}</div>`}
          </div>
        </div>`;
    };

    const commsHTML = `
<section class="cc-view" data-view="comms" hidden>
  <div class="cc-card cc-card-wide">
    <div class="cc-card-head">
      <h3>Inbox triage</h3>
      ${updatedTag(commsSnap)}
    </div>
    <div class="cc-card-body">
      <div style="margin-bottom:12px;">${refreshButton("refreshComms", "Refresh comms")}</div>
      ${commsSnap ? `
        <div class="cc-kpis" style="margin-bottom:8px;">
          ${channelMeta.map(m => {
            const items = commsBuckets ? commsBuckets[m.key] || [] : [];
            const total = commsSnap.totals?.[m.totalKey] ?? items.length;
            const urgent = items.filter(i => i._bucket === "urgent").length;
            return `
              <div class="cc-kpi ${urgent ? "cc-kpi-alert" : ""}">
                <div class="cc-kpi-head"><span class="cc-kpi-label">${m.icon} ${m.label}</span></div>
                <div class="cc-kpi-value">${total}</div>
                <div class="cc-kpi-foot">${urgent ? `${urgent} urgent` : `${items.length} flagged`}</div>
              </div>`;
          }).join("")}
        </div>` : `<div class="cc-empty">No comms snapshot yet. Click <strong>Refresh comms</strong> to triage your cross-channel inbox.</div>`}
    </div>
  </div>

  ${commsSnap ? `
    <div class="cc-grid cc-grid-2">
      ${renderChannelCard(channelMeta[0])}
      ${renderChannelCard(channelMeta[1])}
    </div>
    <div class="cc-grid cc-grid-2">
      ${renderChannelCard(channelMeta[2])}
      ${renderChannelCard(channelMeta[3])}
    </div>

    ${commsSnap.notes ? `
      <div class="cc-card cc-card-wide">
        <div class="cc-card-head"><h3>Refresh notes</h3><span class="cc-tag cc-chip-alert">!</span></div>
        <div class="cc-card-body">
          <pre style="margin:0;padding:10px;background:#fff;border:1px solid var(--background-modifier-border,#020309);border-radius:6px;font-size:12px;white-space:pre-wrap;color:#020309;">${this.esc(typeof commsSnap.notes === "string" ? commsSnap.notes : JSON.stringify(commsSnap.notes, null, 2))}</pre>
        </div>
      </div>` : ""}

    ${(commsSnap.recurring_senders||[]).length ? `
      <div class="cc-card cc-card-wide">
        <div class="cc-card-head"><h3>Recurring senders · last 7d</h3><span class="cc-tag">${(commsSnap.recurring_senders||[]).length}</span></div>
        <div class="cc-card-body">
          <table class="cc-table"><thead><tr><th style="width:160px">From</th><th style="width:90px">Source</th><th style="width:80px">Messages</th><th>Topics</th></tr></thead>
            <tbody>${(commsSnap.recurring_senders||[]).map(r => `<tr>
              <td><strong>${this.esc(r.from||"—")}</strong></td>
              <td><span class="cc-chip">${this.esc(r.source||"—")}</span></td>
              <td>${r.message_count||0}</td>
              <td><span class="cc-muted" style="font-size:12px;">${(r.topics||[]).map(t => this.esc(t)).join(" · ")}</span></td>
            </tr>`).join("")}</tbody></table>
        </div>
      </div>` : ""}
  ` : ""}
</section>`;

    // ---------- Meetings view (Fireflies) ----------
    const meetingsHTML = `
<section class="cc-view" data-view="meetings" hidden>
  <div class="cc-card cc-card-wide">
    <div class="cc-card-head">
      <h3>Meeting intelligence</h3>
      ${updatedTag(meetingsSnap)}
    </div>
    <div class="cc-card-body">
      <div style="margin-bottom:12px;">${refreshButton("refreshMeetings", "Refresh meetings")}</div>
      ${meetingsSnap ? `
        <div class="cc-kpis" style="margin-bottom:12px;">
          <div class="cc-kpi cc-kpi-primary">
            <div class="cc-kpi-head"><span class="cc-kpi-label">Meetings · 7d</span></div>
            <div class="cc-kpi-value">${meetingsSnap.rollup?.meetings_count_7d ?? "—"}</div>
            <div class="cc-kpi-foot">${meetingsSnap.rollup?.total_hours_7d != null ? meetingsSnap.rollup.total_hours_7d + "h total" : "this week"}</div>
          </div>
          <div class="cc-kpi">
            <div class="cc-kpi-head"><span class="cc-kpi-label">Talk-time ratio</span></div>
            <div class="cc-kpi-value">${meetingsSnap.rollup?.avg_talk_time_ratio != null ? meetingsSnap.rollup.avg_talk_time_ratio + "%" : "—"}</div>
            <div class="cc-kpi-foot">${this.esc(name)}'s share (target ~40-50)</div>
          </div>
          <div class="cc-kpi">
            <div class="cc-kpi-head"><span class="cc-kpi-label">Questions asked</span></div>
            <div class="cc-kpi-value">${meetingsSnap.rollup?.questions_asked_7d ?? "—"}</div>
            <div class="cc-kpi-foot">consultative signal</div>
          </div>
          <div class="cc-kpi cc-kpi-alert">
            <div class="cc-kpi-head"><span class="cc-kpi-label">Open action items</span></div>
            <div class="cc-kpi-value">${(meetingsSnap.action_items||[]).filter(a => a.status !== 'done').length}</div>
            <div class="cc-kpi-foot">${(meetingsSnap.action_items||[]).filter(a => a.status === 'overdue').length} overdue</div>
          </div>
        </div>` : `<div class="cc-empty">No meetings snapshot. Click <strong>Refresh meetings</strong> above to pull from Fireflies.</div>`}
    </div>
  </div>

  ${meetingsSnap ? `
  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Client signals</h3><span class="cc-tag">${(meetingsSnap.client_signals||[]).length}</span></div>
    <div class="cc-card-body">
      ${(meetingsSnap.client_signals||[]).length
        ? `<table class="cc-table"><thead><tr><th style="width:160px">Company</th><th style="width:140px">Person</th><th style="width:80px">Stage</th><th style="width:100px">Last call</th><th>Next action</th></tr></thead>
            <tbody>${(meetingsSnap.client_signals||[]).map(c => {
              const stageClass = { hot: "cc-chip-alert", warm: "cc-chip-primary", cool: "", cold: "" }[c.stage] || "";
              return `<tr>
                <td><strong>${this.esc(c.company||"—")}</strong></td>
                <td>${this.esc(c.person||"—")}</td>
                <td><span class="cc-chip ${stageClass}">${this.esc(c.stage||"—")}</span></td>
                <td>${this.esc(fmtAge(c.last_meeting_iso))}</td>
                <td>${this.esc((c.next_action||"").slice(0,160))}${c.sentiment_trend ? `<br><span class="cc-muted" style="font-size:12px;">${this.esc(c.sentiment_trend)}</span>` : ""}</td>
              </tr>`;
            }).join("")}</tbody></table>`
        : `<div class="cc-empty">No client signals yet.</div>`}
    </div>
  </div>

  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Recent meetings</h3><span class="cc-tag">${(meetingsSnap.recent||[]).length}</span></div>
    <div class="cc-card-body">
      ${(meetingsSnap.recent||[]).length
        ? `<table class="cc-table"><thead><tr><th>Meeting</th><th style="width:90px">Type</th><th style="width:90px">Duration</th><th style="width:200px">Attendees</th><th style="width:100px">When</th></tr></thead>
            <tbody>${(meetingsSnap.recent||[]).map(m => `<tr>
              <td>${m.url ? `<a class="cc-link" href="${this.esc(m.url)}" target="_blank">${this.esc(m.title||"")}</a>` : this.esc(m.title||"")}</td>
              <td><span class="cc-chip">${this.esc(m.type||"—")}</span></td>
              <td>${m.duration_minutes||"—"}m</td>
              <td><span class="cc-muted" style="font-size:12px;">${this.esc((m.attendees||[]).slice(0,3).join(", "))}${(m.attendees||[]).length > 3 ? ` +${(m.attendees||[]).length-3}` : ""}</span></td>
              <td>${this.esc(fmtAge(m.date_iso))}</td>
            </tr>`).join("")}</tbody></table>`
        : `<div class="cc-empty">No recent meetings.</div>`}
    </div>
  </div>

  <div class="cc-grid cc-grid-2">
    <div class="cc-card">
      <div class="cc-card-head"><h3>Action items</h3><span class="cc-tag">${(meetingsSnap.action_items||[]).length}</span></div>
      <div class="cc-card-body">
        ${(meetingsSnap.action_items||[]).length
          ? `<ul class="cc-md-list">${(meetingsSnap.action_items||[]).map(a => `<li><div style="display:flex;align-items:flex-start;gap:10px;"><div style="flex:1;min-width:0;">${a.status === 'overdue' ? '<span class="cc-chip cc-chip-alert">overdue</span> ' : ''}${a.in_task_list ? '<span class="cc-chip cc-chip-accent">in tasks</span> ' : '<span class="cc-chip cc-chip-alert">not in tasks</span> '}<strong>${this.esc(a.text||"")}</strong><br><span class="cc-muted" style="font-size:12px;">${this.esc(a.owner||"—")} · ${a.source_meeting_url ? `<a class="cc-link" href="${this.esc(a.source_meeting_url)}" target="_blank">${this.esc(a.source_meeting_title||"meeting")}</a>` : this.esc(a.source_meeting_title||"")}</span></div><div style="flex-shrink:0;">${this.escalateButton(a.text||"", { context: `Owner: ${a.owner||"—"}${a.source_meeting_title ? " · From: " + a.source_meeting_title : ""}${a.status ? " · Status: " + a.status : ""}`, source: `meetings · ${name}`, url: a.source_meeting_url, profile: name })}</div></div></li>`).join("")}</ul>`
          : `<div class="cc-empty">None.</div>`}
      </div>
    </div>
    <div class="cc-card">
      <div class="cc-card-head"><h3>Decisions</h3><span class="cc-tag">${(meetingsSnap.decisions||[]).length}</span></div>
      <div class="cc-card-body">
        ${(meetingsSnap.decisions||[]).length
          ? `<ul class="cc-md-list">${(meetingsSnap.decisions||[]).map(d => `<li>${d.documented ? '<span class="cc-chip cc-chip-accent">documented</span> ' : '<span class="cc-chip cc-chip-alert">not documented</span> '}<strong>${this.esc(d.decision||"")}</strong><br><span class="cc-muted" style="font-size:12px;">${this.esc((d.context||"").slice(0,120))}${d.source_meeting_url ? ` · <a class="cc-link" href="${this.esc(d.source_meeting_url)}" target="_blank">${this.esc(d.source_meeting_title||"meeting")}</a>` : ""}</span></li>`).join("")}</ul>`
          : `<div class="cc-empty">None.</div>`}
      </div>
    </div>
  </div>

  <div class="cc-grid cc-grid-2">
    <div class="cc-card">
      <div class="cc-card-head"><h3>Themes in calls</h3><span class="cc-tag">${(meetingsSnap.themes_in_calls||[]).length}</span></div>
      <div class="cc-card-body">
        ${(meetingsSnap.themes_in_calls||[]).length
          ? `<ul class="cc-md-list">${(meetingsSnap.themes_in_calls||[]).map(t => `<li><strong>${this.esc(t.theme||"")}</strong> <span class="cc-chip">${t.mention_count||0}× across calls</span>${t.representative_quote ? `<br><span class="cc-muted" style="font-size:12px;">"${this.esc((t.representative_quote||"").slice(0,160))}"</span>` : ""}</li>`).join("")}</ul>`
          : `<div class="cc-empty">None.</div>`}
      </div>
    </div>
    <div class="cc-card">
      <div class="cc-card-head"><h3>Prospect language</h3><span class="cc-tag">${(meetingsSnap.prospect_language||[]).length}</span></div>
      <div class="cc-card-body">
        ${(meetingsSnap.prospect_language||[]).length
          ? `<ul class="cc-md-list">${(meetingsSnap.prospect_language||[]).map(p => `<li>"${this.esc((p.phrase||"").slice(0,140))}"${p.source_meeting_url ? ` · <a class="cc-link" href="${this.esc(p.source_meeting_url)}" target="_blank">source</a>` : ""}${p.context ? `<br><span class="cc-muted" style="font-size:12px;">${this.esc((p.context||"").slice(0,140))}</span>` : ""}</li>`).join("")}</ul>`
          : `<div class="cc-empty">None.</div>`}
      </div>
    </div>
  </div>` : ``}
</section>`;

    // ---------- Intelligence view (cross-stream synthesis) ----------
    const intelligenceHTML = `
<section class="cc-view" data-view="intelligence" hidden>
  <div class="cc-card cc-card-wide">
    <div class="cc-card-head">
      <h3>Cross-stream intelligence</h3>
      ${updatedTag(intelSnap)}
    </div>
    <div class="cc-card-body">
      <div style="margin-bottom:12px;display:flex;gap:8px;flex-wrap:wrap;">
        ${refreshButton("refreshIntelligence", "Refresh intelligence")}
        <span class="cc-muted" style="font-size:12px;align-self:center;">Joins community + meetings + youtube + comms snapshots. Refresh each source first for best results.</span>
      </div>
      ${!intelSnap ? `<div class="cc-empty">No intelligence snapshot yet. Refresh the source pages first (Community, YouTube, Comms, Meetings), then click <strong>Refresh intelligence</strong>.</div>` : ""}
    </div>
  </div>

  ${intelSnap ? `
  ${(intelSnap.opportunity_briefs||[]).length ? `
  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Opportunity briefs</h3><span class="cc-tag cc-chip-primary">${(intelSnap.opportunity_briefs||[]).length}</span></div>
    <div class="cc-card-body">
      ${(intelSnap.opportunity_briefs||[]).map(b => `
        <div style="border-left:3px solid #020309;padding:8px 12px;margin-bottom:10px;background:#f6f1e1;">
          <strong>${this.esc(b.title||"")}</strong>
          <p style="margin:6px 0;">${this.esc(b.summary||"")}</p>
          <p style="margin:0;font-size:12px;"><strong>Next:</strong> ${this.esc(b.recommended_next_action||"")}</p>
        </div>
      `).join("")}
    </div>
  </div>` : ""}

  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Cross-validated themes</h3><span class="cc-tag">${(intelSnap.cross_validated_themes||[]).length}</span></div>
    <div class="cc-card-body">
      ${(intelSnap.cross_validated_themes||[]).length
        ? `<table class="cc-table"><thead><tr><th style="width:48px">P</th><th>Theme</th><th style="width:200px">Sources</th><th style="width:80px">Mentions</th><th>Why</th></tr></thead>
            <tbody>${(intelSnap.cross_validated_themes||[]).map(t => `<tr>
              <td>${this.priorityChip(t.priority)}</td>
              <td><strong>${this.esc(t.theme||"")}</strong></td>
              <td><div style="display:flex;gap:4px;flex-wrap:wrap;">${(t.sources||[]).map(s => this.sourceChip(s)).join("")}</div></td>
              <td><strong>${t.combined_mention_count||0}×</strong></td>
              <td><span class="cc-muted" style="font-size:12px;line-height:1.45;">${this.esc((t.why||"").slice(0,200))}</span></td>
            </tr>`).join("")}</tbody></table>`
        : `<div class="cc-empty">No themes appear in 2+ streams yet.</div>`}
    </div>
  </div>

  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Unified action items</h3><span class="cc-tag">${(intelSnap.unified_action_items||[]).length}</span></div>
    <div class="cc-card-body">
      ${(intelSnap.unified_action_items||[]).length
        ? `<table class="cc-table"><thead><tr><th style="width:48px">P</th><th style="width:140px">Source</th><th>Action</th><th style="width:90px">Due</th><th style="width:100px"></th></tr></thead>
            <tbody>${(intelSnap.unified_action_items||[]).map(a => `<tr>
              <td>${this.priorityChip(a.urgency)}</td>
              <td>${this.sourceChip(a.source||"—")}</td>
              <td>${a.url ? `<a class="cc-link" href="${this.esc(a.url)}" target="_blank"><strong>${this.esc((a.text||"").slice(0,200))}</strong></a>` : `<strong>${this.esc((a.text||"").slice(0,200))}</strong>`}</td>
              <td>${this.esc(fmtAge(a.due_iso))}</td>
              <td>${this.escalateButton(a.text||"", { context: `Priority: ${a.urgency||"—"} · Origin: ${a.source||"—"}${a.due_iso ? " · Due: " + a.due_iso : ""}`, source: `intelligence · ${name}`, url: a.url, profile: name })}</td>
            </tr>`).join("")}</tbody></table>`
        : `<div class="cc-empty">Nothing to act on.</div>`}
    </div>
  </div>

  <div class="cc-grid cc-grid-2">
    <div class="cc-card">
      <div class="cc-card-head"><h3>Decisions to document</h3><span class="cc-tag cc-chip-alert">${(intelSnap.decisions_to_document||[]).length}</span></div>
      <div class="cc-card-body">
        ${(intelSnap.decisions_to_document||[]).length
          ? `<ul class="cc-md-list">${(intelSnap.decisions_to_document||[]).map(d => `<li><div style="display:flex;align-items:flex-start;gap:10px;"><div style="flex:1;min-width:0;"><strong>${this.esc(d.decision||"")}</strong><br><span class="cc-muted" style="font-size:12px;">${d.source_meeting_url ? `<a class="cc-link" href="${this.esc(d.source_meeting_url)}" target="_blank">source</a> · ` : ""}suggested: <code>${this.esc(d.suggested_filename||"")}</code></span></div><div style="flex-shrink:0;">${this.escalateButton(`Decision needs documentation: ${d.decision||""}`, { context: `Suggested filename: ${d.suggested_filename||""}`, source: `intelligence · ${name}`, url: d.source_meeting_url, profile: name })}</div></div></li>`).join("")}</ul>`
          : `<div class="cc-empty">All decisions documented. 🎉</div>`}
      </div>
    </div>
    <div class="cc-card">
      <div class="cc-card-head"><h3>Churn signals</h3><span class="cc-tag cc-chip-alert">${(intelSnap.churn_signals||[]).length}</span></div>
      <div class="cc-card-body">
        ${(intelSnap.churn_signals||[]).length
          ? `<ul class="cc-md-list">${(intelSnap.churn_signals||[]).map(c => `<li><div style="display:flex;align-items:flex-start;gap:10px;"><div style="flex:1;min-width:0;"><strong>${this.esc(c.name||"")}</strong> <span class="cc-chip cc-chip-alert">${c.days_stuck||"?"}d</span><br><span class="cc-muted" style="font-size:12px;">${this.esc((c.recommended_outreach||"").slice(0,160))}${c.community_url ? ` · <a class="cc-link" href="${this.esc(c.community_url)}" target="_blank">community</a>` : ""}${c.last_meeting_url ? ` · <a class="cc-link" href="${this.esc(c.last_meeting_url)}" target="_blank">last meeting</a>` : ""}</span></div><div style="flex-shrink:0;">${this.escalateButton(`Churn risk: ${c.name||""}`, { context: c.recommended_outreach||"", source: `intelligence · ${name}`, url: c.community_url || c.last_meeting_url, profile: name })}</div></div></li>`).join("")}</ul>`
          : `<div class="cc-empty">None.</div>`}
      </div>
    </div>
  </div>

  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Content opportunities</h3><span class="cc-tag">${(intelSnap.content_opportunities||[]).length}</span></div>
    <div class="cc-card-body">
      ${(intelSnap.content_opportunities||[]).length
        ? `<table class="cc-table"><thead><tr><th style="width:48px">P</th><th>Question</th><th style="width:180px">Format</th><th style="width:200px">Evidence</th><th style="width:100px"></th></tr></thead>
            <tbody>${(intelSnap.content_opportunities||[]).map(o => {
              const fmt = String(o.suggested_format || "—");
              let short, detail;
              if (o.format_detail) {
                // New schema: format_detail explicitly provided
                short = fmt.length > 18 ? fmt.slice(0, 18) : fmt;
                detail = o.format_detail;
              } else {
                // Back-compat: parse short label from prose
                const m = fmt.match(/^([^:]{1,18})(?::\s*(.+))?$/);
                short  = m ? m[1].trim() : fmt.slice(0, 18);
                detail = m && m[2] ? m[2].trim() : (fmt.length > 18 ? fmt : "");
              }
              return `<tr>
                <td>${this.priorityChip(o.priority)}</td>
                <td><strong>${this.esc(o.question||"")}</strong></td>
                <td>
                  <span style="display:inline-block;padding:2px 8px;font-size:11px;font-weight:600;border:1px solid #020309;border-radius:6px;background:#fef3c7;color:#020309;line-height:1.4;">${this.esc(short)}</span>
                  ${detail ? `<div class="cc-muted" style="margin-top:4px;font-size:11px;line-height:1.4;">${this.esc(detail)}</div>` : ""}
                </td>
                <td><div style="display:flex;gap:4px;flex-wrap:wrap;align-items:center;">${(o.evidence||[]).map(e => `${this.sourceChip(e.source)}${e.ask_count ? `<span class="cc-muted" style="font-size:11px;">×${e.ask_count}</span>` : ""}${e.url ? ` <a class="cc-link" href="${this.esc(e.url)}" target="_blank" style="font-size:11px;">↗</a>` : ""}`).join('<span style="opacity:0.3;font-size:11px;">·</span>')}</div></td>
                <td>${this.escalateButton(`Content opportunity: ${o.question||""}`, { context: `Priority: ${o.priority||"—"} · Format: ${o.suggested_format||"—"} · Evidence: ${(o.evidence||[]).map(e => `${e.source}${e.ask_count?" ×"+e.ask_count:""}`).join(", ")}`, source: `intelligence · ${name}`, profile: name })}</td>
              </tr>`;
            }).join("")}</tbody></table>`
        : `<div class="cc-empty">None yet.</div>`}
    </div>
  </div>` : ""}
</section>`;

    // ---------- Research view ----------
    const researchHTML = `
<section class="cc-view" data-view="research" hidden>
  <div class="cc-card cc-card-wide">
    <div class="cc-card-head">
      <h3>Research · last 48h</h3>
      ${updatedTag(researchSnap)}
    </div>
    <div class="cc-card-body">
      <div style="margin-bottom:12px;">${refreshButton("refreshResearch", "Refresh research")}</div>
      ${researchSnap?.synthesis?.headline_signal ? `
        <div style="border-left:3px solid #020309;padding:8px 12px;background:#f6f1e1;margin-bottom:8px;">
          <span class="cc-chip cc-chip-primary">headline</span>
          <p style="margin:6px 0 0;font-size:14px;font-weight:600;">${this.esc(researchSnap.synthesis.headline_signal)}</p>
        </div>` : ""}
      ${!researchSnap ? `<div class="cc-empty">No research snapshot. Click <strong>Refresh research</strong> to scan Anthropic, YouTube, Twitter, and competitors for the last 48 hours.</div>` : ""}
    </div>
  </div>

  ${researchSnap ? `
  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Anthropic updates</h3><span class="cc-tag">${(researchSnap.anthropic_updates||[]).length}</span></div>
    <div class="cc-card-body">
      ${(researchSnap.anthropic_updates||[]).length
        ? `<div style="display:flex;flex-direction:column;gap:12px;">
            ${(researchSnap.anthropic_updates||[]).map(u => `
              <div style="display:flex;gap:14px;padding:12px;border:1px solid #020309;border-radius:8px;background:#fff;align-items:flex-start;">
                ${u.image_url ? `<a href="${this.esc(u.url||"#")}" target="_blank" style="flex-shrink:0;display:block;width:180px;border-radius:6px;overflow:hidden;border:1px solid #020309;"><img src="${this.esc(u.image_url)}" alt="" style="width:100%;display:block;" onerror="this.parentElement.style.display='none'"/></a>` : ""}
                <div style="flex:1;min-width:240px;">
                  <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:6px;">
                    <span class="cc-chip">${this.esc(u.type||"—")}</span>
                    <span class="cc-muted" style="font-size:11px;">${this.esc(fmtAge(u.published_at))}</span>
                  </div>
                  <strong style="font-size:14px;display:block;margin-bottom:6px;">${u.url ? `<a class="cc-link" href="${this.esc(u.url)}" target="_blank">${this.esc(u.title||"")}</a>` : this.esc(u.title||"")}</strong>
                  <p style="margin:0 0 6px;font-size:13px;line-height:1.45;">${this.esc((u.summary||"").slice(0,260))}</p>
                  ${u.what_it_means_for_us ? `<p style="margin:0;font-size:12px;color:#020309;opacity:0.7;"><strong>For us:</strong> ${this.esc(u.what_it_means_for_us.slice(0,200))}</p>` : ""}
                </div>
              </div>`).join("")}
          </div>`
        : `<div class="cc-empty">No Anthropic updates in the last 48h.</div>`}
    </div>
  </div>

  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>YouTube trends in your niche</h3><span class="cc-tag">${(researchSnap.youtube_trends||[]).length}</span></div>
    <div class="cc-card-body">
      ${(researchSnap.youtube_trends||[]).length
        ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;">
            ${(researchSnap.youtube_trends||[]).map(t => `
              <div style="border:1px solid #020309;border-radius:8px;background:#fff;overflow:hidden;display:flex;flex-direction:column;">
                ${(() => { const thumb = t.thumbnail_url || this.youtubeThumbFromUrl(t.url); return thumb ? `<a href="${this.esc(t.url||"#")}" target="_blank" style="display:block;aspect-ratio:16/9;background:#020309;"><img src="${this.esc(thumb)}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" onerror="this.parentElement.style.display='none'"/></a>` : ""; })()}
                <div style="padding:10px;">
                  <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px;">
                    ${(() => {
                      const v = t.velocity;
                      if (v == null || v === "") return "";
                      const num = Number(v);
                      const label = !isNaN(num) && typeof v !== "string"
                        ? `${num.toLocaleString(undefined,{maximumFractionDigits:1})} views/hr`
                        : String(v);
                      return `<span class="cc-chip cc-chip-accent" title="Views per hour since publish (vidiq velocity)">${this.esc(label)}</span>`;
                    })()}
                    ${t.topic_cluster ? `<span class="cc-chip" style="font-size:10px;">${this.esc(t.topic_cluster)}</span>` : ""}
                  </div>
                  <strong style="font-size:13px;line-height:1.3;display:block;margin-bottom:4px;">${t.url ? `<a class="cc-link" href="${this.esc(t.url)}" target="_blank">${this.esc((t.title||"").slice(0,90))}</a>` : this.esc((t.title||"").slice(0,90))}</strong>
                  <div class="cc-muted" style="font-size:11px;margin-bottom:6px;">${this.esc(t.channel||"—")} · ${t.views?.toLocaleString?.() || t.views || "—"} views${t.published_at ? ` · ${this.esc(fmtAge(t.published_at))}` : ""}</div>
                  ${t.key_insight ? `<p style="margin:0;font-size:12px;line-height:1.45;">${this.esc((t.key_insight||"").slice(0,180))}</p>` : ""}
                  ${t.transcript_highlight ? `<p style="margin:6px 0 0;font-size:11px;color:#020309;opacity:0.65;font-style:italic;">"${this.esc((t.transcript_highlight||"").slice(0,140))}"</p>` : ""}
                </div>
              </div>`).join("")}
          </div>`
        : `<div class="cc-empty">No YouTube trends captured.</div>`}
    </div>
  </div>

  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Twitter signals</h3><span class="cc-tag">${(researchSnap.twitter_signals||[]).length}</span></div>
    <div class="cc-card-body">
      ${(researchSnap.twitter_signals||[]).length
        ? (researchSnap.twitter_signals||[]).map(s => `
            <div style="padding:10px;margin-bottom:10px;border:1px solid #020309;border-radius:6px;background:#fff;">
              <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:6px;">
                <strong>${this.esc(s.topic||"")}</strong>
                <span class="cc-chip ${s.trend_direction==='hot'||s.trend_direction==='rising'?'cc-chip-alert':s.trend_direction==='fading'?'':'cc-chip-primary'}">${this.esc(s.trend_direction||"—")}</span>
                <span class="cc-chip">${s.tweets_count||0} tweets</span>
              </div>
              <div class="cc-muted" style="font-size:12px;margin-bottom:6px;">${this.esc((s.why_it_matters||"").slice(0,200))}</div>
              ${(s.representative_tweets||[]).length ? `<div style="display:flex;flex-direction:column;gap:8px;">${(s.representative_tweets||[]).slice(0,3).map(t => `
                <div style="display:flex;gap:10px;padding:8px;background:#f6f1e1;border-radius:6px;">
                  ${t.author_avatar_url ? `<img src="${this.esc(t.author_avatar_url)}" alt="" style="width:32px;height:32px;border-radius:50%;flex-shrink:0;object-fit:cover;" onerror="this.style.display='none'"/>` : ""}
                  <div style="flex:1;min-width:0;">
                    <div style="font-size:12px;margin-bottom:4px;"><strong>${this.esc(t.author||"—")}</strong>${t.posted_at ? ` <span class="cc-muted">· ${this.esc(fmtAge(t.posted_at))}</span>` : ""}${t.engagement != null ? ` <span class="cc-muted">· ${this.esc(String(t.engagement))} engagements</span>` : ""}${t.url ? ` · <a class="cc-link" href="${this.esc(t.url)}" target="_blank">view</a>` : ""}</div>
                    <div style="font-size:12px;line-height:1.45;">${this.esc((t.text||"").slice(0,240))}</div>
                    ${(t.media_urls||[]).length ? `<div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap;">${(t.media_urls||[]).slice(0,3).map(m => `<a href="${this.esc(m)}" target="_blank" style="display:block;width:120px;border-radius:4px;overflow:hidden;border:1px solid #020309;"><img src="${this.esc(m)}" alt="" style="width:100%;display:block;" onerror="this.parentElement.style.display='none'"/></a>`).join("")}</div>` : ""}
                  </div>
                </div>`).join("")}</div>` : ""}
            </div>`).join("")
        : `<div class="cc-empty">No Twitter signals captured.</div>`}
    </div>
  </div>

  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Competitor activity</h3><span class="cc-tag">${(researchSnap.competitor_activity||[]).length}</span></div>
    <div class="cc-card-body">
      ${(researchSnap.competitor_activity||[]).length
        ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;">
            ${(researchSnap.competitor_activity||[]).map(c => {
              const pct = c.performance_vs_their_avg_pct;
              const cls = pct > 20 ? "cc-chip-accent" : pct < -20 ? "cc-chip-alert" : "";
              const sign = pct > 0 ? "+" : "";
              return `
                <div style="border:1px solid #020309;border-radius:8px;background:#fff;overflow:hidden;display:flex;flex-direction:column;">
                  ${(() => { const thumb = c.thumbnail_url || this.youtubeThumbFromUrl(c.video_url); return thumb ? `<a href="${this.esc(c.video_url||"#")}" target="_blank" style="display:block;aspect-ratio:16/9;background:#020309;"><img src="${this.esc(thumb)}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" onerror="this.parentElement.style.display='none'"/></a>` : ""; })()}
                  <div style="padding:10px;">
                    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px;align-items:center;">
                      ${pct != null ? `<span class="cc-chip ${cls}">${sign}${pct}%</span>` : ""}
                      <span class="cc-muted" style="font-size:11px;">${this.esc(fmtAge(c.published_at))}</span>
                      ${c.topic ? `<span class="cc-chip" style="font-size:10px;">${this.esc(c.topic)}</span>` : ""}
                    </div>
                    <strong style="font-size:13px;line-height:1.3;display:block;margin-bottom:4px;">${c.video_url ? `<a class="cc-link" href="${this.esc(c.video_url)}" target="_blank">${this.esc((c.video_title||"").slice(0,90))}</a>` : this.esc((c.video_title||"").slice(0,90))}</strong>
                    <div class="cc-muted" style="font-size:11px;margin-bottom:6px;">${c.channel_url ? `<a class="cc-link" href="${this.esc(c.channel_url)}" target="_blank">${this.esc(c.channel||"—")}</a>` : this.esc(c.channel||"—")} · ${c.views?.toLocaleString?.() || c.views || "—"} views</div>
                    ${c.angle_summary ? `<p style="margin:0;font-size:12px;line-height:1.45;">${this.esc((c.angle_summary||"").slice(0,180))}</p>` : ""}
                  </div>
                </div>`;
            }).join("")}
          </div>`
        : `<div class="cc-empty">No competitor videos in the last 48h.</div>`}
    </div>
  </div>

  ${(researchSnap.synthesis?.content_opportunities?.length || researchSnap.synthesis?.trends_to_watch?.length) ? `
  <div class="cc-grid cc-grid-2">
    ${researchSnap.synthesis?.content_opportunities?.length ? `
    <div class="cc-card">
      <div class="cc-card-head"><h3>Content opportunities</h3><span class="cc-tag">${researchSnap.synthesis.content_opportunities.length}</span></div>
      <div class="cc-card-body">
        <ul class="cc-md-list">${researchSnap.synthesis.content_opportunities.map(o => `<li>${this.esc(o)}</li>`).join("")}</ul>
      </div>
    </div>` : ""}
    ${researchSnap.synthesis?.trends_to_watch?.length ? `
    <div class="cc-card">
      <div class="cc-card-head"><h3>Trends to watch</h3><span class="cc-tag">${researchSnap.synthesis.trends_to_watch.length}</span></div>
      <div class="cc-card-body">
        <ul class="cc-md-list">${researchSnap.synthesis.trends_to_watch.map(t => `<li>${this.esc(t)}</li>`).join("")}</ul>
      </div>
    </div>` : ""}
  </div>` : ""}
  ` : ""}
</section>`;

    // ---------- Per-profile runs view ----------
    const profileRunsHTML = `
<section class="cc-view" data-view="runs" hidden>
  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>${this.esc(name)}'s background runs</h3><span class="cc-tag">claude -p · history</span></div>
    <div class="cc-card-body">
      <p style="margin:0 0 8px;opacity:0.7;font-size:13px;">Every refresh launched from ${this.esc(name)}'s pages lands here. Persists to <code>${this.esc(this.profileRunsPath(name))}</code>.</p>
      <div id="cc-claude-runs-profile" class="cc-claude-runs" data-runs-scope="${this.esc(name)}"></div>
    </div>
  </div>
</section>`;

    // Hydrate persisted runs once per session so the runs view fills.
    this.hydrateRunsOnce().then(() => {
      const r = document.querySelector(".cc-root:not(.cc-loading)");
      if (r) this.restoreRunHistory(r);
      this.refreshLastRunLabels(document);
    });

    const viewsHTML = overviewHTML + intelligenceHTML + researchHTML + communityHTML + youtubeHTML + commsHTML + meetingsHTML + profileRunsHTML;

    return this.shellHTML({
      title: `${name} · Agentic OS`,
      eyebrow: `PROFILE · ${today.toFormat("EEEE, MMM d")}`,
      backHref: "Dashboard/Home",
      brandLabel: name,
      brandSub: "Agentic OS",
      avatar: this.avatarFor(name),
      sidebarItems: [
        { icon: "home",     label: "Overview",     view: "overview", active: true },
        { icon: "flame",    label: "Intelligence", view: "intelligence" },
        { icon: "zap",      label: "Research",     view: "research" },
        { icon: "users",    label: "Community",    view: "community" },
        { icon: "chart",    label: "YouTube",      view: "youtube" },
        { icon: "users",    label: "Comms",        view: "comms" },
        { icon: "calendar", label: "Meetings",     view: "meetings" },
        { icon: "refresh",  label: "Runs",         view: "runs" },
        { icon: "book",     label: "Vault Overview", href: "Dashboard/Vault-Overview" },
      ],
      topActions: [
        { icon: "🌅", label: "Morning brief", variant: "primary", cmd: "obsidian-shellcommands:shell-command-morning-brief" },
        { icon: "📝", label: "New daily",                         cmd: "obsidian-shellcommands:shell-command-new-daily" },
        { icon: "💬", label: "Launch Claude",        variant: "dark",    cmd: "terminal:open-terminal.claude.root" },
      ],
      viewsHTML,
    });
  }

  // ===================================================================
  // CLAUDE -p BACKGROUND RUNS (Operator actions)
  // ===================================================================
  claudePrompts() {
    // Installer writes prompts into this.constructor.CONFIG.CLAUDE_PROMPTS. Pattern per entry:
    //   key: { label, prompt }
    // Use {profile} in the prompt to interpolate the current profile name.
    return this.constructor.CONFIG.CLAUDE_PROMPTS || {};
  }

  runStore() {
    if (!window._ccClaudeRuns) window._ccClaudeRuns = [];
    return window._ccClaudeRuns;
  }

  vaultBasePath() {
    return app.vault.adapter?.basePath || app.vault.adapter?.getBasePath?.() || "";
  }

  runCardHTML(run) {
    const statusClass = {
      running:   "cc-chip-primary",
      completed: "cc-chip-accent",
      error:     "cc-chip-alert",
    }[run.status] || "";
    const elapsed = run.endedAt
      ? Math.round((run.endedAt - run.startedAt) / 1000)
      : Math.round((Date.now() - run.startedAt) / 1000);
    const summary = run.summary || `${elapsed}s`;
    // Auto-open the output while running, collapse when completed.
    const outputOpen = run.status === "running" ? "open" : "";
    return `
      <div class="cc-card cc-run-card" data-run-id="${this.esc(run.id)}" style="margin-top:10px;padding:14px;border:1px solid #020309;border-radius:10px;background:#fff;color:#020309;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <strong style="font-size:13px;color:#020309;">${this.esc(run.label)}</strong>
            <span class="cc-chip ${statusClass}">${run.status}</span>
            <span class="cc-run-elapsed" style="font-size:11px;color:#020309;opacity:0.55;">${this.esc(summary)}</span>
          </div>
          <div class="cc-run-actions" style="display:flex;gap:6px;">
            ${run.status === "running"
              ? `<button class="cc-btn cc-run-stop" data-run-id="${this.esc(run.id)}">stop</button>`
              : `<button class="cc-btn cc-run-clear" data-run-id="${this.esc(run.id)}">clear</button>`}
          </div>
        </div>
        <details style="margin-bottom:10px;">
          <summary style="cursor:pointer;font-size:11px;color:#020309;opacity:0.65;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Prompt</summary>
          <div style="margin-top:6px;padding:10px;background:#f6f1e1;border:1px solid #020309;border-radius:6px;font-size:12px;line-height:1.5;color:#020309;white-space:pre-wrap;font-family:var(--font-monospace);">${this.esc(run.prompt)}</div>
        </details>
        <details class="cc-run-output-wrap" ${outputOpen}>
          <summary style="cursor:pointer;font-size:11px;color:#020309;opacity:0.65;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Output</summary>
          <div class="cc-run-output" style="margin-top:6px;max-height:320px;min-height:60px;overflow:auto;padding:10px;background:#020309;color:#e8f0c9;border-radius:6px;font-size:11px;line-height:1.5;white-space:pre-wrap;word-break:break-word;font-family:var(--font-monospace);">${this.esc(run.output || "(waiting for output…)")}</div>
        </details>
      </div>`;
  }

  refreshRun(root, run) {
    // Only update containers whose scope matches this run.
    // A container declares its scope via data-runs-scope ("global" or a profile name).
    document.querySelectorAll("[data-runs-scope]").forEach(container => {
      if (container.dataset.runsScope !== (run.scope || "global")) return;
      let card = container.querySelector(`[data-run-id="${run.id}"]`);
      if (!card) {
        container.insertAdjacentHTML("afterbegin", this.runCardHTML(run));
        card = container.querySelector(`[data-run-id="${run.id}"]`);
        this.wireRunCard(root, card);
        return;
      }
      // In-place updates so user-set scroll on the <pre> is preserved.
      const statusPill = card.querySelector(".cc-chip");
      if (statusPill) {
        statusPill.textContent = run.status;
        statusPill.className = "cc-chip " + ({
          running: "cc-chip-primary", completed: "cc-chip-accent", error: "cc-chip-alert",
        }[run.status] || "");
      }
      const elapsedEl = card.querySelector(".cc-run-elapsed");
      if (elapsedEl) {
        const elapsed = run.endedAt
          ? Math.round((run.endedAt - run.startedAt) / 1000)
          : Math.round((Date.now() - run.startedAt) / 1000);
        elapsedEl.textContent = run.summary || `${elapsed}s`;
      }
      const out = card.querySelector(".cc-run-output");
      if (out) {
        const wasAtBottom = (out.scrollHeight - out.scrollTop - out.clientHeight) < 40;
        out.textContent = run.output || "(waiting for output…)";
        if (wasAtBottom) out.scrollTop = out.scrollHeight;
      }
      // Auto-collapse the output drawer once the run transitions to completed.
      const wrap = card.querySelector(".cc-run-output-wrap");
      if (wrap) {
        if (run.status === "running" && !wrap.hasAttribute("open")) wrap.setAttribute("open", "");
        if (run.status !== "running" && wrap.hasAttribute("open") && !card.dataset.collapsed) {
          wrap.removeAttribute("open");
          card.dataset.collapsed = "1"; // collapse once, don't fight user re-opening it
        }
      }
      // Toggle stop/clear button
      const btnWrap = card.querySelector(".cc-run-actions");
      if (btnWrap) {
        btnWrap.innerHTML = run.status === "running"
          ? `<button class="cc-btn cc-run-stop" data-run-id="${this.esc(run.id)}">stop</button>`
          : `<button class="cc-btn cc-run-clear" data-run-id="${this.esc(run.id)}">clear</button>`;
        this.wireRunCard(root, card);
      }
    });
  }

  wireRunCard(root, card) {
    card.querySelectorAll(".cc-run-stop").forEach(b => {
      b.addEventListener("click", () => {
        const run = this.runStore().find(r => r.id === b.dataset.runId);
        if (!run?.child) return;
        const pid = run.child.pid;
        // Signal the process group (claude + any children it spawned).
        // SIGTERM first, then SIGKILL after 2s if still alive.
        const sig = (s) => { try { process.kill(-pid, s); } catch { try { run.child.kill(s); } catch {} } };
        sig("SIGTERM");
        setTimeout(() => { if (run.status === "running") sig("SIGKILL"); }, 2000);
        run.output += "\n[stopped by user]\n";
        this.refreshRun(document.querySelector(".cc-root"), run);
      });
    });
    card.querySelectorAll(".cc-run-clear").forEach(b => {
      b.addEventListener("click", () => {
        const store = this.runStore();
        const i = store.findIndex(r => r.id === b.dataset.runId);
        if (i >= 0) store.splice(i, 1);
        card.remove();
      });
    });
  }

  restoreRunHistory(root) {
    // Render runs into whichever scoped container is on this page.
    // refreshRun prepends each card via insertAdjacentHTML("afterbegin"), so
    // we iterate OLDEST-FIRST to leave the newest card at the top.
    const containers = root.querySelectorAll("[data-runs-scope]");
    if (!containers.length) return;
    const runs = this.runStore();
    containers.forEach(container => {
      const scope = container.dataset.runsScope;
      container.innerHTML = "";
      runs
        .filter(r => (r.scope || "global") === scope)
        .slice()
        .sort((a, b) => (a.startedAt || 0) - (b.startedAt || 0)) // oldest first
        .forEach(r => this.refreshRun(root, r));
    });
  }

  runClaude(key, root, ctx = {}) {
    const def = this.claudePrompts()[key];
    if (!def) return;
    const cwd = this.vaultBasePath();
    if (!cwd) { console.error("[dashboard] vault base path not resolvable"); return; }

    let spawn;
    try {
      spawn = require("child_process").spawn;
    } catch (e) {
      console.error("[dashboard] child_process unavailable", e);
      return;
    }

    const substitute = (s) => String(s || "").replace(/\{(\w+)\}/g, (_, k) => ctx[k] ?? `{${k}}`);
    const finalPrompt = substitute(def.prompt || "");
    const finalRaw    = def.raw ? substitute(def.raw) : null;

    const shellPath = process.env.SHELL || "/bin/zsh";
    const isRaw = !!def.raw;
    const shellCmd = isRaw
      ? finalRaw
      : `exec claude -p '${finalPrompt.replace(/'/g, "'\\''")}' --output-format stream-json --verbose --dangerously-skip-permissions`;

    const id = `${key}-${Date.now()}`;
    const scope = ctx.profile || "global";
    const labelSuffix = ctx.profile ? ` · ${ctx.profile}` : "";
    const run = {
      id, key, scope,
      label: (def.label || key) + labelSuffix,
      prompt: finalPrompt || finalRaw || "",
      status: "running",
      output: "",
      summary: null,
      startedAt: Date.now(),
      endedAt: null,
      child: null,
      isRaw,
    };
    this.runStore().unshift(run);
    this.refreshRun(root, run);
    this.refreshLastRunLabels(document);
    console.log("[dashboard] spawning", { shellPath, cwd, shellCmd });

    let child;
    try {
      child = spawn(
        shellPath,
        ["-l", "-c", shellCmd],
        { cwd, env: { ...process.env }, detached: true }
      );
    } catch (err) {
      run.status = "error";
      run.output = `Failed to spawn claude: ${err.message}\n\nIs the claude CLI on PATH? Try: which claude`;
      run.endedAt = Date.now();
      this.refreshRun(root, run);
      return;
    }
    run.child = child;
    run._buf = ""; // partial-line buffer for JSON parsing
    run.output = "Launching claude…\n";
    this.refreshRun(root, run);
    console.log("[dashboard] spawned pid=", child.pid);

    const appendText = (s) => {
      run.output += s;
      this.refreshRun(root, run);
    };

    const describeTool = (name, input) => {
      input = input || {};
      switch (name) {
        case "Read":      return `Reading ${input.file_path || ""}`;
        case "Write":     return `Writing ${input.file_path || ""}`;
        case "Edit":      return `Editing ${input.file_path || ""}`;
        case "Glob":      return `Searching for ${input.pattern || ""}${input.path ? " in " + input.path : ""}`;
        case "Grep":      return `Grep "${(input.pattern || "").slice(0,60)}"${input.path ? " in " + input.path : ""}`;
        case "Bash":      return `Bash: ${(input.command || "").slice(0,100)}`;
        case "WebFetch":  return `Fetching ${input.url || ""}`;
        case "WebSearch": return `Web search: ${input.query || ""}`;
        case "TodoWrite": return `Updating todo list (${(input.todos || []).length} items)`;
        case "Task":      return `Subagent: ${input.description || input.subagent_type || ""}`;
        default: {
          const summary = Object.entries(input).slice(0, 2)
            .map(([k, v]) => `${k}=${String(v).slice(0, 60)}`).join(" ");
          return `${name}${summary ? " · " + summary : ""}`;
        }
      }
    };

    const handleEvent = (ev) => {
      try {
        if (ev.type === "system" && ev.subtype === "init") {
          appendText(`Starting (${ev.model || "claude"})\n`);
        } else if (ev.type === "assistant" && ev.message?.content) {
          for (const c of ev.message.content) {
            if (c.type === "text" && c.text) appendText(c.text);
            else if (c.type === "tool_use") appendText(`\n→ ${describeTool(c.name, c.input)}\n`);
            // thinking blocks are internal — skip
          }
        } else if (ev.type === "user" && ev.message?.content) {
          // tool results would be too noisy in the live view — skip
        } else if (ev.type === "result") {
          const cost = ev.total_cost_usd ?? ev.cost_usd ?? 0;
          const secs = Math.round((ev.duration_ms || 0) / 100) / 10;
          run.summary = `${secs}s · $${cost.toFixed(3)}`;
        }
      } catch (e) {
        // ignore malformed events
      }
    };

    const onStdout = (chunk) => {
      const s = chunk.toString();
      console.log("[dashboard] stdout chunk", s.length, "bytes");
      if (run.isRaw) { appendText(s); return; }
      run._buf += s;
      const lines = run._buf.split("\n");
      run._buf = lines.pop(); // keep last partial line
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        if (trimmed.startsWith("{")) {
          try { handleEvent(JSON.parse(trimmed)); continue; } catch {}
        }
        appendText(trimmed + "\n");
      }
    };
    const onStderr = (chunk) => {
      const s = chunk.toString();
      run.stderr = (run.stderr || "") + s;
      // Filter known harmless warnings from the user-visible output.
      if (/no stdin data received/i.test(s)) return;
      appendText(s);
    };
    child.stdout.on("data", onStdout);
    child.stderr.on("data", onStderr);

    child.on("error", (err) => {
      run.status = "error";
      run.output += `\n[error] ${err.message}\n`;
      run.endedAt = Date.now();
      this.refreshRun(root, run);
      this.persistRuns();
    });
    child.on("close", (code) => {
      // flush any trailing buffer
      if (run._buf) { appendText(run._buf); run._buf = ""; }
      run.status = code === 0 ? "completed" : "error";
      if (code !== 0) run.output += `\n[exit code ${code}]`;
      run.endedAt = Date.now();
      run.child = null;
      this.refreshRun(root, run);
      this.refreshLastRunLabels(document);
      this.persistRuns();
    });
  }

  // -------------------------------------------------------------------
  // Run persistence (survives Obsidian reloads)
  // Global runs → Dashboard/runs.json
  // Profile runs → <profile-folder>/runs.json
  // -------------------------------------------------------------------
  runsPathFor(scope) {
    return scope === "global"
      ? "Dashboard/runs.json"
      : `${this.profileRunsPath(scope)}`;
  }

  slimRun(r) {
    return {
      id: r.id, key: r.key, scope: r.scope || "global",
      label: r.label, prompt: r.prompt,
      status: r.status, output: r.output, summary: r.summary,
      startedAt: r.startedAt, endedAt: r.endedAt,
    };
  }

  async persistRuns() {
    try {
      const adapter = app.vault.adapter;
      const store = this.runStore().filter(r => r.status !== "running");
      const byScope = {};
      for (const r of store) {
        const s = r.scope || "global";
        (byScope[s] = byScope[s] || []).push(this.slimRun(r));
      }
      for (const [scope, runs] of Object.entries(byScope)) {
        const path = this.runsPathFor(scope);
        // ensure parent folder exists for profile paths
        if (scope !== "global") {
          const folder = path.split("/").slice(0, -1).join("/");
          if (!(await adapter.exists(folder))) {
            try { await adapter.mkdir(folder); } catch {}
          }
        }
        await adapter.write(path, JSON.stringify(runs.slice(0, 50), null, 2));
      }
    } catch (e) {
      console.warn("[dashboard] persistRuns failed", e);
    }
  }

  async loadPersistedRuns() {
    const adapter = app.vault.adapter;
    const all = [];
    // Global
    try {
      if (await adapter.exists("Dashboard/runs.json")) {
        const raw = await adapter.read("Dashboard/runs.json");
        const parsed = JSON.parse(raw) || [];
        for (const r of parsed) all.push({ ...r, scope: r.scope || "global" });
      }
    } catch (e) { /* ignore */ }
    // Per-profile
    try {
      const profilesFolder = app.vault.getAbstractFileByPath(this.constructor.CONFIG.PROFILE_FOLDER_PATTERN.replace("{ORG}", this.constructor.CONFIG.ORG_NAME).replace("/{name}", ""));
      if (profilesFolder?.children) {
        for (const p of profilesFolder.children) {
          if (!p.children) continue;
          const path = `${this.profileRunsPath(p.name)}`;
          if (!(await adapter.exists(path))) continue;
          try {
            const raw = await adapter.read(path);
            const parsed = JSON.parse(raw) || [];
            for (const r of parsed) all.push({ ...r, scope: r.scope || p.name });
          } catch (e) { /* ignore */ }
        }
      }
    } catch (e) { /* ignore */ }
    return all;
  }

  async hydrateRunsOnce() {
    if (window._ccRunsHydrated) return;
    window._ccRunsHydrated = true;
    const persisted = await this.loadPersistedRuns();
    const store = this.runStore();
    const existingIds = new Set(store.map(r => r.id));
    for (const r of persisted) {
      if (!existingIds.has(r.id)) store.push(r);
    }
    store.sort((a, b) => b.startedAt - a.startedAt);
  }

  // ===================================================================
  // VAULT OVERVIEW (Vault-Overview.md) — returns HTML string
  // OS schematic: folders, rules, skills, profiles, operator, pipelines.
  // ===================================================================
  async buildOverviewHTML(dv) {
    const today = dv.luxon.DateTime.now();
    const all = app.vault.getAllLoadedFiles();
    const md = all.filter(f => f.extension === "md" && !f.path.startsWith(".trash"));
    const claudeFiles = md.filter(f => f.name === "CLAUDE.md");
    const skillsFolder = this.constructor.CONFIG.SKILLS_FOLDER ? all.find(f => f.path === this.constructor.CONFIG.SKILLS_FOLDER && f.children) : null;
    const skillNames = skillsFolder ? skillsFolder.children.filter(x => x.children).map(x => x.name).sort() : [];
    const profilesFolder = all.find(f => f.path === this.constructor.CONFIG.PROFILE_FOLDER_PATTERN.replace("{ORG}", this.constructor.CONFIG.ORG_NAME).replace("/{name}", "") && f.children);
    const profiles = profilesFolder ? profilesFolder.children.filter(x => x.children).map(x => x.name) : [];
    const depts = all.filter(f => f.path?.startsWith("Departments/") && f.children && f.path.split("/").length === 2).map(f => f.name);
    const dailies = md.filter(f => f.path.startsWith("Daily/")).length;
    const meetings = md.filter(f => f.path.startsWith("Intelligence/meetings/")).length;
    const decisions = md.filter(f => f.path.startsWith("Intelligence/decisions/")).length;

    const folderRows = (this.constructor.CONFIG.OVERVIEW_FOLDERS && this.constructor.CONFIG.OVERVIEW_FOLDERS.length)
      ? this.constructor.CONFIG.OVERVIEW_FOLDERS
      : (all.filter(f => f.children && !f.path.startsWith(".")).slice(0, 12)
          .map(f => [f.path + "/", "Top-level folder", null]));

    const rulebook = [
      { p: "CLAUDE", l: "Root" },
      { p: "Dashboard/CLAUDE", l: "Dashboard" },
      ...(this.constructor.CONFIG.OVERVIEW_FOLDERS || []).map(([path, _, claude]) => ({ p: claude || (path + "CLAUDE"), l: path.replace(/\/$/, "") })),
    ].filter(r => r.p);

    const skillGroups = this.constructor.CONFIG.SKILL_GROUPS || {};

    const projectCats = (this.constructor.CONFIG.PROJECT_CATEGORIES || []).map(c => {
      const folder = app.vault.getAbstractFileByPath(`Projects/${c}`);
      const n = folder?.children?.filter(x => x.children).length ?? 0;
      return { c, n };
    });

    const connectors = this.constructor.CONFIG.CONNECTORS || [];

    const cheatsheet = this.constructor.CONFIG.CHEATSHEET || [];

    const today_str = today.toFormat("yyyy-MM-dd");
    const todayDaily = app.vault.getAbstractFileByPath(`Daily/${today_str}.md`);
    const fm = todayDaily ? (app.metadataCache.getFileCache(todayDaily)?.frontmatter || {}) : {};
    const operatorFields = ["meetings","slack_messages","circle_posts","tasks_created","tasks_completed","escalations_open"];

    const recent = md
      .sort((a,b) => b.stat.mtime - a.stat.mtime)
      .slice(0, 12);

    // ---------- Build view ----------
    const overviewHTML = `
<section class="cc-view" data-view="overview">

  <div class="cc-kpis">
    <div class="cc-kpi cc-kpi-primary">
      <div class="cc-kpi-head"><span class="cc-kpi-label">Markdown files</span></div>
      <div class="cc-kpi-value">${md.length}</div>
      <div class="cc-kpi-foot">total in vault</div>
    </div>
    <div class="cc-kpi">
      <div class="cc-kpi-head"><span class="cc-kpi-label">CLAUDE.md rules</span></div>
      <div class="cc-kpi-value">${claudeFiles.length}</div>
      <div class="cc-kpi-foot">cascading instruction files</div>
    </div>
    <div class="cc-kpi">
      <div class="cc-kpi-head"><span class="cc-kpi-label">Skills</span></div>
      <div class="cc-kpi-value">${skillNames.length}</div>
      <div class="cc-kpi-foot">${this.constructor.CONFIG.SKILLS_FOLDER ? "in " + this.constructor.CONFIG.SKILLS_FOLDER.split("/").pop() : "(none configured)"}</div>
    </div>
    <div class="cc-kpi">
      <div class="cc-kpi-head"><span class="cc-kpi-label">Profiles</span></div>
      <div class="cc-kpi-value">${profiles.length}</div>
      <div class="cc-kpi-foot">${depts.length} departments · ${dailies} root dailies</div>
    </div>
  </div>

  <div class="cc-card cc-card-wide">
    <div class="cc-card-head">
      <h3>Actions</h3>
      <a class="cc-tag cc-nav-btn" data-view="runs" style="cursor:pointer;">View run history →</a>
    </div>
    <div class="cc-card-body">
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-start;">
        ${this.actionButton("optimizer",    "⚙️ OS Optimizer",    { variant: "primary" })}
        ${this.actionButton("lint",         "🧹 Lint",            {})}
        ${this.actionButton("checkProfile", "👤 Check profile",   {})}
        ${this.actionButton("auditDailies", "📅 Audit dailies",   {})}
        ${this.actionButton("operatorRun",  "📊 Operator refresh",{})}
        ${this.actionButton("linkHealth",   "🔗 Link health",     {})}
      </div>
      <p style="margin:10px 0 0;font-size:12px;opacity:0.65;">Output streams to <a class="cc-nav-btn" data-view="runs" style="cursor:pointer;text-decoration:underline;">Runs</a>. History persists across reloads.</p>
    </div>
  </div>

  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Vault map</h3><span class="cc-tag">${folderRows.length} folders</span></div>
    <div class="cc-card-body">
      <table class="cc-table">
        <thead><tr><th style="width:180px">Folder</th><th>What lives here</th><th style="width:80px">Rules</th></tr></thead>
        <tbody>
          ${folderRows.map(([folder, desc, rulePath]) => `
            <tr>
              <td><code>${this.esc(folder)}</code></td>
              <td>${this.esc(desc)}</td>
              <td>${rulePath ? `<a class="cc-link" data-href="${this.esc(rulePath)}">→</a>` : `<span class="cc-muted">·</span>`}</td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>
  </div>

  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Rulebook · CLAUDE.md cascade</h3><span class="cc-tag">${rulebook.length}</span></div>
    <div class="cc-card-body">
      <div class="cc-person-chips" style="gap:6px;flex-wrap:wrap;">
        ${rulebook.map(r => `<a class="cc-chip cc-link" data-href="${this.esc(r.p)}">${this.esc(r.l)}</a>`).join("")}
      </div>
    </div>
  </div>

</section>`;

    const skillsHTML = `
<section class="cc-view" data-view="skills" hidden>
  ${Object.entries(skillGroups).map(([group, list]) => `
    <div class="cc-card cc-card-wide">
      <div class="cc-card-head"><h3>${this.esc(group)}</h3><span class="cc-tag">${list.length}</span></div>
      <div class="cc-card-body">
        <div class="cc-person-chips" style="gap:6px;flex-wrap:wrap;">
          ${list.map(s => `<a class="cc-chip cc-link" data-href="${this.constructor.CONFIG.SKILLS_FOLDER}/${s}">${this.esc(s)}</a>`).join("")}
        </div>
      </div>
    </div>`).join("")}
  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Full skill registry</h3><span class="cc-tag">${skillNames.length}</span></div>
    <div class="cc-card-body">
      <p style="margin:0 0 8px;opacity:0.7;font-size:13px;">Every folder under <code>${this.constructor.CONFIG.SKILLS_FOLDER || "(no skills folder configured)"}/</code>.</p>
      <div class="cc-person-chips" style="gap:6px;flex-wrap:wrap;">
        ${skillNames.map(s => `<a class="cc-chip cc-link" data-href="${this.constructor.CONFIG.SKILLS_FOLDER}/${s}">${this.esc(s)}</a>`).join("")}
      </div>
    </div>
  </div>
</section>`;

    const operatorHTML = `
<section class="cc-view" data-view="operator" hidden>
  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Vault Operator</h3><span class="cc-tag">ETL · hourly</span></div>
    <div class="cc-card-body">
      <p style="margin:0 0 12px;">The ETL layer between raw vault activity and the dashboards. Dashboard is read-only. The Operator writes the frontmatter the dashboards consume.</p>
      <div class="cc-person-chips" style="gap:6px;">      </div>
    </div>
  </div>


  <div class="cc-grid cc-grid-2">
    <div class="cc-card">
      <div class="cc-card-head"><h3>Root daily fields</h3></div>
      <div class="cc-card-body">
        <div class="cc-person-chips" style="gap:4px;flex-wrap:wrap;">
          ${["meetings","meeting_minutes","slack_messages","slack_threads","circle_posts","circle_replies","escalations_open","escalations_resolved","tasks_created","tasks_completed","active_team"].map(k => `<span class="cc-chip">${k}</span>`).join("")}
        </div>
      </div>
    </div>
    <div class="cc-card">
      <div class="cc-card-head"><h3>Profile daily fields</h3></div>
      <div class="cc-card-body">
        <div class="cc-person-chips" style="gap:4px;flex-wrap:wrap;">
          ${["energy","focus","wins_today","open_loops","meetings_attended","outputs_published"].map(k => `<span class="cc-chip">${k}</span>`).join("")}
        </div>
      </div>
    </div>
  </div>

  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Today's Operator output</h3><span class="cc-tag">${today_str}</span></div>
    <div class="cc-card-body">
      ${todayDaily
        ? `<table class="cc-table">
            <thead><tr><th style="width:200px">Field</th><th>Value</th></tr></thead>
            <tbody>${operatorFields.map(k => `<tr><td><code>${k}</code></td><td>${fm[k] != null ? this.esc(String(fm[k])) : `<span class="cc-muted">·</span>`}</td></tr>`).join("")}</tbody>
          </table>`
        : `<div class="cc-empty">No root daily for ${today_str} yet.</div>`}
    </div>
  </div>
</section>`;

    const atlasHTML = `
<section class="cc-view" data-view="atlas" hidden>
  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Dashboards</h3><span class="cc-tag">${this.constructor.CONFIG.PROFILES.length + 3}</span></div>
    <div class="cc-card-body">
      <div class="cc-person-chips" style="gap:6px;flex-wrap:wrap;">
        <a class="cc-chip cc-chip-primary cc-link" data-href="Dashboard/Home">Home</a>
        ${this.constructor.CONFIG.PROFILES.map(n => `<a class="cc-chip cc-link" data-href="Dashboard/${n}">${this.esc(n)}</a>`).join("")}
        <a class="cc-chip cc-link" data-href="Dashboard/Vault-Overview">Vault Overview</a>
        <a class="cc-chip cc-link" data-href="Dashboard/Setup">Setup</a>
      </div>
    </div>
  </div>

  <div class="cc-grid cc-grid-2">
    <div class="cc-card">
      <div class="cc-card-head"><h3>Profiles</h3><span class="cc-tag">${profiles.length}</span></div>
      <div class="cc-card-body">
        <div class="cc-person-chips" style="gap:6px;flex-wrap:wrap;">
          ${profiles.map(n => `<a class="cc-chip cc-link" data-href="${this.profilePath(n)}/${n}">${this.esc(n)}</a>`).join("")}
        </div>
      </div>
    </div>
    <div class="cc-card">
      <div class="cc-card-head"><h3>Departments</h3><span class="cc-tag">${depts.length}</span></div>
      <div class="cc-card-body">
        <div class="cc-person-chips" style="gap:6px;flex-wrap:wrap;">
          ${depts.map(d => `<a class="cc-chip cc-link" data-href="Departments/${d}/CLAUDE">${this.esc(d)}</a>`).join("")}
        </div>
      </div>
    </div>
  </div>

  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Project categories</h3><span class="cc-tag">${projectCats.reduce((a,b)=>a+b.n,0)} active</span></div>
    <div class="cc-card-body">
      <table class="cc-table">
        <thead><tr><th style="width:200px">Category</th><th>Active projects</th></tr></thead>
        <tbody>
          ${projectCats.map(({c,n}) => `<tr><td><a class="cc-link" data-href="Projects/${c}/CLAUDE">${this.esc(c)}</a></td><td>${n}</td></tr>`).join("")}
        </tbody>
      </table>
    </div>
  </div>

  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Connectors and MCPs</h3><span class="cc-tag">${connectors.length}</span></div>
    <div class="cc-card-body">
      <table class="cc-table">
        <thead><tr><th style="width:220px">Connector</th><th>Purpose</th></tr></thead>
        <tbody>${connectors.map(([n,p]) => `<tr><td><strong>${this.esc(n)}</strong></td><td>${this.esc(p)}</td></tr>`).join("")}</tbody>
      </table>
    </div>
  </div>

  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Daily flow</h3></div>
    <div class="cc-card-body">
      <p style="margin:0;">Team works in vault → Vault Operator hourly ETL → frontmatter populated → Dashboard renders.</p>
    </div>
  </div>
  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Content pipeline</h3></div>
    <div class="cc-card-body">
      <div class="cc-person-chips" style="gap:6px;flex-wrap:wrap;align-items:center;">
        ${["video-research","video-outline","video-slide-plan","video-slide-visuals","repurposing","yt-to-community","yt-to-course"].map((s,i,a) => `<span class="cc-chip">${s}</span>${i<a.length-1?'<span style="opacity:0.4">→</span>':''}`).join("")}
      </div>
    </div>
  </div>
  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Sales pipeline</h3></div>
    <div class="cc-card-body">
      <div class="cc-person-chips" style="gap:6px;flex-wrap:wrap;align-items:center;">
        ${["email-triage","email-sales-copy","failed-payment-recovery","churn-recovery-daily","weekly-report"].map((s,i,a) => `<span class="cc-chip">${s}</span>${i<a.length-1?'<span style="opacity:0.4">→</span>':''}`).join("")}
      </div>
    </div>
  </div>
  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Community pipeline</h3></div>
    <div class="cc-card-body">
      <div class="cc-person-chips" style="gap:6px;flex-wrap:wrap;align-items:center;">
        ${["community-responder","dm-responder","community","weekly-report"].map((s,i,a) => `<span class="cc-chip">${s}</span>${i<a.length-1?'<span style="opacity:0.4">→</span>':''}`).join("")}
      </div>
    </div>
  </div>

  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Where do I put X</h3></div>
    <div class="cc-card-body">
      <table class="cc-table">
        <thead><tr><th style="width:280px">Thing</th><th>Goes in</th></tr></thead>
        <tbody>${cheatsheet.map(([t,p]) => `<tr><td><strong>${this.esc(t)}</strong></td><td><code>${this.esc(p)}</code></td></tr>`).join("")}</tbody>
      </table>
    </div>
  </div>
  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Anti-patterns</h3></div>
    <div class="cc-card-body">
      <ul class="cc-md-list">
        <li>Creating files in the vault root. Everything lives in an existing folder.</li>
        <li>Orphan notes with no wikilink from anywhere else.</li>
        <li>Writing dashboard logic into markdown shells. It belongs in <code>dashboard.js</code>.</li>
        <li>Stuffing all project info into one README. Route to subdirs.</li>
        <li>Using em dashes anywhere in the vault.</li>
        <li>Vault Operator writing fields the dashboard never reads (drift).</li>
      </ul>
    </div>
  </div>
  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Recently updated</h3><span class="cc-tag">${recent.length}</span></div>
    <div class="cc-card-body">
      <table class="cc-table">
        <thead><tr><th>File</th><th style="width:140px">Updated</th></tr></thead>
        <tbody>${recent.map(f => `<tr><td><a class="cc-link" data-href="${this.esc(f.path)}">${this.esc(f.basename)}</a></td><td>${this.rel(dv.luxon.DateTime.fromMillis(f.stat.mtime), today)}</td></tr>`).join("")}</tbody>
      </table>
    </div>
  </div>
</section>`;

    // Hydrate persisted runs (one-shot per session) so the Runs view shows
    // history from previous sessions. Fire-and-forget, runs are rendered
    // by wire()'s restoreRunHistory once hydration completes.
    this.hydrateRunsOnce().then(() => {
      const r = document.querySelector(".cc-root:not(.cc-loading)");
      if (r) this.restoreRunHistory(r);
      this.refreshLastRunLabels(document);
    });

    const runsHTML = `
<section class="cc-view" data-view="runs" hidden>
  <div class="cc-card cc-card-wide">
    <div class="cc-card-head"><h3>Background runs</h3><span class="cc-tag">claude -p · history</span></div>
    <div class="cc-card-body">
      <p style="margin:0 0 8px;opacity:0.7;font-size:13px;">History of every action launched from the Overview. Persists across reloads.</p>
      <div id="cc-claude-runs-all" class="cc-claude-runs" data-runs-scope="global"></div>
    </div>
  </div>
</section>`;

    const viewsHTML = overviewHTML + skillsHTML + operatorHTML + runsHTML + atlasHTML;

    return this.shellHTML({
      title: "Vault Overview",
      eyebrow: `OS SCHEMATIC · ${today.toFormat("EEEE, MMM d")}`,
      avatar: this.brandMark(),
      backHref: "Dashboard/Home",
      sidebarItems: [
        { icon: "home",     label: "Overview",  view: "overview",  active: true },
        { icon: "zap",      label: "Skills",    view: "skills" },
        { icon: "refresh",  label: "Operator",  view: "operator" },
        { icon: "flame",    label: "Runs",      view: "runs" },
        { icon: "book",     label: "Atlas",     view: "atlas" },
      ],
      topActions: [
        { icon: "💬", label: "Launch Claude", variant: "dark", cmd: "terminal:open-terminal.claude.root" },
      ],
      viewsHTML,
    });
  }
}
