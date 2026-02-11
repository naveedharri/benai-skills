# Website Design Extraction Skill

When WebFetch is blocked, use the built-in browser tools to analyze inspiration websites.

---

## When to Use This

- WebFetch returns "blocked" or fails
- Site requires JavaScript to render
- Need visual screenshots for design analysis
- Analyzing dynamic/interactive elements

---

## Method 1: Browser Subagent (Recommended)

Use `browser_subagent` to navigate and capture the site:

### Step 1: Navigate and Screenshot

```
browser_subagent(
  Task: "Navigate to [URL]. Take a full-page screenshot. 
         Scroll down the entire page and take screenshots of each section.
         Extract: colors, typography, layout, spacing, animations, overall vibe.",
  RecordingName: "site_analysis"
)
```

### Step 2: Analyze Screenshots

After the subagent returns, view the screenshots to extract:

| Element | What to Look For |
|---------|------------------|
| Colors | Primary (buttons, links), Secondary (cards), Background |
| Typography | Heading fonts, body fonts, sizes, weights |
| Layout | Centered, full-width, asymmetric, grid |
| Spacing | Tight (16-24px), Normal (32-48px), Generous (64-96px+) |
| Hero | Text-focused, image-focused, split, video |
| Animations | None, subtle fades, dramatic entrances |

### Step 3: Report Findings

Present extracted design elements to user:

```
DESIGN EXTRACTION: [URL]

COLORS:
- Primary: [color] - used for [buttons/links/etc]
- Secondary: [color] - used for [cards/backgrounds]
- Background: [color]
- Text: [color]

TYPOGRAPHY:
- Headings: [description]
- Body: [description]
- Style: [modern/classic/playful]

LAYOUT:
- Structure: [centered/full-width/asymmetric]
- Spacing: [tight/normal/generous]

HERO:
- Style: [text-heavy/image-focused/split]
- Animation: [none/subtle/dramatic]

VIBE: [3 words]
```

---

## Method 2: Direct Browser Navigation

For more control, use step-by-step browser commands:

### Open and Capture

```
browser_subagent(
  Task: "1. Navigate to [URL]
         2. Wait for page to fully load
         3. Take screenshot of above-the-fold content
         4. Scroll to bottom of page slowly, taking screenshots every viewport
         5. Return paths to all screenshots",
  RecordingName: "design_capture"
)
```

### Extract Specific Sections

```
browser_subagent(
  Task: "Navigate to [URL]. 
         Find and screenshot these sections:
         - Hero section
         - Features/Services section
         - Testimonials section
         - Pricing section (if exists)
         - Footer
         For each, note the design patterns used.",
  RecordingName: "section_analysis"
)
```

---

## Design Extraction Checklist

### Colors to Extract

| Element | Where to Look |
|---------|---------------|
| Primary | Buttons, links, key CTAs |
| Secondary | Cards, section backgrounds |
| Accent | Highlights, hover states, badges |
| Text | Headings, body, muted text |
| Background | Page bg, section alternates |

### Typography to Note

| Element | Details to Capture |
|---------|-------------------|
| H1 | Size, weight, letter-spacing |
| H2-H3 | Size ratio to H1 |
| Body | Size, line-height, font family |
| Labels | Uppercase? Size? Weight? |

### Spacing Patterns

| Pattern | Typical Values |
|---------|---------------|
| Tight | 16-24px between elements |
| Normal | 32-48px between elements |
| Generous | 64-96px+ between sections |

### Layout Patterns

| Pattern | Description |
|---------|-------------|
| Centered | Max-width container, centered content |
| Full-width | Edge-to-edge sections |
| Asymmetric | Off-center, overlapping elements |
| Grid-breaking | Elements crossing column lines |

---

## Example: Complete Extraction Flow

### 1. User Shares Inspiration URL

```
User: "I like the vibe of https://example.com"
```

### 2. Try WebFetch First

If blocked, proceed to browser method.

### 3. Use Browser Subagent

```
browser_subagent(
  Task: "Navigate to https://example.com. 
         Take full-page screenshot.
         Analyze and document:
         - Color palette (primary, secondary, accent, background)
         - Typography (heading and body fonts, sizes)
         - Layout approach
         - Spacing (tight, normal, generous)
         - Hero section style
         - Animation level
         Return a design analysis summary.",
  RecordingName: "example_analysis"
)
```

### 4. View Screenshots and Analyze

Look at the captured screenshots to extract design elements visually.

### 5. Report to User

Present findings in structured format and ask for confirmation.

---

## Key Tips

1. **Always scroll** - Many design patterns are below the fold
2. **Screenshot each section** - Hero, features, testimonials, CTA, footer
3. **Note hover states** - Check button/link interactions if possible
4. **Check mobile** - Ask subagent to resize viewport if needed
5. **Extract exact colors** - Use browser dev tools if available

---

## When NOT to Use This

- Site is behind login (use saved auth state instead)
- Site has CAPTCHA (ask user to provide screenshots)
- Site is rate-limiting (wait and retry)
