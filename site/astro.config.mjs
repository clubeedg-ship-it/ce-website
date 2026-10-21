import { defineConfig } from 'astro/config';

// PREVIEW=1  -> GitHub Pages preview: base /ce-website/, noindex, form not sent.
// (default)  -> production build for https://cuttingedge.world/
const preview = process.env.PREVIEW === '1';

export default defineConfig({
  site: preview ? 'https://clubeedg-ship-it.github.io' : 'https://cuttingedge.world',
  base: preview ? '/ce-website' : '/',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'never' },
  compressHTML: true,
  devToolbar: { enabled: false },
  vite: {
    build: { assetsInlineLimit: 0 },
  },
});
