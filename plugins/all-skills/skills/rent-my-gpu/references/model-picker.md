# Model Picker

The fork question, the four Route B questions, the exact option text, the region list, and the fallback model matrix.

**Model options should be built live.** Route A models come from the OVH catalog (`ovh-endpoints.md` section 2, carries live prices). Route B models come from `model-sources.md`; the matrix in section 3 is what to use when that fails.

Prices are RunPod **Secure Cloud** rates verified 5 August 2026. Community Cloud is cheaper and is always refused here; see section 5. Re-check before quoting, since GPU pricing moves monthly. Route A prices are never quoted from a table at all; the catalog carries them.

## Contents
0. The fork question
1. The four questions (Route B)
2. The region list
3. The model matrix (fallback only)
4. How the answers resolve
5. What to refuse

## 0. The three questions

One `AskUserQuestion`, asked before any provider is named. Skip whatever the user's own words already answered.

### Q1. What should the model be best at?
Header: `Model`

Show the source with the question so they can explore: **https://onyx.app/open-llm-leaderboard** — the open-model leaderboard, ranked overall and by coding, math, chat and reasoning.

- **All-round (Recommended) — Qwen3.6-27B.** A-tier overall at only 27B. The default of this skill: cheap on both providers, in the OVH catalog, runs on one GPU. Offer it first, always.
- **Coding** — the Qwen3-Coder family: 30B-A3B per-token on OVH, Coder-Next 80B-A3B on a pod.
- **Frontier quality** — GLM-4.7 (355B), DeepSeek class, Qwen3.5-397B. S/A-tier and big: per-token only if today's OVH catalog carries one, otherwise a multi-GPU pod.
- **I have a specific model in mind** — they name it (Gemma 4, GLM, anything). Check it against the OVH catalog and vLLM recipes before pricing it, and say plainly which route can serve it.

Whatever is picked, verify it live before the recommendation: the OVH catalog for Route A, `model-sources.md` for Route B. The leaderboard says what is good; it does not say what is servable or at what price today.

### Q2. Who will use it?
Header: `Users`

- **Just me** — solo apps on Route A, or one admin account on a pod.
- **A named team** — one shared URL: the pod, or Open WebUI on a small OVH VPS.

### Q3. Usage rhythm?
Header: `Rhythm`

- **On and off through the day** — spiky. Per-token wins by two orders of magnitude.
- **Heavy and sustained, most of the day** — always-on pod economics can make sense.

## 0b. The recommendation that follows

Show the two named providers side by side with costs computed from these three answers; full message shape in SKILL.md section 3. The double requirement, EU-owned and single-tenant at once, exits to Hetzner (up to 96 GB VRAM, monthly), Verda or Scaleway, hourly H100s, not automated here yet.

## 1. The four questions (Route B)

One `AskUserQuestion`, not four rounds.

### Q1. Where should it run?
Header: `Region`

**Ask this. Never pick a region for the user.** It is the whole point of this build, and the right answer depends on a contract you cannot see.

**Offer only regions that can hold a network volume AND have the chosen GPU in stock — check both live before asking.** Learned the hard way on 6 August 2026: `EU-NL-1` does not support network volumes at all, and the run that offered it anyway had to re-ask after a failed create. Volume-capable datacenters that day: `EU-CZ-1, EU-FR-1, EU-RO-1, EUR-IS-1, EUR-IS-3, EUR-NO-1, EUR-NO-2` in Europe, plus `CA-MTL-3/4`, `US-CA-2, US-IL-1, US-MD-1, US-MO-2, US-NC-1, US-NE-1, US-TX-3`, `AP-IN-2, AP-JP-1`. Re-fetch the list each run; a failed `network-volume create` enumerates it if no cleaner query is available. Then check GPU stock per candidate DC and drop any showing none.

Typical EU options to offer, when they pass both checks:

- **EU, France (`EU-FR-1`)** — for French or EU customers. Pairs with an EU-focused story.
- **EU, Czech Republic (`EU-CZ-1`)** or **Romania (`EU-RO-1`)** — the EU alternates.
- **EU, Iceland / Norway (`EUR-IS-*`, `EUR-NO-*`)** — EEA, typically the greenest power.
- **US** — if the customer is American, the CLOUD Act is not a threat to them and this is the low-latency choice.

