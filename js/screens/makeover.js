// The makeover flow: bath -> brush -> style -> color -> nails -> dress-up, then the show-off.
import { go } from '../router.js';
import * as store from '../store.js';
import { petSVG, defaultLook, itemThumb } from '../pet.js';
import { sfx, say } from '../audio.js';
import { html, $, $$, sparklesAtEl, confetti, pick } from '../ui.js';
import { STEPS, FUR_COLORS, ITEMS, SLOTS } from '../data.js';
import { TOOLS } from '../art/stickers.js';
import * as bath from '../steps/bath.js';
import * as brush from '../steps/brush.js';
import * as panels from '../steps/panels.js';

const STEP_MODULES = [bath.enter, brush.enter, panels.style, panels.color, panels.nails, panels.dress];

const WISH_FUR = ['#ff7fb7', '#c4a3ff', '#8fcaff', '#9fe8cb', '#ffe27a', '#ff9a8b'];

const stepIcon = (s) =>
  s.id === 'brush' ? `<svg viewBox="-60 -52 150 112" class="step-svg">${TOOLS.brush}</svg>` : s.icon;

const clone = (o) => JSON.parse(JSON.stringify(o));

function makeWish() {
  const slot = pick(['hat', 'outfit', 'glasses', 'neck']);
  return { fur: pick(WISH_FUR), slot, id: pick(ITEMS[slot]).id };
}

export const wishState = (look, wish) => ({
  fur: look.fur === wish.fur,
  item: !!(look[wish.slot] && look[wish.slot].id === wish.id),
});

export function mount(root, params) {
  const edit = params.petId ? store.getPet(params.petId) : null;
  const draft = params.resume ? store.get().draft : null;
  const look = edit ? clone(edit.look) : draft ? clone(draft.look) : defaultLook(params.species);
  const wish = edit ? null : draft ? draft.wish : makeWish();
  const done = new Set(edit ? [0, 1] : draft ? draft.done : []);
  let step = draft ? draft.step : edit ? 2 : 0;
  let stepCleanup = null;
  let wishDone = wish ? wishState(look, wish) : { fur: false, item: false };

  root.innerHTML = `
    <div class="mk-top">
      <button class="icon-btn home" aria-label="home">🏠</button>
      <div class="steps">${STEPS.map((s, i) => `<button class="step" data-i="${i}">${stepIcon(s)}<b class="tick">✓</b></button>`).join('')}</div>
      <div class="wishes ${wish ? '' : 'off'}">
        <span class="bubble">💭</span>
        <span class="wish w-fur"><i style="background:${wish ? wish.fur : '#fff'}"></i><b>✓</b></span>
        <span class="wish w-item">${wish ? itemThumb(wish.slot, wish.id, ITEMS[wish.slot].find((x) => x.id === wish.id).def) : ''}<b>✓</b></span>
      </div>
    </div>
    <div class="mk-main">
      <div class="mk-stage"><div class="pet-wrap"><div class="pet-slot"></div><svg class="overlay" viewBox="0 -60 400 560"></svg></div></div>
      <div class="mk-panel"></div>
    </div>
    <button class="nav back" aria-label="back">⬅️</button>
    <button class="nav next" aria-label="next">➡️</button>`;

  const slot = $('.pet-slot', root);
  const wrap = $('.pet-wrap', root);
  const overlay = $('.overlay', root);
  const panel = $('.mk-panel', root);
  const nextBtn = $('.nav.next', root);
  const backBtn = $('.nav.back', root);
  const stepBtns = $$('.step', root);

  const render = () => {
    slot.innerHTML = petSVG(look, { uid: 'mk', cls: 'bob' });
  };

  const persist = () => {
    if (!edit) store.setDraft({ look: clone(look), step, done: [...done], wish, species: look.species });
  };

  const refreshWishes = () => {
    if (!wish) return;
    const w = wishState(look, wish);
    $('.w-fur', root).classList.toggle('got', w.fur);
    $('.w-item', root).classList.toggle('got', w.item);
    if ((w.fur && !wishDone.fur) || (w.item && !wishDone.item)) {
      sfx('good');
      say('wish');
      sparklesAtEl($('.wishes', root), 8);
    }
    wishDone = w;
  };

  const refreshNav = () => {
    stepBtns.forEach((b, i) => {
      b.classList.toggle('cur', i === step);
      b.classList.toggle('done', done.has(i));
    });
    backBtn.style.visibility = step > 0 ? 'visible' : 'hidden';
    nextBtn.classList.toggle('ready', done.has(step));
    root.dataset.step = STEPS[step].id;
  };

  const markDone = () => {
    if (done.has(step)) return;
    done.add(step);
    store.earn(STEPS[step].id);
    sfx('good');
    refreshNav();
    persist();
    sparklesAtEl(stepBtns[step], 8);
    if (['bath', 'brush'].includes(STEPS[step].id)) setTimeout(() => say('next'), 1700);
  };

  const env = {
    overlay, panel, wrap, look,
    sfx, say,
    done: markDone,
    isDone: () => false,
    // panel steps call used() after any change: that counts as completing the step.
    used: () => markDone(),
    set(patch) {
      Object.assign(look, patch);
      render();
      refreshWishes();
      persist();
    },
    petHop() {
      wrap.classList.remove('hop');
      void wrap.offsetWidth;
      wrap.classList.add('hop');
    },
  };

  const enterStep = (i) => {
    if (stepCleanup) stepCleanup();
    stepCleanup = null;
    step = i;
    panel.innerHTML = '';
    overlay.innerHTML = '';
    refreshNav();
    persist();
    stepCleanup = STEP_MODULES[i](env) || null;
    // Bath/brush need a fresh, un-dirtied look but panel steps keep the pet interactive.
    panel.classList.toggle('goal-mode', i < 2);
  };

  $('.home', root).addEventListener('click', () => {
    sfx('back');
    go('home');
  });
  stepBtns.forEach((b) =>
    b.addEventListener('click', () => {
      sfx('tap');
      enterStep(+b.dataset.i);
    })
  );
  backBtn.addEventListener('click', () => {
    sfx('back');
    if (step > 0) enterStep(step - 1);
  });
  nextBtn.addEventListener('click', () => {
    sfx('tap');
    if (step < STEPS.length - 1) return enterStep(step + 1);
    finish();
  });

  const finish = () => {
    const w = wish ? wishState(look, wish) : null;
    go('showoff', { look: clone(look), wish: w, petId: edit ? edit.id : null }, { replace: true });
  };

  render();
  refreshWishes();
  enterStep(step);

  return () => {
    if (stepCleanup) stepCleanup();
  };
}
