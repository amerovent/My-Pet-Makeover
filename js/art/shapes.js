// Small SVG string helpers shared by all the art code.
// All pet art lives in one coordinate space: viewBox "0 -60 400 560".

export const PLUM = '#5b2142';

export const E = (cx, cy, rx, ry, rot = 0) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"${rot ? ` transform="rotate(${rot} ${cx} ${cy})"` : ''}/>`;

export const C = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;

export const P = (d) => `<path d="${d}"/>`;

export const R = (x, y, w, h, r = 0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`;

// Mirror a chunk of markup left/right around the pet's center line (x = 200).
export const mirror = (s) => `<g transform="translate(400 0) scale(-1 1)">${s}</g>`;

export const heartPath = (cx, cy, s) =>
  `M${cx} ${cy + s * 0.95} C${cx - s * 1.7} ${cy - s * 0.1} ${cx - s * 0.8} ${cy - s * 1.25} ${cx} ${cy - s * 0.4} ` +
  `C${cx + s * 0.8} ${cy - s * 1.25} ${cx + s * 1.7} ${cy - s * 0.1} ${cx} ${cy + s * 0.95}Z`;

export const starPath = (cx, cy, R1, r1, n = 5, rot = -90) => {
  let d = '';
  for (let i = 0; i < n * 2; i++) {
    const rad = i % 2 === 0 ? R1 : r1;
    const a = ((rot + (i * 180) / n) * Math.PI) / 180;
    d += `${i ? 'L' : 'M'}${(cx + rad * Math.cos(a)).toFixed(1)} ${(cy + rad * Math.sin(a)).toFixed(1)}`;
  }
  return d + 'Z';
};

// A little 5-petal flower. Used by hats, necklaces and the eye sparkle.
export const flower = (cx, cy, r, petal, center = '#ffe27a', ol = PLUM) => {
  cx = +cx;
  cy = +cy;
  let s = '';
  for (let i = 0; i < 5; i++) {
    const a = ((i * 72 - 90) * Math.PI) / 180;
    s += C((cx + r * 0.95 * Math.cos(a)).toFixed(1), (cy + r * 0.95 * Math.sin(a)).toFixed(1), r * 0.62);
  }
  return (
    `<g fill="${ol}" stroke="${ol}" stroke-width="4" stroke-linejoin="round">${s}${C(cx, cy, r * 0.5)}</g>` +
    `<g fill="${petal}">${s}</g><circle cx="${cx}" cy="${cy}" r="${r * 0.5}" fill="${center}"/>`
  );
};

// Item blob: outline pass then fill pass so overlapping shapes merge into one silhouette.
export const ib = (shapes, fill, lw = 6, ol = PLUM) =>
  `<g fill="${ol}" stroke="${ol}" stroke-width="${lw}" stroke-linejoin="round" stroke-linecap="round">${shapes}</g>` +
  `<g fill="${fill}">${shapes}</g>`;

// Stroked line/curve with an outline underneath.
export const line = (d, w, color, ol = PLUM, extra = '') =>
  `<path d="${d}" fill="none" stroke="${ol}" stroke-width="${w + 6}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
