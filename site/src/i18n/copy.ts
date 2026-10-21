// All human-readable copy, EN + NL. Facts only from the existing sites; wording rewritten.
import type { Lang } from '../lib/routes';

type L<T> = Record<Lang, T>;

export const ui: L<Record<string, string>> = {
  en: {
    skip: 'Skip to content',
    navHome: 'Home', navProjects: 'Projects', navServices: 'Services', navApproach: 'Approach', navContact: 'Contact',
    navLabel: 'Main navigation', menu: 'Menu', close: 'Close',
    cta: 'Start a project', ctaShort: 'Enquire', langSwitch: 'Nederlands', langName: 'English', langAria: 'Dutch version of this page',
    whatsapp: 'WhatsApp', call: 'Call',
    mobileBar: 'Quick contact',
    footTag: 'Interior design and turn-key build studio in Amsterdam.',
    footNav: 'Explore', footContact: 'Studio', footLegal: 'Legal',
    privacy: 'Privacy policy', legal: 'Legal notice',
    rights: 'All rights reserved.', kvk: 'KvK',
    email: 'Email', phone: 'Phone', studio: 'Studio',
    hero: 'Pragmatic Luxury',
    pause: 'Pause background video', play: 'Play background video',
    seeProject: 'View project', allProjects: 'All projects', backToProjects: 'All projects', nextProject: 'Next project',
    gallery: 'Gallery', openImage: 'Open image', lightboxLabel: 'Image viewer', prev: 'Previous image', next: 'Next image',
    breadcrumb: 'Breadcrumb', sector: 'Sector', services: 'Services', location: 'Location', year: 'Year', scope: 'Scope', size: 'Size',
    photo: 'Photography',
    hospitality: 'Hospitality', residential: 'Residential', commercial: 'Commercial', all: 'All',
    filterLabel: 'Filter projects by sector', showing: 'Showing', projectsWord: 'projects',
    'concept-design': 'Concept Design', 'technical-drawings': 'Technical Drawings', 'turn-key-build': 'Turn-key Build',
    compareLabel: 'Compare sketch and visualisation. Use the arrow keys to move the divider.',
    sketch: 'Sketch', visualisation: 'Visualisation', realisation: 'Realisation',
    learnMore: 'Learn more', discuss: 'Discuss your project',
    notFoundTitle: 'This page is not here.', notFoundText: 'The page you are looking for has moved or never existed. Try the projects, or tell us about your space.',
    photoCredit: 'Photo',
    videoPoster: 'Video',
  },
  nl: {
    skip: 'Direct naar de inhoud',
    navHome: 'Home', navProjects: 'Projecten', navServices: 'Diensten', navApproach: 'Aanpak', navContact: 'Contact',
    navLabel: 'Hoofdnavigatie', menu: 'Menu', close: 'Sluiten',
    cta: 'Start een project', ctaShort: 'Aanvragen', langSwitch: 'English', langName: 'Nederlands', langAria: 'Engelse versie van deze pagina',
    whatsapp: 'WhatsApp', call: 'Bel',
    mobileBar: 'Snel contact',
    footTag: 'Interieurontwerp en turn-key bouwstudio in Amsterdam.',
    footNav: 'Ontdek', footContact: 'Studio', footLegal: 'Juridisch',
    privacy: 'Privacybeleid', legal: 'Juridische informatie',
    rights: 'Alle rechten voorbehouden.', kvk: 'KvK',
    email: 'E-mail', phone: 'Telefoon', studio: 'Studio',
    hero: 'Pragmatic Luxury',
    pause: 'Pauzeer achtergrondvideo', play: 'Speel achtergrondvideo af',
    seeProject: 'Bekijk project', allProjects: 'Alle projecten', backToProjects: 'Alle projecten', nextProject: 'Volgend project',
    gallery: 'Galerij', openImage: 'Afbeelding openen', lightboxLabel: 'Afbeeldingsviewer', prev: 'Vorige afbeelding', next: 'Volgende afbeelding',
    breadcrumb: 'Kruimelpad', sector: 'Sector', services: 'Diensten', location: 'Locatie', year: 'Jaar', scope: 'Omvang', size: 'Oppervlak',
    photo: 'Fotografie',
    hospitality: 'Horeca', residential: 'Wonen', commercial: 'Commercieel', all: 'Alles',
    filterLabel: 'Filter projecten op sector', showing: 'Toont', projectsWord: 'projecten',
    'concept-design': 'Conceptontwerp', 'technical-drawings': 'Technische tekeningen', 'turn-key-build': 'Turn-key bouw',
    compareLabel: 'Vergelijk schets en visualisatie. Gebruik de pijltjestoetsen om de scheidingslijn te verplaatsen.',
    sketch: 'Schets', visualisation: 'Visualisatie', realisation: 'Realisatie',
    learnMore: 'Meer lezen', discuss: 'Bespreek uw project',
    notFoundTitle: 'Deze pagina bestaat niet (meer).', notFoundText: 'De pagina die u zoekt is verplaatst of heeft nooit bestaan. Bekijk de projecten of vertel ons over uw ruimte.',
    photoCredit: 'Foto',
    videoPoster: 'Video',
  },
};

