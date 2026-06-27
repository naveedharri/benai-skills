#!/usr/bin/env python3
"""
LinkedIn Visual Animation - Template Code
Vertical process flow infographic for LinkedIn.
800x998 portrait, rendered at 3x for crisp text.

USAGE: Copy and adapt this template for each new visual.
Change the NODES list, title text, and logo assignments.
"""

from PIL import Image, ImageDraw, ImageFont
import math
import os

# === RENDERING (always 3x for crisp text) ===
SCALE = 3
FINAL_W = 800
FINAL_H = 998
WIDTH = FINAL_W * SCALE   # 2400
HEIGHT = FINAL_H * SCALE  # 2994

# === BRAND COLORS ===
BG_COLOR = (250, 243, 227)        # #FAF3E3 light yellow background
CARD_BG = (255, 255, 255)         # White card background
BLACK = (2, 3, 9)                 # #020309 near-black (borders, shadows, text)
LIGHT_BLUE = (229, 245, 249)      # #E5F5F9 (PLAN / ENGINE phase)
GREEN = (210, 236, 208)           # #D2ECD0 (EXEC phase)
DARK_YELLOW = (253, 238, 196)     # #FDEEC4 (INPUT phase)
RED_LIGHT = (243, 193, 192)       # #F3C1C0 (DEBUG phase)
ACCENT_GREEN = (72, 160, 120)     # Title accent color
GRAY_TEXT = (100, 100, 100)       # Description text color
ARROW_COLOR = (2, 3, 9)           # Arrow color (same as black)

# Logo-specific colors
CLAUDE_ORANGE = (224, 125, 79)
N8N_PINK = (234, 72, 108)
GMEET_BLUE = (66, 133, 244)
GMEET_GREEN = (52, 168, 83)
GMEET_YELLOW = (251, 188, 4)
GMEET_RED = (234, 67, 53)

# === FONTS (all sizes at 3x) ===
FONT_TITLE = ImageFont.truetype("/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf", 108)
FONT_TITLE_ACCENT = ImageFont.truetype("/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf", 108)
FONT_SUBTITLE = ImageFont.truetype("/usr/share/fonts/truetype/google-fonts/Poppins-Medium.ttf", 42)
FONT_NODE_LABEL = ImageFont.truetype("/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf", 51)
FONT_NODE_DESC = ImageFont.truetype("/usr/share/fonts/truetype/google-fonts/Poppins-Medium.ttf", 36)
FONT_STEP_NUM = ImageFont.truetype("/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf", 39)
FONT_FOOTER = ImageFont.truetype("/usr/share/fonts/truetype/google-fonts/Poppins-Medium.ttf", 36)
FONT_PHASE = ImageFont.truetype("/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf", 30)

# === NODE DATA ===
# Format: (label, description, phase_color, phase_tag, logo_type)
# logo_type: "claude", "n8n", "gmeet", "none" (doc icon)
# Adapt this list for each new visual
NODES = [
    ("Discovery Call", "Defines the project scope", DARK_YELLOW, "INPUT", "gmeet"),
    ("Transcript", "Raw text, ready for analysis", DARK_YELLOW, "INPUT", "none"),
    ("n8n PRD", "Automation spec from transcript", LIGHT_BLUE, "PLAN", "n8n"),
    ("Claude Code", "Interprets PRD and builds it", LIGHT_BLUE, "ENGINE", "claude"),
    ("Build", "Constructs workflow node by node", GREEN, "EXEC", "n8n"),
    ("Tests", "Verifies each step works", GREEN, "EXEC", "none"),
    ("Debug", "Fixes issues automatically", RED_LIGHT, "EXEC", "claude"),
    ("Optimizes", "Refines for production use", GREEN, "EXEC", "none"),
]

# === CARD LAYOUT (all at 3x) ===
CARD_W = 1560
CARD_H = 195
SHADOW_X = 15
SHADOW_Y = 15
BORDER_W = 6
CORNER_R = 30
GAP_Y = 84

# === POSITION CALCULATION ===
TITLE_AREA_H = 390
FOOTER_H = 150
content_h = HEIGHT - TITLE_AREA_H - FOOTER_H
total_cards_h = len(NODES) * CARD_H + (len(NODES) - 1) * GAP_Y
start_y = TITLE_AREA_H + (content_h - total_cards_h) // 2
start_x = (WIDTH - CARD_W) // 2

positions = []
for i in range(len(NODES)):
    positions.append((start_x, start_y + i * (CARD_H + GAP_Y)))


# === HELPER: ROUNDED RECTANGLE ===
def draw_rounded_rect(draw, xy, fill, outline=None, radius=20, width=4):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


# =============================================
# LOGO DRAWING FUNCTIONS
# Draw logos programmatically with PIL.
# Each draws on an RGBA layer and pastes onto
# the main image with transparency.
# =============================================

