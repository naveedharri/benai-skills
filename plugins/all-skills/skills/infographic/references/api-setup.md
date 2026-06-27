# API Key Setup Guide

How the Gemini API key is configured for image generation via the Nano Banana MCP server.

---

## How It Works

The Nano Banana MCP server (`@zhibinyang/nano-banana-mcp`) is automatically registered when you install the marketing or creative department plugin. The MCP server has `dotenv` as a dependency and **automatically loads `.env` from the project directory at startup**.

**Setup flow:**
1. User provides their Gemini API key during the skill's Phase 4
2. The skill saves it to `.env` in the project directory
3. User restarts Claude Code (which restarts the MCP server)
4. MCP server's `dotenv` loads `.env` automatically → gets `GEMINI_API_KEY`
5. Image generation works!

**How the skill checks for the key:**
- First checks bash `$GEMINI_API_KEY` environment variable
- If not set, checks `.env` file for `GEMINI_API_KEY=<value>`
- If found in either → the MCP server has it (via dotenv) → proceed
- If not found in either → ask user for key (Phase 4)

**Benefits of this approach:**
- ✅ Single `.env` file for ALL API keys (Gemini, Apify, n8n, etc.)
- ✅ No scattered config JSON files (no `.nano-banana-config.json`)
- ✅ Standard environment variable pattern
- ✅ MCP server loads `.env` automatically via dotenv
- ✅ Easy to manage and version control (.env in .gitignore)

---

## Three Paths for API Key Handling

When the key is not configured, offer three options:

1. **Set it up now** — Guide through Google AI Studio + configure via MCP tool
2. **User has key ready** — Configure via MCP tool
3. **Skip for now** — Output prompt for manual use elsewhere

---

## Path 1: Set Up Now (Guided Setup)

### Step-by-Step Instructions

Present these instructions to the user:

```
To get your free Gemini API key:

1. Go to Google AI Studio: https://aistudio.google.com

2. Sign in with your Google account
   (If you don't have one, you'll need to create one)

3. Click "Get API Key" in the left sidebar
   (Or look for "API keys" in the menu)

4. Click "Create API key"
   - Select an existing Google Cloud project, OR
   - Click "Create project" to make a new one

5. Copy the generated key
   It looks like: AIzaSy...long-string...XYZ

6. Paste the key here when ready.

Note: The Gemini API has a generous free tier. You won't be charged
for normal infographic generation usage.
```

### After User Provides Key

1. **Save to `.env` file:**
   ```bash
   # Create .env if it doesn't exist
   if [ ! -f .env ]; then
     cat > .env <<'EOF'
# BenAI Skills - API Keys Configuration
GEMINI_API_KEY=
EOF
   fi

   # Update the key
   sed -i '' "s|^GEMINI_API_KEY=.*|GEMINI_API_KEY=user-provided-key|" .env

   # Add to .gitignore for security
   echo ".env" >> .gitignore 2>/dev/null || true
   ```

2. **Confirm to user:**
   ```
   ✅ API key saved to .env!

   To make it work:
   1. Restart Claude Code so it picks up the GEMINI_API_KEY from .env
   2. OR manually set it: export GEMINI_API_KEY="your-key"
   3. Then run /infographic again

   All MCP servers that need GEMINI_API_KEY will now have access to it.
   ```

**Why restart is needed:** Claude Code reads environment variables at startup and passes them to MCP servers. The `.env` file is just storage—you need to load it into the environment.

---

## Path 2: User Has Key Ready

If user selects "I have a key ready":

```
Great! Paste your API key here and I'll configure it.
```

If user pastes a key:
1. Save to `.env` file
2. Confirm and tell user to restart Claude Code
3. After restart, the key will be available to all MCP servers

---

## Path 3: Skip for Now

If user chooses to skip:

```
No problem! I'll complete all the planning phases and give you a
ready-to-use prompt at the end.

You can then:
- Paste the prompt into Google AI Studio (aistudio.google.com)
- Use it with ChatGPT or other image AIs
- Come back later with /infographic after setting up your key

Let's continue with the design...
```

