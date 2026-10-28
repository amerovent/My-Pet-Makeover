// The meadow: every finished friend lives here. Tap one to feed it, hug it, or change its look.
import { go } from '../router.js';
import * as store from '../store.js';
import { petSVG } from '../pet.js';
import { sfx, say, speakText } from '../audio.js';
import { html, $, $$, sparklesAtEl, sparkles, confetti, showRewards, rand } from '../ui.js';
import { SPECIES, UNIVERSAL_FOODS } from '../data.js';

const SPACING = 24; // vmin between neighbours along the field
const ROW_CYCLE = [2, 1, 0, 1]; // front, middle, back, middle... so neighbours sit at different depths
const ROW_SCALE = [0.66, 0.82, 1];

export function mount(root, params) {
  const pets = store.get().pets;
  const vw = (window.innerWidth / Math.min(window.innerWidth, window.innerHeight)) * 100;
  const contentW = Math.max(1, pets.length) * SPACING + 8;
  const worldW = Math.max(vw, contentW + 6);
  const startX = Math.max(4, (worldW - contentW) / 2 + 2);
  let selected = null;
  let mode = 'dock'; // 'dock' | 'feed'

  const petHTML = pets
    .map((p, i) => {
      const row = ROW_CYCLE[i % ROW_CYCLE.length];
      const x = startX + i * SPACING;
      return `<div class="mpet r${row}" data-id="${p.id}" style="--x:${x}vmin;--s:${ROW_SCALE[row]};--dur:${rand(7, 12).toFixed(1)}s;--dl:-${rand(0, 8).toFixed(1)}s">
        <div class="mpet-in"><div class="mpet-bob">${petSVG(p.look, { uid: 'm' + i, cls: 'still' })}</div><div class="tag">${p.name}</div></div></div>`;
    })
    .join('');

  root.innerHTML = `
    <div class="sky"><i class="sun"></i><i class="cloud c1"></i><i class="cloud c2"></i><i class="cloud c3"></i></div>
    <svg class="hills" viewBox="0 0 1000 400" preserveAspectRatio="none">
      <path d="M0 140 C200 60 380 120 520 90 C700 50 860 120 1000 80 L1000 400 L0 400Z" fill="#b9ecb0"/>
      <path d="M0 220 C180 160 340 230 520 190 C700 150 860 220 1000 180 L1000 400 L0 400Z" fill="#9fe39a"/>
      <path d="M0 300 C220 250 420 320 600 280 C780 245 900 300 1000 270 L1000 400 L0 400Z" fill="#86d884"/>
      ${Array.from({ length: 26 }, () => `<circle cx="${rand(10, 990).toFixed(0)}" cy="${rand(150, 380).toFixed(0)}" r="${rand(3, 6).toFixed(1)}" fill="${['#ff7fb7', '#fff', '#ffe27a', '#c4a3ff'][Math.floor(rand(0, 4))]}"/>`).join('')}
    </svg>
    <i class="bfly b1">🦋</i><i class="bfly b2">🦋</i>
    <button class="icon-btn home" aria-label="home">🏠</button>
    <div class="world"><div class="field" style="width:${worldW}vmin">${petHTML}</div></div>
    <div class="dock" hidden></div>
    ${pets.length ? '' : '<div class="empty"><button class="btn-big make"><span class="ico">✨</span><span class="lbl">New friend</span></button></div>'}
    <button class="icon-btn plus" aria-label="new friend">➕</button>`;

  $('.home', root).addEventListener('click', () => { sfx('back'); go('home'); });
  $('.plus', root).addEventListener('click', () => { sfx('tap'); go('pick', { mode: 'makeover' }); });
  const mk = $('.make', root);
  if (mk) mk.addEventListener('click', () => { sfx('tap'); go('pick', { mode: 'makeover' }); });

  const dock = $('.dock', root);
  const petEl = (id) => $(`.mpet[data-id="${id}"]`, root);

  const drawDock = () => {
    if (!selected) { dock.hidden = true; return; }
    dock.hidden = false;
    const p = store.getPet(selected);
    if (mode === 'feed') {
      const foods = [...SPECIES[p.look.species].foods, ...UNIVERSAL_FOODS];
      dock.innerHTML = `<div class="dock-in foods">${foods.map((f) => `<button class="dbtn food" data-f="${f}">${f}</button>`).join('')}<button class="dbtn x" data-a="x">✖</button></div>`;
    } else {
      dock.innerHTML = `<div class="dock-in"><button class="dbtn" data-a="feed">🍎<span>Feed</span></button><button class="dbtn" data-a="hug">🤗<span>Hug</span></button><button class="dbtn" data-a="style">🎀<span>Style</span></button></div>`;
    }
  };

  const select = (id, { quiet } = {}) => {
    $$('.mpet.sel', root).forEach((e) => {
      e.classList.remove('sel');
      $('svg.pet', e).classList.add('still');
    });
    selected = id;
    mode = 'dock';
    const el = petEl(id);
    if (el) {
      el.classList.add('sel');
      $('svg.pet', el).classList.remove('still');
      const w = $('.world', root);
      const target = el.offsetLeft - w.clientWidth / 2 + el.offsetWidth / 2;
      w.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
      if (!quiet) {
        const p = store.getPet(id);
        sfx('boing');
        speakText(p.name);
        sparklesAtEl(el, 6);
      }
    }
    drawDock();
  };

  const eat = (food, btn) => {
    const el = petEl(selected);
    if (!el) return;
    const svg = $('svg.pet', el);
    const a = btn.getBoundingClientRect();
    const b = svg.getBoundingClientRect();
    const fly = html(`<span class="fly">${food}</span>`);
    fly.style.left = a.left + a.width / 2 + 'px';
    fly.style.top = a.top + 'px';
    document.body.appendChild(fly);
    const tx = b.left + b.width / 2 - (a.left + a.width / 2);
    const ty = b.top + b.height * 0.46 - a.top;
    sfx('whoosh');
    const anim = fly.animate(
      [{ transform: 'translate(0,0) scale(1)' }, { transform: `translate(${tx * 0.6}px,${ty - 90}px) scale(1.3)` }, { transform: `translate(${tx}px,${ty}px) scale(.5)`, opacity: 0.9 }],
      { duration: 650, easing: 'ease-in' }
    );
    anim.onfinish = () => {
      fly.remove();
      svg.classList.add('eating');
      sfx('munch');
      sparkles(b.left + b.width / 2, b.top + b.height * 0.3, 6, ['💖', '✨']);
      if (Math.random() < 0.5) say('yum');
      setTimeout(() => svg.classList.remove('eating'), 1100);
      const st = store.get();
      st.stats.feeds = (st.stats.feeds || 0) + 1;
      store.save();
      if (st.stats.feeds >= 1) store.earn('feed1');
      if (st.stats.feeds >= 10) store.earn('feed10');
      if (st.stats.feeds === 1 || st.stats.feeds === 10) setTimeout(() => showRewards(), 1300);
    };
  };

  dock.addEventListener('click', (e) => {
    const b = e.target.closest('.dbtn');
    if (!b || !selected) return;
    if (b.dataset.f) return eat(b.dataset.f, b);
    const a = b.dataset.a;
    if (a === 'feed') { mode = 'feed'; sfx('tap'); drawDock(); }
    else if (a === 'x') { mode = 'dock'; sfx('back'); drawDock(); }
    else if (a === 'hug') {
      const el = petEl(selected);
      sfx('hug');
      say('hug');
      el.classList.remove('squish');
      void el.offsetWidth;
      el.classList.add('squish');
      sparklesAtEl(el, 10, ['💖', '💕', '💗']);
    } else if (a === 'style') {
      sfx('tap');
      go('makeover', { petId: selected });
    }
  });

  $('.field', root).addEventListener('click', (e) => {
    const el = e.target.closest('.mpet');
    if (el) select(el.dataset.id);
    else if (selected && !e.target.closest('.dock')) {
      selected = null;
      $$('.mpet.sel', root).forEach((x) => {
        x.classList.remove('sel');
        $('svg.pet', x).classList.add('still');
      });
      drawDock();
    }
  });

  if (params.focus && petEl(params.focus)) {
    const el = petEl(params.focus);
    el.classList.add('dropin');
    setTimeout(() => select(params.focus, { quiet: true }), 100);
    if (params.welcome) {
      setTimeout(() => { sfx('sparkle'); say('meadow'); confetti(24); }, 500);
    }
  } else if (pets.length === 0) {
    setTimeout(() => say('meadow'), 400);
  }
  const t = setTimeout(() => showRewards(), 1500);
  return () => clearTimeout(t);
}
