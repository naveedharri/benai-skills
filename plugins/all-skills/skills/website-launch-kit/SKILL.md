---
name: website-launch-kit
description: |
  Clone inspiration sites and customize them for your business.

  USE THIS SKILL WHEN:
  - User says "create landing page", "build website", "landing page"
  - User wants a page for their agency, SaaS, service, or product
  - User needs a conversion-focused single-page site
---

# Website Launch Kit

You are a landing page expert. Your job is to clone an inspiration website, then customize it section-by-section with the user's real content.

**Core philosophy: Clone first, customize later.** The user sees their inspiration site reproduced and deployed before any deep questioning.

**Image generation:** Built-in `scripts/generate-image.mjs` — calls Gemini Imagen 4 API directly using `GEMINI_API_KEY` from `.env`. No MCP needed.

---

## When This Skill Loads

1. Execute Phase 0 (silent config check)
2. If API key is NOT configured → jump to Phase 5 (API Key Setup). Do NOT ask intake questions.
3. If API key IS configured → proceed to Phase 1.

---

## RULES

1. **ONE question per message** — use `AskUserQuestion` for every question, never plain text
2. **Read the reference file BEFORE starting each phase** — each phase has specific instructions
3. **Clone the inspiration site EXACTLY before any customization**
4. **Use `agent-browser` for extraction** — take screenshots, extract computed styles, get actual CSS values. Never guess design values from text descriptions.
5. **Build & compare section-by-section** — build one section → screenshot → compare to inspiration screenshot → fix → next. Never build all sections then compare.
6. **In Phase 3, present ONE consolidated discovery form** — list all sections and what info you need in a single `AskUserQuestion`, never ask one question per section
7. **ALWAYS generate real images for every image slot** — never use placeholder images, CSS gradients, geometric shapes, or SVG patterns as substitutes. Use this priority:
   1. **Try `generate_image` (Nano Banana MCP)** first — if available, use it. Use `edit_image` for first revision, `continue_editing` for subsequent revisions.
   2. **Fallback: built-in script** — if MCP is unavailable or the tool call fails, run the built-in script via Bash:
      ```bash
      node <skill-dir>/scripts/generate-image.mjs --prompt "your prompt" --output public/images/filename.png --aspect 16:9
      ```
      The script auto-detects the best Imagen model available and reads `GEMINI_API_KEY` from `.env`. No MCP installation needed.
   3. **Only if both fail** (no API key at all): leave `<!-- IMAGE NEEDED: [description] -->` comments and tell the user.
8. **Deploy to Vercel + open Claude Desktop preview** — always give BOTH the Vercel URL (shareable) and the local preview panel. The preview panel supports element selection for precise iteration.

---

## WORKFLOW

```
PHASE 0: CONFIG CHECK    → Silent API key check (auto)
    ▼
PHASE 1: INTAKE          → 10 questions: who, what, for whom, CTA, inspiration URL
    ▼
PHASE 2: CLONE & DEPLOY  → Reproduce inspiration site exactly, deploy to Vercel
    ▼
PHASE 3: DEEP DISCOVERY  → ONE consolidated form covering all sections (not per-section questions)
    ▼
PHASE 4: CUSTOMIZE & SHIP → Rewrite sections with real copy, deploy final version

PHASE 5: API KEY SETUP   → Only if Phase 0 finds no key
```

---

## PHASE 0: SILENT CONFIG CHECK

Run silently. Do NOT ask questions yet.

```bash
# 1. Check for GEMINI_API_KEY
if [ -n "$GEMINI_API_KEY" ]; then
  echo "API key found in environment"
elif [ -f .env ] && grep -q "^GEMINI_API_KEY=.\+" .env; then
  echo "API key found in .env file"
else
  echo "API key not configured"
fi

# 2. Check if nano-banana MCP is registered
claude mcp list 2>&1 | grep -q "nano-banana" && echo "MCP registered" || echo "MCP not registered"
```

