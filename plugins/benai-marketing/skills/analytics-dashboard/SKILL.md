---
name: analytics-dashboard
description: "Build and refresh a single-page marketing analytics dashboard (Marketing Pulse) that answers attention, conversion, revenue, and retention every morning, with every number carrying its delta and its source. Two modes: SETUP (first run - interviews for sources like Stripe, YouTube/PostHog, newsletter, community; probes connectors; creates the dashboard folder from the bundled template) and REFRESH (scheduled runs - invoke with a timeframe like 'refresh the marketing dashboard for yesterday' and it pulls every configured source, rewrites data.js, appends the daily history snapshot, writes the daily brief, and redeploys). Use whenever the user says 'analytics dashboard', 'marketing pulse', 'refresh the dashboard', 'marketing analytics for <timeframe>', 'set up my marketing dashboard', or a scheduled task passes a date window. Designed so a scheduled task prompt is one line: the skill carries the whole workflow."
disable-model-invocation: true
---

# analytics-dashboard

One page, four questions: attention, conversion, revenue, retention. Every number carries its trend and its source. A scheduled task invokes this skill with a timeframe; the skill does the rest.

## Mode selection

- **No dashboard folder / no `config.md` found, or the user asks to "set up"** → SETUP.
- **A timeframe is given ("for yesterday", "for last week", a date range) and config exists** → REFRESH.
- Ambiguous → ask one question, not five.

## SETUP (first run)

1. **Locate or create the dashboard folder.** Ask where it should live (default: `marketing-pulse/` in the user's project folder). Copy `assets/dashboard-template.html` in as `dashboard.html`.
2. **Interview for sources.** Which of these does the business run, and through which tool?
   - Revenue/subscriptions (Stripe, Paddle, ...)
   - Site + conversion analytics (PostHog, GA4, Plausible)
   - Content channels (YouTube, LinkedIn, X, ...)
   - Email (Kit, Mailchimp, beehiiv)
   - Community (Circle, Skool, Slack, Discord)
3. **Probe the connectors** for each approved source (ToolSearch if deferred). For gaps: offer to connect, or mark the block `pending: true` - the template renders honest placeholders. Never fake a number.
4. **Write `config.md`** in the dashboard folder: each source, the exact tool/IDs used, the metric definitions chosen, deploy target (Vercel / live artifact / local file), and anything learned probing (rate limits, missing fields). `references/source-wiring.md` shows a complete worked example.
5. **Run the first REFRESH** end to end, then tell the user the one-line prompt to put in a scheduled task, e.g.:
   `Use the analytics-dashboard skill to refresh the marketing dashboard for yesterday.`

## REFRESH (the scheduled run)

1. Read `config.md` + the current `data.js`. Resolve the timeframe to **complete days** (24h = the last complete day; 7d/30d windows end on it).
2. **Pull every configured source** for the window. Follow `references/source-wiring.md` for the field-tested access patterns and gotchas (Stripe filter shapes, PostHog queries, API lags). Oversized API responses: save to file and extract with jq/scripts - never page raw dumps through context.
3. **Rewrite `data.js`** to the contract in `references/data-contract.md`. Keep the header comments (they are the documentation). Every metric gets its delta (24h and 7d where the source allows).
4. **Append the daily snapshot** to `history/YYYY-MM-DD.json` (the whole DASHBOARD_DATA object). This is the append-only DB that unlocks month-over-month.
5. **Write the daily brief** (the `brief` array): 3-5 sentences, numbers-first. Sentence 1 = the headline (revenue/net movement). Then: what drove any spike, which content converted, one retention/community observation, and at most one concrete action. No filler, no hype.
6. **Verify**: open `dashboard.html` and confirm it renders with the new data (no NaN, no empty sections that should have data).
7. **Deploy** per config (e.g. `vercel deploy --prod --yes` from the folder, or update the live artifact). Skip silently if config says local-only.
8. **Report**: the live URL plus the 3 numbers that moved most, with deltas.

## Hard rules

- **A snapshot without a delta is noise.** Every headline number shows change vs yesterday and vs the prior 7 days.
- **Honest gaps beat fake data.** If a stage or source is not instrumented, render the explicit placeholder (the template supports `unavailable: true` / `pending: true`) and say what would fix it.
- **Reconcile revenue to the billing system's own overview** (e.g. Stripe Billing tab), not to raw API counts - see source-wiring for why they diverge.
- **Never break the data contract.** The template reads `DASHBOARD_DATA`; changing shapes means changing both files in the same run and verifying the render.
- History is append-only. Never rewrite past snapshots.

## Self-improvement
This skill is never finished. Improve it as you use it.
- When the user corrects how a step was done, update the relevant reference file (`references/data-contract.md` for shape rules, `references/source-wiring.md` for source access patterns) or this SKILL.md so the correction sticks. Do not just fix it for this run.
- When a correction is a hard rule ("always X", "never Y"), add it to the Hard rules section above.
- When the user says a dashboard or brief was genuinely good, save a copy of its `data.js` to `references/examples/` so it becomes a model for future runs.
- Keep the skill small: when you add something, run the deletion test and cut anything that no longer changes behavior.
