---
name: marketing-os-newsletter
description: "Write a newsletter edition from the Marketing OS, gated step by step, then file it into the OS as a real asset. Reads the ICP, the voice register, the offer and its live price, the measured patterns and the swipe file from the OS rather than from bundled copies, so nothing is ever quoted from a stale duplicate. Sources from a published pillar asset, the values and beliefs doc, a community post or a raw idea. Seven gates, options at every gate, and the edition is only written after the angle, insight, outcome, outline, subject line and hook are all confirmed. On approval it writes Channels/newsletter/broadcasts/YYYY-MM-DD-slug.md with real frontmatter, appends the shipped subject line to the swipe file, updates the parent pillar's repurpose tree and logs the run. Run from the Marketing OS root. Use when the user says 'write a newsletter', 'draft the daily email', 'turn this video into a newsletter', 'newsletter from the OS', 'repurpose this into an email', or runs /marketing-os-newsletter."
disable-model-invocation: true
argument-hint: "[source, e.g. a published video slug, 'values doc', or a raw idea]"
---

# Marketing OS Newsletter

Write one edition, in the operator's voice, from what the OS already knows. Then put it back in the OS.

**This skill carries no context of its own.** No ICP file, no offer summary, no voice guide, no example folder. Every one of those exists once in the OS and this skill reads it there. That is the whole point: the original newsletter skill shipped ten reference files and six of them were copies that went stale the moment the business changed. A price baked into a skill is wrong within days.

Run from the OS root. **Stay inside that root.** Read and write only within it, and do not go looking for other vaults on the machine. **Start from zero on identity.** Every name, handle, price and number comes from the OS or from the user in this conversation, never from your context, the system username or the folder name. If the OS does not name it, you do not know it.

## First, check the OS is there

| State | Do |
| --- | --- |
| No `Context/config.md` | Not a Marketing OS. Point at `marketing-os-setup` and stop |
| No `Channels/newsletter/` | The channel does not exist here. Say so and stop |
| Both exist, `broadcasts/` empty | Run anyway. Say the style ground truth is missing and name what would fix it |
| Both exist, `broadcasts/` populated | Normal run |

## The read map

Read these before drafting, and read them from the OS every run. Full contract in `references/os-contract.md`.

| What you need | Where it lives |
| --- | --- |
| Instance literals: handles, cadence, connectors | `Context/config.md` |
| Who the reader is, and the pain to name | `Context/icp/*.md`, one file per segment |
| The master voice register | `Context/personal-brand/voice.md` |
| The newsletter delta only | `Channels/newsletter/voice.md` |
| Role in the funnel, format contract, cadence | `Channels/newsletter/strategy.md` |
| Subject line mechanics | `Channels/newsletter/sop-subject-line-playbook.md` |
| The edition structure | `Intelligence/research/frameworks/newsletter-structure.md` |
| Proven openers, subjects, CTAs | `Intelligence/research/swipe/` |
| **The style ground truth** | `Channels/newsletter/broadcasts/`, the real sends |
| What has actually performed | `Analytics/what-works.md` |
| Verbatim customer language | `Intelligence/research/voice-of-customer.md` |
| The promise, the proof, **the live price** | `Offers/{offer}/offer.md` and `Offers/{offer}/proof/` |
| Operator background, only if the edition needs it | `Context/personal-brand/background.md` |

**Precedence when they disagree.** The real sends in `broadcasts/` beat the structure framework, which beats the swipe file, which beats the voice register. A living example outranks a rule written about it.

**Read only what the edition needs.** A repurpose of a published video does not need the background file. Do not load the whole OS.

## The four properties this skill exists to hold

Every gate below is one of these. They are the reason a gated process beats a one-shot draft, and cutting any of them collapses the quality.

1. **The insight comes from the operator, not from you.** If you generate the substance, the edition is generic and anyone could send it. You supply structure, options and craft.
2. **Human in the loop, one gate at a time.** Never write the edition before the gates are cleared.
3. **Options at every gate.** Three to five real choices beat one draft to correct. Correcting is slow, choosing is fast.
4. **Ground it in real examples.** The `broadcasts/` folder is the ground truth and it grows every time this skill runs.

## The gates

Seven, in order. Each one presents options, then stops. Full prompts and option shapes in `references/gates.md`.

| Gate | What gets decided | Read first |
| --- | --- | --- |
| **0** | The source, and the candidate angles from it | the source, plus `broadcasts/` to see what is already used |
| **1** | The one insight this edition carries | `Channels/newsletter/strategy.md` |
| **2** | The outcome for the reader, and which segment it speaks to | `Context/icp/*.md` |
| **3** | The outline, three genuinely different options | `Intelligence/research/frameworks/newsletter-structure.md`, `broadcasts/` |
| **4** | The subject line and preview text | `sop-subject-line-playbook.md`, `swipe/subject-lines.md` |
| **5** | The cold open | `swipe/hooks.md`, the first lines of recent sends |
| **6** | The edition itself, written only now | all of the above plus `Offers/{offer}/offer.md` |

**Never skip a gate to save time.** The process is the product. A 20 minute gated run produces an edition worth sending; a one-shot draft produces something that reads like every other AI newsletter and gets deleted.

**If the user says "just write it", write it, and say once which gates you assumed.** Their call, not yours. Do not argue twice.

### Gate 0 sources

Offer these, in this order, and lead with whichever the OS is richest in:

