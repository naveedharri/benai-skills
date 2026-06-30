# Source routing: where the ICP lives decides the tool

The biggest lever in lead generation is choosing the source that actually holds your ICP. Get this wrong and every downstream step is polishing the wrong list. Route by where the buyer's information naturally lives, not by which scraper is most familiar.

## Table of contents
1. The decision tree
2. Source A: Google Maps (local / brick-and-mortar)
3. Source B: LinkedIn and Sales Navigator (B2B roles, agencies, services)
4. Source C: Prospecting database (Vibe Prospecting)
5. Source D: Niche directories and marketplaces
6. Source E: Warm, LinkedIn post engagers
7. Source F: Mining an existing CRM
8. Research-depth rule (the bridge to Phase 6)
9. Apify mechanics shared by all Apify sources

---

## 1. The decision tree

Ask: **where would a stranger find a list of these buyers today?**

- They have a storefront, serve a local area, show up on a map (restaurants, clinics, contractors, gyms, dentists, home services) -> **Google Maps** (Source A). Thin data, so research later goes hard.
- They are a role at a company you would find on LinkedIn (founders, marketers, RevOps, agency owners, professional services) -> **Sales Navigator / LinkedIn scrapers** (Source B). Rich profile data, but no email.
- They are best described by firmographic + technographic filters at scale (industry, size, tech stack, title) and you want a database to do the matching -> **Prospecting database / Vibe Prospecting** (Source C). Rich, often with contact data built in.
- They congregate in a specific directory, marketplace, association, or partner list -> **Niche scrape** (Source D).
- You already have content and want the warmest possible list -> **post engagers** (Source E).
- The names already sit in a CRM and need enrichment/scoring, not net-new sourcing -> **CRM mining** (Source F).

More than one can apply. Prefer the source with the richest data for the least cost and least manual effort, and state the choice and why.

---

## 2. Source A: Google Maps (local / brick-and-mortar)

**Use when:** the ICP is a local business with a physical presence. Plumbers, HVAC, dentists, law firms, gyms, restaurants, med-spas, real-estate offices, contractors.

**What you get:** business name, website (sometimes), phone, address, category, rating and review count, hours, and a Google Maps URL. You do **not** get a named decision-maker or an email. This is thin data, which is exactly why Phase 6 research has to go hard for this source.

**Apify actors (check the store for the current best-rated, these are reliable defaults):**
- `compass/crawler-google-places` (a.k.a. "Google Maps Scraper") for businesses by search term + location.
- `compass/google-maps-extractor` as an alternative.

Typical input:
```json
{
  "searchStringsArray": ["plumber", "plumbing company"],
  "locationQuery": "Austin, Texas, United States",
  "maxCrawledPlacesPerSearch": 200,
  "language": "en"
}
```
Useful output fields: `title`, `website`, `phone`, `categoryName`, `totalScore`, `reviewsCount`, `address`, `city`, `state`, `url` (the Maps URL), `placeId`.

**Routing note:** Maps gives you the *company*, not the *person*. The decision-maker (owner/founder) and their email come from enrichment + research: find the website, find the owner via the site/LinkedIn, then email-find by name + domain. Expect to discard businesses with no website, since there is nothing to verify or enrich against.

---

## 3. Source B: LinkedIn and Sales Navigator (B2B roles)

**Use when:** the ICP is a person in a role: agency founders, marketing leaders, RevOps, heads of X, consultants, professional services. This is the default for most B2B SaaS and agency offers.

**Two ways in:**

**B1. Sales Navigator search, then scrape.** Build the search in Sales Navigator using its filters (industry, headcount, geography, seniority, title, keywords), then scrape the result set. In the BenAI stack this scrape runs through Vain.io. Sales Navigator gives the richest targeting but returns **no email**, so enrichment is mandatory.

**B2. Apify LinkedIn lead/search scrapers** when you do not want to drive Sales Navigator by hand. Reliable defaults:
- People search / lead finder actors such as `code_crafter/leads-finder` (returns company + contact, sometimes email; takes industry, size, location, seniority, title, keyword filters directly, which makes it a good fit for an ICP-to-filters mapping).
- `dev_fusion/Linkedin-Profile-Scraper` to enrich known profile URLs into full profiles (about, current company, company LinkedIn URL).
- `dev_fusion/Linkedin-Company-Scraper` to turn a company LinkedIn URL into website + headcount + description (needs fuzzy matching, the profile scraper returns numeric `/company/8736/` URLs while the company scraper uses slugs; match on normalized name with a 0.7 SequenceMatcher threshold).
- `2SyF0bVxmgGr8IVCZ` (personal profile scraper) and `harvestapi/linkedin-profile-posts` (recent posts) are the ones the `linkedin-scraper` subagent already drives in Phase 6.

