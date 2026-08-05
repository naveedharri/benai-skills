---
name: install-openwebui
description: Installs and wires up Open WebUI end to end, so a non-technical user gets a working local AI chat in the browser instead of setup instructions. Use when the user says "install Open WebUI", "set up Open WebUI", "get Open WebUI running", "connect Open WebUI to Ollama", "Open WebUI shows no models", "localhost:8080 refused to connect", "does not support tools", or asks for help finishing a local AI setup. Installs Ollama if missing, pulls a model that fits, starts the server, connects them, and proves it works with a real reply. Requires Claude Code with shell access on the user's own machine; refuses to run in a sandbox.
---

# Install Open WebUI

Turns the most technical local AI option into the easiest one. Ends with a working chat in the browser, not a list of commands.

## Before you start

Run the check in `references/environment-check.md` first. These skills need a shell on the user's own machine. If the environment is a sandbox or container, stop and tell the user to run this in Claude Code on the computer they want to set up. Do not report detected specs from a sandbox: wrong specs are worse than none.

## Steps

Track progress:

```
Task Progress:
- [ ] 1. Check what is already there
- [ ] 2. Get consent, with sizes
- [ ] 3. Install and start
- [ ] 4. Wire the connection
- [ ] 5. Prove it works
- [ ] 6. Render the handover report
```

### 1. Check what is already there
Run the preflight block in `references/install-steps.md`. Establish: is Ollama installed and running, which models are pulled, is Open WebUI installed, is anything already on port 8080. Never install something that is already present.

If the user already ran `/scan-my-machine`, reuse that result instead of re-detecting.

### 2. Get consent, with sizes
Before installing or downloading anything, tell the user in one message: what will be installed, the download size in gigabytes, and roughly how long it will take. Then stop and wait for a yes.

Never skip this. A silent multi-gigabyte download is the single worst failure mode for this skill.

### 3. Install and start
Follow `references/install-steps.md` in order: Ollama, then a model chosen for their hardware, then Open WebUI, then start the server. Run the server detached so it survives the session. Report the log path.

### 4. Wire the connection
Set the Ollama connection to `http://localhost:11434`. Read the "Which URL goes where" section of `references/install-steps.md` before touching any connection setting, because the two ports are easy to swap and the failure is silent.

### 5. Prove it works
Send one real prompt through the stack and show the reply. Do not report success on an HTTP 200 alone. Then give the user the URL and stop.

If anything fails at any step, go to `references/troubleshooting.md` before improvising. It covers the four failures that account for nearly every broken setup.

### 6. Render the handover report
Deliver the handover as a rendered HTML page, not as chat text. Build it from `references/report-template.md` using the setup layout in section 4. Include the real prompt sent and the real reply received, how to restart the server, and the log path. Save it to the Desktop and open it.

## Human checkpoints
- **Before any install or download** (step 2): state what and how many gigabytes, then wait for explicit approval.
- **Before pulling a second model**: ask, do not assume.
- **Before changing an existing connection** the user already configured: show the current value and the proposed value, then ask.

Never run `kill` on a process the user did not ask you to stop.

## Self-improvement

This skill is never finished. Improve it as you use it.

- Results are delivered as HTML pages. When the layout in `references/report-template.md` proves unclear for a real result, fix the layout there rather than working around it in chat.
- When an install command fails or has changed, fix it in `references/install-steps.md` immediately.
- When a new failure mode appears, add it to `references/troubleshooting.md` with its exact symptom and fix.
- When the user corrects a step, update the reference file so the correction sticks rather than fixing it only for this run.
- Keep this small: when you add something, cut anything that no longer changes behaviour.

## Routing
| Step | Reference |
|------|-----------|
| before all steps | `references/environment-check.md` |
| 1, 3, 4 | `references/install-steps.md` |
| any failure | `references/troubleshooting.md` |
| 6 | `references/report-template.md` |
