# Data sources: connectors and actors

Connect these before building the dashboard. The dashboard needs scrapers.

## Apify (social scraping)

If Apify is not connected, walk the user through adding the Apify connector or API token. Map platforms to these actors:

| Platform | Actor | Notes |
|----------|-------|-------|
| Instagram | `apify/instagram-scraper` | |
| TikTok | `clockworks/tiktok-scraper` | |
| LinkedIn | `harvestapi/linkedin-profile-scraper` | Works on the Apify FREE plan (`dev_fusion` does not). Input `{"queries":["<profile-url>"],"profileScraperMode":"Profile details no email ($4 per 1k)"}`. Follower count is `followerCount`. |
| X/Twitter | `apidojo/tweet-scraper` | |
| YouTube (fallback) | `automation-lab/youtube-scraper` | Use only if no YouTube Data API is available. |

## Firecrawl (everything non-social)

Community member counts from public Skool/Circle pages, SEO from SimilarWeb public pages, any website audit. If Firecrawl is not connected, help the user get a Firecrawl API key and install the `firecrawl` skill. Firecrawl cannot scrape social, which is why Apify is also required.

## YouTube (primary, real)

Use the YouTube Data API via the youtube/vidiq connector, or a Data API key.

## Avatar inlining rule (applies at dashboard-build time)

Hotlinked `yt3.ggpht.com` and most social CDN avatars are ORB-blocked in the browser. Download each at a small size and base64-embed it in the data file. Never `<img src>` a remote social CDN URL.
