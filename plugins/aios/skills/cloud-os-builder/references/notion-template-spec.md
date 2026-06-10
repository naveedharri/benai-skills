# Notion OS — Template Spec (source of truth)

Canonical structure for the **Notion route** of `cloud-os-builder`. It mirrors the AIOS
spine (Identity · Projects · Intelligence · People · Systems) in Notion primitives:
**documents → pages**, **collections → databases** with properties, views, and relations.
Build it via the Notion connector (MCP). This spec reflects the polished, out-of-the-box
result — build to match it, not a barebones version.

API model (version **2025-09-03**): a *database* contains one or more *data sources*. Create
the database → get its `data_source_id` → add **properties** to the data source → create
**views** on the data source. **Relation** properties need both data sources to exist — wire
them in a second pass.

---

## Page tree

```
🏠 <Name> — Operating System        ← top-level page = home dashboard
├── 📄 CLAUDE.md                      ← master index + operating conventions (fetch first)
├── 📌 Context        [DATABASE]      ← one row per context doc (NOT a page of sub-pages)
├── 🚀 Projects       [DATABASE]
├── 🧠 Intelligence   [DATABASE]
├── 🗓️ Daily          [DATABASE]
├── 👥 People         [DATABASE]
├── 📚 Resources      [DATABASE]
├── 🛠️ Skills         ← page w/ sub-pages (linkedin-writer, newsletter-writer)
└── (business only)
    ├── 🏢 Departments [DATABASE]
    ├── ⚙️ Processes   [DATABASE]
    └── 📋 Onboarding  ← page
```

Keep the home title clean: `🏠 <Name> — Operating System` — never "test" or builder wording.

---

## 📄 CLAUDE.md (the master index page)

This is the `CLAUDE.md` equivalent. Notion can't auto-load it, so the operator must **fetch
it first each session**, then jump to the right database. Page body contains:

1. **How to operate this OS** — start here, load the map, query the right database by
   property/filter, never scan everything.
2. **Capture rules** — where each new thing goes (Intelligence / Projects / Daily / People /
   Context).
3. **Database map** — a table with one row per database: Name · what goes here · an **Open**
   link · its **`data_source_id`** (so Claude resolves it instantly). Fill this in step 7 of
   the build, once the databases exist and you have their IDs/URLs.
4. **Context docs** list + a link back to the home page.

Render the database map as a Notion table (`<table header-row="true">`). Put the
`data_source_id` in inline code and the link as `[Open](url)`.

---

## Databases

### 📌 Context  (the key upgrade — Context is a database)
- **Properties:** Name (title) · Category SELECT(Identity, Company, Offer, Customer, Brand,
  Strategy, Ops) · Summary (rich_text)
- **Rows (one page per doc), business mode:** Operator, Organization, Market, Services,
  Pain Points, ICP, Brand, Team, Strategy, Infrastructure, Stakeholders.
  **Solo mode:** Me/Operator, Business, Services, Pain Points, ICP, Brand, Strategy, Team,
  Infrastructure. Only create rows that have real content.
- **Page body** = the long-form context (the old `context-*.md` content).
- **Views:** Table (default) · Board by Category.
- **Home lead view:** a **flat** table (no grouping) sorted by Name — one row per doc.

### 🚀 Projects
- **Properties:** Name (title) · Status SELECT(Active, Planning, On hold, Done) · Owner
  (text) · Priority SELECT(High, Medium, Low) · Deadline (date) · Tags (multi_select) ·
  People (relation → People) · Intelligence (relation → Intelligence)
- **Views:** Board by Status (default) · Table · Calendar by Deadline
- **Page body template:** Overview · Current Status · Key Resources · Next Steps

### 🧠 Intelligence
- **Properties:** Name (title) · Type SELECT(Meeting, Decision, Competitor, Market, Note) ·
  Date (date) · Project (relation → Projects) · People (relation → People) · Tags (multi_select)
- **Views:** Table by Date desc (default) · Board by Type · Calendar by Date

### 🗓️ Daily
- **Properties:** Name (title = the date) · Date (date) · Focus (text) · Tags (multi_select)
- **Views:** Calendar (default) · Table "recent" (sort Date desc)
- **Template button:** new daily note with Session / Completed / Next Steps

### 👥 People
- **Properties:** Name (title) · Role (text) · Org (text) · Type SELECT(FT, Contractor,
  Advisor, External) · Reports to (self-relation) · Projects (relation → Projects) · Email
  (email) · Notes (text)
