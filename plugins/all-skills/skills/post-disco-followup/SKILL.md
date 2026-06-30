---
name: post-disco-followup
description: Produce the post-discovery follow-up package after a sales call: a personalized email recap, and, when your sales process calls for it, a personalized proposal (in PandaDoc or Google Docs, or your own existing template), plus an email draft and a confirmation summary. Nothing is ever sent. Reads all of your specifics (offer, pricing, identity, proposal backend, and where the proposal sits in your process) from config/ so it is yours, not a template, and it adapts to what you produce when. Works from a transcript link, a transcript file, "my most recent call with [name]", or automatically when a routine passes a meeting id. Use this skill when the user says "post-disco followup for [name]", "post discovery follow-up", "follow-up for my last discovery call", "generate the proposal and recap for [company]", "close out the [name] call", or any variation of producing the recap and follow-up bundle after a discovery call. Run the setup-post-disco skill first if config/ is empty.
---

# Post-Discovery Follow-Up

You produce the post-call follow-up package for a sales discovery call. Every artifact is a DRAFT: never send the proposal, never send the email, never push to a protected branch. The final step is always a confirmation summary so the user can review and send.

This skill is offer-agnostic, backend-agnostic, and process-agnostic. Every business-specific value lives in `config/` at the project root. What it produces, and whether a proposal is even part of this touch, is driven by the user's sales process in config. Read config first, then act.

## Read config before anything else

Config lives at the project root in `config/`:
- `config/offer.md`: your offer, identity, delivery channels, the `process` block (where the proposal sits), the `assets` block (your own templates), qualification, confirmation, output dir, autonomy.
- `config/pandadoc.md`: only if `proposal.backend` is `pandadoc`.

If `config/offer.md` is missing or only `*.example.md` files exist, the user has not run setup. Tell them to run `setup-post-disco` first, and stop.

If a `Context/` folder (`offer.md`, `sales-process.md`, `config.md`) exists in or above the working directory, the user is inside a Sales OS. Read it as the source of truth alongside `config/`, and write outputs and deal updates per the vault's conventions.

From config, determine up front:
- `proposal.backend`: `pandadoc` | `google_docs` | `reuse_existing` | `none`
- if pandadoc, `proposal.pandadoc.transport`: `connector` or `api`
- `email.backend`: `gmail_connector` | `gws` | `none`
- `assets.proposal_template`: if `have_it`, you fill THEIR template, not the generic one
- the `process` block (next section)

## Decide what to produce (process-aware)

Before drafting, decide which artifacts this touch calls for, from the `process` block and which call in the sequence this is. This is the core of the skill: not every follow-up includes a proposal.

1. **Determine the call stage.** Is this the first discovery call or a later one? In vault mode, read the deal's history. In manual mode, infer from the transcript (introductions and discovery signal a first call) and, if unsure, ask. A routine passes or infers the stage.
2. **Apply `process.proposal_timing`:**

| `proposal_timing` | First call | Later call (>= `proposal_after_call`) |
| --- | --- | --- |
| `immediate` | recap + proposal + email | n/a |
| `after_call` | recap + email that books/points to the next call, NO proposal | recap + proposal + email |
| `on_trigger` | recap + email now; proposal drafted but HELD (not linked) until the user greenlights | same |
| `none` | recap + next-step email, no proposal ever | same |

3. **Honor `process.first_call_output`** for the first-call case if it is more specific (`recap_proposal`, `recap_book_next`, `recap_only`).
4. **If `process.proposal_readiness` is `needs_scoping`,** draft the proposal but mark it held for the user's review (custom pricing), and keep its link out of the email.

State which artifacts you are producing and why, in one line, before drafting. When no proposal is part of this touch, the email's next step is `process.default_next_step` (book a follow-up, start a trial, nurture), never a proposal link.

## Required reading

- `references/workflow-rules.md`: tone, content rules, applying the offer, the no-em-dash rule
- `references/email-format.md`: email body format, the conditional proposal-link rules, the from-address reality
- `references/extraction-checklist.md`: what to pull from the transcript
- `references/confirmation-format.md`: the final summary
- Proposal backend, only when a proposal is part of this touch:
  - `references/pandadoc-backend.md` (connector and api, token fill, the draft-link limitation)
  - `references/google-docs-backend.md` (Google Doc via gws, including copying your own template Doc)
- Worked examples for tone: `assets/examples/proposal-example.md`, `assets/examples/email-recap-example.md`

## Invocation modes

**Manual** (a human is present): confirm extracted details and the call-stage decision interactively before producing artifacts.
**Routine** (webhook or schedule, no human): proceed with best judgment, do not block. Only when `autonomy.mode` is autonomous.

## Workflow

### Step 1: Resolve the transcript source
A meeting id passed by a routine, a transcript URL (extract the id), "my last call with X" (search the configured notetaker by `qualification.host_email` and `qualification.title_pattern`), a pasted transcript or file path, or ask in manual mode. Routine mode stops and reports if nothing resolves.

