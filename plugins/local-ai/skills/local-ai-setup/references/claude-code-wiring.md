# Claude Code on the local model

The optional last step. Points Claude Code itself at the model that was just installed, so the user gets a coding agent running entirely on their own machine, with the same paste-and-run block `rented-server-setup` hands over for a rented pod.

Offer it. Do not assume it. Most people who ran this skill wanted a chat window, and this step is a different product.

## Contents
1. When to offer it, and when not to
2. The gate: context length
3. The gate: model size
4. The block
5. The settings file form
6. Prove it with the CLI
7. How to undo it
8. When it fails

## 1. When to offer it, and when not to

Claude Code talks the Anthropic Messages API. It can point at any server that serves `/v1/messages`, and **Ollama does**, so a local Ollama needs no proxy, no shim and no translation layer.

| Backend | Offer this step |
|---|---|
| Ollama, on its own or under Open WebUI or Odysseus | Yes. Verified working. |
| LM Studio, Goose, AnythingLLM, OpenWork | No. Their local servers speak the OpenAI dialect, and an Anthropic endpoint has not been verified on any of them. Do not print a block that has not been run. |

Verified on 11 August 2026, Ollama 0.32.5 on an M1 Pro. A direct call returns a well formed Anthropic response, including `thinking` blocks:

```bash
curl -s http://127.0.0.1:11434/v1/messages -H 'content-type: application/json' \
  -d '{"model":"qwen3:0.6b","max_tokens":64,"messages":[{"role":"user","content":"hi"}]}'
# {"id":"msg_...","type":"message","role":"assistant",
#  "content":[{"type":"thinking",...}],"stop_reason":"max_tokens",
#  "usage":{"input_tokens":17,"output_tokens":64}}
```

This is a supported path, not a coincidence. The Ollama binary carries `ANTHROPIC_BASE_URL`, `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_DEFAULT_OPUS_MODEL`, `ANTHROPIC_DEFAULT_SONNET_MODEL`, `ANTHROPIC_DEFAULT_HAIKU_MODEL` and `CLAUDE_CODE_SUBAGENT_MODEL` as known strings. Confirm the endpoint on the user's own version anyway, with the curl above, before offering the step. If it does not return `"type":"message"`, their Ollama is older than this integration and the answer is to update Ollama, not to build a proxy.

Say the honest version of what they are getting, in one line, before they agree: a local model driving Claude Code is slower and markedly less capable than the hosted one, and it is worth it for privacy, offline work and zero per token cost, not for quality.

## 2. The gate: context length

**This is the step that decides whether the whole thing works, and it fails silently.** Get it wrong and Claude Code does not error. It answers confidently and wrongly.

Ollama defaults to a 4,096 token context and **truncates anything longer instead of refusing it**. Claude Code's system prompt is far larger than that, so the model receives a fragment and never sees its tools.

Measured on 11 August 2026, on a bare `env -i` run with no project files loaded:

| What | Tokens |
|---|---|
| Claude Code's prompt, first message | 18,323 |
| The same session after one tool call | 26,346 |
| Ollama's default window | 4,096 |
| What one request actually got | 2,050 |

Ollama logged the damage as a warning nobody sees:

```
level=WARN msg="truncating input prompt" limit=2050 prompt=18323 keep=4 new=2050
```

It kept 4 tokens of an 18,323 token prompt. `claude -p "Reply with exactly: local-works"` then returned `The file has been successfully created at journal.jsonl.` with **exit code 0**. A fabricated tool result, no error, nothing in the output to suggest anything was wrong. This is the failure to design against, and it is why section 6 tests with the CLI and a sentinel rather than a status code.

Note the second row of that table. The window is divided across `OLLAMA_NUM_PARALLEL` slots, which is why a 4,096 window gave one request 2,050 tokens. Pin parallelism to 1 so the whole window goes to the session.

Two variables, both read by `ollama serve` at startup, so **the server must be restarted for them to take effect**:

```bash
export OLLAMA_CONTEXT_LENGTH=65536
export OLLAMA_NUM_PARALLEL=1
# then restart the server so it picks them up
```

