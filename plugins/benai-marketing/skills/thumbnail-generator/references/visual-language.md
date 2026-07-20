# Ben AI Thumbnail Visual Language

The locked design vocabulary extracted from the 15 published thumbnails in `Projects/youtube/thumbnails/published/`. Every generated thumbnail should pull from this catalog. Anything not in here is off-brand by default.

These are NOT the brand colors from the company website. They are the thumbnail-specific design system Ben has actually used in production.

## Canonical Palette

| Role | Hex | Notes |
|---|---|---|
| Background dark (primary, ~70% of thumbnails) | `#1F1F1F` | Deep charcoal, NOT pure black. Has a subtle dot-grid texture overlay |
| Background cream (variety, ~20%) | `#F5E6D8` | Warm cream/peach, used as solid panel background |
| Background coral (variety, ~10%) | `#E97B5D` | Solid coral fill for high-contrast moments |
| Accent coral (signature) | `#E97B5D` | The brand's defining color. Used on folders, app icons, asterisk marks, arrows |
| Highlight yellow | `#FFD93D` | ONLY as a text-highlight box behind a keyword. Never as primary background or large blocks |
| Text on dark | `#FFFFFF` | Pure white, bold |
| Text on light | `#0A0A0A` | Near-black, bold |
| UI element fills (cards, app windows) | `#FFFFFF` | White cards floating on the dark background |

