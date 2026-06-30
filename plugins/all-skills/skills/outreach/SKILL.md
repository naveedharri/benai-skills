---
name: outreach
description: >-
  Turn a qualified, enriched lead list into a ready-to-run multichannel outreach campaign: strategy,
  cadence, copy, and per-lead personalization. Use this skill whenever the user wants to "write outreach",
  "write cold emails", "build a sequence", "build a cadence", "create an outreach campaign",
  "personalize my emails", "write LinkedIn DMs", "write follow-ups", "/outreach", or has a lead list and
  wants the messaging that goes to it. It designs the touchpoints across email, LinkedIn, cold call, and
  WhatsApp, writes every step of the copy in the sender's voice, personalizes each lead with parallel
  subagents, and delivers either channel-separated markdown files (emails, LinkedIn, cadence) or a direct
  upload into the user's sending platform. Trigger it even when the user does not say "cold email", as
  long as they want the words that go out to prospects. It runs downstream of the `lead-generation` skill.
---

# Outreach

Take a finished lead list and produce the campaign that gets sent to it: the channel plan, the cadence, the copy for every step, and a personalized opener per lead. The list is the fuel; this skill is the engine and the message.

Outreach succeeds or fails on three things in order: **relevance** (right person, right reason), **personalization** (proof you actually looked), and **deliverability discipline** (copy and cadence that land in the inbox and earn a reply). This skill is built around those, not around volume. The default campaign here is micro and sharp, roughly 100 to 150 leads with real personalization, not a 10,000-lead blast.

## The flow

```
0. Inputs and discovery     the list + offer, positioning, proof, objections, sender, voice, channels
1. Strategy and cadence     pick channels, touchpoints, timing                 -> references/cadence-and-channels.md
2. Copy                     write every step: email variants + follow-ups, LinkedIn -> references/copywriting-levers.md
3. Personalize              per-lead openers via subagents, then QC            -> references/personalization-categories.md
4. Deliver                  markdown files, or push into the sending platform  -> references/outreach-platforms.md
```

## Two operating modes

Same split as `lead-generation`. Detect at the start.

- **Sales OS / vault mode.** `Context/` docs exist. Read `Context/offer.md`, `Context/positioning.md`, `Context/voice.md`, `Context/config.md` as ground truth. This skill is **Hybrid**: it creates deliverables (action) and records the campaign so the OS knows it exists and can track it (brain). Write the campaign's copy to `Lead-Gen/sequences/<name>/`, register/extend `Lead-Gen/campaigns/<name>/campaign.md`, and log to `Daily/logs/YYYY-MM-DD.md`. Wikilink entities. No em dashes.
- **Standalone / client mode.** No Sales OS context. Run the discovery questions in Phase 0, deliver the files wherever the user wants, skip vault logging. The master-guide onboarder, when present, will have written the client's `Context/`; prefer reading it.

## Phase 0: Inputs and discovery

You need the list and the message ingredients.

- **The list.** The qualified, enriched, researched output from `lead-generation` (the JSON twin is best, it carries the intelligence columns personalization needs). If there is no list yet, say so and offer to run `lead-generation` first.
- **The offer and positioning.** What is sold, the core outcomes, the proof points (case studies, named clients, metrics), the differentiation, and the common objections. Read from `Context/` or ask. Without proof and objections, the copy is generic.
- **The sender.** Whose name and voice the messages go out under. This sets tone and which levers fit (a founder can use founder-story; an SDR cannot).
- **The channels available.** Which of email, LinkedIn, cold call, WhatsApp are actually usable, based on what got enriched (verified emails? phones? LinkedIn URLs?) and what tools the client runs. Do not design a LinkedIn step if there are no profile URLs.
- **The front-end offer.** What the CTA asks for (a reply, a quick call, a free audit, a resource). Pick by the offer's proof and price, see the matrix in `copywriting-levers.md`.

In vault mode most of this is in `Context/`; confirm the few campaign-specific choices (channels, front-end offer, sequence length) and move on.

## Phase 1: Strategy and cadence

Decide the shape of the campaign before writing a word of copy. Read **`references/cadence-and-channels.md`**.

- **Choose the channels and the touchpoint count.** A campaign is a number of steps across one or more channels: e.g. a 6-step email sequence, or a 4-email + 3-LinkedIn multichannel cadence. The user may state the length ("a 6-step sequence"); otherwise recommend one.
- **Map the touchpoints.** For each step: the day/delay, the channel, the action (new email, reply, connection request, DM, call, WhatsApp), and which personalization type it uses. This map becomes the `cadence.md` deliverable.
- **Pick the levers by audience.** Match copywriting levers to the ICP and sender (C-suite -> punchy; pain-aware -> poke-the-bear; strong proof -> case study). Detail in `copywriting-levers.md`.

