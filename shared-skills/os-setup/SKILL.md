---
name: os-setup
description: Bootstrap the BenAI OS Plugin vault structure and run personalized onboarding. Creates all directories, system files, Obsidian config, memory system, hooks, and output styles, then interviews the user to personalize everything. Two modes — Solopreneurs/Professionals (default), Business/Teams. Use when user says "set up", "bootstrap", "initialize", "onboarding", or runs /os-setup.
---

# BenAI Obsidian Plugin — Setup + Onboarding

USE WHEN the user runs `/setup` or asks to set up their vault, bootstrap the assistant, initialize the system, or configure the BenAI Obsidian Plugin.

This is a three-phase process:
- **Phase 0**: Mode Selection — Ask which OS variant to create
- **Phase A**: Bootstrap — Create the directory structure and system files for the selected mode
- **Phase B**: Onboarding — Interview the user and personalize everything

## Pre-flight Check

Check if `claude.md` or `CLAUDE.md` exists **only** in the current working directory (do NOT search subdirectories or parent directories — check only the exact CWD path).

- **If it exists**: The vault is already set up. Ask the user:
  - "This vault is already set up. Would you like to:"
  - **Re-run the interview** — Keep existing structure, update memory files based on new answers
  - **Full reset** — Delete everything and start fresh (confirm twice before proceeding)
  - **Cancel** — Do nothing
- **If it does NOT exist**: Proceed with full setup (Phase 0 + Phase A + Phase B)

---

## Phase 0: Mode Selection

Ask the user to pick a mode using AskUserQuestion with these exact `label` and `description` values:

- Question: `What type of vault do you want?`
- Option 1 label: `Solopreneurs/Professionals` — description: `Blends work and personal. Best for solo founders, freelancers, consultants.`
- Option 2 label: `Business/Teams` — description: `Org structure with departments, processes, stakeholders. Best for teams and companies.`

**CRITICAL**: You MUST pass both `label` AND `description` for each option in AskUserQuestion. The `description` field is what explains each mode to the user. Never leave `description` empty.

Mode mapping:
- Solopreneurs/Professionals → `os-mode: professional`
- Business/Teams → `os-mode: business`

Accept any clear signal: "solo", "professional", "freelancer", "business", "org", "team", etc.

If the user skips or says "I don't know", use **Solopreneurs/Professionals** (professional mode).

Store the selected mode. It will be written to `CLAUDE.md` frontmatter as `os-mode: professional | business`.

---

## Phase A: Bootstrap

Create the directory structure and write all system files for the selected mode.

### Resolving reference file paths

Every `references/<file>.md` mentioned below lives in the `references/` subdirectory next to **this SKILL.md** — not in the user's working directory. Two conventions matter:

- **Read paths** (`references/foo.md`) → resolve relative to this SKILL.md's directory.
- **Write paths** (`./Foo/CLAUDE.md`) → resolve relative to the user's current working directory (the vault root).

If the Read tool can't open a `references/...` path directly (some harnesses mount the skill at a path that differs between Read and Bash), run a quick discovery step **once** before Step A.2:

```bash
# Find the references directory; cache the result for the rest of Phase A.
find / -type d -path '*/setup/references' 2>/dev/null | head -1
```

Use that absolute path as the prefix for every reference read in Phase A and Phase B. Don't retry path resolution per-file — do it once and reuse.

### Step A.1: Create Directory Structure

**All modes** share this base:

```bash
mkdir -p .claude
mkdir -p Context
mkdir -p Projects
mkdir -p Daily
mkdir -p Resources
mkdir -p Skills
```

**Solopreneurs/Professionals mode** adds:

```bash
mkdir -p Intelligence/meetings/team-standups
mkdir -p Intelligence/meetings/client-calls
mkdir -p Intelligence/meetings/one-on-ones
mkdir -p Intelligence/meetings/general
mkdir -p Intelligence/competitors
mkdir -p Intelligence/market
mkdir -p Intelligence/decisions
mkdir -p Intelligence/archive
```

**Business mode** adds:

```bash
mkdir -p Intelligence/meetings/team-standups
mkdir -p Intelligence/meetings/client-calls
mkdir -p Intelligence/meetings/one-on-ones
mkdir -p Intelligence/meetings/board-reviews
mkdir -p Intelligence/meetings/all-hands
mkdir -p Intelligence/meetings/cross-team
mkdir -p Intelligence/meetings/general
mkdir -p Intelligence/competitors
mkdir -p Intelligence/market
mkdir -p Intelligence/decisions
mkdir -p Intelligence/processes
mkdir -p Intelligence/archive
mkdir -p Departments
mkdir -p Team
mkdir -p Onboarding
mkdir -p Resources/templates
```

`Team/` is created empty here. Profile-first subfolders (`Team/{org}/Profiles/{person}/...`) are scaffolded in Phase B once Q6 answers are in.

