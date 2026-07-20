---
name: competitor-radar
description: Build and weekly-refresh a branded HTML "Competitor Radar" dashboard that tracks a roster of competitors across YouTube, Instagram, LinkedIn, TikTok, community, and SEO. Use when the user wants to track competitors, monitor competitor socials/engagement/subscribers, build a competitor dashboard, or refresh the weekly competitor report. Gathers real data via connectors (YouTube, Apify, Firecrawl), renders a two-tab (Demo/Actual) dashboard in Ben AI branding, deploys it to a stable Vercel URL via git push, and posts the link to Slack.
disable-model-invocation: true
---

# Competitor Radar

Tracks a fixed roster of competitors weekly and renders one branded HTML dashboard: follower counts, posting cadence, median engagement, week-over-week subscriber growth, standout post of the week, and SEO, per platform. Two tabs: **Demo** (a sample niche) and **Actual** (real competitors, with a focus/blur toggle so only "you" shows on camera).

## Files

- `config.json`: the stable roster (who to track, handles per platform, platforms to include, Apify actor ids). Edit to add/remove competitors.
- `radar_data.js`: the weekly artifact. `WEEK_ENDING`, `AV` (base64 avatars, stable), and `DATA` ({demo, actual}). The refresh step rewrites this.
- `assets/template.html`: the fixed dashboard shell (CSS, render logic, tabs, focus mode). Never regenerate; carries a single `/*__RADAR_DATA__*/` marker.
- `scripts/build_dashboard.py`: deterministic build (template + radar_data.js to `index.html`). No network.

## Weekly refresh workflow

1. **Read** `config.json` (roster) and the current `radar_data.js` (last week's numbers, needed for week-over-week deltas).
2. **Gather fresh data** for each creator per `references/data-sources.md`. Do NOT fabricate; mark missing as `null`.
3. **Compute deltas** per `references/data-sources.md`.
4. **Rewrite** `radar_data.js` with the new `WEEK_ENDING` and refreshed `DATA`. Handle avatars per `references/data-sources.md`.
5. **Build**: `python3 scripts/build_dashboard.py <skill_dir> ../index.html`.
6. **Deploy and Slack** the live URL per `references/deploy.md`.

## Self-improvement

This skill is never finished. Improve it as you use it.
- When the user corrects how a step was done, update the relevant reference file (`references/data-sources.md`, `references/deploy.md`) or this SKILL.md so the correction sticks. Do not just fix it for this run.
- When a correction is a hard rule ("always X", "never Y"), add it as a permanent rule here.
- When the user says an output was genuinely good, save it to `references/examples/` so it becomes a model for future runs.
- Keep the skill small: when you add something, run the deletion test and cut anything that no longer changes behavior.

## Guardrails

- YouTube numbers are the reliable core; always real. Never invent socials/SEO: set `null` and move on.
- Never edit the template shell, CSS, or render JS. Only `radar_data.js` (and `config.json` when the roster changes).
- Ben AI voice, no em dashes.
