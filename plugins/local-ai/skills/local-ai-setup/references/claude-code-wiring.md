# Claude Code on the local model

The optional last step. Points Claude Code itself at the model that was just installed, so the user gets a coding agent running entirely on their own machine.

Offer it. Do not assume it. Most people who ran this skill wanted a chat window, and this step is a different product.

Ollama ships a first class integration for this, so **do not hand over a wall of environment variables**. One command does the wiring. What it does not do is the context length, and that is the part that decides whether any of it works.

## Contents
1. When to offer it, and when not to
2. The easy path: `ollama launch claude`
3. The gate `launch` does not handle: context length
4. The gate: model size, and the cloud escape hatch
5. The manual block, for when `launch` is not available
6. The settings file form
7. Prove it with the CLI
8. How to undo it
9. When it fails

## 1. When to offer it, and when not to

Claude Code talks the Anthropic Messages API. It can point at any server that serves `/v1/messages`, and **Ollama does**, so a local Ollama needs no proxy, no shim and no translation layer.

| Backend | Offer this step |
|---|---|
| Ollama, on its own or under Open WebUI or Odysseus | Yes. Verified working. |
| LM Studio, Goose, AnythingLLM, OpenWork | No. Their local servers speak the OpenAI dialect, and an Anthropic endpoint has not been verified on any of them. Do not print a block that has not been run. |

Verified on 11 August 2026 against Ollama 0.32.5 on an M1 Pro with 16 GB. A direct call returns a well formed Anthropic response, including `thinking` blocks:

```bash
curl -s http://127.0.0.1:11434/v1/messages -H 'content-type: application/json' \
  -d '{"model":"qwen3:0.6b","max_tokens":64,"messages":[{"role":"user","content":"hi"}]}'
# {"id":"msg_...","type":"message","role":"assistant",
#  "content":[{"type":"thinking",...}],"stop_reason":"max_tokens",
#  "usage":{"input_tokens":17,"output_tokens":64}}
```

Run that curl on the user's own version before offering the step. If it does not return `"type":"message"`, their Ollama predates the integration and the fix is to update Ollama, not to build a proxy.

Say the honest version of what they are getting, in one line, before they agree: a local model driving Claude Code is slower and markedly less capable than the hosted one, and it is worth it for privacy, offline work and zero per token cost, not for quality.

## 2. The easy path: `ollama launch claude`

Ollama 0.32.5 configures and starts Claude Code itself:

```bash
ollama launch claude --model qwen3.5
```

That is the whole wiring step. It sets the environment for the child process, so there is nothing for the user to copy, and **it does not modify `~/.claude/settings.json`**. Verified byte identical before and after on 11 August 2026, which is why section 8 has so little to undo.

Worth knowing:

- **`ollama serve` must already be running**, or it exits with `could not connect to ollama server`.
- **It prompts before launching.** `--yes` skips the selectors and pulls the model if needed, and it then requires `--model`. `--config` still asks for confirmation, so it is not a way to inspect the configuration silently.
- **The only state it keeps** is `~/.ollama/config.json`, under `integrations.claude`, recording the models offered and an alias. Nothing else on disk changes.
- **Headless form**, which is also the test in section 7:
  ```bash
  ollama launch claude --model qwen3.5 --yes -- -p "Reply with exactly: local-works"
  ```
  Everything after `--` is passed to `claude`.
- `ollama launch` with no arguments lists the integrations. Claude Code is one of seventeen, so a user who also wants Codex, OpenCode, Cline, Copilot CLI or VS Code on the local model has the same one command for each. Mention that only if they ask.

Ollama's own docs recommend `qwen3.5` for Claude Code, and picking a model with enough context for the repository. Read section 4 before repeating the model advice, because the size floor matters more than the name.

## 3. The gate `launch` does not handle: context length

**`ollama launch claude` does not set the context, and on a machine with under 24 GB the default is far too small. The failure is silent.**

Ollama picks a default from available VRAM. Documented, and matching what was measured:

| Memory | Default context |
|---|---|
| Under 24 GB | 4k |
| 24 GB to 48 GB | 32k |
| 48 GB and up | 256k |

