# ChooseCarefully

A browser-based card-battle game built with vanilla HTML, CSS, and JavaScript —
no frameworks, no build step, no dependencies. Pick a team of 3 fighters, each
with a choice of two passive abilities, and battle it out against an AI
opponent — or survive as many of 50 escalating waves as you can in Wave Mode.

## Play it

Open [`index.html`](index.html) directly in a modern browser — no install or
build step required.

For the smoothest experience (some browsers restrict audio/autoplay slightly
differently under `file://`), you can instead serve the folder with any static
file server, for example:

```bash
npx serve .
# or
python -m http.server 8000
```

then visit the printed local URL.

## Features

- **12 playable classes**, each with two selectable passives and a unique
  ultimate ability: Tank, Bruiser, Support, Mage, Assassin, Marksman, Death
  Knight, Joker, Druid, Rider, Necromancer, Shaman.
- **Classic mode** — pick 3 cards, reveal both teams, and battle a single AI
  opponent to the death.
- **Wave Mode** — pick your team once and survive 50 waves of escalating AI
  enemies (Peon, Knight, Wizard, Champion, Dart-Peon, Demon, and a Dragon
  boss), collecting loot and permanent upgrades every 10 waves.
- **Deep passive interactions** — shields, poison, burn, lifesteal, mounts,
  summons, and more, all designed to interact with each other in specific,
  intentional ways.
- Animated attacks, floating damage numbers, a battle log, and a full
  in-game rulebook (via the menu).
- Adjustable music/SFX volume, persisted between sessions.

## Project structure

```
index.html       Screens and markup — no game logic
style.css         All visual styling
script.js         All game logic (classes, combat, wave mode, UI, audio)
Images/           Character art, icons, and animation frames
Sounds/           Music and sound effects
```

There's intentionally no build tooling — everything runs directly in the
browser from these files.

## License

- **Source code** (`index.html`, `style.css`, `script.js`) is **All Rights
  Reserved** — see [LICENSE](LICENSE). It's public for portfolio/viewing
  purposes; reuse requires permission.
- **Artwork and sounds** (`Images/`, `Sounds/`) are licensed under
  **CC BY 4.0** — free to use, even commercially, with attribution. See
  [ASSETS_LICENSE.md](ASSETS_LICENSE.md).

## Credits

Created by **Tony Jansen** (Xinesh) as a portfolio project while learning web
development. Feedback, suggestions, and bug reports are welcome via GitHub
Issues.
