// Accessible lightbox on <dialog>: arrows/Escape, swipe, focus returns to the opener.
const dlg = document.querySelector('[data-lightbox]');
const items = [...document.querySelectorAll('[data-gallery] button')];
const img = dlg.querySelector('[data-lb-img]');
const cap = dlg.querySelector('[data-lb-cap]');
let i = 0;
const show = (n) => {
  i = (n + items.length) % items.length;
  const b = items[i];
  img.src = b.dataset.full;
  img.alt = b.dataset.alt;
  cap.textContent = b.dataset.alt + (b.dataset.credit ? ` (${b.dataset.credit})` : '') + `  ·  ${i + 1}/${items.length}`;
  const nxt = items[(i + 1) % items.length]; new Image().src = nxt.dataset.full;
};
const open = (n) => { show(n); if (!dlg.open) dlg.showModal(); };
items.forEach((b, n) => b.addEventListener('click', () => open(n)));
dlg.querySelector('[data-lb-close]').addEventListener('click', () => dlg.close());
dlg.querySelector('[data-lb-prev]').addEventListener('click', () => show(i - 1));
dlg.querySelector('[data-lb-next]').addEventListener('click', () => show(i + 1));
dlg.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') show(i - 1);
  else if (e.key === 'ArrowRight') show(i + 1);
});
dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
let x0 = null;
dlg.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
dlg.addEventListener('pointerup', (e) => {
  if (x0 === null) return;
  const dx = e.clientX - x0; x0 = null;
  if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1));
});
