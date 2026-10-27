# My Pet Makeover

A makeover game for kids 3 to 7. Pick an animal friend, give it a bubble bath, brush and blow dry its fur, pick a hairstyle and fur color, paint its nails, dress it up, name it, and let it loose in the meadow where you can feed it, hug it, or restyle it later.

Built for non-readers: everything is icons, big tap targets, and a friendly voice. No timers, no failing, no ads, no accounts, no data leaves the tablet.

## Play it

It's a plain web app (no build step). Any static host works.

```
python3 -m http.server 8000     # then open http://localhost:8000
```

On the tablet, open the link in Chrome, then menu > **Add to Home screen** (or **Install app**). It runs full screen and works offline after the first load.

### Deploy on Render (static site, free)

1. Render dashboard > **New** > **Static Site** > connect this repo.
2. Build command: *(leave empty)*. Publish directory: `.`
3. Deploy. Every push to the branch you choose redeploys, and the tablet picks up updates next time it's online.

(`render.yaml` in the repo does the same thing as a Blueprint.)

## What's in the game

| Screen | What it does |
| --- | --- |
| Pick | 5 animals: puppy, tiger cub, bunny, unicorn, monkey. Only the puppy starts unlocked. |
| Coloring | Color every part of a locked animal's outline to unlock it. |
| Makeover | 6 steps: bath, brush + blow dry, hair/eyes, fur color + pattern, nails, dress-up. Each step is optional to finish (tap the arrow any time). |
| Wishes | Each makeover the pet "wishes" for a fur color and an item (the thought bubble). Granting them earns bonus stars. |
| Show-off | Dance, confetti, stars, then name the pet (tap a suggestion or use the ABC keyboard). |
| Meadow | All finished pets wander here. Tap one: feed, hug, or restyle. |
| Stickers | 22 stickers to collect. |

Grown-ups: **hold the small gear on the home screen for 2.5 seconds**. You can mute sound, switch on Smoother mode for slow tablets, unlock every animal (handy for testing), remove pets, and make or restore a backup.

### If the tablet breaks

Progress lives in the tablet's browser storage. Open the grown-up panel, tap **Copy code**, and paste it into Notes or an email now and then. On a new tablet, paste it into **Restore from code**. (A cloud backup is a good next step. See Roadmap.)

## Project layout

```
index.html            app shell
css/app.css           all styles (sizes are in rem; 1rem = 1/45 of the short screen side)
js/main.js            boot, service worker, Smoother mode
js/router.js          screen switching
js/data.js            species, colors, items, steps, stickers, voice lines  <- most content edits happen here
js/pet.js             builds a pet SVG from a "look" object
js/art/               the drawing code: species.js, hair.js, items.js, stickers.js, shapes.js
js/screens/           home, pick, makeover, showoff, meadow, coloring, stickers, parent
js/steps/             bath, brush, and the tabbed panels (style, color, nails, dress)
js/audio.js           synthesized sound effects, music box loop, voice
js/store.js           saved data (localStorage), stickers, backup codes
dev/sheet.html        art gallery for checking the drawings: dev/sheet.html?mode=defaults|dressed|hair|items|patterns|color
tools/make-icons.mjs  regenerates the app icons from the game's art
```

## Swapping in an artist's drawings

All art is code-drawn vector (the "flat and cute" placeholder style). To replace it later:

- Each pet is built in `js/pet.js` from layers (tail, ears, body, arms, head, face, hair, items) in one shared coordinate space (`viewBox 0 -60 400 560`). An artist can deliver one SVG per layer in that same space and each `draw...` function can simply return `<image>` or `<use>` of their file instead of paths.
- Check changes in `dev/sheet.html` before playing.

## Voice

Voice lines are in `js/data.js` (`VOICE`). Today the tablet's built-in text-to-speech reads them. To use real recordings, drop `audio/voice/<key>.mp3` files in (for example `bath.mp3`) and list the keys in `audio/voice/manifest.json`, like `["bath", "welcome"]`. A recording always wins over text-to-speech, line by line, so you can replace them gradually. See `audio/voice/README.md` for the full list of lines.

## Roadmap ideas

- Cloud backup with a family code (Supabase) so a broken tablet doesn't lose pets.
- Dragon and more animals (add an entry to `SPECIES`, `SPECIES_ORDER`, and a builder in `js/art/species.js`).
- Backgrounds and photo booth poses, mini-games, more clothes.
- Replace code-drawn art with an artist's illustrations.
