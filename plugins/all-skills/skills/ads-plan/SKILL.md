---
name: ads-plan
description: >
  Strategic paid advertising planning with industry-specific templates.
  Covers platform selection, campaign architecture, budget planning,
  creative strategy, and phased implementation roadmap. Use when user says
  "ad plan", "ad strategy", "campaign planning", "media plan", "PPC strategy",
  or "advertising plan".
---

# Strategic Paid Advertising Plan

## Process

### 0. Brand Context Setup

Check for `./branding.md` in the project root.

**If found:** Load brand identity, voice, audience, visual guidelines, competitor positioning. Confirm with the user: "I found your brand context (branding.md). Using it for this plan." Skip to step 1.

**If not found:** Collect brand context before proceeding. This information shapes every downstream step — platform selection, creative strategy, audience targeting, and budget allocation.

> "Before building your ad strategy, I need to understand your brand. What's your brand name and website URL?"

#### 0.1 — Brand Identity + Website (required)

Ask for the brand name and website URL first. If the user provides a URL, immediately
run the full website extraction (step 0.2) before asking any further questions. Everything
that can be extracted from the website should be extracted — never ask the user for
information that's already on their site.

Also collect (if not already clear from the website):
- Industry
- Business model (SaaS, e-commerce, service, B2B, B2C, hybrid)

#### 0.2 — Website Extraction (when URL provided)

This is the most important part of brand context setup. **Do not guess or assume anything.**
Extract the actual values the business uses on their live website.

##### 0.2a — Fetch the homepage

Use WebFetch on the homepage URL. Instruct it to extract ALL of the following:

**Visual identity:**
- All colors used prominently: backgrounds, buttons, headers, links, text, borders,
  footer. Report exact hex values. Identify which is primary (most prominent brand color,
  usually on CTAs and headers), secondary, accent, background, and text color.
- Font families: read the actual `font-family` declarations used on headings and body text.
  Look in CSS, `<link>` tags for Google Fonts / Typekit / custom font URLs, and inline styles.
  Report the exact font names (e.g., "Plus Jakarta Sans", "DM Sans", "Geist"), not generic
  fallbacks like "sans-serif".
- Logo: describe the logo from the header/nav. Note if it's text-based, icon-based, or both.
- Visual style: describe what you observe — is it minimal with lots of whitespace? Bold with
  saturated colors? Dark mode? Gradient-heavy? Illustration-driven? Corporate?
- Button styles: rounded, square, pill-shaped? What color? What text color on buttons?
- Spacing and density: tight and information-dense, or airy and spacious?

**Copy and messaging:**
- Tagline / slogan: extract from the hero section
- Hero headline: the main H1 or hero text
- Value proposition: what the homepage says they do and why it matters
- Key benefits: any benefit sections, feature highlights, or selling points
- Social proof: testimonials, customer logos, metrics ("10,000+ customers"), awards,
  trust badges, star ratings
- CTAs: every call-to-action button text on the page (e.g., "Get Started Free",
  "Book a Demo", "See Pricing")
- Navigation items: main nav labels reveal product/service categories and priorities

**Brand voice signals:**
- Tone of the copy: formal or casual? Technical or plain? Playful or serious?
- Person: first person ("We help...") or second person ("You can...") or third?
- Specific words/phrases: any repeated brand language, trademarked terms

##### 0.2b — Fetch additional pages (if needed)

If the homepage alone doesn't give a complete picture, also fetch:
- `/about` or `/about-us` — for company story, mission, team info, more voice signals
- `/pricing` — for pricing model (free trial, freemium, contact-us, subscription tiers)

Only fetch these if there are genuine gaps after the homepage. Don't fetch for the sake of it.

##### 0.2c — Present extraction to user

Show the user everything extracted, organized clearly:

