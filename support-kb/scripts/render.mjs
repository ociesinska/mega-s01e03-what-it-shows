import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const server = await createServer({
  root,
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: 'custom',
});
try {
  const { renderPages } = await server.ssrLoadModule('/src/render.ts');
  const pages = renderPages();
  for (const { route, html } of pages) {
    const dest = path.join(root, 'rendered', route, 'index.html');
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, html);
    console.log(`Rendered ${route}`);
  }
} finally {
  await server.close();
}
