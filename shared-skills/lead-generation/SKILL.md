---
name: lead-generation
description: >-
  Source, qualify, enrich, and research a B2B lead list from an Ideal Customer Profile, end to end.
  Use this skill whenever the user wants to "find leads", "source prospects", "build a lead list",
  "get me leads for [ICP]", "scrape leads", "find companies that match", "build a prospect list",
  "/lead-gen", or describes who they sell to and wants a contactable, qualified list back. It picks the
  right data source for the ICP (Google Maps for local businesses, Sales Navigator or LinkedIn scrapers
  for B2B roles, a prospecting database otherwise), confirms the tools are connected, sources at the
  right volume, qualifies every lead with parallel subagents, enriches and verifies contact data
  (email + phone), runs deep per-lead research, and delivers a clean CSV or Google Sheet. Trigger it
  even when the user does not name a tool, as long as they want leads that match a profile. The output
  feeds the `outreach` skill.
disable-model-invocation: true
---

# Lead Generation

Turn an Ideal Customer Profile into a clean, qualified, enriched, contactable lead list. This skill is the front of the outbound machine: it decides where the right prospects live, pulls them, proves each one actually fits, finds and verifies their contact details, researches them deeply enough to personalize later, and hands a finished list to `outreach`.

The whole point is that a lead list is only as good as the worst decision in it. A great scraper pointed at the wrong source, or a clean list nobody verified, both waste the campaign. So this skill is opinionated about sequence: resolve the ICP, route to the source that actually holds that ICP, confirm the tools work before spending money, then source → qualify → enrich → research → deliver.

## The flow

```
0. Resolve the ICP        who, offer, where they live, how many, seniority, criteria
1. Route to the source    Maps vs Sales Nav/LinkedIn vs prospecting DB vs niche   -> references/source-routing.md
2. Preflight              confirm the chosen source + enrichment tools are connected -> references/connectors.md
3. Source                 keyword parse, test batch, pass-rate, volume, full pull  -> references/volume-and-batching.md
4. Qualify                parallel lead-qualifier subagents, 10 leads each
5. Enrich + verify        find + verify email and phone, only verified move on     -> references/enrichment.md
6. Research               parallel lead-researcher subagents, 5 each, depth by source
7. Deliver                CSV always, Google Sheet if gws is available
```

Read the referenced file when you reach that phase. The SKILL body is the map; the references hold the exact actor IDs, schemas, recovery patterns, and math.

## Two operating modes

This skill runs both inside the BenAI Sales OS vault and standalone for any client. Detect which at the start and behave accordingly.

- **Sales OS / vault mode.** A `Context/config.md` (and `Context/icp.md`, `offer.md`) exists in or above the working directory, or the user is clearly working inside the Sales OS. Read those docs as ground truth instead of interviewing. This skill is **Hybrid**: it delivers a list (action) AND updates what the OS knows (brain). So it writes a campaign record under `Lead-Gen/campaigns/<name>/` and logs every file it touches to `Daily/logs/YYYY-MM-DD.md`. Wikilink every entity. Never use em dashes.
- **Standalone / client mode.** No Sales OS context present. Interview the user for the same fields (Phase 0), deliver the list plus a short run summary, and skip the vault logging. This is the default for a fresh client install. The master-guide onboarder, when present, will have written the client's own `Context/` docs; if so, prefer reading them over interviewing.

If you are unsure which mode you are in, ask once: "Are we working inside your Sales OS vault, or is this a standalone list build?"

## Phase 0: Resolve the ICP

Lock these six things before sourcing anything. In vault/client-context mode, read them from `Context/icp.md`, `Context/offer.md`, and `Context/config.md`. Otherwise ask, concisely, in one or two grouped questions.

1. **The offer.** What is being sold, and why would these leads care. This propagates to every later phase: researchers focus on signals relevant to it, and `outreach` ties every line back to it.
2. **Who the ICP is (company level).** Industry/vertical, company size band, geography, and any hard disqualifiers.
3. **Where the ICP resides.** This is the single most important routing input. A plumber lives on Google Maps; a marketing-agency founder lives on LinkedIn; a SaaS RevOps lead lives in a prospecting database. See `references/source-routing.md`.
4. **How many leads.** The target count. Drives the volume math (sourcing over-pulls to survive qualification) and the subagent counts.
5. **The individual-level ICP.** The decision-maker tier (C-suite, VP, director, manager) and the exact designations to target (e.g. "Founder / CEO / Owner", or "Head of Marketing / Marketing Director"). This becomes a seniority+title filter at the source and a check at qualification.
6. **Qualification criteria.** The concrete, testable rules a lead must pass. If the user does not supply them, derive them from the ICP and the offer, then show the derived criteria and the AND/OR logic for a quick confirm. Vague criteria produce a vague list.

