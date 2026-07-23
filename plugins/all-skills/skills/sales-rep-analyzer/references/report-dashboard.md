# Phase 3: Report Dashboard Spec

The output is a single, self-contained **HTML dashboard** built in the **BenAI neo-brutalist design system**, not a .docx. Read the embedded guides first and follow them: `references/instant-ui/design-tokens.md`, `references/instant-ui/page-shell.md`, `references/instant-ui/components.md`, and `references/instant-ui/build-rules.md`, paste the `:root` tokens verbatim, and run the after-build checklist. Save to `~/Desktop/builds/benai/[rep]-[topic]-[date].html`, then publish with the Artifact tool for a shareable URL. Only produce a .docx if the user explicitly asks for one.

## What the Dashboard Covers

- **Overall grade, visible at the top**, a big boxed grade medallion in the hero (per call). Never buried in a header corner.
- **Grades at a glance**, a per-metric bar plot mapping each dimension to its 0–100 score and letter grade, plus a "by the numbers" band (composite, top/weakest metric, A-range count, deal value, close rate).
- **Performance scorecard** with letter grades across 8-10 dimensions (e.g., Discovery, Objection Handling, Closing, Urgency, Follow-up)
- **Per-prospect journey analysis** showing the full arc from first meeting through outcome, cross-referenced with CRM stage data
- **Evidence section for each grade** with real quotes pulled from transcripts, both strengths and weaknesses
- **Deal outcome correlation**, what the rep does differently on won vs. lost deals
- **Confirmed closed/lost deal table** with evidence from both transcripts and CRM
- **Coaching recommendations** prioritized by impact, with specific examples of what to do differently
- **Methodology note** explaining data sources and any limitations (rate-limited transcripts, missing CRM fields, etc.)

The report reads like something a VP of Sales or sales coach would write after shadowing the rep for a month, grounded in evidence, not generic advice.

## Non-negotiables (locked from user feedback)

1. **Overall grade of every call is visible at the very top.** Put it in a big boxed **grade medallion** in the hero: black box, amber-pale letter grade (~86px, SF Mono), hard border plus `6px 6px 0` shadow, gradient stripe on top, and the composite score `NN/100` under it. Never leave the grade only in the header/top-right, that is not visible enough. For a **multi-call** report, every prospect/call card leads with its own large grade badge before any prose.
2. **More numbers, less prose.** Lead with a 4-up `hero-stats` strip and a "by the numbers" band: composite score, top metric, weakest metric, count of A-range metrics, deal value, stakeholders, close rate. All numerals in SF Mono.
3. **Plot every metric against its grade.** Include a **"Grades at a Glance" bar plot**: one row per dimension, a hard-bordered bar whose width equals the 0–100 score, colored by band (green A / blue B / amber C), the score inside the bar, and the letter grade at the right. Foot the plot with the composite and the score range. A legend maps color to band.

## Letter → score mapping (drives bar widths + composite)

`A+ 98 · A 96 · A- 92 · B+ 88 · B 84 · B- 80 · C+ 76 · C 72 · C- 68 · D 60 · F 40`. Bar width % = the score. Composite = mean of the dimension scores (label it "weighted" if you outcome-weight the overall grade above the raw mean, and keep the two reconciled).

## Dashboard structure (sections, in order)

1. **Header**, BenAI smiley (circle + single U-smile, NO eyes) + "Rep Analyzer · [rep] · [period]"; grade also shown in header meta.
2. **Hero**, title, one-paragraph summary, `s-label` tags (outcome / source / sample size), the **overall grade medallion**, and the 4-up `hero-stats` strip. No `.cover-pre` green-dot eyebrow (build rule 9).
3. **Grades at a Glance**, the per-metric **bar plot** plus the "by the numbers" band.
4. **Performance Scorecard**, every dimension as a card: grade chip + one-line verdict + evidence. 8–10 dimensions.
5. **Signature Moment**, a dark slab with the single most important verbatim quote (the line that won or lost the deal).
6. **Call Arc**, a 4-step timeline of how the call/engagement actually ran.
7. **Keep vs. Fix**, a VS grid: the winning motion vs. the leaks, with verbatim quotes on the fix side.
8. **Coaching Playbook**, numbered system-cards ranked by impact, each with a concrete "Fix:" line and an impact chip.
9. **Deal Outcomes**, for multi-call, a card/row per prospect: status (Won/Lost/Open), value, evidence source, confidence.
10. **Scope & Methodology**, what's graded, what's excluded and why, data sources, sample-size caveat.

## Formatting Standards (inherited from instant-ui)

- Cream `#fffef8` canvas, 3px `#111` borders, hard `6px 6px 0` shadows, no border-radius, no blur.
- Blue→green→amber 4px top stripe. System font everywhere, SF Mono for every number. Headings `font-weight: 900`.
- Grade band colors: A = green, B = blue, C = amber, D/F = red. Semantic color stays in lane.
- Transcript quotes are verbatim, attributed (prospect name + call date), set apart in a slab or card.
- Real content only, BenAI voice, no em dashes, no marketing filler.
