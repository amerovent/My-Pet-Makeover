// Dress-up items. Each draw function takes the item's accent color and returns { back, front }.
// `back` is drawn behind the pet (cape), `front` over it.
import { E, C, P, R, ib, line, mirror, heartPath, starPath, flower, PLUM } from './shapes.js';
import { darken, lighten } from '../color.js';

const hiLine = (d) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="5" stroke-linecap="round"/>`;

export const OUTFITS = {
  tee(c) {
    const body = ib(
      P('M166 284 Q200 294 234 284 C256 302 268 340 264 394 C230 404 170 404 136 394 C132 340 144 302 166 284 Z') +
        E(139, 304, 17, 17) + E(261, 304, 17, 17),
      c
    );
    const star = `<path d="${starPath(200, 345, 18, 8)}" fill="#fff" stroke="${darken(c, 0.25)}" stroke-width="3" stroke-linejoin="round"/>`;
    return { back: '', front: body + star };
  },
  dress(c) {
    const skirt = 'M162 290 Q200 300 238 290 L248 336 C274 362 292 398 296 428 C250 442 150 442 104 428 C108 398 126 362 152 336 Z';
    const hem = `<path d="M106 424 C150 440 250 440 294 424" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-opacity=".85"/>`;
    const belt = ib(R(150, 332, 100, 16, 8), lighten(c, 0.55), 4) + ib(C(200, 340, 9), '#fff', 3);
    return { back: '', front: ib(P(skirt), c) + hem + belt + hiLine('M170 300 C162 320 158 330 156 340') };
  },
  tutu(c) {
    const top = ib(P('M164 286 Q200 296 236 286 C252 306 258 340 254 372 L146 372 C142 340 148 306 164 286 Z'), lighten(c, 0.45));
    const skirt = ib(E(200, 392, 96, 24) + E(200, 404, 84, 22), c);
    const frill = `<path d="M110 392 Q130 410 152 396 Q176 414 200 398 Q224 414 248 396 Q270 410 290 392" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="5" stroke-linecap="round"/>`;
    return { back: '', front: top + skirt + frill + ib(R(150, 366, 100, 14, 6), darken(c, 0.12), 4) };
  },
  overalls(c) {
    const pants = ib(P('M146 360 C146 346 254 346 254 360 L262 410 C230 420 170 420 138 410 Z') + R(166, 306, 68, 62, 10), c);
    const straps = ib(P('M170 308 L152 276 L172 270 L184 306 Z') + P('M230 308 L248 276 L228 270 L216 306 Z'), c);
    const buttons = `<circle cx="176" cy="318" r="5.5" fill="#ffd24d" stroke="${PLUM}" stroke-width="2.5"/><circle cx="224" cy="318" r="5.5" fill="#ffd24d" stroke="${PLUM}" stroke-width="2.5"/>`;
    const pocket = ib(R(184, 336, 32, 22, 7), lighten(c, 0.25), 3.5);
    const tee = ib(P('M164 282 Q200 292 236 282 C250 290 256 306 256 322 L144 322 C144 306 150 290 164 282 Z'), '#fff', 5);
    return { back: '', front: tee + pants + straps + buttons + pocket };
  },
  hoodie(c) {
    const hood = ib(P('M150 282 Q200 330 250 282 Q200 272 150 282 Z'), darken(c, 0.12), 5);
    const body = ib(P('M164 288 Q200 300 236 288 C258 306 268 344 264 396 C230 406 170 406 136 396 C132 344 142 306 164 288 Z') + E(139, 306, 17, 17) + E(261, 306, 17, 17), c);
    const pocket = ib(P('M160 352 L240 352 L248 384 C220 392 180 392 152 384 Z'), darken(c, 0.1), 4);
    const strings = `<path d="M188 296 L186 330 M212 296 L214 330" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>`;
    return { back: '', front: body + pocket + hood + strings };
  },
  cape(c) {
    const cape = ib(P('M158 284 Q200 270 242 284 C292 330 324 410 330 462 C262 482 138 482 70 462 C76 410 108 330 158 284 Z'), c);
    const lining = `<path d="M76 456 C140 476 260 476 324 456" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-opacity=".7"/>`;
    const clasp = ib(C(200, 286, 10), '#ffd24d', 4) + `<path d="${starPath(200, 286, 5.5, 2.4)}" fill="#fff"/>`;
    return { back: cape + lining, front: clasp };
  },
};

export const HATS = {
  crown(c) {
    const body = ib(P('M142 86 L148 30 L176 62 L200 18 L224 62 L252 30 L258 86 Q200 100 142 86 Z'), c);
    const gems = `<circle cx="148" cy="32" r="7" fill="#ff4d6d" stroke="${PLUM}" stroke-width="3"/><circle cx="200" cy="20" r="8" fill="#6aa9ff" stroke="${PLUM}" stroke-width="3"/><circle cx="252" cy="32" r="7" fill="#ff4d6d" stroke="${PLUM}" stroke-width="3"/>`;
    const band = `<path d="M146 78 Q200 92 254 78" fill="none" stroke="${lighten(c, 0.5)}" stroke-width="6" stroke-linecap="round"/>`;
    return { back: '', front: body + band + gems };
  },
  bow(c) {
    const lobe = 'M204 70 C170 18 120 30 130 76 C136 98 176 94 204 80 Z';
    const body = ib(P(lobe) + mirror(P(lobe)) + C(200, 74, 15), c);
    const knot = `<circle cx="200" cy="74" r="9" fill="${darken(c, 0.15)}"/>`;
    const hi = hiLine('M150 52 C140 58 138 66 140 74') + hiLine('M250 52 C260 58 262 66 260 74');
    return { back: '', front: body + knot + hi };
  },
  party(c) {
    const cone = ib(P('M154 88 L200 -22 L246 88 Q200 102 154 88 Z'), c);
    const dots = ['190,50,6', '212,34,5', '202,70,6.5', '178,76,5', '226,68,5.5'].map((s) => { const [x, y, r] = s.split(','); return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" fill-opacity=".85"/>`; }).join('');
    const pom = ib(C(200, -26, 13), '#fff', 4);
    return { back: '', front: cone + dots + pom };
  },
  flowers(c) {
    const vine = line('M112 118 C140 78 260 78 288 118', 7, '#5ec27a', PLUM);
    const leaves = ib(E(144, 92, 10, 5, -30) + E(256, 92, 10, 5, 30) + E(178, 76, 10, 5, -10) + E(222, 76, 10, 5, 10), '#5ec27a', 4);
    const fl = [[126, 106, 13], [158, 84, 15], [200, 74, 17], [242, 84, 15], [274, 106, 13]]
      .map(([x, y, r], i) => flower(x, y, r, i % 2 ? lighten(c, 0.35) : c, '#ffe27a'))
      .join('');
    return { back: '', front: vine + leaves + fl };
  },
  beret(c) {
    const body = ib(P('M114 98 C112 44 224 18 288 68 C304 84 298 102 280 104 C228 112 160 110 122 104 Z') + C(222, 32, 9), c);
    const hi = hiLine('M146 70 C170 52 204 44 232 48');
    const band = `<path d="M122 100 C170 110 232 110 280 102" fill="none" stroke="${darken(c, 0.18)}" stroke-width="7" stroke-linecap="round"/>`;
    return { back: '', front: body + band + hi };
  },
  phones(c) {
    const band = line('M100 178 C90 70 150 46 200 46 C250 46 310 70 300 178', 11, c, PLUM);
    const cups = ib(E(98, 182, 19, 31) + E(302, 182, 19, 31), c, 6) + `<g fill="${darken(c, 0.25)}">${E(98, 182, 10, 20)}${E(302, 182, 10, 20)}</g>`;
    return { back: '', front: band + cups };
  },
};

