# Prompt Builder

Every Higgsfield prompt for a Ben thumbnail follows a 4-block anatomy, preceded by a mandatory visual-read step when reference images are present. Build in order; do not skip steps.

## Step 0 (mandatory if any reference images): READ them ALL

Before writing any block, use the `Read` tool on EVERY reference image's file path, not just one. Read renders the image for direct visual inspection. If the user gave you 5 references, read all 5. If they gave you a whole folder, read every file in it.

For each ref, extract:

- **Dominant colors** with rough hex equivalents (e.g., "deep charcoal background, looks like #1F1F1F; coral accent ~#E97B5D")
- **Composition pattern** (e.g., "Ben on the right third, text on the left, hand-drawn arrow")
- **Lighting mood** (e.g., "soft front-left key, gentle rim, no hard shadows")
- **Render style** of supporting visuals (e.g., "folder is flat-vector, not photoreal; Ben is photoreal")
- **Texture** of the background (e.g., "subtle dot-grid pattern overlay")
- **Recurring motifs** visible (coral starburst, folder, white arrow, yellow highlight box, UI mockup card)

Write one short observation per ref (one sentence is fine). Then identify the SHARED signals across all of them — the patterns that appear in most or all refs. These are the strongest brand cues and the highest-confidence inputs to the prompt. A signal that appears in 1 of 5 refs is noise; a signal that appears in 4 of 5 is canon.

