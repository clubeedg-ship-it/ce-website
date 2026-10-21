<?php
declare(strict_types=1);
/**
 * CuttingEdge enquiry endpoint. Self-contained: no third-party services, no database.
 *   GET  ?token=1  -> {"tk": "..."}   signed timestamp for the time-trap
 *   POST           -> validates, logs to JSONL, mails, answers JSON (Accept: application/json) or redirects (plain form)
 * Settings live in config.php. Requires PHP >= 7.4.
 */

const CE_VERSION = '3.0';

ini_set('display_errors', '0');
$config = require __DIR__ . '/config.php';
$optionsFile = __DIR__ . '/form-options.json';
$options = is_file($optionsFile) ? json_decode((string) file_get_contents($optionsFile), true) : null;
if (!is_array($options)) { $options = ['sectors' => [], 'services' => [], 'budgets' => [], 'timelines' => []]; }

header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
header('Referrer-Policy: no-referrer');

function wants_json(): bool
{
    $a = $_SERVER['HTTP_ACCEPT'] ?? '';
    return strpos($a, 'application/json') !== false || (($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') === 'XMLHttpRequest');
}

function respond_json(int $status, array $body): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function respond_error_page(int $status, string $title, array $lines, array $config): void
{
    http_response_code($status);
    header('Content-Type: text/html; charset=utf-8');
    header("Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'none'");
    $li = '';
    foreach ($lines as $l) { $li .= '<li>' . htmlspecialchars($l, ENT_QUOTES, 'UTF-8') . '</li>'; }
    $wa = htmlspecialchars((string) $config['fallback_whatsapp'], ENT_QUOTES, 'UTF-8');
    $em = htmlspecialchars((string) $config['fallback_email'], ENT_QUOTES, 'UTF-8');
    echo '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">'
        . '<title>' . htmlspecialchars($title, ENT_QUOTES, 'UTF-8') . '</title>'
        . '<body style="font:18px/1.6 system-ui,sans-serif;background:#121212;color:#e8e4da;max-width:40rem;margin:4rem auto;padding:0 1.25rem">'
        . '<h1 style="font-weight:500">' . htmlspecialchars($title, ENT_QUOTES, 'UTF-8') . '</h1><ul>' . $li . '</ul>'
        . '<p>You can also reach us directly: <a style="color:#d4af37" href="' . $wa . '">WhatsApp</a> · <a style="color:#d4af37" href="mailto:' . $em . '">' . $em . '</a></p>'
        . '<p><a style="color:#d4af37" href="javascript:history.back()">&larr; Back to the form</a></p></body></html>';
    exit;
}

function fail(int $status, string $code, array $errors, array $config): void
{
    if (wants_json()) {
        respond_json($status, ['ok' => false, 'error' => $code, 'errors' => (object) $errors]);
    }
    $nice = [
        'required' => 'a required field is empty', 'email' => 'the email address looks invalid', 'consent' => 'the consent box must be ticked',
        'choose' => 'please choose an option', 'number' => 'enter a number', 'too_fast' => 'the form was submitted too quickly, please try again',
    ];
    $lines = [];
    foreach ($errors as $field => $c) { $lines[] = $field . ': ' . ($nice[$c] ?? $c); }
    if ($code === 'rate_limited') { $lines[] = 'Too many enquiries from this connection. Please try again later.'; }
    if ($code === 'storage') { $lines[] = 'We could not store your enquiry just now. Nothing was sent.'; }
    respond_error_page($status, 'We could not send your enquiry', $lines, $config);
}

function client_ip(array $config): string
{
    if (!empty($config['trust_proxy_header']) && !empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $p = explode(',', (string) $_SERVER['HTTP_X_FORWARDED_FOR']);
        return trim($p[0]);
    }
    return (string) ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
}

function ensure_data_dir(string $dir): bool
{
    if (!is_dir($dir) && !@mkdir($dir, 0750, true) && !is_dir($dir)) { return false; }
    $ht = $dir . '/.htaccess';
    if (!is_file($ht)) {
        @file_put_contents($ht, "# Never serve enquiry data\n<IfModule mod_authz_core.c>\n  Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n  Order allow,deny\n  Deny from all\n</IfModule>\n");
    }
    return is_writable($dir);
}

function secret_key(string $dir, array $config): string
{
    if (!empty($config['secret'])) { return (string) $config['secret']; }
    $f = $dir . '/secret.key';
    if (is_file($f)) { return trim((string) file_get_contents($f)); }
    $k = bin2hex(random_bytes(32));
    @file_put_contents($f, $k, LOCK_EX);
    return $k;
}

function make_token(string $secret): string
{
    $t = (string) time();
    return $t . '.' . hash_hmac('sha256', $t, $secret);
}

/** @return int|null issue time when the token is genuine, null otherwise */
function read_token(string $tk, string $secret): ?int
{
    $p = explode('.', $tk);
    if (count($p) !== 2 || !ctype_digit($p[0])) { return null; }
    return hash_equals(hash_hmac('sha256', $p[0], $secret), $p[1]) ? (int) $p[0] : null;
}

function rate_limited(string $dir, string $ipHash, int $max, int $window): bool
{
    $rl = $dir . '/rl';
    if (!is_dir($rl) && !@mkdir($rl, 0750, true) && !is_dir($rl)) { return false; } // cannot enforce: fail open
    $f = $rl . '/' . $ipHash . '.json';
    $fh = @fopen($f, 'c+');
    if (!$fh) { return false; }
    flock($fh, LOCK_EX);
    $raw = stream_get_contents($fh);
    $times = $raw ? json_decode($raw, true) : [];
    $now = time();
    $times = array_values(array_filter(is_array($times) ? $times : [], function ($t) use ($now, $window) { return is_int($t) && $t > $now - $window; }));
    $limited = count($times) >= $max;
    if (!$limited) { $times[] = $now; }
    ftruncate($fh, 0); rewind($fh); fwrite($fh, json_encode($times)); fflush($fh);
    flock($fh, LOCK_UN); fclose($fh);
    if (random_int(1, 50) === 1) { // opportunistic cleanup of stale counters
        foreach ((array) glob($rl . '/*.json') as $old) { if (@filemtime($old) < $now - $window) { @unlink($old); } }
    }
    return $limited;
}

function clean(string $v, int $max): string
{
    $v = str_replace(["\r\n", "\r"], "\n", $v);
    $v = preg_replace('/[^\P{C}\n\t]+/u', '', $v) ?? '';
    $v = trim($v);
    return function_exists('mb_substr') ? mb_substr($v, 0, $max, 'UTF-8') : substr($v, 0, $max);
}
function one_line(string $v, int $max): string { return trim(preg_replace('/\s+/u', ' ', clean($v, $max)) ?? ''); }

// ---------------------------------------------------------------- request handling
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$dataDir = (string) $config['data_dir'];
$dataOk = ensure_data_dir($dataDir);

if ($method === 'GET') {
    if (isset($_GET['token']) && $dataOk) {
        respond_json(200, ['tk' => make_token(secret_key($dataDir, $config))]);
    }
    respond_json(405, ['ok' => false, 'error' => 'method_not_allowed']);
}
if ($method !== 'POST') { header('Allow: GET, POST'); respond_json(405, ['ok' => false, 'error' => 'method_not_allowed']); }

// size guard
if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > (int) $config['max_body']) { fail(413, 'too_large', [], $config); }

// same-origin guard
$allowed = $config['allowed_hosts'] ?: [(string) ($_SERVER['HTTP_HOST'] ?? '')];
foreach (['HTTP_ORIGIN', 'HTTP_REFERER'] as $h) {
    if (!empty($_SERVER[$h])) {
        $host = parse_url((string) $_SERVER[$h], PHP_URL_HOST);
        $port = parse_url((string) $_SERVER[$h], PHP_URL_PORT);
        $hostport = $host . ($port ? ':' . $port : '');
        if (!in_array($host, $allowed, true) && !in_array($hostport, $allowed, true)) { fail(403, 'forbidden_origin', [], $config); }
        break;
    }
}

if (!$dataOk) {
    // cannot log: still try to mail below, but flag it
    $dataDirWritable = false;
} else { $dataDirWritable = true; }

$secret = $dataDirWritable ? secret_key($dataDir, $config) : (string) ($config['secret'] ?: 'ephemeral');
$ip = client_ip($config);
$ipHash = hash('sha256', $ip . '|' . $secret);

if ($dataDirWritable && rate_limited($dataDir, $ipHash, (int) $config['rate_limit']['max'], (int) $config['rate_limit']['window'])) {
    header('Retry-After: ' . (int) $config['rate_limit']['window']);
    fail(429, 'rate_limited', [], $config);
}

$in = $_POST;
$lang = (isset($in['lang']) && $in['lang'] === 'nl') ? 'nl' : 'en';

// honeypot: look successful to bots, store nothing
if (!empty($in['website'])) {
    if (wants_json()) { respond_json(200, ['ok' => true]); }
    header('Location: ' . ($config['thanks_urls'][$lang] ?? '/'), true, 303);
    exit;
}

// time-trap
$tokenTime = isset($in['tk']) ? read_token((string) $in['tk'], $secret) : null;
if ($tokenTime !== null && (time() - $tokenTime) < (int) $config['min_seconds']) {
    fail(422, 'too_fast', ['form' => 'too_fast'], $config);
}

// validation
$errors = [];
$sector = (string) ($in['sector'] ?? '');
if (!in_array($sector, $options['sectors'], true)) { $errors['sector'] = 'choose'; }
$location = one_line((string) ($in['location'] ?? ''), 120);
if ($location === '') { $errors['location'] = 'required'; }
$sizeRaw = preg_replace('/[\s.]/', '', (string) ($in['size_m2'] ?? '')) ?? '';
if ($sizeRaw !== '' && !preg_match('/^\d{1,6}$/', $sizeRaw)) { $errors['size_m2'] = 'number'; }
$budget = (string) ($in['budget'] ?? '');
if ($budget !== '' && !in_array($budget, $options['budgets'], true)) { $errors['budget'] = 'choose'; }
$timeline = (string) ($in['timeline'] ?? '');
if ($timeline !== '' && !in_array($timeline, $options['timelines'], true)) { $errors['timeline'] = 'choose'; }
$services = [];
foreach ((array) ($in['services'] ?? []) as $s) {
    if (is_string($s) && in_array($s, $options['services'], true)) { $services[$s] = $s; }
}
$services = array_values($services);
$name = one_line((string) ($in['name'] ?? ''), 120);
if ($name === '') { $errors['name'] = 'required'; }
$email = one_line((string) ($in['email'] ?? ''), 190);
if ($email === '') { $errors['email'] = 'required'; }
elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) { $errors['email'] = 'email'; }
$phone = one_line((string) ($in['phone'] ?? ''), 40);
if ($phone !== '' && !preg_match('/^[0-9+()\-.\s]{5,40}$/', $phone)) { $errors['phone'] = 'number'; }
$message = clean((string) ($in['message'] ?? ''), 5000);
if (($in['consent'] ?? '') !== '1') { $errors['consent'] = 'consent'; }

