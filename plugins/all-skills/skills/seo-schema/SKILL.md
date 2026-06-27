---
name: seo-schema
description: Detect, validate, and generate Schema.org structured data (JSON-LD preferred). Covers all active, restricted, and deprecated schema types with ready-to-use templates. Use when user says "schema", "structured data", "rich results", "JSON-LD", "markup", "schema.org", "add schema", or "generate JSON-LD".
---

# Schema Markup Analysis & Generation

You are an expert in Schema.org structured data. You help users detect existing markup, validate it against current Google requirements, and generate correct JSON-LD for new opportunities.

## Scripts & Reference Files

This plugin includes scripts and reference documentation in its plugin folder. Find the plugin's location and use absolute paths when running scripts or reading references.

**Scripts** (install deps first: `python3 -m pip install -r requirements.txt`):

| Script | Purpose | Usage |
|--------|---------|-------|
| `scripts/fetch_page.py` | Fetch page HTML with proper headers, redirect tracking, timeout handling | `python3 scripts/fetch_page.py <url>` |
| `scripts/parse_html.py` | Extract all SEO elements (title, meta, headings, images, links, schema, OG tags) | `python3 scripts/parse_html.py page.html --json` |

**References:**

- `references/schema-types.md` — Full list of active, restricted, and deprecated schema types
- `schema/templates.json` — Ready-to-use JSON-LD templates for all supported types

Find the plugin's location and read these files when needed during the workflow.

---

## Phase 1: Gather Input

Ask the user:

1. **Mode** -- What do you need?
   - **Detect & Validate** -- I have a page with existing schema; check what's there and if it's correct
   - **Generate** -- I need new JSON-LD markup for a page
   - **Both** -- Detect what's there, fix issues, and fill gaps with new markup

2. **Target URL or content** -- Provide the page URL or paste the HTML source.

3. **Specific focus** (optional) -- Any particular schema types you're interested in? (e.g., Product, Article, LocalBusiness)

Confirm scope with the user before proceeding:

"I'll [detect/validate/generate] schema markup for [URL]. Ready to proceed?"
- Yes, go ahead
- Adjust scope

---

## Phase 2: Detection & Validation

### Step 1: Fetch & Parse
```bash
python3 scripts/fetch_page.py <url> --output page.html
python3 scripts/parse_html.py page.html --json > seo-data.json
```
This gives structured data for all SEO elements. Use this data for the detection and validation below.

Scan the page source for all existing structured data:

### Detection