// Eyes sit at (148,192) and (252,192).
export const GLASSES = {
  round(c) {
    const lens = `<circle cx="148" cy="192" r="49" fill="#fff" fill-opacity=".18"/><circle cx="252" cy="192" r="49" fill="#fff" fill-opacity=".18"/>`;
    const frames = line('M99 192 a49 49 0 1 0 98 0 a49 49 0 1 0 -98 0 Z', 7, c) + line('M203 192 a49 49 0 1 0 98 0 a49 49 0 1 0 -98 0 Z', 7, c);
    const bridge = line('M194 186 Q200 178 206 186', 6, c);
    return { back: '', front: lens + frames + bridge };
  },
  heart(c) {
    const h1 = heartPath(148, 192, 40);
    const h2 = heartPath(252, 192, 40);
    const shapes = `<g fill="${c}" fill-opacity=".82" stroke="${PLUM}" stroke-width="6" stroke-linejoin="round"><path d="${h1}"/><path d="${h2}"/></g>`;
    const bridge = line('M184 176 Q200 168 216 176', 6, c);
    const glint = `<path d="M122 178 C124 168 132 164 138 166" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-opacity=".8"/><path d="M226 178 C228 168 236 164 242 166" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-opacity=".8"/>`;
    return { back: '', front: bridge + shapes + glint };
  },
  star(c) {
    const s1 = starPath(148, 194, 56, 28);
    const s2 = starPath(252, 194, 56, 28);
    const shapes = `<g fill="${c}" fill-opacity=".85" stroke="${PLUM}" stroke-width="6" stroke-linejoin="round"><path d="${s1}"/><path d="${s2}"/></g>`;
    const bridge = line('M190 186 Q200 178 210 186', 6, c);
    return { back: '', front: bridge + shapes };
  },
  shades(c) {
    const lens = ib(R(100, 162, 96, 68, 26) + R(204, 162, 96, 68, 26), '#2d2438', 8);
    const rim = `<g fill="none" stroke="${c}" stroke-width="5"><rect x="100" y="162" width="96" height="68" rx="26"/><rect x="204" y="162" width="96" height="68" rx="26"/></g>`;
    const bridge = line('M194 180 Q200 172 206 180', 7, c);
    const glint = `<path d="M116 184 L134 172" stroke="#fff" stroke-opacity=".55" stroke-width="6" stroke-linecap="round"/><path d="M220 184 L238 172" stroke="#fff" stroke-opacity=".55" stroke-width="6" stroke-linecap="round"/>`;
    return { back: '', front: lens + rim + bridge + glint };
  },
};

