# Visualization Patterns Reference

Loaded during Phase 3 (Visualization Design). This file defines output modes, style anchors, and layout patterns. Every design decision flows from the distinctions below.

---

## 1. Output Mode Taxonomy

Three fundamentally different output types. Confusing them is one of the most common causes of mediocre results.

### Editorial Illustration

- **When:** Content's strongest layer is Layer 3 (Claims). Viewer should FEEL something.
- **What it looks like:** Cinematic scenes, surreal compositions, visual metaphors embodied as physical spaces. The scene IS the message.
- **Examples:**
  - "Two rooms sharing a wall: one cramped and consuming, one vast and empty."
  - "A figure building a bridge plank by plank, standing on the last plank placed, with nothing underneath."
- **Text density:** Minimal. One powerful line. The image does the communicating.
- **Style:** Discovered from content's emotional register + user taste. NOT the brand template.

### Information Graphic

- **When:** Content's strongest layer is Layer 4 (Information). Viewer should LEARN something.
- **What it looks like:** Scorecards, checklists, charts, comparisons, numbered frameworks. Clean, structured, data-driven. Scans in 1 second.
- **Examples:**
  - "Side-by-side scorecard: Developer (2 green, 4 red) vs. Domain Expert (6 green, 0 red)."
  - "3-step numbered flow."
- **Text density:** Moderate. Structured labels, short descriptions, exact data. Every word planned.
- **Style:** BenAI brand system (hard shadows, cream background, accent colors).

### Hybrid

- **When:** Both strong emotional claim (Layer 3) AND concrete supporting data (Layer 4).
- **What it looks like:** Editorial visual with minimal data overlay. Emotional scene dominates, small data element anchors it.
- Use sparingly. Most content is clearly one mode or the other.

### Critical Rule

Decide mode BEFORE designing. Mode determines what you extract, how you propose, what style you use, what prompt structure you follow, and how you evaluate. Never start designing without a locked mode.

---

## 2. Style Anchor System

ONLY applies to Editorial Illustration and Hybrid modes. Information Graphics always use the brand system.

Style anchors are specific references (artists, movements, publications) that reliably produce specific visual outcomes. Use as starting points, not constraints.

### Style Anchor Table

| Style Anchor | Prompt Vectors | Best For |
|---|---|---|
| European editorial / Adult Swim | "Moebius linework, [as] bumps aesthetic, vintage French magazine illustration, quiet existential surrealism" | Contemplative, philosophical, existential content. Raw personal truths. |
| Graphic novel / comic panel | "Bold confident linework, sequential framing, Herge's clear line style, Chris Ware's structural precision" | Narrative-driven content, before/after transformations, sequential processes. |
| Risograph / analog print | "Risograph printing aesthetic, visible paper grain, muted analog palette, slight registration imperfections, zine energy" | Warm, human, personal content. Authenticity over polish. |
| Minimalist conceptual | "Single powerful conceptual image, editorial illustration like a New Yorker cover, David Plunkert style" | One strong metaphor that says everything. Elegant simplicity. |
| Vintage science / technical | "Vintage scientific illustration, detailed cross-section diagrams, elegant hand-drawn technical precision" | Analytical content about how things work, system breakdowns. |

### Emotional Register Matching

| Content Tone | Style Direction | Why |
|---|---|---|
| Raw, painful, visceral | European editorial / Adult Swim | Surreal distortion matches internal emotional states |
| Reflective, contemplative | Minimalist conceptual | Silence and space mirror the thinking process |
| Warm, human, imperfect | Risograph / analog | Tactile imperfections feel authentic |
| Bold, confident, declarative | Graphic novel | Strong linework matches strong statements |
| Analytical, precise | Vintage science / technical | Precision visual language for precision thinking |

### User Override

If a user describes a completely different style, USE THEIR DESCRIPTION. These anchors are starting vocabulary, not a complete list. The user's taste always wins.

---

## 3. Layout Archetypes for Information Graphics

Six proven layout structures. For Information Graphics ONLY. Do not apply these to Editorial Illustration work.

### Card Grid Layout

**When to use:** Multiple items of equal importance without sequential relationship. Tips, features, benefits, categories.

Structure:
- Max 4 cards (2x2 grid or 1x4 horizontal row). All cards the same size for visual balance.
- Each card contains: title or number + brief text + optional icon.
- Cycle accent colors across cards: Card 1 green, Card 2 yellow, Card 3 blue, Card 4 pink.
- Hard shadows on every card (brand system).

Spatial rules:
- Equal gutters between all cards.
- Cards should feel like physical objects sitting on the cream background.
- Title of the overall graphic sits above the grid.

**Example:** "4 Ways to Use AI in Your Business" - each way is one card with a number, short title, and one-sentence explanation.

### Single Hero Layout

**When to use:** One powerful concept or central idea that deserves the viewer's full attention. No competing elements.

Structure:
- One large central visual element. It dominates the canvas.
- Minimal text: title above the visual, 1-2 sentence explanation below.
- Generous whitespace around the visual so it breathes. Let the image speak.

Spatial rules:
- The visual takes 50-60% of the total canvas area.
- Text never competes with the visual for attention.
- Consider whether the visual is better as an illustration, a chart, or a diagram.

**Example:** "The Compound Effect of Daily Learning" - single snowball visual rolling downhill, growing larger with each rotation.

