This folder uses a profile-first team architecture. Each core team member has a self-contained workspace. Data flows UP from profiles to team-level views, never down.

## Profile Layout

Each person lives at `Team/{org}/Profiles/{name}/` with these standard folders:

| Folder | Purpose |
|---|---|
| `{Name}.md` | Identity: role, responsibilities, working style, relationships |
| `Daily/` | Personal daily notes (`YYYY-MM-DD.md`). Source of truth for this person's activity. |
| `task-list/` | Personal tasks (`Tasks.md`, Task Board emoji format). |
| `sub-schedules/` | Person-specific automations only this person runs. |

Extra folders (e.g., `Context/`, `plugins & skills/`) can appear organically when a person needs them.

## Session Scoping (Critical)

When you identify the active profile at session start, write ALL session output to that person's profile folders:
- Daily notes go to `Team/{org}/Profiles/{name}/Daily/YYYY-MM-DD.md`
- Tasks go to `Team/{org}/Profiles/{name}/task-list/Tasks.md`

Do NOT write directly to root `Daily/` during a profile session. That is an aggregated view updated by team schedules.

## Routing

| Type | Route to |
|---|---|
| Operator preferences, style, habits | `Team/{org}/Profiles/{name}/{Name}.md` |
| Person profile, role, working style | `Team/{org}/Profiles/{name}/{Name}.md` |
| Person's daily notes | `Team/{org}/Profiles/{name}/Daily/YYYY-MM-DD.md` |
| Person's tasks | `Team/{org}/Profiles/{name}/task-list/Tasks.md` |
| Person's sub-schedules | `Team/{org}/Profiles/{name}/sub-schedules/{schedule}.md` |
| Team roster, roles, agreements | `Team/{org}/team.md` |

## Other Team Folders

- `Team/External/custom-solutions/` -- Independent pod profiles
- `Team/External/contractors/` -- Contractor profiles
