# BenAI Skills

Expert automation skills for Claude Code, organized by department.

## Installation

```bash
# Add marketplace
/plugin marketplace add naveedharri/benai-skills

# Install a department plugin
/plugin install marketing@benai-skills
/plugin install sales@benai-skills
/plugin install operations@benai-skills
/plugin install creative@benai-skills
/plugin install product@benai-skills
/plugin install youtube@benai-skills
```

## Setup

Some skills require API keys. Create a `.env` file in your project directory:

```bash
# Quick setup
curl -O https://raw.githubusercontent.com/naveedharri/benai-skills/main/.env.example
mv .env.example .env
# Edit .env and add your API keys
```

Or copy from this repo's `.env.example` and fill in your keys.

### Required API Keys by Plugin

| Plugin | Required Keys | Get Keys | Used By |
|--------|---------------|----------|---------|
| **Marketing** | `GEMINI_API_KEY`<br>`APIFY_TOKEN` | [Gemini](https://aistudio.google.com/apikey)<br>[Apify](https://console.apify.com) | `/infographic`<br>`/seo-audit`, `/programmatic-seo`<br>`/x-tweet-scraper`, `/x-follower-scraper` |
| **BenAI Sales** | `APIFY_TOKEN` | [Apify](https://console.apify.com) | `/x-tweet-scraper`, `/x-follower-scraper` |
| **Creative** | `GEMINI_API_KEY` | [Gemini](https://aistudio.google.com/apikey) | `/infographic` |
| **Operations** | `N8N_API_URL`<br>`N8N_API_KEY` | Your n8n instance | `/n8n` |

**Important:** Add `.env` to your `.gitignore` to keep your API keys secure.

## Available Departments

### Marketing (15 skills)
| Skill | Command | Purpose |
|-------|---------|---------|
| Programmatic SEO | `/programmatic-seo` | SEO-optimized pages at scale |
| SEO Optimizing | `/seo-optimizing` | Data-driven SEO via Search Console |
| SEO Audit | `/seo-audit` | Technical SEO audits (148 rules) |
| Email Sequence | `/email-sequence` | Email sequences & drip campaigns |
| Case Study | `/case-study` | Data-driven case studies |
| Infographic | `/infographic` | AI-generated infographics |
| LinkedIn Writer | `/linkedin-writer` | LinkedIn posts & carousels from content |
| Newsletter Writer | `/newsletter-writer` | Newsletter editions from content |
| Title Generation | `/title-generation` | Optimized YouTube video titles |
| GIF Creator | `/gif-creator` | GIFs from video clips |
| Excalidraw | `/excalidraw` | Presentations & diagrams |
| Website Launch Kit | `/website-launch-kit` | Custom landing pages through conversation |
| Course Creator | `/course-creator` | Courses from idea to launch-ready package |
| X Tweet Scraper | `/x-tweet-scraper` | Collect bounded public X post datasets through Apify |
| X Follower Scraper | `/x-follower-scraper` | Export bounded public X audiences through Apify |

**Commands:** `/marketing` (skill overview), `/repurpose` (content repurposing workflow)

### BenAI Sales (16 skills)
| Skill | Command | Purpose |
|-------|---------|---------|
| Lead Generation | `/lead-generation` | Source, qualify, enrich, and research B2B leads end to end |
| CRM Prospect Mining | `/crm-prospect-mining` | Mine prospects from CRM lost/stalled stages |
| LinkedIn Post Engagers | `/linkedin-post-engagers` | Scrape LinkedIn post commenters/reactors into a warm list |
| Call Prep | `/call-prep` | Prep calls into a live BenAI-branded instant-ui dashboard |
| Client One-Pager | `/client-onepager` | Personalize and deploy the client one-pager from the template |
| Pipeline Review | `/pipeline-review` | Read-only pipeline stage review delivered to Slack |
| Post-Disco Followup | `/post-disco-followup` | Post-discovery recap email + proposal from the transcript |
| Setup Post-Disco | `/setup-post-disco` | One-time interactive setup for post-disco-followup |
| Sales Rep Analyzer | `/sales-rep-analyzer` | Grade sales call performance with an instant-ui report |
| Create an Asset | `/create-an-asset` | Tailored sales asset (landing page, deck, one-pager, demo) |
| Email Personalization | `/email-personalization` | Hyper-personalized email icebreakers |
| Lead Intelligence | `/lead-intelligence` | Deep-research leads via web & LinkedIn |
| Lead Qualification | `/lead-qualification` | Qualify & score leads against ICP |
| Win/Loss Analysis | `/win-loss-analysis` | Analyze won vs lost deal patterns |
| X Tweet Scraper | `/x-tweet-scraper` | Collect bounded public X post datasets through Apify |
| X Follower Scraper | `/x-follower-scraper` | Export bounded public X audiences through Apify |

**Agents:** `lead-qualifier`, `lead-researcher`, `icebreaker-writer`, `linkedin-scraper`

### Operations (2 skills)
| Skill | Command | Purpose |
|-------|---------|---------|
| n8n Automation | `/n8n` | n8n workflow automation |
| n8n Blueprint Generator | `/n8n-prd-generator` | Automation blueprints from calls |

**Commands:** `/operations` (skill overview)

### Creative (3 skills)
| Skill | Command | Purpose |
|-------|---------|---------|
| Video | `/video` | Video editing (FFmpeg/Remotion) |
| Excalidraw | `/excalidraw` | Presentations & diagrams |
| Infographic | `/infographic` | AI-generated infographics |

**Commands:** `/creative` (skill overview)

### Product (2 skills)
| Skill | Command | Purpose |
|-------|---------|---------|
| Excalidraw | `/excalidraw` | Presentations & diagrams |
| n8n Blueprint Generator | `/n8n-prd-generator` | Automation blueprints from calls |

**Commands:** `/product` (skill overview)

### YouTube (7 skills)
| Skill | Command | Purpose |
|-------|---------|---------|
| YouTube Brief | `/youtube-brief` | Structured video briefs |
| YouTube Ideation | `/youtube-ideation` | Video topic generation |
| YouTube Packaging | `/youtube-packaging` | Titles & thumbnails for CTR |
| YouTube Outline | `/youtube-outline` | Video structure & visual planning |
| YouTube Scripting | `/youtube-scripting` | Scripts & bullet points for filming |
| YouTube Excalidraw | `/youtube-excalidraw` | On-screen excalidraw visuals |
| Title Generation | `/title-generation` | Optimized YouTube video titles |

**Commands:** `/youtube` (skill overview)

### Marketing OS (8 skills)
| Skill | Command | Purpose |
|-------|---------|---------|
| Marketing OS Setup | `/marketing-os-setup` | Build the Marketing OS end to end |
| Marketing OS Routines | `/marketing-os-routines` | Register the routines, audit for silent failure |
| Marketing OS Dashboard | `/marketing-os-dashboard` | Rebuild and deploy the control center |
| OS Optimizer | `/os-optimizer` | Framework audit of the vault |
| OS Operator | `/os-operator` | Recurring Operator prompt |
| OS MCP | `/os-mcp` | Relay MCP on your own Railway account |
| Team OS | `/team-os` | BenAI Relay fork for a shared OS |
| Instant UI | `/instant-ui` | Renders the OS and its reports as BenAI-branded HTML |

The OS layer, not the marketing skills. Those live in the Marketing, Content, YouTube, SEO, and Ads plugins.

`/marketing-os-setup` builds a markdown second brain that becomes the single source of truth every marketing skill reads. The problem it solves is concrete and measurable in this repo: `icp-ideal-customer-profile.md` and `what-we-do-offer.md` exist as five separate physical copies across the marketing plugins, plus three more inside the newsletter writers. Update one and seven go stale.

Ten folders (Context, Channels, Content, Campaigns, Intelligence, Analytics, Resources, Daily, Dashboard, Routines), ten routine prompts that keep it current, and a self-contained six-tab dashboard. Setup walks five pillars in order: connectors, Context, structure, routines, dashboard. It is idempotent and safe to re-run.

---

### n8n Automation

Build, test, and deploy n8n workflows via REST API with incremental testing. Includes node references for 40+ common nodes, JavaScript/Python Code node patterns, expression syntax, and credential management. Also includes the **n8n Blueprint Generator** (`/n8n-prd-generator`) for converting discovery call transcripts into n8n automation blueprints.

**Requires:** `N8N_API_URL`, `N8N_API_KEY`, and `N8N_CREDENTIALS_TEMPLATE_URL` in your `.env` file (see Setup section above).

### Video Editing

Video editing pipeline with FFmpeg and Remotion. Supports stitching, transitions, TikTok-style captions, teasers, transcription, title cards, and graphics generation.

### Excalidraw

Create visual presentations, slide decks, and diagrams in Excalidraw. Supports generating `.excalidraw` JSON files or injecting slides directly into excalidraw.com via Chrome browser automation.

### Email Sequence

Design email sequences including welcome/onboarding, lead nurture, re-engagement, post-purchase, and sales sequences. Includes copy guidelines and sequence templates.

### SEO Suite

Three complementary SEO plugins:

| Plugin | Role | Data Source |
|--------|------|-------------|
| **seo-audit** | Technical diagnosis — what's broken | seomator CLI |
| **seo-optimizing** | Data-driven strategy — what to DO | Google Search Console API |
| **programmatic-seo** | Scale content creation | Templates + data sources |

**seo-audit** runs comprehensive technical SEO audits covering 16 categories and 148 rules using seomator CLI. Requires `@seomator/seo-audit` (installed automatically on first use).

**seo-optimizing** uses real Google Search Console data to find striking-distance keywords, fix low-CTR pages, detect keyword cannibalization, and execute content optimizations. Three data paths:
- **API path:** Service account + GSC API (up to 25,000 rows)
- **Browser path:** Claude Code browser extension navigates GSC directly (zero setup)
- **CSV path:** Manual export from GSC web UI

**programmatic-seo** generates SEO-optimized pages at scale using templates and data sources with Webflow CMS integration.

### Infographic

Generate professional infographics and visual content using Gemini AI image generation. Supports visual metaphors, brand guidelines, series creation, and iterative refinement.

### Content Repurposing

Repurpose content into multiple formats via the `/repurpose` command in the Marketing plugin. **LinkedIn Writer** (`/linkedin-writer`) creates posts and carousels from existing content. **Newsletter Writer** (`/newsletter-writer`) transforms content into engaging newsletter editions. **Title Generation** (`/title-generation`) generates optimized YouTube video titles using proven CTR formulas. **GIF Creator** (`/gif-creator`) extracts and optimizes GIFs from video clips for social media sharing.

### Outbound Pipeline

The BenAI Sales plugin includes a full B2B outbound pipeline (`/lead-generation`) that orchestrates four sub-agents in parallel: **lead-qualifier** scores leads against your ICP, **lead-researcher** gathers deep company intelligence, **linkedin-scraper** pulls LinkedIn profiles and posts via Apify, and **icebreaker-writer** generates hyper-personalized email openers from the collected intelligence.

## Project Structure

```
benai-skills/
├── .claude-plugin/
│   ├── marketplace.json
│   └── skills-map.json          # Defines which departments get which skills
├── shared-skills/               # Single source of truth for all skills
│   ├── programmatic-seo/
│   ├── seo-optimizing/
│   ├── seo-audit/
│   ├── email-sequence/
│   ├── case-study/
│   ├── infographic/
│   ├── lead-research-assistant/
│   ├── email-personalization/
│   ├── lead-intelligence/
│   ├── lead-qualification/
│   ├── n8n-prd-generator/
│   ├── n8n/
│   ├── video/
│   ├── excalidraw/
│   ├── linkedin-writer/
│   ├── newsletter-writer/
│   ├── title-generation/
│   └── gif-creator/
├── agents/                      # Sub-agent definitions for orchestrated pipelines
│   ├── lead-qualifier.md
│   ├── lead-researcher.md
│   ├── icebreaker-writer.md
│   └── linkedin-scraper.md
├── commands/                    # Static command .md files mapped in skills-map.json
│   ├── marketing.md
│   ├── sales.md
│   ├── operations.md
│   ├── creative.md
│   ├── product.md
│   ├── repurpose.md
│   ├── outbound-pipeline.md
│   └── youtube.md
├── plugins/                     # Generated by sync-skills.sh — do not edit directly
│   ├── marketing/
│   ├── sales/
│   ├── operations/
│   ├── creative/
│   ├── product/
│   └── youtube/
├── sync-skills.sh               # Generates plugins/ from shared-skills/ + skills-map.json
├── build-zips.sh                # Builds distributable zips (runs sync first)
├── CLAUDE.md
└── README.md
```

Each department plugin follows the same structure:
```
plugins/<department>/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   └── <command>.md             # Mapped from commands/ via skills-map.json
└── skills/                      # Populated by sync-skills.sh
    └── <skill-name>/
        ├── SKILL.md
        └── references/
```

## Adding New Skills

1. Create the skill directory in `shared-skills/` with `SKILL.md` and optional `references/`
2. Add the skill to the relevant departments in `.claude-plugin/skills-map.json`
3. If needed, add command `.md` files in `commands/` and map them in `skills-map.json`
4. Run `./sync-skills.sh` to generate department plugins

## Editing Existing Skills

1. Edit the skill in `shared-skills/<skill>/` (never in `plugins/*/skills/`)
2. Run `./sync-skills.sh` to propagate changes

**Before every push**, run `./sync-skills.sh` to ensure departments are in sync.

## Building Distributable Zips

Run `./build-zips.sh` to generate downloadable zip files in `dist/`. The script runs `sync-skills.sh` first, then reads `marketplace.json` and creates:
- One zip per department (standalone, installable individually)
- `benai-skills-marketplace.zip` (all departments in one package)

## License

BenAI
