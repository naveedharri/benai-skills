# Post-Discovery Email Recap - Template (BenAI recommended)

> How to use:
> 1. If `assets.email_template` is `have_it`, match the user's own recap and ignore this.
> 2. This is the BenAI-recommended recap structure, proven across offers. It is the default when the rep has no template of their own.
> 3. Fill every `{{PLACEHOLDER}}`. Values prefixed `CONFIG:` come from `config/offer.md`.
> 4. Three key points of discussion. Two to three next steps. The first next step is process-aware: a proposal link ONLY when a proposal is part of this touch (see `references/email-format.md`), otherwise the configured next step.
> 5. Warm, human, specific. No em dashes. Remove all comments before sending.

---

**Subject:** {{CONFIG:email.subject_format with company filled in}}

**To:** {{CLIENT_EMAIL}}

Hi {{CLIENT_FIRST_NAME}},

{{PERSONALIZED_ONE_LINER: one warm, specific line tied to them or the call, never generic. For example "Really enjoyed hearing how the team is set up and where the outbound keeps stalling."}}

Wanted to quickly recap what we went through and lay out the next steps.

**Key points of discussion:**

- {{KEY_POINT_1}}
- {{KEY_POINT_2}}
- {{KEY_POINT_3}}

**Next steps:**

<!-- FIRST step is process-aware: a proposal link (Google Doc) or PandaDoc placeholder when a proposal is part of this touch, otherwise CONFIG:process.default_next_step with NO proposal line. -->

- {{FIRST_NEXT_STEP}}
- {{NEXT_STEP_2}}
- {{NEXT_STEP_3_OPTIONAL}}

Hope that captures everything we went through.

Did I miss anything? Either way, really looking forward to the prospect of working together.

<!-- If the rep set a custom CONFIG:email.sign_off, use it in place of the "Did I miss anything" line above. -->

Best,
{{CONFIG:email.sender_name}}
