# Data sources: how to gather each metric

Operational rules for the "Gather fresh data" step. Do NOT fabricate. Where a metric is
unavailable, set it to `null` and move on.

## Connector vs cloud

- **Locally**: use the Apify, Firecrawl, and youtube/vidiq MCP connectors.
- **In a cloud routine**: those local plugins are NOT available. Call the Apify HTTP API
  directly. The routine injects an `APIFY_TOKEN`. Env does not persist between Bash calls
  in cloud, so do each run plus parse in ONE Bash call:

  ```bash
  curl -s -X POST "https://api.apify.com/v2/acts/<actor>/run-sync-get-dataset-items?token=$APIFY_TOKEN" \
    -H "Content-Type: application/json" -d '<input>'
  ```

  Actor id in the URL uses `~` not `/` (e.g. `apify~instagram-scraper`). Actor ids are in
  `config.json` under `apify_actors`. Route YouTube through the Apify YouTube actor when the
  youtube connector is absent.

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
