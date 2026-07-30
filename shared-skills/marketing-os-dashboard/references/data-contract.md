# Data contract

The JSON shape the bundled shell renders. Match it or the page breaks silently.

> [!important] The shell is the contract, not this file
> `assets/control-center.html` carries a **complete skeleton** of the block inside `<script type="application/json" id="os-data">`, with every key present and every value a `<placeholder>`. That skeleton is authoritative. Read it, keep every key, and replace the placeholders with real values.
>
> This file explains the keys that are easy to get wrong. It does not restate all of them, because a second copy of a 15KB shape is exactly the drift this OS exists to prevent.

## The twenty top-level keys

Every one is required. A missing key renders a blank panel with no error a human would notice.

| Key | Feeds | Most-forgotten part |
| --- | --- | --- |
| `generated`, `mode`, `vault` | The header badge and every `obsidian://` source link | `vault` must be the vault name, or every source link 404s |
| `pages` | Page titles and subtitles in the nav | The only key that ships with real strings rather than placeholders |
| `core` | The Core page sphere and its readout | `nodes[].kind` must be a kind the geometry knows |
| `today` | The Core page's one-thing, needs-you and blocked lists | `oneThing.prompt` is what the copy button copies |
| `kpis`, `charts` | The tiles and the two line charts | `charts.*.ref` is the benchmark line, null if none is set |
| `calendar` | The Calendar page, week and month | `rows[].target` is per-day, not a weekly total |
| `content` | The Content page lifecycle | `trees[].expected` drives the "children never created" count |
| `library` | The asset wall and the head-to-head | See the note below |
| `campaigns` | The Campaigns page | `hasNumber: false` is what makes a campaign render as unevaluable |
| `performance` | The Performance page, funnel first | `tree` is the driver tree, `demand` is create-versus-capture |
| `learnings` | The Learnings page | `confirmed` ships as `[]`. See the rule below |
| `audience` | The Audience page | `pains` and `objections` come from inside each segment file |
| `intel` | The Intelligence page | `competitors.roster` versus `competitors.tracked` drives the contradiction box |
| `funnel` | The Funnel page ladder | `ladder[].d` is the effective date of each price step |
| `team` | The Team page cards and per-person pages | Required even for a solo operator. See below |
| `system` | The System page health check | `routines[].last: null` is the dead-routine flag |
| `feed` | The activity strip | |

## Field rules

**A gap is not a zero.** `v` accepts the literal string `not pulled`, which the shell renders as a red tag. Never send `0` for missing data. A zero is a claim about reality; a gap is the truth.

**`asof` is nullable and means never pulled.** Do not substitute today's date for a value you carried forward. That single shortcut is what turns a dashboard into a liar.

**`pct` is nullable.** Provide it only where a percentage against a target is meaningful. The shell renders a bar for every non-null `pct` and skips the rest. For an inverted metric like churn, where lower is better, `pct` is progress toward target and the shell styles it as a warning.

**`meas` / `m: false` means the figure is not measured.** The panel renders it as an estimate rather than a fact.

**`last: null` on a routine means it never ran.** The shell renders it red. This is the health check and the main reason the System page exists.

**`learnings.confirmed` ships as `[]` until a review cycle has run.** Every content skill reads the pattern library and cannot tell a placeholder from a finding, so one invented pattern degrades every future draft.

**`mode`** appears as a badge in the header. Use `seed build` while values are carried rather than measured, and `live` once a real snapshot exists. The user should be able to tell at a glance which they are looking at.

**`team` is required even for a solo operator.** Send one person, or an empty `people` array and an empty `absent` array. The panel renders its own empty state. Never delete the key, and never delete the panel from the shell.

**`library.rivalName` names the competitor whose packaging is being compared.** It is a label only, and it must be a competitor the OS actually tracks in `Intelligence/competitors/`. `library.rival` holds that competitor's best performers.

**`library.recent[].day7`, `.benchmark` and `.windowClosed`.** A seven-day figure is only comparable once the window has closed. Send `windowClosed: false` and the panel says so rather than presenting an open window as a result. Send `day7: null` when the series was never recorded daily, because a lifetime count is not a windowed one.

**`system.probedAt`** is the date the connectors were actually probed, not the build date.

## Deriving the fields

| Field | How |
| --- | --- |
| `today.oneThing` | The single highest-leverage open item, from `Team/<owner>/tasks.md` and the latest log's `Needs you` block |
| `today.needsYou` | The `Needs you` block in the latest `Intelligence/logs/` entry, plus any breached campaign threshold |
| `calendar.rows` | The cadence table in the primary channel's `strategy.md`, checked against each `Channels/*/pipeline/` |
| `content.pipeline` | Counts by `stage:` frontmatter across `Channels/<primary>/ideas/` and every `Channels/*/pipeline/` |
| `content.backlogMin` | `thresholds.idea_backlog_min` in `Context/config.md` |
| `content.staleDays` | `thresholds.draft_stale_days` in `Context/config.md` |
| `content.trees` | Each `Channels/<primary>/published/` asset, joined to the repurposed children that name it as parent |
| `content.untracked` | Published assets the connector returns that have no record in `published/` |
| `library` | The channel connector plus whatever research tool `Context/infrastructure.md` names |
| `campaigns.items` | `Campaigns/*/brief.md` frontmatter, plus `results.md` for the measured rows and the retro |
| `performance.funnel` | `Analytics/metrics.md`, preserving its four-section order |
| `performance.tree` | The north star in `Context/strategy.md`, with its drivers |
| `learnings` | The three sections of `Analytics/what-works.md`, plus every `Campaigns/*/results.md` retro |
| `audience` | `Context/icp/*.md`, pains and objections included since they live inside each segment file, plus `Intelligence/research/voice-of-customer.md` |
| `intel` | Latest `Intelligence/market/`, `Intelligence/competitors/`, `Intelligence/research/` |
| `funnel` | `Offers/*/offer.md`, `landing.md`, `proof/`, the ladder in `Context/strategy.md`, prices from `Context/config.md` |
| `team` | `Team/*/<person>.md` and `Team/*/tasks.md` |
| `system.connectors` | `Context/infrastructure.md` connector table plus a live probe if one is cheap |
| `system.routines` | The register in `Routines/CLAUDE.md`, with `last` from `Intelligence/logs/` |
| `core.nodes` | One node per real entity in the OS: assets, campaigns, channels, offers, routines, connectors, competitors |

## What not to put in the block

**Nothing that belongs to another business.** Every name, handle, price, quote and number comes from this OS. If a value traces back to a reference implementation, another company's vault, or the template's own example data, it is a bug. The shipped skeleton is all placeholders precisely so that leaking one is visible.

**No prose blocks.** The shell escapes everything it renders and carries its own explanatory copy. Long text belongs in the OS file, not the data block.

**No secrets.** The page may be deployed to a public URL. Never include an API key, an internal URL, or a customer's name without permission. Customer quotes should carry the theme and an attribution note rather than a named individual, unless permission is recorded in the quote bank.

**No computed claims presented as measured.** If a number is derived, say so in the adjacent note field. A growth rate inferred from two endpoints is not a measured rate.

## Verify

Parse the block, then confirm all twenty keys are present and every panel populates. An invalid data block renders a blank page silently, which is the failure mode this contract exists to prevent.