### What Changes in Skip Mode

- Complete Phases 1-5 normally (all planning and specification)
- In Phase 6, instead of calling the MCP tool:
  1. Show the complete prompt
  2. Save prompt to `.infographic/prompts/[topic]-prompt.md`
  3. Provide instructions for manual generation

### Skip Mode Output

```
Here's your ready-to-use prompt:

---
[Complete prompt from Phase 6]
---

To generate your infographic:

Option 1: Google AI Studio (Recommended)
1. Go to aistudio.google.com
2. Create a new prompt
3. Paste this prompt
4. Click "Run" or "Generate"
5. Download the resulting image

Option 2: Other Image AIs
This prompt works with most image generation tools.
Paste it into your preferred service.

I've saved this prompt to: .infographic/prompts/[topic]-prompt.md

When you're ready to set up your API key, run /infographic again
and I'll use your saved brand preferences.
```

Save the prompt:

```bash
mkdir -p .infographic/prompts

cat > .infographic/prompts/[topic-slug]-prompt.md <<'EOF'
# Infographic Prompt: [Topic]

## Specifications
- Platform: [platform]
- Aspect Ratio: [ratio]
- Resolution: [resolution]
- Style: [tone]

## Prompt
```
[Full prompt text]
```

## Usage Instructions
1. Go to Google AI Studio (aistudio.google.com)
2. Select "Gemini" model
3. Paste the prompt above
4. Click Generate
5. Download the image

---
*Generated: [ISO-8601-timestamp]*
EOF
```

---

## Verification

### Check environment variable:

```bash
if [ -n "$GEMINI_API_KEY" ]; then
  echo "GEMINI_API_KEY is set: ${GEMINI_API_KEY:0:10}..."
else
  echo "GEMINI_API_KEY not found in environment"
fi
```

If set, the key is available to all MCP servers.

### Check `.env` file:

```bash
if [ -f .env ] && grep -q GEMINI_API_KEY .env; then
  echo "Key found in .env:"
  cat .env | grep GEMINI_API_KEY
else
  echo ".env file not found or key not in file"
fi
```

**Important:** The `.env` file is the source of truth. Claude Code loads it at startup and passes the value to MCP servers via the `env` block in `plugin.json`.

**⚠️ Do NOT use these MCP tools:**
- `get_configuration_status` - gives false positives
- `configure_gemini_token` - creates unwanted `.nano-banana-config.json` file

Always check the environment variable directly.

---

## Troubleshooting

### "MCP tool not available"

The Nano Banana MCP server may not be running. This happens if:
- The plugin was not installed correctly
- npx cannot find the `nano-banana-mcp` package
- Network issues preventing npx download

Solution: Verify the plugin installation, ensure internet connectivity, or fall back to the "Skip for now" path.

### "API key not valid"

The key may be incorrect or expired:

```
That key doesn't seem to work. Let's try again:

1. Go back to aistudio.google.com
2. Check your API keys list
3. Make sure the key is enabled
4. Copy the full key (starts with AIza...)
5. Paste it here
```

Solution:
1. Update the key in `.env` file
2. Restart Claude Code
3. Verify with: `echo $GEMINI_API_KEY`

### "Quota exceeded"

```
You've hit the API rate limit. This usually resets within a minute.

Options:
1. Wait 60 seconds and try again
2. Use the skip path and generate manually
3. Check your quota at console.cloud.google.com
```

### "Permission denied"

```
Your API key may have restrictions that block image generation.

To fix:
1. Go to console.cloud.google.com
2. Navigate to APIs & Services > Credentials
3. Click on your API key
4. Under "API restrictions", select "Don't restrict key" or add
   "Generative Language API"
5. Save and try again
```

---

## Security Notes

Remind users:
- The API key is stored in `.env` in the project directory
- Don't commit `.env` to version control
- The skill automatically adds `.env` to `.gitignore`
- Don't share your API key publicly
- You can regenerate keys anytime in Google Cloud Console

```bash
# Ensure .env is in .gitignore
echo ".env" >> .gitignore 2>/dev/null || true
```
