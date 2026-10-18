#!/usr/bin/env bash
# Renderiza cards/*.html em img/*.jpg (1080x1350). Requer Chrome + Python com Pillow.
set -e
cd "$(dirname "$0")/.."
CH="/c/Program Files/Google/Chrome/Application/chrome.exe"
PROF="${TMP:-/tmp}/ngs-chprof"
mkdir -p img
for h in cards/*.html; do
  f=$(basename "$h" .html)
  "$CH" --headless=new --disable-gpu --hide-scrollbars --user-data-dir="$PROF" --window-size=1080,1350 \
    --virtual-time-budget=5000 --screenshot="$(cygpath -w "$PWD/img/$f.png")" "file:///$(cygpath -m "$PWD/$h")" >/dev/null 2>&1
done
python -c "
import glob, os
from PIL import Image
for p in glob.glob('img/*.png'):
    Image.open(p).convert('RGB').save(p[:-4] + '.jpg', quality=92); os.remove(p)
print(len(glob.glob('img/*.jpg')), 'cards')"
