---
name: generate-visual
description: >
  Generate on-screen visuals for Ben van Sprundel's YouTube videos using
  Higgsfield. Same brand system as the thumbnails (charcoal + coral, dot-grid,
  flat-stylized icons, bold uppercase text), but optimized for in-video slides
  shown during a tutorial. Use when the user says generate a visual, make a
  slide, on-screen graphic, video visual, explain this concept visually,
  progressive disclosure, step-by-step reveal, or shares a concept and asks
  for a slide to show during their video. Two modes: single (one slide from
  one prompt) and progressive-disclosure (N sequential frames where each
  builds on the previous by adding one element at a time, locking
  background/composition across the entire sequence). Saves per-video to
  Projects/youtube/{video-slug}/visuals/.
---

# Generate Visual

On-screen video visual generator. Takes a concept and produces either a single visual or a progressive-disclosure sequence in Ben's locked brand system.

## Two Modes

### `single`

One slide, one prompt, one call. Same flow as the thumbnail generate skill except no Ben in frame by default (slides are the visual the audience sees, Ben is talking over them). The supporting visual IS the hero.

Use when the user says: "make a slide showing X," "visual for this section," "one image of the concept."

### `progressive-disclosure`

A sequence of N visuals (typically 2 to 6) where each frame adds one new element to the previous. The story unfolds as Ben clicks through them on-screen. Background, palette, composition, and previously-shown elements stay LOCKED across the entire sequence; the only change between frame K and frame K+1 is the ADDITION of one new piece.

Use when the user says: "progressive disclosure," "step-by-step reveal," "build this up across slides," "show the layers," "frame-by-frame walkthrough," or describes a concept that naturally unfolds in stages.

Implementation: iterative image-to-image. Generate frame 1 from a prompt. For frame 2, pass frame 1 as `medias[0]` and prompt the model to add element X. For frame 3, pass frame 2 (the just-generated image) as `medias[0]` and add element Y. Continue until all N frames are generated. This locks visual continuity because each frame is literally derived from the previous one. See `references/progressive-disclosure.md` for the full mechanic.

## Inputs

What the skill needs from the user:

1. **Concept** — what the visual should show. ("The skills folder structure: SKILL.md plus references/ inside it")
2. **Mode** — `single` or `progressive-disclosure`. Inferred from the concept if not stated (multi-stage concepts default to progressive-disclosure).
3. **Number of steps** — only for progressive-disclosure (default 4, max 6).
4. **Video slug** — the topic-slug of the video this visual belongs to (used in the output path: `Projects/youtube/{video-slug}/visuals/`). Required. Ask once if missing.
5. **Reference image(s)** (optional but recommended, may be multiple) — past slides, sketches, screenshots, real logo PNGs, or anything that should anchor the look. All references must be READ first via the `Read` tool, then passed to `medias[]`. **If the user mentions a reference but doesn't provide a path or attachment, ASK for the path BEFORE doing anything else.** Do not guess, do not proceed, do not generate without seeing the path.

If the concept is vague or `video-slug` is missing, ask ONE combined question:

> "What's the video slug for this visual (e.g., `claude-code-skills-explained`), and what should the visual show?"

## UX Rules

1. **One question max per run, only if a required input is missing.**
2. **No raw IDs in chat.** Save them to `manifest.md`. Show file paths and the per-frame summary.
3. **No internal jargon.** Don't narrate "generating frame 2 from frame 1...". The user sees images appear.
4. **Read references visually.** Use the `Read` tool on every reference image before building prompts. Extract palette, composition, motifs, lighting. Fold into the prompt.
5. **Detect language and respond in it.** Technical args stay English.

## Brand System (locked, mirrors thumbnails)

Visuals use the same Ben AI thumbnail visual language documented in this skill's `references/visual-language.md` (which is a near-copy of the thumbnail-generate skill's version).

Defaults:
- **Background**: deep charcoal `#1F1F1F` with subtle dot-grid texture (or cream `#F5E6D8` / solid coral `#E97B5D` for variety)
- **Accent**: coral `#E97B5D` on folders, app icons, asterisk marks, key shapes
- **Text**: pure white on dark, near-black on light, bold uppercase sans-serif (Inter Black style); editorial black serif (Playfair Display style) for wordmarks
- **Render style**: supporting visuals are flat-stylized, NOT photoreal; any photographic element stays photoreal
- **Layout**: visual is usually the hero, centered or composed for clarity. Ben is NOT in frame by default. Text is concise (2 to 4 words per line max)
- **Aspect ratio**: always 16:9

