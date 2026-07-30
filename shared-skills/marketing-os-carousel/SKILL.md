---
name: marketing-os-carousel
description: "Build an image-first social carousel from an asset already filed in the Marketing OS, export it as a PDF, and record it back in the OS as a real channel asset. Brand palette, typography, the logo pointer and the never-black-background rule all resolve from Context/brand/brand-kit.md, so the carousel cannot drift from the brand or from the source it repurposes. Source is a filed newsletter edition, a published pillar asset, or a pipeline brief, which means the carousel provably says the same thing the parent said. Renders every slide with Higgsfield, composites the footer in code so the mark and page numbers are always correct, assembles the PDF, then writes the repurposed-channel asset with the PDF as a pointer, updates the parent's repurpose tree and logs. Run from the Marketing OS root. Use when the user says 'build a carousel', 'turn this newsletter into a carousel', 'carousel from the OS', 'repurpose this into slides', or runs /marketing-os-carousel."
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
disable-model-invocation: true
argument-hint: "[source, e.g. a broadcast slug, a published pillar slug, or 'latest newsletter']"
---

# Marketing OS Carousel

One filed asset in, one branded PDF out, and the OS records that the child exists.

**This skill carries no brand of its own.** No palette, no typography, no logo, no example carousel. All of it lives once in `Context/brand/brand-kit.md`, which is the executable design contract, and this skill resolves it there every run. The original carousel skill shipped its own copy of the palette and its own logo file, so a rebrand meant editing a skill folder and the two versions silently disagreed until somebody noticed.

**And it does not guess its source.** The original scanned an inbox for an email somebody described. This one repurposes an asset that is already filed, which is what makes the carousel and its parent provably the same argument.

Run from the OS root. **Stay inside that root.** **Start from zero on identity:** the name on the footer, the handle, the mark and every colour come from the OS. If the OS does not name one, you do not know it, and you stop rather than substituting a plausible value.

## First, check what you have

| State | Do |
| --- | --- |
| No `Context/config.md` | Not a Marketing OS. Point at `marketing-os-setup` and stop |
| No `Context/brand/brand-kit.md` | Stop. There is no brand contract to build against, and inventing one is how brand drift starts |
| Brand kit exists but names no logo file | Stop and ask for the path. The mark is composited by code and must be a real file |
| No source named, `Channels/` populated | Propose sources from the OS, best candidate first |
| Higgsfield not connected | Say so and stop before Step 4. This skill cannot render without an image model |

## Step 1: resolve the brand, once

Read `Context/brand/brand-kit.md` and pull:

| What | Used for |
| --- | --- |
| The audience-facing palette | Slide background, ink, and the single highlight colour |
| The background rule | The brand kit states whether black may be a background on an audience-facing surface. Obey it exactly as scoped |
| Typography | The heading and mono faces, passed to the footer script |
| The logo | Its markup for reference, and the pointer to the real raster the footer needs |
| The portrait pointer | Optional. Only if the brand kit names one |

Read `Context/config.md` for `operator_name` and `org_name`, which are the two strings on the footer bar.

**Use the audience-facing token set, not the data-surface one.** A brand kit may carry two sets on one chassis, one for what an audience sees and one for internal dashboards. A carousel is audience-facing. Never blend them.

**Never hardcode a colour.** If you find yourself typing a hex that is not in the brand kit you have already made the mistake this skill exists to prevent.

## Step 2: resolve the source from the OS

Accept a slug, or propose candidates. Priority order, because it follows the cascade the OS documents:

1. **A filed newsletter edition.** `Channels/{email channel}/broadcasts/YYYY-MM-DD-<slug>.md`. Read the `## Edition` body and the `## The decisions` block. The decisions block is the gift: the angle, the insight and the outcome were already argued out, so the carousel inherits them rather than re-deriving them.
2. **A published pillar asset.** `Channels/{primary}/published/YYYY-MM-DD-<slug>.md`. Read its angle, its snapshot and its `## Repurpose tree`.
3. **A pipeline brief.** `Channels/{channel}/pipeline/<slug>/brief.md`, for something not yet shipped.

