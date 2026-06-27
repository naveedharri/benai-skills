# Progressive Disclosure

The multi-frame visual pattern where each frame builds on the previous by adding one element. Background, palette, composition, and previously-shown elements stay LOCKED across the entire sequence; only the new element changes.

## Why It Works

When Ben explains a multi-part concept (the structure of a skill folder, the layers of a system, a sequential workflow), the audience tracks better if the visual unfolds in sync with his narration. Showing the full diagram up front loses people; showing each piece as he describes it builds understanding step-by-step.

This is the YouTube tutorial version of an animated reveal. We render it as static frames so Ben can click through in his editing software at his own pace.

## The Core Mechanic: Iterative Image-to-Image

You CANNOT achieve progressive disclosure by generating N frames from N separate prompts. Even with identical text prompts, the model varies the background, lighting, and detail per call. Each frame would look like a sibling, not a continuation.

The correct approach: generate frame 1, then use frame 1 AS the reference for frame 2's generation, ask the model to ADD one element. Frame 2 becomes the reference for frame 3. And so on.

```
Frame 1:  generated from text prompt only            → image_1.png
Frame 2:  image_1.png as medias[0] + "add X" prompt  → image_2.png
Frame 3:  image_2.png as medias[0] + "add Y" prompt  → image_3.png
Frame 4:  image_3.png as medias[0] + "add Z" prompt  → image_4.png
```

Each frame literally contains the pixels of the previous, modified only where the new element lands. This is how visual continuity is preserved.

## Models

| Model | Strength | When to use |
|---|---|---|
| `nano_banana_2` | Strong instruction-following, handles "add X" edits cleanly when the prompt is precise | Default for progressive disclosure |
| `flux_kontext` | Purpose-built for image editing with natural-language instructions; sometimes preserves base image better than nano_banana_2 | Fallback if nano_banana_2 drifts the existing elements |

Try `nano_banana_2` first. If frame 3 starts drifting from frame 2 (background shifts, existing folder color changes, layout reshuffles), switch to `flux_kontext` for the remaining frames.

## The Plan-First Step

Before generating ANY frame, write out the disclosure plan in chat:

```
Progressive disclosure plan for "skills folder structure", 4 frames:

step-1: just the closed coral folder with white tab, label "/SKILL"
step-2: step-1 + folder is now half-open showing the file structure inside
step-3: step-2 + add SKILL.md file at the top of the open folder
step-4: step-3 + add references/ subfolder below SKILL.md, with 3 .md files visible inside

Generating now.
```

This serves two purposes:
1. **User intervention**: if step 3 doesn't make sense, the user catches it before you burn credits on 4 generations.
2. **Manifest record**: paste the plan into `manifest.md`; future you (or whoever revises) understands the intent.

## Per-Frame Prompt Pattern

### Frame 1 (the base)

A normal 4-block prompt (Scene, Hero Visual, Style, Negatives). No image-to-image; just generate from text + any user-provided style references.

The base frame should be the simplest version of the concept. Don't pack frame 1 with detail you intend to reveal in later frames. Common mistake: making frame 1 too rich, then having nothing to add in frames 2-4.

### Frames 2 through N (the additions)

Use this template:

```
Take the provided image (medias[0]) as the base. Keep the background, palette, layout, and all existing elements EXACTLY identical to the base; do not remove, recolor, reposition, or modify anything that's already there.

Add only the following new element: {specific description of what's new + WHERE on the frame it should go}

Render the new element in the same flat-stylized {coral / white / yellow} aesthetic as the existing elements. The new element should feel like it belongs to the same composition, not pasted on.
```

Variables per frame:
- The "new element" description (concise; reads like a stage direction)
- Position (top-left, center, beside the existing folder, etc.)
- Render style (matches the existing flat-stylized elements)

Keep the prompt under ~150 tokens. Longer prompts dilute the "preserve existing" instruction.

## Locked Style Block

Across all N frames, the style portion of the prompt (palette, render style, mood) stays IDENTICAL. Write it once at the start of the plan:

```
LOCKED STYLE (used in every frame's prompt):
Deep charcoal #1F1F1F background with subtle dot-grid texture, coral #E97B5D accent on key shapes, white text and arrows, flat-stylized vector aesthetic for all supporting visuals. No photoreal rendering. Mood: clear, structured, educational.
```

