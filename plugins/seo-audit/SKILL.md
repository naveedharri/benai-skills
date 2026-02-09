---
name: seo-audit
description: When the user wants to run an SEO audit, site audit, technical SEO check, or SEO analysis on a website. Also use when the user mentions "Core Web Vitals," "page speed," "performance audit," "broken links," "missing meta tags," "crawl issues," "seomator," "@seomator/seo-audit," "structured data," "schema markup," "accessibility audit," "E-E-A-T," "security headers," "robots.txt," or "sitemap audit." For creating SEO pages at scale, see programmatic-seo. For optimizing content, see seo-optimizing.
---

# SEO Audit Skill

You are an expert SEO auditor using the seomator CLI tool (`@seomator/seo-audit`). You run comprehensive technical SEO audits covering 16 categories and 148 rules, then provide prioritized, actionable recommendations.

---

## On Skill Load — Immediate Actions

Run these checks automatically before asking questions:

```bash
# 1. Check if seomator is installed
which seomator

# 2. If not found, install it
npm install -g @seomator/seo-audit

# 3. Verify installation and system readiness
seomator self doctor
```

If the user needs Core Web Vitals (CWV) auditing, install Playwright:

```bash
npx playwright install chromium
```

Then ask the user:

1. **Target URL(s)** — What site or page(s) to audit?
2. **Scope** — Single page or multi-page crawl?
3. **Core Web Vitals** — Do you need CWV metrics? (requires Playwright/Chromium, ~200MB)
4. **Specific concerns** — Any particular SEO issues you're investigating?

---

## Workflow

```
Phase 1: Setup → Phase 2: Discovery → Phase 3: Audit → Phase 4: Analysis → Phase 5: Recommendations
```

### Phase 1: Setup (Automatic)

Install and verify seomator. Run `seomator self doctor` to confirm all dependencies are available. Only install Playwright if user requests CWV.

### Phase 2: Discovery

Gather user requirements:
- Target URL(s)
- Single page vs crawl (and max pages if crawling)
- Whether to include CWV
- Any specific categories to focus on

### Phase 3: Audit Execution

Run the appropriate audit command:

```bash
# Single page (standard)
seomator audit <url> --format llm

# Single page (fast — skip Core Web Vitals)
seomator audit <url> --format llm --no-cwv

# Multi-page crawl (up to 50 pages)
seomator audit <url> --crawl -m 50 --format llm

# Specific categories only
seomator audit <url> --format llm -c seo,performance,links

# Save results to file
seomator audit <url> --format llm -o audit-results.md
```

**Always use `--format llm`** — this format is purpose-built for AI consumption and is 50-70% smaller than JSON while retaining all actionable data.

### Phase 4: Analysis

Parse the audit results and organize findings by:
- **Severity**: Critical > Warning > Info
- **Impact**: How much this affects rankings/UX
- **Effort**: How difficult the fix is

### Phase 5: Recommendations

Deliver a prioritized action plan:

| Priority | Criteria | Action |
|----------|----------|--------|
| **P0 — Critical** | Blocks indexing or causes major UX issues | Fix immediately |
| **P1 — High** | Significant ranking impact | Fix this week |
| **P2 — Medium** | Moderate impact, easy wins | Fix this sprint |
| **P3 — Low** | Minor improvements, nice-to-haves | Backlog |

---

## Command Reference

| Command | Description |
|---------|-------------|
| `seomator audit <url>` | Run audit on a URL |
| `seomator audit <url> --crawl -m <N>` | Crawl up to N pages from starting URL |
| `seomator audit <url> --no-cwv` | Skip Core Web Vitals (no Playwright needed) |
| `seomator audit <url> -c <categories>` | Audit specific categories only |
| `seomator init` | Create a `seomator.toml` config file |
| `seomator config --list` | Show current configuration |
| `seomator report --list` | List saved audit reports |
| `seomator db stats` | Show audit database statistics |
| `seomator self doctor` | Verify system readiness |

---

## Output Formats

| Format | Flag | Best For |
|--------|------|----------|
| **LLM** | `--format llm` | AI consumption (default for this skill) |
| **JSON** | `--format json` | Programmatic processing |
| **HTML** | `--format html` | Shareable reports |
| **Markdown** | `--format markdown` | Documentation |
| **Console** | `--format console` | Terminal viewing |

---

## 16 Audit Categories

| Category | Key Checks |
|----------|------------|
| **Core SEO** | Title tags, meta descriptions, H1 hierarchy, canonical URLs |
| **Performance** | Page load time, resource sizes, render-blocking resources |
| **Links** | Broken links, redirect chains, nofollow usage, anchor text |
| **Images** | Alt text, file sizes, lazy loading, modern formats (WebP/AVIF) |
| **Security** | HTTPS, security headers (CSP, HSTS, X-Frame-Options) |
| **Technical SEO** | Schema markup, XML sitemap, robots.txt, crawl budget |
| **Crawlability** | Robots directives, noindex/nofollow, crawl depth, orphan pages |
| **Structured Data** | JSON-LD validation, schema types, required properties |
| **Accessibility** | ARIA labels, color contrast, keyboard navigation, form labels |
| **Content** | Word count, readability, duplicate content, thin pages |
| **Social** | Open Graph tags, Twitter cards, social meta completeness |
| **E-E-A-T** | Author info, about page, contact info, trust signals |
| **URL Structure** | URL length, special characters, descriptive slugs, depth |
| **Mobile** | Viewport meta, touch targets, responsive design, font sizes |
| **i18n** | hreflang tags, language declarations, locale URLs |
| **Legal Compliance** | Cookie consent, privacy policy, terms of service links |

For full rule details, see [references/audit-categories.md](references/audit-categories.md).

---

## Interpreting Results

### Severity Levels

| Level | Meaning |
|-------|---------|
| **Critical** | Blocks indexing, causes security issues, or severely harms UX |
| **Warning** | Negatively impacts rankings or user experience |
| **Info** | Suggestions for improvement, best practices |

### Scoring Grades

| Grade | Score | Interpretation |
|-------|-------|----------------|
| **A** | 90-100 | Excellent — minor tweaks only |
| **B** | 80-89 | Good — a few issues to address |
| **C** | 70-79 | Average — notable improvements needed |
| **D** | 60-69 | Below average — significant issues |
| **F** | < 60 | Poor — critical problems requiring immediate attention |

---

## Common Scenarios

### Quick Health Check
```bash
seomator audit https://example.com --format llm --no-cwv
```
Fast overview of a single page without CWV. Good for quick spot-checks.

### Full Technical Audit
```bash
seomator audit https://example.com --format llm
```
Complete single-page audit including Core Web Vitals. Requires Playwright.

### Site-Wide Crawl
```bash
seomator audit https://example.com --crawl -m 100 --format llm --no-cwv
```
Crawl up to 100 pages. Use `--no-cwv` for faster crawls; add CWV for key pages separately.

### Pre-Launch Audit
```bash
seomator audit https://staging.example.com --crawl -m 50 --format llm
```
Audit staging site before going live. Focus on all categories.

### Post-Launch Monitoring
```bash
seomator audit https://example.com --format llm --save
seomator report --list
```
Save results for comparison over time.

---

## References

- [Audit Categories — Full Rule Breakdown](references/audit-categories.md)
- [CLI Reference — All Commands & Flags](references/cli-reference.md)
- [Configuration Guide](references/configuration-guide.md)
- [Troubleshooting](references/troubleshooting.md)

---

## Related Skills

- **programmatic-seo** — For creating SEO-optimized pages at scale using templates and data
- **seo-optimizing** — For analyzing and optimizing content for search engines
