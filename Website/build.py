#!/usr/bin/env python3
"""
Build script for multi-page static site (no HTMX).
Creates standalone HTML pages that work on any static hosting.
Includes SEO optimization: meta tags, JSON-LD, sitemap, robots.txt.
"""

import os
import shutil
import json
from pathlib import Path
from datetime import datetime

# Configuration
TEMPLATES_DIR = "templates"
OUTPUT_DIR = "dist"
STATIC_DIR = "static"
MEDIA_DIR = "Media"
SITE_URL = "https://cuttingedge.world"

# Page metadata for SEO
PAGES_META = {
    "index.html": {
        "template": "home.html",
        "title": "CuttingEdge | Pragmatic Luxury Interior Design",
        "description": "Translating vision into enduring reality. Amsterdam-based interior design studio specializing in hospitality, residential, and commercial projects.",
        "priority": "1.0"
    },
    "approach.html": {
        "template": "approach.html",
        "title": "Our Approach | CuttingEdge Design Studio",
        "description": "Scalable design, lean management, advanced technology. Discover our methodology for delivering exceptional interior spaces.",
        "priority": "0.8"
    },
    "projects.html": {
        "template": "projects.html",
        "title": "Selected Works | CuttingEdge Portfolio",
        "description": "A portfolio of precision and elegance. Explore our hospitality, residential, and commercial interior design projects.",
        "priority": "0.9"
    },
    "contact.html": {
        "template": "contact.html",
        "title": "Contact | CuttingEdge Interior Design",
        "description": "Start your project with CuttingEdge. Amsterdam office, worldwide delivery. Let's shape something extraordinary together.",
        "priority": "0.8"
    },
    "privacy.html": {
        "template": "privacy.html",
        "title": "Privacy Policy | CuttingEdge",
        "description": "How CuttingEdge protects your personal data. GDPR compliant privacy policy.",
        "priority": "0.3"
    },
    "legal.html": {
        "template": "legal.html",
        "title": "Legal Notice | CuttingEdge",
        "description": "Legal information, terms and conditions, and company details for CuttingEdge interior design.",
        "priority": "0.3"
    }
}

# JSON-LD Structured Data for LocalBusiness
JSON_LD_BASE = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "CuttingEdge",
    "description": "Pragmatic luxury interior design studio specializing in hospitality, residential, and commercial projects.",
    "url": SITE_URL,
    "logo": f"{SITE_URL}/Media/cuttingedge-tabicon.png",
    "image": f"{SITE_URL}/Media/cuttingedge-tabicon.png",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "Ookmeerweg 101",
        "addressLocality": "Amsterdam",
        "postalCode": "1068AP",
        "addressCountry": "NL"
    },
    "telephone": "+31647639702",
    "email": "info@cuttingedge.world",
    "priceRange": "$$$",
    "areaServed": ["Netherlands", "Europe", "Worldwide"],
    "serviceType": ["Interior Design", "Concept Design", "Turn-key Build", "Technical Drawings"]
}

def read_file(filepath):
    """Read file content."""
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(filepath, content):
    """Write content to file."""
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def generate_json_ld(page_name):
    """Generate JSON-LD structured data for a page."""
    ld = JSON_LD_BASE.copy()
    
    # Add page-specific WebPage schema
    if page_name == "index.html":
        ld["@type"] = ["LocalBusiness", "WebSite"]
    
    return f'<script type="application/ld+json">\n{json.dumps(ld, indent=2)}\n</script>'

def remove_htmx_and_fix_links(html_content):
    """Remove HTMX and convert to regular links."""
    import re
    
    # Remove HTMX script tag
    html_content = re.sub(r'<script src="https://unpkg\.com/htmx\.org@[^"]*"></script>', '', html_content)
    
    # Remove HTMX attributes from navigation
    html_content = re.sub(r'\s+hx-get="[^"]*"', '', html_content)
    html_content = re.sub(r'\s+hx-target="[^"]*"', '', html_content)
    html_content = re.sub(r'\s+hx-push-url="[^"]*"', '', html_content)
    
    # Fix navigation links
    html_content = html_content.replace('href="/"', 'href="index.html"')
    html_content = html_content.replace('href="/approach"', 'href="approach.html"')
    html_content = html_content.replace('href="/projects"', 'href="projects.html"')
    html_content = html_content.replace('href="/contact"', 'href="contact.html"')
    
    # Fix root link
    html_content = re.sub(r'href="/"(?!\S)', 'href="index.html"', html_content)
    
    # Remove HTMX event listeners
    html_content = re.sub(
        r"// Update active nav link.*?(?=// WhatsApp Form Handler)",
        "// Static navigation - no event listeners needed\n        ",
        html_content,
        flags=re.DOTALL
    )
    
    # Fix absolute paths for static hosting (Hostinger)
    html_content = html_content.replace('href="/static/', 'href="static/')
    html_content = html_content.replace('src="/static/', 'src="static/')
    html_content = html_content.replace('href="/Media/', 'href="Media/')
    html_content = html_content.replace('src="/Media/', 'src="Media/')
    
    return html_content


