#!/usr/bin/env python3
"""Builds side-by-side before/after comparison JPEGs from the PNGs produced by tests/shots.mjs.
usage: python3 site/tests/compare-shots.py <shots-dir> <out-dir>"""
import json, os, sys
from PIL import Image, ImageDraw

src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
cfg = {'1440': dict(w=720, maxh=2600), '390': dict(w=330, maxh=2900)}
weights = json.load(open(os.path.join(src, 'weights.json')))
for page in ['home', 'projects', 'project', 'contact']:
    for vp, c in cfg.items():
        tiles = []
        for side in ('before', 'after'):
            im = Image.open(os.path.join(src, f'{page}-{vp}-{side}.png')).convert('RGB')
            full_h = im.height
            r = c['w'] / im.width
            im = im.resize((c['w'], int(im.height * r)), Image.LANCZOS)
            im = im.crop((0, 0, c['w'], min(im.height, c['maxh'])))
            tiles.append((im, full_h))
        pad, head = 16, 54
        H = max(t[0].height for t in tiles) + head + pad
        sheet = Image.new('RGB', (c['w'] * 2 + pad * 3, H), (24, 24, 24))
        d = ImageDraw.Draw(sheet)
        for i, side in enumerate(('before', 'after')):
            x = pad + i * (c['w'] + pad)
            w = weights[f'{page}-{vp}-{side}']
            label = ('LIVE today' if side == 'before' else 'v3') + f"  ·  {w['bytes']/1048576:.1f} MB, {w['requests']} requests, full page {tiles[i][1]} px tall"
            d.text((x, 14), label, fill=(232, 228, 218))
            sheet.paste(tiles[i][0], (x, head))
        sheet.save(os.path.join(out, f'{page}-{vp}-before-after.jpg'), quality=70, optimize=True)
        print(page, vp, os.path.getsize(os.path.join(out, f'{page}-{vp}-before-after.jpg')) // 1024, 'KB')
