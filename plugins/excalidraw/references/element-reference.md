# Excalidraw Element Reference

Complete JSON specifications for all element types. This is the definitive guide for generating valid Excalidraw clipboard data.

---

## CRITICAL RULES

### 1. One Slide = One Clipboard Payload

Each slide must be generated as a complete, self-contained JSON structure:

```javascript
{
  "type": "excalidraw/clipboard",
  "elements": [ /* ALL elements for this slide */ ],
  "files": {}
}
```

Do NOT split a slide across multiple injections. One inject = one complete slide.

### 2. All Elements Share GroupIds

Every element in a slide MUST have the same `groupIds` value. This ensures:
- All elements move together when selected
- Copy/paste works correctly
- No orphan elements

```javascript
const slideGroupId = `slide${N}-group-${Math.random().toString(36).substr(2, 6)}`;
// Example: "slide1-group-x7k2m"

// Apply to EVERY element:
"groupIds": [slideGroupId]
```

### 3. Frame Goes First

The slide frame (background rectangle) must be the FIRST element in the array. All other elements render on top.

### 4. Bound Elements Link Both Ways

When text is inside a shape:
- Container's `boundElements` lists the text: `[{ "id": "text-id", "type": "text" }]`
- Text's `containerId` points to container: `"containerId": "container-id"`

---

## Required Properties (ALL Elements)

Every element MUST include these properties:

```json
{
  "id": "unique-string-id",
  "type": "rectangle",
  "x": 100,
  "y": 100,
  "width": 200,
  "height": 80,
  "angle": 0,
  "strokeColor": "#1e1e1e",
  "backgroundColor": "#a5d8ff",
  "fillStyle": "solid",
  "strokeWidth": 2,
  "strokeStyle": "solid",
  "roughness": 1,
  "opacity": 100,
  "seed": 1001,
  "version": 1,
  "versionNonce": 1,
  "isDeleted": false,
  "groupIds": ["slide1-group-abc123"],
  "boundElements": null,
  "link": null,
  "locked": false
}
```

### Property Reference

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | Unique identifier, use descriptive format: `s1-title`, `s1-box-email` |
| `type` | string | Element type: `rectangle`, `ellipse`, `diamond`, `text`, `arrow`, `line`, `freedraw` |
| `x`, `y` | number | Top-left corner position in canvas coordinates |
| `width`, `height` | number | Dimensions in pixels |
| `angle` | number | Rotation in radians (0 = no rotation) |
| `strokeColor` | string | Border/line color (hex) |
| `backgroundColor` | string | Fill color (hex) or `"transparent"` |
| `fillStyle` | string | `"solid"`, `"hachure"`, `"cross-hatch"`, `"dots"` |
| `strokeWidth` | number | Border thickness: 1 (thin), 2 (normal), 4 (bold) |
| `strokeStyle` | string | `"solid"`, `"dashed"`, `"dotted"` |
| `roughness` | number | Hand-drawn feel: 0 (clean), 1 (subtle), 2 (sketchy) |
| `opacity` | number | 0-100 (100 = fully opaque) |
| `seed` | number | Random seed for roughness (unique per element) |
| `version` | number | Always 1 for new elements |
| `versionNonce` | number | Always 1 for new elements |
| `isDeleted` | boolean | Always `false` |
| `groupIds` | array | Group membership: `["slide1-group-xyz"]` |
| `boundElements` | array/null | Child elements bound to this container |
| `link` | string/null | URL link (usually `null`) |
| `locked` | boolean | Prevent editing (usually `false`) |

---

## Creative Element Usage

### Don't Just Build Boxes — Tell Visual Stories

Each element has a personality. Use them intentionally:

| Element | Beyond Basic | Creative Applications |
|---------|--------------|----------------------|
| **Rectangle** | Not just "cards" | Platforms to stand on, building blocks stacking, windows/portals, road segments, timeline blocks |
| **Ellipse** | Not just "bubbles" | Planets/orbits, spotlights, thought clouds, ripples in water, focal points, magnifying lenses |
| **Diamond** | Not just "decision points" | Warning signs, gems/value, turning points, pivot moments, status indicators |
| **Arrow** | Not just "next step" | Growth trajectories, forces/pressure, cause→effect, transformation paths, energy flows |
| **Line** | Not just "dividers" | Ground/horizon, connections, underlines for emphasis, paths walked, timelines |
| **Freedraw** | Not just "scribbles" | Handwritten emphasis, organic wrappers, circling things, rough underlining, energy/motion |

