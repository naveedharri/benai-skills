# Image Editing Guide

Multi-turn Gemini editing workflow for iterating on generated infographics based on user feedback.

---

## When to Use Multi-Turn Editing

Use image editing (not regeneration) when:
- User likes the overall direction but wants specific changes
- Changes are localized (color, text, spacing)
- User says "adjust," "tweak," "change," or "fix"
- Maintaining visual consistency with the original is important

Regenerate from scratch when:
- User says "start over" or "try a different approach"
- The metaphor or concept itself needs to change
- Changes would affect 50%+ of the image

---

## The Edit Workflow

### Step 1: Collect Specific Feedback

Use `AskUserQuestion` to understand what to change:

```
question: "What would you like to change?"
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

### Step 2: Drill Down on Each Selection

For each category selected, ask a follow-up question:

**Colors:**
```
question: "What's wrong with the colors?"
header: "Color fix"
options:
  - label: "Make it lighter/brighter"
    description: "Current palette feels too dark"
  - label: "Make it bolder/richer"
    description: "Colors feel washed out"
  - label: "Wrong tone (warmer/cooler)"
    description: "Shift the overall color temperature"
  - label: "Change specific color"
    description: "I'll tell you which one"
```

**Text:**
```
question: "What about the text?"
header: "Text fix"
options:
  - label: "Reword the title"
    description: "Change what the title says"
  - label: "Adjust labels"
    description: "Change the supporting text"
  - label: "Resize text"
    description: "Make text larger or smaller"
  - label: "Move text"
    description: "Change text placement"
```

**Layout:**
```
question: "What layout issue?"
header: "Layout fix"
options:
  - label: "More whitespace"
    description: "Feels too crowded"
  - label: "Less whitespace"
    description: "Too much empty space"
  - label: "Realign elements"
    description: "Things don't line up right"
  - label: "Change composition"
    description: "Different arrangement"
```

**Style:**
```
question: "What style issue?"
header: "Style fix"
options:
  - label: "Simplify"
    description: "Too busy, reduce visual elements"
  - label: "Add detail"
    description: "Too plain, add visual interest"
  - label: "Change feel"
    description: "Wrong visual tone overall"
```

### Step 3: Craft the Edit Prompt

Combine all feedback into a specific edit instruction:

```
Edit this infographic with the following changes:

1. [Change 1 - be specific]
2. [Change 2 - be specific]
3. [Change 3 - be specific]

Keep everything else exactly the same, including:
- Overall layout and composition
- Visual metaphor structure
- All other colors not mentioned
- All text not mentioned
```

### Step 4: Send Image with Edit Instructions

```bash
# Encode the current image
IMAGE_B64=$(base64 -i current-infographic.png)

# Send to Gemini with edit instructions
curl -s -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent" \
  -H "x-goog-api-key: ${GEMINI_API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"contents\": [{
      \"parts\": [
        {\"inlineData\": {\"mimeType\": \"image/png\", \"data\": \"${IMAGE_B64}\"}},
        {\"text\": \"Edit this infographic: [specific edit instructions]\"}
      ]
    }]
  }" | jq -r '.candidates[0].content.parts[] | select(.inlineData) | .inlineData.data' | base64 -d > infographic-v2.png
```

### Step 5: Show Before/After (Optional)

For significant changes, show comparison:

```
Here's the comparison:

Before: [show v1]
After: [show v2]

The changes:
- [What was changed]

Does this look right?
```

### Step 6: Iterate or Finalize

Use `AskUserQuestion`:

```
question: "How does this version look?"
header: "Result"
options:
  - label: "Perfect!"
    description: "This is exactly what I wanted"
  - label: "Better, but needs more tweaks"
    description: "Keep going with more adjustments"
  - label: "Not right, revert"
    description: "Go back to the previous version"
