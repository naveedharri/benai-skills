# Model Sources

Where to get the model list at runtime instead of trusting a table someone wrote months ago.

The static matrix in `model-picker.md` section 4 is a **fallback**, not the source of truth. Query these first. All endpoints verified working on 5 August 2026.

## Contents
1. The order to try them
2. Hugging Face Hub API
3. Computing the real footprint
4. Artificial Analysis Data API
5. OpenRouter
6. vLLM recipes
7. Ollama library
8. RunPod live availability
9. Rules

## 1. The order to try them

| # | Source | Auth | Answers |
|---|---|---|---|
| 0 | **OVH AI Endpoints catalog** | none | Route A's entire model list, with live per-token prices and context lengths built in. `ovh-endpoints.md` section 2 |
| 1 | **Hugging Face Hub API** | none | What exists, what is trending, exact parameter counts |
| 2 | **Artificial Analysis** | free key | Which is actually best, by index score |
| 3 | **vLLM recipes** | none | Can it actually be served |
| 4 | **RunPod** | user's key | Can it be rented in their region today |
| 5 | OpenRouter | none | What a hosted equivalent costs, for the build-vs-buy line |
| 6 | Ollama library | none | Is it a real local download or `:cloud` only |

Source 0 is also the fork input: a model present in the OVH catalog can be had per-token on Route A; a model absent from it is a Route B build. Because the catalog carries its own prices, Route A never quotes from a static table at all.

**For the model question itself**, the categories shown to the user come from the Onyx open-model leaderboard, **https://onyx.app/open-llm-leaderboard**: overall, coding, math, chat, reasoning, with size tiers. No API; read the page. It ranks quality only — always cross-check servability and price against the sources above. The skill's recommended default is **Qwen3.6-27B**, A-tier overall at 27B.

Steps 1, 3 and 4 need no extra credential and should always run. Step 2 needs a key the user may not have; degrade gracefully.

## 2. Hugging Face Hub API

Free, no auth, and the workhorse. Subject to HF-wide rate limits.

```bash
# what is trending right now
curl -s "https://huggingface.co/api/models?filter=text-generation&sort=trendingScore&direction=-1&limit=20"

# most downloaded, a better signal for "proven" than trending
curl -s "https://huggingface.co/api/models?filter=text-generation&sort=downloads&direction=-1&limit=20"

# one model in detail
curl -s "https://huggingface.co/api/models/openai/gpt-oss-120b"

# find quantized variants, which is where the servable weights usually live
curl -s "https://huggingface.co/api/models?search=<MODEL_NAME>&limit=100"
```

Useful fields on the detail call: `safetensors.parameters` broken down **by dtype**, `safetensors.total`, `tags`, `downloads`, `likes`, `gated`, `lastModified`.

Tags worth reading: `vllm` means a vLLM path exists, `mxfp4` / `8-bit` / `4-bit` tell you the shipped precision, `license:*` gives the licence without opening the card, `gated` means the user must accept terms before the download works.

The full OpenAPI spec is at `https://huggingface.co/.well-known/openapi.json`, with a Markdown version at `openapi.md` if you need to read it in context.

## 3. Computing the real footprint

`safetensors.parameters` gives element counts per dtype. Multiply and sum:

| dtype | bytes/element |
|---|---|
| `F32`, `I32` | 4 |
| `BF16`, `F16` | 2 |
| `F8_E4M3`, `F8_E5M2`, `I8` | 1 |
| `U8` holding **MXFP4** | **0.5**, two elements packed per byte |
| `F4`, `U4`, `I4` | 0.5 |

**Two traps, both of which will make you quote a wrong number.**

**Trap 1: packed 4-bit reads as `U8`.** gpt-oss-120b reports `{"BF16": 2.17e9, "U8": 114.66e9}`. Counting `U8` as one byte gives 119 GB. Counting it correctly at 0.5 bytes gives about 61.6 GB, which matches the real 63 GB. Check the `mxfp4` or `4-bit` tag before choosing the multiplier.