Claude Code's prompt does not fit in 4k, and **Ollama truncates instead of refusing**. Measured on 11 August 2026 on a bare `env -i` run with no project files:

| What | Tokens |
|---|---|
| Claude Code's prompt, first message | 18,323 |
| The same session after one tool call | 26,346 |
| The 16 GB machine's default window | 4,096 |
| What one request actually got | 2,050 |

The server logged the damage as a warning nobody sees:

```
level=WARN msg="truncating input prompt" limit=2050 prompt=18323 keep=4 new=2050
```

It kept 4 tokens of an 18,323 token prompt. The model never saw its tools. Both ways of launching then produced a confident fabrication with **exit code 0** and no error:

- Manual exports: `The file has been successfully created at journal.jsonl.`
- `ollama launch claude`: `The file script.js has been successfully created.`

Neither file was ever created, and nothing in the output suggested a problem. This is the failure to design against, and it is why section 7 tests with the CLI and a sentinel rather than a status code.

Note the fourth row. The window is divided across `OLLAMA_NUM_PARALLEL` slots, which is why a 4,096 window gave one request 2,050 tokens. Pin parallelism to 1 so the whole window goes to the session.

Both variables are read by `ollama serve` at startup, so **the server has to be started with them**. A server already running without them cannot be fixed by setting them afterwards.

This is the block to hand over, and it is what goes on the report page. The user pastes all three lines into one terminal, in this order, and lands in Claude Code:

```bash
OLLAMA_CONTEXT_LENGTH=32768 OLLAMA_NUM_PARALLEL=1 ollama serve > /tmp/ollama.log 2>&1 &
sleep 5
ollama launch claude --model qwen3:8b
```

Verified in exactly this order on 11 August 2026: `n_ctx = 32768`, zero truncation lines, Claude Code running in the foreground with the server in the background. Each part earns its place, so do not simplify it:

- **The `&`** keeps the terminal. Without it `ollama serve` holds the foreground and the third line never runs.
- **The redirect** stops the server log interleaving with Claude Code's interface, and gives a log path for the truncation check in section 7.
- **The `sleep 5`** covers the second or two the server needs to bind. Run `launch` too early and it exits with `could not connect to ollama server`.

**If the first line reports the address is already in use, stop.** Another Ollama is running, the context setting was silently ignored, and `launch` will connect to that server with its own default window. Stop the running one and paste the block again. Do not let this pass: it lands the user in exactly the truncation failure this section exists to prevent, and the symptom is a confident wrong answer rather than an error.

Do not reach for `brew services`, a login item, or anything that makes the server permanent. A Homebrew install has no GUI context slider and no way to pass these variables to a `brew services` launch, so a background service is the one shape of this that cannot carry the setting. The three line block is the answer, not a workaround.

**The floor is 32768.** The prompt measured 18k to 26k with nothing loaded, and it grows with the user's own `CLAUDE.md` files, plugins and skills, so anything less will truncate on a real project rather than on the test. Ollama's docs recommend 64k or higher for repository work.

Sizing it against the machine, because the KV cache is real memory on top of the weights and `scan-my-machine`'s budget counted weights only:

| Machine | Local context to set |
|---|---|
| 16 GB | 32768. A 65536 window plus an 8B model does not fit in the default GPU budget |
| 32 GB | 65536 |
| 48 GB and up | 65536 or higher, and the default may already be enough |

If the machine is tight, `OLLAMA_KV_CACHE_TYPE=q8_0` roughly halves the cache and buys back a larger window. Offer that before suggesting a weaker model: a truncated prompt breaks Claude Code outright, while a smaller window only shortens the conversation.

Tell the user this survives nothing. A server started without these variables is back to 4k and back to inventing answers, which is why the whole block goes on the report page rather than just the `launch` line, and why it is in `handover.md` too.

## 4. The gate: model size, and the cloud escape hatch

**Do not offer this step for a local model under roughly 7B.** Claude Code is a tool calling agent, and a small model cannot hold the tool schemas, the instructions and the conversation at once.

