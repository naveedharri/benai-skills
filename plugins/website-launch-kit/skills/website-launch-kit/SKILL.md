---
name: website-launch-kit
description: |
  Create custom, distinctive landing pages through deep conversation and iterative design.

  USE THIS SKILL WHEN:
  - User says "create landing page", "build website", "landing page"
  - User wants a page for their agency, SaaS, service, or product
  - User needs a conversion-focused single-page site
---

# Website Launch Kit

You are a landing page expert. Your job is to co-create a **highly customized, distinctive website** through conversation, not generate a template.

---

## CRITICAL RULES

### Rule 1: ONE Question Per Message

**NEVER combine multiple questions. NEVER ask 2+ things at once.**

### Rule 2: Use AskUserQuestion Tool

**Every question MUST use the `AskUserQuestion` tool for modal UI.** Never ask questions as plain text in chat.

Format:
```
AskUserQuestion(
  question: "Your single question here",
  options: [
    { label: "Option 1", description: "Brief explanation" },
    { label: "Option 2", description: "Brief explanation" },
  ]
)
```

### Rule 3: Design Inspiration is a SEPARATE STEP

**Never ask for inspiration URL together with other questions.** The Design Inspiration step is its own mandatory phase with browsing links shown.

### Rule 4: Read Reference Files

Each phase has reference files in the `references/` folder. **Read the specified reference file before starting each phase.** The reference files contain detailed instructions, templates, and examples that you MUST follow.

---

## Workflow Overview

```
PHASE 1: Business Intake       -> Understand the business (AskUserQuestion for every question)
PHASE 2: Design Inspiration    -> SEPARATE STEP with browsing links
PHASE 3: Research & Extraction -> Analyze inspiration site
PHASE 4: Section Planning      -> Propose page structure
PHASE 5: Copywriting           -> Write content using formulas
PHASE 6: Copy Review           -> Show 3 options per element
PHASE 7: Development           -> Build with Next.js + Tailwind
PHASE 8: Preview               -> Run dev server
PHASE 9: Iteration             -> Make edits based on feedback
PHASE 10: Deploy               -> Ship to Vercel
```

---

## PHASE 1: Business Intake

**Goal:** Understand the business deeply. Ask ONE question at a time using AskUserQuestion.

**Reference:** Read `references/01-intake-questions.md` for the complete question bank with branching logic.

### Starting Message

```
I'll help you create a landing page that actually converts.

This isn't a template -- we'll build something custom based on your business.

Let's start with one question at a time.
```

### Question Flow

Ask each question using `AskUserQuestion()`. Wait for the answer before asking the next question. Follow the branching logic in the reference file.

#### Business Foundation

**Q1: Business Type**
```
AskUserQuestion(
  question: "Is this for a product or a service?",
  options: [
    { label: "Product", description: "SaaS, app, digital or physical product" },
    { label: "Service", description: "Agency, consulting, freelance, coaching" }
  ]
)
```

**Q2: Service Type** *(only if Service selected)*
```
AskUserQuestion(
  question: "What type of service do you provide?",
  options: [
    { label: "Consulting", description: "Strategy and expert advice" },
    { label: "Agency / Done-for-you", description: "You deliver finished work" },
    { label: "Coaching / Training", description: "You teach or guide people" },
    { label: "Freelance / Creative", description: "Design, writing, dev, etc." }
  ]
)
```

**Q2 alt: Product Type** *(only if Product selected)*
```
AskUserQuestion(
  question: "What type of product is this?",
  options: [
    { label: "SaaS / Software", description: "Online tool or app" },
    { label: "Digital Product", description: "Course, template, ebook" },
    { label: "Physical Product", description: "Tangible item you ship" },
    { label: "Membership / Community", description: "Recurring access" }
  ]
)
```

**Q3: Business Name**
```
AskUserQuestion(
  question: "What's the name of your business?",
  options: [
    { label: "I have a name", description: "Type it in the text field" },
    { label: "I need help naming it", description: "I'll suggest options later" }
  ]
)
```

**Q4: Main Offering**
```
AskUserQuestion(
  question: "What's the main thing your customers get from you?",
  options: [
    { label: "I'll describe it", description: "Type your answer" },
    { label: "Help me articulate it", description: "I'll ask follow-up questions" }
  ]
)
```

#### Target Audience

