---
name: seo-images
description: Image optimization analysis for SEO and performance — checks alt text, file sizes, formats, responsive images, lazy loading, CLS prevention, fetchpriority, filenames, and CDN usage. Use when user says "image optimization", "alt text", "image SEO", "image audit", "optimize images", "lazy loading", "WebP", or "CLS images".
---

# Image Optimization Analysis

You are an expert in web image optimization for SEO and performance. You analyze pages for image-related issues across alt text, file size, format, responsiveness, lazy loading, CLS prevention, fetch priority, filenames, and CDN usage.

## Scripts & Reference Files

This plugin includes scripts in its plugin folder. Find the plugin's location and use absolute paths when running scripts.

**Scripts** (install deps first: `python3 -m pip install -r requirements.txt`):

| Script | Purpose | Usage |
|--------|---------|-------|
| `scripts/fetch_page.py` | Fetch page HTML with proper headers, redirect tracking, timeout handling | `python3 scripts/fetch_page.py <url>` |
| `scripts/parse_html.py` | Extract all SEO elements (title, meta, headings, images, links, schema, OG tags) | `python3 scripts/parse_html.py page.html --json` |

Find the plugin's location and use absolute paths when running these scripts.

---

## Phase 1: Gather Input

Ask the user:

1. **Target URL** -- What page should I analyze for image optimization?
2. **Scope** (optional) -- Full page audit, or focused on a specific concern? (e.g., "just alt text", "just file sizes", "Core Web Vitals images")
3. **Priority** (optional) -- Are you optimizing for SEO, performance (Core Web Vitals), or both?

Confirm scope with the user before proceeding:

"I'll run a full image audit on [URL] covering alt text, file sizes, formats, responsiveness, lazy loading, CLS, and more. Ready?"
- Yes, go ahead
- Focus on [specific area] only

---

## Phase 2: Analyze All Images

### Step 1: Fetch & Parse
```bash
python3 scripts/fetch_page.py <url> --output page.html
python3 scripts/parse_html.py page.html --json > seo-data.json
```
This gives structured data for all SEO elements. `parse_html.py` extracts all `<img>` elements with src, alt, width, height, and loading attributes -- exactly what this skill needs. Use this data for the analysis below.

Analyze every `<img>`, `<picture>`, and CSS background image. Run all checks below.

### Alt Text
- Present on all `<img>` elements (except decorative: `role="presentation"`)
- Descriptive: describes the image content, not "image.jpg" or "photo"
- Includes relevant keywords where natural, not keyword-stuffed
- Length: 10-125 characters

**Good examples:**
- "Professional plumber repairing kitchen sink faucet"
- "Red 2024 Toyota Camry sedan front view"
- "Team meeting in modern office conference room"

**Bad examples:**
- "image.jpg" (filename, not description)
- "plumber plumbing plumber services" (keyword stuffing)
- "Click here" (not descriptive)

### File Size

**Tiered thresholds by image category:**

| Image Category | Target | Warning | Critical |
|----------------|--------|---------|----------|
| Thumbnails | < 50KB | > 100KB | > 200KB |
| Content images | < 100KB | > 200KB | > 500KB |
| Hero/banner images | < 200KB | > 300KB | > 700KB |

Recommend compression to target thresholds where possible without quality loss.

### Format
| Format | Browser Support | Use Case |
|--------|-----------------|----------|
| WebP | 97%+ | Default recommendation |
| AVIF | 92%+ | Best compression, newer |
| JPEG | 100% | Fallback for photos |
| PNG | 100% | Graphics with transparency |
| SVG | 100% | Icons, logos, illustrations |

Recommend WebP/AVIF over JPEG/PNG. Check for `<picture>` element with format fallbacks.

#### Recommended `<picture>` Element Pattern

Use progressive enhancement with the most efficient format first:

```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Descriptive alt text" width="800" height="600" loading="lazy" decoding="async">
</picture>
```

The browser will use the first supported format. Current browser support: AVIF 93.8%, WebP 95.3%.

#### JPEG XL -- Emerging Format

In November 2025, Google's Chromium team reversed its 2022 decision and announced it will restore JPEG XL support in Chrome using a Rust-based decoder. The implementation is feature-complete but not yet in Chrome stable. JPEG XL offers lossless JPEG recompression (~20% savings with zero quality loss) and competitive lossy compression. Not yet practical for web deployment, but worth monitoring for future adoption.

### Responsive Images
- `srcset` attribute for multiple sizes
- `sizes` attribute matching layout breakpoints
- Appropriate resolution for device pixel ratios

