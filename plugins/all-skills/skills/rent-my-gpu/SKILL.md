---
name: rent-my-gpu
description: Runs an open model in the cloud two ways, and makes the user choose with real numbers. Route A is OVHcloud AI Endpoints, an EU-owned per-token API with zero idle cost, for spiky usage and EU jurisdiction. Route B rents one single-tenant RunPod GPU pod in a region the user picks, serving the model on vLLM behind a generated API key, with Open WebUI behind its own login and a URL Claude Code can use directly, for sustained use, unlisted models, or single tenancy. Use when the user says "rent a GPU", "run a big model in the cloud", "my machine cannot run this model", "deploy an open model", "host Qwen or DeepSeek or GLM myself", "put Open WebUI online", "give my team a private ChatGPT", "private AI for my business", "GDPR compliant LLM hosting", "data must stay in the EU", "EU AI API", "pay per token", "OVHcloud", "AI Endpoints", "RunPod", or "cloud GPU". Asks which build fits, never picks a region, and always shows cost before spending. Requires shell and internet access; refuses to run in a sandbox.
---

# Rent My GPU

The cloud counterpart to `scan-my-machine`. That skill tells someone what their laptop can run. This one runs what it cannot, and it carries two builds because "run a big model in the cloud" has two honest answers depending on usage shape and what "private" means:

- **Route A, the EU endpoint.** OVHcloud AI Endpoints: a per-token OpenAI-compatible API run by a French company in Gravelines, France. Cents per million tokens, zero idle cost solo. Two shapes: solo, where each user's own app points at the endpoint, and team, where one shared Open WebUI runs on a small OVH VPS for about €5 a month. Multi-tenant either way.
- **Route B, the private pod.** One RunPod Secure Cloud pod in a region the user picks, two locked doors: Open WebUI behind its login for the team, vLLM's API behind a generated key for Claude Code and other apps. Single-tenant, any model with a vLLM recipe, one shared URL for a team. Bills every hour it exists, used or not.

The order is: questions first, then two named recommendations with prices computed from the answers, then the user picks a provider and everything after is yours: token, wire, prove, report. Beyond creating their own credential they should not have to open a dashboard, paste a URL, or copy an endpoint ID.

Two things are never automatic. The **spend**, in `references/cost-gate.md`. And on Route B the **region**, which the user chooses and you never default.

## 1. Before you start

Run the check in `references/environment-check.md`. It is deliberately short: **nothing here runs on the user's machine**, so do not scan their hardware and do not report on it.

If a local model would do the job, they should be in `local-ai-setup` instead. Say that in one line and move on.

## 2. The questions

One `AskUserQuestion`, three questions, no provider named yet. Full option text in `references/model-picker.md` section 0.

1. **What should the model be best at.** Show the categories from the open-model leaderboard at **https://onyx.app/open-llm-leaderboard** — overall, coding, math, chat, reasoning — plus a "name a specific model" option. **The recommended default is Qwen3.6-27B**: A-tier overall at only 27B, cheap on both providers. Verify whatever they pick live: the OVH catalog (`ovh-endpoints.md` section 2) for Route A, `model-sources.md` for Route B.
2. **Who will use it.** Solo, or a team on one shared URL.
3. **Usage rhythm.** Spiky and on-and-off, or heavy and sustained. This decides the whole cost story, which is why it is asked before any price is shown.

If the user already said any of this, pass it through instead of re-asking. Region and storage are **not** asked here; they only exist for one route and come after the pick.

## 3. The recommendation

Read live prices from both providers first: the OVH catalog price for the chosen model or nearest fit, and the RunPod Secure rate for the GPU that model needs. Then show **two named options side by side**, with links so the user can explore the companies, costs computed from their three answers, and the trust inversion stated plainly:

> **OVHcloud AI Endpoints** — https://www.ovhcloud.com/en/public-cloud/ai-endpoints/ · model catalog: https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog/. French company, runs in Gravelines, France. Pay per token: for your usage, roughly $<X> a month<, plus about €5 a month for the shared team interface>. OVH states data is not stored. Multi-tenant.
>
> **RunPod** — https://runpod.io. US company, single-tenant GPU in a region you pick, every door locked with its own key, including an API URL Claude Code can use directly. $<Y> per hour, about $<Z> a month always on, billing whether anyone chats or not.
>
> Neither is simply more private. OVH is EU-owned but shared; RunPod is single-tenant but US-owned, and the CLOUD Act follows the company, not the datacenter.

