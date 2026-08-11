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
| Claude Code wired to the local model, from step 6b | They get back in by pasting the same three line block from the report, in the same order. The model name in Claude Code's status line tells them which model they are talking to: if it reads the Ollama tag, the session is local. |
| Claude Code wired to the local model, and Ollama started some other way | This is the one that will bite them. The context is fixed when the server starts, so an Ollama started without `OLLAMA_CONTEXT_LENGTH` runs at 4,096 tokens on a machine under 24 GB. It will not error. It will invent files it never created. If the block's first line says the address is already in use, that is exactly what has happened: stop the running server and paste the block again. |

## 3. What not to say

- Do not list commands they did not need. They asked for a working setup, not a tutorial.
- Do not explain quantization, VRAM maths, or MoE architecture unless asked. The scan already handled sizing.
- Do not suggest a second model, a second app, or an upgrade path unprompted.
- Do not claim it works without having sent a real prompt and seen a real reply.
