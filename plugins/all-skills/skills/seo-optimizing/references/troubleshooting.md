# Troubleshooting Guide

This guide covers common issues encountered when using the SEO Optimizing skill with Google Search Console (GSC) API. Each problem includes the root cause and exact steps to resolve it.

---

## Authentication Issues

### Problem: `invalid_grant` error when exchanging JWT for access token

**Cause:** Usually a clock skew issue -- the JWT `iat` (issued at) or `exp` (expiration) times are outside Google's acceptable window.

**Solutions:**

1. Ensure system clock is accurate -- `date` should match current UTC time:
   ```bash
   # Check system time vs actual UTC
   date -u
   # Compare with an NTP server
   python3 -c "import ntplib; c = ntplib.NTPClient(); r = c.request('pool.ntp.org'); print(f'Offset: {r.offset:.2f}s')"
   ```

2. Use `iat = now - 10` seconds as a buffer to account for minor clock drift:
   ```bash
   NOW=$(date +%s)
   IAT=$((NOW - 10))
   EXP=$((NOW + 3590))
   ```

3. Regenerate the service account key (old keys can expire):
   - Go to Google Cloud Console > IAM & Admin > Service Accounts
   - Select the service account > Keys tab
   - Click "Add Key" > "Create new key" > JSON
   - Delete the old key after confirming the new one works

4. Check that the private key in the JSON file is not truncated or corrupted:
   ```bash
   # Verify key structure -- should output "RSA Private-Key" info without errors
   python3 -c "
   import json
   with open('service-account.json') as f:
       key = json.load(f)['private_key']
   print(f'Key starts with: {key[:30]}')
   print(f'Key ends with: {key[-30:]}')
   print(f'Key length: {len(key)} chars')
   "
   ```

---

### Problem: `403 Forbidden` when calling Search Analytics API

**Cause:** Service account does not have access to the GSC property.

**Solutions:**

1. Go to Google Search Console > Settings > Users and permissions

2. Verify the service account email (from the JSON key file) is listed:
   ```bash
   # Find the service account email
   python3 -c "import json; print(json.load(open('service-account.json'))['client_email'])"
   ```

3. The service account needs **"Full"** permission (not "Restricted"). Restricted permission blocks the Search Analytics API.

4. For domain properties (`sc-domain:example.com`), the service account needs to be added at the domain level, not a URL prefix. Domain-level access cannot be granted through the GSC UI for service accounts -- use the API:
   ```bash
   # Add service account as a user to a GSC property via the Webmasters API
   curl -X PUT \
     "https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Aexample.com/siteUsers" \
     -H "Authorization: Bearer ${ACCESS_TOKEN}" \
     -H "Content-Type: application/json" \
     -d '{
       "emailAddress": "your-service-account@project.iam.gserviceaccount.com",
       "permissionLevel": "siteFullUser"
     }'
   ```

5. Wait 15-30 minutes after adding -- permissions can take time to propagate. Verify access:
   ```bash
   # Test if the service account can list sites
   curl -s "https://www.googleapis.com/webmasters/v3/sites" \
     -H "Authorization: Bearer ${ACCESS_TOKEN}" | python3 -m json.tool
   ```

---

### Problem: `401 Unauthorized`

**Cause:** Access token is expired or malformed.

**Solutions:**

1. Access tokens expire after 1 hour -- regenerate if needed:
   ```bash
   # Check when you last generated the token
   # If it was more than 55 minutes ago, regenerate
   echo "Token generated at: $(date -r /tmp/gsc_token.txt 2>/dev/null || echo 'unknown')"
   ```

2. Check that the `Authorization: Bearer` header has the full token with no line breaks:
   ```bash
   # Verify token format -- should be one continuous string
   echo "$ACCESS_TOKEN" | wc -l
   # Should output: 1
   # If it outputs more, there are unwanted newlines
   ACCESS_TOKEN=$(echo "$ACCESS_TOKEN" | tr -d '\n')
   ```

