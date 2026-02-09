# Trigger Nodes

Starting points for workflow execution.

## Contents
- [Webhook](#webhook)
- [Schedule Trigger](#schedule-trigger)
- [Form Trigger](#form-trigger)
- [Chat Trigger](#chat-trigger)
- [Airtable Trigger](#airtable-trigger)
- [Gmail Trigger](#gmail-trigger)
- [Slack Trigger](#slack-trigger)
- [Telegram Trigger](#telegram-trigger)
- [WhatsApp Trigger](#whatsapp-trigger)
- [HubSpot Trigger](#hubspot-trigger)
- [Stripe Trigger](#stripe-trigger)
- [Shopify Trigger](#shopify-trigger)
- [Postgres Trigger](#postgres-trigger)
- [Google Sheets Trigger](#google-sheets-trigger)

---

## Webhook

**ALWAYS use `responseMode: "onReceived"` (Respond Immediately) by default.**

```json
{
  "id": "webhook-1",
  "name": "Webhook",
  "type": "n8n-nodes-base.webhook",
  "typeVersion": 2,
  "position": [250, 300],
  "parameters": {
    "path": "my-webhook-path",
    "httpMethod": "POST",
    "responseMode": "onReceived",
    "options": {}
  },
  "webhookId": "unique-webhook-id"
}
```

**Response modes:**
- **`onReceived` - PREFERRED** - Respond immediately, workflow runs in background
- `lastNode` - Wait for workflow to complete and return last node's output
- `responseNode` - Wait for Respond to Webhook node (custom response)
- `streaming` - Stream response in real-time (v2.1+)

**Why `onReceived` is preferred:**
- Caller doesn't wait for long-running workflows
- No timeout issues on complex workflows
- Workflow runs reliably in background

**Authentication options:**
- `none` - No authentication
- `basicAuth` - Basic Auth
- `headerAuth` - Header Auth
- `jwtAuth` - JWT Auth

---

## Schedule Trigger

```json
{
  "id": "schedule-1",
  "name": "Schedule Trigger",
  "type": "n8n-nodes-base.scheduleTrigger",
  "typeVersion": 1.2,
  "position": [250, 300],
  "parameters": {
    "rule": {
      "interval": [
        {
          "field": "hours",
          "hoursInterval": 1
        }
      ]
    }
  }
}
```

**Common intervals:**

Every hour:
```json
{ "field": "hours", "hoursInterval": 1 }
```

Daily at 9 AM:
```json
{ "field": "days", "triggerAtHour": 9 }
```

Every 30 minutes:
```json
{ "field": "minutes", "minutesInterval": 30 }
```

Weekly on Monday at 9 AM:
```json
{ "field": "weeks", "triggerAtDay": [1], "triggerAtHour": 9 }
```

---

## Form Trigger

```json
{
  "id": "form-trigger-1",
  "name": "n8n Form Trigger",
  "type": "n8n-nodes-base.formTrigger",
  "typeVersion": 2.2,
  "position": [250, 300],
  "parameters": {
    "formTitle": "Contact Form",
    "formDescription": "Please fill out this form",
    "formFields": {
      "values": [
        {
          "fieldLabel": "Name",
          "fieldType": "text",
          "requiredField": true
        },
        {
          "fieldLabel": "Email",
          "fieldType": "email",
          "requiredField": true
        },
        {
          "fieldLabel": "Message",
          "fieldType": "textarea",
          "requiredField": false
        }
      ]
    },
    "options": {}
  },
  "webhookId": "unique-form-id"
}
```

**Field types:** `text`, `email`, `number`, `textarea`, `dropdown`, `date`, `file`

---

## Chat Trigger

```json
{
  "id": "chat-trigger-1",
  "name": "When chat message received",
  "type": "@n8n/n8n-nodes-langchain.chatTrigger",
  "typeVersion": 1.1,
  "position": [250, 300],
  "parameters": {
    "options": {}
  },
  "webhookId": "unique-chat-id"
}
```

Use with AI Agent for conversational workflows.

---

## Airtable Trigger

**Note:** Airtable Trigger (v1) uses `baseId`/`tableId` parameters. This is different from Airtable data node (v2.1) which uses `base`/`table`. Use the correct parameter names for each node type.

```json
{
  "id": "airtable-trigger-1",
  "name": "Airtable Trigger",
  "type": "n8n-nodes-base.airtableTrigger",
  "typeVersion": 1,
  "position": [250, 300],
  "parameters": {
    "pollTimes": {
      "item": [{ "mode": "everyMinute" }]
    },
    "baseId": {
      "__rl": true,
      "mode": "id",
      "value": "appXXXXXXXXXXXXXX"
    },
    "tableId": {
      "__rl": true,
      "mode": "id",
      "value": "tblXXXXXXXXXXXXXX"
    }
  },
  "credentials": {
    "airtableTokenApi": {
      "id": "cred-id",
      "name": "Airtable Token"
    }
  }
}
```

---

## Gmail Trigger

```json
{
  "id": "gmail-trigger-1",
  "name": "Gmail Trigger",
  "type": "n8n-nodes-base.gmailTrigger",
  "typeVersion": 1.2,
  "position": [250, 300],
  "parameters": {
    "pollTimes": {
      "item": [{ "mode": "everyMinute" }]
    },
    "filters": {
      "includeSpamTrash": false
    }
  },
  "credentials": {
    "gmailOAuth2": {
      "id": "cred-id",
      "name": "Gmail OAuth2"
    }
  }
}
```

---

## Slack Trigger

```json
{
  "id": "slack-trigger-1",
  "name": "Slack Trigger",
  "type": "n8n-nodes-base.slackTrigger",
  "typeVersion": 1,
  "position": [250, 300],
  "parameters": {
    "trigger": "onMessage",
    "channelId": {
      "__rl": true,
      "mode": "id",
      "value": "C0XXXXXXXXX"
    }
  },
  "credentials": {
    "slackOAuth2Api": {
      "id": "cred-id",
      "name": "Slack OAuth2"
    }
  }
}
```

**Trigger events:** `onMessage`, `onReactionAdded`, `onChannelCreated`, `onUserJoined`

---

## Telegram Trigger

```json
{
  "id": "telegram-trigger-1",
  "name": "Telegram Trigger",
  "type": "n8n-nodes-base.telegramTrigger",
  "typeVersion": 1.1,
  "position": [250, 300],
  "parameters": {
    "updates": ["message", "callback_query"]
  },
  "credentials": {
    "telegramApi": {
      "id": "cred-id",
      "name": "Telegram API"
    }
  }
}
```

**Update types:** `message`, `edited_message`, `callback_query`, `inline_query`, `channel_post`

---

## WhatsApp Trigger

```json
{
  "id": "whatsapp-trigger-1",
  "name": "WhatsApp Trigger",
  "type": "n8n-nodes-base.whatsAppTrigger",
  "typeVersion": 1,
  "position": [250, 300],
  "parameters": {
    "updates": ["messages"]
  },
  "credentials": {
    "whatsAppBusinessCloudApi": {
      "id": "cred-id",
      "name": "WhatsApp Business Cloud"
    }
  }
}
```

---

## HubSpot Trigger

```json
{
  "id": "hubspot-trigger-1",
  "name": "HubSpot Trigger",
  "type": "n8n-nodes-base.hubspotTrigger",
  "typeVersion": 1,
  "position": [250, 300],
  "parameters": {
    "eventsUi": {
      "eventValues": [
        {
          "name": "contact.creation"
        }
      ]
    }
  },
  "credentials": {
    "hubspotDeveloperApi": {
      "id": "cred-id",
      "name": "HubSpot Developer"
    }
  }
}
```

**Events:** `contact.creation`, `contact.propertyChange`, `deal.creation`, `deal.propertyChange`

---

## Stripe Trigger

```json
{
  "id": "stripe-trigger-1",
  "name": "Stripe Trigger",
  "type": "n8n-nodes-base.stripeTrigger",
  "typeVersion": 1,
  "position": [250, 300],
  "parameters": {
    "events": ["payment_intent.succeeded", "customer.subscription.created"]
  },
  "credentials": {
    "stripeApi": {
      "id": "cred-id",
      "name": "Stripe API"
    }
  }
}
```

**Common events:** `payment_intent.succeeded`, `customer.subscription.created`, `invoice.paid`, `checkout.session.completed`

---

## Shopify Trigger

```json
{
  "id": "shopify-trigger-1",
  "name": "Shopify Trigger",
  "type": "n8n-nodes-base.shopifyTrigger",
  "typeVersion": 1,
  "position": [250, 300],
  "parameters": {
    "topic": "orders/create"
  },
  "credentials": {
    "shopifyApi": {
      "id": "cred-id",
      "name": "Shopify API"
    }
  }
}
```

**Topics:** `orders/create`, `orders/updated`, `products/create`, `customers/create`

---

## Postgres Trigger

```json
{
  "id": "postgres-trigger-1",
  "name": "Postgres Trigger",
  "type": "n8n-nodes-base.postgresTrigger",
  "typeVersion": 1,
  "position": [250, 300],
  "parameters": {
    "triggerMode": "createTrigger",
    "schema": "public",
    "tableName": "users",
    "channelName": "n8n_changes",
    "firesOn": "INSERT"
  },
  "credentials": {
    "postgres": {
      "id": "cred-id",
      "name": "Postgres"
    }
  }
}
```

**Fires on:** `INSERT`, `UPDATE`, `DELETE`

---

## Google Sheets Trigger

```json
{
  "id": "sheets-trigger-1",
  "name": "Google Sheets Trigger",
  "type": "n8n-nodes-base.googleSheetsTrigger",
  "typeVersion": 1,
  "position": [250, 300],
  "parameters": {
    "pollTimes": {
      "item": [{ "mode": "everyMinute" }]
    },
    "documentId": {
      "__rl": true,
      "mode": "id",
      "value": "SPREADSHEET_ID"
    },
    "sheetName": {
      "__rl": true,
      "mode": "name",
      "value": "Sheet1"
    },
    "event": "rowAdded"
  },
  "credentials": {
    "googleSheetsOAuth2Api": {
      "id": "cred-id",
      "name": "Google Sheets OAuth2"
    }
  }
}
```

**Events:** `rowAdded`, `rowUpdated`

---

## Quick Reference: Trigger typeVersions

| Node | typeVersion |
|------|-------------|
| Webhook | 2 |
| Schedule Trigger | 1.2 |
| Form Trigger | 2.2 |
| Chat Trigger | 1.1 |
| Airtable Trigger | 1 |
| Gmail Trigger | 1.2 |
| Slack Trigger | 1 |
| Telegram Trigger | 1.1 |
| WhatsApp Trigger | 1 |
| HubSpot Trigger | 1 |
| Stripe Trigger | 1 |
| Shopify Trigger | 1 |
| Postgres Trigger | 1 |
| Google Sheets Trigger | 1 |
