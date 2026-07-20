---
name: intelligent-editing
description: Smart editing workflow with clarifying questions and quality checks
metadata:
  tags: video, editing, workflow, questions, quality
---

# Intelligent Video Editing

**Contents:** §1 Workflow · §2 Questions by Task Type · §3 Quality Checks · §4 Finding Smart Cut Points · §5 Decision Matrix · §6 Tips · §7 Lessons Learned (What Works)

Act as a smart video editor: analyze content, ask clarifying questions, make suggestions, and ensure quality output.

This file provides the detailed implementation for Phases 2-5 of the main workflow defined in SKILL.md. **Phase 2 (Intake) is mandatory** - never skip the clarification questions.

---

## Workflow

### 1. Gather Files
- Get video file paths from user (this happens during Phase 2: Intake in SKILL.md)
- Copy to Remotion `public/` folder if using Remotion
- Rename files to avoid spaces (e.g., `intro.mp4` not `Intro Video.mp4`)

### 2. Analyze
Run ffprobe on each video to understand:
- Duration
- Resolution (width x height)
- Codec
- Has audio?
- Frame rate

See [video-analysis.md](video-analysis.md) for commands.

### 3. Transcribe (REQUIRED for any cutting)

**Always transcribe before making any cuts.** This enables:
- Smart cuts at sentence boundaries (never mid-sentence)
- Finding silent sections for natural cut points
- Keyword/highlight identification for teasers
- Caption generation for accessibility

**Word-level timestamps required:**

**Primary method - Remotion API (recommended, GPU accelerated):**
```ts
import { transcribe } from '@remotion/install-whisper-cpp';

const { transcription } = await transcribe({
  inputPath: audioPath,
  whisperPath: '.whisper',
  whisperCppVersion: '1.5.5',
  model: 'base.en',
  tokenLevelTimestamps: true,  // REQUIRED for word-level captions
  printOutput: true,
});
```

See [transcription.md](transcription.md) for full setup script.

**Fallback - CLI (if Node API has issues):**
```bash
whisper-cpp/main -m model.bin -f audio.wav -ojf -ml 1 -of output
```

Word-level segmentation is needed for:
- Dynamic word highlighting in captions
- Precise sentence boundary detection
- Clean audio cuts

### 4. Parse Sentences from Transcript

Convert word-level captions into sentence-level data:
```ts
// Find sentences by detecting . ! ? at word endings
const sentences = findSentenceBoundaries(captions);
// Each sentence has: text, startMs, endMs, duration
```

This gives you clean cut points for any editing task.

### 5. Ask Clarifying Questions (MANDATORY)
**Never skip this step.** Based on task type, ask the relevant questions below. Do not proceed to editing until you have clear answers.

### 6. Propose Edit Plan
Present approach before executing:
- **For teasers**: List specific sentences selected and why
- **For stitching**: Order and transition points
- What will be cut/kept
- Expected output duration
- Any quality concerns

### 7. Preview First
- Remotion: Always run `npm run dev` and preview in Studio
- FFmpeg: Render a short test clip or extract keyframes

### 8. Execute & Iterate
- Render only when user approves
- Gather feedback and refine

### 9. Create Final Video (ALWAYS)

**Once captions and edits are complete, always assemble the final video:**

```
[TEASER with captions - ~30s] → [MAIN CONTENT with captions]
```

The final video should include:
1. **Teaser at the start WITH captions** - Highlight reel to hook viewers, captions filtered to clip time ranges
2. **All main clips stitched** - In chronological order
3. **Captions throughout** - Word-level highlighting on both teaser and main content

See [stitching.md](stitching.md) for the complete final video assembly pattern.

---

## Questions by Task Type

### Teasers

**CRITICAL: Always use transcript analysis for teaser cuts. Never use arbitrary timestamps.**

**Step 1 - Transcribe First:**
- Transcribe with word-level timestamps (Remotion `transcribe()` API with `tokenLevelTimestamps: true`)
- Parse transcript into complete sentences
- Note sentence boundaries (startMs, endMs)

**Step 2 - Review Transcript & Select Highlights:**
Claude must read the full transcript and identify:
- Hook sentences (attention-grabbing opening)
- Key insights (main value/interesting facts)
- Quotable moments (memorable one-liners)
- Call-to-action (drives engagement)

**Step 3 - Validate Each Cut:**
- Is it a complete sentence? (never cut mid-sentence)
- Does it make sense independently? (no context needed)
- Is the audio clean? (no mid-word cuts, no breath sounds)
- Does it create curiosity? (makes viewer want more)

**Questions to Ask:**
- Target duration? (15s for Reels/TikTok, 30s standard, 60s max)
- What's the purpose? (social promo, trailer, hook)
- Should it reveal the ending or create curiosity?
- Text overlays needed? (title, call-to-action)

