---
name: rent-my-gpu
description: Rents one single-tenant GPU pod on RunPod in a region the user picks, serves an open model on vLLM bound to loopback, puts Open WebUI in front of it and proves a real reply, so the user gets a private chat URL for a model their own machine cannot run. Use when the user says "rent a GPU", "run a big model in the cloud", "my machine cannot run this model", "deploy an open model", "host Qwen or DeepSeek or GLM myself", "put Open WebUI online", "give my team a private ChatGPT", "private AI for my business", "GDPR compliant LLM hosting", "RunPod", or "cloud GPU". The inference endpoint is not reachable from any network; the only exposed port is the chat login. Needs a RunPod API key. Asks four questions, never picks a region itself, states what compliance covers, and always shows hourly and monthly cost before spending anything. Requires Claude Code with shell and internet access; refuses to run in a sandbox.
---

# Rent My GPU

The cloud counterpart to `scan-my-machine`. That skill tells someone what their laptop can run. This one rents what it cannot, and hands back a URL they can chat in.

The user gives one credential and answers four questions. Everything after that is yours: provision, serve, wire, verify, report. They should not have to open a dashboard, paste a URL, or copy an endpoint ID.

Two things are never automatic. The **spend**, in `references/cost-gate.md`. And the **region**, which the user chooses and you never default.

## Before you start

Run the check in `references/environment-check.md`. It is deliberately short: **nothing here runs on the user's machine**, so do not scan their hardware and do not report on it. The check asks only whether the shell will outlive the session, whether RunPod is reachable, and whether Node is present.

If a local model would do the job, they should be in `local-ai-setup` instead. Say that in one line and move on.

## What this skill builds

One Secure Cloud pod, in a region the user chooses, running both services:

```
┌─ RunPod Secure Cloud Pod, chosen region ──────────┐
│   vLLM        127.0.0.1:8000    loopback only     │
│                    ↑ localhost                    │
│   Open WebUI  0.0.0.0:8080      exposed via HTTPS │
│   Network volume, same region                     │
└──────────────────────┬────────────────────────────┘
                       │ HTTPS, port 8080 only
                    users
```

**The inference endpoint never touches a network.** Not the public internet, not RunPod's private network. vLLM binds to loopback and Open WebUI reaches it over `localhost`, so there is no URL to leak, no port to forget to authenticate, no API key to get wrong. One door, and Open WebUI's own login is the lock.

There is deliberately no serverless variant and no second host for the interface. One provider, one region, one volume, one teardown. Open WebUI is a FastAPI app that owns a disk at `/app/backend/data`, so it needs persistent storage and a process that stays up. It gets both from the pod, beside the model. If the user asks for it on Vercel, say in one sentence that Vercel functions are ephemeral and cannot hold that disk.

## Say this once, then continue

Before asking anything, state it plainly and **do not turn it into a question**:

> RunPod is Runpod Inc., a US company. That is fine for saying **where** your data is processed, and they do that well: six EU regions, a signable DPA, SOC 2 Type 2. It cannot satisfy a requirement that names the **CLOUD Act, SecNumCloud, BSI C5, or EU ownership**, because no configuration changes who owns the company. If your requirement names one of those, stop me now and I will point you at OVHcloud, Scaleway, Outscale or Cloud Temple instead.

That is informed consent in one paragraph. A blocking question here is friction for the ninety percent who just need residency. Read `trust-boundary.md` section 1 if the user picks it up.

## Steps

Track progress:

```
Task Progress:
- [ ] 1. Environment check and the jurisdiction statement
- [ ] 2. Get the RunPod API key
- [ ] 3. Install the RunPod skills
- [ ] 4. Ask the four questions
- [ ] 5. Run the cost and residency gate, get a yes
- [ ] 6. Build the pod
- [ ] 7. Confirm the trust boundary
- [ ] 8. Prove it with a real reply
- [ ] 9. Render the handover report
```

### 1. Environment check and the jurisdiction statement
Run `references/environment-check.md`. On pass, say one line about the providers and nothing about their machine. Then give the jurisdiction statement above.

### 2. Get the RunPod API key
From the RunPod console under Settings, API Keys.

Set it in the session environment only. **Never write it to a file, never echo it, never put it in the report.** To show it is set, show the last four characters. `references/deploy-steps.md` section 1 has the rules.

If the key ever appears in a screenshot, a shared terminal, or a pasted log, **tell the user to rotate it immediately**. A leaked RunPod key is someone else spending their money on GPUs.

### 3. Install the RunPod skills
Do not reimplement RunPod's API. They ship official agent skills, better maintained than anything written here.

```bash
npx skills add runpod/runpod-plugins-official
```

