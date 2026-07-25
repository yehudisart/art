#!/usr/bin/env python3
"""
Generate the four web variants for a new painting.

    python3 tools/add-image.py ~/Desktop/new-painting.jpg bloom-ii

Writes into assets/img/:
    bloom-ii.jpg      bloom-ii.webp        (full size, used in the lightbox)
    bloom-ii-sm.jpg   bloom-ii-sm.webp     (700px, used in grids and cards)

Then add an entry to CATEGORIES in index.html:
    { img: 'bloom-ii', title: 'Bloom II', medium: 'Oil on canvas' }

Requires Pillow:  pip install Pillow
"""
import os
import sys

from PIL import Image

OUT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'img')


def build(src_path, name):
    im = Image.open(src_path).convert('RGB')
    os.makedirs(OUT, exist_ok=True)

    full = im.copy()
    full.thumbnail((1400, 1400), Image.LANCZOS)
    full.save(os.path.join(OUT, name + '.jpg'), 'JPEG',
              quality=84, optimize=True, progressive=True, subsampling=1)
    full.save(os.path.join(OUT, name + '.webp'), 'WEBP', quality=80, method=6)

    small = full.copy()
    small.thumbnail((700, 700), Image.LANCZOS)
    small.save(os.path.join(OUT, name + '-sm.jpg'), 'JPEG',
               quality=78, optimize=True, progressive=True, subsampling=1)
    small.save(os.path.join(OUT, name + '-sm.webp'), 'WEBP', quality=72, method=6)

    print('Source     %dx%d' % im.size)
    for suffix in ('.jpg', '.webp', '-sm.jpg', '-sm.webp'):
        path = os.path.join(OUT, name + suffix)
        print('  %-22s %7.1f KB' % (name + suffix, os.path.getsize(path) / 1024))
    print('\nNow add this to CATEGORIES in index.html:')
    print("  { img: '%s', title: 'TITLE', medium: 'Oil on canvas' }" % name)


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit('usage: python3 tools/add-image.py <source-image> <slug>')
    build(sys.argv[1], sys.argv[2])
