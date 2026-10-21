// Core behaviour: header, menu, reveal, background videos. Page-specific modules load on demand.
const d = document;
const de = d.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

/* header turns solid after the first screen of scrolling */
const header = d.querySelector('[data-header]');
if (header) {
  const on = () => header.classList.toggle('is-solid', scrollY > 40);
  on();
  addEventListener('scroll', on, { passive: true });
}

/* mobile menu */
const btn = d.querySelector('[data-menu]');
const nav = d.querySelector('[data-nav]');
if (btn && nav && header) {
  const set = (open) => {
    btn.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    header.classList.toggle('is-open', open);
    de.classList.toggle('nav-open', open);
  };
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') !== 'true';
    set(open);
    if (open) nav.querySelector('a')?.focus();
  });
  d.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { set(false); btn.focus(); }
  });
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  matchMedia('(min-width: 981px)').addEventListener('change', (m) => m.matches && set(false));
}

/* scroll reveal */
const reveals = [...d.querySelectorAll('.reveal')];
if (reveals.length) {
  if ('IntersectionObserver' in window && !reduce.matches) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => io.observe(el));
  } else reveals.forEach((el) => el.classList.add('in'));
}

/* decorative background videos: start after load, only on screen, never under reduced motion / data-saver */
const vids = [...d.querySelectorAll('[data-bgvideo]')];
if (vids.length) {
  const saver = navigator.connection && navigator.connection.saveData;
  const small = matchMedia('(max-width: 760px)');
  const webm = !!d.createElement('video').canPlayType('video/webm; codecs="vp9"');
  const paused = new WeakMap();
  const attach = (v) => {
    if (v.dataset.ready) return;
    v.disablePictureInPicture = true;
    const k = small.matches ? 'Sm' : 'Lg';
    v.src = v.dataset[(webm ? 'webm' : 'mp4') + k];
    v.dataset.ready = '1';
  };
  const label = (b, playing) => {
    b.setAttribute('aria-pressed', String(!playing));
    b.querySelector('[data-pause-label]').textContent = playing ? b.dataset.lPause : b.dataset.lPlay;
  };
  const start = (v) => { attach(v); return v.play().then(() => v.classList.add('is-playing')).catch(() => {}); };
  const btnFor = (v) => d.querySelector(`[data-pause="${v.id}"]`);
  const go = () => {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      const v = e.target;
      if (e.isIntersecting) { if (!paused.get(v) && !reduce.matches && !saver) start(v); }
      else if (!v.paused) v.pause();
    }), { threshold: 0.15 });
    vids.forEach((v) => {
      const b = btnFor(v);
      const auto = !reduce.matches && !saver;
      if (b) {
        b.hidden = false;
        label(b, auto);
        if (!auto) paused.set(v, true);
        b.addEventListener('click', () => {
          const playing = !v.paused;
          if (playing) { v.pause(); paused.set(v, true); label(b, false); }
          else { paused.set(v, false); start(v); label(b, true); }
        });
      }
      io.observe(v);
    });
    d.addEventListener('visibilitychange', () => { if (d.hidden) vids.forEach((v) => v.pause()); else vids.forEach((v) => { if (!paused.get(v) && v.dataset.ready) { const r = v.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) start(v); } }); });
  };
  const after = () => ('requestIdleCallback' in window ? requestIdleCallback(go, { timeout: 1500 }) : setTimeout(go, 400));
  if (d.readyState === 'complete') after(); else addEventListener('load', after, { once: true });
}

/* page-specific modules */
if (d.querySelector('[data-compare]')) import('./compare.js');
if (d.querySelector('[data-filter-root]')) import('./filter.js');
if (d.querySelector('[data-lightbox]')) import('./lightbox.js');
if (d.querySelector('[data-form]')) import('./form.js');
