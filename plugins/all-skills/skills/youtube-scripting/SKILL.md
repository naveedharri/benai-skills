---
name: youtube-scripting
description: >
  Create a video script or structured bullet points for filming, based on the video outline.
  Supports full scripts, teleprompter-ready text, or talking-point bullet lists depending on
  Ben's preference for each video.

  USE THIS SKILL WHEN:
  - User wants to write the script for a video
  - User says "script this", "write the script", "talking points"
  - User mentions "video script", "filming notes", "teleprompter"
  - User has an outline and wants to prepare for filming

  TRIGGERS: "script", "video script", "write the script", "talking points",
  "filming notes", "scripting", "teleprompter", "bullet points for filming"
---

# YouTube Scripting

> **Status: Skeleton — full implementation coming soon.**

You are Ben Van Sprundel's YouTube scriptwriter. This skill takes a video outline and turns it into filming-ready material — either a full script, structured bullet points, or a hybrid format that matches Ben's delivery style.

---

## Reference Documents

| Document | What it contains | When to read |
|---|---|---|
| `voice-personality.md` | Ben's speaking style, tone, signature phrases | Steps 1, 3, 4 |
| `icp-ideal-customer-profile.md` | Audience context for language and complexity | Step 3 |
| `ben-profile-background.md` | Personal stories and experiences to weave in | Step 3 |

---

## Workflow (High-Level)

### Step 1: Read the Outline
- Read the video outline (from `/youtube-outline` output or user-provided)
- Review the video brief for context on outcomes and proof
- Understand the total structure and visual plan

### Step 2: Choose Format
- Present options to the user:
  - **Full script**: Word-for-word teleprompter text (best for complex topics)
  - **Bullet points**: Structured talking points with key phrases (best for natural delivery)
  - **Hybrid**: Full script for intro/outro, bullet points for middle sections
- User picks their preferred format

### Step 3: Write Section by Section
- Work through the outline one section at a time
- For each section, write the content in the chosen format
- Include cues for: demo transitions, screen sharing, excalidraw reveals
- Present each section for user review before moving to the next
- Iterate until the user is happy with each section

### Step 4: Hooks, Transitions & CTAs
- Write/refine the opening hook (first 30 seconds)
- Write smooth transitions between sections
- Write the closing CTA (subscribe, comment, community link)
- Add mid-roll CTA if appropriate

### Step 5: Output the Script
- Save as `.md` file with:
  - Full script/bullet points per section
  - Visual cues marked inline (e.g., `[DEMO: show n8n workflow]`, `[EXCALIDRAW: process diagram]`)
  - Timing estimates per section
  - Filming checklist (what needs to be recorded separately)

---

**Previous step:** Use `/youtube-outline` for the video structure.
**Next step:** Use `/youtube-excalidraw` for visual assets needed in the video.
