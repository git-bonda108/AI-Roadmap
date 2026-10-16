#!/bin/sh
# Render the ready-made booklet PDFs with headless Chrome.
# Uses ?safe=1 so only openly licensed fonts (Georgia / Open Sans / Menlo) are embedded — never the Anthropic fonts.
# Usage: scripts/make_pdfs.sh [base-url]   (default: local dev server)
set -e
BASE="${1:-http://localhost:5179}"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/pdf"
mkdir -p "$OUT"
for b in ai-practitioner data-citizen both; do
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --run-all-compositor-stages-before-draw \
    --virtual-time-budget=8000 --print-to-pdf="$OUT/AI-Roadmap-$b.pdf" \
    "$BASE/#/print?b=$b&safe=1" 2>/dev/null
  echo "wrote $OUT/AI-Roadmap-$b.pdf"
done
"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --run-all-compositor-stages-before-draw \
  --virtual-time-budget=8000 --print-to-pdf="$OUT/AI-Roadmap-Mindset-Approach-Note.pdf" \
  "$BASE/#/approach?safe=1" 2>/dev/null
echo "wrote $OUT/AI-Roadmap-Mindset-Approach-Note.pdf"
