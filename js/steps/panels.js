// Steps 3-6: pick-from-a-grid panels (style, color, nails, dress-up).
import {
  HAIR_STYLES, HAIR_COLORS, EYE_COLORS, FUR_COLORS, PATTERNS, NAIL_COLORS, ACCENT_COLORS, SLOTS, SLOT_ICON, ITEMS,
} from '../data.js';
import { hairThumb, itemThumb, patternDefs } from '../pet.js';
import { html, $, $$, sparklesAtEl } from '../ui.js';

const swatch = (c, sel) =>
  `<button class="chip swatch ${sel ? 'sel' : ''}" data-v="${c}" style="${c === 'rainbow' ? 'background:linear-gradient(135deg,#ff7fb7,#ffd24d,#7be0b8,#6aa9ff)' : `background:${c}`}"></button>`;

const thumb = (svg, v, sel) => `<button class="chip thumb ${sel ? 'sel' : ''}" data-v="${v}">${svg}</button>`;

const none = (sel, v = 'none') => `<button class="chip none ${sel ? 'sel' : ''}" data-v="${v}">✖</button>`;

const patThumb = (kind, fur, col) =>
  kind === 'none'
    ? `<svg viewBox="0 0 100 100"><rect width="100" height="100" rx="18" fill="${fur}"/></svg>`
    : `<svg viewBox="0 0 100 100"><defs>${patternDefs('pt' + kind, kind, col)}</defs><rect width="100" height="100" rx="18" fill="${fur}"/><rect width="100" height="100" rx="18" fill="url(#pt${kind}pt)"/></svg>`;

function tabs(list, cur) {
  return `<div class="tabs">${list.map((t, i) => `<button class="tab ${i === cur ? 'on' : ''}" data-i="${i}">${t.icon}</button>`).join('')}</div>`;
}

// Generic tabbed panel. tabsDef: [{icon, say, render(look) -> html, pick(value, el)}]
function tabbedPanel(env, tabsDef, { onUse }) {
  const { panel, look, sfx, say } = env;
  let cur = 0;
  const draw = () => {
    panel.innerHTML = tabs(tabsDef, cur) + `<div class="grid">${tabsDef[cur].render(look)}</div>` + (tabsDef[cur].footer ? `<div class="footer">${tabsDef[cur].footer(look)}</div>` : '');
  };
  const onClick = (e) => {
    const tab = e.target.closest('.tab');
    if (tab) {
      cur = +tab.dataset.i;
      sfx('tap');
      draw();
      tabsDef[cur].say && say(tabsDef[cur].say);
      return;
    }
    const chip = e.target.closest('.chip');
    if (!chip) return;
    const t = tabsDef[cur];
    const scope = chip.closest('.footer') ? 'footer' : 'grid';
    const apply = scope === 'footer' ? t.pickFooter : t.pick;
    apply(chip.dataset.v, chip);
    sfx(t.sfx || 'tap');
    onUse();
    draw();
    const again = panel.querySelector(`.chip[data-v="${CSS.escape(chip.dataset.v)}"]`);
    if (again) sparklesAtEl(again, 4, ['✨']);
  };
  panel.addEventListener('click', onClick);
  draw();
  tabsDef[0].say && say(tabsDef[0].say);
  return { redraw: draw, off: () => panel.removeEventListener('click', onClick) };
}

// ---------------------------------------------------------------- step 3: style
export function style(env) {
  const { look, set } = env;
  const t = tabbedPanel(
    env,
    [
      {
        icon: '💇', say: 'style', sfx: 'snip',
        render: (l) => HAIR_STYLES.map((h) => thumb(hairThumb(h, l.hairColor === 'rainbow' ? 'rainbow' : l.hairColor), h, l.hairStyle === h)).join(''),
        pick: (v) => set({ hairStyle: v }),
      },
      {
        icon: '🌈', say: 'hairColor',
        render: (l) => HAIR_COLORS.map((c) => swatch(c, l.hairColor === c)).join(''),
        pick: (v) => set({ hairColor: v, hairStyle: look.hairStyle === 'none' ? 'bangs' : look.hairStyle }),
      },
      {
        icon: '👁️', say: 'eyes',
        render: (l) => EYE_COLORS.map((c) => swatch(c, l.eye === c)).join(''),
        pick: (v) => set({ eye: v }),
      },
    ],
    { onUse: env.used }
  );
  return t.off;
}

