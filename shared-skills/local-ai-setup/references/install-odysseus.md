# Install Odysseus

The other browser harness, chosen at step 3b. Run in order. Every command here was verified on macOS Apple Silicon with commit `20e7fc0` on 5 August 2026.

## Contents
1. Preflight
2. Get consent, with sizes
3. Clone and start
4. Which port, and why not 7000
5. First login
6. Point it at a model
7. Prove it works
8. Stopping and restarting
9. Why not Docker

## 1. Preflight

Never install over a working install.

```bash
# already running?
curl -s -o /dev/null -w "7860: %{http_code}\n" --max-time 3 http://127.0.0.1:7860/

# already cloned? check the usual places before picking a new one
for d in ~/odysseus ~/Documents/odysseus "$PWD/odysseus"; do
  [ -d "$d/.git" ] && echo "found: $d"
done

command -v git brew python3 2>/dev/null
```

A `302` on 7860 means it is already up and redirecting to its login page. That is a working install: skip to step 5.

## 2. Get consent, with sizes

Say this before running anything: the clone is small, but `start-macos.sh` installs Homebrew packages, `python@3.11`, a virtualenv and the Python requirements on first run. Budget roughly 1 to 2 GB and several minutes. Models are extra and are pulled later.

Then stop and wait for a yes.

## 3. Clone and start

```bash
git clone https://github.com/odysseus-dev/odysseus.git
cd odysseus
cp .env.example .env
./start-macos.sh
```

`dev` is the default branch and moves fastest. Use `main` for the curated one: `git clone -b main …`. Say which one you used.

`start-macos.sh` is idempotent and safe to re-run. It installs what is missing, creates `venv/`, runs `setup.py` for first-run data dirs and the initial admin password, then starts uvicorn in the foreground.

**It runs in the foreground and Ctrl+C stops it.** For an unattended setup, start it detached and tell the user the log path:

```bash
nohup ./start-macos.sh > /tmp/odysseus.log 2>&1 &
```

Wait for it, then confirm:

```bash
for i in $(seq 1 30); do
  curl -s -o /dev/null --max-time 2 http://127.0.0.1:7860/ && break; sleep 3
done
curl -s -o /dev/null -w "odysseus: %{http_code}\n" http://127.0.0.1:7860/   # expect 302
```

## 4. Which port, and why not 7000

The README says 7000. On macOS that is wrong and the failure is confusing.

| Port | Service | Note |
|------|---------|------|
| 7860 | Odysseus | The real one on macOS |
| 7000 | **AirPlay Receiver** | macOS holds it. Do not fight it. |
| 8100 | ChromaDB | Started by the script |
| 11435 | Apfel | Started by the script |
| 11434 | Ollama | Separate, must be running for Ollama models |

The script resolves the port as `ODYSSEUS_PORT` → `APP_PORT` in `.env` → `7860`. Host is `ODYSSEUS_HOST` → `APP_BIND` → `127.0.0.1`, so it is loopback-only by default. Leave it that way and use `allow-team` to share it.

If 7860 is taken, set `APP_PORT` in `.env` rather than editing the script.

## 5. First login

Odysseus has a real login: `/` returns `302` to `/login`, and every API route returns `401` without a session.

The initial admin password is printed by `setup.py` on first run. On a detached start it is in the log:

```bash
grep -iE "password|admin" /tmp/odysseus.log | head
```

Have the user open `http://127.0.0.1:7860`, sign in, and change that password before anything else. Do not skip this if the tunnel is coming next.

## 6. Point it at a model

Two routes, and the user should know both exist:

- **Ollama** — start it (`brew services start ollama`) and register `http://localhost:11434` as a local endpoint in Odysseus. This is the route to take when Ollama is already set up from the rest of this plugin.
- **Cookbook** — Odysseus's own hardware-aware model recommendation, download and serving. Unlike Open WebUI, Odysseus can serve models itself, so a user with no Ollama is not stuck.

Prefer Ollama when it is already installed. Do not install a second copy of a model that is already pulled.

## 7. Prove it works

An HTTP 302 is not proof. Sign in, send one real prompt through a model, and show the reply. If Ollama is the backend, confirm it is actually up first:

```bash
curl -s --max-time 5 http://localhost:11434/api/tags >/dev/null && echo "ollama up" || echo "ollama DOWN"
```

A stopped Ollama is the most likely reason a registered endpoint fails, and the error inside Odysseus does not say so plainly.

## 8. Stopping and restarting

```bash
# foreground: Ctrl+C in that terminal

# detached
pkill -f "uvicorn app:app"

# restart
cd <repo> && nohup ./start-macos.sh > /tmp/odysseus.log 2>&1 &
```

The script's exit trap also stops the ChromaDB and Apfel helpers it started, so stopping Odysseus cleanly takes those down with it.

## 9. Why not Docker

The README leads with `docker compose up`. On Apple Silicon that is the wrong choice and the script says so in its own header: Docker on macOS is a Linux VM with no access to the Metal GPU, so models run on CPU and the machine looks far slower than it is.

Install natively on any Mac. Docker is reasonable on Linux with an NVIDIA or AMD GPU, where `docker-compose.gpu-nvidia.yml` and `docker-compose.gpu-amd.yml` apply.
