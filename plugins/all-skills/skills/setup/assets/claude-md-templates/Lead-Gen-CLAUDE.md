# Lead-Gen

Outbound: campaigns, cadences, and the lead-gen SOP. Only relevant if the rep took the acquisition capabilities (lead-gen and outreach). Built and maintained by those skills.

## Structure

- `process.md` the outbound SOP: sourcing, qualification, enrichment, personalization, launch, delivery.
- `campaigns/<name>/campaign.md` one folder per campaign: the filters, the source, the lead-list link, the identifier, and the metrics.
- `sequences/<name>/` the cadence and the copy: `emails.md`, `linkedin.md`, `cadence.md`.

## Conventions

- A lead list is delivered as a CSV or a Google Sheet, with the run recorded so the OS knows what was sourced and why.
- Campaign metrics flow back from the sending tools into `campaigns/`.
- Wikilink entities. No em dashes. Structural changes here update the root `MAP.md`.
