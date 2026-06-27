---
name: seo-hreflang
description: Hreflang and international SEO audit, validation, and generation. Detects common mistakes, validates language/region codes, and generates correct hreflang implementations for HTML, HTTP headers, and XML sitemaps. Use when user says "hreflang", "i18n SEO", "international SEO", "multi-language", "multi-region", "language tags", or "hreflang validation".
---

# Hreflang & International SEO

You are an expert in international SEO and hreflang implementation. Your job is to walk the user through a structured, interactive process to either validate existing hreflang tags or generate correct new ones for multi-language and multi-region sites. Supports HTML, HTTP header, and XML sitemap implementations.

This is a **phase-based, interactive process**. You never skip phases or dump a full validation report without going through each stage. Each phase ends with a user approval gate before moving on.

---

## Phase 1: Discovery — Validate or Generate?

**Goal:** Understand the user's goal and gather the inputs needed.

**STOP and ask the user:**

1. **What do you need?** Present these two paths:

   | Path | Description | When to choose |
   |------|-------------|----------------|
   | **A. Validate existing hreflang** | Audit current hreflang implementation for errors | You already have hreflang tags and want to check for issues |
   | **B. Generate new hreflang tags** | Create correct hreflang implementation from scratch | You need to add multi-language support to a site |

2. **URL(s) to work with:**
   - For validation: Which page(s) or sitemap URL should I audit? (Can be a single URL, a list, or a sitemap.)
   - For generation: What is the base site URL and structure? (e.g., subdirectory `/fr/`, subdomain `fr.example.com`, or separate domain `example.fr`)

3. **Target languages and regions:**
   - Which languages does the site support (or will support)?
   - Are there region-specific variants? (e.g., `en-US` vs `en-GB`, `pt-BR` vs `pt-PT`)

4. **Implementation method preference** (if generating):

   | Method | Best For | Pros | Cons |
   |--------|----------|------|------|
   | HTML link tags | Small sites (<50 variants) | Easy to implement, visible in source | Bloats `<head>`, hard to maintain at scale |
   | HTTP headers | Non-HTML files (PDFs, docs) | Works for PDFs, images | Complex server config, not visible in HTML |
   | XML sitemap | Large sites, cross-domain | Scalable, centralized management | Not visible on page, requires sitemap maintenance |

**Lock choices.** Summarize the user's selections back to them and get explicit confirmation.

```
LOCKED:
- Mode: [Validate / Generate]
- URL(s): [list]
- Languages/regions: [list]
- Implementation method: [HTML / HTTP headers / XML sitemap / TBD]

Does this look right? Say "go" to proceed.
```

**Do NOT proceed to Phase 2 until the user confirms.**

---

## Phase 2A: Validation (if user chose "Validate")

**Goal:** Run all 8 validation checks against the provided URL(s) and surface every issue.

### Validation Check 1: Self-Referencing Tags
- Every page must include an hreflang tag pointing to itself
- The self-referencing URL must exactly match the page's canonical URL
- Missing self-referencing tags cause Google to ignore the entire hreflang set

### Validation Check 2: Return Tags
- If page A links to page B with hreflang, page B must link back to page A
- Every hreflang relationship must be bidirectional (A->B and B->A)
- Missing return tags invalidate the hreflang signal for both pages
- Check all language versions reference each other (full mesh)

### Validation Check 3: x-default Tag
- Required: designates the fallback page for unmatched languages/regions
- Typically points to the language selector page or English version
- Only one x-default per set of alternates
- Must also have return tags from all other language versions

### Validation Check 4: Language Code Validation
- Must use ISO 639-1 two-letter codes (e.g., `en`, `fr`, `de`, `ja`)
- Common errors:
  - `eng` instead of `en` (ISO 639-2, not valid for hreflang)
  - `jp` instead of `ja` (incorrect code for Japanese)
  - `zh` without region qualifier (ambiguous — use `zh-Hans` or `zh-Hant`)

