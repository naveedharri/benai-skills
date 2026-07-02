# Worked Example: Churn Recovery

A completed knowledge-work task turned into a small skill. Pattern-match against it when building; do not copy it literally.

## The task that was done first (the chat being reverse-engineered)
The operator worked out how to win back a churned customer over 4 prompts:
1. Pulled the churned account's history (what they bought, how long they stayed, why they left if known).
2. Read the last few support and sales conversations to find the real reason and the right tone.
3. Wrote a short win-back email naming the actual reason they left, with one concrete offer.
4. Checked the email against a bar: sounds human, names the real reason, makes one clear ask.
It did not work on the first try; the copy and the bar were tightened over two iterations.

## Scope decision (Step 1)
Job: "produce a win-back email for one churned customer." One job, fits one session, one skill. Selecting which accounts to target would be a separate upstream skill.

## Extraction output (Step 2)
- Steps: gather account history, read recent conversations, draft the email, check against the bar.
- Judgment: the reason is real when it appears in the customer's own words in a conversation; the email is good when it is human, names the real reason, and makes one clear ask.
- Exception: if there is no record of why they left, lead with a question instead of an assumption.
- Human-in-the-loop: operator approves the email before it sends. Nothing sends automatically.
- Stripped: switching between the CRM and the doc was human overhead, not a process step.

## Structure (Step 3)
- SKILL.md: trigger ("write a win-back email for [customer]"), the four steps, routing.
- Reference file: the win-back email bar plus a couple of saved good examples.
- Connector: account history could come from a CRM, but the first version has the operator paste it in, so no connector. If it graduates, the CRM call goes behind a subagent.
- Human checkpoint before send. Self-improvement rule included so approved emails get saved as examples.

## Prune (Step 4)
Cut generic "write a compelling email" language (a no-op). Kept only the specific bar. Ran the deletion test until every line changed behavior.

## Eval (Step 5)
Functionality test in a fresh session against a sample account: followed the four steps, loaded the email-bar reference, stopped for approval before sending. Passed. Saved the first good email as an example.
