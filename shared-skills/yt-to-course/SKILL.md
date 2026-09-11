---
name: yt-to-course
description: >
  Turn a YouTube video into a structured Circle course package: decides full course vs section addition (against course_structure.md), cuts sentence-aligned lessons via video-cutter, writes lesson content in Ben's voice, and outputs clips, lesson.md, description.txt, README, and manifest. STEP 2 of the YouTube pipeline: yt-to-community always runs first; invoke only after the community post is saved and the user confirms course material. TRIGGERS: "yes, course it", "turn this into a course", "yt to course", "video to course", "create lessons from this video", "add this to a course". NOT for community announcement posts (use yt-to-community).
---

# YouTube to Course Material

Turn YouTube videos into structured, ready-to-upload course content for the BenAI Accelerator community on Circle. Two output types: a full new course (long-form, multi-section videos) or new lessons added to an existing course (shorter, topic-specific videos).

## Pipeline Position

This skill is **step 2 of 2** in the YouTube repurposing pipeline.

1. `yt-to-community`: community post + thumbnail. Always runs first.
2. `yt-to-course` (this skill): course material. Runs only after the post is done and the user has confirmed.

If a YouTube URL lands in chat and the community post hasn't been created yet, do not start here. Hand back to `yt-to-community`. The pipeline order is fixed: post first, course second.

## Why This Exists