**Check the parent's repurpose tree before you build.** If a carousel child already exists, say so and ask whether this is a second angle or a replacement. Building a duplicate silently is how a cascade turns into noise.

Read alongside the source:

| Path | For |
| --- | --- |
| `Context/personal-brand/voice.md` | The master voice register and the banned constructions |
| `Channels/{target channel}/voice.md` | The delta for the surface this posts to |
| `Channels/{target channel}/strategy.md` | The format contract and what this channel receives |
| `Intelligence/research/swipe/hooks.md` | Proven opening shapes for the cover slide |
| `Intelligence/research/swipe/ctas.md` | CTA phrasings and where each routes |
| `Offers/{offer}/offer.md` | The destination for the final slide, and its live facts |
| `Analytics/what-works.md` | What has measured well. Honour what each finding licenses |

## Step 3: find the one point, then plan the slides

**The carousel must make its point on its own.** Assume the caption is one line and nobody clicks through. If the source only teases, reconstruct the real substance from it. If the source carries several ideas, pick the most useful one and say which you dropped.

Slide count 3 to 10, chosen from the content. Typical 5 to 8, and fewer lands harder.

The arc:

- **Slides 1 to 3, high impact.** Cover and hook, the problem, the first turn toward the answer. One large headline, one short highlight, minimal body.
- **Middle slides, substance.** The actual method: a smaller header plus two to four short bullets, numbered steps, or one labelled diagram. One idea per slide. This is what makes it self-contained.
- **Final slide, a CTA that the slides earned.** It routes to an offer named in `Offers/`. Never a CTA that leans on context the slides never gave.

Write the copy in the operator's voice per the register: eyebrow in caps, one headline carrying one argument, exactly one short highlighted phrase, then the body. No em dashes. No buzzwords, no hedges.

## Step 4: approve the copy plan, before spending credits

Present the full slide-by-slide plan as text and stop. Per slide: eyebrow, headline, the highlighted phrase, body or bullets.

Offer at least these and wait:

1. Approve and render
2. Revise named slides
3. Change the slide count
4. Change the CTA framing on the final slide
5. Change which point the carousel makes

**Rendering spends credits, so never render before the plan is approved.** This is the one gate in this skill and it is not optional.

## Step 5: render, then composite the footer

Render each slide with Higgsfield. Every prompt is the shared style block, built from the brand tokens read in Step 1, plus that slide's copy, and every prompt must tell the model to **leave the bottom twelve percent empty in the background colour** because the footer is added by code afterwards. Full call shapes and the style block in `references/render-pipeline.md`.

**Never let the image model draw the logo, the name, or the page numbers.** It cannot spell a name reliably and it cannot reproduce a mark. All three are composited:

```
MOSC_LOGO=<from the brand kit pointer> \
MOSC_PORTRAIT=<from the brand kit pointer, or omit> \
MOSC_NAME=<config operator_name> MOSC_HANDLE=<config org_name> \
MOSC_CREAM=<brand background hex> MOSC_BAR=<brand ink hex> \
python3 scripts/footer.py <in.png> <page> <total> <out.png>
```

The script exits with a one-line reason rather than guessing when any of those is missing. That is deliberate: a wrong mark on every slide is worse than a failed run.

**QA every slide before assembling.** Read each PNG back and confirm the text is spelled correctly and exactly one phrase is highlighted. Re-render anything garbled. Bullet slides fail most often.

Assemble the PDF in order and save the slides and the PDF to a working folder outside the OS. Default `~/Downloads/<slug>-carousel-<YYYYMMDD-HHMM>/`, or wherever the caller says.

## Step 6: write it back into the OS

**No media in the brain.** The OS stores markdown and pointers. The PDF and the PNGs live on disk or in the DAM, and the OS records where.

