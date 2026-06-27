# Higgsfield Models for Slides

Verified model lineup for slide generation. Same default as the thumbnail skill (`nano_banana_2`) plus a heavier reliance on `flux_kontext` for progressive disclosure.

## Active Models

| Model ID | Use for |
|---|---|
| `nano_banana_2` | **Default for both modes.** Strong instruction-following, multi-ref support (up to 4), 2K to 4K. Handles "add X to this image while preserving everything else" well most of the time. |
| `flux_kontext` | **Fallback for progressive disclosure when nano_banana_2 drifts.** Purpose-built for instruction-based image editing. Better at preserving the base image exactly during multi-frame sequences. |
| `gpt_image_2` | **Single mode only, when the slide is mostly rendered text.** Strongest at legible typography. Use sparingly; most slides should have minimal text. |
| `nano_banana_flash` | Quick exploration drafts when user asks for fast/cheap. Lower instruction-following; not recommended for final slides. |

Soul models (`soul_v2`, `soul_cinematic`) are NOT used. Slides rarely have Ben in frame, and the pipeline relies on reference images for any identity anchoring needed.

## Decision Matrix

```
Is this a single slide?
   YES, text is the hero -> gpt_image_2
   YES, supporting visual is hero -> nano_banana_2
   NO -> continue

Progressive disclosure, frame 1?
   -> nano_banana_2 (no medias needed beyond user-provided refs)

Progressive disclosure, frames 2 to N?
   Default -> nano_banana_2 with previous frame as medias[0]
   If frame K drifted from frame K-1 -> switch to flux_kontext for frame K+1 and onward
```

## Required Params Per Model

### `nano_banana_2` (default, both modes)

For single mode or progressive-disclosure frame 1:

```json
{
  "model": "nano_banana_2",
  "prompt": "...",
  "aspect_ratio": "16:9",
  "count": 1,
  "params": {
    "resolution": "2k",
    "negative_prompt": "{negatives block string}"
  },
  "medias": [
    { "role": "image", "value": "<media_id of user-provided ref, if any>" }
  ]
}
```

For progressive-disclosure frames 2 to N:

```json
{
  "model": "nano_banana_2",
  "prompt": "Take the provided image as the base. Keep everything identical. Add: {new element}...",
  "aspect_ratio": "16:9",
  "count": 1,
  "params": {
    "resolution": "2k",
    "negative_prompt": "{negatives block string + 'do not regenerate the existing image'}"
  },
  "medias": [
    { "role": "image", "value": "<job_id of the immediately-previous frame>" }
  ]
}
```

`medias[0]` MUST be the just-generated previous frame, not the user's original reference.

### `flux_kontext` (progressive disclosure fallback)

```json
{
  "model": "flux_kontext",
  "prompt": "Add {new element} to the provided image. Preserve all existing elements exactly.",
  "aspect_ratio": "16:9",
  "count": 1,
  "medias": [
    { "role": "image", "value": "<job_id of the previous frame>" }
  ]
}
```

`flux_kontext` is purpose-built for this. Shorter prompts (under 100 tokens) work better than long descriptions. State the addition clearly and stop.

### `gpt_image_2` (single mode, text-hero)

```json
{
  "model": "gpt_image_2",
  "prompt": "...",
  "aspect_ratio": "16:9",
  "count": 1,
  "params": {
    "resolution": "2k"
  }
}
```

Single-ref; if user provided one reference image, pass it as `medias[0]`.

## Cost Preflight

Preflight when:
- Total estimate exceeds 50 credits (e.g., progressive disclosure with 5+ frames)
- Model is `gpt_image_2` (highest per-call cost)

Use `params.get_cost: true` to preview. Tell the user the credit cost. Generate on confirm.

Rough cost per frame at 2K, 16:9:

| Model | Credits per frame |
|---|---|
| `nano_banana_2` | ~12 |
| `flux_kontext` | ~8 |
| `gpt_image_2` | ~15 |
| `nano_banana_flash` | ~6 |

## Aspect Ratio and Resolution

Slides are always `16:9`, `2k`. No exceptions.

## Media Roles

Same as the thumbnail skill. Only `image` role is used. `nano_banana_2` accepts up to 4 entries (use this for slides with multiple style refs); `flux_kontext` and `gpt_image_2` accept 1.

## Reference Sources

`medias[].value` accepts:
1. A `media_id` from `media_upload` + `media_confirm`
2. A `job_id` from a prior generation (used heavily in progressive disclosure)
3. A direct image URL or local file path

For progressive disclosure, prefer passing `job_id` as the previous frame reference — no re-uploading needed. For user-provided references, upload once and reuse the `media_id`.

## Discovery Guardrail

When looking for a model not in this list, run `models_explore` with no filter to see the full catalog. If the user says a model exists but it isn't appearing, trust them and verify with the unfiltered list before answering. Never invent a model ID.

## Changelog

- 2026-05-14: initial set for the generate-visual skill. `nano_banana_2` is default; `flux_kontext` documented as progressive-disclosure fallback. Soul models excluded (slide pipeline doesn't need trained identity).
