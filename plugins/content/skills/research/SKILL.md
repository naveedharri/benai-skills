---
name: research
description: "Run deep, internet-enabled research on any topic to gather the raw material for content. First step of the content pipeline that feeds /linkedin and /newsletter. Automates prompt enhancement through clarifying questions, saves parameters for reproducibility, and executes web-enabled deep research via the OpenAI Deep Research API. Use when the user asks to research a topic, gather sources, investigate a subject, or build the foundation for a post or newsletter."
disable-model-invocation: true
---

# Deep Research

Turns a research request into a comprehensive, sourced report using the OpenAI Deep Research API. The orchestration script assesses the prompt, enhances it through clarifying questions when needed, saves the exact prompt for reproducibility, runs the research, and saves a markdown report with numbered sources.

## Steps

1. Accept the user's research request (brief or detailed).

2. Decide whether to enhance. If the prompt is brief or generic, ask the 2-3 clarifying questions in `references/prompt-enhancement.md` (present numbered options plus a free-text option) and build the enhanced prompt. Skip when the prompt is already specific.

3. Confirm the final prompt with the user before executing. A run costs API spend and takes 10-20 minutes, so get a yes on the enhanced prompt first.

4. Run the orchestration script:
   ```bash
   python3 scripts/run_deep_research.py "<prompt>"
   ```
   It re-runs the enhancement check, saves `research_prompt_*.txt`, and executes synchronously. Options and output files are in `references/cli.md`. Wait silently for completion; do not poll for status.

5. Present results: the markdown report (`research_report_*.md`), the numbered source URLs, and the saved file paths. Offer follow-up research directions.

## Routing
- `references/prompt-enhancement.md`: when to enhance, the question templates (technical vs general), how to build the enhanced prompt, worked examples.
- `references/cli.md`: script options, output files, execution behavior.
- `references/troubleshooting.md`: requirements and error fixes (missing API key, script not found, timeout).

## Self-improvement
This skill is never finished. Improve it as you use it.
- When the user corrects how a step was done, update the relevant reference file (or this SKILL.md) so the correction sticks. Do not just fix it for this run.
- When a correction is a hard rule ("always X", "never Y"), add it as a permanent rule here.
- When the user says a research report was genuinely good, save it to `references/examples/` so it becomes a model for future runs.
- Keep the skill small: when you add something, run the deletion test and cut anything that no longer changes behavior.
