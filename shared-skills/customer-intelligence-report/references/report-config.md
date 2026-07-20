# Report Config (the customization surface)

This is how someone makes the report their own instead of a fixed layout. Confirm these
choices with the user in the scope checkpoint, then carry them through analysis and into the
dashboard template constants.

## 1. Scope (whose meetings)
- `all`: every meeting in the period.
- `person`: one person's meetings. Filter Fireflies by that host or participant.
- `team`: a named set of people. Filter by that set.
Scope changes the meaning of "member" in the data: for a customer-facing team it reads as the
customer or account, for an internal team it reads as the teammate. Keep the field name
`member`, just frame it right in the summaries and the `REPORT_SCOPE` label.

## 2. Cadence (period length)
- `weekly` (default): one `WEEKS` entry per week, Monday to Sunday.
- `daily`: one entry per day. The field names stay `week_*`, they just span one day.
- `custom`: any fixed window. Set `week_start`/`week_end` accordingly.
Cadence sets the date range you pull from Fireflies and the `RECURRING_WINDOW` meaning.

## 3. Recurring window
`RECURRING_WINDOW` in the template = how many trailing periods feed the recurring-themes
section. Default 4. A theme is "recurring" when it appears in at least 2 of those periods.

## 4. Section catalog
The `SECTIONS` array in the dashboard template defines which sections render and in what
order. Each entry is `{ id, title }`. A theme renders under the section whose `id` matches
the theme's `section` field.

Default catalog (matches the reference report):
- `{ id: "pain-points", title: "Pain points" }`
- `{ id: "tech-patterns", title: "Technical patterns" }`

To customize:
- Rename a section: change its `title`.
- Reorder: move entries in the array.
- Add a section: add `{ id: "your-slug", title: "Your Title" }`, then tag themes with
  `section: "your-slug"` during analysis and add matching LEXICON entries. Examples that fit
  meeting analysis: `feature-requests`, `objections`, `churn-risks`, `wins`, `questions`.
- Remove a section: delete its entry. Themes tagged with a removed id still render under an
  auto "Other" block, so no data is lost, retag them if you want them elsewhere.

Two sections are always present and not part of the catalog: the trailing "Recurring themes"
section (computed) and "Members to help" (from `stuck_members`).

## 5. Template constants to set per run
In `dashboard-template.html`, set: `REPORT_TITLE`, `REPORT_EYEBROW` (scope tag),
`REPORT_SCOPE` (human label like "All meetings" or "Sales team"), `REPORT_SOURCES`,
`RECURRING_WINDOW`, and the `SECTIONS` array. Then replace `WEEKS` and `LEXICON` with the
real data.

## 6. Sources (Circle + Fireflies)
The report blends two connectors by default. Both are optional per run and degrade
gracefully: if one is unavailable or errors, the report is produced from the other.

- **Fireflies** (meetings): set the scope filter. For `person`/`team` scope, list the
  organizer or participant emails to pull. See `fireflies-guide.md`.
- **Circle** (community posts): set the space id(s) to scan, or a space name to resolve.
  See `circle-guide.md`.

Per-run source config to confirm in the scope checkpoint:

| Setting | Example | Notes |
|---|---|---|
| `sources` | `["fireflies","circle"]` | Which connectors to pull. Drop one for a single-source run. |
| `timezone` | `+05:30` | Offset used for all date-window filters. |
| `fireflies.organizers` | `["you@yourco.com"]` | Whose meetings. Empty + scope `all` = every meeting. |
| `fireflies.core_team` | `["a@co.com","b@co.com"]` | Optional. Drop internal-only meetings (keep meetings with at least one participant outside this set). |
| `circle.space_ids` | `["<space-id>"]` | Which Circle spaces. Resolve a name with `spaces_list`. |

Set counts per period from what each source returns: `calls_processed` from Fireflies,
`posts_processed` from Circle (0 when Circle is not pulled). Evidence carries `source`
(`fireflies` or `circle`) so each quote is attributed. To add a third source later, pull it
in the collection step, tag its evidence with a new `source` value, and add a matching
`.tag` color in the template.

## 7. Secrets and safety (never commit secrets)
- The Circle and Fireflies connectors authenticate through the MCP connection, not through
  any key stored in this skill. Never paste an API key, token, or bearer into a skill file,
  a reference, or the data.
- The config values above (space ids, organizer emails, timezone) are org-specific settings,
  not secrets, but they are still per-install: keep them as values the user supplies at run
  time or in their own local config, do not bake one customer's ids into the shared skill.
- If you add optional publishing (for example deploying the HTML to a host), pass any deploy
  token as an environment variable at run time (for example `--token $DEPLOY_TOKEN`) and
  ensure the deploy working directory is gitignored. Never write the token to a file. The
  default deliverable is a self-contained local HTML file that needs no credentials.
