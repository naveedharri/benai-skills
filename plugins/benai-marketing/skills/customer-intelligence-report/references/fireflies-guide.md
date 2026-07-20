# Fireflies Collection Guide

How to pull the period's meetings from Fireflies. Read this in the collection step. The
heavy transcript reading is fanned out to subagents so the main context stays on synthesis.
All targeting values (which organizer, which team) come from the run config, never hardcode
them here (see `report-config.md`).

## Tools
Fireflies MCP tools (match by suffix, the server prefix may vary by install):
- `fireflies_get_transcripts`: list meetings. Primary discovery call.
- `fireflies_get_transcript`: full transcript for one meeting by id.
- `fireflies_get_summary`: meeting summary (overview, action items, topics). Cheaper than
  the full transcript, prefer it first.
- `fireflies_search`: keyword search across meetings, to confirm a theme's spread.
- `fireflies_get_user` / `fireflies_get_user_contacts`: resolve team membership for `team`
  scope.

## Listing meetings (the gotchas that matter)
Call `fireflies_get_transcripts` with:
- `fromDate` and `toDate`: camelCase, ISO 8601 with an explicit timezone offset, for example
  `"2026-06-22T00:00:00+05:30"` to `"2026-06-28T23:59:59+05:30"`. Use the config timezone.
- Scope filter: for `person`/`team` scope pass `organizers: ["email@domain"]` from config. Do
  NOT rely on `mine: true`, it returns empty on the current Fireflies MCP.
- `format: "json"`, not the default, so the result is parseable with jq.

Caps and truncation:
- `limit` caps at 50 per call and silently truncates beyond that. Paginate with `skip`:
  call `skip: 0`, then `skip: 50`, and so on until a page returns fewer than 50, then stop
  and accumulate. Most periods are well under 50.
- A busy period can push the list response past the inline token limit, in which case the
  runtime saves it to a file instead of returning it inline. Read that file and parse with
  jq rather than paging a raw dump through context.

Filtering:
- `duration` is an integer count of minutes. Drop meetings under 5 minutes (accidental
  joins).
- For a customer or community scope, optionally drop internal-only meetings using the
  participant rule in `report-config.md` (at least one participant outside your core team).

## Pulling content (fan out)
1. Main agent lists meetings for the range and reports the count to the user before the
   deep pull.
2. Fan out one subagent per meeting (or per small batch). Each subagent calls
   `fireflies_get_summary` first, then `fireflies_get_transcript` (param `transcriptId`,
   camelCase) only if the summary is too thin, and returns small structured notes:
   topics/questions/problems/decisions, each with the speaker and one verbatim quote, plus
   the transcript id and a timestamp if available.
3. Main agent collects the notes and runs the analysis (`analysis-framework.md`).

Sampling when a period is large (more than ~15 meetings survive the filter): pull full
transcripts only for the longest few, any participant who also appears in another source
this period (cross-source evidence is strongest), and anyone appearing in 2+ meetings. Use
metadata-only records (title, participants, duration) as theme-presence evidence for the
rest.

## Fallback
If subagents cannot reach the Fireflies MCP in the current environment, the main agent calls
`fireflies_get_summary`/`fireflies_get_transcript` directly, firing as many calls in parallel
per turn as possible. On API error, retry a few times with backoff. On final failure,
produce the report from the other source (see `circle-guide.md`) and note the outage. Never
invent a meeting, a count, or a quote to fill a gap.
