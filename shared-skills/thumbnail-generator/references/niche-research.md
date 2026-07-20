# Niche Thumbnail Research

Before generating, scan what is actually winning in Ben's niche for the given topic, distill the visual patterns that map to Ben's angle, and let the user steer. This runs once, up front, and its output feeds the ideation step. It is a research pass, not a generation pass: never copy a competitor frame, only borrow the pattern that works and re-express it in the Ben AI visual language.

## When to run it

Run the research pass by default whenever the input is a **video idea / topic** and the mode is `new-with-ben`, `ben-plus-other`, or `no-face`.

Skip it (or offer to skip) when:
- The mode is `variation` (the reference already is the direction).
- The user says "skip research", "just generate", "I already know the direction", or hands you a fully specified concept.
- No research connector is available (see fallbacks). Say so in one line and proceed to ideation on the locked visual language.

## Tool priority

1. **VidIQ (preferred)**: richest signal (outlier scores, views-vs-baseline, keyword demand).
2. **Apify YouTube scraper**: fallback when VidIQ is unavailable.
3. **youtube connector `searchVideos`**: last-resort fallback; gives titles + thumbnails but no performance signal.

Detect availability at runtime; do not hard-fail if a connector is missing. Degrade to the next tier and tell the user which tier ran.

## VidIQ workflow

1. **Derive 1 to 3 search phrases** from the topic that match how the niche titles this subject (e.g. topic "Claude skills for founders" -> "claude skills", "claude code skills", "claude ai workflow"). Keep them tight to Ben's actual angle, not the broad category.
2. **Find what is overperforming**, in this order:
   - `vidiq_outliers` on the phrase(s): surfaces videos beating their channel baseline. This is the strongest "what's working" signal; prefer it.
   - `vidiq_youtube_search` / `vidiq_trending_videos` to widen the pool when outliers are thin.
   - Optionally `vidiq_keyword_research` to confirm the phrasing has real demand.
3. **Pull the thumbnails** for the top ~8 to 12 results (`https://img.youtube.com/vi/{videoId}/maxresdefault.jpg`, fall back to `hqdefault`) and `Read` the 5 to 8 most relevant.
4. **Filter to Ben's angle.** Discard results that share the keyword but not the angle (wrong audience, wrong framing, clickbait that Ben would not run). Only keep thumbnails whose *approach* could plausibly serve this specific video.
5. **Extract the pattern, not the picture.** For each kept thumbnail note: the hook mechanic (big number, before/after, face reaction, single bold object, arrow-to-payoff), the text treatment, and the one thing making it click. Cross-reference against Ben's own `references/brand-examples/` so recommendations stay on-brand.

## What to present

Present a short, skimmable slate the user can react to. Group as **"What's working in the niche right now"** with 3 to 5 distilled *patterns* (not raw links), each one line:

```
What's working for "<topic>" right now:

1. Big-number payoff: "12 …", oversized numeral left, one coral object. (seen on 4 outliers)
2. Before/after split: messy vs clean, single white arrow between. (2 outliers, high views-vs-baseline)
3. One bold object, no face: giant coral folder + /command label. Matches our /de-slop frame.
4. Reaction face + 2-word hook: surprised Ben, "STOP DOING X".

Want me to base the thumbnails on any of these, mix a couple, or go fully custom with our own angle?
```

Rules for the slate:
- Distill to **patterns**, never dump a list of competitor URLs or raw titles. One line each.
- Where VidIQ gives it, tag the strength lightly ("seen on 4 outliers", "high views-vs-baseline"). No raw IDs, no metrics tables in chat.
- Always end with the explicit choice: **pick one, mix, or go fully custom.** The user may reject everything; that is a valid, common answer.
- Keep it to one screen. This is a steering checkpoint, not a report.

## Handling the response

- **User picks / mixes patterns** -> fold the chosen mechanics into the N ideation angles. Still re-express in Ben's palette, dot-grid, Ben-on-right composition. Never clone the competitor frame.
- **User rejects everything / "go custom"** -> ignore the research entirely and ideate fresh from the locked visual language and brand examples. Do not re-litigate; the niche scan was input, not a mandate.
- **User is silent on specifics but says "go"** -> pick the single strongest on-angle pattern, note that choice in one line, proceed.

## Save

Record the research in the batch `manifest.md` under a `## Niche Research` section: the phrases searched, the tool tier used, the patterns surfaced, and which the user chose (or "user went fully custom"). This keeps future variations grounded in the same scan.
