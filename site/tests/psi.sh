#!/usr/bin/env bash
# PageSpeed Insights (mobile) for a list of URLs. Usage: bash psi.sh <outdir> <url>...
# No API key: shared quota, retries on 429. Saves raw JSON and prints a score table.
OUT=$1; shift; mkdir -p "$OUT"
API=https://www.googleapis.com/pagespeedonline/v5/runPagespeed
for u in "$@"; do
  name=$(echo "$u" | sed 's#https\?://[^/]*/##; s#[/.]#_#g; s#_$##'); [ -z "$name" ] && name=root
  f="$OUT/$name.json"
  for try in 1 2 3 4 5 6; do
    code=$(curl -s -m 150 -o "$f" -w '%{http_code}' -G "$API" --data-urlencode "url=$u" --data-urlencode strategy=mobile \
      --data-urlencode category=performance --data-urlencode category=accessibility --data-urlencode category=best-practices --data-urlencode category=seo)
    [ "$code" = 200 ] && break
    echo "  $u -> HTTP $code (try $try)" >&2; sleep $((20*try))
  done
  python3 - "$f" "$u" <<'PY'
import json,sys
try: j=json.load(open(sys.argv[1]))
except Exception as e: print(sys.argv[2],'FAILED',e); sys.exit()
if 'lighthouseResult' not in j: print(sys.argv[2],'FAILED',str(j)[:150]); sys.exit()
L=j['lighthouseResult']; c=L['categories']; a=L['audits']
g=lambda k:round(c[k]['score']*100) if c[k]['score'] is not None else None
print(f"{sys.argv[2]} perf={g('performance')} a11y={g('accessibility')} bp={g('best-practices')} seo={g('seo')} LCP={a['largest-contentful-paint']['displayValue']} CLS={a['cumulative-layout-shift']['displayValue']} TBT={a['total-blocking-time']['displayValue']} FCP={a['first-contentful-paint']['displayValue']} SI={a['speed-index']['displayValue']}")
PY
done
