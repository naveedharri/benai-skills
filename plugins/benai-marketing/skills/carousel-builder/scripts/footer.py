#!/usr/bin/env python3
"""
Composite the Ben AI footer bar onto a carousel slide.

The footer is drawn by CODE (never by the image model) so the logo, avatar,
name, and page numbers are always pixel-correct and identical across slides.

Usage:
    python3 footer.py <in.png> <page_num> <total> <out.png>

Assets resolve relative to this skill by default; override with env vars:
    CB_LOGO=/path/to/smiley.png   CB_PORTRAIT=/path/to/portrait.png
    CB_NAME="Ben Van Sprundel"    CB_HANDLE="Ben AI"
"""
import os, sys
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, "..", "assets")
LOGO_SRC = os.environ.get("CB_LOGO", os.path.join(ASSETS, "logo", "benai-smiley.png"))
PORTRAIT = os.environ.get("CB_PORTRAIT", os.path.join(ASSETS, "portrait", "ben-portrait.png"))
NAME     = os.environ.get("CB_NAME", "Ben Van Sprundel")
HANDLE   = os.environ.get("CB_HANDLE", "Ben AI")

CREAM = (250, 243, 227, 255)
BAR   = (20, 17, 14, 255)
FONTS = os.path.join(ASSETS, "fonts")
# Preference order per role: bundled brand fonts, then macOS, then Linux/PIL defaults.
BOLD_CANDIDATES = [
    os.path.join(FONTS, "bold.ttf"),
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "DejaVuSans-Bold.ttf",  # bundled with Pillow
]
MONO_CANDIDATES = [
    os.path.join(FONTS, "mono.ttf"),
    "/System/Library/Fonts/Menlo.ttc",
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
    "DejaVuSansMono.ttf",
]
ARIAL_BOLD = "bold"
MENLO = "mono"


def font(role, size):
    candidates = BOLD_CANDIDATES if role == "bold" else MONO_CANDIDATES
    for p in candidates:
        try:
            return ImageFont.truetype(p, size)
        except Exception:
            continue
    return ImageFont.load_default()


def cream_logo(diam):
    """Load the real logo, key out its white background, recolor the mark to cream."""
    lg = Image.open(LOGO_SRC).convert("RGBA")
    out = []
    for r, g, b, a in lg.getdata():
        lum = (r * 299 + g * 587 + b * 114) // 1000
        alpha = a if a < 255 else 0
        alpha = max(alpha, 255 - lum)        # dark ink -> opaque cream, white bg -> transparent
        out.append((CREAM[0], CREAM[1], CREAM[2], alpha))
    lg.putdata(out)
    bbox = lg.getbbox()
    if bbox:
        lg = lg.crop(bbox)                   # trim padding so the mark fills the box
    return lg.resize((diam, diam), Image.LANCZOS)


def avatar_disc(diam):
    """Circle-crop the portrait onto a cream disc (never a black background)."""
    p = Image.open(PORTRAIT).convert("RGBA")
    w, h = p.size
    # face-centered square crop (scales with source size)
    side = int(min(w, h) * 0.72)
    cx, cy = int(w * 0.5), int(h * 0.37)
    box = (cx - side // 2, cy - side // 2, cx + side // 2, cy + side // 2)
    face = p.crop(box).resize((diam, diam), Image.LANCZOS)
    disc = Image.new("RGBA", (diam, diam), CREAM)
    disc.paste(face, (0, 0), face)
    mask = Image.new("L", (diam, diam), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, diam - 1, diam - 1), fill=255)
    disc.putalpha(mask)
    ring = Image.new("RGBA", (diam, diam), (0, 0, 0, 0))
    ImageDraw.Draw(ring).ellipse((2, 2, diam - 3, diam - 3), outline=CREAM, width=5)
    disc.alpha_composite(ring)
    return disc


def main(inp, page, total, out):
    img = Image.open(inp).convert("RGBA")
    W, H = img.size
    bar_h = round(H * 0.105)
    bar_top = H - bar_h
    cy = bar_top + bar_h // 2
    margin = round(W * 0.040)
    d = ImageDraw.Draw(img)
    d.rectangle((0, bar_top, W, H), fill=BAR)

    # left: avatar + name
    av_d = round(bar_h * 0.62)
    img.alpha_composite(avatar_disc(av_d), (margin, cy - av_d // 2))
    name_f = font(ARIAL_BOLD, round(bar_h * 0.26))
    nx = margin + av_d + round(bar_h * 0.22)
    nb = d.textbbox((0, 0), NAME, font=name_f)
    d.text((nx, cy - (nb[3] - nb[1]) // 2 - nb[1]), NAME, font=name_f, fill=CREAM)

    # right group: logo | handle | page
    page_f = font(MENLO, round(bar_h * 0.25))
    hand_f = font(ARIAL_BOLD, round(bar_h * 0.27))
    lg_d = round(bar_h * 0.58)
    gap = round(bar_h * 0.16)
    page_txt = f"{page:02d} / {total:02d}"
    pb = d.textbbox((0, 0), page_txt, font=page_f); pw = pb[2] - pb[0]
    hb = d.textbbox((0, 0), HANDLE, font=hand_f);  hw = hb[2] - hb[0]
    x = W - margin
    d.text((x - pw - pb[0], cy - (pb[3] - pb[1]) // 2 - pb[1]), page_txt, font=page_f, fill=CREAM)
    x -= pw + gap
    d.text((x - hw - hb[0], cy - (hb[3] - hb[1]) // 2 - hb[1]), HANDLE, font=hand_f, fill=CREAM)
    x -= hw + gap
    img.alpha_composite(cream_logo(lg_d), (x - lg_d, cy - lg_d // 2))

    img.convert("RGB").save(out, "PNG")
    print("wrote", out)


if __name__ == "__main__":
    main(sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4])
