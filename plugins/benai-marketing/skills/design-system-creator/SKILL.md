---
name: design-system-creator
description: Produces a complete, Claude-Design-compatible design system folder for any brand, ready to upload to Claude Design's "Set up your design system" flow and use across every future asset (websites, landing pages, pitch decks, Instagram/LinkedIn carousels, infographics, emails, ads). Handles two paths: building a brand from scratch (research to synthesis to full system) or extracting the design system from an existing business's shipped assets (website scrape, logos, fonts, past creatives). Use whenever the user wants to stand up a design system from zero, codify a brand they already run but never formalized, set up tokens/typography/color/voice guidelines, build reusable brand assets, or feed a brand kit into Claude Design / Claude Skills / any LLM-assisted asset-creation pipeline. Trigger even if the user says "brand kit," "brand guidelines," "style guide," "brand book," "design language," or "set up my brand for AI," those are all in scope.
disable-model-invocation: true
---

# Design System Creator

Produces a complete, portable **design system folder**: the single source of truth a brand uses for every asset it ships (web, landing pages, pitch decks, Instagram and LinkedIn carousels, emails, infographics, ads). The folder uploads directly to Claude Design's "Set up your design system" flow, feeds any LLM that produces brand assets, and doubles as a living style guide for a design team.

## Step 0: Prerequisite check

Extraction and research run on real scraped data, not invented content. Before asking any discovery question or generating anything, run the diagnostic in [references/setup.md](references/setup.md) to verify the three tools this skill depends on are installed and working: Firecrawl CLI, the extract-design-system skill, and Playwright Chromium.

- All three present: proceed.
- Anything missing: pause, share the install command for that specific tool from [references/setup.md](references/setup.md), and wait for the user to confirm.

Do not silently skip a step when a tool is missing. Inventing color values or logo paths without scraping and rendering defeats the whole point of the skill.

## Step 1: Pick the branch

Once the tools are in place, ask the user exactly **one** question:

> **Are we creating a brand-new design system from scratch, or are we extracting the design system from a business you already run?**

Do not branch, suggest, or assume. Route on their answer:

- New / from scratch / nothing yet: Branch A. Load [references/branch-a-fresh.md](references/branch-a-fresh.md).
- Existing business / existing site / existing brand: Branch B. Load [references/branch-b-extract.md](references/branch-b-extract.md).

If the answer is ambiguous ("we have a logo but nothing else," "we've been running for a year but it's all ad-hoc"), they are almost certainly on Branch B (extraction), because you have real artifacts to work from. Confirm this with them before proceeding.

## What the skill produces

Both branches output a `design-system/` folder at the working-directory root, same tree, content differing by branch. Every file in the tree gets produced. Full folder tree and field-by-field content spec: [references/output-structure.md](references/output-structure.md).

## Asset-fidelity rules (apply on both branches)

Real artifacts beat synthetic recreations every time. Two rules override the "produce every file" instinct:

1. When the user provides shipped assets, copy them into `design-system/assets/templates/` and reference them as the canonical templates. Do NOT recreate them as synthetic SVGs.
2. When you render the logo, render only what is in the source. Do NOT add features.

Full rules, working-directory scan procedure, and logo-diff steps: [references/asset-fidelity.md](references/asset-fidelity.md).

## Non-negotiables (enforced in every system)

Ten design laws make a system feel disciplined rather than generic. Apply them on both branches. If a design choice violates one, push back and propose the on-brand alternative. Full list with reasoning and how-to-apply per rule: [references/non-negotiables.md](references/non-negotiables.md).

## Branch A: Fresh (research, synthesis, generate)

Full workflow: [references/branch-a-fresh.md](references/branch-a-fresh.md). Sequence:

1. Discovery interview: one focused pass covering the business, the 3-second feeling, 3 to 7 reference sites and what draws them to each, anti-references, color instinct, and constraints.
2. Research via Firecrawl: search the category if the user cannot name enough references, then scrape every reference URL. Save each to `brands/<slug>/`.
3. Synthesize a `research/synthesis-and-direction.md` doc ending in the five sign-off questions (color, typography, logo direction, name, component scope).
4. Wait for sign-off on color, typography, logo, and name at minimum.
5. Generate every file from the templates in [assets/templates/](assets/templates/) and the guidance in [references/output-structure.md](references/output-structure.md); render the logo SVGs via [scripts/render.mjs](scripts/render.mjs). All asset templates are synthetic on this branch; flag each one to the user.
6. Finalize: produce the Claude Design form text ([references/claude-design-form.md](references/claude-design-form.md)) and return the folder path plus the form text.

## Branch B: Extract (ingest, reconcile, codify)

Full workflow: [references/branch-b-extract.md](references/branch-b-extract.md). Sequence:

1. Ingest interview: public website URL (required), logo files, fonts used, any shipped assets, a 2-sentence business description, any informal brand rules.
2. Scan the working directory for shipped assets before scraping (see the asset-fidelity rules).
3. Extract from the live site with Firecrawl plus `npx extract-design-system <url>` for independent computed tokens.
4. Reconcile scraped values against uploads and shipped assets; write `research/reconciliation.md` and confirm conflicts with the user.
5. Codify every file, preferring extracted real values over invented ones. Copy real shipped assets per the asset-fidelity rules; interview briefly to fill thin gaps (voice, imagery, motion) rather than inventing rules.
6. Finalize: same hand-off as Branch A, listing which templates are real (copied) vs. synthetic (drafted, pending approval).

## Final deliverable (always produce)

At the end of either branch, output two blocks the user can paste directly into Claude Design's setup form:

1. **Company name and blurb**: under 80 words. Name, what the business does, for whom, and the asset surfaces it will ship.
2. **Any other notes?**: about 200 to 300 words of the most critical non-negotiables plus specific visual/voice overrides that should bias Claude Design's output.

Exact format and worked example: [references/claude-design-form.md](references/claude-design-form.md). Do not skip this. It is the hand-off and the whole point of producing the system.

## Self-improvement

This skill is never finished. Improve it as you use it.
- When the user corrects how a step was done, update the relevant reference file (or this SKILL.md) so the correction sticks. Do not just fix it for this run.
- When a correction is a hard rule ("always X", "never Y"), add it as a permanent rule here.
- When the user says an output was genuinely good, save it to `references/examples/` so it becomes a model for future runs.
- Keep the skill small: when you add something, run the deletion test and cut anything that no longer changes behavior.

## Where to go next

- Prerequisite setup: [references/setup.md](references/setup.md)
- Asset-fidelity rules: [references/asset-fidelity.md](references/asset-fidelity.md)
- Non-negotiables and reasoning: [references/non-negotiables.md](references/non-negotiables.md)
- Branch A playbook: [references/branch-a-fresh.md](references/branch-a-fresh.md)
- Branch B playbook: [references/branch-b-extract.md](references/branch-b-extract.md)
- Output spec: [references/output-structure.md](references/output-structure.md)
- Claude Design hand-off text: [references/claude-design-form.md](references/claude-design-form.md)
- Rendering script: [scripts/render.mjs](scripts/render.mjs)
- Templates (tokens, logo, components, applications, voice): [assets/templates/](assets/templates/)