def build_page(page_name, page_meta, base_template):
    """Build a single static HTML page with SEO metadata."""
    print(f"Building {page_name}...")
    
    # Read the page content
    page_content = read_file(os.path.join(TEMPLATES_DIR, page_meta["template"]))
    
    # Insert content into base template
    full_page = base_template.replace("{{ content }}", page_content)
    
    # Inject SEO metadata
    canonical_url = f"{SITE_URL}/{page_name}" if page_name != "index.html" else SITE_URL
    full_page = full_page.replace("{{ page_title }}", page_meta["title"])
    full_page = full_page.replace("{{ page_description }}", page_meta["description"])
    full_page = full_page.replace("{{ canonical_url }}", canonical_url)
    full_page = full_page.replace("{{ json_ld }}", generate_json_ld(page_name))
    
    # Remove HTMX and fix links
    full_page = remove_htmx_and_fix_links(full_page)
    
    # Write to output directory
    output_path = os.path.join(OUTPUT_DIR, page_name)
    write_file(output_path, full_page)
    
    print(f"✓ Created {output_path}")


# Comprehensive project data for storytelling
PROJECTS_DATA = {
    "1": {
        "name": "Private Residence",
        "category": "Concept Design",
        "type": "Residential",
        "location": "Amsterdam, NL",
        "year": "2018",
        "scope": "Full Interior",
        "hero_image": "2.jpg",
        "images": ["2.jpg"],
        "challenge": "Transform a dated Amsterdam townhouse into a contemporary sanctuary that honors the building's heritage while embracing modern living. The client sought a space that balanced warmth with sophistication.",
        "outcome": "A seamless blend of classic architecture and contemporary design. Custom millwork and curated furniture pieces create intimate yet airy spaces that feel both timeless and distinctly modern.",
        "metric": {"value": "280m²", "label": "Living Space"},
        "description": "Luxury private residence interior design in Amsterdam. Concept design showcasing bespoke furniture and refined aesthetics."
    },
    "2": {
        "name": "Urban Apartment",
        "category": "Concept Design",
        "type": "Residential",
        "location": "Amsterdam, NL",
        "year": "2023",
        "scope": "Full Renovation",
        "hero_image": "001.jpg",
        "images": ["001.jpg", "002.jpg", "003.jpg"],
        "challenge": "Maximize space and light in a compact city apartment while creating distinct zones for work, relaxation, and entertaining. The client needed a home that could adapt to their hybrid lifestyle.",
        "outcome": "An open-plan layout with clever spatial divisions using custom joinery. Natural materials and a restrained color palette create visual continuity, making the space feel larger than its footprint.",
        "metric": {"value": "85m²", "label": "Optimized Space"},
        "description": "Urban apartment redesign in Amsterdam. Full renovation maximizing space and light with clever spatial solutions."
    },
    "3": {
        "name": "Heritage Villa",
        "category": "Technical Design",
        "type": "Residential",
        "location": "Rotterdam, NL",
        "year": "2015",
        "scope": "Restoration",
        "hero_image": "3 copy.jpg",
        "images": ["3 copy.jpg"],
        "challenge": "Restore a 1920s villa to its former glory while integrating modern amenities invisibly. Every intervention needed to respect the original architectural language.",
        "outcome": "Meticulous restoration work revealed hidden details while smart technology was seamlessly embedded. The result honors history while providing contemporary comfort.",
        "metric": {"value": "1920", "label": "Original Build Year"},
        "description": "Heritage villa restoration in Rotterdam. Meticulous restoration respecting original 1920s architectural details."
    },
    "4": {
        "name": "Hospitality Collection",
        "category": "Turn-key Build",
        "type": "Hospitality",
        "location": "Amsterdam, NL",
        "year": "2020",
        "scope": "Complete Build",
        "hero_image": "Bar_2_1.jpg",
        "images": ["Bar_2_1.jpg", "DSC04834.JPG", "DSC04892 - Copy.JPG", "DSC04895 - Copy.JPG", "DSC05138.JPG"],
        "challenge": "Create a distinctive bar and lounge environment that would stand out in Amsterdam's competitive hospitality scene. The space needed to feel both exclusive and welcoming.",
        "outcome": "A signature atmosphere achieved through dramatic lighting, bespoke bar furniture, and carefully curated materials. The venue became a destination, not just a place to drink.",
        "metric": {"value": "3 months", "label": "Build Time"},
        "description": "Turn-key hospitality interior design in Amsterdam. Complete bar and restaurant build from concept to completion."
    },
    "5": {
        "name": "Restaurant Looks",
        "category": "Full Service",
        "type": "Hospitality",
        "location": "Amsterdam, NL",
        "year": "2008",
        "scope": "Complete Design",
        "hero_image": "restaurant Looks  (4).JPG",
        "images": ["restaurant Looks  (4).JPG", "restaurant Looks  Michael Broekmeulen (3).JPG", "Restaurant Looks35.jpg"],
        "challenge": "Design a restaurant that could host fine dining experiences while maintaining an approachable atmosphere. The culinary concept demanded a space that elevated without intimidating.",
        "outcome": "Warm wood tones and soft lighting create an intimate setting where guests feel special but relaxed. The design supports the culinary experience without competing with it.",
        "metric": {"value": "60", "label": "Covers"},
        "description": "Restaurant Looks full interior design in Amsterdam. Fine dining environment balancing elegance and approachability."
    },
    "6": {
        "name": "Boutique Hotel Suite",
        "category": "Concept Design",
        "type": "Hospitality",
        "location": "Amsterdam, NL",
        "year": "2020",
        "scope": "Suite Design",
        "hero_image": "IMG_3537.JPG",
        "images": ["IMG_3537.JPG", "IMG_4628 - Copy.JPG"],
        "challenge": "Design a signature suite that embodies the hotel's brand while providing a memorable guest experience. Every detail needed to photograph beautifully for marketing purposes.",
        "outcome": "A layered design approach using textures, custom lighting, and statement pieces. The suite tells a story that guests want to share, driving both satisfaction and social engagement.",
        "metric": None,
        "description": "Boutique hotel suite design in Amsterdam. Signature suite concept for memorable guest experiences."
    },
    "7": {
        "name": "Executive Suite",
        "category": "Concept Design",
        "type": "Hospitality",
        "location": "Amsterdam, NL",
        "year": "2020",
        "scope": "Suite Design",
        "hero_image": "IMG_3539.JPG",
        "images": ["IMG_3539.JPG", "IMG_4633.JPG"],
        "challenge": "Create an executive suite that merges workspace functionality with luxury hospitality. Business travelers needed a space that could seamlessly transition from work to relaxation.",
        "outcome": "Discrete work zones with premium ergonomics blend into a sophisticated living environment. The suite serves productivity without sacrificing the sense of retreat.",
        "metric": None,
        "description": "Executive hotel suite design in Amsterdam. Workspace and luxury hospitality merged seamlessly."
    },
    "8": {
        "name": "Johannes Obrecht",
        "category": "Full Service",
        "type": "Residential",
        "location": "Amsterdam, NL",
        "year": "2012",
        "scope": "Complete Renovation",
        "hero_image": "2Z9C4471large - Copy.jpg",
        "images": ["2Z9C4471large - Copy.jpg", "Kamer 208 3 copy.jpg", "ld J.obrecht.JPG", "LD Jo ams (2).JPG", "P7118227 - Copy.JPG", "P7118231.JPG"],
        "challenge": "Transform a classic Amsterdam residence into a modern family home without erasing its character. The renovation needed to accommodate growing children and entertaining.",
        "outcome": "Open living spaces flow naturally while private areas provide retreat. Original details were preserved and highlighted, creating dialogue between old and new.",
        "metric": {"value": "320m²", "label": "Total Area"},
        "description": "Johannes Obrecht residence in Amsterdam. Complete renovation balancing heritage and modern family living."
    },
    "9": {
        "name": "Beauty Salon",
        "category": "Commercial",
        "type": "Commercial",
        "location": "Amsterdam, NL",
        "year": "2024",
        "scope": "Full Interior",
        "hero_image": None,
        "images": [],
        "video": "beautysalon.webm",
        "challenge": "Design a beauty salon that elevates the client experience from the moment they enter. The space needed to feel premium while remaining functional for staff.",
        "outcome": "A spa-like atmosphere achieved through soft palettes, ambient lighting, and thoughtful circulation. Every touchpoint reinforces the premium service promise.",
        "metric": None,
        "description": "Beauty salon interior design in Amsterdam. Premium spa-like atmosphere with functional elegance."
    },
    "10": {
        "name": "Modern Villa",
        "category": "Full Service",
        "type": "Residential",
        "location": "Amsterdam, NL",
        "year": "2024",
        "scope": "New Build",
        "hero_image": "IMG_0717.jpg",
        "images": ["BB933208-1A40-473A-B634-98E2700157F4.JPG", "IMG_0717.jpg", "IMG_0718.jpg"],
        "challenge": "Create a contemporary villa that makes a bold architectural statement while remaining a comfortable family home. The design needed to embrace indoor-outdoor living.",
        "outcome": "Clean lines and expansive glazing connect interior spaces to landscaped gardens. Premium materials and craftsmanship are evident in every detail.",
        "metric": {"value": "450m²", "label": "Total Build"},
        "description": "Modern villa in Amsterdam. Contemporary architecture with premium materials and indoor-outdoor living."
    }
}

