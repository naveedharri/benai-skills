# Infographic Style Guide

Visual design rules, layout principles, and platform-specific guidelines for creating professional infographics.

---

## Core Design Principles

### 1. The "One Visual Metaphor" Rule

Every infographic should use **one** primary visual metaphor. Do not mix metaphors in a single image. If you need multiple metaphors, create a series.

**Good:** A pyramid showing leadership levels
**Bad:** A pyramid with an iceberg inside it and a timeline along the side

### 2. Simplify Ruthlessly

If a viewer can't understand the infographic in 5 seconds, it's too complex.

- Maximum 6-8 text labels per infographic
- Each label: 2-5 words (never full sentences)
- One clear takeaway per image
- If you're cutting content, you're doing it right

### 3. White Space is Your Friend

Target **40%+ empty canvas**. White space:
- Directs the eye to what matters
- Prevents visual overwhelm
- Makes the design feel professional
- Improves readability on mobile

---

## Color Systems

### Default Palettes

Use these if the user has no brand colors:

**Professional Blue**
| Role | Color | Hex |
|------|-------|-----|
| Primary | Blue | `#2563EB` |
| Accent | Amber | `#F59E0B` |
| Background | Off-white | `#FAFAFA` |
| Text | Dark gray | `#1F2937` |
| Light fill | Light blue | `#DBEAFE` |

**Warm Coral**
| Role | Color | Hex |
|------|-------|-----|
| Primary | Coral | `#F97316` |
| Accent | Teal | `#14B8A6` |
| Background | Cream | `#FFFBEB` |
| Text | Dark brown | `#292524` |
| Light fill | Light coral | `#FFEDD5` |

**Modern Purple**
| Role | Color | Hex |
|------|-------|-----|
| Primary | Purple | `#7C3AED` |
| Accent | Emerald | `#10B981` |
| Background | Off-white | `#FAF5FF` |
| Text | Dark purple | `#1E1B4B` |
| Light fill | Light purple | `#EDE9FE` |

**Minimal Mono**
| Role | Color | Hex |
|------|-------|-----|
| Primary | Black | `#111827` |
| Accent | Red | `#EF4444` |
| Background | White | `#FFFFFF` |
| Text | Dark gray | `#374151` |
| Light fill | Light gray | `#F3F4F6` |

### Color Rules

1. **3-color maximum** — Primary + Accent + Background. Add black/white for text.
2. **Soft pastels for fills** — Use light/tinted versions of primary colors for background fills
3. **Bold colors for emphasis** — Use full-saturation colors only for titles, key numbers, or highlights
4. **Consistent meaning** — Same color = same category throughout the infographic
5. **Contrast for readability** — Dark text on light backgrounds, light text on dark backgrounds

### Color in Prompts

When specifying colors in Gemini prompts, be explicit:

```
"Use #2563EB blue for the main elements, #F59E0B amber for highlights,
and #FAFAFA off-white background. Text should be #1F2937 dark gray."
```

---

## Typography Rules

### Text Guidelines

| Element | Size Guidance | Max Length | Style |
|---------|--------------|------------|-------|
| Title | Large, bold | 3-6 words | All caps or title case |
| Subtitle | Medium | 5-10 words | Sentence case |
| Labels | Small-medium | 2-5 words | Short phrases |
| Numbers/stats | Extra large, bold | 1-3 characters | Standalone feature |
| Annotations | Small | 3-8 words | Italic or lighter weight |

### Font Style Recommendations

| Tone | Font Style | Prompt Instruction |
|------|-----------|-------------------|
| Professional | Clean sans-serif | "modern clean sans-serif font" |
| Creative | Rounded sans-serif | "friendly rounded font" |
| Academic | Serif | "professional serif font" |
| Playful | Hand-drawn | "casual handwritten-style font" |
| Bold | Heavy sans-serif | "bold condensed sans-serif font" |

### Text Placement

- **Floating text** — Labels that sit next to their visual element, not inside boxes
- **Colored pills/badges** — Short labels on colored rounded rectangles
- **Curved arrows with annotations** — Hand-drawn feel connectors with text
- **Underlined keywords** — Draw attention to key terms

