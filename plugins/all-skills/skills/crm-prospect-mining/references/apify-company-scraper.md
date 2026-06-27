# Apify Company LinkedIn Scraper Reference

## Actor: `scrapeverse/linkedin-company-profile-scraper-pay-per-event`

Pay-per-event actor for scraping LinkedIn company page data. No subscription required — you pay per company scraped (~$0.006/company).

### Input Schema
```json
{
  "urls": [
    "https://www.linkedin.com/company/example-1",
    "https://www.linkedin.com/company/example-2"
  ],
  "proxy": {
    "useApifyProxy": true
  }
}
```

### Key Output Fields
| Field | Type | Description |
|-------|------|-------------|
| `inputURL` | string | The LinkedIn URL you submitted (use for matching) |
| `company_name` | string | Company name as shown on LinkedIn |
| `company_size_on_linkedin` | number | Numeric employee count (the key metric) |
| `company_size` | string | Text range (e.g., "51-200 employees") |
| `description` | string | Company description from LinkedIn |
| `industry` | string | Industry classification |
| `headquarters` | string | HQ location |
| `website` | string | Company website URL |

### Calling via MCP

**Mandatory two-step process:**

1. Get actor info first:
```
call-actor(actor="scrapeverse/linkedin-company-profile-scraper-pay-per-event", step="info")
```

2. Then execute:
```
call-actor(
  actor="scrapeverse/linkedin-company-profile-scraper-pay-per-event",
  step="call",
  input={"urls": [...], "proxy": {"useApifyProxy": true}}
)
```

### Timeout Handling

The MCP connector times out after ~30 seconds. For batches larger than ~20 URLs, the actor won't finish in time. This is expected.

**Recovery pattern:**
1. The partial response from the timed-out call contains the `runId`
2. Poll with `get-actor-run(runId=...)` every 60 seconds
3. When status is `SUCCEEDED`, fetch results with `get-dataset-items(datasetId=...)`

### URL Requirements

- Must be full LinkedIn company page URLs: `https://www.linkedin.com/company/[slug]`
- Country subdomains work but normalize to `www.linkedin.com` for consistency
- Don't include personal profile URLs (`/in/...`) — this actor is for company pages only
- Remove duplicates before sending — paying twice for the same company is wasteful

### Empty Results

Some companies return empty objects (no data). This happens when:
- The company page was recently deleted
- The page is restricted/private
- The URL slug changed

Handle gracefully — skip these in your analysis rather than erroring out.

### Cost Estimation

At ~$0.006 per company:
- 50 companies ≈ $0.30
- 100 companies ≈ $0.60
- 500 companies ≈ $3.00

### Alternative Actor (Subscription-Based)

`scrapeverse/linkedin-company-profile-scraper` (Actor ID: `3rgDeYgLhr6XrVnjs`) is the subscription-based version. Same input/output schema but requires an active rental. If the pay-per-event actor stops working, try the subscription version (user may need to rent it first).

### Personal Domain Filter List

Use this for pre-filtering before LinkedIn lookup:
```
gmail.com, yahoo.com, hotmail.com, outlook.com, live.com, aol.com, icloud.com,
me.com, mail.com, protonmail.com, zoho.com, yandex.com, gmx.com, tutanota.com,
fastmail.com, hushmail.com, inbox.com, msn.com, qq.com, 163.com, 126.com,
rediffmail.com, web.de, gmx.de, t-online.de, orange.fr, free.fr, laposte.net,
ymail.com, rocketmail.com, att.net, sbcglobal.net, bellsouth.net, charter.net,
comcast.net, cox.net, earthlink.net, juno.com, naver.com, hanmail.net, daum.net,
sina.com, sohu.com, aliyun.com, yeah.net, foxmail.com, mail.ru, bk.ru, list.ru,
rambler.ru, ukr.net, bigpond.com, optusnet.com.au, telstra.com
```
