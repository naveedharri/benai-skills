---
name: scan-my-machine
description: Scans the user's actual hardware and tells them exactly which local AI models they can run, by name, with expected speed. Use when the user asks "what models can my computer run", "can I run a local LLM", "how much VRAM do I have", "which model should I download", "is my Mac good enough for local AI", "scan my machine", or shares hardware specs and asks what fits. Reads real memory and GPU rather than asking the user to know their own specs. Never installs anything. Requires Claude Code with shell access on the user's own machine; refuses to run in a sandbox.
---

# Scan My Machine

Reads the machine's real memory and GPU, then names the local models that fit. Read-only: this skill never installs, downloads, or changes anything.

## Before you start

Run the check in `references/environment-check.md` first. These skills need a shell on the user's own machine. If the environment is a sandbox or container, stop and tell the user to run this in Claude Code on the computer they want to set up. Do not report detected specs from a sandbox: wrong specs are worse than none.

## Steps

Track progress:

```
Task Progress:
- [ ] 1. Detect the hardware
- [ ] 2. Work out the usable memory budget
- [ ] 3. Name the models that fit
- [ ] 4. Report what is already installed
- [ ] 5. Render the HTML report
```

### 1. Detect the hardware
Run the detection commands for the user's OS from `references/detect-hardware.md`. Get: total memory, GPU and its VRAM, chip name, free disk. Never ask the user for specs you can detect yourself. If a command fails, try the fallback in that file before asking.

### 2. Work out the usable memory budget
Take the memory that matters (discrete GPU VRAM, or unified memory on Apple Silicon) and multiply by 0.75. That headroom is for conversation context and the app itself. Report the raw figure and the budget separately so the user sees why they differ.

### 3. Name the models that fit
Match the budget against the tier table in `references/model-tiers.md`. Output named models with their quantization tag and expected tokens per second, never a tier number alone. State one primary pick and at most two alternates. If the budget spans two tiers, pick the lower one.

### 4. Report what is already installed
Run the inventory commands in `references/detect-hardware.md` to find existing Ollama, LM Studio, Open WebUI and already-pulled models. Tell the user what they already have so they do not download something twice.

### 5. Render the HTML report
Deliver the result as a rendered HTML page, not as chat text. Build it from `references/report-template.md` using the `scan-my-machine` layout in section 4, save it to the Desktop, and open it. Keep the chat reply to two lines plus the file path.

## Human checkpoints
None. This skill only reads. If the user asks to install or download anything, stop and route them to `/local-ai-setup`.

## Self-improvement

This skill is never finished. Improve it as you use it.

- Results are delivered as HTML pages. When the layout in `references/report-template.md` proves unclear for a real result, fix the layout there rather than working around it in chat.
- When a detection command fails on a machine, add the working command for that OS or chip to `references/detect-hardware.md`.
- When the model recommendations go stale or a better model ships, update `references/model-tiers.md` and change its date line.
- When the user corrects a recommendation, record the corrected rule in the relevant reference file so it sticks.
- When a scan report was genuinely useful, save it to `references/examples/` as a model for future runs.
- Keep this small: when you add something, cut anything that no longer changes behaviour.

## Routing
| Step | Reference |
|------|-----------|
| before all steps | `references/environment-check.md` |
| 1, 4 | `references/detect-hardware.md` |
| 3 | `references/model-tiers.md` |
| 5 | `references/report-template.md` |
