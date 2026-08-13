# X Follower Scraper Actor Contract

Use [Xquik X Follower Scraper](https://apify.com/xquik/x-follower-scraper).
Its MCP name is `xquik/x-follower-scraper`.
Its REST ID is `xquik~x-follower-scraper`.

Always inspect the live Actor schema before building input.
The fields below describe the supported contract.

## Match Targets and Relations

| Target | Input | Compatible Relations |
|--------|-------|----------------------|
| X handles | `twitterHandles` | `followers`, `following`, `verified_followers` |
| Numeric user IDs | `userIds` | `followers`, `following`, `verified_followers` |
| List IDs | `listIds` | `list_members`, `list_followers` |
| Community IDs | `communityIds` | `community_members` |
| Public X URLs | `startUrls` | Derived from each URL |

Use `relation` for one relation.
Use `relations` for several relations in one run.
URLs override the general relation for that target.
List followers are list subscribers in X terminology.

## Bound Every Run

- Set `maxItems` on every call.
- Treat it as one cap across the whole run.
- Set `maxItemsPerTarget` when targets need balanced depth.
- Start with 10 profiles when the output shape is unknown.

## Filters and Output

| Field | Purpose |
|-------|---------|
| `outputMode` | Return `compact`, `full`, or `raw` rows |
| `dedupeMode` | Use `none`, `first`, or `merge` |
| `includeTargetMetadata` | Keep target and relation attribution |
| `minFollowers` / `maxFollowers` | Bound follower counts |
| `verifiedOnly` | Keep verified profiles |
| `bioContains` | Filter public biography text |
| `locationContains` | Filter public location text |

Use `compact` for prospect lists.
Use `full` when optional profile detail matters.
Use `raw` only when source detail is required.
Use `merge` to compute cross-target overlap.

Example:

```json
{
  "twitterHandles": ["apify", "openai"],
  "relations": ["followers"],
  "maxItems": 200,
  "maxItemsPerTarget": 100,
  "outputMode": "compact",
  "dedupeMode": "merge",
  "includeTargetMetadata": true
}
```

Merge output can include source targets, source relations, and overlap counts.
Do not discard those fields before overlap analysis.

Rows with `resultType: "diagnostic"` explain empty or partial results.
Rows with `resultType: "run-report"` summarize the run.
Never mix either control row into profile analysis.

Collect only public data needed for the stated purpose.
Do not infer sensitive traits from audience data.
Respect privacy rules and platform policies.

Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.
