// Multi-language translation system for CuttingEdge
const translations = {
    en: {
        // Navigation
        'nav.home': 'Home',
        'nav.approach': 'Approach',
        'nav.projects': 'Projects',
        'nav.contact': 'Contact',
        
        // Home Page
        'home.hero.title': 'Pragmatic Luxury',
        'home.hero.subtitle': 'Translating vision into enduring reality.',
        'home.hero.cta': 'View Projects',
        'home.uvp.innovation': 'Innovation',
        'home.uvp.innovation.text': 'Cutting-edge design solutions that push boundaries while remaining practical and achievable.',
        'home.uvp.precision': 'Precision',
        'home.uvp.precision.text': 'Meticulous attention to detail in every phase, from concept to completion.',
        'home.uvp.excellence': 'Excellence',
        'home.uvp.excellence.text': 'Uncompromising quality in materials, craftsmanship, and execution.',
        'home.offerings.title': 'Selected Offerings',
        'home.offerings.subtitle': 'A glimpse into our comprehensive design services',
        'home.offerings.cta': 'Learn More',
        'home.closing.title': 'Crafted Experiences',
        'home.closing.subtitle': 'From concept to completion, we bring your vision to life.',
        
        // Approach Page
        'approach.hero.title': 'Our Approach',
        'approach.hero.subtitle': 'Methodology meets Innovation.',
        'approach.scalable.title': 'Scalable Design',
        'approach.scalable.text': 'We prioritize brand-driven design approaches to make them scalable and reproducible. Whether it\'s a chain of restaurants, kiosks, or luxury resorts, we ensure consistency and quality across all locations.',
        'approach.lean.title': 'Lean Management',
        'approach.lean.text': 'Using the best tools and management practices, we deliver fast and lean solutions tailored for each situation. Our process minimizes waste and maximizes value.',
        'approach.tech.title': 'Advanced Technology',
        'approach.tech.text': 'We leverage cutting-edge tools, including AI and parametric design software, to optimize output per resource and visualize complex concepts before construction begins.',
        'approach.services.title': 'Detailed Offerings',
        'approach.service1.title': 'Technical Drawings',
        'approach.service1.subtitle': 'Precision blueprints for flawless execution.',
        'approach.service1.item1': 'Architectural Plans',
        'approach.service1.item2': 'MEP Coordination',
        'approach.service1.item3': '3D Modeling & Rendering',
        'approach.service2.title': 'Turn-key Build',
        'approach.service2.subtitle': 'Complete project delivery from start to finish.',
        'approach.service2.item1': 'Project Management',
        'approach.service2.item2': 'Contractor Coordination',
        'approach.service2.item3': 'Quality Assurance',
        'approach.service3.title': 'Concept Design',
        'approach.service3.subtitle': 'The artistic vision that defines the space.',
        'approach.service3.item1': 'Brand Identity Integration',
        'approach.service3.item2': 'Color Palette & Material Selection',
        'approach.service3.item3': 'Custom Furniture & Fixture Design',
        
        // Projects Page
        'projects.hero.title': 'Our Projects',
        'projects.hero.subtitle': 'Excellence in execution',
        'projects.filter.all': 'All Projects',
        'projects.filter.residential': 'Residential',
        'projects.filter.commercial': 'Commercial',
        'projects.filter.hospitality': 'Hospitality',
        'projects.item1.title': 'Private Residence',
        'projects.item1.category': 'Concept Design',
        'projects.item2.title': 'Hospitality Collection',
        'projects.item2.category': 'Turn-key Build',
        'projects.item3.title': 'Modern Architecture',
        'projects.item3.category': 'Full Service',
        'projects.detail.back': 'Back to Projects',
        
        // Contact Page
        'contact.hero.title': 'Get in Touch',
        'contact.hero.subtitle': 'Let\'s bring your vision to life',
        'contact.info.title': 'Contact Information',
        'contact.info.email': 'Email',
        'contact.info.phone': 'Phone',
        'contact.info.address': 'Address',
        'contact.form.title': 'Send us a message',
        'contact.form.name': 'Your Name',
        'contact.form.email': 'Email Address',
        'contact.form.subject': 'Subject',
        'contact.form.message': 'Your Message',
        'contact.form.submit': 'Send Message',
        
        // Footer
        'footer.company': 'CuttingEdge',
        'footer.tagline': 'Transforming spaces into experiences through innovative design and meticulous execution.',
        'footer.touch.title': 'Get in Touch',
        'footer.touch.subtitle': 'Let\'s discuss your next project',
        'footer.form.name': 'Your Name*',
        'footer.form.email': 'Email Address*',
        'footer.form.service': 'Select Service*',
        'footer.form.service.technical': 'Technical Drawings',
        'footer.form.service.turnkey': 'Turn-key Build',
        'footer.form.service.concept': 'Concept Design',
        'footer.form.service.full': 'Full Service',
        'footer.form.message': 'Tell us about your project',
        'footer.form.submit': 'Send via WhatsApp',
        'footer.follow': 'Follow Us',
        'footer.quicklinks': 'Quick Links',
        'footer.rights': '© 2025 CuttingEdge. All rights reserved.',
        'footer.credits': 'Crafted with precision and passion'
    },
    nl: {
        // Navigation
        'nav.home': 'Home',
        'nav.approach': 'Aanpak',
        'nav.projects': 'Projecten',
        'nav.contact': 'Contact',
        
        // Home Page
        'home.hero.title': 'Pragmatische Luxe',
        'home.hero.subtitle': 'Visie vertalen naar duurzame realiteit.',
        'home.hero.cta': 'Bekijk Projecten',
        'home.uvp.innovation': 'Innovatie',
        'home.uvp.innovation.text': 'Baanbrekende ontwerpoplossingen die grenzen verleggen terwijl ze praktisch en haalbaar blijven.',
        'home.uvp.precision': 'Precisie',
        'home.uvp.precision.text': 'Nauwgezette aandacht voor detail in elke fase, van concept tot voltooiing.',
        'home.uvp.excellence': 'Excellentie',
        'home.uvp.excellence.text': 'Compromisloze kwaliteit in materialen, vakmanschap en uitvoering.',
        'home.offerings.title': 'Geselecteerde Diensten',
        'home.offerings.subtitle': 'Een kijkje in onze uitgebreide ontwerpservices',
        'home.offerings.cta': 'Meer Informatie',
        'home.closing.title': 'Ambachtelijke Ervaringen',
        'home.closing.subtitle': 'Van concept tot voltooiing brengen we uw visie tot leven.',
        
        // Approach Page
        'approach.hero.title': 'Onze Aanpak',
        'approach.hero.subtitle': 'Methodologie ontmoet Innovatie.',
        'approach.scalable.title': 'Schaalbaar Ontwerp',
        'approach.scalable.text': 'We geven prioriteit aan merkgedreven ontwerpbenaderingen om ze schaalbaar en reproduceerbaar te maken. Of het nu gaat om een keten van restaurants, kiosken of luxe resorts, we zorgen voor consistentie en kwaliteit op alle locaties.',
        'approach.lean.title': 'Lean Management',
        'approach.lean.text': 'Met behulp van de beste tools en managementpraktijken leveren we snelle en lean oplossingen die zijn afgestemd op elke situatie. Ons proces minimaliseert verspilling en maximaliseert waarde.',
        'approach.tech.title': 'Geavanceerde Technologie',
        'approach.tech.text': 'We maken gebruik van geavanceerde tools, waaronder AI en parametrische ontwerpsoftware, om de output per resource te optimaliseren en complexe concepten te visualiseren voordat de bouw begint.',
        'approach.services.title': 'Gedetailleerde Diensten',
        'approach.service1.title': 'Technische Tekeningen',
        'approach.service1.subtitle': 'Precisie blauwdrukken voor foutloze uitvoering.',
        'approach.service1.item1': 'Architectonische Plannen',
        'approach.service1.item2': 'Installatie Coördinatie',
        'approach.service1.item3': '3D Modellering & Rendering',
        'approach.service2.title': 'Turn-key Bouw',
        'approach.service2.subtitle': 'Volledige projectoplevering van start tot finish.',
        'approach.service2.item1': 'Projectmanagement',
        'approach.service2.item2': 'Aannemer Coördinatie',
        'approach.service2.item3': 'Kwaliteitsborging',
        'approach.service3.title': 'Conceptontwerp',
        'approach.service3.subtitle': 'De artistieke visie die de ruimte definieert.',
        'approach.service3.item1': 'Merkidentiteit Integratie',
        'approach.service3.item2': 'Kleurenpalet & Materiaalselectie',
        'approach.service3.item3': 'Op Maat Gemaakte Meubels & Armaturen',
        
        // Projects Page
        'projects.hero.title': 'Onze Projecten',
        'projects.hero.subtitle': 'Excellentie in uitvoering',
        'projects.filter.all': 'Alle Projecten',
        'projects.filter.residential': 'Residentieel',
        'projects.filter.commercial': 'Commercieel',
        'projects.filter.hospitality': 'Horeca',
        'projects.item1.title': 'Privé Woning',
        'projects.item1.category': 'Conceptontwerp',
        'projects.item2.title': 'Horeca Collectie',
        'projects.item2.category': 'Turn-key Bouw',
        'projects.item3.title': 'Moderne Architectuur',
        'projects.item3.category': 'Full Service',
        'projects.detail.back': 'Terug naar Projecten',
        
        // Contact Page
        'contact.hero.title': 'Neem Contact Op',
        'contact.hero.subtitle': 'Laten we uw visie tot leven brengen',
        'contact.info.title': 'Contactinformatie',
        'contact.info.email': 'E-mail',
        'contact.info.phone': 'Telefoon',
        'contact.info.address': 'Adres',
        'contact.form.title': 'Stuur ons een bericht',
        'contact.form.name': 'Uw Naam',
        'contact.form.email': 'E-mailadres',
        'contact.form.subject': 'Onderwerp',
        'contact.form.message': 'Uw Bericht',
        'contact.form.submit': 'Verzend Bericht',
        
        // Footer
        'footer.company': 'CuttingEdge',
        'footer.tagline': 'Ruimtes transformeren tot ervaringen door innovatief ontwerp en nauwgezette uitvoering.',
        'footer.touch.title': 'Neem Contact Op',
        'footer.touch.subtitle': 'Laten we uw volgende project bespreken',
        'footer.form.name': 'Uw Naam*',
        'footer.form.email': 'E-mailadres*',
        'footer.form.service': 'Selecteer Service*',
        'footer.form.service.technical': 'Technische Tekeningen',
        'footer.form.service.turnkey': 'Turn-key Bouw',
        'footer.form.service.concept': 'Conceptontwerp',
        'footer.form.service.full': 'Full Service',
        'footer.form.message': 'Vertel ons over uw project',
        'footer.form.submit': 'Verstuur via WhatsApp',
        'footer.follow': 'Volg Ons',
        'footer.quicklinks': 'Snelle Links',
        'footer.rights': '© 2025 CuttingEdge. Alle rechten voorbehouden.',
        'footer.credits': 'Gemaakt met precisie en passie'
    }
};

