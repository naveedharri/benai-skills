# Content Analysis + Concept Extraction

Reference for Phase 2 of infographic generation. This document teaches you how to
deeply analyze content BEFORE designing anything. Skip this step and you will produce
decoration. Do this step well and you will produce communication.

---

## 1. The Four Layers of Content

Every piece of content - a blog post, a podcast transcript, a LinkedIn essay, a talk -
has four layers stacked on top of each other. Your job is to figure out which layer
is strongest and most worth visualizing.

### Layer 1: NARRATIVE - What happened?

Events, timelines, biography, sequences of actions.

Examples:
- "I moved from Vizag to Bangalore."
- "The company went from 3 to 300 employees."
- "First I tried X, then Y, then Z worked."

Why this is almost NEVER the right layer to visualize:
- Produces "story recap" infographics that feel like illustrated book reports
- Nobody scrolling LinkedIn wants a timeline of someone's life
- They want the MEANING behind the events, not the events themselves
- Narrative-based infographics read like "and then... and then... and then..."
- They inform without provoking any reaction

### Layer 2: THEMES - What is it about?

Abstract topics and patterns. The kind of words you would use to describe the content
in a single breath.

Examples:
- "Growth." "Struggle." "Identity." "Transformation."
- "Resilience in the face of failure."
- "The tension between ambition and peace."

Why this is only slightly better than narrative:
- Themes are too abstract to produce specific visuals
- They lead to generic visual metaphors everyone has seen a thousand times:
  mountain for "growth," butterfly for "transformation," lightbulb for "ideas"
- These metaphors are so overused they are invisible
- A viewer sees a mountain and thinks "stock image," not "insight"
- Themes tell you what neighborhood the content lives in, but not its address

### Layer 3: CLAIMS - What does it SAY is true about the world?

Universal truths, philosophical statements, hard-won insights the content asserts.
These are sentences that make a stranger stop and think "that is exactly right."

Examples:
- "When the suffering is something you chose, you can work with it. When it is
  something that happened to you, it just eats you."
- "The fear of picking wrong is worse than the exhaustion of doing all of it badly."
- "Nobody told me I could not go this fast. So I did not know I was not supposed to."
- "Your taste grows faster than your skill. That gap is where self-doubt lives."
- "The people who say 'just be yourself' are usually the ones who got lucky being
  themselves in the right room."

This is where editorial illustrations live. Claims are specific enough to visualize
as a scene, and universal enough that viewers recognize their own lives in them.
A good claim creates a flash of recognition - the viewer feels SEEN.

### Layer 4: INFORMATION - What concrete data, comparisons, or frameworks exist?

Numbers, scorecards, before/after comparisons, checklists, step-by-step frameworks,
structured data that can be transmitted as facts.

Examples:
- "Developer: 2 advantages (code, architecture), 4 gaps. Domain Expert: 6 advantages,
  0 gaps."
- "3-item menu vs. infinite options: decision fatigue drops 70%."
- "Before automation: 3 hours/day on email. After: 20 minutes."
- "The 4 quadrants of delegation: Urgent+Important, Urgent+Not, Not Urgent+Important,
  Not Urgent+Not Important."
- "Step 1: Know the Problem. Step 2: Prompt the Solution. Step 3: Ship It."

This is where information graphics live. The goal is to transmit facts clearly, not
to provoke an emotional reaction. The viewer should LEARN something in two seconds.

---

## 2. Which Layer to Visualize

Use this decision table to pick the right layer and output mode:

| If the viewer should...                                  | Visualize this layer | Output mode            |
|----------------------------------------------------------|----------------------|------------------------|
| FEEL something (recognition, discomfort, inspiration)    | Layer 3: Claims      | Editorial Illustration |
| LEARN something (fact, framework, comparison)            | Layer 4: Information | Information Graphic    |
| Both feel and learn                                      | Layer 3 + Layer 4    | Hybrid                 |

The key question that changes everything:

**Never ask "what should we visualize?"** That question leads to decoration -
pretty pictures that restate the content without adding anything.

