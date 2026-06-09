# Cloud OS structure — same shape as the Local OS, minus Obsidian

The Cloud OS builds the **same second-brain structure** as the Local OS — a root
`CLAUDE.md` plus the folder tree (`Context/`, `Projects/`, `Intelligence/`, `Daily/`,
`Resources/`, `Skills/`, and in Business mode `Departments/`, `Team/`, `Onboarding/`),
with a per-folder `CLAUDE.md` routing index in each. This skill is **self-contained**:
it builds that structure from its **own** `references/` templates in Phase A/B — it does
not depend on the `local-os-builder` skill.

## The one difference: no Obsidian layer
The Cloud OS **omits the Obsidian `.obsidian/` layer** (config, plugins, dashboards,
graph). Reasons:
1. It does nothing without Obsidian installed.
2. It is hundreds of tiny files — exactly the part that syncs **badly** on consumer
   cloud (conflict copies, slow sync, settings resets).

Phase A/B never create `.obsidian/` or recommend installing Obsidian plugins. Everything
else is generated verbatim.

## Why the shape is shared
A Cloud OS and a Local OS are the **same brain** — they differ only in *where the folder
lives* (synced cloud dir vs. local disk) and *whether Obsidian is layered on top*. A user
graduates between them by moving the folder, or by opening the same folder in Obsidian
(which adds the `.obsidian/` layer back). The Skill OS is the genuinely leaner tier — it
lives inside a Claude skill with a `SKILL.md` router and a small flat `context/`.