**Banned colors** (do not generate unless representing a specific external tool's brand mark):
- Navy blue, royal blue, sky blue
- Pure red, magenta
- Purple (except Obsidian purple `#7B68B4` when Obsidian is the topic)
- Green (except as a small status indicator)
- Neon / electric variants of anything

## Typography

| Use | Style | Examples from published |
|---|---|---|
| Primary thumbnail text | Bold uppercase sans-serif, heavy weight (Inter Black / Anton / Bebas Neue style) | "AUTOMATE ANYTHING", "COPY THESE", "SCHEDULE SKILLS", "LIVE ARTIFACTS" |
| Editorial wordmark | Black serif (Playfair Display style) | "Claude Cowork", "Claude Skills" |
| Body / list text on UI mockups | Medium-weight sans-serif | "inbox-triaging", "Sales-follow ups", "/humanizer" |

Rules:
- 2-3 words per line maximum
- Maximum 2 lines of primary text
- White on dark backgrounds, black on light backgrounds, always
- No outlines, no shadows except subtle for legibility on busy backgrounds
- No gradient fills on text
- The text usually breaks across lines mid-phrase for rhythm ("AUTOMATE / ANYTHING", "SKILLS = / SUPERPOWERS")

## Layout Patterns

### With Ben (the dominant pattern, ~73% of all thumbnails)

```
+-----------------------------------------+
|  TEXT BLOCK              [    BEN   ]   |
|  TEXT BLOCK              [   PHOTO  ]   |
|                          [          ]   |
|  [supporting visual]     [    on    ]   |
|  [coral folder/app/UI]   [   right  ]   |
|                          [   third  ]   |
+-----------------------------------------+
```

- Text on the LEFT third, top-anchored
- Supporting visual (folder, app icon, UI mockup, asterisk) below or beside the text on the left/center
- Ben on the RIGHT third, full chest-up framing, eyes to camera
- A hand-drawn white curved arrow from the text or visual pointing toward the key element

A small minority mirror this (Ben on the left, text on the right) when it serves the topic.

### Without Ben (~27% of thumbnails)

```
+-----------------------------------------+
|        TOP-CENTERED TEXT BLOCK          |
|                                         |
|     [icon]   +   [icon]   +   [icon]    |
|       or                                |
|     [stacked visual elements]           |
+-----------------------------------------+
```

- Text top-centered, single line or two lines
- Icons/visuals/UI mockups stacked or rowed below
- Often a `[thing A]  +  [thing B]` formula for "X plus Y" topics
- Hand-drawn arrow pointing to the rightmost or final element

## Ben's On-Camera Look

Locked. The reference photo (`medias[0]` in every `new-with-ben` call) anchors the face. These are the surrounding details to specify in every prompt:

- **Wardrobe**: plain black t-shirt or black hoodie. Never a suit, never branded apparel, never bright colors.
- **Framing**: chest-up. Head fills roughly 40 to 55% of the right third's height.
- **Expression**: one of: slight smile (default), focused neutral, big smile (for celebratory topics), slight forward lean (for "you should care" topics).
- **Gaze**: direct to camera. Off-axis only for rare "looking at the screen" framings.
- **Lighting**: soft key from the front-left or front-right, gentle rim light separating Ben from the dark background, no harsh shadows.
- **Hair**: natural messy short red. Don't describe it; let the reference photo carry it.
- **Microphone**: a podcast-style microphone visible bottom-right is common. Optional but on-brand.

## Recurring Visual Vocabulary

These motifs appear across many thumbnails and define the Ben AI look. Reference them by name in prompts.

### Coral asterisk / starburst icon

A radial starburst, ~12 rays, in coral `#E97B5D` with a small white center dot. The Claude/Anthropic-adjacent mark. Use as:
- A small accent in the corner of a folder icon
- A decorative element next to a list item ("* important point")
- A standalone hero icon for "Skills" or "AI" topics

Prompt phrase: `a coral starburst icon, 12 rays radiating from a small white center, flat design`

### Coral folder

A flat-style file folder, body in coral `#E97B5D`, with a white tab. Often has a `/skill-name` label or a Skills label.

Prompt phrase: `a flat coral colored file folder icon with a white tab, the word "SKILLS" or "/skill-name" written on the body in black bold text`

### Coral app icon (rounded square)

A rounded-square app icon (iOS-style), coral background `#E97B5D`, with a white logo glyph centered. Cowork's icon is the most common (a stylized lightning-bolt / Z shape).

Prompt phrase: `a rounded square app icon with coral background and a white minimalist glyph in the center`

### White hand-drawn curved arrow

The signature element. A thick white arrow with a slight hand-drawn / sketchy quality, curving from one part of the thumbnail to another. Usually arcs from the text block toward the key visual.

Prompt phrase: `a thick white hand-drawn curved arrow with a sketchy quality, arcing from the text on the left toward the visual element on the right`

### Yellow highlight box

A flat yellow `#FFD93D` rectangle behind a single word, marker-highlighter style, with the text on top in black.

Prompt phrase: `a flat yellow highlighter box behind the word "X", with the word rendered in black bold text on top`

### UI mockup card

A simplified, slightly stylized rendering of a real interface: Claude desktop, a browser window, a file manager, a dashboard, a video editor. White or dark card background, simplified controls, only the essential UI elements visible. Often shown floating on the dark thumbnail background with a slight drop shadow.

Prompt phrase: `a simplified UI mockup of {interface}, white card with rounded corners, slight drop shadow, only essential UI elements visible, slightly stylized not photoreal`

## Composition Rules

1. **Subject on a third, never centered** (when Ben is in frame). Ben right third, text left third.
2. **The eye should travel left-to-right**: text first, then Ben, then the arrow resolves to the key visual.
3. **One coral element per thumbnail minimum**, ideally two (e.g., folder + asterisk).
4. **One arrow per thumbnail.** More than one is too busy.
5. **Dot-grid texture on dark backgrounds.** A subtle pattern, not aggressive. Adds depth without competing.
6. **Negative space matters.** ~30 to 40% of the frame stays uncluttered.
7. **Logos: pass real logo PNGs as references when available; never hallucinate them; never leave a logo-shaped gap.** Three cases: (a) a real logo PNG is in `Projects/youtube/thumbnails/logos/` or attached by the user → pass it as a `medias[]` entry and instruct the prompt to render it from the reference. (b) No logo PNG is available → describe the element generically (don't name the brand), let the user composite in post. (c) Never reserve an empty rectangle in the render for a logo (produces awkward blank box). The thumbnail fills its frame edge-to-edge either way.

## What Makes a Thumbnail Off-Brand

If a generated thumbnail has any of these, redo it:
- Wrong palette (any banned color appearing as primary)
- Centered text + centered Ben (no off-third composition)
- Multiple arrows
- No coral element anywhere
- Text outline or drop-shadow effects
- Photoreal vs slightly-stylized mismatch in the supporting visuals
- Logo rendered by the model (must be composited in post)
- Cartoon or illustrated rendering of Ben (always photoreal)
- Background gradients that fight the dot-grid pattern (only special thematic thumbnails use gradients, like the "7 levels" rainbow strip)

## Reference Anchors

The thumbnails most worth pointing prompts at as `medias[]` style references:

| Filename | Why it's an anchor |
|---|---|
| `2026-04-25_LLE6oMh7SxE_claude-routines-99pct.jpg` | Cleanest "with Ben + UI mockup" example |
| `2026-03-14_FAEKF-nr3D0_cowork-marketing.jpg` | The cream-background variant with serif wordmark + list pattern |
| `2026-02-24_X3uum6W2xEI_build-claude-skills-99pct.jpg` | The folder + arrow + Ben canonical combo |
| `2026-03-09_3cYusISFc9s_claude-skills-2-99pct.jpg` | Cleanest without-Ben "A → B" composition |
| `2026-04-11_l5Diqeoffa4_7-levels-claude-context.jpg` | The gradient/rainbow strip exception, useful for "N levels" or "tiers" topics |

These live in `Projects/youtube/thumbnails/published/with-ben/` and `/without-ben/`.
