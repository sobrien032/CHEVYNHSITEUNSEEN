/*
  Minimal static server with a mocked Netlify function endpoint so the form can be previewed locally.
  - Serves files from the project directory
  - Handles POST /.netlify/functions/trade-appraisal and returns { ok: true }
*/

import http from 'node:http';
import { createReadStream, statSync, existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';

const baseDir = path.resolve(path.dirname(new URL(import.meta.url).pathname));
const publicDir = baseDir; // serve from extracted folder root
const port = process.env.PORT ? Number(process.env.PORT) : 8080;

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.json': 'application/json; charset=utf-8',
};

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return contentTypes[ext] || 'application/octet-stream';
}

function safeResolve(base, targetPath) {
  const resolved = path.resolve(base, targetPath);
  if (!resolved.startsWith(base)) {
    return base; // prevent path traversal
  }
  return resolved;
}

async function parseJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf-8');
  try { return JSON.parse(raw || '{}'); } catch { return {}; }
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url || '/', true);

  // Mock the Netlify function endpoint for preview
  if (parsed.pathname === '/.netlify/functions/trade-appraisal' && req.method === 'POST') {
    const data = await parseJsonBody(req);
    // Basic validation to mimic function behavior
    const name = String(data?.name || '').trim();
    const email = String(data?.email || '').trim();
    const phone = String((data?.phoneRaw || data?.phone || '')).replace(/\D/g, '').slice(0, 15);
    const vin = String(data?.vin || '').trim();

    if (!name || !email || !phone || !vin) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Missing required fields');
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, preview: true }));
    return;
  }

  // Serve static files
  let filePath = decodeURIComponent(parsed.pathname || '/');
  if (filePath.endsWith('/')) filePath += 'index.html';
  const absolutePath = safeResolve(publicDir, '.' + filePath);

  try {
    if (!existsSync(absolutePath)) {
      // Fallback to index for unknown routes (SPA-style)
      const fallback = path.join(publicDir, 'index.html');
      const html = await readFile(fallback);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
      return;
    }

    const stat = statSync(absolutePath);
    if (stat.isDirectory()) {
      const idx = path.join(absolutePath, 'index.html');
      if (existsSync(idx)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        createReadStream(idx).pipe(res);
      } else {
        res.writeHead(403);
        res.end('Forbidden');
      }
      return;
    }

    res.writeHead(200, { 'Content-Type': getContentType(absolutePath) });
    createReadStream(absolutePath).pipe(res);
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Internal Server Error');
  }
});

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Preview server running at http://localhost:${port}`);
});