```
Here's what I found on [website]:

  Brand: [name]
  Tagline: "[extracted tagline]"
  Industry: [detected industry]
  Business model: [detected model]

  Colors:
    Primary:    [name] #[hex] — used on [CTAs, headers, etc.]
    Secondary:  [name] #[hex] — used on [subheadings, etc.]
    Accent:     [name] #[hex] — used on [highlights, badges, etc.]
    Background: #[hex]
    Text:       #[hex]

  Fonts:
    Headings: [exact font name]
    Body:     [exact font name]

  Visual style: [description of what you observed]
  Button style: [pill/rounded/square], [color], [hover behavior if visible]

  Voice: [formal/casual], [serious/playful], [technical/simple]
  Hero: "[exact hero headline]"
  Value prop: "[extracted value proposition]"
  CTAs found: "[CTA 1]", "[CTA 2]", "[CTA 3]"
  Social proof: [what's shown — logos, metrics, testimonials]

Does this look right? Anything to correct or add?
```

The user confirms or corrects. Only after confirmation, proceed with remaining questions.

#### 0.3 — Fill gaps with questions

After the website extraction, only ask about things that **could not** be determined from
the website. Skip any section where the website gave a clear answer.

**Likely still needed (websites rarely cover these):**

Target audience specifics:
- Who is your primary customer? (job title/role, age range)
- What are their biggest pain points?
- What motivates them to buy?
- Where do they spend time online?
- Secondary audience?

Competitor positioning:
- Who are your top 2-3 competitors?
- How are you different from each?
(If skipped, note: "To be completed — run `/ads-competitor` for analysis.")

Ad-specific guidelines:
- Preferred CTAs (pre-fill from extracted CTAs, ask user to confirm/adjust)
- Show pricing in ads?
- Required elements? (trust badges, ratings, certifications)
- Anything forbidden in ads?

Brand voice refinement (if the website extraction was ambiguous):
- Words or phrases you always use?
- Words or phrases you never use?

**Do NOT ask about colors, fonts, tagline, visual style, or value proposition if the
website extraction already captured them.** Only ask if the extraction was inconclusive.

#### 0.4 — No-URL fallback

If the user does not provide a website URL, fall back to asking all questions manually:

Visual identity:
- Brand colors (primary, secondary, accent — hex codes)
- Headline and body fonts
- Visual style description
- Logo description

Copy and messaging:
- Tagline or slogan
- One-sentence value proposition
- Top 3 benefits with proof points
- Social proof highlights

Brand voice:
- Formal vs casual (1-10)
- Serious vs playful
- Technical vs simple
- Brand words (always use)
- Forbidden words (never use)

Target audience, competitor positioning, and ad guidelines — same as step 0.3.

#### 0.5 — Save branding.md

Write `./branding.md` in the project root using the canonical format from `ads/references/brand-context.md`.

**Every value in branding.md must come from the website extraction or the user's direct
answers. Never fill in defaults or placeholders.** If a field has no data, leave it blank
or omit the section entirely.

Validate before writing:
- Brand name is not empty
- At least one color with hex value exists
- At least one audience description exists
- Business model is identified

Display summary:

```
Brand context saved: ./branding.md

  Brand: [name]
  Industry: [industry]
  Voice: [tone summary]
  Audience: [persona summary]
  USP: [one-line value prop]
  Colors: [primary hex] [secondary hex] [accent hex]
  Fonts: [heading font] / [body font]

Now building your ad strategy...
```

**Note:** Many of these answers feed directly into step 1 (Discovery) — do not re-ask questions the user already answered. Carry forward business type, audience, goals, and budget context.

### 1. Discovery
- Carry forward from step 0: business type, target audience, value proposition
- Current advertising status (active platforms, spend, performance)
- Goals: brand awareness, lead generation, e-commerce sales, app installs
- Budget range (monthly/quarterly)
- Timeline and urgency
- In-house team capacity vs agency needs

### 2. Competitive Analysis
- Identify top 3-5 competitors
- Analyze their ad presence across platforms (Google Ads Transparency, Meta Ad Library)
- Estimate competitor spend levels and platform mix
- Identify messaging themes and creative approaches
- Note keyword/audience gaps (opportunities competitors are missing)

