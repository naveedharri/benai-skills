This folder holds organizational knowledge: meetings, competitors, market intel, decisions, processes, archive.

## Routing

| Category | Type | Route to |
|---|---|---|
| Meetings | Team standup / daily huddle | `meetings/team-standups/` |
| Meetings | Client call | `meetings/client-calls/` |
| Meetings | One-on-one | `meetings/one-on-ones/` |
| Meetings | Board review | `meetings/board-reviews/` |
| Meetings | All-hands | `meetings/all-hands/` |
| Meetings | Cross-team sync | `meetings/cross-team/` |
| Meetings | Anything else | `meetings/general/` |
| Knowledge | Competitive insight | `competitors/{name}.md` |
| Knowledge | Market insight | `market/{topic}.md` |
| Knowledge | Decision with reasoning | `decisions/YYYY-MM-DD-{title}.md` |
| Knowledge | Org-wide process / SOP | `processes/{name}.md` |
| Archive | Completed / archived content | `archive/{name}/` |

## Decision Records

Every decision record should include the *why* with specific context: who was involved, what tension prompted it, what trade-off was made. Use `> [!important]` for the core decision statement and `> [!warning]` for known risks or trade-offs.

## Competitor Profiles

Use `> [!important]` for strategic implications and `> [!tip]` for opportunities identified.

## Rules

- Department-specific SOPs go to `Departments/{name}/sops/`, not `processes/`. `processes/` is for org-wide SOPs only.
- Move completed projects, sunset competitors, and superseded research to `archive/`.
