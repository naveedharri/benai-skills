---
type: setup-guide
related: "[[Home]]"
status: ready-to-install
tags: [setup, dashboard, command-center]
---

> [!important] What this is
> Reference guide for your {{BRAND_LABEL}} command-center dashboard. The installer already wrote all files, side-loaded plugins, registered the Claude terminal profile, wired the buttons, and enabled the CSS snippet. This page is for tweaking and troubleshooting later.

## After install

Restart Obsidian (Cmd/Ctrl + Q, then reopen). When prompted, click **Trust** for each of the 5 plugins. Then open `Dashboard/Home`. It should render with KPI cards, charts, and the button bar.

## What's installed

| Component | Where | What it does |
|---|---|---|
| `Dashboard/components/dashboard.js` | this folder | The renderer. Has a `CONFIG` block at the top with paths, profiles, buttons, colors. Edit values there — don't touch code below. |
| `Dashboard/lib/frappe-charts.min.js` | this folder | Charting library, loaded on demand. |
| `.obsidian/snippets/command-center.css` | snippets folder | Brand styling. Variables at the top control colors. |
| Dataview | community plugins | Runs the `dataviewjs` block in each dashboard page. |
| CustomJS | community plugins | Loads `dashboard.js` so every page shares one renderer. Folder is set to `Dashboard/components`. |
| Shell-commands | community plugins | Wraps `claude -p '...'` invocations as Obsidian commands the dashboard buttons fire. |
| Terminal | community plugins | Provides the integrated terminal pane the "Launch Claude" button drops you into. A "Claude" profile is pre-configured. |
| Homepage | community plugins | Auto-opens `Dashboard/Home` on launch. |

## Customizing

**Change brand colors** — edit `.obsidian/snippets/command-center.css`, top of file (CSS variables).

**Add a profile** — add the name to `CONFIG.PROFILES` in `dashboard.js`, then create `Dashboard/{Name}.md` from any existing profile page (just change the `name` argument in the `dashboard.render()` call).

**Add a button** — append to `CONFIG.BUTTONS.team` or `CONFIG.BUTTONS.profile` in `dashboard.js`. Each entry needs `{ key, label, icon, cmd OR prompt }`. If you give a `prompt`, also register a matching shell-command in Settings → Shell commands with the alias `<kebab-label>`.

**Change paths** — edit `CONFIG.PROFILE_FOLDER_PATTERN`, `DAILY_SUBPATH`, etc. at the top of `dashboard.js`.

**Add a widget** — add a method to the `dashboard` class in `dashboard.js` (data query + HTML), then call it from `buildTeamHTML`, `buildProfileHTML`, or `buildOverviewHTML`.

## Data contract

The renderer reads frontmatter from daily notes. Fields it understands (all optional — missing fields show as "—"):

**Root daily** (your `ROOT_DAILY_PATH/YYYY-MM-DD.md`):
- `meetings`, `meeting_minutes`, `slack_messages`, `slack_threads`, `circle_posts`, `circle_replies`, `tasks_created`, `tasks_completed`, `escalations_open`, `escalations_resolved`, `active_team`

**Profile daily** (under the profile folder):
- `energy` (0-10), `focus` (string), `wins_today`, `open_loops`, `meetings_attended`, `outputs_published`

## Troubleshooting

| Symptom | Fix |
|---|---|
| Raw `dataviewjs` code block visible | Confirm Dataview + CustomJS are toggled ON and Trusted (Settings → Community plugins). Cmd/Ctrl + R. |
| KPIs render but profile data is empty | Check `CONFIG.PROFILE_FOLDER_PATTERN` matches your actual folder layout. Open dev console (Cmd/Ctrl + Opt/Alt + I) for path errors. |
| Button does nothing | The shell-command alias must match the command ID the button references. Settings → Shell commands → confirm the alias. |
| Launch Claude button doesn't open the terminal | Settings → Terminal → confirm the "Claude" profile is present and the `executable` resolves on your machine (`which claude` in shell). |
| No styling | Settings → Appearance → CSS snippets → confirm `command-center` is ON. |
| Homepage doesn't auto-open | Settings → Homepage → confirm "Main Homepage" points to `Dashboard/Home` and "Open on startup" is on. |

## Anti-patterns

- Don't put rendering logic in the `.md` files. They are thin shells — frontmatter + one `dataviewjs` block calling `dashboard.render()`.
- Don't use raw HTML in the `.md` files; render through dataviewjs only.
- Don't write data INTO daily notes from the dashboard. The dashboard is a read-only view layer.
