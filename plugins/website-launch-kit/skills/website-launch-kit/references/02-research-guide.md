# Research Guide

How to analyze inspiration sites and extract design direction for customization.

## When User Shares an Inspiration URL

### Step 1: Fetch and Analyze

Use `WebFetch` immediately with this prompt structure:

```
Analyze this website for design extraction:
- Primary colors (hex codes)
- Secondary/accent colors
- Background colors
- Typography: heading font, body font, font sizes
- Spacing patterns (tight, normal, generous)
- Layout approach (centered, asymmetric, full-width)
- Hero style (text-focused, image-focused, video, illustration)
- Animation style (none, subtle, dramatic)
- Overall vibe in 3 words
```

**If WebFetch fails (site blocked):** Use `agent-browser` CLI instead. See `14-browser-automation.md` for commands.

```bash
agent-browser open <url>
agent-browser screenshot --full inspiration.png
agent-browser get text body > content.txt
```

### Step 2: Report Back

Present findings to the user:

```
"I analyzed [site]. Here's what I extracted:

COLORS:
- Primary: #XXXXXX (describe: bold blue, soft sage, etc.)
- Secondary: #XXXXXX
- Background: #XXXXXX
- Accent: #XXXXXX

TYPOGRAPHY:
- Headings: [font name] - [weight] - [style description]
- Body: [font name] - [size pattern]
- Character: [modern, classic, playful, etc.]

LAYOUT:
- Structure: [centered content / full-width / asymmetric]
- Spacing: [tight / normal / generous whitespace]
- Grid: [12-col / flexible / single column]

HERO TREATMENT:
- Style: [text-heavy / image-focused / video / split]
- Animation: [none / subtle fade / dramatic entrance]

VIBE: [3 words that capture the feel]

Is this the direction? What specifically do you like about it?"
```

### Step 3: Clarify Preferences

Ask follow-up questions:

```
"From this inspiration, I want to confirm:

1. Colors - Use these exact colors, or just the 'feel'?
2. Typography - Match the font style, or suggest alternatives?
3. Layout - Follow this structure closely, or just take inspiration?
4. Animations - Include similar motion, or keep it simpler?
"
```

---

## Design Extraction Checklist

### Colors to Extract

| Element | What to Look For |
|---------|-----------------|
| Primary | Buttons, links, key elements |
| Secondary | Cards, backgrounds, sections |
| Accent | Highlights, hover states, badges |
| Text | Headings, body, muted text |
| Background | Page bg, section alternates |

### Typography to Note

| Element | Details |
|---------|---------|
| H1 | Size, weight, letter-spacing |
| H2-H3 | Size ratio to H1 |
| Body | Size, line-height, font |
| Labels | Uppercase? Size? Weight? |

### Spacing Patterns

| Pattern | Description |
|---------|-------------|
| Tight | 16-24px between elements |
| Normal | 32-48px between elements |
| Generous | 64-96px+ between sections |

### Layout Patterns

| Pattern | Description |
|---------|-------------|
| Centered | Max-width container, centered |
| Full-width | Edge-to-edge sections |
| Asymmetric | Off-center, overlapping elements |
| Grid-breaking | Elements that cross column lines |

---

## Competitor Analysis

If user shares a competitor link:

### What to Look For

1. **Messaging gaps** - What are they NOT saying that you could?
2. **Visual opportunities** - If they're corporate, you could be bold
3. **Positioning holes** - Markets they ignore
4. **Tone differences** - How can you sound different?

### Report Format

```
"I analyzed [competitor]. Opportunities I see:

THEY SAY: [their main message]
YOU COULD SAY: [alternative positioning]

THEIR VIBE: [description]
YOUR OPPORTUNITY: [how to differentiate visually]

THEY TARGET: [their audience]
YOU COULD OWN: [underserved segment]
"
```

---

## Current Site Analysis

If user shares their existing website:

### What to Preserve

- Good copy (phrases that resonate)
- Brand elements (logo, colors if they like them)
- Content that works (testimonials, case studies)
- SEO elements (meta descriptions, existing rankings)

### What to Change

- Outdated design patterns
- Weak messaging
- Poor hierarchy
- Slow performance elements

### Report Format

```
"I analyzed your current site. Here's my take:

KEEP:
- [good element] - because [reason]
- [good copy] - this resonates

CHANGE:
- [weak element] - replace with [suggestion]
- [outdated pattern] - modernize to [approach]

OVERALL: [summary of transformation needed]
"
```

---

## Brand Assets Review

If user adds files to `brand-assets/` folder:

### What to Look For

| Asset Type | Extract |
|------------|---------|
| Logo | Colors, style (wordmark, icon, combo) |
| Brand guidelines | Typography, color codes, spacing rules |
| Photos | Style (professional, candid, stock) |
| Screenshots | Product UI style, key features |
| Copy docs | Voice, key phrases, terminology |

### Report Format

```
"I reviewed your brand assets:

LOGO: [description, format available]
COLORS: [extracted from guidelines or logo]
FONTS: [if specified]
PHOTOS: [available / need to source]
COPY: [any reusable content]

Ready to incorporate these into the design."
```

---

## Research Output

After research phase, compile into a design brief:

```
DESIGN BRIEF
============

INSPIRATION SOURCE: [URL]
COMPETITOR INSIGHTS: [key differentiators]
EXISTING BRAND: [what to preserve]

COLOR PALETTE:
- Primary: #XXXXXX
- Secondary: #XXXXXX
- Accent: #XXXXXX
- Background: #XXXXXX
- Text: #XXXXXX

TYPOGRAPHY:
- Headings: [font] [weight]
- Body: [font] [size]
- Style: [modern/classic/playful]

LAYOUT APPROACH:
- Structure: [centered/full-width/asymmetric]
- Spacing: [tight/normal/generous]
- Hero: [style]

ANIMATION LEVEL:
- [none/subtle/dramatic]

VIBE IN 3 WORDS:
- [word 1], [word 2], [word 3]
```

This brief feeds into the Design System (07-design-system.md) for implementation.