Say the one thing that matters: **pinning a region shrinks the GPU pool.** Multi-GPU configurations in a single region are the most likely to hit capacity limits.

The model came from section 0, Q1; the default is **Qwen3.6-27B**. Before the gate, confirm with `model-sources.md` sections 2, 6 and 8 that it has servable weights, a vLLM path, and a rentable GPU in the region chosen above; if not, say so now, not at provision. If Q3 in section 0 answered "wider than a named team", that means Postgres rather than SQLite and a bigger volume.

### Q2. How much history will it hold?
Header: `Storage`

Sets the network volume, which is where every chat and uploaded document lives permanently.

- **Chat only** — 20 GB beyond the model cache.
- **Chat plus documents (RAG)** — 100 GB or more. Embeddings grow faster than people expect.

Volume size must also cover the model weights. **Compute that from the quant you will actually serve**, using `model-sources.md` section 3. Do not estimate it from the fallback matrix, which carries no footprints by design.

## 2. The region list

All six EU regions support Global Networking, and all are Secure Cloud capable:

| Region | Country |
|---|---|
| `EU-FR-1` | France |
| `EU-NL-1` | Netherlands |
| `EU-SE-1` | Sweden |
| `EU-RO-1` | Romania |
| `EU-CZ-1` | Czech Republic |
| `EUR-IS-2` | Iceland |

Plus US, Canada, and Asia-Pacific regions across 31+ locations globally.

**Do not infer the country from the region ID.** Observed 10 August 2026: a pod created with `--data-center-ids EUR-IS-1` came back reporting `machine.location: "IE"`. In ISO 3166 `IS` is Iceland and `IE` is Ireland, so the ID and the reported location disagree about which country the machine is in. It was not resolved during that run.

This matters more than it looks, because the region is the entire deliverable of Route B. Rules:

- **Write into the data flow table what the provider reports, plus what you asked for, and mark the country unconfirmed** if they disagree. "Requested `EUR-IS-1`, provider reports location `IE`, country unconfirmed" is an honest cell. "Iceland" would be an invented one.
- Ask RunPod in writing which country a given datacenter ID is in before a customer relies on it. This belongs with gap 3 in `trust-boundary.md`: a second thing the provider has not put in writing.
- `--country-code` on `pod create` is the flag that expresses a country requirement directly, rather than inferring one from a datacenter ID. Prefer it when the requirement is genuinely national.

### Stock is the binding constraint, not price

Read live 10 August 2026, and the reason a build fails at creation rather than at the gate. `runpodctl datacenter list` returns a `gpuAvailability` array per datacenter with a `stockStatus` of `High`, `Medium`, `Low` or empty. Empty means none.

That day, **every 48 GB Ada card was empty in every datacenter**, and `RTX PRO 6000 Blackwell Server Edition` existed in only three: `EU-RO-1`, `EUR-IS-1`, `US-NC-2`, all three at `Low`.

Two behaviours to plan around:

- **`Low` is not `no`, and creation is worth retrying.** `EU-RO-1` refused five times with HTTP 500 `create pod: This machine does not have the resources to deploy your pod`. `EUR-IS-1` refused twice and succeeded on the third identical call. Retry a few times with a short sleep before moving region.
- **The volume pins the region, so a failed create is expensive to recover from.** A volume already created in region X forces the pod into region X. When capacity in X turns out to be zero, the volume has to be deleted and recreated elsewhere. So **check GPU stock in the candidate region before creating the volume**, not after. Section 1 Q1 already says to offer only regions passing both checks; this is why.

**Whatever the user picks, write it into every cell of the data flow table in `trust-boundary.md` section 4.** That table is the deliverable, and a region chosen but not documented is a region that will be questioned later.

## 3. The model matrix, fallback only

**Query `model-sources.md` first.** This table is what to use when discovery fails, and it starts going stale the day it was written. Secure Cloud rates. Community rates in `git log` history are for the cost path only.

