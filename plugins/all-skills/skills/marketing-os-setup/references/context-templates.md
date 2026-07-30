# Context templates

Section scaffolds, not content. Fill from the interview, and **only from this user's own material.** Read the rule at the top of `interview.md` before writing a single one of these.

> [!important] The filenames are a contract
> Vault-aware skills resolve `Context/icp/<segment>.md`, `Context/brand/positioning.md`, `Context/strategy.md`, `Context/personal-brand/voice.md`, and `Context/services.md` by **literal path**. Rename one and those skills stop finding their context, which defeats the point of the OS. Use these names exactly.

## The shape

```
Context/
├── CLAUDE.md               the folder index
├── config.md               instance literals. Every routine reads this
├── strategy.md             goals plus the funnel map
├── infrastructure.md       the stack, the connectors, what is authenticated
├── personal-brand/
│   ├── voice.md            the master voice register
│   └── background.md       the operator, and what shapes the voice
├── brand/
│   ├── positioning.md      category, enemy, message house
│   └── brand-kit.md        the executable design contract
├── icp/
│   └── <segment>.md        one per segment. Pain points live INSIDE
├── services.md             compatibility shim, one line
└── branding.md             compatibility shim for the ads and design skills
```

Two subfolders and no more. Nothing here goes deeper than `Context/<folder>/<file>.md`.

Every file carries `type: context`, `status: active`, `updated: YYYY-MM-DD`, two or more specific tags, and `source:` naming where it came from when it was populated from a record rather than an answer.

## config.md

The instance literals. One fenced YAML block. The only file a new operator rewrites end to end.

**`operator_name` and `operator_email` are optional and default to empty.** Do not ask for them and do not fill them from your context, the system username, the cwd folder name, a git config, or a connected account. No routine and no dashboard panel reads either key, so empty is a permanent correct state rather than a gap. Populate them only if the user volunteers them unprompted.

`org_name` and `operator_timezone` are asked for, plainly and with nothing pre-filled, because routines need them: the timezone sets every schedule and the org name is business information. Never suggest either value from your context. Start from zero, per SKILL.md.

```yaml
# identity
org_name, operator_timezone, os_root
# optional, empty unless volunteered. Never inferred, never asked for
operator_name, operator_email
# domains
primary_domain, domains[]
# primary_channel: the ONE channel with role primary-original. Routines read this
#   rather than hardcoding a channel folder name
# channels: per channel: handle, url, role, cadence_target, cadence_actual,
#   plus the live counts and any hard limits like a title character ceiling
# offers: per offer: name, price, status, owner, landing.
#   A price that changes on a schedule gets one key per step with its date
# connectors: logical name to actual connector, one line each
# routines: the ten schedule times
# budgets: reads, writes, external_pulls, scan_lookback_hours
# thresholds: idea_backlog_min, draft_stale_days, published_perf_window_days,
#   context_stale_days, voc_theme_promote_weeks
# surfaces: dashboard_url, dashboard_deploy
# escalation: daily_brief_to, escalate_to
# competitors: grouped by tier
```

If a routine needs a value that is not a key here, that is a bug in the routine.

Where a tool resolves a handle to the wrong account, record the unambiguous identifier and the warning next to it. An ID beats a handle in every routine that pulls.

## personal-brand/background.md

`# Identity` (name, role, location, marketing scope) · `## Background that shapes the voice` · `## Operating principle` (one blockquote) · `## Working style` · `## What they decide personally` · `## What runs without them` · `## Who else touches marketing` · `## Preferences that affect output`

## personal-brand/voice.md

The master register. Every channel `voice.md` states only its delta from this file.

`## Channel registers` (table routing to each `Channels/*/voice.md`) · `## Hard rules` (numbered, the non-negotiables) · `## Tone attributes` · `## Sentence mechanics` · `## Emotional temperature` · `## Voice modes` with rough percentages · `## Signature phrases` · `## Never say` · `## Key misconceptions addressed` · `## The unique-insight rule` · `## The human-in-the-loop rule` · `## Examples are the fuel` · `## Final test`

