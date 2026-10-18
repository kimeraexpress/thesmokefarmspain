#!/usr/bin/env python3
"""
THE SMOKE FARM SPAIN - Local Server & API
Serves static web files, handles video uploads, and persists catalog data to disk.
"""

import http.server
import json
import mimetypes
import os
import re
import socketserver
import sys
import urllib.parse

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Ensure directories exist
os.makedirs(os.path.join(BASE_DIR, 'data'), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, 'assets', 'videos'), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, 'assets', 'products'), exist_ok=True)

class TSFRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        # Enable CORS and caching headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200, "OK")
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == '/api/catalog' or path == '/api/get-catalog':
            catalog_file = os.path.join(BASE_DIR, 'data', 'catalog.json')
            if os.path.exists(catalog_file):
                with open(catalog_file, 'r', encoding='utf-8') as f:
                    data = f.read()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(data.encode('utf-8'))
                return
            else:
                self.send_response(404)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"error": "catalog.json not found"}')
                return

        super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == '/api/save-catalog':
            try:
                content_length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(content_length).decode('utf-8')
                data = json.loads(body)

                catalog_file = os.path.join(BASE_DIR, 'data', 'catalog.json')
                with open(catalog_file, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(b'{"status": "ok", "message": "Catalog saved to disk successfully"}')
                print(f"[API] Catalogo salvato con successo! Prodotti: {len(data.get('products', []))}")
                return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                err = json.dumps({"error": str(e)})
                self.wfile.write(err.encode('utf-8'))
                return

        elif path == '/api/upload-video':
            try:
                content_type = self.headers.get('Content-Type', '')
                content_length = int(self.headers.get('Content-Length', 0))

                # Handle raw binary or JSON with base64 or multipart
                if 'application/json' in content_type:
                    body = self.rfile.read(content_length).decode('utf-8')
                    payload = json.loads(body)
                    filename = payload.get('filename', 'uploaded_video.mp4')
                    # Sanitize filename
                    filename = re.sub(r'[^a-zA-Z0-9_\.-]', '_', filename)
                    import base64
                    b64_data = payload.get('data', '')
                    if ',' in b64_data:
                        b64_data = b64_data.split(',', 1)[1]
                    file_bytes = base64.b64decode(b64_data)
                else:
                    # Parse multipart or raw upload
                    # Simple multipart reader
                    boundary = content_type.split("boundary=")[-1].encode() if 'boundary=' in content_type else None
                    if boundary:
                        raw_data = self.rfile.read(content_length)
                        # Find filename
                        fn_match = re.search(rb'filename="([^"]+)"', raw_data)
                        filename = fn_match.group(1).decode('utf-8', errors='ignore') if fn_match else 'uploaded_video.mp4'
                        filename = re.sub(r'[^a-zA-Z0-9_\.-]', '_', filename)
                        
                        # Find payload between double CRLF and closing boundary
                        header_end = raw_data.find(b'\r\n\r\n')
                        if header_end != -1:
                            start = header_end + 4
                            end = raw_data.rfind(b'--' + boundary)
                            if end > start:
                                file_bytes = raw_data[start:end].rstrip(b'\r\n')
                            else:
                                file_bytes = raw_data[start:]
                        else:
                            file_bytes = raw_data
                    else:
                        filename = 'uploaded_video.mp4'
                        file_bytes = self.rfile.read(content_length)

                # Ensure extension is valid
                if not any(filename.lower().endswith(ext) for ext in ['.mp4', '.mov', '.webm', '.m4v']):
                    filename += '.mp4'

                save_path = os.path.join(BASE_DIR, 'assets', 'videos', filename)
                with open(save_path, 'wb') as f:
                    f.write(file_bytes)

                rel_path = f"assets/videos/{filename}"
                print(f"[API] Video caricato: {rel_path} ({len(file_bytes)} bytes)")

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                res = json.dumps({"status": "ok", "path": rel_path, "filename": filename, "bytes": len(file_bytes)})
                self.wfile.write(res.encode('utf-8'))
                return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                err = json.dumps({"error": str(e)})
                self.wfile.write(err.encode('utf-8'))
                return

        self.send_response(404)
        self.end_headers()

def run_server():
    # Make sure mimetypes knows mp4 and webm
    mimetypes.add_type('video/mp4', '.mp4')
    mimetypes.add_type('video/webm', '.webm')
    mimetypes.add_type('application/json', '.json')

    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), TSFRequestHandler) as httpd:
        print("=" * 60)
        print("       THE SMOKE FARM SPAIN - WEB SERVER ATTIVO")
        print("=" * 60)
        print(f" Sito Principale:    http://localhost:{PORT}")
        print(f" Pannello Admin:     http://localhost:{PORT}/admin.html")
        print("=" * 60)
        print("Premi CTRL+C per arrestare il server.\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer arrestato.")

if __name__ == '__main__':
    run_server()
