# Phase 2: Clone & Deploy

Clone the inspiration site with pixel-level accuracy using `agent-browser` for extraction, build section-by-section with visual comparison, then deploy.

---

## Part 0: Prerequisites Check

Before starting, verify `agent-browser` is installed:

```bash
which agent-browser || echo "NOT INSTALLED"
```

If not installed, run:

```bash
npm install -g agent-browser
agent-browser install   # Downloads Chrome for Testing (~300MB, one-time)
```

---

## Part 1: Deep Site Extraction with agent-browser

### 1.1 Open & Capture Full Page

```bash
# Open the site and wait for everything to load
agent-browser open "[INSPIRATION_URL]"
agent-browser wait --load networkidle

# Full-page screenshot — your visual ground truth for the entire build
agent-browser screenshot --full /tmp/clone-ref/full-page.png
```

Save this screenshot. **Every section you build gets compared against it.**

### 1.2 Capture Per-Section Screenshots

Scroll through the page and screenshot each distinct section. These are your section-level ground truth:

```bash
# Get the section structure first
agent-browser eval "JSON.stringify(Array.from(document.querySelectorAll('section, [class*=\"section\"], header, footer, nav')).map((el, i) => ({ index: i, tag: el.tagName, class: el.className.slice(0, 80), rect: el.getBoundingClientRect().toJSON() })))"

# Screenshot each section by scrolling to it
agent-browser scrollintoview "section:nth-of-type(1)"
agent-browser screenshot /tmp/clone-ref/section-01-hero.png

agent-browser scrollintoview "section:nth-of-type(2)"
agent-browser screenshot /tmp/clone-ref/section-02.png

# ... repeat for each section
```

### 1.3 Capture Mobile View

```bash
agent-browser set viewport 375 812
agent-browser screenshot --full /tmp/clone-ref/mobile-full.png
agent-browser set viewport 1440 900   # reset to desktop
```

### 1.4 Extract Actual Design Tokens

**Colors — extract from CSS custom properties and computed styles:**

```bash
# CSS custom properties (design tokens)
agent-browser eval "JSON.stringify((() => { const styles = getComputedStyle(document.documentElement); const props = {}; for (const sheet of document.styleSheets) { try { for (const rule of sheet.cssRules) { if (rule.selectorText === ':root' || rule.selectorText === ':root, :host') { for (const prop of rule.style) { if (prop.startsWith('--')) props[prop] = rule.style.getPropertyValue(prop).trim(); } } } } catch(e) {} } return props; })())"

# Actual colors used on the page (computed)
agent-browser eval "JSON.stringify({ body_bg: getComputedStyle(document.body).backgroundColor, body_color: getComputedStyle(document.body).color, nav_bg: getComputedStyle(document.querySelector('nav, header')).backgroundColor, hero_bg: getComputedStyle(document.querySelector('section, [class*=hero], main > div:first-child')).backgroundColor })"
```

**Typography — extract actual font families, sizes, weights:**

```bash
agent-browser eval "JSON.stringify((() => { const els = { h1: 'h1', h2: 'h2', h3: 'h3', p: 'p', nav_link: 'nav a', button: 'button' }; const result = {}; for (const [name, sel] of Object.entries(els)) { const el = document.querySelector(sel); if (el) { const s = getComputedStyle(el); result[name] = { fontFamily: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight, lineHeight: s.lineHeight, letterSpacing: s.letterSpacing, textTransform: s.textTransform, color: s.color }; } } return result; })())"
```

**Spacing — extract actual padding/margin/gap values:**

```bash
agent-browser eval "JSON.stringify(Array.from(document.querySelectorAll('section, [class*=section]')).map((el, i) => { const s = getComputedStyle(el); return { section: i, paddingTop: s.paddingTop, paddingBottom: s.paddingBottom, paddingLeft: s.paddingLeft, paddingRight: s.paddingRight }; }))"
```

**Layout — extract container widths, grid structures:**