export const meta: L<Record<string, { title: string; desc: string }>> = {
  en: {
    home: { title: 'CuttingEdge | Interior Design & Turn-key Build, Amsterdam', desc: 'Pragmatic luxury interiors from Amsterdam. Concept design, technical drawings and turn-key build for hospitality, residential and commercial spaces.' },
    approach: { title: 'Our Approach | Sketch, Visualisation, Realisation | CuttingEdge', desc: 'How CuttingEdge works: scalable, brand-driven design, lean management and modern tools, taking a space from first sketch through visualisation to finished build.' },
    services: { title: 'Interior Design Services in Amsterdam | CuttingEdge', desc: 'Concept design, technical drawings and turn-key build. One Amsterdam studio for hospitality, residential and commercial interiors, from idea to keys in hand.' },
    'service-concept': { title: 'Concept Design for Interiors | CuttingEdge Amsterdam', desc: 'Interior concept design where brand identity becomes spatial experience: colour and material selection, furniture and fixture design. Amsterdam studio.' },
    'service-technical': { title: 'Technical Drawings for Interiors | CuttingEdge Amsterdam', desc: 'Precise technical drawings for interior projects: electrical schematics and load planning, air conditioning and ventilation, and complete lighting plans.' },
    'service-turnkey': { title: 'Turn-key Interior Build | CuttingEdge Amsterdam', desc: 'Turn-key interior build from concept to keys in hand: vendor management, timeline control and quality control for hospitality, residential and commercial.' },
    projects: { title: 'Selected Projects | Hospitality, Residential, Commercial | CuttingEdge', desc: 'A portfolio of interior projects by CuttingEdge: restaurants and bars, private residences and commercial spaces. Filter by sector.' },
    contact: { title: 'Contact & Project Enquiry | CuttingEdge Amsterdam', desc: 'Tell us about your project in a few steps: sector, location, size, budget and timeline. We respond personally, typically within 24 hours.' },
    thanks: { title: 'Thank you | CuttingEdge', desc: 'Your enquiry has been received.' },
    privacy: { title: 'Privacy Policy | CuttingEdge', desc: 'How CuttingEdge handles the personal data you send through the enquiry form: what we collect, why, how long we keep it and your rights.' },
    legal: { title: 'Legal Notice | CuttingEdge', desc: 'Company details, general terms and website terms of CuttingEdge, Ookmeerweg 101, Amsterdam. KvK 34153096.' },
  },
  nl: {
    home: { title: 'CuttingEdge | Interieurontwerp & turn-key bouw Amsterdam', desc: 'Interieurstudio in Amsterdam voor pragmatische luxe. Conceptontwerp, technische tekeningen en turn-key interieurbouw voor horeca, woningen en commerciële ruimtes.' },
    approach: { title: 'Onze aanpak | Schets, visualisatie, realisatie | CuttingEdge', desc: 'Zo werkt CuttingEdge: schaalbaar merkgedreven ontwerp, lean projectaanpak en moderne tools, van eerste schets via visualisatie tot opgeleverde ruimte.' },
    services: { title: 'Interieurontwerp Amsterdam: diensten | CuttingEdge', desc: 'Conceptontwerp, technische tekeningen en turn-key interieurbouw. Eén studio in Amsterdam voor horeca, woningen en commerciële interieurs, van idee tot sleuteloverdracht.' },
    'service-concept': { title: 'Conceptontwerp interieur | CuttingEdge Amsterdam', desc: 'Interieurconceptontwerp waarin merkidentiteit ruimtelijke beleving wordt: kleur- en materiaalkeuze, meubel- en inrichtingsontwerp. Studio in Amsterdam.' },
    'service-technical': { title: 'Technische tekeningen interieur | CuttingEdge Amsterdam', desc: 'Nauwkeurige technische tekeningen voor interieurprojecten: elektraschema’s en belastingberekening, airco en ventilatie, en complete lichtplannen.' },
    'service-turnkey': { title: 'Turn-key interieurbouw | CuttingEdge Amsterdam', desc: 'Turn-key interieurbouw van concept tot sleuteloverdracht: leveranciersbeheer, planningsbewaking en kwaliteitscontrole voor horeca, wonen en commercieel.' },
    projects: { title: 'Projecten | Horeca, wonen, commercieel | CuttingEdge', desc: 'Een portfolio van interieurprojecten van CuttingEdge: restaurants en bars, particuliere woningen en commerciële ruimtes. Filter op sector.' },
    contact: { title: 'Contact & projectaanvraag | CuttingEdge Amsterdam', desc: 'Vertel ons in een paar stappen over uw project: sector, locatie, oppervlak, budget en planning. Wij reageren persoonlijk, doorgaans binnen 24 uur.' },
    thanks: { title: 'Bedankt | CuttingEdge', desc: 'Uw aanvraag is ontvangen.' },
    privacy: { title: 'Privacybeleid | CuttingEdge', desc: 'Hoe CuttingEdge omgaat met de persoonsgegevens die u via het aanvraagformulier verstuurt: wat we verzamelen, waarom, hoe lang en uw rechten.' },
    legal: { title: 'Juridische informatie | CuttingEdge', desc: 'Bedrijfsgegevens, algemene voorwaarden en websitevoorwaarden van CuttingEdge, Ookmeerweg 101, Amsterdam. KvK 34153096.' },
  },
};

