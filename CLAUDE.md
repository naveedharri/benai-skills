# BenAI Skills - Expert Automation

## What This Is

A marketplace of expert automation plugins for Claude Code, organized by department. Each department is a single installable plugin containing multiple skills.

## Available Departments

### Marketing (13 skills)
| Skill | Command | Purpose |
|-------|---------|---------|
| programmatic-seo | `/programmatic-seo` | SEO-optimized pages at scale |
| seo-optimizing | `/seo-optimizing` | Data-driven SEO via Search Console |
| seo-audit | `/seo-audit` | Technical SEO audits (148 rules) |
| email-sequence | `/email-sequence` | Email sequences & drip campaigns |
| case-study | `/case-study` | Data-driven case studies |
| infographic | `/infographic` | AI-generated infographics |
| linkedin | `/linkedin` | LinkedIn posts & carousels from content |
| newsletter | `/newsletter` | Newsletter editions from content |
| title-generation | `/title-generation` | Optimized YouTube video titles |
| gif-creator | `/gif-creator` | GIFs from video clips |
| excalidraw | `/excalidraw` | Presentations & diagrams |
| animate-posts | `/animate-posts` | Animate static infographics into videos |
| website-launch-kit | `/website-launch-kit` | Build & launch marketing websites |

**Commands:** `/marketing` (skill overview), `/repurpose` (content repurposing workflow)

### Sales (4 skills)
| Skill | Command | Purpose |
|-------|---------|---------|
| lead-research-assistant | `/lead-research-assistant` | B2B lead generation & ICP scoring |
| email-sequence | `/email-sequence` | Email sequences & drip campaigns |
| case-study | `/case-study` | Data-driven case studies |
| n8n-prd-generator | `/n8n-prd-generator` | Automation blueprints from calls |

### Operations (2 skills)
| Skill | Command | Purpose |
|-------|---------|---------|
| n8n | `/n8n` | n8n workflow automation |
| n8n-prd-generator | `/n8n-prd-generator` | Automation blueprints from calls |

### Creative (3 skills)
| Skill | Command | Purpose |
|-------|---------|---------|
| video | `/video` | Video editing (FFmpeg/Remotion) |
| excalidraw | `/excalidraw` | Presentations & diagrams |
| infographic | `/infographic` | AI-generated infographics |

### Product (2 skills)
| Skill | Command | Purpose |
|-------|---------|---------|
| excalidraw | `/excalidraw` | Presentations & diagrams |
| n8n-prd-generator | `/n8n-prd-generator` | Automation blueprints from calls |

### YouTube (7 skills)
| Skill | Command | Purpose |
|-------|---------|---------|
| youtube-brief | `/youtube-brief` | Structured video briefs |
| youtube-ideation | `/youtube-ideation` | Video topic generation |
| youtube-packaging | `/youtube-packaging` | Titles & thumbnails for CTR |
| youtube-outline | `/youtube-outline` | Video structure & visual planning |
| youtube-scripting | `/youtube-scripting` | Scripts & bullet points for filming |
| youtube-excalidraw | `/youtube-excalidraw` | On-screen excalidraw visuals |
| title-generation | `/title-generation` | Optimized YouTube video titles |

**Commands:** `/youtube` (skill overview)

## n8n Skill

### Configuration

Requires a `.env` file in your working directory:

```
N8N_API_URL=https://your-n8n-instance.com
N8N_API_KEY=your-api-key
N8N_CREDENTIALS_TEMPLATE_URL=https://your-n8n-instance.com/workflow/template-id
```

The skill will automatically create this file if missing and prompt for values.

### Node Selection Priority

**ALWAYS prefer native n8n nodes over HTTP Request or Code nodes.**

| Priority | Use When |
|----------|----------|
| 1. Native node | A built-in n8n node exists for the service (Slack, Google Sheets, etc.) |
| 2. **AI Agent node** | For ANY AI/LLM task - ALWAYS prefer over HTTP Request to OpenAI/Anthropic APIs |
| 3. **Loop node (Split In Batches)** | For processing multiple items - ALWAYS prefer over Code node loops |
| 4. HTTP Request | Native has issues OR no node exists AND not an AI task |
| 5. Code node | Complex logic that can't be done with built-in nodes |

