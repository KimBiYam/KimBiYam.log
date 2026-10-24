#!/usr/bin/env python3
"""Build / verify the self-hosted Pretendard subset (src/shared/assets/fonts).

Requires fonttools + brotli (`pip install fonttools brotli`); not an npm dependency.

  python3 scripts/pretendard-subset.py          # regenerate the subset woff2
  python3 scripts/pretendard-subset.py --check  # fail if any used glyph is missing

The subset contains every character used in contents/ and src/ plus a small
baseline (ASCII, punctuation, Hangul jamo), with the wght axis limited to
400-800 (the weights used by the design). Re-run it after adding new posts.
"""
import os
import sys
import tempfile

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE = os.path.join(
    ROOT, 'node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2'
)
OUTPUT = os.path.join(
    ROOT, 'src/shared/assets/fonts/PretendardVariable.subset.woff2'
)
SCAN_DIRS = ('contents', 'src')
SCAN_EXTENSIONS = ('.md', '.mdx', '.ts', '.tsx', '.css', '.json')
BASELINE_RANGES = (
    (0x20, 0x7E),  # ASCII
    (0xA0, 0xFF),  # Latin-1 punctuation and symbols
    (0x2010, 0x2027),  # dashes, quotes, bullets, ellipsis
    (0x2190, 0x2199),  # arrows
    (0x3001, 0x3011),  # CJK punctuation
    (0x3131, 0x3163),  # Hangul compatibility jamo
    (0xFF01, 0xFF5E),  # full-width forms
)
WEIGHT_RANGE = (400, 800)


def collect_used_chars():
    chars = set()
    for scan_dir in SCAN_DIRS:
        for dirpath, dirnames, filenames in os.walk(os.path.join(ROOT, scan_dir)):
            dirnames[:] = [d for d in dirnames if d != 'node_modules']
            for name in filenames:
                if name.endswith(SCAN_EXTENSIONS):
                    path = os.path.join(dirpath, name)
                    with open(path, encoding='utf-8', errors='ignore') as f:
                        chars |= set(f.read())
    return {c for c in chars if not c.isspace() and ord(c) >= 0x20 and ord(c) != 0x7F}


def baseline_chars():
    return {chr(cp) for lo, hi in BASELINE_RANGES for cp in range(lo, hi + 1)}


def source_cmap():
    return set(TTFont(SOURCE).getBestCmap())


def generate():
    supported = source_cmap()
    wanted = {c for c in collect_used_chars() | baseline_chars() if ord(c) in supported}

    # Round-trip through a file so fontTools fully loads the instanced glyphs.
    with tempfile.TemporaryDirectory() as tmp:
        limited = os.path.join(tmp, 'limited.ttf')
        instancer.instantiateVariableFont(
            TTFont(SOURCE), {'wght': WEIGHT_RANGE}
        ).save(limited)
        font = TTFont(limited)
    options = subset.Options()
    options.flavor = 'woff2'
    options.name_IDs = [0, 1, 2, 3, 4, 5, 6, 13, 14]
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=[ord(c) for c in wanted])
    subsetter.subset(font)
    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
    subset.save_font(font, OUTPUT, options)
    print(f'{len(wanted)} glyphs -> {OUTPUT} ({os.path.getsize(OUTPUT)} bytes)')


def check():
    supported = source_cmap()
    subset_cmap = set(TTFont(OUTPUT).getBestCmap())
    used = collect_used_chars()
    missing = sorted(c for c in used if ord(c) in supported and ord(c) not in subset_cmap)
    unsupported = sorted(c for c in used if ord(c) not in supported)
    hangul = sum(1 for c in used if 0xAC00 <= ord(c) <= 0xD7A3)
    print(f'used chars: {len(used)} (hangul syllables: {hangul}), subset glyphs: {len(subset_cmap)}')
    print(f'not in Pretendard (system fallback by design): {"".join(unsupported)}')
    if missing:
        print(f'MISSING from subset ({len(missing)}): {"".join(missing)}')
        sys.exit(1)
    print('OK: every Pretendard-supported character used in contents/ and src/ is in the subset')


if __name__ == '__main__':
    check() if '--check' in sys.argv else generate()