### Element Combinations for Metaphors

| Concept | Element Combination | How It Works |
|---------|---------------------|--------------|
| **Growth** | Rectangles stacking upward + upward arrow | Visualizes building/rising |
| **Transformation** | Diamond in center + radiating arrows | Shows change spreading outward |
| **Journey** | Curved line + small ellipses as waypoints | Path with milestones |
| **Core concept** | Large ellipse center + smaller ellipses around + connecting lines | Hub and satellites |
| **Layers/Depth** | Nested rectangles (large→medium→small) | Onion/containment |
| **Tension** | Two shapes pulling in opposite directions + stretched arrows | Visual conflict |
| **Balance** | Triangle as fulcrum + line + two equal shapes on ends | Scale/equilibrium |
| **Explosion/Impact** | Central point + radiating arrows in all directions | Energy release |
| **Funnel/Focus** | Wide shape narrowing to small shape + downward arrows | Convergence |
| **Cycle** | Ellipses in circle + curved arrows connecting them | Continuous loop |

### Shape Sizing for Visual Hierarchy

| Role | Relative Size | Why |
|------|---------------|-----|
| **Primary focal point** | Largest (1.5-2x others) | Eye goes here first |
| **Main concepts** | Standard size | Core content |
| **Supporting details** | 0.7x standard | Supplementary |
| **Annotations/labels** | Smallest | Clarifying text |

### Stroke and Fill for Depth

Create foreground/midground/background:

