# API Reference

Complete list of n8n REST API commands.

## Contents
- [Workflows](#workflows)
- [Executions](#executions)
- [Tags](#tags)
- [Variables](#variables)
- [Source Control](#source-control)
- [Webhook Execution](#webhook-execution)

---

## Workflows

### List All Workflows

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s "${N8N_API_URL}/api/v1/workflows" -H "X-N8N-API-KEY: ${N8N_API_KEY}" | jq .
```

### Get Workflow by ID

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s "${N8N_API_URL}/api/v1/workflows/{WORKFLOW_ID}" -H "X-N8N-API-KEY: ${N8N_API_KEY}" | jq .
```

### Create Workflow

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s -X POST "${N8N_API_URL}/api/v1/workflows" -H "X-N8N-API-KEY: ${N8N_API_KEY}" -H "Content-Type: application/json" -d '{
  "name": "My Workflow",
  "nodes": [],
  "connections": {},
  "settings": {"executionOrder": "v1"}
}' | jq .
```

### Update Workflow (PUT, not PATCH!)

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s -X PUT "${N8N_API_URL}/api/v1/workflows/{WORKFLOW_ID}" -H "X-N8N-API-KEY: ${N8N_API_KEY}" -H "Content-Type: application/json" -d '{
  "name": "Updated Name",
  "nodes": [],
  "connections": {},
  "settings": {"executionOrder": "v1"}
}' | jq .
```

### Delete Workflow

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s -X DELETE "${N8N_API_URL}/api/v1/workflows/{WORKFLOW_ID}" -H "X-N8N-API-KEY: ${N8N_API_KEY}" | jq .
```

### Activate Workflow

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s -X POST "${N8N_API_URL}/api/v1/workflows/{WORKFLOW_ID}/activate" -H "X-N8N-API-KEY: ${N8N_API_KEY}" | jq .
```

### Deactivate Workflow

**⚠️ WARNING: NEVER deactivate workflows during the build process.** Just use PUT to update directly. Deactivation is only for when you intentionally want to stop a workflow from running.

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s -X POST "${N8N_API_URL}/api/v1/workflows/{WORKFLOW_ID}/deactivate" -H "X-N8N-API-KEY: ${N8N_API_KEY}" | jq .
```

---

## Executions

### List Executions (always use limit!)

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s "${N8N_API_URL}/api/v1/executions?limit=2" -H "X-N8N-API-KEY: ${N8N_API_KEY}" | jq .
```

### Filter by Workflow

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s "${N8N_API_URL}/api/v1/executions?workflowId={WORKFLOW_ID}&limit=2" -H "X-N8N-API-KEY: ${N8N_API_KEY}" | jq .
```

### Get Execution with Data

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s "${N8N_API_URL}/api/v1/executions/{EXECUTION_ID}?includeData=true" -H "X-N8N-API-KEY: ${N8N_API_KEY}" | jq .
```

### Get Execution Status Only

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s "${N8N_API_URL}/api/v1/executions?limit=1" -H "X-N8N-API-KEY: ${N8N_API_KEY}" | jq '.data[0] | {id, status}'
```

### Get Which Nodes Ran

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s "${N8N_API_URL}/api/v1/executions/{EXECUTION_ID}?includeData=true" -H "X-N8N-API-KEY: ${N8N_API_KEY}" | jq '.data.resultData.runData | keys'
```

### Get Error Details

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s "${N8N_API_URL}/api/v1/executions/{EXECUTION_ID}?includeData=true" -H "X-N8N-API-KEY: ${N8N_API_KEY}" | jq '.data.resultData.error'
```

---

## Tags

### List Tags

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s "${N8N_API_URL}/api/v1/tags" -H "X-N8N-API-KEY: ${N8N_API_KEY}" | jq .
```

### Create Tag

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s -X POST "${N8N_API_URL}/api/v1/tags" -H "X-N8N-API-KEY: ${N8N_API_KEY}" -H "Content-Type: application/json" -d '{"name": "production"}' | jq .
```

---

## Variables

### List Variables

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s "${N8N_API_URL}/api/v1/variables" -H "X-N8N-API-KEY: ${N8N_API_KEY}" | jq .
```

### Create Variable

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s -X POST "${N8N_API_URL}/api/v1/variables" -H "X-N8N-API-KEY: ${N8N_API_KEY}" -H "Content-Type: application/json" -d '{"key": "MY_VAR", "value": "my-value"}' | jq .
```

### Delete Variable

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s -X DELETE "${N8N_API_URL}/api/v1/variables/{VARIABLE_ID}" -H "X-N8N-API-KEY: ${N8N_API_KEY}" | jq .
```

---

## Source Control

### Pull from Remote

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s -X POST "${N8N_API_URL}/api/v1/source-control/pull" -H "X-N8N-API-KEY: ${N8N_API_KEY}" -H "Content-Type: application/json" -d '{"force": false}' | jq .
```

### Push to Remote

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s -X POST "${N8N_API_URL}/api/v1/source-control/push" -H "X-N8N-API-KEY: ${N8N_API_KEY}" -H "Content-Type: application/json" -d '{"message": "Update workflows"}' | jq .
```

---

## Webhook Execution

### Execute via Production Webhook

Workflow must be ACTIVATED first.

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s -X POST "${N8N_API_URL}/webhook/{WEBHOOK_PATH}" -H "Content-Type: application/json" -d '{"key": "value"}' | jq .
```

### Execute via Test Webhook

Workflow must be OPEN in n8n UI with "Listening for test events".

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s -X POST "${N8N_API_URL}/webhook-test/{WEBHOOK_PATH}" -H "Content-Type: application/json" -d '{"key": "value"}' | jq .
```

---

## Webhook Node Configuration

**ALWAYS use `responseMode: "onReceived"` (Respond Immediately) by default.**

```json
{
  "id": "webhook-trigger",
  "name": "Webhook",
  "type": "n8n-nodes-base.webhook",
  "typeVersion": 2,
  "position": [250, 300],
  "parameters": {
    "path": "my-webhook-path",
    "httpMethod": "POST",
    "responseMode": "onReceived"
  },
  "webhookId": "unique-webhook-id"
}
```

Response modes:
- **`onReceived` - PREFERRED** - Respond immediately, workflow runs in background
- `lastNode` - Wait for workflow to complete
- `responseNode` - Wait for Respond to Webhook node

**Why `onReceived` is preferred:**
- Caller doesn't wait for long-running workflows
- No timeout issues on complex workflows
- Workflow runs reliably in background
