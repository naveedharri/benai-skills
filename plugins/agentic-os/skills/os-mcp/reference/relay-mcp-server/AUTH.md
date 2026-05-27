# Relay MCP v2 — Auth

OAuth 2.1 resource server + authorization server, delegating identity to Relay.md via PocketBase password auth. Inbound MCP calls authenticated via JWT issued after sign-in, or a static bearer for CLI / scripts. Upstream calls to `api.system3.md` use the per-session PocketBase token, auto-refreshed.

## Env vars

| Var | Required | Purpose |
|-----|----------|---------|
| `PUBLIC_URL` | yes | Externally-reachable URL of this server (e.g. `https://relay-mcp.railway.app`). Used as OAuth issuer + audience. |
| `JWT_SECRET` | yes (>=32 chars) | HS256 signing key for access tokens and for encrypting the session store at rest. Rotate by changing and re-starting — everyone re-signs in. |
| `ALLOWED_EMAILS` | optional | Comma-separated allow-list of Relay.md emails (e.g. `you@example.com`). Sign-ins from other accounts get 403. Leave unset to allow any authenticated Relay.md user. |
| `STATIC_MCP_BEARER` | recommended | Long-lived token for CLI / scripts / legacy connector entries. Accepted on `/mcp` and `/diag` with no OAuth. |
| `DATA_DIR` | yes | Persistent directory for `clients.json` (DCR) + `sessions.enc` (encrypted PB tokens). Set to a Railway volume mount (e.g. `/data`). |
| `PB_AUTH_URL` | yes | PocketBase auth host (e.g. `https://auth.system3.md`). No default — required. |
| `PB_COLLECTION` | optional | Default `users`. PocketBase collection name. |
| `RELAY_API_URL` | yes | Relay backend (e.g. `https://api.system3.md`). No default — required. |
| `RELAY_AUTH_TOKEN` | fallback | Used ONLY when the caller authenticated via `STATIC_MCP_BEARER`. The OAuth path ignores this and uses each user's PB token. |
| `RELAY_ID` | yes | Vault GUID. No default — required. Folders inside the vault are auto-discovered at runtime via PocketBase. |
| `PORT` | optional | Default 3000. |

## Setting a Relay.md password

If you signed up via Google/GitHub OAuth, your account has no password by default. One-time setup:

1. Trigger reset: `curl -X POST https://auth.system3.md/api/collections/users/request-password-reset -H "Content-Type: application/json" -d '{"email":"you@example.com"}'`
2. Check your inbox for "Reset your Relay.md password".
3. Click the link, pick a password.
4. You can still use Google/GitHub sign-in in the plugin afterwards — adding a password doesn't disable OAuth.

## Adding the connector in Claude

Hosted (claude.ai): Settings → Connectors → Add custom connector → paste `${PUBLIC_URL}/mcp`. Claude auto-discovers OAuth, runs DCR, opens a browser window on our `/authorize` page which renders the sign-in form. Enter your Relay.md email + password, click Sign in. Browser redirects back to Claude, session established. Refresh happens silently.

Claude Code: `claude mcp add --transport http relay ${PUBLIC_URL}/mcp`. Same flow via loopback callback.

## Bypass the OAuth flow for CLI / scripts

Set `STATIC_MCP_BEARER` in env, then use `Authorization: Bearer <STATIC_MCP_BEARER>`. The upstream Relay call uses `RELAY_AUTH_TOKEN` (the current static token). This is the "legacy" mode — keep it around for convenience and for the existing claude.ai connector entry during migration.

## Operational notes

- **PB token refresh**: a background loop iterates sessions every 30 min and calls `/api/collections/users/auth-refresh` on any PB token within 6 h of expiry. Inline refresh triggers when a tool call is made and the token expires in <5 min.
- **Revoke a session**: stop the server, delete the matching entry from `${DATA_DIR}/sessions.enc` (or wipe the whole file), restart. User re-signs in on next request.
- **Rotate `JWT_SECRET`**: change env + restart. All existing MCP JWTs + encrypted sessions become unreadable. Users re-sign in.
- **Force re-auth of a single client**: delete its entry from `${DATA_DIR}/clients.json`. Claude will re-register via DCR on next connect.
- **Revoke a Relay.md password**: reset it via the password-reset email flow above. Any active PB session keeps working until refresh fails (PocketBase doesn't invalidate old tokens on password change by default), so follow up by deleting the session from `sessions.enc`.

## Deploy to Railway

1. Create a new Railway service from this directory (or point at the Git path).
2. Attach a Volume, mount at `/data`.
3. Set all required env vars above. `DATA_DIR=/data`.
4. Deploy. Public URL is whatever Railway assigned — set that as `PUBLIC_URL` and redeploy once so discovery URLs are correct.
