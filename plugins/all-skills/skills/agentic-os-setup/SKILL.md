---
name: agentic-os-setup
description: Set up an agentic OS — either inside an Obsidian vault (bundled command-center dashboard, 5 auto-installed plugins, button bar wired to Claude prompts) OR as a standalone Next.js web dashboard with live MCP integrations (Circle, Fireflies, YouTube/VidIQ, Unipile LinkedIn DMs, Apify Twitter, Reddit), Anthropic Agent SDK refreshes, and optional Railway deploy. Use when the user says "set up agentic OS", "install command center", "bootstrap a personal AI dashboard", "build a vault dashboard", "spin up an MCP-powered dashboard", "deploy an AI ops dashboard", "give me my own version of the dashboard", "set up my second brain dashboard", or asks to personalize a dashboard previously created with this skill. Skill asks one routing question first — Obsidian or standalone — then runs the matching full flow.
allowed-tools: Bash, Read, Write, Edit, AskUserQuestion
---

# Agentic OS Setup

This skill installs an agentic OS for the user. There are two routes:

- **Route A — Obsidian vault.** Installs a configurable command-center dashboard *inside* an existing Obsidian vault. Bundles and side-loads 5 plugins (Dataview, CustomJS, Shell-commands, Terminal, Homepage). Home + per-profile + Vault Overview pages. Button bar wired to user-defined Claude prompts via Shell-commands. Markdown-based, no servers.
- **Route B — Standalone web dashboard.** Bootstraps a Next.js 14 dashboard wired to the Claude Agent SDK plus up to 7 MCP integrations (Circle community, Fireflies meetings, YouTube/VidIQ, Unipile LinkedIn DMs, Apify Twitter/X, Reddit). Optional Railway deploy with HTTP basic auth and a persistent volume. Real web app, can run locally or live.

Both routes share the same conceptual model: a per-profile dashboard, a button-bar of actions, and snapshot-style data refreshes. They differ in surface (markdown vs Next.js), data shape (frontmatter vs JSON snapshots), and deployment (none vs Railway).

## Step 0 — Route question (ALWAYS ASK FIRST)

Before anything else, use `AskUserQuestion` to route:

> "Where do you want this set up?"
> - **Inside an Obsidian vault** — command-center dashboard rendered via Dataview + CustomJS. Best if you already use Obsidian, want markdown-native, no server.
> - **As a standalone web dashboard** — Next.js app with live MCP integrations and optional Railway deploy. Best if you want a real web URL, live API integrations, multi-user access via HTTP basic auth.

Header: "Surface". multiSelect: false. Don't pre-select. Don't proceed until answered.

Then execute the matching route below.

---

# Route A — Obsidian vault

Use this entire section when the user picks "Inside an Obsidian vault" in Step 0.

Installs a configurable command-center dashboard in any Obsidian vault. Home + per-profile + Vault Overview pages, KPI cards, sparklines, heatmap, task rollup, recent-files lists, and a button bar wired to user-defined Claude prompts via the Shell-commands plugin. All 5 required plugins are bundled and auto-enabled — the user only has to restart Obsidian.

## A.1 What gets installed

```
{vault}/
├── Dashboard/
│   ├── Home.md                       # Team-wide dashboard
│   ├── Vault-Overview.md             # Top-level vault health view
│   ├── {Profile}.md                  # One per configured profile
│   ├── Setup.md                      # In-vault setup reference
│   ├── CLAUDE.md                     # AI routing rules for this folder
│   ├── components/dashboard.js       # The renderer (CONFIG substituted)
│   └── lib/frappe-charts.min.js
└── .obsidian/
    ├── snippets/command-center.css   # Brand-styled CSS (enabled)
    ├── plugins/dataview/             # Side-loaded, enabled
    ├── plugins/customjs/             # Side-loaded, enabled
    ├── plugins/obsidian-shellcommands/  # Side-loaded, enabled, aliases pre-registered
    ├── plugins/terminal/             # Side-loaded, enabled, "Claude" profile configured
    ├── plugins/homepage/             # Side-loaded, enabled, points to Dashboard/Home
    ├── community-plugins.json        # Union'd with the 5 plugin IDs
    └── appearance.json               # CSS snippet enabled
```

## A.2 Pre-flight checks

```bash
test -d .obsidian && echo "vault confirmed" || (echo "NOT A VAULT — cd into your Obsidian vault first" && exit 1)
test -d Dashboard && echo "DASHBOARD EXISTS — ask user before overwriting"
```

If `Dashboard/` exists, ask: cancel / install into `Dashboard-new/` / overwrite (require explicit "yes overwrite").

