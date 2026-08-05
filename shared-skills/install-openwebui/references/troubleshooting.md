# Troubleshooting

Four failures account for nearly every broken local AI setup. Each was hit and fixed on a real machine on 4 August 2026. Match the symptom, apply the fix, and do not improvise before checking this list.

## Contents
1. localhost:8080 refused to connect
2. Connected but the model list is empty
3. "does not support tools"
4. LM Studio is running but nothing can reach it
5. General rule

## 1. localhost:8080 refused to connect

**Symptom:** `ERR_CONNECTION_REFUSED` in the browser. Nothing on port 8080.

**Cause, almost always:** Open WebUI is installed but was never started. A `uv tool install` or `pip install` puts the binary in place and starts nothing.

**Check:**

```bash
command -v open-webui                                  # installed?
lsof -nP -iTCP:8080 -sTCP:LISTEN 2>/dev/null | tail -n +2   # running?
```

**Fix:**

```bash
nohup open-webui serve --port 8080 > /tmp/open-webui.log 2>&1 &
```

Wait up to 60 seconds on first boot, then check `curl -s http://localhost:8080/health` returns `{"status":true}`.

Only if the binary is genuinely missing, install it. Do not reinstall over a working install.

## 2. Connected but the model list is empty

**Symptom:** The Ollama connection saves and goes green, but no models appear. Looks like a broken connection.

**Cause:** Ollama is running with zero models pulled. There is nothing wrong with the connection.

**Check:**

```bash
curl -s http://localhost:11434/api/tags \
  | python3 -c "import sys,json;print(len(json.load(sys.stdin).get('models',[])),'models')"
```

**Fix:** pull one, after telling the user the size:

```bash
ollama pull gemma3:4b
```

Say explicitly that the connection was fine, so the user does not go back and change a setting that was already correct.

## 3. "does not support tools"

**Symptom:** an error like `registry.ollama.ai/library/smollm:135m does not support tools`.

**Cause:** a tool or MCP server is enabled in the chat, and the selected model has no tool-calling template. Nothing is misconfigured.

**Check:**

```bash
ollama show <model> | sed -n '/Capabilities/,/^$/p'
```

`completion` alone means chat only. Tool calling needs `tools` in that list.

**Fix, pick one:**

- Switch to a model with tool support. Smallest is `qwen3:0.6b` (498 MB, capabilities: completion, tools, thinking).
- Or turn the tool off for that chat, using the tools button next to the message box.

Tell the user their setup is working and the model simply cannot do that particular thing. This error reads like a bug and is not one.

Also flag context size: models this small often have only a 2048-token window, roughly three paragraphs, so they will fail on real work regardless of tools.

## 4. LM Studio is running but nothing can reach it

**Symptom:** LM Studio is open, but `http://localhost:1234` refuses to connect, or Open WebUI cannot see its models.

**Two separate causes. Check both.**

**a) The server is off.** LM Studio's OpenAI-compatible server does not start with the app. It listens on internal ports instead.

```bash
lsof -nP -iTCP:1234 2>/dev/null | tail -n +2 || echo "1234 not bound"
```

Fix: in LM Studio, open the Developer tab and start the server. Then re-check.

**b) The URL is in the wrong slot.** LM Studio speaks the OpenAI API. `http://localhost:1234/v1` belongs in **OpenAI API** connections, never in the **Ollama API** slot. It fails there even when everything else is right.

Verify what a port actually speaks before trusting a label:

```bash
curl -s -o /dev/null -w "openai  -> %{http_code}\n" --max-time 8 http://localhost:1234/v1/models
curl -s -o /dev/null -w "ollama  -> %{http_code}\n" --max-time 8 http://localhost:1234/api/tags
```

`000` means nothing is listening at all, which is cause (a), not a wrong URL.

## 5. General rule

Before concluding anything is broken, verify in this order: is it **installed**, is it **running**, is it **reachable**, does it **have a model**, can that model **do the requested job**. Most reported failures are step two or four, not a misconfiguration.

Never report success from an HTTP status alone. Send a real prompt and show the reply.
