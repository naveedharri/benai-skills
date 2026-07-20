# Requirements and Troubleshooting

## Requirements
- Python 3.7+
- OpenAI API key via `OPENAI_API_KEY` env var or a `.env` file in the working directory
- Internet connection (web search)
- 30+ minutes available for completion (timeout is configurable)

## Errors and fixes

### Missing OPENAI_API_KEY
Error: "Missing OPENAI_API_KEY"
Fix: `export OPENAI_API_KEY="your-key"`, or add `OPENAI_API_KEY=your-key` to a `.env` file in the working directory.

### deep_research.py not found
Error: "Could not find deep_research.py"
Fix: confirm the skill installed with its assets. The script searches: skill assets folder, then current directory, then parent directory.

### Research timeout
Error: request times out after 30 minutes.
Fix: raise the timeout (`--timeout 5400` for 90 minutes), narrow the prompt to reduce scope, or run during off-peak hours.

### Interrupted run
The saved `research_prompt_*.txt` file remains. Re-run against it to retry without re-answering enhancement questions.
