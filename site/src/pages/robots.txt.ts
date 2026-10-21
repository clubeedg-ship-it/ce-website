import type { APIRoute } from 'astro';
import { PREVIEW, SITE, url } from '../lib/routes';

export const GET: APIRoute = () => {
  const body = PREVIEW
    ? `# PREVIEW BUILD: not for indexing\nUser-agent: *\nDisallow: /\n`
    : `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE}/sitemap.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
