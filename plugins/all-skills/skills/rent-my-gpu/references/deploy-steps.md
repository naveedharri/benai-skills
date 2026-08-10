# Deploy Steps

The runbook. One build: a single Secure Cloud pod with two locked doors. Open WebUI on 8080 behind its own login, and vLLM's API on 8000 behind a generated Bearer key, which is what lets Claude Code and other apps use the pod directly from a URL.

**Verify every CLI flag with `--help` before running it.** Flags below were correct on 5 August 2026, not necessarily today. If one is gone, ask the provider's own agent skill, then fix this file.

## Contents
1. Credential handling
2. Build the pod
3. Which URL goes where
4. Prove it with a real reply

## 1. Credential handling

One credential, created at **https://console.runpod.io/user/settings** → API Keys, read/write scope. Give the user that exact URL as a link, not just the click path. Verified 6 August 2026.

Ask them to paste the key in chat, then put it straight into each `runpodctl` call that needs it. **Never show the user an `export` line or any shell command; they are non-technical.**

Rules:

- **Never write the key to a file**, never put it in the report. Echoing it is fine: shell state does not persist between commands, so the key has to stay readable to be reused in the ones that follow. It lands in the transcript, so tell the user to rotate it if that is ever shared.
- `runpodctl doctor` offers to persist the key to its own config. That is the user's choice; ask.
- **If the key has dropped out of context**, ask the user to paste it again. A deploy is long enough to be summarised. Never reconstruct it from memory: every call 401s and it reads as a broken pod rather than a bad key.
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

One Secure Cloud Pod in the user's chosen region, running both services. Every door has a lock: the chat login on 8080, a generated API key on 8000. Nothing on this pod answers an unauthenticated request.

```
┌─ RunPod Secure Cloud Pod, <REGION> ───────────────┐
│   vLLM        0.0.0.0:8000    exposed, Bearer key │
│                    ↑ localhost                    │
│   Open WebUI  0.0.0.0:8080    exposed, own login  │
│   Network volume, same region                     │
│     /app/backend/data   chat history, RAG docs    │
│     /root/.cache        model weights             │
└──────────┬───────────────────────┬────────────────┘
    HTTPS 8080, login       HTTPS 8000, API key
   people in a browser     Claude Code and apps
```

### Why one pod rather than two

RunPod **Global Networking** gives pods a private `.runpod.internal` network with no public ports, and it covers all six EU regions. It is **NVIDIA GPU Pods only**, and runs at **100 Mbps**. So a cheap CPU pod for the interface cannot join that private network.

One pod is better anyway: Open WebUI reaches vLLM over `localhost`, one region holds everything, and there is one pod to bill and one to tear down.

### 2a. Create the pod

`runpodctl` supports every setting this build needs. **Flag names verified against runpodctl 2.8.1 on 10 August 2026.** The camelCase forms this file carried until then (`--imageName`, `--secureCloud`, `--datacenter`, `--gpuType`, `--gpuCount`, `--networkVolumeId`, `--volumePath`) are **all wrong on 2.8.1** and fail as unknown flags. Run `runpodctl pod create --help` before trusting any of them again.

| Flag | Purpose |
|---|---|
| `--cloud-type` | Cloud tier, `SECURE` or `COMMUNITY`, defaults to SECURE. **Always SECURE here** |
| `--data-center-ids` | Comma-separated datacenter IDs. `runpodctl datacenter list` enumerates them |
| `--ports` | Comma-separated, with protocol: `8000/http,8080/http` |
| `--network-volume-id` | Attach a volume. `runpodctl network-volume list` |
| `--container-disk-in-gb` | Container disk, **default 20, which is too small for this image**. Use 60 |
| `--gpu-count` / `--gpu-id` | Count and model. `--gpu-id` takes the full string from `runpodctl gpu list` |
| `--image` / `--name` | Container image and pod name |
| `--docker-args` | **The container's CMD.** This is how vLLM gets its arguments |
| `--env` | Environment variables as a JSON object string |
| `--ssh` | Defaults to true |
| `--compliance` | e.g. `HIPAA,SOC_2_TYPE_2` |
| `--country-code` | Pin to a country, e.g. `DE`. A blunter instrument than `--data-center-ids` |
| `--stop-after` / `--terminate-after` | Auto-stop or auto-terminate datetime. **The only guardrail against a forgotten pod that does not depend on the user remembering** |

