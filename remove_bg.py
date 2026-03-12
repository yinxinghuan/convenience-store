#!/usr/bin/env python3
"""Remove green-screen backgrounds from character sprites using chroma key (PIL + numpy).
Also auto-crops to character bounding box and scales up to fill canvas.

Usage:
  python3 remove_bg.py                          # main chars (guitarist/coder/hacker/ghost)
  python3 remove_bg.py guitarist                # single main char
  python3 remove_bg.py --customers              # all customer sprites
  python3 remove_bg.py --customers isaya        # single customer
"""
import sys, os
import numpy as np
from PIL import Image

BASE_DIR     = os.path.dirname(os.path.abspath(__file__))
IMG_DIR      = os.path.join(BASE_DIR, "src/ConvenienceStore/img")
CUSTOMER_DIR = os.path.join(BASE_DIR, "src/ConvenienceStore/img/customers")

MAIN_CHARS     = ['guitarist', 'coder', 'hacker', 'ghost']
MAIN_EMOTIONS  = ['normal', 'happy', 'sad', 'surprised', 'shy']

CUSTOMER_CHARS = {
    'chen_bo':  ['normal', 'happy', 'sad', 'surprised'],
    'xiao_li':  ['normal', 'surprised'],
    'isaya':    ['normal', 'sad', 'surprised'],
    'drunk':    ['normal', 'happy', 'surprised'],
    'robber':   ['normal', 'surprised'],
    'mei_popo': ['normal', 'happy', 'sad', 'curious'],
    'cry_guy':  ['normal', 'surprised'],
    'isabel':   ['normal', 'curious'],
}

# Chroma key parameters
# Main chars: THRESHOLD=150 (higher = safer for Jenny's green eyes)
# Customers:  THRESHOLD=80  (more aggressive, none have green eyes)
FEATHER = 40
MARGIN  = 0.01


def chroma_key(img_path, threshold=80):
    img = Image.open(img_path).convert("RGBA")
    orig_w, orig_h = img.size
    data = np.array(img, dtype=np.float32)
    r, g, b = data[:, :, 0], data[:, :, 1], data[:, :, 2]

    greenness    = g - np.maximum(r, b)
    alpha_remove = np.clip((greenness - (threshold - FEATHER)) / FEATHER, 0.0, 1.0)
    data[:, :, 3] = data[:, :, 3] * (1.0 - alpha_remove)
    result = Image.fromarray(data.astype(np.uint8))

    alpha = np.array(result)[:, :, 3]
    rows  = np.any(alpha > 10, axis=1)
    cols  = np.any(alpha > 10, axis=0)
    if not rows.any():
        result.save(img_path)
        return

    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]

    pad_h = int((rmax - rmin) * MARGIN)
    pad_w = int((cmax - cmin) * MARGIN)
    rmin  = max(0, rmin - pad_h)
    rmax  = min(orig_h - 1, rmax + pad_h)
    cmin  = max(0, cmin - pad_w)
    cmax  = min(orig_w - 1, cmax + pad_w)

    cropped = result.crop((cmin, rmin, cmax + 1, rmax + 1))
    crop_w, crop_h = cropped.size
    scale  = min(orig_w / crop_w, orig_h / crop_h)
    scaled = cropped.resize((int(crop_w * scale), int(crop_h * scale)), Image.LANCZOS)

    canvas = Image.new("RGBA", (orig_w, orig_h), (0, 0, 0, 0))
    canvas.paste(scaled, ((orig_w - scaled.width) // 2, orig_h - scaled.height))
    canvas.save(img_path)


# ── Parse args ────────────────────────────────────────────────────────────────
args = sys.argv[1:]

if '--customers' in args:
    args.remove('--customers')
    mode = 'customers'
    targets = args if args else list(CUSTOMER_CHARS.keys())
else:
    mode = 'main'
    targets = args if args else MAIN_CHARS

# ── Run ───────────────────────────────────────────────────────────────────────
if mode == 'main':
    for char in targets:
        for emotion in MAIN_EMOTIONS:
            src = os.path.join(IMG_DIR, f"{char}_{emotion}.png")
            if not os.path.exists(src):
                print(f"  skip {char}_{emotion} (not found)")
                continue
            print(f"  {char}_{emotion}...", end=" ", flush=True)
            chroma_key(src, threshold=150)
            print("done")
else:
    os.makedirs(CUSTOMER_DIR, exist_ok=True)
    for char in targets:
        if char not in CUSTOMER_CHARS:
            print(f"  unknown customer: {char}")
            continue
        for emotion in CUSTOMER_CHARS[char]:
            src = os.path.join(CUSTOMER_DIR, f"{char}_{emotion}.png")
            if not os.path.exists(src):
                print(f"  skip {char}_{emotion} (not found)")
                continue
            print(f"  {char}_{emotion}...", end=" ", flush=True)
            chroma_key(src, threshold=80)
            print("done")

print("\nAll done!")
