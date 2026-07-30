# Folder indexes

Every folder gets its own `CLAUDE.md`. This is the nervous system the OS runs on: the root router points at a folder, the folder index points at a file, and nothing is more than three hops from the entry point.

Each is under 120 lines and carries a purpose line, a files or routing table, and rules.

**Eight indexes: the root, plus one each for `Context/`, `Channels/`, `Campaigns/`, `Offers/`, `Analytics/`, `Intelligence/`, `Routines/`, and `Team/` when it exists.** Never write an index for a folder that does not exist.

## Root CLAUDE.md

The only file in root. Under 200 lines. Structure:

```
frontmatter: os-mode, os-name, operator, org, status, tags
one-paragraph identity statement, then why the OS exists
## Session startup      read the latest Intelligence/logs/ and Context/config.md silently
## The core rule        brain-update versus action, as a callout
## Knowledge routing    the table. "Every piece of information has one home.
                        No catch-all." Ends with: "For specifics, read that
                        folder's CLAUDE.md."
## Conventions
## Rules                numbered
## Routine map          the ten routines in two groups: tag, cadence, writes-to
## The design test      every folder is permanent context or a routine writes to it
## Locked decisions     why it is shaped this way, so nobody relitigates
## Anti-patterns
<!-- USER CORRECTIONS: Add new rules below as the operator teaches you -->
```

The routing table has exactly one row per destination, no catch-all row, and **every row must resolve.** If a piece of information does not obviously match a row, that is a routing gap worth naming rather than a reason to add a miscellaneous folder.

The `USER CORRECTIONS` sentinel makes the OS self-teaching: a correction from the operator becomes a permanent rule there without being asked.

**The routine map here and the register in `Routines/CLAUDE.md` must agree.** Two disagreeing routine tables is the most confusing failure a new operator can meet.

## Every folder index carries the same three things

1. **What lives here**: path, what it holds, and which routine writes it or "Human".
2. **What does NOT belong here**: the wrong thing, and where it goes instead. This table prevents more mess than the first one.
3. **Rules** specific to the folder, then a short `## Graph` naming what it reads from and writes to.

## Context/CLAUDE.md

Purpose: the constitution, read by every skill.

Files table with three columns: path, what it holds, how often it changes.

Rules: it is authoritative so nothing duplicates it; two levels of context, this folder being the quick lookup while offer-specific and channel-specific context live in those folders; **pain points live inside each `icp/<segment>.md`, never as a file or folder of their own**; `config.md` is the only file a new operator rewrites end to end; pain sections are appended, not rewritten. Human-written, no routine authors a file here.

Does not belong: a price or package (`Offers/`), cadence or format rules (`Channels/<channel>/strategy.md`), our own numbers (`Analytics/`), a competitor or customer quote (`Intelligence/`), a task list (`Team/`).

## Channels/CLAUDE.md

Purpose: one folder per surface actively produced for, standing playbook plus live state. The channel table changes per business, so this is the one index that is not portable.

Two tables: the channels with their role, and what a channel folder holds.

Rules: exactly one channel is `role: primary-original` and everything else repurposes from it; a channel file describes the surface, not a single post; `voice.md` is a **delta** and must not restate the master register; repurposing is directional so only the primary channel documents the outbound cascade; **performance numbers live next door in `Analytics/channels/<channel>.md`, never here**; an email channel takes `flows/` and `broadcasts/` instead of `pipeline/` and `published/`; an empty `published/` can be correct.

Does not belong: a price, the ICP or master voice, a time-boxed push, channel stat series, a competitor's channel, any media file.

## Campaigns/CLAUDE.md

Purpose: time-boxed coordinated pushes, and what is not one. Include the folder layout: `brief.md`, `deliverables/`, `results.md`.

The most important rule in the OS goes here: **a brief links its offer, its ICP segments and its channels. It never copies them. No `offer/` and no `icp/` subfolder inside a campaign, ever.**

Other rules: folders are `YYYY-MM-<slug>` because a campaign is a time-boxed object that must archive cleanly; a campaign starts with a hypothesis and a number, and one whose goal has no number renders as unevaluable rather than as healthy; a campaign email is a broadcast that lives on the email channel with a `campaign:` frontmatter field; `results.md` is the single home for how it went, and the retro is not optional; findings graduate to `Analytics/what-works.md`; no active campaign is a normal state.

## Offers/CLAUDE.md

Purpose: the funnel ladder, free through paid.

Rules: **every offer uses the same template**, `offer.md` + `proof/` + `landing.md`; proof lives with the offer because that is where it gets deployed; a lead magnet names the offer it ladders into; **prices live here and in `Context/config.md` and nowhere else**, because a copied price is wrong within days; a landing page belongs to the offer it sells unless the website is a channel in its own right; an offer with no proof gets a `proof/README.md` naming what would need collecting and **never an invented testimonial**; an offer may be a price ladder rather than a single price, in which case every step carries its effective date.

## Analytics/CLAUDE.md

Purpose: outbound performance, our numbers. State the split plainly: **this folder is us, `Intelligence/` is the world.**

Files table with cadence.

Rules: every number carries its pulled date and source, and a number without both does not get written; **never fabricate, estimate, interpolate or carry forward**, a failed pull says so and names the connector; snapshots are immutable and corrections are appended as new dated entries; **a tag count is not a subscription count**; derived figures are labelled derived; never substitute a lifetime count for a windowed one; `what-works.md` is the feedback loop that writers read before drafting and its confirmed section ships empty; funnel first in every report; a metric nobody would act on gets cut.

Explain why `snapshots/` and `channels/` are both needed: a snapshot is the immutable record of one day, which is what makes a delta computable, while a channel file is the series derived from those snapshots, which is what makes a trend readable.

## Intelligence/CLAUDE.md

Purpose: inbound understanding plus org memory. State the split plainly: **this folder is the world, `Analytics/` is us.**

Routing table with three columns: category, route to, written by. Cover `logs/`, `research/` including `swipe/` and `frameworks/`, `competitors/`, `market/`, `decisions/`, `meetings/`.

Rules: quote, do not paraphrase, and **every quote carries the named source file it came from**; an invented customer quote is the worst failure available in this folder; intelligence must produce an action or say it produced none; competitor files are living and updated in place while digests are dated and immutable; a recurring theme graduates into the pain block inside `Context/icp/<segment>.md`; cap the scan lookback; `logs/` is where every brain-update routine appends, and a run that changed nothing still logs one line, because silence is indistinguishable from failure.

## Routines/CLAUDE.md

Ships as `assets/routines/_register.md`. Copy it in verbatim as `Routines/CLAUDE.md`.

It is both the folder index and the capability register: the B/A/H tagging table, the ten routines in two groups with cadence and write targets, the placeholder map the setup skill substitutes, the independence rule, and the rules for writing a new routine.

## Team/CLAUDE.md

Only if `Team/` exists. One folder per person who owns marketing work.

Rules: why this is not inside `Context/`, namely that you should not have to read somebody's task list every time you load the brand context; a solo operator skips the folder entirely; a person file is role and responsibilities scoped to marketing and links the master voice rather than restating it; and a **"who is not here, and why"** section for anyone who owns a funnel rung but belongs to another system. That last section is what stops the roster quietly growing into a company directory.

## The test that this layer actually works

**Walk the discovery chain as a new agent would.** Open the root `CLAUDE.md`, pick a real task, follow the routing table to a folder, open that folder's `CLAUDE.md`, and land on the right file. If any hop requires a guess, the index is wrong.

Then **verify every path named in every index exists.** An index pointing at a folder that is not there is worse than no index, because it teaches the reader that the routing cannot be trusted.
