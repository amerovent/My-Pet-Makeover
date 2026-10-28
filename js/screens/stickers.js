import { go } from '../router.js';
import * as store from '../store.js';
import { STICKERS } from '../data.js';
import { stickerSVG } from '../art/stickers.js';
import { sfx } from '../audio.js';
import { $, $$, sparklesAtEl } from '../ui.js';

export function mount(root) {
  const have = store.get().stickers;
  root.innerHTML = `
    <button class="icon-btn home" aria-label="home">🏠</button>
    <h2 class="hdr">⭐ ${have.length}<small> / ${STICKERS.length}</small></h2>
    <div class="sticker-grid">${STICKERS.map((s) => {
      const got = have.includes(s.id);
      return `<div class="sticker ${got ? 'got' : ''}" data-id="${s.id}">${stickerSVG(s.shape, s.c, !got)}<span>${s.tip}</span></div>`;
    }).join('')}</div>`;
  $('.home', root).addEventListener('click', () => { sfx('back'); go('home'); });
  $$('.sticker', root).forEach((el) =>
    el.addEventListener('click', () => {
      if (el.classList.contains('got')) { sfx('sticker'); sparklesAtEl(el, 8); }
      else sfx('tap');
      el.classList.remove('wiggle'); void el.offsetWidth; el.classList.add('wiggle');
    })
  );
}
