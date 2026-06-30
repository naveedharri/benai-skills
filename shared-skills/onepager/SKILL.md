---
name: onepager
description: Generates a personalized {{Seller}} x {{Client}} sales one-pager (HTML) for a discovery, sales, or onboarding call, then hands it over as a file and, when Vercel is available, a shareable link. The leave-behind that follows or precedes a call: hero, scope breakdown, outcomes, pricing, inclusions, kickoff steps, and a scheduling CTA. Offer-agnostic and config-driven: it reads the rep's offer, brand, pricing, and identity from config (or a Sales OS Context/ folder), so it works for ANY rep selling ANYTHING. Use ANY TIME the user asks to prepare, create, build, make, draft, or personalize a one-pager for a sales call. Triggers on "prep the one-pager for my call with X", "create a one-pager based on the call with X", "personalize the one-pager from the transcript", "make a one-pager for [client] at [price]", or "build a one-pager for [name]". Handles BOTH pre-call (research-grounded) and post-call (transcript-grounded) scenarios. Always writes the HTML file; deploys and returns a link only if Vercel is set up.
---

# onepager

You generate a personalized HTML one-pager for a sales prospect, write it to a file, and (when Vercel is available) deploy it and return a shareable link. The one-pager is the visual leave-behind that follows a sales call or precedes one. It is the rep's most important offer asset.

This skill is offer-agnostic and config-driven. Every business-specific value (who the seller is, what they sell, how they price it, how they brand it) comes from config or a Sales OS `Context/` folder. The skill ships a proven STRUCTURE, not an offer. Read config first, then ground the rep's offer in the structure.

## Read config before anything else

Resolve the rep's specifics in this order, first hit wins:

1. **Sales OS `Context/` folder** in or above the working directory (`Context/offer.md`, `Context/brand.md`, `Context/config.md`). If present, the user is inside a Sales OS. Read it as the source of truth.
2. **`config/offer.md`** at the project root (the post-disco sibling config; same schema).
3. **`config/onepager.md`** at the project root, if a one-pager-specific config exists.

If only `*.example.md` files exist, or nothing is found, the config is not set up. Tell the user what you need (see `references/substitution-map.md` for the full list) and either ask for it inline or proceed with a clean neutral default brand, stating that you did.

From config, resolve up front (see `references/substitution-map.md` for the `CONFIG:` source of each):

