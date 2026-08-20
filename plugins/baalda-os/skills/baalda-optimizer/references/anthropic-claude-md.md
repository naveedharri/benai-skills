# Anthropic — CLAUDE.md best practices

## Contents

1. [Core thesis](#core-thesis)
2. [Hard rules](#hard-rules)
3. [The pruning test](#the-pruning-test)
4. [CLAUDE.md hierarchy and precedence](#claudemd-hierarchy-and-precedence)
5. [The three core building blocks](#the-three-core-building-blocks-every-claudemd-needs)
6. [Specificity beats vagueness — examples](#specificity-beats-vagueness--examples)
7. [Path-scoped rules in `.claude/rules/`](#path-scoped-rules-in-claude-rules)
8. [The `@import` pattern](#the-import-pattern)
9. [`claudeMdExcludes` and managed policy](#claudemd-excludes-and-managed-policy)
10. [Position effect — why ordering matters](#position-effect--why-ordering-matters)
11. [Emphasis markers](#emphasis-markers)
12. [The `MEMORY.md` system](#the-memorymd-system)
13. [Compaction behavior](#compaction-behavior)
14. [HTML comments are stripped](#html-comments-are-stripped)
15. [Dos](#dos)
16. [Don'ts](#donts)
17. [Verbatim quotes worth preserving](#verbatim-quotes-worth-preserving)
18. [Auditable signals](#auditable-signals)
19. [Sources](#sources)

---

## Core thesis

CLAUDE.md is loaded as a **user message at the start of every session** — not as part of the system prompt. Claude reads it and tries to follow it, but there is **no guarantee of strict compliance**, especially for vague or conflicting instructions. The right CLAUDE.md is the smallest concrete set of instructions that survives the pruning test.

Anthropic's framing of context engineering puts it bluntly: *"finding the smallest possible set of high-signal tokens that maximizes the likelihood of some desired outcome."* CLAUDE.md is the same problem applied to your project's instruction layer.

## Hard rules

| # | Rule | Auditable |
|---|---|---|
| 1 | Keep CLAUDE.md under **200 lines** (community ceiling: 300) | ✅ Pass 1 |
| 2 | Specific rules get **89% compliance**; vague rules get **35%** | ✅ Pass 2 (specificity heuristic) |
| 3 | Bloated CLAUDE.md → Claude **ignores instructions entirely** (not just the overflow ones) | ✅ Pass 1 (size) |
| 4 | LLMs prefer instructions at the **start and end** of a prompt; the middle is neglected | ✅ Pass 9 (position heuristic) |
| 5 | Models follow ~150–200 instructions reasonably (Opus 4.5); fewer for smaller models. The Claude Code system prompt alone uses ~50 instructions | ⚠️ Inform-only |
| 6 | Imports via `@path/to/import` resolve relative to the importing file; **max 5 hops** | ✅ Pass 9 |
| 7 | Imports do **not** save tokens — they only organize. Imported content fully loads at launch | ⚠️ Inform-only |
| 8 | `MEMORY.md` loads first **200 lines or 25KB**, whichever first | ⚠️ Inform-only |
| 9 | Block-level HTML comments `<!-- ... -->` are stripped before context injection | — |
| 10 | Project-root CLAUDE.md is **re-injected after `/compact`**. Nested CLAUDE.md is **not** re-injected | — |
| 11 | Two contradicting rules → Claude may pick one **arbitrarily**. Resolve conflicts; don't assume specificity wins | ⚠️ Pass 6 (duplication) |
| 12 | Path-scoped rules in `.claude/rules/` only load when Claude reads matching files (via `paths:` frontmatter) | ✅ Pass 9 |
| 13 | Subdirectory CLAUDE.md is **not auto-loaded at launch** — only when Claude reads files in that directory | ⚠️ Inform-only |

## The pruning test

For every line in CLAUDE.md, ask:

> **"Would removing this cause Claude to make mistakes? If not, cut it."**

Apply ruthlessly. The mistake most teams make is the opposite — they keep adding lines hoping more guidance helps. Beyond ~200 lines, the marginal line **subtracts** signal because Claude's adherence to the whole file degrades.

> *"If Claude keeps doing something you don't want despite having a rule against it, the file is probably too long and the rule is getting lost."*

## CLAUDE.md hierarchy and precedence

All discovered files **concatenate** (do not override). More specific scopes win when conflicts arise. Files walk up the directory tree from the working directory.

| Scope | Path (default) | Shared with | Notes |
|---|---|---|---|
| Managed policy | `/Library/Application Support/ClaudeCode/CLAUDE.md` (macOS) | Org-wide | **Cannot be excluded** even via `claudeMdExcludes` |
| Managed policy | `/etc/claude-code/CLAUDE.md` (Linux/WSL) | Org-wide | Same |
| Managed policy | `C:\Program Files\ClaudeCode\CLAUDE.md` (Windows) | Org-wide | Same |
| Project | `./CLAUDE.md` or `./.claude/CLAUDE.md` | Team via git | The main file most teams maintain |
| User | `~/.claude/CLAUDE.md` | Just you, all projects | Personal preferences (response style, language) |
| Local | `./CLAUDE.local.md` (gitignored) | Just you, this project | Sandbox URLs, personal credentials, machine-local quirks |

### Monorepo behavior

If you run Claude Code in `root/foo/`:
- `root/foo/CLAUDE.md` is loaded (cwd)
- `root/CLAUDE.md` is also loaded (parent walk)
- If Claude reads files in `root/foo/bar/`, then `root/foo/bar/CLAUDE.md` loads on demand

This lets the monorepo root apply rules across all subprojects while each subproject adds its own.

## The three core building blocks every CLAUDE.md needs

Source: camelCase, "Stop Writing Bad CLAUDE.md Files." Backed by Anthropic's specificity guidance.

### 1. One-liner describing the project

A single sentence that gives Claude the framework, language, audience, and domain.

✅ Good:
- *"This is our customer-facing payment portal built with Next.js 15 and Stripe."*
- *"This is a documentation site built with Astro for an open-source CLI."*
- *"This is an Angular-based portfolio site with no backend."*

❌ Bad:
- *"This is a project."*
- (No description at all)

### 2. Key bash commands

The commands Claude can't guess and that get used in **daily** work.

✅ Good:
- `npm run build` — builds the production bundle
- `npm run typecheck` — runs TypeScript checks
- `pytest -k "not integration"` — runs unit tests, skipping integration

❌ Bad:
- Listing every npm script even ones used once a month
- Listing standard commands Claude knows (`git log`, `cd`)

### 3. Caveats — non-obvious project warnings

Things not visible from the code but that will trip Claude up.

✅ Good:
- *"Never modify `schema.prisma` directly — run `npm run db:generate` instead."*
- *"The API webhook expects a raw body — don't use `body-parser` middleware."*
- *"Images in `/public` must be optimized — anything over 200KB fails CI."*
- *"The `legacy/` folder is read-only and scheduled for deletion. Don't add new code there."*

❌ Bad:
- Generic warnings ("be careful with the database")
- Warnings the linter would catch anyway

## Specificity beats vagueness — examples

Specific rules earn ~89% compliance. Vague ones drop to ~35%. Anthropic's documented examples:

| ❌ Vague (low compliance) | ✅ Specific (high compliance) |
|---|---|
| "Format code properly" | "Use 2-space indentation" |
| "Test your changes" | "Run `npm test` before committing" |
| "Keep files organized" | "API handlers live in `src/api/handlers/`" |
| "Write clean code" | (just delete this) |
| "Be careful with auth" | "All `/api/admin/*` routes must call `requireAdmin()` from `src/auth/middleware.ts`" |
| "Document complex code" | "Functions with >3 parameters need a JSDoc block listing each param" |

## Path-scoped rules in `.claude/rules/`

For larger projects, break instructions into topic-specific files in `.claude/rules/`. Each `.md` file covers one topic. Rules are scoped to file paths via YAML frontmatter:

```yaml
---
paths:
  - "src/api/**/*.ts"
  - "src/handlers/**/*.ts"
---

# API Handler Rules

- Always wrap handlers in `withAuth()`.
- Return errors as `{ error: { code, message } }`.
- Use the shared logger from `src/lib/logger.ts`.
```

Files **without** `paths:` frontmatter load unconditionally at launch (acts like a CLAUDE.md). Files **with** `paths:` only load when Claude reads files matching the glob — true progressive disclosure.

This is the right place for code style rules, testing conventions, security patterns. **Move them out of CLAUDE.md.**

## The `@import` pattern

Syntax: `@path/to/file.md` inside a CLAUDE.md.

- Relative paths resolve **relative to the importing file**.
- Maximum recursion depth: **5 hops**. Beyond that the import is dropped.
- Imported content **fully loads** at launch — imports don't save tokens, only organize.

Use case: shared rules across multiple repos.

```markdown
# Project CLAUDE.md

@~/.claude/shared-rules/typescript.md
@~/.claude/shared-rules/security.md

## Project-specific
- ...
```

## `claudeMdExcludes` and managed policy

In `.claude/settings.local.json` you can skip ancestor CLAUDE.md files by glob:

```json
{
  "claudeMdExcludes": [
    "../../legacy-monorepo/**"
  ]
}
```

Useful when you're inside a giant org monorepo and most ancestor CLAUDE.md content is irrelevant noise.

**Managed policy CLAUDE.md cannot be excluded.** Org-wide rules always apply. This is intentional — security/compliance rules can't be disabled by a developer.

## Position effect — why ordering matters

LLMs over-attend to **the start and end** of a prompt and under-attend to **the middle**. This is a structural property of transformer attention, documented in multiple studies.

For CLAUDE.md:
- Put the **most important rules at the top**.
- Put the **building blocks** (project description, commands, caveats) early.
- Put **edge cases and lower-priority guidance** in the middle (or move to `.claude/rules/`).
- The very end is also a high-attention zone — use it for `IMPORTANT` final reminders.

Anthropic's own system reminder is suggestive:

> *"important: This context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task."*

The model is *told* CLAUDE.md content might be irrelevant. Vague or middle-buried rules get treated as background noise. **Specificity and position overcome this.**

## Emphasis markers

Anthropic confirms emphasis markers improve adherence for critical rules:

- `IMPORTANT:`
- `YOU MUST`
- `CRITICAL:`
- ALL CAPS for the rule itself
- Exclamation marks (sparingly)

Reserve these for the rules where failure is genuinely costly. If everything is `IMPORTANT`, nothing is.

## The `MEMORY.md` system

Auto-memory at `~/.claude/projects/<project>/memory/`:

- `MEMORY.md` is the index. **First 200 lines or 25KB** — whichever first — loads at startup.
- Topic files in the same directory load on demand.
- Claude decides what's worth remembering based on future usefulness.
- Memory is machine-local and shared across worktrees of the same git repo.

Treat `MEMORY.md` like CLAUDE.md: prune aggressively, keep entries specific.

## Compaction behavior

When `/compact` runs:

- The **project-root CLAUDE.md is re-injected** automatically. Your rules survive.
- **Nested CLAUDE.md is not re-injected.** If subdirectory rules mattered for the conversation, they're gone after compaction.
- Customize compaction by adding to CLAUDE.md: *"When compacting, always preserve the full list of modified files and any test commands."*

## HTML comments are stripped

Block-level HTML comments are removed from the context injection:

```markdown
<!-- This note is for the human maintainer only.
     Claude never sees it. -->
```

Use this for maintainer notes, audit trail, "why this rule exists" history — without spending tokens. Code-block comments (inside ` ``` ` fences) are **preserved**.

## Dos

- Run `/init` only as a starting point — then prune aggressively. AI-generated CLAUDE.md is verbose by default.
- Treat CLAUDE.md like code: review it when things go wrong, prune regularly, test changes by observing behavior.
- Use markdown headers and bullets to group related instructions for readability.
- Use `IMPORTANT` / `YOU MUST` for the rules where failure is costly.
- Move multi-step procedures into Skills.
- Move path-specific rules into `.claude/rules/` with `paths:` frontmatter.
- Add to CLAUDE.md when Claude makes the same mistake **twice**.
- Place the most important rules at the **top** of the file.
- Schedule monthly audits — CLAUDE.md is a living document, code drifts, rules go stale.
- Use `<!-- HTML comments -->` for maintainer notes that don't spend tokens.
- Use the Anthropic GitHub integration to ask Claude to update CLAUDE.md from PR observations.

## Don'ts

- Don't include code style rules (`use 2 spaces`, `single quotes`). Use linters and formatters with the `post tool use` hook.
- Don't include anything Claude can figure out by reading code.
- Don't include standard language conventions Claude already knows.
- Don't include detailed API documentation — link to the docs instead.
- Don't include information that changes frequently (deploy URLs, current sprint, who's on call).
- Don't include long explanations or tutorials.
- Don't include file-by-file descriptions of the codebase.
- Don't include self-evident practices ("write clean code", "follow best practices", "be careful").
- Don't put a `# Title` heading that duplicates the filename.
- Don't rely on `@imports` to "save tokens" — they don't.
- Don't let CLAUDE.md drift past 200 lines without splitting into Skills, `.claude/rules/`, or imports.
- Don't put generic warnings — be specific about what fails and how.
- Don't write rules that conflict with each other; resolve them or one will be picked arbitrarily.

## Verbatim quotes worth preserving

> *"CLAUDE.md content is delivered as a user message after the system prompt, not as part of the system prompt itself. Claude reads it and tries to follow it, but there's no guarantee of strict compliance, especially for vague or conflicting instructions."*

> *"If Claude keeps doing something you don't want despite having a rule against it, the file is probably too long and the rule is getting lost."*

> *"Treat CLAUDE.md like code: review it when things go wrong, prune it regularly, and test changes by observing whether Claude's behavior actually shifts."*

> *"Treating context as a precious, finite resource will remain central to building reliable, effective agents."*

## Auditable signals

When this skill runs Pass 1 (size check) and Pass 2 (pruning) for CLAUDE.md files, look for:

- **Total line count** per CLAUDE.md (>200 = warn, >300 = fail).
- **Vague rules**: rules that don't include a concrete value, command, file path, or quantifiable threshold. Heuristic: rule contains `properly`, `correctly`, `clean`, `good`, `appropriate` — flag for review.
- **Code-style rules**: detect `\b(use|prefer)\s+\d+\s+(space|tab)`, single-quote rules, formatting opinions. Suggest moving to linter config + `.claude/rules/`.
- **File-by-file descriptions**: long sections describing each file in a folder. Suggest converting to a short routing table or removing.
- **Standard convention restatements**: rules that just repeat what the language enforces (`Use camelCase for JS`, `Use snake_case for Python`).
- **Self-evident platitudes**: `write clean code`, `follow best practices`, `be careful`, `test your changes`. Cut.
- **Generic emphasis**: every rule marked `IMPORTANT`. Suggests no real prioritization. Flag.
- **Top-of-file content**: the first 20 lines should contain the project description, key commands, or critical caveats. If it's preamble or rationale, suggest moving up.
- **Imports**: detect `@imports`. Walk imports up to 5 hops. Flag if depth >5 (will be dropped).
- **Heading duplication**: an `# H1` that matches the filename → cut.
- **Imported content that's never referenced** by the rest of CLAUDE.md → suggest removing.

## Sources

- https://code.claude.com/docs/en/best-practices
- https://code.claude.com/docs/en/memory
- https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- camelCase, "Stop Writing Bad CLAUDE.md Files" (2026-02-04) — practitioner field notes
