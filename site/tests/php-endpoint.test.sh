#!/usr/bin/env bash
# End-to-end tests for site/public/api/contact.php using PHP's built-in server (no Apache needed).
# Usage: PHP_BIN=/path/to/php bash site/tests/php-endpoint.test.sh
# Covers: token, success (+mail headers, +log), validation errors, honeypot, time-trap, rate limit,
#         mail failure still logs, storage failure -> 500, header injection, foreign origin, no-JS redirect.
set -u
PHP_BIN=${PHP_BIN:-php}
HERE=$(cd "$(dirname "$0")/.." && pwd)
T=$(mktemp -d "${TMPDIR:-/tmp}/ce-php-test.XXXXXX")
PASS=0; FAIL=0
ok()   { PASS=$((PASS+1)); echo "PASS  $1"; }
bad()  { FAIL=$((FAIL+1)); echo "FAIL  $1  -> $2"; }
check() { # name, condition-result(0=ok), detail
  if [ "$2" = 0 ]; then ok "$1"; else bad "$1" "${3:-}"; fi
}

# fake sendmail: stores the whole message in $T/mail/<n>.eml and succeeds
mkdir -p "$T/mail"
cat > "$T/sendmail-ok.sh" <<E
#!/usr/bin/env bash
cat > "$T/mail/\$(date +%s%N).eml"
exit 0
E
chmod +x "$T/sendmail-ok.sh"

