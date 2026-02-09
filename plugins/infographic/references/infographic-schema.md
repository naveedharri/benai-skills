# Infographic Specification Schema

This is the complete data structure for an infographic. Use this to ensure you've collected everything needed before generation.

---

## 1. Core Message

| Field | Description | Required |
|-------|-------------|----------|
| `coreInsight` | The ONE thing the viewer should remember | Yes |
| `supportingPoints` | 3-8 points that support the insight | Yes |
| `tensionStatement` | What vs. what? (hidden vs. visible, old vs. new, etc.) | Yes |
| `emotionalTone` | How should the viewer FEEL? (surprised, inspired, informed) | No |

---

## 2. Content Structure

| Field | Description | Required |
|-------|-------------|----------|
| `contentType` | Simple (3-5 points) / Medium (6-10) / Complex (10+) | Yes |
| `format` | Single infographic / Series of N | Yes |
| `seriesOutline` | If series: what each post covers | If series |

---

## 3. Visual Concept

| Field | Description | Required |
|-------|-------------|----------|
| `relationshipType` | Revelation / Hierarchy / Transformation / Composition / Contrast / Sequence | Yes |
| `conceptShape` | Description of the idea's "shape" | Yes |
| `metaphor` | Chosen visual metaphor (iceberg, pyramid, etc.) | Yes |
| `metaphorRationale` | WHY this metaphor fits this content | Yes |
| `contentMapping` | How each point maps to the visual structure | Yes |

### Content Mapping Examples

**For Iceberg:**
```json
{
  "aboveWater": ["Point visible to everyone", "Another visible point"],
  "belowWater": ["Hidden effort 1", "Hidden effort 2", "Hidden effort 3"],
  "waterlineLabel": "What separates visible from hidden"
}
```

**For Pyramid:**
```json
{
  "tiers": [
    {"level": 1, "label": "Foundation", "points": ["Base point 1"]},
    {"level": 2, "label": "Middle", "points": ["Middle point"]},
    {"level": 3, "label": "Peak", "points": ["Pinnacle"]}
  ]
}
```

**For Timeline:**
```json
{
  "steps": [
    {"number": 1, "title": "Start", "description": "..."},
    {"number": 2, "title": "Middle", "description": "..."},
    {"number": 3, "title": "End", "description": "..."}
  ]
}
```

---

## 4. Platform & Format

| Field | Description | Required |
|-------|-------------|----------|
| `platform` | LinkedIn / Instagram / Twitter / Presentation | Yes |
| `aspectRatio` | 4:5 / 1:1 / 16:9 / 9:16 | Yes |
| `pixelDimensions` | Calculated from aspect ratio | Auto |

---

## 5. Visual Style

| Field | Description | Required |
|-------|-------------|----------|
| `styleSource` | Website extraction / Preset / Manual / Default | Yes |
| `primaryColor` | Hex code | Yes |
| `accentColor` | Hex code | Yes |
| `backgroundColor` | Hex code | Yes |
| `textColor` | Hex code (auto-calculated for contrast) | Auto |
| `fontStyle` | clean sans-serif / serif / handwritten / bold | Yes |
| `visualTone` | professional / playful / bold / minimal | Yes |

---

## 6. Layout Details

| Field | Description | Required |
|-------|-------------|----------|
| `textPlacement` | Title at top / Integrated with visual / Minimal text | Yes |
| `visualHierarchy` | One dominant / Balanced / Progressive reveal | Yes |
| `titleStyle` | Bold & large / Elegant & thin / Handwritten / All caps | Yes |
| `textDensity` | Minimal (3-5) / Moderate (5-8) / Detailed (8+) | Yes |
| `borderStyle` | Thin border / No border / Rounded corners | Yes |
| `visualElements` | Icons / Illustrations / Text and shapes only | Yes |

---

## 7. Exact Text Content

| Field | Description | Required |
|-------|-------------|----------|
| `title` | Exact title text (in quotes) | Yes |
| `subtitle` | Exact subtitle text (if any) | No |
| `labels` | Array of exact label text | Yes |
| `annotations` | Any additional text annotations | No |
| `callToAction` | CTA text if applicable | No |

