---
name: autoresearch
description: Autonomous goal-directed iteration loop that continuously improves prompts, templates, configs, or code. Two evaluation modes — deterministic (eval.py with proxy heuristics) or AI judge (LLM rubric scoring). Uses four-way separation in both modes. Inspired by Karpathy's autoresearch.
---

# AutoResearch — Autonomous Optimization Loop

USE WHEN the user runs `/autoresearch`, says "autoresearch", "optimize this prompt", "improve this overnight", "run an optimization loop", "iterate on this", "auto-improve", or wants to autonomously refine a file against measurable criteria.

---

## Architecture: Separation of Roles

This skill supports two mutually exclusive evaluation modes. Both maintain four-way separation.

### Deterministic Mode (default) — Four-Way Separation

| Role | Who | Knows Eval Code? | Knows Prompt History? |
|------|-----|-----------------|----------------------|
| **Main Agent** | You (optimizer) | **NO** — reads metric number only | Yes — reads logs, plans changes |
| **Eval Agent** | `autoresearch-eval-agent` sub-agent | Yes — writes eval.py | No |
| **Test Runner** | `autoresearch-test-runner` sub-agent | **NO** — fresh context | **NO** |
| **Judge Script** | `eval.py` (deterministic Python) | IS the eval | No |

Metric: `pass_rate`. Best for tasks with clear, mechanical quality checks (word count, format, keywords, structure).

### AI Judge Mode (opt-in) — Four-Way Separation

| Role | Who | Knows Rubric? | Knows Prompt History? |
|------|-----|---------------|----------------------|
| **Main Agent** | You (optimizer) | Criteria names only | Yes — reads logs, plans changes |
| **Eval Agent** | `autoresearch-eval-agent` sub-agent | Yes — writes rubric.md | No |
| **Test Runner** | `autoresearch-test-runner` sub-agent | **NO** — fresh context | **NO** |
| **Judge Agent** | `autoresearch-judge` sub-agent | **Follows rubric** | **NO** — fresh context |

Metric: `quality_score`. Best for creative/subjective tasks where mechanical checks miss the point (tone, authenticity, narrative, emotional resonance).

**The modes are mutually exclusive.** Deterministic mode uses eval.py only. AI judge mode uses the judge agent only. There is no combined score.

Key isolation (both modes):
- The **optimizer** never writes eval artifacts, never generates outputs
- The **eval agent** writes the eval system once (eval.py OR rubric.md), then disappears
- The **test runner** never sees the eval or rubric — fresh context every time
- The **judge** (script or agent) evaluates without knowing iteration history or optimizer intent

---

## User Interaction: Always Use AskUserQuestion

**Whenever you need user input or confirmation, use the `AskUserQuestion` tool.** This shows an interactive popup in Cowork.

**CRITICAL: Keep popup text SHORT.** The popup is small — long text becomes unreadable. Follow this pattern:

1. **Write details in chat FIRST** (assertions list, eval code, explanations)
2. **Then use AskUserQuestion with ONLY a short question** — one sentence max

**Good:**
```
[In chat]: Here are 7 proposed assertions:
1. Covers all 4 search clusters
2. Each entry has title, channel, views
3. Contains opportunity mapping
...

[AskUserQuestion]: "Do these assertions look right?"
Options: "These look good" / "Adjust some" / [free text]
```

**Bad:**
```
[AskUserQuestion]: "Here are 7 proposed assertions for what a 'good' output looks like: 1. Covers all 4 search clusters (Core, Tools, Niche, Competitors)... [giant paragraph]"
```

Never put lists, explanations, or details inside AskUserQuestion. The popup is for the QUESTION only.

---

## The Three Rules

Every criterion — whether proposed by you or provided by the user — MUST pass these three rules before entering the loop. This is the most important step in the process. Bad criteria produce bad evals, and bad evals waste every iteration.

**Rule 1: State the exact condition, not the goal.**
Don't describe what you want. Describe what you can measure.

| Bad | Good |
|-----|------|
| "Make sure the hook is short" | "The first line must be under 136 characters including spaces" |
| "Should be professional" | "Contains no exclamation marks and no ALL CAPS words (3+ letters)" |
| "Include relevant data" | "Contains at least one specific number or statistic with a source" |

**Rule 2: One criterion, one variable.**
Each criterion tests exactly one thing. If you're tempted to use "and" to connect two checks, split them into two separate criteria.