export const home: L<any> = {
  en: {
    h1: 'Translating vision into enduring reality.',
    lead: 'CuttingEdge is an interior design and turn-key build studio in Amsterdam. We shape restaurants, residences and commercial spaces from first sketch to keys in hand.',
    ctaPrimary: 'Explore our work', ctaSecondary: 'Start a project',
    captionLabel: 'Now playing',
    statementEyebrow: 'Thinking ahead',
    statement: 'Translating the client’s will into the long-term shape.',
    statementBody: 'We prioritise brand-driven design that is scalable and reproducible. From restaurants to luxury resorts we hold the highest quality standard, using the best tools to deliver fast and lean solutions.',
    workEyebrow: 'Selected work', workTitle: 'Rooms we have shaped',
    servicesEyebrow: 'Expertise', servicesTitle: 'Three disciplines, one studio',
    servicesIntro: 'Design, documentation and delivery under one roof, so the idea that was sold is the space that is built.',
    processEyebrow: 'From idea to space', processTitle: 'Sketch, visualisation, realisation',
    processIntro: 'Every project starts on paper. Drawings become visualisations, visualisations become decisions, and decisions become a finished room.',
    steps: [
      { k: 'sketch', title: 'Sketch', text: 'Hand drawings fix the idea: proportion, flow and atmosphere, before anything is modelled.' },
      { k: 'visualisation', title: 'Visualisation', text: 'We use modern tools, including AI and parametric design software, to show complex concepts before construction begins.' },
      { k: 'realisation', title: 'Realisation', text: 'Technical drawings, vendors, timeline and quality control are managed in one hand, through to the handover.' },
    ],
    compareCaption: 'Restaurant concept: hand sketch (left) and 3D visualisation (right). Drag the divider.',
    closeEyebrow: 'Crafted experiences',
    closeTitle: 'Have a space in mind?',
    closeText: 'From concept to completion, we bring your vision to life. Tell us about it in a few steps. We typically respond within 24 hours.',
  },
  nl: {
    h1: 'Visie vertalen naar blijvende werkelijkheid.',
    lead: 'CuttingEdge is een studio voor interieurontwerp en turn-key bouw in Amsterdam. Wij geven restaurants, woningen en commerciële ruimtes vorm, van eerste schets tot sleuteloverdracht.',
    ctaPrimary: 'Bekijk ons werk', ctaSecondary: 'Start een project',
    captionLabel: 'Nu te zien',
    statementEyebrow: 'Vooruit denken',
    statement: 'De wil van de opdrachtgever vertalen naar een vorm die lang meegaat.',
    statementBody: 'Wij gaan uit van merkgedreven ontwerp dat schaalbaar en herhaalbaar is. Van restaurants tot luxe resorts houden we de lat hoog en zetten we de beste tools in voor snelle, slanke oplossingen.',
    workEyebrow: 'Geselecteerd werk', workTitle: 'Ruimtes die wij vormgaven',
    servicesEyebrow: 'Expertise', servicesTitle: 'Drie disciplines, één studio',
    servicesIntro: 'Ontwerp, uitwerking en uitvoering onder één dak, zodat de ruimte die is verkocht ook de ruimte is die wordt gebouwd.',
    processEyebrow: 'Van idee naar ruimte', processTitle: 'Schets, visualisatie, realisatie',
    processIntro: 'Elk project begint op papier. Tekeningen worden visualisaties, visualisaties worden beslissingen en beslissingen worden een afgewerkte ruimte.',
    steps: [
      { k: 'sketch', title: 'Schets', text: 'Handtekeningen leggen het idee vast: verhoudingen, looproute en sfeer, nog voordat er iets wordt gemodelleerd.' },
      { k: 'visualisation', title: 'Visualisatie', text: 'Met moderne tools, waaronder AI en parametrische ontwerpsoftware, tonen we complexe concepten vóórdat de bouw begint.' },
      { k: 'realisation', title: 'Realisatie', text: 'Technische tekeningen, leveranciers, planning en kwaliteitscontrole liggen in één hand, tot en met de oplevering.' },
    ],
    compareCaption: 'Restaurantconcept: handschets (links) en 3D-visualisatie (rechts). Sleep de scheidingslijn.',
    closeEyebrow: 'Vakmanschap in beleving',
    closeTitle: 'Een ruimte in gedachten?',
    closeText: 'Van concept tot oplevering brengen wij uw visie tot leven. Vertel er in een paar stappen over. Wij reageren doorgaans binnen 24 uur.',
  },
};

