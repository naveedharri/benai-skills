# Data sources: how to gather each metric

Operational rules for the "Gather fresh data" step. Do NOT fabricate. Where a metric is
unavailable, set it to `null` and move on.

## Connector vs cloud

- **Locally**: use the Apify, Firecrawl, and youtube/vidiq MCP connectors.
- **In a cloud routine**: attach the authenticated Apify connector when available.
  Otherwise, inject `APIFY_TOKEN` through the routine's secret store. Start runs through
  `/v2/actors/<actor-id>/runs` with an `Authorization: Bearer` header. Poll the exact run,
  then fetch its default dataset. Never place the token in a URL, prompt, repository, or
  log. Stop if the routine cannot inject secrets safely.

  Actor IDs in URLs use `~` instead of `/`. Find them in `config.json` under
  `apify_actors`. Route YouTube through its Apify Actor when the YouTube connector is
  absent.

Before any run, inspect the Actor's live schema and pricing.
Show the exact input and result cap.
Wait for explicit approval.
Never retry a paid run without new approval.

## Per platform

| Platform | Source | Metrics |
|----------|--------|---------|
| YouTube | youtube/vidiq connector locally; Apify `streamers~youtube-scraper` or WebFetch the `/about` page in cloud | subscribers, uploads in last 7 days (title + views), median views + median engagement on last ~10 videos, standout video of the week |
| Instagram | Apify `apify/instagram-scraper` | followers, posts last 7d, avg engagement |
| TikTok | Apify `clockworks/tiktok-scraper` | followers, posts last 7d, avg engagement |
| LinkedIn | Apify `harvestapi/linkedin-profile-scraper` (works on FREE plan) | followers |
| Community | Firecrawl on the public Skool/Circle page | member count |
| SEO | Firecrawl on the SimilarWeb public page for the domain | est. monthly visits + global rank; if SimilarWeb blocks, set `null` |

### LinkedIn input

```json
{"queries":["https://www.linkedin.com/in/<slug>/"],"profileScraperMode":"Profile details no email ($4 per 1k)"}
```

Follower count is the `followerCount` field. Do NOT use `dev_fusion`: it is blocked on the
free plan.

## Avatars

Keep `AV` (avatars) unchanged unless a creator is new. For a new creator: fetch their
YouTube avatar, downscale to `=s176`, and base64-embed it. Hotlinked `yt3.ggpht.com` URLs
are ORB-blocked, so they MUST be inlined.

## Deltas

Set each creator's `youtube.prev` to last week's `youtube.subs` before overwriting `subs`,
so the demo tab shows week-over-week growth. The actual tab omits deltas; it is blurred on
camera.
