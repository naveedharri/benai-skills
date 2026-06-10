---
name: skill-os-builder
description: Stand up a self-contained second-brain "OS" that lives entirely inside a Claude skill — a short SKILL.md router plus context files, no vault, cloud, or MCP server. Use when the user says "set up a skill OS", "build my second brain as a skill", "skill OS", or wants the simplest portable AI OS.
---

# Skill OS Builder

You help the user create a **Skill OS**: their entire second brain packaged as one
Claude skill. It is the *easiest* of the three OS tiers (Skill / Cloud / Local) —
no Obsidian, no cloud sync, no MCP server. The skill's `SKILL.md` is the router;
the `context/` files are the brain.

Read `references/structure-spec.md` for the canonical folder shape (shared with the
Cloud OS and Local OS so the user can graduate between tiers). Read
`references/routing-patterns.md` before writing the generated router.

## Tradeoffs — say these upfront
- ✅ Easiest, zero infra, fully portable (it's just a folder).
- ✅ Claude reads it natively; no setup beyond dropping it in `~/.claude/skills/`.
- ❌ Single-user, no live multiplayer, no realtime sync across devices.
- ❌ Grows in one folder — great for personal use, not a team vault.

## Build flow
1. **Explain** the tradeoffs above; confirm Skill OS is the right tier.
2. **Interview** (keep it short):
   - Name / what to call the OS
   - Their role + voice/preferences (for `about-me.md`)
   - What they want to track — pick from: projects, notes/intelligence, people,
     systems/routines. Only include what they need.
3. **Scaffold** the OS folder from `templates/`:
   - `SKILL.md` ← `templates/_SKILL.md.tmpl` (short router: CLAUDE.md-style rules
     + routing table — NO long content)
   - `context/*.md` ← the templates they chose
   - **Frontmatter must be valid YAML.** Keep `description` on ONE line wrapped in
     double quotes (`description: "…"`). Never leave it as an unquoted multi-line
     scalar — colons (`Trigger phrases:`) and inner quotes break the YAML and the
     skill is rejected on upload. Don't put `"` inside the quoted description; use
     plain words for trigger phrases.
4. **Confirm the layout** — DON'T skip this. Show the user the full tree you just
   created (the folder, `SKILL.md`, and every `context/` file) and ask:
   *"Does this layout look right, or do you want to add / rename / remove anything
   — another context file, a sub-folder, etc.?"* Apply whatever they ask, and keep
   the `SKILL.md` routing table in sync with the final file list before moving on.
5. **Populate the content** — DON'T ship empty or placeholder files. Ask the user
   in ONE go to **dump everything they have at once** — *"Upload any files or just
   paste all your context here — projects, notes, people, routines, whatever you've
   got. Don't worry about organizing it; I'll sort it into the right files."*
   Then YOU split that material across the context files by topic (projects →
   `projects.md`, people → `people.md`, etc.). Don't make them go file by file.
   After sorting, show what landed where and ask if anything's miscategorized or
   missing. If a file ends up with nothing, leave a one-line note of what it's for
   rather than fake filler.
6. **Package as a zip** (so they can upload it anywhere — Cowork, Claude
   Desktop, the API). Zip the **contents** of the OS folder so `SKILL.md` sits at
   the **root of the zip** — never wrap it in an extra folder. Run from *inside*
   the generated folder:
   ```bash
   cd <name> && zip -rX "../<name>.zip" . -x '.*' '*/.*'
   ```
   Then verify before handing it over:
   - `unzip -l <name>.zip` — the listing MUST show `SKILL.md` at the top level
     (e.g. `SKILL.md`, `context/...`), NOT `<name>/SKILL.md`.
   - Frontmatter parses as YAML:
     `unzip -p <name>.zip SKILL.md | sed -n '/^---$/,/^---$/p' | python3 -c 'import sys,yaml; yaml.safe_load(sys.stdin.read().strip().strip("-"))'`
     — it must exit cleanly with no error.
   Hand them the path to `<name>.zip`.
7. **Place + test**: tell them to put it in `~/.claude/skills/<name>/`, restart,
   and ask Claude something that should route to a context file. (Or just upload
   the zip into Cowork and start using it there.)
8. **Graduating later**: the same `context/` shape moves straight into a Cloud OS
   or Local OS — point them to `cloud-os-builder` when they need sync.

## Rules
- Keep the generated `SKILL.md` SHORT — behavior + routing table only. Content
  lives in `context/`.
- Don't create context files the user didn't ask for.
- One topic per context file; tell them to split a file when it gets long.
- **Always confirm the layout and gather real content before zipping.** Never hand
  over a skill of empty template files — the scaffold is step 1, the user's actual
  projects/people/notes are the point. Ask for content; don't assume.
- **Zip format = Cowork-ready.** `SKILL.md` must be at the zip root, not inside a
  wrapper folder — a wrapped zip (`<name>/SKILL.md`) is the Console format and
  Cowork rejects it as malformed. Always zip from *inside* the folder (`cd <name>
  && zip -rX ../<name>.zip .`), exclude dotfiles (`-x '.*' '*/.*'`), and confirm
  with `unzip -l` before delivering.