| Bad | Good |
|-----|------|
| "Under 150 words and ends with a question" | Criterion 1: "Under 150 words" / Criterion 2: "Last sentence ends with a question mark" |
| "Professional tone with no jargon" | Criterion 1: "No words from the banned jargon list" / Criterion 2: "No sentences over 25 words" |

**Rule 3: Define the test (optional).**
Describe how to verify the criterion — what to count, what regex to match, what structure to look for. This helps the eval agent write better checks and helps the judge agent score more consistently.

| Criterion | Test definition |
|-----------|----------------|
| "First line under 136 characters" | `len(lines[0]) <= 136` |
| "Contains at least one statistic" | `re.search(r'\d+[%x]?\s', text)` returns a match |
| "Ends with a question" | `text.rstrip().endswith("?")` |

If the user provides criteria that violate The Three Rules, rewrite them — show the user the before/after so they understand the improvement.

---

## When the User Pastes Content

1. Save it to a file in the working directory (e.g., `target-skill.md`)

2. **Explain The Three Rules to the user first.** Before proposing any criteria, write in chat:

   > **The Three Rules** — every criterion must pass these before we start:
   >
   > 1. **State the exact condition, not the goal.** "First line under 136 characters" not "keep the hook short."
   > 2. **One criterion, one variable.** If it has "and", split it into two.
   > 3. **Define the test (optional).** How to check it — what to count, match, or look for.

3. Propose 5-7 quality criteria. **Every criterion MUST pass The Three Rules.** Write the list in chat (not in the popup). For each criterion, show it passes the rules — be specific with thresholds, counts, and patterns.

4. Use `AskUserQuestion` — short text only:
   - Question: `"Do these quality criteria look right?"`
   - Options: `"These look good"` / `"Adjust some"`

5. **SEPARATE STEP — always ask this.** Use `AskUserQuestion`:
   - Question: `"Which evaluation mode?"`
   - Options: `"Deterministic"` / `"AI Judge"`
   - In chat before the question, briefly explain: "Deterministic checks things mechanically (word count, keywords, format). AI Judge uses an LLM to score against a rubric — best for creative content where quality is subjective (tone, authenticity, narrative)."

6. **SEPARATE STEP — always ask this.** Use `AskUserQuestion`:
   - Question: `"How many iterations? (Recommended: 5)"`
   - Options: `"5 (recommended)"` / `"10"` / `"20"`
   - In chat before the question, briefly explain: "Each iteration edits the prompt, generates outputs with real tools, and evaluates. 5 iterations is a good starting point — you can always run more later."
   - Store the chosen iteration count for the loop's stop condition.

7. **Spawn the `autoresearch-eval-agent` sub-agent** to generate the eval system:
   - Pass it: the target prompt/skill path, the confirmed criteria list, the working directory, and **the chosen eval mode (deterministic or ai_judge)**
   - **Deterministic**: it generates `eval.py` and `test_cases.json`
   - **AI Judge**: it generates `rubric.md` and `test_cases.json` (no eval.py)
   - **You (the optimizer) do NOT read the eval artifacts.** You only read their output (metric numbers and criteria names).

8. Show the user the generated eval.py (deterministic) or rubric.md (AI judge) in chat. Then use `AskUserQuestion`:
   - Question: `"Does this eval look right?"`
   - Options: `"Looks good"` / `"Adjust"`

9. Mark the eval artifacts as **READ-ONLY** — you MUST NOT modify them during the loop:
   - Deterministic: `eval.py` + `test_cases.json`
   - AI Judge: `rubric.md` + `test_cases.json`

10. Run baseline (iteration 0): generate outputs via test runner (always live — using real tools and data), then evaluate (run eval.py or spawn judge agent), record the score

11. Start the loop — stop after the chosen iteration count

If the user says "improve this" without criteria, suggest 5 reasonable ones (all passing The Three Rules) and use `AskUserQuestion` to confirm.
If the user says "go" or "start", default to deterministic mode + 5 iterations, spawn the eval agent, and begin immediately.

---

## Phase 0: Session Setup

When the user pastes a skill, prompt, or template:

1. Save it to a file (e.g., `target-skill.md`)
2. Analyze the content and propose 5-7 quality criteria
3. Ask the user to confirm or adjust
4. Confirm the session config:

| Field | Description | Example |
|-------|-------------|---------|
| **Goal** | What are we optimizing? | "Improve cold email reply-rate signals" |
| **Eval Mode** | `deterministic` or `ai_judge` | `deterministic` |
| **Metric** | `pass_rate` (deterministic) or `quality_score` (AI judge) | `pass_rate` |
| **Direction** | Higher is better | `higher` |
| **Criteria** | The quality checks (confirmed by user) | "Under 150 words", "Contains a question CTA" |
| **Modifiable File** | The prompt/skill file ONLY | `target-skill.md` |
| **Guard** | Optional regression check | None |

---

## Phase 1: Generate the Eval System (via Eval Agent Sub-Agent)

Before any optimization begins, spawn the `autoresearch-eval-agent` sub-agent:

**Deterministic mode:**
```
Design an eval system for the prompt/skill at [path to target skill].
Eval mode: Deterministic.

Assertions (confirmed by user):
1. [assertion 1]
2. [assertion 2]
...

The prompt expects these inputs: [list input fields from the prompt].
Save eval.py and test_cases.json to [working directory path].
```

**AI Judge mode:**
```
Design an eval system for the prompt/skill at [path to target skill].
Eval mode: AI Judge.

Quality criteria (confirmed by user):
1. [criterion 1]
2. [criterion 2]
...

The prompt expects these inputs: [list input fields from the prompt].
Save rubric.md and test_cases.json to [working directory path].
```

The eval agent will:
- **Deterministic**: generate `test_cases.json` + `eval.py` (deterministic Python with proxy heuristics), verify no syntax errors
- **AI Judge**: generate `test_cases.json` + `rubric.md` (scoring rubric with 1-5 scale per criterion)

**IMPORTANT: You (the optimizer) MUST NOT read the eval artifacts in detail.** You only interact with them by running the evaluation and reading the output (metric number and criteria names). This prevents you from gaming the evaluation.

After the eval agent finishes:
- Show the user the generated eval.py or rubric.md (read it for them to review) and ask: "Does this eval capture what you mean?"
- If the user wants changes, spawn the eval agent again with adjustments
- Once the user confirms, **the eval artifacts are READ-ONLY for the rest of the session**

See `references/example-eval.py` for what a generated eval.py looks like.

---

## Phase 2: Baseline (Iteration 0)

1. Create the `outputs/` directory
2. **Spawn the `autoresearch-test-runner` sub-agent** with this prompt:
   ```
   Generate outputs using the prompt at [path to target skill].
   Test cases are at [path to test_cases.json].
   Save each output to outputs/output_00.txt through outputs/output_09.txt (zero-padded index matching test case order).
   Follow the prompt exactly. One output per test case. No commentary — just the raw output in each file.
   ```
   **IMPORTANT: Output file naming must be `output_XX.txt` (zero-padded index).** Both the eval agent (when writing eval.py) and the test runner must use this convention. If eval.py uses a different naming scheme, the files won't be found.
3. **Evaluate:**
   - **Deterministic**: Run `python eval.py outputs/`, parse the `METRIC pass_rate=X.XXXX` line from stdout
   - **AI Judge**: Spawn the `autoresearch-judge` sub-agent against `outputs/` + `rubric.md`, parse `quality_score` from `judge-scores.json`
4. Record as the baseline in `autoresearch-log.jsonl`
5. Create the initial `autoresearch-dashboard.html` (use template from `references/dashboard-template.html`)

---

## Phase 3: The Loop (Repeat)

Each iteration follows this exact sequence:

### Step 1 — Review
- Read the current state of the modifiable file
- Read the last 5 entries from `autoresearch-log.jsonl`
- Read `autoresearch-ideas.md` if it exists
- Read the failure details from the last eval run
- Identify patterns: which criteria score lowest? Which test cases are hardest?

### Step 2 — Ideate
- Pick ONE idea to try this iteration
- The idea must be atomic — one change, one hypothesis
- Write the hypothesis in plain English before making the change
- Target the weakest area from the last eval

### Step 3 — Modify
- Save a backup: copy the modifiable file to `[filename].backup`
- Make exactly ONE change to the modifiable file

