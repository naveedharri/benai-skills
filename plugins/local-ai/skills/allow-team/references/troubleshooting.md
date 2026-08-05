# Troubleshooting

Match the symptom, apply the fix, do not improvise before checking this list. Verified against ngrok 3.38.0 and Open WebUI 0.11.0 on 5 August 2026.

## Contents
1. The tunnel starts and immediately dies
2. No public URL comes back
3. The URL loads an ngrok warning page
4. The public URL returns 502
5. The unauthenticated API call returns 200
6. The teammate reaches the login but has no account
7. Chat replies never stream in
8. The link stopped working overnight
9. General rule

## 1. The tunnel starts and immediately dies

**Symptom:** The agent exits within a second. `/tmp/ngrok-openwebui.log` contains `ERR_NGROK_4018`.

**Cause:** No authtoken. ngrok is installed but the account is not linked.

**Fix:**

```bash
ngrok config add-authtoken <token>   # from dashboard.ngrok.com/get-started/your-authtoken
```

The user must fetch their own token from a free account. Do not proceed without it.

## 2. No public URL comes back

**Symptom:** The poll loop finishes with an empty URL.

**Check, in this order:**

```bash
pgrep -fl ngrok                                  # is the agent even alive?
grep -oE 'ERR_NGROK_[0-9]+' /tmp/ngrok-openwebui.log | head
curl -s --max-time 3 http://localhost:4040/api/tunnels | head -c 200
```

| Finding | Cause | Fix |
|---------|-------|-----|
| `ERR_NGROK_108` | An agent is already running and the plan allows one | `pkill -f "ngrok http"`, then start again |
| `ERR_NGROK_4018` | No authtoken | Section 1 |
| Nothing on 4040 | Another process took the inspector port | Add `--inspect=false` and read the URL from the log instead |
| Agent alive, API empty | Still connecting | Wait the full 20 seconds before calling it failed |

## 3. The URL loads an ngrok warning page

**Symptom:** The teammate sees "You are about to visit..." with a Visit Site button.

**Cause:** Expected behaviour on free `*.ngrok-free.app` domains for browser requests. Not a fault.

**Fix:** Tell them to click Visit Site once. Mention it at handover, because an unexplained warning page reads like a scam and people stop there.

## 4. The public URL returns 502

**Symptom:** The tunnel is up and the URL resolves, but every request gives 502.

**Cause:** ngrok is forwarding to a port where Open WebUI is not.

**Check:**

```bash
curl -s --max-time 5 "http://localhost:$PORT/health"                   # is it there locally?
curl -s http://localhost:4040/api/tunnels | grep -o '"addr":"[^"]*"'   # where is ngrok pointed?
```

**Fix:** Stop the agent, re-run the preflight in `tunnel-steps.md` to find the real port, start again with it.

## 5. The unauthenticated API call returns 200

**Symptom:** `$URL/api/models` answers with data and no login.

**This is the serious one.** The instance is open to anyone who has the address. Close it before doing anything else:

```bash
pkill -f "ngrok http"
```

**Cause:** Open WebUI is running without enforced auth, usually `WEBUI_AUTH=False` set in the environment that launched it, sometimes a reverse proxy in front that strips or forges the identity header.

**Check what it was actually started with:**

```bash
ps eww $(pgrep -f 'open.?webui' | head -1) | tr ' ' '\n' | grep -E 'WEBUI_AUTH|AUTH|TRUSTED' || echo "no auth vars in env"
curl -s "http://localhost:$PORT/api/config" | python3 -c "import sys,json;print(json.load(sys.stdin).get('features'))"
```

**Fix:** Restart Open WebUI without `WEBUI_AUTH=False`, create the admin account, then re-run the whole safety gate from the top. Do not reopen the tunnel on the strength of a config field alone: re-run the live 401 check.

## 6. The teammate reaches the login but has no account

**Symptom:** The URL works, they see the Open WebUI sign in page, and nothing they try gets them in.

**Cause:** Not a fault. They have no account on this instance, and signup is off, which is the intended configuration.

**Fix:** The user creates it in Settings, Admin Panel, Users, then sends the credentials separately from the URL. Do not turn on open signup as a shortcut while the tunnel is live, because with no second lock the link then becomes the only thing anyone needs.

## 7. Chat replies never stream in

**Symptom:** Login works, the model list loads, but sending a message hangs with no text appearing.

**Cause:** Websockets are not completing. Usually Open WebUI does not know its public origin.

**Fix:** Restart Open WebUI with the public URL declared, then restart the tunnel:

```bash
WEBUI_URL="$URL" nohup open-webui serve --port "$PORT" > /tmp/open-webui.log 2>&1 &
```

This restarts their server, so ask first. If it persists, have them reload the page once, since a stale tab holds the old socket.

## 8. The link stopped working overnight

**Symptom:** It worked, now the teammate gets an error.

**Cause, in likelihood order:** the machine slept, the agent was stopped, the network changed, or the tunnel was restarted and the free URL rotated.

**Fix:** Start it again from section 3 of `tunnel-steps.md` and send the new URL. To stop this recurring, either reserve the free static domain and pass `--url`, or accept that the link is per session. Say which one applies rather than promising stability the free plan does not give.

## 9. General rule

If the lock check in section 4 of `tunnel-steps.md` fails, close the tunnel before investigating. Diagnosing an exposure while it is still open is the wrong order, and it costs nothing to reopen once the fix is in.
