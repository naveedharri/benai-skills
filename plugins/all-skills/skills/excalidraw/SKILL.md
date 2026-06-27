---
name: excalidraw
description: Create visual presentations, slide decks, and explanatory diagrams in Excalidraw. Use when user asks to create a presentation, slide deck, visual explainer, pitch deck, comparison diagram, process flow, or any multi-slide visual content. Supports two output modes — generating .excalidraw JSON files OR injecting slides directly into excalidraw.com via Chrome browser automation (clipboard JS injection + paste). Combines presentation design expertise with Excalidraw technical implementation.
---

# Excalidraw Presentation Designer

Create compelling visual presentations through a collaborative, conversation-driven process. Every presentation is co-designed with the user — never assumed.

## How This Skill Works

This is a **guided conversation**, not an assembly line. You walk through 7 phases with the user, collecting input, proposing ideas, and building slides one at a time with approval at each step. The goal is a presentation that feels like THEIRS, not a template.

**Rules:**
- Never build slides without understanding intent, audience, and motivation first
- Never batch-build all slides then reveal — build one, verify, iterate, then next
- Use `AskUserQuestion` for all structured decision points (2-4 options with descriptions)
- Ask in small groups (2-3 questions max at a time) — this is a conversation, not a survey
- Don't proceed to the next phase without confirmation from the current one

---

## Phase 0: Silent Config Load

Run this silently at the start of every session. Do NOT ask the user anything yet.

### Step 0.1: Check for Saved Brand Config

Look for `.excalidraw/brand.md` in the working directory.

- **If found:** Read it silently. You'll use it in Phase 2.
- **If not found:** No action. You'll collect brand info in Phase 2.

### Step 0.2: Check for Shared Context

Look for `.claude/product-marketing-context.md` in the working directory.

- **If found:** Read it silently. Extract any relevant company info, tone, audience details to inform later phases.
- **If not found:** No action.

### Step 0.3: Acknowledge (briefly)

If either config was found, mention it in one line:
> "I found your saved brand config — I'll use it unless you want to start fresh."

If neither was found, say nothing — proceed directly to Phase 1.

---

## Phase 1: Understand Intent

Ask 2-3 structured questions to understand what the user needs. Use `AskUserQuestion` for each.

### Question 1: What are you creating?

This determines the narrative arc suggestion in Phase 3.

```
question: "What type of presentation are you creating?"
header: "Type"
options:
  - label: "Pitch deck"
    description: "Persuade someone — sell an idea, product, or strategy"
  - label: "Explainer"
    description: "Break down a concept, system, or process so people understand it"
  - label: "Tutorial / How-to"
    description: "Step-by-step guide teaching someone how to do something"
  - label: "Process / Architecture diagram"
    description: "Map out a system, workflow, or technical architecture"
multiSelect: false
```

### Question 2: Who is the audience?

This shapes complexity level and tone.

```
question: "Who will see this presentation?"
header: "Audience"
options:
  - label: "Clients / Prospects"
    description: "External stakeholders you want to impress or persuade"
  - label: "Internal team"
    description: "Colleagues who need clarity, not polish"
  - label: "Investors"
    description: "People evaluating your idea — need credibility and vision"
  - label: "Social media / Educational"
    description: "Public audience — needs to be visually striking and self-explanatory"
multiSelect: false
```

### Question 3: What's the motivation?

This determines emphasis, visual weight, and CTA approach.

```
question: "What should this presentation accomplish?"
header: "Goal"
options:
  - label: "Persuade"
    description: "Sell an idea — emphasis on benefits, proof, and call to action"
  - label: "Educate"
    description: "Teach a concept — emphasis on clarity, progression, and examples"
  - label: "Document"
    description: "Capture a process — emphasis on accuracy, completeness, and structure"
  - label: "Impress"
    description: "Showcase results — emphasis on metrics, visuals, and impact"
multiSelect: false
```

**After collecting answers:** Summarize back to the user in one sentence:
> "Got it — a [type] for [audience] to [motivation]. Let's figure out the look and feel."

---

## Phase 2: Branding & Visual Style

### Step 2.1: Check for Existing Brand

**If `.excalidraw/brand.md` was found in Phase 0:**

