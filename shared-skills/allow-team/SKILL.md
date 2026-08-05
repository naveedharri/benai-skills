---
name: allow-team
description: Puts a running Open WebUI on a shareable public URL through an ngrok tunnel, so a teammate can sign in and use the local models without installing anything. Use when the user says "share Open WebUI with my team", "let my colleague use my local AI", "expose Open WebUI", "share localhost:8080", "give someone access to my models", "set up an ngrok tunnel", "make my local AI reachable from another machine", or asks how to let someone else try their setup. Checks Open WebUI's own login is on and enforced before it opens anything, installs ngrok if missing, then proves the URL works from outside. Requires Claude Code with shell access on the user's own machine; refuses to run in a sandbox.
---

# Allow Team

Takes a local Open WebUI and makes it reachable by other people, without asking them to install anything. The tunnel is the easy part. Confirming the login is actually enforced before the URL exists is the job.

## Before you start

Run the check in `references/environment-check.md` first. This skill needs a shell on the user's own machine, because the thing being shared is running on it. If the environment is a sandbox or container, stop and tell the user to run this in Claude Code on the computer hosting Open WebUI.

## What this skill is doing

It puts a door on the public internet that leads into the user's laptop. Open WebUI's own login is the lock on that door, and it is the only lock. That is the right design, because a second password in front of it just confuses the teammate about which credential to use. It also means the safety gate is not optional: if the login is off, misconfigured, or bypassable, there is nothing else standing between a stranger and the user's chat history.

Gate first. Tunnel second.

## Steps

Track progress:

```
Task Progress:
- [ ] 1. Confirm Open WebUI is running
- [ ] 2. Run the safety gate
- [ ] 3. Get ngrok ready
- [ ] 4. Get consent, with the exposure spelled out
- [ ] 5. Open the tunnel
- [ ] 6. Prove the lock holds from outside
- [ ] 7. Render the handover report
```

### 1. Confirm Open WebUI is running
Run the preflight block in `references/tunnel-steps.md`. Establish the port it is on and that `/health` answers. Do not assume 8080; read it from what is actually listening.

If nothing is running, stop and offer `/install-openwebui` instead. Do not install Open WebUI from inside this skill.

### 2. Run the safety gate
Go to `references/safety-gate.md` and run it in full. It reads Open WebUI's real auth settings and decides whether this instance is safe to expose.

This gate can refuse. If it refuses, say why in one sentence, fix the cause, then re-run it. Do not tunnel past a refusal. With no second password in front, the gate is the whole of the protection.

### 3. Get ngrok ready
Install it only if `command -v ngrok` finds nothing. Then check the authtoken, which is the step people miss: ngrok is installed but unauthenticated, and the failure appears as a tunnel that dies on start. `references/tunnel-steps.md` section 2 covers both.

Getting an authtoken needs a free ngrok account. The user has to create it themselves and paste the token. There is no way around that, so ask early rather than at the end.

### 4. Get consent, with the exposure spelled out
Before starting the tunnel, tell the user in one message:

- what becomes reachable from the public internet: their Open WebUI sign in page, and behind it their models, chat history, and any documents loaded into that instance
- that the login is what keeps people out, so anyone with an account on this instance can get in from anywhere
- that it stays open until they stop it or the machine sleeps
- who they intend to share it with

Then stop and wait for a yes. This is not a formality. A tunnel is the one step in this plugin that is visible to strangers.

### 5. Open the tunnel
Follow `references/tunnel-steps.md` section 3. Start the agent detached, then read the public URL from the local ngrok API rather than scraping the log.

### 6. Prove the lock holds from outside
An agent that says "started" is not proof, and neither is the page loading. The teammate's browser is not the only thing that will find this URL. Section 4 of `references/tunnel-steps.md` has the two-request check: the sign in page must load with `200`, and an API call with no session must come back `401`. A `200` on the second request means the instance is open and you close the tunnel immediately.

Report both real codes. If either is wrong, go to `references/troubleshooting.md` before improvising.

### 7. Render the handover report
Deliver the handover as a rendered HTML page, not as chat text. Build it from `references/report-template.md` using the allow-team layout in section 4. It must carry the URL, the two verification codes, how the teammate signs in, the exact command to stop the tunnel, and the fact that the URL changes on restart.

## Human checkpoints
- **Before opening the tunnel** (step 4): state what becomes reachable, then wait for explicit approval.
- **Before turning on Open WebUI signup** so a teammate can register: ask, and expect to talk them out of it. Open signup plus a public URL means anyone with the link creates their own account, and with no second lock the link is the only thing they need. Creating the account for them takes a minute and closes the hole.
- **Before changing any existing Open WebUI auth setting**: show the current value and the proposed value, then ask.

Never run `kill` on a process the user did not ask you to stop. The one exception is a tunnel this skill started in this session, and only when the user asks to stop sharing or when the step 6 check fails.

## How the teammate gets in
They need an account on the user's Open WebUI. The clean route is the user creating it for them in Settings, Admin Panel, Users, then sending the URL and those credentials separately. Say this at handover, because a teammate who opens the URL and finds a login screen with no account will assume the link is broken.

## When to close it
Say this at handover, and mean it: a tunnel is for a session, not a deployment. If the user wants a permanent shared instance, this is the wrong tool and they should host it properly. Tell them that rather than leaving an ngrok agent running for weeks.

## Self-improvement

This skill is never finished. Improve it as you use it.

- Results are delivered as HTML pages. When the layout in `references/report-template.md` proves unclear for a real result, fix the layout there rather than working around it in chat.
- ngrok changes its CLI surface between versions. When a command or flag fails, verify the replacement and fix `references/tunnel-steps.md` immediately, with the version you verified it on.
- When a new failure mode appears, add it to `references/troubleshooting.md` with its exact symptom and fix.
- When the safety gate lets through something it should have caught, add that case to `references/safety-gate.md`. A gate that missed once will miss again, and it is the only gate here.
- Keep this small: when you add something, cut anything that no longer changes behaviour.

## Routing
| Step | Reference |
|------|-----------|
| before all steps | `references/environment-check.md` |
| 2 | `references/safety-gate.md` |
| 1, 3, 5, 6 | `references/tunnel-steps.md` |
| any failure | `references/troubleshooting.md` |
| 7 | `references/report-template.md` |
