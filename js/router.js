// Tiny screen router. Each screen module exports mount(root, params) and may return a cleanup function.
import { stopVoice } from './audio.js';

const loaders = {
  home: () => import('./screens/home.js'),
  pick: () => import('./screens/pick.js'),
  makeover: () => import('./screens/makeover.js'),
  showoff: () => import('./screens/showoff.js'),
  meadow: () => import('./screens/meadow.js'),
  coloring: () => import('./screens/coloring.js'),
  stickers: () => import('./screens/stickers.js'),
};

let cleanup = null;
let token = 0;

export async function go(name, params = {}, { push = true, replace = false } = {}) {
  const my = ++token;
  if (cleanup) {
    try { cleanup(); } catch (e) { console.error(e); }
    cleanup = null;
  }
  stopVoice();
  document.querySelectorAll('.reward, .fx-layer, .modal').forEach((n) => n.remove());
  const mod = await loaders[name]();
  if (my !== token) return; // a newer navigation won
  const root = document.getElementById('app');
  root.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen s-' + name;
  root.appendChild(screen);
  cleanup = mod.mount(screen, params) || null;
  try {
    if (replace) history.replaceState({ name, params }, '');
    else if (push) history.pushState({ name, params }, '');
  } catch (e) { /* params not cloneable: ignore */ }
}

window.addEventListener('popstate', (e) => {
  const s = e.state;
  go(s && s.name ? s.name : 'home', (s && s.params) || {}, { push: false });
});
