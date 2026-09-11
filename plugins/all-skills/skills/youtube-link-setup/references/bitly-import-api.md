# Step 2: Import the six links into Bitly

There is no Bitly MCP connector on this account, so this runs one of two ways. Prefer the API
if a token exists; it is deterministic and needs no browser.

## Path A (preferred): Bitly API

Needs a Bitly API token in the environment as `BITLY_TOKEN`. If it is absent, say so once and
use Path B rather than asking repeatedly. Never echo the token back into the conversation.

Account: `ben@benai.co`, group **Bp46bK7ywPJ**, short domain **c.benai.co**. Confirm with
`GET /v4/user` before writing anything.

Verify an existing set instead of creating duplicates:

```bash
curl -s -H "Authorization: Bearer $BITLY_TOKEN" \
  "https://api-ssl.bitly.com/v4/groups/Bp46bK7ywPJ/bitlinks?size=60" | python3 -c "
import sys,json; d=json.load(sys.stdin)
rows=[l for l in d['links'] if '<code>' in l['id']]
print(len(rows),'links')
for l in sorted(rows,key=lambda x:x['id']): print(' ',l['id'],'->',l['long_url'].split('?')[0])
"
```

If six already exist for this code, the import has run. Do not re-import.

Check the backhalf is free before creating anything:

```bash
curl -s -o /dev/null -w "%{http_code}\n" "https://c.benai.co/<code>-accelerator"
# 404 means free. 200 or 301 means it already exists: stop and report.
```

Create each link from the CSV rows:

```bash
python3 - <<'PY'
import csv, json, os, urllib.request
tok = os.environ["BITLY_TOKEN"]
GROUP = "Bp46bK7ywPJ"   # Ben AI, org Op46bacFheX, domain c.benai.co. Verified 2026-08-20.
rows = list(csv.DictReader(open("<slug>_bitly.csv")))
for r in rows:
    body = json.dumps({
        "long_url": r["Long URL"],
        "domain": "c.benai.co",
        "custom_bitlinks": [f"c.benai.co/{r['Backhalf']}"],
        "title": r["Title"],
        "tags": ["youtube"],
        "group_guid": GROUP,
    }).encode()
    req = urllib.request.Request("https://api-ssl.bitly.com/v4/bitlinks", body,
        {"Authorization": f"Bearer {tok}", "Content-Type": "application/json"})
    try:
        print(r["Backhalf"], "ok", json.load(urllib.request.urlopen(req))["link"])
    except urllib.error.HTTPError as e:
        print(r["Backhalf"], "FAILED", e.code, e.read().decode()[:200])
PY
```

Report every line. A partial import is the dangerous outcome: the description would ship with
some links live and some dead.

## Path B: the bulk upload page via Claude in Chrome

Load the browser tools in one call (see `references/link-verification.md` for the select string),
then:

1. `navigate` to `https://app.bitly.com/<group>/links/bulkupload`. The group segment is in the
   URL when the user is on their Links page; `read_page` the Links page to get it.
2. Confirm "Select short link domain" reads **c.benai.co**. This is the default but check it,
   because a link created on `bit.ly` cannot be moved.
3. `read_page` to get the ref of the upload `input[type=file]`. Do not click "Browse files" or
   the drop zone: a native picker blocks every later tool call.
4. `file_upload` with the CSV path from `benai-utm-creator`.
5. Confirm the filename appears next to a "Remove" button, then click **Submit file**.
6. Bitly emails when the batch is ready and the links appear on the Links page. Do not treat the
   submit click as proof. Verify in step 5 of the skill.

Skip Bitly's "Download template" button entirely. The CSV is already in the right layout.

## Quota

The bulk import page states the remaining monthly link and redirect allowance ("You have N links
and M redirects remaining this month"). Read it before submitting and report it. Six links go per
video, so a low number is worth flagging.
