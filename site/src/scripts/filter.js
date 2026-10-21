// Sector filter on the projects index. Without JS every project is simply listed.
const root = document.querySelector('[data-filter-root]');
const bar = root.querySelector('[data-filters]');
const cards = [...root.querySelectorAll('.pgrid .card')];
const count = root.querySelector('[data-count]');
const buttons = [...bar.querySelectorAll('[data-filter]')];
const apply = (f, push) => {
  let n = 0;
  cards.forEach((c) => { const show = f === 'all' || c.dataset.sector === f; c.hidden = !show; if (show) n++; });
  buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === f)));
  count.textContent = count.dataset.template.replace('{n}', n);
  if (push) history.replaceState(null, '', f === 'all' ? location.pathname : '#' + f);
};
bar.hidden = false;
buttons.forEach((b) => b.addEventListener('click', () => apply(b.dataset.filter, true)));
const initial = location.hash.slice(1);
apply(buttons.some((b) => b.dataset.filter === initial) ? initial : 'all', false);