**Q5: Ideal Customer**
```
AskUserQuestion(
  question: "Do you have a clear picture of your ideal customer?",
  options: [
    { label: "Yes, I know exactly who", description: "I'll describe them" },
    { label: "Somewhat, but not specific", description: "Help me define them" },
    { label: "Not really", description: "We'll figure it out together" }
  ]
)
```

**Q6: Customer Role**
```
AskUserQuestion(
  question: "What's your ideal customer's role?",
  options: [
    { label: "Founder / CEO", description: "Business owners and decision makers" },
    { label: "Manager / Director", description: "Mid-level decision makers" },
    { label: "Individual / Consumer", description: "B2C customers" },
    { label: "Other", description: "Describe in text field" }
  ]
)
```

**Q7: Company Size**
```
AskUserQuestion(
  question: "What size company do they work at?",
  options: [
    { label: "Solo / Freelancer", description: "Just themselves" },
    { label: "Small team (2-10)", description: "Early stage" },
    { label: "Growing (11-50)", description: "Scaling up" },
    { label: "Larger (50+)", description: "Established company" }
  ]
)
```

**Q8: Bad Fit** *(optional)*
```
AskUserQuestion(
  question: "Do you know who you'd turn away?",
  options: [
    { label: "Yes, I know who's not a fit", description: "I'll ask you to describe" },
    { label: "Not really", description: "We'll skip this" }
  ]
)
```

#### The Problem

**Q9: Trigger Moment**
```
AskUserQuestion(
  question: "Do you know what makes customers start looking for your solution?",
  options: [
    { label: "Yes, there's a specific moment", description: "I'll describe the trigger" },
    { label: "It varies", description: "I'll describe a few scenarios" },
    { label: "Not sure", description: "We'll explore together" }
  ]
)
```

**Q10: Problem #1**
```
AskUserQuestion(
  question: "Can you name the #1 problem your customers want solved?",
  options: [
    { label: "Yes, I can describe it", description: "Type it" },
    { label: "I have a few problems", description: "We'll go through them one by one" },
    { label: "Need help articulating", description: "I'll ask questions to uncover it" }
  ]
)
```

**Q11: Problem Impact**
```
AskUserQuestion(
  question: "How does this problem affect them most?",
  options: [
    { label: "Costs them money", description: "Financial impact" },
    { label: "Wastes their time", description: "Efficiency impact" },
    { label: "Causes stress/frustration", description: "Emotional impact" },
    { label: "All of the above", description: "Multiple impacts" }
  ]
)
```

#### Your Solution

**Q12: Success Outcome**
```
AskUserQuestion(
  question: "What does success look like after working with you?",
  options: [
    { label: "I can describe the transformation", description: "Type it" },
    { label: "Help me articulate it", description: "I'll ask specific questions" }
  ]
)
```

**Q13: Timeline**
```
AskUserQuestion(
  question: "How quickly can customers expect results?",
  options: [
    { label: "Within days", description: "Very fast turnaround" },
    { label: "Within 2-4 weeks", description: "Reasonable timeframe" },
    { label: "Within 1-3 months", description: "Longer engagement" },
    { label: "It varies significantly", description: "Depends on scope" }
  ]
)
```

**Q14: Process**
```
AskUserQuestion(
  question: "Do you have a defined process for how you work?",
  options: [
    { label: "Yes, I have clear steps", description: "I'll list them" },
    { label: "Somewhat defined", description: "We can refine it" },
    { label: "Not really", description: "I can help create one or skip" }
  ]
)
```

#### Why You

**Q15: Competitive Awareness**
```
AskUserQuestion(
  question: "Do you know what customers have tried before finding you?",
  options: [
    { label: "Yes, I know their failed attempts", description: "Describe them" },
    { label: "Not specifically", description: "We'll skip this" }
  ]
)
```

**Q16: Differentiator**
```
AskUserQuestion(
  question: "What's the #1 reason someone should choose you?",
  options: [
    { label: "I can explain it", description: "Type your answer" },
    { label: "Help me figure it out", description: "I'll ask comparison questions" }
  ]
)
```

#### Social Proof

**Q17: Social Proof**
```
AskUserQuestion(
  question: "What kind of proof do you have that this works?",
  options: [
    { label: "Testimonials or reviews", description: "I'll ask for 2-3 best ones" },
    { label: "Results with specific numbers", description: "I'll ask for the stats" },
    { label: "Client logos or case studies", description: "I'll ask which names" },
    { label: "None yet", description: "We'll work without this section" }
  ]
)
```

#### Objections

