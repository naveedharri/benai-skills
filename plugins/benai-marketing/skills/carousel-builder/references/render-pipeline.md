# Render Pipeline

Two interchangeable render backends, then the same code footer + PDF. Paths assume a working dir `$W` (with `$W/slides` and `$W/final`) and the skill dir `$SK`.

## Backend A: Higgsfield MCP connector (use on Claude / in the routine)

The Higgsfield connector exposes `generate_image`. Confirmed model + params:

- `model: "gpt_image_2"`, `params.aspect_ratio: "3:4"`, `params.resolution: "2k"`, `params.quality: "high"`.
- Reference image (hero slide portrait): `medias: [{ value: <media_id>, role: "image" }]`.
  - Get `<media_id>` by uploading the portrait first: `media_upload` (returns a presigned URL, PUT the bytes, then `media_confirm`) or `media_import_url` if the portrait is reachable over HTTPS. Never pass a raw URL in `medias[].value`.
- `params.get_cost: true` preflights credit cost without generating.
- Poll/collect with `show_generations` or `job_display <id>`; download each result image to `$W/slides/slide-0N.png`.

One `generate_image` call per slide (each slide is a different prompt). Keep the same prompts as backend B.

## Backend B: Higgsfield CLI (use locally on an authenticated Mac)

```bash
command -v higgsfield || curl -fsSL https://raw.githubusercontent.com/higgsfield-ai/cli/main/install.sh | sh   # ~/.local/bin if sudo blocked
higgsfield workspace set 46fe38ce-3012-47ad-a6bb-b0bfd46ccd9e
# submit WITHOUT --wait (shell caps ~2 min), capture the job UUID, then poll:
higgsfield generate create gpt_image_2 --prompt "$(cat prompt.txt)" \
  --aspect_ratio 3:4 --resolution 2k --quality high --json           # hero adds: --image "$SK/assets/portrait/ben-portrait.png"
higgsfield generate wait <JOB_ID> --json   # -> .result_url ; curl it to $W/slides/slide-0N.png
```

CLI auth is interactive OAuth with the token in the macOS keychain (auto-refreshes). Pro plan = **4 concurrent jobs**; batch in fours.

## Slide prompt: shared style block

Every slide prompt is this block + the per-slide copy, and it must leave the bottom 12% empty cream (the footer is code-added).

```
Vertical 3:4 social media carousel slide, editorial typographic poster design.
Background: full-bleed warm cream paper color (hex #FAF3E3), no border, no frame.
Layout in the UPPER portion, left-aligned, generous margins with negative space:
1. Small eyebrow in UPPERCASE letter-spaced sans-serif (NOT cursive/script/handwriting), dark charcoal: <EYEBROW>
2. Large bold geometric sans-serif headline (Space Grotesk style), near-black ink #050505, tight line spacing: <HEADLINE>. The word/phrase "<HIGHLIGHT>" sits on a soft pale-yellow rounded-rectangle highlight (hex #FDEEC4) like a marker swipe. Only that word/phrase is highlighted.
3. <BODY: 1-2 fragment lines  OR  a tight numbered / bulleted list for substance slides, each item on its own line>, clean medium sans-serif (Montserrat style), warm dark gray.
<ARROW: In the lower-right, above the empty bottom strip, a small dashed yellow right-pointing swipe arrow.  (omit on the final slide)>
Leave the entire bottom 12% of the image as empty plain cream (hex #FAF3E3). Do NOT draw any footer, bar, name, logo, avatar, page number, or watermark.
Style: premium minimal editorial, flat vector shapes, crisp typography, no cursive or script anywhere, no gradients, no texture noise. Render every piece of specified text exactly, spelled correctly.
```

- Hero slide 1 adds: "composite the man from the reference image, chest up, black polo, no background, lower-right" and passes the portrait as the reference media.
- Substance slides: make item 3 an explicit numbered or bulleted list; keep each line short (misspell risk rises with length).

## Footer + PDF (same for both backends)

```bash
python3 "$SK/scripts/footer.py" "$W/slides/slide-0N.png" N TOTAL "$W/final/slide-0N.png"   # real logo, avatar, name, page
# assemble in order:
magick "$W"/final/slide-0[1-9].png "$W/<slug>.pdf"      # macOS
# or, portable (Linux/cloud): python3 -c "import img2pdf,glob; open('$W/<slug>.pdf','wb').write(img2pdf.convert(sorted(glob.glob('$W/final/slide-*.png'))))"
```

`footer.py` resolves the logo/portrait from `assets/` by default; override with `CB_LOGO` / `CB_PORTRAIT` / `CB_NAME` / `CB_HANDLE`. It needs Pillow and a bold sans + mono font (macOS: Arial Bold + Menlo; elsewhere it falls back, bundle a TTF for exact brand match).

## QA + gotchas

- **QA every slide**: read the PNG back, confirm text is spelled correctly and only one phrase is highlighted. Re-render garbled slides. Bullet slides are the highest risk.
- Pages are 3:4 (1744x2336). LinkedIn documents take them as-is; for Instagram (4:5 max) pad top/bottom with cream.
- CLI only: shell 2-min cap (submit without `--wait`, poll) and 4 concurrent jobs.
