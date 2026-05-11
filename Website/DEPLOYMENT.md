# Hostinger Deployment Instructions

## Overview
Your CuttingEdge website has been converted to static HTML files ready for Hostinger deployment.

## What Was Done
- Converted HTMX dynamic templates to static HTML pages
- Removed all server-side dependencies
- All navigation now uses standard HTML links
- All assets (CSS, images, videos) are included

## Deployment Steps

### 1. Access Your Hostinger File Manager
- Log in to your Hostinger account
- Go to your hosting control panel
- Open the File Manager

### 2. Upload Files
Upload the **entire contents** of the `dist/` folder:

```
dist/
├── index.html          ← Home page
├── approach.html       ← Approach page
├── projects.html       ← Projects page
├── contact.html        ← Contact page
├── static/            ← CSS and JS files
│   ├── css/
│   └── js/
└── Media/             ← Images, videos, and logo
```

**Important**: Upload to your `public_html` directory (or `www` depending on your Hostinger plan)

### 3. Verify Upload
Make sure all files and folders are uploaded:
- ✓ 4 HTML files (index, approach, projects, contact)
- ✓ static/ folder with css/ subfolder
- ✓ Media/ folder with all images and videos

### 4. Set Homepage
In Hostinger, ensure `index.html` is set as your default/home page (this is usually automatic)

### 5. Test Your Site
Visit your domain and test:
- All pages load correctly
- Navigation works
- Images and videos display
- CSS styling is applied
- Menu animation plays on page load

## File Structure on Hostinger

```
public_html/
├── index.html
├── approach.html
├── projects.html
├── contact.html
├── static/
│   └── css/
│       └── style.css
└── Media/
    ├── logo.svg
    ├── cuttingedge-hero.mp4
    └── [all other media files]
```

## Troubleshooting

### CSS Not Loading
- Check that the `static/` folder is uploaded
- Verify folder names are case-sensitive (static, not Static)

### Images Not Showing
- Ensure `Media/` folder is uploaded with all subdirectories
- Check file permissions (should be 644 for files, 755 for folders)

### Videos Not Playing
- Large video files may take time to upload
- Verify `.mp4` files are fully uploaded (check file sizes)

## Notes
- The site is now 100% static HTML/CSS/JavaScript
- No server-side processing required
- Works with any basic web hosting plan
- All animations and styling are client-side

## Need Help?
If you encounter issues:
1. Check Hostinger's error logs in the control panel
2. Use browser DevTools (F12) to check for 404 errors
3. Verify all file paths are correct and case-sensitive
