import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.json':'application/json' };
http.createServer(async (req,res) => {
  try {
    const filename = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    if (filename !== root && !filename.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    const file = filename === root || filename.endsWith(path.sep) ? path.join(filename,'index.html') : filename;
    res.writeHead(200, { 'Content-Type':mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control':'no-cache' });
    res.end(await readFile(file));
  } catch { if (!res.headersSent) res.writeHead(404); res.end('Not found'); }
}).listen(4173,'127.0.0.1',() => console.log('Local: http://127.0.0.1:4173'));
