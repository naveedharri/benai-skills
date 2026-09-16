---
name: video-cutter
description: Cut any video into sentence-aligned clips at silence-midpoint boundaries given approximate target timestamps. Works on YouTube downloads, Loom recordings, uploaded MP4s, recorded calls. Triggers on "cut this video at", "split into sections", "make clips from", "cut at boundaries".
disable-model-invocation: true
---

# video-cutter: standalone sentence-aware cutter

When triggered, invoke the `video-cutter-agent` sub-agent with:
- `video_path`: path to the source video
- `word_timings_path`: path to a word-timings JSON, or null (the agent will transcribe with faster-whisper if missing)
- `target_cut_points`: approximate timestamps in seconds where the user wants cuts
- `output_dir`: default `Team/BenAI/Profiles/Milan/Daily/{today}/cuts/`, or user-specified
- `section_titles`: ordered names for the output clip filenames

If word timings are not provided, the agent will transcribe first. Pass `null` for `word_timings_path` to trigger this.

## Profile boundary

Output writes to `Profiles/Milan/` unless the user specifies otherwise. See [[yt-pipeline SPEC|SPEC.md]].

For the algorithm details, see [[algorithm]]. For QA verification, see [[qa-protocol]].
