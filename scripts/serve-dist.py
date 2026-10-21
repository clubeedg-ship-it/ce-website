#!/usr/bin/env python3
"""Tiny local static server for checking a build without Apache.

  python3 scripts/serve-dist.py <dist-dir> <port> [--prefix /ce-website] [--htaccess site/public/.htaccess]

* serves directories with trailing-slash redirects, 404.html for unknown paths, Range requests for video
* with --htaccess it emulates ONLY the `RewriteRule ^pattern target [R=301,L]` lines of that file, so the legacy
  redirect table can be exercised locally. It is not Apache: header/CSP/caching rules are NOT emulated.
* with --php it forwards /api/*.php to a running `php -S` instance (reverse proxy), so the form works end to end.
* with --public it adds the production security headers + X-Robots-Tag: noindex (used behind the Cloudflare tunnel
  that serves the edge.oopuo.nl preview; see 'Public preview at edge.oopuo.nl' in site/README.md).
"""
import argparse, mimetypes, os, re, sys, urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ap = argparse.ArgumentParser()
ap.add_argument('dist'); ap.add_argument('port', type=int)
ap.add_argument('--prefix', default=''); ap.add_argument('--htaccess'); ap.add_argument('--php'); ap.add_argument('--gzip', action='store_true')
ap.add_argument('--public', action='store_true')
a = ap.parse_args()
ROOT = os.path.abspath(a.dist)
PUBLIC_HEADERS = {}
if a.public:  # same security headers as production: the `Header always set[ifempty]` lines of site/public/.htaccess
    _ht = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'site', 'public', '.htaccess')
    for _l in open(_ht):
        _m = re.match(r'\s*Header\s+always\s+set(?:ifempty)?\s+(\S+)\s+"(.*)"\s*$', _l)
        if _m: PUBLIC_HEADERS[_m.group(1)] = _m.group(2)
    PUBLIC_HEADERS['X-Robots-Tag'] = 'noindex, nofollow'   # preview: never indexed
mimetypes.add_type('image/avif', '.avif'); mimetypes.add_type('video/webm', '.webm'); mimetypes.add_type('font/woff2', '.woff2')

rules = []
if a.htaccess:
    for line in open(a.htaccess):
        m = re.match(r'\s*RewriteRule\s+(\S+)\s+(\S+)\s+\[R=301,L\]\s*$', line)
        if m and m.group(1) != '^':
            rules.append((re.compile(m.group(1)), m.group(2)))

class H(SimpleHTTPRequestHandler):
    def log_message(self, *x): pass
    def translate_path(self, path): return path
    def _send(self, code, body=b'', ctype='text/html; charset=utf-8', extra=None):
        self.send_response(code)
        self.send_header('Content-Type', ctype); self.send_header('Content-Length', str(len(body)))
        for k, v in {**PUBLIC_HEADERS, **(extra or {})}.items(): self.send_header(k, v)
        self.end_headers()
        if self.command != 'HEAD': self.wfile.write(body)
    def do_HEAD(self): self.do_GET()
    do_POST = lambda self: self.do_GET()
    def do_GET(self):
        path = self.path.split('?')[0].split('#')[0]
        if a.php and path.startswith(a.prefix + '/api/') and path.endswith('.php'):
            return self.proxy_php()
        if a.prefix:
            if path == a.prefix: return self._send(301, b'', extra={'Location': a.prefix + '/'})
            if not path.startswith(a.prefix + '/'): return self.notfound()
            path = path[len(a.prefix):]
        rel = path.lstrip('/')
        for rx, target in rules:
            if rx.match(rel):
                return self._send(301, b'', extra={'Location': a.prefix + target})
        fs = os.path.abspath(os.path.join(ROOT, rel))
        if fs != ROOT and not fs.startswith(ROOT + os.sep): return self.notfound()
        if os.path.isdir(fs):
            if not path.endswith('/'): return self._send(301, b'', extra={'Location': a.prefix + path + '/'})
            fs = os.path.join(fs, 'index.html')
        if not os.path.isfile(fs): return self.notfound()
        data = open(fs, 'rb').read()
        ctype = mimetypes.guess_type(fs)[0] or 'application/octet-stream'
        rng = self.headers.get('Range')
        if rng and (m := re.match(r'bytes=(\d*)-(\d*)', rng)):
            s = int(m.group(1) or 0); e = int(m.group(2)) if m.group(2) else len(data) - 1
            return self._send(206, data[s:e + 1], ctype, {'Content-Range': f'bytes {s}-{e}/{len(data)}', 'Accept-Ranges': 'bytes'})
        extra = {'Accept-Ranges': 'bytes', 'Cache-Control': 'public, max-age=31536000, immutable' if '/_astro/' in path else ('public, max-age=2592000' if '/media/' in path else ('public, max-age=604800' if re.search(r'\.(png|svg|js|css)$', path) else 'no-cache'))}
        # emulate the production .htaccess: gzip text, long cache for hashed assets (lets Lighthouse see realistic transfer)
        if a.gzip and 'gzip' in (self.headers.get('Accept-Encoding') or '') and re.match(r'(text/|application/(json|xml|javascript|ld\+json)|image/svg)', ctype):
            import gzip
            data = gzip.compress(data, 6); extra['Content-Encoding'] = 'gzip'; extra['Vary'] = 'Accept-Encoding'
        self._send(200, data, ctype, extra)
    def notfound(self):
        f = os.path.join(a.dist, '404.html')
        self._send(404, open(f, 'rb').read() if os.path.isfile(f) else b'Not found')
    def proxy_php(self):
        n = int(self.headers.get('Content-Length') or 0)
        body = self.rfile.read(n) if n else None
        req = urllib.request.Request(a.php + self.path[len(a.prefix):], data=body, method=self.command)
        req.add_header('Host', self.headers.get('Host', ''))
        for k in ('Content-Type', 'Accept', 'Origin', 'Referer'):
            if self.headers.get(k): req.add_header(k, self.headers[k])
        class NoRedirect(urllib.request.HTTPRedirectHandler):
            def redirect_request(self, *args, **kw): return None
        try:
            r = urllib.request.build_opener(NoRedirect).open(req)
            code, hdrs, data = r.status, r.headers, r.read()
        except urllib.error.HTTPError as e:
            code, hdrs, data = e.code, e.headers, e.read()
        self.send_response(code)
        for k, v in hdrs.items():
            if k.lower() not in ('transfer-encoding', 'connection', 'content-length'): self.send_header(k, v)
        self.send_header('Content-Length', str(len(data))); self.end_headers(); self.wfile.write(data)

ThreadingHTTPServer(('127.0.0.1', a.port), H).serve_forever()