```
question: "I found your saved brand style. What would you like to do?"
header: "Brand"
options:
  - label: "Use saved brand (Recommended)"
    description: "Apply your existing colors, fonts, and tone"
  - label: "Start fresh"
    description: "Set up brand style from scratch"
multiSelect: false
```

If they choose "Use saved brand," skip to Phase 3.

### Step 2.2: Collect Brand Style (if no saved brand or starting fresh)

```
question: "How should I get your brand style?"
header: "Style source"
options:
  - label: "Scrape my website"
    description: "I'll extract colors, fonts, and tone from your URL"
  - label: "I'll describe it"
    description: "Tell me your colors, tone, and vibe"
  - label: "Use a clean default"
    description: "Professional blue/gray palette — looks good on everything"
  - label: "Match a reference"
    description: "Provide a screenshot or link and I'll match the style"
multiSelect: false
```

**Option A — Scrape website:**
1. Ask for the URL
2. Use `WebFetch` to extract: dominant colors, font style, tone (professional/playful/bold/minimal)
3. Present what you found: "Here's what I extracted from your site: primary color X, accent Y, tone Z. Does this look right?"
4. Adjust based on feedback

**Option B — Manual description:**
Ask with `AskUserQuestion`:
```
question: "What's your brand's visual tone?"
header: "Tone"
options:
  - label: "Professional"
    description: "Clean lines, muted colors, corporate feel"
  - label: "Playful"
    description: "Bright colors, rounded shapes, friendly vibe"
  - label: "Bold"
    description: "High contrast, strong colors, makes a statement"
  - label: "Minimal"
    description: "Lots of whitespace, subtle colors, elegant"
multiSelect: false
```

Then ask: "What's your primary brand color and an accent color? (e.g., '#1971c2 blue, #d97757 orange' — or just describe them like 'dark blue and coral')"

**Option C — Clean default:**
Use the built-in palette from `references/design-principles.md`. No further questions needed.

**Option D — Match reference:**
Ask the user to provide a screenshot or link. Extract the visual style and confirm.

### Step 2.3: Save Brand Config

After collecting brand info, save to `.excalidraw/brand.md`:

```markdown
# Brand Configuration

## Visual Identity
- Primary Color: #HEX (Name)
- Accent Color: #HEX (Name)
- Tone: Professional / Playful / Bold / Minimal
- Font Preference: Clean (fontFamily 2) / Hand-drawn (fontFamily 1)

## Source
- Origin: Website extraction / Manual / Preset / Reference match
- URL: (if applicable)

## Learned Preferences
<!-- Updated after each session -->

## Session History
<!-- Appended after each session -->

---
*Last updated: YYYY-MM-DDTHH:MM:SSZ*
```

Create the `.excalidraw/` directory if it doesn't exist.

---

## Phase 3: Content & Narrative Discovery

This is the core collaborative phase. It's a conversation, not a data dump.

### Step 3.1: Content Source

Ask the user:
> "Do you have content ready — notes, a transcript, an article, bullet points — or should we build the narrative together?"

**If content is provided:**
1. Read/analyze the content
2. Extract: core message, key points, data/examples, implied CTA
3. Present your understanding back: "Here's what I'm taking away from this — [summary]. Is this right, or should I adjust?"
4. Get confirmation before proceeding

**If no content — go to Step 3.2.**

### Step 3.2: Guided Content Interview

Ask in small groups (2-3 questions at a time). Never dump all questions at once.

**Group A:**
> "What's the core message? If the audience remembers ONE thing, what should it be?"
> "What are the 3-5 key points that support this message?"

**Group B:**
> "Any specific data, quotes, examples, or comparisons to include?"
> "What should the audience DO after seeing this? (your call to action)"

Synthesize their answers into a coherent content brief before continuing.

### Step 3.3: Narrative Arc Selection

Based on the content + intent from Phase 1, propose 2-3 narrative structures using `AskUserQuestion`:

```
question: "Which narrative flow fits your story best?"
header: "Structure"
options:
  - label: "Problem → Solution → Proof"
    description: "Start with the pain, show your fix, prove it works. Best for pitches."
  - label: "Before → After → How"
    description: "Show the old way vs. the new way, then explain the steps. Best for tutorials."
  - label: "What → Why → How"
    description: "Define the concept, explain why it matters, show how it works. Best for explainers."
  - label: "Status Quo → Tension → Resolution"
    description: "Build tension around a problem, then resolve it. Best for persuasion."
multiSelect: false
```

