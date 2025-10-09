"""
Optimize and generate responsive images (JPEG + WebP) from the project's `images/` folder.
Produces files into `images/optimized/` with suffixes: -480.jpg, -800.jpg, -1200.jpg and matching .webp.

Usage (Windows PowerShell):
python .\scripts\optimize_images.py

This script requires Pillow (listed in requirements.txt).
"""
from PIL import Image
from pathlib import Path

SRC = Path(__file__).resolve().parents[1] / 'images'
OUT = SRC / 'optimized'
OUT.mkdir(exist_ok=True)

SIZES = [480, 800, 1200]
SKIP = {'optimized'}

def is_image(p: Path):
    return p.suffix.lower() in {'.jpg', '.jpeg', '.png'}

for p in SRC.iterdir():
    if p.is_dir() or p.name in SKIP:
        continue
    if not is_image(p):
        continue
    try:
        img = Image.open(p)
    except Exception as e:
        print(f"Skipping {p.name}: {e}")
        continue
    for w in SIZES:
        ratio = w / img.width
        h = int(img.height * ratio)
        resized = img.resize((w, h), Image.LANCZOS)
        base = p.stem
        out_j = OUT / f"{base}-{w}.jpg"
        out_webp = OUT / f"{base}-{w}.webp"
        resized.save(out_j, format='JPEG', quality=85, optimize=True)
        resized.save(out_webp, format='WEBP', quality=80, method=6)
        print(f"Written: {out_j.name}, {out_webp.name}")

print('Done')