| Model | AA score | GPUs | Secure $/hr | Always-on /mo |
|---|---|---|---|---|
| **Qwen3.6-27B (the default)** | Onyx A-tier overall | 1×L40S | $0.99 | ~$723 |
| Qwen3-Coder-Next 80B-A3B | SWE-V 70.6% | 1×L40S | $0.99 | ~$723 |
| gpt-oss-120b | not scored here | 1×H100 | $2.89 | ~$2,110 |
| DeepSeek-V4-Flash-0731 | 50 | 4×H200 | $17.56 | ~$12,825 |
| GLM-5.2 | 51 | 4×H200 | $17.56 | ~$12,825 |
| Kimi K3 | 57 | not rentable as one machine | n/a | n/a |

**There is deliberately no footprint column.** Footprints go stale faster than anything else here, because the number that matters is the *quant you actually serve*, not the base repo. Compute it live from `model-sources.md` section 3 every time.

The GPU column is what this table is for: it tells you what to rent and what it costs. If discovery is unavailable, rent what the GPU column says and record the footprint as **unverified** rather than inventing one.

Notes that change decisions:

- **gpt-oss-120b crosses 80 GB at long context.** Measured at **83.17 GB with 131K context**, well above its resting footprint. This is measured runtime behaviour, not a repo spec, so discovery will not tell you: for long context at this tier, move to a 96 GB RTX PRO 6000 rather than watching it fall over.
- **Qwen3-Coder-Next scores higher than the 480B it came from**, 70.6 against 69.6, on a single card. Best quality per gigabyte here.
- **DeepSeek-V4-Flash ships a DSpark speculative decoding module** in the checkpoint. Free speed, enabled with `--speculative-config '{"method":"mtp","num_speculative_tokens":3}'`.
- **Do not use `nvidia/DeepSeek-V4-Flash-NVFP4` on H100 or H200.** NVFP4 tensor cores are Blackwell only.
- **GLM-5.2 costs the same as DeepSeek for one more index point** and needs far more memory at every quant. Only pick it when the customer specifically requires an OSI-standard licence.
- **Kimi K3 is the best open model and is not rentable as one machine**, needing over a terabyte of aggregate GPU memory across 64 or more accelerators. If asked for by name, say that in one line and offer DeepSeek.
- **Qwen3.8-Max**: 2.4 trillion parameters, about 1.2 TB at 4-bit, weights still not public as of 5 August 2026. Offer **Qwen3.8-27B** once it lands.

## 4. How the answers resolve

Always: a Secure Cloud Pod, single-pod build, vLLM on 8000 behind a mandatory `--api-key`, Open WebUI on 8080 behind its login. Q1 sets the region, Q2 the model, Q3 the signup policy and database, Q4 the volume.


## 5. What to refuse

- **Community Cloud.** Third-party hosts, and RunPod's attestations do not cover that boundary. Not for business data at any price.
- **RunPod Serverless.** This skill does not build it. Even region-pinned, the ephemeral fleet and the control-plane hop make the data flow paragraph unwriteable. If the user wants pay-per-use, that is Route A, which has a writeable one.
- **"Both EU-owned and single-tenant" on either route.** Route A is EU-owned and multi-tenant; Route B is single-tenant and US-owned. Name Hetzner, Verda or Scaleway and stop, rather than presenting either route as satisfying a requirement it does not.
- **Any model that does not fit the GPUs the user agreed to pay for.** State the footprint, offer the nearest fit. A model that fails to load still bills.
- **Claiming residency RunPod has not promised.** The DPA commits to "reasonable efforts" and a "geographically proximate" server, not a guarantee. See `trust-boundary.md` section 3, gap 1. Never tell a user their data is contractually pinned to a region without a written commitment.
- **Quoting a footprint from the fallback matrix.** It does not carry one, deliberately. Compute it live from `model-sources.md` section 3, or record it as unverified. Never infer a footprint from a parameter count without checking the dtype, because packed 4-bit reads as `U8` and naive arithmetic overstates it by roughly double.
- **Quoting a price you did not read today.** If the RunPod skills report live rates, prefer those and say which you used.
