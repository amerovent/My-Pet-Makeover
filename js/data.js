// All the game's content lives here so adding a species, item, or sticker is a one-spot change.

export const SPECIES_ORDER = ['puppy', 'cat', 'bunny', 'unicorn', 'monkey'];

export const SPECIES = {
  puppy: {
    id: 'puppy', label: 'Puppy', emoji: '🐶',
    fur: '#f0c58c', pattern: 'none', patColor: '#b9794a', eye: '#4a9fe0', hairStyle: 'none', hairColor: '#8a5a3a',
    foods: ['🦴', '🍖'],
  },
  cat: {
    id: 'cat', label: 'Tiger Cub', emoji: '🐯',
    fur: '#f6a640', pattern: 'stripes', patColor: '#5a2d1a', eye: '#4cc07a', hairStyle: 'none', hairColor: '#5a2d1a',
    foods: ['🐟', '🥛'],
  },
  bunny: {
    id: 'bunny', label: 'Bunny', emoji: '🐰',
    fur: '#fffaf5', pattern: 'none', patColor: '#ffb8d6', eye: '#ee6fa5', hairStyle: 'none', hairColor: '#ffb8d6',
    foods: ['🥕', '🥬'],
  },
  unicorn: {
    id: 'unicorn', label: 'Unicorn', emoji: '🦄',
    fur: '#fff3fa', pattern: 'none', patColor: '#ffb8d6', eye: '#8e6be0', hairStyle: 'long', hairColor: 'rainbow',
    foods: ['🍰', '🍎'],
  },
  monkey: {
    id: 'monkey', label: 'Monkey', emoji: '🐵',
    fur: '#b9794a', pattern: 'none', patColor: '#7a5240', eye: '#d9962b', hairStyle: 'none', hairColor: '#4a3a44',
    foods: ['🍌', '🍓'],
  },
};

export const UNIVERSAL_FOODS = ['🍎', '🧁', '🍪', '🍓'];

export const FUR_COLORS = [
  '#fffaf5', '#f6e3c3', '#f0c58c', '#f6a640', '#b9794a', '#7a5240', '#c0c3cf', '#5b5668',
  '#ffb8d6', '#ff7fb7', '#ff9a8b', '#ffe27a', '#9fe8cb', '#8fcaff', '#c4a3ff', '#e3c8ff',
];
export const HAIR_COLORS = [
  'rainbow', '#ff7fb7', '#c4a3ff', '#8fcaff', '#9fe8cb', '#ffe27a', '#f6a640', '#b9794a', '#4a3a44', '#fffaf5', '#ff4d6d',
];
export const EYE_COLORS = ['#35b9b4', '#4a9fe0', '#4cc07a', '#8e6be0', '#ee6fa5', '#d9962b', '#8a5a3a', '#ff5a5a'];
export const NAIL_COLORS = [
  '#ff7fb7', '#ff4d6d', '#c4a3ff', '#6aa9ff', '#35c9b4', '#ffe27a', '#ff9a3d', '#ffffff', '#2d2a35', '#f5c542',
];
export const ACCENT_COLORS = [
  '#ffd24d', '#ff7fb7', '#ff4d6d', '#c4a3ff', '#6aa9ff', '#35c9b4', '#ff9a3d', '#ffffff', '#ff8fd8', '#9fe8cb',
];
export const PATTERNS = ['none', 'spots', 'stripes', 'hearts', 'stars', 'dots'];
export const HAIR_STYLES = ['none', 'bangs', 'sweep', 'pigtails', 'ponytail', 'buns', 'puff', 'long'];

// Dress-up. `def` is the starting accent color for that item.
export const SLOTS = ['outfit', 'hat', 'glasses', 'neck'];
export const SLOT_ICON = { outfit: '👗', hat: '👑', glasses: '🕶️', neck: '🎀' };
export const ITEMS = {
  outfit: [
    { id: 'tee', def: '#ff7fb7' },
    { id: 'dress', def: '#c4a3ff' },
    { id: 'tutu', def: '#ff8fd8' },
    { id: 'overalls', def: '#6aa9ff' },
    { id: 'hoodie', def: '#35c9b4' },
    { id: 'cape', def: '#ff4d6d' },
  ],
  hat: [
    { id: 'crown', def: '#ffd24d' },
    { id: 'bow', def: '#ff7fb7' },
    { id: 'party', def: '#c4a3ff' },
    { id: 'flowers', def: '#ff8fd8' },
    { id: 'beret', def: '#ff4d6d' },
    { id: 'phones', def: '#35c9b4' },
  ],
  glasses: [
    { id: 'round', def: '#ff7fb7' },
    { id: 'heart', def: '#ff4d6d' },
    { id: 'star', def: '#ffd24d' },
    { id: 'shades', def: '#c4a3ff' },
  ],
  neck: [
    { id: 'bowtie', def: '#ff4d6d' },
    { id: 'scarf', def: '#6aa9ff' },
    { id: 'pearls', def: '#ffffff' },
    { id: 'bell', def: '#ff7fb7' },
    { id: 'lei', def: '#ff8fd8' },
  ],
};