- **Identity:** seller name, the lockup form (`{{Seller}} x {{Client}}` or the rep's own), signer name and email.
- **Brand / design system:** brand colors, fonts, accent. Slot these into the template's CSS variables. No brand info means use the neutral default already in the template.
- **Positioning:** program or offer name, one-line positioning, framing (`done_for_you` | `enablement` | `subscription` | `project` | `other`).
- **Scope blocks:** the ordered services, phases, deliverables, or workstreams, and what to call them.
- **Pricing:** model (`one_time` | `recurring` | `tiered` | `deposit_milestone` | `quote`), amount, currency, terms.
- **Inclusions and tooling:** what the price includes, plus any client-side tool or subscription costs to list.
- **Support and next steps:** support window, the steps to kickoff, the scheduling channel and timezone.

## Always check for and align to an existing proposal

Before building, ask: *"Is there already a proposal for this client (a doc, a deck, a PDF, a PandaDoc, anything sent or drafted)?"* This matters most post-call, where a formal proposal often already exists.

If one exists, read it and treat it as the **source of truth**. Align the one-pager to it on every locked term: price, payment terms, scope, named services, timeline or phases, positioning, and every inclusion. The one-pager is the visual companion to the proposal: the two must never contradict each other. If they disagree on any locked term, surface it to the user rather than silently picking one.

If no proposal exists yet, proceed with the call or research grounding, and note the one-pager may itself become the basis for the proposal.

## Workflow

### Step 0: Fork, is this pre-call or post-call?

The user usually says. If ambiguous, ask one question: *"Has the call happened yet, or are we prepping for it?"*

- **Pre-call** → research the client (CRM, email intake, web). Write grounded-but-research-level copy. Scope cards hint at offer-relevant possibilities but stay TBD. See `references/structure.md` (pre-call section).
- **Post-call** → pull the call transcript from the rep's configured notetaker, ground every section in the client's actual words, lock the scope cards to named, agreed items. See `references/structure.md` (post-call section).

Both paths converge at Step 3 (the same edit, write, optional-deploy pipeline).

### Step 1: Gather the inputs

1. **Client name** and the **brand to lock up** (their company, or their personal name if the brand is not theirs to claim).
2. A **slug** for the file and any deploy (lowercase, no spaces).
3. **Pricing** for this client, from config, adjusted only if the user states a different figure.
4. The **scope items** for this client (named post-call, TBD-with-hints pre-call).
5. **Timezone** for the scheduling CTA.
6. **Existing proposal**, per the section above. If one exists, it drives every locked term.

### Step 2: Resolve the brand and variants

- Slot the rep's `CONFIG: brand.colors` and `CONFIG: brand.fonts` into the template's CSS variables. No brand config means keep the clean neutral default.
- Decide the variant axes deliberately: pricing model, scope-block count, framing, persona scale (solo or team), timezone. See `references/structure.md` for what each drives.

### Step 3: Stage the working file

```bash
SLUG="<lowercase-slug>"
OUT="<output_dir-from-config-or-./clients>"
mkdir -p "$OUT/$SLUG"
cp .claude/skills/onepager/assets/template.html "$OUT/$SLUG/one-pager.html"
```

The template ships brand-neutral with clear `{{PLACEHOLDER}}` markers. You substitute them in Step 4.

### Step 4: Apply the substitutions

Open `references/substitution-map.md` and work top to bottom. Every personalization point is enumerated there with its `CONFIG:` source. The critical spots to never miss:

- Title bar, hero name lockup, footer lockup (the 3 brand spots)
- Prepared-for line (name + date)
- Hero positioning pill and persona-grounded subhead
- The scope cards (tag + title + description + flow steps each)
- Outcomes block
- Pricing block (model-aware)
- Inclusions and tooling block
- Steps to kickoff
- Scheduling CTA (dates + timezone + footer note)

### Step 5: Grep for leftovers (safety check)

After substitutions, grep for any leftover placeholder or prior-client strings:

```bash
grep -niE "\{\{|CONFIG:|lorem|placeholder|example\.com" "$OUT/$SLUG/one-pager.html"
```

It should return clean. Any `{{...}}` left means a missed substitution. Also grep for any previous client's name if you reused a filled file.

### Step 6: Hand over (deploy is OPTIONAL)

Deployment is optional. Always write the file. Then follow `references/deploy.md`:

- **If Vercel is available** (CLI authenticated, or the Vercel deploy tool present), deploy and return a shareable link.
- **Otherwise**, hand over the local file path and offer to open it in a browser. Do not block on deployment, and never claim a link you did not produce.

### Step 7: Report

Return to the user with:

1. The file path, and the share link if you deployed one.
2. A short list of what you personalized and from where (transcript quotes, research finds, config values).
3. Any flags worth raising (a stated constraint that affects the proposed scope, a price that needs confirming).
4. Optional, pre-call only: 2 to 3 talking-point angles for the call.

## Hard constraints

- **No em dashes anywhere.** Use periods, commas, colons, or restructure.
- **Every value is config-driven.** Do not hardcode the rep's offer, brand, or price into the template. The template is the canonical neutral starting point.
- **No leftover `{{PLACEHOLDER}}` in the shipped file.** Grep before handing over.
- **Never invent a deploy link.** Write the file always; link only if you actually deployed.
- **One-pager never contradicts the proposal.** If a proposal exists, read it first and reconcile every locked term.
- **Use the client's real names.** Their tools, their words, their scope. Do not fabricate post-call detail you do not have.
- **Match the framing.** Do not impose an "implementation program" shape on a subscription or a retainer. Render scope and pricing per the configured model.

## Failure modes to watch

- **Leftover placeholders.** A `{{...}}` that slipped through makes the page look broken. The Step 5 grep catches these.
- **Wrong persona scale.** A solo founder who sees "team workshop" copy thinks you did not listen. A 20-person team that gets "just you and your assistant" thinks the offer is too small. See `references/structure.md`.
- **Stale dates.** Scheduling slots must be in the future, after any follow-up call.
- **Wrong timezone in the scheduling CTA.** Match the client's location.
- **Claiming a link with no Vercel.** If Vercel is not set up, hand over the file. Do not fake a URL.
- **One-pager contradicts the proposal.** The worst failure: mismatched price, scope, or timeline between the two makes the offer look sloppy.

## When to update this skill

If a new structural pattern emerges (a new section, a new pricing model rendering), update `references/structure.md` and `references/substitution-map.md`. Only touch `assets/template.html` when the change is universal, never client-specific. The template stays the canonical neutral starting point that gets personalized per call.
