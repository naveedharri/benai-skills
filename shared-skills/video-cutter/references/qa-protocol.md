---
type: reference
skill: video-cutter
tags: [qa, verification, whisper]
status: active
---

## QA via head/tail re-transcription

After cutting each clip, verify the boundaries actually landed where the algorithm planned.

### Protocol

1. For each clip, extract the first 4 seconds and the last 4 seconds as separate audio files.
2. Run faster-whisper on each (beam_size=1, no VAD filter, both are short).
3. Compare the head transcript against the planned `opens_with` value and the tail transcript against the planned `ends_on` value.
4. Mark each clip as `pass` if head/tail contain the expected text, `flag` otherwise.

### Tolerance

Whisper output may differ slightly from the source transcript (different model, slight word substitutions on noisy audio). Use fuzzy matching: check whether the LAST 4 words of `ends_on` appear in the tail transcript in roughly the right order. Same for opener at the start of head.

### Surfacing flags

The agent surfaces flagged clips to the calling skill. The caller decides whether to re-pick the cut point or accept the discrepancy.
