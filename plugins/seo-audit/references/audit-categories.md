# Audit Categories — Full Rule Breakdown

Complete breakdown of all 16 audit categories and their individual rules.

---

## 1. Core SEO

Fundamental on-page SEO elements that directly affect search rankings.

| Rule | What It Checks | Pass Criteria |
|------|---------------|---------------|
| Title tag exists | Page has a `<title>` element | Title tag present |
| Title length | Character count of title | 30-60 characters |
| Title uniqueness | No duplicate titles across pages | Unique per page |
| Meta description exists | Page has a meta description | Meta description present |
| Meta description length | Character count | 120-160 characters |
| Meta description uniqueness | No duplicates across pages | Unique per page |
| H1 exists | Page has an H1 heading | Exactly one H1 |
| H1 uniqueness | Only one H1 per page | Single H1 |
| Heading hierarchy | H1 > H2 > H3 logical order | No skipped levels |
| Canonical URL | Page specifies canonical URL | Valid canonical present |
| Canonical self-reference | Canonical points to self or correct page | Correct reference |
| Meta robots | No conflicting directives | No index conflicts |
| Language declaration | `lang` attribute on `<html>` | Valid language code |
| Viewport meta tag | Responsive viewport configured | `width=device-width` present |
| Character encoding | UTF-8 declared | `<meta charset="utf-8">` |

---

## 2. Performance

Page speed and resource optimization affecting user experience and rankings.

| Rule | What It Checks | Pass Criteria |
|------|---------------|---------------|
| Page load time | Total load time | < 3 seconds |
| First Contentful Paint (FCP) | Time to first visible content | < 1.8 seconds |
| Largest Contentful Paint (LCP) | Time to largest visible element | < 2.5 seconds |
| Cumulative Layout Shift (CLS) | Visual stability | < 0.1 |
| Total Blocking Time (TBT) | Main thread blocking | < 200ms |
| HTML size | Page HTML file size | < 100KB |
| Total page weight | Combined resource size | < 3MB |
| Render-blocking resources | CSS/JS blocking first paint | Minimal blocking |
| Text compression | Gzip/Brotli enabled | Compression active |
| Browser caching | Cache headers set | Appropriate cache-control |

---

## 3. Links

Internal and external link health and optimization.

| Rule | What It Checks | Pass Criteria |
|------|---------------|---------------|
| Broken internal links | Links returning 4xx/5xx | No broken links |
| Broken external links | External links returning errors | No broken links |
| Redirect chains | Multiple sequential redirects | Max 1 redirect |
| Redirect loops | Circular redirect patterns | No loops |
| HTTP to HTTPS redirects | Mixed protocol links | All links use HTTPS |
| Nofollow usage | Appropriate nofollow on external links | Intentional usage |
| Anchor text quality | Descriptive vs generic anchors | Descriptive text |
| Internal link depth | Clicks from homepage | Max 3 clicks |
| Orphan pages | Pages with no internal links pointing to them | No orphan pages |
| Excessive links | Too many links on one page | < 100 links per page |

---

## 4. Images

Image optimization for performance and accessibility.

| Rule | What It Checks | Pass Criteria |
|------|---------------|---------------|
| Alt text present | All images have alt attributes | Alt on all `<img>` |
| Alt text quality | Descriptive vs empty/generic | Descriptive alt text |
| Image file size | Individual image sizes | < 200KB per image |
| Modern formats | WebP/AVIF usage | Modern format available |
| Lazy loading | Images below fold use lazy loading | `loading="lazy"` |
| Responsive images | `srcset` or `<picture>` usage | Responsive markup |
| Image dimensions | Width/height attributes set | Dimensions specified |
| Decorative images | Decorative images have empty alt | `alt=""` for decorative |
| SVG accessibility | SVGs have title/desc | Accessible SVGs |

---

## 5. Security

Security headers and HTTPS configuration.

