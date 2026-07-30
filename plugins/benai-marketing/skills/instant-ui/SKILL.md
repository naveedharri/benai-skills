---
name: instant-ui
description: Build a BenAI-branded HTML page in the neo-brutalist instant-ui design language (cream background, near-black ink, 3px hard borders, 6px zero-blur shadows, a blue/green/amber gradient stripe, system font plus SF Mono, weight-900 headings). Use for any BenAI landing page, offer, sales, or pricing page, onboarding or intake form, partner page, case study, playbook, toolkit, or internal doc that must look like it came off the same line as the BenAI Champion Offer assets. Reproduces that visual language 1:1 with a fixed token set and a 20-component library. Triggers include "instant-ui", "benai ui", "benai brand page", "build a benai page", "make this look like benai", "on-brand landing page", "branded form", "benai landing", "champion offer page". Not for dark HUD dashboards (route to personal-ui) or non-BenAI clients (route to client-docs).
disable-model-invocation: true
argument-hint: "[what to build, e.g. 'pricing page for new tier' or 'onboarding form for partners']"
---

# Instant UI (BenAI Brand)

Build a single self-contained HTML page in the BenAI neo-brutalist design language. Every output must match the BenAI Champion Offer assets 1:1, as if it came off the same assembly line.

## Steps

1. **Confirm scope.** If `$ARGUMENTS` is empty or vague, ask for: page name, page type (landing / form / product / pricing / case study / doc / run report), primary CTA, and the real copy. This brand is content-first: never write marketing filler. If copy is missing, stop and ask.

   **Unattended exception.** If the caller says it is running unattended, do not ask anything. Build from the content given, render any missing section as an explicit gap, and never invent copy to fill it. A scheduled routine calling this skill cannot answer a question, so a question means no page gets made at all.
2. **Load the tokens.** Read `references/design-tokens.md` and paste the `:root` block plus typography rules verbatim. Never hand-type tokens.
3. **Build the shell.** Read `references/page-shell.md` for the required page wrapper, the BenAI smiley SVG (header and footer), and the responsive breakpoints. Every page opens with the 4px blue/green/amber gradient stripe.
4. **Assemble components.** Read `references/components.md` and copy the CSS and HTML for each block the page needs (20 components: pills, buttons, hero, stat strips, sections, cards, VS grids, timeline, testimonial, pricing, CTA, footer, forms). Copy verbatim, swap the copy, do not improvise.
5. **Apply the rules.** Read `references/build-rules.md` for the voice rules, hard build constraints, error-handling routes, and the after-build checklist. Run the checklist before confirming the output.
6. **Save and confirm.** Write to the output path the caller gave you. If none was given, default to `~/Desktop/builds/[page-name].html` (kebab-case). Add the kicker comment `<!-- instant-ui v1 -->` at the top. Report the file path and open it for the user to review, unless running unattended, in which case just report the path.

A minimal starter is at `templates/starter.html`. A full reference page using every token and component is at `references/examples/reference-page.html`.

## Self-improvement

This skill is never finished. Improve it as you use it.

- When the user corrects how a step was done (a token value, a component detail, a rule), update the matching reference file (`design-tokens.md`, `page-shell.md`, `components.md`, or `build-rules.md`) so the correction sticks. Do not just fix it for this run.
- When a correction is a hard rule ("always X", "never Y"), add it to the build rules in `references/build-rules.md`.
- When the user says a page was genuinely good, save it to `references/examples/` so it becomes a model for future runs.
- Keep the skill small: when you add something, cut anything that no longer changes what the agent does.
