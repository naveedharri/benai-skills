---
type: reference
skill: video-cutter
tags: [cutting, algorithm, ffmpeg, whisper]
status: active
---

## The cutting algorithm

For each target cut point, find the best sentence-aligned cut nearby. The algorithm has three layers.

### Layer 1: Find sentence-ending words

Iterate word timings. A "sentence end" is any word whose text ends with `.`, `!`, or `?` (with optional trailing quote).

### Layer 2: Match each sentence-end to a nearby silence

For each sentence-ending word, find silences from the `ffmpeg silencedetect` output where `silence_start` is within `[word.end - 0.4, word.end + 2.0]`. Pick the longest silence in that window (deepest pause = strongest sentence break).

### Layer 3: Filter by next-word opener

Look at the word AFTER the period. Reject if it starts with any banned opener:

`but, and, so, now, however, it, this, that, they, these, there`

These are filler/transitional words that break the "strong subject" rule for clip starts.

### Pick the best candidate

Among all candidates passing layers 1, 2, 3 within `search_radius` seconds of the target, pick the one closest to the target. The actual cut happens at the MIDPOINT of the chosen silence (deepest audio quiet, cleanest audio cut).

### Why re-encode, not -c copy

`-c copy` is fast but snaps cuts to the nearest keyframe (typically every 2 to 10 seconds in YouTube downloads). This produces visually-correct cuts that do not match the audio cut point, leading to mid-sentence boundaries even after the algorithm picked correctly. Always re-encode (`-c:v libx264 -preset medium -crf 20 -c:a aac -b:a 192k`).

### When no candidate exists

If no sentence-end + silence + clean-opener combination exists within the radius, raise `ValueError`. The agent surfaces this to the caller for a manual cut point.