Only show arcs that make sense for their content type. If the user chose "Process / Architecture diagram" in Phase 1, you might offer:
- Linear Pipeline (Step 1 → Step 2 → Step 3)
- Hub & Spoke (Central system with connected components)
- Layered Architecture (Stack of layers with relationships)

### Step 3.4: Slide Outline (Collaborative)

Propose a slide sequence as a numbered list. For each slide, show:
- **Title** — what the slide says
- **Diagram type** — how it's visualized (from the Visual Vocabulary in `references/design-principles.md`)

Example:
```
Here's my proposed flow:

1. "The Problem" — Visual metaphor: heavy weight crushing down, red tones,
   one dominant shape showing the pain
2. "Why It Happens" — Tangled web radiating from a central knot, showing
   interconnected root causes (not a list of boxes)
3. "Our Solution" — Winding path from dark/cramped (left) to open/bright
   (right), showing the transformation journey
4. "The Results" — Giant "47%" as the visual anchor, with small supporting
   context around it. The number IS the slide.
5. "Next Steps" — Single bold shape with CTA, clean and spacious

Want to add, remove, or reorder anything?
```

**Important:** When proposing visual concepts, think ILLUSTRATION — describe what the slide would look like as a drawing, not which layout template to use. "Hub & spoke" or "2x2 grid" are fallbacks, not defaults.

Wait for the user to confirm or adjust before proceeding.

---

## Phase 4: Slide-by-Slide Co-Design

This is where slides get built. **One at a time.** For EACH slide:

### Step 4.1: Present the Visual Concept

Before generating any JSON, describe the plan as a **visual picture** — what would someone SEE, not what template you're using:

```
**[SLIDE 1: The Problem]**
**What you'll see:** A large, heavy dark shape dominates the center — it
feels oppressive, like a weight pressing down. Three smaller red shapes
are being crushed underneath it, each labeled with a specific pain point.
The visual immediately communicates "something is wrong and heavy."
**Shapes used:** Large ellipse (the problem), small compressed rectangles
(the pain points), downward arrows showing pressure
**Mood:** Tense, urgent — red/dark tones, high contrast
```

Describe the illustration, not the template. "Hub & spoke with 4 nodes" tells the user nothing about what they'll see. "A central sun with 4 planets orbiting at different distances" paints a picture.

### Step 4.2: Ask for Approval

```
question: "Does this visual approach work for Slide 1?"
header: "Slide 1"
options:
  - label: "Go ahead"
    description: "Build it as described"
  - label: "Try a different layout"
    description: "I'd prefer a different diagram type"
  - label: "Simpler"
    description: "Fewer elements, more whitespace"
  - label: "More detailed"
    description: "Add more information and visual elements"
multiSelect: false
```

### Step 4.3: Build the Slide

Once approved:

1. Read `references/element-reference.md` for JSON specs
2. Read `references/design-principles.md` for visual design philosophy
3. **CRITICAL — Think Illustration First:**
   - Before generating ANY elements, ask: "What visual SHAPE tells this story?"
   - Find the spatial metaphor: Does this concept expand, contract, branch, cycle, collide, radiate, layer, or flow?
   - Use the full shape palette: ellipses for organic concepts, diamonds for decision points, varying sizes for hierarchy, curved arrows for flows — NOT just rectangles
   - Think like someone sketching on a whiteboard: they'd draw circles, scribble arrows, make things big or tiny to show importance — not lay out a grid of cards
   - Cards and grids are a LAST RESORT for when items are truly homogeneous (feature lists, team members). For concepts, relationships, and stories, use illustrative layouts
4. Generate the slide elements:
   - Start with a frame rectangle at the slide's grid position
   - Apply brand colors from Phase 2
   - Follow the Outcome Thinking framework (Purpose → Transformation → Memory → Action)
   - Use shapes, size contrast, and spatial relationships to carry meaning — not text in boxes
   - Run the pre-generation checklist from design-principles.md

#### CRITICAL: Generate GroupIds First

Before building any slide, generate a unique groupId. All elements within a slide MUST share the same groupId.

```javascript
const slideGroupId = `slide${N}-group-${Math.random().toString(36).substr(2, 6)}`;
```

#### Multi-Slide Grid Positioning

