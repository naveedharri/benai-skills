---
name: operator
description: "Build and schedule a personalized Operator prompt that runs a Baalda vault as a second brain on a recurring cadence. Run it from inside the vault: it reads Context/ and CLAUDE.md first to infer org, team, brand voice and paths, then asks only the gaps (cadence, connectors, DM recipient, budgets, signature), writes the rendered prompt locally, and invokes the schedule skill to wire the recurring trigger. Baalda-aware: routes every note move or rename through the app or the Baalda MCP so notes keep their doc_id, and never touches .context/. Use when the user says \"set up the operator\", \"build my operator prompt\", \"operate my Baalda vault\", \"schedule my OS\", \"vault operator\", or runs /operator."
---

# Baalda Operator

Build a personalized Operator prompt that runs the user's Baalda vault on a recurring schedule.

## Baalda ground rules (read once, obey throughout)

These are app invariants, not preferences. Breaking them corrupts note identity or the sync state, and the Operator runs unattended, so a broken rule compounds across every run.

1. **Run from the vault root.** The vault root is the folder the user opened in Baalda.
2. **`.context/` is off-limits.** Baalda keeps its SQLite index, CRDT store and `config.json` there. Never read, write, walk or index it. Same for `.git` and `attachments/`.
3. **Write files, don't shell out to move them.** Creating and editing `.md` files with normal tools is fully supported: the watcher picks the change up in about 150ms and merges it as a CRDT operation, so an Operator edit and a human keystroke coexist instead of clobbering.
4. **Never `mv` or `rm` a synced note.** A note's identity is a `doc_id`, not its path. An external move reads as delete plus create: the note gets a new `doc_id` and its history, backlinks and share settings do not follow. The Operator moves and renames through `move_note` / `move_folder` on the Baalda MCP, or not at all.
5. **Prefer `[[wikilinks]]` over relative paths** so links survive a later move.

Build a personalized Operator prompt that runs the user's second brain on a recurring schedule. The Operator is a fully autonomous maintenance agent — one session = one run, no questions, no confirmations, executes and reports.

This skill does **four** jobs, in order:

1. **Discover** what the vault already knows. Read `Context/` and `CLAUDE.md` silently — extract org name, team scope, brand voice, vault folders, runtime conventions.
2. **Ask only the gaps.** Cadence, connectors, DM recipient, budgets, signature. Don't re-ask anything Phase 0 already pulled out of the vault.
3. **Render and save** the personalized prompt locally.
4. **Schedule it.** Hand off to the `schedule` skill (via the `Skill` tool) so the trigger is wired before the run ends — the user does not need to manually run `/schedule create`.

## Reference files

- `references/operator-prompt-template.md` — the parameterized prompt. ~400 lines, preserves every critical rule from the source spec.
- `references/connector-fragments.md` — spliceable body blocks per connector (transcripts, chat, community).

Read both before generating output.

---

## Phase 0 — Silent discovery (no questions, no MCP calls)

The user invokes this skill **from inside their vault folder locally**. Everything here is filesystem-only. Do NOT call any `vault_*` MCP tools — the Vault MCP only matters at *runtime* when the rendered Operator agent runs.

1. **Verify the cwd is a Baalda vault that has been set up.** Print the current directory and check for both markers:

   ```bash
   pwd && ls -a | grep -E '^\.context$' || echo "no .context/ — not yet opened in Baalda"
   ```

   - `.context/` present → this folder is a Baalda vault. Good.
   - `.context/` absent → the folder has never been opened in Baalda. Say so, and continue only if the user confirms this is the right folder. Do not create `.context/` yourself.

   Then confirm `claude.md` or `CLAUDE.md` exists at the cwd root. If neither exists, the vault has not been set up: point the user at `/setup` and stop.
