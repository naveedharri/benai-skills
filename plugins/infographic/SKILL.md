---
name: infographic
description: Generate professional LinkedIn-style infographics using Gemini AI image generation. Uses a guided, conversational flow with section-by-section validation, style discovery, multi-turn image editing, and learned preferences that improve over sessions.
  USE THIS SKILL WHEN - User says "create infographic", "make a visual", "design an infographic", "generate infographic" - User wants to visualize a concept, framework, or data for social media - User mentions "LinkedIn post", "visual content", "carousel", "infographic series" - User asks to explain a concept visually or create a diagram-style image - User mentions "visual metaphor", "iceberg diagram", "pyramid", "funnel visualization" - User wants to generate images with Gemini/Nano Banana for informational content - User says "brand visuals", "social media graphics", "thought leadership visual" - User mentions "nano banana", "gemini image generation", "professional infographics"
---

# Infographic Generation Skill

A guided, conversational approach to creating professional infographics. Uses section-by-section validation, style discovery, and learned preferences to create visuals that improve over sessions.

---

## When This Skill Loads (DO THIS IMMEDIATELY)

Follow these steps in order **before** responding to the user:

### Step 1: Read Reference Files

Read these files NOW (use Read tool):

```
1. references/visual-reasoning.md (HOW TO THINK about visualizations - READ THIS FIRST)
2. references/visual-metaphors.md (12+ metaphor types, selection guide)
3. references/gemini-image-api.md (API, models, multi-turn editing)
4. references/style-guide.md (visual style rules, color systems, layouts)
5. references/prompt-engineering.md (prompt crafting for infographics)
6. references/style-presets.md (preset palettes for quick style selection)
7. references/pattern-bank.md (learned preferences schema)
8. references/image-editing.md (multi-turn editing workflow)
9. references/api-setup.md (API key setup guide)
```

### Step 2: Execute Phase 0 (Auto-Load Config)

This phase runs silently. See Phase 0 below.

### Step 3: Begin Phase 1

After Phase 0 completes, start the guided conversation with Phase 1.

**Summary:** READ FILES → AUTO-LOAD CONFIG (Phase 0) → START PHASE 1

---

## Workflow: 9 Phases

### Phase 0: Auto-Load Config (Silent)

**Goal:** Check for existing configurations and external context. Load silently. Do NOT ask questions yet.

#### 0.1: Ensure Directory Structure Exists

```bash
# Create the infographic workspace if it doesn't exist
mkdir -p .infographic/images
mkdir -p .infographic/prompts
```

**Directory structure:**
```
.infographic/
├── brand.md           # Brand config (Markdown, human-readable)
├── images/            # All generated infographics
│   ├── topic-name-v1.png
│   ├── topic-name-v2.png
│   └── topic-name-final.png
└── prompts/           # Saved prompts (for no-key fallback or reuse)
    └── topic-name-prompt.md
```

#### 0.2: Check for External Context (Product/Marketing)

```bash
# Check for existing product/marketing context that might have brand info
if [ -f .claude/product-marketing-context.md ]; then
  cat .claude/product-marketing-context.md
fi
```

If this file exists, extract:
- Company name, industry, target audience
- Brand voice/tone
- Any color/style preferences mentioned
- Product positioning or key messages

This context can pre-fill answers and skip redundant questions.

#### 0.3: Check for API Key

```bash
# Check for .env with API key
if [ -f .env ]; then
  source .env 2>/dev/null
fi

# Verify API key
echo "${GEMINI_API_KEY:+API key is set}"
```

#### 0.4: Check for Brand Config (Markdown)

```bash
# Check for saved brand config
if [ -f .infographic/brand.md ]; then
  cat .infographic/brand.md
fi
```

The brand config is a **Markdown file** (not JSON) that contains everything needed for decisions:

```markdown
# Brand Configuration

## Identity
- **Company**: Acme Corp
- **Industry**: B2B SaaS
- **Target Audience**: Marketing managers, 30-50, enterprise

## Visual Aesthetics
- **Primary Color**: #2563EB (Professional Blue)
- **Accent Color**: #F59E0B (Amber)
- **Background**: Light (#FAFAFA)
- **Font Style**: Clean sans-serif
- **Visual Tone**: Professional & clean

## Quality Preferences
- **Default Resolution**: 2K (2048px width)
- **Preferred Platform**: LinkedIn (4:5)

## Learned Patterns
- **Title Style**: Bold & large
- **Text Density**: Minimal (3-5 labels)
- **Icon Usage**: Yes, simple line icons
- **Whitespace**: Generous (40%+)
- **Common Metaphors**: Iceberg, Timeline, Pyramid

## Session History
- 2024-01-15: Created iceberg infographic, liked bold title, made colors warmer
- 2024-01-20: Created timeline, preferred minimal text

---
*Last updated: 2024-01-20*
*Source: Website extraction from acme.com*
```

