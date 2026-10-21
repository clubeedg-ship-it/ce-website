# Design system: CuttingEdge v3

Brand DNA is unchanged: **CuttingEdge · Pragmatic Luxury**, dark palette with champagne gold, Playfair Display + Inter.
Everything else is editorial: image-led, quiet, precise. All tokens live in `src/styles/global.css` (`:root`).

## Surface archetypes (composition decided before tokens)
| Page | Primary surface | Consequence |
|---|---|---|
| Home | **Decide / Learn** | The only page with a full-bleed hero. One idea per section: promise → stance → work → disciplines → process → ask. No equal three-card row anywhere. |
| Projects index | **Explore** | Filter chips + a two-column image grid; the project photo is the interface. |
| Project | **Decide** (case study) | Hero image, narrative column + facts column, gallery, next project. |
| Services / Approach | **Compare / Learn** | Numbered rows, long-form text, before/after slider for the process. |
| Contact | **Configure** | Three short steps, visible progress, inline errors, no decoration. |
| Legal / privacy | **Learn** | Narrow measure (46rem), hierarchy by type only. |

## Colour
| Token | Value | Use | Contrast on `--ink-1` |
|---|---|---|---|
| `--ink-0` | `#050505` | deepest surfaces, footer, hero overlays | |
| `--ink-1` | `#121212` | page background | |
| `--ink-2` | `#1a1a1a` | form panel, image placeholders | |
| `--paper` | `#f3efe6` | headings, primary text | 16.3 : 1 |
| `--text` | `#e8e4da` | body | 14.8 : 1 |
| `--muted` | `#a8a49b` | secondary text | 7.5 : 1 |
| `--gold` | `#d4af37` | accent, focus ring, eyebrows, primary button fill | 8.9 : 1 |
| `--gold-2` | `#c5a059` | rules, italics, secondary accent | 7.6 : 1 |
| `--gold-ink` | `#16130a` | text on gold buttons | 8.8 : 1 on gold |
| `--danger` | `#ff9b8e` | form errors (icon + text, never colour alone) | 9.2 : 1 |
Gold is used sparingly: one accent per view cell, never a gradient.

## Type
* Display/headings: **Playfair Display** (variable, latin subset WOFF2, 38 KB) weight 500, tight tracking (−0.01 to −0.03 em).
* UI/body: **Inter** (variable, latin subset WOFF2, 48 KB). Small caps-style labels: 12–13 px, 600, tracking 0.14–0.2 em, uppercase.
* Both self-hosted, preloaded, `font-display: swap`, with metric-matched fallbacks (`size-adjust`) to keep layout shift near zero.
* Fluid scale (`clamp`): `--s-1` 0.8–0.875 rem · `--s0` 1–1.125 · `--s1` 1.2–1.55 · `--s2` 1.55–2.35 · `--s3` 2.1–3.9 · `--s4` 2.7–6.6 rem (hero/page titles).
* Measure: body ≤ 58 ch, leads ≤ 42–46 ch, headings use `text-wrap: balance`.

## Layout
* Container `max 1440 px`, gutter `clamp(1.25rem, 4vw, 3.5rem)`; 12-column grids with deliberate asymmetry (7/5, 8/4, offset second column on the home mosaic).
* Section rhythm `clamp(4.5rem, 10vw, 9rem)`; hairline rules (`--line`) instead of boxes.
* Breakpoints: 980 px (nav collapses), 900 px (split layouts stack), 760 px (mosaic stacks, sticky action bar), 700 px (grids single column).

## Components
* **Header**: fixed, transparent over the hero, solid `ink-1/96` + hairline after 40 px of scroll (no blur). Logo (restored artwork, cream), 4 links, language switch (links to the counterpart page), CTA. Mobile: full-screen menu, Esc closes, focus moved in.
* **Hero (video)**: poster `<picture>` is the LCP element and is preloaded (`fetchpriority=high`); video attaches after `load`, fades in over the poster, pauses off-screen / on hidden tab, never starts under `prefers-reduced-motion` or data-saver. Visible pause/play button.
* **Buttons**: solid gold (primary) and outline (ghost), 3.1 rem tall, 0.14 em tracking, arrow nudge on hover. Focus ring: 3 px gold, 3 px offset.
* **Project card**: image (3:2, or 4:5 in the mosaic) + sector/service meta + serif title; image scales 4.5 % on hover.
* **Service row**: numeral, title, description + bullet list, arrow; row shifts 1 rem on hover.
* **Before/after slider**: hidden native `<input type=range>` (keyboard, touch, pointer for free), gold divider; stacks as two images without JS.
* **Lightbox**: native `<dialog>`, arrows/Esc/swipe, caption = alt text, focus returns to the thumbnail.
* **Enquiry form**: 3 steps (Project → Space → You), progress strip, fieldset legends receive focus on step change, errors inline + summary (`role=alert`) with links, choices as large radio/checkbox tiles (≥ 54 px), consent link to the privacy policy.
* **Mobile action bar**: WhatsApp · Call · Enquire (gold), 56 px, safe-area aware, from 760 px down.
* **Footer**: address, KvK number, nav, legal, language.

## Motion
Restrained: reveal-on-scroll (26 px, 0.9 s), hero copy rise (transform only, so LCP is not delayed), card image zoom, nav underline, native cross-document **View Transitions** (`@view-transition { navigation: auto }`, 0.28 s root crossfade, header kept still). Everything is removed under `prefers-reduced-motion: reduce`.

## Accessibility (WCAG 2.2 AA targets)
Skip link; landmarks (`header`, `nav` ×3 labelled, `main`, `footer`); one `h1` per page; visible 3 px focus everywhere; target size ≥ 44 px; contrast per table; form errors announced (`role=alert`, `aria-invalid`, `aria-describedby`), field help associated; pause control for video; keyboard operable menu, slider, lightbox, form; alt text for every image written from the image itself (EN + NL).

## Performance + privacy budgets
CSS < 40 KB gz, JS < 30 KB gz in total, hero video ≤ 3 MB, other videos ≤ 4 MB, AVIF/WebP with `width`/`height`, lazy below the fold, zero third-party requests, no cookies, strict self-only CSP (so no inline script/style anywhere: state is set through classes and `style.setProperty`).

## Slop self-audit (claude-design diagnostic)
Tells fired: none of 1 tech gradient, 2 generic hue, 3 feature-tile grid, 4 accent rail, 5 unearned blur, 6 monument stat, 7 icon topper, 9 default type. Watch-list: 8 *centre stack* (kept to the 404 and thank-you only) and 10 *wrong surface* (hero is confined to Decide pages). Score **0–1 / 10**.
