#!/usr/bin/env python3
"""Remove green-screen backgrounds from character sprites using chroma key (PIL + numpy).
Also auto-crops to character bounding box and scales up to fill canvas."""
import sys, os
import numpy as np
from PIL import Image

IMG_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src/ConvenienceStore/img")
CHARS = ['guitarist', 'coder', 'hacker', 'ghost']
EMOTIONS = ['normal', 'happy', 'sad', 'surprised', 'shy']

# Chroma key parameters
THRESHOLD = 150   # greenness = G - max(R,B) must exceed this to be removed (higher = safer for green eyes)
FEATHER = 40      # transition zone width for soft edges (anti-aliasing)

# Autocrop + scale parameters
MARGIN = 0.01     # keep this fraction of canvas as padding on each side after crop


def chroma_key(img_path):
    img = Image.open(img_path).convert("RGBA")
    orig_w, orig_h = img.size
    data = np.array(img, dtype=np.float32)
    r, g, b = data[:, :, 0], data[:, :, 1], data[:, :, 2]

    # Greenness: how much more green than the other two channels
    greenness = g - np.maximum(r, b)

    # Soft alpha: 1.0 = fully green (erase), 0.0 = not green (keep)
    alpha_remove = np.clip((greenness - (THRESHOLD - FEATHER)) / FEATHER, 0.0, 1.0)
    data[:, :, 3] = data[:, :, 3] * (1.0 - alpha_remove)

    result = Image.fromarray(data.astype(np.uint8))

    # ── Autocrop: find bounding box of non-transparent pixels ────────────────
    alpha = np.array(result)[:, :, 3]
    rows = np.any(alpha > 10, axis=1)
    cols = np.any(alpha > 10, axis=0)
    if not rows.any():
        result.save(img_path)
        return

    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]

    # Add margin
    pad_h = int((rmax - rmin) * MARGIN)
    pad_w = int((cmax - cmin) * MARGIN)
    rmin = max(0, rmin - pad_h)
    rmax = min(orig_h - 1, rmax + pad_h)
    cmin = max(0, cmin - pad_w)
    cmax = min(orig_w - 1, cmax + pad_w)

    cropped = result.crop((cmin, rmin, cmax + 1, rmax + 1))

    # Scale to fill original canvas, anchor to bottom
    crop_w, crop_h = cropped.size
    scale = min(orig_w / crop_w, orig_h / crop_h)
    new_w = int(crop_w * scale)
    new_h = int(crop_h * scale)
    scaled = cropped.resize((new_w, new_h), Image.LANCZOS)

    # Paste onto transparent canvas, bottom-center aligned
    canvas = Image.new("RGBA", (orig_w, orig_h), (0, 0, 0, 0))
    x = (orig_w - new_w) // 2
    y = orig_h - new_h
    canvas.paste(scaled, (x, y))
    canvas.save(img_path)


targets = sys.argv[1:] if len(sys.argv) > 1 else CHARS

for char in targets:
    for emotion in EMOTIONS:
        src = os.path.join(IMG_DIR, f"{char}_{emotion}.png")
        if not os.path.exists(src):
            print(f"  skip {char}_{emotion} (not found)")
            continue
        print(f"  {char}_{emotion}...", end=" ", flush=True)
        chroma_key(src)
        print("done")

print("\nAll done!")