# Project order for navigation
PROJECT_ORDER = ["1", "2", "3", "4", "5", "6", "7", "8", "10"]  # Excluding 9 as it has no images

def build_project_page(project_id, base_template):
    """Build a project detail page with SEO metadata and storytelling."""
    if project_id not in PROJECTS_DATA:
        return
    
    project = PROJECTS_DATA[project_id]
    
    # Skip projects without images (like project 9 which only has video)
    if not project.get("images") or not project.get("hero_image"):
        print(f"Skipping project-{project_id}.html (no images)")
        return
    
    print(f"Building project-{project_id}.html...")
    page_name = f"project-{project_id}.html"
    
    # Read project template
    template_content = read_file(os.path.join(TEMPLATES_DIR, "project_detail.html"))
    
    # Replace all placeholders
    template_content = template_content.replace("{{ project_id }}", project_id)
    template_content = template_content.replace("{{ project_name }}", project["name"])
    template_content = template_content.replace("{{ project_category }}", project["category"])
    template_content = template_content.replace("{{ hero_image }}", project["hero_image"])
    template_content = template_content.replace("{{ project_location }}", project["location"])
    template_content = template_content.replace("{{ project_year }}", project["year"])
    template_content = template_content.replace("{{ project_scope }}", project["scope"])
    template_content = template_content.replace("{{ project_type }}", project["type"])
    template_content = template_content.replace("{{ project_challenge }}", project["challenge"])
    template_content = template_content.replace("{{ project_outcome }}", project["outcome"])
    
    # Build metric HTML
    if project.get("metric"):
        metric_html = f'''<div class="metric">
            <span class="metric-value">{project["metric"]["value"]}</span>
            <span class="metric-label">{project["metric"]["label"]}</span>
        </div>'''
    else:
        metric_html = ""
    template_content = template_content.replace("{{ project_metric }}", metric_html)
    
    # Build images HTML
    images_html = ""
    for img in project["images"]:
        images_html += f'<div class="project-detail-image"><img src="Media/{project_id}/{img}" alt="{project["name"]} - {project["category"]} by CuttingEdge" loading="lazy"></div>\n'
    template_content = template_content.replace("{{ project_images }}", images_html)
    
    # Next project navigation
    if project_id in PROJECT_ORDER:
        current_idx = PROJECT_ORDER.index(project_id)
        next_idx = (current_idx + 1) % len(PROJECT_ORDER)
        next_id = PROJECT_ORDER[next_idx]
        next_project = PROJECTS_DATA[next_id]
        template_content = template_content.replace("{{ next_project_url }}", f"project-{next_id}.html")
        template_content = template_content.replace("{{ next_project_name }}", next_project["name"])
        template_content = template_content.replace("{{ next_project_id }}", next_id)
        template_content = template_content.replace("{{ next_project_image }}", next_project["hero_image"])
    
    # Insert into base template
    full_page = base_template.replace("{{ content }}", template_content)
    
    # Inject SEO metadata
    canonical_url = f"{SITE_URL}/{page_name}"
    page_title = f"{project['name']} | CuttingEdge Portfolio"
    full_page = full_page.replace("{{ page_title }}", page_title)
    full_page = full_page.replace("{{ page_description }}", project["description"])
    full_page = full_page.replace("{{ canonical_url }}", canonical_url)
    full_page = full_page.replace("{{ json_ld }}", generate_json_ld(page_name))
    
    # Remove HTMX and fix links
    full_page = remove_htmx_and_fix_links(full_page)
    
    # Write to output directory
    output_path = os.path.join(OUTPUT_DIR, page_name)
    write_file(output_path, full_page)
    
    print(f"✓ Created {output_path}")