`qwen3:0.6b` did return the sentinel in the verified run, so the plumbing is genuinely proven, but on a second run at the same context it ignored the instruction and recited the contents of the user's `CLAUDE.md` back instead. Same wiring, zero truncation, useless answer. That is what a model does when it cannot separate its instructions from its output, and on real work it produces plausible fabricated tool results rather than refusals. The plumbing test passing does not mean the setup is useful.

State the floor plainly. Around 7B to 8B is where tool calls start landing, and the gap to the hosted models is still wide.

**On a machine too small for a useful local model, say so, and name the cloud option rather than shipping something that will disappoint.** Ollama serves larger models from its own cloud, and `launch` takes them like any other model:

```bash
ollama signin
ollama launch claude --model qwen3.5:cloud
```

`glm-5.1:cloud`, `gemma4:cloud` and `deepseek-v3.1:671b` are in the same catalog. This removes both the memory ceiling and the context problem, because the window is not bounded by the user's RAM.

Be straight about the trade, in one line: this is no longer local. The prompts leave the machine and go to Ollama, so the privacy and offline reasons for the whole exercise no longer apply, and it needs an account. For a user whose goal was privacy, the honest answer is a 7B local model or nothing.

## 5. The manual block, for when `launch` is not available

Use this when the user's Ollama predates `launch`, when they want the values in a config file, or when they ask what the command is actually doing. Prefer section 2 otherwise.

The model ID is the Ollama tag exactly as `ollama list` prints it, including the part after the colon. `qwen3` and `qwen3:8b` are different names, and the wrong one produces a model not found on every message.

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

- **`ANTHROPIC_AUTH_TOKEN`, not `ANTHROPIC_API_KEY`.** Local Ollama checks no credential, but Claude Code needs one present or it runs its first run login instead of connecting. Any non empty string works, so `ollama` is a readable placeholder. Ollama's own docs additionally set `ANTHROPIC_API_KEY=""` to clear a real key that would otherwise take precedence. The API key variable also needs a one time interactive approval and is silently ignored once declined, which reads as a broken setup.
- **`ANTHROPIC_DEFAULT_HAIKU_MODEL` is not optional, and `ANTHROPIC_SMALL_FAST_MODEL` is deprecated.** Background functionality resolves through the haiku variable, so on a one model machine it has to point at that model or background calls ask Ollama for a Claude it does not have.
- **Set `CLAUDE_CODE_SUBAGENT_MODEL` too.** Subagents and workflows resolve their own model and override both the per invocation parameter and a subagent's frontmatter. Unset, they ask for something the machine does not serve.
- **`CLAUDE_CODE_MAX_OUTPUT_TOKENS` has to fit inside the window with the prompt.** Claude Code asks for up to 32,000 output tokens by default, which does not fit alongside a 26k prompt in a 32k window. 8000 against a 65536 window leaves room; against a 32768 window, keep it at 4000.
- **`CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1`** suppresses pre release request fields that a non Anthropic upstream may reject outright.
- **`CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1`** keeps the session on the machine, which is the point of running locally. Two consequences to state: auto updates stop, so the user needs another update path, and WebFetch's domain safety check still calls out, which is turned off separately with `skipWebFetchPreflight`.

`CLAUDE_CODE_MAX_RETRIES=1` plus `--verbose` while setting this up turns a retry loop into one readable error. Leave both out of the block handed over.

Unlike a rented pod, **nothing here expires**. There is no hostname carrying a pod ID and no key living in a server process, so the same block keeps working after a reboot as long as Ollama is running with the context variables set.

## 6. The settings file form

Only when the user asks for it. `ollama launch claude` needs no config file, and a config file is the one form of this that has real consequences, so do not volunteer it.

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

**Warn before writing it, and never write it without asking.** In `~/.claude/settings.json` this makes the local model the default for every project on the machine, including the ones the user expects the hosted Claude to handle. A project's `.claude/settings.json` is the wrong file for the opposite reason: it is committed, and a project scoped `env` block is only read after the first run wizard, so a fresh machine asks the user to log in even though the values are correct. If they want one project only, `.claude/settings.local.json` is gitignored.

## 7. Prove it with the CLI

**Do not hand over anything until Claude Code itself has answered through the local model.** Not a `curl` to `/v1/messages`, and not a model list. Section 3 is the reason: the endpoint returns a clean 200 while feeding the model 4 tokens of its prompt.

