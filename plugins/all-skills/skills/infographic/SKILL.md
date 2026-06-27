---
name: infographic
description: Generate professional infographics using Nano Banana MCP (Gemini AI image generation). Follows a guided flow — analyze content, suggest visualizable concepts, propose visualization approaches, then generate on-brand images. USE THIS SKILL WHEN user says "create infographic", "make a visual", "design an infographic", "generate infographic", wants to visualize a concept, framework, or data for social media, mentions "LinkedIn post", "visual content", "infographic series", asks to explain a concept visually or create a diagram-style image, mentions "visual metaphor", "iceberg diagram", "pyramid", "funnel visualization", wants to generate images with Gemini for informational content, or says "brand visuals", "social media graphics", "thought leadership visual".
  - User mentions "nano banana", "gemini image generation", "professional infographics"
---

# Infographic Generation Skill

Create professional infographics and editorial illustrations using Gemini AI via the Nano Banana MCP server. This skill follows a strict interactive process — never skip ahead without user approval at each step.

**Core philosophy:** The quality of the output is determined by the quality of the thinking BEFORE any prompt is written. Spend 70% of the effort understanding what to visualize and 30% on how to visualize it.

---

## When This Skill Loads (DO THIS IMMEDIATELY)

1. Read `references/design-principles.md` (brand philosophy, content analysis, style discovery — internalize deeply)
2. Read `references/gemini-image-api.md` (MCP tool reference + prompt vector system)
3. Read `references/api-setup.md` (API key setup guide)
4. Execute Phase 0 (silent config check)
5. **If API key is NOT configured in Phase 0:**
   - Skip directly to Phase 4 (API Key Setup)
   - Do NOT proceed to Phase 1
   - Do NOT ask about content
6. **If API key IS configured:**
   - Begin Phase 1

---

## Phase 0: Silent Config Check

Run silently — do NOT ask questions yet.

### 0.1: Ensure Directory Structure

```bash
mkdir -p .infographic/images
mkdir -p .infographic/prompts
```

### 0.2: Check for API Key

Check if the GEMINI_API_KEY exists. Check BOTH the environment variable AND the `.env` file:

```bash
# Check environment variable first, then .env file
if [ -n "$GEMINI_API_KEY" ]; then
  echo "API key found in environment"
elif [ -f .env ] && grep -q "^GEMINI_API_KEY=.\+" .env; then
  echo "API key found in .env file"
else
  echo "API key not configured"
fi
```

**Why check both?** The MCP server uses `dotenv` to load `.env` automatically at startup. So even if the bash shell doesn't have the env var set, the MCP server reads it from `.env` directly. If the key exists in `.env`, the MCP server has it.

**CRITICAL DECISION POINT:**
- If found (in env var OR `.env` file): Proceed silently to Phase 1
- If NOT found in either: **IMMEDIATELY jump to Phase 4 (API Key Setup)**
  - Do NOT proceed to Phase 1
  - Do NOT ask about content
  - Do NOT try to generate
  - Go directly to Phase 4 to get the API key from the user

**Note:** Do NOT use `get_configuration_status` MCP tool - it gives false positives.

### 0.3: Check for Brand Config

```bash
if [ -f .infographic/brand.md ]; then
  cat .infographic/brand.md
fi
```

If brand config exists, acknowledge briefly:
```
I found your saved settings. Ready to create your infographic!
```

If nothing exists, proceed to Phase 1.

---

## Phase 1: Deep Content Interrogation

**Goal:** Understand the content at the DEEPEST level — not what happened, but what it CLAIMS is true about the world. This is the most important phase. If you get this wrong, everything downstream is wasted effort.

### 1.1: The Four-Layer Analysis

Read the user's content. Then extract meaning at ALL four layers:

```
LAYER 1 — NARRATIVE: What happened?
(Events, timeline, biography, sequence of actions)
→ Almost never the right thing to visualize

LAYER 2 — THEMES: What is it about?
(Growth, struggle, identity, change, ambition)
→ Better, but still abstract and leads to generic metaphors

LAYER 3 — CLAIMS: What does it SAY is true about the world?
(Universal truths, philosophical statements, hard-won insights)
→ This is where editorial illustrations live
→ Example: "When the suffering is something you chose, you can work with it.
   When it's something that happened to you, it just eats you."

LAYER 4 — INFORMATION: What concrete data, comparisons, or frameworks exist?
(Numbers, scorecards, before/after, checklists, structures)
→ This is where information graphics live
→ Example: "Developer: 2 strengths, 4 gaps. Domain Expert: 6 strengths, 0 gaps."
```

