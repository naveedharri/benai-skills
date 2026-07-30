# Render pipeline

Two interchangeable render backends, then the same code footer and PDF assembly.

Paths assume a working directory `$W` outside the OS, with `$W/slides` and `$W/final`, and the skill directory `$SK`.

**Every brand value in this file is a placeholder in angle brackets.** Resolve each one from `Context/brand/brand-kit.md` or `Context/config.md` in Step 1 and substitute it. There is no hex, no font name and no workspace id written literally here, and that is deliberate: a literal value in a skill file is the duplication this skill exists to remove.

## Tokens to resolve before rendering

| Placeholder | Read from |
| --- | --- |
| `<BG>` | the audience-facing background colour in the brand kit |
| `<INK>` | the primary text colour |
| `<HIGHLIGHT>` | the single accent used for the marker swipe |
| `<HEAD_FACE>` | the heading typeface named in the brand kit's typography block |
| `<BODY_FACE>` | the body typeface |
| `<STYLE_NOTE>` | the brand kit's visual style line, for example flat vector, hard edges, no gradients |
| `<BG_RULE>` | the brand kit's background rule, honoured at the scope it is written |
| `<LOGO_PATH>` | the brand kit's pointer to the real mark file |
| `<PORTRAIT_PATH>` | the brand kit's portrait pointer, if it names one |
| `<NAME>` | `operator_name` in `Context/config.md` |
| `<HANDLE>` | `org_name` in `Context/config.md` |
| `<WORKSPACE_ID>` | the Higgsfield workspace id in `Context/config.md`, under the connectors block |

If the config does not carry a workspace id, ask for it once and offer to record it in `Context/config.md`, because a routine running this later cannot answer a question.

## Backend A: the Higgsfield connector

Use this when running on Claude or from a routine. The connector exposes `generate_image`.

| Parameter | Value |
| --- | --- |
| `model` | `gpt_image_2` |
| `params.aspect_ratio` | `3:4` |
| `params.resolution` | `2k` |
| `params.quality` | `high` |
| `params.get_cost` | `true` to preflight the credit cost without generating |

One call per slide, because each slide is a different prompt.

**Reference image for the cover slide.** Pass it as `medias: [{ value: <media_id>, role: "image" }]`. Get the `media_id` by uploading first: `media_upload` returns a presigned URL, PUT the bytes, then `media_confirm`. Use `media_import_url` if the file is reachable over HTTPS. **Never pass a raw URL in `medias[].value`.**

Collect with `show_generations` or `job_display <id>`, and download each result to `$W/slides/slide-0N.png`.

**Preflight the cost on the first slide and report it** before rendering the rest. The approval gate in Step 4 is about spending credits, so the operator should know what the run costs.

## Backend B: the Higgsfield CLI

Use this locally on an authenticated machine.

```bash
command -v higgsfield || curl -fsSL https://raw.githubusercontent.com/higgsfield-ai/cli/main/install.sh | sh
higgsfield workspace set <WORKSPACE_ID>

# Submit WITHOUT --wait, because the shell caps at about two minutes. Capture the job id, then poll.
higgsfield generate create gpt_image_2 --prompt "$(cat prompt.txt)" \
  --aspect_ratio 3:4 --resolution 2k --quality high --json
# the cover slide adds: --image "<PORTRAIT_PATH>"

higgsfield generate wait <JOB_ID> --json    # returns .result_url, curl it to $W/slides/slide-0N.png
```

CLI auth is interactive OAuth with the token in the OS keychain and it refreshes itself. Concurrency depends on the plan, commonly four jobs, so batch accordingly.

## The slide prompt

Every prompt is this block plus that slide's copy. Substitute the tokens from the table above.

