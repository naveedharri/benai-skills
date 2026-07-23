---
name: pipeline-review
description: Pipeline review and next-action planner. Pulls all prospects from a specified CRM pipeline stage, analyzes every email thread and meeting transcript per prospect, then delivers a concise per-prospect status summary with sales cycle recap, action items (yours and theirs), and contact details, plus a cross-pipeline synthesis of patterns and priorities. Works with Attio or Pipedrive, Gmail, and Fireflies, and degrades gracefully when a source is missing. Use when the user says "review my pipeline", "what is the status of my deals", "next actions for my prospects", "pipeline review for [stage]", or wants a stage-by-stage read of where every deal stands and what to do next.
disable-model-invocation: true
---

# Pipeline Review

Pull every prospect from a target pipeline stage, cross-reference their full email history and meeting transcripts, and produce a concise action-oriented summary sent via Slack.

## What This Skill Produces

A Slack message (sent to the user or a channel they specify) containing, for each prospect:

- Contact info (email, phone)
- Deal value and pipeline metadata (stage, priority, forecast)
- A 1-3 sentence recap of the sales cycle so far
- Action items from YOUR end (what your team needs to do)
- Action items from THEIR end (what the prospect owes you)
- A clear recommendation: follow up, escalate, or move out of pipeline

The message is concise and skimmable -- no emojis, no walls of text. A busy founder should be able to scan it in under 2 minutes and know exactly what to do today.

## Phase 0: Gather Context

Use `AskUserQuestion` to collect what you need. Combine into 1-2 calls.

### Round 1 -- Pipeline & Delivery

**Question 1 -- Which pipeline and stage?**
"Which CRM list/pipeline should I review, and which stage(s) do you want me to focus on?"
- If they don't know the exact list name, use `list-lists` to show them the options.
- Common stages: "Next Call Scheduled", "Proposal Sent", "Negotiation", "Follow-up Needed"

**Question 2 -- Where should I send the summary?**
"Where do you want the pipeline summary sent? I can DM you on Slack or post it to a channel."
- Default: DM to the user. Search for their Slack user by email from CRM workspace membership.

### Round 2 -- Scope (if needed)

**Question 3 -- Any prospects to skip?**
"Should I review ALL prospects in that stage, or skip any?"
- Usually the answer is "all" -- but some users want to exclude recently-added leads or specific names.

After collecting answers, confirm your understanding before pulling data.

## Phase 1: Data Collection

### Step 1 -- Discover CRM Structure

Read `references/CONNECTORS.md` for connector-specific patterns. The general flow:

1. **Find the list**: Use `list-lists` (Attio) or equivalent to locate the target pipeline
2. **Understand the schema**: Use `list-list-attribute-definitions` to identify the stage field slug, deal value field, and other entry-level attributes
3. **Identify record-level fields**: Use `list-attribute-definitions` on the parent object (usually "people") to understand where email, phone, name live

### Step 2 -- Pull All Prospects from the Target Stage

This is the step that requires the most care. CRM APIs paginate (typically 50 records max per request), and stage filtering can be unreliable depending on the CRM.

**Recommended approach -- full scan with local filtering:**

Rather than relying on server-side stage filters (which can fail silently or have inconsistent syntax), pull ALL entries from the list in paginated batches and filter locally. This is more reliable and avoids missing prospects due to filter syntax issues.

```
offset = 0
all_target_entries = []
while has_more:
    batch = list-records-in-list(list=TARGET_LIST, limit=50, offset=offset)
    for entry in batch:
        if entry.stage == TARGET_STAGE:
            all_target_entries.append(entry)
    offset += 50
```

Save entry-level data as you go: entry_id, parent_record_id, stage, deal value, priority, forecast, close date, notes, agreement stage.

**Important**: Count your results and sanity-check with the user. If they say "I see 10 prospects" but you only found 4, you missed some. Go back and re-scan.

### Step 3 -- Fetch Contact Details

Collect all unique `parent_record_id` values from the entries, then batch-fetch person records:

```
get-records-by-ids(object="people", record_ids=[...])
```

Extract for each prospect:
- **Name** (required)
- **Email address** (required -- also needed for email/call searches)
- **Phone number** (include if available)
- **Company** (if linked)
- **Location** (if available)

### Step 4 -- Pull Email History for Each Prospect

For every prospect, search for all email threads using their email address:

```
search-emails-by-metadata(participant_email_addresses=["prospect@company.com"], limit=10)
```

This returns email metadata: subject, summary, snippet, sender, sent_at. For the most recent 2-3 emails, pull full content with `get-email-content` if the summary alone doesn't tell you enough about the current state.

