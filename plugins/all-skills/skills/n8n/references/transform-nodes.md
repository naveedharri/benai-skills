# Transform & Utility Nodes

Nodes for data transformation, logic, and workflow control.

## Contents
- [Set](#set)
- [If](#if)
- [Switch](#switch)
- [Filter](#filter)
- [Sort](#sort)
- [Split Out](#split-out)
- [Merge](#merge)
- [Code](#code)
- [HTTP Request](#http-request)
- [Wait](#wait)
- [Split In Batches](#split-in-batches)
- [Respond to Webhook](#respond-to-webhook)
- [Connection Patterns](#connection-patterns)

---

## Set

**Add/modify fields:**
```json
{
  "id": "set-1",
  "name": "Set",
  "type": "n8n-nodes-base.set",
  "typeVersion": 3.4,
  "position": [450, 300],
  "parameters": {
    "mode": "manual",
    "duplicateItem": false,
    "assignments": {
      "assignments": [
        {
          "id": "uuid-1",
          "name": "fullName",
          "value": "={{ $json.firstName }} {{ $json.lastName }}",
          "type": "string"
        },
        {
          "id": "uuid-2",
          "name": "processed",
          "value": true,
          "type": "boolean"
        }
      ]
    },
    "includeOtherFields": true,
    "options": {}
  }
}
```

---

## If

**Conditional branching:**
```json
{
  "id": "if-1",
  "name": "If",
  "type": "n8n-nodes-base.if",
  "typeVersion": 2.2,
  "position": [450, 300],
  "parameters": {
    "conditions": {
      "options": {
        "caseSensitive": true,
        "leftValue": "",
        "typeValidation": "strict",
        "version": 2
      },
      "conditions": [
        {
          "id": "condition-1",
          "leftValue": "={{ $json.status }}",
          "rightValue": "active",
          "operator": {
            "type": "string",
            "operation": "equals"
          }
        }
      ],
      "combinator": "and"
    },
    "options": {}
  }
}
```

---

## Switch

**Multiple branches:**
```json
{
  "id": "switch-1",
  "name": "Switch",
  "type": "n8n-nodes-base.switch",
  "typeVersion": 3.2,
  "position": [450, 300],
  "parameters": {
    "mode": "rules",
    "rules": {
      "values": [
        {
          "outputKey": "high",
          "conditions": {
            "options": { "version": 2, "caseSensitive": true, "typeValidation": "strict" },
            "conditions": [
              {
                "leftValue": "={{ $json.priority }}",
                "rightValue": "high",
                "operator": { "type": "string", "operation": "equals" }
              }
            ],
            "combinator": "and"
          },
          "renameOutput": true
        },
        {
          "outputKey": "low",
          "conditions": {
            "options": { "version": 2, "caseSensitive": true, "typeValidation": "strict" },
            "conditions": [
              {
                "leftValue": "={{ $json.priority }}",
                "rightValue": "low",
                "operator": { "type": "string", "operation": "equals" }
              }
            ],
            "combinator": "and"
          },
          "renameOutput": true
        }
      ]
    },
    "options": {}
  }
}
```

---

## Filter

**Remove items that don't match conditions:**
```json
{
  "id": "filter-1",
  "name": "Filter",
  "type": "n8n-nodes-base.filter",
  "typeVersion": 2.3,
  "position": [450, 300],
  "parameters": {
    "conditions": {
      "options": {
        "caseSensitive": true,
        "leftValue": "",
        "typeValidation": "strict",
        "version": 2
      },
      "conditions": [
        {
          "id": "condition-1",
          "leftValue": "={{ $json.status }}",
          "rightValue": "active",
          "operator": {
            "type": "string",
            "operation": "equals"
          }
        }
      ],
      "combinator": "and"
    },
    "looseTypeValidation": false
  }
}
```

**Multiple conditions:**
```json
{
  "parameters": {
    "conditions": {
      "options": {
        "version": 2,
        "caseSensitive": true,
        "typeValidation": "strict"
      },
      "conditions": [
        {
          "leftValue": "={{ $json.price }}",
          "rightValue": 100,
          "operator": { "type": "number", "operation": "gt" }
        },
        {
          "leftValue": "={{ $json.inStock }}",
          "rightValue": true,
          "operator": { "type": "boolean", "operation": "equals" }
        }
      ],
      "combinator": "and"
    }
  }
}
```

**Operators:**
- String: `equals`, `notEquals`, `contains`, `notContains`, `startsWith`, `endsWith`, `regex`
- Number: `equals`, `notEquals`, `gt`, `gte`, `lt`, `lte`
- Boolean: `equals`, `notEquals`

---

## Sort

**Sort by field:**
```json
{
  "id": "sort-1",
  "name": "Sort",
  "type": "n8n-nodes-base.sort",
  "typeVersion": 1,
  "position": [450, 300],
  "parameters": {
    "type": "simple",
    "sortFieldsUi": {
      "sortField": [
        {
          "fieldName": "createdAt",
          "order": "descending"
        }
      ]
    },
    "options": {}
  }
}
```

**Sort by multiple fields:**
```json
{
  "parameters": {
    "type": "simple",
    "sortFieldsUi": {
      "sortField": [
        {
          "fieldName": "priority",
          "order": "ascending"
        },
        {
          "fieldName": "createdAt",
          "order": "descending"
        }
      ]
    }
  }
}
```

**Random shuffle:**
```json
{
  "parameters": {
    "type": "random"
  }
}
```

**Custom code sort:**
```json
{
  "parameters": {
    "type": "code",
    "code": "fieldName = 'score';\n\nif (a.json[fieldName] < b.json[fieldName]) {\n  return -1;\n}\nif (a.json[fieldName] > b.json[fieldName]) {\n  return 1;\n}\nreturn 0;"
  }
}
```

**Sort types:** `simple`, `random`, `code`

---

## Split Out

**Turn a list inside items into separate items:**
```json
{
  "id": "split-out-1",
  "name": "Split Out",
  "type": "n8n-nodes-base.splitOut",
  "typeVersion": 1,
  "position": [450, 300],
  "parameters": {
    "fieldToSplitOut": "items",
    "include": "noOtherFields",
    "options": {}
  }
}
```

**Include other fields:**
```json
{
  "parameters": {
    "fieldToSplitOut": "products",
    "include": "allOtherFields"
  }
}
```

**Include specific fields:**
```json
{
  "parameters": {
    "fieldToSplitOut": "tags",
    "include": "selectedOtherFields",
    "fieldsToInclude": "id, name, category"
  }
}
```

**Include options:**
- `noOtherFields` - Only the split out field
- `allOtherFields` - Include all other fields
- `selectedOtherFields` - Include specific fields

---

## Merge

**Combine by position:**
```json
{
  "id": "merge-1",
  "name": "Merge",
  "type": "n8n-nodes-base.merge",
  "typeVersion": 3,
  "position": [650, 300],
  "parameters": {
    "mode": "combine",
    "combineBy": "combineByPosition",
    "options": {
      "includeUnpaired": true
    }
  }
}
```

**Choose branch:**
```json
{
  "parameters": {
    "mode": "chooseBranch",
    "numberInputs": 2
  }
}
```

---

## Code

**JavaScript:**
```json
{
  "id": "code-1",
  "name": "Code",
  "type": "n8n-nodes-base.code",
  "typeVersion": 2,
  "position": [450, 300],
  "parameters": {
    "language": "javaScript",
    "mode": "runOnceForAllItems",
    "jsCode": "const results = [];\n\nfor (const item of $input.all()) {\n  results.push({\n    json: {\n      ...item.json,\n      processed: true,\n      timestamp: new Date().toISOString()\n    }\n  });\n}\n\nreturn results;"
  }
}
```

**Python:**
```json
{
  "parameters": {
    "language": "pythonNative",
    "mode": "runOnceForAllItems",
    "pythonCode": "results = []\n\nfor item in _input.all():\n    results.append({\n        \"json\": {\n            **item.json,\n            \"processed\": True\n        }\n    })\n\nreturn results"
  }
}
```

---

## HTTP Request

```json
{
  "id": "http-1",
  "name": "HTTP Request",
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.4,
  "position": [450, 300],
  "parameters": {
    "method": "POST",
    "url": "https://api.example.com/endpoint",
    "authentication": "genericCredentialType",
    "genericAuthType": "httpHeaderAuth",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ]
    },
    "sendBody": true,
    "specifyBody": "json",
    "jsonBody": "{\n  \"key\": \"{{ $json.value }}\"\n}",
    "options": {}
  },
  "credentials": {
    "httpHeaderAuth": {
      "id": "cred-id",
      "name": "API Key"
    }
  }
}
```

**GET request:**
```json
{
  "parameters": {
    "method": "GET",
    "url": "https://api.example.com/data",
    "authentication": "none",
    "sendQuery": true,
    "queryParameters": {
      "parameters": [
        { "name": "limit", "value": "10" },
        { "name": "offset", "value": "={{ $json.offset }}" }
      ]
    },
    "options": {}
  }
}
```

**Methods:** `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`

**Body types:**
- `json` - JSON body
- `form-urlencoded` - Form URL encoded
- `multipart-form-data` - Form data (file uploads)
- `raw` - Raw content
- `binaryData` - Binary file

**Authentication types:**
- `none` - No authentication
- `predefinedCredentialType` - Use predefined credentials (OAuth, API keys)
- `genericCredentialType` - Generic header/query/basic auth

---

## Wait

**Time interval:**
```json
{
  "id": "wait-1",
  "name": "Wait",
  "type": "n8n-nodes-base.wait",
  "typeVersion": 1.1,
  "position": [450, 300],
  "parameters": {
    "resume": "timeInterval",
    "amount": 5,
    "unit": "seconds"
  }
}
```

**Wait for webhook:**
```json
{
  "parameters": {
    "resume": "webhook",
    "responseData": "allEntries",
    "options": {}
  }
}
```

---

## Split In Batches

```json
{
  "id": "batch-1",
  "name": "Split In Batches",
  "type": "n8n-nodes-base.splitInBatches",
  "typeVersion": 3,
  "position": [450, 300],
  "parameters": {
    "batchSize": 10,
    "options": {}
  }
}
```

---

## Respond to Webhook

```json
{
  "id": "respond-1",
  "name": "Respond to Webhook",
  "type": "n8n-nodes-base.respondToWebhook",
  "typeVersion": 1.1,
  "position": [850, 300],
  "parameters": {
    "respondWith": "json",
    "responseBody": "={{ JSON.stringify({ success: true, data: $json }) }}",
    "options": {}
  }
}
```

---

## Connection Patterns

### Basic Linear Connection

```json
{
  "connections": {
    "Webhook": {
      "main": [[{ "node": "Set", "type": "main", "index": 0 }]]
    },
    "Set": {
      "main": [[{ "node": "Google Sheets", "type": "main", "index": 0 }]]
    }
  }
}
```

### If Node (Two Branches)

```json
{
  "connections": {
    "If": {
      "main": [
        [{ "node": "True Branch", "type": "main", "index": 0 }],
        [{ "node": "False Branch", "type": "main", "index": 0 }]
      ]
    }
  }
}
```

### Switch Node (Multiple Branches)

```json
{
  "connections": {
    "Switch": {
      "main": [
        [{ "node": "High Priority", "type": "main", "index": 0 }],
        [{ "node": "Medium Priority", "type": "main", "index": 0 }],
        [{ "node": "Low Priority", "type": "main", "index": 0 }]
      ]
    }
  }
}
```

### Merge (Multiple Inputs)

```json
{
  "connections": {
    "Branch A": {
      "main": [[{ "node": "Merge", "type": "main", "index": 0 }]]
    },
    "Branch B": {
      "main": [[{ "node": "Merge", "type": "main", "index": 1 }]]
    }
  }
}
```

---

## Looping Patterns

**ALWAYS prefer the Loop node (Split In Batches) for processing multiple items.**

Why Loop node is preferred:
- Visually cleaner in the n8n UI
- Easy to understand the flow
- Built-in batch size control
- Clear "done" vs "loop" outputs
- Better than Code node loops or manual iteration

### Split In Batches Loop (PREFERRED - Most Common)

## ⚠️ CRITICAL: Split In Batches Output Indexes

**THIS IS THE #1 MISTAKE WITH LOOPS. GET THIS RIGHT OR THE LOOP WON'T WORK!**

```
Split In Batches has TWO outputs:
┌─────────────────────────────┐
│   Split In Batches          │
│                             │
│  Output 0 ──→ "DONE"        │  ← Items go here AFTER all items processed
│  Output 1 ──→ "LOOP"        │  ← Current batch goes here (CONNECT PROCESSING HERE!)
└─────────────────────────────┘
```

**Output 0 = DONE** - Empty during loop, receives all items when loop completes
**Output 1 = LOOP** - Receives current batch item(s) for processing

```
❌ WRONG - Connecting processing to output 0:
"Loop Over Items": {
  "main": [
    [{ "node": "Process Item", "type": "main", "index": 0 }],  // OUTPUT 0 - WRONG!
    []
  ]
}

✅ CORRECT - Connecting processing to output 1:
"Loop Over Items": {
  "main": [
    [],                                                         // OUTPUT 0 - empty or "Done" node
    [{ "node": "Process Item", "type": "main", "index": 0 }]   // OUTPUT 1 - processing goes here!
  ]
}
```

### Complete Loop Example

**Use case:** Process items one at a time, with processing node in between.

```json
{
  "nodes": [
    {
      "id": "loop-1",
      "name": "Loop Over Items",
      "type": "n8n-nodes-base.splitInBatches",
      "typeVersion": 3,
      "position": [450, 300],
      "parameters": {
        "batchSize": 1,
        "options": {}
      }
    },
    {
      "id": "process-1",
      "name": "Process Item",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [650, 400],
      "parameters": {
        "mode": "manual",
        "assignments": {
          "assignments": [
            {
              "id": "uuid-1",
              "name": "processed",
              "value": true,
              "type": "boolean"
            }
          ]
        }
      }
    },
    {
      "id": "done-1",
      "name": "Loop Done",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.4,
      "position": [650, 200],
      "parameters": {
        "mode": "manual",
        "assignments": {
          "assignments": [
            {
              "id": "uuid-done",
              "name": "status",
              "value": "completed",
              "type": "string"
            }
          ]
        }
      }
    }
  ],
  "connections": {
    "Get Items": {
      "main": [[{ "node": "Loop Over Items", "type": "main", "index": 0 }]]
    },
    "Loop Over Items": {
      "main": [
        [{ "node": "Loop Done", "type": "main", "index": 0 }],
        [{ "node": "Process Item", "type": "main", "index": 0 }]
      ]
    },
    "Process Item": {
      "main": [[{ "node": "Loop Over Items", "type": "main", "index": 0 }]]
    }
  }
}
```

**Key points:**
- **Output 0** → "Loop Done" node (runs AFTER all items processed)
- **Output 1** → "Process Item" node (runs for EACH item)
- "Process Item" connects BACK to "Loop Over Items" input (loops back)
- Loop continues until all items processed, then exits via output 0

**Visual connection pattern:**
```
                                 ┌──→ [Output 0: DONE] → "Loop Done" → Continue workflow
                                 │
Get Items → Loop Over Items ─────┤
                                 │
                                 └──→ [Output 1: LOOP] → "Process Item" ─┐
                                              ↑                          │
                                              └──────────────────────────┘
```

### Minimal Loop (No Done Handler)

If you don't need to do anything after the loop, output 0 can be empty:

```json
{
  "connections": {
    "Loop Over Items": {
      "main": [
        [],                                                         // Output 0: empty (loop just ends)
        [{ "node": "Process Item", "type": "main", "index": 0 }]   // Output 1: processing
      ]
    },
    "Process Item": {
      "main": [[{ "node": "Loop Over Items", "type": "main", "index": 0 }]]
    }
  }
}
```

### If/Else Branch with Loop Back

**Use case:** Check condition, process if needed, loop back for retry or continuation.

```json
{
  "connections": {
    "Check Condition": {
      "main": [
        [{ "node": "Process New", "type": "main", "index": 0 }],
        [{ "node": "Skip Existing", "type": "main", "index": 0 }]
      ]
    },
    "Process New": {
      "main": [[{ "node": "Save Result", "type": "main", "index": 0 }]]
    },
    "Save Result": {
      "main": [[{ "node": "Loop Over Items", "type": "main", "index": 0 }]]
    },
    "Skip Existing": {
      "main": [[{ "node": "Loop Over Items", "type": "main", "index": 0 }]]
    }
  }
}
```

**Key points:**
- Both branches (true and false) loop back to Split In Batches
- Ensures every item is processed and loop continues

### Wait + Retry Loop

**Use case:** Wait between API calls, retry on failure.

```json
{
  "nodes": [
    {
      "id": "wait-1",
      "name": "Wait Between Calls",
      "type": "n8n-nodes-base.wait",
      "typeVersion": 1.1,
      "position": [450, 300],
      "parameters": {
        "resume": "timeInterval",
        "amount": 2,
        "unit": "seconds"
      }
    }
  ],
  "connections": {
    "API Call": {
      "main": [[{ "node": "Check Success", "type": "main", "index": 0 }]]
    },
    "Check Success": {
      "main": [
        [{ "node": "Continue", "type": "main", "index": 0 }],
        [{ "node": "Wait Between Calls", "type": "main", "index": 0 }]
      ]
    },
    "Wait Between Calls": {
      "main": [[{ "node": "API Call", "type": "main", "index": 0 }]]
    }
  }
}
```

### Pagination Loop

**Use case:** Fetch paginated API results until no more pages.

```json
{
  "nodes": [
    {
      "id": "fetch-1",
      "name": "Fetch Page",
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.4,
      "position": [450, 300],
      "parameters": {
        "method": "GET",
        "url": "https://api.example.com/items",
        "sendQuery": true,
        "queryParameters": {
          "parameters": [
            { "name": "page", "value": "={{ $json.nextPage ?? 1 }}" },
            { "name": "limit", "value": "100" }
          ]
        }
      }
    },
    {
      "id": "check-1",
      "name": "Has More Pages",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2.2,
      "position": [650, 300],
      "parameters": {
        "conditions": {
          "options": { "version": 2, "caseSensitive": true, "typeValidation": "strict" },
          "conditions": [
            {
              "leftValue": "={{ $json.hasNextPage }}",
              "rightValue": true,
              "operator": { "type": "boolean", "operation": "equals" }
            }
          ],
          "combinator": "and"
        }
      }
    }
  ],
  "connections": {
    "Fetch Page": {
      "main": [[{ "node": "Process Items", "type": "main", "index": 0 }]]
    },
    "Process Items": {
      "main": [[{ "node": "Has More Pages", "type": "main", "index": 0 }]]
    },
    "Has More Pages": {
      "main": [
        [{ "node": "Fetch Page", "type": "main", "index": 0 }],
        [{ "node": "Done", "type": "main", "index": 0 }]
      ]
    }
  }
}
```

---

## Quick Reference: Transform Node typeVersions

| Node | typeVersion |
|------|-------------|
| Set | 3.4 |
| If | 2.2 |
| Switch | 3.2 |
| Filter | 2.3 |
| Sort | 1 |
| Split Out | 1 |
| Merge | 3 |
| Code | 2 |
| HTTP Request | 4.4 |
| Wait | 1.1 |
| Split In Batches | 3 |
| Respond to Webhook | 1.1 |
