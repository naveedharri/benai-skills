---
name: agent-builder
description: Build Anthropic Managed Agents through a non-technical conversation. The skill asks the user what kind of agent they want, which connectors and abilities it should have, and then silently translates that into Anthropic's Managed Agents REST API: creates the Agent, Environment, Vault and credentials, attaches MCP servers and Skills, opens a Session, and sends a first message. Hides the developer details. USE THIS SKILL WHEN user says "agent builder", "build an agent", "create an agent", "managed agent", "managed agents", "deploy an agent", "anthropic agent", "agent platform", "agents API", "agent session", "agent environment", "agent vault", "upload skill", "attach skill", "/v1/agents", "/v1/skills", or wants to spin up an autonomous agent that runs on Anthropic's managed infrastructure with connectors and skills.
---

# Agent Builder

Build Anthropic Managed Agents through a friendly, non-technical conversation. The user picks what they want; this skill quietly translates it into the right API calls.

## When This Skill Loads

1. Silently read every file in `references/`. Do not narrate this.
2. Do not list "Step 1, Step 2, …" in chat. Do not paste raw JSON, curl commands, or API field names into the user's view. Those exist only in the references for your own use.
3. Start the conversation with a single warm sentence, then drop straight into the first question via `AskUserQuestion`.

Opener (example, vary as needed):
> "Let's build your agent. A few quick questions and I'll set everything up for you."

## How To Drive The Conversation

Every branching question MUST go through `AskUserQuestion`, never plain chat. Plain chat is reserved for short confirmations and the final summary. Use the descriptions inside each option to teach the concept (what a connector is, what a skill is, etc.) so the user never has to know the underlying terms.

Run the questions in this order. Skip a question if the user already volunteered the answer earlier in the conversation.

---

### Q1. What kind of agent are you building?

Use `AskUserQuestion`. Header: `Agent type`. Options (single-select):

- **Research & analysis**. Reads sources on the web or in your tools, summarizes, finds patterns.
- **Content creation**. Drafts posts, emails, scripts, documents.
- **Operations & automation**. Handles tasks across your apps (Slack, Notion, CRM, etc.).
- **Custom**. Describe it yourself.

If "Custom", follow up with a single open question: "In one sentence, what should this agent do?"

Internally, use the answer to seed a short `system` prompt. The user never sees the word "system prompt".

---

### Q2. Which apps should it connect to?

First, in chat, explain in one sentence:
> "Connectors are the apps your agent can read from and act on, like Slack, Gmail, or Notion. Pick whichever this agent needs."

Then use `AskUserQuestion` with `multiSelect: true`. Header: `Connectors`. Options:

- **Slack**. Read channels, send messages, search history.
- **Notion**. Read pages, create or update notes.
- **Gmail / Google Workspace**. Read and send mail, work with Drive, Calendar.
- **GitHub**. Read issues, comment on PRs, browse code.

If the user names something not in the list (e.g. Stripe, Linear, HubSpot, Calendly, Intercom), accept it as another connector to add. Do NOT ask the user for the MCP server URL. You find it yourself.

### Finding the MCP URL for a connector

For every connector picked (preset or user-named), resolve the official remote MCP endpoint by web search. Do this silently in the background; do not show search results in chat. Use `WebSearch` (or the available web search tool) with a query like `"<connector> official remote MCP server URL"` and prefer hits from:

1. The vendor's own docs (e.g. `stripe.com/docs/mcp`, `developers.notion.com/docs/mcp`).
2. Anthropic's connector directory.
3. The MCP registry (`https://mcp.so` or `https://pulsemcp.com`).

If web search returns nothing trustworthy after two tries, then (and only then) ask the user once for the URL. Never invent or guess a URL.

Default URLs you can use without searching (only if exact match):
- Gmail / Google Workspace → use the Anthropic-hosted Google Workspace connector URL discovered via the directory.
- Slack → `https://mcp.slack.com/mcp`
- GitHub → `https://api.githubcopilot.com/mcp/`
- Stripe → `https://mcp.stripe.com/`

### Registering the connector

For every selected connector, internally:
1. Add `{ "type": "url", "name": <slug>, "url": <resolved_url> }` to `mcp_servers`.
2. Add a matching `{ "type": "mcp_toolset", "mcp_server_name": <slug>, ... }` to `tools`.

**Do not collect any access tokens or OAuth credentials in this flow.** The agent is built with MCP servers attached but no vault credentials. The user authorizes each connector later in the Anthropic dashboard (OAuth flow there). When you create the vault in the build phase, create it empty.

In the final summary, tell the user clearly which connectors still need to be authorized, and link them to where they do it. Example one-liner: "You'll need to authorize Gmail and Stripe once in the Anthropic console before the agent can use them."

---

### Q3. What core abilities should it have?

Explain in one sentence:
> "These are the built-in things the agent can do on its own without needing an outside app."

Use `AskUserQuestion`, `multiSelect: true`. Header: `Abilities`. Options:

- **Work with files**. Read, write, and edit files in its workspace.
- **Run code**. Execute bash commands and scripts.
- **Search the web**. Look things up online.
- **Open web pages**. Fetch and read specific URLs.