export type ServiceKey = 'concept-design' | 'technical-drawings' | 'turn-key-build';

export const services: L<Record<ServiceKey, any>> = {
  en: {
    'concept-design': {
      n: '03', title: 'Concept Design', tag: 'Where brand identity becomes spatial experience.',
      intro: 'Interior concept design is where a brand, a story or a way of living is translated into a room. We start from the identity of the client and work towards a space that is distinctive, coherent and buildable.',
      items: [
        { t: 'Brand identity integration', d: 'The brand’s character is carried into layout, atmosphere and detail, so the space reads as unmistakably yours.' },
        { t: 'Colour palette & material selection', d: 'Colour theory and material choices are made together, with a view to how surfaces age and how light moves through the room.' },
        { t: 'Custom furniture & fixture design', d: 'Furniture selection and bespoke pieces that fit the concept and the way the space will be used.' },
      ],
      forWho: 'Restaurants, bars and hotels, private residences, shops and offices. Hospitality interiors in Amsterdam are a particular strength.',
      next: 'Concept design hands over to technical drawings, so what is imagined is documented precisely before anything is built.',
    },
    'technical-drawings': {
      n: '01', title: 'Technical Drawings', tag: 'Precision meets vision. Every detail documented for flawless execution.',
      intro: 'A good concept needs drawings that contractors can build from. We document the technical side of the interior so that the design survives contact with the building site.',
      items: [
        { t: 'Electrical schematics & load planning', d: 'Electrical systems drawn and balanced for the real load of the space, not only for the look of it.' },
        { t: 'Air conditioning & ventilation installation', d: 'Climate and air handling planned alongside the interior, so installations support the design instead of fighting it.' },
        { t: 'Comprehensive lighting plans', d: 'Lighting plans that set out fixtures, circuits and scenes, from general light to the accents that make a room.' },
      ],
      forWho: 'Interior projects that need accurate documentation for tendering, building and inspection, in hospitality, residential and commercial settings.',
      next: 'Drawings feed straight into a turn-key build, where we manage vendors and quality against the same documents.',
    },
    'turn-key-build': {
      n: '02', title: 'Turn-key Build', tag: 'From concept to keys in hand. We manage every step so you don’t have to.',
      intro: 'Turn-key interior build means one responsible partner from the first drawing to handover. We coordinate the trades, protect the timeline and check the quality, so you receive a finished space.',
      items: [
        { t: 'Strategic outsourcing & vendor management', d: 'The right specialists for each part of the work, briefed and coordinated by one project lead.' },
        { t: 'Project watchdogging & timeline control', d: 'Progress is monitored on site and against the plan, so problems are caught early and communicated plainly.' },
        { t: 'Rigorous quality control & safety standards', d: 'Work is checked against the drawings and against safety requirements before it is accepted.' },
      ],
      forWho: 'Clients who want a finished restaurant, residence or commercial space without managing a dozen contractors themselves.',
      next: 'Not sure which service fits? Describe the space and we will advise. A full-service route covers all three.',
    },
  },
  nl: {
    'concept-design': {
      n: '03', title: 'Conceptontwerp', tag: 'Waar merkidentiteit ruimtelijke beleving wordt.',
      intro: 'Bij interieurconceptontwerp wordt een merk, een verhaal of een manier van leven vertaald naar een ruimte. We vertrekken vanuit de identiteit van de opdrachtgever en werken toe naar een ruimte die onderscheidend, samenhangend en bouwbaar is.',
      items: [
        { t: 'Integratie van merkidentiteit', d: 'Het karakter van het merk komt terug in indeling, sfeer en detail, zodat de ruimte onmiskenbaar van u is.' },
        { t: 'Kleurenpalet & materiaalkeuze', d: 'Kleurtheorie en materiaalkeuze worden samen gemaakt, met oog voor veroudering van oppervlakken en de manier waarop licht door de ruimte beweegt.' },
        { t: 'Maatwerkmeubels & inrichting', d: 'Meubelselectie en maatwerkstukken die passen bij het concept en bij het gebruik van de ruimte.' },
      ],
      forWho: 'Restaurants, bars en hotels, particuliere woningen, winkels en kantoren. Horeca-interieur in Amsterdam is een bijzondere sterkte.',
      next: 'Het conceptontwerp gaat over in technische tekeningen, zodat wat bedacht is nauwkeurig vastligt voordat er gebouwd wordt.',
    },
    'technical-drawings': {
      n: '01', title: 'Technische tekeningen', tag: 'Precisie ontmoet visie. Elk detail vastgelegd voor een vlekkeloze uitvoering.',
      intro: 'Een goed concept heeft tekeningen nodig waarmee aannemers kunnen bouwen. Wij leggen de technische kant van het interieur vast, zodat het ontwerp het bouwterrein overleeft.',
      items: [
        { t: 'Elektraschema’s & belastingplanning', d: 'Elektrische installaties getekend en doorgerekend op de werkelijke belasting van de ruimte, niet alleen op het uiterlijk.' },
        { t: 'Airco- en ventilatie-installatie', d: 'Klimaat en luchtbehandeling worden samen met het interieur gepland, zodat installaties het ontwerp ondersteunen in plaats van tegenwerken.' },
        { t: 'Complete lichtplannen', d: 'Lichtplannen met armaturen, groepen en scènes, van algemeen licht tot de accenten die een ruimte maken.' },
      ],
      forWho: 'Interieurprojecten die nauwkeurige documentatie nodig hebben voor aanbesteding, bouw en keuring, in horeca, wonen en commerciële ruimtes.',
      next: 'De tekeningen vloeien direct door naar een turn-key bouw, waarin wij leveranciers en kwaliteit toetsen aan dezelfde documenten.',
    },
    'turn-key-build': {
      n: '02', title: 'Turn-key bouw', tag: 'Van concept tot sleuteloverdracht. Wij regelen elke stap, zodat u dat niet hoeft te doen.',
      intro: 'Turn-key interieurbouw betekent één verantwoordelijke partner, van eerste tekening tot oplevering. Wij coördineren de vakmensen, bewaken de planning en controleren de kwaliteit, zodat u een afgewerkte ruimte ontvangt.',
      items: [
        { t: 'Strategisch uitbesteden & leveranciersbeheer', d: 'De juiste specialisten voor elk onderdeel van het werk, geïnstrueerd en gecoördineerd door één projectleider.' },
        { t: 'Bewaking van project & planning', d: 'Voortgang wordt op locatie en tegen de planning bewaakt, zodat problemen vroeg worden gesignaleerd en helder worden gecommuniceerd.' },
        { t: 'Strenge kwaliteitscontrole & veiligheidsnormen', d: 'Werk wordt getoetst aan de tekeningen en aan veiligheidseisen voordat het wordt geaccepteerd.' },
      ],
      forWho: 'Opdrachtgevers die een afgewerkt restaurant, een woning of een commerciële ruimte willen zonder zelf een dozijn aannemers aan te sturen.',
      next: 'Twijfelt u welke dienst past? Beschrijf de ruimte en wij adviseren u. Een full-serviceroute omvat alle drie.',
    },
  },
};

