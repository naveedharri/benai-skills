# Generate Visual Troubleshooting

Failure modes specific to slide generation. For progressive-disclosure-specific issues, see also `progressive-disclosure.md`.

## Authentication

| Error | Cause | Fix |
|---|---|---|
| `Session expired` | MCP auth aged out | Re-authenticate the Higgsfield MCP connector |
| `Not authenticated` | Never logged in | Authenticate the Higgsfield MCP connector |

## Validation

| Error | Cause | Fix |
|---|---|---|
| `Missing required params: prompt` | No prompt sent | Provide one |
| `Missing required params: medias` | Progressive frame 2+ needs the previous frame as medias[0] | Pass the previous `job_id` |
| `Invalid values: aspect_ratio=99:99` | Not in model's enum | Use `16:9` |
| `Invalid values: resolution=8k` | Cap | Use `2k` (or `4k` on nano_banana models) |
| `Unknown params: <name>` | Param doesn't exist on this model | Check `models.md` |
| `Model accepts only one image reference` | `gpt_image_2` or `flux_kontext` got multiple | Switch to `nano_banana_2` for multi-ref needs |

## Required Input Missing

| Symptom | Cause | Fix |
|---|---|---|
| Skill can't decide output path | `video-slug` not given | Ask once: "What's the video slug for this visual?" |
| Mode unclear | User didn't say single or progressive | Infer from concept: if it has stages, default to progressive-disclosure 4 frames; otherwise single |

## Progressive Disclosure Drifts Across Frames

Symptom: frame 3 looks notably different from frame 2 (background pattern changed, existing folder recolored, layout reshuffled).

Causes ranked by likelihood:

1. **`medias[0]` is wrong.** Frame K should reference frame K-1's `job_id`, not the original concept or a user-provided ref. The IMMEDIATELY previous frame is the base.
2. **Prompt was too long.** The "preserve existing" instruction got diluted. Trim adjective stacks.
3. **`nano_banana_2` can't preserve well enough.** Switch to `flux_kontext` for the remaining frames; rerun frame K with `flux_kontext` and continue from there.
4. **The new element is too large.** Adding a major new section forces recomposition. Break into two smaller additions.
5. **Locked style block wasn't pasted verbatim.** Re-paste, regenerate.

Fix at frame K (don't keep building on a drifted base): regenerate frame K with tighter preservation language, then continue.

## Progressive Disclosure: Added Element Doesn't Appear

Symptom: ran the prompt to "add X" but the output looks identical to the previous frame.

Causes:

1. **Description too vague.** "Add some decoration" doesn't tell the model what or where. Make it specific: "add a small coral asterisk in the top-right corner of the folder, 8% of frame width, centered 5% from the top edge."
2. **Conflict with negatives.** If you said "no extra elements" in negatives and "add X" in the prompt, the model defaults to no change. Remove the conflicting negative for that frame.
3. **The "new" element is too similar to an existing one.** Model collapses them. Make the new element visually distinct (different color, larger, different position).

## Progressive Disclosure: Model Removed an Existing Element

Symptom: the new element appeared, but something from the previous frame disappeared.

Fix: tighten preservation language. Add explicitly: "do not remove, recolor, or reposition the [name of the removed element]. It must remain exactly where it was in the base image."

If `nano_banana_2` keeps doing this, switch to `flux_kontext`.

## Slide Has Cluttered / Busy Background

Symptom: too much visual noise; the hero visual doesn't pop.

Causes:

1. **Dot-grid texture too aggressive.** Specify "subtle" or "barely-visible" dot-grid pattern.
2. **Background has gradient or color variation when it shouldn't.** Add to negatives: "no gradients, no color variation in the background; the background is a flat single color with only a subtle dot-grid overlay."
3. **Too many supporting elements.** Slides should have ONE focal point. If you have 4 things competing, you have 4 slides.

## Hero Visual Is Photoreal Instead of Flat-Stylized

Symptom: the folder looks like a glossy 3D object; the app icon has realistic depth and shadows.

Fix:

1. Add to prompt: "flat-stylized vector aesthetic, no photoreal rendering, no glossy or 3D effects, no realistic textures."
2. Reinforce in negatives: "no photoreal rendering of supporting visuals, no 3D effects, no glossy surfaces, no realistic shadows beyond a single subtle drop shadow."

If `nano_banana_2` keeps going photoreal, the prompt is probably referencing real-world objects too literally. Rephrase the visual ("a stylized icon of a folder" instead of "a folder").

## Text Doesn't Render Cleanly

Symptom: text is garbled, misspelled, or wrong font.

Fix:

1. Switch to `gpt_image_2` if text is the hero of the slide.
2. Keep text minimal — 2 to 4 words per line, 2 lines max.
3. Specify the font style explicitly: "bold uppercase sans-serif, heavy weight, similar to Inter Black or Anton".
4. Quote the exact text in the prompt: `the text reads "SKILLS UNLOCKED" exactly`.
5. If the model still mangles text, plan to composite the text in post (in Figma/Canva) and generate the visual without text.

## Slide Rendered a Warped or Wrong-Looking Logo

Symptom: a brand mark (Anthropic asterisk, Claude wordmark, etc.) appeared but with wrong proportions, distorted shape, or off colors.

Cause: the prompt named the brand but no real logo PNG was provided as a reference. The model hallucinated the mark from training-data fragments.

Fixes in order:

1. **Provide the real logo as a reference.** Check `Projects/youtube/thumbnails/logos/` for a matching PNG. Pass it as a `medias[]` entry and explicitly reference it in block 2: `render the provided logo (medias[N]) preserving its exact shape, color, and proportions.` The model uses the reference to copy the mark accurately.
2. **If no logo PNG is available**, rephrase to describe the element generically: `a coding assistant interface` instead of `the Claude Code interface`. Composite the real logo in post.
3. **Tighten negatives**: `no hallucinated brand marks, no invented logos, only render logos that appear in the provided reference images`.

## Workspace / Output Path Issues

Symptom: files saved to wrong location.

Fix: the path is `Projects/youtube/{video-slug}/visuals/{topic-slug}/`. Confirm `video-slug` and `topic-slug` are correctly derived from the user's input. Don't auto-create `video-slug`; ask if missing.

## Cost Overrun

If a progressive disclosure run costs more than expected:

1. Confirm preflight ran on the first call (`params.get_cost: true`).
2. Check the model: `gpt_image_2` is ~15 credits per frame; 6 frames is ~90 credits.
3. Tell the user the cost before generating; let them adjust frame count.

## Adding a Failure Mode

When a new failure surfaces in real runs, add it here with symptom, cause, and concrete fix. Don't add hypothetical failures.
