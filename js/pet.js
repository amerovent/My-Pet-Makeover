// The pet renderer. One shared chibi body + per-species pieces + hair + dress-up items => one SVG string.
// viewBox is "0 -60 400 560" for every pet so overlays (bubbles, tufts, nails) can share coordinates.
import { SPECIES } from './data.js';
import { SPECIES_ART } from './art/species.js';
import { drawHair } from './art/hair.js';
import { ITEM_DRAW, ITEM_BOX, ITEM_BOX_ITEM } from './art/items.js';
import { E, C, P, mirror, line, starPath, heartPath } from './art/shapes.js';
import { mix, lighten, darken } from './color.js';

export const VIEWBOX = '0 -60 400 560';
export const VB = { x: 0, y: -60, w: 400, h: 560 };

let uidN = 0;
export const nextUid = () => 'p' + ++uidN;

export function defaultLook(species) {
  const s = SPECIES[species];
  return {
    species,
    fur: s.fur,
    pattern: s.pattern,
    patColor: s.patColor,
    eye: s.eye,
    hairStyle: s.hairStyle,
    hairColor: s.hairColor,
    nails: [null, null, null, null], // left hand, right hand, left foot, right foot
    outfit: null, // each of these: { id, c } or null
    hat: null,
    glasses: null,
    neck: null,
  };
}

export const patternDefs = (uid, kind, color) => {
  const fill = `fill="${color}"`;
  switch (kind) {
    case 'spots':
      return `<pattern id="${uid}pt" width="78" height="78" patternUnits="userSpaceOnUse"><g ${fill}>${C(16, 18, 10)}${C(52, 30, 13)}${C(28, 58, 8)}${C(66, 68, 6.5)}</g></pattern>`;
    case 'dots':
      return `<pattern id="${uid}pt" width="30" height="30" patternUnits="userSpaceOnUse"><g ${fill}>${C(8, 8, 4.5)}${C(23, 23, 4.5)}</g></pattern>`;
    case 'stripes':
      return `<pattern id="${uid}pt" width="48" height="44" patternUnits="userSpaceOnUse"><g ${fill}>${P('M8 0 Q20 22 8 44 L20 44 Q32 22 20 0 Z')}</g></pattern>`;
    case 'hearts':
      return `<pattern id="${uid}pt" width="72" height="72" patternUnits="userSpaceOnUse"><g ${fill}>${P(heartPath(18, 20, 10))}${P(heartPath(54, 56, 10))}</g></pattern>`;
    case 'stars':
      return `<pattern id="${uid}pt" width="72" height="72" patternUnits="userSpaceOnUse"><g ${fill}>${P(starPath(18, 20, 14, 6))}${P(starPath(54, 56, 14, 6))}</g></pattern>`;
    default:
      return '';
  }
};

const eyeSVG = (ctx, cx, cy, side) => {
  const hx = side === 'L' ? -1 : 1;
  const lash =
    side === 'L'
      ? `<path d="M${cx - 37} ${cy - 14} Q${cx - 46} ${cy - 22} ${cx - 50} ${cy - 34}" fill="none" stroke="#2a0f2a" stroke-width="5" stroke-linecap="round"/><path d="M${cx - 35} ${cy - 24} Q${cx - 42} ${cy - 34} ${cx - 42} ${cy - 44}" fill="none" stroke="#2a0f2a" stroke-width="4" stroke-linecap="round"/>`
      : `<path d="M${cx + 37} ${cy - 14} Q${cx + 46} ${cy - 22} ${cx + 50} ${cy - 34}" fill="none" stroke="#2a0f2a" stroke-width="5" stroke-linecap="round"/><path d="M${cx + 35} ${cy - 24} Q${cx + 42} ${cy - 34} ${cx + 42} ${cy - 44}" fill="none" stroke="#2a0f2a" stroke-width="4" stroke-linecap="round"/>`;
  return (
    `<ellipse cx="${cx}" cy="${cy}" rx="38" ry="44" fill="#2a0f2a"/>` +
    `<ellipse cx="${cx}" cy="${cy + 2}" rx="33" ry="39" fill="url(#${ctx.uid}ey)"/>` +
    `<ellipse cx="${cx}" cy="${cy - 5}" rx="15" ry="22" fill="#2a0f2a"/>` +
    `<ellipse cx="${cx}" cy="${cy + 20}" rx="22" ry="11" fill="#fff" opacity=".22"/>` +
    `<circle cx="${cx + hx * -9}" cy="${cy - 18}" r="10.5" fill="#fff"/>` +
    `<circle cx="${cx + hx * 12}" cy="${cy + 15}" r="5.2" fill="#fff"/>` +
    `<path d="${starPath(cx + hx * 7, cy + 2, 7, 2.4, 4)}" fill="#fff"/>` +
    lash
  );
};

