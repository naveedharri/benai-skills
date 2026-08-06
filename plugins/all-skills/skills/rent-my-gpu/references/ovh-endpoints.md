# Route A: OVHcloud AI Endpoints

The per-token build. No GPU, no pod, no volume, no teardown. An OpenAI-compatible API run by OVH Groupe SAS, a French company, on infrastructure in Gravelines, France. Everything below was verified live on 6 August 2026.

**What this route is:** the user's apps point at OVH's endpoint and pay cents per million tokens. Zero cost while idle.

**What this route is not:** single-tenant. Prompts are processed on OVH's shared service. If the customer's requirement is "no third-party service touches our plaintext on shared infrastructure", this route fails it and Route B exists.

**Two shapes:** solo (apps point straight at the endpoint, nothing hosted, zero idle) and team (one shared Open WebUI on a small OVH VPS, `ovh-team-interface.md`, ~€5/mo idle).

## Contents
1. The endpoint
2. The live catalog
3. Key or keyless
4. Prove it with a real reply
5. Wire the interface
6. Rate limits and billing
7. What to refuse

## 1. The endpoint

One base URL for every model:

```
https://oai.endpoints.kepler.ai.cloud.ovh.net/v1
```

OpenAI dialect only: `/v1/models`, `/v1/chat/completions`, `Authorization: Bearer`. There is no Anthropic-compatible surface, so an Anthropic-only client (Claude Code pointed at a custom base) cannot use this route.

The base already ends in `/v1`, so clients that append `/chat/completions` themselves work unmodified. This is the opposite of the pod route's Open WebUI passthrough, which uses `/api`.

## 2. The live catalog

The catalog is self-describing and needs no auth. **It carries live per-token pricing and context length, so never quote a price from a table, including this file's examples.**

```bash
# chat models with per-1M-token prices (embedding models have max_completion_tokens 0)
curl -s "https://oai.endpoints.kepler.ai.cloud.ovh.net/v1/models" | jq -r '
  .data[] | select(.max_completion_tokens != 0) |
  [.id, .owned_by,
   ((.pricing.prompt|tonumber)*1000000|tostring),
   ((.pricing.completion|tonumber)*1000000|tostring),
   (.context_length|tostring)] | @tsv' | column -t
```

Read on 6 August 2026 the catalog carried, among others: `gpt-oss-120b` at $0.09 in / $0.47 out per 1M tokens with 131K context, `Qwen3.5-397B-A17B` at $0.71 / $4.25 with 262K context, `Qwen3-Coder-30B-A3B-Instruct`, `Meta-Llama-3_3-70B-Instruct`, `Mistral-Small-3.2-24B`, and `Qwen2.5-VL-72B` for vision. Present what the catalog returns today, not this list.

Two things the catalog decides:

- **The model IDs are exact and the API matches on them verbatim.** `gpt-oss-120b`, not `openai/gpt-oss-120b` and not `GPT-OSS-120B`.
- **If the model the user needs is not in the catalog, this route cannot serve it.** DeepSeek-V4-Flash, GLM-5.2 and Kimi K3 were absent on 6 August 2026. Say so in one line and offer Route B, where anything with a vLLM recipe runs.

Notable inversion worth saying once: the catalog's `Qwen3.5-397B-A17B` is a frontier-scale model that Route B cannot serve for less than the frontier pod rate. Per-token, a model too big to rent becomes affordable.

## 3. Key or keyless

Two tiers, both verified:

| Tier | Auth | Rate limit |
|---|---|---|
| Anonymous | none at all | 2 requests/min per IP per model |
| API key | `Authorization: Bearer <key>` | 400 requests/min per Public Cloud project per model |

- **The anonymous tier is real and is the demo path.** A completion with no key succeeds. Use it to prove the route works before the user creates anything.
- **The key comes from the OVHcloud Manager**: Public Cloud → AI & Machine Learning → AI Endpoints → API keys. Keys are scoped to a Public Cloud project and carry a validity period the user sets. The user creates it themselves; never ask them to paste it into anything but the session environment.
- A wrong or expired key returns **403**, not 401.
- Same handling rules as every credential in this plugin: never write it to a file, never echo it, never put it in the report. Show the last four characters to prove it is set.

**On tooling:** unlike Route B, this route installs nothing. OVH ships no official agent skills, and its official MCP server (labs.ovhcloud.com/en/mcp-server) was still Labs-status with unspecified coverage on 6 August 2026. That is fine: the whole route is two curl calls against a public endpoint, and key creation stays with the user in the Manager. Revisit the MCP server when it leaves Labs, for usage and billing reads in the report.

## 4. Prove it with a real reply

Same standard as Route B: an HTTP 200 is not success, a real reply is.

```bash
curl -s "https://oai.endpoints.kepler.ai.cloud.ovh.net/v1/chat/completions" \
  -H "Authorization: Bearer $OVH_AI_ENDPOINTS_KEY" -H 'Content-Type: application/json' \
  -d '{"model":"<MODEL_ID>","messages":[{"role":"user","content":"Reply with the single word: ready"}],"max_tokens":512}' \
  | jq -r '.choices[0]'
```

**Set `max_tokens` generously and check `finish_reason`.** gpt-oss models spend tokens on a `reasoning` field before the answer. Verified: with `max_tokens: 16` the entire budget went to reasoning, `content` came back empty and `finish_reason` was `length`. An empty reply with `finish_reason: length` is a budget problem, not an outage. See `troubleshooting.md` section 8.

Capture the real prompt and real reply verbatim for the report.

## 5. Wire the interface

Two shapes. **Solo**: each user points an app they already have at the endpoint, table below. **Team**: one shared Open WebUI on a small OVH VPS, same company and jurisdiction, runbook in `ovh-team-interface.md`. Single tenancy or a model outside the catalog still means Route B.

| App | Setting | Value |
|---|---|---|
| Open WebUI (local) | `OPENAI_API_BASE_URL` | `https://oai.endpoints.kepler.ai.cloud.ovh.net/v1` |
| | `OPENAI_API_KEY` | the OVH key |
| Goose | provider | OpenAI-compatible, same base URL and key |
| Any OpenAI SDK | `base_url` / `api_key` | same |

Open WebUI's model dropdown fills from the catalog automatically, which means it lists everything including embedding models; tell the user which ID they picked.

## 6. Rate limits and billing

- 429 means the rate limit, not an error in the build. Anonymous at 2/min hits it almost immediately under real use; that is the signal to create a key, not to retry harder.
- **Billing is per token consumed, to the Public Cloud project, and idle costs zero.** There is no resource that bills while nobody is chatting, which is the entire economic argument for this route.
- Give the user one anchor so the scale lands: at gpt-oss-120b's rates read today, a heavy month of 50M input and 10M output tokens is about $9. The same model always-on in Route B is about $2,110 a month. Compute the anchor from today's catalog prices, not these.

## 7. What to refuse

- **A model not in today's catalog.** Offer Route B rather than a substitute the user did not ask for.
- **An Anthropic-only client.** The dialect does not exist here. Route B's vLLM speaks `/v1/messages` over an SSH tunnel; say that in one line.
- **Claiming single tenancy.** This is a shared service. The residency and retention story is strong and the tenancy story does not exist; `trust-boundary.md` section 7 has the wording.
- **Quoting a stale price.** The catalog call costs nothing and returns the live number. There is no excuse for a dated one.