## Phase 2: Copy

Write the actual copy for **every step** in the cadence. Read **`references/copywriting-levers.md`** for the framework, levers, hard rules, and sequence structure.

- **Email.** Use the 4-sentence framework. Write 3 variants (A/B/C) of the first email using different primary levers, then the follow-ups for every remaining step. Each email: under ~100 words, a 2 to 3 word subject, mandatory spintax, merge tags only for real data fields, a CTA that asks for a reply not a click, and no em dashes. Include the A/B test plan.
- **LinkedIn.** If LinkedIn is a channel: a connection request note plus the DM steps, shorter and more casual than email, same voice and bans.
- A "6-step sequence" means six fully written emails in one file, not a template and a shrug. Write them all.

## Phase 3: Personalize

Personalization is what separates this from spam. Read **`references/personalization-categories.md`**.

- **The four personalization types** (from the BenAI playbook): an exec name-drop, a LinkedIn engagement/intent signal, a recent LinkedIn post, or a website/offer reference. Each opener is grounded in real data from the lead's intelligence columns.
- **Write 2 test openers first**, on real leads, 2 to 3 variations each, and get the user's approval to calibrate tone before scaling. This checkpoint is mandatory; it is far cheaper to fix the style on 2 leads than on 150.
- **Scale with subagents.** Spawn `sales:icebreaker-writer` subagents, **5 leads each, all in one message**. Each gets the approved examples, the full writing rules, the product context, and its batch.
- **QC programmatically.** Scan every opener for banned opening phrases, banned words, and em dashes, and fix them, before anything ships. The lists and fixes are in the reference.

If `sales:icebreaker-writer` is unavailable (outside the plugin), use `general-purpose` subagents with the same rules.

## Phase 4: Deliver

Delivery is the user's choice, because their setup decides what is useful. Ask which they want. Read **`references/outreach-platforms.md`** for the platform recommendations and pricing that go into the cadence file.

**Default: channel-separated markdown files.** Works for anyone, no platform required. Write to `sequences/<name>/` (in vault mode, `Lead-Gen/sequences/<name>/`):

- **`emails.md`**: every email in the sequence in one file. For each step: subject options, the body with spintax and merge tags, the personalization slot, word count, and the levers used. A 6-step sequence has all 6 here.
- **`linkedin.md`**: the LinkedIn connection note and DM sequence, step by step. Only when LinkedIn is a channel.
- **`cadence.md`**: the master touchpoint map across all channels (email, LinkedIn, cold call, WhatsApp): each step's day, channel, action, and personalization type. This file also carries the **tool recommendations and subscription costs** and notes on cold-call and WhatsApp task tracking, so the user knows what to run it on.
- **Per-lead personalization**: the approved openers, as a `personalization.csv` (or an `Email Personalization` column added to the lead list), matched by email then name.

**Alternative: direct upload.** If the user wants it pushed into their platform and that platform is connected, load the sequence and copy into it (Instantly, Smartlead, or Lemlist). The BenAI-specific Instantly to Lemlist wiring via Make is just one instance of this path; it is config-driven, not assumed. If the platform is not connected, fall back to the markdown files and tell the user how to import them.

**Vault mode extras.** Register the campaign in `Lead-Gen/campaigns/<name>/campaign.md` (channels, list link, sequence link, sending tool, and a metrics stub the `sales-os-campaign-metrics` routine fills from Instantly/Lemlist). Log every file to `Daily/logs/`. Wikilink the campaign, the list, and the tools.

**Final report.** What was produced (steps, channels, variants, leads personalized), where it lives, the recommended sending tool with its cost, and the next action (import, or launch).

## Operating rules that always apply

- **Voice.** The sender's voice from `Context/voice.md` and the brand voice. No em dashes, ever.
- **Spintax is mandatory** in email copy ({Hi|Hey|Hello}, varied connectors and CTAs). It prevents the sending platform from fingerprinting identical messages, which protects deliverability.
- **CTA asks for a reply, not a click.** No links in cold email bodies; links and "click here" are spam signals and kill deliverability.
- **Personalization is grounded or skipped.** Every opener ties a real observation to why the email matters. If the data shows a person-company mismatch, skip the lead and note why rather than inventing a hook.
- **Parallelism.** All personalization subagents spawned in one message.

## What this skill replaced

This consolidates the old `email-personalization` skill and the `cold-email-copywriter` framework into one campaign-builder, and reuses the `icebreaker-writer` subagent unchanged. The list it works on comes from the `lead-generation` skill.
