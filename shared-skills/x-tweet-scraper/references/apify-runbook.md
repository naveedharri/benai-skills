# Apify Runbook

Use this sequence for every Xquik Actor call.

## 1. Inspect

Call `call-actor` with:

- `actor: "xquik/x-tweet-scraper"`
- `step: "info"`

Check the current input schema.
Check the live pricing shown by Apify.
Do not start a run during inspection.

## 2. Get Approval

Show the exact input and `maxItems`.
Use the five choices in `SKILL.md`.
Wait for an explicit selection.
Do not treat earlier general consent as run approval.

## 3. Start

Call `call-actor` with:

- `actor: "xquik/x-tweet-scraper"`
- `step: "call"`
- the approved input

Never place an Apify token in a URL, file, or log.
Use the configured Apify connector for authentication.

## 4. Track

Capture `runId` and `datasetId` from the response.
The MCP call may time out while the Actor continues.
Poll that exact run with `get-actor-run`.

Terminal statuses are:

- `SUCCEEDED`
- `FAILED`
- `ABORTED`
- `TIMED-OUT`

Do not fetch results from a failed run.
Do not start a replacement run without new approval.

## 5. Fetch and Persist

Fetch the default dataset after success.
Sample several items before transforming fields.
Read any tool-saved overflow file instead of fetching again.
Save the raw response immediately.

Partition rows by `resultType`.
Keep posts, diagnostics, and run reports separate.
Deduplicate post rows by post ID.

## 6. Report

Report:

- approved cap
- returned post count
- diagnostic status and message
- run-report status
- dataset path
- any partial or terminal failure

Never infer success from an empty dataset.
Use diagnostic and run-report rows to explain it.
