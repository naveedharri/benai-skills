# Enrichment and verification

After sourcing and qualification you have companies and people but often not their contact details, or details you cannot trust. Enrichment finds the email and phone; verification proves the email is real. The non-negotiable rule: **only verified emails move forward.** A campaign sent to unverified addresses bounces, and bounces wreck sender reputation, which is the one asset a cold channel cannot operate without.

## Order of operations

1. **Dedup first.** Collapse duplicate people and duplicate domains before any paid call. Paying twice for the same record is pure waste.
2. **Find the email** by full name + company domain.
3. **Find the phone** (only if the campaign uses calling/WhatsApp).
4. **Verify the email.** Keep verified; drop or quarantine the rest.
5. **Casualize the company name** for natural personalization downstream.

## Email finders

Default to AnyMailFinder; switch by config or availability. In vault mode the chosen provider is in `Context/config.md` / `Context/stack.md`.

| Provider | Strength | Notes |
| --- | --- | --- |
| **AnyMailFinder** (default) | Verified-email-first billing; bulk API | You are billed mainly for emails it can verify, which keeps cost tied to usable output. Bulk endpoint takes `[domain, first, last]` rows; poll for results. Falls back gracefully when an email cannot be found. |
| **Apollo** | Email + mobile in one credit system | Good when you also want phone and firmographics; credit-metered. |
| **Prospeo** | Mobile/phone + LinkedIn-email | Strongest for phone numbers and for resolving an email from a LinkedIn URL. |

**Input you need:** a clean company domain (not a personal domain) and the person's first/last name. Filter out personal email domains before lookup, there is no company email to find behind gmail.com. Personal-domain filter list:
```
gmail.com, yahoo.com, hotmail.com, outlook.com, live.com, aol.com, icloud.com, me.com, mail.com,
protonmail.com, zoho.com, yandex.com, gmx.com, fastmail.com, msn.com, qq.com, 163.com, naver.com,
mail.ru, web.de, gmx.de, orange.fr, free.fr, ymail.com, comcast.net, att.net, bigpond.com
```

## Phone

Use Prospeo (or Apollo) only when the cadence includes a call or WhatsApp step. Phone enrichment is more expensive and lower-hit-rate than email; do not pull it by default.

## Verification gate

- Keep only addresses the finder marks verified/valid (sometimes called "deliverable" or "safe").
- "Catch-all" or "risky/accept-all" addresses are a judgement call: include them only in a separate, clearly-labeled segment, never in the main verified list, since they inflate bounce risk.
- Records with no findable verified email are dropped from the email campaign (they can still feed a LinkedIn-only or phone-only cadence in `outreach`).
- Report the find-rate and verify-rate. A low find-rate usually means a bad domain column or wrong names from the source, fix upstream rather than shipping a thin list.

## Casualize company names

Strip legal suffixes (Inc, LLC, Ltd, Pvt Ltd, GmbH, BV, Corp, Co), trademark marks, and location noise that is not part of the brand, so "Jonathan Williams Inc" becomes "Jonathan Williams". A casual name reads human in an icebreaker; the legal name reads like a mail merge. Use the domain as a hint when the brand is ambiguous. This can run as one batched LLM pass over all companies.

## Output of this phase

The list now carries, per lead: verified `email` (and `phone` when pulled), a verification status, and a casual company name, on top of the qualification columns. Persist it to disk before Phase 6.
