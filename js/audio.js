// Sound: synthesized effects (no audio files), a quiet music-box loop, and the voice that talks to the kids.
// Voice lines play from audio/voice/<key>.mp3 when a recording exists (listed in audio/voice/manifest.json),
// otherwise the device's built-in text-to-speech reads the line.
import { get } from './store.js';
import { VOICE } from './data.js';

let ctx = null;
let sfxGain = null;
let musicGain = null;
let noiseBuf = null;

export function initAudio() {
  if (!ctx) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
      sfxGain = ctx.createGain();
      sfxGain.gain.value = 0.9;
      sfxGain.connect(ctx.destination);
      musicGain = ctx.createGain();
      musicGain.gain.value = 0.5;
      musicGain.connect(ctx.destination);
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    } catch (e) {
      ctx = null;
    }
  }
  if (ctx && ctx.state === 'suspended') ctx.resume();
  refreshMusic();
  loadVoices();
}

const on = (k) => get().settings[k];

function tone(f, d = 0.15, { type = 'sine', vol = 0.25, at = 0, slide = 0, dest } = {}) {
  if (!ctx) return;
  const t = ctx.currentTime + at;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f * slide), t + d);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  o.connect(g);
  g.connect(dest || sfxGain);
  o.start(t);
  o.stop(t + d + 0.05);
}

function noise(d = 0.1, { vol = 0.2, at = 0, freq = 2000, q = 1, type = 'bandpass', sweep = 0 } = {}) {
  if (!ctx) return;
  const t = ctx.currentTime + at;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.setValueAtTime(freq, t);
  if (sweep) f.frequency.exponentialRampToValueAtTime(Math.max(60, freq * sweep), t + d);
  f.Q.value = q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  src.connect(f);
  f.connect(g);
  g.connect(sfxGain);
  src.start(t, Math.random() * 0.5);
  src.stop(t + d + 0.05);
}

const rnd = (a, b) => a + Math.random() * (b - a);

const FX = {
  tap: () => tone(660, 0.08, { type: 'triangle', vol: 0.2 }),
  back: () => tone(440, 0.08, { type: 'triangle', vol: 0.2 }),
  pop: () => {
    tone(rnd(480, 820), 0.12, { slide: 0.35, vol: 0.28 });
    noise(0.05, { vol: 0.12, freq: 3000 });
  },
  sparkle: () => [1046, 1318, 1568, 2093].forEach((f, i) => tone(f, 0.18, { type: 'triangle', vol: 0.16, at: i * 0.06 })),
  good: () => [523, 659, 784].forEach((f, i) => tone(f, 0.22, { type: 'triangle', vol: 0.22, at: i * 0.09 })),
  fanfare: () =>
    [523, 659, 784, 1046, 784, 1046, 1318].forEach((f, i) => {
      tone(f, 0.3, { type: 'triangle', vol: 0.22, at: i * 0.13 });
      tone(f / 2, 0.3, { type: 'sine', vol: 0.12, at: i * 0.13 });
    }),
  unlock: () =>
    [392, 523, 659, 784, 1046, 1318, 1568].forEach((f, i) => {
      tone(f, 0.35, { type: 'triangle', vol: 0.22, at: i * 0.1 });
      tone(f * 2, 0.3, { type: 'sine', vol: 0.08, at: i * 0.1 });
    }),
  scrub: () => {
    noise(0.07, { vol: 0.1, freq: rnd(2500, 4000), q: 0.8 });
  },
  brush: () => noise(0.09, { vol: 0.12, freq: rnd(1800, 2600), q: 1.2, sweep: 1.4 }),
  snip: () => {
    noise(0.03, { vol: 0.3, freq: 5000, q: 2 });
    noise(0.03, { vol: 0.3, freq: 5000, q: 2, at: 0.08 });
  },
  munch: () => [0, 0.14, 0.28].forEach((a) => tone(190, 0.08, { type: 'square', vol: 0.1, at: a, slide: 0.6 })),
  boing: () => tone(280, 0.35, { slide: 2.4, vol: 0.25 }),
  whoosh: () => noise(0.35, { vol: 0.22, freq: 500, q: 0.7, sweep: 6 }),
  dryer: () => noise(0.25, { vol: 0.1, freq: 900, q: 0.5, type: 'lowpass' }),
  sticker: () => [784, 988, 1175, 1568].forEach((f, i) => tone(f, 0.4, { type: 'sine', vol: 0.22, at: i * 0.09 })),
  hug: () => [523, 659].forEach((f, i) => tone(f, 0.3, { type: 'sine', vol: 0.2, at: i * 0.12 })),
  paint: () => noise(0.08, { vol: 0.14, freq: 1200, q: 0.9, type: 'lowpass' }),
};

