# Deploy Steps

The runbook. One build: a single Secure Cloud pod with the inference server on loopback.

**Verify every CLI flag with `--help` before running it.** Flags below were correct on 5 August 2026, not necessarily today. If one is gone, ask the provider's own agent skill, then fix this file.

## Contents
1. Credential handling
2. Build the pod
3. Which URL goes where
4. Prove it with a real reply

## 1. Credential handling

One credential, created at **https://console.runpod.io/user/settings** → API Keys, read/write scope. Give the user that exact URL as a link, not just the click path. Verified 6 August 2026.

Ask them to paste the key in chat, then set `RUNPOD_API_KEY` in the session environment yourself. **Never show the user an `export` line or any shell command; they are non-technical.**

Rules:

- **Never write the key to a file**, never echo it, never put it in the report. To show it is set, show the last four characters.
- `runpodctl doctor` offers to persist the key to its own config. That is the user's choice; ask.
- **If the key is ever exposed** in a screenshot, a shared terminal or a pasted log, tell the user to rotate it immediately.

Verify before spending:

```bash
runpodctl doctor      # or the runpod skill's own auth check
```

Install the provider skills rather than reimplementing their APIs:

```bash
npx skills add runpod/runpod-plugins-official
```

Router plus `runpod-mcp`, `runpodctl`, `flash`, `companion-clis`, `runpod-usage`, all authenticating on `RUNPOD_API_KEY`.

## 2. Build the pod

One Secure Cloud Pod in the user's chosen region, running both services. The inference server never touches a network.

```
┌─ RunPod Secure Cloud Pod, <REGION> ───────────────┐
│   vLLM        127.0.0.1:8000    loopback only     │
│                    ↑ localhost                    │
│   Open WebUI  0.0.0.0:8080      exposed via HTTPS │
│   Network volume, same region                     │
│     /app/backend/data   chat history, RAG docs    │
│     /root/.cache        model weights             │
└──────────────────────┬────────────────────────────┘
                       │ HTTPS, port 8080 only
                    users
```

### Why one pod rather than two

RunPod **Global Networking** gives pods a private `.runpod.internal` network with no public ports, and it covers all six EU regions. It is **NVIDIA GPU Pods only**, and runs at **100 Mbps**. So a cheap CPU pod for the interface cannot join that private network.

One pod is better anyway: `localhost` beats any private network, because the endpoint is not reachable even from inside RunPod. There is no URL to leak, no port to forget, no API key to get wrong.

### 2a. Create the pod

`runpodctl` supports every setting this build needs. Flags verified 5 August 2026:

| Flag | Purpose |
|---|---|
| `--secureCloud` | Cloud tier, `SECURE` or `COMMUNITY`. **Always SECURE here** |
| `--datacenter` | Comma-separated preferred datacenter IDs. `runpodctl datacenter list` enumerates them |
| `--ports` | Comma-separated, with protocol: `8080/http,22/tcp` |
| `--networkVolumeId` | Attach a volume. `runpodctl network-volume list` |
| `--volumePath` | Where to mount it |
| `--gpuCount` / `--gpuType` | Count and model |
| `--imageName` / `--name` | Container image and pod name |

**Image rule, learned on a billed GPU on 6 August 2026: the image is `vllm/vllm-openai:latest`, never a base image plus `pip install vllm`.** A PyTorch base with vLLM and Open WebUI pip-installed at boot burned ~30 billed minutes before the first token, and the user killed the run. The prebuilt image carries the whole inference stack; the only install left is Open WebUI, minutes not tens of minutes. Set `HF_HUB_ENABLE_HF_TRANSFER=1` with `pip install hf_transfer` before the model download, or a 63 GB model downloads single-stream for half an hour.

**Order rule: the volume is created first, and it is where a bad region fails.** Volume creation validates the datacenter; fail there before anything bills. The region offered must already be volume-capable (`model-picker.md` section 1, Q1).

The build:

```bash
runpodctl datacenter list          # confirm the user's region ID exists and has stock
runpodctl network-volume list      # or create one in that same datacenter first

runpodctl pod create \
  --name <NAME> \
  --imageName vllm/vllm-openai:latest \
  --secureCloud SECURE \
  --datacenter <REGION> \
  --gpuType '<GPU>' --gpuCount <N> \
  --networkVolumeId <VOLUME_ID> \
  --volumePath /runpod-volume \
  --ports '8080/http'
```

