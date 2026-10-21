// Playwright crawl of every page (EN + NL): console errors, failed/4xx requests, third-party requests,
// broken internal links, img alt, title/description/canonical/hreflang/robots, h1 count, lang attribute.
// Usage:  LD_LIBRARY_PATH=~/.local/share/chromium-deps/root/usr/lib/x86_64-linux-gnu \
//         node site/tests/crawl.mjs http://127.0.0.1:8081/ce-website/ [--out report.json]
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const PW = process.env.PLAYWRIGHT_PATH || '/home/otavio/work/hermes-agent-ui/frontend/node_modules/playwright';
const { chromium } = require(PW);

const base = new URL(process.argv[2]);
const outIdx = process.argv.indexOf('--out');
const out = outIdx > 0 ? process.argv[outIdx + 1] : null;
const origin = base.origin;
const norm = (u) => { const x = new URL(u); x.hash = ''; x.search = ''; return x.href; };

const queue = [norm(base.href), norm(new URL('nl/', base).href), norm(new URL('404.html', base).href)];
// seed with the sitemap so orphan pages are covered too
try {
  const sm = await (await fetch(new URL('sitemap.xml', base))).text();
  for (const m of sm.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const u = new URL(m[1]); queue.push(norm(origin + u.pathname));
  }
} catch {}
const seen = new Set(); const pages = []; const linkStatus = new Map();
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const problems = [];

async function status(u) {
  if (linkStatus.has(u)) return linkStatus.get(u);
  let s = 0; try { const r = await fetch(u, { redirect: 'follow' }); s = r.status; } catch { s = -1; }
  linkStatus.set(u, s); return s;
}

while (queue.length) {
  const url = queue.shift();
  if (seen.has(url)) continue; seen.add(url);
  const page = await ctx.newPage();
  const rec = { url, consoleErrors: [], failedRequests: [], thirdParty: [], issues: [] };
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) rec.consoleErrors.push(`${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => rec.consoleErrors.push('pageerror: ' + e.message));
  page.on('requestfailed', (r) => { if (/\.(webm|mp4)$/.test(r.url()) && r.failure()?.errorText === 'net::ERR_ABORTED') return; /* browser cancels range requests of paused/off-screen video: not a failure */ rec.failedRequests.push(`${r.url()} ${r.failure()?.errorText}`); });
  page.on('response', (r) => { if (r.status() >= 400 && !r.url().endsWith('404.html') || (r.status() >= 400 && url.endsWith('404.html') && r.url() !== url)) rec.failedRequests.push(`${r.status()} ${r.url()}`); });
  page.on('request', (r) => { try { if (new URL(r.url()).origin !== origin && !r.url().startsWith('data:') && !r.url().startsWith('blob:')) rec.thirdParty.push(r.url()); } catch {} });
  const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch((e) => { rec.issues.push('goto: ' + e.message); return null; });
  if (resp) rec.status = resp.status();
  const is404 = url.endsWith('404.html');
  if (resp && resp.status() !== 200 && !is404) rec.issues.push('status ' + resp.status());
  // scroll through the page so lazy images and reveal observers load
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); });
  await page.waitForLoadState('networkidle').catch(() => {});
  const info = await page.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const imgs = [...document.images];
    return {
      title: document.title, lang: document.documentElement.lang,
      desc: q('meta[name=description]')?.content || '', canonical: q('link[rel=canonical]')?.href || '',
      robots: q('meta[name=robots]')?.content || '',
      hreflang: [...document.querySelectorAll('link[rel=alternate][hreflang]')].map((l) => l.hreflang + '=' + l.href),
      ogImage: q('meta[property="og:image"]')?.content || '', h1: document.querySelectorAll('h1').length,
      imgNoAlt: imgs.filter((i) => !i.hasAttribute('alt')).map((i) => i.currentSrc || i.src),
      imgBroken: imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
      links: [...document.querySelectorAll('a[href]')].map((a) => a.href),
      jsonld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => { try { JSON.parse(s.textContent); return 'ok'; } catch { return 'INVALID'; } }),
      inlineStyle: document.querySelectorAll('[style]:not([data-compare])').length,
      inlineScripts: [...document.scripts].filter((s) => !s.src && s.type !== 'application/ld+json').length,
    };
  });
  Object.assign(rec, info);
  if (!is404) {
    if (!info.title || info.title.length > 70) rec.issues.push(`title length ${info.title.length}`);
    if (!info.desc || info.desc.length < 50 || info.desc.length > 175) rec.issues.push(`description length ${info.desc.length}`);
    if (!info.canonical) rec.issues.push('no canonical');
    if (info.hreflang.length < 3) rec.issues.push('hreflang < 3');
    if (info.h1 !== 1) rec.issues.push(`h1 count ${info.h1}`);
  }
  if (info.imgNoAlt.length) rec.issues.push(`img without alt: ${info.imgNoAlt.length}`);
  if (info.imgBroken.length) rec.issues.push(`broken images: ${info.imgBroken.join(', ')}`);
  if (info.jsonld.includes('INVALID')) rec.issues.push('invalid JSON-LD');
  if (info.inlineStyle) rec.issues.push(`inline style attributes: ${info.inlineStyle}`);
  if (info.inlineScripts) rec.issues.push(`inline scripts: ${info.inlineScripts}`);
  if (rec.consoleErrors.length) rec.issues.push(`console: ${rec.consoleErrors.join(' | ')}`);
  if (rec.failedRequests.length) rec.issues.push(`failed requests: ${rec.failedRequests.join(' | ')}`);
  if (rec.thirdParty.length) rec.issues.push(`third-party requests: ${rec.thirdParty.join(' | ')}`);
  // links
  for (const l of info.links) {
    if (!l.startsWith('http')) continue;
    const u = new URL(l);
    if (u.origin !== origin) { if (!/^https:\/\/wa\.me\//.test(l)) rec.issues.push('external link ' + l); continue; }
    if (!u.pathname.startsWith(base.pathname)) { rec.issues.push('link outside base ' + l); continue; }
    const n = norm(l);
    const s = await status(n);
    if (s !== 200) rec.issues.push(`broken link ${l} (${s})`);
    else if (!seen.has(n) && !n.match(/\.(jpg|webp|avif|png|svg|webm|mp4|txt|xml|json|php)$/)) queue.push(n);
  }
  delete rec.links; rec.imgNoAlt = rec.imgNoAlt.length; rec.imgBroken = rec.imgBroken.length;
  pages.push(rec);
  await page.close();
}
await browser.close();

const bad = pages.filter((p) => p.issues.length);
console.log(`crawled ${pages.length} pages; ${bad.length} with issues`);
for (const p of bad) console.log(`- ${p.url}\n    ${p.issues.join('\n    ')}`);
const langs = { en: pages.filter((p) => p.lang === 'en').length, nl: pages.filter((p) => p.lang === 'nl').length };
console.log('pages by html lang:', JSON.stringify(langs));
if (out) fs.writeFileSync(out, JSON.stringify(pages, null, 1));
process.exit(bad.length ? 1 : 0);