### Overlay Teasers (Picture-in-Picture)

**ALWAYS ASK - Never Assume Defaults:**

| Question | Options | DON'T Default To |
|----------|---------|------------------|
| "Where should the overlay appear?" | Left / Right corner | Don't assume right |
| "What size for the overlay?" | Small (20%) / Medium (25%) / Large (30%) | Don't assume 25% |
| "How should the video fit?" | Cropped to fill / Full video resized | Don't assume cropped |
| "Add a background behind it?" | None / Black / Blur | Don't add background |
| "Add border or shadow?" | None / Subtle / Shadow | Don't add styling |
| "Include overlay audio?" | Muted / With audio | Default to **muted** |

**Clip Selection Rules:**
- NEVER include clips from intro (intro is about to play - redundant)
- ONLY pull from main content parts (teaser previews upcoming content)
- NEVER use clips starting with pronouns (It, This, They) or conjunctions (But, And, So)

**Styling - AVOID Unless Requested:**
- No black background (user may want transparent)
- No border/shadow (keep minimal)
- No rounded corners (ask first)
- Audio should be muted by default

### Stitching

**Order:**
- What order should clips appear? (chronological, thematic, custom)
- Are clips named in order (01.mp4, 02.mp4) or need manual ordering?

**Audio:**
- Overlapping audio to consider?
- Should audio crossfade at joins? (Only if the user picked crossfade mode - hard cuts with full-volume audio are the default for social clips)
- Background music layer?

**Continuity:**
- Should clips flow seamlessly or have visible cuts?
- Same speaker/scene across clips?

### Transitions

**Hard cuts are the DEFAULT for social clips (LinkedIn, TikTok, Reels) - no transitions, fades, or dissolves. Only ask the questions below when the user explicitly picked crossfade mode (trailers/teasers/montages). Hard cuts are built with plain `<Sequence>` + `premountFor={60}`; do NOT use `TransitionSeries` - it has a null-props bug that crashes Studio (see SKILL.md and transitions.md).**

**Mood:**
- What mood are you going for?
  - Professional: fade, dissolve
  - Dynamic/energetic: slide, push, zoom
  - Playful: wipe, spin
  - Minimal: hard cut, dip to black

**Timing:**
- How long should transitions be? (0.5s subtle, 1s standard, 2s dramatic)
- Same duration throughout or varied?

**Consistency:**
- Same transition type throughout or varied?
- Specific transitions for specific moments?

### Captions

**Style:**
- What style?
  - Minimal: simple white text, black outline
  - TikTok-animated: word-by-word highlighting
  - YouTube-readable: large, clear, positioned bottom
  - Branded: custom colors/fonts

**Position:**
- Where? (bottom for YouTube, center for TikTok/Reels, top if content at bottom)

**Content:**
- Full transcription or key phrases only?
- Any words to emphasize? (highlight color, bigger size)
- Languages? (original only or translations)

**Source:**
- Do you have an SRT file, or should I transcribe the audio?

---

## Quality Checks

Run these checks before final render:

### Cut Quality (CRITICAL)
- [ ] Every cut is at a sentence boundary (verified against transcript)
- [ ] No mid-word cuts
- [ ] No mid-sentence cuts
- [ ] Each segment makes sense when heard independently
- [ ] No cuts during speaker inhale/breath
- [ ] No cuts on filler words ("um", "so", "like")

### Audio Quality
- [ ] Hard-cut mode (default): audio starts and stops at full volume - no fades. Last word of each clip resolves fully via per-clip `audioBufferMs` (whisper timestamps run ~200-700ms ahead of actual speech)
- [ ] Crossfade mode only: no abrupt audio cuts, fade out at clip end (200-500ms)
- [ ] Consistent volume levels across clips
- [ ] No audio pops or clicks at cut points
- [ ] Music doesn't overpower speech

### Visual Quality
- [ ] Consistent resolution across clips (scale/crop mismatches if needed)
- [ ] Consistent aspect ratio (16:9, 9:16, 1:1)
- [ ] No black frames at clip boundaries
- [ ] Color/brightness consistency (or intentional changes)

### Timing & Pacing
- [ ] Not too rushed (allow content to breathe)
- [ ] Not too slow (tighten dead air)
- [ ] Transitions don't eat into important content (crossfade mode only)
- [ ] Text overlays visible long enough to read

### Content Integrity
- [ ] Key moments preserved
- [ ] Story/message still makes sense after cuts
- [ ] No accidental jump cuts within same shot
- [ ] Teaser creates curiosity without giving everything away

---

## Finding Smart Cut Points

**Always use transcript data to find cut points. Never guess timestamps.**

### Parse Sentences from Word-Level Captions

