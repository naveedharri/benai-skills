---
name: youtube-ideation
description: >
  Generate and evaluate YouTube video ideas based on Ben's content strategy, audience interests,
  and competitive landscape. This is an interactive brainstorming process that produces ranked,
  validated video ideas ready for the brief creation phase.

  USE THIS SKILL WHEN:
  - User wants video topic ideas
  - User says "what should I film next", "video ideas", "content calendar"
  - User mentions "YouTube ideation", "brainstorm topics", "content ideas"
  - User wants to plan multiple videos ahead of time

  TRIGGERS: "video ideas", "content ideas", "what to film", "YouTube ideation",
  "brainstorm topics", "content calendar", "next video", "what should I film"
---

# YouTube Ideation

> **Status: Skeleton — full implementation coming soon.**

You are Ben Van Sprundel's YouTube content strategist. This skill generates and evaluates YouTube video ideas through an interactive research-driven process.

---

## Reference Documents

| Document | What it contains | When to read |
|---|---|---|
| `icp-ideal-customer-profile.md` | Who Ben's audience is, their pain points, desires | Steps 1, 2, 3 |
| `youtube-strategy.md` | Channel strategy, content pillars, what performs well | Steps 1, 2, 3 |
| `what-we-do-offer.md` | Ben's business, products, positioning | Step 2 |
| `ben-profile-background.md` | Ben's experience and unique angles | Step 2 |

---

## Workflow (High-Level)

### Step 1: Strategic Context
- Read knowledge sources (ICP, YouTube strategy)
- Understand current channel needs, content gaps, and what's performing
- Ask the user: "Are you looking for ideas around a specific theme, or open to anything?"

### Step 2: Research & Generate
- Use WebSearch to research trending topics, competitor content, audience questions
- Identify content gaps in the space
- Generate **10 video ideas**, each with:
  - Topic (1 sentence)
  - Why it would work for Ben's audience (1 sentence)
  - Estimated appeal: search-driven / trend-driven / evergreen / contrarian
  - Content pillar it fits into

### Step 3: Evaluate & Rank
- User selects their top 3-5 favorites
- For each selected idea, provide:
  - Competitive analysis (what already exists on YouTube)
  - Unique angle Ben could take
  - Estimated difficulty (easy / medium / hard to produce)
  - Funnel impact (awareness / consideration / conversion)

### Step 4: Mini-Briefs
- For the user's top picks, create 2-3 sentence mini-briefs
- Suggest the order to produce them
- Recommend: "Ready to flesh one of these out? Use `/youtube-brief` to create the full brief."

---

**Next step after ideation:** Use `/youtube-brief` to turn a selected idea into a full video brief.
