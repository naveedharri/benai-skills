# Iteration Guide

How to handle edit requests and iterate on the landing page.

## After Preview: Gathering Feedback

Once user has seen the site:

```
"You've seen the first version. Let's make it perfect.

Tell me what you'd like to change:
- Copy edits (headlines, descriptions, CTAs)
- Design tweaks (colors, spacing, fonts)
- Layout changes (section order, structure)
- Add/remove sections
- Animation adjustments
- Mobile-specific fixes

What stands out as needing work?"
```

---

## Types of Edits

### 1. Copy Edits

Quick text changes:

```
User: "The hero headline doesn't feel right"

Response:
"Let me give you 3 new options:

A) [Alternative 1]
B) [Alternative 2]
C) [Alternative 3]

Or tell me the direction you want."
```

Then update the code directly.

### 2. Styling Tweaks

Visual adjustments:

| User Says | Action |
|-----------|--------|
| "Make it bolder" | Increase font weight, stronger colors |
| "More breathing room" | Increase section padding |
| "Feels too corporate" | Softer colors, rounded corners |
| "Needs more energy" | Add animations, brighter accents |
| "Too busy" | Reduce elements, more whitespace |

```
User: "The colors feel too muted"

Response:
"I'll increase the saturation. Here are options:

Current: #6B7280
Option A: #4F46E5 (more vibrant blue)
Option B: #7C3AED (purple accent)
Option C: #0EA5E9 (bright cyan)

Which direction?"
```

### 3. Layout Changes

Structural modifications:

```
User: "Can we swap the problem and solution sections?"

Response:
"Done. The flow is now:
1. Hero
2. Solution (was 3)
3. Problem (was 2)
...

Refresh to see the change."
```

### 4. Section Changes

Adding or removing:

```
User: "We need a pricing section"

Response:
"I'll add a pricing section. Quick questions:
1. How many pricing tiers?
2. Monthly/annual toggle needed?
3. Feature comparison table?

Let me know and I'll build it."
```

```
User: "Remove the FAQ section"

Response:
"Removed. The page now ends with the CTA section.
Want to add any final content before the footer?"
```

### 5. Animation Changes

Motion adjustments:

| User Says | Action |
|-----------|--------|
| "Too much animation" | Reduce motion, simpler transitions |
| "Feels static" | Add scroll reveals, hover effects |
| "Animations are distracting" | Remove all but essential motion |
| "Love the animations, more!" | Add staggered entrances, parallax |

---

## Edit Request Format

When user requests changes, acknowledge and act:

```
"Got it. Making these changes:

1. ✅ [Change 1] - doing now
2. ✅ [Change 2] - doing now
3. ⏳ [Change 3] - need clarification

For #3: [Ask clarifying question]

I'll refresh your preview when ready."
```

---

## Batch vs Individual Edits

### Small edits (do immediately):
- Text changes
- Color tweaks
- Spacing adjustments
- Single component fixes

### Larger edits (confirm first):
- New sections
- Major layout restructure
- Design system changes
- Feature additions

```
"That's a bigger change. Here's what it involves:

- [Scope of change]
- [Files affected]
- [Time estimate]

Want me to proceed?"
```

---

## Revision Limits

Guide the process constructively:

```
After several rounds:

"We've made good progress. To wrap up efficiently:

1. List ALL remaining changes you want
2. I'll implement them in one pass
3. We'll do a final review

What's left on your list?"
```

---

## Common Edit Patterns

### "Something feels off but I can't say what"

```
"Let's diagnose. Look at:

1. Hero - Does the headline grab you?
2. Colors - Do they feel like your brand?
3. Spacing - Too tight or too loose?
4. Typography - Modern enough? Too generic?
5. Flow - Does the story make sense?

Which area feels most 'off'?"
```

### "I liked the competitor's site better"

```
"Let's look at that again. What specifically appeals?

- Their hero approach?
- Color palette?
- Typography?
- Animations?
- Layout structure?

I can adapt those elements to your content."
```

### "Make it more [adjective]"

Translate subjective feedback:

| They Say | You Do |
|----------|--------|
| "Modern" | Clean lines, subtle gradients, contemporary fonts |
| "Professional" | Structured layout, navy/gray palette, serif accents |
| "Friendly" | Rounded corners, warm colors, casual copy |
| "Premium" | Dark theme, elegant typography, refined details |
| "Bold" | Large type, strong contrast, confident messaging |
| "Minimal" | Remove decoration, increase whitespace, fewer elements |

---

## Tracking Changes

Keep a mental or written log:

```
CHANGES MADE:
- [x] Updated hero headline to Option B
- [x] Changed primary color from #3B82F6 to #2563EB
- [x] Added testimonial section
- [x] Reduced section padding on mobile
- [ ] Pending: Add pricing tier comparison

CURRENT STATE:
- 8 sections total
- Primary CTA: "Book a Call"
- Design: Modern, clean, blue accent
```

---

## Final Review Prompt

When changes seem complete:

```
"Here's where we are:

SECTIONS: [list]
DESIGN: [summary]
KEY CHANGES MADE: [list]

Before we wrap up:
1. View the full page one more time
2. Check on mobile
3. Test the form/CTA

Is this ready to deploy, or any final tweaks?"
```

---

## Moving to Deploy

Once approved:

```
"Excellent! The site is approved.

Next step: Deploy to Vercel (or your preferred host).

Ready to deploy?"
```

Then proceed to `11-deployment.md`.
