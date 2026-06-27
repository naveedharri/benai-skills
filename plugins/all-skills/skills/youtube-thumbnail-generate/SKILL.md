---
name: youtube-thumbnail-generate
description: >
  Generate on-brand YouTube thumbnails for Ben van Sprundel using Higgsfield in
  one shot. Use when the user says create a thumbnail, make a YT thumbnail,
  thumbnail for video, generate ben thumbnail, variation of last thumbnail, or
  shares a video concept and asks for a thumbnail. Auto-infers mode from the
  inputs (variation, new-with-ben, ben-plus-other, no-face), defaults to 3
  variants, and asks at most one question. Uses reference images as the identity
  anchor (a current photo of Ben from refs/, plus optional past thumbnails or
  style anchors). No Soul training is required. Reads the locked style spec at
  Context/youtube-thumbnail-style.md if present. Real logos are never rendered.
  The thumbnail fills its frame edge-to-edge; the user composites the actual
  logo on top in post.
---

# YouTube Thumbnail Generate

One-shot thumbnail generation. Takes a concept (plus optional reference image and count), infers everything else, ships 3 variants and a manifest.

## Inputs

Two things, ideally both in the user's first message:

1. **Concept** — what the thumbnail should show. A sentence or phrase. ("Claude Code Skills, why it changes everything for solo founders")
2. **Reference image(s)** (optional but recommended, may be multiple) — a past thumbnail, a photo of Ben, a second subject, a style anchor, a real logo PNG, or any combination. Determines the mode AND ALL of them must be passed into the generation. Never silently drop a user-supplied reference; if they gave you one, it has to end up in `medias[]`. If they gave you a LIST, read EVERY image in the list, then pass every relevant one to `medias[]` (don't pre-select just one). Also: every reference image MUST be visually read (via the `Read` tool on the file path) before the prompt is built, so the prompt captures each reference's actual style, texture, palette, composition, and recurring motifs rather than relying only on the style spec defaults.

**If the user mentions a reference image but does not provide a path or attachment, ASK for the path BEFORE doing anything else.** Examples that require asking: "use my previous thumbnail as a ref" (which file?), "include the Anthropic logo" (where is the PNG?), "match this style" (which image?). Ask in one short line: *"Got it — what's the file path for the reference image?"* Do not guess, do not proceed, do not generate without seeing the path.

Optional third: **variant count**. Defaults to 3. Max 4.

If the concept is missing or genuinely unclear, ask ONE combined question:

> "What should the thumbnail show, and how many variations do you want? (default 3)"

Do not split into multiple questions. Do not ask about mode, model, or palette; all of that is inferred or read from the style spec.

## Identity Anchor (no Soul required)

Every `new-with-ben` thumbnail uses a reference photo of Ben as the identity anchor, passed as `medias[0]`. The photo lives at `Projects/youtube/thumbnails/refs/ben_reference_{YYYY-QQ}.jpg`.

If the user did NOT attach a photo of Ben and there is no `ben_reference_*.jpg` in `refs/`, ask once for a photo. Without it, `new-with-ben` cannot produce a faithful Ben rendering.

If multiple `ben_reference_*.jpg` files exist, pick the most recent (highest `YYYY-QQ` suffix). Note which one was used in the manifest.

## Mode Auto-Inference

| User attached | Concept hints | Mode | Model | Reference flow |
|---|---|---|---|---|
| 16:9 image that looks like a past thumbnail | "vary this", "tweak this", "redo with X" | `variation` | `nano_banana_2` | past thumbnail as `medias[0]` |
| A portrait of Ben | Ben centered in the concept | `new-with-ben` | `nano_banana_2` | user-supplied photo as `medias[0]` |
| Two images (Ben + something) | "Ben plus X" | `ben-plus-other` | `nano_banana_2` (multi-ref) | Ben as `medias[0]`, second subject as `medias[1]` |
| No image | Object or abstract concept, no Ben | `no-face` | `nano_banana_2` (or `gpt_image_2` if concept centers on rendered text) | optional style anchor as `medias[0]` |
| No image | Concept mentions Ben | `new-with-ben` | `nano_banana_2` | most recent `ben_reference_*.jpg` from `refs/` as `medias[0]`. If none, ask. |

`nano_banana_2` is the default model for every mode. Switch to `gpt_image_2` only when text rendering is the hero element of a no-face thumbnail.

## Style Spec Handling (silent)

Read `Context/youtube-thumbnail-style.md` if it exists. Pull:
- Palette, framing library, expression library, lighting, prohibited list, anchor refs

If the spec is missing or has `[FILL]` blocks: don't refuse. Fall back to the locked Ben AI thumbnail visual language (see `references/visual-language.md` for the full catalog). Built-in defaults:

- **Palette**: deep charcoal `#1F1F1F` background with subtle dot-grid texture, signature coral `#E97B5D` accent on folders / app icons / asterisk marks, white `#FFFFFF` for primary text and hand-drawn arrows, near-black `#0A0A0A` for text on light backgrounds
- **Layout**: Ben on the right third, text and supporting visuals on the left third, one hand-drawn white curved arrow from text toward the visual
- **Framing**: chest-up, Ben on right third
- **Expression**: slight smile (default), focused neutral for analytical topics
- **Wardrobe**: plain black t-shirt or hoodie
- **Lighting**: soft front-left key, gentle rim from behind, no hard shadows
- **Banned colors**: navy blue, royal blue, sky blue, pure red, magenta, purple (except Obsidian purple for Obsidian topics), green, neon variants
- **Prohibited**: real logos rendered by the model, empty rectangles or reserved gaps in the composition, centered composition when Ben is in frame, multiple arrows, cartoon/illustrated rendering of Ben, em dashes
- **Logos**: never reserved as a gap in the render. The thumbnail fills edge-to-edge. Logos are composited on top in Figma or Canva on the winner.

Surface a one-line note at the end (not before generation): "Style spec missing or incomplete; used the locked Ben AI thumbnail visual language." The locked defaults below ARE the source of truth; no separate setup skill is required.

## UX Rules

1. **One question max per run, and only if a required input is missing.** Default everything else.
2. **No raw IDs in chat.** Save `job_id`s to manifest. Show the user file paths and a one-line summary.
3. **No internal jargon.** Don't narrate "inferring mode...", "loading style spec...", "calling generate_image...". Just do it.
4. **Detect language and respond in it.** Technical args (hex codes, model names) stay English.
5. **Don't preview the prompt** unless the user asks. The 4-block prompt is internal.
6. **Don't suggest mode switches** unless generation fails. Trust the inference.

## Flow

The whole loop is one chat turn. No intermediate confirmations.

```
1. Parse user message: extract concept, attached images, count.
2. Infer mode. For new-with-ben without an attached photo, pull the most recent ben_reference_*.jpg from refs/. If missing, ask once.
3. READ every reference image visually using the Read tool on each file path. This is MANDATORY — do not skip even when you think you already know what the image looks like. Read each one. If a path was mentioned but not provided, STOP here and ask for it. Extract per ref: dominant colors with rough hex equivalents, composition pattern, lighting mood, render style (photoreal vs flat-stylized), texture (grain, dot-grid, smooth), recurring motifs visible. State observations briefly in chat (one sentence per ref) so the user can verify you actually read them. Then identify the SHARED style signals across all refs ("all 5 use the dot-grid background and coral folder; 3 use a hand-drawn arrow") — these shared signals are the strongest brand cues to lock into every variant. Pass every relevant ref to medias[] (up to nano_banana_2's 4-ref limit; if more, pick the 4 most representative and tell the user).
4. Load style spec (or fall back to locked defaults).
5. IDEATE N distinct creative angles for the concept (one per requested variant). Each angle should have a different headline, different supporting visual, and a different framing of why-this-topic-matters. Brainstorm in chat in a compact one-line-per-variant list, then proceed. Do NOT generate N near-identical variants of one composition; that's wasted credits.
6. Build N prompts internally (4-block template from references/prompt-builder.md per variant). Across all N prompts, blocks 2 (Subject — Ben's face, expression, framing, wardrobe, camera angle) and 4 (Negatives) stay IDENTICAL. Only blocks 1 (Scene) and 3 (Style — the supporting visual and any motif specifics) change between variants. Fold the visual observations from step 3 into every variant's blocks. Never surface prompts unless asked.
7. Generate N times: one `generate_image` call per variant with `count: 1`, `aspect_ratio: "16:9"`, `resolution: "2k"`. EVERY call passes the same Ben reference photo (or the same primary ref) as `medias[0]` so the face stays locked. Sequential calls so each lands in the manifest in order.
8. Save outputs to Projects/Youtube/thumbnails/generated/{YYYY-MM-DD}-{topic-slug}/ with manifest.md. Manifest lists each variant's distinct angle in plain English.
9. Deliver paths and the one-line logo-composite reminder.
```

## Cost Preflight

Only preflight when:
- `count > 3`, OR
- model is `gpt_image_2` (highest per-variant cost), OR
- estimate exceeds 50 credits

Otherwise generate directly. When preflighting: `params.get_cost: true` first, show the credit cost, generate on confirm.

## Output

After saving, deliver in this shape:

```
3 thumbnails ready for "claude-code-skills":
- Projects/Youtube/thumbnails/generated/2026-05-14-claude-code-skills/v1.png
- Projects/Youtube/thumbnails/generated/2026-05-14-claude-code-skills/v2.png
- Projects/Youtube/thumbnails/generated/2026-05-14-claude-code-skills/v3.png

Pick the winner, composite the logo from Projects/Youtube/thumbnails/logos/ in Figma or Canva.
```

No mode label, no model name, no credit count unless the user asks.

## Manifest (saved silently)

Every batch writes `manifest.md` in the output folder with:

```yaml
---
type: thumbnail-batch
date: {YYYY-MM-DD}
topic: {topic}
mode: {inferred mode}
model: {model_id used}
ben_reference: {filename of ben_reference_*.jpg used, or null if no-face}
variants: {count}
tags: [thumbnail, youtube, {topic-slug}]
status: candidates
---

## Concept Angles (one per variant)

- v1: {headline} — {one-line description of the supporting visual and hook}
- v2: {headline} — {one-line description}
- v3: {headline} — {one-line description}
- ...

## Locked Subject Block (identical across all variants)
{block 2 wording — Ben's face, expression, framing, wardrobe, camera angle}

## Variant Prompts

### v1
{full 4-block prompt sent to Higgsfield for v1}

### v2
{full 4-block prompt sent to Higgsfield for v2}

...

## References
- {description + media_id or job_id of each ref passed to medias[]}

## Job IDs
- v1: {job_id}
- v2: {job_id}
- ...

## Notes
{anything worth remembering for future variations}
```

This is non-negotiable. Future "vary v2" calls depend on stored `job_id`s.

## Variation Shortcut

If the user says "vary v2 of the last one" or "redo number 3":
1. Find the most recent `manifest.md` in `generated/`.
2. Read the matching `job_id`.
3. Pass that `job_id` as `medias[0]` to `nano_banana_2`.
4. Build a short edit prompt from the user's change description.
5. Save to a new dated folder with its own manifest.

No extra questions; the past run is the reference.

## Core Rules

Non-negotiable. Numbered for cross-reference.

1. **Prefer real logos passed as reference images. Never let the model hallucinate a brand mark from text alone, and never instruct it to leave an empty rectangle for a logo.** When a topic involves a brand mark or logo: first check `Projects/youtube/thumbnails/logos/` for a matching real logo PNG. If one exists, pass it as a `medias[]` entry and instruct the prompt to render that exact mark from the reference. If no logo reference is available, describe the element generically in the prompt (don't name the brand) and tell the user they can composite the real logo in post. Hallucinated brand marks (model inventing the Anthropic asterisk, Claude wordmark, OpenAI logo from text alone) stay banned; real PNG references are encouraged.
2. **Reference images are first-class inputs. The order is strict: READ then UNDERSTAND then BUILD then PASS. This is non-negotiable; the skill has been caught skipping it.** When the user provides one or more references: (a) READ each image visually with the `Read` tool — this is MANDATORY, not optional, even when you "know what it probably looks like." If you don't read it, you don't see it; if you don't see it, the prompt is wrong. (b) UNDERSTAND it — extract dominant colors with rough hex, composition pattern, lighting mood, render style, texture, recurring motifs, AND identify any specific brand marks or icons present. State the observations in chat in one short line per ref so the user can verify you actually read them. (c) BUILD the prompt with those observations folded into blocks 1, 2, and 3. (d) PASS every relevant reference into `medias[]` of the generate_image call. Don't skip steps; don't generate without reading first. A user-supplied reference is a stronger signal than the style spec; let what you see in the reference override defaults when they conflict. **If the user mentions a reference image but doesn't provide a path or attachment, STOP and ask for the path before proceeding. Do not guess, do not proceed without it.**
3. **If MULTIPLE references are provided, read ALL of them and pass every relevant one to `medias[]`.** Never pre-select just one when more were given. Order matters: strongest anchor first (`medias[0]`), then supporting refs. If the user gave more references than `nano_banana_2` accepts (4 max), pick the 4 most representative — Ben photo first if present, then refs covering distinct style cues, then any logo PNGs — and tell the user in one line which were used and why.
4. **For `new-with-ben` mode, always pass a current photo of Ben as the identity anchor.** If the user didn't attach one, pull the most recent `ben_reference_*.jpg` from `refs/`. If none exists, ask once before generating.
5. **Across all variations of a single batch, Ben's face / expression / framing / wardrobe / camera angle MUST stay identical.** Lock block 2 (Subject) of the prompt; reuse the same wording for every variant. The reference photo for Ben is passed as `medias[0]` to every call so the identity stays consistent. Variation lives in the SCENE and SUPPORTING VISUALS only.
6. **For batches with `count > 1`, brainstorm N distinct creative angles before generating.** Each variant should be a different conceptual hook (different headline, different metaphor, different supporting visual), not a reshuffle of the same composition. Make N separate `generate_image` calls with `count: 1` rather than one call with `count: N`; the latter produces near-duplicates and wastes credits. See `references/variation-ideation.md` for the ideation pattern and a worked example.
7. **Keep on-screen text minimal.** 2 to 4 words per line, 2 lines maximum. The visual carries the message; text is the punchline, not the explanation. If a concept needs more than 2 lines of text, it's the wrong concept for a thumbnail; tighten the hook. Long text also renders worse — fewer words means cleaner kerning, sharper letterforms, no garbled spillover.
8. **Default model is `nano_banana_2` for every mode.** Only switch to `gpt_image_2` when text rendering is the hero element. Never invent a model ID; stick to `references/models.md`.
9. **Always save the manifest** with each variant's distinct creative angle in plain English. Future runs depend on it.
10. **Never use em dashes.** Per `CLAUDE.md` project rule.
11. **Aspect ratio is always 16:9.** No exceptions.
12. **Ask at most one question per run.** Default everything else.
13. **Fall back gracefully when style spec is incomplete.** Don't refuse; use locked visual-language defaults and flag at the end.

## When Things Break

See `references/troubleshooting.md` for the full catalog. The skill should fail fast and surface a one-line cause to the user, not loop or retry silently.

Common triage:
- **`nsfw` or `ip_detected` rejection** → remove brand names or public figures from the concept; retry once.
- **Model rendered a fake logo or empty rectangle** → tighten negatives (`no real or rendered logos of any kind, no empty rectangles or reserved gaps`); retry.
- **Ben looks off** → confirm the latest `ben_reference_*.jpg` is in `refs/`, is recent (under 90 days), and matches the wardrobe rules. Pass it as `medias[0]`. If still off, ask the user for a better photo.
- **Style drift** → compare to anchor refs in `Projects/Youtube/thumbnails/refs/`; re-read the style spec.
- **User-provided reference was ignored** → confirm the ref is in `medias[]` of the call. If the model dropped it, increase its prominence in the prompt (`use the provided reference as the visual anchor`) and retry.

## Progressive Updates

When the user corrects something during a run ("never put me in a suit", "always lean yellow on tutorial topics"), append a dated entry to `references/skill-rules.md`. After 3 confirmations of the same rule, promote it into Core Rules above.