```

---

## Edit Prompt Patterns

### Color Changes

**Lighten:**
```
Edit this infographic: make all colors lighter and brighter.
Increase luminosity by 20%. Keep the same hue relationships.
```

**Darken:**
```
Edit this infographic: make the colors richer and more saturated.
Deepen the primary color. Keep the layout identical.
```

**Warmer:**
```
Edit this infographic: shift the color palette warmer.
Add orange/yellow undertones. Replace cool blues with warmer tones.
Keep the same layout and text.
```

**Cooler:**
```
Edit this infographic: shift the color palette cooler.
Add blue undertones. Replace warm oranges with cooler alternatives.
Keep the same layout and text.
```

**Specific color:**
```
Edit this infographic: change the blue elements (#2563EB) to purple (#7C3AED).
Keep all other colors the same.
```

### Text Changes

**Reword title:**
```
Edit this infographic: change the title from "[old title]" to "[new title]".
Keep the exact same font, size, position, and styling.
```

**Resize text:**
```
Edit this infographic: make all text 20% larger for better readability.
Maintain the same relative hierarchy between title, subtitle, and labels.
```

**Move text:**
```
Edit this infographic: move the title from the top-left to center-top.
Keep everything else in the same position.
```

### Layout Changes

**More whitespace:**
```
Edit this infographic: add more whitespace around all elements.
Reduce the size of the main visual by 15% and increase margins.
Keep the same content and style.
```

**Realign:**
```
Edit this infographic: center-align all text elements.
Make sure the visual hierarchy is clear with consistent spacing.
```

### Style Changes

**Simplify:**
```
Edit this infographic: simplify the design.
Remove decorative elements, reduce the number of colors to 3,
and increase whitespace. Keep the core content.
```

**Add detail:**
```
Edit this infographic: add more visual interest.
Include simple line icons next to each label. Add a subtle texture
to the background. Keep the same layout.
```

---

## Version Management

### Naming Convention

Keep track of iterations:
- `infographic-topic-v1.png` — Original
- `infographic-topic-v2.png` — After first edit
- `infographic-topic-v3.png` — After second edit
- `infographic-topic-final.png` — Approved version

### Preserving History

Before each edit, copy the current version:
```bash
cp infographic-topic.png infographic-topic-v1.png
```

After edit:
```bash
mv infographic-topic-v2.png infographic-topic.png
```

### Rollback

If user wants to revert:
```bash
cp infographic-topic-v1.png infographic-topic.png
```

---

## Common Edit Scenarios

### "Make it more professional"

```
Edit this infographic: make the design more professional and corporate.
- Use cleaner lines and sharper edges
- Remove any hand-drawn elements
- Increase whitespace
- Ensure text is perfectly aligned
- Use a more muted color palette
```

### "Make it more playful"

```
Edit this infographic: make the design more playful and approachable.
- Soften corners and edges
- Add subtle hand-drawn touches to lines
- Make colors slightly more vibrant
- Add small decorative elements (dots, squiggles)
```

### "Make it pop more"

```
Edit this infographic: increase visual impact.
- Boost contrast between elements
- Make the primary color more saturated
- Increase the size of the title by 25%
- Add a subtle shadow behind the main visual
```

### "Too busy, simplify"

```
Edit this infographic: simplify the design significantly.
- Remove all decorative elements
- Reduce to 2 colors plus white
- Increase whitespace by 30%
- Keep only the essential text labels
```

---

## When Editing Fails

If the edit doesn't produce the expected result:

1. **Try a more specific prompt:**
   Add more detail about exactly what to change and what to preserve.

2. **Try a different approach:**
   Instead of "make it warmer," try "change blue #2563EB to coral #F97316."

3. **Fall back to regeneration:**
   If edits aren't working, regenerate with an updated prompt that incorporates the desired changes.

---

## Tracking Feedback for Pattern Bank

After completing the edit cycle, record:
- What the user liked (things they didn't change)
- What the user changed (the edits requested)

This data goes into `.infographic-patterns.json` to improve future sessions.
