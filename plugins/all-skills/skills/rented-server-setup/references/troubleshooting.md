# Troubleshooting

Go here before improvising. Sections 1 through 6 are Route B, the pod; they account for nearly every broken run there. Sections 7 through 9 are Route A, the OVH endpoint.

Every one of them presents as "it deployed and it does not work", with no useful error. That is the point: the failures in this stack are silent.

## Contents
0. The pod never starts at all (Route B)
1. Empty model dropdown (Route B)
2. vLLM is still loading (Route B)
3. Open WebUI hangs on load (Route B)
4. Chat history vanished after a restart (Route B)
5. Inference endpoint answers without a key, or the API door is missing (Route B)
6. Chat or API URL stopped working, Claude Code 401 or max_completion_tokens 500 loop (Route B)
7. 429 on the OVH endpoint (Route A)
8. Empty reply with finish_reason length (Route A)
9. 403 or model not found on the OVH endpoint (Route A)

## 0. The pod never starts at all

Symptom: `desiredStatus: RUNNING`, ports stuck on 404 or 502, and nothing anywhere says why. Diagnosed the hard way on 10 August 2026 across three dead pods and about an hour of billed GPU.

**`runtime: null` is not diagnostic.** It reads identically for a slow image pull, a broken entrypoint and a server that exited on a bad argument. Neither is SSH: see `deploy-steps.md` 2b-bis. Judge by the **port code** only.

Work the causes in this order. The first one is by far the most likely and the least obvious.

| # | Cause | How to tell | Fix |
|---|---|---|---|
| 1 | **An invalid vLLM argument** | Port sits on **502**, meaning the pod is live but nothing is listening. vLLM exited during argparse | Validate every flag against the source before the run. See below |
| 2 | **Overridden entrypoint** | You passed `dockerEntrypoint` | Remove it. Use the image's entrypoint plus `--docker-args` |
| 3 | **Container disk too small** | `vllm/vllm-openai:latest` is **8.91 GB compressed** on amd64, roughly 20 to 25 GB unpacked | `--container-disk-in-gb 60`. The 20 GB default cannot hold this image, and 30 GB is nearly full before any model |
| 4 | **Weights competing with the image** | No volume, or `--download-dir` not on the volume | Size the disk for image plus weights, or attach a volume and point `--download-dir` at `/workspace` |
| 5 | **Genuinely still pulling** | Port moves 404 to 502 within a few minutes | Wait. A cold machine pulling ~9 GB compressed takes minutes, and all of it is billed |

### Cause 1 in full, because it is the one that wastes an hour

**`--disable-log-requests` no longer exists in vLLM.** It is now `--enable-log-requests`, defaulting to `False`. Passing the old flag makes vLLM exit in argparse **before it opens a port or writes anything you can reach**. The container restarts, and every observable signal matches a slow image pull.

This flag was in this skill's own runbook until 10 August 2026, which is why three consecutive pods failed identically.

Validate flags and parser names before spending money on a load:

```bash
# every accepted engine argument
curl -s https://raw.githubusercontent.com/vllm-project/vllm/main/vllm/engine/arg_utils.py \
  | grep -oE '"--[a-z0-9-]+"' | sort -u

# every registered tool-call parser. Note the path is vllm/tool_parsers/,
# not the older vllm/entrypoints/openai/tool_parsers/, which now 404s
curl -s https://raw.githubusercontent.com/vllm-project/vllm/main/vllm/tool_parsers/__init__.py \
  | grep -oE '"[a-z0-9_]+"' | sort -u
```

An unknown flag is not a warning. It is an immediate exit with no reachable output.

### What actually makes a run fast

Timing measured 10 August 2026: with a valid flag set, an 8 GB model on a High-stock card went from `pod create` to a served generation in **about 2.5 minutes**, roughly 20 seconds of which was after the port first answered.

