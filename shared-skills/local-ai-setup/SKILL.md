---
name: local-ai-setup
description: The one command that takes someone from nothing to a working local AI setup: scans their machine, asks what they want it for, recommends a model and an app, asks Open WebUI or Odysseus when the pick is browser-based, then installs it with their approval. Use when the user says "set up local AI", "help me run AI on my own computer", "I want to run AI locally", "get me started with local LLMs", "run AI offline", "private AI on my machine", "local AI setup", or asks how to start with local AI without naming a specific tool. Then offers to point Claude Code itself at the installed model, so also use it for "run Claude Code on a local model", "point Claude Code at Ollama" and "use Claude Code offline". Non-technical entry point. Never installs anything before showing download sizes and getting a yes. Requires Claude Code with shell access on the user's own machine; refuses to run in a sandbox.
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
- [ ] 3b. Offer the browser choice, if one applies
- [ ] 4. Confirm
- [ ] 5. Install
- [ ] 6. Prove it and hand over
- [ ] 6b. Offer Claude Code on the local model, if it applies
- [ ] 7. Render the handover report
```

### 1. Scan
Invoke `scan-my-machine`. Report what the machine can run in plain language. Nothing is installed at this step, so say that.

### 2. Ask what it is for
Invoke `pick-my-harness` to ask its four questions. If the user already said what they want in their opening message, pass that through rather than re-asking.

### 3. Recommend, with sizes
Combine both results into one recommendation: one model, one app, the total download in gigabytes, and roughly how long it will take. One option, not a menu. Say in one line what this setup will not do, so the limit is known before they commit.

### 3b. Offer the browser choice, if one applies
Only when step 3 landed on a browser-based harness, meaning Open WebUI or Odysseus. Skip this entirely for LM Studio, Goose, AnythingLLM and OpenWork: those are not interchangeable with anything and a question there is noise.

The two are genuinely close. Both run in a browser, both have a real login, both sit on Ollama, and `allow-team` tunnels either one. So ask rather than decide, using an AskUserQuestion with two options:

- **Open WebUI (Recommended)** — the default. More mature, richer group permissions, the largest community.
- **Odysseus** — more in the box: Deep Research, blind model Compare, a Documents editor and an email inbox. AGPL-3.0.

Default to Open WebUI. If the user does not care or does not answer, take Open WebUI and say so rather than asking twice.

Name the one real trade-off in a line each: Open WebUI's branding clause applies above 50 users, and Odysseus is AGPL, so modifying it and serving it over a network obliges you to publish your changes. Do not turn this into a licence lecture.

### 4. Confirm
Stop. Wait for an explicit yes. Nothing has been installed or downloaded up to this point, and the user should be told that plainly.

If they say no, offer the smaller option (a lighter model, or LM Studio alone) and re-confirm.

### 5. Install
Check first, install second. If the chosen app is already present and serving, do not reinstall it; say it is already there and move to step 6. `references/install-odysseus.md` section 1 and `install-openwebui`'s preflight both do this check.

Route by the chosen app:

| App | Do this |
|-----|---------|
| Open WebUI | Invoke `install-openwebui` |
| Odysseus | Read `references/install-odysseus.md` |
| LM Studio | Read `references/install-other.md` |
| Goose | Read `references/install-other.md` |
| AnythingLLM | Read `references/install-other.md` |
| OpenWork | Read `references/install-other.md` |

### 6. Prove it and hand over
Send one real prompt through the finished setup and show the reply. An HTTP 200 is not proof.

Then give the user: the URL or app to open, how to restart it later, and the one thing most likely to confuse them next, from `references/handover.md`. Stop there. Do not keep configuring.

### 6b. Offer Claude Code on the local model, if it applies
The chat window is the deliverable and it is finished. This is a separate offer on top of it, so make it an offer and not a step the user is walked through by default.

Two conditions, both required. The backend is **Ollama**, on its own or under Open WebUI or Odysseus, because Ollama serves the Anthropic Messages API and the others do not. And the installed model is **roughly 7B or larger**, because Claude Code is a tool calling agent and a smaller model returns confident fabrications instead of tool calls. If either fails, skip this silently rather than explaining what the user cannot have.

When both hold, ask in one line whether they also want Claude Code running on this model, saying plainly that it is slower and less capable than the hosted one and the win is privacy, offline work and no per token cost. On a yes, read `references/claude-code-wiring.md` and follow it.

**What the user gets is a three line block they paste in order, ending in `ollama launch claude --model <their model>`, not a wall of environment variables.** Ollama configures and starts Claude Code itself, and it does not touch the user's `~/.claude/settings.json`, which means there is almost nothing to undo. The manual export block is in section 5 of that file as a fallback, not the default.

Read that file before touching anything, because `launch` on its own does not cover the one gate that decides the outcome. Ollama sizes its default context from available memory, so a machine under 24 GB gets 4,096 tokens, Claude Code's prompt is far larger, and **Ollama truncates instead of refusing**. Both launch paths then return fluent invented answers with exit code 0 and no error anywhere. That is why the server line carrying `OLLAMA_CONTEXT_LENGTH` and `OLLAMA_NUM_PARALLEL=1` is part of the block the user keeps, not a one time fix, and why a 200 from the endpoint is not proof.

Prove the whole block, in order, as section 7 specifies: the headless launch must return the sentinel and the server log must show zero `truncating input prompt` lines at the `n_ctx` that was asked for. Both signals or it is not a pass. Then hand over the block itself, and the way back to the hosted model.

If the machine is too small for a useful local model, do not ship a disappointment. Section 4 carries the cloud option, `ollama launch claude --model qwen3.5:cloud`, along with the line the user needs to hear: that route is no longer local or private.

### 7. Render the handover report
Deliver the final handover as a rendered HTML page, not as chat text. Build it from `references/report-template.md` using the setup layout in section 4. Roll up the scan result, the chosen app, the real prompt and reply, the restart command, and the pre-empted confusions from `references/handover.md`. Save it to the Desktop and open it.

If step 6b ran and passed, add its card to the page, as specified in the setup layout. Do not add the card on the strength of the command being correct: it goes on the page only after the headless launch returned the sentinel and the server log showed zero truncation.

## Human checkpoints
- **Step 4 is mandatory.** Never install or download before an explicit yes, and always show gigabytes first.
- **Before pulling a second model**, ask.
- **Before changing a connection the user already set up**, show current and proposed values and ask.
- **Step 6b is an offer, never an assumption.** Restarting `ollama serve` to apply the context variables interrupts anything already using it, including a chat window this skill just set up, so say that and get a yes first. `ollama launch claude` needs no config file, so do not volunteer one: never write `~/.claude/settings.json` or a shell profile without asking, because either one makes the local model the default for work the user expects the hosted Claude to do.
- Never stop or kill a process the user did not ask you to stop.

## Self-improvement

This skill is never finished. Improve it as you use it.

- Results are delivered as HTML pages. When the layout in `references/report-template.md` proves unclear for a real result, fix the layout there rather than working around it in chat.
- When a step confuses a user, fix the wording in the reference file rather than explaining it again in chat.
- When an install path changes for any app, update `references/install-other.md`, or `references/install-odysseus.md` for Odysseus.
- When one of the two browser harnesses gains or loses something that would change the step 3b choice, fix the two option descriptions there and in `pick-my-harness`'s matrix, so both skills say the same thing.
- When a local backend other than Ollama starts serving `/v1/messages`, when `ollama launch` changes its flags or starts handling the context itself, or when a Claude Code variable in the manual block changes, fix `references/claude-code-wiring.md` sections 1, 2, 3 and 5 and record the Ollama version it was verified against. Never widen that table on a release note alone: run the curl and the headless launch test first, and check the log for truncation.
- When a new "next confusion" appears after handover, add it to `references/handover.md`.
- When a run went genuinely well, save the transcript shape to `references/examples/` as a model.
- Keep this small: when you add something, cut anything that no longer changes behaviour.

## Routing
| Step | Reference |
|------|-----------|
| before all steps | `references/environment-check.md` |
| 1 | skill `scan-my-machine` |
| 2 | skill `pick-my-harness` |
| 3b | this file, browser choice |
| 5, Open WebUI | skill `install-openwebui` |
| 5, Odysseus | `references/install-odysseus.md` |
| 5, other apps | `references/install-other.md` |
| 6 | `references/handover.md` |
| 6b | `references/claude-code-wiring.md` |
| 7 | `references/report-template.md` |