```bash
agent-browser eval "JSON.stringify((() => { const containers = document.querySelectorAll('[class*=container], [class*=wrapper], [class*=max-w], main > div > div'); return Array.from(containers).slice(0, 10).map(el => { const s = getComputedStyle(el); return { class: el.className.slice(0, 60), maxWidth: s.maxWidth, width: s.width, display: s.display, gridTemplateColumns: s.gridTemplateColumns, gap: s.gap, flexDirection: s.flexDirection }; }); })())"
```

### 1.5 Extract Section HTML Structure

For each section, get the actual DOM structure (stripped of content, keeping structure):

```bash
# Get the hero section's HTML structure
agent-browser get html "section:nth-of-type(1)"

# Or target by class
agent-browser get html "[class*=hero]"
agent-browser get html "[class*=feature]"
agent-browser get html "[class*=testimonial]"
agent-browser get html "footer"
```

### 1.6 Extract Animation & Interaction Patterns

```bash
# Check for scroll animations (IntersectionObserver, AOS, GSAP, Framer Motion)
agent-browser eval "JSON.stringify({ has_framer: !!document.querySelector('[data-framer-appear-id]'), has_aos: !!document.querySelector('[data-aos]'), has_gsap: !!window.gsap, scroll_classes: Array.from(new Set(Array.from(document.querySelectorAll('[class*=animate], [class*=fade], [class*=slide], [class*=reveal]')).map(el => el.className.split(' ').filter(c => /animate|fade|slide|reveal|motion/.test(c)).join(' ')))).slice(0, 10) })"

# Check for hover effects on cards/buttons
agent-browser eval "JSON.stringify(Array.from(document.querySelectorAll('a, button, [class*=card]')).slice(0, 5).map(el => ({ tag: el.tagName, class: el.className.slice(0, 40), cursor: getComputedStyle(el).cursor, transition: getComputedStyle(el).transition })))"
```

### 1.7 Build the Extraction Document

Compile everything into a structured extraction document. **Use actual values, not adjectives:**

```
CLONE EXTRACTION: [URL]
Screenshot: /tmp/clone-ref/full-page.png

SECTIONS (in order, with screenshots):
1. Navbar — [screenshot: section-01-nav.png] — sticky, transparent bg, logo left, links center, CTA right
2. Hero — [screenshot: section-02-hero.png] — centered text, gradient bg, avatar stack below CTA
3. [etc...]

COLORS (exact values from extraction):
- --background: [extracted value, e.g., hsl(0 0% 100%)]
- --foreground: [extracted value]
- --primary: [extracted value]
- --primary-foreground: [extracted value]
- Section bg pattern: [e.g., #fff → #f8f9fa → #fff → #1a1a2e]

TYPOGRAPHY (actual computed values):
- H1: [fontFamily], [fontSize]px, weight [fontWeight], lineHeight [value], letterSpacing [value]
- H2: [fontFamily], [fontSize]px, weight [fontWeight]
- Body: [fontFamily], [fontSize]px, weight [fontWeight], lineHeight [value]
- Nav links: [fontSize]px, weight [fontWeight], [textTransform]
- Buttons: [fontSize]px, weight [fontWeight]

SPACING (actual values):
- Section padding: [paddingTop]px top / [paddingBottom]px bottom
- Container max-width: [maxWidth]px
- Grid gap: [gap]px
- Card padding: [value]px

LAYOUT PATTERNS:
- Hero: [display type, structure from HTML extraction]
- Features: [grid-template-columns value, number of columns]
- [etc...]

ANIMATIONS:
- Framework: [Framer Motion / AOS / CSS / GSAP]
- Entrance: [fade-up / slide-in / scale]
- Card hover: [transform, shadow change]
- Transition timing: [value from extraction]

UNIQUE UI PATTERNS:
- [List distinctive elements with their HTML structure from extraction]
```

---

## Part 2: Project Setup

### 2.1 Initialize Next.js + shadcn/ui