### 3. Platform Selection
- Load industry template from `assets/` directory
- Match business type to recommended platform mix
- Read `ads/references/budget-allocation.md` for platform selection matrix
- Read `ads/references/conversion-tracking.md` for tracking setup requirements
- Assess platform fit based on:
  - Target audience demographics per platform
  - Product/service type suitability
  - Budget requirements per platform (minimums)
  - Sales cycle length and attribution needs
  - Creative capabilities and content availability

### 4. Campaign Architecture

#### Naming Convention
```
[Platform]_[Objective]_[Audience]_[Geo]_[Date]
```
Example: `META_CONV_Prospecting_US_2026Q1`

#### Campaign Structure Template
```
Account
├── Brand Campaign (always-on, protect brand terms)
├── Non-Brand Prospecting
│   ├── Campaign 1: [Top Funnel - Awareness]
│   │   ├── Ad Group/Set 1: [Audience A]
│   │   └── Ad Group/Set 2: [Audience B]
│   ├── Campaign 2: [Mid Funnel - Consideration]
│   │   ├── Ad Group/Set 1: [Interest-based]
│   │   └── Ad Group/Set 2: [Lookalike/Similar]
│   └── Campaign 3: [Bottom Funnel - Conversion]
│       ├── Ad Group/Set 1: [High-intent]
│       └── Ad Group/Set 2: [Custom audience]
├── Retargeting
│   ├── Website Visitors (7-30 days)
│   ├── Engaged Users (video views, social engagement)
│   └── Cart Abandoners / Form Starters
└── Testing
    └── New audiences, formats, or messaging
```

### 5. Budget Planning

#### Monthly Budget Distribution
Read `ads/references/budget-allocation.md` for the 70/20/10 framework.

| Tier | Allocation | Purpose |
|------|-----------|---------|
| Proven (70%) | Primary platforms with proven ROI | Revenue engine |
| Scaling (20%) | Platforms showing promise | Growth engine |
| Testing (10%) | New platforms or strategies | Innovation |

#### Budget Pacing
- Month 1-2: heavy testing, expect higher CPA (learning)
- Month 3-4: optimize based on data, tighten targeting
- Month 5-6: scale winners, kill losers, expand
- Ongoing: 70/20/10 maintenance with quarterly reviews

### 6. Creative Strategy

#### Content Pillars
- **Pain Point**: address specific problems your audience faces
- **Social Proof**: testimonials, case studies, reviews
- **Product Demo**: show the product/service in action
- **Offer**: promotions, free trials, lead magnets
- **Education**: teach something valuable related to your product

#### Creative Production Plan
| Priority | Asset Type | Platforms | Quantity |
|----------|-----------|-----------|----------|
| P1 | Product/service videos (15-30s) | Meta, TikTok, YouTube | 5-10 |
| P2 | Static images with copy | Google, Meta, LinkedIn | 10-15 |
| P3 | Carousel/collection | Meta, LinkedIn | 3-5 |
| P4 | UGC/testimonial video | TikTok, Meta | 3-5 |
| P5 | Long-form video (1-3 min) | YouTube | 2-3 |

#### Brand-Aware Creative Production
If `branding.md` is available, personalize CREATIVE-BRIEF.md with:
- Ad copy written in brand voice (tone dimensions from Brand Voice section)
- Visual descriptions referencing brand colors (hex values) and typography
- CTAs pulled from approved CTA list (Ad-Specific Guidelines)
- Headlines using brand words; avoiding forbidden words
- Audience messaging mapped to primary/secondary persona pain points
- Competitor differentiation woven into positioning

Read `ads/references/creative-volume.md` for per-platform volume requirements.

### 7. Tracking Setup Plan

Before launching any ads, ensure tracking is configured:

| Platform | Client-Side | Server-Side | Priority |
|----------|------------|-------------|----------|
| Google | gtag.js | Enhanced Conversions, GTM SS | P1 |
| Meta | Pixel | CAPI | P1 |
| LinkedIn | Insight Tag | CAPI (2025) | P2 |
| TikTok | Pixel | Events API + ttclid | P2 |
| Microsoft | UET Tag | Enhanced Conversions | P2 |

### 8. Implementation Roadmap

#### Phase 1 — Foundation (Weeks 1-2)
- Install all tracking pixels and server-side tracking
- Set up conversion events and goals
- Create campaign structure and naming conventions
- Build initial audiences (custom, lookalike/predictive)
- Produce first batch of creative assets

#### Phase 2 — Launch (Weeks 3-4)
- Launch campaigns on primary platform(s) first
- Set conservative budgets and bidding (Maximize Clicks / Lowest Cost)
- Monitor daily for the first 7 days
- Verify conversion tracking is firing correctly

#### Phase 3 — Optimize (Weeks 5-8)
- Analyze initial data (minimum 2 weeks of data)
- Adjust bidding strategies based on conversion volume
- Kill underperforming ad groups/creatives (3x Kill Rule)
- Launch secondary platforms
- Begin A/B testing (creative, landing pages, audiences)

#### Phase 4 — Scale (Weeks 9-12)
- Scale winning campaigns (20% rule)
- Expand to testing platforms (10% budget)
- Implement advanced strategies (ABM, Shopping feeds, Smart+)
- Monthly performance reviews

## Industry Templates

Load from `assets/` directory based on detected or specified business type:
- `saas.md` — SaaS companies
- `ecommerce.md` — E-commerce stores
- `local-service.md` — Local service businesses
- `b2b-enterprise.md` — B2B enterprise
- `info-products.md` — Info products and courses
- `mobile-app.md` — Mobile app companies
- `real-estate.md` — Real estate
- `healthcare.md` — Healthcare
- `finance.md` — Financial services
- `agency.md` — Marketing agencies
- `hybrid.md` — Multi-model businesses (product + service, B2B + B2C)
- `seasonal.md` — Seasonal businesses (holiday, summer, event-driven)
- `nonprofit.md` — 501(c)(3) organizations, Google Ad Grants compliance
- `government.md` — Public sector, WCAG accessibility, government compliance
- `generic.md` — General business template

## Output

### Deliverables (Markdown + PDF)

Every deliverable is written as markdown first, then converted to a brand-styled PDF.

| Markdown | PDF | Contents |
|----------|-----|----------|
| `ADS-STRATEGY.md` | `ADS-STRATEGY.pdf` | Complete strategic advertising plan |
| `CAMPAIGN-ARCHITECTURE.md` | `CAMPAIGN-ARCHITECTURE.pdf` | Campaign structure with naming conventions |
| `BUDGET-PLAN.md` | `BUDGET-PLAN.pdf` | Budget allocation with monthly pacing |
| `CREATIVE-BRIEF.md` | `CREATIVE-BRIEF.pdf` | Creative production plan (brand-personalized) |
| `TRACKING-SETUP.md` | `TRACKING-SETUP.pdf` | Tracking implementation checklist |
| `IMPLEMENTATION-ROADMAP.md` | `IMPLEMENTATION-ROADMAP.pdf` | Phased rollout timeline |

### PDF Generation

After writing all markdown deliverables, generate branded PDFs using `md-to-pdf`.
The stylesheet is **not a template** — it is generated from scratch every time by reading
`./branding.md` and translating the brand's full identity into CSS.

#### Step 1: Read branding.md and generate a stylesheet

Read `./branding.md` in full. Extract everything relevant to visual presentation:

- **Colors:** primary, secondary, accent hex values. Derive tints (lighten for backgrounds,
  hover states) and shades (darken for borders, emphasis) from those base colors.
- **Typography:** heading and body font families. If Google Fonts, add an `@import` rule.
  If the fonts are not web-available, pick the closest system font match.
