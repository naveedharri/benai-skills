---
name: infographic-v2
description: Generate professional infographics using Nano Banana MCP (Gemini AI image generation). Follows a guided flow - analyze content, suggest visualizable concepts, propose visualization approaches, then generate on-brand images. USE THIS SKILL WHEN user says "create infographic v2", "make a visual v2", "infographic-v2". Modular architecture with lazy-loaded reference files for each phase.
---

# Infographic Generator

Create professional infographics in the BenAI brand style for LinkedIn and newsletters. Uses Gemini AI via the Nano Banana MCP server for image generation.

**Connectors:** Nano Banana MCP (Gemini AI image generation)

**Core philosophy:** The quality of the output is determined by the quality of the thinking BEFORE any prompt is written. Spend 70% of the effort understanding what to visualize and 30% on how to visualize it.

**UX philosophy:** Every user interaction must be a genuine taste decision. If the AI can make a good default, it should make it silently and let the user override. Never ask for confirmation of something the AI decided.

---

## When This Skill Loads

**DO NOT load any reference files yet.** Files load lazily, one phase at a time.

1. Execute Phase 0 (silent config check)
2. If API key is NOT configured: skip to Phase 5 (API Key Setup). Do NOT ask about content.
3. If API key IS configured: begin Phase 1.

---

# UNDERSTAND

## Phase 0: Silent Config Check

Run silently. Do NOT ask questions yet.

### 0.1: Ensure Directory Structure

```bash
mkdir -p .infographic/images
mkdir -p .infographic/prompts
```

### 0.2: Check for API Key

```bash
if [ -n "$GEMINI_API_KEY" ]; then
  echo "API key found in environment"
elif [ -f .env ] && grep -q "^GEMINI_API_KEY=.\+" .env; then
  echo "API key found in .env file"
else
  echo "API key not configured"
fi
```

**Decision:**
- Found (env var OR .env): proceed silently to Phase 1
- NOT found: jump IMMEDIATELY to Phase 5 (API Key Setup)

### 0.3: Check for Brand Config

Check these locations in order (first found wins):

```bash
if [ -f ./branding.md ]; then
  cat ./branding.md
elif [ -f .infographic/brand.md ]; then
  cat .infographic/brand.md
fi
```

If brand config exists, acknowledge briefly: "I found your brand context. Ready to create your infographic!"

**How branding.md gets created:** The `/ads-creative` skill collects brand info (colors, fonts, voice, audience) and writes `./branding.md` in the project root. If the user has run an ads creative audit, this file will already exist. The infographic skill uses it for on-brand color palettes, typography, and style anchors.

---

## Phase 1: Content Intake

**No reference files loaded.** Just collect the raw material.

**No AskUserQuestion.** Just say naturally:

> "What content should I turn into an infographic? Paste text, share a URL, or point me to a file."

Wait for content. Acknowledge receipt briefly ("Got it, analyzing now..."). Proceed immediately to Phase 2.

---

## Phase 2: Analysis + First Choices

```
>>> READ references/content-analysis.md NOW
```

### 2.1: Four-Layer Analysis (silent)

Apply the framework from `content-analysis.md`. Extract meaning at all 4 layers:

- Layer 1 (Narrative): What happened?
- Layer 2 (Themes): What is it about?
- Layer 3 (Claims): What does it SAY is true about the world?
- Layer 4 (Information): What concrete data, comparisons, or frameworks exist?

Present the analysis explicitly labeled by layer with honest strength ratings (Weak / Moderate / Strong).

### 2.2: Auto-Decide Intent + Output Mode

Based on the layer analysis, AUTO-DECIDE the output mode. Do NOT ask the user.

| Layer Strengths | Auto-Decision |
|---|---|
| Layer 3 Strong, Layer 4 Weak | Editorial Illustration |
| Layer 4 Strong, Layer 3 Weak | Information Graphic |
| Both Layer 3 and Layer 4 Strong | Hybrid (see sub-mode rules below) |
| Both Weak | Ask the user for guidance (this is the only case where you ask) |

