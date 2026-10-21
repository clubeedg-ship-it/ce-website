# Deploying CuttingEdge v3 to Hostinger (public_html)

**Do not deploy until nano approves.** Nothing in this repo touches production by itself.
Host: Hostinger shared hosting, LiteSpeed, hPanel, PHP available, `.htaccess` honoured.
Time needed: about 20 minutes. Keep the old site's backup until the checks below pass.

## 0. Before you start
* [ ] `CONTENT-NEEDED.md` section 1 answered (recipient, sender, budget bands, www/apex).
* [ ] Build the production site on your machine:
  ```bash
  cd site && npm ci && npm run build        # → site/dist/  (base "/", indexable)
  ```
* [ ] Edit `site/public/api/config.php` **before** building (it is copied into `dist/api/`), or edit it on the server after upload. Set `recipients`, `from`.
* [ ] Zip including hidden files (`.htaccess` matters):
  ```bash
  cd site/dist && zip -r ../../ce-v3.zip . && cd ../..
  ```

## 1. Back up the current site (rollback depends on this)
1. hPanel → **Websites → Manage → Files → File Manager** → open `public_html`.
2. Select everything → **Compress** → `ce-live-backup-YYYYMMDD.zip` (hidden files included; File Manager's *Settings → Show hidden files* on). Download the zip to your computer, and keep a copy outside `public_html` (e.g. in `/home/<user>/backups/`).
3. Optional second safety net: hPanel → **Files → Backups** → generate/confirm a recent backup.
4. Note the current PHP version (hPanel → **Advanced → PHP Configuration**).

## 2. PHP settings (once)
hPanel → **Advanced → PHP Configuration**: choose **PHP 8.1 or newer** (the endpoint needs ≥ 7.4). In the *Options/Disabled functions* tab make sure `mail` is **not** in `disable_functions`.

## 3. Upload
1. In File Manager, upload `ce-v3.zip` into `public_html`, then **Extract** it there. (Alternative: SFTP/FTP with the credentials from hPanel → Files → FTP Accounts, uploading the *contents* of `site/dist/`.)
2. Delete the legacy leftovers that v3 replaces (they are in your backup): the old `*.html` files at the top level (`index.html` is overwritten; remove `approach.html`, `contact.html`, `legal.html`, `privacy.html`, `projects.html`, `project-*.html`), the old `Media/` and `static/` folders, and the old `sitemap.xml`/`robots.txt` (overwritten). Keep nothing named `Media` or `static`: those URLs are now redirects.
3. Confirm `public_html/.htaccess` is the new one (it begins `# CuttingEdge production .htaccess`).

## 4. Enquiry log directory (PHP)
The endpoint writes every enquiry to a log **and** emails it. By default the log lives in `public_html/api/_data/` and is created on the first enquiry together with a deny-all `.htaccess`.

Recommended hardening (2 minutes): keep the log **outside** the web root.
1. File Manager → above `public_html` (your home folder, next to it) → **New Folder** `ce-data`.
2. Edit `public_html/api/config.php`: `'data_dir' => '/home/<your-hosting-user>/ce-data',` (the exact path is shown at the top of File Manager / in hPanel → Files → *Path*).
3. Folder permissions `750` (default is fine). PHP must be able to write there.

Reading leads: File Manager → `ce-data/leads.jsonl` (one JSON object per line; a line with `"event":"mail"` records whether the email went out: `"ok":false` means email failed and the lead only exists in the log: reply to it manually).
Retention (privacy policy promises deletion within 12 months if no business relationship): delete old lines from `leads.jsonl` and the mailbox accordingly.

## 5. Post-deploy checks (run all; each should pass)
```bash
B=https://cuttingedge.world
curl -sI $B/ | head -20                          # 200, Strict-Transport-Security, Content-Security-Policy, X-Content-Type-Options, Permissions-Policy
curl -sI http://cuttingedge.world/ | head -3     # 301 → https
curl -sI https://www.cuttingedge.world/ | head -3   # 301 → https://cuttingedge.world/
curl -s $B/robots.txt                            # Allow: /  + Sitemap line (NOT "Disallow: /")
curl -s $B/sitemap.xml | grep -c '<loc>'         # 40 (20 pages × 2 languages) + whatever you added
curl -s $B/llms.txt | head -5
curl -sI $B/nl/ | head -1 ; curl -sI $B/projects/restaurant-looks/ | head -1     # 200
curl -s -o /dev/null -w '%{http_code}\n' $B/api/config.php      # must NOT be 200 (403/404)
curl -s -o /dev/null -w '%{http_code}\n' $B/api/_data/leads.jsonl   # must NOT be 200
curl -s $B/api/contact.php?token=1                # {"tk":"…"}
bash scripts/check-redirects.sh $B                # every legacy URL → 301 → 200
curl -s $B/ | grep -ci noindex                    # 0: the production build has no noindex
```
Then in a browser:
* [ ] Home loads instantly with the poster; video starts shortly after; the pause button works.
* [ ] **Send a real test enquiry** from `/contact/` (mobile too). It must land in the mailbox (check spam) with *Reply-To* = the address you typed, and appear in `leads.jsonl`. Repeat once in Dutch at `/nl/contact/`.
* [ ] Open DevTools → Network: no request to any host other than cuttingedge.world; Application → Cookies: empty.
* [ ] Spot check [PageSpeed Insights](https://pagespeed.web.dev/) for `/`, `/projects/`, `/contact/`.
* [ ] Google Search Console: submit `https://cuttingedge.world/sitemap.xml`; use *URL inspection* on `/` and `/nl/`.
* [ ] If Hostinger's CDN / LiteSpeed cache is on: purge it (hPanel → Performance / Cache Manager).

## 6. Rollback (takes ~5 minutes)
1. File Manager → `public_html` → select all → Delete (the new site).
2. Upload `ce-live-backup-YYYYMMDD.zip` into `public_html` → **Extract** (restores the old files and old `.htaccess`).
3. Purge cache; check `https://cuttingedge.world/` is the old site.
4. HSTS note: browsers that visited v3 remember HTTPS for one year. The old site was already served over HTTPS, so this is harmless; no action needed.
5. Leads received on v3 stay in `leads.jsonl` / the mailbox. Do not delete `ce-data`.

## Troubleshooting
| Symptom | Cause / fix |
|---|---|
| Form says “could not send” | Open `/api/contact.php?token=1`: if not JSON, PHP is not running (check PHP version); if 500, check `data_dir` is writable. Visitors see WhatsApp/email fallback meanwhile. |
| Enquiries appear in `leads.jsonl` but no email | `mail()` blocked or sender rejected: set `'from'` to a mailbox on the domain, try `'envelope_from' => true`, check `mail` is not disabled. |
| Whole site shows a 500 | `.htaccess` directive not supported: restore the backup `.htaccess`, then remove the `Header`/`<If>` blocks one by one. |
| Redirect loop | `Options`/`RewriteRule` clash with another `.htaccess` in a parent directory; the new file should be the only one in `public_html`. |
| Images/videos missing | The zip lost the `media/` or `_astro/` folder; re-extract. |
