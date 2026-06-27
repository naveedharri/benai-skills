# Progressive disclosure — Anthropic skill best practices

## Contents

1. [Core thesis](#core-thesis)
2. [The three-tier loading model](#the-three-tier-loading-model)
3. [Token cost per tier](#token-cost-per-tier)
4. [Hard rules — frontmatter](#hard-rules--frontmatter)
5. [Hard rules — SKILL.md body](#hard-rules--skillmd-body)
6. [Hard rules — references](#hard-rules--references)
7. [Naming conventions](#naming-conventions)
8. [Description authoring](#description-authoring)
9. [Degrees of freedom matched to fragility](#degrees-of-freedom-matched-to-fragility)
10. [Pattern examples](#pattern-examples)
11. [Build evals first](#build-evals-first)
12. [Test across model tiers](#test-across-model-tiers)
13. [Anthropic's verbatim 21-item checklist](#anthropics-verbatim-21-item-checklist)
14. [Why this matters for vaults](#why-this-matters-for-vaults)
15. [Dos](#dos)
16. [Don'ts](#donts)
17. [Verbatim quotes](#verbatim-quotes)
18. [Auditable signals](#auditable-signals)
19. [Sources](#sources)

---

## Core thesis

> *"The context window is a public good. Your Skill shares the context window with everything else Claude needs to know."*

Skills must be **discoverable cheaply** (metadata only, ~30–50 tokens per skill) and load detail only when triggered. The mechanism: **three tiers of progressive disclosure**.

This pattern is what lets a Claude Code installation have 100+ skills without choking on startup. Only 30–50 tokens × 100 skills = ~5K tokens is paid upfront. Each individual SKILL.md body (often 200–500 lines / ~2K–5K tokens) loads only when relevant.

## The three-tier loading model

| Tier | Content | When loaded | Token cost |
|---|---|---|---|
| **L1: Metadata** | `name` + `description` from YAML frontmatter | **Always**, at startup | ~30–50 tokens per skill |
| **L2: SKILL.md body** | Main instructions | When Claude judges the skill **relevant** to the prompt | Loaded once when triggered (entire body) |
| **L3: References / scripts** | `references/*.md`, executable scripts | **On demand**, only when SKILL.md links to them and Claude reads them | Zero context until accessed |

The same pattern applies to:
- **MCP tools** — only tool names load at startup; full schemas defer
- **Path-scoped CLAUDE.md rules** — `.claude/rules/*.md` with `paths:` frontmatter only load when matching files are read
- **Subdirectory CLAUDE.md** — only loads when Claude works in that directory

## Token cost per tier

Anthropic publishes rough numbers:

- **L1 (metadata):** ~30–50 tokens per skill. With 30 skills installed, ~1,200–1,500 tokens upfront.
- **L2 (SKILL.md body):** typically 200–500 lines (~2K–5K tokens). Loaded when triggered.
- **L3 (references):** unbounded. Loaded only when read.

For comparison, a typical 200K-token Claude Code session loads ~8K of overhead at startup (system prompt + memory + skills metadata + CLAUDE.md). That's 4% of the window — leaving 96% for the actual conversation.

If you broke the progressive disclosure pattern (e.g., loaded all SKILL.md bodies upfront), 30 skills × 3K tokens = 90K. Half the window gone before the first user message.

## Hard rules — frontmatter

| Field | Limit | Notes |
|---|---|---|
| `name` | **64 characters max** | Lowercase letters, numbers, hyphens only. No XML tags. **No reserved words ("anthropic", "claude").** |
| `description` | **1024 characters max** | Non-empty. No XML tags. |
| `description` style | Third person | "Processes Excel files," not "I can help…" or "Use me when…" |
| `description` content | Both **what** and **when** | Must include explicit triggers |

Failure modes:

- Name >64 chars → skill rejected at load
- Description >1024 chars → skill rejected at load (this is the error users hit when they write multi-paragraph YAML folded scalars)
- Reserved words → skill rejected at load
- First-person description → skill works but Claude is less likely to invoke it correctly

## Hard rules — SKILL.md body

| Rule | Source |
|---|---|
| SKILL.md body **under 500 lines** | Anthropic |
| Use clear sections, headers, and lists | Anthropic |
| One topic per skill | Anthropic |
| Avoid time-sensitive info inline ("After August 2025…") | Anthropic |
| Use `<details>` collapsible blocks for legacy/old patterns | Anthropic |
| Use forward slashes only — even on Windows | Anthropic |
| MCP tools always fully qualified: `ServerName:tool_name` | Anthropic |
| No magic numbers / "voodoo constants" without `# why` comments | Anthropic |
| Consistent terminology — pick one term ("API endpoint") and use it throughout | Anthropic |
| Don't punt errors to Claude in scripts — handle explicitly | Anthropic |

## Hard rules — references

> *"Keep references one level deep from SKILL.md."*

This is the rule most often broken. The hierarchy:

✅ **Allowed:** `SKILL.md` → `references/foo.md`
❌ **Broken:** `SKILL.md` → `references/foo.md` → `references/bar.md`
❌ **Broken:** `SKILL.md` → `references/index.md` → `references/foo.md`

Why: deeper nesting causes Claude to use **partial reads** (`head -100`) and miss content. References must be reachable in one hop so Claude reads the whole file when it needs it.

Other reference rules:

| Rule | Source |
|---|---|
| Reference files >100 lines need a **TOC at the top** | Anthropic |
| Use domain-specific organization (e.g., `references/finance.md`, `references/sales.md`) | Anthropic |
| Each reference file should be **complete on its own** | Anthropic |
| Scripts are executed, not read into context — they consume zero context until output is generated | Anthropic |

## Naming conventions

✅ **Good** (gerund form, action-oriented):
- `processing-pdfs`
- `analyzing-spreadsheets`
- `responding-to-dms`
- `auditing-vault-health`

❌ **Avoid** (vague, generic):
- `helper`
- `utils`
- `tools`
- `documents`
- `data`
- `manager`

Specific, action-oriented names help Claude select the right skill from 100+ available.

## Description authoring

The description is **the single most important field** — it's how Claude decides whether to load the skill body.

> *"Each Skill has exactly one description field. The description is critical for skill selection: Claude uses it to choose the right Skill from potentially 100+ available Skills."*

### Required components

1. **What** the skill does (third person, specific)
2. **When** to use it (explicit triggers, multiple phrasings)
3. **Requirements** if any (e.g., "Run from vault root")

### Example — bad

```yaml
description: "Helps with PDFs"
```

Vague, no triggers, won't be selected reliably.

### Example — good

```yaml
description: "Extracts structured data from PDF documents. Identifies tables, headers, and key fields. TRIGGERS: extract from PDF, parse PDF, get data from PDF, scan PDF, PDF to structured data, PDF to JSON. REQUIREMENT: PDF must be text-based, not scanned image."
```

Specific, multi-phrased triggers, requirement called out.

## Degrees of freedom matched to fragility

Different operations need different levels of constraint:

| Freedom level | Form | Use when |
|---|---|---|
| **High** | Text instructions | Multiple valid approaches; the task tolerates variation |
| **Medium** | Pseudocode, parameterized scripts | A preferred pattern exists, but variation is OK |
| **Low** | Specific scripts with no parameters | Fragile/critical operations (e.g., DB migrations, security checks) |

Match the form to the fragility. Don't write rigid scripts for creative tasks. Don't write loose text for tasks where deviation breaks production.

## Pattern examples

### Pattern 1: High-level guide with references

```
SKILL.md          # Quick start, common cases
references/
├── FORMS.md      # Form-specific reference
├── REFERENCE.md  # Full API
└── EXAMPLES.md   # Concrete examples
```

SKILL.md is the index. Domain-specific deep content lives in references.

### Pattern 2: Domain-specific organization

```
SKILL.md
references/
├── finance.md
├── sales.md
├── engineering.md
└── operations.md
```

A sales-related query never loads finance reference. Cleanest progressive disclosure.

### Pattern 3: Conditional details

```
SKILL.md          # Basic content inline
references/
└── advanced.md   # Linked from SKILL.md when "advanced" cases come up
```

Most common case is in the body; edge cases are linked.

## Build evals first

Anthropic's strong recommendation:

> Build at least **3 evaluations BEFORE writing extensive docs.**

The evals tell you:
- Whether the description is specific enough to trigger reliably
- Whether the SKILL.md body is clear enough for the model to follow
- Where the skill currently fails

Without evals, you're guessing.

## Test across model tiers

> *"What works for Opus may need more detail for Haiku."*

A skill that works on Opus 4.7 may fail on Haiku 4.5 because:
- Haiku has less reasoning headroom for vague instructions
- Haiku follows fewer simultaneous instructions
- Haiku may need more explicit examples

Test at least: Haiku, Sonnet, Opus. If the skill is intended for production use across model tiers, this is non-optional.

## Anthropic's verbatim 21-item checklist

Reproduced from the official skill best practices page:

- [ ] Description is specific and includes key terms
- [ ] Description includes both what the Skill does and when to use it
- [ ] SKILL.md body is under 500 lines
- [ ] Additional details are in separate files (if needed)
- [ ] No time-sensitive information (or in "old patterns" section)
- [ ] Consistent terminology throughout
- [ ] Examples are concrete, not abstract
- [ ] File references are one level deep
- [ ] Progressive disclosure used appropriately
- [ ] Workflows have clear steps
- [ ] Scripts solve problems rather than punt to Claude
- [ ] Error handling is explicit and helpful
- [ ] No "voodoo constants"
- [ ] Required packages listed and verified
- [ ] Scripts have clear documentation
- [ ] No Windows-style paths
- [ ] Validation/verification steps for critical operations
- [ ] Feedback loops included for quality-critical tasks
- [ ] At least three evaluations created
- [ ] Tested with Haiku, Sonnet, and Opus
- [ ] Tested with real usage scenarios

This checklist is what the vault-audit skill's Pass 8 partially encodes. Some items are programmatically auditable (size, references depth, paths); some require human review (eval count, model testing, scenario testing).

## Why this matters for vaults

The progressive disclosure pattern is **the same architecture** the vault uses, just at a different layer:

| Skill layer | Vault layer |
|---|---|
| L1 metadata (always loaded) | Root CLAUDE.md (always loaded at session start) |
| L2 SKILL.md body (on relevance) | Per-folder CLAUDE.md (loads when Claude works in that folder) |
| L3 references (on demand) | Specific notes Claude reads when answering a query |

This is why a well-designed vault and a well-designed skill suite share principles:

- Lean root / lean SKILL.md
- Per-folder details / per-domain references
- One level deep
- Specific descriptions and naming
- The whole thing tested under load

When the skill audits a vault, it's checking the same patterns Anthropic uses to audit skills.

## Dos

- Pre-load only metadata; defer body and references.
- Keep SKILL.md ≤500 lines.
- Keep references one level deep.
- Add TOC to reference files >100 lines.
- Write descriptions in third person with explicit triggers.
- Use gerund-form action-oriented names.
- Use forward slashes everywhere (even Windows).
- Build evals first (≥3 per skill).
- Test across Haiku, Sonnet, Opus.
- Match degrees of freedom to fragility (rigid scripts for fragile ops; loose text for creative ones).
- Use `<details>` blocks for legacy/old patterns.
- Always fully qualify MCP tools (`ServerName:tool_name`).
- Include validation/verification steps for critical operations.

## Don'ts

- Don't nest references more than one level (`SKILL.md → adv.md → details.md` is broken).
- Don't include time-sensitive dates inline ("After August 2025…") outside `<details>`.
- Don't use vague names: `helper`, `utils`, `tools`.
- Don't use first/second person in descriptions.
- Don't include reserved words ("anthropic", "claude") in skill names.
- Don't punt errors to Claude in scripts; handle explicitly.
- Don't use magic numbers without `# why` comments.
- Don't write SKILL.md bodies >500 lines.
- Don't skip evals.
- Don't ship without testing on at least Haiku and Sonnet.
- Don't use Windows-style backslash paths.
- Don't present 5 alternatives without picking a default.

## Verbatim quotes

> *"The context window is a public good. Your Skill shares the context window with everything else Claude needs to know."*

> *"Default assumption: Claude is already very smart. Only add context Claude doesn't already have."*

> *"Keep references one level deep from SKILL.md."*

> *"Keep SKILL.md body under 500 lines for optimal performance."*

> *"For reference files longer than 100 lines, include a table of contents at the top."*

> *"Each Skill has exactly one description field. The description is critical for skill selection: Claude uses it to choose the right Skill from potentially 100+ available Skills."*

## Auditable signals

When this skill runs Pass 8 (skill-vault audit) and Pass 1 (size for SKILL.md):

- **SKILL.md body line count** > 500 → warn.
- **`name` length** > 64 characters → fail.
- **`name` contains uppercase, spaces, or special chars (other than hyphens)** → fail.
- **`name` contains reserved words** ("anthropic", "claude") → fail.
- **`description` length** > 1024 characters → fail.
- **`description` empty or missing** → fail.
- **`description` first/second person** ("I can…", "You can…", "Use me…") → warn.
- **`description` missing trigger keywords** ("when", "TRIGGERS", "Use this skill") → warn.
- **Reference depth**: walk markdown links from SKILL.md. Any reference reachable only via 2+ hops → fail.
- **Reference file >100 lines without TOC at top** → warn.
- **Windows-style paths** (`\\` or `C:\`) → fail.
- **MCP tool references missing `ServerName:` prefix** → warn.
- **Magic numbers in scripts without `# why` comments** → warn (heuristic).
- **Time-sensitive language** ("After 2025", "Before Q3") outside `<details>` → warn.
- **Inconsistent terminology** — same concept referred to with multiple terms in one SKILL.md → warn (heuristic).
- **Skill `references/` folder** containing files that match vault `Context/` filenames (icp, brand, voice, services) → fail (Pass 8 — point at vault instead).

## Sources

- https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices (canonical)
- https://code.claude.com/docs/en/skills (skill authoring overview)
- Anthropic, "Claude Agent Skills Explained" video (2025-11-26) — official walkthrough of the L1/L2/L3 model
- "Progressive Disclosure in Claude Code" (Developers Digest, 2026-01-12) — industry convergence note
