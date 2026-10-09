"""Bake the daylight version of the player sprite (no monitor rim light).

Every cyan/blue rim pixel takes the most common colour among its neighbours, ignoring
the outline and other rim pixels. Rerun after editing src/assets/sprites/player.png.

    pip install pillow numpy
    python scripts/player-daylight.py
"""
from collections import Counter
from pathlib import Path

import numpy as np
from PIL import Image

SPRITES = Path(__file__).resolve().parent.parent / "src" / "assets" / "sprites"
RIM = {(0x2C, 0xE8, 0xF5), (0x00, 0x99, 0xDB)}
INK = (0x18, 0x14, 0x25)

src = np.asarray(Image.open(SPRITES / "player.png").convert("RGBA"))
out = src.copy()
h, w = src.shape[:2]
for y in range(h):
    for x in range(w):
        if not src[y, x, 3] or tuple(src[y, x, :3]) not in RIM:
            continue
        votes = Counter()
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                nx, ny = x + dx, y + dy
                if (dx or dy) and 0 <= nx < w and 0 <= ny < h and src[ny, nx, 3]:
                    c = tuple(src[ny, nx, :3])
                    if c != INK and c not in RIM:
                        votes[c] += 1
        if votes:
            out[y, x, :3] = votes.most_common(1)[0][0]

Image.fromarray(out).save(SPRITES / "player-day.png")
print("wrote", SPRITES / "player-day.png")
