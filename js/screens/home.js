import { go } from '../router.js';
import * as store from '../store.js';
import { petSVG, defaultLook } from '../pet.js';
import { sfx, say, refreshMusic, speakText, stopVoice } from '../audio.js';
import { html, $, $$, sparklesAtEl } from '../ui.js';
import { SPECIES_ORDER } from '../data.js';
import { openParent } from './parent.js';

const TITLE_COLORS = ['#ff4d8d', '#ff9a3d', '#ffc21a', '#38c98f', '#3aa0ff', '#9b6dff'];

const letters = (word, off = 0) =>
  [...word]
    .map((ch, i) => `<span style="--c:${TITLE_COLORS[(i + off) % TITLE_COLORS.length]};--d:${(i + off) * 0.12}s">${ch === ' ' ? '&nbsp;' : ch}</span>`)
    .join('');

export function mount(root) {
  const st = store.get();
  const soundOn = st.settings.sfx || st.settings.voice;

  // Showcase: up to three saved pets (newest last), padded with unlocked species.
  const saved = st.pets.slice(-3).map((p) => ({ look: p.look, name: p.name }));
  const fill = SPECIES_ORDER.map((s) => ({ look: defaultLook(s), name: '' }));
  const crew = [...saved];
  for (const f of fill) if (crew.length < 3 && !crew.some((c) => c.look.species === f.look.species)) crew.push(f);
  while (crew.length < 3) crew.push({ look: defaultLook('puppy'), name: '' });

  root.innerHTML = `
    <div class="bg-float"><i></i><i></i><i></i><i></i><i></i><i></i></div>
    <button class="icon-btn mute" aria-label="sound">${soundOn ? '🔊' : '🔇'}</button>
    <h1 class="title"><span class="t1">${letters('My Pet', 0)}</span><span class="t2">${letters('Makeover', 2)}</span></h1>
    <div class="home-main">
    <div class="crew">${crew
      .map((c, i) => `<div class="crew-pet c${i}" data-name="${c.name}">${petSVG(c.look, { cls: 'bob', uid: 'h' + i })}</div>`)
      .join('')}</div>
    <div class="menu">
      <button class="btn-big play"><span class="ico">✨</span><span class="lbl">Play</span></button>
      <div class="menu-row">
        <button class="btn-round meadow"><span class="ico">🌷</span><span class="lbl">Meadow</span></button>
        <button class="btn-round coloring"><span class="ico">🎨</span><span class="lbl">Coloring</span></button>
        <button class="btn-round stickers"><span class="ico">⭐</span><span class="lbl">Stickers</span></button>
      </div>
    </div>
    </div>
    <button class="gear" aria-label="grown-ups"><svg viewBox="0 0 40 40"><circle class="ring" cx="20" cy="20" r="17" /></svg>⚙️</button>
  `;

  const go2 = (name, params) => () => {
    sfx('tap');
    go(name, params);
  };
  $('.play', root).addEventListener('click', go2('pick', { mode: 'makeover' }));
  $('.meadow', root).addEventListener('click', go2('meadow', {}));
  $('.coloring', root).addEventListener('click', go2('pick', { mode: 'coloring' }));
  $('.stickers', root).addEventListener('click', go2('stickers', {}));

  $('.mute', root).addEventListener('click', (e) => {
    const on = !(store.get().settings.sfx || store.get().settings.voice);
    store.setSetting('sfx', on);
    store.setSetting('voice', on);
    store.setSetting('music', on);
    refreshMusic();
    if (!on) stopVoice();
    e.currentTarget.textContent = on ? '🔊' : '🔇';
    if (on) sfx('good');
  });

  $$('.crew-pet', root).forEach((el) =>
    el.addEventListener('click', (e) => {
      sfx('boing');
      el.classList.remove('hop');
      void el.offsetWidth;
      el.classList.add('hop');
      sparklesAtEl(el, 6);
      if (el.dataset.name) speakText('Hi! I am ' + el.dataset.name);
    })
  );

  // Grown-up gate: hold the gear for 2.5 seconds.
  const gear = $('.gear', root);
  let timer = null;
  const startHold = (e) => {
    e.preventDefault();
    gear.classList.add('holding');
    timer = setTimeout(() => {
      gear.classList.remove('holding');
      openParent(() => go('home', {}, { push: false }));
    }, 2500);
  };
  const endHold = () => {
    clearTimeout(timer);
    gear.classList.remove('holding');
  };
  gear.addEventListener('pointerdown', startHold);
  gear.addEventListener('pointerup', endHold);
  gear.addEventListener('pointerleave', endHold);
  gear.addEventListener('pointercancel', endHold);

  // Greet once per app open.
  if (!window.__greeted) {
    window.__greeted = true;
    setTimeout(() => say('welcome'), 600);
  }
}
