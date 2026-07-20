# Brand and Copy

The carousel is **Type B: image-first authority** from the Ben AI LinkedIn template. Slide 1 leads with Ben's portrait as a trust anchor; the rest is typographic.

## Palette (only these)

| Token | Hex | Use |
|-------|-----|-----|
| Cream | `#FAF3E3` | Slide background (always). Never a full black background. |
| Ink | `#050505` | Headlines, dark charcoal for eyebrows/body. |
| Highlight | `#FDEEC4` | The single pale-yellow marker highlight, one per headline. |
| Bar | `#14110E` | Footer bar only. |

No green, no blue, no red. Yellow is reserved for the one highlight (and the dashed swipe arrow).

## Type

- Headline: heavy geometric sans (Space Grotesk feel). Tight leading, left-aligned.
- Body / bullets: clean medium sans (Montserrat feel), warm dark gray.
- Eyebrow: **UPPERCASE, letter-spaced sans. Never cursive, script, or handwriting.** (Hard rule, Aryan.)

## Footer (code-composited, never model-drawn)

Dark bar across the bottom ~10.5%. Left: Ben's avatar on a **cream disc** (never black) with a cream ring, then "Ben Van Sprundel". Right: the **real Ben AI smiley** (circle + single upward "U" smile, no eyes/nose), recolored cream, then "Ben AI", then "NN / NN". Handled entirely by `scripts/footer.py`. The image model must not draw any footer, logo, name, or page number.

## Swipe arrow

Dashed yellow right-pointing arrow, lower-right, on every slide **except the last**.

## Copy architecture (the point of this skill)

Do not make every slide a dramatic header. Build an arc:

1. **Slides 1-3, big-header, high-impact.** Cover/hook (portrait), problem, first turn to the solution. One large headline + one highlight + short body. These read great on video and as the cover PNG (the cover is what actually sells the carousel).
2. **Middle slides, text-heavier substance.** Deliver the actual method so the carousel stands alone: smaller header + 2-4 short bullets, or numbered steps, or a simple labeled graphic (before/after, two columns, one icon per point). One idea per slide.
3. **Final slide, a CTA that makes sense.** Follow for more, watch the full breakdown, grab the skill/template. Never a CTA that assumes the reader shares it with a stranger or leans on context the slide never gave.

**Self-contained rule:** assume the caption is one line. Whatever the point is, the slides must actually teach or prove it. If the source only teases (e.g. "watch my video"), reconstruct the real substance into the middle slides.

## Slot budgets

| Slot | Budget |
|------|--------|
| eyebrow | 2-5 words, uppercase |
| headline | 4-9 words (hero), up to ~12 (body) |
| highlight | 1-3 consecutive words, the punchline, never a connector |
| body (hero) | 1-2 fragment lines, ~10 words |
| bullets (substance) | 2-4 bullets, ~3-7 words each |

## Voice (Ben)

Practitioner authority, second person ("you"), direct. State the claim, then back it up. Short punches. Specific verbs, real nouns, numbers when relevant.

**Never:** em dashes (use periods, commas, colons, or restructure); buzzwords (delve, leverage, robust, comprehensive, seamless); hedges (might, perhaps, in some cases); corporate-speak (solutions, ecosystem, synergy). See the org `Context/brand.md` for the full voice.

## CTA framings to draw from

- Follow: "Follow for the next one." / "Follow for more AI systems that work."
- Watch: "Watch the full breakdown." / "The step-by-step is on YouTube."
- Save: "Save this before your next long chat."
- Get: "Comment '{keyword}' for the skill." / "DM '{keyword}' for the template."

Pick the one that fits the content. If the carousel taught a method, "watch the full breakdown" or "grab the skill" usually beats a generic follow.
