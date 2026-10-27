// Coloring page for one animal. Finish coloring every part to unlock that animal.
import { go } from '../router.js';
import * as store from '../store.js';
import { petSVG, defaultLook } from '../pet.js';
import { sfx, say } from '../audio.js';
import { html, $, $$, confetti, sparkles, showRewards } from '../ui.js';
import { SPECIES } from '../data.js';

const PALETTE = ['#ff4d6d', '#ff9a3d', '#ffe27a', '#7be0b8', '#35c9b4', '#6aa9ff', '#c4a3ff', '#ff7fb7', '#b9794a', '#f0c58c', '#4a3a44', '#ffb8d6'];

export function mount(root, params) {
  const sp = params.species || 'puppy';
  const fills = {};
  let cur = PALETTE[0];
  let finished = false;

  root.innerHTML = `
    <button class="icon-btn home" aria-label="back">⬅️</button>
    <div class="col-stage"><div class="pet-wrap"><div class="pet-slot"></div></div></div>
    <div class="col-side">
      <div class="goal"><div class="dots"></div></div>
      <div class="palette">${PALETTE.map((c, i) => `<button class="chip swatch ${i === 0 ? 'sel' : ''}" data-v="${c}" style="background:${c}"></button>`).join('')}</div>
    </div>`;

  const slot = $('.pet-slot', root);
  const draw = () => {
    slot.innerHTML = petSVG(defaultLook(sp), { mode: 'color', fills, uid: 'cp' });
  };
  draw();
  // The tiny inner-ear regions are optional so nobody gets stuck hunting for them.
  const regions = [...new Set($$('.reg', slot).map((g) => g.dataset.r))].filter((r) => r !== 'earin');
  const dotsEl = $('.dots', root);
  dotsEl.innerHTML = regions.map(() => '<i></i>').join('');
  const refreshDots = () => {
    const n = regions.filter((r) => fills[r]).length;
    $$('i', dotsEl).forEach((d, i) => d.classList.toggle('on', i < n));
    return n;
  };

  $('.home', root).addEventListener('click', () => {
    sfx('back');
    go(store.isUnlocked(sp) ? 'pick' : 'pick', { mode: 'coloring' });
  });

  $('.palette', root).addEventListener('click', (e) => {
    const c = e.target.closest('.chip');
    if (!c) return;
    cur = c.dataset.v;
    $$('.palette .chip', root).forEach((x) => x.classList.toggle('sel', x === c));
    sfx('tap');
  });

  slot.addEventListener('pointerdown', (e) => {
    const g = e.target.closest('.reg');
    if (!g || finished) return;
    const r = g.dataset.r;
    fills[r] = cur;
    $$(`.reg[data-r="${r}"]`, slot).forEach((el) => el.setAttribute(el.dataset.line ? 'stroke' : 'fill', cur));
    sfx('paint');
    sparkles(e.clientX, e.clientY, 4, ['✨']);
    if (refreshDots() === regions.length) complete();
  });

  const complete = () => {
    finished = true;
    store.earn('color_' + sp);
    const fresh = store.unlock(sp);
    sfx('fanfare');
    say('colorDone');
    confetti(60);
    setTimeout(() => {
      const modal = html(`<div class="modal unlock"><div class="sheet">
        <div class="pet-wrap">${petSVG(defaultLook(sp), { uid: 'un', cls: 'dance' })}</div>
        <div class="unlock-text">${fresh ? '🔓' : '🎉'} ${SPECIES[sp].label}!</div>
        <button class="nav ok">✨</button></div></div>`);
      document.body.appendChild(modal);
      if (fresh) { sfx('unlock'); say('unlock'); }
      $('.ok', modal).addEventListener('click', () => {
        modal.remove();
        showRewards().then(() => go(fresh ? 'makeover' : 'pick', fresh ? { species: sp } : { mode: 'coloring' }));
      });
    }, 1400);
  };

  setTimeout(() => say('colorPage'), 300);
}
