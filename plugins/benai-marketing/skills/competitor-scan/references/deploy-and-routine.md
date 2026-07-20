# Deploy to a stable URL and schedule the refresh

## Deploy so the URL never changes across refreshes

- **First deploy (local):** `vercel deploy --prod` is fine from a laptop. Create the project, then disable Deployment Protection (`PATCH /v9/projects/<id>` `{"ssoProtection":null}`) so the weekly Slack link is publicly openable.
- **Set up git-connected deploy:** create a small public repo (just `index.html` plus the skill), and link it to the Vercel project (`POST /v9/projects/<id>/link` `{"type":"github","repo":"owner/name"}`). From then on, a push to `main` auto-deploys the same URL. This is what makes the routine work.

## Schedule the refresh routine

Create a cloud routine (RemoteTrigger) on the chosen cadence:
- Weekly: `30 3 * * 1` (Mon 09:00 IST)
- Monthly: `30 3 1 * *` (1st, 09:00 IST)

Cron is UTC; 09:00 IST = `30 3`. The routine clones the repo, runs the `competitor-radar` skill to refresh the data, deploys, and Slacks the link.

## The connector vs. embedded-API decision

This is the crux of making a cloud routine actually work. Two publishing/data rules:

### 1. Deploy: git push, never the Vercel CLI/token/API from a cloud routine.

A cloud routine's Vercel egress resolves to the wrong account by design, so `vercel deploy` and `api.vercel.com` silently hit the wrong place. The reliable path: repo git-connected to Vercel, routine commits to `main`, Vercel auto-builds. The git push IS the deploy. (Locally, the CLI is fine.)

### 2. Data + messaging: prefer http MCP connectors; fall back to embedded API calls only where no connector exists.

- **Attach connectors** by leaving `mcp_connections: []` in the routine's `job_config`. An empty list grants ALL of the user's claude.ai connectors (Slack, Firecrawl, Gmail, Vercel-mcp, etc.). Use these: they authenticate via the user's account, so no secrets sit in the routine prompt.
- **Plugin-based tools are NOT http connectors.** Apify and the youtube/vidiq connector ship via a plugin/marketplace, so they are absent from a fresh cloud routine even with `mcp_connections: []`. For those, either (a) attach the plugin marketplace to the routine, or (b) embed a direct API call. The Apify run API works cleanly from the cloud in one Bash call: `curl -s -X POST "https://api.apify.com/v2/acts/<actor>/run-sync-get-dataset-items?token=$APIFY_TOKEN" -H "Content-Type: application/json" -d '<input>'` (actor id uses `~` not `/`, e.g. `apify~instagram-scraper`). Route YouTube through an Apify YouTube actor when the youtube connector is absent. If you embed keys, do the whole call in a SINGLE Bash invocation, because env vars do NOT persist between Bash calls in a cloud routine. Put the token in the routine PROMPT (private), never in a public repo `.env`.
- **Never split a credential-dependent call across two Bash calls.** The second call will have lost the env and silently fall back to the wrong identity.

Rule of thumb: connector when the service has a claude.ai http MCP (clean, no secrets); embedded single-Bash-call API when it does not (Vercel is the exception: git push, not API).
