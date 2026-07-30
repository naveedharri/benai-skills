# Interview

Pillar 2. Nine questions produce the `Context/` layer. Four more files are derived, not asked.

Do not fire all nine at once. Ask in order, write the file as soon as you have enough, and tell the user what you wrote. Momentum matters more than completeness, and a thin file that gets improved later beats an unanswered questionnaire.

## The rule that governs every answer, and it is the whole point of this pillar

> **Every word in `Context/` comes from this user's own business. Nowhere else.**

This is the rule most likely to be broken, and breaking it is the single worst failure available to this skill.

The machine you are running on may hold other people's operating systems, other companies' vaults, example OS folders shipped with a plugin, a Marketing OS belonging to whoever built this skill, or connectors authenticated to somebody else's accounts. **None of it is a source.** An OS seeded from another business's ICP, offer, voice or positioning is worse than an empty one: it reads as finished, every downstream skill inherits it, and nobody goes back to check.

Before you read any file to populate `Context/`, it must pass the three-part source test in SKILL.md. That test is written once, there, and governs every pillar rather than just this one.

If a file fails any part of it, do not read it and do not mention it as an option. **Ask the user instead.** A thin file built from nine honest answers is the correct output. Silence is fine, invention is not, and a borrowed answer is a species of invention.

The same applies to the connectors. Probe what is authenticated, but a connector wired to an account that is not the user's is not a source for their `Context/`.

## The second rule

**Write what they say, not what sounds good.**

A vague ICP produces vague content forever, because every skill downstream inherits it. When an answer is generic, push once with a specific follow-up. If it is still generic, write it as given and flag the file as thin rather than inventing detail.

Never fill a gap with plausible marketing language. A `Context/` file that reads well and is not true is worse than an obviously incomplete one.

## The nine

### 1. The operator, writes `personal-brand/background.md`

What shapes the voice of whoever fronts this brand's marketing.

**Do not ask for a name, and never offer one you appear to already know.** Start from zero, per SKILL.md: no name, no email, no company name goes into a question or a pre-filled field. `operator_name` and `operator_email` stay empty unless volunteered unprompted, and nothing downstream reads them.

Ask about the role and the story, not the identity: what they do here, the background that makes the positioning believable, how they work, what they decide personally versus what can run without them.

A file written as "the founder" or "the marketing lead" is complete. A name adds nothing the writers can use.

The background question matters more than it looks. A credible origin story is what makes positioning believable rather than theoretical, and it is what the writers draw on.

### 2. How it sounds, writes `personal-brand/voice.md`

Ask: tone attributes, what a reader should carry away, signature phrases they actually use, and **what they never say.**

Ask for the misconceptions they find themselves correcting. Those become recurring content.

If they point you at published work of their own, read it rather than asking: observed voice beats described voice every time. **Ask for the link, do not go hunting for it.** Their own work only, per the rule above.

This file is the master register. Each channel's `voice.md` later states only its delta.

### 3. Who they serve, writes one file per segment in `icp/`

**One file per segment, and the pain points live inside it.** Pain points are properties of a segment, not a category of their own. There is no `pain-points.md` and no `pain-points/` folder, ever. If they name three buyer types, that is three files in `Context/icp/`.

Ask, per segment: who this person is, what they have in common with the others, and **who they are explicitly not.**

The "not" list is the most useful part and the one people skip. Push for it. A skill that knows who to exclude writes sharper copy than one that only knows who to include.

Also ask what the segment's dominant emotion is. Every hook lands on that feeling before it offers anything.

Then, in the same conversation, the pain block for that segment: the top pains, and for each **whether the customer already knows they have it.** That distinction drives structure. If they know, lead with the solution. If you have to teach them, lead with the problem and the cost of inaction.

Ask for verbatim language. "Customers find onboarding confusing" is unusable. "I got to step four and I have no idea what a routine even is" is a hook.

If they cannot name one segment clearly, **stop and fix that before writing anything else.** Everything downstream inherits a vague ICP.

### 4. The frame, writes `brand/positioning.md`

Ask three things:

- What is the category
- **What is the enemy.** Not a competitor, the pattern or industry behaviour they exist against
- Why should anyone believe them

The enemy question produces the most useful answer in the whole interview. It is what gives content a spine, and most businesses have never articulated it.

Then the message house: the single claim, and two or three pillars each with proof.

