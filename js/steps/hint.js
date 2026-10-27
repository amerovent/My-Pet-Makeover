// A wiggling hand that shows a toddler where to touch next, after a few seconds of nothing happening.
import { TOOLS } from '../art/stickers.js';

export function createHint(overlay, getTarget, idleMs = 3800) {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('class', 'hint');
  g.style.display = 'none';
  g.innerHTML = `<g class="hand-wiggle">${TOOLS.hand}</g>`;
  overlay.appendChild(g);
  let timer = null;
  const show = () => {
    const t = getTarget();
    if (!t) return;
    g.setAttribute('transform', `translate(${t[0] + 10} ${t[1] + 46})`);
    g.style.display = '';
  };
  const poke = () => {
    g.style.display = 'none';
    clearTimeout(timer);
    timer = setTimeout(function again() {
      show();
      timer = setTimeout(again, idleMs + 2000);
    }, idleMs);
  };
  poke();
  return { poke, stop: () => { clearTimeout(timer); g.remove(); } };
}