**There is no `--volumePath` flag on 2.8.1.** A network volume mounts at **`/workspace`**, and the create response confirms it in `volumeMountPath`. Point `--download-dir` at `/workspace/models`, not `/runpod-volume/models`.

### Do not override the entrypoint

**Learned on a billed GPU, 10 August 2026, and it cost about 10 minutes at $2.09/hr.** Creating the pod through the REST API with a `dockerEntrypoint` of `["bash","-lc", <long setup script>]` produced a pod that sat at `desiredStatus: RUNNING` with **`runtime: null` and `latestTelemetry: null` for over ten minutes**, no ports listening, SSH refused. Nothing in the API said why.

The `vllm/vllm-openai` image already has an entrypoint that accepts vLLM's own arguments. Pass them with `--docker-args` and let the image start normally. It comes up in a fraction of the time, and a failure is then a vLLM error you can read rather than a container that never starts.

Corollary: **do not do setup work in the entrypoint.** No `apt-get`, no `pip install`, no venv creation before the server starts. Get vLLM serving first, prove it, then install anything else over SSH on the running pod.

**Image rule, learned on a billed GPU on 6 August 2026: the image is `vllm/vllm-openai:latest`, never a base image plus `pip install vllm`.** A PyTorch base with vLLM and Open WebUI pip-installed at boot burned ~30 billed minutes before the first token, and the user killed the run. The prebuilt image carries the whole inference stack; the only install left is Open WebUI, minutes not tens of minutes. Set `HF_HUB_ENABLE_HF_TRANSFER=1` with `pip install hf_transfer` before the model download, or a 63 GB model downloads single-stream for half an hour.

**Order rule: the volume is created first, and it is where a bad region fails.** Volume creation validates the datacenter; fail there before anything bills. The region offered must already be volume-capable (`model-picker.md` section 1, Q1).

The build:

```bash
runpodctl datacenter list          # confirm the user's region ID exists and has stock
runpodctl network-volume list      # or create one in that same datacenter first

VLLM_API_KEY=$(openssl rand -hex 24)

runpodctl pod create \
  --name <NAME> \
  --image vllm/vllm-openai:latest \
  --cloud-type SECURE \
  --data-center-ids <REGION> \
  --gpu-id '<GPU>' --gpu-count <N> \
  --network-volume-id <VOLUME_ID> \
  --container-disk-in-gb 60 \
  --ports '8000/http,8080/http' \
  --env '{"HF_HUB_ENABLE_HF_TRANSFER":"1"}' \
  --docker-args "--model <MODEL> --host 0.0.0.0 --port 8000 \
    --api-key $VLLM_API_KEY \
    --served-model-name <SHORT_NAME> \
    --max-model-len 131072 --kv-cache-dtype fp8 \
    --gpu-memory-utilization 0.90 \
    --enable-auto-tool-choice --tool-call-parser <PARSER> \
    --download-dir /workspace/models"
```

**`--disable-log-requests` is gone from vLLM and passing it breaks the pod.** Verified against `vllm/engine/arg_utils.py` and `vllm/entrypoints/openai/cli_args.py` on 10 August 2026: the option is now **`--enable-log-requests`**, defaulting to `False`. There is no `disable` form left anywhere in the source.

This cost three dead pods on 10 August 2026 before it was found, because the failure is silent in the worst way: vLLM rejects the unknown argument in argparse and exits before it opens a port or writes anything you can reach, the container restarts, and every observable signal is identical to a slow image pull. `desiredStatus: RUNNING`, `runtime: null`, ports 404, SSH `container not found`.

Two consequences:

- **Omit the flag.** Request logging is off by default, so row 4 of the data flow table is satisfied by the default rather than by an argument. Only pass `--enable-log-requests` if you actually want prompts in the log, which on this build you do not.
- **Validate every vLLM flag against the source before a billed run**, the same way the tool-call parser is validated. An unknown flag is not a warning, it is an immediate exit.

