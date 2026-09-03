This folder contains org-level daily notes. In business mode these are AGGREGATED views compiled from individual profile dailies. In professional mode this is the operator's primary daily journal.

## Critical Rule (Business mode)

Do NOT write directly to this folder during profile sessions. All session output goes to the active profile's daily folder at `Team/{org}/Profiles/{name}/Daily/YYYY-MM-DD.md`.

If the org configures aggregation schedules later (e.g. a `Team Schedules/` folder with scheduled scripts), those would populate this folder by scanning all profile dailies and compiling them into a single org-level view. By default, this folder stays empty in business mode.

## When You CAN Write Here

- **Professional mode**: Always. This is the operator's daily journal.
- **Business mode**: Only when running a team schedule that explicitly aggregates profile dailies, or when no active profile session is in progress.

## Daily Note Frontmatter

```yaml
---
type: daily-note
date: YYYY-MM-DD
---
```
