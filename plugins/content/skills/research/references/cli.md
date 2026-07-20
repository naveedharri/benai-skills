# Command-Line Interface

Options, output files, and execution behavior for the two scripts.

## Entry point: run_deep_research.py

```bash
python3 scripts/run_deep_research.py "<prompt>" [OPTIONS]
  --no-enhance              Skip enhancement questions
  --model <model>           Model to use (default: o4-mini-deep-research)
  --timeout <seconds>       Timeout in seconds (default: 1800)
  --output-dir <path>       Where to save the prompt file
```

What it does: assesses prompt completeness, asks enhancement questions when needed (see `prompt-enhancement.md`), saves the enhanced prompt to `research_prompt_YYYYMMDD_HHMMSS.txt`, then runs the core script.

## Core client: deep_research.py

Interfaces with the OpenAI Deep Research API. Handles auth via `OPENAI_API_KEY`, request execution, output formatting (report + numbered sources), and automatic markdown saving.

```bash
python3 assets/deep_research.py --prompt-file prompt.txt [OPTIONS]
  --output-file <path>      Custom output file path
  --no-save                 Disable automatic markdown saving (terminal only)
```

## Output files

- `research_prompt_YYYYMMDD_HHMMSS.txt`: enhanced prompt with parameters (reproducibility / audit trail).
- `research_report_YYYYMMDD_HHMMSS.md`: full report with sections, numbered source citations, and a metadata footer (date, model).

## Execution behavior

- Runs synchronously as a blocking subprocess. No polling, no intermediate status checks.
- A run takes 10-20 minutes. Wait silently, then present results once. Do not poll for status; polling wastes tokens for no gain.
