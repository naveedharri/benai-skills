# Gemini Image Generation API Reference

Technical reference for generating and editing infographic images using the Gemini API.

---

## Environment Setup

### Option 1: Export in Shell

```bash
export GEMINI_API_KEY=your-api-key-here
```

### Option 2: Use .env File (Recommended for Persistence)

```bash
echo "GEMINI_API_KEY=your-api-key-here" > .env
source .env
```

The `.env` file persists across sessions and is automatically loaded in Phase 0.

### Verify Setup

```bash
echo "${GEMINI_API_KEY:+API key is set}"
```

### No API Key? See Fallback Options

If no API key is available, see the "No API Key Fallback" section below for alternative workflows.

---

## Model Selection

| Model | Best For | Notes |
|-------|----------|-------|
| `gemini-3-pro-image-preview` | Image generation (RECOMMENDED) | Latest model, best quality |

**Default:** Always use `gemini-3-pro-image-preview` for image generation.

---

## Text-to-Image Generation

### Request JSON Structure (IMPORTANT)

The Gemini API requires a specific JSON structure with `imageConfig` for controlling output:

```json
{
  "contents": [
    {
      "role": "user",
      "parts": [
        {
          "text": "YOUR PROMPT HERE"
        }
      ]
    }
  ],
  "generationConfig": {
    "responseModalities": ["IMAGE", "TEXT"],
    "imageConfig": {
      "aspectRatio": "4:5",
      "imageSize": "2K",
      "personGeneration": ""
    }
  },
  "tools": [
    {
      "googleSearch": {}
    }
  ]
}
```

### Image Config Options

| Field | Values | Description |
|-------|--------|-------------|
| `aspectRatio` | `"1:1"`, `"4:5"`, `"16:9"`, `"9:16"` | Output aspect ratio |
| `imageSize` | `"1K"`, `"2K"`, `"4K"` | Resolution/quality level |
| `personGeneration` | `""` or `"ALLOW_ADULT"` | Person generation settings |

### Using curl with request.json (Recommended Method)

```bash
#!/bin/bash
set -e -E

GEMINI_API_KEY="${GEMINI_API_KEY}"
MODEL_ID="gemini-3-pro-image-preview"
GENERATE_CONTENT_API="streamGenerateContent"

# Create request JSON with proper imageConfig
cat > request.json << 'EOF'
{
  "contents": [
    {
      "role": "user",
      "parts": [
        {
          "text": "Generate a professional infographic about the 5 stages of product development. Use a clean timeline layout with numbered circles connected by a blue line. Each stage has a short title and one-line description. White background, blue (#2563EB) and amber (#F59E0B) accent colors. Professional flat design style."
        }
      ]
    }
  ],
  "generationConfig": {
    "responseModalities": ["IMAGE", "TEXT"],
    "imageConfig": {
      "aspectRatio": "4:5",
      "imageSize": "2K",
      "personGeneration": ""
    }
  },
  "tools": [
    {
      "googleSearch": {}
    }
  ]
}
EOF

# Make API call and save response
curl -s -X POST \
  -H "Content-Type: application/json" \
  "https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:${GENERATE_CONTENT_API}?key=${GEMINI_API_KEY}" \
  -d @request.json > response.json

# Extract and save image
jq -r '.[] | .candidates[]?.content.parts[]? | select(.inlineData) | .inlineData.data' response.json | head -1 | base64 -d > .infographic/images/output-v1.png

# Verify
ls -la .infographic/images/output-v1.png
```

### Complete Generation Function

