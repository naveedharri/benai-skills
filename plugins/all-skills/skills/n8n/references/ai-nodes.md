# AI Nodes

LangChain-powered AI nodes for agents, chat models, embeddings, memory, and vector stores.

## Contents
- [AI Agent](#ai-agent)
- [OpenAI Chat Model](#openai-chat-model)
- [Anthropic Chat Model](#anthropic-chat-model)
- [OpenAI Embeddings](#openai-embeddings)
- [Simple Memory](#simple-memory)
- [Simple Vector Store](#simple-vector-store)
- [Connection Patterns](#connection-patterns)

---

## AI Agent

```json
{
  "id": "ai-agent-1",
  "name": "AI Agent",
  "type": "@n8n/n8n-nodes-langchain.agent",
  "typeVersion": 3.1,
  "position": [650, 300],
  "parameters": {
    "promptType": "define",
    "text": "={{ $json.body.message }}",
    "hasOutputParser": false,
    "options": {
      "systemMessage": "You are a helpful assistant. Answer questions concisely."
    }
  }
}
```

**Prompt source options:**
- `auto` - Connected Chat Trigger Node (default)
- `define` - Define prompt manually

**Important:** The AI Agent requires a chat model connected via `ai_languageModel` input.

---

## OpenAI Chat Model

```json
{
  "id": "openai-chat-1",
  "name": "OpenAI Chat Model",
  "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
  "typeVersion": 1.2,
  "position": [450, 500],
  "parameters": {
    "model": {
      "__rl": true,
      "mode": "list",
      "value": "gpt-4o",
      "cachedResultName": "gpt-4o"
    },
    "options": {
      "temperature": 0.7
    }
  },
  "credentials": {
    "openAiApi": {
      "id": "cred-id",
      "name": "OpenAI API"
    }
  }
}
```

**Available models:** `gpt-4o`, `gpt-4o-mini`, `gpt-4-turbo`, `gpt-3.5-turbo`, `o1`, `o1-mini`

---

## Anthropic Chat Model

```json
{
  "id": "anthropic-chat-1",
  "name": "Anthropic Chat Model",
  "type": "@n8n/n8n-nodes-langchain.lmChatAnthropic",
  "typeVersion": 1.3,
  "position": [450, 500],
  "parameters": {
    "model": {
      "__rl": true,
      "mode": "id",
      "value": "claude-sonnet-4-5-20250929"
    },
    "options": {
      "temperature": 0.7
    }
  },
  "credentials": {
    "anthropicApi": {
      "id": "cred-id",
      "name": "Anthropic API"
    }
  }
}
```

**Available models:**
- `claude-sonnet-4-5-20250929` - Claude 4.5 Sonnet (latest)
- `claude-3-5-sonnet-20241022` - Claude 3.5 Sonnet
- `claude-3-opus-20240229` - Claude 3 Opus
- `claude-3-5-haiku-20241022` - Claude 3.5 Haiku
- `claude-3-haiku-20240307` - Claude 3 Haiku

---

## OpenAI Embeddings

```json
{
  "id": "embeddings-1",
  "name": "Embeddings OpenAI",
  "type": "@n8n/n8n-nodes-langchain.embeddingsOpenAi",
  "typeVersion": 1.1,
  "position": [450, 500],
  "parameters": {
    "model": "text-embedding-3-small",
    "options": {}
  },
  "credentials": {
    "openAiApi": {
      "id": "cred-id",
      "name": "OpenAI API"
    }
  }
}
```

**Embedding models:** `text-embedding-3-small`, `text-embedding-3-large`, `text-embedding-ada-002`

---

## Simple Memory

Stores conversation history in n8n memory (no external setup required).

```json
{
  "id": "memory-1",
  "name": "Simple Memory",
  "type": "@n8n/n8n-nodes-langchain.memoryBufferWindow",
  "typeVersion": 1.3,
  "position": [450, 400],
  "parameters": {
    "sessionIdType": "fromInput",
    "contextWindowLength": 5
  }
}
```

**With custom session key:**
```json
{
  "parameters": {
    "sessionIdType": "customKey",
    "sessionKey": "={{ $json.userId }}",
    "contextWindowLength": 10
  }
}
```

**Session ID options:**
- `fromInput` - From connected Chat Trigger (default)
- `customKey` - Define custom session key

---

## Simple Vector Store

In-memory vector store for experimentation (no external setup required).

**Insert documents:**
```json
{
  "id": "vector-store-1",
  "name": "Simple Vector Store",
  "type": "@n8n/n8n-nodes-langchain.vectorStoreInMemory",
  "typeVersion": 1.3,
  "position": [650, 400],
  "parameters": {
    "mode": "insert",
    "memoryKey": {
      "__rl": true,
      "mode": "id",
      "value": "my_vector_store"
    },
    "clearStore": false
  }
}
```

**Retrieve as tool for AI Agent:**
```json
{
  "parameters": {
    "mode": "retrieve-as-tool",
    "memoryKey": {
      "__rl": true,
      "mode": "id",
      "value": "my_vector_store"
    },
    "toolDescription": "Search knowledge base for relevant documents"
  }
}
```

**Operation modes:**
- `insert` - Insert documents into store
- `load` - Get many documents by prompt
- `retrieve` - Retrieve as vector store for chain
- `retrieve-as-tool` - Retrieve as tool for AI Agent

---

## Connection Patterns

### AI Agent with Chat Model

```json
{
  "connections": {
    "Webhook": {
      "main": [[{ "node": "AI Agent", "type": "main", "index": 0 }]]
    },
    "OpenAI Chat Model": {
      "ai_languageModel": [[{ "node": "AI Agent", "type": "ai_languageModel", "index": 0 }]]
    }
  }
}
```

### AI Agent with Memory

```json
{
  "connections": {
    "OpenAI Chat Model": {
      "ai_languageModel": [[{ "node": "AI Agent", "type": "ai_languageModel", "index": 0 }]]
    },
    "Simple Memory": {
      "ai_memory": [[{ "node": "AI Agent", "type": "ai_memory", "index": 0 }]]
    }
  }
}
```

### AI Agent with Tools

```json
{
  "connections": {
    "OpenAI Chat Model": {
      "ai_languageModel": [[{ "node": "AI Agent", "type": "ai_languageModel", "index": 0 }]]
    },
    "Calculator": {
      "ai_tool": [[{ "node": "AI Agent", "type": "ai_tool", "index": 0 }]]
    },
    "Simple Vector Store": {
      "ai_tool": [[{ "node": "AI Agent", "type": "ai_tool", "index": 0 }]]
    }
  }
}
```

**Note:** AI connections use special types: `ai_languageModel`, `ai_memory`, `ai_tool`, `ai_outputParser`

---

## Quick Reference: AI Node typeVersions

| Node | typeVersion |
|------|-------------|
| AI Agent | 3.1 |
| OpenAI Chat Model | 1.2 |
| Anthropic Chat Model | 1.3 |
| OpenAI Embeddings | 1.1 |
| Simple Memory | 1.3 |
| Simple Vector Store | 1.3 |
