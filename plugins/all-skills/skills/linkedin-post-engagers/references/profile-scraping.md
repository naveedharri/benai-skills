# Steps 4-5: Profile and Company Scraping

## Contents

- [Step 4: People Profile Scrape](#step-4-people-profile-scrape) (actor input, key fields, CSV enrichment, unemployed removal)
- [Step 5: Company Profile Scrape](#step-5-company-profile-scrape) (actor input, key fields)
- [Fuzzy Company Matching](#critical-company-url-format-mismatch-fuzzy-matching-required) (three-tier strategy + code)
- [Merge Company Data](#merge-company-data) (columns, website filter, report)

Both actors follow the actor call pattern in `apify-operations.md` (schema first, timeout polling, sample before download, curl full dataset).

## Step 4: People Profile Scrape

Scrape full LinkedIn profiles for the qualified engagers (or all if no qualification was done).

### Actor: `dev_fusion/Linkedin-Profile-Scraper`

1. **Get actor info**: Call `call-actor` with `step: "info"` for `dev_fusion/Linkedin-Profile-Scraper`
2. **Execute**: Call `call-actor` with `step: "call"`:

```json
{
  "profileUrls": ["https://www.linkedin.com/in/handle1", "..."]
}
```

Send ALL URLs in a single API call. Never split into multiple runs.

3. **Follow the timeout/polling pattern** (sleep 60s → find run → poll status → wait if RUNNING)
4. **Sample 2-3 items first** to discover field names before processing full dataset
5. **Download full dataset via curl**

### Key Fields to Extract

The exact field names depend on the actor's current output. Sample first, then look for:

- **About/bio**: likely `about` (top-level)
- **Current company name**: likely `companyName` (top-level), this is the current position's company
- **Company LinkedIn URL**: likely `companyLinkedin` (top-level)
- **Employment status**: check if `companyName` is empty to identify unemployed profiles

### Enrich the CSV

Merge profile data back into the engager CSV by matching on LinkedIn URL (normalize URLs per `apify-operations.md`). Add columns:

- `About`
- `Company Name`
- `Company LinkedIn URL`

### Remove Unemployed Profiles

Remove any profiles where the current company name is empty, these are unemployed or have incomplete profiles. They won't have useful company data for the next step.

Report:

```
Profile scraping complete.
- Profiles scraped: [N]
- Unemployed removed: [X]
- Remaining leads: [Y]
```

## Step 5: Company Profile Scrape

Extract unique company LinkedIn URLs from the enriched profiles, then scrape company pages to get website URLs and descriptions.

### Actor: `dev_fusion/Linkedin-Company-Scraper`

1. **Get actor info**: Call `call-actor` with `step: "info"` for `dev_fusion/Linkedin-Company-Scraper`
2. **Execute**: Call `call-actor` with `step: "call"`:

```json
{
  "profileUrls": ["https://www.linkedin.com/company/company-slug/", "..."]
}
```

3. **Follow the timeout/polling pattern** (sleep 60s → find run → poll status)
4. **Sample 2-3 items first** to discover field names
5. **Download full dataset via curl**

### Key Fields to Extract

Sample first, then look for:

- **Company name**: likely `companyName`
- **Description**: likely `description`
- **Website URL**: likely `websiteUrl`
- **Employee count/headcount**: likely `employeeCount`
- **Company LinkedIn URL**: likely `url`

### CRITICAL: Company URL Format Mismatch, Fuzzy Matching Required

The profile scraper returns company LinkedIn URLs in **numeric ID format** (e.g., `linkedin.com/company/8736/`), while the company scraper output may use **slug format** (e.g., `linkedin.com/company/tesla-motors`).

You CANNOT rely on exact URL matching alone. Use a three-tier matching strategy:

1. **Exact URL match** (after normalizing: lowercase, strip trailing slash)
2. **Exact normalized company name match** (lowercase, strip suffixes like Inc/Ltd/LLC/GmbH/BV, remove special chars)
3. **Fuzzy name match** using `difflib.SequenceMatcher` with a threshold of 0.7

```python
from difflib import SequenceMatcher
import re

def normalize_company_name(s):
    s = s.lower().strip()
    for suffix in [' inc', ' inc.', ' llc', ' ltd', ' ltd.', ' corp', ' corp.',
                   ' co', ' co.', ' pvt', ' pvt.', ' private', ' limited', ' gmbh', ' bv', ' b.v.']:
        if s.endswith(suffix):
            s = s[:-len(suffix)].strip()
    s = re.sub(r'[^a-z0-9\s]', '', s)
    s = re.sub(r'\s+', ' ', s).strip()
    return s

def fuzzy_score(name1, name2):
    n1, n2 = normalize_company_name(name1), normalize_company_name(name2)
    if not n1 or not n2:
        return 0
    if n1 == n2:
        return 1.0
    if n1 in n2 or n2 in n1:
        return 0.9
    return SequenceMatcher(None, n1, n2).ratio()
```

If no match is found (below 0.7 threshold), **remove that lead from the final list**.

### Merge Company Data

Add these columns to the CSV:

- `Company Description`
- `Company Website`
- `Company Headcount`

### Remove Leads Without Websites

Remove any leads where `Company Website` is empty after the merge.

Report:

```
Company enrichment complete.
- Companies scraped: [N]
- URL-matched: [X]
- Fuzzy name-matched: [Y]
- Unmatched (removed): [Z]
- No website (removed): [W]
- Final lead count: [F]
```