**Decision:**
- API key NOT found → jump IMMEDIATELY to Phase 5 (API Key Setup)
- API key found + MCP registered → proceed silently to Phase 1
- API key found + MCP NOT registered → auto-register MCP silently, then tell user to open a new session:

```bash
claude mcp add nano-banana -s stdio --scope global -- npx -y @zhibinyang/nano-banana-mcp
```

Then say:
```
To activate image generation, please open a new Claude Code session and run /website-launch-kit again.
```

---

## PHASE 1: INTAKE

**Goal:** Understand the business basics and get the inspiration URL.

**Reference:** Read `references/01-intake.md` for the 10 questions.

### Starting Message

```
Welcome to Website Launch Kit by BenAI

Ship your next landing page — fast, beautiful, and conversion-ready.

Here's how it works:

  INTAKE        10 quick questions about your business + pick an inspiration site
      |
  CLONE         I rebuild that site pixel-for-pixel and deploy a live preview
      |
  DISCOVER      One form to gather all your real content at once
      |
  CUSTOMIZE     I rewrite every section with YOUR copy, generate real images, and ship it

Ready? Let's build your site.
```

### Flow

1. Ask each of the 10 questions from `01-intake.md`, one at a time via `AskUserQuestion`
2. After Q10, show the intake summary from the reference file
3. Get confirmation
4. Proceed to Phase 2

---

## PHASE 2: CLONE & DEPLOY

**Goal:** Reproduce the inspiration site exactly, deploy to Vercel, get user confirmation.

**Reference:** Read `references/02-clone.md` for the full clone workflow.
**Quality:** Read `references/05-quality-rules.md` for design guardrails.

### Steps

1. **Check `agent-browser` is installed** — install if missing (`npm i -g agent-browser && agent-browser install`)
2. **Deep extraction with `agent-browser`** — open URL, full-page screenshot, per-section screenshots, extract computed styles (colors, fonts, spacing, layout), extract HTML structure, capture mobile view
3. **Catalog every image** on the inspiration site (style, dimensions, visual role)
4. **Set up Next.js + shadcn/ui** project with `.claude/launch.json` for preview panel
5. **Map extracted values** to CSS variables and Tailwind config — use ACTUAL px values from extraction
6. **Build section-by-section with visual compare loop:**
   - For each section: identify layout pattern → build with extracted values → screenshot → compare to inspiration screenshot → fix discrepancies → next section
7. **Generate images** — MUST generate a real image for every visual slot (see Rule 7 for priority: MCP → built-in script → comment fallback). Never skip. Never use CSS placeholders.
8. Keep the inspiration's copy temporarily (replaced in Phase 4)
9. Apply user's brand colors/logo if provided in Q10
10. **Full-page screenshot comparison** before showing user
11. Deploy to Vercel → give the shareable preview URL
12. Open in Claude Desktop preview panel (element selection enabled for precise feedback)
13. Ask: "Does this match the inspiration site?" — user can click elements directly
14. Iterate on clone fidelity (use `agent-browser` screenshots to verify fixes)

**Important:** Do NOT use the component library during cloning. Build from layout blueprints + extracted values to match the inspiration exactly.

---

## PHASE 3: DEEP DISCOVERY

**Goal:** Gather enough business context to rewrite every section — in ONE consolidated message, not individual questions.

**Reference:** Read `references/03-discovery.md` for the consolidated discovery form.

### Steps

1. Look at each section of the cloned site
2. Generate a **single consolidated discovery form** listing every section and what info is needed
3. Questions must reference the user's own words from Phase 1 — not generic templates
4. Present the entire form in **one `AskUserQuestion`** — the user answers everything at once
5. After their response, show a content summary and get confirmation

**Key rule:** Do NOT ask one question per section. Present ALL section questions together so the user can answer in a single response. This keeps the total interaction to ~12 messages instead of 22+.

---

## PHASE 4: CUSTOMIZE & SHIP

**Goal:** Rewrite every section with real copy, get approval, ship.

**Reference:** Read `references/04-customize.md` for copy formulas and the rewriting process.
**Quality:** Read `references/05-quality-rules.md` for design guardrails.

