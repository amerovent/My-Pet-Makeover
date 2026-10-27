// Regenerates icons/icon.svg from the game's own art, then renders PNGs with Playwright.
//   node tools/make-icons.mjs        (needs playwright; only for maintainers, the PNGs are committed)
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { petSVG, defaultLook } from '../js/pet.js';

const icon = (pad, name) => {
  const size = 512 - pad * 2;
  const inner = petSVG(defaultLook('puppy'), { uid: 'ic' + name })
    .replace(/class="pet [^"]*"/, '')
    .replace(/<g class="mouth-open">.*?<\/g>/s, '')
    .replace(/<ellipse class="shadow"[^>]*\/>/, '')
    .replace(/viewBox="[^"]*"/, `viewBox="20 -30 360 360" x="${pad}" y="${pad}" width="${size}" height="${size}"`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
<defs><linearGradient id="bg${name}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd0e8"/><stop offset="1" stop-color="#ff8fc4"/></linearGradient></defs>
<rect width="512" height="512" fill="url(#bg${name})"/>
<circle cx="90" cy="96" r="22" fill="#fff" opacity=".5"/><circle cx="430" cy="140" r="14" fill="#fff" opacity=".5"/><circle cx="410" cy="430" r="30" fill="#fff" opacity=".4"/>
${inner}
</svg>`;
};

writeFileSync(new URL('../icons/icon.svg', import.meta.url), icon(20, 'a'));
writeFileSync(new URL('../icons/icon-maskable.svg', import.meta.url), icon(84, 'm'));

const { chromium } = createRequire(import.meta.url)('playwright');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 512, height: 512 } });
for (const [file, out, size] of [['icon.svg', 'icon-512.png', 512], ['icon.svg', 'icon-192.png', 192], ['icon-maskable.svg', 'icon-maskable-512.png', 512]]) {
  await p.setViewportSize({ width: size, height: size });
  await p.goto(new URL('../icons/' + file, import.meta.url).href.replace('file://', 'file://'));
  await p.evaluate((s) => { document.documentElement.style.width = s + 'px'; document.documentElement.style.height = s + 'px'; const svg = document.querySelector('svg'); svg.setAttribute('width', s); svg.setAttribute('height', s); }, size);
  await p.screenshot({ path: new URL('../icons/' + out, import.meta.url).pathname });
}
await b.close();
