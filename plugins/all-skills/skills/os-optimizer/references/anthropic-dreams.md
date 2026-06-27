# F8 — Reflection (the why)

**Source:** Anthropic Managed Agents — Dreams (Research Preview).
https://platform.claude.com/docs/en/managed-agents/dreams

## Core thesis

Memory stores accumulate duplicates, contradictions, and stale entries as they grow. Per-file lint cannot see this — every check is local to one file. Reflection reads the **curated layer** of the vault alongside the **recent session layer** (daily logs, meeting notes, decisions) and surfaces cross-file findings that only emerge from synthesis.

A dream takes:
- a pre-existing memory store (here: every folder where `layer == "curated"` in the Step 1.5 registry — both standard roles like context/projects/resources and any custom role the user has, like `Building/` or `Garden/`, that the agent classified as curated),
- optionally up to 100 sessions (here: every folder where `layer == "session"` — standard roles like daily/meetings and custom session roles like `Inbox/`, scoped to the configured time window, default 30 days),

and produces a curated output: duplicates merged, stale entries replaced with the latest value, new insights folded in. The input is never modified — proposals are reviewed before they land.

**F8 never hardcodes folder names — and never ignores folders that don't fit a standard role.** Whatever the user calls things in *their* vault — `Knowledge/`, `Library/`, `Journal/`, `Logs/`, `Building/`, `Garden/`, anything custom — the role registry assigns each one a layer, and F8 queries by layer. Custom curated folders are mined for contradictions, merges, stale entries, and themes exactly like the standard ones. Missing standard roles are silently skipped (F9.0 handles the gap finding); F8 still runs on whatever curated and session content the vault actually has.

## Why this is a fixable framework, not a flag-only one

The user runs `/os-optimizer` to *optimize* the vault. Every F8 finding therefore ships with a concrete fix proposal (merge target, replacement text, new file path, promotion destination). The user approves per-item via `AskUserQuestion`; nothing is bulk-applied because each contradiction/merge/promotion needs human judgment about which note wins and how to phrase the result.

## What F8 catches that F1–G7 cannot

| F1–G7 limitation | F8 fills the gap |
|---|---|
| Per-file rules | Cross-vault patterns (clusters, contradictions, themes) |
| Static scope | Time-aware — uses recent activity to detect what's superseded |
| Lint signals | Synthesis signals — what the vault as a whole is missing |
| Triggers + judgment on local context | Topic clustering across many files + judgment on the cluster |

## Five F8 categories

1. **Contradictions** — two notes disagree on the same fact.
2. **Merge candidates** — N notes covering the same concept that should collapse into one canonical entry.
3. **Stale entries** — `Context/` assumptions superseded by recent decisions or meeting outcomes.
4. **Emergent themes** — ≥3 notes in last 30d on a topic with no canonical Context entry or MOC.
5. **Promotions** — durable knowledge buried in ephemeral daily/meeting logs that belongs in `Context/` or `Resources/`.

## Operating principles

- **Input is never modified by analysis** — all proposed changes pass through Step 4 (`AskUserQuestion`) before any edit lands.
- **Walk-only, per-item** — every F8 fix needs the user to pick the right target. No bulk-apply mode.
- **Time window matters** — sessions older than the configured window (default 30 days) are not considered "recent." Older content lives in the curated layer or gets archived.
- **Respect F5's budget** — a merge that would push the result over F5's per-file budget downgrades to flag-only with reasoning.
- **Never touch a CLAUDE.md** — F8 findings that target a CLAUDE.md or claude.md downgrade to flag-only. F1's auto-rewrite prohibition wins.