**The floor is 32768.** The prompt measured 18k to 26k with nothing loaded, and it grows with the user's own `CLAUDE.md` files, plugins and skills, so anything under 32k will truncate on a real project rather than on the test. Use 65536 where memory allows.

Raising this costs real memory. The KV cache sits on top of the model weights, and `scan-my-machine`'s budget counted weights only, so a model that fitted before may not fit at 64k. If the machine is tight, hold the context at 32768 rather than dropping to a weaker model: a truncated prompt breaks Claude Code outright, while a smaller window only shortens the conversation.

## 3. The gate: model size

**Do not offer this step for a model under roughly 7B.** Claude Code is a tool calling agent, and a small model cannot hold the tool schemas, the instructions and the conversation at once.

`qwen3:0.6b` did return the sentinel in the verified run, so the plumbing is genuinely proven, but its reply arrived with fragments of the system prompt appended to it. That is what a model does when it cannot separate its instructions from its output, and on real work it produces plausible fabricated tool results rather than refusals. The plumbing test passing does not mean the setup is useful.

State the floor plainly. Around 7B to 8B is where tool calls start landing, and the gap to the hosted models is still wide.

## 4. The block

Every value real, nothing to look up. The model ID is the Ollama tag exactly as `ollama list` prints it, including the part after the colon: `qwen3` and `qwen3:8b` are different names, and the wrong one produces a model not found on every message.

```bash
export ANTHROPIC_BASE_URL="http://127.0.0.1:11434"
export ANTHROPIC_AUTH_TOKEN="ollama"

# One model serves every alias, because the machine serves one model.
export ANTHROPIC_MODEL="qwen3:8b"
export ANTHROPIC_DEFAULT_OPUS_MODEL="qwen3:8b"
export ANTHROPIC_DEFAULT_SONNET_MODEL="qwen3:8b"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="qwen3:8b"
export CLAUDE_CODE_SUBAGENT_MODEL="qwen3:8b"

export CLAUDE_CODE_MAX_OUTPUT_TOKENS=8000
export CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1
export CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1
claude
```

What each line is doing, and why removing one breaks it:

- **`ANTHROPIC_AUTH_TOKEN`, not `ANTHROPIC_API_KEY`.** Local Ollama checks no credential, but Claude Code needs one present or it runs its first run login instead of connecting. Any non empty string works, so `ollama` is a readable placeholder. The API key variable additionally needs a one time interactive approval and is silently ignored once declined, which reads as a broken setup.
- **`ANTHROPIC_DEFAULT_HAIKU_MODEL` is not optional, and `ANTHROPIC_SMALL_FAST_MODEL` is deprecated.** Background functionality resolves through the haiku variable, so on a one model machine it has to point at that model or background calls ask Ollama for a Claude it does not have.
- **Set `CLAUDE_CODE_SUBAGENT_MODEL` too.** Subagents and workflows resolve their own model and override both the per invocation parameter and a subagent's frontmatter. Unset, they ask for something the machine does not serve.
- **`CLAUDE_CODE_MAX_OUTPUT_TOKENS` has to fit inside the window with the prompt.** Claude Code asks for up to 32,000 output tokens by default, which does not fit alongside a 26k prompt in a 32k window. 8000 against a 65536 window leaves room; against a 32768 window, keep it at 4000.
- **`CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1`** suppresses pre release request fields that a non Anthropic upstream may reject outright.
- **`CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1`** keeps the session on the machine, which is the point of running locally. Two consequences to state: auto updates stop, so the user needs another update path, and WebFetch's domain safety check still calls out, which is turned off separately with `skipWebFetchPreflight`.

`CLAUDE_CODE_MAX_RETRIES=1` plus `--verbose` while setting this up turns a retry loop into one readable error. Leave both out of the block handed over.

Unlike the rented pod, **nothing here expires**. There is no hostname carrying a pod ID and no key living in a server process, so the same block keeps working after a reboot as long as Ollama is running with the same context variables.

## 5. The settings file form

