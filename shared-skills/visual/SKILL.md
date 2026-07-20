---
name: visual
description: Generate on-brand visuals and infographics for LinkedIn posts and newsletters using Nano Banana MCP (Gemini AI image generation). Final step of the content pipeline. Follows a guided flow: analyze the content, suggest visualizable concepts, propose visualization approaches, then generate on-brand visuals. USE THIS SKILL WHEN user says "create a visual", "make a visual", "generate an infographic", or wants a graphic to go with a post or newsletter.
disable-model-invocation: true
---

# Infographic Generator

Create professional infographics in the BenAI brand style for LinkedIn and newsletters. Uses Gemini AI via the Nano Banana MCP server for image generation.

**Connector:** Nano Banana MCP (Gemini AI image generation).

**Core rule:** Quality is set by the thinking BEFORE the prompt. Spend 70% of effort on what to visualize, 30% on how.

**UX rule:** When the AI can make a good default, make it silently and let the user override. Never ask the user to confirm something the AI already decided.

Files load lazily, one phase at a time. Do NOT load reference files up front. See the Reference File Load Map at the bottom.

---

## When This Skill Loads

1. Run Phase 0 (silent config check).
2. If the API key is NOT configured: jump to Phase 5-ALT (API Key Setup). Do NOT ask about content.
3. If the API key IS configured: begin Phase 1.

---

# UNDERSTAND

## Phase 0: Silent Config Check

Run silently. No questions yet.

```bash
mkdir -p .infographic/images .infographic/prompts

if [ -n "$GEMINI_API_KEY" ]; then
  echo "API key found in environment"
elif [ -f .env ] && grep -q "^GEMINI_API_KEY=.\+" .env; then
  echo "API key found in .env file"
else
  echo "API key not configured"
fi
```

- Key found (env var OR .env): proceed to Phase 1.
- Key NOT found: jump to Phase 5-ALT.

Then check for brand config (first found wins): `./branding.md`, then `.infographic/brand.md`. If found, `cat` it and acknowledge briefly ("Found your brand context, ready to create."). `branding.md` is written by the `/ads-creative` skill (colors, fonts, voice, audience); use it for on-brand palettes, typography, and style anchors.

---

## Phase 1: Content Intake

No reference files. No AskUserQuestion. Say:

> "What content should I turn into an infographic? Paste text, share a URL, or point me to a file."

Acknowledge receipt briefly, then go to Phase 2.

---

## Phase 2: Analysis + First Choices

```
>>> READ references/content-analysis.md NOW
```

### 2.1: Four-Layer Analysis

Apply the four-layer framework in `content-analysis.md`. Present the analysis labeled by layer (Narrative, Themes, Claims, Information) with honest strength ratings (Weak / Moderate / Strong).

### 2.2: Auto-Decide Output Mode

Auto-decide the output mode from the layer strengths using the decision table in `content-analysis.md` (Auto-Intent Detection + Hybrid Sub-Modes). State the decision inline with the analysis, including the hybrid sub-mode when relevant. Do NOT ask the user, unless both Layer 3 and Layer 4 are weak (the only case where you ask for guidance). The user can override any auto-decision in free text.

### 2.3: Batch Platform + Type

ONE `AskUserQuestion` with TWO questions. Always ask BOTH regardless of the auto-detected mode, so the user always has the choice.

```
questions:
  - question: "Where will this be posted?"
    header: "Platform"
    options:
      - label: "LinkedIn (Recommended)"
        description: "4:5 portrait, optimized for feed engagement"
      - label: "Instagram"
        description: "1:1 square or 4:5 portrait"
      - label: "Twitter/X"
        description: "16:9 landscape for timeline"
      - label: "Presentation"
        description: "16:9 landscape for slides"

  - question: "What type of visual should this be?"
    header: "Type"
    options:
      - label: "Infographic (Recommended)"
        description: "Clean data visual using BenAI brand system. Cards, scorecards, diagrams. Best for frameworks and comparisons."
      - label: "Editorial illustration"
        description: "Artistic, cinematic scene. Moebius linework, surrealism, or graphic novel style. Best for philosophical claims."
      - label: "Risograph / analog print"
        description: "Paper grain, muted palette, slight imperfections. Tactile and warm. Best for personal, human content."
      - label: "Minimalist conceptual"
        description: "Single powerful image. New Yorker cover energy. Best for one strong metaphor."
```

Move the "(Recommended)" tag to the editorial option if the auto-detected mode is Editorial Illustration or Editorial-led Hybrid.

The type selection OVERRIDES the auto-detected mode. Apply the Type Selection Override table in `content-analysis.md`, then state the locked mode.

---