```
Slide 1: x=0,    y=0      Slide 2: x=900,  y=0
Slide 3: x=0,    y=600    Slide 4: x=900,  y=600
Slide 5: x=0,    y=1200   Slide 6: x=900,  y=1200
```

Each slide occupies ~800x500px. Leave 100px gaps between slides.

### Step 4.4: Inject and Verify

Read `references/chrome-automation.md` for the full injection workflow.

After injecting:
- Take a screenshot to verify rendering
- Show the screenshot to the user: "Here's Slide N. How does it look?"

```
question: "How does Slide N look?"
header: "Review"
options:
  - label: "Looks great, next slide"
    description: "Move on to the next slide"
  - label: "Adjust colors/style"
    description: "The layout is fine but the colors or styling need tweaking"
  - label: "Redo layout"
    description: "The visual approach isn't working — try a different diagram type"
  - label: "Edit text/content"
    description: "The visuals are fine but the text needs changes"
multiSelect: false
```

Iterate until approved, then proceed to the next slide.

### Repeat Steps 4.1–4.4 for every slide in the outline.

---

## Phase 5: Chrome Extension & Delivery

### Step 5.1: Verify Chrome Extension

This skill uses the **Claude in Chrome** extension to inject slides directly into excalidraw.com.

1. Check if extension is available using `tabs_context_mcp`
2. If NOT available, tell the user:
   > To inject slides into Excalidraw, please install the Claude in Chrome extension:
   > https://chromewebstore.google.com/detail/claude-in-chrome/anthropic
   >
   > Once installed, restart Chrome and try again.
   >
   > Alternatively, I can save slides as .excalidraw JSON files you can import.

3. If available, proceed with injection per `references/chrome-automation.md`

**Note:** Chrome extension check can happen earlier in the flow (during Phase 4 when first slide is ready). Don't block the collaborative design phases on extension availability.

### Step 5.2: Final Review

After all slides are injected:

> "All slides are on the canvas. Want to adjust any slide before we finalize?"

If the user wants changes, go back to Phase 4 for the specific slide.

### Step 5.3: Delivery Options

If Chrome extension isn't available, save the complete presentation:
- As `.excalidraw` JSON file in the working directory
- Inform the user: "Saved to `presentation-name.excalidraw` — open it in excalidraw.com via File → Open."

---

## Phase 6: Learn & Save

### Step 6.1: Update Brand Config

Update `.excalidraw/brand.md` with any style preferences learned during the session:

- If the user adjusted colors, save the preferred ones
- If they consistently chose a diagram style, note it
- If they preferred simpler or richer slides, record that

### Step 6.2: Append Session History

Add an entry to the Session History section of `.excalidraw/brand.md`:

```markdown
## Session History

### YYYY-MM-DD — [Presentation Title]
- Type: Pitch deck for investors
- Slides: 6
- Style notes: Preferred minimal layouts, liked hub & spoke for architecture
- Adjustments: Made Slide 3 simpler, changed accent from orange to teal
```

### Step 6.3: Wrap Up

> "Your presentation is ready! Here's a summary of what we built:
> - [N] slides using [narrative arc]
> - Brand config saved to `.excalidraw/brand.md`
> - [File location or 'injected into excalidraw.com']"

---

## Quick Reference

### Chrome Clipboard Injection Pattern

```javascript
(async () => {
  const elements = [ /* slide elements here */ ];
  const clipboardData = {
    type: "excalidraw/clipboard",
    elements: elements,
    files: {}
  };
  await navigator.clipboard.writeText(JSON.stringify(clipboardData));
  return "Slide ready";
})()
```

Then paste with `cmd+v` (Mac) or `ctrl+v` (Windows/Linux).

### Default Color Palette

| Purpose | Light | Dark |
|---------|-------|------|
| Primary/Blue | #a5d8ff | #1971c2 |
| Success/Green | #b2f2bb | #2f9e44 |
| Warning/Yellow | #fff3bf | #f08c00 |
| Danger/Red | #ffc9c9 | #e03131 |
| Neutral/Gray | #e9ecef | #495057 |
| Text | — | #1e1e1e |
| Accent/Orange | — | #d97757 |

These are overridden by brand colors from Phase 2 when available.

### Fonts

- `1` = Virgil (hand-drawn, casual)
- `2` = Helvetica (clean, professional — **default for presentations**)
- `3` = Cascadia (code/monospace)
