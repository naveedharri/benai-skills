Projects are living, structured directories that grow as information accumulates. They are not flat README-only folders.

## Project Routing

When the user mentions something about a project, analyze it and route to the right place:

| Content type | Route to |
|---|---|
| Status update, overview, deadline | `Projects/{name}/README.md` |
| Research finding, competitor analysis | `Projects/{name}/research/{topic}.md` |
| Spec, requirement, brief | `Projects/{name}/specs/{name}.md` |
| Draft, script, written content | `Projects/{name}/drafts/{name}.md` |
| Idea, brainstorm | `Projects/{name}/ideas/{name}.md` |
| Working notes, scratchpad | `Projects/{name}/notes/{name}.md` |
| Feedback, review comments | `Projects/{name}/feedback/{name}.md` |

## Rules

- **Subdirs on the fly**: Don't pre-create empty directories. When content arrives that needs a subdir, create it and write the file. Update README.md to reference the new content.
- **README as index**: The README.md is the entry point with overview, status, next steps, and links to subdir content. Don't duplicate subdir content in it.
- **Lifecycle**: New project = just a README.md. Subdirs appear as content types emerge. Completed projects move to `Intelligence/archive/{name}/`.
- Include `project:` in frontmatter whenever a note relates to a specific project.

## Goal Cascade

Every action should trace back to an organizational objective:

```
Company OKRs -> Department Goals -> Projects -> Monthly Focus -> Weekly Review -> Daily Tasks
```

- Company OKRs and department goals live in `Context/strategy.md`
- Department-specific goals live in `Departments/{name}/README.md`
- Projects in `Projects/` link to OKRs and department goals
- Tasks link to projects via the active profile's `task-list/`
- During weekly reviews, check which OKRs have no active project (they're drifting)
- During quarterly reviews, assess OKR progress and cascade updates
