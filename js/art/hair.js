// Hairstyles. Each returns { back, front }: `back` is drawn behind the head, `front` over it.
import { E, C, P, ib, mirror, line } from './shapes.js';
import { darken, lighten } from '../color.js';

// Shared "hair cap" that covers the top of the head with a center part.
const CAP =
  'M104 156 C96 92 146 54 200 54 C254 54 304 92 296 156 C272 124 240 106 200 102 C160 106 128 124 104 156 Z';

export function drawHair(style, ctx) {
  const { hairCol, hairOl, hairHex, ribbon } = ctx;
  const f = (shapes) => ib(shapes, hairCol, 6, hairOl);
  const hi = (d) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="5" stroke-linecap="round"/>`;
  const tie = (cx, cy) => ib(E(cx, cy, 11, 14), ribbon, 5);

  switch (style) {
    case 'bangs':
      return {
        back: '',
        front:
          f(P('M104 160 C96 96 140 54 200 54 C260 54 304 96 296 160 C290 136 284 124 272 116 C262 134 248 136 238 120 C228 138 210 138 200 118 C190 138 172 138 162 120 C152 136 138 134 128 116 C116 124 110 136 104 160 Z')) +
          hi('M140 80 C160 66 180 62 196 62'),
      };
    case 'sweep':
      return {
        back: '',
        front:
          f(P('M100 164 C90 92 146 50 210 54 C264 58 306 98 298 152 C284 122 260 108 230 108 C196 110 150 120 122 152 C112 160 106 164 100 164 Z')) +
          hi('M150 74 C176 62 206 60 232 68'),
      };
    case 'pigtails': {
      const tuft = 'M98 150 C38 150 24 238 52 296 C68 326 106 308 102 266 C100 230 120 192 128 160 Z';
      return {
        back: f(P(tuft) + mirror(P(tuft))),
        front: f(P(CAP)) + tie(100, 152) + tie(300, 152) + hi('M142 80 C162 68 184 64 200 66'),
      };
    }
    case 'ponytail':
      return {
        back: '',
        front:
          f(P(CAP)) +
          f(P('M196 68 C214 20 266 6 298 42 C326 76 308 132 274 146 C288 112 280 74 248 64 C232 60 214 68 206 76 Z')) +
          ib(E(202, 70, 16, 12), ribbon, 5) +
          hi('M142 80 C162 68 184 64 200 66'),
      };
    case 'buns':
      return {
        back: '',
        front:
          f(C(126, 62, 34) + C(274, 62, 34)) +
          hi('M104 52 C110 40 124 36 136 38') +
          ib(E(130, 92, 20, 8, -20) + E(270, 92, 20, 8, 20), ribbon, 4) +
          f(P(CAP)) +
          hi('M142 84 C162 72 184 68 200 70'),
      };
    case 'puff':
      return {
        back: '',
        front:
          f(
            C(122, 104, 34) + C(158, 76, 36) + C(200, 64, 38) + C(242, 76, 36) + C(278, 104, 34) + C(100, 142, 24) + C(300, 142, 24)
          ) + hi('M176 52 C190 44 206 44 220 50'),
      };
    case 'long':
      return {
        back: f(
          P('M92 150 C36 190 34 330 66 402 C86 434 132 412 128 370 L130 250 L270 250 L272 370 C268 412 314 434 334 402 C366 330 364 190 308 150 Z')
        ),
        front: f(P(CAP)) + hi('M138 82 C160 68 184 64 200 66') + hi('M72 250 C70 300 76 340 86 372'),
      };
    default:
      return { back: '', front: '' };
  }
}