#### Hybrid Sub-Modes

When both Layer 3 and Layer 4 are strong, pick the sub-mode based on which layer is STRONGER:

| Relative Strength | Hybrid Sub-Mode | What It Produces |
|---|---|---|
| Layer 4 >= Layer 3 | **Data-led hybrid** | An Information Graphic (BenAI brand system, cards, data structures) with an emotionally resonant headline or framing from Layer 3. The infographic IS the output. The claim provides the hook. |
| Layer 3 > Layer 4 | **Editorial-led hybrid** | An Editorial Illustration (cinematic scene, artistic style) with a small data overlay anchoring the emotion. The scene IS the output. The data provides credibility. |

**Default when equal:** Data-led hybrid. Most LinkedIn content benefits more from a clear infographic with a strong headline than from an artistic scene with a data footnote.

State the decision inline with the analysis, including the sub-mode:

> "Your content is strong at both Layer 3 and Layer 4, but the concrete framework is the real asset. I'll create a **data-led hybrid** -- a clean infographic with your philosophical claim as the headline."

If the user disagrees at any point, they can override by saying so in free text.

### 2.3: Batch Platform + Type + Style

Use ONE `AskUserQuestion` with TWO questions (batched). Always ask BOTH questions regardless of the auto-detected output mode. The user should always have the choice between infographic and editorial styles.

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

**Note:** The "(Recommended)" label on Infographic is the default. Move it to the editorial option instead if the auto-detected mode is Editorial Illustration or Editorial-led Hybrid.

#### Mode Adjustment Based on Type Selection

The user's type selection determines the output mode. This overrides the auto-detected mode from Phase 2.2.

| User Selects | Output Mode Becomes |
|---|---|
| **Infographic** | Information Graphic (or Data-led Hybrid if both layers were strong). Lock BenAI brand system as the style. |
| **Editorial illustration** | Editorial Illustration (or Editorial-led Hybrid if both layers were strong). Use European editorial / Adult Swim / Moebius style anchors. |
| **Risograph / analog print** | Editorial Illustration. Use risograph style anchors. |
| **Minimalist conceptual** | Editorial Illustration. Use minimalist conceptual style anchors. |
| **Other (free text)** | If it describes a data visual or infographic style, route to Information Graphic. If it describes an artistic style, route to Editorial Illustration. Use their description as the style anchor. |

State the locked mode after selection: "Got it -- clean infographic using the BenAI brand system." or "Got it -- editorial illustration in the risograph style."

**This is ONE user interaction collecting TWO answers.**

---

# PLAN

## Phase 3: Concept Selection

### 3.1: Concept Extraction (5+ concepts)

Extract at least 5 concepts. **Always extract from BOTH Layer 3 and Layer 4**, regardless of the current output mode. This gives the user the option to pick a concept that might shift the output type.

For each concept, extract at the correct layer:
- Layer 3 concepts: philosophical claims as truth statements
- Layer 4 concepts: information structures as data shapes

**Label every concept with its layer and what it naturally produces.** This is critical -- the user must see what choosing each concept implies for the output.

Present all 5+ with `AskUserQuestion`. Use the actual claims or data shapes as labels, not topic names. Include the layer tag in the description.

```
question: "Which of these should we visualize?"
header: "Concept"
options:
  - label: "[First few words of data shape 1]"
    description: "Layer 4 (infographic). [Why this is a strong visual candidate]"
  - label: "[First few words of claim 1]"
    description: "Layer 3 (editorial). [Why this is a strong visual candidate]"
  - label: "[First few words of data shape 2]"
    description: "Layer 4 (infographic). [Why this is a strong visual candidate]"
  - label: "[First few words of claim 2]"
    description: "Layer 3 (editorial). [Why this is a strong visual candidate]"
```

