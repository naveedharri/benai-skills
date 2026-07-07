# Quality Checklist

Reference for Phase 4 (Validation Gate) and Phase 7 (Review and Iterate). Covers pre-design validation, post-generation checks, diagnostic questions, and common mistakes.

---

## 1. The 2-Second Test: Pre-Design Gate

**CRITICAL: This is a PRE-DESIGN validation tool. Apply it BEFORE writing any prompt, not after generating an image.**

**This is an INTERNAL quality gate.** The AI performs this test silently. Do NOT present the 2-second statement to the user for approval. The user already approved the concept and approach -- the 2-second test validates that the AI's execution plan is clear, not that the user agrees with it.

Before designing, answer this question:

> "A person scrolling LinkedIn sees this image for exactly 2 seconds. What do they GET?"

Write the answer in ONE sentence:

**For Editorial Illustration:**
"They feel [specific emotion] and stop scrolling because [specific reason]."

Example: "They feel a jolt of recognition - they've been in both rooms - and stop because the image names something they've been living but couldn't articulate."

**For Information Graphic:**
"They learn [specific fact] and think 'I should save this.'"

Example: "They learn that domain experts have 6 advantages over developers in the AI era, and think 'I should save this comparison.'"

**If you cannot write this sentence clearly, the concept is NOT ready.** Go back and ask the user to pick a different visualization approach. Do NOT proceed to prompt writing. This is a gate, not a suggestion.

The 2-second test catches the #1 cause of bad infographics: unclear concepts that no amount of visual polish can fix. A muddled concept produces a muddled image every single time, regardless of how sophisticated the prompt is. Validate first, design second.

---

## 2. The 2-Second Test: Post-Generation Validation

After generating the image, the 2-second test becomes a validation check.

Look at the generated image and ask:

> "Does it deliver what I promised in the pre-design 2-second statement?"

**If yes:** Proceed to fine-tuning edits.

**If no:** Ask the DIAGNOSTIC question - "Is the concept wrong, or is the execution wrong?"

