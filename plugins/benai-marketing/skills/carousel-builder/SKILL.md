---
name: carousel-builder
description: Build a Ben AI image-first carousel (Type B) from provided source content and export it as a PDF. Give it a newsletter, a YouTube transcript, a LinkedIn post, or a raw brief; it picks the slide count (3-10), writes the copy in Ben's voice, renders every slide with Higgsfield GPT Image 2, composites the real-logo brand footer in code, and assembles the PDF. Use whenever the user (or an orchestrator/routine) says "build a carousel", "turn this into a carousel", "make a LinkedIn/Instagram carousel", or "repurpose this into slides".
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
disable-model-invocation: true
---

# Carousel Builder

Turn one piece of **source content that is handed to you** into a finished Ben AI **image-first authority carousel** (Type B) and export a print-ready PDF. Slides render with **Higgsfield GPT Image 2**; the footer bar is composited by code so the logo, avatar, and page numbers are always correct.

**Scope.** This skill only *builds* the carousel from content it is given, and returns the PDF. It does **not** scan inboxes, choose which email to use, schedule anything, or post to Slack. An orchestrator (a person, or the daily routine) finds the source, invokes this skill, and handles delivery. Keep this skill focused on the build.

The carousel must **make its point on its own** (assume the social caption is one line).

## Before you start (every run)

1. Read `references/brand-and-copy.md` (palette, type, voice, copy architecture, hard rules).
2. Read `references/render-pipeline.md` (exact render + footer + PDF commands, both the Higgsfield **connector** and the **CLI** paths).
3. Scan `assets/templates/type-b-image-first.png` (the look) and `assets/example/` (a finished reference carousel: 6 slides).

## Step 1: Read the source, find the ONE point

Accept whatever content is provided: a newsletter body, a YouTube transcript, LinkedIn/post copy, or a brief. Identify the single argument the carousel makes: one point, backed up. If the source only teases (e.g. "watch my video"), reconstruct the real substance so the carousel stands alone. If the source has several disconnected ideas, pick the most useful one.

## Step 2: Slide count and architecture (3-10)

Pick the count from the content (typical 5-8, lower lands harder). Build an arc:

- **Slides 1-3 = big-header, high-impact.** Cover/hook (with Ben's portrait), problem, first turn to the solution. One large headline + one yellow highlight + short body.
- **Middle slides = text-heavier substance.** Deliver the actual method: a smaller header plus 2-4 short bullets, numbered steps, or a simple labeled graphic. One idea per slide. This is what makes the carousel self-contained.
- **Final slide = a CTA that makes sense** (follow / watch the full breakdown / grab the skill). Never a CTA that leans on context the slides never gave.

## Step 3: Write the copy (Ben's voice)

Per slide: eyebrow (UPPERCASE, letter-spaced, 2-5 words, never cursive), headline (one argument, exactly one 1-3 word yellow highlight), body/bullets. Practitioner authority, second person, direct. **No em dashes.** No buzzwords, no hedges. Full slot budgets and voice in `references/brand-and-copy.md`.

## Step 4: Approve the copy plan (checkpoint, before spending credits)

Present the full slide-by-slide copy plan (per slide: eyebrow, headline, highlight word, body/bullets) as text and stop. Offer at least these choices and wait for the user to pick:

- Approve as-is and render.
- Revise specific slides (they name which and how).
- Change the slide count.
- Change the CTA framing on the final slide.

Rendering (Step 5) spends Higgsfield credits, so never render before the user approves the plan.

## Step 5: Render each slide (Higgsfield GPT Image 2)

Each prompt = the shared style block + the per-slide copy, and it must tell the model to **leave the bottom 12% empty cream** (the footer is added by code). Hero slide 1 passes Ben's portrait (`assets/portrait/ben-portrait.png`) as a reference image.

Two interchangeable render paths (see `references/render-pipeline.md` for exact calls):
- **Higgsfield MCP connector** (`generate_image`, model `gpt_image_2`), for running on Claude / in a routine.
- **Higgsfield CLI** (`higgsfield generate create gpt_image_2 ...`), for running locally on an authenticated machine.

QA every slide: read the PNG back, confirm the text is spelled correctly and only one phrase is highlighted. Re-render any garbled slide. Bullet slides are the highest risk.

## Step 6: Footer, then PDF

- Footer on every slide: `python3 scripts/footer.py <in.png> <page> <total> <out.png>`.
- Assemble in order: `magick final/slide-0[1-9].png <slug>.pdf` (or `img2pdf`).
- Save the PDF + slides to a working folder (default `~/Downloads/<slug>-carousel-<YYYYMMDD-HHMM>/`, or a path the caller gives).

## Step 7: Return the artifact

Report the PDF path, slide count, and the topic. That's it, delivery (Slack, posting, etc.) is the caller's job.

## Hard rules (never break)

1. **No cursive / script** anywhere. Eyebrows are uppercase letter-spaced sans.
2. **Real Ben AI logo only**, composited by code (`scripts/footer.py`). Never let the image model draw the logo.
3. **Footer avatar sits on a cream disc**, never a black circle.
4. Cream (`#FAF3E3`) background, ink (`#050505`) headline, one pale-yellow highlight (`#FDEEC4`) per headline. No other accent colors.
5. **No em dashes.** Ben's voice, second person, no buzzwords.
6. The carousel is **self-contained**: it makes the point without relying on the caption.
7. Slide count 3-10, chosen from the content.
8. Dashed yellow swipe arrow on every slide except the last.

## Self-improvement

This skill is never finished. Improve it as you use it.

- When the user corrects how a step was done, update the relevant reference file (`references/brand-and-copy.md` for voice/copy/palette, `references/render-pipeline.md` for render/footer/PDF) or this SKILL.md so the correction sticks. Do not just fix it for this run.
- When a correction is a hard rule ("always X", "never Y"), add it to the Hard rules list here.
- When the user says a carousel was genuinely good, save its slides to `assets/example/` so it becomes a model for future runs.
- Keep the skill small: when you add something, run the deletion test and cut anything that no longer changes behavior.

## Files

| File | Contains |
|------|----------|
| `references/brand-and-copy.md` | Palette, type, voice, copy architecture, slot budgets, hard rules. |
| `references/render-pipeline.md` | Higgsfield connector + CLI calls, the shared style block, footer, PDF, gotchas. |
| `scripts/footer.py` | Code-composited footer (real logo, avatar, name, page numbers). |
| `assets/logo/benai-smiley.png` | The real Ben AI mark (authoritative). |
| `assets/portrait/ben-portrait.png` | Ben's transparent portrait (cover slide + footer avatar). |
| `assets/templates/type-b-image-first.png` | The Type B reference look. |
| `assets/example/` | A finished reference carousel (6 slides) to match quality against. |
