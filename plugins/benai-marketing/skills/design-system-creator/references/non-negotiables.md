# Non-negotiables: the reasoning

These aren't arbitrary rules. Each one exists because skipping it makes the system produce the same generic SaaS-brand output that every LLM-assisted design tool converges toward. Following them is what makes the final system feel *disciplined* rather than *assembled*.

When you generate the system, apply these. When you advise the user, reference them. If a user request conflicts with one, push back with the reasoning below and propose the on-brand alternative.

## Contents

1. One primary color
2. One typeface family
3. One canvas choice
4. Sentence case for all headlines
5. No hype vocabulary, anywhere public
6. Voice rules
7. Imagery direction
8. Motion is minimal
9. No gradients-over-everything, no glassmorphism, no 3D, no neumorphism
10. Every claim gets a number or a name
- How to enforce these while generating

---

## 1. One primary color

**The rule:** Pick one confident hue. No "palette" of three equal-weight primaries. Everything else is shades of ink (text), a warm or cool neutral (background), and semantic feedback colors (success/warn/danger).

**Why:** Brands with two or three "primary" colors are brands that lost a meeting. You end up using the wrong one in half your assets. The most recognizable brands in the world (Stripe, Linear, Notion, Netflix, Coca-Cola) have exactly one color anyone can name.

**How to apply:** In `tokens/tokens.json`, `color.brand.600` is *the* primary. Derive 50/100/200/…/900 steps from it mechanically. All other colors in the system are either ink, neutral, or semantic.

---

## 2. One typeface family

**The rule:** Sans-serif, one family. Inter is the safe default (free, universal, legible). A distinctive display face (Söhne, GT Walsheim, Graphik, gtAmerica) is allowed if the user has a license and wants differentiation, paired with Inter for UI body. Never two display faces.

**Why:** Typography variety reads as indecision. A single-family system reads as disciplined. The distinctiveness is supposed to come from voice, color, and layout, not from a parade of fonts.

**How to apply:** In `typography.md`, specify one family. Scale is handled by size + weight, not by introducing secondary faces.

---

## 3. One canvas choice

**The rule:** Either warm off-white (e.g., `#FBFAF7`) or pure white. Pick one for marketing surfaces and commit. Product UI can use pure white regardless.

**Why:** Pure white screens read as clinical and subtly adversarial: they push the reader into "I'm being pitched" mode. Warm off-white (~5% warmer than pure white) lowers the aggression of the page and feels like a conversation. The choice matters because the difference is 5% of the aesthetic but 50% of the emotional register.

**How to apply:** Set `paper` in tokens to one value. Use `surface` (pure white) for cards inside paper. The small step between `paper` and `surface` is what gives cards their lift without needing shadows.

---

## 4. Sentence case for all headlines

**The rule:** "How it works," not "How It Works." "Why Lantern," not "WHY LANTERN." Only exception: an overline kicker ≤3 words, which gets `UPPERCASE` with `+0.06em` letter-spacing.

