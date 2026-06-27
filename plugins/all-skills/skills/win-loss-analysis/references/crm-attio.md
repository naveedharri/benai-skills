# Attio CRM — Data Extraction Guide

## Architecture

Attio organizes data as Objects (like "People", "Companies") and Lists (like pipelines). Deals typically live in a List, where each entry links to a parent record (a person or company) and has list-specific attributes like stage, deal size, priority, etc.

## Discovery Steps

1. **Find the list**: Use `list-lists` (optionally with a `query` parameter matching the user's pipeline name) to find the list ID and parent object type.
2. **Get list attributes**: Use `list-list-attribute-definitions` on the list ID. This reveals attribute slugs for stage, deal size, lost reason, priority, source, notes, etc. Paginate if needed (limit 10 per call, use offset).
3. **Get stage options**: The stage attribute (usually slug `stage`) will have status options. Note the UUIDs for the Won and Lost stages — you'll need these for filtering.

## Efficient Data Extraction

### Filtering by Stage

Attio's `list-records-in-list` tool supports a `filter` parameter. Try it first:

```json
{
  "attribute": "stage",
  "op": "eq",
  "value": "Delivered"
}
```

Use the stage title (e.g., "Delivered", "Lost") or UUID. If this works, it dramatically reduces the data you pull.

**If filtering fails** (some Attio instances have validation issues with the filter parameter), fall back to pulling all entries with pagination:
- Use `list-records-in-list` with `limit: 50` and increment `offset` by 50 until you've covered all entries.
- Filter locally by checking the `stage` attribute in returned entry values.

### Getting Contact Details

Attio list entries contain a `parent_record_id` but NOT the full person/company record. You need a second lookup:

1. Collect all `parent_record_id` values from filtered entries.
2. Use `get-records-by-ids` with the parent object type (usually "people") and batch up to 20 IDs per call.
3. This returns full records including email addresses, names, phone numbers, etc.

### Email Domain Filtering

Attio does NOT support email domain filtering at the API level. You must:
1. Get all email addresses from the person records (look for `email_addresses` attribute).
2. Extract the domain (part after `@`).
3. Filter out personal domains locally.

### Key Attribute Slugs (Common)

These vary by workspace but commonly include:
- `stage` — deal status/pipeline stage
- `deal_size` or similar — monetary value
- `priority` — lead priority
- `lost_reason` — why the deal was lost
- `source` — lead source/channel
- `notes_next_steps` — free-text notes
- `close_date` — when the deal closed
- `deal_owner` — who owns the deal

Always use `list-list-attribute-definitions` to discover the actual slugs in the user's workspace.

## Email Enrichment

Use `search-emails-by-metadata` with the prospect's email address in `participant_email_addresses`. This returns email metadata (subject, sender, date) — NOT full content. Use `get-email-content` with the mailbox ID and email ID to read specific emails if needed.

## Call Transcript Enrichment

If Attio has call recordings, use `search-call-recordings-by-metadata` or `semantic-search-call-recordings` to find relevant calls.

## Batching Strategy

For a typical pipeline of 300-500 entries:
- **Stage-filtered approach** (if filter works): 2-3 API calls for Won, 2-3 for Lost
- **Paginated approach** (if filter fails): 7-10 API calls to get all entries, then local filtering
- **Person record lookups**: ceil(filtered_count / 20) API calls
- **Email searches**: 1 API call per lead (parallelize in batches of 5-6)
- **Fireflies searches**: 1-2 searches per lead (company name + contact name)

Total for a 300-entry pipeline: ~30-50 API calls vs 300+ if you pull every record individually.
