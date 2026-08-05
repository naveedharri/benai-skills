# Install Other Apps

Install paths for the four apps that are not Open WebUI. Open WebUI has its own skill: `install-openwebui`.

Show the download size and get a yes before running anything here.

## Contents
1. LM Studio
2. Goose
3. AnythingLLM
4. OpenWork
5. Verify, whichever you installed

## 1. LM Studio

Easiest path, and the one to use when the user said they would rather not touch config files.

```bash
# macOS
brew install --cask lm-studio
# otherwise: download from https://lmstudio.ai
```

Then, in the app:

1. Search for the model from the scan and download it. LM Studio shows what fits before downloading, so let the user see that.
2. Load the model and send a message to confirm.

Two things to tell them, because both cause support questions later:

- The **local server is off by default**. Anything that needs to connect to LM Studio (Open WebUI, AnythingLLM, a script) requires starting it in the **Developer** tab. It then serves on `http://localhost:1234/v1`.
- **Skills come from a plugin**, not the core app: `https://lmstudio.ai/wclin/claude-style-skill`. Install it if the user wants `SKILL.md`-style skills. It reads a folder of skills from `~/.lmstudio/skills`.

## 2. Goose

The recommendation for most people who want actual agent work.

```bash
# macOS and Linux
curl -fsSL https://github.com/block/goose/releases/download/stable/download_cli.sh | bash

# then configure a provider
goose configure
```

Point it at a local model by choosing Ollama as the provider and `http://localhost:11434` as the host. Ollama must be installed and have a model pulled first; if it does not, follow sections 2 and 3 of `install-openwebui`'s `references/install-steps.md`.

The desktop app is a separate download from `https://block.github.io/goose/`. Extensions are MCP servers and are added from the Extensions screen.

## 3. AnythingLLM

Best when the job is documents. It bundles its own Ollama, so it works immediately after install with no separate model setup.

```bash
# macOS
brew install --cask anythingllm
# otherwise: download from https://anythingllm.com
```

Then: create a workspace, drag documents in, and chat. That is the whole setup for the main use case.

To point it at an existing backend instead of its bundled one: Settings → AI Providers → LLM, choose LM Studio or Ollama, and it auto-detects the models. LM Studio's server must be started first.

MCP and custom skills are both developer tasks here. Only offer them if asked:
- MCP: `https://docs.anythingllm.com/mcp-compatibility/overview`
- Skills: `https://docs.anythingllm.com/agent/custom/developer-guide`

## 4. OpenWork

Only install this if the user specifically asked for it. It is the youngest of the five.

Download from `https://openworklabs.com`.

Local models need a config file edit, so do this for them rather than describing it. Edit `<workspace>/.config/opencode/opencode.json` to add an OpenAI-compatible provider:

```json
{ "provider": { "ollama": { "options": { "baseURL": "http://localhost:11434/v1" } } } }
```

Then select that provider in the app. Docs: `https://openworklabs.com/docs/start-here/connect-your-stack/add-a-custom-llm`

## 5. Verify, whichever you installed

Never report success from an install completing. Send one real prompt through the app and show the reply.

For anything backed by Ollama:

```bash
curl -s --max-time 90 http://localhost:11434/api/generate \
  -d '{"model":"<model>","prompt":"Reply with exactly: setup works","stream":false}' \
  | python3 -c "import sys,json;print('reply:',json.load(sys.stdin).get('response','')[:120])"
```

For a desktop app with no server, ask the user to send one message and confirm they got a reply.