Confirm the six back in two or three lines before moving on. Sourcing spends money; a 20-second confirm is cheap insurance.

## Phase 1: Route to the source

Pick the data source from where the ICP resides. The full decision tree, with exact Apify actor IDs, data-richness notes, and the downstream research-depth rule for each source, is in **`references/source-routing.md`**. Read it now. The short version:

| ICP lives on... | Primary source | Data richness | What's missing |
| --- | --- | --- | --- |
| Local / brick-and-mortar (Google Maps) | Apify Google Maps scraper | Thin (name, site, phone, category, reviews) | Decision-maker name + email; research goes hard |
| LinkedIn (agencies, B2B roles, professional services) | Sales Navigator search scraped, or Apify LinkedIn lead/search scrapers | Rich (name, title, company) | Email almost always; needs enrichment |
| A targetable B2B database | Vibe Prospecting (`match-prospects` → `enrich-prospects` → `export-to-csv`) | Rich, often with contact data | Usually little; built-in enrichment |
| A niche directory or marketplace | Custom scrape pattern (see the Webflow example in the reference) | Varies | Varies |
| Warm: people who engaged with LinkedIn posts | The `linkedin-post-engagers` skill, then resume here at Phase 4 | Medium, plus an engagement signal | Email; but warmer than cold |

When more than one source could work, prefer the one that returns the richest data for the least cost and manual effort, and say which you picked and why.

## Phase 2: Preflight, confirm the tools are connected

Before spending a credit, confirm the chosen source and the enrichment providers are actually reachable. Nothing is worse than sourcing 400 leads and discovering the email finder is not connected. The per-tool checks and what to do when something is missing are in **`references/connectors.md`**. If a required tool is missing, stop and tell the user exactly what to connect, do not silently fall back to a worse path.

## Phase 3: Source the leads

Read **`references/volume-and-batching.md`** for the sourcing patterns. The key moves:

- **Parse the ICP into source parameters.** Map the free-text ICP to the source's actual filters: industry enums, size bands, location strings, seniority levels, job titles, and 3 to 5 search keywords. Show the mapping before a large run.
- **Test batch first.** Pull a small batch (about 50), run it through a lightweight ICP check, and measure the pass-rate. This tells you the real yield before you commit budget.
- **Size the full pull from the pass-rate.** `raw_needed = ceil(target / pass_rate * 1.1)`, capped at a sane safety limit. Pulling exactly `target` leads always under-delivers because qualification removes some.
- **Persist immediately.** Write raw results to disk (`raw_leads.json` or `.csv`) the moment they land. Large datasets overflow the conversation and are lost on context compaction. Every later phase reads from disk, not from memory.

## Phase 4: Qualify

Never trust scraped data alone. Sources (Sales Navigator, Apollo, Maps) are frequently wrong about what a company actually does. Every lead is verified against the criteria with live research.

- Batch the leads into groups of **10**. Spawn one `sales:lead-qualifier` subagent per batch, and **spawn them all in a single message** so they run concurrently. Sequential spawning defeats the whole design.
- Each subagent receives: the verbatim qualification criteria, the AND/OR logic, its 10-lead JSON batch, its output path, and the instruction to use WebSearch (2 to 3 searches per lead, across the company site plus third-party sources) and never qualify on the CSV alone.
- Each returns JSON: `qualified` (bool), `reason`, `confidence`, plus the identifying fields.
- Merge results back by email (primary key), add `Qualified`, `Qualification_Reason`, `Confidence`, and split a qualified-only file. The merge runs as a small script, not inline, and tolerates the JSON key variations subagents produce (see the reference). Borderline leads qualify; let the user make the final call.

If the `sales:lead-qualifier` agent type is not available (skill used outside the plugin), spawn `general-purpose` subagents with the same instructions.

## Phase 5: Enrich and verify

Now find and verify the contact data the source did not give you. Read **`references/enrichment.md`** for providers, order, and rules. The essentials:

- **Email** via an email finder (AnyMailFinder by default, Apollo or Prospeo as configured) using full name plus company domain.
- **Phone** via Prospeo or Apollo when phone is wanted.
- **Verify, then gate.** Only verified emails move forward. An unverified list torches sender reputation, and deliverability is the campaign's lifeblood. Drop or quarantine the unverifiable.
- **Casualize company names** (strip Inc/LLC/Ltd and location noise) so later personalization reads human.