start_server() { # name port sendmail data_dir rate_max
  local name=$1 port=$2 sm=$3 data=$4 rmax=$5
  mkdir -p "$T/$name"; cp -r "$HERE/public/api" "$T/$name/api"
  cat > "$T/$name/api/config.php" <<E
<?php return [
  'recipients' => ['studio@example.test'], 'from' => 'no-reply@example.test', 'from_name' => 'Test', 'subject_prefix' => '[T]',
  'envelope_from' => false, 'data_dir' => '$data', 'rate_limit' => ['max' => $rmax, 'window' => 3600], 'min_seconds' => 3,
  'max_body' => 65536, 'secret' => '', 'trust_proxy_header' => false, 'allowed_hosts' => [],
  'thanks_urls' => ['en' => '/contact/thank-you/', 'nl' => '/nl/contact/bedankt/'],
  'fallback_whatsapp' => 'https://wa.me/31647639702', 'fallback_email' => 'studio@example.test',
];
E
  "$PHP_BIN" -d "sendmail_path=$sm" -S "127.0.0.1:$port" -t "$T/$name" > "$T/$name.log" 2>&1 &
  echo $! > "$T/$name.pid"
  for _ in $(seq 1 40); do curl -s -o /dev/null "http://127.0.0.1:$port/api/contact.php" && break; sleep 0.1; done
}
stop_all() { for f in "$T"/*.pid; do kill "$(cat "$f")" 2>/dev/null; done; }
trap stop_all EXIT

good_fields=(-d sector=hospitality -d "services[]=turn-key-build" -d "services[]=concept-design" -d "location=Amsterdam" -d size_m2=120
  -d budget=50-100k -d timeline=3m -d "name=Test Visitor" -d "email=visitor@example.org" -d "phone=+31 6 12345678"
  -d "message=Hello, we plan a restaurant." -d consent=1 -d lang=en)
J=(-H "Accept: application/json")
lines() { [ -f "$1" ] && wc -l < "$1" | tr -d ' ' || echo 0; }

# ---------------- main server (rate limit high, mail OK) ----------------
P1=18741; start_server main $P1 "$T/sendmail-ok.sh" "$T/data-main" 1000
U1="http://127.0.0.1:$P1/api/contact.php"

R=$(curl -s "${J[@]}" "$U1?token=1"); echo "$R" | grep -q '"tk":"[0-9]*\.[0-9a-f]\{64\}"'; check "GET ?token=1 returns a signed token" $? "$R"
TK=$(echo "$R" | sed 's/.*"tk":"\([^"]*\)".*/\1/')

# time-trap: immediate submit with a fresh token is rejected
CODE=$(curl -s -o "$T/o.json" -w '%{http_code}' "${J[@]}" "${good_fields[@]}" --data-urlencode "tk=$TK" "$U1")
[ "$CODE" = 422 ] && grep -q too_fast "$T/o.json"; check "time-trap: submit <3 s after token -> 422 too_fast" $? "$CODE $(cat "$T/o.json")"
[ "$(lines "$T/data-main/leads.jsonl")" = 0 ]; check "time-trap: nothing stored" $?

sleep 4
CODE=$(curl -s -o "$T/o.json" -w '%{http_code}' "${J[@]}" "${good_fields[@]}" --data-urlencode "tk=$TK" "$U1")
[ "$CODE" = 200 ] && grep -q '"ok":true' "$T/o.json"; check "valid submit with aged token -> 200 {ok:true}" $? "$CODE $(cat "$T/o.json")"
[ "$(lines "$T/data-main/leads.jsonl")" = 2 ]; check "log has the lead + the mail-result line" $? "$(lines "$T/data-main/leads.jsonl")"
head -1 "$T/data-main/leads.jsonl" | grep -q '"email":"visitor@example.org"' && head -1 "$T/data-main/leads.jsonl" | grep -q '"token":"ok"'; check "lead line holds the data and token=ok" $?
tail -1 "$T/data-main/leads.jsonl" | grep -q '"event":"mail","ok":true'; check "mail result recorded as ok" $?
EML=$(ls "$T"/mail/*.eml 2>/dev/null | head -1)
grep -qi '^To: studio@example.test' "$EML" && grep -qi '^Reply-To: .*<visitor@example.org>' "$EML" && grep -q 'Amsterdam' "$EML"; check "mail has recipient, Reply-To = visitor, body" $? "$(head -12 "$EML" 2>/dev/null)"
grep -qi 'Subject:' "$EML"; check "mail has Subject" $?
[ -f "$T/data-main/.htaccess" ] && grep -q 'denied' "$T/data-main/.htaccess"; check "data dir gets a deny-all .htaccess" $?

# success without token (no-JS path)
CODE=$(curl -s -o "$T/o.json" -w '%{http_code}' "${J[@]}" "${good_fields[@]}" "$U1")
[ "$CODE" = 200 ]; check "valid submit without token (no-JS style) accepted" $? "$CODE"
tail -2 "$T/data-main/leads.jsonl" | head -1 | grep -q '"token":"none"'; check "…flagged token=none in the log" $?

# validation
BEFORE=$(lines "$T/data-main/leads.jsonl")
CODE=$(curl -s -o "$T/o.json" -w '%{http_code}' "${J[@]}" -d sector=hospitality -d location=X -d "name=A" -d lang=en "$U1")
[ "$CODE" = 422 ] && grep -q '"email":"required"' "$T/o.json" && grep -q '"consent":"consent"' "$T/o.json"; check "missing email+consent -> 422 with field codes" $? "$CODE $(cat "$T/o.json")"
CODE=$(curl -s -o "$T/o.json" -w '%{http_code}' "${J[@]}" -d sector=hospitality -d location=X -d "name=A" -d email=not-an-email -d consent=1 "$U1")
[ "$CODE" = 422 ] && grep -q '"email":"email"' "$T/o.json"; check "invalid email -> 422 email" $? "$(cat "$T/o.json")"
CODE=$(curl -s -o "$T/o.json" -w '%{http_code}' "${J[@]}" -d sector=bogus -d location=X -d "name=A" -d email=a@b.co -d consent=1 "$U1")
[ "$CODE" = 422 ] && grep -q '"sector":"choose"' "$T/o.json"; check "unknown sector value -> 422 choose" $?
CODE=$(curl -s -o "$T/o.json" -w '%{http_code}' "${J[@]}" -d sector=hospitality -d location=X -d "name=A" -d email=a@b.co -d consent=1 -d size_m2=abc "$U1")
[ "$CODE" = 422 ] && grep -q '"size_m2":"number"' "$T/o.json"; check "non-numeric size -> 422 number" $?
[ "$(lines "$T/data-main/leads.jsonl")" = "$BEFORE" ]; check "invalid submissions are not stored" $?

# honeypot
CODE=$(curl -s -o "$T/o.json" -w '%{http_code}' "${J[@]}" "${good_fields[@]}" -d website=http://spam.example "$U1")
[ "$CODE" = 200 ] && grep -q '"ok":true' "$T/o.json" && [ "$(lines "$T/data-main/leads.jsonl")" = "$BEFORE" ]; check "honeypot filled: looks OK to the bot, stores/mails nothing" $?

# header injection
N0=$(ls "$T"/mail | wc -l)
curl -s -o /dev/null "${J[@]}" "${good_fields[@]}" --data-urlencode $'name=Evil\r\nBcc: attacker@example.net' --data-urlencode $'email=ok@example.org' "$U1"
EML=$(ls -t "$T"/mail/*.eml | head -1)
! grep -qi '^Bcc:' "$EML"; check "CRLF in name cannot inject a Bcc header" $?

# foreign origin
CODE=$(curl -s -o /dev/null -w '%{http_code}' "${J[@]}" -H "Origin: https://evil.example" "${good_fields[@]}" "$U1")
[ "$CODE" = 403 ]; check "foreign Origin -> 403" $? "$CODE"

# plain (non-JS) form posts
HDR=$(curl -s -D - -o /dev/null "${good_fields[@]}" "$U1")
echo "$HDR" | head -1 | grep -q 303 && echo "$HDR" | grep -qi 'location: /contact/thank-you/'; check "plain POST success -> 303 to the thank-you page" $? "$(echo "$HDR" | head -3)"
HDR=$(curl -s -D - -o /dev/null -d lang=nl -d sector=residential -d location=Utrecht -d "name=Jan" -d email=jan@example.nl -d consent=1 "$U1")
echo "$HDR" | grep -qi 'location: /nl/contact/bedankt/'; check "plain POST in NL -> 303 to the Dutch thank-you page" $?
PAGE=$(curl -s -d sector=hospitality "$U1")
echo "$PAGE" | grep -q 'wa.me/31647639702' && echo "$PAGE" | grep -q 'mailto:studio@example.test'; check "plain POST error page offers WhatsApp + email fallback" $?
CODE=$(curl -s -o /dev/null -w '%{http_code}' -X PUT "$U1"); [ "$CODE" = 405 ]; check "PUT -> 405" $? "$CODE"

# ---------------- rate limit server ----------------
P2=18742; start_server rate $P2 "$T/sendmail-ok.sh" "$T/data-rate" 3
U2="http://127.0.0.1:$P2/api/contact.php"
C=(); for i in 1 2 3 4 5; do C+=("$(curl -s -o /dev/null -w '%{http_code}' "${J[@]}" "${good_fields[@]}" "$U2")"); done
[ "${C[0]}${C[1]}${C[2]}" = 200200200 ] && [ "${C[3]}" = 429 ] && [ "${C[4]}" = 429 ]; check "rate limit: 3 accepted, then 429 (got ${C[*]})" $?
[ "$(grep -c '"event"' "$T/data-rate/leads.jsonl")" = 3 ]; check "rate limit: blocked requests stored nothing" $?

# ---------------- mail failure still logs ----------------
P3=18743; start_server nomail $P3 "/bin/false" "$T/data-nomail" 1000
U3="http://127.0.0.1:$P3/api/contact.php"
CODE=$(curl -s -o "$T/o.json" -w '%{http_code}' "${J[@]}" "${good_fields[@]}" "$U3")
[ "$CODE" = 200 ] && grep -q '"ok":true' "$T/o.json"; check "mail failure: visitor still gets OK (lead is safe in the log)" $? "$CODE"
head -1 "$T/data-nomail/leads.jsonl" | grep -q 'visitor@example.org'; check "mail failure: lead is in leads.jsonl" $?
tail -1 "$T/data-nomail/leads.jsonl" | grep -q '"event":"mail","ok":false'; check "mail failure: recorded as ok:false for follow-up" $?

# ---------------- storage + mail both fail -> honest error ----------------
P4=18744; start_server nostore $P4 "/bin/false" "/proc/ce-cannot-write-here" 1000
U4="http://127.0.0.1:$P4/api/contact.php"
CODE=$(curl -s -o "$T/o.json" -w '%{http_code}' "${J[@]}" "${good_fields[@]}" "$U4")
[ "$CODE" = 500 ] && grep -q '"ok":false' "$T/o.json"; check "log AND mail unavailable: HTTP 500 {ok:false}, never a fake success" $? "$CODE $(cat "$T/o.json")"

stop_all
echo; echo "RESULT: $PASS passed, $FAIL failed  (workdir $T)"
[ "$FAIL" = 0 ]
