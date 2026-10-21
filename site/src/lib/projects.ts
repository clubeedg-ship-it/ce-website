import { getCollection, type CollectionEntry } from 'astro:content';
import { projectPath, staticRoutes, type Lang, type RouteKey, languages } from './routes';
import { meta } from '../i18n/copy';

export type Project = CollectionEntry<'projects'>;

export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects');
  return all.sort((a, b) => a.data.order - b.data.order);
}

export type Page = { key: RouteKey | 'project'; lang: Lang; path: string; project?: Project; paths: Record<Lang, string> };

/** Every page of the site (both languages), with the counterpart path for hreflang + language switch. */
export async function getPages(): Promise<Page[]> {
  const projects = await getProjects();
  const pages: Page[] = [];
  for (const key of Object.keys(staticRoutes) as RouteKey[]) {
    for (const lang of languages) pages.push({ key, lang, path: staticRoutes[key][lang], paths: staticRoutes[key] });
  }
  for (const p of projects) {
    const paths = { en: projectPath('en', p.data.slugs), nl: projectPath('nl', p.data.slugs) };
    for (const lang of languages) pages.push({ key: 'project', lang, path: paths[lang], project: p, paths });
  }
  return pages;
}

export function pageMeta(page: Page): { title: string; desc: string } {
  if (page.key === 'project' && page.project) {
    const d = page.project.data;
    const lang = page.lang;
    return lang === 'en'
      ? { title: `${d.title.en} | Interior Project | CuttingEdge`, desc: d.summary.en }
      : { title: `${d.title.nl} | Interieurproject | CuttingEdge`, desc: d.summary.nl };
  }
  return meta[page.lang][page.key];
}
