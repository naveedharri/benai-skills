# Asset-fidelity rules

These two rules apply on **both branches** and override the "produce every file" instinct. Real artifacts beat synthetic recreations every time.

## Rule 1: When the user provides shipped assets, use them as templates. Do NOT recreate them.

If the user has handed you (or you have discovered in their working directory) any of: a one-pager PDF, a pitch deck, slide-template library, IG/LinkedIn carousels, ads, OG images, email screenshots, or any other shipped asset that demonstrates the brand's look, copy those files into `design-system/assets/templates/` and reference them as the canonical templates.

Do not write synthetic SVG recreations of carousel covers, OG images, LinkedIn posts, or any other surface for which the user already has a real version. A synthetic recreation looks lazy next to the real shipped artifact, and pasting it into a downstream tool (Claude Design, a designer's brief) degrades the brand. The user's own assets are the highest-fidelity version of the brand that exists.

Concretely:

- **Browse the user's working directory before generating templates.** Look for `*.pdf`, `*.png`, `*.jpg` files at the project root, in subfolders that look organized (for example `slide-templates/`, `decks/`, `social/`), and in any folder the user mentioned in their prompt.
- **Copy real assets into `assets/templates/<surface>/` preserving structure.** For example, a 28-template slide library lives in `assets/templates/deck-slides/<category>/<file>.png`.
- **Replace the asset-templates section of [output-structure.md](output-structure.md) with the real files** in your generated `README.md` for `assets/templates/`. Document which template to pick by content shape ("3 ideas equal weight, file X"), not by a made-up filename.
- **Only generate synthetic templates when no real asset exists for that surface, AND** explicitly flag each synthetic asset to the user with: *"I drafted this, let me know if it should be replaced with one of your real shipped versions."* On Branch A (fresh brand), every template is synthetic by definition; on Branch B, synthetic templates should be the exception, not the default.
- **Do not delete a real asset to make room for a synthetic one.** If the user provides a deck library *and* a YouTube intro slide, keep both. Templates are not deduplicated by surface; they are the user's canon.

## Rule 2: When you render the logo, render it faithfully. Do NOT add features.

If the user provides a logo (file upload, website-scraped raster, or a clean reference photo of the asset in use), render an SVG that matches what is actually there. Don't add eye dots to a smiley that has none. Don't add a serif tail to a sans wordmark. Don't "improve" a 2-stroke mark by adding decorative elements. The brand owns the logo; the logo is what it is.

After producing logo SVGs, **diff your output against the source visually**: render the SVG with [../scripts/render.mjs](../scripts/render.mjs), open both side by side, and confirm every visible feature (and only those features) is present. If the source logo has lower resolution than you would like, ask the user for a higher-res version. Don't invent details to "clean it up."

If you are uncertain about a feature ("does this circle have eye dots or just a smile?"), zoom into the highest-resolution copy you can find and confirm before generating. When in doubt, render the simpler version and ask the user to confirm.
