# Phase 3: Lesson Scripting

## Purpose
Write the actual content framework for every lesson — scripts, outlines, talking points, companion materials.

---

## Lesson Script Template

Every lesson follows this structure (adaptable per content type):

```markdown
# LESSON SCRIPT: [Module X] — [Lesson Y]: [Title]

## Metadata
- **Duration:** [X minutes]
- **Content Type:** [Video / Screencast / Text / Live]
- **Learning Objective:** [Bloom's verb + skill]
- **Materials Needed:** [Tools, files, accounts]

## Hook (30-60 seconds)
- Opening question or real-world example that creates curiosity
- Why this lesson matters RIGHT NOW
- What they'll be able to do by the end
- [Write the actual hook script here]

## Core Teaching (5-10 minutes)
- Main concept broken into 2-3 key points
- Each point explained with:
  - The concept (what)
  - Why it matters (why)
  - How it works (how)
  - Example/demo (show)
- [Write the actual teaching content/talking points here]

## Demo/Walkthrough (3-5 minutes, if applicable)
- Step-by-step demonstration
- Screen-by-screen if screencast
- Pause points for student to follow along
- [Write the actual walkthrough steps here]

## Activity/Challenge
- Clear instructions for what the student does
- Expected time to complete
- Success criteria ("You know you've got it when...")
- Stretch goal for advanced students
- [Write the activity brief here]

## Recap + Bridge (30-60 seconds)
- Summarize the key takeaway in one sentence
- Connect to tomorrow's/next lesson
- Motivational close
- [Write the recap script here]

## Companion Materials
- [List all downloadable resources for this lesson]
- [Templates, cheat sheets, worksheets, starter files]
```

---

## Companion Material Types

| Material | Purpose | Format |
|---|---|---|
| Cheat sheet | Quick reference for key concepts | PDF (1-2 pages) |
| Template | Starting point for activities | Various (doc, code, spreadsheet) |
| Worksheet | Guided practice/reflection | PDF with fill-in sections |
| Resource list | Curated links for further learning | PDF or Notion page |
| Starter files | Code/project files for hands-on work | ZIP or GitHub repo |
| Checklist | Step-by-step task completion | PDF (1 page) |
| Swipe file | Examples of good output | PDF or collection |

---

## Daily Challenge Prompts (Challenge Format)

For challenge-format courses, each day needs a specific challenge prompt:

```markdown
# DAY [X] CHALLENGE

**Title:** [Catchy, action-oriented title]
**Objective:** [What you'll build/do today]
**Time Required:** [X minutes]

## The Challenge
[Clear, specific instructions — what to build, create, or do]

## Success Criteria
- [ ] [Specific thing they should have done]
- [ ] [Another specific outcome]
- [ ] [Stretch goal — optional]

## Share Your Work
Post your result in the community with the hashtag #Day[X] and tag your accountability partner.

## Stuck? Here's a Hint
[One helpful tip without giving away the answer]
```

---

## Community Discussion Prompts

For each lesson/day, create a discussion prompt that is:
- Tied to the lesson content
- Open-ended (not yes/no)
- Encourages sharing personal experience or work
- Creates opportunity for peer learning

---

## Scripting Process

When creating lesson scripts for the user:

1. **Ask which module to start with** — don't try to script the entire course at once
2. **Script 1 lesson at a time** — show the user, get feedback, then continue
3. **Maintain consistency** — same tone, format, and pacing across all lessons
4. **Write for the content type** — a video script is different from a text lesson
5. **Include transition hooks** — each lesson's recap should tease the next lesson

---

## Phase 3 Deliverable: Lesson Script Package

Save to `course-creator-output/03-lessons/`

```
03-lessons/
├── module-1/
│   ├── lesson-1-1-[title].md
│   ├── lesson-1-2-[title].md
│   └── ...
├── module-2/
│   └── ...
├── companion-materials-list.md
├── challenge-prompts.md          (if challenge format)
└── discussion-prompts.md
```

**Naming convention:** `lesson-[module]-[lesson]-[slug].md`
- Example: `lesson-1-1-meet-claude.md`
