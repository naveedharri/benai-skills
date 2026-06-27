# Generic CRM — Data Extraction Guide

Use this when no specific CRM reference file matches, or when working with Pipedrive, Close, Copper, Monday CRM, Zoho CRM, or any other CRM.

## General Approach

1. **Explore available tools.** List the MCP tools in your environment. Search for anything related to the CRM name (e.g., search for "pipedrive" or "close" or "zoho" in tool names).

2. **If no MCP connector exists:** Ask the user if they can export their pipeline data as a CSV. Most CRMs support CSV export with filters. If they can, ask them to:
   - Export Won/Closed-Won deals with: contact name, email, company, deal value, close date, source
   - Export Lost/Closed-Lost deals with: same fields + lost reason
   - Upload both CSVs

3. **If there's an MCP connector or API:** Follow the general extraction pattern:
   - Discover pipeline/stage structure
   - Filter by stage at the API level
   - Fetch contact details
   - Filter email domains locally

## CSV Fallback Workflow

If the user provides CSVs, read them and proceed directly to email domain filtering and enrichment. This skips the CRM API complexity entirely and can be the fastest path.

When working from CSV:
1. Read the CSV files with Python (pandas or csv module)
2. Identify the email column
3. Filter personal domains
4. Organize into Won/Lost buckets
5. Proceed to Phase 2 (enrichment) using the emails and company names from the CSV

## Common CRM Patterns

Most CRMs share these concepts even if naming differs:

| Concept | Common Names |
|---------|-------------|
| Deal | Opportunity, Lead, Card, Item |
| Pipeline Stage | Status, Column, Phase, Step |
| Won | Closed Won, Won, Delivered, Customer, Converted |
| Lost | Closed Lost, Lost, Dead, Churned, Disqualified |
| Deal Value | Amount, Revenue, Value, Price, Contract Value |
| Contact | Person, Lead, Prospect |
| Company | Account, Organization, Firm |
| Lost Reason | Close Reason, Loss Reason, Disqualification Reason |

## When Data is Limited

If the CRM has minimal data (just names, stages, and deal values), the analysis can still work:
- Focus Phase 2 enrichment on web research and email/call data
- The CRM provides the Won/Lost segmentation; enrichment provides the insight
- Even basic fields like deal size distribution and lost reason breakdown reveal patterns
