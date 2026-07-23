# Preflight: confirm the tools are connected

Run this before sourcing. The cost of a 30-second check is nothing against sourcing hundreds of leads and then finding the email finder is not wired up. Check only the tools the chosen source actually needs, then tell the user clearly if something is missing instead of silently dropping to a worse path.

## How to check

Most of these are MCP connectors or CLIs. Verify presence, do not assume.

- **MCP connectors** (Apify, Vibe Prospecting, gws, Slack, Attio): if you can see the server's tools, it is connected. If a needed server is in the "still connecting" list, wait and retry a search; if it never appears, it is not connected.
- **CLIs** (`gws`): `command -v gws` returns a path when installed.
- **API-key tools** (AnyMailFinder, Prospeo, Apollo, Vain.io): these are usually reached through Make, a CLI, or a stored key. Confirm the key/route exists before relying on it. A 401/402 means connected-but-unpaid, which is different from not-connected; report which.

## Checklist by source

| Source (Phase 1) | Must be connected | Also useful |
| --- | --- | --- |
| Google Maps (A) | Apify | email finder (Phase 5), gws (delivery) |
| Sales Navigator (B1) | Sales Navigator seat + the scrape route (Vain.io in the BenAI stack) | email finder, Apify (profile/company/posts), gws |
| Apify LinkedIn scrapers (B2) | Apify | email finder, gws |
| Prospecting DB (C) | Vibe Prospecting | gws |
| Niche directory (D) | Bash + network (custom scrape), optionally Apify | email finder, gws |
| Post engagers (E) | Apify (via `linkedin-post-engagers`) | email finder, gws |
| CRM mining (F) | the CRM connector (e.g. Attio) via `crm-prospect-mining` | email finder, gws |

## Enrichment providers (Phase 5)

At least one email finder must be reachable, or the list cannot be made contactable. Defaults and config in `enrichment.md`.

- **Email:** AnyMailFinder (default), Apollo, or Prospeo.
- **Phone:** Prospeo or Apollo, only when phone is wanted.

In vault mode, the configured providers and any routing live in `Context/config.md` and `Context/stack.md`. Read those instead of asking.

## Delivery (Phase 7)

- **`gws` present** -> offer CSV or Google Sheet.
- **`gws` absent** -> CSV only, and say so up front so the user is not expecting a Sheet.

## When something is missing

Stop and be specific. For example: "Sales Navigator scraping needs Vain.io, which is not connected. Options: connect Vain.io, switch to the Apify LinkedIn lead finder (slightly less precise targeting), or give me an exported Sales Navigator CSV and I will start at qualification." Let the user choose; do not quietly substitute a weaker source and present the result as equivalent.
