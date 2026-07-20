# Source wiring - the worked example (Ben AI) + adaptation notes

This is the field-tested wiring behind the live Ben AI dashboard (https://benai-marketing-pulse.vercel.app). Copy the patterns; swap the IDs during SETUP. Everything here was learned the expensive way - trust it over instinct.

## Stripe (revenue + subscribers)

- **Filters must be objects.** `{"current_period_end": {"gte": 1781222400}}`. Dot-notation like `created.gte` is SILENTLY IGNORED - always sanity-check the returned date range before trusting a pull.
- The Stripe MCP exposes **no events list and no search**. Recent churn = `status=canceled` + `current_period_end: {gte: window start}`; the churn day is `ended_at`.
- Page with `limit: 100` + `starting_after` until `has_more: false`. Oversized responses auto-save to a .txt file - jq-extract only id, created, status, customer, items price/quantity, discount, cancel flags, ended_at. Never read full subscription objects into context.
- **Anchor the subscriber headline to the Billing overview number, not a raw count.** Raw positive-MRR customer counts over-count (Ben AI: 872 raw vs 773 Billing) because reactivations older than the cancel-history window look new and multi-subscription customers double-count. Churned reconciles exactly; "gained" over-counts - keep the Billing reference block (`billingOverviewRef`) and verify against it periodically.
- MRR from the API = active + past_due, monthly-normalized. Treat as an upper bound until reconciled once against Billing → Revenue.

## PostHog (site + conversion funnel)

- Ben AI project: "Ben AI - YouTube Attribution" (id 245743).
- Sessions: `query-web-overview`. Accelerator stage: `$pageview` with `$pathname` regex `^/accelerator`, math `unique_session`. Joined: `community_purchase` events (Circle webhook).
- Per-video attribution: funnel `$pageview(utm_source=youtube)` → `community_purchase`, breakdown by `utm_campaign` (the video slug), last 30 days.
- **"Checkout Started" is not instrumented** (checkout runs on Circle's domain). Render the explicit unavailable stage; the fix is a tracked checkout link.

## YouTube

- VidIQ / YouTube Analytics: daily channel views + last 10 uploads (views, likes). **Data lags ~2 days** - label the latest reported day on the card. CTR is not exposed by the API; do not show it.

## LinkedIn

- Apify `harvestapi/linkedin-profile-posts` on the profile URL, reposts excluded, last 30 days.

## Newsletter (Kit)

- `get_stats_for_a_list_of_broadcasts` over completed broadcasts; openRate/clickRate in percent. Open and click live on SEPARATE scales in the template - never plot them on one axis.

## Community (Circle)

- Admin API: page posts + comments and count locally for the 24h/7d windows.
- **Circle has no like timestamps**: "likes · 24h" = likes sitting on posts created in the last 24h, and the tile says so.
- Engagement/post = (likes + comments) / post over each trailing-7d post cohort.
- Awaiting-reply = member posts with 0 comments, last ~4 days, team posts excluded.
- Member last-active is not exposed via the connector - churn-risk stays `pending` until wired.

## Deploy

- Ben AI: Vercel project `benai-marketing-pulse` - stage `dashboard.html` as `index.html` + `data.js`, then `vercel deploy --prod --yes`. Not git-connected.
- Alternatives per config: a Claude live artifact, or local-file-only.

## Adapting to another business (SETUP mode)

Same shapes, different tools: Paddle/Chargebee → the `stripe` block (anchor to their own revenue overview); GA4/Plausible → `funnel` sessions; Mailchimp/beehiiv → `newsletter`; Skool/Discord → `community` (drop what the API can't give and mark it pending). Delete channel blocks the business doesn't run - the template skips missing blocks' sections only if you remove the section, so prefer `pending: true` notes over silent deletion.
