# Autonomous mode (optional)

Manual mode is the recommended start: you run `/post-disco-followup` after a call and review the drafts. Autonomous mode runs the skill for you whenever a qualifying discovery call finishes. It is more powerful and more moving parts. Set this up only after manual mode is working.

## What autonomous mode does

A scheduled or event-triggered routine:
1. Detects a new qualifying discovery call (from your transcript provider).
2. Passes the meeting id to the `post-disco-followup` skill, running it headless (no human in the loop).
3. The skill drafts the recap, proposal, PandaDoc draft, and email draft exactly as in manual mode. Everything is still a draft, nothing is sent.
4. The routine commits the markdown artifacts to a branch in your repo and opens a pull request.
5. A Slack DM lands with the proposal link, email draft link, transcript link, and the PR url, so you review and send.

The skill already supports this. In `config/offer.md` set `autonomy.mode: autonomous`, `confirmation.mode: slack`, fill `autonomy.repo` and `confirmation.slack_user_email`, and set the `qualification` block so the routine only fires on real first sales calls.

## What you need

- A GitHub repo for the routine to commit artifacts to (private is fine).
- A scheduled or managed agent that runs Claude with this skill folder available. This is the "routine."
- Slack connected, for the confirmation DM.
- Your transcript provider reachable from wherever the routine runs.

## How to run the routine

There are three common ways to host the routine, from simplest to most custom. Check the current official docs, these products evolve.

1. **Claude Code scheduled agents (routines).** If you use Claude Code, you can schedule an agent to run on a cron and pass it a prompt. The scheduled run opens this project, finds the new meeting id, and invokes the skill. Start here if you already work in Claude Code. Docs: https://docs.claude.com/en/docs/claude-code and the scheduling features in your Claude Code client.

2. **Claude Agent SDK.** For a headless service you control, build the routine with the Agent SDK. It gives you the same skill-and-tools harness Claude Code uses, callable from your own code on your own schedule or from a webhook. Docs: https://docs.claude.com/en/api/agent-sdk (Agent SDK) and https://docs.claude.com/en/docs/claude-code/sdk.

3. **Claude Developer Platform (Messages API) directly.** For full control, drive the model with the Messages API from your own backend, wiring the transcript fetch, the PandaDoc calls, and the GitHub and Slack steps yourself. Most work, most control. Docs: https://docs.claude.com/en/api/overview.

## The trigger contract

However you host it, the routine must hand the skill a meeting id. The skill expects:
- A meeting id in the trigger context (it will wait briefly if the id arrives with a short delay).
- Optionally a `pr_url` if the routine has already opened the PR, so the confirmation includes it.

The skill returns the artifact paths and links, which the routine uses to compose its PR description and Slack message.

## Trigger options for "a call just finished"

- Poll your transcript provider on a schedule (for example every hour) for new transcripts that match your qualification rules, and run the skill for each new one.
- Or use a webhook from your transcript provider (if it offers one) to fire the routine as soon as a transcript is ready.

Polling is simpler and reliable. A webhook is faster but needs an endpoint to receive it.

## Safety

- Keep qualification gates ON in autonomous mode so the routine never drafts a proposal off an internal call or a second call. The skill stops silently on non-qualifying calls in routine mode.
- Everything stays a draft. Autonomous mode automates the drafting and the hand-off, never the send.
- Store all keys as environment variables in the routine's environment, never in the repo.
