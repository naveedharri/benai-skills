# Structure

The exact tree to scaffold. **Seven knowledge folders plus `Routines/`, and one root file.**

```
<OS root>/
├── CLAUDE.md                      the router. The ONLY file in root
├── Context/                       permanent, slow-changing. Read before any task
│   ├── personal-brand/            voice.md, background.md
│   ├── brand/                     brand-kit.md, positioning.md
│   ├── icp/<segment>.md           one file per segment: profile AND its pain points
│   ├── strategy.md                goals + the funnel map
│   ├── infrastructure.md          tech stack, connectors, what is authenticated
│   └── config.md                  instance literals. Every routine reads this
├── Channels/<channel>/            evergreen production lines, one per surface
│   ├── strategy.md                role in the funnel, cadence, format contract
│   ├── voice.md                   the delta for this surface only
│   ├── pipeline/<slug>/           one FOLDER per asset in production
│   ├── published/YYYY-MM-DD-<slug>.md
│   └── sop-<slug>.md              procedures that serve this surface
├── Campaigns/YYYY-MM-<slug>/      time-boxed, cross-channel pushes
│   ├── brief.md                   offer, ICPs, channels, dates, goal. LINKS, not copies
│   ├── deliverables/              campaign copy and creative briefs, by channel
│   └── results.md                 what was measured, then the retro
├── Offers/                        the funnel ladder, free through paid
│   ├── lead-magnets/              one file per magnet, each names the offer it feeds
│   └── <offer>/                   offer.md, proof/, landing.md. Same template every time
├── Analytics/                     numbers about YOUR OWN marketing
│   ├── channels/<channel>.md      append-only stat log, one per channel
│   ├── snapshots/YYYY-MM-DD.md    the immutable daily pull
│   ├── reports/                   monthly + quarterly
│   ├── dashboard/                 spec.md required, control-center.html built last
│   ├── metrics.md                 the live scoreboard
│   └── what-works.md              the pattern library. Ships EMPTY
├── Team/<person>/                 OPTIONAL. Skip entirely for a solo operator
│   ├── <person>.md                role and responsibilities in one file
│   └── tasks.md
├── Intelligence/                  the world plus org memory
│   ├── logs/YYYY-MM-DD.md         every brain-update routine appends here
│   ├── research/                  includes swipe/ and frameworks/
│   ├── competitors/  market/  decisions/  meetings/
└── Routines/                      10 independent prompts, flat, + CLAUDE.md
```

## The design test, and it is the whole ruleset

> **Every folder is either permanent context or has a named routine writing to it. If neither, it does not earn a place.**

Apply it before adding anything. It is what keeps a `Resources/` folder, a `Dashboard/` folder, a `Content/` folder and a `Daily/` folder out of the tree: each was either a catch-all or duplicated a home that already existed.

Run it in reverse to check your work: name the routine that writes each folder. If you cannot, either the folder is permanent context and a human owns it, or it should not exist.

## What each folder is for

**`Context/`**: the constitution. Every skill reads here. Changes rarely. The folder that makes the OS worth having.

**`Channels/`**: one folder per surface you **actively produce for**. Context says who we are, Channels says how that shows up in a specific place, and holds the assets made for it. A surface you merely have is not a channel.

**`Campaigns/`**: time-boxed cross-channel pushes with a start, an end and a number. Date-prefixed so they sort chronologically and archive cleanly.

**`Offers/`**: what you sell or give away, free through paid. The funnel ladder.

**`Analytics/`**: our numbers, plus the dashboard that renders them.

**`Team/`**: who does marketing and what is on their plate. Optional by design.

**`Intelligence/`**: what is happening out there, plus the OS's own memory: decisions, meetings, and the run logs.

**`Routines/`**: one file per scheduled routine, each a complete unattended prompt. This folder is why the tree is an operating system rather than a filing cabinet.

## The splits that keep it navigable

**`Intelligence/` is the world, `Analytics/` is us.** A competitor's view count is intelligence, ours is analytics. Collapsing them makes `Intelligence/` unusable by month three. It is also why reports live in `Analytics/reports/` rather than having two valid homes.

**`Channels/` is a surface, `Campaigns/` is a push.** A channel is always-on, a campaign is time-boxed and pulls from many channels. There is no separate content folder: an asset lives on the channel that publishes it, in `pipeline/` while it is being made and `published/` after.

**`Context/` is the quick lookup, the folder is the deep context.** Two levels, deliberately. `Context/` holds what any task might need. Offer-specific context lives in that offer's folder, channel-specific context in that channel's folder, and a channel `voice.md` states only what differs from the master register.

## Rules that stop the duplication coming back

