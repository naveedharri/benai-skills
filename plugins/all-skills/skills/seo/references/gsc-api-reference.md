# GSC API Reference

Complete reference for authenticating with and querying the Google Search Console API via bash/curl. Every code block in this document is copy-pasteable and production-ready.

---

## Service Account Setup

Follow these steps exactly to create a service account and grant it access to your Search Console property.

### Step 1: Create or Select a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top of the page
3. Click **New Project** (or select an existing project)
4. Give the project a name (e.g., "GSC SEO Automation") and click **Create**
5. Wait for the project to be created, then select it from the project dropdown

### Step 2: Enable the Google Search Console API

1. In the Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for **Google Search Console API**
3. Click on it and click **Enable**
4. Wait for the API to be enabled (takes a few seconds)

### Step 3: Create a Service Account

1. Go to **IAM & Admin** > **Service Accounts** in the left sidebar
2. Click **+ Create Service Account** at the top
3. Enter a name (e.g., "gsc-reader") and an optional description
4. Click **Create and Continue**
5. For the role, you can skip this step (no project-level role needed) -- click **Continue**
6. Click **Done**

### Step 4: Create and Download a JSON Key

1. In the Service Accounts list, click on the service account you just created
2. Go to the **Keys** tab
3. Click **Add Key** > **Create new key**
4. Select **JSON** and click **Create**
5. The JSON key file will download automatically -- save it somewhere secure (e.g., `~/.config/gsc/service-account.json`)
6. Note the `client_email` field inside the JSON file -- you will need it in the next step

### Step 5: Add the Service Account to Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property
3. Click **Settings** (gear icon) in the left sidebar
4. Click **Users and permissions**
5. Click **Add User**
6. Paste the `client_email` from your JSON key file (it looks like `gsc-reader@your-project.iam.gserviceaccount.com`)
7. Set permission to **Full** (required for Search Analytics API access)
8. Click **Add**

### Step 6: Create the .env File

Create a `.env` file in your working directory:

```bash
# Google Search Console Configuration
GSC_SERVICE_ACCOUNT_JSON=/path/to/service-account-key.json
GSC_SITE_URL=https://example.com
```

For domain properties, use the `sc-domain:` prefix:

```bash
GSC_SITE_URL=sc-domain:example.com
```

---

## Authentication -- JWT Generation via Bash

This script reads credentials from `.env`, generates a signed JWT, exchanges it for an access token, and URL-encodes the site URL. After running this block, `ACCESS_TOKEN` and `ENCODED_SITE_URL` are set and ready for API calls.

```bash
# Load environment variables
source .env

# Extract client_email and private_key from the service account JSON
CLIENT_EMAIL=$(python3 -c "import json; d=json.load(open('${GSC_SERVICE_ACCOUNT_JSON}')); print(d['client_email'])")
PRIVATE_KEY=$(python3 -c "
import json
d = json.load(open('${GSC_SERVICE_ACCOUNT_JSON}'))
print(d['private_key'])
")

# Write the private key to a temporary file for openssl
PRIVATE_KEY_FILE=$(mktemp)
echo "${PRIVATE_KEY}" > "${PRIVATE_KEY_FILE}"

# Base64url encode helper (no padding, URL-safe)
b64url() {
  openssl base64 -A | tr '+/' '-_' | tr -d '='
}

# JWT Header
JWT_HEADER=$(printf '{"alg":"RS256","typ":"JWT"}' | b64url)

# JWT Claim Set
NOW=$(date +%s)
EXP=$((NOW + 3600))
JWT_CLAIM=$(printf '{
  "iss": "%s",
  "scope": "https://www.googleapis.com/auth/webmasters.readonly",
  "aud": "https://oauth2.googleapis.com/token",
  "iat": %d,
  "exp": %d
}' "${CLIENT_EMAIL}" "${NOW}" "${EXP}" | b64url)

# Sign the JWT with RSA-SHA256
SIGNATURE=$(printf '%s.%s' "${JWT_HEADER}" "${JWT_CLAIM}" | \
  openssl dgst -sha256 -sign "${PRIVATE_KEY_FILE}" | b64url)

# Assemble the signed JWT
SIGNED_JWT="${JWT_HEADER}.${JWT_CLAIM}.${SIGNATURE}"

# Clean up the temporary private key file
rm -f "${PRIVATE_KEY_FILE}"

# Exchange the signed JWT for an access token
TOKEN_RESPONSE=$(curl -s -X POST "https://oauth2.googleapis.com/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${SIGNED_JWT}")

# Extract the access token
ACCESS_TOKEN=$(echo "${TOKEN_RESPONSE}" | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")

# URL-encode the site URL for use in API endpoint paths
ENCODED_SITE_URL=$(python3 -c "import urllib.parse; print(urllib.parse.quote('${GSC_SITE_URL}', safe=''))")

# Verify
echo "ACCESS_TOKEN set: ${ACCESS_TOKEN:0:20}..."
echo "ENCODED_SITE_URL: ${ENCODED_SITE_URL}"
```

