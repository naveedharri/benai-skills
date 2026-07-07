# Design Notes and Provenance (background, not needed at runtime)

## Why this skill exists

A title's job is to win the click against everything else in the feed right now. Two kinds of evidence tell us what wins: what subjects are currently overperforming in the niche (topic), and what phrasings are currently overperforming (pattern). The skill pulls both from fresh data and proposes angles from both, as two separate option sets.

Two failures earlier versions kept committing:

1. **Subject blindness.** The skill read titles only as structures (Stop X, 99% wrong, N things) and never grouped them by what they were about. A dominant, proven content category (for example "best skills" collection videos, where Ben's own "8 Claude Skills I Can't Live Without" is a 2.7x outlier and Nate Herk, Chase, and Nick all have skills-collection hits) got flattened into "an instance of the N-things pattern" and missed entirely. The strongest signal is usually topical, so the skill must cluster by subject and rank by performance, not just match structure.

2. **Stale data.** Pulling all-time popular videos drags in titles from a year or more ago. Title strategy cannot be based on what worked last year.

The order is: understand the video first, then read the fresh recent data and cluster it by subject and by structure, then let that data reshape the angle (not just decorate a pre-locked one), then produce two option sets. The video grounds it. The data is allowed to change the framing. Patterns sharpen, they never generate a title that is untrue to the video.

## Why outliers and all-time-popular were dropped

- `vidiq_outliers` returns nothing for channels that perform consistently (Ben's channel especially), so most channels came back empty and the surviving few produced near-identical angles every run.
- All-time-popular pulls (`getChannelTopVideos` with `popular: true`) surface evergreen videos from a year or more ago, which misrepresents what is winning now.
- The replacement: last 20 to 25 recent long-form uploads per channel, enriched with view counts, judged by velocity. Reliable, never empty, current.

## Why the data pull is fanned out

MCP responses are verbose. Pulling 8 channels inline is tens of thousands of tokens; the skill then drifts, forgets the output schema, or stops following its own phases (this happened). Connector-behind-subagent keeps the main context clean: subagents do the heavy calls and return compact tables. See the benai-skill-creator-skill connectors-and-mcp rule.

## Provenance

- 2026-07-07 v5: restructured per skill-building best practices. SKILL.md pruned to trigger + steps + routing; background moved here; comp set moved to channel-list.md; output schema moved to output-template.md; progressive disclosure (each reference named only in the step that uses it); self-improvement rule added; Phase 6 made an explicit pick-one decision point.
- 2026-07-07 v4: moved the Phase 3 data pull behind 8 parallel subagents returning compact tables, and long transcript/reference pulls behind a subagent in Phase 2. Added the fan-out rule and the context-flooding failure mode.
- 2026-06-08 v3: switched from all-time-popular to the last 20 to 25 recent uploads per channel (capped to ~6 months) after stale year-old titles kept surfacing. Added two-lens output, mandatory subject clustering with performance ranking, and Ben's-proven-format-as-lead prior, after the skill repeatedly missed the dominant "best skills" category. Performance signal changed to views-per-day.
- v2: removed `vidiq_outliers`, hardcoded channel IDs, reordered to video-first.
