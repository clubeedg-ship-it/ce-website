#!/usr/bin/env bash
# Publishes a PREVIEW=1 build to a GitHub Pages branch of origin.
# Usage (repo root):  bash scripts/publish-preview.sh
#   default:       site/dist-preview (base /ce-website/) -> branch gh-pages
#   custom domain: PREVIEW_DIR=site/dist-edge PAGES_BRANCH=gh-pages-edge PAGES_CNAME=edge.oopuo.nl bash scripts/publish-preview.sh
#                  (build it first: cd site && PREVIEW=1 PREVIEW_SITE=https://edge.oopuo.nl PREVIEW_BASE=/ \
#                   FONTCONFIG_FILE=$PWD/scripts/fonts/fonts.conf npx astro build --outDir dist-edge)
# PHP files and .htaccess are NOT published (GitHub Pages is static; PHP source must not be shown as text).
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/.." && pwd)
SRC="$ROOT/${PREVIEW_DIR:-site/dist-preview}"
BRANCH="${PAGES_BRANCH:-gh-pages}"
CNAME="${PAGES_CNAME:-}"
[ -f "$SRC/index.html" ] || { echo "run: (cd site && npm run build:preview) first"; exit 1; }
grep -q 'noindex' "$SRC/index.html" || { echo "refusing: $SRC is not a noindex preview build"; exit 1; }
REMOTE=$(git -C "$ROOT" remote get-url origin)
SHA=$(git -C "$ROOT" rev-parse --short HEAD)
TMP=$(mktemp -d "${TMPDIR:-/tmp}/ghp.XXXXXX")
cp -r "$SRC/." "$TMP/"
rm -rf "$TMP/api" "$TMP/.htaccess" "$TMP/_astro/.htaccess" "$TMP/media/.htaccess"
touch "$TMP/.nojekyll"          # _astro/ starts with an underscore: stop Jekyll from dropping it
if [ -n "$CNAME" ]; then printf '%s\n' "$CNAME" > "$TMP/CNAME"; fi
cd "$TMP"
git init -q -b "$BRANCH"
git add -A
git -c user.name="CuttingEdge preview" -c user.email="preview@invalid" commit -q -m "Preview build of v3 @ $SHA (noindex)${CNAME:+ for $CNAME}"
git push -q -f "$REMOTE" "$BRANCH"
echo "published $SHA -> $BRANCH${CNAME:+ (CNAME $CNAME)} ($(du -sh . | cut -f1))"
cd / && rm -rf "$TMP"
