Org-wide standard operating procedures live here. Department-specific SOPs go to `Departments/{name}/sops/` instead.

## What belongs here

- Cross-functional processes that span multiple departments
- Org-wide playbooks (incident response, hiring, security review)
- Compliance and policy procedures

## What does NOT belong here

- Department-specific workflows -> `Departments/{name}/sops/`
- One-off project processes -> `Projects/{name}/`

## Rules

- Each SOP is a standalone file: clear ownership, version, last-reviewed date in frontmatter.
- Use callouts (`> [!important]`) for non-negotiable steps and (`> [!warning]`) for known failure modes.
- Link to the people responsible via `[[wikilinks]]`.

## Frontmatter

```yaml
---
type: sop
scope: org-wide
owner: [name]
last_reviewed: YYYY-MM-DD
status: active
---
```