Paste it verbatim into every frame's prompt (frames 2 to N already reference the base image so this is reinforcement, but include it).

## What "New Element" Can Be

The disclosure step should be ONE clearly-defined addition. Good vs bad:

| Good | Bad |
|---|---|
| "add a small coral asterisk in the top-right corner of the folder" | "add some decoration to the folder" |
| "add a second folder labeled /STYLES below the existing one" | "show more folders" |
| "add a white curved arrow from the folder pointing to a new SKILL.md card on the right" | "explain what's inside the folder" |
| "the folder is now open, revealing two stacked file icons inside (SKILL.md on top, README.md below)" | "open the folder" |
| "add the word INSIDE in bold uppercase white text above the folder" | "add some text" |

Specificity is everything. The model needs to know exactly what, where, in what style.

## Handling Drift

Drift = the model changes something it shouldn't (background pattern shifts, a coral element turns more orange, the layout reshuffles).

Causes ranked by likelihood:

1. **Prompt was too long.** The "preserve existing" instruction got diluted. Trim adjective stacks; cut redundant style language.
2. **The new element is too big.** Adding a major new section forces the model to recompose. Break the addition into two smaller steps if needed.
3. **`nano_banana_2` can't preserve.** Switch to `flux_kontext` for the remaining frames.
4. **The base frame is too cluttered.** The model can't tell what's protected vs movable. Simplify frame 1 if possible.

If drift happens at frame K, fix at frame K (don't keep building on a drifted base). Regenerate frame K with tighter preservation language; then continue with the fixed frame K as the base for frame K+1.

## Common Patterns

### Concept layers (add detail)

frame 1: top-level shape
frame 2: + first internal component
frame 3: + second internal component
frame 4: + connector / arrow / label

Example: "How a skill is structured" → folder, then SKILL.md, then references/, then highlighted reference being read.

### Sequential steps (workflow)

frame 1: step 1 only (e.g., user types in chat)
frame 2: step 1 + step 2 (skill activates)
frame 3: step 1-2 + step 3 (output rendered)
frame 4: full pipeline highlighted

Example: "How a skill responds to a prompt" → 4 stage workflow.

### Before/after with intermediate states

frame 1: starting state
frame 2: state + first change
frame 3: state + change + result
frame 4: final state

Example: "What happens when you add a skill" → before, skill drops in, change propagates, after.

### Comparison stack

frame 1: option A alone
frame 2: option A + option B beside it
frame 3: A and B with a comparison highlight between them
frame 4: A and B with a clear winner marked

Example: "Skills vs prompts" comparison.

## Failure Modes

| Symptom | Cause | Fix |
|---|---|---|
| All frames look identical | Forgot to actually add anything; "new element" was vague | Make the addition concrete and specific |
| Frame 2 onward look unrelated to frame 1 | Used a fresh text-only prompt instead of image-to-image | Always pass the previous frame as `medias[0]` |
| Background dot-grid changed between frames | Pixel-level drift, model regenerated background | Tighten preservation language; switch to `flux_kontext` |
| Existing element got recolored | Same drift | Same fix |
| New element doesn't appear | Element description not specific enough about position or appearance | Rewrite with "in the top-right corner, a small ..." style placement |
| Sequence is 4 frames but only adds 2 things visibly | Plan had non-visual additions ("explain the concept further") | Each step must be a visible change |

## Cost Estimate

| Frames | Model | Credits per run |
|---|---|---|
| 4 | nano_banana_2 | ~48 |
| 4 | flux_kontext | ~32 |
| 6 | nano_banana_2 | ~72 |

Cost preflight when total estimate exceeds 50 credits (default rule). Tell the user the cost before generating.

## When NOT To Use Progressive Disclosure

- **Single concept that doesn't decompose.** If the visual is "one folder with a label," don't pad it into 4 steps. Use single mode.
- **Conceptually distinct visuals.** If you have 4 different topics to illustrate, that's 4 single-mode calls, not one progressive sequence. Progressive disclosure is for ONE concept revealed in stages.
- **Animated motion is needed.** If the user wants actual animation (rotating folder, flowing arrows), the output is a video, not a slide sequence. Different tool.
- **Comparison without buildup.** "Skills vs prompts" with both shown side-by-side is single mode; progressive disclosure would awkwardly add them one at a time.