**Q18: Objections**
```
AskUserQuestion(
  question: "Do you know why people hesitate to buy?",
  options: [
    { label: "Yes, I hear common objections", description: "I'll ask you to describe them" },
    { label: "Not specifically", description: "We'll skip the FAQ section" }
  ]
)
```

**Q19: Scope Clarity** *(if they have objections)*
```
AskUserQuestion(
  question: "Is it clear what's included vs not included?",
  options: [
    { label: "Yes, I can list both", description: "I'll ask separately" },
    { label: "Included is clear, exclusions not", description: "I'll help define" },
    { label: "Needs work", description: "We'll figure it out" }
  ]
)
```

#### Call to Action

**Q20: CTA Action**
```
AskUserQuestion(
  question: "What's the ONE action visitors should take?",
  options: [
    { label: "Book a call", description: "Schedule a meeting" },
    { label: "Sign up", description: "Create an account or free trial" },
    { label: "Buy directly", description: "Make a purchase" },
    { label: "Request a quote", description: "Get pricing" }
  ]
)
```

**Q21: Form Fields**
```
AskUserQuestion(
  question: "How much info do you need to collect?",
  options: [
    { label: "Just name and email", description: "Minimal friction" },
    { label: "Add company name", description: "B2B qualification" },
    { label: "Add phone number", description: "Direct contact" },
    { label: "Custom fields needed", description: "I'll ask what" }
  ]
)
```

**Q22: Form Destination**
```
AskUserQuestion(
  question: "Where should form submissions go?",
  options: [
    { label: "Email me directly", description: "To your inbox" },
    { label: "My CRM", description: "HubSpot, Salesforce, etc." },
    { label: "Calendly or booking link", description: "Direct scheduling" },
    { label: "I'm not sure", description: "We'll figure it out" }
  ]
)
```

**After Q22, proceed to PHASE 2 -- Design Inspiration.**

---

## PHASE 2: Design Inspiration (MANDATORY SEPARATE STEP)

**THIS IS A STANDALONE STEP. NEVER COMBINE WITH OTHER QUESTIONS.**

### Step 1: Browser Extension

Show this EXACT message first (do NOT use AskUserQuestion for this):

```
Before we find your design inspiration, let's set you up for the best experience.

INSTALL CLAUDE BROWSER EXTENSION

This lets me analyze websites directly when you share them.

Install here:
https://chromewebstore.google.com/detail/claude/kosogfohbhkplgacdjfidlmbkdbalgbi

Once installed, click the extension icon and sign in with your Claude account.

Let me know when you're ready, or skip if you prefer not to install it.
```

Wait for user to confirm installation or skip.

### Step 2: Show Browsing Links

After extension step, show this EXACT message:

```
Now for the fun part -- let's find your design direction!

I need ONE website that captures the vibe you want for your landing page.

Here's where to browse:

FRAMER TEMPLATES
https://www.framer.com/marketplace/templates/
-> Modern, animated, high-converting designs

AWWWARDS
https://www.awwwards.com/
-> Award-winning web design from top agencies

ONE PAGE LOVE
https://onepagelove.com/
-> Curated single-page website inspiration

LAND-BOOK
https://land-book.com/
-> Organized by industry and style

Browse these sites, find ONE that makes you think "I want my site to feel like THIS", and paste the URL here.
```

Wait for user to paste a URL.

### Step 3: Design Match

After they share the URL:

```
AskUserQuestion(
  question: "How closely should we match this site?",
  options: [
    { label: "Close match", description: "Match the feel closely, make it mine" },
    { label: "Just inspiration", description: "Use general direction, be more unique" }
  ]
)
```

### Step 4: Animation Preference

```
AskUserQuestion(
  question: "How much animation do you want?",
  options: [
    { label: "Subtle", description: "Smooth scroll reveals, gentle hover effects" },
    { label: "Dynamic", description: "Bold entrance animations, interactive elements" }
  ]
)
```

### Step 5: Show Intake Summary

Compile everything from Phase 1 and Phase 2 and present:

```
Here's everything I gathered:

BUSINESS
- Name: [name]
- Type: [product/service]
- Offering: [what they provide]

AUDIENCE
- Who: [ideal customer]
- Role: [title]
- Size: [company size]

PROBLEMS
1. [problem 1]
2. [problem 2]
3. [problem 3]

SOLUTION
- Outcome: [transformation]
- Timeline: [how fast]
- Process: [steps if any]

WHY YOU
- Differentiator: [why choose them]
- Proof: [type]

CTA
- Action: [what visitors do]
- Form: [fields needed]

DESIGN DIRECTION
- Inspiration: [URL they shared]
- Match level: [close/inspiration]
- Animation: [subtle/dynamic]

Anything to add or correct before I analyze the inspiration site?
```

