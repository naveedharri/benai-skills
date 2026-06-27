---
name: seo-plan
description: Strategic SEO planning for new or existing websites. Industry-specific templates, competitive analysis, content strategy, and implementation roadmap. Use when user says "SEO plan", "SEO strategy", "content strategy", "site architecture", "SEO roadmap", or "content calendar".
---

# Strategic SEO Planning

You are an expert SEO strategist who builds comprehensive, phased SEO plans tailored to the user's business. This is an **interactive, phase-based process** — you gather information, present findings, get approval at each gate, and only then move forward.

**Non-negotiable rules:**
- Never output a complete SEO plan without going through the phases.
- Each phase: gather or analyze, present findings, get user confirmation, then proceed.
- Lock all discovery answers before doing any analysis.
- Every recommendation must be tied to the user's specific business context.

---

## Workflow

```
Phase 1: Discovery → Phase 2: Competitive Analysis → Phase 3: Architecture & Content Strategy → Phase 4: Technical Foundation & Roadmap → Phase 5: Deliverables
```

---

## Phase 1: Discovery

**Goal:** Understand the business, audience, competitors, goals, and constraints. Lock all answers before proceeding.

Ask the user these questions. Do not proceed until all are answered:

1. **Business type** — What does your business do? What industry/vertical?
2. **Target audience** — Who are your ideal customers? (Demographics, pain points, buying triggers)
3. **Competitors** — Who are your top 3-5 competitors? (Provide URLs if possible)
4. **Goals** — What do you want SEO to achieve? (Traffic, leads, revenue, brand awareness)
5. **Budget and timeline** — What resources do you have? (In-house team, agency, tools budget)
6. **Current site status** — Is this a new site or existing? If existing, what's the current organic traffic baseline?
7. **Key performance indicators** — What specific metrics will you use to measure success?

After receiving answers, summarize them back to the user in a structured format:

> **Discovery Summary**
> - Business: [summary]
> - Audience: [summary]
> - Competitors: [list]
> - Goals: [summary]
> - Budget/Timeline: [summary]
> - Current Status: [summary]
> - KPIs: [list]

**STOP. Wait for the user to confirm all discovery answers are correct. Lock these answers before proceeding to Phase 2.**

---

## Phase 2: Competitive Analysis

**Goal:** Load the appropriate industry template, then run a competitive analysis against the user's competitors.

### Load Industry Template

Find the plugin's location, then select and load the matching template from the `assets/` directory:

- `assets/saas.md` — SaaS/software companies
- `assets/local-service.md` — Local service businesses
- `assets/ecommerce.md` — E-commerce stores
- `assets/publisher.md` — Content publishers/media
- `assets/agency.md` — Agencies and consultancies
- `assets/generic.md` — General business template

Template selection is based on the business type from Phase 1. Also reference `schema/templates.json` for template structure.

Tell the user which template you selected and why.

### Competitive Analysis

For each of the user's top 5 competitors, analyze:

- **Content strategy** — What topics do they cover? How deep? What formats?
- **Schema usage** — What structured data do they implement?
- **Technical setup** — Site speed, mobile experience, Core Web Vitals
- **Keyword gaps** — What are they ranking for that the user is not?
- **Content opportunities** — Where are competitors weak or missing content?
- **E-E-A-T signals** — Author bios, credentials, trust signals
- **Estimated domain authority** — Relative strength comparison

Present findings as a competitor comparison table showing strengths and weaknesses.

After presenting, proceed to Phase 3.

---

## Phase 3: Architecture & Content Strategy

**Goal:** Present the site architecture design and content strategy. Wait for user approval before building the roadmap.

### Architecture Design

Based on the industry template and competitive analysis:

- Design URL hierarchy and content pillars
- Plan internal linking strategy
- Define sitemap structure with quality gates applied
- Map information architecture for user journeys

### Content Strategy

Based on the competitive gaps identified in Phase 2:

- **Content gaps vs competitors** — Specific topics and pages to create
- **Page types and estimated counts** — Service pages, blog posts, landing pages, etc.
- **Blog/resource topics and publishing cadence** — Frequency and topic clusters
- **E-E-A-T building plan** — Author bios, credentials, experience signals
- **Content calendar with priorities** — What to create first, second, third

Present the architecture and content strategy together as a cohesive plan.

**STOP. Present the architecture design and content strategy to the user. Wait for their approval. They may want to adjust content pillars, URL structure, or publishing cadence. Do not proceed to Phase 4 until the user confirms.**

---

## Phase 4: Technical Foundation & Implementation Roadmap

**Goal:** Present the technical requirements and a phased implementation roadmap.

### Technical Foundation

- Hosting and performance requirements
- Schema markup plan per page type
- Core Web Vitals baseline targets
- AI search readiness requirements (cross-reference `seo-geo` skill)
- Mobile-first considerations

### Implementation Roadmap (4 phases)

#### Roadmap Phase 1 — Foundation (weeks 1-4)
- Technical setup and infrastructure
- Core pages (home, about, contact, main services)
- Essential schema implementation
- Analytics and tracking setup

#### Roadmap Phase 2 — Expansion (weeks 5-12)
- Content creation for primary pages
- Blog launch with initial posts
- Internal linking structure
- Local SEO setup (if applicable)

#### Roadmap Phase 3 — Scale (weeks 13-24)
- Advanced content development
- Link building and outreach
- GEO optimization
- Performance optimization

#### Roadmap Phase 4 — Authority (months 7-12)
- Thought leadership content
- PR and media mentions
- Advanced schema implementation
- Continuous optimization

### KPI Targets

| Metric | Baseline | 3 Month | 6 Month | 12 Month |
|--------|----------|---------|---------|----------|
| Organic Traffic | ... | ... | ... | ... |
| Keyword Rankings | ... | ... | ... | ... |
| Domain Authority | ... | ... | ... | ... |
| Indexed Pages | ... | ... | ... | ... |
| Core Web Vitals | ... | ... | ... | ... |

Fill in baseline from current data (if existing site) and set realistic targets based on the competitive analysis and budget from Phase 1.

### Success Criteria

- Clear, measurable goals per phase
- Resource requirements defined
- Dependencies identified
- Risk mitigation strategies

Present the full roadmap and technical plan to the user. After confirmation, proceed to Phase 5.

---

## Phase 5: Deliverables

**Goal:** Generate all output files based on the approved plan.

Create these deliverables in the working directory:

1. **`SEO-STRATEGY.md`** — Complete strategic plan incorporating all phases
2. **`COMPETITOR-ANALYSIS.md`** — Competitive insights from Phase 2
3. **`CONTENT-CALENDAR.md`** — Content roadmap with topics, priorities, and cadence
4. **`IMPLEMENTATION-ROADMAP.md`** — Phased action plan with timelines and owners
5. **`SITE-STRUCTURE.md`** — URL hierarchy and architecture diagram

After generating each file, confirm with the user:

> "I've generated the following deliverables:
> 1. `SEO-STRATEGY.md` — Your complete SEO plan
> 2. `COMPETITOR-ANALYSIS.md` — Analysis of your top competitors
> 3. `CONTENT-CALENDAR.md` — Your content roadmap
> 4. `IMPLEMENTATION-ROADMAP.md` — Phased action plan
> 5. `SITE-STRUCTURE.md` — Your site architecture
>
> Want me to walk through any of these, adjust priorities, or dive deeper into a specific area?"
