# Branch A: Fresh brand, from scratch

You're building a design system for a brand that doesn't have one yet. The user might have a name, an idea, maybe a vague color instinct, but there are no shipped assets to mine. Everything comes from you, the research, and the user's direction.

This is the higher-craft branch. It takes longer and the output quality depends on how rigorous your discovery and synthesis are. Don't cut corners.

## Contents

- Step 1: Discovery interview
- Step 2: Research via Firecrawl
- Step 3: Synthesize
- Step 4: Wait for sign-off
- Step 5: Generate
- Step 6: Finalize
- Common traps on this branch

---

## Step 1: Discovery interview

Ask these questions in one focused pass. Don't ask all of them if answers to earlier ones make later ones obvious. Don't ask them one at a time. Batch them so the user can answer at their own pace. Use markdown headers when you send it.

### The entity
1. What is it? Name (or working name), what it does/makes/sells, and for whom. One paragraph is fine.
2. Why does it exist: what insight, itch, or opportunity made it necessary?
3. Stage: fresh idea, already operating, rebrand of something existing?

### The feeling
4. If someone lands on the homepage and leaves after 3 seconds, what single feeling or word should stick with them?
5. Pick 3–5 adjectives that describe the brand's personality. And 2–3 that it is definitely *not*.

### References (highest leverage: don't skip)
6. Paste 3–7 websites you love. For each, one line on *what specifically* draws you (the typography? the color restraint? the density? the motion? the copy?). These become your Firecrawl extraction targets.
7. Anti-references: 1–3 brands/sites you want to deliberately *not* look like, and why.
8. If you have any screenshots, mood boards, Pinterest boards, component inspiration, logo sketches, share them.

### Constraints
9. Any hard inputs: a name you're locked into, a color you already own, a typeface license you have or can't afford, a platform it must live on (web only? iOS? print?).
10. Color instinct, if any. (One word or a hex value is enough: "cool blue," "warm terracotta," "no strong opinion.")

If the user can't or won't name 3+ references, tell them: "Fine, I'll find 10 in the category that match the *feeling* you described, and present them for you to approve before I extract anything." Then proceed to Step 2.

---

## Step 2: Research via Firecrawl

Your job here is to end up with **10 reference sites**, either from the user or from your own research, that you'll extract patterns from.

### If the user gave you 3–7 references:
Scrape each immediately:

```bash
firecrawl scrape <url> --format markdown,branding --full-page-screenshot --wait-for 5000 -o brands/<slug>/homepage.json --json
```

Also search for 2–4 adjacent references to round out to ~10. These add coverage the user may not have thought of (a craft-bar reference, a category-leader reference, an adjacent-industry reference).

### If the user gave you fewer than 3 references:
Before scraping, run ~5 Firecrawl searches in parallel to build the reference list:

```bash
firecrawl search "best <category> brands USA" --limit 8 -o .firecrawl/research/search-1.json &
firecrawl search "top <category> AI <vertical>" --limit 8 -o .firecrawl/research/search-2.json &
firecrawl search "highly rated <category> providers" --limit 8 -o .firecrawl/research/search-3.json &
firecrawl search "<category> G2 review leaders" --limit 8 -o .firecrawl/research/search-4.json &
firecrawl search "<adjacent-craft-category> well-designed sites" --limit 8 -o .firecrawl/research/search-5.json &
wait
```

Then curate 10 candidates into three groups:
- **Category incumbents** (most direct, what the category looks like)
- **Modern natives** (how the category looks when executed in current aesthetics)
- **Craft ceiling** (premium brands, not direct competitors, but set the quality bar)

Present the 10 to the user with a one-line rationale each. Let them veto before you scrape.

### After scraping:
For each brand, verify the output has the `branding` key with `colors`, `typography`, `spacing`, `components`, and `personality`. Also download the `screenshot` URL to `brands/<slug>/homepage.png` so you have visual reference.

---

## Step 3: Synthesize

Write `research/synthesis-and-direction.md`. Structure:

### Section 1: What the category actually looks like
A table comparing the primaries, background choices, and typography of all 10 references. Then call out the non-obvious patterns:
- Is any color family unclaimed (or dominated by one player)?
- What's the background consensus, pure white or warm off-white?
- What typefaces cluster?
- What radius / pill-CTA / corner-radius pattern holds?
- What's the voice/personality consensus?

### Section 2: Where this brand should break from the pattern
2–3 things to deliberately do *differently* from the category, based on the discovery interview.
2–3 things to deliberately stay with the pack on.

### Section 3: Proposed direction
Concrete choices, with specific values:
- **Color:** primary hex, the 50/100/…/900 derivation, paper, ink, line, semantic set.
- **Typography:** chosen family (and rationale), scale, letter-spacing rules.
- **Spacing & radius:** scale values, default card radius, CTA shape.
- **Iconography:** library (default Lucide), stroke, sizes.
- **Imagery:** photography direction, illustration rules.
- **Motion:** patterns acceptable, banned.
- **Voice & tone:** principles, vocabulary orientation.
- **Logo direction:** wordmark-first vs. mark+wordmark, motif hints, what to avoid.

### Section 4 (critical): The five sign-off questions
End with these, verbatim, numbered:

