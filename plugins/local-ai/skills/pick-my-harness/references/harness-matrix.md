# Harness Matrix

The five desktop apps, their real capabilities, and the rules for picking one.

**Verified 4 August 2026.** Capability flags change with releases. If more than about three months have passed, check each tool's current state before recommending.

## Contents
1. Capability flags
2. Decision rules in order
3. One-line summaries
4. Pairing
5. What each cannot do

## 1. Capability flags

`Yes` means it works without editing a config file. `Fiddly` means supported but a developer task.

| Tool | Local models | MCP | Skills | Licence |
|------|--------------|-----|--------|---------|
| LM Studio | Yes | Yes | Yes, via the claude-style-skill plugin | Proprietary, free for commercial use |
| Goose | Yes | Yes | Yes | Apache 2.0 |
| Open WebUI | Yes | Yes | Yes, Python pipelines | BSD-3 plus a branding clause, not OSI-approved |
| AnythingLLM | Yes | Fiddly | Fiddly | Open source |
| OpenWork | Fiddly | Yes | Yes | Open source |

Notes that matter when recommending:

- **LM Studio** is the only one that runs models itself. Every other tool needs a backend, and LM Studio or Ollama is usually it. Its skills come from a community plugin: `lmstudio.ai/wclin/claude-style-skill`. Its local server is off by default.
- **Goose** is the only one where all three capabilities work with no config file. Extensions *are* MCP servers. It adds recipes and a scheduler for unattended runs. No SLA and no SOC 2.
- **Open WebUI** is the most customisable but does not run models: the user installs Ollama and pulls models separately. Its licence forbids removing Open WebUI branding above 50 end users per 30 days without an enterprise licence.
- **AnythingLLM** has the best out-of-the-box RAG and bundles its own Ollama. MCP docs: `docs.anythingllm.com/mcp-compatibility/overview`. Custom skills: `docs.anythingllm.com/agent/custom/developer-guide`.
- **OpenWork** supports local models via Ollama but you hand-edit `opencode.json` to point at `http://localhost:11434/v1`. It also acts as an MCP server, exposing its skills to Claude Code, Cursor and Codex. Youngest of the five.

## 2. Decision rules in order

Apply in this order and stop at the first match.

1. **Team access needed** (answer 2 is "team") → **Open WebUI**. It is the only one with real auth and RBAC on a shared surface. Flag the 50-user branding clause.
2. **Main job is documents** → **AnythingLLM**. Best RAG with no pipeline to assemble, and it bundles its own Ollama so it works on install.
3. **Main job is automated or repeated tasks** → **Goose**. Recipes plus a scheduler; nothing else here runs unattended.
4. **Answer 3 is "rather not"** (no config files) → **LM Studio**, and add Goose on top if they also want skills and agent behaviour.
5. **Answer 3 is "happy"** and they want maximum control → **Open WebUI**.
6. **Everything else, including coding and general use** → **Goose**.

Answer 4 (fully offline) never changes the pick: all five run fully local. Use it only to warn that OpenWork's capability-sharing layer routes through a hosted endpoint, and that LM Studio and Open WebUI both have optional cloud features to leave off.

## 3. One-line summaries

Use these verbatim when explaining the choice:

- **LM Studio** — get a model running with the least friction, and the layer most other tools sit on.
- **Goose** — actually get work done; the only one where local models, MCP and skills all work out of the box.
- **Open WebUI** — maximum control and the right answer for a team, at the cost of the most setup.
- **AnythingLLM** — chat with your documents.
- **OpenWork** — one to watch rather than deploy.

## 4. Pairing

The common production stack is **LM Studio or Ollama for inference, Goose for agency**. When rule 4 fires, present that as one recommendation with two parts, not as a choice between two tools.

Open WebUI and AnythingLLM both need a backend too, but AnythingLLM bundles one, so only Open WebUI must be paired explicitly.

## 5. What each cannot do

Always close with one of these:

| Tool | Say this |
|------|----------|
| LM Studio | On its own it will not run agent workflows or scheduled tasks. |
| Goose | No commercial support, no SOC 2 or HIPAA, so it is a hard stop in regulated environments. |
| Open WebUI | It will not run the model for you, and the branding clause applies above 50 users. |
| AnythingLLM | Weakest choice if you want an agent driving your filesystem and shell. |
| OpenWork | Smallest community, and local models need a hand-edited config file. |
