# CuttingEdge website v3 (source)

Astro (static output) + one PHP endpoint. The build produces plain files you upload to Hostinger `public_html`.
EN lives at `/`, NL under `/nl/` with Dutch slugs; every page exists as real HTML in both languages (no JS text swap).

```
site/
├── src/
│   ├── content/projects/*.yaml   one file per project  ← add a project here
│   ├── assets/                   photos, posters, fonts, logo (processed by the Astro image pipeline)
│   ├── i18n/                     all copy EN + NL (copy.ts, legal.ts)
│   ├── lib/                      routes, SEO/JSON-LD, image helpers
│   ├── views/ components/        page templates and UI pieces
│   ├── pages/                    [...slug].astro (all pages), 404, robots, sitemap, llms.txt, og/*.jpg
│   ├── scripts/                  ~10 KB vanilla JS (menu, video, filter, lightbox, compare, form)
│   └── styles/global.css         design tokens + components (see DESIGN.md)
├── public/                       copied as-is: .htaccess, api/ (PHP), media/ (videos), favicons
├── scripts/                      prep-assets.mjs, gen-redirects.mjs, fonts/ (OG rendering)
├── redirects.tsv                 legacy URL → new URL table (source of the .htaccess redirects)
└── tests/                        crawl.mjs (Playwright), php-endpoint.test.sh
../scripts/                       encode-videos.sh, extract-posters.sh, check-redirects.sh, serve-dist.py
```

## Requirements
Node ≥ 22 (built with 26), npm. No other services. (PHP only to run the endpoint tests locally.)

## Build

```bash
cd site
npm ci
npm run build            # production  → dist/    (base "/", indexable, https://cuttingedge.world)
npm run build:preview    # preview     → dist-preview/ (base "/ce-website/", noindex, robots Disallow, form "preview, not sent")
```
The first build encodes ~250 AVIF/WebP images (several minutes on a slow CPU); later builds reuse the cache in `node_modules/.astro`.

## Look at it locally

```bash
python3 ../scripts/serve-dist.py dist 8080 --htaccess public/.htaccess      # production build + legacy redirects
python3 ../scripts/serve-dist.py dist-preview 8081 --prefix /ce-website    # preview build
```
`serve-dist.py` is a convenience server (trailing-slash redirects, 404 page, emulates the `RewriteRule` redirect lines only).
To try the form end to end locally, also run `php -S 127.0.0.1:9000 -t dist` and add `--php http://127.0.0.1:9000`.

## Add a project (no code changes)

1. Put the photos under `src/assets/projects/<slug>/` (JPEG, long edge ≤ 2560 px is plenty).
2. Copy `src/content/projects/restaurant-looks.yaml` to `src/content/projects/<slug>.yaml` and edit it:
   ```yaml
   id: 11                       # unique number; used for the OG image name
   order: 11                    # position in lists
   featured: false              # true → candidate for the 4 slots on the home page
   sector: hospitality          # hospitality | residential | commercial
   services: [turn-key-build]   # concept-design | technical-drawings | turn-key-build (may be empty)
   slugs: { en: my-project, nl: mijn-project }     # URL parts (EN: /projects/my-project/, NL: /nl/projecten/mijn-project/)
   title:   { en: My Project, nl: Mijn project }
   summary: { en: "…", nl: "…" }                    # also the meta description
   brief / challenge / outcome: optional { en, nl }
   facts: [ { key: year, label: {en: Year, nl: Jaar}, value: {en: "2024", nl: "2024"} } ]
   hero: ../../assets/projects/<slug>/main.jpg
   heroAlt: { en: "Describe the picture", nl: "Beschrijf de foto" }   # alt text is required in both languages
   gallery: [ { src: ../../assets/projects/<slug>/two.jpg, alt: {en, nl}, credit: "Photographer" } ]
   video: null                  # or { src: <file in public/media without extension>, poster: ../../assets/posters/x.jpg, alt: {en, nl} }
   ```