```bash
curl -s https://raw.githubusercontent.com/vllm-project/vllm/main/vllm/engine/arg_utils.py \
  | grep -oE '"--[a-z0-9-]+"' | sort -u
```

`--served-model-name` is worth setting: it is the string the user pastes into `ANTHROPIC_MODEL`, and a short one beats `Qwen/Qwen3-Coder-30B-A3B-Instruct-FP8` in a config file.

Three things about that command:

- **`--ports '8080/http,8000/http'` and nothing else.** 8080 is the chat, 8000 is the API door for Claude Code and other apps. 8000 in this list is only acceptable because vLLM starts with a mandatory `--api-key` in 2b; the outside probe in 2c-bis proves the key is enforced before anything is handed over.
- **`--data-center-ids` takes the user's region answer verbatim.** Run `runpodctl datacenter list` first and fail loudly if their region is not in the output, rather than silently falling back.
- **The network volume must already exist in the same datacenter.** Attaching it also pins the pod to that datacenter, which is a useful second lock on the region.

**Known issue:** runpodctl has had a reported bug creating pods with a network volume ([runpodctl#172](https://github.com/runpod/runpodctl/issues/172)). If `--network-volume-id` fails, fall back to the REST API or the `runpod-mcp` skill rather than dropping the volume. A pod without the volume loses all chat history on restart and breaks the residency story. `--network-volume-id` worked normally on 2.8.1 on 10 August 2026.

**Capacity refusals are a separate failure from flag errors, and they happen at create time.** HTTP 500 `create pod: This machine does not have the resources to deploy your pod` means no capacity for that GPU in that datacenter right now. **Retry it a few times before moving region:** on 10 August 2026 `EU-RO-1` refused five times for one GPU type while `EUR-IS-1` refused twice and succeeded on the third identical call. See `model-picker.md` section 2 on checking stock before creating the volume, since the volume pins the region.

Legacy forms like `runpodctl create pod` still work but are deprecated. Prefer the `pod create` form above.

### 2b. Start vLLM with its key

The critical flag is `--api-key`. Port 8000 is public through the proxy, so vLLM must never start on this pod without one. Generate it on the pod and keep it for the report:

```bash
VLLM_API_KEY=$(openssl rand -hex 24)

vllm serve <MODEL> \
  --host 0.0.0.0 --port 8000 \
  --api-key "$VLLM_API_KEY" \
  --download-dir /workspace/models \
  --gpu-memory-utilization 0.92 \
  --enable-auto-tool-choice --tool-call-parser <PARSER>
```

**The tool-call flags are not optional with Open WebUI in front.** Open WebUI sends `tool_choice: "auto"`, and without them vLLM rejects every chat with `"auto" tool choice requires --enable-auto-tool-choice and --tool-call-parser to be set` — the model lists fine and every reply fails. Hit live on 6 August 2026. Parser by family: `hermes` for Qwen, `deepseek_v4` for DeepSeek, check the vLLM recipe for others.

- `--api-key` is mandatory. **A vLLM reachable without it is refusal 1 in the cost gate**, and 2c-bis proves enforcement from outside before handover.
- `--host 0.0.0.0` is required for the proxy to route to 8000; the key is the lock, not the binding.
- **Prompts stay out of the server log by default.** `--enable-log-requests` defaults to `False`, so row 4 of the data flow table is satisfied by not passing it. Do not pass the old `--disable-log-requests`; it no longer exists and kills the server on startup.
- `--download-dir` on the volume stops the model re-downloading on every restart. The mount point is `/workspace`.
- Open WebUI on the same pod still talks to `http://127.0.0.1:8000/v1`, now with this key as `OPENAI_API_KEY`.

For DeepSeek-V4-Flash-0731 the vLLM project publishes a recipe; its sanctioned single-node layout is data parallel plus expert parallel across 4 GPUs on H200, B200 or B300:

```bash
vllm serve deepseek-ai/DeepSeek-V4-Flash-0731 \
  --host 0.0.0.0 --port 8000 --api-key "$VLLM_API_KEY" \
  --data-parallel-size 4 --enable-expert-parallel \
  --kv-cache-dtype fp8 --trust-remote-code --block-size 256 \
  --gpu-memory-utilization 0.92 \
  --tokenizer-mode deepseek_v4 --tool-call-parser deepseek_v4 \
  --enable-auto-tool-choice --reasoning-parser deepseek_v4 \
  --speculative-config '{"method":"mtp","num_speculative_tokens":3}'
```

### 2b-bis. How to see what the pod is doing

Verified 10 August 2026. Read this before waiting on a pod, because the obvious signals lie.

**The port code through the proxy is the only reliable readiness signal.**

| Code on `https://<PODID>-8000.proxy.runpod.net/v1/models` | Meaning |
|---|---|
| `404` | The proxy has no route. Either the pod is not up yet, or **8000 was never in `--ports`** |
| `502` | The proxy has a route to a live pod and **nothing is listening on that port yet**. vLLM is loading, or it crashed |
| `401` | vLLM is serving and the key is enforced. This is the healthy unauthenticated answer |
| `200` | Serving, with a valid key |

A 502 that never becomes 401 or 200 points at the vLLM process, not at the network. A 404 that never changes points at `--ports`.

**What does not tell you anything useful:**

- **`runtime: null` and `latestTelemetry: null`** while `desiredStatus` is `RUNNING`. This reads identically for a slow image pull, a broken entrypoint and a server that exits on a bad flag. Do not diagnose from it.
- **There is no log access over the API.** `GET /v1/pods/<id>/logs` and `/containerLogs` both return HTTP 400, and 2.8.1 has no `runpodctl pod logs` subcommand. The console has logs; the API does not.
- **SSH reachability.** See below. It is not a readiness signal on an inference image.

### SSH, and what it is good for

Only for reading logs, and only on images that ship an SSH server. **`vllm/vllm-openai` does not.** On 10 August 2026 the HTTP proxy returned 502 for a pod at the same moment proxy SSH said `container not found`, repeatedly. The container was running; RunPod's SSH proxy simply had nothing to attach to. **Never conclude a container is dead because SSH cannot reach it.** If you need a shell, use an image that includes `sshd`, such as the RunPod PyTorch images.

When SSH is available, two setup requirements:

```bash
# 1. the key must be on the ACCOUNT, not just a PUBLIC_KEY env var on the pod.
#    Existing pods pick it up, so registering late still rescues a running pod.
curl -s -X POST https://api.runpod.io/graphql \
  -H 'Content-Type: application/json' -H "Authorization: Bearer $RUNPOD_API_KEY" \
  --data "$(python3 -c 'import json,sys;print(json.dumps({"query":"mutation($p:String!){updateUserSettings(input:{pubKey:$p}){id}}","variables":{"p":open(sys.argv[1]).read()}}))' ~/.ssh/id_ed25519.pub)"

# 2. connect as machine.podHostId, NOT the bare pod ID, and -tt is mandatory
ssh -tt <podHostId>@ssh.runpod.io -i ~/.ssh/id_ed25519 'your command; exit'
```

| SSH message | Meaning |
|---|---|
| `Permission denied (publickey)` | The key is not on the account. Register it |
| `Error: Your SSH client doesn't support PTY` | Key **accepted**. Add `-tt`. This error only appears after successful auth |
| `container not found` | Inconclusive. Either no container, or the image has no SSH server. Check the port code instead |

**If you script a readiness check, echo a distinctive marker.** The proxy banner contains *"The server may need to be upgraded"*, so `grep -qi 'up'` matches **"upgraded"** and reports a container running when none exists. That produced a wrong conclusion on 10 August 2026.

```bash
ssh -tt <podHostId>@ssh.runpod.io 'echo ZZMARKERZZ; exit' 2>&1 | grep -q 'ZZMARKERZZ'
```

Verify the tool-call parser name before you pass it, since an invalid one kills startup. The registry is a single file:

```bash
curl -s https://raw.githubusercontent.com/vllm-project/vllm/main/vllm/tool_parsers/__init__.py \
  | grep -oE '"[a-z0-9_]+"' | sort -u
```

Note the path is `vllm/tool_parsers/`, not the older `vllm/entrypoints/openai/tool_parsers/`, which now 404s. `qwen3_coder`, `qwen3_xml`, `hermes`, `deepseek_v4`, `glm47`, `gemma4` were all present on 10 August 2026.

### 2c. Start Open WebUI on the same pod

**Install it after vLLM is serving and proven, over SSH.** Not in the entrypoint, and not in the same Python environment: Open WebUI pins FastAPI and Pydantic versions that will fight vLLM's. Use an isolated venv, `python3 -m venv /opt/owui`, and run `/opt/owui/bin/open-webui serve`.

Image `ghcr.io/open-webui/open-webui:main`, or install into the pod directly. Environment:

| Variable | Value |
|---|---|
| `OPENAI_API_BASE_URL` | `http://127.0.0.1:8000/v1` |
| `OPENAI_API_KEY` | the `VLLM_API_KEY` from 2b |
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

Before handing over, prove the key is enforced from outside:

```bash
# from inside the pod, with the key: must succeed
curl -s http://127.0.0.1:8000/v1/models -H "Authorization: Bearer $VLLM_API_KEY" | head

# from your own machine, without the key: must return 401
curl -s -o /dev/null -w '%{http_code}\n' --max-time 8 https://<PODID>-8000.proxy.runpod.net/v1/models

# from your own machine, with the key: must return 200
curl -s -o /dev/null -w '%{http_code}\n' --max-time 8 \
  https://<PODID>-8000.proxy.runpod.net/v1/models -H "Authorization: Bearer $VLLM_API_KEY"
```

The no-key probe **must print 401**. A 200 means the key is not enforced and strangers can spend the money and read the prompts; stop vLLM and restart it with `--api-key`. A connection refused means 8000 was not in `--ports` and the API door does not exist; Claude Code cannot connect and the pod must be recreated with both ports. Either way, fix it before writing the report, and never fill the data flow table without having run this.

## 3. Which URL goes where

Getting this wrong produces an **empty model dropdown with no error**, the most common failure in this skill.

| Who is connecting | Base URL |
|---|---|
| **Open WebUI on the pod** | `http://127.0.0.1:8000/v1`, over localhost |
| **Claude Code, and apps outside** | `https://<PODID>-8000.proxy.runpod.net`, plus the vLLM key |

Two traps:

- **`OLLAMA_BASE_URL` must be an empty string**, not unset and not localhost. Left at default, Open WebUI blocks on a local Ollama that does not exist.
- **No trailing slash, and never append `/chat/completions`.** Open WebUI adds the route.

### Claude Code on the pod

vLLM serves the Anthropic Messages API at `/v1/messages`, so Claude Code points straight at the pod's API door. This exact block, with the real pod ID, key and model ID filled in, goes into the report verbatim: a user must be able to paste it from the page and be running Claude Code on their own GPU.

**This pod is an LLM gateway as far as Claude Code is concerned, and Claude Code has a documented configuration surface for exactly that.** Read https://code.claude.com/docs/en/llm-gateway-connect and https://code.claude.com/docs/en/llm-gateway-protocol before improvising a variable; every variable below was verified against those pages and `model-config` on 10 August 2026. The gateway protocol page is also the spec the pod must satisfy — check it before blaming vLLM.

```bash
export ANTHROPIC_BASE_URL="https://<PODID>-8000.proxy.runpod.net"
export ANTHROPIC_AUTH_TOKEN="<VLLM_API_KEY>"

# One model serves every alias, because the pod serves exactly one model.
export ANTHROPIC_MODEL="<MODEL_ID>"
export ANTHROPIC_DEFAULT_OPUS_MODEL="<MODEL_ID>"
export ANTHROPIC_DEFAULT_SONNET_MODEL="<MODEL_ID>"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="<MODEL_ID>"
export CLAUDE_CODE_SUBAGENT_MODEL="<MODEL_ID>"

export CLAUDE_CODE_MAX_OUTPUT_TOKENS=<below the served context, minus the prompt>
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1
export CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1
claude
```

Six rules that decide whether this works:

- **`ANTHROPIC_DEFAULT_HAIKU_MODEL`, not `ANTHROPIC_SMALL_FAST_MODEL`.** The docs state plainly: "`ANTHROPIC_SMALL_FAST_MODEL` is deprecated in favor of `ANTHROPIC_DEFAULT_HAIKU_MODEL`." The haiku variable is what background functionality resolves through, so on a one-model pod it must point at the served model or background calls ask for a model that does not exist.
- **Point every alias at the one served model, and set `CLAUDE_CODE_SUBAGENT_MODEL` too.** Subagents, agent teams and workflows resolve their own model and override both the per-invocation parameter and a subagent's frontmatter; unset, they ask the pod for something it does not serve. `inherit` restores normal resolution when that is wanted.
- **`CLAUDE_CODE_MAX_OUTPUT_TOKENS` must fit inside the pod's context, minus the real prompt.** Hit live on 10 August 2026, twice. First a 16k pod: Claude Code requests up to 32,000 output tokens by default, and every message got `500 max_completion_tokens=32000 cannot be greater than max_model_len` in an endless retry loop. Then a 32k pod: the user's actual system prompt measured **over 28,673 input tokens** (it scales with their plugins, skills and CLAUDE.md files, not a fixed size), so 4,096 output still overflowed. Note vLLM reports input as a *lower bound* it hits while tokenizing — with the same prompt it reported 24,577 against an 8,192 cap and 28,673 against a 4,096 cap, both totalling exactly one token over the window, so the reported figure is not the prompt's real size. Measure the window, not the error message.
  **The combination that works: a 128k pod with `CLAUDE_CODE_MAX_OUTPUT_TOKENS=32000`.** Verified end to end on 10 August 2026 against `--max-model-len 131072`: roughly 30k of system prompt plus 32k of output sits comfortably inside the window, and Claude Code's default request of up to 32,000 output tokens is then never the thing that overflows. Use this pairing rather than deriving a number, unless the pod serves something other than 128k.
- **Serve 128k context, not 64k.** `CLAUDE_CODE_AUTO_COMPACT_WINDOW` is the documented fix for a gateway whose context is smaller than the model's native window, but **its value is clamped to a minimum of 100,000 tokens**, so a pod serving less than that cannot use it and the user is left running `/compact` by hand. 64k is a smoke-test size; 128k is the size that behaves.
- **`CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1` pre-empts the most likely vLLM rejection.** Claude Code sends pre-release fields (`context_management`, tool-schema fields like `strict` and `defer_loading`) that an upstream which is not Anthropic's API may reject with `400 ... Extra inputs are not permitted`. This suppresses most of them.
- **`CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1` keeps the session on the pod.** It stops version checks, telemetry, error reports and gateway model discovery. Two documented consequences to state: auto-updates stop, so the user needs another update path, and WebFetch's domain safety check still calls `api.anthropic.com` (turn that off separately with `skipWebFetchPreflight`).

`CLAUDE_CODE_MAX_RETRIES=1` plus `--verbose` during setup turns a retry loop into one readable error. Two more documented options worth knowing: `CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY=1` makes Claude Code populate its `/model` picker from the pod's own `/v1/models` (which vLLM serves), and `CLAUDE_CODE_SKIP_FAST_MODE_ORG_CHECK=1` silences `/fast` reporting itself disabled, which it does on any bearer-token session.

- **`ANTHROPIC_AUTH_TOKEN`, never `ANTHROPIC_API_KEY`.** Documented verbatim: "`ANTHROPIC_AUTH_TOKEN` in `Authorization: Bearer`, `ANTHROPIC_API_KEY` in `x-api-key`, and `apiKeyHelper` in both." Bearer is the header vLLM's `--api-key` checks, so the API-key variable gets a 401 from a healthy pod. `ANTHROPIC_API_KEY` also needs a one-time interactive approval and is silently ignored if previously declined, which reads as a broken pod.
- **Set both model variables to the served model ID**, exactly as vLLM announces it in `/v1/models`. Claude Code's background calls otherwise ask for a Haiku the pod does not serve, and the session fails in confusing partial ways.
- **The URL and the key both die with the pod.** The pod ID is in the hostname, and the key lives in vLLM's process. Recreate the pod and every machine running this block needs the new values from the new report.

**Offer the settings-file form as well as the exports**, because exports die with the terminal. Claude Code reads an `env` block from a settings file, and settings-file values win over shell exports:

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://<PODID>-8000.proxy.runpod.net",
    "ANTHROPIC_AUTH_TOKEN": "<VLLM_API_KEY>",
    "ANTHROPIC_MODEL": "<MODEL_ID>",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "<MODEL_ID>",
    "CLAUDE_CODE_MAX_OUTPUT_TOKENS": "<value>",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  }
}
```

Two documented rules make the difference between this working and a login prompt. Put it in **`~/.claude/settings.json`**, not a project's `.claude/settings.json`: the project file is committed and would publish the key, and a project-scoped `env` block is only read *after* the first-run wizard, so a fresh machine asks the user to log in even though the URL and key are correct. If a project scope is genuinely wanted, `.claude/settings.local.json` is gitignored — and the credential still has to reach Claude Code before first-run setup from a shell export or the user-level file.

### Connecting the user's other apps to the pod

"Can Goose or my desktop app use this like a local Ollama?" Yes, two ways, verified 6 August 2026 against a real Open WebUI install.

**OpenAI-dialect apps that let you set a full base URL: the vLLM door directly.** Base URL `https://<PODID>-8000.proxy.runpod.net/v1`, key the vLLM key, model ID verbatim.