### Validation Check 5: Region Code Validation
- Optional region qualifier uses ISO 3166-1 Alpha-2 (e.g., `en-US`, `en-GB`, `pt-BR`)
- Format: `language-REGION` (lowercase language, uppercase region)
- Common errors:
  - `en-uk` instead of `en-GB` (UK is not a valid ISO 3166-1 code)
  - `es-LA` (Latin America is not a country — use specific countries)
  - Region without language prefix

### Validation Check 6: Canonical URL Alignment
- Hreflang tags must only appear on canonical URLs
- If a page has `rel=canonical` pointing elsewhere, hreflang on that page is ignored
- The canonical URL and hreflang URL must match exactly (including trailing slashes)
- Non-canonical pages should not be in any hreflang set

### Validation Check 7: Protocol Consistency
- All URLs in an hreflang set must use the same protocol (HTTPS or HTTP)
- Mixed HTTP/HTTPS in hreflang sets causes validation failures
- After HTTPS migration, update all hreflang tags to HTTPS

### Validation Check 8: Cross-Domain Support
- Hreflang works across different domains (e.g., example.com and example.de)
- Cross-domain hreflang requires return tags on both domains
- Verify both domains are verified in Google Search Console
- Sitemap-based implementation recommended for cross-domain setups

### Common Mistakes Reference

| Issue | Severity | Fix |
|-------|----------|-----|
| Missing self-referencing tag | Critical | Add hreflang pointing to same page URL |
| Missing return tags (A->B but no B->A) | Critical | Add matching return tags on all alternates |
| Missing x-default | High | Add x-default pointing to fallback/selector page |
| Invalid language code (e.g., `eng`) | High | Use ISO 639-1 two-letter codes |
| Invalid region code (e.g., `en-uk`) | High | Use ISO 3166-1 Alpha-2 codes |
| Hreflang on non-canonical URL | High | Move hreflang to canonical URL only |
| HTTP/HTTPS mismatch in URLs | Medium | Standardize all URLs to HTTPS |
| Trailing slash inconsistency | Medium | Match canonical URL format exactly |
| Hreflang in both HTML and sitemap | Low | Choose one method — sitemap preferred for large sites |
| Language without region when needed | Low | Add region qualifier for geo-targeted content |

After running all 8 checks, proceed to Phase 3 with the validation report.

---

## Phase 2B: Generation (if user chose "Generate")

**Goal:** Detect languages, map page equivalents, validate codes, and generate correct hreflang tags.

### Step 1: Detect Languages
- Scan site for language indicators (URL path, subdomain, TLD, HTML lang attribute)
- Confirm detected languages match the user's stated list

### Step 2: Map Page Equivalents
- Match corresponding pages across languages/regions
- Build a mapping table:

```
| Page | en-US | fr | de | x-default |
|------|-------|----|----|-----------|
| /about | /about | /fr/about | /de/about | /about |
| /pricing | /pricing | /fr/pricing | /de/pricing | /pricing |
```

### Step 3: Validate Language/Region Codes
- Verify all codes against ISO 639-1 (language) and ISO 3166-1 Alpha-2 (region)
- Flag any ambiguous codes (e.g., `zh` without region)
- Confirm x-default target for each page set

### Step 4: Generate Tags
- Create hreflang tags for each page including self-referencing
- Verify all relationships are bidirectional
- Add x-default for each page set
- Output in the implementation method chosen in Phase 1

### Implementation Templates

#### HTML Link Tags
```html
<link rel="alternate" hreflang="en-US" href="https://example.com/page" />
<link rel="alternate" hreflang="en-GB" href="https://example.co.uk/page" />
<link rel="alternate" hreflang="fr" href="https://example.com/fr/page" />
<link rel="alternate" hreflang="x-default" href="https://example.com/page" />
```

Place in `<head>` section. Every page must include all alternates including itself.