**Important notes:**

- The access token is valid for **1 hour** (3600 seconds). Re-run the script if it expires.
- The `scope` uses `webmasters.readonly` which is sufficient for reading search analytics, URL inspection, and sitemaps. If you need write access (e.g., submitting sitemaps), use `https://www.googleapis.com/auth/webmasters` instead.
- The `b64url` function strips padding and replaces `+/` with `-_` to produce URL-safe base64 as required by the JWT spec (RFC 7515).

---

## Search Analytics API

### Endpoint

```
POST https://www.googleapis.com/webmasters/v3/sites/{siteUrl}/searchAnalytics/query
```

Where `{siteUrl}` is the URL-encoded site URL (stored in `ENCODED_SITE_URL`).

### Request Body Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `startDate` | string | Yes | Start date in `YYYY-MM-DD` format |
| `endDate` | string | Yes | End date in `YYYY-MM-DD` format |
| `dimensions` | array | No | Dimensions to group by. Values: `"query"`, `"page"`, `"country"`, `"device"`, `"date"`, `"searchAppearance"` |
| `dimensionFilterGroups` | array | No | Array of filter group objects (see below) |
| `rowLimit` | integer | No | Number of rows to return. Range: 1-25000. Default: 1000 |
| `startRow` | integer | No | Zero-indexed offset for pagination |
| `type` | string | No | Search type. Values: `"web"` (default), `"image"`, `"video"`, `"news"`, `"discover"`, `"googleNews"` |
| `dataState` | string | No | `"all"` (default, includes fresh data) or `"final"` (only fully processed data) |
| `aggregationType` | string | No | `"auto"` (default), `"byPage"`, `"byProperty"` |

### Dimension Filter Groups

Filter groups allow you to narrow results. Each group contains an array of filters that are AND-ed together. Multiple groups are OR-ed.

```json
{
  "dimensionFilterGroups": [
    {
      "filters": [
        {
          "dimension": "query",
          "operator": "contains",
          "expression": "seo tool"
        },
        {
          "dimension": "country",
          "operator": "equals",
          "expression": "usa"
        }
      ]
    }
  ]
}
```

**Available operators:**

| Operator | Description |
|----------|-------------|
| `equals` | Exact match |
| `notEquals` | Does not match |
| `contains` | Contains substring |
| `notContains` | Does not contain substring |
| `includingRegex` | Matches regex (RE2 syntax) |
| `excludingRegex` | Does not match regex |

### Response Format

```json
{
  "rows": [
    {
      "keys": ["query value", "page value"],
      "clicks": 123,
      "impressions": 4567,
      "ctr": 0.0269,
      "position": 8.3
    }
  ],
  "responseAggregationType": "byPage"
}
```

**Field details:**

- `keys`: Array of dimension values in the same order as the `dimensions` request parameter
- `clicks`: Number of clicks from Google Search
- `impressions`: Number of times the page appeared in search results
- `ctr`: Click-through rate as a decimal (0.0269 = 2.69%)
- `position`: Average ranking position (1.0 = top result)
- `responseAggregationType`: How data was aggregated

If the response contains no data for the given filters/date range, the `rows` array will be absent (not empty). Always check for its presence.

---

