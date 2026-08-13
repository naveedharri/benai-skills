# X Tweet Scraper Actor Contract

Use [Xquik X Tweet Scraper](https://apify.com/xquik/x-tweet-scraper).
Its MCP name is `xquik/x-tweet-scraper`.
Its REST ID is `xquik~x-tweet-scraper`.

Always inspect the live Actor schema before building input.
The fields below describe the supported contract.

## Choose One Route

| Need | Primary Input |
|------|---------------|
| Mixed public X URLs | `startUrls` |
| Post URLs | `tweetUrls` |
| Profile timelines | `twitterHandles` |
| Profile media | `mode: "profileMedia"` plus `twitterHandles` |
| Profile likes | `mode: "profileLikes"` plus `twitterHandles` |
| Search queries | `searchTerms` |
| Specific posts | `tweetIds` |
| X lists | `listIds` |
| Articles | `mode: "article"` plus `articleTweetIds` |
| Replies | `mode: "replies"` plus `replyTweetIds` |
| Quotes | `mode: "quotes"` plus `quoteTweetIds` |
| Threads | `mode: "thread"` plus `threadTweetIds` |
| Retweeters | `mode: "retweeters"` plus `retweeterTweetIds` |
| Best-effort favoriters | `mode: "favoriters"` plus `favoriterTweetIds` |

Use `mode` when the user requests one exact route.
Keep automatic routing for mixed URL or legacy inputs.
Favoriter visibility depends on what X exposes.

## Bound Every Run

- Set `maxItems` on every call.
- Treat it as one cap across the whole run.
- Several `searchTerms` share the same cap.
- Use `maxItemsPerTarget` only when target balancing matters.
- Start with 10 results when the output shape is unknown.

## Search and Filter Inputs

- Keep advanced syntax inside each `searchTerms` value.
- Use `queryType` with `Latest`, `Top`, or `Latest + Top`.
- Use `time` for since, until, timestamp, and ID bounds.
- Use `engagement` for like, repost, and reply bounds.
- Use `content`, `users`, `media`, and `geo` for structured filters.
- Set `includeSearchTerms: true` for multi-query attribution.

Example:

```json
{
  "searchTerms": ["from:AnthropicAI Claude", "Claude MCP lang:en"],
  "maxItems": 100,
  "queryType": "Latest + Top",
  "outputVariant": "rich",
  "fieldStyle": "camelCase",
  "includeSearchTerms": true
}
```

## Output Controls

| Field | Supported Values |
|-------|------------------|
| `outputVariant` | `legacy`, `rich`, `raw`, `compact`, `full` |
| `fieldStyle` | `legacy`, `camelCase`, `snake_case` |
| `outputPreset` | `nested`, `flat` |

Use `rich` with `camelCase` for agent analysis.
Treat `compact` and `full` as historical aliases for `legacy`.
Use `flat` when the user needs CSV-friendly fields.
Use `raw` only when source detail is required.

Rows with `resultType: "diagnostic"` explain empty or partial results.
Rows with `resultType: "run-report"` summarize the run.
Never mix either control row into post analysis.

Collect only public data needed for the stated purpose.
Respect privacy rules and platform policies.

Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.