export function sfx(name) {
  if (!ctx || !on('sfx')) return;
  try {
    FX[name] && FX[name]();
  } catch (e) {
    /* ignore */
  }
}

// ---- music box loop --------------------------------------------------------
const SCALE = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
const PATTERN = [0, 2, 4, 2, 3, 1, 2, 0, 0, 2, 4, 5, 4, 2, 3, 1, 2, 4, 5, 4, 3, 2, 1, 0, 2, 3, 4, 2, 3, 1, 0, 0];
let musicTimer = null;
let step = 0;

function bell(f, vol) {
  tone(f, 1.1, { type: 'sine', vol, dest: musicGain });
  tone(f * 2.01, 0.6, { type: 'sine', vol: vol * 0.3, dest: musicGain });
}

function musicTick() {
  if (!ctx || document.hidden) return;
  const f = SCALE[PATTERN[step % PATTERN.length]];
  bell(f, 0.05);
  if (step % 4 === 0) bell(f / 2, 0.04);
  step++;
}

export function refreshMusic() {
  const want = !!ctx && on('music') && on('sfx');
  if (want && !musicTimer) musicTimer = setInterval(musicTick, 560);
  if (!want && musicTimer) {
    clearInterval(musicTimer);
    musicTimer = null;
  }
}

// ---- voice -------------------------------------------------------------------
let voice = null;
let recorded = new Set();
let current = null;

fetch('audio/voice/manifest.json')
  .then((r) => (r.ok ? r.json() : []))
  .then((list) => {
    recorded = new Set(list);
  })
  .catch(() => {});

function loadVoices() {
  if (!('speechSynthesis' in window)) return;
  const vs = speechSynthesis.getVoices();
  if (!vs.length) return;
  const en = vs.filter((v) => /^en[-_]/i.test(v.lang) || /^en$/i.test(v.lang));
  const prefer = [/samantha/i, /aria|jenny|zira/i, /google us english/i, /female/i, /karen|susan|allison|ava|nicky|victoria/i, /en[-_]us/i];
  for (const re of prefer) {
    const m = en.find((v) => re.test(v.name) || re.test(v.lang));
    if (m) {
      voice = m;
      return;
    }
  }
  voice = en[0] || null;
}
if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = loadVoices;

export function stopVoice() {
  try {
    if (current) {
      current.pause();
      current = null;
    }
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  } catch (e) {
    /* ignore */
  }
}

export function speakText(text) {
  if (!on('voice') || !('speechSynthesis' in window)) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (voice) u.voice = voice;
    u.lang = (voice && voice.lang) || 'en-US';
    u.rate = 0.9;
    u.pitch = 1.3;
    speechSynthesis.speak(u);
  } catch (e) {
    /* ignore */
  }
}

export function say(key) {
  if (!on('voice')) return;
  stopVoice();
  if (recorded.has(key)) {
    current = new Audio(`audio/voice/${key}.mp3`);
    current.play().catch(() => speakText(VOICE[key] || ''));
  } else if (VOICE[key]) {
    speakText(VOICE[key]);
  }
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopVoice();
});
