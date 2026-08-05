# Tunnel Steps

Run in order. Every command here was verified on macOS with ngrok 3.38.0 and Open WebUI 0.11.0 on 5 August 2026.

## Contents
1. Preflight
2. Get ngrok ready
3. Open the tunnel
4. Prove the lock holds from outside
5. Stopping and restarting
6. What the free plan gives you

## 1. Preflight

This skill tunnels either browser harness: **Open WebUI** or **Odysseus**. Detect which is running rather than assuming a port.

```bash
HARNESS=""; PORT=""

# Open WebUI: /health returns {"status":true}
for p in 8080 3000 8081; do
  curl -s --max-time 3 "http://localhost:$p/health" 2>/dev/null | grep -q '"status":true' \
    && { HARNESS="Open WebUI"; PORT=$p; break; }
done

# Odysseus: / redirects to /login, and /api/version answers
if [ -z "$PORT" ]; then
  for p in 7860 7000; do
    curl -s --max-time 3 "http://127.0.0.1:$p/api/version" 2>/dev/null | grep -q '"version"' \
      && { HARNESS="Odysseus"; PORT=$p; break; }
  done
fi

echo "harness: ${HARNESS:-NONE FOUND}  port: ${PORT:-none}"
command -v ngrok || echo "ngrok MISSING"
pgrep -fl ngrok || echo "no ngrok agent running"
```

If nothing is found, neither harness is serving. Stop and route the user to `/install-openwebui`, or to `/local-ai-setup` if they have not chosen one yet. Do not install anything from here.

If **both** are running, ask which one to share. Do not guess and do not open two tunnels.

Everything below uses `$PORT` and `$HARNESS`. Set them once and reuse them.

## 2. Get ngrok ready

Install only when it is missing.

```bash
# macOS
brew install ngrok

# Linux
curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc \
  | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null \
  && echo "deb https://ngrok-agent.s3.amazonaws.com buster main" \
  | sudo tee /etc/apt/sources.list.d/ngrok.list \
  && sudo apt update && sudo apt install ngrok
```

On macOS `ngrok` is a cask, so `brew install ngrok` is correct and `brew install --cask ngrok` also works. Download is around 30 MB.

Then check the authtoken. This is the step people miss.

```bash
CFG=$(ngrok config check 2>/dev/null | sed -n 's/.*Valid configuration file at //p')
if [ -n "$CFG" ] && grep -q authtoken "$CFG"; then echo "authtoken: set"; else echo "authtoken: MISSING"; fi
```

If missing, the user has to fetch their own. Ask them to open
`https://dashboard.ngrok.com/get-started/your-authtoken`, sign up free if needed, and paste the token. Then:

```bash
ngrok config add-authtoken <token>
```

Never invent a token and never share one between users. Without it the agent starts and immediately dies with `ERR_NGROK_4018`.

## 3. Open the tunnel

Only run this after the safety gate has passed. Open WebUI's own login is the only thing protecting what comes next.

```bash
nohup ngrok http "$PORT" --log stdout --log-format json > /tmp/ngrok-openwebui.log 2>&1 &
```

Read the public URL from the API, not the log:

```bash
URL=""
for i in $(seq 1 20); do
  URL=$(curl -s --max-time 2 http://localhost:4040/api/tunnels 2>/dev/null \
    | python3 -c "import sys,json;d=json.load(sys.stdin);print(next((t['public_url'] for t in d.get('tunnels',[]) if t['public_url'].startswith('https')),''))" 2>/dev/null)
  [ -n "$URL" ] && break
  sleep 1
done
echo "public url: ${URL:-FAILED}"
```

If it is empty after 20 seconds, read `/tmp/ngrok-openwebui.log` for an `ERR_NGROK_` code and go to `troubleshooting.md`.

Note for later: ngrok 3.38 removed the old `--basic-auth` and `--oauth` flags. If a future version of this skill ever needs a second lock, it is a `basic-auth` action in a `--traffic-policy-file`, which does work on the free plan. It is deliberately not used here, because two passwords confuse the person you are sharing with.

## 4. Prove the lock holds from outside

Two requests. Both must match, or the instance is open to whoever finds the URL.

```bash
echo "front page:        $(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "$URL/")"
echo "api, no session:   $(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "$URL/api/models")"
```

| Request | Required | A different code means |
|---------|----------|------------------------|
| `/` | `200` on Open WebUI, `302` to `/login` on Odysseus | `502` means the tunnel is up but pointed at the wrong port. |
| `/api/models` | `401` | **`200` means the instance is open.** Stop the tunnel immediately with `pkill -f "ngrok http"`, then go to `safety-gate.md`. |

`/api/models` returns `401` on both harnesses when the login is enforced, so this check does not need to change with `$HARNESS`. The front page differs only because Odysseus redirects and Open WebUI serves its app shell.

These requests leave the machine and come back through ngrok's edge, so a passing result proves the whole path, not just the local process.

Report both real codes. Never summarise this as "secured" without them.

## 5. Stopping and restarting

Give the user all of it, so they are never stuck with something open they cannot close.

```bash
# stop sharing
pkill -f "ngrok http"

# confirm it is closed
pgrep -fl ngrok || echo "tunnel closed"
```

Restarting means running section 3 again. On the free plan the URL will be different, and the old link stops working. Say this at handover rather than letting a teammate discover it.

## 6. What the free plan gives you

| Thing | Free plan reality |
|-------|-------------------|
| URL | Random `*.ngrok-free.app`, new one on every restart |
| Static domain | One per account, usable with `--url https://<name>.ngrok-free.app` |
| Browser interstitial | First visit in a browser shows an ngrok warning page with a "Visit Site" button. Expected, not a fault. Tell the teammate to expect it. |
| Uptime | Dies when the agent stops, the machine sleeps, or the network changes |

If the user already reserved a static domain, add `--url https://<name>.ngrok-free.app` to the command in section 3 and the link survives restarts.
