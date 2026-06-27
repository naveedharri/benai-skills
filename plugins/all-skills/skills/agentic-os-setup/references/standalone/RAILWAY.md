# Deploying Agentic OS to Railway

This template is designed to deploy to Railway with one persistent volume and HTTP basic auth. The walk-through assumes you've already run `npm install` locally and the dev server boots.

## 0. Prerequisites

- Railway CLI installed: `npm i -g @railway/cli` (or `brew install railway`)
- Logged in: run `railway login` in a real terminal (the browser flow needs a TTY)
- A `.env.local` with everything filled in, OR the values ready to paste

## 1. Create the project + service

```bash
railway init --name <project-name>             # creates an empty project
railway add --service web                       # creates a service named "web" (Empty Service)
railway service web                             # links this directory to that service
```

If you have multiple workspaces, pass `--workspace "<workspace name>"` to `railway init`.

## 2. Set environment variables

The build/start scripts read MCP keys + tenant identifiers from env. Copy *everything* from your `.env.local`:

```bash
railway variables \
  --set "ANTHROPIC_API_KEY=..." \
  --set "IS_SANDBOX=1" \
  --set "BASIC_AUTH_USER=..." \
  --set "BASIC_AUTH_PASS=$(openssl rand -hex 12)" \
  --set "MCP_CIRCLE_KEY=..." \
  --set "MCP_FIREFLIES_KEY=..." \
  --set "MCP_YOUTUBE_API_KEY=..." \
  --set "MCP_VIDIQ_KEY=..." \
  --set "MCP_APIFY_KEY=..." \
  --set "MCP_UNIPILE_KEY=..." \
  --set "MCP_REDDIT_URL=..." \
  --set "UNIPILE_BASE_URL=..." \
  --set "UNIPILE_LINKEDIN_ACCOUNT_ID=..." \
  --set "CIRCLE_OWNER_EMAIL=..." \
  --set "YOUTUBE_CHANNEL_ID=..." \
  --set "YOUTUBE_CHANNEL_HANDLE=..." \
  --skip-deploys
```

`--skip-deploys` lets you batch multiple var changes without triggering a redeploy each time.

## 3. Add a persistent volume

Snapshots and run history would otherwise reset on every redeploy.

```bash
railway volume add --mount-path /app/data
```

The included `scripts/link-volume.mjs` runs at startup and symlinks `.runs/` and `public/data/` into `/app/data/`. No code changes needed.

## 4. Deploy

```bash
railway up --ci --detach
```

This tar-uploads the working directory (respecting `.railwayignore`) and triggers a build. Watch progress:

```bash
railway logs --build      # build logs
railway logs              # runtime logs (after build succeeds)
```

A successful first deploy takes 2-3 minutes. The console will say `Ready in ...s` once Next.js is serving.

## 5. Generate a public URL

```bash
railway domain
```

Returns something like `https://web-production-abcde.up.railway.app`. Open it — you'll get a basic-auth prompt with your `BASIC_AUTH_USER` / `BASIC_AUTH_PASS`.

## 6. Sanity-check a refresh

Click **Refresh** on Ben's Community or Comms tab and watch `railway logs` — you should see Agent SDK output flowing. The full refresh takes 2-5 minutes per snapshot.

If a refresh fails immediately with `Claude Code process exited with code 1`, the most likely cause is missing `IS_SANDBOX=1` (containers run as root and the SDK refuses `--dangerously-skip-permissions` without that flag).

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `Claude Code process exited with code 1` immediately | `IS_SANDBOX` not set | `railway variables --set "IS_SANDBOX=1"` |
| `Failed to spawn Claude Code process: ENOENT` | The CLI binary couldn't be found | Make sure `@anthropic-ai/claude-agent-sdk` is in `dependencies`, not `devDependencies` |
| `--dangerously-skip-permissions cannot be used with root` | Same as above | Same fix |
| Build fails with "SECURITY VULNERABILITIES DETECTED" | A dependency CVE blocked the build | Bump the package per Railway's instructions and `npm install` to regenerate `package-lock.json` |
| MCP shows `disabled` in logs | The MCP key is missing OR the project is in a `disabledMcpServers` list in a parent `~/.claude.json` (mostly a local-dev concern) | Confirm the env var is set; check `railway variables` shows it |
| 401 on every page | Basic auth is on | Use `curl -u "user:pass" <url>` or browser dialog with the values you set |
| Snapshot writes "Circle MCP server unavailable" | The agent couldn't reach the Circle MCP, OR the tools weren't visible | Verify `MCP_CIRCLE_KEY` is set; for the Ben AI Circle MCP it's a Railway deploy that may need to wake |

## Rotating the basic-auth password

```bash
railway variables --set "BASIC_AUTH_PASS=$(openssl rand -hex 12)"
```

This triggers a redeploy automatically. Tell whoever uses the dashboard the new value (it shows in plaintext in `railway variables`).

## Cleaning up

```bash
railway down              # tears down the latest deploy
railway service delete    # deletes the web service entirely
railway delete            # deletes the project
```