### Pre-Built Curl Commands

These are the 6 queries used in the SEO optimizing plugin. Each includes cross-platform date calculation for both macOS and Linux.

#### Query 1: Query + Page Performance (Last 28 Days)

```bash
START_28=$(date -v-28d +%Y-%m-%d 2>/dev/null || date -d "28 days ago" +%Y-%m-%d)
END_DATE=$(date -v-1d +%Y-%m-%d 2>/dev/null || date -d "1 day ago" +%Y-%m-%d)

curl -s -X POST \
  "https://www.googleapis.com/webmasters/v3/sites/${ENCODED_SITE_URL}/searchAnalytics/query" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "'"${START_28}"'",
    "endDate": "'"${END_DATE}"'",
    "dimensions": ["query", "page"],
    "rowLimit": 25000
  }' > gsc-query-page-28d.json

echo "Query 1 saved: $(python3 -c "import json; d=json.load(open('gsc-query-page-28d.json')); print(len(d.get('rows',[])), 'rows')" 2>/dev/null)"
```

#### Query 2: Query + Page Performance (Previous 28 Days -- Trend Comparison)

```bash
START_56=$(date -v-56d +%Y-%m-%d 2>/dev/null || date -d "56 days ago" +%Y-%m-%d)
END_29=$(date -v-29d +%Y-%m-%d 2>/dev/null || date -d "29 days ago" +%Y-%m-%d)

curl -s -X POST \
  "https://www.googleapis.com/webmasters/v3/sites/${ENCODED_SITE_URL}/searchAnalytics/query" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "'"${START_56}"'",
    "endDate": "'"${END_29}"'",
    "dimensions": ["query", "page"],
    "rowLimit": 25000
  }' > gsc-query-page-prev-28d.json

echo "Query 2 saved: $(python3 -c "import json; d=json.load(open('gsc-query-page-prev-28d.json')); print(len(d.get('rows',[])), 'rows')" 2>/dev/null)"
```

#### Query 3: Page-Level Performance (Last 28 Days)

```bash
START_28=$(date -v-28d +%Y-%m-%d 2>/dev/null || date -d "28 days ago" +%Y-%m-%d)
END_DATE=$(date -v-1d +%Y-%m-%d 2>/dev/null || date -d "1 day ago" +%Y-%m-%d)

curl -s -X POST \
  "https://www.googleapis.com/webmasters/v3/sites/${ENCODED_SITE_URL}/searchAnalytics/query" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "'"${START_28}"'",
    "endDate": "'"${END_DATE}"'",
    "dimensions": ["page"],
    "rowLimit": 25000
  }' > gsc-pages-28d.json

echo "Query 3 saved: $(python3 -c "import json; d=json.load(open('gsc-pages-28d.json')); print(len(d.get('rows',[])), 'rows')" 2>/dev/null)"
```

#### Query 4: Page-Level Performance (Last 90 Days)

```bash
START_90=$(date -v-90d +%Y-%m-%d 2>/dev/null || date -d "90 days ago" +%Y-%m-%d)
END_DATE=$(date -v-1d +%Y-%m-%d 2>/dev/null || date -d "1 day ago" +%Y-%m-%d)

curl -s -X POST \
  "https://www.googleapis.com/webmasters/v3/sites/${ENCODED_SITE_URL}/searchAnalytics/query" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "'"${START_90}"'",
    "endDate": "'"${END_DATE}"'",
    "dimensions": ["page"],
    "rowLimit": 25000
  }' > gsc-pages-90d.json

echo "Query 4 saved: $(python3 -c "import json; d=json.load(open('gsc-pages-90d.json')); print(len(d.get('rows',[])), 'rows')" 2>/dev/null)"
```

#### Query 5: Query + Page + Device Breakdown (Last 28 Days)