**Ordering rule:** Present concepts that match the locked output mode FIRST. If the mode is Information Graphic or Data-led Hybrid, Layer 4 concepts come first. If Editorial, Layer 3 concepts come first. But always include concepts from both layers.

**Mode adjustment on selection:** If the user picks a concept from a different layer than the locked mode, silently adjust the mode to match. For example, if the mode is Information Graphic but the user picks a Layer 3 claim, switch to Editorial Illustration. State the switch: "That's a philosophical claim -- I'll switch to an editorial illustration for this one."

(Present remaining concepts as additional options. Never fewer than 5.)

**Never proceed without user selection.**

---

## Phase 4: Visualization Approach

```
>>> READ references/visualization-patterns.md NOW
```

### 4.1: Visualization Proposals (5 approaches)

#### Guard Rail: Proposal Type MUST Match the Locked Output Mode

Before writing any proposals, check the current locked output mode. This determines what KIND of proposals you create. There are no exceptions.

| Locked Output Mode | Proposal Type | What Each Proposal Contains |
|---|---|---|
| Information Graphic | DATA STRUCTURES only | Format (scorecard, vertical flow, comparison, hierarchy, card grid), data mapping, 1-second takeaway, why this format fits |
| Data-led Hybrid | DATA STRUCTURES only | Same as Info Graphic, but note which Layer 3 claim will serve as the headline |
| Editorial Illustration | CINEMATIC SCENES only | The scene, emotional register, focal composition, 2-second hit |
| Editorial-led Hybrid | CINEMATIC SCENES only | Same as Editorial, but note which data element will anchor the scene |

**CRITICAL: If the mode is Information Graphic or Data-led Hybrid, NEVER propose metaphorical scenes, artistic illustrations, or cinematic compositions. Propose layout formats and data structures ONLY. A "hierarchy diagram" is a data structure. A "vast library with glowing books" is a scene. Know the difference.**

Propose 5 ways to visualize the chosen concept using the correct proposal type above.

Use `AskUserQuestion` with the 5 proposals. **Enable `multiSelect: true`** so the user can select multiple approaches at once.

**Never propose fewer than 5.**

#### Multi-Select Behavior

When the user selects multiple approaches:

1. **Generate all selected approaches in parallel.** Run Phase 5 (content mapping, 2-second test, prompt construction, generation) independently for each selected approach. Use parallel tool calls where possible.
2. **Name versions by approach:** `[topic]-v1a.png`, `[topic]-v1b.png`, `[topic]-v1c.png` etc.
3. **Display all results** sequentially using Read tool, labeling each: "**Version A** (vertical flow):", "**Version B** (comparison):", etc.
4. Proceed to Phase 6 multi-image review flow (see below).

When the user selects only one approach, the flow remains unchanged (single generation, normal Phase 6 single-image review).

---

# EXECUTE

## Phase 5: Generate (Zero Confirmations)

```
>>> READ references/quality-checklist.md NOW
>>> READ references/brand-guidelines.md NOW (for Information Graphics and Hybrid)
>>> READ references/prompt-engineering.md NOW
```

After the user picks an approach (or multiple approaches), do ALL of the following **silently and automatically** for each selected approach:

### 5.1: Content Mapping (internal -- no user confirmation)

Map the user's SPECIFIC content to the chosen structure:
- What text appears where (exact words)
- How the visual hierarchy works
- What the focal point is

Do NOT present this to the user for approval. This is internal quality work.

### 5.2: The 2-Second Test (internal -- no user confirmation)

Before writing any prompt, explicitly answer:

> "A person scrolling sees this image for exactly 2 seconds. What do they GET?"

Write the answer in ONE sentence:
- For Editorial: "They feel [emotion] and stop scrolling because [reason]."
- For Info Graphic: "They learn [fact] and think 'I should save this.'"

