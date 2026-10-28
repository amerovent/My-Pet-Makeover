// Step 2: brush the messy tufts flat, then blow dry the pet fluffy.
import { TOOLS } from '../art/stickers.js';
import { dragTrack, sparkles } from '../ui.js';
import { mix } from '../color.js';
import { createHint } from './hint.js';

const TUFTS = [
  [160, 70, -22], [200, 58, 0], [240, 70, 22], [82, 140, -72], [318, 140, 72], [130, 288, -76], [270, 288, 76], [302, 384, 62],
];
const TUFT_PATH = 'M-15 6 L-10 -26 L-3 -8 L3 -38 L10 -10 L17 -28 L16 6 Z';
const DRY_TARGET = 1500;

export function enter(env) {
  const { overlay, panel, sfx, say, wrap, look } = env;
  const n = TUFTS.length;
  const prog = new Array(n).fill(0);
  const ol = mix(look.fur, '#3b1030', 0.72);
  let phase = 1;
  let dry = 0;
  let finished = false;
  let lastSfx = 0;

  overlay.innerHTML =
    TUFTS.map(
      (t, i) => `<g class="tuft" data-i="${i}" transform="translate(${t[0]} ${t[1]}) rotate(${t[2]})"><path d="${TUFT_PATH}" fill="${look.fur}" stroke="${ol}" stroke-width="5" stroke-linejoin="round"/></g>`
    ).join('') + `<g class="wind" style="display:none"></g><g class="tool" style="display:none"><g class="sprite">${TOOLS.brush}</g></g>`;
  overlay.classList.add('live');
  panel.innerHTML = `<div class="goal"><div class="big-ico">✨</div><div class="dots">${TUFTS.map(() => '<i></i>').join('')}<i class="gap"></i><i></i><i></i><i></i></div></div>`;
  const dots = [...panel.querySelectorAll('.dots i:not(.gap)')];
  const tufts = [...overlay.querySelectorAll('.tuft')];
  const tool = overlay.querySelector('.tool');
  const sprite = tool.querySelector('.sprite');
  const wind = overlay.querySelector('.wind');

  const hint = createHint(overlay, () => {
    if (phase === 1) {
      const i = prog.findIndex((v) => v < 1);
      return i < 0 ? null : TUFTS[i];
    }
    return [200, 250];
  });

  const startDry = () => {
    phase = 2;
    say('dry');
    sfx('good');
    sprite.innerHTML = TOOLS.dryer;
  };

  const finish = () => {
    if (finished) return;
    finished = true;
    sfx('sparkle');
    say('fluffy');
    wind.style.display = 'none';
    wrap.classList.add('fluff');
    setTimeout(() => wrap.classList.remove('fluff'), 1600);
    const r = wrap.getBoundingClientRect();
    sparkles(r.left + r.width / 2, r.top + r.height * 0.4, 16);
    env.done();
  };

  const stopDrag = dragTrack(overlay, overlay, (x, y, d, down) => {
    hint.poke();
    tool.style.display = '';
    tool.setAttribute('transform', `translate(${x} ${y})`);
    const now = performance.now();
    if (phase === 1) {
      for (let i = 0; i < n; i++) {
        if (prog[i] >= 1) continue;
        const dist = Math.hypot(x - TUFTS[i][0], y - TUFTS[i][1]);
        if (dist > 52) continue;
        prog[i] = Math.min(1, prog[i] + (down ? 0.25 : 0) + d / 150);
        tufts[i].style.opacity = String(1 - prog[i] * 0.6);
        if (now - lastSfx > 100) {
          sfx('brush');
          lastSfx = now;
        }
        if (prog[i] >= 1) {
          tufts[i].classList.add('smooth');
          dots[i].classList.add('on');
          sfx('tap');
          if (prog.every((v) => v >= 1)) startDry();
        }
      }
    } else if (!finished && x > 50 && x < 350 && y > -10 && y < 480) {
      dry += d + (down ? 20 : 0);
      if (now - lastSfx > 160) {
        sfx('dryer');
        lastSfx = now;
      }
      wind.style.display = '';
      wind.setAttribute('transform', `translate(${x - 70} ${y + 8})`);
      wind.innerHTML = `<g stroke="#8fcaff" stroke-width="5" stroke-linecap="round" opacity=".8"><path d="M-30 -14 h-26"/><path d="M-38 6 h-34"/><path d="M-30 26 h-26"/></g>`;
      const k = Math.min(1, dry / DRY_TARGET);
      for (let j = 0; j < 3; j++) dots[n + j].classList.toggle('on', k >= (j + 1) / 3 - 0.01);
      if (dry >= DRY_TARGET) finish();
    }
  });

  if (env.isDone()) {
    overlay.innerHTML = '';
    return () => {};
  }
  say('brush');
  return () => {
    stopDrag();
    hint.stop();
    overlay.classList.remove('live');
    overlay.innerHTML = '';
    wrap.classList.remove('fluff', 'shake');
  };
}