export const approach: L<any> = {
  en: {
    eyebrow: 'Our approach', h1: 'Methodology meets innovation.',
    lead: 'A repeatable way of working, so quality does not depend on luck, and a project can grow from one room to many locations.',
    principles: [
      { t: 'Scalable design', d: 'We prioritise brand-driven design approaches to make them scalable and reproducible. Whether it is a chain of restaurants, kiosks or a luxury resort, consistency and quality carry across every location.' },
      { t: 'Lean management', d: 'Using the best tools and management practice, we deliver fast, lean solutions tailored to each situation. The process minimises waste and maximises value.' },
      { t: 'Advanced technology', d: 'We use modern tools, including AI and parametric design software, to optimise output per resource and to visualise complex concepts before construction begins.' },
    ],
    processTitle: 'From sketch to space',
    servicesTitle: 'Detailed offerings', servicesLead: 'Three services that can be hired separately or as one full-service route.',
    ctaTitle: 'Let’s talk about your space', ctaText: 'Describe what you have in mind. A few steps, no obligation.',
  },
  nl: {
    eyebrow: 'Onze aanpak', h1: 'Methodiek ontmoet innovatie.',
    lead: 'Een herhaalbare werkwijze, zodat kwaliteit niet van geluk afhangt en een project kan groeien van één ruimte naar meerdere locaties.',
    principles: [
      { t: 'Schaalbaar ontwerp', d: 'Wij geven voorrang aan merkgedreven ontwerp dat schaalbaar en herhaalbaar is. Of het nu gaat om een restaurantketen, kiosken of een luxe resort: consistentie en kwaliteit gaan mee naar elke locatie.' },
      { t: 'Lean management', d: 'Met de beste tools en managementpraktijken leveren we snelle, slanke oplossingen op maat. Het proces beperkt verspilling en maximaliseert waarde.' },
      { t: 'Geavanceerde technologie', d: 'Wij zetten moderne tools in, waaronder AI en parametrische ontwerpsoftware, om de output per inzet te optimaliseren en complexe concepten te visualiseren voordat de bouw begint.' },
    ],
    processTitle: 'Van schets naar ruimte',
    servicesTitle: 'Onze diensten in detail', servicesLead: 'Drie diensten die u los of als één full-serviceroute kunt afnemen.',
    ctaTitle: 'Laten we praten over uw ruimte', ctaText: 'Beschrijf wat u voor ogen heeft. Een paar stappen, vrijblijvend.',
  },
};