1. **A published pillar asset.** `Channels/youtube/published/*.md`. The OS names the only original channel in `Channels/{primary}/strategy.md` and everything else repurposes from it, so this is the default. Read the asset, its angle, its performance block and its repurpose tree, and check whether the newsletter child already exists before proposing one.
2. **The values and beliefs doc.** Deep questions answered out loud, one a day. This is the source that keeps editions non-generic because nothing in it is researchable. If the OS has no home for it yet, say so: it belongs in `Context/personal-brand/` per the OS routing table, and this skill cannot invent it.
3. **A community post, a member win, or a customer quote.** Route through `Intelligence/research/voice-of-customer.md` for anything verbatim.
4. **A raw idea the operator brings.**

For a campaign send, read `Campaigns/{campaign}/brief.md` and carry `campaign:` into the frontmatter. The send still lives in `Channels/newsletter/broadcasts/`, never inside the campaign folder.

## Writing rules

**Never write a price.** Read it from `Offers/{offer}/offer.md`, which holds the live table with effective dates. `Context/config.md` also carries one and the two can disagree. When they do: use the offer file, tell the user which key in config is stale, and offer to fix config, because a price that exists in two versions is a bug against the OS contract and not something to work around silently. Never carry a price forward from an old send in `broadcasts/`.

**Never write a metric you did not read.** Subscriber counts, member counts, review counts and revenue figures all move. Pull from `Analytics/metrics.md` with its pulled date, and if the row says not available, say not available. A number without a date and a source does not go in the edition.

**Never invent proof.** A member name, a result, a testimonial or a quote comes from `Offers/{offer}/proof/` or `Intelligence/research/voice-of-customer.md`, verbatim, with its source. If the folder is empty, the edition ships without proof. An invented testimonial is the worst failure available here because it will be read as real and then repeated.

**Never use em dashes.** Periods, commas, colons, or restructure the sentence. Same for the rest of the generic-AI tells listed in the voice register.

**One story, one lesson, one call to action.** Length and mechanics come from `Channels/newsletter/strategy.md` and the real sends, not from a number in this file.

**Read `Analytics/what-works.md` before Gate 3 and honour what it licenses.** It separates findings from untested beliefs on purpose. Do not quote an open question as though it were measured, and do not lean an edition on a pattern the file says the numbers contradict.

## On approval, write it into the OS

This is the half the original skill did not do. Nothing here is optional.

1. **File the edition.** `Channels/newsletter/broadcasts/YYYY-MM-DD-<slug>.md`. Frontmatter and body shape in `references/os-contract.md`. It carries `type`, `date`, `channel`, `status`, `stage`, `source`, `pain`, two or more specific `tags`, and `campaign` when it belongs to one. Entity names are wikilinks woven into sentences, never a bullet list of references.
2. **Append the shipped subject line** to `Intelligence/research/swipe/subject-lines.md` with its date. The swipe file is how the next run gets better, and it only grows if this step happens.
3. **Update the parent.** If the source was a published pillar, add this edition to that asset's `## Repurpose tree` as a wikilink. A cascade nobody records looks like a cascade that never ran.
4. **Log it.** `Intelligence/logs/YYYY-MM-DD.md`, naming the file written and the specific change. This is a hybrid: it produces a deliverable and it changes what the OS knows, so it logs the knowledge change only.

**Never ask permission to save.** Write to the right file and report what was saved.

**Sending is not your job.** You file the edition. Pushing it to the email platform is a separate step the operator or a routine does, and this skill never sends.

## If something you expect is missing

A missing file is a finding, not a failure. The OS may be young or mid-edit and a run must still complete.

| Missing | Do |
| --- | --- |
| A `Context/` file this skill names | Say so once, continue with what exists, and name what the gap cost |
| `broadcasts/` is empty | Continue. The structure framework becomes the ground truth. Say the first send has no example to match |
| `Analytics/what-works.md` | Continue and say no measured patterns were available. Never substitute a guess |
| A price in the offer file | Stop before Gate 6 and ask. Never estimate a price |
| `Intelligence/research/swipe/` | Continue, and create nothing outside your scope. A stub written by the wrong skill is worse than an honest gap |

Create only the files this skill owns: the broadcast, the swipe append, the parent's tree line, the log.

## Render a review sheet, only if asked

The edition itself is markdown and that is the deliverable. If the user wants something to read or circulate, call the **`instant-ui`** skill with the subject line, preview text, body and the gate decisions, and give it an output path. Do not build a page yourself and never hardcode a colour: instant-ui owns the design language and its tokens trace to `Context/brand/brand-kit.md`.

## Self-improvement

This skill is never finished. Improve it as you use it.

- When the user corrects how a gate ran, update `references/gates.md` so the correction sticks. Do not just fix it for this run.
- When a correction is a hard rule ("always X", "never Y"), add it to the writing rules above.
- **When an edition lands well, the example belongs in the OS, not in this skill.** It is already in `broadcasts/`. If it is a genuine model, note why in `Intelligence/research/swipe/`. Never start a local examples folder here, because that is how the duplication this skill removed comes back.
- When a read path in the map turns out wrong, fix the map and `references/os-contract.md` together.
- Keep the skill small: when you add something, run the deletion test and cut anything that no longer changes behaviour.

## Files

| File | Contains |
| --- | --- |
| `references/os-contract.md` | Every OS path this skill reads and writes, the broadcast frontmatter and body shape, the log line format |
| `references/gates.md` | The seven gates in full: what each presents, the option shapes, what it reads, what it must not do |
