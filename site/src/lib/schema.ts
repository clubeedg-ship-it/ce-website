import { abs, asset, business, SITE, url, type Lang, type RouteKey, staticRoutes, projectPath } from './routes';
import type { Page, Project } from './projects';
import { ui, services as svcCopy } from '../i18n/copy';

const orgId = `${SITE}/#organization`;

export function organization(lang: Lang) {
  return {
    '@type': 'ProfessionalService',
    '@id': orgId,
    name: 'CuttingEdge',
    alternateName: 'Cutting Edge',
    description:
      lang === 'en'
        ? 'Interior design and turn-key build studio in Amsterdam: concept design, technical drawings and turn-key build for hospitality, residential and commercial spaces.'
        : 'Studio voor interieurontwerp en turn-key bouw in Amsterdam: conceptontwerp, technische tekeningen en turn-key interieurbouw voor horeca, wonen en commercieel.',
    url: abs(lang === 'en' ? '' : 'nl'),
    logo: `${SITE}${asset('favicon-512.png')}`,
    email: business.email,
    telephone: business.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.street,
      postalCode: business.postal,
      addressLocality: business.city,
      addressCountry: business.country,
    },
    identifier: { '@type': 'PropertyValue', propertyID: 'KvK', value: business.kvk },
    vatID: business.btw,
    areaServed: 'Worldwide',
    knowsLanguage: ['en', 'nl'],
    // sameAs intentionally omitted: no verified social profile URLs exist yet (see CONTENT-NEEDED.md)
  };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function graph(page: Page, title: string, desc: string, imageUrl: string, trail: { name: string; path: string }[]) {
  const lang = page.lang;
  const pageUrl = abs(page.path);
  const nodes: any[] = [];
  const webpage = (type: string, extra: object = {}) => ({
    '@type': type, '@id': `${pageUrl}#webpage`, url: pageUrl, name: title, description: desc, inLanguage: lang,
    isPartOf: { '@id': `${SITE}/#website` }, primaryImageOfPage: { '@type': 'ImageObject', url: imageUrl }, ...extra,
  });
  nodes.push({ '@type': 'WebSite', '@id': `${SITE}/#website`, url: abs(''), name: 'CuttingEdge', inLanguage: ['en', 'nl'], publisher: { '@id': orgId } });
  const key = page.key as RouteKey | 'project';
  if (key === 'home' || key === 'contact') nodes.push(organization(lang));
  else nodes.push({ '@id': orgId, '@type': 'ProfessionalService', name: 'CuttingEdge', url: abs(lang === 'en' ? '' : 'nl') });
  if (key === 'home') nodes.push(webpage('WebPage'));
  else if (key === 'contact') nodes.push(webpage('ContactPage', { about: { '@id': orgId } }));
  else if (key === 'projects') nodes.push(webpage('CollectionPage'));
  else if (key === 'project' && page.project) {
    const d = page.project.data;
    nodes.push(webpage('WebPage', { mainEntity: { '@id': `${pageUrl}#work` } }));
    nodes.push({
      '@type': 'CreativeWork', '@id': `${pageUrl}#work`, name: d.title[lang], description: d.summary[lang], inLanguage: lang,
      image: imageUrl, creator: { '@id': orgId }, genre: d.sector, url: pageUrl,
      ...(d.heroCredit ? { contributor: { '@type': 'Person', name: d.heroCredit, jobTitle: 'Photographer' } } : {}),
    });
  } else if (typeof key === 'string' && key.startsWith('service-')) {
    const sk = key === 'service-concept' ? 'concept-design' : key === 'service-technical' ? 'technical-drawings' : 'turn-key-build';
    nodes.push(webpage('WebPage', { mainEntity: { '@id': `${pageUrl}#service` } }));
    nodes.push({ '@type': 'Service', '@id': `${pageUrl}#service`, name: svcCopy[lang][sk].title, description: desc, provider: { '@id': orgId }, areaServed: 'Worldwide', serviceType: svcCopy[lang][sk].title });
  } else nodes.push(webpage('WebPage'));
  if (trail.length > 1) nodes.push(breadcrumbs(trail));
  return { '@context': 'https://schema.org', '@graph': nodes };
}

export function projectsItemList(projects: Project[], lang: Lang) {
  return {
    '@type': 'ItemList',
    itemListElement: projects.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(projectPath(lang, p.data.slugs)), name: p.data.title[lang] })),
  };
}