| Rule | What It Checks | Pass Criteria |
|------|---------------|---------------|
| HTTPS enabled | Site uses HTTPS | Valid SSL certificate |
| HSTS header | Strict-Transport-Security set | HSTS present |
| Content-Security-Policy | CSP header configured | CSP present |
| X-Frame-Options | Clickjacking protection | Header set |
| X-Content-Type-Options | MIME type sniffing prevention | `nosniff` set |
| Referrer-Policy | Referrer information control | Policy set |
| Permissions-Policy | Browser feature restrictions | Policy configured |
| Mixed content | HTTP resources on HTTPS pages | No mixed content |

---

## 6. Technical SEO

Technical implementation details affecting search engine understanding.

| Rule | What It Checks | Pass Criteria |
|------|---------------|---------------|
| XML sitemap exists | Sitemap at `/sitemap.xml` | Valid sitemap present |
| Sitemap in robots.txt | Sitemap referenced in robots.txt | Reference present |
| Robots.txt exists | File at `/robots.txt` | Valid robots.txt |
| Robots.txt valid | No syntax errors | Valid syntax |
| Schema markup present | JSON-LD or microdata | Structured data found |
| Favicon exists | Site has a favicon | Favicon accessible |
| 404 page | Custom 404 page exists | Custom 404 |
| WWW redirect | WWW and non-WWW redirect correctly | Single canonical version |
| Trailing slash consistency | Consistent URL patterns | No duplicates |

---

## 7. Crawlability

How well search engine bots can discover and crawl content.

| Rule | What It Checks | Pass Criteria |
|------|---------------|---------------|
| Robots meta tag | No unintended noindex | Indexable pages |
| X-Robots-Tag header | No blocking headers | No unintended blocks |
| Crawl depth | Page depth from root | Max 3 levels |
| Internal linking | Pages reachable via links | All pages linked |
| JavaScript rendering | Content available without JS | Content in HTML |
| Pagination | rel=next/prev or load-more | Proper pagination |
| URL parameters | Parameter handling | Clean URLs |
| Crawl budget | Efficient use of crawl resources | No wasted crawls |

---

## 8. Structured Data

Schema.org markup validation and completeness.

| Rule | What It Checks | Pass Criteria |
|------|---------------|---------------|
| JSON-LD format | Structured data uses JSON-LD | JSON-LD preferred |
| Schema type valid | Uses recognized schema.org types | Valid type |
| Required properties | All required fields present | No missing required |
| Recommended properties | Optional but beneficial fields | Key fields present |
| No errors | Validates against schema.org spec | Zero errors |
| No warnings | Best practice compliance | Minimal warnings |
| Breadcrumb markup | BreadcrumbList schema | Present on inner pages |
| Organization markup | Organization or LocalBusiness | Present on homepage |

---

## 9. Accessibility

Web accessibility standards (WCAG alignment).

| Rule | What It Checks | Pass Criteria |
|------|---------------|---------------|
| ARIA landmarks | Main, nav, header, footer roles | Landmarks present |
| ARIA labels | Interactive elements labeled | Labels on controls |
| Color contrast | Text/background contrast ratio | WCAG AA (4.5:1) |
| Keyboard navigation | All interactive elements focusable | Tab-navigable |
| Form labels | Form inputs have associated labels | All inputs labeled |
| Skip navigation | Skip-to-content link | Skip link present |
| Focus indicators | Visible focus styles | Focus visible |
| Link purpose | Links distinguishable from text | Clear link styling |
| Table headers | Data tables have headers | `<th>` elements used |

---

## 10. Content

Content quality and SEO best practices.

| Rule | What It Checks | Pass Criteria |
|------|---------------|---------------|
| Word count | Minimum content length | > 300 words |
| Readability | Flesch reading ease or similar | Appropriate for audience |
| Duplicate content | Content similarity across pages | Unique content |
| Thin content | Pages with insufficient content | Meaningful content |
| Keyword in title | Target keyword in title tag | Keyword present |
| Keyword in H1 | Target keyword in H1 | Keyword present |
| Keyword in content | Target keyword in body text | Natural usage |
| Content freshness | Last modified date | Recent updates |

