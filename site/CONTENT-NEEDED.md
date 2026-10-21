# Content needed from nano / the studio

Everything below was **left out or decided provisionally** because the existing site, media and legal page do not
contain the facts. Nothing here was invented: where a fact was missing, the page simply omits it.

## 1. Decisions to confirm (these change live behaviour)

| # | Item | What v3 does now | Needed |
|---|------|------------------|--------|
| 1 | **Lead recipient** | `site/public/api/config.php` → `recipients = ['klucas.lucas@gmail.com']`, the address shown on the live pages today. | Confirm, or give the real studio mailbox (the old JSON-LD said `info@cuttingedge.world`, the pages said the Gmail address: they disagreed). One line to change. |
| 2 | **Sender address** | `no-reply@cuttingedge.world`. On Hostinger the From domain should exist on the hosting or mail may be rejected/spam-filtered. | Confirm a mailbox on the domain (or tell us to use the hosting default). |
| 3 | **Budget bands** (form) | Defaults I chose: under €25k · €25–50k · €50–100k · €100–250k · over €250k · not sure. Timeline: asap · ≤3 mo · 3–6 · 6–12 · flexible. | Replace with the studio's real bands if different (`site/public/api/form-options.json` + labels in `site/src/i18n/copy.ts`). |
| 4 | **Phone / WhatsApp** | `+31 6 47 63 97 02` for call and WhatsApp (the legacy site used that number for WhatsApp). | Confirm it is a WhatsApp number the studio reads. |
| 5 | **www vs apex** | `.htaccess` redirects `www.` → `https://cuttingedge.world`. Canonical URLs use the apex. | Confirm apex is the preferred host. |
| 6 | **Response time** | “Typically within 24 hours”, copied from the legacy contact page. | Confirm it is still true. |

## 2. Content that is missing (not shown on the site)

* **Social profiles.** Instagram, LinkedIn and Pinterest links on the live site were `href="#"`. They are omitted, and JSON-LD has no `sameAs`. Send the real URLs and they go into the footer + schema.
* **Project case-study detail.** The old site only has a challenge and an outcome per project. v3 shows “brief / challenge / outcome” from that text and, for “approach”, the description of the service category used. No project-specific approach text exists. For **Thai Restaurant, Jewellery Boutique, Beauty Salon and Kitchen Design** there is no text at all; their pages show only facts visible in the photos. Send brief/challenge/outcome, year, location and scope for these.
* **Beauty Salon (project 9).** Only a video existed. It now has a page (video only). Needs photos and facts.
* **Photographer credits.** Only project 5 names a photographer (Michael Broekmeulen, credited on that photo, the legal page and in JSON-LD). Credits for all other photos are unknown.
* **Testimonials, awards, press, team, years in business, client list.** None exist in the sources, so none are shown.
* **Opening hours / visiting policy.** Not in the sources.
* **A real map.** Deliberately not embedded (would load a third party). The address is text only.

## 3. Things in the source material that look wrong: please check before launch

* **Logo.** `logo.svg` is a *dark-ink* artwork (near-black) on transparent with stray confetti-like specks, drawn on a 2048 px canvas with the mark small in the middle; it looks like a frame from the logo animation. It is unreadable on a dark site, so v3 uses **the same artwork**, tightly cropped and recoloured to cream (`site/src/assets/brand/logo-light.svg`, produced by `site/scripts/prep-assets.mjs`). No new logo was drawn. Please supply a clean light-on-dark vector.
* **Project text vs photos.** The legacy project pages describe things the photos do not show. v3 follows the photos where they clearly contradict the text:
  * Project 2 “Urban Apartment (85 m²)” is a **jewellery boutique** in the photos and in the hero video → renamed “Jewellery Boutique”, sector commercial, specifics dropped.
  * Project 6 “Boutique Hotel Suite” is a **kitchen** → “Kitchen Design”, residential, specifics dropped.
  * Project 10 “Modern Villa (450 m²)” is a **Thai restaurant (Pad Thai sign visible)** → “Thai Restaurant”, hospitality, specifics dropped.
  * Years, locations and figures on the other pages (e.g. Restaurant Looks 2008 · 60 covers, Heritage Villa 2015 Rotterdam, Private Residence 2018 · 280 m²) are **carried over unverified**. Project 3's photo is a render, not a 1920s villa. Please confirm each.
  * Old URLs `/project-2.html`, `/project-6.html`, `/project-10.html` redirect to the renamed pages.
* **Videos are AI-generated.** Hero, jewellery, restaurant-wall and loft videos carry a **“Veo” watermark** (Google Veo output). The watermark strip was cropped off. Please confirm this is allowed under the generator's terms, or provide originals; decide whether to disclose (the legal page now says “some background videos are computer-generated visualisations”).
* **Third-party names/people visible in photos.** Thai Restaurant shows a “Pad Thai” sign; Hospitality Collection shows a Jägermeister stag emblem and guests/staff; “Johannes Obrecht” (project 8) is a private person's name used as the title. Confirm client consent / preferred wording.
* **Legal text.** Terms are carried over from the live legal page unchanged (e.g. “maintains professional liability insurance”), and the Dutch version is my translation: have it checked by whoever advises on the terms. The privacy policy was rewritten to match the new form + enquiry log: confirm the processors named generically (web host, email provider) and the 12-month retention.
* **Copy.** English was rewritten from the source wording; Dutch is written natively but deserves a read by a Dutch speaker from the studio. Service-page descriptions elaborate the three bullet lists from the old site in general terms; no figures or promises were added.

## 4. Technical notes the studio should know

* The enquiry endpoint stores every submission in `api/_data/leads.jsonl` **and** emails it. If email is not delivered, the lead is still in that file (see `DEPLOY.md` for how to read it). Check it after the first real enquiry.
* HSTS is set to one year **without** `includeSubDomains` (safer if mail/other subdomains are not HTTPS). Add it later if wanted.
* `sitemap.xml` `lastmod` is the build date.