export const NECK = {
  bowtie(c) {
    const wing = 'M200 284 L160 262 C152 284 152 304 160 326 Z';
    const body = ib(P(wing) + mirror(P(wing)) + C(200, 288, 12), c);
    return { back: '', front: body + `<circle cx="200" cy="288" r="6" fill="${darken(c, 0.2)}"/>` };
  },
  scarf(c) {
    const wrap = ib(P('M138 270 Q200 304 262 270 L268 296 Q200 332 132 296 Z'), c);
    const tail = ib(P('M224 306 L252 366 L224 374 L206 312 Z'), c);
    const stripes = `<g stroke="#fff" stroke-opacity=".7" stroke-width="5" stroke-linecap="round"><path d="M146 285 L142 301"/><path d="M178 294 L174 312"/><path d="M222 296 L224 312"/><path d="M254 285 L256 301"/><path d="M236 340 L222 346"/><path d="M230 324 L216 330"/></g>`;
    return { back: '', front: wrap + tail + stripes };
  },
  pearls(c) {
    let s = '';
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      const x = 144 + 112 * t;
      const y = 268 + 40 * Math.sin(Math.PI * t);
      s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" fill="${c}" stroke="${PLUM}" stroke-width="3.5"/><circle cx="${(x - 3).toFixed(1)}" cy="${(y - 3).toFixed(1)}" r="2.6" fill="#fff"/>`;
    }
    return { back: '', front: s };
  },
  bell(c) {
    const band = ib(P('M142 270 Q200 304 258 270 L260 288 Q200 324 140 288 Z'), c);
    const bell = ib(C(200, 316, 14), '#ffd24d', 4) + `<path d="M190 316 L210 316 M200 316 L200 328" stroke="${PLUM}" stroke-width="3" stroke-linecap="round"/><circle cx="195" cy="310" r="3" fill="#fff" fill-opacity=".8"/>`;
    return { back: '', front: band + bell };
  },
  lei(c) {
    let s = '';
    for (let i = 0; i <= 6; i++) {
      const t = i / 6;
      const x = 146 + 108 * t;
      const y = 270 + 38 * Math.sin(Math.PI * t);
      s += flower(x.toFixed(1), y.toFixed(1), 12, i % 2 ? '#ffe27a' : c, i % 2 ? '#ff7fb7' : '#ffe27a');
    }
    return { back: '', front: s };
  },
};

export const ITEM_DRAW = { outfit: OUTFITS, hat: HATS, glasses: GLASSES, neck: NECK };

// Crop used when showing an item as a thumbnail on its own.
export const ITEM_BOX = {
  outfit: '100 262 200 210',
  hat: '90 -40 220 150',
  glasses: '90 140 220 105',
  neck: '120 252 160 130',
};

export const ITEM_BOX_ITEM = {
  cape: '50 262 300 230',
  crown: '124 6 152 100',
  bow: '108 22 184 86',
  party: '136 -48 128 146',
  flowers: '104 58 192 74',
  beret: '104 14 196 100',
  phones: '76 36 248 204',
};
