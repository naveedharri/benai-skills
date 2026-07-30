---
name: os-mcp
description: Deploy a Relay MCP server to the user's own Railway account, giving Claude read/write access to their Obsidian vault via the Relay.md sync protocol. Bundled source ships inside the skill — no separate repo clone needed. The user only pastes a Railway account token; the relay vault and folders inside it are auto-discovered after they OAuth in. Use when the user wants to "set up the os MCP", "deploy relay MCP to railway", "self-host the obsidian MCP server", or "give Claude access to my Obsidian vault".
---

# OS MCP — Railway Deploy

This skill deploys the Relay MCP v2 server to the user's own Railway account. The MCP source is bundled at `${CLAUDE_PLUGIN_ROOT}/skills/os-mcp/reference/relay-mcp-server/` — copy from there, do not fetch from anywhere else. The deployed server lets Claude clients (Claude Code or claude.ai) read/write the user's Obsidian vault by talking to the Relay.md sync protocol.

## What the user provides

**One thing: a Railway account token** — created at `https://railway.com/account/tokens`.

That's it. After deploy, the user signs in with their Relay.md credentials via OAuth; the MCP then auto-discovers their relay vault and the folders inside it via PocketBase. No vault GUIDs, no folder maps.

## Values set automatically by the skill

| Var | Source | Value |
|-----|--------|-------|
| `RELAY_API_URL` | preset | `https://api.system3.md` |
| `PB_AUTH_URL` | preset | `https://auth.system3.md` |
| `PB_COLLECTION` | preset | `users` |
| `DATA_DIR` | preset | `/data` |
| `PORT` | preset | `3000` |
| `JWT_SECRET` | auto-generated | `openssl rand -hex 32` |
| `STATIC_MCP_BEARER` | auto-generated | `openssl rand -hex 24` |
| `ALLOWED_EMAILS` | preset | *blank* (any authenticated Relay.md user) |
| `RELAY_AUTH_TOKEN` | preset | *blank* (OAuth-only; no static fallback) |
| `RELAY_ID` | not set | *auto-discovered at runtime per user* |
| `PUBLIC_URL` | derived | from `railway domain` after first deploy |

Save the generated `STATIC_MCP_BEARER` in the chat for the user — they'd use it for any CLI/script access bypassing OAuth.

If the user has multiple Relay vaults, the MCP auto-picks the first one. They can call the `vault_relays` tool after connecting to see which is active and pin a different one by setting `RELAY_ID` in `railway variables`.

---

# Workflow

Execute in order. Confirm each step before moving on.

## Step 1 — Verify Railway CLI

```bash
railway --version
```

If missing:
- macOS: `brew install railway`
- Anywhere: `npm i -g @railway/cli`

Re-run to confirm.

## Step 2 — Get Railway token from the user

Tell the user:

> Open `https://railway.com/account/tokens`, click **Create Token**, name it `os-mcp-deploy`, copy the value, and paste it here.

When pasted:

```bash
export RAILWAY_API_TOKEN="<paste>"
railway whoami
```

`railway whoami` should print the user's Railway email. If it errors, the token is wrong — ask them to regenerate.

## Step 3 — Deploy the bundled source

```bash
cd "${CLAUDE_PLUGIN_ROOT}/skills/os-mcp/reference/relay-mcp-server"

# Create a new Railway project (interactive — let user pick name)
railway init

# Persistent volume for clients.json + sessions.enc
railway volume add --mount-path /data

# Upload source, build via Dockerfile, deploy
railway up
```

Wait for the deploy. Tail logs if useful: `railway logs`.

## Step 4 — Wire env vars

Generate the secrets:

```bash
JWT_SECRET=$(openssl rand -hex 32)
STATIC_MCP_BEARER=$(openssl rand -hex 24)
```

Set everything in one shot (note: `RELAY_ID` is intentionally NOT set — it auto-discovers):

```bash
railway variables \
  --set "RELAY_API_URL=https://api.system3.md" \
  --set "PB_AUTH_URL=https://auth.system3.md" \
  --set "PB_COLLECTION=users" \
  --set "DATA_DIR=/data" \
  --set "PORT=3000" \
  --set "JWT_SECRET=$JWT_SECRET" \
  --set "STATIC_MCP_BEARER=$STATIC_MCP_BEARER"
```

Service auto-redeploys after `--set`. Wait for it to come back up.

## Step 5 — Set PUBLIC_URL and final redeploy

```bash
railway domain                      # assigns + prints public domain
```

Copy the URL, then:

```bash
railway variables --set "PUBLIC_URL=https://<the-domain>"
railway up                          # final redeploy so OAuth issuer/audience match
```

## Step 6 — Verify

```bash
curl https://<the-domain>/health
```

Expect `200 OK` with JSON `{"status":"ok","version":"2.0.0",...}`.

## Step 7 — Connect from Claude

Print these for the user:

**Claude Code:**
```
claude mcp add --transport http vault https://<the-domain>/mcp
```

**Claude.ai (web):** Settings → Connectors → Add custom connector → paste `https://<the-domain>/mcp`. Sign in with their Relay.md credentials when the OAuth window opens.

Also tell them: their `STATIC_MCP_BEARER` is `<value>` — keep it for any CLI/script access that needs to bypass OAuth.

## Step 8 — Test discovery

In a fresh Claude conversation, ask Claude to call `vault_relays` (or have the user say "list my Relay vaults"). Expect at least one vault, with `*` next to the active one.

Then call `vault_folders` — expect a non-empty list of folder names. If empty, the user may not have folder access in that relay.

If the user has multiple relays and the wrong one is active, pin the right one:

```bash
railway variables --set "RELAY_ID=<the-vault-guid-from-vault_relays>"
```

(One redeploy and the next OAuth session will use that relay.)

---

# Troubleshooting

**`railway whoami` fails after pasting Railway token.** Token expired or wrong scope. Regenerate at https://railway.com/account/tokens.

**Build fails with TypeScript errors.** Don't modify the bundled `package.json` / `tsconfig.json`. Re-copy fresh from `${CLAUDE_PLUGIN_ROOT}/skills/os-mcp/reference/relay-mcp-server/`.

**`/health` returns 5xx.** `railway logs` will name the missing env var (`assertRequiredConfig` lists what's missing on boot).

**`vault_relays` returns "No relays accessible to this user".** The signed-in Relay.md account doesn't own or belong to any relay. Have them create one in the Relay.md Obsidian plugin first.

**`vault_folders` returns empty but `vault_relays` shows the vault.** Folders are stored in the `shared_folders` PocketBase collection — the user may not have any folders in that relay yet, or the active relay isn't the one they meant. Check `vault_relays` output for the active marker.

**OAuth sign-in loops.** `PUBLIC_URL` doesn't match the actual Railway domain. Re-run Step 5.

**Want to gate access to specific emails.** `railway variables --set "ALLOWED_EMAILS=email1@x.com,email2@x.com"` then redeploy.

**Want to start over.** `railway down` to tear down, then re-run from Step 3.
