# CuttingEdge website

Static, vanilla HTML/CSS/JS. No build step.

## Structure

```
v2/
├── index.html, approach.html, projects.html, contact.html, privacy.html, legal.html
├── projects/                # project detail pages (project-1.html ... project-10.html)
├── assets/
│   ├── css/style.css
│   ├── js/translations.js   # runtime EN/NL i18n (data-i18n attributes)
│   ├── images/
│   │   ├── projects/<id>/   # per-project photos
│   │   └── process/         # process imagery
│   ├── videos/              # hero / showcase videos
│   └── icons/               # logo.svg, favicon.png
├── sitemap.xml, robots.txt, .htaccess
└── serve.py                 # local preview only
```

## Local preview

```
python3 serve.py
# -> http://localhost:8000
```

The dev server mimics the production `.htaccess` rule that lets URLs work
without the `.html` suffix.

## Deploy

Upload the entire `v2/` directory contents to your static host's web root
(e.g. Hostinger `public_html/`). The included `.htaccess` enables
extensionless URLs on Apache hosts; on Netlify / Cloudflare Pages /
GitHub Pages, configure equivalent rewrites or leave URLs with `.html`.

## i18n

Translations live in `assets/js/translations.js` and switch at runtime
based on `data-i18n` attributes in the markup. No build step required to
add a string — edit the dictionary and add the attribute.