```bash
START_28=$(date -v-28d +%Y-%m-%d 2>/dev/null || date -d "28 days ago" +%Y-%m-%d)
END_DATE=$(date -v-1d +%Y-%m-%d 2>/dev/null || date -d "1 day ago" +%Y-%m-%d)

curl -s -X POST \
  "https://www.googleapis.com/webmasters/v3/sites/${ENCODED_SITE_URL}/searchAnalytics/query" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "'"${START_28}"'",
    "endDate": "'"${END_DATE}"'",
    "dimensions": ["query", "page", "device"],
    "rowLimit": 25000
  }' > gsc-query-page-device-28d.json

echo "Query 5 saved: $(python3 -c "import json; d=json.load(open('gsc-query-page-device-28d.json')); print(len(d.get('rows',[])), 'rows')" 2>/dev/null)"
```

#### Query 6: Query + Page + Country Breakdown (Last 28 Days)

```bash
START_28=$(date -v-28d +%Y-%m-%d 2>/dev/null || date -d "28 days ago" +%Y-%m-%d)
END_DATE=$(date -v-1d +%Y-%m-%d 2>/dev/null || date -d "1 day ago" +%Y-%m-%d)

curl -s -X POST \
  "https://www.googleapis.com/webmasters/v3/sites/${ENCODED_SITE_URL}/searchAnalytics/query" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "'"${START_28}"'",
    "endDate": "'"${END_DATE}"'",
    "dimensions": ["query", "page", "country"],
    "rowLimit": 25000
  }' > gsc-query-page-country-28d.json

echo "Query 6 saved: $(python3 -c "import json; d=json.load(open('gsc-query-page-country-28d.json')); print(len(d.get('rows',[])), 'rows')" 2>/dev/null)"
```

#### Verify All Data

```bash
echo "=== GSC Data Pull Summary ==="
for f in gsc-*.json; do
  ROWS=$(python3 -c "import json; d=json.load(open('${f}')); print(len(d.get('rows',[])))" 2>/dev/null || echo "ERROR")
  printf "%-40s %s rows\n" "${f}" "${ROWS}"
done
```

---

## URL Inspection API

Inspect how Google sees a specific URL -- indexing status, crawl info, rich results, and AMP status.

### Endpoint

```
POST https://searchconsole.googleapis.com/v1/urlInspection/index:inspect
```

### Request Body

```json
{
  "inspectionUrl": "https://example.com/page-to-inspect",
  "siteUrl": "https://example.com",
  "languageCode": "en-US"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `inspectionUrl` | string | Yes | The fully qualified URL to inspect |
| `siteUrl` | string | Yes | The site URL as registered in Search Console (URL or domain property) |
| `languageCode` | string | No | BCP-47 language code for localized results (e.g., `"en-US"`) |

### Curl Command

```bash
curl -s -X POST \
  "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "inspectionUrl": "'"${URL_TO_INSPECT}"'",
    "siteUrl": "'"${GSC_SITE_URL}"'",
    "languageCode": "en-US"
  }'
```

### Response Structure

The response contains nested objects for each inspection aspect:

```json
{
  "inspectionResult": {
    "inspectionResultLink": "https://search.google.com/search-console/inspect?...",
    "indexStatusResult": {
      "verdict": "PASS",
      "coverageState": "Submitted and indexed",
      "robotsTxtState": "ALLOWED",
      "indexingState": "INDEXING_ALLOWED",
      "lastCrawlTime": "2025-01-15T10:30:00Z",
      "pageFetchState": "SUCCESSFUL",
      "googleCanonical": "https://example.com/page",
      "userCanonical": "https://example.com/page",
      "crawledAs": "DESKTOP"
    },
    "mobileUsabilityResult": {
      "verdict": "PASS"
    },
    "richResultsResult": {
      "verdict": "PASS",
      "detectedItems": [
        {
          "richResultType": "FAQ",
          "items": [
            {
              "name": "FAQ item",
              "issues": []
            }
          ]
        }
      ]
    }
  }
}
```

**Verdict values:** `PASS`, `PARTIAL`, `FAIL`, `NEUTRAL`, `VERDICT_UNSPECIFIED`

### Rate Limits

- **2,000 requests per day** (hard limit, resets at midnight Pacific Time)
- **600 requests per minute**

Use URL Inspection sparingly. Prioritize it for pages identified as problematic in the search analytics analysis.

---

## Sitemaps API

Manage sitemaps for your Search Console property.

### List All Sitemaps

```bash
curl -s -X GET \
  "https://www.googleapis.com/webmasters/v3/sites/${ENCODED_SITE_URL}/sitemaps" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}"
