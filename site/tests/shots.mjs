// Before/after screenshots + page weight. Usage:
//   node site/tests/shots.mjs <outDir> <beforeBase> <afterBase>
// e.g. node site/tests/shots.mjs shots https://cuttingedge.world http://127.0.0.1:8080
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/home/otavio/work/hermes-agent-ui/frontend/node_modules/playwright');
const [outDir, beforeBase, afterBase] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const pages = [
  { name: 'home', before: '/', after: '/' },
  { name: 'projects', before: '/projects.html', after: '/projects/' },
  { name: 'project', before: '/project-4.html', after: '/projects/hospitality-collection/' },
  { name: 'contact', before: '/contact.html', after: '/contact/' },
];
const views = [{ id: '1440', viewport: { width: 1440, height: 900 }, mobile: false }, { id: '390', viewport: { width: 390, height: 844 }, mobile: true }];
const browser = await chromium.launch();
const weights = {};
for (const side of (process.env.SIDES || 'before,after').split(',')) {
  for (const v of views) {
    const ctx = await browser.newContext({ viewport: v.viewport, deviceScaleFactor: 1, isMobile: v.mobile, hasTouch: v.mobile, reducedMotion: 'no-preference' });
    for (const p of pages) {
      const page = await ctx.newPage();
      const cdp = await ctx.newCDPSession(page);
      await cdp.send('Network.enable');
      let reqs = 0; const per = new Map(); const hosts = new Set();
      cdp.on('Network.requestWillBeSent', (e) => { reqs++; try { hosts.add(new URL(e.request.url).host); } catch {} });
      cdp.on('Network.dataReceived', (e) => per.set(e.requestId, (per.get(e.requestId) || 0) + (e.encodedDataLength || e.dataLength)));
      cdp.on('Network.loadingFinished', (e) => { if (e.encodedDataLength) per.set(e.requestId, e.encodedDataLength); });
      const base = side === 'before' ? beforeBase : afterBase;
      const url = base.replace(/\/$/, '') + p[side];
      const t0 = Date.now();
      try { await page.goto(url, { waitUntil: 'load', timeout: 90000 }); } catch (e) { console.log('goto failed', url, e.message); }
      await page.waitForTimeout(8000); // let deferred media start, like a real visitor who stays a few seconds
      const bytes = [...per.values()].reduce((a, b) => a + b, 0);
      weights[`${p.name}-${v.id}-${side}`] = { bytes, requests: reqs, hosts: [...hosts], url };
      // trigger lazy images + reveal animations, then capture the full page
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } window.scrollTo(0, 0); });
      await page.waitForTimeout(1200);
      await page.screenshot({ path: `${outDir}/${p.name}-${v.id}-${side}.png`, fullPage: true });
      await page.close();
    }
    await ctx.close();
  }
}
await browser.close();
const wf = `${outDir}/weights.json`; const prev = fs.existsSync(wf) ? JSON.parse(fs.readFileSync(wf, 'utf8')) : {}; fs.writeFileSync(wf, JSON.stringify({ ...prev, ...weights }, null, 1));
for (const [k, w] of Object.entries(weights)) console.log(k.padEnd(24), (w.bytes / 1024).toFixed(0).padStart(7), 'KB', String(w.requests).padStart(4), 'req', w.hosts.join(','));