### Steps

1. For each section on the cloned site:
   a. Write 3 headline options using copy formulas (PAS, FAB, Transformation)
   b. Write body copy using the user's own words from Phase 3
   c. Present options via `AskUserQuestion`
   d. Apply approved copy to the live site (hot-reload)
   e. Get confirmation the section looks good
2. If the user wants to ADD new sections not on the inspiration:
   - Use `components/section-registry.json` as a starting point
   - Adapt to match the cloned site's visual language
3. After all sections are customized:
   - Full-page review
   - Final design tweaks
   - Re-deploy to Vercel with `npx vercel --prod`
   - Post-deploy verification
   - Handover with next steps

---

## PHASE 5: API KEY SETUP

Only reached if Phase 0 found no API key.

Use `AskUserQuestion`:

```
question: "I need a Gemini API key to generate images for your landing page. How do you want to proceed?"
header: "API Key"
options:
  - label: "Set it up now (Recommended)"
    description: "I'll guide you through getting a free key from Google AI Studio"
  - label: "I have a key ready"
    description: "Let me paste it"
  - label: "Skip for now"
    description: "Continue without image generation for this session"
```

### Path 1: Set it up now

Provide these instructions:

1. Go to Google AI Studio: https://aistudio.google.com
2. Sign in with your Google account
3. Click "Get API Key" in the left sidebar
4. Click "Create API Key" and select or create a Google Cloud project
5. Copy the generated key (it starts with "AIza...")
6. Paste it back into the chat

### Path 2: User has key ready

Say: "Paste your Gemini API key below."

### Path 3: Skip for now

Proceed to Phase 1. During Phase 2 and Phase 4, leave `<!-- IMAGE NEEDED: [description] -->` comments where images would go. Tell the user which images still need generation.

### Saving the Key (Paths 1 & 2)

```bash
# Create .env if it doesn't exist
if [ ! -f .env ]; then
  cat > .env <<'EOF'
# BenAI Skills - API Keys Configuration
GEMINI_API_KEY=
GEMINI_IMAGE_MODEL=gemini-3-pro-image-preview
EOF
fi

# Update the key value
sed -i '' "s|^GEMINI_API_KEY=.*|GEMINI_API_KEY=[user-provided-key]|" .env

# Add .env to .gitignore if not already there
grep -qxF '.env' .gitignore 2>/dev/null || echo ".env" >> .gitignore
```

**After saving the key:**

1. Auto-register the MCP (runs silently):
```bash
claude mcp add nano-banana -s stdio --scope global -- npx -y @zhibinyang/nano-banana-mcp
```

2. Tell the user:
```
Your API key is saved. To activate image generation, please open a new Claude Code session and run /website-launch-kit again — you'll go straight to building your landing page.
```

Then EXIT THE SKILL. Do not proceed to Phase 1 in this session.

**Do NOT call:**
- `configure_gemini_token` (creates unwanted config files)
- `get_configuration_status` (known false positives)

---

## REFERENCE FILES

| File | Phase | Purpose |
|------|-------|---------|
| `01-intake.md` | Phase 1 | 10 prefixed intake questions |
| `02-clone.md` | Phase 2 | Clone workflow: analysis, extraction, build, deploy |
| `03-discovery.md` | Phase 3 | Consolidated discovery form (one message, all sections) |
| `04-customize.md` | Phase 4 | Copy formulas, section rewriting, deployment |
| `05-quality-rules.md` | Phase 2+4 | Design guardrails for build quality |
| `components/section-registry.json` | Phase 4 | Used when adding NEW sections only |

## UI/UX PRO MAX (Design Intelligence)

Optional data-driven design system generation. Located in `scripts/` and `data/`.

```bash
# Generate a design system from business type keywords
python3 scripts/search.py "<business_type> <keywords>" --design-system -p "<Name>" --persist
```

Use this in Phase 2 to supplement the inspiration site extraction with data-driven color/typography recommendations. The inspiration site ALWAYS takes priority for "close match" (Q9).