```bash
npx -y create-next-app@latest [project-name] --typescript --tailwind --eslint
# Select: Yes (src dir), Yes (App Router), No (Turbo)

cd [project-name]

# Essential libraries
npm install framer-motion lucide-react clsx tailwind-merge

# Initialize shadcn/ui (New York style, Neutral base, CSS variables: yes)
npx shadcn@latest init -d

# Core components
npx shadcn@latest add button card badge accordion tabs input separator avatar
```

### 2.2 Configure Preview Mode

Create `.claude/launch.json` in the project root:

```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "website-preview",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "port": 3000,
      "autoPort": true
    }
  ]
}
```

### 2.3 Folder Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout with fonts, metadata
│   ├── page.tsx         # Landing page assembling all sections
│   └── globals.css      # CSS variables from extraction
├── components/
│   ├── ui/              # shadcn primitives (Button, Card, etc.)
│   ├── sections/        # Cloned sections (Hero, Features, etc.)
│   └── layout/          # Navbar, Footer, SectionWrapper
└── lib/
    └── utils.ts         # cn() utility
```

---

## Part 3: Design System from Extracted Values

### 3.1 Map Extracted Values to CSS Variables

Use the ACTUAL extracted values — not defaults, not guesses:

```css
@layer base {
  :root {
    /* Map directly from extraction — these are real values from the inspiration */
    --background: [extracted bg → convert to HSL];
    --foreground: [extracted text → convert to HSL];
    --primary: [extracted accent/CTA → convert to HSL];
    --primary-foreground: [computed for contrast against --primary];
    --secondary: [extracted secondary color → convert to HSL];
    --muted: [extracted section alternation bg → convert to HSL];
    --muted-foreground: [extracted subdued text → convert to HSL];
    --card: [extracted card bg → convert to HSL];
    --border: [extracted border color → convert to HSL];
    --ring: [extracted focus/accent → convert to HSL];
    --radius: [match extraction: 0 for sharp, 0.375rem for subtle, 0.5rem for soft, 9999px for pill];
  }
}
```

### 3.2 Typography Setup

Import the exact fonts detected in extraction:

```tsx
// layout.tsx
import { [Font_Name] } from 'next/font/google'

// Use the exact font-weight values from extraction
const headingFont = [Font_Name]({
  subsets: ['latin'],
  weight: ['[extracted_weight]'],
  variable: '--font-heading',
})

const bodyFont = [Font_Name]({
  subsets: ['latin'],
  weight: ['[extracted_weight]'],
  variable: '--font-body',
})
```

### 3.3 Spacing Constants

Create a spacing reference from extracted values. Convert px to Tailwind classes:

| Extracted Value | Tailwind Class | Usage |
|---|---|---|
| `80px` section padding | `py-20` | Section vertical padding |
| `120px` section padding | `py-[120px]` | Use arbitrary if no match |
| `24px` gap | `gap-6` | Grid gaps |
| `1200px` container | `max-w-[1200px]` | Container width |

**Rule: If the extracted value doesn't match a Tailwind class exactly, use arbitrary values `[Xpx]` rather than rounding to the nearest class.** Precision matters for clone fidelity.

---

## Part 4: Section-by-Section Build & Compare

This is the core of the clone. Build ONE section at a time, compare visually, fix, then move to the next.

### 4.1 Layout Blueprint Selection

Before coding each section, identify which layout pattern it uses from the HTML extraction. Here are the most common patterns with their Tailwind implementations:

#### Hero Patterns

**Centered Hero** (text centered, optional image/visual below):
```tsx
<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
  {/* Background treatment from extraction */}
  <div className="relative z-10 max-w-[extracted_width] mx-auto px-4 text-center">
    <Badge />           {/* if extraction shows a badge/pill above headline */}
    <h1 className="text-[extracted_size] font-[extracted_weight] leading-[extracted_lh] tracking-[extracted_ls]">
      {/* Inspiration copy temporarily */}
    </h1>
    <p className="mt-[extracted_gap] text-[extracted_size] text-[extracted_color] max-w-[extracted_width]">
      {/* Subtitle */}
    </p>
    <div className="mt-[extracted_gap] flex items-center justify-center gap-[extracted_gap]">
      <Button />
    </div>
    {/* Social proof strip, avatar stack, etc. from extraction */}
  </div>
