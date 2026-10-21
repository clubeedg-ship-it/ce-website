#!/usr/bin/env bash
# Verifies the legacy -> new 301 redirects defined in site/redirects.tsv against a running site.
# Usage:  scripts/check-redirects.sh https://cuttingedge.world        (after deploy)
#         scripts/check-redirects.sh http://localhost:8080             (against a local Apache/LiteSpeed)
# For every row it asserts: HTTP 301, Location = <base>/<new path>, and the target answers 200.
# "prefix" rows are tested with a sample file below the prefix (sample.jpg).
set -u
BASE=${1:?usage: check-redirects.sh <base-url>}
BASE=${BASE%/}
TSV="$(cd "$(dirname "$0")/.." && pwd)/site/redirects.tsv"
pass=0; fail=0
while IFS=$'\t' read -r from to kind note; do
  case "$from" in ''|\#*) continue;; esac
  path="$from"; [ "$kind" = prefix ] && path="${from}sample.jpg"
  out=$(curl -s -o /dev/null -I -w '%{http_code} %{redirect_url}' "$BASE/$path")
  code=${out%% *}; loc=${out#* }
  want="$BASE/${to#/}"
  if [ "$code" = 301 ] && [ "$loc" = "$want" ]; then
    final=$(curl -s -o /dev/null -w '%{http_code}' "$want")
    if [ "$final" = 200 ]; then pass=$((pass+1)); printf 'ok    /%s -> /%s\n' "$path" "$to"
    else fail=$((fail+1)); printf 'FAIL  /%s -> /%s (target answers %s)\n' "$path" "$to" "$final"; fi
  else
    fail=$((fail+1)); printf 'FAIL  /%s: got %s %s, want 301 %s\n' "$path" "$code" "$loc" "$want"
  fi
done < "$TSV"
echo "redirects: $pass ok, $fail failed"
[ "$fail" = 0 ]