| Layer | strokeWidth | Fill Saturation | Use For |
|-------|-------------|-----------------|---------|
| **Foreground** | 2-4 | Full color (#a5d8ff) | Primary focus |
| **Midground** | 1-2 | Light tint (#d0ebff) | Supporting elements |
| **Background** | 1 | Very light (#f1f3f5) | Context, structure |

### Making Elements Feel Connected

Isolated elements feel random. Create visual relationships:

1. **Overlap slightly** — Elements touching feels intentional
2. **Align edges** — Elements sharing a baseline feel grouped
3. **Use consistent spacing** — Equal gaps = visual rhythm
4. **Share colors** — Same fill = same category
5. **Connect with arrows/lines** — Explicit relationships
6. **Nest inside containers** — Shows containment/grouping

---

## Element Types

### Rectangle

For: cards, containers, boxes, buttons, frames

```json
{
  "type": "rectangle",
  "id": "s1-card-1",
  "x": 100, "y": 100,
  "width": 200, "height": 80,
  "angle": 0,
  "strokeColor": "#1971c2",
  "backgroundColor": "#a5d8ff",
  "fillStyle": "solid",
  "strokeWidth": 2,
  "strokeStyle": "solid",
  "roughness": 1,
  "opacity": 100,
  "roundness": { "type": 3 },
  "seed": 1001,
  "version": 1,
  "versionNonce": 1,
  "isDeleted": false,
  "groupIds": ["slide1-group-abc"],
  "boundElements": null,
  "link": null,
  "locked": false
}
```

**Roundness options:**
- `{ "type": 3 }` — Rounded corners (use for cards, buttons, containers)
- `null` — Sharp corners (use for frames, technical diagrams)

---

### Ellipse

For: circles, ovals, organic blobs, hubs, nodes

```json
{
  "type": "ellipse",
  "id": "s1-hub-center",
  "x": 350, "y": 200,
  "width": 120, "height": 120,
  "angle": 0,
  "strokeColor": "#1971c2",
  "backgroundColor": "#a5d8ff",
  "fillStyle": "solid",
  "strokeWidth": 2,
  "strokeStyle": "solid",
  "roughness": 1,
  "opacity": 100,
  "roundness": { "type": 2 },
  "seed": 1002,
  "version": 1,
  "versionNonce": 1,
  "isDeleted": false,
  "groupIds": ["slide1-group-abc"],
  "boundElements": null,
  "link": null,
  "locked": false
}
```

**Note:** For perfect circle, use equal width and height.

---

### Diamond

For: decision points, emphasis, process nodes, status indicators

```json
{
  "type": "diamond",
  "id": "s1-decision-1",
  "x": 200, "y": 150,
  "width": 100, "height": 100,
  "angle": 0,
  "strokeColor": "#f08c00",
  "backgroundColor": "#fff3bf",
  "fillStyle": "solid",
  "strokeWidth": 2,
  "strokeStyle": "solid",
  "roughness": 1,
  "opacity": 100,
  "roundness": { "type": 2 },
  "seed": 1003,
  "version": 1,
  "versionNonce": 1,
  "isDeleted": false,
  "groupIds": ["slide1-group-abc"],
  "boundElements": null,
  "link": null,
  "locked": false
}
```

---

### Text (Standalone)

For: titles, labels, annotations, captions

```json
{
  "type": "text",
  "id": "s1-title",
  "x": 250, "y": 30,
  "width": 300, "height": 40,
  "angle": 0,
  "strokeColor": "#1e1e1e",
  "backgroundColor": "transparent",
  "fillStyle": "solid",
  "strokeWidth": 1,
  "strokeStyle": "solid",
  "roughness": 0,
  "opacity": 100,
  "text": "Slide Title Here",
  "fontSize": 32,
  "fontFamily": 2,
  "textAlign": "center",
  "verticalAlign": "top",
  "containerId": null,
  "originalText": "Slide Title Here",
  "lineHeight": 1.25,
  "seed": 1004,
  "version": 1,
  "versionNonce": 1,
  "isDeleted": false,
  "groupIds": ["slide1-group-abc"],
  "boundElements": null,
  "link": null,
  "locked": false
}
```

**Font Sizes:**
| Context | fontSize | Estimated height |
|---------|----------|------------------|
| Slide title | 28-36 | 35-45 |
| Section header | 20-24 | 25-30 |
| Body text | 14-18 | 18-22 |
| Small label | 12-14 | 15-18 |
| Annotation/caption | 10-12 | 12-15 |

**Font Families:**
- `1` — Virgil (handwritten)
- `2` — Excalifont (recommended for presentations)
- `3` — Cascadia (monospace)

**Text Alignment:**
- `textAlign`: `"left"`, `"center"`, `"right"`
- `verticalAlign`: `"top"`, `"middle"`, `"bottom"`

**Multi-line text:** Use `\n` for line breaks. Height = `lines × fontSize × lineHeight`

---

### Text (Bound to Container)

For: labels inside boxes, button text, card content

**The Container (with boundElements):**
```json
{
  "type": "rectangle",
  "id": "s1-box-email",
  "x": 100, "y": 100,
  "width": 160, "height": 60,
  "strokeColor": "#1971c2",
  "backgroundColor": "#a5d8ff",
  "fillStyle": "solid",
  "strokeWidth": 2,
  "strokeStyle": "solid",
  "roughness": 1,
  "opacity": 100,
  "roundness": { "type": 3 },
  "seed": 1005,
  "version": 1,
  "versionNonce": 1,
  "isDeleted": false,
  "groupIds": ["slide1-group-abc"],
  "boundElements": [
    { "id": "s1-label-email", "type": "text" }
  ],
  "link": null,
  "locked": false
}
```

**The Bound Text:**
```json
{
  "type": "text",
  "id": "s1-label-email",
  "x": 110, "y": 118,
  "width": 140, "height": 24,
  "strokeColor": "#1e1e1e",
  "backgroundColor": "transparent",
  "fillStyle": "solid",
  "strokeWidth": 1,
  "strokeStyle": "solid",
  "roughness": 0,
  "opacity": 100,
  "text": "Email",
  "fontSize": 16,
  "fontFamily": 2,
  "textAlign": "center",
  "verticalAlign": "middle",
  "containerId": "s1-box-email",
  "originalText": "Email",
  "lineHeight": 1.25,
  "seed": 1006,
  "version": 1,
  "versionNonce": 1,
  "isDeleted": false,
  "groupIds": ["slide1-group-abc"],
  "boundElements": null,
  "link": null,
  "locked": false
}
```

**Bound Text Rules:**
- Text `x` = container `x` + 10 (padding)
- Text `y` = container `y` + (container `height` - text `height`) / 2 (centered)
- Text `width` = container `width` - 20 (padding)
- Container's `boundElements` MUST list the text
- Text's `containerId` MUST match container's `id`
- Use `verticalAlign: "middle"` for vertical centering

---

### Arrow

For: connections, flows, causation, direction, process steps

```json
{
  "type": "arrow",
  "id": "s1-arrow-1",
  "x": 260, "y": 130,
  "width": 80, "height": 0,
  "angle": 0,
  "strokeColor": "#495057",
  "backgroundColor": "transparent",
  "fillStyle": "solid",
  "strokeWidth": 2,
  "strokeStyle": "solid",
  "roughness": 1,
  "opacity": 100,
  "roundness": { "type": 2 },
  "points": [[0, 0], [80, 0]],
  "startArrowhead": null,
  "endArrowhead": "arrow",
  "startBinding": null,
  "endBinding": null,
  "seed": 1007,
  "version": 1,
  "versionNonce": 1,
  "isDeleted": false,
  "groupIds": ["slide1-group-abc"],
  "boundElements": null,
  "link": null,
  "locked": false
}
```

**Arrow Directions (via `points`):**

| Direction | Points Array | Notes |
|-----------|-------------|-------|
| Right → | `[[0, 0], [80, 0]]` | Horizontal right |
| Left ← | `[[0, 0], [-80, 0]]` | Horizontal left |
| Down ↓ | `[[0, 0], [0, 80]]` | Vertical down |
| Up ↑ | `[[0, 0], [0, -80]]` | Vertical up |
| Diagonal ↘ | `[[0, 0], [80, 60]]` | Down-right |
| Diagonal ↗ | `[[0, 0], [80, -60]]` | Up-right |
| Curved | `[[0, 0], [40, -30], [80, 0]]` | 3+ points = curve |
| S-curve | `[[0, 0], [40, -40], [80, 0], [120, 40], [160, 0]]` | Complex path |

**Arrow Width/Height Calculation:**
- `width` = max X coordinate in points
- `height` = max Y coordinate in points
- For `[[0,0], [80, 60]]`: width=80, height=60

**Arrowhead Types:**
- `null` — No arrowhead (line end)
- `"arrow"` — Standard arrow tip ▶
- `"triangle"` — Filled triangle ▸
- `"dot"` — Circle ●
- `"bar"` — Perpendicular line |

---

### Line

For: dividers, underlines, connectors without direction

```json
{
  "type": "line",
  "id": "s1-divider",
  "x": 50, "y": 250,
  "width": 700, "height": 0,
  "angle": 0,
  "strokeColor": "#dee2e6",
  "backgroundColor": "transparent",
  "fillStyle": "solid",
  "strokeWidth": 1,
  "strokeStyle": "solid",
  "roughness": 1,
  "opacity": 100,
  "roundness": { "type": 2 },
  "points": [[0, 0], [700, 0]],
  "seed": 1008,
  "version": 1,
  "versionNonce": 1,
  "isDeleted": false,
  "groupIds": ["slide1-group-abc"],
  "boundElements": null,
  "link": null,
  "locked": false
}
```

**Line Styles:**
- `strokeStyle: "solid"` — Continuous line
- `strokeStyle: "dashed"` — Dashed line - - -
- `strokeStyle: "dotted"` — Dotted line . . .

---

### Freedraw

For: organic shapes, hand-drawn paths, sketchy elements, custom curves

```json
{
  "type": "freedraw",
  "id": "s1-sketch-1",
  "x": 100, "y": 200,
  "width": 150, "height": 80,
  "angle": 0,
  "strokeColor": "#e03131",
  "backgroundColor": "transparent",
  "fillStyle": "solid",
  "strokeWidth": 2,
  "strokeStyle": "solid",
  "roughness": 1,
  "opacity": 100,
  "points": [
    [0, 40], [20, 20], [40, 50], [60, 10], [80, 45], 
    [100, 15], [120, 40], [150, 30]
  ],
  "pressures": [0.5, 0.6, 0.7, 0.8, 0.7, 0.6, 0.5, 0.4],
  "seed": 1009,
  "version": 1,
  "versionNonce": 1,
  "isDeleted": false,
  "groupIds": ["slide1-group-abc"],
  "boundElements": null,
  "link": null,
  "locked": false
}
```

**Use cases:**
- Underlines/emphasis marks
- Wavy lines
- Organic paths
- Handwritten-style annotations
- Circle/highlight around elements

---

### Frame (Slide Background)

Every slide starts with a frame rectangle:

```json
{
  "type": "rectangle",
  "id": "s1-frame",
  "x": 0, "y": 0,
  "width": 800, "height": 500,
  "angle": 0,
  "strokeColor": "#dee2e6",
  "backgroundColor": "#f8f9fa",
  "fillStyle": "solid",
  "strokeWidth": 1,
  "strokeStyle": "solid",
  "roughness": 0,
  "opacity": 100,
  "roundness": { "type": 3 },
  "seed": 1000,
  "version": 1,
  "versionNonce": 1,
  "isDeleted": false,
  "groupIds": ["slide1-group-abc"],
  "boundElements": null,
  "link": null,
  "locked": false
}
```

**Frame positioning by slide number:**
- Slide 1: x=0, y=0
- Slide 2: x=900, y=0
- Slide 3: x=0, y=600
- Slide 4: x=900, y=600

**All elements within a slide offset by the same x/y as the frame.**

---

## Color System

### Semantic Palette

| Role | Background | Stroke | Use For |
|------|------------|--------|---------|
| **Primary** | `#a5d8ff` | `#1971c2` | Main concepts, emphasis, containers |
| **Secondary** | `#d0ebff` | `#1971c2` | Sub-elements, lighter cards |
| **Success** | `#b2f2bb` | `#2f9e44` | Positive states, benefits, checkmarks |
| **Warning** | `#fff3bf` | `#f08c00` | Caution, attention, transitions |
| **Danger** | `#ffc9c9` | `#e03131` | Problems, negatives, pain points |
| **Neutral** | `#e9ecef` | `#495057` | Backgrounds, dividers, secondary |
| **Canvas** | `#f8f9fa` | `#dee2e6` | Slide frames, subtle backgrounds |

### Text Colors

| Context | Color |
|---------|-------|
| Primary text | `#1e1e1e` |
| Secondary text | `#495057` |
| Muted/caption | `#868e96` |
| On blue background | `#1971c2` |
| Positive/success | `#2f9e44` |
| Negative/danger | `#e03131` |
| On dark background | `#ffffff` |

---

## Sizing Standards

### Canvas Dimensions

- **Single slide:** 800 × 500 px
- **Gap between slides:** 100 px

### Element Dimensions

| Element Type | Width | Height |
|--------------|-------|--------|
| Slide frame | 800 | 500 |
| Large card | 200-280 | 80-160 |
| Medium card | 120-180 | 50-80 |
| Small card/badge | 60-100 | 30-50 |
| Hub circle | 100-140 | 100-140 |
| Icon placeholder | 40-60 | 40-60 |

### Spacing

| Context | Pixels |
|---------|--------|
| Between cards | 20-30 |
| Inside card padding | 10-15 |
| Title from top | 20-30 |
| Content zone start | 80 |
| Footer zone start | 430 |

---

## ID and Seed Conventions

### ID Format

```
s{slideNum}-{elementType}-{descriptor}
```

Examples:
- `s1-frame` — Slide 1 frame
- `s1-title` — Slide 1 title text
- `s1-box-email` — Slide 1, box for "email"
- `s1-label-email` — Label inside email box
- `s1-arrow-1` — First arrow on slide 1
- `s2-hub-center` — Slide 2 center hub

### Seed Ranges

| Slide | Seed Range |
|-------|------------|
| Slide 1 | 1000-1099 |
| Slide 2 | 2000-2099 |
| Slide 3 | 3000-3099 |
| Slide 4 | 4000-4099 |

**Rule:** Increment by 1 within each slide. No two elements share a seed.

---

## Complete Single-Slide Examples

### Example 1: Illustrative Slide (PREFERRED)

Think illustration-first. This example shows a concept using size, shape variety, and spatial relationships — not just cards:

**Concept:** "One thing becomes many" (e.g., farming → modern industries)
- One large ellipse (the origin) dominates the left
- Thin radiating lines connect to scattered smaller ellipses of varying sizes on the right
- Small unlabeled dots suggest "and more beyond what's shown"
- The visual mass on the right clearly exceeds the left — you SEE the expansion
- Text is minimal: labels on shapes, nothing else

**Key techniques used:**
- **Size contrast:** Large origin vs small derivatives — shows the transformation
- **Shape variety:** Ellipses for organic concepts, not rectangles
- **Scattered positioning:** Not a grid — feels like an explosion, which IS the concept
- **Radiating lines:** Show connection without heavy arrows
- **Unlabeled dots:** Suggest abundance without cluttering with text

Always try to build slides like this FIRST. Only fall back to cards when the content is genuinely a list of equal items.

### Example 2: Card-Based Slide (FALLBACK)

Here's a complete, copy-paste ready slide with a title, three cards, and connecting arrows. Use this pattern ONLY for homogeneous lists (features, team members, pricing tiers):

```json
{
  "type": "excalidraw/clipboard",
  "elements": [
    {
      "type": "rectangle",
      "id": "s1-frame",
      "x": 0, "y": 0, "width": 800, "height": 500, "angle": 0,
      "strokeColor": "#dee2e6", "backgroundColor": "#f8f9fa",
      "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid",
      "roughness": 0, "opacity": 100,
      "roundness": { "type": 3 },
      "seed": 1000, "version": 1, "versionNonce": 1, "isDeleted": false,
      "groupIds": ["slide1-group-demo"], "boundElements": null, "link": null, "locked": false
    },
    {
      "type": "text",
      "id": "s1-title",
      "x": 250, "y": 30, "width": 300, "height": 40, "angle": 0,
      "strokeColor": "#1e1e1e", "backgroundColor": "transparent",
      "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid",
      "roughness": 0, "opacity": 100,
      "text": "Three-Step Process", "fontSize": 32, "fontFamily": 2,
      "textAlign": "center", "verticalAlign": "top",
      "containerId": null, "originalText": "Three-Step Process", "lineHeight": 1.25,
      "seed": 1001, "version": 1, "versionNonce": 1, "isDeleted": false,
      "groupIds": ["slide1-group-demo"], "boundElements": null, "link": null, "locked": false
    },
    {
      "type": "rectangle",
      "id": "s1-box-1",
      "x": 100, "y": 180, "width": 160, "height": 80, "angle": 0,
      "strokeColor": "#1971c2", "backgroundColor": "#a5d8ff",
      "fillStyle": "solid", "strokeWidth": 2, "strokeStyle": "solid",
      "roughness": 1, "opacity": 100,
      "roundness": { "type": 3 },
      "seed": 1002, "version": 1, "versionNonce": 1, "isDeleted": false,
      "groupIds": ["slide1-group-demo"],
      "boundElements": [{ "id": "s1-label-1", "type": "text" }],
      "link": null, "locked": false
    },
    {
      "type": "text",
      "id": "s1-label-1",
      "x": 110, "y": 208, "width": 140, "height": 24, "angle": 0,
      "strokeColor": "#1e1e1e", "backgroundColor": "transparent",
      "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid",
      "roughness": 0, "opacity": 100,
      "text": "Step 1: Plan", "fontSize": 16, "fontFamily": 2,
      "textAlign": "center", "verticalAlign": "middle",
      "containerId": "s1-box-1", "originalText": "Step 1: Plan", "lineHeight": 1.25,
      "seed": 1003, "version": 1, "versionNonce": 1, "isDeleted": false,
      "groupIds": ["slide1-group-demo"], "boundElements": null, "link": null, "locked": false
    },
    {
      "type": "arrow",
      "id": "s1-arrow-1",
      "x": 270, "y": 220, "width": 60, "height": 0, "angle": 0,
      "strokeColor": "#495057", "backgroundColor": "transparent",
      "fillStyle": "solid", "strokeWidth": 2, "strokeStyle": "solid",
      "roughness": 1, "opacity": 100,
      "roundness": { "type": 2 },
      "points": [[0, 0], [60, 0]],
      "startArrowhead": null, "endArrowhead": "arrow",
      "startBinding": null, "endBinding": null,
      "seed": 1004, "version": 1, "versionNonce": 1, "isDeleted": false,
      "groupIds": ["slide1-group-demo"], "boundElements": null, "link": null, "locked": false
    },
    {
      "type": "rectangle",
      "id": "s1-box-2",
      "x": 340, "y": 180, "width": 160, "height": 80, "angle": 0,
      "strokeColor": "#2f9e44", "backgroundColor": "#b2f2bb",
      "fillStyle": "solid", "strokeWidth": 2, "strokeStyle": "solid",
      "roughness": 1, "opacity": 100,
      "roundness": { "type": 3 },
      "seed": 1005, "version": 1, "versionNonce": 1, "isDeleted": false,
      "groupIds": ["slide1-group-demo"],
      "boundElements": [{ "id": "s1-label-2", "type": "text" }],
      "link": null, "locked": false
    },
    {
      "type": "text",
      "id": "s1-label-2",
      "x": 350, "y": 208, "width": 140, "height": 24, "angle": 0,
      "strokeColor": "#1e1e1e", "backgroundColor": "transparent",
      "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid",
      "roughness": 0, "opacity": 100,
      "text": "Step 2: Build", "fontSize": 16, "fontFamily": 2,
      "textAlign": "center", "verticalAlign": "middle",
      "containerId": "s1-box-2", "originalText": "Step 2: Build", "lineHeight": 1.25,
      "seed": 1006, "version": 1, "versionNonce": 1, "isDeleted": false,
      "groupIds": ["slide1-group-demo"], "boundElements": null, "link": null, "locked": false
    },
    {
      "type": "arrow",
      "id": "s1-arrow-2",
      "x": 510, "y": 220, "width": 60, "height": 0, "angle": 0,
      "strokeColor": "#495057", "backgroundColor": "transparent",
      "fillStyle": "solid", "strokeWidth": 2, "strokeStyle": "solid",
      "roughness": 1, "opacity": 100,
      "roundness": { "type": 2 },
      "points": [[0, 0], [60, 0]],
      "startArrowhead": null, "endArrowhead": "arrow",
      "startBinding": null, "endBinding": null,
      "seed": 1007, "version": 1, "versionNonce": 1, "isDeleted": false,
      "groupIds": ["slide1-group-demo"], "boundElements": null, "link": null, "locked": false
    },
    {
      "type": "rectangle",
      "id": "s1-box-3",
      "x": 580, "y": 180, "width": 160, "height": 80, "angle": 0,
      "strokeColor": "#f08c00", "backgroundColor": "#fff3bf",
      "fillStyle": "solid", "strokeWidth": 2, "strokeStyle": "solid",
      "roughness": 1, "opacity": 100,
      "roundness": { "type": 3 },
      "seed": 1008, "version": 1, "versionNonce": 1, "isDeleted": false,
      "groupIds": ["slide1-group-demo"],
      "boundElements": [{ "id": "s1-label-3", "type": "text" }],
      "link": null, "locked": false
    },
    {
      "type": "text",
      "id": "s1-label-3",
      "x": 590, "y": 208, "width": 140, "height": 24, "angle": 0,
      "strokeColor": "#1e1e1e", "backgroundColor": "transparent",
      "fillStyle": "solid", "strokeWidth": 1, "strokeStyle": "solid",
      "roughness": 0, "opacity": 100,
      "text": "Step 3: Launch", "fontSize": 16, "fontFamily": 2,
      "textAlign": "center", "verticalAlign": "middle",
      "containerId": "s1-box-3", "originalText": "Step 3: Launch", "lineHeight": 1.25,
      "seed": 1009, "version": 1, "versionNonce": 1, "isDeleted": false,
      "groupIds": ["slide1-group-demo"], "boundElements": null, "link": null, "locked": false
    }
  ],
  "files": {}
}
```

This is a complete, valid slide payload ready for clipboard injection.