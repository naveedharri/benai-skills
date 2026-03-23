# Phase 4: Customize & Ship

Rewrite the cloned site section by section with real copy, then deploy.

---

## Part 1: Copy Formulas + SEO Writing Rules

Use these frameworks to write copy that **converts visitors AND ranks in search**. Every piece of copy should be written with both goals from the start — never bolt on SEO after.

### Step 0: Identify Keywords Before Writing

Before writing any copy, establish the keyword strategy from Phase 1 + Phase 3 answers:

1. **Primary keyword** — the one term the page should rank for (derived from business type + core offer)
   - Example: "AI automation agency", "wedding photographer London", "SaaS onboarding tool"
2. **Secondary keywords** (3-5) — related terms and variations
   - Example: "AI workflow automation", "business process automation", "automation consulting"
3. **Question keywords** — what the target audience searches (use for FAQ section)
   - Example: "How much does AI automation cost?", "What is workflow automation?"

If the user hasn't explicitly provided keywords, derive them from:
- Q1 (business type) + Q2 (what they do) + Q4 (who it's for)
- The language their target audience would actually search for

**Present keywords to the user for confirmation before writing.**

### Tone Mapping

| Tone | Keywords | Best For |
|------|----------|----------|
| **Professional** | Authoritative, Clear, Concise | Corporate, Finance, Enterprise SaaS |
| **Friendly** | Warm, Approachable, Simple | Consumer Apps, Coaching, Lifestyle |
| **Luxury** | Elegant, Minimal, Evocative | High-end Goods, Premium Services |
| **Bold** | Confident, Direct, Energetic | Startups, Agencies, Disruptors |

Match the tone to the user's brand identity (Q10) and business type (Q1).

### Section Copy Formulas

#### Hero: Transformation Statement
- **Headline:** [Benefit] + [Mechanism] + [Outcome]
- **SEO rule:** The H1 MUST contain the primary keyword naturally
- Example: "**AI Automation** That Gets You 10 New Clients in 30 Days"
- **Subtitle:** Include primary keyword again within the first 100 words of body text

#### Problem Section: PAS (Problem-Agitation-Solution)
- **Problem:** State the pain clearly
- **Agitation:** Make it hurt (cost, stress, time wasted)
- **Solution:** Introduce the offer as relief
- **SEO rule:** Use a secondary keyword in the H2

#### Features/Solution: FAB (Features-Advantages-Benefits)
- **Feature:** What it is
- **Advantage:** What it does
- **Benefit:** The emotional/business payoff
- **SEO rule:** Use secondary keywords in H3 subheadings naturally

#### Social Proof: The Specific Win
- Don't say: "Great service"
- Do say: "We saved $10k in the first month"
- **SEO rule:** Include specific numbers — search engines and users trust precision

#### FAQ Section: Featured Snippet Optimization
- Write questions using the question keywords from Step 0
- **Each answer must be 40-60 words** — this is the ideal length for Google featured snippets
- Start each answer with a direct response, then add detail
- This section also generates FAQPage schema (handled in Part 2B)

#### CTA / Closing
- Include primary keyword one final time in the closing section
- Clear, specific call-to-action

### Keyword Placement Rules (Apply to ALL Sections)

| Where | Rule |
|-------|------|
| H1 (hero headline) | Primary keyword — required |
| First 100 words | Primary keyword — required |
| At least one H2 | Primary keyword — required |
| Other H2s | Secondary keywords — naturally |
| H3 subheadings | Secondary keywords — where they fit |
| FAQ questions | Question keywords — required |
| Conclusion/CTA | Primary keyword — required |
| Image alt text | Primary or secondary keyword — where relevant |

**Important:** Never force keywords. If it sounds unnatural, rewrite the sentence. Google prioritizes semantic relevance over exact matches. One natural mention per section is enough.

### Content Quality Standards (CORE-EEAT)

Apply while writing — not after:

- **Direct answer first** — the hero should immediately communicate what the business does
- **Specific numbers** — use precise data ("47 clients served", "$2.3M revenue generated"), not vague claims
- **No filler** — every sentence should add value. Cut "In today's world..." and "It goes without saying..."
- **Short paragraphs** — 2-3 sentences max per paragraph for scannability
- **Bold key phrases** — highlight the most important insight in each section
- **Varied sentence length** — mix short punchy lines with medium explanatory ones

### Length Guidelines

| Element | Target Length |
|---------|-------------|
| H1 headline | 5-12 words (include primary keyword) |
| Subtitle | 15-25 words (include primary keyword) |
| Body paragraph | 2-3 sentences |
| CTA button | 2-5 words |
| Card descriptions | 1-2 sentences |
| FAQ answers | 40-60 words (featured snippet optimized) |

### Title Tag Formulas (for Meta Title in Part 2B)

Use one of these proven patterns when generating the page title tag:

| Formula | Example |
|---------|---------|
| `[Keyword]: [Benefit] \| [Brand]` | AI Automation: Save 20hrs/Week \| BrightFlow |
| `[Number] [Keyword] [Qualifier]` | #1 AI Automation Agency for Small Business |
| `How to [Keyword]: [Result]` | How to Automate Your Business: Cut Costs 40% |
| `[Keyword] — [Benefit] ([Year])` | AI Workflow Automation — Fast Setup (2026) |
| `[Keyword] for [Audience] \| [Brand]` | AI Automation for Agencies \| BrightFlow |

Pick the formula that best matches the search intent and business type.

---

## Part 2: Section Rewriting Process

For EACH section on the cloned site, write copy that is both conversion-optimized AND SEO-ready. Use the keyword strategy from Part 1 Step 0 throughout.

### Step 1: Write 3 Options

Write 3 headline options using different angles. **All options must integrate keywords naturally** per the placement rules in Part 1:

- **Option A:** Direct/clear (keyword-forward)
- **Option B:** Benefit-driven (keyword woven into benefit)
- **Option C:** Creative/bold (keyword integrated naturally)

Also write the subtitle and body copy (usually one strong version).

**For the Hero section specifically:**
- All 3 H1 options MUST contain the primary keyword
- The subtitle MUST include the primary keyword within the first 100 words
- Body copy should include at least one secondary keyword

**For H2 sections (Features, Problem, Solution, etc.):**
- Each H2 should use a secondary keyword where it fits naturally
- Body copy should reference related terms from the keyword list

**For the FAQ section:**
- Use the question keywords from Part 1 Step 0 as the actual questions
- Keep each answer to 40-60 words (featured snippet length)
- Start with a direct answer, then add supporting detail

### Step 2: Present to User

Show the options as plain text. Do NOT use `AskUserQuestion` here — just output the content and let the user type their response naturally.

```
HERO SECTION
Target keyword: [primary keyword]

  A) [headline text]
  B) [headline text]
  C) [headline text]

Subtitle: [Draft subtitle]

Body: [Draft body copy]

Which headline works best — A, B, C, or want to mix and match?
```

Wait for the user to type their choice. They might pick one, combine parts, or rewrite entirely — all fine.

### Step 3: Apply to Site

1. Update the section's code with the approved copy
2. Write a descriptive `alt` attribute for every image in this section (include keyword where relevant, keep under 125 chars)
3. If the section needs new/different images, you MUST call `generate_image` (Nano Banana MCP) — do not skip, do not assume unavailable. Double-specify aspect ratio in prompt text AND `aspectRatio` param. Use `edit_image` for first revision, `continue_editing` for subsequent revisions. Match the site's visual style, use brand colors in the prompt. File flow: `./generated_imgs/` → copy to `public/images/`
4. The site hot-reloads in the Claude Desktop preview panel automatically
5. The user can click any element in the preview to reference it for tweaks
6. Ask: "How does that look? Ready to move to the next section?"

### Step 4: Repeat

Move through every section: Hero → Features → Problem → Solution → Testimonials → FAQ → CTA → Footer.

### SEO Self-Check After All Sections

Before moving to Part 2B, verify the copy hits these targets:

- [ ] Primary keyword appears in H1
- [ ] Primary keyword appears within first 100 words
- [ ] Primary keyword appears in at least one H2
- [ ] Primary keyword appears in the closing/CTA section
- [ ] Secondary keywords appear in other H2s/H3s
- [ ] FAQ answers are 40-60 words each
- [ ] Every image has a descriptive alt attribute
- [ ] No keyword stuffing — every mention reads naturally

If any items fail, go back and adjust the copy before proceeding.

---

## Part 2B: Technical SEO Completion

**Reference:** Read `references/06-seo.md` before this step.

Content-level SEO (keywords, alt text, heading hierarchy) is already done in Part 2. This step handles the **technical SEO** that wraps around the content.

### Step 1: Meta Tags & Social Sharing

Update `app/layout.tsx` metadata with real values. Use a title tag formula from Part 1:

1. **Title tag** — Use one of the formulas from Part 1 (50-60 chars, primary keyword included)
2. **Meta description** — Value proposition + CTA (150-160 chars, primary keyword included)
3. **Open Graph tags** — Update title, description, URL, site name
4. **Twitter Card tags** — Same content as OG
5. **OG Image** — Generate a 1200x630px branded banner using the image generation tool
   - Use the hero section visual or a branded composition
   - Include the business name and tagline

### Step 2: Schema Markup (JSON-LD)

Add structured data to `app/page.tsx`:

1. **Organization schema** (always) — business name, URL, logo, description
2. **WebSite schema** (always) — site name and URL
3. **FAQPage schema** (if FAQ section exists) — extract Q&A pairs directly from the FAQ section copy written in Part 2

See `references/06-seo.md` Section 5 for ready-to-use JSON-LD templates.

### Step 3: Technical SEO Files

Update the placeholder values set in Phase 2:
1. **`public/robots.txt`** — Update sitemap URL to production domain (or Vercel URL)
2. **`app/sitemap.ts`** — Update URL to production domain

### Step 4: Final SEO Checklist

Run the full checklist from `references/06-seo.md` Section 8 before deploying. The content items should already pass from Part 2. Verify the technical items pass too. Fix any failures.

---

## Part 3: Adding New Sections

If the user wants a section that doesn't exist on the inspiration site:

1. **Check `components/section-registry.json`** for a matching component variant
2. **Read the component file** as a starting point
3. **Adapt it** to match the cloned site's visual language (colors, typography, spacing, UI patterns)
4. **Write copy** using the formulas above
5. **Insert** at the right position in the page

The component library is ONLY used here — never during the initial clone.

---

## Part 4: Final Review & Re-deploy

### 4.1 Full-Page Review

After all sections are customized:

```
Here's your finished site with all your content:

SECTIONS:
1. [Section] — [approved headline]
2. [Section] — [approved headline]
...

Before final deploy, please:
1. Read through all the copy one more time
2. Check mobile layout (resize browser or use DevTools)
3. Test the form/CTA

Any final tweaks, or ready to ship?
```

### 4.2 Final Design Tweaks

Common last-minute adjustments:
- Spacing between sections
- Color accent adjustments
- Animation timing
- Mobile-specific fixes

### 4.3 Re-deploy to Production

```bash
npx vercel --prod
```

### 4.4 Post-Deploy Verification

Open the production URL in both the Claude Desktop preview panel and an external browser. Verify:
- All sections render correctly
- Images load (no broken paths from Nano Banana generation)
- Forms submit to correct endpoint
- SSL certificate active (https)
- Mobile layout works

### 4.5 Handover

First, show the completion summary as plain text:

```
Your landing page is live and SEO-ready!

PRODUCTION URL: [production URL]
LOCAL PREVIEW: Still available in the preview panel →

What's built in:
- All meta tags (title, description, OG, Twitter cards)
- Schema markup (Organization, WebSite, FAQ if applicable)
- Sitemap and robots.txt
- Semantic HTML with proper heading hierarchy
- SEO-optimized copy with keyword integration
- Descriptive alt text on all images

The preview panel stays active — click any element to request changes.
```

Then immediately present the "What's your next move?" menu using `AskUserQuestion`:

```
AskUserQuestion(
  question: "What's your next move?",
  options: [
    { label: "Connect custom domain", description: "Point your .com to this site" },
    { label: "Install Google Analytics", description: "Track who visits your site and what they do" },
    { label: "Set up Google Search Console", description: "Get found on Google + submit your sitemap" },
    { label: "Connect forms / lead capture", description: "Actually receive form submissions via email" },
    { label: "Add legal pages", description: "Privacy policy, terms of service, cookie consent" },
    { label: "Continue editing the site", description: "Make more changes to copy, design, or sections" },
    { label: "I'm done for now", description: "Wrap up — I'll come back later" }
  ]
)
```

**When the user picks an option:**
1. Read the matching section from `references/07-post-launch.md`
2. Do any code changes Claude can handle (add analytics script, create legal pages, etc.) and redeploy
3. Show a step-by-step guide for parts that need user action
4. After completing the step, show the "What's your next move?" menu again

**Loop** until the user picks "I'm done for now" or "Continue editing the site".

If "Continue editing" — stay in the conversation, let them click elements in the preview or describe changes.
If "I'm done" — end with a brief goodbye and remind them they can run `/website-launch-kit` again anytime.
