# Install Steps

Run in order. Every command here was verified working on macOS on 4 August 2026.

## Contents
1. Preflight
2. Install Ollama
3. Pull a model that fits
4. Install Open WebUI
5. Start the server
6. Which URL goes where
7. Prove it works
8. Stopping and restarting

## 1. Preflight

```bash
for c in ollama open-webui uv docker; do
  printf "%-12s %s\n" "$c" "$(command -v $c || echo 'MISSING')"
done

# is Ollama serving, and what is pulled?
curl -s --max-time 8 http://localhost:11434/api/tags \
  | python3 -c "import sys,json;d=json.load(sys.stdin);print('models:',len(d.get('models',[])) or 'NONE PULLED')" \
  2>/dev/null || echo "Ollama not running"

# is port 8080 free?
lsof -nP -iTCP:8080 -sTCP:LISTEN 2>/dev/null | tail -n +2 || echo "8080 free"
```

An installed binary with nothing listening means it was never started. That is the most common state and it is not an error.

## 2. Install Ollama

Skip if `command -v ollama` found it.

```bash
# macOS
brew install ollama && brew services start ollama

# Linux
curl -fsSL https://ollama.com/install.sh | sh
```

Confirm before continuing:

```bash
curl -s --max-time 8 http://localhost:11434/   # expect: Ollama is running
```

## 3. Pull a model that fits

Choose from the scan result. Defaults by usable memory budget:

| Budget | Pull |
|--------|------|
| Under 4 GB | `ollama pull phi4-mini` |
| 6–8 GB | `ollama pull gemma3:4b` |
| 12–16 GB | `ollama pull gemma3:12b` |
| 24 GB+ | `ollama pull qwen3:14b` or the model from the scan |

State the download size before running it and wait for approval.

Do **not** default to a sub-1B model such as `smollm:135m`. It downloads in seconds but cannot follow a one-line instruction and lacks tool support, which produces an error that reads like a broken install. Only use it to prove a connection, and say that is all it is for.

Verify tool support if the user wants agent or MCP features:

```bash
ollama show <model> | sed -n '/Capabilities/,/^$/p'   # needs "tools" listed
```

The smallest model with real tool support is `qwen3:0.6b` at 498 MB.

## 4. Install Open WebUI

```bash
# preferred: isolated tool install
uv tool install open-webui

# if uv is missing
curl -LsSf https://astral.sh/uv/install.sh | sh

# alternative: Docker
docker run -d -p 8080:8080 --add-host=host.docker.internal:host-gateway \
  -v open-webui:/app/backend/data --name open-webui --restart always \
  ghcr.io/open-webui/open-webui:main
```

Prefer `uv tool install` on a personal machine. It avoids Docker entirely and puts the binary at `~/.local/bin/open-webui`.

## 5. Start the server

The `uv` install does not start anything. Start it detached:

```bash
nohup open-webui serve --port 8080 > /tmp/open-webui.log 2>&1 &
```

First boot takes 30 to 60 seconds because it fetches an embedding model. Wait, then confirm:

```bash
curl -s --max-time 10 http://localhost:8080/health   # expect: {"status":true}
```

Tell the user the log path so they can restart it themselves later.

## 6. Which URL goes where

This is the step that silently breaks setups. Two different ports, two different slots in Settings → Connections:

| Backend | URL | Goes in this slot |
|---------|-----|-------------------|
| Ollama | `http://localhost:11434` | **Ollama API** |
| LM Studio | `http://localhost:1234/v1` | **OpenAI API** |

LM Studio speaks the OpenAI API, not Ollama's. Putting its port in the Ollama slot fails even when LM Studio is running correctly.

LM Studio's server is **off by default**. If port 1234 refuses to connect, the user must start it in LM Studio's Developer tab. Do not conclude LM Studio is missing.

## 7. Prove it works

An HTTP 200 is not proof. Send a real prompt:

```bash
curl -s --max-time 90 http://localhost:11434/api/generate \
  -d '{"model":"<model>","prompt":"Reply with exactly: setup works","stream":false}' \
  | python3 -c "import sys,json;d=json.load(sys.stdin);print('reply:',d.get('response','')[:120])"
```

Then open the browser on `http://localhost:8080` and hand over.

## 8. Stopping and restarting

Give the user both, so they are not stuck:

```bash
# find it
lsof -nP -iTCP:8080 -sTCP:LISTEN | tail -n +2 | awk '{print $2}'

# stop it (only when the user asks)
kill <pid>

# start it again
nohup open-webui serve --port 8080 > /tmp/open-webui.log 2>&1 &
```
