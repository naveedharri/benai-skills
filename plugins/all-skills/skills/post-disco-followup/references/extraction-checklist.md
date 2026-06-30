# Discovery Extraction Checklist

Pull all of this from the transcript and participant metadata in one pass before drafting anything. It is offer-agnostic; take what is relevant to your offer and skip what is not.

## From participant metadata

- Prospect full name (the non-host participant)
- Prospect first and last name
- Prospect email (REQUIRED, stop if missing)

## From the transcript

### Company and context
- Company name as the prospect states it (fallback if the legal lookup fails)
- Team or company size
- Existing tools and tech stack (concrete list)
- Department or function focus (sales, marketing, ops, engineering, support, etc.)
- Current solution or how they handle this today (what they would be switching from)

### Goals and pain points
- Top 3 pain points or goals
- Primary focus: the single most important outcome they want
- Any urgency, timeline, or trigger event mentioned

### Buying signals (take what surfaced, do not interrogate)
- Budget or price sensitivity signals
- Decision process and other stakeholders (who else is involved, who signs off)
- Success metrics: how they would judge this worked
- Objections or hesitations raised

### Agreed next steps
- What was agreed (a follow-up call, a proposal, a trial, an intro to a stakeholder)
- Any dates mentioned, converted to absolute dates

### For the email recap
- The prospect's primary goal or challenge (usually Key Point 1)
- Any early validation, interest, or win they mentioned
- One specific, non-generic detail for the opening line

### For the proposal (only if a proposal is part of this touch)
- The specifics your offer's scope blocks need, grounded in the call: for a service, the stakeholders and workflows; for a project, the deliverables and milestones; for a subscription, the seats/use case and the plan that fits; for a retainer, the ongoing scope. Pull what your `phases` blocks actually require.
- Whether the deal sits inside or outside your configured pricing tier

## Legal company name (only if a proposal is part of this touch)

Web search: `"<company>" site:linkedin.com/company`, `"<company>" about us incorporated`, `"<company>" LLC OR Inc OR Corp`. Manual mode reports the name and source and waits. Routine mode uses the best match and falls back to the stated name. Never guess.

Expect false positives: common company names return several unrelated businesses. Always show the source URL with the proposed name and let the user confirm. If you cannot tie a result to THIS prospect (their domain, the person on the call, their location), use the stated name. On a fictional sample transcript there is no correct answer to find, so use the stated name.

## Validation

- If the prospect email is missing, stop and report it. You cannot draft the email or assign a proposal recipient without it.
- If the company name is ambiguous, pick the clearest and flag it.
- If team size is not stated, note "not specified" and use your default pricing tier unless there is evidence otherwise.