### 5. How it looks, writes `brand/brand-kit.md`

Ask: colours with hex values, typography, and any hard design rules.

If they give you their website, offer to extract the tokens rather than asking them to recite. Ask for the URL rather than searching for it.

This is the executable contract the design and ads skills resolve by name, which is why it is a separate file from positioning. Colour tokens and competitive framing change on different clocks.

### 6. Where it is going, writes `strategy.md`

Open with the two literals routines need, asked plainly and with nothing pre-filled: **what the business is called**, and **what timezone the routines should run in.**

Then ask: the north star in one sentence, the current focus, the annual objectives, and the funnel map from first touch to paid.

Then the harder question: **what is the binding constraint.** The thing that, if fixed, would unblock everything else. That answer decides what the routines should watch.

### 7. What they sell, writes `Offers/`

**This answer does not go in `Context/`.** Prices live in `Offers/` and in `config.md`, nowhere else, because a copied price is wrong within days.

Ask: every offer, its price, what it includes, who owns it, and where each piece of content should point. One folder per offer, same template every time: `offer.md` plus `proof/` plus `landing.md`.

Then ask what is **retired.** Positioning that must not resurface, prices that changed, products that were sunset. This is what stops a skill writing a CTA for something that no longer exists. Record it in the offer file it belongs to.

If a price changes on a schedule, capture every step with its effective date rather than flattening it to one number.

**Never invent a testimonial** to fill `proof/`. A `proof/README.md` naming what would need collecting is the correct output.

### 8. The surfaces, writes `Channels/`

Ask which channels they **actively produce for**, and for each: its role in the funnel, its cadence target, its actual cadence, and who owns it. A surface they merely have is not a channel.

Then the load-bearing question: **which one is the primary original channel.** Everything else repurposes from it. If they cannot name one, surface that as a strategy problem rather than modelling around it.

Ask for the repurposing cascade from the primary. It gets recorded on the primary channel's `strategy.md` only.

### 9. The stack, writes `infrastructure.md`

Do not ask this as a list. **Probe.** See `connectors.md`.

Then ask one thing a probe cannot answer: which system is the source of truth for which number. Two tools reporting the same metric differently is the most common reason a dashboard stops being trusted.

## The four derived files

Written, not asked.

| File | Derived from |
| --- | --- |
| `Context/config.md` | Every literal mentioned across the nine answers, structured into the key groups. The only file a new operator later rewrites end to end |
| `Context/services.md` | A one-line pointer to the offer ladder. A compatibility shim: some vault-aware skills resolve `Context/services.md` by literal name |
| `Context/branding.md` | `brand/brand-kit.md` plus `brand/positioning.md` plus the segment files, in the machine-readable shape the ads and infographic skills expect |
| Each `Channels/<channel>/voice.md` | The **delta** from `personal-brand/voice.md` for that surface only. Never a restatement |

## Interview shortcuts, all of them bounded by the rule at the top

Each of these is a shortcut only when the material belongs to **this user.**

**They have their own company vault or wiki.** Ask them to point at it, then read it and confirm rather than interview. Phrase the ask with no name in it: "point me at the material you want me to read." You do not know what the business is called until they say so in this conversation. Populating from their real records beats asking someone to describe their own business from memory. Record the file you read in each `source:` frontmatter field.

Do not go looking for a vault on your own initiative, and do not read outside the OS root to find one. If you become aware of one you were not pointed at, name it and ask whether it is theirs before reading a line of it. Discovering a vault is not the same as being given one.

**They have published content.** Read it for `brand/positioning.md` and `personal-brand/voice.md`. Then copy the best pieces into `Intelligence/research/swipe/` as the voice corpus. Voice quality scales with the number of real examples available, and this is the cheapest quality lever in the OS.

**They have call transcripts or a community.** That is where the pain blocks inside each `icp/<segment>.md` come from, with real verbatim language rather than a description.

**They have nothing yet.** Then interview, write thin files, and say which are thin. That is a completely valid outcome and the routines thicken it from there.

## When you are done

Tell them which files are solid and which are thin. Thin is fine and expected. Name them so the user knows where the OS is currently weakest, and note that the pain blocks inside each segment file grow on their own once the customer intelligence routine runs.

Then state where every populated file came from. If a `source:` field names anything that is not the user's own material, that file is a bug and you remove it.
