---
name: ads-creative
description: >
  Cross-platform creative quality audit covering ad copy, video, image, and
  format diversity across all platforms. Detects creative fatigue, evaluates
  platform-native compliance, and provides production priorities. Collects brand
  context and creates branding.md if missing. Uses infographic-v2 for generating
  ad creatives. Use when user says "creative audit", "ad creative", "creative
  fatigue", "ad copy", "ad design", or "creative review".
---

# Cross-Platform Creative Quality Audit

## Process

1. **Brand context check** — look for `./branding.md`. If not found, run the Brand Info Collection flow below before proceeding.
2. Collect creative assets or performance data from active platforms
3. Read `ads/references/platform-specs.md` for creative specifications
4. Read `ads/references/creative-volume.md` for per-platform volume and refresh requirements
5. Read `ads/references/benchmarks.md` for CTR/engagement benchmarks
6. Read `ads/references/scoring-system.md` for weighted scoring algorithm
7. Evaluate creative quality per platform
8. Run Brand Consistency Audit using branding.md (advisory, not scored)
9. Assess cross-platform creative consistency
10. Generate production priority recommendations
11. **Offer to generate new creatives** using `/infographic-v2` for any flagged gaps

---

## Brand Info Collection

Run this at the start if `./branding.md` does not exist in the project root.

**Goal:** Extract the brand's actual styling, copy, and identity — primarily from their
website — to personalize the creative audit and enable on-brand creative generation via
infographic-v2.

### Step 1: Ask for brand name and website

> "Before I audit your creatives, I need your brand context to check consistency. What's your brand name and website URL?"

Ask for the brand name and website URL first. If the user provides a URL, immediately
run the website extraction (step 2) before asking any further questions.

### Step 2: Website extraction (when URL provided)

**Do not guess or assume anything.** Extract the actual values from the live website.

#### 2a — Fetch the homepage

Use WebFetch on the homepage URL. Extract ALL of the following:

**Visual identity:**
- All colors used prominently: backgrounds, buttons, headers, links, text, borders,
  footer. Report exact hex values. Identify which is primary (most prominent brand color,
  usually on CTAs and headers), secondary, accent, background, and text color.
- Font families: read the actual `font-family` declarations used on headings and body text.
  Look in CSS, `<link>` tags for Google Fonts / Typekit / custom font URLs, and inline styles.
  Report the exact font names (e.g., "Plus Jakarta Sans", "DM Sans", "Geist"), not generic
  fallbacks like "sans-serif".
- Logo: describe the logo from the header/nav. Note if it's text-based, icon-based, or both.
- Visual style: describe what you observe — minimal with whitespace? Bold with saturated
  colors? Dark mode? Gradient-heavy? Illustration-driven? Corporate?
- Button styles: rounded, square, pill-shaped? What color? What text color on buttons?
- Spacing and density: tight and information-dense, or airy and spacious?

**Copy and messaging:**
- Tagline / slogan from the hero section
- Hero headline: the main H1 or hero text
- Value proposition: what they do and why it matters
- Key benefits: any benefit sections, feature highlights, selling points
- Social proof: testimonials, customer logos, metrics, awards, trust badges, star ratings
- CTAs: every call-to-action button text on the page
- Navigation items: main nav labels reveal product/service categories

**Brand voice signals:**
- Tone of the copy: formal or casual? Technical or plain? Playful or serious?
- Person: first person ("We help...") or second person ("You can...")?
- Specific words/phrases: any repeated brand language, trademarked terms

#### 2b — Fetch additional pages (if needed)

If the homepage left gaps, also fetch:
- `/about` or `/about-us` — company story, mission, team, more voice signals
- `/pricing` — pricing model (free trial, freemium, tiers, contact-us)

Only fetch if there are genuine gaps. Don't fetch for the sake of it.

#### 2c — Present extraction to user

Show everything extracted clearly:

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

### Step 3: Fill gaps with questions

After website extraction, only ask about things that **could not** be determined from
the website. Skip any section where the website gave a clear answer.

**Likely still needed (websites rarely cover these):**

- Target audience: who they sell to (job title/role, age), pain points, buying triggers,
  where they spend time online