1. **File the asset.** `Channels/{target channel}/pipeline/<slug>/brief.md` for something not yet posted, or `published/YYYY-MM-DD-<slug>.md` once it is. Frontmatter and body shape in `references/os-contract.md`. It records the slide count, the one point, the CTA destination, the PDF path as a pointer, and the parent as a wikilink.
2. **Update the parent's repurpose tree**, naming this child as a wikilink in a sentence. Do not touch the parent's `## Performance` block.
3. **Log it.** `Intelligence/logs/YYYY-MM-DD.md`, naming the file written and the specific change. This is a hybrid: it produces a deliverable and it changes what the OS knows, so it logs the knowledge change only.

**Never ask permission to save.** Write and report.

**Posting is not your job.** You produce the PDF and record the asset. Publishing is the operator's step or a routine's.

## Hard rules

1. **Every colour, face and rule comes from `Context/brand/brand-kit.md`.** Never a hex typed by hand.
2. **The mark is composited by code**, never drawn by the image model.
3. **The footer avatar sits on a disc in the brand background colour**, never on a black circle.
4. **Obey the brand kit's background rule as it is scoped.** If it forbids black backgrounds on audience-facing surfaces, that includes every slide here.
5. **One highlighted phrase per headline.** No second accent colour.
6. **No em dashes**, and none of the constructions the voice register bans.
7. **Self-contained.** It makes its point without the caption.
8. **No cursive or script anywhere.** Eyebrows are uppercase, letter-spaced, sans.
9. **Never invent proof.** A result, a name or a number comes from `Offers/{offer}/proof/` or `Analytics/metrics.md` with its date, or it does not appear on a slide.
10. **Never write a price on a slide unless you read it from `Offers/{offer}/offer.md` this run.** Prices step on dates and a slide is hard to correct once posted.

## If something you expect is missing

| Missing | Do |
| --- | --- |
| `Context/brand/brand-kit.md` | Stop. This is the one file the skill cannot proceed without |
| The logo pointer or the file it names | Stop and ask for the path |
| The portrait pointer | Continue. The footer skips the avatar and the name shifts left |
| `Channels/{channel}/voice.md` | Continue on the master register alone and say so |
| The swipe files | Continue. Draw shapes from the source and the real published assets instead |
| Higgsfield | Stop before Step 5 with the plan already approved, so the run can resume later |
| Pillow, for the footer script | Say the one install command and stop. Do not skip the footer |

Create only the files this skill owns: the channel asset, the parent's tree line, the log.

## Render a review sheet, only if asked

If the operator wants the copy plan or the finished carousel as a page to circulate, call the **`instant-ui`** skill with the content and an output path. Do not build a page yourself.

## Self-improvement

This skill is never finished. Improve it as you use it.

- When the user corrects a render or footer step, update `references/render-pipeline.md` so the correction sticks.
- When a correction is a hard rule ("always X", "never Y"), add it to the hard rules above.
- **When a brand detail turns out wrong, fix `Context/brand/brand-kit.md`, not this skill.** The brand lives in the OS. A correction landing here instead is exactly the duplication this skill removed.
- **Never start a local examples folder.** Good carousels are recorded as OS assets with a pointer to the PDF. That is the example library.
- Keep the skill small: when you add something, run the deletion test and cut anything that no longer changes behaviour.

## Files

| File | Contains |
| --- | --- |
| `references/os-contract.md` | Every OS path read and written, the channel asset frontmatter and body shape, the log line format |
| `references/render-pipeline.md` | The Higgsfield connector and CLI calls, how the style block is built from brand tokens, footer, PDF assembly, the failure modes |
| `scripts/footer.py` | Code-composited footer. Identity-free: mark, portrait, name, handle and both colours are injected |
| `assets/fonts/mono.ttf` | A mono face for the page numbers, with a system fallback ladder if the brand kit names its own |
