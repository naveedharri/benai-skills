# Collection

The connectors, what each is good for, what each costs, and the order to fall back in. **Which of these exist is a question for `Context/config.md`, not for this file.** Probe before you plan, and name the ones that are missing.

## The five streams

| Stream | Job | Primary | Fallback ladder |
| --- | --- | --- | --- |
| **Official sources** | What shipped in the window. Launches, changelogs, release notes | direct fetch, or Firecrawl for pages that need it | web search restricted to the vendor's own domains |
| **Practitioners** | Techniques in real use, and complaints revealing an unmet need | Apify Twitter or X actors | second actor, then web search, then skip and say so |
| **The roster** | What tracked competitors published. Topic and framing only | the YouTube connector | Apify YouTube scraper, then web search |
| **Search demand** | Volume and competition for a topic | vidIQ keyword research | none. This data is not in the public API. Say it is unavailable rather than estimating |
| **The wider web** | Only what the others cannot reach | Firecrawl | web fetch, then browser automation. Keep narrow, it is the most expensive |

## The YouTube connector

The primary source for search, video details, channel stats and transcripts. It runs on the YouTube Data API, whose free tier is 10,000 units a day.

| Tool | Returns | Cost in units |
| --- | --- | --- |
| `searchVideos` | Videos and channels by keyword, with a recency filter | **100 per call** |
| `getVideoDetails` | Metadata, stats, duration, category | about 1 per video |
| `getChannelStatistics` | Subscribers, views, video count | about 1 per channel |
| `getChannelTopVideos` | Top or recent videos for a channel | about 3 per call |
| `getVideoComments` | Comments | about 1 |
| `getTrendingVideos` | Trending by region and category | about 1 |
| `getTranscripts` | Captions | **free** |

**`searchVideos` is the expensive one at 100 units.** Everything else is about 1. Transcripts are free. Budget accordingly: roughly 50 to 80 searches a day is the ceiling, and a scan should need far fewer than that.

**Prefer `getChannelTopVideos` over `searchVideos` for roster work.** You already know the channels, so searching for them wastes 100 units to learn something the roster already told you.

## Apify

The fallback for YouTube search, and the primary for practitioner streams.

**YouTube fallback.** A YouTube scraper actor goes through the InnerTube API directly, with no key and no quota, so it is the right move when the YouTube connector is out of units rather than broken.

**The practitioner fallback chain matters, and the order is counterintuitive.** When a call fails or returns empty:

1. **Switch actor first.** Retry with a second actor using identical input. The most likely cause of an empty result is the actor being down, not the filters being too strict.
2. **Only if both actors fail**, relax the filters: widen the date range, lower any engagement floor, broaden the search terms.
3. **Only if both fail with relaxed filters**, report it and continue without the stream.

**Never relax filters as the first response to an empty result.** Doing that turns a transient outage into a flood of low-quality matches, and the run looks successful while the data is worse than nothing.

## vidIQ, where available

The proprietary layer, worth reaching for only when it returns something the public API cannot.

| Tool | Use it for |
| --- | --- |
| `vidiq_keyword_research` | Search volume and competition score. **The public API does not expose either**, so this is the only real demand signal available |
| `vidiq_outliers` | Videos outperforming a channel's own baseline, computed for you |
| `vidiq_breakout_channels` | Channels gaining momentum before they show up in keyword search |
| `vidiq_trending_videos`, `vidiq_trend_categories` | Trend scouting |
| `vidiq_channel_analytics`, `vidiq_channel_performance_trends` | Depth on one competitor, and the long arc |
| `vidiq_similar_channels` | Competitor discovery beyond the known roster. Feed anything real into `Intelligence/competitors/_roster.md` as a suggestion, never write the roster yourself |
| `vidiq_score_title` | Scoring a draft title. Useful when seeding an idea, not during collection |
| `vidiq_balance` | Check remaining balance before a heavy run |

**Cross-check rather than trust.** Two sources on the same channel will disagree slightly because their snapshots lag differently. Record both numbers and both pull dates rather than picking the one you prefer. The OS convention is that a disagreement is data, not an error to resolve silently.

## Per-stream floors

**Meet these before you think about the cap.** The cap below is a ceiling on a run that has already done its job, not a licence to stop early.

| Stream | Floor at Standard | What under-collecting looks like |
| --- | --- | --- |
| **Official sources** | Every vendor named in config, and the primary vendor's changelog read in full, not its summary | Reading a news article about a launch instead of the release notes |
| **Practitioners** | The whole watchlist, batched into as few calls as the actor allows | Sampling ten accounts out of forty and writing as though the field was covered |
| **The roster** | Every competitor in `_roster.md` | Checking the three obvious ones |
| **Search demand** | One lookup per candidate that reaches scoring | Skipping it because the connector is slow |
| **The wider web** | At least one full-text read per candidate | Quoting a search-result snippet as a source |

**A search result is not a source.** It is a pointer to one. Record which sources were read in full and which were only seen in a result list, and never let the second group carry a finding.

**Batch rather than sample.** Most actors take a list. Forty handles in two calls costs about what four handles in two calls costs, so sampling saves nothing and loses most of the signal. If a limit forces a subset, say which accounts were covered and which were not.

## Budget

Take the cap from `Context/config.md` if it names one. Absent that, a scan stops at 25 external pulls, because this is the most connector-expensive thing the OS does.

**The cap and the floors can genuinely conflict**, and when they do the floors win and the run says so. A brief that covered every competitor and blew the cap is useful. A brief that respected the cap by checking three competitors, and does not mention it, is not.

**On breach:** write what was covered, name what was skipped, and end. Log the skip.

**Never truncate silently.** A brief that quietly covered half the roster reads exactly like a brief that covered all of it, and the second time somebody notices they stop trusting every brief.

## What each stream is actually looking for

The thing that makes a brief useful is not coverage, it is the filter. The filter comes from `Context/brand/positioning.md`.

**If positioning names a translation gap between two audiences**, then the highest-value find is something the first audience has fully absorbed and the second has not seen yet. Concretely:

| Worth collecting | Not worth collecting |
| --- | --- |
| A capability that shipped and is already being used in practice by the ahead audience | An announcement nobody has used yet |
| A technique being shared repeatedly, in real work | A single clever post with no follow-through |
| A complaint that reveals an unmet need | A complaint about pricing or a bug |
| A topic saturated on one side and absent on the other | A topic already saturated on our side |
| A competitor's framing that names a tension | A competitor's upload, on its own |

**A topic already saturated for our audience is a miss, not a find.** That is the single most common failure of a market scan: it surfaces what is loud, and what is loud is by definition already covered.

## Degradation

Never hard-fail. Every stream that cannot run becomes a named line in the brief's `## Not available` section, with the connector named.

A degraded scan that says which parts are missing is genuinely useful, because a reader can weigh it. A degraded scan presented as complete teaches the operator to distrust the whole series, and that damage outlasts any single run.
