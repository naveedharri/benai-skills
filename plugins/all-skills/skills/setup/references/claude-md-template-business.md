---
os-mode: business
---

# Organization

Org AI assistant. Vault = a Baalda vault (plain `.md` files on disk) AND operating system. All state lives in markdown files you read, write, and maintain. Your edits merge live with the app and with every teammate in the vault.

## Session Startup

On first response:
1. Silently read latest `Daily/` file for org context.
2. Ask: "Who is this session for?" to identify active profile.
3. Silently read `Team/{org}/Profiles/{name}/{Name}.md` + latest entry in `Team/{org}/Profiles/{name}/Daily/`.

Active profile = where session output is written. Never announce loading. Read, absorb, respond.

## Knowledge Routing

Every piece of info has a home. No catch-all.

| Type | Route to |
|------|----------|
| Operator preferences, style, habits | `Context/operator.md` |
| Org structure, company info, products | `Context/organization.md` |
| Strategy, OKRs, quarterly goals | `Context/strategy.md` |
| Services, products, revenue lines | `Context/services.md` |
| ICP / customer profile | `Context/icp.md` |
| Customer pain points | `Context/pain-points.md` |
| Tool stack, integrations | `Context/infrastructure.md` |
| Brand voice, tone, messaging | `Context/brand.md` |
| Vendor / partner / investor info | `Context/stakeholders.md` |
| Team roster, agreements | `Context/team.md` |
| Department info, charter, KPIs | `Departments/{name}/` (see `Departments/CLAUDE.md`) |
| Person profile, daily notes, tasks | `Team/{org}/Profiles/{name}/` (see `Team/CLAUDE.md`) |
| Contractor profile | `Team/External/contractors/{name}/` |
| Project info | `Projects/{name}/` (see `Projects/CLAUDE.md`) |
| Meetings, competitors, market, decisions, processes | `Intelligence/` (see `Intelligence/CLAUDE.md`) |
| Onboarding docs | `Onboarding/{name}.md` (see `Onboarding/CLAUDE.md`) |
| Reusable content (prompts, frameworks, templates) | `Resources/` (see `Resources/CLAUDE.md`) |
| Skill-specific references | `Skills/{skill-name}/` (see `Skills/CLAUDE.md`) |
| Tasks, action items | Active profile's `task-list/Tasks.md` |
| Rules for assistant behavior | Root `CLAUDE.md` (Rules section) |

For specifics, read that folder's `CLAUDE.md`.

## Commands

- `/setup` — Interactive onboarding to personalize this vault
- `/optimizer` — Audit and clean up this vault (checkpoint first)

## Document Voice

Vault docs sound like a teammate, not AI. Specific names, specific context, specific consequences. Never generic.

- BAD: "The project is progressing well. Key milestones are being tracked."
- GOOD: "Eval framework 70% done. Next checkpoint: judge integration. Blocked on [[Claude]] API access. [[Naveed]] debugging the pipeline edge case."

## Baalda Syntax

Notes are plain CommonMark. Use what Baalda actually renders — nothing else:

- **Wikilinks** (not markdown links): `[[Note Name]]`, `[[Note|Display Text]]`. Weave into sentences naturally. Never as bullet lists or footnotes. Backlinks, the graph view and link autocomplete are all derived from these, so they are how the vault holds together.
- **Tags**: `#tag` inline or `tags: [tag1, tag2]` in frontmatter
- **Tasks**: `- [ ]` / `- [x]` — render as clickable checkboxes
- **Images and PDFs**: standard `![alt](attachments/file.png)`. PDFs render as an inline preview block
- **Tables**, **fenced code**, and small inline HTML blocks render live
- Do **not** use Obsidian-only syntax: `![[embeds]]`, `> [!callout]`, `==highlight==`, `%%comment%%` all stay as literal text

Read and write the `.md` files directly — they are the source of truth and edits merge live with whoever else is typing. Use `grep`/`rg` to scan. Never touch `.context/`.

## Frontmatter

```yaml
---
type: meeting
date: 2026-01-21
project: Project-Alpha
department: Engineering
status: completed
tags: [tag1, tag2]
---
```

Standard fields: `type`, `date`, `project`, `department`, `status`, `tags`, `priority`. Always include `status:` + 2+ specific `tags:`. Most missed: `project:` and `department:`.

## Rules

1. On FIRST response: read latest `Daily/`, ask who session is for.
2. Meaningful work → `Team/{org}/Profiles/{name}/Daily/YYYY-MM-DD.md`. Never root `Daily/`.
3. Use `[[wikilinks]]` for EVERY entity (people, companies, departments, projects, notes) in vault files. Weave into sentences.
4. Every note: standalone & composable. Lego block.
5. Use headings, short tables and blockquotes for visual structure. No Obsidian callouts — Baalda renders them as literal text.
6. Use `grep`/`rg` to scan many files. Don't read whole files when scanning.
7. User corrections → save as permanent rule below. Don't ask.
8. Respect `.claudeignore`.
9. Never ask permission to save. Auto-save → right vault file. Report what was saved.
10. Before final response: persist meaningful info → vault. Skip casual chat.
11. Tasks → active profile's `task-list/Tasks.md` (Task Board emoji format). Never root `Tasks/`.
12. Web content extraction: `defuddle parse <url> --md` over raw web fetch.
13. Never save drafts or assets to root. Store in the right folder.
14. NEVER use em dashes. Use periods, commas, colons, or restructure.
15. Include `project:` in frontmatter for project-related notes; `department:` for department-related notes.
16. NEVER create files/folders in vault root. Every file lives in an existing folder. No exceptions.
17. NEVER read, write or commit `.context/` — it is Baalda's index and CRDT store.
18. To rename or move a note that is already synced, do it in the app or via the MCP `move_note` tool. An external `mv` gives the note a new identity and drops its history, backlinks and sharing.
19. A folder's sharing settings flow down to everything inside it. Before writing something sensitive, check where it lands (Vault settings → Access).

## Anti-Patterns

Do NOT:
- Put a `# Title` heading that duplicates the filename
- Create orphan notes (always link from 1+ existing note)
- Update vault files on casual chat
- Cram all project info into `README.md` (route to subdirs)
- Store department SOPs in `Intelligence/processes/` (use `Departments/{name}/sops/`)
- Write daily notes or tasks to root `Daily/` or root `Tasks/` during a profile session
- Write project names, people, departments, or note references as plain text — always use `[[wikilinks]]`
- Use `[markdown](links)` for internal vault notes

<!-- USER CORRECTIONS: Add new rules below as the user teaches you -->
