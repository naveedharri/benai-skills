---
type: reference
skill: yt-ingestion
tags: [yt-dlp, transcript, fallback]
status: active
---

## Video download fallback chain

When yt-dlp fails (HTTP 403, SABR streaming, PO token required, etc.), the script attempts these in order:

1. Default yt-dlp settings at requested resolution
2. Alternative player clients (`ios`, `web_safari`, `mweb`)
3. Default settings plus Chrome cookies (`--cookies-from-browser chrome`)
4. Alternative clients plus Chrome cookies

If all attempts fail with `DownloadBlockedError`, the agent surfaces three explicit options to the user:

- Accept lower resolution (typically 360p via `-f 18`)
- Manual provide: user pulls the original from YouTube Studio and drops the file at a known path
- Skip download entirely (cut-sheet-only mode for video-cutter, which produces FFmpeg commands the user can run locally)

## Transcript fallback chain

Priority order:

1. YouTube MCP (`getTranscripts` from benai-suite YouTube MCP), most reliable, routes through an API key
2. `youtube-transcript-api` Python library, direct scrape, works in most cases but can be blocked on cloud IPs
3. User-provided plain text, when both auto methods fail. Section boundaries will be approximate (no timestamps).
