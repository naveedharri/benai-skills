# Practitioner field notes

Cross-creator synthesis. These don't override the official frameworks — they're complementary observations from creators running the same setup at scale. Production friction, not theory.

## Contents

1. [camelCase — "Stop Writing Bad CLAUDE.md Files"](#camelcase--stop-writing-bad-claudemd-files-2026-02-04)
2. [Mark Kashef — "Claude Code Turned Obsidian Into My Dream Second Brain"](#mark-kashef--claude-code-turned-obsidian-into-my-dream-second-brain-2026-03-15)
3. [Dave Ebbelaar — "Effective Context Engineering for AI Agents"](#dave-ebbelaar--effective-context-engineering-for-ai-agents-2025-12-19)
4. [Nate B Jones — "Karpathy's Wiki vs. Open Brain"](#nate-b-jones--karpathys-wiki-vs-open-brain-2026-04-22)
5. [Anthropic — "Claude Agent Skills Explained"](#anthropic--claude-agent-skills-explained-2025-11-26)
6. [Developers Digest — "Progressive Disclosure in Claude Code"](#developers-digest--progressive-disclosure-in-claude-code-2026-01-12)
7. [Cross-creator patterns](#cross-creator-patterns)
8. [Auditable signals derived from practitioner notes](#auditable-signals-derived-from-practitioner-notes)

---

## camelCase — "Stop Writing Bad CLAUDE.md Files" *(2026-02-04)*

Source: https://www.youtube.com/watch?v=lJNjDoJi6hQ

### Headline insight

> *"One line of bad code only affects exactly that code location. One line of bad CLAUDE.md has negative effects on every prompt and every action that Claude executes for you and for other developers — for years."*

### Specific takeaways

- **Don't run `/init`.** It generates verbose CLAUDE.md by default. AI-generated documentation tends to be long, hedged, and vague — the opposite of what works. Use it as scaffolding only, then prune ruthlessly.
- **Don't include code style rules** (`use 2 spaces`, `single quotes`, `JS uses camelCase`). Code style is a deterministic problem — use linters and formatters with the `post tool use` hook in `.claude/settings.json`. Spending CLAUDE.md tokens on style is doubly bad: Claude would derive most style from existing code anyway, and Claude won't apply style deterministically (your CI pipeline will still abort).
- **Three core building blocks every CLAUDE.md needs:**
  1. **One-liner** describing the project (framework, language, audience, domain)
  2. **Key bash commands** used in daily work (build, test, typecheck, lint, deploy)
  3. **Caveats** — non-obvious project warnings ("Never modify schema.prisma directly, run `npm run db:generate`")
- **Use `.claude/rules/`** with `paths:` frontmatter for path-scoped rules. They only load when Claude reads matching files.
- **Schedule a monthly CLAUDE.md audit.** It's a living document, code drifts, instructions go stale.
- **The Anthropic GitHub integration** lets you tag Claude in a PR review comment and ask it to update CLAUDE.md based on what surfaced. Reduces overhead.
- **Position effect:** LLMs over-attend to start and end, neglect middle. Put the most important rules at the top.
- **Anthropic's own system reminder is telling:** *"This context may or may not be relevant to your tasks."* The model is told CLAUDE.md content might be irrelevant. Specificity overcomes this; vagueness doesn't.

### What to NOT do

- Don't run `/init` and ship the result.
- Don't put code style rules in CLAUDE.md.
- Don't write CLAUDE.md files >300 lines (the practical ceiling for adherence).
- Don't list every npm script — only the ones used in daily work.
- Don't include detailed schema docs inline; reference them with progressive disclosure (`Read docs/schema.md when modifying models`).

### Quotes worth preserving

> *"Less is more. Under 300 lines, but ideally even shorter."*

> *"The most powerful large language models like Claude Opus 4.5 can follow about 150 to 200 instructions with reasonable consistency."*

> *"What happens when Claude gets too many instructions? Unfortunately, it's not the case that Claude just ignores the 151st instruction but takes the others perfectly. The overall quality of responses degrades massively."*

> *"One line of bad CLAUDE.md has negative effects on every prompt and every action that Claude executes — for years."*

---

## Mark Kashef — "Claude Code Turned Obsidian Into My Dream Second Brain" *(2026-03-15)*

Source: https://www.youtube.com/watch?v=2kbINqpluM0

### Headline insight

Mark abandoned Obsidian five times before pairing it with Claude Code. Once Claude Code became the writing layer, the abandonment problem disappeared — because the friction of organizing notes manually was the actual blocker.

> *"This changed on the sixth time when I combined Obsidian with Cloud Code."*

### Specific takeaways

- **Inbox folder pattern** — orphan ideas land in `Inbox/`, get autocategorized later by Claude. Reduces capture friction.
- **Slash commands earn their keep:** `/daily` for a daily brief, `/standup` for a project briefing, `/tldr` for end-of-conversation captures. The tldr pattern is especially good — type it at the end of any conversation and a structured note lands in Obsidian.
- **PDF/binary ingest pipeline** — don't store raw PDFs in the vault Claude actively reads:
  1. Raw files → folder organization (group by file type)
  2. Cheap LLM with large context window (Gemini 3 Flash) → markdown cheat sheets
  3. Cheat sheets → vault
- **The Obsidian CLI** has 95 commands. Claude Code can drive all of them. Skills can wrap the most-used ones.
- **Multiple-choice prompts** via `AskUserInput` reduce setup friction more than free-text. Particularly relevant for onboarding skills (vault setup, profile setup).
- **The vault setup skill asks 4 questions:** what do you do for work? what falls through the cracks? work-only or personal too? existing files to import?
- **Canvas feature** — Obsidian has a native canvas (mermaid-diagrams, NotebookLM-style). Skills can populate canvases from prompts.

### Architecture pattern observed

```
Obsidian Vault/
├── Inbox/                  # orphan capture, autocategorized later
├── Work/                   # business categories
├── Personal/               # life categories
├── Projects/{name}/
└── .obsidian/             # plugin config (Relay, etc.)
```

Claude Code points at the vault root. Skills wrap the Obsidian CLI for programmatic access.

### Quotes

> *"If you ever have a brand new idea that doesn't necessarily have a designated home, it can land in the inbox until you, or in this case, Cloud Code can autocategorize and place it where it fits best."*

> *"You can literally tell your CLAUDE.md, hey, always refer to insert path of all of these markdown files when I ask you about XYZ."*

---

## Dave Ebbelaar — "Effective Context Engineering for AI Agents" *(2025-12-19)*

Source: https://www.youtube.com/watch?v=nkJXADeI62c

### Headline insight

> *"In most of those cases, those AI agents fail not really because they can't reason or because the model isn't smart enough, but because they're reasoning over bad context."*

The biggest production failure mode for agents is not the model — it's bad context engineering. And bad context engineering is invisible during development because dev sessions are short. It only surfaces at turn 10 or turn 20.

### Specific takeaways

- **LLMs are bad at negative examples.** Replace `don't do X` with `do Y`. Show what good looks like with positive examples. *"A picture says more than a thousand words. A positive example is so much better than a negative example saying don't do this."*
- **System prompt evolution failure mode:**
  1. Start: vague system prompt
  2. Ship it
  3. Users complain
  4. Engineer hardcodes if/else for each complaint
  5. System prompt bloats, performance drops
  6. Repeat
- **Solution: split into router + sub-prompts.** A router LLM call decides which sub-prompt applies. Each sub-prompt is small and focused.
- **State machines beat one giant prompt.** Track user state in a database. On each user message, pull the system prompt that matches the state. Don't try to encode all states in one prompt with "first do A, then if X do B" branches.
- **Use tracing tools (Langfuse) to view full conversation traces.** Most "the AI is dumb" problems are actually "the context is broken" — visible only when you see system prompt + tool calls + history together.
- **Tools should be short, descriptive, focused, non-overlapping.** A bloated tool description is a context tax on every call. Don't have 20 tools where 5 would work.
- **Conversation memory:** prune or summarize once history gets long. Problems usually emerge at turn 10–20, never turn 1–2 (the development testing window).
- **Workflows vs agents:** most use cases are workflows (deterministic sequences with LLM calls), not agents (autonomous tool-use loops). Don't reach for "agent" when "workflow" works.
- **Knowing when to use a workflow vs an agent is the most underrated skill in AI engineering.**

### Quotes

> *"Calibrating the system prompt is all about being just specific enough but also letting the LLM be creative rather than giving it line by line if-else statements."*

> *"LLMs are not really good at handling negative examples. They really thrive on giving them positive examples."*

> *"In most of those cases, those AI agents fail not because they can't reason but because they're reasoning over bad context."*

> *"The key to building effective AI systems is that it doesn't need to pass once. It doesn't need to pass twice, but it also needs to pass on turn 10 and also on turn 20."*

---

## Nate B Jones — "Karpathy's Wiki vs. Open Brain" *(2026-04-22)*

Source: https://www.youtube.com/watch?v=dxq7WtWxi44

### Headline insight

> *"The Wiki idea is great when you want to think in connections. It is fragile when you need exact retrieval from structured data."*

The wiki approach is one tool, not the only tool. Pair it with the right structured-data layer for tasks where exact lookup matters.

### Specific takeaways

- **The wiki is for connections and synthesis.** Cross-references, accumulated reasoning, narrative knowledge.
- **The wiki is fragile for structured data lookup.** Catalog queries, customer records, financial transactions, anything that needs aggregation/filtering.
- **Hybrid stacks are the production pattern:**
  - Markdown wiki for narrative
  - Postgres for entities and full-text search
  - pgvector for similarity search (when needed)
  - Graph database (Neo4j, Graphiti) for relational reasoning (optional)
  - All unified through an MCP server
- **Don't put product catalogs or transaction logs in markdown.** Wrong shape — markdown stores strings, not entities.
- **You as engineer/PM still have to decide.** No tool substitutes for the architectural thinking.

### Quotes

> *"It is up to you. It is not up to me. We all have to wrestle with this. And if you are an engineer thinking about this or a product manager thinking about this in an org, you cannot substitute for that level of thoughtfulness. I'm sorry, you got to do the thinking."*

---

## Anthropic — "Claude Agent Skills Explained" *(2025-11-26)*

Source: https://www.youtube.com/watch?v=fOxC44g8vig

### Headline insight

The official walkthrough of the L1/L2/L3 progressive disclosure model. The key operational fact:

> *"At startup only the name and description of every installed skill is loaded in the system prompt. This is going to consume about 30 to 50 tokens per skill."*

### Specific takeaways

- **L1 metadata (~30–50 tokens per skill)** loads at startup. Only the `name` and `description` from frontmatter.
- **L2 SKILL.md body** loads when Claude judges the skill relevant to the prompt.
- **L3 references** load only when SKILL.md links to them and Claude reads them.
- **Skills are portable** across Claude Code, the API, and claude.ai.
- **MCP servers connect data; sub-agents specialize in roles; skills bring expertise.** Three different layers, often confused.

### Use cases highlighted

- Onboarding new hires to coding standards
- Ensuring every PR follows security best practices
- Sharing data analysis methodology across a team

### Quote

> *"Skills let you package workflows into reusable capabilities."*

---

## Developers Digest — "Progressive Disclosure in Claude Code" *(2026-01-12)*

Source: https://www.youtube.com/watch?v=DQHFow2NoQc

### Headline insight

> *"Tools as files, loaded on demand, bash + filesystem, progressive disclosure. Bash is all you need."*

The industry is converging. Cloudflare, Anthropic, Vercel, Cursor — independently — all arrived at the same architecture for building agents.

### Specific takeaways

- **Industry convergence is real.** Multiple top AI infrastructure companies independently arrived at:
  - Tools represented as files
  - Loaded on demand
  - Bash + filesystem as the universal interface
  - Progressive disclosure as the loading model
- **It's a counter-intuitive answer.** 6 months ago the conventional wisdom was "use vector embeddings for everything" and "agents need orchestration frameworks." That assumption broke.
- **The pattern works because file systems are debuggable.** A human can `cat` the same file the agent reads. You can't do that with embeddings or hidden orchestration state.

### Quote

> *"Tools as files, loaded on demand, bills, progressive disclosure, bash is all you need."*

---

## Cross-creator patterns

When you stack the practitioner notes, several patterns recur:

1. **Specificity beats vagueness everywhere.** Anthropic's research, camelCase's CLAUDE.md guidance, Dave's prompt engineering, Mark's vault setup — all converge on *concrete > general*.

2. **Progressive disclosure is now standard.** Anthropic ships it for skills. Karpathy independently arrives at it for wikis. Cloudflare/Vercel/Cursor converge on the same. The vault gets it via per-folder CLAUDE.md.

3. **Files-not-vectors is the architectural bet.** Anthropic's Managed Memory, Karpathy's Wiki, Mark's Obsidian, the Developers Digest convergence note — all running file-based.

4. **Hybrid stacks for hybrid problems.** Nate B Jones's caveat: don't try to make markdown do what a database does. Pair the wiki with structured stores when needed.

5. **Living documents need scheduled maintenance.** camelCase's monthly audit, Karpathy's lint operation, Anthropic's pruning test, this skill's design — all assume the system rots without active care.

6. **Production failure modes are context, not model.** Dave Ebbelaar's main thesis matches Anthropic's "context engineering" framing. The model is rarely the bottleneck. The context fed to the model usually is.

7. **The first month is a slog.** This is a recurring theme across creator commentary on adoption. Solo for 2–3 weeks, then add a curious teammate, then expand. Don't roll out top-down.

## Auditable signals derived from practitioner notes

These supplement the framework-derived signals in the other reference files:

- **Skill-vault duplication**: a skill bundles its own ICP/voice/offer when the vault has them in `Context/` (Pass 8). This is what the linkedin-writer-vault skill demonstrates.
- **Code style rules in CLAUDE.md**: detect `\b(use|prefer)\s+\d+\s+(space|tab)`, indent rules, quote rules. Suggest moving to linter config + `.claude/rules/`.
- **`/init`-generated CLAUDE.md fingerprint**: detect long preamble paragraphs ("This project is...", "The codebase contains..."), file-by-file descriptions, generic platitudes. Suggest pruning or rewrite from scratch.
- **Negative examples in skills/CLAUDE.md**: detect `\bdon't\b.*` rules without a corresponding positive example. Suggest converting to "do this" form.
- **Inbox folder presence**: in vaults claiming to be a second brain, flag if there's no orphan-capture folder (`Inbox/`, `Capture/`, `New/`). Suggest creating one.
- **Slash commands present**: a healthy vault often has `/daily`, `/tldr`, `/standup` style commands. Inform-only — flag if absent in a vault that's been active >2 weeks.
- **Raw binaries (PDFs, slides) in vault root or active folders**: Mark's pattern says synthesize first. Flag binary files in Claude-active folders.
- **Conversation log files growing past 2k tokens**: Dave's "turn 10–20" failure mode applies here. Flag long unprocessed conversation captures.
