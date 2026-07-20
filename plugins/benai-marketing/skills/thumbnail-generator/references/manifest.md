# Batch Manifest

Every thumbnail batch writes `manifest.md` in its output folder. This is non-negotiable: future "vary v2" calls depend on the stored `job_id`s. Save it silently; do not surface raw IDs in chat.

## Template

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

## Niche Research
- Tool tier: {vidiq | apify | youtube-connector | skipped}
- Phrases searched: {phrases, or n/a}
- Patterns surfaced: {3 to 5 one-liners, or n/a}
- User steer: {pattern(s) chosen | mixed X + Y | went fully custom | research skipped}

## Concept Angles (one per variant)

- v1: {headline}, {one-line description of the supporting visual and hook}
- v2: {headline}, {one-line description}
- v3: {headline}, {one-line description}
- ...

## Locked Subject Block (identical across all variants)
{block 2 wording: Ben's face, expression, framing, wardrobe, camera angle}

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
