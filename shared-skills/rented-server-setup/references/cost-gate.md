# Cost and Residency Gate

Run this before money can move. It is the analogue of `allow-team`'s safety gate, and it guards two things: the user's bank account, and the claim they are about to make to their own customer about where data lives.

This gate can refuse. Do not provision past a refusal.

Section 0 is the whole gate for Route A. Everything from "Residency checks" down is Route B, run in full before provisioning.

## 0. The Route A gate

Route A provisions nothing and bills nothing at idle, so there is no blocking confirmation. The gate is one honest statement, made after the model is picked and before wiring:

```
What this costs.

  Model      <MODEL_ID> on OVHcloud AI Endpoints, Gravelines, France
  Price      $<IN> per 1M input tokens, $<OUT> per 1M output   <- read from the catalog today
  Anchor     a heavy month (50M in, 10M out) is about $<X>
  Idle       zero. Nothing exists that bills while nobody is using it
  Billing    per token, to your OVH Public Cloud project
```

Every number from today's catalog call, never from a table. Then the residency statement in one line: the processor is OVH Groupe SAS, a French company, the service runs in Gravelines, and OVH's documentation states data is not stored or shared during or after model use. Multi-tenant; `trust-boundary.md` section 7 has the full wording.

**Team shape only:** add one line for the VPS. `Interface: Open WebUI on an OVH VPS, ~€5/mo, bills while idle, holds the chat history.` The VPS is a real billing resource, so the team shape gets what solo does not: a teardown entry in the report, and a confirmation before the user orders the VPS.

One refusal at this gate: **the double requirement.** If the customer's contract needs both EU ownership and single tenancy, neither route qualifies. Name Hetzner, Verda or Scaleway and stop.

## Residency checks (Route B)

Run these four first, always. They are refusals, not warnings.

| # | Check | Fails when |
|---|---|---|
| R1 | Region was **chosen by the user**, not defaulted | You picked one for them |
| R2 | Cloud is **Secure**, not Community | Community is selected |
| R3 | Shape is a **Pod**, not Serverless | Serverless is selected |
| R4 | Network volume is in the **same region** as the pod | The volume region differs. Chat history would sit elsewhere |

R4 is the one that slips through. The GPU holds a prompt for milliseconds; the volume holds every conversation forever. A pod in `EU-FR-1` with a volume elsewhere is not an EU residency story.

Show the **coverage line** from `trust-boundary.md` section 5 in the confirmation, so the user sees what they are getting before they approve the spend. Then state the honest limit, in one line:

> RunPod's DPA commits to reasonable efforts to allocate a geographically proximate server. It does not contractually guarantee residency. If your customer needs that guaranteed, get it from RunPod in writing before you promise it.

Read `trust-boundary.md` section 3 before wording this. Do not soften it.

## Why it exists

Every other skill in this plugin risks disk space and time. This one risks money that keeps accruing after the session ends, on infrastructure the user cannot see. A 4-GPU pod left running over a weekend at $17.56 an hour is about $840. Nobody notices until the invoice.

The user asked for hands off. Hands off means one confirmation, not none.

## Contents
1. The six checks
2. The confirmation message
3. Refusal conditions
4. After the yes

## 1. The six checks

Run all six. Record each result for the report, so the decision is auditable later.

| # | Check | How | Fails when |
|---|---|---|---|
| 1 | Rate is current | Ask the RunPod skills for the live rate for the chosen GPU and count | You are quoting a table older than today and cannot confirm it |
| 2 | Monthly projection computed | hourly × 24 × 30.42 | You have not computed it |
| 3 | Credential authenticates | A read-only RunPod call | The key fails. Never provision on an unverified key |
| 4 | Quota and balance | RunPod account balance and any spend limit | Balance will not cover one day at the quoted rate |
| 5 | Teardown known | The exact delete commands for every resource about to exist | You cannot state them yet |
| 6 | Auth posture decided | Both doors locked: Open WebUI login on 8080, a generated `--api-key` on vLLM's 8000 | vLLM would be reachable without a key |

Check 5 matters more than it looks. If you cannot say how to stop the billing, you are not ready to start it.

## 2. The confirmation message

One message. Every number real. Then stop and wait.

```
Here is what I am about to create, and what it costs.

  Model          gpt-oss-120b  (63 GB at native MXFP4)
  GPU            1 x H100 80GB, Runpod SECURE cloud
  Region         EU-FR-1, France          <- your choice
  Shape          Pod, always on. Two doors, both locked: the chat behind its
                 login, and an API URL behind a generated key, which is what
                 lets Claude Code and other apps use this GPU directly
  Rate           $2.89 per hour
  If left on     ~$69 per day, ~$2,110 per month
  Interface      Open WebUI on the same pod, no extra provider
  Storage        Network volume 100GB in EU-FR-1, bills even when nothing runs

  Ready in      ~10-15 minutes for a 27B model, ~20-30 for a 120B  <- say the real one
  Billing starts the moment the GPU starts, not when you first chat,
  and it runs through the whole setup above.

  To stop it later, or now:
    /rented-server-setup teardown

Shall I go ahead?
```

Use Secure Cloud rates : H100 $2.89, H200 $4.39, B200 $5.89, A100 PCIe $1.39, L40S $0.99. A 4×H200 frontier build is **$17.56/hr, about $421 a day and $12,825 a month**. Community Cloud is refused here, so its cheaper rates never apply.

Rules for this message:

- **Give the daily figure as well as the monthly.** At high hourly rates the monthly number reads as abstract and the daily one lands.
- **Say that storage bills while idle.** RunPod volumes do. Users assume stopping the GPU stops everything.
- **Say that billing starts at provision, not at first use.** For a Pod this is the gap people get wrong: the model download and load time is billed.
- **Never include the RunPod account key.** The vLLM door key does not exist yet at this point; it is generated during the build and handed over only in the report.

Then wait. An explicit yes. Not silence, not "sounds good, but".

## 3. Refusal conditions

Refuse, say why in one sentence, fix the cause, re-run the gate.

1. **vLLM reachable without a key.** Port 8000 is public through the proxy, and a pod proxy URL is discoverable, so a vLLM started without `--api-key` means anyone who finds `https://<podid>-8000.proxy.runpod.net/v1` spends the user's money and reads their prompts. The key is mandatory, and the no-key probe in `deploy-steps.md` 2c-bis must return 401 before handover. This is not a warning, it is a refusal.
2. **Credential unverified.** Provisioning a GPU on a key that then fails leaves a billing resource with no purpose.
3. **Balance will not cover a day.** A GPU that dies mid-setup on an empty balance leaves a half-built stack and a confused user.
4. **The user has not seen the monthly projection.** Non-negotiable, including when they are impatient.
5. **The chosen model does not fit the chosen GPUs.** Check the footprint against total VRAM in `model-picker.md` before provisioning, not after. A model that fails to load still bills.

## 4. After the yes

The moment each resource exists, print its teardown command. Do not batch this to the end: if the session dies at step 7, the user must still be able to stop the billing from scrolled-back terminal output.

```
Created: RunPod pod       <POD_ID>       stop with: runpodctl pod delete <POD_ID>
Created: network volume   <VOLUME_ID>    stop with: <exact command>
```

Carry every one of them into the report. Also set a plain expectation in one line: nothing here turns itself off, and nothing warns them at a threshold unless they set a spend limit in the RunPod console themselves.

If the user's answers imply occasional use, mention RunPod's spend limit setting once. It is the only real guardrail against a forgotten Pod, and it is theirs to set.
