# CRM Data Extraction Patterns

## Attio

Attio organizes data into **Objects** (People, Companies) and **Lists** (pipelines/workflows). Each list contains **Entries** that link to parent records from an object.

### Discovery
```
list-lists                              → find the target list
list-list-attribute-definitions [list]  → understand entry-level fields (stage, deal value, etc.)
list-attribute-definitions [object]     → understand record-level fields (email, phone, name, etc.)
```

### Data Model
- **List Entry**: belongs to a list, has entry-level attributes (stage, deal value, priority, lost reason)
- **Parent Record**: the person or company record linked to the entry (has email, phone, name)
- **Entry → Record link**: each entry has a `parent_record_id` pointing to the parent object record

### Extraction Flow
1. `list-records-in-list` with stage filter → get entries (paginate with offset, max 50 per call)
2. Collect all unique `parent_record_id` values
3. `get-records-by-ids` in batches → get person details (name, email, phone)
4. Match entry data (deal value, priority, stage) to person data via record_id

### Stage Filtering
Attio lists use a `status` type field for pipeline stages. Filter syntax:
```json
{"attribute": "stage_field_slug", "op": "eq", "value": "Lost"}
```
The stage field slug varies by list — always check `list-list-attribute-definitions` first.

For multiple stages, make separate queries (one per stage) rather than using OR filters, as OR filter support varies.

### Pagination
Max 50 entries per request. Use `offset` parameter:
```
offset=0   → entries 1-50
offset=50  → entries 51-100
offset=100 → entries 101-150
```
Continue until the response indicates no more records.

### Email Search
```
search-emails-by-metadata with participant_email_addresses: ["user@example.com"]
```
Returns email metadata (subject, summary, snippet, sender, sent_at). Use `get-email-content` for full body if needed.

### Meeting/Transcript Search
If Fireflies or similar is connected:
```
fireflies_search with keyword or participant filters
fireflies_get_summary for meeting summaries
fireflies_get_transcript for full transcripts
```

## HubSpot

### Discovery
- List deal pipelines and stages
- Check contact properties for available fields

### Extraction Flow
1. Query deals by pipeline stage
2. Get associated contacts for each deal
3. Pull contact details (email, phone, name, company)

## Salesforce

### Discovery
- Query OpportunityStage for stage names
- Check Opportunity and Contact field metadata

### Extraction Flow
1. SOQL query: `SELECT Id, Name, Amount, StageName FROM Opportunity WHERE StageName = 'Closed Lost'`
2. Get related Contacts via OpportunityContactRole
3. Pull Contact details

## General Principles

1. **Always inspect schema before querying.** Field names, types, and available filters vary between CRMs and even between different lists in the same CRM.

2. **Paginate everything.** Assume any list query has a page size limit. Loop until you've got all records.

3. **Separate entry-level from record-level data.** Pipeline attributes (stage, deal value) live on the entry/deal. Contact info (email, phone) lives on the person/contact record. You usually need both.

4. **Save raw data to disk after each extraction step.** Don't rely on conversation context for large datasets.
