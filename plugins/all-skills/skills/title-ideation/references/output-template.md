# Output Template (read at Phase 6 only)

Single markdown response in chat. Persist to `Projects/youtube/{video-slug}/title-shortlist.md` only if asked.

```markdown
## Video
{Topic + Ben's take, one line}

## Top subject clusters right now (last 20 to 25 uploads per channel)
{Ranked clusters: count, channels, median views/day, example titles + numbers}

## Title structures winning right now
{Patterns in use, with recent example titles + numbers}

## Ben's proven format for this subject (if any)
{Flag it, with his own numbers}

## What this video actually is (video-first)
- Core promise / viewer + driver / single click reason / 3 to 5 angle hypotheses
- Reshape note: which proven cluster or format this video should ride, if any

## Option Set A, topic-based
{3 to 4 titles, each: subject cluster ridden, recent evidence, implied structure, on-brand check}

## Option Set B, pattern-based
{3 to 4 titles, each: pattern used, recent evidence, implied structure, on-brand check}

## Rejected pattern-fills
{Patterns that did not fit and why}

## Recommendation
{Strongest across both sets + one A/B alternative, with reasoning}
```

Per-candidate requirements:

- Option Set A entries: title, subject cluster it rides, recent evidence (2 to 3 real titles from the last-25 pull with numbers), implied video structure, on-brand check.
- Option Set B entries: title, pattern used, recent evidence, implied structure, on-brand check. If a pattern would make the title vaguer or untrue, do not use it, list it under rejected pattern-fills instead.
- Vet every title against `brand.md`: no hype overpromise, no "build & sell / make money" framings, signature framings welcome where they fit, NEVER em dashes.
- Never propose a title that remakes an existing Ben video (the exact video, not the format).
