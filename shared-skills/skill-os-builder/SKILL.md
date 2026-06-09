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
3. **Generate** the OS folder from `templates/`:
   - `SKILL.md` ← `templates/_SKILL.md.tmpl` (short router: CLAUDE.md-style rules
     + routing table — NO long content)
   - `context/*.md` ← the templates they chose
4. **Place + test**: tell them to put it in `~/.claude/skills/<name>/`, restart,
   and ask Claude something that should route to a context file.
5. **Graduating later**: the same `context/` shape moves straight into a Cloud OS
   or Local OS — point them to `cloud-os-builder` when they need sync.

## Rules
- Keep the generated `SKILL.md` SHORT — behavior + routing table only. Content
  lives in `context/`.
- Don't create context files the user didn't ask for.
- One topic per context file; tell them to split a file when it gets long.
