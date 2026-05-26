# Agentic OS — Web Dashboard

Personal/team operations dashboard powered by the Claude Agent SDK. Snapshots from Circle.so, Fireflies, YouTube/VidIQ, Apify, Reddit, and Unipile (LinkedIn) get pulled, synthesized into an inbox + intelligence view, and presented per-profile (team member).

## Stack

- Next.js 14 (App Router, TypeScript)
- `@anthropic-ai/claude-agent-sdk` running snapshot refreshes server-side
- MCP servers — Circle, Fireflies, VidIQ, Apify, Reddit, Unipile, YouTube — configured from environment variables at startup
- Optional Railway deploy with a persistent volume for `.runs/` + `public/data/`

## Quick start (local)

```bash
npm install
cp .env.example .env.local
# fill in ANTHROPIC_API_KEY and any MCP_*_KEY you have
npm run dev
# open http://localhost:3015
```

The dashboard reads snapshot JSON from `public/data/`. Snapshots start empty; click **Refresh** on each tab to populate them via the Agent SDK + MCPs.

## Configuration

### `lib/config.ts`

Hand-edited:

- `ORG_NAME` — appears in headers and prompts
- `PROFILES` — array of team member names. First entry is the primary profile and gets the synthesis-leaning overview. Each gets `/profile/<Name>` and an avatar at `public/avatars/<Name>.jpg`.

### Environment variables

`.env.local` for local dev, hosting provider env for production:

| Var | Purpose | Where to get it |
|---|---|---|
| `ANTHROPIC_API_KEY` | Powers the Agent SDK snapshot refreshes | console.anthropic.com |
| `BASIC_AUTH_USER` / `BASIC_AUTH_PASS` | HTTP basic auth on every route. If either is unset, auth is off | choose your own |
| `IS_SANDBOX` | Set to `1` on Railway/Docker (any container that runs as root) so the SDK doesn't refuse | `1` |
| `MCP_CIRCLE_KEY` | Bearer for the Circle MCP HTTP server | your Circle MCP deploy |
| `MCP_FIREFLIES_KEY` | Bearer for Fireflies MCP | fireflies.ai/api |
| `MCP_YOUTUBE_API_KEY` | YouTube Data API key (used by the stdio MCP) | console.cloud.google.com |
| `MCP_VIDIQ_KEY` | Bearer for VidIQ MCP | vidiq.com |
| `MCP_APIFY_KEY` | Bearer for Apify MCP | apify.com |
| `MCP_UNIPILE_KEY` | X-API-KEY for Unipile (LinkedIn) | unipile.com |
| `MCP_REDDIT_URL` | URL of a Reddit MCP server (no auth) | optional |
| `UNIPILE_BASE_URL` | Your Unipile tenant base URL, e.g. `https://apiXX.unipile.com:NNNNN` | Unipile dashboard |
| `UNIPILE_LINKEDIN_ACCOUNT_ID` | Account id for the LinkedIn account to scan | Unipile accounts list |
| `CIRCLE_OWNER_EMAIL` | Email used to authenticate Circle DM access | the email that logs into Circle |
| `YOUTUBE_CHANNEL_ID` | The YouTube channel to track | YouTube studio |
| `YOUTUBE_CHANNEL_HANDLE` | Optional handle (e.g. `@yourchannel`) | YouTube studio |
| `PRIMARY_PROFILE` | Override the primary profile (defaults to first in `PROFILES`) | one of your `PROFILES` names |

`.mcp.json` is *generated* at build/start from these vars by `scripts/write-mcp-config.mjs`. You should never commit `.mcp.json`.

## Refreshing snapshots

Each tab has a **Refresh** button. The button hits `/api/refresh/<snapshot>`, which spawns an Agent SDK run using the prompt in `lib/server/snapshot-prompts.ts` and the MCPs declared there. Results are written to `public/data/<snapshot>.json`.

To customize what each refresh does — change topic lists, account IDs, niche filters — edit `lib/server/snapshot-prompts.ts`. The prompts are plain template strings.

## Sending replies

The Comms view has a **Send via MCP** button next to every draft reply. For LinkedIn items it posts to `/api/comms/send`, which uses the Unipile MCP key to POST a message to the chat ID. To wire other sources (Circle DMs via `circle-community__chat_send`, etc.), extend `app/api/comms/send/route.ts`.

## Deploying to Railway

See `references/RAILWAY.md` for the full walkthrough. Short version:

```bash
railway login
railway init --name <project-name>
railway add --service web
railway service web
# set every env var from .env.local on the service:
railway variables --set "ANTHROPIC_API_KEY=..." --set "IS_SANDBOX=1" --set "BASIC_AUTH_USER=..." ...
railway volume add --mount-path /app/data
railway up --ci --detach
railway domain
```

The included `scripts/link-volume.mjs` symlinks `.runs/` and `public/data/` to `/app/data/` at startup so they survive redeploys.

## Architecture notes

- `lib/server/sdk.ts` is the bridge to `@anthropic-ai/claude-agent-sdk`. It spawns the Claude Code CLI subprocess; that subprocess refuses to run as root unless `IS_SANDBOX=1` is set.
- `lib/server/runs.ts` is an in-memory + per-run JSON registry. Runs live at `.runs/<id>.json`.
- `lib/data.ts` reads `public/data/<name>.json` on every request. No mock data.
- `middleware.ts` does HTTP basic auth on every route except Next internals.
- Snapshots are global, not per-profile — the dashboard surfaces the same data per tab regardless of which profile is open. Personalization happens via the `profile` query param in the prompt (used for community mentions).

## Extending

- **Add a snapshot type:** add an entry to `SNAPSHOT_PROMPTS` in `lib/server/snapshot-prompts.ts`, a key to `VALID_SNAPSHOTS` in `lib/server/paths.ts`, and a tab in `app/profile/[name]/page.tsx`.
- **Add a profile:** append to `PROFILES` in `lib/config.ts` and drop `<Name>.jpg` in `public/avatars/`.
- **Add a new MCP:** edit `scripts/write-mcp-config.mjs` to emit it from a new env var, then reference it from a snapshot prompt's `mcp_servers` array.