If Ben should appear in the visual (rare for slides), use the latest `ben_reference_*.jpg` from `Projects/youtube/thumbnails/refs/` as `medias[0]` for that frame only.

## Flow

### Single Mode

```
1. Parse user message: concept, video-slug, references, mode. If a reference is mentioned but no path was provided, STOP and ask for the path before continuing.
2. READ every reference image visually using the Read tool on each file path. MANDATORY — do not skip even when you think you know what's in the image. Extract palette, composition, motifs, lighting, render style, any brand marks visible. State observations briefly in chat (one sentence per ref) so the user can verify you actually read them.
3. Load Ben AI thumbnail visual language defaults.
4. Build the prompt (4-block template adapted for slides: Scene, Hero Visual, Style, Negatives).
5. Generate ONE call: nano_banana_2, count: 1, aspect_ratio: "16:9", resolution: "2k". Pass any references as medias[].
6. Save to Projects/youtube/{video-slug}/visuals/{topic-slug}/v1.png and manifest.md.
7. Deliver the path.
```

### Progressive Disclosure Mode

```
1. Parse user message: concept, video-slug, references, count = N steps (default 4). If a reference is mentioned but no path was provided, STOP and ask for the path before continuing.
2. READ every reference image (Read tool). Extract palette, composition, motifs.
3. PLAN the disclosure sequence: write out what each of the N frames will contain.
   - Frame 1: base concept (the simplest version of the visual)
   - Frame 2: frame 1 PLUS new element A
   - Frame 3: frame 2 PLUS new element B
   - ...
   - Frame N: full revealed concept
   Show the plan in chat in a compact list BEFORE generating, so the user can intervene if a step is off.
4. Build prompt 1 (the base frame). Generate ONE call: nano_banana_2, count: 1, aspect_ratio: "16:9", resolution: "2k". Pass any user-provided references as medias[].
5. For each subsequent frame K (K = 2 to N):
   - Use the just-generated frame K-1 as medias[0]
   - Prompt: "Take the provided image as the base. Keep the background, palette, layout, and all existing elements EXACTLY identical. Add only: {new element K}. Do not remove or modify anything from the base."
   - Generate ONE call. Save as step-K.png.
6. Save all N frames to Projects/youtube/{video-slug}/visuals/{topic-slug}/ with manifest.md listing the disclosure plan and per-frame prompts.
7. Deliver the paths (sequential list).
```

Total calls: N (one per frame). Total credits: ~12 per frame on `nano_banana_2`.

## Output Layout

```
Projects/youtube/{video-slug}/visuals/{topic-slug}/
├── manifest.md
├── single mode:
│   └── v1.png
└── progressive-disclosure mode:
    ├── step-1.png
    ├── step-2.png
    ├── step-3.png
    └── step-4.png
```

Use `{topic-slug}` so multiple visuals can live under the same video without colliding (e.g., `claude-code-skills-explained/visuals/folder-structure/` and `claude-code-skills-explained/visuals/three-skill-types/`).

## Manifest Schema

```yaml
---
type: visual-batch
date: {YYYY-MM-DD}
video_slug: {video-slug}
topic_slug: {topic-slug}
mode: single | progressive-disclosure
frames: {1 for single, N for progressive-disclosure}
tags: [visual, youtube, {video-slug}]
status: candidates
---

## Concept
{full concept description from the user}

## Disclosure Plan (progressive-disclosure mode only)

- step-1: {what's in frame 1}
- step-2: step-1 PLUS {new element}
- step-3: step-2 PLUS {new element}
- ...

## Locked Style Block (identical across all frames in progressive-disclosure)
{block 3 wording: palette, render style, mood}

## Frame Prompts

### step-1 (or v1 for single mode)
{full prompt sent to Higgsfield}

### step-2 (progressive-disclosure only)
{full prompt with image-to-image edit instruction}

...

## References
- {description + media_id or job_id of each user-provided ref passed to medias[]}

## Job IDs
- step-1: {job_id}
- step-2: {job_id}
- ...

## Notes
{anything worth remembering for future revisions}
```

## Core Rules

Non-negotiable.

