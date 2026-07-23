# Post-call flow

Use this when the call has happened and the user wants the one-pager personalized from what was actually said. This is the higher-leverage path: it's the leave-behind / follow-up document that arrives within hours of the call and reflects the actual conversation.

## Inputs

At minimum: client's first name. Usually the user will tell you the call happened today or yesterday, use that to scope the Fireflies search.

## Check for an existing proposal first

Post-call is exactly when a proposal tends to exist already, drafted or sent right after the discovery call. **Always ask:** *"Is there already a proposal for this client (PandaDoc, Google Doc, deck, or anything sent)?"*

If yes:

- Pull and read it, PandaDoc via the pandadoc tools, Drive/Docs via `gws`, a shared link via WebFetch or `defuddle parse <url> --md`.
- The proposal is the **source of truth**. The one-pager is its visual companion and must match it exactly on: price, payment terms, scope, the named automations, timeline / phases, persona framing, and inclusions (support window, community access, etc.).
- Where the transcript and the proposal disagree (e.g., a price that moved after the call), the proposal wins. If something is genuinely unresolved, ask the user rather than guessing.

If no proposal exists yet, ground in the transcript as below and note the one-pager may become the basis for the proposal.

## Pull the transcript

```
mcp__1929fcd0-...__fireflies_search
  query: keyword:"<first name>" OR keyword:"<company>" from:<date> limit:5
```

The result includes a meeting ID and a summary. Take the ID and fetch the full transcript:

```
mcp__1929fcd0-...__fireflies_get_transcript
  transcriptId: <id>
```

The transcript may be large (50–60KB common). If your tool harness returns "too large", it's saved to a tool-results file, read it from there.

## What to extract from the transcript

Read with these specific questions in mind:

### 1. What does their business actually do (in their words)?

Don't trust your pre-call research. The Jamie Carter call is the warning case: pre-call research said "property development education", but she actually runs a franchise hotel. **The call always overrides research.**

Capture:
- Industry / business model in their language
- Revenue size if mentioned
- Team size
- Locations / offices
- Current tools (CRM, email, marketplaces, analytics, etc.)

### 2. What automations did Aryan/Andrew suggest? What did the client lean toward?

Look for moments like:
- *"Definitely finance, obviously number one"* (Dario)
- *"The most manual thing is group quotes"* (Jamie)
- *"Customer service tickets and email marketing"* (Riley)

These become the two automation cards. Each card needs:
- A tag (e.g., "Customer Service", "Highest Friction · Your #1", "Built with you · Day 1–14")
- A title (a real name, not "TBD")
- A 1–2 sentence description grounded in the transcript
- 4 numbered flow steps that map to the actual workflow they described

Use their exact tool names. If they said "Klaviyo", say Klaviyo. If they said "RMS Cloud" or "Good Day ERP" or "Gmail" or "ClickUp", use those names.

### 3. Pricing, what was actually quoted?

Read for the dollar amount Aryan or Andrew quoted. Default is $5,000 but the call may have established a different price. If unclear, ask the user.

Also note: was a split discussed (50/50, Day 1 + Day 30)? Was it explicitly upfront? When in doubt, default to upfront (the current template).

### 4. Was a follow-up call scheduled?

Often there's a decision call after the discovery call. Examples from the session:
- Jamie: "Wed May 20, 4:00 or 4:30 PM"
- Riley: "Friday May 8"

If a follow-up was scheduled, the "Three Steps to Kickoff" section should reflect it:

- Step 1: Review proposal + materials before <follow-up date>
- Step 2: <Follow-up date> call to finalize scope and book kickoff
- Step 3: 30-day build runs

And the slot picker should show kickoff dates **after** the follow-up call.

### 5. Constraints / blockers

Things the client mentioned that affect what can actually be built:
- Outlook locked down by franchise corporate (Riley's vaping business, Jamie's hotel)
- Specific compliance requirements
- Existing tool dependencies you'll need to integrate with
- Time-zone or travel constraints

Flag these to the user when handing over the URL, they need to be addressed before scope is locked.

### 6. Persona signals

Listen for cues that determine Personal OS vs Team OS:
- "I'm the only one using Claude right now" → Personal OS
- "I want to eventually expand to my team in 6 months" → Personal OS now, future expansion noted
- "We have 10 people, 5 on the tech side" → Team OS
- "It's just me and my VA" → Personal OS

Get this right. See `variants.md` for why it matters.

## Personalization

### Hero subhead

Use their actual language. Examples:

- **Riley (Black Note):** *"Your Claude already drafts customer service replies. Now imagine that same brain knows your SEO playbook, your Klaviyo flows, and your order-processing logic, synced across your team, with the scattered files in Drive, Cowork, and your desktop finally organized."*, directly references his stated current state (Claude draft replies, scattered files in Drive/Cowork/desktop).
- **Jamie:** *"Your hotel operations brain. Group quotes, RMS reports, competitor pricing, your morning decisions, all in one connected place. Built around how you actually work today, expandable to your VA, front office, and franchise team when you're ready."*, uses her exact tools and her stated future (team expansion in 6 months).

### Hero card pill

Bind to a specific persona signal from the call.

- **Max King:** "Personal OS · you + your assistant"
- **Dario Markovic:** "Multi-company access control via Relay"
- **Bamboostan:** "Multi-venture access control via Relay" (he runs both legal entity + brand)

### Automation cards

The cards should map 1:1 to what was discussed. Use the format from `variants.md` (tag, title, description, 4 flow steps). Stick to their tools, their language.

Footer note for the section can hedge if scope isn't fully locked yet:

> *"Both tentatively locked from today's call. Final scope confirmed on the <follow-up date> follow-up. The second slot could shift to <alternative> if a higher priority surfaces."*

### Section header

`"What we'll build for you, <FirstName>."`, switches to first-person address for post-call (more personal than the pre-call company framing).

### Outcomes card "X Live Automations"

Name the two automations explicitly:

> *"<Automation 1> + <Automation 2>, both running by Day 30. Plus the brain itself, so you can prompt the next ones into existence yourself."*

### Three steps to kickoff

Default sequence if no follow-up call was scheduled:

1. Sign proposal, pay, receive questionnaire, book kickoff
2. Onboarding call kicks off the 30 days. Standard slots Tue / Wed / Fri.
3. 30-day build runs. Day 30 = your AI OS goes live + 30 days support.

If a follow-up call WAS scheduled, restructure:

1. Review proposal + materials before **<follow-up date>**. Reach out on WhatsApp anytime.
2. **<Follow-up date>** call (time). Finalize scope, lock the two automations, book kickoff.
3. Sign, pay, kickoff. 30-day build. Day 30 = your AI OS goes live + 30 days support.

### Slot picker

Three upcoming Tue/Wed/Fri slots **after** any scheduled follow-up call. Timezone matches the client.

## What to hand over with the URL

Post-call deliverables come with:

1. The share link
2. A bulleted "what I personalized and from where" list, quote the transcript where you can. This builds trust that the personalization is real, not invented.
3. Any flags (constraints, blockers, things to confirm before scope lock)
4. Optional: suggested next-message text if the user is sending this in a follow-up email or WhatsApp ping
