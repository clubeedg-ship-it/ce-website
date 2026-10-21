#!/usr/bin/env bash
# Local Lighthouse (mobile preset) for key pages. Usage:
#   bash site/tests/lighthouse.sh <outdir> <base-url> [cpuSlowdown]
# Needs a Chrome listening on :9333, e.g. on this host:
#   export LD_LIBRARY_PATH=~/.local/share/chromium-deps/root/usr/lib/x86_64-linux-gnu
#   ~/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell \
#       --no-sandbox --disable-gpu --remote-debugging-port=9333 --user-data-dir=/tmp/chrome-prof about:blank &
# The host CPU (2009 Core i5) is far slower than the reference machine Lighthouse's default 4x throttling assumes,
# so a lower cpuSlowdown (default 1) is reported next to the default 4x. Both raw results are kept.
set -u
OUT=${1:?outdir}; BASE=${2:?base url}; SLOW=${3:-1}
LH=${LH:-$(command -v lighthouse || echo "npx --no-install lighthouse")}
mkdir -p "$OUT"
for p in "" projects/ projects/hospitality-collection/ contact/ nl/ nl/projecten/ nl/contact/; do
  name=$(echo "${p:-home}" | tr '/' '_'); name=${name%_}
  for s in 4 $SLOW; do
    f="$OUT/${name}-cpu${s}.json"
    $LH "$BASE/$p" --port=9333 --quiet --output=json --output-path="$f" --preset=perf --form-factor=mobile --screenEmulation.mobile --screenEmulation.width=412 --screenEmulation.height=823 \
      --only-categories=performance,accessibility,best-practices,seo --throttling.cpuSlowdownMultiplier=$s >/dev/null 2>&1
    python3 - "$f" "$p" "$s" <<'PY'
import json,sys
try: j=json.load(open(sys.argv[1]))
except Exception as e: print(sys.argv[2] or '/', 'cpu'+sys.argv[3], 'FAILED', e); sys.exit()
c=j['categories']; a=j['audits']; g=lambda k: round(c[k]['score']*100)
print(f"/{sys.argv[2]:<28} cpu{sys.argv[3]}x perf={g('performance')} a11y={g('accessibility')} bp={g('best-practices')} seo={g('seo')} LCP={a['largest-contentful-paint']['displayValue']} CLS={a['cumulative-layout-shift']['displayValue']} TBT={a['total-blocking-time']['displayValue']} FCP={a['first-contentful-paint']['displayValue']}")
PY
  done
done
