# Nano Banana MCP Server - API Reference

> Loaded during Phase 5 (API Key Setup) and Phase 6 (Generation).
> This file covers image generation tools, API key configuration, file handling, and error recovery.

## 1. Overview

Image generation and editing is handled through the Nano Banana MCP server (`@zhibinyang/nano-banana-mcp`),
which exposes 6 tools for creating and modifying images via Google's Gemini image models. The server is
auto-configured through the plugin system and requires a Gemini API key to function.

### Underlying Models

| Model | ID | Notes |
|-------|----|-------|
| Gemini 2.5 Flash Image | `gemini-2.5-flash-image` | Default model. Fast generation, good for drafts and iteration. |
| Gemini 3 Pro Image | `gemini-3-pro-image-preview` | Highest quality output. Supports up to 4K resolution. Use for final renders. |

The model is selected via the `GEMINI_IMAGE_MODEL` environment variable in `.env`.
If not set, the server defaults to `gemini-2.5-flash-image`.

Set `GEMINI_IMAGE_MODEL=gemini-3-pro-image-preview` in `.env` for production-quality infographics.

---

## 2. Available MCP Tools

### generate_image

Creates a brand-new image from a text prompt. This is the primary tool for first-pass infographic creation.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | string | Yes | Text description of the image to create |
| `aspectRatio` | string | No | One of: `"1:1"`, `"2:3"`, `"3:2"`, `"3:4"`, `"4:3"`, `"4:5"`, `"5:4"`, `"9:16"`, `"16:9"`, `"21:9"` |
| `imageSize` | string | No | One of: `"1K"`, `"2K"`, `"4K"` (4K only works with `gemini-3-pro-image-preview`) |

**Returns:** Image preview displayed inline + file path in `./generated_imgs/`

**TIP - Double-specify aspect ratio for best results:**
Pass `aspectRatio` as a parameter AND embed the specs directly in the prompt text:
- Parameter: `"aspectRatio": "4:5"`
- Prompt suffix: `"...Output as a 4:5 portrait aspect ratio image at approximately 2048 pixels wide"`

This redundancy helps the model produce correctly sized output more reliably.

---

### edit_image

Modifies an existing image based on text instructions. Use this for the first edit pass on any image.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `imagePath` | string | Yes | Full file path to the image to edit |
| `prompt` | string | Yes | Text describing the modifications to make |
| `referenceImages` | string[] | No | Array of file paths to additional reference images (for style transfer, adding elements, etc.) |
| `aspectRatio` | string | No | Aspect ratio for the output |
| `imageSize` | string | No | Resolution for the output |

**Returns:** Edited image preview + file path in `./generated_imgs/`

---

### continue_editing

Further edits to the most recently processed image. No file path is needed because the server
tracks the last image automatically.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | string | Yes | Text describing the changes to make |
| `referenceImages` | string[] | No | Array of file paths to additional reference images |
| `aspectRatio` | string | No | Aspect ratio for the output |
| `imageSize` | string | No | Resolution for the output |

**Returns:** Updated image preview + file path

**When to use:** After an initial `edit_image` call, use `continue_editing` for ALL subsequent
iterations on that same image. Do not call `edit_image` again unless switching to a different base image.

---

### get_last_image_info

Retrieves metadata about the most recently created or edited image in the current session.

**Parameters:** None

**Returns:** File path, file size, and modification time of the last image.

---

### configure_gemini_token

**DO NOT USE THIS TOOL.** It creates an unwanted `.nano-banana-config.json` file in the project
directory. The infographic skill manages all API keys through a single `.env` file instead.
If you need to set the API key, write it to `.env` and instruct the user to restart Claude Code.

---

### get_configuration_status

**DO NOT USE THIS TOOL.** It is known to give false positives. It can report the API key as
"configured" even when the key is invalid or expired. Always check the environment variable
directly using `echo $GEMINI_API_KEY` or by reading the `.env` file.

---

## 3. API Key Setup

### How It Works

The Nano Banana MCP server has `dotenv` as a dependency. At startup, it automatically loads
the `.env` file from the project directory (the working directory where Claude Code was launched).

**Setup flow:**

1. User provides their Gemini API key
2. Skill saves it to `.env` in the project root
3. User restarts Claude Code (which restarts the MCP server)
4. MCP server's dotenv loads `.env` automatically and reads `GEMINI_API_KEY`
5. Image generation works

### How to Check for the Key

```bash
# Check environment variable first, then .env file
if [ -n "$GEMINI_API_KEY" ]; then
  echo "API key found in environment"
elif [ -f .env ] && grep -q "^GEMINI_API_KEY=.\+" .env; then
  echo "API key found in .env file"
else
  echo "API key not configured"
fi
```

**If found** in env var OR .env: proceed to generation. The MCP server already has it via dotenv.

**If NOT found** in either location: ask the user for their key and follow one of the three paths below.

### Three Paths

**Path 1: Set it up now (Guided)**

Provide these instructions to the user:

1. Go to Google AI Studio: https://aistudio.google.com
2. Sign in with your Google account
3. Click "Get API Key" in the left sidebar
4. Click "Create API Key" and select or create a Google Cloud project
5. Copy the generated key (it starts with "AIza...")
6. Paste it back into the chat

**Path 2: User has key ready**

Simply say: "Paste your Gemini API key below."

**Path 3: Skip for now**