export function petSVG(look, opts = {}) {
  const uid = opts.uid || nextUid();
  const mode = opts.mode || 'normal';
  const fills = opts.fills || {};
  const sp = SPECIES[look.species];

  const fur = look.fur;
  const hairIsRainbow = look.hairColor === 'rainbow';
  const hairHex = hairIsRainbow ? '#ffb8d6' : look.hairColor;
  const ctx = {
    uid,
    mode,
    fills,
    look,
    fur,
    fur2: lighten(fur, 0.55),
    ol: mix(fur, '#3b1030', 0.72),
    earC: darken(fur, 0.16),
    patColor: look.patColor,
    eye: look.eye,
    hairIsRainbow,
    hairHex,
    hairCol: hairIsRainbow ? `url(#${uid}rb)` : look.hairColor,
    hairOl: hairIsRainbow ? '#7a3d6e' : darken(hairHex, 0.45),
    ribbon: ['#ff7fb7', '#ff4d6d', '#ffb8d6'].includes(hairHex) ? '#6aa9ff' : '#ff7fb7',
  };
  const usePattern = mode === 'normal' && look.pattern !== 'none';
  ctx.patFill = usePattern ? `url(#${uid}pt)` : null;

  // Region-aware primitives -----------------------------------------------------
  ctx.blob = (parts, fill, o = {}) => {
    const shapes = parts.map((p) => p.s).join('');
    let out = `<g fill="${ctx.ol}" stroke="${ctx.ol}" stroke-width="7.5" stroke-linejoin="round">${shapes}</g>`;
    if (mode === 'color') {
      out += parts
        .map((p) => `<g class="reg" data-r="${p.r}" fill="${fills[p.r] || '#fff'}">${p.s}</g>`)
        .join('');
    } else {
      out += `<g fill="${fill}">${shapes}</g>`;
      if (o.pattern !== false && ctx.patFill) out += `<g fill="${ctx.patFill}">${shapes}</g>`;
      out += `<g fill="url(#${uid}sh)">${shapes}</g>`;
    }
    return out;
  };
  ctx.part = (s, r, fill) =>
    mode === 'color'
      ? `<g class="reg" data-r="${r}" fill="${fills[r] || '#fff'}" stroke="${ctx.ol}" stroke-width="3.5" stroke-linejoin="round">${s}</g>`
      : `<g fill="${fill}">${s}</g>`;
  ctx.tailLine = (d, w, color) =>
    `<path d="${d}" fill="none" stroke="${ctx.ol}" stroke-width="${w + 7}" stroke-linecap="round" stroke-linejoin="round"/>` +
    (mode === 'color'
      ? `<g class="reg" data-r="tail" data-line="1" stroke="${fills.tail || '#fff'}"><path d="${d}" fill="none" stroke="inherit" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/></g>`
      : `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` +
        (ctx.patFill && look.pattern !== 'stripes'
          ? `<path d="${d}" fill="none" stroke="${ctx.patFill}" stroke-width="${w}" stroke-linecap="round"/>`
          : ''));

  const art = SPECIES_ART[look.species](ctx);

  // Dress-up -------------------------------------------------------------------
  const it = (slot) => {
    const v = mode === 'normal' ? look[slot] : null;
    if (!v) return { back: '', front: '' };
    const fn = ITEM_DRAW[slot][v.id];
    return fn ? fn(v.c) : { back: '', front: '' };
  };
  const outfit = it('outfit');
  const hat = it('hat');
  const glasses = it('glasses');
  const neck = it('neck');
  const hair = mode === 'normal' ? drawHair(look.hairStyle, ctx) : { back: '', front: '' };

  // Body ------------------------------------------------------------------------
  const body = ctx.blob(
    [
      { s: E(200, 345, 58, 70), r: 'body' },
      { s: E(170, 420, 28, 34) + E(162, 452, 35, 17), r: 'legs' },
      { s: E(230, 420, 28, 34) + E(238, 452, 35, 17), r: 'legs' },
    ],
    fur
  );
  const belly = ctx.part(E(200, 352, 35, 50), 'belly', ctx.fur2);

  // Paws: toe lines + nail polish
  const toeLines = (cx, cy, w, h) =>
    `<g stroke="${ctx.ol}" stroke-width="2.6" stroke-linecap="round" opacity=".55" fill="none"><path d="M${cx - w * 0.5} ${cy} l0 ${h}"/><path d="M${cx + w * 0.5} ${cy} l0 ${h}"/></g>`;
  const nail = (x, y, c) =>
    c
      ? `<ellipse cx="${x}" cy="${y}" rx="6" ry="7.5" fill="${c}" stroke="${darken(c, 0.4)}" stroke-width="1.8"/><ellipse cx="${x - 1.6}" cy="${y - 2.6}" rx="1.8" ry="2.6" fill="#fff" opacity=".75"/>`
      : '';
  const nails3 = (cx, cy, c) => nail(cx - 11, cy - 2, c) + nail(cx, cy + 2, c) + nail(cx + 11, cy - 2, c);
  const n = look.nails || [];
  const handL = toeLines(121, 366, 11, 10) + nails3(121, 377, mode === 'normal' ? n[0] : null);
  const handR = toeLines(279, 366, 11, 10) + nails3(279, 377, mode === 'normal' ? n[1] : null);
  const footL = toeLines(162, 456, 12, 10) + nails3(162, 462, mode === 'normal' ? n[2] : null);
  const footR = toeLines(238, 456, 12, 10) + nails3(238, 462, mode === 'normal' ? n[3] : null);

  const armL = ctx.blob([{ s: E(132, 322, 19, 41, 18) + E(121, 362, 22, 21), r: 'arms' }], fur);
  const armR = ctx.blob([{ s: E(268, 322, 19, 41, -18) + E(279, 362, 22, 21), r: 'arms' }], fur);

  // Head ------------------------------------------------------------------------
  const head = ctx.blob([{ s: E(200, 172, 118, 100), r: 'head' }], fur);
  const shine =
    mode === 'normal'
      ? `<ellipse cx="146" cy="104" rx="34" ry="12" fill="#fff" opacity=".4" transform="rotate(-18 146 104)"/>`
      : '';
  const blush = `<g fill="#ff7fa0" opacity=".5">${E(100, 232, 20, 11)}${E(300, 232, 20, 11)}</g>`;
  const eyes = `<g class="eyes">${eyeSVG(ctx, 148, 192, 'L')}${eyeSVG(ctx, 252, 192, 'R')}</g>`;

  const mid = ctx.hairIsRainbow ? ['#ff7fb7', '#ffd24d', '#6aa9ff'] : null;
  const defs =
    `<defs>` +
    `<linearGradient id="${uid}sh" x1="0" y1="0" x2="0" y2="1"><stop offset=".5" stop-color="#7a2a5a" stop-opacity="0"/><stop offset="1" stop-color="#7a2a5a" stop-opacity=".2"/></linearGradient>` +
    `<linearGradient id="${uid}ey" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${darken(look.eye, 0.4)}"/><stop offset=".55" stop-color="${look.eye}"/><stop offset="1" stop-color="${lighten(look.eye, 0.55)}"/></linearGradient>` +
    `<linearGradient id="${uid}gd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3a8"/><stop offset=".5" stop-color="#ffd24d"/><stop offset="1" stop-color="#f2a72c"/></linearGradient>` +
    `<linearGradient id="${uid}rb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff7fb7"/><stop offset=".35" stop-color="#ffd24d"/><stop offset=".7" stop-color="#7be0b8"/><stop offset="1" stop-color="#6aa9ff"/></linearGradient>` +
    (usePattern ? patternDefs(uid, look.pattern, look.patColor) : '') +
    `</defs>`;

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" class="pet ${opts.cls || ''}" viewBox="${VIEWBOX}" data-species="${look.species}">` +
    defs +
    `<ellipse class="shadow" cx="200" cy="470" rx="104" ry="15" fill="#6b2a45" opacity=".16"/>` +
    `<g class="char">` +
    outfit.back +
    `<g class="tail">${art.tail}</g>` +
    art.earsBack +
    body +
    belly +
    footL +
    footR +
    outfit.front +
    hair.back +
    `<g class="armL">${armL}${handL}</g>` +
    `<g class="armR">${armR}${handR}</g>` +
    `<g class="headg">` +
    head +
    shine +
    art.muzzle +
    neck.front +
    blush +
    eyes +
    art.face +
    hair.front +
    art.front +
    glasses.front +
    hat.front +
    `</g>` +
    `</g></svg>`;
  return svg;
}