**What you get:** name, headline/title, company, location, profile URL, and (after profile/company scraping) about, company website, headcount. **Email is missing**, route to enrichment by name + company domain.

---

## 4. Source C: Prospecting database (Vibe Prospecting)

**Use when:** you want a database to do firmographic + technographic matching at scale, or you want contact data bundled with the match. Good for broad B2B ICPs defined by industry, size, title, and tech stack.

**Tools (Vibe Prospecting MCP):** `match-prospects` to define and match the ICP, `enrich-prospects` to attach contact data, `export-to-csv` to pull the list, with `estimate-cost` / `show-pricing-plans` / `show-sample` to scope before spending. Also `match-business` / `enrich-business` for company-level targeting.

**What you get:** rich, structured records, frequently including verified email, which can shorten or skip Phase 5. Still run qualification (Phase 4), databases drift and mislabel.

---

## 5. Source D: Niche directories and marketplaces

**Use when:** the ICP clusters in a specific place a general scraper misses: a partner directory (Webflow Experts, Shopify Partners, HubSpot Solutions), an association member list, a marketplace, an awards list, a "powered by X" footprint.

**Approach:** there is rarely a packaged actor. Use the pattern proven in the `webflow-partners-scraper`:
1. Find the index (sitemap XML, a paginated listing, or a search results page).
2. Fetch profile/detail pages concurrently (small batches, a real User-Agent, short timeouts).
3. Extract the fields that matter (name, website, location, price band, profile URL).
4. Validate ICP fit by visiting the website and checking for the ICP keyword set.

This is slower to set up but reaches lists nobody else is scraping, which is often where the least-saturated leads are. Persist as you go.

---

## 6. Source E: Warm, LinkedIn post engagers

**Use when:** the user (or a competitor / thought leader) has LinkedIn posts whose commenters and reactors are plausible buyers. These people self-selected by engaging, so they are warmer than any cold list and the engagement gives `outreach` a real hook.

**Approach:** run the existing `linkedin-post-engagers` skill to scrape, dedup, and (optionally) qualify + enrich engagers into a CSV, then **resume this skill at Phase 4** (qualify) with that CSV as the source. Its profile scraping already covers part of Phase 6, so research can skip the profile pull and only grab fresh posts.

---

## 7. Source F: Mining an existing CRM

**Use when:** the names already exist (a CRM list, a past export) and the job is enrichment, deduplication, and scoring rather than net-new sourcing.

**Approach:** use the existing `crm-prospect-mining` skill to pull and enrich CRM records (it drives company LinkedIn finding and comms summarization), then resume here at Phase 4 or Phase 5 as needed.

---

## 8. Research-depth rule (bridge to Phase 6)

The source determines how hard Phase 6 has to work, because it determines how much you already know.

| Source | Data richness after sourcing | Phase 6 depth |
| --- | --- | --- |
| Google Maps (A) | Thin: company, maybe website, phone | **Maximum.** Find website, find the owner + their LinkedIn (scrape if unknown), reviews, services, recent posts. Research is the only personalization fuel you will have. |
| Niche directory (D) | Varies, usually thin | High, similar to Maps. |
| Sales Nav / LinkedIn (B) | Rich: person, title, company, profile | **Moderate.** Confirm website + LinkedIn, scrape 2 recent posts for a hook, fill gaps. Do not re-derive what you already have. |
| Prospecting DB (C) | Rich, often with contact data | Light to moderate. Verify and top up. |
| Post engagers (E) | Medium + engagement signal | Light. Profile already scraped; grab fresh posts only. |

State which depth you are running and why, so the user understands the cost/quality tradeoff.

---

## 9. Apify mechanics shared by all Apify sources

Every Apify actor call follows the same discipline. The `linkedin-scraper` subagent already encodes this; the orchestrator uses it for Maps and niche pulls too.

1. **Two-step call.** `call-actor` with `step: "info"` to read the current input schema, then `call-actor` with `step: "call"` and the proper input. Never hardcode field names without checking, schemas change.
2. **Expect the timeout.** The MCP connector times out around 30 seconds. The run keeps going server-side. The partial response carries the `runId` and `datasetId`.
3. **Recover, do not retry.** Sleep 60 to 90 seconds, then `get-actor-run` with the `runId` until status is `SUCCEEDED`, then `get-dataset-items` with the `datasetId`. For large datasets use `fields` to fetch only what you need, or read the auto-saved `.txt` file rather than re-fetching in batches.
4. **Sample before full download.** Pull 2 to 3 items first to confirm the real field names, then process the full set.
5. **Dedup before paid steps.** Strip duplicate URLs/domains before any pay-per-record actor or enrichment call.
6. **Cost check.** Pay-per-event actors are cheap per record (LinkedIn company scraping is about $0.006 each), but volume adds up. State the rough spend before a large run.
