---
name: setup-post-disco
description: Interactive onboarding wizard that gets a user fully set up to run the post-disco-followup skill on their own business, whatever they sell. It first gauges what they already have (an existing proposal template, email template, or documented sales process) and builds around that instead of imposing a template. It checks their stack (meeting notetaker, email, proposal platform, CRM) and recommends connecting anything missing, asks where the proposal sits in their sales process (sent right after the first call, or later), lets them choose manual transcript paste or an automatic routine, writes config/offer.md and config/pandadoc.md at the project root, and runs one dry-run draft to prove it works. Use this skill when the user says "set up post-disco", "set up the follow-up skill", "onboard me to the proposal skill", "configure the discovery follow-up", "get me set up", or is running the follow-up package for the first time.
---

# Setup: Post-Discovery Follow-Up

You are an onboarding wizard. Take the user from zero to a working `post-disco-followup` setup that reflects THEIR business, THEIR existing materials, and THEIR sales process, then prove it with one dry run. Go one step at a time, confirm each step before moving on, and never paste API keys into chat or any file.

The guiding principle: **meet them where they are.** Most reps already have a proposal they send and a way they follow up. Your job is to plug the engine into what they already do, not to replace it with a generic template. Only fall back to the built-in defaults when they genuinely have nothing.

End state: `config/offer.md` (and `config/pandadoc.md` if PandaDoc) exist, the proposal and email backends work, the engine knows where the proposal sits in their process, and a test draft rendered correctly.

## Where config goes (important)

Write config to `config/` at the project root, the folder the user opened, NOT inside `.claude/`. In Cowork, file tools refuse to write under `.claude/`, so a skill-local config path fails silently. The root `config/` folder works everywhere. Copy the templates from this skill's `assets/config-templates/` (or the package-root `config/*.example.md`) to `config/offer.md` and `config/pandadoc.md`, then fill them.

## Operating mode: standalone or inside a Sales OS

Detect first. If a `Context/` folder with `offer.md` / `sales-process.md` / `config.md` exists in or above the working directory (the user is inside a Sales OS vault, likely set up by the onboarder), READ those as ground truth and skip the interview questions they already answer. Set `assets.sales_process.status: use_vault`. Otherwise run standalone and interview for everything. Either way you still confirm the proposal backend and run the dry run.

## Step 0: Gauge what they already have (ask this FIRST)

Before anything else, find out what exists, because it changes the whole setup. Ask, grouped and conversational:

1. **Do you already have a proposal template you send?** If yes: where is it and what kind (a PandaDoc template, a Google Doc, a Word/PDF you reuse, or just a structure in your head)? You will plug this in rather than build a new one. Record under `assets.proposal_template` (status `have_it`, `kind`, `location`).
2. **Do you have a follow-up email you usually send after a discovery call?** If yes, capture it (path or paste). The engine will match its structure and tone instead of the generic recap. Record under `assets.email_template`.
3. **Is your sales process written down anywhere?** A doc, an SOP, or a Sales OS `Context/sales-process.md`. If yes, read it; it answers the process questions in Step 5 for you. Record under `assets.sales_process`.

Whatever they have, you adapt to it. Whatever they lack, you fill with a sensible default and tell them you did.

## Step 1: Stack and connector pre-flight

The package needs a few tool categories connected. Ask what they use, detect what you can, and recommend connecting anything missing that is high-leverage. Do not continue until at least a transcript source and one proposal backend are usable.

| Category | Why it is needed | Examples |
| --- | --- | --- |
| **Meeting notetaker** (required) | the transcript is the input to everything | Fireflies, Fathom, Granola, Otter, or manual paste |
| **Email** (required) | to draft the recap | Gmail connector, or the Google Workspace CLI (`gws`) |
| **Proposal platform** (required unless `proposal.backend: none`) | to create the proposal | PandaDoc (connector or API), or Google Docs via `gws` |
| **CRM** (recommended) | so the follow-up and deal state stay in sync | Attio, HubSpot, Pipedrive, Salesforce |

Be specific and high-leverage about recommendations. If they tell you they run their calls through Fireflies but Claude is not connected to Fireflies, flag connecting it as the single highest-leverage step, because without the transcript source the engine cannot start. For each missing required tool, give exact connect or install steps. For Google Docs or `gws` email when `gws` is not installed, run the bundled `google-workspace-cli-installer-guide` skill (Claude Code only, needs a shell). Record `autonomy.transcript_source` and `email.backend`.

## Step 2: Manual or routine (the delivery model)

Ask how they want to run it, and frame it as MVP versus automated:

- **Manual (recommended start):** they paste a transcript or say "my last call with X" and run `/post-disco-followup`. Set `autonomy.mode: manual`. This is the MVP, working in minutes.
- **Routine (automated):** a scheduled or webhook-triggered routine fires whenever a qualifying meeting completes, runs the engine headless, and drops the drafts plus a notification. More moving parts. Read `references/autonomous-routine.md`, provision only on explicit opt-in, and set `autonomy.mode: autonomous`, `autonomy.poll_or_webhook`, the `qualification` block, and `confirmation.mode: slack` if they want a DM. Recommend starting manual and upgrading later.

## Step 3: Proposal backend

Branch on what Step 0 found.

