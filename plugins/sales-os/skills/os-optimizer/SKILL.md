---
name: os-optimizer
description: "Framework-driven audit and optimizer for any markdown vault. Applies 9 frameworks (F1 Anthropic CLAUDE.md, F2 Karpathy Wiki, F3 Caveman, F4 Chroma Context Rot, F5 Anthropic Memory, F6 Progressive Disclosure, G7 Hygiene, F8 Reflection / Anthropic Dreams, F9 Architecture & Discoverability). F9 walks the actual co-worker-Claude discovery chain (root CLAUDE.md → routing → folder Plot.md → file), audits routing-table truthfulness against folder reality, generates/refreshes per-folder Plot.md indexes, detects navigation orphans, proposes architectural reorganizations grounded in the user's Context/. Every finding ships a concrete fix — nothing is flag-only, nothing is fix-later; user picks apply-now (walk per item) or save-to-plan per finding. Creates visible per-stage tasks via TaskCreate so the user watches the run unfold. TRIGGERS: os optimizer, optimize vault, vault audit, second brain audit, clean up vault, framework audit, discoverability check, architecture audit, reorg vault. Run from vault root."
---

# Vault Optimizer

Apply 9 frameworks to every markdown file in the vault. For each framework, read its pass-implementation file, run every check, log findings, walk the user through fixes per item, apply (or save to a plan). Save one comprehensive HTML report grouped by framework. **Do not inline the HTML in chat — only the saved path and a one-paragraph summary.**

## Operating philosophy — read carefully, this is what makes this skill different

1. **Every finding ships a concrete fix.** No flag-only. No "warn and forget." No manual-review pile. When the user runs apply-mode, every finding becomes either an applied edit, a saved migration step in a dated reorg plan, or (only if the user explicitly declines this finding in walk) a recorded decline. Nothing lingers as an open warning across runs.
2. **Severity is informational, not gating.** `fail` / `warn` / `info` describes how load-bearing the issue is; it does *not* gate whether a fix is offered. Every check produces fixes.
3. **Walk per item, user picks the target.** Bulk-apply is reserved for purely mechanical fixes (em dashes, duplicate H1). Anything semantic — wikilink repointing, merges, routing rewrites, Plot.md generation, reorganizations — is walk-only with the user confirming the destination/winner/wording per item.
4. **Two modes for every fix:** *apply now* (executes in this run) or *save to plan* (writes the change as a checklist step into `Intelligence/decisions/{date}-reorg.md` for staged execution). User picks per finding for high-blast-radius items. Smaller fixes default to apply-now.
5. **Visible progress, never silent.** Step 0.5 creates one TaskCreate entry per stage and per framework; tasks update `in_progress` → `completed` as the run unfolds. The user watches the audit walk through the vault rather than waiting for one big report at the end.
6. **Read and reason, don't just match.** Every framework's triggers surface candidates; every finding requires the agent to read context, judge alignment with the user's stated world, and produce reasoning specific to the case. No paraphrased rule restatements as "reasoning."
7. **Discover structure, never assume folder names.** Vaults vary. One user's curated layer is `Context/`; another's is `About/`, `Me/`, frontmatter on root, or scattered across topic folders. The optimizer runs Step 1.5 (role discovery) before any framework, and every framework references **roles** (context-equivalent, decisions-equivalent, daily-equivalent, folder-index convention…) discovered from content — never hardcoded names. If a role is missing, it surfaces as a finding with a proposed fix ("you have no decisions-equivalent folder; here's a recommendation"), not as a silent assumption. Static path references in pass files are always abstractions; the agent resolves them through the role registry at run time.

## Frameworks

| # | Framework | Reference (the *why*) | Pass file (the *how*) | Applies to |
|---|---|---|---|---|
| F1 | Anthropic CLAUDE.md | `references/anthropic-claude-md.md` | `references/passes-anthropic-claude-md.md` | every `CLAUDE.md` |
| F2 | Karpathy LLM Wiki | `references/karpathy-llm-wiki.md` | `references/passes-karpathy-wiki.md` | wiki content notes |
| F3 | Caveman compression | `references/caveman-compression.md` | `references/passes-caveman.md` | instruction-layer files |
| F4 | Chroma context rot | `references/chroma-context-rot.md` | `references/passes-chroma-context-rot.md` | every `.md` |
| F5 | Anthropic Memory | `references/anthropic-managed-memory.md` | `references/passes-anthropic-memory.md` | every `.md` |
| F6 | Progressive Disclosure | `references/progressive-disclosure.md` | `references/passes-progressive-disclosure.md` | every `SKILL.md` |
| G7 | General Hygiene | (project rules + practitioner notes) | `references/passes-general-hygiene.md` | every `.md` |
| F8 | Reflection (Anthropic Dreams) | `references/anthropic-dreams.md` | `references/passes-reflection.md` | curated layer (`Context/`, `Projects/`, `Intelligence/decisions/`, `Resources/`); reads recent `Daily/` + `Intelligence/meetings/` as evidence |
| F9 | Architecture & Discoverability | `references/anthropic-architecture.md` | `references/passes-architecture.md` | whole vault — root CLAUDE.md, routing, every folder's `Plot.md`, the navigation chain end-to-end |

When running a check, **read the pass-implementation file** and follow its regex / heuristic / finding format exactly. Don't paraphrase. Cite the framework reference in every finding.

## Flow

1. **Verify the cwd looks like a vault** — light check (Step 0)
2. **Create the visible task list** — TaskCreate one task per stage + framework (Step 0.5)
3. **Discover & classify every `.md` file** — only technical skips (Step 1)
4. **Iterate frameworks F1 → F9**, applying each framework's lens with agent judgment; F8 = cross-vault synthesis, F9 = whole-vault structural reasoning + discoverability walk (Step 2)
5. **Aggregate findings + write the architectural read paragraph** (Steps 3 and 3.5)
6. **Walk every finding through apply-now / save-to-plan** — no skip option for fixes; every finding becomes an applied edit, a saved migration step, or an explicit per-item user decline (Step 4)
7. **Apply approved fixes** (Step 5)
8. **Render HTML dashboard, save, open in browser, emit as artifact** (Step 6)

---

## Step 0 — Verify the cwd looks like a vault

Don't require any specific folder layout. Check (any one is sufficient):

```bash
test -f CLAUDE.md || test -f claude.md
[ "$(find . -maxdepth 4 -name 'CLAUDE.md' | head -1)" ]
[ "$(find . -maxdepth 1 -name '*.md' | wc -l)" -gt 0 ]
```

If none are true → stop:

> This doesn't look like a markdown vault — no `.md` files or `CLAUDE.md` found. `cd` into your vault root and re-run.

Otherwise tell the user one line:

> Auditing your vault against 9 frameworks. First I'll discover your structure (Step 1.5) — I won't assume folder names. Then I walk every fix with you. You'll see each stage as a task.

Proceed into Step 0.5.

---

## Step 0.5 — Create the visible task list (TaskCreate)

This is mandatory. People running this skill on their second brain need to see what's happening — silent is unacceptable for a long-running vault audit.

Create one task per stage + one task per framework, in order. Use TaskCreate with explicit short titles. The user watches them tick through.

```
[ ] Discover & classify .md files (Step 1)
[ ] Role discovery — semantic folder/file classification, no hardcoded names (Step 1.5)
[ ] F1 Anthropic CLAUDE.md — read CLAUDE.md files, judge candidates
[ ] F2 Karpathy Wiki — wikilinks, orphans, schema
[ ] F3 Caveman — compression of instruction-layer files
[ ] F4 Chroma Context Rot — length, distractors, position
[ ] F5 Anthropic Memory — file size, naming, indexes
[ ] F6 Progressive Disclosure — SKILL.md layering
[ ] G7 General Hygiene — em dashes, frontmatter, H1 rules
[ ] F8 Reflection — cluster + judge cross-file synthesis
[ ] F9 Architecture — routing truth, Plot.md presence, discoverability walk
[ ] Aggregate findings + architectural read (Steps 3 / 3.5)
[ ] Walk every finding through apply / save-to-plan (Step 4)
[ ] Apply approved fixes (Step 5)
[ ] Render dashboard + open (Step 6)
```

Mark `in_progress` when entering a stage; `completed` when leaving it. For long frameworks (F2, F8, F9) emit a sub-update mid-run via TaskUpdate or a single chat line so the user knows progress.

Skipping the task list to "save time" defeats the purpose of this skill. The visible task list is non-optional.

---

## Step 1 — Discover & classify every `.md` file

### 1.1 — Universal glob (every file audited)

```bash
find . -name '*.md' \
  -not -path '*/.git/*' \
  -not -path '*/.obsidian/*' \
  -not -path '*/.trash/*' \
  -not -path '*/.claude/worktrees/*' \
  -not -path '*/node_modules/*' \
  -not -path '*/dist/*' \
  -not -path '*/build/*'
```