1. **Color.** Go with my proposed primary, or do you want deeper/lighter/warmer/cooler?
2. **Typography.** Use Inter throughout (free, safe, disciplined) or pair a premium display face (Söhne/GT Walsheim/Graphik) with Inter for body?
3. **Logo motif.** [Propose 2–3 specific motif ideas based on the brand name / positioning.]
4. **Name.** Confirm or generate alternatives.
5. **Output scope.** Tokens + docs + logo + components, or just tokens + docs?

---

## Step 4: Wait for sign-off

Do not generate the system until the user has answered the five questions. If they give vague answers, ask one clarifying question. Your most common failure mode here is starting generation before the user has actually *committed*, which produces a system they don't feel ownership of.

---

## Step 5: Generate

Follow [output-structure.md](output-structure.md) for what goes in each file. Use the templates in [../assets/templates/](../assets/templates/). Parameterize each template by the user's choices from Step 4:

| Placeholder         | Source |
| ------------------- | ------ |
| `{{BRAND_NAME}}`    | User's answer to Q4 |
| `{{BRAND_TAGLINE}}` | Generated by you, aligned with positioning |
| `{{PRIMARY_HEX}}`   | User's answer to Q1 |
| `{{PAPER_HEX}}`     | Warm off-white unless user chose pure white |
| `{{INK_HEX}}`       | `#0F1A2E` or similar cool near-black; derive from primary's undertone |
| `{{DISPLAY_FONT}}`  | User's answer to Q2 (Inter or premium) |
| `{{BODY_FONT}}`     | Inter |
| `{{LOGO_MOTIF}}`    | User's answer to Q3 |
| `{{VERTICAL_LIST}}` | From discovery Q1 (who the brand serves) |

### Color shade derivation
Given the primary `#XXYYZZ`, derive 50–900 steps:
- 600 is the primary
- 700 is 12% darker
- 500 is 15% lighter
- 400 is 30% lighter
- 300 is 50% lighter
- 200 is 70% lighter
- 100 is 85% lighter
- 50 is 95% lighter
- 800 is 25% darker
- 900 is 45% darker

Use HSL manipulation, not RGB, for cleaner shades.

### Logo generation
Read [../assets/templates/logo/mark-template.svg](../assets/templates/logo/mark-template.svg) and substitute:
- `{{PRIMARY}}` → user's primary
- `{{PAPER}}` → user's paper color
- `{{INK}}` → user's ink color
- `{{MOTIF_PATH}}` → the SVG path for the chosen motif (use the motif library in [../assets/templates/logo/motifs.md](../assets/templates/logo/motifs.md))

Render to JPG + PNG using [../scripts/render.mjs](../scripts/render.mjs).

### Component generation
The component `.tsx` files in [../assets/templates/components/](../assets/templates/components/) are parameterized by Tailwind class names. Since Tailwind reads from the preset you generated (which uses the brand's color names, not hex values), the components work as-is with no per-brand substitution. Just copy them in.

### Voice generation
Vocabulary, voice examples, and homepage copy are *not* purely templatic. Generate them from:
- The brand's verticals (Q1)
- The specific pains named during discovery (Q2)
- The personality adjectives (Q5)

Refer to [../assets/templates/voice/vocabulary-skeleton.md](../assets/templates/voice/vocabulary-skeleton.md) for structure and expand it with the user's world.

### Asset templates: synthetic, but flagged for replacement

Branch A is the only branch where synthetic templates (OG image, IG carousel, LinkedIn post) are the default: by definition, the brand hasn't shipped real versions yet. But:

1. **Render every synthetic template carefully.** Use the templates in [../assets/templates/asset-templates/](../assets/templates/asset-templates/), parameterize with the brand's colors/type, and run through [../scripts/render.mjs](../scripts/render.mjs).
2. **In `assets/templates/README.md`, mark each one as a draft** with explicit language: *"This is an initial template I generated based on the design system. Once you ship real versions of this asset (a one-pager, an IG carousel, a YouTube thumbnail), replace this draft with the real file. Real shipped assets are always preferred over synthetic recreations."*
3. **In the final delivery message**, list each synthetic template and ask the user to flag any that look off, and to send back any real assets they have so you can swap them in.

The goal is to give the user *something* to ship from on day one, while making it explicit that the templates folder will mature into a library of real assets over time.

---

## Step 6: Finalize

Produce the Claude Design form text per [claude-design-form.md](claude-design-form.md). Hand back:

1. The `design-system/` folder path.
2. The two pasteable text blocks (company name + blurb, any other notes).
3. A short summary of decisions made, so the user has a change log.

## Common traps on this branch

- **Starting with aesthetics before positioning.** If you let a color instinct lead, the system will be pretty but directionless. Positioning first, aesthetics second.
- **Over-branching the color palette.** Tempting to propose complementary or triadic schemes. Don't. One color.
- **Proposing a typeface the user can't afford.** Check their constraint before suggesting Söhne ($600+).
- **Asking 15 discovery questions.** Batch them. The user should see one coherent interview, not a cross-examination.
- **Generating before sign-off.** The five sign-off questions exist because the five things they cover are the hardest to redo after generation.