Every number real and read today: the two options differ by two orders of magnitude and the user cannot choose without seeing that. Wait for the pick, and do not relitigate it afterwards.

Three exits at this step:

- **The model is not in the OVH catalog** (DeepSeek, GLM class): say so in one line; the recommendation collapses to RunPod alone.
- **Their words already picked**: "pay per use" is Route A; a single-tenancy requirement is Route B. Skip the menu.
- **The double requirement**, EU ownership and single tenancy at once: neither option qualifies. Name Hetzner, Verda or Scaleway and stop rather than fudge.

## 4. The token

Guide them to the credential for the provider they picked, and only that one. **Give the exact URL as a clickable link, never just the click path.** Both verified 6 August 2026:

- **OVH**: https://www.ovh.com/manager/ (redirects to their regional manager) → Public Cloud → AI & Machine Learning → AI Endpoints → API keys. The keyless trial at 2 requests/min can prove the route before they create anything; raw curl only, since Open WebUI cannot use it. `ovh-endpoints.md` section 3.
- **RunPod**: https://console.runpod.io/user/settings → API Keys, needs read/write since it creates a pod. `deploy-steps.md` section 1.

**Never show the user shell commands or `export` lines. These are non-technical people.** Say: "paste the key here and I will handle the rest." You hold the key from there and put it into each command that needs it yourself.

Same rules either way: never written to a file, never in the report. Echoing it is fine, and usually necessary: shell state does not persist between commands, so the key has to stay readable in order to be reused in the ones that follow. It therefore sits in the transcript, so if that transcript, a screenshot or a pasted log is ever shared, tell the user to rotate the key.

**If the key is no longer in context, ask the user to paste it again.** A long provisioning run can be summarised, and the key goes with it. One short re-ask costs a moment. Reconstructing it from memory costs a run: a wrong key fails every call, and 401s partway through a deploy read as a broken pod rather than a bad credential. Never continue on a guess.

Then continue with the picked route below.

## Route A: the EU endpoint

The runbook is `references/ovh-endpoints.md`. The model and prices are already settled from steps 2 and 3; the token from step 4. Track progress:

```
Task Progress:
- [ ] A1. Cost and residency statement
- [ ] A2. Prove it with a real reply
- [ ] A3. Wire the interface
- [ ] A4. Render the report
```

### A1. Cost and residency statement
Run the Route A gate in `cost-gate.md` section 0: today's per-token prices for the chosen model, one monthly anchor at their stated rhythm, and the idle line, zero solo or ~€5/mo with the team VPS. It is a statement, not a blocking confirmation, except the team shape, which confirms before the user orders the VPS.

### A2. Prove it with a real reply
`ovh-endpoints.md` section 4. Set `max_tokens` generously; the gpt-oss models spend budget on reasoning before answering, and an empty reply with `finish_reason: length` is a budget problem, not an outage. Capture the real prompt and reply verbatim.

### A3. Wire the interface
Solo: point the app the user already has at the endpoint, table in `ovh-endpoints.md` section 5. Team: one shared Open WebUI on a small OVH VPS, runbook in `ovh-team-interface.md`; the user creates the VPS in the Manager, you do everything after. The team shape needs the real API key, because Open WebUI cannot use the anonymous tier.

### A4. Render the report
Build it from `report-template.md`, Route A layout. It carries the endpoint, the model with today's prices, the real prompt and reply, the wiring per app, the rate-limit table, and the Route A trust section from `trust-boundary.md` section 7. No teardown card solo; the team shape gets a real one for the VPS.

## Route B: the private pod

What it builds:

```
┌─ RunPod Secure Cloud Pod, chosen region ──────────┐
│   vLLM        0.0.0.0:8000    exposed, Bearer key │
│                    ↑ localhost                    │
│   Open WebUI  0.0.0.0:8080    exposed, own login  │
│   Network volume, same region                     │
└──────────┬───────────────────────┬────────────────┘
    HTTPS 8080, login       HTTPS 8000, API key
   people in a browser     Claude Code and apps
```

**Two doors, both locked.** The chat sits behind Open WebUI's own login with signup off. The inference API sits behind a key generated on the pod, and that second door is the point: it gives the user a real URL that Claude Code and any OpenAI-dialect app can use directly, with a paste-and-run block in the report. Nothing on the pod answers an unauthenticated request, and the no-key probe proving that is a mandatory step, not a suggestion.