Three things about that command:

- **`--ports '8080/http'` and nothing else.** Port 8000 is deliberately absent. If you add it, the build stops being private and step 7 will catch you.
- **`--datacenter` takes the user's region answer verbatim.** Run `runpodctl datacenter list` first and fail loudly if their region is not in the output, rather than silently falling back.
- **The network volume must already exist in the same datacenter.** Attaching it also pins the pod to that datacenter, which is a useful second lock on the region.

**Known issue:** runpodctl has had a reported bug creating pods with a network volume ([runpodctl#172](https://github.com/runpod/runpodctl/issues/172)). If `--networkVolumeId` fails, fall back to the REST API or the `runpod-mcp` skill rather than dropping the volume. A pod without the volume loses all chat history on restart and breaks the residency story.

Legacy forms like `runpodctl create pod` still work but are deprecated. Prefer the `pod create` form above.

### 2b. Start vLLM on loopback

The critical flag is `--host 127.0.0.1`. It is what makes this build private.

```bash
vllm serve <MODEL> \
  --host 127.0.0.1 --port 8000 \
  --download-dir /runpod-volume/models \
  --disable-log-requests \
  --gpu-memory-utilization 0.92 \
  --enable-auto-tool-choice --tool-call-parser <PARSER>
```

**The tool-call flags are not optional with Open WebUI in front.** Open WebUI sends `tool_choice: "auto"`, and without them vLLM rejects every chat with `"auto" tool choice requires --enable-auto-tool-choice and --tool-call-parser to be set` — the model lists fine and every reply fails. Hit live on 6 August 2026. Parser by family: `hermes` for Qwen, `deepseek_v4` for DeepSeek, check the vLLM recipe for others.

- `--host 127.0.0.1` binds to loopback. **Never `0.0.0.0` on this build.**
- `--disable-log-requests` keeps prompts out of the server log. Row 4 of the data flow table depends on this.
- `--download-dir` on the volume stops the model re-downloading on every restart.
- No `--api-key` needed here, because nothing but localhost can reach it. Add one anyway if it costs nothing.

For DeepSeek-V4-Flash-0731 the vLLM project publishes a recipe; its sanctioned single-node layout is data parallel plus expert parallel across 4 GPUs on H200, B200 or B300:

```bash
vllm serve deepseek-ai/DeepSeek-V4-Flash-0731 \
  --host 127.0.0.1 --port 8000 \
  --data-parallel-size 4 --enable-expert-parallel \
  --kv-cache-dtype fp8 --trust-remote-code --block-size 256 \
  --gpu-memory-utilization 0.92 --disable-log-requests \
  --tokenizer-mode deepseek_v4 --tool-call-parser deepseek_v4 \
  --enable-auto-tool-choice --reasoning-parser deepseek_v4 \
  --speculative-config '{"method":"mtp","num_speculative_tokens":3}'
```

### 2c. Start Open WebUI on the same pod

Image `ghcr.io/open-webui/open-webui:main`, or install into the pod directly. Environment:

| Variable | Value |
|---|---|
| `OPENAI_API_BASE_URL` | `http://127.0.0.1:8000/v1` |
| `OPENAI_API_KEY` | any non-empty string, or the vLLM key if set |
| `OLLAMA_BASE_URL` | empty string |
| `WEBUI_SECRET_KEY` | fresh random value |
| `ENABLE_SIGNUP` | `false` |
| `DATA_DIR` | the volume path, `/app/backend/data` |
| `SCARF_NO_ANALYTICS` / `DO_NOT_TRACK` | `true` |
| `ANONYMIZED_TELEMETRY` | `false` |

The last three matter for row 10 of the data flow table. Set them or you cannot claim telemetry is off.

### 2c-bis. Time expectations and progress

Real numbers from a real run, 6 August 2026. Say the estimate **at the gate, before the yes**, and repeat it when the pod is created. Billing runs through all of it.

| Phase | Qwen3.6-27B (~20 GB) | gpt-oss-120b (63 GB) |
|---|---|---|
| Pod boot + image pull | 3–8 min | 3–8 min |
| Open WebUI install | 2–4 min | 2–4 min |
| Model download (with hf_transfer) | 2–5 min | 8–15 min |
| vLLM load into VRAM | 1–3 min | 3–6 min |
| **Chat URL live, total** | **~10–15 min** | **~20–30 min** |

Without the prebuilt image or without hf_transfer, double everything; that is the run that gets killed by an impatient user, and reasonably so.

**The no-silence rule:** during any wait, report a real checkpoint at least every 3 minutes — image pull done, download at N%, weights loading. Ten silent minutes reads as "it lost its way" even when everything is fine, and it is the single thing users abandoned a run over.

Before handing over, prove the endpoint is not reachable from outside:

```bash
# from inside the pod: must succeed
curl -s http://127.0.0.1:8000/v1/models | head

# from your own machine: must fail, connection refused or no route
curl -s --max-time 8 https://<PODID>-8000.proxy.runpod.net/v1/models
```

The second command **must fail**. If it returns anything, port 8000 was exposed and the build is wrong. Fix it before writing the report, and never write "not reachable" into the data flow table without having run this.

## 3. Which URL goes where

Getting this wrong produces an **empty model dropdown with no error**, the most common failure in this skill.

| | `OPENAI_API_BASE_URL` |
|---|---|
| **This build** | `http://127.0.0.1:8000/v1` |
| Pod with a public port, deliberately not used | `https://<PODID>-8000.proxy.runpod.net/v1` |

Two traps:

- **`OLLAMA_BASE_URL` must be an empty string**, not unset and not localhost. Left at default, Open WebUI blocks on a local Ollama that does not exist.
- **No trailing slash, and never append `/chat/completions`.** Open WebUI adds the route.

### Connecting the user's own apps to the pod

The question always comes next: "can Goose or my desktop app use this like a local Ollama?" Yes, without changing the security posture. Verified 6 August 2026 against a real Open WebUI install.

**The right answer for most apps: Open WebUI's own OpenAI-compatible passthrough.** It rides the already-exposed 8080 and its existing auth.

| Setting | Value |
|---|---|
| Base URL | `https://<PODID>-8080.proxy.runpod.net/api` |
| API key | generated in Open WebUI, Settings → Account → API Keys |
| Endpoint it serves | `POST /api/chat/completions`, `GET /api/models` |

Verified behaviour: no key and a bad key both return **401**, so the gate holds. The base is `/api`, **not `/v1`**; `/v1/...` paths on Open WebUI return the web app's HTML to any URL, which reads as a 200 in a probe but is the SPA fallback, not an API and not a leak. An app that hardcodes appending `/v1/chat/completions` cannot use this passthrough.

**For `/v1`-hardcoded or Anthropic-only clients: an SSH port-forward to vLLM.** `ssh -L 8000:localhost:8000` makes the pod's loopback endpoint appear at `http://localhost:8000` on the user's machine, private end to end. vLLM serves both dialects there: OpenAI at `/v1`, and the Anthropic Messages API at `/v1/messages`, which is what lets Claude Code point `ANTHROPIC_BASE_URL` at the pod.

**Never expose port 8000 to give an app a "real" URL.** That is refusal 1 in the cost gate, whatever the app is.

## 4. Prove it with a real reply

Three checks. Only the third is proof.

```bash
# 1. the endpoint lists the model
curl -s "$OPENAI_API_BASE_URL/models" -H "Authorization: Bearer $OPENAI_API_KEY" | jq '.data[].id'

# 2. the endpoint generates
curl -s "$OPENAI_API_BASE_URL/chat/completions" \
  -H "Authorization: Bearer $OPENAI_API_KEY" -H 'Content-Type: application/json' \
  -d '{"model":"<MODEL_ID>","messages":[{"role":"user","content":"Reply with the single word: ready"}],"max_tokens":16}' \
  | jq -r '.choices[0].message.content'

# 3. the interface is up
curl -s -o /dev/null -w '%{http_code}\n' "https://<PODID>-8080.proxy.runpod.net/health"
```

- **Check 1 passing does not mean generation works.** The model list can serve while the weights fail to load.
- **Capture the real prompt and real reply verbatim** for the report. Never paraphrase model output, never invent it.
- The user still creates the admin account themselves on first visit, because the first account to register becomes admin and it must be theirs.