export const servicesPage: L<any> = {
  en: { eyebrow: 'Services', h1: 'Interior design and turn-key build in Amsterdam.', lead: 'Concept design, technical drawings and turn-key build, for hospitality, residential and commercial interiors. Hire one discipline or let us run the whole route.', view: 'Read more', ctaTitle: 'Not sure where to start?', ctaText: 'Tell us about the space and we will recommend a route.', forLabel: 'Suited to', includes: 'What it covers', nextLabel: 'How it connects', otherServices: 'Other services' },
  nl: { eyebrow: 'Diensten', h1: 'Interieurontwerp en turn-key bouw in Amsterdam.', lead: 'Conceptontwerp, technische tekeningen en turn-key interieurbouw voor horeca, woningen en commerciële ruimtes. Kies één discipline of laat ons de hele route uitvoeren.', view: 'Lees meer', ctaTitle: 'Weet u niet waar te beginnen?', ctaText: 'Vertel ons over de ruimte en wij raden een route aan.', forLabel: 'Geschikt voor', includes: 'Wat het omvat', nextLabel: 'Hoe het aansluit', otherServices: 'Andere diensten' },
};

export const projectsPage: L<any> = {
  en: { eyebrow: 'Selected works', h1: 'A portfolio of precision and elegance.', lead: 'Restaurants and bars, private residences and commercial spaces. Filter by sector.', count: 'projects', ctaTitle: 'Your space could be next', ctaText: 'Tell us about your project.' },
  nl: { eyebrow: 'Geselecteerd werk', h1: 'Een portfolio van precisie en elegantie.', lead: 'Restaurants en bars, particuliere woningen en commerciële ruimtes. Filter op sector.', count: 'projecten', ctaTitle: 'Uw ruimte kan de volgende zijn', ctaText: 'Vertel ons over uw project.' },
};

