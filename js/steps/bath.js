// Step 1: scrub the mud into suds, then pop the suds.
import { TOOLS } from '../art/stickers.js';
import { dragTrack, svgPoint, sparkles } from '../ui.js';
import { createHint } from './hint.js';

const SPOTS = [
  [158, 104], [246, 112], [104, 206], [296, 214], [200, 322], [132, 346], [270, 350], [178, 398], [224, 402], [158, 452], [242, 452],
];
const MUD = `<circle r="21" fill="#8a5a3a"/><circle cx="-13" cy="7" r="12" fill="#9c6b46"/><circle cx="14" cy="-7" r="13" fill="#7a4c30"/><circle cx="-4" cy="-8" r="5" fill="#b07f58" opacity=".7"/>`;
const SUDS = `<circle r="21" fill="#fff" stroke="#a9dcff" stroke-width="3"/><circle cx="-16" cy="-9" r="14" fill="#fff" stroke="#a9dcff" stroke-width="3"/><circle cx="15" cy="-11" r="15" fill="#fff" stroke="#a9dcff" stroke-width="3"/><circle cx="9" cy="15" r="13" fill="#fff" stroke="#a9dcff" stroke-width="3"/><circle cx="-13" cy="13" r="12" fill="#fff" stroke="#a9dcff" stroke-width="3"/><circle cx="-8" cy="-12" r="4" fill="#d8f0ff"/><circle cx="13" cy="-16" r="4" fill="#d8f0ff"/>`;

export function enter(env) {
  const { overlay, panel, sfx, say, wrap } = env;
  const n = SPOTS.length;
  const prog = new Array(n).fill(0);
  const popped = new Array(n).fill(false);
  let phase = 1;
  let finished = false;
  let lastSfx = 0;

  overlay.innerHTML =
    SPOTS.map((p, i) => `<g class="spot" data-i="${i}" transform="translate(${p[0]} ${p[1]})"><g class="mud">${MUD}</g><g class="suds" style="opacity:0;transform:scale(.3)">${SUDS}</g></g>`).join('') +
    `<g class="tool" style="display:none"><g class="sprite">${TOOLS.sponge}</g></g>`;
  overlay.classList.add('live');
  panel.innerHTML = `<div class="goal"><div class="big-ico">🧼</div><div class="dots">${SPOTS.map(() => '<i></i>').join('')}</div></div>`;
  const dots = [...panel.querySelectorAll('.dots i')];
  const spots = [...overlay.querySelectorAll('.spot')];
  const tool = overlay.querySelector('.tool');

  const hint = createHint(overlay, () => {
    const i = phase === 1 ? prog.findIndex((v) => v < 1) : popped.findIndex((v) => !v);
    return i < 0 ? null : SPOTS[i];
  });

  const update = (i) => {
    const s = spots[i];
    const p = prog[i];
    s.querySelector('.mud').style.opacity = String(Math.max(0, 1 - p * 1.1));
    const suds = s.querySelector('.suds');
    suds.style.opacity = String(Math.min(1, p * 1.6));
    suds.style.transform = `scale(${0.3 + 0.7 * p})`;
  };

  const finishPhase1 = () => {
    phase = 2;
    say('rinse');
    sfx('good');
    panel.querySelector('.big-ico').textContent = '💦';
    dots.forEach((d) => d.classList.remove('on'));
    spots.forEach((s) => s.classList.add('ready'));
    tool.querySelector('.sprite').innerHTML = '';
  };

  const popSpot = (i) => {
    popped[i] = true;
    sfx('pop');
    const s = spots[i];
    s.classList.add('pop');
    const r = s.getBoundingClientRect();
    sparkles(r.left + r.width / 2, r.top + r.height / 2, 5, ['✨', '💦', '⭐']);
    dots[i].classList.add('on');
    if (popped.every(Boolean)) finish();
  };

  const finish = () => {
    if (finished) return;
    finished = true;
    sfx('sparkle');
    say('clean');
    wrap.classList.add('shake');
    setTimeout(() => wrap.classList.remove('shake'), 1200);
    const r = wrap.getBoundingClientRect();
    sparkles(r.left + r.width / 2, r.top + r.height * 0.4, 14);
    env.done();
  };

  const stopDrag = dragTrack(overlay, overlay, (x, y, d, down) => {
    hint.poke();
    tool.style.display = '';
    tool.setAttribute('transform', `translate(${x} ${y})`);
    const now = performance.now();
    for (let i = 0; i < n; i++) {
      const dist = Math.hypot(x - SPOTS[i][0], y - SPOTS[i][1]);
      if (dist > 46) continue;
      if (phase === 1 && prog[i] < 1) {
        prog[i] = Math.min(1, prog[i] + (down ? 0.2 : 0) + d / 200);
        update(i);
        if (now - lastSfx > 110) {
          sfx('scrub');
          lastSfx = now;
        }
        if (prog[i] >= 1) {
          dots[i].classList.add('on');
          sfx('tap');
          if (prog.every((v) => v >= 1)) finishPhase1();
        }
      } else if (phase === 2 && !popped[i]) {
        popSpot(i);
      }
    }
  });

  if (env.isDone()) {
    // Revisiting a finished step: show a clean pet.
    overlay.innerHTML = '';
    return () => {};
  }
  say('bath');
  return () => {
    stopDrag();
    hint.stop();
    overlay.classList.remove('live');
    overlay.innerHTML = '';
  };
}
