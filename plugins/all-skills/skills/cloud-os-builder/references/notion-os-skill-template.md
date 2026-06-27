# Generated operator skill — template

The Notion route produces this `SKILL.md` and **gives it to the user** — most people will
upload it into Cowork or drop it into their skills folder themselves. So **default to
presenting the full, filled-in file in a code block** for them to copy. You may also offer to
save it to `~/.claude/skills/notion-os-assistant/SKILL.md` if they have a local filesystem,
but handing them the file is the primary path.

Fill every `{{PLACEHOLDER}}` with the real values from the build. In **solo mode**, delete
the routing rows for databases that weren't created (Departments, Processes). Keep the
`description` broad so the skill **auto-triggers** on anything OS / second-brain related.

---

```markdown
---
name: notion-os-assistant
description: Notion OS Assistant for {{OS_NAME}}'s second brain / operating system, hosted in Notion. Use this whenever the user asks about their projects, tasks, active work, meetings, decisions, notes, daily log, people, teammates, contacts, company context (strategy, ICP, brand, pain points), departments, processes, or anything about "my OS", "my second brain", "the workspace", or "what's on my plate". Reads and writes through the Notion connector.
---

# Notion OS Assistant — {{OS_NAME}}

This skill operates {{OS_NAME}}'s OS, which lives in **Notion**. The data is in databases;
this file is the router. Operate entirely through the **Notion connector** (search / fetch /
create-pages / update-page / create-view) — there are no local files.

## First, every session
1. `fetch` the master index page — **CLAUDE.md**: {{CLAUDE_MD_URL}} — to load the live
   conventions + database map.
2. Then query only the database you need. Don't scan the whole workspace.

## Routing table
| If the request is about… | Database | data_source_id |
|---|---|---|
| company/you facts — strategy, ICP, brand, pain points | 📌 Context | {{CONTEXT_DS}} |
| projects / active work / status | 🚀 Projects | {{PROJECTS_DS}} |
| meetings / decisions / competitor or market notes | 🧠 Intelligence | {{INTELLIGENCE_DS}} |
| daily log / what I did / today | 🗓️ Daily | {{DAILY_DS}} |
| people / teammates / contacts | 👥 People | {{PEOPLE_DS}} |
| prompts / frameworks / saved links | 📚 Resources | {{RESOURCES_DS}} |
| departments / org units | 🏢 Departments | {{DEPARTMENTS_DS}} |
| SOPs / processes | ⚙️ Processes | {{PROCESSES_DS}} |

## How to read
- Search within a database: connector search scoped to its `data_source_url`
  (`collection://<data_source_id>`), or `fetch` a specific page by URL.
- Filter by property; never read everything.

## Capture rules (writing)
- New meeting / decision / competitor / market note → row in **Intelligence**, link Project + People.
- New project → row in **Projects** (Status, Owner, Deadline); Overview / Current Status / Next Steps in the body.
- Each working day → row in **Daily**.
- New person → row in **People** (Type, Reports to).
- New long-form company/you fact → row in **Context** (set Category; body holds the detail).
- Writing a URL property → use the key `userDefined:URL`.
- Relations need both rows to exist; link by page URL.

## Rules
- Operate via the Notion connector only; this OS has no local files.
- Fetch CLAUDE.md first each session; it is the source of conventions.
- Preserve specificity (real names, numbers, dates). Omit empty fields — never write placeholders.
- Home page: {{HOME_URL}}
```

---

## Placeholder reference
| Placeholder | Fill with |
|---|---|
| `{{OS_NAME}}` | the OS / company name (e.g. "Ben AI") |
| `{{HOME_URL}}` | the home page URL |
| `{{CLAUDE_MD_URL}}` | the CLAUDE.md page URL |
| `{{CONTEXT_DS}}` … `{{PROCESSES_DS}}` | each database's `data_source_id` from the build |

Hand the user the file. If they save it locally
(`~/.claude/skills/notion-os-assistant/SKILL.md`) they should **restart Claude Code** to load
it; if they upload it into Cowork, it's available there. Either way, once active they can just
ask about their OS in natural language and it auto-triggers.