**Apps that should ride the chat accounts instead: Open WebUI's own OpenAI-compatible passthrough** on 8080, useful when each teammate should use their own Open WebUI key rather than the shared vLLM key.

| Setting | Value |
|---|---|
| Base URL | `https://<PODID>-8080.proxy.runpod.net/api` |
| API key | generated in Open WebUI, Settings → Account → API Keys |
| Endpoint it serves | `POST /api/chat/completions`, `GET /api/models` |

Verified behaviour: no key and a bad key both return **401**, so the gate holds. The base is `/api`, **not `/v1`**; `/v1/...` paths on Open WebUI return the web app's HTML to any URL, which reads as a 200 in a probe but is the SPA fallback, not an API and not a leak. An app that hardcodes appending `/v1/chat/completions` cannot use this passthrough; give it the vLLM door instead.

**For maximum privacy, the zero-exposure variant still exists**: build with `--ports '8080/http'` only, vLLM back on `--host 127.0.0.1`, and reach the API with `ssh -L 8000:localhost:8000`. Offer it only when the user explicitly refuses a public API door; it costs them the paste-and-run Claude Code block, because `localhost` URLs only work where the tunnel runs.

**Never run vLLM reachable from outside without `--api-key`.** That is refusal 1 in the cost gate, whatever the app is.

## 4. Prove it with a real reply

Four checks. Generation proof comes from 2 and 4; check 3 only proves the interface is up.

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

# 4. the Anthropic door generates, from outside, through the proxy
curl -s "https://<PODID>-8000.proxy.runpod.net/v1/messages" \
  -H "Authorization: Bearer $VLLM_API_KEY" \
  -H "anthropic-version: 2023-06-01" -H 'Content-Type: application/json' \
  -d '{"model":"<MODEL_ID>","max_tokens":64,"messages":[{"role":"user","content":"Reply with the single word: ready"}]}' \
  | jq -r '.content[0].text'
```

- **Check 4 is what makes the Claude Code block in the report honest.** Never print that block without having seen this reply; the report claims paste-and-run, so the exact path it uses must have generated once.
- **Check 1 passing does not mean generation works.** The model list can serve while the weights fail to load.
- **Capture the real prompt and real reply verbatim** for the report. Never paraphrase model output, never invent it.
- The user still creates the admin account themselves on first visit, because the first account to register becomes admin and it must be theirs.