### Incremental Build-Test Process (MANDATORY)

**THE #1 RULE: Add ONE node -> Test entire workflow -> Repeat**

```
Add Node A -> Test -> Add Node B -> Test -> Add Node C -> Test -> Done
```

**NEVER add two or more nodes at once. ALWAYS test after each single node.**

### Key API Patterns

| Operation | Method | Endpoint |
|-----------|--------|----------|
| Create | POST | `/api/v1/workflows` |
| Update | **PUT** | `/api/v1/workflows/{id}` |
| Activate | **POST** | `/api/v1/workflows/{id}/activate` |
| Execute | POST | `/webhook/{path}` |

### Expression Essentials

**Webhook data lives under `.body`:**
```
{{ $json.body.fieldName }}  <- Correct
{{ $json.fieldName }}       <- Wrong (won't work)
```

### Code Node Return Format

```javascript
return [{ json: { result: "value" } }];
```

### Testing After Each Node

```bash
# 1. Activate
curl -X POST "${N8N_API_URL}/api/v1/workflows/{id}/activate"

# 2. Execute
curl -X POST "${N8N_API_URL}/webhook/{path}" -d '{}'

# 3. Check status
curl "${N8N_API_URL}/api/v1/executions?limit=1" | jq '.data[0].status'
```

### Common Mistakes to Avoid

- Using PATCH instead of PUT for updates
- Using PUT with `{active: true}` instead of `/activate` endpoint
- Building all nodes then testing (build incrementally!)
- Fetching all executions (always use `?limit=2`)
- Using placeholder/mock data instead of real values

## Video Skill

### Tool Selection

| Task | FFmpeg | Remotion |
|------|--------|----------|
| **Stitching** | Same codec, no effects | Transitions, overlays, programmatic |
| **Transitions** | Simple crossfades | Multiple types, custom timing |
| **Captions** | SRT burn-in | TikTok-style word highlighting |
| **Teasers** | Quick clips | Text overlays, branded elements |

### Workflow

1. **Analyze** - Examine videos with ffprobe
2. **Transcribe** - Get speech content for smart cuts
3. **Ask** - Clarify user intent
4. **Plan** - Propose edit approach
5. **QA Test** - Run automated tests before preview
6. **Preview** - Show to user after QA passes
7. **Iterate** - Refine based on feedback

### Key Rules

- **Always preview in Remotion Studio before rendering**
- Never render automatically - wait for user approval
- Use whisper.cpp (not Python whisper) for fast transcription

## Best Practices Summary

1. **Always test after each node** - No exceptions
2. **Copy full node configs from template** - Not just credentials
3. **Use correct API methods** - PUT for update, POST for activate
4. **Limit execution queries** - Always `?limit=2`
5. **Report only after confirmed working** - Never "please test this"
6. **Never use mock data** - Ask for real values

## MCP Server Integration

If the n8n MCP server is available, prefer using MCP tools for:
- Node discovery: `search_nodes`, `get_node`
- Validation: `validate_node`, `validate_workflow`
- Templates: `search_templates`, `get_template`

Fall back to REST API skills when MCP is unavailable.

## Shared Skills (`shared-skills/`)

All skills live in `shared-skills/` as the single source of truth. The department-to-skill mapping is defined in `.claude-plugin/skills-map.json`. Running `./sync-skills.sh` copies skills into each department's `plugins/*/skills/` folder.

**Never edit skills directly in `plugins/*/skills/`** — those are overwritten by sync.

### Editing workflow

1. Edit the skill in `shared-skills/<skill>/`
2. If adding a new skill or changing which departments get it, update `.claude-plugin/skills-map.json`
3. Run `./sync-skills.sh`

### Before every push

Always run these before pushing:
```bash
./sync-skills.sh
```
This ensures `plugins/*/skills/` is in sync with `shared-skills/` and `.claude-plugin/skills-map.json`.

## Building Distributable Zips

Run `./build-zips.sh` to generate downloadable zip files in `dist/`. The script automatically runs `sync-skills.sh` first, then reads `marketplace.json`, detects all department plugins, and creates one zip per department plus a full marketplace zip.