**Based on what you find:**

**If external context exists:**
```
I found your product context file. I'll use this to:
- Pre-fill brand/style questions
- Understand your target audience
- Match your existing voice/tone

You can override any of this as we go.
```

**If brand.md exists, acknowledge briefly:**
```
I found your saved settings in .infographic/brand.md:
- Brand: [Company Name] — [primary/accent colors]
- Resolution: [default resolution]
- Style: [tone, title style, text density]
- Learned patterns: [2-3 key preferences]

Ready to create your infographic!
```

**If no configs exist, just proceed to Phase 1** — you'll collect what you need through the guided flow.

**Output:** Silent config load. Brief acknowledgment if configs found, then proceed to Phase 1.

---

### Phase 1: Understand the Content (1-2 questions)

**Goal:** Understand what the user wants to communicate and for which platform.

#### Step 1.1: Extract the Core Insight

Read the user's content (they may have provided a LinkedIn post, concept, data, or topic). Identify:
- The ONE key insight or takeaway
- The main supporting points (3-10 typically)
- Any data/numbers/comparisons

**Propose your understanding:**
```
Here's what I think the key message is:
[Your extracted insight in one sentence]

Main points:
1. [Point 1]
2. [Point 2]
3. [Point 3]
...

Is this right, or would you frame it differently?
```

Wait for user confirmation before proceeding.

#### Step 1.2: Platform Selection

Use `AskUserQuestion`:

```
question: "Where will this be posted?"
header: "Platform"
options:
  - label: "LinkedIn"
    description: "4:5 portrait recommended for best engagement"
  - label: "Instagram"
    description: "1:1 square or 4:5 portrait"
  - label: "Twitter/X"
    description: "16:9 landscape for timeline"
  - label: "Presentation"
    description: "16:9 landscape for slides"
```

#### Step 1.3: Resolution & Quality

Use `AskUserQuestion`:

```
question: "What resolution do you need?"
header: "Quality"
options:
  - label: "Standard (1080px)"
    description: "Good for social media, fast generation"
  - label: "High / 2K (2048px) (Recommended)"
    description: "Sharp on all screens, best balance of quality and speed"
  - label: "Ultra / 4K (4096px)"
    description: "Maximum quality for print or large displays"
```

**Resolution mapping:**
| Choice | Width | Best For |
|--------|-------|----------|
| Standard | 1080px | Quick social posts, mobile-first |
| 2K | 2048px | Professional social, presentations |
| 4K | 4096px | Print, large displays, zoom-heavy slides |

#### Step 1.4: Complexity Assessment

Use `AskUserQuestion`:

```
question: "How much content do you have?"
header: "Complexity"
options:
  - label: "Simple (3-5 points)"
    description: "One core idea, fits in a single infographic"
  - label: "Medium (6-10 points)"
    description: "One idea with multiple facets, needs simplification"
  - label: "Complex (10+ points)"
    description: "Multiple ideas or deep detail — recommend a series"
```

If "Complex" selected, propose how to split into a series (2-4 posts) with specific content mapping for each.

#### Step 1.5: Narrative Arc Selection

Every infographic tells a story. Identify which narrative arc fits the content.

Use `AskUserQuestion`:

```
question: "What story does this infographic tell?"
header: "Story Arc"
options:
  - label: "Myth → Reality"
    description: "You think X, but actually Y — correcting misconceptions"
  - label: "Surface → Depth"
    description: "What you see vs. what's really behind it — revealing hidden truth"
  - label: "Chaos → Order"
    description: "From messy/complex to simple/clear — showing simplification"
  - label: "Journey → Destination"
    description: "Steps or stages leading to an outcome — showing progression"
```

**Why this matters:** The narrative arc shapes HOW the visual should guide the viewer's eye and what emotional response it creates.

| Arc | Viewer Emotion | Best Metaphors |
|-----|---------------|----------------|
| Myth → Reality | Surprised, corrected | Split comparison, Tangled→Straight |
| Surface → Depth | Curious, enlightened | Iceberg, Layers |
| Chaos → Order | Relieved, clear | Tangled→Straight, Funnel |
| Journey → Destination | Motivated, guided | Timeline, Pyramid, Steps |

This selection will inform the metaphor recommendation in Phase 3.

#### Checkpoint 1

Summarize what you've captured:
```
Let me confirm before we move on:
- Core insight: [...]
- Key points: [...]
- Platform: [...] ([aspect ratio])
- Resolution: [Standard 1080px / 2K 2048px / 4K 4096px]
- Format: [Single infographic / Series of N posts]
- Story arc: [Myth→Reality / Surface→Depth / Chaos→Order / Journey→Destination]

All correct?
```

Wait for confirmation before Phase 2.

