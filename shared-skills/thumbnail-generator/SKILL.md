---
name: thumbnail-generator
description: "Generate on-brand YouTube thumbnails for Ben van Sprundel using Higgsfield in one shot. Use when the user says create a thumbnail, make a YT thumbnail, thumbnail for video, generate ben thumbnail, variation of last thumbnail, or shares a video concept and asks for a thumbnail. Auto-infers mode from the inputs (variation, new-with-ben, ben-plus-other, no-face), defaults to 3 variants, asks at most one question. On topic-driven runs it first researches what is working in the niche (VidIQ preferred, else Apify or the youtube connector), distills the winning patterns, and lets the user pick or mix before generating. Uses reference images as the identity anchor and anchors on the 10 most recent shipped thumbnails in references/brand-examples/. No Soul training required. Reads the locked style spec at Context/youtube-thumbnail-style.md if present. Real logos are never rendered; the thumbnail fills the frame edge-to-edge and the user composites the logo in post."
disable-model-invocation: true
---

# YouTube Thumbnail Generate

One-shot thumbnail generation. Takes a concept (plus optional reference image and count), infers everything else, ships 3 variants and a manifest.

## Inputs

Two things, ideally both in the user's first message:

1. **Concept**: what the thumbnail should show. A sentence or phrase. ("Claude Code Skills, why it changes everything for solo founders")
2. **Reference image(s)** (optional but recommended, may be multiple): a past thumbnail, a photo of Ben, a second subject, a style anchor, a real logo PNG, or any combination. Determines the mode AND all of them must be passed into the generation. Never silently drop a user-supplied reference; if they gave you one, it must end up in `medias[]`. If they gave you a LIST, read EVERY image in the list, then pass every relevant one (don't pre-select just one). Every reference image MUST be visually read with the `Read` tool before the prompt is built (see rule 2).

**If the user mentions a reference image but does not provide a path or attachment, ASK for the path BEFORE doing anything else.** Examples that require asking: "use my previous thumbnail as a ref" (which file?), "include the Anthropic logo" (where is the PNG?), "match this style" (which image?). Ask in one short line: *"Got it, what's the file path for the reference image?"* Do not guess, do not proceed, do not generate without seeing the path.

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

## Style Spec (silent)

Read `Context/youtube-thumbnail-style.md` if it exists; pull palette, framing library, expression library, lighting, prohibited list, and anchor refs. If it is missing or has `[FILL]` blocks, do not refuse: fall back to the locked Ben AI visual language in `references/visual-language.md` (the source of truth for palette, layout, framing, wardrobe, lighting, banned colors, prohibited elements, and logo handling). Surface a one-line note at the end (not before generation): "Style spec missing or incomplete; used the locked Ben AI thumbnail visual language."

## UX Rules

1. **One question max per run, and only if a required input is missing.** Default everything else.
2. **No raw IDs in chat.** Save `job_id`s to the manifest. Show the user file paths and a one-line summary.
3. **No internal jargon.** Don't narrate "inferring mode...", "loading style spec...", "calling generate_image...". Just do it.
4. **Detect language and respond in it.** Technical args (hex codes, model names) stay English.
5. **Don't preview the prompt** unless the user asks. The 4-block prompt is internal.
6. **Don't suggest mode switches** unless generation fails. Trust the inference.

## Flow

The whole loop is one chat turn. No intermediate confirmations.

```
1. Parse user message: extract concept, attached images, count.
2. Infer mode. For new-with-ben without an attached photo, pull the most recent ben_reference_*.jpg from refs/. If missing, ask once.
3. NICHE RESEARCH (topic-driven runs only). When the input is a video idea/topic and mode is new-with-ben, ben-plus-other, or no-face, run the research pass in references/niche-research.md BEFORE ideation, then present 3 to 5 winning PATTERNS and ask "base the thumbnails on any of these, mix a couple, or go fully custom?" Wait for the steer. Going fully custom is a valid, common answer. Skip for variation mode, when the concept is already fully specified, or when the user says skip/just-generate. If no research connector is available, say so in one line and continue.
4. READ every reference image visually with the Read tool on each file path. This is MANDATORY; do not skip even when you think you already know what the image looks like. If a path was mentioned but not provided, STOP and ask for it. ALSO read 2 to 4 of Ben's most recent shipped thumbnails from references/brand-examples/ (closest to the topic) as the ground-truth brand anchor. Extract per ref: dominant colors with rough hex, composition pattern, lighting mood, render style, texture, recurring motifs. State observations briefly in chat (one sentence per ref) so the user can verify. Then identify the SHARED style signals across all refs; these are the strongest brand cues to lock into every variant. Pass every relevant ref to medias[] (up to nano_banana_2's 4-ref limit; if more, pick the 4 most representative and tell the user). Detail: references/prompt-builder.md.
5. Load style spec (or fall back to locked defaults).
6. IDEATE N distinct creative angles for the concept (one per requested variant), folding in the chosen niche pattern(s) from step 3 (or going fully custom if the user rejected them). Each angle gets a different headline, supporting visual, and framing. Brainstorm in chat in a compact one-line-per-variant list, then proceed. Do NOT generate N near-identical variants. Detail: references/variation-ideation.md.
7. Build N prompts internally (4-block template from references/prompt-builder.md per variant). Across all N prompts, block 2 (Subject: Ben's face, expression, framing, wardrobe, camera angle) and block 4 (Negatives) stay IDENTICAL. Only block 1 (Scene) and block 3 (Style: the supporting visual and any motif specifics) change between variants. Fold the step-4 visual observations into every variant's blocks. Never surface prompts unless asked.
8. Generate N times: one generate_image call per variant with count: 1, aspect_ratio: "16:9", resolution: "2k". EVERY call passes the same Ben reference photo (or the same primary ref) as medias[0] so the face stays locked. Sequential calls so each lands in the manifest in order.
9. Save outputs to Projects/Youtube/thumbnails/generated/{YYYY-MM-DD}-{topic-slug}/ with manifest.md.
10. Deliver paths and the one-line logo-composite reminder.
```

## Cost Preflight

Preflight only when `count > 3`, or model is `gpt_image_2`, or the estimate exceeds 50 credits. Then pass `params.get_cost: true` first, show the credit cost, and generate on confirm. Otherwise generate directly. Cost table and details: `references/models.md`.

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

Every batch writes `manifest.md` in the output folder using the template and field list in `references/manifest.md`. This is non-negotiable; future "vary v2" calls depend on the stored `job_id`s.

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

1. **Prefer real logos passed as reference images; never hallucinate a brand mark from text, never leave an empty rectangle for a logo.** When a topic involves a brand mark, first check `Projects/youtube/thumbnails/logos/` for a matching PNG. If found, pass it in `medias[]` and instruct the prompt to render that exact mark. If none, describe the element generically (don't name the brand) and tell the user they can composite the real logo in post. Detail: `references/prompt-builder.md`, `references/visual-language.md`.
2. **Reference images are first-class inputs. The order is strict: READ, then UNDERSTAND, then BUILD, then PASS.** READ each with the `Read` tool (mandatory, even when you think you know it), extract colors/composition/lighting/render style/texture/motifs/brand marks, state one line per ref in chat, fold the observations into blocks 1, 2, and 3, then pass every relevant ref into `medias[]`. A user-supplied reference overrides style-spec defaults on conflict. If a reference is mentioned but no path is given, STOP and ask. Detail: `references/prompt-builder.md`.
3. **If MULTIPLE references are provided, read ALL and pass every relevant one to `medias[]`.** Strongest anchor first (`medias[0]`). If more than `nano_banana_2` accepts (4 max), pick the 4 most representative (Ben photo first, then distinct style cues, then logo PNGs) and tell the user which in one line.
4. **For `new-with-ben`, always pass a current photo of Ben as `medias[0]`.** If none attached, pull the most recent `ben_reference_*.jpg` from `refs/`. If none exists, ask once.
5. **Across all variants of a batch, Ben's face, expression, framing, wardrobe, and camera angle stay identical.** Lock block 2 (Subject) verbatim; pass the same `medias[0]` to every call. Variation lives in the scene and supporting visuals only.
6. **For `count > 1`, brainstorm N distinct creative angles before generating**, then make N separate `generate_image` calls with `count: 1` (not one call with `count: N`, which produces near-duplicates). Detail: `references/variation-ideation.md`.
7. **Keep on-screen text minimal: 2 to 4 words per line, 2 lines maximum.** The visual carries the message; text is the punchline. If a concept needs more text, tighten the hook.
8. **Default model is `nano_banana_2` for every mode.** Switch to `gpt_image_2` only when text rendering is the hero. Never invent a model ID; use `references/models.md`.
9. **Always save the manifest** with each variant's distinct angle in plain English. Future runs depend on it.
10. **Never use em dashes.** Per `CLAUDE.md` project rule.
11. **Aspect ratio is always 16:9.** No exceptions.
12. **Ask at most one question per run.** Default everything else. The one exception is the niche-research steering checkpoint (rule 15), a deliberate pause, not a missing-input question.
13. **Fall back gracefully when the style spec is incomplete.** Use the locked visual-language defaults and flag once at the end.
14. **Read the brand examples before building a Ben thumbnail.** For every `new-with-ben`, `ben-plus-other`, or `variation` run, `Read` 2 to 4 shipped thumbnails in `references/brand-examples/` closest to the topic; they override written defaults on conflict. Refresh per that folder's README.
15. **Run niche research on topic-driven runs, then let the user steer.** When the input is a video idea and mode is not `variation`, scan the niche per `references/niche-research.md`, distill 3 to 5 on-angle patterns, present them, and ask whether to base on any, mix, or go fully custom. Wait for the answer. Rejecting all and going custom is valid. Skip when no research connector is available (say so in one line), the concept is fully specified, or the user says skip.

## When Things Break

See `references/troubleshooting.md` for the full catalog. Fail fast and surface a one-line cause to the user; do not loop or retry silently.

## Self-improvement

This skill is never finished. Improve it as you use it.
- When the user corrects how a step was done, update the relevant reference file (or this SKILL.md) so the correction sticks. Do not just fix it for this run. For generation-behavior corrections ("never put me in a suit", "lean yellow on tutorial topics"), append a dated entry to `references/skill-rules.md`; after 3 confirmations of the same rule, promote it into Core Rules above.
- When a correction is a hard rule ("always X", "never Y"), add it as a permanent rule here.
- When the user says a thumbnail was genuinely good, save it into `references/brand-examples/` so it becomes a model for future runs.
- Keep the skill small: when you add something, run the deletion test and cut anything that no longer changes behavior.