3. `npm run build`. EN + NL pages, sitemap entries, hreflang, JSON-LD, OG image, redirects-free URL and the projects filter are generated. A build **fails** if a required field (such as alt text) is missing.
4. For a video: `ffmpeg` a WebM (VP9) and MP4 (H.264) pair into `public/media/<name>.webm|mp4` (see `../scripts/encode-videos.sh` for the settings: ≤ 1280 px wide, no audio, hero ≤ 3 MB, others ≤ 4 MB).

## Change the enquiry form
* Recipient, sender, rate limit, data directory → `public/api/config.php` (edit on the server after upload, too).
* Budget / timeline / sector / service choices → `public/api/form-options.json` (the keys) **and** the labels in `src/i18n/copy.ts` (`contactPage.*.budgets` etc.), then rebuild.
* Test the endpoint: `PHP_BIN=/path/to/php bash tests/php-endpoint.test.sh` (starts its own `php -S`, 30 checks).

## Change redirects
Edit `redirects.tsv`, run `node scripts/gen-redirects.mjs` (rewrites the generated block in `public/.htaccess`), commit. Check against a live host with `../scripts/check-redirects.sh https://cuttingedge.world`.

## Checks (all of these were run before the PR; outputs are in `tests/evidence/`)
```bash
export LD_LIBRARY_PATH=~/.local/share/chromium-deps/root/usr/lib/x86_64-linux-gnu    # only needed on the build host
node tests/crawl.mjs http://127.0.0.1:8090/ --out crawl.json     # every page EN+NL: console, links, assets, alt, meta, cookies, third parties
node tests/e2e.mjs http://127.0.0.1:8090/ dist/api/_data/leads.jsonl   # form (steps, errors, no-JS, failure path), slider, lightbox, filter, menu, video, reduced motion
PHP_BIN=/path/to/php bash tests/php-endpoint.test.sh             # 30 endpoint checks on php -S
VNU_JAVA=… VNU_JAR=… bash tests/validate-html.sh dist           # W3C Nu HTML checker, all pages
bash tests/lighthouse.sh out http://127.0.0.1:8090 1             # Lighthouse mobile, 4x and 1x CPU (needs Chrome on :9333, see the script header)
bash ../scripts/check-redirects.sh http://127.0.0.1:8090         # legacy → new 301s
SIDES=after node tests/shots.mjs ../.shots https://cuttingedge.world http://127.0.0.1:8090 && python3 tests/compare-shots.py ../.shots docs/screenshots
```
(`../scripts/serve-dist.py site/dist 8090 --htaccess site/public/.htaccess --gzip --php http://127.0.0.1:9000` + `php -S 127.0.0.1:9000 -t dist` is the local stack used for these.)
`tests/psi.sh` runs PageSpeed Insights against a public URL; keyless access has no daily quota (HTTP 429), so add an API key to use it.
Deploying: see `DEPLOY.md`. Open questions for the studio: `CONTENT-NEEDED.md`. Design system: `DESIGN.md`.

## Public preview at edge.oopuo.nl

Served from the hermeslocal server through a Cloudflare tunnel (not GitHub Pages, not Hostinger). Always noindex; the form only shows the preview notice (no PHP behind it).

- build (in `site/`): `PREVIEW=1 PREVIEW_SITE=https://edge.oopuo.nl PREVIEW_BASE=/ FONTCONFIG_FILE=$PWD/scripts/fonts/fonts.conf npx astro build --outDir dist-edge`
- publish (live at once): `rsync -a --delete --exclude api/ --exclude .htaccess dist-edge/ ~/srv/edge.oopuo.nl/`
- web: user unit `ce-edge-web.service` = `scripts/serve-dist.py ~/srv/edge.oopuo.nl 8792 --gzip --public` (production security headers read from `public/.htaccess`, plus `X-Robots-Tag: noindex`)
- tunnel: user unit `cf-oopuo-web.service` (tunnel `oopuo-web`, config `~/.cloudflared/oopuo-web.yml`, ingress `edge.oopuo.nl` -> `127.0.0.1:8792`); setup script `~/srv/oopuo-web/setup.sh`
