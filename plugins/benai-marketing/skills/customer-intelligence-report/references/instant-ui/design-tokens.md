# Design Tokens (Step 2)

Paste the `:root` block into every file verbatim. Never hand-type token values. Then apply the typography rules below.

## The BenAI brand DNA

Neo-brutalist, not flat, glass, or modern-SaaS. Four rules carry the look:

1. **Hard borders, hard shadows.** 3px solid `#111` borders. 6px solid `#111` drop shadows with zero blur. Never `box-shadow` with `rgba` blurs.
2. **Cream over pure white.** Canvas is `#fffef8` (warm cream), not `#fff`. Cards sit on cream, card interiors go white `#fff`.
3. **System font plus SF Mono.** No Google Fonts. System sans for everything, SF Mono for numbers, labels, pills, timers, anything "meta."
4. **The gradient stripe is the signature.** Every page gets a 4px `linear-gradient(90deg, #3b82f6, #22c55e, #f59e0b)` stripe at the very top. Blue to green to amber. Non-negotiable.

## The :root block

```css
:root {
  /* Backgrounds */
  --bg: #fffef8;           /* Cream - primary page background */
  --bg-alt: #f8fafc;       /* Slate-50 - alternating section bg */

  /* Ink + text */
  --ink: #111;             /* Near-black - headings, borders, shadows */
  --text: #444;            /* Primary body text */
  --text-light: #666;      /* Secondary text */
  --text-muted: #999;      /* Meta, labels, dim emphasis */

  /* Accents (use sparingly, never dilute) */
  --accent: #2563eb;       /* Blue - primary accent */
  --accent-dark: #1d4ed8;
  --accent-pale: #dbeafe;  /* Pale blue card background */

  --green: #16a34a;        /* Success / positive */
  --green-pale: #dcfce7;

  --amber: #d97706;        /* Warning / attention */
  --amber-pale: #fef3c7;

  --yellow-pale: #fef9c3;  /* Soft highlights */

  --red: #dc2626;          /* Error / problem */
  --red-pale: #fee2e2;

  /* Borders + shadows (the brutalist signature) */
  --border: #111;                /* Always hard near-black */
  --border-light: #e5e7eb;       /* Rare, internal dividers only */
  --shadow: 6px 6px 0 #111;      /* Hard drop shadow - no blur */
  --shadow-sm: 4px 4px 0 #111;
  --shadow-xs: 3px 3px 0 #111;

  /* Typography */
  --font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --mono: "SF Mono", "Fira Code", Menlo, monospace;
}
```

## Typography rules

| Role | Font | Weight | Size | Letter-spacing |
|------|------|--------|------|----------------|
| Hero H1 | system | 900 | 88px (mobile 52px) | -0.045em |
| Section H2 | system | 900 | 56px (mobile 36px) | -0.035em |
| Card H3 | system | 900 | 20-24px | -0.02em |
| Body | system | 400 | 14-16px | 0 |
| Lead paragraph | system | 500 | 19-22px | 0 |
| Pill label | mono | 900 | 10-11px | 0.1-0.14em, UPPERCASE |
| Big number | mono | 900 | 42-52px | -0.04em |
| Meta / timer | mono | 400-700 | 11px | 0.04-0.12em, UPPERCASE |

**Headings are always `font-weight: 900`.** Never 700. Never 800. 900 or the brand is broken.

**Line-height:**
- Hero H1: `0.96`
- Section H2: `1.02-1.1`
- Body: `1.6`
- Card body: `1.55-1.65`

**All numbers, stats, timers, dollar amounts, code, timestamps use SF Mono.** Never system font for numerals.
