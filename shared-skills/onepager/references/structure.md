# Structure

The one-pager has a fixed spine that has converted across many real sales conversations. The spine does not change per client. What changes is the copy you ground in the rep's offer (from config) and the client (from research or the transcript). Sections run top to bottom in this order. Do not add or remove sections without a reason.

## The spine, section by section

### 1. Hero

The opener. Two columns: the pitch on the left, an engagement-summary card on the right.

- **Name lockup.** The card header reads `{{CLIENT}} × {{SELLER}}`. This is the generalized form of the old "Seller x Client" lockup. If the rep uses a different lockup form in config (`identity.lockup`), follow it. The same lockup also appears in the page title and the footer: three brand spots, keep them identical.
- **Prepared-for line.** `Prepared for {{CLIENT}} · {{DATE}}`. Use today's date in long form (`June 25, 2026`), not a numeric date.
- **Headline.** A short, confident promise. Comes from the rep's `positioning.one_liner` shaped to a headline, with an accent fragment highlighted. Keep it about the outcome, not the mechanism.
- **Positioning pill.** One line, 4 to 10 words, that captures how this client's engagement is framed. This is the persona-grounded one-liner. Bind it to a real signal (their scale, their model, their primary goal).
- **Subhead.** One to two sentences, 30 to 60 words, grounded in the client's industry or, post-call, their actual words. This is the most-read paragraph. It should make the client think "this is about me," not "this is a template."
- **Meta pills (3).** Three quick facts about the engagement: duration, scope count, support window, or whatever three numbers matter for this offer. Driven by config plus the scope decision.
- **Engagement card rows (2).** Two short facts: a delivery marker and the persona/framing line.

### 2. Phases (how the work runs)

Three cards showing the rep's delivery approach over time. Generalize the old "Discovery / Build / Enable" to whatever the rep's `phases` are in config (`phases_label` names them: phases, milestones, deliverables, workstreams). Each card has a "when" line, a title, and three bullets. If the offer is a subscription with no phased delivery, reframe these three as onboarding, value, and ongoing, or collapse to the rep's actual stages. Do not force a fixed-timeline implementation shape onto a retainer or SaaS.

### 3. Outcomes

Four small cards naming what the client walks away with. Tangible results, not features. Pull from `positioning.success_criteria` and the scope. Keep each to a title and one or two sentences.

### 4. Scope cards (the services / offers breakdown)

The heart of the page. Each card is one service, deliverable, or workstream the rep will deliver. Two cards by default, one for a single-offer engagement, three or more for a larger scope. Each card has:

- **A tag:** a short framing label (`Highest Priority`, `Phase 1`, `Core Deliverable`, `Quick Win`).
- **A title:** the real name of the service or deliverable, not "TBD" post-call.
- **A description:** one to two sentences grounded in what this client needs.
- **Flow steps (up to 4):** the concrete steps of how this service works or gets delivered, in the client's own tools and language where you have them.

The flow steps are what make the scope feel real. Use the client's actual tool names when you know them.

### 5. Pricing

A single bold price block. Render it per the rep's `pricing.model`:

- **`one_time`:** the amount, a one-line sub (`USD · One-time · <duration>`), no split panel.
- **`recurring`:** the amount with period and term (`$2,000 / month · 3-month term`).
- **`tiered`:** show the recommended tier as the headline figure; mention the others in the inclusions line.
- **`deposit_milestone`:** show the total, then restore the optional `.split` panel for the deposit and milestone rows.
- **`quote`:** show "Custom" or a scoped figure, and flag in your handover that it needs the rep's confirmation.

Below the price sits the **inclusions paragraph** (everything the price covers) and an **optional tooling table** (client-side recurring costs the rep wants to disclose, like software subscriptions). Delete the tooling table block entirely if the offer has no client-side costs.

The split panel is commented out in the template. Restore it only for `deposit_milestone` or an explicitly stated split. Default is a single payment with no split.

### 6. Next steps (kickoff + scheduling)

Two columns. Left: three numbered steps from "signed" to "live," grounded in the rep's actual process. Right: a scheduling CTA with three upcoming slots and a timezone-aware footnote.

- **Steps to kickoff.** Three short steps. Pre-call: sign and pay, kickoff call, delivery runs. Post-call: if a follow-up or decision call was scheduled, restructure so Step 1 is "review before <date>," Step 2 is the follow-up call, Step 3 is sign and kickoff.
- **Scheduling CTA.** Three upcoming real dates (not "TBD"), in the client's timezone, after any scheduled follow-up. The footnote sets times around the client's hours.

### 7. Footer

The lockup again, plus the signer's name and email from config, plus the date.

## Pre-call vs post-call fork

Both paths produce the same page. They differ only in how grounded the copy is.

### Pre-call (research-grounded)

The call has not happened. Personalize from research, not invented pain.

- **Research in parallel:** the rep's CRM (Attio, Pipedrive, HubSpot, whatever they use), their email for a Calendly or scheduling intake (gives canonical name, email domain, time), and a web search on the company. Do not trust the email domain alone for the brand; check their current role.
- **Subhead:** anchor in the client's industry or business model, not in guessed pain points. Grounded enough to feel personal without overcommitting.
- **Positioning pill:** capture their setup in 4 to 10 words from what you found.
- **Scope cards:** stay TBD with offer-relevant hints. The description should make the client think "yes, that is exactly what I would want," without naming specifics you do not have. Example shape: "Locked together once we have mapped your operations. Could be <offer-relevant option A>, <B>, or <C>."
- **Scope section header:** address the company (`What we will deliver for <Company>`).
- **Handover:** include 2 to 3 talking-point angles for the call. The rep wants ammo, not just a file.

### Post-call (transcript-grounded)

The call happened. This is the higher-leverage path: ground every section in what was actually said.

- **Check for a proposal first** (see SKILL.md). A proposal usually exists post-call and is the source of truth.
- **Pull the transcript** from the rep's configured notetaker (Fireflies, Fathom, Granola, Otter, whatever `autonomy.transcript_source` says). Read it with specific questions in mind: what the business actually does in their words, what they leaned toward, what was quoted, whether a follow-up was scheduled, any constraints or blockers, and persona signals.
- **The call overrides research.** If pre-call research said one thing and the call said another, the call wins.
- **Subhead:** use their actual language and stated current state.
- **Scope cards:** map 1:1 to what was discussed. Real names, their tools, their words. A footnote can hedge if scope is not fully locked.
- **Scope section header:** address the person (`What we will deliver for you, <FirstName>`).
- **Handover:** quote the transcript in your "what I personalized and from where" list. It proves the personalization is real. Flag any constraints that affect scope.

## Persona scale (a framing axis that drives copy)

The single biggest framing choice, after pricing. Get it right or the client thinks you did not listen.

- **Solo / small:** the engagement is for a founder plus maybe an assistant. Frame around the individual, mention team expansion only as a future option. The persona pill, the phase bullets, and the enablement copy all read for one or two people.
- **Team / org:** multiple people from day one. Frame around org-wide rollout, access control, team enablement. The persona pill and copy read for a team.

Listen for the cue (pre-call: company size from research; post-call: "it is just me and my assistant" vs "we have a 12-person team") and keep every persona-dependent line consistent with it. A solo client who sees "team workshop" copy, or a 20-person team that gets "just you and your assistant," is a tell that you did not tailor the page.

## What does not vary

Do not change these without asking the rep first:

- The section order and the seven-section spine.
- The name-lockup form (unless config specifies a different one).
- The design system structure (only the CSS-variable values change per brand).

If you find yourself wanting to restructure the page per client, stop. The structure is the proven part. Personalize the copy, not the skeleton.
