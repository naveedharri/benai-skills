---
name: agentic-os-standalone
description: Set up an agentic OS as a standalone Next.js web dashboard — wired to the Claude Agent SDK plus up to 7 live MCP integrations (Circle community, Fireflies meetings, YouTube/VidIQ, Unipile LinkedIn DMs, Apify Twitter/X, Reddit), per-profile views, a button-bar of actions, snapshot-style data refreshes, and an optional Railway deploy with HTTP basic auth and a persistent volume. A real web app — runs locally or live. Use when the user says "set up a standalone agentic OS", "build an MCP-powered web dashboard", "spin up my AI ops dashboard", "deploy an AI dashboard to Railway", "give me a web version of the dashboard", or asks to personalize a web dashboard previously created with this skill.
allowed-tools: Bash, Read, Write, Edit, AskUserQuestion
---

# Agentic OS — Standalone web dashboard

Packages a Next.js 14 dashboard wired to the Claude Agent SDK + up to 7 platform integrations, plus an optional Railway deployment path. The template ships as `references/standalone/template.tar.gz` (packed because the Next.js dynamic-route folders use `[name]`/`[id]` paths that some plugin installers reject — extract it before use, see Step 3) and contains no secrets. Substitutions and live credential probes are the skill's job.

The dashboard's conceptual model: a per-profile dashboard, a button-bar of actions, and snapshot-style data refreshes — backed by JSON snapshots and deployable as a real web app.

> Want a markdown-native dashboard inside an existing Obsidian vault with no server instead? That's the Obsidian route — use the `agentic-os-obsidian` skill.

## Audience

The user is a **founder, operator, or marketer** — NOT a developer. Keep language plain. Never say "MCP", "snapshot prompt", "stdio transport", "TypeScript type" out loud. Say "platform", "data refresh", "your YouTube channel", "the dashboard's settings file".

Internally you still operate on those technical concepts. The user just shouldn't have to read jargon.

## What you produce

By the end the user has:

1. A new project folder at the path they chose, customized for their org and team.
2. Every integration they wanted connected AND probed (a real test call landed).
3. The dashboard running locally on http://localhost:3015, OR live on a Railway URL with HTTP basic auth.
4. A summary of what works, what they deferred, and how to add the deferred ones later.
5. **An iteration loop after first-run** — the skill keeps going to help them personalize tabs, rename things, change what each refresh pulls, swap colors, add new sections.

## Pre-flight (collect credentials BEFORE asking discovery questions)

Two keys gate everything else. Get them upfront so the user isn't surprised mid-flow:

1. **Anthropic API key.** Required. Powers every refresh. "Head to console.anthropic.com → API Keys → create one and paste it here." Store as `ANTHROPIC_API_KEY`.
2. **Railway token (only if deploying today).** Ask: "Do you want to put this online today, or just try it on your laptop first?" If online: have them run `railway login` in their own terminal (browser flow), then `railway whoami` to confirm. Don't store the token — Railway's CLI keeps it locally.

If they don't have the Anthropic key yet, pause here and wait. Don't keep going.

## Step 1 — Plain-language discovery

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

## Step 2 — Per-platform credentials + live probe

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

## Step 3 — Generate the project

1. Extract the bundled template, then copy it to the target directory. The template is packed as `references/standalone/template.tar.gz`:
   ```bash
   mkdir -p "<target-dir>"
   tar -xzf "$SKILL_DIR/references/standalone/template.tar.gz" -C "$SKILL_DIR/references/standalone"  # creates references/standalone/template/ if not already extracted
   cp -R "$SKILL_DIR/references/standalone/template/." "<target-dir>/"
   ```
   Skip `.DS_Store`, `node_modules`, `.next`, `.runs` when copying.
2. Substitute three placeholders in the copy:
   - `{{ORG_NAME}}` → display name
   - `{{PROJECT_SLUG}}` → kebab-case slug (for `package.json`)
   - `{{PROFILES_JSON}}` → JSON literal like `["Sarah", "Marcus"] as const`
   Files known to contain placeholders: `lib/config.ts`, `package.json`, `middleware.ts`, `app/page.tsx`, `app/layout.tsx`, `app/overview/page.tsx`, `components/views/team/index.tsx`.
3. Write `.env.local` from `.env.example`, populated with everything collected so far. Leave blank lines for any deferred platforms — the dashboard skips them gracefully.
4. Generate a basic-auth password: `openssl rand -hex 12`. Set `BASIC_AUTH_USER=<their first name lowercased>` and `BASIC_AUTH_PASS=<random>`. If they're only running locally and don't want auth, leave both blank.
5. Tell them: "Drop a square JPG named `<Name>.jpg` in `public/avatars/` for each teammate" — show the path. If they don't, the UI falls back to initials.
6. `cd` in and `npm install` (Node 20+).

## Step 4 — Local first-run

Run `npm run dev`. Wait for "Ready". Open http://localhost:3015.
- If they set basic auth, browser will prompt — give them the password.
- Show them the team's profile pages already work (`/profile/<Name>`).
- Click **Refresh** on one tab (Community or Comms — whatever they connected). Wait 2-5 minutes. Watch for completion.
- Confirm data lands.

## Step 5 — Railway deploy (only if asked in pre-flight)

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

## Step 6 — Personalize (THIS IS NOT OPTIONAL — KEEP GOING)

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

## Step 7 — Hand off

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

## What this route is NOT

- Not a no-code builder. The result is a real Next.js codebase the user owns.
- Not opinionated about which platforms — 1 or 7 MCPs both work.
- Not authenticated beyond HTTP basic auth. For SSO they'd need to add NextAuth or proxy behind Cloudflare Access. Call this out if they ask.
- Not a substitute for `references/standalone/RAILWAY.md` — point them at it for deploy details rather than re-typing everything.

## Re-invocation behavior

If invoked on an existing install (detect via `test -f .env.local && test -d app/`), offer to re-run a specific step rather than a full reinstall — most often a return to Step 6 (personalize) or Step 2 (add a new platform's credentials + probe).