2. **List top-level folders.** `Glob` pattern `*/` at cwd. Cache the result as `{{VAULT_FOLDERS}}` (one folder name per line).
3. **Read `CLAUDE.md`.** Pull conventions: signature style, em-dash rule, voice rules, folder routing, any explicit operator paths, `os-mode` (professional vs business).
4. **Find the curated layer, then read it by subject.** Do not assume it is called `Context/`.

   Resolve it: the folder named in `CLAUDE.md`'s routing table as holding identity, brand or strategy; else a top-level folder from `{{VAULT_FOLDERS}}` named `Context`, `About`, `Me`, `Identity`, `Personal`, `Brand` or similar; else the folder whose files actually carry that content. Cache it as `{{CONTEXT_ROOT}}`.

   Then `Glob` `{{CONTEXT_ROOT}}/**/*.md` and read what is there. **Match on subject, not on filename**, because the same content sits at a different path in every vault:

   | Looking for | Common homes |
   | --- | --- |
   | Operator profile: name, role, focus | `me.md`, `operator.md`, `personal-brand/background.md` |
   | Org name, mission, products, locations | `business.md`, `organization.md`, `company.md` |
   | Team member full names, roles, who handles what | `team.md`, or one file per person under a `Team/` role folder |
   | Voice, and any hex colors that could seed the signature | `brand.md`, `voice.md`, `personal-brand/voice.md`, `brand/brand-kit.md` |
   | Current focus, OKRs, the funnel or workstream map | `strategy.md` |
   | Who the audience is | `icp.md`, or one file per segment under `icp/` |
   | External people to be aware of, outside team scope | `stakeholders.md` |

   A row with no match is a gap, not an error: note it and carry on. A row matched by several files reads all of them. **Never write to this layer**, it is human-owned.
5. **Cache inferred values:**
   - `{{ORG_NAME}}` ← from whichever file matched the org row in step 4 (title heading or `name:` frontmatter). If none, fall back to the cwd folder name.
   - `{{TEAM_MEMBERS}}` ← comma-separated full names from whatever matched the team row: one file, or one file per person. If solo (`os-mode: professional`), use the operator's own name from the operator-profile match.
   - `{{EXAMPLE_TEAM_MEMBER}}` ← first name in `{{TEAM_MEMBERS}}`.
   - `{{OPERATOR_NAME}}` (default) ← `{{ORG_NAME}} Vault Operator`.
   - `{{OPERATOR_HANDLE}}` ← slugified, e.g. `Vault-Operator`.
   - `{{OPERATOR_BASE_PATH}}` ← `/Team/{{ORG_NAME}}/Profiles/Vault-Operator/` if `Team/` is one of the discovered top-level folders, else `/{{ORG_NAME}}/Vault-Operator/`.
   - `{{PROFILE_BASE_PATH_PATTERN}}` ← `/Team/{{ORG_NAME}}/Profiles/{Name}/` if applicable.
   - `{{BRIEFING_FOLDER}}` ← **the vault's own dated-log convention, discovered not assumed.** Resolve in order: a top-level folder from `{{VAULT_FOLDERS}}` already holding `YYYY-MM-DD.md` files; else the folder `CLAUDE.md`'s routing table names for daily logs or run logs; else a folder named `Daily`, `Journal`, `Logs` or similar. If none exists, ask the user where the briefing should go before writing anything, and never invent a new root folder: some vaults forbid one by rule.
   - `{{BRIEFING_SUBPATH_PATTERN}}` ← the path within that folder, matching whatever date format the existing files use.
   - `{{BRIEFING_PATH_PATTERN}}` ← the two joined, for display in the prompt.
   - `{{VOICE_FILE}}` ← the path that matched the voice row in step 4. If several matched, the master register rather than a per-channel delta. If none, leave it as the vault's `CLAUDE.md` and say the voice rules came from there.
   - `{{SIGNATURE_BG_COLOR}}` ← any brand color hex found in whatever matched the voice-and-colors row, else `#D2ECD0`.
   - `{{SIGNATURE_FG_COLOR}}` ← `#020309`.

After Phase 0, summarise to the user in 4–6 short lines what you found. Format:

> **Discovered from your vault:**
> - Org: `{{ORG_NAME}}`
> - Team: `{{TEAM_MEMBERS}}`
> - Top-level folders: `{count}` ({list first 5})
> - Operator path (proposed): `{{OPERATOR_BASE_PATH}}`
> - Brand signature color (proposed): `{{SIGNATURE_BG_COLOR}}`
>
> Anything to override? (Type the field name, or say "looks good" to continue.)

If the user wants overrides, accept them inline (one short follow-up) and update the cache. If "looks good", proceed straight to Phase 1.