</section>
```

**Split Hero** (text left, image/visual right):
```tsx
<section className="min-h-screen flex items-center">
  <div className="max-w-[extracted_width] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-[extracted_gap] items-center">
    <div> {/* Text side */}
      <h1 />
      <p />
      <Button />
    </div>
    <div> {/* Visual side */}
      <Image /> {/* or illustration, mockup, video */}
    </div>
  </div>
</section>
```

**Video/Image Hero** (full-bleed media with overlay text):
```tsx
<section className="relative min-h-screen">
  <div className="absolute inset-0"> {/* Full-bleed media */}
    <Image fill className="object-cover" />
    <div className="absolute inset-0 bg-black/[extracted_opacity]" /> {/* Overlay */}
  </div>
  <div className="relative z-10 flex items-center min-h-screen">
    <div className="max-w-[extracted_width] mx-auto px-4">
      <h1 className="text-white" />
    </div>
  </div>
</section>
```

#### Content Section Patterns

**Card Grid** (features, services, benefits):
```tsx
<section className="py-[extracted_padding]">
  <div className="max-w-[extracted_width] mx-auto px-4">
    <div className="text-center mb-[extracted_gap]">
      <h2 /><p />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-[extracted_cols] gap-[extracted_gap]">
      {items.map(item => (
        <Card className="p-[extracted_padding]">
          {/* Icon/image */}
          <h3 /><p />
        </Card>
      ))}
    </div>
  </div>
</section>
```

**Alternating Rows** (feature detail, image + text):
```tsx
<section className="py-[extracted_padding]">
  <div className="max-w-[extracted_width] mx-auto px-4 space-y-[extracted_gap]">
    {rows.map((row, i) => (
      <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-[extracted_gap] items-center", i % 2 === 1 && "lg:[&>:first-child]:order-2")}>
        <div><h3 /><p /></div>
        <div><Image /></div>
      </div>
    ))}
  </div>
</section>
```

**Bento Grid** (modern, mixed-size cards):
```tsx
<section className="py-[extracted_padding]">
  <div className="max-w-[extracted_width] mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-[extracted_template] gap-[extracted_gap]">
      <div className="md:col-span-2 md:row-span-2"> {/* Large card */} </div>
      <div> {/* Small card */} </div>
      <div> {/* Small card */} </div>
      {/* Match exact grid template from extraction */}
    </div>
  </div>
</section>
```

**Testimonial Patterns:**
```tsx
{/* Cards in a grid */}
<div className="grid grid-cols-1 md:grid-cols-[extracted_cols] gap-[extracted_gap]">

{/* Single featured testimonial */}
<div className="max-w-3xl mx-auto text-center">

{/* Scrolling marquee / carousel */}
<div className="overflow-hidden"><div className="flex animate-scroll gap-[extracted_gap]">
```

**Numbered Process / How It Works:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-[extracted_cols] gap-[extracted_gap]">
  {steps.map((step, i) => (
    <div className="relative text-center">
      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-lg font-bold">
        {i + 1}
      </div>
      {/* Connecting line if extraction shows one */}
      <h3 /><p />
    </div>
  ))}
</div>
```

### 4.2 The Build Loop (MANDATORY for each section)

For EACH section, follow this exact sequence:

```
STEP 1: Reference
  - Open the section screenshot from /tmp/clone-ref/
  - Review the extracted HTML structure, computed styles, spacing

STEP 2: Identify Pattern
  - Match to a layout blueprint from 4.1 above
  - Note which extracted values to plug in (font sizes, spacing, colors, grid columns)

STEP 3: Build
  - Code the section using the blueprint + extracted values
  - Use ACTUAL extracted values, not Tailwind defaults
  - Keep the inspiration's copy temporarily

STEP 4: Visual Compare
  - Screenshot what you built:
    agent-browser open "http://localhost:3000"
    agent-browser scrollintoview "[section selector]"
    agent-browser screenshot /tmp/clone-ref/built-section-N.png
  - Compare against the inspiration section screenshot
  - Check: layout structure, spacing proportions, typography scale, color usage

STEP 5: Fix Discrepancies
  - If spacing is off → adjust to match extracted values
  - If font sizes don't match → use arbitrary values [Xpx]
  - If layout structure differs → re-examine the HTML extraction
  - Re-screenshot and compare again

STEP 6: Move to next section
  - Only after the section visually matches the reference
```

