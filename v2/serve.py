"""Local preview server for the static site.

Usage:  python3 serve.py [port]

Serves the current directory with extensionless-URL fallback
(mirrors the production .htaccess rewrite rule), so `/approach`
resolves to `/approach.html` during local development.
"""
from __future__ import annotations

import http.server
import os
import socketserver
import sys
from pathlib import Path

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
ROOT = Path(__file__).parent.resolve()


class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path: str) -> str:
        resolved = super().translate_path(path)
        p = Path(resolved)
        if not p.exists() and not p.suffix:
            html = p.with_suffix(".html")
            if html.is_file():
                return str(html)
        return resolved


if __name__ == "__main__":
    os.chdir(ROOT)
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving {ROOT} at http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopped.")
