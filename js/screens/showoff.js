// Ta-da moment, then (for a new friend) naming, then off to the meadow.
import { go } from '../router.js';
import * as store from '../store.js';
import { petSVG } from '../pet.js';
import { sfx, say, speakText } from '../audio.js';
import { html, $, $$, confetti, sparklesAtEl, shuffle, showRewards } from '../ui.js';
import { PET_NAMES } from '../data.js';

const ROWS = ['ABCDEFGHI', 'JKLMNOPQR', 'STUVWXYZ'];

export function mount(root, params) {
  const { look, wish, petId } = params;
  const isEdit = !!petId;
  let name = '';
  let phase = 'show';

  // Rewards: first makeover, species, wishes.
  if (!isEdit) {
    store.earn('first');
    store.earn(look.species);
  }
  const stars = 1 + (wish && wish.fur ? 1 : 0) + (wish && wish.item ? 1 : 0);
  if (wish && wish.fur && wish.item) store.earn('wishes');

  root.innerHTML = `
    <div class="spot-light"></div>
    <div class="so-stage"><div class="pet-wrap so"><div class="pet-slot">${petSVG(look, { uid: 'so', cls: 'dance' })}</div></div></div>
    <div class="stars">${[0, 1, 2].map((i) => `<span class="star ${i < stars ? 'on' : ''}" style="--d:${0.9 + i * 0.35}s">⭐</span>`).join('')}</div>
    <button class="nav next ready" aria-label="next">➡️</button>
    <div class="name-ui" hidden>
      <div class="name-show"></div>
      <div class="suggest"></div>
      <div class="kbd">${ROWS.map((r) => `<div class="krow">${[...r].map((c) => `<button class="key" data-k="${c}">${c}</button>`).join('')}${r === ROWS[2] ? '<button class="key wide" data-k="back">⌫</button>' : ''}</div>`).join('')}</div>
      <button class="nav ok" aria-label="done">✅</button>
    </div>`;

  const slot = $('.pet-slot', root);
  const nameUI = $('.name-ui', root);
  const nextBtn = $('.nav.next', root);

  setTimeout(() => {
    sfx('fanfare');
    say('tada');
    confetti(60);
  }, 250);
  [0, 1, 2].forEach((i) => {
    if (i < stars) setTimeout(() => sfx('good'), 900 + i * 350);
  });
  const rewardTimer = setTimeout(() => showRewards(), 2200);

  $('.pet-wrap', root).addEventListener('click', () => {
    sfx('boing');
    sparklesAtEl($('.pet-wrap', root), 8);
  });

  const showName = () => {
    const el = $('.name-show', root);
    el.innerHTML = name ? [...name].map((c) => `<span>${c}</span>`).join('') : '<span class="q">?</span>';
  };

  const startNaming = () => {
    phase = 'name';
    root.classList.add('naming');
    nameUI.hidden = false;
    nextBtn.style.display = 'none';
    $('.stars', root).style.display = 'none';
    slot.innerHTML = petSVG(look, { uid: 'so2', cls: 'bob' });
    say('name');
    const sg = $('.suggest', root);
    sg.innerHTML = shuffle(PET_NAMES).slice(0, 5).map((n) => `<button class="sug">${n}</button>`).join('');
    showName();
  };

  const finishSave = () => {
    let id = petId;
    if (isEdit) {
      store.updatePet(petId, { look });
    } else {
      const finalName = name || shuffle(PET_NAMES)[0];
      const pet = store.addPet(finalName, look);
      id = pet.id;
      const n = store.get().pets.length;
      if (n >= 3) store.earn('friends3');
      if (n >= 6) store.earn('friends6');
    }
    store.setDraft(null);
    go('meadow', { focus: id, welcome: !isEdit }, { replace: true });
  };

  nextBtn.addEventListener('click', () => {
    sfx('tap');
    if (isEdit) finishSave();
    else startNaming();
  });

  root.addEventListener('click', (e) => {
    if (phase !== 'name') return;
    const key = e.target.closest('.key');
    const sug = e.target.closest('.sug');
    if (key) {
      sfx('tap');
      const k = key.dataset.k;
      if (k === 'back') name = name.slice(0, -1);
      else if (name.length < 12) name += name ? k.toLowerCase() : k;
      showName();
    } else if (sug) {
      name = sug.textContent;
      sfx('sparkle');
      speakText(name);
      showName();
    } else if (e.target.closest('.nav.ok')) {
      sfx('good');
      finishSave();
    }
  });

  return () => clearTimeout(rewardTimer);
}