1. **Prefer real logos passed as reference images. Never let the model hallucinate a brand mark from text alone, and never instruct it to leave an empty rectangle for a logo.** When a topic involves a brand mark or logo: first check `Projects/youtube/thumbnails/logos/` for a matching real logo PNG. If one exists, pass it as a `medias[]` entry and instruct the prompt to render that exact mark from the reference. If no logo reference is available, describe the element generically (don't name the brand) and tell the user they can composite the real logo in post. Hallucinated brand marks (model inventing the Anthropic asterisk, Claude wordmark, OpenAI logo from text alone) stay banned; real PNG references are encouraged.
2. **Reference images are first-class inputs. The order is strict: READ then UNDERSTAND then BUILD then PASS. This is non-negotiable; the skill has been caught skipping it.** When the user provides one or more references: (a) READ each image visually with the `Read` tool — this is MANDATORY, not optional, even when you "know what it probably looks like." (b) UNDERSTAND it — extract palette, composition, motifs, lighting, render style, and any specific brand marks or icons present. State observations in chat in one short line per ref so the user can verify you actually read them. (c) BUILD the prompt with those observations folded in. (d) PASS every relevant reference into `medias[]` of the generate_image call. Don't skip steps; don't generate without reading first. **If the user mentions a reference image but doesn't provide a path or attachment, STOP and ask for the path before proceeding. Do not guess, do not proceed without it.**
3. **If MULTIPLE references are provided, read ALL of them and pass every relevant one to `medias[]`.** Never pre-select just one when more were given. Strongest anchor first (`medias[0]`).
4. **Keep on-screen text minimal.** 2 to 4 words per line, 2 lines maximum. Slides are visual-led; the long explanation goes in Ben's narration over the slide, not on the slide itself. Long text also renders worse — fewer words means cleaner kerning.
5. **For progressive-disclosure, lock the background / palette / layout / composition across all N frames.** The only change between frame K and K+1 is the ADDITION of one element. Use image-to-image (frame K-1 as `medias[0]`) for every frame after the first; never regenerate from scratch.
6. **The disclosure plan is shown in chat BEFORE generating** so the user can correct a step if it's off.
7. **Default model is `nano_banana_2`** for both single and progressive-disclosure modes. `flux_kontext` is the alternative for progressive-disclosure if `nano_banana_2` struggles with "preserve existing elements exactly"; see `references/models.md` for the swap.
8. **Always save the manifest** with the disclosure plan and per-frame prompts in plain English.
9. **Aspect ratio is always 16:9.** No exceptions.
10. **Never use em dashes.** Per `CLAUDE.md` project rule.
11. **Ask at most one question per run.** Default everything else.
12. **Required input: `video-slug`.** Without it, the output path can't be built; ask once.

## When Things Break

See `references/troubleshooting.md` for the full catalog.

Quick triage:
- **Progressive frames diverge (frame 3 looks different from frame 2)** → confirm `medias[0]` is the immediately-previous frame, not the original concept. Use the just-generated image, not the planned-prompt image.
- **Added element doesn't show up** → make the element description more specific in the prompt; restate position ("in the top-right corner, a small...").
- **Model removed an existing element** → tighten the instruction: "preserve all existing elements EXACTLY as they appear in the provided image; do not remove, recolor, or reposition anything; ADD only:".
- **Style drift across frames** → the locked style block in block 3 wasn't pasted verbatim into every frame. Re-paste, regenerate from the drift point onward.

## Difference From youtube-thumbnail-generate

| Aspect | thumbnail-generate | generate-visual |
|---|---|---|
| Output | one thumbnail per run (3-4 variants of the same concept) | one slide (single mode) or N sequential frames (progressive-disclosure) |
| Subject | Ben is usually in frame (right third) | Ben is usually NOT in frame; supporting visual is the hero |
| Variation pattern | distinct creative angles per variant | progressive disclosure: same scene + accumulating elements |
| Save location | `Projects/youtube/thumbnails/generated/{date}-{topic}/` | `Projects/youtube/{video-slug}/visuals/{topic-slug}/` |
| Aspect ratio | 16:9 | 16:9 |
| Brand system | locked Ben AI thumbnail visual language | same |
| Model | `nano_banana_2` default | `nano_banana_2` default; `flux_kontext` alternative for progressive |

Both skills share the same brand system, the same "read all refs and pass them all" rule, and the same "no real logos, no empty rectangles" rule.
