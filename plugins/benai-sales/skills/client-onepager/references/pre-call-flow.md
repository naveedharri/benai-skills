# Pre-call flow

Use this when the call hasn't happened yet and the user wants a one-pager ready to share or use as a leave-behind. The personalization is research-grounded, not transcript-grounded. Don't fake post-call detail you don't have.

## Inputs

Minimum: the client's first name. Useful but not required: company name, call date, price tier.

## Research (in parallel)

Run these lookups concurrently, they're independent and the user wants this fast:

### 1. Gmail thread search for Calendly intake

The Calendly notification email reveals: full name, email domain (= company domain in most cases), and the scheduled time.

```
mcp__e848247c-6d54-4329-bd1b-0b7d6980bae4__search_threads
  query: "<first name>" after:<recent date>
  pageSize: 10
```

Look for the message from `notifications@calendly.com` with subject `New Event: <name> - ... - Business OS Setup`. That gives you the canonical name + email + scheduled time.

### 2. CRM lookups (Attio + Pipedrive in parallel)

```
mcp__4505d27c-...__search-records  object=people  query=<name>  limit=10
mcp__pipedrive__search_persons     term=<name>  fields=name,email  limit=10
```

CRM hits give you company context, prior interactions, and sometimes notes from past meetings.

### 3. Web search for the company

Once you have the email domain, search for it:

```
WebSearch  query: "<domain>" <name> what they do
```

The domain often reveals the brand. Mismatches are common, e.g., Jamie's email was on `propertydevelopmentsystem.com` but her current business is a hotel (not the property development company). Don't trust the domain alone. Check the LinkedIn result for current role, then web-fetch the site if needed.

## Personalization with thin context

The pre-call version of the one-pager doesn't pretend to have transcript-level intimacy. The goal is *grounded enough to feel personal* without *guessing at pain points*.

### Hero subhead

Write 1–2 sentences anchored in the **industry / business model** you found, not in *pain points you imagined*. Examples that worked:

- **VNTRS (Nordic venture studio):** *"One operating brain across every venture in the studio, every client engagement, every product VNTRS is shipping. Context that compounds across the portfolio, not stuck inside one company."*
- **Kortado (NDIS compliance SaaS):** *"One brain across product, customer success, sales, and the NDIS / aged care regulatory shifts that move overnight. Every rule change, every customer pain point, every roadmap decision in one connected place."*

If the persona is **Personal OS**, lean into the founder + assistant frame instead. If you're not sure yet, default to a slightly generic but business-model-aware subhead.

### Hero card pill (one-liner)

Pick from the persona menu in `variants.md` or write a fresh one-liner that captures their setup in 4–7 words. Examples:

- Venture studio → "Multi-venture access control via Relay"
- Multi-product founder → "Course + software + community in one brain"
- Compliance / regulated industry → "Founder + team-level access control via Relay"
- Distributed team → "Multi-office access control via Relay"

### Automation cards

**Stay TBD.** Pre-call, you don't know what they'll prioritize. The placeholder copy should hint at industry-relevant possibilities so the client reads it and thinks *"oh, that's exactly the kind of thing I'd want"*.

Example TBD placeholder for a venture studio:
> *"Locked together once we've mapped your venture studio operations. Could be portfolio reporting, client engagement ops, or product-team enablement."*

Example for a compliance SaaS:
> *"Locked together once we've mapped your operations. Could be NDIS provider outreach, regulatory-update content engine, customer success workflows, or product feedback loops."*

This phrasing is doing real work, it signals *you understand their domain* and *you have automation ideas* without overcommitting.

### Section header

`"What we'll build for <Company>."`, the company name lockup, not the person's name.

### Three steps to kickoff

Standard pre-call language. Step 1 = sign + pay + receive questionnaire + book kickoff. Step 2 = onboarding call kicks off the 30 days. Step 3 = 30-day build + 30-day support.

### Slot picker

Three upcoming **Tue/Wed/Fri** slots after today. Use real dates (not "TBD"). Timezone matches their location, see `variants.md`.

## What to flag to the user when handing over

Pre-call deliverables should come with 2–3 talking-point angles. The user is heading into a call and wants ammo, not just a URL. Examples of useful angles to surface:

- Industry-specific pain hypothesis: "Their B2B sales motion is likely founder-led WhatsApp, the intent-signal outreach pitch will land if you probe how they prospect today."
- Personal-fit hook: "They went to your school / they're ex-[notable company], natural opener."
- Watch-outs: "He runs a franchise hotel, so the email integration question (Outlook lockdown) might come up, have the workaround ready."

These are bonus output, not a required field, but they make the deliverable significantly more useful.
