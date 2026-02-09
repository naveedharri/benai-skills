# Node Configuration Patterns

Common node configurations and workflow patterns.

## Contents
- [Node Configurations](#node-configurations)
- [Workflow Patterns](#workflow-patterns)

---

## Node Configurations

### Webhook Node

```json
{
  "type": "n8n-nodes-base.webhook",
  "typeVersion": 2,
  "parameters": {
    "path": "my-webhook-path",
    "httpMethod": "POST",
    "responseMode": "responseNode",
    "options": {}
  }
}
```

**Key settings:**
- `path`: Unique URL path (no leading slash)
- `httpMethod`: GET, POST, PUT, DELETE
- `responseMode`: `onReceived` (immediate) or `responseNode` (wait for Respond node)

### HTTP Request Node

```json
{
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.2,
  "parameters": {
    "method": "POST",
    "url": "https://api.example.com/endpoint",
    "authentication": "genericCredentialType",
    "genericAuthType": "httpHeaderAuth",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        { "name": "Content-Type", "value": "application/json" }
      ]
    },
    "sendBody": true,
    "bodyParameters": {
      "parameters": [
        { "name": "key", "value": "={{ $json.value }}" }
      ]
    }
  }
}
```

### Set Node (Add/Modify Fields)

```json
{
  "type": "n8n-nodes-base.set",
  "typeVersion": 3.4,
  "parameters": {
    "mode": "manual",
    "duplicateItem": false,
    "assignments": {
      "assignments": [
        {
          "id": "field1",
          "name": "newField",
          "value": "={{ $json.existingField }}",
          "type": "string"
        }
      ]
    },
    "includeOtherFields": true
  }
}
```

### If Node (Conditional)

```json
{
  "type": "n8n-nodes-base.if",
  "typeVersion": 2,
  "parameters": {
    "conditions": {
      "options": {
        "caseSensitive": true,
        "leftValue": "",
        "typeValidation": "strict"
      },
      "conditions": [
        {
          "leftValue": "={{ $json.status }}",
          "rightValue": "active",
          "operator": {
            "type": "string",
            "operation": "equals"
          }
        }
      ],
      "combinator": "and"
    }
  }
}
```

### Switch Node (Multiple Branches)

```json
{
  "type": "n8n-nodes-base.switch",
  "typeVersion": 3,
  "parameters": {
    "mode": "rules",
    "rules": {
      "rules": [
        {
          "outputKey": "high",
          "conditions": {
            "conditions": [
              {
                "leftValue": "={{ $json.priority }}",
                "rightValue": "high",
                "operator": { "type": "string", "operation": "equals" }
              }
            ]
          }
        },
        {
          "outputKey": "low",
          "conditions": {
            "conditions": [
              {
                "leftValue": "={{ $json.priority }}",
                "rightValue": "low",
                "operator": { "type": "string", "operation": "equals" }
              }
            ]
          }
        }
      ]
    }
  }
}
```

### Loop Over Items Node

```json
{
  "type": "n8n-nodes-base.splitInBatches",
  "typeVersion": 3,
  "parameters": {
    "batchSize": 10,
    "options": {}
  }
}
```

### Merge Node

```json
{
  "type": "n8n-nodes-base.merge",
  "typeVersion": 3,
  "parameters": {
    "mode": "combine",
    "mergeByFields": {
      "values": [
        { "field1": "id", "field2": "userId" }
      ]
    },
    "options": {}
  }
}
```

**Merge modes:**
- `append`: Combine all items from both inputs
- `combine`: Match items by field values
- `chooseBranch`: Select one input based on condition

---

## Workflow Patterns

### Pattern 1: Webhook + Process + Respond

```
[Webhook] -> [Code/Set] -> [Respond to Webhook]
```

Standard request-response pattern. Set webhook `responseMode: "responseNode"`.

### Pattern 2: Fan-out/Fan-in

```
                  -> [Process A] -
[Split Items] -|                   |-> [Merge] -> [Output]
                  -> [Process B] -
```

Process items in parallel branches, then combine results.

### Pattern 3: Error Handling Branch

```
[Main Process] --success--> [Continue]
       |
       +--error--> [Error Handler] -> [Notify]
```

Configure node with `continueOnFail: true` and check for errors.

### Pattern 4: Retry with Backoff

```json
{
  "type": "n8n-nodes-base.httpRequest",
  "retryOnFail": true,
  "maxTries": 3,
  "waitBetweenTries": 1000
}
```

### Pattern 5: Pagination Loop

```
[HTTP Request] -> [Check Has More] --yes--> [Update Page] -> [HTTP Request]
                        |
                        +--no--> [Aggregate Results]
```

For APIs that return paginated results.

### Pattern 6: Conditional Execution

```
[Webhook] -> [If Condition] --true--> [Action A]
                   |
                   +--false--> [Action B]
```

### Pattern 7: Data Enrichment

```
[Get Base Data] -> [Loop] -> [Fetch Details] -> [Merge] -> [Output]
```

Fetch main records, then enrich each with additional API calls.

### Pattern 8: Scheduled Sync

```
[Schedule Trigger] -> [Get New Records] -> [If Has Records] -> [Process] -> [Update Sync Timestamp]
```
