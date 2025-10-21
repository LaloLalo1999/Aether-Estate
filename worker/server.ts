import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import app from './index';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, '../dist');

app.use('*', serveStatic({
  root: distPath,
}));

app.get('*', serveStatic({
  path: 'index.html',
  root: distPath,
}));

const port = parseInt(process.env.PORT || '8787', 10);

console.log(`Starting server on port ${port}`);

serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log(`✓ Server running at http://localhost:${info.port}`);
});