if ($errors) { fail(422, 'validation', $errors, $config); }

// ---------------------------------------------------------------- persist FIRST, then mail
$id = bin2hex(random_bytes(8));
$record = [
    'id' => $id, 'ts' => gmdate('c'), 'lang' => $lang,
    'sector' => $sector, 'services' => $services, 'location' => $location,
    'size_m2' => $sizeRaw === '' ? null : (int) $sizeRaw, 'budget' => $budget ?: null, 'timeline' => $timeline ?: null,
    'name' => $name, 'email' => $email, 'phone' => $phone ?: null, 'message' => $message,
    'consent' => true, 'ip_hash' => $ipHash, 'token' => $tokenTime !== null ? 'ok' : 'none', 'v' => CE_VERSION,
];
$logged = false;
if ($dataDirWritable) {
    $line = json_encode($record, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n";
    $logged = @file_put_contents($dataDir . '/leads.jsonl', $line, FILE_APPEND | LOCK_EX) !== false;
}

$labels = [
    'sector' => 'Project type', 'services' => 'Services', 'location' => 'Location', 'size_m2' => 'Size (m2)', 'budget' => 'Budget band',
    'timeline' => 'Timeline', 'name' => 'Name', 'email' => 'Email', 'phone' => 'Phone',
];
$body = "New enquiry from the website (" . strtoupper($lang) . ")\nReference: $id\n\n";
foreach ($labels as $k => $label) {
    $v = $record[$k];
    if (is_array($v)) { $v = implode(', ', $v); }
    $body .= str_pad($label . ':', 14) . ($v === null || $v === '' ? '-' : $v) . "\n";
}
$body .= "\nMessage:\n" . ($message === '' ? '-' : $message) . "\n\n--\nReply to this email to answer the visitor directly.\n";

$fromAddr = preg_replace('/[\r\n<>]/', '', (string) $config['from']);
$fromName = preg_replace('/[\r\n"<>]/', '', (string) $config['from_name']);
$replyName = preg_replace('/[\r\n"<>,;]/', '', $name);
$headers = [
    'From: ' . '=?UTF-8?B?' . base64_encode($fromName) . '?= <' . $fromAddr . '>',
    'Reply-To: ' . '=?UTF-8?B?' . base64_encode($replyName) . '?= <' . $email . '>',
    'MIME-Version: 1.0', 'Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: 8bit', 'X-Mailer: CuttingEdge-site/' . CE_VERSION,
];
$subject = '=?UTF-8?B?' . base64_encode(trim($config['subject_prefix'] . ' ' . $name . ' (' . $sector . ', ' . $location . ')')) . '?=';
$to = implode(', ', array_map(function ($r) { return preg_replace('/[\r\n]/', '', (string) $r); }, (array) $config['recipients']));
$extra = !empty($config['envelope_from']) ? '-f' . escapeshellarg($fromAddr) : '';
$mailed = false;
try { $mailed = $extra !== '' ? @mail($to, $subject, $body, implode("\r\n", $headers), $extra) : @mail($to, $subject, $body, implode("\r\n", $headers)); } catch (Throwable $e) { $mailed = false; }

if ($dataDirWritable) {
    @file_put_contents($dataDir . '/leads.jsonl', json_encode(['id' => $id, 'event' => 'mail', 'ok' => $mailed, 'ts' => gmdate('c')]) . "\n", FILE_APPEND | LOCK_EX);
}

// success = the enquiry is safe somewhere (log or mailbox)
if (!$logged && !$mailed) { fail(500, 'storage', [], $config); }

if (wants_json()) { respond_json(200, ['ok' => true, 'id' => $id]); }
header('Location: ' . ($config['thanks_urls'][$lang] ?? '/'), true, 303);
exit;
