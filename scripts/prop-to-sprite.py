"""Turn a large "pixel style" reference on a flat magenta background into a scene sprite.

The reference is keyed out, box-downsampled to the requested height, locked to the
ENDESGA 32 palette, and its silhouette edge is inked. The result is a small RGBA PNG
that can be refined in Aseprite and dropped into src/assets/sprites.

    pip install pillow numpy
    python scripts/prop-to-sprite.py reference.png src/assets/sprites/lamp.png 38     # 38 px tall
    python scripts/prop-to-sprite.py reference.png src/assets/sprites/desk.png w192   # 192 px wide
"""
import sys

import numpy as np
from PIL import Image

src, dst, size = sys.argv[1], sys.argv[2], sys.argv[3]

E32 = (
    "181425 262b44 3a4466 5a6988 8b9bb4 c0cbdc ffffff 2ce8f5 0099db 124e89 193c3e 265c42 "
    "3e8948 63c74d fee761 feae34 f77622 be4a2f d77643 ead4aa e4a672 b86f50 733e39 3e2731 "
    "a22633 e43b44 ff0044 68386c b55088 f6757a e8b796 c28569"
).split()
pal = np.array([[int(h[i:i + 2], 16) for i in (0, 2, 4)] for h in E32], dtype=float)

a = np.asarray(Image.open(src).convert("RGB"), dtype=float)
magenta = (a[:, :, 0] > 170) & (a[:, :, 2] > 170) & (a[:, :, 1] < 110)
alpha = np.where(magenta, 0.0, 255.0)
ys, xs = np.nonzero(alpha)
a = a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
alpha = alpha[ys.min():ys.max() + 1, xs.min():xs.max() + 1]

h, w = alpha.shape
if size.startswith("w"):
    target_w = int(size[1:])
    target_h = max(1, round(h * target_w / w))
else:
    target_h = int(size)
    target_w = max(1, round(w * target_h / h))
# Premultiply so the magenta background never bleeds into edge pixels.
premul = np.dstack([a * alpha[:, :, None] / 255, alpha]).astype("uint8")
small = np.asarray(Image.fromarray(premul).resize((target_w, target_h), Image.BOX), dtype=float)
cover = small[:, :, 3]
rgb = small[:, :, :3] * 255 / np.maximum(cover[:, :, None], 1)
nearest = ((rgb[:, :, None, :] - pal[None, None, :, :]) ** 2).sum(-1).argmin(-1)
solid = cover > 120

out = np.zeros((target_h, target_w, 4), dtype="uint8")
out[:, :, :3] = pal[nearest]
out[:, :, 3] = np.where(solid, 255, 0)
padded = np.pad(solid, 1)
edge = solid & ~(padded[:-2, 1:-1] & padded[2:, 1:-1] & padded[1:-1, :-2] & padded[1:-1, 2:])
dark = out[:, :, :3].astype(int).sum(-1) < 200
out[edge & ~dark, :3] = pal[0]

Image.fromarray(out).save(dst)
print(f"{dst}: {target_w}x{target_h}")