## A.3 Interview (always run before installing)

Use `AskUserQuestion` for each. Capture answers into variables for substitution into CONFIG.

### Q1. Organization name
"What's your organization or personal brand name? (Used in folder paths and dashboard header. Short — one word ideal.)"
Default if skipped: `MyOrg`. Variable: `ORG_NAME`.

### Q2. Brand label + subtitle
"What should the dashboard show as its title?" Two parts:
- Brand label (header text, e.g. "Acme"). Defaults to `ORG_NAME`. Variable: `BRAND_LABEL`.
- Brand subtitle (small text after the label, e.g. "Agentic OS", "Command Center"). Default `Command Center`. Variable: `BRAND_SUB`.

### Q3. Profile list
"Who's on the team? List each profile name on a separate line. Use lowercase or capitalized — must match the folder names you'll use in step 4. For a solo vault, just one name."
Parse into array. Variable: `PROFILES` (JSON array). The first is `DEFAULT_PROFILE`.

### Q4. Profile folder pattern
"Where do you keep per-profile data?" Show 4 options via AskUserQuestion:
- `Team/{ORG}/Profiles/{name}` (recommended for orgs — matches `Team/Acme/Profiles/Alex`)
- `Team/{name}` (flat team layout)
- `People/{name}` (alternative naming)
- Custom — ask user to type the exact pattern. Must contain `{name}`. `{ORG}` is optional.

