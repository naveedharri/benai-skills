# Tools Reference

Three tool kinds attach to an agent via the `tools` array.

## 1. `agent_toolset_20260401` (built-in toolset)

Sub-tools, all enabled by default:

| Name | Description |
|---|---|
| `bash` | Execute bash commands in a shell session |
| `read` | Read a file from the local filesystem |
| `write` | Write a file to the local filesystem |
| `edit` | String replacement in a file |
| `glob` | Fast file pattern matching using glob patterns |
| `grep` | Text search using regex patterns |
| `web_fetch` | Fetch content from a URL |
| `web_search` | Search the web for information |

Tool outputs > 100K tokens are auto-written to a sandbox file; the model gets a truncated preview + path.

### Configuration pattern

`default_config` applies to every sub-tool; `configs[]` overrides per tool name. Both accept `enabled` and `permission_policy`.

Disable specific tools (keep the rest on):
```json
{
  "type": "agent_toolset_20260401",
  "configs": [
    { "name": "web_fetch", "enabled": false },
    { "name": "web_search", "enabled": false }
  ]
}
```

Enable only specific tools (everything else off):
```json
{
  "type": "agent_toolset_20260401",
  "default_config": { "enabled": false },
  "configs": [
    { "name": "bash", "enabled": true },
    { "name": "read", "enabled": true },
    { "name": "write", "enabled": true }
  ]
}
```

## 2. `mcp_toolset` (per MCP server)

Exposes tools from one MCP server declared in the agent's `mcp_servers` array. Reference the server by `mcp_server_name`. Same `default_config` + `configs` pattern.

Default `permission_policy` for `mcp_toolset` is `always_ask`. To run fully autonomous, override to `always_allow`.

Enable only specific MCP tools:
```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "github",
  "default_config": { "enabled": false, "permission_policy": { "type": "always_allow" } },
  "configs": [
    { "name": "get_issue", "enabled": true },
    { "name": "list_issues", "enabled": true },
    { "name": "add_issue_comment", "enabled": true }
  ]
}
```

Disable a single dangerous MCP tool:
```json
{
  "type": "mcp_toolset",
  "mcp_server_name": "github",
  "configs": [
    { "name": "delete_repository", "enabled": false }
  ]
}
```

## 3. `custom` tools (user-defined, client-executed)

Same model as the Messages API tool-use pattern. Claude emits an `assistant.tool_use` event; the user's app executes and replies with a `tool_result` event (see `payloads.md`).

```json
{
  "type": "custom",
  "name": "get_weather",
  "description": "Get current weather for a location. Use when the user asks about temperature, forecast, or weather conditions. Returns temperature in Celsius and a short condition string.",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": { "type": "string", "description": "City name" }
    },
    "required": ["location"]
  }
}
```

Best practices:
- Write extremely detailed `description` (3-4 sentences minimum). Explain what the tool does, when to use it, when NOT to use it, and the meaning of every parameter.
- Consolidate related operations into one tool with an `action` param rather than many narrow tools.
- Namespace tool names by resource (`db_query`, `storage_read`).
- Return high-signal, stable identifiers, not opaque internals.

## Permission Policy Types

Used in `default_config.permission_policy` and per-tool `configs[].permission_policy`.

| Type | Behavior |
|---|---|
| `always_allow` | Tool runs without user confirmation. Use for autonomous agents. |
| `always_ask` | Tool emits a confirmation request the user's app must approve. Default for `mcp_toolset`. |

Confirmation events appear in the session stream. The user's app responds to permit or deny each call.

## Tool Validation Rules

- Every `mcp_servers` entry must be referenced by an `mcp_toolset` and vice versa. Dangling references reject the agent.
- Tool names within a single agent must be unique (custom tools + sub-tool names should not collide).
- An agent can declare up to 20 MCP servers.
