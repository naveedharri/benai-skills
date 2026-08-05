---
name: rent-my-gpu
description: Rents a GPU on RunPod in a region the user picks, serves an open model on vLLM, puts Open WebUI in front of it and proves a real reply, so the user gets a private chat URL for a model their own machine cannot run. Use when the user says "rent a GPU", "run a big model in the cloud", "my machine cannot run this model", "deploy an open model", "host Qwen or DeepSeek or GLM myself", "put Open WebUI online", "give my team a private ChatGPT", "private AI for my business", "GDPR compliant LLM hosting", "RunPod", or "cloud GPU". Two builds: a privacy build on one Secure Cloud pod with the inference server bound to loopback and nothing exposed but the chat login, and a cheaper serverless build. Needs a RunPod API key, plus a Railway token only for the cheap build. Asks where to deploy, never picks a region itself, shows what compliance covers, and always shows hourly and monthly cost before spending anything. Requires Claude Code with shell and internet access; refuses to run in a sandbox.
---

# Rent My GPU

The cloud counterpart to `scan-my-machine`. That skill tells someone what their laptop can run. This one rents what it cannot, and hands back a URL they can chat in.

The user gives a credential and answers five questions. Everything after that is yours: provision, serve, wire, verify, report. They should not have to open a dashboard, paste a URL, or copy an endpoint ID.

Two things are never automatic. The **spend**, in `references/cost-gate.md`. And the **region**, which the user chooses and you never default.

## Before you start

Run the check in `references/environment-check.md` first. This skill needs a real shell with internet access. If the environment is a sandbox, stop and tell the user to run it in Claude Code on their own machine.

Unlike the rest of this plugin, nothing here runs on the user's hardware. Their specs do not matter. Do not scan the machine and do not offer a local option: if a local model would do, they should be in `local-ai-setup` instead. Say that in one line and move on.

## What this skill is doing

Two builds. Question 1 picks which, and it changes the architecture, not just the settings.

**Build A, privacy.** One Secure Cloud Pod in a region the user chooses, running both vLLM and Open WebUI. vLLM binds to loopback, so the inference endpoint is not reachable from any network at all. One public port, 8080, with Open WebUI's own login as the lock.

```
[ one Pod, chosen region ]  vLLM 127.0.0.1:8000  <-localhost-  Open WebUI :8080  --HTTPS-->  users
```

**Build B, cost.** Serverless plus Open WebUI on Railway. Cheaper and more convenient, and not a privacy story. Say that plainly rather than letting the user assume otherwise.

```
RunPod Serverless  --OpenAI endpoint-->  Railway (Open WebUI)  --HTTPS-->  users
```

Open WebUI is a FastAPI app that owns a disk at `/app/backend/data`, which is why it never goes on Vercel: Vercel functions are ephemeral. If the user asks for Vercel, say that in one sentence and use Build A's pod or Railway.

## Steps

Track progress:

```
Task Progress:
- [ ] 1. Ask question 1 and route
- [ ] 2. Get the credentials
- [ ] 3. Install the provider skills
- [ ] 4. Ask the remaining four questions
- [ ] 5. Run the cost and residency gate, get a yes
- [ ] 6. Build it
- [ ] 7. Confirm the trust boundary
- [ ] 8. Prove it with a real reply
- [ ] 9. Render the handover report
```

### 1. Ask question 1 and route
Ask the driver question from `model-picker.md` section 1 **before anything else**, including before asking for credentials. Privacy and cost produce different architectures, and discovering that at step 6 wastes a provisioned GPU.

If the answer is privacy, ask the follow-up in that section. **If the requirement names the CLOUD Act, SecNumCloud, BSI C5 or EU ownership, stop and say RunPod is the wrong provider.** Runpod Inc. is US-incorporated and no configuration changes that. Point at OVHcloud, Scaleway, Outscale or Cloud Temple. Read `trust-boundary.md` section 1 first.

### 2. Get the credentials
Build A needs only a RunPod API key. Build B needs both. Ask for what this build needs in one message, not one at a time:

- **RunPod API key**, from the RunPod console under Settings, API Keys.
- **Railway token**, Build B only, from Railway account settings. An account level token can create projects; a project scoped token cannot.

Set them in the session environment only. Never write either key to a file, never echo them into terminal output the user might paste elsewhere, and never put them in the report. `references/deploy-steps.md` section 1 has the handling rules.

If the user only has a RunPod key, you can still finish steps 5, 7 and 8 and give them a working API endpoint, then offer Railway later. Say what they will not get: no chat interface, no history, no accounts.

### 3. Install the provider skills
Do not reimplement either provider's API. Both ship official agent skills, and they are better maintained than anything you would write here.

```bash
npx skills add runpod/runpod-plugins-official
```

That gives a router plus `runpod-mcp`, `runpodctl`, `flash`, `companion-clis` and `runpod-usage`. Auth is `RUNPOD_API_KEY` for all of them; `runpodctl doctor` persists it. Railway publishes `use-railway` in the same ecosystem, plus a CLI.

Install only what is missing. Then confirm each tool authenticates before you provision anything, because a key that fails at step 6 wastes a GPU that is already billing.

