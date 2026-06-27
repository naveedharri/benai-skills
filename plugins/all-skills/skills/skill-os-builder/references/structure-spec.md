# Canonical OS Structure (shared across Skill / Cloud / Local OS)

The same internal shape is used by all three OS tiers so a user can move between
them without reorganizing. The **location** changes; the **shape** doesn't.

```
<os-name>/
├── SKILL.md          # The router. Short. Holds the CLAUDE.md-style behavior
│                     #   rules + a routing table. NO long content here.
├── context/          # The brain. One file per domain. Loaded on demand.
│   ├── about-me.md       identity, role, voice, preferences
│   ├── projects.md       active work + status
│   ├── intelligence.md   notes, research, meeting capture
│   ├── people.md         key contacts / relationships
│   └── systems.md        SOPs, routines, recurring workflows
└── references/       # OPTIONAL second folder: heavier docs pulled in only
                      #   when needed (long specs, SOPs, archives).
```

## Principles
- **SKILL.md stays short.** It is the CLAUDE.md + routing table. If it is getting
  long, the content belongs in a `context/` file.
- **context/ is the default home for everything.** Start here.
- **references/ is optional** — add it only when a context file would otherwise
  bloat with reference material that is read occasionally.
- Mirror the user's real second brain (e.g. `Intelligence/`, `Projects/`) — rename
  context files to match how *they* think, not a generic template.

## Why the shared shape matters
A Skill OS, a Cloud OS, and a Local OS (Obsidian) all use this exact layout. That
is what makes "graduate from Skill → Cloud → Local" painless: the user copies the
same `context/` folder into a new location and re-points the router.
