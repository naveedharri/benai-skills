# Request Payloads

Copy-paste JSON bodies for every step. Substitute `${…}` placeholders with user input or values captured from prior responses. For tool/MCP/vault/skill specifics, see the sibling reference files.

## 1. Create Agent. `POST /v1/agents`

Minimal:
```json
{
  "name": "${agent_name}",
  "model": "claude-opus-4-7",
  "system": "${system_prompt}",
  "tools": [{ "type": "agent_toolset_20260401" }]
}
```

With fast mode (Opus 4.6 / 4.7 only):
```json
{
  "name": "${agent_name}",
  "model": { "id": "claude-opus-4-7", "speed": "fast" }
}
```

Full example with MCP server, custom + Anthropic skills, custom tool, metadata:
```json
{
  "name": "${agent_name}",
  "description": "${description}",
  "model": { "id": "claude-sonnet-4-6", "speed": "standard" },
  "system": "${system_prompt}",
  "tools": [
    {
      "type": "agent_toolset_20260401",
      "default_config": {
        "enabled": true,
        "permission_policy": { "type": "always_allow" }
      },
      "configs": [
        { "name": "web_search", "enabled": false },
        { "name": "web_fetch", "enabled": false }
      ]
    },
    {
      "type": "mcp_toolset",
      "mcp_server_name": "${mcp_name}",
      "default_config": {
        "enabled": true,
        "permission_policy": { "type": "always_allow" }
      },
      "configs": []
    },
    {
      "type": "custom",
      "name": "get_weather",
      "description": "Get current weather for a location",
      "input_schema": {
        "type": "object",
        "properties": { "location": { "type": "string" } },
        "required": ["location"]
      }
    }
  ],
  "mcp_servers": [
    { "type": "url", "name": "${mcp_name}", "url": "${mcp_url}" }
  ],
  "skills": [
    { "type": "anthropic", "skill_id": "xlsx" },
    { "type": "custom", "skill_id": "skill_abc123", "version": "latest" }
  ],
  "metadata": { "owner": "${owner}", "purpose": "${purpose}" }
}
```

Repeat the `mcp_servers` entry and the matching `mcp_toolset` block for every MCP server. Every `mcp_servers` entry must have a corresponding `mcp_toolset` and vice versa, or the API rejects the create.

Response (truncated):
```json
{
  "id": "agent_01HqR2k7vXbZ9mNpL3wYcT8f",
  "version": 1,
  "model": { "id": "claude-opus-4-7", "speed": "standard" },
  "created_at": "...",
  "archived_at": null
}
```
Capture `id` and `version` into shell vars.

## 2. Update Agent. `POST /v1/agents/${agent_id}`

Pass current `version` for optimistic locking. Only include fields you want to change.
```json
{
  "version": ${current_version},
  "system": "${new_system_prompt}"
}
```

Returns the new agent object with incremented `version`. If body matches current state, no new version is created.

## 3. Archive Agent. `POST /v1/agents/${agent_id}/archive`

Empty body. Returns the agent with `archived_at` set.

## 4. Create Environment. `POST /v1/environments`

```json
{
  "name": "${env_name}",
  "description": "Environment for ${agent_name}",
  "metadata": {},
  "scope": "organization",
  "config": {
    "type": "cloud",
    "packages": {
      "pip": [],
      "npm": [],
      "apt": [],
      "cargo": [],
      "gem": [],
      "go": []
    },
    "networking": { "type": "unrestricted" }
  }
}
```
Populate package arrays if the agent needs system or language deps preinstalled in its sandbox.

## 5. Create Vault. `POST /v1/vaults`

```json
{ "display_name": "${vault_display_name}" }
```

## 6. Add Credential. `POST /v1/vaults/${vault_id}/credentials`

See `mcp-and-vaults.md` for `static_bearer` and `mcp_oauth` body shapes.

## 7. Create Session. `POST /v1/sessions`

```json
{
  "agent": "${agent_id}",
  "environment_id": "${env_id}",
  "vault_ids": ["${vault_id}"]
}
```
`agent` can also be passed as `{ "type": "agent", "id": "${agent_id}" }`. Both accepted; the string form is preferred.

## 8. Send User Message. `POST /v1/sessions/${session_id}/events`

```json
{
  "events": [
    {
      "type": "user.message",
      "content": [{ "type": "text", "text": "${message}" }]
    }
  ]
}
```

## Custom Tool Flow

When the agent emits an `assistant.tool_use` event for a custom tool, your app executes the tool and posts back a `tool_result`:
```json
{
  "events": [
    {
      "type": "tool_result",
      "tool_use_id": "${tool_use_id_from_event}",
      "content": [{ "type": "text", "text": "${tool_output_string}" }],
      "is_error": false
    }
  ]
}
```

## curl Skeleton

```bash
curl --fail-with-body --silent --show-error \
  -X POST "https://api.anthropic.com/v1/agents" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" \
  -H "content-type: application/json" \
  -d @agent.json | tee /tmp/agent.json

AGENT_ID=$(jq -r '.id'      /tmp/agent.json)
AGENT_VER=$(jq -r '.version' /tmp/agent.json)
```

If `jq` is unavailable:
```bash
AGENT_ID=$(python3 -c 'import sys,json;d=json.load(sys.stdin);print(d["id"])' < /tmp/agent.json)
```