**The lever is the model and the stock level, not the region.** An 8 GB model on a High-stock card reaches first token far sooner than a 31 GB model on a Low-stock one, and Low stock additionally costs retries at creation. Provisioning time varies by machine, so do not treat one slow pod as evidence about a region.

## 1. Empty model dropdown, no error

The most common failure by a wide margin. Open WebUI loads, you sign in, and the model dropdown is empty with nothing in the UI to explain it.

Almost always the base URL. Check in this order:

| Check | Correct |
|---|---|
| Base URL | `http://127.0.0.1:8000/v1`, loopback, ends `/v1` |
| Trailing slash | none |
| Route appended | none. No `/chat/completions`. Open WebUI adds it |
| `OPENAI_API_KEY` | the vLLM `--api-key` value, mandatory on this build |

Confirm from inside the pod, before touching Open WebUI's config:

```bash
curl -s "$OPENAI_API_BASE_URL/models" -H "Authorization: Bearer $OPENAI_API_KEY" | jq '.data[].id'
```

If that returns model IDs, vLLM is fine and the problem is Open WebUI's variable. If it returns 401, the key is wrong. If it returns 404, the path is wrong. If it refuses to connect, vLLM is not up: see section 2.

After correcting a variable, Open WebUI must be restarted for it to take effect. A variable changed without a restart is the second-order version of this same bug.

## 2. vLLM is still loading

Not a failure. A large model takes minutes to load into VRAM, and every check will fail until it finishes.

- Watch the vLLM log rather than polling the endpoint blind. It prints progress and then a line saying it is serving.
- A 149 GB model on four GPUs is the slow case. Allow minutes, not seconds.
- The pod bills throughout the load. Say that once, so the wait is not a surprise on the invoice.

## 3. Open WebUI hangs on load, spinner forever

`OLLAMA_BASE_URL` was left at its default. Open WebUI tries to reach an Ollama that is not installed on the pod and blocks on it.

Set it to an empty string. Not unset, not `localhost`, not removed: an explicit empty value. Then restart Open WebUI.

## 4. Chat history and accounts vanished after a restart

The volume was not mounted at `/app/backend/data`, or was mounted at the wrong path.

Everything Open WebUI persists lives there: the SQLite database with accounts, chats and settings, uploaded RAG documents, vector embeddings, cached models. Without the volume, each restart starts from an empty disk and the user has to create the admin account again, which is usually how they notice.

Check the mount path exactly. `/app/backend/data`, not `/app/data` and not `/data`. Fix the mount and restart. **The lost data does not come back**; say that rather than implying it might.

## 5. The inference endpoint answers without a key

The no-key probe in `deploy-steps.md` 2c-bis returned 200 instead of 401: vLLM was started without `--api-key`, on a port that is public through the proxy.

This is the one failure that breaks the whole premise of the build: an unauthenticated inference endpoint on a rented GPU means strangers spend the money and read the prompts.

1. Stop vLLM now. Do not leave it up while you think about it.
2. Generate a fresh key and restart with `--api-key`, exactly as in `deploy-steps.md` 2b.
3. Update `OPENAI_API_KEY` in Open WebUI to the new key and restart it.
4. Re-run the probes: 401 without the key, 200 with it.
5. Tell the user plainly that the endpoint was open, for roughly how long, and that RunPod usage for that window is worth checking.

Do not soften this. It is a real exposure with a real bill attached.

The reverse failure also exists: the no-key probe **refuses to connect** instead of returning 401. Then 8000 was never in `--ports`, the API door does not exist, and Claude Code cannot reach the pod. Ports are fixed at creation, so the pod must be recreated with `--ports '8080/http,8000/http'`; the volume keeps all history and weights through that.

## 6. The chat URL worked yesterday and does not today

The pod was recreated, so the pod ID changed, and the pod ID is in both hostnames: the chat at `https://<PODID>-8080.proxy.runpod.net` and the API at `https://<PODID>-8000.proxy.runpod.net`. Anyone with the old link gets nothing.