## Phase 6: Lead research

Depth is proportional to how thin the source was. This is the rule that makes the skill work across sources. The exact depth-by-source guidance lives in `references/source-routing.md`; the batching lives in `references/volume-and-batching.md`.

- Batch into groups of **5**. Spawn one `sales:lead-researcher` subagent per batch, **all in one message**. Each visits the company site and third-party sources and returns the structured intelligence report (what they do, why, niches, services, case studies, positioning, the person's role, public mentions, content, achievements).
- **Thin source (Google Maps, niche directory): go hard.** There is almost no usable data yet, so research carries the entire personalization later. Find the website, find the decision-maker's LinkedIn (launch the LinkedIn scrapers if the profile is unknown), pull recent posts and signals, read reviews and services.
- **Rich source (Sales Nav, LinkedIn, prospecting DB): lighter.** The profile already exists. Confirm the website and LinkedIn, scrape the 2 most recent posts for a fresh hook, and fill gaps rather than re-deriving everything.
- For LinkedIn scraping, spawn a single `sales:linkedin-scraper` subagent (it handles all URLs in one Apify call) in the same message as the researchers. It follows the two-step `call-actor` pattern and the timeout-recovery pattern in the reference.
- Merge the research columns back with a script. Persist everything.

## Phase 7: Deliver

The list is the product. Deliver it where the user can use it.

- **Detect `gws`.** Run a quick check for the `gws` CLI (`command -v gws`). If it is present, ask the user: CSV, or a Google Sheet. If `gws` is absent, deliver CSV only and say so.
- **CSV** always works: write the enriched, qualified, researched file with a clear column order (identity, company, contact, qualification, intelligence). Also keep a JSON copy for `outreach`.
- **Google Sheet** when chosen: create it with `gws` (sheets create), upload, and return the shareable link. Name it descriptively, e.g. `<keywords>_<geo>_<date>`.
- **Vault mode extras.** Write `Lead-Gen/campaigns/<name>/campaign.md` (the filters, source, list link, identifier, and a metrics stub the `sales-os-campaign-metrics` routine will fill) and log every file created or changed to `Daily/logs/YYYY-MM-DD.md`. Wikilink the prospects, companies, and tools. No em dashes.
- **Final report.** Counts at each stage (sourced, qualified with %, enriched, verified, researched), the pass-rate, time taken, the spend if known, and the link to the deliverable. End by offering to hand the list to `outreach`.

## Subagents and batch sizes

These batch sizes are deliberate, not arbitrary: they keep each subagent's context small enough to do careful work, and let the fan-out stay parallel.

| Subagent | Batch size | Job |
| --- | --- | --- |
| `sales:lead-qualifier` | 10 leads | Verify each lead against the ICP with live research |
| `sales:lead-researcher` | 5 leads | Deep per-lead intelligence report |
| `sales:linkedin-scraper` | 1 instance, all URLs | LinkedIn profiles + recent posts via Apify |

The icebreaker writer belongs to `outreach`, not here.

## Operating rules that always apply

- **Parallelism.** Every subagent in a phase is spawned in one message. This is the single most important performance rule.
- **Persist to disk immediately.** Sourced data, subagent outputs, merges, all written to files as they are produced. Conversation memory is not storage.
- **Never trust the source.** Scraped fields are a starting point, verified against live research, never the final word.
- **Apify discipline.** Two-step `call-actor` (info, then call), expect the ~30s MCP timeout, recover via `runId`/`datasetId`. Full pattern in the references.
- **Cost awareness.** Before any large paid pull, state the rough cost and confirm. Dedup before paid enrichment so you never pay twice for the same record.
- **Voice and format.** No em dashes, ever. In vault mode, wikilink every entity and follow the Sales OS conventions.

## What this skill replaced

This skill consolidates what used to be the separate `lead-qualification` and `lead-intelligence` skills and the `outbound-pipeline` command, and adds the sourcing front-end they never had. It reuses their proven subagents (`lead-qualifier`, `lead-researcher`, `linkedin-scraper`) unchanged. For the outreach half (copy, personalization, cadence, launch), hand off to the `outreach` skill.

## Self-improvement

This skill is never finished. Improve it as you use it.

- When the user corrects how a step was done, update the relevant reference file (or this SKILL.md) so the correction sticks. Do not just fix it for this run.
- When a correction is a hard rule ("always do X", "never do Y"), add it as a permanent rule here.
- When the user says an output was genuinely good, save it to `references/examples/` so it becomes a model for future runs.
- Keep the skill small while you do this: when you add something, run the deletion test and cut anything that no longer changes behavior.
