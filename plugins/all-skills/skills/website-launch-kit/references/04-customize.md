# Phase 4: Customize & Ship

Rewrite the cloned site section by section with real copy, then deploy.

---

## Part 1: Copy Formulas

Use these frameworks to write compelling copy from the user's Phase 3 answers.

### Tone Mapping

| Tone | Keywords | Best For |
|------|----------|----------|
| **Professional** | Authoritative, Clear, Concise | Corporate, Finance, Enterprise SaaS |
| **Friendly** | Warm, Approachable, Simple | Consumer Apps, Coaching, Lifestyle |
| **Luxury** | Elegant, Minimal, Evocative | High-end Goods, Premium Services |
| **Bold** | Confident, Direct, Energetic | Startups, Agencies, Disruptors |

Match the tone to the user's brand identity (Q10) and business type (Q1).

### Hero: Transformation Statement
- **Headline:** [Benefit] + [Mechanism] + [Outcome]
- Example: "Get 10 New Clients in 30 Days with Our Lead Gen Engine"

### Problem Section: PAS (Problem-Agitation-Solution)
- **Problem:** State the pain clearly
- **Agitation:** Make it hurt (cost, stress, time wasted)
- **Solution:** Introduce the offer as relief

### Features/Solution: FAB (Features-Advantages-Benefits)
- **Feature:** What it is
- **Advantage:** What it does
- **Benefit:** The emotional/business payoff

### Social Proof: The Specific Win
- Don't say: "Great service"
- Do say: "We saved $10k in the first month"

### Length Guidelines

| Element | Target Length |
|---------|-------------|
| H1 headline | 5-12 words |
| Subtitle | 15-25 words |
| Body paragraph | 2-3 sentences |
| CTA button | 2-5 words |
| Card descriptions | 1-2 sentences |

---

## Part 2: Section Rewriting Process

For EACH section on the cloned site:

### Step 1: Write 3 Options

Write 3 headline options using different angles:
- **Option A:** Direct/clear
- **Option B:** Benefit-driven
- **Option C:** Creative/bold

Also write the subtitle and body copy (usually one strong version).

### Step 2: Present to User

```
HERO SECTION

Headline Options:
A) [Option A]
B) [Option B]
C) [Option C]

Subtitle: [Draft subtitle]

Body: [Draft body copy]
```

Then ask:

```
AskUserQuestion(
  question: "Which hero headline do you prefer?",
  options: [
    { label: "Option A", description: "[headline text]" },
    { label: "Option B", description: "[headline text]" },
    { label: "Option C", description: "[headline text]" },
    { label: "Mix & Match", description: "I'll specify edits in the text field" }
  ]
)
```

### Step 3: Apply to Site

1. Update the section's code with the approved copy
2. If the section needs new/different images, you MUST call `generate_image` (Nano Banana MCP) — do not skip, do not assume unavailable. Double-specify aspect ratio in prompt text AND `aspectRatio` param. Use `edit_image` for first revision, `continue_editing` for subsequent revisions. Match the site's visual style, use brand colors in the prompt. File flow: `./generated_imgs/` → copy to `public/images/`
3. The site hot-reloads in the Claude Desktop preview panel automatically
4. The user can click any element in the preview to reference it for tweaks
5. Ask: "How does that look? Ready to move to the next section?"

### Step 4: Repeat

Move through every section: Hero → Features → Problem → Solution → Testimonials → FAQ → CTA → Footer.

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

```
Your landing page is live!

PRODUCTION URL: [production URL]
LOCAL PREVIEW: Still available in the preview panel →

The preview panel stays active — you can click any element to request changes anytime.

Next steps:
1. Connect your custom domain in Vercel settings
2. Test the live form/CTA end to end
3. Submit to Google Search Console
4. Share on social media

Want to set up a custom domain or make any changes?
```
