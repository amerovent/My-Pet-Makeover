// Tiny color helpers. Everything is hex in, hex out.

export const hex2rgb = (h) => {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export const rgb2hex = (r, g, b) =>
  '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');

export const mix = (a, b, t) => {
  const A = hex2rgb(a);
  const B = hex2rgb(b);
  return rgb2hex(...A.map((v, i) => v + (B[i] - v) * t));
};

export const lighten = (c, t) => mix(c, '#ffffff', t);
export const darken = (c, t) => mix(c, '#000000', t);

// Perceived brightness 0..255, used to pick readable detail colors.
export const luma = (c) => {
  const [r, g, b] = hex2rgb(c);
  return 0.299 * r + 0.587 * g + 0.114 * b;
};
