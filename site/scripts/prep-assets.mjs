// Prepares optimised "masters" from the original media in v2/assets (kept untouched).
// Usage (repo root):  node site/scripts/prep-assets.mjs
// - photos  -> site/src/assets/projects/<slug>/<name>.jpg (EXIF baked in, long edge <= 2560, q82)
// - process -> site/src/assets/process/*.jpg
// - logo    -> site/src/assets/brand/logo-light.svg (same artwork, tightly cropped, recoloured for dark UI)
// - favicons-> site/public/*.png
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const V2 = path.resolve('v2/assets');
const OUT = path.resolve('site/src/assets');
const PUB = path.resolve('site/public');

// [source relative to v2/assets/images, destination relative to OUT]
const photos = [
  ['projects/4/Bar_2_1.jpg', 'projects/hospitality-collection/bar-lounge-wide.jpg'],
  ['projects/4/DSC04895 - Copy.JPG', 'projects/hospitality-collection/bar-back-wall.jpg'],
  ['projects/4/DSC04834.JPG', 'projects/hospitality-collection/mesh-curtain.jpg'],
  ['projects/4/DSC04892 - Copy.JPG', 'projects/hospitality-collection/brick-pillar.jpg'],
  ['projects/4/DSC04953.JPG', 'projects/hospitality-collection/logo-rings.jpg'],
  ['projects/4/DSC05138.JPG', 'projects/hospitality-collection/bar-evening.jpg'],
  ['projects/5/restaurant Looks  Michael Broekmeulen (3).JPG', 'projects/restaurant-looks/dining-room.jpg'],
  ['projects/5/restaurant Looks  (4).JPG', 'projects/restaurant-looks/open-kitchen.jpg'],
  ['projects/5/Restaurant Looks35.jpg', 'projects/restaurant-looks/sculpted-wall.jpg'],
  ['projects/10/BB933208-1A40-473A-B634-98E2700157F4.JPG', 'projects/thai-restaurant/entrance.jpg'],
  ['projects/10/IMG_0717.jpg', 'projects/thai-restaurant/dining-hall.jpg'],
  ['projects/10/IMG_0718.jpg', 'projects/thai-restaurant/dining-hall-counter.jpg'],
  ['projects/2/001.jpg', 'projects/jewellery-boutique/display-wall.jpg'],
  ['projects/2/002.jpg', 'projects/jewellery-boutique/display-cases.jpg'],
  ['projects/2/003.jpg', 'projects/jewellery-boutique/sales-floor.jpg'],
  ['projects/1/2.jpg', 'projects/private-residence/living-dining.jpg'],
  ['projects/3/3 copy.jpg', 'projects/heritage-villa/living-room.jpg'],
  ['projects/7/IMG_3539.JPG', 'projects/executive-suite/lounge.jpg'],
  ['projects/7/IMG_4633.JPG', 'projects/executive-suite/lounge-dining.jpg'],
  ['projects/6/IMG_3537.JPG', 'projects/kitchen-design/oak-kitchen.jpg'],
  ['projects/6/IMG_4628 - Copy.JPG', 'projects/kitchen-design/kitchen-hob.jpg'],
  ['projects/8/2Z9C4471large - Copy.jpg', 'projects/johannes-obrecht/bedroom.jpg'],
  ['projects/8/Kamer 208 3 copy.jpg', 'projects/johannes-obrecht/bedroom-evening.jpg'],
  ['projects/8/LD Jo ams (2).JPG', 'projects/johannes-obrecht/hallway.jpg'],
  ['projects/8/P7118227 - Copy.JPG', 'projects/johannes-obrecht/kitchen-island.jpg'],
  ['projects/8/P7118231.JPG', 'projects/johannes-obrecht/kitchen.jpg'],
  ['projects/8/ld J.obrecht.JPG', 'projects/johannes-obrecht/stairwell.jpg'],
  ['process/1/Cutting Edge Sketch.jpg', 'process/loft-sketch.jpg'],
  ['process/1/Generated Image Apr 02 2025 from cutting edge.jpeg', 'process/loft-visual.jpg'],
  ['process/2/Real Sketch from Cutting Edge.jpg', 'process/restaurant-sketch.jpg'],
  ['process/2/Generated Image Apr 05 2025 from cutting edge (1).jpeg', 'process/restaurant-visual-light.jpg'],
  ['process/2/Generated Image Apr 05 2025 from cutting edge.jpeg', 'process/restaurant-visual-dark.jpg'],
];

for (const [src, dst] of photos) {
  const out = path.join(OUT, dst);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const info = await sharp(path.join(V2, 'images', src), { limitInputPixels: false })
    .rotate()
    .resize({ width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out);
  console.log(dst, info.width + 'x' + info.height, Math.round(info.size / 1024) + 'KB');
}

// ---- logo ----
let svg = fs.readFileSync(path.join(V2, 'icons/logo.svg'), 'utf8');
const render = await sharp(Buffer.from(svg), { density: 144 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels } = render.info;
let x0 = W, y0 = H, x1 = 0, y1 = 0;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  if (render.data[(y * W + x) * channels + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
}
const pad = 12;
const vb = [Math.max(0, x0 - pad), Math.max(0, y0 - pad), x1 - x0 + 2 * pad, y1 - y0 + 2 * pad];
const light = svg
  .replace(/<svg[^>]*>/, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}" role="img" aria-label="Cutting Edge">`)
  .replace(/fill="rgb\(24,23,24\)"/g, 'fill="#F3EFE6"')
  .replace(/fill="rgb\(6,5,6\)"/g, 'fill="#F3EFE6"')
  .replace(/fill="rgb\(136,137,135\)"/g, 'fill="#8d8a84"')
  .replace(/fill="rgb\(94,92,94\)"/g, 'fill="#8d8a84"')
  .replace(/fill="rgb\(217,217,215\)"/g, 'fill="#1a1a1a"')
  .replace(/ transform="translate\(0,0\)"/g, '');
fs.mkdirSync(path.join(OUT, 'brand'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'brand/logo-light.svg'), light);
console.log('logo viewBox', vb.join(' '), 'bytes', light.length);

// ---- favicons (from the supplied favicon.png) ----
const fav = path.join(V2, 'icons/favicon.png');
for (const [name, size] of [['favicon-32.png', 32], ['favicon-192.png', 192], ['apple-touch-icon.png', 180], ['favicon-512.png', 512]]) {
  await sharp(fav).resize(size, size, { fit: 'contain', background: '#000000' }).png({ compressionLevel: 9 }).toFile(path.join(PUB, name));
}
