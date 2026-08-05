# Troubleshooting

Go here before improvising. These six account for nearly every broken run.

Every one of them presents as "it deployed and it does not work", with no useful error. That is the point: the failures in this stack are silent.

## Contents
1. Empty model dropdown
2. Cold start looks like a timeout
3. Open WebUI hangs on load
4. Chat history vanished after a redeploy
5. Pod endpoint answers for strangers
6. Pod URL stopped working

## 1. Empty model dropdown, no error

The most common failure by a wide margin. Open WebUI loads, you sign in, and the model dropdown is empty with nothing in the UI to explain it.

Almost always the base URL. Check in this order:

| Check | Correct |
|---|---|
| Serverless path | ends `/openai/v1`, with the `openai` segment |
| Pod path | ends `/v1`, no `openai` segment |
| Trailing slash | none |
| Route appended | none. No `/chat/completions`. Open WebUI adds it |
| `OPENAI_API_KEY` | the RunPod key for Serverless, the `--api-key` value for a Pod |

Confirm from outside Open WebUI before touching Railway again:

```bash
curl -s "$OPENAI_API_BASE_URL/models" -H "Authorization: Bearer $OPENAI_API_KEY" | jq '.data[].id'
```

If that returns model IDs, the endpoint is fine and the problem is the Railway variable. If it returns 401, the key is wrong. If it returns 404, the path is wrong.

After correcting a variable, Railway needs a redeploy for it to take effect. A variable changed in the dashboard without a redeploy is the second-order version of this same bug.

## 2. Cold start looks like a timeout

On Serverless, the first request after idle loads the whole model. That is 30 seconds to several minutes depending on size. `curl` gives up long before the worker is ready, and it reads as a dead endpoint.

- Raise the curl timeout well past the model's load time before concluding anything.
- Watch the worker state in RunPod rather than guessing from the client side. A worker in an initialising state is working, not broken.
- If the user finds this intolerable, the fixes are: raise idle timeout so workers stay warm between messages, raise min workers above 0 which costs like a Pod, or move to a Pod. Say the cost of each.
- **A 149 GB model on Serverless will always feel broken.** That is why `model-picker.md` flags the frontier tier as a poor Serverless fit. If you are here with DeepSeek on Serverless, the configuration is wrong, not the deployment.

## 3. Open WebUI hangs on load, spinner forever

`OLLAMA_BASE_URL` was left at its default. Open WebUI tries to reach a local Ollama that does not exist on Railway and blocks on it.

Set it to an empty string. Not unset, not `localhost`, not removed: an explicit empty value. Then redeploy.

## 4. Chat history and accounts vanished after a redeploy

The volume was not mounted at `/app/backend/data`, or was mounted at the wrong path.

Everything Open WebUI persists lives there: the SQLite database with accounts, chats and settings, uploaded RAG documents, vector embeddings, cached models. Without the volume, each deploy starts from an empty disk and the user has to create the admin account again, which is usually how they notice.

Check the mount path exactly. `/app/backend/data`, not `/app/data` and not `/data`. Fix the mount and redeploy. **The lost data does not come back**; say that rather than implying it might.

## 5. The pod endpoint is answering for people who are not the user

vLLM was started without `--api-key`. The pod proxy URL is public, and unauthenticated inference on a rented GPU is exactly as bad as it sounds: strangers spend the money and see nothing stopping them.

The cost gate is supposed to refuse this configuration. If you are reading this, it got past the gate.

1. Destroy or restart the pod now. Do not leave it up while you think about it.
2. Restart vLLM with `--api-key` set to a fresh random value.
3. Set the same value as `OPENAI_API_KEY` on Railway and redeploy.
4. Tell the user plainly that the endpoint was reachable without authentication, for how long, and that RunPod usage for that window is worth checking.

Do not soften this. It is a real exposure with a real bill attached.

## 6. The pod URL worked yesterday and does not today

The pod was recreated, so the pod ID changed, so `https://<PODID>-8000.proxy.runpod.net/v1` changed with it. Railway is still pointing at the old one.

Get the current pod ID, update `OPENAI_API_BASE_URL`, redeploy Railway.

This is structural, not a bug, and it is the main argument for Serverless in this stack: its URL is stable across restarts. If the user recreates pods often, move them to Serverless rather than teaching them to re-paste a URL.

Also confirm port 8000 is still declared in the pod's exposed HTTP ports. A recreated pod does not inherit that unless it was in the template, and the proxy cannot route to an undeclared port even when the container is listening on it.
