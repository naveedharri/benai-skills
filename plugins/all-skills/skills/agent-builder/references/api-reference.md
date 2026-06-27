# Anthropic Managed Agents API Reference

Base URL: `https://api.anthropic.com`

## Required Headers

For Managed Agents endpoints (agents, environments, vaults, sessions, events):
```
x-api-key: $ANTHROPIC_API_KEY
anthropic-version: 2023-06-01
anthropic-beta: managed-agents-2026-04-01
content-type: application/json
```

For Custom Skills endpoints (uploading/managing custom skills):
```
x-api-key: $ANTHROPIC_API_KEY
anthropic-version: 2023-06-01
anthropic-beta: skills-2025-10-02
content-type: multipart/form-data    (only on upload endpoints)
```

## Endpoints

### Agents

| Operation | Method | Path |
|---|---|---|
| Create | POST | `/v1/agents` |
| Get | GET | `/v1/agents/{agent_id}` |
| List | GET | `/v1/agents` |
| Update | POST | `/v1/agents/{agent_id}` (include `version` for optimistic locking) |
| List versions | GET | `/v1/agents/{agent_id}/versions` |
| Archive | POST | `/v1/agents/{agent_id}/archive` |

Returned fields on agent objects: `id`, `type`, `name`, `description`, `model`, `system`, `tools`, `mcp_servers`, `skills`, `metadata`, `version`, `created_at`, `updated_at`, `archived_at`.

Update semantics:
- Scalar fields (`model`, `system`, `name`, `description`) are replaced. Pass `null` to clear `system`/`description`. `model` and `name` cannot be cleared.
- Array fields (`tools`, `mcp_servers`, `skills`) are fully replaced. Empty array or `null` clears.
- `multiagent` is replaced as a whole.
- `metadata` is merged at the key level. Empty string deletes a key.
- No-op updates do not bump the version.

### Environments

| Operation | Method | Path |
|---|---|---|
| Create | POST | `/v1/environments` |
| Get | GET | `/v1/environments/{environment_id}` |
| List | GET | `/v1/environments` |

### Vaults

| Operation | Method | Path |
|---|---|---|
| Create | POST | `/v1/vaults` |
| Get | GET | `/v1/vaults/{vault_id}` |
| List | GET | `/v1/vaults` |
| Add credential | POST | `/v1/vaults/{vault_id}/credentials` |
| Delete credential | DELETE | `/v1/vaults/{vault_id}/credentials/{credential_id}` |

### Sessions

| Operation | Method | Path |
|---|---|---|
| Create | POST | `/v1/sessions` |
| Get | GET | `/v1/sessions/{session_id}` |
| List | GET | `/v1/sessions` |
| Send event | POST | `/v1/sessions/{session_id}/events` |
| Stream events | GET | `/v1/sessions/{session_id}/events` (SSE) |

### Custom Skills

| Operation | Method | Path |
|---|---|---|
| Upload (new skill) | POST | `/v1/skills` |
| List | GET | `/v1/skills` (filter with `?source=custom`) |
| Get | GET | `/v1/skills/{skill_id}` |
| Create new version | POST | `/v1/skills/{skill_id}/versions` |
| Delete version | DELETE | `/v1/skills/{skill_id}/versions/{version}` |
| Delete skill | DELETE | `/v1/skills/{skill_id}` (must delete all versions first) |

## Standard Error Shape

```json
{ "type": "error", "error": { "type": "...", "message": "..." } }
```

Common types:
- `invalid_request_error`. Body schema mismatch.
- `authentication_error`. Bad or missing `x-api-key`.
- `permission_error`. Missing beta header or org not allowlisted.
- `not_found_error`. Bad ID from a previous step.
- `conflict_error`. Stale `version` on an agent update.

## Session Event Types

- `user.message`. The user sending a message.
- `assistant.message`. Claude's reply.
- `assistant.tool_use`. A tool call from Claude.
- `tool_result`. The result of a tool call.
- `session.status_running` / `session.status_idle`. Session state transitions.
- `session.error`. Includes `mcp_server_name`, error type, `retry_status`. See `mcp-and-vaults.md`.
- Custom tool calls. See `payloads.md` "Custom tool flow" section.
