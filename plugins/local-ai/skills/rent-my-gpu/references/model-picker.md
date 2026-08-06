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

## 0. The fork question

One `AskUserQuestion`, after the inversion statement in SKILL.md has been made. The jurisdiction detail stays a statement, not a question; this question is about usage shape and what "private" means, which only the user knows.

Skip it entirely when the user's own words already route them: "pay per use" or spiky usage is Route A; "one URL for my team", a model missing from the OVH catalog, or a single-tenancy requirement is Route B.

Header: `Which build`

- **EU endpoint, pay per token (Route A)** — spiky or light usage, messages on and off through the day. French processor, data not stored. A heavy month is single-digit dollars. Solo, or a team URL via one shared Open WebUI on a small OVH VPS (~€5/mo).
- **US single-tenant pod, always on (Route B)** — heavy sustained use, a model only vLLM can serve, or a single-tenancy requirement. Inference server unreachable from any network. Hundreds to thousands of dollars a month, billing whether used or not.
- **Both EU-owned and single-tenant, contractually** — this skill refuses rather than fudges: that build exists at Hetzner (up to 96 GB VRAM, monthly), Verda or Scaleway (hourly H100s), and is not automated here yet.
- **Not sure** — show the two builds side by side with today's real numbers for the model they want, then re-ask.

Fill the cost anchors in the first two options with real numbers read today: the OVH catalog price for the nearest model, and the RunPod rate for the pod that would serve it.

## 1. The four questions (Route B)

One `AskUserQuestion`, not four rounds.

### Q1. Where should it run?
Header: `Region`

**Ask this. Never pick a region for the user.** It is the whole point of this build, and the right answer depends on a contract you cannot see.

Offer the four most useful, with "Other" catching the rest of section 3:

- **EU, France (`EU-FR-1`)** — for French or EU customers. Pairs with an EU-focused story.
- **EU, Netherlands (`EU-NL-1`)** — the general EU default, good connectivity.
- **EU, Sweden (`EU-SE-1`)** — Nordic, and typically the greenest power.
- **US** — if the customer is American, the CLOUD Act is not a threat to them and this is the low-latency choice.

Say the one thing that matters: **pinning a region shrinks the GPU pool.** Multi-GPU configurations in a single region are the most likely to hit capacity limits.

### Q2. How good does the model need to be?
Header: `Quality`

**Build these options live.** Before asking, run the discovery in `model-sources.md` sections 2, 4, 6 and 8: what exists on Hugging Face, how it scores on Artificial Analysis, whether it has a vLLM recipe, and whether the GPU is rentable in the region they chose in Q1. Drop anything that fails the last check rather than offering it and failing at provision.

The three rungs below are the **fallback** when discovery is unavailable, and their prices were verified 5 August 2026. Say which source you used either way.

- **Very good, one GPU (Recommended)** — gpt-oss-120b. Fits a single 80 GB card at its native MXFP4. **$2.89/hr, about $2,110/month always on.**
- **Best coding model that fits** — Qwen3-Coder-Next 80B-A3B. Scores 70.6% on SWE-bench Verified and fits one card. **$0.99/hr on an L40S, about $723/month.**
- **Third best open model in the world** — DeepSeek-V4-Flash-0731, Artificial Analysis 50 against Claude Opus 5 at 60.7. MIT licensed. Needs 4 GPUs. **$17.56/hr, about $12,825/month.**

### Q3. Who will use it?
Header: `Users`

- **Just me** — one admin account, signup off.
- **A named team** — you create their accounts. Signup stays off.
- **Wider** — needs Postgres rather than SQLite, and a bigger volume.

### Q4. How much history will it hold?
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

**Whatever the user picks, write it into every cell of the data flow table in `trust-boundary.md` section 4.** That table is the deliverable, and a region chosen but not documented is a region that will be questioned later.

## 3. The model matrix, fallback only

**Query `model-sources.md` first.** This table is what to use when discovery fails, and it starts going stale the day it was written. Secure Cloud rates. Community rates in `git log` history are for the cost path only.

| Model | AA score | GPUs | Secure $/hr | Always-on /mo |
|---|---|---|---|---|
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

Always: a Secure Cloud Pod, single-pod build, vLLM on `127.0.0.1:8000`. Q1 sets the region, Q2 the model, Q3 the signup policy and database, Q4 the volume.


## 5. What to refuse

- **Community Cloud.** Third-party hosts, and RunPod's attestations do not cover that boundary. Not for business data at any price.
- **RunPod Serverless.** This skill does not build it. Even region-pinned, the ephemeral fleet and the control-plane hop make the data flow paragraph unwriteable. If the user wants pay-per-use, that is Route A, which has a writeable one.
- **"Both EU-owned and single-tenant" on either route.** Route A is EU-owned and multi-tenant; Route B is single-tenant and US-owned. Name Hetzner, Verda or Scaleway and stop, rather than presenting either route as satisfying a requirement it does not.
- **Any model that does not fit the GPUs the user agreed to pay for.** State the footprint, offer the nearest fit. A model that fails to load still bills.
- **Claiming residency RunPod has not promised.** The DPA commits to "reasonable efforts" and a "geographically proximate" server, not a guarantee. See `trust-boundary.md` section 3, gap 1. Never tell a user their data is contractually pinned to a region without a written commitment.
- **Quoting a footprint from the fallback matrix.** It does not carry one, deliberately. Compute it live from `model-sources.md` section 3, or record it as unverified. Never infer a footprint from a parameter count without checking the dtype, because packed 4-bit reads as `U8` and naive arithmetic overstates it by roughly double.
- **Quoting a price you did not read today.** If the RunPod skills report live rates, prefer those and say which you used.