# PLAN

## Phase 3: Concept Selection

Extract at least 5 concepts. Always extract from BOTH Layer 3 and Layer 4 (per the extraction rules in `content-analysis.md`), so the user can pick a concept that shifts the output type. Label every concept with its layer and what it produces.

Present all 5+ with `AskUserQuestion`. Use the actual claims or data shapes as labels, not topic names; include the layer tag in the description.

```
question: "Which of these should we visualize?"
header: "Concept"
options:
  - label: "[First few words of data shape 1]"
    description: "Layer 4 (infographic). [Why it is a strong visual candidate]"
  - label: "[First few words of claim 1]"
    description: "Layer 3 (editorial). [Why it is a strong visual candidate]"
  [... never fewer than 5 options]
```

Ordering: concepts matching the locked mode come first (Layer 4 first for Information Graphic / Data-led Hybrid; Layer 3 first for Editorial), but always include both layers. If the user picks a concept from a different layer than the locked mode, silently switch the mode to match and state the switch.

Never proceed without a user selection.

---

## Phase 4: Visualization Approach

```
>>> READ references/visualization-patterns.md NOW
```

Propose exactly 5 ways to visualize the chosen concept. The proposal TYPE must match the locked output mode (data structures for Information Graphic / Data-led Hybrid; cinematic scenes for Editorial / Editorial-led Hybrid). Follow the proposal rules and the mode-match guard rail in `visualization-patterns.md`. Never propose fewer than 5.

Present with `AskUserQuestion`, `multiSelect: true`.

**If the user selects multiple approaches:** run Phase 5 independently for each (parallel tool calls where possible). Name versions `[topic]-v1a.png`, `[topic]-v1b.png`, etc. Display all results with the Read tool, labeled "Version A (vertical flow):", "Version B (comparison):", etc. Then use the 6-MULTI review flow.

**If the user selects one approach:** single generation, then the 6-SINGLE review flow.

---

# EXECUTE

## Phase 5: Generate (Zero Confirmations)

```
>>> READ references/quality-checklist.md NOW
>>> READ references/brand-guidelines.md NOW (Information Graphics and Hybrid only)
>>> READ references/prompt-engineering.md NOW
>>> READ references/nano-banana-api.md NOW
```

For each selected approach, do ALL of the following silently and automatically (no user confirmation):

1. **Content mapping** (internal): map the user's specific content to the chosen structure per `visualization-patterns.md` (Content Mapping). Do not present for approval.
2. **2-second test** (internal gate): apply the pre-design test in `quality-checklist.md`. If the statement is clear, proceed. If it is vague, the concept is not ready: go back to Phase 4. Do not present the statement to the user.
3. **Pre-prompt thinking + craft the prompt** (internal): build the prompt using the correct architecture in `prompt-engineering.md` (9-part editorial or 8-part information graphic). Pull the brand system from `brand-guidelines.md` for Information Graphics and Hybrids. Do NOT show the prompt to the user or ask for prompt approval.
4. **Generate:** call `generate_image` with the crafted prompt and the platform's aspect ratio (see the aspect-ratio table in `nano-banana-api.md`; LinkedIn `4:5`, Instagram square `1:1`, Twitter/Presentation `16:9`). Also embed the ratio in the prompt text.
5. **Copy + display:** copy the result from `./generated_imgs/` to `.infographic/images/[topic-slug]-v1.png`, then IMMEDIATELY display it with the Read tool. The user MUST see the image to give feedback. (File handling details in `nano-banana-api.md`.)

---

## Phase 6: Review + Iterate

Use 6-SINGLE when one approach was generated, 6-MULTI when several were. Diagnostic and iteration guidance is in `quality-checklist.md`; edit-vs-regenerate rules in `nano-banana-api.md`.

### 6-SINGLE: Single Image Review

`AskUserQuestion`:

```
question: "How's this?"
header: "Result"
options:
  - label: "Done - save it"
    description: "This is the final version"
  - label: "Tweak it"
    description: "Tell me what to adjust"
  - label: "Concept isn't working"
    description: "Go back and pick a different approach or concept"
  - label: "Next concept"
    description: "Save this and start another from the same content"
```

- **Done:** save as `[topic]-final.png`. Wrap up.
- **Tweak it:** user describes changes in free text. First edit uses `edit_image` (with `imagePath`); subsequent edits use `continue_editing`. After each edit: copy to `[topic]-v[N].png`, display with Read, ask "How's this?" again.
- **Concept isn't working:** go back to Phase 4 (same concept) or Phase 3 (different concept). Ask which.
- **Next concept:** save current as `[topic]-final.png`, return to Phase 3 with the cached concept list (skip analysis and platform/style, already cached).