```ts
interface Sentence {
  text: string;
  startMs: number;
  endMs: number;
  duration: number;
}

function findSentences(captions: Caption[]): Sentence[] {
  const sentences: Sentence[] = [];
  let words: string[] = [];
  let startMs = 0;

  for (const cap of captions) {
    if (words.length === 0) startMs = cap.startMs;
    words.push(cap.text);

    // Detect sentence boundary
    // NOTE: whisper also emits standalone punctuation tokens (".", ",") with
    // timestamps, but they are NOT spoken - never use a punctuation-only token's
    // endMs as a clip endMs; use the last spoken word's endMs (see SKILL.md)
    if (cap.text.trim().match(/[.!?]$/)) {
      sentences.push({
        text: words.join('').trim(),
        startMs,
        endMs: cap.endMs,
        duration: (cap.endMs - startMs) / 1000,
      });
      words = [];
    }
  }
  return sentences;
}
```

### Good Cut Points
- **Sentence end** - After `.` `!` `?` punctuation
- **Natural pause** - Gaps > 300ms between words
- **Topic change** - When subject shifts
- **Complete thought** - Self-contained statement

### NEVER Cut At
- Mid-word (obvious audio glitch)
- Mid-sentence (incomplete thought)
- During emphasis ("the KEY thing is..." CUT)
- Inhale/breath sounds
- Filler words ("um", "so", "like")

### NEVER Start a Clip With
**Conjunctions/Transitions:**
- **"But..."** - references something before
- **"And..."** - connects to previous thought
- **"So..."** - conclusion of previous point
- **"Now..."** - often transitional
- **"Then..."** - sequential reference
- **"However..."** - contrasts with something before

**Pronouns/References without context:**
- **"It..."** - pronoun referring to unknown antecedent
- **"This..."** - demonstrative without clear reference
- **"That..."** - demonstrative without clear reference
- **"They..."** - pronoun without clear reference
- **"These..."** - demonstrative without clear reference
- **"There..."** - often references prior context

Each clip must be a **completely standalone thought** - the subject must be explicitly named, not referenced with a pronoun. A viewer should understand the clip without any prior context.

### Opening Clip (CRITICAL)

The first clip is the hook: it determines whether the viewer keeps watching.

**Requirements:**
- Must start with a strong, complete concept: a bold statement, insight, or compelling question
- Must have an explicit subject (never a pronoun or reference)
- Must grab attention immediately: no warm-up, no filler
- Review the FULL transcript and deliberately select the strongest possible opening
- Never settle for "good enough": the opening is the most important clip in the video

**Good openers:** "The huge opportunity with AI...", "90% of businesses haven't implemented...", "Building a business is hard..."
**Bad openers:** "So basically what we're going to...", "It's really interesting because...", "Now the thing about this is..."

### Closing Clip (CRITICAL)

The last clip must end the video naturally: a conclusion, not a hard stop.

**Requirements:**
- Must be a complete thought that logically wraps up the point being made
- Must flow naturally from the preceding content, never forced or abrupt
- Should leave the viewer with a takeaway, call-to-action, or sense of closure
- Must make sense given the concept, idea, and point of the entire video
- The video should feel like it reached its natural end, not like it was cut short

**Good endings:** A summary statement, a strong opinion, a forward-looking insight, an encouraging "keep going" moment
**Bad endings:** Trailing off, abrupt cuts, filler, unrelated tangents, mid-thought stops

### Video Flow (CRITICAL)

The overall video must tell a coherent story:
- Each clip should logically connect to the next
- No jarring jumps between unrelated topics
- The progression should feel natural, not like random fragments stitched together
- If clips don't flow, reorder them or find better transition points in the transcript

### NEVER Repeat Content Between Teaser and Main Video
**The teaser's first clip should NOT overlap with the intro/main video start.**

If the teaser starts with the same content as the intro, viewers will see it twice:
1. Teaser plays: "In the software boom..."
2. Main video plays: "In the software boom..." (repetition!)

**Solution:** Use clips from later in the video (part2, part3, etc.) for the teaser hook, not from the intro.

### Finding Nearest Clean Cut

```ts
function findNearestSentenceEnd(
  sentences: Sentence[],
  targetMs: number,
  toleranceMs = 3000
): Sentence | null {
  let best: Sentence | null = null;
  let minDiff = Infinity;

  for (const s of sentences) {
    const diff = Math.abs(s.endMs - targetMs);
    if (diff <= toleranceMs && diff < minDiff) {
      best = s;
      minDiff = diff;
    }
  }
  return best;
}

// Example: Find clean cut near 30 seconds
const cut = findNearestSentenceEnd(sentences, 30000, 5000);
if (cut) {
  console.log(`Cut at ${cut.endMs}ms: "${cut.text}"`);
}
```

### For Teasers: Select Complete Sentences

