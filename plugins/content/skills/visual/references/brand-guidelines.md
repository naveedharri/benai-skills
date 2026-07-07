# BenAI Brand Guidelines

> Reference file for infographic generation. Loaded during Phase 6 (Prompt Construction)
> for Information Graphics and Hybrid mode visuals.

---

## 1. Brand Philosophy

BenAI is a personal brand built around helping people automate their work and businesses.
The founder, Ben Van Sprundel, creates content about AI, automation, and working smarter.
Everything we design should reflect that mission: making complex things simple, accessible,
and actionable.

### Visual Personality

- **Friendly but professional.** Approachable without being casual. The kind of content
  you'd proudly share with your boss or your best friend. No stiffness, no sloppiness.

- **Clean but not sterile.** Think of a well-organized workspace: everything has its place,
  there's breathing room, and the space feels warm and inviting. Not a hospital. Not a
  bare white room. A place where real work happens, beautifully.

- **Confident but not arrogant.** Bold design choices signal confidence. Hard shadows, clear
  hierarchy, decisive color use. We don't hedge with soft gradients or safe choices. But we
  never shout. Substance over style, always.

- **Approachable but premium.** Like walking into a really well-designed coffee shop.
  Welcoming and comfortable, but you notice the quality in every detail. The typography,
  the spacing, the color choices all say "someone cared about this."

### Design Philosophy: "Clean Over Clever"

When in doubt, choose clarity. The best infographics communicate instantly. If a viewer
can't "get it" in 2 seconds, the design has failed. No visual puns that require explanation.
No clever layouts that sacrifice readability. Clean always wins.

**Reference point:** Apple keynote slides. Bold, minimal, confident. One image and a few
words. They trust the audience to be intelligent. We do the same.

**The feeling we want:**
"professional and trustworthy," "easy to understand," "worth saving," "I want to share this."

**NOT:**
"overwhelming," "looks like a template," "corporate and cold," "can't figure out what it's saying."

### Style Communication: References Over Specs

When building prompts for Gemini, the brand system is best communicated through
product references rather than individual CSS specifications. Tested finding:
"looks like a Stripe.com landing page" activates the entire aesthetic (soft cards,
precise typography, generous padding) more reliably than listing hex codes and
border specs individually.