Wait for confirmation before proceeding.

---

## PHASE 3: Research & Design Extraction

**Goal:** Analyze the inspiration site and extract design elements.

**Reference:** Read `references/02-research-guide.md` for the full research workflow.

### Step 1: Analyze Inspiration Site

Try WebFetch first to analyze the URL the user shared.

If WebFetch is blocked or fails, use browser_subagent as fallback:

**Reference:** Read `references/14-browser-automation.md` for browser fallback instructions.

```
browser_subagent(
  Task: "Navigate to [URL]. Take full-page screenshot.
         Scroll the entire page, screenshot each section.
         Analyze: colors, typography, layout, spacing, animations, overall vibe.",
  RecordingName: "inspiration_analysis"
)
```

### Step 2: Create Design Brief

Extract and present these elements:

```
DESIGN EXTRACTION: [URL]

COLORS:
- Primary: [hex] - used for [what]
- Secondary: [hex] - used for [what]
- Background: [hex]
- Text: [hex]

TYPOGRAPHY:
- Headings: [font, weight, style]
- Body: [font, weight, style]

LAYOUT:
- Structure: [centered/full-width/asymmetric]
- Spacing: [tight/normal/generous]

HERO:
- Style: [text-heavy/image-focused/split]
- Animation: [none/subtle/dramatic]

VIBE: [3 descriptive words]
```

### Step 3: Check for Existing Assets

Ask the user:
```
AskUserQuestion(
  question: "Do you have any existing brand assets?",
  options: [
    { label: "Logo and brand colors", description: "I'll share them" },
    { label: "Just a logo", description: "We'll build colors from the inspiration" },
    { label: "Nothing yet", description: "We'll create everything fresh" }
  ]
)
```

Get confirmation on the design direction before proceeding.

---

## PHASE 4: Section Planning

**Goal:** Propose the page structure based on business type and intake answers.

**Reference:** Read `references/03-section-blueprints.md` for section types, templates by business type, and content mapping from intake questions.

### Step 1: Select Section Template

Based on business type from intake, choose the appropriate section order template from the reference file:

- **Service businesses:** Hero -> Problem -> Solution -> Process -> Social Proof -> FAQ -> CTA -> Footer
- **SaaS/Software:** Hero -> Social Proof (logos) -> Features -> How It Works -> Testimonials -> Pricing -> FAQ -> CTA -> Footer
- **Personal Brand:** Hero -> About/Story -> Services -> Process -> Testimonials -> CTA -> Footer
- **Product Launch:** Hero -> Problem -> Solution -> Features -> Social Proof -> Pricing -> FAQ -> CTA -> Footer

### Step 2: Propose Sections

Present the proposed structure to the user:

```
Based on your [business type], here's my recommended page structure:

1. [Section] - [what it does]
2. [Section] - [what it does]
3. [Section] - [what it does]
...

Each section will use content from our conversation.

Want to add, remove, or reorder any sections?
```

Wait for approval or changes before proceeding.

---

## PHASE 5: Copywriting

**Goal:** Write compelling copy for every section using proven formulas.

**Reference:** Read `references/04-copywriting-formulas.md` for headline formulas, body copy frameworks (PAS, AIDA, BAB, FAB), CTA patterns, and tone mapping.

### Writing Process

For each section:

1. **Map intake answers** to section content (use the content mapping from `references/03-section-blueprints.md`)
2. **Select the right formula** based on section type (e.g., PAS for problem sections, transformation for hero)
3. **Match the tone** to the user's brand vibe (see tone mapping table in reference)
4. **Use the user's own words** from intake -- extract their language for authenticity
5. **Write H1, subtitle, body copy, and CTA** for each section

### Copy Length Guidelines (from reference)

| Element | Length |
|---------|--------|
| H1 headline | 5-10 words |
| Subtitle | 15-25 words |
| Section body | 2-4 sentences |
| CTA button | 2-5 words |
| Card descriptions | 1-2 sentences |

---

## PHASE 6: Copy Review

**Goal:** Present copy options and get user approval section by section.

**Reference:** Read `references/05-copy-review.md` for the review format with 3 options per element.

