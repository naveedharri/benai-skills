# Salesforce CRM — Data Extraction Guide

## Architecture

Salesforce uses Opportunities (deals), Contacts, Accounts (companies), and Leads. Opportunities have a StageName field and belong to a record type or pipeline. Contacts are linked via Contact Roles on the Opportunity.

## Discovery Steps

1. **Identify the opportunity record type or pipeline**: Ask the user which opportunity type or record type to analyze.
2. **Get stage values**: Query the Opportunity StageName picklist to see available stages. Map the user's Won/Lost labels.
3. **Understand the data model**: Salesforce data is highly customizable. The user may have custom fields for lost reason, deal source, etc.

## Efficient Data Extraction

### Filtering by Stage (SOQL)

If the Salesforce MCP supports SOQL queries, this is extremely efficient:

```sql
SELECT Id, Name, Amount, StageName, CloseDate, LeadSource,
       Loss_Reason__c, OwnerId
FROM Opportunity
WHERE StageName = 'Closed Won'
AND CloseDate >= LAST_N_MONTHS:12
```

SOQL supports all standard operators including NOT LIKE for email domain filtering (though you'd need to join to Contacts for that).

### Getting Contact Details

Salesforce links Contacts to Opportunities via OpportunityContactRole:
1. Query OpportunityContactRole for the opportunity IDs
2. Get Contact details: Email, FirstName, LastName, Account.Name, Phone

Or use a relationship query:
```sql
SELECT Id, Name, Amount, (SELECT ContactId, Contact.Email, Contact.FirstName,
       Contact.LastName FROM OpportunityContactRoles)
FROM Opportunity WHERE StageName = 'Closed Won'
```

### Email Domain Filtering

Can be done in SOQL:
```sql
WHERE Contact.Email NOT LIKE '%@gmail.com'
AND Contact.Email NOT LIKE '%@yahoo.com'
```

This is one of the few CRMs where server-side email domain filtering is practical.

### Key Salesforce Fields

- `StageName` — deal stage
- `Amount` — deal value
- `CloseDate` — when closed
- `LeadSource` — lead origin
- `OwnerId` → User.Name — deal owner
- `Description` — notes
- Custom fields vary widely (often `Loss_Reason__c`, `Priority__c`, etc.)

## Email Enrichment

Salesforce tracks Activities (Tasks and Events) linked to records. Email-to-Salesforce captures email metadata. Query:
```sql
SELECT Subject, Description, CreatedDate, Who.Name
FROM Task WHERE WhatId = '<opportunity_id>' AND TaskSubType = 'Email'
```

## Batching Strategy

Salesforce with SOQL is the most efficient CRM for this workflow:
- **Full extraction**: 1-2 SOQL queries can pull everything you need (deals + contacts + activities)
- **Email domain filtering**: Server-side via SOQL WHERE clauses
- **Total**: Potentially as few as 5-10 API calls for a complete dataset

If the Salesforce MCP doesn't support SOQL, fall back to REST API endpoints for Opportunities, then Contacts, then Activities — similar to the Attio pattern but with better built-in filtering.