---

## 11. Social

Social media meta tags for sharing optimization.

| Rule | What It Checks | Pass Criteria |
|------|---------------|---------------|
| Open Graph title | `og:title` meta tag | Present |
| Open Graph description | `og:description` meta tag | Present |
| Open Graph image | `og:image` meta tag | Valid image URL |
| Open Graph type | `og:type` meta tag | Valid type |
| Open Graph URL | `og:url` meta tag | Canonical URL |
| Twitter card type | `twitter:card` meta tag | Present |
| Twitter title | `twitter:title` meta tag | Present |
| Twitter description | `twitter:description` meta tag | Present |
| Twitter image | `twitter:image` meta tag | Valid image URL |

---

## 12. E-E-A-T

Experience, Expertise, Authoritativeness, Trustworthiness signals.

| Rule | What It Checks | Pass Criteria |
|------|---------------|---------------|
| Author information | Author name/bio visible | Author identified |
| About page | `/about` page exists | About page present |
| Contact information | Contact details accessible | Contact info found |
| Privacy policy | Privacy policy page linked | Policy present |
| Terms of service | Terms page linked | Terms present |
| Trust signals | Testimonials, reviews, certifications | Trust elements found |
| External references | Citations and sources | Sources cited |
| Professional credentials | Author qualifications shown | Credentials visible |

---

## 13. URL Structure

URL formatting and SEO best practices.

| Rule | What It Checks | Pass Criteria |
|------|---------------|---------------|
| URL length | Total URL character count | < 75 characters |
| Special characters | No spaces or encoded characters | Clean URLs |
| Descriptive slugs | URLs contain meaningful words | Descriptive path |
| Lowercase URLs | No uppercase letters in path | All lowercase |
| URL depth | Number of path segments | Max 3-4 levels |
| File extensions | No unnecessary extensions in URLs | Clean paths |
| Hyphens vs underscores | Word separators in URLs | Hyphens used |
| Dynamic parameters | Minimal query parameters | Clean URLs |

---

## 14. Mobile

Mobile-friendliness and responsive design checks.

| Rule | What It Checks | Pass Criteria |
|------|---------------|---------------|
| Viewport meta tag | Responsive viewport configured | Properly configured |
| Touch target size | Clickable element sizes | Min 48x48px |
| Font size readability | Text size on mobile | Min 16px base |
| Content width | Horizontal scrolling | No horizontal scroll |
| Mobile-friendly links | Link spacing for touch | Adequate spacing |
| Media queries | Responsive CSS breakpoints | Breakpoints present |

---

## 15. i18n (Internationalization)

Multi-language and regional targeting.

| Rule | What It Checks | Pass Criteria |
|------|---------------|---------------|
| hreflang tags | Language/region alternates | Correct hreflang |
| hreflang x-default | Default language specified | x-default present |
| hreflang reciprocal | Bi-directional references | All pages reciprocate |
| Language declaration | `lang` attribute on HTML | Valid lang code |
| Content-Language header | HTTP header for language | Header set |
| Locale URLs | URL structure for locales | Consistent pattern |

---

## 16. Legal Compliance

Legal and regulatory compliance signals.

| Rule | What It Checks | Pass Criteria |
|------|---------------|---------------|
| Cookie consent | Cookie banner/consent mechanism | Consent present |
| Privacy policy link | Footer link to privacy policy | Link accessible |
| Terms of service link | Footer link to terms | Link accessible |
| GDPR compliance | Data handling disclosures | Disclosures present |
| Accessibility statement | Accessibility commitment page | Statement available |
| Copyright notice | Current copyright year | Notice present |
