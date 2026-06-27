# PPTX Generation Guide

Technical reference for generating case study presentations using PptxGenJS.
Read the PPTX skill at `/mnt/skills/public/pptx/SKILL.md` and `pptxgenjs.md` first.

---

## Setup

```bash
npm install -g pptxgenjs react-icons react react-dom sharp
pip install "markitdown[pptx]" Pillow --break-system-packages
```

---

## Architecture

Generate the presentation as a single Node.js script that:
1. Imports pptxgenjs and icon libraries
2. Defines brand constants from the saved config
3. Creates helper functions for common patterns (cards, stats, quote boxes)
4. Builds slides one by one
5. Writes to file
6. Runs QA

---

## Brand Config Integration

Load from `case-study-config.json` and define constants:

```javascript
const pptxgen = require("pptxgenjs");
const config = require("./case-study-config.json");

const BRAND = {
  primary: config.brand.colors.primary,      // e.g., "1A73E8"
  secondary: config.brand.colors.secondary,  // e.g., "FFFEF8"
  accent: config.brand.colors.accent,        // e.g., "E06A67"
  text: config.brand.colors.text,            // e.g., "0a0c0c"
  headingFont: config.brand.fonts.heading,   // e.g., "Georgia"
  bodyFont: config.brand.fonts.body,         // e.g., "Calibri"
};
```

---

## Helper Functions

### Factory Functions (CRITICAL: avoid reusing mutable objects)

```javascript
// Always use factory functions for options that PptxGenJS mutates
const makeShadow = () => ({
  type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.12
});

const makeCardBg = (color = "FFFFFF") => ({
  fill: { color },
  shadow: makeShadow()
});
```

### Icon Rendering

```javascript
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");

function renderIconSvg(IconComponent, color, size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color: "#" + color, size: String(size) })
  );
}

async function iconToBase64(IconComponent, color, size = 256) {
  const svg = renderIconSvg(IconComponent, color, size);
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + png.toString("base64");
}
```

### Card Component

```javascript
function addCard(slide, { x, y, w, h, title, description, icon, accentColor }) {
  // Background
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: "FFFFFF" },
    shadow: makeShadow()
  });

  // Accent bar (left edge)
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 0.06, h,
    fill: { color: accentColor || BRAND.primary }
  });

  // Title
  slide.addText(title, {
    x: x + 0.25, y: y + 0.15, w: w - 0.4, h: 0.35,
    fontSize: 14, fontFace: BRAND.headingFont, color: BRAND.text, bold: true, margin: 0
  });

  // Description
  slide.addText(description, {
    x: x + 0.25, y: y + 0.5, w: w - 0.4, h: h - 0.65,
    fontSize: 11, fontFace: BRAND.bodyFont, color: "555555", margin: 0
  });
}
```

### Stat Callout

```javascript
function addStatCallout(slide, { x, y, w, value, label, context }) {
  // Large number
  slide.addText(value, {
    x, y, w, h: 0.7,
    fontSize: 48, fontFace: BRAND.headingFont, color: BRAND.primary,
    bold: true, align: "center", margin: 0
  });

  // Label
  slide.addText(label, {
    x, y: y + 0.7, w, h: 0.3,
    fontSize: 12, fontFace: BRAND.bodyFont, color: BRAND.text,
    bold: true, align: "center", margin: 0
  });

  // Context (optional)
  if (context) {
    slide.addText(context, {
      x, y: y + 1.0, w, h: 0.25,
      fontSize: 10, fontFace: BRAND.bodyFont, color: "888888",
      align: "center", margin: 0
    });
  }
}
```

---

## Slide Templates

### Title Slide
- Background: BRAND.primary (dark)
- Client logo: top-left or centered
- "CASE STUDY" in small caps, charSpacing: 6
- Client name: large, white, centered
- Tagline: below, lighter weight

### Executive Summary
- Background: BRAND.secondary (light)
- Left section: 2-3 challenge mini-cards
- Right section: Key outcomes as stat callouts
- Bottom: Pull quote with accent border

### Challenges
- Background: BRAND.secondary
- Section title with numbered emoji icons (🎯 ⚙️ 🔧 🎨)
- Challenge cards in 2-column or 3-column grid
- Each card: accent left border + title + description

### Objectives
- Background: BRAND.secondary
- Large numbers (01, 02, 03) in BRAND.accent
- Title + description pairs
- Clean, spacious layout

### Actions Taken
- Background: BRAND.secondary
- Numbered or icon-marked action items
- Title bold, description regular
- If evidence exists: split layout with image right

### Results
- Background: white or very light
- Hero metric: centered, huge (60-72pt)
- Supporting metrics: row of stat callouts below
- Before/after comparison if available

### Quote Slide
- Background: BRAND.primary or BRAND.secondary
- Large opening quotation mark in BRAND.accent (decorative)
- Quote text: 22-28pt, italic, BRAND.text or white
- Attribution: name + title, smaller

### CTA / Contact
- Background: BRAND.primary (dark, matching title)
- Company name + logo
- Contact details
- Website + social links
- "Let's work together" or similar CTA

---

## Layout Guidelines

- **Slide dimensions:** 10" × 5.625" (16:9)
- **Margins:** 0.5" minimum from all edges
- **Content area:** 9" × 4.625"
- **Gap between elements:** 0.3" minimum
- **Vary layouts:** Don't use the same layout two slides in a row
- **Visual on every slide:** Icon, shape, card, chart, or image

---

## Generation Workflow

1. Write the complete Node.js script
2. Run it: `node generate-case-study.js`
3. QA content: `python -m markitdown output.pptx`
4. QA visual: Convert to images and inspect with subagent
5. Fix issues → re-run → re-verify
6. Copy final file to `/mnt/user-data/outputs/`

---

## Common Patterns from Real Case Studies

Based on analysis of ContentPath case studies:

- **Cream/warm backgrounds** (FFFEF8, F5F0EB) feel premium
- **Serif headings + sans body** (Georgia + Calibri) feels professional
- **Emoji as section icons** (🎯 📊 ⚡ 🚀) adds personality without being childish
- **Blue primary + red accent** is high-contrast and trustworthy
- **Cards with left accent borders** are a signature ContentPath pattern
- **Large stat numbers** make metrics scannable and shareable
- **Full-page quote slides** add emotional weight between data-heavy slides
