# The Claude Design hand-off

At the end of every run, Branch A or B, produce two blocks of text the user can paste directly into Claude Design's "Set up your design system" form.

## Contents

- Claude Design's form has three fields that matter
- Field 1: Company name and blurb
- Field 2: Any other notes?
- A separate note on font files
- The final delivery message

## Claude Design's form has three fields that matter

1. **Company name and blurb** (textarea): up to ~80 words. This becomes part of Claude Design's context for every future asset it generates.
2. **Examples of your design system** (file upload): they upload the `design-system/` folder you just produced.
3. **Any other notes?** (textarea): free-form. This is where you front-load the non-negotiables so Claude Design doesn't drift.

You do not control field #2: the user uploads the folder. But you *do* produce the exact text for fields #1 and #3.

---

## Field 1: Company name and blurb

### Format

One flowing paragraph. Start with the brand name + colon. Include:
- What the business does, concretely (not "transforming" anything).
- For whom (specific audience).
- The list of surfaces this design system will need to cover.

### Rules

- Under 80 words.
- No hype vocabulary (remember the banned list from [non-negotiables.md](non-negotiables.md)).
- End with the surface list ("Surfaces we design for: marketing website, landing pages, blog, pitch decks, Instagram + LinkedIn carousels, email, infographics, ads.").
- Use the brand's voice, not a generic company-description voice. If the brand is warm, warm; if terse, terse.

### Template

```
{{BRAND_NAME}}: {{WHAT_IT_DOES}} for {{AUDIENCE}}. {{ONE_DIFFERENTIATING_LINE}}. Surfaces we design for: {{SURFACE_LIST}}.
```

### Example (from Lantern, the reference build)

> Lantern: AI services for US local businesses: salons, dental offices, auto shops, home services, restaurants, clinics, fitness studios. We set up AI inside the tools owners already use (phones, bookings, reviews) and stay on as the business changes. Surfaces we design for: marketing website, landing pages, blog, pitch decks, Instagram + LinkedIn carousels, email, infographics, ads.

---

## Field 2: Any other notes?

### Purpose

Claude Design's upload will ingest every file in `design-system/`, but the *non-negotiables* that make the system feel like a system (and not just a folder of fragments) are easy for an LLM to skip over. Put them here, in the "notes" field, so they sit at the top of Claude Design's prompt context and consistently override defaults.

### Format

200–300 words. Start with "Load design-system/CLAUDE.md first" so Claude Design knows where to begin. Then bullet the brand-specific values (color, background, typeface) followed by voice rules, imagery direction, and motion rules. End with the one emotional line the brand is trying to produce in the reader.

### Template

```
Load design-system/CLAUDE.md first: it specifies the read order (BRAND-SUMMARY → voice → the right application file → tokens → components). Key non-negotiables that override any styling defaults:

• Primary color is exactly {{PRIMARY_HEX}}. Background is {{PAPER_HEX}} ({{PAPER_DESCRIPTION}}, never pure white for marketing). {{FONT_FAMILY}} is the only typeface at every size.
• Radii: {{RADIUS_RULE}}.
• No gradients, no glassmorphism, no glow, no 3D, no generic "AI"/industry visuals. Lucide icons only at 1.5 stroke.
• Voice: second-person singular, sentence case, short sentences. Name the user's world ({{USER_NOUNS}}), never ours ({{OUR_NOUNS}}).
• Banned words on public surfaces: revolutionary, game-changing, 10x, cutting-edge, supercharge, unleash, leverage, transform, seamless, robust, "AI-powered" as a bare adjective.
• CTAs are soft and specific ("{{CTA_EXAMPLE}}"), never "{{CTA_ANTI_EXAMPLE}}" or anything with an exclamation mark.
• Imagery: real photography of {{IMAGERY_SUBJECT}}. Natural light. Never stock "{{STOCK_ANTI_EXAMPLE}}." Never AI-generated humans.
• Motion: minimal. Fade + small translate (8px), 160/240/480ms. Never parallax, marquee-on-hero, or exit-intent popups.

Everything should make {{AUDIENCE_SHORTHAND}} feel {{DESIRED_FEELING}}, not sold to.
```

### Example (from Lantern, the reference build)

> Load design-system/CLAUDE.md first: it specifies the read order (BRAND-SUMMARY → voice → the right application file → tokens → components). Key non-negotiables that override any styling defaults:
>
> • Primary blue is exactly #2859D9. Background is warm off-white #FBFAF7 (never pure white for marketing). Inter is the only typeface at every size.
> • Radii: 10–16px on cards, pill (full) on marketing CTAs, md on product UI buttons.
> • No gradients, no glassmorphism, no glow, no 3D, no generic "AI" visuals (neural meshes, orbs, wireframe globes). Lucide icons only at 1.5 stroke.
> • Voice: second-person singular, sentence case, short sentences. Name the owner's world (chair, shop, appointment, phone, review), never ours (agent, LLM, platform, pipeline).
> • Banned words on public surfaces: revolutionary, game-changing, 10x, cutting-edge, supercharge, unleash, leverage, transform, seamless, robust, "AI-powered" as a bare adjective.
> • CTAs are soft and specific ("See what we'd set up for you"), never "Book a Demo Now" or anything with an exclamation mark.
> • Imagery: real photography of actual local business owners at their workplace. Natural light. Never stock "diverse team around a laptop." Never AI-generated humans.
> • Motion: minimal. Fade + small translate (8px), 160/240/480ms. Never parallax, marquee-on-hero, or exit-intent popups.
>
> Everything should make a local business owner feel understood, not sold to.

---

## A separate note on font files

Claude Design loads web output using Google Fonts. If the user's chosen typeface is not on Google Fonts (e.g., Söhne, GT Walsheim, Graphik), they'll need to upload the actual font files under the "fonts, logos, and assets" field as well.

When handing back, tell the user explicitly:

- **If the brand uses Inter** (or any Google Font): "You can skip the fonts/logos/assets slot: everything's in `design-system/`."
- **If the brand uses a licensed display font** (Söhne, GT Walsheim, Graphik, etc.): "You'll want to drop the `.woff2`/`.otf` files for {{FONT_NAME}} into the fonts slot, because Claude Design can't load them from Google Fonts."

## The final delivery message

When you hand back, structure your reply like this:

```
Done. Here's what's in [project-root]/design-system/:

[Brief summary of what was produced, with a file count.]

[A caveat or two the user should know, e.g. "the logo uses a {{motif}}
motif; if you want alternatives I can generate 3–5 more directions."]

## Company name and blurb (paste into field 1)

```
{{THE_GENERATED_BLURB}}
```

## Any other notes? (paste into the last field)

```
{{THE_GENERATED_NOTES}}
```

[Line about font files, Google-font-safe or needs-upload.]
```

Copy this structure exactly: it's what the user expects and it matches what worked in the reference build.