---

## Hand-Drawn Feel Elements

Adding a slight hand-drawn quality makes infographics feel warm and approachable:

- **Curved arrows** — Not perfectly straight, slight wobble
- **Annotation lines** — Thin lines connecting labels to elements
- **Underlines** — Wavy or rough underlines for emphasis
- **Doodle icons** — Simple line-art icons (lightbulb, checkmark, star)
- **Dotted paths** — Dotted lines showing connections or flow

**When to use:** Professional-but-approachable content (LinkedIn thought leadership, educational content)

**When to avoid:** Data-heavy content, corporate reports, formal presentations

---

## Layout Templates

### Vertical (4:5 — LinkedIn/Instagram Portrait)

```
┌────────────────────┐
│                    │
│    TITLE           │
│    subtitle        │
│                    │
│  ┌──────────────┐  │
│  │              │  │
│  │   MAIN       │  │
│  │   VISUAL     │  │
│  │   AREA       │  │
│  │              │  │
│  │   (60% of    │  │
│  │    canvas)   │  │
│  │              │  │
│  └──────────────┘  │
│                    │
│    footer/source   │
│                    │
└────────────────────┘
```

### Square (1:1 — Instagram/LinkedIn)

```
┌──────────────────────┐
│                      │
│   TITLE              │
│                      │
│   ┌────────────────┐ │
│   │                │ │
│   │  MAIN VISUAL   │ │
│   │  (centered)    │ │
│   │                │ │
│   └────────────────┘ │
│                      │
│   key takeaway       │
│                      │
└──────────────────────┘
```

### Landscape (16:9 — Twitter/Presentation)

```
┌──────────────────────────────────────┐
│                                      │
│  TITLE          ┌──────────────────┐ │
│  subtitle       │                  │ │
│                 │   MAIN VISUAL    │ │
│  Key points:    │                  │ │
│  • Point 1      │                  │ │
│  • Point 2      └──────────────────┘ │
│  • Point 3                           │
│                                      │
└──────────────────────────────────────┘
```

---

## Platform-Specific Sizing

| Platform | Ratio | Pixels | Notes |
|----------|-------|--------|-------|
| LinkedIn feed | 4:5 | 1080×1350 | Best engagement |
| LinkedIn feed | 1:1 | 1080×1080 | Universal |
| LinkedIn carousel | 4:5 | 1080×1350 | Each slide |
| Instagram feed | 1:1 | 1080×1080 | Standard |
| Instagram feed | 4:5 | 1080×1350 | Portrait |
| Twitter/X | 16:9 | 1200×675 | Timeline optimal |
| Stories | 9:16 | 1080×1920 | Full screen vertical |
| Presentation | 16:9 | 1920×1080 | Standard slides |

---

## What to Avoid

### Too Complex
- More than 8 text labels
- Multiple visual metaphors mixed together
- Dense paragraphs of text
- More than 5 colors
- Overlapping elements with no clear hierarchy

### Too Boring
- Just text in boxes with no visual metaphor
- Plain bullet lists formatted as an image
- No color variation (all one shade)
- No visual hierarchy (everything same size)

### Common Mistakes
- **Text too small** — If it won't be readable on a phone, make it bigger or cut it
- **No focal point** — Every infographic needs ONE element that draws the eye first
- **Cluttered edges** — Keep margins generous, nothing touching the borders
- **Inconsistent style** — Don't mix 3D and flat, or hand-drawn and geometric
- **Rainbow colors** — Stick to 3 colors max, not the full spectrum

---

## Series Consistency

When creating a multi-post series:

1. **Same color palette** across all posts
2. **Same font style** across all posts
3. **Same layout family** (e.g., all vertical, all with top title)
4. **Consistent visual language** (if post 1 uses icons, all posts use icons)
5. **Series numbering** visible on each post (e.g., "1/4", "2/4")
6. **Title treatment** consistent (same position, same style)

### Series Cover vs Content Posts

- **Post 1 (cover):** Bold title, minimal content, sets the visual tone
- **Posts 2-N (content):** Consistent layout, one sub-topic per post
- **Final post (summary):** Recap or call-to-action, ties back to cover style
