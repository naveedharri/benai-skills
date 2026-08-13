---
name: x-follower-scraper
description: Exports public X audiences through the Xquik Apify Actor. Use for followers, following, verified followers, lists, communities, filters, deduplication, and overlap.
disable-model-invocation: true
---

# X Follower Scraper

Export public X audiences through one Xquik Apify Actor.
Keep source attribution across every target and relation.

## Steps

Track progress:

```
Task Progress:
- [ ] 1. Scope targets and relations
- [ ] 2. Inspect and approve the run
- [ ] 3. Run the Actor
- [ ] 4. Validate and save results
```

### 1. Scope targets and relations

Collect the targets, relations, filters, dedupe mode, and result cap.
Read `references/actor-contract.md` for compatible combinations.
Use merge dedupe when the user wants audience overlap.

### 2. Inspect and approve the run

Call Apify `call-actor` with `step: "info"` for `xquik/x-follower-scraper`.
Confirm the live schema and current pricing before proposing a run.
Do not start the Actor during this step.

Present these choices and wait:

1. Inspect the schema only. Start no run.
2. Run a 10-profile smoke test.
3. Run a bounded 100-profile export.
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
Separate profile rows from diagnostics and run reports.
Save the raw dataset before transforming it.
Report target attribution, overlap, counts, and any stop reason.

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