### Vertical Flow Layout

**When to use:** Sequential processes, steps, timelines, anything with a natural order from start to finish.

Structure:
- Clear numbering (1, 2, 3) or visual connectors (arrows, lines, dots).
- Each step gets its own container or row.
- Title at top explaining what the process achieves, not just what it is.

Spatial rules:
- Steps flow top to bottom. Never left to right for more than 3 steps (it breaks on mobile).
- Consistent spacing between steps.
- Visual connectors between steps reinforce the sequence.

**Example:** "3 Steps to Automate Your Inbox" - each step is a horizontal row with a number, action title, and brief explanation.

### Comparison Layout

**When to use:** Before/after, this vs. that, good vs. bad, Option A vs. Option B. Any content with two sides.

Structure:
- Equal visual weight on both sides. Neither side should feel smaller or less important structurally.
- Clear divider between the two sides (vertical line, color boundary, or labeled separator).
- Obvious labels at the top of each side.

Design bias:
- The "better" side gets slightly more appealing visual treatment (warmer colors, cleaner lines, more whitespace).
- The "worse" side can use muted tones, slight visual clutter, or cooler colors.
- The difference should be felt, not forced.

**Example:** "Manual Process vs. Automated Workflow" - left side shows scattered steps and time cost, right side shows clean flow and time saved.

### Hierarchy Layout (Pyramid / Iceberg / Layers)

**When to use:** Levels of importance, hidden depth, foundational concepts. Content where some things sit beneath or support other things.

Structure:
- Choose the right metaphor for the content:
  - **Pyramid:** Foundation at the bottom supporting everything above. Peak is the goal or outcome.
  - **Iceberg:** Small visible portion above the surface, large hidden portion below. "What people see vs. what it actually takes."
  - **Layers:** Different depths or levels, each with its own label and meaning.
- Label each level clearly. Size indicates importance or volume.

Spatial rules:
- The metaphor should be immediately obvious. If someone has to think about why it is a pyramid, pick a different structure.
- Keep labels short. Each level gets a title and optionally one line of explanation.

**Example:** "What People See vs. What It Takes" - iceberg with polished output above the waterline and years of practice, failure, and learning below.

### Funnel Layout

**When to use:** Processes that narrow down, conversion flows, decision trees, filtering sequences. Anything where many become few.

Structure:
- Wide at top, narrow at bottom. Each stage labeled clearly.
- Consider showing numbers at each stage to quantify the narrowing.
- Color gradient from lighter (top) to more saturated (bottom) reinforces the funneling.

Spatial rules:
- 3-5 stages maximum. More than 5 stages becomes hard to read.
- Each stage should be visually distinct (separated by lines or color shifts).
- The final stage at the bottom is the payoff. Make it feel important.

**Example:** "Lead to Customer Journey" - stages of narrowing from awareness to consideration to decision to purchase, with drop-off percentages at each stage.

---

## 4. How to Propose Visualizations

Always propose 5 options, never fewer. The user needs real choices, not variations on one idea.

### For Editorial Illustration: Propose SCENES, Not Layout Types

Each proposal needs four elements:

1. **The scene:** What is physically in the image? Describe it like a film shot. Name the objects, the space, the lighting, the composition.
2. **The emotional register:** What does the viewer FEEL when they see this? Name the emotion.
3. **The focal composition:** Where does the eye go first? What draws attention?
4. **The 2-second hit:** What does someone scrolling past GET instantly? What is the gut reaction before conscious thought kicks in?

DO NOT propose abstract layout types ("pyramid," "iceberg," "flowchart") for editorial work. Those are information graphic structures. Propose CINEMATIC SCENES with physical elements, spatial relationships, and emotional weight.

**Example proposal:**

"Two rooms sharing one wall. LEFT: cramped room, figure hunched at desk, consumed by towering stacks of paper. Walls closing in visibly. Cracks spreading across the ceiling. Dim, yellow light. RIGHT: vast empty room, same figure standing upright in open space. A doorway with warm light on the far wall. Single plant on the floor. The crack in the dividing wall says: you could move. 2-second hit: 'I have been in both rooms. Which one am I in right now?'"

### For Information Graphic: Propose DATA STRUCTURES, Not Metaphors

Each proposal needs four elements:

1. **The format:** Scorecard, checklist, chart, comparison grid, numbered steps, card grid. Name the structure.
2. **What data goes where:** Exact mapping of content to visual elements. Which text goes in which slot.
3. **What the viewer LEARNS in 1 second:** The concrete takeaway. Not a feeling, a fact.
4. **Why this format:** Why does this structure fit the data shape? What makes it the right container?

DO NOT propose metaphorical approaches for info graphics. A scorecard is not a metaphor. A numbered list is not a metaphor. Propose DATA FORMATS that serve the data.

---

## 5. Content Mapping

After the user picks a visualization, map their SPECIFIC content to the chosen structure before writing any prompt.

The mapping must answer:
- **What text appears where:** Exact words, exact positions. Title text, label text, body text.
- **How the visual hierarchy works:** What is biggest, what is smallest, what is boldest, what is quietest.
- **What the focal point is:** Where does the eye land first, and what path does it follow?

Confirm the mapping with the user before proceeding to prompt construction. The mapping is the bridge between concept and execution. Skipping it leads to prompts that drift from the original intent. Getting it right means the prompt almost writes itself.
