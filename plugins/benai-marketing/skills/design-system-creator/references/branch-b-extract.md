# Branch B: Extract from an existing business

The business already exists. There's a website, there are shipped assets, there's a logo somewhere. The user's problem isn't "what should we look like?" It's "we've been operating for a while and we need all of it in one place, in a format Claude can use."

This branch is less creative and more archaeological. Your job is to find what's already real, validate it, and codify it, not to re-design.

## Contents

- Step 1: Ingest interview
- Step 2: Scan the working directory for shipped assets
- Step 3: Extract
- Step 4: Reconcile
- Step 5: Codify (templates folder, logo)
- Step 6: Finalize
- Common traps on this branch

---

## Step 1: Ingest interview

Ask once, batch the questions. Keep it short because the user's time is better spent sending you assets than answering introspective questions.

### Required
1. **Public website URL.** (If multiple, the primary marketing site.)
2. **Business in 2 sentences.** What they do, for whom.
3. **Primary audience.** One or two specific types of customer.

### Strongly encouraged
4. **Logo files.** Any format: SVG, PNG, AI, PDF, even a clean screenshot. Ask for every variant they have (primary, inverse, mark-only, wordmark-only, monochrome).
5. **Font names.** Just the names. Actual font files are optional: if they pay for Söhne and have the files, great; if they use Inter from Google Fonts, just tell you.
6. **Existing "brand rules"**, even if it's a one-pager Google Doc, a note in Notion, a PDF from a freelance designer. Share whatever exists.

### Nice to have
7. **Shipped assets.** Pitch decks, Instagram carousels, LinkedIn carousels, static ads, past email screenshots, OG images. The more variety, the better the extraction.
8. **What do you like and dislike about the current look?** (This is how you learn what to preserve vs. what to quietly improve.)

If the user sends a Dropbox / Drive / Figma link, read what you can. If Figma access requires auth you don't have, ask for screenshots.

---

## Step 2: Scan the working directory for shipped assets (do this BEFORE extraction)

Branch B's most common failure is recreating templates the user already shipped. Avoid it: before any scraping, inventory what's actually on disk.

```bash
# from the project root
find . -maxdepth 4 -type f \( -name '*.pdf' -o -name '*.png' -o -name '*.jpg' -o -name '*.jpeg' \) | head -100
ls -la                              # see top-level layout, organized subfolders are usually template libraries
```

Read a representative sample of each file group with the Read tool. You're looking for:

- **One-pagers / sales sheets** (`*.pdf` at the project root or in a `sales/` / `proposal/` folder), copy to `assets/templates/one-pager/`.
- **Slide template libraries** (organized subfolders like `01-cards-and-lists/`, `slide-templates/`, `decks/`), copy the full structure to `assets/templates/deck-slides/<category>/`.
- **YouTube intro / thumbnail frames** (`slide-01.png`, `youtube/`, `thumbnails/`), copy to `assets/templates/youtube/`.
- **Carousel exports** (sequential PNGs, often numbered), copy to `assets/templates/instagram-carousel/` or `assets/templates/linkedin-carousel/`.
- **Ad creatives** (`ads/`, `*-1080x1080.png`, etc.), copy to `assets/templates/ads/`.
- **Logo files** in any format: these are reference for Step 4 (logo extraction), not templates.

**Rule of thumb: if the asset is a visible deliverable the brand has already shipped, copy it as-is into `assets/templates/`. Do NOT plan to recreate it as a synthetic SVG later.** A lazy SVG recreation will look worse than the real shipped file and will degrade the design system.

If the working directory is empty (the user only gave you a URL), this step still matters. Note that the templates folder will be lighter, and synthetic drafts you produce later need to be flagged for the user.

---

## Step 3: Extract

Run extraction in parallel:

### Firecrawl on the marketing site

```bash
firecrawl scrape <homepage> --format markdown,branding --full-page-screenshot --wait-for 5000 -o brands/self/homepage.json --json
firecrawl scrape <pricing-or-about> --format markdown,branding --full-page-screenshot --wait-for 5000 -o brands/self/secondary.json --json
```