1. Scan for JSON-LD `<script type="application/ld+json">` blocks
2. Check for Microdata (`itemscope`, `itemprop`)
3. Check for RDFa (`typeof`, `property`)
4. Always recommend JSON-LD as primary format (Google's stated preference)

### Validation

For each schema block found, validate:

- Check required properties per schema type
- Validate against Google's supported rich result types
- Test for common errors:
  - Missing `@context`
  - Invalid `@type`
  - Wrong data types
  - Placeholder text
  - Relative URLs (should be absolute)
  - Invalid date formats
- Flag deprecated types (see Schema Type Status below)

### Schema Type Status (as of Feb 2026)

Read `references/schema-types.md` for the full list. Key rules:

#### ACTIVE -- recommend freely:
Organization, LocalBusiness, SoftwareApplication, WebApplication, Product (with Certification markup as of April 2025), ProductGroup, Offer, Service, Article, BlogPosting, NewsArticle, Review, AggregateRating, BreadcrumbList, WebSite, WebPage, Person, ProfilePage, ContactPage, VideoObject, ImageObject, Event, JobPosting, Course, DiscussionForumPosting

#### VIDEO & SPECIALIZED -- recommend freely:
BroadcastEvent, Clip, SeekToAction, SoftwareSourceCode

See `schema/templates.json` for ready-to-use JSON-LD templates for these types.

> **JSON-LD and JavaScript rendering:** Per Google's December 2025 JS SEO guidance, structured data injected via JavaScript may face delayed processing. For time-sensitive markup (especially Product, Offer), include JSON-LD in the initial server-rendered HTML.

#### RESTRICTED -- only for specific sites:
- **FAQ**: ONLY for government and healthcare authority sites (restricted Aug 2023)

#### DEPRECATED -- never recommend:
- **HowTo**: Rich results removed September 2023
- **SpecialAnnouncement**: Deprecated July 31, 2025
- **CourseInfo, EstimatedSalary, LearningVideo**: Retired June 2025
- **ClaimReview**: Retired from rich results June 2025
- **VehicleListing**: Retired from rich results June 2025
- **Practice Problem**: Retired from rich results late 2025
- **Dataset**: Retired from rich results late 2025
- **Book Actions**: Deprecated then reversed -- still functional as of Feb 2026 (historical note)

---

## Phase 3: Present Validation Results

Present the validation results in a structured table:

### Schema Found

| # | Schema Type | Format | Status | Issues |
|---|-------------|--------|--------|--------|
| 1 | ... | JSON-LD / Microdata / RDFa | valid / warning / error | ... |

### Missing Opportunities

List schema types that would be appropriate for the page but are not present. Explain why each is relevant based on the page content.

### Deprecated or Restricted Markup

Flag any schema types that are deprecated or restricted per the status list above. Provide the recommended action (remove, replace, or keep with caveats).

**Wait for user to review before proceeding.**

"Here are the validation results. What would you like to do?"
- Generate fixes for the issues found
- Generate new schema for the missing opportunities
- Both -- fix issues and fill gaps
- Export the report as-is

---

## Phase 4: Generation & Recommendations

### Generating Schema

When generating schema for a page:

1. Identify page type from content analysis
2. Select appropriate schema type(s) -- check `references/schema-types.md` to confirm the type is ACTIVE
3. Reference `schema/templates.json` for specialized types and ready-to-use structures
4. Generate valid JSON-LD with all required + recommended properties
5. Include only truthful, verifiable data -- use placeholders clearly marked `[PLACEHOLDER]` for user to fill
6. Validate output before presenting

### Common Schema Templates

#### Organization
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "[Company Name]",
  "url": "[Website URL]",
  "logo": "[Logo URL]",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "[Phone]",
    "contactType": "customer service"
  },
  "sameAs": [
    "[Facebook URL]",
    "[LinkedIn URL]",
    "[Twitter URL]"
  ]
}
```

#### LocalBusiness
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "[Business Name]",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[Street]",
    "addressLocality": "[City]",
    "addressRegion": "[State]",
    "postalCode": "[ZIP]",
    "addressCountry": "US"
  },
  "telephone": "[Phone]",
  "openingHours": "Mo-Fr 09:00-17:00",
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "[Lat]",
    "longitude": "[Long]"
  }
}
```

#### Article/BlogPosting
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[Title]",
  "author": {
    "@type": "Person",
    "name": "[Author Name]"
  },
  "datePublished": "[YYYY-MM-DD]",
  "dateModified": "[YYYY-MM-DD]",
  "image": "[Image URL]",
  "publisher": {
    "@type": "Organization",
    "name": "[Publisher]",
    "logo": {
      "@type": "ImageObject",
      "url": "[Logo URL]"
    }
  }
}
```

### Present Generated Code

For each schema type generated, present:

1. The complete JSON-LD snippet ready to paste into `<head>`
2. Where to place it in the HTML
3. A note on any `[PLACEHOLDER]` values that need filling

### Recommendations Summary

- Validation fixes needed (with corrected code)
- Missing schema opportunities (with generated code)
- Implementation priority (which schema types have the highest rich result potential)

### Output Files

- `SCHEMA-REPORT.md` -- Detection and validation results
- `generated-schema.json` -- Ready-to-use JSON-LD snippets
