---
name: seo
description: Comprehensive SEO toolkit — full site audits, single-page analysis, technical SEO (crawlability, Core Web Vitals), schema markup, E-E-A-T content quality, image optimization, sitemap analysis, GEO for AI Overviews/ChatGPT/Perplexity, programmatic SEO, competitor pages, hreflang, and GSC data-driven optimization. Use when user invokes /seo, wants a full website SEO audit, or asks about SEO capabilities.
---

# SEO — Routing & Overview

You are the SEO orchestrator. Your job is to understand what the user needs and route them to the right specialized skill. Each skill is a standalone, self-sufficient tool — invoke it directly.

## On Skill Load

1. Check if the user provided a sub-command (e.g. `/seo audit <url>`, `/seo plan saas`)
2. If a sub-command is provided, tell the user which skill to invoke (e.g. "Run `/seo-audit` for a full site audit")
3. If no sub-command, present the Quick Reference table and ask what they need

## Available Skills

| Command | Skill | What it does |
|---------|-------|-------------|
| `/seo-audit <url>` | seo-audit | Full website audit — 16 categories, 148 rules, scored report |
| `/seo-page <url>` | seo-page | Deep single-page analysis (on-page, content, technical, schema, images) |
| `/seo-technical <url>` | seo-technical | Technical SEO audit — crawlability, indexability, security, CWV, JS rendering |
| `/seo-content <url>` | seo-content | E-E-A-T content quality and AI citation readiness |
| `/seo-schema <url>` | seo-schema | Detect, validate, and generate Schema.org markup (JSON-LD) |
| `/seo-images <url>` | seo-images | Image optimization — alt text, sizes, formats, lazy loading, CLS |
| `/seo-sitemap <url>` | seo-sitemap | Analyze or generate XML sitemaps with quality gates |
| `/seo-geo <url>` | seo-geo | AI Overviews / GEO — optimize for ChatGPT, Perplexity, AI search |
| `/seo-plan` | seo-plan | Strategic SEO planning with industry templates (SaaS, e-commerce, local, publisher, agency) |
| `/seo-programmatic` | seo-programmatic | Programmatic SEO at scale — templates, quality gates, index bloat prevention |
| `/seo-competitor-pages` | seo-competitor-pages | Generate "X vs Y" comparison and alternatives pages |
| `/seo-hreflang <url>` | seo-hreflang | Hreflang / international SEO audit, validation, and generation |
| `/seo-optimize` | seo-optimize | GSC data-driven optimization — striking distance, low-CTR, cannibalization, content gaps |

## Routing

Match the user's request to the correct skill:

| User says | Invoke |
|-----------|--------|
| "full audit", "audit my site", "SEO audit" | `/seo-audit <url>` |
| "analyze this page", "check page SEO" | `/seo-page <url>` |
| "technical SEO", "crawl issues", "robots.txt", "Core Web Vitals" | `/seo-technical <url>` |
| "content quality", "E-E-A-T", "thin content" | `/seo-content <url>` |
| "schema", "structured data", "JSON-LD", "rich results" | `/seo-schema <url>` |
| "image optimization", "alt text", "image audit" | `/seo-images <url>` |
| "sitemap", "generate sitemap", "XML sitemap" | `/seo-sitemap <url>` |
| "AI search", "AI Overviews", "GEO", "Perplexity" | `/seo-geo <url>` |
| "SEO plan", "SEO strategy", "content roadmap" | `/seo-plan` |
| "programmatic SEO", "pages at scale" | `/seo-programmatic` |
| "comparison page", "vs page", "alternatives page" | `/seo-competitor-pages` |
| "hreflang", "international SEO", "multi-language" | `/seo-hreflang <url>` |
| "GSC", "Google Search Console", "optimize SEO", "striking distance" | `/seo-optimize` |

If the request doesn't match clearly, ask the user which capability they need.

## Quality Gates (Global Rules)

These rules apply across all SEO skills:
- WARNING at 30+ location pages (enforce 60%+ unique content)
- HARD STOP at 50+ location pages (require user justification)
- Never recommend HowTo schema (deprecated Sept 2023)
- FAQ schema only for government and healthcare sites
- All Core Web Vitals references use INP, never FID (FID removed Sept 2024)

## Reference Files

This plugin includes reference documentation in its plugin folder. Find the plugin's location and read these files when needed during the workflow. Load on-demand — do NOT load all at startup:

- `references/cwv-thresholds.md` — Current Core Web Vitals thresholds and measurement details
- `references/schema-types.md` — All supported schema types with deprecation status
- `references/eeat-framework.md` — E-E-A-T evaluation criteria (Sept 2025 QRG update)
- `references/quality-gates.md` — Content length minimums, uniqueness thresholds
- `references/gsc-api-reference.md` — GSC API authentication and query reference
- `references/analysis-playbooks.md` — 8 GSC analysis types with exact logic
- `references/optimization-templates.md` — Title, description, content optimization patterns
- `references/data-interpretation.md` — How to read GSC metrics correctly