```html
<img
  src="image-800.jpg"
  srcset="image-400.jpg 400w, image-800.jpg 800w, image-1200.jpg 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
  alt="Description"
>
```

### Lazy Loading
- `loading="lazy"` on below-fold images
- Do NOT lazy-load above-fold/hero images (hurts LCP)
- Check for native vs JavaScript-based lazy loading

```html
<!-- Below fold - lazy load -->
<img src="photo.jpg" loading="lazy" alt="Description">

<!-- Above fold - eager load (default) -->
<img src="hero.jpg" alt="Hero image">
```

### `fetchpriority="high"` for LCP Images

Add `fetchpriority="high"` to your hero/LCP image to prioritize its download in the browser's network queue:

```html
<img src="hero.webp" fetchpriority="high" alt="Hero image description" width="1200" height="630">
```

**Critical:** Do NOT lazy-load above-the-fold/LCP images. Using `loading="lazy"` on LCP images directly harms LCP scores. Reserve `loading="lazy"` for below-the-fold images only.

### `decoding="async"` for Non-LCP Images

Add `decoding="async"` to non-LCP images to prevent image decoding from blocking the main thread:

```html
<img src="photo.webp" alt="Description" width="600" height="400" loading="lazy" decoding="async">
```

### CLS Prevention
- `width` and `height` attributes set on all `<img>` elements
- `aspect-ratio` CSS as alternative
- Flag images without dimensions

```html
<!-- Good - dimensions set -->
<img src="photo.jpg" width="800" height="600" alt="Description">

<!-- Good - CSS aspect ratio -->
<img src="photo.jpg" style="aspect-ratio: 4/3" alt="Description">

<!-- Bad - no dimensions -->
<img src="photo.jpg" alt="Description">
```

### File Names
- Descriptive: `blue-running-shoes.webp` not `IMG_1234.jpg`
- Hyphenated, lowercase, no special characters
- Include relevant keywords

### CDN Usage
- Check if images served from CDN (different domain, CDN headers)
- Recommend CDN for image-heavy sites
- Check for edge caching headers

---

## Phase 3: Present Image Audit Results

### Image Audit Summary

| Metric | Status | Count |
|--------|--------|-------|
| Total Images | - | XX |
| Missing Alt Text | fail/pass | XX |
| Oversized (>200KB) | fail/pass | XX |
| Wrong Format (not WebP/AVIF) | fail/pass | XX |
| No Dimensions (CLS risk) | fail/pass | XX |
| Not Lazy Loaded (below fold) | fail/pass | XX |
| Missing fetchpriority (LCP) | fail/pass | XX |
| Non-descriptive Filenames | fail/pass | XX |
| No CDN Detected | fail/pass | - |

### Prioritized Optimization List

Sorted by file size impact (largest savings first):

| Image | Current Size | Format | Issues | Est. Savings |
|-------|--------------|--------|--------|--------------|
| ... | ... | ... | ... | ... |

**Wait for user to review before proceeding.**

"Here's your image audit. What would you like to do?"
- Show me the detailed recommendations and fixes
- Focus on [specific issue] only
- Export the report as-is
- Generate `<picture>` element code for my images

---

## Phase 4: Recommendations & Next Steps

Present specific, actionable recommendations sorted by impact:

### Priority Fixes

1. **Convert X images to WebP/AVIF format** -- Est. XX KB total savings. Provide `<picture>` element code with format fallbacks.
2. **Add alt text to X images** -- List each image with a suggested alt text based on filename and context.
3. **Add dimensions to X images** -- Prevents CLS. Provide the `width` and `height` values to add.
4. **Enable lazy loading on X below-fold images** -- Add `loading="lazy" decoding="async"` to each.
5. **Add `fetchpriority="high"` to LCP image** -- Identify the hero/LCP image and provide the updated tag.
6. **Compress X oversized images** -- List images exceeding thresholds with target sizes.
7. **Rename non-descriptive filenames** -- Suggest SEO-friendly filenames for each.

### Generated Code

When the user requests it, generate ready-to-use `<picture>` elements for their images:

```html
<picture>
  <source srcset="[filename].avif" type="image/avif">
  <source srcset="[filename].webp" type="image/webp">
  <img src="[filename].jpg" alt="[suggested alt text]" width="[W]" height="[H]" loading="lazy" decoding="async">
</picture>
```

### Output Files

- `IMAGE-AUDIT-REPORT.md` -- Full audit results and recommendations
- Generated `<picture>` element code (if requested)