Community members are professionals running businesses. They don't have time to watch hour-long YouTube videos end-to-end. So we cut videos into focused lessons, write lesson copy around each clip, and structure it as a self-paced course in Circle. This skill automates ingestion, section planning, lesson writing, and cutting. The only manual step is uploading the clips into Circle's course builder (the Circle API doesn't expose course-lesson CRUD).

## Profile boundary

All output writes to `Profiles/Milan/`. Course packages land in `Profiles/Milan/Community/course-packages/{date}-{slug}/`. See [[yt-pipeline SPEC|SPEC.md]] for the full invariant.

## The Flow

### Step 1: Ingestion

**If invoked from `yt-to-community` (the normal pipeline path):** the community post step has already run `yt-ingestion-agent` and you've been passed an ingestion manifest. Reuse it. Do not re-run ingestion. it wastes minutes and re-downloads gigabytes. Only the video file and word-level timestamps may need a top-up if the community post run skipped them (community-only runs sometimes do).

**If invoked standalone (user explicitly asked for course material on a video that already has a post, or skipped the post intentionally):** invoke the `yt-ingestion-agent` sub-agent with the YouTube URL and target output directory. The agent handles:
- Download (yt-dlp fallback chain for SABR/PO-token blocks)
- Transcript (3-method priority: MCP, youtube-transcript-api, user-provided)
- Word-level timestamps (faster-whisper)
- Thumbnail
- Metadata

If the agent surfaces a download-blocked choice (e.g., 1080p unavailable), present the three options to the user (accept lower res, manual provide from YouTube Studio, cut-sheet-only mode) and pass the user's selection back to the agent.

When ingestion completes, you have a manifest pointing at the artifacts.

### Step 2: Determine Output Type

Read `[[course_structure]]` (reference file in this skill folder). It maps every active course in the community, what topics it covers, and what sections/lessons already exist.

Decide based on two factors:

**Full new course** if:
- Video is 45+ minutes long
- Covers a broad topic from beginning to end
- Doesn't overlap significantly with any existing course's topic
- Has enough natural sections to justify a multi-lesson structure (4+ sections)

**New lessons in existing course** if:
- Video is shorter (under 45 minutes, though length alone isn't decisive)
- Topic directly extends or complements an existing course
- Would fit naturally as new lessons within an existing course's structure

Present your recommendation with reasoning. Wait for the user to confirm before proceeding.

### Step 3: Plan the Sections

Analyze the transcript and break it into logical sections. Each section should:

- Cover one distinct concept or skill
- Be 3 to 10 minutes long (sweet spot for focused learning)
- Have a clear beginning and end in the transcript
- Flow naturally from the previous section

For each section, determine:
- Section title (clear, specific, no fluff)
- Approximate start timestamp
- Approximate end timestamp
- Core concept (the one thing the viewer learns)
- Key takeaway (what they can do after watching)

Present the section plan as a table. The user might adjust sections, merge some, or split others. Iterate until confirmed. This is the editorial gate between ingestion and cutting.

### Step 4: Write Lesson Content (draft + humanizer pass per lesson)

For each section, you go through three substeps in order before moving to the next section. Do **not** batch all drafts first and humanize at the end. The per-lesson loop is the contract.

**4a. Draft lesson.md.** Read these vault files for voice calibration once at the start of Step 4 (not per lesson):

- `Context/brand.md` (brand identity and public/marketing tone)
- `Context/ben-voice.md` (how Ben actually writes 1:1: answer-first, loose-not-polished, peer-to-peer warmth, banned corporate phrases)
- `Resources/frameworks/youtube-voice.md` (YouTube-specific voice)
- `Resources/frameworks/newsletter-structure.md` (structural patterns)
- `Resources/frameworks/newsletter-examples.md` (real examples of Ben's writing)

Structure per lesson:

```markdown
## {Section Title}

{1 to 2 sentence teaser that makes you want to watch the clip. Direct, practical, slightly provocative. Not a summary. A hook.}

### What you'll learn
{2 to 3 bullet points. Specific outcomes, not vague promises. "How to connect your first MCP server" beats "Understanding MCP concepts."}

### Key concept
{Short paragraph explaining the core concept. Conversational. Real examples. If there's a "here's the thing" moment, include it.}

### Try it yourself
{1 to 2 concrete action items. Things the viewer should actually do.}
```

Voice rules (non-negotiable):
- First person: "I" and "we", never "Ben" or "the instructor"
- Direct: no "In this lesson, we will explore". Get to the point.
- Practical: every sentence should teach something or motivate action.
- Anti-fluff: if a sentence adds no value, delete it.
- Conversational: read it aloud. If it sounds like a textbook, rewrite.
- Ben signature patterns: "Here's the thing:", "That's it.", "It's not rocket science."
- No em dashes, no curly quotes (these violate vault rule #14 and Ben's voice rules).
- Avoid the `**Bold lead.** Sentence...` inline-header pattern in body prose. It reads AI. Use flowing paragraphs that name the concept inline, or promote distinct concepts to `###` subheads.

Write the draft to `{package_root}/sections/{NN}-{slug}/lesson.md`.

**4b. Humanizer pass (mandatory, autonomous).** Invoke the [[humanizer]] skill against the lesson.md file you just wrote. The humanizer scans for the Wikipedia "Signs of AI writing" patterns (inflated symbolism, promotional language, copula avoidance, rule of three overuse, negative parallelisms, AI vocabulary words, inline-header bold lists, em dashes, curly quotes, filler phrases, sycophantic tone, etc.) and rewrites the prose.

Run it in **autonomous mode**: the humanizer should Read the lesson.md, apply Edits directly to the file, and return. Do **not** surface a diff, a side-by-side, or a "should I apply these changes?" prompt to Milan. The humanizer's interactive review mode is for standalone use. Inside `yt-to-course`, the pass is an inline polish step.

What "autonomous" means concretely:
- The humanizer must not call `AskUserQuestion`.
- The humanizer should not output a long "changes I made" summary; if it wants to log anything, a one-line note is enough.
- If the humanizer cannot find any patterns to fix, it leaves the file untouched (that is a valid outcome).
- All edits stay in the same file. No new files, no backups, no `.bak`.

**4c. Write description.txt.** 1 to 2 sentences max, teases what's in the clip without giving everything away. The humanizer pass also covers description.txt: invoke it once more against the description file before moving on.

Repeat 4a -> 4b -> 4c for each section, in order, before starting the next one.

> [!important] Why per-lesson, not batch
> Per-lesson keeps the humanizer's scan window small (one ~400-500 word file at a time). Batching all 7 lessons before humanizing tends to produce sloppier rewrites because the pass sees more context than it needs and re-edits already-clean prose. Stay disciplined: draft, humanize, next.

### Step 5: Cut the Video

Invoke the `video-cutter-agent` sub-agent with:
- video_path (from the ingestion manifest)
- word_timings_path (from the ingestion manifest)
- target_cut_points (the section boundaries from Step 3)
- section_titles (ordered list matching cuts)
- output_dir (`{package_root}/sections/`)

The agent runs `detect_silences.py`, `pick_cuts.py`, `cut_clips.py`, and `verify_cuts.py`. If any cut fails QA, the agent surfaces the discrepancy. Decide whether to accept or have the agent re-pick.

If ingestion produced no video (cut-sheet-only mode), skip this step. The package outputs a manual cut sheet instead with FFmpeg commands the user can run locally.

### Step 6: Package the Output

Create the course package folder structure:

```
Profiles/Milan/Community/course-packages/{date}-{slugified-course-name}/
├── README.md
├── course-manifest.json
├── sections/
│   ├── 01-{slug}/
│   │   ├── clip.mp4
│   │   ├── lesson.md
│   │   └── description.txt
│   ├── 02-{slug}/
│   │   └── ...
└── attachments/   (optional, only if user provides PDFs/assets)
```

The README is a human-facing upload checklist. The manifest is the machine-readable structure (course name, Circle ID once known, all sections with timestamps, lesson paths, descriptions, attachments).

### Step 7: Update course_structure.md

After the package is written, ask the user: "Should I update course_structure.md with the new course/lessons?"

If yes: update `references/course_structure.md` with the new entry (course name, Circle ID as TBD, URL as TBD until published, section list).

### Step 8: Log to community-log.md

Append to `Profiles/Milan/Community/community-log.md` (NOT the profile root, the canonical path is inside `Community/`):

```
- {date} | Course Material | "{Course Name}" ({new standalone course | new lessons in [[Course]]}) | Source: {URL} | Lessons: N (total mm:ss) | Circle ID: TBD | URL: TBD | Status: ready-for-upload | Package: [[Community/course-packages/{slug}/README|README]]
```

## Edge Cases

- **Sub-45-min video covering a focused topic**: probably section addition, not full course. Check course_structure.md for fit.
- **No timestamp data in transcript**: cut-sheet-only mode. Sections planned from text content, ffmpeg commands surfaced for user to run locally.
- **Transcript in non-English language**: flag and ask the user how to proceed.

## What This Skill Does NOT Do

- **Create courses in Circle's UI**: Circle Admin API v2 doesn't expose course-lesson CRUD. User creates the course structure and uploads clips manually.
- **Auto-publish**: outputs are drafts. User reviews and publishes from Circle.
- **Video editing beyond cutting**: no transitions, no captions, no overlays. For branded video production, use [[Repurposing Skill]].