The two rules that matter most:

**Unique insight.** The insight must come from the operator, not the model. Every piece must be sourced from a real asset, a real number, a customer quote, or the operator's own stated belief. A draft that cannot name its source is not ready.

**Human in the loop.** Never one-shot. Gate the angle, the core insight, the reader outcome, the outline, the hook, then the draft. Offer **multiple options at each gate** rather than one thing to correct.

## brand/positioning.md

`## Category` · `## The arch enemy` (with a they-versus-we table) · `## The message house` (roof claim, then pillars each with proof, then foundation) · `## Competitive landscape` (tiers, and how we differ) · `## The core narrative` in acts · `## Positioning guardrails`

The enemy is a pattern or an industry behaviour, not a named competitor.

## brand/brand-kit.md

`## Brand colours` (table with hex and usage) · `## Typography` · `## Design rules` · `## Where these apply` · `## Thumbnail style` if video is a channel · `## Rules`

Kept separate from positioning so design work loads tokens without the whole competitive frame. The design and ads skills resolve this file by name.

## icp/&lt;segment&gt;.md

**One file per segment. The pain points live inside it.** No `pain-points.md`, no `pain-points/` folder.

`## Who this is` · `## What they have in common` · `## The emotional reality` · `## Who they are NOT` · `## Where they come from` · `## Pains` numbered, each with the description, `**Emotional impact:**`, and `**Aware?**` yes or teach-them · `## Named objections` with real receipts · `## Solution journey` as a window-and-what-changes table

The "NOT" section and the verbatim pain language are the two highest-value parts.

The pain block is **appended, never rewritten.** The customer intelligence routine promotes a theme into a numbered pain once it has recurred for the number of weeks configured in `config.md`.

## strategy.md

`## Mission` · `## The north star` (one blockquote sentence) · `## Operating philosophy` · `## Current focus` · `## The binding constraint` · `## Annual objectives` · `## The funnel map` (stage, surface, offer, the number that matters) · `## What the OS is for` (the three things it must make true) · `## On the radar, not active` · `## Review cadence`

The funnel map lives here rather than in `Offers/` because it spans every offer and every channel.

## infrastructure.md

`## Source of truth by data type` (table: data, system of record, read via, routine that pulls it) · `## Production tools` · `## Connectors this OS depends on` (table: connector, needed by, what happens if missing) · `## What is authenticated as of <date>` · `## Rules`

The degradation column is what lets routines fail gracefully instead of inventing numbers. The authentication section carries its date, because it goes stale the moment someone connects a tool.

## The two compatibility shims

Both exist only so older skills resolving a literal filename find their way. Neither holds content of its own, and neither may restate what it points at.

**services.md** — a one-line pointer to the offer ladder in `Offers/`. Nothing else.

**branding.md** — the `./branding.md` contract file. Several skills (ads planning, ads creative, infographics, visual) look for a file named `branding.md` in the working directory and will **scrape the website to build one** if they cannot find it. This hands it to them instead.

Sections: `## Company` · `## What we do` · `## Audience` · `## Voice` with the never-list · `## Colours` table · `## Typography` · `## Visual style` · `## CTAs`

Tell the user the one-line copy step: `cp Context/branding.md ./branding.md` before running those skills.

## CLAUDE.md

The folder index. Files table with purpose and change frequency, then rules. See `folder-indexes.md`.

## What does NOT go in Context/

Each of these has exactly one other home, and putting it here is the duplication this OS exists to end.

| Not here | Where instead |
| --- | --- |
| A price or a package | `Offers/<offer>/offer.md` and `Context/config.md` |
| An offer's proof or case study | `Offers/<offer>/proof/` |
| Cadence or format rules for a surface | `Channels/<channel>/strategy.md` |
| The delta of a channel's voice | `Channels/<channel>/voice.md` |
| Our own numbers | `Analytics/` |
| A competitor or a customer quote | `Intelligence/` |
| A task list or a person's remit | `Team/<person>/` |
| A time-boxed push | `Campaigns/YYYY-MM-<slug>/` |
