---
name: local-ai-setup
description: The one command that takes someone from nothing to a working local AI setup: scans their machine, asks what they want it for, recommends a model and an app, then installs it with their approval. Use when the user says "set up local AI", "help me run AI on my own computer", "I want to run AI locally", "get me started with local LLMs", "run AI offline", "private AI on my machine", "local AI setup", or asks how to start with local AI without naming a specific tool. Non-technical entry point. Never installs anything before showing download sizes and getting a yes. Requires Claude Code with shell access on the user's own machine; refuses to run in a sandbox.
---

# Local AI Setup

The front door. Takes someone with no local AI setup to a working one, in one pass, without making them choose between tools they cannot evaluate yet.

Do not make the user pick a sub-skill. Run the flow.

## Before you start

Run the check in `references/environment-check.md` first. These skills need a shell on the user's own machine. If the environment is a sandbox or container, stop and tell the user to run this in Claude Code on the computer they want to set up. Do not report detected specs from a sandbox: wrong specs are worse than none.

## Steps

Track progress:

```
Task Progress:
- [ ] 1. Scan
- [ ] 2. Ask what it is for
- [ ] 3. Recommend, with sizes
- [ ] 4. Confirm
- [ ] 5. Install
- [ ] 6. Prove it and hand over
- [ ] 7. Render the handover report
```

### 1. Scan
Invoke `scan-my-machine`. Report what the machine can run in plain language. Nothing is installed at this step, so say that.

### 2. Ask what it is for
Invoke `pick-my-harness` to ask its four questions. If the user already said what they want in their opening message, pass that through rather than re-asking.

### 3. Recommend, with sizes
Combine both results into one recommendation: one model, one app, the total download in gigabytes, and roughly how long it will take. One option, not a menu. Say in one line what this setup will not do, so the limit is known before they commit.

### 4. Confirm
Stop. Wait for an explicit yes. Nothing has been installed or downloaded up to this point, and the user should be told that plainly.

If they say no, offer the smaller option (a lighter model, or LM Studio alone) and re-confirm.

### 5. Install
Route by the chosen app:

| App | Do this |
|-----|---------|
| Open WebUI | Invoke `install-openwebui` |
| LM Studio | Read `references/install-other.md` |
| Goose | Read `references/install-other.md` |
| AnythingLLM | Read `references/install-other.md` |
| OpenWork | Read `references/install-other.md` |

### 6. Prove it and hand over
Send one real prompt through the finished setup and show the reply. An HTTP 200 is not proof.

Then give the user: the URL or app to open, how to restart it later, and the one thing most likely to confuse them next, from `references/handover.md`. Stop there. Do not keep configuring.

### 7. Render the handover report
Deliver the final handover as a rendered HTML page, not as chat text. Build it from `references/report-template.md` using the setup layout in section 4. Roll up the scan result, the chosen app, the real prompt and reply, the restart command, and the pre-empted confusions from `references/handover.md`. Save it to the Desktop and open it.

## Human checkpoints
- **Step 4 is mandatory.** Never install or download before an explicit yes, and always show gigabytes first.
- **Before pulling a second model**, ask.
- **Before changing a connection the user already set up**, show current and proposed values and ask.
- Never stop or kill a process the user did not ask you to stop.

## Self-improvement

This skill is never finished. Improve it as you use it.

- Results are delivered as HTML pages. When the layout in `references/report-template.md` proves unclear for a real result, fix the layout there rather than working around it in chat.
- When a step confuses a user, fix the wording in the reference file rather than explaining it again in chat.
- When an install path changes for any app, update `references/install-other.md`.
- When a new "next confusion" appears after handover, add it to `references/handover.md`.
- When a run went genuinely well, save the transcript shape to `references/examples/` as a model.
- Keep this small: when you add something, cut anything that no longer changes behaviour.

## Routing
| Step | Reference |
|------|-----------|
| before all steps | `references/environment-check.md` |
| 1 | skill `scan-my-machine` |
| 2 | skill `pick-my-harness` |
| 5, Open WebUI | skill `install-openwebui` |
| 5, other apps | `references/install-other.md` |
| 6 | `references/handover.md` |
| 7 | `references/report-template.md` |
