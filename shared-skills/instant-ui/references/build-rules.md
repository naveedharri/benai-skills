# Build Rules (Step 5)

## Contents
1. Voice rules
2. Hard build constraints
3. Error handling routes
4. After-build checklist

## 1. Voice rules

The BenAI brand voice is plain-English, direct, builder-first.

1. **No marketing cliches.** Ban: "cutting-edge," "revolutionary," "leverage," "unlock," "at scale," "game-changer," "seamlessly," "world-class," "best-in-class," "transform your business."
2. **Say what it does.** Not "AI-powered solutions." Say "Ships an agent that reads your inbox and files every lead."
3. **Short sentences.** Break compound sentences. One idea per line.
4. **No em dashes.** Use commas, periods, or parentheses.
5. **Do not say "it's not X, it's Y."** Too clever. Just say Y.
6. **Numbers are specific.** Not "dozens of integrations." Say "11 integrations." Not "fast." Say "2 weeks."
7. **The champion-mark highlight holds ONE phrase.** Usually the thing you want them to remember. Do not box more than one word or phrase per hero.
8. **Pills, labels, and meta use mono caps.** "SECTION 01 · THE PROBLEM", "WEEK 01", "02 WEEKS TO HANDOFF."
9. **No AI-tell hero eyebrow.** Never open a page (especially a dashboard) with a mono kicker line led by a colored dot, like "● NAME · DATE · META" (the `.cover-pre` + `.dot` pattern). It reads as AI-generated. Put date and context in the header meta, a plain sub-label, or fold it into the subtitle. Dashboards never use `.cover-pre`.

## 2. Hard build constraints

1. **Self-contained HTML.** Single file, all CSS inline, no external stylesheets, no Google Fonts (this brand uses system fonts).
2. **System font only.** Never import Inter, Space Grotesk, or anything else. `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`.
3. **The gradient stripe is required.** Every page. First element in `<body>` (or `::before` on a dark section). Blue to green to amber, 4px tall.
4. **All headings: font-weight 900.** No exceptions.
5. **Mono for all numerics.** Stats, prices, timers, week labels, percentages.
6. **Hard borders only.** 3px solid `#111`. Never `rgba`, never blurred shadows, never `border-radius: 12px`. This brand has almost no border radius. Buttons and cards are square.
7. **Colors stay in lane.** Blue = primary accent and info. Green = success, after, positive. Amber = highlight, attention. Red = problem, error only. Do not mix.
8. **Real content or stop.** If you do not have copy, ask. Do NOT ship with placeholder text.
9. **Cream bg everywhere.** `#fffef8`, not `#fff`. Only card interiors and inputs go pure white.
10. **No frameworks.** Raw HTML and CSS. JS only for form logic, tabs, or progress bars. No React, no Tailwind, no Bootstrap.
11. **Output location:** `~/Desktop/builds/benai/[page-name].html` (kebab-case).
12. **Kicker comment at top:** `<!-- BenAI instant-ui v1 -->`

## 3. Error handling routes

| Situation | Action |
|-----------|--------|
| `$ARGUMENTS` is blank | Ask: page name, page type, primary CTA, rough copy. |
| Copy is missing or vague | Stop. Ask for the real content. Never write marketing filler. |
| Request is for a dark HUD dashboard | Stop. Route to `personal-ui`. |
| Request is for a non-BenAI client | Stop. Route to `client-docs` with that client's theme. |
| User asks for Google Fonts / Tailwind / framework | Refuse and explain. The BenAI brand uses system fonts and raw CSS by rule. |
| User asks for rounded corners, glass, blur | Refuse. This is a neo-brutalist system. Hard edges only. |

## 4. After-build checklist

Run before confirming output.

- [ ] `:root` tokens match exactly (paste-verify, do not hand-type)
- [ ] Top gradient stripe present (`#3b82f6` to `#22c55e` to `#f59e0b`)
- [ ] System font plus SF Mono only, no Google Fonts `<link>`
- [ ] All headings are `font-weight: 900`
- [ ] All numbers and stats use `var(--mono)`
- [ ] Borders are `3px solid var(--border)`, shadows are hard (`6px 6px 0 #111`)
- [ ] BenAI smiley SVG rendered in header and footer (circle + single U-smile, NO eyes)
- [ ] No green-dot hero eyebrow (`.cover-pre` with `.dot`) on dashboards
- [ ] Page background is cream `#fffef8`, not white
- [ ] No placeholder copy, every sentence is specific
- [ ] Responsive breakpoints at 980px and 720px
- [ ] File saved to `~/Desktop/builds/benai/[name].html`
