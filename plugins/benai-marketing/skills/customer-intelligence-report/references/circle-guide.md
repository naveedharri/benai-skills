# Circle Collection Guide

How to pull the period's community activity from Circle. Read this in the collection step
alongside `fireflies-guide.md`. Circle posts and comments become theme evidence with
`source: "circle"`, blended with the Fireflies meeting evidence. All targeting values (which
space) come from the run config, never hardcode a space id here (see `report-config.md`).

## Tools
Circle MCP tools (match by suffix, the server prefix may vary by install):
- `posts_list` / `list_posts`: list posts in a space. Primary discovery call.
- `comments_list` / `list_comments`: comments on a post.
- `spaces_list`: resolve space ids when the user gives a space name instead of an id.
- `search_all`: keyword search across the community, to confirm a theme's spread.

## Listing posts (the gotchas that matter)
Call the list-posts tool with:
- `space_id`: from config. If the user gives a space name, resolve it with `spaces_list`
  first. Support more than one space by iterating the configured list.
- `per_page: 50`, `sort: "latest"` so the newest posts come first and in-window posts land
  at the top.
- If the list response exceeds the inline token limit it is saved to a file, read that file
  rather than paging a raw dump through context.

Filter to the period with a half-open window on `created_at`:
`created_at >= "{start}T00:00:00{tz}" AND created_at < "{end + 1 day}T00:00:00{tz}"`. The
half-open interval avoids the inclusive/exclusive ambiguity at the end boundary.

Pagination: if `meta.has_more` is true, page through until the window is covered (the newest
in-window posts are already at the top given `sort: "latest"`). Note truncation if you cap.

## Pulling content
For each in-window post capture: `id`, title (`name`), author, `created_at`, and the body.
Extract the body text from `tiptap_body.circle_ios_fallback_text`, or parse the tiptap JSON
if that field is empty. Then pull comments with the comments tool (`post_id`) and capture
top-level comments and their authors. Each post or comment that carries a theme becomes an
evidence item: `{ source: "circle", post_id, member, quote }` with a verbatim quote.

Community skill-drops and "how does X work" posts are valid signal, they map to the
technical-patterns section by default (see `analysis-framework.md`).

## Fallback
On Circle API error, retry a few times with backoff. On final failure, produce the report
from Fireflies alone and note the outage. If both sources fail, write a degraded report and
still rebuild from prior periods. Never invent a post, a count, or a quote.