```

**Response:**

```json
{
  "sitemap": [
    {
      "path": "https://example.com/sitemap.xml",
      "lastSubmitted": "2025-01-10T08:00:00.000Z",
      "isPending": false,
      "isSitemapsIndex": true,
      "lastDownloaded": "2025-01-15T12:00:00.000Z",
      "warnings": "0",
      "errors": "0",
      "contents": [
        {
          "type": "web",
          "submitted": "1500",
          "indexed": "1423"
        }
      ]
    }
  ]
}
```

### Submit a Sitemap

```bash
SITEMAP_URL="https://example.com/sitemap.xml"
ENCODED_SITEMAP=$(python3 -c "import urllib.parse; print(urllib.parse.quote('${SITEMAP_URL}', safe=''))")

curl -s -X PUT \
  "https://www.googleapis.com/webmasters/v3/sites/${ENCODED_SITE_URL}/sitemaps/${ENCODED_SITEMAP}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}"
```

Returns an empty response body on success (HTTP 200).

### Delete a Sitemap

```bash
SITEMAP_URL="https://example.com/old-sitemap.xml"
ENCODED_SITEMAP=$(python3 -c "import urllib.parse; print(urllib.parse.quote('${SITEMAP_URL}', safe=''))")

curl -s -X DELETE \
  "https://www.googleapis.com/webmasters/v3/sites/${ENCODED_SITE_URL}/sitemaps/${ENCODED_SITEMAP}" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}"
```

Returns an empty response body on success (HTTP 200).

---

## CSV Fallback

If the API is not available (no service account, quota exhausted, etc.), you can export data manually from the Google Search Console web UI.

### Step-by-Step Export

1. Go to [Google Search Console](https://search.google.com/search-console) and select your property
2. Click **Performance** > **Search results** in the left sidebar
3. Set the desired date range using the date filter at the top (e.g., "Last 28 days")
4. Apply any additional filters (country, device, search type) as needed
5. Click the **Export** button (download icon) at the top right of the performance chart
6. Select **Download CSV**

The CSV export contains multiple tabs/files in a zip archive:

| Tab/File | Contains | Columns |
|----------|----------|---------|
| **Queries** | Search queries that triggered your site | Query, Clicks, Impressions, CTR, Position |
| **Pages** | URLs that appeared in search results | Page, Clicks, Impressions, CTR, Position |
| **Countries** | Performance broken down by country | Country, Clicks, Impressions, CTR, Position |
| **Devices** | Performance broken down by device type | Device, Clicks, Impressions, CTR, Position |
| **Search Appearance** | Results by rich result type | Search Appearance, Clicks, Impressions, CTR, Position |
| **Dates** | Daily performance data | Date, Clicks, Impressions, CTR, Position |

**CSV limitations:**
- Maximum 1,000 rows per tab
- No cross-dimension data (e.g., query + page combinations)
- CTR is displayed as a percentage string (e.g., "2.69%") not a decimal

### Convert CSV to JSON

Convert the exported CSV to the same JSON format as the API response:

```bash
python3 -c "
import csv, json, sys

def parse_ctr(val):
    \"\"\"Convert '2.69%' or 0.0269 to decimal float.\"\"\"
    if isinstance(val, str) and val.endswith('%'):
        return float(val.strip('%')) / 100
    return float(val)

input_file = sys.argv[1]
dimension_name = sys.argv[2]  # 'query', 'page', 'country', 'device', or 'date'