// ---------------------------------------------------------------- step 4: color
export function color(env) {
  const { look, set } = env;
  const t = tabbedPanel(
    env,
    [
      {
        icon: '🎨', say: 'color',
        render: (l) => FUR_COLORS.map((c) => swatch(c, l.fur === c)).join(''),
        pick: (v) => set({ fur: v }),
      },
      {
        icon: '🐆', say: 'pattern',
        render: (l) => PATTERNS.map((p) => thumb(patThumb(p, l.fur, l.patColor), p, l.pattern === p)).join(''),
        pick: (v) => set({ pattern: v }),
      },
      {
        icon: '🖌️', say: 'pattern',
        render: (l) => FUR_COLORS.map((c) => swatch(c, l.patColor === c)).join(''),
        pick: (v) => set({ patColor: v, pattern: look.pattern === 'none' ? 'spots' : look.pattern }),
      },
    ],
    { onUse: env.used }
  );
  return t.off;
}

// ---------------------------------------------------------------- step 5: nails
export function nails(env) {
  const { look, set, overlay, panel, sfx, say } = env;
  const PAWS = [[121, 366], [279, 366], [162, 458], [238, 458]];
  let cur = NAIL_COLORS[0];
  let mode = 'all'; // 'all' paints every paw when a color is tapped; 'one' just picks the color
  const draw = () => {
    panel.innerHTML =
      `<div class="grid nails">${none(false, 'clear')}${NAIL_COLORS.map((c) => swatch(c, cur === c)).join('')}</div>` +
      `<div class="footer"><button class="chip mode ${mode === 'all' ? 'sel' : ''}" data-v="all">🐾🐾</button><button class="chip mode ${mode === 'one' ? 'sel' : ''}" data-v="one">☝️🐾</button></div>`;
  };
  const paint = (idx, c) => {
    const n = [...look.nails];
    n[idx] = c;
    set({ nails: n });
  };
  const onPanel = (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    const v = chip.dataset.v;
    if (chip.classList.contains('mode')) {
      mode = v;
      sfx('tap');
    } else if (v === 'clear') {
      set({ nails: [null, null, null, null] });
      sfx('tap');
    } else {
      cur = v;
      if (mode === 'all') {
        set({ nails: [v, v, v, v] });
        sfx('paint');
        sfx('sparkle');
      } else sfx('tap');
    }
    env.used();
    draw();
  };
  panel.addEventListener('click', onPanel);
  draw();

  overlay.innerHTML = PAWS.map((p, i) => `<g class="hit paw" data-i="${i}" transform="translate(${p[0]} ${p[1]})"><circle r="36" class="paw-ring"/><circle r="40" fill="transparent"/></g>`).join('');
  overlay.classList.add('live');
  const onPaw = (e) => {
    const g = e.target.closest('.paw');
    if (!g) return;
    e.preventDefault();
    mode = 'one';
    paint(+g.dataset.i, cur);
    sfx('paint');
    sfx('good');
    env.used();
    draw();
  };
  overlay.addEventListener('pointerdown', onPaw);
  say('nails');
  return () => {
    panel.removeEventListener('click', onPanel);
    overlay.removeEventListener('pointerdown', onPaw);
    overlay.classList.remove('live');
    overlay.innerHTML = '';
  };
}

// ---------------------------------------------------------------- step 6: dress up
export function dress(env) {
  const { look, set, panel, sfx, say } = env;
  let slot = 'outfit';
  const draw = () => {
    const items = ITEMS[slot];
    const curItem = look[slot];
    const accent = curItem ? curItem.c : null;
    panel.innerHTML =
      tabs(SLOTS.map((s) => ({ icon: SLOT_ICON[s] })), SLOTS.indexOf(slot)) +
      `<div class="grid items">${none(!curItem, 'none')}${items.map((it) => thumb(itemThumb(slot, it.id, curItem && curItem.id === it.id ? curItem.c : it.def), it.id, curItem && curItem.id === it.id)).join('')}</div>` +
      `<div class="footer ${curItem ? '' : 'dim'}">${ACCENT_COLORS.map((c) => swatch(c, accent === c)).join('')}</div>`;
  };
  const onPanel = (e) => {
    const tab = e.target.closest('.tab');
    if (tab) {
      slot = SLOTS[+tab.dataset.i];
      sfx('tap');
      draw();
      return;
    }
    const chip = e.target.closest('.chip');
    if (!chip) return;
    const v = chip.dataset.v;
    if (chip.closest('.footer')) {
      if (look[slot]) {
        set({ [slot]: { id: look[slot].id, c: v } });
        sfx('paint');
      }
    } else if (v === 'none') {
      set({ [slot]: null });
      sfx('tap');
    } else {
      const def = ITEMS[slot].find((i) => i.id === v);
      const keep = look[slot] && look[slot].c;
      set({ [slot]: { id: v, c: keep || def.def } });
      sfx('boing');
      sfx('sparkle');
      env.petHop();
    }
    env.used();
    draw();
  };
  panel.addEventListener('click', onPanel);
  draw();
  say('dress');
  return () => panel.removeEventListener('click', onPanel);
}
