---
name: call-prep
description: Prepare for sales calls and output a live, shareable BenAI-branded dashboard (not a chat brief). Researches every attendee and company via web, Attio CRM, Gmail, and Fireflies, then deploys a neo-brutalist "command center" dashboard to a live URL. Works for one call or a whole day. Trigger with "prep me for my call with [company]", "call prep", "prep all my calls today", "get me ready for [meeting]", or "/call-prep".
disable-model-invocation: true
---

# Call Prep → Live Dashboard

Prep any sales call (or a whole day of them) and hand back **one shareable live dashboard URL**. This is a hybrid: the research depth of call prep, rendered in the BenAI `instant-ui` design language. The dashboard is the deliverable, never a markdown brief pasted into chat.

> [!important] Non-negotiable output
> Every run ends with a **deployed, shareable dashboard URL** in the BenAI design system defined in `references/dashboard-template.html`. Build by cloning that template, not from scratch. Report the URL first.

## Workflow

### 1. Find the calls
- If the user names a call/company, use that. If they say "today" / "my calls", pull the calendar (calendar connector or `gws calendar`) for that day and list every **external** meeting. Exclude internal syncs (team standups, 1:1s with colleagues).
- Confirm scope only if genuinely ambiguous (e.g. many calls and unclear which). Otherwise proceed.

### 2. Research every call (parallel)
For multiple calls, **fan out one sub-agent per call in parallel** (Agent tool, `general-purpose`, run in background). Each agent researches its call and returns a compact brief. For a single call, do it inline.

Per call, pull from whatever is connected, and skip gracefully what is not:
- **Web + LinkedIn**, who the person is, the company (what they do, size, industry, recent news/funding), attendee roles. (WebSearch / WebFetch)
- **Attio CRM**, existing record, deal stage, budget band, notes. Load: `ToolSearch "select:mcp__7320cfa0-48c2-49b9-8bd6-96fe9605dabd__search-records,...__list-records,...__list-lists"`.
- **Gmail**, recent threads with the attendees/domain: open questions, commitments, whether a proposal or recap was sent. Use `gws gmail search "<domain>"` (Bash).
- **Fireflies**, prior call transcript/recap if the meeting already ran. Load: `ToolSearch "select:mcp__plugin_benai-suite_fireflies__fireflies_search,...__fireflies_get_transcript"`.

Each brief must classify the call's **stage** (see color map below) and surface any **action flag** (unsent proposal, save situation, no-show to acknowledge, qualification risk).

### 3. Build the dashboard
- Read `references/dashboard-template.html` and clone it. It carries the full design system verbatim: cream canvas, 3px hard borders, 6px hard shadows, gradient top stripe, system font + SF Mono, weight-900 headings, and the **correct BenAI logo**.
- Fill it in:
  - **Header**, title "Sales Call Prep", date chip. Correct logo only.
  - **Hero**, the boxed title + a one-line plain subtitle (date + "all times [TZ]") + a 4-up stat strip (calls today, in closing motion, saves needed, action items). **No green-dot eyebrow. Ever.**
  - **Priorities strip**, the 2-4 things to do before the calls (from the action flags). Skip the section only if there are genuinely none.
  - **One card per call**, clone the `.call` card. Each: time, stage badge, contact + company, a one-line status flag where relevant, the play, top 3 questions, 2-3 objections with responses. Same layout for one call (single card) or many (grid).
- Stage color map (card top bar + badge): **save = red**, **close / warm = green**, **discovery = blue**, **qualify / recovery = amber**.

### 4. Deploy to a live URL
- Save the file to `~/Desktop/builds/benai/call-prep-<date>.html`.
- **Publish as an Artifact** (default-private, safe for prospect PII, gives a claude.ai share link the user controls). Use Vercel only if the user explicitly asks for a public URL.
- To update an existing day's dashboard, republish the same file path (keeps the URL).

### 5. Save the source + report
- Save the compiled markdown behind the dashboard to `Team/BenAI/Profiles/Aryan/Sales-OS/Calls/<date>-call-prep-pack.md` (Obsidian syntax, wikilinks, frontmatter) as the durable record.
- **Lead the reply with the live URL**, then a short priorities summary and an at-a-glance table.

## Hard rules (from user feedback)

1. The output is **always a deployed dashboard URL**, one call or many. Never stop at a chat brief.
2. Use the **real BenAI logo**: a circle + a single U-shaped smile. **No eyes, no wide grin.** Markup is in the template; never alter it.
3. **No AI-tell hero eyebrow**, never the `● NAME · DATE · META` mono line with a colored dot. Put context in the header or subtitle instead.
4. **No em dashes** in copy. No marketing cliches ("leverage", "unlock", "transform", "seamless", "cutting-edge"). Plain, specific, builder-voice.
5. Headings weight 900. All numbers/times/money in SF Mono. Hard borders and shadows only, no rounded corners, no blur.
6. Everything grounded, web, Attio, Gmail, Fireflies. If a source is empty, say "nothing found", never invent history.

This skill shares its design language with the `instant-ui` skill. If the brand system there changes, mirror it into `references/dashboard-template.html`.

## Self-improvement

This skill is never finished. Improve it as you use it.

- When the user corrects how a step was done, update the relevant reference file (or this SKILL.md) so the correction sticks. Do not just fix it for this run.
- When a correction is a hard rule ("always do X", "never do Y"), add it as a permanent rule here.
- When the user says an output was genuinely good, save it to `references/examples/` so it becomes a model for future runs.
- Keep the skill small while you do this: when you add something, run the deletion test and cut anything that no longer changes behavior.
