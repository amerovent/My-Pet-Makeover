// Shared UI bits: effects (confetti, sparkles), the sticker popup, and small DOM helpers.
import { takeRewards } from './store.js';
import { STICKERS } from './data.js';
import { stickerSVG } from './art/stickers.js';
import { sfx, say } from './audio.js';

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function html(str) {
  const t = document.createElement('template');
  t.innerHTML = str.trim();
  return t.content.firstElementChild;
}

export const rand = (a, b) => a + Math.random() * (b - a);
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const COLORS = ['#ff7fb7', '#ffd24d', '#6aa9ff', '#7be0b8', '#c4a3ff', '#ff9a3d'];

export function confetti(n = 46) {
  const layer = html('<div class="fx-layer"></div>');
  for (let i = 0; i < n; i++) {
    const p = document.createElement('i');
    p.style.cssText = `left:${rand(0, 100)}%;background:${pick(COLORS)};--dx:${rand(-30, 30)}vmin;--rot:${rand(180, 900)}deg;animation-delay:${rand(0, 0.6)}s;animation-duration:${rand(1.8, 3)}s;width:${rand(1, 2)}vmin;height:${rand(1.4, 3)}vmin;`;
    layer.appendChild(p);
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 3800);
}

// A burst of little stars/hearts at a screen position.
export function sparkles(x, y, n = 8, glyphs = ['✨', '⭐', '💖']) {
  const layer = html('<div class="fx-layer sp"></div>');
  for (let i = 0; i < n; i++) {
    const s = document.createElement('b');
    s.textContent = pick(glyphs);
    const a = rand(0, Math.PI * 2);
    const d = rand(6, 16);
    s.style.cssText = `left:${x}px;top:${y}px;--dx:${Math.cos(a) * d}vmin;--dy:${Math.sin(a) * d - 4}vmin;font-size:${rand(2.4, 4.2)}vmin;animation-delay:${rand(0, 0.12)}s`;
    layer.appendChild(s);
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 1400);
}

export function sparklesAtEl(el, n, glyphs) {
  const r = el.getBoundingClientRect();
  sparkles(r.left + r.width / 2, r.top + r.height / 2, n, glyphs);
}

// Show all newly earned stickers in one popup. Resolves when it is dismissed (tap anywhere).
export function showRewards() {
  const ids = takeRewards();
  if (!ids.length) return Promise.resolve();
  return new Promise((resolve) => {
    const list = ids.map((id) => STICKERS.find((s) => s.id === id)).filter(Boolean);
    const size = list.length === 1 ? 'one' : list.length <= 4 ? 'few' : 'many';
    const el = html(`<div class="reward"><div class="reward-card ${size}">
      <div class="reward-grid">${list.map((st, i) => `<div class="reward-sticker" style="--d:${i * 0.12}s">${stickerSVG(st.shape, st.c)}</div>`).join('')}</div>
      <div class="reward-text">${list.length === 1 ? 'New sticker!' : list.length + ' new stickers!'}</div></div></div>`);
    document.body.appendChild(el);
    sfx('sticker');
    say('sticker');
    confetti(26);
    let closed = false;
    const done = () => {
      if (closed) return;
      closed = true;
      el.remove();
      resolve();
    };
    setTimeout(() => el.addEventListener('pointerdown', done, { once: true }), 500);
    setTimeout(done, 7000);
  });
}

// Pointer position -> SVG coordinates of an element with a viewBox.
export function svgPoint(svg, ev) {
  const pt = svg.createSVGPoint();
  pt.x = ev.clientX;
  pt.y = ev.clientY;
  const m = svg.getScreenCTM();
  return m ? pt.matrixTransform(m.inverse()) : { x: 0, y: 0 };
}

// Run fn(x, y, movedDistance) while the pointer is down/dragging on `el` (an element with a pointer capture).
export function dragTrack(el, svg, fn) {
  let last = null;
  const move = (ev, down) => {
    const p = svgPoint(svg, ev);
    const d = last ? Math.hypot(p.x - last.x, p.y - last.y) : 0;
    last = p;
    fn(p.x, p.y, d, down);
  };
  const onDown = (ev) => {
    ev.preventDefault();
    try { el.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
    last = null;
    el._down = true;
    move(ev, true);
  };
  const onMove = (ev) => {
    if (el._down) move(ev, false);
  };
  const onUp = () => {
    el._down = false;
    last = null;
  };
  el.addEventListener('pointerdown', onDown);
  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerup', onUp);
  el.addEventListener('pointercancel', onUp);
  return () => {
    el.removeEventListener('pointerdown', onDown);
    el.removeEventListener('pointermove', onMove);
    el.removeEventListener('pointerup', onUp);
    el.removeEventListener('pointercancel', onUp);
  };
}
