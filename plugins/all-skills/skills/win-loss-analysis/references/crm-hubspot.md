# HubSpot CRM — Data Extraction Guide

## Architecture

HubSpot uses Deals (in a Pipeline with Stages), Contacts, and Companies as core objects. Deals are associated with Contacts and Companies via associations. Pipelines have named stages with internal IDs.

## Discovery Steps

1. **Find the pipeline**: Use the HubSpot MCP tools to list pipelines. Identify the one the user specified and get its ID.
2. **Get pipeline stages**: Each pipeline has stages with labels and IDs. Map the user's Won/Lost labels to stage IDs.
3. **Understand associations**: Deals are linked to Contacts and Companies. You'll need to traverse these associations.

## Efficient Data Extraction

### Filtering by Stage (HubSpot's Strength)

HubSpot's deal search/filter API is robust. You can filter by:
- `dealstage` — the pipeline stage ID
- `pipeline` — if there are multiple pipelines

This is the most efficient CRM for stage filtering. Use it to pull ONLY Won and Lost deals.

### Getting Contact Details

HubSpot deals are associated with contacts. The flow:
1. Pull deals filtered by stage (Won/Lost).
2. For each deal, get its associated contacts via the associations API.
3. Retrieve contact properties: email, firstname, lastname, company, phone.

Many HubSpot MCP connectors can return associated contacts inline with the deal — check if your connector supports `associations` in the deal fetch.

### Email Domain Filtering

HubSpot supports property-based filtering. You can try:
- Filter where `email` does not contain `@gmail.com` (repeat for each personal domain)
- Or: filter contacts where `hs_email_domain` is not in the personal domain list

However, "does not contain" filters can be tricky with multiple domains. Often faster to:
1. Pull all deals for the stage.
2. Get associated contacts.
3. Filter locally by email domain.

### Key HubSpot Properties (Standard)

- `dealstage` — pipeline stage
- `amount` — deal value
- `closedate` — close date
- `dealname` — deal name
- `pipeline` — which pipeline
- `closed_lost_reason` — why lost (if configured)
- `hs_analytics_source` — lead source
- `hubspot_owner_id` — deal owner

Contact properties:
- `email` — primary email
- `firstname`, `lastname` — name
- `company` — company name
- `website` — company website

## Email Enrichment

HubSpot tracks email engagement natively. Use the engagements API to pull emails linked to deals or contacts. This is often richer than separate email search because HubSpot captures open/click tracking too.

## Batching Strategy

HubSpot is generally more efficient than Attio because:
- Stage filtering works reliably at the API level
- Contact associations can be fetched inline with deals
- Engagement data (emails, calls, notes) is linked to the deal/contact record

For a 300-deal pipeline:
- **Deal extraction**: 1-3 API calls (filtered by stage, paginated)
- **Contact enrichment**: Usually included in deal fetch via associations, or ceil(count/100) calls
- **Engagement data**: 1 call per deal (or batch)
- **Email domain filtering**: Local, after contact fetch

Total: ~20-30 API calls for a clean dataset.
