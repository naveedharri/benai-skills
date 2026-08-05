# Harness Matrix

The six desktop apps, their real capabilities, and the rules for picking one.

**Verified 4 August 2026, Odysseus added and verified 5 August 2026.** Capability flags change with releases. If more than about three months have passed, check each tool's current state before recommending.

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
| Odysseus | Yes | Yes | Yes | AGPL-3.0-or-later |

Notes that matter when recommending:

- **LM Studio** is the only one that runs models itself. Every other tool needs a backend, and LM Studio or Ollama is usually it. Its skills come from a community plugin: `lmstudio.ai/wclin/claude-style-skill`. Its local server is off by default.
- **Goose** is the only one where all three capabilities work with no config file. Extensions *are* MCP servers. It adds recipes and a scheduler for unattended runs. No SLA and no SOC 2.
- **Open WebUI** is the most customisable but does not run models: the user installs Ollama and pulls models separately. Its licence forbids removing Open WebUI branding above 50 end users per 30 days without an enterprise licence.
- **AnythingLLM** has the best out-of-the-box RAG and bundles its own Ollama. MCP docs: `docs.anythingllm.com/mcp-compatibility/overview`. Custom skills: `docs.anythingllm.com/agent/custom/developer-guide`.
- **OpenWork** supports local models via Ollama but you hand-edit `opencode.json` to point at `http://localhost:11434/v1`. It also acts as an MCP server, exposing its skills to Claude Code, Cursor and Codex. Youngest of the six.
- **Odysseus** is the browser-based alternative to Open WebUI and the other obvious pick when the user wants a shared surface with a login. It ships far more in the box: Deep Research, blind model Compare, a Documents editor, and an IMAP/SMTP inbox. Its Cookbook can recommend, download and serve models itself, so unlike Open WebUI it does not strictly require a separate backend, though it pairs with Ollama happily. Multi-user with admin and non-admin accounts, and every API route returns 401 unauthenticated. Repo `github.com/odysseus-dev/odysseus`, default branch `dev`, `main` is the curated one. **AGPL-3.0**, which is the thing to flag: network use triggers the source-sharing obligation, so it is the wrong pick for a company that plans to modify it and offer it as a product.

## 2. Decision rules in order

Apply in this order and stop at the first match.

1. **Team access needed** (answer 2 is "team") → **Open WebUI**, with **Odysseus** as the named alternative. Both are browser-based, both have a real login, and both tunnel the same way. Open WebUI stays the default because its group-based RBAC is richer; Odysseus has admin and non-admin accounts but not the same group model. Flag Open WebUI's 50-user branding clause and Odysseus's AGPL obligation, then let the user pick. Do not present the other four here.
2. **Main job is documents** → **AnythingLLM**. Best RAG with no pipeline to assemble, and it bundles its own Ollama so it works on install.
3. **Main job is automated or repeated tasks** → **Goose**. Recipes plus a scheduler; nothing else here runs unattended.
3b. **They want research, model comparison, document editing or email in one place** → **Odysseus**. It is the only one shipping all four, and assembling that on Open WebUI is a pipelines project. Say the AGPL line.
4. **Answer 3 is "rather not"** (no config files) → **LM Studio**, and add Goose on top if they also want skills and agent behaviour.
5. **Answer 3 is "happy"** and they want maximum control → **Open WebUI**.
6. **Everything else, including coding and general use** → **Goose**.

Answer 4 (fully offline) never changes the pick: all six run fully local. Use it only to warn that OpenWork's capability-sharing layer routes through a hosted endpoint, and that LM Studio and Open WebUI both have optional cloud features to leave off.

## 3. One-line summaries

Use these verbatim when explaining the choice:

- **LM Studio** — get a model running with the least friction, and the layer most other tools sit on.
- **Goose** — actually get work done; the only one where local models, MCP and skills all work out of the box.
- **Open WebUI** — maximum control and the right answer for a team, at the cost of the most setup.
- **AnythingLLM** — chat with your documents.
- **OpenWork** — one to watch rather than deploy.
- **Odysseus** — a browser workspace that already includes research, compare, documents and email, if AGPL is fine.

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
| Odysseus | AGPL-3.0, so modifying it and offering it over a network obliges you to publish your changes. Newest of the six, and on Apple Silicon it must be installed natively because Docker there has no Metal GPU access. |