**Output:** Confirmed brief with insight, points, platform, resolution, format, and narrative arc.

---

### Phase 2: Visual Style (2-3 questions)

**Goal:** Establish the visual identity. Either extract from website, use presets, or collect manually.

#### If Brand Config Exists

If `.infographic/brand.md` exists with saved style preferences, propose using them:
```
Based on your history, I'll use:
- Colors: [saved palette]
- Tone: [saved tone]
- Style: [saved style preferences]

Use these again, or start fresh?
```

Use `AskUserQuestion`:
```
question: "Use your saved style preferences?"
header: "Style"
options:
  - label: "Yes, use saved (Recommended)"
    description: "[Brief summary of saved style]"
  - label: "Start fresh"
    description: "I want to choose a new style for this project"
```

If "Yes, use saved" — skip to Phase 3.

#### Style Discovery

Use `AskUserQuestion`:

```
question: "How should I get your visual style?"
header: "Style source"
options:
  - label: "Extract from my website (Recommended)"
    description: "I'll analyze your site for colors, fonts, and brand feel"
  - label: "Show me preset styles"
    description: "Choose from 5 professional palettes"
  - label: "I'll describe my colors/fonts"
    description: "You know your exact hex codes and preferences"
  - label: "Use a professional default"
    description: "Clean blue and amber palette, works for most content"
```

#### If Website Extraction

1. Ask for the website URL
2. Use `WebFetch` to get the page
3. Follow the extraction process in `references/css-extraction.md`
4. Present extracted palette:
   ```
   I found these brand elements on [domain]:
   - Primary color: [color] [hex]
   - Secondary color: [color] [hex]
   - Font style: [detected font family or type]
   - Overall feel: [professional/playful/minimal/bold]

   Use these?
   ```
5. Let user confirm or adjust

#### If Preset Styles

Present the 5 presets from `references/style-presets.md`:

Use `AskUserQuestion`:
```
question: "Which style palette fits your brand?"
header: "Palette"
options:
  - label: "Professional Blue"
    description: "#2563EB blue + #F59E0B amber — corporate, trustworthy"
  - label: "Warm Coral"
    description: "#F97316 coral + #14B8A6 teal — energetic, approachable"
  - label: "Modern Purple"
    description: "#7C3AED purple + #10B981 emerald — creative, innovative"
  - label: "Minimal Mono"
    description: "#111827 black + #EF4444 red accent — bold, striking"
```

#### If Manual Description

Ask for:
- Primary color (hex preferred)
- Accent color (hex preferred)
- Background preference (light/dark)
- Font style (sans-serif/serif/handwritten/bold)

#### Visual Tone

Use `AskUserQuestion`:

```
question: "What's the visual tone?"
header: "Tone"
options:
  - label: "Professional & clean"
    description: "Corporate feel, great for LinkedIn thought leadership"
  - label: "Playful & approachable"
    description: "Hand-drawn touches, friendly for broader audiences"
  - label: "Bold & striking"
    description: "High contrast, large type, attention-grabbing"
  - label: "Minimal & elegant"
    description: "Lots of whitespace, sophisticated restraint"
```

#### Save Brand Configuration

After collecting style, save to `.infographic/brand.md` (Markdown for human readability):

```bash
cat > .infographic/brand.md <<'EOF'
# Brand Configuration

## Identity
- **Company**: [Company name if known]
- **Industry**: [Industry if known]
- **Target Audience**: [Audience if known]

## Visual Aesthetics
- **Primary Color**: [#HEXCODE] ([Color name])
- **Accent Color**: [#HEXCODE] ([Color name])
- **Background**: [Light/Dark] ([#HEXCODE])
- **Font Style**: [Clean sans-serif / Serif / Handwritten / Bold]
- **Visual Tone**: [Professional & clean / Playful & approachable / Bold & striking / Minimal & elegant]

## Quality Preferences
- **Default Resolution**: [Standard 1080px / 2K 2048px / 4K 4096px]
- **Preferred Platform**: [LinkedIn / Instagram / Twitter / Presentation]
- **Preferred Aspect Ratio**: [4:5 / 1:1 / 16:9 / 9:16]

## Learned Patterns
*(Updated after each session)*

- **Title Style**: [Not yet learned]
- **Text Density**: [Not yet learned]
- **Icon Usage**: [Not yet learned]
- **Whitespace**: [Not yet learned]
- **Common Metaphors**: [Not yet learned]

## Session History
*(Most recent sessions)*

---
*Last updated: [ISO-8601-timestamp]*
*Source: [Website extraction from X / Preset: Y / Manual entry]*
EOF
```

This Markdown format:
- Is human-readable and editable by the user
- Contains all brand aesthetics in one place
- Tracks resolution/quality preferences
- Learns patterns over time
- Maintains session history for context

#### Checkpoint 2

