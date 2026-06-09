# Writing a good OS router (SKILL.md)

The router has one job: given a user message, decide which context file(s) to read,
then act. Keep it skimmable.

## Anatomy
1. **Frontmatter** — `name` + a `description` that lists trigger phrases.
2. **Behavior rules** (the "CLAUDE.md" part) — how to act: tone, when to append vs.
   answer, how to capture new info. 3–6 lines max.
3. **Routing table** — "if the user is about X → read `context/Y.md`".

## Do
- One row per context file. Match on intent, not exact keywords.
- Tell Claude to read ONLY the file(s) it needs.
- Say where new captures go (which file, append vs. overwrite).

## Don't
- Don't paste brain content into SKILL.md — that's what `context/` is for.
- Don't list every possible phrasing; describe the intent.

## Minimal example
See `templates/_SKILL.md.tmpl`.
