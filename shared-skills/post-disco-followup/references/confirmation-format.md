# Confirmation Format

The skill always confirms on success so the user knows the drafts are ready. The channel is set by `confirmation.mode` in `config/offer.md`. The body adapts to the proposal backend.

## Chat mode (default)

**Google Docs backend** (the proposal link is live):

```
First sales call follow-up ready: <Prospect Name> (<Company>)

Proposal (Google Doc): <google doc url>
Email draft (from <authenticated account>): <email draft link>
Transcript: <transcript url>
Saved: <output_dir>/<slug>/

The proposal link is already in the email draft. Review and send when you are ready.
```

**PandaDoc backend** (the link does not exist until you send/share):

```
First sales call follow-up ready: <Prospect Name> (<Company>)

PandaDoc proposal: created as a draft (id <document_id>)<sandbox note if applicable>
Email draft (from <authenticated account>): <email draft link>
Transcript: <transcript url>
Saved: <output_dir>/<slug>/

One manual step: a PandaDoc draft has no shareable link yet. Open the proposal in
PandaDoc, send or share it to the prospect, copy the link PandaDoc generates, paste
it over the placeholder in the email draft, then send the email.
```

If `key_environment` is `sandbox`, append to the PandaDoc line: ` (sandbox / [DEV] doc, not a real client proposal)`.

## Slack mode

If `confirmation.mode` is `slack`, post the same body as a self-DM. Resolve the user's Slack id from `confirmation.slack_user_email` with the Slack user-search tool, then send to that id. If the email maps to no Slack user, fall back to a chat summary and note the Slack failure.

## Routine mode addition

If a routine passed a `pr_url`, add a `Repo PR: <url>` line. In manual mode omit it (do not write "none").

## Partial success

If one non-critical step failed, still confirm with whatever you have and add `Note: <what did not complete cleanly>` at the bottom.

## Error (routine mode)

If a step fails unrecoverably in routine mode, send a short error confirmation and stop. Do not retry destructively.

## Rules

- Always state the real From account of the email draft. Do not claim it is from the configured signature email if that is a different mailbox.
- Never paste API keys or credentials into the confirmation.
- No em dashes.
- In manual mode, report failures conversationally instead of an error message.