- **Campaigns reference, they never copy.** A brief links its offer, its ICP segments and its channels via frontmatter and wikilinks. **No `offer/` or `icp/` subfolder inside a campaign, ever.** This is the rule most likely to be broken, and breaking it reintroduces the exact problem the OS exists to solve.
- **A campaign email is a broadcast that belongs to a campaign.** The send lives in `Channels/<email channel>/broadcasts/` with a `campaign:` frontmatter field. The campaign folder holds the brief and the results, not the sends.
- **Every offer uses the same template:** `offer.md` + `proof/` + `landing.md`. Proof lives with the offer it sells, because that is where it gets deployed.
- **Pain points live inside each ICP file.** They are properties of a segment, not a category. No `pain-points.md` and no `pain-points/` folder.
- **Landing pages live with their offer.** A website is only a channel if you actively produce for it, meaning a blog or SEO. Otherwise its pages belong to the offers they sell.
- **No media in the brain.** Videos, images, PSDs and design files stay in Drive or a DAM. This OS stores markdown and pointers. That kills the shared-asset duplication problem without inventing an assets folder.
- **A price is never written outside `Offers/` and `Context/config.md`.** Prices move, and a copied price is wrong within days.
- **Root holds `CLAUDE.md` and folders. Nothing else.** No map file, no readme, no `Home.md`, no status file. The root router is the map.

## Email channels are shaped differently

A newsletter or email channel splits by trigger rather than by stage, because a trigger is what defines an email:

```
Channels/newsletter/
├── strategy.md   voice.md
├── flows/        evergreen sequences: welcome, onboarding, purchase, win-back
└── broadcasts/   one-off sends, YYYY-MM-DD-<slug>.md
```

Use `pipeline/` and `published/` for every other channel.

## Asset lifecycle

```
Channels/<c>/pipeline/<slug>/  ->  Channels/<c>/published/YYYY-MM-DD-<slug>.md
```

`pipeline/` holds **one folder per asset in production**, carrying `brief.md` plus its packaging alongside. `published/` holds one file per shipped asset with an append-only `## Performance` block.

The slug survives the move so an asset is traceable. Move, never copy: exactly one home per asset at any moment.

**Content never freezes.** A deal closes; a video keeps earning views. The performance block stays append-only for the life of the asset, which is the one place this OS deliberately diverges from a Sales OS.

Where an originating channel exists, an idea backlog belongs to it: `Channels/<primary>/ideas/<slug>.md`. Only scaffold it for the channel that originates content.

## Channels is the per-business part

The only genuinely variable folder. Ask which surfaces they **actively produce for**, and scaffold only those.

**Exactly one channel is `role: primary-original`.** Everything else repurposes from it. Record the repurposing cascade on the primary channel's `strategy.md` only; downstream channels state what they receive. If they cannot name a primary, that is a strategy problem worth surfacing now rather than modelling around.

Do not scaffold a channel for a surface nobody produces for. An empty channel folder with no routine writing to it teaches the operator that this OS is full of things to ignore.

## What ships empty, and why that is correct

| Path | Empty because |
| --- | --- |
| `Analytics/what-works.md` confirmed section | No review cycle has run. An unverified pattern is read as verified by every skill that loads the file |
| `Analytics/channels/*.md` most rows | No pull yet. Empty is honest, an estimate is a lie |
| `Analytics/snapshots/` | No routine has run |
| `Intelligence/logs/` | Same |
| `Campaigns/` | Nothing running yet |
| `Offers/<offer>/proof/` | Most businesses have no case study written up. **Never invent a testimonial to fill it.** A `proof/README.md` naming what would need collecting is the correct output |
| `Analytics/dashboard/control-center.html` | Built after the first real data |

Do not fill these with plausible content. An empty file that names what will fill it is the correct output.

## Adapting the tree to a business that is not this one

The seven folders hold for any business up to roughly 50 employees. What changes is what goes inside.

| Their situation | What to do |
| --- | --- |
| Solo operator | Skip `Team/` entirely. Ask first |
| One channel only | One folder in `Channels/`. It is also the primary by default |
| Runs a blog or SEO | The website IS a channel. Give it `pipeline/` and `published/` |
| No SEO, pages only sell offers | No website channel. Pages live in `Offers/<offer>/landing.md` |
| Runs paid ads | Ads is a channel only if somebody produces creative on a cadence. If it is a budget line, it belongs in `Context/infrastructure.md` |
| Has a community | A community is a product surface, not a marketing channel, unless they publish original content there on a cadence. Its context belongs with the offer it delivers |
| One offer | One folder in `Offers/`. A ladder can be one rung |
| E-commerce | Offers are products. `flows/` carries more weight: abandoned cart, post-purchase, win-back |
| Agency | Add `Clients/<name>/` as an eighth knowledge folder **only** if they run per-client marketing, and only after it passes the design test |

## Porting to another business

1. Rewrite `Context/config.md` end to end
2. Re-author the interview-driven `Context/` files
3. Replace the channel folders with that business's surfaces
4. Empty `Campaigns/`, `Analytics/`, `Intelligence/`, and every `pipeline/` and `published/`
5. Rewrite `Offers/` for their ladder, keeping the `offer.md` + `proof/` + `landing.md` shape
6. **Keep `Routines/` verbatim.** They read from `config.md` and are independent of each other, so they need no edits
7. Keep every folder `CLAUDE.md` except `Channels/CLAUDE.md`, whose channel table changes

Step 6 is the test of whether the contract holds. A routine that needs editing to work elsewhere means `config.md` is missing a key.
