import { go } from '../router.js';
import * as store from '../store.js';
import { petSVG, defaultLook } from '../pet.js';
import { sfx, say } from '../audio.js';
import { html, $, $$ } from '../ui.js';
import { SPECIES_ORDER, SPECIES } from '../data.js';

export function mount(root, params) {
  const mode = params.mode || 'makeover';
  const st = store.get();
  const draft = mode === 'makeover' ? st.draft : null;

  const card = (sp) => {
    const unlocked = store.isUnlocked(sp);
    const locked = mode === 'makeover' && !unlocked;
    return `<button class="card ${locked ? 'locked' : ''}" data-sp="${sp}">
      <div class="card-pet">${petSVG(defaultLook(sp), { cls: locked ? '' : 'bob', uid: 'k' + sp })}</div>
      ${locked ? '<div class="lock">🔒<span>🎨</span></div>' : ''}
      <div class="card-name">${SPECIES[sp].label}</div>
    </button>`;
  };

  root.innerHTML = `
    <button class="icon-btn home" aria-label="home">🏠</button>
    <h2 class="hdr">${mode === 'coloring' ? '🎨' : '✨'}</h2>
    <div class="cards">
      ${draft ? `<div class="card-wrap"><button class="card draft"><div class="card-pet">${petSVG(draft.look, { cls: 'bob', uid: 'kdraft' })}</div><div class="card-name">Keep going!</div></button><button class="icon-btn mini discard" aria-label="start over">✖</button></div>` : ''}
      ${SPECIES_ORDER.map(card).join('')}
    </div>`;

  $('.home', root).addEventListener('click', () => {
    sfx('back');
    go('home');
  });

  $$('.card[data-sp]', root).forEach((el) =>
    el.addEventListener('click', () => {
      const sp = el.dataset.sp;
      sfx('tap');
      if (mode === 'coloring') return go('coloring', { species: sp });
      if (!store.isUnlocked(sp)) {
        say('locked');
        setTimeout(() => go('coloring', { species: sp }), 1500);
        return;
      }
      store.setDraft(null);
      go('makeover', { species: sp });
    })
  );
  const dr = $('.card.draft', root);
  if (dr) dr.addEventListener('click', () => { sfx('tap'); go('makeover', { resume: true }); });
  const ds = $('.discard', root);
  if (ds) ds.addEventListener('click', () => { store.setDraft(null); go('pick', params, { push: false }); });

  setTimeout(() => say(mode === 'coloring' ? 'colorPage' : 'pick'), 300);
}
