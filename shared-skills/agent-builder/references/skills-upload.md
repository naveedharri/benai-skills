# Skills: Upload, Version, Attach

Two kinds of skills can be attached to a managed agent.

## Pre-built Anthropic Skills

No upload needed. Reference by short name:

| `skill_id` | Purpose |
|---|---|
| `pptx` | PowerPoint authoring/editing |
| `xlsx` | Excel authoring, analysis, charts |
| `docx` | Word documents |
| `pdf` | PDF generation and form handling |

Attach in the agent body:
```json
"skills": [{ "type": "anthropic", "skill_id": "xlsx" }]
```

## Custom Skills

Filesystem-based skills the user authored. Must be uploaded to the workspace first via the Skills API, then attached by `skill_id` and `version`.

### Skill folder structure

```
my-skill/
├── SKILL.md            ← required at top level
├── REFERENCE.md        ← optional progressive disclosure
└── scripts/
    └── do_thing.py     ← optional bundled code
```

SKILL.md must have YAML frontmatter:
```yaml
---
name: my-skill            # max 64 chars, lowercase/numbers/hyphens, no "anthropic"/"claude"
description: Short hook describing what the skill does and when to use it (max 1024 chars).
---

# My Skill
...
```

### Upload. `POST /v1/skills`

Beta header: `skills-2025-10-02`. Content-type: `multipart/form-data`. Max 30 MB.

Zip upload (preferred for >5 files):
```bash
zip -r my-skill.zip my-skill/
curl --fail-with-body -X POST "https://api.anthropic.com/v1/skills" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02" \
  -F "display_title=My Skill" \
  -F "files[]=@my-skill.zip"
```

Individual files (preserve root path via `;filename=`):
```bash
curl --fail-with-body -X POST "https://api.anthropic.com/v1/skills" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02" \
  -F "display_title=My Skill" \
  -F "files[]=@my-skill/SKILL.md;filename=my-skill/SKILL.md" \
  -F "files[]=@my-skill/scripts/do_thing.py;filename=my-skill/scripts/do_thing.py"
```

Multipart fields:

| Param | Required | Description |
|---|---|---|
| `display_title` | yes | Human-readable name, max 64 chars |
| `files[]` | yes | One or more files. SKILL.md must exist at the top level of the resulting tree. |

Response:
```json
{
  "id": "skill_01AbCdEfGhIjKlMnOpQrStUv",
  "display_title": "My Skill",
  "latest_version": "1759178010641129",
  "created_at": "2026-01-15T10:30:00Z",
  "source": "custom"
}
```

Custom skills are shared workspace-wide. All workspace members can attach them.

### Add a new version. `POST /v1/skills/{skill_id}/versions`

```bash
curl --fail-with-body -X POST "https://api.anthropic.com/v1/skills/${SKILL_ID}/versions" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02" \
  -F "files[]=@my-skill.zip"
```

Response:
```json
{ "skill_id": "skill_…", "version": "1759178010641130", "created_at": "…" }
```

### List. `GET /v1/skills`

Optional `?source=custom` filter.
```bash
curl "https://api.anthropic.com/v1/skills?source=custom" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02"
```

### Get. `GET /v1/skills/{skill_id}`

### Delete

Must delete every version first, then the skill record:
```bash
curl -X DELETE "https://api.anthropic.com/v1/skills/${SKILL_ID}/versions/${VERSION}" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02"

curl -X DELETE "https://api.anthropic.com/v1/skills/${SKILL_ID}" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: skills-2025-10-02"
```

## Attach a Custom Skill to the Agent

```json
"skills": [
  { "type": "custom", "skill_id": "skill_01AbCdEfGhIjKlMnOpQrStUv", "version": "latest" }
]
```

`version` can be `"latest"` or a specific epoch-timestamp version string.

## Mixing Skills

```json
"skills": [
  { "type": "anthropic", "skill_id": "xlsx" },
  { "type": "anthropic", "skill_id": "pdf" },
  { "type": "custom", "skill_id": "skill_finance_v1", "version": "latest" }
]
```

Up to 20 skills per session (counted across every agent in a multiagent session).

## Constraints to Surface to the User

- Custom skills do not sync across surfaces. A skill uploaded via the API is not the same record as one in claude.ai or Claude Code.
- API skill runtime: no internet access, no runtime package installation, only the pre-installed code-execution image packages are available.
- Treat skill code like installing software. Audit untrusted skills before upload.