**NEVER build all sections then compare at the end. The compare loop catches drift early.**

### 4.3 Clone Rules

- **DO NOT use the component library during cloning.** Build from the layout blueprints + extracted values to match the inspiration exactly.
- **DO NOT invent design elements.** Only reproduce what exists on the inspiration site.
- **DO NOT substitute** — if the inspiration has a bento grid, don't replace it with a standard grid.
- **DO NOT round values** — if the extraction says `padding: 96px`, use `py-24` or `py-[96px]`, not `py-20`.
- **DO NOT apply quality-rules.md defaults** that contradict extracted values. The inspiration's actual values win. Quality rules are a fallback only when extraction is ambiguous.
- **DO match hover states and animations** observed during extraction.
- **DO NOT use placeholder images, CSS gradients, geometric shapes, or SVG patterns as image substitutes.** You MUST generate real images for every visual. See Part 5 for the priority chain (MCP → built-in script → comment fallback).

---

## Part 5: Image Generation

### 5.1 Image Extraction from Inspiration

During extraction, catalog every image:

```bash
agent-browser eval "JSON.stringify(Array.from(document.querySelectorAll('img, [style*=background-image], video, svg.hero-illustration')).map((el, i) => ({ index: i, tag: el.tagName, src: el.src || el.style?.backgroundImage?.slice(4, -1), alt: el.alt, width: el.naturalWidth || el.offsetWidth, height: el.naturalHeight || el.offsetHeight, class: el.className?.slice?.(0, 50) || '', parentSection: el.closest('section')?.className?.slice?.(0, 40) || 'unknown' })))"
```

### 5.2 Image Generation — Priority Chain

**MANDATORY: You MUST generate a real image for every image identified in 5.1.** Never skip. Never use CSS placeholders.

Use this priority chain — try each in order, fall back only if it fails:

---

#### Priority 1: Nano Banana MCP (`generate_image`)

Try this first. If the MCP is installed, it provides the best workflow with editing support.

**MCP Server:** `@zhibinyang/nano-banana-mcp` (Gemini AI image generation)

**Available tools:**

| Tool | When to Use |
|------|-------------|
| `generate_image` | First-pass creation (prompt + aspectRatio) |
| `edit_image` | First edit on an existing image (requires file path) |
| `continue_editing` | All subsequent edits (server tracks last image automatically) |
| `get_last_image_info` | Metadata retrieval |

**BLOCKED tools (never call):** `configure_gemini_token`, `get_configuration_status`

**Calling `generate_image`:**

Double-specify aspect ratio for reliability — once in the prompt text, once in the parameter:

```
generate_image(
  prompt: "[Style reference]: Clean, modern [style matching inspiration] image.
[Subject]: [What the image shows — match the role from extraction]
[Colors]: Using brand colors [hex values from extraction].
[Composition]: [Layout — centered, floating, isometric, etc.]
[Mood]: [Match the inspiration site's tone.]
No text. No watermarks. Clean background.
Output as a [W:H] aspect ratio image at approximately [width] pixels wide",
  aspectRatio: "[W:H]"
)
```

**Iterating on generated images:**
- First edit: `edit_image(filePath: "./generated_imgs/generated-[timestamp]-[id].png", prompt: "...")`
- All subsequent edits: `continue_editing(prompt: "...")` — the server tracks the last image automatically

**File flow (MCP):**
1. MCP saves to `./generated_imgs/generated-[timestamp]-[id].png`
2. Copy to `public/images/[descriptive-name].png`
3. Read the file to verify it generated correctly
4. Reference: `<Image src="/images/hero-bg.png" alt="..." width={} height={} />`