**No role-based skips.** No "templates skipped", no "Daily skipped", no "Onboarding skipped". Every `.md` outside the technical skip list above gets audited against every framework rule that applies to its role. Classification routes the right rules to the right files; classification does NOT exclude files.

### 1.2 — Classify each file by role (first match wins) — **hints only**

The patterns below are *hints* that bias the role registry built in Step 1.5. They're not authoritative — Step 1.5 reads sample content to confirm role assignments. A file matching `\d{4}-\d{2}-\d{2}\.md` outside any daily-shaped folder will not be classified `daily` if Step 1.5 finds no daily role; it'll be a regular note.

For backwards compatibility with vaults that *do* use the conventional names, the patterns still apply; for vaults that don't, Step 1.5 takes over.

| Role | Detection |
|---|---|
| `root-claude` | `./CLAUDE.md` or `./claude.md` (cwd root only) |
| `folder-claude` | any other `CLAUDE.md` / `claude.md` in subfolders |
| `claude-rules` | files inside `.claude/rules/` |
| `skill` | `SKILL.md` files (anywhere) |
| `index` | `index.md` (case-insensitive) |
| `readme` | `README.md` (case-insensitive) |
| `daily` | matches `\d{4}-\d{2}-\d{2}\.md` inside any `Daily/` |
| `meeting` | inside `*meetings*/` or filename matches `\d{4}-\d{2}-\d{2} - .+\.md` outside `Daily/` |
| `transcript` | inside `*transcripts*/` or files >100KB |
| `decision` | inside `*decisions*/` |
| `template` | inside `*templates*/` or filename ends `-template.md` |
| `context` | inside any `Context/` (case-insensitive) |
| `note` | everything else |

Build the classification map:

```json
{
  "root_claude": "./CLAUDE.md",
  "folder_claudes": [...],
  "claude_rules": [...],
  "skills": [...],
  "indexes": [...],
  "readmes": [...],
  "dailies": [...],
  "meetings": [...],
  "transcripts": [...],
  "decisions": [...],
  "templates": [...],
  "context_files": [...],
  "notes": [...],
  "by_folder": {...},
  "stats": {"total_files": N, "total_bytes": B, "folders": F}
}
```

### 1.3 — Build supporting indexes (used by F2/F4)

| Index | Built from | Used by |
|---|---|---|
| `vault_filename_index` | every `.md` basename, lowercased, with and without extension | F2.2, F2.4 |
| `inbound_link_index` | grep across vault for `\[\[name(\||\]|#)` | F2.3, F2.4 |
| `routing_table` | root CLAUDE.md routing/knowledge-routing section | F2.6 |
| `top_level_entries` | `find . -maxdepth 1` | F2.6 |
| `headers_index` | per-file H2/H3 list with line numbers + byte sizes | F3.6, F5.2 |
| `protected_zones_map` | per-file map of code/URL/path/frontmatter/wikilink spans | F3.x, G7.1 |

### 1.4 — Show classification summary in chat (one block, before any framework runs)

```markdown
## 📋 Discovery — {N} markdown files across {F} folders, {B-formatted} total

| Role | Count |
|---|---:|
| Root CLAUDE.md | 1 |
| Folder CLAUDE.mds | {n} |
| Skills (SKILL.md) | {n} |
| .claude/rules | {n} |
| Indexes / READMEs | {n} |
| Context files | {n} |
| Notes | {n} |
| Dailies | {n} |
| Meetings | {n} |
| Transcripts | {n} |
| Decisions | {n} |
| Templates | {n} |

**Framework targets (every file in scope is audited):**
- F1 Anthropic CLAUDE.md → {n} CLAUDE.md files
- F2 Karpathy Wiki → {n} content notes (notes + context + decision + meeting + index + readme) + 1 schema doc check
- F3 Caveman → {n} instruction-layer files (CLAUDE.md + SKILL.md + .claude/rules + skill references)
- F4 Chroma Context Rot → {N} files (every `.md`)
- F5 Anthropic Memory → {N} files (every `.md`)
- F6 Progressive Disclosure → {n} skills
- G7 General Hygiene → {N} files
- F8 Reflection → {n} files in discovered curated-layer roles + {n} files in discovered session-layer roles ({window} window) for cross-vault synthesis
- F9 Architecture → routing table ({n} entries), {n} folders for index presence + freshness against the discovered convention, full navigation graph for discoverability, vault-specific orientation built from the discovered identity-layer

Running role discovery (Step 1.5) now…
```

---

## Step 1.5 — Role discovery (semantic, not name-based)

**This step replaces every hardcoded assumption about folder/file names.** The pass files reference *roles* (`context`, `projects`, `decisions`, `daily`, `meetings`, `transcripts`, `resources`, `skills`, `archive`, `identity`, `folder_index_convention`). Step 1.5 discovers what folder/file in *this* vault plays each role — or records that the role is absent.

### 1.5.1 — How discovery works

For each abstract role, the agent does the following — in order — until something resolves:

1. **Read folder names + Plot/README/index/CLAUDE files at the top level**, then top-2-deep. Build a candidate list: which folders look like they could play this role based on name + their own description?
2. **Read 3–5 sample files per candidate folder.** Does the content match the role's purpose?
3. **Score and pick.** Highest-confidence candidate wins. If no candidate clears medium confidence → role is `missing`.

The agent does **not** privilege a specific folder name. `Context/`, `About/`, `Me/`, `Personal/`, `Identity/`, or a frontmatter section on root CLAUDE.md can all play the `identity` role. The agent decides by reading.

### 1.5.2 — Standard roles (patterns the agent recognizes)

These are *patterns*, not an exhaustive taxonomy. Every folder/file gets classified — these standard roles match the common shapes; anything that doesn't match becomes a **custom role** (Step 1.5.3).

| Standard role | Default layer | What it is | How to recognize it |
|---|---|---|---|
| `identity` | curated | Files describing the user/operator (who they are, what they do, voice, preferences) | First-person bio content; mentions of role/title; voice or style guidelines |
| `context` | curated | Folder(s) holding canonical knowledge about the user's world (business, strategy, brand, team, stakeholders) — broader than identity | Declarative present-tense facts about the operating environment; named entities (company, products, key people) |
| `projects` | curated | Active or recent work units | Folder names matching projects mentioned in identity/context; per-folder index describing scope, status, deadlines |
| `decisions` | curated | Persistent decision records | Files with date prefixes containing decision language ("decided", "chose", "going with") |
| `daily` | session | Per-day journals or logs | Filenames matching `YYYY-MM-DD\.md`; folder organized by date hierarchy |
| `meetings` | session | Meeting notes | Filenames with date + person/topic; content with attendee lists, action items |
| `transcripts` | session | Raw call/voice transcripts | >100KB files with monologue/dialogue formatting |
| `resources` | curated | Reference library (prompts, frameworks, swipe files, templates) | Reusable assets, not project-specific; often nested by category |
| `skills` | curated | Skill / SOP / playbook content the user owns | `SKILL.md` files, or markdown describing repeatable processes/playbooks |
| `archive` | archive | Intentionally deactivated content | Folder named archive/old/deprecated/_archive, or files marked archived in frontmatter |
| `folder_index_convention` | (meta) | The user's chosen per-folder index file name | Most-frequent filename across folders that functions as an index (`Plot.md`, `README.md`, `index.md`, `_index.md`, `CLAUDE.md`, etc.) |

### 1.5.3 — Custom roles (every other folder)

After standard-role discovery, **every remaining top-level folder and every meaningful subfolder must be classified**, not ignored. For each unclassified folder:

1. **Read the folder's index file** (under the discovered convention) if present.
2. **Sample 3–5 files** in the folder. Read first 1500 chars + headers.
3. **Read the parent folder's index** (if any) to see how this folder is described upstream.
4. **Assign a custom role:**
   - `name` — a slug derived from the folder name plus content (e.g., `Building/` with prototype-build content → role name `building`; `Garden/` with idea-incubation content → `garden`).
   - `layer` — one of `curated` (canonical, durable), `session` (ephemeral, time-stamped), `archive` (deactivated), `meta` (tooling, system files), `unknown` (agent could not confidently classify).
   - `purpose` — 1-line description of what the folder holds.
   - `is_standard: false`.
   - `confidence: high | medium | low`.

If the agent cannot confidently assign a layer (confidence low) → emit an F9.0 finding asking the user to clarify the folder's purpose during walk. The answer persists in the registry going forward.

**Custom roles are first-class.** F8, F9, and the per-finding fixers operate on roles by *layer*, not by membership in the standard-role list. A custom `building` role with `layer: curated` participates in F8's curated-layer synthesis exactly like the standard `context` role.

### 1.5.4 — Output: the role registry

