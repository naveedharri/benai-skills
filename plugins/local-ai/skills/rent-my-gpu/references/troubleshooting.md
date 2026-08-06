# Troubleshooting

Go here before improvising. Sections 1 through 6 are Route B, the pod; they account for nearly every broken run there. Sections 7 through 9 are Route A, the OVH endpoint.

Every one of them presents as "it deployed and it does not work", with no useful error. That is the point: the failures in this stack are silent.

## Contents
1. Empty model dropdown (Route B)
2. vLLM is still loading (Route B)
3. Open WebUI hangs on load (Route B)
4. Chat history vanished after a restart (Route B)
5. Inference endpoint reachable from outside (Route B)
6. Chat URL stopped working (Route B)
7. 429 on the OVH endpoint (Route A)
8. Empty reply with finish_reason length (Route A)
9. 403 or model not found on the OVH endpoint (Route A)

## 1. Empty model dropdown, no error

The most common failure by a wide margin. Open WebUI loads, you sign in, and the model dropdown is empty with nothing in the UI to explain it.

Almost always the base URL. Check in this order:

| Check | Correct |
|---|---|
| Base URL | `http://127.0.0.1:8000/v1`, loopback, ends `/v1` |
| Trailing slash | none |
| Route appended | none. No `/chat/completions`. Open WebUI adds it |
| `OPENAI_API_KEY` | any non-empty string, or the vLLM `--api-key` value if you set one |

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

## 5. The inference endpoint is reachable from outside

Step 7's second check returned something instead of failing. Either port 8000 was exposed on the pod, or vLLM was started on `0.0.0.0` instead of `127.0.0.1`.

This is the one failure that breaks the whole premise of the build: an unauthenticated inference endpoint on a rented GPU means strangers spend the money and read the prompts.

1. Stop vLLM now. Do not leave it up while you think about it.
2. Restart it with `--host 127.0.0.1`.
3. Remove 8000 from the pod's exposed ports. If it was in `--ports` at creation, the pod must be recreated.
4. Re-run step 7 and confirm the outside call fails.
5. Tell the user plainly that the endpoint was reachable, for roughly how long, and that RunPod usage for that window is worth checking.

Do not soften this. It is a real exposure with a real bill attached.

## 6. The chat URL worked yesterday and does not today

The pod was recreated, so the pod ID changed, and the chat URL is `https://<PODID>-8080.proxy.runpod.net`. Anyone with the old link gets nothing.

Get the current pod ID and give them the new URL. Nothing internal breaks, because Open WebUI reaches vLLM over `localhost` and that never changes.

This is structural, not a bug. Tell the user once: **the chat URL changes if the pod is ever recreated.** If they need a stable address, that is a custom domain in front of it, which is outside this skill.

Also confirm 8080 is still in the pod's exposed HTTP ports. A recreated pod does not inherit that unless it was in the template, and the proxy cannot route to an undeclared port even when the container is listening.

## 6a. Model lists, every reply fails with a tool-choice error

`"auto" tool choice requires --enable-auto-tool-choice and --tool-call-parser to be set`, shown in the chat itself. Hit live on 6 August 2026.

Open WebUI sends `tool_choice: "auto"` on normal chats. vLLM without the flags accepts the model list call and rejects every generation, so the deploy looks perfect until the first message. Restart vLLM with `--enable-auto-tool-choice --tool-call-parser hermes` (Qwen family; see the vLLM recipe for others). The flags are already in the standard command in `deploy-steps.md` 2b; a build missing them was not built from that file.

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
