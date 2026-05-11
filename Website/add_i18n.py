#!/usr/bin/env python3
"""
Script to add data-i18n attributes to template content.
This adds translation keys to existing content based on patterns.
"""

import re
from pathlib import Path

# Define content replacements for each template
REPLACEMENTS = {
    'templates/base.html': [
        # Footer
        ('<h3>CuttingEdge</h3>', '<h3 data-i18n="footer.company">CuttingEdge</h3>'),
        ('<h4>Get in Touch</h4>', '<h4 data-i18n="footer.touch.title">Get in Touch</h4>'),
        ('<p class="contact-description">Let\'s discuss your next project</p>', 
         '<p class="contact-description" data-i18n="footer.touch.subtitle">Let\'s discuss your next project</p>'),
        ('placeholder="Your Name*"', 'placeholder="Your Name*" data-i18n="footer.form.name"'),
        ('placeholder="Email Address*"', 'placeholder="Email Address*" data-i18n="footer.form.email"'),
        ('<option value="">Select Service*</option>', '<option value="" data-i18n="footer.form.service">Select Service*</option>'),
        ('<option value="Technical Drawings">Technical Drawings</option>', 
         '<option value="Technical Drawings" data-i18n="footer.form.service.technical">Technical Drawings</option>'),
        ('<option value="Turn-key Build">Turn-key Build</option>', 
         '<option value="Turn-key Build" data-i18n="footer.form.service.turnkey">Turn-key Build</option>'),
        ('<option value="Concept Design">Concept Design</option>', 
         '<option value="Concept Design" data-i18n="footer.form.service.concept">Concept Design</option>'),
        ('<option value="Full Service">Full Service</option>', 
         '<option value="Full Service" data-i18n="footer.form.service.full">Full Service</option>'),
        ('placeholder="Tell us about your project"', 'placeholder="Tell us about your project" data-i18n="footer.form.message"'),
        ('>Send via WhatsApp</button>', ' data-i18n="footer.form.submit">Send via WhatsApp</button>'),
        ('<h4>Follow Us</h4>', '<h4 data-i18n="footer.follow">Follow Us</h4>'),
        ('<h4>Quick Links</h4>', '<h4 data-i18n="footer.quicklinks">Quick Links</h4>'),
        ('© 2025 CuttingEdge. All rights reserved.', 'data-i18n="footer.rights">© 2025 CuttingEdge. All rights reserved.'),
        ('Crafted with precision and passion', 'data-i18n="footer.credits">Crafted with precision and passion'),
    ],
    'templates/home.html': [
        # Closing section
        ('<h2 class="fade-in">Crafted Experiences</h2>', 
         '<h2 class="fade-in" data-i18n="home.closing.title">Crafted Experiences</h2>'),
        ('<p class="subtitle fade-in" style="animation-delay: 0.2s;">From concept to completion, we bring your vision', 
         '<p class="subtitle fade-in" style="animation-delay: 0.2s;" data-i18n="home.closing.subtitle">From concept to completion, we bring your vision'),
    ],
    'templates/approach.html': [
        # Hero
        ('<h1 class="fade-in">Our Approach</h1>', '<h1 class="fade-in" data-i18n="approach.hero.title">Our Approach</h1>'),
        ('<p class="fade-in" style="animation-delay: 0.2s;">Methodology meets Innovation.</p>', 
         '<p class="fade-in" style="animation-delay: 0.2s;" data-i18n="approach.hero.subtitle">Methodology meets Innovation.</p>'),
        # Methodology
        ('<h2>Scalable Design</h2>', '<h2 data-i18n="approach.scalable.title">Scalable Design</h2>'),
        ('<h2>Lean Management</h2>', '<h2 data-i18n="approach.lean.title">Lean Management</h2>'),
        ('<h2>Advanced Technology</h2>', '<h2 data-i18n="approach.tech.title">Advanced Technology</h2>'),
    ],
    'templates/projects.html': [
        # Hero
        ('<h1 class="page-title fade-in">Our Projects</h1>', 
         '<h1 class="page-title fade-in" data-i18n="projects.hero.title">Our Projects</h1>'),
        ('<p class="page-subtitle fade-in">Excellence in execution</p>', 
         '<p class="page-subtitle fade-in" data-i18n="projects.hero.subtitle">Excellence in execution</p>'),
        # Project items
        ('<h3>Private Residence</h3>', '<h3 data-i18n="projects.item1.title">Private Residence</h3>'),
        ('<p>Concept Design</p>', '<p data-i18n="projects.item1.category">Concept Design</p>'),
        ('<h3>Hospitality Collection</h3>', '<h3 data-i18n="projects.item2.title">Hospitality Collection</h3>'),
        ('<p>Turn-key Build</p>', '<p data-i18n="projects.item2.category">Turn-key Build</p>'),
        ('<h3>Modern Architecture</h3>', '<h3 data-i18n="projects.item3.title">Modern Architecture</h3>'),
        ('<p>Full Service</p>', '<p data-i18n="projects.item3.category">Full Service</p>'),
    ],
    'templates/project_detail.html': [
        ('← Back', 'data-i18n="projects.detail.back">← Back'),
    ],
}

def add_i18n_attributes():
    """Add data-i18n attributes to templates."""
    for template_path, replacements in REPLACEMENTS.items():
        file_path = Path(template_path)
        if not file_path.exists():
            print(f"⚠️  {template_path} not found")
            continue
            
        content = file_path.read_text(encoding='utf-8')
        original_content = content
        
        for old, new in replacements:
            content = content.replace(old, new)
        
        if content != original_content:
            file_path.write_text(content, encoding='utf-8')
            print(f"✓ Updated {template_path}")
        else:
            print(f"- No changes needed in {template_path}")

if __name__ == '__main__':
    print("Adding data-i18n attributes to templates...")
    add_i18n_attributes()
    print("\n✓ Complete!")
