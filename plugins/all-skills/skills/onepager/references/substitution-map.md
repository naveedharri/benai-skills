# Substitution map

`assets/template.html` ships brand-neutral with every personalization point marked as a `{{PLACEHOLDER}}`. This file enumerates every one of them so nothing gets missed. Each entry names its source:

- **`CONFIG:`** the value comes from the rep's config (`Context/offer.md`, `config/offer.md`, or `config/onepager.md`). Constant across all of this rep's clients.
- **`CLIENT:`** the value comes from research (pre-call) or the transcript (post-call). Changes per client.
- **`DERIVED:`** you compute it (today's date, future slot dates, a price rendering).

Work top to bottom. Use the `Edit` tool with `replace_all: true` for any string that appears more than once (the lockup spots and `{{DATE}}` repeat).

## Verification before handing over

Always grep before you ship the file:

```bash
grep -niE "\{\{|CONFIG:|placeholder|lorem|example\.com" <your-file>.html
```

It must return clean. Any remaining `{{...}}` is a missed substitution. If you reused a previously filled file, also grep the prior client's name. A clean grep is your confidence the page is done.

## Brand / design system (CSS variables, in `:root`)

The template's `:root` block holds the design system. Slot the rep's brand in by editing the variable values, not the markup.

| Variable | Source | Notes |
|---|---|---|
| `--ink` | `CONFIG: brand.colors.ink` | Primary text and borders. |
| `--bg` | `CONFIG: brand.colors.bg` | Page background. |
| `--surface` | `CONFIG: brand.colors.surface` | Card background. |
| `--accent` | `CONFIG: brand.colors.accent` | Primary accent. |
| `--accent-soft` | `CONFIG: brand.colors.accentSoft` | Tint of the accent for fills. |
| `--tone-a/b/c` | `CONFIG: brand.colors.toneA/B/C` | Neutral card tints. |
| `--muted` | `CONFIG: brand.colors.muted` | Secondary text. |
| `--font-head` | `CONFIG: brand.fonts.heading` | Heading font. Update the Google Fonts `<link>` to match, or remove it for system fonts. |
| `--font-body` | `CONFIG: brand.fonts.body` | Body font. Same note. |

If the rep has **no brand config**, leave the neutral defaults as-is. They are clean and professional and read as "considered," not "unbranded." State in your handover that you used the neutral default.

## Text placeholders

### 1. Brand lockup and title (3 lockup spots + 1 title)

```html
<title>{{SELLER}} x {{CLIENT}}: {{ONE_PAGER_TITLE}}</title>
...
<div class="name">{{CLIENT}} × {{SELLER}}</div>        <!-- hero card -->
...
<div class="brand">{{SELLER}} × {{CLIENT}} · {{FOOTER_TAGLINE}}</div>   <!-- footer -->
```

- `{{SELLER}}` `CONFIG: identity.company_name`.
- `{{CLIENT}}` `CLIENT:` the client's name, or their company brand if you are locking up the company. Use their personal name if the brand is not theirs to claim.
- `{{ONE_PAGER_TITLE}}` `CONFIG: positioning.program_name`, or a short engagement label.
- `{{FOOTER_TAGLINE}}` `CONFIG:` a short descriptor of the offer (`positioning.one_liner` trimmed).

If the rep set `identity.lockup` to a different form, apply it to all three spots consistently.

### 2. Prepared-for line and dates

```html
<span class="hero-eyebrow"><span class="dot"></span>Prepared for {{CLIENT}} · {{DATE}}</span>
```

- `{{DATE}}` `DERIVED:` today in long form (`June 25, 2026`). Appears here and in the footer; use `replace_all`.

### 3. Hero headline

```html
<h1>{{HERO_HEADLINE}}<br><span class="accent-mark">{{HERO_HEADLINE_ACCENT}}</span></h1>
```

- `{{HERO_HEADLINE}}` `CONFIG: positioning.one_liner` shaped into a confident promise about the outcome.
- `{{HERO_HEADLINE_ACCENT}}` `CONFIG/CLIENT:` the highlighted fragment (the part you want to land hardest).

### 4. Hero subhead

```html
<p>{{HERO_SUBHEAD}}</p>
```

- `CLIENT:` one to two sentences (30 to 60 words). Pre-call: anchored in their industry. Post-call: their actual words. See `structure.md`.

### 5. Positioning pill

```html
<span class="pill-line">{{POSITIONING_PILL}}</span>
```

- `CLIENT:` the persona-grounded one-liner, 4 to 10 words. Bound to a real signal (scale, model, primary goal).

### 6. Hero meta pills (3)

```html
<div class="meta-pill"><span class="num">{{META_1_NUM}}</span><span class="lab">{{META_1_LABEL}}</span></div>
... META_2 ... META_3 ...
```

- `CONFIG/DERIVED:` three quick engagement facts. Examples: duration (`CONFIG: positioning.duration`), scope count, support window (`CONFIG: support_terms`). Use whatever three numbers matter for this offer.

### 7. Engagement card (label, subtitle, 2 rows)

```html
<div class="label">{{ENGAGEMENT_LABEL}}</div>
<div class="role">{{ENGAGEMENT_SUBTITLE}}</div>
...
{{ENGAGEMENT_ROW_1}}
...
{{ENGAGEMENT_ROW_2}}
```

- `{{ENGAGEMENT_LABEL}}` `CONFIG:` e.g. "Engagement" or "Program".
- `{{ENGAGEMENT_SUBTITLE}}` `CONFIG: positioning.program_name`.
- `{{ENGAGEMENT_ROW_1}}` `CONFIG/DERIVED:` a delivery marker (e.g. "Final delivery: <duration>").
- `{{ENGAGEMENT_ROW_2}}` `CLIENT:` the persona / framing line (matches the positioning pill's scale).

### 8. Phases section (header + 3 cards)

```html
<h2>{{PHASES_SECTION_TITLE}}</h2>
<span class="num">{{PHASES_SECTION_KICKER}}</span>
... per card: {{PHASE_N_WHEN}}, {{PHASE_N_TITLE}}, {{PHASE_N_BULLET_1..3}}
```

- `{{PHASES_SECTION_TITLE}}` `CONFIG:` e.g. "How we deliver." / "The approach."
- `{{PHASES_SECTION_KICKER}}` `CONFIG: phases_label` capitalized (Phases, Milestones, Deliverables).
- Per card: `CONFIG: phases[n]`: the `when` (timing), the `title`, and three bullets. If config has fewer than three phases, collapse or repurpose cards rather than inventing. If more, the third card can summarize the tail, or duplicate a card.

### 9. Outcomes section (header + 4 cards)

```html
<h2>{{OUTCOMES_SECTION_TITLE}}</h2>
... per card: {{OUTCOME_N_TITLE}}, {{OUTCOME_N_BODY}}
```

- `{{OUTCOMES_SECTION_TITLE}}` `CONFIG:` e.g. "What you walk away with."
- Per card: `CONFIG/CLIENT:` a tangible result and one to two sentences. Lead with `positioning.success_criteria`. Keep them results, not features.

### 10. Scope cards (header + 2 cards + footnote)

```html
<h2>{{SCOPE_SECTION_TITLE}}</h2>
<span class="num">{{SCOPE_SECTION_KICKER}}</span>
... per card: {{SCOPE_N_TAG}}, {{SCOPE_N_TITLE}}, {{SCOPE_N_DESCRIPTION}}, {{SCOPE_N_STEP_1..4}}
<p ...>{{SCOPE_FOOTNOTE}}</p>
```

- `{{SCOPE_SECTION_TITLE}}` `CLIENT:` pre-call addresses the company (`What we will deliver for <Company>`), post-call addresses the person (`What we will deliver for you, <FirstName>`).
- `{{SCOPE_SECTION_KICKER}}` `CONFIG/CLIENT:` e.g. "Core Deliverables", "Top Two Priorities".
- Per card: `CLIENT:` the tag, the named service or deliverable, the description, and up to 4 flow steps in the client's tools and words. Post-call these are real and named. Pre-call they stay TBD with offer-relevant hints (see `structure.md`).
- `{{SCOPE_FOOTNOTE}}` `CLIENT:` a hedge if scope is not locked, or a confirmation line. Remove if not needed.

**Card count:** the template has 2 cards. For 1 offer, delete the second `.auto-card` and add `style="grid-template-columns:1fr"` to `.autos`. For 3+, duplicate a card and cycle the `t1`/`t2` tone class.

### 11. Pricing block

```html
<div class="label">{{PRICE_LABEL}}</div>
<div class="price">{{PRICE_AMOUNT}}</div>
<div class="sub">{{PRICE_SUBLINE}}</div>
<div ...>{{INCLUSIONS_PARAGRAPH}}</div>
```

- `{{PRICE_LABEL}}` `CONFIG:` e.g. "Investment".
- `{{PRICE_AMOUNT}}` `CONFIG/DERIVED: pricing` rendered per `pricing.model` (see `structure.md` for each model). Adjust only if the user states a different figure for this client, and flag it if you do.
- `{{PRICE_SUBLINE}}` `CONFIG/DERIVED:` e.g. `USD · One-time · <duration>` or `$2,000 / month · 3-month term`.
- `{{INCLUSIONS_PARAGRAPH}}` `CONFIG:` everything the price covers, from `support_terms` plus the scope. Personalize the closing line per persona scale.

### 12. Tooling table (OPTIONAL)

```html
<div ...>{{TOOLING_TABLE_HEADING}}</div>
... {{TOOLING_N_NAME}} / {{TOOLING_N_COST}} ...
<span>{{TOOLING_TOTAL_LABEL}}</span><strong>{{TOOLING_TOTAL}}</strong>
```

- `CONFIG:` client-side recurring costs the rep discloses (software subscriptions, hosting, seats). **Delete the entire tooling block** if the offer has no client-side costs. Heading example: "Approx. tooling costs (your subscriptions, not ours)".

### 13. Split / milestone panel (OPTIONAL, commented out)

Restore the commented `.split` block only for `pricing.model: deposit_milestone` or an explicitly stated split. Fill `{{SPLIT_TITLE}}`, `{{SPLIT_PCT_1/2}}`, and the two `{{SPLIT_ROW_*}}` pairs from `CONFIG: pricing.deposit_milestone`. For a single payment, leave it deleted and keep `.invest` at `grid-template-columns: 1fr`.

### 14. Next steps (title, intro, 3 steps)

```html
<h2 ...>{{NEXT_STEPS_TITLE}}</h2>
<p>{{NEXT_STEPS_INTRO}}</p>
... {{KICKOFF_STEP_1..3}}
```

- `{{NEXT_STEPS_TITLE}}` `CONFIG:` e.g. "Three steps to kickoff."
- `{{NEXT_STEPS_INTRO}}` `CONFIG:` one line on the path from signed to delivered.
- `{{KICKOFF_STEP_1..3}}` `CONFIG/CLIENT:` the rep's process. Post-call, restructure around any scheduled follow-up call (see `structure.md`). Use absolute dates.

### 15. Scheduling CTA (kicker, title, 3 slots, footnote)

```html
<div class="pre">{{SCHEDULE_KICKER}}</div>
<h3>{{SCHEDULE_TITLE}}</h3>
... {{SLOT_N_DAY}} / {{SLOT_N_WHEN}} ...
<p ...>{{SCHEDULE_FOOTNOTE}}</p>
```

- `{{SCHEDULE_KICKER}}` `CONFIG:` e.g. "Open kickoff slots".
- `{{SCHEDULE_TITLE}}` `CONFIG:` e.g. "Pick a day to kick off."
- `{{SLOT_N_DAY}}` / `{{SLOT_N_WHEN}}` `DERIVED:` three upcoming real dates in the client's timezone, after any scheduled follow-up. Day labels are the weekday; `when` is the date plus an optional note.
- `{{SCHEDULE_FOOTNOTE}}` `CLIENT:` times set around the client's location and hours (their timezone).

### 16. Footer signer

```html
<div class="meta">Prepared by {{SIGNER_NAME}} · {{SIGNER_EMAIL}} · {{DATE}}</div>
```

- `{{SIGNER_NAME}}` `CONFIG: identity.operator_name`.
- `{{SIGNER_EMAIL}}` `CONFIG: identity.signature_email`.

## Things that do not vary

Do not touch these without asking the rep:

- The seven-section spine and its order.
- The name-lockup form (unless `identity.lockup` says otherwise).
- The structural tokens (`--shadow`, `--border`, `--radius`): only the brand color and font variables change per rep.
