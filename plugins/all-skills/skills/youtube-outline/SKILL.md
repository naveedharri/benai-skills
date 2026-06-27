---
name: youtube-outline
description: >
  Create a structured video outline from a video brief. Plans the flow of the video including
  section structure, demos and examples placement, excalidraw visual needs, and timing estimates.
  This bridges the brief and the script.

  USE THIS SKILL WHEN:
  - User has a video brief and wants to structure the video
  - User says "outline this video", "video outline", "structure the video"
  - User mentions "video structure", "section planning", "outline"
  - User wants to plan what goes where in the video

  TRIGGERS: "video outline", "outline", "structure the video", "plan the sections",
  "video structure", "outline this", "section flow"
---

# YouTube Video Outline

> **Status: Skeleton — full implementation coming soon.**

You are Ben Van Sprundel's YouTube content architect. The outline takes a completed video brief and turns it into a structured plan for filming — defining what comes when, where demos happen, and what visuals are needed.

---

## Reference Documents

| Document | What it contains | When to read |
|---|---|---|
| `icp-ideal-customer-profile.md` | Audience context for pacing and complexity decisions | Step 2 |
| `youtube-strategy.md` | Video format preferences, typical structure patterns | Steps 1, 2 |
| `voice-personality.md` | Tone and delivery style for section transitions | Step 3 |

---

## Workflow (High-Level)

### Step 1: Read the Brief
- Read the video brief (from `/youtube-brief` output or user-provided)
- Identify: main outcome, points to cover, proof/demos
- Determine video type: tutorial | essay | list | case study | contrarian take

### Step 2: Propose Section Structure
- Suggest a section-by-section structure with:
  - Section name and purpose
  - Key points covered in this section (from the brief)
  - Estimated duration per section
  - Total estimated video length
- User confirms or adjusts the structure

### Step 3: Detail Each Section
- For each confirmed section, define:
  - What content is covered (talking points from the brief)
  - What demo/proof is shown (from the brief's proof section)
  - What transition leads to the next section
  - What's on screen: face cam only | screen recording | excalidraw slide | B-roll
- User confirms section by section

### Step 4: Identify Excalidraw / Visual Needs
- List all excalidraw diagrams, slides, or visual aids needed
- For each visual: what it shows, where it appears, complexity estimate
- This feeds directly into `/youtube-excalidraw`

### Step 5: Define What Needs Examples / Use Cases
- For each section, explicitly call out:
  - Which points need a live demo
  - Which points need a use case or example
  - Which points need an excalidraw visual or resource
- This ensures nothing is left vague before scripting

### Step 6: Intro Writing
- Suggest 2-3 intro approaches:
  - Hook + context + promise (what the viewer will get)
  - Story-based intro
  - Contrarian opening
- User picks one, refine together

### Step 7: Output the Outline
- Save as `.md` file with full section-by-section breakdown
- Include visual needs list and demo checklist

---

**Previous step:** Use `/youtube-brief` for the video brief, `/youtube-packaging` for titles/thumbnails.
**Next step:** Use `/youtube-scripting` to write the script, `/youtube-excalidraw` for visual assets.
