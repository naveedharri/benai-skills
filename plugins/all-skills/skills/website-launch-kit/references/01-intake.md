# Phase 1: Intake (10 Questions)

Ask ONE question at a time using `AskUserQuestion`. Wait for the answer before asking the next.

---

## Questions

### Q1: Business Type

```
AskUserQuestion(
  question: "What's your business type?",
  options: [
    { label: "SaaS / Software", description: "Online tool or app" },
    { label: "Agency / Done-for-you", description: "You deliver finished work for clients" },
    { label: "Consulting / Coaching", description: "Expert guidance and strategy" },
    { label: "Digital Product", description: "Course, template, ebook" },
    { label: "Physical Product", description: "Tangible item you ship" },
    { label: "Other", description: "Describe in text field" }
  ]
)
```

### Q2: Business Name

```
AskUserQuestion(
  question: "What's the name of your business?",
  options: [
    { label: "I have a name", description: "Type it in the text field" },
    { label: "I need help naming it", description: "I'll suggest options later" }
  ]
)
```

### Q3: What You Offer

```
AskUserQuestion(
  question: "In one sentence, what do your customers get from you?",
  options: [
    { label: "I'll describe it", description: "Type your answer in the text field" }
  ]
)
```

### Q4: Ideal Customer

```
AskUserQuestion(
  question: "Who is your ideal customer?",
  options: [
    { label: "Founders / CEOs", description: "Business owners making decisions" },
    { label: "Marketing teams", description: "Growth and marketing professionals" },
    { label: "Developers / Technical", description: "Engineers and technical buyers" },
    { label: "Small business owners", description: "Local or small businesses" },
    { label: "Consumers (B2C)", description: "Individual buyers" },
    { label: "Other", description: "Describe in text field" }
  ]
)
```

### Q5: #1 Problem You Solve

```
AskUserQuestion(
  question: "What's the #1 problem you solve for customers?",
  options: [
    { label: "I can describe it", description: "Type your answer" },
    { label: "Help me articulate it", description: "I'll ask a follow-up" }
  ]
)
```

### Q6: Social Proof

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

### Q7: Primary CTA

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

Show this message (NOT as AskUserQuestion):

```
Now for the most important part — your design direction.

I need ONE website that captures the vibe you want. This is what I'll clone to give you a head start.

Browse here:
• FRAMER TEMPLATES: https://www.framer.com/marketplace/templates/
• AWWWARDS: https://www.awwwards.com/
• ONE PAGE LOVE: https://onepagelove.com/
• LAND-BOOK: https://land-book.com/

Find ONE that makes you think "I want my site to feel like THIS" and paste the URL here.
```

Wait for the user to paste a URL.

### Q9: Match Level

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

```
AskUserQuestion(
  question: "Tell me about your brand identity.",
  options: [
    { label: "I have colors + logo", description: "I'll share them" },
    { label: "Just a logo", description: "We'll pull colors from the inspiration site" },
    { label: "Nothing yet", description: "We'll create everything from the inspiration" },
    { label: "Tone preference only", description: "Professional / Bold / Friendly / Premium — type in text field" }
  ]
)
```

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
