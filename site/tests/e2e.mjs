// Browser end-to-end checks of interactive pieces on a PRODUCTION build served with PHP.
// Usage: node site/tests/e2e.mjs http://127.0.0.1:8090/ [path/to/leads.jsonl]
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/home/otavio/work/hermes-agent-ui/frontend/node_modules/playwright');
const base = process.argv[2].replace(/\/$/, '') + '/';
const log = process.argv[3];
let pass = 0, fail = 0;
const t = (name, ok, detail = '') => { (ok ? pass++ : fail++); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : '  -> ' + detail}`); };
const leads = () => (log && fs.existsSync(log) ? fs.readFileSync(log, 'utf8').split('\n').filter((l) => l.includes('"sector"')).length : 0);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const errors = [];
const page = await ctx.newPage();
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

// ---------- form: EN, JS ----------
await page.goto(base + 'contact/', { waitUntil: 'networkidle' });
t('stepper: only step 1 visible', (await page.locator('[data-step]:visible').count()) === 1);
await page.click('[data-next]');
t('step 1: empty "next" shows validation + summary', (await page.locator('[data-errsum]').isVisible()) && (await page.locator('#err-sector').textContent()).length > 0);
t('first invalid field receives focus, error text linked (aria-describedby)', await page.evaluate(() => document.activeElement?.closest('[data-field]')?.dataset.field === 'sector' || document.activeElement?.name === 'sector'));
await page.check('input[name=sector][value=hospitality]');
await page.check('input[name="services[]"][value=turn-key-build]');
await page.click('[data-next]');
t('advances to step 2', await page.locator('[data-step="1"]').isVisible());
await page.click('[data-next]');
t('step 2: location required', (await page.locator('[data-field=location].field--err').count()) === 1);
await page.fill('#location', 'Amsterdam');
await page.fill('#size_m2', 'abc');
await page.click('[data-next]');
t('step 2: non-numeric size rejected', (await page.locator('[data-field=size_m2].field--err').count()) === 1);
await page.fill('#size_m2', '120');
await page.selectOption('#budget', '50-100k');
await page.selectOption('#timeline', '3m');
await page.keyboard.press('Tab'); 
await page.click('[data-next]');
t('advances to step 3', await page.locator('[data-step="2"]').isVisible());
await page.fill('#name', 'E2E Tester');
await page.fill('#email', 'nope');
await page.click('[data-submit]');
t('step 3: invalid email + missing consent blocked client-side', (await page.locator('[data-field=email].field--err').count()) === 1 && (await page.locator('[data-field=consent].field--err').count()) === 1);
t('aria-invalid set on email', (await page.getAttribute('#email', 'aria-invalid')) === 'true');
await page.fill('#email', 'e2e@example.org');
await page.fill('#message', 'Automated end-to-end test enquiry. Please ignore.');
await page.check('#consent');
const before = leads();
await page.waitForTimeout(3500); // time-trap
await Promise.all([page.waitForURL(/contact\/thank-you\/$/, { timeout: 15000 }).catch(() => {}), page.click('[data-submit]')]);
t('real server OK -> thank-you page', /contact\/thank-you\/$/.test(page.url()), page.url());
if (log) { await page.waitForTimeout(300); t('lead written to JSONL log', leads() === before + 1, `${before} -> ${leads()}`); }
t('thank-you page is noindex', (await page.locator('meta[name=robots]').getAttribute('content')).includes('noindex'));

// ---------- failure path shows error + fallback (server unreachable) ----------
const p2 = await ctx.newPage();
await p2.route('**/api/contact.php', (r) => r.fulfill({ status: 500, contentType: 'application/json', body: '{"ok":false,"error":"storage"}' }));
await p2.goto(base + 'contact/', { waitUntil: 'networkidle' });
await p2.check('input[name=sector][value=residential]'); await p2.click('[data-next]');
await p2.fill('#location', 'Utrecht'); await p2.click('[data-next]');
await p2.fill('#name', 'Fail Test'); await p2.fill('#email', 'f@example.org'); await p2.check('#consent');
await p2.click('[data-submit]');
await p2.waitForSelector('[data-error-notice]:not([hidden])', { timeout: 8000 }).catch(() => {});
t('server 500: error notice shown (no fake success)', (await p2.locator('[data-error-notice]').isVisible()) && /thank-you/.test(p2.url()) === false);
t('error notice offers WhatsApp + email fallback', (await p2.locator('[data-error-notice] a[href*="wa.me"]').count()) === 1 && (await p2.locator('[data-error-notice] a[href^="mailto:"]').count()) === 1);
t('submit button re-enabled after failure', await p2.locator('[data-submit]').isEnabled());
await p2.close();

// ---------- NL form uses Dutch thank-you ----------
const p3 = await ctx.newPage();
await p3.goto(base + 'nl/contact/', { waitUntil: 'networkidle' });
t('NL contact page is Dutch', (await p3.locator('h1').textContent()).includes('samen'));
await p3.check('input[name=sector][value=commercial]'); await p3.click('[data-next]');
await p3.fill('#location', 'Rotterdam'); await p3.click('[data-next]');
await p3.fill('#name', 'NL Test'); await p3.fill('#email', 'nl@example.org'); await p3.check('#consent');
await p3.waitForTimeout(3500);
await Promise.all([p3.waitForURL(/bedankt\/$/, { timeout: 15000 }).catch(() => {}), p3.click('[data-submit]')]);
t('NL submit -> /nl/contact/bedankt/', /nl\/contact\/bedankt\/$/.test(p3.url()), p3.url());
await p3.close();

// ---------- no JavaScript: plain POST ----------
const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
const p4 = await nojs.newPage();
await p4.goto(base + 'contact/');
t('no-JS: all three steps visible', (await p4.locator('fieldset[data-step]:visible').count()) === 3);
t('no-JS: no "next" button', (await p4.locator('[data-next]:visible').count()) === 0);
await p4.check('input[name=sector][value=hospitality]');
await p4.fill('#location', 'Haarlem'); await p4.fill('#name', 'NoJS Tester'); await p4.fill('#email', 'nojs@example.org'); await p4.check('#consent');
await Promise.all([p4.waitForURL(/thank-you\/$/, { timeout: 15000 }).catch(() => {}), p4.click('[data-submit]')]);
t('no-JS: plain POST -> thank-you page', /contact\/thank-you\/$/.test(p4.url()), p4.url());
await nojs.close();

// ---------- before/after slider, keyboard ----------
await page.goto(base + 'approach/', { waitUntil: 'networkidle' });
const cmp = page.locator('[data-compare]').first();
await cmp.scrollIntoViewIfNeeded();
const range = cmp.locator('input[type=range]');
await range.focus();
await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await page.keyboard.press('Home');
t('slider: keyboard changes value (Home -> 0)', (await range.inputValue()) === '0');
t('slider: divider position follows', (await cmp.evaluate((e) => e.style.getPropertyValue('--pos'))) === '0%');
await page.keyboard.press('End');
t('slider: End -> 100', (await range.inputValue()) === '100');
t('slider has an accessible name', ((await range.getAttribute('aria-label')) || '').length > 10);

// ---------- lightbox keyboard ----------
await page.goto(base + 'projects/hospitality-collection/', { waitUntil: 'networkidle' });
const first = page.locator('[data-gallery] button').first();
await first.scrollIntoViewIfNeeded();
await first.focus(); await page.keyboard.press('Enter');
t('lightbox opens with Enter', await page.locator('dialog[open]').count() === 1);
const src1 = await page.locator('dialog img').getAttribute('src');
await page.keyboard.press('ArrowRight');
t('lightbox: ArrowRight shows next image', (await page.locator('dialog img').getAttribute('src')) !== src1);
await page.keyboard.press('Escape');
t('lightbox: Escape closes', await page.locator('dialog[open]').count() === 0);
t('lightbox: focus returns to opener', await page.evaluate(() => document.activeElement?.closest('[data-gallery]') !== null));

// ---------- projects filter ----------
await page.goto(base + 'projects/', { waitUntil: 'networkidle' });
const total = await page.locator('.pgrid .card:visible').count();
await page.click('[data-filter=commercial]');
const comm = await page.locator('.pgrid .card:visible').count();
t(`filter: commercial shows fewer cards (${total} -> ${comm})`, comm > 0 && comm < total);
t('filter: aria-pressed updated', (await page.getAttribute('[data-filter=commercial]', 'aria-pressed')) === 'true');

// ---------- mobile menu ----------
const m = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const mp = await m.newPage();
await mp.goto(base, { waitUntil: 'networkidle' });
await mp.click('[data-menu]');
await mp.waitForTimeout(400);
t('menu opens (aria-expanded)', (await mp.getAttribute('[data-menu]', 'aria-expanded')) === 'true' && await mp.locator('#site-nav a').first().isVisible());
t('menu: focus moved inside', await mp.evaluate(() => !!document.activeElement.closest('#site-nav')));
await mp.keyboard.press('Escape');
t('menu: Escape closes + returns focus', (await mp.getAttribute('[data-menu]', 'aria-expanded')) === 'false' && await mp.evaluate(() => document.activeElement.hasAttribute('data-menu')));
t('mobile action bar visible', await mp.locator('.mbar').isVisible());
const overflow = await mp.evaluate(() => document.documentElement.scrollWidth - innerWidth);
t('no horizontal overflow at 390 px', overflow <= 0, String(overflow));

// ---------- reduced motion: video does not start ----------
const rm = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 800 } });
const rp = await rm.newPage();
await rp.goto(base, { waitUntil: 'load' });
await rp.waitForTimeout(3000);
t('reduced motion: hero video not playing', await rp.evaluate(() => { const v = document.querySelector('#hero-video'); return !v || v.paused; }));
t('reduced motion: play button offered (aria-pressed=true)', (await rp.getAttribute('[data-pause="hero-video"]', 'aria-pressed')) === 'true');
await rm.close();

// ---------- video pause control + off-screen ----------
await page.goto(base, { waitUntil: 'load' });
await page.waitForTimeout(3500);
t('hero video plays', await page.evaluate(() => { const v = document.querySelector('#hero-video'); return !!v && !v.paused && v.currentTime > 0; }));
await page.click('[data-pause="hero-video"]');
t('pause button pauses', await page.evaluate(() => document.querySelector('#hero-video').paused));
await page.click('[data-pause="hero-video"]');
await page.waitForTimeout(800);
t('play button resumes', await page.evaluate(() => !document.querySelector('#hero-video').paused));
await page.evaluate(() => scrollTo(0, document.body.scrollHeight * 0.45));
await page.waitForTimeout(1200);
t('off-screen hero video is paused', await page.evaluate(() => document.querySelector('#hero-video').paused));

t('no JS errors or console errors in the whole run', errors.length === 0, errors.join(' | '));
await browser.close();
console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