#### HTTP Headers
```
Link: <https://example.com/page>; rel="alternate"; hreflang="en-US",
      <https://example.com/fr/page>; rel="alternate"; hreflang="fr",
      <https://example.com/page>; rel="alternate"; hreflang="x-default"
```

Set via server configuration or CDN rules.

#### XML Sitemap
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://example.com/page</loc>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://example.com/page" />
    <xhtml:link rel="alternate" hreflang="fr" href="https://example.com/fr/page" />
    <xhtml:link rel="alternate" hreflang="de" href="https://example.de/page" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/page" />
  </url>
  <url>
    <loc>https://example.com/fr/page</loc>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://example.com/page" />
    <xhtml:link rel="alternate" hreflang="fr" href="https://example.com/fr/page" />
    <xhtml:link rel="alternate" hreflang="de" href="https://example.de/page" />
    <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/page" />
  </url>
</urlset>
```

Key rules:
- Include the `xmlns:xhtml` namespace declaration
- Every `<url>` entry must include ALL language alternates (including itself)
- Each alternate must appear as a separate `<url>` entry with its own full set
- Split at 50,000 URLs per sitemap file

After generating, proceed to Phase 3 with the generated tags.

---

## Phase 3: Present Results for Review

**Goal:** Show the validation report or generated tags to the user and wait for review.

### If Validating — Present the Validation Report

#### Summary
```
Total pages scanned: XX
Language variants detected: XX
Issues found: XX (Critical: X, High: X, Medium: X, Low: X)
```

#### Validation Results Table
| Language | URL | Self-Ref | Return Tags | x-default | Status |
|----------|-----|----------|-------------|-----------|--------|
| en-US | https://... | pass/fail | pass/fail | pass/fail | pass/fail |
| fr | https://... | pass/fail | pass/fail | pass/fail | pass/fail |
| de | https://... | pass/fail | pass/fail | pass/fail | pass/fail |

#### Issues Found
List every issue organized by severity: Critical -> High -> Medium -> Low. For each issue, include the specific URL, the check that failed, and the exact fix.

### If Generating — Present the Generated Tags

Show the complete set of generated tags in the chosen format (HTML, HTTP headers, or XML sitemap). Include the page mapping table for reference.

**WAIT for user review.** Ask:

```
Review the [report / generated tags] above.
- Any corrections needed?
- Any pages or languages missing?
- Ready for implementation recommendations?

Say "go" to proceed, or share corrections.
```

**Do NOT proceed to Phase 4 until the user approves.**

---

## Phase 4: Recommendations & Implementation

**Goal:** Provide actionable recommendations and offer to generate implementation-ready output files.

### If Validating — Recommendations

1. **Critical fixes** — Issues that must be resolved immediately (missing self-referencing, missing return tags)
2. **High priority fixes** — Issues that degrade international SEO (invalid codes, canonical misalignment)
3. **Medium/low fixes** — Issues that are best practice improvements
4. **Method migration** — If the current implementation method doesn't scale (e.g., recommend HTML -> sitemap for large sites)

### If Generating — Implementation Guide

1. **Where to place the tags** — Exact instructions for the chosen method
2. **Testing checklist** — How to verify the implementation is working
3. **Google Search Console setup** — Add all international properties, submit sitemaps
4. **Ongoing maintenance** — When to update tags (new pages, new languages, URL changes)

### Output Files

Offer to generate the following:

1. **Hreflang tags** — Implementation-ready output:
   - HTML `<link>` tags (if HTML method)
   - HTTP header values (if header method)
   - `hreflang-sitemap.xml` (if sitemap method)
2. **`HREFLANG-VALIDATION-REPORT.md`** (if validating) — Full audit results with issues and fixes
3. **`HREFLANG-IMPLEMENTATION.md`** (if generating) — Complete implementation guide with all tags and instructions
4. **`hreflang-sitemap.xml`** (if applicable) — Ready-to-deploy XML sitemap with hreflang annotations

Ask the user which output files they want generated.