Exports die with the terminal, so offer this as well. Claude Code reads an `env` block from a settings file, and those values win over shell exports:

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "http://127.0.0.1:11434",
    "ANTHROPIC_AUTH_TOKEN": "ollama",
    "ANTHROPIC_MODEL": "qwen3:8b",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "qwen3:8b",
    "CLAUDE_CODE_SUBAGENT_MODEL": "qwen3:8b",
    "CLAUDE_CODE_MAX_OUTPUT_TOKENS": "8000",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  }
}
```

**Warn before writing it, and never write it without asking.** In `~/.claude/settings.json` this makes the local model the default for every project on the machine, including the ones the user expects the hosted Claude to handle, and that is a surprise worth avoiding. A project's `.claude/settings.json` is the wrong file for the opposite reason: it is committed, and a project scoped `env` block is only read after the first run wizard, so a fresh machine asks the user to log in even though the values are correct. If they want one project only, `.claude/settings.local.json` is gitignored.

The default recommendation is the exports, in a terminal the user opens when they want the local model. Offer the settings file as the deliberate second step, on request.

## 6. Prove it with the CLI

**Do not hand over the block until Claude Code itself has answered through it.** Not a `curl` to `/v1/messages`, and not a model list. Section 2 is the reason: the endpoint returns a clean 200 while feeding the model 4 tokens of its prompt.

One command tests the whole chain, including the variables:

```bash
env -i HOME="$HOME" PATH="$PATH" \
  ANTHROPIC_BASE_URL="http://127.0.0.1:11434" \
  ANTHROPIC_AUTH_TOKEN="ollama" \
  ANTHROPIC_MODEL="qwen3:8b" \
  ANTHROPIC_DEFAULT_HAIKU_MODEL="qwen3:8b" \
  CLAUDE_CODE_MAX_OUTPUT_TOKENS=8000 \
  CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1 \
  CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1 \
  CLAUDE_CODE_MAX_RETRIES=1 \
  claude -p "Reply with exactly: local-works"
```

`env -i` matters. Without it the operator's own Claude Code credentials leak into the test, the request goes to the hosted API, and a perfect pass proves nothing about the local model.

**A pass is the sentinel and nothing else.** Anything else in the reply is a truncated prompt, so go back to section 2 and check the context variables reached the running server. Then read the server log for `truncating input prompt` before believing any pass:

```bash
grep -i "truncating input prompt" <the ollama log>
```

A single one of those lines invalidates the run, whatever the model said.

Put the real prompt and the real reply on the report page. If the reply carried stray system prompt text, as `qwen3:0.6b` did, put that on the page too rather than tidying it. It is the honest picture of a small model driving an agent.

## 7. How to undo it

Ask for this every time, because a user who cannot get back to the hosted model will conclude Claude Code is broken.

If the values were exports, closing the terminal is the undo, and `unset ANTHROPIC_BASE_URL ANTHROPIC_AUTH_TOKEN ANTHROPIC_MODEL` reverts the current one. If they went into a settings file, name the file and the key to delete. If they were added to a shell profile, that is the file to edit, and say which line.

State the tell as well: the model name in Claude Code's status line. If it reads the Ollama tag, the session is local.

## 8. When it fails

| What the user sees | Cause | Fix |
|---|---|---|
| Fluent, confident answers about files and commands that do not exist, exit code 0 | The prompt was truncated. The model never saw its tools. | Section 2. Set both variables, restart `ollama serve`, confirm no `truncating input prompt` in the log |
| A login prompt, or it connects to the hosted Claude | `ANTHROPIC_AUTH_TOKEN` is unset, or a settings file is overriding the exports | Set the token to any non empty value. Settings files beat exports, so check `~/.claude/settings.json` |
| `model not found` on every message | The tag is wrong, or only one alias was set | Copy the ID verbatim from `ollama list` into all five model variables |
| Connection refused | `ollama serve` is not running | Start it. It does not survive a reboot unless installed as a service |
| `400`, extra inputs are not permitted | A pre release request field was rejected | `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1`, which is already in the block |
| Every message overflows the window | `CLAUDE_CODE_MAX_OUTPUT_TOKENS` plus the prompt exceeds the context | Raise `OLLAMA_CONTEXT_LENGTH`, or lower the output cap to 4000 |
| Correct but unusably slow, or the machine becomes unresponsive | The model plus a large KV cache exceeds memory, so it is swapping | Lower the context to 32768, or run a smaller model |
| Tool calls never fire, or loop | The model is too small for agentic work | Section 3. Nothing in the wiring fixes this |
