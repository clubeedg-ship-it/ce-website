#!/usr/bin/env bash
# Publishes site/dist-preview (PREVIEW=1 build, base /ce-website/) to the gh-pages branch of origin.
# Usage (repo root):  bash scripts/publish-preview.sh
# PHP files and .htaccess are NOT published (GitHub Pages is static; PHP source must not be shown as text).
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/.." && pwd)
SRC="$ROOT/site/dist-preview"
[ -f "$SRC/index.html" ] || { echo "run: (cd site && npm run build:preview) first"; exit 1; }
grep -q 'noindex' "$SRC/index.html" || { echo "refusing: dist-preview is not a noindex preview build"; exit 1; }
REMOTE=$(git -C "$ROOT" remote get-url origin)
SHA=$(git -C "$ROOT" rev-parse --short HEAD)
TMP=$(mktemp -d "${TMPDIR:-/tmp}/ghp.XXXXXX")
cp -r "$SRC/." "$TMP/"
rm -rf "$TMP/api" "$TMP/.htaccess" "$TMP/_astro/.htaccess" "$TMP/media/.htaccess"
touch "$TMP/.nojekyll"          # _astro/ starts with an underscore: stop Jekyll from dropping it
cd "$TMP"
git init -q -b gh-pages
git add -A
git -c user.name="CuttingEdge preview" -c user.email="preview@invalid" commit -q -m "Preview build of v3 @ $SHA (noindex)"
git push -q -f "$REMOTE" gh-pages
echo "published $SHA -> gh-pages ($(du -sh . | cut -f1))"
