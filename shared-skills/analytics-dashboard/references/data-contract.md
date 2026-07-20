# The data contract

`dashboard.html` reads a single global, `DASHBOARD_DATA`, from `data.js`. `assets/example-data.js` is a complete real example (Ben AI, 2026-07-12) whose header comments document every block's source. This file states the shape rules; the example shows them filled.

## Blocks

| Block | What it holds | Required |
|---|---|---|
| `meta` | `date` (YYYY-MM-DD), `updatedTag`, `dataStatus` ("live"/"sample"), `trendDates30d` | yes |
| `brief` | array of 3-5 sentences; first renders bold | yes |
| `stripe` | `mrr` + `activeSubscribers` (each: value, delta24h, delta7d, trend30d), `memberMovement` (gained/reactivated/churned/net × d24h/d7d/d30d), `movementTrend30d` (per-day gained/reactivated/churned), `billingOverviewRef` (the reconciliation anchor) | yes (rename mentally to "revenue" for non-Stripe) |
| `funnel` | `windowLabel`, `stages[]` (key, label, value, prev7d, note; or `unavailable: true` + note), `topVideos[]` (title, visitors, joins), `attributionWindow` | yes |
| `youtube` | `channel`, `viewsLatest` (value, deltas, trend14d, note), `videos[]` (title, date, views, likes, joins or null) | if channel exists |
| `linkedin` | `profile`, `posts[]` (hook, date, reactions, comments) | if channel exists |
| `newsletter` | `list` label, `issues[]` (subject, date, openRate, clickRate) newest first | if channel exists |
| `community` | `activity` (posts/comments/likesOnNewPosts with value+prev+d7), `engagementPerPost` (value, prev7d, cohort24h, note), `perPost[]` (last ~30 posts, oldest→newest), `awaitingReply[]`, `churnRisk` | if community exists |
| `mom` | `{pending: true, note}` until the history DB has a full month; then month-over-month aggregates | yes |

## Rules

- **Deltas are signed numbers, not strings.** The template renders sign and color.
- **Trends are plain arrays** (oldest → newest). Sparkline length is flexible; 14-30 points reads best.
- **Missing ≠ zero.** A source you could not pull is `null` (renders as "–") or a `pending`/`unavailable` block with a note. Zero means a measured zero.
- **Windows are complete days.** "24h" = the last complete day. Label any lagging source on the card note (e.g. "Analytics lags ~2 days").
- **Keep the header comments in data.js** - they are the living documentation of where each number comes from, and the next refresh (possibly a different agent) depends on them.
- Rates are numbers in percent (21.9 not 0.219).

## History DB

Each refresh appends `history/YYYY-MM-DD.json` = the full `DASHBOARD_DATA` of that day. Month-over-month, retention curves, and long-term trends are computed FROM these files, never from memory. First refresh of a new month: aggregate the prior month's snapshots into the `mom` block.
