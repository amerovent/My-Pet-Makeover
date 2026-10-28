import { go } from './router.js';
import { initAudio } from './audio.js';
import { get } from './store.js';

// Audio needs a tap before the browser allows sound.
const unlock = () => initAudio();
document.addEventListener('pointerdown', unlock, { once: false, capture: true });

// Kids' tablet hygiene: no context menu, no text selection, no pinch zoom, no pull-to-refresh.
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('gesturestart', (e) => e.preventDefault());

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

// Cheap tablets: if the device looks weak (or a grown-up asked), turn off decorative animation loops.
export function applyLite() {
  const pref = get().settings.lite;
  const weak = (navigator.deviceMemory && navigator.deviceMemory <= 3) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
  const forced = new URLSearchParams(location.search).get('lite');
  const on = forced !== null ? forced === '1' : pref === null || pref === undefined ? !!weak : !!pref;
  document.documentElement.classList.toggle('lite', on);
}
window.applyLite = applyLite;
applyLite();

history.replaceState({ name: 'home', params: {} }, '');
go('home', {}, { push: false });