---

## 8. Generation Details

| Field | Description | Required |
|-------|-------------|----------|
| `promptApproved` | User approved the generation prompt | Yes |
| `filename` | Output filename | Auto |
| `apiKeyAvailable` | Whether to call API or output prompt only | Auto |

---

## Validation Checklist

Before generating, verify:

- [ ] Core insight is clear and singular
- [ ] Tension/relationship type identified
- [ ] Metaphor chosen with explicit rationale
- [ ] Content mapped to visual structure
- [ ] All exact text collected (in quotes)
- [ ] Style fully specified (colors, fonts, tone)
- [ ] Layout details confirmed
- [ ] Aspect ratio matches platform
- [ ] User approved the complete prompt

---

## Extraction Tips

When extracting from user's raw content (posts, notes, ideas):

### Finding the Core Insight
- Look for: "The key thing is...", "What people don't realize...", "The truth is..."
- Look for contrasts: "not X, but Y", "vs.", "the difference between"
- Look for surprises: "actually", "surprisingly", "contrary to"

### Finding Supporting Points
- Look for numbered lists (explicit or implicit)
- Look for bullet patterns: "First... Second... Third..."
- Look for parallel structure: same sentence patterns

### Identifying Relationship Type
- **Revelation signals**: "behind the scenes", "what you don't see", "hidden"
- **Hierarchy signals**: "levels of", "from basic to advanced", "foundation"
- **Transformation signals**: "before/after", "journey", "became", "evolved"
- **Composition signals**: "parts of", "components", "together form"
- **Contrast signals**: "vs.", "compared to", "unlike", "but"
- **Sequence signals**: "step 1", "then", "next", "finally"

### Extracting Metrics/Data
- Look for: numbers, percentages, time frames, comparisons
- Look for: "increased by", "reduced", "saved", "grew"
- Look for: before/after data pairs

### Identifying Emotional Tone
- Surprising/revealing: "most people think X, but actually Y"
- Aspirational: "how to achieve", "path to success"
- Corrective: "stop doing X", "the mistake everyone makes"
- Educational: "here's how", "understanding", "framework"

---

## Complete Example

```json
{
  "coreMessage": {
    "coreInsight": "Success is 90% invisible execution, not visible talent",
    "supportingPoints": [
      "10% talent (what people see)",
      "20% strategy (hidden planning)",
      "70% execution (daily grind)"
    ],
    "tensionStatement": "What people see vs. what it actually takes",
    "emotionalTone": "surprising, corrective"
  },
  "contentStructure": {
    "contentType": "simple",
    "format": "single"
  },
  "visualConcept": {
    "relationshipType": "revelation",
    "conceptShape": "Hidden depth beneath visible surface",
    "metaphor": "iceberg",
    "metaphorRationale": "The 10/90 split maps perfectly to above/below waterline",
    "contentMapping": {
      "aboveWater": ["Talent (10%)"],
      "belowWater": ["Strategy (20%)", "Execution (70%)"],
      "waterlineLabel": "What people see"
    }
  },
  "platform": {
    "platform": "linkedin",
    "aspectRatio": "4:5",
    "pixelDimensions": "1080x1350"
  },
  "visualStyle": {
    "styleSource": "preset",
    "primaryColor": "#2563EB",
    "accentColor": "#F59E0B",
    "backgroundColor": "#FAFAFA",
    "textColor": "#1F2937",
    "fontStyle": "clean sans-serif",
    "visualTone": "professional"
  },
  "layoutDetails": {
    "textPlacement": "title-at-top",
    "visualHierarchy": "one-dominant",
    "titleStyle": "bold-large",
    "textDensity": "minimal",
    "borderStyle": "no-border",
    "visualElements": "text-and-shapes"
  },
  "textContent": {
    "title": "The Iceberg of Success",
    "subtitle": "What it really takes",
    "labels": ["Talent 10%", "Strategy 20%", "Execution 70%"]
  }
}
```
