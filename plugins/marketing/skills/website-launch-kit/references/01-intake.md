# Phase 1: Intake (10 Questions)

Ask ONE question at a time. Wait for the answer before asking the next.

**CRITICAL RULE: When to use `AskUserQuestion` vs plain text.**

Use `AskUserQuestion` ONLY when:
- The question has clear, finite choices (e.g., "SaaS or Agency?", "Close match or just inspiration?")
- The user picks a label and that's the complete answer — no follow-up typing needed

Use **plain text** (just output the question and wait) when:
- The user needs to type something (a name, a description, a URL, etc.)
- An option says "type in the text field" or "I'll describe it" — this means the question should NOT be `AskUserQuestion` in the first place

**NEVER re-ask a question.** If the user's response gives you the answer (even partially), accept it and move on. If they say "I have a name" or "yes I'll type it", that means they're about to type — just wait silently. Do NOT fire another `AskUserQuestion` or rephrase the question.

---

## Questions

### Q1: Business Type

Use `AskUserQuestion` — this has clear finite choices:

```
AskUserQuestion(
  question: "What's your business type?",
  options: [
    { label: "SaaS / Software", description: "Online tool or app" },
    { label: "Agency / Done-for-you", description: "You deliver finished work for clients" },
    { label: "Consulting / Coaching", description: "Expert guidance and strategy" },
    { label: "Digital Product", description: "Course, template, ebook" },
    { label: "Physical Product", description: "Tangible item you ship" },
    { label: "Other", description: "I'll type it below" }
  ]
)
```

If the user picks "Other", just wait for them to type. Do not ask again.

### Q2: Business Name

**Plain text** — the user needs to type a name:

```
What's the name of your business? (If you don't have one yet, I can suggest some later.)
```

Wait for the user to type. Accept whatever they give you.

### Q3: What You Offer

**Plain text** — the user needs to describe their offer:

```
In one sentence, what do your customers get from you?
```

Wait for the user to type.

### Q4: Ideal Customer

Use `AskUserQuestion` — this has clear finite choices:

```
AskUserQuestion(
  question: "Who is your ideal customer?",
  options: [
    { label: "Founders / CEOs", description: "Business owners making decisions" },
    { label: "Marketing teams", description: "Growth and marketing professionals" },
    { label: "Developers / Technical", description: "Engineers and technical buyers" },
    { label: "Small business owners", description: "Local or small businesses" },
    { label: "Consumers (B2C)", description: "Individual buyers" },
    { label: "Other", description: "I'll type it below" }
  ]
)
```

If the user picks "Other", just wait for them to type. Do not ask again.

### Q5: #1 Problem You Solve

**Plain text** — the user needs to describe their value:

```
What's the #1 problem you solve for customers?
```

Wait for the user to type. If they struggle, offer to help articulate it with a follow-up — but only if they ask.

### Q6: Social Proof

Use `AskUserQuestion` — this has clear finite choices:

```
AskUserQuestion(
  question: "What proof do you have that this works?",
  options: [
    { label: "Testimonials or reviews", description: "Quotes from happy customers" },
    { label: "Results with numbers", description: "Metrics, ROI, percentages" },
    { label: "Client logos or case studies", description: "Recognizable names" },
    { label: "None yet", description: "We'll skip social proof for now" }
  ]
)
```

If they pick testimonials/results/logos, just wait for them to share the details. Do not ask "can you share them?" — they will.

### Q7: Primary CTA

Use `AskUserQuestion` — this has clear finite choices:

```
AskUserQuestion(
  question: "What's the ONE action visitors should take?",
  options: [
    { label: "Book a call", description: "Schedule a meeting or consultation" },
    { label: "Sign up / Free trial", description: "Create an account" },
    { label: "Buy / Purchase", description: "Direct purchase" },
    { label: "Join waitlist", description: "Email capture for upcoming launch" }
  ]
)
```

### Q8: Inspiration URL

**Plain text** — the user needs to paste a URL:

```
Now for the most important part — your design direction.

I need ONE website that captures the vibe you want. This is what I'll clone to give you a head start.

Browse here:
- FRAMER TEMPLATES: https://www.framer.com/marketplace/templates/
- AWWWARDS: https://www.awwwards.com/
- ONE PAGE LOVE: https://onepagelove.com/
- LAND-BOOK: https://land-book.com/

Find ONE that makes you think "I want my site to feel like THIS" and paste the URL here.
```

Wait for the user to paste a URL.

### Q9: Match Level

Use `AskUserQuestion` — this has clear finite choices:

```
AskUserQuestion(
  question: "How closely should we match this site?",
  options: [
    { label: "Close match", description: "Reproduce the layout and feel, make it mine" },
    { label: "Just inspiration", description: "Use the general direction, be more unique" }
  ]
)
```

### Q10: Brand Identity

Use `AskUserQuestion` — this has clear finite choices:

```
AskUserQuestion(
  question: "Tell me about your brand identity.",
  options: [
    { label: "I have colors + logo", description: "I'll share them next" },
    { label: "Just a logo", description: "We'll pull colors from the inspiration site" },
    { label: "Nothing yet", description: "We'll create everything from the inspiration" }
  ]
)
```

If they pick "I have colors + logo", just wait for them to share. Do not ask "can you share them?" — they will.

---

## Intake Summary Template

After Q10, present this summary and get confirmation before proceeding to Phase 2.

```
Here's what I've gathered:

BUSINESS
- Type: [Q1]
- Name: [Q2]
- Offering: [Q3]

AUDIENCE
- Ideal customer: [Q4]
- Problem solved: [Q5]

PROOF & CTA
- Social proof: [Q6]
- Primary action: [Q7]

DESIGN DIRECTION
- Inspiration: [Q8 URL]
- Match level: [Q9]
- Brand identity: [Q10]

Anything to add or correct before I clone the inspiration site?
```

Wait for confirmation before proceeding to Phase 2.
