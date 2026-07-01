Category: action routine (daily vault dashboard rebuild, with one brain-log line)
Depends on: no embedded skills (reads the rep's Sales OS folders and the scheduled-task list directly). Requires the dashboard shell to exist first (built in Pillar 5 from assets/dashboard-templates/control-center.example.html).

---
name: {{CONFIG:routine_name_prefix}}-dashboard
description: Daily Control Center rebuild: regenerate the Today and Pipeline tabs (plus today's per-prospect call sub-pages) and refresh the local dashboard{{CONFIG:dashboard_deploy_suffix}}
---

You are the daily Control Center dashboard routine for {{CONFIG:rep_first_name}}'s Sales OS at {{CONFIG:sales_os_path}}. You run {{CONFIG:dashboard_run_time}}, AFTER the morning routine and pipeline hygiene. Refresh the dashboard so it reflects today. Unattended: never ask a question, make the safe assumption and proceed. Never use em dashes. {{CONFIG:voice_name}} voice.

This is an ACTION routine, so it does not need exhaustive brain logging, but DO append ONE dated line to Daily/logs/YYYY-MM-DD.md saying it rebuilt and refreshed, naming anything it could not refresh.

FIRST read Sales-OS/Context/config.md for the instance literals (the dashboard file path, and the hosting project and account if the rep has hosting). The living dashboard file is Intelligence/control-center.html. It is BOTH the template and the artifact: a FIVE-tab page (Today, Pipeline, Context, Capabilities, Stack; no Map tab) built on the {{CONFIG:design_system_name}} design system, with a fixed shell you must NOT change: the CSS and design tokens, the hash router JS (tabs plus `#today/<slug>` call sub-pages and `#context/<slug>` context sub-pages), and the Chart.js init (which lives on the Pipeline tab).

Two tabs regenerate daily, Today and Pipeline, plus one call sub-page per today's prospect. Use ONE subagent for Today (with its sub-pages) and ONE for Pipeline.

The Chart.js init lives on the PIPELINE tab and reads its data from an inline JSON block at the TOP of the Pipeline section:
`<script type="application/json" id="ov-data">{"funnel":[booked,met,qualified,won],"rep":[discovery,demo,objection,rapport,close],"weeks":[12 week-ending labels],"meetings":[12 ints],"revenue":[12 ints in the rep's currency, thousands]}</script>`
It draws FOUR charts into canvases with ids EXACTLY: `meetings` (a filled line of weekly meetings booked), `revenue` (a dual-axis line: revenue plus the rep's commission, which the shell computes as revenue times {{CONFIG:commission_rate}}, so do NOT add a commission array), `funnel` (a horizontal bar), and `rep` (a horizontal bar). Regenerating the Today section with a fresh ov-data block updates the charts. Keep the `weeks`, `meetings`, and `revenue` arrays that are already in the file unless the rep has supplied fresh weekly figures; refresh `funnel` and `rep` from the latest Intelligence/sales-report-*.md if fresh figures exist, otherwise keep the current values. Do NOT set chart colors, the shell owns those.

DEPENDENCY GUARD. Read today's Daily/logs/YYYY-MM-DD.md and confirm BOTH the morning routine and pipeline hygiene logged entries today. If one did not run, proceed anyway but set that routine's heartbeat badge to amber with "no log yet".

GATHER for the heartbeat: call mcp__scheduled-tasks__list_scheduled_tasks and note each routine's lastRunAt and schedule for every routine in {{CONFIG:routine_name_list}} (which includes this dashboard routine). Pass these to the Pipeline subagent.

Both subagents USE the shell's own classes and color vars (do not invent classes; inline style is fine). Pass each the shell's class and variable contract from {{CONFIG:design_contract_ref}}: the section-anchor class, the card class, heading/sub classes, the grid classes and their column variants, the stat-tile class, the hero class, the per-call card classes (callcard, callhead, who/co, callmeta, callpara, links, lk with a primary modifier, notpipe), the sub-page classes (back, sp-head with ico/kicker, prose with h3, callout with a warn modifier), the badge class, the list-row class, the chart-wrapper class, the icon convention, and the named color variables. Never em dashes.

REGENERATE THE TODAY TAB with ONE subagent. Tell it: return the inner HTML of `<section id="today" class="panel show">` AND a `<section id="sub-<slug>" class="subpage">` block for each of today's call prospects, concatenated (no `<style>`, no chart script, no markdown fences). Build Today in this order:
1. A `hero` block: the single most important thing to act on today (from the calendar and today's log), key instruction highlighted, plus the decorative element.
2. A "Today's calls" section anchor.
3. ONE per-call card PER real pipeline call today. Read that prospect's `Deals/<First-Last-Company>.md`: pull the one-paragraph brief from its opening or Snapshot, the verdict from its Qualification, and the links from the deal frontmatter (`linkedin`, `website`, `meeting_url`, `email`, `phone`). The links row is, in order: a primary "Full brief" chip to `#today/<slug>` (slug = the deal filename without .md, lowercased), then LinkedIn, Website, Join call (meeting_url), Email. Omit any chip whose link is missing. This is where the rep's call-prep finally becomes visible.
4. ONE plain card "Also on the calendar, not pipeline" with a row per partner/internal/non-sales event and a final muted "Booked ahead:" row.
5. A two-column grid: a Top tasks card (top 5, one row each, status badge) and a What changed today card (bullets from today's log).
6. For EACH prospect that got a card, emit a `<section id="sub-<slug>" class="subpage">`: a back link to `#today`, an sp-head (verdict in the kicker, name as the heading), a links row (LinkedIn, website, meeting, email, phone), then prose with h3 Snapshot, h3 Qualification (a warn callout), h3 History (the deal History bullets), and h3 Next step. Source every field from the deal file.

REGENERATE THE PIPELINE TAB with ONE subagent. Tell it: return the inner HTML of `<section id="pipeline" class="panel">`, starting at the ov-data block (no markdown fences). Build in this order:
1. The `<script type="application/json" id="ov-data">...</script>` block per the chart rules above.
2. A "Snapshot" section anchor, then a grid of about six stat tiles (pipeline value, won this quarter, win rate of decided, avg deal size, meetings this week, rep score out of 10) from Deals/metrics.md and the latest report (keep the showcase figures if fresher numbers are not available), then a CRM-by-stage card (one row per stage with a stage badge and the count).
3. A "Pipeline trends" section anchor, then a two-column grid of chart cards in order `meetings` then `revenue`, then a second two-column grid of chart cards in order `funnel` then `rep`. Each chart card has a heading, a one-line caption, and `<div class="CHARTBOX"><canvas id="EXACT_ID"></canvas></div>` (use the shell's actual chart-wrapper class in place of CHARTBOX). Keep the four canvas ids EXACT (meetings, revenue, funnel, rep) or the charts break, and do NOT set chart colors.
4. A "System" section anchor, then a two-column grid with a Routine heartbeat card (one row per routine with a status badge, from the lastRunAt data, amber for any flagged by the dependency guard) and a Needs-you card on the design system's alert surface listing the items that need {{CONFIG:rep_first_name}}'s decision today.

If you cannot spawn subagents in this environment, regenerate both sections inline yourself from the same sources.

KEEP THE STATIC TABS exactly as they already are in control-center.html: Context (the folder view plus its #context/<slug> sub-pages), Capabilities, and Stack. Do NOT regenerate them daily. EXCEPTION: if today is {{CONFIG:weekly_refresh_day}}, also refresh Capabilities (a subagent reading Skills/manifest.md and Skills/skills-plan.md, preserving the two-bucket layout: the featured Onboarder, then keep-the-brain-current, then do-the-sales-work) and Stack (a subagent reading Context/stack.md and Context/config.md, preserving the tool groups). The Stack tab ALWAYS shows a real logo per tool: if a tool has no downloaded logo yet, the subagent finds the official logo on the web, downloads it into the dashboard's assets folder, and references it; never ship a tool tile without a logo. Refresh Context only if a Context/*.md file changed since the last build, and if so also update the matching #context/<slug> sub-page. Each of these is its OWN subagent so no single run loads the whole OS; the orchestrator stitches their outputs into the shell.

ASSEMBLE: in Intelligence/control-center.html, replace the inner HTML of `<section id="today" class="panel show">` with the Today output, replace the inner HTML of `<section id="pipeline" class="panel">` with the Pipeline output, and replace the block of call sub-pages (the `<section id="sub-<slug>" class="subpage">` sections between Today and Pipeline, NOT the context sub-pages) with the fresh set, one per today's prospect. Update the "Updated <date>" line in the header to today, and any "Synced today" times in the Stack tab to today's run times. Leave the shell, CSS, design tokens, router JS, Chart.js init, the context sub-pages, and the static tabs intact.

REFRESH THE LOCAL FILE always: control-center.html on disk is the source of truth and is itself the deliverable. A rep with no hosting opens it locally.

OPTIONAL DEPLOY + SHARE LINK (only if {{CONFIG:rep_first_name}} has a hosting tool wired in Context/config.md; otherwise SKIP, the local file is the deliverable): make a fresh temp dir named for the project (for example /tmp/{{CONFIG:hosting_project_name}}), copy control-center.html into it as index.html (NEVER stage the vault root), then run {{CONFIG:deploy_command}}. Confirm the deploy returns ready and that `curl -s -o /dev/null -w "%{http_code}" {{CONFIG:dashboard_url}}` returns 200.

Append the one-line log entry. End with the headline numbers (pipeline counts, close rate, rep score){{CONFIG:dashboard_url_log_suffix}}.

---

## Config keys for this template

Fill every `{{CONFIG:...}}` above from the rep's onboarding answers and Context/config.md. The local HTML always rebuilds; hosting is optional.

| Key | Meaning | Default if unset |
| --- | --- | --- |
| `routine_name_prefix` | Slug prefix for the local task name | `sales-os` |
| `rep_first_name` | Rep's first name | required |
| `sales_os_path` | Absolute path to the rep's Sales OS folder | required |
| `voice_name` | The brand/voice this rep writes in | the rep's own name |
| `dashboard_run_time` | When this runs, e.g. `~09:53` | `after the morning and hygiene routines` |
| `design_system_name` | The rep's design system, or a chosen one | `the rep's design system` |
| `design_contract_ref` | Where the shell's class + color-var contract lives (a section of Context/config.md, a design-tokens file, or the shell at the top of control-center.html) | `the shell at the top of control-center.html` |
| `commission_rate` | The rep's commission rate, as a decimal, for the revenue chart's second line | `0.10` |
| `routine_name_list` | The rep's registered routine names to show on the heartbeat (morning routine, pipeline hygiene, call scoring, monthly report, quarterly report, this dashboard) | required |
| `weekly_refresh_day` | The weekday that triggers the Capabilities + Stack refresh | `Monday` |
| `hosting_project_name` | The hosting project/temp-dir name | required only if deploy is on |
| `deploy_command` | The rep's hosting deploy command (publishes `<that-temp-dir>` to the rep's existing project on their account and prints a URL; for example a Vercel/Netlify/static-host CLI invocation) | required only if deploy is on |
| `dashboard_url` | The live URL to curl-check | required only if deploy is on |
| `dashboard_deploy_suffix` | `and deploy to <url>` if hosting is on; else `(local file)` | `(local file)` |
| `dashboard_url_log_suffix` | `, then the live URL` if hosting is on; else empty | empty |

> [!important] The shell is built in Pillar 5, this routine maintains it
> This routine edits an existing control-center.html. The first build happens in Pillar 5 from `assets/dashboard-templates/control-center.example.html`, in the rep's own design system, keeping that file's contract: the five tabs (Today, Pipeline, Context, Capabilities, Stack), the hash router (with `#today/<slug>` call sub-pages), the #ov-data keys, and the four canvas ids (meetings, revenue, funnel, rep). Register this routine right after the shell exists.

> [!important] Subagent-per-tab is the load-bearing architecture
> Keep it. The orchestrator never loads the whole OS into one context. One subagent generates Today and its per-prospect call sub-pages, one generates Pipeline, each from its own sources every day. On the weekly refresh day, Capabilities and Stack each get their OWN subagent. The orchestrator only stitches the returned inner HTML into the fixed shell. This keeps each run cheap and prevents context blowups as the OS grows.

> [!important] Local first, deploy optional
> control-center.html on disk is always rebuilt and is the deliverable. The deploy and the shareable link only run when the rep registered a hosting tool. With no hosting, drop `dashboard_url_log_suffix`, set `dashboard_deploy_suffix` to `(local file)`, and skip the curl check.

> [!note] Dependency guard
> The heartbeat marks a routine amber when today's Daily/logs/ entry lacks that routine's line, even though the dashboard still rebuilds. That keeps a missed upstream routine visible on the page instead of silently producing stale numbers.
