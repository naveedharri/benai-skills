# Higgsfield Model Reference

Verified Higgsfield image models for thumbnail work. Last verified: 2026-05-14 via `models_explore`.

Never invent a model ID. If you think you need one not listed here, call `models_explore` first, confirm the ID is real, then add it to this file with a dated note.

The thumbnail pipeline uses reference images as the identity anchor (not a trained Soul Character). Therefore `nano_banana_2` is the default model for every mode. Soul models (`soul_v2`, `soul_cinematic`) are documented but NOT used.

## Default Models for Thumbnails

| Model ID | Strength | Weakness | Use for |
|---|---|---|---|
| `nano_banana_2` | Sharpest text, strongest instruction-following, multi-ref support (up to 4), 2K to 4K. Aka Nano Banana Pro. Works with a reference photo to anchor identity at ~75-85% faithfulness. | Slightly less identity-faithful than a trained Soul. Acceptable for most thumbnails. | **Default for every mode**: variation, new-with-ben, ben-plus-other, no-face |
| `nano_banana_flash` | Fast 4K, cheaper. | Lower instruction-following than `nano_banana_2`. | Quick exploration drafts when user asks for fast/cheap |
| `gpt_image_2` | Best at rendering legible text directly in the image. | Stylized, less photoreal. | `no-face` thumbnails where text is the hero element |
| `flux_kontext` | Instruction-based editing of a provided image. | Less identity-faithful than `nano_banana_2`. | Surgical edits to an existing thumbnail (recolor a sticky note, swap a monitor display) |

## Decision Matrix

```
Is the topic a slight variation of an existing thumbnail?
   YES -> nano_banana_2 with the old thumbnail as medias[0]
   NO  -> continue

Does Ben's face need to be in the frame?
   YES, alone           -> nano_banana_2 with the latest ben_reference_*.jpg as medias[0]
   YES, with another    -> nano_banana_2 with ben_reference as medias[0] + second subject as medias[1]
   NO                   -> continue

Is text the hero element of the thumbnail?
   YES -> gpt_image_2
   NO  -> nano_banana_2

Surgical edit on a thumbnail you already have?
   -> flux_kontext
```

## Required Params Per Model

### `nano_banana_2` (default)

```json
{
  "model": "nano_banana_2",
  "prompt": "...",
  "aspect_ratio": "16:9",
  "count": 3,
  "params": {
    "resolution": "2k"
  },
  "medias": [
    { "role": "image", "value": "<media_id or url or job_id>" }
  ]
}
```

Supports up to 4 reference images. First ref is the strongest anchor. For `new-with-ben`, `medias[0]` is always a current photo of Ben.

### `gpt_image_2`

```json
{
  "model": "gpt_image_2",
  "prompt": "...",
  "aspect_ratio": "16:9",
  "count": 3,
  "params": {
    "resolution": "2k"
  }
}
```

Use only for text-hero no-face thumbnails.

### `flux_kontext`

```json
{
  "model": "flux_kontext",
  "prompt": "edit instructions, e.g. change the sticky note text to API and swap the monitor to a dark theme",
  "aspect_ratio": "16:9",
  "count": 1,
  "medias": [
    { "role": "image", "value": "<media_id of the thumbnail to edit>" }
  ]
}
```

## Cost Preflight

Always pass `params.get_cost: true` on the first call when `count > 3` or model is `gpt_image_2`. It returns the credit cost without burning credits. If the total cost is over 50 credits, stop and confirm with the user.

Rough cost per variant at 2K, 16:9:

| Model | Credits per variant |
|---|---|
| `nano_banana_2` | ~12 |
| `nano_banana_flash` | ~6 |
| `gpt_image_2` | ~15 |
| `flux_kontext` | ~8 |

These are estimates; the API is the source of truth.

## Aspect Ratios and Resolution

For thumbnails we always use `16:9`. These are the supported sets if you ever deviate:

| Model | Aspect ratios | Resolution |
|---|---|---|
| `nano_banana_2` | broad set including `16:9`, `9:16`, `1:1`, `4:3`, `3:4` | `resolution: "2k"` or `"4k"` |
| `nano_banana_flash` | same as nano_banana_2 | up to `"4k"` |
| `gpt_image_2` | `16:9`, `9:16`, `1:1`, `4:3`, `3:4` | `resolution: "2k"` |
| `flux_kontext` | matches source image if editing | inherits from source |

If you pass an unsupported value, Higgsfield either coerces to the closest match (returns an `adjustments` map) or hard-rejects with `Invalid values: ...`. Always pass a value from the model's enum.

## Media Roles per Model

The `medias[]` array entries each have a `role`. Get it wrong and the API rejects locally. For thumbnails the only role we use is `image`.

| Model | Accepted roles for `medias[].role` | Max refs |
|---|---|---|
| `nano_banana_2` | `image` | up to 4 |
| `gpt_image_2` | `image` | 1 |
| `flux_kontext` | `image` | 1 |

`nano_banana_2` is the only model in our stack that supports multi-ref. Use it for `ben-plus-other` and any composition with both Ben and a style anchor.

## Reference Sources (medias[].value)

Each `medias[].value` accepts three things interchangeably:

1. A `media_id` from `media_upload` + `media_confirm` (persistent across sessions)
2. A `job_id` from a prior generation (auto-detected; "vary v2" works this way)
3. A direct image URL (publicly accessible) or a local file path the MCP can upload

For thumbnails, prefer `job_id` from prior generations whenever possible. It avoids re-uploading and keeps the manifest's reference chain clean. For Ben reference photos, upload once via `media_upload`/`media_confirm` and store the returned `media_id`; reuse it across runs until the photo is replaced.

## Discovery Guardrail

When looking for a Higgsfield model or feature, don't trust semantic search or the first match. Run `models_explore` with no filter to see the full catalog. If the user says a model exists but it isn't appearing, trust them and verify with the unfiltered list before answering.

## Soul Models (NOT used in this pipeline)

The Higgsfield catalog includes `soul_v2` and `soul_cinematic` which take a trained `soul_id` for ~95% identity faithfulness. We are NOT using them. The pipeline relies on reference photos passed to `nano_banana_2` instead, which:

- Skips the 10+ minute training step
- Requires no paid Higgsfield plan (Soul training is paid-only)
- Lets the user swap reference photos freely without retraining
- Costs roughly the same per generation

If identity drift becomes a recurring problem across batches, Soul training can be added later as a future enhancement. Until then: do NOT call `soul_v2` or `soul_cinematic` even if a model_id is technically valid; the pipeline has no `soul_id` to pass to them.

## Adding a New Model

If `models_explore` surfaces a new model that beats `nano_banana_2`:

1. Run a test generation on a known topic with the proposed swap.
2. Compare side by side with `nano_banana_2`.
3. If clearly better, propose the swap to the user with a one-line tradeoff.
4. On approval, update this file: change the decision matrix and add a dated entry under `## Changelog`.

## Changelog

- 2026-05-14: removed Soul models (`soul_v2`, `soul_cinematic`) from the active set. Pipeline now uses reference images with `nano_banana_2` as the default for every mode. Soul models documented in a "NOT used" section for future reference.
- 2026-05-13: initial verified set from `models_explore`. Included Soul models as primary identity anchor.
