# Pillar 1: Context (the second brain)

The ground truth. Every capability reads `Context/` before it acts, so this pillar comes first and everything downstream configures from it. The goal is a populated `Context/` folder that holds everything constant about the rep's sales world.

## Gauge first, then fill

Most reps already have some of this material, scattered. Before interviewing, ask what exists: a brand or messaging doc, an ICP sheet, a pitch deck, a sales-process SOP, a website, a CRM with their pipeline. Ingest and structure whatever they have. Only interview for the gaps. For anything missing, run the `process-interviewer` skill to extract it from them in conversation rather than making them write docs.

## The Context doc set

Write each as a short, standalone markdown doc under `Context/`. These mirror the set BenAI runs, generalized to any offer.

| Doc | Holds |
| --- | --- |
| `offer.md` | What they sell: the overview, the scope or phases, the price, any guarantee, what is in and out of scope |
| `icp.md` | Who they sell to: the profile (size, geography, vertical), the buyer, the qualification bar, the disqualifiers, the individual-level targets |
| `sales-process.md` | How they sell: the pipeline stages, the call and follow-up motion, the typical touchpoints, when a deal is marked lost |
| `positioning.md` | How they frame it: the core frame, the common objections and the answers, competitors, the proof points |
| `voice.md` | How they sound: the voice source of truth and the hard rules (no em dashes is one) |
| `me.md` | The rep: role, targets, the bottleneck, the coaching focus |
| `stack.md` | The tools: what is live, what is paused, what each is for |
| `config.md` | The instance literals every routine and skill reads: rep identity and email, the CRM and its list or pipeline id, the proposal platform, the notetaker, call-scoring weights, schedule times, notification targets, the SOP path, the ICP summary |

`config.md` is the most important for pillars 4 and 5: it is where the routines and the dashboard read the rep's specifics, so fill it carefully and confirm the literals.

## Templates

Bundled starting points are in `assets/context-templates/`. Use them as the shape, then fill from what the rep has or what `process-interviewer` surfaces. Do not ship a template with placeholder text left in; either fill it or note it as not yet specified.

## Done when

`Context/` holds all eight docs, `config.md` has the real instance literals, and you have read the offer, ICP, and process back to the rep and they confirmed. Then move to pillar 2.