// Item thumbnail (just the item, no pet).
export function itemThumb(slot, id, color) {
  const fn = ITEM_DRAW[slot][id];
  const d = fn(color);
  return `<svg viewBox="${ITEM_BOX_ITEM[id] || ITEM_BOX[slot]}" xmlns="http://www.w3.org/2000/svg">${d.back}${d.front}</svg>`;
}

// Hairstyle thumbnail: draws the style on a simple bald head so it reads at small sizes.
export function hairThumb(style, color) {
  const ctx = {
    hairIsRainbow: color === 'rainbow',
    hairHex: color === 'rainbow' ? '#ffb8d6' : color,
    uid: 'ht' + style,
  };
  ctx.hairCol = ctx.hairIsRainbow ? `url(#${ctx.uid}rb)` : color;
  ctx.hairOl = ctx.hairIsRainbow ? '#7a3d6e' : darken(ctx.hairHex, 0.45);
  ctx.ribbon = '#6aa9ff';
  const h = drawHair(style, ctx);
  const grad = `<defs><linearGradient id="${ctx.uid}rb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff7fb7"/><stop offset=".35" stop-color="#ffd24d"/><stop offset=".7" stop-color="#7be0b8"/><stop offset="1" stop-color="#6aa9ff"/></linearGradient></defs>`;
  const headS = `<g fill="#fde7d4" stroke="#8a4a3a" stroke-width="7"><ellipse cx="200" cy="172" rx="118" ry="100"/></g><g fill="#2a0f2a"><ellipse cx="148" cy="192" rx="22" ry="28"/><ellipse cx="252" cy="192" rx="22" ry="28"/></g>`;
  return `<svg viewBox="0 20 400 330" xmlns="http://www.w3.org/2000/svg">${grad}${h.back}${headS}${h.front}</svg>`;
}
