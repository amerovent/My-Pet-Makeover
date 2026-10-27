// Sticker art (100x100) and small tool icons. Stickers get a white "die-cut" border like real stickers.
import { C, E, P, starPath, heartPath, PLUM } from './shapes.js';
import { darken, lighten } from '../color.js';

const shapes = {
  star: (c) => `<path d="${starPath(50, 54, 42, 19)}" fill="${c}"/><path d="${starPath(50, 54, 22, 10)}" fill="${lighten(c, 0.45)}" opacity=".7"/>`,
  heart: (c) => `<path d="${heartPath(50, 50, 36)}" fill="${c}"/><ellipse cx="34" cy="38" rx="7" ry="4" fill="#fff" opacity=".6" transform="rotate(-30 34 38)"/>`,
  drop: (c) => `<path d="M50 8 C70 36 84 54 84 68 C84 88 68 96 50 96 C32 96 16 88 16 68 C16 54 30 36 50 8Z" fill="${c}"/><ellipse cx="38" cy="66" rx="6" ry="10" fill="#fff" opacity=".6" transform="rotate(20 38 66)"/>`,
  crown: (c) => `<path d="M14 78 L18 28 L38 52 L50 18 L62 52 L82 28 L86 78 Z" fill="${c}"/><rect x="14" y="72" width="72" height="14" rx="5" fill="${darken(c, 0.12)}"/><circle cx="50" cy="22" r="6" fill="#ffd24d"/><circle cx="18" cy="30" r="5" fill="#ffd24d"/><circle cx="82" cy="30" r="5" fill="#ffd24d"/>`,
  rainbow: (c) =>
    ['#ff6b8a', '#ffd24d', '#6aa9ff'].map((col, i) => `<path d="M${10 + i * 11} 74 A${40 - i * 11} ${40 - i * 11} 0 0 1 ${90 - i * 11} 74" fill="none" stroke="${col}" stroke-width="11"/>`).join('') +
    `<circle cx="16" cy="78" r="8" fill="#fff"/><circle cx="84" cy="78" r="8" fill="#fff"/>`,
  flower: (c) => {
    let s = '';
    for (let i = 0; i < 5; i++) {
      const a = ((i * 72 - 90) * Math.PI) / 180;
      s += `<circle cx="${50 + 24 * Math.cos(a)}" cy="${52 + 24 * Math.sin(a)}" r="18" fill="${c}"/>`;
    }
    return s + `<circle cx="50" cy="52" r="13" fill="#ffe27a"/>`;
  },
  bow: (c) => `<path d="M50 52 C30 18 6 26 12 54 C16 72 34 68 50 56Z M50 52 C70 18 94 26 88 54 C84 72 66 68 50 56Z" fill="${c}"/><circle cx="50" cy="54" r="11" fill="${darken(c, 0.15)}"/>`,
  moon: (c) => `<path d="M62 10 A42 42 0 1 0 90 68 A34 34 0 1 1 62 10Z" fill="${c}"/><path d="${starPath(74, 30, 9, 4)}" fill="#fff"/>`,
  paw: (c) => `<ellipse cx="50" cy="66" rx="24" ry="20" fill="${c}"/><circle cx="22" cy="44" r="10" fill="${c}"/><circle cx="40" cy="30" r="10.5" fill="${c}"/><circle cx="60" cy="30" r="10.5" fill="${c}"/><circle cx="78" cy="44" r="10" fill="${c}"/>`,
  diamond: (c) => `<path d="M50 8 L86 38 L50 94 L14 38Z" fill="${c}"/><path d="M14 38 L86 38 M50 8 L36 38 L50 94 L64 38 Z" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="3"/>`,
  cupcake: (c) => `<path d="M24 52 L30 90 L70 90 L76 52Z" fill="#ffd9a8"/><path d="M34 56 L36 88 M46 56 L46 88 M58 56 L56 88" stroke="#e8b27a" stroke-width="3"/><circle cx="50" cy="40" r="26" fill="${c}"/><circle cx="50" cy="26" r="18" fill="${lighten(c, 0.25)}"/><circle cx="50" cy="12" r="7" fill="#ff4d6d"/>`,
  cookie: (c) => `<circle cx="50" cy="52" r="40" fill="${c}"/><circle cx="36" cy="40" r="6" fill="#6b3d22"/><circle cx="62" cy="36" r="5" fill="#6b3d22"/><circle cx="58" cy="62" r="6.5" fill="#6b3d22"/><circle cx="34" cy="66" r="5" fill="#6b3d22"/>`,
  palette: (c) => `<path d="M50 12 C24 12 8 30 10 52 C12 74 30 90 54 88 C68 87 62 74 70 68 C78 62 94 68 92 50 C90 28 74 12 50 12Z" fill="${c}"/><circle cx="32" cy="42" r="8" fill="#ff6b8a"/><circle cx="52" cy="30" r="8" fill="#ffd24d"/><circle cx="72" cy="42" r="8" fill="#6aa9ff"/><circle cx="34" cy="66" r="8" fill="#5ec27a"/>`,
};

