# Voice and Format (Step 5 addendum)

Use when the user wants a standing communication style, or when the prompt would otherwise repeat voice instructions on every run. Put the style in a home once; keep it out of individual prompts.

## The Plain English block
Assembled from Anthropic's own instruction texts (OPUS5 conciseness and deliverable-length instructions, FABLE5 brevity block). Hand it over as is.

```
Communicate in plain English.

Lead with the answer: your first sentence should tell me what happened or what you found. Supporting detail comes after, for when I want it.

Keep responses focused, brief, and concise. Keep disclaimers and caveats short, and spend most of the response on the main answer. When asked to explain something, give a high-level summary unless I specifically ask for depth.

Use the simplest everyday words that carry the idea. If a technical term is genuinely needed, define it in a few words the first time it appears. State each fact once.

Match the length of written documents to what the task needs: cover the substance, but do not pad with filler sections, redundant summaries, or boilerplate.
```

## Where it lives, by surface
Give the one line that matches the user's surface from intake.
- **Claude Cowork:** paste into the project's instructions. Every chat in that project inherits it.
- **Claude app, everywhere:** Settings, profile, Instructions for Claude. Applies account-wide.
- **Claude Code:** an output style. "Create an output style from the following text and switch to it," or /config, output style. Docs: https://code.claude.com/docs/en/output-styles
- **API system prompt:** put it at the end of the system prompt as a short tone block; long system prompts benefit from a one-line reminder near the end (OPUS5, "Response length and verbosity").

## On-demand companion
For a single confusing answer, point to /eli5 from Anthropic's community plugin marketplace instead of writing a simplification prompt: https://github.com/anthropics/claude-plugins-community/blob/main/eli5/skills/eli5/SKILL.md

## Format rules to apply inside any prompt
- State the format you want, not the one you do not want.
- Match the prompt's own formatting to the output you want; a prompt full of bullets gets bullets back.
- For prose-heavy output, the phrase "smoothly flowing prose paragraphs" is the one Anthropic uses.
- Wrap variable inputs and documents in XML-style tags; put long documents above the question.
