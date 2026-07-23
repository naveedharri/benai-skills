# Proposal - Template (BenAI recommended structure)

> How to use:
> 1. This is the BenAI-recommended proposal structure, the default when the rep has no proposal of their own. It is extracted from a real proposal that has worked across very different products, so the spine is proven; only the content changes per offer. If `assets.proposal_template` is `have_it`, fill the rep's own template instead and ignore this.
> 2. Analyze the discovery transcript. Fill every `{{PLACEHOLDER}}`. Values prefixed `CONFIG:` come from `config/offer.md`.
> 3. Scope blocks, pricing, currency, duration, support, and positioning all come from config. There can be any number of scope blocks. Personalize the details, keep the spine.
> 4. Sections marked optional are included only if they fit the offer. No em dashes. Professional phrasing in any Terms.
> 5. Remove all comments and placeholder markers before sending.

---

## Header

**{{CLIENT_COMPANY}} - Proposal**

**{{CONFIG:positioning.program_name}}**

This proposal contains the scope, pricing, and terms requested by {{CLIENT_CONTACT_NAME}}.

**{{CLIENT_CONTACT_NAME}}**
{{CLIENT_COMPANY}}

---

## Introduction

Client: {{CLIENT_CONTACT_NAME}}

Date: {{PROPOSAL_DATE}}

Scope: {{CONFIG:positioning.program_name}}

{{SCOPE_NARRATIVE: a short paragraph describing the offer in the client's context, grounded in CONFIG:positioning.one_liner and CONFIG:positioning.framing}}

**Success Criteria:** {{SUCCESS_CRITERIA_NARRATIVE: grounded in CONFIG:positioning.success_criteria, in the client's context}}

Time frame: {{CONFIG:positioning.duration}}

---

## {{CONFIG:phases_label, title-cased}}

<!-- One block per configured phase. Any count. Title each from CONFIG:phases[i].title. Fill from the call. -->

### 1. {{CONFIG:phases[0].title}}

{{DESCRIPTION: one sentence in the client's context}}

- {{bullet grounded in the call}}
- {{bullet}}

Outcome: {{OUTCOME: one sentence}}

<!-- Repeat the block above for each configured phase: phases[1], phases[2], ... as many as exist. -->

---

## What's Included (optional)

<!-- Include only if it fits the offer. Pull from config and the call. -->

{{INCLUDED_ITEMS: support, access, sessions, materials, as bullets}}

**Post-engagement support:**

{{CONFIG:support_terms, as bullets}}

---

## Pricing

<!-- Render per CONFIG:pricing.model. Use ONE of the following shapes. -->

<!-- one_time -->
| Name | Price | QTY | Subtotal |
|---|---|---|---|
| {{CONFIG:pricing.one_time.line_item}} | {{amount + currency}} | 1 | {{subtotal}} |
| | | **Total** | **{{total}}** |

<!-- recurring: "{{amount + currency}} per {{period}}, {{term}}" -->
<!-- tiered: a row per CONFIG:pricing.tiers with name, price, period, includes; recommend one -->
<!-- deposit_milestone: deposit line + a row per milestone with its trigger -->

<!-- Adjust the amount only if the client is clearly outside CONFIG:pricing.tier_note. Flag it if you do. -->

---

## Terms and Conditions (optional)

<!-- Include only if the user's proposals carry terms. Professional, legally-careful phrasing. -->

**1. Purpose.** This Agreement outlines the terms under which {{CONFIG:identity.company_name}} will provide {{CONFIG:positioning.program_name}} to {{CLIENT_COMPANY}}.

**2. Scope & Disclaimer.** {{CONFIG:identity.company_name}} will deliver the agreed services within the stated timeline. Any change of scope is agreed in writing and may require an updated proposal or additional fees.

**3. Payment.** Client agrees to pay {{pricing per model}} for {{CONFIG:positioning.program_name}}.

**4. Intellectual Property.** {{IP terms appropriate to the offer: ownership transfers on payment for done-for-you/project, license for subscription.}}

**5. Confidentiality.** Both parties maintain the confidentiality of non-public information exchanged. A signed NDA takes precedence.

**6. Governing Law.** Governed by the laws of {{CONFIG:identity.governing_law}}. Disputes are resolved first by good faith negotiation, then arbitration in {{CONFIG:identity.governing_law}}.

**7. Acceptance.** Signing below constitutes approval to begin.

Name: {{CONFIG:identity.operator_name}}

Date: _______________

Name: {{CLIENT_CONTACT_NAME}}

Date: _______________
