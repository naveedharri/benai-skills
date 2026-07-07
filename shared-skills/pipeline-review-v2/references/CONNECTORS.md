# Required Connectors

This skill requires three categories of connectors to function. At minimum, a CRM and either email or call transcription must be connected. All three together produces the best results.

## 1. CRM (Required)

The CRM is the source of truth for the prospect list, deal values, pipeline stages, and contact details.

### Attio

**MCP tools used:**
- `list-lists` -- discover available lists/pipelines
- `list-list-attribute-definitions` -- understand entry-level fields (stage, deal value, priority, etc.)
- `list-attribute-definitions` -- understand record-level fields (email, phone, name on the parent object)
- `list-records-in-list` -- pull entries with pagination (max 50 per request, use offset)
- `get-records-by-ids` -- batch-fetch person/company records by ID
- `search-records` -- full-text search for records by name/email/domain

**Data model:**
- Lists contain Entries. Each Entry links to a parent record (person or company) via `parent_record_id`.
- Entry-level attributes: stage, deal value, priority, forecast, close date, notes, agreement stage, source
- Record-level attributes: name, email_addresses, phone_numbers, company, location, linkedin

**Pagination pattern:**
```
list-records-in-list(list=LIST_ID, limit=50, offset=0)
list-records-in-list(list=LIST_ID, limit=50, offset=50)
...continue until has_more=false
```

**Stage filtering note:**
Server-side filtering on stage/status fields can be unreliable (validation errors with various filter syntaxes). The reliable approach is to pull ALL entries and filter locally by checking each entry's stage attribute. This is more API calls but avoids silent data loss.

**Record lookup:**
After collecting parent_record_ids from entries, batch-fetch with:
```
get-records-by-ids(object="people", record_ids=["id1", "id2", ...])
```
Max ~10 IDs per call is safe. Returns full person records with email, phone, name, company link, etc.

### HubSpot

**MCP tools:** Check for HubSpot MCP connector availability.
- Deals endpoint: pull deals by pipeline and stage
- Contacts endpoint: fetch contact details by ID
- Associations: link deals to contacts/companies

### Salesforce

**MCP tools:** Check for Salesforce MCP connector availability.
- Opportunity queries: filter by Stage
- Contact/Account lookups: get details by ID

### Pipedrive

**MCP tools:** Check for Pipedrive MCP connector availability.
- Deals: filter by pipeline and stage
- Persons/Organizations: get contact details

### Generic CRM

If the CRM doesn't have a dedicated MCP connector, check for:
- REST API tools that can make authenticated requests
- Data export capabilities
- Ask the user to export a CSV as a fallback

---

## 2. Email (Strongly Recommended)

Email history reveals the current state of each relationship -- who owes whom a response, what was last discussed, and whether momentum is building or fading.

### Gmail via Attio

Attio's email sync provides access to Gmail data through Attio's MCP tools. This is the most common setup.

**MCP tools used:**
- `search-emails-by-metadata` -- find emails by participant email address, domain, or date range
- `get-email-content` -- fetch the full body of a specific email

**Search pattern:**
```
search-emails-by-metadata(
  participant_email_addresses=["prospect@company.com"],
  limit=10
)
```
Returns: mailbox_id, email_id, subject_line, summary, snippet, sender, sent_at

**Full content retrieval:**
```
get-email-content(
  mailbox_id="MAILBOX_ID",
  email_id="EMAIL_ID"
)
```
Only pull full content for the 2-3 most recent emails where the summary is insufficient.

**Finding the mailbox_id:**
The mailbox_id comes from the email search results. It identifies which connected mailbox the email belongs to. You don't need to discover it separately.

### Gmail via Unipile

If Attio email sync isn't available, check for Unipile MCP connector which provides direct Gmail/Outlook access.

### Native Gmail MCP

Check for a dedicated Gmail MCP connector. Search `search_mcp_registry` for "gmail" if neither Attio nor Unipile email tools are available.

### Fallback

If no email connector is available, note this limitation in the output. The CRM + call transcript analysis alone still provides actionable insights.

---

## 3. Call Transcription (Strongly Recommended)

Meeting transcripts reveal what was actually discussed, objections raised, and next steps agreed on -- context that doesn't always make it into CRM notes or emails.

### Fireflies

**MCP tools used:**
- `fireflies_search` -- search transcripts by keyword, participant, date range
- `fireflies_get_transcripts` -- list transcripts with filters
- `fireflies_get_summary` -- get meeting summary, action items, keywords for a specific transcript
- `fireflies_get_transcript` -- get the full transcript with speaker labels

**Search pattern:**
```
fireflies_search(query='keyword:"Prospect Name" limit:3')
```
Or filter by participant email:
```
fireflies_get_transcripts(participants=["prospect@company.com"], limit:5)
```

**What to extract from each call:**
- `short_summary` -- 2-3 sentence overview
- `action_items` -- commitments made by each party
- `keywords` -- topics discussed
- `meeting_attendees` -- who was on the call
- `dateString` -- when it happened

For this skill, the summary is usually sufficient. Only pull the full transcript if the summary doesn't clarify the current status.

### Attio Call Recordings

**MCP tools used:**
- `search-call-recordings-by-metadata` -- find recordings by speaker, related record, or date
- `semantic-search-call-recordings` -- find calls where a topic was discussed
- `get-call-recording` -- get full transcript and metadata

**Search pattern:**
```
search-call-recordings-by-metadata(
  speaker_person_record_ids=["RECORD_ID"],
  limit=3
)
```

### Gong / Fathom / Otter

Check for MCP connectors via `search_mcp_registry`. The data needed is the same: meeting date, attendees, summary, action items.

### Fallback

If no call transcription tool is connected, rely on CRM notes and email history. Note the limitation in the output.

---

## Connector Priority

For the best results, connect all three:

1. **CRM** (required) -- prospect list, deal metadata
2. **Email** (strongly recommended) -- communication history, recency signals
3. **Call transcription** (strongly recommended) -- meeting context, verbal commitments

The skill degrades gracefully: CRM alone gives you the prospect list and metadata. Adding email reveals communication patterns. Adding calls reveals what was actually discussed. Each layer makes the action items more specific and accurate.
