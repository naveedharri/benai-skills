# Apify Actor Operations

Cross-step mechanics for every Apify actor call in this pipeline. Follow this file for ALL three actors.

## Apify Actor IDs

| Actor | Name | Purpose |
|---|---|---|
| Post scraper | `harvestapi/linkedin-profile-posts` | Scrape posts with reactions + comments |
| Profile scraper | `dev_fusion/Linkedin-Profile-Scraper` | Full LinkedIn profile data |
| Company scraper | `dev_fusion/Linkedin-Company-Scraper` | Company page data incl. website |

## CRITICAL: Always Get Input Schema First

Before running ANY Apify actor in this pipeline, always call `call-actor` with `step: "info"` first to get the current input schema. Actor schemas can change, never hardcode field names without checking.

### Mandatory Two-Step Actor Workflow

1. **Get actor info**: Call `call-actor` with `step: "info"` and the actor name to get the input schema
2. **Execute the actor**: Call `call-actor` with `step: "call"` using the proper input

## CRITICAL: Timeout Handling (Applies to ALL Actor Calls)

Apify actor calls will timeout after ~30 seconds via MCP. This is normal and expected. The actor continues running server-side. You MUST follow this pattern for EVERY actor call in this pipeline:

1. Call the actor (it will timeout, this is fine, the run was created)
2. **Sleep 60 seconds** using `sleep 60` via Bash (this is critical, don't skip it)
3. Call `get-actor-run-list` with `desc: true, limit: 3` to find the most recent run ID and dataset ID
4. Call `get-actor-run` with the run ID to check if status is "SUCCEEDED"
5. If still "RUNNING", sleep another 30-60 seconds and check again
6. Once SUCCEEDED, proceed to download the dataset

## CRITICAL: Always Sample Dataset Before Full Download

Before downloading the full dataset, always fetch 2-3 items first to analyze the actual output structure:

```
get-dataset-items with datasetId, limit: 3
```

Inspect the fields, their names, their nesting. The output structure may differ from what you expect. Only after confirming the field names and structure should you download the full dataset.

## Download Full Dataset via curl

For large datasets, use curl to download to a local file instead of the MCP tool (which has token limits):

```bash
curl -s "https://api.apify.com/v2/datasets/{DATASET_ID}/items" -o dataset.json
```

Then process with Python.

## Actor Call Pattern (Use for EVERY Actor Call)

```
1. call-actor step: "info" → get input schema
2. call-actor step: "call" → execute (will timeout at ~30s, this is normal)
3. sleep 60 via Bash
4. get-actor-run-list desc: true, limit: 3 → find run ID + dataset ID
5. get-actor-run with run ID → check status
6. If RUNNING: sleep 30-60, repeat step 5
7. Once SUCCEEDED: get-dataset-items with limit: 3 → sample output structure
8. curl full dataset to local file → process with Python
```

Never skip steps 1 (input schema) or 7 (sampling output). Actor schemas and output formats can change.

## URL Normalization

When matching across datasets, always normalize LinkedIn URLs:

```python
import re

def normalize_url(url):
    url = url.lower().strip().rstrip('/')
    url = re.sub(r'^https?://', '', url)
    url = re.sub(r'^(www\.|[a-z]{2}\.)', '', url)
    return url
```