**The prompt hierarchy for BenAI style:**
1. Lead with a brand reference: "looks like a component from Stripe.com"
2. Follow with the brand specs: cream background (#FAF3E3), hard shadows, dark borders
3. Close with material feel: "premium magazine spread printed on quality stock"

The reference activates the vibe. The specs refine the details. The material
anchors the texture.

---

## 2. Color System

### Foundation: Warm Cream Background (#FAF3E3)

Not white. White feels clinical and cold. Warm cream feels like quality paper, like a
well-lit room, like something handcrafted. It reduces eye strain for scrolling viewers
and creates instant warmth. This is the single most important color decision in the
entire brand. The perfect warm neutral that makes everything else look better.

### ABSOLUTE RULE: NEVER Black Backgrounds

Black backgrounds are banned. No exceptions. No "dark mode" variants. No "just this once."

Why:
- Black feels cold, intimidating, aggressive, "tech-bro" in the worst way.
- It creates accessibility issues: halation effect, increased eye strain, poor readability.
- It contradicts everything BenAI stands for. We are warm. We stay warm.

If you are generating a prompt and the word "black background" appears, replace it with
warm cream (#FAF3E3). Every single time.

### Accent Color Palette

| Role                              | Color       | Hex       |
|-----------------------------------|-------------|-----------|
| Primary text                      | Dark        | #020309   |
| Background                        | Warm cream  | #FAF3E3   |
| Subtle backgrounds                | Light blue  | #E5F5F9   |
| Primary accent (positive)         | Green       | #D2ECD0   |
| Secondary accent (negative/warm)  | Red/pink    | #F3C1C0   |
| Tertiary accent (highlight)       | Dark yellow | #FDEEC4   |

### Semantic Color Meanings

- **Green (#D2ECD0):** Growth, progress, positivity. Use for tips, benefits, positive
  outcomes, "do this" recommendations.
- **Yellow (#FDEEC4):** Warm, optimistic, attention-grabbing. Use for highlights, key
  takeaways, important callouts.
- **Blue (#E5F5F9):** Calm, trustworthy, professional. Use for data sections, facts,
  statistics, supporting information.
- **Pink (#F3C1C0):** Human, warm, approachable. Use sparingly for emotional resonance,
  warnings, or "avoid this" items.

### Cycling Rule

When multiple cards, sections, or visual blocks exist in the same infographic, alternate
accent colors in this order: green, yellow, blue, pink. This creates visual variety while
maintaining brand consistency. Never use the same accent color for two adjacent elements.

---

## 3. Typography

### Headings (24pt and above): Space Grotesk

Fallback chain: Space Grotesk -> Montserrat -> Arial

Modern geometric sans-serif, designed in 2018. It feels confident, fresh, and distinctive
without being quirky. The slightly unusual letterforms give it personality while remaining
highly readable at large sizes.

### Body Text: Montserrat

Fallback chain: Montserrat -> Georgia

Clean, highly readable, friendly without being casual. Originally designed for screen use,
which makes it perfect for social media infographics. Pairs beautifully with Space Grotesk
because it shares geometric DNA without being identical.

### Hierarchy Rules

1. **Title / Main Heading:** The biggest, boldest element on the page. If you squint at
   the design and the title doesn't immediately stand out, make it bigger.
2. **Section Headings / Labels:** Smaller than the title but still prominent. These serve
   as navigation aids that help the viewer scan the infographic.
3. **Body Text:** The smallest text size. Supporting detail only. If the infographic
   doesn't work without the body text, the visual hierarchy has failed.

### Word Limits (Hard Rules)

| Element          | Maximum Words |
|------------------|---------------|
| Main title       | 6 words       |
| Section headings | 4 words       |
| Labels           | 3 words       |
| Body text per section | 15 words |

These are not suggestions. They are hard limits. If you cannot say it in 6 words, the
concept is not clear enough yet. Rewrite until it fits.

---

## 4. Hard Shadow Signature

### What It Is

A shadow with zero blur. Offset 8 pixels to the right, 8 pixels down, 0 blur radius,
pure black (#000000).

```css
box-shadow: 8px 8px 0px #000;
```

This is the single most recognizable visual element in the BenAI brand. Every card, every
container, every elevated element uses this exact shadow treatment.

### Why Hard Shadows

- **Distinctly modern.** Part of the neo-brutalist design movement. It immediately signals
  "this was designed intentionally, not pulled from a template."
- **Visual pop.** In a feed full of photos, soft graphics, and gradient-heavy designs, hard
  shadows physically jump off the screen. They create real visual depth.
- **Signal confidence.** Soft shadows hedge. They say "I'm kind of elevated, maybe." Hard
  shadows pick a direction and commit. That's the BenAI energy.
- **Memorable.** When someone sees a warm cream card with a hard black shadow, they start
  to recognize it as BenAI content. Consistency builds brand recognition.

### What to Avoid

- **Soft, blurry shadows.** These look dated (2010-era web design) and generic. Every
  template uses soft shadows. We do not look like a template.
- **No shadows at all.** Too flat. Infographics need visual hierarchy, and shadows are
  one of the best tools for creating it.
- **Colored shadows.** Keep it simple. Pure black provides maximum contrast against the
  warm cream background. Colored shadows add complexity without adding value.
- **Inconsistent shadows.** Every card and container in a single infographic must have
  identical shadow treatment. Same offset, same blur (zero), same color.

---

## 5. Shape and Accent Styling

| Property      | Rule                                                         |
|---------------|--------------------------------------------------------------|
| Shadows       | Solid/hard only: 8px right, 8px down, 0 blur, #000          |
| Borders       | Solid, 2px width, dark (#020309)                             |
| Border radius | Slightly rounded corners. Must NOT look fully round or pill-shaped |
| Accent colors | Cycle through yellow (#FDEEC4), blue (#E5F5F9), green (#D2ECD0) |

All shapes should feel intentional and structured. Rounded corners add friendliness, but
fully round elements (circles, pills) feel too playful for the brand. Aim for a border
radius that softens without losing the rectangular structure.

Borders and shadows work together. A card with a 2px dark border AND a hard shadow creates
a layered, tactile feel that is central to the BenAI visual identity.

---

## 6. Density and Restraint

### One Key Message Rule

Every infographic communicates exactly ONE key message. Not two. Not "two related ideas."
One. Every visual element, every text block, every color choice should reinforce that
single message.

**How to find it:** Write down everything the content covers. Then ask: "If the viewer
remembers only ONE thing after seeing this, what should it be?" That answer is your key
message. Everything else is either supporting detail or should be cut.

### Maximum 4-5 Distinct Elements

A card counts as one element. A chart counts as one. An icon counts as one. A text block
counts as one. If you count 6 or more distinct visual elements, the infographic is too
complex. You have three options:

1. Pick the top 4-5 elements and cut the rest.
2. Create a multi-slide series instead.
3. Find ways to group or combine elements.

### Whitespace Is a Design Element

Whitespace is not wasted space. It is an active, intentional design choice. Here is what
whitespace does:

- **Creates focus.** The eye goes where space leads it.
- **Improves readability.** Cramped text is hard to read, especially on mobile.
- **Signals quality.** Premium brands use generous whitespace. Cheap flyers cram everything in.
- **Reduces cognitive load.** Less visual noise means faster comprehension.

If elements feel crowded, the answer is almost never "make everything smaller." The answer
is "remove something."

### What to Cut

When an infographic feels too busy, cut in this order:

1. **Detailed explanations.** Save them for the post caption.
2. **Multiple examples.** Pick the single best one.
3. **Caveats and qualifications.** Mention in the caption if truly needed.
4. **Decorative elements** that do not directly serve the key message.
5. **Logos and attribution.** These belong in the footer only.

### The Billboard Test

Think of a billboard on the highway. You have maybe 3 seconds at 60 mph. That means
roughly 7 words and one image. Social media posts are billboards. People scroll fast,
often faster than they drive. Design accordingly.

---

## 7. Footer

Every infographic includes a footer at the very bottom of the design.

**Content:** "Ben Van Sprundel | Founder @ BenAI"

**Styling:** Small size, clean sans-serif font, left-aligned or centered. The footer
should be present but unobtrusive. It should never compete with the main content for
attention.

---

## 8. Platform Context

### LinkedIn (Primary Platform)

- **Format:** 4:5 portrait (1080x1350px). This ratio takes up maximum vertical screen
  real estate in the LinkedIn feed, which means more visibility.
- **Title treatment:** Must be huge and readable on mobile screens. The title is the
  "scroll stopper." If someone scrolling at speed can't read it, the design fails.
- **Visual contrast:** Hard shadows and bold accent colors stand out against LinkedIn's
  predominantly gray and white feed. Lean into this advantage.
- **Text density:** Less is more. The content should deliver value on its own, not serve
  as a teaser that forces someone to read a long caption.

### Instagram

- **Format:** 1:1 square (1080x1080px) for feed posts. 4:5 (1080x1350px) for more
  visual real estate.
- **Text density:** Even more minimal than LinkedIn. Instagram audiences expect higher
  aesthetic polish and less text.
- **Grid consideration:** If creating a series, consider how thumbnails look together
  in the profile grid. Consistency matters here.
- **Save-worthy:** Instagram's save feature is the ultimate compliment. Design something
  people want to reference later.

### Twitter/X

- **Format:** 16:9 landscape (1200x675px). This is how images display in the timeline.
- **Simplicity:** The simplest possible design. Twitter images often display as small
  thumbnails before being tapped. The design must work at thumbnail size.
- **Text size:** Very large, very readable. Maximum contrast between text and background.
  If the text is not readable at 50% zoom, it is too small.

### Presentations

- **Format:** 16:9 landscape (1920x1080px). Standard presentation aspect ratio.
- **Information density:** Higher density is acceptable here because viewers have more
  time to process each slide. The speaker provides verbal context.
- **Visual role:** Supportive rather than standalone. The slide reinforces what the
  speaker is saying rather than carrying the entire message alone.
