# Setup: prerequisites and installation

Before you start Branch A or Branch B, verify the three tools this skill depends on are installed and working. Don't silently skip a step if a tool is missing. Tell the user and install it, because the whole point of the skill is that extraction/generation runs on *real scraped data*, not inferred content.

Run the checks below first. If any fail, walk the user through the install.

## Contents

- The three dependencies
- Quick one-command setup
- Verifying each tool (Firecrawl, extract-design-system, Playwright Chromium)
- The diagnostic script to run at the start of every invocation
- What to tell the user if something is missing
- What the user needs, in plain terms
- Network-offline fallback

---

## The three dependencies

| Tool                         | Why this skill needs it                                                           |
| ---------------------------- | --------------------------------------------------------------------------------- |
| **Firecrawl CLI**            | Scrapes the homepage(s) + extracts the `branding` format (colors, fonts, typography, spacing, components, logo URL, personality). Also runs keyword search when the user can't name enough references. |
| **extract-design-system**    | NPM-based Playwright CLI that returns independent, CSS-computed tokens (color palette, spacing scale, typography). Cross-checks Firecrawl's LLM-inferred values. |
| **Playwright Chromium**      | Runs both extract-design-system and the `scripts/render.mjs` rendering pipeline (SVG logo + template rasterization). |

All three run locally on the user's machine. No cloud infrastructure is needed beyond Firecrawl's hosted API.

---

## Quick one-command setup

If the user has none of the three installed and is comfortable running commands, this one line installs everything except the Firecrawl API key:

```bash
npx -y firecrawl-cli@latest init --all --browser
```

This command:
- Installs `firecrawl-cli` globally.
- Installs 12 Firecrawl skills (search, scrape, interact, build, etc.).
- Opens the user's browser to sign in / sign up to Firecrawl and obtain an API key.
- Stores the key for the CLI automatically.

The `--browser` flag triggers the sign-in dance. If the user already has a key, they can use `-k fc-<their-key>` instead and skip the browser step:

```bash
npx -y firecrawl-cli@latest init --all -k fc-YOUR_KEY_HERE
```

After that, install the extract-design-system skill into the project's `.claude/skills/` and run Playwright's Chromium installer:

```bash
# From the project root
mkdir -p .claude/skills && \
  git clone https://github.com/arvindrk/extract-design-system .claude/skills/extract-design-system 2>/dev/null || true
# or if the skill is distributed another way, follow that channel's install steps

# One-time Chromium install for Playwright
npx playwright install chromium
```

Then install Playwright as a project-local dep so the `scripts/render.mjs` script can import it:

```bash
npm init -y >/dev/null 2>&1
npm install playwright
```

---

## Verifying each tool

### Firecrawl

```bash
firecrawl --status
```

Expected output includes `Authenticated via stored credentials` and a credit count (typically 500 on a new free account).

If the command returns "not found": Firecrawl CLI isn't installed. Run the one-command setup above.

If the command returns "not authenticated": the API key wasn't saved. Re-run with `-k fc-<key>` or use `firecrawl init --browser` to re-auth.

If the credit count is `0`: the account is out of credits. Warn the user. Each scrape is ~1 credit, each search is ~1 credit. A full Branch A run is ~15–25 credits.

### extract-design-system

```bash
ls .claude/skills/extract-design-system/SKILL.md
```

If it exists: the skill is present. You can call `npx -y extract-design-system <url>` to invoke it.

If it doesn't exist: offer to fetch and install it. The skill is small (a SKILL.md + references/), so the install is instant.

### Playwright Chromium

```bash
npx -y playwright --version
```

Should print a version like `Version 1.59.1`. If the command fails or prompts to install: run `npx playwright install chromium`.

To verify Chromium specifically is present (Playwright sometimes reports "installed" but Chromium isn't downloaded):

```bash
ls ~/Library/Caches/ms-playwright 2>/dev/null | head -5
```

On macOS, you should see a `chromium-<build>` directory. If empty, run `npx playwright install chromium`.

---

## The diagnostic script you should run at the start of every skill invocation

At the top of Branch A or B, before asking any discovery questions, run this shell pipeline and react to the output:

```bash
echo "=== Firecrawl ==="; firecrawl --status 2>&1 | head -5 || echo "FIRECRAWL_MISSING"
echo "=== extract-design-system ==="; test -f .claude/skills/extract-design-system/SKILL.md && echo "OK" || echo "EDS_MISSING"
echo "=== Playwright / Chromium ==="; npx -y playwright --version 2>&1 | head -1 || echo "PLAYWRIGHT_MISSING"
```

If anything reports `MISSING`, pause the workflow and walk the user through the install before continuing. Don't proceed with invented data.

---

## What to tell the user if something is missing

Match your instructions to what they're missing. Don't dump the whole setup on them if only one thing's missing.

### Firecrawl missing

> I need Firecrawl to scrape the reference/website data. It's a quick one-time install. Run this and come back:
>
> ```bash
> npx -y firecrawl-cli@latest init --all --browser
> ```
>
> It'll open your browser to sign up (free, 500 scrapes/month). Come back when you see "Authenticated" and "500 / 500 credits."

### extract-design-system missing

> I need the extract-design-system skill for computing real CSS tokens (colors/fonts/spacing) from live sites. It installs into this project's `.claude/skills/`. Let me install it:
>
> [Then install it programmatically and confirm.]

### Playwright Chromium missing

> One-time install for the headless browser we use to render logos:
>
> ```bash
> npm install playwright
> npx playwright install chromium
> ```
>
> First command is instant; Chromium download is ~200 MB. Come back when it's done.

---

## What the user needs, in plain terms

Strip the jargon and tell them the human version when they ask:

- **Firecrawl**: "Scrapes websites cleanly. We'll use it to read the competitor sites you mention, or your own website if we're extracting an existing brand. Free account, 500 scrapes/month."
- **extract-design-system**: "A small helper that visits a website and reads the real CSS to find exact colors, fonts, and spacing. Complementary to Firecrawl."
- **Playwright Chromium**: "A headless browser. We use it to render your new logo into JPG and PNG, and to verify the extract-design-system tool works. One-time install."

---

## Network-offline fallback

If the user is offline or behind a restrictive firewall and can't install Firecrawl / Chromium:

1. **Branch A** becomes very hard. You can still do everything *after* the scraping step, but the reference extraction fails. Ask the user to paste screenshots of the reference sites instead, and work from those.
2. **Branch B** still works if the user provides their own asset files directly (logo SVGs, brand docs, etc.). You'll miss the live website extraction step but the uploaded assets carry most of the load.

Warn them that an offline run produces a less rigorous system. Proceed only if they're OK with that trade-off.
