# Cost and Residency Gate

Run this in full before provisioning anything. It is the analogue of `allow-team`'s safety gate, and it guards two things: the user's bank account, and the claim they are about to make to their own customer about where data lives.

This gate can refuse. Do not provision past a refusal.

## Residency checks

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
| 6 | Auth posture decided | vLLM on loopback, 8080 the only exposed port | Port 8000 exposed |

Check 5 matters more than it looks. If you cannot say how to stop the billing, you are not ready to start it.

## 2. The confirmation message

One message. Every number real. Then stop and wait.

```
Here is what I am about to create, and what it costs.

  Model          gpt-oss-120b  (63 GB at native MXFP4)
  GPU            1 x H100 80GB, Runpod SECURE cloud
  Region         EU-FR-1, France          <- your choice
  Shape          Pod, always on. vLLM on loopback, only the chat login exposed
  Rate           $2.89 per hour
  If left on     ~$69 per day, ~$2,110 per month
  Interface      Open WebUI on the same pod, no extra provider
  Storage        Network volume 100GB in EU-FR-1, bills even when nothing runs

  Billing starts the moment the GPU starts, not when you first chat.

  To stop it later, or now:
    /rent-my-gpu teardown

Shall I go ahead?
```

Use Secure Cloud rates : H100 $2.89, H200 $4.39, B200 $5.89, A100 PCIe $1.39, L40S $0.99. A 4×H200 frontier build is **$17.56/hr, about $421 a day and $12,825 a month**. Community Cloud is refused here, so its cheaper rates never apply.

Rules for this message:

- **Give the daily figure as well as the monthly.** At high hourly rates the monthly number reads as abstract and the daily one lands.
- **Say that storage bills while idle.** RunPod volumes do. Users assume stopping the GPU stops everything.
- **Say that billing starts at provision, not at first use.** For a Pod this is the gap people get wrong: the model download and load time is billed.
- **Never include the API key.**

Then wait. An explicit yes. Not silence, not "sounds good, but".

## 3. Refusal conditions

Refuse, say why in one sentence, fix the cause, re-run the gate.

1. **Port 8000 exposed.** The whole build rests on the inference server being unreachable. A pod proxy URL is public and unauthenticated, so anyone who finds `https://<podid>-8000.proxy.runpod.net/v1` spends the user's money and reads their prompts. Expose 8080 only. This is not a warning, it is a refusal.
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