- Ad-specific guidelines: confirm extracted CTAs, pricing in ads?, required elements
  (trust badges, ratings), anything forbidden
- Brand voice refinement (only if ambiguous from the site): words they always/never use

**Do NOT re-ask about colors, fonts, tagline, visual style, or value proposition if the
website extraction already captured them.**

### Step 4: No-URL fallback

If the user does not provide a website URL, collect everything manually:

1. **Brand colors** — primary, secondary, accent (hex codes)
2. **Typography** — headline and body fonts
3. **Visual style** — clean/minimal, bold/colorful, professional, playful, premium
4. **Tagline / value proposition**
5. **Brand voice** — formal vs casual (1-10), serious vs playful, technical vs simple
6. **Target audience** — who they sell to, main pain points
7. **Approved CTAs**
8. **Anything forbidden** in ads

### Step 5: Save branding.md

Write `./branding.md` in the project root using the canonical format from
`ads/references/brand-context.md`.

**Every value in branding.md must come from the website extraction or the user's direct
answers. Never fill in defaults or placeholders.** If a field has no data, leave it blank
or omit the section.

Validate before writing:
- Brand name is not empty
- At least one color with hex value exists
- At least one audience description exists
- Business model is identified

### Step 6: Confirm and continue

```
Brand context saved: ./branding.md

  Brand: [name]
  Colors: [primary hex] [secondary hex] [accent hex]
  Fonts: [heading font] / [body font]
  Voice: [tone summary]
  Audience: [persona summary]

Proceeding with creative audit...
```

Then continue with the normal creative audit flow (step 2 onward in the Process section).

---

## Per-Platform Assessment

### Google Ads Creative
- RSA: ≥8 unique headlines, ≥3 descriptions per ad group
- RSA ad strength: "Good" or "Excellent"
- Pin usage: minimal and strategic (over-pinning kills RSA flexibility)
- Extensions: sitelinks (≥4), callouts (≥4), structured snippets, image
- PMax asset groups: text + image + video + optional product feed
- YouTube: video quality, hook, subtitles (see ads-youtube sub-skill)

### Meta Ads Creative
- Format diversity: ≥3 formats active (image, video, carousel, collection)
- Creative volume: Standard ≥5 per ad set (ideal 5-8 for Andromeda); ASC ≥50 (ideal 50-150)
- Fatigue detection: CTR declining >20% over 14 days = FAIL; top brands refresh every 10.4 days
- Video length: 15s max Stories/Reels, 30s max Feed
- UGC/testimonial content tested
- Advantage+ Creative enhancements enabled
- Headline under 40 chars, primary text under 125 chars

### LinkedIn Creative
- Thought Leader Ads active, ≥30% budget for B2B
- Format diversity: ≥2 formats tested (single image, carousel, video, document)
- Video ads tested
- Creative refresh: every 4-6 weeks
- Professional tone appropriate for platform

### TikTok Creative
- ≥6 creatives per ad group (Critical; top performers: 10-20/campaign; Smart+ launch: ≥4)
- All video 9:16 vertical 1080x1920 (non-negotiable)
- Native-looking content (not corporate)
- Hook in first 1-2 seconds
- Fatigue onset: 3-5 days; typical lifespan: 7-10 days; refresh every 10-14 days
- No creative active >7 days with declining CTR; hard ceiling: 30 days regardless
- Spark Ads tested (~3% CTR vs ~2% standard)
- Sound-on optimization (never silent)
- Safe zone compliance: X:40-940, Y:150-1470
- Trending audio used

### Microsoft Creative
- RSA: ≥8 headlines, ≥3 descriptions
- Multimedia Ads tested (unique rich format)
- Ad copy optimized for Bing demographics (older, higher income, professional)
- Action Extension utilized (unique to Microsoft)
- Filter Link Extension tested

## Creative Fatigue Detection

### Signals of Fatigue
| Signal | Threshold | Action |
|--------|-----------|--------|
| CTR declining | >20% over 14 days | Refresh creative |
| Frequency (Meta) | >5.0 prospecting, >12.0 retargeting | New audience or creative |
| Watch time declining (TikTok) | <3s average | New hook needed |
| QS declining (Google) | Drop of 2+ points | Refresh ad copy |
| Engagement rate drop | >30% decline | Full creative overhaul |

