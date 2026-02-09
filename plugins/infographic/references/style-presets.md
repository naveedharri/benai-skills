# Style Presets

Pre-defined color palettes and style combinations for quick style selection. Use these when the user doesn't have brand guidelines or wants to choose from proven combinations.

---

## The 5 Preset Palettes

### 1. Professional Blue

**Best for:** Corporate content, LinkedIn thought leadership, B2B, finance, tech

| Role | Color | Hex |
|------|-------|-----|
| Primary | Blue | `#2563EB` |
| Accent | Amber | `#F59E0B` |
| Background | Off-white | `#FAFAFA` |
| Text | Dark gray | `#1F2937` |
| Light fill | Light blue | `#DBEAFE` |

**Visual characteristics:**
- Trustworthy, established, reliable
- High contrast for readability
- Works well with white backgrounds
- Pairs naturally with corporate photography

**Prompt snippet:**
```
Colors: #2563EB blue for primary elements, #F59E0B amber for highlights
and accents, #FAFAFA off-white background. Text in #1F2937 dark gray.
Light fills in #DBEAFE pale blue.
```

---

### 2. Warm Coral

**Best for:** Creative industries, wellness, coaching, consumer brands, community

| Role | Color | Hex |
|------|-------|-----|
| Primary | Coral | `#F97316` |
| Accent | Teal | `#14B8A6` |
| Background | Cream | `#FFFBEB` |
| Text | Dark brown | `#292524` |
| Light fill | Light coral | `#FFEDD5` |

**Visual characteristics:**
- Energetic, approachable, warm
- Feels human and personal
- Great for coaching, lifestyle, health content
- Stands out in feeds dominated by blue

**Prompt snippet:**
```
Colors: #F97316 coral for primary elements, #14B8A6 teal for accents,
#FFFBEB cream background. Text in #292524 dark brown. Light fills in
#FFEDD5 pale coral.
```

---

### 3. Modern Purple

**Best for:** Creative agencies, innovation, startups, SaaS, design

| Role | Color | Hex |
|------|-------|-----|
| Primary | Purple | `#7C3AED` |
| Accent | Emerald | `#10B981` |
| Background | Lavender white | `#FAF5FF` |
| Text | Dark purple | `#1E1B4B` |
| Light fill | Light purple | `#EDE9FE` |

**Visual characteristics:**
- Creative, innovative, premium
- Signals modernity and forward-thinking
- Works well for tech/SaaS content
- Purple conveys expertise and creativity

**Prompt snippet:**
```
Colors: #7C3AED purple for primary elements, #10B981 emerald for accents,
#FAF5FF lavender-white background. Text in #1E1B4B dark purple. Light
fills in #EDE9FE pale purple.
```

---

### 4. Minimal Mono

**Best for:** Design-focused brands, editorial, luxury, minimalist aesthetics

| Role | Color | Hex |
|------|-------|-----|
| Primary | Black | `#111827` |
| Accent | Red | `#EF4444` |
| Background | White | `#FFFFFF` |
| Text | Dark gray | `#374151` |
| Light fill | Light gray | `#F3F4F6` |

**Visual characteristics:**
- Bold, striking, high-impact
- Maximum contrast for attention
- Red accent creates focal points
- Sophisticated, editorial feel

**Prompt snippet:**
```
Colors: #111827 black for primary elements, #EF4444 red for accents
and emphasis, #FFFFFF pure white background. Text in #374151 dark gray.
Light fills in #F3F4F6 light gray.
```

---

### 5. Soft Earth

**Best for:** Sustainability, wellness, organic brands, education, NGOs

| Role | Color | Hex |
|------|-------|-----|
| Primary | Forest green | `#166534` |
| Accent | Terracotta | `#C2410C` |
| Background | Warm white | `#FFFEF7` |
| Text | Dark green | `#14532D` |
| Light fill | Sage | `#DCFCE7` |

**Visual characteristics:**
- Natural, grounded, trustworthy
- Calm and reassuring
- Great for sustainability/eco content
- Feels authentic and down-to-earth

**Prompt snippet:**
```
Colors: #166534 forest green for primary elements, #C2410C terracotta
for accents, #FFFEF7 warm white background. Text in #14532D dark green.
Light fills in #DCFCE7 soft sage.
```

---

## Using Presets in AskUserQuestion

When presenting presets to users, format as:

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

If user needs a 5th option in the AskUserQuestion (since we have 5 presets but max 4 options), combine Minimal Mono and Soft Earth as "Other" and ask a follow-up.

---

## Quick Selection Guide

| User's Industry/Content | Recommended Preset |
|------------------------|-------------------|
| Finance, consulting, B2B | Professional Blue |
| Coaching, wellness, personal brand | Warm Coral |
| Tech startup, SaaS, creative agency | Modern Purple |
| Design, luxury, editorial | Minimal Mono |
| Sustainability, education, NGO | Soft Earth |

---

## Extending Presets

If the user likes a preset but wants modifications:

**Darker version:**
- Shift background toward the light fill color
- Use primary color at 80% saturation

**Lighter version:**
- Use light fill as primary
- Primary becomes accent
- White background

**Warmer version:**
- Shift blues toward purple
- Shift greens toward teal
- Shift grays toward brown

**Cooler version:**
- Shift oranges toward pink
- Shift browns toward gray
- Add blue undertones

---

## When to Skip Presets

Skip preset selection when:
- User provided a website URL (extract colors instead)
- User knows their exact hex codes
- User has existing brand guidelines
- Pattern bank has saved preferences from previous sessions

Always offer presets as a fallback if extraction fails or user declines other options.