**Instead ask: "What should the viewer KNOW or FEEL after 2 seconds?"**

If the answer is an emotion (recognition, discomfort, awe, motivation), go to Layer 3.
If the answer is a fact (a number, a comparison, a framework), go to Layer 4.
If the answer is both, build a hybrid that anchors emotion with data.

---

## 3. Identifying Layers in Real Content

Before extracting concepts, run a quick diagnostic on the content. Rate each layer
and let the ratings guide your path.

Template:

```
LAYER 1 (Narrative): [Weak/Moderate/Strong]. [Brief description].
LAYER 2 (Themes): [Weak/Moderate/Strong]. [Brief description].
LAYER 3 (Claims): [Weak/Moderate/Strong]. [Brief description].
LAYER 4 (Information): [Weak/Moderate/Strong]. [Brief description].
> Recommendation: Layer [N], [Output Mode].
```

Example analysis:

```
LAYER 1 (Narrative): Weak. Personal timeline of career moves - not visualizable.
LAYER 2 (Themes): Moderate. "Persistence" and "identity" - too generic for visuals.
LAYER 3 (Claims): STRONG. "Chosen pain vs. inherited pain" - universal, visceral, cinematic.
LAYER 4 (Information): Weak. No concrete data, frameworks, or comparisons.
> Recommendation: Layer 3, Editorial Illustration.
```

Be honest about which layers are strong and which are weak. Do not force strength
where it does not exist. Sometimes content is rich at Layer 4 but empty at Layer 3,
or vice versa. The analysis reveals which path produces the best visual - trust it.

### Auto-Intent Detection

The layer analysis determines the output mode. Do NOT ask the user to choose
between "feel something" and "learn something." The content tells you.

| Layer Analysis Result | Auto-Decision | Reasoning |
|---|---|---|
| Layer 3 Strong, Layer 4 Weak | Editorial Illustration | Content has claims but no data. Visualize the feeling. |
| Layer 4 Strong, Layer 3 Weak | Information Graphic | Content has data but no philosophical claims. Visualize the facts. |
| Both Strong, Layer 4 >= Layer 3 | Data-led Hybrid | Both available. Infographic with an emotional headline. |
| Both Strong, Layer 3 > Layer 4 | Editorial-led Hybrid | Both available. Scene with a data anchor. |
| Both Layer 3 and Layer 4 Weak | ASK THE USER | Content is unclear. This is the only case where you ask for intent. |

#### Hybrid Sub-Modes

When both layers are strong, pick the sub-mode based on which is STRONGER:

- **Data-led Hybrid:** Produces an Information Graphic (BenAI brand system, cards,
  data structures) with a Layer 3 claim as the emotionally resonant headline. The
  infographic IS the output. The claim provides the hook. This is the DEFAULT when
  layers are equally strong, because most LinkedIn content benefits more from a
  clear infographic with a strong headline than from an artistic scene.

- **Editorial-led Hybrid:** Produces an Editorial Illustration (cinematic scene,
  artistic style) with a small data overlay anchoring the emotion. The scene IS
  the output. The data provides credibility.

State the decision inline with the analysis, including the sub-mode. Example:
> "Your content is strong at both layers, but the concrete framework is the real
> asset. I'll create a data-led hybrid -- a clean infographic with your
> philosophical claim as the headline."

If the user disagrees, they can override at any point by saying so in free text.
The auto-decision is a recommendation, not a lock.

If neither layer is strong, go back to the content and look harder. There is
almost always a Layer 3 claim hiding inside a Layer 1 narrative - you just have
to dig for it.

---

## 4. Concept Extraction: Claims

When the analysis points to Layer 3, extract the philosophical claims. Each concept
must be presented as a one-sentence TRUTH STATEMENT, not a topic label.

### The difference between topic labels and truth statements

BAD (topic labels - too vague to visualize):
- "The journey from small town to big city"
- "Overcoming failure"
- "Finding your own path"
- "The importance of mentorship"
- "Work-life balance"