Key things to extract from emails:
- When was the last email exchange? (recency = urgency signal)
- Who sent the last email -- us or them? (ball in whose court?)
- What was discussed? Any commitments, questions, or objections?
- Any new stakeholders cc'd? (buying committee expansion = good sign)

Run email searches in parallel where possible -- don't do them one at a time.

### Step 5 -- Pull Meeting/Call Transcripts

Check which transcription tools are available:

- **Fireflies**: Use `fireflies_search` with the prospect's name or email, then `fireflies_get_summary` for the most recent call(s)
- **Attio call recordings**: Use `search-call-recordings-by-metadata` with speaker_person_record_ids or related_record_ids
- **Other tools**: Check available MCPs for Gong, Fathom, Otter, etc.

For each prospect, pull the summary of their most recent 1-2 calls. You need:
- When the call happened
- Key topics discussed
- Action items from the call
- Any objections or concerns raised
- Next steps that were agreed on

If no transcription tool is connected, skip this step and note it in the output. The email analysis alone is still valuable.

## Phase 2: Analysis

For each prospect, synthesize the CRM data, emails, and call transcripts into a clear picture. Think about:

**Sales cycle status:**
- Where are they in the buying process? (early discovery, evaluation, negotiation, stalled)
- How long have they been in this stage?
- Is momentum building or fading?

**Action items -- our end:**
- Proposals or materials we promised but haven't sent
- Follow-up calls we need to schedule
- Questions from the prospect we haven't answered
- Internal tasks (get pricing approved, loop in a specialist, etc.)

**Action items -- their end:**
- Feedback they promised but haven't delivered
- Internal reviews or approvals they're waiting on
- Stakeholders they need to loop in
- Documents or access they need to provide

**Recommendation:**
- HOT: Respond today -- they're actively engaged or just reached out
- URGENT: Follow up this week -- there's momentum but it'll fade without action
- MONITOR: Keep nurturing -- engaged but not ready to move
- AT RISK: Going cold -- needs a re-engagement attempt or decision to move out

## Phase 3: Compose and Send

### Message Format

Structure the Slack message like this (no emojis anywhere):

```
PIPELINE REVIEW -- [Stage Name] ([count] Prospects)
Total pipeline value: $X

---

[PRIORITY TIER: e.g., "RESPOND TODAY"]

[NUMBER]. [NAME] -- $[VALUE] | [Agreement Stage] | [Priority]
Email: [email] | Phone: [phone]
Sales cycle: [1-3 sentence recap of where things stand]
Our action: [What we need to do]
Their action: [What they owe us]

---

[Next priority tier...]

---

PRIORITY SUMMARY:
1. TODAY: [brief list]
2. THIS WEEK: [brief list]
3. NEXT WEEK: [brief list]
```

### Formatting Rules

- No emojis. None. Not even one.
- No bold headers with colons followed by long paragraphs. Keep everything tight.
- Each prospect block should be 4-6 lines max.
- Use Slack markdown (*bold* for names and section headers, not for emphasis within sentences).
- Group prospects by urgency tier, most urgent first.
- End with a numbered priority summary so the user knows what to do in what order.

### Sending

1. Find the user's Slack ID: search by email or name using `slack_search_users`
2. Send to their DM (user_id as channel_id) or to the channel they specified
3. Confirm the message was sent and share the link

## Troubleshooting

**"I see more prospects than you found"**
This almost always means the pagination or filtering missed some. Re-scan ALL entries without any server-side filter and count matches manually. The full-scan approach described in Step 2 prevents this.

**"No emails found for a prospect"**
Check if the email address in the CRM is correct. Some prospects use a different email for scheduling vs. correspondence. Try searching by name in Fireflies if email search returns nothing.

**"Fireflies has no calls for this prospect"**
The meeting may be under a colleague's name. Try searching by the prospect's company name or by the date range when the deal was active.

**Rate limits or timeouts**
CRM and email APIs may rate-limit. If you hit limits, add small delays between requests. For Fireflies, the search endpoint can be slow -- be patient and retry on timeout.

## Self-improvement

This skill is never finished. Improve it as you use it.

- When the user corrects how a step was done, update the relevant reference file (or this SKILL.md) so the correction sticks. Do not just fix it for this run.
- When a correction is a hard rule ("always do X", "never do Y"), add it as a permanent rule here.
- When the user says an output was genuinely good, save it to `references/examples/` so it becomes a model for future runs.
- Keep the skill small while you do this: when you add something, run the deletion test and cut anything that no longer changes behavior.
