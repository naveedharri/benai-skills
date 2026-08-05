---
name: pick-my-harness
description: Asks a few plain questions about the work, then names the one desktop app to run local AI models in, from LM Studio, Goose, Open WebUI, AnythingLLM or OpenWork. Use when the user asks "which app should I use for local AI", "LM Studio or Ollama", "what is the best local AI interface", "do I need Open WebUI", "which one supports MCP", "which supports skills", "pick a harness for me", or is comparing local AI desktop apps. Names one tool and states what it cannot do. Never installs anything. Requires Claude Code with shell access on the user's own machine; refuses to run in a sandbox.
---

# Pick My Harness

Turns "which app should I use" into one named recommendation. A model is only half a local AI setup; this picks the app that gives it skills, MCP servers and your files.

## Before you start

Run the check in `references/environment-check.md` first. These skills need a shell on the user's own machine. If the environment is a sandbox or container, stop and tell the user to run this in Claude Code on the computer they want to set up. Do not report detected specs from a sandbox: wrong specs are worse than none.

## Steps

Track progress:

```
Task Progress:
- [ ] 1. Ask the four questions
- [ ] 2. Match against the matrix
- [ ] 3. Name one tool and its limits
- [ ] 4. Render the HTML report
```

### 1. Ask the four questions
Ask all four at once, as a short numbered list, in plain language. Never ask about VRAM here.

1. What is the main job: chatting with documents, writing code, general chat, or running automated tasks?
2. Is this just for you, or for a team who all need access?
3. How comfortable are you editing a config file if it unlocks more control? (happy / rather not)
4. Does everything need to stay on your machine with no cloud fallback?

If the user already answered some in their request, do not re-ask. Use what they gave.

### 2. Match against the matrix
Apply the decision rules in `references/harness-matrix.md`. That file holds the five tools, their real capability flags, and the tie-breakers.

### 3. Name one tool and its limits
Output exactly one recommendation, never a shortlist. Give: the tool, one sentence on why it won for their answers, its three capability flags, and one line on what it cannot do. Then give the single command or download link to get it.

If their answers make a second tool genuinely necessary alongside the first (most commonly LM Studio underneath something else), say so explicitly as a pair rather than presenting a choice.

### 4. Render the HTML report
Deliver the recommendation as a rendered HTML page, not as chat text. Build it from `references/report-template.md` using the `pick-my-harness` layout in section 4, save it to the Desktop, and open it. Keep the chat reply to two lines plus the file path.

## Human checkpoints
Stop after step 3 and ask whether to proceed with installing it. Do not install anything from this skill. If they say yes, route to `/local-ai-setup`, or to `/install-openwebui` when Open WebUI is the pick.

## Self-improvement

This skill is never finished. Improve it as you use it.

- Results are delivered as HTML pages. When the layout in `references/report-template.md` proves unclear for a real result, fix the layout there rather than working around it in chat.
- When a tool ships or loses a capability, update the flags table in `references/harness-matrix.md` and change its date line.
- When the user disagrees with a recommendation and explains why, add that as a tie-breaker rule in the matrix file.
- When a question turns out not to change the recommendation, delete it. Four is already the maximum.
- Keep this small: when you add something, cut anything that no longer changes behaviour.

## Routing
| Step | Reference |
|------|-----------|
| before all steps | `references/environment-check.md` |
| 2 | `references/harness-matrix.md` |
| 4 | `references/report-template.md` |
