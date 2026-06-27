# Plan Output Template

After the interview is complete and the user wants a plan (not a skill), produce a document using this structure. Save as a markdown file in the workspace.

## Plan Document Structure

```markdown
# [Plan Title]

## Goal
[One clear sentence describing what this plan achieves and why it matters]

## Context
[2-3 sentences of background: who is this for, what triggered this, any constraints]

## Process Overview
[Numbered list of high-level steps, each one sentence. This is the "at a glance" version.]

## Detailed Steps

### Step 1: [Step Name]
**What happens:** [Specific description]
**Input:** [What's needed to start this step]
**Output:** [What this step produces]
**Decisions:** [Any choices that need to be made]
**Owner:** [Who does this, if applicable]
**Notes:** [Anything non-obvious]

### Step 2: [Step Name]
[Same structure as above]

[Continue for all steps...]

## Edge Cases and Failure Modes
[Bulleted list of what could go wrong and how to handle each case]

## Dependencies and Requirements
[What needs to be in place before this plan can execute]

## Open Questions
[Anything that came up during the interview that still needs resolution. Should be minimal if the interview was thorough.]

## Success Criteria
[How do you know this plan worked? What metrics or outcomes indicate success?]
```

## Writing Guidelines

- Be specific enough that someone who wasn't in the interview could follow the plan
- Use the user's own language and terminology where possible
- Every step should pass the "stranger test": could a competent stranger execute this step with no additional context?
- Include concrete examples where the user provided them during the interview
- Flag any areas where the user was uncertain or where assumptions were made