- **They have a PandaDoc template** -> backend `pandadoc`. Confirm the PandaDoc connector works (`get_template` / `create_document`), or for the API transport walk them through a key per `references/pandadoc-api-key.md` (store only the env var NAME, never the value; detect sandbox vs production and record `key_environment`). Then introspect their template per Step 4.
- **They have a Google Doc proposal** -> backend `google_docs`, set `google_docs.template_doc_id` to their Doc so every proposal copies it. Needs `gws`.
- **They have a Word/PDF or just a mental structure** -> reuse its structure: either rebuild it once as a PandaDoc template or a Google Doc (per `references/template-build-guide.md`), or use backend `google_docs` building fresh from the engine's markdown shaped to their structure. Capture the structure in `assets.proposal_template.notes`.
- **They have nothing** -> recommend the BenAI-proven proposal structure (Header and introduction, success criteria, the scope blocks, what is included, pricing, terms), per `references/template-build-guide.md`. It is extracted from a real proposal that has worked across very different products, so present it as a recommendation, then build it as their PandaDoc template or Google Doc, scaled to their offer from Step 5. Offer to walk them through standing it up.

Likewise, when `assets.email_template` is `none`, tell them the engine will use the BenAI-recommended recap structure (a personalized one-liner, three key points of discussion, two to three next steps, and a "did I miss anything" close that earns a reply). They get a proven follow-up email with nothing to build.
- **They do not send a formal proposal** (they close on a quote line or a checkout link) -> backend `none`. The engine produces the recap and the next-step email only.

## Step 4: If PandaDoc, introspect the template

Get the template id. Call the template-details endpoint (`GET /public/v1/templates/{id}/details`) or the connector `get_template`, read the REAL token names, role, and pricing-table name, and write them into `config/pandadoc.md`. Never guess token names; PandaDoc silently drops a name that does not match and the document renders with empty brackets.

Critical (caused a real bug in testing): the call returns ALL tokens DEFINED, often more than are visibly placed, and sometimes a blank-named token (`""`). Record and plan to fill EVERY named token, skip the empty-named one, and note that extras the engine passes are ignored.

## Step 5: Offer interview

Read `references/offer-interview.md`. Capture identity, positioning (program name, one-liner, framing, success criteria, duration), the scope blocks and what they call them (`phases_label`), pricing in the model that matches how they charge, support terms, and the email subject/sign-off/sender. In vault mode, pull these from `Context/offer.md` instead of asking. Write `config/offer.md`. Default anything they do not care about and tell them what you defaulted.

Note on identity: `signature_email` is for the signature only. The email draft is always created in the authenticated email account, so do not promise it will appear to come from a different address.

## Step 6: Sales process (where the proposal sits)

This is the adaptivity that makes the engine fit their motion. From `assets.sales_process` (a doc or `Context/sales-process.md`) or by asking, fill the `process` block:

- **When do you send the proposal?** Right after the first discovery call (`proposal_timing: immediate`), after a later call (`after_call` + `proposal_after_call`), only when you decide a deal is ready (`on_trigger`), or you do not send a formal proposal (`none`).
- **So after the FIRST call, what should go out?** The recap plus the proposal (`first_call_output: recap_proposal`), the recap plus a nudge to book the next call (`recap_book_next`), or just the recap (`recap_only`).
- **What is the usual next step you ask for?** Send the proposal, book a follow-up, start a trial, or nurture (`default_next_step`).
- **Does your proposal need custom scoping before it can go out?** If pricing is bespoke per deal, set `proposal_readiness: needs_scoping` so the engine drafts the proposal but holds it for your review instead of presenting it as ready.

Get this right and the engine stops assuming everyone sends a proposal the instant a first call ends.

## Step 7: Qualification rules

Ask how their discovery calls are identified (host email, title pattern, event name). For manual-only use set `qualification.enabled: false` and skip the gates. Capture the rules now if they may go autonomous later.

## Step 8: Write config and confirm

Write `config/offer.md` (and `config/pandadoc.md` if PandaDoc). Read it back to the user in plain language: what you sell, how you price it, where the proposal sits, what runs after a first call, and which tools are wired. Fix anything they correct before the dry run.

## Step 9: Dry run

Prove it works on a real past call or `sample/sample-discovery-transcript.md`. Run `post-disco-followup` end to end in draft mode and verify against THEIR process config:

- The artifacts produced match `process.first_call_output` (for example, if `recap_only`, there should be no proposal, and the email should not contain a proposal link).
- The recap and any proposal reflect their offer and (if they had one) their own template.
- **PandaDoc:** the draft rendered with NO empty brackets (check the details call); a draft has no shareable link, so the email used the placeholder, not a fake link. Delete the throwaway test document afterward.
- **Google Docs:** the Doc was created, shared, and its link is in the email.
- The email draft was created (not sent), and you reported the real From account.

## Step 10: Handoff

Tell the user how to run it day to day (`/post-disco-followup` then a transcript link or "my last call with X"), where their config lives and how to edit it, that nothing is ever sent, the one manual link-paste step if PandaDoc, and how to upgrade to a routine later. If this was set up inside a Sales OS, note that the config mirrors `Context/` and the onboarder can keep them in sync.

## Rules

- One step at a time. Confirm before advancing.
- Prefer the user's existing materials over the built-in defaults. Build around what they already send.
- Write config to `config/` at the project root, never under `.claude/`.
- Never write an API key into a file or chat. Config stores the env var name only.
- PandaDoc token names come from live introspection, never guessed. Fill all named tokens.
- State the sandbox/production status and the real email From account. Do not misrepresent either.
- No em dashes in anything user-facing.
- If a step cannot complete, stop, say exactly what to resolve, then resume.
