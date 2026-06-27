---
name: gif-creator
description: Create animated GIF and static PNG infographics for LinkedIn posts following Ben AI's exact brand guidelines. Use this skill whenever the user wants to visualize a process, workflow, or step-by-step concept for LinkedIn — including phrases like "make a visual", "create a GIF", "infographic for LinkedIn", "visualize this workflow", "diagram for LinkedIn", "animated post", "process visual", or any request to turn a LinkedIn post or concept into a visual format. Always use this skill in combination with linkedin-post when the user wants both a written post and a visual.
---

# LinkedIn Visual Animation

Create polished, on-brand animated GIF and static PNG infographics for LinkedIn posts. These visuals follow Ben AI's exact brand guidelines and are designed for maximum engagement on LinkedIn.

## Two-Step Process

This skill follows a strict two-step interactive process. Never skip to creating the visual without Step 1 approval.

### Step 1: Suggest Visualization Approaches

Before creating anything, propose 2-3 different ways to visualize the content. Consider:

- **Vertical process flow**: Steps stacked top-to-bottom with arrows (best for sequential workflows, 4-10 steps)
- **Comparison grid**: Side-by-side cards comparing approaches (best for before/after, tool comparisons)
- **Hub and spoke**: Central concept with radiating connections (best for ecosystems, tool stacks)
- **Timeline**: Horizontal or vertical timeline with milestones (best for journeys, evolution)
- **Numbered list cards**: Clean cards with numbers (best for tips, tools lists, rankings)

For each suggestion, briefly explain:
1. The layout type
2. What content goes in each card/node
3. Why it fits this particular content

Wait for user to confirm which approach before proceeding.

### Step 2: Create the GIF and PNG

Once the approach is confirmed, build the visual using PIL/Pillow following the exact brand guidelines below. Always output both:
- An animated GIF (nodes appearing one by one)
- A static PNG (final frame, for fallback)

Save both to the outputs folder.

## Brand Guidelines

These are non-negotiable. Every visual must follow these exactly.

### Canvas Size
- **Final output**: 800 x 998 pixels (portrait, ~4:5 ratio — optimal for LinkedIn)
- **Render at 3x**: 2400 x 2994 pixels, then downscale with LANCZOS for crisp text
- Never change these dimensions

### Colors

| Role | Color | Hex |
|------|-------|-----|
| Background | Light yellow | #FAF3E3 `(250, 243, 227)` |
| Card background | White | #FFFFFF `(255, 255, 255)` |
| Border / shadow / text | Near-black | #020309 `(2, 3, 9)` |
| Title accent | Green | `(72, 160, 120)` |
| Gray text (descriptions) | Gray | `(100, 100, 100)` |
| Divider lines | Warm gray | `(210, 205, 190)` |

### Phase Colors (for category tags on cards)

| Phase | Color | Hex |
|-------|-------|-----|
| INPUT | Dark yellow | #FDEEC4 `(253, 238, 196)` |
| PLAN | Light blue | #E5F5F9 `(229, 245, 249)` |
| ENGINE | Light blue | #E5F5F9 `(229, 245, 249)` |
| EXEC | Green | #D2ECD0 `(210, 236, 208)` |
| DEBUG | Red/pink | #F3C1C0 `(243, 193, 192)` |

Phase tags are optional — use them when the content has clear phases/categories.

### Typography
- **Title**: Poppins Bold, 108pt at 3x (36pt final)
- **Subtitle**: Poppins Medium, 42pt at 3x (14pt final)
- **Card label**: Poppins Bold, 51pt at 3x (17pt final)
- **Card description**: Poppins Medium, 36pt at 3x (12pt final)
- **Step numbers**: Poppins Bold, 39pt at 3x (13pt final)
- **Footer**: Poppins Medium, 36pt at 3x (12pt final)
- **Phase tags**: Poppins Bold, 30pt at 3x (10pt final)

Font paths: `/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf` and `Poppins-Medium.ttf`

### Card Style
- **Solid shadow**: offset 15px at 3x (5px final), color #020309
- **Solid border**: 6px at 3x (2px final), color #020309
- **Rounded corners**: 30px at 3x (10px final)
- **Card dimensions** (for vertical flow): 1560 x 195 at 3x
- **Gap between cards**: 84px at 3x
- White background with color accent strip on the left edge
- Text (label + description) vertically centered within card

