#!/usr/bin/env python3
"""
Build script for client-side HTMX static deployment.
Creates a single index.html with base layout and separate page partials.
"""

import os
import shutil
from pathlib import Path

# Configuration
TEMPLATES_DIR = "templates"
OUTPUT_DIR = "dist"
STATIC_DIR = "static"
MEDIA_DIR = "Media"
PAGES_DIR = "pages"

def read_file(filepath):
    """Read file content."""
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(filepath, content):
    """Write content to file."""
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def build_client_side_htmx():
    """Build client-side HTMX structure."""
    print("\n=== Building Client-Side HTMX Structure ===")
    
    # Read base template
    base_html = read_file(os.path.join(TEMPLATES_DIR, "base.html"))
    
    # Read home content (default content for index.html)
    home_content = read_file(os.path.join(TEMPLATES_DIR, "home.html"))
    
    # Create index.html with home content as default
    index_html = base_html.replace("{{ content }}", home_content)
    
    # Write index.html
    output_path = os.path.join(OUTPUT_DIR, "index.html")
    write_file(output_path, index_html)
    print(f"✓ Created {output_path}")
    
    # Create pages directory and copy page partials
    pages_output_dir = os.path.join(OUTPUT_DIR, PAGES_DIR)
    os.makedirs(pages_output_dir, exist_ok=True)
    
    # Copy each page partial
    pages = ["home.html", "approach.html", "projects.html", "contact.html"]
    for page in pages:
        src = os.path.join(TEMPLATES_DIR, page)
        dst = os.path.join(pages_output_dir, page)
        shutil.copy2(src, dst)
        print(f"✓ Copied {page} to pages/")
    
    # Handle project detail pages
    projects_data = {
        "1": {"name": "Private Residence", "category": "Concept Design", "images": ["2.jpg"]},
        "4": {"name": "Hospitality Collection", "category": "Turn-key Build", 
              "images": ["Bar_2_1.jpg", "DSC04834.JPG", "DSC04892 - Copy.JPG", "DSC04895 - Copy.JPG", "DSC05138.JPG"]},
        "10": {"name": "Modern Architecture", "category": "Full Service", 
               "images": ["BB933208-1A40-473A-B634-98E2700157F4.JPG", "IMG_0717.jpg", "IMG_0718.jpg"]},
    }
    
    # Create project detail partials
    for project_id, project in projects_data.items():
        template_content = read_file(os.path.join(TEMPLATES_DIR, "project_detail.html"))
        
        # Replace placeholders
        template_content = template_content.replace("{{ project_id }}", project_id)
        template_content = template_content.replace("{{ project_name }}", project["name"])
        template_content = template_content.replace("{{ project_category }}", project["category"])
        
        # Build images HTML
        images_html = ""
        for img in project["images"]:
            images_html += f'<div class="project-detail-image"><img src="/Media/{project_id}/{img}" alt="{project["name"]}" loading="lazy"></div>\n'
        template_content = template_content.replace("{{ project_images }}", images_html)
        
        # Write project partial
        output_path = os.path.join(pages_output_dir, f"project_{project_id}.html")
        write_file(output_path, template_content)
        print(f"✓ Created pages/project_{project_id}.html")

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

def main():
    """Main build process."""
    print("=" * 50)
    print("CuttingEdge Client-Side HTMX Builder")
    print("=" * 50)
    
    # Create output directory
    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)
    os.makedirs(OUTPUT_DIR)
    
    # Build HTMX structure
    build_client_side_htmx()
    
    # Copy assets
    copy_assets()
    
    print("\n" + "=" * 50)
    print("✓ Build complete!")
    print(f"✓ Static files ready in '{OUTPUT_DIR}/' directory")
    print("=" * 50)
    print("\nDeployment Instructions:")
    print("1. Upload ALL contents of 'dist/' folder to Hostinger's public_html")
    print("2. The site will use client-side HTMX for navigation")
    print("3. All pages load from a single index.html")
    print("4. Footer and header are always present")
    print("=" * 50)

if __name__ == "__main__":
    main()
