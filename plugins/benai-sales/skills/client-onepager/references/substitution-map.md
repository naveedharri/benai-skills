# Substitution map

The template ships pre-filled with **Jamie Carter's data**. Every personalization point below needs to be replaced for the next client. The list is enumerated so nothing gets missed, every miss makes the one-pager feel sloppy to the client.

Work through this top to bottom. Use the `Edit` tool with `replace_all: true` for any string that appears more than once (e.g., the brand name appears in 3+ places).

## Verification before deploying

Always grep before deploying. After substitutions, run:

```bash
grep -ni "amber\|khanna\|hotel\|rms\|melbourne\|aest\|may 22\|may 26\|may 27\|may 20\|group quote\|daily reports\|va " <your-file>.html
```

It should return only the legitimate uses of the words (e.g., "VA" might appear if you're doing another Personal OS client, but "Jamie" should never appear). The cleaner the grep, the more confident you are.

## Substitution checklist

### 1. Title bar (1 place)

```html
<title>BenAI x Jamie Carter - Your 30-Day AI OS Build</title>
```

Replace `Jamie Carter` with the client's full name or company brand (whichever you're using in the lockup).

### 2. Brand lockup, hero card (1 place)

```html
<div class="name">Jamie Carter × BenAI</div>
```

Replace `Jamie Carter`. Note: this is one of multiple places the lockup appears, use `replace_all: true` on the Edit if the brand text is identical across them all.

### 3. Brand lockup, footer (1 place)

```html
<div class="brand">BenAI × Jamie Carter · AI OS Implementation</div>
```

Same brand string. If you used `replace_all` on the previous, this updates automatically.

### 4. Prepared-for line (1 place)

```html
<span class="hero-eyebrow"><span class="dot"></span>Prepared for Jamie Carter · May 12, 2026</span>
```

Replace **both** the name and the date. Use today's date in long format (`May 14, 2026`, not `5/14/26`).

### 5. Hero subhead (1 place)

```html
<p>Your hotel operations brain. Group quotes, RMS reports, competitor pricing, your morning decisions, all in one connected place. Built around how you actually work today, expandable to your VA, front office, and franchise team when you're ready.</p>
```

Rewrite entirely. See `pre-call-flow.md` or `post-call-flow.md` for how to write this. Length: 1–2 sentences, 30–60 words.

### 6. Hero meta pills (sometimes)

```html
<div class="meta-pill"><span class="num">14</span><span class="lab">Day Build</span></div>
<div class="meta-pill"><span class="num">2</span><span class="lab">Automations</span></div>
<div class="meta-pill"><span class="num">+30d</span><span class="lab">Support</span></div>
```

The `2` becomes `1` if you're doing the 1-automation framing (Dario case). The `Automations` label changes to `Automation built` (singular) when count = 1. Otherwise leave the pills alone.

### 7. Hero card pill (engagement summary right side)

```html
<div class="x">
  <svg ...></svg>
  Personal OS · you + your VA
</div>
```

Replace `Personal OS · you + your VA` with the persona-appropriate pill from `variants.md`. The other two pills in the engagement card (`Final delivery: Day 30`, etc.) should stay as-is unless you have a reason to change.

### 8. Phase 2, Build details (3 bullets)

The middle bullet is the one most-often updated:

```html
<li>...Real-time sync with your VA + private-to-you locks</li>
```

For Team OS: `File-level access control + real-time sync`. For Personal OS: `Real-time sync with your VA + private-to-you locks` (replace VA with EA/assistant if more appropriate to the client).

### 9. Phase 3, Enable details (3 bullets)

The middle bullet:

```html
<li>...You + VA walkthrough on the Second Brain</li>
```

For Team OS: `Team workshop on the Second Brain`. For Personal OS: `You + VA walkthrough on the Second Brain`.

### 10. Timeline label

```html
<span class="label">You + VA<br>Walkthrough</span>
```

For Team OS: `Team<br>Workshop`. For Personal OS: `You + VA<br>Walkthrough`.

### 11. Outcomes card, title + description

```html
<h4>2 Live Automations</h4>
<p>Group Quote Engine + Daily Reports → Brain, both running by Day 30. Plus the brain itself, so you can prompt the next ones into existence yourself.</p>
```

Update:
- The number (1 or 2)
- The named automations
- The closing line

### 12. Outcomes card, Enablement

```html
<h4>You + VA Enablement</h4>
<p>You walk away knowing how to prompt new automations into existence. Your VA knows how to feed the brain every day. No code required.</p>
```