**Trap 2: the base repo is not what you serve.** `deepseek-ai/DeepSeek-V4-Flash-0731` computes to about 306 GB from its safetensors, because that repo is BF16 and FP8 mixed. The checkpoint you actually deploy is about 149 GB. **Always search for a quantized variant and compute from that repo instead.** A search for that model returns 57 variants including `unsloth/*-GGUF`, `*-FP8` and NVFP4 builds.

So the flow is: find the base model, read its card for architecture, then find the quant you will actually serve and compute the footprint from **that** repo's safetensors.

Also note the model card and the safetensors can disagree on parameter count. DeepSeek V4 Flash is described as 284B total, and its safetensors total is 304.2B. **Trust the card for architecture, the safetensors for bytes.**

## 4. Artificial Analysis Data API

The best answer to "which model is actually good", and the source of the index scores in `model-picker.md`.

```
GET https://artificialanalysis.ai/api/v2/language/models
```

- **Requires a free API key.** Unauthenticated calls return **401**, verified.
- Free tier, **1,000 requests per day**.
- **Attribution to https://artificialanalysis.ai/ is required** for any use. Put it in the report.
- Returns names, creators, release dates, parameter counts, context windows, licence status, and Intelligence, Coding, Agentic, Math, Openness and Multilingual index scores, plus GPQA, HLE, SciCode, IFBench, MMLU-Pro, AIME, LiveCodeBench and pricing.

Ask the user once whether they have a key. If not, **do not block**: fall back to the static table and say in the report which source was used and when it was read. A skill that stalls asking for an optional credential is worse than one quoting a dated table it labelled honestly.

## 5. OpenRouter

Free, no auth, 338 models when checked.

```bash
curl -s "https://openrouter.ai/api/v1/models"
```

Gives `id`, `context_length` and `pricing` per million tokens. Not a self-hosting source, but the honest build-versus-buy comparison: if the hosted price for the same model is trivial and the user's driver was cost rather than privacy, say so. That is the conversation in `model-picker.md` question 1.

## 6. vLLM recipes

Whether a model has a verified serving configuration, which matters more than its benchmark score if you have to run it tonight.

```bash
curl -s "https://recipes.vllm.ai/sitemap.xml" | grep -o '<loc>[^<]*</loc>'
curl -s "https://recipes.vllm.ai/<org>/<Model>"          # the actual flags
```

The sitemap enumerates by organisation. A model with a recipe gives you tested flags, the sanctioned GPU layout and known memory numbers. **Prefer a model with a recipe over a slightly better model without one.**

## 7. Ollama library

Only relevant when the user wants the Ollama path rather than vLLM.

```bash
curl -s "https://ollama.com/library/<model>"
```

Read the tags. **If every tag ends in `-cloud`, the model is a proxy to Ollama's own infrastructure and will never run on the rented GPU.** Covered in `deploy-steps.md`. This check is the difference between renting a GPU that works and renting one that idles while Ollama bills someone else's.

## 8. RunPod live availability

The best model is irrelevant if it cannot be rented in the region the user chose.

```bash
runpodctl datacenter list      # confirm their region exists
runpodctl gpu list             # what is actually available
```

Run this **before** presenting model options, and drop any option whose GPU is unavailable in their region rather than offering it and failing at provision. Region pinning shrinks the pool, and multi-GPU configurations in one region starve first.

## 9. Rules

- **Query first, fall back second, and always say which.** The report names the source and the timestamp. "Artificial Analysis index, read 5 August 2026" and "static table, last verified 5 August 2026" are both honest. An unlabelled number is not.
- **Never present a model you have not footprint-checked against the chosen GPUs.** A model that fails to load still bills.
- **Never quote a benchmark score you did not read today** unless you label it as dated.
- **Filter to open weights.** OpenRouter and Artificial Analysis both list closed models. Deploying one is impossible, and offering it wastes the user's time. Check the licence tag.
- **Watch for gated repos.** `gated: true` means the download fails until the user accepts terms on the model page. Catch it before provisioning, not after the GPU is billing.
- **Attribution is a licence condition, not a courtesy.** If Artificial Analysis data is used, the attribution goes in the report.
