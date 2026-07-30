# Conventions

The invariants. Break one and the result is not this OS.

## The eight invariants

1. **Root holds `CLAUDE.md` and folders. Nothing else.** No map file, no readme, no memory file, no dotfiles.
2. **Every folder carries its own `CLAUDE.md`**, under 120 lines, with a purpose, a files or routing table, and rules.
3. **`Context/` is authoritative.** No skill, channel file, or draft duplicates its content. They link to it.
4. **Brain-update routines log. Action routines do not.** Stated in every routine file, never inferred.
5. **Content never freezes.** The `## Performance` block on a published asset is append-only for the asset's life.
6. **No file deeper than two levels below root.**
7. **Every number carries its pulled date and source.** No estimates, ever.
8. **No em dashes.** Periods, commas, colons, or restructure.

## The core rule

Put this in the root `CLAUDE.md` verbatim:

> If it changes what the OS knows, it logs. If it just acts, it does not.

**Brain-update** routines change the OS's state of knowledge and log to `Intelligence/logs/YYYY-MM-DD.md`. **Action** automations produce a deliverable and do not log. A run that changes nothing still logs one line saying it ran, because silence is indistinguishable from failure.

Nine of the ten routines are brain-update. The dashboard is the only hybrid: it pulls data, which changes what the OS knows, and it also produces the deployed page.

## Content never freezes

The one deliberate divergence from a Sales OS, and worth explaining to the user.

A deal freezes on won or lost, because that is sales rather than fulfilment. An eighteen-month-old video still earns views, so a published asset's performance table stays append-only for its whole life. Never rewrite a row, never remove one.

## Naming

| Thing | Pattern |
| --- | --- |
| Published asset | `Channels/<channel>/published/YYYY-MM-DD-<slug>.md` |
| Daily log | `Intelligence/logs/YYYY-MM-DD.md` |
| Snapshot | `Analytics/snapshots/YYYY-MM-DD.md` |
| Monthly report | `Analytics/reports/marketing-report-YYYY-MM.md` |
| Quarterly report | `Analytics/reports/marketing-report-YYYY-Qn.md` |
| Weekly intelligence | `Intelligence/research/YYYY-Www.md` |
| Competitor | `Intelligence/competitors/<name-slug>.md` |
| Helper or template | underscore prefix: `_template.md`, `_roster.md` |

## Frontmatter

Always `status:` and two or more specific `tags:`. Include `type:`, `date:`, and `channel:` where they apply. Add `source:` when a file was populated from somewhere else, so provenance survives.

An `# H1` must not repeat the filename.

## Wikilinks

Use `[[wikilinks]]` for every entity, **woven into sentences**, never as a trailing bullet list of references. Inside a markdown table cell an alias pipe must be escaped as `\|`; outside a table it must not be.

Link liberally. A link to something that does not exist yet marks it as worth writing rather than being an error, and a densely linked OS is navigable in the graph view.

## Voice

Everything written in the OS or published from it inherits `Context/personal-brand/voice.md` plus the channel register in `Channels/<channel>/voice.md`.

The hard rules that apply to every word: no em dashes, no arrow bullets, never end a post on an emoji, no generic AI vocabulary, no rule-of-three padding.

## The daily is state, not a log

When a routine writes to a daily note: create once if today's entry does not exist, update in place if it does, do nothing if there is genuinely nothing new.

Never append per-run callouts. Run narration goes in the routine's log entry. A file that grows a stripe every hour is unreadable by the time it matters.

Open items from prior days stay in `Team/<person>/tasks.md`, which is the rolling backlog. The daily log is a dated snapshot.

## The quality bar

The OS should score 90 or above on `os-optimizer`. Build to these from the start, it is far cheaper than remediating.

| Property | Bar |
| --- | --- |
| Root `CLAUDE.md` | under 200 lines |
| Folder `CLAUDE.md` | under 120 lines |
| Auto-loaded context | around 3,000 tokens |
| Any single file | under 10KB |
| Discoverability | every file reachable from root in 3 hops or fewer |
| Folder index coverage | every folder with 2+ files or 1+ subfolder has one |
| Root hygiene | `CLAUDE.md` only |
| Routing table | every entry resolves, every folder mapped, descriptions match contents |
| Em dashes | zero |

The routing table rots first. `os-optimizer` samples files per folder and fails the entry when the description no longer matches what is actually there.

## Instance literals

Every value a routine needs lives in `Context/config.md`. Groups: `identity`, `domains`, `channels`, `offers`, `connectors`, `routines` (schedule times), `budgets`, `thresholds`, `surfaces`, `escalation`, `competitors`.

**One carve-out.** A routine's own `schedule:` and timezone frontmatter fields are literal by necessity, because a schedule cannot be a variable resolved at read time. Those are exempt. `config.md` carries the same times under `routines:` so the two can be diffed. Everything below the frontmatter is not exempt.

Test the finished OS: read every routine body and confirm every literal traces to a key in `config.md`. A hardcoded name, handle, metric, threshold, or URL in a routine body is a bug.