def copy_assets():
    """Copy static assets and media files."""
    print("\nCopying assets...")

    
    # Copy static directory
    if os.path.exists(STATIC_DIR):
        output_static = os.path.join(OUTPUT_DIR, STATIC_DIR)
        if os.path.exists(output_static):
            shutil.rmtree(output_static)
        shutil.copytree(STATIC_DIR, output_static)
        print(f"✓ Copied {STATIC_DIR}/")
    
    # Copy Media directory
    if os.path.exists(MEDIA_DIR):
        output_media = os.path.join(OUTPUT_DIR, MEDIA_DIR)
        if os.path.exists(output_media):
            shutil.rmtree(output_media)
        shutil.copytree(MEDIA_DIR, output_media)
        print(f"✓ Copied {MEDIA_DIR}/")

def generate_htaccess():
    """Generate .htaccess for Hostinger deployment."""
    print("Generating .htaccess...")
    content = """# Specify the index file
DirectoryIndex index.html

# Fix for 403 Forbidden - prevent directory listing but ensure files are accessible
Options -Indexes

# Handle the case where the user might try to access a page without .html extension
RewriteEngine On

# Redirect directly to .html version if it exists
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.*)$ $1.html [L,QSA]

# Prevent access to .git and hidden files
RewriteRule ^\.(.*) - [F]
"""
    write_file(os.path.join(OUTPUT_DIR, ".htaccess"), content)
    print("✓ Created .htaccess")