Get the current pod ID and give them the new URLs. Nothing internal breaks, because Open WebUI reaches vLLM over `localhost` and that never changes. But **every machine running the Claude Code block needs updating**: `ANTHROPIC_BASE_URL` carries the dead hostname, and if vLLM restarted with a fresh key, `ANTHROPIC_AUTH_TOKEN` is stale too. Regenerate the report so the paste-and-run block is current.

This is structural, not a bug. Tell the user once: **both URLs change if the pod is ever recreated.** If they need a stable address, that is a custom domain in front of it, which is outside this skill.

Also confirm 8080 is still in the pod's exposed HTTP ports. A recreated pod does not inherit that unless it was in the template, and the proxy cannot route to an undeclared port even when the container is listening.

## 6a. Model lists, every reply fails with a tool-choice error

`"auto" tool choice requires --enable-auto-tool-choice and --tool-call-parser to be set`, shown in the chat itself. Hit live on 6 August 2026.

Open WebUI sends `tool_choice: "auto"` on normal chats. vLLM without the flags accepts the model list call and rejects every generation, so the deploy looks perfect until the first message. Restart vLLM with `--enable-auto-tool-choice --tool-call-parser hermes` (Qwen family; see the vLLM recipe for others). The flags are already in the standard command in `deploy-steps.md` 2b; a build missing them was not built from that file.

## 6a-bis-2. Claude Code loops on `500 max_completion_tokens cannot be greater than max_model_len`

Connection and auth are fine; every message fails with a 500 and Claude Code retries forever. Claude Code requests up to 32,000 output tokens by default, and vLLM rejects any request whose completion budget exceeds `--max-model-len`. Hit live on 10 August 2026 against a pod serving a 16k context.

Fix on the client, no pod restart needed: `export CLAUDE_CODE_MAX_OUTPUT_TOKENS=<value>`, then relaunch `claude`. The second variant of the same error names input tokens: `maximum context length is N tokens. However, you requested X output tokens and your prompt contains at least Y input tokens`.

**Do not trust Y.** It is a lower bound vLLM hits while tokenizing, not the prompt's real size: on 10 August 2026 the same prompt reported Y=24,577 against an 8,192 output cap and Y=28,673 against a 4,096 cap — both totalling exactly one token over the window. Lowering the output cap therefore appears to do nothing, because the real prompt is larger than either figure. The prompt scales with the user's plugins, skills and CLAUDE.md files.

So: size the pod, don't chase the number. **128k of served context is the target** — `CLAUDE_CODE_AUTO_COMPACT_WINDOW`, the documented fix for a gateway with a smaller window than the model's own, clamps to a **minimum of 100,000 tokens**, so a pod below that cannot use it and `/compact` by hand is the only recovery. `CLAUDE_CODE_MAX_RETRIES=1` plus `--verbose` turns the retry loop into one readable error.

## 6a-bis. Claude Code gets 401 from a healthy pod

The curl checks pass with the key, and Claude Code still gets 401 on the same URL. Almost always the wrong variable: the key was exported as `ANTHROPIC_API_KEY`, which Claude Code sends as an `x-api-key` header. vLLM's `--api-key` middleware checks `Authorization: Bearer`, so it rejects the request however correct the key is.

Unset `ANTHROPIC_API_KEY`, export the key as `ANTHROPIC_AUTH_TOKEN`, restart Claude Code. The block in the report uses `ANTHROPIC_AUTH_TOKEN` for exactly this reason; a 401 usually means someone retyped it from memory.

If the variable is right and it still fails, compare keys: vLLM restarted with a freshly generated key invalidates the one in the report. Section 6 covers the recreated-pod version of the same staleness.

## 6a-bis-3. The other four documented gateway failures

Claude Code treats the pod as an LLM gateway, and its own troubleshooting table covers failures that look like a broken pod but are not. Verified against https://code.claude.com/docs/en/llm-gateway-connect on 10 August 2026.

