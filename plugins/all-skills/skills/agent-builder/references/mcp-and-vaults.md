# MCP Servers and Vault Credentials

MCP config is split across two steps:
1. Agent declares which MCP servers exist (names + URLs only, no secrets).
2. Session supplies auth via vault credentials referenced by `vault_ids`.

## Declare MCP Servers on the Agent

Each entry:

| Field | Required | Description |
|---|---|---|
| `type` | yes | Must be `"url"` |
| `name` | yes | Unique within the agent. 1-255 chars. Used as `mcp_server_name` in tools and on session events. |
| `url` | yes | Up to 2048 chars. Remote MCP endpoint, streamable HTTP transport. |

```json
"mcp_servers": [
  { "type": "url", "name": "github", "url": "https://api.githubcopilot.com/mcp/" },
  { "type": "url", "name": "slack",  "url": "https://mcp.slack.com/mcp" }
]
```

Limits:
- Up to 20 MCP servers per agent.
- Names unique within the agent.
- Each `mcp_servers` entry MUST be referenced by exactly one `mcp_toolset` in `tools`, and every `mcp_toolset` MUST reference a declared server.

## Create a Vault

```json
{ "display_name": "${vault_display_name}" }
```
Response: `{ "id": "vault_…", … }`.

## Add Credential. `POST /v1/vaults/${vault_id}/credentials`

Credentials match MCP servers by exact `mcp_server_url`. If no credential URL matches, the connection is attempted unauthenticated.

### `static_bearer`

For MCPs that accept a static API key as a bearer token.
```json
{
  "display_name": "${cred_display_name}",
  "auth": {
    "type": "static_bearer",
    "mcp_server_url": "${mcp_url}",
    "token": "${bearer_token}"
  }
}
```

### `mcp_oauth`

For MCPs that use OAuth (Slack, Fireflies, Notion, Circle, etc.).
```json
{
  "display_name": "${cred_display_name}",
  "auth": {
    "type": "mcp_oauth",
    "mcp_server_url": "${mcp_url}",
    "access_token": "${access_token}",
    "expires_at": "${iso8601_expiry}",
    "refresh": {
      "refresh_token": "${refresh_token}",
      "client_id": "${client_id}",
      "token_endpoint": "${token_endpoint}",
      "token_endpoint_auth": { "type": "none" }
    }
  }
}
```
Drop the `refresh` block if the user doesn't have refresh-token info.

## Bind Vaults at Session Creation

```json
{
  "agent": "${agent_id}",
  "environment_id": "${env_id}",
  "vault_ids": ["${vault_id}"]
}
```
Multiple vaults can be passed if credentials are split across them.

## Connection and Authentication Failures

Session creation does not validate MCP connectivity. Failures surface as `session.error` events:

| Error type | Meaning |
|---|---|
| `mcp_connection_failed_error` | Server unreachable. Network error, timeout, or non-auth HTTP failure. |
| `mcp_authentication_failed_error` | Server reachable but rejected the credential. |

Each event includes the affected `mcp_server_name` and a `retry_status`. Connection retries on the next `session.status_idle` to `session.status_running` transition.

The user's app can:
- Continue without the affected server's tools.
- Rotate the credential and retry.
- Surface the error and pause.

## MCP Tool Output Handling

Output > 100K tokens auto-saves to the sandbox; the model gets a truncated preview and the file path and reads the rest via `read`.

## Supported MCP Servers

- Remote MCP servers exposing an HTTP endpoint (streamable HTTP transport).
- Private MCPs reachable via MCP tunnels.

stdio-only MCPs are not supported by Managed Agents directly. They must be wrapped in an HTTP-transport adapter or tunneled.