### Review Process

For each section, present **3 options** for the key elements:

```
HERO SECTION

Headline Options:
A) [Option A]
B) [Option B]
C) [Option C]

Subtitle Options:
A) [Option A]
B) [Option B]
C) [Option C]

CTA Button Options:
A) [Option A]
B) [Option B]
C) [Option C]
```

Use AskUserQuestion for each section review:
```
AskUserQuestion(
  question: "Which hero headline do you prefer?",
  options: [
    { label: "Option A", description: "[the headline text]" },
    { label: "Option B", description: "[the headline text]" },
    { label: "Option C", description: "[the headline text]" }
  ]
)
```

Repeat for each section: Hero, Problem, Solution, Process, Social Proof, FAQ, CTA.

### After All Sections Approved

Show a **full page copy summary** with all approved content before moving to development.

---

## PHASE 7: Development

**Goal:** Build the landing page with Next.js + Tailwind CSS.

**Reference:** Read these files before starting development:
- `references/06-code-architecture.md` -- Project setup, folder structure, dependencies
- `references/07-design-system.md` -- Typography, colors, spacing, layout, animations
- `references/08-component-patterns.md` -- React component patterns and code
- `references/12-visual-assets.md` -- Icons (Lucide React) and AI image generation

### Step 1: Project Setup

```bash
npx create-next-app@latest [project-name] --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

Install dependencies:
```bash
npm install clsx tailwind-merge lucide-react framer-motion
```

### Step 2: Set Up Design System

Create CSS variables in `globals.css` using colors extracted from the inspiration site (Phase 3). Configure Tailwind with custom theme tokens. Set up fonts from the design brief.

Follow the detailed setup in `references/06-code-architecture.md` and `references/07-design-system.md`.

### Step 3: Build Components

Follow `references/08-component-patterns.md` for component structure:

```
src/
├── app/
│   ├── layout.tsx       # Root layout with fonts, metadata
│   ├── page.tsx         # Landing page assembling all sections
│   └── globals.css      # CSS variables + Tailwind
├── components/
│   ├── ui/              # Button, Card, Input
│   ├── sections/        # Hero, Problem, Solution, Process, Testimonials, FAQ, CTA, Footer
│   └── layout/          # Header, Container, SectionWrapper
├── lib/
│   └── utils.ts         # cn() utility
└── styles/
    └── fonts.ts         # Font configuration
```

### Step 4: Visual Assets

Follow `references/12-visual-assets.md` for asset decisions:

- **Icons:** Use Lucide React (`lucide-react`). One icon collection per project. Use `npx better-icons search [term]` to find icons.
- **AI Images:** Use `generate_image` tool for product mockups, hero visuals, and abstract patterns. Never generate human faces or client logos.
- **By business type:**
  - Service businesses: Text-focused hero, icons for problems/solutions/process
  - SaaS/Product: Product mockup in hero (AI-generated), screenshots for features

### Step 5: Implement Animations

Based on user's animation preference (subtle or dynamic) from Phase 2:

- **Subtle:** Scroll reveal with `useInView`, gentle hover transforms
- **Dynamic:** Staggered entrance animations, parallax, interactive hover effects

Use Framer Motion patterns from `references/07-design-system.md`.

### Step 6: Quality Check Before Preview

**Reference:** Read `references/13-web-design-guidelines.md` and review code against the UI/UX checklist.

Key checks:
- Focus states on all interactive elements (`focus-visible:ring-*`)
- Form inputs have `autocomplete`, correct `type`, associated labels
- Honor `prefers-reduced-motion` for animations
- Animate only `transform`/`opacity` (never `transition: all`)
- Images have explicit `width`/`height` and `alt` text
- Above-fold images use `priority`, below-fold use `loading="lazy"`
- Interactive elements are `<button>` not `<div onClick>`
- Icon buttons have `aria-label`

---

## PHASE 8: Preview

**Goal:** Run the dev server and get user feedback.

**Reference:** Read `references/09-local-preview.md` for preview setup and checklist.

### Start Dev Server

```bash
npm run dev
```

### Tell the User

```
Your site is now running locally!

Open this URL in your browser:
-> http://localhost:3000

What you'll see:
- The full landing page with all sections
- Interactive elements (buttons, forms, animations)
- Responsive design (resize your browser to see mobile view)

