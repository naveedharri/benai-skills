# The seven gates

Each gate presents options, then stops. You do not proceed on your own judgement, and you do not write the edition until Gate 5 is cleared.

**The rule that governs all seven:** offer choices, never an open question. "Which of these five angles?" beats "what angle do you want?" every time. An open question hands the work back to the operator, which is the thing this skill exists to remove.

**Present options as text, numbered, compact.** No preamble, no restating the brief, no explaining what a gate is. The operator has run this before.

---

## Gate 0: the source and the angles

**Read:** the source itself, plus `Channels/newsletter/broadcasts/` to see what has already been used.

If the user named a source in their opening message, skip the question and go straight to angles.

Otherwise offer the four sources in the order given in SKILL.md, and lead with whichever the OS is richest in. If `Channels/youtube/published/` has an asset whose repurpose tree has no newsletter child, name that asset specifically: it is the highest-value source available and the OS already says so.

Then present **three to five candidate angles**, each as:

```
ANGLE [N]: [short name]
The raw material: [the story, belief, or moment it comes from]
The lesson it could carry: [one sentence]
Already used: [no, or which send used it and when]
```

**Check for reuse before proposing.** An angle already sent is not an angle. Read the recent sends and say which material is spent.

**When the source is rich, say so.** One answer can yield three editions. Naming that up front is more useful than pretending each source is one email.

**Stop. Wait for the pick.**

---

## Gate 1: the one insight

**Read:** `Channels/newsletter/strategy.md` for the edition types this channel sends.

State back three things, tightly:

- The story or material, in two lines
- The **one** lesson it carries, in one sentence
- Which edition type this is, named from the strategy file rather than invented

Then offer two or three sharper phrasings of the insight and let the operator pick or correct. The insight is the load-bearing decision and a vague one produces a vague edition.

If the material genuinely splits, say which second edition it would make and file that as a note in your response. Do not write two.

**Stop. Wait for confirmation.**

---

## Gate 2: the outcome and the segment

**Read:** `Context/icp/*.md`. One file per segment, and the pain points live inside each segment file.

Offer **three to five outcomes**, each in the form: after reading this, the reader will [realise / do / stop doing X].

For each, name:

- Which segment it primarily speaks to, by slug
- The pain from that segment file it lands on, **in the reader's own words** as the file states them
- Whether that segment is a content audience or a buyer segment, because top-of-funnel copy cannot address a buyer segment

An outcome that does not trace to a pain in a segment file is a guess. Say so rather than shipping it.

**Stop. Wait for the pick.**

---

## Gate 3: three outlines

**Read:** `Intelligence/research/frameworks/newsletter-structure.md`, three to six real sends from `broadcasts/`, and `Analytics/what-works.md`.

Present **exactly three**, genuinely different. Vary the entry point into the story, the register, the CTA shape, and whether there is a PS. Three variations on one outline is a failed gate.

```
OUTLINE [N]: [short name]
Modelled on: [the specific send in broadcasts/ it takes its shape from]
Cold open: [the actual first two lines, drafted]
Beats: [three to five]
The turn: [the pivot line]
The lesson: [one sentence]
The bridge: [how it reaches the reader's own situation]
CTA: [the angle, and which offer it routes to]
PS: [yes or no, and the angle]
```

**Model each one on a real send and name it.** An outline with no example behind it is a template, and templates are what make AI newsletters recognisable.

**Honour what `what-works.md` licenses.** If a pattern is in its open questions, it is untested and must not be presented as proven. If the file says the numbers contradict something, do not build an outline on it.

**Stop. Wait for a pick or a combination.**

---

## Gate 4: subject lines

**Read:** `Channels/newsletter/sop-subject-line-playbook.md` and `Intelligence/research/swipe/subject-lines.md`.

Offer **five to seven**, following the mix the playbook specifies rather than a mix invented here. Each with its preview text. Recommend one and give one sentence of reasoning.

Every option must obey the playbook's rules. If the playbook bans a construction, do not offer it as a wildcard.

**Stop. Wait for the pick.**

---

## Gate 5: the cold open

**Read:** `Intelligence/research/swipe/hooks.md`, and the first six lines of each recent send.

Offer **three to four** cold opens, each the actual first three to eight lines, drafted. Each must flow into the outline already chosen at Gate 3. An open that would need a different outline is not an option, it is a reopened gate.

Draw the shapes from the proven openers in the swipe file and in the real sends. Name which shape each one is.

**Stop. Wait for the pick.**

---

## Gate 6: write it

**Read, all of:** the recent sends again, the structure framework, `Offers/{offer}/offer.md` for the CTA facts and the live price, `Intelligence/research/swipe/ctas.md`, and the voice register plus the channel delta.

Write the full edition: subject line, preview text, body.

**Precedence when sources conflict:** the real sends in `broadcasts/`, then the structure framework, then the subject line playbook, then the channel voice delta, then the master voice register. A living example outranks a rule written about it.

**Before presenting, run the checks:**

| Check | Fail condition |
| --- | --- |
| Price | Any price not read from `Offers/{offer}/offer.md` this run |
| Metrics | Any number without a pulled date and source in `Analytics/metrics.md` |
| Proof | Any name, result or quote not in `Offers/{offer}/proof/` or `voice-of-customer.md`, verbatim |
| Em dashes | Any |
| Voice tells | Anything on the banned list in the voice register |
| Structure | One story, one lesson, one CTA. More than one of any is a fail |
| Length | Outside the range the strategy file or the real sends set |
| Sign-off | Not the one the voice register specifies |

Fix every miss before presenting. Then present the draft with a two line note on what the checks found.

**Stop. Present the draft.**

---

## Gate 7: iterate, then file

Take the feedback, re-read the specific reference it touches, revise. Common asks: soften a commanding line, tighten the middle, change the CTA shape, cut the PS, split off a second edition.

**The iteration is not overhead, it is the value.** Do not rush to close.

When the operator approves, do the four writes in `references/os-contract.md` without asking permission, then report what was saved: the broadcast path, the swipe append, the parent tree update, and the log line.

---

## What a failed gate looks like

Worth naming, because these are the ways this process quietly degrades into a one-shot draft.

| Failure | Why it matters |
| --- | --- |
| Options that are variations of one idea | The operator has nothing to choose between, so the gate is theatre |
| Proceeding without a pick | The whole point is that the operator steers |
| An option built on invented material | The insight has to come from them. You supply structure, not substance |
| Writing before Gate 5 clears | Every gate after the draft exists becomes a correction rather than a choice |
| Restating the brief at each gate | The operator is in the conversation. Say the new thing only |
| Asking an open question | Hands the work back. Offer candidates drawn from the OS instead |