Present your analysis explicitly labeled by layer. Be honest about which layers are strong and which are weak for this particular content.

### 1.2: The Design Brief Question

Use `AskUserQuestion`:

```
question: "What should a viewer GET from this visual in 2 seconds?"
header: "Intent"
options:
  - label: "Feel something"
    description: "An emotional hit — recognition, discomfort, inspiration. They stop scrolling because it resonates."
  - label: "Learn something"
    description: "A concrete fact, comparison, or framework. They save it because it's useful."
  - label: "Both"
    description: "An emotional hook with concrete information backing it up."
```

This answer determines EVERYTHING downstream:
- "Feel something" → Editorial Illustration path
- "Learn something" → Information Graphic path
- "Both" → Hybrid path

### 1.3: Platform

Use `AskUserQuestion`:

```
question: "Where will this be posted?"
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
```

---

## Phase 1.5: Output Mode Decision

**Goal:** Lock in the output type BEFORE any visual thinking. Editorial Illustration and Information Graphic are fundamentally different outputs. Never confuse them.

| Mode | When | What it looks like | Text density |
|------|------|-------------------|-------------|
| **Editorial Illustration** | Viewer should FEEL something | Cinematic scenes, surreal compositions, visual metaphors embodied as scenes | Minimal — one powerful line |
| **Information Graphic** | Viewer should LEARN something | Scorecards, checklists, charts, comparisons, frameworks | Moderate — structured data with labels |
| **Hybrid** | Both feel and learn | Editorial visual with minimal data overlay | Low — headline + key data points |

Present the mode recommendation based on Phase 1 answers, then confirm with user:

```
question: "Based on your content, I recommend [mode]. Does this feel right?"
header: "Output"
options:
  - label: "Editorial Illustration"
    description: "Art that embodies a truth. Quiet, cinematic, the scene IS the message."
  - label: "Information Graphic"
    description: "Structured data visual. Scannable, useful, saves-worthy."
  - label: "Hybrid"
    description: "Emotional hook + concrete data. Best of both."
```

---

## Phase 1.75: Style Discovery

**ONLY for Editorial Illustration or Hybrid mode.** If the user chose Information Graphic, SKIP this phase entirely — use the BenAI brand system (hard shadows, cream background, accent colors).

**Goal:** Find the visual world that matches the content's emotional register. Style should come from the content's tone, not from a default template.

Use `AskUserQuestion`:

```
question: "What visual world should this live in?"
header: "Style"
options:
  - label: "European editorial / Adult Swim"
    description: "Moebius linework, [as] bumps aesthetic. Quiet, existential, contemplative. Muted warm tones."
  - label: "Graphic novel / comic panel"
    description: "Bold confident linework, sequential framing. Hergé, Chris Ware. Clear and deliberate."
  - label: "Risograph / analog print"
    description: "Paper grain, muted palette, slight imperfections. Tactile, warm, human. Zine energy."
  - label: "Minimalist conceptual"
    description: "Single powerful image. New Yorker cover energy. One visual that says everything."
```

