3# CuttingEdge Website - Client-Side HTMX Deployment Guide

## Solution Overview

Your website now uses **client-side HTMX** which works perfectly on static hosting like Hostinger! 

### What Changed?
- **Single HTML file** (`index.html`) with base layout (header + footer always visible)
- **Page partials** in `pages/` directory loaded dynamically via HTMX
- **No server-side routing** needed - everything works client-side!

### Structure
```
dist/
├── index.html          # Main file with base layout + home content
├── pages/              # Page partials loaded by HTMX
│   ├── home.html
│   ├── approach.html
│   ├── projects.html
│   ├── contact.html
│   ├── project_1.html
│   ├── project_4.html
│   └── project_10.html
├── static/             # CSS files
└── Media/              # Images and videos
```

## Deployment Steps

### 1. **Build the Static Site**
```bash
python3 build_static.py
```

This creates the `dist/` folder with all files ready for upload.

### 2. **Upload to Hostinger**

#### Via File Manager (Recommended):
1. Log into Hostinger control panel
2. Go to **File Manager**
3. Navigate to `public_html/`
4. **Delete everything** in `public_html/` (backup first if needed)
5. Upload **ALL contents** of the `dist/` folder:
   - `index.html`
   - `pages/` folder
   - `static/` folder
   - `Media/` folder

#### Via FTP:
1. Connect to Hostinger via FTP
2. Navigate to `public_html/`
3. Upload all contents from `dist/` folder

### 3. **Access Your Site**
- Your site will be at: `https://yourdomain.com`
- Footer and header load immediately (they're in `index.html`)
- Page navigation works via HTMX (loads partials from `pages/`)

## How It Works

### Navigation
When you click a navigation link:
1. HTMX fetches the page partial (e.g., `/pages/approach.html`)
2. Swaps content into `#main-content` div
3. Updates browser URL (e.g., `/approach`)
4. Header and footer stay in place (no reload!)

### Projects
- **3 unique projects** displayed on projects page
- Each links to its detail page in `pages/`
- All images load correctly from `Media/`

## Troubleshooting

### Footer Not Loading?
✅ **FIXED!** Footer is now in `index.html` and always loads

### Can't Navigate to Pages?
✅ **FIXED!** Navigation uses client-side HTMX partials

### Wrong Number of Projects?
✅ **FIXED!** Now showing 3 unique projects (not 6 duplicates)

## Rebuilding After Changes

If you make changes to templates:
```bash
# 1. Edit files in templates/
# 2. Rebuild
python3 build_static.py
# 3. Re-upload dist/ folder to Hostinger
```

## Key Benefits

✅ Works on **static hosting** (Hostinger, GitHub Pages, Netlify, etc.)  
✅ **No server** needed  
✅ **Fast loading** - footer/header never reload  
✅ **SEO friendly** - proper URLs with pushState  
✅ **Browser back/forward** buttons work correctly