```bash
generate_infographic() {
  local prompt="$1"
  local output_file="$2"
  local aspect_ratio="${3:-4:5}"
  local image_size="${4:-2K}"

  local MODEL_ID="gemini-3-pro-image-preview"
  local GENERATE_CONTENT_API="streamGenerateContent"

  # Ensure output directory exists
  mkdir -p "$(dirname "$output_file")"

  # Create request JSON with imageConfig
  cat > /tmp/request.json << EOF
{
  "contents": [
    {
      "role": "user",
      "parts": [
        {
          "text": "${prompt}"
        }
      ]
    }
  ],
  "generationConfig": {
    "responseModalities": ["IMAGE", "TEXT"],
    "imageConfig": {
      "aspectRatio": "${aspect_ratio}",
      "imageSize": "${image_size}",
      "personGeneration": ""
    }
  },
  "tools": [
    {
      "googleSearch": {}
    }
  ]
}
EOF

  # Make the API call
  local response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    "https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:${GENERATE_CONTENT_API}?key=${GEMINI_API_KEY}" \
    -d @/tmp/request.json)

  # Check for errors
  if echo "$response" | jq -e '.error' > /dev/null 2>&1; then
    echo "Error: $(echo "$response" | jq -r '.error.message')"
    return 1
  fi

  # Extract and save image
  local image_data=$(echo "$response" | jq -r '.[] | .candidates[]?.content.parts[]? | select(.inlineData) | .inlineData.data' | head -1)

  if [ -z "$image_data" ] || [ "$image_data" = "null" ]; then
    echo "Error: No image data in response"
    echo "Response: $response" | head -c 500
    return 1
  fi

  echo "$image_data" | base64 -d > "$output_file"

  if [ -s "$output_file" ]; then
    echo "Success: Image saved to $output_file"
    echo "File size: $(ls -lh "$output_file" | awk '{print $5}')"
    return 0
  else
    echo "Error: Failed to save image"
    return 1
  fi
}

# Usage with imageConfig options
generate_infographic "Your prompt here" ".infographic/images/output-v1.png" "4:5" "2K"
```

---

## Image Editing (Multi-Turn)

Send the existing image back with edit instructions:

```bash
edit_infographic() {
  local input_image="$1"
  local edit_prompt="$2"
  local output_file="$3"
  local aspect_ratio="${4:-4:5}"
  local image_size="${5:-2K}"

  local MODEL_ID="gemini-3-pro-image-preview"
  local GENERATE_CONTENT_API="streamGenerateContent"

  # Encode the image
  local image_base64=$(base64 -i "$input_image" | tr -d '\n')

  # Build request with image + edit prompt + imageConfig
  cat > /tmp/edit_request.json << EOF
{
  "contents": [
    {
      "role": "user",
      "parts": [
        {
          "inlineData": {
            "mimeType": "image/png",
            "data": "${image_base64}"
          }
        },
        {
          "text": "${edit_prompt}"
        }
      ]
    }
  ],
  "generationConfig": {
    "responseModalities": ["IMAGE", "TEXT"],
    "imageConfig": {
      "aspectRatio": "${aspect_ratio}",
      "imageSize": "${image_size}",
      "personGeneration": ""
    }
  },
  "tools": [
    {
      "googleSearch": {}
    }
  ]
}
EOF

  # Make API call
  local response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    "https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:${GENERATE_CONTENT_API}?key=${GEMINI_API_KEY}" \
    -d @/tmp/edit_request.json)

  # Extract and save edited image
  local image_data=$(echo "$response" | jq -r '.[] | .candidates[]?.content.parts[]? | select(.inlineData) | .inlineData.data' | head -1)

  if [ -n "$image_data" ] && [ "$image_data" != "null" ]; then
    echo "$image_data" | base64 -d > "$output_file"
    echo "Edited image saved to $output_file"
    return 0
  else
    echo "Error: No image in edit response"
    return 1
  fi
}

# Usage
edit_infographic ".infographic/images/topic-v1.png" "Make the colors warmer and increase the title size" ".infographic/images/topic-v2.png" "4:5" "2K"
```

---

## Directory Structure

All infographic files are stored in a dedicated `.infographic/` directory:

```
.infographic/
├── brand.md           # Brand config (Markdown, human-readable)
├── images/            # All generated infographics
│   ├── topic-v1.png
│   ├── topic-v2.png
│   └── topic-final.png
└── prompts/           # Saved prompts for reuse
    └── topic-prompt.md
```

### Setup Directory

```bash
# Create directory structure on first run
mkdir -p .infographic/images
mkdir -p .infographic/prompts
```

---

## Saving and Displaying Images

### CRITICAL: Always Save to .infographic/images/

Images MUST be saved to the `.infographic/images/` directory with descriptive names:

```bash
# Single infographic (versions during editing)
.infographic/images/[topic-slug]-v1.png
.infographic/images/[topic-slug]-v2.png
.infographic/images/[topic-slug]-final.png

# Series
.infographic/images/[topic-slug]-01-v1.png
.infographic/images/[topic-slug]-02-v1.png
```

### CRITICAL: Always Display to User

After saving, **immediately use the Read tool** to show the image:

```
After saving the image, USE THE READ TOOL to display it:

Read the file: .infographic/images/topic-v1.png

This allows the user to SEE the image and provide feedback for edits.
```

### Complete Save & Display Workflow

```bash
# 0. Ensure directory exists
mkdir -p .infographic/images

# 1. Generate the image
generate_infographic "$PROMPT" ".infographic/images/myproject-v1.png"

# 2. Verify it exists
if [ -f ".infographic/images/myproject-v1.png" ]; then
  echo "Image saved successfully"
  ls -la .infographic/images/myproject-v1.png
else
  echo "Error: Image not saved"
  exit 1
fi

# 3. THEN use Read tool to display (Claude will do this)
# Read the file: .infographic/images/myproject-v1.png
```

---

## Resolution Options (imageConfig)

Resolution is controlled via the `imageConfig.imageSize` field in the request JSON:

| imageSize Value | Approximate Width | Best For |
|-----------------|-------------------|----------|
| `"1K"` | ~1024px | Quick social posts, mobile-first |
| `"2K"` | ~2048px | Professional social, presentations (RECOMMENDED) |
| `"4K"` | ~4096px | Print, large displays |

**Example imageConfig:**
```json
"imageConfig": {
  "aspectRatio": "4:5",
  "imageSize": "2K",
  "personGeneration": ""
}
```

**Note:** Aspect ratio is also set in `imageConfig`, not in the prompt text.

---

## Aspect Ratios (imageConfig)

Aspect ratio is set via `imageConfig.aspectRatio` in the request JSON:

| Platform | aspectRatio Value | Description |
|----------|-------------------|-------------|
| LinkedIn | `"4:5"` | Portrait, best engagement |
| Square | `"1:1"` | Universal square |
| Twitter/Presentation | `"16:9"` | Landscape widescreen |
| Stories | `"9:16"` | Vertical/mobile |

**Example configurations by platform:**

```json
// LinkedIn (4:5 portrait, 2K quality)
"imageConfig": {
  "aspectRatio": "4:5",
  "imageSize": "2K",
  "personGeneration": ""
}

// Twitter (16:9 landscape, 2K quality)
"imageConfig": {
  "aspectRatio": "16:9",
  "imageSize": "2K",
  "personGeneration": ""
}

// Instagram Square (1:1, 2K quality)
"imageConfig": {
  "aspectRatio": "1:1",
  "imageSize": "2K",
  "personGeneration": ""
}
```

---

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| No image in response | Model returned text only | Add "Generate an image:" prefix to prompt |
| `SAFETY` block | Content flagged | Rephrase prompt, avoid sensitive terms |
| 429 Rate Limited | Too many requests | Wait 60 seconds, retry |
| 401/403 Auth Error | Invalid API key | Check key, verify permissions |

### Check for Errors in Response