### Step 4 — Execute Prompt (via Test Runner Sub-Agent)
- **Before spawning**, scan the target skill file for any references to other files (e.g., `references/`, linked files, imported data). List all file paths the skill depends on.
- **Spawn the `autoresearch-test-runner` sub-agent** with:
  ```
  Execute the prompt at [path to target skill].
  Test cases are at [path to test_cases.json].
  The working project is at [project path].

  Reference files the prompt depends on (read these first):
  - [path to references/file1.md]
  - [path to references/file2.md]
  - [... list ALL referenced files]

  Use all available tools (web search, file access, APIs) to produce real outputs.
  Save each output to outputs/output_00.txt through outputs/output_[N].txt.
  Follow the prompt exactly. One output per test case. No commentary.
  ```
- **IMPORTANT: Always pass reference file paths explicitly.** The test runner has fresh context — it cannot resolve relative paths or guess where files are. Scan the skill for patterns like `references/`, `see also`, file paths, `[[wikilinks]]`, or any mentions of other files, and pass their full absolute paths.
- The sub-agent runs the prompt **live with real tools** — not mocked
- It has **fresh context** — it does not know:
  - What the eval checks for
  - What iteration we're on
  - What changes were made
  - What the optimization goal is
- **You (the optimizer) MUST NOT generate outputs yourself. Always use the sub-agent.**

### Step 5 — Evaluate
- **Deterministic mode**: Run `python eval.py outputs/`, parse the `METRIC pass_rate=X.XXXX` line. If eval.py crashes, mark this iteration as "crash".
- **AI Judge mode**: Spawn the `autoresearch-judge` sub-agent with:
  ```
  Score the outputs in [path to outputs/] against the rubric at [path to rubric.md].
  Save your scores to judge-scores.json in the working directory.
  ```
  The judge agent has **fresh context** — it does not know iteration count, prompt changes, or optimization goals. Parse `quality_score` from `judge-scores.json`.

### Step 6 — Guard Check (if guard is set)
- Run the guard check
- If the guard fails, this iteration is automatically "discard"

### Step 7 — Decide
| Condition | Action |
|-----------|--------|
| Metric improved (`pass_rate` or `quality_score`) | **KEEP** — the change stays, update `.backup` to the new version |
| Metric same or worse | **DISCARD** — restore from `.backup` |
| Eval crashed | **CRASH** — restore from `.backup`, note the error |

### Step 8 — Log
- Append a line to `autoresearch-log.jsonl` (see JSONL format below)
- Update `autoresearch-worklog.md` with a human-readable entry
- Update `autoresearch-dashboard.html` with current stats

### Step 9 — Repeat
- Go back to Step 1
- If stuck (3+ discards in a row on similar ideas), try a radically different approach
- If the user sends a message, pause the loop, respond, then resume

---

## The Separation Rules

**Rule 1: You are the optimizer. You NEVER generate outputs, write eval code, or score quality.**
- You edit the prompt, read metrics, decide keep/discard
- You spawn the test runner sub-agent to produce outputs
- You spawn the eval agent sub-agent to write eval.py or rubric.md (Phase 1 only)
- In AI judge mode, you spawn the judge agent each iteration
- You do NOT read eval.py source code or rubric.md scoring details

**Rule 2: The eval agent writes the eval system once, then disappears.**
- It receives the criteria and the prompt
- Deterministic: it generates eval.py + test_cases.json
- AI Judge: it generates rubric.md + test_cases.json
- It is NEVER called again during the loop
- The optimizer never sees how the heuristics or scoring examples are implemented

**Rule 3: The test runner sub-agent NEVER sees the eval or rubric.**
- It gets fresh context each time
- It only receives: the prompt file path + test cases path
- It does not know what criteria exist, what the eval checks for, or what the rubric scores on

**Rule 4: The judge is READ-ONLY.**
- Deterministic: `eval.py` is the judge. Run it and read the number. Never modify it.
- AI Judge: `rubric.md` is the judge's instruction. Never modify it.
- `test_cases.json` is always READ-ONLY.

**Rule 5: The judge agent NEVER sees iteration history (AI judge mode).**
- It gets fresh context each time
- It only receives: the output files + rubric.md
- It does not know what iteration we're on, what changes were made, or what the optimization goal is
- It scores purely against the rubric

---

## State Files

All state lives in the working directory:

| File | Modifiable? | Purpose |
|------|------------|---------|
| Target skill/prompt file | **YES** | The file being optimized |
| `eval.py` | **NO — READ-ONLY** (deterministic only) | The deterministic judge script |
| `rubric.md` | **NO — READ-ONLY** (AI judge only) | LLM judge scoring rubric |
| `test_cases.json` | **NO — READ-ONLY** | Test inputs |
| `outputs/` | Overwritten each iteration (by test runner) | Generated outputs for eval |
| `judge-scores.json` | Overwritten each iteration (AI judge only) | LLM judge scores |
| `autoresearch-session.md` | No | Session config (includes eval mode) |
| `autoresearch-log.jsonl` | Append-only | Machine-readable log |
| `autoresearch-worklog.md` | Append-only | Human-readable narrative |
| `autoresearch-dashboard.html` | Rewritten each iteration | Live visual dashboard |
| `autoresearch-ideas.md` | Yes | Backlog of ideas |

### JSONL Log Format

**Deterministic mode:**
```json
{"iteration": 1, "timestamp": "2026-04-01T10:30:00Z", "hypothesis": "Add urgency word to subject line", "metric_name": "pass_rate", "metric_value": 0.70, "baseline": 0.50, "best_so_far": 0.70, "delta": "+0.20", "eval_mode": "deterministic", "assertion_breakdown": {"word_count": 10, "no_buzzwords": 9, "has_question": 7}, "guard_pass": true, "status": "keep"}
```

**AI Judge mode:**
```json
{"iteration": 1, "timestamp": "2026-04-01T10:30:00Z", "hypothesis": "Add personal story opener", "metric_name": "quality_score", "metric_value": 0.72, "baseline": 0.50, "best_so_far": 0.72, "delta": "+0.22", "eval_mode": "ai_judge", "rubric_breakdown": {"emotional_resonance": 3.8, "authenticity": 3.2, "narrative_arc": 3.5}, "guard_pass": true, "status": "keep"}
```

Deterministic logs include `assertion_breakdown` (per-assertion pass counts). AI judge logs include `rubric_breakdown` (average scores per criterion). Both help target the weakest areas.

Status values: `baseline`, `keep`, `discard`, `crash`, `no-op`

---

## Dashboard

Use the template at `references/dashboard-template.html`. On every iteration, rewrite the full HTML file with updated values:

1. **Header stats** — goal, iterations count, current best, baseline, improvement %
2. **Status counts** — keep/discard/crash totals
3. **Progress bar** — visual fill based on current best vs 1.0
4. **Criteria breakdown** — which assertions are passing/failing (deterministic) or which rubric criteria score lowest (AI judge)
5. **Iteration history table** — last 10 iterations with hypothesis, metric, delta, status
6. **Status badge colors** — green for keep, red for discard, orange for crash

---

## Git Integration

### If Git Is Available
- Create branch `autoresearch/[goal-slug]-[date]` before starting
- Commit on every "keep" iteration
- `git checkout -- [file]` on every "discard" iteration

### If Git Is NOT Available
- Before each modification, copy the file to `[filename].backup`
- On discard, restore from `.backup`
- On keep, update `.backup` to the new version

---

## Stopping

The loop runs until:
- The user says "stop" or "pause"
- The chosen iteration count is reached
- The metric plateaus (no improvement in 10+ consecutive iterations)

When stopping, write a final summary to `autoresearch-worklog.md` with:
- Total iterations run
- Best metric achieved vs baseline
- Top 3 most impactful changes
- Which criteria improved most
- Ideas that were never tried (saved to `autoresearch-ideas.md`)

---

## Critical Rules

1. **ONE change per iteration.** Never bundle multiple ideas.
2. **NEVER generate outputs yourself.** Always use the `autoresearch-test-runner` sub-agent.
3. **NEVER write eval artifacts yourself.** Always use the `autoresearch-eval-agent` sub-agent.
4. **NEVER read eval.py source code** (deterministic). You only run it and read its stdout.
5. **NEVER score quality yourself** (AI judge). Always use the `autoresearch-judge` sub-agent.
6. **Eval artifacts are READ-ONLY.** Never modify eval.py, rubric.md, or test_cases.json during the loop.
7. **Always revert on discard.** Never accumulate failed changes.
8. **Log everything.** Even crashes and no-ops get logged.
9. **Don't ask permission mid-loop.** Only pause if the user messages you.
10. **Respect the modifiable files list.** Only the target skill/prompt can be edited.
11. **Stuck detection.** After 3 consecutive discards on similar ideas, pivot radically.
12. **No cherry-picking.** Run the full eval every time, not a subset of test cases.
13. **Read the failure details.** Use assertion breakdown (deterministic) or rubric breakdown (AI judge) to target your next change.