Complete all planning phases (research, brand analysis, content structure, design spec).
When reaching the generation phase, save the full prompt to `.infographic/prompts/[topic]-prompt.md`
instead of calling generate_image. Include instructions for the user to manually paste the prompt
into Google AI Studio (https://aistudio.google.com) to generate the image themselves.

### Saving the Key

```bash
# Create .env if it doesn't exist
if [ ! -f .env ]; then
  cat > .env <<'EOF'
# BenAI Skills - API Keys Configuration
GEMINI_API_KEY=
GEMINI_IMAGE_MODEL=gemini-3-pro-image-preview
APIFY_TOKEN=
EOF
fi

# Update the key value
sed -i '' "s|^GEMINI_API_KEY=.*|GEMINI_API_KEY=[user-provided-key]|" .env

# Add .env to .gitignore if not already there
grep -qxF '.env' .gitignore 2>/dev/null || echo ".env" >> .gitignore
```

**CRITICAL after saving:** Tell the user they must restart Claude Code, then EXIT THE SKILL.
The MCP server needs to restart in order to load the updated `.env` file.

- Do NOT call `configure_gemini_token`
- Do NOT call `get_configuration_status`
- Do NOT proceed to the generation phase

The user will re-invoke the skill after restarting, and the key will be available.

---

## 4. File Handling

### MCP Output Location

The Nano Banana MCP server saves all images to `./generated_imgs/` in the project root,
using timestamped filenames:

- Generated images: `generated-[timestamp]-[id].png`
- Edited images: `edited-[timestamp]-[id].png`

### Copy to Project Directory

After every generation or edit, copy the output into the skill's project directory:

```bash
mkdir -p .infographic/images
cp "./generated_imgs/[returned-filename]" ".infographic/images/[topic-slug]-v[N].png"
```

### File Naming Convention

| Stage | Pattern | Example |
|-------|---------|---------|
| First version | `[topic]-v1.png` | `success-iceberg-v1.png` |
| After edits | `[topic]-v2.png` | `success-iceberg-v2.png` |
| Final approved | `[topic]-final.png` | `success-iceberg-final.png` |
| Series member | `[topic]-01-v1.png` | `tips-01-v1.png` |
| Saved prompts | `[topic]-prompt.md` | `.infographic/prompts/tips-prompt.md` |

### CRITICAL: Always Display to User

After saving an image to `.infographic/images/`, IMMEDIATELY use the Read tool to display it:

```
Read file: .infographic/images/topic-v1.png
```

The user MUST see the image in order to give feedback. Never skip this step. If the Read tool
fails to display the image, provide the full file path so the user can open it manually.

---

## 5. Embedding Specs in Prompts

### Aspect Ratio by Platform

| Platform | aspectRatio param | Embed in prompt |
|----------|-------------------|-----------------|
| LinkedIn | `"4:5"` | "Output as a 4:5 portrait aspect ratio image at approximately 2048 pixels wide" |
| Instagram (square) | `"1:1"` | "Output as a 1:1 square aspect ratio image at approximately 2048 pixels wide" |
| Twitter / Presentation | `"16:9"` | "Output as a 16:9 landscape aspect ratio image at approximately 2048 pixels wide" |

### Resolution

| Quality | Prompt suffix to append |
|---------|------------------------|
| Standard (1K) | "at approximately 1024 pixels wide" |
| 2K (Recommended) | "at approximately 2048 pixels wide" |
| 4K (Pro model only) | "at approximately 4096 pixels wide" |

Always include both the `aspectRatio` parameter and the prompt suffix for reliable sizing.

---

## 6. Edit vs. Regenerate Decision

| Situation | Action |
|-----------|--------|
| Color adjustments | `edit_image` / `continue_editing` |
| Text changes (typos, rewording) | `edit_image` / `continue_editing` |
| Layout tweaks (spacing, alignment) | `edit_image` / `continue_editing` |
| Different metaphor or visual concept | Regenerate with `generate_image` |
| Major concept change | Regenerate with `generate_image` |
| More than 50% of the image needs change | Regenerate with `generate_image` |

**Rule:** Use `edit_image` for the first edit on an image. Use `continue_editing` for all
subsequent edits in the same session. Only call `edit_image` again if you need to switch
to a completely different base image.

---

## 7. Error Handling

### MCP Tool Not Available

If the Nano Banana MCP tools are not showing up (server not running or not configured):

- Fall back to the "Skip for now" path (Path 3 from Section 3)
- Save the complete prompt to `.infographic/prompts/[topic]-prompt.md`
- Direct the user to paste the prompt into Google AI Studio manually
- Do not attempt to install or configure the MCP server mid-skill

### API Key Not Configured

If the environment check shows no key in either `$GEMINI_API_KEY` or `.env`:

- Run Phase 5 (API Key Setup) to collect the key from the user
- Save it to `.env` using the script in Section 3
- Tell the user to restart Claude Code and exit the skill

### Generation Fails

If `generate_image` or `edit_image` returns an error:

- **Invalid API key:** Run `echo $GEMINI_API_KEY` to verify the value. If empty or wrong, reconfigure using the steps in Section 3.
- **Safety flag / content policy:** Rephrase the prompt to avoid potentially sensitive terms. Remove any references to real people, brands, or controversial topics.
- **Timeout or unknown error:** Simplify the prompt (shorter text, fewer details) and try again. If it fails twice, fall back to the skip path.

### Rate Limit (429)

If you receive a 429 rate limit error:

- Wait 60 seconds before retrying
- If it persists, save the prompt to `.infographic/prompts/` and direct the user to generate manually via Google AI Studio

---

## 8. Security Notes

- The API key is stored in `.env` in the project directory. It is never sent anywhere except to the Gemini API.
- Never commit `.env` to version control. The skill automatically adds `.env` to `.gitignore`.
- Do not share the API key in chat logs, prompts, or public repositories.
- Do not embed the API key directly in scripts or code files.
- Users can regenerate their API key anytime at https://console.cloud.google.com or https://aistudio.google.com.
