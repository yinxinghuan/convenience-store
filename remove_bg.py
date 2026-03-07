#!/usr/bin/env python3
"""Remove green-screen backgrounds from character sprites using chroma key (PIL + numpy)."""
import sys, os
import numpy as np
from PIL import Image

IMG_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src/ConvenienceStore/img")
CHARS = ['guitarist', 'coder', 'hacker', 'ghost']
EMOTIONS = ['normal', 'happy', 'sad', 'surprised', 'shy']

# Chroma key parameters
THRESHOLD = 80    # greenness = G - max(R,B) must exceed this to be removed
FEATHER = 40      # transition zone width for soft edges (anti-aliasing)

def chroma_key(img_path):
    img = Image.open(img_path).convert("RGBA")
    data = np.array(img, dtype=np.float32)
    r, g, b = data[:, :, 0], data[:, :, 1], data[:, :, 2]

    # Greenness: how much more green than the other two channels
    greenness = g - np.maximum(r, b)

    # Soft alpha: 1.0 = fully green (erase), 0.0 = not green (keep)
    alpha_remove = np.clip((greenness - (THRESHOLD - FEATHER)) / FEATHER, 0.0, 1.0)

    # Apply: reduce existing alpha
    data[:, :, 3] = data[:, :, 3] * (1.0 - alpha_remove)
    result = Image.fromarray(data.astype(np.uint8))
    result.save(img_path)

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
