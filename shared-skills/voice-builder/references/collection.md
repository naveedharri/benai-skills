# Collection guide: sources, connectors, windows, rules

## Non-negotiable collection rules

1. **Verbatim text.** Preserve typos, casing, punctuation, dropped apostrophes, emoji (and whether they're unicode or :shortcodes:), line breaks. Convert HTML to plain text but keep paragraph structure. Never "clean up" anything.
2. **Context per item.** For replies: the post/message being answered (or a 1-2 line gist). For posts: date and engagement if available. For chat: channel and a context line. Reply shapes can't be learned without knowing what was being replied to.
3. **Author filtering.** Verify every item was written by the person. Newsletters: check the actual sender address per issue. Chat: filter by user ID, not display name. Community: filter by member ID or email.
4. **One file per source** in a working directory, with a header stating count, date range, and method. The distillation analysts read these files.

## Recommended windows and volumes

Enough to measure, not everything ever. These worked in production:

| Source | Window | Target volume |
|---|---|---|
| YouTube transcripts | last 10 videos | ~30-50K spoken words |
| Community comments | last 1 month (extend to 2 if < 25 items) | 50-120 comments |
| Slack / team chat | last 1-2 weeks | 50-100 messages |
| LinkedIn posts | last 2-3 months | 10-20 posts |
| Newsletters | last 1-2 weeks daily / 2-3 months weekly | 5-10 issues |
| DMs (LinkedIn/Instagram/WhatsApp) | last 3-4 months | 30-60 sent messages |
| Dictation transcripts | all available | as much as exists |

Flag thin corpora in the reference file ("only 6 issues from one atypical promo week") so downstream drafting knows which claims are hypotheses.

## Transcription tool scan

Run before the interview answer comes back - people forget these exist. Check, in order:

```bash
# Wispr Flow (SQLite history)
ls ~/Library/Application\ Support/Wispr\ Flow/ 2>/dev/null       # look for flow.db or similar
# Aqua Voice
ls ~/Library/Application\ Support/Aqua* 2>/dev/null
# superwhisper (JSON/text history per recording)
ls ~/Documents/superwhisper/recordings 2>/dev/null
# MacWhisper
ls ~/Library/Containers/*macwhisper* 2>/dev/null; ls ~/Library/Application\ Support/MacWhisper* 2>/dev/null
# generic: anything with "whisper", "dictation", "flow", "voice" in app support
ls ~/Library/Application\ Support/ | grep -iE "whisper|dictat|flow|aqua|voice" 2>/dev/null
```

For SQLite stores: inspect with `sqlite3 <db> ".tables"` then `".schema <table>"`, export the transcript text column, and split by destination app where metadata allows (dictations into Slack vs email vs browser map to different registers). On Windows, check `%APPDATA%` equivalents; on Linux, `~/.config/`.

Dictation data refines the SPOKEN fingerprint (filler words, connectors, sentence chaining) and the casual registers. It does not replace channel corpora - merge findings into the register files rather than creating a "dictation register".

## Source → access path → fallback

Probe the primary path with one cheap call before committing to it. If a needed connector is missing, ask the user to connect it (name the exact connector); only fall back silently when the fallback is equivalent.

| Source | Primary | Fallbacks |
|---|---|---|
| YouTube transcripts | YouTube Data API connector/CLI for the video list + captions | `yt-dlp --write-auto-subs` per video; the person's script files if they script videos |
| Circle community | Circle MCP/API: community-wide comment listing filtered by the member's email/ID beats per-post enumeration (one production sweep paginated 18x100 comments and filtered, far cheaper) | Circle admin export; copy-paste of representative threads |
| Skool / Discord / other communities | their API or MCP if connected | browser automation; manual export |
| Slack | Slack MCP: search `from:@Person after:<date>` across channel types, then read threads for context lines | workspace admin export |
| LinkedIn posts | Apify actor (e.g. harvestapi/linkedin-profile-posts) with the profile URL | manual copy of recent posts |
| LinkedIn DMs | Unipile (filter `is_sender=1`) | manual export from LinkedIn settings |
| Instagram DMs | Unipile or Meta export | manual "Download your information" export |
| WhatsApp | Unipile | chat export .txt files (WhatsApp's built-in export) |
| Newsletters | Gmail search in a subscriber's inbox (`from:<sender> after:<date>`), dedupe double-subscriptions, strip tracking URLs and footers, VERIFY SENDER per issue | ESP export (Kit/ConvertKit, beehiiv, Mailchimp) |
| Blog/articles | scrape the person's site (Firecrawl or fetch) | files from the user |

## Auto-caption caveat (YouTube)

ASR transcripts carry the person's verbatim cadence but unreliable punctuation and systematic misrecognitions (one Dutch speaker's "Claude" rendered as "Kloud"/"cloud" throughout). Normalize only systematic product-name artifacts; instruct the distillation analyst to base claims on words and phrase patterns, never on ASR punctuation.

## Delegation notes

- Launch one collector per source, in parallel, each writing to its own corpus file and returning only a summary (counts, range, path) - never the corpus itself.
- Prefer general-purpose agents told explicitly which tools to load; specialized agents sometimes launch without their connectors. If a collector reports "no such tool", relaunch with explicit tool-loading instructions instead of accepting the failure.