**Do not re-ask any of the above as standalone questions.** They were inferred. Phase 1 is for things the vault genuinely cannot tell you.

---

## Phase 1 — Ask only the gaps

These are the questions the vault cannot answer. Ask one at a time with `AskUserQuestion`.

### Q1 — Cadence

`AskUserQuestion` with options:

- **Hourly** — every hour, max throughput. Best for active teams.
- **Every 4 hours** — balanced. Catches new transcripts/chat without spamming.
- **Daily** — one run per day. Best for solo or low-volume.
- **Custom** — user types a cron expression or phrase.

Save as `{{CADENCE_HUMAN}}` and `{{CADENCE_TAG}}`.

### Q2 — Connectors (probe live, do not just ask)

Don't show the user a checklist of connectors and trust their answer. **Probe what's actually wired up in this environment**, then confirm.

#### Step 2a — Detect

Inspect the running session's available tools. Look for tool names matching these prefixes (any namespace — `mcp__*`, plain, or vendor-specific):

| Category | Detection signal | Live probe (read-only) |
|----------|------------------|------------------------|
| **Vault** | Baalda MCP: `list_vaults`, `list_folders`, `list_notes`, `read_note`, `create_note`, `update_note`, `append_note`, `move_note`, `move_folder`, `search_notes` (any namespace) | Call `list_vaults`, then `list_folders` on the matching vault. Success = the vault appears and its folders come back. |
| **Transcripts** | `fireflies_*`, `otter_*`, `granola_*`, `read_ai_*` | Call the connector's "list recent" / "get transcripts" with a 1-item or 24h window. Success = ≥0 results, no auth error. |
| **Chat** | `slack_*`, `teams_*`, `discord_*`, `telegram_*` | Call the connector's "list channels" / "search users" / equivalent read-only call. Success = response, no auth error. |
| **Community** | `circle_*`, `discourse_*` | Call `list_spaces` / `categories` with `per_page: 1`. Success = response. |

Run all detected probes **in parallel** in one batch. Narrate before the batch ("Probing 3 connectors live: vault, fireflies, slack…") and after ("Vault OK (13 folders). Fireflies OK. Slack auth error.").

For each connector:

- ✅ **Found and probe succeeds** → mark enabled. Capture the actual MCP/tool prefix as `{{*_MCP_NAME}}` and infer the product name (e.g. `fireflies` → `Fireflies`).
- ⚠️ **Found but probe fails** (auth error, 401, empty creds) → mark "wired but broken". Tell the user the exact error and ask whether to (a) skip this connector, (b) pause so they can fix the credentials and re-run the probe, or (c) include it anyway.
- ❌ **Not found** → mark disabled. Do not ask "do you want to add it?" — that's a separate setup task. The user can re-run `/os-operator` later after wiring a new MCP.

#### Step 2b — Confirm with the user

Show one summary block:

> **Connectors detected:**
> - ✅ Vault MCP — `relay-mcp` (13 folders)
> - ✅ Transcripts — `fireflies` (last transcript: 2 hours ago)
> - ✅ Chat — `slack` (12 channels visible)
> - ❌ Community — none detected
>
> Use these in the Operator? (yes / customize)

If the user says "customize", let them toggle individual entries off (but never on for something not detected — they need to wire that MCP first). If they say "yes" or just confirm, proceed.

#### Save

- `{{TRANSCRIPT_PRODUCT_NAME}}` and `{{TRANSCRIPT_MCP_NAME}}`
- `{{CHAT_PRODUCT_NAME}}` and `{{CHAT_MCP_NAME}}`
- `{{COMMUNITY_PRODUCT_NAME}}` and `{{COMMUNITY_MCP_NAME}}`
- `{{VAULT_MCP_NAME}}` (whatever the probe identified — default `relay-mcp` if ambiguous)

Probes are read-only by design. Never invoke a write/send tool during detection (no DMs, no posts, no file writes).

### Q3 — Which Baalda vault (only if the Baalda MCP is wired)

The Baalda MCP can serve more than one vault, and the rendered Operator has to name the right one on every call. Call `list_vaults` and match against the cwd folder name.

