# BenAI Skills - Expert Automation

## What This Is

A marketplace of expert automation plugins for Claude Code, organized by department. Each department is a single installable plugin containing multiple skills.

## Available Departments

### Marketing (12 skills)
| Skill | Command | Purpose |
|-------|---------|---------|
| programmatic-seo | `/programmatic-seo` | SEO-optimized pages at scale |
| seo-optimizing | `/seo-optimizing` | Data-driven SEO via Search Console |
| seo-audit | `/seo-audit` | Technical SEO audits (148 rules) |
| email-sequence | `/email-sequence` | Email sequences & drip campaigns |
| case-study | `/case-study` | Data-driven case studies |
| infographic | `/infographic` | AI-generated infographics |
| linkedin-writer | `/linkedin-writer` | LinkedIn posts & carousels from content |
| newsletter-writer | `/newsletter-writer` | Newsletter editions from content |
| title-generation | `/title-generation` | Optimized YouTube video titles |
| gif-creator | `/gif-creator` | GIFs from video clips |
| excalidraw | `/excalidraw` | Presentations & diagrams |
| website-launch-kit | `/website-launch-kit` | Custom landing pages through conversation |

**Commands:** `/marketing` (skill overview), `/repurpose` (content repurposing workflow)

### Sales (8 skills)
| Skill | Command | Purpose |
|-------|---------|---------|
| email-personalization | `/email-personalization` | Hyper-personalized email icebreakers |
| lead-intelligence | `/lead-intelligence` | Deep-research leads via web & LinkedIn |
| lead-qualification | `/lead-qualification` | Qualify & score leads against ICP |
| crm-prospect-mining | `/crm-prospect-mining` | Mine prospects from CRM lost/stalled stages |
| linkedin-post-engagers | `/linkedin-post-engagers` | Scrape LinkedIn post commenters/reactors |
| pipeline-review | `/pipeline-review` | Review active deals with action items |
| sales-rep-analyzer | `/sales-rep-analyzer` | Grade sales call performance |
| win-loss-analysis | `/win-loss-analysis` | Analyze won vs lost deal patterns |

**Commands:** `/outbound-pipeline` (B2B lead qualification + research + personalization pipeline), `/post-engagers-outbound-pipeline` (LinkedIn engagers to outbound pipeline)

**Agents:** `lead-qualifier`, `lead-researcher`, `icebreaker-writer`, `linkedin-scraper`

### Operations (2 skills)
| Skill | Command | Purpose |
|-------|---------|---------|
| n8n | `/n8n` | n8n workflow automation |
| n8n-prd-generator | `/n8n-prd-generator` | Automation blueprints from calls |

**Commands:** `/operations` (skill overview)

### Creative (5 skills)
| Skill | Command | Purpose |
|-------|---------|---------|
| video | `/video` | Video editing (FFmpeg/Remotion) |
| excalidraw | `/excalidraw` | Presentations & diagrams |
| infographic | `/infographic` | AI-generated infographics |
| infographic-old | `/infographic-old` | Infographic generator (legacy) |
| infographic-v2 | `/infographic-v2` | Infographics with Nano Banana/Gemini AI |

**Commands:** `/creative` (skill overview)

### Design (7 skills)
| Skill | Command | Purpose |
|-------|---------|---------|
| taste | `/taste` | Premium frontend design system (configurable dials, anti-slop, React/Next.js/Tailwind) |
| redesign | `/redesign` | Audit and upgrade existing projects |
| soft-ui | `/soft-ui` | Luxurious, soft UI aesthetic |
| minimalist-ui | `/minimalist-ui` | Editorial, Notion-like clean interfaces |
| brutalist-ui | `/brutalist-ui` | Raw mechanical/Swiss/CRT aesthetics (BETA) |
| stitch | `/stitch` | Google Stitch semantic design generation |
| output-enforcement | `/output-enforcement` | Force complete full-fidelity outputs (anti-truncation) |

**Commands:** `/design` (skill overview)

### Product (2 skills)
| Skill | Command | Purpose |
|-------|---------|---------|
| excalidraw | `/excalidraw` | Presentations & diagrams |
| n8n-prd-generator | `/n8n-prd-generator` | Automation blueprints from calls |

**Commands:** `/product` (skill overview)

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

### SEO (14 skills)
| Skill | Command | Purpose |
|-------|---------|---------|
| seo | `/seo` | Orchestrator — routes to the right SEO sub-skill |
| seo-page | `/seo page <url>` | Deep single-page analysis |
| seo-technical | `/seo technical <url>` | Technical SEO (crawlability, CWV, JS rendering) |
| seo-content | `/seo content <url>` | E-E-A-T content quality analysis |
| seo-schema | `/seo schema <url>` | Schema detection, validation, generation |
| seo-images | `/seo images <url>` | Image optimization analysis |
| seo-sitemap | `/seo sitemap <url\|generate>` | Sitemap validation/generation |
| seo-geo | `/seo geo <url>` | AI Overviews / GEO optimization |
| seo-plan | `/seo plan <type>` | Strategic planning (SaaS, e-commerce, local, publisher, agency) |
| seo-programmatic | `/seo programmatic` | Programmatic SEO at scale |
| seo-competitor-pages | `/seo competitor-pages` | Comparison page generation |
| seo-hreflang | `/seo hreflang <url>` | Hreflang/i18n validation |
| seo-optimize | `/seo optimize` | GSC data-driven optimization |
| seo-audit | `/seo audit <url>` | Full site audit with 6 parallel subagents |

**Commands:** `/seo` (skill overview)

**Agents:** `seo-technical`, `seo-content`, `seo-schema`, `seo-sitemap`, `seo-performance`, `seo-visual`

### Ads (14 skills, 12 sub-commands)

