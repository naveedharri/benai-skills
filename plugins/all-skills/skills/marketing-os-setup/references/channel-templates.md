# Channel templates

Three files per channel. `Context/` says who we are, these say how that shows up on one specific surface.

A channel folder with only `strategy.md` is incomplete.

## strategy.md

```
---
type: channel
channel: <slug>
status: active | inactive
role: primary-original | repurposed | retention-and-intelligence | conversion-and-organic | paid-acquisition
owner: <name>
updated: YYYY-MM-DD
tags: [marketing-os, channel, <slug>]
---
```

Sections:

**The handle or URL**, one line at the top.

**`## Role in the funnel`**: what job this surface does. Be specific about whether it acquires, converts, retains, or informs. A channel doing two jobs should say so, because they get judged differently.

**`## Goal and benchmark`**: a table of metric, target, current. Name the binding constraint if this channel has one.

**`## Content contract`**: subject matter, what is explicitly out of scope, the angle that works, the format.

**`## Cadence`**: target and actual. Where a calendar exists, the day-by-day table.

**`## Packaging rules`**: hard limits as callouts. Character ceilings, formatting bans, anything that has been set as a permanent correction.

**`## The repurposing cascade`**: **only on the primary original channel.** The tree of what one pillar asset spawns. Downstream channels state what they receive instead.

**`## Who does what`**: stage and owner.

**`## SOPs`**: links to the `sop-<slug>.md` files in this channel folder.

## voice.md

```
---
type: channel-voice
channel: <slug>
status: active
updated: YYYY-MM-DD
tags: [marketing-os, voice, <slug>]
---
```

Opens by stating it inherits every hard rule in `Context/personal-brand/voice.md` and only adds what is specific here.

Sections: `## The register` (how this surface sounds, and how it differs from the others) · `## Shape` (length, paragraph structure, formatting) · `## Hard rules specific to this channel` as a callout · `## Never` as a table of what and why.

Two things worth getting right:

**Name what makes this surface different, not what makes it the same.** A register that restates the core voice is wasted. The useful content is "this is the most compressed surface" or "there is no hook and no CTA here because the reader already bought."

**Where a rule came from a real correction, say so.** A rule with a reason survives; a rule without one gets broken.

## The stat log lives in Analytics, not here

```
---
type: channel-performance
channel: <slug>
status: active
updated: YYYY-MM-DD
tags: [marketing-os, performance, <slug>]
---
```

Sections: `## Baseline` (table: metric, value, pulled, target) · `## What is working` · `## What is not working` · `## Notes` or `## Known structural issues`.

**Every row carries a pulled date.** A metric without one is not usable.

**Ship this mostly empty.** Rows read "not yet tracked here" with a warning callout explaining that no analytics routine has run and that an estimate would be a lie. The analytics routine fills them. Populating by hand or by guess is the one thing that breaks trust in the whole `Analytics/` layer.

`## What is working` is written by the monthly report routine, not at setup. Say that in the file so nobody fills it speculatively.

## How to read a channel's numbers

Worth writing into `Analytics/channels/<channel>.md` for any repurposing channel: judge it on whether it drove attention to the primary asset, not on raw engagement. A post with modest reactions that sent people to the pillar did its job. A post with high reactions that sent nobody anywhere did not.

## Do not scaffold a channel nobody produces for

A surface they merely have is not a channel. An empty channel folder with no routine writing to it teaches the operator that this OS is full of things to ignore, and that is how a tree stops being trusted.

The one exception is a surface that is **deliberately paused rather than absent**: something they have produced for before and intend to again, paid being the usual case. Then `strategy.md` records `status: inactive` plus **why it is off and what would have to become true to start**, which is more useful than the folder reappearing later with no history. `voice.md` gets written ahead of time so the first campaign does not invent a register under time pressure, and `Analytics/channels/<channel>.md` states plainly that nothing has been spent.

Paused is not the same as hypothetical. If they have never produced for it and have no date in mind, leave it out and note it in `Context/strategy.md` under what is on the radar.