- **Exactly one vault, and it matches the cwd** → use it, do not ask.
- **Several vaults** → `AskUserQuestion` listing them, defaulting to the one whose name or path matches the cwd.
- **No match** → tell the user the cwd is not a vault the MCP can see, and ask whether to continue local-file-only (the Operator then uses `Read` / `Write` instead of MCP calls, which works but loses `move_note` safety).

Save as `{{VAULT_NAME}}`.

Baalda addresses notes by vault plus a path from the vault root, so there is no root-folder-name quirk to work around and no `{{ROOT_FOLDER_NAME}}` to capture. The Baalda template does not use it.

### Q4 — DM escalation recipient (only if chat connector is enabled)

> When the Operator finds a community post or chat thread that needs human action, who receives the 1:1 escalation DM? **One person only.** No channels, no groups.

Default the picker to names in `{{TEAM_MEMBERS}}` so the user can pick rather than retype. Save as `{{DM_RECIPIENT_NAME}}`.

If no chat connector is enabled, skip this question. Set `{{DM_RECIPIENT_NAME}}` to the operator's own name from the operator-profile match in step 4 — the placeholder is referenced in a few sections that will be stripped during render anyway.

### Q5 — Budgets

`AskUserQuestion` with options:

- **Defaults** — 50 reads, 30 writes, 20 transcripts, 5 DMs, 10 housekeeping fixes per run.
- **Light** — 25 / 15 / 10 / 3 / 5. Solo / low-volume.
- **Heavy** — 100 / 60 / 40 / 10 / 20. Large teams / daily cadence.
- **Custom** — user types overrides.

Save as `{{BUDGET_READS}}`, `{{BUDGET_WRITES}}`, `{{BUDGET_TRANSCRIPTS}}`, `{{BUDGET_DMS}}`, `{{BUDGET_HOUSEKEEPING}}`.

### Q6 — Signature color (only if Phase 0 didn't infer one)

If step 4 already produced a brand color, skip this. Otherwise:

> The Operator stamps every file it edits with a colored span. Pick a background color (default: `#D2ECD0`, soft mint green). Foreground default: `#020309`.

Save as `{{SIGNATURE_BG_COLOR}}` and `{{SIGNATURE_FG_COLOR}}`.

---

## Phase 2 — Render

1. Read `references/operator-prompt-template.md`.
2. Read `references/connector-fragments.md`.
3. Replace every `{{PLACEHOLDER}}` with the captured value. For connector-specific placeholders (`{{TRANSCRIPTS_BOOTSTRAP_LINE}}`, `{{CHAT_BOOTSTRAP_LINE}}`, `{{COMMUNITY_BOOTSTRAP_LINE}}`, `{{TRANSCRIPTS_STEP_BODY}}`, `{{COMMUNITY_STEP_BODY}}`, `{{CHAT_STEP_BODY}}`, `{{ENABLED_CONNECTORS_LINE}}`, `{{MCP_BLOCK}}`):
   - Enabled connector → splice in the **Enabled** block from `connector-fragments.md`, then re-run placeholder substitution on any nested placeholders.
   - Disabled → drop the section header AND the placeholder. Strip remaining mentions of that connector's product name from Hard Rules, Failure Handling, and Report Schema.
4. **Derive path-split values** from `{{OPERATOR_BASE_PATH}}` and `{{PROFILE_BASE_PATH_PATTERN}}` so MCP examples are correct:
   - `{{OPERATOR_TASK_LIST_PATH}}` = `{{OPERATOR_BASE_PATH}}task-list/Tasks.md`
   - `{{OPERATOR_TASK_LIST_FOLDER}}` and `{{OPERATOR_TASK_LIST_SUBPATH}}`
   - `{{OPERATOR_REPORT_PATH_PATTERN}}` = `{{OPERATOR_BASE_PATH}}Daily/{YYYY-MM-DD}-daily.md`
   - `{{PROFILE_DAILY_PATH_PATTERN}}`, `{{PROFILE_DAILY_FOLDER}}`, `{{PROFILE_DAILY_PATH_FORMAT}}`, `{{PROFILE_DAILY_PATH_EXAMPLE}}`, `{{PROFILE_DAILY_SUBPATH_EXAMPLE}}`
