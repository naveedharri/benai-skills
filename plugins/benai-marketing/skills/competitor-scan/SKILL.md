---
name: competitor-scan
description: Set someone up, from scratch, with their own weekly Competitor Radar dashboard. Use when a user wants to start tracking competitors, build their own competitor dashboard, monitor rivals' socials/SEO/subscribers, or "set me up with something like the competitor radar." Runs an interactive Q&A (niche, competitors, which platforms), can auto-discover and recommend competitors, wires up Apify + Firecrawl connectors, builds a branded HTML dashboard, deploys it to a stable Vercel URL, and schedules a weekly/monthly cloud routine to refresh and Slack it. This is the giveaway companion to the `competitor-radar` skill.
disable-model-invocation: true
---

# Competitor Radar Setup

Turns "I want to track my competitors" into a live, self-refreshing, branded dashboard in one guided session. This skill sets up the machine; the `competitor-radar` skill is the machine.

## Step 1: Discovery Q&A (interactive)

Ask, one topic at a time, adapting to answers:
1. **Niche / what they do** (so competitor discovery and framing are accurate).
2. **Competitors**, three modes:
   - They name them, or
   - They ask you to find and recommend competitors: search YouTube, the web, and their niche communities, propose 5-8 with a one-line why each, and let them confirm/trim, or
   - A mix (they name a few, you fill the rest).
3. **Platforms to track**: which of YouTube, Instagram, LinkedIn, TikTok, community (Skool/Circle), SEO. Only track what matters to their niche (a local business cares about Google reviews + local SEO; a creator cares about YouTube + shorts platforms).
4. **Brand**: colors, fonts, logo. If they have a design system or a site, extract from it; else use sensible defaults and confirm.
5. **Cadence**: weekly (default, Monday) or monthly (1st). And where to post it (Slack channel, email).

Write their answers into a `config.json` shaped like the `competitor-radar` skill's config (roster + platforms + apify_actors + brand + slack_channel + live_url + deploy_repo).

## Step 2: Connect the data sources

Get the scrapers connected before building. See `references/data-sources.md` for the platform-to-actor mapping, Firecrawl and YouTube setup, and the avatar-inlining rule.

## Step 3: Build the branded dashboard

Reuse the `competitor-radar` skill's `assets/template.html` + `scripts/build_dashboard.py`, restyled to their brand (swap the CSS color/font tokens, keep the structure: Demo/Actual tabs, per-platform columns, expand cards, focus/blur toggle, week-over-week deltas). Gather the first week of real data via the connectors, write `radar_data.js`, run the build, and open it for their approval before deploying. Inline avatars per the rule in `references/data-sources.md`.

## Step 4: Deploy to a stable URL

Deploy so the URL never changes across refreshes. See `references/deploy-and-routine.md`.

## Step 5: Schedule the refresh routine

Create a cloud routine on the chosen cadence that refreshes the data, deploys, and Slacks the link. See `references/deploy-and-routine.md` for cron values and the connector vs. embedded-API decision that makes the routine work.

## Step 6: Hand off

Give them: the live URL, the repo, the routine id and its next run time, and a one-paragraph "how to add/remove a competitor" note (edit `config.json` roster, the next run picks it up). Confirm the first refresh by triggering one manual run and checking the Slack post lands.

## Reference implementation

The working, deployed example is `insinexzy/benai-competitor-radar` (live at `https://benai-competitor-radar.vercel.app`), refreshed by routine `Competitor Radar Weekly Refresh (Mon 9:00 IST)`. Clone its `skill/` folder as the starting point rather than rebuilding from scratch.

## Self-improvement

This skill is never finished. Improve it as you use it.
- When the user corrects how a step was done, update the relevant reference file (`references/data-sources.md`, `references/deploy-and-routine.md`) or this SKILL.md so the correction sticks. Do not just fix it for this run.
- When a correction is a hard rule ("always X", "never Y"), add it as a permanent rule here.
- When the user says an output was genuinely good, save it to `references/examples/` so it becomes a model for future runs.
- Keep the skill small: when you add something, run the deletion test and cut anything that no longer changes behavior.