For Team OS: `Team Enablement` / "Your team learns to prompt the brain in plain English...". For Personal OS: `You + VA Enablement` / personalized two-person copy.

### 13. Automations section header

```html
<h2>What we'll build for you, Jamie.</h2>
```

Pre-call: `What we'll build for <Company>.`
Post-call: `What we'll build for you, <FirstName>.`

### 14. Automation card 1

```html
<div class="auto-card b">
  <span class="tag">Highest Friction · Your "obviously #1"</span>
  <h4>Group Quote Engine</h4>
  <p style="font-size:13px;opacity:0.8;">The 10-point analysis you do manually today, run automatically. Notifies you in the morning if anything needs your eyes. Fires a VA task when RMS needs updating.</p>
  <div class="flow">
    <div class="flow-step"><span class="nm">1</span>Capture incoming group quote requests</div>
    <div class="flow-step"><span class="nm">2</span>Run your 10-point analysis (RMS overlaps + competitor + corporate rates)</div>
    <div class="flow-step"><span class="nm">3</span>Flag conflicts and edge cases for morning review</div>
    <div class="flow-step"><span class="nm">4</span>Push VA task: update RMS with confirmed dates</div>
  </div>
</div>
```

Replace ALL FIVE elements (tag, title, description, all 4 flow steps).

### 15. Automation card 2

Same structure, replace all five elements again.

### 16. Automations section footer note

```html
<p style="...text-align:center;">Both tentatively locked from today's call. Final scope confirmed on the Wed May 20 follow-up. The second slot could shift to chat-archive sync or VA workflow delivery if a higher priority surfaces.</p>
```

Update the follow-up date reference (or remove that clause if no follow-up was scheduled). For pre-call: `Both automations specced + locked during your onboarding call. Built in parallel during the 30-day window.`

### 17. Investment block, price

```html
<div class="price">$5,000</div>
```

Update to match the chosen tier from `variants.md`.

### 18. Investment block, included items description

```html
<div style="...">
  Includes Second Brain infrastructure (Obsidian + Relay + Railway), 2 automations (Group Quote Engine + Daily Reports → Brain), Google Workspace CLI setup for Sheets/Gmail/Docs, you + VA walkthrough, post-program Slack/WhatsApp access, and 1 year of community membership (extends your current year by another). Built around you today, expandable to the hotel team later.
</div>
```

Update:
- Number of automations
- Named automations
- Persona-specific bits ("VA walkthrough" vs "team workshop")
- The "expandable to the team later" closing line for Personal OS
- "Extends your current year by another", only if the client is already a community member

### 19. Tooling table

```html
<div style="..."><span>Claude (your plan)</span><strong>$200/mo</strong></div>
<div style="..."><span>Relay (you + VA · 2 × $18)</span><strong>$36/mo</strong></div>
<div style="..."><span>Railway (backend hosting)</span><strong>$5/mo</strong></div>
<div style="..."><span>Total</span><strong>$241/mo</strong></div>
```

For **Personal OS** (2 users): Relay = `$36/mo`, Total = `$241/mo`. Label = `Relay (you + VA · 2 × $18)`.

For **Team OS** (5 users): Relay = `$90/mo`, Total = `$295/mo`. Label = `Relay (5 users × $18)`.

### 20. Three steps to kickoff

Three `.ns-item` blocks. Rewrite each Step's `<strong>Step N:</strong>` copy according to the pre-call or post-call pattern in the respective flow doc.

### 21. Slot picker, three slots

```html
<div class="slot"><span class="day">Fri</span><span class="when">May 22 · post-decision slot</span></div>
<div class="slot"><span class="day">Tue</span><span class="when">May 26 · standard slot</span></div>
<div class="slot"><span class="day">Wed</span><span class="when">May 27 · standard slot</span></div>
```

Update:
- Day labels (Tue/Wed/Fri)
- Dates (must be in the future, after any follow-up call)
- The `when` annotation if useful (timezone, "post-decision slot", etc.)

### 22. Slot picker footer note

```html
<p style="...">Wed May 20 is the decision call. Kickoff lands the following week. All times set around your Melbourne hours.</p>
```

Update the date reference and the timezone hint. For pre-call: `Standard kickoffs run Tue / Wed / Fri. Time set around your <location> hours.`

## Things that DO NOT vary

Don't touch these unless you have a specific reason:

- The 30-day program length
- The 3-phase structure (Discovery / Build / Enable)
- The Obsidian + Relay + Railway stack mention
- The 30-day post-program support
- The 1-year community membership inclusion
- The visual design system (colors, fonts, spacing)
- The section order

If you find yourself wanting to change one of these, stop and ask the user first.
