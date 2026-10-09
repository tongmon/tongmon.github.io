"""Split Galmuri into a small Latin/symbol file and a Hangul file.

The browser only downloads the Hangul file when Korean text is on screen,
so English visitors skip ~0.5 MB per weight.

    pip install fonttools brotli
    python scripts/subset-fonts.py
"""
from pathlib import Path

from fontTools import subset

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "node_modules" / "galmuri" / "dist"
OUT = ROOT / "src" / "assets" / "fonts"

RANGES = {
    "latin": "U+0000-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20A9,U+20AC,U+2122,U+2190-21FF,U+2500-25FF,U+2600-26FF,U+2700-27BF",
    "hangul": "U+1100-11FF,U+3000-303F,U+3130-318F,U+AC00-D7A3,U+FF01-FF60",
}

FACES = {
    "Galmuri11": RANGES,
    "Galmuri11-Bold": RANGES,
    "Galmuri9": RANGES,
    # Only used for the score and speedrun timers.
    "GalmuriMono11": {"latin": RANGES["latin"]},
}

for face, ranges in FACES.items():
    for name, unicodes in ranges.items():
        options = subset.Options()
        options.flavor = "woff2"
        options.layout_features = ["*"]
        font = subset.load_font(str(SRC / f"{face}.ttf"), options)
        subsetter = subset.Subsetter(options)
        subsetter.populate(unicodes=subset.parse_unicodes(unicodes))
        subsetter.subset(font)
        target = OUT / f"{face}-{name}.woff2"
        subset.save_font(font, str(target), options)
        print(f"{target.name}: {target.stat().st_size // 1024} KB")
