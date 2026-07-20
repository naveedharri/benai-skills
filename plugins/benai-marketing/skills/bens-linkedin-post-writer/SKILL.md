---
name: bens-linkedin-post-writer
disable-model-invocation: true
description: >
  Repurpose YouTube videos, blog articles, guides, or raw insights into high-performing
  LinkedIn posts that match Ben Van Sprundel's tone of voice and writing style. A
  step-by-step, interactive process: never output a complete post immediately. Each step
  presents suggestions, waits for the user's decision, then advances to the next step.

  Use when the user shares a YouTube link, blog URL, transcript, document, insight, or idea
  and wants a LinkedIn post, or asks to repurpose content for LinkedIn.

  Triggers: "LinkedIn post", "LinkedIn content", "repurpose", "write a post", "post about",
  "turn this into a post", "create a LinkedIn post", "LinkedIn from YouTube", "LinkedIn from blog".
---

# Ben's LinkedIn Post Writer

Take source material (YouTube videos, blog articles, guides, or raw insights) and walk the user
through a structured, collaborative process to create a LinkedIn post that sounds authentically
like Ben Van Sprundel.

This is an iterative, step-by-step process. Never skip steps or output a finished post without
going through each stage. At most steps, present multiple options (typically 10) and wait for
the user to choose the direction.

## Reference documents

Read each one only when its step says to. Do not frontload everything at once.

| Document | What it contains | When to read |
|---|---|---|
| `references/performance-defaults.md` | Audience context + what works and what underperforms | Step 2 |
| `references/frameworks.md` | The six writing frameworks + performance rankings | Step 3 |
| `references/linkedin-examples.md` | Ben's real posts, the ground truth for voice and tone | Steps 3, 5 |
| `references/hook-templates.md` | 80+ hook templates by category with psychological triggers | Step 4 |
| `references/writing-style.md` | Ben's sentence, tone, and flow rules | Step 5 |
| `references/humanization.md` | AI-tell removal pass + iteration questions | Step 5 (before delivery) |

## Step 0: Source intake

Always use provided data first. Only fetch external data when the user gives a URL without
accompanying text.

- User provides a transcript, article text, notes, or a document: read it, give a 1-2 sentence summary, move on.
- User provides only an insight or idea (no source): summarize it back to confirm. This is valid input.
- User provides only a URL:
  - YouTube: if the Apify MCP server is available, get the transcript with an actor like `topaz_sharingan/Youtube-Transcript-Scraper-1`. Otherwise ask the user to paste the transcript.
  - Blog/article: prefer an Apify web scraper actor, else WebFetch, else ask the user to paste the text.
- Never scrape LinkedIn profiles or posts. If LinkedIn is the source, ask the user to paste the text.

Give a 1-2 sentence summary and confirm with the user before Step 1.

## Step 1: Content analysis

Analyze the source internally: core themes, standout stories/data/examples, angles for the
target audience, personal experiences or unique perspectives. Do not present this analysis in
detail. Use it to inform Step 2. Tell the user you have analyzed the content and are ready to
suggest outcomes.

## Step 2: Define the main outcome for the audience

**Read `references/performance-defaults.md`** for audience context and what the audience rewards.

Decide what the reader should take away from this post. Present 10 numbered options. Each option:

- **Main outcome** (1 sentence): what the reader walks away thinking, feeling, or doing
- **Angle** (1 sentence): the specific lens to get there
- **Secondary outcome** (optional, 1 sentence): an additional benefit

Make the 10 genuinely different: pull from different themes, audience segments, and emotional
triggers. Do not rephrase the same idea 10 ways.

One post = one idea with depth. When the user picks a main outcome plus secondary outcomes, weave
the secondaries in as subtle undertones, not explicit sections or standalone paragraphs.

Wait for the user to choose before moving on.

## Step 3: Define the writing framework

**Read `references/linkedin-examples.md` and `references/frameworks.md`.**

Present all six frameworks. For each, write 3-5 bullet points describing what each section of the
post would cover for this specific topic and outcome. Show the skeleton, do not write the post.
Recommend one of the top three by default based on the outcome from Step 2.

Wait for the user to choose before moving on.

## Step 4: Define the hook

**Read `references/hook-templates.md` thoroughly** and follow its "Follow the template structure
literally" rule. Also apply the highest-performing hooks in `references/performance-defaults.md`.

The hook decides whether people keep reading. Only the first ~2 lines show before "see more".
Keep hooks short, often under 15 words on the first line.

Present exactly 10 hook options. Each must:

- Be short and punchy, 1-2 lines maximum
- Stay focused on the Step 2 main outcome (same core idea, different angles)
- Be specific and ready to publish, no generic placeholders

Match templates to the outcome (Step 2), framework (Step 3), and post type. For Build Log and
Product Showcase, lean on category 8 hooks. For PAS + Numbered Playbook, lean on 8.4.

Wait for the user to choose before moving on.

## Step 5: Write the post

**Re-read `references/linkedin-examples.md` even if you read it earlier**, to absorb Ben's voice
right before writing. Then apply `references/writing-style.md`.

Write the full LinkedIn post and open it as an artifact (an `.md` file) so the user can iterate.
Make the hook and body flow as one continuous thought (see writing-style.md).

Then run the draft through `references/humanization.md` before showing it to the user. This pass
is mandatory and part of Step 5. Present the humanized post in the artifact and use the
iteration questions in humanization.md to gather feedback. Be ready to iterate.

## Self-improvement

This skill is never finished. Improve it as you use it.

- When the user corrects how a step was done, update the relevant reference file (or this SKILL.md) so the correction sticks. Do not just fix it for this run.
- When a correction is a hard rule ("always X", "never Y"), add it as a permanent rule here.
- When the user says a post was genuinely good, save it to `references/linkedin-examples.md` so it becomes a model for future runs.
- Keep the skill small: when you add something, run the deletion test and cut anything that no longer changes behavior.

## Quick reference: the process

| Step | What happens | User chooses from |
|---|---|---|
| 0 | Get source material (YouTube/blog/doc/idea) | (none) |
| 1 | Analyze content internally | (none) |
| 2 | Suggest audience outcomes | 10 options |
| 3 | Suggest writing frameworks | 6 frameworks with skeletons |
| 4 | Suggest hooks | 10 options |
| 5 | Write the post + humanization pass | Artifact for iteration |

**Golden rule:** Never skip a step. Never combine steps. Never output a finished post before
Step 5. The humanization pass is part of Step 5, not optional.
