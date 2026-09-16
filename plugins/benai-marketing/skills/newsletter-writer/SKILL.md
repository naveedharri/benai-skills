---
name: newsletter-writer
description: Write newsletters for Ben Van Sprundel from any source — YouTube videos, article URLs, or raw ideas/insights. Use this skill EVERY TIME the user says they want to write a newsletter, create a newsletter, draft a newsletter, turn something into a newsletter, repurpose content for a newsletter, write an email issue, or any variation of newsletter writing. Also trigger when the user shares a YouTube URL or article URL alongside any mention of email or newsletter content. This is a STEP-BY-STEP, interactive process — never output a complete newsletter immediately.
disable-model-invocation: true
---

# Ben's Newsletter Writer

Write high-performing newsletters in Ben Van Sprundel's exact voice, tone, and structure — from any source. This is an interactive, multi-step process. Never skip steps or combine them. Every step requires user input before proceeding to the next.

**Do not use Excalidraw, diagram tools, or any visualization tools at any point. This skill produces text only.**

**Context anchor:** Ben AI's positioning is "Use AI better than 99% for real business purposes." We serve existing businesses and professionals who want to become AI-first inside their current role or company. We do NOT teach people to "start an AI business from scratch" — that positioning is retired. Every newsletter must reflect the current ICP, pain points, and offer stack defined in the reference files.

---

## STEP 0 — Identify the source

Ask Ben which source the newsletter is based on, and present these three options for him to choose from:

1. Idea or insight (I'll describe it)
2. Article URL
3. YouTube video URL

**Default expectation:** Per the current content strategy, newsletters are repurposed from YouTube only. If Ben picks 2 or 3, proceed. If he picks 1, confirm this is intentional and proceed.

**If YouTube URL selected:**
Use the Apify YouTube transcript scraper tool (`topaz_sharingan/Youtube-Transcript-Scraper-1`) to fetch the full transcript. Pass the URL as the `startUrls` input. Output the full transcript text to the conversation so Ben can confirm it looks right before continuing.

**If Article URL selected:**
Use the Apify RAG web browser (`apify/rag-web-browser`) to scrape the full article content. Pass the URL as the `query` input. Extract and present the full article text before continuing.

**If Idea / Insight selected:**
Ask Ben: "Describe your idea or insight — include any examples, angles, or stories you want to weave in."

Do not proceed to Step 1 until the source content is confirmed.

---

## STEP 1 — Read reference files (MANDATORY)

Before suggesting any angles, you MUST read ALL THREE of the following reference files. Do not skip any. Do not proceed to Step 2 until all three have been read.

Read in this exact order:
1. `references/03_ICP.md` — Ben's ideal customer profile, the three reader journeys (Operator, Executive, Senior Professional), and the six pain points
2. `references/05_Newsletter_Strategy.md` — Newsletter positioning, the 9-section structure, content ratios, and core narrative
3. `references/08_Newsletter_Examples.md` — Real newsletter examples with the voice patterns to replicate

These files are the foundation for everything that follows. Reading them is not optional.

---

## STEP 2 — Suggest 5 angles

Based on the source content and the reference files you just read, suggest 5 distinct newsletter angles.

Each angle should include:
- A working title or hook (what the reader sees first)
- 1–2 sentences on why this angle fits Ben's ICP and which pain point it speaks to
- The reader journey it's aimed at (Operator / Executive / Senior Professional — or all three)

Present all 5 and ask: "Which angle should we build this newsletter around?"

Rules for angles:
- Every angle must be rooted in claims or ideas from the source content — never invent
- Each angle should speak to a different pain point or emotional trigger from `references/03_ICP.md` (Paralysis by Analysis, Output Ceiling, Capability Doubt, Wrong Priorities, Lonely Grind, Falling Behind)
- At least one angle should be contrarian or challenge a common belief
- At least one angle should land for the team/business-owner reader (sets up an AIOS-leaning CTA in Step 5)

Wait for Ben to pick an angle before continuing.

---

## STEP 3 — Read more reference files (MANDATORY)

After the angle is chosen, you MUST read ALL THREE of the following files before suggesting outlines. Do not skip any.

Read in this exact order:
1. `references/04_Voice_Personality.md` — Ben's tone, three voice modes, vulnerability deployment, signature phrases, hard no-go list
2. `references/01_Ben_Profile_Background.md` — Ben's background, milestones, current numbers, and personal context (the only source for personal stories)
3. `references/02_What_We_Do_Offer.md` — The two main offers (Accelerator $97/mo and AIOS / Second Brain Operating System) and how to write the CTA for each

These files are essential for writing in Ben's authentic voice and crafting a CTA that matches whichever offer fits the angle.

---

## STEP 4 — Suggest 3 outline options

Based on the chosen angle and all reference files now loaded, suggest 3 distinct high-level outlines.

Each outline should follow the 9-section structure from `references/05_Newsletter_Strategy.md`:

1. **Hook** — shared problem or counterintuitive insight (1-2 sentences)
2. **Validation** — "I get it" + why this matters (2-3 paragraphs)
3. **Personal Story** — specific failure or struggle from Ben (3-4 paragraphs)
4. **The Turn** — "But here's what I learned" (1 transition sentence)
5. **Core Teaching** — frameworks, insights, patterns (4-5 paragraphs)
6. **Proof / Results** — what happened when applied (2-3 paragraphs, specific numbers)
7. **Action Steps** — specific next moves
8. **Close** — "Keep going, Ben"
9. **P.S.** — soft pitch to the right offer

For each outline, present:
- A 1-sentence description per section
- Which voice mode dominates each section (Vulnerable Teacher / Strategic Authority / Encouraging Coach)
- Which offer the P.S. points to (Accelerator if reader is solo professional / mid-career / wants to upskill; AIOS if angle is clearly institutional / team-leader / 10-100 person company)

Present all 3 and ask: "Which outline structure should we use?"

Rules for outlines:
- Every outline must follow the 9-section structure — no skipping sections
- Opening must use one of: personal vulnerability / confession, bold statement or stat, social proof stacking
- Must include a story or concrete example (from Ben's documented background or the source content — never invented)
- Vulnerability is heaviest in the first 30%, authority builds in the middle 40%, encouragement closes the final 30%
- Content ratios across the whole piece: 30% vulnerability / 40% teaching / 20% encouragement / 10% social proof
- Never suggest an outline with more than 9 sections — the body must read as a personal email, not a blog post

Wait for Ben to choose an outline before continuing.

---

## STEP 5 — Write the newsletter

Write the full newsletter following the chosen angle and outline.

**Mandatory style rules (derived from `references/04_Voice_Personality.md` and `references/08_Newsletter_Examples.md`):**
- Short paragraphs — often single sentences. Never more than 3 lines per paragraph
- Bold text for key insights, section transitions, and punchlines — this is the ONLY formatting allowed for section breaks
- Never use `##`, `###` markdown headers or `---` horizontal dividers anywhere in the newsletter body — the newsletter must read as a personal email, not a blog post or article
- Bullet points only for lists (objections, steps, comparisons) — never for narrative
- Use rhetorical questions to create tension before payoff
- Use "But here's the thing", "Here's the thing:", or similar pivot phrases for transitions
- Sign off with "Keep going," followed by Ben's name
- Always include a P.S. with a soft pitch to the right offer (see CTA Logic below)
- Target length: 700–900 words for the newsletter body. Never exceed 1,100 words

**CTA Logic for the P.S.:**
- **Default (Accelerator $97/month or $797/year):** when the reader is a solo professional, expert solopreneur, consultant, or mid-career professional wanting to upskill themselves
- **AIOS / Second Brain Operating System:** when the angle is institutional — team-wide AI, "your company has nothing", scaling AI across a department, 10-100 person businesses, building company-wide intelligence
- Never pitch both in the same P.S. Pick one based on the angle
- Never hard-sell. The mention should feel like "this is where I am" not "buy this now"

**Mandatory content rules:**
- Every claim, stat, story, or example must come from the source content or `references/01_Ben_Profile_Background.md` — never invented
- The CTA must reference the correct offer as described in `references/02_What_We_Do_Offer.md`
- Recurring phrases to use where natural: "That's it." / "Domain Expertise + AI = unfair advantage" / "99% will... Be the 1%" / "It's not rocket science" / "Here's the thing:" / "I learned this the hard way"
- Use "build" over "create". Use "grind" and "hustle" sparingly — the audience is business owners, not hustle-culture beginners

**Hard no-go list (these break Ben's voice immediately):**
- No em dashes anywhere — use commas, periods, colons, or restructure
- No corporate phrases: "circling back", "touching base", "leverage" (as a verb), "synergy", "ecosystem"
- No "I hope this finds you well" or any LinkedIn-corporate opener
- No guru energy ("I have all the answers", "I'm just a humble teacher")
- No negative parallelisms: "you're not X, you're Y" / "it's not just X, it's Y" / "this isn't X, it's Y" — rewrite as a single flowing sentence
- No triple or quadruple short-sentence staccato rhythms ("Guess X. Guess Y. Guess Z." / "You iterate. Five times. Ten times.") — two short sentences in sequence is fine, three or more reads as AI
- No "Here's the fix" as a section transition — use a descriptive bold transition that names the thing
- No outdated references: never say "start an AI business in 90 days" or "$10K/month AI business" — that's retired positioning

After writing the newsletter, do a self-review against all reference files before presenting it to Ben. Check:
- Voice and tone matches `references/04_Voice_Personality.md`
- ICP relevance matches `references/03_ICP.md` (which pain point is being addressed?)
- Strategy alignment matches `references/05_Newsletter_Strategy.md` (9-section structure intact, content ratios hit)
- Style matches patterns in `references/08_Newsletter_Examples.md`
- CTA points to the correct offer

Present the newsletter in full.

---

## STEP 6 — Suggest 10 subject lines

After presenting the newsletter, suggest 10 subject line options.

Rules (non-negotiable):
- Every subject line must be 3–8 words maximum
- All lowercase (sentence case) — never title case or ALL CAPS
- Personal, punchy, curiosity-driven or bold-claim style
- Should feel like a message from a friend, not a marketing email
- Never use em dashes

Present all 10 and ask: "Which subject line are we going with?"

---

## STEP 7 — Finalize and save

Once Ben selects a subject line, update the newsletter file with the chosen subject line at the top and save it to the workspace folder as a `.md` file.

Confirm the file has been saved and share the link.

---

## PROGRESSIVE SELF-UPDATE RULE

Monitor every message Ben sends during and after the newsletter process.

If Ben says anything like:
- "don't do X anymore"
- "never do Y"
- "stop doing Z"
- "always do X instead"
- "add a rule that..."

Immediately update the RULES section of this SKILL.md file with the new rule. Confirm to Ben that the rule has been added. Do not ask for permission — just do it and confirm.

This ensures the skill improves automatically with every use.

---

## RULES

- Subject lines must be 3–8 words maximum, all lowercase — no exceptions
- Never invent claims, examples, or stats — base everything only on the source content and Ben's documented background in the reference files
- Always read ALL reference files at the exact steps specified — never skip, never defer, never batch them differently
- Give multiple options (5 angles, 3 outlines, 10 subject lines) at every decision point — never present just one
- Present all options as numbered lists and ask Ben to choose — wait for his response before continuing
- Never output the complete newsletter immediately — follow the step-by-step process in order
- Always do a self-review of the newsletter against all reference files before presenting it to Ben
- Never use em dashes anywhere — in the body, in subject lines, or in the P.S.
- Never use `##`, `###` markdown headers or `---` dividers anywhere in the newsletter body — bold text only for section transitions
- Outlines must follow the 9-section structure from `references/05_Newsletter_Strategy.md` — never collapse or skip sections
- Newsletter body must target 700–900 words — never exceed 1,100 words
- Content ratios must hit roughly 30% vulnerability / 40% teaching / 20% encouragement / 10% social proof
- The P.S. must point to ONE offer (Accelerator OR AIOS) based on the angle — never both in the same newsletter
- Never use negative parallelisms ("you're not X, you're Y" / "it's not just X, it's Y") — these are an AI tell
- Never use triple or quadruple short-sentence staccato patterns ("X. Y. Z.") — reads as AI
- Never use "Here's the fix" as a section transition — use a descriptive bold transition that names the thing
- Never use retired positioning: no "start an AI business", no "$10K/month in 90 days", no "AI agency in 90 days". The mission is helping existing businesses and professionals use AI better than 99% for real business purposes.
- Sign off must be "Keep going," followed by Ben's name — never "Best,", "Cheers,", "Warmly,", or any corporate signoff
