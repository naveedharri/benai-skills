# Handover

What to tell the user at step 6, then stop. Do not keep configuring after this.

## Contents
1. The three things to give them
2. Pre-empt the next confusion
3. What not to say

## 1. The three things to give them

Exactly these, in this order, short:

1. **Where it is.** The URL (`http://localhost:8080` for Open WebUI) or the app to open.
2. **How to restart it.** The one command or action. Local servers do not survive a reboot unless installed as a service, so they will need this.
3. **What it cannot do.** One line naming the ceiling, so they do not conclude it is broken when they hit it.

## 2. Pre-empt the next confusion

Pick the one or two that apply and state them before the user hits them. Each of these was a real point of confusion on a real setup.

| If they have… | Tell them |
|---------------|-----------|
| A small model (under ~4B) | It will be fast but will not follow complex instructions well. That is the model, not the setup. |
| Any model under ~1B | It cannot use tools or MCP at all, and has a very short memory of the conversation. |
| Ollama plus a separate app | The app is a front end. If Ollama stops, the app shows no models even though nothing is misconfigured. |
| LM Studio as the backend | Its server must be started in the Developer tab each time, or the connection will refuse. |
| Open WebUI | It is a web app, so it needs the server running. A refused connection means the server stopped, not that it broke. |
| Any local setup at all | Memory is shared. A long conversation or a big pasted document can exhaust it and cause a crash on a model that worked fine before. Start a new chat to clear it. |
| Claude Code wired to the local model, from step 6b | The model name in the status line is how they tell which one they are talking to. If it reads the Ollama tag, the session is local. Give them the way back to the hosted model in the same breath, from `claude-code-wiring.md` section 7. |
| Claude Code wired to the local model, and Ollama restarted since | The context variables are read at startup, so a server restarted without them puts the session back to a 4,096 token window. It will not error. It will answer confidently and wrongly. Restart it with the variables set. |

## 3. What not to say

- Do not list commands they did not need. They asked for a working setup, not a tutorial.
- Do not explain quantization, VRAM maths, or MoE architecture unless asked. The scan already handled sizing.
- Do not suggest a second model, a second app, or an upgrade path unprompted.
- Do not claim it works without having sent a real prompt and seen a real reply.
