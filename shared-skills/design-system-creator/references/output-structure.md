# Output Structure: what each file should contain

This is the authoritative spec for what a generated design-system folder looks like. Use it as a checklist when generating. Every file listed here must be produced. If you're tempted to skip one, flag it to the user instead.

## Contents

- The full folder tree
- Top-level (README.md, CLAUDE.md, BRAND-SUMMARY.md)
- `foundations/` (brand, voice, vocabulary, color, typography, spacing, radius, shadow, motion, iconography, imagery)
- `tokens/` (tokens.json, tokens.css, tailwind.preset.js)
- `logo/` (six SVGs + usage.md, fidelity rule)
- `components/` (React + Tailwind starters)
- `voice/` (examples.md, homepage-copy.md)
- `applications/` (web, presentations, social, email, infographics, ads)
- `assets/` (patterns, templates)
- Size targets

## The full folder tree

Output a `design-system/` folder at the working-directory root, with this exact tree. Content differs by branch, but every file gets produced.

```
design-system/
├── README.md
├── CLAUDE.md                       load-order + non-negotiables for any LLM consuming this system
├── BRAND-SUMMARY.md                one-page snapshot
├── foundations/
│   ├── brand.md
│   ├── voice.md
│   ├── vocabulary.md
│   ├── color.md
│   ├── typography.md
│   ├── spacing.md
│   ├── radius.md
│   ├── shadow.md
│   ├── motion.md
│   ├── iconography.md
│   └── imagery.md
├── tokens/
│   ├── tokens.json                 W3C-ish schema
│   ├── tokens.css                  CSS custom properties
│   └── tailwind.preset.js          drop-in Tailwind preset
├── logo/
│   ├── mark.svg
│   ├── mark-inverse.svg
│   ├── wordmark.svg
│   ├── lockup-horizontal.svg
│   ├── lockup-stacked.svg
│   ├── favicon.svg
│   ├── [rendered .jpg / .png versions of the above]
│   └── usage.md
├── components/                     React + Tailwind starters
│   ├── README.md
│   ├── utils.ts
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── feature-card.tsx
│   ├── badge.tsx
│   ├── nav.tsx
│   ├── hero.tsx
│   ├── testimonial.tsx
│   ├── cta-section.tsx
│   ├── stat.tsx
│   └── animated.tsx
├── voice/
│   ├── examples.md                 do/don't pairs per surface
│   └── homepage-copy.md            drop-in hero variants
├── applications/
│   ├── web.md
│   ├── presentations.md
│   ├── social-instagram.md
│   ├── social-linkedin.md
│   ├── email.md
│   ├── infographics.md
│   └── ads.md
└── assets/
    ├── patterns/                   grid.svg, brand-wash.svg
    └── templates/                  real shipped assets (preferred, copied from the user's working directory) and/or synthetic drafts (only where no real asset exists). On Branch B with shipped assets present, this folder is the user's actual decks / one-pagers / carousels / YouTube frames, organized by surface. The Marp theme CSS is always present (it is a CSS theme, not a recreation).
```

---

## Top-level

### `README.md`
One-page "how to read this system." Must include:
- Brand name + tagline.
- A file tree diagram of the whole folder.
- A quick-start section for humans ("If you're adding a landing page, start here…").
- 6–8 one-liner principles distilled from the full system.

### `CLAUDE.md`
The single most important file. An LLM reading this folder should read `CLAUDE.md` before anything else. Must include:
1. **Load order**, numbered list of which files to read in what sequence.
2. **Non-negotiables**, the 10 rules from [non-negotiables.md](non-negotiables.md), stated in brand-specific terms.
3. **Defaults when ambiguous**, what to assume when the user doesn't specify (background, case, body size, CTA shape, section spacing, carousel aspect, slide aspect, email width).
4. **Asset-type cheat sheet**, a table mapping user requests ("slide deck," "IG carousel," "homepage") to the right application file.
5. **Quality bar**, 5–6 self-check questions Claude should ask before delivering.

### `BRAND-SUMMARY.md`
One-page snapshot covering:
- What the brand is.
- Why it exists.
- Positioning (loud↔quiet, futuristic↔grounded, generic↔specific, etc.).
- Personality (5 adjectives).
- Archetype + anti-archetype.
- The one-sentence promise.
- Tagline + 2–3 alts.
- Visual foundations snapshot (color, type, radius, icons, motion).
- Voice in one paragraph.
- What the brand is trying to make someone feel in 5 seconds.

---

## `foundations/`

### `brand.md`
Mission, vision, values, positioning statement, target audience, audience insight, archetype, anti-archetype. 1–2 pages.

