# Common Pitfalls

Mistakes to avoid and how to debug errors.

## Contents
- [Command Format Mistakes](#command-format-mistakes)
- [Node Not Installed Errors](#node-not-installed-errors-critical)
- [Airtable Mistakes](#airtable-mistakes-critical)
- [Critical Mistakes](#critical-mistakes)
- [API Mistakes](#api-mistakes)
- [Build Process Mistakes](#build-process-mistakes)
- [Error Handling](#error-handling)
- [Debugging](#debugging)

---

## Command Format Mistakes

### NEVER Write JSON Files to Disk

❌ **Wrong**: Writing workflow JSON to a file, then using `-d @file.json`
```bash
# WRONG - Don't do this!
Write(workflow.json)
curl -X POST ... -d @workflow.json
```

✅ **Right**: Use the API directly with inline JSON or heredoc
```bash
# RIGHT - Direct API call with inline JSON
export $(cat .env | grep -v '^#' | xargs) && curl -s -X POST "${N8N_API_URL}/api/v1/workflows" -H "X-N8N-API-KEY: ${N8N_API_KEY}" -H "Content-Type: application/json" -d '{"name": "My Workflow", "nodes": [...], "connections": {}}'
```

### NEVER Use Line Continuations in Curl

❌ **Wrong**: Using `\` to break lines (causes "blank argument" errors)
```bash
# WRONG - Line continuations break in Claude Code
curl -s -X POST "${URL}" \
  -H "Header: value" \
  -d '{...}'
```

✅ **Right**: Single line commands OR heredoc for large JSON
```bash
# RIGHT - Single line
export $(cat .env | grep -v '^#' | xargs) && curl -s -X POST "${N8N_API_URL}/api/v1/workflows" -H "X-N8N-API-KEY: ${N8N_API_KEY}" -H "Content-Type: application/json" -d '{"name": "Test"}'

# RIGHT - Heredoc for large JSON (note: no line breaks in the curl part)
export $(cat .env | grep -v '^#' | xargs) && curl -s -X POST "${N8N_API_URL}/api/v1/workflows" -H "X-N8N-API-KEY: ${N8N_API_KEY}" -H "Content-Type: application/json" -d "$(cat <<'EOF'
{
  "name": "My Workflow",
  "nodes": [{"id": "1", "name": "Webhook", "type": "n8n-nodes-base.webhook", "typeVersion": 2, "position": [0,0], "parameters": {"path": "test"}}],
  "connections": {},
  "settings": {"executionOrder": "v1"}
}
EOF
)"
```

### NEVER Use source .env

❌ **Wrong**: Using `source .env` (unreliable with special characters)
```bash
# WRONG
source .env && curl ...
```

✅ **Right**: Use export with grep
```bash
# RIGHT - Always use this format
export $(cat .env | grep -v '^#' | xargs) && curl ...
```

### NEVER Use != in jq Filters

❌ **Wrong**: Using `!= null` in jq (shell interprets `!` as history expansion)
```bash
# WRONG - causes "unexpected INVALID_CHARACTER" error
jq '.nodes[] | select(.credentials != null)'
```

✅ **Right**: Use truthiness check instead
```bash
# RIGHT - same result, no shell issues
jq '.nodes[] | select(.credentials)'
```

**Why**: Bash interprets `!` for history expansion even inside quotes, turning `!=` into `\!=` which jq can't parse.

---

## Node Not Installed Errors (CRITICAL)

### "Install this node to use it" / "Cannot read properties of undefined (reading 'execute')"

This error means the node type or version is NOT INSTALLED on the user's n8n instance. The workflow cannot be activated.

**Common causes:**
- Using a `typeVersion` that's newer than what's installed
- Using community/custom nodes that aren't installed
- Using nodes from a newer n8n version

**How to avoid:**

1. **ALWAYS get node configs from the credentials template** - The template contains nodes that ARE installed and working
2. **Use the exact `typeVersion` from the template** - Don't guess or use documentation versions
3. **If a node fails to activate** - Check the template for the correct version

**Example - HTTP Request node:**
```
❌ WRONG: typeVersion: 4.4  → May not be installed
✅ RIGHT: Use typeVersion from credentials template (e.g., 4.2)
```

**Debugging:**
- Error during activation: `"Cannot read properties of undefined (reading 'execute')"`
- This usually means a node type/version doesn't exist
- Check the workflow in n8n UI - uninstalled nodes show "Install this node to use it"

**Solution:**
1. Fetch credentials template
2. Find the node type you need
3. Copy the EXACT `type` and `typeVersion` from the template
4. If not in template, ask user what version they have installed

---

## Split In Batches Loop Mistakes (CRITICAL)

### Wrong Output Index - Loop Doesn't Run

**THIS IS THE #1 LOOP MISTAKE. Output 0 and Output 1 are NOT interchangeable!**

```
Split In Batches outputs:
- Output 0 = DONE (items go here AFTER all processing completes)
- Output 1 = LOOP (current batch goes here for processing)
```

❌ **Wrong**: Connecting processing to output 0
```json
"Loop Over Items": {
  "main": [
    [{ "node": "Process Item", "type": "main", "index": 0 }],  // WRONG! This is output 0 (done)
    []
  ]
}
// Result: Loop runs once then stops, processing node may not execute
```

✅ **Right**: Connecting processing to output 1
```json
"Loop Over Items": {
  "main": [
    [],                                                         // Output 0: done (empty or final step)
    [{ "node": "Process Item", "type": "main", "index": 0 }]   // Output 1: loop (processing here!)
  ]
}
// Result: Loop processes all items correctly
```

**Symptoms of wrong output:**
- Loop only runs once
- Processing node doesn't execute
- Error: `"Cannot read properties of undefined (reading 'execute')"`
- Workflow activates but items aren't processed

**Always verify:**
1. Output 1 (second array) connects to your processing nodes
2. Processing nodes connect BACK to Loop node input
3. Output 0 (first array) connects to "done" step or is empty

---

## Airtable Mistakes (CRITICAL)

### Airtable Does NOT Support Table Creation

❌ **Wrong**: Trying to use `resource: "table"` with `operation: "create"`
```json
{
  "resource": "table",
  "operation": "create"
}
// ERROR: "Could not get parameter: operation"
```

✅ **Right**: User must create tables manually in Airtable UI. n8n only supports:
- `resource: "base"` → `getMany`, `getSchema`
- `resource: "record"` → `create`, `delete`, `get`, `search`, `update`, `upsert`

### Wrong Parameter Names - Data Node vs Trigger

**Airtable data node (v2.1) and Airtable Trigger (v1) use DIFFERENT parameter names!**

| Node Type | Base Parameter | Table Parameter |
|-----------|----------------|-----------------|
| Airtable (data node v2.1) | `base` | `table` |
| Airtable Trigger (v1) | `baseId` | `tableId` |

**For Airtable DATA node:**
❌ **Wrong**: Using `baseId` and `tableId`
```json
{
  "baseId": {"__rl": true, "mode": "id", "value": "appXXX"},
  "tableId": {"__rl": true, "mode": "id", "value": "tblXXX"}
}
// ERROR: WorkflowHasIssuesError
```

✅ **Right**: Use `base` and `table`
```json
{
  "base": {"__rl": true, "mode": "id", "value": "appXXX"},
  "table": {"__rl": true, "mode": "id", "value": "tblXXX"}
}
```

**For Airtable TRIGGER node:** Use `baseId` and `tableId` (the trigger uses different parameter names).

### Field Names Must Match EXACTLY

❌ **Wrong**: Using camelCase or incorrect spacing
```json
{
  "GoogleMapsURL": "...",
  "FitScore": "..."
}
// ERROR: Unknown field name: "GoogleMapsURL"
```

✅ **Right**: Use EXACT field names from Airtable (with spaces)
```json
{
  "Google Maps URL": "...",
  "Fit Score": "..."
}
```

**Solution**: Always use `getSchema` operation first to fetch exact field names before creating records.

---

## Critical Mistakes

### Using HTTP Request When Native Node Exists

❌ **Wrong**: Using HTTP Request to call Slack API when `n8n-nodes-base.slack` exists

✅ **Right**: Use native Slack node with credentials from template

**Exception**: Native node has known bug or missing feature

### Using Mock/Placeholder Data

❌ **Wrong**:
```json
"url": "https://api.example.com/placeholder"
"documentId": "REPLACE_ME"
"apiKey": "your-api-key-here"
```

✅ **Right**: Use real URLs, real IDs, real credential references from template

**If missing**: Ask user for real values, don't guess or mock

### Adding Multiple Nodes Before Testing

❌ **Wrong**: Add Node A → Add Node B → Add Node C → Test → Error (which failed?)

✅ **Right**: Add ONE node → Test → Add ONE node → Test → Repeat

---

## API Mistakes

### Using PATCH Instead of PUT

❌ **Wrong**: `curl -X PATCH /api/v1/workflows/{id}`

✅ **Right**: `curl -X PUT /api/v1/workflows/{id}`

### Trying to Activate with PUT

❌ **Wrong**: `curl -X PUT /api/v1/workflows/{id} -d '{"active": true}'`

✅ **Right**: `curl -X POST /api/v1/workflows/{id}/activate`

### Trying to Execute Manual Trigger via API

❌ **Wrong**: Expecting `POST /api/v1/workflows/{id}/run` to exist

✅ **Right**: Add webhook trigger, activate workflow, call webhook URL

### Executing Webhook Before Activating

❌ **Wrong**: `POST /webhook/path` on inactive workflow

✅ **Right**: First activate, then call webhook

### Fetching All Executions

❌ **Wrong**: `GET /api/v1/executions` (fetches everything)

✅ **Right**: `GET /api/v1/executions?limit=2` (only recent)

---

## Build Process Mistakes

### Telling User to Test Instead of Testing Yourself

❌ **Wrong**: "Workflow created! Please test it."

✅ **Right**: Test it yourself, debug failures, report only after confirmed working

### Reporting Success Without Testing

❌ **Wrong**: "Workflow is ready to use!" (without executing)

✅ **Right**: Execute workflow, verify status=success, then report

### Not Verifying Each Node Executed

❌ **Wrong**: Check only final status, assume all nodes ran

✅ **Right**: Check `runData | keys` to verify each node

### Creating New Workflows Instead of Updating

❌ **Wrong**: Create new workflow each time you add a node

✅ **Right**: Create ONE workflow, use PUT to update incrementally

### Leaving Google Sheets documentId Empty

❌ **Wrong**: Creating workflow with empty `documentId.value` and executing

✅ **Right**: Get spreadsheet ID from user, or warn about manual UI config

---

## Error Handling

### Common API Errors

| Status | Meaning | Solution |
|--------|---------|----------|
| 401 | Unauthorized | Check API key is valid |
| 404 | Not found | Check workflow/execution ID exists |
| 400 | Bad request | Validate JSON structure |
| 409 | Conflict | Workflow name may be duplicate |
| "method not allowed" | Wrong HTTP method | Use PUT for updates, POST for activate |

### WorkflowHasIssuesError

If execution fails with `WorkflowHasIssuesError`:

1. Check for nodes with incomplete configuration (empty required fields)
2. Common cause: Google Sheets without documentId selected
3. User must open workflow in n8n UI to complete configuration

### Google Sheets Configuration

**Placeholder (will cause error if executed):**
```json
{
  "documentId": {"__rl": true, "mode": "list", "value": ""},
  "sheetName": {"__rl": true, "mode": "list", "value": ""}
}
```

**If user provides spreadsheet URL:**
```json
{
  "documentId": {"__rl": true, "mode": "id", "value": "SPREADSHEET_ID_FROM_URL"},
  "sheetName": {"__rl": true, "mode": "name", "value": "Sheet1"}
}
```

---

## Debugging

### List Recent Executions (limit to 2)

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s "${N8N_API_URL}/api/v1/executions?limit=2" -H "X-N8N-API-KEY: ${N8N_API_KEY}" | jq '.data[] | {id, status, startedAt, workflowId}'
```

### Get Error Details

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s "${N8N_API_URL}/api/v1/executions/{EXECUTION_ID}?includeData=true" -H "X-N8N-API-KEY: ${N8N_API_KEY}" | jq '.data.resultData.error'
```

### Check Which Nodes Ran

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s "${N8N_API_URL}/api/v1/executions/{EXECUTION_ID}?includeData=true" -H "X-N8N-API-KEY: ${N8N_API_KEY}" | jq '.data.resultData.runData | keys'
```

### Get Node Output Data

```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s "${N8N_API_URL}/api/v1/executions/{EXECUTION_ID}?includeData=true" -H "X-N8N-API-KEY: ${N8N_API_KEY}" | jq '.data.resultData.runData["Node Name"]'
```