---

#### Priority 2: Built-in Script (no MCP needed)

If `generate_image` fails (tool not found, connection refused, MCP not installed), fall back to the built-in script. This calls the Gemini Imagen API directly using `GEMINI_API_KEY` from `.env`. No MCP installation needed.

```bash
node <skill-dir>/scripts/generate-image.mjs \
  --prompt "[Same prompt format as above]" \
  --output public/images/[descriptive-name].png \
  --aspect "[W:H]"
```

Where `<skill-dir>` is the path to this skill's directory (find it via the skill file location).

**Features:**
- Auto-detects the best available Imagen model (imagen-4.0-fast preferred)
- Reads `GEMINI_API_KEY` from `.env` in cwd or up to 3 parent directories
- Supports `GEMINI_IMAGE_MODEL` override in `.env`
- Outputs the saved file path on success
- Exits non-zero with error message on failure

**File flow (script):**
1. Script saves directly to the `--output` path
2. Read the file to verify it generated correctly
3. Reference: `<Image src="/images/hero-bg.png" alt="..." width={} height={} />`

**Note:** The script does NOT support `edit_image` or `continue_editing`. For revisions, re-generate with an updated prompt.

---

#### Priority 3: Comment Fallback (no API key)

Only if BOTH methods above fail (no API key configured at all):

Leave `<!-- IMAGE NEEDED: [description] -->` comments in the code. Tell the user which images need generation and redirect to Phase 5 (API Key Setup).

---

**Rules (apply to all methods):**
1. **Never generate human faces** — use abstract/geometric visuals, product mockups, or illustrations
2. **Match the inspiration's image style** — gradient meshes → gradient meshes, isometric → isometric
3. **Use extracted brand colors** in the prompt
4. **Match aspect ratio** to the placeholder dimensions from extraction
5. **Generate one image at a time** — verify each before moving to the next

**If API key was skipped in Phase 0 (Path 3):** Leave `<!-- IMAGE NEEDED: [description] -->` comments for all images. Do not attempt generation.

---

## Part 6: Brand Application

If the user provided brand assets in Q10:

1. **Logo** — Replace the inspiration's logo with the user's
2. **Brand colors** — If Q9 = "close match", keep the inspiration's palette. If user has specific colors, replace `--primary` only, keeping the inspiration's color relationships intact.
3. **Fonts** — Keep the inspiration's fonts unless the user specified brand fonts

If Q9 = "Just inspiration" (not close match):
- More freedom to adjust colors to match user's brand
- Keep the layout and structure from inspiration but adapt visual style

---

## Part 7: Preview & Deploy

### 7.1 Build & Lint

```bash
npm run lint -- --fix
npm run build
```

Fix any build errors before proceeding.

### 7.2 Full-Page Visual Comparison

Before showing the user, do one final comparison:

```bash
# Screenshot your build
agent-browser open "http://localhost:3000"
agent-browser wait --load networkidle
agent-browser screenshot --full /tmp/clone-ref/final-build.png

# Also capture mobile
agent-browser set viewport 375 812
agent-browser screenshot --full /tmp/clone-ref/final-build-mobile.png
agent-browser set viewport 1440 900
```

Compare `/tmp/clone-ref/final-build.png` against `/tmp/clone-ref/full-page.png`. Fix any remaining discrepancies.

### 7.3 Deploy to Vercel

```bash
npx vercel login
npx vercel
```

### 7.4 Open Preview in Claude Desktop

The embedded preview panel auto-starts the local dev server from `.claude/launch.json`. The user can click any element directly in the preview for precise iteration.

**CLI users:** `npm run dev &` then `open http://localhost:3000`.

### 7.5 Present Both URLs

```
Your cloned site is live! I've set up two ways to view it:

VERCEL (shareable): [vercel preview URL]
LOCAL PREVIEW: Open in the preview panel to the right →

The preview panel lets you click any element directly to request changes.

Take a look and let me know:
1. Does this match the inspiration site's look and feel?
2. Anything off with layout, spacing, or typography?

Once you're happy with the clone, I'll ask you deeper questions about your
business so we can replace the copy with YOUR content.
```