These are Layer 2 themes disguised as concepts. You cannot draw a scene from
"overcoming failure." It is too abstract. It could mean anything.

GOOD (truth statements - specific enough to become a scene):
- "When the suffering is something you chose, you can work with it. When it is
  something that happened to you, it just eats you."
- "The fear of picking wrong is worse than the exhaustion of doing all of it badly."
- "Nobody told me I could not go this fast. So I did not know I was not supposed to."
- "Your taste grows faster than your skill. That gap is where self-doubt lives."
- "Asking for permission is how ambition learns to wait in line."

Each of these can become a visual scene. "Chosen pain vs. inherited pain" could be
two figures - one carrying a weight they picked up, one crushed by a weight that
fell on them. The scene writes itself because the claim is specific.

### Rules for extracting claims

- Extract 5 or more concepts, never fewer than 5
- Each must be a universal truth that a stranger would recognize in their own life
- If you read it and think "that is exactly right," it is a good claim
- If you read it and think "sure, I guess," it is a theme pretending to be a claim
- If you cannot find 5 strong claims, the content may be better suited for Layer 4
- Do not invent claims that are not in the content - extract, do not fabricate

---

## 5. Concept Extraction: Information Structures

When the analysis points to Layer 4, extract the data shapes. Each concept must be
presented as a DATA SHAPE with concrete values, not an abstract topic.

### The difference between abstract topics and data shapes

BAD (abstract topics - no concrete data to visualize):
- "Domain experts vs. developers"
- "Steps to build with AI"
- "The benefits of automation"

These give you a category but no content. You cannot draw "the benefits of automation"
because there is nothing specific to draw. What benefits? How much? Compared to what?

GOOD (data shapes - concrete values with suggested visual forms):
- "Developer: 2 advantages (code, architecture), 4 gaps (business problem, copy,
  context, prompting). Domain Expert: 6 advantages, 0 gaps. Visual: side-by-side
  scorecard where green checks vs. red X marks make the winner obvious."
- "3-step framework: Know the Problem > Prompt the Solution > Ship It. Visual:
  vertical flow with numbered steps and brief descriptions at each stage."
- "Before automation: 3 hours/day on email. After: 20 minutes. Visual: side-by-side
  time bars with dramatic size difference that makes the savings visceral."
- "4 quadrants: Urgent+Important (do first), Urgent+Not Important (delegate),
  Not Urgent+Important (schedule), Not Urgent+Not Important (eliminate). Visual:
  2x2 grid with color coding from red to green."
- "Adoption curve: 2% innovators, 14% early adopters, 34% early majority, 34%
  late majority, 16% laggards. Visual: bell curve with labeled segments."

Each data shape includes WHAT the data is and HOW it could look visually. The
visual suggestion is not final - it is a starting point for the design phase.

### Rules for extracting information structures

- Extract 5 or more concepts, never fewer than 5
- Each must include the concrete data AND a suggested visual shape
- Name specific numbers, categories, steps, or comparisons from the content
- If the content says "many benefits," find the actual benefits and count them
- If you cannot find 5 strong data structures, the content may be better suited
  for Layer 3 (Claims)
- Do not invent data that is not in the content - extract, do not fabricate

---

## 6. Quick Reference

Cheat sheet for fast decisions:

- **Layer 1 (Narrative):** What happened? - NEVER visualize this directly
- **Layer 2 (Themes):** What is it about? - Avoid, leads to generic metaphors
- **Layer 3 (Claims):** What is TRUE about the world? - Editorial Illustrations
- **Layer 4 (Information):** What concrete data exists? - Information Graphics
- Always extract 5+ concepts, never fewer
- Present claims as truth statements, not topic labels
- Present data as shapes with suggested visuals, not abstract topics
- The question that changes everything: "What should the viewer KNOW or FEEL after 2 seconds?"
- If Layer 3 is strong, go editorial. If Layer 4 is strong, go informational. If both, go hybrid.
- Be honest about layer strength. Do not force a weak layer into the lead role.
- Trust the analysis. It will tell you the right path if you let it.
