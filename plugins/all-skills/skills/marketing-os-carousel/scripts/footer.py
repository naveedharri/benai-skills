#!/usr/bin/env python3
"""
Composite the brand footer bar onto a carousel slide.

The footer is drawn by CODE, never by the image model, so the logo, avatar, name
and page numbers are pixel-correct and identical across every slide. Image models
cannot draw a logo or spell a name reliably, so they are never asked to.

This script holds NO brand identity. Every value is injected, and the caller
resolves each one from the Marketing OS:

    MOSC_LOGO       path to the brand mark            Context/brand/brand-kit.md pointer
    MOSC_PORTRAIT   path to the operator portrait      Context/brand/brand-kit.md pointer
                    optional. Omit it and the avatar disc is skipped
    MOSC_NAME       the name on the bar                Context/config.md operator_name
    MOSC_HANDLE     the brand handle on the bar        Context/config.md org_name
    MOSC_CREAM      footer ink and disc colour, hex    the brand background token
    MOSC_BAR        footer bar colour, hex             the brand primary text token
    MOSC_FONT_BOLD  optional path to the heading font  Context/brand/brand-kit.md typography
    MOSC_FONT_MONO  optional path to the mono font     same

Usage:
    python3 footer.py <in.png> <page_num> <total> <out.png>

Exits non-zero with a one-line reason when a required value is missing. It never
guesses a colour and never substitutes a placeholder mark, because a wrong logo
composited onto every slide is worse than a failed run.
"""
import os
import sys

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    sys.exit("footer.py needs Pillow. Install it with: python3 -m pip install pillow")

HERE = os.path.dirname(os.path.abspath(__file__))
BUNDLED_FONTS = os.path.join(HERE, "..", "assets", "fonts")


def die(msg):
    sys.exit("footer.py: " + msg)


def hex_rgba(value, label):
    h = (value or "").strip().lstrip("#")
    if len(h) not in (3, 6):
        die(
            "%s is not a hex colour: %r. Resolve it from Context/brand/brand-kit.md "
            "and pass it in. This script never guesses a brand colour." % (label, value)
        )
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    try:
        return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), 255)
    except ValueError:
        die("%s is not a hex colour: %r" % (label, value))


LOGO_SRC = os.environ.get("MOSC_LOGO", "")
PORTRAIT = os.environ.get("MOSC_PORTRAIT", "")
NAME = os.environ.get("MOSC_NAME", "")
HANDLE = os.environ.get("MOSC_HANDLE", "")

if not LOGO_SRC:
    die("MOSC_LOGO is not set. The brand mark is composited by code, so it must be a real file.")
if not os.path.exists(LOGO_SRC):
    die("MOSC_LOGO does not exist: %s" % LOGO_SRC)
if PORTRAIT and not os.path.exists(PORTRAIT):
    die("MOSC_PORTRAIT was set but does not exist: %s" % PORTRAIT)
if not NAME:
    die("MOSC_NAME is not set. Read operator_name from Context/config.md.")
if not HANDLE:
    die("MOSC_HANDLE is not set. Read org_name from Context/config.md.")

CREAM = hex_rgba(os.environ.get("MOSC_CREAM"), "MOSC_CREAM")
BAR = hex_rgba(os.environ.get("MOSC_BAR"), "MOSC_BAR")

BOLD_CANDIDATES = [
    os.environ.get("MOSC_FONT_BOLD", ""),
    os.path.join(BUNDLED_FONTS, "bold.ttf"),
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "DejaVuSans-Bold.ttf",
]
MONO_CANDIDATES = [
    os.environ.get("MOSC_FONT_MONO", ""),
    os.path.join(BUNDLED_FONTS, "mono.ttf"),
    "/System/Library/Fonts/Menlo.ttc",
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
    "DejaVuSansMono.ttf",
]
BOLD = "bold"
MONO = "mono"


def font(role, size):
    for path in (BOLD_CANDIDATES if role == BOLD else MONO_CANDIDATES):
        if not path:
            continue
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            continue
    return ImageFont.load_default()


def keyed_logo(diam):
    """Load the brand mark, key out its white background, recolour it to the ink colour."""
    lg = Image.open(LOGO_SRC).convert("RGBA")
    # get_flattened_data is the Pillow 11+ name; getdata is deprecated and goes away in Pillow 14.
    pixels = lg.get_flattened_data() if hasattr(lg, "get_flattened_data") else lg.getdata()
    out = []
    for r, g, b, a in pixels:
        lum = (r * 299 + g * 587 + b * 114) // 1000
        alpha = a if a < 255 else 0
        alpha = max(alpha, 255 - lum)  # dark ink becomes opaque, white background becomes clear
        out.append((CREAM[0], CREAM[1], CREAM[2], alpha))
    lg.putdata(out)
    bbox = lg.getbbox()
    if bbox:
        lg = lg.crop(bbox)  # trim padding so the mark fills its box
    return lg.resize((diam, diam), Image.LANCZOS)


def avatar_disc(diam):
    """Circle-crop the portrait onto a disc in the brand background colour, never onto black."""
    p = Image.open(PORTRAIT).convert("RGBA")
    w, h = p.size
    side = int(min(w, h) * 0.72)
    cx, cy = int(w * 0.5), int(h * 0.37)  # face-centred, scales with the source
    face = p.crop((cx - side // 2, cy - side // 2, cx + side // 2, cy + side // 2))
    face = face.resize((diam, diam), Image.LANCZOS)
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

    # left: avatar, when there is one, then the name
    nx = margin
    if PORTRAIT:
        av_d = round(bar_h * 0.62)
        img.alpha_composite(avatar_disc(av_d), (margin, cy - av_d // 2))
        nx = margin + av_d + round(bar_h * 0.22)
    name_f = font(BOLD, round(bar_h * 0.26))
    nb = d.textbbox((0, 0), NAME, font=name_f)
    d.text((nx, cy - (nb[3] - nb[1]) // 2 - nb[1]), NAME, font=name_f, fill=CREAM)

    # right group, laid out from the edge inwards: page number, handle, mark
    page_f = font(MONO, round(bar_h * 0.25))
    hand_f = font(BOLD, round(bar_h * 0.27))
    lg_d = round(bar_h * 0.58)
    gap = round(bar_h * 0.16)
    page_txt = "%02d / %02d" % (page, total)
    pb = d.textbbox((0, 0), page_txt, font=page_f)
    hb = d.textbbox((0, 0), HANDLE, font=hand_f)
    pw, hw = pb[2] - pb[0], hb[2] - hb[0]
    x = W - margin
    d.text((x - pw - pb[0], cy - (pb[3] - pb[1]) // 2 - pb[1]), page_txt, font=page_f, fill=CREAM)
    x -= pw + gap
    d.text((x - hw - hb[0], cy - (hb[3] - hb[1]) // 2 - hb[1]), HANDLE, font=hand_f, fill=CREAM)
    x -= hw + gap
    img.alpha_composite(keyed_logo(lg_d), (x - lg_d, cy - lg_d // 2))

    img.convert("RGB").save(out, "PNG")
    print("wrote", out)


if __name__ == "__main__":
    if len(sys.argv) != 5:
        die("usage: footer.py <in.png> <page_num> <total> <out.png>")
    main(sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4])