### Refresh Cadence by Platform
| Platform | Recommended Refresh |
|----------|-------------------|
| Google Search | Every 8-12 weeks |
| Meta | Every 10-14 days (top brands avg 10.4 days); hard ceiling 90 days |
| LinkedIn | Every 2-4 weeks; 80/20 winner/testing split |
| TikTok | Every 10-14 days (fatigue onset 3-5 days, lifespan 7-10 days); hard ceiling 30 days |
| Microsoft | Every 8-12 weeks |
| YouTube | Every 4-8 weeks |

## Format Diversity Matrix

Evaluate which formats are active per platform:

| Format | Google | Meta | LinkedIn | TikTok | Microsoft |
|--------|--------|------|----------|--------|-----------|
| Static Image | RSA image ext | ✅ | ✅ | ❌ | Multimedia |
| Video | YouTube, PMax | ✅ | ✅ | ✅ (required) | ❌ |
| Carousel | ❌ | ✅ | ✅ | ❌ | ❌ |
| Collection | ❌ | ✅ | ❌ | ❌ | ❌ |
| Document | ❌ | ❌ | ✅ | ❌ | ❌ |
| Shopping | PMax, Shopping | Catalog | ❌ | Shop | Shopping |

## Universal Creative Best Practices

### Cross-Platform Safe Zone
- 900x1000px usable area works across all vertical placements
- Keep critical elements centered and within safe margins
- Test on mobile devices (75%+ of ad impressions are mobile)

### Ad Copy Principles
- Lead with benefit, not feature
- Include clear CTA (what should they do next?)
- Match ad message to landing page (message match)
- Use numbers and specifics over vague claims
- Test emotional vs rational appeals

### Video Production Standards
- H.264 codec, AAC audio, MP4 container
- Minimum 720p (1080p preferred)
- Subtitles/captions always (accessibility + sound-off viewing)
- Brand mention within first 5s (awareness) or at CTA (performance)

## Brand Consistency Audit (Advisory)

Using `./branding.md`, evaluate these dimensions. Results are **advisory only** — they
appear as "Brand Consistency Notes" in the report but are NOT included in the health score.

| Dimension | What to Check |
|-----------|--------------|
| Color compliance | Ad visuals use brand primary/secondary colors (hex match) |
| Typography | Headlines and body text match brand font guidelines |
| Tone alignment | Ad copy matches brand voice dimensions (formal/casual, etc.) |
| CTA consistency | CTAs match approved CTA list from branding.md |
| Visual style | Photography/illustration style matches brand guidelines |
| Forbidden elements | No forbidden words or elements present in ads |
| Audience match | Messaging addresses documented persona pain points |

## Creative Generation with Infographic v2

After the audit, when the production priority list identifies creatives to produce (static images, infographics, data visuals for ads), offer to generate them using `/infographic-v2`.

**Flow:**
1. Identify the highest-priority static creative gaps from the audit
2. Ask: "I can generate ad creatives for the top gaps using the infographic tool. Want me to start with [highest priority gap]?"
3. If yes, invoke `/infographic-v2` — it will pick up `./branding.md` for brand-consistent output
4. The infographic skill handles concept selection, visualization approach, and generation
5. After generation, return to the next creative gap or wrap up

**What infographic-v2 uses from branding.md:**
- Brand colors → color palette for the infographic
- Typography → font selection
- Visual style → style anchors
- Brand voice → headline and copy tone
- Approved CTAs → CTA text in ad creatives

## Output

### Creative Quality Report

```
Cross-Platform Creative Health

Google:     ████████░░  X/X checks passing
Meta:       ██████████  X/X checks passing
LinkedIn:   ███████░░░  X/X checks passing
TikTok:     █████░░░░░  X/X checks passing
Microsoft:  ████████░░  X/X checks passing
```

### Deliverables
- `CREATIVE-AUDIT-REPORT.md` — Per-platform creative assessment
- Fatigue alerts (any creative past refresh cadence)
- Format diversity gaps per platform
- Production priority list (most impactful creative to produce next)
- Quick Wins (format conversions, CTA changes, Spark Ads setup)
- **Generated ad creatives** via infographic-v2 (if user opts in)
