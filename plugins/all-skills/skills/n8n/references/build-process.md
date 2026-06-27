# Build Process

Step-by-step workflow for building n8n workflows incrementally.

## Contents
- [The Golden Rule](#the-golden-rule)
- [Step-by-Step Process](#step-by-step-process)
- [Testing Requirements](#testing-requirements)
- [Example Build](#example-build)

---

## The Golden Rule

```
ADD ONE NODE → TEST → ADD ONE NODE → TEST → REPEAT
```

**NEVER add 2 or more nodes at once. NEVER.**

```
❌ ABSOLUTELY WRONG:
   Add Webhook → Add Scraper → Add Transform → Add Sheets → Test → Error
   (Which node failed? Nobody knows. Start over.)

✅ THE ONLY CORRECT WAY:
   Add Webhook → Test ✓
   Add Scraper → Test ✓
   Add Transform → Test ✓
   Add Sheets → Test ✓
   Done!
```

---

## Step-by-Step Process

### Step 1: Create Workflow with Trigger Only

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s -X POST "${N8N_API_URL}/api/v1/workflows" -H "X-N8N-API-KEY: ${N8N_API_KEY}" -H "Content-Type: application/json" -d '{
  "name": "My Workflow",
  "nodes": [{
    "id": "webhook-1",
    "name": "Webhook",
    "type": "n8n-nodes-base.webhook",
    "typeVersion": 2,
    "position": [250, 300],
    "parameters": {"path": "my-workflow", "httpMethod": "POST"}
  }],
  "connections": {},
  "settings": {"executionOrder": "v1"}
}' | jq '{id, name}'
```

**Save the workflow ID - use it for ALL updates.**

### Step 2: Activate the Workflow

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s -X POST "${N8N_API_URL}/api/v1/workflows/{WORKFLOW_ID}/activate" -H "X-N8N-API-KEY: ${N8N_API_KEY}" | jq '{id, active}'
```

### Step 3: Test the Trigger

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s -X POST "${N8N_API_URL}/webhook/{WEBHOOK_PATH}" -H "Content-Type: application/json" -d '{"test": "data"}'
```

### Step 4: Verify Execution

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s "${N8N_API_URL}/api/v1/executions?limit=1" -H "X-N8N-API-KEY: ${N8N_API_KEY}" | jq '.data[0] | {id, status}'
```

**STOP if status ≠ "success". Debug before continuing.**

### Step 5: Add Next Node (PUT to update)

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s -X PUT "${N8N_API_URL}/api/v1/workflows/{WORKFLOW_ID}" -H "X-N8N-API-KEY: ${N8N_API_KEY}" -H "Content-Type: application/json" -d '{
  ... existing nodes + new node + updated connections ...
}'
```

### Step 6: Test Again

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s -X POST "${N8N_API_URL}/webhook/{WEBHOOK_PATH}" -H "Content-Type: application/json" -d '{"test": "data"}'
```

### Step 7: Verify New Node Executed

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s "${N8N_API_URL}/api/v1/executions?limit=1" -H "X-N8N-API-KEY: ${N8N_API_KEY}" | jq '.data[0] | {id, status}'
```

Check which nodes ran:
```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s "${N8N_API_URL}/api/v1/executions/{EXECUTION_ID}?includeData=true" -H "X-N8N-API-KEY: ${N8N_API_KEY}" | jq '.data.resultData.runData | keys'
```

**STOP if status ≠ "success" or new node not in runData.**

### Step 8: Repeat Steps 5-7 for Each Node

**NEVER skip the test step. NEVER add multiple nodes without testing.**

---

## Testing Requirements

### Test with 2 Real Data Items

```
❌ WRONG: Limit search to 1 item (not enough to verify loops)
❌ WRONG: Use mock/placeholder data
❌ WRONG: Test with empty payload

✅ RIGHT: Set limit=2 or maxResults=2 (fast but verifies multiple items)
✅ RIGHT: Use real API endpoints
✅ RIGHT: Verify all 2 items flow through
```

When configuring data-fetching nodes:
- Apify/scraper nodes: `maxResults: 2`
- HTTP Request to APIs: `?limit=2`
- Database queries: `LIMIT 2`
- Search nodes: Set limit to 2

### One Workflow, Keep Updating

- Create workflow ONCE with POST → get workflow ID
- All changes use PUT to the SAME workflow ID
- Never create new workflow to test or fix

---

## Example Build

```
✓ Step 1: Create workflow with Webhook
✓ Step 2: Activate
✓ Step 3: Test → Execute webhook
✓ Step 4: Verify → status: success, runData: ["Webhook"]

✓ Step 5: Add Apify Scraper node (PUT)
✓ Step 6: Test → Execute webhook
✓ Step 7: Verify → status: success, runData: ["Webhook", "Apify Scraper"]

✓ Step 5: Add Transform node (PUT)
✓ Step 6: Test → Execute webhook
✓ Step 7: Verify → status: success, runData: ["Webhook", "Apify Scraper", "Transform"]

✓ Step 5: Add Google Sheets node (PUT)
✓ Step 6: Test → Execute webhook
✓ Step 7: Verify → status: success, runData: ["Webhook", "Apify Scraper", "Transform", "Google Sheets"]

✓ Final: All nodes tested and working → Report to user
```

### WRONG vs RIGHT

**WRONG:**
```
Add Webhook → Add Scraper → Add AI → Add Sheets → Test → Error → ???
```

**RIGHT:**
```
Add Webhook → Test ✓ → Add Scraper → Test ✓ → Add AI → Test ✓ → Add Sheets → Test ✓ → Done
```
