# Phase 2: Curriculum Architecture

## Purpose
Build the structural backbone of the course using backward design.

---

## Methodology: Backward Design + Bloom's Taxonomy

### Backward Design Process
1. Start with the transformation statement (end state)
2. Identify what skills/knowledge are needed to achieve it
3. Group these into milestones (modules)
4. Break milestones into lessons
5. Design assessments that prove mastery
6. Then — and only then — create the content

### Bloom's Taxonomy Integration

Each lesson's learning objective must use an action verb from the appropriate Bloom's level:

| Level | Verbs | Use in Course |
|---|---|---|
| Remember | Define, list, recall, identify | Early lessons, foundational knowledge |
| Understand | Explain, describe, summarize, compare | Concept lessons |
| Apply | Use, implement, build, execute | Hands-on exercises |
| Analyze | Compare, differentiate, examine, debug | Intermediate lessons |
| Evaluate | Assess, critique, judge, choose | Advanced decision-making |
| Create | Design, build, produce, develop | Final projects, capstones |

**Rule:** A well-designed course moves students UP the taxonomy over time. Early modules = Remember/Understand. Later modules = Apply/Analyze/Create.

See `references/blooms-taxonomy.md` for the complete verb reference.

---

## Step 2.1: Milestone Mapping

Identify 3-8 major milestones the student must hit to achieve the transformation. Each milestone becomes a module (or a week in a cohort/challenge).

**Ask:** "What are the major stepping stones between where your student is now and where they need to be?"

**Propose milestones and let user reorder/edit.**

**Example (30-Day Challenge):**
```
Week 1 (Days 1-7): FOUNDATIONS — Understand Claude, set up workspace, build first project
Week 2 (Days 8-14): CORE SKILLS — Master prompting, skills, workflows, project mode
Week 3 (Days 15-21): REAL BUILDS — Create automations, tools, integrations
Week 4 (Days 22-28): ADVANCED + SHIPPING — MCP, plugins, publishing, scaling
Days 29-30: SHOWCASE — Final project presentation + reflection
```

---

## Step 2.2: Lesson Breakdown

For each milestone/module, break into 3-12 lessons. Each lesson should:
- Take no more than 15 minutes of teaching content
- Have ONE clear learning objective
- Include ONE activity or exercise
- Build on the previous lesson

**Format per lesson:**
```
Lesson [X.Y]: [Title]
- Learning Objective: "Students will be able to [Bloom's verb] + [skill/knowledge]"
- Content Type: [Video / Text / Live session / Screencast]
- Duration: [X minutes]
- Activity: [What they do after]
- Resources: [Downloads, templates, cheat sheets]
```

---

## Step 2.3: Content Type Assignment

For each lesson, assign the optimal content type:

| Content Type | Best For | Notes |
|---|---|---|
| Video (talking head) | Concepts, motivation, stories | Keep under 10 min |
| Screencast | Step-by-step tutorials, software demos | Show, don't tell |
| Text/article | Reference material, deep dives | Pair with video |
| Live session | Q&A, coaching, community building | Cohort/challenge only |
| Downloadable PDF | Cheat sheets, templates, worksheets | Complement lessons |
| Audio | On-the-go learning, interviews | Supplement only |
| Interactive quiz | Knowledge checks | After concept lessons |
| Project/exercise | Skill application | After every 2-3 lessons minimum |

**Rule:** Mix at least 3 content types across the course. No more than 3 consecutive lessons of the same type.

---

## Step 2.4: Assessment & Activity Design

For each module, design:
- **Knowledge checks:** Quick quizzes (3-5 questions) after concept-heavy lessons
- **Practice activities:** Hands-on exercises where students apply what they learned
- **Projects:** Larger builds that combine multiple lessons (1 per module minimum)
- **Peer review:** Students review each other's work (cohort/challenge formats)
- **Capstone/final project:** End-of-course project demonstrating the full transformation

**Bloom's alignment:**
- Quizzes = Remember/Understand level
- Practice activities = Apply level
- Projects = Analyze/Create level
- Capstone = Create/Evaluate level

---

## Step 2.5: Community & Engagement Touchpoints

Design where community interaction happens:

| Touchpoint | Frequency | Purpose |
|---|---|---|
| Daily check-in post | Daily (challenge) or 2x/week | Accountability |
| Show-and-tell thread | Weekly | Celebrate wins, learn from peers |
| Q&A session (live) | Weekly | Direct instructor access |
| Office hours | Bi-weekly | Deep-dive help |
| Buddy/accountability partner | Throughout | Peer support |
| Progress tracker | Continuous | Visual motivation |
| Milestone celebrations | Per module completion | Dopamine + retention |

---

## Step 2.6: Content Sequencing Validation

Before finalizing, run these checks:
1. **Prerequisites check:** Does each lesson have prerequisites covered in prior lessons?
2. **Bloom's progression:** Do lessons move UP the taxonomy over time?
3. **Pacing check:** Is the daily/weekly time commitment realistic?
4. **Ruthless cut:** For each lesson, ask "Could students achieve the transformation without this?" If yes, cut it.
5. **Gap check:** Is anything missing that students would need?

---

## Phase 2 Deliverable: Full Course Outline

Save to `course-creator-output/02-curriculum/course-outline.md`

```markdown
# COURSE OUTLINE: [Course Name]

## Table of Contents

## 1. Course Overview
- Transformation Statement
- Target Audience
- Format & Duration
- Prerequisites

## 2. Curriculum Map (Visual Overview)
- Module/Week progression
- Bloom's taxonomy progression

## 3. Module Details
For each module:
- Module Title & Objective
- Duration
- Lessons (with learning objectives, content types, activities)
- Module Assessment
- Community Touchpoint

## 4. Assessment Strategy
- Quiz schedule
- Project briefs
- Capstone project requirements
- Grading/completion criteria

## 5. Resource List
- All downloadable materials needed
- Tools/software students need
- Recommended reading/watching

## 6. Content Production Checklist
- What needs to be created per lesson
- Estimated production time
```
