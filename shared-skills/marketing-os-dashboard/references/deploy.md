# Deploy

## Verify first, always

Four checks. If any fails, do not deploy.

**1. No external requests.** Grep the file for `http://`, `https://`, `src=`, `fetch(`, `XMLHttpRequest`, `@import`, and `cdn`. Any hit outside a plain anchor href is a failure. The page must render with the network off.

**2. The JSON parses.** Extract the `os-data` block and parse it. A trailing comma from a hand edit will break the whole page and the failure is invisible until someone opens it.

**3. Every panel id is present.** `os-data`, `gen`, `mode`, `tabs`, and the six `p-*` containers.

**4. Every panel can name its source.** No value rendered that you cannot trace to an OS file.

A broken dashboard on a shared URL is worse than a stale one, because people act on it.

## Deploying

Target comes from `Context/config.md` under `surfaces.dashboard_deploy`. Record the resulting URL under `surfaces.dashboard_url` if it is not already set, and keep it stable across rebuilds so bookmarks survive.

The page is a single self-contained file, so any static host works. There is no build step and no dependencies.

**If the deploy target is unavailable**, build locally, say plainly that the deploy failed and why, and leave the local file correct. A current local file is still useful and tomorrow's rebuild will push it.

## Access

The page will sit on a URL. Before the first deploy, ask who should be able to see it.

Two things worth raising, because a dashboard is easy to over-share:

**It may contain revenue and churn.** Those are the numbers that make it useful and also the ones that should not be publicly indexable. If the host supports password protection or an access list, use it.

**Customer quotes.** The quote bank records whether each quote is cleared for public use. Anything marked otherwise should not reach a deployed page, and named individuals should not appear without recorded permission.

## Rebuild cadence

Daily, after the routines that feed it. In the daily chain the dashboard runs last because it renders what the others wrote.

Rebuilding more often is wasted work: the underlying files only change when a routine runs. Rebuilding less often means the Today tab is wrong, which is the tab people actually open.

## Keeping the shell stable

The rebuild swaps the data block and nothing else. That constraint is what makes a daily automated rebuild safe, so a deploy never carries a layout change the operator did not ask for.

A deliberate layout change follows the ordered procedure in SKILL.md. Do not start one from here.

## When the dashboard looks wrong

Diagnose in this order, cheapest first:

1. **Is the data stale?** Check `generated` in the header against now. If it is old, the rebuild is not running, and that is a routine problem rather than a dashboard problem.
2. **Did the routines run?** The Automations tab flags this itself. A red row there explains most wrong numbers.
3. **Is a connector missing?** The Stack tab. A missing connector means the affected panels legitimately have gaps.
4. **Is the source file wrong?** Only now open the OS file behind the panel.

Most reported dashboard problems are routine problems, and the page is built to tell you that itself.