**If the statement is clear and specific:** proceed to prompt construction.
**If the statement is vague or unclear:** the concept is not ready. Go back to Phase 4 and ask the user to pick a different approach. Do NOT proceed.

This is an internal quality gate. Do NOT present the statement to the user for approval.

### 5.3: Pre-Prompt Thinking (internal)

Before writing a single word of the prompt, answer these questions:

1. **Text inventory:** List every piece of text that must appear in the image.
   Will use TEXT LINE N: format with CRITICAL exact spelling instruction.

2. **Element control:** Should icons appear? If NO, will use the nuclear NO formula
   (listing every synonym: icons, illustrations, pictograms, emojis, visual symbols).
   If YES, which icon library reference? (Phosphor, Feather, etc.)

3. **Style anchor:** What single brand/product reference captures the target aesthetic?
   (e.g., "Stripe.com", "Linear.app", "Notion.so")

4. **Layout structure:** How many sections? Will use === SECTION === markers
   with [LARGE GAP] between them for clear visual separation.

5. **Aspect ratio:** Confirm ratio appears in BOTH the prompt text AND the
   generate_image parameter.

### 5.4: Craft the Prompt (internal)

Use the correct architecture from `prompt-engineering.md`:

**For Editorial Illustration:** 9-part structure
Style anchor, emotional register, the scene, spatial composition, texture/materiality, color palette, text elements, what not to do, technical specs.

**For Information Graphic:** 8-part structure
Format declaration, information hierarchy, data visualization, exact text, brand system (from `brand-guidelines.md`), density control, scanability, technical specs.

### 5.5: Generate Immediately

Do NOT show the prompt to the user. Do NOT ask for prompt approval.

For the selected platform, use the matching aspect ratio:

| Platform | aspectRatio param |
|----------|------------------|
| LinkedIn | "4:5" |
| Instagram (square) | "1:1" |
| Twitter/Presentation | "16:9" |

```
Call tool: generate_image
Parameters: { "prompt": "[crafted prompt]", "aspectRatio": "[ratio]" }
```

### 5.6: Copy and Display

```bash
mkdir -p .infographic/images
cp "./generated_imgs/[returned-filename]" ".infographic/images/[topic-slug]-v1.png"
```

**IMMEDIATELY display to user using Read tool:**
```
Read file: .infographic/images/[topic-slug]-v1.png
```

The user MUST see the image to give feedback.

---

## Phase 6: Review + Iterate

Phase 6 has two flows depending on whether one or multiple images were generated.

---

### 6-SINGLE: Single Image Review

Used when only one approach was selected in Phase 4.

#### 6-SINGLE.1: The Diagnostic Question

Use `AskUserQuestion`:

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

#### 6-SINGLE.2: Branch

**"Done - save it"** - Save as `[topic]-final.png`. Wrap up.

**"Tweak it"** - Let the user describe what to change in **free text** (no multi-select categories). Users know what's wrong. Apply edits based on their description.

**First edit:**
```
Call tool: edit_image
Parameters: {
  "imagePath": ".infographic/images/[topic]-v1.png",
  "prompt": "Edit this infographic:\n1. [Change 1]\n2. [Change 2]\nKeep everything else exactly the same."
}
```

**Subsequent edits:**
```
Call tool: continue_editing
Parameters: { "prompt": "[further changes]" }
```

After each edit:
1. Copy from `./generated_imgs/[filename]` to `.infographic/images/[topic]-v[N].png`
2. Display using Read tool
3. Ask "How's this?" again (same 6-SINGLE.1 question)

**"Concept isn't working"** - Go back to Phase 4 (Visualization Approach) with the same concept, OR back to Phase 3 (Concept Selection) if the user wants a different concept entirely. Ask which.

**"Next concept"** - Save current as `[topic]-final.png`. Return to Phase 3 with the cached concept list. Skip analysis (already done). Skip platform/style (cached from Phase 2).

