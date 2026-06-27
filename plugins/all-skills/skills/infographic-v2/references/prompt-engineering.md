# Prompt Engineering Reference

How to craft effective image generation prompts for infographics. This document covers
how Gemini interprets prompts, tested techniques that produce reliable results, the two
prompt architectures (editorial illustration and information graphic), the prompt vector
system, and the optimal assembly order.

Load this during Phase 6 (Prompt Construction). Everything here is self-contained.

---

## 1. How Gemini Interprets Prompts

Before writing a single prompt, understand how Gemini processes your instructions.
This is based on 20 controlled tests using identical content with only the prompt
strategy changed. Gemini does not follow specifications like code. It interprets
vibes like an art director.

### The Mental Model

Think of Gemini as a talented but opinionated designer who:

- Has seen millions of infographics and defaults to the most common patterns
  (dark blue gradients, clipart, human illustrations) when given no direction
- Responds to **references** better than **instructions** ("make it look like
  Stripe" works better than "use #FAF3E3 with rounded corners")
- Has selective hearing: picks up on feelings and aesthetics before specs and
  measurements
- Gets more creative with less instruction, but also more unpredictable
- Gets more accurate with more instruction, but also more visually boring

### Reliability Rankings

What Gemini is good at and bad at, ranked by tested reliability:

**Excellent (95%+ reliability):**
- Text rendering (with TEXT LINE format + CRITICAL instruction)
- Background colors (hex codes)
- Basic geometric shapes (circles, squares, triangles)
- Accent colors on cards and pills
- Checklist/checkbox formatting
- Responding to product brand references (Stripe, Figma, Linear)

**Good (70-90% reliability):**
- Card layouts with borders
- Left-accent stripes on cards
- Section separation with === SECTION === markers
- Colored dot bullets
- Bold/light text weight distinction
- Hard shadows (usually renders some shadow, but not always the exact spec)

**Mediocre (40-60% reliability):**
- Icon rendering (quality varies wildly)
- Precise spacing between elements
- Exact font matching
- Element count (sometimes duplicates items in 3-element layouts)

**Unreliable (below 40% reliability):**
- Pixel-level positioning
- Exact font sizes
- Preventing content hallucination (without TEXT LINE format)
- Complex multi-column layouts
- Preventing icons from appearing (without the nuclear NO list)

### The Text-Design Tradeoff

This is the fundamental tension in every prompt:

- **More text in the prompt** = higher text accuracy, but less visual design.
  The model treats heavy text as body copy and renders it plainly.
- **Less text in the prompt** = bolder visual design, but you give the model
  room to hallucinate or alter content.
- **The sweet spot** is ~30-50 words of actual content with formatting cues
  (BOLD:, LIGHT:, SMALL:). This gives enough structure for accuracy while
  leaving room for visual interpretation.

### Front-Loading

The first 20% of the prompt carries disproportionate weight. Whatever constraint
matters most should appear FIRST. If "no dark background" is critical, put it in the
opening lines. If spacing matters most, lead with spacing instructions. Do not bury
your most important constraint at the end of a long prompt.

---

## 2. Tested Prompt Techniques

These techniques are proven through controlled testing. Use them as building blocks
when assembling any prompt.

### TEXT LINE Format (100% Text Accuracy)

The gold standard for ensuring every word renders exactly as written. Number every
line of text and add the CRITICAL instruction.

```
CRITICAL: Spell every word EXACTLY as written below.

TEXT LINE 1 (large bold heading): Build Skills, Not Prompts
TEXT LINE 2 (medium subheading): Skills teach AI to do YOUR job YOUR way
TEXT LINE 3 (small pill label): Automate Workflows
TEXT LINE 4 (small pill label): Scale Output
TEXT LINE 5 (small pill label): Maintain Quality
```

Why it works: The numbered list gives Gemini a sequential checklist to work through,
reducing skips and hallucinations. Without this format, Gemini often:
- Adds subtexts and descriptions you did not write
- Duplicates elements (especially in 3-item layouts)
- Rewrites your text to be more "professional" (strips personality)
- Hallucinated extra content that fills visual space

### Inline Formatting Cues

Combine content and visual styling in the same line. The model interprets these as
both content instructions AND design instructions simultaneously.

```
BOLD: Plan the Outcome | LIGHT: Define the result before you prompt
ROW WITH GREEN ACCENT: Automate Workflows
SMALL: Maintain quality at every step
```

This is the best way to control text styling within the TEXT LINE format.

### Nuclear NO Icons Formula

Simple "no icons" does not work. Gemini interprets "icons" narrowly and will add
"illustrations" or "pictograms" instead. You must list every synonym:

```
ABSOLUTELY NO ICONS. NO ILLUSTRATIONS. NO PICTOGRAMS. NO EMOJIS.
NO VISUAL SYMBOLS OF ANY KIND.
This image contains ONLY text, colored rectangles, and lines. Nothing else.
```

Use this exact formula whenever the design should be text-and-shapes only.

### Section Markers for Layout

Gemini treats these as hard breaks between visual regions. The [LARGE GAP]
instruction actually creates visible whitespace between sections.

```
=== SECTION 1: HEADLINE ===
[headline content here]
[LARGE GAP]
=== SECTION 2: FRAMEWORK ===
[framework content here]
[LARGE GAP]
=== SECTION 3: FOOTER ===
[footer content here]
```

Never rely on whitespace instructions alone ("generous whitespace", "50% empty").
These cause the model to strip visual elements rather than add spacing between them.
Use structural separators instead.

### Brand/Product References for Style

This is the single highest-bandwidth style signal you can give Gemini. One product
reference activates an entire aesthetic cluster: typography, spacing, color treatment,
card styling, everything.

**The style hierarchy (best to worst):**

1. **Best:** Product/brand reference + material description
   "Looks like a Stripe.com landing page, printed on thick cream card stock"
2. **Good:** Artist reference + texture instruction
   "In the style of Moebius, with visible paper grain"
3. **Okay:** Anti-style (heavy negatives) + one positive anchor
   "NOT corporate, NOT template. Feels like a premium magazine spread."
4. **Bad:** Abstract adjectives
   "Clean, modern, professional, elegant, minimalist"
5. **Worst:** No style direction at all

Abstract adjectives ("clean", "modern", "professional") are nearly useless. These
words appear in too many training examples to activate anything specific. They
produce generic corporate gray with line icons.

**Best brand references for infographics:** Stripe, Linear, Notion, Figma, Apple

### Material Descriptions

The second-highest-bandwidth style signal. Material descriptions set texture, depth,
lighting, shadow behavior, and typography style all at once.

"Printed on thick cream card stock with visible paper grain" does not just set a
color. It sets an entire physical reality that constrains every other visual decision.

### Geometric Shapes Instead of Icons

Gemini renders circles, triangles, squares, and dots with 100% fidelity. A green
circle next to "Automate" is more reliable than a gear icon. And often looks better:
geometric shapes feel intentional and designed, while generated icons feel like clipart.

```
Large green circle next to "Automate Workflows"
Yellow dot bullet - 1. Plan the Outcome
Card with green left accent stripe: [content]
```

**Reliable visual elements (no icons needed):**
- Colored dot bullets (green dot, yellow dot)
- Left-accent stripes on cards (~90% reliability)
- Checkboxes (rendered as actual checkboxes)
- Colored rectangles and pills
- Simple geometric shapes (circle, triangle, square)

### Icon Library References (When Icons Are Needed)

If you must use icons, reference a specific icon library. Without this, you get
filled/cartoon icons that look like clipart.

"Like Phosphor icons" or "Feather icons style" activates the line-icon aesthetic.

You can also zone icons: "TOP SECTION (text only, no icons):" and
"BOTTOM SECTION (with simple line icons):" -- Gemini respects section-level control.

### Aspect Ratio in Two Places

Always specify the aspect ratio in BOTH the prompt text AND the tool parameter.
The parameter controls the canvas dimensions. The prompt text ("4:5 portrait")
influences layout decisions within that canvas.

---

## 3. Prompt Architecture: Editorial Illustration

Editorial illustrations are artistic, metaphor-driven visuals. They communicate through
feeling and symbolism rather than data. The prompt follows a strict 9-part structure.
Every part serves a purpose. Skip nothing.

### Part 1: STYLE ANCHOR

The opening line. Sets the entire aesthetic direction by referencing specific artists,
movements, or visual traditions discovered during style analysis.

> "A [aspect ratio] editorial illustration in the style of [chosen style anchors]"

Example fragments:
- "in the style of Victo Ngai and Emiliano Ponzi"
- "inspired by mid-century editorial illustration and Japanese woodblock composition"

### Part 2: EMOTIONAL REGISTER

How the image should feel. Not what it shows, but what it evokes. One to two sentences.

> "Quiet, contemplative, quietly existential" OR "bold, unflinching, demands attention"

This is the soul of the image. Get it right and everything else follows.

### Part 3: THE SCENE

The longest and most important section. A cinematic description of what is physically
in the frame. Describe figures, rooms, objects, spatial relationships. Be concrete and
visual, never abstract or conceptual.

Bad: "A person experiencing burnout."
Good: "A figure sitting alone at a desk that stretches impossibly long into the distance.
Papers drift upward like tired birds. The ceiling is low and warm-toned. A single window
on the left lets in pale morning light."

Write this like a film director describing a shot, not a strategist describing a concept.

### Part 4: SPATIAL COMPOSITION

How the eye moves through the image. What is large and what is small. Where the focal
weight sits. Whether the composition is centered, asymmetric, or uses depth.

> "The figure is slightly left of center, small against the room. The desk dominates
> the lower two-thirds. The eye enters from the window and follows the light to the
> figure."

### Part 5: TEXTURE AND MATERIALITY

The physical feel of the image. Paper grain, ink quality, print technique. Material
descriptions are one of the highest-bandwidth signals you can give Gemini -- they set
texture, depth, lighting, and shadow behavior all at once.

> "Subtle paper grain texture like quality stock, feels printed not digital"
> "Confident ink linework with intentional variation in weight"
> "Printed on thick cream card stock with visible paper grain"

### Part 6: COLOR PALETTE

Derived from content tone AND chosen style. Always specify what to avoid.

For warm, reflective content:
> "Dusty warm tones - cream, muted ochre, soft sage, warm gray"

For bold, energetic content:
> "High contrast palette - deep navy, bright coral, clean white, touches of gold"

Always include:
> "NO black backgrounds. Everything warm and analog."

### Part 7: TEXT ELEMENTS

Minimal text in editorial illustrations. The image carries the weight. One phrase,
maybe two.

Use the TEXT LINE format even for minimal text to ensure exact rendering:

```
CRITICAL: Spell every word EXACTLY as written below.
TEXT LINE 1 (bottom, clean hand-lettered): The map is not the territory
TEXT LINE 2 (small footer): Ben Van Sprundel | Founder @ BenAI
```

Never crowd the image with text. The text-design tradeoff means that editorial
images benefit from fewer words rendered with higher visual impact.

### Part 8: WHAT NOT TO DO

Explicit negatives prevent the AI from drifting into common failure modes. Use the
nuclear NO formula when you need to block specific element types.

> "Not cartoonish, not hyperreal. Not corporate. Not clipart."
> "No decorative borders, no gradient backgrounds, no stock photo aesthetic."

If blocking icons entirely:
```
ABSOLUTELY NO ICONS. NO ILLUSTRATIONS. NO PICTOGRAMS. NO EMOJIS.
NO VISUAL SYMBOLS OF ANY KIND.
```

### Part 9: TECHNICAL

Footer and output specifications. Always the last section.

> "Footer at the very bottom in small, clean sans-serif: 'Ben Van Sprundel | Founder @ BenAI'"
> "Output as a [aspect ratio] image at approximately 2048 pixels wide."

---

## 4. Prompt Architecture: Information Graphic

Information graphics are data-driven, scannable visuals. They communicate through
structure, hierarchy, and clarity rather than metaphor. The prompt follows a strict
8-part structure.

### Part 1: FORMAT DECLARATION + STYLE REFERENCE

State explicitly that this is an information graphic and anchor the style with a
brand reference. The brand reference controls the overall aesthetic more reliably
than individual CSS specifications.

> "A clean, bold [aspect ratio] infographic for LinkedIn that looks like a component
> from Stripe.com -- the Stripe aesthetic."
> "NOT an illustration or metaphor - this is an INFORMATION GRAPHIC."

### Part 2: ELEMENT BLOCKING

Put nuclear negatives early. The first 20% of the prompt carries the most weight.
Block failure modes before they can take hold.

> "ABSOLUTELY NO ICONS. NO ILLUSTRATIONS. NO PICTOGRAMS. NO EMOJIS.
> NO VISUAL SYMBOLS OF ANY KIND."
> "NO black backgrounds, NO dark mode, NO gradients."

### Part 3: EXACT TEXT (TEXT LINE Format)

Every single word that appears in the image, written in the TEXT LINE format with
inline formatting cues. The AI should not generate any text on its own.

```
CRITICAL: Spell every word EXACTLY as written below.

TEXT LINE 1 (large bold heading): Build Skills, Not Prompts
TEXT LINE 2 (medium subheading): Skills teach AI to do YOUR job YOUR way
[LARGE GAP]
TEXT LINE 3 (BOLD: Plan the Outcome | LIGHT: Define the result before you prompt)
TEXT LINE 4 (BOLD: Automate Workflows | LIGHT: Build repeatable AI processes)
TEXT LINE 5 (BOLD: Scale Output | LIGHT: Multiply your capacity without multiplying effort)
[LARGE GAP]
TEXT LINE 6 (small footer): Ben Van Sprundel | Founder @ BenAI
```

Tips for text accuracy:
- Fewer words per element = higher accuracy per word
- Inline cues (BOLD:, LIGHT:, SMALL:) control both content and visual styling
- The sweet spot is ~30-50 words of content with formatting cues

### Part 4: STRUCTURAL LAYOUT

Use section markers and structural separators to control layout zones. Gemini treats
=== SECTION === markers as hard visual breaks.

```
=== SECTION 1: HEADLINE ===
[title + subtitle from TEXT LINEs above]
[LARGE GAP]
=== SECTION 2: FRAMEWORK ===
[3 cards with content from TEXT LINEs above]
[LARGE GAP]
=== SECTION 3: FOOTER ===
[footer text]
```

Use geometric shapes and accent stripes instead of icons:
- "Card with green left accent stripe" for color-coded sections
- "Green dot bullet" for list items
- "Large green circle next to label" for visual anchoring

### Part 5: BRAND SYSTEM

The visual design system. Colors, borders, shadows, typography rules. These specs
refine the aesthetic established by the brand reference in Part 1.

> "Background: warm cream (#FAF3E3). NEVER black."
> "Cards: solid 2px dark borders (#020309), slightly rounded corners, bold hard
> shadows (8px right, 8px down, 0 blur, pure black)"
> "Accent colors: green (#D2ECD0) for positive, yellow (#FDEEC4) for highlights,
> blue (#E5F5F9) for neutral"
> "Typography: Bold modern sans-serif for headings. Clean readable sans for body."

Note: Hex colors are respected ~80% of the time. Border descriptions work ~60%.
Pixel values for positioning are ignored entirely. Box-shadow descriptions work ~40%.
The brand reference in Part 1 does the heavy lifting; these specs fine-tune.

### Part 6: DENSITY CONTROL

Use structural separators, not whitespace adjectives. "Generous whitespace" causes
the model to strip visual elements. Use [LARGE GAP] and section markers instead.

> "Structured layout with clear separation between sections using [LARGE GAP]."
> "This should feel like a premium magazine spread, not a packed data sheet."
> "Should feel like a premium magazine spread printed on quality stock."

### Part 7: SCANABILITY

The image must be instantly readable. No decoding, no squinting, no re-reading.

> "The image should be scannable in 1-2 seconds. Instantly readable. No decoding
> required. Every element is immediately clear at LinkedIn feed size."

### Part 8: TECHNICAL

Footer and output specifications. Always the last section.

> "Footer: 'Ben Van Sprundel | Founder @ BenAI'"
> "Output as a [aspect ratio] image at approximately 2048 pixels wide."

---

## 5. Prompt Vector System

Prompt vectors are specific phrases that reliably control output quality. They are not
magic words. They are precise instructions that give the AI model clear, unambiguous
targets. Select vectors that serve your content. You do not need one from every category.

### Emotional Register Vectors

| Register | Prompt Vector | When to Use |
|----------|--------------|-------------|
| Quiet / contemplative | "The emotional register is quiet - this image doesn't shout, it sits with you. Contemplative, like the last page of a book." | Reflective essays, existential truths, inner experiences |
| Bold / punchy | "Bold, confident, demands attention - designed to stop the scroll. High contrast, decisive composition." | Strong claims, challenges, calls to action |
| Raw / honest | "Unflinching, direct, no decoration - like a photograph of truth. The vulnerability is the strength." | Personal confessions, hard truths |
| Warm / human | "Warm, imperfect, feels made by human hands - analog warmth, gentle light, the comfort of the familiar." | Community content, mentorship, personal stories |
| Surreal / dreamlike | "Dreamlike spatial distortion - rooms feel emotionally true rather than physically accurate. Objects exist because they carry meaning." | Emotional claims that are felt rather than observed |

### Density Vectors

| Level | Prompt Vector | When to Use |
|-------|--------------|-------------|
| Minimal | "Minimal composition, generous whitespace, every element earns its place through necessity. Empty space is a design element." | Editorial illustrations, single-concept visuals |
| Moderate | "Structured layout with breathing room between every element. Premium magazine spread density - organized but never cramped." | Info graphics with 3-5 elements |
| Dense | NEVER USE for social media. If you have this much data, split it into a carousel instead. | Never for single social images |

### Materiality Vectors

| Material | Prompt Vector | Effect |
|----------|--------------|--------|
| Paper | "Subtle paper grain texture like quality stock. Feels printed on premium paper, not rendered digitally." | Adds warmth and tactile quality |
| Ink | "Confident ink linework, like drawn with a technical pen by a steady hand. Line weight varies with intention." | Hand-drawn authority |
| Print | "Like risograph printing - slight imperfections in registration, tactile analog warmth, the human fingerprint of mechanical reproduction." | Authenticity, anti-digital |
| Canvas | "Textured like canvas or heavy watercolor paper. Visible surface grain. The medium is part of the message." | Weight and permanence |
| Card stock | "Printed on thick cream card stock with visible paper grain. The physical feel of a premium printed piece." | Sets texture, depth, lighting, and shadow behavior all at once |

### Spatial Vectors

| Effect | Prompt Vector | When to Use |
|--------|--------------|-------------|
| Surreal distortion | "Surreal spatial distortion - rooms and spaces feel dreamlike, not photorealistic. Architecture serves emotional truth, not physics." | Internal experiences, abstract concepts |
| Stylized figures | "Figures are stylized but human - not cartoonish, not hyperreal, universal. You should see yourself in them." | Any scene with human figures |
| Disproportionate scale | "Disproportionate scale to emphasize emotional weight - the thing that matters most is physically largest." | Power dynamics, importance hierarchies |
| Cinematic framing | "Cinematic composition - the image is a still from a film that doesn't exist. Clear focal point, intentional depth, directional light." | Any scene-based editorial image |
| Clean data space | "Clean, organized spatial layout. Grid-aligned elements. Every pixel has purpose." | Info graphics, scorecards, comparison layouts |

### Negative Vectors (Always Include)

These prevent common failure modes. Include the relevant ones in every prompt.

| Avoid | Prompt Vector |
|-------|--------------|
| Cartoonish | "Not cartoonish, not anime, not clipart. Stylized but grounded in emotional reality." |
| Hyperreal | "Not photorealistic, not 3D rendered, not stock photo aesthetic." |
| Corporate | "Not corporate, not clip art, not template-generated. This was made by a person with a point of view." |
| Dark backgrounds | "NO black backgrounds, NO dark gray backgrounds, NO dark mode aesthetic. Everything warm and light." |
| Overdecorated | "No decorative elements that don't serve the message. No borders within borders, no gradients for gradient's sake." |
| Icons (nuclear) | "ABSOLUTELY NO ICONS. NO ILLUSTRATIONS. NO PICTOGRAMS. NO EMOJIS. NO VISUAL SYMBOLS OF ANY KIND. This image contains ONLY text, colored rectangles, and lines." |

---

## 6. The Optimal Prompt Assembly Order

Based on all 20 controlled tests, this is the assembly order that produces the best
results. The order matters because Gemini front-loads attention on the opening sections.

### For Information Graphics

```
SECTION 1: FORMAT + STYLE REFERENCE
"A 4:5 portrait infographic that looks like a component from Stripe.com"

SECTION 2: NUCLEAR NEGATIVES
"ABSOLUTELY NO ICONS. NO ILLUSTRATIONS. NO PICTOGRAMS..."
"NO black backgrounds, NO dark mode."

SECTION 3: EXACT TEXT (TEXT LINE format)
CRITICAL: Spell every word EXACTLY as written below.
TEXT LINE 1 (large bold): [title]
TEXT LINE 2 (medium): [subtitle]
...

SECTION 4: STRUCTURAL MARKERS
=== SECTION 1: HEADLINE ===
[content]
[LARGE GAP]
=== SECTION 2: BODY ===
[content]

SECTION 5: BRAND SPECS
Background: #FAF3E3. Cards: 2px dark border, hard shadow.
Accent colors: green, yellow, blue cycling.

SECTION 6: MATERIAL/TEXTURE
"Should feel like a premium magazine spread printed on quality stock"
```

### For Editorial Illustrations

```
SECTION 1: STYLE ANCHOR + EMOTIONAL REGISTER
"A 4:5 editorial illustration in the style of [anchors]. Quiet, contemplative..."

SECTION 2: THE SCENE (longest section)
[Cinematic description of what is in the frame]

SECTION 3: SPATIAL COMPOSITION + COLOR
[Eye movement, focal weight, palette]

SECTION 4: TEXT ELEMENTS (TEXT LINE format, minimal)
CRITICAL: Spell every word EXACTLY as written below.
TEXT LINE 1 (bottom, hand-lettered): [the one line that hits]
TEXT LINE 2 (small footer): Ben Van Sprundel | Founder @ BenAI

SECTION 5: TEXTURE/MATERIALITY
"Paper grain like quality stock. Confident ink linework."

SECTION 6: NEGATIVES
"Not cartoonish, not hyperreal, not corporate. No black backgrounds."
```

### Why This Order Works

1. **Format + Reference first** sets the canvas and activates the right aesthetic cluster
2. **Negatives early** blocks failure modes before the model starts generating
3. **Text in the middle** gets high accuracy from the TEXT LINE format
4. **Structure after text** organizes the text into visual zones
5. **Specs late** fine-tune the aesthetic the reference already established
6. **Material last** anchors the physical feel and closes with texture

---

## 7. What Makes Prompts Fail

These are the most common failure patterns and why they break:

- **Abstract adjectives instead of references:** "Clean, modern, professional,
  elegant, minimalist" -- these words have no consistent visual meaning to the model.
  They appear in too many training examples to activate anything specific. The result
  is generic corporate gray with line icons. Use product references instead.

- **"No icons" without listing synonyms:** The model interprets "icons" narrowly.
  Say "no icons" and it adds "illustrations" or "pictograms" instead. You must use
  the nuclear NO formula that lists every synonym.

- **Whitespace instructions that strip design:** "Generous whitespace" or "50% empty"
  causes the model to remove visual elements rather than add spacing between them.
  Use structural separators ([LARGE GAP], section markers) instead.

- **Quotes alone for text accuracy:** Just putting text in quotes and saying "only this
  text" does not prevent hallucination. The model still duplicates elements, adds
  descriptions, and rewrites content. You need the TEXT LINE N: format + CRITICAL
  instruction.

- **Too vague:** "Make a nice infographic about AI" gives the model no content specifics
  and no style guidance. It will produce generic output because you gave it a generic
  input. Specificity is the single biggest quality lever.

- **Specs without feeling:** "Use #FAF3E3 background, 8px 8px 0 shadow" is specifications
  without soul. The model responds better when you lead with the aesthetic feel (brand
  reference) and follow with technical details. Start with the vibe, end with the specs.

- **Contradictory instructions:** "Minimal design with lots of detailed information"
  asks the AI to satisfy two opposing goals. Resolve contradictions before they reach
  the prompt.

- **Missing content:** Describing the style beautifully but forgetting to specify the
  actual text and layout. Every word that should appear in the image must be written
  explicitly. The AI should invent zero text.

### Gemini Hallucination Patterns

When Gemini does hallucinate, it follows these patterns. Knowing them helps you
prevent them:

1. **Adds subtexts and descriptions** you did not write (common with minimal prompts)
2. **Duplicates elements** (especially in 3-item layouts, often renders one item twice)
3. **Rewrites your text** to be more "professional" (strips personality and specificity)
4. **Adds icons** even when told not to (unless you use the nuclear NO formula)
5. **Defaults to dark blue/purple** gradients with clipart when given no style direction

All five are prevented by the techniques in Section 2: TEXT LINE format prevents 1-3,
nuclear NO formula prevents 4, and brand references prevent 5.

---

## 8. Iteration Prompt Patterns

When editing an existing image, be specific about what to change AND what to preserve.
Vague edit requests cause the AI to reinterpret the entire image.

### Good edit prompt structure:

```
Edit this infographic:
1. Make the title 30% larger for better visibility
2. Change the third card's background from green to yellow
3. Reduce the body text in each card to 8 words maximum

Keep everything else exactly the same - shadows, borders, layout, and other text unchanged.
```

The explicit "keep everything else" instruction is critical. Without it, the model
may drift on elements you intended to preserve.

### When to edit vs. regenerate:

| Situation | Action |
|-----------|--------|
| Color adjustments | edit_image / continue_editing |
| Text changes | edit_image / continue_editing |
| Layout tweaks | edit_image / continue_editing |
| Different metaphor or concept | Regenerate with generate_image |
| Major concept change | Regenerate with generate_image |
| 50%+ of image needs change | Regenerate with generate_image |

The decision boundary is roughly this: if you can describe the change as a modification
to the existing image, edit it. If you need to describe it as a different image, regenerate.
Editing preserves what works. Regenerating starts fresh when the foundation needs to change.
