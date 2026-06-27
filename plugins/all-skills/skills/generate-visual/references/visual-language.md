# Ben AI Visual Language (slides)

The brand system used for on-screen video visuals. Identical to the thumbnail visual language with one adjustment: Ben is usually NOT in the frame; the supporting visual IS the hero.

For the canonical extracted palette and motif rationale, see the thumbnail-generate skill's `references/visual-language.md`. The defaults below are a slide-optimized subset.

## Canonical Palette

| Role | Hex | Notes |
|---|---|---|
| Background dark (primary) | `#1F1F1F` | Deep charcoal with subtle dot-grid texture overlay |
| Background cream (variety) | `#F5E6D8` | Warm cream / peach panel |
| Background coral (rare) | `#E97B5D` | Solid coral fill for high-contrast moments |
| Accent coral (signature) | `#E97B5D` | On folders, app icons, asterisk marks, key shapes |
| Highlight yellow | `#FFD93D` | Marker-highlighter rectangle behind one keyword only |
| Text on dark | `#FFFFFF` | Bold |
| Text on light | `#0A0A0A` | Bold |
| UI card fills | `#FFFFFF` | White cards floating on dark background |

**Banned colors** as primary elements: navy blue, royal blue, sky blue, pure red, magenta, purple (except Obsidian purple `#7B68B4` for Obsidian topics), green (except as a tiny status dot), neon variants.

## Typography

| Use | Style |
|---|---|
| Primary slide text | Bold uppercase sans-serif, heavy weight (Inter Black / Anton / Bebas Neue style) |
| Editorial wordmark | Black serif (Playfair Display style) for product/feature names like "Claude Cowork" |
| Body / labels on UI mockups | Medium-weight sans-serif |

Rules:
- 2 to 4 words per line, 2 lines maximum
- White on dark, black on light, always
- No outlines, no gradients on text
- Subtle shadow only when legibility demands

## Layout Patterns for Slides

Slides differ from thumbnails because Ben isn't in the frame. The supporting visual usually centers or anchors with text.

### Hero-centered (most common)

```
+-----------------------------------------+
|                                         |
|        [HERO VISUAL CENTERED]           |
|        (folder, mockup, diagram)        |
|                                         |
|         [optional label below]          |
|                                         |
+-----------------------------------------+
```

Best for single concepts: a folder, an app icon, a diagram with one focal point.

### Stack / sequence

```
+-----------------------------------------+
|                                         |
|   [item A]    +    [item B]             |
|       or                                |
|   [item A]    →    [item B]             |
|                                         |
|         [optional label]                |
|                                         |
+-----------------------------------------+
```

Best for comparisons, before/after, or "A + B" pairings.

### Top-text + bottom-visual

```
+-----------------------------------------+
|        TOP-CENTERED TEXT BLOCK          |
|                                         |
|        [HERO VISUAL CENTERED]           |
|                                         |
+-----------------------------------------+
```

Best when the headline IS the point and the visual reinforces it.

### Three-column (for "N levels" or tier visualizations)

```
+-----------------------------------------+
|        TOP-CENTERED TEXT BLOCK          |
|                                         |
|   [col 1]    [col 2]    [col 3]         |
|     |          |          |             |
|   [icon]    [icon]    [icon]            |
|                                         |
+-----------------------------------------+
```

Reference the "Agentic OS" thumbnail (`2026-04-11_l5Diqeoffa4_7-levels-claude-context.jpg`) for the canonical look.

## Recurring Motifs

Same vocabulary as thumbnails. Reference by name in prompts.

| Motif | Description |
|---|---|
| `coral starburst` | 12-ray asterisk-like icon in coral with a small white center |
| `coral folder` | Flat coral file folder with white tab, often labeled |
| `coral app icon` | Rounded-square coral background with white glyph centered |
| `white hand-drawn curved arrow` | Thick white sketchy arrow, signature element |
| `yellow highlight box` | Flat yellow rectangle behind one keyword, marker-style |
| `UI mockup card` | Simplified white card with stylized interface (Claude desktop, browser, dashboard, file manager) |
| `index card stack` | Multiple flat white rounded-corner cards stacked in a folder or grid |
| `connector line` | Straight or curved line between two elements (often white, sometimes coral) |

## Composition Rules for Slides

1. **The hero visual is the subject.** Center or near-center placement; the eye should land on it first.
2. **One coral element per slide minimum**, ideally two (folder + asterisk, or app icon + highlight).
3. **At most one hand-drawn arrow per slide.** Slides can also have zero; arrows are signal, not decoration.
4. **Dot-grid texture on dark backgrounds.** Subtle, not aggressive.
5. **Negative space matters.** ~30 to 40% of the frame stays uncluttered.
6. **Logos:** if the slide needs a brand mark (Anthropic asterisk, Claude wordmark, a tool logo), pass the real PNG from `Projects/youtube/thumbnails/logos/` as a `medias[]` entry and instruct the prompt to render it from the reference. Never hallucinate a brand mark from text alone (the model produces warped versions). Never reserve an empty rectangle (produces awkward blank box). If no logo PNG is available, describe the element generically and let the user composite in post.
7. **Photoreal vs flat-stylized:** the rule is the same as thumbnails. All supporting visuals (folders, arrows, icons, cards, mockups) are flat-stylized. The only photoreal element on a slide would be Ben himself, and Ben is usually not in slide frames.

## What Makes a Slide Off-Brand

- Wrong palette (any banned color as primary)
- Photoreal hero visual (folder rendered as a glossy 3D object)
- Stock-photo handshakes, businessmen, abstract tech mesh
- AI-hype tropes: floating holograms, glowing circuits, holographic interfaces
- Multiple competing accent colors (one coral + one yellow highlight is OK; coral + green + blue is not)
- Cluttered scene with no clear focal point
- Text wall (slides should be visual-led; long text belongs in the script, not on screen)

## Reference Anchors

Past visuals worth pointing prompts at as `medias[]` style references. These live in `Projects/youtube/thumbnails/published/`:

| File | Why useful as a slide anchor |
|---|---|
| `2026-03-09_3cYusISFc9s_claude-skills-2-99pct.jpg` | Cleanest "A → B" comparison; two-folder layout |
| `2026-04-11_l5Diqeoffa4_7-levels-claude-context.jpg` | Three-column / tier layout; gradient strip variation |
| `2026-03-24_qo4YZvC1q5I_cowork-obsidian.jpg` | "X + Y" pairing layout with two app icons |
| `2026-02-14_sgSrcSUck7U_cowork-plugins-explained.jpg` | Stack with strikethrough text emphasis |

When generating slides, copy 1 to 3 of these into `medias[]` so the model anchors to Ben's actual published style.