**Verify subcommands with `--help` before you run them.** Do not trust flags from memory, including the ones in this skill's references. Both CLIs move.

### 4. Ask the remaining four questions
One `AskUserQuestion` with four questions, not four rounds. The full option text is in `references/model-picker.md` section 2; use it rather than inventing wording, because the prices and the region codes are attached to the options.

1. **Where should it run.** **Ask this. Never pick a region for the user.** It is the whole point of the privacy path, and the right answer depends on a customer contract you cannot see. Say that pinning a region shrinks the available GPU pool.
2. **How good does the model need to be.** **Build these options live** from `references/model-sources.md`, not from the static table: Hugging Face for what exists and its real footprint, Artificial Analysis for the ranking, vLLM recipes for whether it can actually be served, and `runpodctl` for whether that GPU is rentable in their region today. Drop any option that fails availability rather than offering it and failing at provision. Fall back to the static matrix only when discovery is unavailable, and say which you used.
3. **Who will use it.** Sets the signup policy and whether SQLite or Postgres.
4. **How much history it holds.** Sets the network volume, which must also fit the model weights.

If the user already said any of this earlier, pass it through instead of re-asking.

**When they pick the region, show the coverage line** from `trust-boundary.md` section 5. It states what RunPod's compliance actually covers: SOC 2 Type 2, GDPR for EU regions, a signable DPA on Standard Contractual Clauses, an Article 27 EU representative, data subject rights, 72-hour breach notification, deletion on request. Every line is verified.

Show it here and once more in the gate. **Nowhere else.** Do not recite caveats at every step: the gaps belong in the reviewer paragraph, which is where a reviewer looks for them, and repeating them trains the user to skip the one that matters.

### 5. Run the cost and residency gate, get a yes
Go to `references/cost-gate.md` and run it in full. On the privacy path it runs four residency refusals first, then computes the hourly rate, the monthly projection and the teardown commands, then stops.

It refuses a defaulted region, Community Cloud on the privacy path, Serverless on the privacy path, and a volume in a different region than the pod. That last one is the one that slips through: the GPU holds a prompt for milliseconds, the volume holds every conversation forever.

State the honest contractual limit in the same message. RunPod's DPA commits to **reasonable efforts** to allocate a **geographically proximate** server. It does not guarantee residency. Read `trust-boundary.md` section 3 and do not soften it.

One consolidated gate, not a gate per resource. But exactly one, and it is before the first dollar.

### 6. Build it
Follow `references/deploy-steps.md` section 2 for Build A, section 3 for Build B.

For Build A the critical flag is **`--host 127.0.0.1`** on vLLM. That single flag is what makes this build private: the inference server is not reachable from any network, so there is no URL to leak and no port to forget. Expose **8080 only**. Never 8000.

Print the teardown command as soon as each resource exists, before moving on.

### 7. Confirm the trust boundary
Build A only, and do not skip it. Run the two checks in `deploy-steps.md` section 2d: the endpoint must answer on `127.0.0.1:8000` from inside the pod, and **must fail** from outside on the proxy URL.

If the outside call returns anything at all, port 8000 was exposed and the build is wrong. Fix it before writing the report. Never write "not reachable" into the data flow table without having run this.

### 8. Prove it with a real reply
Send one real prompt through the whole chain and show the reply. Do not report success on an HTTP 200, and do not report success on the model list endpoint alone: both can pass while generation fails.

On Serverless, the first request pays the cold start. Say so before you send it, and wait longer than feels right rather than declaring failure.

If anything fails, go to `references/troubleshooting.md` before improvising. It covers the empty dropdown, the cold start timeout, the volume that was not attached and the unauthenticated pod.

### 9. Render the handover report
Deliver the result as a rendered HTML page, not chat text. Build it from `references/report-template.md`. It carries the chat URL, the real prompt and reply, the running cost, the teardown commands and the admin account instructions.

On the privacy path it also carries the **ten-row data flow table** and the **reviewer paragraph** from `references/trust-boundary.md` sections 4 and 6, with the user's real region in every cell. Row 9, control-plane metadata, stays "unconfirmed" until RunPod answers in writing. **Never fill a cell with an assumption**; "unconfirmed" is a legitimate value that a reviewer respects, and an invented one destroys the document the first time it is checked.

Keep the chat summary to three lines and the file path. The page carries the detail.

## Teardown

Treat `/rent-my-gpu teardown` as a first class entry point, not a footnote. Follow `references/teardown.md`. It lists every billing resource this skill can create, in the order that stops the money soonest, and it verifies each one is actually gone rather than trusting the delete call.

Money keeps running until teardown. That makes it part of the skill, not an afterthought.

## Human checkpoints
- **Before provisioning anything** (step 4): the cost gate, with hourly and monthly figures. Wait for an explicit yes.
- **Before switching from Serverless to a Pod**: state the monthly cost of always on, and wait.
- **Before deleting anything** in teardown: list what will be destroyed and what data dies with it, then wait.

Never delete a RunPod resource or Railway project the user did not ask you to remove, even if it looks orphaned. It may be someone else's.

## Self-improvement

If a provider CLI flag in `references/` turns out to be wrong, fix the reference file in the same session, and say you did. Both providers ship fast and these files will drift.