### `voice.md`
The rules of how the brand sounds. Must include:
- 7 voice rules (specific over generic, second-person, short sentences, name their world, no AI jargon, no hype, promise specifics not hype).
- 3-second feeling test.
- Tone by context (homepage / feature / pricing / case study / email / etc., ~12 contexts, each with a one-line register).
- Grammar & punctuation house style.
- What to do when there's nothing specific to say.

### `vocabulary.md`
Word preferences. Must include:
- Words to prefer (about us / about the user / about outcomes).
- Vertical-specific vocabulary (only if the brand serves verticals, if so, list each vertical and its nouns: people, ops, moments).
- Generic verbs the brand uses.
- Generic verbs the brand avoids.
- Numbers the brand likes (style of metric).
- A headline recipe.

### `color.md`
The palette + usage rules. Must include:
- Brand scale 50–900 (primary at 600).
- Ink scale 100–900 (text).
- Paper + surface + line.
- Semantic (success/warn/danger/info at 100 + 600).
- Where primary goes / where it does NOT go.
- Text contrast minimums with actual ratios.
- Reasoning for the palette choices (a paragraph at the bottom).

### `typography.md`
The type scale + rules. Must include:
- Full scale: display-xl through caption/overline/code (size, line-height, weight, letter-spacing).
- Weights actually used (typically 400/500/600/700).
- 7 typography rules (sentence case, max 3 sizes, line length, weights, italics, no text shadow, heading spacing).
- Pairings for common contexts (marketing hero, section, card, slide, carousel).
- Font loading snippet (web).
- When not to use the primary font.

### `spacing.md`
4px scale. Must include:
- Scale tokens 0 through 40 (0 to 160px).
- Section rhythm template (overline → h2 → body → content → gap).
- Grid & container spec (max 1200px, gutter, reading max 680px).
- Internal padding per element (button, input, card, badge, modal, nav).
- Gap conventions per context.
- 4 core rules.

### `radius.md`
Shorter. Must include:
- Scale tokens none/xs/sm/md/lg/xl/full.
- The two rules (marketing CTA = pill; product UI button = md).
- Consistency within a composition.
- Exceptions (avatar = full, logo = no radius, images = lg on paper).

### `shadow.md`
Short. Must include:
- Scale tokens none/xs/sm/md/lg/xl with actual values (low-opacity ink-900).
- 5 rules (default = none, add xs on hover, reserve md+ for dropdowns/modals, no colored shadows, no inner shadows).

### `motion.md`
Must include:
- Duration tokens (xs 80, sm 160, md 240, lg 480, xl 720).
- Easing tokens (out-expo default, in-out for UI, linear for loaders).
- Standard animations (button press, input focus, menu open, modal open, scroll reveal, page transition).
- Hard "we do not do" list (no parallax, no marquee on hero, no looping video, no scroll-jacking, no entrance animations that block reading, no shake/bounce/wobble, no confetti).
- Which 21st.dev-style motion components are acceptable (spotlight, magic-card-border sparingly, quiet marquee for logo band, number counter, scroll reveal, banned: typewriter, text shimmer).
- `prefers-reduced-motion: reduce` CSS snippet.

### `iconography.md`
Must include:
- Library: Lucide (state the rule).
- Stroke 1.5, outline only, default rounding.
- Size table by context (inline with 14/16/18px text, button icon, nav icon, feature icon, hero icon, empty state).
- Color rules (default currentColor, feature chip = brand/100 + brand/600).
- The "feature icon" pattern (40×40 chip, radius md, brand wash).
- What the brand doesn't use (emoji on marketing, other icon libraries).
- Custom-icon fallback order.