### Step 2: Fetch the transcript
Use the configured notetaker (`autonomy.transcript_source`). Pull title, host email, participants with names and emails, utterances, duration, calendar event. If it fails, stop and report.

### Step 3: Validate the meeting (only if `qualification.enabled`)
Confirm title pattern, event name, host, external type. If disabled (default for manual), skip.

### Step 4: Classify the call and determine its stage
Read the opening utterances. Is this a genuine sales call, and is it the first one or a later one? The stage drives the process decision above. If clearly not a sales call, manual asks, routine stops silently.

### Step 5: Duplicate check
Slug from the prospect name. If `<output_dir>/<slug>/` exists, manual asks to overwrite, routine stops. On a later call for an existing deal, append rather than overwrite.

### Step 6: Extract client context
Pull everything in `references/extraction-checklist.md`. If the prospect email is missing, stop and report it.

### Step 7: Look up the legal company name (only if a proposal is part of this touch)
Web search for the registered name. Manual reports the name AND the source and waits. Common names return several unrelated businesses, so always show the source and never lock a name in without confirmation. Routine uses the best match and falls back to the stated name. If no proposal is produced this touch, skip the legal lookup.

### Step 8: Decide the output directory
Use `output_dir` (default `./clients`). Files go in `<output_dir>/<slug>/`.

### Step 9: Draft the email recap `<slug>/email-recap-<slug>.md`
If `assets.email_template` is `have_it`, match its structure and tone. Otherwise fill `assets/templates/email-recap-template.md` per `references/email-format.md` and `references/workflow-rules.md`. Subject, sign-off, sender from config. Pull the key points from the call, 1 to 2 next steps. The first next step includes the proposal link ONLY when a proposal is part of this touch; otherwise it is the configured `default_next_step`. Absolute dates everywhere.

### Step 10: Draft the proposal `<slug>/proposal-<slug>.md` (only if a proposal is part of this touch)
If `assets.proposal_template` is `have_it`, fill THEIR structure (read it from its `location`). Otherwise fill `assets/templates/proposal-template.md`, scaled to the configured scope blocks (any count) and the configured `pricing.model`. Positioning, scope, pricing, currency, duration, and support terms come from config. This markdown is the source content for whichever backend you use next. If `none`, skip the proposal entirely.

### Step 11: Create the proposal in the backend (do NOT send), only if a proposal is part of this touch
Branch by `proposal.backend`:

- **`pandadoc`:** follow `references/pandadoc-backend.md`. Fill EVERY named token (skip empty-named, extras ignored), verify with the details call (no empty brackets), capture the document id. Note the draft-link reality: a PandaDoc draft has NO prospect-facing link, so do not invent one. If `key_environment` is `sandbox`, flag it.
- **`google_docs`:** follow `references/google-docs-backend.md`. Build fresh from the proposal markdown, or copy `google_docs.template_doc_id` (their branded Doc) and replace placeholders. Share per `google_docs.share`, capture the URL. This URL IS a real prospect-facing link.
- **`reuse_existing`:** create from the user's own template per its kind (a PandaDoc template id, or copy their Google Doc), filling their placeholders.

If `process.proposal_readiness` is `needs_scoping`, create the draft but mark it held and keep its link out of the email.

### Step 12: Create the email draft (do NOT send)
Use the configured email backend. Match `references/email-format.md`. Proposal-link handling depends on backend AND on whether a proposal is part of this touch (real Google Doc link, a PandaDoc placeholder, or no proposal line at all). Capture the draft url or id.

Reality (confirmed in testing): the draft is created in whatever account you are authenticated as, not `identity.signature_email`. The configured email is for the signature only.

### Step 13: Confirmation summary (MANDATORY)
Per `references/confirmation-format.md` and `confirmation.mode`. Always include prospect, company, what was produced this touch (and, if no proposal, why not), the proposal link or its status, the email draft link, the transcript url, and the saved path. For PandaDoc, tell the user the link is generated when they send or share the doc, and to paste it into the email before sending.

## Hard constraints
- NEVER send the proposal or the email. Drafts only.
- NEVER push to a protected branch.
- NEVER skip the confirmation summary.
- Produce only what `process` calls for. Do not attach a proposal to a touch the process says is recap-only.
- Convert relative dates to absolute everywhere.
- When a proposal is produced, look up and confirm the legal company name. Never guess.
- PandaDoc token names are case- and space-sensitive. Fill all named tokens, verify with the details call.
- Do NOT fabricate a PandaDoc proposal link at draft stage. There is none.
- The email From is the authenticated account, not the configured signature email.
- No em dashes in client-facing copy.
- Read everything from `config/` at the project root. Prefer the user's own templates over the generic ones.

## Output summary (return to caller)
`prospect_name`, `company_name`, `slug`, `call_stage`, `artifacts_produced`, `email_recap_path`, `proposal_path` (or null), the proposal reference (`pandadoc_document_id` or `google_doc_url`, or null), the prospect-facing proposal link or its pending status, `email_draft_url`, `transcript_url`, and (slack mode) the confirmation timestamp.