#### Orchestrator
| Skill | Command | Purpose |
|-------|---------|---------|
| ads | `/ads` | Orchestrator — routes to the right ads sub-skill |

#### Platform Analysis
| Skill | Command | Purpose |
|-------|---------|---------|
| ads-google | `/ads-google` | Google Ads deep analysis (74 checks) |
| ads-meta | `/ads-meta` | Meta/Facebook/Instagram Ads (46 checks) |
| ads-linkedin | `/ads-linkedin` | LinkedIn Ads for B2B (25 checks) |
| ads-tiktok | `/ads-tiktok` | TikTok Ads with creative-first strategy (25 checks) |
| ads-youtube | `/ads-youtube` | YouTube Ads across all formats |
| ads-microsoft | `/ads-microsoft` | Microsoft/Bing Ads (20 checks) |

#### Cross-Platform Tools
| Skill | Command | Purpose |
|-------|---------|---------|
| ads-audit | `/ads-audit` | Full multi-platform audit (6 parallel subagents) |
| ads-budget | `/ads-budget` | Budget allocation & bidding (70/20/10 rule) |
| ads-creative | `/ads-creative` | Creative audit + brand context setup + ad creative generation via infographic-v2 |
| ads-landing | `/ads-landing` | Landing page optimization for ads |
| ads-plan | `/ads-plan` | Strategic planning (15 industry templates) |
| ads-competitor | `/ads-competitor` | Competitive intelligence via Ad Libraries |
| infographic-v2 | `/infographic-v2` | Branded infographics for ad campaigns |

**Commands:** `/ads` (skill overview)

**Agents:** `audit-google`, `audit-meta`, `audit-budget`, `audit-creative`, `audit-compliance`, `audit-tracking`

### BenAI Obsidian Plugin (2 skills)
| Skill | Command | Purpose |
|-------|---------|---------|
| setup | `/setup` | Bootstrap vault structure + mode selection + onboarding |
| assistant | `/assistant` | Sessions, daily routines, tasks, memory, resources, output styles, meeting intelligence |

#### Mode Selection

Setup asks one preliminary question:

> "What type of vault do you want?"

Two modes:
- **Solopreneurs/Professionals** (default) — blends work and personal. Best for solo founders, freelancers, consultants.
- **Business/Teams** — organizational structure with departments, processes, stakeholders, onboarding docs.

The selected mode is stored in `claude.md` frontmatter as `os-mode: professional | business`.

#### Vault Structure (by mode)

**Solopreneurs/Professionals** (`os-mode: professional`):
```
claude.md               — Brain file (os-mode: professional)
Context/                — Who you are: me.md, business.md, strategy.md, team.md, brand.md
Projects/               — What you're working on: intelligently structured per project
Intelligence/           — What you know: meetings/, competitors/, market/, decisions/
Daily/                  — What happened: YYYY-MM-DD.md journals
Resources/              — Your library: prompts, frameworks, swipe files, templates
Skills/                 — Skill references you control: strategy, voice, reference material
```

**Business/Teams** (`os-mode: business`):
```
claude.md               — Brain file (os-mode: business)
Context/                — operator.md, organization.md, team.md, strategy.md, brand.md, stakeholders.md
Projects/               — Active projects
Departments/            — Per-department READMEs + SOPs
Teams/                  — Team directories with person profiles
Intelligence/           — meetings/ (7 types), competitors/, market/, decisions/, processes/
Daily/                  — Work logs + OKR-focused weekly reviews
Onboarding/             — Team/client/system onboarding docs
Resources/              — prompts, frameworks, swipe, templates/
Skills/                 — Skill references you control: strategy, voice, reference material
```

#### Onboarding

Mode selection + two questions:
1. Context question (mode-specific: about yourself / your organization / yourself and business)
2. Projects question (mode-specific: projects / initiatives / things you're focused on)

No follow-ups. Extracts what it can, builds the vault, reports what was created.

#### Auto-Save Behavior

The assistant never asks permission to save. When meaningful information comes up (learnings, preferences, corrections, project updates, action items), it saves to the right vault file immediately and reports what was saved. Corrections are automatically added as permanent rules in `claude.md`.

#### Context Files

| Mode | Files |
|------|-------|
| General | `me.md` (always), `business.md`, `team.md`, `strategy.md`, `brand.md` (conditional) |
| Business | `operator.md`, `organization.md`, `team.md`, `strategy.md` (always), `brand.md`, `stakeholders.md` (conditional) |
| Personal | `me.md` (always), `goals.md`, `people.md` (conditional) |

#### Project Intelligence

Projects are not flat README-only folders. The assistant intelligently structures each project based on its content:

- **Starts simple** — new project = just a `README.md`
- **Grows organically** — subdirs (`research/`, `specs/`, `drafts/`, `notes/`, `ideas/`) are created on the fly when content arrives
- **Routes info to the right file** — research goes to `research/{topic}.md`, specs to `specs/`, drafts to `drafts/` — not crammed into README
- **README stays the index** — overview, status, next steps, links to subdir contents
- **Completed projects** — moved to `Intelligence/archive/`

#### Resources (`Resources/`)

Personal library for swipe files, prompts, frameworks, templates, and reference material. Organized flat or lightly nested (e.g., `Resources/prompts/`, `Resources/frameworks/`). Business mode adds `Resources/templates/` for org document templates.

#### Key Integrations

- **Obsidian CLI** — preferred for vault operations when Obsidian is running
- **TaskNotes API** — HTTP API on localhost:8080 for task CRUD
- **Fireflies MCP** — meeting transcript sync (Business Plan)
- **Obsidian Bases** — native database views, no plugins needed
- **Defuddle** — web content extraction (`defuddle parse <url> --md`)

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