---

### 6-MULTI: Multi-Image Review

Used when multiple approaches were selected in Phase 4. The goal is to let the user compare, keep, discard, and tweak -- all without losing track of which version is which.

#### 6-MULTI.1: Triage

After displaying all generated versions (labeled A, B, C...), ask the user to triage:

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

#### 6-MULTI.2: Branch

**"Pick the best one"** - Ask which version:
```
question: "Which version?"
header: "Pick"
options:
  - label: "Version A: [approach name]"
    description: "[1-line summary]"
  - label: "Version B: [approach name]"
    description: "[1-line summary]"
  [... one option per generated version, max 4]
```
After selection, enter the **single-image flow** (6-SINGLE) for that version. Discard the others (delete from `.infographic/images/`). Rename the kept version to `[topic]-v1.png` for clean iteration numbering.

**"Keep all - finalize"** - Save each as `[topic]-a-final.png`, `[topic]-b-final.png`, etc. Wrap up.

**"Tweak specific versions"** - Let the user describe tweaks in **free text**. They should reference versions by letter: "In Version A, make the title bigger. In Version C, change the accent color to blue."

Apply edits to each mentioned version:
```
Call tool: edit_image
Parameters: {
  "imagePath": ".infographic/images/[topic]-v1a.png",
  "prompt": "Edit this infographic:\n1. [Changes for this version]\nKeep everything else exactly the same."
}
```

For each subsequent version edit, use `edit_image` (not `continue_editing`) since each version is a different base image.

After all edits:
1. Copy each result to `.infographic/images/[topic]-v2a.png`, `[topic]-v2b.png`, etc. (increment the version number, keep the letter)
2. Display all updated versions
3. Return to 6-MULTI.1 (triage again)

**"None of these work"** - Go back to Phase 4 (Visualization Approach) with the same concept, OR back to Phase 3 (Concept Selection). Ask which.

#### 6-MULTI.3: Convergence

At any point in the multi-image flow, if the user is down to one version (either by picking the best or discarding the rest), switch to the **single-image flow** (6-SINGLE) for final tweaks and save. Don't keep asking triage questions when there's only one image left.

---

## Phase 5-ALT: API Key Setup

```
>>> READ references/nano-banana-api.md NOW (Section: API Setup)
```

Only reached if Phase 0 found no API key.

Use `AskUserQuestion`:

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

Follow the paths described in `nano-banana-api.md`:
- **Set it up now:** Guide through Google AI Studio, save to .env, instruct restart, EXIT SKILL
- **I have a key:** Save to .env, instruct restart, EXIT SKILL
- **Skip for now:** Complete all phases normally, save prompt to `.infographic/prompts/` instead of generating

**CRITICAL:** After saving a key, the skill MUST EXIT. Tell the user to restart Claude Code and run the skill again.

---

## Caching for Series Workflows

After the first image is generated, the following are CACHED for subsequent images from the same content:

- **Four-layer analysis** (don't re-analyze)
- **Concept list** (all 5+ extracted concepts)
- **Platform selection** (reuse same platform)
- **Style selection** (reuse same style)
- **Output mode** (reuse same mode)

When the user selects "Next concept" in Phase 6:
1. Present the cached concept list (minus already-visualized concepts)
2. After selection, go directly to Phase 4 (Visualization Approach)
3. After approach selection, go directly to Phase 5 (Generate)

**Second image flow: Concept selection -> Visualization approach -> Auto-generate -> Review**
**Target: 4 interactions for subsequent images.**

---

## Progressive Updates

When a user provides feedback that constitutes a general preference (not a one-time edit), the skill should recognize it as a potential rule.

Use `AskUserQuestion`:
```
question: "Should I remember this as a permanent rule for future infographics?"
header: "New Rule"
options:
  - label: "Yes, always"
    description: "Add this to my permanent rules"
  - label: "Just this time"
    description: "Apply it now but don't save"
```

If confirmed: append a new numbered rule to the Rules section below.

---

## Reference File Load Map

| Phase | File Loaded | Purpose |
|-------|------------|---------|
| 0 | None | Just checking config |
| 1 | None | Just collecting content |
| 2 | `content-analysis.md` | 4-layer framework for analysis |
| 3 | None | Concepts already extracted in Phase 2 |
| 4 | `visualization-patterns.md` | Layout archetypes + style anchors |
| 5 | `quality-checklist.md` + `brand-guidelines.md` + `prompt-engineering.md` | Internal quality gates + prompt construction |
| 6 | None | Review is user-driven |

---

## Interaction Count Target

### First image from new content: 6 interactions
1. Paste content (natural language, no AskUserQuestion)
2. Platform + Style (batched into one AskUserQuestion)
3. Concept selection
4. Visualization approach
5. Post-generation review
6. Final decision (done/tweak/next)

### Subsequent images from same content: 4 interactions
1. Concept selection (from cached list)
2. Visualization approach
3. Post-generation review
4. Final decision

### What happens AUTOMATICALLY (no user interaction):
- Intent detection (auto from layer analysis)
- Output mode selection (auto from intent)
- Content mapping (internal quality work)
- 2-second validation (internal quality gate)
- Prompt construction (internal)
- Prompt approval (not needed -- user approved the approach, not the prompt)

---

## File Naming

### Single image flow
| Stage | Pattern | Example |
|-------|---------|---------|
| First version | `[topic]-v1.png` | `chosen-pain-v1.png` |
| After edits | `[topic]-v2.png` | `chosen-pain-v2.png` |
| Final | `[topic]-final.png` | `chosen-pain-final.png` |

### Multi-image flow
| Stage | Pattern | Example |
|-------|---------|---------|
| First generation | `[topic]-v1a.png`, `[topic]-v1b.png` | `disclosure-v1a.png`, `disclosure-v1b.png` |
| After edits | `[topic]-v2a.png`, `[topic]-v2b.png` | `disclosure-v2a.png`, `disclosure-v2b.png` |
| Final (all kept) | `[topic]-a-final.png`, `[topic]-b-final.png` | `disclosure-a-final.png`, `disclosure-b-final.png` |
| Final (one picked) | `[topic]-final.png` | `disclosure-final.png` |

### Series + Prompts
| Stage | Pattern | Example |
|-------|---------|---------|
| Series | `[topic]-01-v1.png` | `tips-01-v1.png` |
| Prompts | `[topic]-prompt.md` | `.infographic/prompts/tips-prompt.md` |

---

## Directory Structure

```
.infographic/
  brand.md           # Saved brand config (optional, for overrides)
  images/            # All generated infographics
    topic-v1.png
    topic-v2.png
    topic-final.png
  prompts/           # Saved prompts (for no-key fallback)
    topic-prompt.md
```

---

## Rules

1. Never use em dashes (the long dash character)
2. Always give 5+ suggestions at every decision point (never one-off outputs)
3. Visualize claims (Layer 3) or information (Layer 4), NEVER narrative or themes
4. Apply the 2-second test BEFORE designing, not after (internal gate, no user confirmation)
5. Edit don't regenerate (unless the concept itself is broken)
6. Use style anchors, not abstract descriptors ("Moebius meets Adult Swim" beats "clean modern illustration")
7. NEVER use black backgrounds
8. Max 4-5 distinct elements per infographic, one key message rule
9. Always include footer: "Ben Van Sprundel | Founder @ BenAI"
10. Instruct clearly in the process when to use each reference file (lazy loading)
11. Never ask for confirmation of something the AI decided -- state it and let the user override
12. Batch independent questions into a single AskUserQuestion when possible
13. Keep the prompt hidden by default -- show only if user explicitly asks
14. Cache all decisions (platform, style, concepts, analysis) for series workflows