export const projectLabels: L<Record<string, string>> = {
  en: { brief: 'The brief', challenge: 'The challenge', approach: 'Our approach', outcome: 'The outcome', facts: 'Project facts', ctaTitle: 'A space like this?', ctaText: 'Tell us about your project. We respond personally.', videoLabel: 'Project video' },
  nl: { brief: 'De opdracht', challenge: 'De uitdaging', approach: 'Onze aanpak', outcome: 'Het resultaat', facts: 'Projectgegevens', ctaTitle: 'Een ruimte als deze?', ctaText: 'Vertel ons over uw project. Wij reageren persoonlijk.', videoLabel: 'Projectvideo' },
};

export const contactPage: L<any> = {
  en: {
    eyebrow: 'Contact', h1: 'Let’s create together.',
    lead: 'Every exceptional space begins with a conversation. Whether you have a clear vision or just the start of an idea, we would love to hear from you. We are available for projects worldwide, from intimate residences to large hospitality ventures.',
    response: 'Every enquiry receives our personal attention. We typically respond within 24 hours.',
    directTitle: 'Prefer to talk directly?', waText: 'Hello CuttingEdge, I would like to talk about a project.',
    formTitle: 'Tell us about your project',
    steps: ['Project', 'Space', 'You'], stepOf: 'Step {n} of {t}',
    next: 'Next', back: 'Back', send: 'Send enquiry', sending: 'Sending…',
    f: {
      sector: 'What kind of project is it?', services: 'What do you need from us?', servicesHint: 'Select all that apply.',
      location: 'Where is the project?', locationHelp: 'City or address, country if not the Netherlands.',
      size: 'Approximate size (m²)', sizeHelp: 'A rough number is fine.',
      budget: 'Budget band', budgetHelp: 'Indicative, excluding VAT. It helps us advise realistically.',
      timeline: 'When would you like to start or finish?',
      name: 'Your name', email: 'Email address', phone: 'Phone (optional)', phoneHelp: 'Only if you prefer a call back.',
      message: 'Tell us more', messageHelp: 'The idea, the brand, what the space should feel like, anything useful.',
      consent: 'I agree to CuttingEdge processing the data in this form to respond to my enquiry, as described in the {privacy}.',
      privacy: 'privacy policy', optional: 'optional', required: 'required', choose: 'Choose…',
    },
    sectors: { hospitality: 'Hospitality (restaurant, bar, hotel)', residential: 'Residential', commercial: 'Commercial (shop, office)', other: 'Something else' },
    servicesOpt: { 'concept-design': 'Concept design', 'technical-drawings': 'Technical drawings', 'turn-key-build': 'Turn-key build', 'full-service': 'Full service / not sure yet' },
    budgets: { 'under-25k': 'Under €25,000', '25-50k': '€25,000 – €50,000', '50-100k': '€50,000 – €100,000', '100-250k': '€100,000 – €250,000', 'over-250k': 'Over €250,000', unsure: 'Not sure yet' },
    timelines: { asap: 'As soon as possible', '3m': 'Within 3 months', '3-6m': 'In 3 to 6 months', '6-12m': 'In 6 to 12 months', flexible: 'Flexible / exploring' },
    errors: {
      required: 'This field is required.', email: 'Enter a valid email address, for example name@example.com.', consent: 'Please agree before sending.',
      choose: 'Please choose an option.', number: 'Enter a number, for example 120.', summary: 'Please correct the highlighted fields:',
      server: 'We could not send your enquiry just now. Nothing has been lost on your side: please use WhatsApp or email instead.',
      network: 'The connection failed. Please try again, or use WhatsApp or email.',
      rate: 'Too many enquiries from this connection. Please try again later, or use WhatsApp or email.',
    },
    fallback: 'Send it another way', fallbackText: 'Message us on WhatsApp or email and we will pick it up personally.',
    previewTitle: 'Preview build, not sent', previewText: 'This is a design preview. Submitting does not send anything. To reach the studio now, use WhatsApp or email:',
    noJs: 'Your enquiry is sent when you press “Send enquiry”.',
    thanksH1: 'Thank you, we have your enquiry.', thanksText: 'We will get back to you personally, typically within 24 hours. In the meantime, have a look at our work.', thanksCta: 'View projects',
    studio: 'Studio', hours: 'Response time', hoursValue: 'Typically within 24 hours',
  },
  nl: {
    eyebrow: 'Contact', h1: 'Laten we samen iets maken.',
    lead: 'Elke bijzondere ruimte begint met een gesprek. Of u nu een heldere visie heeft of net het begin van een idee, wij horen het graag. Wij zijn beschikbaar voor projecten wereldwijd, van intieme woningen tot grote horecaprojecten.',
    response: 'Elke aanvraag krijgt onze persoonlijke aandacht. Wij reageren doorgaans binnen 24 uur.',
    directTitle: 'Liever direct praten?', waText: 'Hallo CuttingEdge, ik wil graag over een project praten.',
    formTitle: 'Vertel ons over uw project',
    steps: ['Project', 'Ruimte', 'U'], stepOf: 'Stap {n} van {t}',
    next: 'Volgende', back: 'Terug', send: 'Aanvraag versturen', sending: 'Versturen…',
    f: {
      sector: 'Wat voor project is het?', services: 'Waarmee kunnen wij helpen?', servicesHint: 'Selecteer alles wat van toepassing is.',
      location: 'Waar is het project?', locationHelp: 'Plaats of adres, en land als het niet Nederland is.',
      size: 'Ongeveer oppervlak (m²)', sizeHelp: 'Een ruwe schatting volstaat.',
      budget: 'Budgetklasse', budgetHelp: 'Indicatief, exclusief btw. Zo kunnen we realistisch adviseren.',
      timeline: 'Wanneer wilt u starten of opleveren?',
      name: 'Uw naam', email: 'E-mailadres', phone: 'Telefoon (optioneel)', phoneHelp: 'Alleen als u liever teruggebeld wordt.',
      message: 'Vertel ons meer', messageHelp: 'Het idee, het merk, hoe de ruimte moet voelen, alles wat nuttig is.',
      consent: 'Ik ga ermee akkoord dat CuttingEdge de gegevens in dit formulier verwerkt om mijn aanvraag te beantwoorden, zoals beschreven in het {privacy}.',
      privacy: 'privacybeleid', optional: 'optioneel', required: 'verplicht', choose: 'Kies…',
    },
    sectors: { hospitality: 'Horeca (restaurant, bar, hotel)', residential: 'Wonen', commercial: 'Commercieel (winkel, kantoor)', other: 'Iets anders' },
    servicesOpt: { 'concept-design': 'Conceptontwerp', 'technical-drawings': 'Technische tekeningen', 'turn-key-build': 'Turn-key bouw', 'full-service': 'Full service / nog niet zeker' },
    budgets: { 'under-25k': 'Minder dan € 25.000', '25-50k': '€ 25.000 – € 50.000', '50-100k': '€ 50.000 – € 100.000', '100-250k': '€ 100.000 – € 250.000', 'over-250k': 'Meer dan € 250.000', unsure: 'Nog niet zeker' },
    timelines: { asap: 'Zo snel mogelijk', '3m': 'Binnen 3 maanden', '3-6m': 'Over 3 tot 6 maanden', '6-12m': 'Over 6 tot 12 maanden', flexible: 'Flexibel / oriënterend' },
    errors: {
      required: 'Dit veld is verplicht.', email: 'Vul een geldig e-mailadres in, bijvoorbeeld naam@voorbeeld.nl.', consent: 'Ga akkoord voordat u verstuurt.',
      choose: 'Kies een optie.', number: 'Vul een getal in, bijvoorbeeld 120.', summary: 'Corrigeer de gemarkeerde velden:',
      server: 'We konden uw aanvraag nu niet versturen. Er is niets verloren gegaan aan uw kant: gebruik WhatsApp of e-mail.',
      network: 'De verbinding is mislukt. Probeer het opnieuw, of gebruik WhatsApp of e-mail.',
      rate: 'Te veel aanvragen vanaf deze verbinding. Probeer het later opnieuw, of gebruik WhatsApp of e-mail.',
    },
    fallback: 'Stuur het op een andere manier', fallbackText: 'Stuur ons een bericht via WhatsApp of e-mail, dan pakken wij het persoonlijk op.',
    previewTitle: 'Previewversie, niets verzonden', previewText: 'Dit is een ontwerppreview. Versturen doet niets. Neem nu contact op met de studio via WhatsApp of e-mail:',
    noJs: 'Uw aanvraag wordt verzonden zodra u op “Aanvraag versturen” drukt.',
    thanksH1: 'Bedankt, we hebben uw aanvraag.', thanksText: 'Wij nemen persoonlijk contact met u op, doorgaans binnen 24 uur. Bekijk intussen ons werk.', thanksCta: 'Bekijk projecten',
    studio: 'Studio', hours: 'Reactietijd', hoursValue: 'Doorgaans binnen 24 uur',
  },
};

export const notFound = ui;
