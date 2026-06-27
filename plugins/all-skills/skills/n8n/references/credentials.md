# n8n Credentials Reference

Extract and use node configurations from a credentials template workflow.

---

## What is a Credentials Template?

A **Credentials Template** is a workflow you create in n8n that contains nodes with all your configured credentials AND working parameters. This allows the skill to:

1. Fetch the template workflow
2. Extract **full node configurations** (credentials + parameters + typeVersion)
3. Apply those configurations to new workflows

---

## Configuration

Required `.env` variables:

```
N8N_API_URL=https://your-n8n.app.n8n.cloud
N8N_API_KEY=your-api-key
N8N_CREDENTIALS_TEMPLATE_URL=https://your-n8n.app.n8n.cloud/workflow/abc123
```

---

## Template Workflow Structure

Create a workflow in n8n with nodes for each service you use:

```
[Slack Node] -> [Google Sheets Node] -> [HTTP Request Node] -> [OpenAI Node]
     |               |                      |                    |
  Slack API    Google OAuth2           API Key Auth         OpenAI API
```

**Each node should have:**
- Credentials configured
- Parameters set to common/default values you use
- The template doesn't need to be active

---

## Fetching Node Configurations

### Get all configured nodes
```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s "${N8N_API_URL}/api/v1/workflows/{WORKFLOW_ID}" -H "X-N8N-API-KEY: ${N8N_API_KEY}" | jq '.nodes[] | select(.credentials)'
```

### Get specific node type
```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s "${N8N_API_URL}/api/v1/workflows/{WORKFLOW_ID}" -H "X-N8N-API-KEY: ${N8N_API_KEY}" | jq '.nodes[] | select(.type | contains("slack"))'
```

### Get node config for reuse
```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s "${N8N_API_URL}/api/v1/workflows/{WORKFLOW_ID}" -H "X-N8N-API-KEY: ${N8N_API_KEY}" | jq '.nodes[] | select(.type == "n8n-nodes-base.slack") | {type, typeVersion, parameters, credentials}'
```

---

## CRITICAL: Copy Full Configuration

**IMPORTANT**: When using template nodes, copy the **ENTIRE node configuration**, not just credentials:

| What to Copy | Why |
|--------------|-----|
| `credentials` | Authentication for the service |
| `parameters` | All settings (resource, operation, options, etc.) |
| `typeVersion` | Ensures compatibility with your n8n version |

---

## Example: Using Template Configuration

Template returns:
```json
{
  "type": "n8n-nodes-base.slack",
  "typeVersion": 2.2,
  "parameters": {
    "resource": "message",
    "operation": "post",
    "channel": {
      "__rl": true,
      "mode": "name",
      "value": "#general"
    },
    "text": "Hello!"
  },
  "credentials": {
    "slackApi": {
      "id": "abc123",
      "name": "Slack Production"
    }
  }
}
```

New node using template:
```json
{
  "id": "new-unique-id",
  "name": "Send Notification",
  "type": "n8n-nodes-base.slack",
  "typeVersion": 2.2,
  "position": [450, 300],
  "parameters": {
    "resource": "message",
    "operation": "post",
    "channel": {
      "__rl": true,
      "mode": "name",
      "value": "#alerts"
    },
    "text": "={{ $json.message }}"
  },
  "credentials": {
    "slackApi": {
      "id": "abc123",
      "name": "Slack Production"
    }
  }
}
```

---

## Credential Types Reference

Common credential type names used in n8n:

| Service | Credential Type |
|---------|-----------------|
| Slack | `slackApi`, `slackOAuth2Api` |
| Google Sheets | `googleSheetsOAuth2Api` |
| Gmail | `gmailOAuth2` |
| OpenAI | `openAiApi` |
| HTTP Request | `httpHeaderAuth`, `httpBasicAuth`, `httpQueryAuth` |
| PostgreSQL | `postgres` |
| MySQL | `mySql` |
| Airtable | `airtableTokenApi` |
| Notion | `notionApi` |
| GitHub | `githubApi`, `githubOAuth2Api` |
| Stripe | `stripeApi` |
| Twilio | `twilioApi` |
| SendGrid | `sendGridApi` |
| AWS | `aws` |
| Apify | `apifyApi` |
| Anthropic | `anthropicApi` |

---

## Common Pitfalls

### 1. Copying only credentials, not parameters
- **Wrong**: Just copy `credentials` and guess at `parameters`
- **Right**: Copy full node config including `parameters` and `typeVersion`

### 2. Using wrong typeVersion
- **Wrong**: Hardcode `typeVersion: 1`
- **Right**: Use the exact `typeVersion` from the template node

### 3. Missing parameter structure
- **Wrong**: `"channel": "#general"` (simple string)
- **Right**: Copy the exact structure from template (may need `__rl`, `mode`, etc.)

### 4. Not checking if node exists in template
- **Wrong**: Assume all node types exist in template
- **Right**: First list available nodes, inform user if requested type is missing

---

## Error Handling

### Template Not Found
```
Error: Could not fetch credentials template.

Check that:
1. N8N_CREDENTIALS_TEMPLATE_URL in .env is correct
2. The workflow exists and hasn't been deleted
3. Your API key has access to this workflow
```

### Node Type Not in Template
```
Note: No node found in template for type: n8n-nodes-base.{type}

Options:
1. Add a {type} node with credentials to your template workflow
2. Ask user if they want to proceed without template config
3. Manually configure the node (may require UI setup for some nodes)
```