**Why:** Title Case reads as "formal business writing circa 2005." Sentence case reads as "a human wrote this." Every contemporary premium brand (Apple's newer work, Linear, Vercel, Stripe, Figma, Claude) uses sentence case.

**How to apply:** In every template that includes text, use sentence case. Call this out explicitly in `typography.md`.

---

## 5. No hype vocabulary, anywhere public

**The rule:** Banned across every public-facing surface (web, social, ads, email, decks): *revolutionary, game-changing, cutting-edge, next-generation, supercharge, unleash, transform, synergy, seamless, seamlessly, robust, 10x, disrupt, turbocharge, AI-powered (as a bare adjective), leverage (as a verb), best-in-class, industry-leading, end-to-end.*

**Why:** These words are pattern-matched by readers as "generic marketing." They signal that the brand has nothing specific to say. Removing them forces copy to make a specific claim, which is the only kind of claim that converts.

**How to apply:** In `voice.md` list the ban. In `voice/examples.md` show the rewrites. When you review generated copy, grep for these and rewrite.

---

## 6. Voice rules

**The rule:** Second-person singular ("you"), short sentences, name the user's world. The user's world means *their* nouns (chair, shop, appointment, chart, ticket, phone, review), not *ours* (agent, LLM, platform, pipeline, orchestration, solution).

**Why:** Local-business owners, SMB managers, solo operators, teachers, therapists: our audiences all read copy that uses their own vocabulary as a trust signal. Copy that uses industry-insider vocabulary ("agent," "workflow") signals that the brand doesn't understand the reader.

**How to apply:** `foundations/voice.md` codifies it. `foundations/vocabulary.md` lists the specific nouns for the brand's verticals. `voice/examples.md` shows the transformation.

---

## 7. Imagery direction

**The rule:** Real photography of real humans or real spaces, taken with natural light. Never stock photos of "diverse teams around a laptop pointing at a chart." Never AI-generated humans. Never generic "AI" visuals (glowing orbs, neural network meshes, wireframe globes, robot hands, circuit boards).

**Why:** Stock and AI-generated humans are now instantly recognizable as inauthentic. Any modern audience that could afford the brand can also spot stock. The generic "AI" tropes are a tell that the brand couldn't find a real visual: it's the opposite of the trust the brand is trying to earn.

**How to apply:** `foundations/imagery.md` spells it out with specific do/don'ts. If the brand genuinely has no photos, advise the user to spend $300–600 on a half-day local shoot. It produces a year of assets.

---

## 8. Motion is minimal

**The rule:** Fade + small translate (4–8px). 80/160/240/480ms for micro / UI / reveal / page durations. Ease `cubic-bezier(0.22, 1, 0.36, 1)` for most reveals. Honor `prefers-reduced-motion: reduce`.

**Banned:** parallax, scroll-jacking, looping hero video, marquee on the hero, scroll-driven animations that block reading, typewriter effects, shimmer on headlines, confetti, bouncing inputs, "shake on error."

**Why:** Motion grabs attention, which is sometimes useful and usually not. A calm brand is one that doesn't need to shout, and motion is the visual equivalent of shouting. The brands this system targets (premium SaaS, B2B services, local-business services) consistently underperform when they use heavy motion.

**How to apply:** `foundations/motion.md` lists the acceptable patterns. The `animated.tsx` component includes primitives (FadeIn, Stagger, CountUp, Spotlight, QuietMarquee), no others.

---

## 9. No gradients-over-everything, no glassmorphism, no 3D, no neumorphism

**The rule:** No hero backgrounds built from multi-stop gradients. No frosted-glass panels. No 3D renders (isometric rooms, device mockups with perspective-skew, blob people). No neumorphic "soft UI" buttons.

**Why:** Each of these is a dated visual trend that reads as "I tried." The timeless choice is flat, confident use of solid colors and real photography. Every one of these effects ages faster than the brand itself.

**How to apply:** `foundations/imagery.md` and `applications/web.md` call this out. Ad-hoc one-off uses need the user's explicit override.

---

## 10. Every claim gets a number or a name

**The rule:** Copy like "saves time," "boosts productivity," "improves results" is banned. Every outcome stated must include either (a) a number and a timeframe, or (b) a named real customer. "Saves 4 hours a week" or "Cut no-shows by 34% in 8 weeks at Ashley's Salon, Allentown PA."

**Why:** Vague claims are invisible. Specific claims break through. This is the single highest-leverage rule for conversion, and it costs nothing to enforce.

**How to apply:** In `voice/examples.md` show the transformation. Flag any vague copy in the generated output and rewrite before handing back.

---

## How to enforce these while generating

Before writing any file, internalize these 10 rules. When you're tempted to:

- Use three colors because "the brand should have options" → one color, derive shades.
- Mix a display font with Inter "for visual interest" → no; distinctiveness comes from voice.
- Write "Transform your business with AI" → never; rewrite with a specific number.
- Add a gradient hero because the brand "needs energy" → the brand needs *clarity*, not gradients.
- Use a stock photo because the user has no photography → advise them to shoot, or use a tight crop of a real object from their business.

If you catch yourself or the user drifting, return to this list. It's the spine of the system.
