# Connector Fragments

These are the spliceable body blocks the skill uses to fill the per-connector sections of `operator-prompt-template.md`. Pick the matching block for each enabled connector; drop the section entirely (and remove the placeholder line) for connectors the user did not enable.

For any connector left disabled, also strip every reference to that connector's product name from the rendered prompt (e.g. delete `{{CHAT_PRODUCT_NAME}}` mentions if {{CHAT_PRODUCT_NAME}} is disabled). Universal references (vault, fireflies-style transcripts) stay only when the corresponding connector is enabled.

---

## Bootstrap lines

### `{{TRANSCRIPTS_BOOTSTRAP_LINE}}` — when transcript connector is enabled

> - **Transcripts: always pull from the last 48 hours, every run, regardless of `Last run:`.** Re-read; do not trust prior cache. The latest daily brief must always reflect current transcript state.

### `{{CHAT_BOOTSTRAP_LINE}}` — when chat connector is enabled

> - **{{CHAT_PRODUCT_NAME}}: pull last 24h of activity** across channels {{DM_RECIPIENT_NAME}} is in (DMs, mentions, channel highlights). Used for daily {{CHAT_PRODUCT_NAME}} digest in step 2b.

### `{{COMMUNITY_BOOTSTRAP_LINE}}` — when community connector is enabled

> - {{COMMUNITY_PRODUCT_NAME}}: today's posts. Paginate `list_spaces` with `per_page: 20` or smaller to avoid response overflow; iterate pages rather than requesting all at once.

---

## `{{ENABLED_CONNECTORS_LINE}}`

A one-liner listing which connectors are queried every run. Examples:

- All four enabled: "Transcripts AND {{CHAT_PRODUCT_NAME}} AND {{COMMUNITY_PRODUCT_NAME}} are queried every run."
- Vault + transcripts only: "Transcripts are queried every run."
- Vault only: "Vault is the only connector this operator uses."

---

## Step 1 — Transcripts

### Enabled

> - **Always re-fetch.** Do not skip even if you ran an hour ago. New transcripts may have landed.
> - Extract tasks (team scope only), dedup per profile, case-insensitive.
> - Write meeting note in each attendee's profile folder.
> - Dedup against meeting notes already in the profile folder (by transcript ID or title + date) so re-running within 48h does not duplicate.
> - After writing, `vault_read` and confirm the meeting note actually contains the transcript summary, attendees, and action items. File-exists is not enough.
> - `>{{BUDGET_TRANSCRIPTS}}` returned → queue remainder as a task, log Errors.

### Disabled

> _Transcript connector not enabled. Skip this step._

---

## Step 2a — {{COMMUNITY_PRODUCT_NAME}} community review

### Enabled

> Query all spaces for posts made today. Paginate with small `per_page` (≤20) to avoid response overflow. For each post, identify any mentioned team members (by name or @-handle). Append a {{COMMUNITY_PRODUCT_NAME}} activity note to each mentioned member's profile folder following CLAUDE.md conventions. If no team member is mentioned, infer the most relevant owner from content; if ambiguous, skip profile attribution.
>
> **Only consider posts from the last 24h for escalation.** Older posts that never got a reply are stale; append once to the housekeeping queue and do not re-DM, do not re-attribute.
>
> **{{CHAT_PRODUCT_NAME}} escalation routes to {{DM_RECIPIENT_NAME}} only.** DM {{DM_RECIPIENT_NAME}} ONLY when ALL three hold:
>
> 1. The post @-mentions a team member OR is a direct question/request that requires a team response.
> 2. No reply yet from the mentioned/owning member.
> 3. Not already escalated (check `## {{COMMUNITY_PRODUCT_NAME}} Escalated` post-ID list in the task file).
>
> DM format: post title/snippet, space name, post URL, who it was originally @-mentioning (if anyone), one-line suggested action. {{DM_RECIPIENT_NAME}} routes from there.
>
> Do NOT DM for: FYI posts, announcements, general discussion, posts already replied to, posts authored by a team member themselves, posts older than 24h, or "new today" with no action required. Ambiguous ownership → skip and note in the report. **Never post to a channel, group DM, or team-chat under any condition. Never DM anyone other than {{DM_RECIPIENT_NAME}}.** Dedup escalations across runs by tracking escalated post IDs. {{COMMUNITY_PRODUCT_NAME}} call fails → log to Errors, skip this step entirely, continue.

### Disabled

> _{{COMMUNITY_PRODUCT_NAME}} connector not enabled. Skip this step._

---

## Step 2b — {{CHAT_PRODUCT_NAME}} activity digest

### Enabled

> Pull the last 24h of {{CHAT_PRODUCT_NAME}} activity that {{DM_RECIPIENT_NAME}} has visibility into. Summarize and persist into the second brain:
>
> - **Per-profile:** if a team member was @-mentioned, sent a DM, or posted in a shared channel, append a short {{CHAT_PRODUCT_NAME}} activity note under `## {{CHAT_PRODUCT_NAME}}` in their per-profile daily.
> - **Org-level:** roll up notable channel activity (key threads, decisions, asks, escalations) into the root daily under `## {{CHAT_PRODUCT_NAME}} Activity`.
> - Format: timestamp, channel/DM name, author, one-line summary, permalink (if available). Weave wikilinks for any team member, project, or department mentioned.
> - Dedup by message TS so re-runs within the same hour do not duplicate. Track seen TSs in `## {{CHAT_PRODUCT_NAME}} Seen` in the task file.
> - Only include messages from the last 24h. Older messages that re-surface in the API response are stale; ignore them.
> - This step is read-only on {{CHAT_PRODUCT_NAME}}. The only write to {{CHAT_PRODUCT_NAME}} is the conditional 1:1 DM to {{DM_RECIPIENT_NAME}} in step 2a.

### Disabled

> _{{CHAT_PRODUCT_NAME}} connector not enabled. Skip this step. Drop all {{CHAT_PRODUCT_NAME}} references from the rendered prompt (Hard Rules, Failure Handling, Report Schema)._

---

## `{{MCP_BLOCK}}` — pick the rows that match the user's enabled connectors

```
- **vault** ({{VAULT_MCP_NAME}}): all file I/O. Follow the folder + leading-slash-path convention above. Root files use `folder: "{{ROOT_FOLDER_NAME}}"`.
- **{{TRANSCRIPT_MCP_NAME}}**: transcripts from last 48h. Required every run. Always re-fetch.
- **{{CHAT_MCP_NAME}}**: read activity digest (24h) every run, log to vault. Conditional 1:1 DMs to **{{DM_RECIPIENT_NAME}} only**. No channel posts, no group messages, no DMs to anyone else.
- **{{COMMUNITY_MCP_NAME}}**: today's posts, paginated. Skip silently on error.
```

Drop the line for any connector the user did not enable.
