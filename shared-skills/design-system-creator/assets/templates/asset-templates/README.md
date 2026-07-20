# Asset templates

Parameterized SVGs + a Marp CSS theme. Each file has `{{PLACEHOLDER}}` tokens. Do a find-and-replace per brand, then pass the resulting SVGs to [`../../../scripts/render.mjs`](../../../scripts/render.mjs) to produce PNG + JPG previews.

## Files

| Template                                      | Output dimensions | Use                                          |
| --------------------------------------------- | ----------------- | -------------------------------------------- |
| `og-image-template.svg`                       | 1200×630          | Social share card (Open Graph / Twitter)     |
| `instagram-carousel-cover-template.svg`       | 1080×1350         | IG carousel first slide (hook)               |
| `instagram-carousel-body-template.svg`        | 1080×1350         | IG carousel thread slide                     |
| `instagram-carousel-closer-template.svg`      | 1080×1350         | IG carousel last slide (dark CTA)            |
| `linkedin-post-template.svg`                  | 1200×1200         | LinkedIn stat / case post                    |
| `marp-theme.css.template`                     | n/a (CSS)         | Markdown-based slide decks (Marp)            |

## Placeholder substitution

### Colors & type (shared across all SVGs)

| Placeholder           | Source                                         |
| --------------------- | ---------------------------------------------- |
| `{{BRAND_NAME}}`      | Brand display name                             |
| `{{BRAND_SLUG}}`      | Kebab-case slug                                |
| `{{BRAND_DOMAIN}}`    | e.g., `lantern.com`                            |
| `{{FONT_FAMILY}}`     | From the token set                             |
| `{{PRIMARY_HEX}}`     | Primary color                                  |
| `{{PAPER_HEX}}`       | Page background                                |
| `{{SURFACE_HEX}}`     | Card background (usually `#FFFFFF`)            |
| `{{INK_HEX}}`         | Body text (ink-900)                            |
| `{{INK_500_HEX}}`     | Muted secondary text                           |
| `{{INK_600_HEX}}`     | Body secondary text                            |
| `{{INK_700}}`…`{{INK_100}}` | Ink scale steps (for Marp theme)         |
| `{{LINE_HEX}}`        | Hairline divider                               |
| `{{BRAND_200_HEX}}`   | Lighter brand step for dark-on-dark subtitles  |
| `{{BRAND_300_HEX}}`   | Lighter brand step for captions on dark        |
| `{{BRAND_400_HEX}}`   | Lighter brand step for overlines on dark       |
| `{{BRAND_700}}`       | Darker brand step                              |
| `{{BRAND_900_HEX}}`   | Darkest brand, used for dark backgrounds       |

### Logo substitution

The asset templates include placeholder `{{MOTIF_PATHS}}` (regular) and `{{INVERSE_MOTIF_PATHS}}` (for dark backgrounds). Pull the SVG path strings from [`../logo/motifs.md`](../logo/motifs.md) based on the brand's chosen motif, and substitute.

For the inverse variant, swap `{{PRIMARY}}` → `{{PAPER_HEX}}` and `{{PAPER}}` → `{{BRAND_900_HEX}}` (or `{{INK_HEX}}`) in the motif paths.

### Copy substitution

Each template has per-template copy placeholders — e.g., `{{HEADLINE_LINE_1}}`, `{{SLIDE_KICKER_UPPERCASE}}`, `{{BIG_STAT}}`, `{{STAT_DESCRIPTION}}`. These come from the brand's `voice/homepage-copy.md` or are generated fresh per asset per [`../voice/`](../voice/) rules.

Keep copy tight:
- Overlines: ≤3 words, uppercased.
- Hero headlines: 5–12 words across ≤3 lines.
- Subheads: ≤28 words.
- Stats: one number, one unit, one timeframe.

## Rendering

After substitution, the SVGs are ready to pass through the renderer:

```bash
node design-system-creator-skill/scripts/render.mjs \
  design-system/assets/templates/og-image.svg \
  design-system/assets/templates/instagram-carousel-cover.svg \
  design-system/assets/templates/instagram-carousel-body.svg \
  design-system/assets/templates/instagram-carousel-closer.svg \
  design-system/assets/templates/linkedin-post.svg
```

PNG + JPG previews are written alongside the input SVGs.

## Fidelity check

Once rendered, open each JPG and check:

1. **Typography** — are fonts rendering correctly? If Inter (or the chosen face) isn't in Google Fonts, the screenshot will fall back to a system face. That's your signal to upload font files manually.
2. **Color** — does the primary read as intended at scale? Cool blues often "dull" against large paper backgrounds; warm tones often "push" visually. If the brand color feels wrong at this scale, iterate the shade before you publish.
3. **Readability** — is the headline legible at thumbnail size (Instagram grid: 144×144)? Stand the image far back, or shrink it to 10% — it should still read.
4. **Brand mark** — does the small mark in the footer stay crisp? If it's a complex motif with fine strokes, consider simplifying it at this scale.