Variable: `PROFILE_FOLDER_PATTERN`. Verify each `PROFILES[i]` folder exists (warn if missing — installer will still write the dashboard; profile folders just won't have data yet).

### Q5. Daily / Tasks / Snapshots subpaths
Three quick AskUserQuestion calls (each with sensible defaults):
- **Daily subpath** within each profile folder. Default `Daily`. Empty disables. Variable: `DAILY_SUBPATH`.
- **Tasks subpath** (Task Board plugin uses `task-list`). Default `task-list`. Empty disables the task widget. Variable: `TASKS_SUBPATH`.
- **Snapshots subpath** for JSON files the dashboard reads. Default `snapshots`. Variable: `SNAPSHOTS_SUBPATH`.

Also: **Root daily path** for team-wide rollups. Default `Daily`. Variable: `ROOT_DAILY_PATH`.

### Q6. Pages to ship
Which dashboard pages? MultiSelect:
- Home (team rollup) — always recommended
- Per-profile pages (one per Q3 profile)
- Vault Overview (top-level folder health)
- Custom — user names extra pages

Variable: `PAGES` (array). Installer creates one `.md` per page.

### Q7. Overview folders (only if Vault Overview is in PAGES)
"Name 3-5 top-level folders to show on the Vault Overview page. For each: folder path, one-line description, optional CLAUDE.md path (or empty)."
Variable: `OVERVIEW_FOLDERS` (array of `[path, description, claude_path]`).
Defaults if skipped: detect `Projects/`, `Resources/`, `Intelligence/`, `Departments/`, `Teams/`, `Daily/` if present.

### Q8. Buttons (with Claude prompts)
"What action buttons should the dashboard expose? For each button: label (short), icon (emoji or empty), scope (team / profile / both), and a Claude prompt (the text passed to `claude -p '...'`). Use `{profile}` in the prompt to interpolate the current profile name. Add as many as you want; defaults are zero."

Suggest these as starter buttons (user can accept/reject each):
- **Morning brief** (☀️, both, prompt: `"Read today's daily for {profile} if it exists. Write a 5-line morning brief covering open loops, top priorities, and energy level. Append under a '## Morning brief' heading."`)
- **New daily** (📝, both, prompt: `"Create today's daily note at <DAILY_PATH>/$(date +%Y-%m-%d).md with standard frontmatter and section headings. Don't overwrite if it exists."`)
- **Launch Claude** (💬, both, `cmd: terminal:open-terminal.claude.root`) — wired via Terminal plugin "Claude" profile, NOT a shell-command
- **Reload** (🔄, both, `cmd: app:reload`)
- **Settings** (⚙️, both, `cmd: app:open-settings`)

For every button with a `prompt`, the installer generates a shell-commands alias `shell-command-<kebab-label>` and a `cmd: obsidian-shellcommands:shell-command-<alias>`.

Variable: `BUTTONS` (object with `team` and `profile` arrays).

### Q9. Brand colors
Two hex colors. Defaults: primary `#020309`, canvas `#FAF3E3`. Substitute into CONFIG.COLORS and the CSS snippet variables at the top of `command-center.css`.

### Q10. Brand mark (optional)
"Path to a PNG/SVG logo to show in the dashboard header? Leave blank for no logo."
If provided, copy to `Dashboard/lib/brand-mark.png` and set `BRAND_MARK_PATH` to that. Default empty.

## A.4 Critical constraints — read before editing the renderer template

These two pitfalls broke real installs. Treat them as load-bearing.

### 1. CustomJS file shape: ONE class expression, period.

CustomJS evaluates each `.js` file as `eval(\`(${file_contents})\`)` — it wraps the entire file in parentheses to coerce it into a single expression and pull the class out. This means:

- ✅ Allowed: a single `class dashboard { ... }` declaration. Comments before and after are fine.
- ❌ NOT allowed: a top-level `const CONFIG = {...}` or any other statement before/after the class. `(const CONFIG = ...)` is a syntax error because `const` is a statement, not an expression. CustomJS surfaces this as `SyntaxError: ParseError: Unexpected token`.

In `references/obsidian/dashboard-template.js`, CONFIG lives as a `static CONFIG = { ... }` field at the top of the class body. All code references it as `this.constructor.CONFIG.X` (not bare `CONFIG.X`). Preserve that pattern when editing — if you re-introduce a top-level `const`, the dashboard renders as a blank page with no console error from the dataviewjs block.

Smoke test before shipping any renderer change:
```bash
node -e "$(cat dashboard-template.js | sed 's/__[A-Z_]*__/null/g' | python3 -c 'import sys; print(f\"({sys.stdin.read()})\");')"
```
If that fails with a SyntaxError, the file violates the constraint. Fix before substitution.

### 2. Plugin data.json keys are NOT what you'd guess.

Always cross-reference the keys against a known-working vault — do not invent them from the plugin's UI labels. Confirmed-correct keys:

| Plugin | Key | Wrong-but-tempting alternative |
|---|---|---|
| **customjs** | `jsFolder` (and `jsFiles: ""`) | ❌ `folder` (silently ignored — plugin scans nothing) |
| **dataview** | `enableDataviewJs`, `enableInlineDataviewJs`, `enableInlineDataview` | (these are correct) |
| **homepage** | `homepages` (plural, object keyed by display name) → `.value` | ❌ `homepage` (singular) |
| **terminal** | `profiles.claude.executable` (absolute path) | ❌ relying on `claude` in PATH (Obsidian doesn't inherit login shell PATH) |
| **obsidian-shellcommands** | `shell_commands[shell-command-<alias>].shell_command` | ❌ flat `commands[]` array |

When in doubt, look at a known-working install's `data.json` before writing the install flow.

## A.5 Install execution

After the interview, do these in order. Resolve `$SKILL_DIR` from the skill's own path. All references live under `$SKILL_DIR/references/obsidian/`.

### Step 1. Create folder structure
```bash
mkdir -p Dashboard/components Dashboard/lib Dashboard/snapshots
mkdir -p .obsidian/snippets .obsidian/plugins
```

### Step 2. Substitute CONFIG and write dashboard.js
Read `$SKILL_DIR/references/obsidian/dashboard-template.js`. Substitute each placeholder with the captured value:

| Placeholder | Value |
|---|---|
| `__ORG_NAME__` | `ORG_NAME` |
| `__BRAND_LABEL__` | `BRAND_LABEL` |
| `__BRAND_SUB__` | `BRAND_SUB` |
| `__BRAND_MARK_PATH__` | `BRAND_MARK_PATH` (or `""`) |
| `__PROFILES_JSON__` | `JSON.stringify(PROFILES)` |
| `__DEFAULT_PROFILE__` | `DEFAULT_PROFILE` |
| `__PROFILE_FOLDER_PATTERN__` | `PROFILE_FOLDER_PATTERN` |
| `__DAILY_SUBPATH__` | `DAILY_SUBPATH` |
| `__TASKS_SUBPATH__` | `TASKS_SUBPATH` |
| `__SNAPSHOTS_SUBPATH__` | `SNAPSHOTS_SUBPATH` |
| `__ROOT_DAILY_PATH__` | `ROOT_DAILY_PATH` |
| `__OVERVIEW_FOLDERS_JSON__` | `JSON.stringify(OVERVIEW_FOLDERS)` |
| `__BUTTONS_JSON__` | `JSON.stringify(BUTTONS)` |
| `__CLAUDE_PROMPTS_JSON__` | `"{}"` (reserved for later use) |
| `__SKILLS_FOLDER__` | optional skills folder path (e.g. `Plugins/skills`); empty hides the Vault Overview Skills section |
| `__SKILL_GROUPS_JSON__` | `"{}"` (or `JSON.stringify({"Group": ["skill-a", "skill-b"]})`) |
| `__PROJECT_CATEGORIES_JSON__` | `"[]"` (or `JSON.stringify(["Agency","Content"])` if user has `Projects/<Cat>/` subfolders) |
| `__CONNECTORS_JSON__` | `"[]"` (or `JSON.stringify([["Slack","Team comms"], ...])`) |
| `__CHEATSHEET_JSON__` | `"[]"` (or `JSON.stringify([["Meeting note","Intelligence/meetings/YYYY-MM-DD-{Title}.md"], ...])`) |

Ask the user about these five optional Vault Overview fields only if they chose to ship the Vault Overview page. All accept empty defaults.

Write the result to `Dashboard/components/dashboard.js`. **Verify with both checks before declaring success:**
```bash
# 1. Plain JS parse
node --check Dashboard/components/dashboard.js || { echo "FATAL: dashboard.js has a syntax error"; exit 1; }

# 2. CustomJS-wrapped parse — catches the 'top-level const' pitfall (see Critical Constraints)
node -e "try { new Function('return (' + require('fs').readFileSync('Dashboard/components/dashboard.js','utf8') + ')'); console.log('CustomJS wrap OK'); } catch (e) { console.error('FATAL — CustomJS will reject this file:', e.message); process.exit(1); }"
```
Both must pass. If check #2 fails but #1 passes, you've reintroduced a top-level statement before the class.

### Step 3. Copy static assets
```bash
cp "$SKILL_DIR/references/obsidian/frappe-charts.min.js" Dashboard/lib/
```
If a brand mark was provided in Q10, copy it into `Dashboard/lib/`.

### Step 4. Generate dashboard MD pages
For each page in `PAGES`, read the corresponding template and substitute placeholders:

- `references/obsidian/home-template.md` → `Dashboard/Home.md`
- `references/obsidian/vault-overview-template.md` → `Dashboard/Vault-Overview.md`
- For each profile in `PROFILES`: `references/obsidian/profile-template.md` → `Dashboard/{Profile}.md`, substitute `{{PROFILE_NAME}}`

### Step 5. Setup + CLAUDE docs
- `references/obsidian/setup-template.md` → `Dashboard/Setup.md`, substitute `{{BRAND_LABEL}}`, `{{PAGES_LINKS}}`
- `references/obsidian/claude-md-template.md` → `Dashboard/CLAUDE.md`, substitute `{{ORG_NAME}}`, `{{PROFILE_FOLDER_PATTERN}}`

### Step 6. Side-load plugins
For each of `dataview`, `customjs`, `obsidian-shellcommands`, `terminal`, `homepage`:
```bash
if [ ! -d ".obsidian/plugins/$ID" ]; then
  mkdir -p ".obsidian/plugins/$ID"
  cp "$SKILL_DIR/references/obsidian/plugins/$ID/"* ".obsidian/plugins/$ID/"
fi
```
The `if` guard preserves any newer version the user already has.

### Step 7. Plugin data.json files

**dataview**:
```json
{"enableDataviewJs": true, "enableInlineDataviewJs": true, "enableInlineDataview": true}
```

**customjs**: The key is `jsFolder` (NOT `folder`).
```json
{"jsFiles": "", "jsFolder": "Dashboard/components", "startupScriptNames": [], "registeredInvocableScriptNames": []}
```

**obsidian-shellcommands**: For each button in `BUTTONS.team` and `BUTTONS.profile` that has a `prompt`, generate one shell-commands entry:
```json
{
  "shell_commands": {
    "shell-command-<alias>": {
      "shell_command": "cd \"{{vault_dir}}\" && claude -p \"<escaped-prompt>\" --dangerously-skip-permissions",
      "alias": "<alias>",
      "platform_specific_commands": {"default": "use this"},
      "shells": {},
      "events": {},
      "debounce": null,
      "execution_notification_mode": "disabled",
      "output_channels": {"stdout": "notification", "stderr": "notification-bigger"},
      "output_handlers": {},
      "output_wrappers": {"stdout": null, "stderr": null},
      "command_palette_availability": "enabled"
    }
  },
  "preferences": {"debug": false},
  "settings_version": "0.23.0"
}
```
Replace `<alias>` with kebab-cased label. Escape double quotes in the prompt.

**terminal**: Cross-platform "claude" integrated profile.

**Resolving the `claude` binary path** — #1 source of Launch Claude button failures. Obsidian's Terminal plugin spawns processes without the user's login shell, so PATH is not enough. Need absolute path.

Probe in this order, take the first hit:
```bash
CLAUDE_BIN="$(zsh -ic 'command -v claude' 2>/dev/null || bash -ic 'command -v claude' 2>/dev/null || command -v claude)"
if [ -z "$CLAUDE_BIN" ] || [ ! -x "$CLAUDE_BIN" ]; then
  for candidate in \
    "$HOME/.local/bin/claude" \
    "$HOME/.claude/local/claude" \
    "/opt/homebrew/bin/claude" \
    "/usr/local/bin/claude" \
    "$HOME/.npm-global/bin/claude" \
    "$HOME/.volta/bin/claude" \
    "/usr/bin/claude"; do
    [ -x "$candidate" ] && CLAUDE_BIN="$candidate" && break
  done
fi
if [ -n "$CLAUDE_BIN" ] && "$CLAUDE_BIN" --version >/dev/null 2>&1; then
  echo "resolved: $CLAUDE_BIN"
else
  CLAUDE_BIN=""
fi
```

If empty, fall through to `AskUserQuestion` asking for the full path or to skip. If skipped, **omit the `claude` profile entirely** rather than ship a broken one.

```json
{
  "profiles": {
    "claude": {
      "args": ["--dangerously-skip-permissions"],
      "executable": "<resolved absolute path>",
      "followTheme": true,
      "name": "Claude",
      "platforms": {"darwin": true, "linux": true, "win32": true},
      "restoreHistory": false,
      "rightClickAction": "copyPaste",
      "successExitCodes": ["0", "SIGINT", "SIGTERM"],
      "terminalOptions": {"documentOverride": null},
      "type": "integrated",
      "useWin32Conhost": true
    }
  },
  "addToCommand": true,
  "focusOnNewInstance": true,
  "newInstanceBehavior": "newHorizontalSplit"
}
```

**Print the resolved path** to the user in the final summary (`Launch Claude wired to: /opt/homebrew/bin/claude`). **Verify before declaring complete:** `test -x "$CLAUDE_BIN"` and `"$CLAUDE_BIN" --version`. If a user later sees a Python FileNotFoundError stack from the terminal pane, the executable moved — recovery: re-run `which claude`, edit `.obsidian/plugins/terminal/data.json` → `profiles.claude.executable`, reload Obsidian. Skill should offer to rewire just this step if re-invoked on an existing install.

**homepage**:
```json
{
  "version": 4,
  "homepages": {
    "Main Homepage": {
      "value": "Dashboard/Home",
      "kind": "File",
      "openOnStartup": true,
      "openMode": "Replace all open notes",
      "manualOpenMode": "Replace all open notes",
      "view": "Reading view",
      "revertView": true,
      "openWhenEmpty": true,
      "refreshDataview": true,
      "autoCreate": false,
      "autoScroll": false,
      "pin": false,
      "commands": [],
      "alwaysApply": false,
      "hideReleaseNotes": false
    }
  },
  "separateMobile": false
}
```

### Step 8. Enable plugins in community-plugins.json
Read `.obsidian/community-plugins.json` (create `[]` if missing). Backup to `.bak`. Union in `["dataview", "customjs", "obsidian-shellcommands", "terminal", "homepage"]`. Preserve existing entries. Write back.

### Step 9. Enable CSS snippet
Read `.obsidian/appearance.json` (create `{}` if missing). Backup to `.bak`. Read `references/obsidian/command-center.css`, substitute color placeholders, write to `.obsidian/snippets/command-center.css`. Set `enabledCssSnippets` to union with `["command-center"]`.

### Step 10. Print the one remaining manual step
```
Done. The dashboard, all 5 plugins, the Claude terminal profile, and the homepage are configured.

ONE final step Obsidian only picks up on launch:
  1. Quit Obsidian fully (Cmd/Ctrl + Q — not just close the window).
  2. Reopen the vault.
  3. Obsidian will ask you to "Trust" each plugin. Click Trust for all 5.
  4. Open Dashboard/Home — it should render immediately.

If a button doesn't fire, open Settings → Shell commands and confirm each alias matches the one shown in the button's tooltip. The dashboard's developer console (Cmd/Ctrl + Opt/Alt + I) logs every command attempt.
```

## A.6 Don't do (Route A)

- Do not modify user content outside `Dashboard/` and `.obsidian/`. The dashboard is read-only on `Daily/`, `Team/`, `Tasks/`, etc.
- Do not overwrite existing `.obsidian/plugins/<id>/` installs — only side-load when missing. The user may have a newer version.
- Do not use any branded/personal names ("Ben", "BenAI", specific people). All identifiers come from the interview.
- Do not auto-fetch latest plugin versions at install time — bundled versions are pinned. To refresh, re-run the curl commands.

## A.7 Route A file templates summary

| Template | Goes to | Substitutes |
|---|---|---|
| `obsidian/dashboard-template.js` | `Dashboard/components/dashboard.js` | All `__*__` placeholders in CONFIG |
| `obsidian/home-template.md` | `Dashboard/Home.md` | `{{BRAND_LABEL}}` |
| `obsidian/vault-overview-template.md` | `Dashboard/Vault-Overview.md` | `{{BRAND_LABEL}}` |
| `obsidian/profile-template.md` | `Dashboard/{Profile}.md` | `{{PROFILE_NAME}}` |
| `obsidian/setup-template.md` | `Dashboard/Setup.md` | `{{BRAND_LABEL}}` |
| `obsidian/claude-md-template.md` | `Dashboard/CLAUDE.md` | `{{ORG_NAME}}`, `{{PROFILE_FOLDER_PATTERN}}` |
| `obsidian/command-center.css` | `.obsidian/snippets/command-center.css` | `--cc-primary`, `--cc-canvas` color vars |
| `obsidian/frappe-charts.min.js` | `Dashboard/lib/frappe-charts.min.js` | none |

Bundled plugin folders under `references/obsidian/plugins/` are copied verbatim into `.obsidian/plugins/<id>/`.

---

# Route B — Standalone web dashboard

Use this entire section when the user picks "As a standalone web dashboard" in Step 0.

This route packages a Next.js 14 dashboard wired to the Claude Agent SDK + up to 7 platform integrations, plus an optional Railway deployment path. The template lives in `references/standalone/template/` and ships with no secrets. Substitutions and live credential probes are the skill's job.

## B.1 Audience

The user is a **founder, operator, or marketer** — NOT a developer. Keep language plain. Never say "MCP", "snapshot prompt", "stdio transport", "TypeScript type" out loud. Say "platform", "data refresh", "your YouTube channel", "the dashboard's settings file".

Internally you still operate on those technical concepts. The user just shouldn't have to read jargon.

## B.2 What you produce

By the end the user has:

1. A new project folder at the path they chose, customized for their org and team.
2. Every integration they wanted connected AND probed (a real test call landed).
3. The dashboard running locally on http://localhost:3015, OR live on a Railway URL with HTTP basic auth.
4. A summary of what works, what they deferred, and how to add the deferred ones later.
5. **An iteration loop after first-run** — the skill keeps going to help them personalize tabs, rename things, change what each refresh pulls, swap colors, add new sections.

## B.3 Pre-flight (collect credentials BEFORE asking discovery questions)

Two keys gate everything else. Get them upfront so the user isn't surprised mid-flow:

1. **Anthropic API key.** Required. Powers every refresh. "Head to console.anthropic.com → API Keys → create one and paste it here." Store as `ANTHROPIC_API_KEY`.
2. **Railway token (only if deploying today).** Ask: "Do you want to put this online today, or just try it on your laptop first?" If online: have them run `railway login` in their own terminal (browser flow), then `railway whoami` to confirm. Don't store the token — Railway's CLI keeps it locally.

If they don't have the Anthropic key yet, pause here and wait. Don't keep going.

## B.4 Step 1 — Plain-language discovery

Ask these in plain English. Use AskUserQuestion when the options are clear.

1. **"What should we call this thing?"**
   → Display name (e.g. "Acme", "Sarah's Brain"). Show them what the kebab-case slug will be (e.g. `acme-os`) and let them override.
2. **"Where on your computer should I put it?"**
   → Default: `~/Projects/<slug>`. Confirm before writing.
3. **"Who's on your team?"**
   → Free text: comma-separated first names, 1-8 of them. Example: "Sarah, Marcus, Priya". The first name becomes the "main" view (gets a synthesis dashboard); everyone else gets a standard view. If they're solo, one name is fine. Tell them they can drop a profile picture for each person later.
4. **"Which platforms do you want me to pull from?"**
   → Multi-select. Use these plain labels (map to MCPs internally — never show MCP names):

   | Label to show user | Maps to (internal) | What it does |
   |---|---|---|
   | "Your Circle community" | `circle-community` | Pulls posts, comments, DMs, member stats |
   | "Your meeting notes (Fireflies)" | `fireflies` | Pulls recent meeting transcripts + summaries |
   | "Your YouTube channel" | `vidiq` + `youtube` | Channel stats, recent videos, comments |
   | "Your LinkedIn DMs (Unipile)" | `unipile` | Unread DMs, draft replies, send button |
   | "Twitter/X trend scanning" | `apify` | Tracks accounts you care about |
   | "Reddit trend scanning" | `reddit` | Subreddit pulls |

   Tell them they can skip any of these and add them later. Skipping a platform just leaves that tab empty in the dashboard.

## B.5 Step 2 — Per-platform credentials + live probe

For EACH platform they selected, collect the credentials (using plain language) THEN immediately probe to confirm it works. Don't batch — do one at a time so the user can fix issues as they come up.

The probe pattern: write a temp `.mcp.json` with just that one server, then run `node scripts/probe-mcp.mjs <server-name>` (the template ships this script). It calls one cheap read-only tool on the MCP and exits 0/1. If it fails, surface the actual error from the JSON output and re-ask for the credential.

### Per-platform credential questions (plain wording)

- **Circle community:**
  - "What's the API key for your Circle MCP server?" → `MCP_CIRCLE_KEY`
  - "What email do you use to log into Circle?" → `CIRCLE_OWNER_EMAIL`
  - Probe: `probe-mcp.mjs circle-community`. If it fails on email, the dashboard still works for posts/comments; only DMs need the email.
- **Fireflies meeting notes:**
  - "What's your Fireflies API key? (fireflies.ai → Settings → Integrations → API)" → `MCP_FIREFLIES_KEY`
  - Probe: `probe-mcp.mjs fireflies`
- **YouTube channel:**
  - "What's your YouTube channel handle? (e.g. `@yourchannel`)" → `YOUTUBE_CHANNEL_HANDLE`
  - "Optionally, the channel ID (starts with `UC`)" → `YOUTUBE_CHANNEL_ID`
  - "Two API keys: one from Google Cloud Console for YouTube Data API, one from VidIQ. Paste them here:" → `MCP_YOUTUBE_API_KEY`, `MCP_VIDIQ_KEY`
  - Probe: `probe-mcp.mjs youtube vidiq`
- **LinkedIn DMs (Unipile):**
  - "What's your Unipile API key? (unipile.com → Settings → API)" → `MCP_UNIPILE_KEY`
  - "What's your Unipile tenant URL? (looks like `https://apiNN.unipile.com:NNNNN` in their dashboard)" → `UNIPILE_BASE_URL`
  - "Which LinkedIn account should I use? (Unipile gives each connected account an ID — pick the one you want monitored)" → `UNIPILE_LINKEDIN_ACCOUNT_ID`. Hint: you can list accounts via the probe and let the user pick.
  - Probe: `probe-mcp.mjs unipile`
- **Twitter/X scanning (Apify):**
  - "What's your Apify API token? (apify.com → Settings → Integrations)" → `MCP_APIFY_KEY`
  - Probe: `probe-mcp.mjs apify`
- **Reddit:**
  - "What's the URL of the Reddit MCP server you're using?" → `MCP_REDDIT_URL`
  - Probe: `probe-mcp.mjs reddit`

If a probe fails 2x, offer to skip that platform and continue. Don't loop forever.

## B.6 Step 3 — Generate the project

1. Recursively copy `references/standalone/template/` to the target directory. Skip `.DS_Store`, `node_modules`, `.next`, `.runs`.
2. Substitute three placeholders in the copy:
   - `{{ORG_NAME}}` → display name
   - `{{PROJECT_SLUG}}` → kebab-case slug (for `package.json`)
   - `{{PROFILES_JSON}}` → JSON literal like `["Sarah", "Marcus"] as const`
   Files known to contain placeholders: `lib/config.ts`, `package.json`, `middleware.ts`, `app/page.tsx`, `app/layout.tsx`, `app/overview/page.tsx`, `components/views/team/index.tsx`.
3. Write `.env.local` from `.env.example`, populated with everything collected so far. Leave blank lines for any deferred platforms — the dashboard skips them gracefully.
4. Generate a basic-auth password: `openssl rand -hex 12`. Set `BASIC_AUTH_USER=<their first name lowercased>` and `BASIC_AUTH_PASS=<random>`. If they're only running locally and don't want auth, leave both blank.
5. Tell them: "Drop a square JPG named `<Name>.jpg` in `public/avatars/` for each teammate" — show the path. If they don't, the UI falls back to initials.
6. `cd` in and `npm install` (Node 20+).

## B.7 Step 4 — Local first-run

Run `npm run dev`. Wait for "Ready". Open http://localhost:3015.
- If they set basic auth, browser will prompt — give them the password.
- Show them the team's profile pages already work (`/profile/<Name>`).
- Click **Refresh** on one tab (Community or Comms — whatever they connected). Wait 2-5 minutes. Watch for completion.
- Confirm data lands.

## B.8 Step 5 — Railway deploy (only if asked in pre-flight)

Full deploy walkthrough lives in `references/standalone/RAILWAY.md` — read it before starting. Key gotchas:

- `IS_SANDBOX=1` is required on Railway. Without it, every refresh fails immediately with "Claude Code process exited with code 1". Set this BEFORE the first deploy.
- `next` must be a recent patch. Railway blocks builds for known CVEs. If it fails, bump `next` per the error and run `npm install` to refresh `package-lock.json`.
- The volume mount path is `/app/data`. The included startup script symlinks `.runs/` and `public/data/` into it so data survives redeploys.
- `railway login` needs a real TTY — if you try to run it, you'll get "non-interactive mode". Have the user run it in their own terminal, then continue.

Commands the agent can drive directly (after the user has logged in):

```bash
railway init --name <project-slug> --workspace "<their workspace>"
railway add --service web
railway service web
# bulk-set every env var from .env.local + IS_SANDBOX=1
railway variables --set "KEY1=val1" --set "KEY2=val2" --skip-deploys
railway volume add --mount-path /app/data
railway up --ci --detach
railway domain
```

If `railway init` complains about multiple workspaces, list them with `railway list` and ask the user which one to use.

After deploy, sanity check: `curl -sI -u user:pass <url>/profile/<Name>` should return 200.

## B.9 Step 6 — Personalize (THIS IS NOT OPTIONAL — KEEP GOING)

After they've seen the dashboard load with real data, ask: **"What feels wrong or missing? I'll change it."**

The user is non-technical. They'll say things like:
- "The YouTube tab is useless for me, hide it."
- "Rename Comms to Inbox."
- "Track these Twitter accounts instead: @foo, @bar, @baz."
- "The blue is too cold, can it be warmer?"
- "Add a tab for Stripe revenue."
- "Default to the Inbox tab when I open my page."
- "Make the draft replies sound less corporate."
- "Add my designer Priya as a team member."

For every ask:

1. Look up the exact file + edit in `references/standalone/personalization.md` (it has recipes for the common cases).
2. Make the smallest possible change.
3. If they're on local dev, the change hot-reloads — tell them to refresh the browser. If they're on Railway, run `railway up --ci --detach` and wait for SUCCESS.
4. Confirm with them: "Open `/profile/<their name>` — does that look right?"
5. Loop. Don't stop after one change; ask "what else?"

Stop only when the user says they're done. End each session with:

```
Today's changes:
  - <change 1>
  - <change 2>

Anything you didn't get to that you want for next time?
```

Save that as a note so the next session can pick it up.

### Things to NOT do during personalization

- Don't restructure files preemptively. They asked for a rename — do the rename, not a refactor.
- Don't add new platforms during personalization. If they ask for a new integration, treat that as a return to Step 2 (collect credentials + probe).
- Don't push back on "trivial" asks. Color preferences, tab names, icon swaps — these are exactly what makes this their dashboard, not a template.

### When the ask is bigger than personalization.md covers

The dashboard is a real Next.js codebase. You can edit anything. Standard approach:

1. Locate the file by reading the structure (`app/`, `components/`, `lib/`).
2. Make the change.
3. Test it loads.
4. Add the new recipe to `personalization.md` after the fact so the next user gets it too.

## B.10 Step 7 — Hand off

Print a summary:

```
✓ Project at <path>
✓ Connected platforms: <list>  — all probed
~ Deferred platforms: <list>   — empty until you add keys to .env.local
✓ Local URL:   http://localhost:3015
✓ Live URL:    <railway url>   (basic auth: <user> / <pass>)
✓ Personalizations applied today: <list>

To customize later:
  - Re-trigger this skill, or just describe what you want — I keep the conversation context
  - npm run probe-mcps to re-test platform connectivity
  - references/standalone/personalization.md has the recipes for common changes
```

## B.11 What Route B is NOT

- Not a no-code builder. The result is a real Next.js codebase the user owns.
- Not opinionated about which platforms — 1 or 7 MCPs both work.
- Not authenticated beyond HTTP basic auth. For SSO they'd need to add NextAuth or proxy behind Cloudflare Access. Call this out if they ask.
- Not a substitute for `references/standalone/RAILWAY.md` — point them at it for deploy details rather than re-typing everything.

---

# Shared notes (both routes)

- **The skill ALWAYS asks Step 0 first.** Never assume route based on context. Even if the user names Obsidian or Next.js in the trigger, confirm via Step 0 — they may be ambiguous.
- **Re-invocation behavior.** If invoked on an existing install (either route), detect which one is present (`test -d Dashboard/components/dashboard.js` for Route A, `test -f .env.local && test -d app/` for Route B) and offer to re-run a specific step rather than full reinstall.
- **Never reference the other route during a route.** Once Step 0 routes to A, don't mention Route B (and vice versa). Keep the user focused.
