# Variation Ideation

How to brainstorm N distinct creative angles for a batch of thumbnails, then build N prompts that share an identical Ben portion and differ only in scene + supporting visual.

## Why This Exists

If the user asks for 4 thumbnails on "Skills," they don't want 4 reshuffles of the same coral-folder-with-arrow composition. They want 4 different conceptual hooks competing for the CTR slot. The right output is creative variety on TOP of a locked brand system, not random seed variation under the same prompt.

This is also the difference between calling `generate_image` once with `count: 4` (which produces near-duplicates, randomized only by seed) and calling it 4 times with `count: 1` and 4 distinct prompts (which produces 4 genuinely different concepts).

## When To Use

Every time `count > 1` AND the user wants variation, not duplicates. That's the default for any thumbnail batch.

If the user explicitly says "give me 3 slight tweaks of the same thumbnail," THEN use one call with `count: 3` (or 3 `flux_kontext` edits of the same source). Otherwise: ideate first.

## The Ideation Step (between flow Step 4 and Step 6)

After loading the style spec, brainstorm N angles for the concept. Each angle answers: "If I had to make ONE thumbnail for this topic, what hook would I use?" Then pick N different answers.

Show the user the angles in chat in a compact list BEFORE generating, so they can intervene if one is off. Format:

```
Ideating 4 angles for "Skills":

1. SKILLS UNLOCKED — single salmon folder, white padlock snapped open on top, warm glow leaking out. Hook: skills unlock model capabilities that prompting can't.
2. REPLACE YOUR TEAM — three folders fanned in a stack labeled /DESIGNER, /WRITER, /RESEARCHER. Provocative claim, plays on the "1 skill = 1 specialist" framing.
3. BUILD ONE IN 5 MIN — salmon folder paired with a circular countdown ring at 5:00. The accessibility / speed angle: anyone can ship one.
4. STOP PROMPTING — the word PROMPTING struck through, grey chat-bubble with a red X on the left, glowing salmon folder rising on the right. Paradigm-shift hook: skills replace prompting.

Generating now.
```

Then make 4 separate `generate_image` calls, one per angle, each with `count: 1`. Don't wait for user approval unless they raised a concern; this is "show your work" not "ask permission."

## Angle Categories To Pull From

When brainstorming, rotate through these hook types so the 4 angles cover different psychological levers:

| Hook type | Question it answers | Example for "Skills" |
|---|---|---|
| Direct value | What do I get from this? | SKILLS UNLOCKED |
| Provocative claim | What does this kill or replace? | REPLACE YOUR TEAM, STOP PROMPTING |
| Accessibility | How fast or easy is this? | BUILD ONE IN 5 MIN |
| Curiosity gap | What don't I know yet? | "INSIDE A WORKING SKILL" |
| Authority | Why should I trust this? | "I SHIPPED 12 OF THESE" |
| Contrast / before-after | What changes when I try this? | "BEFORE SKILLS vs AFTER" |
| Tier or count | What are the levels? | "7 LEVELS OF SKILL DEPTH" |
| Comparison | How does this stack up? | "SKILLS vs PROMPTS" |

For a batch of 4, pick 4 categories. Don't double up. For a batch of 3, pick 3. For a single variant, the user picks the angle or you default to "direct value."

## Locking Ben Across Variants

When Ben is in the frame, his portion of every variant's prompt is IDENTICAL. Write block 2 once, paste it into all N prompts unchanged.

Locked elements:
- Framing: same third (right third by default)
- Expression: same (slight smile by default)
- Wardrobe: plain black t-shirt
- Camera angle: chest-up, eyes to camera
- Lighting on Ben: same key / fill / rim language

The reference photo (`medias[0]`) is the same for every call. nano_banana_2 will produce near-identical Ben renderings across the 4 variants, so what changes is the world AROUND Ben, not Ben.

If the user says "show different expressions across the variants," that's an explicit override. Note it; lift the lock for this batch only.

