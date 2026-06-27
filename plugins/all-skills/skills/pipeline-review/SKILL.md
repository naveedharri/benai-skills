---
name: pipeline-review
description: Pipeline review and next-action planner. Pulls all prospects from a specified CRM pipeline stage, analyzes
  every email thread and meeting transcript for each prospect, then delivers a concise per-prospect status
  summary with sales cycle recap, action items, contact details (email + phone), and CRM hygiene
  recommendations -- sent directly as a Slack message. This skill is READ-ONLY: it gathers data and reports
  on it but never modifies CRM records. Connects to any CRM (Attio, HubSpot, Salesforce, Pipedrive), email,
  and call transcription tools (Fireflies, Fathom, Gong). MANDATORY TRIGGERS: "pipeline review", "review my
  pipeline", "pipeline status", "what's happening with my deals", "where do my deals stand", "deal status
  report", "pipeline action items", "next steps for my deals", "prospect recap", or any request about
  reviewing active prospects in a pipeline stage and determining next steps.
---

# Pipeline Review

Pull every prospect from a target pipeline stage, cross-reference their full email history and meeting transcripts, and produce a concise action-oriented summary sent via Slack.

This skill is **read-only** -- it pulls data and delivers insights but never creates, updates, or deletes CRM records. If the user wants CRM changes (moving stages, deleting duplicates), list the recommendations clearly so they can act on them manually.

## What This Skill Produces

A Slack message (sent to the user or a channel they specify) that fits in roughly **15 lines or fewer**. The message packs the maximum useful information into a tight, skimmable format:

- Per-prospect: name, email, phone, deal value, 1-line status, and next action
- A CRM hygiene section flagging duplicates, no-shows, gone-cold prospects, and unqualified leads with clear recommendations
- A priority summary so the user knows what to do first

The message is concise and skimmable -- no emojis, no walls of text. A busy founder should be able to scan it in under 60 seconds and know exactly what to do today.

## Phase 0: Gather Context

Use `AskUserQuestion` to collect what you need. Combine into 1-2 calls max.

### Round 1 -- Pipeline & Delivery

**Question 1 -- Which pipeline and stage?**
"Which CRM list/pipeline should I review, and which stage(s) do you want me to focus on?"
- If they don't know the exact list name, use `list-lists` to show them the options.
- If they specify multiple stages, ask whether each stage needs full analysis (email + call history) or just a headcount/summary. Some stages (like "Meeting Booked" where no calls have happened yet) only need a prospect list, not deep analysis.

**Question 2 -- Where should I send the summary?**
"Where do you want the pipeline summary sent? I can DM you on Slack or post it to a channel."
- Default: DM to the user. Search for their Slack user by email from CRM workspace membership.

### Round 2 -- Scope (if needed)

**Question 3 -- Any prospects to skip or special instructions?**
"Should I review ALL prospects in those stages, or skip any? Anything specific you want me to flag?"
- Usually the answer is "all" -- but some users want to exclude recently-added leads or focus on specific names.

After collecting answers, confirm your understanding before pulling data.

## Phase 1: Data Collection

### Step 1 -- Discover CRM Structure

Read `references/CONNECTORS.md` for connector-specific patterns. The general flow:

1. **Find the list**: Use `list-lists` (Attio) or equivalent to locate the target pipeline
2. **Understand the schema**: Use `list-list-attribute-definitions` to identify the stage field slug, deal value field, and other entry-level attributes
3. **Identify record-level fields**: Use `list-attribute-definitions` on the parent object (usually "people") to understand where email, phone, name live

### Step 2 -- Pull All Prospects from the Target Stage(s)

CRM APIs paginate (typically 50 records max per request), and stage filtering can be unreliable depending on the CRM.

**Recommended approach -- full scan with local filtering:**

Rather than relying on server-side stage filters (which can fail silently or have inconsistent syntax), pull ALL entries from the list in paginated batches and filter locally. This is more reliable and avoids missing prospects due to filter syntax issues.

```
offset = 0
all_target_entries = []
while has_more:
    batch = list-records-in-list(list=TARGET_LIST, limit=50, offset=offset)
    for entry in batch:
        if entry.stage in TARGET_STAGES:
            all_target_entries.append(entry)
    offset += 50
```

Save entry-level data as you go: entry_id, parent_record_id, stage, deal value, priority, forecast, close date, notes, agreement stage.

**Important**: Count your results and sanity-check with the user. If they say "I see 10 prospects" but you only found 4, you missed some. Go back and re-scan.

**Duplicate detection**: While scanning, track `parent_record_id` occurrences. If the same record appears more than once in the same stage, that's a duplicate entry. Log these for the CRM hygiene section.

### Step 3 -- Fetch Contact Details

Collect all unique `parent_record_id` values from the entries, then batch-fetch person records:

```
get-records-by-ids(object="people", record_ids=[...])
```

