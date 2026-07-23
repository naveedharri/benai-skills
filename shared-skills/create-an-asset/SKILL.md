---
name: create-an-asset
description: Generate tailored sales assets (landing pages, decks, one-pagers, workflow demos) from your deal context. Describe your prospect, audience, and goal, get a polished, branded asset ready to share with customers.
disable-model-invocation: true
---

# Create an Asset

Generate custom sales assets tailored to prospect, audience, and goal. Four formats: interactive landing page, deck-style, one-pager, workflow/architecture demo. Works for any seller, any product, any prospect.

## Triggers

Invoke this skill when:
- User says `/create-an-asset` or `/create-an-asset [CompanyName]`
- User asks to "create an asset", "build a demo", "make a landing page", "mock up a workflow"
- User needs a customer-facing deliverable for a sales conversation

## Steps

### Step 1: Collect context

Read `references/context-collection.md`. Detect seller context from the user's email domain, then collect the four inputs: (a) prospect, (b) audience, (c) purpose, (d) format. Parse what the user already gave before asking. If the format is a workflow demo, also collect components, flow, human touchpoints, and an example scenario (covered in the same file).

### Step 2: Research the prospect

Read `references/research.md`. Assess context richness (rich / moderate / sparse) and run the matching research pass: prospect basics, leadership, and brand colors always; industry, tech stack, and competitive context when context is moderate or sparse; conversation analysis when transcripts or materials were uploaded.

### Step 3: Decide the structure

Read `references/format-selection.md`. Pick sections, slides, or demo layers for the chosen format based on purpose and audience. If the format is a workflow demo, also read `references/workflow-demo.md` for component definitions, flow steps, and scenario narrative.

### Step 4: Ask clarifying questions (required)

Read `references/clarifying-questions.md`. Summarize your plan back to the user, ask the standard questions plus the format-specific ones, and confirm before building. Max 2 rounds; if still ambiguous, make a reasonable choice and say so.

### Step 5: Generate content

Read `references/content-templates.md`. Write every section using the templates and the general principles (their pain points, their language, explicit product-to-need mapping, proof points). For workflow demos, use `references/workflow-demo.md` for components, steps, and narrative.

### Step 6: Apply visual design

Read `references/visual-design.md`. Apply the color system (prospect brand colors by default), typography, and element styles. For workflow demos, `references/workflow-demo.md` has the node, arrow, canvas CSS and icon mappings.

### Step 7: Build, deliver, iterate

Read `references/delivery.md`. Build a single self-contained HTML file, run the quality checklist, deliver with the delivery message (summary, deployment options, customization offers), then handle iteration requests per the iteration table.

## Self-improvement

This skill is never finished. Improve it as you use it.

- When the user corrects how a step was done, update the relevant reference file (or this SKILL.md) so the correction sticks. Do not just fix it for this run.
- When a correction is a hard rule ("always do X", "never do Y"), add it as a permanent rule here.
- When the user says an output was genuinely good, save it to `references/examples/` so it becomes a model for future runs.
- Keep the skill small while you do this: when you add something, run the deletion test and cut anything that no longer changes behavior.