The `branding` format returns a rich JSON with `colors`, `fonts`, `typography`, `spacing`, `components`, `images`, and `personality`. This is your primary source of truth for colors, fonts, radius, button treatment, and logo URL.

### extract-design-system for independent verification

```bash
(cd brands/self && npx -y extract-design-system <homepage>)
```

This outputs `brands/self/.extract-design-system/normalized.json` with real CSS-computed tokens. Cross-check against Firecrawl's LLM-inferred values. If they disagree significantly, the computed values win (they're measured, not inferred).

### Pull and store assets
Download:
- Homepage screenshot to `brands/self/homepage.png`
- Logo URL from `branding.images.logo` to `brands/self/logo.<ext>`
- Favicon to `brands/self/favicon.ico`
- OG image to `brands/self/og.png`

---

## Step 4: Reconcile

This is the critical step. The extracted data and the user-uploaded assets will not agree perfectly. Expect:

- The website's current primary color differs from the logo's PMS reference.
- The shipped Instagram carousels use a different typeface than the website.
- The pitch deck uses a shade of the brand color the website doesn't.
- The logo the user sent has higher resolution than the one on the site.

### The reconciliation order

1. **User-uploaded logo > website-scraped logo.** The user-sent version is the canonical source; the website often serves an older raster.
2. **User-stated font > website-scraped font.** The website may be serving a fallback if the live font file failed, trust the user's answer first, then verify.
3. **Shipped asset colors > website colors, for 1:1 conflicts.** If the pitch deck they ship tomorrow uses `#2859D9` but the website shows `#1976D2`, the deck's color is the one that matters. But flag it to the user: sometimes the site is the "old" brand and they haven't updated.
4. **Recently-shipped asset voice > website voice.** If the LinkedIn posts from the last 60 days sound different from the homepage, the owner's current voice is the LinkedIn voice.
5. **Any explicit "brand rules" doc they sent > anything inferred.** Treat the doc as ground truth; use the scrapes to supplement what the doc didn't cover.

### Produce a reconciliation table

Before writing the full system, write `research/reconciliation.md` summarizing what you found and any conflicts. Example:

```markdown
| Attribute      | From website     | From user upload | From shipped assets | Decision          |
| -------------- | ---------------- | ---------------- | ------------------- | ----------------- |
| Primary color  | #1976D2         | n/a              | #2859D9 (decks)     | #2859D9 (decks)   |
| Headline font  | Inter            | "Inter"          | Inter               | Inter             |
| Body font      | Inter            | "Inter"          | Open Sans (emails)  | Inter (flag email)|
| Logo radius    | 0px              | Rounded corners  | 8px (slides)        | 8px, aligning    |
| Hero copy tone | Formal/corporate | n/a              | Casual (LinkedIn)   | Casual (LinkedIn is current) |
```

Share this with the user before writing the system, so they can override any decision you made.

---

## Step 5: Codify

Use the same templates as Branch A ([../assets/templates/](../assets/templates/)), but with real extracted values:

| Template placeholder | Fill with                                                     |
| -------------------- | ------------------------------------------------------------- |
| `{{BRAND_NAME}}`     | From the user's 2-sentence description (Q2 of ingest)         |
| `{{BRAND_TAGLINE}}`  | The actual tagline from the homepage hero, if there is one. If not, ask the user to confirm or write one. |
| `{{PRIMARY_HEX}}`    | From reconciliation                                           |
| `{{PAPER_HEX}}`      | From scraped `colors.background`                              |
| `{{INK_HEX}}`        | From scraped `colors.textPrimary`                             |
| `{{DISPLAY_FONT}}`   | From reconciliation                                           |
| `{{BODY_FONT}}`      | From reconciliation                                           |
| `{{LOGO_MOTIF}}`     | The actual logo SVG path(s) the user uploaded                 |

### When the extraction is thin

Some things won't extract well:
- **Voice rules.** The website will give you *how the brand currently sounds*, but the rules behind it aren't on the page.
- **Imagery direction.** You'll see the photos on the site but won't infer the *rules* (no stock, real customers only, etc.).
- **Motion principles.** CSS/JS will tell you what motions exist, not what's deliberately excluded.
- **Vocabulary per vertical.** You'll see the words used on the homepage, not the full glossary per vertical.

