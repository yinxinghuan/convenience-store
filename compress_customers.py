#!/usr/bin/env python3
"""Resize and compress customer sprites to 320px wide."""
import os
from PIL import Image

CUSTOMERS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                              'src/ConvenienceStore/img/customers')
MAX_W = 320


def compress(path: str):
    img = Image.open(path).convert('RGBA')
    w, h = img.size
    if w <= MAX_W:
        return 0
    new_h = round(h * MAX_W / w)
    resized = img.resize((MAX_W, new_h), Image.LANCZOS)
    before = os.path.getsize(path)
    resized.save(path, optimize=True, compress_level=9)
    return before - os.path.getsize(path)


total_saved = 0
for f in sorted(os.listdir(CUSTOMERS_DIR)):
    if not f.endswith('.png'):
        continue
    path = os.path.join(CUSTOMERS_DIR, f)
    saved = compress(path)
    after_kb = os.path.getsize(path) // 1024
    if saved > 0:
        print(f'  {f}: saved {saved // 1024}KB → {after_kb}KB')
    else:
        print(f'  {f}: already {after_kb}KB (skipped)')
    total_saved += saved

print(f'\nTotal saved: {total_saved // 1024}KB')