```
Vertical 3:4 social media carousel slide, editorial typographic poster design.
Background: full-bleed <BG>, no border, no frame.
Layout in the UPPER portion, left-aligned, generous margins with negative space:
1. Small eyebrow in UPPERCASE letter-spaced sans-serif, NOT cursive, NOT script, NOT
   handwriting, in <INK>: <EYEBROW>
2. Large bold geometric sans-serif headline in the style of <HEAD_FACE>, colour <INK>,
   tight line spacing: <HEADLINE>. The phrase "<HIGHLIGHT_PHRASE>" sits on a soft
   <HIGHLIGHT> rounded-rectangle highlight like a marker swipe. Only that phrase is
   highlighted.
3. <BODY: one or two fragment lines, OR a tight numbered or bulleted list on substance
   slides, each item on its own line>, clean medium sans-serif in the style of
   <BODY_FACE>.
<ARROW: in the lower right, above the empty bottom strip, a small dashed <HIGHLIGHT>
   right-pointing swipe arrow. Omit on the final slide.>
Leave the entire bottom 12% of the image as empty plain <BG>. Do NOT draw any footer,
bar, name, logo, avatar, page number, or watermark.
Style: <STYLE_NOTE>. Premium minimal editorial, crisp typography, no cursive or script
anywhere, no texture noise. Render every piece of specified text exactly, spelled
correctly.
```

Two per-slide variations:

- **The cover slide**, when the brand kit names a portrait: add "composite the person from the reference image, chest up, no background, lower right" and pass the portrait as the reference media.
- **Substance slides**: make item 3 an explicit numbered or bulleted list, and keep each line short. Misspelling risk rises with line length.

**The bottom twelve percent instruction is not optional.** The footer is composited afterwards, and a model-drawn footer underneath a real one is the single most common way a run produces unusable slides.

## Footer, then PDF

Same for both backends.

```bash
MOSC_LOGO="<LOGO_PATH>" \
MOSC_PORTRAIT="<PORTRAIT_PATH>" \
MOSC_NAME="<NAME>" MOSC_HANDLE="<HANDLE>" \
MOSC_CREAM="<BG>" MOSC_BAR="<INK>" \
python3 "$SK/scripts/footer.py" "$W/slides/slide-0N.png" N TOTAL "$W/final/slide-0N.png"
```

Omit `MOSC_PORTRAIT` entirely when the brand kit names no portrait. The script then skips the avatar disc and shifts the name left, which is correct rather than degraded.

Set `MOSC_FONT_BOLD` and `MOSC_FONT_MONO` when the brand kit names typeface files, so the footer matches the slides exactly. Without them the script walks a system fallback ladder.

Assemble in order:

```bash
magick "$W"/final/slide-0[1-9].png "$W/<slug>.pdf"
# portable alternative, no ImageMagick:
python3 -c "import img2pdf,glob; open('$W/<slug>.pdf','wb').write(img2pdf.convert(sorted(glob.glob('$W/final/slide-*.png'))))"
```

`footer.py` needs Pillow. If it is missing, say the one install command and stop rather than skipping the footer.

## QA and the known failure modes

**QA every slide before assembling.** Read the PNG back. Confirm every word is spelled correctly and exactly one phrase carries the highlight. Re-render anything garbled.

| Failure | Cause | Fix |
| --- | --- | --- |
| Garbled or misspelled text | Long lines, especially in bullets | Shorten the line and re-render that slide only |
| Two highlighted phrases | The prompt named more than one | One phrase per headline, restate it in the prompt |
| A model-drawn footer or watermark | The bottom-strip instruction was dropped | Re-render with the instruction restored |
| Cursive or script type | The negative instruction was softened | Keep all three negations: not cursive, not script, not handwriting |
| A wrong or absent mark | `MOSC_LOGO` unresolved | The script exits with the reason. Resolve the brand kit pointer |
| Slides that do not stack | Mixed aspect ratios across calls | All slides at 3:4, no exceptions |

## Platform sizing

Slides render at 3:4. A document-carousel surface takes them as-is. For a surface capped at 4:5, pad the top and bottom in `<BG>` rather than re-rendering, and never crop into the footer bar.