For each of these, briefly ask the user 1–2 clarifying questions. Do not invent voice rules: "the brand is playful but professional" is a lie if the site doesn't support it.

Example:

> I've pulled your colors, fonts, and spacing. Before I write the voice guide, two questions:
>
> 1. Looking at the voice on the homepage vs. your recent LinkedIn posts, which is more "you" going forward?
> 2. Do you have a banned-word list: anything you refuse to say?

Then codify what they told you, not what you guessed.

---

### Templates folder: populate from real assets, not synthetic recreations

The `assets/templates/` folder is where the asset-fidelity rule lives. Concretely:

1. **Copy** every shipped asset you found in Step 2 into `assets/templates/<surface>/`, preserving any folder structure (e.g., a 28-template slide library keeps its category subfolders).
2. **Write `assets/templates/README.md`** as an *index of the real assets*, not a description of synthetic ones. Include:
   - One entry per surface (one-pager, deck-slides, youtube, etc.).
   - For deck-slide libraries: a "pick by content shape" map ("3 ideas → file X", "vertical timeline → file Y").
   - A note that says: *"These are the actual shipped Ben AI templates, not recreations. When producing a new asset, open the closest match and adapt it. Don't redraw the look from scratch."*
3. **Only generate a synthetic SVG template when no real asset exists for that surface.** In that case, mark it clearly as a draft in the README and ask the user to replace it once they have a real one.
4. **Keep the Marp theme CSS.** It's a CSS theme, not a recreation: it's load-bearing for markdown-driven decks.

### Logo: render only what's there

When generating logo SVGs from the user's source files:

- Find the highest-resolution copy available (uploaded file > website-scraped file > favicon).
- Identify every visible feature in the source. If the mark is *just a circle and a smile*, render exactly that. Do not add eye dots, decorative tails, secondary strokes, or "polish" elements that aren't in the source.
- After rendering, run [../scripts/render.mjs](../scripts/render.mjs) on your SVG and visually compare the rasterized output against the source. Confirm that every visible feature (and only those features) is present.
- Update [../assets/templates/logo/motifs.md](../assets/templates/logo/motifs.md) and [logo/usage.md](logo/usage.md), under "Construction", to explicitly call out the simplifying choices ("the mark has no eyes: head + smile only") so future LLMs reading the system don't add features back in.
- If the source is too low-res to read confidently, **ask the user for a higher-res version before generating.** Do not invent details to "clean up" a blurry input.

---

## Step 6: Finalize

Same as Branch A, produce the Claude Design form text per [claude-design-form.md](claude-design-form.md) and hand back:

1. The `design-system/` folder path.
2. The two pasteable text blocks for Claude Design's form.
3. The `research/reconciliation.md` so the user can see the decisions you made.
4. A "gaps" note, anything you needed to invent (e.g., "the brand had no motion guidance; I applied defaults; here's where you might want to customize").

## Common traps on this branch

- **Treating the website as ground truth.** Websites rot. Recent shipped assets beat stale homepages.
- **Inventing voice rules from thin air.** If you can't point to a real sentence the brand wrote that embodies the rule, don't codify the rule.
- **Skipping the reconciliation table.** The user needs to see your decisions before you lock them in, or they'll feel ambushed when they open the generated system and find colors they didn't expect.
- **Ignoring the user's "don't change this" signal.** If they say "the logo is the logo, don't touch it," don't modernize it. Extract it as-is.
- **Over-generating.** If they don't have an Instagram presence yet, you don't need to produce full IG templates. Note it as a gap and move on.
- **Recreating templates the user already shipped.** This is the #1 trap on Branch B. If the user has a one-pager PDF, slide-template library, real carousel exports, or YouTube thumbnails on disk, those ARE the templates. Copy them into `assets/templates/`. A synthetic SVG recreation will look lazy next to the real thing and pasting it into a downstream tool will degrade the brand.
- **Adding features to the logo that aren't there.** A smiley with no eyes stays eye-less. A wordmark in a custom typeface doesn't get "improved" with an alternate weight. Render only what the source shows.