- **Visual style:** the described style (clean/minimal, bold/colorful, professional, playful,
  premium) drives the overall design personality:
  - **Clean/minimal** — generous whitespace, thin borders, light backgrounds, subtle accents
  - **Bold/colorful** — saturated colors, strong contrasts, colored section backgrounds
  - **Professional** — muted palette, structured grid feel, heavier typography
  - **Playful** — rounded corners, warmer tones, lighter font weights
  - **Premium** — dark accents, generous padding, restrained color use, serif headings
- **Brand voice:** formal vs casual tone influences typographic choices — formal brands
  get tighter letter-spacing and traditional headings; casual brands get looser, friendlier type.
- **Industry:** tailor the aesthetic — finance/healthcare lean conservative, SaaS/tech lean
  modern, e-commerce leans vibrant.

Write a complete CSS file to `_brand-pdf.css` that covers:

```
@page setup          — A4, margins, page numbers in brand font/color
Body                 — Brand body font, size, line-height, text color
Headings (h1-h4)     — Brand heading font, h1 in primary color with a styled underline
                       (solid, gradient, or accent-colored depending on visual style)
Tables               — thead background in primary color (white text), striped rows
                       using a light tint of the primary, borders in a derived border color
Blockquotes          — Left border in accent color, light tint background
Code blocks          — Light background, left border in primary, brand monospace stack
Links                — Primary color
Lists                — Appropriate spacing and markers
Horizontal rules     — Styled with brand colors
Print helpers        — page-break-after: avoid on headings, page-break-inside: avoid
                       on tables/code/blockquotes
```

**Every color in the CSS must trace back to branding.md.** Do not use any hardcoded
colors that don't derive from the brand palette. Derive light backgrounds, border colors,
and muted text from the primary/secondary using opacity or HSL manipulation.

**Example derivation for a brand with primary #2563eb:**
- Light background: `#2563eb0a` (primary at 4% opacity) or manually lighten to `#eff6ff`
- Border: `#2563eb20` (primary at 12% opacity) or manually lighten to `#dbeafe`
- Muted text: secondary color, or primary darkened

#### Step 2: Convert each deliverable

```bash
npx md-to-pdf --stylesheet _brand-pdf.css ADS-STRATEGY.md
npx md-to-pdf --stylesheet _brand-pdf.css CAMPAIGN-ARCHITECTURE.md
npx md-to-pdf --stylesheet _brand-pdf.css BUDGET-PLAN.md
npx md-to-pdf --stylesheet _brand-pdf.css CREATIVE-BRIEF.md
npx md-to-pdf --stylesheet _brand-pdf.css TRACKING-SETUP.md
npx md-to-pdf --stylesheet _brand-pdf.css IMPLEMENTATION-ROADMAP.md
```

Each command produces a `.pdf` alongside the `.md`.

#### Step 3: Clean up

```bash
rm _brand-pdf.css
```

#### Step 4: Confirm

```
PDFs generated with [Brand Name] styling:
  ADS-STRATEGY.pdf
  CAMPAIGN-ARCHITECTURE.pdf
  BUDGET-PLAN.pdf
  CREATIVE-BRIEF.pdf
  TRACKING-SETUP.pdf
  IMPLEMENTATION-ROADMAP.pdf

Brand applied:
  Colors: [primary] [secondary] [accent]
  Fonts: [heading font] / [body font]
  Style: [visual style description]
```

**If `npx md-to-pdf` fails** (Node.js not installed, network error, Puppeteer issue),
inform the user and suggest `npm install -g md-to-pdf` then retry. The markdown files
are always the primary deliverables — PDFs are supplementary.

### KPI Targets
| Metric | Month 1 | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|---------|----------|
| ROAS | Baseline | Target -20% | Target | Target +20% |
| CPA | Baseline | Target +30% | Target | Target -10% |
| CVR | Baseline | +10% | +20% | +30% |
| CTR | Baseline | +15% | +25% | +30% |
| Budget | Testing | Optimizing | Scaling | Maintaining |