Extract for each prospect:
- **Name** (required)
- **Email address** (required -- also needed for email/call searches, and included in the Slack message)
- **Phone number** (required in the Slack message -- include even if you have to note "no phone on file")
- **Company** (if linked)
- **Location** (if available)

### Step 4 -- Pull Email History for Each Prospect

For every prospect that needs deep analysis (not stages where the user only wants a summary), search for all email threads using their email address:

```
search-emails-by-metadata(participant_email_addresses=["prospect@company.com"], limit=10)
```

This returns email metadata: subject, summary, snippet, sender, sent_at. For the most recent 2-3 emails, pull full content with `get-email-content` if the summary alone doesn't tell you enough about the current state.

Key things to extract from emails:
- When was the last email exchange? (recency = urgency signal)
- Who sent the last email -- us or them? (ball in whose court?)
- What was discussed? Any commitments, questions, or objections?
- Any calendar interactions? (accepted/declined meetings = engagement signal)
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

If a transcription service rate-limits you, fall back to email analysis for the remaining prospects and note the limitation.

## Phase 2: Analysis

### Per-Prospect Analysis

For each prospect, synthesize the CRM data, emails, and call transcripts into a clear picture:

**Sales cycle status:**
- Where are they in the buying process?
- How long have they been in this stage?
- Is momentum building or fading?

**Next action:**
- What's the single most important thing to do for this prospect?

**Priority tier:**
- HOT: Respond today -- they're actively engaged or just reached out
- WARM: Follow up this week -- there's momentum but it'll fade without action
- MONITOR: Keep nurturing -- engaged but not ready to move
- AT RISK: Going cold -- needs a re-engagement attempt or a decision to move out

### CRM Hygiene Check

This is a critical part of the review. Scan the data you've already collected and flag:

**Duplicates**: Same `parent_record_id` appearing multiple times in the same stage. List which entries are duplicates and recommend keeping the earliest one (or the one with the most data) and deleting the rest.

**No-shows**: Prospects who had meetings booked but evidence suggests they didn't attend or cancelled. Signals include:
- Calendar decline in email history
- Meeting booked but zero follow-up communication afterward
- Explicit "can't make it" or rescheduled-then-ghosted patterns
Recommend moving these to a "No Show" stage.

**Gone cold / Lost**: Prospects where all communication has dried up. Signals include:
- No email exchange in 4+ weeks
- Explicit decline ("going a different direction", "not interested")
- Multiple unanswered follow-ups
Recommend moving these to "Lost" stage.

**Unqualified**: Prospects who show signs of being a poor fit. Signals include:
- Personal email domain (gmail, yahoo, etc.) with no company affiliation
- No engagement at all -- no email replies, no call, no calendar interaction
- Job title or company mismatch with your ICP
Recommend moving these to "Unqualified" stage.

## Phase 3: Compose and Send

### The 15-Line Rule

The Slack message must be **concise enough to scan in under 60 seconds**. Aim for roughly 15 lines total. This is a hard constraint -- if you have 20 prospects, you can't give each one 4 lines. Compress.

The way to achieve this: each prospect gets ONE line. Use a tabular/compact format. Put the detailed CRM hygiene recommendations at the bottom in 2-3 lines.

### Message Format

```
PIPELINE REVIEW -- [Stage Name] ([count] prospects, $[total value])

[PRIORITY] [Name] | [email] | [phone] | $[value] -- [1-line status + next action]
[PRIORITY] [Name] | [email] | [phone] | $[value] -- [1-line status + next action]
...

CRM CLEANUP NEEDED:
- Duplicates: [names] (delete extra entries)
- No-shows: [names] (move to No Show)
- Lost: [names] (move to Lost)
- Unqualified: [names] (move to Unqualified)
```

If the user asked about multiple stages, separate them with a blank line and a stage header. But keep the same compact format.

For stages the user only wants a summary of (like "Meeting Booked" with no call history), just list names with contact info and any notable flags -- don't do the full status analysis.

### Priority Labels

Use short labels inline with each prospect line:
- `[HOT]` -- respond today
- `[WARM]` -- follow up this week
- `[--]` -- monitoring, no urgent action
- `[RISK]` -- going cold

### Formatting Rules

- No emojis. None.
- Each prospect = ONE line. Name, email, phone, value, and a short status phrase.
- Use Slack markdown sparingly: *bold* for section headers only.
- Group by priority, most urgent first.
- CRM hygiene section at the end, 2-4 lines max.
- The entire message should be roughly 15 lines. If you have too many prospects, consider grouping low-priority ones (e.g., "[MONITOR] 5 others on track, no action needed").

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
CRM and email APIs may rate-limit. If you hit limits, add small delays between requests. For Fireflies, the search endpoint can be slow -- be patient and retry on timeout. If rate-limited, fall back to email-only analysis for the remaining prospects rather than stalling the entire review.
