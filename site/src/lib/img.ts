import { getImage } from 'astro:assets';

export const DEFAULT_WIDTHS = [480, 800, 1200, 1800];

/** AVIF + WebP srcsets (only widths the source can supply) and a WebP fallback. */
export async function pictureSet(src: ImageMetadata, widths: number[] = DEFAULT_WIDTHS) {
  let ws = widths.filter((w) => w <= src.width);
  if (!ws.length) ws = [src.width];
  // if the source is a bit smaller than the biggest requested width, include its native width
  const max = Math.max(...widths);
  if (src.width < max && src.width > Math.max(...ws) * 1.15) ws.push(src.width);
  const build = async (format: 'avif' | 'webp') => {
    const out = await Promise.all(ws.map((w) => getImage({ src, width: w, format, quality: format === 'avif' ? 46 : 72 })));
    return out.map((o, i) => `${o.src} ${ws[i]}w`).join(', ');
  };
  const [avif, webp] = await Promise.all([build('avif'), build('webp')]);
  const fbW = ws[Math.min(1, ws.length - 1)];
  const fb = await getImage({ src, width: fbW, format: 'webp', quality: 72 });
  return { avif, webp, fallback: fb.src, width: fbW, height: Math.round(fbW * (src.height / src.width)) };
}

export async function singleUrl(src: ImageMetadata, width: number, format: 'webp' | 'avif' = 'webp') {
  const w = Math.min(width, src.width);
  return (await getImage({ src, width: w, format, quality: format === 'avif' ? 46 : 74 })).src;
}