```bash
# Check if response contains an error
if echo "$response" | jq -e '.error' > /dev/null 2>&1; then
  echo "API Error: $(echo "$response" | jq -r '.error.message')"
  exit 1
fi

# Check if response contains image data
if ! echo "$response" | jq -e '.[] | .candidates[]?.content.parts[]? | select(.inlineData)' > /dev/null 2>&1; then
  echo "No image in response. Model may have returned text only."
  echo "Text response: $(echo "$response" | jq -r '.[] | .candidates[]?.content.parts[]? | select(.text) | .text' | head -c 200)"
  exit 1
fi
```

---

## No API Key Fallback

When no API key is available, save the prompt for manual use:

```bash
# Ensure directory exists
mkdir -p .infographic/prompts

# Save prompt to Markdown file
cat > .infographic/prompts/[topic-slug]-prompt.md << 'EOF'
# Infographic Prompt: [Topic Name]

## Specifications
- Platform: LinkedIn
- Aspect Ratio: 4:5
- Resolution: 2K (2048px)
- Style: Professional Blue

## Prompt
```
[Complete detailed prompt here]
```

## Usage Instructions
1. Go to https://aistudio.google.com
2. Sign in with Google
3. Select "Gemini 3 Pro" model
4. Paste the prompt above
5. Click Generate
6. Download to .infographic/images/

---
*Generated: [timestamp]*
EOF

echo "Prompt saved to .infographic/prompts/"
```

**Instructions for user:**
```
Your infographic prompt is ready in .infographic/prompts/[topic]-prompt.md

To generate:
1. Go to https://aistudio.google.com
2. Sign in with Google
3. Select "Gemini 3 Pro" model
4. Paste the prompt from the file
5. Click Generate
6. Download the image to .infographic/images/
```

---

## Quick Reference

### Generate Image (with imageConfig)
```bash
mkdir -p .infographic/images

cat > /tmp/request.json << 'EOF'
{
  "contents": [{"role": "user", "parts": [{"text": "YOUR PROMPT HERE"}]}],
  "generationConfig": {
    "responseModalities": ["IMAGE", "TEXT"],
    "imageConfig": {"aspectRatio": "4:5", "imageSize": "2K", "personGeneration": ""}
  },
  "tools": [{"googleSearch": {}}]
}
EOF

curl -s -X POST \
  -H "Content-Type: application/json" \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:streamGenerateContent?key=${GEMINI_API_KEY}" \
  -d @/tmp/request.json | \
  jq -r '.[] | .candidates[]?.content.parts[]? | select(.inlineData) | .inlineData.data' | head -1 | base64 -d > .infographic/images/output-v1.png
```

### Verify API Key
```bash
curl -s "https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}" | head -c 200
```

### imageConfig Options
| Field | Values |
|-------|--------|
| `aspectRatio` | `"1:1"`, `"4:5"`, `"16:9"`, `"9:16"` |
| `imageSize` | `"1K"`, `"2K"`, `"4K"` |
| `personGeneration` | `""` (default) or `"ALLOW_ADULT"` |

### Directory Structure
```
.infographic/
├── brand.md              # Brand config (Markdown)
├── images/               # All generated infographics
│   └── [topic]-v1.png
└── prompts/              # Saved prompts
    └── [topic]-prompt.md
```

### File Naming
| Type | Pattern | Location |
|------|---------|----------|
| First version | `[topic]-v1.png` | `.infographic/images/` |
| Edits | `[topic]-v2.png` | `.infographic/images/` |
| Final | `[topic]-final.png` | `.infographic/images/` |
| Series | `[topic]-01-v1.png` | `.infographic/images/` |
| Prompts | `[topic]-prompt.md` | `.infographic/prompts/` |

### Resolution Quick Reference (imageSize)
| imageSize | Approx Width | Best For |
|-----------|--------------|----------|
| `"1K"` | ~1024px | Quick social, mobile |
| `"2K"` | ~2048px | Professional (recommended) |
| `"4K"` | ~4096px | Print, large displays |