### Step A.2: Write System Files from References

Read each reference file and write it to the corresponding local path. The reference files contain the complete content for each system file.

**All modes** — shared system files:

| Reference File | Creates at Local Path |
|---|---|
| `references/settings-json-template.md` | `./.claude/settings.json` |
| `references/claudeignore-template.md` | `./.claudeignore` |
| `references/gitignore-template.md` | `./.gitignore` |

**Mode-specific root CLAUDE.md template:**

| Mode | Reference File | Creates at Local Path |
|---|---|---|
| Solopreneurs/Professionals | `references/claude-md-template.md` | `./CLAUDE.md` |
| Business | `references/claude-md-template-business.md` | `./CLAUDE.md` |

**Per-folder routing indexes** (every major folder gets its own `CLAUDE.md` — matches production vault convention):

| Mode | Reference File | Creates at Local Path |
|---|---|---|
| Solopreneurs/Professionals | `references/claude-md-context.md` | `./Context/CLAUDE.md` |
| Solopreneurs/Professionals | `references/claude-md-projects.md` | `./Projects/CLAUDE.md` |
| Solopreneurs/Professionals | `references/claude-md-daily.md` | `./Daily/CLAUDE.md` |
| Solopreneurs/Professionals | `references/claude-md-intelligence.md` | `./Intelligence/CLAUDE.md` |
| Solopreneurs/Professionals | `references/claude-md-resources.md` | `./Resources/CLAUDE.md` |
| Solopreneurs/Professionals | `references/claude-md-skills.md` | `./Skills/CLAUDE.md` |
| Business | `references/claude-md-context.md` | `./Context/CLAUDE.md` |
| Business | `references/claude-md-projects.md` | `./Projects/CLAUDE.md` |
| Business | `references/claude-md-daily.md` | `./Daily/CLAUDE.md` |
| Business | `references/claude-md-intelligence.md` | `./Intelligence/CLAUDE.md` |
| Business | `references/claude-md-resources.md` | `./Resources/CLAUDE.md` |
| Business | `references/claude-md-skills.md` | `./Skills/CLAUDE.md` |
| Business | `references/claude-md-departments.md` | `./Departments/CLAUDE.md` |
| Business | `references/claude-md-team.md` | `./Team/CLAUDE.md` |
| Business | `references/claude-md-onboarding.md` | `./Onboarding/CLAUDE.md` |
| Business | `references/claude-md-processes.md` | `./Intelligence/processes/CLAUDE.md` |

For each row applicable to the selected mode: read the reference file, then write its content to the local path.

### Step A.3: Initialize Starter Context Files

**All modes** — create placeholder skill folders:

```bash
mkdir -p Skills/linkedin-writer/references
mkdir -p Skills/newsletter-writer/references
```

Then write placeholder files from references:
- Read `references/skills-placeholder-linkedin-notes.md` → write to `./Skills/linkedin-writer/notes.md`
- Read `references/skills-placeholder-linkedin-example.md` → write to `./Skills/linkedin-writer/references/example-post.md`
- Read `references/skills-placeholder-newsletter-strategy.md` → write to `./Skills/newsletter-writer/strategy.md`
- Read `references/skills-placeholder-newsletter-example.md` → write to `./Skills/newsletter-writer/references/example-edition.md`

**Solopreneurs/Professionals mode:**
- Read `references/context-me.md` → write to `./Context/me.md`

**Business mode:**
- Read `references/context-operator.md` → write to `./Context/operator.md`
- Read `references/context-organization.md` → write to `./Context/organization.md`
- Read `references/context-team.md` → write to `./Context/team.md`
- Read `references/context-strategy-business.md` → write to `./Context/strategy.md`

**Business mode — `Team/` is created empty in Phase A.** Profile-first scaffolding (`Team/{org}/Profiles/{person}/...`) happens in Phase B Build Step 3 once Q6 answers identify the actual people.

### Step A.4: Make Hooks Executable

```bash
chmod +x .claude/hooks/*.sh
```

### Step A.5: Confirm Bootstrap

Tell the user:
- "Vault structure created successfully in **[mode]** mode."
- List the main folders created (varies by mode), including `Skills/`
- Recommend opening this folder as a vault in Obsidian
- Recommend installing **TaskNotes** community plugin if they want task management features
- Note that **Bases** (native database views) are built into Obsidian — no plugin needed for queries
- Mention `Resources/` for storing prompts, frameworks, swipe files, and templates
- "Now let's personalize it for you."

Then proceed to Phase B.

---

## Phase B: Onboarding — Guided Brain Dump

This skill runs **inside Cowork**. Phase B uses Cowork's rich-HTML widget tool — **not** AskUserQuestion — to render a real form with stacked categories, free-text textareas, and proper styling (matches the look of `os-optimizer`'s "Audit run details" form).

