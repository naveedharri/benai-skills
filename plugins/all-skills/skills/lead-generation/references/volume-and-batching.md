# Volume, batching, and merging

This file holds the math and the mechanics: how to size a pull from a target count, how to fan work out to subagents without losing parallelism, and how to merge their outputs back together cleanly.

## 1. ICP to source parameters

Sources do not take prose, they take filters. Translate the ICP into the source's actual fields before sourcing, and show the mapping for a large run.

- **Industry** -> the source's industry enum/value (e.g. "marketing & advertising", "computer software", "staffing & recruiting"). Map synonyms: "SEO agency" -> "marketing & advertising"; "software/SaaS/IT" -> "computer software".
- **Size** -> the source's employee bands (1-10, 11-50, 51-200, ...). Map words: "small" -> 1-20, "mid" -> 21-100, "enterprise" -> 501+.
- **Geography** -> country/region/city strings in the source's expected casing.
- **Seniority + titles** -> the individual-level ICP from Phase 0 (Founder, Owner, C-Level, VP, Director, Head, Manager) and specific titles.
- **Keywords** -> 3 to 5 short search terms (1 to 3 words each) that describe the offer's relevance, used to widen or narrow the search.

Also generate 1 to 3 **verification questions**, yes/no questions an LLM can answer from the company website that confirm the core fit (e.g. "Does this company offer SEO or content marketing services?"). These power the test-batch check and the qualification criteria.

## 2. Test batch, pass-rate, volume

Do not pull the full target straight away; you do not yet know the yield.

1. **Test batch:** source about 50 leads with the parsed parameters.
2. **Lightweight check:** run the verification questions against each (quick site read or a fast subagent pass). Compute `pass_rate = passed / tested`.
3. **Size the full pull:**
   ```
   raw_needed = ceil(target / pass_rate * 1.1)      # 1.1 is a 10% safety buffer
   raw_needed = min(raw_needed, SAFETY_CAP)          # e.g. 3000, to avoid runaway spend
   ```
   Example: target 100, pass-rate 40% -> `ceil(100 / 0.40 * 1.1)` = 275 raw leads.
4. **Abort guard:** if the pass-rate is very low (under ~5%), stop and revisit the ICP-to-filters mapping or the source choice. A 3% pass-rate means the targeting is wrong, not that you need 3000 raw leads.
5. State the plan and rough cost, then pull.

## 3. Batch sizes and parallelism

| Phase | Subagent | Leads per subagent | Count for N leads |
| --- | --- | --- | --- |
| 4 Qualify | `sales:lead-qualifier` | 10 | `ceil(N / 10)` |
| 6 Research | `sales:lead-researcher` | 5 | `ceil(N / 5)` |
| 6 LinkedIn | `sales:linkedin-scraper` | all URLs, 1 instance | 1 |

**The one rule that matters:** spawn every subagent in a phase in a **single message**. Spawning 5, waiting, then 5 more, runs them in series and throws away the entire benefit. For 137 qualified leads, Phase 6 is 28 researcher subagents plus 1 scraper, all 29 launched together.

These sizes are chosen so each subagent keeps a small, focused context (careful per-lead work) while the fan-out stays wide. Do not raise them to "save agents".

If the `sales:*` agent types are unavailable (skill running outside the plugin), spawn `general-purpose` subagents with the identical instructions and output schema.

## 4. What each subagent returns

- **lead-qualifier:** JSON array, per lead: identity fields, `qualified` (bool), `reason`, `confidence`.
- **lead-researcher:** JSON array, per lead: identity fields plus a structured intelligence report (summary, what they do, why, niches, key services, case studies, positioning, role, public mentions, content/speaking, achievements). Sections with nothing found say "No data found".
- **linkedin-scraper:** writes `all_profiles.json` (slim profile fields) and `all_posts.json` (slim post objects), never a metadata dict.

## 5. Merging (run as a script, not inline)

Subagents are independent, so their outputs vary slightly. Merge with a small Python script that is tolerant by design.

- **Key fallbacks.** Accept the common variants rather than assuming one key: `intelligence_report` / `intelligence` / `report`; `full_name` / `name` / (`first_name` + `last_name`); `qualified` as bool or "Yes"/"No". Use `r.get('a') or r.get('b') or r.get('c')` chains.
- **Broken JSON recovery.** Try `json.load`, then `json.loads(raw, strict=False)`, then a regex extraction of the array, before giving up on a file.
- **Match keys.** Merge by email (primary), then full name, then company name as fallbacks.
- **LinkedIn matching.** Normalize URLs before matching posts to profiles: strip protocol, `www.`, country subdomains, trailing slash, lowercase. Posts map to profiles via the queried URL field.
- **Persist each step.** Write the merged file after each phase. If a later phase fails you do not re-run the expensive earlier ones.

## 6. Column progression

The deliverable grows one stage at a time, which also makes it easy to see where a lead dropped out:

```
Sourced              identity, company, website, phone, source fields
+ Phase 4 Qualify    Qualified, Qualification_Reason, Confidence
+ Phase 5 Enrich     Email (verified), Phone, Verification_Status, Company_Casual
+ Phase 6 Research   General Lead Intelligence, LinkedIn Lead Research
```

Keep a JSON twin of the final CSV; `outreach` reads the JSON for personalization.
