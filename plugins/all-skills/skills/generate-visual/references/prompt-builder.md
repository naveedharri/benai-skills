# Prompt Builder (for slides / on-screen visuals)

Every prompt follows a 4-block anatomy similar to the thumbnail generate skill, with one difference: block 2 is the HERO VISUAL (not Ben). Ben is usually NOT in slide frames; the supporting visual is the subject.

## Step 0 (mandatory if any reference images): READ them ALL

Use the `Read` tool on every reference image's file path. For each, extract:

- Dominant colors with rough hex (`#1F1F1F` charcoal, `#E97B5D` coral, etc.)
- Composition pattern (centered? off-third? stacked?)
- Lighting and depth (flat? subtle shadow? glow?)
- Render style of supporting elements (flat-vector vs photoreal)
- Texture (dot-grid? smooth? grain?)
- Recurring motifs visible (folder, asterisk, arrow, highlight box, UI mockup)

Write one observation line per ref. Identify SHARED signals across refs (a signal in 4 of 5 is canon; 1 of 5 is noise). Pass every relevant ref to `medias[]`.

## The 4 Blocks

```
[1] SCENE         the canvas: background, texture, overall mood
[2] HERO VISUAL   the main subject of the slide (folder, diagram, app icon, mockup, etc.)
[3] STYLE         palette, render style, mood (locked across progressive frames)
[4] NEGATIVES     prohibited patterns
```

Order matters; Higgsfield weights front-of-prompt more.

### Block 1: Scene

One sentence. The background and its texture.

Default for Ben's brand:
```
A flat deep-charcoal #1F1F1F background with a subtle dot-grid texture pattern overlay, evenly lit.
```

Alternates:
- Warm cream `#F5E6D8` solid panel
- Solid coral `#E97B5D` (high-contrast moments)
- A vertical gradient strip (for "N levels" or "tiers" concepts; rare)

### Block 2: Hero Visual

The main subject. The thing the audience is looking at. One sentence describing it in placement, shape, color, label.

Examples:

```
A single flat coral #E97B5D file folder, centered, slightly tilted, with a white tab on top and the label "/SKILLS" written on the body in bold uppercase white sans-serif. A small white 12-ray asterisk-starburst icon sits in the top-right of the folder.
```

```
Three flat coral file folders fanned in a stack across the center, each with a white tab, labels reading "/DESIGNER", "/WRITER", "/RESEARCHER" in bold uppercase white sans-serif. The front folder is slightly larger; the back two are progressively smaller and slightly rotated.
```

```
A simplified white UI mockup card centered in the frame with rounded corners, showing the Claude desktop interface with a chat panel on the left and a generated artifact panel on the right. Flat-stylized, not photoreal.
```

For progressive disclosure frames 2 to N, this block becomes the "ADD" instruction; see `progressive-disclosure.md`.

### Block 3: Style

Locked. Same across frames in a progressive sequence; same across the deck if multiple visuals share a look.

```
Dominant background charcoal #1F1F1F with dot-grid texture, coral #E97B5D accent on the hero visual, white #FFFFFF for any text and accent shapes, flat-stylized vector aesthetic for all supporting visuals, NOT photoreal. Even soft lighting, slight drop shadow on cards if any. Mood: clear, structured, educational.
```

For variety, swap in cream or coral backgrounds (and adjust text color accordingly).

### Block 4: Negatives

Always include. Pulled from the locked visual language.

```
no hallucinated or invented brand marks (only render logos from provided reference images), no empty rectangles or reserved gaps, no photoreal rendering of the hero visual, no busy backgrounds, no text outlines, no gradients on text, no excessive text — keep on-screen text to 2-4 words per line and 2 lines max, no extra people in frame unless the concept requires one, no cartoon or illustrated rendering, no neon or electric colors, no banned colors (navy blue, royal blue, sky blue, pure red, magenta, purple except for Obsidian topics, green except as a status dot), no em dashes in any rendered text.
```

Note: "Hallucinated brand marks" is the precise ban — model inventing logos from text alone. Real logos passed as reference PNGs in `medias[]` are ENCOURAGED. The model produces brand-accurate marks when it has a reference to copy.

For `nano_banana_2` and `gpt_image_2`, also pass this string as `params.negative_prompt` in addition to including it in block 4.

## Mode-Specific Tweaks

### `single`

Standard 4-block prompt. Generate one call, `count: 1`. Pass any user-provided references as `medias[]`. Done.

### `progressive-disclosure` — frame 1

Same 4-block prompt as single. The base frame must be CLEAN and SIMPLE; don't pack it with detail you intend to reveal in frames 2 to N.

### `progressive-disclosure` — frames 2 to N

Block 1 and 2 are replaced by the addition instruction. Blocks 3 (style) and 4 (negatives) stay verbatim.

