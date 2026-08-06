# Troubleshooting

Go here before improvising. These six account for nearly every broken run.

Every one of them presents as "it deployed and it does not work", with no useful error. That is the point: the failures in this stack are silent.

## Contents
1. Empty model dropdown
2. vLLM is still loading
3. Open WebUI hangs on load
4. Chat history vanished after a restart
5. Inference endpoint reachable from outside
6. Chat URL stopped working

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
