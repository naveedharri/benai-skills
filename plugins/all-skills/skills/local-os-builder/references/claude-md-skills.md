User-editable reference material for individual skills. Each skill gets a subfolder. Skills read from here at runtime.

## Structure

```
Skills/{skill-name}/
  notes.md            -- Operator notes, voice, working preferences
  strategy.md         -- High-level approach for this skill
  references/
    {topic}.md        -- Examples, templates, deeper context
```

## Rules

- One folder per skill. Folder name matches the skill slug (kebab-case).
- `notes.md` is for short, operator-voiced guidance the skill should respect.
- `references/` is for examples and longer reference material the skill loads on demand.
- Don't duplicate the skill's own SKILL.md content here. This folder is for *your* customization.
- When you build a new skill, scaffold its folder here at the same time.