### 6-MULTI: Multi-Image Review

After displaying all versions (A, B, C...), triage with `AskUserQuestion`:

```
question: "What do you want to do with these?"
header: "Triage"
options:
  - label: "Pick the best one"
    description: "Choose one version to keep or tweak, discard the rest"
  - label: "Keep all - finalize"
    description: "Save all versions as finals"
  - label: "Tweak specific versions"
    description: "Tell me which ones to adjust"
  - label: "None of these work"
    description: "Go back and try different approaches"
```

- **Pick the best one:** ask which version (one option per version, max 4). Enter 6-SINGLE for it, delete the rest, rename the kept one to `[topic]-v1.png`.
- **Keep all - finalize:** save each as `[topic]-a-final.png`, `[topic]-b-final.png`, etc.
- **Tweak specific versions:** user references versions by letter in free text. Apply per-version edits with `edit_image` (each version is a different base image, so not `continue_editing`). Copy results to `[topic]-v2a.png`, `[topic]-v2b.png`, etc., display all, re-triage.
- **None of these work:** go back to Phase 4 (same concept) or Phase 3. Ask which.

**Convergence:** once down to one version, switch to 6-SINGLE for final tweaks and save. Stop asking triage questions.

---

## Phase 5-ALT: API Key Setup

```
>>> READ references/nano-banana-api.md NOW (Section 3: API Key Setup)
```

Only reached when Phase 0 found no API key.

`AskUserQuestion`:

```
question: "I need a Gemini API key to generate images. How do you want to proceed?"
header: "API Key"
options:
  - label: "Set it up now (Recommended)"
    description: "I will guide you through getting a free key from Google AI Studio"
  - label: "I have a key ready"
    description: "Let me paste it"
  - label: "Skip for now"
    description: "Just give me the prompt to use elsewhere"
```

Follow the matching path in `nano-banana-api.md`:
- **Set it up now** / **I have a key:** save to `.env`, instruct restart, EXIT SKILL.
- **Skip for now:** complete all phases normally, save the prompt to `.infographic/prompts/` instead of generating.

**CRITICAL:** After saving a key, EXIT the skill. Tell the user to restart Claude Code and re-run the skill.

---

## Caching for Series Workflows

After the first image, cache for subsequent images from the same content: the four-layer analysis, the full concept list, platform, style, and output mode. When the user picks "Next concept" in Phase 6: present the cached concept list (minus already-visualized concepts), then go directly to Phase 4, then Phase 5. Do not re-analyze or re-ask platform/style.

---

## Reference File Load Map

| Phase | File Loaded | Purpose |
|-------|------------|---------|
| 0, 1 | None | Config check / content intake |
| 2 | `content-analysis.md` | Four-layer framework, auto-intent, type override, concept extraction |
| 3 | None | Concepts already extracted in Phase 2 |
| 4 | `visualization-patterns.md` | Output modes, style anchors, layout archetypes, proposal rules |
| 5 | `quality-checklist.md` + `brand-guidelines.md` + `prompt-engineering.md` + `nano-banana-api.md` | Quality gates, brand system, prompt construction, generation + files |
| 6 | (already loaded) | Review guidance in `quality-checklist.md` + `nano-banana-api.md` |
| 5-ALT | `nano-banana-api.md` | API key setup |

---

## Rules

1. Never use em dashes (the long dash character).
2. Always give 5+ options at every decision point, never one-off outputs.
3. Visualize claims (Layer 3) or information (Layer 4), NEVER narrative or themes.
4. Apply the 2-second test BEFORE designing (internal gate, no user confirmation).
5. Edit, do not regenerate, unless the concept itself is broken.
6. Use style anchors, not abstract descriptors.
7. NEVER use black backgrounds.
8. Max 4-5 distinct elements per infographic, one key message.
9. Always include the footer: "Ben Van Sprundel | Founder @ BenAI".
10. Never ask the user to confirm something the AI decided: state it, let them override.
11. Batch independent questions into a single AskUserQuestion.
12. Keep the prompt hidden by default; show it only if the user asks.
13. Cache all decisions (platform, style, concepts, analysis) for series workflows.

---

## Self-improvement

This skill is never finished. Improve it as you use it.
- When the user corrects how a step was done, update the relevant reference file (or this SKILL.md) so the correction sticks. Do not just fix it for this run.
- When a correction is a hard rule ("always X", "never Y"), add it as a numbered rule in the Rules section above.
- When the user says an output was genuinely good, save it to `references/examples/` so it becomes a model for future runs.
- Keep the skill small: when you add something, run the deletion test and cut anything that no longer changes behavior.