rows = []
with open(input_file, 'r', encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    for record in reader:
        cols = list(record.keys())
        key_col = cols[0]  # First column is always the dimension
        rows.append({
            'keys': [record[key_col]],
            'clicks': int(float(record.get('Clicks', 0))),
            'impressions': int(float(record.get('Impressions', 0))),
            'ctr': parse_ctr(record.get('CTR', '0%')),
            'position': round(float(record.get('Position', 0)), 1)
        })

output = {'rows': rows, 'responseAggregationType': 'auto'}
output_file = input_file.rsplit('.', 1)[0] + '.json'
with open(output_file, 'w') as f:
    json.dump(output, f, indent=2)
print(f'Converted {len(rows)} rows -> {output_file}')
" "Queries.csv" "query"
```

Usage for each export tab:

```bash
# Convert each CSV tab
python3 csv_to_json.py "Queries.csv" "query"
python3 csv_to_json.py "Pages.csv" "page"
python3 csv_to_json.py "Countries.csv" "country"
python3 csv_to_json.py "Devices.csv" "device"
python3 csv_to_json.py "Dates.csv" "date"
```

---

## Rate Limits

| API | Quota | Per | Notes |
|-----|-------|-----|-------|
| Search Analytics | 1,200 requests | per minute | Applies to `searchAnalytics/query` calls |
| Search Analytics | 25,000 rows | per request | Use `startRow` for pagination beyond this |
| URL Inspection | 2,000 requests | per day | Resets at midnight Pacific Time |
| URL Inspection | 600 requests | per minute | Burst limit within the daily cap |
| Sitemaps | 600 requests | per minute | List, submit, and delete combined |

**Pagination for large sites:**

If you have more than 25,000 query+page combinations, paginate using `startRow`:

```bash
# Page 1: rows 0-24999
curl -s -X POST \
  "https://www.googleapis.com/webmasters/v3/sites/${ENCODED_SITE_URL}/searchAnalytics/query" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "'"${START_28}"'",
    "endDate": "'"${END_DATE}"'",
    "dimensions": ["query", "page"],
    "rowLimit": 25000,
    "startRow": 0
  }' > gsc-query-page-28d-p1.json

# Page 2: rows 25000-49999
curl -s -X POST \
  "https://www.googleapis.com/webmasters/v3/sites/${ENCODED_SITE_URL}/searchAnalytics/query" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "'"${START_28}"'",
    "endDate": "'"${END_DATE}"'",
    "dimensions": ["query", "page"],
    "rowLimit": 25000,
    "startRow": 25000
  }' > gsc-query-page-28d-p2.json

# Merge pages
python3 -c "
import json
p1 = json.load(open('gsc-query-page-28d-p1.json'))
p2 = json.load(open('gsc-query-page-28d-p2.json'))
p1['rows'] = p1.get('rows', []) + p2.get('rows', [])
json.dump(p1, open('gsc-query-page-28d.json', 'w'), indent=2)
print(f'Merged: {len(p1[\"rows\"])} total rows')
"
```

---

## .env File Format

### Complete .env Template

```bash
# === Google Search Console Configuration ===

# Path to the service account JSON key file (absolute path recommended)
GSC_SERVICE_ACCOUNT_JSON=/path/to/service-account-key.json

# Site URL as registered in Google Search Console
# Use one of the following formats:
#   URL property:    https://example.com
#   Domain property: sc-domain:example.com
GSC_SITE_URL=https://example.com
```

### URL Encoding for Site URLs

The GSC API requires the site URL to be URL-encoded in the endpoint path. The authentication script handles this automatically via `ENCODED_SITE_URL`, but here is how different property types encode:

| Property Type | Raw Value | URL-Encoded Value |
|--------------|-----------|-------------------|
| URL (https) | `https://example.com` | `https%3A%2F%2Fexample.com` |
| URL (http) | `http://example.com` | `http%3A%2F%2Fexample.com` |
| URL with path | `https://example.com/blog/` | `https%3A%2F%2Fexample.com%2Fblog%2F` |
| Domain property | `sc-domain:example.com` | `sc-domain%3Aexample.com` |

The encoding is handled by the authentication script's `ENCODED_SITE_URL` variable:

```bash
ENCODED_SITE_URL=$(python3 -c "import urllib.parse; print(urllib.parse.quote('${GSC_SITE_URL}', safe=''))")
```

**Important:** Domain properties (`sc-domain:`) aggregate data across all subdomains and protocols (http, https, www, non-www). URL properties only include data for that exact URL prefix. If you have a domain property, always use the `sc-domain:` format to get the most complete data.