// Translation system
class TranslationSystem {
    constructor() {
        this.currentLang = this.detectLanguage();
        this.init();
    }
    
    detectLanguage() {
        // Check localStorage first
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && (savedLang === 'en' || savedLang === 'nl')) {
            return savedLang;
        }
        
        // Check browser language
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('nl')) {
            return 'nl';
        }
        
        // Default to English
        return 'en';
    }
    
    init() {
        // Translate page on load
        this.translatePage();
        
        // Set up language switcher buttons
        document.addEventListener('DOMContentLoaded', () => {
            const langButtons = document.querySelectorAll('.lang-btn');
            langButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const lang = e.target.dataset.lang;
                    this.switchLanguage(lang);
                });
                
                // Set active state
                if (btn.dataset.lang === this.currentLang) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        });
    }
    
    switchLanguage(lang) {
        if (lang === this.currentLang) return;
        
        this.currentLang = lang;
        localStorage.setItem('preferredLanguage', lang);
        
        // Update active button states
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Translate page
        this.translatePage();
    }
    
    translatePage() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.dataset.i18n;
            const translation = translations[this.currentLang][key];
            
            if (translation) {
                // Check if it's an input/textarea placeholder
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translation;
                } else if (el.tagName === 'SELECT') {
                    // Skip select elements, handle options separately
                    return;
                } else if (el.tagName === 'OPTION') {
                    el.textContent = translation;
                } else {
                    el.textContent = translation;
                }
            }
        });
    }
    
    translate(key) {
        return translations[this.currentLang][key] || key;
    }
}

// Initialize translation system
const i18n = new TranslationSystem();
