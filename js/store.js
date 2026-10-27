// Everything the game remembers. Lives in localStorage on the tablet (no accounts, no servers).
// If storage is blocked (private mode) the game still works for the session.
import { SPECIES_ORDER, STICKERS } from './data.js';

const KEY = 'pmm.v1';

const fresh = () => ({
  v: 1,
  unlocked: ['puppy'],
  pets: [], // { id, name, look, created, fed }
  stickers: [],
  stats: { feeds: 0 },
  draft: null, // unfinished makeover { look, step, wish, done }
  settings: { sfx: true, music: true, voice: true, lite: null }, // lite: null = decide from the device
});

let state = fresh();
try {
  const raw = localStorage.getItem(KEY);
  if (raw) state = { ...fresh(), ...JSON.parse(raw) };
  state.settings = { ...fresh().settings, ...state.settings };
} catch (e) {
  /* storage unavailable: keep in-memory state */
}

export const get = () => state;

export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    /* ignore */
  }
}

export const isUnlocked = (sp) => state.unlocked.includes(sp);

export function unlock(sp) {
  if (!state.unlocked.includes(sp)) {
    state.unlocked.push(sp);
    save();
    return true;
  }
  return false;
}

export const nextLocked = () => SPECIES_ORDER.find((s) => !isUnlocked(s));

export function addPet(name, look) {
  const pet = { id: 'pet' + Date.now().toString(36) + Math.floor(Math.random() * 1000), name, look, created: Date.now() };
  state.pets.push(pet);
  save();
  return pet;
}

export const getPet = (id) => state.pets.find((p) => p.id === id);

export function updatePet(id, patch) {
  const p = getPet(id);
  if (p) {
    Object.assign(p, patch);
    save();
  }
}

export function deletePet(id) {
  state.pets = state.pets.filter((p) => p.id !== id);
  save();
}

export function setDraft(d) {
  state.draft = d;
  save();
}

// ---- stickers --------------------------------------------------------------
const rewardQueue = [];

export const hasSticker = (id) => state.stickers.includes(id);

// Returns true if newly earned. Newly earned stickers are queued for the next popup.
export function earn(id) {
  if (!STICKERS.some((s) => s.id === id) || state.stickers.includes(id)) return false;
  state.stickers.push(id);
  rewardQueue.push(id);
  save();
  return true;
}

export function takeRewards() {
  return rewardQueue.splice(0, rewardQueue.length);
}

// ---- settings --------------------------------------------------------------
export function setSetting(k, v) {
  state.settings[k] = v;
  save();
}

// ---- backup ----------------------------------------------------------------
// A plain text code a grown-up can paste into Notes / email, then paste back after a tablet swap.
export function exportCode() {
  const json = JSON.stringify({ ...state, draft: null });
  return 'PMM1:' + btoa(unescape(encodeURIComponent(json)));
}

export function importCode(code) {
  try {
    const t = code.trim();
    if (!t.startsWith('PMM1:')) return false;
    const data = JSON.parse(decodeURIComponent(escape(atob(t.slice(5)))));
    if (!data || !Array.isArray(data.pets) || !Array.isArray(data.unlocked)) return false;
    state = { ...fresh(), ...data, draft: null };
    state.settings = { ...fresh().settings, ...state.settings };
    save();
    return true;
  } catch (e) {
    return false;
  }
}

export function resetAll() {
  state = fresh();
  save();
}
