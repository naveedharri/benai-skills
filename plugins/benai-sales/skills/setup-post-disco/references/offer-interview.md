# Offer interview

Ask these to fill `config/offer.md`. Keep it conversational, group related questions, default anything the user does not care about (and tell them what you defaulted). The goal is to capture everything constant across their clients so the engine never guesses their business. In vault mode, read `Context/offer.md` and `Context/sales-process.md` instead of asking the questions they already answer.

## Existing materials (ask FIRST, covered in the wizard's Step 0)

Before the rest, you should already know from Step 0 whether they have a proposal template, an email template, and a documented sales process. Those shape every answer below. If they have a proposal template, the structure questions matter less, you are matching their template. Record under `assets.*`.

## Delivery channels (decide setup)

- Where are proposals created: PandaDoc, Google Docs, your own existing template, or you do not send a formal proposal? Note the link reality for PandaDoc (no shareable link until sent/shared).
- If PandaDoc, connector or direct API? Recommend the connector.
- How do you draft the recap email? Gmail connector, gws, or none.
- Which notetaker are calls recorded with? Fireflies, Fathom, Granola, Otter, or manual paste.

Record `proposal.backend`, `proposal.pandadoc.transport`, `proposal.google_docs.*`, `email.backend`, `autonomy.transcript_source`.

## Identity

- Your name (the signer on proposals)
- Your company name (the seller)
- Your signature email (shown in the signature; does NOT set the draft's From)
- Jurisdiction for your Terms and Conditions, if your proposal has them

## Positioning

- What do you call your offer? (the proposal title)
- One sentence on what you sell and how you frame it.
- Is it done-for-you, enablement, a subscription, a project, or something else? (`framing`)
- What is the headline outcome the client walks away with? (`success_criteria`)
- How long is it? (a duration, or "ongoing")

## Scope blocks

- Walk me through the parts of your offer, in order. What do you call them: phases, milestones, deliverables, inclusions? (`phases_label`)
- For each, a short title and a one-line intro. Any number; do not force three.
- If they are unsure and it is a delivery service, a reasonable default is Discovery, then Build/Setup, then Handoff, but only suggest this if it fits what they sell.

## Pricing

- How do you charge: one-time fee, recurring (retainer or subscription), tiers, or a deposit plus milestones? (`pricing.model`)
- The amount(s) and currency for that model.
- The line-item or plan names that appear on the proposal.
- Who is this price for (for example "orgs of 5 to 20 people"), so the engine knows when to flag an out-of-tier client.

## Support and perks

- What support, access, or guarantee is included? Appears verbatim on the proposal if it has that section.

## Email

- Subject line format for the recap (the engine fills the company)
- Your sign-off line
- The name you sign as

## Sales process (the process block, covered in the wizard's Step 6)

- When do you send the proposal: right after the first call, after a later call, only when you decide a deal is ready, or you do not send a formal proposal?
- So after the FIRST call, what goes out: recap plus proposal, recap plus a nudge to book the next call, or just the recap?
- What next step do you usually ask for?
- Does your proposal need custom scoping before it can go out?

Record into `process`: `proposal_timing`, `proposal_after_call`, `first_call_output`, `default_next_step`, `proposal_readiness`.

## Confirmation and autonomy

- Confirmation summary in chat (simple) or a Slack DM?
- Manual (you run it after each call) or a routine that runs it for you?

## Defaults

If the user is vague, default to: the framing that matches their one-liner, scope blocks as they describe them (or a simple three if a delivery service), `proposal_timing: immediate`, `first_call_output: recap_proposal`, chat confirmation, manual mode, qualification gates off. Tell them what you defaulted so they can change it by editing `config/offer.md`.