```ts
function selectTeaserHighlights(
  sentences: Sentence[],
  targetDurationSec: number
): Sentence[] {
  const selected: Sentence[] = [];
  let totalDuration = 0;

  // Claude should review and pick impactful sentences
  // This is just the structure - actual selection requires judgment
  for (const s of sentences) {
    if (totalDuration + s.duration <= targetDurationSec) {
      // Check: Is this sentence impactful? Complete? Clear without context?
      selected.push(s);
      totalDuration += s.duration;
    }
  }
  return selected;
}
```

---

## Decision Matrix

| Scenario | Questions to Prioritize | Quality Focus |
|----------|------------------------|---------------|
| Quick social clip | Purpose, length | Pacing, hook |
| Professional edit | Order, transitions, audio | Smoothness, consistency |
| Captioned content | Style, position, source | Readability, timing |
| Multi-clip stitch | Order, audio continuity | Seamless joins |
| Trailer/teaser | Key moments, reveal vs mystery | Impact, pacing |

---

## Tips

- **Start with duration constraints**: Knowing target length helps prioritize content
- **Analyze before asking**: Some questions become obvious after analysis
- **Show don't tell**: Preview clips to help user make decisions
- **Trust silence**: Sometimes the best question is "what do you want this to feel like?"

---

## Lessons Learned (What Works)

Based on real-world video editing sessions, here's what works and what doesn't:

### What Works

**Transcription:**
- Use Remotion `transcribe()` API with `tokenLevelTimestamps: true` for reliable word-level timestamps (GPU accelerated)
- Fallback: whisper CLI with `-ojf -ml 1` flags if the Node API has version compatibility issues
- Cache transcript JSON files to avoid re-transcribing
- `base.en` model for development speed; `medium.en` or `large-v3-turbo` for final quality

**Teaser Creation:**
- Select 3-4 standalone clips for a ~30 second teaser
- Each clip should be a complete, self-contained thought
- Structure: Hook → Key Insight → Value Prop → Closing Hook
- Verify each clip starts with an explicit subject (not a pronoun)

**Captions** (example values - swap in the user's brand kit: dark `#0A0A14`, light `#F5F2EA`, accent `#B8E0B0`, font Inter):
- Brand accent (e.g. `#B8E0B0`) for active word highlight
- Brand light (e.g. `#F5F2EA`) for spoken words
- Dimmed gray (#B0B0B0 or #CCCCCC) for upcoming words
- Brand kit heading font (default Inter) at ~48px for 1080p videos
- Frosted pill container behind text (the skill default) beats stroke/shadow for readability on any background

**Remotion Video Trimming:**
- Use `OffthreadVideo` component for better performance
- Always set both `startFrom` AND `endAt` props for trimmed clips
- Convert milliseconds to frames: `Math.round((ms / 1000) * fps)`

### What Doesn't Work

**Transcription:**
- Always pass `whisperCppVersion: '1.5.5'` to match your installed version (mismatched versions cause errors)
- Sentence-level timestamps (without `tokenLevelTimestamps: true`) don't support word highlighting

**Teaser Clips:**
- Starting with conjunctions: "But", "And", "So", "Now", "Then", "However"
- Starting with pronouns: "It", "This", "That", "They", "These", "There"
- Mid-sentence cuts (always cut at sentence boundaries)
- Clips that require prior context to understand

**Captions:**
- Bright colors like neon green (#39E508) - harsh on eyes
- Thin fonts or decorative fonts - poor readability
- Using startMs/endMs without word-level timestamps - no highlighting

### Successful Teaser Example

From a 25-minute video, this 4-clip teaser (~27s) was created:

```ts
const TEASER_CLIPS = [
  {
    // HOOK - Sets context
    src: 'intro.mp4',
    startMs: 130,
    endMs: 7440,
    sentence: 'In the software boom, millions of businesses were born out of digitalizing information, creating a 650 billion software market.',
  },
  {
    // KEY INSIGHT - AI opportunity
    src: 'part3.mp4',
    startMs: 336370,
    endMs: 344840,
    sentence: 'The huge opportunity with AI democratizing product building is that building these types of businesses becomes so much faster and more accessible to anyone.',
  },
  {
    // VALUE PROP - Specific benefit
    src: 'part3.mp4',
    startMs: 142100,
    endMs: 148560,
    sentence: 'AI, marketing and sales tools can significantly reduce the CAC when targeting smaller niches.',
  },
  {
    // CLOSING HOOK - Urgency
    src: 'part3.mp4',
    startMs: 393070,
    endMs: 397700,
    sentence: 'The huge opportunity we have today is that the whole business world is looking at implementing AI.',
  },
];
```

**Why these clips work:**
- Each starts with explicit subject ("In the software boom...", "The huge opportunity...", "AI, marketing...")
- Each is a complete thought - no context needed
- Creates curiosity without giving everything away
- Good pacing: 7.3s + 8.5s + 6.5s + 4.6s = 26.9s