```
Style locked in:
- Primary: [color] [hex]
- Accent: [color] [hex]
- Background: [light/dark]
- Font: [style]
- Tone: [tone]

Ready to choose a visualization?
```

**Output:** Brand profile saved and confirmed.

---

### Phase 3: Visualization Selection (1-2 questions)

**Goal:** Find the perfect visual metaphor by combining the **narrative arc** (from Phase 1) with the **shape** of the idea.

**IMPORTANT:** Don't just match keywords to templates. Follow the reasoning process in `references/visual-reasoning.md`.

#### Step 3.1: Reason About the Concept Shape

Before presenting options, think through these questions **internally** (don't ask the user):

**1. Start with the Narrative Arc (from Phase 1):**

| Narrative Arc | What It Needs to Show | Best Metaphor Types |
|--------------|----------------------|---------------------|
| Myth → Reality | Contrast between wrong belief and truth | Split comparison, Tangled→Straight |
| Surface → Depth | Visible surface vs. hidden depth | Iceberg, Layers, Concentric circles |
| Chaos → Order | Complexity simplified | Tangled→Straight, Funnel, Process flow |
| Journey → Destination | Progression through stages | Timeline, Pyramid, Steps, U-curve |

**2. Extract the Core Tension:**
What two things are in relationship?
- What's being compared to what?
- What's hidden vs. visible?
- What transforms into what?
- What leads to what?

**3. Cross-Reference with Relationship Type:**

| Relationship | Visual Shape | Example Metaphors |
|-------------|--------------|-------------------|
| Revelation (hidden vs. visible) | Depth, layers | Iceberg, Layers |
| Hierarchy (levels of importance) | Vertical stack | Pyramid, Tiers |
| Transformation (A becomes B) | Journey, movement | U-curve, Timeline |
| Composition (parts → whole) | Container | Pie, Silhouette, Puzzle |
| Contrast (A vs. B) | Division | Split, Tangled→Straight |
| Intersection (overlap) | Merger | Venn |
| Convergence (many → few) | Narrowing | Funnel, Hourglass |
| Sequence (ordered steps) | Flow | Timeline, Numbered steps |

**4. Validate the Fit:**
- Does the metaphor serve the NARRATIVE ARC?
- Does the visual match the insight's SHAPE?
- Would someone "get it" in 5 seconds?
- Does the content divide naturally into this structure?

#### Step 3.2: Present Your Reasoning

Show the user your thinking, then present options:

```
Looking at your content, here's what I see:

The core tension is: [what vs. what]
This is about: [relationship type — revelation/hierarchy/transformation/etc.]
The idea's shape feels like: [description of the shape]

Based on this, here are visualization options:
```

#### Step 3.3: Present Options with Reasoning

Use `AskUserQuestion`:

```
question: "Which visualization resonates with your message?"
header: "Visual"
options:
  - label: "[Metaphor 1]"
    description: "[Why it works — connect to THEIR specific content and the shape you identified]"
  - label: "[Metaphor 2]"
    description: "[Why it works — different angle on the same shape]"
  - label: "[Metaphor 3]"
    description: "[Why it works — alternative interpretation]"
  - label: "Something else"
    description: "I have a different idea in mind"
```

**CRITICAL:** The descriptions must explain WHY this metaphor fits THIS content, not generic template descriptions.

**Bad:** "Iceberg — Shows hidden depth"
**Good:** "Iceberg — Your '10% talent, 90% execution' message maps perfectly: talent visible above water, the grinding work massive below"

If user selects "Something else," ask them to describe what they're envisioning. Use the reasoning framework to understand what shape they're going for.

#### Step 3.4: Content Mapping

After metaphor selection, map their SPECIFIC content to the visual structure:

```
For a [chosen metaphor], here's how I'd map your content:

[Show the exact mapping with their words]

Example for Iceberg with their content:
Above water (10% — what people see):
- "Natural talent"
- "The big wins"

Below water (90% — the hidden work):
- "Daily practice" (30%)
- "Failed attempts" (25%)
- "Strategic planning" (20%)
- "Consistent execution" (15%)

Does this mapping capture your message?
```

Let user confirm or adjust. The mapping should use THEIR language and data.

#### Checkpoint 3

```
Visual direction confirmed:
- Metaphor: [chosen metaphor]
- Why it fits: [one sentence connecting to their content's shape]
- Content mapping: [brief summary]

Now let's set up image generation.
```

**Output:** Confirmed metaphor with clear reasoning for why it fits this specific content.

---

### Phase 4: API Key & Generation Setup

**Goal:** Ensure we can generate images, or provide graceful fallback.

#### Check API Key Status

```bash
echo "${GEMINI_API_KEY:+API key is configured}"
```

#### If API Key IS Set

Skip to Phase 5.

#### If API Key NOT Set

Use `AskUserQuestion`:

```
question: "I need a Gemini API key to generate images. How do you want to proceed?"
header: "API Key"
options:
  - label: "Set it up now (Recommended)"
    description: "I'll guide you through getting a free key from Google AI Studio"
  - label: "I have a key ready"
    description: "Let me paste it or I've already exported it"
  - label: "Skip for now"
    description: "Just give me the prompt to use elsewhere"
```

#### Path A: Set Up Now

Follow the guide in `references/api-setup.md`:

1. Display step-by-step instructions:
   ```
   To get your Gemini API key:

   1. Go to Google AI Studio: https://aistudio.google.com
   2. Sign in with your Google account
   3. Click "Get API Key" in the left sidebar
   4. Click "Create API Key" and select a project (or create one)
   5. Copy the generated key

   Paste your API key below when ready.
   ```

2. After user provides key, save to `.env`:
   ```bash
   echo "GEMINI_API_KEY=their-provided-key" > .env
   ```

3. Verify with a test:
   ```bash
   source .env && curl -s "https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}" | head -c 200
   ```

4. If verified, proceed to Phase 5.

#### Path B: User Has Key Ready

Ask user to paste the key, then:
1. Save to `.env`
2. Verify as above
3. Proceed to Phase 5

#### Path C: Skip Generation

```
No problem! I'll complete all the planning and give you a ready-to-use prompt.

You can:
- Paste the prompt into Google AI Studio, ChatGPT, or any image AI
- Come back later with `/infographic` after setting up your key
```

Continue through Phases 5-6, but output the prompt as text instead of calling the API.

**Output:** API key configured and verified, OR skip-generation path selected.

---

### Phase 5: Pre-Generation Details (3 Small Groups)

**Goal:** Gather specific details in manageable chunks with validation after each.

#### Group A: Layout (2 questions)

Use `AskUserQuestion`:

```
question: "Where should the title and text go?"
header: "Text placement"
options:
  - label: "Title at top, visual below"
    description: "Classic layout, title draws you in"
  - label: "Title integrated with visual"
    description: "More artistic, title becomes part of the design"
  - label: "Minimal text, visual-first"
    description: "Let the image do the talking"
```

Use `AskUserQuestion`:

```
question: "What should be the visual focus?"
header: "Hierarchy"
options:
  - label: "One dominant element"
    description: "Hero visual that draws the eye first"
  - label: "Balanced weight"
    description: "All elements equally important"
  - label: "Progressive reveal"
    description: "Eye moves from top to bottom naturally"
```

**Checkpoint A:** "Layout confirmed: [title placement], [hierarchy style]."

#### Group B: Typography (2 questions)

Use `AskUserQuestion`:

```
question: "How should the title look?"
header: "Title style"
options:
  - label: "Bold & large"
    description: "Makes a strong statement"
  - label: "Elegant & thin"
    description: "Sophisticated, refined"
  - label: "Handwritten style"
    description: "Personal, approachable"
  - label: "All caps bold"
    description: "Maximum impact"
```

Use `AskUserQuestion`:

```
question: "How much text on the infographic?"
header: "Text density"
options:
  - label: "Minimal (3-5 labels)"
    description: "Large text, maximum readability"
  - label: "Moderate (5-8 labels)"
    description: "Good balance of info and clarity"
  - label: "Detailed (8+ labels)"
    description: "More information, smaller text"
```

**Checkpoint B:** "Typography confirmed: [title style], [text density]."

#### Group C: Final Details (2 questions)

Use `AskUserQuestion`:

```
question: "Border and frame treatment?"
header: "Border"
options:
  - label: "Clean thin border"
    description: "Neat, professional edge"
  - label: "No border"
    description: "Bleeds to the edge, modern feel"
  - label: "Rounded corners"
    description: "Softer, friendly appearance"
```

Use `AskUserQuestion`:

```
question: "Visual elements to include?"
header: "Elements"
options:
  - label: "Simple icons"
    description: "Line-style icons for visual interest"
  - label: "Illustrations"
    description: "Flat-style illustrations"
  - label: "Just text and shapes"
    description: "Clean, no decorative elements"
```

**Checkpoint C:** "Details confirmed: [border], [elements]."

#### Collect Exact Text

Ask for:
- Exact title text
- Subtitle (if any)
- Exact text for each label/point

#### Final Specification Summary

```
Complete specification:

CONTENT:
- Title: "[exact title]"
- Subtitle: "[subtitle or none]"
- Labels: [list each]

LAYOUT:
- Platform: [platform] ([aspect ratio])
- Text placement: [choice]
- Visual hierarchy: [choice]
- Visual metaphor: [metaphor]

STYLE:
- Colors: [primary], [accent], [background]
- Font: [style]
- Tone: [tone]
- Title treatment: [choice]
- Text density: [choice]
- Border: [choice]
- Elements: [choice]

Ready to generate?
```

**Output:** Complete specification confirmed.

---

### Phase 6: Generate

**Goal:** Craft the prompt, show it to the user, and generate the image.

#### Step 6.1: Craft the Prompt

Use the complete specification from Phase 5 and the prompt patterns from `references/prompt-engineering.md` to create a detailed generation prompt.

Include ALL specifications:
- Exact text content (quoted)
- Layout and composition details
- Visual metaphor structure
- Color palette with hex codes
- Typography style
- Style requirements
- Negative instructions (what to avoid)
- Aspect ratio

#### Step 6.2: Show Prompt for Approval

```
Here's the prompt I'll use to generate your infographic:

---
[Full prompt text]
---

Any tweaks before I generate?
```

Wait for user approval.

#### Step 6.3: Generate Image

If API key is available, call Gemini using request.json with imageConfig:

```bash
# Set variables
MODEL_ID="gemini-3-pro-image-preview"
GENERATE_CONTENT_API="streamGenerateContent"
PROMPT="YOUR CRAFTED PROMPT HERE"
ASPECT_RATIO="4:5"  # From user's platform choice
IMAGE_SIZE="2K"     # From user's resolution choice

# Ensure output directory exists
mkdir -p .infographic/images

# Create request.json with imageConfig
cat > /tmp/request.json << EOF
{
  "contents": [
    {
      "role": "user",
      "parts": [
        {
          "text": "${PROMPT}"
        }
      ]
    }
  ],
  "generationConfig": {
    "responseModalities": ["IMAGE", "TEXT"],
    "imageConfig": {
      "aspectRatio": "${ASPECT_RATIO}",
      "imageSize": "${IMAGE_SIZE}",
      "personGeneration": ""
    }
  },
  "tools": [
    {
      "googleSearch": {}
    }
  ]
}
EOF

# Make API call and save image
curl -s -X POST \
  -H "Content-Type: application/json" \
  "https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:${GENERATE_CONTENT_API}?key=${GEMINI_API_KEY}" \
  -d @/tmp/request.json | \
  jq -r '.[] | .candidates[]?.content.parts[]? | select(.inlineData) | .inlineData.data' | \
  head -1 | base64 -d > .infographic/images/[topic-slug]-v1.png
```

**imageConfig values:**
| Field | Set From | Example |
|-------|----------|---------|
| `aspectRatio` | Platform choice (Phase 1) | `"4:5"`, `"1:1"`, `"16:9"` |
| `imageSize` | Resolution choice (Phase 1) | `"1K"`, `"2K"`, `"4K"` |

#### Step 6.4: Save and Display (CRITICAL)

**You MUST display the image to the user so they can see it and provide feedback.**

1. **Save to the `.infographic/images/` directory** with descriptive filename:
   - Single: `.infographic/images/[topic-slug]-v1.png`
   - Series: `.infographic/images/[topic-slug]-01-v1.png`, etc.
   - Edits: `.infographic/images/[topic-slug]-v2.png`, `-v3.png`, etc.
   - Final: `.infographic/images/[topic-slug]-final.png`

   ```bash
   # Ensure directory exists
   mkdir -p .infographic/images

   # Save the image (update the curl command output path)
   ... | base64 -d > .infographic/images/[topic-slug]-v1.png
   ```

2. **Verify the file exists:**
   ```bash
   ls -la .infographic/images/
   ```

3. **IMMEDIATELY display to user using Read tool:**
   ```
   Use the Read tool to show the image:
   Read file: .infographic/images/[topic-slug]-v1.png
   ```

   This is CRITICAL — the user needs to SEE the image to provide feedback for Phase 7.

**File naming convention:**
| Stage | Pattern | Example |
|-------|---------|---------|
| First version | `[topic]-v1.png` | `success-iceberg-v1.png` |
| After edits | `[topic]-v2.png` | `success-iceberg-v2.png` |
| Final approved | `[topic]-final.png` | `success-iceberg-final.png` |
| Series | `[topic]-01-v1.png` | `productivity-tips-01-v1.png` |

#### If No API Key (Skip Path)

Output the crafted prompt with instructions:
```
Here's your ready-to-use prompt:

---
[Full prompt text]
---

To generate:
1. Go to Google AI Studio (aistudio.google.com)
2. Select "Gemini 3 Pro" model
3. Paste this prompt
4. Click Generate
5. Download the image to .infographic/images/

Or use any image AI of your choice.

I've saved this prompt to `.infographic/prompts/[topic-slug]-prompt.md`
```

Save prompt to file:
```bash
mkdir -p .infographic/prompts

cat > .infographic/prompts/[topic-slug]-prompt.md <<'EOF'
# Infographic Prompt: [Topic]

## Specifications
- Platform: [platform]
- Aspect Ratio: [ratio]
- Resolution: [resolution]
- Style: [tone]

## Prompt
```
[Full prompt text]
```

## Usage Instructions
1. Go to Google AI Studio (aistudio.google.com)
2. Select "Gemini 3 Pro" model
3. Paste the prompt above
4. Click Generate
5. Download the image

---
*Generated: [ISO-8601-timestamp]*
EOF
```

**Output:** Image generated and DISPLAYED to user, OR prompt saved for manual use.

---

### Phase 7: Review & Edit

**Goal:** Get feedback and iterate on the image until the user is satisfied.

#### Step 7.1: First Impression

Use `AskUserQuestion`:

```
question: "Here's your infographic. What's your first reaction?"
header: "Reaction"
options:
  - label: "Love it!"
    description: "Maybe small tweaks, but the direction is right"
  - label: "Good direction, needs changes"
    description: "Core concept works, specific things to adjust"
  - label: "Not quite right"
    description: "Let's try a different approach"
  - label: "Start over"
    description: "Let's go back and try a different concept"
```

#### If "Love it!" — Skip to Phase 8

#### If "Good direction, needs changes" — Continue to Step 7.2

#### If "Not quite right" — Discuss what's wrong and regenerate with adjusted prompt

#### If "Start over" — Return to Phase 3 (Visualization Selection)

#### Step 7.2: Specific Changes

Use `AskUserQuestion` with multiSelect enabled:

```
question: "What would you like to change? (select all that apply)"
header: "Changes"
multiSelect: true
options:
  - label: "Colors"
    description: "Too dark/light, wrong tone, specific color issues"
  - label: "Text"
    description: "Wording, size, placement, or readability"
  - label: "Layout"
    description: "Arrangement, spacing, or composition"
  - label: "Style"
    description: "Too busy/simple, wrong visual feel"
```

#### Get Specifics for Each Selection

**If Colors selected:**
```
question: "What's wrong with the colors?"
header: "Color fix"
options:
  - label: "Make it lighter/brighter"
    description: "Current palette feels too dark"
  - label: "Make it bolder/richer"
    description: "Colors feel washed out"
  - label: "Wrong tone"
    description: "Show me warmer/cooler alternatives"
  - label: "Change specific color"
    description: "I'll tell you which one"
```

**If Text selected:**
```
question: "What about the text?"
header: "Text fix"
options:
  - label: "Title needs rewording"
    description: "Change the title text"
  - label: "Labels too long/short"
    description: "Adjust the supporting text"
  - label: "Text too small/large"
    description: "Resize for readability"
  - label: "Wrong placement"
    description: "Move text to different position"
```

**If Layout selected:**
```
question: "What layout issue?"
header: "Layout fix"
options:
  - label: "More whitespace"
    description: "Feels too crowded"
  - label: "Elements misaligned"
    description: "Things don't line up right"
  - label: "Wrong visual balance"
    description: "Composition feels off"
```

**If Style selected:**
```
question: "What style issue?"
header: "Style fix"
options:
  - label: "Too busy"
    description: "Simplify the design"
  - label: "Too simple"
    description: "Add more visual interest"
  - label: "Wrong visual feel"
    description: "Doesn't match my brand/tone"
```

#### Step 7.3: Apply Edits

Follow the multi-turn editing process in `references/image-editing.md`:

1. Send the current image back to Gemini with specific edit instructions
2. Generate edited version
3. Show comparison if helpful: "Here's before vs after"
4. Ask if the changes are correct

#### Iterate Until Satisfied

Repeat Steps 7.1-7.3 until user says "Love it!" or confirms they're done.

**Output:** Final approved image(s).

---

### Phase 8: Learn & Save

**Goal:** Update the pattern bank with learned preferences for future sessions.

#### Analyze Session Patterns

Look at the choices made during this session:
- Style choices (colors, fonts, tone)
- Layout preferences
- Text density preferences
- Visualization types chosen
- Feedback patterns (what they liked, what they changed)

#### Offer to Save

Use `AskUserQuestion`:

```
question: "I noticed some patterns in your preferences. What should I remember for next time?"
header: "Save"
options:
  - label: "Save all preferences"
    description: "Remember everything for faster sessions"
  - label: "Save just brand/colors"
    description: "Keep the visual identity, ask other questions"
  - label: "Don't save anything"
    description: "I prefer fresh choices each time"
  - label: "Let me choose"
    description: "I'll tell you what to remember"
```

#### Update Brand Config

If saving, update the Learned Patterns and Session History sections in `.infographic/brand.md`:

```bash
# Read existing brand.md, update the Learned Patterns section
# This is a simplified example — in practice, parse and update the specific sections

# Add to Session History
cat >> .infographic/brand.md <<EOF

- [ISO-date]: Created [metaphor] infographic for [topic]
  - Liked: [what worked well]
  - Changed: [what was adjusted]
EOF
```

**What to update in brand.md:**

1. **Learned Patterns section** — based on session choices:
   ```markdown
   ## Learned Patterns
   - **Title Style**: Bold & large
   - **Text Density**: Minimal (3-5 labels)
   - **Icon Usage**: Yes, simple line icons
   - **Whitespace**: Generous (40%+)
   - **Common Metaphors**: Iceberg, Timeline
   - **Preferred Resolution**: 2K (2048px)
   ```

2. **Session History** — append new entry:
   ```markdown
   ## Session History
   - 2024-01-15: Created iceberg infographic, liked bold title, made colors warmer
   - 2024-01-20: Created timeline, preferred minimal text, increased resolution to 4K
   ```

3. **Last updated timestamp**:
   ```markdown
   *Last updated: 2024-01-20T10:30:00Z*
   ```

#### Wrap Up

```
Your infographic is ready!

Saved to .infographic/:
├── images/
│   └── [topic]-final.png  ← Your infographic
├── prompts/
│   └── [topic]-prompt.md  ← Reusable prompt (if no API key)
└── brand.md               ← Your brand settings & learned preferences

[If series] I can generate the remaining [N] posts whenever you're ready. Just say "continue the series."

[If no API key] Your prompt is saved in .infographic/prompts/. Once you have an API key, run `/infographic` again to generate.
```

**Output:** Session complete, files saved to organized directory, preferences updated in brand.md.

---

## Quick Reference

### API Request Format (with imageConfig)

```bash
# Create request.json with imageConfig
cat > /tmp/request.json << 'EOF'
{
  "contents": [{"role": "user", "parts": [{"text": "YOUR PROMPT"}]}],
  "generationConfig": {
    "responseModalities": ["IMAGE", "TEXT"],
    "imageConfig": {
      "aspectRatio": "4:5",
      "imageSize": "2K",
      "personGeneration": ""
    }
  },
  "tools": [{"googleSearch": {}}]
}
EOF

# Generate image
MODEL_ID="gemini-3-pro-image-preview"
curl -s -X POST \
  -H "Content-Type: application/json" \
  "https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:streamGenerateContent?key=${GEMINI_API_KEY}" \
  -d @/tmp/request.json | \
  jq -r '.[] | .candidates[]?.content.parts[]? | select(.inlineData) | .inlineData.data' | head -1 | base64 -d > .infographic/images/output-v1.png
```

### imageConfig Options

| Field | Values | Description |
|-------|--------|-------------|
| `aspectRatio` | `"1:1"`, `"4:5"`, `"16:9"`, `"9:16"` | Output aspect ratio |
| `imageSize` | `"1K"`, `"2K"`, `"4K"` | Resolution quality |
| `personGeneration` | `""` | Leave empty for infographics |

### Directory Structure

```
.infographic/
├── brand.md           # Brand config, aesthetics, learned preferences (Markdown)
├── images/            # All generated infographics
│   ├── topic-v1.png
│   ├── topic-v2.png
│   └── topic-final.png
└── prompts/           # Saved prompts for reuse or no-key fallback
    └── topic-prompt.md

.env                   # API key (GEMINI_API_KEY=...)
```

### Resolution Options (imageSize)

| imageSize | Approx Width | Best For |
|-----------|--------------|----------|
| `"1K"` | ~1024px | Quick social, mobile |
| `"2K"` | ~2048px | Professional (recommended) |
| `"4K"` | ~4096px | Print, large displays |

### Aspect Ratios (aspectRatio)

| Platform | aspectRatio Value |
|----------|-------------------|
| LinkedIn | `"4:5"` |
| Square | `"1:1"` |
| Twitter/Presentation | `"16:9"` |
| Stories | `"9:16"` |

---

## Important Rules

1. **Reason about the shape, don't template-match** — Find the idea's shape first, then match to visuals (see `visual-reasoning.md`)
2. **Use AskUserQuestion for every decision** — Never ask open-ended questions without structured options
3. **Explain WHY a visualization fits** — Connect recommendations to the user's specific content and its shape
4. **Section-by-section validation** — Confirm each phase before proceeding
5. **Graceful no-key fallback** — Always provide value even without API key (output the prompt)
6. **Multi-turn editing** — Use image editing to iterate, don't regenerate from scratch
7. **Learn and remember** — Update pattern bank to speed up future sessions
8. **One metaphor per infographic** — Don't mix metaphors; create a series instead
9. **Simplify ruthlessly** — Max 6-8 text labels; if it won't read on mobile, cut it
10. **40%+ white space** — Breathing room makes it professional
11. **Show prompt before generating** — Always get approval on the exact prompt
12. **Save every generation** — Descriptive filenames, verify files exist
