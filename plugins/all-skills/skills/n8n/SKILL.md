---
name: n8n
description: Build, test, and deploy n8n workflows via REST API with incremental testing. Expert automation for n8n. USE THIS SKILL WHEN user says "create workflow", "build automation", "deploy to n8n", "activate workflow", needs to list, update, delete, or test workflows, mentions webhook execution, checking executions, debugging workflow runs, asks about n8n nodes, expressions, credentials, or Code nodes, needs JavaScript or Python code for n8n Code nodes, mentions expressions, $json, $input, or $node references, or asks about AI Agent, OpenAI, Anthropic, Google Sheets, Airtable, Slack, or other n8n nodes.
---

# n8n Automation Skill

Build, test, and deploy n8n workflows via REST API with incremental testing.

---

## When This Skill Loads (DO THIS IMMEDIATELY)

### Step 1: Read Reference Files
```
Use the Read tool to read these files NOW:
1. Read references/pitfalls.md (critical command format rules)
2. Read references/build-process.md (step-by-step build workflow)
```

### Step 2: Check .env Configuration
```
Read the .env file in the working directory to verify:
- N8N_API_URL is set
- N8N_API_KEY is set
- N8N_CREDENTIALS_TEMPLATE_URL is set
```

If any values are missing, ask the user for ALL of them in a single prompt.

### Step 3: Create a Todo List

After understanding the user's request, create a todo list using TaskCreate.

```
SKILL LOADS -> READ FILES IMMEDIATELY -> CHECK .env -> THEN respond to user
```

---

## Critical Rules

### 1. USE THE TOOLS THE USER SPECIFIES

**If the user mentions specific tools, nodes, or services - YOU MUST USE THEM.**

```
User says "use Apify" -> You use Apify node
User says "use OpenAI" -> You use OpenAI Chat Model
```

Never substitute, skip, or defer user-requested tools.

### 2. NEVER Simplify When Hitting Errors - FIX THE ISSUE

```
Loop node has error -> Debug why -> Fix the loop configuration
```

Don't switch to "simpler" approaches. Keep the correct architecture.

### 3. Only Use Nodes From Credentials Template

Never add nodes requiring authentication unless:
1. The node exists in the user's credentials template, OR
2. The user explicitly asks to use that specific tool/service

### 4. Only Use Node Types/Versions That Are INSTALLED

Always copy `type` AND `typeVersion` from the credentials template.

### 5. One Node at a Time

```
ADD NODE -> TEST -> ADD NEXT NODE -> TEST -> REPEAT
```

**NEVER add 2+ nodes without testing between them.**

### 6. NEVER Delete or Deactivate Workflows - UPDATE Instead

```
Node fails -> Debug the error -> Update the same workflow (PUT)
```

One workflow ID for the entire build process.

### 7. Use Native Nodes First

| Priority | Use When |
|----------|----------|
| 1. Native node | Built-in exists (Slack, Sheets, etc.) |
| 2. AI Agent node | For ANY AI/LLM task |
| 3. Loop node | For processing multiple items |
| 4. HTTP Request | Native has issues OR no node exists |
| 5. Code node | Complex logic only |

### 8. No Mock Data

Never use placeholder URLs, fake IDs, or "REPLACE_ME" values.

### 9. Test with 2 Items

Always set `limit=2` on data-fetching nodes for fast testing.

### 10. Only Work With User-Specified Workflows

Never check, run, or modify workflows the user didn't mention.

---

## Build Process

### Step 0: Fetch Schema (If Database Involved)
```
1. Create temp workflow: Webhook + getSchema/getAll node
2. Execute to fetch actual field names
3. Use exact field names in main workflow
```

### Step 1: Create Workflow with Trigger
```
1. Read references/triggers.md
2. Create workflow with trigger only
3. Test trigger
```

### Step 2: Add Each Node
```
1. Read relevant reference file for this node type
2. Add ONE node to workflow
3. Test workflow
4. If ERROR -> fix -> retry
5. If SUCCESS -> move to next node
```

### Step 3: Final Verification
```
1. All nodes added and tested
2. Workflow activated
3. Report success to user
```

---

## API Methods Quick Reference

| Operation | Method | Endpoint |
|-----------|--------|----------|
| Create | POST | `/api/v1/workflows` |
| Update | **PUT** | `/api/v1/workflows/{id}` |
| Activate | **POST** | `/api/v1/workflows/{id}/activate` |
| Deactivate | **POST** | `/api/v1/workflows/{id}/deactivate` |
| Delete | DELETE | `/api/v1/workflows/{id}` |
| Execute | POST | `/webhook/{path}` |

---

## API Call Format