### 7.6 Preview Checklist

- [ ] Full-page screenshot comparison passes (overall layout match)
- [ ] Each section matches its reference screenshot
- [ ] Typography matches (exact fonts, sizes, weights from extraction)
- [ ] Colors match extraction values
- [ ] Spacing matches (actual px values, not rounded)
- [ ] Images generated and loading correctly
- [ ] Animations/hover states work
- [ ] Mobile responsive (compared against mobile screenshot)
- [ ] No console errors

### 7.7 Iteration on Clone Fidelity

During iteration, the user can:
- **Click elements** in the preview panel to reference them in chat
- **Resize the preview** to test responsive behavior
- **Compare** by opening the Vercel URL alongside the original inspiration in a browser

For each fix, use agent-browser to re-screenshot and verify:

```bash
agent-browser open "http://localhost:3000"
agent-browser scrollintoview "[section selector]"
agent-browser screenshot /tmp/clone-ref/fix-check.png
```

After each round of changes, re-deploy to Vercel: `npx vercel`

Iterate until the user confirms the clone matches. Then proceed to Phase 3.

---

## Anti-Pattern Hit List

These are the specific things that make LLM-generated sites look amateur. Check for ALL of these before showing the user:

### Spacing Anti-Patterns
| Bad | Fix |
|---|---|
| Equal padding everywhere (`py-16` on every section) | Use extracted values — they vary per section |
| Tiny gaps between major sections | Sections need breathing room. Check extracted padding. |
| No whitespace between heading and content | Use the extracted `margin-bottom` from headings |
| Card padding too small (`p-4`) | Cards need generous padding. Check extraction. |

### Typography Anti-Patterns
| Bad | Fix |
|---|---|
| All text same visual weight | H1 > H2 > H3 > body must have clear hierarchy |
| Hero headline too small | Hero H1 should dominate. Use extracted size. |
| Body text too wide (> 75ch) | Cap paragraph width. Use extracted `max-width`. |
| Generic font stack (system-ui) | Use the exact fonts from extraction |
| Missing letter-spacing on headings | Many premium sites use tight tracking on large text |

### Layout Anti-Patterns
| Bad | Fix |
|---|---|
| Everything centered | Match the extraction — many sections use left-aligned text |
| Uniform grid everywhere | Alternating rows, bento grids, asymmetric layouts per extraction |
| No visual rhythm / section variety | Alternate bg colors, layout patterns, density as extracted |
| Container too wide or too narrow | Use extracted `max-width` value exactly |
| Cards all identical height forcing bad spacing | Let content determine height, use extracted patterns |

### Color Anti-Patterns
| Bad | Fix |
|---|---|
| Too many colors competing | Stick to extracted palette. Usually 2-3 colors + neutrals. |
| Low contrast text on colored backgrounds | Check extracted text color per section background |
| CTA button doesn't pop | CTA must contrast against its section bg. Check extraction. |
| Gray text on white that's barely readable | Use extracted muted-foreground value, verify contrast |

### Animation Anti-Patterns
| Bad | Fix |
|---|---|
| No animations at all (feels flat) | Add entrance animations matching extracted framework |
| Animations too slow (> 1s) | Keep entrance 0.4-0.7s, hover 0.2-0.3s |
| Everything animates at once | Stagger grid items 0.1s. Animate on scroll, not on load. |
| Layout-shifting animations | Only animate `transform` and `opacity` |

### Image Anti-Patterns
| Bad | Fix |
|---|---|
| Broken image placeholders | Generate with Nano Banana MCP — never use CSS fallbacks |
| Wrong aspect ratio (stretched/squished) | Match extracted image dimensions |
| Images without Next.js `<Image>` component | Always use `next/image` for optimization |
| No hero visual when inspiration has one | Generate a matching visual, don't leave it text-only |