- **Views:** Table (default) · Gallery · Board by Type

### 📚 Resources
- **Properties:** Name (title) · Type SELECT(Prompt, Framework, Swipe file, Template, Link) ·
  Tags (multi_select) · URL (url)
- **Views:** Table (default) · Gallery by Type

### 🏢 Departments  (business only)
- **Properties:** Name (title) · Lead (relation → People) · Charter (text)

### ⚙️ Processes  (business only)
- **Properties:** Name (title) · Status SELECT(Draft, Active, Deprecated) · Owner (relation
  → People) · Department (relation → Departments)

---

## Home dashboard (body of 🏠 <Name> — Operating System)
Add linked-database views so the home page is a real command center. **Create them in this
exact order** (linked views only append, so creation order = on-page order):

1. **📌 Context** — flat table, no grouping, sorted by Name (Name, Category, Summary) ← LEAD
2. **🚀 Active Projects** — table, filter Status = Active, sort Deadline asc
3. **🧠 Recent Intelligence** — table, sort Date desc
4. **🗓️ Daily (recent)** — table, sort Date desc
5. **👥 People** — table, sort Name asc (Name, Role, Type, Org)
6. **🏢 Departments** — table, sort Name asc (Name, Lead, Charter) *(business mode)*

Home intro text should reference these views and point to **📄 CLAUDE.md** (not "Start Here").

---

## Build order (for the MCP/API)
1. Create the **home page**.
2. Create **📄 CLAUDE.md**, **🛠️ Skills**, **📋 Onboarding** pages as children.
3. Create the **📌 Context** database + the other databases as children of the home page.
   Record every `database_id` + `data_source_id`.
4. Add **non-relation properties** + select options to every data source.
5. Second pass: add **relation** properties (Projects↔People, Intelligence↔Projects/People,
   People self-relation, Departments→People, Processes→People/Departments).
6. Create **per-database views**, then the **home linked views in the order above**.
7. **Fill the CLAUDE.md database map** now that IDs/URLs exist.
8. Onboarding (N.4) → write content: Context rows, Projects, People, Departments,
   Intelligence, first Daily.

---

## Connector gotchas (learned from live builds — get these right first try)
- **URL property writes** use the key `userDefined:URL` (and `userDefined:id`), not `URL`.
- **Linked views**: create only with the `create-view` tool. The Notion-markdown
  `<database data-source-url="collection://…">` insert is **rejected** ("data source not
  found"), so don't try to insert linked views via page content.
- **Linked views append** to the end of the page; there is no position arg. To get a specific
  order (Context first), **create them in the desired order**. To reorder later you must
  delete + recreate views — and only ever delete `inline="true"` empty view blocks, never the
  `inline="false"` titled blocks (those are the real databases; deleting them loses data).
- **Relations** need both data sources to exist; add them in a second pass. Self-relation
  (People "Reports to"/"Reports") uses `RELATION('<ds>', DUAL 'Reports' 'reports')`.
- **CLAUDE.md is not auto-loaded** by Notion. The operator must fetch it first each session.
- Page titles auto-link strings like `CLAUDE.md`; render the in-body heading as inline code
  (`` `CLAUDE.md` ``) to avoid an ugly auto-link.
- Never create files or `.obsidian` artifacts on the Notion route.

---

## Notion OS Assistant skill (generated for the user)
After the workspace is built, the route also generates a small **auto-triggered skill** —
**Notion OS Assistant** (`name: notion-os-assistant`) — from
`references/notion-os-skill-template.md`. It is **handed to the user** as a single `SKILL.md`
(default: present the file for them to copy/upload into Cowork; optionally save under
`~/.claude/skills/notion-os-assistant/`). Its `SKILL.md` acts as the user's `CLAUDE.md`/router
for the Notion OS: a broad auto-trigger description, a routing table (intent → database →
`data_source_id`), capture rules, and the "fetch CLAUDE.md first" convention — all operating
through the Notion connector. This is what lets the user start using their OS in natural
language the moment the build finishes.

## What Notion adds over the file tiers
Relations + rollups + the linked-view dashboard: meetings link to projects + attendees;
departments link to their lead; the home page shows Context, active work, and recent intel as
live views. Realtime + multiplayer, but **cloud-only** (no local copy).