There is deliberately no serverless variant and no second host for the interface. One provider, one region, one volume, one teardown. Open WebUI is a FastAPI app that owns a disk at `/app/backend/data`, so it needs persistent storage and a process that stays up. It gets both from the pod, beside the model. If the user asks for it on Vercel, say in one sentence that Vercel functions are ephemeral and cannot hold that disk. If the user asks for pay-per-use, that is Route A, not RunPod Serverless; the ephemeral fleet and control-plane hop make Serverless's data flow paragraph unwriteable.

A pod bills from creation until teardown, whether or not anyone is chatting. Say that at the gate, because it is the single most common surprise.

The model, users and rhythm are settled from step 2; the key from step 4. If the user skipped straight to Route B without seeing the recommendation, state the jurisdiction once, as a statement, not a question:

> RunPod is Runpod Inc., a US company. That is fine for saying **where** your data is processed, and they do that well: six EU regions, a signable DPA, SOC 2 Type 2. It cannot satisfy a requirement that names the **CLOUD Act, SecNumCloud, BSI C5, or EU ownership**, because no configuration changes who owns the company. If your requirement names one of those, Route A's processor is French, and for EU-owned single tenancy I will point you at Hetzner, Verda or Scaleway instead.

Track progress:

```
Task Progress:
- [ ] B1. Install the RunPod skills
- [ ] B2. Ask the two remaining questions: region and storage
- [ ] B3. Run the cost and residency gate, get a yes
- [ ] B4. Build the pod
- [ ] B5. Confirm the trust boundary
- [ ] B6. Prove it with a real reply
- [ ] B7. Render the handover report
```

### B1. Install the RunPod skills
Do not reimplement RunPod's API. They ship official agent skills, better maintained than anything written here.

```bash
npx skills add runpod/runpod-plugins-official
```

That gives a router plus `runpod-mcp`, `runpodctl`, `flash`, `companion-clis` and `runpod-usage`, all authenticating on `RUNPOD_API_KEY`. Prefer `runpod-mcp` for plain infrastructure CRUD when its tools are connected, and `runpodctl` for the terminal, SSH setup and file transfer.

Install only what is missing, then confirm auth before provisioning: a key that fails at the build wastes a GPU that is already billing.

**Verify subcommands with `--help` before running them**, including the ones in this skill's references. The CLI moves.

### B2. Ask the two remaining questions
One `AskUserQuestion`. Full option text in `references/model-picker.md` section 1. Model, users and rhythm came from step 2; only the pod-specific answers are left.

1. **Where should it run.** **Ask this. Never pick a region for the user.** The right answer depends on a customer contract you cannot see. Say that pinning a region shrinks the available GPU pool, then confirm with `runpodctl` that the chosen model's GPU is actually rentable there today; if not, say so before the gate, not after.
2. **How much history it holds.** Sets the network volume, which must also fit the model weights.

**When they pick the region, show the coverage line** from `trust-boundary.md` section 5: SOC 2 Type 2, GDPR for EU regions, a signable DPA on Standard Contractual Clauses, an Article 27 EU representative, data subject rights, 72-hour breach notification, deletion on request. Every line is verified.

Show it here and once more in the gate. **Nowhere else.** Repeating caveats at every step trains the user to skip them, which is how the one that matters gets missed.

### B3. Run the cost and residency gate, get a yes
Go to `references/cost-gate.md` and run it in full. It runs four residency refusals first, then computes the hourly rate, the monthly projection and the teardown commands, then stops.

It refuses a defaulted region, Community Cloud, and a volume in a different region than the pod. That last one slips through most often: the GPU holds a prompt for milliseconds, the volume holds every conversation forever.

State the honest contractual limit in the same message. RunPod's DPA commits to **reasonable efforts** to allocate a **geographically proximate** server. It does not guarantee residency. Read `trust-boundary.md` section 3 and do not soften it.

One consolidated gate, and it is before the first dollar.

### B4. Build the pod
Follow `references/deploy-steps.md` section 2.

The critical flag is **`--api-key`** on vLLM. Port 8000 is public through the proxy, so a vLLM without a key is refusal 1 in the cost gate. Expose **8080 and 8000, nothing else**, and never start vLLM on this pod without the key.

**Three rules that decide whether the pod ever starts.** All three were learned on billed GPUs and each one presents as a pod that hangs with no error:

1. **Validate every vLLM flag and the tool-call parser name against the vLLM source before creating the pod.** The commands are in `troubleshooting.md` section 0. An unknown argument makes vLLM exit during argparse, before it opens a port or writes anything reachable. `--disable-log-requests` is the one that has already cost an hour: it no longer exists.
2. **Do not override the container entrypoint.** Pass vLLM's arguments with `--docker-args` and let the image start normally. No `apt-get`, no `pip install`, no venv before the server is up. Install Open WebUI afterwards, on the running pod.
3. **Verify CLI flag names with `--help` first.** runpodctl 2.8.1 uses `--image`, `--cloud-type`, `--data-center-ids`, `--gpu-id`, `--container-disk-in-gb`, `--docker-args`. Older camelCase forms fail. There is no `--volumePath`; volumes mount at `/workspace`.

**Judge readiness by the port code, never by `runtime` or SSH.** 404 no route, 502 live pod with nothing listening, 401 serving with the key enforced, 200 serving. `runtime: null` and SSH `container not found` are both non-diagnostic on an inference image, and treating them as failure signals sends you chasing the wrong problem.

Print the teardown command as soon as each resource exists, before moving on.

**Report a real checkpoint at least every 3 minutes while waiting.** Silence during a paid wait is the thing users abandon runs over, and it is indistinguishable from a stuck run.

### B5. Confirm the trust boundary
Do not skip this. Run the three probes in `deploy-steps.md` 2c-bis: with the key from inside the pod it answers, without the key from outside it returns **401**, with the key from outside it returns **200**.

If the no-key probe returns 200, the key is not enforced and the build is wrong; if it refuses to connect, the API door is missing and Claude Code cannot reach the pod. Fix either before writing the report. Never fill the data flow table without having run this.

### B6. Prove it with a real reply
Three generations, because the report makes three different promises and each one must have happened:

1. **The chat door.** A real prompt through Open WebUI's chain, with the reply shown.
2. **The Anthropic door.** A real prompt to `/v1/messages` on the public URL with the key.
3. **Claude Code itself.** Run the CLI against the pod with `env -i` so the operator's own credentials cannot produce a false pass. The exact command is in `report-template.md`, Route B card 4.

Do not report success on an HTTP 200, and do not report success on the model list endpoint alone: both can pass while generation fails. Capture every prompt and reply verbatim; never paraphrase or invent model output.

If anything fails, go to `references/troubleshooting.md` before improvising.

### B7. Render the handover report
Deliver the result as a rendered HTML page, not chat text. Build it from `references/report-template.md`. It carries the chat URL, the real prompt and reply, the running cost, the teardown commands, the admin account instructions, and the **Claude Code launch block with every value filled in**. A user who wants this in Claude Code pastes that block from the page and is running; they never assemble it themselves.

**Copy that block from `deploy-steps.md` section 3, never from memory.** The pod is an LLM gateway in Claude Code's own terms and has a documented variable set (https://code.claude.com/docs/en/llm-gateway-connect); writing it from recall reintroduces `ANTHROPIC_SMALL_FAST_MODEL`, which is deprecated, and omits the alias and beta-suppression variables a one-model pod needs.

It also carries the **ten-row data flow table** and the **reviewer paragraph** from `references/trust-boundary.md` sections 4 and 6, with the user's real region in every cell. Row 9, control-plane metadata, stays "unconfirmed" until RunPod answers in writing. **Never fill a cell with an assumption**; "unconfirmed" is a legitimate value a reviewer respects, and an invented one destroys the document the first time it is checked.

Keep the chat summary to three lines and the file path. The page carries the detail.

## Teardown

Treat `/rent-my-gpu teardown` as a first class entry point. Follow `references/teardown.md`. On Route B it lists every billing resource in the order that stops the money soonest, and verifies each is gone rather than trusting the delete call. On Route A there is nothing that bills at idle; teardown is revoking the key.

Money keeps running until teardown on Route B. That makes it part of the skill, not an afterthought.

## Human checkpoints
- **At the fork**: the user picks the route, with the cost anchors visible. Never pick for them unless their own words already did.
- **Before provisioning anything** on Route B (step B3): the cost and residency gate, with hourly and monthly figures. Wait for an explicit yes.
- **Before deleting anything** in teardown: list what will be destroyed and what data dies with it, then wait.

Never delete a RunPod resource the user did not ask you to remove, even if it looks orphaned.

## Self-improvement

If a CLI flag or endpoint in `references/` turns out to be wrong, fix the reference file in the same session and say you did. Both providers ship fast and these files will drift.
