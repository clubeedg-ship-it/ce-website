// Multi-step enquiry form. Works without JS (all steps visible, plain POST). With JS: steps, inline validation,
// fetch submit. Success is shown only after the server answers {ok:true}.
const form = document.querySelector('[data-form]');
const D = form.dataset;
const steps = [...form.querySelectorAll('[data-step]')];
const progress = [...form.querySelectorAll('[data-step-i]')];
const live = form.querySelector('[data-step-live]');
const back = form.querySelector('[data-back]');
const next = form.querySelector('[data-next]');
const submit = form.querySelector('[data-submit]');
const errsum = form.querySelector('[data-errsum]');
const errlist = form.querySelector('[data-errlist]');
const errNotice = form.querySelector('[data-error-notice]');
const preview = D.preview === '1';
let cur = 0;

const msg = { required: D.eRequired, email: D.eEmail, consent: D.eConsent, number: D.eNumber, choose: D.eChoose };
const fieldEl = (n) => form.querySelector(`[data-field="${n}"]`);

function setErr(name, code) {
  const f = fieldEl(name); if (!f) return null;
  const p = f.querySelector('.err');
  const ctl = f.querySelector('input,select,textarea');
  if (code) {
    f.classList.add('field--err'); p.textContent = msg[code] || code;
    f.querySelectorAll('input,select,textarea').forEach((c) => c.setAttribute('aria-invalid', 'true'));
  } else {
    f.classList.remove('field--err'); p.textContent = '';
    f.querySelectorAll('input,select,textarea').forEach((c) => c.removeAttribute('aria-invalid'));
  }
  return ctl;
}
const val = (n) => (form.elements[n]?.value || '').trim();

const rules = {
  sector: () => (form.querySelector('input[name=sector]:checked') ? '' : 'choose'),
  location: () => (val('location') ? '' : 'required'),
  size_m2: () => (!val('size_m2') || /^\d{1,6}$/.test(val('size_m2').replace(/[.\s]/g, '')) ? '' : 'number'),
  name: () => (val('name') ? '' : 'required'),
  email: () => (!val('email') ? 'required' : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val('email')) ? '' : 'email'),
  consent: () => (form.elements.consent.checked ? '' : 'consent'),
};
const stepOf = (name) => steps.findIndex((s) => s.querySelector(`[data-field="${name}"]`));

function validate(scope) {
  const bad = [];
  Object.entries(rules).forEach(([name, fn]) => {
    if (scope !== undefined && stepOf(name) !== scope) return;
    const code = fn();
    setErr(name, code);
    if (code) bad.push([name, code]);
  });
  return bad;
}
function showSummary(bad) {
  errlist.textContent = '';
  bad.forEach(([name, code]) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    const f = fieldEl(name);
    const lbl = f.querySelector('label,.lbl');
    a.href = '#' + (f.querySelector('input,select,textarea').id || '');
    a.textContent = (lbl ? lbl.childNodes[0].textContent.trim() : name) + ': ' + msg[code];
    a.addEventListener('click', (e) => { e.preventDefault(); goto(stepOf(name)); f.querySelector('input,select,textarea').focus(); });
    li.append(a); errlist.append(li);
  });
  errsum.hidden = !bad.length;
  if (bad.length) { errsum.focus(); }
}

function goto(n, focus) {
  cur = Math.max(0, Math.min(steps.length - 1, n));
  steps.forEach((s, i) => { s.hidden = i !== cur; });
  progress.forEach((p, i) => {
    p.classList.toggle('is-done', i < cur);
    if (i === cur) p.setAttribute('aria-current', 'step'); else p.removeAttribute('aria-current');
  });
  back.hidden = cur === 0;
  next.style.display = cur === steps.length - 1 ? 'none' : '';
  submit.hidden = cur !== steps.length - 1;
  live.textContent = D.stepOf.replace('{n}', cur + 1).replace('{t}', steps.length) + ': ' + steps[cur].querySelector('legend').textContent;
  if (focus) {
    const lg = steps[cur].querySelector('legend'); lg.tabIndex = -1; lg.focus({ preventScroll: true });
    steps[cur].scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
}

steps.forEach((s, i) => { if (i) s.hidden = true; });
goto(0);
form.addEventListener('input', (e) => { const f = e.target.closest('[data-field]'); if (f && f.classList.contains('field--err')) { const n = f.dataset.field; if (rules[n]) setErr(n, rules[n]()); } });
next.addEventListener('click', () => { const bad = validate(cur); showSummary(bad); if (!bad.length) goto(cur + 1, true); else { const f = fieldEl(bad[0][0]).querySelector('input,select,textarea'); f.focus(); } });
back.addEventListener('click', () => { errsum.hidden = true; goto(cur - 1, true); });
// Enter inside a text input should advance rather than submit early
form.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.matches('input:not([type=checkbox]):not([type=radio])') && cur < steps.length - 1) { e.preventDefault(); next.click(); } });

/* time-trap token (server verifies it was issued ≥3 s before the submit) */
if (!preview) fetch(D.endpoint + '?token=1', { headers: { Accept: 'application/json' }, credentials: 'omit' }).then((r) => r.json()).then((j) => { if (j && j.tk) form.querySelector('[data-tk]').value = j.tk; }).catch(() => {});

function fail(text) {
  errNotice.querySelector('[data-error-text]').textContent = text;
  errNotice.hidden = false; errNotice.focus();
}
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errNotice.hidden = true;
  const bad = validate();
  showSummary(bad);
  if (bad.length) { goto(stepOf(bad[0][0])); fieldEl(bad[0][0]).querySelector('input,select,textarea').focus(); return; }
  if (preview) { const n = form.querySelector('[data-preview-notice]'); n.scrollIntoView({ block: 'center' }); n.tabIndex = -1; n.focus(); return; }
  const label = submit.firstChild.textContent;
  submit.disabled = true; submit.firstChild.textContent = D.lSending; form.setAttribute('aria-busy', 'true');
  try {
    const res = await fetch(D.endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }, credentials: 'omit' });
    let j = null; try { j = await res.json(); } catch {}
    if (res.ok && j && j.ok === true) { location.assign(D.thanks); return; }
    if (res.status === 422 && j && j.errors) {
      const list = Object.entries(j.errors).filter(([n]) => fieldEl(n));
      list.forEach(([n, c]) => setErr(n, c));
      if (list.length) { showSummary(list); goto(stepOf(list[0][0])); fieldEl(list[0][0]).querySelector('input,select,textarea').focus(); }
      else fail(D.eServer);
    } else if (res.status === 429) fail(D.eRate);
    else fail(D.eServer);
  } catch { fail(D.eNetwork); }
  submit.disabled = false; submit.firstChild.textContent = label; form.removeAttribute('aria-busy');
});