Build this once, cache for the rest of the run, and persist to `.claude/vault-roles.json` at end of Step 1.5 so future runs start from confirmed assignments instead of re-prompting:

```json
{
  "vault_root": "./",
  "discovered_at": "2026-05-08T14:23:00Z",
  "folder_index_convention": {
    "name": "README.md",
    "confidence": "high",
    "evidence": "23 of 31 non-trivial folders have README.md",
    "coverage": 0.74
  },
  "roles": [
    {"name": "identity",  "path": "./About/me.md", "kind": "file",   "layer": "curated", "is_standard": true,  "confidence": "high",   "purpose": "Operator bio + voice"},
    {"name": "context",   "path": "./Knowledge/",  "kind": "folder", "layer": "curated", "is_standard": true,  "confidence": "high",   "purpose": "Org/strategy/brand canonical knowledge"},
    {"name": "projects",  "path": "./Work/",       "kind": "folder", "layer": "curated", "is_standard": true,  "confidence": "high",   "purpose": "Active and recent work units"},
    {"name": "daily",     "path": "./Journal/",    "kind": "folder", "layer": "session", "is_standard": true,  "confidence": "medium", "purpose": "Per-day journal entries"},
    {"name": "resources", "path": "./Library/",    "kind": "folder", "layer": "curated", "is_standard": true,  "confidence": "high",   "purpose": "Prompts, frameworks, templates"},
    {"name": "archive",   "path": "./_archive/",   "kind": "folder", "layer": "archive", "is_standard": true,  "confidence": "high",   "purpose": "Deactivated content"},
    {"name": "building",  "path": "./Building/",   "kind": "folder", "layer": "curated", "is_standard": false, "confidence": "high",   "purpose": "Active prototype builds and experiments"},
    {"name": "garden",    "path": "./Garden/",     "kind": "folder", "layer": "curated", "is_standard": false, "confidence": "medium", "purpose": "Long-form essays in slow incubation"},
    {"name": "inbox",     "path": "./Inbox/",      "kind": "folder", "layer": "session", "is_standard": false, "confidence": "high",   "purpose": "Unprocessed capture; aged out into Garden or Resources"}
  ],
  "missing_standard_roles": ["decisions", "meetings", "transcripts"],
  "low_confidence_roles": ["garden"],
  "unconfirmed_custom_roles": []
}
```

### 1.5.5 — Show the discovery summary in chat (one block)

Frame this as "here's the structure I see in your vault" — not "here's what's missing from a checklist." The user's structure is the source of truth; the BenAI standard taxonomy is just one of the lenses the agent uses to recognize patterns.

```markdown
## 🔍 Your vault structure — {N_folders} folders classified

| Folder | Role | Layer | Purpose | Confidence |
|---|---|---|---|---|
| ./About/me.md | identity | curated | Operator bio + voice | high |
| ./Knowledge/ | context | curated | Org/strategy/brand | high |
| ./Work/ | projects | curated | Active and recent work | high |
| ./Journal/ | daily | session | Per-day journal | medium |
| ./Library/ | resources | curated | Prompts, frameworks, templates | high |
| ./_archive/ | archive | archive | Deactivated content | high |
| ./Building/ | building (custom) | curated | Active prototype builds | high |
| ./Garden/ | garden (custom) | curated | Long-form essays in slow incubation | medium |
| ./Inbox/ | inbox (custom) | session | Unprocessed capture | high |

**Folder-index convention I detected:** README.md (74% coverage)

I'll audit this structure as it stands. F9.0 may suggest specific structural improvements where I see concrete evidence they'd help your vault (not just because BenAI uses them) — you'll review each suggestion in walk. Confirmed assignments persist to `.claude/vault-roles.json`.

Running F1 now…
```

The summary frames *what the user has* first. F9.0 findings about gaps appear later in the walk, with reasoning grounded in observed problems — not as a deficiency table at discovery time.

### 1.5.6 — Hard rules for downstream frameworks

- **Frameworks reference roles by *layer*, not by name.** F8's curated layer = every role with `layer == 'curated'` (standard or custom). F8's session layer = every role with `layer == 'session'`. F9 walks every folder regardless of role membership.
- **Custom roles participate in every framework that operates on their layer.** If `building` is `layer: curated`, F8 looks at `Building/` for merge candidates, contradictions, themes, and promotions exactly like `Context/`.
- **Missing roles never block a framework.** If `decisions` is missing, F8 proceeds without it; F9.0 produces a finding suggesting the user create one (or assign the role to an existing custom folder).
- **The folder-index convention is what F9.2 enforces** — not Plot.md by default. If the user's vault uses README.md, F9.2 generates/refreshes README.md. If no convention exists, F9.0 proposes adopting one.
- **Persisted registry is read at the start of Step 1.5.** If `.claude/vault-roles.json` exists from a prior run, the agent loads it as the baseline and only re-classifies *new* folders or folders the user flagged for re-review. Confirmed assignments don't re-prompt every run.
- **No framework hardcodes folder paths or file names.** Examples in pass files are illustrative; runtime resolves through the registry.

---

## Step 2 — Iterate frameworks F1 → F9 with judgment

**This is not a regex pass.** For each framework, read its pass-implementation file, then apply every check it defines to the files in that framework's scope. Triggers in the pass files surface candidates; the agent reads context and judges each candidate before producing a finding. Every finding includes `reasoning` specific to the case.