Internally map to the `agent_toolset_20260401` `configs` array: enable `read`/`write`/`edit`/`glob`/`grep` for files, `bash` for code, `web_search`, `web_fetch`. Anything not picked is disabled.

---

### Q4. Should it work with documents?

Use `AskUserQuestion`, `multiSelect: true`. Header: `Documents`. Options:

- **Spreadsheets**. Excel files (xlsx).
- **Presentations**. PowerPoint (pptx).
- **Word docs**. Docx.
- **PDFs**. Generate and fill PDFs.

Map each pick to an `{ "type": "anthropic", "skill_id": "<xlsx|pptx|docx|pdf>" }` entry in `skills`.

If the user mentions they already have a custom skill folder, follow up: "Where's the folder? I'll upload it for you." Then upload via `POST /v1/skills` (see `references/skills-upload.md`) and attach the returned `skill_id` as `{ "type": "custom", "skill_id": "...", "version": "latest" }`.

---

### Q5. How should it behave?

Use `AskUserQuestion`. Header: `Style`. Options (single-select):

- **Run on its own**. Acts autonomously without asking permission. Best for trusted, repeatable jobs.
- **Check in before acting**. Asks before running tools that touch outside apps.

Map:
- "Run on its own" → `permission_policy: { "type": "always_allow" }` everywhere.
- "Check in before acting" → `always_allow` for built-in tools, `always_ask` for `mcp_toolset` entries.

---

### Q6. How smart vs how fast?

Use `AskUserQuestion`. Header: `Brainpower`. Options (single-select):

- **Smartest, slower**. Best reasoning, for hard work.
- **Balanced**. Solid for most tasks (recommended).
- **Fast and cheap**. For simple, high-volume jobs.

Map:
- Smartest → `{"id": "claude-opus-4-7", "speed": "standard"}`
- Balanced → `"claude-sonnet-4-6"`
- Fast and cheap → `"claude-haiku-4-5-20251001"`

If the user picks "Smartest" and the task sounds simple/repetitive, gently suggest "Balanced" once.

---

### Q7. Name and one-line description

In chat (no `AskUserQuestion` here, it's free text):
> "Last bit: what should I call this agent, and can you give me one sentence describing its job?"

Capture two short strings.

---

## After The Questions

The only secret you ever ask for is the Anthropic API key. Connector authorization (OAuth, access tokens) is NOT handled in this flow. The user will authorize each connector later in the Anthropic console.

1. **API key.** Ask once: "I'll need your Anthropic API key (starts with `sk-ant-`). I'll only use it for this session and won't write it down."
   Export as `ANTHROPIC_API_KEY` in the shell.

2. **Run the build.** Without narrating each call, execute in order:
   - Upload any custom skills (if Q4 produced any).
   - `POST /v1/agents` with the assembled body (includes `mcp_servers` and matching `mcp_toolset` entries, but no credentials).
   - `POST /v1/environments`.
   - `POST /v1/vaults` with the chosen `display_name`. Do NOT add any credentials. Leave the vault empty.
   - `POST /v1/sessions` referencing the empty vault. The session creates fine; MCP calls will simply error until the user authorizes the connectors.

   While these run, send ONE chat update like: "Setting up your agent…" Do not list every step.

3. **Final summary.** Present a clean, non-technical recap:

```
✅ Your agent "${name}" is ready.

What it can do:
- ${ability_summary}
- Connected to: ${connector_names}
- Document skills: ${doc_skills or "none"}
- Style: ${style}

Before it can actually use your connectors, authorize them once:
→ Open https://console.anthropic.com/agents/${agent_id}
→ For each connector listed (${connector_names}), click Connect and sign in.

To use it again, here are the IDs (keep them safe):
Agent ID: ${agent_id}
Session ID: ${session_id}
```

If only ${connector_names} is empty, drop the authorize-them block. If connectors exist, always show it.

Offer 3 follow-ups via `AskUserQuestion` (header: `Next`):
- **Try it now**. Send a test message.
- **Tweak something**. Change behavior, add a connector, swap a skill.
- **Done for now**. Wrap up.

---

## Hard Rules

- Always use `AskUserQuestion` for branching choices. Plain prompts in chat are reserved for free-text answers (name, description, custom system-prompt sentence, pasting tokens).
- Never show raw JSON, curl commands, API field names, or step numbers in the user-facing chat.
- Never persist secrets to disk. API key and connector tokens live in shell env vars for this session only.
- Never log or echo tokens. Mask in any debug output.
- One API call at a time; each depends on the previous. On non-2xx, stop and tell the user in plain English what failed (e.g. "Slack rejected the token") and ask how they'd like to proceed.
- Up to 20 MCP servers and 20 skills per agent.
- Every connector chosen in Q2 must produce both an `mcp_servers` entry and a matching `mcp_toolset`. The API rejects mismatches.

## Resources (for your own reference, never shown to the user)

- `references/api-reference.md`. Endpoints, methods, headers, response shapes.
- `references/payloads.md`. JSON bodies for every API call.
- `references/tools-reference.md`. Built-in tool names, configs, permission policies, custom tools.
- `references/mcp-and-vaults.md`. MCP server declaration, vault creation, credential types, error handling.
- `references/skills-upload.md`. Uploading and attaching custom and pre-built skills.
