# SEO Reference — Website Launch Kit

Every website built with this skill must ship SEO-ready. This reference covers everything needed to make that happen automatically during the build.

---

## 1. Meta Tags

### Title Tag

Generate from the business name + core offer (Phase 1 Q1-Q3).

**Rules:**
- 50-60 characters max (truncates after ~60 in Google)
- Include primary keyword near the front
- Format: `[Primary Keyword]: [Benefit] | [Brand Name]`
- No keyword stuffing — one natural mention

**Example:**
```html
<title>AI Automation Agency for Small Business | BrightFlow</title>
```

### Meta Description

Generate from the value proposition (Phase 1 Q2 + Phase 3 hero copy).

**Rules:**
- 150-160 characters
- Include primary keyword naturally
- Include a call-to-action
- Describe what the visitor gets

**Example:**
```html
<meta name="description" content="BrightFlow helps small businesses automate repetitive tasks with AI. Book a free consultation and save 20 hours per week. No technical skills needed.">
```

### Canonical URL

Always set to prevent duplicate content issues.

```html
<link rel="canonical" href="https://yourdomain.com/" />
```

---

## 2. Open Graph Tags (Social Sharing)

When someone shares the site on LinkedIn, Facebook, or Slack, these tags control what appears.

**Required OG tags:**
```html
<meta property="og:type" content="website" />
<meta property="og:url" content="https://yourdomain.com/" />
<meta property="og:title" content="[Same as title tag or slightly longer]" />
<meta property="og:description" content="[Same as meta description or tailored for social]" />
<meta property="og:image" content="https://yourdomain.com/og-image.png" />
<meta property="og:site_name" content="[Brand Name]" />
```

**OG Image rules:**
- Minimum 1200x630px
- Use the hero section screenshot or a branded banner
- Generate with the image generation tool if no brand image exists
- Must be an absolute URL (not relative path)

---

## 3. Twitter Card Tags

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="[Same as og:title]" />
<meta name="twitter:description" content="[Same as og:description]" />
<meta name="twitter:image" content="https://yourdomain.com/og-image.png" />
```

---

## 4. Next.js Metadata Implementation

Use the Next.js Metadata API in `app/layout.tsx`. Do NOT use `<head>` tags manually.

### Phase 2 (Placeholder — during clone)

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Site Title',
  description: 'Site description',
  openGraph: {
    type: 'website',
    url: 'https://example.com',
    title: 'Site Title',
    description: 'Site description',
    siteName: 'Brand Name',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Site Title',
    description: 'Site description',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}
```

### Phase 4 (Real values — during customization)

Replace all placeholder values with real business info from Phase 1 + Phase 3:
- `title` → Business name + primary keyword + benefit
- `description` → Value proposition with CTA
- `openGraph` → Real brand name, URL, generated OG image
- `twitter` → Same content, `summary_large_image` card

---

## 5. Schema Markup (JSON-LD)

Schema helps Google understand what the page is about and can enable rich results.

### When to Generate Which Schema

| Page Has | Schema Type | Priority |
|----------|------------|----------|
| Always (landing page) | `Organization` + `WebSite` | Required |
| Navigation/sections | `BreadcrumbList` | Required |
| FAQ section | `FAQPage` | Required if FAQ exists |
| Testimonials | `Review` + `AggregateRating` | Optional |
| Service descriptions | `Service` | Optional |
| Product info | `Product` | Optional |

### Organization Schema (always generate)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "[Business Name from Phase 1 Q1]",
  "url": "[Production URL]",
  "logo": "[Logo URL if provided]",
  "description": "[One-line description from Phase 1 Q2]",
  "sameAs": [
    "[LinkedIn URL if provided]",
    "[Twitter URL if provided]"
  ]
}
```

### WebSite Schema (always generate)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "[Business Name]",
  "url": "[Production URL]"
}
```

### FAQPage Schema (if FAQ section exists)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Question text from FAQ section]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Answer text from FAQ section]"
      }
    }
  ]
}
```

### Implementation in Next.js

Add JSON-LD in `app/page.tsx` or a dedicated component:

```tsx
export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Business Name',
    // ... rest of schema
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Page content */}
    </>
  )
}
```

For multiple schema types, combine them in an array:

```tsx
const jsonLd = [
  { '@context': 'https://schema.org', '@type': 'Organization', /* ... */ },
  { '@context': 'https://schema.org', '@type': 'WebSite', /* ... */ },
  { '@context': 'https://schema.org', '@type': 'FAQPage', /* ... */ },
]
```

---

## 6. Technical SEO Files

### robots.txt

Generate in `public/robots.txt` during Phase 2:

```
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
```

Update the sitemap URL in Phase 4 when the production domain is known. If no custom domain yet, use the Vercel URL.

### sitemap.xml

Use Next.js built-in sitemap generation. Create `app/sitemap.ts`:

```typescript
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://yourdomain.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
```

For multi-page sites, add entries for each page.

---

## 7. Semantic HTML Rules

Enforce these during both Phase 2 (clone) and Phase 4 (customize):

| Rule | What | Why |
|------|------|-----|
| One `<h1>` per page | The hero headline is the H1 | Google uses H1 as a strong relevance signal |
| Heading hierarchy | H1 → H2 → H3, never skip levels | Helps crawlers understand content structure |
| `alt` on every `<img>` | Descriptive text for all images | Accessibility + image search ranking |
| Semantic elements | Use `<nav>`, `<main>`, `<section>`, `<footer>` | Better crawlability and accessibility |
| Link text | No "click here" — use descriptive anchor text | Helps search engines understand link context |

### Image Alt Text Guidelines

When writing alt text during Phase 4:
- Describe what the image shows, not what it is ("Team collaborating on a whiteboard" not "stock photo")
- Include the business context when relevant ("BrightFlow dashboard showing automated workflows")
- Keep under 125 characters
- Don't start with "Image of" or "Photo of"

---

## 8. Final SEO Checklist

Run this before the final deploy in Phase 4:

### Meta & Social
- [ ] Title tag is 50-60 characters with primary keyword
- [ ] Meta description is 150-160 characters with CTA
- [ ] OG tags are set (title, description, image, url, type)
- [ ] Twitter Card tags are set
- [ ] Canonical URL is set
- [ ] OG image exists and is 1200x630px minimum

### Schema
- [ ] Organization JSON-LD is present
- [ ] WebSite JSON-LD is present
- [ ] FAQPage JSON-LD is present (if FAQ section exists)
- [ ] JSON-LD validates (no syntax errors)

### Technical
- [ ] `robots.txt` exists in `public/`
- [ ] `sitemap.ts` is configured
- [ ] Only one `<h1>` on the page
- [ ] Heading hierarchy is correct (no skipped levels)
- [ ] Every `<img>` has an `alt` attribute
- [ ] Semantic HTML elements used (`<nav>`, `<main>`, `<section>`, `<footer>`)

### Content
- [ ] Primary keyword appears in H1
- [ ] Primary keyword appears in first 100 words of body text
- [ ] All images have descriptive alt text (not placeholder)
- [ ] URL slug is clean and keyword-relevant
