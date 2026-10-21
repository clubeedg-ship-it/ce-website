import type { APIRoute, GetStaticPaths } from 'astro';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { getPages, pageMeta, type Page } from '../../lib/projects';

// 1200x630 Open Graph image per page + language: photo, dark gradient, logo, title in Playfair Display.
const W = 1200, H = 630;
const assets = import.meta.glob('../../assets/{posters,process,projects}/**/*.jpg', { eager: true, import: 'default' }) as Record<string, ImageMetadata & { fsPath?: string }>;
const find = (needle: string) => {
  const hit = Object.entries(assets).find(([k]) => k.endsWith(needle));
  if (!hit) throw new Error(`OG source not found: ${needle}`);
  return (hit[1] as any).fsPath ?? hit[0];
};
const logoPath = path.resolve('src/assets/brand/logo-light.svg');

const bg = (p: Page): string | null => {
  switch (p.key) {
    case 'home': return find('posters/hero.jpg');
    case 'project': return (p.project!.data.hero as any).fsPath;
    case 'approach': return find('process/restaurant-visual-dark.jpg');
    case 'services': case 'service-turnkey': case 'projects': return find('hospitality-collection/bar-back-wall.jpg');
    case 'service-concept': return find('restaurant-looks/dining-room.jpg');
    case 'service-technical': return find('process/loft-sketch.jpg');
    case 'contact': return find('posters/salon.jpg');
    default: return null;
  }
};

export const getStaticPaths = (async () => {
  const pages = (await getPages()).filter((p) => p.key !== 'thanks');
  return pages.map((page) => ({
    params: { slug: `${page.lang}/${page.key === 'project' ? `project-${page.project!.id}` : page.key}` },
    props: { page },
  }));
}) satisfies GetStaticPaths;

const wrap = (s: string, max: number) => {
  const words = s.split(' '); const lines: string[] = []; let cur = '';
  for (const w of words) { if ((cur + ' ' + w).trim().length > max) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
};
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export const GET: APIRoute = async ({ props }) => {
  const page = (props as { page: Page }).page;
  const title = pageMeta(page).title.split('|')[0].trim();
  const lines = wrap(title, 24);
  const size = 70, lh = 80;
  const y0 = H - 90 - (lines.length - 1) * lh;
  const text = lines.map((l, i) => `<text x="72" y="${y0 + i * lh}" font-family="Playfair Display" font-size="${size}" font-weight="500" fill="#F3EFE6">${esc(l)}</text>`).join('');
  const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050505" stop-opacity=".55"/><stop offset=".45" stop-color="#050505" stop-opacity=".2"/><stop offset="1" stop-color="#050505" stop-opacity=".92"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    <rect x="72" y="${y0 - size - 34}" width="64" height="3" fill="#D4AF37"/>
    ${text}
    <text x="${W - 72}" y="${H - 44}" text-anchor="end" font-family="Playfair Display" font-style="italic" font-size="26" fill="#C5A059">Pragmatic Luxury</text>
  </svg>`);
  const src = bg(page);
  let img = src ? sharp(src).resize(W, H, { fit: 'cover', position: 'attention' }) : sharp({ create: { width: W, height: H, channels: 3, background: '#121212' } });
  const logo = await sharp(logoPath, { density: 200 }).resize({ height: 54 }).png().toBuffer();
  const out = await img.composite([{ input: overlay }, { input: logo, left: 72, top: 56 }]).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  return new Response(out, { headers: { 'Content-Type': 'image/jpeg' } });
};