| Symptom | Cause | Fix |
|---|---|---|
| `400` naming `context_management`, `Extra inputs are not permitted`, or another unrecognized field | Claude Code sends pre-release fields that vLLM rejects | `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1` |
| `400` naming `thinking` or `adaptive` | The served model does not accept adaptive reasoning | Serve a model that does. `CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING=1` only helps on Opus 4.6 and Sonnet 4.6, and the model-config capability variables **do not apply behind an `ANTHROPIC_BASE_URL` gateway** |
| Claude Code asks the user to log in although the curl probes pass | A reachable base URL is not a credential, and a project-scoped `env` block is only read after the first-run wizard | Put `ANTHROPIC_AUTH_TOKEN` in a shell export or `~/.claude/settings.json` |
| `/fast` reports fast mode disabled or unavailable | The availability check needs a claude.ai login or Anthropic key and never routes through the pod | `CLAUDE_CODE_SKIP_FAST_MODE_ORG_CHECK=1`; harmless to ignore otherwise |

One more worth knowing because it looks like an outage: a `403` with an HTML body while the pod's own log shows no request means a firewall ahead of it inspected the body. Claude Code prompts carry XML-style tags and source code that trip cross-site-scripting body rules, so a short curl test passes and a real session does not.

## 6b. The volume refuses the region

`Data center "X" not found or does not support network volumes.` Seen live with `EU-NL-1` on 6 August 2026: a region can exist for pods and still not hold volumes. The error message enumerates the valid list; re-offer the region question from that list. Prevention is in `model-picker.md` section 1, Q1: never offer a region without checking volume capability first.

## 6c. Setup is taking forever

The three causes, in order of likelihood, all from a real run:

1. **Wrong base image.** A PyTorch base pip-installing vLLM adds 10 to 20 billed minutes. The image is `vllm/vllm-openai:latest`, full stop.
2. **No hf_transfer.** Single-stream downloads run at tens of MB/s; a 63 GB model takes half an hour. `HF_HUB_ENABLE_HF_TRANSFER=1`.
3. **The model is just big.** 63 GB has a floor of ~20 minutes end to end however good the setup. If the user wanted "quick", they wanted the 27B default.

While it runs: checkpoint to the user every 3 minutes. A user who hears nothing for 10 minutes kills a healthy deploy.

## 7. 429 on the OVH endpoint

The rate limit, not an outage. The anonymous tier allows **2 requests per minute, per IP, per model**, which real use exhausts almost immediately; that is the signal to create an API key, not to retry harder. With a key the limit is 400 requests per minute per Public Cloud project per model.

An app wired to the anonymous endpoint will look broken the moment two people use it. Check whether `OPENAI_API_KEY` was actually set in the app before blaming OVH.

## 8. Empty reply with `finish_reason: length`

Not an outage, a token budget problem, and it looks exactly like a broken model.

The gpt-oss models spend completion tokens on a `reasoning` field before writing the answer. Verified 6 August 2026: with `max_tokens: 16`, the whole budget went to reasoning, `content` came back empty, and `finish_reason` was `length`.

Raise `max_tokens` well past the reasoning overhead, hundreds not tens, and retry. When judging whether the endpoint works, check `finish_reason` before concluding anything from an empty `content`.

## 9. 403, or model not found, on the OVH endpoint

- **403** is the key: wrong, expired, or revoked. OVH returns 403 here, not 401. Keys carry a validity period the user set at creation; an integration that worked last month and returns 403 today most likely outlived its key.
- **Model not found** is the ID: the catalog matches verbatim, so `gpt-oss-120b`, not `openai/gpt-oss-120b`. Re-read the live catalog (`ovh-endpoints.md` section 2) rather than trusting what the ID used to be; models leave the catalog without notice, and a model that left is a Route B conversation.