- **Concept wrong** (the scene or data doesn't communicate the right thing): Go back to Phase 3 (Visualization Design). Do NOT try to fix a broken concept with edits. No amount of editing saves a concept that doesn't transmit.

- **Execution wrong** (right idea but the rendering doesn't land): Iterate with edits. Adjust colors, text size, spacing, composition. The idea is right, the image just needs tuning.

This distinction prevents the most common iteration trap: spending 5+ rounds polishing a visual that was never going to work.

---

## 3. The Squint Test

Blur your vision or squint at the design. You should still see:

1. **Clear structure:** Distinct regions or sections
2. **A focal point:** One area that draws the eye
3. **Breathing room:** Space between major elements
4. **Hierarchy:** Some elements obviously more prominent than others

If the design looks like a blob when you squint, it's too cluttered. If everything blends together, there's no hierarchy.

**How to fix:**

- Increase spacing between elements
- Make the main element significantly larger than supporting elements
- Remove one element (the one that contributes least)
- Adjust colors so primary and secondary elements are more distinct

---

## 4. The So-What Test

Go through each element in the design and ask: "Does this help communicate the key message?"

**Systematically check:**

- The title: does it state or support the key message?
- Each card or section: does it directly relate to the key message?
- Each piece of text: does it advance understanding?
- Each visual element: does it clarify or just decorate?

If the answer is "not really" for any element, remove it. Every element must earn its place.

**How to fix:**

- Cut any element that fails the test
- Replace decorative elements with meaningful ones
- Consolidate similar elements to reduce count
- Ask "would this be clearer without this?" for each element

---

## 5. The Brand Gut Check (Information Graphics Only)

This is the subjective check. Look at the infographic and ask:

1. Does this feel like it belongs on the BenAI website? Visual consistency: warm colors, clean layout, hard shadows.
2. Is it warm, clean, and confident? Not cold. Not cluttered. Not tentative.
3. Would Ben proudly share this? Personal and quality, not template-generated.
4. Does it feel like advice from a knowledgeable friend? Not corporate content.

Trust your instincts. If something feels "off," it probably is. That nagging feeling is usually a signal that one of the checks above would fail if you ran it explicitly.

This check only applies to Information Graphics (which use the brand system). Editorial Illustrations follow their own discovered style and are not bound to brand colors or layout conventions.

---

## 6. Diagnostic Questions for Iteration

### The Primary Diagnostic

After showing the generated image, ask:

> "Looking at this for 2 seconds as a stranger - what do you GET?"

Four possible answers with branching:

1. **"The right thing - it hits"** - The message lands. Ask about specific tweaks, apply edits.
2. **"Right direction, wrong execution"** - Concept works, rendering doesn't. Drill into WHAT isn't working (see specific feedback below). Apply edits.
3. **"The wrong thing"** - Concept is broken. Go back to Phase 3. Do NOT try to fix with edits.
4. **"Nothing - it's not clear"** - Concept is broken. Go back to Phase 3. Do NOT try to fix with edits.

Answers 3 and 4 both route back to Phase 3. This is intentional. The instinct is to try harder with edits, but a concept that doesn't communicate cannot be rescued through iteration. Restart the visualization design.

### Specific Feedback (for "right direction, wrong execution")

Drill into what's not working with multiSelect options:

- "Doesn't look like pain/joy/etc" - emotional register is wrong
- "Too cramped / needs whitespace" - elements too close together
- "Text issues" - wording, size, placement, readability, typos
- "Style is off" - visual language doesn't match what was described

Get specifics on each selected issue before editing. Vague feedback like "make it better" leads to random changes. Pin down exactly what is wrong, then address each issue in a targeted edit.

---

## 7. Common Mistakes

### The Text Dump

**What it looks like:** Paragraphs crammed into boxes. The viewer has to read, not scan.

**Why it happens:** Tried to fit an entire article into one image. Didn't commit to one key message.

**Fix:** Pick ONE insight. Just one. Visualize that. The rest goes in the post caption. Remember: if it's a text dump, it's not an infographic. It's just an image of text.

### The Rainbow Explosion

**What it looks like:** Every element is a different color. Colors outside the brand palette.

**Why it happens:** Thought the design looked "boring" and added more colors.

**Fix:** Stick to accent cycle (green, yellow, blue, pink) plus cream background and dark text. If you need more colors, you have too many elements.

### The Template Trap

**What it looks like:** Decoration for decoration's sake. Borders within borders. Gradients. Decorative shapes. Multiple font styles.

**Why it happens:** Wanted it to look "designed" and kept adding embellishments.

**Fix:** Strip away anything that doesn't serve the message. Our brand is defined by what we don't include. Every border, shadow, and flourish should justify its existence.

### The Black Hole

**What it looks like:** Dark gray or black background with light text.

**Why it happens:** Thought dark backgrounds look "sleek" or "modern."

**Fix:** Always warm cream (#FAF3E3). No exceptions. Dark backgrounds are fundamentally at odds with the warm, approachable brand. This is a hard rule, not a preference.

### The Kitchen Sink

**What it looks like:** Covers everything. Multiple concepts. Every supporting point. All exceptions and caveats.

**Why it happens:** Didn't want to leave anything out. Fear of oversimplifying.

**Fix:** Pick one thing. A series of focused infographics beats one overloaded one. The post caption handles nuance and caveats - the image handles the hook.

### The Floating Elements

**What it looks like:** Elements scattered without alignment or visual connection. Cards, icons, and text placed without spatial logic.

**Why it happens:** Elements added one at a time without considering overall composition. Each element was positioned independently rather than as part of a system.

**Fix:** Establish alignment. Use a grid. Elements should relate visually: aligned edges, consistent spacing, grouped by relevance. If two things are related, they should be near each other. If they aren't related, the space between them should make that clear.