### `imagery.md`
Must include:
- The single most important rule (real photography of real humans/spaces from the brand's world).
- Photography: what we shoot, how we shoot, what we don't use, image treatments, what we never do (no stock trope list).
- Illustration: style, what we never illustrate (generic AI tropes list, 3D isometric, memphis, corporate-memphis blob people).
- OG / social image spec (1200×630 structure).
- Patterns & backgrounds (grid, wash, hairline; no animated, no particle, no aurora).
- Fallback order when photography isn't available.

---

## `tokens/`

### `tokens.json`
W3C-ish Design Tokens schema. See [../assets/templates/tokens/tokens.json.template](../assets/templates/tokens/tokens.json.template). Contains color, font, size (type scale), space, radius, shadow, motion, breakpoint, container.

### `tokens.css`
CSS custom properties, organized. All prefixed `--<brand-slug>-*`. Plus a `@media (prefers-reduced-motion: reduce)` reset at the bottom. See template.

### `tailwind.preset.js`
Drop-in Tailwind preset (colors, fontFamily, fontSize, borderRadius, boxShadow, transitionDuration, transitionTimingFunction, maxWidth, screens). See template.

---

## `logo/`

**Fidelity rule:** if the user provided a logo (uploaded file or scraped from their site), the SVGs you produce must match what's actually there. Do not add features that aren't in the source: no eye dots on a smiley that has none, no decorative tails on a clean wordmark, no "polish" elements. Find the highest-resolution copy of the source, identify every visible feature, and render exactly that. Verify visually with [../scripts/render.mjs](../scripts/render.mjs) before considering the logo done. If the source is too low-res to read confidently, ask the user for a higher-res version.

Produce **six SVGs** and render **three** of them to JPG + PNG:

| SVG                           | Variant                           | Render raster? |
| ----------------------------- | --------------------------------- | -------------- |
| `mark.svg`                    | Icon-only, primary color on paper | yes            |
| `mark-inverse.svg`            | Icon-only, inverse                | no             |
| `wordmark.svg`                | Wordmark only, ink color          | no             |
| `lockup-horizontal.svg`       | Mark + wordmark horizontal        | yes            |
| `lockup-stacked.svg`          | Mark + wordmark stacked           | yes            |
| `favicon.svg`                 | Simplified, 32×32 viewBox         | no             |

And write `usage.md` covering:
- File inventory + when to use each.
- Construction (grid, proportions). **Explicitly call out the simplifying choices**, e.g., "the mark has no eyes; head + smile only", so future LLMs reading the system don't add features back in.
- Clear space (= height of a capital letter, or width of the mark, whichever's bigger).
- Minimum sizes (lockup 80px web / 20mm print, mark 24px web / 8mm print, favicon 16px).
- Color variants (on paper, on brand/600, on brand/900, on photo, single-color for fax/embroidery).
- One-color rendering rules.
- What NOT to do (no stretch, no rotate, no color changes, no effects, no animation of mark, no busy backgrounds without scrim, **no adding features that aren't in the source mark**).
- Usage examples per surface.

---

## `components/`

React + Tailwind starters. 10 files + README + utils. See [../assets/templates/components/](../assets/templates/components/) for copy-paste templates.

| File                | What it is                                     |
| ------------------- | ---------------------------------------------- |
| `README.md`         | Dependency list, config snippet, inventory     |
| `utils.ts`          | `cn()` helper (clsx + tailwind-merge)          |
| `button.tsx`        | Primary/secondary/ghost/link, pill + md radii  |
| `input.tsx`         | Input + textarea, label + error + hint         |
| `card.tsx`          | Card with variants + Header/Title/Desc/Content/Footer helpers |
| `badge.tsx`         | Small status/category pill                     |
| `feature-card.tsx`  | Icon chip + title + body                       |
| `nav.tsx`           | Sticky top bar with mark/links/CTA + mobile drawer |
| `hero.tsx`          | Marketing hero with overline/headline/sub/CTAs/optional image |
| `testimonial.tsx`   | Case study block with quote + name/city + optional outcome aside |
| `cta-section.tsx`   | Closing CTA band (dark or wash variant)        |
| `stat.tsx`          | Big-number stat block                          |
| `animated.tsx`      | Motion primitives: FadeIn, Stagger, CountUp, Spotlight, QuietMarquee |

---

## `voice/`

### `examples.md`
Do/don't pairs across every common surface. At minimum cover:
- Homepage hero (headline)
- Homepage subcopy
- Section eyebrow
- Feature card
- Primary CTA
- Pricing headline
- Case study opener
- Email subject line
- Email opening line
- LinkedIn post opener
- Instagram caption opener
- Error message
- 404 page
- About page
- Hiring post

End with an anti-pattern checklist.

### `homepage-copy.md`
Drop-in hero variants. Produce:
- 4 hero variants with different angles (specific pain, positioning, audience-specific, direct challenge).
- 3 "Why [brand]" bullet variants.
- 1 "How it works" 3-step variant.
- Pricing top-of-page variant.
- 3 final CTA band variants.
- Mini-heroes for common internal pages (/pricing, /about, specific services).
- About-page opening paragraph variants.
- Boilerplate (1-sentence, 2-sentence, paragraph for press/footer).

---

## `applications/`

Full templates in [../assets/templates/applications/](../assets/templates/applications/). Produce:

### `web.md`
Global primitives (max width, gutter, paper/surface rhythm, section padding). Nav bar spec. Hero rules + JSX template. Six section patterns (why/how/case/feature/pricing/final-CTA). Footer spec. Pages every brand should have. What we never do. Accessibility baseline.

### `presentations.md`
16:9 aspect, paper/ink bg choice. 7 slide templates (title, section divider, big number, three-column, chart/stat, quote/case, closing CTA). Footer on every slide. Exceptions. **Full Marp theme CSS** inline. What we never do in decks.

### `social-instagram.md`
Aspect ratios (1:1, 4:5 default, 9:16). Carousel structure (hook / thread / payoff). Design rules (Instagram type scale, logo placement, color rotation). Post types (single-image spotlight, quote card, number card). Stories/Reels rules (cover, first frame, caption style). What we never post. Caption template.

### `social-linkedin.md`
Aspect ratios (1:1, 4:5). Carousel structure (cover, teaching, takeaway, CTA). Post types (text-only thought-leadership, case study, number, hiring). Company page spec (banner, logo, tagline, about). What NOT to do. Post frequency.

### `email.md`
Technical (600px, fonts, dark mode). Marketing email structure (header/body/footer). Voice: marketing emails sound like a one-to-one note. Subject lines (under 40 chars, specific, no emoji). Pre-header rules. Transactional email template (very different tone). Types we send. What we never send.

### `infographics.md`
Canvas sizes. Four types (comparison, process flow, big number, breakdown/chart). Layout rules. Anti-patterns. Generation workflow (for Claude/AI tools). Example (blog-embedded comparison).

### `ads.md`
The principle (3-second hallway test). Static sizes (IG feed, IG story, LI feed, LI sponsored, Google display, newsletter). Composition (4 elements: headline, subhead, CTA, mark). Backgrounds (pick one per ad). What's never in an ad. Example scripts for 3 surfaces. Short-form video (15s format, production rules). Paid copy voice (cut 40% more than homepage voice). What success looks like on paid.

---

## `assets/`

### `assets/patterns/`
- `grid.svg`: 16×16 pattern unit, 1px dots at `ink/200` on `paper`.
- `brand-wash.svg`: soft radial wash from `brand/50` to `paper`.

### `assets/templates/`

This folder's contents depend on which branch you're on and what the user has on disk.

**Rule of priority, always:**

1. **Real shipped assets > synthetic recreations.** If the user has provided a one-pager PDF, a slide-template library, IG/LinkedIn carousel exports, ads, OG images, or any other surface as a real file, **copy it into `assets/templates/<surface>/` preserving its structure** and reference it as the canonical template. Do NOT recreate that surface as a synthetic SVG.
2. **Synthetic SVG templates are a fallback**, used only when no real asset exists for a surface, AND flagged as drafts in the README so the user knows to replace them.
3. **The Marp theme CSS is always present**: it's a CSS theme, not a recreation, and it's load-bearing for markdown-driven slide decks.

#### When the user provided real assets (Branch B, common case)

Mirror their structure under `assets/templates/`:

```
assets/templates/
├── one-pager/
│   └── <user's-real-one-pager>.pdf
├── youtube/
│   └── <user's-real-intro-slide>.png
├── deck-slides/
│   ├── 01-cards-and-lists/<user's-files>.png
│   ├── 02-process-and-steps/<user's-files>.png
│   └── …
├── instagram-carousel/   (if shipped exports exist)
├── linkedin-carousel/    (if shipped exports exist)
├── ads/                  (if shipped exports exist)
└── marp-theme.css
```

The accompanying `assets/templates/README.md` is an **index of the real assets**, not a description of synthetic ones. It must:
- Open with: *"These are the actual shipped templates, not recreations. When producing a new asset, open the closest match and adapt it. Don't redraw the look from scratch."*
- For deck-slide libraries, include a "pick by content shape" map (e.g., "3 ideas equal weight → file X").
- Note any surfaces where a synthetic draft exists and ask the user to replace it once a real version ships.

#### When no real assets exist (Branch A, fresh brand)

Produce synthetic SVG + rendered PNG + JPG for each:
- `og-image.svg`, 1200×630 hero for social sharing.
- `instagram-carousel-cover.svg`, 1080×1350 hook-slide template.
- `instagram-carousel-body.svg`, 1080×1350 thread-slide template.
- `instagram-carousel-closer.svg`, 1080×1350 dark CTA-slide template.
- `linkedin-post.svg`, 1200×1200 case/stat post template.
- `marp-theme.css`, complete Marp CSS theme.

In `assets/templates/README.md`, mark every synthetic file as a *draft pending real-asset replacement*, with explicit language so the user knows to swap them in over time.

Render via [../scripts/render.mjs](../scripts/render.mjs). It handles the Chromium + Google Fonts + screenshot pipeline.

---

## Size targets

The full generated folder is ~70 files, ~150–200 KB of markdown + code, ~1–2 MB with rendered rasters. Don't truncate to be brief, the point of the system is to be comprehensive. But don't pad either, if a file doesn't have real content to say, let it be terse.