5. Sanity pass: scan the rendered output for any `{{...}}` strings. If any remain, fix or flag to the user before saving.

Show the user a short preview (title, cadence line, team scope, the rendered MCP block) and ask one yes/no: "Save it?"

---

## Phase 3 — Save

If yes:

- Use the `Write` tool against the local filesystem.
- Path: `{{OPERATOR_BASE_PATH}}operator-prompt.md` resolved relative to the cwd (the vault root). Strip the leading `/` from `{{OPERATOR_BASE_PATH}}` when resolving locally.
- `Read` it back to confirm content present.

If the file already exists, ask before overwriting.

---

## Phase 4 — Schedule it (do not stop at "saved")

After the prompt is saved, **immediately invoke the `schedule` skill via the `Skill` tool**. Do not stop at "saved". Do not tell the user to run `/schedule create` themselves — wire the trigger now.

### Map cadence → cron

Convert `{{CADENCE_HUMAN}}` into a cron expression for the schedule skill:

| Cadence | Cron |
|---------|------|
| Hourly | `0 * * * *` |
| Every 4 hours | `0 */4 * * *` |
| Daily | `0 9 * * *` (9am local; ask if they want a different hour) |
| Custom | use what the user typed |

### Build the trigger payload

The `schedule` skill creates a remote trigger that runs Claude Code on a cron. Hand it:

- **Cron expression** — from the table above.
- **Working directory** — the cwd (the vault root). The Operator agent must run inside the vault so its file ops resolve correctly.
- **Prompt** — a short instruction: `"Run the Operator. Read and execute @{{OPERATOR_BASE_PATH}}operator-prompt.md exactly as written. One run = one report. Stop when done."`
- **Trigger name** — `{{OPERATOR_HANDLE}}-{{CADENCE_TAG}}` (e.g. `Vault-Operator-hourly`).
- **Description** — `"{{OPERATOR_NAME}} — {{CADENCE_HUMAN}}"`.

### Invoke the schedule skill

Call the `Skill` tool with `skill: "schedule"` and pass the args described above. Let the schedule skill do its own confirmation flow with the user (timezone, confirm cron, etc.) — it owns that interaction.

If the schedule skill is not installed in the user's environment, fall back to a clear text instruction with the exact cron expression and prompt to paste. Do not pretend the trigger is wired when it isn't.

### After the schedule skill returns

Tell the user, in one short paragraph:

> Operator prompt saved to `{{OPERATOR_BASE_PATH}}operator-prompt.md` and scheduled `{{CADENCE_HUMAN}}` (cron `{cron}`). First run will fire on the next tick. Manage the trigger anytime with `/schedule list` or `/schedule update`.

Stop. Do not propose other follow-ups.

---

## Hard rules for this skill

- **Discovery first.** Read `Context/` and `CLAUDE.md` before asking anything. Never ask for a value the vault already contains.
- **Local-first for vault content.** Use `Glob`, `Read`, and `Write` against the local filesystem for everything except connector probes. Vault MCP is only used at runtime by the rendered Operator agent, OR briefly during Phase 1 Q2 as a *live probe* to confirm the MCP is wired and authenticated.
- **Probe, don't ask.** For Q2 (connectors), inspect available tools in the session and run a read-only probe per connector. Never ask the user "do you have Slack?" — detect it.
- **Always finish by scheduling.** Phase 4 is mandatory. Save → invoke the `schedule` skill in the same run. Do not stop at "saved" and tell the user to schedule it themselves.
- **Never modify `CLAUDE.md`.** The Operator owns that file at runtime, not the builder.
- **Never `mv` or `rm` a synced note, at build time or in the rendered prompt.** Moves and renames go through `move_note` / `move_folder`, or they become a flagged task for a human. A shell move silently costs the note its `doc_id`, its history and its share settings.
- **Never touch `.context/`, `.git`, or `attachments/`** in discovery, render, or the rendered Operator's own file sweeps.
- **Strip disabled connectors fully.** Vault + Fireflies only? `Slack` and `Circle` should not appear anywhere in the rendered prompt.
- **One sanity pass for `{{` after render.** Catch unfilled placeholders before saving.
- **Default to defaults.** Don't pester for individual budget fields when the user picked "Defaults".
