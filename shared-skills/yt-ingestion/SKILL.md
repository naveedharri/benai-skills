---
name: yt-ingestion
description: Fetch a YouTube video's raw artifacts (video file, transcript, word-level timestamps, thumbnail, metadata) without committing to a downstream workflow. Use when the user wants just the ingestion output for debugging, scratch work, or feeding into another tool. Triggers on phrases like "get me the transcript", "download this video", "fetch artifacts for", "ingest this YouTube URL".
---

# yt-ingestion: standalone artifact fetcher

When triggered, invoke the `yt-ingestion-agent` sub-agent with:
- `youtube_url`: the URL from the user's message
- `output_dir`: by default, `Team/BenAI/Profiles/Milan/Daily/{today}/yt-ingestion-{video-id}/`. If the user specifies an output directory, use theirs.

Surface the resulting manifest path to the user when done. If the agent surfaces a 3-option choice (e.g., 1080p blocked), present those options to the user and pass their selection back.

## Profile boundary

Output writes to `Profiles/Milan/`. See [[yt-pipeline SPEC|SPEC.md]] for the full invariant.

## When NOT to use this skill

- The user wants a full course package: use `yt-to-course` instead.
- The user wants a community announcement post: use `yt-to-community` instead.

For details on the fallback chain, see [[fallback-strategies]].