export const STEPS = [
  { id: 'bath', icon: '🛁', say: 'bath' },
  { id: 'brush', icon: '🪥', say: 'brush' },
  { id: 'style', icon: '✂️', say: 'style' },
  { id: 'color', icon: '🎨', say: 'color' },
  { id: 'nails', icon: '💅', say: 'nails' },
  { id: 'dress', icon: '👗', say: 'dress' },
];

export const PET_NAMES = [
  'Bella', 'Luna', 'Daisy', 'Coco', 'Mochi', 'Sunny', 'Pepper', 'Honey', 'Peaches', 'Sprinkles', 'Biscuit', 'Pearl',
  'Ziggy', 'Nova', 'Lily', 'Mango', 'Poppy', 'Waffles', 'Cupcake', 'Twinkle', 'Maple', 'Cookie', 'Rosie', 'Pickles',
];

// Voice lines. Key -> what is said. If audio/voice/<key>.mp3 exists (listed in audio/voice/manifest.json),
// the recording plays instead of the built-in voice.
export const VOICE = {
  welcome: 'Hi friends! Let\'s play with pets!',
  pick: 'Pick a friend to make over!',
  locked: 'Color the picture to unlock me!',
  bath: 'Bubble bath time! Scrub, scrub, scrub!',
  rinse: 'Now pop all the bubbles!',
  clean: 'Squeaky clean!',
  brush: 'Let\'s brush that fur! Brush, brush, brush!',
  dry: 'Now blow dry! Move the dryer all around!',
  fluffy: 'So fluffy!',
  style: 'Pick a pretty hairstyle!',
  hairColor: 'Pick a hair color!',
  eyes: 'Pick some sparkly eyes!',
  color: 'Pick a color for the fur!',
  pattern: 'Pick a pattern!',
  nails: 'Time to paint those nails! Tap a paw!',
  dress: 'Now the fun part! Pick something to wear!',
  next: 'Great job! Tap the arrow!',
  tada: 'Ta da! You look amazing!',
  name: 'What is my name?',
  meadow: 'Welcome to the meadow!',
  yum: 'Yum yum yum!',
  hug: 'Aww! Hugs!',
  sticker: 'You got a sticker!',
  unlock: 'You unlocked a new friend!',
  colorPage: 'Tap a part, then tap a color!',
  colorDone: 'Wow! Beautiful!',
  wish: 'Ooh! That\'s just what I wished for!',
};

export const STICKERS = [
  // id, shape, color, how it's earned (informational)
  { id: 'first', shape: 'star', c: '#ffd24d', tip: 'First makeover' },
  { id: 'bath', shape: 'drop', c: '#8fcaff', tip: 'Bubble bath' },
  { id: 'brush', shape: 'heart', c: '#ff7fb7', tip: 'Brush & dry' },
  { id: 'style', shape: 'crown', c: '#c4a3ff', tip: 'Hairstyle' },
  { id: 'color', shape: 'rainbow', c: '#ff9a3d', tip: 'Fur color' },
  { id: 'nails', shape: 'flower', c: '#ff4d6d', tip: 'Nails' },
  { id: 'dress', shape: 'bow', c: '#35c9b4', tip: 'Dress up' },
  { id: 'wishes', shape: 'moon', c: '#ffe27a', tip: 'Granted both wishes' },
  { id: 'friends3', shape: 'paw', c: '#f0a070', tip: '3 friends' },
  { id: 'friends6', shape: 'diamond', c: '#6aa9ff', tip: '6 friends' },
  { id: 'feed1', shape: 'cupcake', c: '#ff8fd8', tip: 'First snack' },
  { id: 'feed10', shape: 'cookie', c: '#d9a066', tip: '10 snacks' },
  { id: 'puppy', shape: 'paw', c: '#f0c58c', species: 'puppy', tip: 'Puppy makeover' },
  { id: 'cat', shape: 'paw', c: '#f6a640', species: 'cat', tip: 'Tiger makeover' },
  { id: 'bunny', shape: 'heart', c: '#ffb8d6', species: 'bunny', tip: 'Bunny makeover' },
  { id: 'unicorn', shape: 'star', c: '#c4a3ff', species: 'unicorn', tip: 'Unicorn makeover' },
  { id: 'monkey', shape: 'flower', c: '#b9794a', species: 'monkey', tip: 'Monkey makeover' },
  { id: 'color_puppy', shape: 'palette', c: '#f0c58c', tip: 'Colored the puppy' },
  { id: 'color_cat', shape: 'palette', c: '#f6a640', tip: 'Colored the tiger' },
  { id: 'color_bunny', shape: 'palette', c: '#ffb8d6', tip: 'Colored the bunny' },
  { id: 'color_unicorn', shape: 'palette', c: '#c4a3ff', tip: 'Colored the unicorn' },
  { id: 'color_monkey', shape: 'palette', c: '#b9794a', tip: 'Colored the monkey' },
];
