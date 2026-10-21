import { defineConfig } from 'astro/config';

// PREVIEW=1  -> public preview: noindex, form not sent. Default host = GitHub Pages under /ce-website/.
//              Override the host with PREVIEW_SITE (+ PREVIEW_BASE), e.g. the custom preview domain:
//              PREVIEW=1 PREVIEW_SITE=https://edge.oopuo.nl PREVIEW_BASE=/ astro build --outDir dist-edge
// (default)  -> production build for https://cuttingedge.world/
const preview = process.env.PREVIEW === '1';
const previewSite = process.env.PREVIEW_SITE || 'https://clubeedg-ship-it.github.io';
const previewBase = process.env.PREVIEW_BASE || '/ce-website';

export default defineConfig({
  site: preview ? previewSite : 'https://cuttingedge.world',
  base: preview ? previewBase : '/',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'never' },
  compressHTML: true,
  devToolbar: { enabled: false },
  vite: {
    build: { assetsInlineLimit: 0 },
  },
});
