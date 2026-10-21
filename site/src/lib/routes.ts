// Routing + URL helpers shared by every page. EN lives at the root, NL under /nl/ with Dutch slugs.
export const languages = ['en', 'nl'] as const;
export type Lang = (typeof languages)[number];

export const PREVIEW = process.env.PREVIEW === "1";
export const SITE = PREVIEW ? (process.env.PREVIEW_SITE || 'https://clubeedg-ship-it.github.io') : 'https://cuttingedge.world';
const BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

export type RouteKey =
  | 'home' | 'approach' | 'services' | 'service-concept' | 'service-technical' | 'service-turnkey'
  | 'projects' | 'contact' | 'thanks' | 'privacy' | 'legal';

export const staticRoutes: Record<RouteKey, Record<Lang, string>> = {
  home: { en: '', nl: 'nl' },
  approach: { en: 'approach', nl: 'nl/aanpak' },
  services: { en: 'services', nl: 'nl/diensten' },
  'service-concept': { en: 'services/concept-design', nl: 'nl/diensten/conceptontwerp' },
  'service-technical': { en: 'services/technical-drawings', nl: 'nl/diensten/technische-tekeningen' },
  'service-turnkey': { en: 'services/turn-key-build', nl: 'nl/diensten/turn-key-bouw' },
  projects: { en: 'projects', nl: 'nl/projecten' },
  contact: { en: 'contact', nl: 'nl/contact' },
  thanks: { en: 'contact/thank-you', nl: 'nl/contact/bedankt' },
  privacy: { en: 'privacy', nl: 'nl/privacybeleid' },
  legal: { en: 'legal', nl: 'nl/juridisch' },
};

export const serviceKeyToRoute = {
  'concept-design': 'service-concept',
  'technical-drawings': 'service-technical',
  'turn-key-build': 'service-turnkey',
} as const;

/** path without leading/trailing slash -> site-relative URL honouring base + trailing slash. */
export const url = (path = ''): string => `${BASE}/${path ? path.replace(/^\/|\/$/g, '') + '/' : ''}`;
export const abs = (path = ''): string => `${SITE}${url(path)}`;
export const asset = (p: string): string => `${BASE}/${p.replace(/^\//, '')}`;

export const projectPath = (lang: Lang, slug: { en: string; nl: string }): string =>
  lang === 'en' ? `projects/${slug.en}` : `nl/projecten/${slug.nl}`;

export const other = (lang: Lang): Lang => (lang === 'en' ? 'nl' : 'en');

/** Business facts that appear on more than one page (all taken from the existing site). */
export const business = {
  name: 'CuttingEdge',
  legalTagline: 'Interior Design & Build',
  email: 'klucas.lucas@gmail.com',
  phone: '+31 6 47 63 97 02',
  phoneHref: '+31647639702',
  whatsapp: '31647639702',
  street: 'Ookmeerweg 101',
  postal: '1068AP',
  city: 'Amsterdam',
  country: 'NL',
  kvk: '34153096',
  btw: 'NL810574163B01',
};

export const waLink = (text: string): string => `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(text)}`;