## What Changes Between Variants

Only these:

1. **Headline** in any rendered text or wordmark (different per angle)
2. **Supporting visual** in the left third (folder, app icon, UI mockup, padlock, countdown ring, etc. — different metaphor per angle)
3. **Background secondary motif** if any (e.g., glow, dot-grid intensity, color panel)
4. **Mood adjective** in the style block (e.g., "urgent" for STOP PROMPTING, "celebratory" for SKILLS UNLOCKED)

What stays the same: Ben's portion, the dominant palette, the dot-grid texture, the layout grid (left third for content, right third for Ben), the hand-drawn arrow signature, the negatives block.

## Worked Example: 4 Variants for "Skills"

**Concept:** Claude Code Skills, why they matter

**Visual references read in Step 0:** existing published thumbnails from `Intelligence/youtube-intelligence/thumbnails-2026-02-to-2026-05/` (charcoal background with dot-grid, coral folders, white hand-drawn arrows, Ben right-third chest-up with slight smile, black t-shirt).

**Locked Subject block (used in all 4 prompts):**
> Ben in a chest-up shot on the right third of the frame, expression: slight smile with corners up and no teeth visible, eyes engaged to camera, wearing a plain black t-shirt, soft front-left key light with gentle rim separating him from the dark background. The subject must match the provided reference image (medias[0]) exactly; same person, same face shape, same hair, same general age, same expression and pose across every variant.

**Ideated angles:**

| # | Headline | Supporting visual | Hook category |
|---|---|---|---|
| 1 | SKILLS UNLOCKED | single coral folder with a white padlock snapped open on top, warm glow leaking out | Direct value |
| 2 | REPLACE YOUR TEAM | three coral folders fanned in a stack labeled /DESIGNER, /WRITER, /RESEARCHER | Provocative claim |
| 3 | BUILD ONE IN 5 MIN | coral folder paired with a circular countdown ring at 5:00 | Accessibility |
| 4 | STOP PROMPTING | the word PROMPTING struck through, grey chat-bubble with a red X on the left, glowing coral folder rising on the right | Paradigm shift |

**Per-variant prompt (only blocks 1 and 3 differ; blocks 2 and 4 identical):**

```
v1 PROMPT:
[1] A clean deep-charcoal #1F1F1F background with subtle dot-grid texture, a single coral #E97B5D file folder in the center-left of the frame with a white padlock icon snapped open on top of it, a warm orange glow leaking out from inside the folder. Top-left text reads "SKILLS UNLOCKED" in bold uppercase white sans-serif, 2 lines. One white hand-drawn curved arrow arcing from the headline down to the folder.

[2] {locked subject block as above}

[3] Charcoal background with dot-grid, coral accent on folder and padlock glow, white text and arrow, flat-stylized supporting visuals (folder, padlock, arrow) NOT photoreal, Ben photoreal. Mood: confident, revelatory.

[4] {locked negatives}
```

(Repeat with blocks 1+3 swapped per angle for v2, v3, v4.)

## Failure Modes

| Symptom | Cause | Fix |
|---|---|---|
| All 4 variants look the same | Used one `generate_image` call with `count: 4` | Switch to N separate calls with `count: 1` each, distinct prompts |
| Ben's face changes across variants | Ben's portion of the prompt drifted between calls, OR the reference photo wasn't passed to every call | Lock block 2 verbatim; pass `medias[0]` to every call |
| Variants feel forced or random | Ideation step was skipped; angles weren't chosen deliberately | Run the ideation list in chat first, then generate |
| User wanted slight tweaks, got 4 different concepts | Misread the intent | Ask: "Do you want 4 distinct concepts or 4 tweaks of one composition?" Default to distinct concepts |

## Cost Note

N separate calls with `count: 1` cost the same as one call with `count: N` (per-variant pricing). No financial penalty for the ideation pattern; the only cost is a few extra seconds of orchestration.