def draw_claude_logo(img, cx, cy, size):
    """Claude's orange starburst logo."""
    logo = Image.new('RGBA', (size * 2, size * 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(logo)
    center = size
    num_rays = 12
    inner_r = size * 0.18
    outer_r = size * 0.85
    ray_width = size * 0.13

    for i in range(num_rays):
        angle = (2 * math.pi * i) / num_rays - math.pi / 2
        cos_a = math.cos(angle)
        sin_a = math.sin(angle)
        perp_cos = math.cos(angle + math.pi / 2)
        perp_sin = math.sin(angle + math.pi / 2)

        x_inner = center + inner_r * cos_a
        y_inner = center + inner_r * sin_a
        x_outer = center + outer_r * cos_a
        y_outer = center + outer_r * sin_a

        points = [
            (x_inner + ray_width * perp_cos, y_inner + ray_width * perp_sin),
            (x_outer + ray_width * 0.7 * perp_cos, y_outer + ray_width * 0.7 * perp_sin),
            (x_outer - ray_width * 0.7 * perp_cos, y_outer - ray_width * 0.7 * perp_sin),
            (x_inner - ray_width * perp_cos, y_inner - ray_width * perp_sin),
        ]
        d.polygon(points, fill=CLAUDE_ORANGE)

    cr = size * 0.22
    d.ellipse([center - cr, center - cr, center + cr, center + cr], fill=CLAUDE_ORANGE)
    img.paste(logo, (cx - size, cy - size), logo)


def draw_n8n_logo(img, cx, cy, size):
    """n8n's pink connected nodes logo."""
    logo = Image.new('RGBA', (size * 2, size * 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(logo)

    node_r = size * 0.22
    ring_w = max(3, int(size * 0.08))

    nodes = [
        (size * 0.35, size * 1.0),
        (size * 1.0, size * 1.0),
        (size * 1.65, size * 0.65),
    ]

    line_w = max(4, int(size * 0.15))
    d.line([nodes[0], nodes[1]], fill=N8N_PINK, width=line_w)
    d.line([nodes[1], (size * 1.2, size * 0.85)], fill=N8N_PINK, width=line_w)
    d.line([(size * 1.2, size * 0.85), nodes[2]], fill=N8N_PINK, width=line_w)

    for nx, ny in nodes:
        d.ellipse([nx - node_r, ny - node_r, nx + node_r, ny + node_r], fill=N8N_PINK)
        inner_r = node_r * 0.5
        d.ellipse([nx - inner_r, ny - inner_r, nx + inner_r, ny + inner_r],
                   fill=(0, 0, 0, 0), outline=N8N_PINK, width=ring_w)

    img.paste(logo, (cx - size, cy - size), logo)


def draw_gmeet_logo(img, cx, cy, size):
    """Simplified Google Meet camera icon."""
    logo = Image.new('RGBA', (size * 2, size * 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(logo)

    body_l = size * 0.25
    body_t = size * 0.5
    body_r = size * 1.35
    body_b = size * 1.5
    mid_x = (body_l + body_r) / 2
    mid_y = (body_t + body_b) / 2

    d.rectangle([body_l, body_t, mid_x, mid_y], fill=GMEET_BLUE)
    d.rectangle([mid_x, body_t, body_r, mid_y], fill=GMEET_GREEN)
    d.rectangle([body_l, mid_y, mid_x, body_b], fill=GMEET_RED)
    d.rectangle([mid_x, mid_y, body_r, body_b], fill=GMEET_YELLOW)

    tri_points = [
        (body_r, body_t + size * 0.15),
        (size * 1.75, size * 0.55),
        (size * 1.75, size * 1.45),
        (body_r, body_b - size * 0.15),
    ]
    d.polygon(tri_points, fill=GMEET_GREEN)

    img.paste(logo, (cx - size, cy - size), logo)


def draw_doc_icon(img, cx, cy, size):
    """Simple document/text icon (default for nodes without a specific logo)."""
    logo = Image.new('RGBA', (size * 2, size * 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(logo)

    doc_l = size * 0.5
    doc_t = size * 0.3
    doc_r = size * 1.5
    doc_b = size * 1.7
    d.rounded_rectangle([doc_l, doc_t, doc_r, doc_b], radius=int(size * 0.1),
                         fill=(220, 220, 220), outline=(160, 160, 160), width=max(2, int(size * 0.05)))

    line_color = (160, 160, 160)
    lw = max(2, int(size * 0.05))
    for i, frac in enumerate([0.35, 0.5, 0.65, 0.8]):
        lx1 = size * 0.7
        lx2 = size * 1.3 if i < 3 else size * 1.05
        ly = doc_t + (doc_b - doc_t) * frac
        d.line([(lx1, ly), (lx2, ly)], fill=line_color, width=lw)

    img.paste(logo, (cx - size, cy - size), logo)


def draw_logo(img, logo_type, cx, cy, size):
    """Route to the appropriate logo drawing function."""
    if logo_type == "claude":
        draw_claude_logo(img, cx, cy, size)
    elif logo_type == "n8n":
        draw_n8n_logo(img, cx, cy, size)
    elif logo_type == "gmeet":
        draw_gmeet_logo(img, cx, cy, size)
    elif logo_type == "none":
        draw_doc_icon(img, cx, cy, size)


# =============================================
# CARD DRAWING
# =============================================

def draw_card(img, draw, x, y, idx, label, desc, phase_color, phase_tag, logo_type):
    """Draw a complete card with logo, number, label, description, and phase tag."""
    # Solid shadow
    shadow_xy = (x + SHADOW_X, y + SHADOW_Y, x + CARD_W + SHADOW_X, y + CARD_H + SHADOW_Y)
    draw_rounded_rect(draw, shadow_xy, fill=BLACK, radius=CORNER_R)

    # Main card
    card_xy = (x, y, x + CARD_W, y + CARD_H)
    draw_rounded_rect(draw, card_xy, fill=CARD_BG, outline=BLACK, radius=CORNER_R, width=BORDER_W)

    # Color accent strip on left
    strip_xy = (x + 6, y + 42, x + 21, y + CARD_H - 42)
    draw.rectangle(strip_xy, fill=phase_color)

    # Logo (left side, vertically centered)
    logo_size = 45
    logo_cx = x + 90
    logo_cy = y + CARD_H // 2 - 6
    draw_logo(img, logo_type, logo_cx, logo_cy, logo_size)

    # Step number (small circle near logo)
    num_r = 27
    num_cx = x + 120
    num_cy = y + CARD_H // 2 + 33
    draw.ellipse([num_cx - num_r, num_cy - num_r, num_cx + num_r, num_cy + num_r],
                 fill=phase_color, outline=BLACK, width=3)
    num_text = str(idx + 1)
    bbox = draw.textbbox((0, 0), num_text, font=FONT_STEP_NUM)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text((num_cx - tw // 2, num_cy - th // 2 - 3), num_text, fill=BLACK, font=FONT_STEP_NUM)

    # Text area - vertically center the label + desc block
    text_x = x + 180
    label_bbox = draw.textbbox((0, 0), label, font=FONT_NODE_LABEL)
    label_h = label_bbox[3] - label_bbox[1]
    desc_bbox = draw.textbbox((0, 0), desc, font=FONT_NODE_DESC)
    desc_h = desc_bbox[3] - desc_bbox[1]
    text_gap = 12
    total_text_h = label_h + text_gap + desc_h
    text_top = y + (CARD_H - total_text_h) // 2

    draw.text((text_x, text_top), label, fill=BLACK, font=FONT_NODE_LABEL)
    draw.text((text_x, text_top + label_h + text_gap), desc, fill=GRAY_TEXT, font=FONT_NODE_DESC)

    # Phase tag (right side, pill shape)
    phase_bbox = draw.textbbox((0, 0), phase_tag, font=FONT_PHASE)
    ptw = phase_bbox[2] - phase_bbox[0]
    pth = phase_bbox[3] - phase_bbox[1]
    tag_x = x + CARD_W - ptw - 45
    tag_y = y + (CARD_H - pth) // 2 - 6
    pill_xy = (tag_x - 18, tag_y - 9, tag_x + ptw + 18, tag_y + pth + 12)
    draw_rounded_rect(draw, pill_xy, fill=phase_color, outline=None, radius=12, width=0)
    draw.text((tag_x, tag_y), phase_tag, fill=BLACK, font=FONT_PHASE)


def draw_arrow_down(draw, src_idx):
    """Downward arrow between consecutive cards."""
    sx, sy = positions[src_idx]
    dx, dy = positions[src_idx + 1]

    x = sx + CARD_W // 2
    y1 = sy + CARD_H + SHADOW_Y + 3
    y2 = dy - 3

    draw.line([(x, y1), (x, y2 - 18)], fill=ARROW_COLOR, width=5)
    draw.polygon([
        (x, y2 - 3),
        (x - 12, y2 - 21),
        (x + 12, y2 - 21),
    ], fill=ARROW_COLOR)


# =============================================
# TITLE AND FOOTER
# =============================================

def draw_title(draw):
    """Draw the title area with two-tone text and subtitle."""
    # Adapt these for each new visual
    part1 = "Transcript "
    part2 = "to n8n Workflow"

    bbox1 = draw.textbbox((0, 0), part1, font=FONT_TITLE)
    bbox2 = draw.textbbox((0, 0), part2, font=FONT_TITLE_ACCENT)
    tw1 = bbox1[2] - bbox1[0]
    tw2 = bbox2[2] - bbox2[0]
    total_tw = tw1 + tw2

    tx = (WIDTH - total_tw) // 2
    ty = 90

    draw.text((tx, ty), part1, fill=BLACK, font=FONT_TITLE)
    draw.text((tx + tw1, ty), part2, fill=ACCENT_GREEN, font=FONT_TITLE_ACCENT)

    subtitle = "How Claude Code builds n8n workflows from a single call"
    bbox_sub = draw.textbbox((0, 0), subtitle, font=FONT_SUBTITLE)
    stw = bbox_sub[2] - bbox_sub[0]
    draw.text(((WIDTH - stw) // 2, ty + 150), subtitle, fill=GRAY_TEXT, font=FONT_SUBTITLE)

    line_y = ty + 232
    margin = 180
    draw.line([(margin, line_y), (WIDTH - margin, line_y)], fill=(210, 205, 190), width=3)


def draw_footer(draw):
    """Footer with Ben's name and title."""
    footer_y = HEIGHT - 135
    draw.line([(180, footer_y - 24), (WIDTH - 180, footer_y - 24)], fill=(210, 205, 190), width=3)

    footer_text = "Ben Van Sprundel  |  Founder @ BenAI"
    bbox = draw.textbbox((0, 0), footer_text, font=FONT_FOOTER)
    ftw = bbox[2] - bbox[0]
    draw.text(((WIDTH - ftw) // 2, footer_y + 6), footer_text, fill=GRAY_TEXT, font=FONT_FOOTER)


# =============================================
# FRAME GENERATION
# =============================================

def create_frame(visible_nodes=8, show_arrows=True):
    """Create a single frame, rendered at 3x then downscaled."""
    img = Image.new('RGBA', (WIDTH, HEIGHT), BG_COLOR + (255,))
    draw = ImageDraw.Draw(img)

    draw_title(draw)

    if show_arrows:
        for i in range(min(visible_nodes - 1, len(NODES) - 1)):
            draw_arrow_down(draw, i)

    for i in range(min(visible_nodes, len(NODES))):
        label, desc, phase_color, phase_tag, logo_type = NODES[i]
        x, y = positions[i]
        draw_card(img, draw, x, y, i, label, desc, phase_color, phase_tag, logo_type)

    draw_footer(draw)

    # Downscale to final size for crisp rendering
    final = img.resize((FINAL_W, FINAL_H), Image.LANCZOS)
    return final.convert('RGB')


# =============================================
# ANIMATION & OUTPUT
# =============================================

def generate_gif(output_dir, filename_prefix="workflow-diagram"):
    """Generate animated GIF and static PNG."""
    os.makedirs(output_dir, exist_ok=True)

    frames = []

    # Animation timing
    TITLE_HOLD = 12    # ~1.2s title only
    NODE_HOLD = 7      # ~0.7s per node reveal
    FINAL_HOLD = 30    # ~4.5s final hold

    # 1. Title only frames
    title_img = Image.new('RGBA', (WIDTH, HEIGHT), BG_COLOR + (255,))
    title_draw = ImageDraw.Draw(title_img)
    draw_title(title_draw)
    draw_footer(title_draw)
    title_final = title_img.resize((FINAL_W, FINAL_H), Image.LANCZOS).convert('RGB')
    for _ in range(TITLE_HOLD):
        frames.append(title_final)

    # 2. Nodes appearing one by one
    for n in range(1, len(NODES) + 1):
        frame = create_frame(visible_nodes=n, show_arrows=(n > 1))
        for _ in range(NODE_HOLD):
            frames.append(frame)

    # 3. Final hold
    final_frame = create_frame(visible_nodes=len(NODES), show_arrows=True)
    for _ in range(FINAL_HOLD):
        frames.append(final_frame)

    # Save GIF
    gif_path = os.path.join(output_dir, f"{filename_prefix}.gif")
    durations = [100] * len(frames)
    for i in range(len(frames) - FINAL_HOLD, len(frames)):
        durations[i] = 150

    frames[0].save(
        gif_path,
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        loop=0,
        optimize=True,
    )

    # Save static PNG (final frame)
    static_path = os.path.join(output_dir, f"{filename_prefix}-static.png")
    final_frame.save(static_path, quality=95)

    print(f"GIF: {gif_path} ({os.path.getsize(gif_path) / 1024:.0f} KB)")
    print(f"Static: {static_path} ({os.path.getsize(static_path) / 1024:.0f} KB)")
    print(f"Frames: {len(frames)}, Render: {WIDTH}x{HEIGHT} -> Final: {FINAL_W}x{FINAL_H}")

    return gif_path, static_path


# === RUN ===
if __name__ == "__main__":
    output_dir = "/sessions/relaxed-zen-shannon/mnt/outputs"
    generate_gif(output_dir)