After reading, pass every relevant ref to `medias[]` (up to `nano_banana_2`'s 4-ref limit). Never pre-select just one when the user gave several. If more than 4 were provided, pick the 4 most representative — Ben photo first if present, then refs covering distinct style cues — and tell the user in one line which 4 were used.

The observations become the source-of-truth for blocks 1, 2, and 3 below. If observations from the refs conflict with the style spec defaults, the refs win; the user is showing you what they want.

If no references are provided, skip Step 0 and use the style spec / locked visual-language defaults directly.

Always cross-reference `references/visual-language.md` for the canonical palette, typography, layout, and recurring motifs. The 5 blocks below are the structural template; `visual-language.md` is the brand vocabulary you fill them with.

## The 4 Blocks

```
[1] SCENE        what is happening, where, who is in frame
[2] SUBJECT      Ben's framing, expression, wardrobe, gesture
[3] STYLE        palette, lighting, mood, render style
[4] NEGATIVES    prohibited patterns from the style spec
```

The order matters. Higgsfield weights the front of the prompt more, so scene and subject lock first, style and constraints follow.

**Logos** (updated rule): the goal is to USE real logos when you have them as reference PNGs, not avoid them. Two cases:

1. **Real logo PNG available** (in `Projects/youtube/thumbnails/logos/` or attached by the user): pass it as a `medias[]` entry. In block 2, refer to it explicitly: "in the top-left corner, render the provided logo (medias[N]) at approximately 8% of frame width, preserving its exact shape, color, and proportions." nano_banana_2 with a real reference renders brand marks far more faithfully than text-only attempts.

2. **No logo PNG available**: don't have the model hallucinate one. Describe the element generically without naming the brand ("a small coral starburst icon" rather than "the Anthropic logo"). The user can composite the real PNG in post if needed.

What stays banned in negatives: hallucinated brand marks (model invents a logo from a name in the prompt), AND empty rectangles reserved as logo zones (the awkward blank-box problem). What's now ENCOURAGED: rendering real logos from reference PNGs.

**Reference images are mandatory inputs and must be READ first**: if the user attached or named a reference image, READ it with the `Read` tool BEFORE writing the prompt. Extract its palette, composition, motifs, and any brand marks visible. Build the prompt with those observations. THEN pass every relevant reference into `medias[]`. The prompt should explicitly acknowledge each reference ("use the provided reference image (medias[0]) as the visual anchor for the {character / style / composition / logo}"). Never build a prompt that ignores a user-supplied reference. If you have more references than the chosen model can accept, switch model (usually to `nano_banana_2`) instead of dropping any.

**Text on the thumbnail**: keep it minimal. 2 to 4 words per line, 2 lines maximum. If the concept needs more, the concept is wrong for a thumbnail — tighten the hook. Fewer words also render cleaner kerning and sharper letterforms; long text spills, garbles, or gets cut off.

## Block-by-Block

### Block 1: Scene

One sentence. Concrete. No hype words.

Good: `a clean home office desk with two monitors showing code, soft daylight from a window on the left, the room is uncluttered and modern`

Bad: `an amazing futuristic AI workspace bursting with energy`

Pull setting cues from the topic. If the video is about an AI tool, the scene is usually Ben at a desk, screen visible. If it's a teardown or analysis, scene can be a whiteboard, sticky notes, or product packaging.

### Block 2: Subject

Use the categories from `Context/youtube-thumbnail-style.md`. Always specify:

- Framing category (e.g., `medium shot, Ben on the left third of the frame`)
- Expression category (e.g., `expression: focused, slight forward lean, looking at the camera`)
- Wardrobe (default: `plain dark t-shirt or hoodie`)
- Gesture if relevant (`one hand pointing toward the visual element on the left`)

For `new-with-ben` mode, after the subject sentence, append: `the subject must match the provided reference image (medias[0]) exactly; same person, same face shape, same hair, same general age.`

For `ben-plus-other` mode, name the second subject explicitly and describe its placement relative to Ben.

For `no-face` mode, skip subject framing; describe the object or concept instead.

### Block 3: Style

Pull from the Ben AI thumbnail visual language (see `references/visual-language.md` for the full catalog):

- **Palette**: `dominant background is deep charcoal #1F1F1F with a subtle dot-grid texture overlay, signature accent is warm coral #E97B5D used on folder icons, asterisk marks, and small visual elements, white #FFFFFF for primary text and hand-drawn arrows, near-black #0A0A0A for text on light backgrounds when used`
- **Alternate palettes (use sparingly, ~30% of thumbnails)**: warm cream `#F5E6D8` background, or solid coral `#E97B5D` panel
- **Typography in the scene**: any visible text is bold uppercase sans-serif (Inter Black / Anton style). Editorial wordmarks like "Claude Cowork" use a black serif (Playfair Display style)
- **Lighting**: soft key from camera-front-left, gentle rim separating Ben from the dark background, no harsh shadows
- **Render style**: Ben is photoreal; supporting visuals (folders, app icons, UI mockups, arrows) are flat-stylized, not photoreal
- **Mood**: pick one matching the topic (`grounded and analytical`, `curious and exploratory`, `urgent`, `confident and celebratory`)

**Banned colors in the render**: navy blue, royal blue, sky blue, pure red, magenta, purple (except Obsidian purple when the topic is Obsidian), green, neon/electric variants. If the topic demands one of these for a specific tool, name the tool and let the model handle the brand mark.

### Block 4: Negatives

End the prompt with a flat list. Pull from the `prohibited` section of the style spec. Default:

```
no hallucinated or invented brand marks (only render logos from provided reference images), no empty rectangles or reserved gaps, no extra people unless mode requires it, no busy backgrounds, no cartoon or illustrated rendering of Ben (Ben must be photoreal), no photoreal rendering of supporting visuals (folders, arrows, icons stay flat-stylized), no low-contrast composition, no excessive text — keep on-screen text to 2-4 words per line and 2 lines max, no em dashes in any rendered text.
```

Notes:
- "Hallucinated brand marks" is the precise ban: the model inventing the Anthropic asterisk, Claude wordmark, OpenAI logo, etc. from text alone. Real logos passed as reference PNGs in `medias[]` are ENCOURAGED, not banned.
- "Empty rectangles or reserved gaps" stays banned because the model otherwise leaves an awkward blank box when it senses logo intent. The thumbnail fills its frame edge-to-edge; logos either get rendered from a reference PNG or composited in post.

For `nano_banana_2` and `gpt_image_2` you can also pass this as `params.negative_prompt` if the model accepts it. Otherwise include it inline at the end of the prompt.

## Worked Example

Topic: "Claude Code Skills explained, why it changes everything for solo founders"
Mode: `new-with-ben`
Variants: 3

```
[1] A flat deep-charcoal #1F1F1F background with a subtle dot-grid texture, a coral #E97B5D file folder floating in the center-left of the frame with the text "/skills" on its white tab in black bold sans-serif, a thick white hand-drawn curved arrow arcing from the folder toward the subject on the right.

[2] Ben in a chest-up shot on the right third of the frame, expression focused with a slight smile, looking directly at the camera, wearing a plain black t-shirt, a podcast-style microphone visible at the bottom-right edge. The subject must match the provided reference image (medias[0]) exactly; same person, same face shape, same hair, same general age.

[3] Dominant background is deep charcoal #1F1F1F with a subtle dot-grid texture, signature coral accent #E97B5D on the folder and one small starburst icon, pure white for the arrow and any large text. Ben is photoreal with soft front-left key lighting and a gentle rim. Supporting visuals (folder, arrow, starburst) are flat-stylized, not photoreal. Mood is grounded and analytical.

[4] no navy blue, no royal blue, no purple, no green, no neon colors, no text overlays unless explicitly part of the design, no real or rendered logos of any kind, no empty rectangles or reserved gaps, no extra people, no busy backgrounds, no cartoon or illustrated rendering of Ben (Ben must be photoreal), no centered composition (Ben goes on the right third), no em dashes in any rendered text.
```

## Mode-Specific Prompt Tweaks

### `variation`

Lead the prompt with: `Use the provided reference image as the visual anchor. Keep the framing, palette, and lighting consistent with it. Modify only the following:` then list the changes. Pass the past thumbnail (or its job_id) as the first entry in `medias[]`.

### `new-with-ben`

Standard 4-block prompt. Pass the latest `ben_reference_*.jpg` from `Projects/youtube/thumbnails/refs/` as `medias[0]` (after one-time `media_upload` + `media_confirm`, reuse the `media_id`). Use model `nano_banana_2`. The subject sentence in block 2 must include the "must match the provided reference image" phrase.

### `ben-plus-other`

Add a sentence at the end of block 2: `The second subject is {description}. Place them on the right third of the frame, facing Ben.` Pass two `medias[]` entries: `medias[0]` is the Ben reference photo, `medias[1]` is the other subject. Use model `nano_banana_2`.

### `no-face`

Skip block 2. Strengthen block 1 to describe the concept or object in detail. Keep blocks 3, 4, 5 identical. Use `nano_banana_2`, or `gpt_image_2` if text is the hero.

## Safety and Content Policy

Higgsfield rejects prompts that trigger `nsfw` or `ip_detected`. To avoid wasted credits and rejections:

- Never name real public figures (CEOs, celebrities, politicians) in the prompt. If a scene needs "Sam Altman next to Ben", describe by role and look ("a tech CEO in a grey sweater") and pass a reference image instead.
- Never name real brand marks (Anthropic, OpenAI, Apple). Describe shape and color generically; composite the actual logo in post.
- Never describe sexual, violent, or illegal content. Rare in thumbnail work but worth knowing.
- Trademarked characters (Mickey Mouse, Pikachu, etc.) trigger `ip_detected`. Don't reference them.

## Prompt Length

Keep the full prompt under ~200 tokens (~1000 characters). Longer prompts dilute weighting and produce worse output. If you're over, the first thing to trim is adjective stacks ("beautifully soft cinematic warm natural" becomes "soft natural").

## Negative Phrasing for Models Without `negative_prompt`

`nano_banana_2` and `gpt_image_2` (the only models used in this pipeline) both accept `params.negative_prompt`. Pass the negatives there in addition to including them in block 4 of the prompt.

## Image-to-Image Prompts (variation mode)

When the prompt is driving an edit of a reference image, describe **what changes**, not what's already there.

Bad: "Ben at a desk with two monitors, dark t-shirt, navy walls, change the monitor to show n8n"
Good: "Change the monitor display to show the n8n interface. Keep everything else identical to the reference."

The model already has the reference; redescribing it competes with the actual change.

## Writing Style Rules

- Practitioner authority, not hype.
- Concrete nouns, not adjectives stacked on adjectives.
- No em dashes anywhere in the prompt. Use commas, periods, or parentheses.
- Avoid words: amazing, incredible, stunning, mind-blowing, revolutionary, ultimate, supercharged.
- Prefer specifics over generics: `a single sticky note with the word "API"` beats `notes with text`.
- One sentence per block where possible. If a block needs two sentences, the second must add a new fact, not restate the first.

## Quick Checklist Before Sending

- [ ] If any reference images exist, Step 0 (visual read) was performed and observations folded into blocks 1/2/3
- [ ] All 4 blocks present and in order
- [ ] Palette colors are hex codes from the style spec
- [ ] Framing category matches one in the style spec
- [ ] Expression category matches one in the style spec
- [ ] Negatives block ends the prompt and bans real logos + empty rectangles
- [ ] No em dashes anywhere
- [ ] Mode-specific tweaks applied
- [ ] `medias[]` populated for every mode except `no-face` without a style anchor (Ben reference for `new-with-ben`, past thumbnail for `variation`, both refs for `ben-plus-other`)
- [ ] Model is `nano_banana_2` for everything except text-hero `no-face` (which uses `gpt_image_2`)
- [ ] Prompt under ~200 tokens