Why: a regex match on `\bjust\b` flags "just run X" (where "just" is doing real work — contrasting with running multiple) the same as "It's just a quick check" (where it's filler). Only an agent reading the line in context can tell which is which. The same applies to "be careful" (sometimes a closing reminder, sometimes a vague platitude), `IMPORTANT:` (sometimes earned, sometimes inflation), `voice.md` + `brand.md` (sometimes overlapping, sometimes intentionally separated), and most other framework signals.

### 2.1 — For each framework F1, F2, F3, F4, F5, F6, G7, F8, F9 (in this order)

F8 runs second-to-last (cross-file synthesis). F9 runs **last** because it consumes the structural picture F1–G7 produced and operates on the largest blast radius (whole-vault structural reasoning, Plot.md generation, reorg proposals). Running them last keeps fix application ordered smallest-to-largest in Step 5.

**Update the TaskCreate task** for the current framework to `in_progress` before starting it; `completed` when its findings are logged. Mid-framework sub-updates allowed for long runs (F2, F8, F9).

For each framework:

1. **Read the pass-implementation file** for that framework (e.g., `references/passes-anthropic-claude-md.md` for F1). Cache it for the duration of the framework run.
2. **Determine the file scope** from the table at the top of this SKILL.md (e.g., F1 = every CLAUDE.md; F6 = every SKILL.md; F4/F5/G7 = every `.md`).
3. **For each check in the pass file**:
   - Apply the **trigger heuristic** (regex / metric / structural pattern) to surface candidates fast. Some checks have no trigger — the file itself is the candidate.
   - For each candidate, **read the surrounding 5–15 lines** with the `Read` tool, then apply the **agent-judgment criteria** the pass file lists. Read other files (linked targets, sibling clusters, the file's index) when judgment requires it.
   - Decide: does this case actually violate the framework rule **in this file's specific context**? Or is it a false positive (the pass file lists common ones to skip)?
   - If real → produce a finding. If not → drop it; the trigger was a candidate, not a verdict.
   - **Every finding includes a `reasoning` field** (1–2 sentences specific to this case, not a generic restatement of the rule).
4. **Run the framework's vault-wide checks** (using indexes from Step 1.3): orphan detection, dead wikilinks, distractor pairs, schema compliance, etc. — see each pass file's "vault-wide" sections.
5. **Emit one progress line** when the framework completes:

   > F1 Anthropic CLAUDE.md — read 14 CLAUDE.md files, judged 312 candidates → 22 findings (5 fail · 17 warn)

   The `judged` count vs `findings` count is a sanity check: if they're roughly equal, the run was lazy (regex candidates became findings without judgment); if `judged` ≫ `findings`, judgment is filtering false positives — that's the intended behavior.

### 2.2 — Reasoning sanity gate (per framework)

After completing each framework's run, sample 5 random findings (or all findings if < 5). Read each one's `reasoning` field. If > 40% of sampled reasonings are paraphrases of the rule rather than case-specific judgment ("This file uses too many em dashes" — paraphrase; "These em dashes appear in callout headers where the writer was substituting for colons; replacing with colons preserves the cadence" — judgment), **stop and re-run that framework with deeper reads**.

This is a hard gate. The skill's value is judgment, not regex. Shipping a framework's findings without enforcing this gate is a bug.

### 2.3 — Finding schema (every framework, every path)

```json
{
  "framework": "F1",
  "check_id": "F1.2",
  "check_name": "Specificity heuristic",
  "path": "./Projects/foo/CLAUDE.md",
  "line": 42,
  "severity": "warn",
  "excerpt": "Be careful with auth",
  "reasoning": "This rule sits in the top half of a CLAUDE.md that's otherwise a routing index — there's no specific auth boundary, file path, or function named anywhere else. As a primary rule it falls into the 35%-compliance bucket; either anchor it to a specific path/function or remove it.",
  "action": "Either delete or rewrite as 'All /api/admin/* routes must call requireAdmin() from src/auth/middleware.ts'.",
  "fixable": false,
  "fixed": false,
  "citation": "anthropic-claude-md.md → Specificity beats vagueness"
}
```

The `reasoning` field is mandatory. Every finding has it.

**Every finding ships a fix.** The pass file always emits `fixable: true`. Old `fixable: false` "manual review" findings are gone — checks that historically went flag-only (F1.x, F4.x, F5.x) now ship walk-only fix proposals like every other framework.

The `fix_status` field is set by **Step 5** after the user walks each finding. Possible values:
- `applied` → fix executed this run (green FIXED pill)
- `saved_to_plan` → fix written into `Intelligence/decisions/{date}-reorg.md` for staged execution (blue SAVED pill)
- `declined` → user explicitly chose not to fix this item in walk (grey DECLINED pill)
- `failed` → fix attempted but failed safety check (red FAILED pill, with `failure_reason`)

There is no "skipped" or "deferred" state. Either the fix was applied, saved as a planned step, declined explicitly per-item, or failed mechanically. Open warnings do not survive the run.

---

## Step 3 — Aggregate findings + compute score

For each framework F1–F8, count: total findings, severity breakdown (fail/warn/info), fixable count, files touched.

### Score formula (framework-weighted)

```
For each framework F1..G7:
  deduction = (fail_count × 5) + (warn_count × 1)
  capped_deduction = min(deduction, 25)
score = max(0, 100 - sum(capped_deduction for F1..G7))
```

**F8 and F9 do not affect the score.** F8 surfaces synthesis opportunities; F9 surfaces structural/discoverability changes. Both are optimization opportunities, not lint failures — counting them would conflate "vault hygiene" with "vault could be reorganized." Track F8 in an "Insights surfaced / applied" tile and F9 in an "Architecture changes / proposed / applied / saved-to-plan" tile.

| Score | Interpretation |
|---|---|
| 90–100 | Well-tuned. Run audit monthly. |
| 70–89 | Visible drift. Address top findings. |
| 50–69 | Bloat is hurting performance. |
| <50 | Vault rot. Major cleanup needed. |

After scoring, **do not render a long markdown summary in chat**. Emit one short block:

```
✅ All 9 frameworks applied.

| Framework | Files | Checks | Findings | Fail | Warn | Fixes proposed |
|---|---:|---:|---:|---:|---:|---:|
| F1 Anthropic CLAUDE.md | … | … | … | … | … | … |
| F2 Karpathy Wiki | … | … | … | … | … | … |
| F3 Caveman | … | … | … | … | … | … |
| F4 Chroma Context Rot | … | … | … | … | … | … |
| F5 Anthropic Memory | … | … | … | … | … | … |
| F6 Progressive Disclosure | … | … | … | … | … | … |
| G7 Hygiene | … | … | … | … | … | … |
| F8 Reflection | … | … | … | … | … | … |
| F9 Architecture | … | … | … | … | … | … |
| **TOTAL** | … | … | … | … | … | … |

Score: {score_before}/100 (F8 + F9 not scored). Walking the architectural read next…
```

---

## Step 3.5 — Architectural read (the synthesis paragraph)

Before walking fixes, write a short architectural read of the vault — top 1–3 things wrong with the structure as a whole, with reasoning grounded in `Context/`. This is the layer the user explicitly asked for: the agent demonstrating it understood what the vault means, not just what it failed.

Format:

```markdown
### Architectural read

{1–3 short paragraphs. Each paragraph: one structural observation, why it matters for *this* user's world (cite Context/), the F9 finding(s) that surfaced it, the proposed direction.}
```

This paragraph also goes verbatim into the HTML dashboard (above the framework rows) so it's the first thing the user sees when they open the report. Keep it under 250 words total — synthesis, not a recap of findings.

If the agent cannot identify a structural observation worth surfacing (the vault is well-organized): write one sentence saying so, citing the F9 metrics that justify the assessment. Don't pad.

---

## Step 4 — Walk every finding through apply-now / save-to-plan

**Every finding ships a fix proposal.** Step 4 walks the user through them. There is no "skip this framework," no "flag only," no "fix later." Each finding ends in one of four explicit states: `applied`, `saved_to_plan`, `declined`, or `failed`.

### 4.1 — One opening AskUserQuestion (the apply gate)

Before walking, fire one `AskUserQuestion`:

> "Audit complete: {N_total} findings across 9 frameworks ({fail} fail · {warn} warn · {info} info). Every finding has a proposed fix. Pick mode:"

Options:
1. **Bulk-apply (apply everything, no escapes)** — every finding gets applied. Walk prompts only fire where the agent genuinely needs the user to pick a target/wording (e.g., "merge target: A or B?"). All else applies without per-item confirmation. The only valid non-applied state is `failed` (mechanical: OS lock, file conflict, dependency missing). No `saved_to_plan`, no `declined`. Use this when you've said "apply everything."
2. **Selective walk** — fire a per-finding prompt for every fix; user picks apply / save-to-plan / decline per item. Use when reviewing carefully or for a first run on a new vault.
3. **Save everything to plan** — write all proposed fixes as checklist steps into the discovered decisions-equivalent folder; no edits applied this run.
4. **Cancel** — abort before any fixes.

Option 1 is the default. The user picks 2 only when they want item-by-item gating. **The user's prior instruction "apply everything" maps to Option 1, not Option 2.**

### 4.1.1 — Bulk-apply mode rules (Option 1)

Hard rules when this mode is active:

- **No `saved_to_plan` outcomes.** That state is removed from the available `fix_status` set.
- **No `declined` outcomes.** Same.
- **The agent does not unilaterally decide a finding is "test fixture," "the user probably didn't want this," "too complex to apply mechanically," or "judgment-required-per-section" and route it to anything other than applied/failed.** If applying a fix mechanically would damage content, the agent attempts the safest mechanical version (e.g., split a 222KB file at H2 boundaries with a `<!-- automated split, review headings -->` marker; mark the split as `applied` with `applied_with_caveat: true`).
- **Walk prompts fire only when the agent genuinely cannot pick a target without the user.** Example: F8.2 merge with three plausible canonical targets — fire the prompt. Example: G7.1 em-dash substitution — apply without prompting; the agent's per-occurrence reasoning already chose the substitution.
- **Mechanical failures are still recorded as `failed`** with `failure_reason` (OS-locked file, missing parent directory, file conflict, framework-safety check rolled back the fix). Failed fixes are reported in the dashboard with their reason — they're not silently skipped.
- **The agent must not pre-classify findings as "skip in bulk-apply mode."** Every finding is in scope. If applying a daystar/ test-fixture fix damages a deliberate test pattern, the user can revert that file specifically — but the agent doesn't make that call.

### 4.2 — Per-finding walk loop

Order: F1 → F2 → F3 → F4 → F5 → F6 → G7 → F8 → F9. Within F8/F9, smallest blast radius first (per pass file).

For each finding:

1. **Show the finding compactly** in chat: path, severity, 1-line excerpt, the proposed fix's `proposed_edit` or migration step.
2. **Fire AskUserQuestion** with the per-finding-type sub-prompt:

| Finding type | Sub-prompt options |
|---|---|
| **Mechanical** (G7.1 em dashes, G7.3/F1.10 duplicate H1) | Apply now / Decline this item / Apply all remaining of this type without asking |
| **Wikilink repoint** (F2.2) | Apply with target [X] / Pick a different target / Decline |
| **Cross-ref add** (F2.4) | Apply / Edit linked-file list / Decline |
| **Caveman substitution** (F3.1–F3.4 per file) | Apply all in this file / Walk substitutions in this file / Decline this file |
| **Skill-vault dedup** (F6.11) | Apply / Decline |
| **CLAUDE.md edit** (F1.x) | Apply drafted edit / Edit text first then apply / Save to plan / Decline |
| **Memory split / rename** (F5.1, F5.3) | Apply with proposed split-points or filename / Edit then apply / Save to plan / Decline |
| **Context-rot reorg** (F4.3, F4.4, F4.6, F4.7) | Apply drafted reorder / Edit text / Save to plan / Decline |
| **Reflection — contradiction** (F8.1) | Winner: [A] / [B] / [neither — defer to a third source] → Apply rewrite to loser / Edit text / Decline |
| **Reflection — merge** (F8.2) | Canonical: [A] / [B] / [C] → Confirm merge + redirect + archive / Save to plan / Decline |
| **Reflection — stale** (F8.3) | Apply rewrite / Edit text / Decline |
| **Reflection — theme** (F8.4) | Create at [proposed path] / Pick a different path / Edit content first / Decline |
| **Reflection — promotion** (F8.5) | Destination: [proposed] / [pick other] → Apply append + leave wikilink stub / Decline |
| **Routing rewrite** (F9.1) | Apply drafted entry / Edit text / Decline |
| **Plot.md generation** (F9.2) | Apply drafted Plot.md / Edit Purpose line + descriptions first / Decline |
| **Discoverability fix** (F9.3) | Add to Plot.md / Add routing entry / Move file / Archive / Decline |
| **Misplaced file** (F9.4) | Move to [proposed folder] / Pick different folder / Broaden current folder's Plot.md instead / Decline |
| **Folder duplication** (F9.5) | Merge into [A] / Merge into [B] / Clarify Plot.md purposes on both / Save to plan / Decline |
| **Reorg proposal** (F9.6) | Apply now (walk migration steps) / Save to plan (write to {date}-reorg.md) / Decline |
| **Orientation gap** (F9.7) | Apply drafted CLAUDE.md edit / Edit text first / Save to plan / Decline |

Every option reaches a terminal state for this finding. **There is no "skip" option that leaves the finding open.** "Decline" is recorded as an explicit user decision and shown in the report — it's a decision, not a deferral.

3. **Update the finding's `fix_status`** (`applied` / `saved_to_plan` / `declined`) and any `per_item_target` chosen by the user.
4. **TaskUpdate** the current framework's task with a `{i}/{N}` progress note every 10 findings.

### 4.3 — Save-to-plan file format

Save-to-plan path resolution (uses the role registry):
1. If `roles.decisions.path` is set → save under `{decisions.path}/{YYYY-MM-DD}-reorg.md`.
2. Else if any folder matches `*decisions*/`, `*logs*/`, `*records*/` (case-insensitive) → use that.
3. Else create `audits/` at vault root and save there. Note the missing decisions role to F9.0 — the user gets a fix proposal to formalize a decisions-equivalent folder.

When findings are routed to save-to-plan, append checklist entries to the resolved path:

```markdown
---
status: pending
type: reorg-plan
tags: [optimizer, plan]
date: 2026-05-08
source: os-optimizer run 2026-05-08T14:23:00Z
---

# Vault reorg plan — 2026-05-08

Generated by os-optimizer. Each item is a fix proposal saved for staged execution. Walk them when ready.

## F9.6 Reorg proposals

- [ ] **Merge `Notes/` into `Resources/notes/`** — F9.5 finding cluster: both folders hold scratch with 38% file-name overlap. Migration:
  - Move 12 files from `Notes/` to `Resources/notes/`.
  - Redirect 4 inbound wikilinks.
  - Update root CLAUDE.md routing entry to remove `Notes/`.
  - Delete empty `Notes/` directory.
  - Reasoning: `Resources/notes/` Plot.md states it holds reference notes; `Notes/` Plot.md states the same. Per `Context/me.md`, the user's stated convention is one resource library — keeping two is structural drift.

## F8.2 Merge candidates

- [ ] **Merge `Notes/2026-q1-strategy.md` and `Projects/positioning/research/strategy-thoughts.md` into `Context/strategy.md`** — F8.2 finding. Steps: …

(continues per saved finding)
```

The plan file is itself audited next run — F1/G7 conventions apply.

### 4.4 — Failure to walk

If the agent skips a finding (forgets to fire its sub-prompt, batches multiple findings into one prompt, or treats "no answer" as decline) — that's a bug. Walk every finding individually. The visible task list catches this: if a framework's task moves to `completed` while findings remain unwalked, the verification step in 5.7 will flag it.

---

## Step 5 — Apply approved fixes (set `fix_status` per finding)

Apply in this order (smallest blast radius first). For every finding, set `fix_status` to `applied`, `saved_to_plan`, `declined`, or `failed` based on what happened in Step 4 + this step. The HTML render uses `fix_status` directly.

**Save-to-plan items** are written to `Intelligence/decisions/{date}-reorg.md` in Step 4.3 — this step (5) only handles the items the user picked "apply now" for. (In Bulk-apply mode there are no save-to-plan items.)

### 5.0 — Capture BEFORE metrics (mandatory, before any fix lands)

Before applying any fix, snapshot per-role and per-framework metrics into the `before_metrics` cache. These are what the dashboard's before/after columns render against.

Per-role metrics (one row per role in the registry, plus a TOTAL row):
- `file_count`
- `total_chars` (sum of body bytes, post-frontmatter)
- `total_tokens_est` (chars / 4)
- `em_dash_count` (G7.1 trigger output)
- `frontmatter_complete_pct` (files with `status:` + ≥2 `tags:` / total)
- `wikilink_orphan_count` (no inbound wikilink)
- `index_coverage_pct` (folders with the discovered folder-index file / non-trivial folder count)
- `findings_open` (count of findings touching files in this role)

Per-framework metrics (F1–F9 + TOTAL):
- `findings_count`
- `fail_count`, `warn_count`, `info_count`
- `applied_count` (starts at 0)
- `failed_count` (starts at 0)
- `score_contribution` (per the Step 3 formula; F8/F9 always 0)

Cache these. Apply fixes (5.1–5.8). Then run 5.9.

### 5.1 — Em dashes (G7.1)
- For each `applied` finding: replace `—` → `. `, `–` → `, ` in stripped body only.
- Re-strip protected zones after; if any code/URL/wikilink was touched → revert that file's change AND set `fix_status: failed` with `failure_reason`.
- Use `Edit` with `replace_all: true` per file.
- Set `fix_status: applied` on every G7.1 finding whose file was successfully fixed.

### 5.2 — Duplicate H1 (G7.3 / F1.10)
- Remove the H1 line and any blank line immediately following.
- Use `Edit`. Set `fix_status: applied`.

### 5.3 — Wikilink fixes (F2.2)
- For each finding the user approved (bulk = top-1 suggestion, walk = chosen target): replace `[[Old Target]]` with the picked replacement.
- Preserve surrounding text byte-for-byte.
- Mark `fixed: true` per finding fixed; `fixed: false` for any skipped or low-confidence ones the user said no to.

### 5.4 — Skill-vault rewrites (F6.11)
- Update SKILL.md to read the vault `Context/` path instead of the duplicate ref.
- Grep the rest of the skill folder for the duplicate ref filename.
- If still referenced → surface conflict, skip deletion, set `fix_status: failed`.
- Otherwise → `rm` the duplicate, set `fix_status: applied`.

### 5.5 — Caveman substitutions (F3.1, F3.2, F3.3, F3.4) — only if user opted in per file
- Apply substitution table from `references/passes-caveman.md` to the stripped body.
- Re-strip protected zones; if any was modified → abort the fix on that file, report, set `fix_status: failed` for that file's findings.
- Mark `fixed: true` on every F3.x finding for files the agent successfully substituted.

### 5.6 — Reflection fixes (F8.1, F8.3, F8.2, F8.4, F8.5) — walk-only, per-item user-confirmed targets

Apply F8 fixes **last** (largest blast radius). Order within F8 is smallest-to-largest:

1. **F8.1 contradictions** — for each approved finding: rewrite the loser file. Either replace contradicted line with `See [[Winner]] for current state.` (defer mode) or delete the line entirely (drop mode); the user picks per item in Step 4. Use `Edit`. Set `fix_status: applied`.
2. **F8.3 stale entries** — for each approved finding: rewrite the curated entry with the new state. Append `## History` section with the prior wording if it has decision context (per pass file rule). Add wikilink to superseding source. Set `fix_status: applied`.
3. **F8.2 merge candidates** — for each approved cluster:
   - Concatenate unique sections from sources into the canonical target (skip duplicate paragraphs).
   - **Re-check size against F5 budget.** If merged file > 10KB → abort the merge, set `fix_status: failed`, surface as flag-only with the abort reason in `reasoning_post`.
   - Grep the vault for `[[SourceName]]` and `[[SourceName|alias]]` patterns; replace each with `[[CanonicalName|alias]]` (or `[[CanonicalName]]`).
   - Verify zero new dead wikilinks (run F2.2 trigger on every file touched). If any new dead link surfaced → roll back this finding's fix, set `fix_status: failed`.
   - Move source files to `Intelligence/archive/{YYYY-MM-DD}-merged/`. Use `Bash mv`.
   - Set `fix_status: applied`.
4. **F8.4 emergent themes** — for each approved finding:
   - Create the new file at the user-chosen path (default `Context/{theme-slug}.md` or `Resources/{theme-slug}-MOC.md`).
   - Frontmatter must include `status:`, `tags:`, `type:`, `date:` (G7.2 compliance) and contain no em dashes (G7.1).
   - Body: 1-line definition, 3–5 key points, wikilinks back to every source note in the cluster.
   - Set `fix_status: applied`.
5. **F8.5 promotions** — for each approved finding:
   - Append the durable content to the chosen destination (`Context/`, `Resources/`, or `Intelligence/decisions/`).
   - In the source file, replace the original lines with `See [[Target#section]]`.
   - Set `fix_status: applied`.

**Cross-framework safety check after every F8 fix:**
- Re-strip protected zones on every file written. If any code/URL/wikilink/path/frontmatter was modified outside the intended edit → roll back, set `fix_status: failed`.
- If the touched file targets a CLAUDE.md or claude.md → abort (this should have been caught in Step 4 as flag-only, but defense in depth).
- If the touched file's size now exceeds F5's 10KB recommended budget → record the violation in `reasoning_post`; the next audit run will surface it as F5 flag-only (don't roll back, but log).

### 5.7 — Architecture fixes (F9.1, F9.2, F9.3, F9.4, F9.5, F9.6, F9.7) — walk-only, per-item user-confirmed targets

Apply F9 fixes after F8. Order: smallest blast radius first.

1. **F9.1 routing rewrites** — for each `applied` finding: `Edit` the root CLAUDE.md routing table with the user-confirmed line(s). Per-item only; no batch rewrites. This is the single legitimate path for editing a CLAUDE.md (per-item user approval).
2. **F9.2 Plot.md generation / regeneration** — for each `applied` finding:
   - If missing: `Write` the agent-drafted Plot.md (user already confirmed Purpose + child descriptions in walk).
   - If stale: `Edit` to update the Children list; preserve any user edits to Purpose if not deprecated.
   - Verify size ≤ 8KB; verify G7.1 (no em dashes) and G7.2 (frontmatter complete).
3. **F9.3 discoverability fixes** — for each `applied` finding, apply the user-chosen repair:
   - "Add to Plot.md" → `Edit` the parent Plot.md.
   - "Add routing entry" → `Edit` root CLAUDE.md routing.
   - "Move file" → `Bash mv`; redirect inbound wikilinks (same as F8.2 mechanic).
   - "Archive" → `Bash mv` to `Intelligence/archive/`.
4. **F9.4 misplaced files** — `Bash mv` to user-chosen folder. Update source folder's Plot.md (remove child) and target folder's Plot.md (add child). Redirect inbound wikilinks.
5. **F9.5 folder duplication** — for "merge into" findings: walk through file moves one at a time (each is its own `applied` micro-step). For "clarify Plot.md purposes" findings: `Edit` both Plot.mds.
6. **F9.6 reorg proposals** — only here if the user picked "apply now"; save-to-plan ones are already in the dated reorg file. For apply-now: walk each migration step in the proposal as its own micro-finding (move X, rename Y, update routing entry Z), each confirmed individually before execution.
7. **F9.7 orientation gap** — `Edit` root CLAUDE.md with the agent-drafted section the user confirmed. Per-item only.

**Cross-framework safety check after every F9 fix:**
- Re-run F2.2 trigger on every file touched. If new dead wikilinks appeared → roll back that fix, set `fix_status: failed`.
- Re-check root CLAUDE.md size against F1.1 budget after F9.1 / F9.7 edits. Over budget → record in `failure_reason`; the next audit run will flag F1.1.
- Plot.md writes must pass G7.1 + G7.2 + F5 (≤ 8KB) by construction; if any check fails → roll back, `fix_status: failed`.

### 5.8 — Generic per-item fix runner (F1.x, F4.x, F5.x — previously flag-only)

For findings whose checks historically didn't have a specialized fix procedure (most of F1, F4, F5), the runner is generic:

1. Read the file.
2. Apply the agent-drafted `proposed_edit` from the finding (the user already confirmed or edited it in Step 4.2).
3. Re-strip protected zones; if any code/URL/path/frontmatter outside the intended edit was modified → roll back, `fix_status: failed`.
4. If the file is a CLAUDE.md → only proceed if `applied` came through walk-with-explicit-confirmation (Step 4.2). Never bulk-apply CLAUDE.md edits via this runner.
5. Set `fix_status: applied` on success.

This runner handles, e.g.:
- F1.2 vague rule rewrite or deletion
- F1.5 platitude deletion
- F1.7 reorder for position effect
- F4.3 critical-info reorder
- F4.4 lead-in preamble removal
- F5.1 file split (split file at agent-suggested headers; user confirmed split-points in walk)
- F5.3 filename rename via `Bash mv` + inbound wikilink redirect

The fix sub-procedure can vary per finding type — what stays constant is: read → apply confirmed edit → safety check → status. The pass file's per-check guidance still constrains what the agent drafts.

### 5.9 — Capture AFTER metrics (mandatory, after every fix)

After Step 5.1–5.8 finish, re-measure the same metrics captured in 5.0. This is the source of truth for the dashboard's AFTER columns and the recomputed score. Skipping this step is the bug that produced the 46/100 BEFORE-only render — never skip it.

Re-measure:
- Per-role metrics (re-run the same probes from 5.0 — files may have been split, em dashes stripped, frontmatter added).
- Per-framework metrics (recount findings against the *current* vault state — many findings should now resolve to zero because their underlying issue was fixed).
- **Recompute the score** using the formula in Step 3, against the re-measured findings count. This is `{{SCORE_AFTER}}`. Do not reuse the BEFORE score.
- Compute deltas: `tokens_saved_per_role`, `em_dashes_removed`, `frontmatter_pct_delta`, `findings_resolved_per_framework`.

If the re-measurement shows a finding category whose count *increased* (e.g., a fix accidentally added new orphans), surface that as a regression-warning row in the dashboard — the fix succeeded mechanically but produced a downstream issue.

The re-measurement should take seconds, not minutes — same probes as Step 1 + the framework triggers, but only on files touched by Step 5 plus the small global counts (em dashes vault-wide, frontmatter coverage). Cache for Step 6.

### 5.10 — Verify fix-status totals add up

After applying:
- `total_applied` = findings with `fix_status: applied`.
- `total_saved_to_plan` = findings with `fix_status: saved_to_plan`.
- `total_declined` = findings with `fix_status: declined`.
- `total_failed` = findings with `fix_status: failed`.

These four should equal `total_findings`. **No `null` or unset `fix_status` is permitted** — every finding hit Step 4 and was walked. If any finding has unset `fix_status` after Step 5, the orchestrator skipped a walk; halt and surface the bug to the user before rendering. (HTML still renders correctly from per-finding flags but the skipped finding signals a Step 4.4 bug.)

### Failure handling
If any fix fails (file missing, edit conflict, ambiguous match, protected-zone violation) → stop, report which item failed, ask the user how to proceed. Never silently skip a failure.

### Always preserve
- Files in technical skip list (`.git`, `.obsidian`, `.trash`, `node_modules`, `dist`, `build`).
- Code fences, inline code, URLs, file paths, frontmatter keys, wikilinks, table delimiters, headings, dates, version numbers.

---

## Step 6 — Render, save, open, and surface the HTML

### 6.1 — Compute per-framework metrics

Snapshot before/after per framework:

| Variable | Source |
|---|---|
| `{{F1_FILES}}`, `{{F1_CHECKS}}`, `{{F1_FINDINGS_BEFORE}}`, `{{F1_FINDINGS_AFTER}}`, `{{F1_FAIL_BEFORE}}`, `{{F1_FAIL_AFTER}}`, `{{F1_WARN_BEFORE}}`, `{{F1_WARN_AFTER}}`, `{{F1_INFO_BEFORE}}`, `{{F1_INFO_AFTER}}`, `{{F1_APPLIED}}`, `{{F1_FAILED}}`, `{{F1_DETAILS}}` | F1 bucket — every count has a before/after pair so the dashboard can show the delta |
| same for F2, F3, F4, F5, F6, G7, F8, F9 | each bucket |
| `{{ARCHITECTURAL_READ}}` | Step 3.5 paragraph, rendered above the framework rows |
| `{{F8_INSIGHTS_SURFACED}}`, `{{F8_INSIGHTS_APPLIED}}` | F8-only — drives the "Insights surfaced / applied" tile |
| `{{F9_PROPOSALS}}`, `{{F9_APPLIED}}`, `{{F9_FAILED}}` | F9-only — drives the "Architecture changes" tile (in bulk-apply mode there's no Saved/Declined column) |
| `{{ROLE_METRICS_TABLE}}` | per-role before/after table (Step 6.1.5) |
| `{{FRAMEWORK_METRICS_TABLE}}` | per-framework before/after table (Step 6.1.5) |
| `{{REORG_PLAN_PATH}}` | path to the saved reorg plan if any saved-to-plan items exist (selective walk only); empty in bulk-apply mode |
| `{{TOTAL_FIXABLE}}` | count of all findings with `fixable: true` |
| `{{TOTAL_FIXED}}` | count of all findings with `fixed: true` |
| `{{TOTAL_FIXABLE_NOT_FIXED}}` | count of findings with `fixable: true && fixed: false` (skipped/denied) |
| `{{TOTAL_BEFORE}}`, `{{TOTAL_AFTER}}`, `{{TOTAL_SAVED}}`, `{{TOTAL_PCT}}` | sum across all frameworks |
| `{{SCORE_BEFORE}}`, `{{SCORE_AFTER}}`, `{{SCORE_DELTA}}`, `{{SCORE_DELTA_SIGN}}` | scoring formula before & after |
| `{{SESSION_BEFORE}}`, `{{SESSION_AFTER}}`, `{{SESSION_PCT}}` | root CLAUDE.md token count before & after |
| `{{ANNUAL_SAVINGS}}` | `{{TOTAL_SAVED}} × SESSIONS_PER_WEEK × WEEKS_PER_YEAR`, K/M suffix |
| `{{SESSIONS_PER_WEEK}}` (default 50) | user override if specified |
| `{{WEEKS_PER_YEAR}}` (default 50) | — |
| `{{FILES_SCANNED}}`, `{{FOLDERS_COVERED}}` | from Step 1 |
| `{{ORG_NAME}}` | `Context/business.md` or `Context/organization.md` title or `name:` frontmatter; fallback cwd folder name |
| `{{DATE}}`, `{{TIMESTAMP}}` | today (YYYY-MM-DD) and ISO UTC |

For each framework's `{{Fx_DETAILS}}`: render the findings list as HTML (severity pills, paths, excerpts, actions, framework citation). Cap at top-25 findings per framework — if more, append "and N more flagged in {decisions-folder}/{date}-vault-audit-findings.json".

Format integers with thousands separators. Format percentages to one decimal.

### 6.1.5 — Per-role and per-framework before/after tables

These two tables are the dashboard's headline evidence that the run changed the vault, not just described it. Render both above the framework detail sections (between the architectural read and the framework rows).

**Per-role table** (`{{ROLE_METRICS_TABLE}}`) — one row per role in the registry plus a TOTAL row:

| Role | Files | Tokens before → after | Em dashes before → after | Frontmatter complete before → after | Index coverage before → after | Findings open before → after |
|---|---:|---:|---:|---:|---:|---:|
| identity | 6 | 4,200 → 4,150 (-50) | 12 → 0 (-12) | 17% → 100% (+83pp) | — | 6 → 0 |
| context | 10 | 12,400 → 11,890 (-510) | 23 → 0 (-23) | 80% → 100% (+20pp) | 100% → 100% | 5 → 0 |
| projects | 14 | 8,200 → 8,200 (0) | 0 → 0 | 71% → 100% (+29pp) | 0% → 100% (+100pp) | 4 → 0 |
| daily | 241 | 145,000 → 145,000 (0) | 18 → 0 | 95% → 100% | — | 18 → 0 |
| meetings | 611 | 412,000 → 412,000 | 89 → 0 | 92% → 100% | — | 89 → 0 |
| (etc.) | | | | | | |
| **TOTAL** | 1,710 | 2.1M → 1.9M (-200K) | 289 → 0 | 67% → 100% | 12% → 100% | 502 → 12 |

Style each delta cell with green for improvements, red for regressions, gray for unchanged. Em dash + frontmatter columns drop "before → after" when both are 0.

**Per-framework table** (`{{FRAMEWORK_METRICS_TABLE}}`) — one row per framework F1–F9 plus TOTAL:

| Framework | Findings before → after | Fail before → after | Warn before → after | Info before → after | Applied | Failed |
|---|---:|---:|---:|---:|---:|---:|
| F1 Anthropic CLAUDE.md | 9 → 0 | 2 → 0 | 6 → 0 | 1 → 0 | 9 | 0 |
| F2 Karpathy Wiki | 4 → 0 | 1 → 0 | 2 → 0 | 1 → 0 | 4 | 0 |
| F3 Caveman | 2 → 0 | 1 → 0 | 1 → 0 | 0 → 0 | 2 | 0 |
| F4 Chroma | 1 → 0 | 0 → 0 | 1 → 0 | 0 → 0 | 1 | 0 |
| F5 Memory | 3 → 1 | 2 → 0 | 1 → 1 | 0 → 0 | 2 | 1 |
| F6 Progressive Disclosure | 3 → 0 | 1 → 0 | 2 → 0 | 0 → 0 | 3 | 0 |
| G7 Hygiene | 3 → 0 | 1 → 0 | 1 → 0 | 1 → 0 | 3 | 0 |
| F8 Reflection | 4 → 0 | 1 → 0 | 2 → 0 | 1 → 0 | 4 | 0 |
| F9 Architecture | 5 → 0 | 1 → 0 | 1 → 0 | 3 → 0 | 5 | 0 |
| **TOTAL** | 34 → 1 | 9 → 0 | 17 → 1 | 8 → 0 | 33 | 1 |

Score row, separately, with before → after rendered prominently:

```
Score (F1–G7): 46 → 97 (+51) · "Vault rot" → "Well-tuned"
```

These tables are the difference between "here's what we need to do" (which is what saved-to-plan/declined would have been) and "here's what was done" (which is what bulk-apply mode produces). The dashboard frames the run retrospectively.

### 6.2 — Build the HTML

Templates (read once, substitute many times):

| File | Used as |
|---|---|
| `references/report-template.html` | main shell |
| `references/report-row-template.html` | one row per framework in the summary table |
| `references/report-section-template.html` | one detail section per framework |
| `references/report-finding-template.html` | one card per finding inside a detail section |

Steps:
1. Read all four templates.
2. For each framework F1..F9:
   - Render one row from `report-row-template.html` with the framework's metrics → append to `{{ROWS}}` accumulator.
   - For each finding (cap at top-25 per framework, ranked: fixed first, then fail before warn, then by check ID): render one card from `report-finding-template.html` → append to that section's `{{FINDINGS_HTML}}`. **HTML-escape** `EXCERPT`, `REASONING`, and `ACTION` (`<`, `>`, `&`, `"`). The `REASONING` field is mandatory — if the finding has no reasoning text, the skill is bugged; fail loudly.
   - Compute `{{STATUS_PILL}}` per finding from `fix_status`:
     - `applied` → `<span class="pill fixed">FIXED THIS RUN</span>`
     - `saved_to_plan` → `<span class="pill saved">SAVED TO PLAN</span>` (links to `{{REORG_PLAN_PATH}}`)
     - `declined` → `<span class="pill declined">DECLINED</span>`
     - `failed` → `<span class="pill failed">FAILED</span>` (with `failure_reason` shown inline)
   - If 0 findings: leave `{{FINDINGS_HTML}}` empty and substitute `{{CLEAN_STATE}}` with `<div class="clean">✅ All checks passed. No findings for this framework.</div>`.
   - If total findings > 25: substitute `{{MORE_NOTE}}` with `<p class="more">…and {N} more findings logged in {YYYY-MM-DD}-vault-audit-findings.json.</p>`. Otherwise leave empty.
   - Render the section from `report-section-template.html` → append to `{{DETAILS}}` accumulator.
3. Substitute `{{ROWS}}` and `{{DETAILS}}` in the main template.
4. Substitute every other `{{PLACEHOLDER}}` (header stats, score, session impact, etc.).
5. **Sanity pass:** scan the rendered HTML for any leftover `{{...}}` or `{{ }}`. If any remain → fail loudly, never save a half-rendered file.

The `{{FRAMEWORK_WHY}}` for each section comes from the matching framework reference's "Core thesis" — one short paragraph max. Fixed strings:

- F1: "Anthropic guidance: keep CLAUDE.md the smallest concrete set of instructions that survives the pruning test. Specific rules earn ~89% compliance; vague rules get ~35%."
- F2: "Karpathy's LLM Wiki: knowledge is compiled once and kept current. Lint catches dead links, orphans, contradictions, missing cross-references, and undigested sources."
- F3: "Caveman compression: every token competes for attention. Strip filler, hedging, pleasantries, and verbose connectors from the agent-facing instruction layer."
- F4: "Chroma context rot: every model degrades with length; distractors hurt; position matters. Lead with the load-bearing rule and keep the auto-load budget tight."
- F5: "Anthropic Memory: per-file ≤100KB / ~25K tokens (recommended <10KB). Multiple focused files beat one mega-file. The agent navigates by name."
- F6: "Progressive Disclosure: the context window is a public good. Skill metadata loads always; bodies on relevance; references on demand. Keep references one hop deep."
- G7: "Project rules and practitioner field notes: em-dash discipline, frontmatter compliance, no H1 duplicating filename, README hygiene."
- F8: "Reflection (inspired by Anthropic Dreams): per-file lint cannot see contradictions, duplicates, stale assumptions, or emergent themes. Synthesis across the curated layer plus recent sessions surfaces them — and proposes concrete fixes the user approves per item."
- F9: "Architecture & Discoverability: walk the path co-worker Claude actually takes (root CLAUDE.md → routing → folder Plot.md → file). Verify routing entries match folder reality, every folder has an up-to-date Plot.md, every file is reachable in ≤ 3 hops, and CLAUDE.md actually orients an agent in this user's specific world."

### 6.3 — Save (uses the role registry, not hardcoded paths)

Pick the save folder via the role registry:
1. `roles.decisions.path` is set → save there.
2. Else `roles.archive.path` is set + writable → save there.
3. Else create `audits/` at vault root and save there. Note the missing role to F9.0.

Save HTML to `{decisions-folder}/{YYYY-MM-DD}-vault-audit.html`.
Save the raw findings JSON to `{decisions-folder}/{YYYY-MM-DD}-vault-audit-findings.json` (so users can mine the full list).

Read the HTML back to confirm content present (not just file present). On mismatch → retry once → fail loudly.

### 6.4 — Open + render + summarize (final response, in this order)

**Part 1 — open in browser.** `Bash`: `open "{path}"` (macOS) / `xdg-open` (Linux) / `start` (Windows).

**Part 2 — emit the full saved HTML inside an `html` code fence.** Runtimes with artifact support (claude.ai, Claude Desktop) render it as a side panel; CLI shows it as a code block (browser already opened in Part 1). This is the only place HTML appears in chat — don't dump fragments mid-run, don't paste it twice, don't wrap commentary around it.

**Part 3 — summary (after the HTML, no commentary in between):**

```
✅ Optimizer run complete — here's what changed:
Report: {decisions-folder}/{YYYY-MM-DD}-vault-audit.html
JSON sidecar: {decisions-folder}/{YYYY-MM-DD}-vault-audit-findings.json
Score (F1–G7): {score_before} → {score_after} ({delta_sign}{delta}) — "{interpretation_before}" → "{interpretation_after}"
{N} files audited · {applied_total} fixes applied · {failed_total} mechanical failures (see report for reasons)
Em dashes: {em_before} → {em_after} (-{em_delta}) · Frontmatter coverage: {fm_pct_before} → {fm_pct_after} (+{fm_pct_delta}pp) · Folder-index coverage: {idx_pct_before} → {idx_pct_after} (+{idx_pct_delta}pp)
Tokens saved: {tokens_saved} ({tokens_pct_saved}% reduction in agent-load) · ~{annual_savings} tokens/year saved at {sessions}/week
```

The summary frames the run retrospectively — what *was done*, what *changed*. In bulk-apply mode, "saved-to-plan" and "declined" lines are absent; only `applied` and `failed` exist. In selective-walk mode, append the saved-to-plan and declined counts as additional lines.

Stop. Do not propose follow-up actions.

---

## Rules — what to never do

- **Never** assume a folder or file by name. Always resolve through the role registry built in Step 1.5. `Context/`, `Projects/`, `Daily/`, `Plot.md`, `me.md`, etc. are *examples* in the documentation; the runtime resolves abstract roles to whatever the user actually has.
- **Never** ignore a folder because it doesn't fit a standard role. Every folder is classified — standard or custom — with a layer. Custom roles (`Building/`, `Garden/`, anything user-specific) are first-class participants in every framework that operates on their layer. Skipping them defeats the discovery pass.
- **Never** treat the role registry as ephemeral. Persist confirmed assignments to `.claude/vault-roles.json` at end of Step 1.5 so future runs start from the user's confirmed view of their vault, not from a fresh re-classification that re-prompts everything.
- **Never** propose a structural change purely because BenAI uses that convention. F9.0 tier-2 findings (functional improvements suggesting BenAI conventions) must cite specific evidence in *this* vault that the convention would resolve a real problem. F9.6 reorg proposals must cite the user's own stated folder purposes. "BenAI does X" is not a valid justification anywhere in the optimizer. The BenAI taxonomy is a recognition lens and an optional reference — never a target shape the user must conform to.
- **Never** drop a tier-2 finding when the user has a custom role already serving the function. If `Lab/` (custom curated) is already playing the projects role, no F9.0 tier-2 finding fires for "you should add a projects folder." Function over name.
- **Never** unilaterally decide a finding is "test fixture," "user probably didn't want this," "judgment-required-per-section," or any other agent-invented reason to route a finding to anything other than `applied` / `failed` in bulk-apply mode. The user said apply everything; that means everything. If applying is mechanically dangerous, attempt the safest mechanical version (e.g., split a 222KB file at H2 boundaries with an automated-split marker, mark `applied_with_caveat: true`). The only valid escape is mechanical failure with a recorded `failure_reason`.
- **Never** render the dashboard with the BEFORE score. Step 5.9 is mandatory: re-measure after fixes, recompute score, populate `{{SCORE_AFTER}}` and the per-role/per-framework after columns. A dashboard that shows only BEFORE-state numbers is a bug.
- **Never** frame the final summary as "what we need to do" in bulk-apply mode. The summary is retrospective: what changed, how much, what failed mechanically and why. Save-to-plan / declined / "for later" framings belong only to selective-walk mode.
- **Never** apply a change the user didn't approve via `AskUserQuestion` walk in Step 4.
- **Never** auto-rewrite a CLAUDE.md without per-item user confirmation. F1.x edits, F9.1 routing rewrites, and F9.7 orientation additions are walk-only — the user reviews and confirms each drafted edit before it lands.
- **Never** delete a file before grepping for references.
- **Never** modify files in the technical skip list (`.git`, `.obsidian`, `.trash`, `node_modules`, `dist`, `build`).
- **Never** apply substitutions inside protected zones (code, URLs, paths, frontmatter, wikilinks, headings, table delimiters, dates).
- **Never** skip a file because of its role. The classification routes rules; it never excludes files.
- **Never** skip a framework. F1–F9 all run every audit.
- **Never** leave a finding open. Every finding ends Step 5 with `fix_status` set to `applied`, `saved_to_plan`, `declined`, or `failed`. Unset is a bug.
- **Never** bulk-apply semantic fixes (F2.2 wikilinks, F2.4 cross-refs, F8.x reflection, F9.1–F9.7 architecture). Every semantic fix walks per item with the user confirming target/winner/destination/wording.
- **Never** let F8 or F9 modify a SKILL.md or anything in `.claude/rules/`. F8's scope is the curated layer; F9's scope excludes SKILL.md and `.claude/rules/`.
- **Never** complete an F8.2 merge or F9.5 folder merge without verifying (a) merged file size against F5's per-file budget and (b) zero new dead wikilinks. Failing either rolls back and sets `fix_status: failed`.
- **Never** generate a Plot.md that exceeds 8KB or has em dashes. If a folder's children list would push Plot.md over budget, route to F9.6 reorg proposal (split the folder) instead.
- **Never** delete a merge source. F8.2 / F9.5 archive sources to `Intelligence/archive/{date}-merged/`.
- **Never** score F8 or F9 into the health score. Both surface optimization opportunities, not lint failures; the score covers F1–G7 only.
- **Never** paraphrase a framework rule when surfacing a finding. Read the relevant pass-implementation file when running its checks; cite the framework in the finding. The Step 2.2 sanity gate enforces this.
- **Never** run silently. Step 0.5 creates the visible task list; every framework's task transitions `in_progress` → `completed` as the run unfolds. Skipping the task list defeats the skill.
- **Never** ship a half-rendered template. If any `{{placeholder}}` survives → fail.
- **Never** dump partial HTML mid-run. The full HTML appears once, at the end (Step 6.4 Part 2). Don't paste HTML twice; don't paste partial fragments while findings are being collected.

---

## Why this skill exists

Eight frameworks plus practitioner field notes converge on one conclusion: vaults rot without active maintenance. Karpathy calls it **lint**. Anthropic calls it the **pruning test** + the **memory budget**. Chroma calls it **context rot**. Caveman calls it **token discipline**. Progressive disclosure calls it **layering**. Anthropic Dreams calls it **reflection** — read the curated layer alongside recent sessions and surface what per-file lint can't see. F9 adds **architecture & discoverability**: walk the actual co-worker-Claude path, verify routing matches folder reality, ensure every folder has a current Plot.md, and confirm every file is reachable from the root in ≤ 3 hops. The audit encodes every auditable signal as a discrete check, applies them all on every run, walks every finding through apply-now / save-to-plan / declined, and saves a categorized HTML dashboard with the agent's architectural read at the top.

Run weekly while the vault is growing. Monthly once stable. Each run appends a dated dashboard so the user can watch the score climb.

For the deep rules behind each pass, read the relevant `references/{framework}.md` and `references/passes-{framework}.md`. Each is complete on its own — TOC, full rules, exact regex, finding format, source URLs.