It's a guided brain dump across **12 categories** of the user's life and business, batched into **3 rich-HTML forms** (4 categories per form). Bullet points inside each category are **inspiration prompts** — riff on whatever lands.

The pitch to the user: *sit down for an hour or two, pour a beer, order a pizza, and brain-dump. It's not only for the assistant to feel personal on day one — it's a useful exercise in itself.*

### The tool: `mcp__visualize__show_widget` (Cowork-only)

Each of the 3 forms is **one** call to `mcp__visualize__show_widget`. The tool accepts:

| Field | Purpose |
|---|---|
| `title` | Internal widget identifier (e.g. `os_setup_form_1_you_business`) |
| `loading_messages` | Array of short strings shown while the form renders |
| `widget_code` | Raw HTML for the form (uses Cowork's `elicit-*` class conventions) |

The user fills in the form and submits. The submitted values come back to the agent as the tool result. The agent then proceeds to the next form. No AskUserQuestion. No radio buttons. No "Other" box.

### How the user should respond — per category

Inside each category's textarea, the user can:

1. **Paste a Whisper / dictation transcript** — open phone or Mac dictation, ramble for 2–5 minutes, paste the transcript.
2. **Paste documents** — links to PDFs, Notion pages, Google Docs, brand guides, About pages, LinkedIn profiles, OKR docs, decks. Or drop file paths.
3. **Point at connectors** — paste a Notion workspace URL, a wiki link, a Drive folder.
4. **Type long-form free text.**

Two kinds of knowledge: **what lives in your head** (Whisper it) and **what already lives online or in a tool** (paste links / docs). Mix freely per category. Leave a textarea blank to skip that category.

### Before Form 1 — Send one orienting message

Send this verbatim (or close to it), no tool call yet:

> Three short forms, four categories each, twelve categories total. This isn't a quiz — it's a guided brain dump.
>
> Each category has three ways to give me context: a **brain-dump textarea**, a **links & file paths field**, and a **file upload**. Use any or all. Brain-dump anything around the bullet inspirations — you don't have to hit each one. Leave a category blank to skip it.
>
> Best inputs: a Whisper / dictation transcript, an About page URL, a brand guide PDF, an OKR doc, a LinkedIn profile, a Notion page. The more you give me, the less generic your vault will be on day one.
>
> Sit down for an hour or two. Pour a beer. Order a pizza. This is worth it.
>
> Submit each form when ready. Type "skip all" anytime to jump to defaults.

### Widget HTML template (every category in every form uses this shape)

Each category gets **three inputs**: a brain-dump textarea, a links/paths textarea, and a file upload input. Any or all can be filled. All blank = skip.

Inside `widget_code` for each form, build a `<form class="elicit">` containing one header and four `elicit-group` blocks. Per category:

```html
<div class="elicit-group">
  <label class="elicit-question">{N}/12 — {Category name}</label>
  <div class="elicit-bullets" style="font-size:13px; color:var(--color-text-secondary); margin:8px 0">
    <ul style="margin:0; padding-left:18px">
      <li>{inspiration bullet 1}</li>
      <li>{inspiration bullet 2}</li>
      <li>{inspiration bullet 3}</li>
      <!-- etc -->
    </ul>
    <p style="margin-top:6px; font-style:italic">Brain-dump in the textarea below, OR paste links / file paths, OR upload docs. Any combination. Leave all blank to skip this category.</p>
  </div>

  <textarea class="elicit-textarea" name="cat{N}_braindump" rows="6"
    style="width:100%; border-radius:10px; padding:10px; border:1px solid var(--color-border-subtle); font-family:inherit; font-size:13px; margin-bottom:8px"
    placeholder="Brain dump — paste a Whisper transcript, or type long-form…"></textarea>

  <textarea class="elicit-textarea" name="cat{N}_links" rows="2"
    style="width:100%; border-radius:10px; padding:10px; border:1px solid var(--color-border-subtle); font-family:inherit; font-size:13px; margin-bottom:8px"
    placeholder="Links & file paths — one per line (Notion URL, LinkedIn profile, /path/to/file.pdf, etc.)"></textarea>

  <input class="elicit-file" type="file" name="cat{N}_files" multiple
    accept=".md,.txt,.pdf,.docx,.pptx,.xlsx,.csv,.json,.yaml,.yml,.png,.jpg,.jpeg"
    style="font-size:12px; color:var(--color-text-secondary)">
</div>
```

And one header at the top of `<form class="elicit">`:

```html
<div class="elicit-header">
  <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><!-- pencil/clipboard icon --></svg>
  <span>{Form title}</span>
</div>
<div class="elicit-body">
  <!-- 4 elicit-group blocks -->
</div>
```

Reuse the SVG icon pattern from the `os-optimizer` `Audit run details` widget (clipboard-with-marks icon). Form titles: "You & business", "Customer & brand", "How you operate" (solo) — or "You & company", "Offer, customer & brand", "How the company operates" (business).

### Reading form submissions

When the widget returns, the result is a record mapping each input's `name` to its value:

- `cat{N}_braindump` → string (the typed text / transcript)
- `cat{N}_links` → string (newline-separated URLs and file paths)
- `cat{N}_files` → array of file references (Cowork uploads these into the workspace folder; the result gives you the paths or signed URLs)

A category is "skipped" only when all three inputs are empty/blank.

### Ingestion between forms

After each form returns, for each category (N = 1..4 in this form):

1. **`cat{N}_braindump`** — if non-empty, tag and store raw in the working corpus under the category. Don't paraphrase.
2. **`cat{N}_links`** — split on newlines. For each line:
   - HTTP(S) URL → fetch with WebFetch / WebSearch.
   - Local file path → Read it.
   - Folder path → Glob, then Read each file.
3. **`cat{N}_files`** — for each uploaded file:
   - `.md`, `.txt`, `.json`, `.yaml`, `.csv` → Read directly
   - `.pdf` → Read with `pages` param if large
   - `.docx`/`.pptx`/`.xlsx` → use `pandoc` / `textutil` via Bash if available; otherwise note and continue
   - Images → Read (multimodal)

Merge everything into the corpus tagged by category. Then immediately fire the next form. No commentary or summarization between forms.

Both modes use Oskar's category breakdown. Bullet inspiration prompts are Oskar's prompt blocks verbatim, plus Ben's framing of "brain-dump anything around any of these bullets."

---

### Solopreneurs/Professionals mode — 3 forms × 4 categories

**Form 1 — You & business** — one `mcp__visualize__show_widget` call. Title: `os_setup_form_1_you_business`. Contains Q1–Q4 as stacked `elicit-group` blocks.

**Q1. You.** Form header: `You`
Bullets:
- Name, role/title, location, industry
- When and how you do your best work (mornings? deep blocks? after a walk?)
- If someone you respected had to introduce you in a room of people you respected, how would you want them to describe you?
- 5 attributes that describe you (one or two words each)

**Q2. Your origin and POV.** Header: `POV`
Bullets:
- Why you started or joined what you're doing now
- A belief or POV you hold strongly, even when it's unpopular
- The "big idea" your work is built on (the wedge, the thesis)
- Who or what you're fighting against — a category, a behavior, a competitor archetype, a status quo

**Q3. What you sell.** Header: `Lines`
Bullets (one paragraph per revenue line, or skip if none yet):
- Name, what it does, who it's for, stage
- Current revenue baseline if applicable
- How it came to exist. What made you start it.

**Q4. The promise.** Header: `Offer`
Bullets:
- The 1–3 problems you solve for customers
- For each problem: are customers already aware they have it, or do you have to teach them?
- Your value proposition in one sentence
- The promise or guarantee you make (explicit or implicit)
- Why customers actually pick you — in their words if you've heard them say it

**Form 2 — Customer & brand** — one `mcp__visualize__show_widget` call. Title: `os_setup_form_2_customer_brand`. Contains Q5–Q8 as stacked `elicit-group` blocks.

**Q5. The customer.** Header: `Customer`
Bullets:
- Title, role, industry, responsibilities
- What their day looks like, what tools they live in
- The language and words *they* use to describe their problem
- The dream outcome they want
- The situation they're in *before* they come to you — what triggered the search
- How long they typically take to decide to buy
- The media, podcasts, newsletters, or creators they follow
- 3–5 real examples (names, LinkedIn profiles, or company names)

**Q6. Your voice and look.** Header: `Voice`
Bullets:
- Tone descriptors that fit (direct, warm, dry, technical, playful, serious, supportive…)
- 5 attributes that describe how you sound
- Signature phrases you actually use
- Words or phrases you'd never use
- Topics you love talking about
- Topics you refuse to discuss publicly
- Brand colors, fonts, taglines if you have them
- The feeling people should carry away after reading your stuff
- Or: paste a writing sample / link and I'll extract from it

**Q7. Your positioning.** Header: `Position`
Bullets:
- The enemy you're fighting (the category, behavior, or competitor archetype)
- How you solve the problem *differently* from the obvious alternatives
- 3–4 distinct messages you want associated with your name or brand

**Q8. This year's priorities.** Header: `Priorities`
Bullets:
- 1–3 outcomes with a number attached (revenue, audience size, ship date)
- The *why* behind each
- What you're explicitly saying no to in order to focus here

**Form 3 — How you operate** — one `mcp__visualize__show_widget` call. Title: `os_setup_form_3_how_you_operate`. Contains Q9–Q12 as stacked `elicit-group` blocks.

**Q9. Active projects.** Header: `Projects`
Bullets (for each project):
- Name, one-line purpose, status, deadline if any
- Which business it belongs to (if multiple)
- Who else is involved

**Q10. The people you work with.** Header: `People`
Bullets:
- Team, contractors, key external contacts
- For each: name, role, how you work together
- Skip if fully solo

**Q11. Your stack.** Header: `Stack`
Bullets:
- Stack across communication, meetings, CRM, content, finance, dev, automation
- Source of truth for each main workflow — where deals live, where decisions live, where writing actually happens, where the calendar lives

**Q12. Drains and workflows to automate.** Header: `Drains`
Bullets:
- Top 1–2 painful, repetitive workflows. Use this template:
  When **X** happens → I do **Y** → it takes **Z** time → output is **W** → what I want is **V**
- What's draining your attention right now — unclosed loops, decisions sitting unmade, things that should be done but aren't

---

### Business/Teams mode — 3 forms × 4 categories

Same question shape as solo mode. Three `AskUserQuestion` calls, four questions each.

**Form 1 — You & company** — one `mcp__visualize__show_widget` call. Title: `os_setup_form_1_you_company`. Contains Q1–Q4 as stacked `elicit-group` blocks.

**Q1. You, as operator.** Header: `Operator`
Bullets:
- Name, title, department, who you report to
- Decision authority (what you can sign off on alone)
- Location, working style
- What's draining your attention right now — unclosed loops, decisions sitting unmade

**Q2. The company.** Header: `Company`
Bullets:
- Legal entity name, industry, stage
- Founded year, headcount (FT + contractors)
- Headquarters and where the team is based
- One-sentence mission
- Why the company started (origin)
- The belief or POV the company stands for

**Q3. The market.** Header: `Market`
Bullets:
- The broad target industry
- The specific niche you operate in
- Trends and hot topics in the industry right now
- What's not going well in the industry — the inefficiency or broken thing you're betting against
- What changed in the last 5–10 years
- The main players (incumbents, competitors, adjacent categories)

**Q4. What you sell.** Header: `Lines`
Bullets (for each revenue line):
- Name, what it does, who buys it
- Current revenue baseline, status (active, new, sunsetting)

**Form 2 — Offer, customer & brand** — one `mcp__visualize__show_widget` call. Title: `os_setup_form_2_offer_customer_brand`. Contains Q5–Q8 as stacked `elicit-group` blocks.

**Q5. The promise.** Header: `Offer`
Bullets:
- The 1–3 problems you solve for customers
- For each: are customers already aware they have it, or do you teach them?
- Value proposition in one sentence
- The promise or guarantee you make
- Key features and capabilities that deliver the value
- Why customers actually pick you over alternatives
- The kind of results you typically deliver — include a real example if you have one

**Q6. The customer.** Header: `ICP`
Bullets:
- Who's in charge of buying — title, role, responsibilities
- What their day looks like, what tools they use
- The language and words *they* use to describe their problem
- Dream outcome they want
- Situation before buying — what triggered them to look
- How long the buying decision typically takes
- Market trends affecting them right now
- Media, podcasts, or creators they follow
- 3–5 real examples (LinkedIn profiles or company names)

**Q7. The brand voice and look.** Header: `Voice`
Bullets:
- Tagline and value prop in plain language
- Voice in a paragraph or as descriptors (direct, warm, dry, technical…)
- 5 attributes that describe how the brand sounds
- Signature phrases used across your content
- Words or phrases you'd never use
- Topics you love covering
- Topics you avoid publicly
- Brand colors, fonts, logo notes
- The feeling readers and customers should carry away

**Q8. The positioning.** Header: `Position`
Bullets:
- The enemy — the category, status quo, or competitor archetype you're fighting
- How you solve the problem *differently* from obvious competitors
- Brand personality in 5 adjectives
- The "big concept" the company is built on
- 3–4 distinct messages you want associated with the brand

**Form 3 — How the company operates** — one `mcp__visualize__show_widget` call. Title: `os_setup_form_3_how_company_operates`. Contains Q9–Q12 as stacked `elicit-group` blocks.

**Q9. The team.** Header: `Team`
Bullets:
- The departments and the lead for each
- Team members getting their own profile folders. For each: name, role, reports-to, FT or contractor, location
- (Profile folders include their own daily notes, tasks, and sub-schedules.)

**Q10. This year's OKRs.** Header: `OKRs`
Bullets:
- 1–3 objectives for the year (or quarter)
- For each KR: target number, owner, current status
- The *why* behind each objective
- What you're explicitly saying no to in order to focus here

**Q11. Active projects.** Header: `Projects`
Bullets (for each project):
- Name, owner, status, deadline if any
- Client-facing or internal
- Which business unit or department it sits under
- Key collaborators

**Q12. Stack, workflows, and stakeholders.** Header: `Stack`
Bullets:
- Stack across communication, meetings, CRM, PM, content, finance, dev
- Source of truth for each main workflow — where deals live, where decisions live, where writing happens, where the calendar lives
- Top 3 painful, repetitive workflows. Template:
  When **X** happens → we do **Y** → it takes **Z** → output is **W** → what we want is **V**
- External stakeholders: investors, partners, vendors, top clients. Name, type, nature of the relationship.

---

The user submits each form with one click. Per-category response patterns:
- Type / paste a brain dump, transcript, links, docs, or file paths into the textarea
- Leave the textarea blank to skip that category
- Reply "skip all" between forms — stop asking and move to Phase B+

**Accept whatever they give.** Don't ask follow-ups inside or between forms. Extract what you can.

**If the user submits every form empty** — proceed to build with defaults only.

---

## Phase B+: Additional Context Drop

After Q12 (or "skip all") and **before** Phase B Build, ask one final `AskUserQuestion` to invite any leftover source material that didn't surface during the 12 categories. Most users still have brand decks, About pages, intake forms, LinkedIn URLs, Notion docs, PDFs, slide exports, voice/style guides, OKR docs, org charts, project briefs, etc. Always ask, even if Q1–Q12 looked rich.

**Call AskUserQuestion** (one question, header: `Context`):
- Question: "Anything else I should pull from before building? Upload files (PDFs, MDs, DOCXs), paste links (LinkedIn, websites, Notion pages, Google Docs), point me at a local folder, or paste raw text. The more I have, the more personalized your vault will be — instead of template scaffolds with placeholders."
- Options:
  - `Yes — I'll paste links / upload files` — "Walk me through it"
  - `Yes — point me at a folder on disk` — "I have local files"
  - `No — use just the answers above` — "Build with what we have"
  - `Skip` — "Skip this step"

**If the user picks a "Yes" option** (or pastes content directly):

1. Collect everything they share. Be greedy — accept anything they offer.
2. **For each link**: call `WebFetch` (or `WebSearch` if the URL is a search). Extract the relevant content.
3. **For each uploaded file or local file path**:
   - `.md`, `.txt`, `.json`, `.yaml`, `.csv` → read directly with `Read`
   - `.pdf` → read with `Read` (use `pages` parameter if >10 pages)
   - `.docx`, `.pptx`, `.xlsx` → use Bash with `pandoc` or `textutil` if available; otherwise tell the user to export as PDF or MD and re-share
   - Images / screenshots → read with `Read` (multimodal)
4. **For a local folder path**: use `Glob` to enumerate, then read each file.
5. **Maintain a context corpus** in working memory — every fact, name, number, quote you find. Tag each by likely target (`me.md`, `brand.md`, `icp.md`, `strategy.md`, `projects/{name}`, etc.).
6. After ingestion, briefly tell the user what you pulled (e.g., "Pulled 4 files: brand-guidelines.pdf, about-page.md, okrs-2026.md, team-roster.csv. 18 links fetched."). One sentence. Then proceed to Build.

**If the user picks `No` or `Skip`**: proceed straight to Build with only the Q1–Q12 answers from Phase B.

---

## Phase B Build: Personalize the Vault

After Q12 + the additional-context drop (or skips), build everything you can from what the user gave you. Work silently — don't narrate each step.

### CRITICAL: real personalization, not template scaffolds

The reference files in `references/` are **scaffolds** — they show the section structure to use. They are **not** the output. Do not copy a template verbatim with placeholders intact.

For every file you write:

1. **Read the reference template** to learn the section structure (headings, frontmatter shape, section order).
2. **Replace every placeholder** (anything in `[brackets]` or marked as TBD) with real data extracted from the 12 Phase B answers + the Phase B+ corpus.
3. **If a section has zero supporting data** after exhausting both Q answers and the corpus: **omit the entire section** rather than writing `[name]` or `TBD`. The output should never contain bracketed placeholders.
4. **If only some bullets in a section have data**: keep the section, drop the empty bullets.
5. **Use the user's actual words, names, numbers, URLs, and quotes** wherever the corpus contains them. Don't paraphrase facts — preserve specificity (exact company names, exact dollar figures, exact dates, exact phrases the user uses).
6. **Cross-reference**: a single fact may belong in multiple files (e.g., "we sell to RevOps leaders at Series B SaaS" belongs in both `icp.md` and `brand.md` positioning). Place it in each file where it's relevant.
7. **Frontmatter `updated:`** = today's date.

A finished context file should read as a real human-written document about the user. If it reads like a fillable form, you did it wrong — go back and fill it.

### Build Step 1: Create Context Files

Behavior depends on selected mode.

For every file below, source data from BOTH the Q answers AND the Phase B+ corpus (uploaded files, fetched links, folder reads). The corpus typically contains the depth — Q answers are anchors.

**Solopreneurs/Professionals mode** (Q1–Q12 = solo brain-dump categories):

- **`Context/me.md`** — Always created. Fill from Q1 (name, role, location, peer-intro line, attributes, working style) + Q2 (origin / POV / wedge / enemy) + Q12 (drains, unclosed loops) + corpus. Read `references/context-me.md` as scaffold.
- **`Context/business.md`** — Only if Q3 had content. Fill from Q3 (revenue lines: name, what it does, who it's for, stage, baseline, origin) + corpus (About page, business overview docs). Read `references/context-business.md` as scaffold.
- **`Context/services.md`** — Only if Q3 lists multiple revenue lines or corpus has product/service docs. Read `references/context-services.md` as scaffold.
- **`Context/pain-points.md`** — Only if Q4 named problems or Q2 surfaced one. Include awareness column (aware vs needs education) using Q4's awareness signal. Read `references/context-pain-points.md` as scaffold.
- **`Context/icp.md`** — Only if Q5 had content or corpus has ICP material. Fill role, day, language, dream outcome, trigger, decision time, media, examples. Read `references/context-icp.md` as scaffold.
- **`Context/brand.md`** — Only if Q6 (voice), Q7 (positioning), or Q4 (why-pick-you) had content, or corpus has brand material. From Q4 take value prop + why-pick-you. From Q6 take voice descriptors, signature phrases, words-to-avoid, feeling, colors/fonts. From Q7 take enemy, differentiation, key messages. Read `references/context-brand.md` as scaffold.
- **`Context/strategy.md`** — Only if Q8 had content. Fill priorities, why, and explicit nos. Read `references/context-strategy.md` as scaffold.
- **`Context/team.md`** — Only if Q10 had content (people / collaborators) or corpus has a team / contractor list. Read `references/context-team.md` as scaffold.
- **`Context/infrastructure.md`** — Only if Q11 (stack) or Q12 (workflows) had content, or corpus has a stack doc. Combine tool stack (Q11) + workflows-to-automate (Q12). Read `references/context-infrastructure.md` as scaffold.

**Business mode** (Q1–Q12 = business brain-dump categories):

- **`Context/operator.md`** — Always created. Fill from Q1 (name, title, reports-to, decision authority, working style, drains) + corpus. Read `references/context-operator.md` as scaffold.
- **`Context/organization.md`** — Always created. Fill from Q2 (legal name, industry, stage, founded year, headcount, HQ, mission, origin, POV) + corpus (About page, company deck). Read `references/context-organization.md` as scaffold.
- **`Context/market.md`** — Only if Q3 had content or corpus has market / industry material. Fill industry, niche, trends, what's broken, last 5–10y shifts, main players. Read `references/context-market.md` as scaffold.
- **`Context/services.md`** — Only if Q4 had content. Fill revenue lines from Q4 + corpus (sales deck, product pages). Read `references/context-services.md` as scaffold.
- **`Context/pain-points.md`** — Only if Q5 surfaced problems or corpus has them. Include awareness signal from Q5. Read `references/context-pain-points.md` as scaffold.
- **`Context/icp.md`** — Only if Q6 had content or corpus has ICP material. Fill role, day, language, dream outcome, trigger, decision time, market trends, media, examples. Read `references/context-icp.md` as scaffold.
- **`Context/brand.md`** — Only if Q7 (voice) or Q8 (positioning) had content or corpus has brand material. From Q7 take tagline, voice descriptors, signature phrases, words-to-avoid, topics, colors/fonts, feeling. From Q8 take enemy, differentiation, personality adjectives, big concept, key messages. Read `references/context-brand.md` as scaffold.
- **`Context/team.md`** — Always created. Fill from Q9 (departments + leads, team members) + corpus (org chart). Read `references/context-team.md` as scaffold.
- **`Context/strategy.md`** — Always created. Fill from Q10 (objectives, KRs, owners, why, explicit nos) + corpus (OKR doc). Read `references/context-strategy-business.md` as scaffold.
- **`Context/infrastructure.md`** — Only if Q12 listed tools or workflows, or corpus has a stack / SOPs doc. Combine tool stack + sources of truth + workflows-to-automate from Q12. Read `references/context-infrastructure.md` as scaffold.
- **`Context/stakeholders.md`** — Only if Q12 mentioned external stakeholders or corpus has investor / partner / client lists. Read `references/context-stakeholders.md` as scaffold.

### Build Step 2: Create Project Folders

Solo: from Q9 (active projects). Business: from Q11 (active projects / initiatives). Plus any project briefs / Notion exports / project lists in the corpus. Intelligently structure each project based on what the user gave you.

**Analyze the info and decide the right structure:**
- Simple mention ("working on a podcast") → just a `README.md`
- Moderate detail (scope, deadlines, people) → `README.md` + relevant subdirs
- Rich info (briefs, specs, research, multiple workstreams) → full structure with subdirs and files

**Create subdirectories only when the content justifies them:**

| Content type | Goes to |
|---|---|
| Overview, status, deadlines, contacts | `README.md` |
| Research, competitor analysis, references | `research/{topic}.md` |
| Specs, requirements, briefs | `specs/{name}.md` or `briefs/{name}.md` |
| Drafts, scripts, written content | `drafts/{name}.md` |
| Ideas, brainstorms | `ideas/{name}.md` |
| Notes, working docs | `notes/{name}.md` |

**README.md is always the index:**
```markdown
---
type: project
status: active
owner: [name]
business: [business unit if applicable]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
## Overview
[What this project is]

## Current Status
[Where things stand]

## Key Resources
[Links, tools, contacts]

## Next Steps
[What needs to happen]
```

Don't create empty subdirs. Don't cram everything into the README. Distribute content into the right files based on what it actually is.

**Business mode only** — from Q9 + corpus, also create `Departments/{name}/README.md` for each department with the lead's name, charter placeholder, and `sops/` subfolder.

### Build Step 3: Profile-First Team Scaffolding (Business mode only)

From Q9 + corpus (org chart, team roster), scaffold each person's profile workspace. Slug names are kebab-case.

`{org-slug}` is derived from Q2 (company name → kebab-case). If no company name given, default to `team`.

For each FT employee:
```bash
mkdir -p Team/{org-slug}/Profiles/{person-slug}/Daily
mkdir -p Team/{org-slug}/Profiles/{person-slug}/task-list
mkdir -p Team/{org-slug}/Profiles/{person-slug}/sub-schedules
```
Then write:
- Read `references/team-profile-template.md` → write to `./Team/{org-slug}/Profiles/{person-slug}/{Person Name}.md`. Fill frontmatter and sections from Q9 (name, role, reports-to, FT, location) + corpus.
- Read `references/team-tasks-template.md` → write to `./Team/{org-slug}/Profiles/{person-slug}/task-list/Tasks.md`.

For each contractor / advisor:
```bash
mkdir -p Team/External/contractors/{person-slug}
```
Then write the same `team-profile-template.md` (with `employment: contractor` or `advisor`) → `./Team/External/contractors/{person-slug}/{Person Name}.md`.

If Q9 + corpus list no team members, don't scaffold anything under `Team/{org-slug}/Profiles/`. Leave `Team/` with just the `CLAUDE.md` routing index.

### Build Step 4: Mode-specific Additional Setup

**Business mode only:**
- If Q12 or corpus mentioned org-wide processes / SOPs, capture them in `Intelligence/processes/{name}.md`
- If user provided onboarding docs in the corpus, route them to `Onboarding/{name}.md`

### Build Step 5: Create First Daily Note

Create `Daily/YYYY-MM-DD.md` (today's date):
```markdown
---
type: daily-note
date: YYYY-MM-DD
---
# YYYY-MM-DD

## Session
- **Focus**: Initial vault setup and onboarding
- **Completed**: Full vault bootstrap + personalized onboarding
- **Next Steps**: [based on what was discussed]
```

### Build Step 6: Confirm Completion

Tell the user:
- Quick summary of what was created (which context files, how many projects, any departments, any team profiles)
- "Open this folder in Obsidian to see your vault"
- "You can add more context anytime — just tell me and I'll update the right files."
- Suggest a next action based on what they told you

## Guidelines

- Phase 0 is one question — mode selection
- Phase A is fully automated — no user input needed
- Phase B is **12 categories** (Oskar's structure), batched into **3 rich-HTML forms** rendered via `mcp__visualize__show_widget` (Cowork-only). Each form has 4 stacked categories with title, bullet inspiration, and a single free-text textarea per category. It's a guided **brain dump**, not a Q&A box. The bullets are inspiration, not strict asks. Always recommend Whisper / dictation + pasting docs / links / file paths into the textarea
- No follow-ups, no drilling deeper between forms
- Phase B+ is one final AskUserQuestion (or visualize widget) inviting any leftover files / links / folders — always ask, even if Forms 1–3 looked rich
- Accept any format: typed brain dumps, Whisper transcripts, pasted docs, uploaded files, links (LinkedIn, websites, blog posts, Notion, Drive), local folder paths, or skips
- For every link the user pastes, fetch it (`WebFetch` / `WebSearch`); for every file or folder, read it (`Read` / `Glob`); merge into a single context corpus before building
- **Templates are scaffolds, not outputs.** Replace every `[bracketed placeholder]` with real user data. If a section has no data after exhausting Q answers + corpus, omit the section — never leave placeholders in the written file
- Preserve specificity: use the user's exact names, numbers, URLs, and phrasing
- Only create context files that have real content — don't create empty placeholder files
- Don't narrate every file you're creating — just build it and summarize at the end