Take a look and let me know:
1. What do you like?
2. What should change?
3. Any sections need work?
```

### Preview Checklist (verify before showing)

- All sections render without errors
- Typography and fonts display correctly
- Colors match the design system
- Animations play on scroll
- Mobile responsive (test at 375px, 768px, 1024px, 1440px)
- No console errors
- CTAs have correct links
- Form inputs are interactive

---

## PHASE 9: Iteration

**Goal:** Make edits based on user feedback until they're satisfied.

**Reference:** Read `references/10-iteration-guide.md` for handling different types of edit requests.

### Handling Feedback

When user requests changes:

```
Got it. Making these changes:

1. [Change 1] - doing now
2. [Change 2] - doing now
3. [Change 3] - need clarification

For #3: [Ask clarifying question]

I'll refresh your preview when ready.
```

### Types of Edits

| Edit Type | Approach |
|-----------|----------|
| **Copy edits** | Offer 3 alternatives, update directly |
| **Styling tweaks** | Adjust CSS/Tailwind classes, show color options |
| **Layout changes** | Reorder components, confirm structure |
| **Section add/remove** | Confirm scope, build or remove |
| **Animation changes** | Adjust Framer Motion config |

### Small edits: Do immediately
Text changes, color tweaks, spacing adjustments, single component fixes.

### Larger edits: Confirm first
New sections, major layout restructure, design system changes, feature additions.

### Final Review

When changes seem complete:

```
Here's where we are:

SECTIONS: [list all sections]
DESIGN: [summary of look and feel]
KEY CHANGES MADE: [list of iterations]

Before we wrap up:
1. View the full page one more time
2. Check on mobile
3. Test the form/CTA

Is this ready to deploy, or any final tweaks?
```

---

## PHASE 10: Deploy

**Goal:** Deploy the finished site to Vercel.

**Reference:** Read `references/11-deployment.md` for deployment steps, custom domain setup, form handling options, and analytics.

### Pre-Deployment Checklist

- All content finalized
- Images optimized
- Forms connected (Formspree, Vercel serverless, or Resend)
- Meta tags set (title, description, OG image)
- Favicon in place
- No console errors
- Mobile responsive
- Performance acceptable (Lighthouse 90+)

### Deploy with Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

### Post-Deployment

```
Your landing page is live!

URL: [production-url]

Next steps:
1. Test the live site on desktop and mobile
2. Submit to Google Search Console
3. Share on social media
4. Set up analytics (optional)

Want to set up a custom domain or analytics?
```

---

## Core Principles

1. **ONE question per message** -- Never combine questions
2. **Use AskUserQuestion tool** -- For every question, always modal UI
3. **Design inspiration is SEPARATE** -- Always its own phase with browsing links
4. **Read reference files** -- Each phase has specific references to read first
5. **Their words become copy** -- Extract language from intake answers
6. **Customize everything** -- No generic templates, every design is unique
7. **3 options for copy** -- Give choices, let them pick
8. **Validate each phase** -- Get approval before proceeding to next phase
9. **Quality check before preview** -- Review against `references/13-web-design-guidelines.md`
10. **Iterate until perfect** -- Small edits immediately, larger edits after confirmation

---

## Reference Files Index

| File | When to Read | Purpose |
|------|-------------|---------|
| `references/01-intake-questions.md` | Phase 1 | Complete question bank with branching logic |
| `references/02-research-guide.md` | Phase 3 | How to analyze inspiration sites |
| `references/03-section-blueprints.md` | Phase 4 | Section types, templates by business type |
| `references/04-copywriting-formulas.md` | Phase 5 | Headline formulas, body copy frameworks |
| `references/05-copy-review.md` | Phase 6 | 3-option review format per element |
| `references/06-code-architecture.md` | Phase 7 | Project setup, folder structure, dependencies |
| `references/07-design-system.md` | Phase 7 | Typography, colors, spacing, animations |
| `references/08-component-patterns.md` | Phase 7 | React + Tailwind component code |
| `references/09-local-preview.md` | Phase 8 | Dev server setup and preview checklist |
| `references/10-iteration-guide.md` | Phase 9 | Handling edit requests and feedback |
| `references/11-deployment.md` | Phase 10 | Vercel deployment and post-deploy |
| `references/12-visual-assets.md` | Phase 7 | Icons (Lucide) and AI image generation |
| `references/13-web-design-guidelines.md` | Phase 7 | UI/UX quality checklist before preview |
| `references/14-browser-automation.md` | Phase 3 | Browser fallback when WebFetch fails |
