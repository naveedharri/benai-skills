# Model Tiers

Memory budget to named model. Match the budget from step 2 against this table.

**Researched 4 August 2026.** This table goes stale fast. If the current date is more than about three months past that, say so in the report and offer to re-check against r/LocalLLaMA and Artificial Analysis before the user downloads anything.

## Contents
1. The tier table
2. Quantization tags in plain words
3. MoE models
4. What to say about the ceiling

## 1. The tier table

| Usable budget | Primary pick | Alternates | Speed |
|---------------|--------------|-----------|-------|
| Under 3 GB | `gemma4:e2b` | `phi4-mini` | ~15 tok/s on CPU alone |
| 3–4 GB | `phi4-mini` (3.8B, 2.3 GB) | `gemma4:e2b`, `llama3.2:3b` | ~12 tok/s CPU, faster on GPU |
| 6–8 GB | Qwen3.5 9B at Q4_K_M (~6 GB) | Gemma 4 E4B, Llama 3.3 8B | ~40 tok/s on 8 GB VRAM |
| 12–16 GB | Gemma 4 12B unified (audio + vision) | Gemma 4 26B-A4B, Qwen3.6 35B-A3B | good |
| 18–24 GB | **Qwen3.6 27B at Q6** | Gemma 4 31B at Q4 for multimodal | ~100 tok/s on a 4090 |
| 32–48 GB | Qwen3.6 27B at Q8 with long context | Qwen3-Coder-Next 80B-A3B (46 GB, agent loops) | good |
| 64–128 GB | MiniMax-M3, larger Qwen MoE builds | DeepSeek V4 Flash at 3-bit (~103 GB) | usable |
| 160 GB+ | DeepSeek V4 Flash at 8-bit (162 GB) | GLM-5.2 (multi-GPU) | serious hardware |
| 1.6 TB+ | Kimi K3 | — | cluster only, mention for completeness |

The 18–24 GB row is the community consensus tier. Qwen3.6 27B replaced Qwen 3.5 as the default because it needs less than half the VRAM of the previous generation while beating its alternatives on agentic coding.

Rule: when a budget spans two rows, recommend the lower one. A model that only just fits will crash once context grows.

## 2. Quantization tags in plain words

Say this, not the jargon:

- **Q4** is smallest and the normal choice. `Q4_K_M` is the standard variant.
- **Q6** is a middle option when there is memory to spare.
- **Q8** is largest and slightly sharper.

Recommend Q4 unless the budget has clear headroom. Unsloth's dynamic GGUF builds are consistently the most memory-efficient at a given quality, so prefer them when available.

## 3. MoE models

Some models are labelled like `284B, 13B active`. Two different numbers:

- Use the **total** to decide whether it fits in memory.
- Use the **active** to predict how fast it will feel.

They can differ by 25x, which makes a huge model look deceptively cheap. Always size against the total.

## 4. What to say about the ceiling

Close every report with one line on what the machine cannot run, so the limit is explicit rather than discovered later. Be concrete: name the next tier up and what it would need.

Do not recommend anything from the 160 GB+ or 1.6 TB rows to a consumer machine. Mention they exist only if the user asks what the best open model is.
