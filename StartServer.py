#!/usr/bin/env python3

import http.server
import os
import webbrowser

os.chdir("./")
port = 8082
print("Webseite kann unter folgender URL aufgerufen werden: http://localhost:8082/")

http.server.SimpleHTTPRequestHandler.extensions_map[".wasm"] = "application/wasm"

httpd = http.server.HTTPServer(
    ("localhost", port), http.server.SimpleHTTPRequestHandler
)

print(
    'Mapping ".wasm" to "%s"'
    % http.server.SimpleHTTPRequestHandler.extensions_map[".wasm"]
)

webbrowser.open('http://localhost:8082/')

httpd.serve_forever()





