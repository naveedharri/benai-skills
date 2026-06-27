# Phase 3: Deep Discovery (Consolidated)

Gather all the content you need to rewrite every section — in ONE message, not individual questions.

---

## How It Works

### Step 1: Analyze the Cloned Site's Sections

Look at the sections you built in Phase 2. For each section, determine what content needs to be replaced with the user's real information.

### Step 2: Use Phase 1 Context

The user's answers to Q1-Q7 tell you:
- What type of business (Q1) — shapes what questions are relevant
- What they offer (Q3) — shapes how specific you can be
- Who their customer is (Q4) — shapes the angle of questions
- What problem they solve (Q5) — shapes depth of pain-point questions
- What proof they have (Q6) — shapes social proof questions
- What CTA they want (Q7) — shapes conversion questions

### Step 3: Build ONE Consolidated Discovery Form

Generate a single message that lists every section on the cloned site and what info you need for each. Reference the user's own words from Phase 1 — not generic templates.

**Present this as ONE `AskUserQuestion`** so the user can answer everything in a single response.

---

## The Consolidated Form

After the user confirms the clone looks good, present this (adapted to the actual sections on the cloned site and the user's Phase 1 answers):

```
AskUserQuestion(
  question: "I need your real content to replace the placeholder copy. Here's what I need for each section — answer what you can, skip what you're unsure about:\n\n**HERO**\nYou said you help [Q4 answer] with [Q3 answer]. What's the single biggest transformation a client experiences after working with you? (This becomes your headline)\n\n**FEATURES / SERVICES**\nWhat are your top 3-4 specific [services/features/capabilities]? For each, what's the benefit to [Q4 answer]?\n\n**SOCIAL PROOF**\n[If Q6 = testimonials] Paste 2-3 of your best testimonials (include name + role). Any specific numbers/results?\n[If Q6 = logos] Which client logos can we display?\n[If Q6 = none] Skip this — we'll handle it later.\n\n**PROCESS / HOW IT WORKS**\nWalk me through what happens after someone [Q7 answer]. How many steps? What's the timeline?\n\n**FAQ**\nWhat are the top 3 questions or objections prospects ask before buying?\n\n**CTA / CONTACT**\nWhat form fields do you need? (name, email, company, phone, message?) Where should submissions go? (email, CRM, Calendly?) Any urgency element? (limited spots, deadline, offer?)",
  options: [
    { label: "I'll answer everything", description: "Type your answers in the text field" },
    { label: "I'll answer what I can", description: "Skip sections you're unsure about — I'll help fill gaps" }
  ]
)
```

**IMPORTANT:** This is a template. You MUST adapt it:
1. **Only include sections that exist on the cloned site** — if there's no pricing section, don't ask about pricing
2. **Reference the user's Phase 1 answers** — use their actual words, not generic placeholders
3. **Skip what you already know** — don't re-ask Q1-Q7 content
4. **Add sections if the clone has unique ones** — e.g., if there's a "partners" or "integrations" section, ask about that too

---

## Question Types by Section (Reference)

Use these to craft the right questions for each section in your consolidated form:

### Hero Section
- Biggest result/transformation a client gets (for headline)
- How their dream client would describe what they do in one sentence (for subtitle)

### Features / Services
- Top 3-4 specific capabilities/services/features
- For each: benefit to the customer (not just the feature)

### Problem / Pain
- What's happening before they look for this solution
- What they've tried before that didn't work
- Cost of NOT solving this problem

### Testimonials / Social Proof
- 2-3 best testimonials with name and role
- Specific numbers or results (e.g., "3x revenue", "$50K saved")
- Client logos to display

### Process / How It Works
- What happens after someone signs up / books a call / buys
- Number of steps and timeline

### Pricing
- Tiers/packages and what's included
- Which tier to highlight as recommended

### FAQ
- Top 3 questions or objections before buying
- Concerns about price, timeline, or results

### CTA / Contact
- Required form fields
- Where submissions go (email, CRM, Calendly)
- Urgency elements (limited spots, deadline, offer)

---

## After the User Responds

1. **Parse their response** — extract content for each section
2. **Fill gaps** — if they skipped sections, use Phase 1 context to draft placeholder copy (mark it clearly as draft)
3. **Present a content summary:**

```
Great — I now have everything I need to customize your site. Here's what I'll be writing:

HERO: [headline angle based on their transformation]
[SECTION]: [what content goes here]
[SECTION]: [what content goes here]
...

Ready to start customizing? I'll go section by section, showing you 3 options for each headline.
```

4. Wait for confirmation before proceeding to Phase 4.
