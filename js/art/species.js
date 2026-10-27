// Per-animal pieces. Every pet shares the same chibi body; these add ears, tails, muzzles and noses.
// Each builder gets the drawing context and returns layers the core assembler slots into z-order:
//   tail      behind the body
//   earsBack  behind the head
//   muzzle    on the face, under eyes
//   face      nose / mouth / whiskers, over eyes
//   front     over the head (horn)
import { E, P, C, mirror, line, PLUM } from './shapes.js';
import { darken, lighten, mix } from '../color.js';

const NOSE = '#3b1030';

const smile = (d) => `<path d="${d}" fill="none" stroke="${PLUM}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;

// Mouth: closed smile + open (eating) version toggled by CSS (.eating).
const mouth = (closed, open) =>
  `<g class="mouth-closed">${closed}</g><g class="mouth-open">${open}</g>`;

const openMouth = (cx, cy, w = 20, h = 16) =>
  `<path d="M${cx - w} ${cy} Q${cx} ${cy + h * 2} ${cx + w} ${cy} Z" fill="#5a1630" stroke="${PLUM}" stroke-width="3.5" stroke-linejoin="round"/>` +
  `<ellipse cx="${cx}" cy="${cy + h * 0.95}" rx="${w * 0.5}" ry="${h * 0.38}" fill="#ff7a9a"/>`;

export const SPECIES_ART = {
  // ---------------------------------------------------------------- puppy
  puppy(ctx) {
    const { part, blob, fur, fur2, earC } = ctx;
    const earL = 'M98 112 C56 108 30 168 44 236 C52 268 96 266 110 228 C120 196 124 150 116 120 Z';
    const earsBack =
      blob([{ s: P(earL), r: 'ears' }, { s: mirror(P(earL)), r: 'ears' }], earC);
    const tail = ctx.tailLine('M236 396 C292 392 316 356 304 316', 24, fur);
    const muzzle = part(E(200, 238, 46, 31), 'muzzle', fur2);
    const face =
      `<ellipse cx="200" cy="222" rx="16" ry="11" fill="${NOSE}"/><ellipse cx="195" cy="218" rx="5" ry="3" fill="#fff" opacity=".85"/>` +
      mouth(
        `<path d="M200 233 L200 241" stroke="${PLUM}" stroke-width="4" stroke-linecap="round"/>` +
          `<ellipse cx="200" cy="254" rx="9" ry="9" fill="#ff7a9a"/>` +
          smile('M182 242 Q191 254 200 241 Q209 254 218 242'),
        openMouth(200, 243, 22, 15)
      );
    return { tail, earsBack, muzzle, face, front: '', tailPart: 'tail' };
  },

  // ---------------------------------------------------------------- tiger cub
  cat(ctx) {
    const { part, blob, fur, fur2 } = ctx;
    const ear = 'M102 118 C88 62 116 36 150 50 C170 58 184 74 190 94 Z';
    const earIn = 'M118 104 C112 76 126 64 146 68 C160 74 168 84 172 94 Z';
    const earsBack =
      blob([{ s: P(ear), r: 'ears' }, { s: mirror(P(ear)), r: 'ears' }], fur) +
      part(P(earIn), 'earin', '#ffb3c6') +
      part(mirror(P(earIn)), 'earin', '#ffb3c6');
    const tailD = 'M240 402 C304 412 336 372 316 324 C304 296 330 272 348 288';
    let tail = ctx.tailLine(tailD, 24, fur);
    if (ctx.mode !== 'color') {
      tail += `<path d="${tailD}" fill="none" stroke="${ctx.patColor}" stroke-width="24" stroke-dasharray="9 24" stroke-dashoffset="-10"/>`;
      tail += `<path d="M334 270 L350 292" stroke="${ctx.patColor}" stroke-width="24" stroke-linecap="round"/>`;
    }
    const muzzle = part(E(172, 238, 35, 25) + E(228, 238, 35, 25), 'muzzle', fur2);
    const whisk = `<g stroke="${PLUM}" stroke-width="2.6" stroke-linecap="round" fill="none" opacity=".75">
      <path d="M148 236 L92 226"/><path d="M148 244 L94 248"/><path d="M152 252 L104 268"/>
      <path d="M252 236 L308 226"/><path d="M252 244 L306 248"/><path d="M248 252 L296 268"/></g>`;
    const face =
      whisk +
      `<path d="M188 220 Q200 213 212 220 Q207 232 200 234 Q193 232 188 220Z" fill="#ff7b9c" stroke="${PLUM}" stroke-width="2.5" stroke-linejoin="round"/>` +
      mouth(
        `<path d="M200 234 L200 241 M200 241 Q189 253 177 243 M200 241 Q211 253 223 243" fill="none" stroke="${PLUM}" stroke-width="4" stroke-linecap="round"/>`,
        openMouth(200, 243, 20, 14)
      );
    return { tail, earsBack, muzzle, face, front: '' };
  },

  // ---------------------------------------------------------------- bunny
  bunny(ctx) {
    const { part, blob, fur, fur2 } = ctx;
    const earsBack =
      blob([{ s: E(150, 22, 27, 82, -9), r: 'ears' }, { s: E(250, 22, 27, 82, 9), r: 'ears' }], fur) +
      part(E(151, 28, 13.5, 60, -9), 'earin', '#ffb3c6') +
      part(E(249, 28, 13.5, 60, 9), 'earin', '#ffb3c6');
    const tail = blob([{ s: E(272, 408, 28, 25), r: 'tail' }], fur2, { shade: false });
    const muzzle = part(E(200, 240, 30, 21), 'muzzle', fur2);
    const face =
      `<ellipse cx="200" cy="225" rx="10" ry="7" fill="#ff7f9f" stroke="${PLUM}" stroke-width="2.5"/>` +
      mouth(
        `<rect x="191" y="243" width="9" height="13" rx="2.5" fill="#fff" stroke="${PLUM}" stroke-width="2.5"/>` +
          `<rect x="200" y="243" width="9" height="13" rx="2.5" fill="#fff" stroke="${PLUM}" stroke-width="2.5"/>` +
          `<path d="M200 232 L200 241 M200 241 Q188 252 178 242 M200 241 Q212 252 222 242" fill="none" stroke="${PLUM}" stroke-width="3.8" stroke-linecap="round"/>`,
        openMouth(200, 243, 18, 13)
      );
    return { tail, earsBack, muzzle, face, front: '' };
  },

  // ---------------------------------------------------------------- unicorn
  unicorn(ctx) {
    const { part, blob, fur, fur2, hairCol, hairOl } = ctx;
    const ear = 'M116 112 C108 78 124 56 146 62 C162 68 172 82 176 96 Z';
    const earsBack =
      blob([{ s: P(ear), r: 'ears' }, { s: mirror(P(ear)), r: 'ears' }], fur) +
      part(P('M128 104 C124 82 134 72 146 74 C156 78 160 88 162 96 Z'), 'earin', '#ffc4de') +
      part(mirror(P('M128 104 C124 82 134 72 146 74 C156 78 160 88 162 96 Z')), 'earin', '#ffc4de');
    // Flowing tail uses the hair color.
    const base = ctx.hairIsRainbow ? ['#ff7fb7', '#ffd24d', '#6aa9ff'] : [hairCol, lighten(ctx.hairHex, 0.3), hairCol];
    const strands = ['M236 392 C316 398 352 340 322 292', 'M236 400 C306 424 360 372 340 316', 'M236 396 C296 380 332 330 300 288'];
    const tail =
      ctx.mode === 'color'
        ? ctx.tailLine(strands[0], 26, '#fff')
        : strands.map((d, i) => line(d, 20, base[i], hairOl)).join('');
    const muzzle = part(E(200, 242, 32, 22), 'muzzle', mix(fur2, '#ffc4de', 0.4));
    const face =
      `<ellipse cx="190" cy="236" rx="3.2" ry="4.4" fill="${PLUM}"/><ellipse cx="210" cy="236" rx="3.2" ry="4.4" fill="${PLUM}"/>` +
      mouth(smile('M184 248 Q200 262 216 248'), openMouth(200, 248, 18, 13));
    // Horn: gold with twist lines, sits on top of the head and hair.
    const horn = 'M182 96 L200 -6 L218 96 Z';
    const hornFill = ctx.mode === 'color' ? ctx.fills.horn || '#fff' : `url(#${ctx.uid}gd)`;
    const front =
      `<g class="reg" data-r="horn" fill="${hornFill}" stroke="${PLUM}" stroke-width="5" stroke-linejoin="round">${P(horn)}</g>` +
      (ctx.mode === 'color'
        ? ''
        : `<g stroke="#d98a1f" stroke-width="3.6" stroke-linecap="round" fill="none"><path d="M186 80 L214 72"/><path d="M189 60 L211 53"/><path d="M193 40 L207 35"/><path d="M196 21 L204 18"/></g>`);
    return { tail, earsBack, muzzle, face, front };
  },

  // ---------------------------------------------------------------- monkey
  monkey(ctx) {
    const { part, blob, fur, fur2 } = ctx;
    const earsBack =
      blob([{ s: E(76, 180, 34, 36), r: 'ears' }, { s: E(324, 180, 34, 36), r: 'ears' }], fur) +
      part(E(78, 180, 19, 22), 'earin', '#ffb9c4') +
      part(E(322, 180, 19, 22), 'earin', '#ffb9c4');
    const tailD = 'M240 404 C312 410 346 366 326 322 C312 292 344 276 358 298';
    const tail = ctx.tailLine(tailD, 22, fur);
    const muzzle =
      part(E(158, 206, 46, 52) + E(242, 206, 46, 52) + E(200, 238, 52, 30), 'muzzle', fur2) +
      '';
    const face =
      `<ellipse cx="192" cy="232" rx="3.4" ry="2.6" fill="${PLUM}"/><ellipse cx="208" cy="232" rx="3.4" ry="2.6" fill="${PLUM}"/>` +
      mouth(smile('M178 244 Q200 264 222 244'), openMouth(200, 245, 22, 14));
    return { tail, earsBack, muzzle, face, front: '' };
  },
};

// Regions (shared by coloring pages) every species exposes besides the common ones.
export const SPECIES_REGIONS = {
  puppy: ['ears', 'tail', 'muzzle'],
  cat: ['ears', 'earin', 'tail', 'muzzle'],
  bunny: ['ears', 'earin', 'tail', 'muzzle'],
  unicorn: ['ears', 'earin', 'tail', 'muzzle', 'horn'],
  monkey: ['ears', 'earin', 'tail', 'muzzle'],
};
