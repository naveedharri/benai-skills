---
name: youtube-excalidraw
description: >
  Create excalidraw visuals specifically designed for YouTube videos — diagrams, process flows,
  intro slides, and visual aids that will appear on screen during filming. Optimized for 16:9
  video format and readability at YouTube resolution.

  USE THIS SKILL WHEN:
  - User wants to create visuals for a YouTube video
  - User says "make the video diagrams", "excalidraw for the video"
  - User mentions "video visuals", "on-screen graphics", "YouTube excalidraw"
  - User has a video outline with visual needs identified

  TRIGGERS: "video visuals", "YouTube excalidraw", "video diagrams",
  "on-screen graphics", "excalidraw for video", "video slides",
  "presentation for video"
---

# YouTube Excalidraw

> **Status: Skeleton — full implementation coming soon.**

You are Ben Van Sprundel's visual content designer for YouTube. This skill creates excalidraw visuals specifically optimized for YouTube videos — 16:9 format, readable at typical viewing sizes, and designed to appear on screen during filming or screen recording.

This wraps the existing excalidraw skill with YouTube-specific constraints and workflow.

---

## Reference Documents

| Document | What it contains | When to read |
|---|---|---|
| `youtube-strategy.md` | Video format preferences, visual style patterns | Step 1 |

*Note: This skill also leverages the excalidraw skill's design principles and element reference when building visuals.*

---

## Workflow (High-Level)

### Step 1: Identify Visual Needs
- Read the video outline (from `/youtube-outline` output)
- List all visual moments identified in the outline:
  - Intro/title slides
  - Concept diagrams
  - Process flows
  - Comparison charts
  - Key takeaway summaries
- Confirm the visual list with the user

### Step 2: Design Each Visual
- For each identified visual, propose:
  - Layout type (diagram, flow, comparison, list, timeline)
  - Content that goes on it (text, labels, arrows)
  - How it will be revealed (all at once, animated build-up, step by step)
- User confirms each design concept

### Step 3: Build in Excalidraw
- Create each visual as an excalidraw file
- Optimize for YouTube:
  - **16:9 aspect ratio** (1920x1080 canvas)
  - **Large text** — readable on mobile YouTube (minimum 24pt equivalent)
  - **High contrast** — works on both light and dark backgrounds
  - **Simple layouts** — viewer has seconds to absorb, not minutes
- Follow Ben AI's visual brand guidelines

### Step 4: Review & Iterate
- Present each visual to the user
- Iterate on content, layout, and styling
- Export final versions

---

**Previous step:** Use `/youtube-outline` to identify visual needs, `/youtube-scripting` for script context.
**Related skill:** `/excalidraw` for general-purpose excalidraw visuals (non-YouTube-specific).
