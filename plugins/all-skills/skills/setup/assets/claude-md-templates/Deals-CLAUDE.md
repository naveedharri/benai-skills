# Deals

One file per active deal. This folder is the working memory of the pipeline. The CRM is the system of record; these files hold the unstructured context the CRM cannot.

## Conventions

- **One file per prospect**, named by the prospect (for example `First-Last-Company.md`).
- **Tracking freezes** the moment a deal is won or lost. This is sales, not fulfilment; a closed deal stops accruing history.
- **Frontmatter:** `status` (mirrors the CRM stage), `prospect`, `company`, `email`, `deal_size`, `source`.
- **Sections:** a `Snapshot` (where the deal stands now), a `History` with newest at the bottom (every touchpoint: calls, emails, proposal events), and a `Next step`.
- **Trust the proposal platform's status over a stale CRM stage.** If {{proposal_platform}} says declined or paid and the CRM still says open, the proposal platform wins.
- `metrics.md` holds the pipeline roll-up, recomputed by pipeline hygiene.

Wikilink the prospect, the company, and any call or campaign the deal touches. No em dashes. Structural changes here (a new convention or file type) update the root `MAP.md`.