### Layout Structure (Vertical Process Flow)
- Title area: ~390px at 3x (top)
- Footer: ~150px at 3x (bottom)
- Cards centered horizontally and vertically in remaining space
- Downward arrows between cards (5px line, triangular arrowhead)

### Footer
Always include: `"Ben Van Sprundel  |  Founder @ BenAI"`

## Icons and Logos

Add relevant icons/logos to cards where they make sense. Draw them programmatically with PIL (do not rely on external image files). Available logo drawing patterns:

- **Claude logo**: Orange starburst with rays radiating from center circle. Color: `(224, 125, 79)`
- **n8n logo**: Pink connected nodes (3 circles with connecting lines). Color: `(234, 72, 108)`
- **Google Meet logo**: Colored camera icon with quadrants (blue, green, red, yellow)
- **Document icon**: Gray rounded rectangle with horizontal text lines inside

For other tools/concepts, draw simple representative icons using PIL primitives (ellipses, rectangles, polygons). Keep icons small (45px radius at 3x) and positioned on the left side of each card.

See `references/template-code.py` for complete logo drawing implementations.

## Animation Pattern

The GIF animation reveals content progressively:

1. **Title hold**: Show title + subtitle + footer for ~12 frames (1.2s at 100ms/frame)
2. **Node reveal**: Add one card at a time, each holding for ~7 frames (0.7s). Arrows appear as connecting cards are revealed.
3. **Final hold**: Complete visual holds for ~30 frames (4.5s at 150ms/frame) so viewers see the full picture.

Frame timing: 100ms per frame for reveal, 150ms for final hold. Aim for under 300KB total.

## Rendering Technique

This is critical for sharp text:

```python
SCALE = 3
WIDTH = 800 * SCALE   # 2400
HEIGHT = 998 * SCALE   # 2994

# ... draw everything at 3x size ...

# Downscale for crisp final output
final = img.resize((800, 998), Image.LANCZOS)
```

Always render at 3x and downscale. Text rendered at 1x or 2x will look blurry on LinkedIn.

## Text Alignment in Cards

Vertically center the text block (label + gap + description) within each card:

```python
label_bbox = draw.textbbox((0, 0), label, font=FONT_NODE_LABEL)
label_h = label_bbox[3] - label_bbox[1]
desc_bbox = draw.textbbox((0, 0), desc, font=FONT_NODE_DESC)
desc_h = desc_bbox[3] - desc_bbox[1]
text_gap = 12
total_text_h = label_h + text_gap + desc_h
text_top = card_y + (CARD_H - total_text_h) // 2
```

This prevents text from floating too high or low in cards.

## Dependencies

```bash
pip install pillow --break-system-packages
```

PIL (Pillow) is the only required dependency.

## Reference Code

For the complete working implementation (logo drawing functions, card rendering, animation frame generation), read:

```
references/template-code.py
```

This contains a fully tested template that produces a vertical process flow infographic. Adapt it for each new visual by changing the NODES data, title text, and logo assignments.

## Adaptation Guide

When creating a new visual, adapt the template by:

1. **Change NODES list**: Update labels, descriptions, phase colors, phase tags, and logo types
2. **Change title text**: Update `part1`, `part2` (accent colored), and subtitle
3. **Adjust card count**: Recalculate `total_cards_h` and `start_y` based on number of nodes
4. **Add new logo types**: If the content references tools not in the template, draw new icons using PIL primitives following the same pattern (RGBA overlay, paste with transparency)
5. **Choose layout**: For non-sequential content, adapt the positioning logic (grid, radial, etc.) while keeping all brand guidelines intact

## Quality Checklist

Before delivering, verify:
- [ ] Canvas is exactly 800x998
- [ ] Rendered at 3x (2400x2994) and downscaled with LANCZOS
- [ ] Background is #FAF3E3
- [ ] Cards have solid black shadows, borders, and rounded corners
- [ ] Text is crisp (not blurry)
- [ ] Text is vertically centered in cards
- [ ] Footer includes "Ben Van Sprundel | Founder @ BenAI"
- [ ] Both GIF and static PNG are saved
- [ ] GIF file size is under 500KB
- [ ] Logos/icons are drawn programmatically (no external files)