Test the block the user is actually being given, server line included, so the thing verified is the thing handed over:

```bash
OLLAMA_CONTEXT_LENGTH=32768 OLLAMA_NUM_PARALLEL=1 ollama serve > /tmp/ollama.log 2>&1 &
sleep 5
env -i HOME="$HOME" PATH="$PATH" \
  ollama launch claude --model qwen3:8b --yes -- -p "Reply with exactly: local-works"
```

`env -i` matters. Without it the operator's own Claude Code credentials leak into the test, the request goes to the hosted API, and a perfect pass proves nothing about the local model. It belongs in the test only, not in the block handed over.

**Then check the server log, every time, because the log is the only honest witness:**

```bash
grep -c "truncating input prompt" /tmp/ollama.log
grep -oE "n_ctx *= *[0-9]+" /tmp/ollama.log | sort -u
```

The count must be `0` and `n_ctx` must be the value that was set. If `n_ctx` reads 4096 when 32768 was asked for, an older server was already running and took the request.

Read the two signals together:

| Sentinel | Truncation lines | Verdict |
|---|---|---|
| Exact | 0 | Pass. Hand it over |
| Missing or padded | Any | The context gate. Section 3, and the run proves nothing |
| Missing or padded | 0 | The wiring is right and the model is too small. Section 4 |

That last row is a real outcome, not a hypothetical: at `n_ctx = 40960` with zero truncation, `qwen3:0.6b` answered by reciting the user's `CLAUDE.md` instead of the sentinel.

Put the real prompt and the real reply on the report page. If the reply carried stray system prompt text, put that on the page too rather than tidying it. It is the honest picture of a small model driving an agent.

## 8. How to undo it

`ollama launch claude` leaves almost nothing behind, so say that plainly: it does not touch `~/.claude/settings.json`, and closing the session is the undo. The only trace is the model list in `~/.ollama/config.json` under `integrations.claude`, which changes nothing about how Claude Code behaves elsewhere.

If the manual block was used instead, closing the terminal is the undo, and `unset ANTHROPIC_BASE_URL ANTHROPIC_AUTH_TOKEN ANTHROPIC_MODEL` reverts the current one. If the values went into a settings file or a shell profile, name the file and the line to delete.

State the tell as well: the model name in Claude Code's status line. If it reads the Ollama tag, the session is local.

## 9. When it fails

| What the user sees | Cause | Fix |
|---|---|---|
| Fluent, confident answers about files and commands that do not exist, exit code 0 | The prompt was truncated. The model never saw its tools | Section 3. `ollama launch` does not fix this. Restart `ollama serve` with both variables and confirm no `truncating input prompt` in the log |
| `could not connect to ollama server` | `ollama serve` is not running | Start it, with the context variables set. It does not survive a reboot unless installed as a service |
| `Launch Claude Code now? requires confirmation` | Non interactive shell | Add `--yes`, which then requires `--model` |
| `claude binary not found` | Claude Code is not installed | `curl -fsSL https://claude.ai/install.sh \| bash` |
| A login prompt, or it connects to the hosted Claude | A real `ANTHROPIC_API_KEY` or a settings file is taking precedence | Settings files beat exports. Check `~/.claude/settings.json`, and clear the API key variable |
| `model not found` on every message | The tag is wrong, or only one alias was set in the manual block | Copy the ID verbatim from `ollama list` into all five model variables |
| `400`, extra inputs are not permitted | A pre release request field was rejected | `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1`, already in the manual block |
| Every message overflows the window | `CLAUDE_CODE_MAX_OUTPUT_TOKENS` plus the prompt exceeds the context | Raise `OLLAMA_CONTEXT_LENGTH`, or lower the output cap to 4000 |
| Correct but unusably slow, or the machine becomes unresponsive | The model plus a large KV cache exceeds memory, so it is swapping | Section 3's sizing table, or `OLLAMA_KV_CACHE_TYPE=q8_0` |
| Tool calls never fire, or loop | The model is too small for agentic work | Section 4. Nothing in the wiring fixes this |
| Cloud model refused | Not signed in | `ollama signin`. And re-state that cloud is not local |