3. Verify the JWT signing step produced valid output (check that openssl commands did not error):
   ```bash
   # Test JWT signing in isolation
   echo -n "test" | openssl dgst -sha256 -sign /tmp/gsc_private_key.pem -binary | base64 | wc -c
   # Should output a number > 100. If 0 or error, the key file is bad.
   ```

4. Verify the scope is exactly `https://www.googleapis.com/auth/webmasters.readonly`:
   ```bash
   # Decode your JWT to check the claims (without verifying signature)
   echo "$JWT_TOKEN" | cut -d'.' -f2 | base64 -d 2>/dev/null | python3 -m json.tool
   # Look for: "scope": "https://www.googleapis.com/auth/webmasters.readonly"
   ```

---

### Problem: JWT signing fails with openssl

**Cause:** Private key format issue.

**Solutions:**

1. The private key must start with `-----BEGIN PRIVATE KEY-----` (PKCS#8 format):
   ```bash
   head -1 /tmp/gsc_private_key.pem
   # Expected: -----BEGIN PRIVATE KEY-----
   ```

2. If it starts with `-----BEGIN RSA PRIVATE KEY-----` (PKCS#1), convert it:
   ```bash
   openssl pkcs8 -topk8 -nocrypt -in key.pem -out key-pkcs8.pem
   ```

3. Extract the key properly -- avoid newline escaping issues. Use python3 to extract the key from JSON rather than jq/sed, which can mangle the `\n` characters:
   ```bash
   python3 -c "
   import json
   with open('service-account.json') as f:
       key = json.load(f)['private_key']
   with open('/tmp/gsc_private_key.pem', 'w') as f:
       f.write(key)
   print('Key extracted successfully')
   "
   ```

4. On macOS, the default openssl might be LibreSSL -- check with `openssl version`. LibreSSL can behave differently for some operations. If needed, use Homebrew's openssl:
   ```bash
   openssl version
   # If it says "LibreSSL", use Homebrew's OpenSSL:
   $(brew --prefix openssl)/bin/openssl version
   # Use the full path for signing:
   $(brew --prefix openssl)/bin/openssl dgst -sha256 -sign /tmp/gsc_private_key.pem -binary
   ```

---

### Problem: `Search Console API has not been used in project` error

**Cause:** The API is not enabled in the Google Cloud project associated with the service account.

**Solutions:**

1. Go to Google Cloud Console > APIs & Services > Library

2. Search for "Google Search Console API"

3. Click "Enable"

4. Wait 5 minutes for the change to propagate

5. Verify it is enabled:
   ```bash
   # If you have gcloud CLI installed:
   gcloud services list --enabled --project=YOUR_PROJECT_ID | grep searchconsole
   # Should show: searchconsole.googleapis.com
   ```

6. If you cannot access the Cloud Console, enable via CLI:
   ```bash
   gcloud services enable searchconsole.googleapis.com --project=YOUR_PROJECT_ID
   ```

---

## API Issues

### Problem: Empty response (no rows returned)

**Causes and solutions:**

1. **Date range has no data:** New properties may not have historical data. Try a wider date range:
   ```bash
   # Use 90 days instead of 28
   START_DATE=$(date -v-90d +%Y-%m-%d 2>/dev/null || date -d '90 days ago' +%Y-%m-%d)
   END_DATE=$(date -v-3d +%Y-%m-%d 2>/dev/null || date -d '3 days ago' +%Y-%m-%d)
   ```

2. **Site URL format mismatch:** URL property (`https://example.com/`) vs domain property (`sc-domain:example.com`). Must match exactly what is registered in GSC:
   ```bash
   # List all properties the service account has access to
   curl -s "https://www.googleapis.com/webmasters/v3/sites" \
     -H "Authorization: Bearer ${ACCESS_TOKEN}" | python3 -c "
   import json, sys
   data = json.load(sys.stdin)
   for site in data.get('siteEntry', []):
       print(f\"{site['siteUrl']} (level: {site['permissionLevel']})\")
   "
   ```

3. **URL encoding issue:** The site URL in the API path must be URL-encoded. `https://example.com/` becomes `https%3A%2F%2Fexample.com%2F`:
   ```bash
   ENCODED_SITE_URL=$(python3 -c "import urllib.parse; print(urllib.parse.quote('${GSC_SITE_URL}', safe=''))")
   echo "Encoded URL: ${ENCODED_SITE_URL}"
   ```

4. **No search traffic:** The site genuinely has zero search impressions in the period. Verify by checking the GSC web UI directly.

5. **Data delay:** If endDate is today or yesterday, data may not be available yet. Use endDate = today minus 3 days:
   ```bash
   END_DATE=$(date -v-3d +%Y-%m-%d 2>/dev/null || date -d '3 days ago' +%Y-%m-%d)
   ```

---

### Problem: Row limit -- only getting 1,000 rows

**Cause:** Default rowLimit is 1,000.

**Solution:** Set `"rowLimit": 25000` in the request body. For more than 25,000 rows, use `startRow` for pagination:
```bash
# Page 1: rows 0-24999
curl -X POST \
  "https://www.googleapis.com/webmasters/v3/sites/${ENCODED_SITE_URL}/searchAnalytics/query" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "'${START_DATE}'",
    "endDate": "'${END_DATE}'",
    "dimensions": ["query"],
    "rowLimit": 25000,
    "startRow": 0
  }'

# Page 2: rows 25000-49999
# Same request but with "startRow": 25000

# Continue until you get fewer rows than rowLimit (indicating the last page)
```

**Automated pagination example:**
```bash
python3 -c "
import json, subprocess

start_row = 0
all_rows = []
while True:
    body = json.dumps({
        'startDate': '${START_DATE}',
        'endDate': '${END_DATE}',
        'dimensions': ['query'],
        'rowLimit': 25000,
        'startRow': start_row
    })
    result = subprocess.run([
        'curl', '-s', '-X', 'POST',
        'https://www.googleapis.com/webmasters/v3/sites/${ENCODED_SITE_URL}/searchAnalytics/query',
        '-H', 'Authorization: Bearer ${ACCESS_TOKEN}',
        '-H', 'Content-Type: application/json',
        '-d', body
    ], capture_output=True, text=True)
    data = json.loads(result.stdout)
    rows = data.get('rows', [])
    all_rows.extend(rows)
    print(f'Fetched {len(rows)} rows (total: {len(all_rows)})')
    if len(rows) < 25000:
        break
    start_row += 25000

print(f'Total rows: {len(all_rows)}')
"
```

---

### Problem: Rate limiting (429 Too Many Requests)

**Cause:** Exceeded the 1,200 requests/minute quota.

**Solutions:**

1. Add a 1-second sleep between API calls:
   ```bash
   sleep 1
   ```

2. Batch your queries -- pull all needed data in fewer calls, not dozens. Combine dimensions where possible:
   ```json
   {
     "dimensions": ["query", "page"],
     "rowLimit": 25000
   }
   ```
   This is better than making separate calls for queries and pages.

3. If consistently hitting limits, request a quota increase in Google Cloud Console:
   - Go to APIs & Services > Quotas
   - Find "Search Console API"
   - Click the pencil icon to request an increase

---

### Problem: `responseTooLarge` error

**Cause:** Response exceeds the maximum size limit.

**Solutions:**

1. Add more specific filters to reduce results:
   ```json
   {
     "dimensionFilterGroups": [{
       "filters": [{
         "dimension": "page",
         "operator": "contains",
         "expression": "/blog/"
       }]
     }]
   }
   ```

2. Use fewer dimensions (3 dimensions produces exponentially more rows than 2):
   ```json
   // Instead of this:
   { "dimensions": ["query", "page", "country", "device"] }
   // Use this:
   { "dimensions": ["query", "page"] }
   ```

3. Split the date range and make multiple smaller requests:
   ```bash
   # Instead of 90 days, do three 30-day requests
   # Request 1: days 1-30
   # Request 2: days 31-60
   # Request 3: days 61-90
   ```

4. Remove less important dimensions (e.g., country) and query them separately only when needed.

---

### Problem: URL format mismatch between GSC and your site

**Cause:** GSC stores the exact URL it found, which may differ from what you expect.

**Solutions:**

1. GSC URLs include the protocol (`https://`) -- always include it in filters.

2. Trailing slashes matter: `https://example.com/page` is not the same as `https://example.com/page/`. Check which version GSC has indexed:
   ```bash
   # Use "contains" operator to catch both variants
   {
     "dimensionFilterGroups": [{
       "filters": [{
         "dimension": "page",
         "operator": "contains",
         "expression": "example.com/page"
       }]
     }]
   }
   ```

3. Domain properties (`sc-domain:`) include ALL subdomains and protocols. URL-prefix properties only include the specific prefix.

4. When filtering by page in the API, use `contains` instead of `equals` to be more forgiving:
   ```json
   {
     "dimension": "page",
     "operator": "contains",
     "expression": "/your-page-slug"
   }
   ```

5. To see the exact URLs GSC has for a page, query with the `page` dimension and inspect:
   ```bash
   curl -s -X POST \
     "https://www.googleapis.com/webmasters/v3/sites/${ENCODED_SITE_URL}/searchAnalytics/query" \
     -H "Authorization: Bearer ${ACCESS_TOKEN}" \
     -H "Content-Type: application/json" \
     -d '{
       "startDate": "'${START_DATE}'",
       "endDate": "'${END_DATE}'",
       "dimensions": ["page"],
       "dimensionFilterGroups": [{
         "filters": [{
           "dimension": "page",
           "operator": "contains",
           "expression": "your-page-slug"
         }]
       }],
       "rowLimit": 100
     }' | python3 -c "
   import json, sys
   data = json.load(sys.stdin)
   for row in data.get('rows', []):
       print(row['keys'][0])
   "
   ```

---

## Data Issues

### Problem: No data for recent dates

**Cause:** GSC data has a 2-3 day processing delay. Data for today and yesterday is almost never available, and data from 2 days ago is often incomplete.

**Solution:** Set endDate to at least 3 days ago:
```bash
# macOS
END_DATE=$(date -v-3d +%Y-%m-%d)
# Linux
END_DATE=$(date -d '3 days ago' +%Y-%m-%d)

echo "Using endDate: ${END_DATE}"
```

For the most reliable data, use endDate = 5 days ago. The 3-day minimum is the absolute floor.

---

### Problem: Metrics seem wrong (CTR > 100%, negative clicks)

**Cause:** This should not happen with the API, but can occur with CSV exports or parsing errors.

**Solutions:**

1. CTR > 1.0 in the API means 100%+ -- this can legitimately happen when impressions are very low (1-2 impressions). A page with 2 impressions and 3 clicks (from rich results showing multiple links) can have CTR > 1.0. This is rare but valid.

2. If using CSV, check the column parsing -- CSV columns might be in a different order than expected:
   ```bash
   head -1 file.csv
   # Verify column order before parsing
   ```

3. Verify your Python parsing is reading the correct columns:
   ```python
   import csv
   with open('file.csv') as f:
       reader = csv.DictReader(f)
       print("Columns:", reader.fieldnames)
       row = next(reader)
       print("Sample row:", dict(row))
   ```

4. Check for data type issues -- string "100" vs integer 100:
   ```python
   # Always cast explicitly
   clicks = int(row['Clicks'])
   impressions = int(row['Impressions'])
   ctr = float(row['CTR'].replace('%', '')) / 100 if '%' in str(row['CTR']) else float(row['CTR'])
   position = float(row['Position'])
   ```

---

### Problem: Missing queries (GSC only shows some queries)

**Cause:** Google anonymizes queries with very low search volume to protect user privacy.

**Solutions:**

1. Queries with fewer than approximately 10 impressions may be aggregated or hidden. This is determined by Google and the exact threshold is not documented.

2. This is a Google limitation -- there is no workaround. The data is intentionally withheld.

3. Focus analysis on queries with 100+ impressions for reliable, actionable data:
   ```python
   # Filter for meaningful query volume
   meaningful_queries = [row for row in rows if row['impressions'] >= 100]
   print(f"Queries with 100+ impressions: {len(meaningful_queries)} out of {len(rows)} total")
   ```

4. The "anonymous queries" bucket appears as queries without keys -- these are real impressions but the query text is hidden. You can estimate anonymous traffic:
   ```python
   # Compare total impressions (no dimension) vs sum of query-level impressions
   # The difference is anonymous query traffic
   total_impressions = sum(row['impressions'] for row in no_dimension_data)
   query_impressions = sum(row['impressions'] for row in query_dimension_data)
   anonymous_impressions = total_impressions - query_impressions
   print(f"Anonymous query impressions: {anonymous_impressions} ({anonymous_impressions/total_impressions*100:.1f}%)")
   ```

---

### Problem: Position data looks wrong for a known #1 ranking

**Cause:** "Average position" is averaged across all impressions, including different queries, devices, and countries.

**Solutions:**

1. Filter by specific query + page to get the position for that exact combination:
   ```json
   {
     "dimensions": ["query", "page"],
     "dimensionFilterGroups": [{
       "filters": [
         {
           "dimension": "query",
           "operator": "equals",
           "expression": "your target keyword"
         },
         {
           "dimension": "page",
           "operator": "equals",
           "expression": "https://example.com/your-page/"
         }
       ]
     }]
   }
   ```

2. The page-level position (without query dimension) averages ALL queries the page ranks for, which can be very misleading. A page ranking #1 for its main keyword might also rank #40-100 for dozens of tangential queries.

3. A page might be #1 for its main keyword but #30 for long-tail queries, dragging the average up to #10-15. This does not mean the page dropped -- it means the average includes low-ranking queries.

4. To see the true position for a specific keyword, always include both `query` and `page` dimensions and filter for the exact keyword. See the Data Interpretation reference guide for the full "average position trap" explanation.

---

## CSV Import Issues

### Problem: CSV encoding errors

**Cause:** GSC exports may use different encodings depending on the user's locale settings.

**Solutions:**

1. Try UTF-8 first:
   ```python
   with open('file.csv', encoding='utf-8') as f:
       reader = csv.DictReader(f)
       rows = list(reader)
   ```

2. If that fails with a `UnicodeDecodeError`, try UTF-8 with BOM (common in Windows exports):
   ```python
   with open('file.csv', encoding='utf-8-sig') as f:
       reader = csv.DictReader(f)
       rows = list(reader)
   ```

3. For non-English locales, try Latin-1 which accepts any byte value:
   ```python
   with open('file.csv', encoding='latin-1') as f:
       reader = csv.DictReader(f)
       rows = list(reader)
   ```

4. Use Python's chardet library if unsure:
   ```bash
   pip install chardet
   python3 -c "
   import chardet
   with open('file.csv', 'rb') as f:
       result = chardet.detect(f.read())
   print(f\"Detected encoding: {result['encoding']} (confidence: {result['confidence']:.0%})\")
   "
   ```

---

### Problem: CSV column names do not match expected format

**Cause:** Column headers vary by language/locale setting in Google.

**Solutions:**

1. English headers are typically: "Top queries", "Clicks", "Impressions", "CTR", "Position"

2. Check the actual headers:
   ```bash
   head -1 file.csv
   ```

3. Use column index instead of column name when parsing for locale-independent code:
   ```python
   import csv
   with open('file.csv', encoding='utf-8-sig') as f:
       reader = csv.reader(f)
       headers = next(reader)
       print(f"Headers found: {headers}")
       # Use index-based access
       for row in reader:
           query = row[0]       # First column is always the query/page
           clicks = int(row[1]) # Second column is clicks
           impressions = int(row[2])
           # CTR and Position columns follow
   ```

4. Common header variations across locales:
   - "Top queries" vs "Queries" vs "Search query"
   - "Average position" vs "Position"
   - "Top pages" vs "Pages" vs "Page"

---

### Problem: CSV only has 1,000 rows

**Cause:** GSC web UI exports are limited to 1,000 rows maximum. This is a hard limit imposed by Google.

**Solutions:**

1. This is a hard limit on the web UI export -- use the API path for full data. The API supports up to 25,000 rows per request with pagination for unlimited total rows.

2. For partial analysis, 1,000 rows covers the top queries/pages which are usually the most impactful (top queries by clicks typically represent 80%+ of total traffic).

3. Apply filters in GSC before exporting (specific page, device, country) to get the most relevant 1,000 rows:
   - Filter to a specific subdirectory (e.g., `/blog/`)
   - Filter to a specific country
   - Filter to mobile or desktop only
   - Export each filtered view separately

4. Export multiple filtered CSVs to cover more ground:
   ```bash
   # After downloading multiple filtered CSVs, merge them:
   python3 -c "
   import csv, glob

   all_rows = {}
   for filepath in glob.glob('*.csv'):
       with open(filepath, encoding='utf-8-sig') as f:
           reader = csv.DictReader(f)
           for row in reader:
               key = row.get('Top queries', row.get('Top pages', ''))
               if key not in all_rows:
                   all_rows[key] = row

   print(f'Total unique rows across all CSVs: {len(all_rows)}')
   "
   ```

---

### Problem: CTR shows as percentage string (e.g., "5.2%") instead of decimal

**Cause:** CSV exports format CTR as a human-readable percentage, while the API returns it as a decimal (e.g., 0.052).

**Solution:** Strip the `%` sign when parsing:
```python
def parse_ctr(ctr_string):
    """Parse CTR from either CSV format ('5.2%') or API format (0.052)."""
    ctr_string = str(ctr_string).strip()
    if '%' in ctr_string:
        return float(ctr_string.replace('%', '').replace(',', '.')) / 100
    else:
        value = float(ctr_string)
        # If value > 1, it's likely already a percentage (e.g., 5.2 instead of 0.052)
        if value > 1:
            return value / 100
        return value

# Usage
ctr = parse_ctr(row['CTR'])
print(f"CTR: {ctr:.4f} ({ctr*100:.2f}%)")
```

---

## Common Workflow Mistakes

### Mistake: Loading all 25,000 rows into Claude's context

**Why it is a problem:** Claude's context window is finite. Dumping 25,000 rows of raw data wastes context space and makes analysis slower and less accurate.

**Fix:** Always use python3 or jq to filter data BEFORE reading it. Only pull the specific rows matching your analysis criteria:
```bash
# BAD: Reading the entire file
cat gsc_data.json

# GOOD: Filter to only what you need
python3 -c "
import json
with open('gsc_data.json') as f:
    data = json.load(f)

# Only show queries with 100+ impressions, sorted by opportunity
rows = data.get('rows', [])
filtered = [r for r in rows if r['impressions'] >= 100]
filtered.sort(key=lambda r: r['impressions'] * (1 - r['ctr']), reverse=True)

for row in filtered[:20]:
    q = row['keys'][0]
    print(f\"{q}: pos={row['position']:.1f}, imp={row['impressions']}, ctr={row['ctr']:.2%}, clicks={row['clicks']}\")
"
```

---

### Mistake: Running analysis on fewer than 28 days of data

**Why it is a problem:** Shorter periods have too much daily variance. A single viral day or a weekend dip can skew all metrics.

**Fix:** Always use at least 28 days (4 full weeks) to smooth out weekly cycles:
```bash
# 28 days minimum
START_DATE=$(date -v-31d +%Y-%m-%d 2>/dev/null || date -d '31 days ago' +%Y-%m-%d)
END_DATE=$(date -v-3d +%Y-%m-%d 2>/dev/null || date -d '3 days ago' +%Y-%m-%d)
echo "Date range: ${START_DATE} to ${END_DATE}"
```

For seasonal businesses or trend analysis, use 90 days. For year-over-year comparisons, use matching 28-day windows from the same period in the previous year.

---

### Mistake: Not URL-encoding the site URL in API calls

**Why it is a problem:** The site URL appears in the API path and must be URL-encoded. Without encoding, `https://example.com/` breaks the URL structure.

**Fix:** URL-encode the site URL:
```bash
ENCODED_SITE_URL=$(python3 -c "import urllib.parse; print(urllib.parse.quote('${GSC_SITE_URL}', safe=''))")
echo "Raw: ${GSC_SITE_URL}"
echo "Encoded: ${ENCODED_SITE_URL}"

# Use in API calls
curl -s -X POST \
  "https://www.googleapis.com/webmasters/v3/sites/${ENCODED_SITE_URL}/searchAnalytics/query" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

Common encoding values:
| Character | Encoded |
|-----------|---------|
| `:`       | `%3A`   |
| `/`       | `%2F`   |
| `https://example.com/` | `https%3A%2F%2Fexample.com%2F` |
| `sc-domain:example.com` | `sc-domain%3Aexample.com` |

---

### Mistake: Using endDate = today

**Why it is a problem:** GSC data for today (and usually yesterday) is incomplete or entirely missing. Queries that include today's date will return partial data that understates actual performance.

**Fix:** Use endDate = today minus 3 days to ensure complete data:
```bash
# macOS
END_DATE=$(date -v-3d +%Y-%m-%d)
# Linux
END_DATE=$(date -d '3 days ago' +%Y-%m-%d)
```

---

### Mistake: Comparing raw numbers without context

**Why it is a problem:** CTR means nothing without knowing the position. A 2% CTR at position 1 is terrible; a 2% CTR at position 8 is decent. Clicks mean nothing without knowing impressions.

**Fix:** Always show metrics alongside their position and volume context:
```python
# BAD: "This query has 5% CTR"
# GOOD: "This query has 5% CTR at position 3.2 (expected CTR for position 3: ~8%) -- underperforming"

# Expected CTR benchmarks by position (approximate)
EXPECTED_CTR = {
    1: 0.28, 2: 0.15, 3: 0.10, 4: 0.07, 5: 0.05,
    6: 0.04, 7: 0.03, 8: 0.025, 9: 0.02, 10: 0.018
}

for row in filtered_rows:
    pos = round(row['position'])
    expected = EXPECTED_CTR.get(pos, 0.01)
    actual = row['ctr']
    status = "underperforming" if actual < expected * 0.7 else "normal" if actual < expected * 1.3 else "overperforming"
    print(f"Query: {row['keys'][0]}")
    print(f"  Position: {row['position']:.1f}, CTR: {actual:.2%} (expected: {expected:.2%}) -- {status}")
    print(f"  Impressions: {row['impressions']}, Clicks: {row['clicks']}")
```

---

### Mistake: Forgetting to re-authenticate after 1 hour

**Why it is a problem:** Access tokens expire after 3,600 seconds (1 hour). After expiration, all API calls return 401 errors.

**Fix:** Re-run the JWT authentication flow if you get 401 errors after working for a while. Build a check into your workflow:
```bash
# Quick test before making API calls
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  "https://www.googleapis.com/webmasters/v3/sites" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

if [ "$HTTP_STATUS" = "401" ]; then
    echo "Token expired. Re-authenticating..."
    # Re-run your JWT auth flow here
    # ... (generate new JWT, exchange for access token)
else
    echo "Token valid (HTTP ${HTTP_STATUS})"
fi
```

---

### Mistake: Not saving baseline data before making optimizations

**Why it is a problem:** Without a baseline, you cannot measure the impact of your optimizations. You will not know if changes helped, hurt, or had no effect.

**Fix:** Always capture and save baseline data before making any changes:
```bash
# Save baseline BEFORE optimizing
python3 -c "
import json

# Assume gsc_data.json has the current API response
with open('gsc_data.json') as f:
    data = json.load(f)

baseline = {
    'date_captured': '$(date +%Y-%m-%d)',
    'date_range': {
        'start': '${START_DATE}',
        'end': '${END_DATE}'
    },
    'total_queries': len(data.get('rows', [])),
    'rows': data.get('rows', [])
}

with open('seo_baseline_$(date +%Y%m%d).json', 'w') as f:
    json.dump(baseline, f, indent=2)

print(f\"Baseline saved: {baseline['total_queries']} queries\")
print(f\"File: seo_baseline_$(date +%Y%m%d).json\")
"
```

After making optimizations, wait at least 2-4 weeks, then compare:
```bash
python3 -c "
import json

with open('seo_baseline_YYYYMMDD.json') as f:
    baseline = json.load(f)
with open('gsc_data_current.json') as f:
    current = json.load(f)

# Compare key metrics
def summarize(rows):
    return {
        'total_clicks': sum(r['clicks'] for r in rows),
        'total_impressions': sum(r['impressions'] for r in rows),
        'avg_ctr': sum(r['clicks'] for r in rows) / max(sum(r['impressions'] for r in rows), 1),
        'avg_position': sum(r['position'] * r['impressions'] for r in rows) / max(sum(r['impressions'] for r in rows), 1)
    }

before = summarize(baseline['rows'])
after = summarize(current.get('rows', []))

print(f\"Clicks:      {before['total_clicks']} -> {after['total_clicks']} ({after['total_clicks'] - before['total_clicks']:+d})\")
print(f\"Impressions: {before['total_impressions']} -> {after['total_impressions']} ({after['total_impressions'] - before['total_impressions']:+d})\")
print(f\"CTR:         {before['avg_ctr']:.2%} -> {after['avg_ctr']:.2%}\")
print(f\"Position:    {before['avg_position']:.1f} -> {after['avg_position']:.1f}\")
"
```

---

## Quick Diagnostic Checklist

When something is not working, run through this checklist in order:

```bash
# 1. Is the service account key valid?
python3 -c "import json; d=json.load(open('service-account.json')); print(f\"Email: {d['client_email']}\nProject: {d['project_id']}\")"

# 2. Can you generate a valid JWT?
# (run your JWT generation code and check for errors)

# 3. Can you exchange the JWT for an access token?
curl -s -X POST "https://oauth2.googleapis.com/token" \
  -d "grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${JWT}" \
  | python3 -c "import json,sys; d=json.load(sys.stdin); print('Token OK' if 'access_token' in d else f'Error: {d}')"

# 4. Can you list GSC properties?
curl -s "https://www.googleapis.com/webmasters/v3/sites" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  | python3 -c "import json,sys; d=json.load(sys.stdin); sites=d.get('siteEntry',[]); print(f'{len(sites)} properties found'); [print(f'  {s[\"siteUrl\"]}') for s in sites]"

# 5. Can you query search analytics?
curl -s -X POST \
  "https://www.googleapis.com/webmasters/v3/sites/${ENCODED_SITE_URL}/searchAnalytics/query" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"startDate\":\"${START_DATE}\",\"endDate\":\"${END_DATE}\",\"dimensions\":[\"query\"],\"rowLimit\":5}" \
  | python3 -c "import json,sys; d=json.load(sys.stdin); rows=d.get('rows',[]); print(f'{len(rows)} rows returned'); [print(f'  {r[\"keys\"][0]}: {r[\"clicks\"]} clicks') for r in rows]"
```

If step N fails, the problem is at that step. Fix it before proceeding to step N+1.