**If the user describes a different style entirely** (they often will — and that's good), use their description. The options above are starting points, not constraints. See `design-principles.md` Section 4 for additional style anchors including "Vintage science / technical" (best for analytical, system-breakdown content).

Save the chosen style for prompt construction in Phase 5.

---

## Phase 2: Concept Extraction

**Goal:** Extract the 3-4 strongest concepts at the CORRECT layer (determined in Phase 1). Do NOT visualize the entire post. Pick the single most powerful piece.

### For Layer 3 / Editorial Illustration:

Extract the content's strongest **philosophical claims** — universal truths stated or implied. Present each as a one-sentence truth statement, NOT a topic label.

```
BAD: "The journey from small town to big city"
GOOD: "When the suffering is something you chose, you can work with it.
       When it's something that happened to you, it just eats you."

BAD: "Overcoming failure"
GOOD: "The fear of picking wrong is worse than the exhaustion of doing all of it badly."

BAD: "Finding your own path"
GOOD: "Nobody told me I couldn't go this fast. So I didn't know I wasn't supposed to."
```

### For Layer 4 / Information Graphic:

Extract the content's strongest **information structures** — concrete comparisons, frameworks, or data. Present each as a data shape.

```
BAD: "Domain experts vs. developers"
GOOD: "Developer: 2 advantages (code, architecture), 4 gaps (business problem, copy,
       context, prompting). Domain Expert: 6 advantages, 0 gaps. Visual: side-by-side
       scorecard where green checks vs. red X's make the winner obvious."

BAD: "Steps to build with AI"
GOOD: "3-step framework: Know the problem → Prompt the solution → Ship it.
       Visual: vertical flow with numbered steps."
```

Present 3-4 extracted concepts, then use `AskUserQuestion` (use the actual claims or data shapes as labels, not topic names):

```
question: "Which of these should we visualize?"
header: "Concept"
options:
  - label: "[First few words of claim/data shape]"
    description: "[Why this is the strongest visual candidate]"
  - label: "[First few words of claim/data shape]"
    description: "[Why this is a strong visual candidate]"
  - label: "[First few words of claim/data shape]"
    description: "[Why this is a strong visual candidate]"
```

**Never proceed without their selection.**

---

## Phase 3: Visualization Design

**Goal:** Design the visual. The approach depends entirely on the output mode.

### For Editorial Illustration:

Propose 3 **visual scenes** — not layout types. Each proposal should be cinematic and specific:

- **The scene:** What is physically in the image? Describe it like a film shot.
- **The emotional register:** What does the viewer FEEL looking at it?
- **The focal composition:** Where does the eye go first? What's the visual hierarchy?
- **The 2-second hit:** What does someone scrolling past GET instantly?

```
EXAMPLE:
"Two rooms sharing one wall. LEFT: A cramped room — a figure hunched at a desk,
being consumed by towering stacks of papers and obligations. The walls are closing in.
Cracks on the walls. RIGHT: A vast, empty room — the same figure standing upright in
open space. Nothing around them. A doorway with warm light on the far wall. The crack
in the dividing wall says: you could move. 2-second hit: 'I've been in both rooms.
Which one am I in right now?'"
```

DO NOT propose abstract layout types ("pyramid," "iceberg," "Venn diagram") for editorial illustration. Propose SCENES.

Use `AskUserQuestion` with the 3 scene proposals.

### For Information Graphic:

Propose 3 **data visualization approaches** — not metaphors. Each proposal should specify:

- **The format:** Scorecard, checklist, chart, comparison grid, numbered steps
- **What data goes where:** Exact mapping of content to visual elements
- **What the viewer LEARNS in 1 second:** The concrete takeaway
- **Why this format:** Why this structure fits the data shape

```
EXAMPLE:
"Side-by-side scorecard. Two columns: 'Developer' and 'Domain Expert.' Each column
has 6 rows with checkmarks (green) or X marks (red). Developer: 2 green, 4 red.
Domain Expert: 6 green, 0 red. The visual winner is obvious before reading any text.
Below: a quote block and a bold bottom-line CTA."
```

DO NOT propose metaphorical or artistic approaches for information graphics. Propose DATA STRUCTURES.

Use `AskUserQuestion` with the 3 data visualization proposals.

### After Selection: Content Mapping

Once the user chooses, map their SPECIFIC content to the chosen structure. Show exactly:
- What text appears where
- How the visual hierarchy works
- What the focal point is

Confirm mapping with `AskUserQuestion`:

```
question: "Does this content mapping look right?"
header: "Mapping"
options:
  - label: "Yes, looks good"
    description: "Proceed to the 2-second check"
  - label: "Adjust the mapping"
    description: "I'll tell you what to change"
  - label: "Try a different approach"
    description: "Go back and pick another visualization"
```

---

## Phase 3.5: The 2-Second Gut Check

**CRITICAL. Do not skip this.** Before writing any prompt, explicitly answer this question out loud:

> "A person scrolling LinkedIn sees this image for exactly 2 seconds. What do they GET?"

Write the answer in ONE sentence.

**For Editorial Illustration:**
"They feel [specific emotion] and stop scrolling because [specific reason]."

Example: "They feel a jolt of recognition — they've been in both rooms — and stop because the image names something they've been living but couldn't articulate."

**For Information Graphic:**
"They learn [specific fact] and think 'I should save this.'"

Example: "They learn that domain experts have 6 advantages over developers in the AI era, and think 'I should save this comparison.'"

**If you can't write this sentence clearly, the concept isn't ready.** Go back to Phase 3.

Present this to the user for confirmation. If they agree the 2-second hit is right, proceed to prompt.

---

## Phase 4: API Key Setup

**Goal:** Ensure the Gemini API key is configured in the Nano Banana MCP server.

### 4.1: Check for API Key

Before generating, check if the GEMINI_API_KEY exists in the environment or `.env` file:

```bash
if [ -n "$GEMINI_API_KEY" ]; then
  echo "API key found in environment"
elif [ -f .env ] && grep -q "^GEMINI_API_KEY=.\+" .env; then
  echo "API key found in .env file"
else
  echo "API key not configured"
fi
```

### If Key IS Found (env var OR .env file) → Skip to Phase 5

The MCP server uses `dotenv` to load `.env` automatically. If the key is in `.env`, the MCP server has it.

### If Key NOT Found in Either

Ask the user how they want to proceed:

Use `AskUserQuestion`:

```
question: "I need a Gemini API key to generate the image. How do you want to proceed?"
header: "API Key"
options:
  - label: "Set it up now (Recommended)"
    description: "I'll guide you through getting a free key from Google AI Studio"
  - label: "I have a key ready"
    description: "Let me paste it"
  - label: "Skip for now"
    description: "Just give me the prompt to use elsewhere"
```

### Path A: Set Up Now (Guided Setup)

Present these instructions:

```
To get your free Gemini API key:

1. Go to Google AI Studio: https://aistudio.google.com
2. Sign in with your Google account
3. Click "Get API Key" in the left sidebar
4. Click "Create API Key" and select a project (or create a new one)
5. Copy the generated key (starts with "AIza...")

Paste your API key below when ready.
```

Wait for user to provide the key, then proceed to **Save the Key**.

### Path B: User Has Key Ready

```
Great! Paste your Gemini API key below.
```

Wait for user to provide the key, then proceed to **Save the Key**.

### Save the Key (After Path A or B)

Once user provides the key:

1. **Save to `.env` file:**
```bash
# Create .env if it doesn't exist
if [ ! -f .env ]; then
  cat > .env <<'EOF'
# BenAI Skills - API Keys Configuration

# ============================================================================
# Marketing Plugin
# ============================================================================

# GEMINI_API_KEY - Required for /infographic skill
GEMINI_API_KEY=

# GEMINI_IMAGE_MODEL - Optional, defaults to gemini-2.5-flash-image
# Options: gemini-3-pro-image-preview (highest quality, up to 4K), gemini-2.5-flash-image (fast)
GEMINI_IMAGE_MODEL=gemini-3-pro-image-preview

# APIFY_TOKEN - Required for /seo-audit and /programmatic-seo skills
APIFY_TOKEN=

EOF
fi

# Update the GEMINI_API_KEY line
sed -i '' "s|^GEMINI_API_KEY=.*|GEMINI_API_KEY=[user-provided-key]|" .env

# Add .env to .gitignore for security
echo ".env" >> .gitignore 2>/dev/null || true
```

2. **Confirm to user and EXIT THE SKILL:**
```
API key saved to .env!

Please restart Claude Code so the MCP server can load your new key.

The Nano Banana MCP server uses dotenv to read .env automatically at startup.
After restart, your key will be loaded and ready.

Steps:
1. Restart Claude Code
2. Run /infographic again
3. It will work!
```

**CRITICAL:** After showing this message, the skill MUST EXIT. Do NOT:
- Call `configure_gemini_token` MCP tool (creates unwanted .nano-banana-config.json)
- Call `get_configuration_status` MCP tool (gives false positives)
- Proceed to generation
- Continue the workflow in any way

The MCP server needs to restart to load .env via dotenv. Exit the skill now.

### Path C: Skip for Now

```
No problem! I'll complete all the planning phases and give you a ready-to-use prompt at the end.

You can then:
- Paste it into Google AI Studio (aistudio.google.com)
- Use it with other image generation tools
- Come back later with /infographic after getting your API key

Let's continue with the design...
```

In this mode, complete all phases normally, but in Phase 5.3, save the prompt to `.infographic/prompts/[topic]-prompt.md` instead of generating.

---

## Phase 5: Prompt Architecture

**Goal:** Craft a detailed prompt using the correct architecture for the output mode. The prompt structure is DIFFERENT for editorial illustrations vs. information graphics.

### 5.1: Craft the Prompt

**EDITORIAL ILLUSTRATION prompt structure:**

```
1. STYLE ANCHOR
   Specific reference artists/movements from Phase 1.75.
   "A [aspect ratio] editorial illustration in the style of [chosen style anchors]"

2. EMOTIONAL REGISTER
   How the image should feel.
   "Quiet, contemplative, quietly existential" OR "bold, unflinching, demands attention"

3. THE SCENE
   Cinematic description of the image. This is the longest section.
   Describe what's physically in the frame: figures, rooms, objects, spatial relationships.
   Be specific and visual — not conceptual.

4. SPATIAL COMPOSITION
   How the eye moves through the image.
   What's large, what's small. Where the focal weight sits.

5. TEXTURE & MATERIALITY
   Paper grain, ink quality, print feel.
   "Subtle paper grain texture like quality stock, feels printed not digital"
   "Confident ink linework, like it was drawn with a technical pen"

6. COLOR PALETTE
   Derived from the content's tone AND the chosen style.
   For warm content: "dusty warm tones — cream, muted ochre, soft sage, warm gray"
   ALWAYS: "NO black backgrounds. Everything warm and analog."

7. TEXT ELEMENTS
   Minimal. The one line that hits. Where it appears.
   "At the bottom, in clean hand-lettered text: '[the line]'"

8. WHAT NOT TO DO (explicit negatives)
   "Not cartoonish, not hyperreal. Not corporate. Not clipart."

9. TECHNICAL
   "Footer at the very bottom in small, clean sans-serif: 'Ben Van Sprundel | Founder @ BenAI'"
   "Output as a [aspect ratio] image at approximately 2048 pixels wide."
```

**INFORMATION GRAPHIC prompt structure:**

```
1. FORMAT DECLARATION
   "A clean, bold, modern [aspect ratio] infographic for LinkedIn."
   "NOT an illustration or metaphor — this is an INFORMATION GRAPHIC."

2. INFORMATION HIERARCHY
   What the viewer reads first, second, third.
   "TITLE (top, large, bold) → MAIN VISUAL (center) → QUOTE (below) → CTA (bottom)"

3. DATA VISUALIZATION
   Exact layout. Columns, rows, checkmarks, comparisons.
   Every visual element described with its content.
   This section should be the most detailed.

4. EXACT TEXT
   Every single word that appears in the image, verbatim.
   Leave nothing for the AI to invent.

5. BRAND SYSTEM
   "Background: warm cream (#FAF3E3). NEVER black."
   "Cards: solid 2px dark borders (#020309), slightly rounded corners, bold hard shadows (8px right, 8px down, 0 blur, pure black)"
   "Accent colors: green (#D2ECD0) for positive, red/pink (#F3C1C0) for negative, yellow (#FDEEC4) for highlights"
   "Typography: Bold modern sans-serif for headings. Clean readable sans for body."

6. DENSITY CONTROL
   "Generous whitespace between every section."
   "This should feel like a premium magazine spread, not a packed data sheet."
   "Each checklist row needs breathing room — generous padding above and below."

7. SCANABILITY
   "The image should be scannable in 1-2 seconds. Instantly readable. No decoding required."

8. TECHNICAL
   "Footer: 'Ben Van Sprundel | Founder @ BenAI'"
   "Output as a [aspect ratio] image at approximately 2048 pixels wide."
```

### 5.2: Show Prompt for Approval

```
Here's the prompt I'll use:

---
[Full prompt text]
---
```

Use `AskUserQuestion`:

```
question: "Ready to generate with this prompt?"
header: "Prompt"
options:
  - label: "Yes, generate"
    description: "Looks good, go ahead"
  - label: "Tweak the prompt"
    description: "I want to adjust something before generating"
  - label: "Start over"
    description: "Go back to concept selection"
```

### 5.3: Generate

For Editorial Illustration — use the `aspectRatio` parameter that matches:
```
Call tool: generate_image
Parameters: { "prompt": "[approved prompt]", "aspectRatio": "[ratio]" }
```

For Information Graphic — use the `aspectRatio` parameter that matches:
```
Call tool: generate_image
Parameters: { "prompt": "[approved prompt]", "aspectRatio": "[ratio]" }
```

| Platform | aspectRatio param | Also embed in prompt |
|----------|------------------|---------------------|
| LinkedIn | "4:5" | "Output as a 4:5 portrait aspect ratio image at approximately 2048 pixels wide" |
| Instagram (square) | "1:1" | "Output as a 1:1 square aspect ratio image at approximately 2048 pixels wide" |
| Twitter/Presentation | "16:9" | "Output as a 16:9 landscape aspect ratio image at approximately 2048 pixels wide" |

### 5.4: Copy and Display (CRITICAL)

```bash
mkdir -p .infographic/images
cp "./generated_imgs/[returned-filename]" ".infographic/images/[topic-slug]-v1.png"
```

**IMMEDIATELY display to user using Read tool:**
```
Read file: .infographic/images/[topic-slug]-v1.png
```

The user MUST see the image to give feedback.

### If No API Key (Skip Path)

Save the prompt to `.infographic/prompts/[topic]-prompt.md` with manual instructions:
```
To generate:
1. Go to aistudio.google.com
2. Select "Gemini" model
3. Paste the prompt
4. Click Generate
5. Download the image
```

---

## Phase 6: Review & Iterate

**Goal:** Iterate until the user is happy. Use DIAGNOSTIC questions, not generic ones.

### 6.1: The Diagnostic Question

After showing the image, ask the REAL question:

```
question: "Looking at this for 2 seconds as a stranger — what do you GET?"
header: "Reaction"
options:
  - label: "The right thing — it hits"
    description: "The message lands. Maybe small tweaks but the core is right."
  - label: "Right direction, wrong execution"
    description: "I get the concept but something about the image isn't working."
  - label: "The wrong thing"
    description: "The concept isn't transmitting. Need to rethink the visual."
  - label: "Nothing — it's not clear"
    description: "Can't tell what this is saying in 2 seconds."
```

**If "The right thing"** → Ask about specific tweaks, then proceed to edit.
**If "Right direction, wrong execution"** → Drill into WHAT isn't working (see 6.2).
**If "The wrong thing" or "Nothing"** → The concept is broken. Go back to Phase 3. Do NOT try to fix a broken concept with edits.

### 6.2: Specific Feedback

Only reach this if the direction is right but execution needs work.

Use `AskUserQuestion` with multiSelect:

```
question: "What specifically isn't working?"
header: "Changes"
multiSelect: true
options:
  - label: "Doesn't look like pain/joy/etc"
    description: "The emotional register is wrong — the image doesn't FEEL right"
  - label: "Too cramped / needs whitespace"
    description: "Elements are too close together, not enough breathing room"
  - label: "Text issues"
    description: "Wording, size, placement, readability, typos"
  - label: "Style is off"
    description: "The visual language doesn't match what I described"
```

Drill down on each selection to get specifics before editing.

### 6.3: Apply Edits

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
1. Copy from `./generated_imgs/[returned-filename]` to `.infographic/images/[topic]-v[N].png`
2. Display using Read tool
3. Ask if changes are correct

Repeat until user approves. Save final version as `[topic]-final.png`.

---

## Phase 7: Wrap Up

```
Your infographic is ready!

Saved to:
.infographic/images/[topic]-final.png

Want to visualize another concept from your content? (I had [N] other suggestions from Phase 2.)
```

If yes → return to Phase 2 with the next chosen concept.

---

## Brand Guidelines (For Information Graphics)

**These apply to Information Graphics. Editorial Illustrations follow the style discovered in Phase 1.75.**

### Colors

| Role | Color | Hex |
|------|-------|-----|
| Primary text | Dark | #020309 |
| Light backgrounds / text on dark | Light yellow | #FAF3E3 |
| Subtle backgrounds | Light blue | #E5F5F9 |
| Primary accent (positive) | Green | #D2ECD0 |
| Secondary accent (negative/warm) | Red/pink | #F3C1C0 |
| Tertiary accent (highlight) | Dark yellow | #FDEEC4 |

**NEVER use black (#000000) as a background color.** This applies to ALL output modes.

### Typography

| Element | Font | Fallback |
|---------|------|----------|
| Headings (24pt+) | Space Grotesk | Montserrat → Arial |
| Body text | Montserrat | Georgia |

### Shape & Accent Styling

| Property | Rule |
|----------|------|
| Shadows | **Solid / hard shadows only** — 0 blur (`8px, 8px, 0px #000`) |
| Borders | **Solid borders** — 2px width |
| Border radius | **Slightly rounded** — must NOT look fully round |
| Accent colors | Cycle through yellow (#FDEEC4), blue (#E5F5F9), and green (#D2ECD0) |

### Footer

Always include: `"Ben Van Sprundel | Founder @ BenAI"`

---

## File Naming

| Stage | Pattern | Example |
|-------|---------|---------|
| First version | `[topic]-v1.png` | `chosen-pain-v1.png` |
| After edits | `[topic]-v2.png` | `chosen-pain-v2.png` |
| Final | `[topic]-final.png` | `chosen-pain-final.png` |
| Series | `[topic]-01-v1.png` | `tips-01-v1.png` |
| Prompts | `[topic]-prompt.md` | `.infographic/prompts/tips-prompt.md` |

---

## Directory Structure

```
.infographic/
├── brand.md           # Saved brand config (optional, for overrides)
├── images/            # All generated infographics
│   ├── topic-v1.png
│   ├── topic-v2.png
│   └── topic-final.png
└── prompts/           # Saved prompts (for no-key fallback)
    └── topic-prompt.md
```

---

## Important Rules

1. **Interrogate before designing.** Spend more time understanding what the content CLAIMS than designing how it looks. The visual flows from the claim, not the other way around.
2. **Visualize claims, not stories.** Layer 3 (philosophical claims) and Layer 4 (information structures) produce good visuals. Layer 1 (narrative) and Layer 2 (themes) produce mediocre ones.
3. **Decide the output mode before anything else.** Editorial Illustration and Information Graphic are fundamentally different outputs. Never confuse them.
4. **Apply the 2-second test BEFORE designing.** If you can't state what the viewer gets in 2 seconds, the concept isn't ready. Go back.
5. **Use style anchors, not abstract descriptors.** "Moebius meets Adult Swim" beats "clean modern illustration" every time. Reference specific artists, movements, and aesthetic traditions.
6. **For information graphics: NO metaphors.** Charts, scorecards, checklists. Pure information transmission. The viewer should LEARN something, not decode something.
7. **For editorial illustrations: the scene IS the message.** Don't illustrate a concept — create a scene that embodies the truth. "Two rooms sharing a wall" IS the claim about chosen vs. inherited pain.
8. **Whitespace is non-negotiable.** Every generated image should feel like a premium magazine spread. If anything feels cramped, there's too much in it. When in doubt, remove elements.
9. **Ask "what should the viewer FEEL or KNOW?" not "what should we visualize?"** The first question leads to good output. The second leads to decoration.
10. **Brand guidelines are for Information Graphics. Discovered style is for Editorial Illustrations.** The BenAI brand system (hard shadows, cream, accents) powers data visuals. For editorial art, the content's emotional register and the user's taste dictate the style.
11. **Edit, don't regenerate** — Use `edit_image`/`continue_editing` for execution tweaks. Only regenerate with `generate_image` when the concept itself is wrong.
12. **Always include footer** — "Ben Van Sprundel | Founder @ BenAI"
13. **If the concept is broken, no amount of editing fixes it.** When the 2-second test fails after generation, go back to Phase 3 — don't iterate on a fundamentally wrong visual.
14. **NEVER use black backgrounds** — Use #FAF3E3 (light yellow) or content-appropriate warm tones. This applies to ALL output modes.
