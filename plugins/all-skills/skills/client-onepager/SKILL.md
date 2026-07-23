---
name: client-onepager
description: Generates a personalized BenAI x Client one-pager (HTML), deploys it to Vercel, and returns a shareable URL within minutes. Use this skill ANY TIME the user asks to prepare, create, build, make, draft, send, or personalize a one-pager for a sales, discovery, or onboarding call. Also triggers on variations like "prep the one-pager for my call with X", "create a one-pager based on the call with X", "personalize the one-pager from the Fireflies", "make a one-pager for [client] at [price]", or "build the same one-pager for [name] today". Handles BOTH pre-call (research-only context from Gmail, Attio, Pipedrive, and the web) and post-call (Fireflies-transcript-grounded personalization) scenarios. Always produces a live, shareable URL and saves the working file under the deliverables folder.
disable-model-invocation: true
---

# client-onepager

You generate a personalized HTML one-pager for a BenAI prospect, deploy it to Vercel, and return a shareable URL. The one-pager is the leave-behind that follows a sales call (or precedes one). It is the most important asset of the offer.

## Why this exists

Aryan and the BenAI team have iterated this one-pager dozens of times in real client conversations. The template, the substitutions, the variants, the deployment flow, the pre/post-call distinction, they all live in this skill so the next one takes minutes, not hours, and never drifts from the working pattern.

Real personas served (kept here for grounding when picking variants):

