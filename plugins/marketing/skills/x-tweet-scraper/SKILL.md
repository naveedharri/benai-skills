---
name: x-tweet-scraper
description: Scrapes public X posts through the Xquik Apify Actor. Use for searches, timelines, URLs, IDs, lists, articles, replies, quotes, and threads. Also supports retweeters and best-effort favoriters.
disable-model-invocation: true
---

# X Tweet Scraper

Collect public X posts through one Xquik Apify Actor.
Keep each run bounded, approved, and easy to verify.

## Steps

Track progress:

```
Task Progress:
- [ ] 1. Scope the collection
- [ ] 2. Inspect and approve the run
- [ ] 3. Run the Actor
- [ ] 4. Validate and save results
```

### 1. Scope the collection

Collect the route, targets, result cap, and required output depth.
Read `references/actor-contract.md` for supported inputs and output controls.
Preserve advanced X search operators exactly as the user provided them.

### 2. Inspect and approve the run

Call Apify `call-actor` with `step: "info"` for `xquik/x-tweet-scraper`.
Confirm the live schema and current pricing before proposing a run.
Do not start the Actor during this step.

Present these choices and wait:

1. Inspect the schema only. Start no run.
2. Run a 10-result smoke test.
3. Run a bounded 100-result collection.
4. Use a custom result cap.
5. Cancel.

Explain that Apify platform usage may apply separately.
Never quote a stored or remembered price.

### 3. Run the Actor

Read `references/apify-runbook.md`.
Start only the option the user approved.
Set `maxItems` to the approved run-wide cap.
Do not raise the cap or retry a paid run without new approval.

### 4. Validate and save results

Wait for a terminal run status.
Fetch the default dataset after `SUCCEEDED`.
Separate post rows from diagnostics and run reports.
Save the raw dataset before transforming it.
Report the requested count, returned count, and any stop reason.

## Human Checkpoint

The approval in step 2 is mandatory.
Schema inspection is not approval to spend.
Any paid retry needs a new choice from the same five options.

## Self-improvement

This skill is never finished. Improve it as you use it.

- When the user corrects a step, update the relevant reference file.
- Add hard corrections as permanent rules here.
- Save genuinely good outputs under `references/examples/`.
- Run the deletion test after every addition.

## Routing

| Step | Reference |
|------|-----------|
| Scope | `references/actor-contract.md` |
| Run and recover | `references/apify-runbook.md` |