```
[1+2 combined as the addition instruction]
Take the provided image (medias[0]) as the base. Keep the background, palette, layout, and all existing elements EXACTLY identical to the base; do not remove, recolor, reposition, or modify anything that's already there. Add only the following new element: {specific description + position}. Render the new element in the same flat-stylized aesthetic as the existing elements.

[3] {paste locked style block verbatim}

[4] {paste locked negatives block verbatim, plus: do not regenerate or reinterpret the existing image, only add the new element}
```

## Worked Examples

### Single mode: "The Skills Folder Structure"

```
[1] A flat deep-charcoal #1F1F1F background with a subtle dot-grid texture pattern overlay, evenly lit.

[2] A flat coral #E97B5D file folder centered in the frame, slightly tilted, half-open to reveal its contents. The folder has a white tab on top labeled "/SKILLS" in bold uppercase white sans-serif. Inside the folder, three stacked flat white index-card icons are visible: the top card labeled "SKILL.md", the middle card labeled "references/", the bottom card with a small coral asterisk-starburst icon attached to its corner. A thick white hand-drawn curved arrow arcs from outside the folder toward the SKILL.md card, with a clear arrowhead.

[3] Dominant background charcoal #1F1F1F with dot-grid texture, coral #E97B5D accent on the folder and the asterisk, white #FFFFFF for the labels, cards, and arrow, flat-stylized vector aesthetic for everything, NOT photoreal. Even soft lighting, slight drop shadow on the cards. Mood: structured, educational.

[4] no real or rendered logos of any kind, no empty rectangles or reserved gaps, no photoreal rendering, no busy backgrounds, no text outlines, no gradients on text, no extra people in frame, no cartoon or illustrated rendering, no neon colors, no navy blue, no purple, no green, no em dashes in any rendered text.
```

### Progressive disclosure: "The Skills Folder Structure" in 4 frames

Plan:
- step-1: just the closed coral folder with white tab, label "/SKILLS"
- step-2: step-1 + folder is now half-open, internal cards visible (3 stacked white cards)
- step-3: step-2 + the top card now reads "SKILL.md", the middle card reads "references/"
- step-4: step-3 + a white hand-drawn arrow arcs from outside toward the SKILL.md card

Frame 1 prompt (text-to-image):
```
[1] A flat deep-charcoal #1F1F1F background with a subtle dot-grid texture pattern overlay, evenly lit.
[2] A flat coral #E97B5D file folder centered in the frame, slightly tilted, CLOSED, with a white tab on top labeled "/SKILLS" in bold uppercase white sans-serif. The folder is the only object on the canvas.
[3] {locked style block}
[4] {locked negatives block}
```

Frame 2 prompt (image-to-image, frame 1 as medias[0]):
```
Take the provided image (medias[0]) as the base. Keep the background, palette, layout, and all existing elements EXACTLY identical to the base; do not remove, recolor, reposition, or modify anything that's already there. Add only the following new element: the folder transitions from closed to half-open, revealing three stacked flat white index-card icons inside (no text on the cards yet). The cards sit in the open portion of the folder.

{locked style block}
{locked negatives block + do not regenerate or reinterpret the existing image, only add the new element}
```

Frame 3 prompt (image-to-image, frame 2 as medias[0]):
```
Take the provided image (medias[0]) as the base. Keep the background, palette, layout, and all existing elements EXACTLY identical. Add only: text labels on two of the existing white cards. The top card now reads "SKILL.md" in black bold sans-serif. The middle card reads "references/" in black bold sans-serif. The bottom card stays blank.

{locked style block}
{locked negatives block}
```

Frame 4 prompt (image-to-image, frame 3 as medias[0]):
```
Take the provided image (medias[0]) as the base. Keep the background, palette, layout, and all existing elements EXACTLY identical. Add only: a thick white hand-drawn curved arrow with a clear arrowhead, arcing from the upper-left of the frame toward the SKILL.md card inside the folder. The arrow should be in the signature sketchy / marker-style line.

{locked style block}
{locked negatives block}
```

## Writing Style Rules

Same as thumbnails:
- Practitioner authority, not hype
- Concrete nouns, not adjective stacks
- No em dashes (use commas, periods, parentheses)
- Banned hype words: amazing, incredible, stunning, mind-blowing, revolutionary, ultimate, supercharged
- Prefer specifics ("a single white card with SKILL.md") over generics ("some files")
- 2 to 3 words per line in any rendered text, 2 lines max

## Pre-Send Checklist

- [ ] If any reference images exist, Step 0 (visual read) was performed and observations folded into blocks 1/2/3
- [ ] For `single`: all 4 blocks present and in order
- [ ] For `progressive-disclosure` frame 1: standard 4-block prompt
- [ ] For `progressive-disclosure` frames 2 to N: addition instruction + locked style + locked negatives, with `medias[0]` set to the previous frame
- [ ] Aspect ratio is `16:9`
- [ ] Model is `nano_banana_2` (or `flux_kontext` if frames are drifting)
- [ ] All user-provided references are in `medias[]`
- [ ] Prompt under ~200 tokens per frame
- [ ] No em dashes anywhere