- **Samir Medrouk (Straitegics)**, Spain, strategic AI for CEOs. $5K, 50/50 split, sales + marketing automations.
- **Siddharth Munot (Bamboostan / Machau Bamboo Products)**, Mumbai/Assam D2C bamboo. $5K upfront, 2 automations: B2B outreach + One-Brain Briefing.
- **Dario Markovic**, $20M+ ecom, lean 6-person team in Miami/Santiago/Switzerland. $5K, **1 automation** (Andrew Shwetzer's framing, "done with you"). Finance Workflow + Build Queue.
- **Riley Amiri (Black Note)**, US online vaping retailer, 11 yrs, ~10 people. $5K, 2 automations: Customer Service ticket engine + Klaviyo email engine.
- **Joachim Widd (VNTRS)**, Nordic-Baltic venture studio, Stockholm. Pre-call, $8,250, multi-venture framing.
- **Jamie Carter**, Franchise hotel in Melbourne, solo Claude user + VA. $5K, 2 automations: Group Quote Engine + Daily Reports → Brain.
- **Max King (Kortado)**, NDIS/aged care compliance SaaS, Sydney founder + assistant. $5K, **personal OS** reframe (not team OS).

## Workflow

### Step 0, Fork: is this pre-call or post-call?

Determine which path you're on. The user will usually tell you, but if ambiguous, ask one question: *"Has the call happened yet, or are we prepping for it?"*

- **Pre-call** → read `references/pre-call-flow.md`. Research the client, write generic-but-persona-aware copy. Automation cards stay TBD with industry hints.
- **Post-call** → read `references/post-call-flow.md`. Pull the Fireflies transcript, ground every section in their actual words, lock the automation cards to named candidates.

Both paths converge at Step 3 (the same template-edit → deploy → share pipeline).

**Always ask about an existing proposal.** Before building, ask the user: *"Is there already a proposal for this client, PandaDoc, a Google Doc, a deck, or anything sent or drafted?"* This matters most for **post-call** one-pagers, where a formal proposal often already exists or is being written in parallel. If one exists:

- Get the link or file and **read it** (PandaDoc via the pandadoc tools, Drive/Docs via `gws`, or a shared URL via WebFetch / `defuddle parse <url> --md`).
- Treat the proposal as the **source of truth** and align the one-pager to it: price, payment terms, scope, the named automations, timeline / phases, persona framing, and every inclusion. The one-pager is the visual companion to the proposal, the two must never contradict each other.
- If the one-pager and the proposal disagree on any locked term, surface it to the user rather than silently picking one.

If no proposal exists yet, proceed with the call/research grounding as normal, and note that the one-pager may itself become the basis for the proposal.

### Step 1, Gather the inputs

Per the chosen path, collect:

1. **Client name** (e.g., "Jamie Carter")
2. **Brand to lockup** (e.g., "Jamie Carter", personal, or a company brand like "Bamboostan" or "Kortado"). If the client runs a franchise or co-founded business where the brand isn't theirs to claim, default to their personal name.
3. **Slug** for Vercel project + folder (lowercase, no spaces, e.g., `amberkhanna`, `kortado`, `bamboostan`)
4. **Pricing**, see `references/variants.md` for tiers
5. **Persona type**, Personal OS (founder + assistant, 2 Relay users) or Team OS (5+ Relay users). See `references/variants.md`.
6. **Automation count** (1 or 2), defaults to 2 for Aryan's calls. Use 1 if Andrew is the delivery partner or the user explicitly says "done with you".
7. **Timezone**, affects slot picker copy. IST / AEST / CET / PT.
8. **Payment terms**, defaults to **100% upfront** (no split panel shown). Only show 50/50 split if the user explicitly asks for it.
9. **Existing proposal**, ask whether one exists (see Step 0). If yes, read it first and let it drive every locked term above (price, payment, scope, automations, timeline, persona, inclusions). The proposal wins; the one-pager mirrors it.

### Step 2, Pick the variants

Before you edit the template, decide each variant deliberately. The most common combination today is:

> $5,000 · upfront · 2 automations · Personal OS framing · post-call personalization

If the user has stated different terms (different price, 1 automation, team OS, etc.), use those. When in doubt about pricing, default to $5,000 (it's the standard sales call quote).

### Step 3, Stage the working file

```bash
SLUG="<lowercase-slug>"
mkdir -p /Users/aryan/BenAI-Main-OS/Projects/claude-cowork/deliverables/$SLUG/
cp ~/.claude/skills/client-onepager/assets/template.html \
   /Users/aryan/BenAI-Main-OS/Projects/claude-cowork/deliverables/$SLUG/one-pager.html
cd /Users/aryan/BenAI-Main-OS/Projects/claude-cowork/deliverables/$SLUG/
ln -sf one-pager.html index.html
```

The template ships pre-filled with Jamie Carter's data. You will substitute that out in Step 4.

### Step 4, Apply the substitutions

Open `references/substitution-map.md` and work through it section by section. Every personalization point is enumerated there. The critical ones to never miss:

- Title bar, hero card name lockup, footer brand lockup (3 brand spots)
- Prepared-for line (name + date)
- Hero subhead (persona-grounded paragraph)
- Hero card pill (one-line positioning)
- Both automation cards (tag + title + description + 4 flow steps each)
- Outcomes card "X Live Automations" copy
- Pricing block (price + description)
- Tooling table (Relay user count + total)
- Three steps to kickoff
- Slot picker (3 dates + timezone + footer note)

After substitutions, grep for any leftover strings from the previous client (Jamie's terms, hotel-specific copy, etc.) to confirm nothing slipped through.

### Step 5, Deploy

Follow `references/deploy.md`. The short version:

```bash
mkdir -p /tmp/benai-$SLUG-onepager
cp /Users/aryan/BenAI-Main-OS/Projects/claude-cowork/deliverables/$SLUG/one-pager.html \
   /tmp/benai-$SLUG-onepager/index.html
cd /tmp/benai-$SLUG-onepager
vercel deploy --prod --yes --name benai-$SLUG-onepager --scope insinexzys-projects
```

### Step 6, Generate the share link

The Vercel team domain is SSO-protected. Use the share-link tool to get a public URL:

Call `mcp__664c6544-66e3-4133-9561-341e62e3abd7__get_access_to_vercel_url` with the URL `https://benai-<slug>-onepager.vercel.app`. It returns a `?_vercel_share=...` URL that anyone can open for 23 hours.

If the user wants a permanent URL (no expiry), offer to flip Deployment Protection off in the Vercel dashboard or via API. Don't do this by default, most one-pagers are confidential enough that the time-bound link is fine.

### Step 7, Hand off

Return to the user with:

1. The share link (formatted as a clickable URL)
2. A bullet list of what you personalized and from where (transcript quotes, research finds, etc.)
3. Any flags worth raising, e.g., a stated technical constraint that affects the proposed automations (Riley's Outlook restriction was a good catch)
4. Optional: 2–3 talking-point angles if it's a pre-call brief

## Failure modes to watch

- **Leftover copy from the previous client.** The template ships with Jamie's data baked in. Grep after substitutions: `grep -ni "amber\|khanna\|hotel\|RMS\|melbourne" <file>` should return clean.
- **Wrong persona framing.** A founder + assistant engagement should NOT say "team workshop" or have a Relay table with 5 users, that contradicts the pitch and confuses the client. See `references/variants.md`.
- **Stale dates.** Slot picker dates have to be in the future. Always use upcoming Tue/Wed/Fri after today.
- **Wrong timezone in slot copy.** US clients shouldn't see "AEST" in their slot picker footer.
- **Payment split shown when there isn't one.** If pricing is upfront, the `.split` panel should be DELETED from the markup, not just modified. The default template has it removed already.
- **Em dashes.** The CLAUDE.md for this vault prohibits em dashes. Use periods, commas, colons, or restructure.
- **One-pager contradicts the proposal.** If a proposal exists, mismatched price, scope, automations, or timeline between the two is the worst failure, it makes the offer look sloppy to the client. Read the proposal first and reconcile every locked term before deploying.

## When to update this skill

If you discover a new variant pattern (a new persona type, a new pricing tier, a new section on the one-pager), update both:

1. `references/variants.md`, document the new variant + when to use it
2. `assets/template.html`, only if the structural change is universal, not client-specific

Don't add client-specific content to the template. The template is the canonical starting point that gets personalized per call.

## Self-improvement

This skill is never finished. Improve it as you use it.

- When the user corrects how a step was done, update the relevant reference file (or this SKILL.md) so the correction sticks. Do not just fix it for this run.
- When a correction is a hard rule ("always do X", "never do Y"), add it as a permanent rule here.
- When the user says an output was genuinely good, save it to `references/examples/` so it becomes a model for future runs.
- Keep the skill small while you do this: when you add something, run the deletion test and cut anything that no longer changes behavior.