That gives a router plus `runpod-mcp`, `runpodctl`, `flash`, `companion-clis` and `runpod-usage`, all authenticating on `RUNPOD_API_KEY`. Prefer `runpod-mcp` for plain infrastructure CRUD when its tools are connected, and `runpodctl` for the terminal, SSH setup and file transfer.

Install only what is missing, then confirm auth before provisioning: a key that fails at step 6 wastes a GPU that is already billing.

**Verify subcommands with `--help` before running them**, including the ones in this skill's references. The CLI moves.

### 4. Ask the four questions
One `AskUserQuestion`, not four rounds. Full option text in `references/model-picker.md` section 1.

1. **Where should it run.** **Ask this. Never pick a region for the user.** The right answer depends on a customer contract you cannot see. Say that pinning a region shrinks the available GPU pool.
2. **How good does the model need to be.** **Build these options live** from `references/model-sources.md`: Hugging Face for what exists and its real footprint, Artificial Analysis for the ranking, vLLM recipes for whether it can actually be served, and `runpodctl` for whether that GPU is rentable in their region today. Drop any option that fails availability rather than offering it and failing at provision. Fall back to the static matrix only when discovery is unavailable, and say which you used.
3. **Who will use it.** Sets the signup policy and whether SQLite or Postgres.
4. **How much history it holds.** Sets the network volume, which must also fit the model weights.

If the user already said any of this earlier, pass it through instead of re-asking.

**When they pick the region, show the coverage line** from `trust-boundary.md` section 5: SOC 2 Type 2, GDPR for EU regions, a signable DPA on Standard Contractual Clauses, an Article 27 EU representative, data subject rights, 72-hour breach notification, deletion on request. Every line is verified.

Show it here and once more in the gate. **Nowhere else.** Repeating caveats at every step trains the user to skip them, which is how the one that matters gets missed.

### 5. Run the cost and residency gate, get a yes
Go to `references/cost-gate.md` and run it in full. It runs four residency refusals first, then computes the hourly rate, the monthly projection and the teardown commands, then stops.

It refuses a defaulted region, Community Cloud, and a volume in a different region than the pod. That last one slips through most often: the GPU holds a prompt for milliseconds, the volume holds every conversation forever.

State the honest contractual limit in the same message. RunPod's DPA commits to **reasonable efforts** to allocate a **geographically proximate** server. It does not guarantee residency. Read `trust-boundary.md` section 3 and do not soften it.

One consolidated gate, and it is before the first dollar.

### 6. Build the pod
Follow `references/deploy-steps.md` section 2.

The critical flag is **`--host 127.0.0.1`** on vLLM. That single flag is what makes this build private. Expose **8080 only**. Never 8000.

Print the teardown command as soon as each resource exists, before moving on.

### 7. Confirm the trust boundary
Do not skip this. Run the two checks in `deploy-steps.md` section 2d: the endpoint must answer on `127.0.0.1:8000` from inside the pod, and **must fail** from outside on the proxy URL.

If the outside call returns anything at all, port 8000 was exposed and the build is wrong. Fix it before writing the report. Never write "not reachable" into the data flow table without having run this.

### 8. Prove it with a real reply
Send one real prompt through the whole chain and show the reply. Do not report success on an HTTP 200, and do not report success on the model list endpoint alone: both can pass while generation fails.

If anything fails, go to `references/troubleshooting.md` before improvising.

### 9. Render the handover report
Deliver the result as a rendered HTML page, not chat text. Build it from `references/report-template.md`. It carries the chat URL, the real prompt and reply, the running cost, the teardown commands and the admin account instructions.

It also carries the **ten-row data flow table** and the **reviewer paragraph** from `references/trust-boundary.md` sections 4 and 6, with the user's real region in every cell. Row 9, control-plane metadata, stays "unconfirmed" until RunPod answers in writing. **Never fill a cell with an assumption**; "unconfirmed" is a legitimate value a reviewer respects, and an invented one destroys the document the first time it is checked.

Keep the chat summary to three lines and the file path. The page carries the detail.

## Teardown

Treat `/rent-my-gpu teardown` as a first class entry point. Follow `references/teardown.md`. It lists every billing resource in the order that stops the money soonest, and verifies each is gone rather than trusting the delete call.

Money keeps running until teardown. That makes it part of the skill, not an afterthought.

## Human checkpoints
- **Before provisioning anything** (step 5): the cost and residency gate, with hourly and monthly figures. Wait for an explicit yes.
- **Before deleting anything** in teardown: list what will be destroyed and what data dies with it, then wait.

Never delete a RunPod resource the user did not ask you to remove, even if it looks orphaned.

## Self-improvement

If a CLI flag in `references/` turns out to be wrong, fix the reference file in the same session and say you did. RunPod ships fast and these files will drift.
