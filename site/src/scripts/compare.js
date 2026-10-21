// Before/after slider. The visually hidden <input type=range> provides keyboard, touch and pointer handling.
document.querySelectorAll('[data-compare]').forEach((el) => {
  const input = el.querySelector('input[type=range]');
  const update = () => {
    el.style.setProperty('--pos', input.value + '%');
    input.setAttribute('aria-valuetext', input.value + '%');
  };
  input.addEventListener('input', update);
  el.classList.add('is-ready');
  update();
});
