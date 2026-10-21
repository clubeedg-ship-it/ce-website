import type { APIRoute } from 'astro';
import { getProjects } from '../lib/projects';
import { abs, business, projectPath, staticRoutes } from '../lib/routes';
import { services as svc } from '../i18n/copy';

// llms.txt: a plain-language map of the site for AI answer engines (https://llmstxt.org). Facts only.
export const GET: APIRoute = async () => {
  const projects = await getProjects();
  const lines: string[] = [];
  lines.push('# CuttingEdge');
  lines.push('');
  lines.push('> CuttingEdge is an interior design and turn-key build studio in Amsterdam. It offers concept design, technical drawings and turn-key build for hospitality, residential and commercial spaces. The site is available in English and Dutch (Nederlands).');
  lines.push('');
  lines.push('## Company');
  lines.push(`- Address: ${business.street}, ${business.postal} ${business.city}, The Netherlands`);
  lines.push(`- Email: ${business.email}`);
  lines.push(`- Phone / WhatsApp: ${business.phone}`);
  lines.push(`- KvK (Chamber of Commerce): ${business.kvk}`);
  lines.push(`- VAT (BTW): ${business.btw}`);
  lines.push('- Typical response time to enquiries: within 24 hours');
  lines.push('');
  lines.push('## Services (EN)');
  for (const [k, r] of [['concept-design', 'service-concept'], ['technical-drawings', 'service-technical'], ['turn-key-build', 'service-turnkey']] as const)
    lines.push(`- [${svc.en[k].title}](${abs(staticRoutes[r].en)}): ${svc.en[k].tag}`);
  lines.push('');
  lines.push('## Pages (EN)');
  for (const k of ['home', 'projects', 'approach', 'services', 'contact', 'privacy', 'legal'] as const) lines.push(`- ${abs(staticRoutes[k].en)}`);
  lines.push('');
  lines.push('## Projects (EN)');
  for (const p of projects) lines.push(`- [${p.data.title.en}](${abs(projectPath('en', p.data.slugs))}): ${p.data.summary.en}`);
  lines.push('');
  lines.push('## Nederlands');
  lines.push('> CuttingEdge is een studio voor interieurontwerp en turn-key bouw in Amsterdam: conceptontwerp, technische tekeningen en turn-key interieurbouw voor horeca, woningen en commerciële ruimtes.');
  for (const [k, r] of [['concept-design', 'service-concept'], ['technical-drawings', 'service-technical'], ['turn-key-build', 'service-turnkey']] as const)
    lines.push(`- [${svc.nl[k].title}](${abs(staticRoutes[r].nl)}): ${svc.nl[k].tag}`);
  for (const k of ['home', 'projects', 'approach', 'services', 'contact', 'privacy', 'legal'] as const) lines.push(`- ${abs(staticRoutes[k].nl)}`);
  for (const p of projects) lines.push(`- [${p.data.title.nl}](${abs(projectPath('nl', p.data.slugs))}): ${p.data.summary.nl}`);
  lines.push('');
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