def generate_sitemap():
    """Generate XML sitemap for SEO."""
    print("Generating sitemap.xml...")
    
    today = datetime.now().strftime("%Y-%m-%d")
    
    urls = []
    # Add main pages
    for page_name, meta in PAGES_META.items():
        url = SITE_URL if page_name == "index.html" else f"{SITE_URL}/{page_name}"
        urls.append(f"""  <url>
    <loc>{url}</loc>
    <lastmod>{today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>{meta["priority"]}</priority>
  </url>""")
    
    # Add project pages
    for project_id in PROJECT_ORDER:
        urls.append(f"""  <url>
    <loc>{SITE_URL}/project-{project_id}.html</loc>
    <lastmod>{today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>""")
    
    sitemap = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{chr(10).join(urls)}
</urlset>"""
    
    write_file(os.path.join(OUTPUT_DIR, "sitemap.xml"), sitemap)
    print("✓ Created sitemap.xml")


def generate_robots_txt():
    """Generate robots.txt for SEO."""
    print("Generating robots.txt...")
    content = f"""# CuttingEdge Robots.txt
User-agent: *
Allow: /

# Sitemap location
Sitemap: {SITE_URL}/sitemap.xml
"""
    write_file(os.path.join(OUTPUT_DIR, "robots.txt"), content)
    print("✓ Created robots.txt")


def main():
    """Main build process."""
    print("=" * 50)
    print("CuttingEdge Static Site Builder")
    print("(Multi-page, SEO-optimized static site)")
    print("=" * 50)
    
    # Create output directory
    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)
    os.makedirs(OUTPUT_DIR)
    
    # Read base template
    base_template = read_file(os.path.join(TEMPLATES_DIR, "base.html"))
    
    # Build all pages with SEO metadata
    print("\nBuilding pages...")
    for page_name, page_meta in PAGES_META.items():
        build_page(page_name, page_meta, base_template)
    
    # Build project detail pages
    print("\nBuilding project pages...")
    for project_id in PROJECT_ORDER:
        build_project_page(project_id, base_template)
    
    # Copy assets
    copy_assets()
    
    # Generate SEO files
    print("\nGenerating SEO files...")
    generate_htaccess()
    generate_sitemap()
    generate_robots_txt()
    
    print("\n" + "=" * 50)
    print("✓ Build complete!")
    print(f"✓ Static files ready in '{OUTPUT_DIR}/' directory")
    print("✓ SEO optimized: sitemap.xml, robots.txt, JSON-LD")
    print("=" * 50)
    print("\nDeployment:")
    print("→ Upload ALL files from 'dist/' to Hostinger's public_html")
    print("→ Works on ANY static hosting!")
    print("=" * 50)

if __name__ == "__main__":
    main()

