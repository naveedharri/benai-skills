# Cadence and channels: designing the touchpoint map

A cadence is the sequence of touches a prospect gets, across channels, over time. This file covers how to design it and the exact shape of the `cadence.md` deliverable.

## Table of contents
1. The channels and what each is for
2. Designing a multichannel cadence
3. Timing and thread rules
4. Personalization type per step
5. The cadence.md template

---

## 1. The channels and what each is for

Use only the channels the data and the client's tools actually support (decided in Phase 0).

- **Email.** The workhorse. Highest volume, best for proof and a clear ask. Needs verified emails. CTA = reply.
- **LinkedIn.** Connection request + DMs. Warmer and more personal, lower volume, slower (connection acceptance gates it). Needs profile URLs. Great for the personal/post-based personalization types.
- **Cold call.** Highest intent signal, highest effort. Needs phone numbers (Prospeo/Apollo enrichment). Best as a mid-sequence spike on the most-qualified leads, not a blanket step.
- **WhatsApp.** Personal and high-open in some regions/segments; use sparingly and only where culturally appropriate and the number is a mobile. Needs phone numbers.

A pure-email sequence is a perfectly good default. Add channels when the data supports them and the ICP warrants the extra effort (higher ACV justifies calls and LinkedIn).

## 2. Designing a multichannel cadence

- Decide the number of touches (e.g. 6) and spread them across the chosen channels.
- Lead with the channel that has the best data and the lowest friction (usually email), and layer LinkedIn and calls as escalations for non-responders.
- Each channel runs its own copy (see `emails.md` and `linkedin.md`), but the cadence file ties them into one timeline so steps do not collide (e.g. do not send an email and a DM the same hour).
- Keep total touches reasonable. Past 6 to 8 touches with no response, mark cold and move on; persistence past that annoys more than it converts.

A common multichannel shape:

| Step | Day | Channel | Action |
| --- | --- | --- | --- |
| 1 | 0 | Email | Email 1 (personalized opener) |
| 2 | 1 | LinkedIn | Connection request (no pitch) |
| 3 | 3 | Email | Email 2 (reply, new angle) |
| 4 | 4 | LinkedIn | DM 1 (after accept) |
| 5 | 6 | Email | Email 3 (new thread, proof) |
| 6 | 8 | Call / WhatsApp | Call the most-qualified; WhatsApp the rest |
| 7 | 11 | Email | Email 4 (gentle final) |

Scale up or down to the requested length; for a 6-step email-only sequence, drop the LinkedIn/call rows and use the email timing in `copywriting-levers.md`.

## 3. Timing and thread rules

- Business days only; 3 to 5 days between email touches.
- Email replies stay in-thread (steps 2, 4); new angles start a new thread with a new subject (steps 3, 5).
- Never two touches the same day on different channels; stagger by at least a day.
- LinkedIn DM only after the connection is accepted; if not accepted by its step, skip to the next email.

## 4. Personalization type per step

Map a personalization type (from `personalization-categories.md`) to each step so the cadence file tells the writer/operator what each touch leans on:

- Email 1 -> the deepest opener (recent post, or exec name-drop).
- LinkedIn connection -> no pitch, a one-line human reason to connect.
- Email 2 -> a new proof point or a second observation.
- LinkedIn DM -> the engagement/intent signal.
- Email 3 -> website/offer reference + the strongest case study.
- Call/WhatsApp -> reference the strongest single signal, kept conversational.

## 5. The cadence.md template

```markdown
# Cadence: <campaign name>

Channels: <email, linkedin, call, whatsapp>
Length: <n touches over <m> days>
List: <link to the lead list>  |  Copy: <links to emails.md, linkedin.md>

## Touchpoint map
| Step | Day | Channel | Action | Personalization type | Copy ref |
| --- | --- | --- | --- | --- | --- |
| 1 | 0 | Email | Email 1 | recent post / exec name-drop | emails.md #email-1 |
| 2 | 1 | LinkedIn | Connection request | none (human one-liner) | linkedin.md #connect |
| ... |

## Recommended sending tools
<pull the relevant rows from references/outreach-platforms.md: email platform + multichannel/LinkedIn/call tool, with cost>

## Task tracking
<how cold-call and WhatsApp steps get tracked (e.g. Lemlist tasks), who owns them, and where replies are logged>
```

In vault mode this file lives at `Lead-Gen/sequences/<name>/cadence.md` and the campaign is registered in `Lead-Gen/campaigns/<name>/campaign.md`.
