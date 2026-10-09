"""Render the 1200x630 social preview (public/og.png) from the portrait and Galmuri.

    pip install pillow
    python scripts/make-og.py
"""
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "node_modules" / "galmuri" / "dist"
W, H = 1200, 630

INK, SLATE, STEEL, FOG, SILVER, WHITE = "#181425", "#3a4466", "#5a6988", "#8b9bb4", "#c0cbdc", "#ffffff"
YELLOW, GOLD, ORANGE, RUST = "#fee761", "#feae34", "#f77622", "#be4a2f"
LIME, GREEN, BARK, PLUM, WOOD = "#63c74d", "#3e8948", "#733e39", "#3e2731", "#b86f50"

img = Image.new("RGB", (W, H), INK)
d = ImageDraw.Draw(img)
d.fontmode = "1"  # no anti-aliasing: keep the pixel font crisp

px = 4
rnd = random.Random(42)
for _ in range(70):
    x, y = rnd.randrange(0, W // px) * px, rnd.randrange(0, (H - 60) // px) * px
    d.rectangle([x, y, x + px - 1, y + px - 1], fill=rnd.choice([SLATE, STEEL, SLATE, WHITE]))

# Platformer ground along the bottom.
gy = H - 48
d.rectangle([0, gy, W, H], fill=BARK)
d.rectangle([0, gy, W, gy + 3 * px - 1], fill=GREEN)
d.rectangle([0, gy, W, gy + px - 1], fill=LIME)
d.rectangle([0, gy + 4 * px, W, gy + 5 * px - 1], fill=PLUM)
for _ in range(60):
    x, y = rnd.randrange(0, W // px) * px, rnd.randrange(gy // px + 5, H // px) * px
    d.rectangle([x, y, x + px - 1, y + px - 1], fill=rnd.choice([WOOD, PLUM]))

# Portrait in a chunky frame.
portrait = Image.open(ROOT / "src" / "assets" / "images" / "portrait.png").convert("RGB")
size = portrait.width * 6
x0, y0 = 96, (gy - size) // 2
d.rectangle([x0 - 16, y0 - 16, x0 + size + 15, y0 + size + 15], fill=SILVER)
d.rectangle([x0 - 8, y0 - 8, x0 + size + 7, y0 + size + 7], fill=INK)
img.paste(portrait.resize((size, size), Image.NEAREST), (x0, y0))

tx = x0 + size + 72
small = ImageFont.truetype(str(FONTS / "Galmuri9.ttf"), 27)
body = ImageFont.truetype(str(FONTS / "Galmuri11.ttf"), 33)
logo = ImageFont.truetype(str(FONTS / "Galmuri11-Bold.ttf"), 88)

d.text((tx, 118), "► PLAYER 1", font=small, fill=GOLD)
lx, ly, lp = tx, 160, 8
for dx, dy, col in [(lp, 3 * lp, INK), (0, 2 * lp, RUST), (0, lp, ORANGE), (0, 0, YELLOW)]:
    d.text((lx + dx, ly + dy), "TONGSTAR", font=logo, fill=col)
d.text((tx, 316), "DevOps engineer by day.", font=body, fill=WHITE)
d.text((tx, 362), "Indie game dev & quant", font=body, fill=SILVER)
d.text((tx, 404), "by night.", font=body, fill=SILVER)
d.text((tx, 478), "tongmon.github.io", font=small, fill=FOG)

out = ROOT / "public" / "og.png"
img.save(out, optimize=True)
print(out, out.stat().st_size // 1024, "KB")
