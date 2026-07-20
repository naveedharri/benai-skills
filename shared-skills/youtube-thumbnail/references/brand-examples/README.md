# Brand Examples: Ben AI's 10 Most Recent Thumbnails

These are the 10 most recently published thumbnails from Ben AI (youtube.com/@benai, channel `UC3KK7ENB_ierAXvrxVNnbZQ`), pulled at maxres. They are the ground truth for what a Ben AI thumbnail actually looks like right now. When building any `new-with-ben` or `variation` batch, READ 2 to 4 of these first (via the `Read` tool) and match their composition, palette, and typography before you write a single prompt. They override the written defaults whenever the two conflict, because they are what is shipping.

Ordered most recent first (`01` = latest).

| # | File | Video |
|---|------|-------|
| 01 | `01-claude-second-brain-sales.jpg` | This Claude Second Brain Setup Will Change How You Do Sales Forever |
| 02 | `02-skill-10x-claude-output.jpg` | This Skill Instantly 10x's Every Claude Output |
| 03 | `03-claude-tag-slack.jpg` | Claude Tag + Slack Will Change How You Work Forever |
| 04 | `04-every-way-claude-second-brain.jpg` | Every Way To Set Up A Claude Second Brain Explained |
| 05 | `05-de-slop-ai-output.jpg` | How to De-Slop Every AI Output Forever (With 1 Skill) |
| 06 | `06-6-things-wrong-ai-os.jpg` | 6 Things People Get Wrong Setting up An AI OS (+ Fixes) |
| 07 | `07-claude-managed-agents-sell-ai.jpg` | Claude Managed Agents Will Change How You Sell AI Forever |
| 08 | `08-stop-using-claude-without-agentic-os.jpg` | Stop Using Claude Without an Agentic OS |
| 09 | `09-12-claude-plugins-skills-mcps.jpg` | 12 Claude Plugins, Skills & MCP's I Can't Live Without |
| 10 | `10-every-claude-cowork-feature.jpg` | Every Claude Cowork Feature Explained Clearly |

## Recurring patterns across the set (the brand at a glance)

- **Background**: deep charcoal (`#1F1F1F` range) with a subtle dot-grid texture and a soft vignette. Never flat pure black, never a bright color field.
- **Ben**: right third, chest-up, plain black t-shirt or hoodie, slight smile, warm front-left key light with a gentle rim. Face untouched across a batch.
- **Headline**: 2 to 4 words, bold uppercase white sans, left-aligned on the left third. Often a two-line stack with the punchword enlarged (e.g. "MY FAVORITE / SKILL"). Text is the punchline, not a sentence.
- **Accent**: signature coral (`#E97B5D`) on the one hero object per frame: a folder, an app icon, a rounded-square tile, or the circle mark.
- **The mark**: the real Ben AI mark is a coral circle (or rounded square) holding a single white starburst/asterisk. It appears as a small app-icon tile top-left or on the coral object. Do NOT invent a different logo; do NOT render partner brand logos from text.
- **Arrow**: at most one hand-drawn white curved arrow, pointing from the headline toward the hero visual. Never two.
- **Hero visual**: exactly one supporting object carrying the concept, center-left, between the headline and Ben. A laptop screenshot, a coral folder with a `/command` label, a stack of tiles. No empty reserved rectangles; the frame fills edge-to-edge.

## How to use these

1. Before a `new-with-ben` or `variation` run, `Read` the 2 to 4 examples closest to the current topic (screenshots for tool demos, coral folder for skills, node-graph for OS/second-brain topics).
2. Extract the shared signals (dot-grid, coral hero object, uppercase headline, single arrow, Ben right third) and lock them into every variant.
3. Pass the single most relevant example into `medias[]` as a style anchor alongside the Ben reference photo when it sharpens brand match.

## Refreshing this set

These go stale as Ben ships new videos. To refresh: get the 10 latest via `searchVideos(channelId="UC3KK7ENB_ierAXvrxVNnbZQ", order="date", maxResults=10)`, then download each at `https://img.youtube.com/vi/{videoId}/maxresdefault.jpg`. Keep the `01`..`10` most-recent-first naming.
