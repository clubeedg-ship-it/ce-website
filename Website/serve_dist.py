#!/usr/bin/env python3
"""
Simple server for testing the client-side HTMX build locally.
Serves files from the dist/ directory.
"""

import http.server
import socketserver
import os

PORT = 8080
DIRECTORY = "dist"

class DistHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

if __name__ == "__main__":
    # Change to script directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), DistHandler) as httpd:
        print(f"Serving from 'dist/' at http://localhost:{PORT}")
        print("Press Ctrl+C to stop")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
