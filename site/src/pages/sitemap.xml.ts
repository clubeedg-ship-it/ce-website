import type { APIRoute } from 'astro';
import { getPages } from '../lib/projects';
import { abs } from '../lib/routes';

export const GET: APIRoute = async () => {
  const pages = (await getPages()).filter((p) => p.key !== 'thanks');
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = pages.map((p) => {
    const alt = (['en', 'nl'] as const).map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${abs(p.paths[l])}" />`).join('\n');
    return `  <url>\n    <loc>${abs(p.path)}</loc>\n    <lastmod>${lastmod}</lastmod>\n${alt}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(p.paths.en)}" />\n  </url>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
