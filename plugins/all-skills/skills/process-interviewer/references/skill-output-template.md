# Skill Output Template

After the interview is complete and the user wants a skill built, use this template to generate it. Apply the best practices below while writing.

## SKILL.md Structure

```yaml
---
name: [lowercase-with-hyphens, max 64 chars, gerund form preferred]
description: [What it does + when to trigger. Be specific. Include trigger phrases. Max 1024 chars. Write in third person. Be slightly "pushy" about when to use it so it actually triggers.]
---
```

## Best Practices to Apply

### Be concise
Claude is smart. Don't explain what PDFs are or how libraries work. Only add context Claude doesn't already have. Challenge every paragraph: "Does this justify its token cost?"

### Explain the why, not just the what
Instead of "ALWAYS do X", explain why X matters. Claude responds better to understanding the reasoning than to rigid rules.

### Set appropriate freedom levels
- High freedom for judgment calls (code review, writing style)
- Medium freedom for preferred patterns with acceptable variation
- Low freedom for fragile operations (database migrations, API sequences)

### Use progressive disclosure
- Keep SKILL.md body under 500 lines
- Put detailed references in separate files with clear pointers
- Keep file references one level deep from SKILL.md
- For files over 100 lines, include a table of contents

### Include workflows with checklists
For multi-step processes, provide a checklist the model can track:
```
Task Progress:
- [ ] Step 1: ...
- [ ] Step 2: ...
```

### Build in feedback loops
Add validation steps: "After step 3, verify the output by [check]. If validation fails, return to step 2."

### Use examples
Input/output pairs are more powerful than descriptions. Show what good output looks like.

### Avoid anti-patterns
- No time-sensitive info ("before August 2025...")
- Consistent terminology (pick one term, use it everywhere)
- No vague descriptions ("helps with documents")
- No deeply nested file references
- No Windows-style paths

## Skill File Organization

```
skill-name/
├── SKILL.md              # Main instructions (under 500 lines)
├── references/           # Loaded on demand
│   ├── examples.md       # Input/output examples
│   ├── templates.md      # Output templates
│   └── domain-ref.md     # Domain-specific reference
└── scripts/              # Executed, not loaded into context
    └── utility.py        # Deterministic operations
```

## After Writing the Skill

1. Save all files to the workspace folder
2. Present the skill to the user with a summary of what was created
3. Offer to refine or adjust anything
4. Mention they can install it or use the skill-creator skill to run evals on it
