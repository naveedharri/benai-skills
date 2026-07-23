# Variants

Every one-pager has a few axes of variation. Pick each one deliberately before you start editing the template, because reversing course later means re-substituting half the copy.

## Pricing tier

| Price | When to use | Real example |
|---|---|---|
| **$5,000** | Default. Aryan's standard quote on discovery calls. Standard 30-day program. | Bamboostan, Black Note, Jamie Carter, Max King, Dario Markovic |
| **$7,500** | Higher-touch engagement with more involvement, or where the prospect has signaled larger scope. | Max King (initial quote, later reverted to $5K) |
| **$8,250** | Premium tier, usually for multi-entity / venture studios with broader implementation scope. | Joachim Widd (VNTRS) |
| **$10,000** | Enterprise / multi-business operators. Often paired with 50/50 split. | Initial framing for Bamboostan (reverted to $5K on the call) |

**Rule of thumb:** if the user doesn't specify a price, ask, or default to $5,000. Don't invent a tier.

## Payment terms

| Pattern | Markup | When |
|---|---|---|
| **100% upfront** (default) | The `.split` panel is fully removed. Black price block sits alone, full-width via `grid-template-columns: 1fr` on `.invest`. | Default for every one-pager. The word "One-time" in the sub-line says it all. |
| **50/50 split** | `.split` panel restored on the right. Two rows: "Day 1 (kickoff): $X" + "Day 30 (delivery): $X". 50%/50% bar visible. | Only if explicitly asked. Adds nuance for clients who push back on full upfront. |

The current `assets/template.html` ships **without** the split panel. If you need to restore it, copy the structure back from one of the early commits or from this snippet:

```html
<div class="split">
  <h4>...Two-Payment Split</h4>
  <div class="split-bar"><div class="upfront">50%</div><div class="after">50%</div></div>
  <div class="split-rows">
    <div class="split-row"><span>Day 1 (kickoff)</span><strong>$2,500</strong></div>
    <div class="split-row"><span>Day 30 (delivery)</span><strong>$2,500</strong></div>
  </div>
</div>
```

And revert `.invest` CSS to `grid-template-columns: 1fr 1fr`.

## Automation count

| Count | Framing | When |
|---|---|---|
| **2 automations** (default) | "We build 2 automations in parallel during the 30-day window." | Aryan's standard pitch. The default for almost every call. |
| **1 automation** | "Built with you, then you build the rest yourselves." | When **Andrew Shwetzer** is the delivery partner and frames the offer as "done with you", Dario Markovic call is the example. |

Hero meta-pill, Phase 1 lock bullet, Phase 2 "built in parallel" bullet, Investment description, and Outcomes card all reflect the count. Don't update one and forget the others.

## Persona type

This is the single biggest framing choice and it drives a LOT of copy.

### Personal OS

The engagement is for **the founder + their personal assistant** (EA / VA). Team expansion is mentioned as a *future* option, not the framing.

Real examples: **Max King (Kortado), Jamie Carter (hotel).**

Hallmarks:
- Hero subhead says "personal operating system" or "built around how you work"
- Hero pill says "Personal OS · you + your VA/EA/assistant"
- Phase 2 bullet: "Real-time sync with your VA + private-to-you locks"
- Phase 3 / outcomes / timeline: "You + VA walkthrough" (not "Team workshop")
- Tooling table: Relay shows **2 users × $18 = $36/mo**, total ~**$241/mo**
- A single closing line allows for future expansion: *"Built around you today, expandable to the rest of the team later."*

### Team OS

Full team gets the brain. Multiple users from Day 1.

Real examples: Bamboostan, Black Note, VNTRS, Straitegics.

Hallmarks:
- Hero subhead frames context fragmentation or org-wide ops
- Hero pill: "Team-level access control via Relay" or "Multi-X access control"
- Phase 2 bullet: "File-level access control + real-time sync"
- Phase 3 / outcomes / timeline: "Team workshop", "Team Enablement"
- Tooling table: Relay shows **5 users × $18 = $90/mo**, total ~**$295/mo**

**Picking the right one matters a lot.** A founder + assistant client who sees "Team Enablement" framing will think you didn't listen on the call. Conversely, a 20-person ops team that gets "Personal OS for you + your VA" will think the offer is too small.

## Timezone

Affects the slot picker footer copy and the times noted next to each slot.

| TZ | Footer copy | Slot label example |
|---|---|---|
| **IST** | "Time set around your hours" / no TZ note | "Tue May 12 · 4:30 PM IST" |
| **AEST/AEDT** | "Time set around your Melbourne/Sydney hours" | "Wed May 13 · time set around AEST" |
| **CET** | "Time set around your Stockholm/CET hours" | "Wed May 13 · time set around CET" |
| **PT** | "Time set around your team's PT schedule" | "Fri May 15 · 4:30 PM PT" |

Always use **upcoming** Tue/Wed/Fri after today. Three slots is the standard. If a follow-up call is scheduled (post-call scenario), the slot picker should show dates *after* that follow-up, not before, kickoff lands once the decision call is done.

## Section structure (does not vary)

Every one-pager has the same skeleton. Don't add or remove sections:

1. Hero (left side: subhead + meta pills · right side: engagement summary card)
2. The Process (3 phases: Discovery / Build / Enable)
3. Timeline (30-day visual with milestone markers)
4. Outcomes (4 cards)
5. Automations ("What we'll build for X", 2 cards, sometimes 1)
6. Investment (black price block · optional white split panel)
7. Next Steps (3 numbered steps + slot picker on the right)
8. Footer
