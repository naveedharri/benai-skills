# API Key Setup Guide

Step-by-step instructions for setting up the Gemini API key, with fallback options for users who want to skip.

---

## Three Paths for API Key Handling

When the API key is not set, offer three options:

1. **Set it up now** — Guide through Google AI Studio
2. **User has key ready** — Just paste/export it
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

1. **Save to .env file:**
   ```bash
   echo "GEMINI_API_KEY=USER_PROVIDED_KEY" > .env
   ```

2. **Source the file:**
   ```bash
   source .env
   ```

3. **Verify the key works:**
   ```bash
   curl -s "https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}" | head -c 200
   ```

4. **Check response:**
   - If you see `"models"` in the response → Key is valid
   - If you see `"error"` → Key is invalid or expired

5. **Confirm to user:**
   ```
   API key verified and saved to .env

   Your key is now stored locally and will be loaded automatically
   in future sessions. Ready to generate!
   ```

---

## Path 2: User Has Key Ready

If user selects "I have a key ready":

```
Great! You can either:

A) Paste your API key here and I'll save it for you

B) If you've already exported it in your shell:
   export GEMINI_API_KEY=your-key-here

   Just confirm and I'll verify it works.
```

If user pastes a key:
1. Save to `.env`
2. Verify as above
3. Proceed to generation

If user confirms they exported it:
1. Run verification check
2. If valid, proceed
3. If invalid, ask for the key again

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
- In Phase 6, instead of calling the API:
  1. Show the complete prompt
  2. Save prompt to `infographic-prompt.txt`
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

I've saved this prompt to: infographic-prompt.txt

When you're ready to set up your API key, run /infographic again
and I'll use your saved brand preferences.
```

Save the prompt:
```bash
cat > infographic-prompt.txt <<'EOF'
[The complete prompt]
EOF
```

---

## Verification Commands

### Check if key is set:
```bash
echo "${GEMINI_API_KEY:+API key is configured}"
```

### Test key validity:
```bash
curl -s "https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}" | head -c 200
```

### Quick generation test:
```bash
curl -s -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GEMINI_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Generate a simple blue square"}]}]}' \
  | head -c 500
```

---

## Troubleshooting

### "API key not valid" Error

Possible causes:
- Key was copied incorrectly (missing characters)
- Key was disabled in Google Cloud Console
- Key restrictions block the Gemini API

Solution:
```
That key doesn't seem to work. Let's try again:

1. Go back to aistudio.google.com
2. Check your API keys list
3. Make sure the key is enabled
4. Copy the full key (starts with AIza...)
5. Paste it here
```

### "Quota exceeded" Error

```
You've hit the API rate limit. This usually resets within a minute.

Options:
1. Wait 60 seconds and try again
2. Use the skip path and generate manually
3. Check your quota at console.cloud.google.com
```

### "Permission denied" Error

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

## .env File Format

The `.env` file should contain:

```
GEMINI_API_KEY=AIzaSy...your-key-here
```

Notes:
- No quotes around the value
- No spaces around the `=`
- One variable per line
- File should be in the working directory

---

## Security Notes

Remind users:
- Don't commit `.env` to version control
- Add `.env` to `.gitignore`
- Don't share your API key publicly
- You can regenerate keys anytime in Google Cloud Console

```bash
# Add to .gitignore if it exists
echo ".env" >> .gitignore 2>/dev/null || true
```
