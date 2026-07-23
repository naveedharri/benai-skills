---
name: newsletter-writer
description: "Iterative daily-newsletter writing workflow for Ben AI's audience. Use when Ben wants to write a newsletter/daily email, from his Values & Beliefs doc, his Stories doc, a YouTube video, a community post, or any other insight. This is a CREATIVE, STEP-BY-STEP process - never output a complete newsletter immediately. Each step requires suggestions, user decision, then progression to next step. Triggers: newsletter, daily email, write newsletter, email content, repurpose video, insight to newsletter."
---

# Ben's Newsletter Writer

An iterative, creative workflow for writing daily emails in Ben's authentic voice, the story-first, anti-guru style shipped in June/July 2026.

## Start by choosing the source

Open the session by asking Ben which source to write from (unless he's already named one). Offer these four options:

1. **Values & Beliefs doc**, Ben's answered questions on work, success, fears, habits (Notion)
2. **Stories doc**, Ben's answered daily story questions: recent moments, travel, conversations (Notion)
3. **YouTube video**, promo email or insight repurpose
4. **Something else**, community post, tweet, member win, promo/lifecycle email, or a raw idea

Lead with options 1 and 2, they're the headline features of this skill. Keep them first rather than swapping in a generic source picker like "Insight or idea", "Article or blog", or "research". If you render this as a form or widget, show these same four options.

When Ben picks 1 or 2, fetch the live Notion doc (URLs + Firecrawl fetch recipe in `references/06_Values_Beliefs_Stories.md`), find answers not yet used in past emails, and propose 3–5 angles.

## Critical Rules

1. **NEVER output a complete newsletter immediately.** At each step: provide suggestions → wait for Ben to decide → only then proceed.
2. **ALWAYS read the REQUIRED READING listed at each step.** The quality of output depends entirely on these documents.
3. **Write only from the provided context documents and source docs.** Do not invent strategies, stories, facts, numbers, or member results.
4. **`08_Newsletter_Examples.md` is the style ground truth.** When any guidance conflicts, the recent examples win.

## Context Documents (in `references/`)

- `01_Ben_Profile_Background.md`, Ben's story, credentials, milestones
- `02_What_We_Do_Offer.md`, Accelerator facts, pricing, member proof, CTA phrasings
- `03_ICP_Ideal_Customer_Profile.md`, the three audiences (business owners primary)
- `04_Voice_Personality.md`, tone attributes and voice calibration
- `05_Newsletter_Strategy.md`, email types, idea sources, core beliefs, practical facts
- `06_Values_Beliefs_Stories.md`, distilled values/beliefs + how to fetch the two live source docs
- `07_Writing_Framework.md`, the daily-email formula, formatting mechanics, checklist
- `08_Newsletter_Examples.md`, ALL recent daily + YouTube promo emails (primary style reference)
- `09_Sequence_Promo_Examples.md`, promos, welcome sequence, cart abandonment, winback, lifecycle
- `10_Subject_Lines.md`, current subject line rules + every proven subject line

---

## The Process

### Step 0: Choose the Source

**Open every session by asking Ben what to write from, the exact four options from the "Start by choosing the source" section at the top of this file** (Values & Beliefs doc / Stories doc / YouTube video / Something else).

(If Ben's opening message already names the source, e.g. he pastes a YouTube link or says "write from my stories doc", skip the question and proceed.)

**Then fetch the source material:**

- **Option 1 or 2:** Fetch the live doc, Notion links and fallback `gws` commands are in `06_Values_Beliefs_Stories.md`. Cross-check against `08_Newsletter_Examples.md` to identify which answers are already used (the 200K story, Tokyo cops, taxi translator, etc.). Present 3–5 candidate angles from **unused or under-used material**, each as: the raw story/belief → the lesson it could carry → which email format fits. Note when one answer can yield multiple emails.
- **Option 3:** Get the video (transcript via available YouTube tools, or ask Ben to paste it). Ask: full-video promo email (short, see Part 2 of `08_Newsletter_Examples.md`) or repurpose one insight into a daily story email?
- **Option 4:** Ask for the material (screenshot, link, post text, or idea). For promo/lifecycle emails, use `09_Sequence_Promo_Examples.md` as the pattern library instead of the daily formula.

**STOP. Wait for Ben to pick the source material/angle.**

---

### Step 1: Lock the Core Insight

**REQUIRED READING:** `05_Newsletter_Strategy.md` (email types + core beliefs)

State back: the story, the ONE lesson it carries, and which email type this is (daily story / YT promo / engagement / promo / lifecycle). If the source is rich, flag whether it should be split into multiple emails with different angles.

**STOP. Wait for Ben to confirm the insight.**

---

### Step 2: Define the Outcome

**REQUIRED READING:** `03_ICP_Ideal_Customer_Profile.md`, `05_Newsletter_Strategy.md`

Suggest 3–5 outcome options: "After reading this, the reader will [realization/action]." Name which ICP the email primarily speaks to (business owner / agency builder / professional) and which core belief it reinforces. Remember: the audience already believes in AI, outcomes should move them from consuming to building, or from skepticism to trust.

**STOP. Wait for Ben to select.**

---

### Step 3: Outline Options

**REQUIRED READING:** `07_Writing_Framework.md`, `08_Newsletter_Examples.md` (study the relevant Part)

Propose **3 outline options** built on the daily-email formula (cold open → story → turn → lesson → bridge → CTA → sign-off → optional PS). Make them genuinely different, vary the story entry point, the humor level, the CTA style (one-liner vs. bullet block), and the PS.

For each outline:

```
OUTLINE [X]: [Short name]
Format: [daily story / YT promo / etc.], modeled on [specific example email from 08/09]
Cold open: [the actual first 1-2 lines, drafted]
Story beats: [3-5 beats]
The turn: [the pivot line]
The lesson: [one sentence]
The bridge: [how it connects to the reader's business]
CTA: [angle + one-liner or bullet-block, which Accelerator benefits from 02]
PS: [yes/no + angle]
```

**STOP. Wait for Ben to pick/combine.**

---

### Step 4: Subject Lines

**REQUIRED READING:** `10_Subject_Lines.md` (rules + full proven list)

Generate 5–7 options per the mix in `10_Subject_Lines.md`: 2 short curiosity lines, 1–2 with `(firstname)` mid-sentence, 1 humorous (if content supports it), 1 direct statement, 1 wildcard. Each with suggested preview text. Recommend one and say why in a sentence. No big-claim, listicle, or hype subjects.

**STOP. Wait for Ben to select.**

---

### Step 5: Hook Options

**REQUIRED READING:** `08_Newsletter_Examples.md` (first 3–6 lines of each example), `07_Writing_Framework.md`

Present 3–4 cold-open options (the first 3–8 lines of the email). Draw from the proven openers: scene-drop ("2 a.m., Tokyo."), famous-story question ("Have you ever heard of…?"), quoted line, "Let me guess:", or absurd claim. Each must flow into the chosen outline.

**STOP. Wait for Ben to pick.**

---

### Step 6: Write the Newsletter

**REQUIRED READING, ALL OF:** `08_Newsletter_Examples.md` (mimic these), `07_Writing_Framework.md` (formula + mechanics + checklist), `02_What_We_Do_Offer.md` (accurate CTA facts), `06_Values_Beliefs_Stories.md` (factual grounding for personal material)

**Prime directives:**
1. Adhere to sourced facts only, every number, member name, and story detail must come from the reference docs or the fetched source doc.
2. Match the mechanics exactly: 1–2 line paragraphs, ellipsis build-ups, escalation triplets, zero em dashes, "Anyways…"-style turn, "Keep going," + "Ben" sign-off.
3. One story, one lesson, one CTA.
4. Dailies 400–800 words; YT promos 150–350.
5. Insert `(firstname)` only if the subject line or a key beat earns it.
6. No hype vocabulary; no commanding copy; social proof as first name + specific context.

**Input precedence when documents conflict:** `08_Newsletter_Examples.md` → `07_Writing_Framework.md` → `10_Subject_Lines.md` → `04_Voice_Personality.md` → `05_Newsletter_Strategy.md`.

Write the full draft (subject line + preview text + body). Run the **Voice & Structure Checklist** in `07_Writing_Framework.md` and fix misses before presenting.

**STOP. Present the draft with a 2-line note on the checklist result.**

---

### Step 7: Iterate

Take Ben's feedback, re-read the relevant reference, revise. Common asks: soften a commanding line, tighten the middle, swap the CTA style, split into a second email. Never rush, the iterative process IS the value.

When the email is approved, offer to deliver it as a Google Doc (the team's review format, shared in the #funnel Slack channel).

---

## Quick Reference

**Every daily email must have:** cold open, one story, "the turn", one lesson, business bridge, story-earned CTA, "Keep going," + "Ben".

**The sign-off block:**
```
Keep going,

Ben

PS: [optional, second pitch angle, callback joke, or resource]
```

**Facts to never get wrong:** "Ben AI" with a space; $127/month (grandfathered $97); 1,000+ members / 4.9 stars / 500+ reviews; two $1M ARR businesses; 200K+ YouTube subscribers; unlimited 1-on-1 tech help; 2 weekly Q&As; 100+ skills & workflows.
