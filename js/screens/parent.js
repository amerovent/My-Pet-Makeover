// Grown-up panel (opened by holding the gear on the home screen).
import * as store from '../store.js';
import { SPECIES_ORDER } from '../data.js';
import { refreshMusic } from '../audio.js';
import { html, $, $$ } from '../ui.js';

export function openParent(onChange) {
  const modal = html(`<div class="modal parent"><div class="sheet"></div></div>`);
  document.body.appendChild(modal);
  const sheet = $('.sheet', modal);

  const render = () => {
    const s = store.get();
    sheet.innerHTML = `
      <h3>Grown-ups</h3>
      <label class="row"><input type="checkbox" data-k="sfx" ${s.settings.sfx ? 'checked' : ''}> Sound effects</label>
      <label class="row"><input type="checkbox" data-k="music" ${s.settings.music ? 'checked' : ''}> Background music</label>
      <label class="row"><input type="checkbox" data-k="voice" ${s.settings.voice ? 'checked' : ''}> Voice</label>
      <label class="row"><input type="checkbox" data-k="lite" ${document.documentElement.classList.contains('lite') ? 'checked' : ''}> Smoother mode (fewer background animations, for slow tablets)</label>
      <div class="row"><button data-a="unlock">Unlock all animals</button></div>
      <h4>Friends (${s.pets.length})</h4>
      <div class="plist">${s.pets.map((p) => `<span>${p.name} <button data-del="${p.id}" aria-label="remove">✖</button></span>`).join('') || '<em>None yet</em>'}</div>
      <h4>Backup</h4>
      <p class="hint">Copy this code somewhere safe (Notes, email). If the tablet breaks, paste it into the new one.</p>
      <textarea class="code" readonly>${store.exportCode()}</textarea>
      <div class="row"><button data-a="copy">Copy code</button></div>
      <textarea class="paste" placeholder="Paste a backup code here"></textarea>
      <div class="row"><button data-a="restore">Restore from code</button> <span class="msg"></span></div>
      <h4>Danger zone</h4>
      <div class="row"><button class="danger" data-a="reset">Erase everything</button></div>
      <div class="row end"><button class="primary" data-a="close">Done</button></div>`;
  };
  render();

  let resetArmed = false;
  sheet.addEventListener('change', (e) => {
    const k = e.target.dataset.k;
    if (!k) return;
    store.setSetting(k, e.target.checked);
    refreshMusic();
    if (k === 'lite' && window.applyLite) window.applyLite();
  });
  sheet.addEventListener('click', async (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    const msg = $('.msg', sheet);
    if (b.dataset.del) {
      store.deletePet(b.dataset.del);
      render();
      onChange && onChange();
    } else if (b.dataset.a === 'unlock') {
      SPECIES_ORDER.forEach((s) => store.unlock(s));
      b.textContent = 'Unlocked!';
    } else if (b.dataset.a === 'copy') {
      const ta = $('.code', sheet);
      ta.select();
      try { await navigator.clipboard.writeText(ta.value); } catch (err) { document.execCommand && document.execCommand('copy'); }
      b.textContent = 'Copied!';
    } else if (b.dataset.a === 'restore') {
      const ok = store.importCode($('.paste', sheet).value);
      msg.textContent = ok ? 'Restored!' : 'That code did not work.';
      if (ok) { render(); onChange && onChange(); }
    } else if (b.dataset.a === 'reset') {
      if (!resetArmed) {
        resetArmed = true;
        b.textContent = 'Tap again to erase everything';
      } else {
        store.resetAll();
        render();
        onChange && onChange();
      }
    } else if (b.dataset.a === 'close') {
      modal.remove();
      onChange && onChange();
    }
  });
}
