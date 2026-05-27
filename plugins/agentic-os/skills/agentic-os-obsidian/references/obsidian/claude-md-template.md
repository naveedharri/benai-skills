This folder is the vault's command center. Lives at the vault root. Open daily.

## Files

- `Home.md` — team-wide dashboard. Reads root daily folder + each profile's daily folder. Default homepage.
- `Vault-Overview.md` — top-level folder health view. Reads folder structure + recent edits.
- `{Profile}.md` — per-profile dashboards. Each reads that profile's data from `{{PROFILE_FOLDER_PATTERN}}`.
- `components/dashboard.js` — shared rendering module. CustomJS plugin loads it. Has a `CONFIG` block at the top — edit only there. Class name `dashboard`, entry method `render(dv, opts)`.
- `lib/frappe-charts.min.js` — charting library, loaded on demand by the renderer.

## How rendering works

Each `.md` file is a thin shell — frontmatter + a single `dataviewjs` block that delegates to the shared renderer:

```dataviewjs
const { dashboard } = customJS;
await dashboard.render(dv, { scope: "team" });                       // Home.md
await dashboard.render(dv, { scope: "profile", name: "Alex" });      // {Profile}.md
await dashboard.render(dv, { scope: "overview" });                   // Vault-Overview.md
```

All visual + data logic lives in `components/dashboard.js`. Editing it updates every page.

Styling lives in `.obsidian/snippets/command-center.css` and applies via `cssclasses: [command-center]` in the frontmatter of each dashboard page.

## Data contract

The dashboard reads frontmatter from daily notes. Fields it understands (all optional — missing fields show "—" or 0; the dashboard never crashes on missing data):

**Root daily** (`<ROOT_DAILY_PATH>/YYYY-MM-DD.md`):
- `meetings`, `meeting_minutes`, `slack_messages`, `slack_threads`, `circle_posts`, `circle_replies`, `escalations_open`, `escalations_resolved`, `tasks_created`, `tasks_completed`, `active_team`

**Profile daily** (`{{PROFILE_FOLDER_PATTERN}}/<DAILY_SUBPATH>/YYYY-MM-DD.md`):
- `energy` (0-10), `focus` (string), `wins_today`, `open_loops`, `meetings_attended`, `outputs_published`

## Rules

- Never put dashboard logic in the `.md` files. They are thin shells. All logic in `components/dashboard.js`.
- The CSS class `command-center` activates the styled look. Always include it in page frontmatter.
- Never use raw HTML divs at the markdown level. Render through dataviewjs only.
- When adding a new widget: add the data query + rendering method in `dashboard.js`, then call it from `buildTeamHTML`, `buildProfileHTML`, or `buildOverviewHTML`.
- When adding a new profile: add the name to `CONFIG.PROFILES` and create `Dashboard/{Name}.md` from any existing profile page (update the `name` argument).

## Anti-patterns

- Don't write data INTO dailies from the dashboard. Dashboard is read-only.
- Don't per-profile customize `{Name}.md` — those files are intentionally identical. Branch behavior inside `dashboard.js` based on the `name` passed to `render()`.
