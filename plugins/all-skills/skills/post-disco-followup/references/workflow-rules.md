# Workflow Rules

These govern every artifact the skill produces. The specifics (positioning, scope, pricing, support terms) come from `config/offer.md`. The rules below are about HOW to apply them, for any kind of offer.

## Positioning and framing

Your positioning lives in `config/offer.md` under `positioning`. Apply it consistently across the email and any proposal. The headline outcome is `positioning.success_criteria`. Personalize the details per client, keep the spine; do not invent a new angle per client.

`positioning.framing` decides how the engagement reads:
- `done_for_you`: you build or deliver for the client. Frame the work as something you produce for them.
- `enablement`: you set the client up to do it themselves. Never frame it as building on their behalf.
- `subscription`: access to a product or service over time. Frame it as ongoing value, seats, usage, plan.
- `project`: a fixed-scope build with milestones and an end. Frame it as deliverables and a timeline.
- `other`: follow the `one_liner` literally.

Match the framing to what they actually sell. Do not impose an "implementation program" shape on a SaaS subscription or a retainer.

## Scope blocks

Use the blocks defined in `config/offer.md` under `phases`, in order, calling them whatever `phases_label` says (phases, milestones, deliverables, inclusions, workstreams). There can be any number; do not force three. Per client, fill each block with specifics pulled from the call. Do not add or drop blocks per client unless the user asks.

## Pricing

Render pricing per `pricing.model`:
- `one_time`: a single line item and total.
- `recurring`: the amount, period, and term (for example "$2,000/month for 3 months").
- `tiered`: the named tiers and what each includes; recommend one based on the call.
- `deposit_milestone`: the upfront deposit and each milestone payment with its trigger.
- `quote`: a custom figure scoped from the call; if `process.proposal_readiness` is `needs_scoping`, hold the proposal for the user's review.

Adjust the amount only when the client is clearly outside the configured `tier_note`, and flag it when you do. Duration comes from config. Support text comes from config and appears verbatim, only if the proposal has that section.

## Tone and format

- No em dashes anywhere. Use a colon after a bold header (`**Title:** body`), or commas, or restructure.
- Warm and direct, professional. Not salesy, not stiff.
- Low-pressure when the prospect is still in discovery. Do not assume a close.
- Convert relative dates to absolute dates in every output.

## Proposal-specific rules (only when a proposal is part of this touch)

- Prefer the user's own template (`assets.proposal_template`) over the generic one. Match their structure.
- The legal company name always appears. Look it up before locking it in.
- Scope blocks exactly as configured, in order.
- Ground specifics in what you heard on the call. Do not over-commit.
- The support block is the configured `support_terms`, verbatim, if the proposal has one.
- Terms and Conditions, if present, use professional, legally-careful phrasing.

## Email recap rules

If `assets.email_template` is `have_it`, match the rep's own recap structure and tone. Otherwise use the BenAI-recommended structure below (the default in `assets/templates/email-recap-template.md`), which has worked well across offers.

The recommended structure, in order:
- **Greeting:** `Hi <first name>,`.
- **A personalized one-liner:** one warm, specific line tied to them or the call, never generic. This is the opener and it matters; do not skip it.
- **A recap line:** a single sentence that you want to recap what you went through and lay out the next steps.
- **Key points of discussion:** exactly three bullets, led by the prospect's primary goal or challenge, each referencing specific call detail.
- **Next steps:** two to three bullets reflecting what was actually agreed. The first is process-aware: when a proposal is part of this touch it carries the proposal link (or the PandaDoc placeholder); when no proposal is part of this touch it is the configured `process.default_next_step` (book a follow-up, start a trial, nurture), with no proposal line.
- **Closing:** a short "Hope that captures everything" line, then the reply-inviting line "Did I miss anything? Either way, really looking forward to the prospect of working together." The "Did I miss anything" ask is deliberate, it earns a reply.
- **Sign-off:** `Best,` then `email.sender_name`. If the rep set a custom `email.sign_off`, use it in place of the "Did I miss anything" line.

Subject is `email.subject_format` with the company filled in.