**CRITICAL RULES:**
1. **NEVER write JSON files to disk** - Always use API directly
2. **NEVER use `\` line continuations** - Causes errors
3. **Always single-line commands** - Or heredoc for large JSON

**GET:**
```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s "${N8N_API_URL}/api/v1/ENDPOINT" -H "X-N8N-API-KEY: ${N8N_API_KEY}" | jq .
```

**POST/PUT (large JSON):**
```bash
export $(cat .env | grep -v '^#' | xargs) && curl -s -X POST "${N8N_API_URL}/api/v1/workflows" -H "X-N8N-API-KEY: ${N8N_API_KEY}" -H "Content-Type: application/json" -d "$(cat <<'EOF'
{
  "name": "My Workflow",
  "nodes": [...],
  "connections": {},
  "settings": {"executionOrder": "v1"}
}
EOF
)"
```

---

## Workflow JSON Structure

```json
{
  "name": "Workflow Name",
  "nodes": [
    {
      "id": "unique-node-id",
      "name": "Node Display Name",
      "type": "n8n-nodes-base.nodeName",
      "typeVersion": 1,
      "position": [250, 300],
      "parameters": {},
      "credentials": {}
    }
  ],
  "connections": {
    "Source Node Name": {
      "main": [[{"node": "Target Node Name", "type": "main", "index": 0}]]
    }
  },
  "settings": {"executionOrder": "v1"}
}
```

---

## Reference Files

Read these files as needed using the Read tool:

### Core API & Build Process
| File | Contents |
|------|----------|
| [references/api-reference.md](references/api-reference.md) | All API commands (CRUD, executions, tags, variables) |
| [references/build-process.md](references/build-process.md) | Step-by-step build-test workflow |
| [references/pitfalls.md](references/pitfalls.md) | **CRITICAL**: Command format rules, common mistakes |

### Node Reference
| File | Contents |
|------|----------|
| [references/triggers.md](references/triggers.md) | Webhook, Schedule, Form, Chat, and service triggers |
| [references/ai-nodes.md](references/ai-nodes.md) | AI Agent, OpenAI/Anthropic Chat Models, Memory, Vector Store |
| [references/data-nodes.md](references/data-nodes.md) | Google Sheets, Airtable, Notion, Postgres, Slack, Gmail, etc. |
| [references/transform-nodes.md](references/transform-nodes.md) | Set, If, Switch, Filter, Merge, Code, HTTP Request, Loops |

### Code & Expressions
| File | Contents |
|------|----------|
| [references/javascript.md](references/javascript.md) | JavaScript patterns for Code nodes |
| [references/python.md](references/python.md) | Python patterns for Code nodes |
| [references/node-config.md](references/node-config.md) | Node configurations and workflow patterns |
| [references/expressions.md](references/expressions.md) | Expression syntax (`{{ $json.field }}`) |
| [references/credentials.md](references/credentials.md) | Credential template usage |

---

## Node Selection Flow

**Before adding ANY node:**

```
1. Read the relevant reference file (triggers.md, ai-nodes.md, etc.)
2. Check if node is in credentials template
3. Get correct typeVersion and parameters
4. If DATABASE node -> FETCH SCHEMA first
5. Add node with correct config
```

---

## Expression Quick Reference

```javascript
// Webhook body (CRITICAL - data is under .body!)
{{ $json.body.fieldName }}

// Other node reference
{{ $('Node Name').item.json.field }}

// Default value
{{ $json.field ?? 'default' }}

// Safe access
{{ $json.obj?.nested?.field }}

// Current date
{{ $now.toFormat('yyyy-MM-dd') }}
```

**In Code nodes, use plain JavaScript - NOT `{{ }}`:**
```javascript
const data = $input.first().json.body;
return [{ json: { result: data.fieldName } }];
```

---

## Code Node Quick Reference

### JavaScript
```javascript
// Input access
const items = $input.all();
const first = $input.first().json;

// Other nodes
const data = $('Node Name').first().json;

// Return (MUST be array with json key)
return [{ json: { result: 'value' } }];
```

### Python
```python
# Input access
items = _input.all()
first = _input.first().json

# Return (MUST be list)
return [{"json": {"result": "value"}}]
```

---

## Testing After Each Node

```bash
# 1. Activate
curl -X POST "${N8N_API_URL}/api/v1/workflows/{id}/activate"

# 2. Execute
curl -X POST "${N8N_API_URL}/webhook/{path}" -d '{}'

# 3. Check status
curl "${N8N_API_URL}/api/v1/executions?limit=1" | jq '.data[0].status'

# 4. Verify node ran
curl "${N8N_API_URL}/api/v1/executions/{id}?includeData=true" | jq '.data.resultData.runData | keys'
```

**Do NOT proceed until status = "success" and new node appears in runData.**

---

## What to Report to User

**After successful build:**
```
Build Progress:
1. Webhook trigger - working
2. HTTP Request - working (2 results)
3. Google Sheets - working

- Workflow: My Workflow
- URL: https://n8n.example.com/workflow/abc123
- Status: Active
```

**If manual config needed:**
```
Workflow built and partially tested!

Google Sheets requires manual setup:
- Open workflow in n8n UI
- Select your spreadsheet
- Save
```