export function stickerSVG(shape, color, locked = false) {
  const body = (shapes[shape] || shapes.star)(locked ? '#d9cfe0' : color);
  const border = `<g stroke="#fff" stroke-width="14" stroke-linejoin="round" stroke-linecap="round" fill="#fff">${body}</g>`;
  return (
    `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"${locked ? ' class="locked"' : ''}>` +
    `<g opacity=".18" transform="translate(2 4)">${border.replace(/#fff/g, '#5b2142')}</g>` +
    border +
    `<g>${body}</g>` +
    (locked ? `<text x="50" y="66" text-anchor="middle" font-size="40" font-weight="700" fill="#fff" font-family="Fredoka, sans-serif">?</text>` : '') +
    `</svg>`
  );
}

// ---- tools used in the bath / brush steps ------------------------------------------------
export const TOOLS = {
  sponge: `<g transform="rotate(-18)"><rect x="-34" y="-24" width="68" height="48" rx="14" fill="#ffd24d" stroke="${PLUM}" stroke-width="5"/><g fill="#f3b81c"><circle cx="-14" cy="-6" r="5"/><circle cx="8" cy="6" r="6"/><circle cx="18" cy="-10" r="4"/><circle cx="-8" cy="12" r="4"/></g><ellipse cx="-18" cy="-14" rx="10" ry="4" fill="#fff" opacity=".6"/></g>`,
  brush: `<g transform="rotate(-30)"><rect x="-14" y="-6" width="86" height="22" rx="11" fill="#ff7fb7" stroke="${PLUM}" stroke-width="5"/><rect x="-44" y="-26" width="56" height="42" rx="12" fill="#ffd9a8" stroke="${PLUM}" stroke-width="5"/><g stroke="${PLUM}" stroke-width="3.5" stroke-linecap="round"><path d="M-34 -26 v-12 M-24 -26 v-14 M-14 -26 v-14 M-4 -26 v-12"/></g></g>`,
  dryer: `<g transform="rotate(-20)"><rect x="-10" y="6" width="26" height="54" rx="12" fill="#6aa9ff" stroke="${PLUM}" stroke-width="5"/><path d="M-44 -22 h64 a18 18 0 0 1 18 18 v10 a18 18 0 0 1 -18 18 h-64 z" fill="#ff7fb7" stroke="${PLUM}" stroke-width="5" stroke-linejoin="round"/><rect x="-54" y="-18" width="14" height="40" rx="5" fill="#8a5a8a" stroke="${PLUM}" stroke-width="4"/><circle cx="10" cy="0" r="5" fill="#fff" opacity=".7"/></g>`,
  hand: `<text font-size="58" text-anchor="middle">👆</text>`,
};
