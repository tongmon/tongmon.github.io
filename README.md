# tongmon.github.io

A pixel-art, scroll-driven introduction page for **tongstar**, served from GitHub Pages at <https://tongmon.github.io/>.

The desk scene is drawn in code on a low-resolution canvas and scaled by an integer number of device pixels, so every scene pixel stays square. Scrolling switches the scene between stages (title, day job, game dev, quant) with a dithered wipe, and each stage's monitor content advances with the scroll position.

## Stack

- Vite + TypeScript, no framework
- Canvas 2D for the scene, palette: [ENDESGA 32](https://lospec.com/palette-list/endesga-32)
- [Galmuri](https://github.com/quiple/galmuri) pixel fonts (OFL), split into Latin and Hangul subsets

## Local development

```bash
npm install
npm run dev
```

- `npm run build` typechecks and builds into `dist/`
- `npm run preview` serves the production build locally

Pushing to `main` deploys through `.github/workflows/github_page_deploy.yml`.

## Editing content

| What | Where |
| --- | --- |
| English copy | `src/content/en.ts` |
| Korean copy | `src/content/ko.ts` |
| Links, repos, record times | `src/content/profile.ts` |
| Player (seated, with chair) | `src/assets/sprites/player.png` (+ `player-day.png`), `src/scene/player.ts` |
| Small animated sprites, monitor sprites, icons | `src/scene/art.ts` |
| Furniture and props (PNG, ENDESGA 32) | `src/assets/sprites/` |
| Room layout and furniture placement | `src/scene/room.ts` |
| Stage skies, props and monitor screens | `src/scene/stages.ts` |

Arrays in `en.ts` / `ko.ts` (stages, records, inventory, contacts) line up by index with the facts in `profile.ts`.

## Regenerating assets

The scripts need Python with `fonttools`, `brotli`, `pillow` and `numpy`:

```bash
pip install fonttools brotli pillow numpy
python scripts/subset-fonts.py   # src/assets/fonts/*.woff2 from node_modules/galmuri
python scripts/make-og.py        # public/og.png social preview
python scripts/player-daylight.py  # player-day.png, rerun after editing player.png
```

New props: generate a large pixel-style reference of a single object on a flat magenta (#FF00FF) background (the existing sprites came from Codex image generation), then shrink it onto the scene grid:

```bash
python scripts/prop-to-sprite.py reference.png src/assets/sprites/<name>.png <height>   # or w<width>
```

The old blog lives on the `main-temp` branch.
